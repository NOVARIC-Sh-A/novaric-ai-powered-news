// services/profileAnalysisService.ts
import api from "./apiService";

/**
 * Shape of backend-returned analysis for a single profile.
 * Always kept minimal & safe.
 */
export type ProfileAnalysis = {
  overallScore: number;
  dimensions: Record<string, number>;
};

/**
 * Map of ID → ProfileAnalysis.
 */
export type ProfileAnalysisMap = Record<string | number, ProfileAnalysis>;

/**
 * SAFE NORMALIZER
 * Ensures the backend always returns a valid ProfileAnalysis object.
 * Prevents React Error #31 and undefined crashes.
 */
const normalizeAnalysis = (raw: any): ProfileAnalysis => {
  const safeDimensions: Record<string, number> = {};

  if (raw && typeof raw.dimensions === "object") {
    for (const [dim, val] of Object.entries(raw.dimensions)) {
      safeDimensions[dim] = typeof val === "number" ? val : 0;
    }
  }

  return {
    overallScore:
      typeof raw?.overallScore === "number"
        ? raw.overallScore
        : Math.round(
            Object.values(safeDimensions).reduce((a, b) => a + b, 0) /
              (Object.keys(safeDimensions).length || 1)
          ) || 0,

    dimensions: safeDimensions,
  };
};

/**
 * Direct API call to analyze profiles batch.
 */
export const analyzeProfiles = (payload: {
  ids: string[];
  category: string;
}) => api.post("/api/profiles/analysis-batch", payload);

/**
 * Fetches PARAGON analysis for multiple profiles.
 * Uses the centralized axios instance via analyzeProfiles.
 * 
 * --- FEATURES ---
 * ✔ Fully Silent on Errors (no console spam)
 * ✔ Always returns correct shape
 * ✔ Works even if backend is offline
 * ✔ Safe merging of backend + UI
 */
export const fetchProfilesAnalysis = async (
  ids: (string | number)[],
  type: string
): Promise<ProfileAnalysisMap> => {
  if (!ids || ids.length === 0) return {};

  try {
    // FIX: analyzeProfiles (which uses api.post) returns the response body directly.
    const response: any = await analyzeProfiles({
      ids: ids.map(String),
      category: type,
    });

    const data = response;
    const map: ProfileAnalysisMap = {};

    if (Array.isArray(data.analyses)) {
      data.analyses.forEach((item: any) => {
        if (!item?.id) return; // skip malformed
        map[item.id] = normalizeAnalysis(item);
      });
    }

    return map;
  } catch {
    // Network error or backend issue → return no backend analyses (silent fallback)
    return {};
  }
};