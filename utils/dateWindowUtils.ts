import { BreakingNewsArticle, DedupeTelemetry, SourceLagAlert } from '../types';
import { getNewsFeedConfig } from '../config/newsFeedConfig';

export const SIXTY_MINUTES_MS = 60 * 60 * 1000;
export const FIVE_MINUTES_SKEW_MS = 5 * 60 * 1000;
export const SIXTEEN_HOURS_MS = 16 * 60 * 60 * 1000;

// Deduplication telemetry counters
const dedupeStats: DedupeTelemetry = {
  canonicalUrlWins: 0,
  ampMobileWins: 0,
  guidWins: 0,
  syndicationWins: 0,
  idFallbackWins: 0,
  totalDedupeWins: 0,
};

export function getDedupeTelemetry(): DedupeTelemetry {
  return { ...dedupeStats };
}

export function resetDedupeTelemetry(): void {
  dedupeStats.canonicalUrlWins = 0;
  dedupeStats.ampMobileWins = 0;
  dedupeStats.guidWins = 0;
  dedupeStats.syndicationWins = 0;
  dedupeStats.idFallbackWins = 0;
  dedupeStats.totalDedupeWins = 0;
}

export interface NewsWindowsResult {
  anchor: string; // ISO 8601 UTC string
  latest: {
    start: string; // anchor - 60 minutes
    end: string;   // anchor + 5 minutes
  };
  archive: {
    end: string;   // anchor - 16 hours
  };
  gap: {
    start: string; // anchor - 16 hours
    end: string;   // anchor - 60 minutes
  };
}

/**
 * Resolves the shared UTC windows for news feed filtering.
 * Uses anchorISO when provided; falls back to client UTC with a visible console warning.
 */
export function getNewsWindows(anchorISO?: string): NewsWindowsResult {
  let anchorDate: Date;

  if (anchorISO && !isNaN(new Date(anchorISO).getTime())) {
    anchorDate = new Date(anchorISO);
  } else {
    anchorDate = new Date();
    console.warn(
      '[NewsWindow] Warning: Using client UTC fallback because server anchor was not provided or invalid:',
      anchorISO
    );
  }

  const anchorMs = anchorDate.getTime();
  const anchorStr = anchorDate.toISOString();

  const latestStartMs = anchorMs - SIXTY_MINUTES_MS;
  const latestEndMs = anchorMs + FIVE_MINUTES_SKEW_MS;
  const archiveEndMs = anchorMs - SIXTEEN_HOURS_MS;

  return {
    anchor: anchorStr,
    latest: {
      start: new Date(latestStartMs).toISOString(),
      end: new Date(latestEndMs).toISOString(),
    },
    archive: {
      end: new Date(archiveEndMs).toISOString(),
    },
    gap: {
      start: new Date(archiveEndMs).toISOString(),
      end: new Date(latestStartMs).toISOString(),
    },
  };
}

/**
 * Safely formats an ISO date string to UTC time (HH:MM:SS) without throwing RangeError.
 */
export function formatSafeUtcTime(dateStr?: string | null): string {
  if (!dateStr) return '--:--:--';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '--:--:--';
  return d.toLocaleTimeString('sq-AL', { timeZone: 'UTC' });
}

/**
 * Safely formats an ISO date string to UTC date & time without throwing RangeError.
 */
export function formatSafeUtcDateTime(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('sq-AL', { timeZone: 'UTC' });
}

/**
 * Section A (Latest News):
 * Items with publishedAt >= anchor - 60 minutes and publishedAt <= anchor + 5 minutes.
 */
export function isWithinLatestWindow(publishedAtISO: string, anchorISO?: string): boolean {
  if (!publishedAtISO) return false;
  const pubMs = new Date(publishedAtISO).getTime();
  if (isNaN(pubMs)) return false;

  const windows = getNewsWindows(anchorISO);
  const startMs = new Date(windows.latest.start).getTime();
  const endMs = new Date(windows.latest.end).getTime();

  return pubMs >= startMs && pubMs <= endMs;
}

/**
 * Section B (Archived News):
 * Items with publishedAt < anchor - 16 hours.
 */
