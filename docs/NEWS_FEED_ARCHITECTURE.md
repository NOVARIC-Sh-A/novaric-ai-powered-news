# NOVARIC® Operations & News Feed Architecture Specification

**Document Version:** 2.4.0-PROD  
**Status:** Production Ready  
**Last Updated:** 2026-09-11 UTC  
**Target Services:** `services/newsFeedBackend.ts`, `hooks/useNewsFeed.ts`, `components/news/*`

---

## 1. Executive Summary & Page Architecture

The NOVARIC newsfeed at route `/?page=newsList` is an operations-friendly, real-time intelligence radar and archival intelligence engine. The page architecture is strictly partitioned into two operational tiers, anchored to server-derived UTC time to ensure zero client-side clock skew:

- **Section A (`LatestNewsSection`):** High-cadence, live-polling radar displaying breaking developments published within the last 60 minutes.
- **Section B (`ArchiveNewsSection`):** Deep historical archive operating via deterministic cursor-based infinite scroll for articles published > 16 hours ago.
- **Transition Gap (`TransitionGapSection`):** The 1h–16h chronological window between breaking and historical records.

```
+-------------------------------------------------------------------------+
|                        /?page=newsList Container                        |
+-------------------------------------------------------------------------+
| [Section A] LatestNewsSection (Published <= 60m, Polling, Burst Radar) |
+-------------------------------------------------------------------------+
| [Gap] TransitionGapSection (Hidden by Default; 1h–16h On-Demand Toggle) |
+-------------------------------------------------------------------------+
| [Section B] ArchiveNewsSection (Published > 16h, (pubAt, id) Cursor)   |
+-------------------------------------------------------------------------+
```

---

## 2. Requirement Changes: The 1h–16h Transition Gap

### 2.1 Explicit Product & Operations Policy
- **Default Feed Exclusions:** Articles whose `published_at` timestamp falls between 60 minutes and 16 hours (`anchor - 16h <= published_at < anchor - 60m`) are **strictly excluded from Section A and Section B by default**.
- **On-Demand Discovery:** Operations analysts and editorial teams can query this window explicitly via the collapsible `TransitionGapSection` toggle without polluting the high-priority breaking radar or deep archive.
- **Data Isolation:** Items in the transition gap never bleed into Section A or Section B queries. The backend API supports `scope=gap` for direct querying and isolates responses cleanly.

---

## 3. Temporal Windows & Skew Resilience

All window evaluations are derived from server UTC time (`anchorISO`):

| Scope | Window Boundary | Clock Skew Protection | UI Representation |
| :--- | :--- | :--- | :--- |
| **Section A (`latest`)** | `anchor - 60m` to `anchor + 5m` | Up to +5 min future clock skew tolerated from external feeds | Live Radar badge, auto-polling counter |
| **Transition Gap (`gap`)** | `anchor - 16h` to `anchor - 60m` | Closed interval; excluded from A and B unless toggled | Collapsible badge with article counter |
| **Section B (`archive`)** | `< anchor - 16h` | Strictly older than 16 hours | Cursor infinite scroll (`pubAt___id`) |

```typescript
// Shared window formula
const latestStart = new Date(anchorMs - 60 * 60 * 1000);
const latestEnd = new Date(anchorMs + 5 * 60 * 1000);
const gapStart = new Date(anchorMs - 16 * 60 * 60 * 1000);
const gapEnd = latestStart;
const archiveEnd = gapStart;
```

---

## 4. Cursor Stability & Historical Backfill Reconciliation

### 4.1 Primary Cursor Pagination
Archive pagination uses a composite cursor:
$$\text{Cursor} = \text{encodeURIComponent}(publishedAt) + \text{"\_\_\_"} + \text{encodeURIComponent}(id)$$

Sorting order is strictly `published_at DESC, id DESC`. This prevents skipped articles or duplicate records during forward user browsing.

### 4.2 Handling Backfills
**Issue:** If historical records with older `published_at` and lower database IDs are backfilled days after original publication, forward-browsing pagination could omit them if the client has already advanced past that timestamp.

