import React, { useState } from 'react';
import { MARAGON_INDICATORS, type MaragonIndicator } from '../data/maragonIndicators';
import { getLineageForMetric, getLineageForMethodStep } from '../data/analyticalMappings';

/**
 * Specification mockup only. The example bands below are not assessments,
 * do not read or write methodologyApproved, and are not used by any profile.
 */
const CANONICAL_CODES = ['R1.1', 'R1.2', 'A2.1', 'A2.2', 'A2.3', 'A2.4', 'G3.1', 'G3.2', 'O4.1', 'O4.2'] as const;

const EXAMPLE_ROWS = [
  { code: 'R', sq: 'Gatishmëria', en: 'Readiness', bandSq: 'E fortë', bandEn: 'Strong', confidenceSq: 'e lartë', confidenceEn: 'high', evidence: 12 },
  { code: 'A', sq: 'Aftësia', en: 'Aptitude', bandSq: 'E fortë', bandEn: 'Strong', confidenceSq: 'e lartë', confidenceEn: 'high', evidence: 9 },
  { code: 'G', sq: 'Qeverisja', en: 'Governance', bandSq: 'Mesatare', bandEn: 'Moderate', confidenceSq: 'e lartë', confidenceEn: 'high', evidence: 7 },
  { code: 'O', sq: 'Kujdesi Mbikëqyrës', en: 'Oversight Nurturing', bandSq: 'Mesatare', bandEn: 'Moderate', confidenceSq: 'e mesme', confidenceEn: 'moderate', evidence: 5 },
] as const;

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

function ExampleMark() {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
      Shembull / Example
    </p>
  );
}

function PhotoPending() {
  return (
    <div className="flex h-28 items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3">
      <svg viewBox="0 0 64 64" className="h-12 w-12 shrink-0 text-slate-400" aria-hidden="true">
        <rect x="6" y="16" width="34" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M14 34l6-7 5 5 4-4 7 6" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="23" r="2" fill="currentColor" />
        <rect x="42" y="22" width="8" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M50 26h6M50 30h6M50 34h4" stroke="currentColor" strokeWidth="2" />
        <path d="M46 40c2 6 8 8 12 8" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <p className="text-xs leading-snug text-slate-600">
        <span className="block font-semibold">Foto në verifikim</span>
        <span className="block text-slate-500">Photo pending verification</span>
      </p>
    </div>
  );
}

function Footer() {
  return (
    <p className="mt-auto border-t border-slate-200 pt-2 text-[10px] text-slate-500">
      <Brand name="NOVARIC" /> Sh.A. · media.novaric.al
    </p>
  );
}

function CardFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="flex h-[560px] w-full max-w-[380px] flex-col overflow-hidden rounded-[16px] bg-white p-4 shadow-[0_8px_24px_rgba(48,56,75,0.12)]">
      <header className="mb-2 flex items-start justify-between gap-2">
        <div>
          <ExampleMark />
          <h2 className="text-sm font-bold" style={{ color: NAVY }}>{title}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          <Brand name="MARAGON" />
        </span>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {children}
        <Footer />
      </div>
    </article>
  );
}

function ApprovedFront() {
  return (
    <CardFrame title="Ballina e miratuar / Approved front">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold" style={{ color: NAVY }}>
          Top Story
          <span className="mt-0.5 block text-[11px] font-normal text-slate-500">Top Channel</span>
        </p>
        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold text-white" style={{ backgroundColor: NAVY }}>
          Miratuar / Approved
        </span>
      </div>
      <PhotoPending />
      <ul className="space-y-2">
        {EXAMPLE_ROWS.map((row) => (
          <li key={row.code} className="rounded-lg border border-slate-200 px-2 py-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-xs font-bold" style={{ color: NAVY }}>
                {row.code} · {row.sq}
                <span className="ml-1 font-normal text-slate-500">/ {row.en}</span>
              </p>
              <p className="text-[11px] font-semibold text-slate-700">{row.bandSq} / {row.bandEn}</p>
            </div>
            <p className="text-[10px] text-slate-500">
              Besueshmëri: {row.confidenceSq} / Confidence: {row.confidenceEn}
              <span className="mx-1">·</span>
              {row.evidence} prova / {row.evidence} evidence items
            </p>
          </li>
        ))}
      </ul>
      <p className="rounded-full border border-slate-300 bg-slate-100 px-2 py-1 text-center text-[10px] font-semibold text-slate-500">
        Boshti C · Nuk vlerësohet / Axis C · Unscored
      </p>
      <div className="flex gap-2">
        <button type="button" className="flex-1 rounded-md border px-2 py-1.5 text-[10px] font-semibold" style={{ borderColor: NAVY, color: NAVY }}>
          Shiko prejardhjen / View lineage
        </button>
        <button type="button" className="flex-1 rounded-md px-2 py-1.5 text-[10px] font-semibold text-white" style={{ backgroundColor: NAVY }}>
          Raporti i plotë / Full report
        </button>
      </div>
      <p className="text-[10px] text-slate-500">E drejta e përgjigjes: 10 ditë pune / Right of reply: 10 working days</p>
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
    <ol className="mt-2 space-y-1 border-l-2 border-slate-200 pl-3">
      {steps.map((stepItem, index) => (
        <li key={stepItem.k} className="text-[10px] leading-snug text-slate-600">
          <span className="font-bold" style={{ color: NAVY }}>{index + 1}. {stepItem.k}</span>
          <span className="mt-0.5 block">{stepItem.v}</span>
        </li>
      ))}
    </ol>
  );
}

