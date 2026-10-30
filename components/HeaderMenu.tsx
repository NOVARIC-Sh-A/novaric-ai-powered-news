import React from 'react';
import { 
    NewspaperIcon, ShieldCheckIcon, ChartBarIcon, BriefcaseIcon, ScaleIcon, 
    BookOpenIcon, AcademicCapIcon, ChainIcon, PresentationChartLineIcon, BeakerIcon, UsersIcon, UserGroupIcon
} from './icons';
import { TvShowData } from '../types';

// Consolidated interface to remove duplicate identifiers and make props optional for flexibility.
interface HeaderMenuProps {
  onClose: () => void;
  isMobile?: boolean; 
  currentPage?: string;
  onNavigateToPoliticians?: () => void;
  onNavigateToJudiciary?: () => void;
  onNavigateToBusiness?: () => void;
  onNavigateToMediaPersonalities?: () => void;
  onNavigateToParliamentMembersPage?: () => void;
  onNavigateToNewsList?: () => void;
  onNavigateToArticlesList?: () => void;
  onNavigateToAcademicJournalsList?: () => void;
  onNavigateToNovaricAcademy?: () => void;
  onNavigateToNovaricJournalManifesto?: () => void;
  onNavigateToNovaricMediaHouse?: () => void;
  onNavigateToTvPersonalitiesAnalysis?: () => void;
  onOpenUrlShortener?: () => void;
  onNavigateToFactCheckForm?: () => void;
  onNavigateToMaragonFramework?: () => void;
  onNavigateToPoliticalProfileFramework?: () => void;
  onNavigateToPoliticalProfile?: () => void;
  onNavigateToJurisprudence?: () => void;
  onNavigateToJudicialPerformance?: () => void;
  onNavigateToJudicialPhilosophy?: () => void;
  onNavigateToJudicialEthics?: () => void;
  onNavigateToJudicialProfileMethodology?: () => void;
  onNavigateToJudicialEcosystemAnalysisMethodology?: () => void;
  onNavigateToBibliografiaJurisprudences?: () => void;
  onNavigateToFakeNewsArchive?: () => void;
  onNavigateToMediaEducationFramework?: () => void;
  onNavigateToMediaEducationBibliography?: () => void;
  onNavigateToNewsFeatureShkreliBeci?: () => void;
  onNavigateToOpenLetterShkreliBeci?: () => void;
  onNavigateToHermeneuticFramework?: () => void;
  onNavigateToDeconstructNews?: () => void;
  onNavigateToNovaricCodeOfStandards?: () => void;
  onNavigateToBuletinDhomaTregtise?: () => void;
  onNavigateToBuletinCorruptionAnalysis?: () => void;
  onNavigateToBuletinBeShqiperi?: () => void;
  onNavigateToAlbanianMediaBenchmark?: () => void;
  onNavigateToAnalysisMethodology?: () => void;
  onNavigateToAcppaMethodology?: () => void;
  onNavigateToParagonMethodologyPage?: () => void;
  onNavigateToParagonVisualizationPage?: () => void;
  onNavigateToParagonNetworkMap?: () => void;
  onNavigateToPvafInstitutionalPerformance?: () => void;
  onNavigateToParagonMethodologyUnified?: () => void;
  onNavigateToPoliticalEthicsComparison?: () => void;
  onNavigateToBibliografiaEZgjeruar?: () => void;
  onNavigateToPowerNetworkAnalysis?: () => void;
  onNavigateToPoliticalIntegrityProfile?: () => void;
  onNavigateToEuropeanEthicsStructures?: () => void;
  onNavigateToAgib?: () => void;
  onNavigateToArchetypesExplained?: () => void;
  onNavigateToParagonConceptKapsh?: () => void;
  onNavigateToParagonConceptBehavioral?: () => void;
  onNavigateToParagonConceptCompetency?: () => void;
  onNavigateToParagonConceptFeedback?: () => void;
  onNavigateToParagonConceptEngine?: () => void;
  onNavigateToEuropeanCommission?: () => void;
  onNavigateToEuCodeOfConduct?: () => void;
  onNavigateToEuReferencesArchive?: () => void;
  onNavigateToCidaMethodology?: () => void;
  onNavigateToReputationWarRoom?: () => void;
  onNavigateToNexusAiGovernance?: () => void;
  onNavigateToNoraAiProfile?: () => void;
  onNavigateToAuthorProfile?: () => void;
  onNavigateToShkoderCulture?: () => void;
}