export function isWithinArchiveWindow(publishedAtISO: string, anchorISO?: string): boolean {
  if (!publishedAtISO) return false;
  const pubMs = new Date(publishedAtISO).getTime();
  if (isNaN(pubMs)) return false;

  const windows = getNewsWindows(anchorISO);
  const endMs = new Date(windows.archive.end).getTime();

  return pubMs < endMs;
}

/**
 * Checks if an item falls into the transition gap between 60 minutes and 16 hours.
 */
export function isWithinGapWindow(publishedAtISO: string, anchorISO?: string): boolean {
  if (!publishedAtISO) return false;
  const pubMs = new Date(publishedAtISO).getTime();
  if (isNaN(pubMs)) return false;

  const windows = getNewsWindows(anchorISO);
  const gapStartMs = new Date(windows.gap.start).getTime();
  const gapEndMs = new Date(windows.gap.end).getTime();

  return pubMs >= gapStartMs && pubMs < gapEndMs;
}

/**
 * Normalizes any relative or textual date representation into a standardized ISO 8601 UTC timestamp.
 */
export function normalizeArticlePublishedAt(
  article: Partial<BreakingNewsArticle>,
  anchorISO?: string
): string {
  const anchor = anchorISO ? new Date(anchorISO) : new Date();
  const anchorMs = isNaN(anchor.getTime()) ? Date.now() : anchor.getTime();
  const dateStr = (article.publishedDate || '').trim();

  // Prioritize explicit relative minutes ("Para 25 minutash", "Para 56 minutash")
  // against anchor time to guarantee strict UI and 60-minute window consistency
  const minMatch = dateStr.match(/Para\s+(\d+)\s*min/i) || dateStr.match(/(\d+)\s*minuta?\s*më parë/i);
  if (minMatch) {
    const mins = parseInt(minMatch[1], 10);
    return new Date(anchorMs - mins * 60 * 1000).toISOString();
  }

  // 1. If explicit valid publishedAt is already set
  if (article.publishedAt) {
    const d = new Date(article.publishedAt);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  }

  if (!dateStr) {
    return new Date(anchorMs).toISOString();
  }

  // 2. Direct ISO or standard date parse
  const directDate = new Date(dateStr);
  if (!isNaN(directDate.getTime()) && directDate.getFullYear() > 2000 && !dateStr.includes('Para') && !dateStr.includes('Sot') && !dateStr.includes('Dje')) {
    return directDate.toISOString();
  }

  // 4. Match relative hours: "Para 1 ore", "Para 3 orësh", "2 orë më parë"
  const hourMatch = dateStr.match(/Para\s+(\d+)\s*or[ëe]/i) || dateStr.match(/(\d+)\s*orë?\s*më parë/i);
  if (hourMatch) {
    const hours = parseInt(hourMatch[1], 10);
    return new Date(anchorMs - hours * 3600 * 1000).toISOString();
  }

  // 5. Match today: "Sot, 13:45"
  const todayMatch = dateStr.match(/Sot,\s*(\d{1,2}):(\d{2})/i);
  if (todayMatch) {
    const hours = parseInt(todayMatch[1], 10);
    const mins = parseInt(todayMatch[2], 10);
    const today = new Date(anchorMs);
    today.setUTCHours(hours, mins, 0, 0);
    // If future because of UTC vs local, keep it reasonable
    return today.toISOString();
  }

  // 6. Match yesterday: "Dje, 21:40"
  const yestMatch = dateStr.match(/Dje,\s*(\d{1,2}):(\d{2})/i);
  if (yestMatch) {
    const hours = parseInt(yestMatch[1], 10);
    const mins = parseInt(yestMatch[2], 10);
    const yest = new Date(anchorMs - 24 * 3600 * 1000);
    yest.setUTCHours(hours, mins, 0, 0);
    return yest.toISOString();
  }

  // Fallback to direct parse or anchor time
  if (!isNaN(directDate.getTime())) {
    return directDate.toISOString();
  }

  return new Date(anchorMs).toISOString();
}

/**
 * Returns formatted relative time string (e.g. "12 min ago" / "12 min më parë")
 */
