use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum GrantType {
    AuthorizationCode,
    RefreshToken,
    ClientCredentials,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthCode {
    pub code: String,
    pub client_id: String,
    pub user_id: String,
    pub redirect_uri: String,
    pub scope: Option<String>,
    pub code_challenge: Option<String>,
}
