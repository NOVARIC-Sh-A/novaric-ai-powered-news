# NOVARIC® PARAGON Politicians Pipeline — Operational Runbook & Hygiene Guide

**Document ID:** RUNBOOK-PARAGON-POLITICIANS-P0-01  
**Authoritative Live Revision:** `novaric-backend-00226-csv`  
**Known-Good Image Tag:** `novaric-backend:known-good` (pin: `gcr.io/novaric-intelligence/novaric-backend:00226-csv`)  
**Scope:** P0 Infrastructure, Rollback Hygiene, Deactivate-Missing Pass, VIP ID Idempotency, RLS Security, and Card Contract Verification.

---

## 1. Revision History & Rollback Hygiene

### 1.1 Revision Status Matrix

| Revision Name | Deployed Timestamp (UTC) | Traffic Allocation | Health Status | Certified Contract (104 Cards / 10 Fields) | Operational Role |
|:---|:---|:---:|:---:|:---:|:---|
| **`novaric-backend-00226-csv`** | 2026-09-10 14:22:00 | **100%** | **HEALTHY** | **VERIFIED (104 cards, 10 fields)** | **LIVE PRODUCTION & AUTHORITATIVE ROLLBACK TARGET** |
| `novaric-backend-00233-rid` | 2026-09-11 09:15:00 | 0% | REGRESSED | FAILED (Unpinned VIP ID drift, dimension mismatches) | Retired / Defective release |
| `novaric-backend-00237-xof` | 2026-09-11 11:40:00 | 0% | UNVERIFIED (SUSPECT) | UNVERIFIED | Discarded emergency forward-fix; **DO NOT USE FOR ROLLBACK** |

---

### 1.2 Forensic Analysis: Revision Routing & The `00237-xof` Hazard

#### Why Traffic Moved from `00233-rid` to `00226-csv`
On 2026-09-11, revision `00233-rid` was deployed with unpinned VIP ID generation. During Kuvendi ingestion, newly minted IDs collided with the pre-allocated `vip125-vip210` range, corrupting the joining key between `politicians` and `paragon_scores`. The automated health probe detected that `GET /api/v1/politicians/cards` returned degraded card counts (<104) and missing composite scores. Production traffic was immediately rolled back 100% to the verified stable revision: `novaric-backend-00226-csv`.

#### Why Documented Rollback Pointing to `00237-xof` Was Suspect and Hazardous
In Cloud Run, revision numbers increase monotonically (`00226` → `00233` → `00237`). During the incident triage, an engineer deployed a temporary debug container (`00237-xof`) and mistakenly documented it as the "rollback target" because it was the most recently created revision. 

**This was a critical operational flaw:**
1. `00237-xof` was a forward-fix attempt deployed with `--no-traffic`. It was never smoke-tested or verified against the 104-card / 10-required-field contract.
2. Directing rollback traffic to a higher-numbered, unverified revision (`00237-xof`) circumvents change control and risks catastrophic outage.
3. **Operational Rule:** Rollbacks MUST target a proven, previously serving revision with 100% test certification (`00226-csv`), tagged immutably as `novaric-backend:known-good`.

---

### 1.3 Safe Rollback Procedure

When an active release exhibits regressions:

```bash
# 1. Immediately shift 100% traffic back to the certified known-good revision
gcloud run services update-traffic novaric-backend \
  --to-revisions=novaric-backend-00226-csv=100 \
  --region=europe-west1

# 2. Verify traffic and health endpoint
curl -s -f https://novaric-backend-00226-csv.a.run.app/api/health | jq .
curl -s -f https://novaric-backend-00226-csv.a.run.app/api/v1/politicians/cards | jq '.count'
# EXPECTED OUTPUT: 104
```

### 1.4 Safe Deployment Protocol (Zero-Downtime Verification)

Every new deployment **MUST** be deployed with `--no-traffic` first:

```bash
# Step 1: Deploy new revision with 0% traffic
gcloud run deploy novaric-backend \
  --image=gcr.io/novaric-intelligence/novaric-backend:${COMMIT_SHA} \
  --no-traffic \
  --tag=candidate \
  --region=europe-west1

# Step 2: Execute automated contract verification suite on the candidate revision
CANDIDATE_URL=$(gcloud run services describe novaric-backend --format='value(status.traffic[?tag=="candidate"].url)')

# Verify 104 cards and 10 required fields
python3 scripts/verify_politicians_contract.py --url="${CANDIDATE_URL}"

# Step 3: Canary release (10% traffic for 15 minutes)
gcloud run services update-traffic novaric-backend \
  --to-tags=candidate=10

# Step 4: Full traffic migration after 0 errors
gcloud run services update-traffic novaric-backend \
  --to-latest=100
```

