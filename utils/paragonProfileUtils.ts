// utils/paragonProfileUtils.ts
import {
  VipProfile,
  ProcessedVipProfile,
  ParagonEntry,
  ParagonDimension,
  TranslatedParagonEntry,
  VipProfileResponseDto,
  PoliticianParagonDto,
} from '../types';
import { ProfileAnalysisMap, ProfileAnalysis } from '../services/profileAnalysisService';
import { PARAGON_DIMENSIONS_AL } from './translations';

// ###########################################################################
// SECTION 1: EXPORTED UTILITIES
// ###########################################################################

export const albanianAlphabet = [
  "A","B","C","Ç","D","DH","E","Ë","F","G","GJ","H","I","J",
  "K","L","LL","M","N","NJ","O","P","Q","R","RR","S","SH",
  "T","TH","U","V","X","XH","Y","Z","ZH"
];

export const getSurname = (name: string | null | undefined): string => {
  if (!name || typeof name !== "string") return "";
  const cleaned = name.trim().replace(/\s+/g, " ");
  const parts = cleaned.split(" ");
  if (parts.length === 0) return "";
  return parts[parts.length - 1];
};

export const formatVipName = (name: string | null | undefined): string => {
  if (!name || typeof name !== "string") return "I PAIDENTIFIKUAR";
  const cleaned = name.trim().replace(/\s+/g, " ");
  if (!cleaned) return "I PAIDENTIFIKUAR";
  const parts = cleaned.split(" ");
  if (parts.length === 1) return parts[0].toUpperCase();
  const lastName = parts.pop()?.toUpperCase() || "";
  const firstName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
  return `${firstName} ${lastName}`;
};

export const getSortKey = (name: string | null | undefined): string => {
  const surname = getSurname(name || "");
  const upper = surname.toUpperCase();
  if (!upper) return "A";
  const two = upper.substring(0, 2);
  const one = upper.substring(0, 1);
  if (albanianAlphabet.includes(two)) return two;
  if (albanianAlphabet.includes(one)) return one;
  return "#";
};

export const getStrengthsAndWeaknesses = (scores: number[]): { strengths: { label: string, score: number }[], weaknesses: { label: string, score: number }[] } => {
    const dimensionKeys = Object.keys(PARAGON_DIMENSIONS_AL) as ParagonDimension[];
    const scoredDimensions = dimensionKeys.map((key, index) => ({
        label: PARAGON_DIMENSIONS_AL[key],
        score: scores[index] || 0,
    })).sort((a, b) => b.score - a.score);
    return {
        strengths: scoredDimensions.slice(0, 2),
        weaknesses: scoredDimensions.slice(-2).reverse(),
    };
};

// ###########################################################################
// SECTION 2: MAPPING LAYER (DTO -> UI MODEL)
// ###########################################################################

export const mapVipProfileResponseToVipProfile = (dto: VipProfileResponseDto): VipProfile => {
  if (!dto) {
    return {
      id: 'unknown',
      name: 'I paidentifikuar',
      imageUrl: 'https://novaric.co/wp-content/uploads/2025/11/Placeholder.jpg',
      category: 'E panjohur',
      shortBio: '',
      detailedBio: '',
      dynamicScore: 0
    };
  }
  return {
    id: dto.id,
    name: dto.name,
    imageUrl: dto.image_url || 'https://novaric.co/wp-content/uploads/2025/11/Placeholder.jpg',
    category: dto.category,
    shortBio: dto.short_bio,
    detailedBio: dto.detailed_bio,
    gender: dto.gender,
    zodiacSign: dto.zodiac_sign,
    dateOfBirth: dto.birth_date,
    age: dto.age,
    dynamicScore: dto.paragon_score ?? dto.overall_score ?? 0,
  };
};

/**
 * Deterministic Order for PARAGON dimensions
 */
export const PARAGON_ORDER: ParagonDimension[] = [
  'Angazhimi Politik',
  'Llogaridhënia',
  'Përfaqësimi',
  'Asertiviteti',
  'Qeverisja',
  'Kohësioni',
  'Narrativa'
];

/**
 * Maps live dimension scores from backend to the ParagonEntry format.
 * Supports both LIST-based and MAP-based JSONB storage found in Supabase.
 */
