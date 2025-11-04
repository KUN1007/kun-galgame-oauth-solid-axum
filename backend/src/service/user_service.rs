use crate::prelude::*;
use crate::repo::user_repo::UserRepo;
use sea_orm::DatabaseConnection;

pub struct UserService<'a> {
    users: UserRepo<'a>,
}

impl<'a> UserService<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self {
            users: UserRepo::new(db),
        }
    }
    pub async fn verify_password(&self, _username: &str, _password: &str) -> Result<bool> {
        Ok(true)
    }
}
