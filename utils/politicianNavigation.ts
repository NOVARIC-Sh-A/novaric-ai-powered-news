import scoresExport from '../db/paragon_scores_export.json';
import { canonicalProfileId } from './profileRedirects';

export interface PoliticianRef {
  id?: string | number;
  numericId?: number | string | null;
  name?: string;
  slug?: string | null;
  category?: string;
}

type StoredProfile = { id?: string; slug?: string | null };

const slugByCanonicalId = new Map<string, string>();
const idBySlug = new Map<string, string>();
for (const profile of ((scoresExport as { profiles?: StoredProfile[] }).profiles ?? [])) {
  const slug = String(profile.slug ?? '').trim().toLowerCase();
  const id = String(profile.id ?? '');
  if (!slug || !id) continue;
  slugByCanonicalId.set(id, slug);
  idBySlug.set(slug, id);
}

/** A politician id, a bare number, or a slug from the PARAGON® roster. Media ids such as vip_m1 are not. */
export function isPoliticianIdentity(id: string | number | null | undefined): boolean {
  const raw = String(id ?? '').trim();
  if (!raw) return false;
  if (/^\d+$/.test(raw) || /^vip\d+$/i.test(raw)) return true;
  if (idBySlug.has(raw.toLowerCase())) return true;
  const redirected = canonicalProfileId(raw);
  if (redirected !== raw && (/^\d+$/.test(redirected) || /^vip\d+$/i.test(redirected))) return true;
  return false;
}

/** `2`, `"2"`, `"vip2"` and `"sali-berisha"` are the same profile. The id stays canonical. */
export function canonicalPoliticianKey(id: string | number | null | undefined): string {
  const raw = String(id ?? '').trim();
  if (!raw) return '';
  if (!/^\d+$/.test(raw) && !/^vip\d+$/i.test(raw)) {
    const fromSlug = idBySlug.get(raw.toLowerCase());
    if (fromSlug) return fromSlug;
  }
  const direct = canonicalProfileId(raw);
  const base = direct === raw ? raw : direct;
  const digits = base.replace(/^vip/i, '');
  if (/^\d+$/.test(digits)) {
    return canonicalProfileId(`vip${Number(digits)}`);
  }
  return canonicalProfileId(base);
}

/** Public URL segment. Stored slug when the profile has one; numeric id only as a fallback. */
export function politicianPathId(id: string | number | null | undefined): string {
  if (!isPoliticianIdentity(id)) return '';
  const key = canonicalPoliticianKey(id);
  return slugByCanonicalId.get(key) || key.replace(/^vip/i, '') || key;
}

export function politicianProfilePath(id: string | number | null | undefined): string {
  return `/figurat-politike/${politicianPathId(id)}`;
}

export const POLITICIANS_LIST_PATH = '/figurat-politike';

export type PoliticianRoute =
  | { page: 'vipProfilePage'; id: string }
  | { page: 'politiciansPage' };

/**
 * A profile path wins over a list query. `/figurat-politike/270?page=politiciansPage`
 * is Agron Gaxho's profile, not the list and not a missing profile.
 */
export function routeFromLocation(pathname: string, search = ''): PoliticianRoute | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const profileMatch = path.match(/^\/figurat-politike\/([^/]+)$/);
  if (profileMatch) {
    const requested = decodeURIComponent(profileMatch[1]);
    const id = canonicalPoliticianKey(requested);
    if (!id) return null;
    return { page: 'vipProfilePage', id };
  }
  if (path === POLITICIANS_LIST_PATH) return { page: 'politiciansPage' };
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  if (params.get('page') === 'politiciansPage' && (path === '/' || path === '')) {
    return { page: 'politiciansPage' };
  }
  if (params.get('page') === 'vipProfilePage') {
    const raw = params.get('id');
    if (!raw || !isPoliticianIdentity(raw)) return null;
    const id = canonicalPoliticianKey(raw);
    if (!id || !isPoliticianIdentity(id)) return null;
    return { page: 'vipProfilePage', id };
  }
  return null;
}

/** The featured strip keeps its current head and then anyone marked mainProfile. */
export function selectMainProfiles<T extends PoliticianRef & { mainProfile?: boolean }>(
  politicians: T[] | null | undefined,
  headCount = 4,
): T[] {
  const list = politicians ?? [];
  const head = list.slice(0, headCount);
  const seen = new Set(head.map((person) => String(person.id)));
  const extras = list.filter((person) => person.mainProfile === true && !seen.has(String(person.id)));
  return [...head, ...extras];
}

export function findPolitician<T extends PoliticianRef>(list: T[] | null | undefined, id: string | number): T | undefined {
  const key = canonicalPoliticianKey(id);
  if (!key || !list) return undefined;
  const numeric = key.replace(/^vip/i, '');
  return list.find((person) => {
    const personId = String(person.id ?? '');
    const personNumeric = person.numericId == null ? '' : String(person.numericId);
    return personId === key || personId === numeric || personNumeric === numeric || personId === `vip${numeric}`;
  });
}

export type ProfileView = 'loading' | 'ready' | 'missing';

/** The not-found screen is only valid after the lookup has finished. */
export function profileViewState(input: { loading: boolean; profile: unknown }): ProfileView {
  if (input.profile) return 'ready';
  if (input.loading) return 'loading';
  return 'missing';
}
