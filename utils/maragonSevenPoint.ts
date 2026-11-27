/**
 * Projects the seven-point pilot register into the card the page may show.
 * Bands come from the register. Measurements, evidence and raw figures do not.
 * The frame is unsigned. Signed MARAGON® v1.0 still governs.
 */

export const SEVEN_POINT_PILOT_TEMPLATE = {
  templateProfile: true,
  profileId: 'vip_m1',
  frame: 'v2.0',
  signed: false,
  inForce: false,
} as const;

export const SEVEN_POINT_DRAFT_CONFIDENCE = 'DRAFT · besueshmëri e ulët / low confidence';

export const SEVEN_POINT_BANNER =
  'PILOT · DRAFT — Korniza 7-pikëshe v2.0, e pa nënshkruar, jo në fuqi / Seven-point frame v2.0, unsigned, not in force. Pilot result: NO-GO (2/7).';

export const SEVEN_POINT_V1_NOTE = 'Signed MARAGON® v1.0 governs.';

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
  band: '21–40' | '41–60' | null;
  confidence: 'low' | null;
  reason: string | null;
}

export interface SevenPointCard {
  templateProfile: true;
  profileId: 'vip_m1';
  name: 'Blendi FEVZIU';
  frame: 'v2.0';
  signed: false;
  inForce: false;
  governs: 'v1.0';
  decision: 'NO-GO';
  scoredCount: 2;
  of: 7;
  polygon: boolean;
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
  points?: RegisterPoint[];
  scored?: string[];
  notAssessed?: string[];
  result?: { scoredCount?: number; decision?: string };
}

function norm(value: string): string {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[.,]/g, '').replace(/\s+/g, ' ').trim();
}

export function bandMarkerLevel(band: '21–40' | '41–60'): number {
  return band === '21–40' ? 2 : 3;
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
    governs: 'v1.0',
    decision: 'NO-GO',
    scoredCount: 2,
    of: 7,
    polygon: sevenPointPolygonAllowed(points),
    points,
  };
}

/** True when the public card still carries a measurement or a raw score. Band ranges are allowed. */
export function sevenPointCardLeaksMeasurement(payload: unknown): boolean {
  const text = JSON.stringify(payload);
  return /"measurement"|"numericValue"|"pct"|5\.6|36\.0|opinionAsFact/.test(text);
}
