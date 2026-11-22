import React, { useState } from 'react';
import { MARAGON_INDICATORS, type MaragonIndicator } from '../data/maragonIndicators';
import { CANONICAL_MARAGON_INDICATOR_IDS } from '../lib/maragon-schemas';
import { getLineageForMetric, getLineageForMethodStep } from '../data/analyticalMappings';

/**
 * Specification mockup only. The example bands below are not assessments,
 * do not read or write methodologyApproved, and are not used by any profile.
 */
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
  return CANONICAL_MARAGON_INDICATOR_IDS.map((id) => MARAGON_INDICATORS.find((item) => item.id === id && item.scope === 'outlet'))
    .filter((item): item is MaragonIndicator => Boolean(item));
}

function bandRadiusFor(code: string): number | null {
  const band = EXAMPLE_INDICATOR_BAND[code];
  if (!band) return null;
  if (band.bandEn === 'Strong') return BAND_RADIUS.strong;
  if (band.bandEn === 'Moderate') return BAND_RADIUS.moderate;
  if (band.bandEn === 'Weak') return BAND_RADIUS.weak;
  return null;
}

function Brand({ name }: { name: 'NOVARIC' | 'MARAGON' }) {
  return (
    <span className="novaric-brand">{name}<sup aria-hidden="true" className="registered-mark">®</sup></span>
  );
}

function polar(index: number, count: number, radius: number, cx: number, cy: number, maxR: number): [number, number] {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
  return [cx + Math.cos(angle) * radius * maxR, cy + Math.sin(angle) * radius * maxR];
}

function sectorPath(start: number, end: number, count: number, cx: number, cy: number, maxR: number): string {
  const a0 = -Math.PI / 2 + ((start - 0.5) * 2 * Math.PI) / count;
  const a1 = -Math.PI / 2 + ((end + 0.5) * 2 * Math.PI) / count;
  const steps = 12;
  const edge = Array.from({ length: steps + 1 }, (_, step) => {
    const angle = a0 + ((a1 - a0) * step) / steps;
    return `${(cx + Math.cos(angle) * maxR).toFixed(1)} ${(cy + Math.sin(angle) * maxR).toFixed(1)}`;
  });
  return `M ${cx} ${cy} L ${edge.join(' L ')} Z`;
}

