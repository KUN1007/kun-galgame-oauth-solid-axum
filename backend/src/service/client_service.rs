use crate::domain::client::ClientPublic;
use crate::prelude::*;
use crate::repo::client_repo::{ClientRepo, NewClient};
use argon2::password_hash::rand_core::OsRng;
use argon2::{
    Argon2, PasswordHash,
    password_hash::{PasswordHasher, PasswordVerifier, SaltString},
};
use base64::Engine as _;
use rand::RngCore;
use sea_orm::DatabaseConnection;
use url::Url;

pub struct ClientService<'a> {
    clients: ClientRepo<'a>,
}

pub struct ClientRegistrationInput {
    pub name: String,
    pub redirect_uris: Vec<String>,
    pub application_type: Option<String>,
    pub token_endpoint_auth_method: Option<String>,
    pub grant_types: Option<Vec<String>>,
    pub response_types: Option<Vec<String>>,
    pub scope: Option<String>,
    pub contacts: Option<Vec<String>>,
    pub logo_uri: Option<String>,
    pub client_uri: Option<String>,
    pub policy_uri: Option<String>,
    pub tos_uri: Option<String>,
    pub jwks_uri: Option<String>,
    pub subject_type: Option<String>,
    pub sector_identifier_uri: Option<String>,
    pub require_pkce: Option<bool>,
    pub first_party: Option<bool>,
    pub allowed_cors_origins: Option<Vec<String>>,
    pub post_logout_redirect_uris: Option<Vec<String>>,
}

impl<'a> ClientService<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self {
            clients: ClientRepo::new(db),
        }
    }

    fn rand_b64url(len: usize) -> String {
        let mut buf = vec![0u8; len];
        rand::rng().fill_bytes(&mut buf);
        base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(buf)
    }

    fn validate_uris(uris: &[String]) -> Result<()> {
        if uris.is_empty() {
            return Err(anyhow::anyhow!("redirect_uris required").into());
        }
        for u in uris {
            let parsed = Url::parse(u).map_err(|e| anyhow::anyhow!(e))?;
            if parsed.scheme() != "https" && parsed.domain() != Some("localhost") {
                // allow http only for localhost during dev
                return Err(
                    anyhow::anyhow!("redirect_uri must be https or localhost: {}", u).into(),
                );
            }
        }
        Ok(())
    }

    pub async fn register(
        &self,
        owner_user_id: Option<String>,
        mut input: ClientRegistrationInput,
    ) -> Result<(ClientPublic, Option<String>)> {
        Self::validate_uris(&input.redirect_uris)?;

        let application_type = input
            .application_type
            .take()
            .unwrap_or_else(|| "web".to_string());
        let token_endpoint_auth_method = input
            .token_endpoint_auth_method
            .take()
            .unwrap_or_else(|| "client_secret_basic".to_string());
        let grant_types = input
            .grant_types
            .take()
            .unwrap_or_else(|| vec!["authorization_code".into(), "refresh_token".into()]);
        let response_types = input
            .response_types
            .take()
            .unwrap_or_else(|| vec!["code".into()]);
        let contacts = input.contacts.take().unwrap_or_default();
        let allowed_cors_origins = input.allowed_cors_origins.take().unwrap_or_default();
        let post_logout_redirect_uris = input.post_logout_redirect_uris.take().unwrap_or_default();
        let require_pkce = input.require_pkce.unwrap_or(true);
        let first_party = input.first_party.unwrap_or(false);

        let client_id = Self::rand_b64url(18);
        let (secret_hash, client_secret) = if token_endpoint_auth_method == "none" {
            (None, None)
        } else {
            let secret = Self::rand_b64url(32);
            let salt = SaltString::generate(&mut OsRng);
            let hash = Argon2::default()
                .hash_password(secret.as_bytes(), &salt)
                .map_err(|e| anyhow::anyhow!(e))?
                .to_string();
            (Some(hash), Some(secret))
        };

        let owner_uuid = match owner_user_id.and_then(|s| uuid::Uuid::parse_str(&s).ok()) {
            Some(u) => Some(u),
            None => None,
        };

        self.clients
            .insert(NewClient {
                id: &client_id,
                name: &input.name,
                secret_hash: secret_hash.as_deref(),
                application_type: &application_type,
                token_endpoint_auth_method: &token_endpoint_auth_method,
                grant_types: &grant_types,
                response_types: &response_types,
                redirect_uris: &input.redirect_uris,
                post_logout_redirect_uris: &post_logout_redirect_uris,
                scope: input.scope.as_deref(),
                contacts: &contacts,
                logo_uri: input.logo_uri.as_deref(),
                client_uri: input.client_uri.as_deref(),
                policy_uri: input.policy_uri.as_deref(),
                tos_uri: input.tos_uri.as_deref(),
                jwks_uri: input.jwks_uri.as_deref(),
                jwks: None,
                subject_type: input.subject_type.as_deref(),
                sector_identifier_uri: input.sector_identifier_uri.as_deref(),
                owner_user_id: owner_uuid,
                require_pkce,
                first_party,
                allowed_cors_origins: &allowed_cors_origins,
                client_secret_expires_at: None,
            })
            .await?;

        let saved = self
            .clients
            .find_by_id(&client_id)
            .await?
            .ok_or_else(|| anyhow::anyhow!("client not found after insert"))?;
        Ok((saved.into(), client_secret))
    }

    pub async fn validate_secret(&self, id: &str, secret: &str) -> Result<bool> {
        let Some(c) = self.clients.find_by_id(id).await? else {
            return Ok(false);
        };
        let Some(hash) = c.secret_hash else {
            return Ok(false);
        };
        let parsed = PasswordHash::new(&hash).map_err(|e| anyhow::anyhow!(e))?;
        Ok(Argon2::default()
            .verify_password(secret.as_bytes(), &parsed)
            .is_ok())
    }

    pub async fn get(&self, id: &str) -> Result<Option<ClientPublic>> {
        Ok(self.clients.find_by_id(id).await?.map(Into::into))
    }
}
