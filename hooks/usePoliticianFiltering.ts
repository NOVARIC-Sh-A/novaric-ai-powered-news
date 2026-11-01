
// hooks/usePoliticianFiltering.ts
import { useMemo } from "react";
import {
  VipProfile,
  ProcessedVipProfile,
  TranslatedParagonEntry,
  ParagonDimension,
  ParagonEntry,
} from "../types";
import {
  ProfileAnalysisMap,
  ProfileAnalysis,
} from "../services/profileAnalysisService";
import { PARAGON_DIMENSIONS_AL } from "../utils/translations";
import {
  getTopAndBottomDimensions,
  generateRecommendations,
  getSurname
} from "../utils/paragonProfileUtils";

// ---- Helpers ----

const average = (values: number[]): number => {
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
};

const paragonDimensionDescriptions: Record<ParagonDimension, string> = {
  "Angazhimi Politik":
    "Pjesëmarrja në hartimin e ligjeve dhe puna në komisione.",
  "Llogaridhënia":
    "Transparenca, deklarimi i pasurisë dhe standardet etike.",
  "Përfaqësimi":
    "Lidhja me komunitetin dhe përgjigja ndaj nevojave të tij.",
  "Asertiviteti":
    "Aftësia për të ndikuar axhendën politike.",
  "Qeverisja":
    "Forcimi i institucioneve demokratike.",
  "Kohësioni":
    "Uniteti dhe disiplinimi partiak.",
  "Narrativa": "Qartësia e komunikimit publik.",
};

/**
 * Converts backend analysis or local mock data into the full ProcessedVipProfile["processedAnalysis"] object.
 * This function now lives inside the hook to directly address the bug as described.
 */
const mapAnalysisToProcessed = (
  profile: VipProfile,
  backend?: ProfileAnalysis
): ProcessedVipProfile["processedAnalysis"] => {
  // If no backend analysis → use local static analysis
  if (!backend || !backend.dimensions || Object.keys(backend.dimensions).length === 0) {
    const local = profile.paragonAnalysis ?? [];
    const measured = local.map((d) => d.score).filter((score): score is number => typeof score === 'number');
    const overallScore = measured.length > 0 ? average(measured) : null;

    const translatedAnalysis: TranslatedParagonEntry[] = local.map((d) => ({
      ...d,
      dimension:
        PARAGON_DIMENSIONS_AL[d.dimension as ParagonDimension] ??
        d.dimension,
      originalDimension: d.dimension as ParagonDimension,
    }));

    const { topDimensions, bottomDimensions } =
      getTopAndBottomDimensions(translatedAnalysis);
    const recommendations = generateRecommendations(bottomDimensions);

    return {
      overallScore,
      translatedAnalysis,
      topDimensions,
      bottomDimensions,
      recommendations,
    };
  }

  // Backend is available → merge backend scores with local metadata (descriptions, commentaries)
  const overallScore =
    typeof backend.overallScore === "number" ? backend.overallScore : 0;

  const localMap = new Map<string, ParagonEntry>();
  if (profile.paragonAnalysis) {
    for (const entry of profile.paragonAnalysis) {
      localMap.set(entry.dimension, entry);
    }
  }

  const translatedAnalysis: TranslatedParagonEntry[] = Object.entries(
    backend.dimensions ?? {}
  ).map(([dimName, score]) => {
    const dim = dimName as ParagonDimension;
    const local = localMap.get(dim);

    return {
      originalDimension: dim,
      dimension: PARAGON_DIMENSIONS_AL[dim] ?? dim,
      score: typeof score === "number" ? score : 0,
      description:
        local?.description ??
        paragonDimensionDescriptions[dim] ??
        "Përshkrimi nuk disponohet.",
      commentary: local?.commentary ?? "Komenti nuk disponohet.",
      peerAverage: local?.peerAverage ?? 0,
      globalBenchmark: local?.globalBenchmark ?? 0,
    };
  });

  const { topDimensions, bottomDimensions } =
    getTopAndBottomDimensions(translatedAnalysis);
  const recommendations = generateRecommendations(bottomDimensions);

  return {
    overallScore,
    translatedAnalysis,
    topDimensions,
    bottomDimensions,
    recommendations,
  };
};

// ---- Main Hook ----

interface UsePoliticianFilteringResult {
  dominantFigures: ProcessedVipProfile[];
  mainGridFigures: ProcessedVipProfile[];
  filteredAndSortedPoliticalFigures: ProcessedVipProfile[];
  processedPoliticalFigures: ProcessedVipProfile[];
}

export const usePoliticianFiltering = (
  profiles: VipProfile[],
  searchTerm: string,
  sortBy: "surname" | "popularity",
  analysisById: ProfileAnalysisMap
): UsePoliticianFilteringResult => {
  
  const processedPoliticalFigures: ProcessedVipProfile[] = useMemo(() => {
    return profiles.map((p) => {
      const backend = analysisById[p.id];
      return {
        ...p,
        processedAnalysis: mapAnalysisToProcessed(p, backend),
      };
    });
  }, [profiles, analysisById]);

  const filteredBySearch = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return processedPoliticalFigures;

    return processedPoliticalFigures.filter((p) => {
      const name = typeof p.name === "string" ? p.name.toLowerCase() : "";
      const category =
        typeof p.category === "string"
          ? p.category.toLowerCase()
          : "";
      return name.includes(term) || category.includes(term);
    });
  }, [processedPoliticalFigures, searchTerm]);

  const filteredAndSortedPoliticalFigures = useMemo(() => {
    const arr = [...filteredBySearch];

    if (sortBy === "popularity") {
      arr.sort(
        (a, b) =>
          (b.processedAnalysis?.overallScore ?? 0) -
          (a.processedAnalysis?.overallScore ?? 0)
      );
      return arr;
    }

    arr.sort((a, b) => {
      const aKey = getSurname(a.name);
      const bKey = getSurname(b.name);
      return aKey.localeCompare(bKey, "sq");
    });

    return arr;
  }, [filteredBySearch, sortBy]);

  const dominantFigures = useMemo(() => {
    const nard =
      processedPoliticalFigures.find((p) => p.id === "vip_nn") ??
      null;

    const sorted = [...processedPoliticalFigures]
      .filter((p) => p.id !== "vip_nn")
      .sort(
        (a, b) =>
          (b.processedAnalysis?.overallScore ?? 0) -
          (a.processedAnalysis?.overallScore ?? 0)
      );

    const final = nard ? [nard] : [];
    final.push(...sorted.slice(0, 6 - final.length));

    return final;
  }, [processedPoliticalFigures]);

  const mainGridFigures = useMemo(() => {
    const dominantIds = new Set(dominantFigures.map((d) => d.id));
    return filteredAndSortedPoliticalFigures.filter(
      (p) => !dominantIds.has(p.id)
    );
  }, [filteredAndSortedPoliticalFigures, dominantFigures]);

  return {
    dominantFigures,
    mainGridFigures,
    filteredAndSortedPoliticalFigures,
    processedPoliticalFigures,
  };
};
