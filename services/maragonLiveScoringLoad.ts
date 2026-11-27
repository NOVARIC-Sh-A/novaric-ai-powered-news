/**
 * Node-only reader. The client bundle imports the generated public payload, not this file.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MARAGON_PUBLIC_DISPLAY } from '../data/maragon/maragonPublicDisplay';
import { MARAGON_LIVE_SCORING_FILE } from '../data/maragon/scoring/activeSource';
import { projectLiveScoring, type PublicLiveScoring } from '../utils/maragonLiveScoring';

let cached: PublicLiveScoring | null = null;

export function loadPublicLiveScoring(): PublicLiveScoring {
  if (cached && cached.display === MARAGON_PUBLIC_DISPLAY) return cached;
  const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/maragon/scoring', MARAGON_LIVE_SCORING_FILE);
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  cached = projectLiveScoring(raw, MARAGON_PUBLIC_DISPLAY);
  return cached;
}
