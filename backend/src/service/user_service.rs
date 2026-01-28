use crate::infra::db::DbPool;
use crate::prelude::*;
use crate::repo::user_repo::UserRepo;

pub struct UserService<'a> {
    users: UserRepo<'a>,
}

impl<'a> UserService<'a> {
    pub fn new(db: &'a DbPool) -> Self {
        Self {
            users: UserRepo::new(db),
        }
    }
    pub async fn verify_password(&self, _username: &str, _password: &str) -> Result<bool> {
        Ok(true)
    }
}
