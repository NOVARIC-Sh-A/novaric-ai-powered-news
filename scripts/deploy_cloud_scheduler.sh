#!/usr/bin/env bash
# ==============================================================================
# NOVARIC® PARAGON - Cloud Scheduler Provisioning & Deployment Script (P1)
# Provisions weekly Monday 04:00 UTC ingestion job with exponential backoff.
# ==============================================================================
set -euo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-novaric-paragon}"
LOCATION="${GCP_REGION:-europe-west1}"
JOB_NAME="weekly-politicians-ingest"
SCHEDULE="0 4 * * 1"
TIMEZONE="Etc/UTC"
URI="${API_BASE_URL:-https://api.media.novaric.al}/api/v1/politicians/ingest"
AUTH_TOKEN="${OPS_METRICS_AUTH_TOKEN:?Set OPS_METRICS_AUTH_TOKEN}"

echo "=================================================================="
echo "NOVARIC® PARAGON: Provisioning Cloud Scheduler Job: ${JOB_NAME}"
echo "Schedule: ${SCHEDULE} (${TIMEZONE})"
echo "Endpoint: ${URI}"
echo "Project:  ${PROJECT_ID} [${LOCATION}]"
echo "=================================================================="

# Check if job already exists
if gcloud scheduler jobs describe "${JOB_NAME}" --project="${PROJECT_ID}" --location="${LOCATION}" >/dev/null 2>&1; then
  echo "Updating existing Cloud Scheduler job: ${JOB_NAME}..."
  gcloud scheduler jobs update http "${JOB_NAME}" \
    --project="${PROJECT_ID}" \
    --location="${LOCATION}" \
    --schedule="${SCHEDULE}" \
    --time-zone="${TIMEZONE}" \
    --uri="${URI}" \
    --http-method="POST" \
    --headers="Content-Type=application/json,Authorization=Bearer ${AUTH_TOKEN},User-Agent=NOVARIC-CloudScheduler/1.0" \
    --message-body='{"dry_run": false}' \
    --max-retry-attempts=5 \
    --min-backoff="10s" \
    --max-backoff="300s" \
    --max-doublings=5 \
    --attempt-deadline="600s"
else
  echo "Creating new Cloud Scheduler job: ${JOB_NAME}..."
  gcloud scheduler jobs create http "${JOB_NAME}" \
    --project="${PROJECT_ID}" \
    --location="${LOCATION}" \
    --schedule="${SCHEDULE}" \
    --time-zone="${TIMEZONE}" \
    --uri="${URI}" \
    --http-method="POST" \
    --headers="Content-Type=application/json,Authorization=Bearer ${AUTH_TOKEN},User-Agent=NOVARIC-CloudScheduler/1.0" \
    --message-body='{"dry_run": false}' \
    --max-retry-attempts=5 \
    --min-backoff="10s" \
    --max-backoff="300s" \
    --max-doublings=5 \
    --attempt-deadline="600s"
fi

echo "✅ Cloud Scheduler job ${JOB_NAME} provisioned successfully."
