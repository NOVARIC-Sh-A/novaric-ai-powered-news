/**
 * Publication gate for MARAGON® media assessments.
 * Stored scores stay on the record. They are shown only after an explicit approval,
 * and never while scoring is suspended. A missing status means not assessed.
 */

export type MaragonAssessmentStatus =
  | 'not_assessed'
  | 'research_only'
  | 'pending_review'
  | 'approved'
  | 'withheld'
  | 'suspended';

export type MaragonBiographyStatus = 'draft' | 'pending_review' | 'approved' | 'withheld';

export type MaragonLanguage = 'sq' | 'en';

/**
 * Band keys stored on a presenter record. They are not a public score.
 * Five bands, as signed in STD-COM-MARAGON-METHODOLOGY-v1.0-20261121 §0 and §10
 * (adopted 19.11.2026). `level` is the radar ring (1 = innermost, 5 = outermost);
 * it is a drawing position, never a public number.
 */
export type MaragonBandKey = 'shume_e_dobet' | 'e_dobet' | 'mesatare' | 'e_forte' | 'shume_e_forte';

export const MARAGON_BAND_KEYS: readonly MaragonBandKey[] = ['shume_e_dobet', 'e_dobet', 'mesatare', 'e_forte', 'shume_e_forte'];

export const MARAGON_BAND_LABELS: Record<MaragonBandKey, { sq: string; en: string; level: number; min: number; max: number }> = {
  shume_e_dobet: { sq: 'Shumë e dobët', en: 'Very weak', level: 1, min: 0, max: 20 },
  e_dobet: { sq: 'E dobët', en: 'Weak', level: 2, min: 21, max: 40 },
  mesatare: { sq: 'Mesatare', en: 'Moderate', level: 3, min: 41, max: 60 },
  e_forte: { sq: 'E fortë', en: 'Strong', level: 4, min: 61, max: 80 },
  shume_e_forte: { sq: 'Shumë e fortë', en: 'Very strong', level: 5, min: 81, max: 100 },
};

/** Internal helper: the band a human-final score falls in. Unknown stays null; 0 is a measurement. */
export function bandForScore(score: unknown): MaragonBandKey | null {
  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0 || score > 100) return null;
  const rounded = Math.round(score);
  return MARAGON_BAND_KEYS.find((key) => rounded >= MARAGON_BAND_LABELS[key].min && rounded <= MARAGON_BAND_LABELS[key].max) ?? null;
}

/** The two extreme bands need `high` confidence (v1.0 §6.3, §6.5). */
export function isExtremeBand(band: MaragonBandKey | null | undefined): boolean {
  return band === 'shume_e_dobet' || band === 'shume_e_forte';
}

export type MaragonConfidence = 'none' | 'low' | 'medium' | 'high';

export const MARAGON_CONFIDENCE_LABELS: Record<MaragonConfidence, { sq: string; en: string }> = {
  none: { sq: 'Pa besueshmëri', en: 'No confidence' },
  low: { sq: 'E ulët', en: 'Low' },
  medium: { sq: 'Mesatare', en: 'Medium' },
  high: { sq: 'E lartë', en: 'High' },
};

export const MARAGON_STATUS_LABELS: Record<MaragonAssessmentStatus, { sq: string; en: string }> = {
  not_assessed: { sq: 'Pa vlerësim', en: 'Not assessed' },
  research_only: { sq: 'Vetëm kërkim', en: 'Research only' },
  pending_review: { sq: 'Në shqyrtim', en: 'Pending review' },
  approved: { sq: 'I miratuar', en: 'Approved' },
  withheld: { sq: 'I pezulluar', en: 'Withheld' },
  suspended: { sq: 'I ndaluar', en: 'Suspended' },
};

export const PROVISIONAL_LABEL = {
  sq: 'PROVIZOR',
  en: 'PROVISIONAL',
} as const;

/** Exact public label required by signed AM-09 for any indicative band shown in public. */
export const AM09_PUBLIC_LABEL = {
  sq: 'PROVIZOR — në pritje të miratimit',
  en: 'PROVISIONAL — pending sign-off',
} as const;

/**
 * Indicative bands stay off the public page unless every publication gate is open.
 * A dev preview does not call this; it uses maragonInternalPreview instead.
 */
