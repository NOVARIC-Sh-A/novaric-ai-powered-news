/**
 * Display form for a person's name: given name(s) and initials in normal case,
 * surname in capitals, diacritics kept. Ana Kovaçi-Leka → Ana KOVAÇI-LEKA.
 *
 * Separate given/surname fields win. Otherwise the last word is the surname,
 * and a hyphenated last word is one surname with every part in capitals.
 * A name of three or more words is not split further: the last word is used
 * and the name is reported as ambiguous.
 */

const LOCALE = 'sq-AL';

export interface PersonNameSource {
  name?: string | null;
  given?: string | null;
  firstName?: string | null;
  surname?: string | null;
  lastName?: string | null;
}

export interface PersonNameSplit {
  display: string;
  given: string;
  surname: string;
  /** True when the surname was not stored separately and the last-word rule may hide a two-word surname. */
  ambiguous: boolean;
  reason: string | null;
}

function clean(value: string | null | undefined): string {
  return (value || '').trim().replace(/\s+/g, ' ');
}

function upperPart(part: string): string {
  return part.toLocaleUpperCase(LOCALE);
}

/** Capitals for each word and each hyphenated piece. Diacritics stay. */
export function uppercaseSurname(surname: string): string {
  return clean(surname)
    .split(' ')
    .map((word) => word.split('-').map(upperPart).join('-'))
    .join(' ');
}

function normalToken(token: string): string {
  if (!token) return token;
  const dotted = token.endsWith('.');
  const core = dotted ? token.slice(0, -1) : token;
  const letters = [...core].filter((ch) => /\p{L}/u.test(ch)).join('');
  if (!letters) return token;
  const isInitial = letters.length <= 2 && core.length <= 2;
  const allUpper = letters === letters.toLocaleUpperCase(LOCALE);
  const allLower = letters === letters.toLocaleLowerCase(LOCALE);
  if (!isInitial && !allUpper && !allLower) return token;
  const lowered = core.toLocaleLowerCase(LOCALE);
  const normal = lowered.charAt(0).toLocaleUpperCase(LOCALE) + lowered.slice(1);
  return dotted ? `${normal}.` : normal;
}

function normalGiven(given: string): string {
  return clean(given)
    .split(' ')
    .map((word) => word.split('-').map(normalToken).join('-'))
    .join(' ');
}

function fromStoredName(name: string): PersonNameSplit {
  const cleaned = clean(name);
  if (!cleaned) {
    return { display: '', given: '', surname: '', ambiguous: false, reason: null };
  }
  const parts = cleaned.split(' ');
  if (parts.length === 1) {
    const surname = uppercaseSurname(parts[0]);
    return {
      display: surname,
      given: '',
      surname,
      ambiguous: true,
      reason: 'Single word, with no separate surname field. Shown in capitals.',
    };
  }
  const surname = uppercaseSurname(parts[parts.length - 1]);
  const given = normalGiven(parts.slice(0, -1).join(' '));
  const ambiguous = parts.length > 2;
  return {
    display: `${given} ${surname}`.trim(),
    given,
    surname,
    ambiguous,
    reason: ambiguous
      ? 'No separate surname field. The last word is the surname; an earlier word may be part of a two-word surname.'
      : null,
  };
}

export function splitPersonName(input: string | PersonNameSource | null | undefined): PersonNameSplit {
  if (input == null) {
    return { display: '', given: '', surname: '', ambiguous: false, reason: null };
  }
  if (typeof input === 'string') return fromStoredName(input);
  const given = clean(input.given || input.firstName);
  const surname = clean(input.surname || input.lastName);
  if (given || surname) {
    const normal = normalGiven(given);
    const upper = uppercaseSurname(surname);
    return {
      display: [normal, upper].filter(Boolean).join(' '),
      given: normal,
      surname: upper,
      ambiguous: false,
      reason: null,
    };
  }
  return fromStoredName(input.name || '');
}

export function formatPersonName(input: string | PersonNameSource | null | undefined): string {
  return splitPersonName(input).display;
}