---

## 2. Secrets Management & Operational Masking

All backend credentials are provisioned exclusively through Google Cloud Secret Manager.
- **Forbidden:** No secret credentials, API keys, or database passwords may ever be stored in source code, `.env` files, or printed to stdout/stderr.
- **Mandatory Masking:** All logging frameworks (Python `logging` and Node.js `console`) must mask tokens. `OPS_METRICS_AUTH_TOKEN` and `SUPABASE_SERVICE_ROLE_KEY` must appear only as `***MASKED***` or `tok_...[last 4]`.

---

## 3. Deactivate-Missing Pass (MP Status Reconciliation)

The Kuvendi OData feed (`/anetaret`) exposes currently active members with `Status=1`.
- **Pass Rule:** On each scheduled or manual pipeline run, the worker computes the set difference:
  $$\text{Deactivation Candidates} = \text{Active MPs in DB} \setminus \text{Status 1 Members in Latest Kuvendi Fetch}$$
- **Soft Deactivation:**
  - `is_active_mp` is flipped from `True` (1) to `False` (0).
  - `active_until` is populated with the ISO 8601 timestamp of the run.
  - **NEVER HARD-DELETE:** No `DELETE FROM politicians` query is ever permitted. Full historical lineage is preserved.
- **Dry-Run Enforcement:**
  - The pass defaults to `dry_run=True`.
  - In dry-run mode, the pass logs the missing MP IDs and names and generates an audit record, but performs zero database mutations.
  - Only when invoked with explicit `dry_run=False` are the database updates committed.

---

## 4. VIP ID Idempotency & Consumed Range Guardrails

- **Keying Standard:** VIP numeric IDs must be assigned deterministically keyed on the stable Kuvendi Person ID (`raw.Id`).
- **Pre-Allocated / Consumed Range (`vip125` – `vip210`):**
  - Numeric IDs 125 through 210 were consumed by previous batch reconciliations and are permanently allocated.
  - The ID assigner checks existing database records before computing new IDs.
  - Re-running the pipeline $N$ times against the same or overlapping Kuvendi dataset must mint exactly **0 new VIP IDs**.

---

## 5. Architectural Decision: `v_politician_cards` View (Retained & Documented)

### Decision: RETAIN AND FORMALLY DOCUMENT (Do NOT Drop)

**Rationale:**
1. **API Contract Compatibility:** The endpoint `GET /api/v1/politicians/cards` queries `v_politician_cards` directly in production Supabase/PostgreSQL. It performs a single, optimized lateral join between `politicians`, `parties`, and `paragon_scores` to fetch the latest period score in a single query.
2. **Performance:** Eliminates $N+1$ query overhead on high-traffic read operations.
3. **Parity:** A matching SQLite view definition is added to `db/init_db.py` to ensure local tests, offline dev, and production operate on identical query structures.
4. **Security:** Protected by Row Level Security; anonymous users are granted `SELECT` privileges only.

---

## 6. Image Mirroring Operations (`media.novaric.al`)

To protect user privacy, eliminate hotlinking to parliament webservers, and ensure high-availability CDN delivery, all politician photos are mirrored to `https://media.novaric.al/politicians/{id}.jpg`.

### 6.1 Mirroring Strategy & URLs
- **Target URL Pattern:** `https://media.novaric.al/politicians/{id}.jpg` (e.g. `https://media.novaric.al/politicians/vip1.jpg`).
- **Original URL Preservation:** Stored persistently in `politicians.photo_source_url` (and exported in `paragon_scores_export.json`).
- **Documented Missing Photos & "Foto në pritje" Path:**
  - Exactly 2 active MPs in the authoritative 104 card set lack official portrait assets in Kuvendi records:
    1. **`vip106`:** Zija Ismaili (Deputet, PD / Qarku Berat)
    2. **`vip113`:** Redi Muçi (Deputet, Lëvizja BASHKË)
  - **Placeholder Path:** `https://media.novaric.al/politicians/placeholder-pending.jpg` (and `foto-ne-pritje.jpg`).
  - **Status Label:** `"Foto në pritje"` with visual amber badge in `PoliticianCard.tsx`.
- **Target Resolution:** **104/104 profiles fully resolved** (102 mirrored active portraits + 2 documented pending).
- **Idempotency Guarantee:**
  - Running `ImageMirrorWorker.execute_all()` multiple times performs zero unnecessary updates on subsequent runs.
  - Mirrored URLs and source URLs are preserved without mutation on double execution.

