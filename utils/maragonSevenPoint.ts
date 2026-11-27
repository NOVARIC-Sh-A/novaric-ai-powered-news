/**
 * Projects the seven-point pilot register into the card the page may show.
 * Bands come from the register. Measurements, evidence and raw figures do not.
 * Signed MARAGON® v2.0 (27.11.2026 22:51, MARAGON-V2.0-APR-20261127-2238) is the frame.
 * The ten v1.0 indicators stay in their files and are not scores.
 */
import { mediaProfilesData } from '../data/mediaProfiles';
import pilotCard from '../data/maragon/pilots/seven-point-fevziu-20261127/public.card.json';

export const SEVEN_POINT_PILOT_TEMPLATE = {
  templateProfile: true,
  profileId: 'vip_m1',
  frame: 'v2.0',
  signed: true,
  inForce: true,
} as const;

export const SEVEN_POINT_DRAFT_CONFIDENCE = 'DRAFT · besueshmëri e ulët / low confidence';

export const SEVEN_POINT_BANNER =
  'PILOT · DRAFT — Korniza 7-pikëshe v2.0, e nënshkruar 27.11.2026 22:51 (MARAGON-V2.0-APR-20261127-2238). Vlerat e pilotit mbeten DRAFT. / Seven-point frame v2.0, signed 27.11.2026 22:51. Pilot values stay DRAFT. Pilot result: NO-GO (2/7).';

export const SEVEN_POINT_V1_NOTE = 'Signed MARAGON® v2.0 governs. The ten v1.0 indicators are reference only, not scores.';

/** OD-S13 / §6.2 step 4: P2 and P6 stay out of the overall for 24 hours after the first score. */
export const P2_P6_CALIBRATION_MS = 24 * 60 * 60 * 1000;

/** OD-S11. */
export const SEVEN_POINT_EVIDENCE_MONTHS = 18;

export const SEVEN_POINT_CORE = ['P1', 'P3', 'P4', 'P5', 'P7'] as const;

export type SevenPointBand = '0–20' | '21–40' | '41–60' | '61–80' | '81–100';

const DISPLAY: Record<string, { sq: string; en: string }> = {
  P1: { sq: 'Pajtueshmëria Etike', en: 'Ethical Compliance' },
  P2: { sq: 'Profesionalizmi në Kriza', en: 'Professionalism in Crises' },
  P3: { sq: 'Saktësia Faktike & Verifikimi', en: 'Factual Accuracy & Verification' },
  P4: { sq: 'Paanshmëria, Balanca & Anshmëria', en: 'Impartiality, Balance & Bias' },
  P5: { sq: 'Thellësia e Analizës/Pyetjeve', en: 'Depth of Analysis & Questioning' },
  P6: { sq: 'Qartësia & Koherenca', en: 'Clarity & Coherence' },
  P7: { sq: 'Promovimi i të Menduarit Kritik', en: 'Promoting Critical Thinking' },
};

/** Owner's 22:40 display lines for the register reasons. Not scores. */
const NOT_ASSESSED_REASON: Record<string, string> = {
  P2: 'no calibrated scale yet.',
  P3: 'claim-check log not built.',
  P4: 'too few questions with an identifiable political side (18 of 150 needed).',
  P5: 'background accuracy not checked; result on the cut-off.',
  P6: 'no calibrated scale yet; auto-captions cannot separate speech errors from transcription errors.',
};

const ORDER = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'] as const;

export interface SevenPointView {
  code: string;
  labelSq: string;
  labelEn: string;
  status: 'scored' | 'not_assessed';
  band: SevenPointBand | null;
  confidence: 'low' | null;
  reason: string | null;
}

export interface SevenPointCard {
  templateProfile: true;
  profileId: 'vip_m1';
  name: 'Blendi FEVZIU';
  frame: 'v2.0';
  signed: true;
  inForce: true;
  governs: 'v2.0';
  decision: 'NO-GO';
  scoredCount: 2;
  of: 7;
  polygon: boolean;
  /** When this profile's first seven-point score was generated. Null if none. Tirana offset. */
  firstScoreAt: string | null;
  points: SevenPointView[];
}

interface RegisterPoint {
  point: string;
  label: string;
  status: string;
  band: string;
  numericValue: number | null;
  confidence: string | null;
}

interface RegisterFile {
  subject?: { id?: string; name?: string };
  createdTirana?: string;
  points?: RegisterPoint[];
  scored?: string[];
  notAssessed?: string[];
  result?: { scoredCount?: number; decision?: string };
}

function firstScoreIso(createdTirana: string | undefined): string {
  const match = createdTirana?.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/);
  if (!match) throw new Error('Pilot register has no Tirana time for the first score.');
  return `${match[1]}T${match[2]}:00+01:00`;
}

function norm(value: string): string {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[.,]/g, '').replace(/\s+/g, ' ').trim();
}

const BAND_LEVEL: Record<SevenPointBand, number> = {
  '0–20': 1,
  '21–40': 2,
  '41–60': 3,
  '61–80': 4,
  '81–100': 5,
};

export function bandMarkerLevel(band: SevenPointBand): number {
  return BAND_LEVEL[band];
}

/** Internal only. The page shows the band this returns, never the mean. */
function bandMidpoint(band: SevenPointBand): number {
  return (BAND_LEVEL[band] - 1) * 20 + 10;
}

export function calibrationElapsed(firstScoreAt: string | null, now: Date): boolean {
  if (!firstScoreAt) return false;
  return now.getTime() - Date.parse(firstScoreAt) >= P2_P6_CALIBRATION_MS;
}

/**
 * OD-S10. During the 24-hour calibration the overall is the mean of P1, P3, P4, P5 and P7.
 * After it, the mean is all seven. A missing point leaves the overall unassessed.
 * The returned value is a band, not a number.
 */
