import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import {
  BreakingNewsArticle,
  SourceType,
  NewsAuthenticityRating,
  SourceReliabilityRating,
} from '../types';
import { pickFeedImage } from './imageResolverService';
import { bumpNewsFeedIngestVersion, recordFeedError } from './newsFeedBackend';
import { deduplicateNewsArticles } from '../utils/dateWindowUtils';

export interface FeedSource {
  id: string;
  sourceName: string;
  sourceType: SourceType;
  feedUrl: string;
  siteUrl: string;
  defaultSeverity: 'high' | 'medium' | 'low';
  sourceReliability: SourceReliabilityRating;
  newsAuthenticity: NewsAuthenticityRating;
  ecosystemRating: number;
  nerVersion: string;
  nerBreakdown: { SRS: number; CIS: number; CSC: number; TRF: number; ECM: number };
  enabled: boolean;
}

/**
 * Authoritative production RSS/Atom feed registry
 * Covering Albanian national, regional Balkan, and international tier-1 press.
 */
export const RSS_FEEDS: FeedSource[] = [
  // Albanian National News Feeds
  {
    id: 'rtsh-al',
    sourceName: 'RTSH',
    sourceType: 'albanian',
    feedUrl: 'https://rtsh.al/feed/',
    siteUrl: 'https://rtsh.al',
    defaultSeverity: 'medium',
    sourceReliability: 'VERY_HIGH_REPUTATION',
    newsAuthenticity: 'VERIFIED_ACCURATE',
    ecosystemRating: 95,
    nerVersion: 'NER-v2.4',
    nerBreakdown: { SRS: 96, CIS: 95, CSC: 95, TRF: 96, ECM: 94 },
    enabled: true,
  },
  {
    id: 'euronews-al',
    sourceName: 'Euronews Albania',
    sourceType: 'albanian',
    feedUrl: 'https://euronews.al/feed/',
    siteUrl: 'https://euronews.al',
    defaultSeverity: 'medium',
    sourceReliability: 'VERY_HIGH_REPUTATION',
    newsAuthenticity: 'VERIFIED_ACCURATE',
    ecosystemRating: 96,
    nerVersion: 'NER-v2.4',
    nerBreakdown: { SRS: 97, CIS: 96, CSC: 96, TRF: 97, ECM: 95 },
    enabled: true,
  },
  {
    id: 'reporter-al',
    sourceName: 'Reporter.al',
    sourceType: 'albanian',
    feedUrl: 'https://www.reporter.al/feed/',
    siteUrl: 'https://www.reporter.al',
    defaultSeverity: 'high',
    sourceReliability: 'VERY_HIGH_REPUTATION',
    newsAuthenticity: 'VERIFIED_ACCURATE',
    ecosystemRating: 97,
    nerVersion: 'NER-v2.4',
    nerBreakdown: { SRS: 98, CIS: 96, CSC: 97, TRF: 98, ECM: 96 },
    enabled: true,
  },
  {
    id: 'telegrafi-al',
    sourceName: 'Telegrafi',
    sourceType: 'albanian',
    feedUrl: 'https://telegrafi.com/feed/',
    siteUrl: 'https://telegrafi.com',
    defaultSeverity: 'medium',
    sourceReliability: 'HIGH_REPUTATION',
    newsAuthenticity: 'VERIFIED_ACCURATE',
    ecosystemRating: 93,
    nerVersion: 'NER-v2.4',
    nerBreakdown: { SRS: 94, CIS: 93, CSC: 93, TRF: 94, ECM: 92 },
    enabled: true,
  },
  {
    id: 'monitor-al',
    sourceName: 'Monitor Ekonomik',
    sourceType: 'albanian',
    feedUrl: 'https://monitor.al/feed/',
    siteUrl: 'https://monitor.al',
    defaultSeverity: 'medium',
    sourceReliability: 'HIGH_REPUTATION',
    newsAuthenticity: 'VERIFIED_ACCURATE',
    ecosystemRating: 95,
    nerVersion: 'NER-v2.4',
    nerBreakdown: { SRS: 96, CIS: 95, CSC: 95, TRF: 96, ECM: 94 },
    enabled: true,
  },

  // Balkan Regional News Feeds
  {
    id: 'gazeta-express',
    sourceName: 'Gazeta Express',
    sourceType: 'regional',
    feedUrl: 'https://gazetaexpress.com/feed/',
    siteUrl: 'https://gazetaexpress.com',
    defaultSeverity: 'medium',
    sourceReliability: 'HIGH_REPUTATION',
    newsAuthenticity: 'VERIFIED_ACCURATE',
    ecosystemRating: 92,
    nerVersion: 'NER-v2.4',
    nerBreakdown: { SRS: 93, CIS: 92, CSC: 92, TRF: 93, ECM: 91 },
    enabled: true,
  },
  {
    id: 'koha-net',
    sourceName: 'Koha Ditore',
    sourceType: 'balkan',
    feedUrl: 'https://www.koha.net/rss',
    siteUrl: 'https://www.koha.net',
    defaultSeverity: 'medium',
    sourceReliability: 'VERY_HIGH_REPUTATION',
    newsAuthenticity: 'VERIFIED_ACCURATE',
    ecosystemRating: 96,
    nerVersion: 'NER-v2.4',
    nerBreakdown: { SRS: 96, CIS: 96, CSC: 97, TRF: 95, ECM: 96 },
    enabled: true,
  },
  {
    id: 'balkan-insight',
    sourceName: 'Balkan Insight',
    sourceType: 'balkan',
    feedUrl: 'https://balkaninsight.com/feed/',
    siteUrl: 'https://balkaninsight.com',
    defaultSeverity: 'high',
    sourceReliability: 'VERY_HIGH_REPUTATION',
    newsAuthenticity: 'VERIFIED_ACCURATE',
    ecosystemRating: 98,
    nerVersion: 'NER-v2.4',
    nerBreakdown: { SRS: 99, CIS: 97, CSC: 98, TRF: 98, ECM: 97 },
    enabled: true,
  },

  // International Tier-1 News Feeds
  {
    id: 'bbc-news',
    sourceName: 'BBC News',
    sourceType: 'international',
    feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml',
    siteUrl: 'https://www.bbc.com/news',
    defaultSeverity: 'high',
    sourceReliability: 'VERY_HIGH_REPUTATION',
    newsAuthenticity: 'VERIFIED_ACCURATE',
    ecosystemRating: 98,
    nerVersion: 'NER-v2.4',
    nerBreakdown: { SRS: 99, CIS: 97, CSC: 98, TRF: 99, ECM: 97 },
    enabled: true,
  },
  {
    id: 'the-guardian',
    sourceName: 'The Guardian',
    sourceType: 'international',
    feedUrl: 'https://www.theguardian.com/world/rss',
    siteUrl: 'https://www.theguardian.com',
    defaultSeverity: 'high',
    sourceReliability: 'VERY_HIGH_REPUTATION',
    newsAuthenticity: 'VERIFIED_ACCURATE',
    ecosystemRating: 97,
    nerVersion: 'NER-v2.4',
    nerBreakdown: { SRS: 98, CIS: 96, CSC: 97, TRF: 97, ECM: 96 },
    enabled: true,
  },
  {
    id: 'france-24',
    sourceName: 'France 24',
    sourceType: 'international',
    feedUrl: 'https://www.france24.com/en/rss',
    siteUrl: 'https://www.france24.com',
    defaultSeverity: 'medium',
    sourceReliability: 'VERY_HIGH_REPUTATION',
    newsAuthenticity: 'VERIFIED_ACCURATE',
    ecosystemRating: 96,
    nerVersion: 'NER-v2.4',
    nerBreakdown: { SRS: 96, CIS: 95, CSC: 96, TRF: 96, ECM: 95 },
    enabled: true,
  },
];

