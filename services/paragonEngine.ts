// ===============================================================
// paragonEngine.ts — UPDATED FOR LIVE PARAGON + TRENDS + CRISIS
// ===============================================================

import {
  ProfileInput,
  FullProfileAnalysis,
  VipProfile,
  PsychometricProfile,
  MatrixProfile,
  PerformancePortfolioItem,
  FinalDiagnosis,
  IntegrityAnalysis,
  // New live types
  ParagonLiveScore,
  ParagonTrendEntry,
  ParagonDeltaResult,
  ParagonDashboardResponse
} from "../types";

import api, { apiGet } from "./apiService"; 
import axios from "axios";
import { thikaProfileData } from "../data/thikaProfileData";
import { graphData as thikaGraphData } from "../data/mockNetworkGraphData";
import { getStrengthsAndWeaknesses } from "../utils/paragonProfileUtils";

// ============================================================
// 1) LIVE DATA ENDPOINTS
// ============================================================

// Fetch all current PARAGON scores
export const getLatestParagonScores = async (): Promise<ParagonLiveScore[]> => {
  try {
    const res = await apiGet<any>("/api/paragon/latest");
    // Ensure array return
    return Array.isArray(res) ? res : (res.results || []);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return [];
    console.error("Failed to fetch latest PARAGON scores:", err);
    return [];
  }
};

// Fetch specific profile score
export const getLatestScore = async (profileId: number): Promise<ParagonLiveScore | null> => {
  try {
    return await apiGet<ParagonLiveScore>(`/api/paragon/latest/${profileId}`);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null;
    console.error(`Failed to fetch latest score for ${profileId}:`, err);
    return null;
  }
};

// Fetch full trend history
export const getLatestTrends = async (): Promise<ParagonTrendEntry[]> => {
  try {
    const res = await apiGet<any>("/api/paragon/trends/latest");
    return Array.isArray(res) ? res : (res.results || []);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return [];
    console.error("Failed to fetch trend history:", err);
    return [];
  }
};

// Alias for compatibility
export const getParagonTrends = getLatestTrends;

export const getTrendHistory = async (profileId: number): Promise<ParagonTrendEntry[]> => {
    try {
        const res = await apiGet<any>(`/api/paragon/trends/history/${profileId}`);
        return Array.isArray(res) ? res : (res.results || []);
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) return [];
        // FIX: Corrected variable name from 'error' to 'err' in console.error.
        console.error(`Failed to fetch trend history for ${profileId}:`, err);
        return [];
    }
};

export const getTopRisers = async (): Promise<ParagonDeltaResult[]> => {
    try {
        const res = await apiGet<any>("/api/paragon/trends/top-risers");
        return Array.isArray(res) ? res : (res.results || []);
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) return [];
        console.error("Failed to fetch top risers:", err);
        return [];
    }
};

export const getTopFallers = async (): Promise<ParagonDeltaResult[]> => {
    try {
        const res = await apiGet<any>("/api/paragon/trends/top-fallers");
        return Array.isArray(res) ? res : (res.results || []);
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) return [];
        console.error("Failed to fetch top fallers:", err);
        return [];
    }
};

export const getMomentum = async (profileId: number): Promise<ParagonDeltaResult | null> => {
    try {
        return await apiGet<ParagonDeltaResult>(`/api/paragon/trends/momentum/${profileId}`);
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) return null;
        console.error(`Failed to fetch momentum for ${profileId}:`, err);
        return null;
    }
};

export const getParagonDashboard = async (): Promise<ParagonDashboardResponse | null> => {
    try {
        return await apiGet<ParagonDashboardResponse>("/api/paragon/dashboard");
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) return null;
        console.error("Failed to fetch PARAGON dashboard:", err);
        return null;
    }
};

