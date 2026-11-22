/**
 * MARAGON® indicator identity and variant mapping.
 * Source of truth: STD-COM-MARAGON-METHODOLOGY-v1.0-20261121 §4 (signed 21.11.2026 17:43 Tirana)
 * with signed amendments AM-03 (G3.1-I) and AM-07 (ind:A2.2-ADV); R1.2-S / R1.2-P from §5.1 (D-10).
 * Ten canonical indicators only. Variants never create a new canonical indicator.
 * Axis C is supplementary and unscored (D-34). Kept separate from PARAGON®.
 */
import { CANONICAL_MARAGON_INDICATOR_IDS } from './maragon-schemas';

export type MaragonCanonicalId = (typeof CANONICAL_MARAGON_INDICATOR_IDS)[number];
export type MaragonDimensionKey = 'R' | 'A' | 'G' | 'O';

export interface MaragonCanonicalMeaning {
  id: MaragonCanonicalId;
  code: string;
  dimension: MaragonDimensionKey;
  title_sq: string;
  title_en: string;
  /** Slot code applied on individual-presenter profiles (§4, AM-03). */
  individualSlot: string;
}

/** Canonical meanings, verbatim titles from v1.0 §4. */
export const MARAGON_CANONICAL_MEANINGS: readonly MaragonCanonicalMeaning[] = [
  { id: 'maragon:R1.1', code: 'R1.1', dimension: 'R', title_sq: 'Pajtueshmëria Rregullatore', title_en: 'Regulatory Compliance', individualSlot: 'R1.1' },
  { id: 'maragon:R1.2', code: 'R1.2', dimension: 'R', title_sq: 'Pajtueshmëria Etike', title_en: 'Ethical Compliance', individualSlot: 'R1.2' },
  { id: 'maragon:A2.1', code: 'A2.1', dimension: 'A', title_sq: 'Saktësia Faktike', title_en: 'Factual Accuracy', individualSlot: 'A2.1' },
  { id: 'maragon:A2.2', code: 'A2.2', dimension: 'A', title_sq: 'Paanshmëria & Anshmëria', title_en: 'Impartiality & Bias', individualSlot: 'ind:A2.2' },
  { id: 'maragon:A2.3', code: 'A2.3', dimension: 'A', title_sq: 'Origjinaliteti & Thellësia', title_en: 'Originality & Depth', individualSlot: 'ind:A2.3' },
  { id: 'maragon:A2.4', code: 'A2.4', dimension: 'A', title_sq: 'Kontekstualizimi', title_en: 'Contextualisation', individualSlot: 'A2.4' },
  { id: 'maragon:G3.1', code: 'G3.1', dimension: 'G', title_sq: 'Ndikimi i Pronësisë', title_en: 'Ownership Influence', individualSlot: 'G3.1-I' },
  { id: 'maragon:G3.2', code: 'G3.2', dimension: 'G', title_sq: 'Kontrolli Editorial', title_en: 'Editorial Control', individualSlot: 'G3.2' },
  { id: 'maragon:O4.1', code: 'O4.1', dimension: 'O', title_sq: 'Promovimi i Edukimit Mediatik', title_en: 'Promoting Media Literacy', individualSlot: 'ind:O4.1' },
  { id: 'maragon:O4.2', code: 'O4.2', dimension: 'O', title_sq: 'Kontributi në Diskursin Demokratik', title_en: 'Contribution to Democratic Discourse', individualSlot: 'O4.2' },
];

/** Approved variants → canonical parent. Anything else is rejected. */
export const MARAGON_VARIANT_PARENT: Readonly<Record<string, MaragonCanonicalId>> = {
  'ind:A2.2': 'maragon:A2.2',
  'ind:A2.2-ADV': 'maragon:A2.2', // AM-07, signed
  'ind:A2.3': 'maragon:A2.3',
  'ind:O4.1': 'maragon:O4.1',
  'G3.1-I': 'maragon:G3.1', // AM-03, signed
  'R1.2-S': 'maragon:R1.2', // §5.1 sub-score (census)
  'R1.2-P': 'maragon:R1.2', // §5.1 sub-score (sample)
};

export const MARAGON_SUPPLEMENTARY_AXIS_ID = 'maragon:C';

/** Canonical parent for an id or a slot code; null for unknown codes and for axis C. */
export function canonicalParent(codeOrId: string | null | undefined): MaragonCanonicalId | null {
  const raw = String(codeOrId ?? '').trim();
  if (!raw || raw === 'C' || raw === MARAGON_SUPPLEMENTARY_AXIS_ID) return null;
  if (MARAGON_VARIANT_PARENT[raw]) return MARAGON_VARIANT_PARENT[raw];
  const asId = raw.startsWith('maragon:') ? raw : `maragon:${raw}`;
  return (CANONICAL_MARAGON_INDICATOR_IDS as readonly string[]).includes(asId) ? (asId as MaragonCanonicalId) : null;
}

export function dimensionOf(codeOrId: string): MaragonDimensionKey | null {
  const parent = canonicalParent(codeOrId);
  return MARAGON_CANONICAL_MEANINGS.find((item) => item.id === parent)?.dimension ?? null;
}

export interface IndicatorSetEntry {
  id: string;
  code: string;
  status?: string;
  score?: number | null;
  supplementary?: boolean;
}

/**
 * Checks a profile's indicator list: the ten canonical ids once each, in order; every slot code maps
 * to its own canonical id; no extra canonical indicator; axis C, if present, unscored.
 * Returns a list of problems (empty = valid).
 */
export function indicatorSetProblems(entries: IndicatorSetEntry[], scope: 'individual' | 'outlet' = 'individual'): string[] {
  const problems: string[] = [];
  const canonical = entries.filter((entry) => entry.id !== MARAGON_SUPPLEMENTARY_AXIS_ID && !entry.supplementary);
  const ids = canonical.map((entry) => entry.id);
  if (ids.join('|') !== CANONICAL_MARAGON_INDICATOR_IDS.join('|')) {
    problems.push('The ten canonical MARAGON indicators must appear exactly once, in order.');
  }
  canonical.forEach((entry) => {
    const parent = canonicalParent(entry.code);
    if (parent !== entry.id) problems.push(`${entry.id}: slot code ${entry.code} does not map to this indicator.`);
    if (scope === 'individual' && entry.id === 'maragon:G3.1' && entry.code === 'G3.1') {
      problems.push('maragon:G3.1: individual profiles use G3.1-I (AM-03).');
    }
  });
  entries
    .filter((entry) => entry.id === MARAGON_SUPPLEMENTARY_AXIS_ID || entry.supplementary)
    .forEach((entry) => {
      if (entry.score !== null && entry.score !== undefined) problems.push('Axis C must stay unscored (D-34).');
      if (entry.status && entry.status !== 'not_assessed') problems.push('Axis C must stay not_assessed (D-34).');
    });
  return problems;
}
