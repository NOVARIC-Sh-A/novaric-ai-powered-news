/**
 * UD-19 (owner decision t329u): MARAGON® bands-only public presentation, and UD-02: both reference
 * lines hidden in every publication state. Signed v1.0 §10 (D-21), §1.2, §3.1; AM-09; AM-10 unsigned.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LanguageProvider } from '../contexts/LanguageContext';
import { MaragonReportPage, maragonReportBenchmarksArePublic } from '../components/MaragonReportPage';
import { MaragonSummaryDisplay } from '../components/MaragonSummaryDisplay';
import { Top10MediaInfluencers } from '../components/Top10MediaInfluencers';
import { ComparisonModal } from '../components/ComparisonModal';
import { PieChart } from '../components/PieChart';
import { BandRadar } from '../components/maragon/maragonPresenterUi';
import { MARAGON_BENCHMARKS, SIGNED_BENCHMARK_AMENDMENT_IDS, isPlottableBenchmarkPoint } from '../data/maragon/benchmarks';
import { baseMaragon } from '../data/maragon/presenterFactory';
import type { MaragonBenchmarkSeries } from '../components/maragon/maragonBenchmarkTypes';
import type { MaragonBandKey } from '../utils/maragonPublication';
import {
  MARAGON_PUBLIC_NUMBERS_ALLOWED,
  MARAGON_PUBLIC_RANKING_PERMITTED,
  compareMaragonNeutral,
  publishedBand,
  publishedBandFromKey,
  publicBandText,
  toPublicMaragonPayload,
} from '../utils/maragonBandsOnly';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

/** Public text of a render: text nodes plus aria-label, title and alt values. Class names are excluded. */
function publicText(html: string): string {
  const attrs = [...html.matchAll(/\s(?:aria-label|title|alt)="([^"]*)"/g)].map((m) => m[1]);
  const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => m[1]);
  const text = html.replace(/<[^>]+>/g, ' ');
  const decode = (v: string) => v.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d))).replace(/&(?:amp|quot|lt|gt|nbsp);/g, ' ');
  return decode([text, ...attrs, ...titles].join(' \n '));
}
/** Indicator codes (R1.1, G3.1-I, A2.2-ADV) and amendment ids (AM-10) are identifiers, not scores. */
const stripIdentifiers = (text: string) => text.replace(/\b(?:ind:)?[RAGOSC]\d(?:\.\d+)?(?:-[A-Z]+)?\b/g, '').replace(/\bAM-\d+\b/g, '');
const hasDigit = (html: string) => /\d/.test(stripIdentifiers(publicText(html)));
const firstDigits = (html: string) => stripIdentifiers(publicText(html)).match(/.{0,30}\d+.{0,30}/)?.[0];

const ALL_STATES = ['not_assessed', 'research_only', 'pending_review', 'approved', 'withheld', 'suspended'] as const;

function report(status: string, methodologyApproved: boolean) {
  return {
    entityId: 'subjekt_prove',
    entityType: 'individual' as const,
    compositeScore: 82,
    Readiness: 88,
    Aptitude: 92,
    Governance: 78,
    OversightNurturing: 80,
    assessmentStatus: status as any,
    scoringSuspended: status === 'suspended',
    methodologyApproved,
    benchmarks: {
      peerAverage: { Readiness: 61, Aptitude: 62, Governance: 63, OversightNurturing: 64 },
      standardAdherence: { Readiness: 71, Aptitude: 72, Governance: 73, OversightNurturing: 74 },
    },
    indicatorDetails: { 'R1.1': { score: 2 } as any, 'A2.4': { score: 3, band: 'mesatare' } as any },
    explainabilityData: null,
  };
}

const renderReport = (r: ReturnType<typeof report>) =>
  renderToStaticMarkup(React.createElement(LanguageProvider, null, React.createElement(MaragonReportPage, { report: r as any, onBack: () => undefined })));

