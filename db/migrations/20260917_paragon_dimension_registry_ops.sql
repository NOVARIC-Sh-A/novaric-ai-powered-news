-- ====================================================================
-- NOVARIC® PARAGON Dimension Registry Operational Trigger & Schema
-- Migration: 20260917_paragon_dimension_registry_ops.sql
-- Description: Adds updated_at column and automated timestamp trigger
-- ====================================================================

-- 1. Ensure updated_at column exists
-- In SQLite:
-- ALTER TABLE paragon_dimension_registry ADD COLUMN updated_at TEXT;
-- UPDATE paragon_dimension_registry SET updated_at = datetime('now');

-- 2. Trigger for automatic timestamp tracking
CREATE TRIGGER IF NOT EXISTS trg_paragon_dimension_registry_updated_at
AFTER UPDATE ON paragon_dimension_registry
FOR EACH ROW
BEGIN
    UPDATE paragon_dimension_registry 
    SET updated_at = datetime('now')
    WHERE typed_id = OLD.typed_id;
END;
