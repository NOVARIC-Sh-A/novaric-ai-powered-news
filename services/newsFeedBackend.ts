import fs from 'fs';
import path from 'path';
import { BreakingNewsArticle, NewsApiResponse, NewsFeedScope, OpsMetricsResponse } from '../types';
import { getNewsFeedConfig } from '../config/newsFeedConfig';
import { dispatchOpsAlertsIfNeeded } from './opsAlertService';
import {
  getNewsWindows,
  isWithinLatestWindow,
  isWithinArchiveWindow,
  isWithinGapWindow,
  normalizeArticlePublishedAt,
  deduplicateNewsArticles,
  encodeNewsCursor,
  filterArticlesByCursor,
  calculateImageProvenanceMetrics,
  calculateSourceLagAlerts,
  getDedupeTelemetry,
} from '../utils/dateWindowUtils';
import { balanceTitlesPerSource } from '../utils/newsBalancingUtils';

interface CacheEntry {
  timestamp: number;
  version: number;
  data: NewsApiResponse;
}

// In-memory cache stores
const latestCache = new Map<string, CacheEntry>();
const archiveCache = new Map<string, CacheEntry>();

// In-flight query coalescing store to prevent stampedes on ingest bursts
const inFlightQueries = new Map<string, Promise<NewsApiResponse>>();

const LATEST_CACHE_TTL_MS = 20 * 1000; // 20 seconds
const ARCHIVE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Cache generation counter for versioned cache invalidation on rapid feed ingests
let cacheGeneration = 1;

// Operations & Telemetry monitoring counters
let cacheHits = 0;
let cacheMisses = 0;
const queryLatencies: number[] = [];
const feedErrors: Array<{ sourceName?: string; error: string; timestamp: string }> = [];

export function bumpNewsFeedIngestVersion(): number {
  cacheGeneration++;
  latestCache.clear();
  archiveCache.clear();
  inFlightQueries.clear();
  return cacheGeneration;
}

export function getNewsFeedCacheVersion(): number {
  return cacheGeneration;
}

export function invalidateNewsFeedCache() {
  bumpNewsFeedIngestVersion();
}

/**
 * Validates operational access token against environment configuration.
 * Gating ensures telemetry, metrics, and alerts are shielded in production.
 */
export function verifyOpsToken(
  providedToken?: string | null,
  explicitExpectedToken?: string
): { authorized: boolean; reason?: string } {
  const config = getNewsFeedConfig();
  const configuredToken = explicitExpectedToken !== undefined ? explicitExpectedToken : config.opsMetricsAuthToken;

  if (!configuredToken) {
    return {
      authorized: true,
      reason: 'Bypass mode: OPS_METRICS_AUTH_TOKEN is not configured.',
    };
  }

  if (!providedToken) {
    return {
      authorized: false,
      reason: 'Authentication required. Missing Bearer or x-ops-token.',
    };
  }

  const cleanProvided = providedToken.replace(/^Bearer\s+/i, '').trim();
  if (cleanProvided === configuredToken) {
    return { authorized: true };
  }

  return {
    authorized: false,
    reason: 'Invalid operations authorization token.',
  };
}

export function recordFeedError(error: string, sourceName?: string) {
  feedErrors.unshift({
    error: String(error),
    sourceName: sourceName || 'General Ingest',
    timestamp: new Date().toISOString(),
  });
  if (feedErrors.length > 50) {
    feedErrors.pop();
  }
}

function recordLatency(ms: number) {
  queryLatencies.push(ms);
  if (queryLatencies.length > 500) {
    queryLatencies.shift();
  }
}

function calculatePercentiles(numbers: number[]) {
  if (numbers.length === 0) return { p50: 0, p95: 0, p99: 0, avg: 0 };
  const sorted = [...numbers].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)] || 0;
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || sorted[sorted.length - 1] || 0;
  const p99 = sorted[Math.floor(sorted.length * 0.99)] || sorted[sorted.length - 1] || 0;
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const avg = Math.round((sum / sorted.length) * 10) / 10;
  return { p50, p95, p99, avg };
}

/**
 * Extracts and normalizes news items from disk and live RSS,
 * ensuring all items possess valid ISO publishedAt and ingestedAt timestamps.
 */
