import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  hasLimitedEvidence,
  paragonCompositeUnchanged,
  publishedRemarkFor,
  visibleRemark,
  type EditorialRemark,
} from '../utils/editorialRemarks';

const sourced = (overrides: Partial<EditorialRemark> = {}): EditorialRemark => ({
  profileId: 'vip1',
  editor: { name: 'Ada Editor', title: 'Editor, NOVARIC® Sh.A.' },
  date: '2026-11-01',
  remarksSq: 'Tekst me burim.',
  remarksEn: 'Sourced text.',
  editorialScore: 70,
  criteria: [
    {
      name: 'Integrity & credentials',
      score: 80,
      note: 'Declaration on file.',
      sourceUrl: 'https://www.ildkpki.al/',
    },
    {
      name: 'Public conduct',
      score: 10,
      note: 'This allegation has no URL and must not appear.',
    },
  ],
  sources: [{ label: 'ILDKPKI', url: 'https://www.ildkpki.al/' }],
  status: 'published',
  ...overrides,
});

describe('Editorial remarks stay out of the PARAGON score', () => {
  it('ships an empty remarks file', () => {
    const file = path.resolve(process.cwd(), 'data/editorial/remarks.json');
    assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), []);
  });

  it('renders only a published remark whose claims cite a URL', () => {
    assert.equal(visibleRemark(sourced({ status: 'draft' })), null);
    assert.equal(visibleRemark(sourced({ sources: [], criteria: [{ name: 'Expertise', score: 90, note: 'Unsourced.', sourceUrl: '' }] })), null);

    const shown = visibleRemark(sourced());
    assert.ok(shown);
    assert.equal(shown?.criteria.length, 1);
    assert.equal(shown?.criteria[0].name, 'Integrity & credentials');
    assert.equal(shown?.editorialScore, 70);
    assert.doesNotMatch(JSON.stringify(shown), /must not appear/);
  });

  it('matches the profile id and ignores a later draft', () => {
    const published = publishedRemarkFor('1', [
      sourced({ date: '2026-10-01' }),
      sourced({ date: '2026-11-01', status: 'draft', remarksEn: 'Draft must stay hidden.' }),
    ]);
    assert.equal(published?.date, '2026-10-01');
    assert.equal(publishedRemarkFor('vip99', [sourced()]), null);
  });

  it('does not let the editorial score replace the PARAGON composite', () => {
    assert.equal(paragonCompositeUnchanged(58.3, 70), 58.3);
    assert.equal(paragonCompositeUnchanged(null, 70), null);
  });

  it('warns when two or more scored dimensions are proxies', () => {
    assert.equal(hasLimitedEvidence([
      { proxy: true, score: 48.3 },
      { proxy: true, score: 62 },
      { proxy: false, score: 80 },
    ]), true);
    assert.equal(hasLimitedEvidence([{ proxy: true, score: 48.3 }, { proxy: false, score: 80 }]), false);
    assert.equal(hasLimitedEvidence([{ proxy: true, score: null }, { proxy: true, score: 10 }]), false);
  });

  it('places the editorial card and the limited-evidence label on the profile', () => {
    const card = fs.readFileSync(path.resolve(process.cwd(), 'components/figurat-politike/PoliticianCard.tsx'), 'utf8');
    const editorial = fs.readFileSync(path.resolve(process.cwd(), 'components/figurat-politike/EditorialRemarksCard.tsx'), 'utf8');
    assert.match(card, /EditorialRemarksCard/);
    assert.match(card, /LIMITED_EVIDENCE_BADGE/);
    assert.match(editorial, /Vlerësim editorial \/ Editor’s assessment/);
    assert.match(editorial, /jo pjesë e pikës PARAGON®/);
    assert.match(editorial, /Pa vërejtje editoriale ende \/ No editor’s remarks yet/);
    assert.match(editorial, /Evidencë e kufizuar \/ Limited evidence/);
    assert.doesNotMatch(card, /composite\s*=\s*remark\.editorialScore|composite\s*=\s*editorialScore/);
  });
});
