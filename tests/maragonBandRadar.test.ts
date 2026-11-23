import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BandRadar, MARAGON_RADAR_SERIES_STYLE } from '../components/maragon/maragonPresenterUi';
import {
  AM10_OWNER_SIGN_OFF,
  MARAGON_BENCHMARKS,
  MARAGON_BENCHMARK_AWAITING_NOTE,
  MARAGON_RADAR_LEGEND,
  SIGNED_BENCHMARK_AMENDMENT_IDS,
  isPlottableBenchmarkPoint,
  publicBenchmarkLines,
} from '../data/maragon/benchmarks';
import { baseMaragon } from '../data/maragon/presenterFactory';
import { mediaProfilesData } from '../data/mediaProfiles';
import { getPresenterRecord } from '../components/maragon/maragonPresenterUi';
import type { MaragonBenchmarkSeries } from '../components/maragon/maragonBenchmarkTypes';
import type { MaragonBandKey } from '../utils/maragonPublication';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

function markup(props: React.ComponentProps<typeof BandRadar>): string {
  return renderToStaticMarkup(React.createElement(BandRadar, props));
}

function signedBenchmarks(): MaragonBenchmarkSeries[] {
  return MARAGON_BENCHMARKS.map((series, index) => ({
    ...series,
    status: 'approved',
    amendmentId: 'TEST-ONLY-NOT-LIVE',
    ownerSignOff: {
      by: 'Dr Alban Gj. THIKA',
      dateTirana: '2026-11-22 Tirana',
      amendmentId: 'TEST-ONLY-NOT-LIVE',
    },
    points: series.points.map((point) => ({
      ...point,
      status: 'approved',
      band: (index === 0 ? 'e_dobet' : 'mesatare') as MaragonBandKey,
      confidence: 'high',
    })),
  }));
}

function draftBenchmarks(): MaragonBenchmarkSeries[] {
  return MARAGON_BENCHMARKS.map((series) => ({
    ...series,
    status: 'draft_unapproved',
    ownerSignOff: null,
    points: series.points.map((point) => ({
      ...point,
      status: 'draft_unapproved' as const,
      band: 'e_forte' as MaragonBandKey,
      confidence: 'low' as const,
    })),
  }));
}

function openPresenter(band: MaragonBandKey) {
  const maragon = baseMaragon('vip_test', [], []);
  maragon.assessmentStatus = 'approved';
  maragon.authorizedForPublicDisplay = true;
  maragon.scoringSuspended = false;
  maragon.methodologyApproved = true;
  maragon.rightOfReply = 'completed';
  // Test fixture only (D-30 release authorisation is required by the official gate).
  maragon.releaseAuthorization = {
    methodologyId: maragon.methodology,
    authorisedBy: 'TEST FIXTURE',
    authorisedAt: '2026-11-22 Tirana',
    reference: 'TEST-ONLY-NOT-LIVE',
  };
  maragon.indicators = maragon.indicators.map((indicator) => ({
    ...indicator,
    status: 'assessed' as const,
    officialBand: band,
    confidence: 'high' as const,
  }));
  return { maragon };
}

const ALBANIA_E_FORTE = ['maragon:R1.1', 'maragon:R1.2', 'maragon:A2.1', 'maragon:A2.2', 'maragon:A2.3', 'maragon:A2.4', 'maragon:G3.1', 'maragon:G3.2', 'maragon:O4.1', 'maragon:O4.2'];
const EUROPE_SHUME = ['maragon:R1.2', 'maragon:A2.1', 'maragon:G3.1'];

function nullBenchmarks(): MaragonBenchmarkSeries[] {
  return MARAGON_BENCHMARKS.map((series) => ({
    ...series,
    status: 'not_assessed' as const,
    amendmentId: null,
    ownerSignOff: null,
    points: series.points.map((point) => ({
      ...point,
      status: 'not_assessed' as const,
      band: null,
      confidence: null,
    })),
  }));
}

