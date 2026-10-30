
import React, { useEffect, useState } from "react";
import {
  getLatestScore,
  getTrendHistory,
  getMomentum
} from "../services/paragonService";

import {
  ParagonScore,
  ParagonTrendEntry,
  ParagonDeltaResult
} from "../types/paragonTypes";

export default function ProfilePage({ profileId }: { profileId: number }) {
  const [score, setScore] = useState<ParagonScore | null>(null);
  const [trend, setTrend] = useState<ParagonTrendEntry[]>([]);
  const [momentum, setMomentum] = useState<ParagonDeltaResult | null>(null);

  useEffect(() => {
    (async () => {
      setScore(await getLatestScore(profileId));
      setTrend(await getTrendHistory(profileId));
      setMomentum(await getMomentum(profileId));
    })();
  }, [profileId]);

  return (
    <div className="profile-page bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">

      {/* ============================================ */}
      {/* 1. OVERALL CURRENT PARAGON SCORE */}
      {/* ============================================ */}
      <section className="score-card mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">PARAGON Score</h2>
        {score ? (
          <>
            <div className="overall-score text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
              {score.overall_score}
            </div>

            <ul className="dimensions space-y-2">
              {score.dimension_scores && Object.entries(score.dimension_scores).map(([dimension, data]) => (
                <li key={dimension} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <strong>{dimension}</strong>
                  {/* FIX: Cast data to any to access score property safely. */}
                  <span className="font-mono">{(data as any).score}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No live score available.</p>
        )}
      </section>

      {/* ============================================ */}
      {/* 2. MOMENTUM / DELTA INDICATOR */}
      {/* ============================================ */}
      <section className="momentum-card mb-8 p-4 bg-slate-50 dark:bg-slate-700 rounded-md">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Performance Momentum</h3>

        {momentum ? (
          <div className={`momentum flex items-center gap-2 ${momentum.delta > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            <p className="text-lg">
              Change: <strong>{momentum.delta > 0 ? "+" : ""}{momentum.delta}</strong>
            </p>
            <p className="text-sm">({momentum.delta > 0 ? "Improving" : "Declining"} recently)</p>
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No recent changes recorded</p>
        )}
      </section>

      {/* ============================================ */}
      {/* 3. TREND HISTORY TABLE / CHART READY */}
      {/* ============================================ */}
      <section className="trend-card">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Trend Evolution</h3>

        {trend.length > 0 ? (
          <ul className="trend-list space-y-2">
            {trend.map((t, index) => (
              <li key={index} className="flex justify-between items-center border-b border-slate-200 dark:border-slate-600 pb-2">
                <span className="text-slate-600 dark:text-slate-300">{t.calculated_at.substring(0, 10)}</span>
                <span className="font-bold text-slate-800 dark:text-white">Score: {t.overall_score}</span>
                {t.delta !== undefined && t.delta !== 0 && (
                  <span className={`text-sm font-semibold ${t.delta > 0 ? "text-green-500" : "text-red-500"}`}>
                    ({t.delta > 0 ? "+" : ""}{t.delta})
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No trend data available.</p>
        )}
      </section>
    </div>
  );
}