export function overallSevenPointBand(points: SevenPointView[], firstScoreAt: string | null, now: Date): SevenPointBand | null {
  const codes = calibrationElapsed(firstScoreAt, now) ? ORDER : SEVEN_POINT_CORE;
  const chosen = codes.map((code) => points.find((point) => point.code === code));
  if (chosen.some((point) => !point?.band)) return null;
  const mean = chosen.reduce((sum, point) => sum + bandMidpoint(point!.band!), 0) / chosen.length;
  if (mean <= 20) return '0–20';
  if (mean <= 40) return '21–40';
  if (mean <= 60) return '41–60';
  if (mean <= 80) return '61–80';
  return '81–100';
}

export function sevenPointPolygonAllowed(points: { status: string }[]): boolean {
  return points.filter((point) => point.status === 'scored').length >= 3;
}

export function projectSevenPointCard(raw: RegisterFile): SevenPointCard {
  if (raw.subject?.id !== 'vip_m1' || raw.subject?.name !== 'Blendi FEVZIU') {
    throw new Error('Seven-point pilot register is not the Blendi FEVZIU template.');
  }
  if (raw.result?.decision !== 'NO-GO' || raw.result?.scoredCount !== 2) {
    throw new Error('Seven-point pilot result is not NO-GO with 2 scored points.');
  }
  const byCode = new Map((raw.points ?? []).map((point) => [point.point, point]));
  const points: SevenPointView[] = ORDER.map((code) => {
    const source = byCode.get(code);
    const labels = DISPLAY[code];
    if (!source || !labels) throw new Error(`Missing seven-point row ${code}.`);
    const [sq, en] = source.label.split(' / ');
    if (!sq || !en || norm(sq) !== norm(labels.sq) || norm(en) !== norm(labels.en)) {
      throw new Error(`Register label for ${code} does not match the card wording.`);
    }
    if (source.numericValue != null) throw new Error(`${code} has a numeric value; the card shows bands only.`);
    if (source.status === 'scored') {
      if (source.band !== '41–60' && source.band !== '21–40') throw new Error(`${code} band is not a display band.`);
      if (source.confidence !== 'low') throw new Error(`${code} is not low confidence.`);
      return { code, labelSq: labels.sq, labelEn: labels.en, status: 'scored', band: source.band, confidence: 'low', reason: null };
    }
    if (source.status !== 'not_assessed') throw new Error(`${code} has an unknown status.`);
    const reason = NOT_ASSESSED_REASON[code];
    if (!reason) throw new Error(`${code} is unscored without a display reason.`);
    return { code, labelSq: labels.sq, labelEn: labels.en, status: 'not_assessed', band: null, confidence: null, reason };
  });
  const scored = points.filter((point) => point.status === 'scored').map((point) => point.code);
  if (scored.join(',') !== 'P1,P7') throw new Error('Only P1 and P7 may be scored on this pilot card.');
  if ((raw.scored ?? []).join(',') !== 'P1,P7') throw new Error('Register scored list is not P1, P7.');
  if ((raw.notAssessed ?? []).join(',') !== 'P2,P3,P4,P5,P6') throw new Error('Register not-assessed list changed.');
  return {
    ...SEVEN_POINT_PILOT_TEMPLATE,
    name: 'Blendi FEVZIU',
    governs: 'v2.0',
    decision: 'NO-GO',
    scoredCount: 2,
    of: 7,
    polygon: sevenPointPolygonAllowed(points),
    firstScoreAt: firstScoreIso(raw.createdTirana),
    points,
  };
}

const pilot = pilotCard as SevenPointCard;

export function blankSevenPoints(): SevenPointView[] {
  return ORDER.map((code) => ({
    code,
    labelSq: DISPLAY[code].sq,
    labelEn: DISPLAY[code].en,
    status: 'not_assessed' as const,
    band: null,
    confidence: null,
    reason: null,
  }));
}

export interface SevenPointFrameView {
  profileId: string;
  template: boolean;
  points: SevenPointView[];
  polygon: boolean;
  firstScoreAt: string | null;
  /** True only while the 24-hour P2/P6 cap is still running. */
  calibrationOpen: boolean;
  /** OD-S13: after the cap, a scored P2 or P6 carries the DRAFT/provisional label. */
  p2p6Provisional: boolean;
  overallBand: SevenPointBand | null;
  evidenceMonths: typeof SEVEN_POINT_EVIDENCE_MONTHS;
}

/** T4 records. Every profile starts null. Only the FEVZIU pilot template keeps its two DRAFT bands. */
export function sevenPointFrame(profileId: string, now: Date = new Date()): SevenPointFrameView {
  const template = profileId === pilot.profileId;
  const points = template ? pilot.points : blankSevenPoints();
  const firstScoreAt = template ? pilot.firstScoreAt : null;
  const elapsed = calibrationElapsed(firstScoreAt, now);
  return {
    profileId,
    template,
    points,
    polygon: sevenPointPolygonAllowed(points),
    firstScoreAt,
    calibrationOpen: Boolean(firstScoreAt) && !elapsed,
    p2p6Provisional: elapsed,
    overallBand: overallSevenPointBand(points, firstScoreAt, now),
    evidenceMonths: SEVEN_POINT_EVIDENCE_MONTHS,
  };
}

export function sevenPointProfileIds(): string[] {
  return mediaProfilesData.map((profile) => String(profile.id));
}

/** True when the public card still carries a measurement or a raw score. Band ranges are allowed. */
export function sevenPointCardLeaksMeasurement(payload: unknown): boolean {
  const text = JSON.stringify(payload);
  return /"measurement"|"numericValue"|"pct"|5\.6|36\.0|opinionAsFact/.test(text);
}
