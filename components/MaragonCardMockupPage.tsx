import React, { useState } from 'react';
import { MARAGON_INDICATORS, type MaragonIndicator } from '../data/maragonIndicators';
import { getLineageForMetric, getLineageForMethodStep } from '../data/analyticalMappings';

/**
 * Specification mockup only. The example bands below are not assessments,
 * do not read or write methodologyApproved, and are not used by any profile.
 */
const CANONICAL_CODES = ['R1.1', 'R1.2', 'A2.1', 'A2.2', 'A2.3', 'A2.4', 'G3.1', 'G3.2', 'O4.1', 'O4.2'] as const;

type AxisCode = 'R' | 'A' | 'G' | 'O';
type BandKey = 'weak' | 'moderate' | 'strong';

const EXAMPLE_ROWS: Array<{
  code: AxisCode;
  sq: string;
  en: string;
  band: BandKey;
  bandSq: string;
  bandEn: string;
  confidenceSq: string;
  confidenceEn: string;
  evidence: number;
}> = [
  { code: 'R', sq: 'Gatishmëria', en: 'Readiness', band: 'strong', bandSq: 'E fortë', bandEn: 'Strong', confidenceSq: 'e lartë', confidenceEn: 'high', evidence: 12 },
  { code: 'A', sq: 'Aftësia', en: 'Aptitude', band: 'strong', bandSq: 'E fortë', bandEn: 'Strong', confidenceSq: 'e lartë', confidenceEn: 'high', evidence: 9 },
  { code: 'G', sq: 'Qeverisja', en: 'Governance', band: 'moderate', bandSq: 'Mesatare', bandEn: 'Moderate', confidenceSq: 'e lartë', confidenceEn: 'high', evidence: 7 },
  { code: 'O', sq: 'Kujdesi Mbikëqyrës', en: 'Oversight Nurturing', band: 'moderate', bandSq: 'Mesatare', bandEn: 'Moderate', confidenceSq: 'e mesme', confidenceEn: 'moderate', evidence: 5 },
];

const EXAMPLE_INDICATOR_BAND: Record<string, { bandSq: string; bandEn: string; confidenceSq: string; confidenceEn: string }> = {
  'R1.1': { bandSq: 'E fortë', bandEn: 'Strong', confidenceSq: 'e lartë', confidenceEn: 'high' },
  'R1.2': { bandSq: 'E fortë', bandEn: 'Strong', confidenceSq: 'e lartë', confidenceEn: 'high' },
  'A2.1': { bandSq: 'E fortë', bandEn: 'Strong', confidenceSq: 'e lartë', confidenceEn: 'high' },
  'A2.2': { bandSq: 'Mesatare', bandEn: 'Moderate', confidenceSq: 'e lartë', confidenceEn: 'high' },
  'A2.3': { bandSq: 'Mesatare', bandEn: 'Moderate', confidenceSq: 'e mesme', confidenceEn: 'moderate' },
  'A2.4': { bandSq: 'E fortë', bandEn: 'Strong', confidenceSq: 'e lartë', confidenceEn: 'high' },
  'G3.1': { bandSq: 'Mesatare', bandEn: 'Moderate', confidenceSq: 'e mesme', confidenceEn: 'moderate' },
  'G3.2': { bandSq: 'E fortë', bandEn: 'Strong', confidenceSq: 'e lartë', confidenceEn: 'high' },
  'O4.1': { bandSq: 'Mesatare', bandEn: 'Moderate', confidenceSq: 'e mesme', confidenceEn: 'moderate' },
  'O4.2': { bandSq: 'E fortë', bandEn: 'Strong', confidenceSq: 'e lartë', confidenceEn: 'high' },
};

const NAVY = '#30384B';
const RINGS: Array<{ radius: number; sq: string; en: string }> = [
  { radius: 0.28, sq: 'Pa vlerësim', en: 'Not assessed' },
  { radius: 0.5, sq: 'E dobët', en: 'Weak' },
  { radius: 0.75, sq: 'Mesatare', en: 'Moderate' },
  { radius: 1, sq: 'E fortë', en: 'Strong' },
];
const BAND_RADIUS: Record<BandKey, number> = { weak: 0.5, moderate: 0.75, strong: 1 };

function canonicalIndicators(): MaragonIndicator[] {
  return CANONICAL_CODES.map((code) => MARAGON_INDICATORS.find((item) => item.code === code && item.scope === 'outlet'))
    .filter((item): item is MaragonIndicator => Boolean(item));
}

