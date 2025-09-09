use axum::{Json, Router, routing::get};
use serde_json::{Value, json};
// use tower_http::services::ServeDir;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "oauth=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app = Router::new()
        // .nest_service("/", ServeDir::new("../frontend/dist"))
        .route("/api/moe", get(moe_handler));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:1314")
        .await
        .unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn moe_handler() -> Json<Value> {
    Json(json!({ "message": "Moe~" }))
}