---

## 7. Weekly Cloud Scheduler Specification

Ingestion, status reconciliation, deactivation passes, and image mirroring execute weekly on Mondays via Google Cloud Scheduler.

- **Job Name:** `weekly-politicians-ingest`
- **Region:** `europe-west1`
- **Schedule (Cron Spec):** `0 4 * * 1` (Every Monday at 04:00 UTC)
- **Time Zone:** `Etc/UTC`
- **HTTP Target:** `POST https://api.media.novaric.al/api/v1/politicians/ingest`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer ${OPS_METRICS_AUTH_TOKEN}`
  - `User-Agent: NOVARIC-CloudScheduler/1.0`
- **HTTP Body:** `{"dry_run": false}`
- **Retry & Backoff Policy:**
  - `retryCount`: 5
  - `minBackoffDuration`: `10s`
  - `maxBackoffDuration`: `300s`
  - `maxDoublings`: 5
  - `attemptDeadline`: `600s` (10 minutes)
  - `maxRetryDuration`: `1800s` (30 minutes)
- **Provisioning Command:** `scripts/deploy_cloud_scheduler.sh` (or `gcloud scheduler jobs create http`)

---

## 8. Alerting Infrastructure & Signal Handling

The pipeline integrates automated real-time alerting via Cloud Monitoring and Slack Webhooks (`ingestion/alerts.py` & `config/alert_policies_politicians.json`).

### 8.1 Alert Types & Severity
| Alert Type | Trigger Condition | Severity | Action Required |
|:---|:---|:---|:---|
| `INGESTION_FINAL_FAILURE` | Cloud Scheduler attempts exhausted (HTTP 5xx) or fatal worker exception | **CRITICAL** | Page on-call engineer; consult Section 1 (Safe Rollback). |
| `MEMBERSHIP_CHANGE_DETECTED` | Active-MP count deltas materially vs previous run ($N_{\text{current}} \ne N_{\text{previous}}$) | **CRITICAL** | Review Kuvendi mandate gazette; verify MP resignations/substitutions. |
| `IMAGE_MIRROR_DEFECT` | Mirrored photo resolution rate falls below 104/104 target | **WARNING** | Inspect CDN edge / origin storage and verify pending placeholders. |

### 8.2 Material Membership Change Signal
- **Mechanism:** At the end of each run, the worker queries `SELECT active_mp_count FROM ingestion_runs WHERE status = 'ok' ORDER BY started_at DESC LIMIT 1`.
- **Delta Calculation:** $\Delta = N_{\text{current}} - N_{\text{previous}}$.
- **Signal Dispatched:** If $|\Delta| \ge 1$, an automated alert payload is dispatched to `#ops-critical` with the departed or incoming MP IDs, names, delta magnitude, and runbook triage link.

---

## 9. P1 Verification Matrix

| Component | Acceptance Criterion | Test Verification | Status |
|:---|:---|:---|:---:|
| **Image Mirroring** | All photos mapped to `media.novaric.al/politicians/{id}.jpg` | `test_mirrored_url_structure_and_source_retention` | **PASS (104/104)** |
| **Missing Photos** | Exactly 2 documented pending (`vip106`, `vip113`) | `test_documented_missing_photos_resolution` | **PASS (2/2)** |
| **Idempotency** | Re-run produces 0 database/export mutations | `test_image_mirror_idempotency` | **PASS (0 updates)** |
| **Source Preservation** | `photo_source_url` preserved on all records | `test_mirrored_url_structure_and_source_retention` | **PASS (104/104)** |
| **Scheduler Spec** | `0 4 * * 1`, retry=5, backoff 10s–300s | `test_cloud_scheduler_spec_file` | **PASS** |
| **Failure Alerting** | Fatal failure triggers `INGESTION_FINAL_FAILURE` CRITICAL alert | `test_final_failure_alert_trigger` | **PASS** |
| **Membership Delta** | Active MP change triggers `MEMBERSHIP_CHANGE_DETECTED` CRITICAL alert | `test_membership_change_alert_trigger` | **PASS** |
| **Cards Contract** | `GET /api/v1/politicians/cards` schema unchanged (104 cards, 10 required fields) | `test_cards_contract_schema_preserved` & `politiciansCardsContract.test.ts` | **PASS** |
| **CSP Whitelist** | `media.novaric.al` and `*.novaric.al` permitted in `staticwebapp.config.json` | CSP config inspection | **PASS** |

---

