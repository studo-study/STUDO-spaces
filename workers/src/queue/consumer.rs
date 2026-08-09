use anyhow::Context;
use redis::aio::ConnectionManager;
use redis::streams::StreamReadReply;
use tracing::{info, warn};
use crate::queue::job;

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

pub async fn read_batch(connection: &mut ConnectionManager, count: i32) -> anyhow::Result<()> {
    info!("Start reading batch");
    info!("Reading count: {}", count);

    let stream = std::env::var("REDIS_DOCUMENT_QUEUE_KEY")
        .context("Redis queue key is missing in environment")?;

    let reply: StreamReadReply = redis::cmd("XREADGROUP")
        .arg("GROUP")
        .arg("workers")
        .arg("worker-1")
        .arg("COUNT")
        .arg(count)
        .arg("STREAMS")
        .arg(&stream)
        .arg(">")
        .query_async(connection)
        .await
        .context("Reading batch failed")?;

    for key in reply.keys {
        for entry in key.ids {
            info!("entry: {}", entry.id);
            //omzetten van raw → json
            let raw: String = match entry.get("payload") {
                Some(v) => v,
                None => {
                    warn!(id = %entry.id, "entry without payload");
                    // XACK hier
                    continue;
                }
            };

            if let Err(e) = job::job_handle(&raw) {
                warn!(id = %entry.id, error = %e, "Failed to handle job");
                continue;
            }
        }
        //aanroepen van jobs
    }

    Ok(())
}

async fn ack(connection: &mut ConnectionManager, stream: &str, id: &str) -> anyhow::Result<()> {}