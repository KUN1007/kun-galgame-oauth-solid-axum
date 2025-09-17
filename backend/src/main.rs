mod config;
mod domain;
mod error;
mod infra;
mod prelude;
mod repo;
mod service;
mod state;
mod web;

use crate::infra::{db, metrics, redis, tracing as infra_tracing};
use crate::state::AppState;
use crate::web::router::build_router;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    infra_tracing::init();

    let cfg = config::AppConfig::load()?;

    let pg = db::init_pg_pool(&cfg.database.url).await?;
    db::migrate(&pg).await?;
    let redis = redis::init_redis(&cfg.redis.url).await?;
    let metrics = metrics::init_registry();

    let state = AppState::new(cfg.clone(), pg, redis, metrics.clone());

    let app = build_router(state, metrics);

    let addr = format!("{}:{}", cfg.server.host, cfg.server.port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("listening on {}", addr);
    axum::serve(listener, app).await?;
    Ok(())
}
