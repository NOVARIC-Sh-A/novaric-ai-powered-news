/** Old card ids that now open the merged profile. */
export const PROFILE_REDIRECTS: Record<string, string> = {
  vip190: 'vip103',
  '190': 'vip103',
  vip169: 'vip16',
  '169': 'vip16',
};

export function canonicalProfileId(id: string | number | null | undefined): string {
  const raw = String(id ?? '').trim();
  return PROFILE_REDIRECTS[raw] || PROFILE_REDIRECTS[raw.toLowerCase()] || raw;
}
