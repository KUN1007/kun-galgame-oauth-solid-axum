// @generated automatically by Diesel CLI.

diesel::table! {
    use diesel::sql_types::*;
    use diesel::sql_types::Nullable;
    use diesel::sql_types::Timestamptz;

    users (id) {
        id -> Uuid,
        username -> Text,
        email -> Text,
        avatar -> Nullable<Text>,
        status -> Text,
        password_hash -> Text,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
        last_login_at -> Nullable<Timestamptz>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use diesel::sql_types::Nullable;
    use diesel::sql_types::Timestamptz;

    oauth_clients (id) {
        id -> Text,
        name -> Text,
        secret_hash -> Nullable<Text>,
        application_type -> Text,
        token_endpoint_auth_method -> Text,
        grant_types -> Jsonb,
        response_types -> Jsonb,
        redirect_uris -> Jsonb,
        post_logout_redirect_uris -> Jsonb,
        scope -> Nullable<Text>,
        contacts -> Jsonb,
        logo_uri -> Nullable<Text>,
        client_uri -> Nullable<Text>,
        policy_uri -> Nullable<Text>,
        tos_uri -> Nullable<Text>,
        jwks_uri -> Nullable<Text>,
        jwks -> Nullable<Jsonb>,
        subject_type -> Nullable<Text>,
        sector_identifier_uri -> Nullable<Text>,
        owner_user_id -> Nullable<Uuid>,
        require_pkce -> Bool,
        first_party -> Bool,
        allowed_cors_origins -> Jsonb,
        client_id_issued_at -> Timestamptz,
        client_secret_expires_at -> Nullable<Timestamptz>,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use diesel::sql_types::Nullable;
    use diesel::sql_types::Timestamptz;

    oauth_tokens (access_token) {
        access_token -> Text,
        user_id -> Uuid,
        client_id -> Text,
        scope -> Nullable<Text>,
        created_at -> Timestamptz,
        expires_at -> Timestamptz,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use diesel::sql_types::Nullable;
    use diesel::sql_types::Timestamptz;

    oauth_refresh_tokens (refresh_token) {
        refresh_token -> Text,
        user_id -> Uuid,
        client_id -> Text,
        scope -> Nullable<Text>,
        created_at -> Timestamptz,
        expires_at -> Timestamptz,
    }
}

diesel::joinable!(oauth_clients -> users (owner_user_id));
diesel::joinable!(oauth_refresh_tokens -> oauth_clients (client_id));
diesel::joinable!(oauth_refresh_tokens -> users (user_id));
diesel::joinable!(oauth_tokens -> oauth_clients (client_id));
diesel::joinable!(oauth_tokens -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    oauth_clients,
    oauth_refresh_tokens,
    oauth_tokens,
    users,
);
