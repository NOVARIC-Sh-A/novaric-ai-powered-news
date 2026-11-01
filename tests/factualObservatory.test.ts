import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildFactualObservatory, formatFactualCount, AWAITING_DATA } from '../utils/factualObservatory';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Factual observatory', () => {
  it('shows Çaushi counts from the official files and no score', () => {
    const report = buildFactualObservatory('vip55');
    const byId = Object.fromEntries(report.indicators.map((item) => [item.id, item]));
    assert.equal(formatFactualCount(byId.voting_participation), '433/476');
    assert.equal(formatFactualCount(byId.plenary_presence), '476/476');
    assert.equal(formatFactualCount(byId.committee_participation), '63/64');
    assert.equal(formatFactualCount(byId.plenary_interventions), '36');
    assert.equal(formatFactualCount(byId.legislative_activity), AWAITING_DATA);
    assert.equal(byId.legislative_activity.numerator, null);
    assert.equal(byId.plenary_interventions.denominator, null);
    for (const indicator of report.indicators) {
      if (typeof indicator.numerator === 'number') {
        assert.ok(indicator.sourceUrl && indicator.sourceUrl.startsWith('http'));
        assert.ok(indicator.periodStart);
        assert.ok(indicator.periodEnd);
        assert.equal(indicator.verifiedAt, indicator.periodEnd);
        assert.equal(indicator.methodologyVersion, 'methodology_v0.2_2026-11-01');
        assert.equal(indicator.sourceClass, 'F');
      }
    }
    assert.equal(report.dimensions.length, 7);
    for (const dimension of report.dimensions) {
      assert.equal(dimension.score, null);
      assert.equal(dimension.status, 'Në kalibrim');
    }
    const packed = JSON.stringify(report);
    assert.equal(packed.includes('84.8'), false);
    assert.equal(packed.includes('8250'), false);
    assert.equal(packed.includes('"aligned"'), false);
    assert.equal(report.indicators.some((item) => item.numerator === 432), false);
  });

  it('keeps a missing profile null and a measured zero as zero', () => {
    const missing = buildFactualObservatory('vip999999');
    for (const indicator of missing.indicators) {
      if (indicator.id === 'legislative_activity' || indicator.numerator === null) {
        assert.equal(indicator.numerator, null);
        assert.equal(formatFactualCount(indicator), AWAITING_DATA);
      }
    }
    const measuredZero = buildFactualObservatory('vip19');
    const presence = measuredZero.indicators.find((item) => item.id === 'plenary_presence');
    assert.equal(presence?.numerator, 0);
    assert.equal(presence?.denominator, 11);
    assert.equal(formatFactualCount(presence!), '0/11');
  });

  it('does not read the editorial file and the public gate stays closed', () => {
    const moduleSource = read('utils/factualObservatory.ts');
    const panelSource = read('components/figurat-politike/FactualObservatory.tsx');
    const cardSource = read('components/figurat-politike/PoliticianCard.tsx');
    assert.doesNotMatch(moduleSource, /editorial|remarks\.json|aligned|comparable/);
    assert.doesNotMatch(panelSource, /remarks\.json|editorialScore/);
    assert.match(cardSource, /scoringSuspended \? <FactualObservatory/);
    const gate = JSON.parse(read('data/paragon/publication_gate.json'));
    const flag = JSON.parse(read('public/paragon-ratings.json'));
    assert.equal(gate.authorized, false);
    assert.equal(gate.auditState, 'under_review');
    assert.equal(flag.enabled, false);
  });
});
