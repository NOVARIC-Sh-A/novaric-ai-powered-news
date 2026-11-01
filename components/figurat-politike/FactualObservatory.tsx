import React from 'react';
import {
  AWAITING_DATA,
  buildFactualObservatory,
  formatFactualCount,
  type FactualIndicator,
} from '../../utils/factualObservatory';
import { PARAGON_AUDIT_BANNER, PARAGON_SUSPENSION_NOTICE } from '../../services/paragonPublicationGate';

function periodOf(indicator: FactualIndicator): string {
  if (!indicator.periodStart || !indicator.periodEnd) return AWAITING_DATA;
  return `${indicator.periodStart} – ${indicator.periodEnd}`;
}

export const FactualObservatory: React.FC<{ profileId?: string | number | null }> = ({ profileId }) => {
  const report = buildFactualObservatory(profileId);
  return (
    <section
      className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      data-factual-observatory="true"
      data-methodology-version={report.methodologyVersion}
    >
      <div className="mb-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Observatori faktik [Factual Observatory]
        </h3>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          Klasa F [Class F]. Vetëm numërime të verifikuara. Pa pikë dimensioni, pa kompozit, pa renditje dhe pa etiketë vlerësuese.
          [Verified counts only. No dimension score, composite, ranking or evaluative label.]
        </p>
        <p className="mt-2 text-[11px] font-bold text-amber-800 dark:text-amber-300">{PARAGON_AUDIT_BANNER}</p>
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{PARAGON_SUSPENSION_NOTICE}</p>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {report.indicators.map((indicator) => {
          const value = formatFactualCount(indicator);
          const missing = value === AWAITING_DATA;
          return (
            <div key={indicator.id} className="grid gap-1 py-3 md:grid-cols-12 md:items-start" data-indicator={indicator.id}>
              <div className="md:col-span-4 text-xs font-bold text-slate-800 dark:text-slate-100">{indicator.label}</div>
              <div className="md:col-span-2 font-mono text-xs tabular-nums text-slate-700 dark:text-slate-200" data-count={indicator.id}>
                {value}
              </div>
              <div className="md:col-span-6 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                <div>Periudha [Period]: {periodOf(indicator)}</div>
                <div>Verifikuar [Verified]: {indicator.verifiedAt ?? AWAITING_DATA}</div>
                <div>Metodologjia [Methodology]: {indicator.methodologyVersion}</div>
                {indicator.sourceUrl ? (
                  <a className="text-blue-700 underline dark:text-blue-300" href={indicator.sourceUrl} rel="noreferrer">
                    {indicator.sourceTitle}
                  </a>
                ) : (
                  <div>Burimi [Source]: {AWAITING_DATA}</div>
                )}
                {indicator.note ? <div>{indicator.note}</div> : null}
                {missing ? null : <div className="sr-only">class F</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
        <h4 className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-500">Dimensionet [Dimensions]</h4>
        <ul className="grid gap-1 sm:grid-cols-2">
          {report.dimensions.map((dimension) => (
            <li key={dimension.key} className="flex items-center justify-between gap-3 text-[11px] text-slate-600 dark:text-slate-300" data-dimension={dimension.key}>
              <span>{dimension.key} {dimension.label}</span>
              <span className="font-mono text-slate-400">{dimension.score === null ? '—' : ''} {dimension.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
