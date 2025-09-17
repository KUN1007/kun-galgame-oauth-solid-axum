use crate::prelude::*;

pub struct TokenService;

impl TokenService {
    pub fn sign_access_token(_sub: &str) -> Result<String> {
        Ok("signed-token".into())
    }
}