export function formatRelativeNewsTime(publishedAtISO: string, anchorISO?: string): string {
  if (!publishedAtISO) return 'I panjohur';
  const pubMs = new Date(publishedAtISO).getTime();
  if (isNaN(pubMs)) return 'I panjohur';

  const anchor = anchorISO ? new Date(anchorISO) : new Date();
  const anchorMs = isNaN(anchor.getTime()) ? Date.now() : anchor.getTime();
  const diffMs = anchorMs - pubMs;

  // Future or clock skew tolerance
  if (diffMs < -60000) {
    return 'LIVE // Sapo transmetuar';
  }
  if (diffMs < 60000) {
    return 'Tani (Sapo u publikua)';
  }

  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `Para ${diffHours} ${diffHours === 1 ? 'ore' : 'orësh'}`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    const d = new Date(pubMs);
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mm = String(d.getUTCMinutes()).padStart(2, '0');
    return `Dje, ${hh}:${mm} UTC`;
  }

  return `Para ${diffDays} ditësh`;
}

/**
 * Normalizes canonical article URLs to eliminate query tracking noise,
 * standardizes protocols (http -> https), strips mobile/AMP subdomains and path variants,
 * and eliminates trailing slashes.
 */
export function normalizeCanonicalUrl(url?: string): string {
  if (!url) return '';
  try {
    const raw = url.trim();
    let parsed = new URL(raw);

    // Standardize protocol to https for non-local domains
    if (parsed.protocol === 'http:' && !parsed.hostname.includes('localhost') && !parsed.hostname.startsWith('127.')) {
      parsed.protocol = 'https:';
    }

    // Strip common tracking and syndication parameters
    const searchParams = new URLSearchParams(parsed.search);
    const trackingKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'utm_id',
      'utm_reader',
      'fbclid',
      'gclid',
      'ref',
      'source',
      'ocid',
      'igshid',
      'mkt_tok',
      'mc_cid',
      'mc_eid',
      '_hsenc',
      '_hsmi',
      'cmpid',
      'yclid',
      'wickedid',
      'msclkid',
      'amp',
      'outputType',
    ];
    for (const key of trackingKeys) {
      searchParams.delete(key);
    }

    // Normalize mobile and AMP subdomains (e.g., m.bbc.com -> bbc.com, amp.theguardian.com -> theguardian.com)
    let hostname = parsed.hostname.toLowerCase();
    if (hostname.startsWith('m.') && hostname.length > 4) {
      hostname = hostname.substring(2);
    } else if (hostname.startsWith('mobile.') && hostname.length > 9) {
      hostname = hostname.substring(7);
    } else if (hostname.startsWith('amp.') && hostname.length > 6) {
      hostname = hostname.substring(4);
    }

    // Normalize AMP path variants (e.g. /news/world-12345/amp -> /news/world-12345)
    let pathname = parsed.pathname;
    pathname = pathname.replace(/\/amp\/?$/i, '');
    pathname = pathname.replace(/\.amp\.html$/i, '.html');
    pathname = pathname.replace(/\/+$/, ''); // Strip trailing slashes

    const cleanSearch = searchParams.toString();
    return `${parsed.protocol}//${hostname}${pathname}${cleanSearch ? `?${cleanSearch}` : ''}`;
  } catch (e) {
    let clean = (url || '').trim().toLowerCase().replace(/\/+$/, '');
    if (clean.startsWith('http://')) {
      clean = 'https://' + clean.substring(7);
    }
    return clean;
  }
}

/**
 * Extracts a normalized syndication key based on slug and publication day
 * to detect cross-syndicated copies across outlets.
 */
export function getSyndicationSlugKey(item: BreakingNewsArticle): string {
  const titleSlug = (item.title || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 60);

  const datePart = (item.publishedAt || item.publishedDate || '').substring(0, 10);
  return titleSlug ? `synd:${datePart}:${titleSlug}` : '';
}

/**
 * Deduplication rules:
 * 1. Primary key: normalized canonical link (including mobile/AMP normalization)
 * 2. Secondary key: feed guid / itemGuid
 * 3. Syndication key: identical title slug + publication date
 * 4. Fallback: item ID
 *
 * Collision resolution:
 * - Prefer higher ecosystemRating (NER integrity)
 * - If equal, prefer newest publishedAt
 * - Retain transparent source attribution
 * - Increments telemetry counters for dedupe wins by rule.
 */
