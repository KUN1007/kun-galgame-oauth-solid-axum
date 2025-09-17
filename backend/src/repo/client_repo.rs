use crate::domain::client::Client;
use crate::prelude::*;
use sqlx::PgPool;

pub struct ClientRepo<'a> {
    pub pool: &'a PgPool,
}

impl<'a> ClientRepo<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self { pool }
    }
    pub async fn find_by_id(&self, _id: &str) -> Result<Option<Client>> {
        Ok(None)
    }
}
