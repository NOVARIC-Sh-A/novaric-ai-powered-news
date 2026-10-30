// lib/zodiac.ts
// NOVARIC® Zodiac Calculator per canonical specification

export interface ZodiacSignResult {
  name: string;
  glyph: string;
}

/**
 * Canonical Albanian Zodiac Signs with Unicode Glyphs
 */
export const ZODIAC_SIGNS: Record<string, ZodiacSignResult> = {
  Dashi: { name: 'Dashi', glyph: '♈' },
  Demi: { name: 'Demi', glyph: '♉' },
  Binjakët: { name: 'Binjakët', glyph: '♊' },
  Gaforrja: { name: 'Gaforrja', glyph: '♋' },
  Luani: { name: 'Luani', glyph: '♌' },
  Virgjëresha: { name: 'Virgjëresha', glyph: '♍' },
  Peshorja: { name: 'Peshorja', glyph: '♎' },
  Akrepi: { name: 'Akrepi', glyph: '♏' },
  Shigjetari: { name: 'Shigjetari', glyph: '♐' },
  Bricjapi: { name: 'Bricjapi', glyph: '♑' },
  Ujori: { name: 'Ujori', glyph: '♒' },
  Peshqit: { name: 'Peshqit', glyph: '♓' },
};

/**
 * Boundary dates for each month (1 to 12):
 * [19, 20, 21, 22, 23, 23, 23, 22, 22, 22, 19, 20]
 * If day <= boundary date, returns earlier sign of that month;
 * otherwise returns subsequent sign.
 */
export const ZODIAC_BOUNDARIES = [19, 20, 21, 22, 23, 23, 23, 22, 22, 22, 19, 20] as const;

const MONTH_SIGNS: Array<{ before: ZodiacSignResult; after: ZodiacSignResult }> = [
  { before: ZODIAC_SIGNS.Bricjapi, after: ZODIAC_SIGNS.Ujori },       // Jan (boundary 19)
  { before: ZODIAC_SIGNS.Ujori, after: ZODIAC_SIGNS.Peshqit },        // Feb (boundary 20)
  { before: ZODIAC_SIGNS.Peshqit, after: ZODIAC_SIGNS.Dashi },         // Mar (boundary 21)
  { before: ZODIAC_SIGNS.Dashi, after: ZODIAC_SIGNS.Demi },           // Apr (boundary 22)
  { before: ZODIAC_SIGNS.Demi, after: ZODIAC_SIGNS.Binjakët },        // May (boundary 23)
  { before: ZODIAC_SIGNS.Binjakët, after: ZODIAC_SIGNS.Gaforrja },    // Jun (boundary 23)
  { before: ZODIAC_SIGNS.Gaforrja, after: ZODIAC_SIGNS.Luani },       // Jul (boundary 23)
  { before: ZODIAC_SIGNS.Luani, after: ZODIAC_SIGNS.Virgjëresha },    // Aug (boundary 22)
  { before: ZODIAC_SIGNS.Virgjëresha, after: ZODIAC_SIGNS.Peshorja }, // Sep (boundary 22)
  { before: ZODIAC_SIGNS.Peshorja, after: ZODIAC_SIGNS.Akrepi },      // Oct (boundary 22)
  { before: ZODIAC_SIGNS.Akrepi, after: ZODIAC_SIGNS.Shigjetari },    // Nov (boundary 19)
  { before: ZODIAC_SIGNS.Shigjetari, after: ZODIAC_SIGNS.Bricjapi },  // Dec (boundary 20)
];

/**
 * Computes the Albanian zodiac sign and unicode glyph for a given date.
 * Supports ISO (YYYY-MM-DD) and European (DD.MM.YYYY, DD-MM-YYYY) formats.
 * Returns null if input is null, empty, or unparseable.
 */
export function zodiacSign(date: string | null | undefined): ZodiacSignResult | null {
  if (!date || typeof date !== 'string') return null;
  const trimmed = date.trim();
  if (!trimmed) return null;

  let month: number | null = null;
  let day: number | null = null;

  // 1. Check ISO format YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = trimmed.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (isoMatch) {
    month = parseInt(isoMatch[2], 10);
    day = parseInt(isoMatch[3], 10);
  } else {
    // 2. Check European format DD.MM.YYYY or DD-MM-YYYY or DD/MM/YYYY
    const euroMatch = trimmed.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
    if (euroMatch) {
      day = parseInt(euroMatch[1], 10);
      month = parseInt(euroMatch[2], 10);
    }
  }

  if (
    month === null ||
    day === null ||
    isNaN(month) ||
    isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const boundary = ZODIAC_BOUNDARIES[month - 1];
  const pair = MONTH_SIGNS[month - 1];

  return day <= boundary ? pair.before : pair.after;
}