function Brand({ name }: { name: 'NOVARIC' | 'MARAGON' }) {
  return (
    <span className="novaric-brand">
      {name}
      <sup aria-hidden="true" className="registered-mark">®</sup>
    </span>
  );
}

function polar(index: number, radius: number, cx: number, cy: number, maxR: number): [number, number] {
  const angle = -Math.PI / 2 + index * (Math.PI / 2);
  return [cx + Math.cos(angle) * radius * maxR, cy + Math.sin(angle) * radius * maxR];
}

function BandRadar({ traced }: { traced: boolean }) {
  const cx = 100;
  const cy = 100;
  const maxR = 62;
  const trace = traced
    ? EXAMPLE_ROWS.map((row, index) => polar(index, BAND_RADIUS[row.band], cx, cy, maxR))
    : [];
  const tracePath = trace.length ? `${trace.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0].toFixed(1)} ${point[1].toFixed(1)}`).join(' ')} Z` : '';
  return (
    <div className="relative mx-auto h-36 w-36">
      <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={traced ? 'Shembull i gjurmës sipas brezave / Example band trace' : 'Rrjetë pa vlerësim / Unassessed grid'}>
        <circle cx={cx} cy={cy} r={maxR + 8} fill="#F8FAFC" />
        {RINGS.map((ring) => (
          <circle key={ring.sq} cx={cx} cy={cy} r={ring.radius * maxR} fill="none" stroke="#CBD5E1" strokeWidth="1" />
        ))}
        {EXAMPLE_ROWS.map((row, index) => {
          const [x, y] = polar(index, 1, cx, cy, maxR);
          return <line key={row.code} x1={cx} y1={cy} x2={x} y2={y} stroke="#CBD5E1" strokeWidth="1" />;
        })}
        {RINGS.map((ring) => (
          <text key={ring.en} x={cx - 58} y={cy + 4 - ring.radius * maxR} fill="#64748B" fontSize="7">
            {ring.sq}
          </text>
        ))}
        {EXAMPLE_ROWS.map((row, index) => {
          const [x, y] = polar(index, 1.18, cx, cy, maxR);
          return (
            <text key={row.code} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={traced ? NAVY : '#64748B'} fontSize="11" fontWeight="700">
              {row.code}
            </text>
          );
        })}
        {traced ? (
          <>
            <path d={tracePath} fill="rgba(48,56,75,0.16)" stroke={NAVY} strokeWidth="2.5" />
            {trace.map((point, index) => (
              <circle key={EXAMPLE_ROWS[index].code} cx={point[0]} cy={point[1]} r="3.2" fill={NAVY} />
            ))}
          </>
        ) : null}
      </svg>
      {traced ? null : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="max-w-[7.5rem] rounded-md bg-slate-900/80 px-2 py-1 text-center text-[11px] font-bold leading-tight text-slate-200">Pa vlerësim / Not assessed</p>
        </div>
      )}
    </div>
  );
}

function Portrait({ approved }: { approved: boolean }) {
  return (
    <div className={`relative mx-auto h-28 w-28 rounded-full border-2 p-1 ${approved ? 'border-slate-500' : 'border-slate-600'}`}>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-slate-900 text-slate-400">
        <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
          <rect x="8" y="16" width="30" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16 32l5-6 4 4 3-3 6 5" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="40" y="22" width="8" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M48 26h6M48 30h5" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <span className={`absolute -bottom-2 left-1/2 w-max -translate-x-1/2 rounded-md border px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wide ${approved ? 'border-slate-500 bg-slate-900 text-white' : 'border-slate-600 bg-slate-800 text-slate-300'}`} style={approved ? { backgroundColor: NAVY, borderColor: NAVY } : undefined}>
        {approved ? 'Miratuar / Approved' : 'Pa vlerësim / Not assessed'}
      </span>
    </div>
  );
}

function Dock({ approved }: { approved: boolean }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-800 bg-slate-900/95 px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-base font-black tracking-tight text-white">Shembull PROFILI</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Top Story · Top Channel</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <label className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-slate-400" title={approved ? 'Shembull / Example' : 'Vetëm për profile të miratuara / Approved profiles only'}>
          <input
            type="checkbox"
            checked={approved ? checked : false}
            disabled={!approved}
            onChange={(event) => {
              if (approved) setChecked(event.target.checked);
            }}
            className="h-3 w-3 rounded-sm border border-slate-500 bg-transparent disabled:cursor-not-allowed"
          />
          Krahaso
        </label>
        <button type="button" className="rounded-sm border px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white" style={{ borderColor: NAVY, backgroundColor: NAVY }}>
          Analiza
        </button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <p className="border-t border-slate-800 px-3 py-2 text-[10px] text-slate-500">
      <Brand name="NOVARIC" /> Sh.A. · media.novaric.al
    </p>
  );
}

function CardFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="flex w-full max-w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="flex items-start justify-between gap-2 px-3 pt-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Shembull / Example</p>
          <h2 className="text-sm font-bold text-white">{title}</h2>
        </div>
        <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-300">
          <Brand name="MARAGON" />
        </span>
      </header>
      {children}
    </article>
  );
}

function ApprovedFront() {
  return (
    <CardFrame title="Ballina e miratuar / Approved front">
      <div className="px-3 pb-2 pt-3">
        <Portrait approved />
        <p className="mt-4 text-center text-[10px] text-slate-400">Foto në verifikim / Photo pending verification</p>
        <BandRadar traced />
        <ul className="mt-1 space-y-1">
          {EXAMPLE_ROWS.map((row) => (
            <li key={row.code} className="rounded border border-slate-800 bg-slate-900 px-2 py-1">
              <p className="text-[11px] font-bold text-white">
                {row.code} · {row.sq} / {row.en}
                <span className="float-right font-semibold text-slate-300">{row.bandSq} / {row.bandEn}</span>
              </p>
              <p className="text-[10px] text-slate-400">
                Besueshmëri: {row.confidenceSq} / Confidence: {row.confidenceEn}
                <span className="mx-1">·</span>
                {row.evidence} prova / {row.evidence} evidence items
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-2 rounded-full border border-slate-600 bg-slate-800 px-2 py-1 text-center text-[10px] font-semibold text-slate-300">
          Boshti C · Nuk vlerësohet / Axis C · Unscored
        </p>
        <div className="mt-2 flex gap-2">
          <button type="button" className="flex-1 rounded border border-slate-600 px-2 py-1 text-[10px] font-semibold text-slate-200">
            Shiko prejardhjen / View lineage
          </button>
          <button type="button" className="flex-1 rounded px-2 py-1 text-[10px] font-semibold text-white" style={{ backgroundColor: NAVY }}>
            Raporti i plotë / Full report
          </button>
        </div>
        <p className="mt-2 text-[10px] text-slate-400">E drejta e përgjigjes: 10 ditë pune / Right of reply: 10 working days</p>
      </div>
      <Dock approved />
      <Footer />
    </CardFrame>
  );
}

function LineageTrail({ indicator }: { indicator: MaragonIndicator }) {
  const metricId = indicator.related_metric_ids[0];
  const metric = metricId ? getLineageForMetric(metricId) : undefined;
  const stepId = indicator.methodology_step_ids[0];
  const step = stepId ? getLineageForMethodStep(stepId) : undefined;
  const standard = indicator.standard_clause_ids[0] || metric?.standard_clause_ids[0] || '—';
  const steps = [
    { k: 'Standard', v: standard },
    { k: 'Method', v: step?.name_sq || stepId || '—' },
    { k: 'Indicator', v: `${indicator.code} · ${indicator.title}` },
    { k: 'Evidence', v: 'Shembull prove / Example evidence item' },
  ];
  return (
    <ol className="space-y-1 border-l border-slate-600 pl-2">
      {steps.map((stepItem, index) => (
        <li key={stepItem.k} className="text-[10px] leading-snug text-slate-300">
          <span className="font-bold text-white">{index + 1}. {stepItem.k}</span>
          <span className="mt-0.5 block text-slate-400">{stepItem.v}</span>
        </li>
      ))}
    </ol>
  );
}

function ApprovedBack() {
  const [open, setOpen] = useState<string | null>('R1.1');
  return (
    <CardFrame title="Pasqyra e miratuar / Approved back drawer">
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-3" style={{ maxHeight: 640 }}>
        <p className="text-[10px] text-slate-400">Metodologjia v1.0 · 18 nëntor 2026 / 18 November 2026</p>
        <ul className="space-y-1">
          {canonicalIndicators().map((indicator) => {
            const band = EXAMPLE_INDICATOR_BAND[indicator.code];
            const expanded = open === indicator.code;
            return (
              <li key={indicator.code} className="rounded border border-slate-800 bg-slate-900">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-2 px-2 py-1.5 text-left"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : indicator.code)}
                >
                  <span>
                    <span className="block text-[11px] font-bold text-white">{indicator.code} · {indicator.title}</span>
                    <span className="block text-[10px] text-slate-400">
                      {band?.bandSq} / {band?.bandEn} · Besueshmëri: {band?.confidenceSq} / Confidence: {band?.confidenceEn}
                    </span>
                  </span>
                  <span aria-hidden="true" className={`mt-1 text-slate-400 ${expanded ? 'rotate-90' : ''}`}>›</span>
                </button>
                {expanded ? <div className="px-2 pb-2"><LineageTrail indicator={indicator} /></div> : null}
              </li>
            );
          })}
        </ul>
        <p className="text-[10px] text-slate-400">
          Burimet / Sources
          <span className="mt-0.5 block">Shembull i lidhjeve të metodologjisë / Example methodology links</span>
        </p>
      </div>
      <Footer />
    </CardFrame>
  );
}

function UnassessedFront() {
  return (
    <CardFrame title="Ballina pa vlerësim / Unassessed front">
      <div className="px-3 pb-2 pt-3">
        <Portrait approved={false} />
        <p className="mt-4 text-center text-[10px] text-slate-500">Foto në verifikim / Photo pending verification</p>
        <BandRadar traced={false} />
        <ul className="mt-1 space-y-1">
          {EXAMPLE_ROWS.map((row) => (
            <li key={row.code} className="rounded border border-dashed border-slate-700 px-2 py-1.5 text-slate-500">
              <p className="text-[11px]">{row.code} · {row.sq} / {row.en}</p>
              <p className="text-[10px]">Pa vlerësim / Not assessed</p>
            </li>
          ))}
        </ul>
        <p className="mt-2 rounded-full border border-dashed border-slate-600 px-2 py-1 text-center text-[10px] text-slate-500">
          Boshti C · Nuk vlerësohet / Axis C · Unscored
        </p>
        <p className="mt-2 text-[11px] leading-snug text-slate-400">
          Vlerësimi publikohet vetëm pas miratimit / Assessment is published only after approval.
        </p>
      </div>
      <Dock approved={false} />
      <Footer />
    </CardFrame>
  );
}

function UnassessedBack() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <CardFrame title="Pasqyra pa vlerësim / Unassessed back drawer">
      <ul className="space-y-1 overflow-y-auto px-3 py-3" style={{ maxHeight: 640 }}>
        {canonicalIndicators().map((indicator) => {
          const expanded = open === indicator.code;
          return (
            <li key={indicator.code} className="rounded border border-dashed border-slate-700">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 px-2 py-1.5 text-left text-slate-500"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : indicator.code)}
              >
                <span className="text-[11px]">{indicator.code} · {indicator.title} — Pa vlerësim / Not assessed</span>
                <span aria-hidden="true" className={expanded ? 'rotate-90' : ''}>›</span>
              </button>
              {expanded ? (
                <p className="px-2 pb-2 text-[10px] text-slate-500">
                  Standard → Method → Indicator → Evidence
                  <span className="mt-1 block">Pa gjurmë / No lineage</span>
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      <Footer />
    </CardFrame>
  );
}

export const MaragonCardMockupPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <main className="min-h-screen bg-[#0b1220] px-4 py-8 text-slate-100">
      <div className="mx-auto mb-6 max-w-3xl">
        <button type="button" onClick={onBack} className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          ← Kthehu / Back
        </button>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Shembull / Example</p>
        <h1 className="text-2xl font-black text-white">
          Karta <Brand name="NOVARIC" /> <Brand name="MARAGON" />
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          Specifikim i kartës së skanerit. Shembull i fiksuar, jo një vlerësim i publikuar.
        </p>
        <p className="text-sm text-slate-400">
          Scanner-card specification. A fixed example, not a published assessment.
        </p>
      </div>
      <div className="mx-auto flex max-w-[1680px] flex-col items-center gap-6 lg:flex-row lg:flex-wrap lg:items-start lg:justify-center">
        <ApprovedFront />
        <ApprovedBack />
        <UnassessedFront />
        <UnassessedBack />
      </div>
    </main>
  );
};

export default MaragonCardMockupPage;
