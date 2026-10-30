-- Migration: 20260914_politicians_active_until_deactivation.sql
-- Purpose: Add active_until timestamp column to politicians table for soft-deactivation tracking.
-- Authoritative schema update for NOVARIC® PARAGON Politicians Pipeline.

-- 1. Apply Migration
ALTER TABLE politicians 
ADD COLUMN IF NOT EXISTS active_until TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_politicians_active_until 
ON politicians (active_until) 
WHERE is_active_mp = false;

-- 2. Update view to expose active_until
CREATE OR REPLACE VIEW v_politician_cards AS
SELECT 
  p.id AS profile_uuid,
  'vip' || p.numeric_id AS id,
  p.numeric_id AS politician_id,
  p.full_name AS name,
  'Politikë (' || COALESCE(pty.short_name, 'IND') || ')' AS category,
  COALESCE(pty.short_name, 'IND') AS party,
  p.party_slug,
  p.bio_short AS short_bio,
  p.bio_detailed AS detailed_bio,
  p.photo_url AS image_url,
  p.date_of_birth,
  p.place_of_birth,
  p.electoral_zone,
  p.is_active_mp,
  p.active_until,
  ps.composite,
  ps.composite AS paragon_score,
  ps.composite AS dynamic_score,
  ps.period_end,
  ps.d1_policy_engagement,
  ps.d2_accountability,
  ps.d3_representation,
  ps.d4_assertiveness,
  ps.d5_governance,
  ps.d6_party_cohesion,
  ps.d7_narrative,
  ps.metrics,
  COALESCE(ps.computed_at, p.updated_at) AS last_updated
FROM politicians p
LEFT JOIN parties pty ON p.party_slug = pty.slug
LEFT JOIN LATERAL (
  SELECT * FROM paragon_scores 
  WHERE politician_id = p.id 
  ORDER BY period_end DESC, computed_at DESC 
  LIMIT 1
) ps ON true
ORDER BY COALESCE(ps.composite, 0) DESC;

-- ====================================================================
-- ROLLBACK NOTES (Forward and backward compatible):
-- To revert this migration, run:
--   DROP INDEX IF EXISTS idx_politicians_active_until;
--   ALTER TABLE politicians DROP COLUMN IF EXISTS active_until;
--   -- Re-run original v_politician_cards definition from novaric_paragon_schema.sql
-- ====================================================================
