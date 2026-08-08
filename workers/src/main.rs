use tracing::info;
use anyhow::Context;
use redis::AsyncCommands;

mod schema;
mod pipeline;
mod queue;
mod storage;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    //logger initialiseren
    tracing_subscriber::fmt::init();
    info!("Logging initialized");
    info!("Worker initialized");

    //inlezen vn .env
    dotenvy::dotenv().ok();
    let redis_url = std::env::var("REDIS_URL")
        .context("Redis url is missing in environment")?;
    info!("Redis config loaded");

    //redis client ping
    let client = redis::Client::open(redis_url)
        .context("Redis client setup failed")?;

    let mut connection = client.get_connection_manager()
        .await
        .context("Connection manager failed")?;

    let pong: String =connection
        .ping()
        .await
        .context("Connection failed")?;

    info!("{} , redis reachable", pong);

    Ok(())



}
