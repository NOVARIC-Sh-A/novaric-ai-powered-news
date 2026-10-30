import React from 'react';

interface GaugeChartProps {
  value: number; // 0 to 100
  label: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, label }) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  
  const size = 160;
  const strokeWidth = 16;
  const radius = (size / 2) - (strokeWidth / 2);
  const cx = size / 2;
  const cy = size / 2;
  const circumference = radius * Math.PI; // Circumference of a semi-circle
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const color =
    clampedValue < 40 ? '#ef4444' : // red-500
    clampedValue < 70 ? '#f59e0b' : // amber-500
    '#22c55e'; // green-500
    
  const arcPath = `M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`;

  return (
    <div className="relative" style={{ width: size, height: size / 2 }} aria-label={`${label}: ${clampedValue} nga 100`}>
      <svg
        width={size}
        height={size / 2}
        viewBox={`0 0 ${size} ${size / 2}`}
        className="overflow-visible"
      >
        {/* Background track */}
        <path
          d={arcPath}
          stroke="#e5e7eb" // slate-200
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className="dark:stroke-slate-600"
        />
        {/* Foreground value arc */}
        <path
          d={arcPath}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: 'stroke-dashoffset 0.5s ease-out',
          }}
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{clampedValue}</span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 -mt-1">{label}</span>
      </div>
    </div>
  );
};

export default GaugeChart;
