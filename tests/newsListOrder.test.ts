import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BreakingNewsArticle } from '../types';
import { normalizeArticlePublishedAt } from '../utils/dateWindowUtils';
import { isBreakingNewsItem, orderNewsList } from '../utils/newsListOrder';
import { seoShellRelativePath } from '../utils/seoShell';
import { newsArticleSeo } from '../utils/routeSeo';

function item(partial: Partial<BreakingNewsArticle> & Pick<BreakingNewsArticle, 'id'>): BreakingNewsArticle {
  return {
    title: partial.id,
    content: '',
    publishedDate: '',
    sourceName: 'RTSH',
    sourceType: 'albanian',
    severity: 'medium',
    isHighlyRelevantCurrentDevelopment: false,
    newsAuthenticity: 'ACCURACY_UNCLEAR',
    sourceReliability: 'MEDIUM_REPUTATION',
    ...partial,
  };
}

describe('news list order', () => {
  const anchor = '2026-11-18T12:00:00.000Z';

  it('keeps a stored instant and does not rebuild it from a relative label', () => {
    const iso = normalizeArticlePublishedAt({
      publishedAt: '2026-09-24T08:27:31.000Z',
      publishedDate: 'Para 6 minutash',
    }, anchor);
    assert.equal(iso, '2026-09-24T08:27:31.000Z');
  });

  it('does not invent a timestamp when the date is missing', () => {
    assert.equal(normalizeArticlePublishedAt({ publishedDate: '' }, anchor), '');
    assert.equal(normalizeArticlePublishedAt({ publishedAt: 'not-a-date', publishedDate: 'e panjohur' }, anchor), '');
  });

  it('reads a Tirana wall clock as UTC+1', () => {
    const iso = normalizeArticlePublishedAt({ publishedDate: 'Sot, 13:45' }, anchor);
    assert.equal(iso, '2026-11-18T12:45:00.000Z');
    const naive = normalizeArticlePublishedAt({ publishedAt: '2026-11-18T13:45:00' }, anchor);
    assert.equal(naive, '2026-11-18T12:45:00.000Z');
  });

  it('pins explicit breaking items, then newest, and leaves undated items last', () => {
    const ordered = orderNewsList([
      item({ id: 'old', publishedAt: '2026-11-18T08:00:00.000Z', severity: 'medium' }),
      item({ id: 'new', publishedAt: '2026-11-18T11:00:00.000Z', severity: 'high' }),
      item({ id: 'break-old', publishedAt: '2026-11-18T09:00:00.000Z', severity: 'critical' }),
      item({ id: 'live', publishedAt: '2026-11-18T10:00:00.000Z', isLiveStream: true, severity: 'low' }),
      item({ id: 'undated', publishedAt: '', severity: 'medium' }),
      item({ id: 'routine', publishedAt: '2026-11-18T11:30:00.000Z', title: 'URGJENTE pa flamur', severity: 'medium' }),
    ]);
    assert.deepEqual(ordered.map((entry) => entry.id), ['live', 'break-old', 'routine', 'new', 'old', 'undated']);
    assert.equal(isBreakingNewsItem(item({ id: 'x', title: 'BREAKING', severity: 'medium' })), false);
  });
});

describe('route seo shells', () => {
  it('maps the news list, a news item, and the forecast path', () => {
    assert.equal(seoShellRelativePath('/', '?page=newsList'), 'seo/news-list.html');
    assert.equal(seoShellRelativePath('/forecast-2027', ''), 'forecast-2027/index.html');
    assert.equal(seoShellRelativePath('/', '?page=newsArticle&id=rss-rtsh-al-n3t9lb'), 'seo/news/rss-rtsh-al-n3t9lb.html');
    assert.equal(seoShellRelativePath('/', ''), null);
  });

  it('builds a NewsArticle only from fields the item already has', () => {
    const fields = newsArticleSeo({
      id: 'story-1',
      title_sq: 'Titulli shqip',
      content_sq: 'Përmbajtja e lajmit.',
      publishedAt: '2026-11-18T12:00:00.000Z',
      sourceName: 'RTSH',
    });
    assert.ok(fields);
    assert.equal(fields?.title, 'Titulli shqip');
    assert.match(JSON.stringify(fields?.jsonLd), /NewsArticle/);
    assert.match(JSON.stringify(fields?.jsonLd), /NewsMediaOrganization/);
    assert.equal(fields?.url, 'https://media.novaric.al/?page=newsArticle&id=story-1');
    const undated = newsArticleSeo({ id: 'story-2', title: 'Pa datë', content: 'Tekst' });
    assert.doesNotMatch(JSON.stringify(undated?.jsonLd), /datePublished/);
  });
});
