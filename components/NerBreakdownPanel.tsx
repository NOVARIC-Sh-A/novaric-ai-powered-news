import React, { useMemo } from 'react';
import { ShieldCheck, Activity, Info } from 'lucide-react';
import { NerBreakdown } from '../types';
import { nerColor } from '../utils/nerColor';
import { useLanguage } from '../contexts/LanguageContext';

interface NerBreakdownPanelProps {
  ecosystemRating: number;
  nerVersion?: string;
  breakdown: NerBreakdown;
}

export const NerBreakdownPanel: React.FC<NerBreakdownPanelProps> = ({
  ecosystemRating,
  nerVersion,
  breakdown,
}) => {
  const { language } = useLanguage();

  const descriptions: Record<string, { label: string; desc: string }> = useMemo(() => ({
    SRS: { 
      label: language === 'sq' ? 'Besueshmëria e Burimit' : 'Source Reliability', 
      desc: language === 'sq' ? 'Vlerësimi historik i saktësisë së burimit.' : 'Historical accuracy of the source.' 
    },
    CIS: { 
      label: language === 'sq' ? 'Integriteti i Përmbajtjes' : 'Content Integrity', 
      desc: language === 'sq' ? 'Cilësia dhe koherenca e artikullit.' : 'Internal quality and coherence of the article.' 
    },
    CSC: { 
      label: language === 'sq' ? 'Konfirmimi Ndër-burimor' : 'Cross-Source Corroboration', 
      desc: language === 'sq' ? 'Vërtetimi i pavarur nga burime të tjera.' : 'Independent verification by other sources.' 
    },
    TRF: { 
      label: language === 'sq' ? 'Rëndësia Kohore' : 'Temporal Relevance', 
      desc: language === 'sq' ? 'Freskia dhe jetëgjatësia e lajmit.' : 'Freshness and longevity of the news.' 
    },
    ECM: { 
      label: language === 'sq' ? 'Konteksti i Ekosistemit' : 'Ecosystem Modifier', 
      desc: language === 'sq' ? 'Rëndësia relative për audiencën lokale.' : 'Relative importance for the local audience.' 
    }
  }), [language]);

  // Filter keys to ensure we only render known metrics and avoid 'undefined' crashes
  const metricKeys = useMemo(() => {
    if (!breakdown) return [];
    return (Object.keys(breakdown) as Array<keyof NerBreakdown>).filter(
      (key) => descriptions[key] !== undefined
    );
  }, [breakdown, descriptions]);

  return (
    <section className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl animate-fadeIn">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-primary-500" />
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">
            Auditimi i Ekosistemit NOVARIC®
          </h3>
        </div>
        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded uppercase tracking-tighter">
          {nerVersion || 'NER_CORE_V1.2'}
        </span>
      </div>

      {/* OVERALL SCORE DISPLAY */}
      <div className="flex flex-col items-center justify-center mb-10 p-6 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-sapphire to-emerald-500"></div>
        <div className={`text-7xl font-black font-mono tracking-tighter ${nerColor(ecosystemRating)}`}>
          {ecosystemRating}
          <span className="text-2xl align-top ml-1">%</span>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
          Composite Rating
        </p>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 gap-3">
        {metricKeys.map((key) => {
          const metricValue = (breakdown as any)[key] as number;
          const info = descriptions[key];
          
          return (
            <div
              key={key}
              className="group relative flex flex-col bg-white dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-primary-500/30 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black font-mono text-slate-400 dark:text-slate-500">{key}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                    {info.label}
                  </span>
                </div>
                <span className={`text-lg font-black font-mono ${nerColor(metricValue)}`}>
                  {Math.round(metricValue)}%
                </span>
              </div>
              
              {/* Visual Bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${nerColor(metricValue).replace('text-', 'bg-')}`}
                  style={{ width: `${metricValue}%` }}
                ></div>
              </div>

              {/* Description Tooltip-like text on hover */}
              <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-1.5">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{info.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER VERIFICATION */}
      <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400 uppercase font-bold tracking-widest">
          <Activity className="w-3 h-3 text-emerald-500" />
          Data Origin: Backend Authoritative
        </div>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
          ))}
        </div>
      </div>
    </section>
  );
};