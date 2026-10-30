import React from 'react';
import { Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DimensionSliderProps {
  label: string;
  description: string;
  icon: string;
  value: number;
  onChange: (newVal: number) => void;
  isModifier?: boolean;
}

export const DimensionSlider: React.FC<DimensionSliderProps> = ({
  label,
  description,
  icon,
  value,
  onChange,
  isModifier = false
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-3 group">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="font-bold text-sm uppercase tracking-widest text-slate-800 dark:text-slate-300 flex items-center gap-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            <span className="text-lg" role="img" aria-label={label}>{icon}</span> {label}
          </h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5 font-medium">{description}</p>
        </div>
        <div className="flex flex-col items-end">
             <span className="text-2xl font-black font-mono text-primary-600 dark:text-sapphire leading-none">{value.toFixed(0)}%</span>
             {isModifier && <span className="text-[8px] font-bold text-sapphire/60 uppercase">{language === 'sq' ? 'Modifikues' : 'Modifier'}</span>}
        </div>
      </div>
      
      <div className="relative pt-1">
        <input 
          type="range" 
          min="0" 
          max={isModifier ? 30 : 100} 
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500 hover:accent-primary-400 transition-all"
        />
        {isModifier && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-sapphire/10 rounded border border-sapphire/20 text-[9px] text-sapphire font-bold uppercase tracking-widest animate-fadeIn">
            <Activity className="w-3 h-3" /> {language === 'sq' ? 'Multiplikatori i Ndikimit' : 'Impact Multiplier'}: {(1 + (value - 10) / 100).toFixed(2)}x
          </div>
        )}
      </div>
    </div>
  );
};