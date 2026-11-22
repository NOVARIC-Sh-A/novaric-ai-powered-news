/**
 * MARAGON® contextual notices — Draft for legal and editorial review (v0.1, 22.11.2026).
 *
 * Each notice describes one actual display state. The state is derived from what the page
 * really renders; a notice never unlocks, upgrades or relabels a value. In particular:
 * - no notice authorises a provisional composite (AM-09: never shown publicly);
 * - no notice makes mock or retired data publishable;
 * - the internal-numbers notice exists only for the dev/internal view, because public output
 *   never shows numbers (v1.0 §10).
 */
import { MARAGON_NOTICE_PATH, type NoticeLang } from './maragonNoticeContent';

export type MaragonContextNoticeId =
  | 'official_band'
  | 'internal_numbers'
  | 'not_assessed'
  | 'provisional_band'
  | 'benchmarks_absent'
  | 'benchmark_normative'
  | 'revised'
  | 'under_review';

export interface MaragonContextNotice {
  id: MaragonContextNoticeId;
  text: Record<NoticeLang, string>;
  /** Link label to the full notice page. */
  more: Record<NoticeLang, string>;
  href: string;
}

const MORE = { sq: 'Njoftimi i plotë', en: 'Full notice' };

const TEXT: Record<MaragonContextNoticeId, Record<NoticeLang, string>> = {
  official_band: {
    sq: 'Brez zyrtar MARAGON® sipas metodologjisë v1.0, i vendosur nga Dr Alban Gj. THIKA mbi provat e listuara. Është gjykim analitik për sjelljen profesionale të vëzhguar në kampion, jo vendim gjyqësor ose rregullator dhe jo diagnozë. Pika e saktë nuk publikohet.',
    en: 'Official MARAGON® band under methodology v1.0, decided by Dr Alban Gj. THIKA on the evidence listed. It is an analytical judgment about the professional conduct observed in the sample, not a judicial or regulatory decision and not a diagnosis. The exact point is not published.',
  },
  internal_numbers: {
    sq: 'Pamje e brendshme. Numrat janë vetëm për shqyrtim dhe nuk publikohen. Publiku sheh vetëm breza dhe besueshmëri.',
    en: 'Internal view. Numbers are for review only and are not published. The public sees bands and confidence only.',
  },
  not_assessed: {
    sq: 'Pa vlerësim: nuk ka vlerë të miratuar dhe të publikuar. Nuk do të thotë zero dhe nuk është gjetje as negative, as pozitive.',
    en: 'Not assessed: there is no approved, published value. It does not mean zero and it is neither a negative nor a positive finding.',
  },
  provisional_band: {
    sq: 'PROVIZOR — në pritje të miratimit. Brez indikativ pa numra, me nivelin e besueshmërisë, i shfaqur me miratimin me shkrim të pronarit për këtë profil. Nuk është vlerësim zyrtar. Vlerësimi i përgjithshëm provizor nuk shfaqet.',
    en: 'PROVISIONAL — pending sign-off. An indicative band without numbers, with its confidence level, shown with the owner\'s written approval for this profile. It is not an official assessment. No provisional overall assessment is shown.',
  },
  benchmarks_absent: {
    sq: 'Nuk vizatohet asnjë vijë krahasuese: vlerat e standardeve nuk janë miratuar. Një vijë që mungon nuk do të thotë zero.',
    en: 'No comparison line is drawn: no benchmark values have been approved. A missing line does not mean zero.',
  },
  benchmark_normative: {
    sq: 'Vija krahasuese tregon një standard normativ, pra çfarë pritet nga një kod profesional. Nuk është mesatarja e prezantuesve të vëzhguar dhe nuk është renditje.',
    en: 'The comparison line shows a normative benchmark, that is, what a professional code expects. It is not the average of observed presenters and it is not a ranking.',
  },
  revised: {
    sq: 'Ky profil është ndryshuar pas publikimit të parë. Data dhe përmbledhja e ndryshimit shënohen në historikun e profilit; versioni i mëparshëm ruhet.',
    en: 'This profile has been changed since it was first published. The date and a summary of the change are recorded in the profile history; the earlier version is kept.',
  },
  under_review: {
    sq: 'Në rishqyrtim: ka ndodhur një ngjarje materiale ose është marrë një kërkesë për shqyrtim. Profili mund të ndryshojë.',
    en: 'Under review: a material event has occurred or a review request has been received. The profile may change.',
  },
};

export function contextNotice(id: MaragonContextNoticeId): MaragonContextNotice {
  return { id, text: TEXT[id], more: MORE, href: MARAGON_NOTICE_PATH };
}

export const MARAGON_CONTEXT_NOTICE_IDS = Object.keys(TEXT) as MaragonContextNoticeId[];

/** What the assessment area really shows. Built from the rendered values, not from flags alone. */
export interface MaragonDisplayState {
  mode: 'public' | 'internal';
  /** Number of indicator or dimension slots that show an official band. */
  officialBands: number;
  /** Number of slots that show a PROVISIONAL band (AM-09). */
  provisionalBands: number;
  /** Number of benchmark vertices actually drawn on the chart. */
  benchmarkVerticesDrawn: number;
  /** True only when the drawn benchmark series is a signed normative benchmark. */
  benchmarkIsNormative?: boolean;
  /** Numbers are visible (internal view only). */
  numbersVisible?: boolean;
  revisedAfterPublication?: boolean;
  underReview?: boolean;
}

/**
 * Notices for the assessment area, in display order. Pure function; no side effects.
 * An empty or unknown state falls back to "not assessed" (fail-closed).
 */
export function noticesForDisplay(state: MaragonDisplayState): MaragonContextNoticeId[] {
  const ids: MaragonContextNoticeId[] = [];
  if (state.underReview) ids.push('under_review');
  if (state.revisedAfterPublication) ids.push('revised');
  if (state.numbersVisible && state.mode === 'internal') ids.push('internal_numbers');
  if (state.officialBands > 0) ids.push('official_band');
  if (state.provisionalBands > 0) ids.push('provisional_band');
  if (state.officialBands === 0 && state.provisionalBands === 0) ids.push('not_assessed');
  if (state.benchmarkVerticesDrawn > 0) {
    if (state.benchmarkIsNormative) ids.push('benchmark_normative');
  } else {
    ids.push('benchmarks_absent');
  }
  return ids;
}

export type MaragonDisplayProblem =
  | 'numbers_in_public_view'
  | 'benchmark_without_signed_normative_source'
  | 'negative_count';

/**
 * States that must never be rendered. A notice cannot make them acceptable; the page must
 * change what it displays instead. Used by tests and shown as a warning in the internal view.
 */
export function displayStateProblems(state: MaragonDisplayState): MaragonDisplayProblem[] {
  const problems: MaragonDisplayProblem[] = [];
  if (state.numbersVisible && state.mode === 'public') problems.push('numbers_in_public_view');
  if (state.benchmarkVerticesDrawn > 0 && !state.benchmarkIsNormative) problems.push('benchmark_without_signed_normative_source');
  if (state.officialBands < 0 || state.provisionalBands < 0 || state.benchmarkVerticesDrawn < 0) problems.push('negative_count');
  return problems;
}
