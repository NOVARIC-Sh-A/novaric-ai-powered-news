import React, { useMemo } from "react";
import { ProcessedVipProfile } from "../types";
import { getHeatColor } from "../utils/heatmapColors";
import { getProfilePhotoUrl } from "../utils/paragonProfileUtils";

/**
 * Renders a Top 10 ranking of media personalities based on MARAGON® score.
 */
export const Top10MediaInfluencers: React.FC<{
  profiles: Record<string | number, ProcessedVipProfile>;
}> = ({ profiles }) => {

  // Convert map → array
  const list = useMemo(() => {
    // FIX: Cast Object.values to ProcessedVipProfile[] to allow safe property access.
    const arr = Object.values(profiles) as ProcessedVipProfile[];

    return arr
      .filter((p) => p?.processedAnalysis?.overallScore !== undefined)
      .sort(
        (a, b) =>
          // FIX: overallScore is now safely accessible because of the cast above.
          (b.processedAnalysis.overallScore ?? 0) - (a.processedAnalysis.overallScore ?? 0)
      )
      .slice(0, 10); // Top 10 only
  }, [profiles]);

  if (list.length === 0) return null;

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-10">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
        Top 10 Personalitetet Mediatike më me Ndikim (MARAGON®)
      </h2>

      <div className="space-y-4">
        {list.map((p, index) => {
          const score = p.processedAnalysis.overallScore;
          const heat = getHeatColor(score);

          return (
            <div
              key={p.id}
              className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition"
            >
              {/* RANK NUMBER */}
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-600 text-white font-bold">
                {index + 1}
              </div>

              {/* PHOTO */}
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
                style={{ objectFit: "cover", objectPosition: "center" }}
                className="w-12 h-12 rounded-full object-cover border border-slate-300 dark:border-slate-600"
              />

              {/* NAME & SCORE */}
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {p.name}
                </p>

                {/* Score Bar */}
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
                  <div
                    className={`h-full rounded-full transition-all ${heat}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>

              {/* Score number */}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {score}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};