// components/figurat-politike/primitives/ScoreRing.tsx
import React from 'react';
import { AWAITING_DATA, ratingBadgeForCoverage } from './awaiting';
import { PoliticianPortrait } from '../PoliticianPortrait';
import { portraitPropsFromProfile } from '../../../utils/portraitStandard';

export interface ScoreRingProps {
  score: number | null | undefined;
  coverage?: string | null;
  imageUrl?: string;
  profile?: any;
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  suspended?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  coverage,
  imageUrl,
  profile,
  name,
  size = 132,
  strokeWidth = 5.5,
  className = '',
  suspended = true,
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const isScored = !suspended && typeof score === 'number' && !isNaN(score);
  const numericScore = isScored ? Math.max(0, Math.min(100, score)) : null;
  const offset = numericScore !== null ? circumference - (numericScore / 100) * circumference : circumference;

  // Determine ring color based on score band
  const getRingColor = (s: number | null) => {
    if (suspended || s === null) return 'stroke-slate-300 dark:stroke-slate-700 text-slate-400';
    if (s >= 75) return 'stroke-emerald-500 text-emerald-500';
    if (s >= 60) return 'stroke-sky-500 text-sky-500';
    if (s >= 40) return 'stroke-amber-500 text-amber-500';
    return 'stroke-rose-500 text-rose-500';
  };

  const getScoreBadgeBg = (s: number | null) => {
    if (suspended) return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
    if (s === null) return 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
    if (s >= 75) return 'bg-emerald-600 text-white';
    if (s >= 60) return 'bg-sky-600 text-white';
    if (s >= 40) return 'bg-amber-600 text-white';
    return 'bg-rose-600 text-white';
  };

  const ringColorClass = getRingColor(numericScore);
  const badgeBgClass = getScoreBadgeBg(numericScore);

  const formattedScoreText = suspended
    ? 'Audit'
    : (numericScore !== null
      ? (coverage ? `${Number.isInteger(numericScore) ? numericScore : numericScore.toFixed(1)} · ${coverage}` : `${Math.round(numericScore)}%`)
      : '–');

  return (
    <div className={`relative inline-flex flex-col items-center justify-start flex-shrink-0 ${className}`} style={{ width: Math.max(size, 160) }}>
      <div className="relative z-10 w-full">
        <PoliticianPortrait
          {...(profile
            ? portraitPropsFromProfile(profile, { size: 'large', showCredit: true, eager: true })
            : {
                politicianId: name,
                name,
                imageUrl: imageUrl || null,
                imageCredit: null,
                size: 'large' as const,
                showCredit: false,
                eager: true,
              })}
        />
      </div>

      {/* Score sits under the portrait so it cannot cover the face. */}
      <div
        className={`mt-2 z-20 px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-md border border-white dark:border-slate-900 tabular-nums whitespace-nowrap ${badgeBgClass}`}
        title={numericScore !== null ? `${ratingBadgeForCoverage(coverage)}${coverage ? ` · ${coverage} dimensions` : ''}` : AWAITING_DATA}
      >
        {formattedScoreText}
      </div>
    </div>
  );
};
