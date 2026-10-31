// types/politician.ts
import { VipProfile, ParagonEntry } from '../types';

export type ParagonDimensionKey = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7';

export type ParagonScoringStatus =
  | 'suspended'
  | 'collecting'
  | 'insufficient_coverage'
  | 'calculated'
  | 'audit_pending'
  | 'verified'
  | 'published';

export interface ParagonDimensionItem {
  id?: number | string;
  key: ParagonDimensionKey | string;
  label: string;
  name?: string;
  shortName?: string;
  score: number | null;
  peerAverage: number | null;
  benchmark: number | null;
  /** Lower bound of the recorded confidence interval, 0–100. Null when the source has none. */
  confidenceLow?: number | null;
  /** Upper bound of the recorded confidence interval, 0–100. Null when the source has none. */
  confidenceHigh?: number | null;
  /** Share of required inputs present for this dimension, 0–100. */
  completeness?: number | null;
  verificationStatus?: 'under_review' | 'verified' | 'disputed' | string;
  metricInputs?: Record<string, any>;
  coverage?: any;
}

export interface DimensionReading {
  score?: number | null;
  peerAverage?: number | null;
  benchmark?: number | null;
  confidenceLow?: number | null;
  confidenceHigh?: number | null;
  completeness?: number | null;
}

export interface PromiseItem {
  id?: string;
  text: string;
  status?: string | null;
  date?: string | null;
  sourceUrl?: string | null;
}

export interface ConsistencyFlag {
  id?: string;
  statement?: string | null;
  vote?: string | null;
  flag?: string | null;
  sourceUrl?: string | null;
}

export interface VoteRecordItem {
  id?: string;
  subject?: string | null;
  votedAt?: string | null;
  choice?: string | null;
  passed?: boolean | null;
  sourceUrl?: string | null;
  withParty?: boolean | null;
}

export interface AssetTimelineItem {
  year: number;
  filedAt?: string | null;
  onTime?: boolean | null;
  sourceUrl?: string | null;
  categories?: AssetCategory[];
}

export interface RhetoricExcerpt {
  date?: string | null;
  excerpt: string;
  sourceUrl?: string | null;
  topic?: string | null;
}

export interface RhetoricProfile {
  speechCount?: number | null;
  mentionCount?: number | null;
  averageSentiment?: number | null;
  averageWordCount?: number | null;
  excerpts?: RhetoricExcerpt[];
}

export interface AffiliationLink {
  kind: string;
  label: string;
  detail?: string | null;
  url?: string | null;
}

export interface ScoreEvidenceItem {
  id?: string;
  dimensionKey?: string | null;
  metricKey?: string | null;
  sourceTitle?: string | null;
  sourceUrl?: string | null;
  sourcePublisher?: string | null;
  excerpt?: string | null;
  retrievedAt?: string | null;
}

export interface RightOfReplyItem {
  id?: string;
  submittedAt?: string | null;
  statement: string;
  status?: string | null;
  sourceUrl?: string | null;
}

export interface ScoreRevision {
  computedAt?: string | null;
  periodEnd?: string | null;
  modelVersion?: string | null;
  composite?: number | null;
  dimensions?: Record<string, number | null>;
}

export interface CompositeHistoryPoint {
  period?: string;
  month?: string;
  composite: number;
}

export interface RoleHistoryItem {
  id?: string;
  personId?: string;
  roleType:
    | 'active_mp'
    | 'speaker_of_parliament'
    | 'prime_minister'
    | 'cabinet_member'
    | 'mayor'
    | 'party_leader'
    | 'former_mp'
    | 'former_minister'
    | 'former_official'
    | 'other_public_figure'
    | 'mandate_ended'
    | 'mandate_suspended'
    | 'legal_proceedings'
    | string;
  institution: string;
  officialTitle: string;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent: boolean;
  sourceUrl: string;
  sourceTitle: string;
  sourcePublisher: string;
  verifiedAt: string;
  verificationStatus: 'verified' | 'disputed' | 'under_review' | string;
}

export interface PoliticianBio {
  fullName?: string;
  education?: string;
  profession?: string;
  email?: string;
  activeStatus?: boolean;
  party?: string;
  birthdatePlace?: string;
}

export interface ActivityFeedItem {
  date: string;
  type: 'bill' | 'speech' | 'session' | 'vote' | 'media';
  title: string;
  source: string;
  detail?: string;
}

export interface AssetCategory {
  category: string;
  detail?: string;
  value: number | null | string;
}

export interface AssetDeclaration {
  year: number;
  onTime: boolean;
  categories: AssetCategory[];
  sourceUrl?: string;
  declaredDate?: string;
}

export interface MandateItem {
  period: string;
  role: string;
  current: boolean;
}

