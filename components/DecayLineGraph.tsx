import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface DecayLineGraphProps {
  active?: boolean;
}

export const DecayLineGraph: React.FC<DecayLineGraphProps> = ({ active = false }) => {
  const { language } = useLanguage();
  
  const labels = {
    sq: {
        title: "Funksioni i Rënies Kohore (TRF)",
        marker: "Degradimi_Ngjarjes (T+24h)",
        xAxis: "Orët nga Fillimi →",
        yAxis: "Multiplikatori i Rëndësisë ↓"
    },
    en: {
        title: "Temporal Decay Function (TRF)",
        marker: "Event_Degradation (T+24h)",
        xAxis: "Hours Since Genesis →",
        yAxis: "Relevance Multiplier ↓"
    }
  };

  const t = labels[language];

  return (
    <div className="w-full flex flex-col items-center">
      <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary-600 dark:text-primary-400 mb-10">{t.title}</h4>
      <svg viewBox="0 0 400 250" className="w-full h-64 overflow-visible">
        <defs>
          <linearGradient id="decayGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e4191e" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Grid and Axes */}
        <g opacity="0.1">
           {[0, 50, 100, 150, 200].map(v => (
             <line key={v} x1="40" y1={210-v} x2="360" y2={210-v} stroke="currentColor" strokeWidth="1" />
           ))}
        </g>
        <line x1="40" y1="210" x2="360" y2="210" stroke="#1e293b" strokeWidth="2" className="dark:stroke-slate-700" />
        <line x1="40" y1="210" x2="40" y2="20" stroke="#1e293b" strokeWidth="2" className="dark:stroke-slate-700" />
        
        {/* Decay Path */}
        <path 
          d="M 40 40 Q 150 180 360 200" 
          fill="none" 
          stroke="url(#decayGrad)" 
          strokeWidth="4" 
          style={{ 
            filter: 'url(#glow)', 
            strokeDasharray: '500', 
            strokeDashoffset: active ? '0' : '500', 
            transition: 'stroke-dashoffset 2s ease-in-out' 
          }}
        />
        
        {/* Dynamic Marker */}
        <g transform="translate(160, 145)" opacity={active ? 1 : 0} style={{ transition: 'opacity 0.5s ease-in-out 1s' }}>
          <circle r="6" fill="#e4191e" className="animate-ping" />
          <circle r="6" fill="#e4191e" />
          <text x="15" y="-15" fill="currentColor" fontSize="11" fontWeight="900" fontFamily="monospace" className="uppercase text-slate-900 dark:text-white">{t.marker}</text>
        </g>
      </svg>
      <div className="mt-6 flex gap-12 text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest">
        <span>{t.xAxis}</span>
        <span>{t.yAxis}</span>
      </div>
    </div>
  );
};