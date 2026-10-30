// components/analytics/ScoreLineagePanel.tsx
import React from 'react';
import {
  Shield,
  Layers,
  Sparkles,
  Activity,
  ArrowRight,
  ExternalLink,
  X,
  FileCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  getLineageForMetric,
  ANALYTICAL_METRICS_MAP,
  normalizeClauseId,
} from '../../data/analyticalMappings';
import { getMaragonIndicatorById } from '../../data/maragonIndicators';

interface ScoreLineagePanelProps {
  metricId: string; // e.g. metric:credibility or overall
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
  onNavigateToClause?: (clauseId: string) => void;
  onNavigateToIndicator?: (indicatorId: string) => void;
  onNavigateToStep?: (stepId: string) => void;
}

export const ScoreLineagePanel: React.FC<ScoreLineagePanelProps> = ({
  metricId,
  isOpen = true,
  onClose,
  isModal = false,
  onNavigateToClause,
  onNavigateToIndicator,
  onNavigateToStep,
}) => {
  if (!isOpen) return null;

  // Check if overall score explanation requested
  const isOverall = metricId === 'overall' || metricId === 'metric:overall';
  const metric = !isOverall ? getLineageForMetric(metricId) : null;

  const handleClauseClick = (clauseId: string) => {
    if (onNavigateToClause) {
      onNavigateToClause(clauseId);
    } else {
      const clean = normalizeClauseId(clauseId);
      window.location.href = `/?page=standards&sub=kodi&clause=${clean}#clause-${clean}`;
    }
    if (onClose) onClose();
  };

  const handleIndicatorClick = (indId: string) => {
    if (onNavigateToIndicator) {
      onNavigateToIndicator(indId);
    } else {
      window.location.href = `/?page=maragonFramework#${indId}`;
    }
    if (onClose) onClose();
  };

  const handleStepClick = (stepId: string) => {
    if (onNavigateToStep) {
      onNavigateToStep(stepId);
    } else {
      window.location.href = `/?page=methodology#${stepId}`;
    }
    if (onClose) onClose();
  };

  const content = (
    <div className="space-y-6 text-slate-800 dark:text-slate-100 font-sans">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Prejardhja e Pikëzimit (Score Lineage)
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isOverall
                  ? 'Gjenealogjia e Pikëzimit të Integritetit'
                  : metric?.name_sq || metricId}
              </h3>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition cursor-pointer"
              title="Mbyll"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {isOverall
            ? 'Pikëzimi i Integritetit NOVARIC® nuk është një numër abstrakt. Çdo vlerësim rrjedh nga treguesit granularë MARAGON®, kalon nëpër filtrin e mbikëqyrjes njerëzore të metodologjisë, dhe ankorohet në klauzolat e Kodit të Standardeve.'
            : metric?.description}
        </p>

        {metric?.audit_note && (
          <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{metric.audit_note}</span>
          </div>
        )}
      </div>

      {/* Decomposition Chain: 4 Tiers */}
      <div className="space-y-4">
        {/* Tier 1: Vlerësimi Live (Metric) */}
        <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Niveli 1: Vlerësimi Live (Metrika)</span>
          </div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800">
              {metric?.id || 'metric:overall'}
            </span>
            <span>{metric?.name_sq || 'Indeksi i Integritetit të Artikullit'}</span>
          </div>
        </div>

        <div className="flex justify-center -my-2">
          <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Tier 2: Korniza MARAGON® */}
        <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
          <div className="flex items-center gap-2 text-xs font-bold text-[#e4191e] uppercase tracking-wide mb-2">
            <Layers className="w-3.5 h-3.5 text-[#e4191e]" />
            <span>Niveli 2: Treguesit e Kornizës MARAGON®</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(isOverall
              ? ['maragon:R1.1', 'maragon:A2.1', 'maragon:A2.2', 'maragon:G3.1', 'maragon:O4.2']
              : metric?.indicator_ids || []
            ).map(indId => {
              const indicator = getMaragonIndicatorById(indId);
              return (
                <button
                  key={indId}
                  onClick={() => handleIndicatorClick(indId)}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 transition text-slate-700 dark:text-slate-200 cursor-pointer text-left"
                >
                  <span className="font-mono text-[11px] font-bold text-[#e4191e]">
                    {indicator?.code || indId.replace('maragon:', '')}
                  </span>
                  <span className="truncate max-w-[180px]">
                    {indicator?.title || indId}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#e4191e]" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center -my-2">
          <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Tier 3: Metoda (Sinergjia Hermeneutike) */}
        <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wide mb-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Niveli 3: Hapat e Metodologjisë (DSA & EMFA)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(isOverall
              ? ['meth:step-1', 'meth:step-2', 'meth:step-3']
              : metric?.methodology_step_ids || []
            ).map(stepId => {
              const stepNames: Record<string, string> = {
                'meth:step-1': 'Hapi 1: Analiza Fillestare IA',
                'meth:step-2': 'Hapi 2: Gjenerimi i Draftit',
                'meth:step-3': 'Hapi 3: Mbikëqyrja Hermeneutike (HITL)',
              };
              return (
                <button
                  key={stepId}
                  onClick={() => handleStepClick(stepId)}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/50 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-800 transition text-slate-700 dark:text-slate-200 cursor-pointer text-left"
                >
                  <span className="font-mono text-[11px] font-bold text-teal-600">
                    {stepId.replace('meth:', '')}
                  </span>
                  <span>{stepNames[stepId] || stepId}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-teal-600" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center -my-2">
          <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Tier 4: Doktrina (Kodi i Standardeve) */}
        <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wide mb-2">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            <span>Niveli 4: Doktrina & Klauzolat e Standardeve</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(isOverall
              ? ['std:MET-A', 'std:MET-B', 'std:ETIK-3.1A', 'std:ETIK-3.3A', 'std:TRANSP-4.1A']
              : metric?.standard_clause_ids || []
            ).map(clId => {
              const clean = normalizeClauseId(clId);
              return (
                <button
                  key={clId}
                  onClick={() => handleClauseClick(clId)}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/50 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-800 transition text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <span className="font-mono text-[11px] font-bold text-sky-600">
                    {clean}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-sky-600" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm my-4">
      {content}
    </div>
  );
};
