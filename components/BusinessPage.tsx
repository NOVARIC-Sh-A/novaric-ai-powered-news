import React, { useMemo } from 'react';
import { VipProfileTile } from './VipProfileTile';
import { VipProfile, ProcessedVipProfile } from '../types';
import { CategoryListPageShell } from '../pages/CategoryListPageShell';
import { processVipProfile } from '../utils/paragonProfileUtils';

interface BusinessPageProps {
  profiles: VipProfile[];
  onBack: () => void;
  onNavigateToPoliticians: () => void;
  onNavigateToJudiciary: () => void;
  onNavigateToProfilePage: (profile: VipProfile) => void;
}

export const BusinessPage: React.FC<BusinessPageProps> = (props) => {
  const { profiles: initialProfiles, onBack, onNavigateToPoliticians, onNavigateToJudiciary, onNavigateToProfilePage } = props;

  const businessFigures = useMemo(() => {
    const normalizedProfiles = initialProfiles.map(p => ({
        ...p,
        category: p.category || 'Biznes', // Default if missing
    }));

    return normalizedProfiles.filter(p => {
        if (typeof p.category !== 'string') {
            return false;
        }
        return p.category === 'Biznes';
    });
  }, [initialProfiles]);

  const processedProfiles = useMemo(() => {
    // FIX: Wrapped processVipProfile in an arrow function to ensure the correct arguments are passed from map().
    // The map function passes (value, index, array), but processVipProfile expects (profile, backend?).
    // This was causing the `index` (a number) to be passed as the `backend` argument, resulting in a type error.
    return businessFigures.map(profile => processVipProfile(profile));
  }, [businessFigures]);

  return (
    <CategoryListPageShell
      pageType="business"
      title="Bota e Biznesit"
      description="Profilet e sipërmarrësve dhe figurave kyçe që formësojnë ekonominë dhe tregun në Shqipëri."
      profiles={processedProfiles}
      profileClicksStorageKey="businessProfileClicks"
      onNavigateToProfilePage={onNavigateToProfilePage}
      onBack={onBack}
      onNavigateToPoliticians={onNavigateToPoliticians}
      onNavigateToJudiciary={onNavigateToJudiciary}
      sortOptions={[]}
      defaultSort=""
    >
      {({ filteredProfiles, handleProfileNavigation }) => (
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
    </CategoryListPageShell>
  );
};