function am10Series(status: 'approved' | 'draft_unapproved'): MaragonBenchmarkSeries[] {
  return MARAGON_BENCHMARKS.map((series) => ({
    ...series,
    status,
    amendmentId: 'AM-10',
    ownerSignOff: status === 'approved' ? { by: 'TEST FIXTURE', dateTirana: '2026-11-23 Tirana', amendmentId: 'AM-10' } : null,
    points: series.points.map((point) => ({ ...point, status, band: 'e_forte' as MaragonBandKey, confidence: 'high' as const })),
  }));
}

function presenter(status: string, extra: Record<string, unknown> = {}) {
  const maragon = baseMaragon('vip_test', [], []);
  (maragon as any).assessmentStatus = status;
  Object.assign(maragon, extra);
  maragon.indicators = maragon.indicators.map((indicator) => ({
    ...indicator,
    status: 'assessed' as const,
    officialBand: 'mesatare' as MaragonBandKey,
    indicativeBand: 'e_dobet' as MaragonBandKey,
    confidence: 'high' as const,
  }));
  return { maragon };
}

describe('UD-02 — both reference lines hidden in every publication state', () => {
  it('report page: no peer-average and no standard series in any state, with or without methodologyApproved', () => {
    assert.deepEqual(SIGNED_BENCHMARK_AMENDMENT_IDS, []);
    assert.deepEqual(maragonReportBenchmarksArePublic(), { standard: false, peerAverage: false });
    for (const state of ALL_STATES) {
      for (const approved of [false, true]) {
        const html = renderReport(report(state, approved));
        assert.doesNotMatch(html, /Mesatarja e Kolegëve|Përputhshmëria me Standardin|Krahasimi \(Benchmark\)/, `${state}/${approved}`);
        assert.equal(hasDigit(html), false, `${state}/${approved}: ${firstDigits(html)}`);
      }
    }
  });

  it('presenter radar: no reference polygon in public or internal (PROVIZOR) mode, in any state, even with an AM-10 "approved" attempt', () => {
    for (const state of ALL_STATES) {
      for (const mode of ['public', 'internal'] as const) {
        for (const series of [MARAGON_BENCHMARKS, am10Series('draft_unapproved'), am10Series('approved')]) {
          const extra = state === 'approved'
            ? { authorizedForPublicDisplay: true, methodologyApproved: true, am09ProvisionalApprovedInWriting: true, rightOfReply: 'completed' }
            : {};
          const html = renderToStaticMarkup(React.createElement(BandRadar, { rec: presenter(state, extra), mode, lang: 'sq', benchmarks: series }));
          assert.equal(html.includes('data-radar-series="albania_expected"'), false, `${state}/${mode}`);
          assert.equal(html.includes('data-radar-series="europe_industry"'), false, `${state}/${mode}`);
          assert.doesNotMatch(html, /Tre linja|Three lines/);
          assert.match(html, /AM-10/);
          assert.equal(hasDigit(html), false, `${state}/${mode}: ${firstDigits(html)}`);
        }
      }
    }
    for (const series of am10Series('approved')) for (const point of series.points) assert.equal(isPlottableBenchmarkPoint(series, point), false);
  });

  it('analysis page and presenter page carry no peer-average, global-standard or industry-standard figure', () => {
    const analysis = read('components/TvPersonalitiesAnalysisPage.tsx');
    assert.doesNotMatch(analysis, /peerAverage|globalBenchmark|Mesatarja e Kolegëve|Standardi Global/);
    const presenterPage = read('components/PresenterAnalysisPage.tsx');
    assert.doesNotMatch(presenterPage, /\{benchmark\}%|\{score\}%|Standardi i Industrisë/);
  });
});

