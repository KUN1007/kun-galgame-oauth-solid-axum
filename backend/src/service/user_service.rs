use crate::prelude::*;
use crate::repo::user_repo::UserRepo;
use sqlx::PgPool;

pub struct UserService<'a> {
    users: UserRepo<'a>,
}

impl<'a> UserService<'a> {
    pub fn new(pool: &'a PgPool) -> Self {
        Self {
            users: UserRepo::new(pool),
        }
    }
    pub async fn verify_password(&self, _username: &str, _password: &str) -> Result<bool> {
        Ok(true)
    }
}
