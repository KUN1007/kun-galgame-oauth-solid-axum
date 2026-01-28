use crate::prelude::*;
use diesel::pg::PgConnection;
use diesel::r2d2::{ConnectionManager, Pool};

pub type DbPool = Pool<ConnectionManager<PgConnection>>;

pub fn init_db(url: &str) -> Result<DbPool> {
    let manager = ConnectionManager::<PgConnection>::new(url);
    let pool = Pool::builder().build(manager)?;
    Ok(pool)
}

pub async fn migrate(pool: &DbPool) -> Result<()> {
    let pool = pool.clone();
    tokio::task::spawn_blocking(move || -> Result<()> {
        let mut conn = pool.get()?;
        migration::run_migrations(&mut conn).map_err(anyhow::Error::from)?;
        Ok(())
    })
    .await??;
    Ok(())
}

pub async fn with_conn<F, R>(pool: &DbPool, f: F) -> Result<R>
where
    F: FnOnce(&mut PgConnection) -> Result<R> + Send + 'static,
    R: Send + 'static,
{
    let pool = pool.clone();
    tokio::task::spawn_blocking(move || {
        let mut conn = pool.get()?;
        f(&mut conn)
    })
    .await?
}
