
import React from 'react';
import { PoliticianCard } from './PoliticianCard';
import { ProcessedVipProfile } from '../types';
import { getSortKey, albanianAlphabet } from '../utils/paragonProfileUtils';

interface PoliticiansPageCardsProps {
  profiles: ProcessedVipProfile[];
  sortBy: 'surname' | 'popularity';
  onNavigate: (profile: ProcessedVipProfile) => void;
  onCompareToggle: (id: string | number) => void;
  comparisonList: (string | number)[];
  isCompareDisabled: boolean;
  paragonScores?: Record<number, number>; // Add optional prop
}

export const PoliticiansPageCards: React.FC<PoliticiansPageCardsProps> = ({
  profiles,
  sortBy,
  onNavigate,
  onCompareToggle,
  comparisonList,
  isCompareDisabled,
  paragonScores = {},
}) => {
  
  /* --------------------------------------------------------
     SAFETY NORMALIZATION LAYER
     -------------------------------------------------------- */
  const safeProfiles: ProcessedVipProfile[] = profiles.map((p) => {
    const safeAnalysis = p.processedAnalysis || {
      overallScore: 0,
      translatedAnalysis: [],
      topDimensions: [],
      bottomDimensions: [],
      recommendations: [],
    };

    return {
      ...p,
      id: p.id ?? `missing-id-${Math.random()}`,
      name: typeof p.name === 'string' ? p.name : '',
      imageUrl: p.imageUrl || '/placeholder-user.png',
      processedAnalysis: {
        ...safeAnalysis,
        overallScore:
          typeof safeAnalysis.overallScore === 'number'
            ? safeAnalysis.overallScore
            : 0,
        translatedAnalysis: Array.isArray(safeAnalysis.translatedAnalysis)
          ? safeAnalysis.translatedAnalysis
          : [],
      },
    };
  });

  /* --------------------------------------------------------
     SORTING: Popularity (PARAGON score)
     UPDATED: Prefer live score if available
     -------------------------------------------------------- */
  const popularitySorted = [...safeProfiles].sort((a, b) => {
    // Prefer live scores: paragonScores > paragon.overall_score > latestScore > static score
    const idNumA = typeof a.id === 'string' ? parseInt(a.id.replace(/\D/g, ''), 10) : Number(a.id);
    const idNumB = typeof b.id === 'string' ? parseInt(b.id.replace(/\D/g, ''), 10) : Number(b.id);
    
    const scoreA = paragonScores[idNumA] ?? a.paragon?.overall_score ?? a.latestScore ?? a.processedAnalysis?.overallScore ?? 0;
    const scoreB = paragonScores[idNumB] ?? b.paragon?.overall_score ?? b.latestScore ?? b.processedAnalysis?.overallScore ?? 0;
    
    return scoreB - scoreA; // DESCENDING
  });

  /* --------------------------------------------------------
     GROUPING BY ALPHABET (Surname)
     -------------------------------------------------------- */
  const groupedByAlphabet = albanianAlphabet.map((letter) => {
    const matches = safeProfiles.filter((profile) => {
      try {
        const key = getSortKey(profile.name || '');
        return key === letter;
      } catch {
        return false;
      }
    });

    return { letter, matches };
  });

  /* --------------------------------------------------------
     RENDER
     -------------------------------------------------------- */
  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">
        Të gjitha Profilet Politike
      </h2>

      {safeProfiles.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          Nuk u gjetën profile që përputhen me kërkimin tuaj.
        </div>
      ) : (
        <>
          {sortBy === 'surname' ? (
            /* -------------------------------------------
               GROUPED BY ALPHABET
               ------------------------------------------- */
            <>
              {groupedByAlphabet.map(({ letter, matches }) =>
                matches.length === 0 ? null : (
                  <React.Fragment key={letter}>
                    <div
                      id={`letter-${letter}`}
                      className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-8 mb-4 pt-2 border-b-2 border-primary-500/30 pb-2"
                    >
                      {letter}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                      {matches.map((profile) => {
                        const idNum = typeof profile.id === 'string' ? parseInt(profile.id.replace(/\D/g, ''), 10) : Number(profile.id);
                        return (
                        <PoliticianCard
                          key={profile.id}
                          profile={profile}
                          paragonScore={paragonScores[idNum]}
                          onNavigate={onNavigate}
                          onCompareToggle={onCompareToggle}
                          isSelectedForCompare={comparisonList.includes(profile.id)}
                          isCompareDisabled={
                            isCompareDisabled &&
                            !comparisonList.includes(profile.id)
                          }
                        />
                      )})}
                    </div>
                  </React.Fragment>
                )
              )}
            </>
          ) : (
            /* -------------------------------------------
               SORTED BY PARAGON SCORE (POPULARITY)
               ------------------------------------------- */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
              {popularitySorted.map((profile) => {
                 const idNum = typeof profile.id === 'string' ? parseInt(profile.id.replace(/\D/g, ''), 10) : Number(profile.id);
                 return (
                <PoliticianCard
                  key={profile.id}
                  profile={profile}
                  paragonScore={paragonScores[idNum]}
                  onNavigate={onNavigate}
                  onCompareToggle={onCompareToggle}
                  isSelectedForCompare={comparisonList.includes(profile.id)}
                  isCompareDisabled={
                    isCompareDisabled &&
                    !comparisonList.includes(profile.id)
                  }
                />
              )})}
            </div>
          )}
        </>
      )}
    </div>
  );
};
