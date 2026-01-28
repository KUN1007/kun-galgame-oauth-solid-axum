use crate::domain::client::Client;
use crate::infra::db::{with_conn, DbPool};
use crate::prelude::*;
use crate::schema::oauth_clients;
use chrono::{DateTime, Utc};
use diesel::prelude::*;
use diesel::SelectableHelper;

pub struct ClientRepo<'a> {
    pub db: &'a DbPool,
}

#[derive(Debug, Clone)]
pub struct NewClient<'a> {
    pub id: &'a str,
    pub name: &'a str,
    pub secret_hash: Option<&'a str>,
    pub application_type: &'a str,
    pub token_endpoint_auth_method: &'a str,
    pub grant_types: &'a [String],
    pub response_types: &'a [String],
    pub redirect_uris: &'a [String],
    pub post_logout_redirect_uris: &'a [String],
    pub scope: Option<&'a str>,
    pub contacts: &'a [String],
    pub logo_uri: Option<&'a str>,
    pub client_uri: Option<&'a str>,
    pub policy_uri: Option<&'a str>,
    pub tos_uri: Option<&'a str>,
    pub jwks_uri: Option<&'a str>,
    pub jwks: Option<&'a serde_json::Value>,
    pub subject_type: Option<&'a str>,
    pub sector_identifier_uri: Option<&'a str>,
    pub owner_user_id: Option<uuid::Uuid>,
    pub require_pkce: bool,
    pub first_party: bool,
    pub allowed_cors_origins: &'a [String],
    pub client_secret_expires_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone, Queryable, Identifiable, Selectable)]
#[diesel(table_name = oauth_clients)]
pub struct ClientRow {
    pub id: String,
    pub name: String,
    pub secret_hash: Option<String>,
    pub application_type: String,
    pub token_endpoint_auth_method: String,
    pub grant_types: serde_json::Value,
    pub response_types: serde_json::Value,
    pub redirect_uris: serde_json::Value,
    pub post_logout_redirect_uris: serde_json::Value,
    pub scope: Option<String>,
    pub contacts: serde_json::Value,
    pub logo_uri: Option<String>,
    pub client_uri: Option<String>,
    pub policy_uri: Option<String>,
    pub tos_uri: Option<String>,
    pub jwks_uri: Option<String>,
    pub jwks: Option<serde_json::Value>,
    pub subject_type: Option<String>,
    pub sector_identifier_uri: Option<String>,
    pub owner_user_id: Option<uuid::Uuid>,
    pub require_pkce: bool,
    pub first_party: bool,
    pub allowed_cors_origins: serde_json::Value,
    pub client_id_issued_at: DateTime<Utc>,
    pub client_secret_expires_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl From<ClientRow> for Client {
    fn from(row: ClientRow) -> Self {
        Client {
            id: row.id,
            name: row.name,
            secret_hash: row.secret_hash,
            application_type: row.application_type,
            token_endpoint_auth_method: row.token_endpoint_auth_method,
            grant_types: json_array_strings(&row.grant_types),
            response_types: json_array_strings(&row.response_types),
            redirect_uris: json_array_strings(&row.redirect_uris),
            post_logout_redirect_uris: json_array_strings(&row.post_logout_redirect_uris),
            scope: row.scope,
            contacts: json_array_strings(&row.contacts),
            logo_uri: row.logo_uri,
            client_uri: row.client_uri,
            policy_uri: row.policy_uri,
            tos_uri: row.tos_uri,
            jwks_uri: row.jwks_uri,
            jwks: row.jwks,
            subject_type: row.subject_type,
            sector_identifier_uri: row.sector_identifier_uri,
            owner_user_id: row.owner_user_id.map(|u| u.to_string()),
            require_pkce: row.require_pkce,
            first_party: row.first_party,
            allowed_cors_origins: json_array_strings(&row.allowed_cors_origins),
            client_id_issued_at: row.client_id_issued_at,
            client_secret_expires_at: row.client_secret_expires_at,
            created_at: row.created_at,
            updated_at: row.updated_at,
        }
    }
}

#[derive(Insertable)]
#[diesel(table_name = oauth_clients)]
struct NewClientInsert {
    id: String,
    name: String,
    secret_hash: Option<String>,
    application_type: String,
    token_endpoint_auth_method: String,
    grant_types: serde_json::Value,
    response_types: serde_json::Value,
    redirect_uris: serde_json::Value,
    post_logout_redirect_uris: serde_json::Value,
    scope: Option<String>,
    contacts: serde_json::Value,
    logo_uri: Option<String>,
    client_uri: Option<String>,
    policy_uri: Option<String>,
    tos_uri: Option<String>,
    jwks_uri: Option<String>,
    jwks: Option<serde_json::Value>,
    subject_type: Option<String>,
    sector_identifier_uri: Option<String>,
    owner_user_id: Option<uuid::Uuid>,
    require_pkce: bool,
    first_party: bool,
    allowed_cors_origins: serde_json::Value,
    client_id_issued_at: DateTime<Utc>,
    client_secret_expires_at: Option<DateTime<Utc>>,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

impl<'a> ClientRepo<'a> {
    pub fn new(db: &'a DbPool) -> Self {
        Self { db }
    }

