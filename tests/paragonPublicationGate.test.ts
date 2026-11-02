import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runParagonAnalysis } from '../services/paragonEngine';
import { scoresArePublic } from '../services/paragonPublicationGate';
import { publishedRemarkFor } from '../utils/editorialRemarks';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('PARAGON publication fails closed', () => {
  it('does not publish a number unless authorization and audit state both say so', () => {
    assert.equal(scoresArePublic({ authorized: true, auditState: 'published', enabled: true }, true), true);
    assert.equal(scoresArePublic({ authorized: true, auditState: 'published', enabled: true }, false), false);
    assert.equal(scoresArePublic({ authorized: true, auditState: 'verified', enabled: true }, true), false);
    assert.equal(scoresArePublic({ authorized: false, auditState: 'published', enabled: true }, true), false);
    assert.equal(scoresArePublic({ enabled: true }, true), false);
    assert.equal(scoresArePublic(null, true), false);
  });

  it('publishes stored legacy scores only under the 1 November 2026 authorization', () => {
    const gate = JSON.parse(read('data/paragon/publication_gate.json'));
    const flag = JSON.parse(read('public/paragon-ratings.json'));
    assert.equal(gate.authorized, true);
    assert.equal(gate.auditState, 'published');
    assert.equal(gate.authorizedBy, 'Dr Alban Gj. THIKA');
    assert.equal(flag.enabled, true);
    assert.equal(flag.authorized, true);
    assert.equal(scoresArePublic(gate, true), true);
    assert.equal(scoresArePublic(gate, false), false);
    assert.equal(scoresArePublic({ authorized: false, auditState: 'published', enabled: true }, true), false);
  });

  it('keeps static scores only when the gate and a source both allow them', () => {
    const hook = read('components/figurat-politike/useParagonRatings.ts');
    const api = read('services/apiService.ts');
    assert.match(hook, /bundledScoresArePublic/);
    assert.match(hook, /scoresArePublic/);
    assert.match(api, /withoutStaticScores/);
    assert.match(api, /staticProfileForPublication/);
    assert.doesNotMatch(hook, /useState\(true\)/);
  });

  it('does not derive an integrity label from a name', () => {
    const engine = read('services/paragonEngine.ts');
    assert.doesNotMatch(engine, /generateHash|archetypeScore: 70/);
    const left = runParagonAnalysis({
      personal: { fullName: 'Zegjine Çaushi', dob: '1998-08-26' },
      educationHistory: [],
      workHistory: [],
      politicalHistory: [],
      keyLifeEvents: [],
    });
    const right = runParagonAnalysis({
      personal: { fullName: 'Edi Rama', dob: '1964-07-04' },
      educationHistory: [],
      workHistory: [],
      politicalHistory: [],
      keyLifeEvents: [],
    });
    assert.equal(left.integrityAnalysis.agib.vulnerability, null);
    assert.equal(right.integrityAnalysis.agib.vulnerability, null);
    assert.equal(left.integrityAnalysis.cri.criScore, null);
    assert.deepEqual(left.performanceAnalysis.individualScores, []);
    assert.match(left.integrityAnalysis.clinicalSummary, /Audit në proces/);
  });

  it('keeps the Çaushi editorial remark out of the composite', () => {
    const remark = publishedRemarkFor('vip55');
    assert.equal(remark?.editorialScore, 47);
    const exportData = JSON.parse(read('db/paragon_scores_export.json'));
    const vip55 = exportData.profiles.find((profile: { id: string }) => profile.id === 'vip55');
    assert.equal(vip55.composite, 84.8);
    assert.notEqual(vip55.composite, remark?.editorialScore);
  });
});
