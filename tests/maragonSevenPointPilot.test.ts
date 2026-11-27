import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SevenPointAxes, SevenPointPilotCard } from '../components/maragon/SevenPointPilotCard';
import {
  blankSevenPoints,
  calibrationElapsed,
  overallSevenPointBand,
  projectSevenPointCard,
  sevenPointCardLeaksMeasurement,
  sevenPointFrame,
  sevenPointPolygonAllowed,
  sevenPointProfileIds,
  type SevenPointView,
} from '../utils/maragonSevenPoint';

const ROOT = path.resolve(import.meta.dirname, '..');
const register = JSON.parse(readFileSync(path.join(ROOT, 'data/maragon/pilots/seven-point-fevziu-20261127/REG-COM-MARAGON-SEVEN-POINT-PILOT-FEVZIU-v0.1-20261127.json'), 'utf8'));
const card = projectSevenPointCard(register);

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === 'pilots') continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

test('the register projects bands only, with no polygon and no overall score', () => {
  assert.equal(card.templateProfile, true);
  assert.equal(card.profileId, 'vip_m1');
  assert.equal(card.decision, 'NO-GO');
  assert.equal(card.scoredCount, 2);
  assert.equal(card.polygon, false);
  assert.equal(sevenPointPolygonAllowed(card.points), false);
  assert.equal(sevenPointCardLeaksMeasurement(card), false);
  assert.equal(card.points.find((point) => point.code === 'P1')?.band, '41–60');
  assert.equal(card.points.find((point) => point.code === 'P7')?.band, '21–40');
  assert.deepEqual(card.points.filter((point) => point.status === 'not_assessed').map((point) => point.code), ['P2', 'P3', 'P4', 'P5', 'P6']);
  const published = JSON.parse(readFileSync(path.join(ROOT, 'data/maragon/pilots/seven-point-fevziu-20261127/public.card.json'), 'utf8'));
  assert.deepEqual(published, card);
});

test('seven-axis render marks only P1 and P7 and draws no polygon under three scored points', () => {
  const html = renderToStaticMarkup(React.createElement(SevenPointAxes, { points: card.points }));
  assert.match(html, /data-seven-axes="true"/);
  assert.match(html, /data-seven-marker="P1"/);
  assert.match(html, /data-seven-marker="P7"/);
  assert.doesNotMatch(html, /data-seven-polygon/);
  assert.doesNotMatch(html, /data-seven-marker="P[2-6]"/);
  for (const code of ['P2', 'P3', 'P4', 'P5', 'P6']) {
    assert.match(html, new RegExp(`data-seven-empty="${code}"`));
    assert.match(html, /Pa vlerësim/);
  }
  assert.doesNotMatch(html, /albania|europe|AM-10|Standardi i pritur/i);
});

test('a third scored point is what allows the polygon', () => {
  const three: SevenPointView[] = card.points.map((point) => point.code === 'P2'
    ? { ...point, status: 'scored', band: '41–60', confidence: 'low', reason: null }
    : point);
  assert.equal(sevenPointPolygonAllowed(three), true);
  const html = renderToStaticMarkup(React.createElement(SevenPointAxes, { points: three }));
  assert.match(html, /data-seven-polygon="true"/);
});

