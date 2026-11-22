import React from 'react';
import type { MaragonLanguage } from '../../utils/maragonPublication';
import { publicBandAria, publicBandText, type PublicMaragonBand } from '../../utils/maragonBandsOnly';

/**
 * Bands-only display (v1.0 §10). Five segments, the band word, and an accessible label in words.
 * No number, percentage, bar width or tooltip derived from a score.
 */
export const MaragonBandChip: React.FC<{ label: string; band: PublicMaragonBand | null; lang?: MaragonLanguage }> = ({ label, band, lang = 'sq' }) => (
  <div className="w-full" role="group" aria-label={publicBandAria(label, band)} data-maragon-band={band?.band ?? 'not_assessed'}>
    <div className="flex justify-between items-center text-xs mb-1 gap-2">
      <span className="font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      <span className="font-bold text-slate-800 dark:text-slate-100">{publicBandText(band, lang)}</span>
    </div>
    <div className="grid grid-cols-5 gap-1" aria-hidden="true">
      {['b1', 'b2', 'b3', 'b4', 'b5'].map((key, index) => (
        <span
          key={key}
          className={`h-2 rounded-full ${band && index < band.level ? 'bg-primary-600 dark:bg-primary-400' : 'bg-slate-200 dark:bg-slate-600'}`}
        />
      ))}
    </div>
  </div>
);
