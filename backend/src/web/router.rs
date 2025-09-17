use super::handlers::{health, oauth, well_known};
use crate::infra::metrics::{self, MetricsRegistry};
use crate::state::AppState;
use axum::{
    Router,
    routing::{get, post},
};
use tower_http::trace::TraceLayer;

pub fn build_router(state: AppState, metrics_reg: MetricsRegistry) -> Router {
    let api = Router::new()
        .route("/healthz", get(health::healthz))
        .route(
            "/.well-known/openid-configuration",
            get(well_known::openid_config),
        )
        .route("/oauth/authorize", get(oauth::authorize))
        .route("/oauth/token", post(oauth::token))
        .route("/oauth/userinfo", get(oauth::userinfo))
        .route("/oauth/introspect", post(oauth::introspect))
        .route("/oauth/revoke", post(oauth::revoke));

    Router::new()
        .nest("/api", api)
        .route(
            "/metrics",
            get(move || metrics::serve_with(metrics_reg.clone())),
        )
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}
