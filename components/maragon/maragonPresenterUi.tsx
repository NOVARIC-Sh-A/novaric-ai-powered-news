import React from 'react';
import {
  MARAGON_BAND_LABELS,
  MARAGON_CONFIDENCE_LABELS,
  MARAGON_STATUS_LABELS,
  AM09_PUBLIC_LABEL,
  notAssessedLabel,
  type MaragonBandKey,
  type MaragonConfidence,
  type MaragonAssessmentStatus,
} from '../../utils/maragonPublication';
import type { MaragonPresenterIndicator, MaragonPresenterRecord, MaragonPillar } from './maragonPresenterTypes';
import type { MaragonBenchmarkSeries } from './maragonBenchmarkTypes';
import { officialIndicatorDecision, provisionalIndicatorDecision } from '../../utils/maragonPublicationDecision';
import {
  MARAGON_BENCHMARKS,
  MARAGON_BENCHMARK_AWAITING_NOTE,
  MARAGON_RADAR_LEGEND,
  SIGNED_BENCHMARK_AMENDMENT_IDS,
  isPlottableBenchmarkPoint,
} from '../../data/maragon/benchmarks';

/* NOVARIC® Media House tokens (sampled from media.novaric.al, 21.11.2026: header/footer #e4191e,
 * body #f1f5f9, Helvetica/Arial). Formal light theme. Contrast (WCAG 2.x) on white:
 * NAVY 11.7:1, MUTED 7.7:1, RED 4.7:1 (bold only). CYAN is an accent (rules, rings, focus) and is used
 * as text only on NAVY (5.4:1), never on white (2.2:1). */
export const NAVY = '#30384B';
export const RED = '#e4191e';
export const CYAN = '#37bdee';
export const MUTED = '#4b5366';
export const PAGE_BG = '#f1f5f9';
export const SURFACE = '#ffffff';
export const LINE = '#d5dbe3';
export const TINT = '#eef2f6';
export const CYAN_TINT = '#eaf7fd';
export const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';
/** The NOVARIC® hexagon logo, same asset as the site header (components/Header.tsx). */
export const NOVARIC_LOGO_URL = 'https://novaric.co/wp-content/uploads/2025/07/NOVARIC-Logos_Master-WB-R_12062025_500x500.webp';

export const NovaricLogo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <img src={NOVARIC_LOGO_URL} alt="NOVARIC®" width={size} height={size} style={{ width: size, height: size }} className="flex-shrink-0 object-contain" />
);

/** Small uppercase label: 12px, bold, normal tracking (no mono). */
export const LABEL_CLASS = 'text-[12px] font-bold uppercase tracking-[0.04em]';

export type Lang = 'sq' | 'en';
/** 'public' applies every gate. 'internal' = dev preview (?maragonPreview=1), still labelled PROVIZOR. */
export type DisplayMode = 'public' | 'internal';

/** Reads the MARAGON® presenter record from a profile, if present. */
export function getPresenterRecord(profile: unknown): MaragonPresenterRecord | null {
  const rec = (profile as { maragonPresenter?: MaragonPresenterRecord } | null)?.maragonPresenter;
  return rec && typeof rec === 'object' && Array.isArray(rec.maragon?.indicators) ? rec : null;
}

/** Name SURNAME. Local helper, not the PARAGON® formatter. */
export function formatNameSurname(given: string, family: string): string {
  const g = (given || '').trim();
  const f = (family || '').trim().toLocaleUpperCase('sq');
  return `${g} ${f}`.trim() || 'I PAIDENTIFIKUAR';
}