describe('MARAGON three-level presenter radar', () => {
  it('ships both AM-10 series as signed bands, with Axis C excluded', () => {
    assert.deepEqual([...SIGNED_BENCHMARK_AMENDMENT_IDS], ['AM-10']);
    assert.equal(MARAGON_BENCHMARKS.length, 2);
    assert.deepEqual(MARAGON_BENCHMARKS.map((series) => series.id), ['albania_expected', 'europe_industry']);
    assert.equal(MARAGON_RADAR_LEGEND.albania_expected.sq, 'Standardi i pritur në Shqipëri');
    assert.equal(MARAGON_RADAR_LEGEND.albania_expected.en, 'Expected standard in Albania');
    assert.equal(MARAGON_RADAR_LEGEND.europe_industry.sq, 'Standardi i industrisë europiane/ndërkombëtare');
    assert.equal(MARAGON_RADAR_LEGEND.europe_industry.en, 'European/international industry standard');
    for (const series of MARAGON_BENCHMARKS) {
      assert.equal(series.status, 'approved');
      assert.equal(series.amendmentId, 'AM-10');
      assert.deepEqual(series.ownerSignOff, AM10_OWNER_SIGN_OFF);
      assert.equal(series.points.length, 10);
      assert.equal(series.points.some((point) => point.indicatorId === 'maragon:C' || point.indicatorId === 'C'), false);
      for (const point of series.points) {
        const expected = series.id === 'europe_industry' && EUROPE_SHUME.includes(point.indicatorId) ? 'shume_e_forte' : 'e_forte';
        assert.equal(point.band, expected, `${series.id} ${point.indicatorId}`);
        assert.equal(point.status, 'approved');
        assert.equal(isPlottableBenchmarkPoint(series, point), true);
        assert.ok(ALBANIA_E_FORTE.includes(point.indicatorId));
      }
    }
    const source = read('data/maragon/benchmarks.ts');
    assert.doesNotMatch(source, /peerAverage|globalBenchmark|Mesatarja e Kolegëve|Mesatarja e kolegëve/);
    assert.equal(read('components/figurat-politike/primitives/RadarChart.tsx').includes('MARAGON_BENCHMARKS'), false);
    assert.equal(read('components/RadarChart.tsx').includes('albania_expected'), false);
  });

  it('does not change stored presenter bands or publication flags', () => {
    for (const profile of mediaProfilesData) {
      const record = getPresenterRecord(profile);
      if (!record) continue;
      const before = JSON.stringify(record.maragon);
      markup({ rec: record, mode: 'public', lang: 'sq' });
      assert.equal(JSON.stringify(record.maragon), before);
      assert.equal(record.maragon.composite, null);
      assert.notEqual(record.maragon.assessmentStatus, 'approved');
      assert.equal(record.maragon.methodologyApproved, false);
      assert.equal(record.maragon.authorizedForPublicDisplay, false);
      assert.equal(record.maragon.am09ProvisionalApprovedInWriting, false);
      assert.equal(record.maragon.scoringSuspended, true);
    }
  });

  it('draws no benchmark polygon and no zero point while values are null', () => {
    const html = markup({ rec: { maragon: baseMaragon('vip_m5', [], []) }, mode: 'public', lang: 'sq', benchmarks: nullBenchmarks() });
    assert.equal(html.includes('data-radar-series="albania_expected"'), false);
    assert.equal(html.includes('data-radar-series="europe_industry"'), false);
    assert.equal(html.includes('data-radar-series="presenter"'), false);
    assert.equal(html.includes('data-level="0"'), false);
    assert.equal(html.includes('data-radius="0.00"'), false);
    assert.equal((html.match(/data-radar-ring="/g) || []).length, 5);
    assert.match(html, /Pa vlerësim/);
    assert.match(html, /Standardi i pritur në Shqipëri/);
    assert.match(html, /Expected standard in Albania/);
    assert.match(html, /Standardi i industrisë europiane\/ndërkombëtare/);
    assert.match(html, /European\/international industry standard/);
    assert.doesNotMatch(html, /evropiane|Standard i pritur në Shqipëri/);
    assert.match(html, new RegExp(MARAGON_BENCHMARK_AWAITING_NOTE.sq.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.doesNotMatch(html, /i pa nënshkruar|unsigned|not in force/);
    assert.doesNotMatch(html, /Mesatarja e Kolegëve|peerAverage|globalBenchmark/);
    assert.equal(html.includes('>C<'), false);
    const swatch = (id: string) => {
      const tag = html.match(new RegExp(`<line[^>]*data-radar-swatch="${id}"[^>]*>`))?.[0];
      assert.ok(tag, id);
      return tag;
    };
    assert.match(swatch('presenter'), /stroke="#30384B"/);
    assert.doesNotMatch(swatch('presenter'), /stroke-dasharray/);
    assert.match(swatch('albania_expected'), /stroke="#C05621"/);
    assert.match(swatch('albania_expected'), /stroke-dasharray="6 4"/);
    assert.match(swatch('europe_industry'), /stroke="#5B3A9E"/);
    assert.match(swatch('europe_industry'), /stroke-dasharray="2 3"/);
  });

  it('omits unapproved draft benchmark bands', () => {
    const html = markup({ rec: { maragon: baseMaragon('vip_m5', [], []) }, mode: 'public', lang: 'sq', benchmarks: draftBenchmarks() });
    assert.equal(html.includes('data-radar-series="albania_expected"'), false);
    assert.equal(html.includes('data-radar-series="europe_industry"'), false);
    assert.equal(html.includes('data-level="0"'), false);
  });

  it('draws three series with distinct strokes and dash patterns once a test-only sign-off exists', () => {
    const html = markup({ rec: openPresenter('mesatare'), mode: 'public', lang: 'sq', benchmarks: signedBenchmarks(), signedBenchmarkAmendments: ['TEST-ONLY-NOT-LIVE'] });
    const presenter = html.match(/data-radar-series="presenter"[\s\S]*?data-radar-mark="polygon"[^>]*/);
    const albania = html.match(/data-radar-series="albania_expected"[\s\S]*?data-radar-mark="polygon"[^>]*/);
    const europe = html.match(/data-radar-series="europe_industry"[\s\S]*?data-radar-mark="polygon"[^>]*/);
    assert.ok(presenter);
    assert.ok(albania);
    assert.ok(europe);
    assert.match(presenter[0], /stroke="#30384B"/);
    assert.doesNotMatch(presenter[0], /stroke-dasharray/);
    assert.match(presenter[0], /fill="rgba\(48,56,75,0\.12\)"/);
    assert.match(albania[0], /stroke="#C05621"/);
    assert.match(albania[0], /stroke-dasharray="6 4"/);
    assert.match(albania[0], /fill="none"/);
    assert.match(europe[0], /stroke="#5B3A9E"/);
    assert.match(europe[0], /stroke-dasharray="2 3"/);
    assert.match(europe[0], /fill="none"/);
    assert.equal(html.includes('data-level="0"'), false);
    assert.equal(html.includes('data-radius="0.00"'), false);
    assert.doesNotMatch(html, />\s*\d{1,3}\s*</);
  });

  it('keeps an unapproved presenter off the public polygon', () => {
    const html = markup({ rec: { maragon: baseMaragon('vip_m1', [], []) }, mode: 'public', lang: 'en', benchmarks: signedBenchmarks(), signedBenchmarkAmendments: ['TEST-ONLY-NOT-LIVE'] });
    assert.equal(html.includes('data-radar-series="presenter"'), false);
    assert.match(html, /data-radar-series="albania_expected"/);
    assert.match(html, /Pa vlerësim/);
  });

  it('keeps the red dashed treatment when the presenter series is indicative', () => {
    const maragon = baseMaragon('vip_test', [], []);
    maragon.indicators = maragon.indicators.map((indicator) => ({
      ...indicator,
      indicativeBand: 'e_dobet' as MaragonBandKey,
      confidence: 'low' as const,
    }));
    const html = markup({ rec: { maragon }, mode: 'internal', lang: 'sq', benchmarks: MARAGON_BENCHMARKS });
    const presenter = html.match(/data-radar-series="presenter"[\s\S]*?data-radar-mark="polygon"[^>]*/);
    assert.ok(presenter);
    assert.match(presenter[0], /stroke="#e4191e"/);
    assert.match(presenter[0], /stroke-dasharray="4 3"/);
    assert.match(html, /data-radar-series="albania_expected"/);
    assert.equal(MARAGON_RADAR_SERIES_STYLE.presenter.indicativeStroke, '#e4191e');
    assert.equal(MARAGON_RADAR_SERIES_STYLE.albania_expected.dash, '6 4');
    assert.equal(MARAGON_RADAR_SERIES_STYLE.europe_industry.dash, '2 3');
  });

  it('plots the signed AM-10 lines as bands and keeps numbers out of every public string', () => {
    const before = baseMaragon('vip_m5', [], []);
    before.indicators = [...before.indicators, { ...before.indicators[0], id: 'maragon:C', code: 'C' }];
    const snapshot = JSON.stringify(before);
    const html = markup({ rec: { maragon: before }, mode: 'public', lang: 'sq' });
    assert.equal(JSON.stringify(before), snapshot);
    assert.equal(before.composite, null);
    assert.equal(before.assessmentStatus, 'not_assessed');
    assert.equal(before.authorizedForPublicDisplay, false);
    assert.equal(before.am09ProvisionalApprovedInWriting, false);
    assert.equal(before.scoringSuspended, true);
    assert.equal(before.methodologyApproved, false);
    assert.match(html, /data-radar-series="albania_expected"/);
    assert.match(html, /data-radar-series="europe_industry"/);
    assert.equal(html.includes('data-radar-series="presenter"'), false);
    assert.equal((html.match(/data-radar-series="albania_expected"[\s\S]*?data-band="e_forte"/g) || []).length >= 1, true);
    assert.equal((html.match(/data-band="shume_e_forte"/g) || []).length, 3);
    assert.equal((html.match(/data-band="e_forte"/g) || []).length, 17);
    assert.equal(html.includes('data-level="0"'), false);
    assert.equal(html.includes('data-radius="0.00"'), false);
    assert.equal(html.includes('>C<'), false);
    assert.doesNotMatch(html, /peerAverage|globalBenchmark|unsigned|i pa nënshkruar/);
    const decode = (value: string) => value.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16))).replace(/&#(\d+);/g, (_, digits) => String.fromCharCode(Number(digits)));
    const publicBits = decode([...html.matchAll(/\s(?:aria-label|title|alt)="([^"]*)"/g), ...html.matchAll(/<title>([^<]*)<\/title>/g)].map((match) => match[1]).join('\n'));
    assert.doesNotMatch(publicBits, /\d/);
    assert.match(publicBits, /E fortë \/ Strong/);
    assert.match(publicBits, /Shumë e fortë \/ Very strong/);
    for (const line of publicBenchmarkLines()) {
      assert.equal(/\d/.test(line.label), false);
      assert.equal(line.points.some((point) => point.indicatorId === 'maragon:C'), false);
      for (const point of line.points) assert.equal(/\d/.test(point.band), false);
    }
  });

  it('renders a null benchmark band as Pa vlerësim and does not draw it as zero', () => {
    const benchmarks = MARAGON_BENCHMARKS.map((series) => ({
      ...series,
      points: series.points.map((point) => point.indicatorId === 'maragon:R1.2'
        ? { ...point, band: null, status: 'not_assessed' as const }
        : point),
    }));
    const html = markup({ rec: { maragon: baseMaragon('vip_m5', [], []) }, mode: 'public', lang: 'en', benchmarks });
    assert.match(html, /Pa vlerësim \/ Not assessed/);
    assert.equal(html.includes('data-level="0"'), false);
    assert.equal(html.includes('data-radius="0.00"'), false);
    const europePoints = html.slice(html.indexOf('data-radar-series="europe_industry"'), html.indexOf('data-radar-series="albania_expected"'));
    assert.equal((europePoints.match(/data-radar-mark="point"/g) || []).length, 9);
    const publicBits = [...html.matchAll(/<title>([^<]*)<\/title>/g)].map((match) => match[1]).join('\n');
    assert.match(publicBits, /Pa vlerësim \/ Not assessed/);
    assert.doesNotMatch(publicBits, /\d/);
  });

  it('rejects a different unsigned amendment id', () => {
    const other: MaragonBenchmarkSeries = {
      ...MARAGON_BENCHMARKS[0],
      amendmentId: 'AM-99',
      ownerSignOff: { by: 'Dr Alban Gj. THIKA', dateTirana: '2026-11-23T10:56:00+01:00', amendmentId: 'AM-99', reference: 'not signed' },
    };
    for (const point of other.points) assert.equal(isPlottableBenchmarkPoint(other, point), false);
    assert.equal(isPlottableBenchmarkPoint(other, { ...other.points[0], indicatorId: 'maragon:C' }), false);
    const html = markup({
      rec: { maragon: baseMaragon('vip_m5', [], []) },
      mode: 'public',
      lang: 'sq',
      benchmarks: [other, { ...MARAGON_BENCHMARKS[1], amendmentId: 'AM-99', ownerSignOff: other.ownerSignOff }],
    });
    assert.equal(html.includes('data-radar-series="albania_expected"'), false);
    assert.equal(html.includes('data-radar-series="europe_industry"'), false);
    assert.match(html, /Pa vlerësim \/ Not assessed/);
  });
});
