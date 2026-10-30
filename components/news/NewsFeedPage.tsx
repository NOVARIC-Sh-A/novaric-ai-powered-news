import React, { useState, useEffect } from 'react';
import { BreakingNewsArticle, FactCheckResult } from '../../types';
import { useNewsFeed } from '../../hooks/useNewsFeed';
import { LatestNewsSection } from './LatestNewsSection';
import { ArchiveNewsSection } from './ArchiveNewsSection';
import { TransitionGapSection } from './TransitionGapSection';
import { OpsDiagnosticsModal } from './OpsDiagnosticsModal';
import { WorldTimeTicker } from '../WorldTimeTicker';
import { InputArea } from '../InputArea';
import { ResultsDisplay } from '../ResultsDisplay';
import { IntegrityReportDisplay } from '../IntegrityReportDisplay';
import { analyzeArticleIntegrity, isFactCheckEngineMisconfigured } from '../../services/factCheckEngine';
import { getSourceLogo } from '../../utils/newsSourceUtils';
import { formatSafeUtcTime } from '../../utils/dateWindowUtils';
import { 
  GlobeAltIcon, 
  MapPinIcon, 
  XMarkIcon 
} from '../icons';
import { 
  RefreshCw, 
  Sparkles, 
  Radio, 
  CheckCircle2, 
  Newspaper,
  Activity,
  Scale
} from 'lucide-react';
import { balanceTitlesPerSource } from '../../utils/newsBalancingUtils';

export interface NewsFeedPageProps {
  onNavigateToNewsArticle: (item: BreakingNewsArticle) => void;
  onBack: () => void;
  categoryFilter: string | null;
  onClearFilter: () => void;
  onNavigateToAnalysisMethodology?: () => void;
  onRefreshNews?: () => Promise<void>;
}

