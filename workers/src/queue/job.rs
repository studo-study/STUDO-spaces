use anyhow::Context;
use serde::Deserialize;
use tracing::info;
use uuid::Uuid;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParseJob<> {
    pub v: u8,
    pub mime_type: String,
    pub course_id: Uuid,
    pub document_id: Uuid,
    pub r2_key: String,

}

pub fn job_handle(raw: &str) -> anyhow::Result<()> {

    let job: ParseJob = serde_json::from_str(raw).context("failed to receive job")?;
    info!(?job, "job ontvangen");

    Ok(())
}