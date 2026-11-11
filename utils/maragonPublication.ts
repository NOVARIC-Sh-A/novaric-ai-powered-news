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

/** Trajectory labels that may be shown. "Compromised" is never a publishable status. */
export type MaragonTrajectory = 'Ascending' | 'Stagnant' | 'Regressing';

export interface MaragonPublicationInput {
  id?: string | number | null;
  category?: string | null;
  maragonAssessmentStatus?: MaragonAssessmentStatus | null;
  biographyStatus?: MaragonBiographyStatus | null;
  scoringSuspended?: boolean | null;
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
  return profile.maragonAssessmentStatus === 'approved';
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

export function publishedMaragonAverage(profile: (MaragonPublicationInput & {
  maragonAnalysis?: Array<{ score?: unknown }> | null;
}) | null | undefined): number | null {
  if (!isMaragonAssessmentPublished(profile)) return null;
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
