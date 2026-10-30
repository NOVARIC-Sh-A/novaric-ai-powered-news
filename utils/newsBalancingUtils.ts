import { BreakingNewsArticle } from '../types';

export interface SourceBalanceOptions {
  /** Maximum number of major stories to display per source (default: 3) */
  maxStoriesPerSource?: number;
  /** Whether to interleave stories across sources (round-robin) so no single source dominates consecutively (default: true) */
  interleaveSources?: boolean;
  /** Reference anchor time in milliseconds for calculating relative freshness (default: Date.now()) */
  anchorTimeMs?: number;
}

/**
 * Computes an editorial prominence score to identify the "major" stories for a source.
 * Major criteria:
 * 1. Severity level (critical = +50, high = +25, medium = +10)
 * 2. NER Ecosystem Rating (accuracy/editorial weight, 0-100)
 * 3. Editorial urgency signals (isLiveStream, keywords: URGJENTE, BREAKING, ZYRTARE, EKSKLUZIVE)
 * 4. Recency bonus: Fresh breaking articles published within 60 minutes get priority
 * 5. News authenticity bonus: Verified accurate reports get priority
 */
export function calculateMajorStoryScore(
  article: BreakingNewsArticle,
  anchorTimeMs: number = Date.now()
): number {
  if (!article) return 0;

  // 1. Base score from Ecosystem Rating (NER) or default 90
  let score = typeof article.ecosystemRating === 'number' && !isNaN(article.ecosystemRating)
    ? article.ecosystemRating
    : 90;

  // 2. Editorial Severity
  if (article.severity === 'critical') {
    score += 50;
  } else if (article.severity === 'high') {
    score += 25;
  } else if (article.severity === 'medium') {
    score += 10;
  }

  // 3. Live transmission flag
  if (article.isLiveStream) {
    score += 20;
  }

  // 4. Authenticity bonus
  if (article.newsAuthenticity === 'VERIFIED_ACCURATE') {
    score += 10;
  }

  // 5. Title keyword urgency detection
  const title = (article.title || '').toUpperCase();
  if (
    title.includes('URGJENTE') ||
    title.includes('BREAKING') ||
    title.includes('ZYRTARE') ||
    title.includes('EKSKLUZIVE') ||
    title.includes('ALARM') ||
    title.includes('SULM') ||
    title.includes('SAMITI')
  ) {
    score += 20;
  }

  // 6. Recency bonus (fresh articles within 60m get up to +30 points)
  if (article.publishedAt) {
    const pubMs = new Date(article.publishedAt).getTime();
    if (!isNaN(pubMs)) {
      const ageMinutes = Math.max(0, (anchorTimeMs - pubMs) / 60000);
      if (ageMinutes < 60) {
        score += Math.round((60 - ageMinutes) * 0.5); // +30 for brand new, dropping linearly to 0 at 60m
      } else if (ageMinutes < 240) {
        score += 5; // Moderate bonus for 1-4h
      }
    }
  }

  return score;
}

/**
 * Balances news titles per source, keeping only the top major stories per source
 * (default: 3) and interleaving them across sources so the feed presents a balanced,
 * diverse overview of all media outlets without any single source monopolizing the layout.
 *
 * @param articles Input list of news articles
 * @param options Balance options or number indicating maxStoriesPerSource
 * @returns Balanced list of articles with at most maxStoriesPerSource per outlet
 */
export function balanceTitlesPerSource(
  articles: BreakingNewsArticle[],
  options: SourceBalanceOptions | number = {}
): BreakingNewsArticle[] {
  if (!Array.isArray(articles) || articles.length === 0) {
    return [];
  }

  const maxStories = typeof options === 'number'
    ? options
    : (options.maxStoriesPerSource !== undefined ? options.maxStoriesPerSource : 3);

  const interleave = typeof options === 'number'
    ? true
    : (options.interleaveSources !== undefined ? options.interleaveSources : true);

  const anchorMs = (typeof options === 'object' && options.anchorTimeMs) ? options.anchorTimeMs : Date.now();

  // If maxStories <= 0, return empty
  if (maxStories <= 0) {
    return [];
  }

  // 1. Group articles by sourceName
  const sourceGroups = new Map<string, BreakingNewsArticle[]>();
  for (const article of articles) {
    if (!article || !article.title) continue;
    const source = (article.sourceName || 'Tjetër').trim();
    if (!sourceGroups.has(source)) {
      sourceGroups.set(source, []);
    }
    sourceGroups.get(source)!.push(article);
  }

  // 2. For each source, rank stories by major prominence score and take at most maxStories
  const rankedSourceBuckets = new Map<string, BreakingNewsArticle[]>();
  for (const [source, list] of sourceGroups.entries()) {
    const sorted = [...list].sort((a, b) => {
      const scoreA = calculateMajorStoryScore(a, anchorMs);
      const scoreB = calculateMajorStoryScore(b, anchorMs);
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      // Tie breaker 1: recency
      const tA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const tB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      if (tB !== tA) {
        return tB - tA;
      }
      // Tie breaker 2: stable ID
      return (a.id || '').localeCompare(b.id || '');
    });

    rankedSourceBuckets.set(source, sorted.slice(0, maxStories));
  }

  // 3. If interleave is disabled, concatenate buckets directly
  if (!interleave) {
    const result: BreakingNewsArticle[] = [];
    for (const bucket of rankedSourceBuckets.values()) {
      result.push(...bucket);
    }
    return result;
  }

  // 4. Interleaved round-robin distribution:
  // Order sources by the major score of their top (#1) story so the strongest leading stories appear first
  const sortedSources = Array.from(rankedSourceBuckets.keys()).sort((sA, sB) => {
    const topA = rankedSourceBuckets.get(sA)?.[0];
    const topB = rankedSourceBuckets.get(sB)?.[0];
    const scoreA = topA ? calculateMajorStoryScore(topA, anchorMs) : 0;
    const scoreB = topB ? calculateMajorStoryScore(topB, anchorMs) : 0;
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    const tA = topA?.publishedAt ? new Date(topA.publishedAt).getTime() : 0;
    const tB = topB?.publishedAt ? new Date(topB.publishedAt).getTime() : 0;
    if (tB !== tA) {
      return tB - tA;
    }
    return sA.localeCompare(sB);
  });

  const balancedList: BreakingNewsArticle[] = [];
  for (let slot = 0; slot < maxStories; slot++) {
    for (const source of sortedSources) {
      const bucket = rankedSourceBuckets.get(source);
      if (bucket && slot < bucket.length) {
        balancedList.push(bucket[slot]);
      }
    }
  }

  return balancedList;
}
