import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MaragonSevenAxisGraph, MaragonV2ProfileSection, MaragonV2SectionView } from '../components/maragon/MaragonV2ProfileSection';
import { MaragonPresenterProfilePage } from '../components/maragon/MaragonPresenterProfilePage';
import { mediaProfilesData } from '../data/mediaProfiles';
import {
  blankSevenPoints,
  calibrationElapsed,
  calibrationProgress,
  overallSevenPointBand,
  sevenPointPolygonAllowed,
  type SevenPointFrameView,
  type SevenPointView,
} from '../utils/maragonSevenPoint';

const DURING = new Date('2026-11-27T23:30:00+01:00');
const AFTER = new Date('2026-11-28T23:30:00+01:00');
const START = '2026-11-27T22:32:00+01:00';

function scored(points: SevenPointView[], code: string, band: SevenPointView['band']): SevenPointView[] {
  return points.map((point) => point.code === code
    ? { ...point, status: 'scored' as const, band, confidence: 'low' as const, reason: null }
    : point);
}

function frameFor(points: SevenPointView[], firstScoreAt: string | null, now: Date): SevenPointFrameView {
  const elapsed = calibrationElapsed(firstScoreAt, now);
  return {
    profileId: 'synthetic',
    template: false,
    points,
    polygon: sevenPointPolygonAllowed(points),
    firstScoreAt,
    calibrationOpen: Boolean(firstScoreAt) && !elapsed,
    p2p6Provisional: elapsed,
    fivePointMean: !elapsed,
    overallBand: overallSevenPointBand(points, firstScoreAt, now),
    evidenceMonths: 18,
  };
}

test('overall band stays null until all five calibration points are scored', () => {
  const four = ['P1', 'P3', 'P4', 'P7'].reduce((points, code) => scored(points, code, '41–60'), blankSevenPoints());
  assert.equal(calibrationProgress(four, true).scored, 4);
  assert.equal(calibrationProgress(four, true).of, 5);
  assert.equal(overallSevenPointBand(four, START, DURING), null);
  assert.equal(overallSevenPointBand(four, null, DURING), null);
  const five = scored(four, 'P5', '61–80');
  assert.deepEqual(calibrationProgress(five, true), { scored: 5, of: 5 });
  assert.equal(overallSevenPointBand(five, START, DURING), '41–60');
  const fourHtml = renderToStaticMarkup(React.createElement(MaragonV2SectionView, { frame: frameFor(four, START, DURING) }));
  assert.match(fourHtml, /data-overall-band="none"/);
  assert.match(fourHtml, /data-overall-value="none"/);
  assert.match(fourHtml, /Pa vlerësim/);
  assert.match(fourHtml, /Not assessed/);
  assert.match(fourHtml, /4 nga 5 pika kalibrimi të vlerësuara · 4 of 5 calibration points scored/);
  assert.doesNotMatch(fourHtml, /data-overall-value="41–60"/);
  const fiveHtml = renderToStaticMarkup(React.createElement(MaragonV2SectionView, { frame: frameFor(five, START, DURING) }));
  assert.match(fiveHtml, /data-overall-band="41–60"/);
  assert.match(fiveHtml, /data-overall-value="41–60"/);
  assert.match(fiveHtml, /Mesatare \/ Moderate/);
  assert.match(fiveHtml, /5 nga 5 pika kalibrimi të vlerësuara · 5 of 5 calibration points scored/);
  assert.doesNotMatch(fiveHtml, /data-overall-value="none"/);
  assert.doesNotMatch(fiveHtml, />\s*(?:10|30|50|70|90)\s*</);
});

test('the seven-axis shape is drawn only when at least three points are scored', () => {
  const two = ['P1', 'P7'].reduce((points, code) => scored(points, code, code === 'P1' ? '41–60' : '21–40'), blankSevenPoints());
  assert.equal(sevenPointPolygonAllowed(two), false);
  const twoHtml = renderToStaticMarkup(React.createElement(MaragonSevenAxisGraph, { points: two }));
  assert.match(twoHtml, /data-seven-axes="true"/);
  assert.match(twoHtml, /data-seven-shape="markers"/);
  assert.match(twoHtml, /data-seven-marker="P1"/);
  assert.match(twoHtml, /data-seven-marker="P7"/);
  assert.doesNotMatch(twoHtml, /data-seven-polygon/);
  assert.doesNotMatch(twoHtml, /albania|europe|Standardi i pritur/i);
  for (const code of ['P2', 'P3', 'P4', 'P5', 'P6']) assert.match(twoHtml, new RegExp(`data-seven-empty="${code}"`));
  const three = scored(two, 'P3', '41–60');
  assert.equal(sevenPointPolygonAllowed(three), true);
  const threeHtml = renderToStaticMarkup(React.createElement(MaragonSevenAxisGraph, { points: three }));
  assert.match(threeHtml, /data-seven-polygon="true"/);
  assert.match(threeHtml, /data-seven-shape="polygon"/);
  const section = renderToStaticMarkup(React.createElement(MaragonV2SectionView, { frame: frameFor(two, null, DURING) }));
  assert.match(section, /data-shape-rule="markers"/);
  assert.doesNotMatch(section, /data-seven-polygon/);
  const drawn = renderToStaticMarkup(React.createElement(MaragonV2SectionView, { frame: frameFor(three, null, DURING) }));
  assert.match(drawn, /data-shape-rule="drawn"/);
  assert.match(drawn, /data-seven-polygon="true"/);
});

