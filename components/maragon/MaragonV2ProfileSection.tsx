import React from 'react';
import { isDraftDisplayApproved } from '../../data/maragon/approvals';
import {
  SEVEN_POINT_BAND_LABEL,
  SEVEN_POINT_BAND_ORDER,
  SEVEN_POINT_CORE,
  bandMarkerLevel,
  blankSevenPoints,
  calibrationProgress,
  sevenPointFrame,
  sevenPointPolygonAllowed,
  type SevenPointBand,
  type SevenPointFrameView,
  type SevenPointView,
} from '../../utils/maragonSevenPoint';
import { Mark, NAVY } from './maragonPresenterUi';

const GOLD = '#C9A54C';
const GOLD_INK = '#8A6D1F';
const MUTED = '#6B7488';
const SOFT = '#8A93A6';
const MIST = '#EEF1F6';
const PALE = '#F4F6FA';
const HAIR = '#D5DAE3';
const SPOKE = '#C3CAD6';
const RULE = '#E1E5EC';

/**
 * Approved profile-section lines for the stored reason keys.
 * A null reason stays "Pa vlerësim" with no invented explanation.
 * An unknown reason is shown as stored, not replaced.
 */
const REASON_DISPLAY: Record<string, { sq: string; en: string }> = {
  'no calibrated scale yet.': {
    sq: 'Pa rubrikë të miratuar; pikë e re, në kalibrim',
    en: 'No approved rubric; new point, in calibration',
  },
  'claim-check log not built.': {
    sq: 'Regjistri i pretendimeve nuk u ndërtua',
    en: 'Claim log not built',
  },
  'too few questions with an identifiable political side (18 of 150 needed).': {
    sq: 'Titrat pa etiketa folësi (18 nga 113 pyetje)',
    en: 'Captions lack speaker labels (18 of 113 questions)',
  },
  'background accuracy not checked; result on the cut-off.': {
    sq: 'Matur, por konteksti i paverifikuar',
    en: 'Measured, but context not verified',
  },
  'no calibrated scale yet; auto-captions cannot separate speech errors from transcription errors.': {
    sq: 'Pa rubrikë të miratuar; pikë e re, në kalibrim',
    en: 'No approved rubric; new point, in calibration',
  },
};

const LEVEL_TWO_NOTE = {
  sq: 'Pa metodë të miratuar për mesataren e kolegëve; nuk publikohet kurrë.',
  en: 'No approved peer-average method; never public.',
};

const LEVEL_THREE_NOTE = {
  sq: 'AM-10 (nënshkruar 23.11) vlen vetëm për v1.0; rihartëzimi te P1–P7 është shtyrë (OD-S14, §5.7).',
  en: 'AM-10 signed for v1.0 only; remap to P1–P7 deferred.',
};

const PILOT_PILL = 'PILOT · DRAFT · provizor / provisional';
const PILOT_VALUE = 'PILOT · DRAFT';

export function visibleSevenPointFrame(profileId: string, now: Date = new Date()): SevenPointFrameView {
  const frame = sevenPointFrame(profileId, now);
  if (frame.template && !isDraftDisplayApproved(profileId)) {
    const points = blankSevenPoints();
    return {
      ...frame,
      template: false,
      points,
      polygon: sevenPointPolygonAllowed(points),
      firstScoreAt: null,
      calibrationOpen: false,
      p2p6Provisional: false,
      fivePointMean: true,
      overallBand: null,
    };
  }
  return frame;
}

function reasonCopy(reason: string | null): { sq: string; en: string } | null {
  if (!reason) return null;
  return REASON_DISPLAY[reason] ?? { sq: reason, en: reason };
}

function confidenceLine(point: SevenPointView, frame: SevenPointFrameView): string | null {
  if (!point.band) return null;
  const low = point.confidence === 'low';
  const draft = frame.template || (frame.p2p6Provisional && (point.code === 'P2' || point.code === 'P6'));
  if (!low && !draft) return null;
  const parts = [
    low ? 'Besueshmëri e ulët / low confidence' : null,
    draft ? PILOT_VALUE : null,
  ].filter(Boolean);
  return parts.join(' · ');
}

