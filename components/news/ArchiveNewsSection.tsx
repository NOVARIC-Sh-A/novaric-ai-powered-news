import React from 'react';
import { BreakingNewsArticle } from '../../types';
import { NewsCardWithNerDrawer } from './NewsCardWithNerDrawer';
import { Archive, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { formatSafeUtcDateTime } from '../../utils/dateWindowUtils';

interface ArchiveNewsSectionProps {
  items?: BreakingNewsArticle[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  serverTime: string;
  windowConfig?: { end?: string };
  nextCursor: string | null;
  totalCount: number;
  onLoadMore: () => void;
  onRetry: () => void;
  onNavigate: (item: BreakingNewsArticle) => void;
}

export const ArchiveNewsSection: React.FC<ArchiveNewsSectionProps> = ({
  items = [],
  isLoading,
  isLoadingMore,
  error,
  serverTime,
  windowConfig = {},
  nextCursor,
  totalCount,
  onLoadMore,
  onRetry,
  onNavigate,
}) => {
  const safeItems = (items || []).filter(Boolean);
  const formattedEnd = windowConfig.end ? formatSafeUtcDateTime(windowConfig.end) : '';

  return (
    <section className="space-y-6 pt-6 border-t border-slate-800" aria-labelledby="archive-news-heading">
      {/* Section Header */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/60 p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest">
              <Archive className="w-3.5 h-3.5" />
              <span className="font-bold">HISTORIKU I VERIFIKUAR</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Pragu: Mbi 16 Orë më parë</span>
            </div>
            <h2 id="archive-news-heading" className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Arkiva e Lajmeve
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Arkiva historike e ngjarjeve kombëtare dhe globale të analizuara me protokollin NER.
              {formattedEnd && (
                <span> (Artikuj të publikuar para: {formattedEnd} UTC)</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-mono font-bold">
              {safeItems.length} {totalCount > safeItems.length ? `nga ${totalCount}` : ''} artikuj
            </span>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && items.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-slate-900/60 rounded-xl border border-slate-800 h-96 animate-pulse p-4 space-y-4">
              <div className="h-44 bg-slate-800 rounded-lg"></div>
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center justify-between gap-4 text-red-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-red-900/80 hover:bg-red-800 text-white rounded text-xs font-mono font-bold uppercase transition-colors"
          >
            Riprovo
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && safeItems.length === 0 && (
        <div className="text-center py-16 px-4 bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-800 space-y-2">
          <Archive className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm text-slate-400">Nuk u gjetën artikuj arkivorë me filtrat aktualë.</p>
        </div>
      )}

      {/* Items Grid */}
      {safeItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeItems.map((item) => (
            <NewsCardWithNerDrawer
              key={item.id}
              article={item}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls / Cursor Load More */}
      {safeItems.length > 0 && (
        <div className="text-center py-6">
          {nextCursor ? (
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white font-bold text-sm rounded-xl border border-slate-700 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Duke ngarkuar arkivën...</span>
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4 text-blue-400" />
                  <span>Ngarko më shumë nga Arkiva</span>
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/60 rounded-full border border-slate-800 text-slate-400 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Keni arritur fundin e arkivës së lajmeve</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
