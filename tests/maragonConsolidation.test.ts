/**
 * MARAGON® consolidation tests (22.11.2026). All scored inputs below are SYNTHETIC TEST DATA,
 * not findings about any real person. Basis: STD-COM-MARAGON-METHODOLOGY-v1.0-20261121 + AM-01…AM-09.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CANONICAL_MARAGON_INDICATOR_IDS } from '../lib/maragon-schemas';
import { MARAGON_CANONICAL_MEANINGS, canonicalParent, indicatorSetProblems } from '../lib/maragonIndicatorMap';
import { gatedComposite, indicatorScoreForComposite, type CompositeIndicatorInput } from '../utils/maragonComposite';
import {
  officialIndicatorDecision,
  provisionalAggregateDecision,
  provisionalIndicatorDecision,
  SIGNED_MARAGON_METHODOLOGY_IDS,
  type DisplayGateRecord,
} from '../utils/maragonPublicationDecision';
import {
  AM09_PUBLIC_LABEL,
  MARAGON_BAND_LABELS,
  MARAGON_CONFIDENCE_LABELS,
  bandForScore,
  isRetiredLegacyMaragonAnalysis,
  publishableMaragonAnalysis,
  publishedMaragonAverage,
  rankableMaragonScore,
} from '../utils/maragonPublication';
import { BandRadar, BandPill, getPresenterRecord, visibleIndicatorBand } from '../components/maragon/maragonPresenterUi';
import {
  MARAGON_BENCHMARKS,
  MARAGON_BENCHMARK_METHODOLOGY_ID,
  PROPOSED_UNSIGNED_BENCHMARK_AMENDMENT_IDS,
  SIGNED_BENCHMARK_AMENDMENT_IDS,
  isPlottableBenchmarkPoint,
} from '../data/maragon/benchmarks';
import { METHODOLOGY_ID, baseMaragon, methodologyNotes } from '../data/maragon/presenterFactory';
import { mediaProfilesData } from '../data/mediaProfiles';
import { OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT, resolvePresentableMediaPhoto } from '../utils/officialMediaPhoto';
import { MARAGON_INDICATORS } from '../data/maragonIndicators';
import type { MaragonBenchmarkSeries } from '../components/maragon/maragonBenchmarkTypes';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');
const records = mediaProfilesData.map((p) => getPresenterRecord(p)).filter((r): r is NonNullable<typeof r> => r !== null);

/** SYNTHETIC: an individual with ten assessed indicators, all medium confidence, value 70. */
function synthetic(overrides: Partial<Record<string, Partial<CompositeIndicatorInput>>> = {}): CompositeIndicatorInput[] {
  const slots = ['R1.1', 'R1.2', 'A2.1', 'ind:A2.2', 'ind:A2.3', 'A2.4', 'G3.1-I', 'G3.2', 'ind:O4.1', 'O4.2'];
  return slots.map((id) => ({
    id,
    status: 'assessed',
    humanFinalScore: 70,
    confidence: 'medium',
    thresholdMet: true,
    r12BothSubscores: id === 'R1.2' ? true : undefined,
    ...(overrides[id] || {}),
  }));
}

function openRecord(): DisplayGateRecord {
  return {
    methodology: 'STD-COM-MARAGON-METHODOLOGY-v1.0-20261121',
    methodologyApproved: true,
    assessmentStatus: 'approved',
    authorizedForPublicDisplay: true,
    am09ProvisionalApprovedInWriting: false,
    scoringSuspended: false,
    rightOfReply: 'completed',
    releaseAuthorization: { methodologyId: 'STD-COM-MARAGON-METHODOLOGY-v1.0-20261121', authorisedBy: 'TEST FIXTURE', authorisedAt: 'TEST', reference: 'TEST-ONLY-NOT-LIVE' },
  };
}

