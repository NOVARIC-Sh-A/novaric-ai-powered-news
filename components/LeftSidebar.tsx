import React, { useState } from 'react';
import { BuildingLibraryIcon, ChartBarIcon, UsersIcon, BookOpenIcon, BeakerIcon, NewspaperIcon, DocumentTextIcon, TvIcon, ChevronDownIcon, AcademicCapIcon } from './icons';
import { renderWithSuperscript } from '../utils/textUtils';
import { TvShowData } from '../types';

interface LeftSidebarProps {
  currentPage?: string;
  tvShows: TvShowData[];
  onNavigateToTvShow: (show: TvShowData) => void;
  onNavigateToNewsCategory: (category: string) => void;
  onNavigateToMediaEducationFramework: () => void;
  onNavigateToNewsFeatureShkreliBeci: () => void;
  onNavigateToOpenLetterShkreliBeci: () => void;
  onNavigateToHermeneuticFramework: () => void;
  onNavigateToNovaricCodeOfStandards: () => void;
  onNavigateToMaragonFramework: () => void;
  onNavigateToAlbanianMediaBenchmark?: () => void;
  onNavigateToAnalysisMethodology: () => void;
  onNavigateToMediaEducationBibliography: () => void;
  onNavigateToMaragonReport: (entityId: string | number, entityType: 'individual' | 'tvShow') => void;
  onNavigateToMediaPersonalities?: () => void;
  onNavigateToPressConferences?: () => void;
  onNavigateToPressReleaseNovaricVisa?: () => void;
  onNavigateToShkoderShockTherapy?: () => void;
  onNavigateToShkoderCulture?: () => void;
  onNavigateToShkoderPolitics?: () => void;
  onNavigateToShkoderEconomy?: () => void;
  onNavigateToShkoderSocial?: () => void;
  onNavigateToWhitepaperVisualization: () => void;
}

