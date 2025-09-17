use crate::prelude::*;

pub async fn init_redis(url: &str) -> Result<redis::Client> {
    let client = redis::Client::open(url)?;
    // simple ping to ensure connectivity
    let mut conn = client.get_multiplexed_tokio_connection().await?;
    let _: String = redis::cmd("PING").query_async(&mut conn).await?;
    Ok(client)
}