test('Fevziu profile section is bands only, with two draft points and an unassessed overall', () => {
  const html = renderToStaticMarkup(React.createElement(MaragonV2ProfileSection, { profileId: 'vip_m1', now: DURING }));
  assert.match(html, /data-maragon-v2="true"/);
  assert.match(html, /data-template-profile="true"/);
  assert.match(html, /data-overall-band="none"/);
  assert.match(html, /data-overall-value="none"/);
  assert.match(html, /2 nga 5 pika kalibrimi të vlerësuara · 2 of 5 calibration points scored/);
  assert.match(html, /data-calibration-chip="P1"[^>]*data-chip-scored="true"|data-chip-scored="true"[^>]*data-calibration-chip="P1"/);
  assert.match(html, /data-chip-scored="false"/);
  assert.match(html, /data-seven-band="41–60"/);
  assert.match(html, /data-seven-band="21–40"/);
  assert.match(html, /Pajtueshmëria Etike/);
  assert.match(html, /Ethical Compliance/);
  assert.match(html, /Mesatare \/ Moderate/);
  assert.match(html, /E dobët \/ Weak/);
  assert.match(html, /PILOT · DRAFT/);
  assert.match(html, /Besueshmëri e ulët \/ low confidence/);
  assert.match(html, /Pa rubrikë të miratuar; pikë e re, në kalibrim/);
  assert.match(html, /No approved rubric; new point, in calibration/);
  assert.match(html, /Regjistri i pretendimeve nuk u ndërtua/);
  assert.match(html, /Claim log not built/);
  assert.match(html, /18 nga 113 pyetje/);
  assert.match(html, /Captions lack speaker labels \(18 of 113 questions\)/);
  assert.match(html, /Matur, por konteksti i paverifikuar/);
  assert.match(html, /data-b7-matrix="true"/);
  assert.match(html, /«B7» nuk gjendet në dosje/);
  assert.match(html, /data-rating-level="Niveli 2"/);
  assert.match(html, /data-rating-level="Niveli 3"/);
  assert.match(html, /No approved peer-average method; never public/);
  assert.match(html, /AM-10 signed for v1\.0 only; remap to P1–P7 deferred/);
  assert.match(html, /Exact point never published\. Axis C excluded/);
  assert.match(html, /MARAGON<sup aria-hidden="true" class="registered-mark">®<\/sup> is separate from/);
  assert.doesNotMatch(html, /data-seven-polygon/);
  const peers = html.split('data-rating-level="Niveli 2"')[1] || '';
  assert.equal((peers.match(/data-level-band=/g) || []).length, 0);
  assert.doesNotMatch(html, /peerAverage|globalBenchmark|standardAdherence/);
  assert.doesNotMatch(html, /jo për publikim|not for publication/i);
  assert.doesNotMatch(html, /(?<![0-9])(?:85|70)(?![0-9])/);
  assert.doesNotMatch(html, /(?<![0-9–])80(?![0-9])/);
  const later = renderToStaticMarkup(React.createElement(MaragonV2ProfileSection, { profileId: 'vip_m1', now: AFTER }));
  assert.match(later, /data-overall-band="none"/);
  assert.match(later, /2 nga 7 pika të vlerësuara · 2 of 7 points scored/);
});

test('a profile with no scores stays not assessed on every point and both comparison levels', () => {
  const html = renderToStaticMarkup(React.createElement(MaragonV2ProfileSection, { profileId: 'vip_m2', now: DURING }));
  assert.match(html, /data-template-profile="false"/);
  assert.match(html, /data-overall-value="none"/);
  assert.match(html, /0 nga 5 pika kalibrimi të vlerësuara · 0 of 5 calibration points scored/);
  assert.equal((html.match(/data-chip-scored="true"/g) || []).length, 0);
  assert.equal((html.match(/data-seven-band="none"/g) || []).length, 7);
  assert.doesNotMatch(html, /data-seven-band="(?:0–20|21–40|41–60|61–80|81–100)"/);
  assert.doesNotMatch(html, /data-seven-marker|data-seven-polygon|PILOT · DRAFT|data-seven-reason/);
  assert.doesNotMatch(html, /Claim log not built|18 nga 113|No approved rubric/);
  assert.match(html, /Asnjë pikë individuale nuk është vlerësuar/);
  assert.match(html, /No individual point has been assessed/);
  assert.doesNotMatch(html, /RPT-COM-MARAGON-SEVEN-POINT-PILOT-FEVZIU/);
  assert.doesNotMatch(html, /peerAverage|globalBenchmark/);
  const levels = html.split('data-rating-level="Niveli 2"')[1]?.split('data-rating-level="Niveli 3"')[0] || '';
  assert.equal((levels.match(/Pa vlerësim/g) || []).length, 7);
});

test('the profile page heading is MARAGON v2.0', () => {
  const profile = mediaProfilesData.find((item) => item.id === 'vip_m1');
  assert.ok(profile);
  const html = renderToStaticMarkup(React.createElement(MaragonPresenterProfilePage, {
    profile: profile!,
    onBack: () => undefined,
    lang: 'sq',
  }));
  assert.match(html, /Vlerësimi MARAGON<sup aria-hidden="true" class="registered-mark">®<\/sup> v2\.0/);
  assert.match(html, /data-maragon-v2="true"/);
  assert.doesNotMatch(html, /Vlerësimi MARAGON® v1\.0|MARAGON® v1\.0 assessment/);
  assert.doesNotMatch(html, /Vlerësimi MARAGON<sup[^>]*>®<\/sup> v1\.0/);
});