function ApprovedBack() {
  const [open, setOpen] = useState<string | null>('R1.1');
  const indicators = canonicalIndicators();
  return (
    <CardFrame title="Pasqyra e miratuar / Approved back drawer">
      <p className="text-[10px] text-slate-500">Metodologjia v1.0 · 18 nëntor 2026 / 18 November 2026</p>
      <ul className="space-y-1">
        {indicators.map((indicator) => {
          const band = EXAMPLE_INDICATOR_BAND[indicator.code];
          const expanded = open === indicator.code;
          return (
            <li key={indicator.code} className="rounded-lg border border-slate-200">
              <button
                type="button"
                className="flex w-full items-start justify-between gap-2 px-2 py-1.5 text-left"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : indicator.code)}
              >
                <span>
                  <span className="block text-[11px] font-bold" style={{ color: NAVY }}>{indicator.code} · {indicator.title}</span>
                  <span className="block text-[10px] text-slate-500">
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
      <p className="text-[10px] text-slate-500">
        Burimet / Sources
        <span className="mt-0.5 block">Shembull i lidhjeve të metodologjisë / Example methodology links</span>
      </p>
    </CardFrame>
  );
}

function UnassessedFront() {
  return (
    <CardFrame title="Ballina pa vlerësim / Unassessed front">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-600">
          Top Story
          <span className="mt-0.5 block text-[11px] font-normal text-slate-400">Top Channel</span>
        </p>
        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-600">
          Pa vlerësim / Not assessed
        </span>
      </div>
      <PhotoPending />
      <ul className="space-y-2">
        {EXAMPLE_ROWS.map((row) => (
          <li key={row.code} className="rounded-lg border border-dashed border-slate-300 px-2 py-2 text-slate-400">
            <p className="text-xs font-semibold">{row.code} · {row.sq} / {row.en}</p>
            <p className="text-[10px]">Pa vlerësim / Not assessed</p>
          </li>
        ))}
      </ul>
      <p className="rounded-full border border-dashed border-slate-300 px-2 py-1 text-center text-[10px] text-slate-400">
        Boshti C · Nuk vlerësohet / Axis C · Unscored
      </p>
      <p className="text-[11px] leading-snug text-slate-500">
        Vlerësimi publikohet vetëm pas miratimit / Assessment is published only after approval.
      </p>
    </CardFrame>
  );
}

function UnassessedBack() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <CardFrame title="Pasqyra pa vlerësim / Unassessed back drawer">
      <ul className="space-y-1">
        {canonicalIndicators().map((indicator) => {
          const expanded = open === indicator.code;
          return (
            <li key={indicator.code} className="rounded-lg border border-dashed border-slate-300">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 px-2 py-1.5 text-left text-slate-400"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : indicator.code)}
              >
                <span className="text-[11px]">{indicator.code} · {indicator.title} — Pa vlerësim / Not assessed</span>
                <span aria-hidden="true" className={expanded ? 'rotate-90' : ''}>›</span>
              </button>
              {expanded ? (
                <p className="px-2 pb-2 text-[10px] text-slate-400">
                  Standard → Method → Indicator → Evidence
                  <span className="mt-1 block">Pa gjurmë / No lineage</span>
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </CardFrame>
  );
}

export const MaragonCardMockupPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-8 text-slate-800">
      <div className="mx-auto mb-6 max-w-3xl">
        <button type="button" onClick={onBack} className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
          ← Kthehu / Back
        </button>
        <ExampleMark />
        <h1 className="text-2xl font-black" style={{ color: NAVY }}>
          Karta <Brand name="NOVARIC" /> <Brand name="MARAGON" />
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Specifikim i kartës së profilit. Shembull i fiksuar, jo një vlerësim i publikuar.
        </p>
        <p className="text-sm text-slate-500">
          Profile-card specification. A fixed example, not a published assessment.
        </p>
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-6 lg:flex-row lg:flex-wrap lg:items-start lg:justify-center">
        <ApprovedFront />
        <ApprovedBack />
        <UnassessedFront />
        <UnassessedBack />
      </div>
    </main>
  );
};

export default MaragonCardMockupPage;
