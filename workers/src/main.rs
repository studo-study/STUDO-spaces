use anyhow::Context;
use redis::AsyncCommands;
use tracing::info;

mod pipeline;
mod queue;
mod schema;
mod storage;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    //logger initialiseren
    tracing_subscriber::fmt::init();
    info!("Logging initialized");
    info!("Worker initialized");


    //inlezen vn .env
    dotenvy::dotenv().ok();
    let redis_url = std::env::var("REDIS_URL").context("Redis url is missing in environment")?;
    info!("Redis config loaded");


    //redis client ping
    let client = redis::Client::open(redis_url).context("Redis client setup failed")?;
    let mut connection = client
        .get_connection_manager()
        .await
        .context("Connection manager failed")?;
    let pong: String = connection.ping().await.context("Connection failed")?;
    info!("{} , redis reachable", pong);


    //effectieve queue
    queue::ensure_group(&mut connection).await.context("REDIS GROUP failed")?;
    queue::consumer::read_batch(&mut connection, 10, 0).await.context("Queue reading failed")?;

    //gracefull shutdown
    tokio::signal::ctrl_c()
        .await
        .context("catching signal failed")?;
    info!("shutdown signal received");

    Ok(())
}
