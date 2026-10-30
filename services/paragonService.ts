// services/paragonService.ts
// ===========================================================
// NOVARIC® PARAGON Service — Cloud Run & Supabase Aligned
// ===========================================================

import api, { apiGet } from "./apiService";
import axios from "axios";
import {
  ParagonScore,
  ParagonTrendEntry,
  ParagonDeltaResult,
  ParagonDashboardResponse,
} from "../types/paragonTypes";

// -----------------------------------------------------------
// Internal helper — normalize backend payloads
// -----------------------------------------------------------
const extractResultsArray = <T>(data: any): T[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.latestScores)) return data.latestScores;
  return [];
};

// -----------------------------------------------------------
// 1) Latest live PARAGON scores (Summary for Leaderboard)
// -----------------------------------------------------------
export async function getLatestParagonScores(): Promise<ParagonScore[]> {
  try {
    // FIX: api.get returns the response body directly.
    const res: any = await api.get("/api/paragon/latest");
    return extractResultsArray<ParagonScore>(res);
  } catch (error) {
    console.error("Failed to fetch latest PARAGON scores:", error);
    return [];
  }
}

/**
 * Fetch detailed score for a politician, including dimension breakdown.
 * Hits the politicians router: /api/politicians/{id}/score
 */
export async function getPoliticianScoreById(politicianId: number): Promise<any | null> {
    try {
        // FIX: api.get returns the response body directly.
        const res: any = await api.get(`/api/politicians/${politicianId}/score`);
        return res;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) return null;
        console.error(`Failed to fetch detailed PARAGON score for ${politicianId}:`, error);
        return null;
    }
}

// -----------------------------------------------------------
// 2) Latest score for one profile (Single Overall Value)
// -----------------------------------------------------------
export async function getLatestScore(
  profileId: number
): Promise<ParagonScore | null> {
  try {
    // FIX: api.get returns the response body directly.
    const res: any = await api.get(`/api/paragon/latest/${profileId}`);
    return res ?? null;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
    }
    console.error(`Failed to fetch summary PARAGON score for ${profileId}:`, error);
    return null;
  }
}

// -----------------------------------------------------------
// 3) Dashboard aggregator
// -----------------------------------------------------------
export async function getParagonDashboard(): Promise<ParagonDashboardResponse | null> {
  try {
    // FIX: api.get returns the response body directly.
    const res: any = await api.get("/api/paragon/dashboard");
    return res ?? null;
  } catch (error) {
    console.error("Failed to fetch PARAGON dashboard:", error);
    return null;
  }
}

export const getDashboardData = getParagonDashboard;
export const getParagonTrends = async (): Promise<ParagonTrendEntry[]> => {
    try {
        // FIX: api.get returns the response body directly.
        const res: any = await api.get("/api/paragon/trends/latest");
        return extractResultsArray<ParagonTrendEntry>(res);
    } catch (error) {
        return [];
    }
};

// FIX: Added missing getTrendHistory function to resolve export error in ProfilePage.tsx
export const getTrendHistory = async (profileId: number): Promise<ParagonTrendEntry[]> => {
  try {
    // FIX: api.get returns the response body directly.
    const res: any = await api.get(`/api/paragon/trends/history/${profileId}`);
    return extractResultsArray<ParagonTrendEntry>(res);
  } catch (error) {
    console.error(`Failed to fetch trend history for ${profileId}:`, error);
    return [];
  }
};

// FIX: Added missing getMomentum function to resolve export error in ProfilePage.tsx
export const getMomentum = async (profileId: number): Promise<ParagonDeltaResult | null> => {
  try {
    // FIX: api.get returns the response body directly.
    const res: any = await api.get(`/api/paragon/trends/momentum/${profileId}`);
    return res ?? null;
  } catch (error) {
    console.error(`Failed to fetch momentum for ${profileId}:`, error);
    return null;
  }
};