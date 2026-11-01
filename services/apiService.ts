// services/apiService.ts
// ===========================================================
// NOVARIC® API Service
// ===========================================================

import { getApiEndpoint } from "./apiConfig";
import { VipProfile, VipProfileResponseDto } from "../types";
import { mapVipProfileResponseToVipProfile } from "../utils/paragonProfileUtils";
import { mergePoliticianCards, toPoliticianUI } from "./politicianAdapter";
import { PoliticianCardItemSchema } from "../lib/politician-schemas";

// NON-POLITICAL PROFILES DATA (Media, Business, Judiciary)
import { mediaProfilesData } from "../data/mediaProfiles";
import { businessProfilesData } from "../data/businessProfiles";
import { mockJudiciaryProfilesData } from "../data/mockJudiciaryProfiles";
import paragonScoresExport from "../db/paragon_scores_export.json";
import { canonicalProfileId } from "../utils/profileRedirects";

/**
 * Core request helper using fetch and getApiEndpoint for robustness.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const endpoint = getApiEndpoint(path);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(endpoint, {
      ...init,
      signal: init?.signal || controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      const error = new Error(`API ${res.status}: ${txt}`);
      (error as any).status = res.status;
      throw error;
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json() as Promise<T>;
    }

    const textSample = await res.text().catch(() => "");
    const err = new Error(
      `Endpoint ${endpoint} returned content-type "${contentType}" instead of application/json. Body: ${textSample.slice(0, 80)}`
    );
    // Static hosting (nginx SPA fallback) answers unknown /api/* routes with index.html:
    // treat that as "endpoint not available" so callers can use their 404 fallbacks.
    (err as any).status = 404;
    (err as any).nonJson = true;
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Compatibility helpers for legacy code.
 */
export async function apiGet<T>(url: string, init?: RequestInit): Promise<T> {
  return request<T>(url, { method: "GET", ...(init || {}) });
}

export async function apiPost<T>(url: string, body?: any, init?: RequestInit): Promise<T> {
  return request<T>(url, { 
    method: "POST", 
    body: body ? JSON.stringify(body) : undefined,
    ...(init || {})
  });
}

/**
 * The 'api' object with semantic methods.
 */
export const api = {
  get: apiGet,
  post: apiPost,
  
  // Standardized Resource Access
  getPoliticianCards: () => request<any[]>("politicians/cards"),
  getPoliticianProfile: (id: string | number) => request<any>(`politicians/${id}`),
  getPoliticianMetrics: (id: string | number) => request<any>(`politicians/${id}/metrics`),
  getParliamentRoster: () => request<any>("politicians/parliament/roster"),
  getPoliticianParagon: (id: string | number) => request<any>(`politicians/${id}/paragon`),

  // Internal support
  getPoliticians: () => request<any[]>("api/profiles"), 
  getPolitician: (id: string) => request<any>(`api/profiles/${id}`),
  getParagonScores: (id: string) => request<any>(`api/paragon/latest/${id}`),
  getParagonTrends: (id: string) => request<any>(`api/paragon/trends/history/${id}`),
  getProfileImprovements: (id: string) => request<any>(`api/profile-improvements/${id}`),
};

/**
 * Authoritative aggregator fetch (Versioned /api/v1 via getApiEndpoint)
 */
export const fetchPoliticianFull = async (idOrSlug: string | number): Promise<any> => {
    // politicians/{idOrSlug} becomes /api/v1/politicians/{idOrSlug}
    return request<any>(`politicians/${encodeURIComponent(String(idOrSlug))}`);
};

/**
 * Fetch live 140-Seat Parliament Roster from the backend.
 */
export const fetchParliamentRoster = async (): Promise<any> => {
  return request<any>("politicians/parliament/roster");
};

/**
 * Fetch individual politician PARAGON fingerprint from the backend.
 */
export const fetchPoliticianParagon = async (idOrSlug: string | number): Promise<any> => {
  return request<any>(`politicians/${encodeURIComponent(String(idOrSlug))}/paragon`);
};

/**
 * Resolves a profile_id (vipX) or name to a numeric politician_id for PARAGON.
 */
export const resolvePoliticianId = async (query: string): Promise<number | null> => {
  try {
    const res = await apiGet<{ politician_id: number }>(
      `politicians/resolve?query=${encodeURIComponent(query)}`
    );
    return res.politician_id;
  } catch {
    const match = query.match(/vip(\d+)/i);
    if (match && match[1]) return parseInt(match[1], 10);
    return null;
  }
};

/**
 * Fetch all VIP profiles from the backend.
 */
