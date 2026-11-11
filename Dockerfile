# NOVARIC® media frontend for Cloud Run (novaric-media-frontend, us-west1).
# cloudbuild.yaml and scripts/deploy_frontend_cloudrun.sh build this image from the repo root.
FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pil \
    fonts-croscore \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["npx", "tsx", "server.ts"]
