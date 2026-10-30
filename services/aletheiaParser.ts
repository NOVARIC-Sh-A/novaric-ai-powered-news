
import { z } from "zod";
import { MetricDetail, LethePoint } from '../components/IntegrityMatrix';

/**
 * ------------------------------------------------------------------
 * 1. PRIMITIVE SCHEMAS
 * ------------------------------------------------------------------
 */

// Source Types allowed in the system
const SourceTypeEnum = z.enum(["Primary", "Secondary", "Tertiary"]);

// The specific Lethe categories used in the IntegrityMatrix
// These must match the visual component's expectations exactly
const LetheCategoryEnum = z.enum(["Origjina", "Konflikti", "Konteksti", "Data", "Precedenti"]);

/**
 * 2. COMPONENT SCHEMAS
 */

// Strictly validates a single source
const SourceSchema = z.object({
  name: z.string().min(1, "Source name is required"),
  url: z.string().url("Invalid URL format"),
  type: SourceTypeEnum,
  isAffiliated: z.boolean().default(false).describe("Flags conflict of interest"),
});

// Strictly validates a missing context point (Lethe)
const LethePointSchema = z.object({
  description: z.string().min(10, "Description must be detailed"),
  category: LetheCategoryEnum,
  proofUrl: z.string().url().optional().or(z.literal("")), // Allows empty string or valid URL
  impact: z.enum(["High", "Medium"]).default("Medium"),
});

/**
 * 3. THE CORE ALETHEIA SCHEMA
 * This validates the RAW output coming from the AI Agent before it reaches the UI.
 */
export const AletheiaAnalysisSchema = z.object({
  articleId: z.string(),
  
  // RAW DATA ARRAYS (The truth of the document)
  sources: z.array(SourceSchema),
  missingContext: z.array(LethePointSchema),
  
  // PSYCHOMETRICS (Raw counts from NLP analysis)
  logicTokens: z.number().int().nonnegative(),
  emotionTokens: z.number().int().nonnegative(),
  
  // MANUAL OVERRIDE (Optional)
  editorVerdict: z.string().optional(),
})
.transform((data) => {
  // ------------------------------------------------------------------
  // 4. THE TRANSFORMATION LAYER (Automatic Calculations)
  // This ensures mathematical consistency in the frontend.
  // ------------------------------------------------------------------
  
  const totalTokens = data.logicTokens + data.emotionTokens;
  
  // Calculate CSR Value (0 = Pure Logic, 100 = Pure Emotion)
  // If no tokens, default to 50 (Neutral)
  const csrValue = totalTokens === 0 
    ? 50 
    : Math.round((data.emotionTokens / totalTokens) * 100);

  // Calculate Credibility Score (0-10) based on Primary Sources ratio
  const primarySources = data.sources.filter(s => s.type === "Primary").length;
  const totalSources = data.sources.length;
  const sourceRatio = totalSources > 0 ? primarySources / totalSources : 0;
  
  // Base score calculation (Simplified Algorithm)
  // Base 5, +4 for perfect source ratio, -1 per 2 missing context points
  let calculatedScore = 5 + (sourceRatio * 4); 
  const penalty = Math.floor(data.missingContext.length / 2);
  calculatedScore = Math.max(1, Math.min(10, calculatedScore - penalty));
  
  return {
    ...data,
    // Computed Fields for IntegrityMatrix
    computed: {
      csrValue: csrValue,
      score: Number(calculatedScore.toFixed(1)),
      sourceCount: totalSources,
      primarySourceCount: primarySources,
      hasAffiliatedSources: data.sources.some(s => s.isAffiliated),
    }
  };
});

/**
 * 5. TYPE EXPORTS
 * Use these types in your React components to ensure strict adherence.
 */
export type RawAnalysisInput = z.input<typeof AletheiaAnalysisSchema>;
export type ProcessedAnalysis = z.output<typeof AletheiaAnalysisSchema>;
export type Source = z.infer<typeof SourceSchema>;

/**
 * 6. PARSER UTILITY
 * Usage: const safeData = parseAIResponse(rawData);
 */
export const parseAIResponse = (input: unknown) => {
  const result = AletheiaAnalysisSchema.safeParse(input);
  if (!result.success) {
    console.error("ALETHEIA PARSER ERROR:", result.error.format());
    throw new Error("Data integrity check failed: Invalid AI Analysis format.");
  }
  return result.data;
};

/**
 * 7. UI MAPPER (The Bridge)
 * Transforms the processed analysis into the exact props required by the IntegrityMatrix component.
 */
export function mapToIntegrityMatrix(data: ProcessedAnalysis) {
  const { computed, sources, missingContext, editorVerdict } = data;

  // 1. Genealogy Steps Calculation
  // Step 1 is active if we have at least one Primary source
  const hasPrimary = computed.primarySourceCount > 0;
  // Step 2 is active if we have any sources (Aggregation)
  const hasSources = computed.sourceCount > 0;
  
  const originSteps = [
    { 
      label: "Burimi Zyrtar", 
      active: hasPrimary, 
      isCurrent: hasPrimary && !hasSources // Rarely true, usually flows through
    },
    { 
      label: "Agjencia", 
      active: hasSources, 
      isCurrent: hasSources && !hasPrimary // Stops here if only secondary sources
    }, 
    { 
      label: "Ky Artikull", 
      active: true, 
      isCurrent: true // Always the final view
    }
  ];

  // 2. Detailed Metrics Construction
  // Dynamic status calculation based on thresholds
  const primaryStatus = computed.primarySourceCount >= 2 ? "Good" : computed.primarySourceCount > 0 ? "Average" : "Bad";
  const sourceRatioStatus = (computed.primarySourceCount / (computed.sourceCount || 1)) > 0.5 ? "Good" : "Average";
  
  const detailedMetrics: MetricDetail[] = [
    {
      category: "Besueshmëria",
      // Score represents the percentage of primary sources
      score: Math.round((computed.primarySourceCount / (computed.sourceCount || 1)) * 100), 
      items: [
        { 
          label: "Burime Parësore", 
          value: `${computed.primarySourceCount} të cituara`, 
          status: primaryStatus 
        },
        { 
          label: "Verifikimi", 
          value: `${computed.sourceCount} burime totale`, 
          status: sourceRatioStatus 
        }
      ]
    },
    {
      category: "Anshmëria & Toni",
      // Score represents Logic (inverse of Emotion/CSR)
      score: 100 - computed.csrValue, 
      items: [
        { 
          label: "Balanca Emocionale", 
          value: `${computed.csrValue}% Emocion`, 
          status: computed.csrValue < 40 ? "Good" : computed.csrValue < 70 ? "Average" : "Bad" 
        },
        { 
          label: "Konflikt Interesi", 
          value: computed.hasAffiliatedSources ? "Po (I Zbuluar)" : "Jo", 
          status: computed.hasAffiliatedSources ? "Bad" : "Good" 
        }
      ]
    }
  ];

  // 3. Construct Final Object
  return {
    context: "Media" as const,
    score: computed.score,
    summary: editorVerdict || "Analizë e gjeneruar automatikisht nga sistemi Aletheia.",
    originSteps,
    csrValue: computed.csrValue,
    letheData: missingContext,
    detailedMetrics
  };
}
