import api from './apiService';
import { BreakingNewsArticle, NewsApiResponse, NewsQueryOptions, SourceType, OpsMetricsResponse } from '../types';
import { translateTexts } from './geminiService';
import {
  deduplicateNewsArticles,
  normalizeArticlePublishedAt,
  isWithinLatestWindow,
  isWithinArchiveWindow,
  getNewsWindows,
} from '../utils/dateWindowUtils';
import { sanitizeImageUrl } from '../utils/imageUtils';
import staticNewsRaw from '../data/latestNews.json';
import { fetchLiveAlbanianFeeds } from './liveAlbanianNewsService';
import { balanceTitlesPerSource } from '../utils/newsBalancingUtils';

/**
 * GET news from NOVARIC backend with flexible query parameters.
 */
export const getNews = (category?: string, refresh?: boolean, options?: NewsQueryOptions) => {
  const params = new URLSearchParams();
  const cat = options?.category || category;
  if (cat && cat !== 'all') params.set('category', cat);
  if (refresh || options?.refresh) params.set('refresh', 'true');
  if (options?.scope) params.set('scope', options.scope);
  if (options?.q) params.set('search', options.q);
  if (options?.sourceName) params.set('sourceName', options.sourceName);
  if (options?.sort) params.set('sort', options.sort);
  if (options?.cursor) params.set('cursor', options.cursor);
  if (options?.limit) params.set('limit', String(options.limit));
  if (options?.balancePerSource !== undefined) params.set('balancePerSource', String(options.balancePerSource));
  if (options?.maxPerSource) params.set('maxPerSource', String(options.maxPerSource));

  const qs = params.toString();
  return api.get(`/api/v1/news${qs ? `?${qs}` : ''}`);
};

/**
 * Fallback articles list populated from latestNews.json with local category filtering
 */
export const getFallbackArticles = (category?: string): BreakingNewsArticle[] => {
  const nowISO = new Date().toISOString();
  let list = (staticNewsRaw as any[])
    .map(normalizeBackendNews)
    .filter((n): n is BreakingNewsArticle => !!n);

  if (category && category !== 'all') {
    const catLower = category.toLowerCase().trim();
    list = list.filter((item) => {
      const itemCat = (item.shkoderNewsCategory || '').toLowerCase();
      const itemType = (item.sourceType || '').toLowerCase();
      if (catLower === 'albanian' || catLower === 'national' || catLower.includes('shqip')) {
        return itemType === 'albanian' || itemCat.includes('shqip') || itemCat.includes('komb');
      }
      if (catLower === 'regional' || catLower === 'balkan' || catLower.includes('rajon')) {
        return itemType === 'regional' || itemCat.includes('rajon') || itemCat.includes('ballkan');
      }
      if (catLower === 'international' || catLower === 'global' || catLower.includes('ndërkomb')) {
        return itemType === 'international' || itemCat.includes('ndërkomb') || itemCat.includes('bota');
      }
      return itemCat.includes(catLower);
    });
  }

  return list.map((item) => ({
    ...item,
    publishedAt: item.publishedAt || normalizeArticlePublishedAt(item, nowISO),
  }));
};

/**
 * Normalize backend payload → BreakingNewsArticle
 * Handles both camelCase (legacy/mock) and snake_case (FastAPI/Supabase)
 */
