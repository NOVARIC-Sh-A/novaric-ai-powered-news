-- ============================================================================
-- Migration: 20260915_paragon_analytical_spine_p2.sql
-- Project: NOVARIC® PARAGON® Pipeline Phase 2 (P2)
-- Scope:
--   1. Register typed IDs: paragon:d1 .. paragon:d7
--   2. Provenance tracking for ILDKPKI (D2): snapshot_url, retrieval_date, legal_basis_ref
--   3. Analytical spine lineage binding:
--        paragon:d1 <-> maragon:O4.2 family (Kuvendi /mbledhjet attendance)
--        paragon:d2 <-> maragon:G3.1, maragon:G3.2 (ILDKPKI asset declarations)
--        paragon:d3..d7 <-> null-state schema stubs ("Në pritje të auditimit")
-- ============================================================================

-- Add provenance columns to asset_declarations if not already present
-- (executed idempotently via migration runner)
-- ALTER TABLE asset_declarations ADD COLUMN snapshot_url TEXT;
-- ALTER TABLE asset_declarations ADD COLUMN retrieval_date TEXT;
-- ALTER TABLE asset_declarations ADD COLUMN legal_basis_ref TEXT;

CREATE TABLE IF NOT EXISTS paragon_dimension_registry (
    typed_id TEXT PRIMARY KEY,       -- e.g. 'paragon:d1', 'paragon:d2'
    dimension_key TEXT NOT NULL,     -- 'D1'..'D7'
    name_sq TEXT NOT NULL,
    short_name_sq TEXT NOT NULL,
    status TEXT NOT NULL,            -- 'computed' | 'pending_audit'
    lineage_indicator_id TEXT,       -- 'maragon:O4.2', 'maragon:G3.1', etc.
    primary_source TEXT NOT NULL,    -- '/mbledhjet', 'ILDKPKI', 'KQZ', etc.
    method_name TEXT,                -- e.g. 'kuvendi_mbledhjet_attendance_v1'
    legal_basis_ref TEXT,            -- e.g. 'docs/ILDKPKI_LEGAL_BASIS.md'
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR REPLACE INTO paragon_dimension_registry 
(typed_id, dimension_key, name_sq, short_name_sq, status, lineage_indicator_id, primary_source, method_name, legal_basis_ref)
VALUES
('paragon:d1', 'D1', 'Angazhimi Politik', 'Angazhimi', 'computed', 'maragon:O4.2', '/mbledhjet', 'kuvendi_mbledhjet_attendance_v1', 'Kuvendi i Shqipërisë OData API /mbledhjet'),
('paragon:d2', 'D2', 'Llogaridhënia', 'Llogaridhënia', 'computed', 'maragon:G3.1', 'ILDKPKI', 'ildkpki_annual_audit_v1', 'docs/ILDKPKI_LEGAL_BASIS.md'),
('paragon:d3', 'D3', 'Përfaqësimi', 'Përfaqësimi', 'pending_audit', 'maragon:O4.1', 'KQZ / Dëgjesat Qytetare', NULL, 'Në pritje të auditimit'),
('paragon:d4', 'D4', 'Asertiviteti', 'Asertiviteti', 'pending_audit', 'maragon:A2.1', 'Transkriptet Plenare', NULL, 'Në pritje të auditimit'),
('paragon:d5', 'D5', 'Qeverisja', 'Qeverisja', 'pending_audit', 'maragon:G3.2', 'Akte Normative / Kushtetues', NULL, 'Në pritje të auditimit'),
('paragon:d6', 'D6', 'Kohësioni', 'Kohësioni', 'pending_audit', 'maragon:R1.1', 'Votimi Elektronik Nominal', NULL, 'Në pritje të auditimit'),
('paragon:d7', 'D7', 'Narrativa', 'Narrativa', 'pending_audit', 'maragon:A2.2', 'Monitorimi Mediatik', NULL, 'Në pritje të auditimit');
