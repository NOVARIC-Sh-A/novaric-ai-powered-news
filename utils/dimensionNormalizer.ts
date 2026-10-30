import { ParagonEntry } from '../types';
import { PARAGON_DIMENSIONS_AL, MARAGON_DIMENSIONS_AL } from './translations';

const PARAGON_MAP = Object.fromEntries(
  Object.keys(PARAGON_DIMENSIONS_AL).map(label => [
    label.trim(),
    label.trim(), // original key for backward compatibility
  ])
);

const MARAGON_MAP = Object.fromEntries(
  Object.keys(MARAGON_DIMENSIONS_AL).map(label => [
    label.trim(),
    label.trim(),
  ])
);

/**
 * Converts any incoming dimensions (mock data, backend data, user input)
 * into a safe and consistent dimension object.
 */
export function normalizeParagonAnalysis(items: ParagonEntry[] | undefined): ParagonEntry[] {
  if (!Array.isArray(items)) return [];

  return items
    .map(entry => {
      if (!entry || !entry.dimension) return null;

      const key = PARAGON_MAP[entry.dimension.trim()];
      if (!key) return null; // unknown dimension → skip instead of crashing

      return {
        ...entry,
        dimension: key,
        score: typeof entry.score === 'number' ? entry.score : 0,
      };
    })
    .filter(Boolean) as ParagonEntry[];
}

export function normalizeMaragonAnalysis(items: ParagonEntry[] | undefined): ParagonEntry[] {
  if (!Array.isArray(items)) return [];

  return items
    .map(entry => {
      if (!entry?.dimension) return null;

      const key = MARAGON_MAP[entry.dimension.trim()];
      if (!key) return null;

      return {
        ...entry,
        dimension: key,
        score: typeof entry.score === 'number' ? entry.score : 0,
      };
    })
    .filter(Boolean) as ParagonEntry[];
}
