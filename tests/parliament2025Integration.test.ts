import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { CANONICAL_PARAGON_DIMENSIONS } from '../types/politician';

describe('NOVARIC® Parliament 2025 & PARAGON® Integration Suite (Phase 34)', () => {
  const exportPath = path.resolve(process.cwd(), 'db/paragon_scores_export.json');

  test('1. paragon_scores_export contains 140 active MP profiles', () => {
    assert.ok(fs.existsSync(exportPath), 'paragon_scores_export.json must exist');
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    const activeMps = data.profiles.filter((p: any) => p.parliamentaryStatus === 'active_mp');
    assert.equal(activeMps.length, 140, 'Must have exactly 140 active MP profiles');
  });

  test('2. 140-seat district allocation satisfies constitutional baseline', () => {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    const activeMps = data.profiles.filter((p: any) => p.parliamentaryStatus === 'active_mp');

    const expectedDistricts: Record<string, number> = {
      'Tiranë': 37,
      'Fier': 16,
      'Durrës': 14,
      'Elbasan': 14,
      'Vlorë': 12,
      'Shkodër': 11,
      'Korçë': 10,
      'Berat': 7,
      'Lezhë': 7,
      'Dibër': 5,
      'Gjirokastër': 4,
      'Kukës': 3,
    };

    const counts: Record<string, number> = {};
    activeMps.forEach((p: any) => {
      const z = p.electoralZone;
      counts[z] = (counts[z] || 0) + 1;
    });

    for (const [dist, expected] of Object.entries(expectedDistricts)) {
      assert.equal(
        counts[dist],
        expected,
        `District ${dist} mandate mismatch: expected ${expected}, got ${counts[dist]}`
      );
    }
  });

  test('3. Every active MP has a unique canonical numericId and uuid', () => {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    const activeMps = data.profiles.filter((p: any) => p.parliamentaryStatus === 'active_mp');

    const seenNumericIds = new Set<number>();
    const seenUuids = new Set<string>();

    activeMps.forEach((p: any) => {
      assert.ok(typeof p.numericId === 'number', `MP ${p.name} missing numericId`);
      assert.ok(!seenNumericIds.has(p.numericId), `Duplicate numericId detected: ${p.numericId}`);
      seenNumericIds.add(p.numericId);

      assert.ok(p.uuid, `MP ${p.name} missing uuid`);
      assert.ok(!seenUuids.has(p.uuid), `Duplicate uuid detected: ${p.uuid}`);
      seenUuids.add(p.uuid);
    });

    assert.equal(seenNumericIds.size, 140);
    assert.equal(seenUuids.size, 140);
  });

  test('4. PARAGON ratings are on, partial, and can be switched off', () => {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    const flag = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'public/paragon-ratings.json'), 'utf-8'));
    assert.equal(flag.enabled, true);
    assert.equal(data.ratings_enabled, true);
    assert.equal(data.scoring_suspended, false);
    assert.ok(data.scoring_note && data.scoring_note.includes('Kuvendit'));
    assert.ok(data.scored_count > 0);
    const scored = data.profiles.filter((p: any) => typeof p.composite === 'number');
    assert.equal(scored.length, data.scored_count);
    scored.forEach((p: any) => {
      assert.equal(p.scoring_suspended, false);
      assert.ok(p.paragonSources?.pageUrl?.includes('kuvendiapi.azurewebsites.net'));
      assert.equal(p.paragonSources.retrievedAt, '2026-10-31');
      assert.ok(Array.isArray(p.paragonDimensions) && p.paragonDimensions.length === 7);
      assert.equal(p.paragonDimensions[6], null, 'Narrativa stays awaiting without a sourced sentiment corpus');
    });
    const meta = data.profiles.find((p: any) => p.name === 'Ilir Meta');
    assert.equal(meta.composite, null);
  });

  test('5. Shkodër district strictly matches authoritative KQZ 2025 certified roster (11 seats)', () => {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    const shkoderMps = data.profiles.filter(
      (p: any) => p.parliamentaryStatus === 'active_mp' && p.electoralZone === 'Shkodër'
    );
    assert.equal(shkoderMps.length, 11, 'Shkodër must have exactly 11 active MPs');

    // Certified acceptance fixtures
    const expectedPd = ['Luçiano Boçi', 'Kliti Hoti', 'Greta Bardeli', 'Ramadan Likaj', 'Bardh Spahia'];
    const expectedPs = ['Marjana Koçeku', 'Onid Bejleri', 'Xhenis Çela', 'Bujar Rexha'];
    const expectedPsd = ['Tom Doshi', 'Sabina Jorgo'];

    const pdMps = shkoderMps.filter((p: any) => p.party === 'PD-AMSH').map((p: any) => p.name);
    const psMps = shkoderMps.filter((p: any) => p.party === 'PS').map((p: any) => p.name);
    const psdMps = shkoderMps.filter((p: any) => p.party === 'PSD').map((p: any) => p.name);

    assert.equal(pdMps.length, 5, 'PD-AMSH must have 5 seats in Shkodër');
    assert.equal(psMps.length, 4, 'PS must have 4 seats in Shkodër');
    assert.equal(psdMps.length, 2, 'PSD must have 2 seats in Shkodër');

    for (const name of expectedPd) {
      assert.ok(pdMps.some((n: string) => n.includes(name)), `PD-AMSH winner ${name} must be in Shkodër`);
    }
    for (const name of expectedPs) {
      assert.ok(psMps.some((n: string) => n.includes(name)), `PS winner ${name} must be in Shkodër`);
    }
    for (const name of expectedPsd) {
      assert.ok(psdMps.some((n: string) => n.includes(name)), `PSD winner ${name} must be in Shkodër`);
    }

    // Contamination protection: verify legacy / non-certified records are not in active roster
    const legacyNames = [
      'Helidon Bushati', 'Emilja Koliqi', 'Zef Hila', 'Zija Ismaili',
      'Benet Beci', 'Edona Bilali', 'Ilir Beqaj', 'Meri Markiçi'
    ];
    for (const legacy of legacyNames) {
      assert.ok(
        !shkoderMps.some((p: any) => p.name === legacy),
        `Legacy record ${legacy} must NOT be in 2025 Shkodër active roster`
      );
    }
  });

  test('5b. Fier district strictly includes certified deputy Ana Nako (16 seats total)', () => {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    const fierMps = data.profiles.filter(
      (p: any) => p.parliamentaryStatus === 'active_mp' && p.electoralZone === 'Fier'
    );
    assert.equal(fierMps.length, 16, 'Fier must have exactly 16 active MPs');

    const ana = fierMps.find((p: any) => p.name.includes('Ana Nako'));
    assert.ok(ana, 'Ana Nako must be included as an elected deputy in Fier');
    assert.equal(ana.party, 'PS');
    assert.equal(ana.numericId, 210);
    assert.equal(ana.parliamentaryStatus, 'active_mp');
  });

  test('6. Non-MPs are strictly marked as not_an_active_mp', () => {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    const veliaj = data.profiles.find((p: any) => p.name === 'Erion Veliaj');
    assert.ok(veliaj, 'Erion Veliaj must exist in profiles');
    assert.equal(veliaj.parliamentaryStatus, 'not_an_active_mp');
    if (veliaj.primaryRole) {
      assert.ok(veliaj.fieldSources?.currentRole?.sourceUrl, 'A displayed role must cite an official source');
    } else {
      assert.equal(veliaj.primaryRole, null);
    }

    const meta = data.profiles.find((p: any) => p.name === 'Ilir Meta');
    assert.ok(meta, 'Ilir Meta must exist in profiles');
    assert.equal(meta.parliamentaryStatus, 'not_an_active_mp');
  });

  test('7. CANONICAL_PARAGON_DIMENSIONS defines fixed D1..D7 with lineage targets', () => {
    assert.equal(CANONICAL_PARAGON_DIMENSIONS.length, 7);
    const expectedKeys = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
    CANONICAL_PARAGON_DIMENSIONS.forEach((dim, idx) => {
      assert.equal(dim.key, expectedKeys[idx]);
      assert.ok(dim.name && dim.name.length > 0);
      assert.ok(dim.lineageTarget.startsWith('maragon:'));
    });
  });

  test('8. Missing PARAGON score is represented by NULL, never numeric 0', () => {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    const unscored = data.profiles.filter((p: any) => p.composite === null);
    assert.ok(unscored.length > 0, 'Unscored MPs must have composite === null');
    unscored.forEach((p: any) => {
      assert.strictEqual(p.composite, null, `composite for ${p.name} must strictly be null, not 0`);
    });
  });
});