**Mitigations Implemented:**
1. **Database Ingestion Column & Index:** The database migration `20260911_news_published_at_cursor_index.sql` provisions:
   ```sql
   ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS ingested_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());
   CREATE INDEX idx_news_articles_ingested_at ON news_articles (ingested_at DESC, id DESC);
   CREATE INDEX idx_news_articles_backfill_reconciliation ON news_articles (ingested_at DESC, published_at DESC);
   ```
2. **Reconciliation Utility (`reconcileArchiveBackfills`):** Compares `ingested_at` against `published_at`. When `ingested_at - published_at > 24h`, the item is flagged as a backfilled entry.
3. **Periodic Archive Reconciliation Mode:** Ingestion jobs can query recently ingested records (`ingested_at >= now() - 1h`) regardless of `published_at` to ensure new backfills are cataloged into the search index.

---

## 5. Latest Radar Freshness & Versioned Invalidation

### 5.1 The Polling vs. Burst Cache Trade-off
Section A employs a 20–30s cache TTL to protect backend CPU during high concurrency. However, during breaking news events, RSS feeds may deliver bursts of new items within seconds.

### 5.2 Solution: Cache Generation / Versioned Invalidation
Rather than relying purely on TTL expiry:
- A global `cacheGeneration` counter is maintained by `newsFeedBackend.ts`.
- Every cache entry stores its `version: cacheGeneration`.
- When new items are ingested from live RSS feeds or refresh is requested, `bumpNewsFeedIngestVersion()` increments the generation and clears cached radar queries.
- Even if a request arrives at second 5 of a 20s window, a version bump immediately serves fresh ingest data.

---

## 6. Comprehensive Canonical URL Normalization & Deduplication

### 6.1 Canonical URL Normalization Pipeline
Before deduplication, all URLs undergo strict normalization via `normalizeCanonicalUrl(url)`:
1. **Tracking Parameter Stripping:** Removes `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id`, `utm_reader`, `fbclid`, `gclid`, `ref`, `source`, `ocid`, `igshid`, `mkt_tok`, `mc_cid`, `mc_eid`, `_hsenc`, `_hsmi`, `cmpid`, `yclid`, `wickedid`, `msclkid`, `amp`, `outputType`.
2. **Protocol Standardization:** Converts `http://` to `https://` (except local network addresses).
3. **Mobile Subdomain Stripping:** Standardizes `m.domain.com` and `mobile.domain.com` to `domain.com`.
4. **AMP Normalization:** Replaces `amp.domain.com` with `domain.com`, strips `/amp/` and `/amp` path suffixes, and normalizes `.amp.html` to `.html`.
5. **Trailing Slash Removal:** Normalizes `/article/` to `/article`.

### 6.2 Deduplication Key Hierarchy & Collision Resolution
1. **Primary Key:** Normalized Canonical URL.
2. **Secondary Key:** RSS XML `<guid>` / `<id>`.
3. **Syndication Key:** Standardized headline slug + publication date (`synd:YYYY-MM-DD:slug`).
4. **Fallback Key:** Internal item ID.

**Collision Resolution:**
- Prefer item with highest **NER Ecosystem Rating** (authoritative integrity).
- If equal, prefer the newest `publishedAt`.
- Maintain source attribution transparency.

### 6.3 Deduplication Telemetry Counters
The system logs every duplicate collision resolved by category:
- `canonicalUrlWins`
- `ampMobileWins`
- `guidWins`
- `syndicationWins`
- `idFallbackWins`
- `totalDedupeWins`

---

## 7. Image Provenance Monitoring & Fallback Safeguards

### 7.1 Provenance Hierarchy
Image extraction follows a strict order of preference:
1. Structured Feed Media (`media:content`, `media:thumbnail`, `<enclosure>`, `<itunes:image>`) -> `imageProvenance: 'rssFeed'`.
2. Direct image URLs provided in feed attributes -> `imageProvenance: 'rssFeed'`.
3. **Runtime Fallback Only:** On-demand Open Graph scraping (`articleOg`) is used strictly as a secondary fallback.

### 7.2 Over-Reliance Alerting (`ogDominationAlert`)
If the ratio of `articleOg` items exceeds **35%** of all imaged articles (`ogFallbackRatio > 0.35`), the system triggers an operational alert (`ogDominationAlert: true`). This signals that an upstream RSS feed has changed media markup conventions and requires parser re-tuning.

---

