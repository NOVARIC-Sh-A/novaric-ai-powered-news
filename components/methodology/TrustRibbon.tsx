// components/methodology/TrustRibbon.tsx
import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  UserCheck,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { MethodologyMetricsData } from '../../types/methodology';

interface TrustRibbonProps {
  metrics: MethodologyMetricsData;
  isFixture?: boolean;
  onNavigateToStandards?: (sub?: string) => void;
}

export const TrustRibbon: React.FC<TrustRibbonProps> = ({
  metrics,
  isFixture = false,
  onNavigateToStandards,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const formattedAuditDate = metrics.last_audit_at
    ? new Date(metrics.last_audit_at).toLocaleDateString('sq-AL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Në pritje të auditimit';

  const handleDownloadSpec = () => {
    const spec = {
      standard: 'NOVARIC® Sinergjia Hermeneutike & Korniza e Përgjegjësisë',
      version: metrics.methodology_version,
      last_audit_at: metrics.last_audit_at,
      next_audit_at: metrics.next_audit_at,
      human_review_status: metrics.human_review_status,
      ai_involvement_indicator: metrics.ai_involvement_indicator,
      principles_governed: ['DSA Nenet 16, 34, 35', 'EMFA Neni 6', 'EFCSN Standard 2 & 3'],
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NOVARIC_Methodology_Spec_${metrics.methodology_version.replace(/[^a-zA-Z0-9.-]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 3000);
  };

  return (
    <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Main Indicators: Version & Status */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Seal / Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 text-[#e4191e] border border-red-800/60 font-bold tracking-wide uppercase text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e4191e] animate-pulse" />
              Shiriti i Besueshmërisë
            </div>

            {/* Version */}
            <div className="flex items-center gap-1.5 font-mono text-slate-300">
              <span className="text-slate-400">Versioni:</span>
              <span className="font-semibold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {metrics.methodology_version}
              </span>
            </div>

            {/* Human in the loop marker */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-400 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{metrics.human_review_status}</span>
            </div>

            {/* AI involvement */}
            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/60 border border-blue-800/50 text-blue-300 font-medium">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>{metrics.ai_involvement_indicator}</span>
            </div>

            {/* Last audit date */}
            <div className="hidden lg:inline-flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Auditimi i Fundit:</span>
              <span className="font-medium text-slate-200">{formattedAuditDate}</span>
            </div>

            {isFixture && (
              <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/80 text-amber-400 text-[10px] font-bold">
                TË DHËNA LOKALE
              </span>
            )}
          </div>

          {/* Action Links & Mobile Expand */}
          <div className="flex items-center gap-2">
            {/* Link to Standards Hub */}
            <button
              onClick={() => {
                if (onNavigateToStandards) {
                  onNavigateToStandards();
                } else {
                  window.location.href = '/?page=standards';
                }
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Shko te Kodi i Standardeve dhe Vula e Gjallë"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#e4191e]" />
              <span className="hidden sm:inline">Kodi i Standardeve</span>
              <span className="sm:hidden">Kodi</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            {/* Link to AI Registry */}
            <button
              onClick={() => {
                if (onNavigateToStandards) {
                  onNavigateToStandards('ai');
                } else {
                  window.location.href = '/?page=standards&sub=ai';
                }
              }}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Shiko Regjistrin e Modeleve IA në Kodin e Standardeve"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Regjistri IA</span>
            </button>

            {/* Download Spec */}
            <button
              onClick={handleDownloadSpec}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Shkarko specifikimin e metodologjisë në format JSON"
            >
              {copiedJson ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Download className="w-3.5 h-3.5 text-slate-300" />
              )}
              <span className="hidden md:inline">{copiedJson ? 'U shkarkua' : 'JSON'}</span>
            </button>

            {/* Mobile Expand Details Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="sm:hidden p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              aria-label="Hap të dhënat e plota të shiritit"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Expanded Drawer */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-800 sm:hidden space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{metrics.human_review_status}</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{metrics.ai_involvement_indicator}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Auditimi i Fundit: {formattedAuditDate}</span>
            </div>
            <div className="pt-1 flex gap-2">
              <button
                onClick={() => {
                  if (onNavigateToStandards) {
                    onNavigateToStandards('ai');
                  } else {
                    window.location.href = '/?page=standards&sub=ai';
                  }
                }}
                className="flex-1 py-1 px-2 text-center rounded bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200"
              >
                Regjistri IA
              </button>
              <button
                onClick={handleDownloadSpec}
                className="py-1 px-2 text-center rounded bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200"
              >
                Eksporto Spec
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
