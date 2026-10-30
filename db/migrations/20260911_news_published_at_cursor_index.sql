-- ============================================================================
-- NOVARIC® Media Monitor - Database Indexes for NewsFeed Operations
-- Migration: 20260911_news_published_at_cursor_index.sql
-- Purpose: Accelerate Section A (60m window) and Section B (Cursor Archive)
-- Execution Safety: Must be run OUTSIDE transaction blocks (PostgreSQL CONCURRENTLY requirement).
--
-- OPERATIONAL RUNBOOK:
-- Pre-Run Check:
--   SELECT count(*) FROM pg_stat_activity WHERE state != 'idle';
--   SELECT relname, reltuples FROM pg_class WHERE relname = 'news_articles';
-- Run Command:
--   psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f 20260911_news_published_at_cursor_index.sql
-- Verify Step:
--   SELECT indexname, indexdef, indisvalid FROM pg_indexes 
--   JOIN pg_index ON pg_index.indexrelid = (indexname::regclass) 
--   WHERE tablename = 'news_articles';
-- Rollback Command:
--   DROP INDEX CONCURRENTLY IF EXISTS idx_news_articles_cursor_pagination;
--   DROP INDEX CONCURRENTLY IF EXISTS idx_news_articles_ingested_at;
--   DROP INDEX CONCURRENTLY IF EXISTS idx_news_articles_backfill_reconciliation;
--   DROP INDEX CONCURRENTLY IF EXISTS idx_news_articles_category_published;
--   DROP INDEX CONCURRENTLY IF EXISTS idx_news_articles_source_published;
--   DROP INDEX CONCURRENTLY IF EXISTS idx_news_articles_ner_rating;
--   DROP INDEX CONCURRENTLY IF EXISTS idx_news_articles_canonical_url;
-- ============================================================================

-- 1. Ensure published_at and ingested_at timestamps exist and have defaults in UTC
ALTER TABLE IF EXISTS news_articles 
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());

ALTER TABLE IF EXISTS news_articles 
  ADD COLUMN IF NOT EXISTS ingested_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());

-- 2. Primary compound index for cursor-based pagination (published_at DESC, id DESC)
-- Non-locking production execution via CONCURRENTLY. Guarantees deterministic forward browsing.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_cursor_pagination 
  ON news_articles (published_at DESC, id DESC);

-- 3. Ingestion timestamp index for backfill reconciliation and deep archive indexing.
-- Prevents backfilled items with older published_at and low IDs from being missed in forward scans.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_ingested_at 
  ON news_articles (ingested_at DESC, id DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_backfill_reconciliation 
  ON news_articles (ingested_at DESC, published_at DESC);

-- 4. Filtered compound index for Category + PublishedAt
-- Speeds up NOVARIC category slices ('albanian', 'balkan', 'international')
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_category_published 
  ON news_articles (source_type, published_at DESC);

-- 5. Compound index for SourceName + PublishedAt (Media Ribbon selector)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_source_published 
  ON news_articles (source_name, published_at DESC);

-- 6. Index for NER Ecosystem Rating sorting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_ner_rating 
  ON news_articles (ecosystem_rating DESC NULLS LAST, published_at DESC);

-- 7. Canonical URL uniqueness / deduplication helper index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_news_articles_canonical_url 
  ON news_articles (original_article_url);