const CategoryButton: React.FC<{
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}> = ({ onClick, icon, label, isActive }) => (
  <li>
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`w-full text-left px-2 py-1.5 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent ${
        isActive
          ? 'bg-primary-100 dark:bg-primary-950/80 text-primary-800 dark:text-primary-300 ring-2 ring-primary-500 font-semibold'
          : 'bg-white/70 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-600'
      }`}
      aria-label={`Shiko ${label}`}
    >
      <div className={`w-8 h-8 flex-shrink-0 rounded-md flex items-center justify-center mr-3 ${
        isActive ? 'bg-primary-200 dark:bg-primary-900 text-primary-800 dark:text-primary-200' : 'bg-primary-100 dark:bg-primary-900/50'
      }`}>
        {icon}
      </div>
      <div>
        <p className={`font-semibold text-sm ${isActive ? 'text-primary-900 dark:text-primary-100 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>{renderWithSuperscript(label)}</p>
      </div>
    </button>
  </li>
);

const SectionHeading: React.FC<{ 
    title: string; 
    isOpen: boolean; 
    onToggle: () => void; 
}> = ({ title, isOpen, onToggle }) => (
    <button
        onClick={onToggle}
        className="w-full text-right text-md font-bold text-slate-800 dark:text-white mb-2 px-3 sticky top-[130px] sm:top-[160px] bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm py-2 z-10 border-b-2 border-primary-500 shadow-sm flex justify-between items-center group transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
    >
        <ChevronDownIcon className={`w-4 h-4 text-primary-500 transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`} />
        <span>{title}</span>
    </button>
);

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
    currentPage,
    tvShows = [], 
    onNavigateToTvShow, 
    onNavigateToNewsCategory, 
    onNavigateToMediaEducationFramework, 
    onNavigateToNewsFeatureShkreliBeci,
    onNavigateToOpenLetterShkreliBeci,
    onNavigateToHermeneuticFramework,
    onNavigateToNovaricCodeOfStandards,
    onNavigateToMaragonFramework,
    onNavigateToAlbanianMediaBenchmark,
    onNavigateToAnalysisMethodology,
    onNavigateToMediaEducationBibliography,
    onNavigateToMaragonReport,
    onNavigateToMediaPersonalities,
    onNavigateToPressConferences,
    onNavigateToPressReleaseNovaricVisa,
    onNavigateToShkoderShockTherapy,
    onNavigateToShkoderCulture,
    onNavigateToShkoderPolitics,
    onNavigateToShkoderEconomy,
    onNavigateToShkoderSocial,
    onNavigateToWhitepaperVisualization
 }) => {
  const iconClass = "w-5 h-5 text-primary-600 dark:text-primary-400";
  
  const isShkoderPage = [
    'shkoderCulturePage',
    'shkoderPoliticsPage',
    'shkoderEconomyPage',
    'shkoderSocialPage',
    'shkoderShockTherapy',
    'pressConferences',
    'pressReleaseNovaricVisa',
    'newsFeatureShkreliBeci',
    'openLetterShkreliBeci'
  ].includes(currentPage || '');

  // Track which sections are expanded. Auto-open news if on a Shkodër page.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    news: isShkoderPage,
    maragon: false,
    education: currentPage === 'mediaEducationFramework',
    tv: false
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* 1. News Section */}
      <div>
        <SectionHeading 
            title="Lajme nga Shkodra" 
            isOpen={openSections.news} 
            onToggle={() => toggleSection('news')} 
        />
        {openSections.news && (
            <div className="overflow-y-auto pt-2 animate-fadeIn">
                <ul className="space-y-2">
                    <CategoryButton
                        onClick={onNavigateToShkoderPolitics || (() => onNavigateToNewsCategory('Politikë'))}
                        icon={<BuildingLibraryIcon className={iconClass} />}
                        label="Politikë"
                        isActive={currentPage === 'shkoderPoliticsPage'}
                    />
                    <CategoryButton
                        onClick={onNavigateToShkoderEconomy || (() => onNavigateToNewsCategory('Ekonomi'))}
                        icon={<ChartBarIcon className={iconClass} />}
                        label="Ekonomi"
                        isActive={currentPage === 'shkoderEconomyPage'}
                    />
                    <CategoryButton
                        onClick={onNavigateToShkoderSocial || (() => onNavigateToNewsCategory('Sociale'))}
                        icon={<UsersIcon className={iconClass} />}
                        label="Sociale"
                        isActive={currentPage === 'shkoderSocialPage'}
                    />
                    <CategoryButton
                        onClick={onNavigateToShkoderCulture || (() => onNavigateToNewsCategory('Kulturë'))}
                        icon={<BookOpenIcon className={iconClass} />}
                        label="Kulturë"
                        isActive={currentPage === 'shkoderCulturePage'}
                    />
                    <button 
                        onClick={onNavigateToShkoderCulture || (() => onNavigateToNewsCategory('Kulturë'))}
                        className={`w-full text-left pl-12 pr-2 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                            currentPage === 'shkoderCulturePage'
                                ? 'bg-primary-100 dark:bg-primary-950/80 text-primary-900 dark:text-primary-200 font-bold ring-1 ring-primary-500'
                                : 'text-primary-700 dark:text-primary-300 hover:bg-slate-200 dark:hover:bg-slate-700/60'
                        }`}
                        title="“Asht nga një familje e mirë”: Studim Sociologjik & Etik"
                    >
                        <span className="text-primary-500 font-bold">↳</span>
                        <span className="truncate">“Asht nga një familje e mirë”</span>
                    </button>
                    <CategoryButton
                        onClick={onNavigateToPressConferences}
                        icon={<TvIcon className={iconClass} />}
                        label="Konferenca Shtypi"
                    />
                    {onNavigateToPressReleaseNovaricVisa && (
                        <button 
                            onClick={onNavigateToPressReleaseNovaricVisa}
                            className="w-full text-left pl-12 pr-2 py-1.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors"
                        >
                            ↳ Njoftim për Shtyp: {renderWithSuperscript('NOVARIC® Sh.A.')} (Viza)
                        </button>
                    )}
                    {onNavigateToShkoderShockTherapy && (
                        <CategoryButton
                            onClick={onNavigateToShkoderShockTherapy}
                            icon={<ChartBarIcon className={iconClass} />}
                            label="Terapia e Shokut në Shkodër"
                        />
                    )}
                    <CategoryButton
                        onClick={onNavigateToNewsFeatureShkreliBeci}
                        icon={<NewspaperIcon className={iconClass} />}
                        label="Rasti SHKRELI vs. BECI"
                    />
                    <button 
                        onClick={onNavigateToOpenLetterShkreliBeci}
                        className="w-full text-left pl-12 pr-2 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors"
                    >
                        ↳ Letër e Hapur
                    </button>
                </ul>
            </div>
        )}
      </div>

      {/* 2. MARAGON Analysis */}
      <div>
        <SectionHeading 
            title="MARAGON® Analiza" 
            isOpen={openSections.maragon} 
            onToggle={() => toggleSection('maragon')} 
        />
        {openSections.maragon && (
            <div className="overflow-y-auto pt-2 animate-fadeIn">
                <ul className="space-y-2">
                    {onNavigateToMediaPersonalities && (
                        <CategoryButton
                            onClick={onNavigateToMediaPersonalities}
                            icon={<TvIcon className={iconClass} />}
                            label="Personalitete Mediatike"
                        />
                    )}
                </ul>
            </div>
        )}
      </div>

      {/* 3. Media Education */}
      <div>
        <SectionHeading 
            title="Edukimi Mediatik" 
            isOpen={openSections.education} 
            onToggle={() => toggleSection('education')} 
        />
        {openSections.education && (
            <div className="overflow-y-auto pt-2 animate-fadeIn">
                <ul className="space-y-2">
                    <CategoryButton
                        onClick={onNavigateToNovaricCodeOfStandards}
                        icon={<DocumentTextIcon className={iconClass} />}
                        label="Kodi i Standardeve"
                    />
                    <CategoryButton
                        onClick={onNavigateToAnalysisMethodology}
                        icon={<ChartBarIcon className={iconClass} />}
                        label="Metodologjia & Etika"
                    />
                    <CategoryButton
                        onClick={onNavigateToMaragonFramework}
                        icon={<ChartBarIcon className={iconClass} />}
                        label="Korniza MARAGON®"
                    />
                    {onNavigateToAlbanianMediaBenchmark && <CategoryButton
                        onClick={onNavigateToAlbanianMediaBenchmark}
                        icon={<ChartBarIcon className={iconClass} />}
                        label="Media Benchmark"
                    />}
                    <CategoryButton
                        onClick={onNavigateToMediaEducationFramework}
                        icon={<AcademicCapIcon className={iconClass} />}
                        label="Korniza e Vlerësimit Mediatik"
                        isActive={currentPage === 'mediaEducationFramework'}
                    />
                    <CategoryButton
                        onClick={onNavigateToHermeneuticFramework}
                        icon={<BeakerIcon className={iconClass} />}
                        label="Çfarë është Hermeneutika?"
                    />
                    <CategoryButton
                        onClick={onNavigateToWhitepaperVisualization}
                        icon={<BookOpenIcon className={iconClass} />}
                        label="NER Whitepaper"
                    />
                    <CategoryButton
                        onClick={onNavigateToMediaEducationBibliography}
                        icon={<BookOpenIcon className={iconClass} />}
                        label="Bibliografia"
                    />
                </ul>
            </div>
        )}
      </div>

      {/* 4. Top 5 TV Shows */}
      <div>
        <SectionHeading 
            title="Top 5 TV Shows" 
            isOpen={openSections.tv} 
            onToggle={() => toggleSection('tv')} 
        />
        {openSections.tv && (
            <div className="overflow-y-auto pt-2 animate-fadeIn">
                <ul className="space-y-2">
                    {(tvShows || []).map((show) => (
                    <li key={show.id}>
                        <button
                            onClick={() => onNavigateToTvShow(show)}
                            className="w-full text-left px-2 py-1.5 bg-white/70 dark:bg-slate-700/70 rounded-md shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                            aria-label={`Shiko detajet për emisionin ${show.name}`}
                        >
                            <div className="flex items-center space-x-3">
                                <img src={show.logoUrl} alt={`${show.name} logo`} className="w-10 h-10 object-contain rounded-md flex-shrink-0 bg-white p-0.5" />
                                <div>
                                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{show.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{show.channel}</p>
                                </div>
                            </div>
                        </button>
                    </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    </div>
  );
};