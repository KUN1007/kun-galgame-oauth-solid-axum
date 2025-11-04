use crate::domain::client::Client;
use crate::entity::oauth_clients;
use crate::prelude::*;
use chrono::Utc;
use sea_orm::entity::prelude::*;
use sea_orm::{ActiveModelTrait, DatabaseConnection, EntityTrait, QueryOrder, Set};

pub struct ClientRepo<'a> {
    pub db: &'a DatabaseConnection,
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

impl<'a> ClientRepo<'a> {
    pub fn new(db: &'a DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn insert(&self, nc: NewClient<'_>) -> Result<()> {
        let now = chrono::Utc::now();
        let am = oauth_clients::ActiveModel {
            id: Set(nc.id.to_string()),
            name: Set(nc.name.to_string()),
            secret_hash: Set(nc.secret_hash.map(|s| s.to_string())),
            application_type: Set(nc.application_type.to_string()),
            token_endpoint_auth_method: Set(nc.token_endpoint_auth_method.to_string()),
            grant_types: Set(serde_json::json!(nc.grant_types)),
            response_types: Set(serde_json::json!(nc.response_types)),
            redirect_uris: Set(serde_json::json!(nc.redirect_uris)),
            post_logout_redirect_uris: Set(serde_json::json!(nc.post_logout_redirect_uris)),
            scope: Set(nc.scope.map(|s| s.to_string())),
            contacts: Set(serde_json::json!(nc.contacts)),
            logo_uri: Set(nc.logo_uri.map(|s| s.to_string())),
            client_uri: Set(nc.client_uri.map(|s| s.to_string())),
            policy_uri: Set(nc.policy_uri.map(|s| s.to_string())),
            tos_uri: Set(nc.tos_uri.map(|s| s.to_string())),
            jwks_uri: Set(nc.jwks_uri.map(|s| s.to_string())),
            jwks: Set(nc.jwks.cloned()),
            subject_type: Set(nc.subject_type.map(|s| s.to_string())),
            sector_identifier_uri: Set(nc.sector_identifier_uri.map(|s| s.to_string())),
            owner_user_id: Set(nc.owner_user_id),
            require_pkce: Set(nc.require_pkce),
            first_party: Set(nc.first_party),
            allowed_cors_origins: Set(serde_json::json!(nc.allowed_cors_origins)),
            client_id_issued_at: Set(now.into()),
            client_secret_expires_at: Set(nc.client_secret_expires_at.map(|d| d.into())),
            created_at: Set(now.into()),
            updated_at: Set(now.into()),
        };
        let _ = am.insert(self.db).await?;
        Ok(())
    }

    pub async fn list_by_owner(db: &DatabaseConnection, owner: uuid::Uuid) -> Result<Vec<Client>> {
        let rows = oauth_clients::Entity::find()
            .filter(oauth_clients::Column::OwnerUserId.eq(owner))
            .order_by_desc(oauth_clients::Column::CreatedAt)
            .all(db)
            .await?;
        Ok(rows.into_iter().map(model_to_domain).collect())
    }

    pub async fn find_by_id(&self, id: &str) -> Result<Option<Client>> {
        let opt = oauth_clients::Entity::find_by_id(id.to_string())
            .one(self.db)
            .await?;
        Ok(opt.map(model_to_domain))
    }
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

fn model_to_domain(m: oauth_clients::Model) -> Client {
    Client {
        id: m.id,
        name: m.name,
        secret_hash: m.secret_hash,
        application_type: m.application_type,
        token_endpoint_auth_method: m.token_endpoint_auth_method,
        grant_types: json_array_strings(&m.grant_types),
        response_types: json_array_strings(&m.response_types),
        redirect_uris: json_array_strings(&m.redirect_uris),
        post_logout_redirect_uris: json_array_strings(&m.post_logout_redirect_uris),
        scope: m.scope,
        contacts: json_array_strings(&m.contacts),
        logo_uri: m.logo_uri,
        client_uri: m.client_uri,
        policy_uri: m.policy_uri,
        tos_uri: m.tos_uri,
        jwks_uri: m.jwks_uri,
        jwks: m.jwks,
        subject_type: m.subject_type,
        sector_identifier_uri: m.sector_identifier_uri,
        owner_user_id: m.owner_user_id.map(|u| u.to_string()),
        require_pkce: m.require_pkce,
        first_party: m.first_party,
        allowed_cors_origins: json_array_strings(&m.allowed_cors_origins),
        client_id_issued_at: m.client_id_issued_at.with_timezone(&Utc),
        client_secret_expires_at: m.client_secret_expires_at.map(|d| d.with_timezone(&Utc)),
        created_at: m.created_at.with_timezone(&Utc),
        updated_at: m.updated_at.with_timezone(&Utc),
    }
}
