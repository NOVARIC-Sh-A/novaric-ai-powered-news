import React, { useEffect, useState } from "react";
import { VipProfile } from "../types";
import { fetchAllProfiles } from "../services/apiService";
import {
  getLatestParagonScores,
  getParagonTrends,
  getCrisisAlerts,
} from "../services/paragonEngine";
import { formatVipName, getProfilePhotoUrl } from "../utils/paragonProfileUtils";
import { PARTIAL_RANKING_LABEL, PARTIAL_RATING_NOTE, PartialRatingBadge } from "../components/figurat-politike/primitives/awaiting";

interface ParagonLeaderboardPageProps {
  onNavigate: (page: string, data?: any) => void;
}

interface LeaderboardProfile extends VipProfile {
  liveScore: number;
  trendDelta?: number | null;
  underCrisis?: boolean;
  crisisSeverity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
}

// FIX: Define helper functions at the component level to ensure they are within scope for the return statement
const rankColor = (score: number) => {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-rose-500";
};

const renderTrendArrow = (delta: number | null | undefined) => {
  if (delta === null || delta === undefined || delta === 0) return null;
  if (delta > 0)
    return <span className="text-emerald-500 ml-2 font-mono text-sm">▲ +{delta}</span>;
  return <span className="text-rose-500 ml-2 font-mono text-sm">▼ {delta}</span>;
};

const renderCrisisBadge = (severity: string | null | undefined) => {
  if (!severity) return null;
  const colors: Record<string, string> = {
    LOW: "bg-emerald-600/20 text-emerald-500 border-emerald-500/30",
    MEDIUM: "bg-amber-600/20 text-amber-500 border-amber-500/30",
    HIGH: "bg-rose-600/20 text-rose-500 border-rose-500/30",
    CRITICAL: "bg-rose-600 text-white border-rose-400 animate-pulse",
  };
  return (
    <span
      className={`ml-3 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded border ${colors[severity] || "bg-slate-700"}`}
    >
      {severity}
    </span>
  );
};

