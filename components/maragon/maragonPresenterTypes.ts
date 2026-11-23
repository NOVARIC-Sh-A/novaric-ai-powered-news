/**
 * MARAGON® v1.0 — individual TV presenter record (cover + deeper profile page).
 * Kept separate from PARAGON®. No numeric score fields exist on purpose:
 * official bands are null until the owner approves the profile; indicative bands
 * are low-confidence drafts that may only be shown with the PROVIZOR label (AM-09).
 */
import type { MaragonAssessmentStatus, MaragonBiographyStatus, MaragonBandKey, MaragonConfidence } from '../../utils/maragonPublication';

export type MaragonPillar = 'R' | 'A' | 'G' | 'O';

export type MaragonIndicatorStatus =
  | 'not_assessed'
  | 'insufficient_evidence'
  | 'not_applicable'
  | 'assessed'
  | 'assessed-qualitative';

export interface MaragonPresenterIndicator {
  id: string;            // maragon:R1.1 …
  code: string;          // R1.1, ind:A2.2 …
  pillar: MaragonPillar;
  appliedVariant?: string;
  title_sq: string;
  title_en: string;
  status: MaragonIndicatorStatus;
  /** Official band. null = "Pa vlerësim". Never filled from a low-confidence draft. */
  officialBand: MaragonBandKey | null;
  /** Low-confidence draft band (same value as provisional.band). Public only under AM-09 with the PROVIZOR label. */
  indicativeBand: MaragonBandKey | null;
  /** Full provisional record: band, PROVIZOR label, confidence, citations, reason it is not official. */
  provisional: MaragonProvisionalBand;
  confidence: MaragonConfidence;
  evidenceCount: number;
  finding_sq: string;
  finding_en: string;
  pathToOfficial_sq: string;
  pathToOfficial_en: string;
  flags: string[];
}

export interface MaragonSourceRef {
  id: string;
  label: string;
  publisher: string;
  url: string;
  accessed: string;   // ISO date, Tirana
  usedFor: string;
}

export interface MaragonPhotoCandidate {
  url: string;
  host: string;
  provenance: string;
  licence: string;
  credit: string;
  reuseBasisDocumented: boolean;
  resolves: boolean;
  checkedAt: string;
  note?: string;
}


/** Provisional (indicative) band: never copied into officialBand. Public only after AM-09 written approval. */
export interface MaragonProvisionalBand {
  band: MaragonBandKey | null;
  /** Fixed AM-09 token. The review-view label is reviewLabel_*. */
  label: 'PROVIZOR';
  reviewLabel_sq: 'PROVIZOR · në shqyrtim';
  reviewLabel_en: 'PROVISIONAL · under review';
  confidence: MaragonConfidence;
  evidenceIds: string[];
  notOfficialReason_sq: string;
  notOfficialReason_en: string;
}

export interface MaragonMethodologyNotes {
  methodologyId: string;
  signedAt: string;          // Tirana clock
  signedBy: string;
  focus_sq: string;
  focus_en: string;
  sampleRule_sq: string;
  sampleRule_en: string;
  nullableScoring_sq: string;
  nullableScoring_en: string;
  bandsOnly_sq: string;
  bandsOnly_en: string;
  rightOfReply_sq: string;
  rightOfReply_en: string;
}

export interface MaragonPhotoLicenceRecord {
  sourcePageUrl: string;
  imageUrl: string;
  credit: string;
  writtenReuseLicence: false;
  /** False when the file is stored on this site (the 22 Nov 2026 portraits). */
  linkedByUrl: boolean;
  precedent_sq: string;
  precedent_en: string;
  status: 'pending_owner_confirmation' | 'recorded_official' | 'placeholder';
  status_sq: string;
  status_en: string;
}

export interface MaragonAuditEvent {
  at: string;                // Tirana clock
  act_sq: string;
  act_en: string;
}

export interface MaragonPresenterDocuments {
  methodologyNotes: MaragonMethodologyNotes;
  photoLicence: MaragonPhotoLicenceRecord;
  auditTrail: MaragonAuditEvent[];
}

export interface MaragonPresenterRecord {
  id: string;
  givenName: string;
  familyName: string;
  roles: { sq: string; en: string }[];
  dateOfBirth: string | null;
  /** Photo-registry / legacy app id (e.g. vip5). Not used as the route id (vip_m…). */
  legacyId?: string;
  /** Presenter/on-air status. 'inactive' = no longer in the documented role (e.g. left the channel). */
  activityStatus?: 'active' | 'inactive' | 'unknown';
  activityNote_sq?: string;
  activityNote_en?: string;
  show: {
    name: string | null;
    channel: string | null;
    category: string | null;
    slot_sq: string | null;
    slot_en: string | null;
    duration_sq: string | null;
    duration_en: string | null;
    onAirSince: string | null;        // ISO date, or null if unverified
    onAirSinceYear: number | null;
    history_sq: string | null;
    history_en: string | null;
    segments: string[];        // empty = not documented
    /** 'former' = documented past programme, not confirmed as current. */
    tenure?: 'current' | 'former' | 'none';
  };
  bio: { sq: string; en: string; short_sq: string; short_en: string; status: MaragonBiographyStatus };
  officialContact: { label: string; value: string; kind: 'programme_desk'; sourceId: string } | null;
  broadcasterSocials: { platform: string; url: string; label: string; sourceId: string }[];
  personalSocials: { platform: string; url: string; label: string; sourceId: string }[];
  photo: {
    /** Shown only when set AND photoPending is false. */
    imageUrl: string | null;
    photoPending: boolean;
    /** 'Foto zyrtare / Official photo' or 'Foto në pritje / Photo pending'. */
    photoStatus?: string;
    credit: string | null;
    licence: string | null;
    /** CSS object-position for the circular crop (the file itself is not edited). */
    objectPosition?: string | null;
    /** Required for display: see utils/officialMediaPhoto.ts (fails closed without it). */
    officialSource?: import('../../utils/officialMediaPhoto').OfficialMediaPhotoSource | null;
    /** Internal flag only: photo is displayed, but the owner has not yet confirmed identity/crop. */
    awaitingOwnerConfirmation?: boolean;
    statusNote_sq: string;
    statusNote_en: string;
    candidates: MaragonPhotoCandidate[];
  };
  maragon: {
    methodology: string;          // STD id
    methodologyVersion: 'v1.0';
    methodologyApproved: boolean;
    assessmentStatus: MaragonAssessmentStatus;
    authorizedForPublicDisplay: boolean;
    am09ProvisionalApprovedInWriting: boolean;
    scoringSuspended: boolean;
    rightOfReply: 'not_offered' | 'offered' | 'completed';
    /** Written release authorisation (D-30) bound to a methodology version. Absent = not authorised. */
    releaseAuthorization?: import('../../utils/maragonPublicationDecision').MaragonReleaseAuthorization | null;
    composite: null;              // AM-02/AM-04: none until R, A, G, O are all officially scored
    dimensions: Record<MaragonPillar, MaragonBandKey | null>;
    asOf: string;                 // ISO date
    dossierId: string;
    statusNote_sq: string;
    statusNote_en: string;
    approvalAct_sq: string;
    approvalAct_en: string;
    indicators: MaragonPresenterIndicator[];
    openItems_sq: string[];
    openItems_en: string[];
  };
  documents: MaragonPresenterDocuments;
  sources: MaragonSourceRef[];
}
