-- =========================================================================
-- NOVARIC® CORRECTIVE MIGRATION: PARLIAMENT 2025 KQZ CERTIFIED BASELINE
-- Date: 2026-09-29
-- Authority: KQZ Final Certified Result (Decision No. 34 / 28.08.2025)
-- Legal Basis: "Për shpalljen e rezultatit përfundimtar të zgjedhjeve për
--               Kuvendin e Republikës së Shqipërisë, të datës 11 maj 2025"
-- =========================================================================

-- 1. Elections Authority Table
CREATE TABLE IF NOT EXISTS elections (
    id TEXT PRIMARY KEY,
    election_year INTEGER NOT NULL,
    election_date TEXT NOT NULL,
    certification_date TEXT NOT NULL,
    authority TEXT NOT NULL DEFAULT 'KQZ',
    decision_reference TEXT NOT NULL,
    legal_basis TEXT,
    total_mandates INTEGER NOT NULL DEFAULT 140,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Seed 2025 Election Reference
INSERT OR REPLACE INTO elections (id, election_year, election_date, certification_date, authority, decision_reference, legal_basis, total_mandates)
VALUES (
    'el-2025-05-11',
    2025,
    '2025-05-11',
    '2025-08-28',
    'KQZ',
    'Decision No. 34 / 28.08.2025',
    'Për shpalljen e rezultatit përfundimtar të zgjedhjeve për Kuvendin e Republikës së Shqipërisë, të datës 11 maj 2025',
    140
);

-- 2. Election Districts Table (Constitutional 140-Seat Allocation)
CREATE TABLE IF NOT EXISTS election_districts (
    id TEXT PRIMARY KEY,
    election_id TEXT NOT NULL REFERENCES elections(id),
    district_name TEXT NOT NULL,
    allocated_mandates INTEGER NOT NULL,
    UNIQUE(election_id, district_name)
);

INSERT OR REPLACE INTO election_districts (id, election_id, district_name, allocated_mandates) VALUES
('ed-2025-tirane', 'el-2025-05-11', 'Tiranë', 37),
('ed-2025-fier', 'el-2025-05-11', 'Fier', 16),
('ed-2025-durres', 'el-2025-05-11', 'Durrës', 14),
('ed-2025-elbasan', 'el-2025-05-11', 'Elbasan', 14),
('ed-2025-vlore', 'el-2025-05-11', 'Vlorë', 12),
('ed-2025-shkoder', 'el-2025-05-11', 'Shkodër', 11),
('ed-2025-korce', 'el-2025-05-11', 'Korçë', 10),
('ed-2025-berat', 'el-2025-05-11', 'Berat', 7),
('ed-2025-lezhe', 'el-2025-05-11', 'Lezhë', 7),
('ed-2025-diber', 'el-2025-05-11', 'Dibër', 5),
('ed-2025-gjirokaster', 'el-2025-05-11', 'Gjirokastër', 4),
('ed-2025-kukes', 'el-2025-05-11', 'Kukës', 3);

-- 3. Elected Members Table (Authoritative 140-Person Certified Baseline)
-- Models concept A: CERTIFIED ELECTION BASELINE (Never overwritten by subsequent changes)
CREATE TABLE IF NOT EXISTS elected_members (
    id TEXT PRIMARY KEY,
    election_id TEXT NOT NULL REFERENCES elections(id),
    election_year INTEGER NOT NULL DEFAULT 2025,
    election_date TEXT NOT NULL DEFAULT '2025-05-11',
    district TEXT NOT NULL,
    electoral_subject TEXT NOT NULL,
    coalition_party TEXT,
    certified_name TEXT NOT NULL,
    politician_id INTEGER,
    person_id TEXT REFERENCES politicians(id),
    certified_elected INTEGER NOT NULL DEFAULT 1,
    source_authority TEXT NOT NULL DEFAULT 'KQZ',
    source_decision TEXT NOT NULL DEFAULT 'Decision No. 34 / 28.08.2025',
    source_url TEXT NOT NULL DEFAULT 'https://kqz.gov.al',
    verification_status TEXT NOT NULL DEFAULT 'verified',
    verified_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(election_year, district, certified_name)
);

CREATE INDEX IF NOT EXISTS idx_elected_members_district ON elected_members(district);
CREATE INDEX IF NOT EXISTS idx_elected_members_person ON elected_members(person_id);
CREATE INDEX IF NOT EXISTS idx_elected_members_name ON elected_members(certified_name);

-- 4. Extend parliamentary_mandates to track mandate temporal lineage
-- (Concept B: CURRENT PARLIAMENTARY MANDATE, representing subsequent changes)
ALTER TABLE parliamentary_mandates ADD COLUMN predecessor_politician_id TEXT;
ALTER TABLE parliamentary_mandates ADD COLUMN replacement_reason TEXT;
