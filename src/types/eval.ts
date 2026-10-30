// Top-level evaluation config for the app
export interface EvalConfig {
  version: string;                    // "1.0.0"
  locale: "sq-AL" | "en-AL";
  timeDecayLambdaPerYear: number;     // e.g., 0.35
  dimensions: DimensionSpec[];        // ordered for UI radar
  sources: SourceSpec[];              // canonical registry (scholarly + official)
  nlp?: NLPConfig;                    // sentiment/toxicity classifiers
  contextGuards: ContextGuard[];      // WJP/RSF/FH scalars to avoid systemic bias
}

// What we score
export interface DimensionSpec {
  id: string;                         // "legislative_effectiveness"
  label: string;                      // "Efektiviteti Legjislativ"
  weight: number;                     // default 1.0; overall sum normalized
  description: string;
  indicators: IndicatorSpec[];
}

export interface IndicatorSpec {
  id: string;                         // "bills_into_law"
  label: string;                      // "Projektligje që u bënë ligj"
  description: string;
  unit: "count" | "ratio" | "score" | "ordinal";
  direction: "higher_is_better" | "lower_is_better";
  // How to compute
  formula: Formula;                   // e.g., min–max normalization
  // Provenance & refresh
  sources: string[];                  // SourceSpec.id list
  refresh: "daily" | "weekly" | "monthly" | "quarterly" | "annually";
  // Evidence rendering
  evidenceTemplate?: string;          // string interpolation with ${value}, ${period}, ${source}
}

export type Formula =
  | { kind: "minmax"; min: number; max: number }                // maps -> 0..100
  | { kind: "zscore"; mean: number; stdev: number }             // -> 0..100 via CDF
  | { kind: "thresholds"; bands: Array<{lte: number; score: number}> }
  | { kind: "custom"; code: string };                           // pure function body returning 0..100

export interface SourceSpec {
  id: string;                          // "vdem", "osce_odihr_2021_al"
  title: string;
  authors?: string[];
  year?: number;
  type: "peer_reviewed" | "official_report" | "ngo_index" | "dataset" | "book" | "method";
  url?: string;
  doi?: string;
  reliability: number;                 // 0..1 (weights evidence)
  keyTerms?: string[];                 // for terminology tooltips
  usageNotes?: string;                 // how the app should use/interpret this source
}

export interface NLPConfig {
  sentimentModel: string;              // "xlm-r-large"
  toxicityModel?: string;              // "shaj-albanian"
  lexicons?: string[];                 // URLs/refs to Albanian polarity/abusiveness lexicons
  preprocess: {
    stripUrls: boolean;
    lowercase: boolean;
    removeHandles: boolean;
  };
}

export interface ContextGuard {
  id: "media_freedom" | "rule_of_law" | "freedom_house";
  label: string;
  source: string;                       // SourceSpec.id
  applyToDimensions: string[];          // e.g., ["communication"]
  method:
    | { kind: "cap_bonus"; maxBonusPoints: number }
    | { kind: "cap_penalty"; maxPenaltyPoints: number }
    | { kind: "affine_scale"; slope: number; intercept: number };
}

// Run-time output after computing scores for a politician
export interface EvalResult {
  politicianId: string;
  period: { startISO: string; endISO: string };
  overall: ScoredValue;
  dimensions: Array<{ id: string; score: ScoredValue }>;
  indicators: Record<string, ScoredValue>; // indicatorId -> score
  evidence: EvidenceCard[];                // human-readable cards
}

export interface ScoredValue {
  value: number;                           // 0..100
  ci95?: [number, number];                 // uncertainty band
  quality: "high" | "medium" | "low";      // based on source reliabilities + missingness
}

export interface EvidenceCard {
  indicatorId: string;
  statement: string;                       // rendered from evidenceTemplate
  sourceIds: string[];                     // for clickable citations
  observed: number | string;
  observedAt: string;                      // ISO date
  reliability: number;                     // 0..1 (weighted average of sources)
}