export function deduplicateNewsArticles(articles: BreakingNewsArticle[]): BreakingNewsArticle[] {
  const map = new Map<string, BreakingNewsArticle>();
  const syndicationMap = new Map<string, string>(); // slugKey -> dedupeKey

  for (const item of articles) {
    const rawUrl = item.originalArticleUrl || item.feedUrl || '';
    const canonicalLink = normalizeCanonicalUrl(rawUrl);
    const guid = item.feedXml?.guid || item.feedXml?.id || (typeof item.id === 'string' ? item.id : '');
    const syndKey = getSyndicationSlugKey(item);

    let matchRule: 'canonical' | 'amp_mobile' | 'guid' | 'syndication' | 'id_fallback' = 'canonical';
    let dedupeKey = canonicalLink;

    if (canonicalLink) {
      // Check if URL was changed due to mobile/AMP or protocol normalization
      if (rawUrl && (rawUrl.includes('/amp') || rawUrl.includes('m.') || rawUrl.includes('mobile.') || rawUrl.startsWith('http://'))) {
        matchRule = 'amp_mobile';
      } else {
        matchRule = 'canonical';
      }
    } else if (guid) {
      dedupeKey = `guid:${guid}`;
      matchRule = 'guid';
    } else if (syndKey && syndicationMap.has(syndKey)) {
      dedupeKey = syndicationMap.get(syndKey)!;
      matchRule = 'syndication';
    } else {
      dedupeKey = `id:${item.id}`;
      matchRule = 'id_fallback';
    }

    if (syndKey && !syndicationMap.has(syndKey)) {
      syndicationMap.set(syndKey, dedupeKey);
    }

    if (!map.has(dedupeKey)) {
      map.set(dedupeKey, item);
    } else {
      // Dedupe collision resolved!
      dedupeStats.totalDedupeWins++;
      if (matchRule === 'amp_mobile') dedupeStats.ampMobileWins++;
      else if (matchRule === 'canonical') dedupeStats.canonicalUrlWins++;
      else if (matchRule === 'guid') dedupeStats.guidWins++;
      else if (matchRule === 'syndication') dedupeStats.syndicationWins++;
      else dedupeStats.idFallbackWins++;

      const existing = map.get(dedupeKey)!;
      const existingNer = existing.ecosystemRating ?? 0;
      const itemNer = item.ecosystemRating ?? 0;

      if (itemNer > existingNer) {
        map.set(dedupeKey, item);
      } else if (itemNer === existingNer) {
        const existingTime = new Date(existing.publishedAt || existing.publishedDate).getTime();
        const itemTime = new Date(item.publishedAt || item.publishedDate).getTime();
        if (itemTime > existingTime) {
          map.set(dedupeKey, item);
        }
      }
    }
  }

  return Array.from(map.values());
}

/**
 * Encodes cursor for archive pagination:
 * Combines ISO publishedAt and id to guarantee deterministic traversal without skips or duplicates.
 */
export function encodeNewsCursor(item: BreakingNewsArticle): string {
  const publishedAt = item.publishedAt || new Date().toISOString();
  return `${encodeURIComponent(publishedAt)}___${encodeURIComponent(item.id)}`;
}

/**
 * Decodes cursor back into components.
 */
export function decodeNewsCursor(cursor: string): { publishedAt: string; id: string } | null {
  if (!cursor || typeof cursor !== 'string') return null;
  const parts = cursor.split('___');
  if (parts.length !== 2) return null;
  try {
    return {
      publishedAt: decodeURIComponent(parts[0]),
      id: decodeURIComponent(parts[1]),
    };
  } catch (e) {
    return null;
  }
}

/**
 * Applies cursor filtering for archive queries:
 * ordered by publishedAt DESC, id DESC.
 */