export const ParagonLeaderboardPage: React.FC<ParagonLeaderboardPageProps> = ({
  onNavigate,
}) => {
  const [profiles, setProfiles] = useState<LeaderboardProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------------------------------------
  // Resilient Data Fetching
  // ------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    // FIX: Changed to traditional function syntax to avoid JSX ambiguity with <T> in arrow functions within .tsx files
    async function safeFetch<T>(promise: Promise<T>, fallback: T): Promise<T> {
      try {
        return await promise;
      } catch (e) {
        console.warn("[Leaderboard] Partial fetch failed:", e);
        return fallback;
      }
    }

    const load = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        // We fetch basic profiles first as they are required
        let fetchedVipProfiles: VipProfile[] = [];
        try {
          fetchedVipProfiles = await fetchAllProfiles();
        } catch (err) {
          console.error("[Leaderboard] Required profile fetch failed:", err);
          if (isMounted) {
            setError("Sistemi nuk mund të ngarkonte listën e figurave publike.");
            setLoading(false);
          }
          return;
        }

        // Fetch optional/enrichment data in parallel with fallbacks
        const [liveScores, trendHistory, crisisAlerts] = await Promise.all([
          safeFetch(getLatestParagonScores(), []),
          safeFetch(getParagonTrends(), []),
          safeFetch(getCrisisAlerts(), []),
        ]);

        if (!isMounted) return;

        // Map scores by politician_id for quick lookup
        const scoreMap: Record<string | number, any> = {};
        liveScores.forEach((s) => {
          if (s && s.politician_id) scoreMap[s.politician_id] = s;
        });

        // Map latest trend entry per politician
        const trendMap: Record<string | number, any> = {};
        trendHistory.forEach((row) => {
          if (row && row.politician_id) trendMap[row.politician_id] = row;
        });

        // Crisis map
        const crisisMap: Record<string | number, any> = {};
        crisisAlerts.forEach((c) => {
          if (c && c.politician_id) crisisMap[c.politician_id] = c;
        });

        // Merge profile → score → trends → crisis
        const merged: LeaderboardProfile[] = (fetchedVipProfiles || [])
          .map((p) => {
            const key = p.numericId ?? p.id;
            const s = scoreMap[key];
            const t = trendMap[key];
            const c = crisisMap[key];

            const liveScoreValue = s?.overall_score ?? p.dynamicScore ?? p.latestScore ?? 0;

            return {
              ...p,
              liveScore: liveScoreValue,
              trendDelta: t ? t.delta : null,
              underCrisis: c?.isCritical ?? false,
              crisisSeverity: c?.severity ?? null,
            };
          })
          // Filter to show only relevant profiles and sort by score
          .filter(p => p.name && (p.liveScore > 0 || (p.category && p.category.toLowerCase().includes('politik'))))
          .sort((a, b) => b.liveScore - a.liveScore);

        setProfiles(merged);
        setLoading(false);
      } catch (err) {
        console.error("[Leaderboard] Unexpected processing error:", err);
        if (isMounted) {
          setError("Ndodhi një gabim gjatë përpunimit të të dhënave.");
          setLoading(false);
        }
      }
    };

    load();
    return () => { isMounted = false; };
  }, []);

  // ------------------------------------------------------------
  // Loading state
  // ------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary-600 border-r-4 border-r-transparent" />
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest animate-pulse">Syncing PARAGON Metrics...</p>
      </div>
    );
  }

  // ------------------------------------------------------------
  // Error state
  // ------------------------------------------------------------
  if (error) {
    return (
      <div className="p-12 text-center max-w-md mx-auto">
        <div className="bg-rose-900/20 border border-rose-500/30 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-bold text-rose-500 mb-2">Sync Interrupted</h2>
          <p className="text-slate-300 text-sm mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-500 transition-all font-black text-xs uppercase tracking-widest shadow-lg active:scale-95"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------
  // UI Rendering
  // ------------------------------------------------------------
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl animate-fadeIn">
      <div className="bg-blue-950/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 border border-blue-800/30">

        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tighter uppercase italic" style={{ textShadow: "0 4px 10px rgba(0,0,0,0.5)" }}>
            Renditja PARAGON<sup className="text-white ml-0.5">®</sup>
          </h1>
          <div className="h-1 w-24 bg-primary-600 mx-auto rounded-full mb-4"></div>
          <p className="text-slate-200 text-sm font-semibold max-w-3xl mx-auto">
            {PARTIAL_RANKING_LABEL}
          </p>
          <p className="text-slate-400 text-xs mt-2 max-w-3xl mx-auto">
            {PARTIAL_RATING_NOTE}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {profiles.map((p, index) => (
            <div
              key={p.id}
              onClick={() => onNavigate("vipProfilePage", p)}
              className="group cursor-pointer p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-primary-500/50 rounded-2xl shadow-sm transition-all duration-300 flex items-center gap-4 sm:gap-6 relative overflow-hidden"
            >
              {/* Rank Marker */}
              <div className="flex-shrink-0 w-12 text-center">
                 <span className={`text-3xl font-black italic ${index < 3 ? 'text-primary-500' : 'text-slate-700 opacity-50'}`}>
                   #{index + 1}
                 </span>
              </div>

              {/* Photo */}
              <div className="relative flex-shrink-0">
                <img
                  src={getProfilePhotoUrl(p)}
                  onError={(e) => {
                      const gender = p?.gender?.toLowerCase();
                      e.currentTarget.src =
                          gender === "female" || gender === "f"
                              ? "https://novaric.co/wp-content/uploads/2025/11/FemaleProfile.jpg"
                              : "https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg";
                  }}
                  alt={p.name}
                  style={{ objectFit: "cover" }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-700 group-hover:border-primary-500 transition-colors"
                />
                {p.underCrisis && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 rounded-full border-2 border-slate-900 animate-ping"></div>
                )}
              </div>

              {/* Details */}
              <div className="flex-grow min-w-0">
                <div className="flex flex-wrap items-center gap-1 mb-1">
                  <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                    {formatVipName(p.name)}
                  </h2>
                  {renderCrisisBadge(p.crisisSeverity)}
                </div>

                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 font-mono uppercase tracking-wider">
                  <span className="truncate">{p.category || "Politikë"}</span>
                  {renderTrendArrow(p.trendDelta)}
                </div>

                {/* Score bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ease-out ${rankColor(p.liveScore).replace('text-', 'bg-')}`}
                    style={{ width: `${p.liveScore}%` }}
                  />
                </div>
              </div>

              {/* Score Value (Right side) */}
              <div className="flex-shrink-0 text-right pr-2">
                <div className={`text-3xl sm:text-4xl font-black font-mono tracking-tighter ${rankColor(p.liveScore)}`}>
                  {Math.round(p.liveScore)}
                </div>
                <div className="text-[9px] font-semibold text-slate-300 mt-1 max-w-[14rem] text-right leading-snug">
                  <PartialRatingBadge coverage={(p as any).coverage} />
                </div>
              </div>
              
              {/* Subtle background highlight for top ranks */}
              {index < 3 && (
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                  <div className="text-9xl font-black">#{index + 1}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {profiles.length === 0 && (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border-2 border-dashed border-slate-800">
            <p className="text-slate-500 font-mono uppercase tracking-widest">Nuk u gjetën të dhëna për renditje.</p>
          </div>
        )}
      </div>

      {/* Methodology Disclaimer */}
      <div className="mt-8 text-center px-4">
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-relaxed max-w-2xl mx-auto">
          {PARTIAL_RATING_NOTE}
        </p>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
};
