use thiserror::Error;

pub type Result<T, E = Error> = std::result::Result<T, E>;

#[derive(Debug, Error)]
pub enum Error {
    #[error("database error: {0}")]
    Sqlx(#[from] sqlx::Error),
    #[error("redis error: {0}")]
    Redis(#[from] redis::RedisError),
    #[error("config error: {0}")]
    Config(#[from] config::ConfigError),
    #[error("io error: {0}")]
    Io(#[from] std::io::Error),
    #[error("other: {0}")]
    Other(#[from] anyhow::Error),
}
