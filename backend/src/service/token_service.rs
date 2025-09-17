use crate::config::AppConfig;
use crate::prelude::*;
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation, decode, encode};
use once_cell::sync::OnceCell;
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

static ENCODING: OnceCell<EncodingKey> = OnceCell::new();
static DECODING: OnceCell<DecodingKey> = OnceCell::new();
static ALG: OnceCell<Algorithm> = OnceCell::new();

#[derive(Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
    iat: usize,
    iss: String,
}

pub struct TokenService;

impl TokenService {
    fn init_keys(cfg: &AppConfig) -> Result<()> {
        if ENCODING.get().is_some() {
            return Ok(());
        }
        let alg = match cfg.security.jwt_algorithm.as_deref() {
            Some("RS256") => Algorithm::RS256,
            _ => Algorithm::HS256,
        };
        ALG.set(alg).ok();
        match alg {
            Algorithm::HS256 => {
                let secret = cfg.security.jwt_secret.as_bytes();
                ENCODING.set(EncodingKey::from_secret(secret)).ok();
                DECODING.set(DecodingKey::from_secret(secret)).ok();
            }
            Algorithm::RS256 => {
                let priv_pem = cfg
                    .security
                    .jwt_private_key_pem
                    .as_deref()
                    .ok_or_else(|| anyhow::anyhow!("missing private key"))?;
                let pub_pem = cfg
                    .security
                    .jwt_public_key_pem
                    .as_deref()
                    .ok_or_else(|| anyhow::anyhow!("missing public key"))?;
                ENCODING
                    .set(EncodingKey::from_rsa_pem(priv_pem.as_bytes())?)
                    .ok();
                DECODING
                    .set(DecodingKey::from_rsa_pem(pub_pem.as_bytes())?)
                    .ok();
            }
            _ => unreachable!(),
        }
        Ok(())
    }

    pub fn sign_access_token(sub: &str) -> Result<String> {
        let cfg = AppConfig::load()?;
        Self::sign_access_token_with(&cfg, sub)
    }

    pub fn sign_access_token_with(cfg: &AppConfig, sub: &str) -> Result<String> {
        Self::init_keys(cfg)?;
        let now = SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs() as usize;
        let exp = now + cfg.oauth.access_token_ttl_secs as usize;
        let claims = Claims {
            sub: sub.to_string(),
            iat: now,
            exp,
            iss: cfg.oauth.issuer.clone(),
        };
        let mut header = Header::new(*ALG.get().unwrap());
        if let Some(kid) = &cfg.security.jwt_kid {
            header.kid = Some(kid.clone());
        }
        let token =
            encode(&header, &claims, ENCODING.get().unwrap()).map_err(|e| anyhow::anyhow!(e))?;
        Ok(token)
    }

    pub fn verify_access_token(token: &str) -> Result<String> {
        let cfg = AppConfig::load()?;
        Self::init_keys(&cfg)?;
        let data = decode::<Claims>(
            token,
            DECODING.get().unwrap(),
            &Validation::new(*ALG.get().unwrap()),
        )
        .map_err(|e| anyhow::anyhow!(e))?;
        Ok(data.claims.sub)
    }
}
