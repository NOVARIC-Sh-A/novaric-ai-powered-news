/**
 * MARAGON® gated composite (internal; never displayed as a number).
 * Implements STD-COM-MARAGON-METHODOLOGY-v1.0-20261121 §8 (W0 weights), §9 (formula and evidence
 * gate), §6.3/§6.5 (thresholds and confidence) and signed AM-02, AM-03, AM-04 for individuals.
 * Missing evidence is never poor performance: unknown stays null; a measured 0 stays 0.
 * Benchmark / reference series and axis C never enter this function's result.
 */
import { canonicalParent, dimensionOf, type MaragonDimensionKey } from '../lib/maragonIndicatorMap';
import type { MaragonConfidence } from './maragonPublication';

export type CompositeScope = 'individual' | 'outlet';

export interface CompositeIndicatorInput {
  /** Canonical id (maragon:R1.1 …) or slot code (ind:A2.2, G3.1-I …). */
  id: string;
  status: 'not_assessed' | 'insufficient_evidence' | 'not_applicable' | 'assessed' | 'assessed-qualitative';
  /** Human-final value (§7.4). Bot drafts must not be passed here. */
  humanFinalScore: number | null | undefined;
  confidence: MaragonConfidence | null | undefined;
  /** §6.3 band threshold met for the band the score is in. */
  thresholdMet: boolean;
  /** R1.2 only: both R1.2-S and R1.2-P available (§5.1, D-10). */
  r12BothSubscores?: boolean;
  /** Marks a benchmark/reference series point; always rejected. */
  referenceSeries?: boolean;
}

export interface DimensionResult {
  score: number | null;
  confidence: MaragonConfidence | null;
  eligible: string[];
  scored: string[];
  reason: string | null;
}

export interface CompositeResult {
  composite: number | null;
  confidence: MaragonConfidence | null;
  dimensions: Record<MaragonDimensionKey, DimensionResult>;
  rejected: string[];
}

const DIMENSIONS: MaragonDimensionKey[] = ['R', 'A', 'G', 'O'];
/** §9 outlet gate. Individuals: AM-04, all eligible indicators, minimum 1. */
const OUTLET_MIN_SCORED: Record<MaragonDimensionKey, number> = { R: 2, A: 3, G: 2, O: 2 };
const RANK: Record<MaragonConfidence, number> = { none: 0, low: 1, medium: 2, high: 3 };

function lowest(values: MaragonConfidence[]): MaragonConfidence | null {
  if (!values.length) return null;
  return values.reduce((a, b) => (RANK[b] < RANK[a] ? b : a));
}

function isExtreme(value: number): boolean {
  return value <= 20 || value >= 81;
}

/** s_i per §9: non-null only when every condition holds. */
export function indicatorScoreForComposite(input: CompositeIndicatorInput): number | null {
  if (input.referenceSeries) return null;
  if (input.status !== 'assessed') return null;
  if (!input.thresholdMet) return null;
  if (input.confidence !== 'medium' && input.confidence !== 'high') return null;
  const value = input.humanFinalScore;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) return null;
  if (isExtreme(Math.round(value)) && input.confidence !== 'high') return null;
  if (canonicalParent(input.id) === 'maragon:R1.2' && input.r12BothSubscores !== true) return null;
  return value;
}

export function gatedComposite(indicators: CompositeIndicatorInput[], scope: CompositeScope = 'individual'): CompositeResult {
  const rejected: string[] = [];
  const byDimension = new Map<MaragonDimensionKey, CompositeIndicatorInput[]>();
  DIMENSIONS.forEach((d) => byDimension.set(d, []));
  const seen = new Set<string>();
  for (const item of indicators) {
    const parent = canonicalParent(item.id);
    if (item.referenceSeries || !parent) {
      rejected.push(item.id);
      continue;
    }
    if (seen.has(parent)) {
      rejected.push(`${item.id} (duplicate of ${parent})`);
      continue;
    }
    seen.add(parent);
    byDimension.get(dimensionOf(parent) as MaragonDimensionKey)!.push(item);
  }

  const dimensions = {} as Record<MaragonDimensionKey, DimensionResult>;
  for (const d of DIMENSIONS) {
    const items = byDimension.get(d)!;
    const eligible = items.filter((item) => item.status !== 'not_applicable');
    const scoredPairs = eligible
      .map((item) => ({ item, value: indicatorScoreForComposite(item) }))
      .filter((pair): pair is { item: CompositeIndicatorInput; value: number } => pair.value !== null);
    const minScored = scope === 'individual' ? Math.max(1, eligible.length) : OUTLET_MIN_SCORED[d];
    const result: DimensionResult = {
      score: null,
      confidence: null,
      eligible: eligible.map((item) => item.id),
      scored: scoredPairs.map((pair) => pair.item.id),
      reason: null,
    };
    if (eligible.length === 0) {
      result.reason = 'no eligible indicator';
    } else if (scoredPairs.length < minScored) {
      result.reason = `evidence gate not met (${scoredPairs.length} of ${minScored} required)`;
    } else {
      const raw = scoredPairs.reduce((sum, pair) => sum + pair.value, 0) / scoredPairs.length;
      const confidence = lowest(scoredPairs.map((pair) => pair.item.confidence as MaragonConfidence));
      if (isExtreme(Math.round(raw)) && confidence !== 'high') {
        result.reason = 'extreme dimension value without high confidence';
      } else {
        result.score = raw; // unrounded; rounding only at the final step (§9)
        result.confidence = confidence;
      }
    }
    dimensions[d] = result;
  }

  const allPresent = DIMENSIONS.every((d) => dimensions[d].score !== null);
  if (!allPresent) return { composite: null, confidence: null, dimensions, rejected };
  const raw = DIMENSIONS.reduce((sum, d) => sum + 0.25 * (dimensions[d].score as number), 0);
  const confidence = lowest(DIMENSIONS.map((d) => dimensions[d].confidence as MaragonConfidence));
  const composite = Math.round(raw);
  if (isExtreme(composite) && confidence !== 'high') return { composite: null, confidence: null, dimensions, rejected };
  return { composite, confidence, dimensions, rejected };
}