## 8. Source Freshness & Per-Source Lag Alerts

To detect silent feed failures (where an outlet stops producing without throwing HTTP errors), the backend computes:
$$\text{Lag Minutes} = \frac{\text{Now} - \max(\text{published\_at}_{\text{source}})}{60 \times 1000}$$

| Category | Healthy | Warning | Critical |
| :--- | :--- | :--- | :--- |
| **National (Albanian)** | $\le 360\text{ min}$ (6h) | $> 360\text{ min}$ (6h) | $> 1440\text{ min}$ (24h) |
| **Regional (Balkan)** | $\le 720\text{ min}$ (12h) | $> 720\text{ min}$ (12h) | $> 1440\text{ min}$ (24h) |
| **International** | $\le 720\text{ min}$ (12h) | $> 720\text{ min}$ (12h) | $> 1440\text{ min}$ (24h) |

---

## 9. Real-Time Operations Telemetry API

Endpoint: `GET /api/v1/news/ops/metrics`  
Payload Specification:
```json
{
  "serverTime": "2026-09-11T14:15:00.000Z",
  "cacheVersion": 4,
  "windowCounts": {
    "latestCount": 18,
    "gapCount": 42,
    "archiveCount": 115,
    "totalCount": 175
  },
  "cacheStats": {
    "latestEntries": 2,
    "archiveEntries": 4,
    "hits": 128,
    "misses": 14,
    "hitRatio": 0.90
  },
  "latencyMetrics": {
    "p50Ms": 12.4,
    "p95Ms": 38.2,
    "p99Ms": 64.0,
    "avgMs": 16.8,
    "totalQueries": 142
  },
  "nerMetrics": {
    "avgScore": 84,
    "p10Score": 72,
    "highCount": 112,
    "mediumCount": 51,
    "lowCount": 12
  },
  "imageProvenanceMetrics": {
    "rssFeedCount": 148,
    "articleOgCount": 18,
    "noneCount": 9,
    "ogFallbackRatio": 0.11,
    "ogDominationAlert": false
  },
  "dedupeTelemetry": {
    "canonicalUrlWins": 14,
    "ampMobileWins": 5,
    "guidWins": 8,
    "syndicationWins": 3,
    "idFallbackWins": 0,
    "totalDedupeWins": 30
  },
  "sourceLagSummary": {
    "healthyCount": 24,
    "warningCount": 2,
    "criticalCount": 0,
    "alerts": [
      {
        "sourceName": "RTSH",
        "sourceType": "albanian",
        "newestPublishedAt": "2026-09-11T12:00:00.000Z",
        "lagMinutes": 135,
        "status": "HEALTHY"
      }
    ]
  },
  "topFeedErrors": []
}
```

---

## 10. Operational Alert Routing & Config-Driven Thresholds

### 10.1 Webhook Alert Targets
Alerts generated by the telemetry engine are automatically formatted and dispatched to configurable endpoints:
- `OPS_ALERT_SLACK_WEBHOOK_URL`: Formats alerts as Slack Block Kit cards with color-coded severity, metrics, threshold comparisons, and direct links to runbook sections.
- `OPS_ALERT_WEBHOOK_URL` / `OPS_ALERT_EMAIL_WEBHOOK_URL`: Delivers JSON payloads to PagerDuty, Datadog, OpsGenie, or internal email webhook relays.

### 10.2 Alert Payload Schema
Each dispatched alert item conforms to the strict production contract:
```typescript
export interface OpsAlertItem {
  id: string;               // Unique alert identifier (e.g., "lag-RTSH-CRITICAL")
  sourceCategory: string;   // e.g. "RTSH (albanian)" or "Media Resolver (Global RSS)"
  severity: 'WARNING' | 'CRITICAL';
  metric: string;           // "Source Ingest Freshness Lag" | "OpenGraph Fallback Ratio"
  currentValue: string;     // e.g., "1480 min (~24.7 hours lag)" or "42%"
  threshold: string;        // e.g., "Critical > 1440m" or "OG Domination > 35%"
  message: string;          // Human-readable diagnostic description
  runbookLink: string;      // Direct link to the incident resolution playbook
  timestamp: string;        // ISO 8601 UTC timestamp
}
```

