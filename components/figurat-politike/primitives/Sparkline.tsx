// components/figurat-politike/primitives/Sparkline.tsx
import React, { useState } from 'react';
import { CompositeHistoryPoint } from '../../../types/politician';

interface SparklineProps {
  history: CompositeHistoryPoint[];
  peerAverage?: number | null;
  width?: number;
  height?: number;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  history,
  peerAverage = null,
  width = 240,
  height = 56,
  className = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!history || history.length === 0) {
    return (
      <div className={`flex flex-col select-none ${className}`}>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 mb-1 tabular-nums">
          <span>Trendi 12-mujor (PARAGON®)</span>
          <span className="font-bold text-slate-400 dark:text-slate-500">–</span>
        </div>
        <div
          style={{ height }}
          className="w-full flex items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-3 text-center"
        >
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 italic">
            Nuk ka ende seri historike të verifikuar.
          </span>
        </div>
      </div>
    );
  }

  const validPoints = history.filter((p) => typeof p.composite === 'number' && !isNaN(p.composite));
  if (validPoints.length === 0) {
    return (
      <div className={`flex flex-col select-none ${className}`}>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 mb-1 tabular-nums">
          <span>Trendi 12-mujor (PARAGON®)</span>
          <span className="font-bold text-slate-400 dark:text-slate-500">–</span>
        </div>
        <div
          style={{ height }}
          className="w-full flex items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-3 text-center"
        >
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 italic">
            Nuk ka ende seri historike të verifikuar.
          </span>
        </div>
      </div>
    );
  }

  const padding = 8;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Find min and max for scaling
  const values = validPoints.map((p) => p.composite);
  const minCandidates = [...values];
  const maxCandidates = [...values];
  if (peerAverage != null) {
    minCandidates.push(peerAverage);
    maxCandidates.push(peerAverage);
  }

  const minVal = Math.min(...minCandidates, 40);
  const maxVal = Math.max(...maxCandidates, 90);
  const range = maxVal - minVal > 0 ? maxVal - minVal : 1;

  const getCoordinates = (index: number, val: number) => {
    const x = validPoints.length > 1
      ? padding + (index / (validPoints.length - 1)) * graphWidth
      : padding + graphWidth / 2;
    const y = padding + graphHeight - ((val - minVal) / range) * graphHeight;
    return { x, y };
  };

  // Build SVG path
  const linePoints = validPoints.map((p, i) => getCoordinates(i, p.composite));
  const linePath = linePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Area fill path closed at bottom
  const areaPath = linePoints.length > 1
    ? `${linePath} L ${linePoints[linePoints.length - 1].x} ${height - padding} L ${linePoints[0].x} ${height - padding} Z`
    : '';

  // Peer average reference line Y coordinate
  const peerY = peerAverage != null
    ? padding + graphHeight - ((peerAverage - minVal) / range) * graphHeight
    : null;

  // Last point
  const lastVal = validPoints[validPoints.length - 1].composite;

  return (
    <div className={`flex flex-col select-none ${className}`}>
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 mb-1 tabular-nums">
        <span>Trendi 12-mujor (PARAGON®)</span>
        <span className="font-bold text-blue-600 dark:text-blue-400">
          Fundit: {typeof lastVal === 'number' ? `${lastVal}%` : '–'}
        </span>
      </div>

      <div className="relative">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <defs>
            <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Peer average dashed reference line (only if peerAverage provided) */}
          {peerY !== null && (
            <line
              x1={padding}
              y1={peerY}
              x2={width - padding}
              y2={peerY}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="3 3"
              className="opacity-70"
            />
          )}

          {/* Gradient Fill under the line */}
          {areaPath && <path d={areaPath} fill="url(#sparkline-grad)" />}

          {/* Sparkline Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dark:stroke-blue-400"
          />

          {/* Interactive hover points */}
          {linePoints.map((pt, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 4.5 : 2.5}
                className={`transition-all duration-150 cursor-pointer ${
                  isHovered
                    ? 'fill-blue-600 stroke-2 stroke-white dark:stroke-slate-900'
                    : 'fill-blue-500'
                }`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Hover date & value overlay */}
        {hoveredIdx !== null && validPoints[hoveredIdx] && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow pointer-events-none tabular-nums border border-slate-700">
            {validPoints[hoveredIdx].period || validPoints[hoveredIdx].month || ''}: <strong>{validPoints[hoveredIdx].composite}%</strong>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
        <span>{validPoints[0]?.period || validPoints[0]?.month || ''}</span>
        {peerAverage != null && (
          <span className="text-slate-400">Mes. kolegëve: {peerAverage}%</span>
        )}
        <span>{validPoints[validPoints.length - 1]?.period || validPoints[validPoints.length - 1]?.month || ''}</span>
      </div>
    </div>
  );
};
