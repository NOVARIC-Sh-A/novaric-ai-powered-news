import { canonicalProfileId } from './profileRedirects';

export interface PoliticianRef {
  id?: string | number;
  numericId?: number | string | null;
  name?: string;
  category?: string;
}

/** `2`, `"2"` and `"vip2"` are the same profile. */
export function canonicalPoliticianKey(id: string | number | null | undefined): string {
  const raw = String(id ?? '').trim();
  if (!raw) return '';
  const direct = canonicalProfileId(raw);
  const base = direct === raw ? raw : direct;
  const digits = base.replace(/^vip/i, '');
  if (/^\d+$/.test(digits)) {
    return canonicalProfileId(`vip${Number(digits)}`);
  }
  return canonicalProfileId(base);
}

export function politicianPathId(id: string | number | null | undefined): string {
  const key = canonicalPoliticianKey(id);
  return key.replace(/^vip/i, '') || key;
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
    const id = raw ? canonicalPoliticianKey(raw) : '';
    if (id) return { page: 'vipProfilePage', id };
  }
  return null;
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
