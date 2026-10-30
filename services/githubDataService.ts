import axios from 'axios';

/**
 * GitHub-hosted fallback scores.
 * These are OPTIONAL and must NEVER override backend scores.
 */

export interface ProfileScore {
  id: string;
  dynamicScore: number;
}

/**
 * Raw GitHub JSON endpoint
 * Must return: [{ id: string | number, dynamicScore: number }]
 */
const GITHUB_SCORES_URL =
  'https://raw.githubusercontent.com/novaric-ai/paragon-scores/main/scores.json';

/**
 * Fetch dynamic scores from GitHub
 * - Used ONLY if backend score is missing or zero
 * - Never authoritative
 */
export async function fetchDynamicScoresFromGithub(): Promise<ProfileScore[]> {
  try {
    const res = await axios.get(GITHUB_SCORES_URL, {
      timeout: 8000,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!Array.isArray(res.data)) {
      console.warn('[githubDataService] Invalid payload:', res.data);
      return [];
    }

    return res.data
      .filter(
        (x: any) =>
          x &&
          (typeof x.id === 'string' || typeof x.id === 'number') &&
          typeof x.dynamicScore === 'number'
      )
      .map((x: any) => ({
        id: String(x.id),
        dynamicScore: Number.isFinite(x.dynamicScore)
          ? Math.max(0, Math.round(x.dynamicScore))
          : 0,
      }));
  } catch (err) {
    console.warn('[githubDataService] Fetch failed:', err);
    return [];
  }
}