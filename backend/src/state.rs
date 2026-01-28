use crate::config::AppConfig;
use crate::infra::db::DbPool;
use crate::infra::metrics::MetricsRegistry;
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub cfg: Arc<AppConfig>,
    pub db: DbPool,
    pub redis: redis::Client,
    pub metrics: MetricsRegistry,
}

impl AppState {
    pub fn new(
        cfg: AppConfig,
        db: DbPool,
        redis: redis::Client,
        metrics: MetricsRegistry,
    ) -> Self {
        Self {
            cfg: Arc::new(cfg),
            db,
            redis,
            metrics,
        }
    }
}
