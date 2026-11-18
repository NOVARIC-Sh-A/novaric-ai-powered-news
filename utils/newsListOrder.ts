import { BreakingNewsArticle } from '../types';

/**
 * Breaking is only an explicit field already on the item.
 * severity "critical" is the newsroom urgency flag. isLiveStream is a live flag.
 * Title words are not treated as a breaking mark.
 */
export function isBreakingNewsItem(article: Pick<BreakingNewsArticle, 'severity' | 'isLiveStream'> | null | undefined): boolean {
  if (!article) return false;
  return article.severity === 'critical' || article.isLiveStream === true;
}

export function publicationTimeMs(publishedAt?: string | null): number | null {
  if (!publishedAt) return null;
  const ms = Date.parse(publishedAt);
  return Number.isNaN(ms) ? null : ms;
}

export type NewsListSort = 'newest' | 'oldest' | 'ner_score';

/**
 * Newest: breaking items first (themselves newest-first), then every other item
 * newest-first. Missing or invalid publication times sort after dated items.
 * Oldest: chronological, undated last. Breaking is not pinned in that mode.
 */
export function compareNewsListOrder(
  a: BreakingNewsArticle,
  b: BreakingNewsArticle,
  sort: NewsListSort = 'newest',
): number {
  if (sort === 'ner_score') {
    const nerA = a.ecosystemRating ?? 0;
    const nerB = b.ecosystemRating ?? 0;
    if (nerB !== nerA) return nerB - nerA;
  }

  if (sort === 'newest') {
    const breakA = isBreakingNewsItem(a) ? 1 : 0;
    const breakB = isBreakingNewsItem(b) ? 1 : 0;
    if (breakA !== breakB) return breakB - breakA;
  }

  const timeA = publicationTimeMs(a.publishedAt);
  const timeB = publicationTimeMs(b.publishedAt);
  if (timeA == null && timeB != null) return 1;
  if (timeA != null && timeB == null) return -1;
  if (timeA != null && timeB != null && timeA !== timeB) {
    return sort === 'oldest' ? timeA - timeB : timeB - timeA;
  }
  return (a.id || '').localeCompare(b.id || '');
}

export function orderNewsList<T extends BreakingNewsArticle>(
  articles: T[],
  sort: NewsListSort = 'newest',
): T[] {
  return [...articles].sort((a, b) => compareNewsListOrder(a, b, sort));
}
