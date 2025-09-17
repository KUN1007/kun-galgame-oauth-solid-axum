use crate::prelude::*;
use crate::repo::user_repo::UserRepo;
use crate::state::AppState;
use axum::http::{StatusCode, header::AUTHORIZATION};
use axum::response::IntoResponse;
use axum::{
    Json,
    extract::{Path, State},
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
struct StoredUser {
    id: String,
    username: String,
    password_hash: String,
}

#[derive(Serialize)]
pub struct PublicUser {
    pub id: String,
    pub username: String,
    pub email: String,
    pub avatar: Option<String>,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
    pub last_login_at: Option<String>,
}

pub async fn by_id(State(st): State<AppState>, Path(id): Path<String>) -> impl IntoResponse {
    let res = async {
        let repo = UserRepo::new(&st.pg);
        let Some(u) = repo.find_by_id(&id).await? else {
            anyhow::bail!("not_found")
        };
        Ok::<_, anyhow::Error>(PublicUser {
            id: u.id,
            username: u.username,
            email: u.email,
            avatar: u.avatar,
            status: u.status,
            created_at: u.created_at.to_rfc3339(),
            updated_at: u.updated_at.to_rfc3339(),
            last_login_at: u.last_login_at.map(|x| x.to_rfc3339()),
        })
    }
    .await;
    match res {
        Ok(u) => (StatusCode::OK, Json(u)).into_response(),
        Err(_) => (StatusCode::NOT_FOUND, "not_found").into_response(),
    }
}

pub async fn me(State(st): State<AppState>, headers: axum::http::HeaderMap) -> impl IntoResponse {
    let token = headers
        .get(AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .and_then(|s| s.strip_prefix("Bearer "))
        .unwrap_or("");
    let sub = match crate::service::token_service::TokenService::verify_access_token(token) {
        Ok(s) => s,
        Err(_) => return (StatusCode::UNAUTHORIZED, "invalid token").into_response(),
    };
    by_id(State(st), Path(sub)).await.into_response()
}
