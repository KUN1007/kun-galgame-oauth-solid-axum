use crate::domain::user::User;
use crate::entity::users;
use crate::prelude::*;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set};
use uuid::Uuid;

pub struct UserRepo<'a> {
    pub db: &'a sea_orm::DatabaseConnection,
}

impl<'a> UserRepo<'a> {
    pub fn new(db: &'a sea_orm::DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn create_user(
        &self,
        id: Uuid,
        username: &str,
        email: &str,
        password_hash: &str,
        avatar: Option<&str>,
    ) -> Result<User> {
        let now = chrono::Utc::now();
        let am = users::ActiveModel {
            id: Set(id),
            username: Set(username.to_string()),
            email: Set(email.to_string()),
            avatar: Set(avatar.map(|s| s.to_string())),
            status: Set("active".to_string()),
            password_hash: Set(password_hash.to_string()),
            created_at: Set(now.into()),
            updated_at: Set(now.into()),
            last_login_at: Set(None),
        };
        let m = am.insert(self.db).await?;
        Ok(User {
            id: m.id.to_string(),
            username: m.username,
            email: m.email,
            avatar: m.avatar,
            status: m.status,
            password_hash: m.password_hash,
            created_at: m.created_at.with_timezone(&chrono::Utc),
            updated_at: m.updated_at.with_timezone(&chrono::Utc),
            last_login_at: m.last_login_at.map(|d| d.with_timezone(&chrono::Utc)),
        })
    }

    pub async fn find_by_username(&self, username: &str) -> Result<Option<User>> {
        let opt = users::Entity::find()
            .filter(users::Column::Username.eq(username))
            .one(self.db)
            .await?;
        Ok(opt.map(|m| User {
            id: m.id.to_string(),
            username: m.username,
            email: m.email,
            avatar: m.avatar,
            status: m.status,
            password_hash: m.password_hash,
            created_at: m.created_at.with_timezone(&chrono::Utc),
            updated_at: m.updated_at.with_timezone(&chrono::Utc),
            last_login_at: m.last_login_at.map(|d| d.with_timezone(&chrono::Utc)),
        }))
    }

    pub async fn find_by_id(&self, id: &str) -> Result<Option<User>> {
        let uuid = match Uuid::parse_str(id) {
            Ok(u) => u,
            Err(_) => return Ok(None),
        };
        let opt = users::Entity::find_by_id(uuid).one(self.db).await?;
        Ok(opt.map(|m| User {
            id: m.id.to_string(),
            username: m.username,
            email: m.email,
            avatar: m.avatar,
            status: m.status,
            password_hash: m.password_hash,
            created_at: m.created_at.with_timezone(&chrono::Utc),
            updated_at: m.updated_at.with_timezone(&chrono::Utc),
            last_login_at: m.last_login_at.map(|d| d.with_timezone(&chrono::Utc)),
        }))
    }

    pub async fn touch_last_login(&self, id: &str) -> Result<()> {
        let uuid = Uuid::parse_str(id)?;
        let now = chrono::Utc::now();
        let am = users::ActiveModel {
            id: Set(uuid),
            last_login_at: Set(Some(now.into())),
            updated_at: Set(now.into()),
            ..Default::default()
        };
        am.update(self.db).await?;
        Ok(())
    }
}
