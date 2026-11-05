/** Stable public path segment for a politician. Generated once and stored. */

export interface SlugSource {
  id: string;
  numericId?: number | string | null;
  name?: string | null;
}

export function slugifyPoliticianName(name: string | null | undefined): string {
  const transliterated = String(name ?? '')
    .replace(/[ëË]/g, 'e')
    .replace(/[çÇ]/g, 'c')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return transliterated
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function numericOrder(value: number | string | null | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}

/**
 * Lowest numeric id keeps the bare slug. Later profiles with the same name
 * get `-<numericId>`, which does not move if another profile is added.
 */
export function assignProfileSlugs(profiles: SlugSource[]): Map<string, string> {
  const groups = new Map<string, SlugSource[]>();
  for (const profile of profiles) {
    const base = slugifyPoliticianName(profile.name) || `profile-${profile.numericId ?? profile.id}`;
    const list = groups.get(base) ?? [];
    list.push(profile);
    groups.set(base, list);
  }

  const assigned = new Map<string, string>();
  const used = new Set<string>();
  const bases = [...groups.keys()].sort();
  for (const base of bases) {
    const members = [...(groups.get(base) ?? [])].sort((a, b) => {
      const delta = numericOrder(a.numericId) - numericOrder(b.numericId);
      return delta !== 0 ? delta : String(a.id).localeCompare(String(b.id));
    });
    members.forEach((member, index) => {
      let slug = index === 0 ? base : `${base}-${numericOrder(member.numericId)}`;
      if (!slug || used.has(slug) || /^\d+$/.test(slug) || /^vip\d+$/i.test(slug)) {
        slug = `${base}-${member.id}`.toLowerCase();
      }
      while (used.has(slug)) slug = `${slug}-${member.id}`.toLowerCase();
      used.add(slug);
      assigned.set(String(member.id), slug);
    });
  }
  return assigned;
}
