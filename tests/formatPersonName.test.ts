import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { formatPersonName, splitPersonName } from '../utils/formatPersonName';

describe('formatPersonName', () => {
  it('keeps the given name and puts the surname in capitals, including diacritics', () => {
    assert.equal(formatPersonName('Nard Ndoka'), 'Nard NDOKA');
    assert.equal(formatPersonName('Ilir Meta'), 'Ilir META');
    assert.equal(formatPersonName('Skënder Pashaj'), 'Skënder PASHAJ');
    assert.equal(formatPersonName('Belind Këlliçi'), 'Belind KËLLIÇI');
  });

  it('capitalises every part of a hyphenated surname and does not call that ambiguous', () => {
    const split = splitPersonName('Ana Kovaçi-Leka');
    assert.equal(split.display, 'Ana KOVAÇI-LEKA');
    assert.equal(split.ambiguous, false);
  });

  it('uses separate given and surname fields when the record has them', () => {
    assert.equal(formatPersonName({ given: 'Ana', surname: 'Kovaçi-Leka' }), 'Ana KOVAÇI-LEKA');
    assert.equal(formatPersonName({ firstName: 'Mirela', lastName: 'Kumbaro Furxhi' }), 'Mirela KUMBARO FURXHI');
    assert.equal(splitPersonName({ given: 'Mirela', surname: 'Kumbaro Furxhi' }).ambiguous, false);
  });

  it('does not guess a two-word surname when only a full name is stored', () => {
    const split = splitPersonName('Mirela Kumbaro Furxhi');
    assert.equal(split.display, 'Mirela Kumbaro FURXHI');
    assert.equal(split.ambiguous, true);
    assert.match(split.reason || '', /last word/);
  });

  it('leaves the stored politician names unambiguous, except the official alias that has three words', () => {
    const data = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'db/paragon_scores_export.json'), 'utf8'));
    const ambiguousNames = data.profiles
      .filter((profile: { name: string }) => splitPersonName(profile.name).ambiguous)
      .map((profile: { name: string }) => profile.name);
    assert.deepEqual(ambiguousNames, []);
    const aliases = data.profiles.flatMap((profile: { aliases?: string[] }) => profile.aliases || []);
    const ambiguousAliases = aliases.filter((alias: string) => splitPersonName(alias).ambiguous);
    assert.deepEqual(ambiguousAliases, ['Mirela Kumbaro Furxhi']);
    assert.equal(formatPersonName('Mirela Kumbaro'), 'Mirela KUMBARO');
  });
});
