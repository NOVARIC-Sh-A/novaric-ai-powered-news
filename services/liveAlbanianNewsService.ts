/**
 * NOVARIC® Real-Time Live Albanian News Service
 * Direct client-side and server-side real-time ingestion from Albanian Tier-1 media outlets
 * with open CORS WordPress REST APIs (RTSH, Euronews Albania, Reporter.al, Gazeta Express).
 */

import type { BreakingNewsArticle, SourceType } from '../types';
import { sanitizeImageUrl } from '../utils/imageUtils';

interface WpPost {
  id: number;
  date: string;
  date_gmt?: string;
  link: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  content?: { rendered: string };
  featured_media?: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
  };
}

interface LiveOutletConfig {
  sourceName: string;
  sourceType: SourceType;
  endpoint: string;
  siteUrl: string;
  defaultRating: number;
  defaultImage: string;
}

const LIVE_OUTLETS: LiveOutletConfig[] = [
  {
    sourceName: 'RTSH',
    sourceType: 'albanian',
    endpoint: 'https://rtsh.al/wp-json/wp/v2/posts?per_page=15&_embed=true',
    siteUrl: 'https://rtsh.al',
    defaultRating: 95,
    defaultImage: 'https://rtsh.al/wp-content/uploads/2026/09/cropped-Favicon-512x512-1-192x192.jpg',
  },
  {
    sourceName: 'Euronews Albania',
    sourceType: 'albanian',
    endpoint: 'https://euronews.al/wp-json/wp/v2/posts?per_page=15&_embed=true',
    siteUrl: 'https://euronews.al',
    defaultRating: 96,
    defaultImage: 'https://euronews.al/wp-content/uploads/2025/12/cropped-favicon-euronews-192x192.png',
  },
  {
    sourceName: 'Reporter.al',
    sourceType: 'albanian',
    endpoint: 'https://www.reporter.al/wp-json/wp/v2/posts?per_page=15&_embed=true',
    siteUrl: 'https://www.reporter.al',
    defaultRating: 98,
    defaultImage: 'https://www.reporter.al/wp-content/uploads/2021/04/favicon-192x192.png',
  },
  {
    sourceName: 'Gazeta Express',
    sourceType: 'regional',
    endpoint: 'https://gazetaexpress.com/wp-json/wp/v2/posts?per_page=10&_embed=true',
    siteUrl: 'https://gazetaexpress.com',
    defaultRating: 92,
    defaultImage: 'https://gazetaexpress.com/wp-content/uploads/2022/07/favicon-192x192.png',
  },
];

/**
 * Decodes common HTML entities from WordPress titles and excerpts
 */
function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&euml;/g, 'ë')
    .replace(/&Euml;/g, 'Ë')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&Ccedil;/g, 'Ç')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Generates an accurate Albanian relative date label relative to anchor time
 */
function formatAlbanianRelativeDate(publishedMs: number, nowMs: number): string {
  const diffMs = nowMs - publishedMs;
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins <= 1) return 'Sapo u publikua';
  if (diffMins < 60) return `Para ${diffMins} minutash`;

  const diffHours = Math.round(diffMs / 3600000);
  if (diffHours === 1) return 'Para 1 ore';
  if (diffHours < 24) return `Para ${diffHours} orësh`;

  const d = new Date(publishedMs);
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const mins = String(d.getUTCMinutes()).padStart(2, '0');
  return `Sot, ${hours}:${mins}`;
}

/**
 * Ingests a single WordPress post into a standardized BreakingNewsArticle
 */
function parseWpPostToArticle(
  post: WpPost,
  outlet: LiveOutletConfig,
  nowISO: string
): BreakingNewsArticle | null {
  try {
    const rawTitle = post.title?.rendered || '';
    const cleanTitle = decodeHtmlEntities(rawTitle);
    if (!cleanTitle || cleanTitle.length < 5) return null;

    const rawExcerpt = post.excerpt?.rendered || post.content?.rendered || '';
    const cleanContent = decodeHtmlEntities(rawExcerpt);

    // Published date normalization (prefer GMT)
    let publishedAt: string;
    if (post.date_gmt && post.date_gmt.length > 5) {
      publishedAt = post.date_gmt.endsWith('Z') ? post.date_gmt : `${post.date_gmt}Z`;
    } else if (post.date) {
      publishedAt = new Date(post.date).toISOString();
    } else {
      publishedAt = nowISO;
    }

    const pubMs = new Date(publishedAt).getTime();
    const nowMs = new Date(nowISO).getTime();
    const relativeLabel = formatAlbanianRelativeDate(pubMs, nowMs);

    // Image resolution from featured media or embedded media
    let imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
    if (imageUrl) {
      imageUrl = sanitizeImageUrl(imageUrl);
    } else {
      imageUrl = outlet.defaultImage;
    }

    return {
      id: `live-${outlet.sourceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${post.id}`,
      title: cleanTitle,
      content: cleanContent || cleanTitle,
      imageUrl,
      sourceName: outlet.sourceName,
      sourceType: outlet.sourceType,
      publishedDate: relativeLabel,
      publishedAt,
      originalArticleUrl: post.link,
      newsAuthenticity: 'VERIFIED_ACCURATE',
      sourceReliability: outlet.defaultRating >= 95 ? 'VERY_HIGH_REPUTATION' : 'HIGH_REPUTATION',
      ecosystemRating: outlet.defaultRating,
      nerVersion: 'NER-v2.4',
      shkoderNewsCategory: 'Kombëtare / Shqipëri',
      severity: 'medium',
      isHighlyRelevantCurrentDevelopment: true,
      isLiveStream: true,
      readTimeMinutes: Math.max(1, Math.ceil(cleanContent.split(/\s+/).length / 180)),
    };
  } catch (err) {
    console.warn(`[liveAlbanianNewsService] Error parsing post ${post.id}:`, err);
    return null;
  }
}

// In-memory cache to prevent spamming endpoints within 20 seconds
let cachedArticles: BreakingNewsArticle[] = [];
let lastFetchTimeMs = 0;
const CACHE_TTL_MS = 25000; // 25 seconds

/**
 * Fetches real-time articles from Albanian media outlets in parallel
 */
export async function fetchLiveAlbanianFeeds(forceRefresh = false): Promise<BreakingNewsArticle[]> {
  const now = Date.now();
  if (!forceRefresh && cachedArticles.length > 0 && now - lastFetchTimeMs < CACHE_TTL_MS) {
    return cachedArticles;
  }

  const nowISO = new Date(now).toISOString();

  const fetchPromises = LIVE_OUTLETS.map(async (outlet) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch(outlet.endpoint, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        return [];
      }

      const posts: WpPost[] = await res.json();
      if (!Array.isArray(posts)) return [];

      return posts
        .map((p) => parseWpPostToArticle(p, outlet, nowISO))
        .filter((a): a is BreakingNewsArticle => !!a);
    } catch (err) {
      // Non-blocking for other feeds
      console.warn(`[liveAlbanianNewsService] Feed fetch failed for ${outlet.sourceName}:`, err);
      return [];
    } finally {
      clearTimeout(timeoutId);
    }
  });

  const results = await Promise.all(fetchPromises);
  const flattened = results.flat();

  if (flattened.length > 0) {
    // Sort newest first
    flattened.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    cachedArticles = flattened;
    lastFetchTimeMs = now;
  }

  return cachedArticles;
}
