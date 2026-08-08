use tracing::info;

mod schema;
mod pipeline;
mod queue;
mod storage;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    info!("Logging initialized");
    info!("Worker initialized");
}
