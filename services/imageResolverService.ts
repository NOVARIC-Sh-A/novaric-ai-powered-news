import Parser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import { ImageProvenance, NewsImage } from "../types";

export type { ImageProvenance, NewsImage };

// Custom RSS/Atom parser with media & content fields
const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
      ["itunes:image", "itunesImage"],
      ["content:encoded", "contentEncoded"]
    ]
  }
});

const looksLikeImage = (url?: string, type?: string): boolean =>
  !!url && (type?.startsWith("image/") || /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(url));

function firstImgFromHtml(html?: string): string | undefined {
  if (!html) return undefined;
  try {
    const $ = cheerio.load(html);
    const src = $("img").first().attr("src");
    return src ? new URL(src, "https://invalid.local").href : undefined;
  } catch {
    return undefined;
  }
}

function attrsFromMediaEntry(entry: any) {
  const a = entry?.$ ?? entry?.["@"] ?? {};
  return {
    url: a.url ?? entry?.url,
    type: a.type ?? entry?.type,
    medium: a.medium,
    width: Number(a.width ?? entry?.width ?? 0) || undefined,
    height: Number(a.height ?? entry?.height ?? 0) || undefined
  };
}

/**
 * Pick original feed image strictly from:
 * - media:content
 * - enclosure
 * - media:thumbnail
 * - itunes:image
 * - first <img> in content:encoded
 * - channel image (lowest score)
 *
 * RULE: Provenance is strictly "rssFeed".
 */
