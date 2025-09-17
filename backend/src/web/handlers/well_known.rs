use axum::Json;
use serde::Serialize;

#[derive(Serialize)]
pub struct OpenIdConfig {
    issuer: String,
    authorization_endpoint: String,
    token_endpoint: String,
    userinfo_endpoint: String,
    jwks_uri: String,
    response_types_supported: [&'static str; 2],
    subject_types_supported: [&'static str; 1],
    id_token_signing_alg_values_supported: [&'static str; 1],
}

pub async fn openid_config() -> Json<OpenIdConfig> {
    let base = "http://localhost:1314";
    Json(OpenIdConfig {
        issuer: base.to_string(),
        authorization_endpoint: format!("{}/api/oauth/authorize", base),
        token_endpoint: format!("{}/api/oauth/token", base),
        userinfo_endpoint: format!("{}/api/oauth/userinfo", base),
        jwks_uri: format!("{}/api/.well-known/jwks.json", base),
        response_types_supported: ["code", "token"],
        subject_types_supported: ["public"],
        id_token_signing_alg_values_supported: ["RS256"],
    })
}

#[derive(Serialize)]
pub struct Jwks {
    pub keys: Vec<serde_json::Value>,
}

pub async fn jwks() -> Json<Jwks> {
    Json(Jwks { keys: vec![] })
}
