use anyhow::Context;
use log::info;
use redis::aio::ConnectionManager;

const GROUP: &str = "workers";

pub async fn ensure_group(connection: &mut ConnectionManager) -> anyhow::Result<()> {
    info!("starting queue");

    //stream key ophalen
    info!("reading STREAM key");
    let stream = std::env::var("REDIS_DOCUMENT_DUEUE_KEY")
        .context("Redis queue key is missing in environment")?;

    tracing::info!("STREAM key loaded");

    //Groep opzetten bij init
    let redis_queue: redis::RedisResult<()> = redis::cmd("XGROUP")
        .arg("CREATE")
        .arg(stream)
        .arg(GROUP)
        .arg("$")
        .arg("MKSTREAM")
        .query_async(connection)
        .await
        .context("failed to read queue")?;

    Ok(())
}
