// lib/brand-tokens.ts
// NOVARIC® Brand Token Helpers

export type PartySlug = 'PS' | 'PD' | 'PL' | 'PSD' | 'IND';

/**
 * Party color resolution helper.
 * Per spec: partyColor(slug) with fallback --p-IND
 */
export function partyColor(slug?: string | null): string {
  if (!slug) return 'var(--p-IND)';
  const s = slug.toUpperCase().trim();

  // Extract from category string e.g. "Politikë (PS)" if provided
  const match = s.match(/\((.*?)\)/);
  const clean = match ? match[1].trim() : s;

  if (clean === 'PS' || clean.includes('SOCIALISTE') || clean.startsWith('PS')) {
    return 'var(--p-PS)';
  }
  if (clean === 'PD' || clean.includes('DEMOKRATIKE') || clean.startsWith('PD')) {
    return 'var(--p-PD)';
  }
  if (clean === 'PL' || clean === 'LSI' || clean.includes('LIRIA')) {
    return 'var(--p-PL)';
  }
  if (clean === 'PSD' || clean.includes('SOCIALDEMOKRATE')) {
    return 'var(--p-PSD)';
  }
  if (clean === 'IND' || clean.includes('PAVARUR')) {
    return 'var(--p-IND)';
  }
  return 'var(--p-IND)';
}

/**
 * Normalizes party label to standard short code (PS, PD, PL, PSD, IND)
 */
export function normalizePartySlug(input?: string | null): PartySlug {
  if (!input) return 'IND';
  const s = input.toUpperCase().trim();
  const match = s.match(/\((.*?)\)/);
  const clean = match ? match[1].trim() : s;

  if (clean.includes('PSD')) return 'PSD';
  if (clean.includes('PS')) return 'PS';
  if (clean.includes('PD')) return 'PD';
  if (clean.includes('PL') || clean.includes('LSI')) return 'PL';
  return 'IND';
}

/**
 * Resolves score to CSS variable band token:
 * <40 -> --b-low, <60 -> --b-mid, <75 -> --b-high, else -> --b-top
 */
export function band(v?: number | null): string {
  if (v === null || v === undefined || isNaN(v)) {
    return 'var(--nv-dot-empty)';
  }
  if (v < 40) return 'var(--b-low)';
  if (v < 60) return 'var(--b-mid)';
  if (v < 75) return 'var(--b-high)';
  return 'var(--b-top)';
}

/**
 * Returns Albanian text label for score band
 */
export function bandLabel(v?: number | null): string {
  if (v === null || v === undefined || isNaN(v)) {
    return 'E padisponueshme';
  }
  if (v < 40) return 'Kritike';
  if (v < 60) return 'Në zhvillim';
  if (v < 75) return 'E fortë';
  return 'E shkëlqyer';
}
