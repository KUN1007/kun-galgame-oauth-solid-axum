use crate::prelude::*;
use crate::repo::client_repo::ClientRepo;
use sqlx::PgPool;

pub struct ClientService<'a> {
    clients: ClientRepo<'a>,
}

impl<'a> ClientService<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self {
            clients: ClientRepo::new(pool),
        }
    }
    pub async fn validate_secret(&self, _id: &str, _secret: &str) -> Result<bool> {
        Ok(true)
    }
}
