import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  RSS_FEEDS,
  transformRssItemToArticle,
  FeedSource,
} from '../services/rssIngestor';
import { deduplicateNewsArticles } from '../utils/dateWindowUtils';
import { BreakingNewsArticle } from '../types';

describe('NOVARIC® Live RSS Multi-Feed Ingestion Engine', () => {
  test('Feed Registry is configured with all required tier-1 sources', () => {
    assert.ok(RSS_FEEDS.length >= 7, 'Expected at least 7 active RSS feeds');

    const sources = RSS_FEEDS.map((f) => f.id);
    assert.ok(sources.includes('reporter-al'), 'Expected reporter.al feed');
    assert.ok(sources.includes('monitor-al'), 'Expected monitor.al feed');
    assert.ok(sources.includes('koha-net'), 'Expected koha.net feed');
    assert.ok(sources.includes('balkan-insight'), 'Expected balkan insight feed');
    assert.ok(sources.includes('bbc-news'), 'Expected BBC news feed');
    assert.ok(sources.includes('the-guardian'), 'Expected The Guardian feed');
    assert.ok(sources.includes('france-24'), 'Expected France 24 feed');

    const albanianFeeds = RSS_FEEDS.filter((f) => f.sourceType === 'albanian');
    const balkanFeeds = RSS_FEEDS.filter((f) => f.sourceType === 'balkan');
    const intlFeeds = RSS_FEEDS.filter((f) => f.sourceType === 'international');

    assert.ok(albanianFeeds.length >= 2, 'Expected at least 2 Albanian sources');
    assert.ok(balkanFeeds.length >= 2, 'Expected at least 2 Balkan sources');
    assert.ok(intlFeeds.length >= 3, 'Expected at least 3 International sources');
  });

  test('transformRssItemToArticle strips HTML, assigns RSS image provenance, and sets ISO timestamps', () => {
    const mockFeedSource: FeedSource = {
      id: 'test-source',
      sourceName: 'Test Gazette',
      sourceType: 'albanian',
      feedUrl: 'https://example.com/rss',
      siteUrl: 'https://example.com',
      defaultSeverity: 'high',
      sourceReliability: 'VERY_HIGH_REPUTATION',
      newsAuthenticity: 'VERIFIED_ACCURATE',
      ecosystemRating: 98,
      nerVersion: 'NER-v2.4',
      nerBreakdown: { SRS: 95, CIS: 95, CSC: 95, TRF: 95, ECM: 95 },
      enabled: true,
    };

    const rawRssItem = {
      title: 'Mbledhja e Këshillit të Ministrave miraton vendimin e ri',
      link: 'https://example.com/artikulli-1',
      content: '<p>Tiranë &mdash; Qeveria shqiptare <b>miratoi</b> vendimin kryesor për reformën.</p>',
      isoDate: '2026-09-17T09:30:00.000Z',
      mediaContent: [{ $: { url: 'https://example.com/image-hd.jpg', medium: 'image' } }],
    };

    const serverTime = '2026-09-17T10:00:00.000Z';
    const article = transformRssItemToArticle(rawRssItem, mockFeedSource, serverTime);

    assert.ok(article !== null, 'Article should not be null');
    assert.strictEqual(article.title, 'Mbledhja e Këshillit të Ministrave miraton vendimin e ri');
    assert.ok(!article.content.includes('<p>') && !article.content.includes('<b>'), 'HTML tags should be stripped');
    assert.ok(article.content.includes('Qeveria shqiptare miratoi vendimin kryesor'), 'Clean text should be preserved');
    assert.strictEqual(article.imageUrl, 'https://example.com/image-hd.jpg');
    assert.strictEqual(article.imageProvenance, 'rssFeed');
    assert.strictEqual(article.sourceName, 'Test Gazette');
    assert.strictEqual(article.sourceType, 'albanian');
    assert.strictEqual(article.publishedAt, '2026-09-17T09:30:00.000Z');
    assert.ok(article.publishedDate.length > 0, 'Relative publishedDate should be generated');
  });

  test('transformRssItemToArticle drops items missing title or URL', () => {
    const mockFeedSource = RSS_FEEDS[0];
    const serverTime = new Date().toISOString();

    const noTitle = transformRssItemToArticle({ link: 'https://example.com' }, mockFeedSource, serverTime);
    assert.strictEqual(noTitle, null);

    const noLink = transformRssItemToArticle({ title: 'Some Title' }, mockFeedSource, serverTime);
    assert.strictEqual(noLink, null);
  });

  test('deduplicateNewsArticles resolves duplicate RSS links and titles', () => {
    const items: BreakingNewsArticle[] = [
      {
        id: 'rss-1',
        title: 'Samiti i BE për Ballkanin',
        content: 'Deklarata...',
        originalArticleUrl: 'https://koha.net/1',
        sourceName: 'Koha Ditore',
        sourceType: 'balkan',
        severity: 'medium',
        isHighlyRelevantCurrentDevelopment: true,
        newsAuthenticity: 'VERIFIED_ACCURATE',
        sourceReliability: 'VERY_HIGH_REPUTATION',
        publishedDate: 'Sot, 10:00',
        publishedAt: '2026-09-17T09:00:00.000Z',
      },
      {
        id: 'rss-2',
        title: 'Samiti i BE për Ballkanin', // Duplicate title
        content: 'Deklarata e ndryshuar...',
        originalArticleUrl: 'https://koha.net/1?ref=rss',
        sourceName: 'Koha Ditore',
        sourceType: 'balkan',
        severity: 'medium',
        isHighlyRelevantCurrentDevelopment: true,
        newsAuthenticity: 'VERIFIED_ACCURATE',
        sourceReliability: 'VERY_HIGH_REPUTATION',
        publishedDate: 'Sot, 10:00',
        publishedAt: '2026-09-17T09:00:00.000Z',
      },
      {
        id: 'rss-3',
        title: 'Zhvillim i ri ekonomik',
        content: 'Banka e Shqipërisë...',
        originalArticleUrl: 'https://monitor.al/2',
        sourceName: 'Monitor Ekonomik',
        sourceType: 'albanian',
        severity: 'medium',
        isHighlyRelevantCurrentDevelopment: true,
        newsAuthenticity: 'VERIFIED_ACCURATE',
        sourceReliability: 'VERY_HIGH_REPUTATION',
        publishedDate: 'Sot, 09:30',
        publishedAt: '2026-09-17T08:30:00.000Z',
      },
    ];

    const deduped = deduplicateNewsArticles(items);
    assert.strictEqual(deduped.length, 2, 'Expected 2 unique articles after deduplication');
  });
});
