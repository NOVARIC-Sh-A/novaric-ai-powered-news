import React from 'react';

// Shared empty-state copy for politician profile sections.
export const AWAITING_DATA = 'Në pritje të të dhënave / Awaiting data';
export const NOT_SCORED = 'Nuk pikëzohet / Not scored';

/** Shown beside every published PARAGON overall score. */
export const PARTIAL_RATING_BADGE =
  'Vlerësim i pjesshëm – vetëm aktiviteti parlamentar / Partial rating – parliamentary activity only';

export const PARTIAL_RANKING_LABEL =
  'Renditja e pjesshme – vetëm aktiviteti parlamentar / Partial ranking – parliamentary activity only';

export const PARTIAL_RATING_NOTE =
  'Ky vlerësim mbulon vetëm prezencën, pjesëmarrjen në votim dhe kohezionin e grupit nga fletët zyrtare të votimit të Kuvendit që nga 1 shtator 2025. This score covers only presence, voting participation and group cohesion from official Kuvendi roll calls since 1 Sep 2025. Dimensionet e tjera janë Në pritje të të dhënave / Awaiting data.';

export function formatPartialCoverage(coverage?: string | null): string {
  if (coverage && /^\d+\/7$/.test(coverage)) return `${coverage} dimensions`;
  return '';
}

export const PartialRatingBadge: React.FC<{ coverage?: string | null; className?: string }> = ({
  coverage,
  className = '',
}) => {
  const coverageText = formatPartialCoverage(coverage);
  return (
    <span className={className} data-partial-rating="true">
      {PARTIAL_RATING_BADGE}
      {coverageText ? ` · ${coverageText}` : ''}
    </span>
  );
};

export function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export const AwaitState: React.FC<{ className?: string }> = ({ className = '' }) => (
  <p className={`text-xs text-slate-500 dark:text-slate-400 text-center py-6 ${className}`}>
    {AWAITING_DATA}
  </p>
);

// Neutral photo state used when a politician has no official photo, or when the
// official photo fails to load (image onError). Never a NOVARIC copy or stock image.
export const AwaitingPhoto: React.FC<{ className?: string; iconClassName?: string; compact?: boolean }> = ({
  className = '',
  iconClassName = 'w-10 h-10',
  compact = false,
}) => (
  <div
    className={`w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-800 ${className}`}
    role="img"
    aria-label={AWAITING_DATA}
    title={AWAITING_DATA}
    data-photo-state="awaiting"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClassName} aria-hidden="true">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
    <span className={`${compact ? 'text-[8px] leading-[10px]' : 'text-[9px] leading-[11px]'} font-semibold text-center px-1`}>
      {AWAITING_DATA}
    </span>
  </div>
);