describe('1. Indicator coverage, semantics and variant mapping', () => {
  it('keeps exactly ten canonical indicators in v1.0 order with v1.0 §4 titles', () => {
    assert.deepEqual(MARAGON_CANONICAL_MEANINGS.map((m) => m.id), [...CANONICAL_MARAGON_INDICATOR_IDS]);
    assert.deepEqual(MARAGON_INDICATORS.slice(0, 10).map((i) => `maragon:${i.code}`), [...CANONICAL_MARAGON_INDICATOR_IDS]);
    MARAGON_CANONICAL_MEANINGS.forEach((m, index) => assert.equal(MARAGON_INDICATORS[index].title, m.title_sq, m.id));
  });

  it('maps approved variants to their canonical parent and rejects unknown codes and axis C', () => {
    assert.equal(canonicalParent('ind:A2.2'), 'maragon:A2.2');
    assert.equal(canonicalParent('ind:A2.2-ADV'), 'maragon:A2.2');
    assert.equal(canonicalParent('ind:A2.3'), 'maragon:A2.3');
    assert.equal(canonicalParent('ind:O4.1'), 'maragon:O4.1');
    assert.equal(canonicalParent('G3.1-I'), 'maragon:G3.1');
    assert.equal(canonicalParent('R1.2-S'), 'maragon:R1.2');
    assert.equal(canonicalParent('R1.2-P'), 'maragon:R1.2');
    assert.equal(canonicalParent('A2.5'), null);
    assert.equal(canonicalParent('ind:G3.2'), null);
    assert.equal(canonicalParent('C'), null);
    assert.equal(canonicalParent('maragon:C'), null);
  });

  it('every live presenter record carries the ten slots with the individual variants', () => {
    assert.ok(records.length >= 23);
    for (const rec of records) {
      assert.deepEqual(indicatorSetProblems(rec.maragon.indicators, 'individual'), [], rec.id);
      assert.equal(rec.maragon.indicators.find((i) => i.id === 'maragon:G3.1')?.code, 'G3.1-I', rec.id);
    }
  });

  it('flags an outlet G3.1 code on an individual, an extra canonical indicator and a scored axis C', () => {
    const base = records[0].maragon.indicators.map((i) => ({ id: i.id, code: i.code }));
    assert.ok(indicatorSetProblems(base.map((i) => (i.id === 'maragon:G3.1' ? { ...i, code: 'G3.1' } : i))).length > 0);
    assert.ok(indicatorSetProblems([...base, { id: 'maragon:A2.5', code: 'A2.5' }]).length > 0);
    assert.ok(indicatorSetProblems([...base, { id: 'maragon:C', code: 'C', status: 'assessed', score: 50 }]).length > 0);
  });
});

describe('2. Null preservation and applicability', () => {
  it('keeps unknown as null and a measured 0 as a measurement', () => {
    for (const value of [undefined, null, '', Number.NaN, -1, 101, '50']) assert.equal(bandForScore(value), null);
    assert.equal(bandForScore(0), 'shume_e_dobet');
    assert.equal(bandForScore(20), 'shume_e_dobet');
    assert.equal(bandForScore(21), 'e_dobet');
    assert.equal(bandForScore(80), 'e_forte');
    assert.equal(bandForScore(81), 'shume_e_forte');
  });

  it('gives s_i only for assessed, threshold-met, human-final, medium/high values', () => {
    const ok: CompositeIndicatorInput = { id: 'A2.1', status: 'assessed', humanFinalScore: 55, confidence: 'medium', thresholdMet: true };
    assert.equal(indicatorScoreForComposite(ok), 55);
    for (const status of ['not_assessed', 'insufficient_evidence', 'not_applicable', 'assessed-qualitative'] as const) {
      assert.equal(indicatorScoreForComposite({ ...ok, status }), null, status);
    }
    assert.equal(indicatorScoreForComposite({ ...ok, confidence: 'low' }), null);
    assert.equal(indicatorScoreForComposite({ ...ok, thresholdMet: false }), null);
    assert.equal(indicatorScoreForComposite({ ...ok, humanFinalScore: undefined }), null);
    assert.equal(indicatorScoreForComposite({ ...ok, humanFinalScore: 0, confidence: 'medium' }), null, 'extreme band without high');
    assert.equal(indicatorScoreForComposite({ ...ok, humanFinalScore: 0, confidence: 'high' }), 0, 'measured zero stays zero');
  });

  it('shows "Pa vlerësim" and never a zero for every live presenter in public', () => {
    for (const rec of records) {
      for (const ind of rec.maragon.indicators) {
        assert.equal(visibleIndicatorBand(rec, ind, 'public').band, null, `${rec.id} ${ind.id}`);
      }
      const html = renderToStaticMarkup(React.createElement(BandRadar, { rec, mode: 'public', lang: 'sq' }));
      assert.equal(html.includes('data-level="0"'), false);
      assert.match(html, /Pa vlerësim/);
    }
  });
});

