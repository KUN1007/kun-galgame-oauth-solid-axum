use crate::state::AppState;
use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Deserialize)]
pub struct AuthorizeQuery {
    client_id: String,
    redirect_uri: String,
    response_type: String,
    scope: Option<String>,
    state: Option<String>,
    code_challenge: Option<String>,
    code_challenge_method: Option<String>,
}

pub async fn authorize(State(_): State<AppState>) -> Json<serde_json::Value> {
    Json(json!({"ok":true}))
}

#[derive(Deserialize)]
pub struct TokenForm {
    grant_type: String,
    code: Option<String>,
    redirect_uri: Option<String>,
    client_id: Option<String>,
    client_secret: Option<String>,
    refresh_token: Option<String>,
    code_verifier: Option<String>,
}

#[derive(Serialize)]
pub struct TokenResponse {
    access_token: String,
    token_type: &'static str,
    expires_in: u64,
    refresh_token: Option<String>,
}

pub async fn token(State(st): State<AppState>) -> Json<TokenResponse> {
    let ttl = st.cfg.oauth.access_token_ttl_secs;
    Json(TokenResponse {
        access_token: "demo".into(),
        token_type: "Bearer",
        expires_in: ttl,
        refresh_token: None,
    })
}

#[derive(Serialize)]
pub struct UserInfo {
    sub: String,
    name: String,
}

pub async fn userinfo() -> Json<UserInfo> {
    Json(UserInfo {
        sub: "user-1".into(),
        name: "Kun".into(),
    })
}

#[derive(Deserialize)]
pub struct IntrospectForm {
    token: String,
}

pub async fn introspect() -> Json<serde_json::Value> {
    Json(json!({"active": true}))
}

#[derive(Deserialize)]
pub struct RevokeForm {
    token: String,
}

pub async fn revoke() -> Json<serde_json::Value> {
    Json(json!({"revoked": true}))
}