export function maragonProvisionalBandsArePublic(entity: (MaragonPublicationInput & {
  authorizedForPublicDisplay?: boolean | null;
  am09ProvisionalApprovedInWriting?: boolean | null;
}) | null | undefined): boolean {
  if (!maragonScoresArePublic(entity)) return false;
  if (entity?.authorizedForPublicDisplay !== true) return false;
  return entity?.am09ProvisionalApprovedInWriting === true;
}

/** Dev-server preview only. Production builds drop this to false. */
export function maragonInternalPreview(search?: string): boolean {
  const dev = Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV);
  const query = search ?? (typeof window !== 'undefined' ? window.location.search : '');
  return maragonPreviewFromEnv(dev, query);
}

/** Trajectory labels that may be shown. "Compromised" is never a publishable status. */
export type MaragonTrajectory = 'Ascending' | 'Stagnant' | 'Regressing';

export interface MaragonPublicationInput {
  id?: string | number | null;
  category?: string | null;
  maragonAssessmentStatus?: MaragonAssessmentStatus | null;
  /** Report and show payloads use this name; it is the same gate as maragonAssessmentStatus. */
  assessmentStatus?: MaragonAssessmentStatus | null;
  biographyStatus?: MaragonBiographyStatus | null;
  scoringSuspended?: boolean | null;
  /** Required before a report or a TV-show gauge may show a number. */
  methodologyApproved?: boolean | null;
}

export function notAssessedLabel(lang: MaragonLanguage = 'sq'): string {
  return lang === 'en' ? 'Not assessed' : 'Pa vlerësim';
}

export function isMediaIdentity(id: string | number | null | undefined): boolean {
  return /^vip_m/i.test(String(id ?? '').trim());
}

export function isMediaProfile(profile: MaragonPublicationInput | null | undefined): boolean {
  if (!profile) return false;
  if (isMediaIdentity(profile.id)) return true;
  if ((profile.category || '').toLowerCase().includes('media')) return true;
  if (profile.maragonAssessmentStatus) return true;
  return false;
}

/**
 * An assessment is public only when it is explicitly approved and scoring is not suspended.
 * Every other status, including a missing one, stays unpublished.
 */
export function isMaragonAssessmentPublished(profile: MaragonPublicationInput | null | undefined): boolean {
  if (!profile) return false;
  if (profile.scoringSuspended === true) return false;
  const status = profile.maragonAssessmentStatus ?? profile.assessmentStatus;
  return status === 'approved';
}

/**
 * Numeric report and show gauges. Approval alone is not enough:
 * an approved methodology has to be recorded as well.
 * A dev preview does not unlock these numbers.
 */
export function maragonScoresArePublic(entity: MaragonPublicationInput | null | undefined): boolean {
  if (!isMaragonAssessmentPublished(entity)) return false;
  return entity?.methodologyApproved === true;
}

/**
 * A show's mock gauges stay hidden unless the show itself has an approved
 * methodology, and a linked media host is not itself unpublished.
 */
export function maragonShowScoresArePublic(
  show: MaragonPublicationInput | null | undefined,
  host?: MaragonPublicationInput | null,
): boolean {
  if (host && isMediaProfile(host) && !isMaragonAssessmentPublished(host)) return false;
  return maragonScoresArePublic(show);
}

/** Score used for ordering. Unpublished and unknown values are null, never 0. */
export function rankableMaragonScore(profile: (MaragonPublicationInput & {
  maragonAnalysis?: Array<{ score?: unknown }> | null;
  latestScore?: unknown;
  aletheiaScore?: unknown;
  averageMaragonScore?: unknown;
  processedAnalysis?: { overallScore?: unknown } | null;
}) | null | undefined): number | null {
  if (!isMaragonAssessmentPublished(profile)) return null;
  const average = publishedMaragonAverage(profile);
  if (average !== null) return average;
  const explicit = firstPublishedScore(profile, [
    profile?.latestScore,
    profile?.aletheiaScore,
    profile?.averageMaragonScore,
  ]);
  if (explicit !== null) return explicit;
  return measuredNumber(profile?.processedAnalysis?.overallScore);
}

/**
 * Narrative biography, evidence and qualitative commentary.
 * A local preview may show a draft. Production shows it only after approval.
 * Preview never unlocks numeric scores.
 */
export function isMaragonBiographyPublic(
  profile: MaragonPublicationInput | null | undefined,
  preview = false,
): boolean {
  if (preview) return true;
  return profile?.biographyStatus === 'approved';
}

