-- ============================================================
-- NOVARIC® PARLIAMENT 2025 & PARAGON® RECONCILIATION MIGRATION
-- Date: 2026-09-28
-- Authority: KQZ Certified Final Result (28 August 2025)
-- ============================================================

-- 1. Certified Election Results Baseline (Historical 2025 Truth)
CREATE TABLE IF NOT EXISTS election_results (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES politicians(id),
    election_year INTEGER NOT NULL DEFAULT 2025,
    electoral_district TEXT NOT NULL,
    election_subject TEXT NOT NULL, -- 'PS', 'PD-AMSH', 'PSD', 'Mundësia', 'Lëvizja Bashkë', 'Nisma Shqipëria Bëhet'
    coalition_party TEXT,
    mandate_origin TEXT DEFAULT 'certified_election_list',
    certification_date TEXT DEFAULT '2025-08-28',
    source_url TEXT DEFAULT 'https://kqz.gov.al',
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(person_id, election_year)
);

CREATE INDEX IF NOT EXISTS idx_election_results_district ON election_results(electoral_district);
CREATE INDEX IF NOT EXISTS idx_election_results_subject ON election_results(election_subject);

-- 2. Parliamentary Mandates Table (Current Sitting Status)
CREATE TABLE IF NOT EXISTS parliamentary_mandates (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES politicians(id),
    legislature TEXT NOT NULL DEFAULT 'Legjislatura X',
    electoral_district TEXT NOT NULL,
    current_party TEXT NOT NULL,
    current_parliamentary_group TEXT NOT NULL,
    parliamentary_status TEXT NOT NULL DEFAULT 'active_mp', -- 'active_mp', 'mandate_suspended', 'mandate_ended', 'resigned', 'replaced', 'former_mp', 'under_review'
    mandate_start TEXT DEFAULT '2025-09-10',
    mandate_end TEXT,
    is_active INTEGER DEFAULT 1,
    source_url TEXT DEFAULT 'https://parlament.al/anetaret',
    verified_at TEXT NOT NULL DEFAULT (datetime('now')),
    verification_status TEXT NOT NULL DEFAULT 'verified'
);

CREATE INDEX IF NOT EXISTS idx_mandates_person ON parliamentary_mandates(person_id);
CREATE INDEX IF NOT EXISTS idx_mandates_active ON parliamentary_mandates(is_active, electoral_district);

-- 3. PARAGON Evidence Lineage Store (Every metric tied to source)
CREATE TABLE IF NOT EXISTS paragon_evidence (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES politicians(id),
    dimension_key TEXT NOT NULL, -- 'D1'..'D7'
    metric_key TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_title TEXT NOT NULL,
    source_publisher TEXT NOT NULL,
    source_type TEXT NOT NULL, -- 'kuvendi_plenary', 'kuvendi_committee', 'ildkpki_filing', 'spak_registry', 'kqz_register', 'official_gazette'
    source_published_at TEXT,
    retrieved_at TEXT NOT NULL,
    evidence_excerpt TEXT,
    evidence_hash TEXT,
    raw_value REAL,
    normalized_value REAL,
    verification_status TEXT NOT NULL DEFAULT 'verified', -- 'verified', 'under_review', 'disputed'
    verified_at TEXT NOT NULL,
    scoring_model_version TEXT DEFAULT 'v1.0',
    calculation_run_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_paragon_evidence_person_dim ON paragon_evidence(person_id, dimension_key);

-- 4. PARAGON Dimension Scores (Server-side computed dimensions with coverage)
CREATE TABLE IF NOT EXISTS paragon_dimension_scores (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES politicians(id),
    dimension_key TEXT NOT NULL,
    score REAL,
    peer_average REAL,
    benchmark REAL,
    coverage_percentage REAL,
    verification_status TEXT NOT NULL DEFAULT 'under_review',
    calculation_run_id TEXT,
    calculated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(person_id, dimension_key, calculation_run_id)
);

CREATE INDEX IF NOT EXISTS idx_dim_scores_person ON paragon_dimension_scores(person_id);
