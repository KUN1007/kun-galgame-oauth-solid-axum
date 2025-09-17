use crate::state::AppState;
use axum::http::StatusCode;
use axum::response::Redirect;
use axum::{
    Json,
    extract::{Query, State},
    response::IntoResponse,
};
use base64::Engine as _;
use base64::engine::general_purpose::URL_SAFE_NO_PAD as B64URL;
use rand::Rng;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sha2::{Digest, Sha256};

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

#[axum::debug_handler]
pub async fn authorize(
    State(st): State<AppState>,
    Query(q): Query<AuthorizeQuery>,
) -> impl IntoResponse {
    let user_id = std::env::var("DEV_USER_ID")
        .ok()
        .or(q.state.clone())
        .unwrap_or_else(|| "user-1".into());

    if q.client_id.is_empty() || q.redirect_uri.is_empty() || q.response_type != "code" {
        return (StatusCode::BAD_REQUEST, "invalid_request").into_response();
    }

    let code = {
        let mut code_bytes = [0u8; 32];
        let mut rng = rand::rng();
        rng.fill(&mut code_bytes);
        B64URL.encode(code_bytes)
    };

    let payload = json!({
        "client_id": q.client_id,
        "redirect_uri": q.redirect_uri,
        "user_id": user_id,
        "scope": q.scope,
        "code_challenge": q.code_challenge,
        "code_challenge_method": q.code_challenge_method,
    })
    .to_string();

    let mut conn = st.redis.get_multiplexed_tokio_connection().await.unwrap();
    let key = format!("oauth:code:{}", code);
    let _: () = redis::cmd("SETEX")
        .arg(&key)
        .arg(600)
        .arg(payload)
        .query_async(&mut conn)
        .await
        .unwrap();

    let mut redirect = format!("{}?code={}", q.redirect_uri, code);
    if let Some(state) = q.state {
        redirect.push_str(&format!("&state={}", state));
    }
    Redirect::to(&redirect).into_response()
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

#[axum::debug_handler]
pub async fn token(
    State(st): State<AppState>,
    body: axum::extract::Form<TokenForm>,
) -> impl IntoResponse {
    let form = body.0;
    match form.grant_type.as_str() {
        "authorization_code" => {
            let code = match form.code {
                Some(c) => c,
                None => return (StatusCode::BAD_REQUEST, "invalid_request").into_response(),
            };
            let mut conn = st.redis.get_multiplexed_tokio_connection().await.unwrap();
            let key = format!("oauth:code:{}", code);
            let data: Option<String> = redis::cmd("GET")
                .arg(&key)
                .query_async(&mut conn)
                .await
                .unwrap();
            let Some(data) = data else {
                return (StatusCode::BAD_REQUEST, "invalid_grant").into_response();
            };
            let _: () = redis::cmd("DEL")
                .arg(&key)
                .query_async(&mut conn)
                .await
                .unwrap_or(());

            let v: serde_json::Value = serde_json::from_str(&data).unwrap_or_default();
            if let (Some(expected), Some(got)) = (
                v.get("redirect_uri").and_then(|x| x.as_str()),
                form.redirect_uri.as_deref(),
            ) {
                if expected != got {
                    return (StatusCode::BAD_REQUEST, "invalid_grant").into_response();
                }
            }
            if let Some(method) = v.get("code_challenge_method").and_then(|x| x.as_str()) {
                if method.eq_ignore_ascii_case("S256") {
                    let Some(verifier) = form.code_verifier.as_deref() else {
                        return (StatusCode::BAD_REQUEST, "invalid_request").into_response();
                    };
                    let mut hasher = Sha256::new();
                    hasher.update(verifier.as_bytes());
                    let digest = hasher.finalize();
                    let expected = v
                        .get("code_challenge")
                        .and_then(|x| x.as_str())
                        .unwrap_or("");
                    let actual = B64URL.encode(digest);
                    if expected != actual {
                        return (StatusCode::BAD_REQUEST, "invalid_grant").into_response();
                    }
                }
            }

            let ttl = st.cfg.oauth.access_token_ttl_secs;
            let access_token =
                crate::service::token_service::TokenService::sign_access_token("user-1").unwrap();
            let resp = TokenResponse {
                access_token,
                token_type: "Bearer",
                expires_in: ttl,
                refresh_token: None,
            };
            (StatusCode::OK, Json(resp)).into_response()
        }
        _ => (StatusCode::BAD_REQUEST, "unsupported_grant_type").into_response(),
    }
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