const normalizeBackendNews = (item: any): BreakingNewsArticle | null => {
  if (!item) return null;
  const rawImage = item.imageUrl || item.image_url || item.image || item.imageThumb || item.image_thumb || null;
  const sanitizedImage = rawImage ? sanitizeImageUrl(rawImage) : null;
  const rawId = item.id || item.article_id || item.guid || item.url || item.link;

  return {
    id: String(rawId || `article-${Math.random().toString(36).substring(2, 9)}`),
    title: item.title || '',
    content: item.content || '',
    imageUrl: sanitizedImage,
    image: sanitizedImage,
    imageThumb: sanitizedImage,
    imageProvenance: item.imageProvenance || (sanitizedImage ? 'rssFeed' : 'none'),
    imageSourceField: item.imageSourceField || (sanitizedImage ? 'media:content' : null),
    feedXml: item.feedXml || null,
    publishedDate: item.timestamp || item.published_date || item.publishedDate || '',

    title_sq: item.title_sq,
    title_en: item.title_en,
    content_sq: item.content_sq,
    content_en: item.content_en,

    sourceName: item.sourceName || item.source_name || 'Burim i panjohur',
    sourceType: (item.sourceType || item.source_type || 'albanian') as SourceType,
    feedUrl: item.feedUrl || item.feed_url,
    originalArticleUrl: item.originalArticleUrl || item.original_article_url,

    severity: item.severity || 'low',
    isHighlyRelevantCurrentDevelopment: !!(item.isHighlyRelevantCurrentDevelopment || item.is_highly_relevant_current_development),
    newsAuthenticity: item.newsAuthenticity || item.news_authenticity || 'ACCURACY_UNCLEAR',
    sourceReliability: item.sourceReliability || item.source_reliability || 'UNRELIABLE_UNKNOWN',
    shkoderNewsCategory: item.shkoderNewsCategory || item.shkoder_news_category,

    // -----------------------------
    // NER — BACKEND AUTHORITATIVE
    // -----------------------------
    ecosystemRating: item.ecosystem_rating ?? item.ecosystemRating ?? undefined,
    nerVersion: item.ner_version ?? item.nerVersion ?? undefined,
    nerBreakdown: item.ner_breakdown ?? item.nerBreakdown ?? undefined,
    publishedAt: item.publishedAt || normalizeArticlePublishedAt(item),
  };
};

/**
 * Translate international news titles to Albanian.
 */
const translateInternationalTitles = async (
  articles: BreakingNewsArticle[]
): Promise<BreakingNewsArticle[]> => {
  const toTranslate = articles.filter(
    (n) =>
      n.sourceType === 'international' &&
      n.title &&
      (!n.title_sq || n.title_sq === n.title_en)
  );

  if (toTranslate.length === 0) {
    return articles;
  }

  try {
    const titles = toTranslate.map((n) => n.title);
    const translatedTitles = await translateTexts(titles, 'Albanian');

    const translationMap = new Map<string, string>();
    toTranslate.forEach((item, index) => {
      if (translatedTitles[index]) {
        translationMap.set(item.id, translatedTitles[index]);
      }
    });

    return articles.map((article) => {
      const translated = translationMap.get(article.id);
      if (!translated) return article;

      return {
        ...article,
        title: translated,
        title_sq: translated,
        title_en: article.title_en || article.title,
      };
    });
  } catch (error) {
    console.warn('[newsService] Translation failed or skipped:', error);
    return articles;
  }
};

/**
 * MAIN EXPORT
 */
export const fetchBreakingNews = async (
  category?: string,
  refresh?: boolean
): Promise<BreakingNewsArticle[]> => {
  const isAlbanianOrAll = !category || category === 'all' || category === 'albanian';
  let liveAlbanian: BreakingNewsArticle[] = [];
  if (isAlbanianOrAll) {
    try {
      liveAlbanian = await fetchLiveAlbanianFeeds(refresh);
    } catch (e) {
      console.warn('[newsService] Live Albanian feeds fetch failed:', e);
    }
  }

  try {
    const response: any = await getNews(category, refresh);
    const data = Array.isArray(response)
      ? response
      : (response?.items || response?.data || response?.articles || []);

    if (Array.isArray(data) && data.length > 0) {
      // Normalize and filter out nulls
      const normalized = data
        .map(normalizeBackendNews)
        .filter((n): n is BreakingNewsArticle => !!n);

      // Translate international titles (pure)
      const translated = await translateInternationalTitles(normalized);

      // Final sanitation
      const sanitized = translated.filter(
        (n) => typeof n.title === 'string' && n.title.trim().length > 5
      );

      if (sanitized.length > 0) {
        const merged = deduplicateNewsArticles([...liveAlbanian, ...sanitized]);
        return balanceTitlesPerSource(merged, 3);
      }
    } else {
      console.warn('[newsService] Remote news response was empty or invalid; switching to local news dataset.');
    }
  } catch (error) {
    console.warn('[newsService] Remote news fetch error; falling back to local news dataset:', error);
  }

  // Graceful fallback from local news dataset
  const mergedFallback = deduplicateNewsArticles([...liveAlbanian, ...getFallbackArticles(category)]);
  return balanceTitlesPerSource(mergedFallback, 3);
};

