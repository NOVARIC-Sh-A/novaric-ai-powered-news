// components/figurat-politike/primitives/RadarChart.tsx
import React, { useState } from 'react';
import { ParagonDimensionItem } from '../../../types/politician';
import { AWAITING_DATA } from './awaiting';

export const EDITORIAL_RADAR_COLOR = '#1E5BD8';
export const EDITORIAL_RADAR_TOOLTIP =
  'Opinion editorial i NOVARIC® Sh.A. – jo pjesë e pikës PARAGON® / NOVARIC® Sh.A. editorial opinion – not part of the PARAGON® score';

export function editorialRadarLegend(score: number): string {
  return `Vlerësim editorial / Editor’s assessment (${score})`;
}

interface RadarChartProps {
  dimensions: ParagonDimensionItem[];
  size?: number;
  className?: string;
  /** One overall editorial score, drawn on every axis. Not a per-dimension PARAGON value. */
  editorialScore?: number | null;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  dimensions,
  size = 280,
  className = '',
  editorialScore = null,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const numAxes = 7;
  const center = size / 2;
  const radius = size * 0.38;

  // Compute coordinate for an axis at given percentage (0..100)
  const getPoint = (index: number, value: number, maxRadius: number = radius) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / numAxes;
    const clamped = Math.max(0, Math.min(100, value));
    const r = (clamped / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Base point on axis line for null dimensions (at 20% mark for clear visual indication)
  const getNullPoint = (index: number) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / numAxes;
    const r = 0.2 * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Grid level polygons (25, 50, 75, 100)
  const gridLevels = [25, 50, 75, 100];
  const gridPolygons = gridLevels.map((level) => {
    const points = Array.from({ length: numAxes }, (_, i) => {
      const p = getPoint(i, level);
      return `${p.x},${p.y}`;
    }).join(' ');
    return { level, points };
  });

  // Valid scored points (never connect through fabricated values!)
  const scoredEntries = dimensions
    .map((dim, i) => ({ dim, i, isScored: typeof dim.score === 'number' && !isNaN(dim.score) }))
    .filter((entry) => entry.isScored);

  // Peer entries
  const peerEntries = dimensions
    .map((dim, i) => ({ dim, i, hasPeer: typeof dim.peerAverage === 'number' && !isNaN(dim.peerAverage) }))
    .filter((entry) => entry.hasPeer);

  const benchmarkEntries = dimensions
    .map((dim, i) => ({ dim, i, hasBenchmark: typeof dim.benchmark === 'number' && !isNaN(dim.benchmark) }))
    .filter((entry) => entry.hasBenchmark);

  const editorialRing = typeof editorialScore === 'number' && !Number.isNaN(editorialScore)
    ? Array.from({ length: numAxes }, (_, i) => {
        const p = getPoint(i, editorialScore);
        return `${p.x},${p.y}`;
      }).join(' ')
    : null;

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Ring Gridlines */}
        {gridPolygons.map(({ level, points }) => (
          <polygon
            key={level}
            points={points}
            fill={level === 100 ? 'currentColor' : 'none'}
            className="text-slate-100/60 dark:text-slate-800/40 stroke-slate-200 dark:stroke-slate-700/80"
            strokeWidth={level === 100 ? '1.5' : '1'}
          />
        ))}

