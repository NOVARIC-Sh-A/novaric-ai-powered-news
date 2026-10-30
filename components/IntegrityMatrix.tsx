import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  EyeSlashIcon, 
  ChevronDownIcon, 
  ChainIcon,
  ExclamationTriangleIcon
} from './icons';
import { ScoreLineagePanel } from './analytics/ScoreLineagePanel';
import { Activity, Sparkles, Shield, GitCommit, Clock } from 'lucide-react';

export type ContextType = "Media" | "Politics" | "Judicial";

export interface MetricDetailItem {
  label: string;
  value: string;
  status: "Good" | "Average" | "Bad";
}

export interface MetricDetail {
  category: string;
  score: number | null;
  metricId?: string;
  items: MetricDetailItem[];
}

export type LetheImpact = "High" | "Medium";
export type LetheCategory = "Origjina" | "Konflikti" | "Konteksti" | "Data" | "Precedenti";

export interface LethePoint {
  type: LetheCategory;
  description: string;
  proofUrl?: string;
  impact: LetheImpact;
}

export interface IntegrityMatrixProps {
  context: ContextType;
  score: number; // 0.0 to 10.0
  summary: string;
  originSteps: { label: string; active: boolean; isCurrent: boolean }[];
  csrValue: number; // 0-100
  letheData: LethePoint[];
  detailedMetrics?: MetricDetail[];
}

const getScoreColor = (score: number) => {
  if (score >= 8) return { text: 'text-emerald-600', border: 'border-emerald-500', stroke: '#10b981', bg: 'bg-emerald-500' };
  if (score >= 5) return { text: 'text-amber-500', border: 'border-amber-500', stroke: '#f59e0b', bg: 'bg-amber-500' };
  return { text: 'text-rose-600', border: 'border-rose-600', stroke: '#e11d48', bg: 'bg-rose-500' };
};

const getStatusColor = (status: "Good" | "Average" | "Bad") => {
  switch (status) {
    case "Good": return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "Average": return "bg-amber-100 text-amber-800 border-amber-200";
    case "Bad": return "bg-rose-100 text-rose-800 border-rose-200";
    default: return "bg-slate-100 text-slate-700";
  }
};