export function loadAllNewsArticles(serverTimeISO: string): BreakingNewsArticle[] {
  const newsPath = path.resolve(process.cwd(), 'data/latestNews.json');
  let newsList: any[] = [];

  if (fs.existsSync(newsPath)) {
    try {
      newsList = JSON.parse(fs.readFileSync(newsPath, 'utf-8'));
    } catch (e) {
      console.error('[newsFeedBackend] Error parsing latestNews.json:', e);
      recordFeedError(`Disk parse error: ${e}`, 'latestNews.json');
      newsList = [];
    }
  }

  // Normalize every item to ensure publishedAt and ingestedAt exist and are ISO UTC format
  const normalized: BreakingNewsArticle[] = newsList.map((item: any) => {
    const publishedAt = normalizeArticlePublishedAt(item, serverTimeISO);
    const ingestedAt = item.ingestedAt || item.ingested_at || item.timestamp || publishedAt;
    return {
      ...item,
      publishedAt,
      ingestedAt,
      imageProvenance: item.imageProvenance || (item.imageUrl || item.image ? 'rssFeed' : 'none'),
      imageSourceField: item.imageSourceField || (item.imageUrl || item.image ? 'media:content' : null),
    };
  });

  return deduplicateNewsArticles(normalized);
}

export interface NewsFeedQuery {
  scope?: NewsFeedScope;
  category?: string;
  search?: string;
  sourceName?: string;
  sort?: 'newest' | 'oldest' | 'ner_score';
  cursor?: string;
  limit?: number;
  refresh?: boolean;
  balancePerSource?: boolean;
  maxPerSource?: number;
}

export async function processNewsFeedQuery(query: NewsFeedQuery): Promise<NewsApiResponse> {
  const scope: NewsFeedScope = query.scope || 'all';
  const coalescingKey = JSON.stringify({
    scope,
    category: query.category || 'all',
    search: query.search || '',
    sourceName: query.sourceName || '',
    sort: query.sort || 'newest',
    cursor: query.cursor || '',
    limit: query.limit || (scope === 'archive' ? 50 : 100),
    balancePerSource: query.balancePerSource,
    maxPerSource: query.maxPerSource,
  });

  // Request coalescing: reuse active in-flight query promise to prevent stampedes during ingest bursts
  if (!query.refresh && inFlightQueries.has(coalescingKey)) {
    return inFlightQueries.get(coalescingKey)!;
  }

  const taskPromise = executeNewsFeedQuery(query, coalescingKey);
  inFlightQueries.set(coalescingKey, taskPromise);

  try {
    return await taskPromise;
  } finally {
    inFlightQueries.delete(coalescingKey);
  }
}

