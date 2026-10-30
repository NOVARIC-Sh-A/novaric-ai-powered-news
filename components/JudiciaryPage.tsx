import React, { useMemo } from 'react';
import { VipProfileTile } from './VipProfileTile';
import { VipProfile, ProcessedVipProfile } from '../types';
import { CategoryListPageShell } from '../pages/CategoryListPageShell';
import { processVipProfile } from '../utils/paragonProfileUtils';

interface JudiciaryPageProps {
  profiles: VipProfile[];
  onBack: () => void;
  onNavigateToPoliticians: () => void;
  onNavigateToBusiness: () => void;
  onNavigateToProfilePage: (profile: VipProfile) => void;
}

export const JudiciaryPage: React.FC<JudiciaryPageProps> = (props) => {
  
  const { profiles: initialProfiles, onBack, onNavigateToPoliticians, onNavigateToBusiness, onNavigateToProfilePage } = props;

  const judicialFigures = useMemo(() => {
    const normalizedProfiles = initialProfiles.map(p => ({
        ...p,
        category: p.category || 'Gjykata', // Default if missing
    }));

    return normalizedProfiles.filter(p => {
      if (typeof p.category !== 'string') {
        return false;
      }
      return p.category.toLowerCase().startsWith('gjykata');
    });
  }, [initialProfiles]);

  const processedProfiles = useMemo(() => {
    // FIX: Wrapped processVipProfile in an arrow function to ensure the correct arguments are passed from map().
    // The map function passes (value, index, array), but processVipProfile expects (profile, backend?).
    // This was causing the `index` (a number) to be passed as the `backend` argument, resulting in a type error.
    return judicialFigures.map(profile => processVipProfile(profile));
  }, [judicialFigures]);

  const courts = useMemo(() => {
    const courtSet = new Set(judicialFigures.map(m => m.category));
    return Array.from(courtSet).sort((a, b) => String(a).localeCompare(String(b)));
  }, [judicialFigures]);

  return (
    <CategoryListPageShell
      pageType="judiciary"
      title="Sistemi Gjyqësor në Shqipëri"
      description="Eksploroni profilet e anëtarëve të sistemit gjyqësor, të grupuar sipas gjykatave ose të renditur sipas një indeksi rëndësie të bazuar në performancën profesionale dhe ekspertizën."
      profiles={processedProfiles}
      profileClicksStorageKey="judiciaryProfileClicks"
      onNavigateToProfilePage={onNavigateToProfilePage}
      onBack={onBack}
      onNavigateToBusiness={onNavigateToBusiness}
      onNavigateToPoliticians={onNavigateToPoliticians}
      sortOptions={[
        { value: 'court', label: 'Sipas Gjykatës' },
        { value: 'importance', label: 'Sipas Rëndësisë' }
      ]}
      defaultSort="court"
    >
        {({ filteredProfiles, sortBy, handleProfileNavigation }) => (
            <div>
              {filteredProfiles.length > 0 ? (
                <div>
                  {sortBy === 'court' ? (
                    courts.map((court) => {
                      const membersForCourt = filteredProfiles.filter(m => m.category === court);
                      if (membersForCourt.length === 0) return null;

                      return (
                        <React.Fragment key={court}>
                          <div 
                            id={`court-${court.replace(/\s+/g, '-')}`} 
                            className="col-span-full text-2xl font-bold text-primary-600 dark:text-primary-400 mt-8 mb-4 pt-2 border-b-2 border-primary-500/30 pb-2 sticky top-0 bg-white dark:bg-slate-800/90 backdrop-blur-sm z-10"
                            style={{ scrollMarginTop: '80px' }} 
                          >
                            {court}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                              {membersForCourt.map((profile) => (
                                <VipProfileTile 
                                  key={profile.id} 
                                  profile={profile} 
                                  onNavigate={handleProfileNavigation}
                                />
                              ))}
                          </div>
                        </React.Fragment>
                      );
                    })
                  ) : ( // sortBy === 'importance'
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                      {filteredProfiles.map((profile) => (
                        <VipProfileTile 
                          key={profile.id} 
                          profile={profile} 
                          onNavigate={handleProfileNavigation}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 text-lg py-12">
                  Nuk ka anëtarë për të shfaqur aktualisht.
                </p>
              )}
            </div>
        )}
    </CategoryListPageShell>
  );
};
