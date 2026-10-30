import React from 'react';

interface ArgumentStrengthMeterProps {
  metric: string;
  labelA: string;
  scoreA: number;
  colorA: string;
  labelB: string;
  scoreB: number;
  colorB: string;
}

export const ArgumentStrengthMeter: React.FC<ArgumentStrengthMeterProps> = ({ metric, labelA, scoreA, colorA, labelB, scoreB, colorB }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 px-1">
        <span>{labelA}</span>
        <span>{labelB}</span>
      </div>
      <div className="relative w-full h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center overflow-hidden">
        <div 
          className="h-full rounded-l-full flex items-center justify-end px-2 text-white font-bold text-xs" 
          style={{ width: `${scoreA}%`, backgroundColor: colorA, transition: 'width 0.5s ease-in-out' }}
        >
          {scoreA > 10 && `${scoreA}%`}
        </div>
        <div 
          className="h-full rounded-r-full flex items-center justify-start px-2 text-white font-bold text-xs" 
          style={{ width: `${scoreB}%`, backgroundColor: colorB, transition: 'width 0.5s ease-in-out' }}
        >
           {scoreB > 10 && `${scoreB}%`}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-3 py-0.5 rounded-full shadow">
            {metric}
          </span>
        </div>
      </div>
    </div>
  );
};
