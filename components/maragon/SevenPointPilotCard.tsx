import React from 'react';
import { isDraftDisplayApproved } from '../../data/maragon/approvals';
import card from '../../data/maragon/pilots/seven-point-fevziu-20261127/public.card.json';
import {
  SEVEN_POINT_BANNER,
  SEVEN_POINT_DRAFT_CONFIDENCE,
  SEVEN_POINT_V1_NOTE,
  bandMarkerLevel,
  sevenPointPolygonAllowed,
  type SevenPointView,
} from '../../utils/maragonSevenPoint';
import { Mark, NAVY } from './maragonPresenterUi';

const published = card as {
  templateProfile: true;
  profileId: string;
  polygon: boolean;
  points: SevenPointView[];
};

const LINE = '#e7e5e4';
const MUTED = '#57534e';
const PAGE = '#fafaf9';

export const SevenPointAxes: React.FC<{ points: SevenPointView[]; size?: number }> = ({ points, size = 280 }) => {
  const n = points.length || 7;
  const c = size / 2;
  const R = size * 0.32;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, r: number) => [c + r * Math.cos(angle(i)), c + r * Math.sin(angle(i))] as const;
  const polygon = sevenPointPolygonAllowed(points);
  const scored = points
    .map((point, i) => (point.status === 'scored' && point.band ? { point, i, level: bandMarkerLevel(point.band) } : null))
    .filter((item): item is { point: SevenPointView; i: number; level: number } => item !== null);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" role="img" aria-label={SEVEN_POINT_BANNER} data-seven-axes="true">
      {[1, 2, 3, 4, 5].map((ring) => (
        <circle key={ring} cx={c} cy={c} r={(R * ring) / 5} fill="none" stroke={LINE} strokeWidth={0.8} data-seven-ring={ring} />
      ))}
      {points.map((point, i) => {
        const [x, y] = pt(i, R);
        return <line key={point.code} x1={c} y1={c} x2={x} y2={y} stroke={LINE} strokeWidth={0.8} data-seven-axis={point.code} />;
      })}
      {polygon ? (
        <polygon
          data-seven-polygon="true"
          points={scored.map((item) => pt(item.i, (R * item.level) / 5).join(',')).join(' ')}
          fill="rgba(48,56,75,0.12)"
          stroke={NAVY}
          strokeWidth={1.4}
        />
      ) : null}
      {points.map((point, i) => {
        const [x, y] = pt(i, R * 1.22);
        const empty = point.status !== 'scored';
        return (
          <text key={point.code} x={x} y={y} textAnchor="middle" fill={NAVY} fontSize={size * 0.04} fontFamily="Source Serif 4, Georgia, serif">
            <tspan x={x} dy="0">{point.code}</tspan>
            {empty ? <tspan x={x} dy={size * 0.045} fill={MUTED} fontSize={size * 0.032} data-seven-empty={point.code}>Pa vlerësim</tspan> : null}
          </text>
        );
      })}
      {scored.map((item) => {
        const [x, y] = pt(item.i, (R * item.level) / 5);
        return <circle key={item.point.code} cx={x} cy={y} r={size * 0.018} fill={NAVY} data-seven-marker={item.point.code} />;
      })}
    </svg>
  );
};

export const SevenPointPilotCard: React.FC<{ profileId: string }> = ({ profileId }) => {
  if (profileId !== published.profileId || !published.templateProfile) return null;
  if (!isDraftDisplayApproved(profileId)) return null;
  return (
    <section id="seven-point-pilot" className="rounded-lg border bg-white p-5 md:p-6" style={{ borderColor: LINE, color: NAVY }} data-seven-point-pilot="true" data-template-profile="true">
      <p className="text-[14px] font-bold leading-relaxed px-3 py-2 rounded" style={{ background: PAGE, color: NAVY }} data-seven-banner="true">{SEVEN_POINT_BANNER}</p>
      <p className="mt-2 text-[14px]" style={{ color: MUTED }}><Mark text={SEVEN_POINT_V1_NOTE} /></p>
      <h2 className="mt-4 text-[19px] font-bold" style={{ color: NAVY }}><Mark text="MARAGON®" /> · Korniza 7-pikëshe / Seven-point frame</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">
        <div className="w-full max-w-[280px] mx-auto">
          <SevenPointAxes points={published.points} />
          {published.polygon ? null : <p className="sr-only">No polygon: fewer than three points are scored.</p>}
        </div>
        <ol className="flex flex-col gap-3 list-none m-0 p-0">
          {published.points.map((point) => (
            <li key={point.code} className="border-b pb-3" style={{ borderColor: LINE }} data-seven-point={point.code}>
              <div className="text-[12px] font-bold tracking-wide" style={{ color: MUTED }}>{point.code}</div>
              <div className="text-[16px] font-bold" style={{ color: NAVY }}>{point.labelSq}</div>
              <div className="text-[14px]" style={{ color: MUTED }}>{point.labelEn}</div>
              {point.status === 'scored' && point.band ? (
                <>
                  <div className="mt-1 text-[15px] font-bold" style={{ color: NAVY }} data-seven-band={point.band}>{point.band}</div>
                  <div className="text-[13px] font-bold" style={{ color: NAVY }}>{SEVEN_POINT_DRAFT_CONFIDENCE}</div>
                </>
              ) : (
                <>
                  <div className="mt-1 text-[15px]" style={{ color: NAVY }}>Pa vlerësim / Not assessed</div>
                  {point.reason ? <div className="text-[14px]" style={{ color: MUTED }} data-seven-reason={point.code}>{point.reason}</div> : null}
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
