/**
 * Coordinated release gate for the MARAGON® notice page (owner decision t330u, 23.11.2026).
 * The page, its footer and profile links, the contextual notices, indexing and the sitemap entry
 * go live together, and only when every condition below holds. Fail-closed.
 * Passing this gate approves no profile, score, band or benchmark.
 */
import {
  MARAGON_NOTICE_META,
  MARAGON_REQUEST_CHANNEL,
  allNoticeSections,
  isMaragonNoticeApproved,
  isRequestChannelConfirmed,
  noticeOpenMarkers,
  type MaragonRequestChannel,
} from './maragonNoticeContent';
import { isPrivacyRevisionLive } from '../privacy/privacyPolicyRevision';
import { MARAGON_BAND_KEYS, MARAGON_BAND_LABELS } from '../../utils/maragonPublication';

export type MaragonReleaseBlocker =
  | 'notice_not_approved'
  | 'request_channel_not_confirmed'
  | 'open_markers_in_page'
  | 'privacy_revision_not_live'
  | 'band_table_not_signed_v1';

/** Signed v1.0 §10 band table (adopted 19.11.2026, signed 21.11.2026). */
export const SIGNED_V1_BANDS = [
  { sq: 'Shumë e dobët', en: 'Very weak', min: 0, max: 20 },
  { sq: 'E dobët', en: 'Weak', min: 21, max: 40 },
  { sq: 'Mesatare', en: 'Moderate', min: 41, max: 60 },
  { sq: 'E fortë', en: 'Strong', min: 61, max: 80 },
  { sq: 'Shumë e fortë', en: 'Very strong', min: 81, max: 100 },
] as const;

/** True only when the app's band table is exactly the signed one (the bands-only patch is present). */
export function appBandsMatchSignedV1(): boolean {
  if (MARAGON_BAND_KEYS.length !== SIGNED_V1_BANDS.length) return false;
  return MARAGON_BAND_KEYS.every((key, i) => {
    const a = MARAGON_BAND_LABELS[key];
    const b = SIGNED_V1_BANDS[i];
    return a.sq === b.sq && a.en === b.en && a.min === b.min && a.max === b.max;
  });
}

export interface MaragonReleaseInput {
  meta?: typeof MARAGON_NOTICE_META;
  channel?: MaragonRequestChannel | null;
  privacyLive?: boolean;
  bandsSigned?: boolean;
}

export function maragonNoticeReleaseBlockers(input: MaragonReleaseInput = {}): MaragonReleaseBlocker[] {
  const meta = input.meta ?? MARAGON_NOTICE_META;
  const channel = input.channel === undefined ? MARAGON_REQUEST_CHANNEL : input.channel;
  const blockers: MaragonReleaseBlocker[] = [];
  if (!isMaragonNoticeApproved(meta)) blockers.push('notice_not_approved');
  if (!isRequestChannelConfirmed(channel)) blockers.push('request_channel_not_confirmed');
  if (noticeOpenMarkers(allNoticeSections(meta, channel)).length > 0) blockers.push('open_markers_in_page');
  if (!(input.privacyLive ?? isPrivacyRevisionLive())) blockers.push('privacy_revision_not_live');
  if (!(input.bandsSigned ?? appBandsMatchSignedV1())) blockers.push('band_table_not_signed_v1');
  return blockers;
}

export function isMaragonNoticeLive(input: MaragonReleaseInput = {}): boolean {
  return maragonNoticeReleaseBlockers(input).length === 0;
}
