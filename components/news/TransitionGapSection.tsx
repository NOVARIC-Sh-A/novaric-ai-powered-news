import React from 'react';
import { BreakingNewsArticle } from '../../types';
import { NewsCardWithNerDrawer } from './NewsCardWithNerDrawer';
import { Layers, ChevronDown } from 'lucide-react';

interface TransitionGapSectionProps {
  items: BreakingNewsArticle[];
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (item: BreakingNewsArticle) => void;
}

export const TransitionGapSection: React.FC<TransitionGapSectionProps> = ({
  items,
  isOpen,
  onToggle,
  onNavigate,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="py-3">
      <div className="flex items-center justify-center">
        <button
          onClick={onToggle}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full border border-slate-700/80 text-xs font-mono transition-all shadow-md group"
          title="Shfaq ngjarjet e ndërmjetme midis 1 ore dhe 16 orëve më parë"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>
            {isOpen ? 'Fshih' : 'Shfaq'} lajmet e ndërmjetme (1h – 16h më parë)
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/60 text-amber-300 text-[10px] font-bold">
            {items.length} artikuj
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 p-5 bg-slate-900/50 rounded-2xl border border-amber-500/20 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Lajmet e Intervalit Kalimtar (1h – 16h)</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Artikuj të publikuar midis dritares aktive (60 min) dhe arkivës së thellë (&gt;16 orë).
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-800/50">
              {items.length} artikuj
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <NewsCardWithNerDrawer
                key={item.id}
                article={item}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
