const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const SIXTY_MINUTES_MS = 60 * 60 * 1000;
const FIVE_MINUTES_SKEW_MS = 5 * 60 * 1000;
const SIXTEEN_HOURS_MS = 16 * 60 * 60 * 1000;

// Cache storage
const latestCache = new Map();
const archiveCache = new Map();

function normalizeCanonicalUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url.trim());
    const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref', 'source'];
    for (const key of trackingKeys) {
      parsed.searchParams.delete(key);
    }
    const cleanSearch = parsed.searchParams.toString();
    const pathname = parsed.pathname.replace(/\/+$/, '');
    return `${parsed.protocol}//${parsed.hostname.toLowerCase()}${pathname}${cleanSearch ? `?${cleanSearch}` : ''}`;
  } catch (e) {
    return (url || '').trim().toLowerCase().replace(/\/+$/, '');
  }
}

function deduplicateNewsArticles(articles) {
  const map = new Map();
  for (const item of articles) {
    const canonicalLink = normalizeCanonicalUrl(item.originalArticleUrl || item.feedUrl);
    const guid = item.feedXml?.guid || item.feedXml?.id || item.id;
    const dedupeKey = canonicalLink || (guid ? `guid:${guid}` : `id:${item.id}`);

    if (!map.has(dedupeKey)) {
      map.set(dedupeKey, item);
    } else {
      const existing = map.get(dedupeKey);
      const existingNer = existing.ecosystemRating || 0;
      const itemNer = item.ecosystemRating || 0;
      if (itemNer > existingNer) {
        map.set(dedupeKey, item);
      } else if (itemNer === existingNer) {
        const t1 = new Date(existing.publishedAt || existing.publishedDate).getTime();
        const t2 = new Date(item.publishedAt || item.publishedDate).getTime();
        if (t2 > t1) {
          map.set(dedupeKey, item);
        }
      }
    }
  }
  return Array.from(map.values());
}

