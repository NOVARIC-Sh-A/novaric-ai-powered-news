.PHONY: help seed test up down ingest lint

help:
	@echo "NOVARIC® Figurat Politike Pipeline Commands:"
	@echo "  make seed    - Seed 10 real MPs end-to-end with verified PARAGON scores"
	@echo "  make test    - Run full test suite (parsers, scoring, identity resolution)"
	@echo "  make up      - Launch API, workers, and PostgreSQL with Docker Compose"
	@echo "  make down    - Stop all container services"
	@echo "  make ingest  - Run Kuvendi OData, ILDKPKI, and Media ingestion workers"

seed:
	PYTHONPATH=. python3 db/seed_politicians.py

test:
	PYTHONPATH=. python3 -m unittest discover -s tests -p "test_*.py"

up:
	docker compose up -d

down:
	docker compose down

ingest:
	PYTHONPATH=. python3 -c "import asyncio; from ingestion.kuvendi_odata import KuvendiODataWorker; from ingestion.base import IngestionContext; asyncio.run(KuvendiODataWorker().run(IngestionContext()))"
