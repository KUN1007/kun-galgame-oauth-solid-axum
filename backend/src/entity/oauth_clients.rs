use sea_orm::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "oauth_clients")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: String,
    pub name: String,
    pub secret_hash: Option<String>,
    pub application_type: String,
    pub token_endpoint_auth_method: String,
    pub grant_types: Json,
    pub response_types: Json,
    pub redirect_uris: Json,
    pub post_logout_redirect_uris: Json,
    pub scope: Option<String>,
    pub contacts: Json,
    pub logo_uri: Option<String>,
    pub client_uri: Option<String>,
    pub policy_uri: Option<String>,
    pub tos_uri: Option<String>,
    pub jwks_uri: Option<String>,
    pub jwks: Option<Json>,
    pub subject_type: Option<String>,
    pub sector_identifier_uri: Option<String>,
    pub owner_user_id: Option<Uuid>,
    pub require_pkce: bool,
    pub first_party: bool,
    pub allowed_cors_origins: Json,
    pub client_id_issued_at: DateTimeWithTimeZone,
    pub client_secret_expires_at: Option<DateTimeWithTimeZone>,
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