        {/* Radiating Axis Lines */}
        {Array.from({ length: numAxes }).map((_, i) => {
          const outer = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outer.x}
              y2={outer.y}
              className="stroke-slate-200 dark:stroke-slate-700/70"
              strokeWidth="1"
            />
          );
        })}

        {/* Benchmark polygon: dotted amber, distinct from subject and peers */}
        {benchmarkEntries.length >= 3 && (
          <polygon
            points={benchmarkEntries.map((e) => {
              const p = getPoint(e.i, e.dim.benchmark as number);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="none"
            stroke="#d97706"
            strokeWidth="1.75"
            strokeDasharray="1.5 3.5"
            strokeLinejoin="round"
          />
        )}
        {benchmarkEntries.map((e) => {
          const p = getPoint(e.i, e.dim.benchmark as number);
          return (
            <rect
              key={`bench-${e.i}`}
              x={p.x - 3}
              y={p.y - 3}
              width="6"
              height="6"
              fill="none"
              stroke="#d97706"
              strokeWidth="1.4"
              transform={`rotate(45 ${p.x} ${p.y})`}
            />
          );
        })}

        {/* Peer Reference Polygon (dashed gray) - only if peers exist */}
        {peerEntries.length >= 3 && (
          <polygon
            points={peerEntries.map((e) => {
              const p = getPoint(e.i, e.dim.peerAverage as number);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            className="opacity-70 dark:opacity-60"
          />
        )}
        {peerEntries.map((e) => {
          const p = getPoint(e.i, e.dim.peerAverage as number);
          return (
            <circle
              key={`peer-${e.i}`}
              cx={p.x}
              cy={p.y}
              r="2.2"
              fill="none"
              stroke="#64748b"
              strokeWidth="1.2"
            />
          );
        })}

        {/* Subject Polygon (Brand Blue) - NEVER connect through fabricated values */}
        {scoredEntries.length >= 3 ? (
          <polygon
            points={scoredEntries.map((e) => {
              const p = getPoint(e.i, e.dim.score as number);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="rgba(37, 99, 235, 0.22)"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="transition-all duration-500 ease-out dark:stroke-blue-400 dark:fill-blue-500/20"
          />
        ) : scoredEntries.length === 2 ? (
          // Line connecting the only two points
          (() => {
            const p1 = getPoint(scoredEntries[0].i, scoredEntries[0].dim.score as number);
            const p2 = getPoint(scoredEntries[1].i, scoredEntries[1].dim.score as number);
            return (
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="dark:stroke-blue-400"
              />
            );
          })()
        ) : null}

        {/* Vertices */}
        {dimensions.map((dim, i) => {
          const isScored = typeof dim.score === 'number' && !isNaN(dim.score);
          const p = isScored ? getPoint(i, dim.score as number) : getNullPoint(i);
          const isHovered = hoveredIdx === i;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {isScored ? (
                /* Solid blue vertex circle */
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 8 : 4.5}
                  className={`transition-all duration-200 ${
                    isHovered
                      ? 'fill-blue-600 dark:fill-blue-400 stroke-4 stroke-blue-200 dark:stroke-blue-900'
                      : 'fill-blue-600 dark:fill-blue-400 stroke-2 stroke-white dark:stroke-slate-900'
                  }`}
                />
              ) : (
                /* Hollow gray circle for NULL dimension */
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6.5 : 4}
                  className={`transition-all duration-200 fill-white dark:fill-slate-900 stroke-2 stroke-slate-400 dark:stroke-slate-500 ${
                    isHovered ? 'stroke-slate-600 dark:stroke-slate-300 stroke-3' : ''
                  }`}
                />
              )}
            </g>
          );
        })}

        {/* Editorial ring overlays every axis at the one overall opinion score. */}
        {editorialRing && (
          <polygon
            data-editorial-ring="true"
            points={editorialRing}
            fill="none"
            stroke={EDITORIAL_RADAR_COLOR}
            strokeWidth="2"
            strokeDasharray="7 4"
            strokeLinejoin="round"
            pointerEvents="none"
          >
            <title>{EDITORIAL_RADAR_TOOLTIP}</title>
          </polygon>
        )}

        {/* Short Axis Labels */}
        {dimensions.map((dim, i) => {
          const outer = getPoint(i, 118);
          const labelText = dim.shortName || dim.name || dim.label || `D${i + 1}`;
          return (
            <text
              key={i}
              x={outer.x}
              y={outer.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-[9px] font-bold tracking-tight uppercase fill-slate-500 dark:fill-slate-400 transition-colors ${
                hoveredIdx === i ? 'fill-blue-600 dark:fill-blue-400 font-extrabold' : ''
              }`}
            >
              {labelText}
            </text>
          );
        })}
      </svg>

      {/* Interactive Tooltip Card on Hover */}
      <div className="h-9 mt-1 flex items-center justify-center">
        {hoveredIdx !== null && dimensions[hoveredIdx] ? (
          (() => {
            const hDim = dimensions[hoveredIdx];
            const isScored = typeof hDim.score === 'number' && !isNaN(hDim.score);
            const dimName = hDim.name || hDim.label || `D${hoveredIdx + 1}`;
            const dimKey = hDim.key || `D${hoveredIdx + 1}`;

            if (!isScored) {
              return (
                <div className="bg-slate-900 text-white text-[11px] px-3 py-1 rounded-md shadow-lg flex items-center gap-2 animate-fadeIn border border-slate-700 tabular-nums">
                  <span className="font-semibold text-amber-300">{dimKey} {dimName}:</span>
                  <span className="text-slate-300">në pritje — të dhëna jo të disponueshme</span>
                </div>
              );
            }

            return (
              <div className="bg-slate-900 text-white text-[11px] px-3 py-1 rounded-md shadow-lg flex items-center gap-3 animate-fadeIn border border-slate-700 tabular-nums">
                <span className="font-semibold text-blue-300">{dimKey} {dimName}:</span>
                <span>Vlerësimi: <strong className="text-white">{hDim.score}%</strong></span>
                {hDim.proxy ? <span className="text-amber-300" title={hDim.methodNote || 'Metodë proxy / Proxy method'}>Metodë proxy</span> : null}
                <span className="text-slate-400">Mes. kolegëve: {hDim.peerAverage != null ? `${hDim.peerAverage}%` : AWAITING_DATA}</span>
                <span className="text-slate-400">Benchmark: {hDim.benchmark != null ? `${hDim.benchmark}%` : AWAITING_DATA}</span>
                {editorialRing ? (
                  <span className="text-[#1E5BD8]" title={EDITORIAL_RADAR_TOOLTIP}>
                    {editorialRadarLegend(editorialScore as number)}
                  </span>
                ) : null}
              </div>
            );
          })()
        ) : (
          <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-blue-600 rounded"></span> Subjekti / Subject
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 border-t border-dashed border-slate-400"></span>
              {peerEntries.length ? 'Mes. kolegëve / Peers' : `Mes. kolegëve: ${AWAITING_DATA}`}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 border-t border-dotted border-amber-600"></span>
              {benchmarkEntries.length ? 'Benchmark' : `Benchmark: ${AWAITING_DATA}`}
            </span>
            {editorialRing ? (
              <span className="inline-flex items-center gap-1.5 text-left" title={EDITORIAL_RADAR_TOOLTIP} data-editorial-legend="true">
                <span className="w-2.5 h-0.5 border-t-2 border-dashed" style={{ borderColor: EDITORIAL_RADAR_COLOR }}></span>
                {editorialRadarLegend(editorialScore as number)}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
