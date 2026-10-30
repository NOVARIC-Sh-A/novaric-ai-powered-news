import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Politician profile does not invent dossier values', () => {
  const tab = read('components/figurat-politike/primitives/TabPanel.tsx');
  const card = read('components/figurat-politike/PoliticianCard.tsx');
  const sections = read('components/figurat-politike/ProfileRecordSections.tsx');

  it('removes the previous hardcoded biography fallbacks', () => {
    for (const source of [tab, card]) {
      assert.equal(source.includes('Arsim i Lartë Universitar'), false);
      assert.equal(source.includes('Jurist / Politikan'), false);
      assert.equal(source.includes('@parlament.al'), false);
      assert.equal(source.includes('Qarku Tiranë'), false);
      assert.equal(source.includes('Shenja astrologjike'), false);
      assert.equal(source.includes('legjislaturën e X-të'), false);
      assert.equal(source.includes('Deklarimi i vitit 2025'), false);
    }
  });

  it('labels the zodiac field as not scored and uses the awaiting-data state', () => {
    const copy = read('components/figurat-politike/primitives/awaiting.tsx');
    assert.match(copy, /Nuk pikëzohet \/ Not scored/);
    assert.match(copy, /Në pritje të të dhënave \/ Awaiting data/);
    assert.match(tab, /NOT_SCORED/);
    assert.match(tab, /AWAITING_DATA/);
    assert.match(card, /AWAITING_DATA/);
    assert.match(read('components/figurat-politike/primitives/ZodiacChip.tsx'), /NOT_SCORED/);
    assert.match(sections, /AWAITING_DATA/);
  });

  it('renders the requested dossier sections with bilingual labels', () => {
    const expected = [
      'Gjurmuesi i premtimeve',
      'Promise tracker',
      'Flamujt e qëndrueshmërisë',
      'Consistency flags',
      'Procesverbali i votimit',
      'Voting record',
      'Profili retorik',
      'Rhetoric profile',
      'Rrjeti dhe përkatësitë',
      'Network & affiliations',
      'E drejta e përgjigjes',
      'Right of reply',
      'Regjistri i rishikimeve',
      'Score revision log',
      'Burimet e pikëzimit',
      'Evidence',
    ];
    for (const label of expected) {
      assert.ok(sections.includes(label), `missing section label: ${label}`);
    }
    assert.match(read('components/figurat-politike/primitives/BulletRow.tsx'), /Intervali i besimit \/ CI/);
    assert.match(read('components/figurat-politike/primitives/BulletRow.tsx'), /Plotësia e të dhënave \/ Completeness/);
    assert.match(read('components/figurat-politike/primitives/RadarChart.tsx'), /Benchmark/);
  });
});