function BandRadar({ traced }: { traced: boolean }) {
  const indicators = canonicalIndicators();
  const count = indicators.length;
  const cx = 200;
  const cy = 200;
  const maxR = 118;
  const radii = indicators.map((indicator) => (traced ? bandRadiusFor(indicator.code) : null));
  const segments: string[] = [];
  let current: string[] = [];
  radii.forEach((radius, index) => {
    if (radius === null) {
      if (current.length) segments.push(current.join(' '));
      current = [];
      return;
    }
    const [x, y] = polar(index, count, radius, cx, cy, maxR);
    current.push(`${current.length === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  });
  if (current.length) segments.push(current.join(' '));
  const closed = traced && radii.every((radius) => radius !== null) && segments.length === 1;
  const sectorFill = ['rgba(48,56,75,0.05)', 'rgba(48,56,75,0.09)', 'rgba(48,56,75,0.04)', 'rgba(48,56,75,0.08)'];
  const groups: Array<{ start: number; end: number; fill: string }> = [];
  indicators.forEach((indicator, index) => {
    const previous = groups[groups.length - 1];
    if (previous && indicators[previous.start].dimension === indicator.dimension) {
      previous.end = index;
      return;
    }
    groups.push({ start: index, end: index, fill: sectorFill[groups.length % sectorFill.length] });
  });
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <svg viewBox="0 0 400 400" className="h-auto w-full" role="img" aria-label={traced ? 'Shembull i gjurmës sipas dhjetë treguesve / Example trace across ten indicators' : 'Rrjetë pa vlerësim / Unassessed grid'}>
        <circle cx={cx} cy={cy} r={maxR + 6} fill="#FFFFFF" stroke="#E5E7EB" />
        {groups.map((group) => (
          <path key={group.start} d={sectorPath(group.start, group.end, count, cx, cy, maxR)} fill={group.fill} />
        ))}
        {RINGS.map((ring) => (
          <circle key={ring.sq} cx={cx} cy={cy} r={ring.radius * maxR} fill="none" stroke={traced ? '#CBD5E1' : '#D1D5DB'} strokeWidth="1.25" />
        ))}
        {indicators.map((indicator, index) => {
          const [x, y] = polar(index, count, 1, cx, cy, maxR);
          return <line key={indicator.id} x1={cx} y1={cy} x2={x} y2={y} stroke={traced ? '#CBD5E1' : '#D1D5DB'} strokeWidth="1.15" />;
        })}
        {RINGS.map((ring) => {
          const [x, y] = polar(0.45, count, ring.radius, cx, cy, maxR);
          return (
            <text key={ring.en} x={x + 3} y={y} fill="#6B7280" fontSize="8">
              {ring.sq}
            </text>
          );
        })}
        {closed ? (
          <path d={`${segments[0]} Z`} fill="rgba(48,56,75,0.12)" stroke={NAVY} strokeWidth="2.4" />
        ) : (
          segments.map((segment) => <path key={segment} d={segment} fill="none" stroke={NAVY} strokeWidth="2.4" />)
        )}
        {indicators.map((indicator, index) => {
          const radius = radii[index];
          if (radius === null) {
            const [x, y] = polar(index, count, RINGS[0].radius, cx, cy, maxR);
            return <circle key={indicator.id} cx={x} cy={y} r="3.2" fill="none" stroke="#9CA3AF" strokeWidth="1.4" strokeDasharray="2 1.5" />;
          }
          const [x, y] = polar(index, count, radius, cx, cy, maxR);
          return <circle key={indicator.id} cx={x} cy={y} r="3.3" fill={NAVY} />;
        })}
        {indicators.map((indicator, index) => {
          const [x, y] = polar(index, count, 1.22, cx, cy, maxR);
          const anchor = x < cx - 14 ? 'end' : x > cx + 14 ? 'start' : 'middle';
          const baseline = y < cy - 14 ? 'auto' : y > cy + 14 ? 'hanging' : 'middle';
          return (
            <text key={`${indicator.id}-label`} x={x} y={y} textAnchor={anchor} dominantBaseline={baseline} fill={traced ? NAVY : '#9CA3AF'} fontSize="15" fontWeight="700">
              <title>{`${indicator.id} · ${indicator.title} · ${indicator.dimension_name_sq}`}</title>
              {indicator.code}
            </text>
          );
        })}
      </svg>
      <p className="text-center text-[10px] leading-snug text-slate-500">
        Unaza / Rings: Pa vlerësim · E dobët / Weak · Mesatare / Moderate · E fortë / Strong
      </p>
      {traced ? null : (
        <p className="mt-1 text-center text-[11px] font-bold text-slate-500">Pa vlerësim / Not assessed</p>
      )}
    </div>
  );
}

function IndicatorLegend({ assessed }: { assessed: boolean }) {
  const indicators = canonicalIndicators();
  return (
    <div className="mt-2 space-y-2">
      {EXAMPLE_ROWS.map((group) => {
        const rows = indicators.filter((indicator) => indicator.dimension === group.code);
        return (
          <section key={group.code}>
            <p className="text-[10px] font-bold" style={{ color: NAVY }}>
              {rows[0]?.dimension_name_sq || group.sq}
            </p>
            <ul className="mt-1 space-y-1">
              {rows.map((indicator) => {
                const band = EXAMPLE_INDICATOR_BAND[indicator.code];
                return (
                  <li key={indicator.id} className={`rounded px-2 py-1 ${assessed ? 'border border-slate-200 bg-slate-50' : 'border border-dashed border-slate-300 bg-slate-50 text-slate-400'}`} title={`${indicator.id} · ${indicator.title} · ${indicator.dimension_name_sq}`}>
                    {assessed && band ? (
                      <>
                        <p className="text-[11px] font-bold" style={{ color: NAVY }}>
                          {indicator.code} · {indicator.title}
                          <span className="float-right font-semibold text-slate-600">{band.bandSq} / {band.bandEn}</span>
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Besueshmëri: {band.confidenceSq} / Confidence: {band.confidenceEn}
                        </p>
                      </>
                    ) : (
                      <p className="text-[11px]">{indicator.code} · {indicator.title} — Pa vlerësim / Not assessed</p>
                    )}
                  </li>
                );
              })}
            </ul>
            {assessed ? (
              <p className="mt-1 text-[10px] text-slate-500">{group.evidence} prova / {group.evidence} evidence items</p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function Portrait({ approved }: { approved: boolean }) {
  return (
    <div className={`relative mx-auto h-28 w-28 rounded-full border-2 p-1 ${approved ? 'border-slate-300' : 'border-dashed border-slate-300'}`}>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
          <rect x="8" y="16" width="30" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16 32l5-6 4 4 3-3 6 5" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="40" y="22" width="8" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M48 26h6M48 30h5" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
      <span className={`absolute -bottom-2 left-1/2 w-max -translate-x-1/2 rounded-md border px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wide ${approved ? 'text-white' : 'border-slate-300 bg-slate-100 text-slate-500'}`} style={approved ? { backgroundColor: NAVY, borderColor: NAVY } : undefined}>
        {approved ? 'Miratuar / Approved' : 'Pa vlerësim / Not assessed'}
      </span>
    </div>
  );
}

function Dock({ approved }: { approved: boolean }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-base font-black tracking-tight" style={{ color: NAVY }}>Shembull PROFILI</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Top Story · Top Channel</p>
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
    <p className="border-t border-slate-200 px-3 py-2 text-[10px] text-slate-500">
      <Brand name="NOVARIC" /> Sh.A. · media.novaric.al
    </p>
  );
}

function CardFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="flex w-full max-w-[440px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-[0_8px_24px_rgba(48,56,75,0.12)]">
      <header className="flex items-start justify-between gap-2 px-3 pt-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Shembull / Example</p>
          <h2 className="text-sm font-bold" style={{ color: NAVY }}>{title}</h2>
        </div>
        <span className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: NAVY }}>
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
        <p className="mt-4 text-center text-[10px] text-slate-500">Foto në verifikim / Photo pending verification</p>
        <BandRadar traced />
        <IndicatorLegend assessed />
        <p className="mt-2 rounded-full border border-slate-300 bg-slate-100 px-2 py-1 text-center text-[10px] font-semibold text-slate-500">
          Boshti C · Nuk vlerësohet / Axis C · Unscored
        </p>
        <div className="mt-2 flex gap-2">
          <button type="button" className="flex-1 rounded border px-2 py-1 text-[10px] font-semibold" style={{ borderColor: NAVY, color: NAVY }}>
            Shiko prejardhjen / View lineage
          </button>
          <button type="button" className="flex-1 rounded px-2 py-1 text-[10px] font-semibold text-white" style={{ backgroundColor: NAVY }}>
            Raporti i plotë / Full report
          </button>
        </div>
        <p className="mt-2 text-[10px] text-slate-500">E drejta e përgjigjes: 10 ditë pune / Right of reply: 10 working days</p>
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
    <ol className="space-y-1 border-l border-slate-300 pl-2">
      {steps.map((stepItem, index) => (
        <li key={stepItem.k} className="text-[10px] leading-snug text-slate-600">
          <span className="font-bold" style={{ color: NAVY }}>{index + 1}. {stepItem.k}</span>
          <span className="mt-0.5 block text-slate-500">{stepItem.v}</span>
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
        <p className="text-[10px] text-slate-500">Metodologjia v1.0 · 18 nëntor 2026 / 18 November 2026</p>
        <ul className="space-y-1">
          {canonicalIndicators().map((indicator) => {
            const band = EXAMPLE_INDICATOR_BAND[indicator.code];
            const expanded = open === indicator.code;
            return (
              <li key={indicator.code} className="rounded border border-slate-200 bg-slate-50">
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
        <IndicatorLegend assessed={false} />
        <p className="mt-2 rounded-full border border-dashed border-slate-300 bg-slate-50 px-2 py-1 text-center text-[10px] text-slate-400">
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
            <li key={indicator.code} className="rounded border border-dashed border-slate-300 bg-slate-50">
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
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-8" style={{ color: NAVY }}>
      <div className="mx-auto mb-6 max-w-3xl">
        <button type="button" onClick={onBack} className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
          ← Kthehu / Back
        </button>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Shembull / Example</p>
        <h1 className="text-2xl font-black" style={{ color: NAVY }}>
          Karta <Brand name="NOVARIC" /> <Brand name="MARAGON" />
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Specifikim i kartës së skanerit. Shembull i fiksuar, jo një vlerësim i publikuar.
        </p>
        <p className="text-sm text-slate-500">
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