export function filterArticlesByCursor(
  articles: BreakingNewsArticle[],
  cursor: string
): BreakingNewsArticle[] {
  const decoded = decodeNewsCursor(cursor);
  if (!decoded) return articles;

  const cursorMs = new Date(decoded.publishedAt).getTime();
  if (isNaN(cursorMs)) return articles;

  return articles.filter((item) => {
    const itemMs = new Date(item.publishedAt || item.publishedDate).getTime();
    if (isNaN(itemMs)) return false;

    if (itemMs < cursorMs) return true;
    if (itemMs === cursorMs) {
      return item.id < decoded.id;
    }
    return false;
  });
}

export interface ReconcileBackfillOptions {
  thresholdHours?: number;
  dryRun?: boolean;
  maxAgeHours?: number;
}

export interface BackfillReconciliationPlanItem {
  id: string;
  title: string;
  publishedAt: string;
  ingestedAt: string;
  skewHours: number;
  action: 'AUDIT_INDEX' | 'REINDEX_CURSOR';
}

export interface BackfillReconciliationReport {
  dryRun: boolean;
  backfilledItems: BreakingNewsArticle[];
  regularItems: BreakingNewsArticle[];
  backfillCount: number;
  reconciliationPlan: BackfillReconciliationPlanItem[];
  summary: {
    scanned: number;
    backfillsFound: number;
    maxSkewHours: number;
  };
}

/**
 * Archive Backfill Reconciliation Utility:
 * Identifies articles where ingestedAt is substantially newer than publishedAt (> threshold),
 * indicating historical data backfill.
 * Supports dryRun mode to plan and audit without issuing destructive mutations.
 */
export function reconcileArchiveBackfills(
  articles: BreakingNewsArticle[],
  optionsOrThreshold: number | ReconcileBackfillOptions = 24
): BackfillReconciliationReport {
  const options: ReconcileBackfillOptions =
    typeof optionsOrThreshold === 'number'
      ? { thresholdHours: optionsOrThreshold, dryRun: false }
      : { thresholdHours: 24, dryRun: false, ...optionsOrThreshold };

  const thresholdHours = options.thresholdHours ?? 24;
  const dryRun = options.dryRun ?? false;
  const maxAgeHours = options.maxAgeHours;
  const thresholdMs = thresholdHours * 3600 * 1000;

  const backfilledItems: BreakingNewsArticle[] = [];
  const regularItems: BreakingNewsArticle[] = [];
  const reconciliationPlan: BackfillReconciliationPlanItem[] = [];
  let maxSkewHours = 0;

  for (const article of articles) {
    if (article.ingestedAt && article.publishedAt) {
      const ingMs = new Date(article.ingestedAt).getTime();
      const pubMs = new Date(article.publishedAt).getTime();
      if (!isNaN(ingMs) && !isNaN(pubMs)) {
        const skewMs = ingMs - pubMs;
        if (skewMs > thresholdMs) {
          const skewHours = Math.round((skewMs / (3600 * 1000)) * 10) / 10;
          if (skewHours > maxSkewHours) {
            maxSkewHours = skewHours;
          }

          if (maxAgeHours === undefined || skewHours <= maxAgeHours) {
            backfilledItems.push(article);
            reconciliationPlan.push({
              id: String(article.id),
              title: article.title,
              publishedAt: article.publishedAt,
              ingestedAt: article.ingestedAt,
              skewHours,
              action: skewHours > 72 ? 'REINDEX_CURSOR' : 'AUDIT_INDEX',
            });
            continue;
          }
        }
      }
    }
    regularItems.push(article);
  }

  return {
    dryRun,
    backfilledItems,
    regularItems,
    backfillCount: backfilledItems.length,
    reconciliationPlan,
    summary: {
      scanned: articles.length,
      backfillsFound: backfilledItems.length,
      maxSkewHours,
    },
  };
}

/**
 * Calculates image provenance metrics across a set of articles:
 * Tracks breakdown of native RSS media vs article OG runtime fallback vs none,
 * and sets an alert if OG fallback ratio exceeds the configured threshold (default 35%).
 */
