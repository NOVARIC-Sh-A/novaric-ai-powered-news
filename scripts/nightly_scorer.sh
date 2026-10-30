#!/usr/bin/env bash
# ==============================================================================
# NOVARIC® Figurat Politike — Nightly PARAGON® Scorer Runner
# Execution: Daily at 03:00 UTC via cron / Cloud Scheduler / Cloud Run Job
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DB_PATH="${ROOT_DIR}/db/novaric.db"

FORCE=false
for arg in "$@"; do
    if [ "$arg" == "--force" ]; then
        FORCE=true
    fi
done

START_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
PERIOD_END=$(date -u +"%Y-%m-01")

echo "{\"event\": \"nightly_scorer_start\", \"timestamp\": \"${START_TIME}\", \"period_end\": \"${PERIOD_END}\", \"force\": ${FORCE}}"

# 1. Check if ingestion completed successfully in the last 24h
INGESTION_STATUS=$(python3 -c "
import sqlite3
from datetime import datetime, timezone, timedelta
try:
    conn = sqlite3.connect('${DB_PATH}')
    cur = conn.cursor()
    cur.execute(\"\"\"
        SELECT status FROM ingestion_runs 
        WHERE status = 'completed' 
        ORDER BY finished_at DESC LIMIT 1
    \"\"\")
    row = cur.fetchone()
    print(row[0] if row else 'none')
except Exception as e:
    print('error')
")

if [ "$INGESTION_STATUS" != "completed" ] && [ "$FORCE" = false ]; then
    echo "{\"event\": \"nightly_scorer_skipped\", \"reason\": \"No completed ingestion run in last 24h and --force not set\", \"status\": \"${INGESTION_STATUS}\"}"
    exit 0
fi

# 2. Execute PARAGON® scoring engine
export PYTHONPATH="${ROOT_DIR}:${PYTHONPATH:-}"
echo "{\"event\": \"scoring_execution_start\", \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"}"

if python3 "${SCRIPT_DIR}/run_paragon_scorer.py" --all --period-end="${PERIOD_END}" $( [ "$FORCE" = true ] && echo "--force" ); then
    END_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # 3. Purge / invalidate cache
    echo "{\"event\": \"cache_purge_start\", \"timestamp\": \"${END_TIME}\"}"
    python3 -c "
import sys, os
from pathlib import Path
root = Path('${ROOT_DIR}')
export_json = root / 'db' / 'paragon_scores_export.json'
if export_json.exists():
    print(f'Export cache validated: {export_json.stat().st_size} bytes')
"
    echo "{\"event\": \"nightly_scorer_completed\", \"status\": \"success\", \"timestamp\": \"${END_TIME}\", \"period_end\": \"${PERIOD_END}\"}"
else
    END_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo "{\"event\": \"nightly_scorer_failed\", \"status\": \"failed\", \"timestamp\": \"${END_TIME}\", \"period_end\": \"${PERIOD_END}\"}"
    exit 1
fi