export const NewsFeedPage: React.FC<NewsFeedPageProps> = ({
  onNavigateToNewsArticle,
  onBack,
  categoryFilter: initialCategoryFilter,
  onClearFilter,
  onNavigateToAnalysisMethodology = () => {},
  onRefreshNews,
}) => {
  // Category state (initialized with initialCategoryFilter or 'all')
  const [activeCategory, setActiveCategory] = useState<string>(initialCategoryFilter || 'all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'ner_score'>('newest');
  const [isSourceBalanced, setIsSourceBalanced] = useState<boolean>(true);

  // React to prop updates when category filter changes from external navigation
  useEffect(() => {
    if (initialCategoryFilter) {
      setActiveCategory(initialCategoryFilter);
    }
  }, [initialCategoryFilter]);

  // Fact check state
  const [claim, setClaim] = useState('');
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult | null>(null);
  const [isFactCheckLoading, setIsFactCheckLoading] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [fcError, setFcError] = useState<string | null>(null);
  const [isOpsModalOpen, setIsOpsModalOpen] = useState(false);

  // Hook driving both Section A & Section B
  const {
    serverTime,
    latestItems,
    isLatestLoading,
    latestError,
    latestWindow,
    newlyAddedIds,
    archiveItems,
    isArchiveLoading,
    isArchiveLoadingMore,
    archiveError,
    archiveWindow,
    archiveTotal,
    nextCursor,
    gapItems,
    showGap,
    setShowGap,
    isRefreshing,
    refreshSuccess,
    secondsUntilRefresh,
    refreshAll,
    loadMoreArchive,
    retryLatest,
    retryArchive,
    isClientClockFallback,
    rampControl,
  } = useNewsFeed({
    categoryFilter: activeCategory,
    searchTerm,
    selectedSource,
    sortBy,
  });

  // Balanced latest items: strictly at most 3 major stories per source
  const displayedLatestItems = React.useMemo(() => {
    if (!isSourceBalanced) return latestItems;
    return balanceTitlesPerSource(latestItems, {
      maxStoriesPerSource: 3,
      interleaveSources: selectedSource === null,
    });
  }, [latestItems, isSourceBalanced, selectedSource]);

  const handleRefreshClick = async () => {
    if (onRefreshNews) {
      await onRefreshNews();
    }
    await refreshAll(true);
  };

  const handleFactCheck = async (text: string) => {
    setIsFactCheckLoading(true);
    setFactCheckResult(null);
    setFcError(null);
    try {
      const result = await analyzeArticleIntegrity(text);
      setFactCheckResult(result);
    } catch (e: any) {
      console.error(e);
      setFcError(e.message || 'Ndodhi një gabim gjatë verifikimit.');
    } finally {
      setIsFactCheckLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'NOVARIC® Fact Check & Media Intelligence',
        text: 'Monitorimi i besueshmërisë së informacionit në kohë reale',
        url: window.location.href,
      }).catch(console.error);
    }
  };

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      onClearFilter();
    }
  };

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSearchTerm('');
    setSelectedSource(null);
    setSortBy('newest');
    onClearFilter();
  };

  const hasActiveFilters = activeCategory !== 'all' || searchTerm !== '' || selectedSource !== null || sortBy !== 'newest';

  // Available source outlets derived from loaded articles
  const availableSources = React.useMemo(() => {
    const counts: Record<string, number> = {};
    const itemsToCount = isSourceBalanced ? displayedLatestItems : latestItems;
    [...(itemsToCount || []), ...(archiveItems || []), ...(gapItems || [])].forEach((item) => {
      if (item && item.sourceName) {
        counts[item.sourceName] = (counts[item.sourceName] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [displayedLatestItems, latestItems, archiveItems, gapItems, isSourceBalanced]);

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* --- GLOBAL WORLD TIME TICKER STRIP --- */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold tracking-wider uppercase text-[11px]">LIVE NEWSROOM RADAR // 24/7 RSS MONITORING</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-[11px]">
              <span>28+ Agjenci Lajmesh</span>
              <span>•</span>
              <span>NER v2.4 Certified</span>
              <span>•</span>
              <button
                onClick={() => setIsOpsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 rounded border border-cyan-500/30 transition-colors cursor-pointer font-sans text-[11px]"
                id="open-ops-telemetry-btn"
                title="Hap Panelin e Diagnostikës & Telemetrisë Operative"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Telemetria Operative</span>
              </button>
              <button
                onClick={handleRefreshClick}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer font-sans text-[11px]"
                title="Sinkronizo burimet RSS me kohë reale"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
                <span>{isRefreshing ? 'Duke u sinkronizuar...' : 'Rifresko Feeds'}</span>
              </button>
            </div>
          </div>
          <div className="px-4 py-1.5 bg-slate-950/40">
            <WorldTimeTicker />
          </div>
        </div>

        {/* --- PAGE HEADER --- */}
        <div className="text-center relative py-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-widest mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Transmetim i Integruar i Lajmeve</span>
          </div>
          <h1 
            className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2"
            style={{ textShadow: '2px 2px #dc2626, 4px 4px #111827' }}
          >
            Qendra Operative e Lajmeve
          </h1>
          <p className="text-base sm:text-lg font-medium text-slate-300 max-w-2xl mx-auto">
            Monitorimi në kohë reale i burimeve kombëtare, rajonale dhe ndërkombëtare me vlerësim automatik NER.
          </p>

          {refreshSuccess && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Burimet e lajmeve u sinkronizuan me sukses nga rrjeti global!</span>
            </div>
          )}

          {isClientClockFallback && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-mono">
              <span className="animate-pulse font-bold">⚠️</span>
              <span>Kujdes Operativ: Koha e serverit nuk është e disponueshme; po përdoret ora lokale e shfletuesit (client UTC fallback).</span>
            </div>
          )}

          {rampControl.isCanary && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-950/60 border border-purple-500/40 text-purple-300 text-[11px] font-mono">
              <span>🚀 CANARY FLIGHT TEST ACTIVE (10% Traffic Bucket)</span>
            </div>
          )}
        </div>

        {/* --- REAL-TIME FACT-CHECKING ENGINE --- */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl border border-slate-700/60 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60"></div>
            
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Verifikuesi i Shpejtë i Fakteve & Dekonstruksioni me AI</h2>
              </div>
              <button
                onClick={onNavigateToAnalysisMethodology}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono underline"
              >
                Metodologjia NER
              </button>
            </div>

            <InputArea 
              claim={claim}
              setClaim={setClaim}
              onFactCheck={handleFactCheck}
              isLoading={isFactCheckLoading}
              isMisconfigured={isFactCheckEngineMisconfigured()}
              isMinimized={!!factCheckResult}
              onSearchAgain={() => {
                setFactCheckResult(null);
                setClaim('');
                setFcError(null);
              }}
              onShare={handleShare}
              onNavigateToAnalysisMethodology={onNavigateToAnalysisMethodology}
              isExpanded={isInputExpanded}
              onExpand={() => setIsInputExpanded(true)}
            />
            {fcError && <p className="text-red-400 text-center mt-4 text-sm">{fcError}</p>}
            {factCheckResult && (
              <div className="mt-6">
                {'integrityScore' in factCheckResult ? (
                  <IntegrityReportDisplay 
                    report={factCheckResult as any} 
                    onClose={() => setFactCheckResult(null)} 
                  />
                ) : (
                  <ResultsDisplay 
                    result={factCheckResult} 
                    onClose={() => setFactCheckResult(null)} 
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- NOVARIC CATEGORY TABS --- */}
        <div className="bg-slate-900/60 backdrop-blur-md p-2 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Të Gjitha Burimet
            </button>

            <button
              onClick={() => handleCategorySelect('albanian')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === 'albanian'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPinIcon className="w-3.5 h-3.5" />
              <span>Kombëtare / Shqipëri</span>
            </button>

            <button
              onClick={() => handleCategorySelect('balkan')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === 'balkan'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GlobeAltIcon className="w-3.5 h-3.5" />
              <span>Rajoni / Ballkani</span>
            </button>

            <button
              onClick={() => handleCategorySelect('international')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === 'international'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GlobeAltIcon className="w-3.5 h-3.5" />
              <span>Ndërkombëtare</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              Totali: <strong className="text-white">{latestItems.length + archiveItems.length}</strong> artikuj
            </span>
            <button 
              onClick={onBack} 
              className="text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-widest text-xs"
            >
              Kthehu
            </button>
          </div>
        </div>

        {/* --- SOURCE OUTLET SELECTOR RIBBON --- */}
        {availableSources.length > 0 && (
          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest px-2 flex items-center gap-1">
                <Newspaper className="w-3.5 h-3.5 text-slate-400" />
                <span>Media:</span>
              </span>

              <button
                onClick={() => setSelectedSource(null)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all ${
                  selectedSource === null
                    ? 'bg-slate-700 text-white border border-slate-600'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                Të Gjitha
              </button>

              {availableSources.map(([sourceName, count]) => {
                const isSelected = selectedSource === sourceName;
                return (
                  <button
                    key={sourceName}
                    onClick={() => setSelectedSource(isSelected ? null : sourceName)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                      isSelected
                        ? 'bg-blue-600/30 text-blue-300 border-blue-500 shadow-sm'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <img
                      src={getSourceLogo(sourceName)}
                      alt={sourceName}
                      className="h-3 w-auto object-contain filter grayscale group-hover:grayscale-0"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <span>{sourceName}</span>
                    <span className="text-[9px] px-1 rounded bg-slate-900 text-slate-400 font-mono">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- SEARCH & SORT CONTROLS --- */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-slate-800">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-72">
              <input
                type="text"
                placeholder="Kërko lajme, çështje ose burime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label="Fshij kërkimin"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg outline-none text-sm cursor-pointer"
            >
              <option value="newest">Rendit: Më të rejat (Default)</option>
              <option value="oldest">Rendit: Më të vjetrat</option>
              <option value="ner_score">Rendit: Integriteti më i lartë (NER)</option>
            </select>

            {/* Balance Titles Per Source Toggle */}
            <button
              type="button"
              onClick={() => setIsSourceBalanced((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                isSourceBalanced
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isSourceBalanced ? 'Balancimi aktiv: Vetëm 3 lajme kryesore për burim' : 'Kliko për të balancuar: 3 lajme kryesore për burim'}
            >
              <Scale className={`w-3.5 h-3.5 ${isSourceBalanced ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>Balancim Burimesh</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                isSourceBalanced ? 'bg-emerald-800/80 text-emerald-100' : 'bg-slate-700 text-slate-300'
              }`}>
                {isSourceBalanced ? '3 Tituj / Burim' : 'Të Gjitha'}
              </span>
            </button>

            {hasActiveFilters && (
              <button 
                onClick={clearAllFilters} 
                className="text-xs font-bold text-red-400 hover:text-red-300 underline uppercase tracking-wider px-2 py-1"
              >
                Pastro Filtra
              </button>
            )}
          </div>

          <div className="text-xs font-mono text-slate-400">
            Koha Server: <span className="text-white font-bold">{formatSafeUtcTime(serverTime)} UTC</span>
          </div>
        </div>

        {/* --- SECTION A: LATEST NEWS (<= 60m) --- */}
        <LatestNewsSection
          items={displayedLatestItems}
          isLoading={isLatestLoading}
          error={latestError}
          serverTime={serverTime}
          windowConfig={latestWindow}
          newlyAddedIds={newlyAddedIds}
          secondsUntilRefresh={secondsUntilRefresh}
          isRefreshing={isRefreshing}
          isBalanced={isSourceBalanced}
          onRefresh={handleRefreshClick}
          onNavigate={onNavigateToNewsArticle}
        />

        {/* --- TRANSITION GAP (60m - 16h) TOGGLE --- */}
        <TransitionGapSection
          items={gapItems}
          isOpen={showGap}
          onToggle={() => setShowGap(!showGap)}
          onNavigate={onNavigateToNewsArticle}
        />

        {/* --- SECTION B: ARCHIVE NEWS (> 16h) --- */}
        <ArchiveNewsSection
          items={archiveItems}
          isLoading={isArchiveLoading}
          isLoadingMore={isArchiveLoadingMore}
          error={archiveError}
          serverTime={serverTime}
          windowConfig={archiveWindow}
          nextCursor={nextCursor}
          totalCount={archiveTotal}
          onLoadMore={loadMoreArchive}
          onRetry={retryArchive}
          onNavigate={onNavigateToNewsArticle}
        />

        {/* --- OPS TELEMETRY & DIAGNOSTICS MODAL --- */}
        <OpsDiagnosticsModal
          isOpen={isOpsModalOpen}
          onClose={() => setIsOpsModalOpen(false)}
          onTriggerRefresh={handleRefreshClick}
        />

      </div>
    </main>
  );
};
