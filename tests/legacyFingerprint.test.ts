import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

function legacyAxes(profile: { paragonDimensions?: Array<number | null> }) {
  const dims = profile.paragonDimensions || [];
  return ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'].map((key, index) => {
    const value = dims[index];
    return { key, score: typeof value === 'number' ? value : null };
  });
}

describe('Legacy seven-axis fingerprint', () => {
  const exportData = JSON.parse(read('db/paragon_scores_export.json'));
  const vip55 = exportData.profiles.find((profile: { id: string }) => profile.id === 'vip55');
  const vip2 = exportData.profiles.find((profile: { id: string }) => profile.id === 'vip2');

  it('shows Çaushi all seven stored scores and Berisha without a D5 value', () => {
    assert.equal(vip55.composite, 84.8);
    assert.deepEqual(legacyAxes(vip55).map((axis) => axis.score), [100, 91, 64.4, 71.3, 98.4, 99.8, 64.3]);
    assert.equal(vip2.composite, 63.6);
    const berisha = legacyAxes(vip2);
    assert.equal(berisha.find((axis) => axis.key === 'D5')?.score, null);
    assert.deepEqual(berisha.filter((axis) => axis.score !== null).map((axis) => axis.key), ['D1', 'D2', 'D3', 'D4', 'D6', 'D7']);
    assert.equal(berisha.some((axis) => axis.score === 0 || axis.score === 50), false);
  });

  it('places the details card, then the seven-axis radar, then the observatory', () => {
    const card = read('components/figurat-politike/PoliticianCard.tsx');
    const details = card.indexOf('data-profile-details="true"');
    const fingerprint = card.indexOf('data-legacy-fingerprint="true"');
    const observatory = card.indexOf('<FactualObservatory');
    assert.ok(details > 0 && fingerprint > details && observatory > fingerprint);
    assert.match(card, /PARAGON® Fingerprint \(7 Dimensione\)/);
    assert.match(card, /<RadarChart/);
    assert.doesNotMatch(card, /<CountFingerprint/);
  });

  it('records the authorization and leaves hash labels quarantined', () => {
    const doc = read('docs/paragon/authorization-2026-11-01-legacy-publication.md');
    const sql = read('db/migrations/20261101_paragon_legacy_publication.sql');
    const engine = read('services/paragonEngine.ts');
    assert.match(doc, /Dr Alban Gj\. THIKA/);
    assert.match(doc, /22:28/);
    assert.match(sql, /hist-legacy-publication-2026-11-01/);
    assert.doesNotMatch(sql, /UPDATE paragon_scores|DELETE FROM/);
    assert.doesNotMatch(engine, /generateHash/);
  });
});
