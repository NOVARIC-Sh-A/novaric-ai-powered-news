// components/figurat-politike/primitives/ZodiacChip.tsx
import React from 'react';
import { NOT_SCORED } from './awaiting';

interface ZodiacChipProps {
  dateOfBirth?: string | null;
  className?: string;
  /** Show the explicit not-scored label beside the sign. */
  withStatus?: boolean;
}

interface ZodiacInfo {
  name: string;
  glyph: React.ReactNode;
}

export function getZodiacSign(dob: string): ZodiacInfo | null {
  if (!dob) return null;
  const match = dob.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/) || dob.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  if (!match) return null;

  let month: number;
  let day: number;

  if (match[1].length === 4) {
    // YYYY-MM-DD
    month = parseInt(match[2], 10);
    day = parseInt(match[3], 10);
  } else {
    // DD.MM.YYYY
    day = parseInt(match[1], 10);
    month = parseInt(match[2], 10);
  }

  if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  // Astrological boundaries
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return {
      name: 'Dashi',
      glyph: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21V9M12 9C9 6 6 7 6 10M12 9C15 6 18 7 18 10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return {
      name: 'Demi',
      glyph: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="14" r="6" />
          <path d="M6 4C6 8 18 8 18 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return {
      name: 'Binjakët',
      glyph: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 4C10 6 14 6 18 4M6 20C10 18 14 18 18 20M9 5V19M15 5V19" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return {
      name: 'Gaforrja',
      glyph: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8" cy="8" r="4" />
          <circle cx="16" cy="16" r="4" />
          <path d="M12 8C16 8 19 11 19 15M12 16C8 16 5 13 5 9" strokeLinecap="round" />
        </svg>
      ),
    };
  }
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return {
      name: 'Luani',
      glyph: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="7" cy="16" r="3" />
          <circle cx="17" cy="8" r="3" />
          <path d="M9.5 14.5C12 11 15 11 17 11M17 11V17C17 19 19 20 20 19" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return {
      name: 'Virgjëresha',
      glyph: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 6V18M9 6V18M13 6V18C13 18 15 14 17 15C19 16 19 19 17 21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return {
      name: 'Peshorja',
      glyph: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19H20M4 15H20M12 9C9 9 7.5 11 7 15H17C16.5 11 15 9 12 9Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return {
      name: 'Akrepi',
      glyph: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 6V16M9 6V16M13 6V16M13 13C16 13 18 15 18 18L20 17M20 17L18 21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return {
      name: 'Shigjetari',
      glyph: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 19L19 5M12 5H19V12M8 12L12 16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return {
      name: 'Bricjapi',
      glyph: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 6V15C7 17 9 19 11 19M11 19C13 19 15 17 15 15V9M15 13C18 13 20 15 20 17C20 19 18 21 16 20" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return {
      name: 'Ujori',
      glyph: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 10L7 8L10 10L13 8L16 10L19 8L22 10M4 16L7 14L10 16L13 14L16 16L19 14L22 16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  }
  // month === 2 && day >= 19 || month === 3 && day <= 20
  return {
    name: 'Peshqit',
    glyph: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 4C9 8 9 16 6 20M18 4C15 8 15 16 18 20M4 12H20" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
}

export const ZodiacChip: React.FC<ZodiacChipProps> = ({ dateOfBirth, className = '', withStatus = false }) => {
  if (!dateOfBirth) return null;

  const zodiac = getZodiacSign(dateOfBirth);
  if (!zodiac) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60 shadow-sm ${className}`}
      title={NOT_SCORED}
    >
      <span className="text-purple-600 dark:text-purple-400">{zodiac.glyph}</span>
      <span className="tracking-tight">{zodiac.name}</span>
      {withStatus && (
        <span className="text-[10px] font-bold uppercase tracking-wide text-purple-500/90 dark:text-purple-300/80">
          {NOT_SCORED}
        </span>
      )}
    </span>
  );
};