async function executeNewsFeedQuery(query: NewsFeedQuery, cacheKey: string): Promise<NewsApiResponse> {
  const startTime = Date.now();
  let upstreamFailures = 0;
  let cacheHit = false;

  const serverTime = new Date().toISOString();
  const scope: NewsFeedScope = query.scope || 'all';
  const windows = getNewsWindows(serverTime);

  // Check in-memory cache if refresh is not requested
  if (!query.refresh) {
    const activeCache = scope === 'latest' ? latestCache : scope === 'archive' ? archiveCache : null;
    if (activeCache && activeCache.has(cacheKey)) {
      const cached = activeCache.get(cacheKey)!;
      const ttl = scope === 'latest' ? LATEST_CACHE_TTL_MS : ARCHIVE_CACHE_TTL_MS;
      if (cached.version === cacheGeneration && Date.now() - cached.timestamp < ttl) {
        cacheHit = true;
        cacheHits++;
        const latencyMs = Date.now() - startTime;
        recordLatency(latencyMs);
        console.log(
          JSON.stringify({
            event: 'news_list_query',
            scope,
            window: cached.data.window,
            latencyMs,
            count: cached.data.count,
            total: cached.data.total,
            cacheHit: true,
            cacheVersion: cacheGeneration,
            upstreamFailures: 0,
          })
        );
        return cached.data;
      } else {
        activeCache.delete(cacheKey);
        cacheMisses++;
      }
    } else {
      cacheMisses++;
    }
  } else {
    bumpNewsFeedIngestVersion();
  }

  // Load and normalize news items
  let articles = loadAllNewsArticles(serverTime);

  // 1. Time Window Precedence (section window first)
  let windowConfig: { start?: string; end?: string } = {};
  if (scope === 'latest') {
    windowConfig = {
      start: windows.latest.start,
      end: windows.latest.end,
    };
    articles = articles.filter((item) => isWithinLatestWindow(item.publishedAt!, serverTime));
  } else if (scope === 'archive') {
    windowConfig = {
      end: windows.archive.end,
    };
    articles = articles.filter((item) => isWithinArchiveWindow(item.publishedAt!, serverTime));
  } else if (scope === 'gap') {
    windowConfig = {
      start: windows.gap.start,
      end: windows.gap.end,
    };
    articles = articles.filter((item) => isWithinGapWindow(item.publishedAt!, serverTime));
  }

  // 2. Category Filter ('all' | 'albanian' | 'balkan' | 'international')
  if (query.category && query.category !== 'all') {
    articles = articles.filter((item) => item.sourceType === query.category);
  }

  // 3. Search Filter (title, content, sourceName)
  if (query.search && query.search.trim()) {
    const q = query.search.trim().toLowerCase();
    articles = articles.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.content?.toLowerCase().includes(q) ||
        item.sourceName?.toLowerCase().includes(q)
    );
  }

  // 4. Source Name Filter
  if (query.sourceName && query.sourceName.trim()) {
    articles = articles.filter((item) => item.sourceName === query.sourceName);
  }

  // 5. Sorting
  const sortMode = query.sort || 'newest';
  if (sortMode === 'ner_score') {
    articles.sort((a, b) => {
      const nerA = a.ecosystemRating ?? 0;
      const nerB = b.ecosystemRating ?? 0;
      if (nerB !== nerA) return nerB - nerA;
      return new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime();
    });
  } else if (sortMode === 'oldest') {
    articles.sort((a, b) => {
      const tA = new Date(a.publishedAt!).getTime();
      const tB = new Date(b.publishedAt!).getTime();
      if (tA !== tB) return tA - tB;
      return a.id.localeCompare(b.id);
    });
  } else {
    // Default: newest first (publishedAt DESC, id DESC)
    articles.sort((a, b) => {
      const tA = new Date(a.publishedAt!).getTime();
      const tB = new Date(b.publishedAt!).getTime();
      if (tB !== tA) return tB - tA;
      return b.id.localeCompare(a.id);
    });
  }

  const total = articles.length;

  // 6. Pagination (bounded limit for latest, cursor pagination for archive)
  let itemsToReturn: BreakingNewsArticle[] = [];
  let nextCursor: string | null = null;

  if (scope === 'archive') {
    const limit = Math.min(Math.max(query.limit || 50, 1), 100);
    // If cursor provided, filter items after cursor
    if (query.cursor) {
      articles = filterArticlesByCursor(articles, query.cursor);
    }

    if (articles.length > limit) {
      itemsToReturn = articles.slice(0, limit);
      const lastItem = itemsToReturn[itemsToReturn.length - 1];
      nextCursor = encodeNewsCursor(lastItem);
    } else {
      itemsToReturn = articles;
      nextCursor = null;
    }
  } else if (scope === 'latest') {
    // Balance titles per source: maximum 3 major stories per source
    if (query.balancePerSource !== false) {
      articles = balanceTitlesPerSource(articles, {
        maxStoriesPerSource: query.maxPerSource || 3,
        interleaveSources: !query.sourceName,
      });
    }
    // Bounded limit (max 100)
    const limit = Math.min(query.limit || 100, 100);
    itemsToReturn = articles.slice(0, limit);
    nextCursor = null;
  } else {
    // scope === 'all' or 'gap'
    if (query.balancePerSource === true) {
      articles = balanceTitlesPerSource(articles, {
        maxStoriesPerSource: query.maxPerSource || 3,
        interleaveSources: !query.sourceName,
      });
    }
    const limit = query.limit || 100;
    if (query.cursor) {
      articles = filterArticlesByCursor(articles, query.cursor);
    }
    itemsToReturn = articles.slice(0, limit);
    nextCursor = articles.length > limit ? encodeNewsCursor(itemsToReturn[itemsToReturn.length - 1]) : null;
  }

  const response: NewsApiResponse = {
    serverTime,
    scope,
    window: windowConfig,
    items: itemsToReturn,
    nextCursor,
    count: itemsToReturn.length,
    total,
  };

  // Cache response if applicable with current generation version
  if (scope === 'latest') {
    latestCache.set(cacheKey, { timestamp: Date.now(), version: cacheGeneration, data: response });
  } else if (scope === 'archive') {
    archiveCache.set(cacheKey, { timestamp: Date.now(), version: cacheGeneration, data: response });
  }

  const latencyMs = Date.now() - startTime;
  recordLatency(latencyMs);

  console.log(
    JSON.stringify({
      event: 'news_list_query',
      scope,
      window: windowConfig,
      latencyMs,
      count: response.count,
      total: response.total,
      cacheHit: false,
      cacheVersion: cacheGeneration,
      upstreamFailures,
    })
  );

  return response;
}

