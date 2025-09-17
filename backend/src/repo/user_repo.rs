use crate::domain::user::User;
use crate::prelude::*;
use sqlx::{PgPool, FromRow};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(FromRow)]
struct UserRow {
    id: Uuid,
    username: String,
    email: String,
    avatar: Option<String>,
    status: String,
    password_hash: String,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
    last_login_at: Option<DateTime<Utc>>,
}

impl From<UserRow> for User {
    fn from(r: UserRow) -> Self {
        User {
            id: r.id.to_string(),
            username: r.username,
            email: r.email,
            avatar: r.avatar,
            status: r.status,
            password_hash: r.password_hash,
            created_at: r.created_at,
            updated_at: r.updated_at,
            last_login_at: r.last_login_at,
        }
    }
}

pub struct UserRepo<'a> { pub pool: &'a PgPool }

impl<'a> UserRepo<'a> {
    pub fn new(pool: &'a PgPool) -> Self { Self { pool } }

    pub async fn create_user(&self, id: Uuid, username: &str, email: &str, password_hash: &str, avatar: Option<&str>) -> Result<User> {
        let rec: UserRow = sqlx::query_as::<_, UserRow>(
            r#"INSERT INTO users (id, username, email, password_hash, avatar)
               VALUES ($1,$2,$3,$4,$5)
               RETURNING id, username, email, avatar, status, password_hash, created_at, updated_at, last_login_at"#,
        )
        .bind(id)
        .bind(username)
        .bind(email)
        .bind(password_hash)
        .bind(avatar)
        .fetch_one(self.pool)
        .await?;
        Ok(rec.into())
    }

    pub async fn find_by_username(&self, username: &str) -> Result<Option<User>> {
        let opt: Option<UserRow> = sqlx::query_as("SELECT id, username, email, avatar, status, password_hash, created_at, updated_at, last_login_at FROM users WHERE username=$1")
            .bind(username)
            .fetch_optional(self.pool)
            .await?;
        Ok(opt.map(Into::into))
    }

    pub async fn find_by_id(&self, id: &str) -> Result<Option<User>> {
        let uuid = Uuid::parse_str(id).ok();
        if uuid.is_none() { return Ok(None); }
        let opt: Option<UserRow> = sqlx::query_as("SELECT id, username, email, avatar, status, password_hash, created_at, updated_at, last_login_at FROM users WHERE id=$1")
            .bind(uuid.unwrap())
            .fetch_optional(self.pool)
            .await?;
        Ok(opt.map(Into::into))
    }

    pub async fn touch_last_login(&self, id: &str) -> Result<()> {
        let uuid = Uuid::parse_str(id)?;
        sqlx::query("UPDATE users SET last_login_at=now(), updated_at=now() WHERE id=$1")
            .bind(uuid)
            .execute(self.pool)
            .await?;
        Ok(())
    }
}
