import React from 'react';
import { FullProfileAnalysis, VipProfile } from '../types';
import { getProfilePhotoUrl } from '../utils/paragonProfileUtils';

interface PoliticalProfileHeaderProps {
  profile: VipProfile;
  analysis: FullProfileAnalysis;
  liveScore?: number; // NEW PROP
}

export const PoliticalProfileHeader: React.FC<PoliticalProfileHeaderProps> = ({ profile, analysis, liveScore }) => {
    const { performanceAnalysis, profileInput } = analysis;
    const { age, party, title } = profileInput.personal;

    const staticOverallScore = Math.round(performanceAnalysis.individualScores.reduce((a, b) => a + b, 0) / performanceAnalysis.individualScores.length);
    
    // Use live score if available, otherwise static
    const displayScore = liveScore ?? staticOverallScore;
    const scoreColorClass = liveScore !== undefined ? "text-blue-600" : "text-red-600";

    const partyAvg = Math.round(performanceAnalysis.datasets.find(d => d.label.includes('Lokal'))?.scores.reduce((a, b) => a + b, 0)! / 7);
    const localAvg = Math.round(performanceAnalysis.datasets.find(d => d.label.includes('Përgjithshme Lokale'))?.scores.reduce((a, b) => a + b, 0)! / 7);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex flex-col items-center text-center md:col-span-1">
          <div className="relative">
            <img 
              src={getProfilePhotoUrl(profile)}
              onError={(e) => {
                  const gender = profile?.gender?.toLowerCase();
                  e.currentTarget.src =
                      gender === "female" || gender === "f"
                          ? "https://novaric.co/wp-content/uploads/2025/11/FemaleProfile.jpg"
                          : "https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg";
              }}
              alt={`Portreti i ${profile.name}`}
              style={{ objectFit: "cover", objectPosition: "center" }}
              className="w-32 h-32 rounded-full object-cover border-4 border-slate-200 dark:border-slate-600 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-sm font-bold w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800">
              {party?.match(/\((.*?)\)/)?.[1] || 'N/A'}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{profile.name}</h1>
          <p className="text-md text-slate-600 dark:text-slate-400">{party}</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{age} vjeç, {title}</p>
        </div>

        <div className="flex flex-col justify-center items-center md:items-end text-center md:text-right md:col-span-1">
          <div className="flex items-baseline gap-2">
            <span className={`text-6xl font-extrabold ${scoreColorClass} ${liveScore ? 'animate-pulse' : ''}`}>
                {displayScore}
            </span>
            <span className="text-lg font-semibold text-slate-500 dark:text-slate-400">Pikët PARAGON®</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 space-x-3">
            <span>Mes. Partisë: {partyAvg}</span>
            <span>Mes. Lokale: {localAvg}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-3 flex justify-end">
        <div className="flex items-center gap-2">
            <input type="checkbox" id="compare-profile" className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500" />
            <label htmlFor="compare-profile" className="text-sm font-medium text-slate-700 dark:text-slate-300">Krahaso</label>
        </div>
      </div>
    </div>
  );
};