export interface PoliticianDetail extends VipProfile {
  dateOfBirth?: string | null;
  placeOfBirth?: string | null;
  electoralZone?: string | null;
  primaryRole?: string;
  secondaryRoles?: string[];
  parliamentaryStatus?: 'active_mp' | 'not_an_active_mp' | 'former_mp' | 'mandate_ended' | 'mandate_suspended' | string;
  detentionStatus?: 'none' | 'pre_trial_detention' | string;
  caseStatus?: 'none' | 'criminal_proceedings_ongoing' | string;
  presumptionOfInnocence?: boolean;
  legalStatusAsOf?: string;
  legalStatusSummary?: string;
  dateOfBirthVerificationStatus?: 'verified' | 'unverified';
  dateOfBirthSourceUrl?: string;
  dateOfBirthVerifiedAt?: string;
  roleHistory?: RoleHistoryItem[];
  scoringSuspended?: boolean;
  scoringSuspensionNotice?: string;
  ratingsEnabled?: boolean;
  coverage?: string | null;
  scoring_note?: string | null;
  paragonDimensions: ParagonDimensionItem[] | Array<number | null> | null;
  dimensionReadings?: Record<string, DimensionReading>;
  compositeHistory: CompositeHistoryPoint[];
  bio: PoliticianBio;
  recentActivity: ActivityFeedItem[];
  assetDeclaration?: AssetDeclaration | null;
  assetTimeline?: AssetTimelineItem[];
  mandates: MandateItem[];
  promises?: PromiseItem[];
  consistencyFlags?: ConsistencyFlag[];
  votingRecord?: VoteRecordItem[];
  rhetoric?: RhetoricProfile | null;
  affiliations?: AffiliationLink[];
  evidence?: ScoreEvidenceItem[];
  rightOfReply?: RightOfReplyItem[];
  scoreRevisions?: ScoreRevision[];
  metrics?: Record<string, any>;
  commentary?: string;
}

/**
 * Extended Politician Card Payload per specification §4
 */
export interface PoliticianCardItem extends VipProfile {
  politicianId?: number;
  dateOfBirth?: string | null;
  placeOfBirth?: string | null;
  electoralZone?: string | null;
  party?: string | null;
  primaryRole?: string;
  secondaryRoles?: string[];
  parliamentaryStatus?: string;
  detentionStatus?: string;
  caseStatus?: string;
  presumptionOfInnocence?: boolean;
  legalStatusAsOf?: string;
  legalStatusSummary?: string;
  dateOfBirthVerificationStatus?: 'verified' | 'unverified';
  dateOfBirthSourceUrl?: string;
  dateOfBirthVerifiedAt?: string;
  scoringSuspended?: boolean;
  scoringSuspensionNotice?: string;
  ratingsEnabled?: boolean;
  coverage?: string | null;
  scoring_note?: string | null;
  paragonDimensions?: number[] | null;
  composite?: number | null;
  compositeDelta?: number | null;
  periodEnd?: string | null;
}

export interface FiguratPolitikeStats {
  totalProfiles: number;
  activeMps: number;
  paragonActive: number;
  monitoringText: string;
}

export type ParagonTypedId =
  | 'paragon:d1'
  | 'paragon:d2'
  | 'paragon:d3'
  | 'paragon:d4'
  | 'paragon:d5'
  | 'paragon:d6'
  | 'paragon:d7';

export const CANONICAL_PARAGON_DIMENSIONS = [
  { key: 'D1', id: 1, typedId: 'paragon:d1' as const, name: 'Angazhimi Politik', shortName: 'Angazhimi', lineageTarget: 'maragon:O4.2', status: 'computed' },
  { key: 'D2', id: 2, typedId: 'paragon:d2' as const, name: 'Llogaridhënia', shortName: 'Llogaridhënia', lineageTarget: 'maragon:G3.1', status: 'computed' },
  { key: 'D3', id: 3, typedId: 'paragon:d3' as const, name: 'Përfaqësimi', shortName: 'Përfaqësimi', lineageTarget: 'maragon:O4.1', status: 'pending_audit' },
  { key: 'D4', id: 4, typedId: 'paragon:d4' as const, name: 'Asertiviteti', shortName: 'Asertiviteti', lineageTarget: 'maragon:A2.1', status: 'pending_audit' },
  { key: 'D5', id: 5, typedId: 'paragon:d5' as const, name: 'Qeverisja', shortName: 'Qeverisja', lineageTarget: 'maragon:G3.2', status: 'pending_audit' },
  { key: 'D6', id: 6, typedId: 'paragon:d6' as const, name: 'Kohësioni', shortName: 'Kohësioni', lineageTarget: 'maragon:A2.2', status: 'pending_audit' },
  { key: 'D7', id: 7, typedId: 'paragon:d7' as const, name: 'Narrativa', shortName: 'Narrativa', lineageTarget: 'maragon:O4.2', status: 'pending_audit' },
] as const;