function normalizeArticlePublishedAt(article, anchorMs) {
  if (article.publishedAt) {
    const d = new Date(article.publishedAt);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  const dateStr = (article.publishedDate || '').trim();
  if (!dateStr) return new Date(anchorMs).toISOString();

  const minMatch = dateStr.match(/Para\s+(\d+)\s*min/i) || dateStr.match(/(\d+)\s*minuta?\s*më parë/i);
  if (minMatch) {
    return new Date(anchorMs - parseInt(minMatch[1], 10) * 60 * 1000).toISOString();
  }
  const hourMatch = dateStr.match(/Para\s+(\d+)\s*or[ëe]/i) || dateStr.match(/(\d+)\s*orë?\s*më parë/i);
  if (hourMatch) {
    return new Date(anchorMs - parseInt(hourMatch[1], 10) * 3600 * 1000).toISOString();
  }
  const todayMatch = dateStr.match(/Sot,\s*(\d{1,2}):(\d{2})/i);
  if (todayMatch) {
    const d = new Date(anchorMs);
    d.setUTCHours(parseInt(todayMatch[1], 10), parseInt(todayMatch[2], 10), 0, 0);
    return d.toISOString();
  }
  const yestMatch = dateStr.match(/Dje,\s*(\d{1,2}):(\d{2})/i);
  if (yestMatch) {
    const d = new Date(anchorMs - 24 * 3600 * 1000);
    d.setUTCHours(parseInt(yestMatch[1], 10), parseInt(yestMatch[2], 10), 0, 0);
    return d.toISOString();
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed.toISOString();
  return new Date(anchorMs).toISOString();
}

// GET /api/v1/news
router.get('/v1/news', async (req, res) => {
  const startTime = Date.now();
  try {
    const scope = req.query.scope || 'all';
    const category = req.query.category;
    const search = (req.query.search || req.query.q || '').trim().toLowerCase();
    const sourceName = req.query.sourceName;
    const sort = req.query.sort || 'newest';
    const cursor = req.query.cursor;
    const limitParam = parseInt(req.query.limit, 10);
    const doRefresh = req.query.refresh === 'true';

    const serverTime = new Date().toISOString();
    const anchorMs = new Date(serverTime).getTime();

    const cacheKey = JSON.stringify({ scope, category, search, sourceName, sort, cursor, limitParam });
    if (!doRefresh) {
      const activeCache = scope === 'latest' ? latestCache : scope === 'archive' ? archiveCache : null;
      if (activeCache && activeCache.has(cacheKey)) {
        const cached = activeCache.get(cacheKey);
        const ttl = scope === 'latest' ? 20000 : 300000;
        if (Date.now() - cached.timestamp < ttl) {
          console.log(JSON.stringify({
            event: 'news_list_query',
            scope,
            window: cached.data.window,
            latencyMs: Date.now() - startTime,
            count: cached.data.count,
            total: cached.data.total,
            cacheHit: true,
            upstreamFailures: 0,
          }));
          return res.status(200).json(cached.data);
        }
      }
    }

    const newsPath = path.resolve(__dirname, '../../data/latestNews.json');
    let rawNews = [];
    if (fs.existsSync(newsPath)) {
      try {
        rawNews = JSON.parse(fs.readFileSync(newsPath, 'utf-8'));
      } catch (e) {
        rawNews = [];
      }
    }

    let articles = rawNews.map((item) => ({
      ...item,
      publishedAt: normalizeArticlePublishedAt(item, anchorMs),
      imageProvenance: item.imageProvenance || (item.imageUrl || item.image ? 'rssFeed' : 'none'),
      imageSourceField: item.imageSourceField || (item.imageUrl || item.image ? 'media:content' : null),
    }));

    articles = deduplicateNewsArticles(articles);

    const latestStartMs = anchorMs - SIXTY_MINUTES_MS;
    const latestEndMs = anchorMs + FIVE_MINUTES_SKEW_MS;
    const archiveEndMs = anchorMs - SIXTEEN_HOURS_MS;

    let windowConfig = {};
    if (scope === 'latest') {
      windowConfig = {
        start: new Date(latestStartMs).toISOString(),
        end: new Date(latestEndMs).toISOString(),
      };
      articles = articles.filter((item) => {
        const t = new Date(item.publishedAt).getTime();
        return t >= latestStartMs && t <= latestEndMs;
      });
    } else if (scope === 'archive') {
      windowConfig = {
        end: new Date(archiveEndMs).toISOString(),
      };
      articles = articles.filter((item) => {
        const t = new Date(item.publishedAt).getTime();
        return t < archiveEndMs;
      });
    }

    if (category && category !== 'all') {
      articles = articles.filter((item) => item.sourceType === category);
    }

    if (search) {
      articles = articles.filter(
        (item) =>
          item.title?.toLowerCase().includes(search) ||
          item.content?.toLowerCase().includes(search) ||
          item.sourceName?.toLowerCase().includes(search)
      );
    }

    if (sourceName) {
      articles = articles.filter((item) => item.sourceName === sourceName);
    }

    if (sort === 'ner_score') {
      articles.sort((a, b) => {
        const nerA = a.ecosystemRating || 0;
        const nerB = b.ecosystemRating || 0;
        if (nerB !== nerA) return nerB - nerA;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
    } else if (sort === 'oldest') {
      articles.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    } else {
      articles.sort((a, b) => {
        const diff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        if (diff !== 0) return diff;
        return String(b.id).localeCompare(String(a.id));
      });
    }

    const total = articles.length;
    let itemsToReturn = [];
    let nextCursor = null;

    if (scope === 'archive') {
      const limit = Math.min(Math.max(limitParam || 50, 1), 100);
      if (cursor) {
        const [cTime, cId] = cursor.split('___').map(decodeURIComponent);
        const cMs = new Date(cTime).getTime();
        articles = articles.filter((item) => {
          const itemMs = new Date(item.publishedAt).getTime();
          if (itemMs < cMs) return true;
          if (itemMs === cMs) return String(item.id) < String(cId);
          return false;
        });
      }

      if (articles.length > limit) {
        itemsToReturn = articles.slice(0, limit);
        const last = itemsToReturn[itemsToReturn.length - 1];
        nextCursor = `${encodeURIComponent(last.publishedAt)}___${encodeURIComponent(last.id)}`;
      } else {
        itemsToReturn = articles;
        nextCursor = null;
      }
    } else {
      const limit = Math.min(limitParam || 100, 100);
      itemsToReturn = articles.slice(0, limit);
    }

    const response = {
      serverTime,
      scope,
      window: windowConfig,
      items: itemsToReturn,
      nextCursor,
      count: itemsToReturn.length,
      total,
    };

    if (scope === 'latest') {
      latestCache.set(cacheKey, { timestamp: Date.now(), data: response });
    } else if (scope === 'archive') {
      archiveCache.set(cacheKey, { timestamp: Date.now(), data: response });
    }

    console.log(JSON.stringify({
      event: 'news_list_query',
      scope,
      window: windowConfig,
      latencyMs: Date.now() - startTime,
      count: response.count,
      total: response.total,
      cacheHit: false,
      upstreamFailures: 0,
    }));

    return res.status(200).json(response);
  } catch (err) {
    console.error('Express API news error:', err);
    return res.status(500).json({ error: 'Failed to process news query' });
  }
});

module.exports = router;
