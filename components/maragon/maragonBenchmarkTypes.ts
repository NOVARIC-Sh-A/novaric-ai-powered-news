/**
 * MARAGON® reference lines for the presenter radar.
 * These are methodology content, not a presenter's score. Values stay null
 * until Dr Alban Gj. THIKA signs an amendment. Kept separate from PARAGON®.
 */
import type { MaragonBandKey, MaragonConfidence } from '../../utils/maragonPublication';

export type MaragonBenchmarkSeriesId = 'albania_expected' | 'europe_industry';

export type MaragonBenchmarkPointStatus =
  | 'not_assessed'
  | 'draft_unapproved'
  | 'approved';

export interface MaragonBenchmarkPoint {
  /** Presenter-slot id, the same id the profile radar uses. Axis C is not a slot. */
  indicatorId: string;
  band: MaragonBandKey | null;
  confidence: MaragonConfidence | null;
  source: string | null;
  citation: string | null;
  status: MaragonBenchmarkPointStatus;
  notes_sq?: string;
  notes_en?: string;
}

export interface MaragonBenchmarkSignOff {
  /** Owner who signed. The data uses `by` for the name on the signed record. */
  by: string;
  /** Tirana time of the signature. */
  dateTirana: string;
  amendmentId: string;
  /** Written or voice-instruction reference, including the signed-record id. */
  reference?: string;
}

export interface MaragonBenchmarkSeries {
  id: MaragonBenchmarkSeriesId;
  label_sq: string;
  label_en: string;
  methodologyId: string;
  amendmentId: string | null;
  ownerSignOff: MaragonBenchmarkSignOff | null;
  status: 'not_assessed' | 'draft_unapproved' | 'approved';
  points: MaragonBenchmarkPoint[];
}
