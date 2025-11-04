use crate::prelude::*;
use crate::repo::{client_repo::ClientRepo, token_repo::TokenRepo};
use sea_orm::DatabaseConnection;

pub struct OAuthService<'a> {
    clients: ClientRepo<'a>,
    tokens: TokenRepo<'a>,
}

impl<'a> OAuthService<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self {
            clients: ClientRepo::new(db),
            tokens: TokenRepo::new(db),
        }
    }
    pub async fn exchange_code(&self, _code: &str) -> Result<String> {
        Ok("access-token".into())
    }
}
