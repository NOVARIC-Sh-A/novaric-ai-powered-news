/**
 * Writes data/maragon/scoring/public.active.json from the active scoring file
 * and MARAGON_PUBLIC_DISPLAY. The client imports only this generated file.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MARAGON_PUBLIC_DISPLAY } from '../data/maragon/maragonPublicDisplay';
import { MARAGON_LIVE_SCORING_FILE } from '../data/maragon/scoring/activeSource';
import { projectLiveScoring, publicPayloadHasScoreNumber } from '../utils/maragonLiveScoring';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'data/maragon/scoring', MARAGON_LIVE_SCORING_FILE);
const target = path.join(root, 'data/maragon/scoring/public.active.json');
const raw = JSON.parse(fs.readFileSync(source, 'utf8'));
const projected = projectLiveScoring(raw, MARAGON_PUBLIC_DISPLAY);
if (MARAGON_PUBLIC_DISPLAY === 'bands-only' && publicPayloadHasScoreNumber(projected)) {
  throw new Error('bands-only public payload still contains a number');
}
fs.writeFileSync(target, `${JSON.stringify(projected)}\n`);
console.log(`Wrote ${path.relative(root, target)} (${MARAGON_PUBLIC_DISPLAY}, ${projected.profiles.length} profiles)`);
