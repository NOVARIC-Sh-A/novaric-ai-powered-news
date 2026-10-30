import React, { useState } from 'react';
import { BreakingNewsArticle } from '../../types';
import { NewsCard } from '../NewsCard';
import { CpuChipIcon, ChevronDownIcon, XMarkIcon, GlobeAltIcon } from '../icons';
import { ExternalLink, Sparkles } from 'lucide-react';
import { NerBreakdownPanel } from '../NerBreakdownPanel';
import { getArticleSourceUrl } from '../../utils/newsSourceUtils';

interface NewsCardWithNerDrawerProps {
  article: BreakingNewsArticle;
  onNavigate: (item: BreakingNewsArticle) => void;
  isNewlyAdded?: boolean;
}

export const NewsCardWithNerDrawer: React.FC<NewsCardWithNerDrawerProps> = ({
  article,
  onNavigate,
  isNewlyAdded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!article) return null;

  return (
    <div className={`flex flex-col gap-2 relative transition-all duration-500 ${isNewlyAdded ? 'ring-2 ring-emerald-400/80 rounded-xl p-0.5 bg-emerald-950/20 shadow-[0_0_20px_rgba(52,211,153,0.3)] animate-pulse' : ''}`}>
      {isNewlyAdded && (
        <div className="absolute -top-2.5 left-4 z-40 bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-[9px] font-black font-mono uppercase tracking-widest flex items-center gap-1 shadow-md">
          <Sparkles className="w-2.5 h-2.5" />
          <span>I sapo mbërritur</span>
        </div>
      )}

      <div className="relative">
        <NewsCard item={article} onNavigate={onNavigate} />
        {(article.nerBreakdown || article.ecosystemRating !== undefined) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="absolute bottom-2 right-2 z-30 p-1.5 bg-slate-900/90 hover:bg-primary-600 text-white rounded-md border border-white/20 shadow-lg transition-colors flex items-center gap-1 group"
            title="Shiko Analizën Teknike NER"
            aria-label={`Metrikat NER për ${article.title}`}
          >
            <CpuChipIcon className="w-4 h-4 text-cyan-400 group-hover:text-white" />
            <span className="text-[9px] font-bold uppercase tracking-widest hidden group-hover:inline">Metrikat NER</span>
            <ChevronDownIcon className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="animate-fadeIn w-full overflow-hidden rounded-xl border-2 border-primary-500/50 bg-slate-900 shadow-2xl mt-1">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <CpuChipIcon className="w-3.5 h-3.5" />
              <span>DEKONSTRUKSION LIVE // NER CORE ARCHITECTURE</span>
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
              aria-label="Mbyll"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4">
            {article.ecosystemRating !== null && article.ecosystemRating !== undefined && article.nerBreakdown && (
              <NerBreakdownPanel
                ecosystemRating={article.ecosystemRating}
                nerVersion={article.nerVersion}
                breakdown={article.nerBreakdown}
              />
            )}
            {getArticleSourceUrl(article) && (
              <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                  <span>Burimi i certifikuar:</span>
                  <span className="text-white font-bold">{article.sourceName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase tracking-wider">
                    {article.sourceType}
                  </span>
                </div>
                <a
                  href={getArticleSourceUrl(article)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 hover:text-blue-300 rounded-lg border border-blue-500/30 font-mono text-[11px] font-bold transition-colors"
                >
                  <GlobeAltIcon className="w-3.5 h-3.5" />
                  <span>Hap artikullin tek {article.sourceName}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
