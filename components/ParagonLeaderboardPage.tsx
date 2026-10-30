
import React, { useEffect, useState } from "react";
import { VipProfile } from "../types";
import { fetchAllProfiles } from "../services/apiService";
import {
  getLatestParagonScores,
  getParagonTrends,
  getCrisisAlerts,
} from "../services/paragonEngine";
import { formatVipName, getProfilePhotoUrl } from "../utils/paragonProfileUtils";

interface ParagonLeaderboardPageProps {
  onNavigate: (page: string, data?: any) => void;
}

interface LeaderboardProfile extends VipProfile {
  liveScore: number;
  trendDelta?: number | null;
  underCrisis?: boolean;
  crisisSeverity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
}

export const ParagonLeaderboardPage: React.FC<ParagonLeaderboardPageProps> = ({
  onNavigate,
}) => {
  const [profiles, setProfiles] = useState<LeaderboardProfile[]>([]);
  const [scores, setScores] = useState<Record<number, any>>({});
  const [trends, setTrends] = useState<Record<number, any>>({});
  const [crisis, setCrisis] = useState<Record<number, any>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------------------------------------
  // Fetch all leaderboard data in parallel
  // ------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [vipProfiles, liveScores, trendHistory, crisisAlerts] =
          await Promise.all([
            fetchAllProfiles(),
            getLatestParagonScores(),
            getParagonTrends(),
            getCrisisAlerts(),
          ]);

        // Map scores by politician_id
        const scoreMap: Record<string | number, any> = {};
        liveScores.forEach((s) => (scoreMap[s.politician_id] = s));

        // Map latest trend entry per politician
        const trendMap: Record<string | number, any> = {};
        trendHistory.forEach((row) => {
          trendMap[row.politician_id] = row;
        });

        // Crisis map
        const crisisMap: Record<string | number, any> = {};
        crisisAlerts.forEach((c) => {
          crisisMap[c.politician_id] = c;
        });

        // Merge profile → score → trends → crisis
        const merged: LeaderboardProfile[] = vipProfiles
          .map((p) => {
            const key = p.numericId ?? p.id;
            const s = scoreMap[key];
            const t = trendMap[key];
            const c = crisisMap[key];

            const liveScore = s?.overall_score ?? p.dynamicScore ?? 0;

            return {
              ...p,
              liveScore,
              trendDelta: t ? t.delta : null,
              underCrisis: c?.isCritical ?? false,
              crisisSeverity: c?.severity ?? null,
            };
          })
          .sort((a, b) => b.liveScore - a.liveScore);

        setProfiles(merged);
        setScores(scoreMap);
        setTrends(trendMap);
        setCrisis(crisisMap);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError("Nuk mund të ngarkojmë renditjen PARAGON.");
        setLoading(false);
      }
    };

    load();
  }, []);

  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------
  const rankColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-300";
    return "text-red-400";
  };

  const renderTrendArrow = (delta: number | null | undefined) => {
    if (delta === null || delta === undefined) return null;
    if (delta > 0)
      return <span className="text-green-400 ml-2">▲ +{delta}</span>;
    if (delta < 0)
      return <span className="text-red-400 ml-2">▼ {delta}</span>;
    return <span className="text-slate-400 ml-2">▬ 0</span>;
  };

  const renderCrisisBadge = (severity: string | null | undefined) => {
    if (!severity) return null;
    const colors: Record<string, string> = {
      LOW: "bg-green-700",
      MEDIUM: "bg-yellow-600",
      HIGH: "bg-red-700",
      CRITICAL: "bg-red-900 animate-pulse",
    };
    return (
      <span
        className={`ml-3 px-2 py-1 text-xs rounded-md text-white ${colors[severity] || "bg-slate-700"}`}
      >
        {severity}
      </span>
    );
  };

  // ------------------------------------------------------------
  // Loading state
  // ------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600" />
      </div>
    );
  }

  // ------------------------------------------------------------
  // Error state
  // ------------------------------------------------------------
  if (error) {
    return (
      <div className="p-6 text-center dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
        >
          Provo përsëri
        </button>
      </div>
    );
  }

  // ------------------------------------------------------------
  // UI Rendering
  // ------------------------------------------------------------
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto bg-blue-950/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-blue-800/30 text-white">

        <h1
          className="text-3xl sm:text-4xl font-extrabold text-white mb-8 text-center leading-tight drop-shadow-md"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
        >
          Renditja PARAGON<sup className="text-white ml-1">®</sup> — Performanca Politike
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {profiles.map((p, index) => (
            <div
              key={p.id}
              onClick={() => onNavigate("vipProfilePage", p)}
              className="cursor-pointer p-4 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow flex items-center gap-4"
            >
              {/* Rank Badge */}
              <div className="text-4xl font-black text-slate-400 dark:text-slate-600 w-14 text-center">
                #{index + 1}
              </div>

              {/* Photo */}
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
                className="w-20 h-20 rounded-md object-cover border border-slate-300 dark:border-slate-600"
              />

              {/* Details */}
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                  {formatVipName(p.name)}
                  {renderCrisisBadge(p.crisisSeverity)}
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {p.category || "Figurë Politike"}
                </p>

                {/* Score bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mt-2">
                  <div
                    className="h-3 rounded-full bg-red-600"
                    style={{ width: `${p.liveScore ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Score Value + Trend */}
              <div className="flex flex-col items-end ml-4">
                <div className={`text-2xl font-bold ${rankColor(p.liveScore)}`}>
                  {p.liveScore}
                </div>
                <div>{renderTrendArrow(p.trendDelta)}</div>
              </div>
            </div>
          ))}
        </div>

        {profiles.length === 0 && (
          <p className="text-center text-slate-300 mt-10">
            Nuk u gjetën të dhëna për renditje.
          </p>
        )}
      </div>
    </main>
  );
};