describe('UD-19 — bands-only presentation (v1.0 §10)', () => {
  it('declares no public numbers and no ranking', () => {
    assert.equal(MARAGON_PUBLIC_NUMBERS_ALLOWED, false);
    assert.equal(MARAGON_PUBLIC_RANKING_PERMITTED, false);
  });

  it('publishedBand returns a band only through an open gate and a measured value, never the number', () => {
    assert.equal(publishedBand(false, 90), null);
    assert.equal(publishedBand(true, null), null);
    assert.equal(publishedBand(true, undefined), null);
    assert.equal(publishedBand(true, '90'), null);
    assert.equal(publishedBand(true, 101), null);
    assert.deepEqual(publishedBand(true, 0), { band: 'shume_e_dobet', level: 1, label_sq: 'Shumë e dobët', label_en: 'Very weak' });
    assert.equal(publishedBand(true, 88)?.band, 'shume_e_forte');
    assert.equal(JSON.stringify(publishedBand(true, 88)).includes('88'), false);
    assert.equal(publicBandText(null, 'sq'), 'Pa vlerësim');
    assert.equal(publicBandText(null, 'en'), 'Not assessed');
    assert.equal(publishedBandFromKey(true, 'mesatare')?.label_sq, 'Mesatare');
    assert.equal(publishedBandFromKey(true, 2), null);
    assert.equal(publishedBandFromKey(false, 'mesatare'), null);
  });

  it('public payload exposes publishedBand only, with no numeric field', () => {
    const open = toPublicMaragonPayload(report('approved', true), true);
    assert.equal(open.publishedBand, 'shume_e_forte');
    assert.deepEqual(open.dimensions, { Readiness: 'shume_e_forte', Aptitude: 'shume_e_forte', Governance: 'e_forte', OversightNurturing: 'e_forte' });
    const walk = (v: unknown): boolean => typeof v === 'number' || (v !== null && typeof v === 'object' && Object.values(v as object).some(walk));
    assert.equal(walk(open), false);
    assert.equal(/\d/.test(JSON.stringify(open)), false);
    const closed = toPublicMaragonPayload(report('approved', false), false);
    assert.equal(closed.publishedBand, null);
    assert.equal(closed.label, 'Pa vlerësim / Not assessed');
    assert.ok(Object.values(closed.dimensions).every((v) => v === null));
  });

  it('report page with every gate open (test fixture) shows bands and no digits; legacy 0–3 indicator values are not converted', () => {
    const html = renderReport(report('approved', true));
    assert.match(html, /Shumë e fortë/);
    assert.match(html, /E fortë/);
    assert.match(html, /data-maragon-band="shume_e_forte"/);
    // R1.1 carries only a legacy numeric score → not assessed; A2.4 carries a stored band key → shown.
    assert.match(html, /R1\.1/);
    assert.match(html, /Mesatare/);
    assert.equal(hasDigit(html), false, firstDigits(html));
    assert.doesNotMatch(html, /gauge|Pikët/i);
  });

  it('report page with the gate closed reads "Pa vlerësim" and shows no band', () => {
    for (const state of ALL_STATES) {
      const html = renderReport(report(state, false));
      assert.match(html, /Pa vlerësim/);
      assert.doesNotMatch(html, /data-maragon-band="(?!not_assessed)/);
    }
  });

  it('summary display: bands with accessible words; closed gate → four "Pa vlerësim"', () => {
    const scores = { Readiness: 88, Aptitude: 92, Governance: 78, OversightNurturing: 80 };
    const open = renderToStaticMarkup(React.createElement(MaragonSummaryDisplay, { scores, gateOpen: true }));
    assert.equal(hasDigit(open), false);
    assert.match(open, /aria-label="Readiness \(Gatishmëria\): Shumë e fortë \/ Very strong"/);
    assert.doesNotMatch(open, /width:\s*\d/);
    const closed = renderToStaticMarkup(React.createElement(MaragonSummaryDisplay, { scores, gateOpen: false }));
    assert.equal((closed.match(/Pa vlerësim/g) || []).length >= 4, true);
    assert.equal(hasDigit(closed), false);
  });

  it('list view: alphabetical, no rank numbers, no score bars, and higher scores do not move a subject up', () => {
    const mk = (id: string, name: string, score: number, approved = true) => ({
      id, name, gender: 'male', category: 'Media',
      maragonAssessmentStatus: approved ? 'approved' : 'pending_review',
      methodologyApproved: true,
      maragonAnalysis: [{ dimension: 'Readiness', score }],
    });
    const profiles: Record<string, any> = {
      a: mk('a', 'Zana TEST', 95),
      b: mk('b', 'Ana TEST', 15),
      c: mk('c', 'Blerim TEST', 55),
      d: mk('d', 'Çlirim TEST', 99, false),
    };
    const html = renderToStaticMarkup(React.createElement(Top10MediaInfluencers, { profiles }));
    const order = [...html.matchAll(/<p class="flex-1[^"]*">([^<]+)<\/p>/g)].map((m) => m[1]);
    assert.deepEqual(order, ['Ana TEST', 'Blerim TEST', 'Zana TEST']);
    assert.equal(hasDigit(html), false);
    assert.doesNotMatch(html, /#\d|Top 10|width:/);
    // methodologyApproved missing → no band, no entry.
    const ungated = { a: { ...profiles.a, methodologyApproved: false } };
    assert.equal(renderToStaticMarkup(React.createElement(Top10MediaInfluencers, { profiles: ungated })), '');
    assert.equal([{ name: 'Ëndrit' }, { name: 'Erion' }, { name: 'Dritan' }].sort(compareMaragonNeutral).map((x) => x.name).join(','), 'Dritan,Erion,Ëndrit');
  });

  it('comparison view: bands side by side, no numbers and no "greater" highlight', () => {
    const mk = (id: string, name: string, score: number) => ({
      id, name, gender: 'female', category: 'Media', maragonAssessmentStatus: 'approved', methodologyApproved: true,
      averageMaragonScore: score, maragonAnalysis: [{ dimension: 'Readiness', score }],
    });
    const html = renderToStaticMarkup(React.createElement(LanguageProvider, null,
      React.createElement(ComparisonModal, { profile1: mk('x', 'Ana TEST', 90) as any, profile2: mk('y', 'Era TEST', 30) as any, onClose: () => undefined })));
    assert.match(html, /Shumë e fortë/);
    assert.match(html, /E dobët/);
    assert.equal(hasDigit(html), false);
    assert.doesNotMatch(html, /width:\s*\d/);
  });

  it('pie tooltips can drop percentages on bands-only surfaces', () => {
    const data = [{ name: 'Pozitiv', value: 70, color: '#0f0' }, { name: 'Negativ', value: 30, color: '#f00' }];
    assert.match(renderToStaticMarkup(React.createElement(PieChart, { data, size: 80 })), /%/);
    const hidden = renderToStaticMarkup(React.createElement(PieChart, { data, size: 80, hideValues: true }));
    assert.doesNotMatch(hidden, /%/);
    assert.equal(/\d/.test([...hidden.matchAll(/<title>([^<]*)<\/title>/g)].map((m) => m[1]).join(' ')), false);
  });

  it('no MARAGON® API route or share preview carries a number', () => {
    const server = read('server.ts');
    assert.doesNotMatch(server, /maragon/i);
    const og = read('scripts/writeOgShells.ts');
    const block = og.slice(og.indexOf("'maragon-analysis.html'"), og.indexOf('}));', og.indexOf("'maragon-analysis.html'")));
    assert.equal(/description: '[^']*\d/.test(block), false);
    const seo = read('utils/routeSeo.ts');
    const mock = seo.slice(seo.indexOf('maragonMockupSeo'), seo.indexOf('maragonMockupSeo') + 600);
    assert.equal(/description: '[^']*\d/.test(mock), false);
  });

  it('media list sorts by name only and computes no MARAGON-derived influence score', () => {
    const src = read('components/MediaPersonalitiesPage.tsx');
    assert.match(src, /MARAGON_PUBLIC_RANKING_PERMITTED && enriched\.some/);
    assert.match(src, /const influenceScore: number \| null = null;/);
    assert.match(src, /case 'name': return compareMaragonNeutral\(a, b\);/);
  });
});
