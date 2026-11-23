/**
 * MARAGON® public-display decisions for one presenter indicator: official path and provisional
 * (AM-09) path, kept as two separate fail-closed functions.
 * Basis: STD-COM-MARAGON-METHODOLOGY-v1.0-20261121 §6.5, §7, §10, §11.1, §12.1, §15.3, §17
 * (D-21, D-28, D-29, D-30) and signed AM-09. Every missing or unknown input closes the gate.
 * A provisional composite or dimension value is never public. Numbers are never public.
 */
import { isExtremeBand, type MaragonAssessmentStatus, type MaragonBandKey, type MaragonConfidence } from './maragonPublication';

/** Methodology versions with a recorded signature. v1.1 / v2.0 drafts are not listed until signed. */
export const SIGNED_MARAGON_METHODOLOGY_IDS: readonly string[] = ['STD-COM-MARAGON-METHODOLOGY-v1.0-20261121'];

export interface MaragonReleaseAuthorization {
  /** Methodology the release was authorised under (§15.3 named version). */
  methodologyId: string;
  authorisedBy: string;
  /** Tirana time, labelled. */
  authorisedAt: string;
  /** Written approval reference (chat card, signed form). Drafting is never an approval. */
  reference: string;
}

export interface DisplayGateRecord {
  methodology: string;
  methodologyApproved: boolean;
  assessmentStatus: MaragonAssessmentStatus;
  authorizedForPublicDisplay: boolean;
  am09ProvisionalApprovedInWriting: boolean;
  scoringSuspended: boolean;
  rightOfReply: 'not_offered' | 'offered' | 'completed';
  releaseAuthorization?: MaragonReleaseAuthorization | null;
}

export interface DisplayGateIndicator {
  status: string;
  officialBand: MaragonBandKey | null;
  indicativeBand: MaragonBandKey | null;
  confidence: MaragonConfidence;
}

export interface GateDecision {
  open: boolean;
  reasons: string[];
}

function common(rec: DisplayGateRecord, reasons: string[]): void {
  if (rec.assessmentStatus === 'withheld' || rec.assessmentStatus === 'suspended') reasons.push(`assessment ${rec.assessmentStatus}`);
  if (rec.scoringSuspended !== false) reasons.push('scoring suspended or unknown');
  if (rec.authorizedForPublicDisplay !== true) reasons.push('public display not authorised for this profile');
  if (rec.methodologyApproved !== true) reasons.push('methodologyApproved is not true');
  if (!SIGNED_MARAGON_METHODOLOGY_IDS.includes(rec.methodology)) reasons.push(`methodology ${rec.methodology || '(none)'} has no recorded signature`);
  if (rec.rightOfReply !== 'completed') reasons.push('right of reply not completed (§12.1, §17)');
  const release = rec.releaseAuthorization;
  if (!release || !release.reference || !release.authorisedBy) reasons.push('no written release authorisation (D-30)');
  else if (release.methodologyId !== rec.methodology) reasons.push('release authorised under a different methodology version (§15.3)');
}

/** Official band: approved assessment, medium/high confidence, high for the extreme bands. */
export function officialIndicatorDecision(rec: DisplayGateRecord, ind: DisplayGateIndicator | undefined): GateDecision {
  const reasons: string[] = [];
  if (!ind) return { open: false, reasons: ['no indicator'] };
  if (ind.status !== 'assessed') reasons.push(`indicator status ${ind.status}`);
  if (!ind.officialBand) reasons.push('no official band');
  if (ind.confidence !== 'medium' && ind.confidence !== 'high') reasons.push('confidence below medium (§6.5)');
  if (isExtremeBand(ind.officialBand) && ind.confidence !== 'high') reasons.push('extreme band needs high confidence (§6.3)');
  if (rec.assessmentStatus !== 'approved') reasons.push('assessment not approved');
  common(rec, reasons);
  return { open: reasons.length === 0, reasons };
}

/**
 * Provisional band (AM-09): written approval of this specific profile, the AM-09 label, no numbers,
 * confidence shown. This implementation also keeps the pre-existing requirement that the assessment
 * is approved under a signed methodology (fail-closed reading; owner decision UD-04 pending).
 */
export function provisionalIndicatorDecision(rec: DisplayGateRecord, ind: DisplayGateIndicator | undefined): GateDecision {
  const reasons: string[] = [];
  if (!ind) return { open: false, reasons: ['no indicator'] };
  if (!ind.indicativeBand) reasons.push('no indicative band');
  if (ind.status === 'not_applicable') reasons.push('indicator not applicable');
  if (rec.am09ProvisionalApprovedInWriting !== true) reasons.push('no written AM-09 approval for this profile');
  if (rec.assessmentStatus !== 'approved') reasons.push('assessment not approved (current fail-closed reading, UD-04)');
  common(rec, reasons);
  return { open: reasons.length === 0, reasons };
}

/** Composite and dimension values are never shown provisionally (AM-09). */
export function provisionalAggregateDecision(): GateDecision {
  return { open: false, reasons: ['a provisional composite or dimension value is never public (AM-09)'] };
}