describe('3. Composite completeness and calculation (synthetic data)', () => {
  it('computes W0 for a complete individual profile and rounds only at the end', () => {
    const result = gatedComposite(synthetic({ 'R1.1': { humanFinalScore: 61 }, 'R1.2': { humanFinalScore: 62 } }), 'individual');
    // R = 61.5, A = 70, G = 70, O = 70 → 0.25·(61.5+70+70+70) = 67.875 → 68
    assert.equal(result.dimensions.R.score, 61.5);
    assert.equal(result.composite, 68);
    assert.equal(result.confidence, 'medium');
  });

  it('does not average whichever scores happen to be present (AM-02, AM-04)', () => {
    const missing = gatedComposite(synthetic({ 'A2.4': { status: 'insufficient_evidence', humanFinalScore: null } }), 'individual');
    assert.equal(missing.dimensions.A.score, null);
    assert.equal(missing.composite, null);
    const lowConfidence = gatedComposite(synthetic({ 'G3.2': { confidence: 'low' } }), 'individual');
    assert.equal(lowConfidence.dimensions.G.score, null);
    assert.equal(lowConfidence.composite, null);
  });

  it('removes not_applicable from the denominator (AM-02, AM-08) but never empties a dimension', () => {
    const r11na = gatedComposite(synthetic({ 'R1.1': { status: 'not_applicable', humanFinalScore: null } }), 'individual');
    assert.deepEqual(r11na.dimensions.R.eligible, ['R1.2']);
    assert.equal(r11na.dimensions.R.score, 70);
    assert.equal(r11na.composite, 70);
    const emptyR = gatedComposite(synthetic({ 'R1.1': { status: 'not_applicable' }, 'R1.2': { status: 'not_applicable' } }), 'individual');
    assert.equal(emptyR.dimensions.R.score, null);
    assert.equal(emptyR.composite, null);
  });

  it('applies the outlet gate n_A = 3 of 4 and requires both R1.2 sub-scores', () => {
    const outlet = gatedComposite(synthetic({ 'A2.4': { status: 'insufficient_evidence', humanFinalScore: null } }), 'outlet');
    assert.equal(outlet.dimensions.A.score, 70);
    const noP = gatedComposite(synthetic({ 'R1.2': { r12BothSubscores: false } }), 'individual');
    assert.equal(noP.dimensions.R.score, null);
  });

  it('nulls extreme dimension or composite values without high confidence', () => {
    const high = synthetic(Object.fromEntries(['R1.1', 'R1.2', 'A2.1', 'ind:A2.2', 'ind:A2.3', 'A2.4', 'G3.1-I', 'G3.2', 'ind:O4.1', 'O4.2'].map((id) => [id, { humanFinalScore: 90 }])));
    assert.equal(gatedComposite(high, 'individual').composite, null, 'medium confidence cannot reach 81–100');
    const allHigh = high.map((i) => ({ ...i, confidence: 'high' as const }));
    assert.equal(gatedComposite(allHigh, 'individual').composite, 90);
  });

  it('rejects axis C, reference series and duplicates without changing the result', () => {
    const base = gatedComposite(synthetic(), 'individual').composite;
    const extra: CompositeIndicatorInput[] = [
      ...synthetic(),
      { id: 'maragon:C', status: 'assessed', humanFinalScore: 0, confidence: 'high', thresholdMet: true },
      { id: 'A2.1', status: 'assessed', humanFinalScore: 0, confidence: 'high', thresholdMet: true, referenceSeries: true },
      { id: 'maragon:A2.1', status: 'assessed', humanFinalScore: 0, confidence: 'high', thresholdMet: true },
    ];
    const result = gatedComposite(extra, 'individual');
    assert.equal(result.composite, base);
    assert.equal(result.rejected.length, 3);
  });
});

