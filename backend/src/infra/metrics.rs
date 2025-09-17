use axum::response::IntoResponse;
use prometheus::{Encoder, Registry, TextEncoder};
use std::sync::Arc;

#[derive(Clone)]
pub struct MetricsRegistry(pub Arc<Registry>);

pub fn init_registry() -> MetricsRegistry {
    MetricsRegistry(Arc::new(Registry::new()))
}

async fn metrics_handler(reg: MetricsRegistry) -> impl IntoResponse {
    let encoder = TextEncoder::new();
    let metric_families = reg.0.gather();
    let mut buf = Vec::new();
    encoder
        .encode(&metric_families, &mut buf)
        .unwrap_or_default();
    ([("Content-Type", encoder.format_type().to_string())], buf)
}

pub async fn serve_with(reg: MetricsRegistry) -> impl IntoResponse {
    metrics_handler(reg).await
}
