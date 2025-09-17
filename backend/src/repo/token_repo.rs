use crate::prelude::*;
use sqlx::PgPool;

pub struct TokenRepo<'a> {
    pub pool: &'a PgPool,
}

impl<'a> TokenRepo<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self { pool }
    }
    pub async fn store_auth_code(&self, _code: &str) -> Result<()> {
        Ok(())
    }
}