describe('4. Official and provisional publication controls', () => {
  const ind = { status: 'assessed', officialBand: 'e_forte' as const, indicativeBand: 'e_forte' as const, confidence: 'medium' as const };

  it('opens the official gate only when every signed condition holds', () => {
    assert.equal(officialIndicatorDecision(openRecord(), ind).open, true);
    const closes: Array<[string, Partial<DisplayGateRecord>]> = [
      ['unsigned methodology', { methodology: 'STD-COM-MARAGON-METHODOLOGY-v1.1-DRAFT' }],
      ['flag false', { methodologyApproved: false }],
      ['pending review', { assessmentStatus: 'pending_review' }],
      ['suspended', { assessmentStatus: 'suspended' }],
      ['scoring suspended', { scoringSuspended: true }],
      ['no display authorisation', { authorizedForPublicDisplay: false }],
      ['right of reply offered only', { rightOfReply: 'offered' }],
      ['no release authorisation', { releaseAuthorization: null }],
      ['release under another version', { releaseAuthorization: { ...openRecord().releaseAuthorization!, methodologyId: 'v2.0' } }],
    ];
    for (const [label, change] of closes) assert.equal(officialIndicatorDecision({ ...openRecord(), ...change }, ind).open, false, label);
    assert.equal(officialIndicatorDecision(openRecord(), { ...ind, confidence: 'low' }).open, false);
    assert.equal(officialIndicatorDecision(openRecord(), { ...ind, officialBand: 'shume_e_forte' }).open, false, 'extreme needs high');
    assert.equal(officialIndicatorDecision(openRecord(), { ...ind, officialBand: 'shume_e_forte', confidence: 'high' }).open, true);
  });

  it('keeps the provisional path separate: written AM-09 approval, never an aggregate', () => {
    assert.equal(provisionalIndicatorDecision(openRecord(), ind).open, false, 'no AM-09 approval');
    assert.equal(provisionalIndicatorDecision({ ...openRecord(), am09ProvisionalApprovedInWriting: true }, ind).open, true);
    assert.equal(provisionalIndicatorDecision({ ...openRecord(), am09ProvisionalApprovedInWriting: true, rightOfReply: 'not_offered' }, ind).open, false);
    assert.equal(provisionalIndicatorDecision({ ...openRecord(), am09ProvisionalApprovedInWriting: true, releaseAuthorization: null }, ind).open, false, 'a public provisional display is a release');
    assert.equal(provisionalAggregateDecision().open, false);
    assert.equal(SIGNED_MARAGON_METHODOLOGY_IDS.length, 1);
  });

  it('labels a public indicative band with the exact AM-09 wording and no number', () => {
    assert.equal(AM09_PUBLIC_LABEL.sq, 'PROVIZOR — në pritje të miratimit');
    assert.equal(AM09_PUBLIC_LABEL.en, 'PROVISIONAL — pending sign-off');
    const html = renderToStaticMarkup(React.createElement(BandPill, { v: { band: 'mesatare', confidence: 'low', indicative: true, notApplicable: false }, lang: 'sq' }));
    assert.match(html, /PROVIZOR — në pritje të miratimit/);
    assert.doesNotMatch(html, />\s*\d{1,3}\s*</);
  });

  it('leaves every live record closed and its flags unchanged', () => {
    for (const rec of records) {
      assert.equal(rec.maragon.methodologyApproved, false, rec.id);
      assert.equal(rec.maragon.authorizedForPublicDisplay, false, rec.id);
      assert.equal(rec.maragon.am09ProvisionalApprovedInWriting, false, rec.id);
      assert.notEqual(rec.maragon.assessmentStatus, 'approved', rec.id);
      assert.equal(rec.maragon.composite, null, rec.id);
      assert.equal(rec.maragon.releaseAuthorization ?? null, null, rec.id);
    }
  });
});

