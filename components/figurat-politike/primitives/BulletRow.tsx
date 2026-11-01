// components/figurat-politike/primitives/BulletRow.tsx
import React, { useState } from 'react';
import { GitCommit, Clock, ExternalLink, FileSearch } from 'lucide-react';
import { ParagonDimensionItem } from '../../../types/politician';
import { AWAITING_DATA, ProxyMethodBadge } from './awaiting';

interface BulletRowProps {
  dimension: ParagonDimensionItem;
  className?: string;
  onOpenLineage?: (typedId: string) => void;
  onNavigateToMethodology?: () => void;
  onOpenEvidence?: (dimensionKey: string) => void;
}

const CANONICAL_TYPED_MAP: Record<string, string> = {
  D1: 'paragon:d1',
  D2: 'paragon:d2',
  D3: 'paragon:d3',
  D4: 'paragon:d4',
  D5: 'paragon:d5',
  D6: 'paragon:d6',
  D7: 'paragon:d7',
};

export const BulletRow: React.FC<BulletRowProps> = ({
  dimension,
  className = '',
  onOpenLineage,
  onNavigateToMethodology,
  onOpenEvidence,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const {
    id,
    key,
    label,
    name,
    score,
    peerAverage = null,
    benchmark = null,
    metricInputs = {},
    coverage: dimCoverage,
    confidenceLow = null,
    confidenceHigh = null,
    completeness = null,
    proxy = false,
    methodNote = null,
  } = dimension as any;

  const hasInterval = typeof confidenceLow === 'number' && typeof confidenceHigh === 'number';
  const hasCompleteness = typeof completeness === 'number' && !isNaN(completeness);

  const dimKey = String(key || (id ? `D${id}` : 'D1')).toUpperCase();
  const typedId = CANONICAL_TYPED_MAP[dimKey] || `paragon:${dimKey.toLowerCase()}`;
  const displayName = label || (name ? `${dimKey} ${name}` : 'Dimension');
  const isScored = typeof score === 'number' && !isNaN(score);
  const numericScore = isScored ? Math.max(0, Math.min(100, score)) : null;

  // Format raw metric entries for auditability tooltip
  const metricEntries = Object.entries(metricInputs || {}).filter(
    ([k]) => !k.startsWith('_') && typeof (metricInputs as any)[k] !== 'object'
  );

  const coverageInfo = dimCoverage || (metricInputs && (metricInputs as any)._coverage);

  return (
    <div
      className={`relative group py-2.5 border-b border-slate-100 dark:border-slate-800/80 last:border-none ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-1 flex items-center gap-1.5">
          {displayName}
          {dimKey === 'D2' && metricInputs?.declaration_coverage && (
            <span
              className="inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800"
              title="Mbulimi i deklaratave të pasurisë ILDKPKI"
            >
              {metricInputs.declaration_coverage}
            </span>
          )}
          {dimKey === 'D1' && metricInputs?.coverage_label && (
            <span
              className="inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800"
              title="Përllogaritje e përshtatur me nivelin e mbulimit empirik"
            >
              {metricInputs.coverage_label}
            </span>
          )}
        </span>

        <div className="flex items-center gap-2">
          {onOpenEvidence && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenEvidence(dimKey);
              }}
              className="inline-flex items-center justify-center w-6 h-6 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Burimet e pikëzimit / Evidence"
            >
              <FileSearch className="w-3.5 h-3.5" />
            </button>
          )}
          {/* Status Chips: Prejardhja e Pikëzimit for computed, Në pritje të auditimit for nulls */}
          {isScored ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenLineage) {
                  onOpenLineage(typedId);
                } else {
                  window.location.href = `/?page=standards&sub=kodi#lineage-${typedId}`;
                }
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-800 border border-blue-200 dark:border-blue-800 transition cursor-pointer shadow-2xs"
              title="Shiko prejardhjen e pikëzimit dhe lidhjen analitike me MARAGON & Standardet"
            >
              <GitCommit className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Prejardhja e Pikëzimit</span>
            </button>
          ) : (
            <a
              href="/?page=methodology#paragon-audit"
              onClick={(e) => {
                if (onNavigateToMethodology) {
                  e.preventDefault();
                  onNavigateToMethodology();
                }
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 transition cursor-pointer shadow-2xs"
              title="Dimensioni është në pritje të auditimit empirik sipas metodologjisë NOVARIC®"
            >
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Në pritje të auditimit</span>
              <ExternalLink className="w-2.5 h-2.5 text-amber-500 shrink-0 opacity-70" />
            </a>
          )}
          {isScored && proxy ? <ProxyMethodBadge note={methodNote} /> : null}

          <div className="flex items-center gap-1 font-mono text-[11px] tabular-nums shrink-0">
            <span className={`font-bold ${isScored ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
              {isScored ? `${score}%` : '–'}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
              / {peerAverage != null ? `${peerAverage}%` : '–'}
            </span>
          </div>
        </div>
      </div>

      {/* Bullet Track */}
      <div className="relative h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        {/* Background benchmark marker region */}
        {benchmark != null && (
          <div
            className="absolute top-0 bottom-0 bg-slate-200/50 dark:bg-slate-700/40 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, benchmark))}%` }}
          />
        )}

        {/* Primary Score Fill Bar (Brand Blue) - only if scored */}
        {numericScore !== null && (
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${numericScore}%` }}
          />
        )}

        {/* Benchmark faint line */}
        {benchmark != null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400/80 dark:bg-slate-400 z-10"
            style={{ left: `${Math.min(99, Math.max(1, benchmark))}%` }}
            title={`Benchmark: ${benchmark}%`}
          />
        )}

        {/* Peer Average dark tick */}
        {peerAverage != null && (
          <div
            className="absolute -top-0.5 -bottom-0.5 w-1 bg-slate-800 dark:bg-slate-200 z-20 rounded shadow"
            style={{ left: `${Math.min(99, Math.max(1, peerAverage))}%` }}
            title={`Mesatarja e kolegëve: ${peerAverage}%`}
          />
        )}
      </div>

      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-500 dark:text-slate-400">
        <span>
          Intervali i besimit / CI:{' '}
          <span className="font-mono text-slate-700 dark:text-slate-200">
            {hasInterval ? `${confidenceLow}–${confidenceHigh}` : AWAITING_DATA}
          </span>
        </span>
        <span>
          Plotësia e të dhënave / Completeness:{' '}
          <span className="font-mono text-slate-700 dark:text-slate-200">
            {hasCompleteness ? `${completeness}%` : AWAITING_DATA}
          </span>
        </span>
      </div>

      {/* Traceable Raw Metrics & Coverage Tooltip */}
      {showTooltip && (
        <div className="absolute left-0 right-0 -top-1 -translate-y-full z-30 p-2.5 bg-slate-900/95 backdrop-blur text-white text-[11px] rounded-lg shadow-xl border border-slate-700/80 pointer-events-none animate-fadeIn tabular-nums">
          <div className="font-bold text-blue-300 border-b border-slate-700 pb-1 mb-1.5 flex items-center justify-between">
            <span>Treguesit empirikë — {displayName} ({typedId})</span>
            <span className="text-[10px] text-slate-400 font-mono">PARAGON® Audit</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-300">
            <div>Vlerësimi subjekti: <strong className="text-white">{isScored ? `${score}%` : '– (në pritje të auditimit)'}</strong></div>
            <div>Mes. e kolegëve: <strong className="text-white">{peerAverage != null ? `${peerAverage}%` : AWAITING_DATA}</strong></div>
            <div>Benchmark global: <strong className="text-white">{benchmark != null ? `${benchmark}%` : AWAITING_DATA}</strong></div>
            {coverageInfo && (
              <div>Mbulimi i treguesve: <strong className="text-emerald-400">{typeof coverageInfo === 'string' ? coverageInfo : `${coverageInfo.available?.length ?? 0}/${(coverageInfo.available?.length ?? 0) + (coverageInfo.missing?.length ?? 0)}`}</strong></div>
            )}
            {metricEntries.length > 0 ? (
              metricEntries.slice(0, 4).map(([k, v]) => (
                <div key={k} className="truncate">
                  {k.replace(/_/g, ' ')}: <strong className="text-white">{String(v)}</strong>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-slate-400 italic text-[9px]">
                {isScored 
                  ? 'Të dhëna të verifikuara empirikisht nga regjistrat e Kuvendit (/mbledhjet).' 
                  : 'Në pritje të auditimit: skema e dimensionit është e gatshme për integrimin e fazës pasuese.'}
              </div>
            )}
          </div>
          {coverageInfo && typeof coverageInfo === 'object' && coverageInfo.missing && coverageInfo.missing.length > 0 && (
            <div className="mt-1 pt-1 border-t border-slate-800 text-[9px] text-amber-300/80">
              Në pritje të auditimit: {coverageInfo.missing.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