export const mapParagonToParagonAnalysis = (dto: any): ParagonEntry[] => {
  const defaultEntries = PARAGON_ORDER.map(dim => ({
    dimension: dim,
    score: null as any,
    peerAverage: null as any,
    globalBenchmark: null as any,
    description: "Analiza në pritje...",
    commentary: "Analiza në proces për këtë dimension."
  }));

  if (!dto) return defaultEntries;

  // Resolve source from various possible DTO fields
  const rawList = Array.isArray(dto.dimensions) ? dto.dimensions : 
                  Array.isArray(dto.dimensions_json) ? dto.dimensions_json : 
                  Array.isArray(dto.dimension_scores) ? dto.dimension_scores : [];

  const sourceMap = new Map<string, number>();

  // 1. Process as list if available
  if (rawList.length > 0) {
      rawList.forEach((item: any) => {
          if (item && item.dimension) {
              sourceMap.set(item.dimension, typeof item.score === 'number' ? item.score : 0);
          }
      });
  } 
  
  // 2. Process as object map if list was empty but map exists
  if (sourceMap.size === 0 && dto.dimension_scores && typeof dto.dimension_scores === 'object') {
      Object.entries(dto.dimension_scores).forEach(([k, v]: [string, any]) => {
          const score = typeof v === 'number' ? v : (typeof v === 'object' ? (v.score ?? 0) : 0);
          sourceMap.set(k, score);
      });
  }

  // 3. Construct 7 entries in deterministic order
  return PARAGON_ORDER.map(dim => {
    const score = sourceMap.get(dim) ?? 0;
    const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
    
    // Look for dimension-specific metadata in payload if it's a rich map
    const metadata = (dto.dimension_scores && typeof dto.dimension_scores[dim] === 'object') ? dto.dimension_scores[dim] : {};

    return {
      dimension: dim,
      score: clampedScore,
      peerAverage: metadata.peer_average ?? metadata.peerAverage ?? 65,
      globalBenchmark: metadata.global_benchmark ?? metadata.globalBenchmark ?? 70,
      description: "Vlerësim i llogaritur nga sistemi PARAGON.",
      commentary: metadata.commentary || (clampedScore > 75 ? "Performancë e spikatur." : clampedScore > 45 ? "Performancë mesatare." : "Kërkon vëmendje dhe përmirësim.")
    };
  });
};

// ###########################################################################
// SECTION 3: CENTRALIZED PROFILE PROCESSING
// ###########################################################################

const average = (values: number[]): number => {
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
};

export const getTopAndBottomDimensions = (translated: TranslatedParagonEntry[]) => {
  if (!Array.isArray(translated) || translated.length === 0) {
    return { topDimensions: [], bottomDimensions: [] };
  }
  const cleaned = [...translated].sort((a, b) => b.score - a.score);
  return {
    topDimensions: cleaned.slice(0, 3),
    bottomDimensions: cleaned.slice(-3).reverse(),
  };
};

export const generateRecommendations = (bottom: TranslatedParagonEntry[]): string[] => {
  if (!Array.isArray(bottom) || bottom.length === 0) return ["Përmirësim i përgjithshëm i performancës."];
  const weakest = bottom[0];
  switch (weakest.originalDimension) {
    case 'Llogaridhënia': return ["Rritja e transparencës në prokurimet publike.", "Publikim i deklarimeve të pasurisë."];
    case 'Angazhimi Politik': return ["Thellim i ekspertizës legjislative.", "Pjesëmarrje në komisione."];
    default: return [`Fokus në përmirësimin e dimensionit: ${weakest.dimension}.`];
  }
};

export const processVipProfile = (
  profile: VipProfile,
  backend?: ProfileAnalysis
): ProcessedVipProfile => {
  let processedAnalysis: ProcessedVipProfile["processedAnalysis"];

  // Prioritize Live Backend Data (Supabase)
  if (profile.paragon) {
      const liveEntries = mapParagonToParagonAnalysis(profile.paragon);
      const overallScore = profile.paragon.overall_score ?? average(liveEntries.map(e => e.score));
      const translated: TranslatedParagonEntry[] = liveEntries.map(e => ({
          ...e,
          dimension: PARAGON_DIMENSIONS_AL[e.dimension as ParagonDimension] || e.dimension,
          originalDimension: e.dimension as ParagonDimension
      }));
      const { topDimensions, bottomDimensions } = getTopAndBottomDimensions(translated);
      return {
          ...profile,
          processedAnalysis: { overallScore, translatedAnalysis: translated, topDimensions, bottomDimensions, recommendations: generateRecommendations(bottomDimensions) }
      };
  }

  // Fallback to static or provided analysis
  const local = profile.paragonAnalysis ?? [];
  const overallScore = backend?.overallScore ?? average(local.map(d => d.score ?? 0));
  const translated: TranslatedParagonEntry[] = local.map(d => ({
    ...d,
    dimension: PARAGON_DIMENSIONS_AL[d.dimension as ParagonDimension] ?? d.dimension,
    originalDimension: d.dimension as ParagonDimension,
  }));
  const { topDimensions, bottomDimensions } = getTopAndBottomDimensions(translated);
  processedAnalysis = { overallScore, translatedAnalysis: translated, topDimensions, bottomDimensions, recommendations: generateRecommendations(bottomDimensions) };

  return { ...profile, processedAnalysis };
};

export function getProfilePhotoUrl(profile: any): string | undefined {
    // Never fall back to NOVARIC copies or generic placeholders (photo audit 2026-10-31).
    if (profile?.photoPending) return undefined;
    const url = profile?.officialPhotoPath || profile?.image_url || profile?.imageUrl;
    if (typeof url !== "string" || !(url.startsWith("http") || url.startsWith("/"))) return undefined;
    if (url.includes("media.novaric.al/politicians/") || /\/(Male|Female)Profile\.jpg/i.test(url)) return undefined;
    return url;
}
