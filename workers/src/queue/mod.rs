use anyhow::Context;
use tracing::{info};
use redis::aio::ConnectionManager;

pub(crate) mod consumer;
mod job;
const GROUP: &str = "workers";

pub async fn ensure_group(connection: &mut ConnectionManager) -> anyhow::Result<()> {
    info!("starting queue");

    //stream key ophalen
    info!("reading STREAM key");
    let stream = std::env::var("REDIS_DOCUMENT_QUEUE_KEY")
        .context("Redis queue key is missing in environment")?;

    info!("STREAM key loaded");

    //Groep opzetten bij init
    let result: redis::RedisResult<()> = redis::cmd("XGROUP")
        .arg("CREATE")
        .arg(&stream)
        .arg(GROUP)
        .arg("$")
        .arg("MKSTREAM")
        .query_async(connection)
        .await;

    match result {
        Ok(_) => {
            info!("XGROUP created");
            Ok(())
        }
        Err(e) if e.code() == Some("BUSYGROUP") => {
            info!("XGROUP already existed");
            Ok(())
        }
        Err(e) => {
            return Err(e).context("XGROUP CREATE failed");
        }
    }


}
