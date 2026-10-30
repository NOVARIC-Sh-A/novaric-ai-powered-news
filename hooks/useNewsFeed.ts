import { useState, useEffect, useCallback, useRef } from 'react';
import { BreakingNewsArticle, NewsApiResponse } from '../types';
import { fetchNewsFeed } from '../services/newsService';
import { getNewsFeedConfig } from '../config/newsFeedConfig';
import {
  getNewsWindows,
  isWithinLatestWindow,
  isWithinArchiveWindow,
  deduplicateNewsArticles,
} from '../utils/dateWindowUtils';

export interface UseNewsFeedOptions {
  categoryFilter?: string | null;
  searchTerm?: string;
  selectedSource?: string | null;
  sortBy?: 'newest' | 'oldest' | 'ner_score';
  autoRefreshIntervalMs?: number;
}

export function useNewsFeed({
  categoryFilter,
  searchTerm = '',
  selectedSource = null,
  sortBy = 'newest',
  autoRefreshIntervalMs = 30000,
}: UseNewsFeedOptions) {
  // Server anchor time and clock fallback safety
  const [serverTime, setServerTime] = useState<string>(() => new Date().toISOString());
  const [isClientClockFallback, setIsClientClockFallback] = useState<boolean>(false);

  // Section A: Latest News (<= 60m)
  const [latestItems, setLatestItems] = useState<BreakingNewsArticle[]>([]);
  const [isLatestLoading, setIsLatestLoading] = useState<boolean>(true);
  const [latestError, setLatestError] = useState<string | null>(null);
  const [latestWindow, setLatestWindow] = useState<{ start?: string; end?: string }>({});
  const [newlyAddedIds, setNewlyAddedIds] = useState<Set<string>>(new Set());

  // Section B: Archive News (> 16h)
  const [archiveItems, setArchiveItems] = useState<BreakingNewsArticle[]>([]);
  const [isArchiveLoading, setIsArchiveLoading] = useState<boolean>(true);
  const [isArchiveLoadingMore, setIsArchiveLoadingMore] = useState<boolean>(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [archiveWindow, setArchiveWindow] = useState<{ end?: string }>({});
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [archiveTotal, setArchiveTotal] = useState<number>(0);

  // Transition Gap Items (60m - 16h)
  const [gapItems, setGapItems] = useState<BreakingNewsArticle[]>([]);
  const [showGap, setShowGap] = useState<boolean>(false);

  // Refresh & Polling status
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshSuccess, setRefreshSuccess] = useState<boolean>(false);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState<number>(Math.round(autoRefreshIntervalMs / 1000));

  const knownLatestIdsRef = useRef<Set<string>>(new Set());
  const inFlightLatestPromiseRef = useRef<Promise<void> | null>(null);
  const lastLatestCallMsRef = useRef<number>(0);

  // Launch Controls / Ramp status
  const [rampControl] = useState(() => {
    const cfg = getNewsFeedConfig();
    const isBrowser = typeof window !== 'undefined';
    const hasCanaryParam = isBrowser && new URLSearchParams(window.location.search).get('canary') === '1';
    const hasCanaryStorage = isBrowser && window.localStorage.getItem('novaric_canary_optin') === 'true';
    const isCanaryUser = hasCanaryParam || hasCanaryStorage;

    const isEnabled = cfg.rampMode === 'full' || (cfg.rampMode === 'canary' && isCanaryUser);

    return {
      rampMode: cfg.rampMode,
      isEnabled,
      isCanary: isCanaryUser,
    };
  });

  // 1. Fetch Section A (Latest) with debounce and request coalescing
  const loadLatest = useCallback(async (isManualRefresh = false) => {
    const now = Date.now();
    // Debounce rapid successive calls within 300ms unless manual refresh
    if (!isManualRefresh && inFlightLatestPromiseRef.current && now - lastLatestCallMsRef.current < 300) {
      return inFlightLatestPromiseRef.current;
    }
    lastLatestCallMsRef.current = now;

    const promise = (async () => {
      try {
        setIsLatestLoading(true);
        setLatestError(null);

        const res: NewsApiResponse = await fetchNewsFeed({
          scope: 'latest',
          category: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
          q: searchTerm || undefined,
          sourceName: selectedSource || undefined,
          sort: sortBy,
          refresh: isManualRefresh,
        });

        if (res.serverTime) {
          setServerTime(res.serverTime);
          setIsClientClockFallback(false);
        } else {
          setIsClientClockFallback(true);
          console.warn('[useNewsFeed] Clock safety warning: Server anchor time unavailable. Falling back to client UTC clock...');
        }
        setLatestWindow(res.window || {});

        // Safely extract items
        const items = Array.isArray(res?.items) ? res.items : [];

        // Check for newly added items to highlight
        const currentIds = new Set(items.map((i) => i.id));
        if (knownLatestIdsRef.current.size > 0 && !isManualRefresh) {
          const fresh = new Set<string>();
          for (const id of currentIds) {
            if (!knownLatestIdsRef.current.has(id)) {
              fresh.add(id);
            }
          }
          if (fresh.size > 0) {
            setNewlyAddedIds(fresh);
            setTimeout(() => setNewlyAddedIds(new Set()), 6000);
          }
        }
        knownLatestIdsRef.current = currentIds;

        setLatestItems(items);
      } catch (err: any) {
        console.error('[useNewsFeed] Failed to load latest news:', err);
        setIsClientClockFallback(true);
        console.warn('[useNewsFeed] Clock safety warning: Network error, falling back to client UTC clock...');
        setLatestError(err.message || 'Dështoi ngarkimi i lajmeve të fundit.');
      } finally {
        setIsLatestLoading(false);
        inFlightLatestPromiseRef.current = null;
      }
    })();

    inFlightLatestPromiseRef.current = promise;
    return promise;
  }, [categoryFilter, searchTerm, selectedSource, sortBy]);

  // 2. Fetch Section B (Archive - initial page)
  const loadArchive = useCallback(async (isManualRefresh = false) => {
    try {
      setIsArchiveLoading(true);
      setArchiveError(null);

      const res: NewsApiResponse = await fetchNewsFeed({
        scope: 'archive',
        category: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
        q: searchTerm || undefined,
        sourceName: selectedSource || undefined,
        sort: sortBy,
        limit: 50,
        refresh: isManualRefresh,
      });

      if (res.serverTime) {
        setServerTime(res.serverTime);
      }
      const items = Array.isArray(res?.items) ? res.items : [];
      setArchiveWindow(res.window || {});
      setArchiveItems(items);
      setNextCursor(res.nextCursor || null);
      setArchiveTotal(res.total || items.length);
    } catch (err: any) {
      console.error('[useNewsFeed] Failed to load news archive:', err);
      setArchiveError(err.message || 'Dështoi ngarkimi i arkivës së lajmeve.');
    } finally {
      setIsArchiveLoading(false);
    }
  }, [categoryFilter, searchTerm, selectedSource, sortBy]);

  // 3. Load More Archive via cursor pagination
  const loadMoreArchive = useCallback(async () => {
    if (!nextCursor || isArchiveLoadingMore) return;
    try {
      setIsArchiveLoadingMore(true);
      const res: NewsApiResponse = await fetchNewsFeed({
        scope: 'archive',
        category: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
        q: searchTerm || undefined,
        sourceName: selectedSource || undefined,
        sort: sortBy,
        cursor: nextCursor,
        limit: 50,
      });

      const newItems = Array.isArray(res?.items) ? res.items : [];
      setArchiveItems((prev) => deduplicateNewsArticles([...(prev || []), ...newItems]));
      setNextCursor(res.nextCursor || null);
    } catch (err: any) {
      console.error('[useNewsFeed] Failed to paginate archive:', err);
    } finally {
      setIsArchiveLoadingMore(false);
    }
  }, [nextCursor, isArchiveLoadingMore, categoryFilter, searchTerm, selectedSource, sortBy]);

  // 4. Fetch Transition Gap items (for optional toggle inspection)
  const loadGapItems = useCallback(async () => {
    try {
      const res: NewsApiResponse = await fetchNewsFeed({
        scope: 'all',
        category: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
        q: searchTerm || undefined,
        sourceName: selectedSource || undefined,
        sort: sortBy,
      });

      const items = Array.isArray(res?.items) ? res.items : [];
      const sTime = res.serverTime || serverTime;
      // Filter items that fall in the gap (between 60m and 16h)
      const gap = items.filter(
        (item) => item?.publishedAt && !isWithinLatestWindow(item.publishedAt, sTime) && !isWithinArchiveWindow(item.publishedAt, sTime)
      );
      setGapItems(gap);
    } catch (e) {
      // Non-blocking
    }
  }, [categoryFilter, searchTerm, selectedSource, sortBy, serverTime]);

  // Combined Refresh
  const refreshAll = useCallback(
    async (isManual = true) => {
      if (isRefreshing) return;
      setIsRefreshing(true);
      setRefreshSuccess(false);
      try {
        await Promise.all([loadLatest(isManual), loadArchive(isManual), loadGapItems()]);
        setRefreshSuccess(true);
        setTimeout(() => setRefreshSuccess(false), 3500);
      } finally {
        setIsRefreshing(false);
        setSecondsUntilRefresh(Math.round(autoRefreshIntervalMs / 1000));
      }
    },
    [isRefreshing, loadLatest, loadArchive, loadGapItems, autoRefreshIntervalMs]
  );

  // Initial load and filter change reload
  useEffect(() => {
    loadLatest(false);
    loadArchive(false);
    loadGapItems();
  }, [loadLatest, loadArchive, loadGapItems]);

  // Polling interval & countdown timer
  useEffect(() => {
    if (autoRefreshIntervalMs <= 0) return;

    const interval = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          loadLatest(false);
          return Math.round(autoRefreshIntervalMs / 1000);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefreshIntervalMs, loadLatest]);

  return {
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
    retryLatest: () => loadLatest(false),
    retryArchive: () => loadArchive(false),
    isClientClockFallback,
    rampControl,
  };
}
