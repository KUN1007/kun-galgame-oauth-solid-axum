use crate::prelude::*;
use crate::repo::{client_repo::ClientRepo, token_repo::TokenRepo};
use sqlx::PgPool;

pub struct OAuthService<'a> {
    clients: ClientRepo<'a>,
    tokens: TokenRepo<'a>,
}

impl<'a> OAuthService<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self {
            clients: ClientRepo::new(pool),
            tokens: TokenRepo::new(pool),
        }
    }
    pub async fn exchange_code(&self, _code: &str) -> Result<String> {
        Ok("access-token".into())
    }
}
