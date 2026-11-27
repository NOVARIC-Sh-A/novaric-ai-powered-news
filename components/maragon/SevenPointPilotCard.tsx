import React from 'react';
import { isDraftDisplayApproved } from '../../data/maragon/approvals';
import {
  SEVEN_POINT_BANNER,
  SEVEN_POINT_DRAFT_CONFIDENCE,
  SEVEN_POINT_V1_NOTE,
  bandMarkerLevel,
  sevenPointFrame,
  sevenPointPolygonAllowed,
  type SevenPointView,
} from '../../utils/maragonSevenPoint';
import { Mark, NAVY, REVIEW_PROVISIONAL_LABEL } from './maragonPresenterUi';

const LINE = '#e7e5e4';
const MUTED = '#57534e';
const PAGE = '#fafaf9';

export const SevenPointAxes: React.FC<{ points: SevenPointView[]; size?: number; label?: string }> = ({ points, size = 280, label }) => {
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
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" role="img" aria-label={label ?? 'Korniza 7-pikëshe MARAGON®. Pa vlerësim mbetet bosh, jo zero. / MARAGON seven-point frame. Not assessed stays empty, not zero.'} data-seven-axes="true">
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

export const SevenPointPilotCard: React.FC<{ profileId: string; compact?: boolean; now?: Date }> = ({ profileId, compact = false, now }) => {
  const frame = sevenPointFrame(profileId, now);
  if (frame.template && !isDraftDisplayApproved(profileId)) return null;
  const provisional = `${REVIEW_PROVISIONAL_LABEL.sq} / ${REVIEW_PROVISIONAL_LABEL.en}`;
  return (
    <section id={compact ? undefined : 'seven-point-pilot'} className={compact ? '' : 'rounded-lg border bg-white p-5 md:p-6'} style={{ borderColor: LINE, color: NAVY }} data-seven-point-pilot={frame.template ? 'true' : 'false'} data-template-profile={frame.template ? 'true' : 'false'} data-seven-frame={profileId}>
      {frame.template ? <p className="text-[14px] font-bold leading-relaxed px-3 py-2 rounded" style={{ background: PAGE, color: NAVY }} data-seven-banner="true">{SEVEN_POINT_BANNER}</p> : null}
      {frame.template && !compact ? <p className="mt-2 text-[14px]" style={{ color: MUTED }}><Mark text={SEVEN_POINT_V1_NOTE} /></p> : null}
      {compact ? null : <h2 className="mt-4 text-[19px] font-bold" style={{ color: NAVY }}><Mark text="MARAGON®" /> · Korniza 7-pikëshe / Seven-point frame</h2>}
      <div className={compact ? 'flex flex-col gap-2' : 'mt-4 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start'}>
        <div className="w-full max-w-[280px] mx-auto">
          <SevenPointAxes points={frame.points} size={compact ? 210 : 280} label={frame.template ? SEVEN_POINT_BANNER : undefined} />
          {frame.polygon ? null : <p className="sr-only">No polygon: fewer than three points are scored.</p>}
        </div>
        <ol className="flex flex-col gap-3 list-none m-0 p-0">
          {frame.points.map((point) => {
            const p2p6Label = frame.p2p6Provisional && (point.code === 'P2' || point.code === 'P6') && point.band;
            return (
              <li key={point.code} className="border-b pb-3" style={{ borderColor: LINE }} data-seven-point={point.code}>
                <div className="text-[12px] font-bold tracking-wide" style={{ color: MUTED }}>{point.code}</div>
                <div className="text-[16px] font-bold" style={{ color: NAVY }}>{point.labelSq}</div>
                <div className="text-[14px]" style={{ color: MUTED }}>{point.labelEn}</div>
                {point.band ? (
                  <>
                    <div className="mt-1 text-[15px] font-bold" style={{ color: NAVY }} data-seven-band={point.band}>{point.band}</div>
                    <div className="text-[13px] font-bold" style={{ color: NAVY }}>{frame.template ? 'PILOT · ' : ''}{SEVEN_POINT_DRAFT_CONFIDENCE}</div>
                    <div className="text-[12px] font-bold" style={{ color: NAVY }} data-am09="true">{provisional}</div>
                    {p2p6Label ? <div className="text-[12px] font-bold" data-p2p6-provisional={point.code}>{provisional}</div> : null}
                  </>
                ) : (
                  <>
                    <div className="mt-1 text-[15px]" style={{ color: NAVY }}>Pa vlerësim / Not assessed</div>
                    {frame.template && point.reason && !compact ? <div className="text-[14px]" style={{ color: MUTED }} data-seven-reason={point.code}>{point.reason}</div> : null}
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      {frame.overallBand ? (
        <p className="mt-3 text-[14px] font-bold" style={{ color: NAVY }} data-seven-overall={frame.overallBand}>
          {frame.overallBand}
          <span className="block text-[12px]">{frame.template ? 'PILOT · ' : ''}{SEVEN_POINT_DRAFT_CONFIDENCE}</span>
        </p>
      ) : <p className="sr-only" data-seven-overall="none">Pa vlerësim / Not assessed</p>}
    </section>
  );
};