function levelOneNote(frame: SevenPointFrameView): { sq: string; en: string } {
  const scored = frame.points.some((point) => point.band);
  if (frame.template && scored) {
    return {
      sq: 'Pilot P1–P7, besueshmëri e ulët. Pjesa tjetër: shih kartat lart.',
      en: 'Pilot P1–P7, low confidence. The rest: see the cards above.',
    };
  }
  if (!scored) {
    return {
      sq: 'Asnjë pikë individuale nuk është vlerësuar.',
      en: 'No individual point has been assessed.',
    };
  }
  return {
    sq: 'Brezat e mësipërm. Pikat pa brez mbeten pa vlerësim.',
    en: 'Bands shown above. Points without a band stay not assessed.',
  };
}

const En: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block font-normal italic" style={{ color: MUTED }}>{children}</span>
);

export const MaragonSevenAxisGraph: React.FC<{ points: SevenPointView[]; label?: string }> = ({ points, label }) => {
  const n = 7;
  const c = 230;
  const step = 30.4;
  const outer = step * 5;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const at = (i: number, r: number) => {
    const a = angle(i);
    return [c + r * Math.cos(a), c + r * Math.sin(a)] as const;
  };
  const ring = (r: number) => Array.from({ length: n }, (_, i) => at(i, r).map((v) => v.toFixed(1)).join(',')).join(' ');
  const drawShape = sevenPointPolygonAllowed(points);
  const scored = points
    .map((point, i) => (point.status === 'scored' && point.band ? { point, i, level: bandMarkerLevel(point.band) } : null))
    .filter((item): item is { point: SevenPointView; i: number; level: number } => item !== null);

  return (
    <svg viewBox="-18 -8 496 484" width="100%" role="img" aria-label={label ?? 'Shtresa 1 — niveli individual. Pa vlerësim mbetet bosh, jo zero. / Layer 1, individual level. Not assessed stays empty, not zero.'} data-seven-axes="true" data-seven-shape={drawShape ? 'polygon' : 'markers'}>
      {[5, 4, 3, 2, 1].map((level) => (
        <polygon key={level} points={ring(step * level)} fill={level % 2 === 1 ? PALE : '#FFFFFF'} stroke={HAIR} strokeWidth={1} data-seven-ring={level} />
      ))}
      {points.map((point, i) => {
        const [x, y] = at(i, outer);
        return <line key={point.code} x1={c} y1={c} x2={x} y2={y} stroke={SPOKE} strokeWidth={1} />;
      })}
      {drawShape ? (
        <polygon
          data-seven-polygon="true"
          points={scored.map((item) => at(item.i, step * (item.level - 0.5)).join(',')).join(' ')}
          fill="rgba(48,56,75,0.14)"
          stroke={NAVY}
          strokeWidth={1.6}
        />
      ) : null}
      {scored.map((item) => {
        const [x1, y1] = at(item.i, step * (item.level - 1));
        const [x2, y2] = at(item.i, step * item.level);
        const [mx, my] = at(item.i, step * (item.level - 0.5));
        const right = Math.cos(angle(item.i)) >= -0.05;
        return (
          <g key={item.point.code} data-seven-marker={item.point.code}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth={12} strokeLinecap="round" opacity={0.95} />
            <circle cx={mx} cy={my} r={5} fill={NAVY} />
            <text x={mx + (right ? 16 : -16)} y={my + 4} textAnchor={right ? 'start' : 'end'} fontSize={12.5} fontWeight={700} fill={NAVY} fontFamily="Helvetica, Arial, sans-serif" stroke="#fff" strokeWidth={3} paintOrder="stroke">
              {item.point.band}
            </text>
          </g>
        );
      })}
      {points.map((point, i) => {
        const [x, y] = at(i, outer + 36);
        const scoredPoint = point.status === 'scored' && point.band;
        const fill = scoredPoint ? NAVY : SOFT;
        return (
          <g key={point.code}>
            {!scoredPoint ? <circle cx={at(i, outer)[0]} cy={at(i, outer)[1]} r={4.5} fill="#fff" stroke="#A0A8B8" strokeWidth={1.5} strokeDasharray="2 2" /> : null}
            <text x={x} y={y} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={17} fontWeight={800} fill={fill}>
              {point.code}
            </text>
            {scoredPoint ? null : (
              <text x={x} y={y + 17} textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize={10.5} fill={SOFT} data-seven-empty={point.code}>
                Pa vlerësim
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const PointCard: React.FC<{ point: SevenPointView; frame: SevenPointFrameView }> = ({ point, frame }) => {
  const scored = Boolean(point.band);
  const level = point.band ? bandMarkerLevel(point.band) : 0;
  const names = point.band ? SEVEN_POINT_BAND_LABEL[point.band] : null;
  const reason = reasonCopy(point.reason);
  const meta = confidenceLine(point, frame);
  return (
    <article
      className="rounded-[14px] bg-white px-4 pb-3.5 pt-4 shadow-[0_1px_6px_rgba(48,56,75,0.07)]"
      style={{ borderTop: `5px solid ${scored ? GOLD : '#C9CFDA'}`, minHeight: 196 }}
      data-seven-point={point.code}
      data-seven-band={point.band ?? 'none'}
    >
      <span className="inline-block rounded-[5px] px-2 py-0.5 text-[13px] font-extrabold text-white" style={{ backgroundColor: scored ? NAVY : SOFT }}>{point.code}</span>
      <h3 className="mt-2 text-[15.5px] font-extrabold leading-tight" style={{ color: NAVY }}>{point.labelSq}</h3>
      <p className="mt-0.5 text-[12.5px]" style={{ color: MUTED }}>{point.labelEn}</p>
      <div className="my-2.5 flex gap-[3px]" aria-hidden="true">
        {SEVEN_POINT_BAND_ORDER.map((band, index) => (
          <span key={band} className="h-[7px] flex-1 rounded-[3px]" style={{ backgroundColor: index + 1 === level ? GOLD : '#E3E7EE' }} />
        ))}
      </div>
      {scored && point.band && names ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block rounded-[7px] px-2.5 py-1 text-[15px] font-extrabold text-white" style={{ backgroundColor: NAVY }}>{point.band}</span>
          <span className="text-[13px] font-semibold" style={{ color: NAVY }}>{names.sq} / {names.en}</span>
        </div>
      ) : (
        <span className="inline-block rounded-[7px] px-2.5 py-1 text-[12.5px] font-extrabold" style={{ backgroundColor: MIST, color: MUTED }}>Pa vlerësim / Not assessed</span>
      )}
      {meta ? <p className="mt-2 text-[11.5px] leading-snug" style={{ color: MUTED }} data-seven-draft={point.code}>{meta}</p> : null}
      {!scored && reason ? (
        <p className="mt-2 text-[11.5px] leading-snug" style={{ color: MUTED }} data-seven-reason={point.code}>
          {reason.sq === reason.en ? reason.en : <>{reason.sq}<En>{reason.en}</En></>}
        </p>
      ) : null}
    </article>
  );
};

const LevelColumn: React.FC<{
  level: string;
  title: string;
  subtitle: string;
  rows: { code: string; band: SevenPointBand | null }[];
  noteSq: string;
  noteEn: string;
}> = ({ level, title, subtitle, rows, noteSq, noteEn }) => (
  <article className="overflow-hidden rounded-[14px] bg-white shadow-[0_1px_6px_rgba(48,56,75,0.07)]" data-rating-level={level}>
    <header className="px-4 py-3 text-white" style={{ backgroundColor: NAVY }}>
      <span className="mr-2 inline-block rounded-[4px] px-1.5 py-0.5 align-[2px] text-[11px] font-extrabold" style={{ backgroundColor: GOLD, color: NAVY }}>{level}</span>
      <span className="text-[16px] font-extrabold">{title}</span>
      <div className="mt-0.5 text-[12px] font-medium" style={{ color: '#C9CFDA' }}>{subtitle}</div>
    </header>
    <ul className="m-0 list-none p-0">
      {rows.map((row) => (
        <li key={row.code} className="flex items-center justify-between px-4 py-[7px] text-[13.5px]" style={{ borderBottom: `1px solid ${MIST}` }}>
          <span className="font-extrabold" style={{ color: NAVY }}>{row.code}</span>
          {row.band ? (
            <b className="rounded-[5px] px-2 py-0.5 text-white" style={{ backgroundColor: NAVY }} data-level-band={row.band}>{row.band}</b>
          ) : (
            <span className="text-right text-[12.5px] leading-tight" style={{ color: SOFT }}>Pa vlerësim<span className="block text-[11px]">Not assessed</span></span>
          )}
        </li>
      ))}
    </ul>
    <p className="px-4 pb-3.5 pt-2.5 text-[11.5px] leading-snug" style={{ backgroundColor: '#F8F9FB', color: '#5B6478' }}>
      {noteSq}
      <En>{noteEn}</En>
    </p>
  </article>
);

export const MaragonV2SectionView: React.FC<{ frame: SevenPointFrameView }> = ({ frame }) => {
  const progress = calibrationProgress(frame.points, frame.fivePointMean);
  const scoredCount = frame.points.filter((point) => point.status === 'scored').length;
  const shape = frame.polygon && sevenPointPolygonAllowed(frame.points);
  const overallNames = frame.overallBand ? SEVEN_POINT_BAND_LABEL[frame.overallBand] : null;
  const overallDraft = Boolean(frame.overallBand && frame.template);
  const one = levelOneNote(frame);
  const lowScored = frame.points.some((point) => point.band && point.confidence === 'low');
  const coreScored = new Set(frame.points.filter((point) => point.band && (SEVEN_POINT_CORE as readonly string[]).includes(point.code)).map((point) => point.code));

  return (
    <div data-maragon-v2="true" data-template-profile={frame.template ? 'true' : 'false'} data-seven-frame={frame.profileId} style={{ color: NAVY }}>
      {frame.template ? (
        <div className="mb-4 flex justify-end">
          <span className="inline-block rounded-full border-2 px-3 py-1.5 text-[13px] font-extrabold" style={{ borderColor: GOLD, color: GOLD_INK, backgroundColor: '#FBF6E8' }} data-pilot-pill="true">{PILOT_PILL}</span>
        </div>
      ) : null}

      <section
        className="grid grid-cols-1 gap-6 rounded-[18px] bg-white px-5 py-6 shadow-[0_2px_10px_rgba(48,56,75,0.08)] md:px-8 md:py-7 lg:grid-cols-[1.35fr_1fr] lg:gap-7"
        style={{ borderLeft: `8px solid ${NAVY}` }}
        data-overall-band={frame.overallBand ?? 'none'}
        data-calibration-scored={progress.scored}
        data-calibration-of={progress.of}
      >
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
            Rezultati i përgjithshëm <Mark text="MARAGON®" /> / Overall <Mark text="MARAGON®" /> result
          </p>
          {frame.overallBand && overallNames ? (
            <>
              <p className="mt-2 text-[40px] font-extrabold leading-none md:text-[44px]" style={{ color: NAVY }} data-overall-value={frame.overallBand}>
                {frame.overallBand}
                <span className="mt-1 block text-[22px] font-semibold" style={{ color: MUTED }}>{overallNames.sq} / {overallNames.en}</span>
              </p>
              {overallDraft ? <p className="mt-2 text-[12px] font-bold" style={{ color: GOLD_INK }}>{PILOT_VALUE}</p> : null}
            </>
          ) : (
            <p className="mt-2 text-[40px] font-extrabold leading-none md:text-[44px]" style={{ color: '#7A8296' }} data-overall-value="none">
              Pa vlerësim
              <span className="mt-1 block text-[22px] font-semibold" style={{ color: '#9AA1B2' }}>Not assessed</span>
            </p>
          )}
          <p className="mt-3 inline-block rounded-lg px-3 py-1.5 text-[14px] font-semibold" style={{ backgroundColor: MIST, color: NAVY }} data-calibration-count="true">
            {frame.fivePointMean
              ? `${progress.scored} nga 5 pika kalibrimi të vlerësuara · ${progress.scored} of 5 calibration points scored`
              : `${progress.scored} nga 7 pika të vlerësuara · ${progress.scored} of 7 points scored`}
          </p>
        </div>
        <div className="text-[13.5px] leading-relaxed lg:border-l lg:pl-6" style={{ color: '#4A5366', borderColor: RULE }}>
          <p>
            <b style={{ color: NAVY }}>Vetëm brez, kurrë numër / Band only, never a number.</b>{' '}
            Gjatë kalibrimit: mesatarja me peshë të barabartë e 5 pikave / during calibration: equal-weight mean of 5 points
          </p>
          <div className="my-2.5 flex flex-wrap gap-2">
            {SEVEN_POINT_CORE.map((code) => {
              const on = coreScored.has(code);
              return (
                <span
                  key={code}
                  className="inline-flex h-[30px] w-[46px] items-center justify-center rounded-[7px] text-[13px] font-extrabold"
                  style={on
                    ? { backgroundColor: NAVY, color: '#fff', border: `2px solid ${NAVY}` }
                    : { backgroundColor: 'transparent', color: '#9AA1B2', border: '2px dashed #B9C0CD' }}
                  data-calibration-chip={code}
                  data-chip-scored={on ? 'true' : 'false'}
                >
                  {code}
                </span>
              );
            })}
          </div>
          <p>
            P2 e P6 në kalibrim 24-orësh; pas kalibrimit mesatarja kalon në 7 pika. Kërkohen të 5 pikat.
            <En>P2/P6 in 24-hour calibration; afterwards the mean moves to 7 points. All 5 required.</En>
          </p>
        </div>
      </section>

      <h3 className="mb-1 mt-8 text-[20px] font-extrabold" style={{ color: NAVY }}>
        Shtatë pikat karakteristike
        <span className="ml-2 text-[15px] font-medium" style={{ color: MUTED }}>The seven characteristic points</span>
      </h3>
      <p className="mb-3.5 text-[13px]" style={{ color: MUTED }}>Renditja P1–P7 sipas metodologjisë, jo renditje vlerësimi · Order follows the method, not a ranking</p>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {frame.points.map((point) => <PointCard key={point.code} point={point} frame={frame} />)}
        <aside className="rounded-[14px] p-4 text-[12.5px] leading-relaxed text-white" style={{ backgroundColor: NAVY }}>
          <b style={{ color: GOLD }}>Brezat / Bands</b>
          <ul className="mt-1 list-none p-0">
            {SEVEN_POINT_BAND_ORDER.map((band) => {
              const names = SEVEN_POINT_BAND_LABEL[band];
              return <li key={band}>{band} · {names.sq} / {names.en}</li>;
            })}
          </ul>
          <p className="mt-2" style={{ color: '#C9CFDA' }}>
            Pika e saktë nuk publikohet. Boshti C përjashtohet.
            <span className="block">Exact point never published. Axis C excluded.</span>
          </p>
        </aside>
      </div>

      <h3 className="mb-1 mt-8 text-[20px] font-extrabold" style={{ color: NAVY }}>
        Grafiku me shtatë boshte
        <span className="ml-2 text-[15px] font-medium" style={{ color: MUTED }}>Seven-axis graph</span>
      </h3>
      <p className="mb-3.5 text-[13px]" style={{ color: MUTED }} data-shape-rule={shape ? 'drawn' : 'markers'}>
        {shape
          ? `${scoredCount} pika me brez → forma vizatohet · ${scoredCount} banded points → shape drawn`
          : `${scoredCount} pika me brez (< 3) → pa formë/poligon; shënohen vetëm brezat · ${scoredCount} banded points (< 3) → no shape; band markers only (§5)`}
      </p>
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-white px-4 py-4 shadow-[0_1px_6px_rgba(48,56,75,0.07)] md:px-5">
          <h4 className="text-[16px] font-extrabold" style={{ color: NAVY }}>
            Shtresa 1 — Niveli individual (VIP)
            <span className="mt-0.5 block text-[13px] font-medium" style={{ color: MUTED }}>Layer 1 — individual level (VIP)</span>
          </h4>
          <div className="mx-auto mt-2 w-full max-w-[460px]">
            <MaragonSevenAxisGraph points={frame.points} />
          </div>
          <p className="mt-1.5 text-[12px] leading-snug" style={{ color: MUTED }}>
            Pa vija referuese AM-10 deri në OD-S14 · No AM-10 reference lines until OD-S14
          </p>
        </section>
        <section className="rounded-2xl bg-white px-4 py-4 shadow-[0_1px_6px_rgba(48,56,75,0.07)] md:px-5">
          <h4 className="text-[16px] font-extrabold" style={{ color: NAVY }}>
            B7 — matrica e brezave me 7 pika
            <span className="mt-0.5 block text-[13px] font-medium" style={{ color: MUTED }}>B7 — seven-point band matrix</span>
          </h4>
          <p className="mt-1.5 inline-block rounded border px-1.5 py-0.5 text-[11px] font-bold" style={{ backgroundColor: '#FBF6E8', color: GOLD_INK, borderColor: '#E6D5A6' }} data-b7-note="true">
            Interpretim yni — «B7» nuk gjendet në dosje / Our interpretation — “B7” not found in records
          </p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border-separate text-center" style={{ borderSpacing: 4 }} data-b7-matrix="true">
              <thead>
                <tr>
                  <th className="w-9" />
                  {SEVEN_POINT_BAND_ORDER.map((band) => (
                    <th key={band} className="px-0.5 text-[12px] font-extrabold" style={{ color: NAVY }}>
                      {band}
                      <div className="text-[10px] font-medium" style={{ color: MUTED }}>{SEVEN_POINT_BAND_LABEL[band].sq}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {frame.points.map((point) => (
                  <tr key={point.code}>
                    <th className="pr-1 text-left text-[12px] font-extrabold" style={{ color: NAVY }}>{point.code}</th>
                    {SEVEN_POINT_BAND_ORDER.map((band) => {
                      const hit = point.band === band;
                      const empty = !point.band;
                      return (
                        <td
                          key={band}
                          className="h-[34px] rounded-[6px] text-[15px] text-white"
                          style={hit
                            ? { backgroundColor: NAVY, boxShadow: `inset 0 -4px 0 ${GOLD}` }
                            : empty
                              ? { backgroundImage: 'repeating-linear-gradient(45deg,#F4F5F8,#F4F5F8 5px,#E7EAF0 5px,#E7EAF0 10px)' }
                              : { backgroundColor: '#F1F3F7' }}
                          data-b7-cell={hit ? 'hit' : empty ? 'empty' : 'open'}
                        >
                          {hit ? '●' : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-1.5 text-[12px] leading-snug" style={{ color: MUTED }}>
            ● = brezi i caktuar{lowScored ? ' (besueshmëri e ulët)' : ''} · band assigned{lowScored ? ' (low confidence)' : ''}
            {' · '}vija = Pa vlerësim / hatched = not assessed
          </p>
        </section>
      </div>

      <h3 className="mb-3 mt-8 text-[20px] font-extrabold" style={{ color: NAVY }}>
        Tre nivelet e vlerësimit, krah për krah
        <span className="ml-2 text-[15px] font-medium" style={{ color: MUTED }}>Three rating levels, side by side</span>
      </h3>
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
        <LevelColumn
          level="Niveli 1"
          title="VIP — individual"
          subtitle="VIP rating · = Shtresa 1 / Layer 1"
          rows={frame.points.map((point) => ({ code: point.code, band: point.band }))}
          noteSq={one.sq}
          noteEn={one.en}
        />
        <LevelColumn
          level="Niveli 2"
          title="Ndër kolegë"
          subtitle="Rating among peers"
          rows={frame.points.map((point) => ({ code: point.code, band: null }))}
          noteSq={LEVEL_TWO_NOTE.sq}
          noteEn={LEVEL_TWO_NOTE.en}
        />
        <LevelColumn
          level="Niveli 3"
          title="Ndërkombëtar"
          subtitle="International rating"
          rows={frame.points.map((point) => ({ code: point.code, band: null }))}
          noteSq={LEVEL_THREE_NOTE.sq}
          noteEn={LEVEL_THREE_NOTE.en}
        />
      </div>

      <footer className="mt-5 border-t pt-3 text-[11.5px] leading-relaxed" style={{ borderColor: HAIR, color: MUTED }} data-maragon-source="true">
        {frame.template ? (
          <>Burimi / Source: RPT-COM-MARAGON-SEVEN-POINT-PILOT-FEVZIU-v0.1-20261127 (mostër 24 episode «Opinion», 28.05–26.11.2026) · </>
        ) : (
          <>Burimi / Source: </>
        )}
        STD-COM-MARAGON-SEVEN-POINT-FRAME-v2.0-20261127 (nënshkruar / signed) §5, OD-S10, OD-S13, OD-S14.{' '}
        <Mark text="MARAGON®" /> është i ndarë nga <Mark text="PARAGON®" /> · <Mark text="MARAGON®" /> is separate from <Mark text="PARAGON®" />.
        {' '}Asnjë numër i shpikur, asnjë vlerë mock · No invented numbers, no mock values.
      </footer>
    </div>
  );
};

export const MaragonV2ProfileSection: React.FC<{ profileId: string; now?: Date }> = ({ profileId, now }) => (
  <MaragonV2SectionView frame={visibleSevenPointFrame(profileId, now)} />
);
