import React, { useMemo } from 'react';
import { ShieldCheck, Info, AlertTriangle, HelpCircle } from 'lucide-react';

interface CredibilitySignalProps {
  label: string;
  score?: number; // 0-100
  status: 'unknown' | 'partial' | 'verified';
  subLabel: string;
}

export const CredibilitySignal: React.FC<CredibilitySignalProps> = ({ 
  label, 
  score, 
  status, 
  subLabel 
}) => {
  const isUnknown = status === 'unknown' || score === undefined;
  const displayScore = isUnknown ? 50 : score;

  const statusText = useMemo(() => {
    if (isUnknown) return "Në Vlerësim";
    if (score >= 85) return "Verifikuar";
    if (score >= 70) return "I Besueshëm";
    if (score >= 40) return "Pjesërisht i Konfirmuar";
    return "I Pabazuar";
  }, [score, isUnknown]);

  const StatusIcon = useMemo(() => {
    if (isUnknown) return HelpCircle;
    if (score >= 75) return ShieldCheck;
    if (score >= 40) return Info;
    return AlertTriangle;
  }, [score, isUnknown]);

  const colorClasses = useMemo(() => {
    if (isUnknown) return "text-slate-400 dark:text-slate-500";
    if (score >= 85) return "text-emerald-500";
    if (score >= 70) return "text-sky-500";
    if (score >= 40) return "text-amber-500";
    return "text-rose-500";
  }, [score, isUnknown]);

  return (
    <div 
      className="group relative flex flex-col gap-2 w-full animate-fadeIn"
      aria-label={`${label}: ${statusText}`}
      title={isUnknown ? "Ky tregues do të përditësohet automatikisht nga NER Audit Engine." : undefined}
    >
      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            {subLabel}
          </span>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {label}
          </h4>
        </div>
        <div className={`flex items-center gap-1.5 ${colorClasses}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-black uppercase tracking-wider">{statusText}</span>
          {!isUnknown && (
            <span className="text-sm font-bold font-mono ml-1">{score}%</span>
          )}
        </div>
      </div>

      <div className="relative h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
        {/* Gradient Track */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${isUnknown ? 'opacity-20 grayscale' : 'opacity-100'}`}
          style={{ background: 'linear-gradient(to right, #f43f5e, #f59e0b, #10b981)' }}
        ></div>

        {/* Marker/Fill Logic */}
        <div 
          className="absolute inset-0 bg-slate-200 dark:bg-slate-900 transition-all duration-1000 ease-out"
          style={{ left: `${displayScore}%` }}
        ></div>
        
        {/* Glowing Head */}
        <div 
          className={`absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-1000 ease-out ${isUnknown ? 'opacity-40' : 'opacity-100'}`}
          style={{ left: `${displayScore}%`, transform: 'translateX(-50%)' }}
        ></div>
      </div>
    </div>
  );
};
