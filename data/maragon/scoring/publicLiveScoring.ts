import generated from './public.active.json';
import { MARAGON_PUBLIC_DISPLAY } from '../maragonPublicDisplay';
import { stripDraftNumbers, type PublicLiveProfile, type PublicLiveScoring } from '../../../utils/maragonLiveScoring';

const raw = generated as PublicLiveScoring;
/** What the pages and the shipped bundle read. bands-only strips numbers even if the file is stale. */
export const publicLiveScoring: PublicLiveScoring = MARAGON_PUBLIC_DISPLAY === 'bands-only' ? stripDraftNumbers(raw) : raw;

export function liveProfile(id: string): PublicLiveProfile | null {
  return publicLiveScoring.profiles.find((profile) => profile.id === id) ?? null;
}
