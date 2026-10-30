import React from 'react';
import { BreakingNewsArticle } from '../../types';
import { NewsCardWithNerDrawer } from './NewsCardWithNerDrawer';
import { Radio, RefreshCw, AlertCircle, Clock, Scale } from 'lucide-react';
import { formatSafeUtcTime } from '../../utils/dateWindowUtils';

interface LatestNewsSectionProps {
  items?: BreakingNewsArticle[];
  isLoading: boolean;
  error: string | null;
  serverTime: string;
  windowConfig?: { start?: string; end?: string };
  newlyAddedIds?: Set<string>;
  secondsUntilRefresh: number;
  isRefreshing: boolean;
  isBalanced?: boolean;
  onRefresh: () => void;
  onNavigate: (item: BreakingNewsArticle) => void;
}

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({
  items = [],
  isLoading,
  error,
  serverTime,
  windowConfig = {},
  newlyAddedIds = new Set(),
  secondsUntilRefresh,
  isRefreshing,
  isBalanced = true,
  onRefresh,
  onNavigate,
}) => {
  const safeItems = (items || []).filter(Boolean);

  return (
    <section className="space-y-6 animate-fadeIn" aria-labelledby="latest-news-heading">
      {/* Section Header */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border-2 border-red-500/30 p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-400 font-mono text-xs uppercase tracking-widest">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="font-black">LIVE NEWSROOM RADAR</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Dritarja: 60 Minutat e Fundit</span>
            </div>
            <h2 id="latest-news-heading" className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Lajmet e Fundit
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
              <span>Ora Referencë Server (UTC): {formatSafeUtcTime(serverTime)} UTC</span>
              {windowConfig.start && (
                <>
                  <span>•</span>
                  <span>Pragu: {formatSafeUtcTime(windowConfig.start)} - {windowConfig.end ? formatSafeUtcTime(windowConfig.end) : 'Tani'}</span>
                </>
              )}
              {isBalanced && (
                <>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold inline-flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    <Scale className="w-3 h-3 text-emerald-400" />
                    <span>Balancuar: 3 lajme kryesore / burim</span>
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown / Polling indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono text-xs">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rifreskohet: <strong className="text-cyan-300">{secondsUntilRefresh}s</strong></span>
            </div>

            {/* Manual refresh */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing || isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-md"
              title="Sinkronizo menjëherë"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Duke u rifreskuar...' : 'Rifresko'}</span>
            </button>

            <span className="px-2.5 py-1 rounded-md bg-red-950/80 border border-red-800/60 text-red-300 text-xs font-mono font-bold flex items-center gap-1.5">
              {isBalanced && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
              <span>{safeItems.length} artikuj</span>
            </span>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && safeItems.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
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
            onClick={onRefresh}
            className="px-3 py-1 bg-red-900/80 hover:bg-red-800 text-white rounded text-xs font-mono font-bold uppercase transition-colors"
          >
            Riprovo
          </button>
        </div>
      )}

      {/* Empty State with Radar pulse */}
      {!isLoading && !error && safeItems.length === 0 && (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border-2 border-dashed border-slate-800 space-y-4">
          <div className="inline-flex p-4 bg-slate-800/80 rounded-full text-slate-400 relative">
            <Radio className="w-8 h-8 animate-pulse text-red-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-white">Nuk ka zhvillime në 60 minutat e fundit</h3>
            <p className="text-xs text-slate-400">
              Radarët e lajmeve po monitorojnë burimet globale në kohë reale. Mund të klikoni rifresko për të kontrolluar burimet RSS.
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-700"
          >
            Kontrollo Burimet Tani
          </button>
        </div>
      )}

      {/* Grid of Items */}
      {safeItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeItems.map((item) => (
            <NewsCardWithNerDrawer
              key={item.id}
              article={item}
              onNavigate={onNavigate}
              isNewlyAdded={newlyAddedIds?.has?.(item.id) ?? false}
            />
          ))}
        </div>
      )}
    </section>
  );
};
