// components/figurat-politike/primitives/ScoreRing.tsx
import React, { useState } from 'react';
import { AwaitingPhoto } from './awaiting';

export interface ScoreRingProps {
  score: number | null | undefined;
  coverage?: string | null;
  imageUrl?: string;
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
  name,
  size = 132,
  strokeWidth = 5.5,
  className = '',
  suspended = true,
}) => {
  const [imgError, setImgError] = useState(false);
  React.useEffect(() => setImgError(false), [imageUrl]);
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
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      {/* SVG Progress Ring */}
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-800"
          strokeWidth={strokeWidth}
        />
        {/* Active Value Progress (only if score is non-null) */}
        {numericScore !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className={`${ringColorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Inner Avatar (112px inner diameter) */}
      <div
        className="rounded-full overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800 shadow-inner z-10 border-2 border-white dark:border-slate-900"
        style={{ width: size - strokeWidth * 3 - 4, height: size - strokeWidth * 3 - 4 }}
      >
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          /* No official photo, or it failed to load: neutral 'Awaiting data' state */
          <AwaitingPhoto iconClassName="w-12 h-12" />
        )}
      </div>

      {/* Score Badge Overlay */}
      <div
        className={`absolute -bottom-1 z-20 px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-md border-2 border-white dark:border-slate-900 tabular-nums whitespace-nowrap ${badgeBgClass}`}
        title={numericScore !== null ? `PARAGON® Score: ${numericScore}%` : 'PARAGON® Score: në pritje'}
      >
        {formattedScoreText}
      </div>
    </div>
  );
};
