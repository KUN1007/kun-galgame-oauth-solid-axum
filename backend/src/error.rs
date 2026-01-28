use thiserror::Error;

pub type Result<T, E = Error> = std::result::Result<T, E>;

#[derive(Debug, Error)]
pub enum Error {
    #[error("database error: {0}")]
    Db(#[from] diesel::result::Error),
    #[error("database pool error: {0}")]
    Pool(#[from] diesel::r2d2::PoolError),
    #[error("redis error: {0}")]
    Redis(#[from] redis::RedisError),
    #[error("config error: {0}")]
    Config(#[from] config::ConfigError),
    #[error("io error: {0}")]
    Io(#[from] std::io::Error),
    #[error("other: {0}")]
    Other(#[from] anyhow::Error),
    #[error("jwt error: {0}")]
    Jwt(#[from] jsonwebtoken::errors::Error),
    #[error("time error: {0}")]
    Time(#[from] std::time::SystemTimeError),
    #[error("uuid error: {0}")]
    Uuid(#[from] uuid::Error),
    #[error("task join error: {0}")]
    Join(#[from] tokio::task::JoinError),
}
