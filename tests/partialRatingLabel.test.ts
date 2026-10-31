import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

const BADGE = 'Vlerësim i pjesshëm – vetëm aktiviteti parlamentar / Partial rating – parliamentary activity only';
const RANKING = 'Renditja e pjesshme – vetëm aktiviteti parlamentar / Partial ranking – parliamentary activity only';

describe('Displayed PARAGON scores are labelled partial', () => {
  const copy = read('components/figurat-politike/primitives/awaiting.tsx');
  const card = read('components/figurat-politike/PoliticianCard.tsx');
  const grid = read('components/figurat-politike/PoliticianGridCard.tsx');
  const list = read('components/figurat-politike/PoliticiansDatabase.tsx');
  const toolbar = read('components/figurat-politike/Toolbar.tsx');
  const strip = read('components/figurat-politike/DominantFiguresStrip.tsx');
  const leaderboard = read('pages/ParagonLeaderboardPage.tsx');
  const zodiac = read('components/figurat-politike/primitives/ZodiacChip.tsx');

  it('uses the parliamentary-activity badge and the 1 Sep 2025 note', () => {
    assert.ok(copy.includes(BADGE));
    assert.ok(copy.includes(RANKING));
    assert.match(copy, /presence, voting participation and group cohesion/);
    assert.match(copy, /official Kuvendi roll calls since 1 Sep 2025/);
    assert.match(copy, /Në pritje të të dhënave \/ Awaiting data/);
    assert.match(copy, /3\/7 dimensions|\$\{coverage\} dimensions|formatPartialCoverage/);
    for (const source of [card, grid, strip]) {
      assert.match(source, /PartialRatingBadge/);
    }
    assert.match(card, /PARTIAL_RATING_NOTE/);
  });

  it('labels list sorting and the leaderboard as a partial ranking', () => {
    assert.match(list, /PARTIAL_RANKING_LABEL/);
    assert.match(toolbar, /Sipas vlerësimit të pjesshëm/);
    assert.match(leaderboard, /PARTIAL_RANKING_LABEL/);
    assert.match(leaderboard, /PartialRatingBadge/);
  });

  it('keeps the zodiac marked not scored', () => {
    assert.match(copy, /Nuk pikëzohet \/ Not scored/);
    assert.match(zodiac, /NOT_SCORED/);
    assert.match(zodiac, /withStatus/);
  });
});
