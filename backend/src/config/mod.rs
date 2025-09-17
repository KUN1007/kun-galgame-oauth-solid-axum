use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub database: DatabaseConfig,
    pub redis: RedisConfig,
    pub security: SecurityConfig,
    pub oauth: OAuthConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RedisConfig {
    pub url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityConfig {
    pub jwt_secret: String,
    pub jwt_algorithm: Option<String>,
    pub jwt_private_key_pem: Option<String>,
    pub jwt_public_key_pem: Option<String>,
    pub jwt_kid: Option<String>,
    pub password_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OAuthConfig {
    pub issuer: String,
    pub access_token_ttl_secs: u64,
    pub refresh_token_ttl_secs: u64,
}

impl AppConfig {
    pub fn load() -> anyhow::Result<Self> {
        let mut builder =
            config::Config::builder().add_source(config::Environment::default().separator("__"));

        if let Ok(path) = std::env::var("APP_CONFIG") {
            builder = builder.add_source(config::File::with_name(&path));
        }

        let cfg = builder.build()?;
        let mut s: Self = cfg.try_deserialize().unwrap_or(AppConfig {
            server: ServerConfig { host: String::new(), port: 0 },
            database: DatabaseConfig { url: String::new() },
            redis: RedisConfig { url: String::new() },
            security: SecurityConfig {
                jwt_secret: String::new(),
                jwt_algorithm: None,
                jwt_private_key_pem: None,
                jwt_public_key_pem: None,
                jwt_kid: None,
                password_hash: String::new(),
            },
            oauth: OAuthConfig { issuer: String::new(), access_token_ttl_secs: 0, refresh_token_ttl_secs: 0 },
        });

        if s.server.host.is_empty() {
            s.server.host = std::env::var("SERVER__HOST").unwrap_or_else(|_| "127.0.0.1".into());
        }
        if s.server.port == 0 {
            s.server.port = std::env::var("SERVER__PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(1314);
        }
        if s.database.url.is_empty() {
            s.database.url = std::env::var("DATABASE__URL")
                .or_else(|_| std::env::var("DATABASE_URL"))
                .unwrap_or_default();
        }
        if s.redis.url.is_empty() {
            s.redis.url = std::env::var("REDIS__URL")
                .or_else(|_| std::env::var("REDIS_URL"))
                .unwrap_or_default();
        }
        if s.security.jwt_secret.is_empty() {
            s.security.jwt_secret = std::env::var("SECURITY__JWT_SECRET")
                .or_else(|_| std::env::var("JWT_SECRET"))
                .unwrap_or_default();
        }
        if s.security.jwt_algorithm.is_none() {
            s.security.jwt_algorithm = std::env::var("SECURITY__JWT_ALG")
                .ok()
                .or_else(|| std::env::var("JWT_ALG").ok())
                .or(Some("HS256".into()));
        }
        if s.security.jwt_private_key_pem.is_none() {
            s.security.jwt_private_key_pem = std::env::var("SECURITY__JWT_PRIVATE_KEY_PEM")
                .ok()
                .or_else(|| std::env::var("JWT_PRIVATE_KEY_PEM").ok());
        }
        if s.security.jwt_public_key_pem.is_none() {
            s.security.jwt_public_key_pem = std::env::var("SECURITY__JWT_PUBLIC_KEY_PEM")
                .ok()
                .or_else(|| std::env::var("JWT_PUBLIC_KEY_PEM").ok());
        }
        if s.security.jwt_kid.is_none() {
            s.security.jwt_kid = std::env::var("SECURITY__JWT_KID")
                .ok()
                .or_else(|| std::env::var("JWT_KID").ok());
        }
        if let Ok(addr) = std::env::var("SERVER_ADDR") {
            if let Some((h, p)) = addr.split_once(':') {
                s.server.host = h.to_string();
                if let Ok(pp) = p.parse() {
                    s.server.port = pp;
                }
            }
        }
        if s.security.password_hash.is_empty() {
            s.security.password_hash = "argon2".into();
        }
        if s.oauth.issuer.is_empty() {
            let from_env = std::env::var("OAUTH__ISSUER").unwrap_or_default();
            s.oauth.issuer = if from_env.is_empty() {
                format!("http://{}:{}", s.server.host, s.server.port)
            } else {
                from_env
            };
        }
        if s.oauth.access_token_ttl_secs == 0 {
            s.oauth.access_token_ttl_secs = 3600;
        }
        if s.oauth.refresh_token_ttl_secs == 0 {
            s.oauth.refresh_token_ttl_secs = 30 * 24 * 3600;
        }
        Ok(s)
    }
}
