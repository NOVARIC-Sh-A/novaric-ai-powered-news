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
