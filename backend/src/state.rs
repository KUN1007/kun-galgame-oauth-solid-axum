use crate::config::AppConfig;
use crate::infra::metrics::MetricsRegistry;
use sqlx::PgPool;
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub cfg: Arc<AppConfig>,
    pub pg: PgPool,
    pub redis: redis::Client,
    pub metrics: MetricsRegistry,
}

impl AppState {
    pub fn new(cfg: AppConfig, pg: PgPool, redis: redis::Client, metrics: MetricsRegistry) -> Self {
        Self {
            cfg: Arc::new(cfg),
            pg,
            redis,
            metrics,
        }
    }
}
