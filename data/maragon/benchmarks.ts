/**
 * MARAGON® benchmark series for the presenter radar.
 * AM-10 (STD-COM-MARAGON-AM10-BENCHMARKS-v1.0-20261123) was signed by
 * Dr Alban Gj. THIKA on 23.11.2026 at 10:56 Tirana (owner voice instruction).
 * The two lines are normative bands. They are not peer averages, not a ranking,
 * and they do not change any presenter's assessment.
 * Axis C is excluded on purpose (D-34): it is not a scored slot.
 * Public text is band names only. Cut-offs stay in the methodology table and are not copied here.
 */
import type { MaragonBandKey } from '../../utils/maragonPublication';
import { MARAGON_BAND_LABELS } from '../../utils/maragonPublication';
import type { MaragonBenchmarkPoint, MaragonBenchmarkSeries, MaragonBenchmarkSignOff } from '../../components/maragon/maragonBenchmarkTypes';

export const MARAGON_BENCHMARK_METHODOLOGY_ID = 'STD-COM-MARAGON-METHODOLOGY-v1.0-20261121';
export const AM10_SIGNED_RECORD_ID = 'STD-COM-MARAGON-AM10-BENCHMARKS-v1.0-20261123';

/**
 * Amendments that carry signed benchmark values.
 * AM-10 is the only signed benchmark amendment.
 */
export const SIGNED_BENCHMARK_AMENDMENT_IDS: readonly string[] = ['AM-10'];

/**
 * Proposed amendments that must not be plotted, even if a caller adds the id to the signed list.
 * AM-10 was removed when it was signed. Any other id is unsigned by omission from the signed list.
 */
export const PROPOSED_UNSIGNED_BENCHMARK_AMENDMENT_IDS: readonly string[] = [];

/** Canonical owner sign-off. `by` / `dateTirana` / `amendmentId` are the existing sign-off fields. */
export const AM10_OWNER_SIGN_OFF: MaragonBenchmarkSignOff = {
  by: 'Dr Alban Gj. THIKA',
  dateTirana: '2026-11-23T10:56:00+01:00',
  amendmentId: 'AM-10',
  reference: 'Owner voice instruction 23.11.2026 10:56 Tirana; STD-COM-MARAGON-AM10-BENCHMARKS-v1.0-20261123',
};

/** Ten presenter slots. Axis C is omitted on purpose (D-34). G3.1-I is stored as maragon:G3.1. */
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

/** Albania line: E fortë on every scored slot. */
const ALBANIA_BANDS: Record<(typeof PRESENTER_SLOTS)[number], MaragonBandKey> = {
  'maragon:R1.1': 'e_forte',
  'maragon:R1.2': 'e_forte',
  'maragon:A2.1': 'e_forte',
  'maragon:A2.2': 'e_forte',
  'maragon:A2.3': 'e_forte',
  'maragon:A2.4': 'e_forte',
  'maragon:G3.1': 'e_forte',
  'maragon:G3.2': 'e_forte',
  'maragon:O4.1': 'e_forte',
  'maragon:O4.2': 'e_forte',
};

/** Europe line: Shumë e fortë on R1.2, A2.1 and G3.1-I; E fortë on the other scored slots. */
const EUROPE_BANDS: Record<(typeof PRESENTER_SLOTS)[number], MaragonBandKey> = {
  'maragon:R1.1': 'e_forte',
  'maragon:R1.2': 'shume_e_forte',
  'maragon:A2.1': 'shume_e_forte',
  'maragon:A2.2': 'e_forte',
  'maragon:A2.3': 'e_forte',
  'maragon:A2.4': 'e_forte',
  'maragon:G3.1': 'shume_e_forte',
  'maragon:G3.2': 'e_forte',
  'maragon:O4.1': 'e_forte',
  'maragon:O4.2': 'e_forte',
};

function signedPoint(indicatorId: (typeof PRESENTER_SLOTS)[number], band: MaragonBandKey): MaragonBenchmarkPoint {
  return {
    indicatorId,
    band,
    confidence: null,
    source: AM10_SIGNED_RECORD_ID,
    citation: AM10_OWNER_SIGN_OFF.reference ?? null,
    status: 'approved',
  };
}

function series(
  id: MaragonBenchmarkSeries['id'],
  label_sq: string,
  label_en: string,
  bands: Record<(typeof PRESENTER_SLOTS)[number], MaragonBandKey>,
): MaragonBenchmarkSeries {
  return {
    id,
    label_sq,
    label_en,
    methodologyId: MARAGON_BENCHMARK_METHODOLOGY_ID,
    amendmentId: 'AM-10',
    ownerSignOff: { ...AM10_OWNER_SIGN_OFF },
    status: 'approved',
    points: PRESENTER_SLOTS.map((indicatorId) => signedPoint(indicatorId, bands[indicatorId])),
  };
}

