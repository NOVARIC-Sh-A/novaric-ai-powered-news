-- Records the 1 November 2026 authorization to publish stored legacy scores.
-- Inserts only. Does not UPDATE or DELETE paragon_scores, politicians,
-- the certified roster, or the earlier gate-v1 row.

INSERT OR IGNORE INTO paragon_publication_gate (
    id, authorized, audit_state, notice, changed_at, changed_by, reason
) VALUES (
    'gate-legacy-2026-11-01',
    1,
    'published',
    'Legacy D1-D7 scores and composites authorized for publication. Missing dimensions stay null.',
    '2026-11-01T21:28:00Z',
    'Dr Alban Gj. THIKA',
    'Authorization at 22:28 Europe/Tirana on 1 November 2026. Score snapshots and provenance were not overwritten.'
);

INSERT OR IGNORE INTO paragon_audit_history (
    id, politician_id, audit_state, authorized, model_version, note, recorded_at, source_ref
) VALUES (
    'hist-legacy-publication-2026-11-01',
    NULL,
    'published',
    1,
    'legacy_d1_d7_archive',
    'Dr Alban Gj. THIKA authorized publication of the stored legacy PARAGON D1-D7 scores and composites at 22:28 Europe/Tirana on 1 November 2026. No score row was updated or deleted. Name-hash integrity labels remain quarantined.',
    '2026-11-01T21:28:00Z',
    'docs/paragon/authorization-2026-11-01-legacy-publication.md'
);
