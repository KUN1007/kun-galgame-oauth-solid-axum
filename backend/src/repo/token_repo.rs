use crate::prelude::*;
use sea_orm::DatabaseConnection;

pub struct TokenRepo<'a> {
    pub db: &'a DatabaseConnection,
}

impl<'a> TokenRepo<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }
    pub async fn store_auth_code(&self, _code: &str) -> Result<()> {
        Ok(())
    }
}
