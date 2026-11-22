import { mediaProfilesData } from '../data/mediaProfiles';
import { isMediaIdentity } from './maragonPublication';
import { assignProfileSlugs } from './politicianSlug';

export const MEDIA_LIST_PATH = '/personalitete-mediatike';

export interface MediaRef {
  id?: string | number;
  numericId?: number | string | null;
  name?: string | null;
  slug?: string | null;
}

const slugById = new Map<string, string>();
const idBySlug = new Map<string, string>();

const assigned = assignProfileSlugs(mediaProfilesData.map((profile) => ({
  id: String(profile.id),
  numericId: profile.numericId,
  name: profile.name,
})));

for (const profile of mediaProfilesData) {
  const id = String(profile.id);
  const slug = String(profile.slug || assigned.get(id) || '').trim().toLowerCase();
  if (!slug) continue;
  slugById.set(id, slug);
  idBySlug.set(slug, id);
  const legacy = (profile as { legacyIds?: Array<string | number> }).legacyIds || [];
  for (const oldId of legacy) {
    const key = String(oldId).trim();
    if (key) idBySlug.set(key.toLowerCase(), id);
  }
}

export function mediaSlugFor(id: string | number | null | undefined): string {
  const raw = String(id ?? '').trim();
  if (!raw) return '';
  if (slugById.has(raw)) return slugById.get(raw) || '';
  const fromSlug = idBySlug.get(raw.toLowerCase());
  if (fromSlug) return slugById.get(fromSlug) || '';
  return '';
}

/** Canonical vip_m id. A slug, a legacy vip id, and the vip_m id all resolve here. */
export function canonicalMediaKey(id: string | number | null | undefined): string {
  const raw = String(id ?? '').trim();
  if (!raw) return '';
  if (slugById.has(raw)) return raw;
  return idBySlug.get(raw.toLowerCase()) || '';
}

export function mediaProfilePath(id: string | number | null | undefined): string {
  const slug = mediaSlugFor(id);
  return slug ? `${MEDIA_LIST_PATH}/${slug}` : '';
}

export function findMediaProfile<T extends MediaRef>(list: T[] | null | undefined, id: string | number): T | undefined {
  const key = canonicalMediaKey(id);
  if (!key || !list) return undefined;
  const slug = slugById.get(key);
  return list.find((person) => {
    const personId = String(person.id ?? '');
    return personId === key || (slug != null && person.slug === slug);
  });
}

export type MediaRoute =
  | { page: 'vipProfilePage'; id: string }
  | { page: 'mediaPersonalitiesPage' };

/**
 * A profile path wins over a list query.
 * Old `?page=maragonProfile&id=vip_mX` and `?page=vipProfilePage&id=vip_mX`
 * open the same profile, then the app replaces the URL with the slug.
 * `?page=maragonProfile` without an id is the existing Grida DUMA page.
 */
export function routeMediaFromLocation(pathname: string, search = ''): MediaRoute | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const profileMatch = path.match(/^\/personalitete-mediatike\/([^/]+)$/);
  if (profileMatch) {
    const requested = decodeURIComponent(profileMatch[1]);
    const id = canonicalMediaKey(requested);
    if (!id) return null;
    return { page: 'vipProfilePage', id };
  }
  if (path === MEDIA_LIST_PATH) return { page: 'mediaPersonalitiesPage' };

  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const page = params.get('page');
  if (page === 'mediaPersonalitiesPage' && (path === '/' || path === '')) {
    return { page: 'mediaPersonalitiesPage' };
  }
  if (page === 'maragonProfile' || page === 'vipProfilePage') {
    const raw = params.get('id');
    if (!raw) {
      if (page === 'maragonProfile') return { page: 'vipProfilePage', id: 'vip_m2' };
      return null;
    }
    if (!isMediaIdentity(raw) && !canonicalMediaKey(raw)) return null;
    const id = canonicalMediaKey(raw);
    if (!id) return null;
    return { page: 'vipProfilePage', id };
  }
  return null;
}
