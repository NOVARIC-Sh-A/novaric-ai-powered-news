import React, { useEffect, useRef, useMemo, useState } from 'react';
import { BreakingNewsArticle } from '../types';
import { GlobeAltIcon, MapPinIcon } from './icons';
import { fetchBreakingNews } from '../services/newsService';

/* ============================================================
   TYPES
============================================================ */

interface NewsTickerProps {
  initialNews: BreakingNewsArticle[];
  onNavigateToNewsArticle: (item: BreakingNewsArticle) => void;
  onNavigateToNewsList: () => void;
}

interface TickerRowProps {
  items: BreakingNewsArticle[];
  onArticleClick: (item: BreakingNewsArticle) => void;
  label: React.ReactNode;
  icon?: React.ReactNode;
  labelColor: string;
  speed?: number;
  useLogosForSource?: boolean;
  bgColor?: string;
}

/* ============================================================
   TICKER ROW
============================================================ */

const TickerRow: React.FC<TickerRowProps> = ({
  items,
  onArticleClick,
  label,
  icon,
  labelColor,
  speed = 0.5,
  useLogosForSource = false,
  bgColor = 'bg-blue-950/85',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const displayItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    return Array(6).fill(items).flat();
  }, [items]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || displayItems.length === 0) return;

    let offset = 0;

    const animate = () => {
      if (!isPausedRef.current) {
        offset -= speed;

        const resetPoint = track.scrollWidth / 6;
        if (Math.abs(offset) >= resetPoint) {
          offset = 0;
        }

        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [displayItems, speed]);

  if (items.length === 0) return null;

  return (
    <div
      className={`flex w-full items-center ${bgColor} backdrop-blur-sm border-b border-white/10 h-8 overflow-hidden relative`}
      onMouseEnter={() => (isPausedRef.current = true)}
      onMouseLeave={() => (isPausedRef.current = false)}
    >
      {/* LABEL */}
      <div
        className={`flex-shrink-0 flex items-center px-3 h-full z-20 ${labelColor} text-white text-[10px] font-bold uppercase tracking-wider shadow-md`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </div>

      {/* CONTENT */}
      <div className="flex-grow overflow-hidden relative h-full flex items-center">
        <div
          ref={trackRef}
          className="flex gap-8 px-4 will-change-transform items-center whitespace-nowrap"
        >
          {displayItems.map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => onArticleClick(item)}
              className="flex items-center gap-2 cursor-pointer hover:text-cyan-400 transition-colors focus:outline-none"
            >
              <span className="text-yellow-500 font-bold text-xs">•</span>

              {useLogosForSource ? (
                <div className="flex items-center gap-2 mx-1 opacity-80">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/CNN.svg" alt="CNN" className="h-2.5 brightness-0 invert" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/eb/BBC.svg" alt="BBC" className="h-2.5 brightness-0 invert" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Euronews.svg" alt="Euronews" className="h-2.5 brightness-0 invert" />
                </div>
              ) : (
                <span className="text-xs uppercase text-slate-400 font-semibold tracking-wide">
                  {item.sourceName}:
                </span>
              )}

              <span className="text-xs text-slate-200 font-medium">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT FADE */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-current to-transparent pointer-events-none z-10" />
    </div>
  );
};

/* ============================================================
   MAIN NEWS TICKER
============================================================ */

export const NewsTicker: React.FC<NewsTickerProps> = ({
  initialNews,
  onNavigateToNewsArticle,
  onNavigateToNewsList,
}) => {
  const [news, setNews] = useState<BreakingNewsArticle[]>(() => {
    if (Array.isArray(initialNews) && initialNews.length > 0) {
      return initialNews;
    }
    return [];
  });

  /* --------------------------------------------
     Sync with parent initialNews updates
  -------------------------------------------- */
  useEffect(() => {
    if (Array.isArray(initialNews) && initialNews.length > 0) {
      setNews(initialNews);
    }
  }, [initialNews]);

  /* --------------------------------------------
     Periodic refresh (backend authoritative)
  -------------------------------------------- */
  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      try {
        const latest = await fetchBreakingNews();
        if (isMounted && Array.isArray(latest) && latest.length > 0) {
          setNews(latest);
        }
      } catch (err) {
        console.warn('[NewsTicker] refresh failed:', err);
      }
    };

    refresh();
    const interval = setInterval(refresh, 60_000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  /* --------------------------------------------
     Source-safe filtering
  -------------------------------------------- */
  const worldNews = useMemo(
    () =>
      news.filter(
        (n) =>
          n.sourceType === 'international' ||
          n.sourceType === 'balkan'
      ),
    [news]
  );

  const localNews = useMemo(
    () => news.filter((n) => n.sourceType === 'albanian'),
    [news]
  );

  /* --------------------------------------------
     Visible fallback (NO silent failure)
  -------------------------------------------- */
  if (!news || news.length === 0) {
    return (
      <div className="w-full bg-blue-950/85 backdrop-blur-sm border-y border-white/10 flex items-center justify-between px-4 py-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Po përditësohen lajmet e fundit…</span>
        </div>
        <button
          onClick={onNavigateToNewsList}
          className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline bg-slate-800/85 px-2 py-1 rounded border border-cyan-500/30"
        >
          Arkiva →
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-blue-950/85 backdrop-blur-sm border-y border-white/10 flex flex-col relative">
      {/* WORLD */}
      {worldNews.length > 0 && (
        <TickerRow
          items={worldNews}
          onArticleClick={onNavigateToNewsArticle}
          label="BOTA"
          icon={<GlobeAltIcon className="w-3 h-3" />}
          labelColor="bg-blue-900"
          speed={2.4}
          useLogosForSource
        />
      )}

      {/* LOCAL */}
      {localNews.length > 0 && (
        <TickerRow
          items={localNews}
          onArticleClick={onNavigateToNewsArticle}
          label="LOKALE"
          icon={<MapPinIcon className="w-3 h-3" />}
          labelColor="bg-red-900"
          bgColor="bg-primary-500/85"
          speed={2.4}
        />
      )}

      {/* ARCHIVE */}
      <div className="absolute right-0 top-0 h-full flex items-center pr-2 pl-6 bg-gradient-to-l from-blue-950/85 via-blue-950/85 to-transparent z-30">
        <button
          onClick={onNavigateToNewsList}
          className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline whitespace-nowrap bg-slate-800/85 px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-sm"
        >
          Arkiva →
        </button>
      </div>
    </div>
  );
};