const MenuButton: React.FC<{ 
  onClick: () => void; 
  children: React.ReactNode; 
  ariaLabel: string;
  isActive?: boolean;
}> = ({ onClick, children, ariaLabel, isActive }) => (
    <li>
        <button
          onClick={onClick}
          className={`w-full text-left px-3 py-2.5 text-sm rounded-md transition-colors flex items-center gap-3 ${
            isActive
              ? 'bg-primary-50 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 font-bold ring-1 ring-primary-500'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
          role="menuitem"
          aria-label={ariaLabel}
        >
          {children}
        </button>
    </li>
);

const MenuSeparator: React.FC = () => <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>;

const MenuSectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="px-3 pt-3 pb-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{children}</h3>
);

export const HeaderMenu: React.FC<HeaderMenuProps> = ({ onClose, isMobile = false, ...navProps }) => {
    
    const handleNavigation = (navigateFunc?: () => void) => {
        if (navigateFunc) {
            navigateFunc();
            onClose();
        }
    };

    const iconClass = "w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0";

    // Conditional Styles
    const containerClasses = isMobile 
        ? "w-full bg-transparent p-0" // Mobile: Flow naturally, no absolute positioning
        : "absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 p-2 transform origin-top-right animate-scale-in z-10"; // Desktop: Dropdown

    return (
        <div 
            className={containerClasses}
            role="menu"
            aria-orientation="vertical"
        >
            <MenuSectionTitle>Profilet Publike</MenuSectionTitle>
            <ul className="space-y-1">
                {navProps.onNavigateToPoliticians && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToPoliticians)} ariaLabel="Navigo te Figurat Politike"><ShieldCheckIcon className={iconClass} /><span>Figurat Politike</span></MenuButton>}
                {navProps.onNavigateToParliamentMembersPage && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToParliamentMembersPage)} ariaLabel="Navigo te Anëtarët e Parlamentit"><UsersIcon className={iconClass} /><span>Anëtarët e Parlamentit</span></MenuButton>}
                {navProps.onNavigateToJudiciary && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToJudiciary)} ariaLabel="Navigo te Sistemi Gjyqësor"><ScaleIcon className={iconClass} /><span>Sistemi Gjyqësor</span></MenuButton>}
                {navProps.onNavigateToBusiness && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToBusiness)} ariaLabel="Navigo te Bota e Biznesit"><BriefcaseIcon className={iconClass} /><span>Bota e Biznesit</span></MenuButton>}
                {navProps.onNavigateToMediaPersonalities && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToMediaPersonalities)} ariaLabel="Navigo te Personalitete Mediatike"><UsersIcon className={iconClass} /><span>Personalitete Mediatike</span></MenuButton>}
                {navProps.onNavigateToPoliticalProfile && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToPoliticalProfile)} ariaLabel="Navigo te Profili Politik (Shembull)"><UserGroupIcon className={iconClass} /><span>Profili Politik (Shembull)</span></MenuButton>}
                {navProps.onNavigateToPoliticalProfileFramework && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToPoliticalProfileFramework)} ariaLabel="Navigo te Metodologjia e Profilimit"><BeakerIcon className={iconClass} /><span>Metodologjia e Profilimit</span></MenuButton>}
            </ul>

            <MenuSeparator />
            
            <MenuSectionTitle>Jurisprudenca</MenuSectionTitle>
            <ul className="space-y-1">
                {navProps.onNavigateToJurisprudence && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToJurisprudence)} ariaLabel="Navigo te Përforcimi i Shtetit të Së Drejtës"><ScaleIcon className={iconClass} /><span>Përforcimi i Shtetit të Së Drejtës</span></MenuButton>}
                {navProps.onNavigateToJudicialPerformance && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToJudicialPerformance)} ariaLabel="Navigo te Performanca Gjyqësore"><ChartBarIcon className={iconClass} /><span>Performanca Gjyqësore</span></MenuButton>}
                {navProps.onNavigateToJudicialPhilosophy && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToJudicialPhilosophy)} ariaLabel="Navigo te Filozofia Gjyqësore"><BeakerIcon className={iconClass} /><span>Filozofia Gjyqësore</span></MenuButton>}
                {navProps.onNavigateToJudicialEthics && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToJudicialEthics)} ariaLabel="Navigo tek Integriteti dhe Etika"><ShieldCheckIcon className={iconClass} /><span>Integriteti & Etika</span></MenuButton>}
                {navProps.onNavigateToJudicialProfileMethodology && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToJudicialProfileMethodology)} ariaLabel="Navigo te Metodologjia e Profilimit Gjyqësor"><BeakerIcon className={iconClass} /><span>Metodologjia e Profilimit</span></MenuButton>}
                {navProps.onNavigateToJudicialEcosystemAnalysisMethodology && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToJudicialEcosystemAnalysisMethodology)} ariaLabel="Navigo te Analiza e Ekosistemit"><BeakerIcon className={iconClass} /><span>Analiza e Ekosistemit</span></MenuButton>}
                {navProps.onNavigateToBibliografiaJurisprudences && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToBibliografiaJurisprudences)} ariaLabel="Navigo te Bibliografia e Jurisprudencës"><BookOpenIcon className={iconClass} /><span>Bibliografia</span></MenuButton>}
            </ul>
            
            <MenuSeparator />

            <MenuSectionTitle>Përmbajtja & Publikimet</MenuSectionTitle>
            <ul className="space-y-1">
                {navProps.onNavigateToTvPersonalitiesAnalysis && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToTvPersonalitiesAnalysis)} ariaLabel="Navigo te Analiza e Figurave Publike"><PresentationChartLineIcon className={iconClass} /><span>Analizë e Figurave Publike</span></MenuButton>}
                {navProps.onNavigateToReputationWarRoom && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToReputationWarRoom)} ariaLabel="Navigo te War Room (Defense SOC)"><ShieldCheckIcon className={iconClass} /><span>War Room (Defense SOC)</span></MenuButton>}
                {navProps.onNavigateToNewsList && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToNewsList)} ariaLabel="Navigo te Arkiva e Lajmeve"><NewspaperIcon className={iconClass} /><span>Arkiva e Lajmeve</span></MenuButton>}
                {navProps.onNavigateToArticlesList && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToArticlesList)} ariaLabel="Navigo te Artikujt"><BookOpenIcon className={iconClass} /><span>Artikujt</span></MenuButton>}
                {navProps.onNavigateToShkoderCulture && (
                  <MenuButton 
                    onClick={() => handleNavigation(navProps.onNavigateToShkoderCulture!)} 
                    ariaLabel="Navigo te Shkodër - Kulturë"
                    isActive={navProps.currentPage === 'shkoderCulturePage'}
                  >
                    <BookOpenIcon className={iconClass} />
                    <span>Shkodër: Kulturë (Analizë)</span>
                  </MenuButton>
                )}
                {navProps.onNavigateToAcademicJournalsList && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToAcademicJournalsList)} ariaLabel="Navigo te Revistat Akademike"><AcademicCapIcon className={iconClass} /><span>Revistat Akademike</span></MenuButton>}
                {navProps.onNavigateToNovaricJournalManifesto && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToNovaricJournalManifesto)} ariaLabel="Navigo te NOVARIC® AI Journal"><AcademicCapIcon className={iconClass} /><span>NOVARIC<sup>®</sup> AI Journal</span></MenuButton>}
                {navProps.onNavigateToNexusAiGovernance && (
                  <MenuButton 
                    onClick={() => handleNavigation(navProps.onNavigateToNexusAiGovernance!)} 
                    ariaLabel="Navigo te Kodi & Qeverisja AI (Nexus)"
                    isActive={navProps.currentPage === 'nexusHumanistAiGovernance'}
                  >
                    <ScaleIcon className={`${iconClass} text-[#009AE4]`} />
                    <span className="font-semibold text-[#009AE4]">Kodi & Qeverisja AI (Nexus)</span>
                  </MenuButton>
                )}
                {navProps.onNavigateToNoraAiProfile && (
                  <MenuButton 
                    onClick={() => handleNavigation(navProps.onNavigateToNoraAiProfile!)} 
                    ariaLabel="Navigo te Nora (AI) — Analiste & Publikime"
                    isActive={navProps.currentPage === 'noraAiProfile'}
                  >
                    <img 
                      src="https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg" 
                      alt="Nora AI" 
                      className="w-5 h-5 rounded-full object-cover border border-cyan-400 shadow-xs flex-shrink-0" 
                    />
                    <span className="font-semibold text-cyan-600 dark:text-cyan-300">Nora (AI) — Analiste & Publikime</span>
                  </MenuButton>
                )}
                {navProps.onNavigateToAuthorProfile && (
                  <MenuButton 
                    onClick={() => handleNavigation(navProps.onNavigateToAuthorProfile!)} 
                    ariaLabel="Navigo te Profili i Autorit (Dr Alban Gj. THIKA)"
                    isActive={navProps.currentPage === 'authorProfile' || navProps.currentPage === 'profiliIAutorit'}
                  >
                    <img 
                      src="https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png" 
                      alt="Dr Alban Gj. THIKA" 
                      className="w-5 h-5 rounded-full object-cover border border-primary-500 shadow-xs flex-shrink-0" 
                    />
                    <span className="font-semibold text-primary-600 dark:text-primary-400">Profili i Autorit — Dr Alban Gj. THIKA</span>
                  </MenuButton>
                )}
                {navProps.onNavigateToMediaEducationBibliography && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToMediaEducationBibliography)} ariaLabel="Navigo te Bibliografia e Edukimit Mediatik"><BookOpenIcon className={iconClass} /><span>Bibliografia e Edukimit Mediatik</span></MenuButton>}
                {navProps.onNavigateToCidaMethodology && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToCidaMethodology)} ariaLabel="Navigo te Metodologjia CIDA"><ShieldCheckIcon className={iconClass} /><span>Metodologjia CIDA (Audit)</span></MenuButton>}
            </ul>

            <MenuSeparator />
            
            <MenuSectionTitle>Vegla & Metodologji</MenuSectionTitle>
             <ul className="space-y-1">
                {navProps.onNavigateToFactCheckForm && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToFactCheckForm)} ariaLabel="Navigo te Mjeti i Verifikimit"><ShieldCheckIcon className={iconClass} /><span>Mjeti i Verifikimit</span></MenuButton>}
                {navProps.onNavigateToMaragonFramework && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToMaragonFramework)} ariaLabel="Navigo te Korniza MARAGON®"><ChartBarIcon className={iconClass} /><span>Korniza MARAGON<sup>®</sup></span></MenuButton>}
                {navProps.onNavigateToMediaEducationFramework && (
                  <MenuButton 
                    onClick={() => handleNavigation(navProps.onNavigateToMediaEducationFramework)} 
                    ariaLabel="Navigo te Korniza e Vlerësimit Mediatik"
                    isActive={navProps.currentPage === 'mediaEducationFramework'}
                  >
                    <AcademicCapIcon className={iconClass} />
                    <span>Korniza e Vlerësimit Mediatik</span>
                  </MenuButton>
                )}
                {navProps.onOpenUrlShortener && <MenuButton onClick={() => handleNavigation(navProps.onOpenUrlShortener)} ariaLabel="Hap Shkurto Linkun"><ChainIcon className={iconClass} /><span>Shkurto Linkun</span></MenuButton>}
            </ul>
            
            <MenuSeparator />

            <MenuSectionTitle>Iniciativa</MenuSectionTitle>
             <ul className="space-y-1">
                 {navProps.onNavigateToNovaricAcademy && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToNovaricAcademy)} ariaLabel="Navigo te NOVARIC® Academy"><AcademicCapIcon className={iconClass} /><span>NOVARIC<sup>®</sup> Academy</span></MenuButton>}
                 {navProps.onNavigateToNovaricMediaHouse && <MenuButton onClick={() => handleNavigation(navProps.onNavigateToNovaricMediaHouse)} ariaLabel="Navigo te NOVARIC® Media House"><BriefcaseIcon className={iconClass} /><span>NOVARIC<sup>®</sup> Media House</span></MenuButton>}
            </ul>

             <style>{`
                @keyframes scale-in {
                  from { opacity: 0; transform: scale(0.95); }
                  to { opacity: 1; transform: scale(1); }
                }
                .animate-scale-in {
                  animation: scale-in 0.1s ease-out forwards;
                }
            `}</style>
        </div>
    );
};