/** "Blendi Fevziu" / "Blendi FEVZIU" → "Blendi FEVZIU" (last token upper-cased). */
export function nameSurnameFromFull(full: string): string {
  const parts = (full || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return (full || '').trim();
  const last = parts.pop() as string;
  return `${parts.join(' ')} ${last.toLocaleUpperCase('sq')}`;
}

export interface VisibleBand {
  band: MaragonBandKey | null;
  confidence: MaragonConfidence | null;
  indicative: boolean;
  notApplicable: boolean;
}

/**
 * §6.5, §7, §10 and AM-09 in one place.
 * Official band: only when the profile is approved, public display is authorised, scoring is not
 * suspended, the right of reply is completed and confidence is medium or high.
 * Indicative band: only with written AM-09 approval of this profile (public) or in the internal preview.
 */
export function visibleIndicatorBand(rec: { maragon: MaragonPresenterRecord['maragon'] }, ind: MaragonPresenterIndicator | undefined, mode: DisplayMode): VisibleBand {
  const none: VisibleBand = { band: null, confidence: null, indicative: false, notApplicable: false };
  if (!ind) return none;
  if (ind.status === 'not_applicable') return { ...none, notApplicable: true };
  const m = rec.maragon;
  if (m.assessmentStatus === 'withheld' || m.assessmentStatus === 'suspended') return none;
  if (officialIndicatorDecision(m, ind).open) {
    return { band: ind.officialBand, confidence: ind.confidence, indicative: false, notApplicable: false };
  }
  if (!ind.indicativeBand) return none;
  if (mode === 'internal' || provisionalIndicatorDecision(m, ind).open) {
    return { band: ind.indicativeBand, confidence: ind.confidence, indicative: true, notApplicable: false };
  }
  return none;
}

export function bandText(v: VisibleBand, lang: Lang): string {
  if (v.notApplicable) return lang === 'en' ? 'Not applicable' : 'Nuk aplikohet';
  if (!v.band) return notAssessedLabel(lang);
  return MARAGON_BAND_LABELS[v.band][lang];
}

/** Renders "NOVARIC®" / "MARAGON®" / "PARAGON®" with the shared registered-mark superscript. */
export const Mark: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split('®');
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index < parts.length - 1 ? part.replace(/\s+$/, '') : part}
          {index < parts.length - 1 ? <sup aria-hidden="true" className="registered-mark">®</sup> : null}
        </React.Fragment>
      ))}
    </>
  );
};

/** Silhouette placeholder: no likeness is shown without a documented licence. */
export const AwaitingPhoto: React.FC<{ label?: string; className?: string }> = ({ label, className }) => (
  <div className={`relative w-full h-full ${className || ''}`} aria-label={label} role="img">
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <rect width="100" height="100" fill={TINT} />
      <circle cx="50" cy="38" r="17" fill="#b7c0cd" />
      <path d="M18 92c2-20 15-31 32-31s30 11 32 31z" fill="#b7c0cd" />
    </svg>
  </div>
);

export const StatusBadge: React.FC<{ status: MaragonAssessmentStatus; lang: Lang; dark?: boolean }> = ({ status, lang, dark = false }) => {
  const l = MARAGON_STATUS_LABELS[status] || MARAGON_STATUS_LABELS.not_assessed;
  const other: Lang = lang === 'sq' ? 'en' : 'sq';
  const approved = status === 'approved';
  const alert = status === 'withheld' || status === 'suspended';
  const style: React.CSSProperties = approved
    ? { backgroundColor: NAVY, color: '#ffffff', borderColor: NAVY }
    : dark
      ? { backgroundColor: 'transparent', color: '#ffffff', borderColor: '#ffffff' }
      : { backgroundColor: SURFACE, color: alert ? RED : NAVY, borderColor: alert ? RED : NAVY };
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded border text-[12px] font-bold whitespace-nowrap" style={style}>
      {approved && <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: CYAN }} />}
      {l[lang]}<span className="font-normal">&nbsp;/ {l[other]}</span>
    </span>
  );
};