/** Dev-server preview only. Production builds drop this to false. */
export function maragonPreviewFromEnv(dev: boolean, search: string | null | undefined): boolean {
  if (!dev) return false;
  const params = new URLSearchParams(search?.startsWith('?') ? search.slice(1) : (search || ''));
  return params.get('maragonPreview') === '1';
}

/** A real measured number, including 0. Missing, blank, and non-finite values stay null. */
export function measuredNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return null;
}

/** Published score, or null when the assessment cannot be shown. Does not coerce gaps to 0. */
export function publishedScore(profile: MaragonPublicationInput | null | undefined, value: unknown): number | null {
  if (!isMaragonAssessmentPublished(profile)) return null;
  return measuredNumber(value);
}

/** Mean of finite measurements. An empty set is unknown, not zero. A set of zeros stays zero. */
export function meanMeasured(values: unknown[] | null | undefined): number | null {
  if (!values || values.length === 0) return null;
  const measured: number[] = [];
  for (const value of values) {
    const score = measuredNumber(value);
    if (score !== null) measured.push(score);
  }
  if (measured.length === 0) return null;
  return Math.round(measured.reduce((sum, score) => sum + score, 0) / measured.length);
}

/**
 * The seven Albanian "dimension" strings of the pre-v1.0 mock model (types.ts `MaragonDimension`).
 * Retired as a scoring frame by v1.0 §1.3 (D-06, D-07); their numbers (85/70/80 …) are mock
 * values that v1.0 §3.6 forbids. Entries carrying them are never published, whatever the status.
 */
export const RETIRED_LEGACY_MARAGON_LABELS: readonly string[] = [
  'Pajtueshmëria Etike',
  'Profesionalizmi në Kriza',
  'Saktësia Faktike & Verifikimi',
  'Paanshmëria, Balanca & Anshmëria',
  'Thellësia e Analizës/Pyetjeve',
  'Qartësia & Koherenca',
  'Promovimi i të Menduarit Kritik',
];

/** True when any entry uses a retired seven-label dimension (mock data path). */
export function isRetiredLegacyMaragonAnalysis(entries: Array<{ dimension?: unknown } | null | undefined> | null | undefined): boolean {
  if (!entries || entries.length === 0) return false;
  return entries.some((entry) => typeof entry?.dimension === 'string' && RETIRED_LEGACY_MARAGON_LABELS.includes(entry.dimension));
}

/**
 * Legacy `maragonAnalysis` rows that may be read for display: none unless the assessment is
 * published, and never rows on the retired mock model.
 */
export function publishableMaragonAnalysis<T extends { dimension?: unknown }>(profile: (MaragonPublicationInput & {
  maragonAnalysis?: T[] | null;
}) | null | undefined): T[] {
  if (!isMaragonAssessmentPublished(profile)) return [];
  const entries = profile?.maragonAnalysis ?? [];
  if (isRetiredLegacyMaragonAnalysis(entries)) return [];
  return entries;
}

export function publishedMaragonAverage(profile: (MaragonPublicationInput & {
  maragonAnalysis?: Array<{ score?: unknown; dimension?: unknown }> | null;
}) | null | undefined): number | null {
  if (!isMaragonAssessmentPublished(profile)) return null;
  if (isRetiredLegacyMaragonAnalysis(profile?.maragonAnalysis)) return null;
  return meanMeasured((profile?.maragonAnalysis ?? []).map((entry) => entry?.score));
}

/**
 * Radar series for a published assessment. Unknown slots stay null so they are not drawn as zero.
 * Returns null when nothing may be plotted.
 */
export function publishedSeries(profile: MaragonPublicationInput | null | undefined, values: unknown[] | null | undefined): Array<number | null> | null {
  if (!isMaragonAssessmentPublished(profile) || !values || values.length === 0) return null;
  const series = values.map((value) => measuredNumber(value));
  if (!series.some((value) => value !== null)) return null;
  return series;
}

export function publishedTrajectory(profile: MaragonPublicationInput | null | undefined, status: unknown): MaragonTrajectory | null {
  if (!isMaragonAssessmentPublished(profile)) return null;
  if (status === 'Ascending' || status === 'Stagnant' || status === 'Regressing') return status;
  return null;
}

/** First finite published score in the list. Skips nulls without turning them into 0. */
export function firstPublishedScore(profile: MaragonPublicationInput | null | undefined, values: unknown[]): number | null {
  if (!isMaragonAssessmentPublished(profile)) return null;
  for (const value of values) {
    const score = measuredNumber(value);
    if (score !== null) return score;
  }
  return null;
}
