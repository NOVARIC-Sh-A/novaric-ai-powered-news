-- ============================================================
-- NOVARIC® PARAGON® Integrity Recovery & Role History Migration
-- Date: 2026-09-24
-- ============================================================

-- 1. Role History Table (Section 4 of Remediation Mandate)
CREATE TABLE IF NOT EXISTS role_history (
    id TEXT PRIMARY KEY,
    person_id TEXT NOT NULL REFERENCES politicians(id),
    role_type TEXT NOT NULL, -- 'active_mp', 'speaker_of_parliament', 'prime_minister', 'cabinet_member', 'mayor', 'party_leader', 'former_mp', 'former_minister', 'former_official', 'other_public_figure', 'mandate_ended', 'mandate_suspended', 'legal_proceedings'
    institution TEXT NOT NULL,
    official_title TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    is_current INTEGER NOT NULL DEFAULT 1,
    source_url TEXT NOT NULL,
    source_title TEXT NOT NULL,
    source_publisher TEXT NOT NULL,
    verified_at TEXT NOT NULL,
    verification_status TEXT NOT NULL -- 'verified', 'disputed', 'under_review'
);

CREATE INDEX IF NOT EXISTS idx_role_history_person ON role_history(person_id);
CREATE INDEX IF NOT EXISTS idx_role_history_current ON role_history(person_id, is_current);

-- 2. Contamination Manifest & Quarantine Store (Section 7 of Remediation Mandate)
CREATE TABLE IF NOT EXISTS contamination_manifest (
    id TEXT PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    politician_id TEXT,
    generation_source TEXT NOT NULL,
    generation_rule TEXT NOT NULL,
    created_at TEXT NOT NULL,
    affected_score_run TEXT,
    quarantine_status TEXT NOT NULL DEFAULT 'quarantined'
);

CREATE TABLE IF NOT EXISTS quarantined_contaminated_records (
    id TEXT PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    politician_id TEXT,
    generation_source TEXT NOT NULL,
    generation_rule TEXT NOT NULL,
    created_at TEXT NOT NULL,
    affected_score_run TEXT,
    quarantine_status TEXT NOT NULL DEFAULT 'quarantined',
    raw_payload TEXT
);