// Crisis detection results
export const getCrisisAlerts = async () => {
  try {
    const res = await apiGet<any>("/api/paragon/crisis");
    return Array.isArray(res) ? res : [];
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return [];
    console.error("Failed to fetch crisis alerts:", err);
    return [];
  }
};


// ============================================================
// 2) FROM HERE DOWN — your mock analysis engine
// ============================================================

const quarantinedIntegrity = (): IntegrityAnalysis => ({
  agib: {
    archetype: '',
    archetypeScore: null,
    centralityScore: null,
    scriIndex: null,
    vulnerability: null,
  },
  cri: {
    moralDetachmentIndex: null,
    euphemisticLanguage: '',
    advantageousComparison: '',
    displacementOfResponsibility: '',
    eliteClosureIndex: null,
    impunityContext: '',
    criScore: null,
    behavioralRisk: null,
  },
  riskQuadrant: 0,
  overallAlert: 'Integritet i Qëndrueshëm',
  clinicalSummary: 'PARAGON® — Audit në proces. Name-derived integrity labels are quarantined and are not a measurement.',
});

// Main Paragon mock generator
export const runParagonAnalysis = (profileInput: ProfileInput, scores?: number[]): FullProfileAnalysis => {
  const mockPsychometricProfile: PsychometricProfile = {
    opennessToExperience: { rating: "E Lartë", evidence: ["Përvojë e gjerë ndërkombëtare"] },
    conscientiousness: { rating: "E Lartë", evidence: ["Arsim i avancuar"] },
    extraversion: { rating: "Mesatare", evidence: ["Angazhim publik"] },
    agreeableness: { rating: "Mesatare e Ulët", evidence: ["Vendimmarrje e fortë"] },
    emotionalStability: { rating: "E Lartë", evidence: ["Qëndrueshmëri psikologjike"] },
  };

  const mockMatrixProfile: MatrixProfile = {
    formal_euro_atlantic_score: 8,
    informal_albanian_score: 3,
    archetype: "Teknokrat Transnacional",
    contextClashEvents: [],
  };

  const mockPerformancePortfolio: PerformancePortfolioItem[] = [];

  const individualScores = scores ?? [];
  const { strengths, weaknesses } = getStrengthsAndWeaknesses(individualScores);

  const mockFinalDiagnosis: FinalDiagnosis = {
    alertLevel: "I Lartë",
    alertType: "Rrezik i Joefektivitetit",
    executiveSummary: "Analizë e kryer nga sistemi PARAGON® bazuar në metrikat e performancës aktuale.",
  };

  return {
    profileInput,
    kapschAnalysis: {
      layer1_psychometricProfile: mockPsychometricProfile,
      layer2_matrixProfile: mockMatrixProfile,
      layer3_performancePortfolio: mockPerformancePortfolio,
    },
    performanceAnalysis: {
      individualScores,
      datasets: [],
      strengths,
      weaknesses,
      recommendations: [],
    },
    integrityAnalysis: quarantinedIntegrity(),
    networkMapData: thikaGraphData,
    finalDiagnosis: mockFinalDiagnosis,
  };
};

export const runAnalysisForVip = (vip: VipProfile): FullProfileAnalysis => {
  const scores = vip.paragonAnalysis && vip.paragonAnalysis.length > 0
    ? vip.paragonAnalysis.map((dimension) => dimension.score).filter((score): score is number => typeof score === 'number')
    : [];

  const base = runParagonAnalysis({
    personal: {
      fullName: vip.name,
      dob: vip.dateOfBirth || '',
      age: vip.age,
      party: vip.category,
      title: vip.shortBio,
    },
    educationHistory: [],
    workHistory: [],
    politicalHistory: [],
    keyLifeEvents: [],
  }, scores);

  return {
    ...base,
    networkMapData: {
      nodes: [{ id: vip.id.toString(), label: vip.name, x: 450, y: 350, size: 28, color: '#3b82f6', group: 'Politics (PS)' }],
      edges: [],
    },
  };
};
