import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BandRadar, MARAGON_RADAR_SERIES_STYLE } from '../components/maragon/maragonPresenterUi';
import {
  MARAGON_BENCHMARKS,
  MARAGON_BENCHMARK_AWAITING_NOTE,
  isPlottableBenchmarkPoint,
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

describe('MARAGON three-level presenter radar', () => {
  it('ships both benchmark series with every band null', () => {
    assert.equal(MARAGON_BENCHMARKS.length, 2);
    assert.deepEqual(MARAGON_BENCHMARKS.map((series) => series.id), ['albania_expected', 'europe_industry']);
    for (const series of MARAGON_BENCHMARKS) {
      assert.equal(series.status, 'not_assessed');
      assert.equal(series.ownerSignOff, null);
      assert.equal(series.amendmentId, null);
      assert.equal(series.points.length, 10);
      assert.equal(series.points.some((point) => point.indicatorId === 'maragon:C'), false);
      for (const point of series.points) {
        assert.equal(point.band, null);
        assert.equal(point.status, 'not_assessed');
        assert.equal(isPlottableBenchmarkPoint(series, point), false);
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
      assert.equal(record.maragon.composite, null);
      assert.notEqual(record.maragon.assessmentStatus, 'approved');
      assert.equal(record.maragon.methodologyApproved, false);
      assert.equal(record.maragon.authorizedForPublicDisplay, false);
    }
  });

  it('draws no benchmark polygon and no zero point while values are null', () => {
    const html = markup({ rec: { maragon: baseMaragon('vip_m5', [], []) }, mode: 'public', lang: 'sq', benchmarks: MARAGON_BENCHMARKS });
    assert.equal(html.includes('data-radar-series="albania_expected"'), false);
    assert.equal(html.includes('data-radar-series="europe_industry"'), false);
    assert.equal(html.includes('data-radar-series="presenter"'), false);
    assert.equal(html.includes('data-level="0"'), false);
    assert.equal(html.includes('data-radius="0.00"'), false);
    assert.equal((html.match(/data-radar-ring="/g) || []).length, 5);
    assert.match(html, /Pa vlerësim/);
    assert.match(html, /Standard i pritur në Shqipëri/);
    assert.match(html, /Expected standard in Albania/);
    assert.match(html, /Standard i industrisë evropiane \/ ndërkombëtare/);
    assert.match(html, /European \/ international industry standard/);
    assert.match(html, new RegExp(MARAGON_BENCHMARK_AWAITING_NOTE.sq.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
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
    assert.equal(html.includes('data-radar-series="albania_expected"'), false);
    assert.equal(MARAGON_RADAR_SERIES_STYLE.presenter.indicativeStroke, '#e4191e');
    assert.equal(MARAGON_RADAR_SERIES_STYLE.albania_expected.dash, '6 4');
    assert.equal(MARAGON_RADAR_SERIES_STYLE.europe_industry.dash, '2 3');
  });
});
