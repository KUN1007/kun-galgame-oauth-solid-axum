use crate::domain::user::User;
use crate::infra::db::{with_conn, DbPool};
use crate::prelude::*;
use crate::schema::users;
use chrono::{DateTime, Utc};
use diesel::prelude::*;
use diesel::SelectableHelper;
use uuid::Uuid;

#[derive(Debug, Clone, Queryable, Identifiable, Selectable)]
#[diesel(table_name = users)]
pub struct UserRow {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub avatar: Option<String>,
    pub status: String,
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_login_at: Option<DateTime<Utc>>,
}

impl From<UserRow> for User {
    fn from(row: UserRow) -> Self {
        User {
            id: row.id.to_string(),
            username: row.username,
            email: row.email,
            avatar: row.avatar,
            status: row.status,
            password_hash: row.password_hash,
            created_at: row.created_at,
            updated_at: row.updated_at,
            last_login_at: row.last_login_at,
        }
    }
}

#[derive(Insertable)]
#[diesel(table_name = users)]
struct NewUser {
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

pub struct UserRepo<'a> {
    pub db: &'a DbPool,
}

impl<'a> UserRepo<'a> {
    pub fn new(db: &'a DbPool) -> Self {
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
        let new_user = NewUser {
            id,
            username: username.to_owned(),
            email: email.to_owned(),
            avatar: avatar.map(|s| s.to_owned()),
            status: "active".to_string(),
            password_hash: password_hash.to_owned(),
            created_at: now,
            updated_at: now,
            last_login_at: None,
        };
        with_conn(self.db, move |conn| {
            diesel::insert_into(users::table)
                .values(new_user)
                .returning(UserRow::as_returning())
                .get_result(conn)
                .map(User::from)
        })
        .await
    }

    pub async fn find_by_username(&self, username_filter: &str) -> Result<Option<User>> {
        let username = username_filter.to_owned();
        with_conn(self.db, move |conn| {
            users::table
                .filter(users::username.eq(username))
                .select(UserRow::as_select())
                .first::<UserRow>(conn)
                .optional()
                .map(|opt| opt.map(User::from))
        })
        .await
    }

    pub async fn find_by_id(&self, id: &str) -> Result<Option<User>> {
        let uuid = match Uuid::parse_str(id) {
            Ok(u) => u,
            Err(_) => return Ok(None),
        };
        with_conn(self.db, move |conn| {
            users::table
                .find(uuid)
                .select(UserRow::as_select())
                .first::<UserRow>(conn)
                .optional()
                .map(|opt| opt.map(User::from))
        })
        .await
    }

    pub async fn touch_last_login(&self, id: &str) -> Result<()> {
        let uuid = Uuid::parse_str(id)?;
        let now = chrono::Utc::now();
        with_conn(self.db, move |conn| {
            diesel::update(users::table.find(uuid))
                .set((
                    users::last_login_at.eq(Some(now)),
                    users::updated_at.eq(now),
                ))
                .execute(conn)?;
            Ok(())
        })
        .await
    }
}