### 10.3 Config-Driven Thresholds & Environment Declarations
All thresholds are managed dynamically through `/config/newsFeedConfig.ts` without requiring codebase recompilation:

| Environment Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEWS_FRESHNESS_ALBANIAN_WARN_MIN` | Integer | `360` (6h) | Freshness warning threshold for national Albanian feeds |
| `NEWS_FRESHNESS_ALBANIAN_CRIT_MIN` | Integer | `1440` (24h) | Freshness critical threshold for national Albanian feeds |
| `NEWS_FRESHNESS_INTL_WARN_MIN` | Integer | `720` (12h) | Freshness warning threshold for international & regional feeds |
| `NEWS_FRESHNESS_INTL_CRIT_MIN` | Integer | `1440` (24h) | Freshness critical threshold for international & regional feeds |
| `NEWS_OG_DOMINATION_THRESHOLD` | Float | `0.35` (35%) | Alert trigger for excessive secondary OpenGraph image fallback |
| `OPS_ALERT_SLACK_WEBHOOK_URL` | URL | `""` | Incoming webhook URL for Slack operational incident channels |
| `OPS_ALERT_WEBHOOK_URL` | URL | `""` | Webhook URL for incident management or automated email relay |
| `OPS_METRICS_AUTH_TOKEN` | String | `""` | Secret token required for ops endpoints (`x-ops-token` or Bearer) |
| `NEWSFEED_RAMP` / `VITE_NEWSFEED_RAMP` | Enum | `full` | Rollout mode: `off` (disabled), `canary` (10% bucket), `full` (100%) |

### 10.4 Alert Suppression & Severity Escalation Logic
- **Deduplication Window:** Identical alerts for the same source and severity are suppressed for **15 minutes** (`SUPPRESSION_WINDOW_MS = 900000`).
- **Severity Escalation:** If a source deteriorates from `WARNING` to `CRITICAL` within the 15-minute window, the suppression lock is automatically broken and an escalated `CRITICAL` alert is immediately dispatched.
- **Manual Dispatch & Force Override:** The endpoint `POST /api/v1/news/ops/alerts/dispatch?force=true` bypasses suppression for on-demand verification during incident response or post-maintenance smoke testing.

---

## 11. Production Operations Runbook & Maintenance Procedures

### 11.1 Zero-Downtime Index Migration (`CONCURRENTLY`)
When deploying the composite cursor and backfill indexes on production PostgreSQL / Supabase, **never** run index creation inside a standard migration transaction block, as standard `CREATE INDEX` acquires an `ACCESS EXCLUSIVE` table lock that blocks all reader and writer traffic.

#### Pre-Flight Checklist
1. Verify active connection count and replica replication lag:
   ```sql
   SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
   SELECT client_addr, state, replay_lag FROM pg_stat_replication;
   ```
2. Verify available disk space (index requires ~1.5x of target column size during build):
   ```sql
   SELECT pg_size_pretty(pg_total_relation_size('news_articles'));
   ```

#### Execution Steps
Run each statement separately with autocommit enabled:
```sql
-- 1. Ingestion timestamp column with default UTC
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS ingested_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());

-- 2. Primary cursor index (published_at DESC, id DESC) - Non-blocking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_published_cursor 
ON news_articles (published_at DESC, id DESC);

-- 3. Ingestion cursor index for historical reconciliation - Non-blocking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_ingested_at 
ON news_articles (ingested_at DESC, id DESC);

-- 4. Composite index for backfill skew detection - Non-blocking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_backfill_reconciliation 
ON news_articles (ingested_at DESC, published_at DESC);
```

#### Verification Step: `EXPLAIN (ANALYZE, BUFFERS)`
Verify that queries utilize the composite index rather than sequential scans:
```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, title, published_at, ingested_at, source_name
FROM news_articles
WHERE published_at < (TIMEZONE('utc', NOW()) - INTERVAL '16 hours')
ORDER BY published_at DESC, id DESC
LIMIT 20;
```
*Expected Output:* `Index Scan using idx_news_articles_published_cursor on news_articles` with zero heap sequential scans.

#### Rollback Procedure
If an index build terminates abnormally or becomes invalid:
```sql
-- 1. Check for invalid indexes
SELECT relname, indisvalid FROM pg_index i 
JOIN pg_class c ON c.oid = i.indexrelid 
WHERE indisvalid = false;