/**
 * Returns comprehensive Operational and Health metrics for monitoring
 */
export function getNewsFeedOpsMetrics(options?: { autoDispatchAlerts?: boolean }): OpsMetricsResponse {
  const serverTime = new Date().toISOString();
  const allArticles = loadAllNewsArticles(serverTime);

  const latestCount = allArticles.filter((a) => isWithinLatestWindow(a.publishedAt!, serverTime)).length;
  const gapCount = allArticles.filter((a) => isWithinGapWindow(a.publishedAt!, serverTime)).length;
  const archiveCount = allArticles.filter((a) => isWithinArchiveWindow(a.publishedAt!, serverTime)).length;

  const lat = calculatePercentiles(queryLatencies);
  const nerScores = allArticles.map((a) => a.ecosystemRating ?? 75).sort((a, b) => a - b);
  const avgNer = nerScores.length > 0 ? Math.round(nerScores.reduce((a, b) => a + b, 0) / nerScores.length) : 80;
  const p10Ner = nerScores.length > 0 ? nerScores[Math.floor(nerScores.length * 0.1)] || nerScores[0] : 70;

  const highCount = allArticles.filter((a) => (a.ecosystemRating ?? 0) >= 85).length;
  const mediumCount = allArticles.filter((a) => (a.ecosystemRating ?? 0) >= 70 && (a.ecosystemRating ?? 0) < 85).length;
  const lowCount = allArticles.filter((a) => (a.ecosystemRating ?? 0) < 70).length;

  const totalQueries = queryLatencies.length;
  const totalCacheRequests = cacheHits + cacheMisses;
  const hitRatio = totalCacheRequests > 0 ? Math.round((cacheHits / totalCacheRequests) * 100) / 100 : 0;

  const metrics: OpsMetricsResponse = {
    serverTime,
    cacheVersion: cacheGeneration,
    windowCounts: {
      latestCount,
      gapCount,
      archiveCount,
      totalCount: allArticles.length,
    },
    cacheStats: {
      latestEntries: latestCache.size,
      archiveEntries: archiveCache.size,
      hits: cacheHits,
      misses: cacheMisses,
      hitRatio,
    },
    latencyMetrics: {
      p50Ms: lat.p50,
      p95Ms: lat.p95,
      p99Ms: lat.p99,
      avgMs: lat.avg,
      totalQueries,
    },
    nerMetrics: {
      avgScore: avgNer,
      p10Score: p10Ner,
      highCount,
      mediumCount,
      lowCount,
    },
    imageProvenanceMetrics: calculateImageProvenanceMetrics(allArticles),
    dedupeTelemetry: getDedupeTelemetry(),
    sourceLagSummary: calculateSourceLagAlerts(allArticles, serverTime),
    topFeedErrors: feedErrors.slice(0, 10),
  };

  if (options?.autoDispatchAlerts) {
    // Non-blocking dispatch
    dispatchOpsAlertsIfNeeded(metrics).catch((err) => {
      console.error('[newsFeedBackend] Auto-dispatch alerts failed:', err);
    });
  }

  return metrics;
}

/**
 * Manually or programmatically triggers alert evaluation and webhook routing
 */
export async function evaluateAndDispatchOpsAlerts(force: boolean = false) {
  const metrics = getNewsFeedOpsMetrics();
  return await dispatchOpsAlertsIfNeeded(metrics, force);
}
