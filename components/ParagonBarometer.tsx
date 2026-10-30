
import React from 'react';

interface ParagonBarometerProps {
  dimension?: string;
  score?: number;
  value?: number; // Alias for score
}

const getBarColor = (score: number): string => {
  if (score >= 75) return 'bg-green-500'; // Strong
  if (score >= 50) return 'bg-yellow-400'; // Moderate
  return 'bg-red-500'; // Weak
};

export const ParagonBarometer: React.FC<ParagonBarometerProps> = ({ dimension, score, value }) => {
  const actualScore = value ?? score ?? 0;
  const colorClass = getBarColor(actualScore);
  const clampedScore = Math.max(0, Math.min(100, actualScore));
  const label = dimension || "Pikët e Përgjithshme";

  return (
    <div className="w-full my-2">
      <div className="flex justify-between items-baseline mb-1">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</h4>
        <span className={`text-lg font-bold ${colorClass.replace('bg-', 'text-')}`}>{clampedScore}</span>
      </div>
      <div className="relative h-6 bg-slate-200 dark:bg-slate-700 w-full rounded-sm overflow-hidden border border-slate-300 dark:border-slate-600">
        <div
          className={`h-full ${colorClass} transition-all duration-700 ease-out`}
          style={{ width: `${clampedScore}%` }}
          role="progressbar"
          aria-valuenow={clampedScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${clampedScore} nga 100`}
        ></div>
        {/* Dashed grid lines */}
        {[20, 40, 60, 80].map(val => (
          <div key={val} className="absolute top-0 bottom-0 w-px bg-slate-100/50 dark:bg-slate-900/50" style={{ left: `${val}%`, borderLeft: '1px dashed' }}></div>
        ))}
      </div>
    </div>
  );
};
