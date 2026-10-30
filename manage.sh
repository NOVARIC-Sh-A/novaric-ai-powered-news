#!/usr/bin/env bash
set -e

COMMAND=${1:-test}

case "$COMMAND" in
  seed)
    echo "==> Seeding 10 real Albanian MPs end-to-end..."
    PYTHONPATH=. python3 db/seed_politicians.py
    ;;
  test)
    echo "==> Running NOVARIC® test suite..."
    PYTHONPATH=. python3 -m unittest discover -s tests -p "test_*.py"
    ;;
  ingest)
    echo "==> Running Kuvendi ingestion worker..."
    PYTHONPATH=. python3 -c "import asyncio; from ingestion.kuvendi_odata import KuvendiODataWorker; from ingestion.base import IngestionContext; asyncio.run(KuvendiODataWorker().run(IngestionContext()))"
    ;;
  *)
    echo "Usage: ./manage.sh [seed|test|ingest]"
    exit 1
    ;;
esac
