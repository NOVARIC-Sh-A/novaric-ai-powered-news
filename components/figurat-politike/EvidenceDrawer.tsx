import React from 'react';
import { X } from 'lucide-react';
import { ScoreEvidenceItem } from '../../types/politician';
import { AWAITING_DATA } from './primitives/awaiting';

interface EvidenceDrawerProps {
  open: boolean;
  dimensionKey?: string | null;
  evidence: ScoreEvidenceItem[];
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  open,
  dimensionKey,
  evidence,
  onClose,
}) => {
  if (!open) return null;

  const filtered = dimensionKey
    ? evidence.filter((item) => String(item.dimensionKey || '').toUpperCase() === dimensionKey.toUpperCase())
    : evidence;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Burimet e pikëzimit / Evidence">
      <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Close" onClick={onClose} />
      <aside className="relative z-10 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
              Burimet e pikëzimit <span className="text-slate-400 font-semibold normal-case">/ Evidence</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-1">
              {dimensionKey ? `${dimensionKey} · ` : ''}
              Burimet pas pikës / Sources behind the score
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close evidence">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-8 text-center">{AWAITING_DATA}</p>
          ) : (
            filtered.map((item, index) => (
              <article key={item.id || index} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs">
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-400 mb-1">
                  <span>{item.dimensionKey || '—'}</span>
                  <span>{item.retrievedAt || item.metricKey || ''}</span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">
                  {item.sourceTitle || item.sourceUrl}
                </h3>
                {item.sourcePublisher && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.sourcePublisher}</p>
                )}
                {item.excerpt && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">{item.excerpt}</p>
                )}
                {item.sourceUrl && (
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-blue-600 dark:text-blue-400 underline">
                    {item.sourceUrl}
                  </a>
                )}
              </article>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};
