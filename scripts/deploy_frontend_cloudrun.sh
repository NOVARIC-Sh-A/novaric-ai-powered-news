#!/usr/bin/env bash
# ==============================================================================
# NOVARIC® Frontend Cloud Run Deployment Script
# Builds and deploys the new frontend image to novaric-media-frontend
# ==============================================================================
set -euo pipefail

PROJECT_ID="novaric-ai-powered-news"
REGION="us-west1"
SERVICE_NAME="novaric-media-frontend"
IMAGE_TAG="us-west1-docker.pkg.dev/${PROJECT_ID}/cloud-run-source-deploy/novaric-frontend:v8"

echo "=================================================================="
echo "1. Building new container image: ${IMAGE_TAG}"
echo "=================================================================="
gcloud builds submit \
  --project="${PROJECT_ID}" \
  --tag="${IMAGE_TAG}" .

echo "=================================================================="
echo "2. Deploying revision to Cloud Run service: ${SERVICE_NAME}"
echo "=================================================================="
gcloud run deploy "${SERVICE_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --image="${IMAGE_TAG}" \
  --port=8080 \
  --allow-unauthenticated

echo "=================================================================="
echo "3. Deployment Complete! Checking status..."
echo "=================================================================="
gcloud run services describe "${SERVICE_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --format="value(status.url)"
