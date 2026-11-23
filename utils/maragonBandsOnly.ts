/**
 * MARAGON® bands-only public presentation (signed v1.0 §10, D-21; owner decision UD-19, t329u).
 *
 * §10: "band + confidence + evidence list; no raw numbers in public". Numbers stay in the dossier.
 * §1.2 / §3.1: scores are criterion-referenced; "any ranking of subjects against each other" is out of
 * scope in v1.0. Public MARAGON® lists are therefore ordered by a neutral key (name), never by a score,
 * a concealed number or a band.
 */
import {
  bandForScore,
  MARAGON_BAND_LABELS,
  type MaragonBandKey,
  type MaragonLanguage,
} from './maragonPublication';

/** v1.0 §10 (D-21): no raw MARAGON® number is shown publicly. */
export const MARAGON_PUBLIC_NUMBERS_ALLOWED = false as const;
/** v1.0 §1.2 and §3.1: no ranking of subjects against each other. */
export const MARAGON_PUBLIC_RANKING_PERMITTED = false as const;
export const MARAGON_PUBLIC_ORDERING = 'name' as const;

export const NOT_ASSESSED_BILINGUAL = 'Pa vlerësim / Not assessed';

export interface PublicMaragonBand {
  band: MaragonBandKey;
  level: number;
  label_sq: string;
  label_en: string;
}

/**
 * The only public form of a MARAGON® value. Returns null (→ "Pa vlerësim") unless the caller's
 * publication gate is open and the value is a measured 0–100 number. The number itself is never returned.
 */
export function publishedBand(gateOpen: boolean, value: unknown): PublicMaragonBand | null {
  if (gateOpen !== true) return null;
  const band = bandForScore(value);
  if (!band) return null;
  const meta = MARAGON_BAND_LABELS[band];
  return { band, level: meta.level, label_sq: meta.sq, label_en: meta.en };
}

/** Accepts an already-decided band key (for records that store bands, not numbers). */
export function publishedBandFromKey(gateOpen: boolean, key: unknown): PublicMaragonBand | null {
  if (gateOpen !== true || typeof key !== 'string' || !(key in MARAGON_BAND_LABELS)) return null;
  const band = key as MaragonBandKey;
  const meta = MARAGON_BAND_LABELS[band];
  return { band, level: meta.level, label_sq: meta.sq, label_en: meta.en };
}

export function publicBandText(band: PublicMaragonBand | null, lang: MaragonLanguage = 'sq'): string {
  if (!band) return lang === 'en' ? 'Not assessed' : 'Pa vlerësim';
  return lang === 'en' ? band.label_en : band.label_sq;
}

/** Accessible description: band words only, never a number. */
export function publicBandAria(subject: string, band: PublicMaragonBand | null): string {
  return band
    ? `${subject}: ${band.label_sq} / ${band.label_en}`
    : `${subject}: ${NOT_ASSESSED_BILINGUAL}`;
}

const DIMENSION_KEYS = ['Readiness', 'Aptitude', 'Governance', 'OversightNurturing'] as const;
export type MaragonDimensionKey = typeof DIMENSION_KEYS[number];

/** Public payload shape: bands only. Numeric fields are dropped, not rounded or hidden by CSS. */
export interface PublicMaragonPayload {
  entityId: string;
  entityType: string;
  publishedBand: MaragonBandKey | null;
  dimensions: Record<MaragonDimensionKey, MaragonBandKey | null>;
  label: string;
}

export function toPublicMaragonPayload(
  report: { entityId?: unknown; entityType?: unknown; compositeScore?: unknown } & Partial<Record<MaragonDimensionKey, unknown>>,
  gateOpen: boolean,
): PublicMaragonPayload {
  const dims = Object.fromEntries(
    DIMENSION_KEYS.map((key) => [key, publishedBand(gateOpen, report[key])?.band ?? null]),
  ) as Record<MaragonDimensionKey, MaragonBandKey | null>;
  const composite = publishedBand(gateOpen, report.compositeScore);
  return {
    entityId: String(report.entityId ?? ''),
    entityType: String(report.entityType ?? ''),
    publishedBand: composite?.band ?? null,
    dimensions: dims,
    label: composite ? `${composite.label_sq} / ${composite.label_en}` : NOT_ASSESSED_BILINGUAL,
  };
}

/** Neutral public order (v1.0 §1.2): alphabetical by name, Albanian collation. */
export function compareMaragonNeutral(a: { name?: unknown }, b: { name?: unknown }): number {
  return String(a?.name ?? '').localeCompare(String(b?.name ?? ''), 'sq');
}
