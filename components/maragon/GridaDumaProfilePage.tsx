import React from 'react';
import { CANONICAL_MARAGON_INDICATOR_IDS } from '../../lib/maragon-schemas';
import { MARAGON_INDICATORS } from '../../data/maragonIndicators';
import { getMaragonResearch } from '../../services/maragonResearchLoader';
import { formatPersonName } from '../../utils/formatPersonName';
import { isMaragonPreviewActive } from '../../services/maragonDossier';
import draftCoding from '../../data/maragon/show_top_story.draft-coding.json';

const NAVY = '#30384B';
const PHOTO = 'https://kuvendiwebfiles.blob.core.windows.net/webfiles/gridashqina_foto.jpg';
const RINGS = [
  { radius: 0.28, label: 'Pa vlerësim' },
  { radius: 0.5, label: 'E dobët' },
  { radius: 0.75, label: 'Mesatare' },
  { radius: 1, label: 'E fortë' },
];

function polar(index: number, count: number, radius: number, cx: number, cy: number, maxR: number): [number, number] {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
  return [cx + Math.cos(angle) * radius * maxR, cy + Math.sin(angle) * radius * maxR];
}

function sectorPath(start: number, end: number, count: number, cx: number, cy: number, maxR: number): string {
  const a0 = -Math.PI / 2 + ((start - 0.5) * 2 * Math.PI) / count;
  const a1 = -Math.PI / 2 + ((end + 0.5) * 2 * Math.PI) / count;
  const edge = Array.from({ length: 13 }, (_, step) => {
    const angle = a0 + ((a1 - a0) * step) / 12;
    return `${(cx + Math.cos(angle) * maxR).toFixed(1)} ${(cy + Math.sin(angle) * maxR).toFixed(1)}`;
  });
  return `M ${cx} ${cy} L ${edge.join(' L ')} Z`;
}

const BAND_RADIUS: Record<string, number> = { weak: 0.5, moderate: 0.75, strong: 1 };

function TenPointRadar({ title, bands, draft }: { title: string; bands?: Record<string, string | null>; draft?: boolean }) {
  const points = CANONICAL_MARAGON_INDICATOR_IDS.map((id) => MARAGON_INDICATORS.find((item) => item.id === id && item.scope === 'outlet')).filter((item) => item != null);
  const count = points.length;
  const cx = 200;
  const cy = 200;
  const maxR = 118;
  const fills = ['rgba(48,56,75,0.05)', 'rgba(48,56,75,0.09)', 'rgba(48,56,75,0.04)', 'rgba(48,56,75,0.08)'];
  const groups: Array<{ start: number; end: number; fill: string }> = [];
  points.forEach((indicator, index) => {
    const previous = groups[groups.length - 1];
    if (previous && points[previous.start]?.dimension === indicator.dimension) {
      previous.end = index;
      return;
    }
    groups.push({ start: index, end: index, fill: fills[groups.length % fills.length] });
  });
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <svg viewBox="0 0 400 400" className="h-auto w-full" role="img" aria-label={title}>
        <circle cx={cx} cy={cy} r={maxR + 6} fill="#FFFFFF" stroke="#E5E7EB" />
        {groups.map((group) => (
          <path key={group.start} d={sectorPath(group.start, group.end, count, cx, cy, maxR)} fill={group.fill} />
        ))}
        {RINGS.map((ring) => (
          <circle key={ring.label} cx={cx} cy={cy} r={ring.radius * maxR} fill="none" stroke="#D1D5DB" strokeWidth="1.25" />
        ))}
        {points.map((indicator, index) => {
          const [x, y] = polar(index, count, 1, cx, cy, maxR);
          return <line key={indicator.id} x1={cx} y1={cy} x2={x} y2={y} stroke="#D1D5DB" />;
        })}
        {draft ? (() => {
          const segments: string[] = [];
          let current = '';
          points.forEach((indicator, index) => {
            const band = bands?.[indicator.code];
            if (!band || !BAND_RADIUS[band]) {
              if (current) segments.push(current);
              current = '';
              return;
            }
            const [x, y] = polar(index, count, BAND_RADIUS[band], cx, cy, maxR);
            current += `${current ? ' L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`;
          });
          if (current) segments.push(current);
          return segments.map((segment) => <path key={segment} d={segment} fill="none" stroke={NAVY} strokeWidth="2.4" />);
        })() : null}
        {points.map((indicator, index) => {
          const band = draft ? bands?.[indicator.code] : null;
          const radius = band && BAND_RADIUS[band] ? BAND_RADIUS[band] : RINGS[0].radius;
          const [x, y] = polar(index, count, radius, cx, cy, maxR);
          if (band && BAND_RADIUS[band]) return <circle key={`${indicator.id}-point`} cx={x} cy={y} r="3.3" fill={NAVY} />;
          return <circle key={`${indicator.id}-gap`} cx={x} cy={y} r="3.2" fill="none" stroke="#9CA3AF" strokeWidth="1.4" strokeDasharray="2 1.5" />;
        })}
        {points.map((indicator, index) => {
          const [x, y] = polar(index, count, 1.22, cx, cy, maxR);
          const anchor = x < cx - 14 ? 'end' : x > cx + 14 ? 'start' : 'middle';
          const baseline = y < cy - 14 ? 'auto' : y > cy + 14 ? 'hanging' : 'middle';
          return (
            <text key={`${indicator.id}-label`} x={x} y={y} textAnchor={anchor} dominantBaseline={baseline} fill="#9CA3AF" fontSize="15" fontWeight="700">
              <title>{`${indicator.code} · ${indicator.title} · Pa vlerësim / Not assessed`}</title>
              {indicator.code}
            </text>
          );
        })}
      </svg>
      {draft ? <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] text-center text-2xl font-black uppercase tracking-widest text-[#30384B]/30">DRAFT · research_only · not for publication</p> : null}
      <p className="text-center text-[11px] font-bold text-slate-500">{draft ? 'DRAFT · research_only · not for publication' : 'Pa vlerësim / Not assessed'}</p>
      <p className="text-center text-[10px] text-slate-500">Unaza: Pa vlerësim · E dobët / Weak · Mesatare / Moderate · E fortë / Strong</p>
    </div>
  );
}

