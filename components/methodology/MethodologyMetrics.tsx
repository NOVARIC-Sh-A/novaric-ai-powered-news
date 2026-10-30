// components/methodology/MethodologyMetrics.tsx
import React, { useState } from 'react';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileCheck,
  Calendar,
  Layers,
  Award,
  Download,
  Info,
  ExternalLink,
} from 'lucide-react';
import { MethodologyMetricsData, MethodologyAudit } from '../../types/methodology';

interface MethodologyMetricsProps {
  metrics: MethodologyMetricsData;
  audits: MethodologyAudit[];
  calculatedWordCount?: number;
  onNavigateToStandards?: () => void;
}

export const MethodologyMetrics: React.FC<MethodologyMetricsProps> = ({
  metrics,
  audits,
  calculatedWordCount,
  onNavigateToStandards,
}) => {
  const [copied, setCopied] = useState(false);

  const latestAudit = audits.length > 0 ? audits[0] : null;

  const wordCount = calculatedWordCount || metrics.word_count_hint;

  const handleExportMetrics = () => {
    const data = {
      title: 'Metrikat e Metodologjisë NOVARIC®',
      version: metrics.methodology_version,
      word_count: wordCount,
      sections: metrics.section_count,
      references: metrics.reference_count,
      steps: metrics.methodological_steps_count,
      principles: metrics.principles_count,
      last_audit: latestAudit,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NOVARIC_Metrikat_${metrics.methodology_version.replace(/[^a-zA-Z0-9.-]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="sec-metrikat" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            Transparencë e Matshme • Metrikat e Dokumentit
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Metrikat e Artikullit në Detaj
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl">
            Treguesit sasiorë dhe cilësorë të metodologjisë dhe auditimit të pavarur të integritetit editorial.
          </p>
        </div>

        <button
          onClick={handleExportMetrics}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm cursor-pointer self-start sm:self-center"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
          <span>{copied ? 'U Eksportua!' : 'Eksporto Metrikat (JSON)'}</span>
        </button>
      </div>

      {/* Grid of living metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Word count */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Numri i Fjalëve
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {wordCount}
          </div>
          <span className="text-[11px] text-slate-500">Llogaritur dinamikisht</span>
        </div>

        {/* References */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Referenca Akademike
          </span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {metrics.reference_count}
          </div>
          <span className="text-[11px] text-slate-500">Peer-reviewed</span>
        </div>

        {/* Pipeline steps */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Hapa të Verifikimit
          </span>
          <div className="text-2xl font-black text-[#e4191e] font-mono">
            {metrics.methodological_steps_count}
          </div>
          <span className="text-[11px] text-slate-500">Sinergjia Hermeneutike</span>
        </div>

        {/* Accountability Principles */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Parime DSA / EMFA
          </span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {metrics.principles_count}
          </div>
          <span className="text-[11px] text-slate-500">Pajtueshmëri ligjore</span>
        </div>

        {/* Compliance score */}
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
            Auditimi i Pajtueshmërisë
          </span>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
            {latestAudit ? `${latestAudit.compliance_score}%` : 'Në proces'}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-300">
            {latestAudit ? latestAudit.result_label_sq : 'Pa vërejtje'}
          </span>
        </div>
      </div>

      {/* Audit Certificate Box */}
      {latestAudit ? (
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Certifikata e Auditimit Metodologjik Q3 2026
              </span>
              <span className="font-mono text-xs text-slate-400">({latestAudit.id})</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>
                Audituar më:{' '}
                {new Date(latestAudit.audited_at).toLocaleDateString('sq-AL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Trupi Auditues:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {latestAudit.auditor}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Auditimi i Ardhshëm:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {latestAudit.next_audit_at
                  ? new Date(latestAudit.next_audit_at).toLocaleDateString('sq-AL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : 'Në pritje të caktimit'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
            <strong className="text-slate-800 dark:text-slate-200">Konkluzioni i Auditimit: </strong>
            {latestAudit.notes}
          </p>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                if (onNavigateToStandards) {
                  onNavigateToStandards();
                } else {
                  window.location.href = '/?page=standards';
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e4191e] hover:underline cursor-pointer"
            >
              <span>Shiko regjistrin e plotë në Kodin e Standardeve</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-400">
              Standardi: EFCSN & IFCN Vlerësimi 2026
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
          Në pritje të auditimit të parë periodik të regjistruar.
        </div>
      )}
    </div>
  );
};