export function calculateImageProvenanceMetrics(
  articles: BreakingNewsArticle[],
  customThreshold?: number
): {
  rssFeedCount: number;
  articleOgCount: number;
  noneCount: number;
  ogFallbackRatio: number;
  ogDominationAlert: boolean;
  thresholdApplied: number;
} {
  const config = getNewsFeedConfig();
  const threshold = customThreshold ?? config.ogDominationThreshold;

  let rssFeedCount = 0;
  let articleOgCount = 0;
  let noneCount = 0;

  for (const item of articles) {
    if (item.imageProvenance === 'articleOg' || item.imageProvenance === 'articleOpenGraph') {
      articleOgCount++;
    } else if (item.imageProvenance === 'rssFeed' || item.imageUrl || item.image) {
      rssFeedCount++;
    } else {
      noneCount++;
    }
  }

  const totalWithImages = rssFeedCount + articleOgCount;
  const ogFallbackRatio = totalWithImages > 0 ? Math.round((articleOgCount / totalWithImages) * 100) / 100 : 0;
  const ogDominationAlert = ogFallbackRatio > threshold;

  return {
    rssFeedCount,
    articleOgCount,
    noneCount,
    ogFallbackRatio,
    ogDominationAlert,
    thresholdApplied: threshold,
  };
}

/**
 * Calculates per-source freshness and lag alerts using config-driven thresholds:
 * now - newestItemPublishedAt per outlet.
 * Evaluates:
 * - WARNING: lag > albanianWarnMin (national) or > intlWarnMin (regional/intl)
 * - CRITICAL: lag > albanianCritMin (national) or > intlCritMin (regional/intl)
 */
export function calculateSourceLagAlerts(
  articles: BreakingNewsArticle[],
  serverTimeISO?: string,
  thresholdOverrides?: {
    albanianWarnMin?: number;
    albanianCritMin?: number;
    intlWarnMin?: number;
    intlCritMin?: number;
  }
): {
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  alerts: SourceLagAlert[];
} {
  const config = getNewsFeedConfig();
  const albWarn = thresholdOverrides?.albanianWarnMin ?? config.albanianWarnMin;
  const albCrit = thresholdOverrides?.albanianCritMin ?? config.albanianCritMin;
  const intlWarn = thresholdOverrides?.intlWarnMin ?? config.intlWarnMin;
  const intlCrit = thresholdOverrides?.intlCritMin ?? config.intlCritMin;

  const nowMs = serverTimeISO ? new Date(serverTimeISO).getTime() : Date.now();
  const sourceMap = new Map<string, { sourceType: any; newestMs: number; newestDate: string }>();

  for (const item of articles) {
    if (!item.sourceName) continue;
    const pubMs = new Date(item.publishedAt || item.publishedDate).getTime();
    if (isNaN(pubMs)) continue;

    if (!sourceMap.has(item.sourceName)) {
      sourceMap.set(item.sourceName, {
        sourceType: item.sourceType || 'albanian',
        newestMs: pubMs,
        newestDate: item.publishedAt || item.publishedDate,
      });
    } else {
      const cur = sourceMap.get(item.sourceName)!;
      if (pubMs > cur.newestMs) {
        cur.newestMs = pubMs;
        cur.newestDate = item.publishedAt || item.publishedDate;
      }
    }
  }

  const alerts: SourceLagAlert[] = [];
  let healthyCount = 0;
  let warningCount = 0;
  let criticalCount = 0;

  for (const [sourceName, data] of sourceMap.entries()) {
    const lagMinutes = Math.max(0, Math.round((nowMs - data.newestMs) / (60 * 1000)));
    const isNational = data.sourceType === 'albanian';
    const warnLimit = isNational ? albWarn : intlWarn;
    const critLimit = isNational ? albCrit : intlCrit;

    let status: 'HEALTHY' | 'WARNING' | 'CRITICAL' = 'HEALTHY';
    if (lagMinutes > critLimit) {
      status = 'CRITICAL';
      criticalCount++;
    } else if (lagMinutes > warnLimit) {
      status = 'WARNING';
      warningCount++;
    } else {
      healthyCount++;
    }

    alerts.push({
      sourceName,
      sourceType: data.sourceType,
      newestPublishedAt: data.newestDate,
      lagMinutes,
      status,
    });
  }

  // Sort by lag DESC
  alerts.sort((a, b) => b.lagMinutes - a.lagMinutes);

  return {
    healthyCount,
    warningCount,
    criticalCount,
    alerts,
  };
}
