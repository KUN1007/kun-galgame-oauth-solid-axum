use crate::infra::db::DbPool;
use crate::prelude::*;

pub struct TokenRepo<'a> {
    pub db: &'a DbPool,
}

impl<'a> TokenRepo<'a> {
    pub fn new(db: &'a DbPool) -> Self {
        Self { db }
    }
    pub async fn store_auth_code(&self, _code: &str) -> Result<()> {
        Ok(())
    }
}
