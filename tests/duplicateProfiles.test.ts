import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { canonicalProfileId } from '../utils/profileRedirects';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

function fold(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ë/gi, 'e')
    .replace(/ç/gi, 'c')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function kuvendiId(profile: { fieldSources?: Record<string, { sourceUrl?: string }>; officialLinks?: Array<{ url?: string }> }): string | null {
  const blobs = [
    ...Object.values(profile.fieldSources || {}).map((field) => field?.sourceUrl || ''),
    ...(profile.officialLinks || []).map((link) => link?.url || ''),
  ];
  for (const blob of blobs) {
    const marker = '/api/anetaret/';
    if (blob.includes(marker)) return blob.split(marker)[1].slice(0, 36);
  }
  return null;
}

describe('Duplicate politician profiles are merged', () => {
  const data = JSON.parse(read('db/paragon_scores_export.json'));
  const profiles = data.profiles as Array<{ id: string; name: string; numericId: number; fieldSources?: Record<string, { sourceUrl?: string }>; officialLinks?: Array<{ url?: string }> }>;

  it('keeps one card per folded name and per Kuvendi member id', () => {
    const names = new Map<string, string>();
    const members = new Map<string, string>();
    for (const profile of profiles) {
      const name = fold(profile.name);
      assert.equal(names.has(name), false, `${profile.id} repeats ${name}`);
      names.set(name, profile.id);
      const member = kuvendiId(profile);
      if (member) {
        assert.equal(members.has(member), false, `${profile.id} repeats member ${member}`);
        members.set(member, profile.id);
      }
    }
    assert.equal(profiles.length, 233);
  });

  it('sends the known duplicate ids, and Likaj and Gogu, to the canonical card', () => {
    assert.equal(canonicalProfileId('vip129'), 'vip106');
    assert.equal(canonicalProfileId('129'), 'vip106');
    assert.equal(canonicalProfileId('vip127'), 'vip156');
    assert.equal(canonicalProfileId('vip62'), 'vip156');
    assert.equal(canonicalProfileId('vip130'), 'vip35');
    assert.equal(canonicalProfileId('vip132'), 'vip83');
    assert.equal(canonicalProfileId('vip190'), 'vip103');
    assert.equal(canonicalProfileId('vip169'), 'vip16');
    assert.equal(canonicalProfileId('vip219'), 'vip55');
    for (const oldId of ['vip129', 'vip127', 'vip62', 'vip130', 'vip132', 'vip219']) {
      assert.equal(profiles.some((profile) => profile.id === oldId), false);
    }
    const sql = read('db/migrations/20261102_paragon_duplicate_merges.sql');
    assert.match(sql, /hist-merge-vip106-20261102/);
    assert.doesNotMatch(sql, /UPDATE paragon_scores|DELETE FROM/);
  });
});