function SourceList({ id }: { id: string }) {
  const dossier = getMaragonResearch(id);
  const items = dossier?.evidenceRegister ?? [];
  return (
    <ul className="mt-2 space-y-1 text-[11px] text-slate-600">
      {items.map((item) => (
        <li key={item.evidenceId}>
          <a className="underline" style={{ color: NAVY }} href={item.url || undefined}>{item.publisher}: {item.title}</a>
          <span className="text-slate-400"> · {item.accessDate}</span>
        </li>
      ))}
    </ul>
  );
}

export const GridaDumaProfilePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const person = getMaragonResearch('vip_m2');
  const show = getMaragonResearch('show_top_story');
  const name = formatPersonName(person?.subject.fullName || 'Grida Duma');
  const preview = isMaragonPreviewActive();
  const draftBands = Object.fromEntries(
    (draftCoding.indicators as Array<{ id: string; band: string | null }>).map((item) => [item.id.replace('maragon:', ''), item.band]),
  );
  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-8" style={{ color: NAVY }}>
      <button type="button" onClick={onBack} className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">← Kthehu / Back</button>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">MARAGON® · Draft kërkimor / Research draft · research_only</p>
      <h1 className="mt-1 text-3xl font-black">{name}</h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">{person?.subject.detailedBio_sq}</p>
      <p className="mt-2 max-w-3xl text-sm text-slate-500">{person?.subject.detailedBio_en}</p>
      <div className="mx-auto mt-6 flex max-w-[1100px] flex-col items-stretch justify-center gap-6 lg:flex-row lg:items-start">
        <article className="w-full max-w-[480px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(48,56,75,0.12)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Profili mediatik / Media practitioner</p>
          <div className="mx-auto mt-3 h-40 w-[7.5rem] overflow-hidden rounded-md border border-slate-200 bg-slate-100" style={{ aspectRatio: '3 / 4' }}>
            <img src={PHOTO} alt={name} className="h-full w-full object-cover object-[center_20%]" referrerPolicy="no-referrer" />
          </div>
          <p className="mt-2 text-center text-[10px] text-slate-500">Portret institucional. Burimi: Kuvendi i Shqipërisë. Krediti: Në verifikim.</p>
          <p className="text-center text-[10px]"><a className="underline" href={PHOTO}>gridashqina_foto.jpg · 18 nëntor 2026</a></p>
          <h2 className="mt-3 text-center text-xl font-black">{name}</h2>
          <p className="text-center text-sm font-semibold" data-current-role="true">Autore, moderatore dhe drejtuese e «Top Story», Top Channel</p>
          <p className="text-center text-[11px] text-slate-500">Në të shkuarën: ish-deputete e Partisë Demokratike. Top Channel, 5 gusht 2026, shkruan se mandatin e dorëzoi rreth katër vjet më parë.</p>
          <p className="text-center text-[11px] text-slate-500">Pa vlerësim / Not assessed · Pa indeks</p>
          <TenPointRadar title="Radar i pa vlerësuar për Grida DUMA" />
          <p className="mt-2 text-[11px] text-slate-500">Boshti C · Nuk vlerësohet / Axis C · Unscored</p>
          <SourceList id="vip_m2" />
        </article>
        <article className="w-full max-w-[480px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(48,56,75,0.12)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Objektivi i vlerësimit / Assessment target</p>
          <h2 className="mt-2 text-xl font-black">{show?.subject.fullName || 'Top Story'}</h2>
          <p className="text-sm text-slate-500">Top Channel</p>
          <p className="mt-2 text-sm text-slate-600">{show?.subject.detailedBio_sq}</p>
          <p className="mt-2 text-sm text-slate-500">{show?.subject.detailedBio_en}</p>
          <TenPointRadar title="Radar i Top Story" bands={preview ? draftBands : undefined} draft={preview} />
          <p className="mt-2 text-[11px] text-slate-500">Pa drejtues të lidhur. Pa indeks individual. / No linked host. No individual index.</p>
          <SourceList id="show_top_story" />
        </article>
      </div>
    </main>
  );
};

export default GridaDumaProfilePage;
