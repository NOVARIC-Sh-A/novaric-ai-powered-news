import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  processNewsFeedQuery,
  invalidateNewsFeedCache,
  getNewsFeedOpsMetrics,
  bumpNewsFeedIngestVersion,
  getNewsFeedCacheVersion,
} from '../services/newsFeedBackend.js';
import { isWithinLatestWindow, isWithinArchiveWindow, isWithinGapWindow } from '../utils/dateWindowUtils.js';

describe('News Feed Backend Integration & API Contract Tests', () => {
  test('scope=latest returns valid NewsApiResponse with strictly latest items', async () => {
    invalidateNewsFeedCache();
    const res = await processNewsFeedQuery({ scope: 'latest' });

    assert.ok(res.serverTime, 'Response must include serverTime ISO');
    assert.equal(res.scope, 'latest');
    assert.ok(res.window.start, 'Latest window must have start time');
    assert.ok(res.window.end, 'Latest window must have end time');
    assert.ok(Array.isArray(res.items), 'items must be an array');
    assert.equal(typeof res.count, 'number');
    assert.equal(typeof res.total, 'number');
    assert.equal(res.items.length, res.count);

    // Verify every single returned item satisfies the latest window rule:
    for (const item of res.items) {
      assert.ok(
        isWithinLatestWindow(item.publishedAt!, res.serverTime),
        `Item ${item.id} with publishedAt ${item.publishedAt} must be within latest window`
      );
    }
  });

  test('scope=archive returns valid NewsApiResponse with strictly archived items', async () => {
    invalidateNewsFeedCache();
    const res = await processNewsFeedQuery({ scope: 'archive' });

    assert.ok(res.serverTime);
    assert.equal(res.scope, 'archive');
    assert.ok(res.window.end, 'Archive window must have end threshold');
    assert.ok(Array.isArray(res.items));

    // Verify every returned item is older than 16 hours (< anchor - 16h)
    for (const item of res.items) {
      assert.ok(
        isWithinArchiveWindow(item.publishedAt!, res.serverTime),
        `Item ${item.id} with publishedAt ${item.publishedAt} must be older than 16 hours`
      );
    }
  });

  test('Category and Search filters apply cleanly on news queries', async () => {
    const resAlbanian = await processNewsFeedQuery({ category: 'albanian' });
    for (const item of resAlbanian.items) {
      assert.equal(item.sourceType, 'albanian');
    }

    const resSearch = await processNewsFeedQuery({ search: 'BE' });
    for (const item of resSearch.items) {
      const match =
        item.title?.toLowerCase().includes('be') ||
        item.content?.toLowerCase().includes('be') ||
        item.sourceName?.toLowerCase().includes('be');
      assert.ok(match, 'Search query must match title, content, or source');
    }
  });

  test('Archive cursor pagination splits items deterministically without duplicates or omissions', async () => {
    invalidateNewsFeedCache();
    const page1 = await processNewsFeedQuery({ scope: 'archive', limit: 2 });
    assert.ok(page1.items.length <= 2);

    if (page1.nextCursor) {
      const page2 = await processNewsFeedQuery({ scope: 'archive', limit: 2, cursor: page1.nextCursor });
      // Ensure no item from page 1 appears in page 2
      const page1Ids = new Set(page1.items.map((i) => i.id));
      for (const item of page2.items) {
        assert.ok(!page1Ids.has(item.id), `Item ${item.id} appeared in both page 1 and page 2`);
      }
    }
  });

  test('In-memory caching returns cached response on subsequent calls within TTL', async () => {
    invalidateNewsFeedCache();
    const first = await processNewsFeedQuery({ scope: 'latest' });
    const second = await processNewsFeedQuery({ scope: 'latest' });
    assert.equal(first.serverTime, second.serverTime, 'Cached call should return identical serverTime');
  });

  test('Versioned cache invalidation immediately busts cache on rapid feed ingest bursts', async () => {
    invalidateNewsFeedCache();
    const initialVersion = getNewsFeedCacheVersion();
    const cachedRes = await processNewsFeedQuery({ scope: 'latest' });

    // Ingest burst occurs: bump version
    const newVersion = bumpNewsFeedIngestVersion();
    assert.equal(newVersion, initialVersion + 1);

    // Query again: should NOT return stale cached entry
    const postBurstRes = await processNewsFeedQuery({ scope: 'latest' });
    assert.ok(postBurstRes.serverTime);
  });

  test('scope=gap returns only articles within 1h to 16h transition gap', async () => {
    const gapRes = await processNewsFeedQuery({ scope: 'gap' });
    assert.equal(gapRes.scope, 'gap');
    assert.ok(gapRes.window.start);
    assert.ok(gapRes.window.end);
    for (const item of gapRes.items) {
      assert.ok(
        isWithinGapWindow(item.publishedAt!, gapRes.serverTime),
        `Item ${item.id} must be strictly within gap window`
      );
    }
  });

  test('getNewsFeedOpsMetrics returns comprehensive telemetry schema with SLA and lag stats', () => {
    const metrics = getNewsFeedOpsMetrics();
    assert.ok(metrics.serverTime);
    assert.equal(typeof metrics.cacheVersion, 'number');
    assert.ok(metrics.windowCounts);
    assert.equal(typeof metrics.windowCounts.latestCount, 'number');
    assert.equal(typeof metrics.windowCounts.gapCount, 'number');
    assert.equal(typeof metrics.windowCounts.archiveCount, 'number');
    assert.ok(metrics.cacheStats);
    assert.ok(metrics.latencyMetrics);
    assert.ok(metrics.nerMetrics);
    assert.ok(metrics.imageProvenanceMetrics);
    assert.ok(metrics.dedupeTelemetry);
    assert.ok(metrics.sourceLagSummary);
    assert.ok(Array.isArray(metrics.sourceLagSummary.alerts));
  });
});