export const IntegrityMatrix: React.FC<IntegrityMatrixProps> = ({
  context,
  score,
  summary,
  originSteps,
  csrValue,
  letheData,
  detailedMetrics = []
}) => {
  const { text, border, stroke } = getScoreColor(score);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [selectedLineageMetric, setSelectedLineageMetric] = useState<string | null>(null);

  // Circular Progress
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden font-sans max-w-2xl mx-auto my-6">
      
      {/* HEADER */}
      <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 p-3 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            MATRICA E INTEGRITETIT // {context.toUpperCase()}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900">
            SHTYLLA ANALITIKE
          </span>
        </div>
        
        {/* Lineage Explainer Button */}
        <button
          type="button"
          onClick={() => setSelectedLineageMetric('metric:credibility')}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#002B49] dark:text-sky-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-[#e4191e] transition cursor-pointer shadow-2xs"
          title="Shiko dekompozimin e plotë të pikëzimit nga standardet te metodologjia"
        >
          <GitCommit className="w-3.5 h-3.5 text-[#e4191e]" />
          <span>Shpjego Pikëzimin</span>
        </button>
      </div>

      {/* ZONE A: VITAL SIGNS */}
      <div className="p-6 flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 dark:border-slate-800">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
             <circle cx="48" cy="48" r={radius} stroke="#e2e8f0" strokeWidth="6" fill="transparent" className="dark:stroke-slate-800" />
             <circle cx="48" cy="48" r={radius} stroke={stroke} strokeWidth="6" fill="transparent"
                     strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" 
                     className="transition-all duration-1000 ease-out" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-3xl font-black ${text}`}>{score.toFixed(1)}</span>
          </div>
        </div>
        <div className={`pl-4 border-l-4 ${border} flex-grow`}>
             <h4 className={`text-xs font-bold ${text} uppercase mb-1`}>Vlerësimi Klinik</h4>
             <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">"{summary}"</p>
        </div>
      </div>

      {/* ZONE B: GENEALOGY */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Gjenealogjia e Informacionit</h4>
        <div className="relative flex justify-between items-center px-4">
             <div className="absolute top-2 left-4 right-4 h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>
             {originSteps.map((step, i) => (
               <div key={i} className="flex flex-col items-center gap-2 bg-white dark:bg-slate-900 px-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${step.active ? 'border-blue-500 bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>
                      {step.active && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${step.isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>{step.label}</span>
               </div>
             ))}
        </div>
      </div>

      {/* ZONE C: CSR BALANCE */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
         <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            <button
              type="button"
              onClick={() => setSelectedLineageMetric('metric:logic_fact')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer flex items-center gap-1"
              title="Shiko prejardhjen e metrikës Logjikë (Fact)"
            >
              <span>Logjikë (Fact)</span>
              <span className="text-[9px] text-blue-500 font-mono">↗</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedLineageMetric('metric:ethical_resonance')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
              title="Shiko prejardhjen e metrikës Rezonanca Etike (CSR)"
            >
              <span>Rezonanca Etike (CSR)</span>
              <span className="text-[9px] text-emerald-500 font-mono">↗</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedLineageMetric('metric:emotion_affect')}
              className="hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer flex items-center gap-1"
              title="Shiko prejardhjen e metrikës Emocion (Affect)"
            >
              <span>Emocion (Affect)</span>
              <span className="text-[9px] text-rose-500 font-mono">↗</span>
            </button>
         </div>
         <div className="relative h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-slate-200 dark:via-slate-700 to-rose-400 opacity-70"></div>
            <div className="absolute top-0 bottom-0 w-1 bg-slate-800 dark:bg-white shadow-md transform -translate-x-1/2" style={{ left: `${csrValue}%` }}></div>
         </div>
         <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 font-mono">
             <span>Fakt: {100 - csrValue}%</span>
             <span>Afekt: {csrValue}%</span>
         </div>
      </div>

      {/* ZONE E: DETAILED METRICS */}
      {detailedMetrics.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
           {detailedMetrics.map((metric) => (
             <div key={metric.category} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
               <div className="w-full flex items-center justify-between p-4 hover:bg-slate-100/70 dark:hover:bg-slate-900/60 transition-colors">
                 <button 
                   onClick={() => setExpandedMetric(expandedMetric === metric.category ? null : metric.category)}
                   className="flex-grow flex items-center gap-3 text-left"
                 >
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{metric.category}</span>
                    {metric.score != null ? (
                      <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                         <div className="h-full bg-slate-500 dark:bg-slate-400" style={{ width: `${metric.score}%` }}></div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono italic">
                        Në pritje
                      </span>
                    )}
                 </button>

                 <div className="flex items-center gap-2">
                   {metric.metricId && (
                     metric.score != null ? (
                       <button
                         type="button"
                         onClick={(e) => {
                           e.stopPropagation();
                           setSelectedLineageMetric(metric.metricId || 'metric:credibility');
                         }}
                         className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#002B49] hover:text-white dark:hover:bg-slate-700 transition cursor-pointer"
                         title="Shiko lidhjen analitike me MARAGON & Standardet"
                       >
                         <GitCommit className="w-3 h-3 text-[#e4191e]" />
                         <span>Prejardhja e Pikëzimit</span>
                       </button>
                     ) : (
                       <a
                         href="/?page=methodology#paragon-audit"
                         onClick={(e) => {
                           e.stopPropagation();
                         }}
                         className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 transition cursor-pointer shadow-2xs"
                         title="Në pritje të auditimit empirik"
                       >
                         <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                         <span>Në pritje të auditimit</span>
                       </a>
                     )
                   )}
                   <button 
                     onClick={() => setExpandedMetric(expandedMetric === metric.category ? null : metric.category)}
                     className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                   >
                     <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${expandedMetric === metric.category ? 'rotate-180' : ''}`} />
                   </button>
                 </div>
               </div>

               {expandedMetric === metric.category && (
                 <div className="px-4 pb-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                    <div className="space-y-2 mt-2">
                       {metric.items.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                            <div className="flex items-center gap-2">
                               <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{item.value}</span>
                               <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase ${getStatusColor(item.status)}`}>{item.status}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
             </div>
           ))}
        </div>
      )}

      {/* ZONE D: LETHE VOID */}
      <div className="bg-slate-900 p-5 text-slate-300">
        <div className="flex items-center gap-2 mb-4 text-purple-400 border-b border-slate-800 pb-2">
            <EyeSlashIcon className="w-4 h-4" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest">Hapësira Lethe (Konteksti i Munguar)</h4>
        </div>
        <div className="space-y-3">
           {letheData.map((point, i) => (
             <div key={i} className="flex gap-3 items-start group">
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${point.impact === 'High' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-amber-500'}`}></div>
                <div className="flex-grow">
                   <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-[9px] font-bold uppercase text-slate-500 bg-slate-800 px-1.5 rounded">{point.type}</span>
                      {point.proofUrl && (
                        <a href={point.proofUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <ChainIcon className="w-3 h-3" /> Provë
                        </a>
                      )}
                   </div>
                   <p className="text-xs text-slate-300 leading-relaxed">{point.description}</p>
                </div>
             </div>
           ))}
           {letheData.length === 0 && <p className="text-xs text-slate-500 italic">Nuk u identifikuan mungesa kritike të kontekstit.</p>}
        </div>
      </div>

      {/* Lineage Modal */}
      {selectedLineageMetric && (
        <ScoreLineagePanel
          metricId={selectedLineageMetric}
          isModal
          isOpen={!!selectedLineageMetric}
          onClose={() => setSelectedLineageMetric(null)}
          onNavigateToClause={(clauseId) => {
            window.location.href = `/?page=standards&sub=kodi&clause=${clauseId}#clause-${clauseId}`;
          }}
          onNavigateToStep={(stepId) => {
            window.location.href = `/?page=methodology#${stepId}`;
          }}
        />
      )}
    </div>
  );
};
