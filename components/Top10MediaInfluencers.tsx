import React, { useMemo } from "react";
import { ProcessedVipProfile } from "../types";
import { getProfilePhotoUrl } from "../utils/paragonProfileUtils";
import { formatPersonName } from "../utils/formatPersonName";
import { maragonScoresArePublic, publishedMaragonAverage } from "../utils/maragonPublication";
import { compareMaragonNeutral, publishedBand, publicBandText } from "../utils/maragonBandsOnly";

/**
 * Media personalities with a published MARAGON® band.
 *
 * Signed v1.0 §1.2 puts "any ranking of subjects against each other" out of scope and §3.1 makes scores
 * criterion-referenced; §10 allows bands only. This list therefore has no rank numbers, no score bars, no
 * "Top 10" cut and no ordering by score or band: it is alphabetical, and shows each published band in words.
 * A band needs the full gate: approved assessment, not suspended, and methodologyApproved === true.
 * (The export name is kept for import compatibility.)
 */
export const Top10MediaInfluencers: React.FC<{
  profiles: Record<string | number, ProcessedVipProfile>;
}> = ({ profiles }) => {
  const list = useMemo(() => {
    const arr = Object.values(profiles) as ProcessedVipProfile[];
    return arr
      .map((profile) => ({ profile, band: publishedBand(maragonScoresArePublic(profile as any), publishedMaragonAverage(profile as any)) }))
      .filter((entry) => entry.band !== null)
      .sort((a, b) => compareMaragonNeutral(a.profile, b.profile));
  }, [profiles]);

  if (list.length === 0) return null;

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-10" aria-label="MARAGON®">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
        Personalitete mediatike me brez MARAGON® të publikuar
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Renditje alfabetike. MARAGON® nuk rendit subjektet ndërmjet tyre. / Alphabetical order. MARAGON® does not rank subjects against each other.
      </p>
      <ul className="space-y-3">
        {list.map(({ profile: p, band }) => (
          <li
            key={p.id}
            className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
            data-maragon-band={band?.band ?? 'not_assessed'}
          >
            <img
              src={getProfilePhotoUrl(p)}
              onError={(e) => {
                const gender = p?.gender?.toLowerCase();
                e.currentTarget.src =
                  gender === "female" || gender === "f"
                    ? "https://novaric.co/wp-content/uploads/2025/11/FemaleProfile.jpg"
                    : "https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg";
              }}
              alt={formatPersonName(p.name)}
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="w-12 h-12 rounded-full object-cover border border-slate-300 dark:border-slate-600"
            />
            <p className="flex-1 font-semibold text-slate-800 dark:text-slate-100">{formatPersonName(p.name)}</p>
            <span className="font-bold text-slate-700 dark:text-slate-300">{publicBandText(band, 'sq')} / {publicBandText(band, 'en')}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
