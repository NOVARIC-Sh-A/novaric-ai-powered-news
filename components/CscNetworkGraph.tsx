import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CscNetworkGraphProps {
  active?: boolean;
}

export const CscNetworkGraph: React.FC<CscNetworkGraphProps> = ({ active = false }) => {
  const { language } = useLanguage();

  const labels = {
      sq: {
          title: "Topologjia e Konfirmimit të Rrjetit",
          target: "Nyja e Synuar",
          echo: "Dhomë Jehone",
          peer: "Koleg i Verifikuar",
          audit: "Duke ekzekutuar auditimin e konsistencës strukturore..."
      },
      en: {
          title: "Network Corroboration Topology",
          target: "Target Node",
          echo: "Echo-Chamber",
          peer: "Verified peer",
          audit: "Running Structural Consistency Audit..."
      }
  };

  const t = labels[language];

  return (
    <div className="w-full flex flex-col items-center">
      <h4 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 mb-10">{t.title}</h4>
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Central Source Node */}
        <div className="w-16 h-16 rounded-full bg-sapphire/20 border-2 border-sapphire flex items-center justify-center z-10 shadow-[0_0_30px_rgba(14,165,233,0.5)]">
          <div className="w-3 h-3 rounded-full bg-sapphire animate-pulse"></div>
          <div className="absolute -top-10 text-[9px] font-black text-slate-900 dark:text-white uppercase whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-sm">{t.target}</div>
        </div>

        {/* Outer Ring of Sources */}
        {[0, 72, 144, 216, 288].map((deg, i) => {
           const isPenalty = i === 1 || i === 3;
           const colorClass = isPenalty ? 'border-rose-500 bg-rose-500/10' : 'border-emerald-500 bg-emerald-500/10';
           const label = isPenalty ? t.echo : t.peer;
           const dotColor = isPenalty ? 'bg-rose-500' : 'bg-emerald-500';

           return (
             <div 
                key={deg} 
                className="absolute inset-0 flex items-center justify-center transition-all duration-1000"
                style={{ transform: `rotate(${deg}deg)`, opacity: active ? 1 : 0, transitionDelay: `${i * 150}ms` }}
             >
                {/* Connector Line */}
                <div className={`w-36 h-px ${isPenalty ? 'bg-rose-500/30 border-dashed border-t' : 'bg-emerald-500/40 border-t'} absolute left-1/2 origin-left`}></div>
                
                {/* Outer Node */}
                <div 
                    className={`w-10 h-10 rounded-full border-2 ${colorClass} absolute flex items-center justify-center shadow-lg bg-white dark:bg-slate-900`}
                    style={{ transform: `translateX(140px) rotate(-${deg}deg)` }}
                >
                    <div className={`w-2 h-2 rounded-full ${dotColor} ${isPenalty ? 'animate-pulse' : ''}`}></div>
                    <div className={`absolute -bottom-8 text-[8px] font-black uppercase whitespace-nowrap ${isPenalty ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {label}
                    </div>
                </div>
             </div>
           );
        })}

        {/* Topology Scan Ring */}
        <div className="absolute inset-0 rounded-full border border-slate-200 dark:border-slate-800 scale-150 opacity-20"></div>
        <div className="absolute inset-0 rounded-full border border-slate-200 dark:border-slate-800 scale-110 opacity-40"></div>
      </div>
      <p className="mt-14 text-[9px] font-mono text-emerald-600 font-bold uppercase tracking-[0.4em] animate-pulse">{t.audit}</p>
    </div>
  );
};