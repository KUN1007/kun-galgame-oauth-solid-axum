use crate::config::AppConfig;
use crate::infra::metrics::MetricsRegistry;
use sea_orm::DatabaseConnection;
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub cfg: Arc<AppConfig>,
    pub db: DatabaseConnection,
    pub redis: redis::Client,
    pub metrics: MetricsRegistry,
}

impl AppState {
    pub fn new(
        cfg: AppConfig,
        db: DatabaseConnection,
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