/**
 * Structured News Feed Query with time windows, scopes, and cursor pagination
 */
export const fetchNewsFeed = async (
  options: NewsQueryOptions = {}
): Promise<NewsApiResponse> => {
  const scope = options.scope || 'all';
  const nowISO = new Date().toISOString();
  const isAlbanianOrAll = !options.category || options.category === 'all' || options.category === 'albanian';

  // Actively pull fresh real-time Albanian news directly from media APIs
  let liveAlbanian: BreakingNewsArticle[] = [];
  if (isAlbanianOrAll) {
    try {
      liveAlbanian = await fetchLiveAlbanianFeeds(options.refresh);
    } catch (e) {
      console.warn('[newsService] Live Albanian feeds error in fetchNewsFeed:', e);
    }
  }

  try {
    const response: any = await getNews(options.category, options.refresh, options);

    if (response && typeof response === 'object' && Array.isArray(response.items) && response.items.length > 0) {
      const serverTime = response.serverTime || nowISO;
      const normalizedItems = (response.items as any[])
        .map((item) => {
          const n = normalizeBackendNews(item);
          if (n && !n.publishedAt) {
            n.publishedAt = normalizeArticlePublishedAt(n, serverTime);
          }
          return n;
        })
        .filter((n): n is BreakingNewsArticle => !!n);

      const translated = await translateInternationalTitles(normalizedItems);
      const combined = deduplicateNewsArticles([...liveAlbanian, ...translated]);

      // Apply scope filtering on merged items
      let scopedItems = combined;
      if (scope === 'latest') {
        scopedItems = combined.filter((item) => isWithinLatestWindow(item.publishedAt, serverTime));
      } else if (scope === 'archive') {
        scopedItems = combined.filter((item) => isWithinArchiveWindow(item.publishedAt, serverTime));
      }

      if (options.sourceName) {
        scopedItems = scopedItems.filter((item) => item.sourceName === options.sourceName);
      }

      // Balance titles per source (default: max 3 major stories per source for latest feed)
      const shouldBalance = options.balancePerSource !== false && (scope === 'latest' || options.balancePerSource === true);
      if (shouldBalance) {
        scopedItems = balanceTitlesPerSource(scopedItems, {
          maxStoriesPerSource: options.maxPerSource || 3,
          interleaveSources: !options.sourceName,
        });
      }

      return {
        serverTime,
        scope: response.scope || scope,
        window: response.window || {},
        items: scopedItems,
        nextCursor: response.nextCursor || null,
        count: scopedItems.length,
        total: typeof response.total === 'number' ? response.total : scopedItems.length,
      };
    } else if (Array.isArray(response) && response.length > 0) {
      // Legacy array response fallback
      const normalized = response
        .map(normalizeBackendNews)
        .filter((n): n is BreakingNewsArticle => !!n);
      const translated = await translateInternationalTitles(normalized);
      const combined = deduplicateNewsArticles([...liveAlbanian, ...translated]);

      let scopedItems = combined;
      if (scope === 'latest') {
        scopedItems = combined.filter((item) => isWithinLatestWindow(item.publishedAt, nowISO));
      } else if (scope === 'archive') {
        scopedItems = combined.filter((item) => isWithinArchiveWindow(item.publishedAt, nowISO));
      }

      if (options.sourceName) {
        scopedItems = scopedItems.filter((item) => item.sourceName === options.sourceName);
      }

      if (options.balancePerSource !== false && (scope === 'latest' || options.balancePerSource === true)) {
        scopedItems = balanceTitlesPerSource(scopedItems, {
          maxStoriesPerSource: options.maxPerSource || 3,
          interleaveSources: !options.sourceName,
        });
      }

      return {
        serverTime: nowISO,
        scope,
        window: {},
        items: scopedItems,
        nextCursor: null,
        count: scopedItems.length,
        total: scopedItems.length,
      };
    }
  } catch (error) {
    console.warn('[newsService] Remote news feed fetch error; activating local news engine:', error);
  }

  // Resilient fallback combining live real-time Albanian items + local static archive
  const windows = getNewsWindows(nowISO);
  let fallbacks = deduplicateNewsArticles([...liveAlbanian, ...getFallbackArticles(options.category)]);

  if (options.q) {
    const qLower = options.q.toLowerCase().trim();
    fallbacks = fallbacks.filter(
      (item) => item.title.toLowerCase().includes(qLower) || item.content.toLowerCase().includes(qLower)
    );
  }

  if (options.sourceName) {
    fallbacks = fallbacks.filter((item) => item.sourceName === options.sourceName);
  }

  if (scope === 'latest') {
    fallbacks = fallbacks.filter((item) => isWithinLatestWindow(item.publishedAt, nowISO));
  } else if (scope === 'archive') {
    fallbacks = fallbacks.filter((item) => isWithinArchiveWindow(item.publishedAt, nowISO));
  }

  // Sort
  if (options.sort === 'ner_score') {
    fallbacks.sort((a, b) => (b.ecosystemRating || 0) - (a.ecosystemRating || 0));
  } else if (options.sort === 'oldest') {
    fallbacks.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
  } else {
    fallbacks.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  let dedupedFallbacks = deduplicateNewsArticles(fallbacks);

  const shouldBalanceFallback = options.balancePerSource !== false && (scope === 'latest' || options.balancePerSource === true);
  if (shouldBalanceFallback) {
    dedupedFallbacks = balanceTitlesPerSource(dedupedFallbacks, {
      maxStoriesPerSource: options.maxPerSource || 3,
      interleaveSources: !options.sourceName,
    });
  }
  const limit = options.limit || 50;
  const sliced = dedupedFallbacks.slice(0, limit);
  const nextCursor = dedupedFallbacks.length > limit ? String(limit) : null;

  return {
    serverTime: nowISO,
    scope,
    window: scope === 'latest' ? windows.latest : scope === 'archive' ? windows.archive : {},
    items: sliced,
    nextCursor,
    count: sliced.length,
    total: dedupedFallbacks.length,
  };
};

/**
 * Fetch operational telemetry, cache performance, source lag alerts, and NER distributions
 */
export const fetchNewsOpsMetrics = async (opsToken?: string): Promise<OpsMetricsResponse | null> => {
  try {
    const token = opsToken || (typeof window !== 'undefined' ? localStorage.getItem('novaric_ops_token') : null);
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await api.get('/api/v1/news/ops/metrics', { headers });
    return res as OpsMetricsResponse;
  } catch (err) {
    console.warn('[newsService] Failed to fetch ops metrics:', err);
    return null;
  }
};

/**
 * Trigger operational alert dispatch to configured Slack / Webhook endpoints
 */
export const dispatchNewsOpsAlerts = async (force: boolean = false, opsToken?: string) => {
  try {
    const token = opsToken || (typeof window !== 'undefined' ? localStorage.getItem('novaric_ops_token') : null);
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await api.post(`/api/v1/news/ops/alerts/dispatch?force=${force}`, {}, { headers });
    return res;
  } catch (err) {
    console.warn('[newsService] Failed to dispatch ops alerts:', err);
    return null;
  }
};

/**
 * Trigger immediate multi-feed RSS synchronization across all configured sources
 */
export const refreshRssFeeds = async (): Promise<any> => {
  try {
    const res = await api.post('/api/v1/news/refresh');
    return res;
  } catch (err) {
    console.warn('[newsService] Failed to refresh RSS feeds:', err);
    return null;
  }
};

/**
 * Retrieve active RSS feeds configuration and latest ingestion report
 */
export const getRssFeedsStatus = async (): Promise<any> => {
  try {
    const res = await api.get('/api/v1/news/feeds');
    return res;
  } catch (err) {
    console.warn('[newsService] Failed to get RSS feeds status:', err);
    return null;
  }
};