## 10. PARAGON Dimension Reconciliation & D1/D2 Refresh Cadence (Stage P2-R)

### 10.1 Live Deployment & Traffic Routing (Stage P2-R)

| Field | Value / State | Notes |
|:---|:---|:---|
| **Live Revision** | `novaric-backend-00242-recon` | Contains referential integrity reconciliation, D1 parser coverage adjustment, D2 declaration counts, and TabPanel crash fix. |
| **Traffic Allocation** | **100%** | Serving all web and API ingress traffic. |
| **Rollback Target** | `novaric-backend-00226-csv` | Pinned authoritative rollback target (`gcr.io/novaric-intelligence/novaric-backend:00226-csv`). |
| **Canary Window** | 30 minutes | Initial 10% canary completed with 0 errors before 100% promotion. |
| **Verification Gate** | All 46 TypeScript tests green, 29 Python tests green, 0 Vite build errors. | Certified referential integrity. |

### 10.2 Refresh Cadence & Cloud Scheduler Architecture

Both empirical dimensions (D1 and D2) run on isolated asynchronous schedulers configured via Google Cloud Scheduler targeting Cloud Run worker jobs:

```
+---------------------------+       +---------------------------+
|    Cloud Scheduler: D1    |       |    Cloud Scheduler: D2    |
|   "paragon-d1-attendance" |       |  "paragon-d2-declarations"|
|     Cron: 0 3 * * *       |       |     Cron: 0 4 * * 0       |
|    (Daily at 03:00 UTC)   |       |   (Weekly Sunday 04:00)   |
+-------------+-------------+       +-------------+-------------+
              |                                   |
              v                                   v
+---------------------------+       +---------------------------+
|  Worker: Attendance OData |       |  Worker: ILDKPKI Scraper  |
|  - Lookback: 7 days       |       |  - Annual & periodic decs |
|  - Concurrency: 1         |       |  - Legal basis: L9049     |
|  - Rate: 0.5s delay       |       |  - Snapshot URL retention |
+-------------+-------------+       +-------------+-------------+
              |                                   |
              +-----------------+-----------------+
                                |
                                v
               +----------------------------------+
               |  SQLite / PostgreSQL:            |
               |  - attendance (absent/present/   |
               |    no_record)                    |
               |  - asset_declarations            |
               |  - paragon_dimension_registry    |
               |    (trigger: updated_at)         |
               |  - paragon_scores (coverage-adj) |
               +----------------------------------+
```

#### D1 (Angazhimi Politik / Parliamentary & Committee Attendance)
- **Schedule:** Daily at 03:00 UTC (`0 3 * * *`).
- **Endpoint:** `POST /api/v1/internal/pipeline/d1-attendance`
- **Source:** Kuvendi i Shqipërisë OData API (`/mbledhjet`).
- **Lookback Window:** 7-day incremental sliding window with 90-day full sync on the 1st of every month.
- **Politeness / Rate Limiting:** 0.5s delay between MP requests, max concurrency = 1.
- **Coverage Handling:** Distinguishes `present`, `absent`, and `no_record`. Normalizes attendance score against available sessions using coverage-adjusted scoring. If coverage = 0, preserves clean `null` with audit status.

#### D2 (Llogaridhënia / Asset Declarations & Wealth Transparency)
- **Schedule:** Weekly on Sundays at 04:00 UTC (`0 4 * * 0`), with daily acceleration in March during the statutory annual declaration window (March 1–31).
- **Endpoint:** `POST /api/v1/internal/pipeline/d2-declarations`
- **Source:** ILDKPKI official registers & published audit gazettes.
- **Audit Basis:** Legal basis under Law Nr. 9049 and Law Nr. 119/2014.
- **Coverage Surface:** Surfaces declaration coverage ratio (`Deklarime: 61/89`) directly on the politician card; maintains `null-with-coverage` for MPs without filed declarations.

### 10.3 Dimension Registry Schema & Automated Triggers

To prevent silent drift and record provenance, `paragon_dimension_registry` enforces an automated trigger:

```sql
CREATE TRIGGER IF NOT EXISTS trg_paragon_dimension_registry_updated_at
AFTER UPDATE ON paragon_dimension_registry
FOR EACH ROW
BEGIN
    UPDATE paragon_dimension_registry 
    SET updated_at = datetime('now')
    WHERE typed_id = OLD.typed_id;
END;
```

Referential integrity between `paragon_dimension_registry`, `standard_clauses`, and `maragon_indicators` is verified at build-time and execution-time via `tests/referential_integrity.test.ts` and `tests/test_referential_integrity.py`.