-- 2. Safely drop invalid index without locking table
DROP INDEX CONCURRENTLY IF EXISTS idx_news_articles_published_cursor;
DROP INDEX CONCURRENTLY IF EXISTS idx_news_articles_ingested_at;
DROP INDEX CONCURRENTLY IF EXISTS idx_news_articles_backfill_reconciliation;
```

---

## 12. Operational Incident Response Playbooks

### 12.1 Playbook: `SOURCE_INGEST_LAG`
**Trigger:** Source feed freshness exceeds warning (`> 6h` national, `> 12h` intl) or critical (`> 24h`).

#### Symptoms
- Source status appears yellow or red in `OpsDiagnosticsModal.tsx`.
- Slack/webhook notification received with `metric: "Source Ingest Freshness Lag"`.
- Section A radar stops displaying updates from the affected publisher.

#### Diagnostic Workflow
1. **Retrieve Ops Metrics:**
   ```bash
   curl -s -H "x-ops-token: $OPS_METRICS_AUTH_TOKEN" \
     "https://your-domain.com/api/v1/news/ops/metrics" | jq '.sourceLagSummary'
   ```
2. **Inspect Top Feed Errors:**
   ```bash
   curl -s -H "x-ops-token: $OPS_METRICS_AUTH_TOKEN" \
     "https://your-domain.com/api/v1/news/ops/metrics" | jq '.topFeedErrors'
   ```
3. **Probe Upstream RSS Feed Directly:**
   ```bash
   curl -I -L -A "Mozilla/5.0 (compatible; NOVARICBot/2.0)" https://publisher-domain.com/feed.xml
   ```

#### Resolution Steps
- **Case A: HTTP 403 / Cloudflare Challenge:** The publisher has added Cloudflare bot protection. Update the ingest worker's User-Agent string or route through an authorized scraping proxy.
- **Case B: SSL/TLS Expiry on Upstream:** Verify certificate validity with `openssl s_client -connect publisher-domain.com:443`. Notify publisher webmaster if expired.
- **Case C: Feed URL Relocated (301/302 Redirect):** Update the feed URL in the ingest crawler configuration to the canonical destination URL.
- **Case D: Feed Ingestion Stalled:** Restart the ingest worker process. Once back online, verify recovery with:
  ```bash
  curl -X POST -H "x-ops-token: $OPS_METRICS_AUTH_TOKEN" \
    "https://your-domain.com/api/v1/news/ops/alerts/dispatch?force=true"
  ```

---

### 12.2 Playbook: `IMAGE_PROVENANCE_OG_SPIKE`
**Trigger:** OpenGraph secondary fallback ratio exceeds **35%** (`ogFallbackRatio > 0.35`).

#### Symptoms
- Alert dispatched: `OpenGraph Fallback Ratio > 35%`.
- Latency on image resolution endpoints increases because secondary runtime scraping is being invoked instead of primary feed media extraction.

#### Diagnostic Workflow
1. **Inspect Provenance Breakdown:**
   ```bash
   curl -s -H "x-ops-token: $OPS_METRICS_AUTH_TOKEN" \
     "https://your-domain.com/api/v1/news/ops/metrics" | jq '.imageProvenanceMetrics'
   ```
2. **Identify Impacted Outlets:**
   Examine recently ingested XML payloads in `data/latestNews.json` or ingest database to see which source lacks `<enclosure>` or `<media:content>`.

#### Resolution Steps
1. **Inspect RSS XML Structure:** Many publishers alternate between standard `<enclosure url="..." type="image/jpeg"/>`, Yahoo Media RSS `<media:content url="...">`, and iTunes podcast images `<itunes:image href="...">`.
2. **Update Media Resolver Selectors:**
   In `services/imageResolverService.ts`, check if the publisher has introduced a new XML namespace (e.g. `<content:encoded>` with embedded `<img>` tags or `<featured_image>`).
3. **Verify Resolution:** Re-test media parsing locally using `services/imageResolverService.ts`. Once deployed, the `ogFallbackRatio` should drop below 15%.
4. **Clear Ops Alert:** Force-evaluate the metrics endpoint to confirm the alert status transitions to `HEALTHY`.

