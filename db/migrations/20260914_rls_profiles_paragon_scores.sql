-- Migration: 20260914_rls_profiles_paragon_scores.sql
-- Purpose: Implement Row Level Security (RLS) on profiles, politicians, and paragon_scores tables.
-- Anon role is strictly READ-ONLY. Write operations require service_role authentication.

-- 1. Enable RLS on core identity and scoring tables
ALTER TABLE politicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE paragon_scores ENABLE ROW LEVEL SECURITY;

-- If a legacy 'profiles' table exists, enable RLS on it as well
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if any
    DROP POLICY IF EXISTS "profiles_read_anon" ON profiles;
    DROP POLICY IF EXISTS "profiles_write_service_role" ON profiles;

    -- Policy: Anon read-only
    CREATE POLICY "profiles_read_anon" ON profiles
      FOR SELECT
      TO anon, authenticated
      USING (true);

    -- Policy: Service role full access
    CREATE POLICY "profiles_write_service_role" ON profiles
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 2. Drop existing policies on politicians and paragon_scores if any
DROP POLICY IF EXISTS "politicians_read_anon" ON politicians;
DROP POLICY IF EXISTS "politicians_write_service_role" ON politicians;
DROP POLICY IF EXISTS "paragon_scores_read_anon" ON paragon_scores;
DROP POLICY IF EXISTS "paragon_scores_write_service_role" ON paragon_scores;

-- 3. Politicians Policies:
-- Anon & Authenticated users: SELECT only
CREATE POLICY "politicians_read_anon" ON politicians
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Ingest / Pipeline backend: service_role full write
CREATE POLICY "politicians_write_service_role" ON politicians
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Paragon Scores Policies:
-- Anon & Authenticated users: SELECT only
CREATE POLICY "paragon_scores_read_anon" ON paragon_scores
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Scoring Engine backend: service_role full write
CREATE POLICY "paragon_scores_write_service_role" ON paragon_scores
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. Grant explicit SELECT on view v_politician_cards to anon & authenticated
GRANT SELECT ON v_politician_cards TO anon, authenticated;

-- ====================================================================
-- ROLLBACK NOTES:
-- To disable RLS and drop policies, execute:
--   ALTER TABLE politicians DISABLE ROW LEVEL SECURITY;
--   ALTER TABLE paragon_scores DISABLE ROW LEVEL SECURITY;
--   DROP POLICY IF EXISTS "politicians_read_anon" ON politicians;
--   DROP POLICY IF EXISTS "politicians_write_service_role" ON politicians;
--   DROP POLICY IF EXISTS "paragon_scores_read_anon" ON paragon_scores;
--   DROP POLICY IF EXISTS "paragon_scores_write_service_role" ON paragon_scores;
-- ====================================================================
