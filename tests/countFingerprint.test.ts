import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildCountFingerprint } from '../utils/factualObservatory';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Count fingerprint', () => {
  it('places the details card before the fingerprint and the fingerprint before the observatory', () => {
    const card = read('components/figurat-politike/PoliticianCard.tsx');
    const details = card.indexOf('data-profile-details="true"');
    const fingerprint = card.indexOf('data-legacy-fingerprint="true"');
    const observatory = card.indexOf('<FactualObservatory');
    assert.ok(details > 0 && fingerprint > details && observatory > fingerprint);
    assert.match(card, /NUK PIKËZOHET|ZodiacChip/);
  });

  it('plots only verified ratios and never a null axis', () => {
    const caushi = buildCountFingerprint('vip55');
    assert.equal(caushi.chart, 'radar');
    assert.equal(caushi.verifiedCount, 3);
    assert.deepEqual(caushi.axes.map((axis) => [axis.id, axis.numerator, axis.denominator]), [
      ['voting_participation', 433, 476],
      ['plenary_presence', 476, 476],
      ['committee_participation', 63, 64],
    ]);
    for (const axis of caushi.axes) {
      assert.equal(axis.verified, true);
      assert.equal(typeof axis.numerator, 'number');
      assert.equal(typeof axis.denominator, 'number');
      assert.ok(axis.ratioPercent !== null && axis.ratioPercent > 0);
    }

    const berisha = buildCountFingerprint('vip2');
    assert.equal(berisha.chart, 'bars');
    assert.deepEqual(
      berisha.axes.filter((axis) => axis.verified).map((axis) => [axis.id, axis.numerator, axis.denominator]),
      [
        ['voting_participation', 48, 494],
        ['plenary_presence', 485, 494],
      ],
    );
    const committee = berisha.axes.find((axis) => axis.id === 'committee_participation');
    assert.equal(committee?.verified, false);
    assert.equal(committee?.numerator, null);
    assert.equal(committee?.ratioPercent, null);

    const empty = buildCountFingerprint('vip999999');
    assert.equal(empty.chart, 'bars');
    for (const axis of empty.axes) {
      assert.equal(axis.verified, false);
      assert.equal(axis.ratioPercent, null);
      assert.equal(axis.numerator, null);
    }
  });

  it('does not read score fields and the gate stays closed', () => {
    const builder = read('utils/factualObservatory.ts');
    const panel = read('components/figurat-politike/CountFingerprint.tsx');
    assert.doesNotMatch(builder, /paragonDimensions|composite|dynamicScore|aligned|comparable|benchmark/);
    assert.doesNotMatch(panel, /paragonDimensions|composite|dynamicScore|aligned|comparable|benchmark|D1/);
    const caushiIds = buildCountFingerprint('vip55').axes.map((axis) => axis.id);
    assert.deepEqual(caushiIds, ['voting_participation', 'plenary_presence', 'committee_participation']);
    const engine = read('services/paragonEngine.ts');
    assert.doesNotMatch(engine, /generateHash/);
  });

  it('keeps a missing committee count null, including Berisha', () => {
    const gap = JSON.parse(read('data/official/committee_attendance_gap.json'));
    const berisha = gap.people.vip2;
    assert.equal(berisha.reason, 'no_committee_membership');
    assert.equal(berisha.present, null);
    assert.equal(berisha.meetings, null);
    const counted = Object.values(gap.people).filter((row: { present: number | null; meetings: number | null }) =>
      typeof row.present === 'number' && typeof row.meetings === 'number');
    assert.equal(counted.length, 0);
    for (const row of Object.values(gap.people) as Array<{ present: number | null; meetings: number | null; reason: string | null }>) {
      if (row.reason) {
        assert.equal(row.present, null);
        assert.equal(row.meetings, null);
      }
    }
    const fingerprint = buildCountFingerprint('vip2');
    const committee = fingerprint.axes.find((axis) => axis.id === 'committee_participation');
    assert.equal(committee?.numerator, null);
    assert.equal(committee?.ratioPercent, null);
  });

  it('counts profiles with three verified axes separately from the rest', () => {
    const profiles = JSON.parse(read('db/paragon_scores_export.json')).profiles as Array<{ id: string }>;
    let threeOrMore = 0;
    let fewer = 0;
    for (const profile of profiles) {
      const count = buildCountFingerprint(profile.id).verifiedCount;
      if (count >= 3) threeOrMore += 1;
      else fewer += 1;
    }
    assert.equal(profiles.length, 277);
    assert.equal(threeOrMore, 99);
    assert.equal(fewer, 178);
  });
});
