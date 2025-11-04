use crate::prelude::*;
use migration::MigratorTrait;
use sea_orm::{Database, DatabaseConnection};

pub async fn init_db(url: &str) -> Result<DatabaseConnection> {
    let db = Database::connect(url).await?;
    Ok(db)
}

pub async fn migrate(db: &DatabaseConnection) -> Result<()> {
    migration::Migrator::up(db, None).await?;
    Ok(())
}
