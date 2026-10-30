
import React, { useState, useMemo, useEffect } from 'react';
import { VipProfile, ProcessedVipProfile } from '../types';
import { ArrowUpIcon } from '../components/icons';
import { formatVipName, processVipProfile, getSurname, getSortKey, albanianAlphabet, getProfilePhotoUrl } from '../utils/paragonProfileUtils';
import { PoliticianComparisonModal } from '../components/PoliticianComparisonModal';
import { CategoryNavigation } from '../components/CategoryNavigation';
import { ParagonInfoBox } from '../components/ParagonInfoBox';
import { useProfilePageLogic } from '../hooks/useProfilePageLogic';


// This is an augmented profile type for internal use in this component
interface ShellProcessedVipProfile extends ProcessedVipProfile {
    importanceScore?: number;
}

const MostClickedSection: React.FC<{ profiles: (VipProfile & { clicks: number })[], onNavigate: (profile: VipProfile) => void }> = ({ profiles, onNavigate }) => {
  if (profiles.length === 0) {
    return null;
  }
  return (
    <div className="my-12 py-6 px-2 text-center bg-slate-50 dark:bg-slate-900/40 rounded-lg">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Profilet Më Të Klikuar</h2>
      <ol className="flex flex-wrap justify-center items-center gap-4">
        {profiles.map((profile, index) => (
          <li key={profile.id}>
            <button
              onClick={() => onNavigate(profile)}
              className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md flex items-center space-x-3 min-w-[220px] text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors w-full"
              aria-label={`Shiko profilin për ${profile.name}`}
            >
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{index + 1}.</span>
              <img
                src={getProfilePhotoUrl(profile)}
                onError={(e) => {
                    const gender = profile?.gender?.toLowerCase();
                    e.currentTarget.src =
                        gender === "female" || gender === "f"
                            ? "https://novaric.co/wp-content/uploads/2025/11/FemaleProfile.jpg"
                            : "https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg";
                }}
                alt={profile.name}
                style={{ objectFit: "cover" }}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="font-semibold text-sm">{formatVipName(profile.name)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{profile.clicks} klikime</p>
              </div>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export interface CategoryListPageShellProps {
  title: React.ReactNode;
  description: React.ReactNode;
  profiles: ProcessedVipProfile[]; // Now expects already processed profiles
  onNavigateToProfilePage: (profile: VipProfile) => void;
  
  pageType: 'politicians' | 'judiciary' | 'business';
  onBack?: () => void;
  onNavigateToParliamentMembersPage?: () => void;
  onNavigateToJudiciary?: () => void;
  onNavigateToBusiness?: () => void;
  onNavigateToOtherVips?: () => void;
  onNavigateToParagonMethodologyPage?: () => void;
  onNavigateToPoliticians?: () => void;

  // Configuration for filtering & sorting
  profileClicksStorageKey?: string;
  sortOptions: { value: string; label: string }[];
  defaultSort: string;
  enableLetterFilterWhen?: string; // e.g., 'surname'
  maxCompareItems?: number;
  showCompare?: boolean;

  // Render prop for the main content
  children: (props: {
    filteredProfiles: ProcessedVipProfile[];
    comparisonList: (string | number)[];
    onCompareToggle: (id: string | number) => void;
    isCompareDisabled: boolean;
    sortBy: string;
    handleProfileNavigation: (profile: VipProfile) => void;
  }) => React.ReactNode;
}

// This needs to be moved outside or passed in, but for now this is fine.
const calculateImportanceScore = (profile: VipProfile): number => {
  let score = 0;
  if (profile.professionalPerformance) {
    score += (profile.professionalPerformance.excellent || 0) * 2.5;
    score += (profile.professionalPerformance.good || 0) * 1.5;
  }
   if (profile.skillsDevelopment) {
    score += (profile.skillsDevelopment.expertise || 0) * 1.2;
    score += (profile.skillsDevelopment.ethics || 0) * 1.2;
    score += (profile.skillsDevelopment.leadership || 0) * 0.8;
  }
  if (profile.publicPerception) {
    score += (profile.publicPerception.positive || 0) * 0.5;
    score -= (profile.publicPerception.negative || 0) * 0.5;
  }
  return score;
};


export const CategoryListPageShell: React.FC<CategoryListPageShellProps> = ({
  title,
  description,
  profiles: initialProfiles,
  onNavigateToProfilePage,
  pageType,
  onBack,
  onNavigateToParliamentMembersPage,
  onNavigateToJudiciary,
  onNavigateToBusiness,
  onNavigateToOtherVips,
  onNavigateToParagonMethodologyPage,
  onNavigateToPoliticians,
  profileClicksStorageKey,
  sortOptions,
  defaultSort,
  enableLetterFilterWhen,
  maxCompareItems = 3,
  showCompare = false,
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>(defaultSort);
  const [letterFilter, setLetterFilter] = useState<string | null>(null);
  const [comparisonList, setComparisonList] = useState<(string | number)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) setIsBackToTopVisible(true);
      else setIsBackToTopVisible(false);
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  useEffect(() => {
    if (sortBy !== enableLetterFilterWhen) {
        setLetterFilter(null);
    }
  }, [sortBy, enableLetterFilterWhen]);
  
  const {
    top5ClickedProfiles,
    handleProfileClick,
  } = useProfilePageLogic(initialProfiles, profileClicksStorageKey || 'genericProfileClicks');

  const handleProfileNavigation = (profile: VipProfile) => {
    handleProfileClick(profile.id);
    onNavigateToProfilePage(profile);
  };

  const mostClickedContent = <MostClickedSection profiles={top5ClickedProfiles} onNavigate={handleProfileNavigation} />;

  const processedProfiles: ShellProcessedVipProfile[] = useMemo(() => {
    return initialProfiles.map(p => ({
        ...p,
        importanceScore: calculateImportanceScore(p)
    }));
  }, [initialProfiles]);

  const filteredAndSortedProfiles = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
    let figures = processedProfiles.filter(profile =>
      profile.name.toLowerCase().includes(lowerCaseSearchTerm)
    );

    const sorted = [...figures];

    switch(sortBy) {
        case 'surname':
            if (letterFilter) {
                sorted.sort((a, b) => getSurname(a.name).localeCompare(getSurname(b.name), 'sq'));
                return sorted.filter(profile => getSortKey(profile.name) === letterFilter);
            }
            sorted.sort((a, b) => getSurname(a.name).localeCompare(getSurname(b.name), 'sq'));
            break;
        case 'popularity':
            sorted.sort((a, b) => b.processedAnalysis.overallScore - a.processedAnalysis.overallScore);
            break;
        case 'court':
            sorted.sort((a, b) => {
                const courtComparison = a.category.localeCompare(b.category);
                if (courtComparison !== 0) return courtComparison;
                return getSurname(a.name).localeCompare(getSurname(b.name), 'sq');
            });
            break;
        case 'importance':
             sorted.sort((a, b) => (b.importanceScore || 0) - (a.importanceScore || 0));
             break;
    }
    
    return sorted;
  }, [processedProfiles, searchTerm, sortBy, letterFilter]);
  
  const comparisonProfiles = useMemo(() => {
      return processedProfiles.filter(p => comparisonList.includes(p.id));
  }, [comparisonList, processedProfiles]);

  const handleCompareToggle = (id: string | number) => {
    setComparisonList(prev => {
        if (prev.includes(id)) {
            return prev.filter(item => item !== id);
        }
        if (prev.length < maxCompareItems) {
            return [...prev, id];
        }
        return prev;
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const isCompareDisabled = comparisonList.length >= maxCompareItems;

  const renderInfoBox = () => {
    if (pageType === 'politicians' && onNavigateToParagonMethodologyPage) {
        return <ParagonInfoBox onNavigateToParagonMethodologyPage={onNavigateToParagonMethodologyPage} />;
    }
    return null;
  };

  const renderNavigation = () => {
    if (pageType === 'politicians' && onBack && onNavigateToParliamentMembersPage && onNavigateToJudiciary && onNavigateToBusiness && onNavigateToOtherVips) {
      return <CategoryNavigation
        onBack={onBack}
        onNavigateToParliamentMembersPage={onNavigateToParliamentMembersPage}
        onNavigateToJudiciary={onNavigateToJudiciary}
        onNavigateToBusiness={onNavigateToBusiness}
        onNavigateToOtherVips={onNavigateToOtherVips}
      />;
    }
    if (pageType === 'judiciary' && onBack && onNavigateToBusiness && onNavigateToPoliticians) {
      return (
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <button onClick={onBack} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition">&larr; Kthehu Pas</button>
          <button onClick={onNavigateToBusiness} className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-md transition">Bota e Biznesit 💼</button>
          <button onClick={onNavigateToPoliticians} className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-md transition">Figurat Politike &rarr;</button>
        </div>
      );
    }
    if (pageType === 'business' && onBack && onNavigateToPoliticians && onNavigateToJudiciary) {
      return (
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <button onClick={onBack} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md">&larr; Kthehu Pas</button>
          <button onClick={onNavigateToPoliticians} className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-md">Figurat Politike</button>
          <button onClick={onNavigateToJudiciary} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md">Sistemi Gjyqësor ⚖️</button>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="relative max-w-6xl mx-auto bg-white dark:bg-slate-800/50 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center text-primary-700 dark:text-primary-500">
            {title}
          </h1>
          <p className="text-center text-md italic text-slate-700 dark:text-slate-300 mt-2 mb-8 max-w-3xl mx-auto">
            {description}
          </p>

          {renderInfoBox()}
          {renderNavigation()}
          
          <div className="p-4 bg-slate-100 dark:bg-slate-900/40 rounded-lg mb-8 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <input
                type="text"
                placeholder="Kërko sipas emrit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:col-span-2 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100"
                aria-label="Kërko sipas emrit ose mbiemrit"
              />
              {sortOptions.length > 0 && (
                <div className="flex items-center justify-center space-x-2">
                  <label htmlFor="sort-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">Rendit:</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                  >
                    {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
      
          {sortBy === enableLetterFilterWhen && enableLetterFilterWhen && (
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 mb-8 px-2 py-3 bg-slate-100 dark:bg-slate-700/50 rounded-md shadow">
                <a href="#" onClick={(e) => { e.preventDefault(); setLetterFilter(null); }} className={`alphabet-filter-link px-3 py-1 text-sm font-bold rounded-md transition-colors ${letterFilter === null ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'}`}>Të gjitha</a>
              {albanianAlphabet.map((letter) => (
                <a href="#" key={letter} onClick={(e) => { e.preventDefault(); setLetterFilter(letter); }} className={`alphabet-filter-link px-2.5 py-1 text-sm font-medium rounded-md transition-colors ${letterFilter === letter ? 'bg-primary-600 text-white shadow-md' : 'text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-700/50'}`}>
                  {letter}
                </a>
              ))}
            </div>
          )}

          {mostClickedContent}

          {/* Render Prop Child */}
          {children({
              filteredProfiles: filteredAndSortedProfiles,
              comparisonList,
              onCompareToggle: handleCompareToggle,
              isCompareDisabled,
              sortBy,
              handleProfileNavigation
          })}
        </div>
      </main>

      {showCompare && comparisonList.length >= 2 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-fadeIn">
              <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105">
                Krahaso Tani ({comparisonProfiles.length} Profile)
              </button>
          </div>
      )}

      {isModalOpen && comparisonProfiles.length >= 2 && (
          // FIX: Passed a 'profiles' array to PoliticianComparisonModal as expected by its props, instead of 'profile1' and 'profile2'.
          <PoliticianComparisonModal
            profiles={comparisonProfiles}
            onClose={() => setIsModalOpen(false)}
          />
      )}

      {isBackToTopVisible && (
        <button onClick={scrollToTop} className="fixed bottom-24 right-8 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg z-50 animate-fadeIn" aria-label="Kthehu lart">
          <ArrowUpIcon className="w-6 h-6" />
        </button>
      )}
    </>
  );
};
