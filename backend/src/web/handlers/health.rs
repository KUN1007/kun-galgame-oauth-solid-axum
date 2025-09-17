use crate::state::AppState;
use axum::{Json, extract::State};
use serde_json::json;

// health check endpoint
pub async fn healthz(State(_): State<AppState>) -> Json<serde_json::Value> {
    Json(json!({"status":"ok"}))
}
