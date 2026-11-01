import React, { useState } from 'react';
import {
  AWAITING_DATA,
  buildCountFingerprint,
  FINGERPRINT_LABEL,
  type FingerprintAxis,
} from '../../utils/factualObservatory';
import { EDITORIAL_RADAR_COLOR, EDITORIAL_RADAR_TOOLTIP, editorialRadarLegend } from './primitives/RadarChart';

function countText(axis: FingerprintAxis): string {
  if (!axis.verified || axis.numerator === null || axis.denominator === null) return AWAITING_DATA;
  return `${axis.numerator}/${axis.denominator}`;
}

function periodText(axis: FingerprintAxis): string {
  if (!axis.periodStart || !axis.periodEnd) return AWAITING_DATA;
  return `${axis.periodStart} – ${axis.periodEnd}`;
}

const AxisDetail: React.FC<{ axis: FingerprintAxis }> = ({ axis }) => (
  <div className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400" data-fingerprint-axis={axis.id}>
    <div className="font-bold text-slate-700 dark:text-slate-200">{axis.label}</div>
    <div className="font-mono tabular-nums">{countText(axis)}</div>
    <div>Periudha [Period]: {periodText(axis)}</div>
    {axis.sourceUrl ? (
      <a className="text-blue-700 underline dark:text-blue-300" href={axis.sourceUrl} rel="noreferrer">
        {axis.sourceTitle}
      </a>
    ) : (
      <div>Burimi [Source]: {AWAITING_DATA}</div>
    )}
  </div>
);

const CountRadar: React.FC<{ axes: FingerprintAxis[]; editorialScore: number | null }> = ({ axes, editorialScore }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const size = 280;
  const center = size / 2;
  const radius = size * 0.36;
  const point = (index: number, percent: number) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / axes.length;
    const r = (Math.max(0, Math.min(100, percent)) / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };
  const polygon = axes.map((axis, index) => {
    const p = point(index, axis.ratioPercent as number);
    return `${p.x},${p.y}`;
  }).join(' ');
  const editorial = typeof editorialScore === 'number'
    ? axes.map((_, index) => {
        const p = point(index, editorialScore);
        return `${p.x},${p.y}`;
      }).join(' ')
    : null;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible" data-count-radar="true">
        {[25, 50, 75, 100].map((level) => (
          <polygon
            key={level}
            points={axes.map((_, index) => {
              const p = point(index, level);
              return `${p.x},${p.y}`;
            }).join(' ')}
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth="1"
          />
        ))}
        {axes.map((axis, index) => {
          const outer = point(index, 100);
          return (
            <line key={axis.id} x1={center} y1={center} x2={outer.x} y2={outer.y} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />
          );
        })}
        <polygon points={polygon} fill="rgba(37, 99, 235, 0.18)" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" />
        {axes.map((axis, index) => {
          const p = point(index, axis.ratioPercent as number);
          return (
            <circle
              key={axis.id}
              cx={p.x}
              cy={p.y}
              r={hovered === index ? 7 : 4.5}
              className="fill-blue-600 stroke-white dark:stroke-slate-900"
              strokeWidth="2"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <title>{`${axis.label}: ${countText(axis)}. ${periodText(axis)}. ${axis.sourceTitle ?? ''}`}</title>
            </circle>
          );
        })}
        {editorial && (
          <polygon data-editorial-ring="true" points={editorial} fill="none" stroke={EDITORIAL_RADAR_COLOR} strokeWidth="2" strokeDasharray="7 4" strokeLinejoin="round" pointerEvents="none">
            <title>{EDITORIAL_RADAR_TOOLTIP}</title>
          </polygon>
        )}
        {axes.map((axis, index) => {
          const outer = point(index, 128);
          return (
            <text key={`${axis.id}-label`} x={outer.x} y={outer.y} textAnchor="middle" className="fill-slate-500 text-[9px] font-bold">
              {axis.label.split(' [')[0]}
            </text>
          );
        })}
      </svg>
      <div className="mt-2 min-h-8 text-center text-[11px] text-slate-600 dark:text-slate-300">
        {hovered !== null && axes[hovered] ? `${axes[hovered].label}: ${countText(axes[hovered])} · ${periodText(axes[hovered])}` : null}
      </div>
    </div>
  );
};

export const CountFingerprint: React.FC<{
  profileId?: string | number | null;
  editorialScore?: number | null;
}> = ({ profileId, editorialScore = null }) => {
  const fingerprint = buildCountFingerprint(profileId);
  const verified = fingerprint.axes.filter((axis) => axis.verified);
  const missing = fingerprint.axes.filter((axis) => !axis.verified);
  const showRing = fingerprint.chart === 'radar' && typeof editorialScore === 'number';

  return (
    <section
      className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      data-count-fingerprint="true"
      data-fingerprint-chart={fingerprint.chart}
    >
      <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
        {FINGERPRINT_LABEL}
      </h3>
      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
        Çdo bosht është një raport i klasës F ndaj emëruesit të vet. [Each axis is a class-F ratio of its own denominator.]
      </p>
      {fingerprint.chart === 'radar' ? (
        <CountRadar axes={verified} editorialScore={showRing ? editorialScore : null} />
      ) : (
        <div className="mt-4 space-y-3" data-fingerprint-bars="true">
          {verified.map((axis) => (
            <div key={axis.id}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-100">{axis.label}</span>
                <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">{countText(axis)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-blue-600" style={{ width: `${axis.ratioPercent}%` }} />
              </div>
            </div>
          ))}
          {missing.map((axis) => (
            <div key={axis.id} className="text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-200">{axis.label}: </span>
              {AWAITING_DATA}
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 grid gap-3 border-t border-slate-100 pt-3 dark:border-slate-800 md:grid-cols-3">
        {fingerprint.axes.map((axis) => <AxisDetail key={axis.id} axis={axis} />)}
      </div>
      {typeof editorialScore === 'number' && (
        <p className="mt-3 border-t border-dashed pt-3 text-[11px] text-slate-500 dark:text-slate-400" data-editorial-separate="true" style={{ borderColor: EDITORIAL_RADAR_COLOR }}>
          <span className="mr-2 inline-block h-0 w-6 border-t-2 border-dashed align-middle" style={{ borderColor: EDITORIAL_RADAR_COLOR }} />
          {editorialRadarLegend(editorialScore)}. {EDITORIAL_RADAR_TOOLTIP}
        </p>
      )}
    </section>
  );
};
