import React from 'react';

interface BarChartProps {
  label: string;
  value: number; // 0-100
  color?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ label, value, color = '#3b82f6' }) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full" aria-label={`${label}: ${clampedValue}%`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{clampedValue}%</span>
      </div>
      <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-3 rounded-full"
          style={{
            width: `${clampedValue}%`,
            backgroundColor: color,
            transition: 'width 0.5s ease-in-out',
          }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );
};
