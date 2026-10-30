import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMajorStoryScore,
  balanceTitlesPerSource,
} from '../utils/newsBalancingUtils.js';
import { BreakingNewsArticle } from '../types.js';

describe('NOVARIC® News Feed Source Balancer Tests', () => {

  const createMockArticle = (
    id: string,
    sourceName: string,
    title: string,
    options: Partial<BreakingNewsArticle> = {}
  ): BreakingNewsArticle => ({
    id,
    sourceName,
    sourceType: 'albanian',
    title,
    content: `${title} - Përmbajtje testuese për lajmin nga ${sourceName}`,
    publishedDate: 'Sot 10:00',
    publishedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    newsAuthenticity: 'VERIFIED_ACCURATE',
    sourceReliability: 'VERY_HIGH_REPUTATION',
    ecosystemRating: 95,
    severity: 'medium',
    isHighlyRelevantCurrentDevelopment: true,
    ...options,
  });

  test('calculateMajorStoryScore ranks critical, breaking, and fresh items higher', () => {
    const anchorMs = Date.now();

    const normalArticle = createMockArticle('1', 'RTSH', 'Një lajm i zakonshëm i ditës', {
      severity: 'low',
      ecosystemRating: 88,
    });

    const criticalArticle = createMockArticle('2', 'RTSH', 'URGJENTE: Deklaratë e rëndësishme e qeverisë', {
      severity: 'critical',
      isLiveStream: true,
      ecosystemRating: 98,
    });

    const scoreNormal = calculateMajorStoryScore(normalArticle, anchorMs);
    const scoreCritical = calculateMajorStoryScore(criticalArticle, anchorMs);

    assert.ok(scoreCritical > scoreNormal, `Critical article (${scoreCritical}) must score higher than normal (${scoreNormal})`);
  });

  test('balanceTitlesPerSource enforces at most 3 major stories per source', () => {
    // Generate 15 articles for RTSH and 10 articles for Euronews Albania
    const articles: BreakingNewsArticle[] = [];
    for (let i = 1; i <= 15; i++) {
      articles.push(createMockArticle(`rtsh-${i}`, 'RTSH', `Titulli RTSH #${i}`));
    }
    for (let i = 1; i <= 10; i++) {
      articles.push(createMockArticle(`euronews-${i}`, 'Euronews Albania', `Titulli Euronews #${i}`));
    }
    // Add 2 articles for Monitor Ekonomik
    articles.push(createMockArticle('monitor-1', 'Monitor Ekonomik', 'Titulli Monitor #1'));
    articles.push(createMockArticle('monitor-2', 'Monitor Ekonomik', 'Titulli Monitor #2'));

    const balanced = balanceTitlesPerSource(articles, 3);

    const counts: Record<string, number> = {};
    for (const item of balanced) {
      counts[item.sourceName] = (counts[item.sourceName] || 0) + 1;
    }

    assert.equal(counts['RTSH'], 3, 'RTSH must be capped at exactly 3 major stories');
    assert.equal(counts['Euronews Albania'], 3, 'Euronews Albania must be capped at exactly 3 major stories');
    assert.equal(counts['Monitor Ekonomik'], 2, 'Monitor with only 2 stories should keep both');
    assert.equal(balanced.length, 3 + 3 + 2, 'Total items must equal sum of capped source stories');
  });

  test('balanceTitlesPerSource prioritizes the most major stories for each source', () => {
    const articles: BreakingNewsArticle[] = [
      createMockArticle('1', 'RTSH', 'Rutine 1', { severity: 'low', ecosystemRating: 80 }),
      createMockArticle('2', 'RTSH', 'Rutine 2', { severity: 'low', ecosystemRating: 82 }),
      createMockArticle('3', 'RTSH', 'URGJENTE: Samiti Historik', { severity: 'critical', ecosystemRating: 99 }),
      createMockArticle('4', 'RTSH', 'ZYRTARE: Vendimi i ri i Kuvendit', { severity: 'high', ecosystemRating: 96 }),
      createMockArticle('5', 'RTSH', 'EKSKLUZIVE: Raporti Ndërkombëtar', { severity: 'high', ecosystemRating: 95 }),
      createMockArticle('6', 'RTSH', 'Rutine 3', { severity: 'low', ecosystemRating: 75 }),
    ];

    const balanced = balanceTitlesPerSource(articles, 3);

    assert.equal(balanced.length, 3);
    const selectedIds = balanced.map((a) => a.id);
    assert.ok(selectedIds.includes('3'), 'Critical article must be selected');
    assert.ok(selectedIds.includes('4'), 'High severity article 1 must be selected');
    assert.ok(selectedIds.includes('5'), 'High severity article 2 must be selected');
    assert.ok(!selectedIds.includes('1'), 'Low priority article must be excluded');
  });

  test('balanceTitlesPerSource interleaves sources so consecutive cards rotate', () => {
    const articles: BreakingNewsArticle[] = [
      createMockArticle('r1', 'RTSH', 'RTSH Story 1'),
      createMockArticle('r2', 'RTSH', 'RTSH Story 2'),
      createMockArticle('r3', 'RTSH', 'RTSH Story 3'),
      createMockArticle('e1', 'Euronews Albania', 'Euronews Story 1'),
      createMockArticle('e2', 'Euronews Albania', 'Euronews Story 2'),
      createMockArticle('e3', 'Euronews Albania', 'Euronews Story 3'),
      createMockArticle('b1', 'BBC News', 'BBC Story 1'),
      createMockArticle('b2', 'BBC News', 'BBC Story 2'),
      createMockArticle('b3', 'BBC News', 'BBC Story 3'),
    ];

    const balanced = balanceTitlesPerSource(articles, 3);

    // Verify first 3 items are from 3 DIFFERENT sources
    const firstThreeSources = new Set(balanced.slice(0, 3).map((a) => a.sourceName));
    assert.equal(firstThreeSources.size, 3, 'First 3 items must rotate across 3 distinct sources');

    // Verify no two adjacent items are from the same source
    for (let i = 0; i < balanced.length - 1; i++) {
      assert.notEqual(
        balanced[i].sourceName,
        balanced[i + 1].sourceName,
        `Items at index ${i} and ${i + 1} must not have the same source (${balanced[i].sourceName})`
      );
    }
  });

  test('balanceTitlesPerSource gracefully handles empty or null lists', () => {
    assert.deepEqual(balanceTitlesPerSource([]), []);
    assert.deepEqual(balanceTitlesPerSource(null as any), []);
    assert.deepEqual(balanceTitlesPerSource([], 3), []);
  });
});