export const MARAGON_BENCHMARKS: MaragonBenchmarkSeries[] = [
  series(
    'albania_expected',
    'Standardi i pritur në Shqipëri',
    'Expected standard in Albania',
    ALBANIA_BANDS,
  ),
  series(
    'europe_industry',
    'Standardi i industrisë europiane/ndërkombëtare',
    'European/international industry standard',
    EUROPE_BANDS,
  ),
];

/** Legend order: presenter, Albania, Europe. Albanian is always written first. */
export const MARAGON_RADAR_LEGEND = {
  presenter: {
    sq: 'Vlerësimi i prezantuesit',
    en: "Presenter's assessment",
  },
  albania_expected: {
    sq: 'Standardi i pritur në Shqipëri',
    en: 'Expected standard in Albania',
  },
  europe_industry: {
    sq: 'Standardi i industrisë europiane/ndërkombëtare',
    en: 'European/international industry standard',
  },
} as const;

/** Shown for a benchmark slot that has no approved band. A null is never drawn as zero. */
export const MARAGON_BENCHMARK_AWAITING_NOTE = {
  sq: 'Pa vlerësim / Not assessed',
  en: 'Pa vlerësim / Not assessed',
} as const;

function signOffAllows(seriesRecord: MaragonBenchmarkSeries, amendment: string): boolean {
  const sign = seriesRecord.ownerSignOff;
  if (!sign || sign.amendmentId !== amendment) return false;
  if (amendment !== 'AM-10') return true;
  return sign.by === AM10_OWNER_SIGN_OFF.by
    && sign.dateTirana === AM10_OWNER_SIGN_OFF.dateTirana
    && sign.amendmentId === AM10_OWNER_SIGN_OFF.amendmentId
    && sign.reference === AM10_OWNER_SIGN_OFF.reference;
}

/**
 * A benchmark point is drawn only after the series is approved, the owner has
 * signed, and this point itself is an approved non-null band. Drafts stay hidden.
 * Axis C is never a benchmark slot.
 */
export function isPlottableBenchmarkPoint(
  seriesRecord: MaragonBenchmarkSeries | undefined,
  point: MaragonBenchmarkPoint | undefined,
  signedAmendmentIds: readonly string[] = SIGNED_BENCHMARK_AMENDMENT_IDS,
): boolean {
  if (!seriesRecord || !point) return false;
  if (point.indicatorId === 'maragon:C' || point.indicatorId === 'C') return false;
  if (seriesRecord.status !== 'approved' || !seriesRecord.ownerSignOff) return false;
  const amendment = seriesRecord.amendmentId;
  if (!amendment || !signedAmendmentIds.includes(amendment)) return false;
  if (PROPOSED_UNSIGNED_BENCHMARK_AMENDMENT_IDS.includes(amendment)) return false;
  if (!signOffAllows(seriesRecord, amendment)) return false;
  if (seriesRecord.methodologyId !== MARAGON_BENCHMARK_METHODOLOGY_ID) return false;
  if (point.status !== 'approved' || point.band == null) return false;
  return true;
}

export interface PublicBenchmarkLine {
  id: MaragonBenchmarkSeries['id'];
  /** Albanian first, then English, with no cut-off. */
  label: string;
  points: Array<{ indicatorId: string; band: string }>;
}

/** Number-free view for legends, share text and exports. Null bands read as not assessed. */
export function publicBenchmarkLines(
  seriesList: readonly MaragonBenchmarkSeries[] = MARAGON_BENCHMARKS,
  signedAmendmentIds: readonly string[] = SIGNED_BENCHMARK_AMENDMENT_IDS,
): PublicBenchmarkLine[] {
  return seriesList.map((item) => ({
    id: item.id,
    label: `${item.label_sq} / ${item.label_en}`,
    points: item.points
      .filter((point) => point.indicatorId !== 'maragon:C' && point.indicatorId !== 'C')
      .map((point) => ({
        indicatorId: point.indicatorId,
        band: isPlottableBenchmarkPoint(item, point, signedAmendmentIds) && point.band
          ? `${MARAGON_BAND_LABELS[point.band].sq} / ${MARAGON_BAND_LABELS[point.band].en}`
          : MARAGON_BENCHMARK_AWAITING_NOTE.sq,
      })),
  }));
}
