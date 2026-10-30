
import React from 'react';
import { Psychometrics } from '../types';

interface PsycholinguisticSpectrogramProps {
  psychometrics?: Psychometrics;
  lang?: 'sq' | 'en';
}

export const PsycholinguisticSpectrogram: React.FC<PsycholinguisticSpectrogramProps> = ({ psychometrics, lang = 'sq' }) => {
  if (!psychometrics) return null;

  const timelineData = psychometrics.spectrogramData || Array.from({ length: 50 }, (_, i) => ({
    time: i,
    intensity: Math.random() * 100,
    type: Math.random() > 0.7 ? 'fallacy' : Math.random() > 0.4 ? 'speculation' : 'logic'
  }));

  const labels = {
    sq: { title: "SPEKTROGRAMI PSIKOLINGUISTIK", logic: "Logjikë", fallacy: "Shtrembërim", speculation: "Spekulim", dogmatic: "DOGMATIK", open: "I HAPUR", populist: "POPULIST", elitist: "ELITAR" },
    en: { title: "PSYCHOLINGUISTIC SPECTROGRAM", logic: "Logic", fallacy: "Fallacy", speculation: "Speculation", dogmatic: "DOGMATIC", open: "OPEN", populist: "POPULIST", elitist: "ELITIST" }
  };
  const t = labels[lang];

  const mindsetValue = psychometrics.mindset?.dogmaticVsOpen ?? 0;
  const populismValue = psychometrics.mindset?.populistVsElitist ?? 0;

  return (
    <div className="w-full mt-4 p-4 bg-slate-900/90 rounded-lg border border-slate-700 shadow-inner backdrop-blur-sm">
      <h5 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider flex justify-between items-center">
          <span>{t.title}</span>
          <span className="text-[10px] text-slate-600 font-mono">LIVE FEED ANALYTICS</span>
      </h5>
      
      {/* Voiceprint Timeline */}
      <div className="flex items-end h-24 gap-[2px] mb-4 opacity-90 overflow-hidden relative">
        {/* Grid lines */}
        <div className="absolute w-full h-full border-t border-b border-slate-800/50 pointer-events-none"></div>
        <div className="absolute top-1/2 w-full h-px bg-slate-800/30 pointer-events-none"></div>

        {timelineData.map((point, i) => {
          let colorClass = 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]'; // Logic
          if (point.type === 'fallacy') colorClass = 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]';
          if (point.type === 'speculation') colorClass = 'bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]';
          
          return (
            <div 
              key={i} 
              className={`w-full rounded-t-sm ${colorClass} transition-all duration-500 hover:brightness-125 hover:scale-y-110 origin-bottom`}
              style={{ height: `${point.intensity}%` }}
              title={`${point.type.toUpperCase()}: ${Math.round(point.intensity)}% intensity`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-start gap-6 text-[10px] text-slate-400 mb-6 px-1 font-mono uppercase">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_4px_#3b82f6]"></span> {t.logic}</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_4px_#facc15]"></span> {t.speculation}</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_4px_#ef4444]"></span> {t.fallacy}</div>
      </div>
      
      {/* Mindset Gauges */}
      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-700/50">
           {/* Dogmatic vs Open */}
           <div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1 uppercase tracking-wider">
                    <span>{t.dogmatic}</span>
                    <span>{t.open}</span>
                </div>
                <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-slate-800 to-blue-900 opacity-60"></div>
                    <div 
                        className="absolute top-0 h-full w-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-700 ease-out"
                        style={{ left: `${mindsetValue}%`, transform: 'translateX(-50%)' }}
                    ></div>
                </div>
           </div>

           {/* Populist vs Elitist */}
           <div>
                <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1 uppercase tracking-wider">
                    <span>{t.populist}</span>
                    <span>{t.elitist}</span>
                </div>
                <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-900 via-slate-800 to-purple-900 opacity-60"></div>
                    <div 
                        className="absolute top-0 h-full w-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-700 ease-out"
                        style={{ left: `${populismValue}%`, transform: 'translateX(-50%)' }}
                    ></div>
                </div>
           </div>
      </div>
    </div>
  );
};
