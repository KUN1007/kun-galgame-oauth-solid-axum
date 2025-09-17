use crate::prelude::*;
use crate::repo::user_repo::UserRepo;
use crate::state::AppState;
use argon2::password_hash::rand_core::OsRng;
use argon2::{
    Argon2, PasswordHash,
    password_hash::{PasswordHasher, PasswordVerifier, SaltString},
};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub username: String,
    pub email: String,
    pub password: String,
    pub avatar: Option<String>,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: PublicUser,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PublicUser {
    pub id: String,
    pub username: String,
    pub email: String,
    pub avatar: Option<String>,
    pub status: String,
}

#[derive(Serialize, Deserialize, Clone)]
struct StoredUser {
    id: String,
    username: String,
    password_hash: String,
}

pub async fn register(
    State(st): State<AppState>,
    Json(req): Json<RegisterRequest>,
) -> impl IntoResponse {
    let res = async {
        if req.username.trim().is_empty() || req.password.len() < 6 {
            anyhow::bail!("invalid username or password length");
        }
        let repo = UserRepo::new(&st.pg);
        if repo.find_by_username(&req.username).await?.is_some() {
            anyhow::bail!("username taken")
        }

        if req.email.trim().is_empty() {
            anyhow::bail!("email required")
        }
        let id = Uuid::new_v4();
        let salt = SaltString::generate(&mut OsRng);
        let hash = Argon2::default()
            .hash_password(req.password.as_bytes(), &salt)
            .map_err(|e| anyhow::anyhow!(e))?
            .to_string();
        let created = repo
            .create_user(id, &req.username, &req.email, &hash, req.avatar.as_deref())
            .await?;
        let token = crate::service::token_service::TokenService::sign_access_token(&created.id)?;
        let resp = AuthResponse {
            token,
            user: PublicUser {
                id: created.id,
                username: created.username,
                email: created.email,
                avatar: created.avatar,
                status: created.status,
            },
        };
        Ok::<_, anyhow::Error>(resp)
    }
    .await;

    match res {
        Ok(resp) => (StatusCode::OK, Json(resp)).into_response(),
        Err(e) => (StatusCode::BAD_REQUEST, e.to_string()).into_response(),
    }
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

pub async fn login(State(st): State<AppState>, Json(req): Json<LoginRequest>) -> impl IntoResponse {
    let res = async {
        let repo = UserRepo::new(&st.pg);
        let Some(stored) = repo.find_by_username(&req.username).await? else {
            anyhow::bail!("invalid credentials")
        };

        let parsed = PasswordHash::new(&stored.password_hash).map_err(|e| anyhow::anyhow!(e))?;
        let verify = Argon2::default()
            .verify_password(req.password.as_bytes(), &parsed)
            .is_ok();
        if !verify {
            anyhow::bail!("invalid credentials")
        }

        let token = crate::service::token_service::TokenService::sign_access_token(&stored.id)?;
        let _ = repo.touch_last_login(&stored.id).await;
        Ok::<_, anyhow::Error>(AuthResponse {
            token,
            user: PublicUser {
                id: stored.id,
                username: stored.username,
                email: stored.email,
                avatar: stored.avatar,
                status: stored.status,
            },
        })
    }
    .await;

    match res {
        Ok(resp) => (StatusCode::OK, Json(resp)).into_response(),
        Err(e) => (StatusCode::UNAUTHORIZED, e.to_string()).into_response(),
    }
}
