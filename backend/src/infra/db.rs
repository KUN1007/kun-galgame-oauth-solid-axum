use crate::prelude::*;
use sqlx::{PgPool, postgres::PgPoolOptions};

pub async fn init_pg_pool(url: &str) -> Result<PgPool> {
    let pool = PgPoolOptions::new().max_connections(8).connect(url).await?;
    Ok(pool)
}