export function pickFeedImage(feedItem: any): Omit<NewsImage, "itemId" | "fetchedAt"> | null {
  if (!feedItem) return null;

  const candidates: Array<{
    sourceField: string;
    imageUrl?: string;
    thumbUrl?: string;
    mimeType?: string;
    width?: number;
    height?: number;
    score: number;
  }> = [];

  // media:content with medium="image" or image mime
  for (const m of [].concat(feedItem.mediaContent ?? [])) {
    const a = attrsFromMediaEntry(m);
    if (looksLikeImage(a.url, a.type) || a.medium === "image") {
      candidates.push({
        sourceField: "media:content",
        imageUrl: a.url,
        mimeType: a.type,
        width: a.width,
        height: a.height,
        score: 100
      });
    }
  }

  // enclosure image/*
  for (const e of [].concat(feedItem.enclosure ?? feedItem.enclosures ?? [])) {
    const a = attrsFromMediaEntry(e);
    if (looksLikeImage(a.url, a.type)) {
      candidates.push({
        sourceField: "enclosure",
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
        sourceField: "media:thumbnail",
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
    candidates.push({ sourceField: "itunes:image", imageUrl: itunes, score: 70 });
  }

  // first img in content:encoded
  const htmlImg = firstImgFromHtml(feedItem.contentEncoded ?? feedItem["content:encoded"]);
  if (looksLikeImage(htmlImg)) {
    candidates.push({ sourceField: "content:encoded img", imageUrl: htmlImg, score: 60 });
  }

  // RSS channel-level image should be last among feed-native options
  const channelImg = feedItem.__channelImage;
  if (looksLikeImage(channelImg)) {
    candidates.push({ sourceField: "channel image", imageUrl: channelImg, score: 20 });
  }

  const best = candidates.sort((a, b) => b.score - a.score)[0];
  if (!best?.imageUrl) return null;

  return {
    imageUrl: best.imageUrl,
    thumbUrl: best.thumbUrl,
    mimeType: best.mimeType,
    width: best.width,
    height: best.height,
    provenance: "rssFeed",
    sourceField: best.sourceField
  };
}

/**
 * Optional fallback: article og:image
 * RULE: Used only if the feed has no image. Provenance MUST be "articleOpenGraph".
 */
export async function pickArticleOpenGraphImage(itemLink: string): Promise<{
  imageUrl: string;
  provenance: "articleOpenGraph";
  sourceField: "og:image";
} | null> {
  try {
    const { data: html } = await axios.get<string>(itemLink, {
      timeout: 8000,
      headers: { "User-Agent": "NOVARIC-ImageResolver/1.0" }
    });

    const $ = cheerio.load(html);
    const og = $('meta[property="og:image"]').attr("content") || $('meta[name="og:image"]').attr("content");
    if (!og) return null;

    return {
      imageUrl: new URL(og, itemLink).href,
      provenance: "articleOpenGraph",
      sourceField: "og:image"
    } as const;
  } catch {
    return null;
  }
}

// In-memory cache with 30-minute TTL
const cache = new Map<string, { at: number; value: NewsImage | null }>();
const TTL = 1000 * 60 * 30;

export interface ResolveImageParams {
  itemId: string;
  feedUrl?: string;
  itemGuid?: string;
  itemLink?: string;
  feedXml?: any;
}

/**
 * Core image resolver:
 * 1. Checks memory cache
 * 2. Checks feedItem / feedXml for feed-native image (media:content, enclosure, media:thumbnail, itunes:image, content:encoded img)
 * 3. If feedUrl provided and no feedXml, optionally queries feed
 * 4. Fallback: article og:image (labeled strictly as 'articleOpenGraph')
 */
export async function resolveNewsItemImage(params: ResolveImageParams): Promise<NewsImage | null> {
  const { itemId, feedUrl, itemGuid, itemLink, feedXml } = params;

  // Cache check
  const hit = cache.get(itemId);
  if (hit && Date.now() - hit.at < TTL) {
    return hit.value;
  }

  let resolved: Omit<NewsImage, "itemId" | "fetchedAt"> | null = null;

  let effFeedUrl = feedUrl;
  let effItemGuid = itemGuid;
  let effItemLink = itemLink;
  let effFeedXml = feedXml;

  // If parameters are minimal, check local data store by itemId
  if (!effFeedXml && !effFeedUrl && !effItemLink && itemId) {
    try {
      if (typeof window === 'undefined') {
        const fs = await import('fs');
        const path = await import('path');
        const newsPath = path.resolve(process.cwd(), 'data/latestNews.json');
        if (fs.existsSync(newsPath)) {
          const list = JSON.parse(fs.readFileSync(newsPath, 'utf-8'));
          const found = list.find((it: any) => String(it.id) === itemId || it.guid === itemId);
          if (found) {
            effFeedXml = found.feedXml;
            effFeedUrl = found.feedUrl;
            effItemLink = found.originalArticleUrl || found.link;
            if (found.image || found.imageUrl) {
              resolved = {
                imageUrl: found.image || found.imageUrl,
                thumbUrl: found.imageThumb || found.image || found.imageUrl,
                provenance: found.imageProvenance || "rssFeed",
                sourceField: found.imageSourceField || "media:content"
              };
            }
          }
        }
      }
    } catch {
      // Ignore store lookup errors
    }
  }

  // 1. Check passed feedXml / feed item
  if (!resolved && effFeedXml) {
    resolved = pickFeedImage(effFeedXml);
  }

  // 2. If feedUrl is provided and not resolved yet, attempt to fetch feed
  if (!resolved && effFeedUrl) {
    try {
      const feed = await parser.parseURL(effFeedUrl);
      const match = feed.items?.find((it: any) => {
        if (effItemGuid && (it.guid === effItemGuid || it.id === effItemGuid)) return true;
        if (effItemLink && it.link === effItemLink) return true;
        if (itemId && (it.guid === itemId || it.link === itemId)) return true;
        return false;
      });

      if (match) {
        resolved = pickFeedImage(match);
      }
    } catch {
      // Feed fetch failed or timed out, proceed to fallback
    }
  }

  // 3. Optional fallback: article og:image (labeled strictly as articleOpenGraph)
  if (!resolved && effItemLink) {
    const og = await pickArticleOpenGraphImage(effItemLink).catch(() => null);
    if (og) {
      resolved = og;
    }
  }

  const payload: NewsImage | null = resolved
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
  return payload;
}

/**
 * 1. Gemini Tool Schema Declaration
 */
export const resolveNewsItemImageToolDeclaration: any = {
  name: "resolve_news_item_image",
  description:
    "Resolve the original image attached to a news item in its RSS/Atom feed. Returns feed-native image first; article Open Graph image only as fallback with provenance.",
  parameters: {
    type: "object",
    properties: {
      itemId: { type: "string", description: "Internal news item id" },
      feedUrl: { type: "string", description: "RSS/Atom feed URL" },
      itemGuid: { type: "string", description: "RSS guid/id" },
      itemLink: { type: "string", description: "Canonical article URL" }
    },
    required: ["itemId"]
  }
};

/**
 * Gemini Tool Executor
 */
export async function executeResolveNewsItemImage(args: {
  itemId: string;
  feedUrl?: string;
  itemGuid?: string;
  itemLink?: string;
}): Promise<NewsImage> {
  const result = await resolveNewsItemImage(args);
  if (result) return result;

  return {
    itemId: args.itemId,
    imageUrl: "",
    provenance: "none",
    fetchedAt: new Date().toISOString()
  };
}