export interface FeedIngestStatus {
  feedId: string;
  sourceName: string;
  sourceType: SourceType;
  itemsFetched: number;
  latencyMs: number;
  success: boolean;
  error?: string;
  lastUpdated: string;
}

export interface IngestReport {
  timestamp: string;
  durationMs: number;
  totalParsed: number;
  newItemsAdded: number;
  totalItemsOnDisk: number;
  feeds: FeedIngestStatus[];
}

let lastIngestReport: IngestReport | null = null;

export function getLastIngestReport(): IngestReport | null {
  return lastIngestReport;
}

function createRssParser(timeoutMs = 8000): Parser {
  return new Parser({
    timeout: timeoutMs,
    headers: {
      'User-Agent': 'NOVARIC-Media-Monitor/2.0 (+https://novaric.al)',
      'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
    },
    customFields: {
      item: [
        ['media:content', 'mediaContent', { keepArray: true }],
        ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
        ['enclosure', 'enclosure'],
        ['itunes:image', 'itunesImage'],
        ['content:encoded', 'contentEncoded'],
      ],
    },
  });
}

function stripHtmlTags(input?: string): string {
  if (!input) return '';
  return input
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function formatRelativePublishedDate(publishedAtISO: string, referenceISO: string): string {
  const pubMs = new Date(publishedAtISO).getTime();
  const refMs = new Date(referenceISO).getTime();
  const diffMs = refMs - pubMs;

  if (diffMs < 0 || isNaN(diffMs)) {
    return 'Sapo përditësuar';
  }

  const diffMins = Math.floor(diffMs / (60 * 1000));
  if (diffMins < 1) {
    return 'Sapo përditësuar';
  }
  if (diffMins < 60) {
    return `Para ${diffMins} minutash`;
  }

  const diffHours = Math.floor(diffMs / (3600 * 1000));
  if (diffHours < 24) {
    const pubDate = new Date(pubMs);
    const hours = String(pubDate.getUTCHours()).padStart(2, '0');
    const mins = String(pubDate.getUTCMinutes()).padStart(2, '0');
    return `Sot, ${hours}:${mins}`;
  }

  if (diffHours < 48) {
    const pubDate = new Date(pubMs);
    const hours = String(pubDate.getUTCHours()).padStart(2, '0');
    const mins = String(pubDate.getUTCMinutes()).padStart(2, '0');
    return `Dje, ${hours}:${mins}`;
  }

  const pubDate = new Date(pubMs);
  const day = pubDate.getUTCDate();
  const months = [
    'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
    'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'
  ];
  return `${day} ${months[pubDate.getUTCMonth()]}, ${pubDate.getUTCFullYear()}`;
}

const FALLBACK_IMAGES: Record<SourceType, string> = {
  albanian: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1000&q=80',
  balkan: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80',
  international: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
  regional: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=80',
};

/**
 * Converts a raw parsed RSS item into a structured BreakingNewsArticle
 */
export function transformRssItemToArticle(
  rawItem: any,
  source: FeedSource,
  serverTimeISO: string
): BreakingNewsArticle | null {
  const link = (rawItem.link || rawItem.guid || '').trim();
  const title = (rawItem.title || '').trim();

  if (!title || !link) {
    return null;
  }

  const rawExcerpt =
    rawItem.contentSnippet ||
    rawItem.content ||
    rawItem.summary ||
    rawItem.contentEncoded ||
    '';
  const cleanExcerpt = stripHtmlTags(rawExcerpt).slice(0, 480);

  // Pick feed-native media with strictly "rssFeed" provenance
  const feedImage = pickFeedImage(rawItem);
  const fallbackImg = FALLBACK_IMAGES[source.sourceType];
  const finalImageUrl = feedImage?.imageUrl || fallbackImg;

  // Resolve authentic ISO 8601 publishedAt
  let publishedAt: string;
  if (rawItem.isoDate && !isNaN(new Date(rawItem.isoDate).getTime())) {
    publishedAt = new Date(rawItem.isoDate).toISOString();
  } else if (rawItem.pubDate && !isNaN(new Date(rawItem.pubDate).getTime())) {
    publishedAt = new Date(rawItem.pubDate).toISOString();
  } else {
    publishedAt = serverTimeISO;
  }

  const publishedDate = formatRelativePublishedDate(publishedAt, serverTimeISO);
  const itemHash = hashString(link || title);
  const id = `rss-${source.id}-${itemHash}`;

  return {
    id,
    title,
    title_sq: source.sourceType === 'international' ? undefined : title,
    title_en: source.sourceType === 'international' ? title : undefined,
    content: cleanExcerpt,
    content_sq: source.sourceType === 'international' ? undefined : cleanExcerpt,
    content_en: source.sourceType === 'international' ? cleanExcerpt : undefined,
    imageUrl: finalImageUrl,
    image: feedImage?.imageUrl || finalImageUrl,
    imageThumb: feedImage?.thumbUrl || finalImageUrl,
    imageProvenance: feedImage?.provenance || (feedImage?.imageUrl ? 'rssFeed' : 'none'),
    imageSourceField: feedImage?.sourceField || (feedImage?.imageUrl ? 'media:content' : null),
    feedXml: {
      title,
      link,
      mediaContent: rawItem.mediaContent,
      mediaThumbnail: rawItem.mediaThumbnail,
      enclosure: rawItem.enclosure,
      itunesImage: rawItem.itunesImage,
    },
    publishedDate,
    publishedAt,
    ingestedAt: serverTimeISO,
    sourceName: source.sourceName,
    sourceType: source.sourceType,
    feedUrl: source.feedUrl,
    originalArticleUrl: link,
    severity: source.defaultSeverity,
    isHighlyRelevantCurrentDevelopment: true,
    newsAuthenticity: source.newsAuthenticity,
    sourceReliability: source.sourceReliability,
    ecosystemRating: source.ecosystemRating,
    nerVersion: source.nerVersion,
    nerBreakdown: source.nerBreakdown,
  };
}

/**
 * Fetches a single RSS feed with timeout and resilience
 */
export async function fetchFeed(
  source: FeedSource,
  serverTimeISO: string,
  timeoutMs = 7000
): Promise<{ articles: BreakingNewsArticle[]; status: FeedIngestStatus }> {
  const startTime = Date.now();
  const parser = createRssParser(timeoutMs);

  try {
    const feed = await parser.parseURL(source.feedUrl);
    const latencyMs = Date.now() - startTime;
    const rawItems = feed.items || [];
    const articles: BreakingNewsArticle[] = [];

    for (const rawItem of rawItems) {
      const article = transformRssItemToArticle(rawItem, source, serverTimeISO);
      if (article) {
        articles.push(article);
      }
    }

    const status: FeedIngestStatus = {
      feedId: source.id,
      sourceName: source.sourceName,
      sourceType: source.sourceType,
      itemsFetched: articles.length,
      latencyMs,
      success: true,
      lastUpdated: serverTimeISO,
    };

    return { articles, status };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    const errorMsg = err?.message || String(err);
    recordFeedError(`RSS fetch error for ${source.sourceName}: ${errorMsg}`, source.sourceName);

    const status: FeedIngestStatus = {
      feedId: source.id,
      sourceName: source.sourceName,
      sourceType: source.sourceType,
      itemsFetched: 0,
      latencyMs,
      success: false,
      error: errorMsg,
      lastUpdated: serverTimeISO,
    };

    return { articles: [], status };
  }
}

/**
 * Fetches all configured RSS feeds in parallel
 */
export async function fetchAllFeeds(
  serverTimeISO = new Date().toISOString(),
  timeoutMs = 8000
): Promise<{ articles: BreakingNewsArticle[]; feedStatuses: FeedIngestStatus[] }> {
  const activeFeeds = RSS_FEEDS.filter((f) => f.enabled);
  const results = await Promise.allSettled(
    activeFeeds.map((feed) => fetchFeed(feed, serverTimeISO, timeoutMs))
  );

  const allArticles: BreakingNewsArticle[] = [];
  const feedStatuses: FeedIngestStatus[] = [];

  for (const res of results) {
    if (res.status === 'fulfilled') {
      allArticles.push(...res.value.articles);
      feedStatuses.push(res.value.status);
    }
  }

  // Deduplicate across all feeds
  const dedupedArticles = deduplicateNewsArticles(allArticles);
  return { articles: dedupedArticles, feedStatuses };
}

/**
 * Core Ingestion Engine:
 * Fetches real RSS feeds, merges them with existing disk records,
 * saves to data/latestNews.json, and invalidates news feed caches.
 */
export async function syncRssFeedsToDisk(options?: {
  timeoutMs?: number;
  diskPath?: string;
}): Promise<IngestReport> {
  const startTime = Date.now();
  const serverTimeISO = new Date().toISOString();
  const targetPath =
    options?.diskPath || path.resolve(process.cwd(), 'data/latestNews.json');

  // Load existing articles to preserve archive history
  let existingArticles: BreakingNewsArticle[] = [];
  if (fs.existsSync(targetPath)) {
    try {
      const content = fs.readFileSync(targetPath, 'utf-8');
      existingArticles = JSON.parse(content);
    } catch (e) {
      console.warn('[rssIngestor] Unable to read existing latestNews.json, starting fresh:', e);
      existingArticles = [];
    }
  }

  // Fetch live RSS feeds
  const { articles: freshArticles, feedStatuses } = await fetchAllFeeds(
    serverTimeISO,
    options?.timeoutMs || 8000
  );

  // Merge fresh items with existing archive:
  // Key by originalArticleUrl or normalized title to eliminate duplicates
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const merged: BreakingNewsArticle[] = [];
  let newItemsAdded = 0;

  // 1. Fresh items first
  for (const item of freshArticles) {
    const urlKey = item.originalArticleUrl?.trim().toLowerCase();
    const titleKey = item.title?.trim().toLowerCase();
    if (urlKey && seenUrls.has(urlKey)) continue;
    if (titleKey && seenTitles.has(titleKey)) continue;

    if (urlKey) seenUrls.add(urlKey);
    if (titleKey) seenTitles.add(titleKey);
    merged.push(item);
    newItemsAdded++;
  }

  // 2. Append existing items that were not present in the fresh feed (archive retention)
  for (const item of existingArticles) {
    const urlKey = item.originalArticleUrl?.trim().toLowerCase();
    const titleKey = item.title?.trim().toLowerCase();
    if (urlKey && seenUrls.has(urlKey)) continue;
    if (titleKey && seenTitles.has(titleKey)) continue;

    if (urlKey) seenUrls.add(urlKey);
    if (titleKey) seenTitles.add(titleKey);
    merged.push(item);
  }

  // Save merged real news items back to disk
  try {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetPath, JSON.stringify(merged, null, 2), 'utf-8');
  } catch (writeErr) {
    console.error('[rssIngestor] Failed to write latestNews.json:', writeErr);
  }

  // Invalidate in-memory caches to immediately serve the fresh data
  bumpNewsFeedIngestVersion();

  const report: IngestReport = {
    timestamp: serverTimeISO,
    durationMs: Date.now() - startTime,
    totalParsed: freshArticles.length,
    newItemsAdded,
    totalItemsOnDisk: merged.length,
    feeds: feedStatuses,
  };

  lastIngestReport = report;
  console.log(
    `[rssIngestor] Ingest complete: +${newItemsAdded} new articles (${merged.length} total on disk) in ${report.durationMs}ms`
  );

  return report;
}