describe('5. Entity independence', () => {
  it('decides a presenter band from the presenter record alone', () => {
    const decision = officialIndicatorDecision(openRecord(), { status: 'assessed', officialBand: 'mesatare', indicativeBand: null, confidence: 'medium' });
    assert.equal(decision.open, true);
    assert.equal(read('utils/maragonPublicationDecision.ts').includes('tvShow'), false);
  });

  it('keeps the composite to presenter indicators and MARAGON® types out of PARAGON® components', () => {
    assert.doesNotMatch(read('components/PoliticianCard.tsx'), /MaragonDimension/);
    assert.doesNotMatch(read('utils/maragonComposite.ts'), /paragon/i);
    assert.doesNotMatch(read('lib/maragonIndicatorMap.ts'), /from '.*paragon/i);
  });
});

describe('6. Mock-data exclusion', () => {
  const vip = mediaProfilesData.find((p) => p.id === 'vip_m1')!;
  it('no longer stores the retired seven-label rows on vip_m1', () => {
    assert.equal(vip.maragonAnalysis, undefined);
    assert.equal(vip.dynamicScore ?? null, null);
    assert.equal(isRetiredLegacyMaragonAnalysis([
      { dimension: 'Pajtueshmëria Etike' },
    ]), true);
  });
  it('never publishes those rows, even if the status were approved', () => {
    const approvedClone = { ...vip, maragonAssessmentStatus: 'approved' as const, scoringSuspended: false, methodologyApproved: true };
    assert.deepEqual(publishableMaragonAnalysis(approvedClone), []);
    assert.equal(publishedMaragonAverage(approvedClone), null);
    assert.equal(rankableMaragonScore(approvedClone), null);
  });
  it('removes the fixed "90" target from media radars', () => {
    const page = read('components/VipProfilePage.tsx');
    assert.match(page, /mediaSubject \? \[\] : \[\{\s*label: 'Target \(Benchmark\)'/);
  });
});

describe('7. Signed AM-10 benchmark lines, and rejection of any other amendment', () => {
  function forgedAm10(): MaragonBenchmarkSeries[] {
    return MARAGON_BENCHMARKS.map((series) => ({
      ...series,
      status: 'approved' as const,
      amendmentId: 'AM-10',
      ownerSignOff: { by: 'NOT SIGNED', dateTirana: '—', amendmentId: 'AM-10' },
      points: series.points.map((p) => ({ ...p, status: 'approved' as const, band: 'e_forte' as const })),
    }));
  }
  it('lists AM-10 as the only signed benchmark amendment', () => {
    assert.deepEqual([...SIGNED_BENCHMARK_AMENDMENT_IDS], ['AM-10']);
    assert.equal(PROPOSED_UNSIGNED_BENCHMARK_AMENDMENT_IDS.includes('AM-10'), false);
  });
  it('plots the signed series and rejects a sign-off that is not the owner record', () => {
    for (const series of MARAGON_BENCHMARKS) for (const point of series.points) assert.equal(isPlottableBenchmarkPoint(series, point), true);
    for (const series of forgedAm10()) for (const point of series.points) assert.equal(isPlottableBenchmarkPoint(series, point), false);
    const html = renderToStaticMarkup(React.createElement(BandRadar, { rec: { maragon: baseMaragon('vip_test', [], []) }, mode: 'public', lang: 'sq', benchmarks: forgedAm10() }));
    assert.equal(html.includes('data-radar-series="albania_expected"'), false);
    assert.equal(html.includes('data-radar-series="europe_industry"'), false);
    const other = { ...MARAGON_BENCHMARKS[0], amendmentId: 'AM-99', ownerSignOff: { by: 'Dr Alban Gj. THIKA', dateTirana: '2026-11-23T10:56:00+01:00', amendmentId: 'AM-99' } };
    for (const point of other.points) assert.equal(isPlottableBenchmarkPoint(other, point), false);
  });
  it('never feeds benchmark series into the composite', () => {
    const asInputs: CompositeIndicatorInput[] = MARAGON_BENCHMARKS[0].points.map((p) => ({ id: p.indicatorId, status: 'assessed', humanFinalScore: 70, confidence: 'high', thresholdMet: true, referenceSeries: true }));
    assert.equal(gatedComposite(asInputs, 'individual').composite, null);
  });
});

describe('7b. Report-page benchmark suppression (Gemini reconciliation G3-26)', () => {
  it('shows no peer average and no mock standard series on the MARAGON® report when the only signed amendment is AM-10', async () => {
    const { maragonReportBenchmarksArePublic, MaragonReportPage } = await import('../components/MaragonReportPage');
    assert.deepEqual(maragonReportBenchmarksArePublic(), { standard: false, peerAverage: false });
    assert.deepEqual(maragonReportBenchmarksArePublic(['SIGNED-TEST-ONLY']), { standard: true, peerAverage: false });
    const src = read('components/MaragonReportPage.tsx');
    assert.match(src, /benchmarkGate\.peerAverage \?/);
    assert.match(src, /benchmarkGate\.standard \?/);
    assert.ok(MaragonReportPage);
  });
});

describe('8. Portrait provenance display', () => {
  it('shows the owner-supplied credit, records no written reuse licence and links no unverified source page', () => {
    let ownerSupplied = 0;
    for (const rec of records) {
      const shown = resolvePresentableMediaPhoto(rec.photo, rec.id);
      if (!shown) continue;
      if (rec.photo.officialSource?.channelType === 'owner_supplied') {
        ownerSupplied += 1;
        assert.equal(shown.credit, OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT, rec.id);
        assert.match(shown.credit, /source to be recorded/);
        assert.equal(rec.photo.officialSource?.pageUrl, '', rec.id);
        assert.equal(rec.documents.photoLicence.writtenReuseLicence, false, rec.id);
        assert.match(shown.url, /^\/media-personalities\/portraits\/[a-z0-9-]+-450x600\.jpg$/);
      }
    }
    assert.ok(ownerSupplied >= 23);
  });
});

describe('9. Methodology version and public label consistency', () => {
  it('uses one signed methodology id everywhere', () => {
    assert.equal(METHODOLOGY_ID, 'STD-COM-MARAGON-METHODOLOGY-v1.0-20261121');
    assert.equal(MARAGON_BENCHMARK_METHODOLOGY_ID, METHODOLOGY_ID);
    assert.equal(SIGNED_MARAGON_METHODOLOGY_IDS[0], METHODOLOGY_ID);
    for (const rec of records) assert.equal(rec.maragon.methodology, METHODOLOGY_ID, rec.id);
  });
  it('uses the five signed band labels on five radar rings and the signed confidence wording', () => {
    assert.deepEqual(Object.values(MARAGON_BAND_LABELS).map((b) => `${b.sq} / ${b.en}`), [
      'Shumë e dobët / Very weak', 'E dobët / Weak', 'Mesatare / Moderate', 'E fortë / Strong', 'Shumë e fortë / Very strong',
    ]);
    assert.deepEqual(Object.values(MARAGON_BAND_LABELS).map((b) => b.level), [1, 2, 3, 4, 5]);
    assert.equal(MARAGON_CONFIDENCE_LABELS.high.sq, 'E lartë');
    assert.equal(MARAGON_CONFIDENCE_LABELS.medium.sq, 'Mesatare');
  });
  it('states the signed right-of-reply period (10 working days, +5) and not 14 calendar days', () => {
    const notes = methodologyNotes();
    assert.match(notes.rightOfReply_sq, /10 ditë pune/);
    assert.match(notes.rightOfReply_sq, /\+5 ditë pune/);
    assert.match(notes.rightOfReply_en, /10 working days/);
    for (const file of ['data/maragon/presenterFactory.ts', 'data/maragon/vip_m1.presenter.ts', 'components/maragon/MaragonPresenterProfilePage.tsx']) {
      assert.doesNotMatch(read(file), /14 (calendar days|ditë kalendarike)/, file);
    }
  });
  it('does not present the reported 19.11.2026 sampling ruling as a decision in the shared template', () => {
    const factory = read('data/maragon/presenterFactory.ts');
    assert.doesNotMatch(factory, /\(vendimi 19\.11\.2026\)|\(19\.11\.2026 ruling\)/);
    assert.match(factory, /pret konfirmim me shkrim/);
  });
});
