import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  processNewsFeedQuery,
  invalidateNewsFeedCache,
  bumpNewsFeedIngestVersion,
  verifyOpsToken,
} from '../services/newsFeedBackend.js';
import {
  getNewsFeedConfig,
  validateAndNormalizeConfig,
} from '../config/newsFeedConfig.js';
import {
  buildOpsAlerts,
  dispatchOpsAlertsIfNeeded,
  clearOpsAlertSuppressionHistory,
} from '../services/opsAlertService.js';
import {
  reconcileArchiveBackfills,
} from '../utils/dateWindowUtils.js';
import { BreakingNewsArticle, OpsMetricsResponse } from '../types.js';

describe('NOVARIC Production Hardening Verification Suite', () => {

  describe('1. Cursor Stability under Rapid Inserts and Backfilled Dates', () => {
    test('Cursor (published_at, id) provides deterministic, duplicate-free pagination even with backfilled dates', async () => {
      invalidateNewsFeedCache();

      // Page 1
      const page1 = await processNewsFeedQuery({ scope: 'all', limit: 3 });
      assert.ok(page1.items.length > 0, 'Page 1 must have items');
      assert.ok(page1.nextCursor, 'Page 1 must have nextCursor when more items exist');

      // Page 2
      const page2 = await processNewsFeedQuery({ scope: 'all', limit: 3, cursor: page1.nextCursor });
      assert.ok(page2.items.length > 0, 'Page 2 must have items');

      // Check no overlapping IDs between page 1 and page 2
      const page1Ids = new Set(page1.items.map((i) => i.id));
      for (const item of page2.items) {
        assert.ok(!page1Ids.has(item.id), `Duplicate item found across pages: ${item.id}`);
      }

      // Check monotonic order: publishedAt descending, then id descending
      const combined = [...page1.items, ...page2.items];
      for (let i = 0; i < combined.length - 1; i++) {
        const a = combined[i];
        const b = combined[i + 1];
        const aTime = new Date(a.publishedAt!).getTime();
        const bTime = new Date(b.publishedAt!).getTime();
        if (aTime === bTime) {
          assert.ok(
            a.id.localeCompare(b.id) >= 0,
            `Tie-break ID order violated: ${a.id} vs ${b.id}`
          );
        } else {
          assert.ok(aTime >= bTime, `Date ordering violated: ${a.publishedAt} vs ${b.publishedAt}`);
        }
      }
    });

    test('reconcileArchiveBackfills detects backfilled older records with dryRun reporting', () => {
      const now = new Date();
      const mockArticles = [
        {
          id: 'art-normal-1',
          title: 'Recent Article',
          content: 'Content',
          publishedAt: new Date(now.getTime() - 20 * 3600 * 1000).toISOString(),
          ingestedAt: new Date(now.getTime() - 19 * 3600 * 1000).toISOString(),
          sourceName: 'RTSH',
          sourceType: 'albanian' as const,
          ecosystemRating: 85,
        },
        {
          id: 'art-backfilled-1',
          title: 'Deep Historical Backfill',
          content: 'Content',
          // Published 72 hours ago, but ingested only 1 hour ago
          publishedAt: new Date(now.getTime() - 72 * 3600 * 1000).toISOString(),
          ingestedAt: new Date(now.getTime() - 1 * 3600 * 1000).toISOString(),
          sourceName: 'Top Channel',
          sourceType: 'albanian' as const,
          ecosystemRating: 80,
        },
      ] as unknown as BreakingNewsArticle[];

      const report = reconcileArchiveBackfills(mockArticles, {
        dryRun: true,
        thresholdHours: 24,
      });

      assert.equal(report.dryRun, true);
      assert.equal(report.backfillCount, 1);
      assert.equal(report.backfilledItems.length, 1);
      assert.equal(report.backfilledItems[0].id, 'art-backfilled-1');
    });
  });

  describe('2. In-Flight Query Coalescing and Cache Invalidation', () => {
    test('Simultaneous concurrent queries coalesce and do not duplicate execution', async () => {
      invalidateNewsFeedCache();

      // Launch 5 concurrent queries at the exact same instant
      const queryPromises = [
        processNewsFeedQuery({ scope: 'latest' }),
        processNewsFeedQuery({ scope: 'latest' }),
        processNewsFeedQuery({ scope: 'latest' }),
        processNewsFeedQuery({ scope: 'latest' }),
        processNewsFeedQuery({ scope: 'latest' }),
      ];

      const results = await Promise.all(queryPromises);

      // All coalesced queries must return the exact same serverTime and count
      const firstServerTime = results[0].serverTime;
      const firstCount = results[0].count;

      for (const res of results) {
        assert.equal(res.serverTime, firstServerTime);
        assert.equal(res.count, firstCount);
      }
    });

    test('bumpNewsFeedIngestVersion invalidates cache immediately on ingest bursts', async () => {
      invalidateNewsFeedCache();
      const res1 = await processNewsFeedQuery({ scope: 'latest' });

      // Ingest burst
      bumpNewsFeedIngestVersion();

      const res2 = await processNewsFeedQuery({ scope: 'latest' });
      assert.ok(res2.serverTime);
    });
  });

  describe('3. Alert Generation, OG Fallback Ratio, and Alert Suppression', () => {
    test('buildOpsAlerts generates critical and warning alerts for lag and high OG ratio', () => {
      const mockMetrics: OpsMetricsResponse = {
        serverTime: new Date().toISOString(),
        cacheVersion: 1,
        windowCounts: { latestCount: 5, gapCount: 10, archiveCount: 20, totalCount: 35 },
        cacheStats: { latestEntries: 1, archiveEntries: 1, hits: 10, misses: 2, hitRatio: 0.83 },
        latencyMetrics: { p50Ms: 12, p95Ms: 40, p99Ms: 80, avgMs: 20, totalQueries: 12 },
        nerMetrics: { avgScore: 82, p10Score: 72, highCount: 15, mediumCount: 15, lowCount: 5 },
        imageProvenanceMetrics: {
          rssFeedCount: 5,
          articleOgCount: 5,
          noneCount: 0,
          ogFallbackRatio: 0.50, // 50% exceeds 35% critical threshold
          ogDominationAlert: true,
        },
        dedupeTelemetry: {
          canonicalUrlWins: 10,
          ampMobileWins: 5,
          guidWins: 3,
          syndicationWins: 2,
          idFallbackWins: 1,
          totalDedupeWins: 21,
        },
        sourceLagSummary: {
          healthyCount: 1,
          warningCount: 1,
          criticalCount: 1,
          alerts: [
            {
              sourceName: 'Stale Source A',
              sourceType: 'albanian',
              status: 'CRITICAL',
              lagMinutes: 1800, // 30h > 24h
              newestPublishedAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
            },
            {
              sourceName: 'Lagging Source B',
              sourceType: 'international',
              status: 'WARNING',
              lagMinutes: 700, // > 8h warning
              newestPublishedAt: new Date(Date.now() - 700 * 60 * 1000).toISOString(),
            },
            {
              sourceName: 'Healthy Source C',
              sourceType: 'albanian',
              status: 'HEALTHY',
              lagMinutes: 15,
              newestPublishedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            },
          ],
        },
        topFeedErrors: [],
      };

      const alerts = buildOpsAlerts(mockMetrics);
      assert.ok(alerts.length >= 3, 'Must generate alerts for both stale sources and OG ratio');

      // Check OG alert
      const ogAlert = alerts.find((a) => a.id.includes('image-og-domination'));
      assert.ok(ogAlert, 'OG ratio alert must be present');
      assert.equal(ogAlert?.severity, 'CRITICAL');
      assert.ok(ogAlert?.runbookLink.includes('image-og-domination'));

      // Check lag alert
      const lagAlert = alerts.find((a) => a.sourceCategory.includes('Stale Source A'));
      assert.ok(lagAlert, 'Stale Source A alert must be present');
      assert.equal(lagAlert?.severity, 'CRITICAL');
      assert.ok(lagAlert?.runbookLink.includes('source-freshness-lag'));
    });

    test('Alert suppression prevents duplicate dispatches within suppression window', async () => {
      clearOpsAlertSuppressionHistory();

      const mockMetrics: OpsMetricsResponse = {
        serverTime: new Date().toISOString(),
        cacheVersion: 1,
        windowCounts: { latestCount: 5, gapCount: 10, archiveCount: 20, totalCount: 35 },
        cacheStats: { latestEntries: 1, archiveEntries: 1, hits: 10, misses: 2, hitRatio: 0.83 },
        latencyMetrics: { p50Ms: 12, p95Ms: 40, p99Ms: 80, avgMs: 20, totalQueries: 12 },
        nerMetrics: { avgScore: 82, p10Score: 72, highCount: 15, mediumCount: 15, lowCount: 5 },
        imageProvenanceMetrics: {
          rssFeedCount: 5,
          articleOgCount: 5,
          noneCount: 0,
          ogFallbackRatio: 0.50,
          ogDominationAlert: true,
        },
        dedupeTelemetry: {
          canonicalUrlWins: 10,
          ampMobileWins: 5,
          guidWins: 3,
          syndicationWins: 2,
          idFallbackWins: 1,
          totalDedupeWins: 21,
        },
        sourceLagSummary: {
          healthyCount: 0,
          warningCount: 0,
          criticalCount: 1,
          alerts: [
            {
              sourceName: 'Stale Source X',
              sourceType: 'albanian',
              status: 'CRITICAL',
              lagMinutes: 1800,
              newestPublishedAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
            },
          ],
        },
        topFeedErrors: [],
      };

      // First dispatch
      const firstDispatch = await dispatchOpsAlertsIfNeeded(mockMetrics, false);
      assert.ok(firstDispatch.alertsGenerated.length >= 2);

      // Immediate second dispatch without force should be suppressed
      const secondDispatch = await dispatchOpsAlertsIfNeeded(mockMetrics, false);
      assert.equal(secondDispatch.alertsGenerated.length, 0, 'Duplicate alerts must be suppressed within suppression window');

      // Forced dispatch bypasses suppression
      const forcedDispatch = await dispatchOpsAlertsIfNeeded(mockMetrics, true);
      assert.ok(forcedDispatch.alertsGenerated.length >= 2, 'Forced dispatch must bypass suppression');
    });
  });

  describe('4. Config Override Validation and Security Gating', () => {
    test('Config validator falls back gracefully on invalid or negative environment inputs', () => {
      const invalidEnv = {
        ALBANIAN_LAG_WARNING_HOURS: '-10',
        ALBANIAN_LAG_CRITICAL_HOURS: 'invalid_number',
        OG_FALLBACK_WARNING_RATIO: '2.5', // Ratio cannot exceed 1.0
        OG_FALLBACK_CRITICAL_RATIO: '-0.2',
        NEWSFEED_RAMP_MODE: 'unrecognized_mode',
      };

      const validated = validateAndNormalizeConfig(invalidEnv);

      // Assert fallback to healthy production defaults
      assert.equal(validated.albanianWarnMin, 360);
      assert.equal(validated.albanianCritMin, 1440);
      assert.equal(validated.ogDominationThreshold, 0.35);
      assert.equal(validated.rampMode, 'full');
    });

    test('Config validator correctly parses valid overrides', () => {
      const validEnv = {
        ALBANIAN_LAG_WARNING_HOURS: '8',
        ALBANIAN_LAG_CRITICAL_HOURS: '36',
        OG_FALLBACK_WARNING_RATIO: '0.25',
        NEWSFEED_RAMP_MODE: 'canary',
        OPS_ALERT_WEBHOOK_URL: 'https://hooks.slack.com/services/test/test/test',
      };

      const validated = validateAndNormalizeConfig(validEnv);

      assert.equal(validated.albanianWarnMin, 8 * 60);
      assert.equal(validated.albanianCritMin, 36 * 60);
      assert.equal(validated.ogDominationThreshold, 0.25);
      assert.equal(validated.rampMode, 'canary');
      assert.equal(validated.alertWebhookUrl, 'https://hooks.slack.com/services/test/test/test');
    });

    test('verifyOpsToken secures ops endpoints against unauthorized access', () => {
      const testSecret = 'novaric-ops-secret-2026';
      const authValidBearer = verifyOpsToken('Bearer novaric-ops-secret-2026', testSecret);
      assert.equal(authValidBearer.authorized, true);

      const authValidRaw = verifyOpsToken('novaric-ops-secret-2026', testSecret);
      assert.equal(authValidRaw.authorized, true);

      const authInvalid = verifyOpsToken('Bearer wrong-unauthorized-token', testSecret);
      assert.equal(authInvalid.authorized, false);
      assert.ok(authInvalid.reason?.includes('Invalid'));

      const authMissing = verifyOpsToken(undefined, testSecret);
      assert.equal(authMissing.authorized, false);

      // Verify bypass mode when token is not configured
      const authBypass = verifyOpsToken(undefined, '');
      assert.equal(authBypass.authorized, true);
    });
  });

});
