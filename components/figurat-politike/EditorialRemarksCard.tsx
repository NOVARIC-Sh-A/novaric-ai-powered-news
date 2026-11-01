import React from 'react';
import { VisibleRemark } from '../../utils/editorialRemarks';

export const EDITORIAL_TITLE = 'Vlerësim editorial / Editor’s assessment';
export const EDITORIAL_OPINION_LABEL =
  'Opinion editorial i NOVARIC® Sh.A. / NOVARIC® Sh.A. editorial opinion';
export const EDITORIAL_DISCLAIMER =
  'Opinion editoriale e NOVARIC® Sh.A. – jo pjesë e pikës PARAGON® / NOVARIC® Sh.A. editorial opinion – not part of the PARAGON® score';
export const EDITORIAL_EMPTY = 'Pa vërejtje editoriale ende / No editor’s remarks yet';
export const EDITORIAL_AWAITING = 'Në pritje të të dhënave / Awaiting data';
export const LIMITED_EVIDENCE_BADGE = 'Evidencë e kufizuar / Limited evidence';

function bilingual(value: string): { primary: string; secondary: string | null } {
  const splitAt = value.indexOf(' / ');
  if (splitAt < 0) return { primary: value, secondary: null };
  return { primary: value.slice(0, splitAt), secondary: value.slice(splitAt + 3) };
}

export const EditorialRemarksCard: React.FC<{
  remark: VisibleRemark | null;
  paragonComposite?: number | null;
}> = ({ remark, paragonComposite = null }) => {
  if (!remark) {
    return (
      <section
        className="mb-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6"
        data-editorial="empty"
      >
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
          {bilingual(EDITORIAL_TITLE).primary}
        </h3>
        <p className="text-[11px] text-slate-500">{bilingual(EDITORIAL_TITLE).secondary}</p>
        <p className="mt-2 text-sm text-slate-800 dark:text-slate-100">{bilingual(EDITORIAL_EMPTY).primary}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{bilingual(EDITORIAL_EMPTY).secondary}</p>
      </section>
    );
  }

  const paragonShown = typeof paragonComposite === 'number' && !Number.isNaN(paragonComposite);

  return (
    <section
      className="mb-6 rounded-3xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30 p-6"
      data-editorial="published"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-amber-950 dark:text-amber-100">
            {bilingual(EDITORIAL_TITLE).primary}
          </h3>
          <p className="text-[11px] text-amber-800/80 dark:text-amber-200/70">{bilingual(EDITORIAL_TITLE).secondary}</p>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-amber-950 dark:text-amber-100 max-w-3xl">
            {bilingual(EDITORIAL_OPINION_LABEL).primary}
          </p>
          <p className="text-[11px] text-amber-800/80 dark:text-amber-200/70">
            {bilingual(EDITORIAL_OPINION_LABEL).secondary}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-200/80 max-w-3xl">
            {EDITORIAL_DISCLAIMER}
          </p>
        </div>
        <div className="text-right text-xs text-amber-950 dark:text-amber-100">
          <div className="font-bold">{remark.editor.name}</div>
          {remark.editor.title ? <div className="text-amber-800/80 dark:text-amber-200/80">{remark.editor.title}</div> : null}
          {remark.date ? <div className="font-mono mt-0.5">{remark.date}</div> : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">PARAGON®</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {paragonShown ? paragonComposite : '–'}
          </div>
        </div>
        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-amber-200 dark:border-amber-800 px-4 py-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">Vlerësim editorial</div>
          <div className="text-2xl font-black text-amber-950 dark:text-amber-100 tabular-nums" data-editorial-score="true">
            {remark.editorialScore !== null ? remark.editorialScore : '–'}
          </div>
          <p className="text-[10px] text-amber-800/80 dark:text-amber-200/70">Jo pjesë e pikës PARAGON®</p>
        </div>
      </div>

      {remark.remarksSq ? <p className="mt-4 text-sm leading-relaxed text-slate-800 dark:text-slate-100">{remark.remarksSq}</p> : null}
      {remark.remarksEn ? <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{remark.remarksEn}</p> : null}

      {remark.criteria.length > 0 && (
        <ul className="mt-4 space-y-2">
          {remark.criteria.map((criterion) => {
            const label = bilingual(criterion.name);
            const noteParts = criterion.note.split(/\n\n/);
            return (
              <li key={`${criterion.name}-${criterion.sourceUrl}`} className="rounded-xl bg-white/70 dark:bg-slate-900/50 border border-amber-100 dark:border-amber-900/40 px-3 py-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span>
                    <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">{label.primary}</span>
                    {label.secondary ? <span className="block text-[11px] text-slate-500 dark:text-slate-400">{label.secondary}</span> : null}
                  </span>
                  <span className="font-mono text-sm font-bold text-amber-800 dark:text-amber-200 tabular-nums text-right">
                    {criterion.score !== null ? criterion.score : EDITORIAL_AWAITING}
                  </span>
                </div>
                {noteParts.filter(Boolean).map((part, index) => (
                  <p key={index} className={`mt-1 text-xs leading-relaxed ${index === 0 ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>{part}</p>
                ))}
                <a href={criterion.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-[11px] text-sky-700 dark:text-sky-300 underline break-all">
                  {criterion.sourceUrl}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {remark.sources.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1">
          {remark.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-800 dark:text-sky-300 underline">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