test('the FEVZIU card shows bands, not-assessed reasons, and no overall result', () => {
  const html = renderToStaticMarkup(React.createElement(SevenPointPilotCard, { profileId: 'vip_m1' }));
  assert.match(html, /data-template-profile="true"/);
  assert.match(html, /PILOT · DRAFT — Korniza 7-pikëshe v2.0, e nënshkruar 27.11.2026 22:51/);
  assert.match(html, /Pilot result: NO-GO \(2\/7\)/);
  assert.match(html, /Signed MARAGON/);
  assert.match(html, /v2\.0 governs/);
  assert.match(html, /Pajtueshmëria Etike/);
  assert.match(html, /Ethical Compliance/);
  assert.match(html, /data-seven-band="41–60"/);
  assert.match(html, /data-seven-band="21–40"/);
  assert.match(html, /DRAFT · besueshmëri e ulët \/ low confidence/);
  assert.match(html, /Pa vlerësim \/ Not assessed/);
  assert.match(html, /no calibrated scale yet\./);
  assert.match(html, /claim-check log not built\./);
  assert.match(html, /too few questions with an identifiable political side \(18 of 150 needed\)\./);
  assert.match(html, /background accuracy not checked; result on the cut-off\./);
  assert.match(html, /auto-captions cannot separate speech errors from transcription errors\./);
  assert.doesNotMatch(html, /Vlerësimi i përgjithshëm|Overall assessment|composite|5\.6|36\.0/);
  const other = renderToStaticMarkup(React.createElement(SevenPointPilotCard, { profileId: 'vip_m2' }));
  assert.match(other, /data-template-profile="false"/);
  assert.doesNotMatch(other, /data-seven-band|PILOT · DRAFT|41–60|21–40/);
  assert.match(other, /Pa vlerësim \/ Not assessed/);
});

test('bands-only output of the card has no raw score', () => {
  const html = renderToStaticMarkup(React.createElement(SevenPointPilotCard, { profileId: 'vip_m1' }));
  assert.doesNotMatch(html, /numericValue|draftValue|5\.6|36\.0|opinionAsFact/);
  assert.match(html, /41–60/);
  assert.match(html, /21–40/);
});

test('T4 keeps every profile null except the FEVZIU pilot bands', () => {
  const ids = sevenPointProfileIds();
  assert.equal(ids.length, 24);
  const during = new Date('2026-11-27T22:56:00+01:00');
  for (const id of ids) {
    const frame = sevenPointFrame(id, during);
    assert.equal(frame.polygon, false);
    assert.equal(frame.overallBand, null);
    if (id === 'vip_m1') {
      assert.equal(frame.template, true);
      assert.equal(frame.calibrationOpen, true);
      assert.equal(frame.points.find((point) => point.code === 'P1')?.band, '41–60');
      assert.equal(frame.points.find((point) => point.code === 'P7')?.band, '21–40');
      assert.deepEqual(frame.points.filter((point) => point.band).map((point) => point.code), ['P1', 'P7']);
    } else {
      assert.equal(frame.points.every((point) => point.band === null && point.status === 'not_assessed'), true);
      assert.equal(frame.firstScoreAt, null);
    }
  }
});

test('OD-S10 mean switches from five points to seven after the 24-hour cap, OD-S13', () => {
  const points = blankSevenPoints().map((point) => {
    if (point.code === 'P2' || point.code === 'P6') return { ...point, status: 'scored' as const, band: '21–40' as const, confidence: 'low' as const };
    return { ...point, status: 'scored' as const, band: '41–60' as const, confidence: 'low' as const };
  });
  const start = '2026-11-27T22:32:00+01:00';
  const during = new Date('2026-11-27T23:00:00+01:00');
  const after = new Date('2026-11-28T23:00:00+01:00');
  assert.equal(calibrationElapsed(start, during), false);
  assert.equal(overallSevenPointBand(points, start, during), '41–60');
  assert.equal(calibrationElapsed(start, after), true);
  assert.equal(overallSevenPointBand(points, start, after), '41–60');
  const html = renderToStaticMarkup(React.createElement(SevenPointPilotCard, { profileId: 'vip_m1', now: after }));
  assert.match(html, /data-seven-overall="none"/);
  assert.doesNotMatch(html, /data-p2p6-provisional/);
});

test('only the projector and this card read the pilot folder', () => {
  const allowed = new Set([
    'scripts/projectMaragonPublicScoring.ts',
    'utils/maragonSevenPoint.ts',
  ]);
  const hits = sourceFiles(ROOT).filter((file) => {
    const relative = path.relative(ROOT, file);
    if (relative.startsWith('tests/')) return false;
    const text = readFileSync(file, 'utf8');
    return text.includes('seven-point-fevziu') || text.includes('REG-COM-MARAGON-SEVEN-POINT-PILOT');
  }).map((file) => path.relative(ROOT, file));
  assert.deepEqual(hits.sort(), [...allowed].sort());
});