    pub async fn insert(&self, nc: NewClient<'_>) -> Result<()> {
        let now = chrono::Utc::now();
        let insert = NewClientInsert {
            id: nc.id.to_string(),
            name: nc.name.to_string(),
            secret_hash: nc.secret_hash.map(|s| s.to_string()),
            application_type: nc.application_type.to_string(),
            token_endpoint_auth_method: nc.token_endpoint_auth_method.to_string(),
            grant_types: json_from_slice(nc.grant_types),
            response_types: json_from_slice(nc.response_types),
            redirect_uris: json_from_slice(nc.redirect_uris),
            post_logout_redirect_uris: json_from_slice(nc.post_logout_redirect_uris),
            scope: nc.scope.map(|s| s.to_string()),
            contacts: json_from_slice(nc.contacts),
            logo_uri: nc.logo_uri.map(|s| s.to_string()),
            client_uri: nc.client_uri.map(|s| s.to_string()),
            policy_uri: nc.policy_uri.map(|s| s.to_string()),
            tos_uri: nc.tos_uri.map(|s| s.to_string()),
            jwks_uri: nc.jwks_uri.map(|s| s.to_string()),
            jwks: nc.jwks.cloned(),
            subject_type: nc.subject_type.map(|s| s.to_string()),
            sector_identifier_uri: nc.sector_identifier_uri.map(|s| s.to_string()),
            owner_user_id: nc.owner_user_id,
            require_pkce: nc.require_pkce,
            first_party: nc.first_party,
            allowed_cors_origins: json_from_slice(nc.allowed_cors_origins),
            client_id_issued_at: now,
            client_secret_expires_at: nc.client_secret_expires_at,
            created_at: now,
            updated_at: now,
        };
        with_conn(self.db, move |conn| {
            diesel::insert_into(oauth_clients::table)
                .values(insert)
                .execute(conn)?;
            Ok(())
        })
        .await
    }

    pub async fn list_by_owner(db: &DbPool, owner: uuid::Uuid) -> Result<Vec<Client>> {
        with_conn(db, move |conn| {
            oauth_clients::table
                .filter(oauth_clients::owner_user_id.eq(owner))
                .order(oauth_clients::created_at.desc())
                .select(ClientRow::as_select())
                .load::<ClientRow>(conn)
                .map(|rows| rows.into_iter().map(Client::from).collect())
        })
        .await
    }

    pub async fn find_by_id(&self, id: &str) -> Result<Option<Client>> {
        let id = id.to_owned();
        with_conn(self.db, move |conn| {
            oauth_clients::table
                .find(id)
                .select(ClientRow::as_select())
                .first::<ClientRow>(conn)
                .optional()
                .map(|opt| opt.map(Client::from))
        })
        .await
    }
}

fn json_from_slice(items: &[String]) -> serde_json::Value {
    serde_json::Value::Array(items.iter().map(|s| serde_json::Value::String(s.clone())).collect())
}

fn json_array_strings(v: &serde_json::Value) -> Vec<String> {
    v.as_array()
        .map(|arr| {
            arr.iter()
                .filter_map(|x| x.as_str().map(|s| s.to_string()))
                .collect()
        })
        .unwrap_or_default()
}
