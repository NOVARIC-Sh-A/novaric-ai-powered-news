import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getNewsWindows,
  isWithinLatestWindow,
  isWithinArchiveWindow,
  isWithinGapWindow,
  normalizeArticlePublishedAt,
  normalizeCanonicalUrl,
  deduplicateNewsArticles,
  encodeNewsCursor,
  decodeNewsCursor,
  filterArticlesByCursor,
  reconcileArchiveBackfills,
  calculateImageProvenanceMetrics,
  calculateSourceLagAlerts,
  getDedupeTelemetry,
} from '../utils/dateWindowUtils.js';
import { BreakingNewsArticle } from '../types.js';

describe('News Window Utilities & Inclusivity/Exclusivity Tests', () => {
  const anchorISO = '2026-09-11T12:00:00.000Z';
  const anchorMs = new Date(anchorISO).getTime();

  test('getNewsWindows generates correct UTC boundaries', () => {
    const windows = getNewsWindows(anchorISO);
    assert.equal(windows.anchor, anchorISO);
    // 60 minutes before 12:00 is 11:00
    assert.equal(windows.latest.start, '2026-09-11T11:00:00.000Z');
    // 5 minutes skew after 12:00 is 12:05
    assert.equal(windows.latest.end, '2026-09-11T12:05:00.000Z');
    // 16 hours before 12:00 (Sep 11) is 20:00 (Sep 10)
    assert.equal(windows.archive.end, '2026-09-10T20:00:00.000Z');
    assert.equal(windows.gap.start, '2026-09-10T20:00:00.000Z');
    assert.equal(windows.gap.end, '2026-09-11T11:00:00.000Z');
  });

  test('Section A — Latest Window: boundary inclusivity & future skew tolerance', () => {
    // Exact lower boundary: anchor - 60m must be INCLUDED
    const exactMinus60m = new Date(anchorMs - 60 * 60 * 1000).toISOString();
    assert.equal(isWithinLatestWindow(exactMinus60m, anchorISO), true, 'Exact anchor - 60m must be inclusive');

    // 1ms before lower boundary: must be EXCLUDED
    const justBeforeMinus60m = new Date(anchorMs - 60 * 60 * 1000 - 1).toISOString();
    assert.equal(isWithinLatestWindow(justBeforeMinus60m, anchorISO), false, 'anchor - 60m - 1ms must be excluded');

    // Interior point: anchor - 25m
    const interior25m = new Date(anchorMs - 25 * 60 * 1000).toISOString();
    assert.equal(isWithinLatestWindow(interior25m, anchorISO), true);

    // Exact upper boundary: anchor + 5m must be INCLUDED (future skew tolerance)
    const exactPlus5m = new Date(anchorMs + 5 * 60 * 1000).toISOString();
    assert.equal(isWithinLatestWindow(exactPlus5m, anchorISO), true, 'Exact anchor + 5m must be inclusive');

    // 1ms past upper boundary: must be EXCLUDED
    const justPastPlus5m = new Date(anchorMs + 5 * 60 * 1000 + 1).toISOString();
    assert.equal(isWithinLatestWindow(justPastPlus5m, anchorISO), false, 'anchor + 5m + 1ms must be excluded');
  });

  test('Section B — Archive Window: boundary exclusivity (< anchor - 16h)', () => {
    // Exact threshold: anchor - 16h must be EXCLUDED (< condition)
    const exactMinus16h = new Date(anchorMs - 16 * 60 * 60 * 1000).toISOString();
    assert.equal(isWithinArchiveWindow(exactMinus16h, anchorISO), false, 'Exact anchor - 16h must be excluded');

    // 1ms before threshold: anchor - 16h - 1ms must be INCLUDED
    const justOlderThan16h = new Date(anchorMs - 16 * 60 * 60 * 1000 - 1).toISOString();
    assert.equal(isWithinArchiveWindow(justOlderThan16h, anchorISO), true, 'anchor - 16h - 1ms must be in archive');

    // Older item (e.g. 24 hours ago) must be INCLUDED
    const older24h = new Date(anchorMs - 24 * 60 * 60 * 1000).toISOString();
    assert.equal(isWithinArchiveWindow(older24h, anchorISO), true);
  });

  test('Transition Gap: items between 60 minutes and 16 hours are hidden by default', () => {
    // 3 hours ago: not latest, not archive, but in gap
    const threeHoursAgo = new Date(anchorMs - 3 * 60 * 60 * 1000).toISOString();
    assert.equal(isWithinLatestWindow(threeHoursAgo, anchorISO), false);
    assert.equal(isWithinArchiveWindow(threeHoursAgo, anchorISO), false);
    assert.equal(isWithinGapWindow(threeHoursAgo, anchorISO), true);

    // 15 hours ago: in gap
    const fifteenHoursAgo = new Date(anchorMs - 15 * 60 * 60 * 1000).toISOString();
    assert.equal(isWithinLatestWindow(fifteenHoursAgo, anchorISO), false);
    assert.equal(isWithinArchiveWindow(fifteenHoursAgo, anchorISO), false);
    assert.equal(isWithinGapWindow(fifteenHoursAgo, anchorISO), true);
  });

  test('Canonical URL normalization strips tracking parameters and trailing slashes', () => {
    const raw1 = 'https://www.bbc.com/news/world-europe-12345/?utm_source=rss&utm_medium=feed';
    const clean1 = normalizeCanonicalUrl(raw1);
    assert.equal(clean1, 'https://www.bbc.com/news/world-europe-12345');

    const raw2 = 'HTTP://RTSH.AL/lajme/article-abc//?fbclid=XYZ123&ref=home';
    const clean2 = normalizeCanonicalUrl(raw2);
    assert.equal(clean2, 'https://rtsh.al/lajme/article-abc');
  });

  test('Deduplication resolves collisions by preferring higher NER score then newer time', () => {
    const articleLowNer: BreakingNewsArticle = {
      id: 'item-1-low',
      title: 'Major Summit in Tirana',
      content: 'Discussion on regional growth.',
      publishedDate: 'Para 20 minutash',
      publishedAt: '2026-09-11T11:40:00.000Z',
      sourceName: 'Channel A',
      sourceType: 'albanian',
      originalArticleUrl: 'https://example.com/news/summit-tirana',
      severity: 'medium',
      isHighlyRelevantCurrentDevelopment: true,
      newsAuthenticity: 'VERIFIED_ACCURATE',
      sourceReliability: 'MEDIUM_REPUTATION',
      ecosystemRating: 75,
    };

    const articleHighNer: BreakingNewsArticle = {
      id: 'item-1-high',
      title: 'Major Summit in Tirana with Comprehensive Coverage',
      content: 'Detailed discussion on regional growth and investments.',
      publishedDate: 'Para 22 minutash',
      publishedAt: '2026-09-11T11:38:00.000Z',
      sourceName: 'Channel B Verified',
      sourceType: 'albanian',
      originalArticleUrl: 'https://example.com/news/summit-tirana?utm_source=twitter',
      severity: 'high',
      isHighlyRelevantCurrentDevelopment: true,
      newsAuthenticity: 'VERIFIED_ACCURATE',
      sourceReliability: 'VERY_HIGH_REPUTATION',
      ecosystemRating: 96,
    };

    const deduped = deduplicateNewsArticles([articleLowNer, articleHighNer]);
    assert.equal(deduped.length, 1);
    assert.equal(deduped[0].id, 'item-1-high', 'Higher NER article must win deduplication collision');
    assert.equal(deduped[0].ecosystemRating, 96);
  });

  test('Cursor pagination encoding, decoding and filtering is stable and non-skipping', () => {
    const items: BreakingNewsArticle[] = [
      {
        id: 'news-3',
        title: 'Story 3',
        content: '',
        publishedDate: '',
        publishedAt: '2026-09-10T10:00:00.000Z',
        sourceName: 'A',
        sourceType: 'albanian',
        severity: 'low',
        isHighlyRelevantCurrentDevelopment: false,
        newsAuthenticity: 'ACCURACY_UNCLEAR',
        sourceReliability: 'UNRELIABLE_UNKNOWN',
      },
      {
        id: 'news-2',
        title: 'Story 2',
        content: '',
        publishedDate: '',
        publishedAt: '2026-09-10T09:00:00.000Z',
        sourceName: 'B',
        sourceType: 'international',
        severity: 'low',
        isHighlyRelevantCurrentDevelopment: false,
        newsAuthenticity: 'ACCURACY_UNCLEAR',
        sourceReliability: 'UNRELIABLE_UNKNOWN',
      },
      {
        id: 'news-1',
        title: 'Story 1',
        content: '',
        publishedDate: '',
        publishedAt: '2026-09-10T08:00:00.000Z',
        sourceName: 'C',
        sourceType: 'balkan',
        severity: 'low',
        isHighlyRelevantCurrentDevelopment: false,
        newsAuthenticity: 'ACCURACY_UNCLEAR',
        sourceReliability: 'UNRELIABLE_UNKNOWN',
      },
    ];

    const cursor = encodeNewsCursor(items[0]);
    const decoded = decodeNewsCursor(cursor);
    assert.ok(decoded);
    assert.equal(decoded?.publishedAt, '2026-09-10T10:00:00.000Z');
    assert.equal(decoded?.id, 'news-3');

    const page2 = filterArticlesByCursor(items, cursor);
    assert.equal(page2.length, 2);
    assert.equal(page2[0].id, 'news-2');
    assert.equal(page2[1].id, 'news-1');
  });

  test('Canonical URL normalization handles AMP, mobile domains, and tracking parameters', () => {
    // Mobile subdomain stripping
    const mUrl = 'https://m.reuters.com/world/europe/deal-announced';
    assert.equal(normalizeCanonicalUrl(mUrl), 'https://reuters.com/world/europe/deal-announced');

    // AMP subdomain and path stripping
    const ampUrl = 'https://amp.dw.com/en/balkans-trade-summit/amp';
    assert.equal(normalizeCanonicalUrl(ampUrl), 'https://dw.com/en/balkans-trade-summit');

    // Complex tracking parameters
    const trackedUrl = 'http://aljazeera.com/news/article-xyz/?fbclid=123&utm_source=fb&mc_cid=999/';
    assert.equal(normalizeCanonicalUrl(trackedUrl), 'https://aljazeera.com/news/article-xyz');
  });

  test('Deduplication tracks telemetry counters accurately', () => {
    const item1: BreakingNewsArticle = {
      id: 'd-1',
      title: 'Economic Forum Concludes',
      content: '',
      publishedDate: '',
      publishedAt: '2026-09-11T11:00:00.000Z',
      sourceName: 'Source 1',
      sourceType: 'international',
      originalArticleUrl: 'https://example.com/econ-forum?utm_source=twitter',
      severity: 'medium',
      isHighlyRelevantCurrentDevelopment: true,
      newsAuthenticity: 'VERIFIED_ACCURATE',
      sourceReliability: 'HIGH_REPUTATION',
      ecosystemRating: 90,
    };

    const item2: BreakingNewsArticle = {
      id: 'd-2',
      title: 'Economic Forum Concludes',
      content: '',
      publishedDate: '',
      publishedAt: '2026-09-11T11:00:00.000Z',
      sourceName: 'Source 2',
      sourceType: 'international',
      originalArticleUrl: 'https://example.com/econ-forum?utm_source=newsletter',
      severity: 'medium',
      isHighlyRelevantCurrentDevelopment: true,
      newsAuthenticity: 'VERIFIED_ACCURATE',
      sourceReliability: 'MEDIUM_REPUTATION',
      ecosystemRating: 80,
    };

    const initialTelemetry = { ...getDedupeTelemetry() };
    const deduped = deduplicateNewsArticles([item1, item2]);
    assert.equal(deduped.length, 1);

    const updatedTelemetry = getDedupeTelemetry();
    assert.ok(updatedTelemetry.totalDedupeWins > initialTelemetry.totalDedupeWins);
  });

  test('reconcileArchiveBackfills detects backfilled articles correctly', () => {
    const normalItem: BreakingNewsArticle = {
      id: 'norm-1',
      title: 'Normal Article',
      content: '',
      publishedDate: '',
      publishedAt: '2026-09-10T10:00:00.000Z',
      ingestedAt: '2026-09-10T10:05:00.000Z', // Ingested 5m after publish
      sourceName: 'Normal Ingest',
      sourceType: 'albanian',
      severity: 'low',
      isHighlyRelevantCurrentDevelopment: false,
      newsAuthenticity: 'VERIFIED_ACCURATE',
      sourceReliability: 'HIGH_REPUTATION',
    };

    const backfillItem: BreakingNewsArticle = {
      id: 'backfill-1',
      title: 'Late Backfilled Archive Article',
      content: '',
      publishedDate: '',
      publishedAt: '2026-08-01T10:00:00.000Z', // Published 40 days ago
      ingestedAt: '2026-09-11T09:00:00.000Z', // Ingested today!
      sourceName: 'Archive Crawl',
      sourceType: 'international',
      severity: 'low',
      isHighlyRelevantCurrentDevelopment: false,
      newsAuthenticity: 'VERIFIED_ACCURATE',
      sourceReliability: 'HIGH_REPUTATION',
    };

    const report = reconcileArchiveBackfills([normalItem, backfillItem], 24);
    assert.equal(report.backfillCount, 1);
    assert.equal(report.backfilledItems[0].id, 'backfill-1');
  });

  test('calculateImageProvenanceMetrics warns if OG fallback exceeds 35%', () => {
    const articlesWithHeavyOg: BreakingNewsArticle[] = [
      {
        id: 'img-1',
        title: 'Title',
        content: '',
        publishedDate: '',
        publishedAt: '2026-09-11T10:00:00.000Z',
        sourceName: 'A',
        sourceType: 'albanian',
        severity: 'low',
        isHighlyRelevantCurrentDevelopment: false,
        newsAuthenticity: 'ACCURACY_UNCLEAR',
        sourceReliability: 'UNRELIABLE_UNKNOWN',
        imageProvenance: 'articleOg',
        imageUrl: 'https://example.com/og.jpg',
      },
      {
        id: 'img-2',
        title: 'Title',
        content: '',
        publishedDate: '',
        publishedAt: '2026-09-11T10:00:00.000Z',
        sourceName: 'A',
        sourceType: 'albanian',
        severity: 'low',
        isHighlyRelevantCurrentDevelopment: false,
        newsAuthenticity: 'ACCURACY_UNCLEAR',
        sourceReliability: 'UNRELIABLE_UNKNOWN',
        imageProvenance: 'articleOg',
        imageUrl: 'https://example.com/og2.jpg',
      },
      {
        id: 'img-3',
        title: 'Title',
        content: '',
        publishedDate: '',
        publishedAt: '2026-09-11T10:00:00.000Z',
        sourceName: 'A',
        sourceType: 'albanian',
        severity: 'low',
        isHighlyRelevantCurrentDevelopment: false,
        newsAuthenticity: 'ACCURACY_UNCLEAR',
        sourceReliability: 'UNRELIABLE_UNKNOWN',
        imageProvenance: 'rssFeed',
        imageUrl: 'https://example.com/rss.jpg',
      },
    ];

    const metrics = calculateImageProvenanceMetrics(articlesWithHeavyOg, 0.35);
    assert.equal(metrics.articleOgCount, 2);
    assert.equal(metrics.rssFeedCount, 1);
    assert.equal(metrics.ogDominationAlert, true, 'Ratio 67% > 35% must trigger ogDominationAlert');
  });

  test('calculateSourceLagAlerts detects stalled source feeds', () => {
    const nowISO = '2026-09-11T12:00:00.000Z';
    const articles: BreakingNewsArticle[] = [
      {
        id: 'fresh-1',
        title: 'Fresh Story',
        content: '',
        publishedDate: '',
        publishedAt: '2026-09-11T11:30:00.000Z', // 30m lag
        sourceName: 'Fresh Outlet',
        sourceType: 'albanian',
        severity: 'low',
        isHighlyRelevantCurrentDevelopment: false,
        newsAuthenticity: 'ACCURACY_UNCLEAR',
        sourceReliability: 'UNRELIABLE_UNKNOWN',
      },
      {
        id: 'stale-1',
        title: 'Stale Story',
        content: '',
        publishedDate: '',
        publishedAt: '2026-09-10T10:00:00.000Z', // 26h lag (>24h critical)
        sourceName: 'Stalled Outlet',
        sourceType: 'albanian',
        severity: 'low',
        isHighlyRelevantCurrentDevelopment: false,
        newsAuthenticity: 'ACCURACY_UNCLEAR',
        sourceReliability: 'UNRELIABLE_UNKNOWN',
      },
    ];

    const summary = calculateSourceLagAlerts(articles, nowISO);
    assert.equal(summary.healthyCount, 1);
    assert.equal(summary.criticalCount, 1);
    const stalledAlert = summary.alerts.find((a) => a.sourceName === 'Stalled Outlet');
    assert.ok(stalledAlert);
    assert.equal(stalledAlert?.status, 'CRITICAL');
  });
});
