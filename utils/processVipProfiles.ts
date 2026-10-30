// utils/processVipProfiles.ts
import {
  VipProfile,
  ProcessedVipProfile,
  ParagonEntry,
  ParagonDimension,
  TranslatedParagonEntry,
} from '../types';
import { ProfileAnalysisMap } from '../services/profileAnalysisService';
import { PARAGON_DIMENSIONS_AL } from './translations';

export const PARAGON_DIMENSIONS: ParagonDimension[] = [
  'Angazhimi Politik',
  'Llogaridhënia',
  'Përfaqësimi',
  'Asertiviteti',
  'Qeverisja',
  'Kohësioni',
  'Narrativa',
];

export function mergeProfileWithAnalysis(
  profile: VipProfile,
  backendMap: ProfileAnalysisMap
): ProcessedVipProfile {
  const backend = backendMap[profile.id];

  // 1) Decide which source of scores to use
  let paragonEntries: ParagonEntry[];

  if (backend && backend.dimensions) {
    // Build entries from backend dimensions
    paragonEntries = PARAGON_DIMENSIONS.map((dimKey) => ({
      dimension: dimKey,
      score: backend.dimensions[dimKey] ?? 0,
      peerAverage: 0,
      globalBenchmark: 0,
      description: '',
      commentary: '',
    }));
  } else {
    // Fallback to static analysis from profile
    paragonEntries = profile.paragonAnalysis || [];
  }

  // 2) Compute overallScore
  const overall =
    backend?.overallScore ??
    (paragonEntries.length
      ? Math.round(
          paragonEntries.reduce((sum, e) => sum + (e.score || 0), 0) /
            paragonEntries.length
        )
      : 0);
      
  // 3) Translate entries to include Albanian labels and original keys
  const translatedAnalysis: TranslatedParagonEntry[] = paragonEntries.map(e => ({
    ...e,
    dimension: PARAGON_DIMENSIONS_AL[e.dimension as ParagonDimension] || e.dimension,
    originalDimension: e.dimension as ParagonDimension,
    score: e.score,
  }));

  // 4) Build processedAnalysis from translated data
  const sorted = [...translatedAnalysis].sort((a, b) => (b.score || 0) - (a.score || 0));
  const topDimensions = sorted.slice(0, 3);
  const bottomDimensions = sorted.slice(-3).reverse(); 

  // Example recommendation text (simplified)
  const recommendations = topDimensions.map(
    (d) => `Forco më tej dimensionin "${d.dimension}" për të ndërtuar kapital politik afatgjatë.`
  );

  return {
    ...profile,
    processedAnalysis: {
      overallScore: overall,
      translatedAnalysis: translatedAnalysis,
      topDimensions,
      bottomDimensions,
      recommendations,
    },
  };
}
