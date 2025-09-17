use crate::domain::user::User;
use crate::prelude::*;
use sqlx::PgPool;

pub struct UserRepo<'a> {
    pub pool: &'a PgPool,
}

impl<'a> UserRepo<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self { pool }
    }
    pub async fn find_by_username(&self, _u: &str) -> Result<Option<User>> {
        Ok(None)
    }
}
