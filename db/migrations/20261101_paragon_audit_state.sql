-- Additive audit-state tables. Does not UPDATE or DELETE paragon_scores,
-- politicians, or the certified roster. Stored score rows stay where they are.
-- Reverse with db/migrations/20261101_paragon_audit_state_down.sql

CREATE TABLE IF NOT EXISTS paragon_publication_gate (
    id TEXT PRIMARY KEY,
    authorized INTEGER NOT NULL DEFAULT 0,
    audit_state TEXT NOT NULL,
    notice TEXT NOT NULL,
    changed_at TEXT NOT NULL,
    changed_by TEXT NOT NULL,
    reason TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS paragon_audit_history (
    id TEXT PRIMARY KEY,
    politician_id TEXT,
    audit_state TEXT NOT NULL,
    authorized INTEGER NOT NULL,
    model_version TEXT,
    note TEXT NOT NULL,
    recorded_at TEXT NOT NULL,
    source_ref TEXT
);

CREATE INDEX IF NOT EXISTS idx_paragon_audit_history_politician
    ON paragon_audit_history (politician_id, recorded_at);

INSERT OR IGNORE INTO paragon_publication_gate (
    id, authorized, audit_state, notice, changed_at, changed_by, reason
) VALUES (
    'gate-v1',
    0,
    'under_review',
    'Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave.',
    '2026-11-01T00:00:00Z',
    'publication_gate_v1',
    'Fail-closed default. No numeric score is public until authorized is true and audit_state is published.'
);

INSERT OR IGNORE INTO paragon_audit_history (
    id, politician_id, audit_state, authorized, model_version, note, recorded_at, source_ref
) VALUES (
    'hist-gate-v1',
    NULL,
    'under_review',
    0,
    'publication_gate_v1',
    'Initial fail-closed gate. Legacy paragon_scores rows were not modified.',
    '2026-11-01T00:00:00Z',
    'data/paragon/publication_gate.json'
);
