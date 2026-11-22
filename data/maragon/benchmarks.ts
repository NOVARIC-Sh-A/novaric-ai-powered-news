/**
 * MARAGON® benchmark series for the presenter radar.
 * Shipped 22 Nov 2026 with every band null. No documented, owner-signed
 * values exist. A note is not a band and is never plotted.
 * Do not fill these from retired mock averages or any other invented number.
 */
import type { MaragonBenchmarkPoint, MaragonBenchmarkSeries } from '../../components/maragon/maragonBenchmarkTypes';

export const MARAGON_BENCHMARK_METHODOLOGY_ID = 'STD-COM-MARAGON-METHODOLOGY-v1.0-20261121';

/**
 * Amendments that carry signed benchmark values. Empty: no benchmark amendment is signed.
 * AM-10 (STD-COM-MARAGON-AM10-BENCHMARKS-v0.1-20261122) is an UNSIGNED proposal and is listed
 * below so that it can never be plotted by setting a status field alone.
 */
export const SIGNED_BENCHMARK_AMENDMENT_IDS: readonly string[] = [];
export const PROPOSED_UNSIGNED_BENCHMARK_AMENDMENT_IDS: readonly string[] = ['AM-10'];

const AWAITING_SQ = 'Nuk ka vlerë të dokumentuar. Pret një ndryshim të nënshkruar të metodologjisë.';
const AWAITING_EN = 'No documented value. Awaits a signed methodology amendment.';

/** Ten presenter slots. Axis C is omitted on purpose (D-34). */
const PRESENTER_SLOTS = [
  'maragon:R1.1',
  'maragon:R1.2',
  'maragon:A2.1',
  'maragon:A2.2',
  'maragon:A2.3',
  'maragon:A2.4',
  'maragon:G3.1',
  'maragon:G3.2',
  'maragon:O4.1',
  'maragon:O4.2',
] as const;

function nullPoint(indicatorId: string): MaragonBenchmarkPoint {
  return {
    indicatorId,
    band: null,
    confidence: null,
    source: null,
    citation: null,
    status: 'not_assessed',
    notes_sq: AWAITING_SQ,
    notes_en: AWAITING_EN,
  };
}

function series(
  id: MaragonBenchmarkSeries['id'],
  label_sq: string,
  label_en: string,
): MaragonBenchmarkSeries {
  return {
    id,
    label_sq,
    label_en,
    methodologyId: MARAGON_BENCHMARK_METHODOLOGY_ID,
    amendmentId: null,
    ownerSignOff: null,
    status: 'not_assessed',
    points: PRESENTER_SLOTS.map(nullPoint),
  };
}

export const MARAGON_BENCHMARKS: MaragonBenchmarkSeries[] = [
  series(
    'albania_expected',
    'Standard i pritur në Shqipëri',
    'Expected standard in Albania',
  ),
  series(
    'europe_industry',
    'Standard i industrisë evropiane / ndërkombëtare',
    'European / international industry standard',
  ),
];

/** Legend order: presenter, Albania, Europe. Albanian is always written first. */
export const MARAGON_RADAR_LEGEND = {
  presenter: {
    sq: 'Vlerësimi i prezantuesit',
    en: "Presenter's assessment",
  },
  albania_expected: {
    sq: 'Standard i pritur në Shqipëri',
    en: 'Expected standard in Albania',
  },
  europe_industry: {
    sq: 'Standard i industrisë evropiane / ndërkombëtare',
    en: 'European / international industry standard',
  },
} as const;

export const MARAGON_BENCHMARK_AWAITING_NOTE = {
  sq: 'Pa vlerësim / Not assessed. Vlerat presin një ndryshim të nënshkruar të metodologjisë.',
  en: 'Pa vlerësim / Not assessed. The values await a signed methodology amendment.',
} as const;

/**
 * A benchmark point is drawn only after the series is approved, the owner has
 * signed, and this point itself is an approved non-null band. Drafts stay hidden.
 */
export function isPlottableBenchmarkPoint(
  seriesRecord: MaragonBenchmarkSeries | undefined,
  point: MaragonBenchmarkPoint | undefined,
  signedAmendmentIds: readonly string[] = SIGNED_BENCHMARK_AMENDMENT_IDS,
): boolean {
  if (!seriesRecord || !point) return false;
  if (seriesRecord.status !== 'approved' || !seriesRecord.ownerSignOff) return false;
  const amendment = seriesRecord.amendmentId;
  if (!amendment || !signedAmendmentIds.includes(amendment)) return false;
  if (PROPOSED_UNSIGNED_BENCHMARK_AMENDMENT_IDS.includes(amendment)) return false;
  if (seriesRecord.ownerSignOff.amendmentId !== amendment) return false;
  if (seriesRecord.methodologyId !== MARAGON_BENCHMARK_METHODOLOGY_ID) return false;
  if (point.status !== 'approved' || point.band == null) return false;
  return true;
}
