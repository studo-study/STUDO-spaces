use anyhow::Context;
use redis::aio::ConnectionManager;
use redis::streams::StreamReadReply;
use tracing::info;

pub async fn read_batch(connection: &mut ConnectionManager, count: i32, block: i32) -> anyhow::Result<()> {
    info!("Start reading batch");
    info!("Reading count: {} & Reading block: {}", count, block);

    let stream = std::env::var("REDIS_DOCUMENT_QUEUE_KEY")
        .context("Redis queue key is missing in environment")?;

    let reply: StreamReadReply = redis::cmd("XREADGROUP")
        .arg("GROUP")
        .arg("workers")
        .arg("workers-1")
        .arg("COUNT")
        .arg(count)
        .arg("BLOCK")
        .arg(block)
        .arg("STREAMS")
        .arg(&stream)
        .arg(">")
        .query_async(connection)
        .await
        .context("Reading batch failed")?;

    for key in reply.keys {
        for entry in key.ids {
            info!("entry: {}", entry.id);
        }
    }

    Ok(())
}
