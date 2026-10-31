import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Politicians list labels the zodiac as not scored', () => {
  const strip = read('components/figurat-politike/DominantFiguresStrip.tsx');
  const grid = read('components/figurat-politike/PoliticianGridCard.tsx');
  const chip = read('components/figurat-politike/primitives/ZodiacChip.tsx');
  const copy = read('components/figurat-politike/primitives/awaiting.tsx');

  it('reuses ZodiacChip with the profile not-scored label on featured and list cards', () => {
    assert.match(copy, /Nuk pikëzohet \/ Not scored/);
    assert.match(chip, /NOT_SCORED/);
    assert.match(chip, /withStatus/);
    for (const source of [strip, grid]) {
      assert.match(source, /ZodiacChip/);
      assert.match(source, /withStatus/);
      assert.doesNotMatch(source, /zodiacSign\(/);
    }
  });

  it('does not use the zodiac as a dimension or composite input', () => {
    for (const source of [strip, grid]) {
      assert.doesNotMatch(source, /zodiac[\s\S]{0,80}(composite|dynamicScore|paragonDimensions|dimensions7)/i);
      assert.doesNotMatch(source, /(composite|dynamicScore|dimensions7)[\s\S]{0,80}zodiac/i);
    }
  });
});
