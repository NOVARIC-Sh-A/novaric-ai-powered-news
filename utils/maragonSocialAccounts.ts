/**
 * Personal accounts for the MARAGON® icon row.
 * The register file is the only source. Replacing it does not require a code change.
 * Grida DUMA is not in the file and is never read from it.
 * VERIFIED rows render. UNCERTAIN rows render only when ownerConfirmed is true.
 * Brand and programme accounts stay out of the row unless account_type is "personal".
 */
import register from '../data/maragon/social-accounts/REG-COM-MARAGON-SOCIAL-ACCOUNTS.json';
import { MEDIA_ICON_PLATFORMS, MEDIA_EXTRA_PLATFORMS, type MediaLogoPlatform } from './socialLinks';

export const GRIDA_DUMA_PROFILE_ID = 'vip_m2';

export interface SocialAccountRow {
  platform?: string;
  handle?: string;
  url?: string;
  status?: string;
  account_type?: string;
  ownerConfirmed?: boolean;
}

export interface SocialPersonality {
  id?: string;
  name?: string;
  accounts?: SocialAccountRow[];
}

interface SocialRegister {
  personalities?: SocialPersonality[];
  accounts?: Array<SocialAccountRow & { profileId?: string }>;
}

const PLATFORM_ALIAS: Record<string, MediaLogoPlatform> = {
  facebook: 'facebook',
  fb: 'facebook',
  instagram: 'instagram',
  ig: 'instagram',
  x: 'x',
  twitter: 'x',
  whatsapp: 'whatsapp',
  linkedin: 'linkedin',
  telegram: 'telegram',
  tiktok: 'tiktok',
  youtube: 'youtube',
};

export function normalizeSocialPlatform(value: string | undefined): MediaLogoPlatform | null {
  if (!value) return null;
  return PLATFORM_ALIAS[value.trim().toLowerCase()] ?? null;
}

export function accountIsRenderable(row: SocialAccountRow): boolean {
  if (row.account_type && row.account_type !== 'personal') return false;
  if (row.status === 'VERIFIED') return true;
  return row.status === 'UNCERTAIN' && row.ownerConfirmed === true;
}

function rowsFor(profileId: string, source: SocialRegister = register as SocialRegister): SocialAccountRow[] {
  if (profileId === GRIDA_DUMA_PROFILE_ID) return [];
  if (Array.isArray(source.personalities)) {
    return source.personalities.find((person) => person.id === profileId)?.accounts ?? [];
  }
  return (source.accounts ?? []).filter((row) => row.profileId === profileId);
}

/** Coloured URLs. Missing platforms stay grey in the icon row. */
export function confirmedSocialUrls(profileId: string, source?: SocialRegister): Partial<Record<MediaLogoPlatform, string>> {
  const urls: Partial<Record<MediaLogoPlatform, string>> = {};
  for (const row of rowsFor(profileId, source)) {
    if (!accountIsRenderable(row)) continue;
    const platform = normalizeSocialPlatform(row.platform);
    const url = typeof row.url === 'string' ? row.url.trim() : '';
    if (!platform || !/^https:\/\//i.test(url)) continue;
    urls[platform] = url;
  }
  return urls;
}

export function heldBrandAccounts(source: SocialRegister = register as SocialRegister): Array<{ name: string; platform: string; handle: string; url: string }> {
  const held: Array<{ name: string; platform: string; handle: string; url: string }> = [];
  for (const person of source.personalities ?? []) {
    for (const row of person.accounts ?? []) {
      if (row.status !== 'VERIFIED' || row.account_type === 'personal' || row.account_type == null) continue;
      held.push({
        name: person.name || person.id || '',
        platform: row.platform || '',
        handle: row.handle || '',
        url: row.url || '',
      });
    }
  }
  return held;
}

export const MEDIA_ROW_PLATFORMS = [...MEDIA_ICON_PLATFORMS, ...MEDIA_EXTRA_PLATFORMS] as const;