export const fetchAllProfiles = async (): Promise<VipProfile[]> => {
  const localPoliticians = mergePoliticianCards((paragonScoresExport?.profiles as any[]) || []);
  try {
    const data = await apiGet<VipProfileResponseDto[]>("api/profiles");
    if (Array.isArray(data)) {
      const live = data
        .filter(item => !!item)
        .map(mapVipProfileResponseToVipProfile);
      // Merge live profiles with politicians if live doesn't have them
      const liveHasPoliticians = live.some(p => (p.category || "").toLowerCase().includes("politik"));
      return liveHasPoliticians ? live : [...live, ...localPoliticians];
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.warn("Profiles API fallback active.", error);
    return [
      ...localPoliticians,
      ...mediaProfilesData,
      ...businessProfilesData,
      ...mockJudiciaryProfilesData,
    ];
  }
};

/**
 * Fetch optimized politician cards from the standardized v1 endpoint.
 */
export const fetchPoliticianCards = async (): Promise<VipProfile[]> => {
  const path = 'politicians/cards';
  const localProfiles = (paragonScoresExport?.profiles as any[]) || [];
  
  try {
    const res = await apiGet<any>(path);
    let items: any[] = [];
    let meta: any = null;

    if (Array.isArray(res)) {
      items = res;
    } else if (res && Array.isArray(res.data)) {
      items = res.data;
      meta = res.meta;
    }

    if (items.length > 0) {
      const parsed = PoliticianCardItemSchema.array().safeParse(items);
      if (!parsed.success) {
        console.warn("Politician cards Zod validation notice:", parsed.error);
      }
      
      // Combine API items with local authoritative dataset to guarantee all 140 MPs are present
      const apiMapped = mergePoliticianCards(items.filter((d: any) => !!d));
      const apiIds = new Set(apiMapped.flatMap(p => [p.id, p.numericId, (p as any).politicianId].filter(Boolean)));
      
      const missingFromApi = localProfiles.filter(p => !apiIds.has(p.id) && !apiIds.has(p.numericId) && !apiIds.has(p.politicianId));
      const missingMapped = mergePoliticianCards(missingFromApi);
      const combined = [...apiMapped, ...missingMapped];
      
      (combined as any).meta = meta || {
        totalProfiles: combined.length,
        activeMps: combined.length,
        paragonActive: combined.filter(p => (p as any).composite != null).length,
      };
      return combined;
    }
  } catch (error: any) {
    console.warn(`Failed to fetch politician cards from ${path}, using local authoritative data.`, error);
  }

  // Authoritative fallback: All 140 verified MP profiles
  const fallbackMerged = mergePoliticianCards(localProfiles);
  (fallbackMerged as any).meta = {
    totalProfiles: localProfiles.length,
    activeMps: localProfiles.length,
    paragonActive: localProfiles.filter((p: any) => p.composite != null).length,
  };
  return fallbackMerged;
};

/**
 * Authoritative method to fetch a full politician profile.
 * Targets the aggregated /api/v1/politicians/{id_or_slug} endpoint exclusively.
 */
export const fetchPoliticianProfile = async (id: string | number): Promise<VipProfile> => {
  // 1. Try Aggregated v1 Endpoint (The Authoritative Source)
  try {
      const fullData = await fetchPoliticianFull(id);
      return toPoliticianUI(fullData);
  } catch (error: any) {
      if (error.status !== 404) {
          console.error("Critical aggregator failure:", error);
          throw error;
      }
  }

  // 2. Fallback to legacy path logic only if 404
  const encoded = encodeURIComponent(String(id));
  const fallbackPaths = [
    `api/profiles/${encoded}`, 
    `api/profile/${encoded}`
  ];

  for (const path of fallbackPaths) {
    try {
      const data = await apiGet<any>(path);
      return toPoliticianUI(data);
    } catch (error: any) {
      if (error.status === 404) continue;
      throw error;
    }
  }

  // 3. Static deployment fallback: the bundled, verified politician export
  //    (same real dataset the list page renders; no mock/synthetic values).
  const idStr = canonicalProfileId(id);
  const localPoliticians = (paragonScoresExport?.profiles as any[]) || [];
  const localMatch = localPoliticians.find(p =>
    String(p.id) === idStr ||
    String(p.numericId) === idStr ||
    String(p.politicianId) === idStr ||
    String(p.id) === `vip${idStr}`
  );
  if (localMatch) return toPoliticianUI(localMatch);

  // FALLBACK FOR NON-POLITICAL PROFILES ONLY
  const nonPoliticalProfiles = [
    ...mediaProfilesData,
    ...businessProfilesData,
    ...mockJudiciaryProfilesData,
  ];
  const found = nonPoliticalProfiles.find(p => String(p.id) === String(id));
  if (found) return found;
  
  throw new Error(`Politician profile ${id} not found.`);
};

/**
 * Legacy alias for backward compatibility.
 */
export const fetchProfileById = fetchPoliticianProfile;

export default api;