/** Band pill: band (+ confidence) or "Pa vlerësim". Indicative bands carry an asterisk and a red border. */
export const BandPill: React.FC<{ v: VisibleBand; lang: Lang; size?: 'sm' | 'md' }> = ({ v, lang, size = 'sm' }) => {
  const shown = !!v.band;
  const style: React.CSSProperties = !shown
    ? { backgroundColor: TINT, color: NAVY, borderColor: LINE }
    : v.indicative
      ? { backgroundColor: SURFACE, color: RED, borderColor: RED }
      : { backgroundColor: CYAN_TINT, color: NAVY, borderColor: CYAN };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border font-bold ${size === 'md' ? 'px-3 py-1 text-[15px]' : 'px-2 py-0.5 text-[13px]'}`}
      style={style}
      title={v.indicative ? `${AM09_PUBLIC_LABEL.sq} · ${AM09_PUBLIC_LABEL.en}` : undefined}
    >
      {bandText(v, lang)}
      {v.indicative && '*'}
      {shown && v.confidence && v.confidence !== 'none' && (
        <span className="font-normal" style={{ color: MUTED }}>· {MARAGON_CONFIDENCE_LABELS[v.confidence][lang]}</span>
      )}
    </span>
  );
};

export const ProvisionalRibbon: React.FC = () => (
  <div className="text-white text-[13px] font-bold uppercase tracking-[0.04em] px-3 py-1.5 rounded text-center" style={{ backgroundColor: RED }}>
    {AM09_PUBLIC_LABEL.sq} · <span className="font-bold">{AM09_PUBLIC_LABEL.en}</span>
  </div>
);

/** Internal-only flag for official photos still awaiting the owner's visual confirmation. The photo stays displayed. */
export const ConfirmationFlag: React.FC<{ lang: Lang }> = ({ lang }) => (
  <div
    className="text-[12px] font-bold uppercase tracking-[0.04em] px-2 py-1 rounded border text-center"
    style={{ backgroundColor: TINT, color: NAVY, borderColor: LINE }}
  >
    {lang === 'en' ? 'Awaiting confirmation' : 'Në pritje konfirmimi'}
  </div>
);

/** Unknown fact: never invent a value. */
export function unverifiedLabel(lang: Lang): string {
  return lang === 'en' ? 'Not verified' : 'E paverifikuar';
}

export function factText(value: string | number | null | undefined, lang: Lang): string {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) return unverifiedLabel(lang);
  return String(value);
}

/** Pending-review label for the internal assessment section (not the AM-09 public-gate wording). */
export const REVIEW_PROVISIONAL_LABEL = {
  sq: 'PROVIZOR · në shqyrtim' as const,
  en: 'PROVISIONAL · under review' as const,
};

export const ReviewProvisionalRibbon: React.FC<{ lang: Lang }> = ({ lang }) => (
  <div className="text-white text-[13px] font-bold uppercase tracking-[0.04em] px-3 py-1.5 rounded text-center" style={{ backgroundColor: RED }}>
    {REVIEW_PROVISIONAL_LABEL.sq} · <span className="font-bold">{REVIEW_PROVISIONAL_LABEL.en}</span>
  </div>
);

const PILLARS: MaragonPillar[] = ['R', 'A', 'G', 'O'];

/** Stroke and dash for the three radar series. Colour is never the only distinction. */
export const MARAGON_RADAR_SERIES_STYLE = {
  presenter: { stroke: '#30384B', dash: null, fill: 'rgba(48,56,75,0.12)', indicativeStroke: '#e4191e', indicativeDash: '4 3', indicativeFill: 'rgba(228,25,30,0.12)' },
  albania_expected: { stroke: '#C05621', dash: '6 4', fill: 'none' },
  europe_industry: { stroke: '#5B3A9E', dash: '2 3', fill: 'none' },
} as const;

type RadarVertex = { i: number; level: number };

function indicatorAliases(ind: { id: string; code: string }): Set<string> {
  return new Set([ind.id, ind.code, `maragon:${ind.code}`, ind.id.replace(/^maragon:/, '')]);
}

function contiguousRuns(indexes: number[], count: number): number[][] {
  const present = new Set(indexes);
  const runs: number[][] = [];
  let current: number[] = [];
  for (let i = 0; i < count; i += 1) {
    if (present.has(i)) current.push(i);
    else if (current.length) {
      runs.push(current);
      current = [];
    }
  }
  if (current.length) runs.push(current);
  return runs;
}

function RadarSeriesMarks({
  seriesId,
  vertices,
  count,
  stroke,
  dash,
  fill,
  pointFill,
  pointR,
  R,
  pt,
}: {
  seriesId: string;
  vertices: RadarVertex[];
  count: number;
  stroke: string;
  dash: string | null;
  fill: string;
  pointFill: string;
  pointR: number;
  R: number;
  pt: (i: number, r: number) => readonly [number, number];
}) {
  const drawable = vertices.filter((vertex) => vertex.level > 0);
  if (!drawable.length) return null;
  const byIndex = new Map(drawable.map((vertex) => [vertex.i, vertex.level]));
  const coord = (index: number) => pt(index, (R * (byIndex.get(index) as number)) / 5);
  const runs = contiguousRuns(drawable.map((vertex) => vertex.i), count);
  return (
    <g data-radar-series={seriesId}>
      {runs.map((run) => {
        const points = run.map((index) => coord(index).join(',')).join(' ');
        if (run.length >= 3) {
          return (
            <polygon
              key={`${seriesId}-poly-${run[0]}`}
              data-radar-mark="polygon"
              points={points}
              fill={fill}
              stroke={stroke}
              strokeWidth={1.6}
              strokeDasharray={dash ?? undefined}
            />
          );
        }
        if (run.length === 2) {
          return (
            <polyline
              key={`${seriesId}-line-${run[0]}`}
              data-radar-mark="segment"
              points={points}
              fill="none"
              stroke={stroke}
              strokeWidth={1.6}
              strokeDasharray={dash ?? undefined}
            />
          );
        }
        return null;
      })}
      {drawable.map((vertex) => {
        const [x, y] = coord(vertex.i);
        const radius = (R * vertex.level) / 5;
        return (
          <circle
            key={`${seriesId}-pt-${vertex.i}`}
            data-radar-mark="point"
            data-level={vertex.level}
            data-radius={radius.toFixed(2)}
            cx={x}
            cy={y}
            r={pointR}
            fill={pointFill}
            stroke={stroke}
            strokeWidth={seriesId === 'presenter' ? 0 : 1.4}
          />
        );
      })}
    </g>
  );
}

function legendLine(id: string, labelSq: string, labelEn: string, note: string | null, stroke?: string, dash?: string | null) {
  const style = id === 'presenter'
    ? MARAGON_RADAR_SERIES_STYLE.presenter
    : MARAGON_RADAR_SERIES_STYLE[id as 'albania_expected' | 'europe_industry'];
  const lineStroke = stroke ?? style.stroke;
  const lineDash = dash === undefined ? style.dash : dash;
  const title = note ?? `${labelSq} / ${labelEn}`;
  return (
    <li key={id} className="flex items-start gap-2" title={title}>
      <svg width="36" height="10" aria-hidden="true" className="mt-1 flex-shrink-0">
        <line
          x1="0"
          y1="5"
          x2="36"
          y2="5"
          stroke={lineStroke}
          strokeWidth="2"
          strokeDasharray={lineDash ?? undefined}
          data-radar-swatch={id}
        />
      </svg>
      <span>
        <span className="font-bold">{labelSq}</span>
        <span style={{ color: MUTED }}>{' / '}{labelEn}</span>
        {note ? <span className="block" style={{ color: MUTED }}>{note}</span> : null}
      </span>
    </li>
  );
}

/** Ten-axis band radar. Plain SVG, five rings, no numbers. Hidden slots are never drawn as zero. */
export const BandRadar: React.FC<{
  rec: { maragon: MaragonPresenterRecord['maragon'] };
  mode: DisplayMode;
  size?: number;
  lang: Lang;
  benchmarks?: MaragonBenchmarkSeries[];
  /** Signed benchmark amendments. Defaults to the signed list (empty today); tests may inject a fixture id. */
  signedBenchmarkAmendments?: readonly string[];
}> = ({ rec, mode, size = 260, lang, benchmarks = MARAGON_BENCHMARKS, signedBenchmarkAmendments = SIGNED_BENCHMARK_AMENDMENT_IDS }) => {
  const inds = rec.maragon.indicators.filter((ind) => ind.id !== 'maragon:C' && ind.code !== 'C');
  const n = inds.length || 10;
  const c = size / 2;
  const R = size * 0.34;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, r: number) => [c + r * Math.cos(angle(i)), c + r * Math.sin(angle(i))] as const;
  const vis = inds.map((ind) => visibleIndicatorBand(rec, ind, mode));
  const shown: Array<RadarVertex & { indicative: boolean }> = vis
    .map((v, i) => (v.band && MARAGON_BAND_LABELS[v.band].level > 0
      ? { i, level: MARAGON_BAND_LABELS[v.band].level, indicative: v.indicative }
      : null))
    .filter((vertex): vertex is RadarVertex & { indicative: boolean } => vertex !== null);
  const indicative = shown.some((vertex) => vertex.indicative);
  const presenterStyle = MARAGON_RADAR_SERIES_STYLE.presenter;
  const benchmarkVertices = (id: MaragonBenchmarkSeries['id']): RadarVertex[] => {
    const seriesRecord = benchmarks.find((item) => item.id === id);
    return inds.flatMap((ind, index) => {
      const point = seriesRecord?.points.find((item) => indicatorAliases(ind).has(item.indicatorId));
      if (!isPlottableBenchmarkPoint(seriesRecord, point, signedBenchmarkAmendments) || !point?.band) return [];
      const level = MARAGON_BAND_LABELS[point.band].level;
      return level > 0 ? [{ i: index, level }] : [];
    });
  };
  const albania = benchmarkVertices('albania_expected');
  const europe = benchmarkVertices('europe_industry');
  const caption = 'Tre linja: vlerësimi i prezantuesit, standardi i pritur në Shqipëri, standardi i industrisë evropiane / ndërkombëtare. Linjat pa vlerë të miratuara nuk vizatohen si zero. / Three lines: the presenter\'s assessment, the expected standard in Albania, and the European / international industry standard. Lines without an approved value are not drawn as zero.';
  return (
    <figure className="m-0 flex flex-col gap-3" data-maragon-radar="three-level">
      <div className="w-full aspect-square">
        <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" role="img" aria-label={caption}>
          {[1, 2, 3, 4, 5].map((k) => (
            <polygon key={k} data-radar-ring={k} points={inds.map((_, i) => pt(i, (R * k) / 5).join(',')).join(' ')}
              fill={k === 5 ? TINT : 'none'} stroke={k === 3 ? CYAN : LINE} strokeWidth={k === 5 ? 1.2 : 0.8} />
          ))}
          {inds.map((_, i) => {
            const [x, y] = pt(i, R);
            return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke={LINE} strokeWidth={0.8} />;
          })}
          {PILLARS.map((p) => {
            const idxs = inds.map((m, i) => (m.pillar === p ? i : -1)).filter((i) => i >= 0);
            if (!idxs.length) return null;
            const mid = (idxs[0] + idxs[idxs.length - 1]) / 2;
            const [x, y] = pt(mid, R * 1.45);
            return <text key={p} x={x} y={y} fill={NAVY} fontSize={size * 0.06} fontWeight={700} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT}>{p}</text>;
          })}
          {inds.map((ind, i) => {
            const [x, y] = pt(i, R * 1.18);
            return <text key={ind.id} x={x} y={y} fill={MUTED} fontSize={size * 0.042} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT}>{ind.code.replace('ind:', '')}</text>;
          })}
          <RadarSeriesMarks
            seriesId="europe_industry"
            vertices={europe}
            count={n}
            stroke={MARAGON_RADAR_SERIES_STYLE.europe_industry.stroke}
            dash={MARAGON_RADAR_SERIES_STYLE.europe_industry.dash}
            fill={MARAGON_RADAR_SERIES_STYLE.europe_industry.fill}
            pointFill="none"
            pointR={size * 0.018}
            R={R}
            pt={pt}
          />
          <RadarSeriesMarks
            seriesId="albania_expected"
            vertices={albania}
            count={n}
            stroke={MARAGON_RADAR_SERIES_STYLE.albania_expected.stroke}
            dash={MARAGON_RADAR_SERIES_STYLE.albania_expected.dash}
            fill={MARAGON_RADAR_SERIES_STYLE.albania_expected.fill}
            pointFill="none"
            pointR={size * 0.018}
            R={R}
            pt={pt}
          />
          <RadarSeriesMarks
            seriesId="presenter"
            vertices={shown}
            count={n}
            stroke={indicative ? presenterStyle.indicativeStroke : presenterStyle.stroke}
            dash={indicative ? presenterStyle.indicativeDash : presenterStyle.dash}
            fill={indicative ? presenterStyle.indicativeFill : presenterStyle.fill}
            pointFill={indicative ? RED : NAVY}
            pointR={size * 0.016}
            R={R}
            pt={pt}
          />
          {!shown.length && (
            <text x={c} y={c} fill={NAVY} fontSize={size * 0.05} fontWeight={700} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT}>
              {notAssessedLabel(lang)}
            </text>
          )}
        </svg>
      </div>
      <ul className="flex flex-col gap-2 text-[12px] leading-snug list-none m-0 p-0" style={{ color: NAVY }} aria-label={lang === 'en' ? 'Radar legend' : 'Legjenda e grafikut'}>
        {legendLine(
          'presenter',
          MARAGON_RADAR_LEGEND.presenter.sq,
          MARAGON_RADAR_LEGEND.presenter.en,
          shown.length === 0 ? 'Pa vlerësim / Not assessed' : null,
          indicative ? presenterStyle.indicativeStroke : presenterStyle.stroke,
          indicative ? presenterStyle.indicativeDash : presenterStyle.dash,
        )}
        {legendLine('albania_expected', MARAGON_RADAR_LEGEND.albania_expected.sq, MARAGON_RADAR_LEGEND.albania_expected.en, albania.length === 0 ? MARAGON_BENCHMARK_AWAITING_NOTE.sq : null)}
        {legendLine('europe_industry', MARAGON_RADAR_LEGEND.europe_industry.sq, MARAGON_RADAR_LEGEND.europe_industry.en, europe.length === 0 ? MARAGON_BENCHMARK_AWAITING_NOTE.sq : null)}
      </ul>
      <figcaption className="text-[12px] leading-snug" style={{ color: MUTED }}>{caption}</figcaption>
    </figure>
  );
};
