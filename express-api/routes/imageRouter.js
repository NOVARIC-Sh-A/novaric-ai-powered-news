const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const cache = new Map();
const TTL = 1000 * 60 * 30; // 30 minutes

const looksLikeImage = (url, type) =>
  !!url && (type?.startsWith('image/') || /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(url));

function firstImgFromHtml(html) {
  if (!html) return undefined;
  try {
    const $ = cheerio.load(html);
    const src = $('img').first().attr('src');
    return src ? new URL(src, 'https://invalid.local').href : undefined;
  } catch {
    return undefined;
  }
}

function attrsFromMediaEntry(entry) {
  const a = entry?.$ ?? entry?.['@'] ?? {};
  return {
    url: a.url ?? entry?.url,
    type: a.type ?? entry?.type,
    medium: a.medium,
    width: Number(a.width ?? entry?.width ?? 0) || undefined,
    height: Number(a.height ?? entry?.height ?? 0) || undefined
  };
}

function pickFeedImage(feedItem) {
  if (!feedItem) return null;

  const candidates = [];

  // media:content
  for (const m of [].concat(feedItem.mediaContent ?? [])) {
    const a = attrsFromMediaEntry(m);
    if (looksLikeImage(a.url, a.type) || a.medium === 'image') {
      candidates.push({
        sourceField: 'media:content',
        imageUrl: a.url,
        mimeType: a.type,
        width: a.width,
        height: a.height,
        score: 100
      });
    }
  }

  // enclosure
  for (const e of [].concat(feedItem.enclosure ?? feedItem.enclosures ?? [])) {
    const a = attrsFromMediaEntry(e);
    if (looksLikeImage(a.url, a.type)) {
      candidates.push({
        sourceField: 'enclosure',
        imageUrl: a.url,
        mimeType: a.type,
        width: a.width,
        height: a.height,
        score: 95
      });
    }
  }

  // media:thumbnail
  for (const t of [].concat(feedItem.mediaThumbnail ?? [])) {
    const a = attrsFromMediaEntry(t);
    if (looksLikeImage(a.url, a.type)) {
      candidates.push({
        sourceField: 'media:thumbnail',
        imageUrl: a.url,
        thumbUrl: a.url,
        mimeType: a.type,
        width: a.width,
        height: a.height,
        score: 85
      });
    }
  }

  // itunes:image
  const itunes = feedItem.itunesImage?.href ?? feedItem.itunesImage?.url;
  if (looksLikeImage(itunes)) {
    candidates.push({ sourceField: 'itunes:image', imageUrl: itunes, score: 70 });
  }

  // first img in content:encoded
  const htmlImg = firstImgFromHtml(feedItem.contentEncoded ?? feedItem['content:encoded']);
  if (looksLikeImage(htmlImg)) {
    candidates.push({ sourceField: 'content:encoded img', imageUrl: htmlImg, score: 60 });
  }

  // channel image
  const channelImg = feedItem.__channelImage;
  if (looksLikeImage(channelImg)) {
    candidates.push({ sourceField: 'channel image', imageUrl: channelImg, score: 20 });
  }

  const best = candidates.sort((a, b) => b.score - a.score)[0];
  if (!best?.imageUrl) return null;

  return {
    imageUrl: best.imageUrl,
    thumbUrl: best.thumbUrl,
    mimeType: best.mimeType,
    width: best.width,
    height: best.height,
    provenance: 'rssFeed',
    sourceField: best.sourceField
  };
}

async function pickArticleOpenGraphImage(itemLink) {
  try {
    const { data: html } = await axios.get(itemLink, {
      timeout: 8000,
      headers: { 'User-Agent': 'NOVARIC-ImageResolver/1.0' }
    });

    const $ = cheerio.load(html);
    const og = $('meta[property="og:image"]').attr('content') || $('meta[name="og:image"]').attr('content');
    if (!og) return null;

    return {
      imageUrl: new URL(og, itemLink).href,
      provenance: 'articleOpenGraph',
      sourceField: 'og:image'
    };
  } catch {
    return null;
  }
}

// GET /api/v1/news/:itemId/image
router.get('/v1/news/:itemId/image', async (req, res) => {
  const itemId = req.params.itemId;

  // Cache check
  const hit = cache.get(itemId);
  if (hit && Date.now() - hit.at < TTL) {
    return res.json(hit.value);
  }

  // Load from store
  const storePath = path.resolve(__dirname, '../../data/latestNews.json');
  let item = null;
  if (fs.existsSync(storePath)) {
    try {
      const items = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
      item = items.find((i) => String(i.id) === itemId || i.guid === itemId);
    } catch {}
  }

  if (!item) {
    return res.status(404).json({ error: 'item_not_found', itemId });
  }

  let resolved = item.feedXml ? pickFeedImage(item.feedXml) : null;

  if (!resolved && (item.image || item.imageUrl)) {
    resolved = {
      imageUrl: item.image || item.imageUrl,
      thumbUrl: item.imageThumb || item.image || item.imageUrl,
      provenance: item.imageProvenance || 'rssFeed',
      sourceField: item.imageSourceField || 'media:content'
    };
  }

  if (!resolved && (item.originalArticleUrl || item.link)) {
    const og = await pickArticleOpenGraphImage(item.originalArticleUrl || item.link).catch(() => null);
    if (og) resolved = og;
  }

  const payload = resolved
    ? {
        itemId,
        imageUrl: resolved.imageUrl,
        thumbUrl: resolved.thumbUrl,
        mimeType: resolved.mimeType,
        width: resolved.width,
        height: resolved.height,
        provenance: resolved.provenance,
        sourceField: resolved.sourceField,
        fetchedAt: new Date().toISOString()
      }
    : null;

  cache.set(itemId, { at: Date.now(), value: payload });
  res.json(payload);
});

module.exports = router;
