-- Reverses only the tables added by 20261101_paragon_audit_state.sql.
-- Does not delete politicians, paragon_scores, or roster rows.

DROP INDEX IF EXISTS idx_paragon_audit_history_politician;
DROP TABLE IF EXISTS paragon_audit_history;
DROP TABLE IF EXISTS paragon_publication_gate;
