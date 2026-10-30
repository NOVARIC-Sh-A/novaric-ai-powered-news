import React from 'react';
import { HeaderMenu } from './HeaderMenu';
// Fixed import: replaced XIcon with XMarkIcon as it is the one used in the component.
import { XMarkIcon } from './icons';
import { TvShowData } from '../types';

// FIX: Define the full set of props that are passed from App.tsx and required by HeaderMenu.
interface MobileNavProps {
    onClose: () => void;
    currentPage?: string;
    onNavigateToPoliticians: () => void;
    onNavigateToJudiciary: () => void;
    onNavigateToBusiness: () => void;
    onNavigateToMediaPersonalities: () => void;
    onNavigateToTvShowPage: (show: TvShowData) => void;
    onNavigateToNewsList: () => void;
    onNavigateToArticlesList: () => void;
    onNavigateToAcademicJournalsList: () => void;
    onNavigateToNovaricAcademy: () => void;
    onNavigateToNovaricJournalManifesto: () => void;
    onNavigateToNovaricMediaHouse: () => void;
    onNavigateToTvPersonalitiesAnalysis: () => void;
    onNavigateToNewsCategory: (category: string) => void;
    onNavigateToFakeNewsArchive: () => void;
    onNavigateToMediaEducationFramework: () => void;
    onNavigateToMediaEducationBibliography: () => void;
    onNavigateToNewsFeatureShkreliBeci: () => void;
    onNavigateToOpenLetterShkreliBeci: () => void;
    onNavigateToHermeneuticFramework: () => void;
    onNavigateToDeconstructNews: () => void;
    onNavigateToNovaricCodeOfStandards: () => void;
    tvShows: TvShowData[];
    onNavigateToParliamentMembersPage: () => void;
    onNavigateToBuletinDhomaTregtise: () => void;
    onNavigateToBuletinCorruptionAnalysis: () => void;
    onNavigateToBuletinBeShqiperi: () => void;
    onNavigateToAlbanianMediaBenchmark: () => void;
    onNavigateToFactCheckForm: () => void;
    onNavigateToMaragonFramework: () => void;
    onNavigateToAnalysisMethodology: () => void;
    onNavigateToAcppaMethodology: () => void;
    onNavigateToParagonMethodologyPage: () => void;
    onNavigateToParagonVisualizationPage: () => void;
    onNavigateToParagonNetworkMap: () => void;
    onNavigateToPoliticalProfileFramework: () => void;
    onNavigateToPvafInstitutionalPerformance: () => void;
    onNavigateToParagonMethodologyUnified: () => void;
    onNavigateToPoliticalEthicsComparison: () => void;
    onNavigateToBibliografiaEZgjeruar: () => void;
    onNavigateToPowerNetworkAnalysis: () => void;
    onNavigateToPoliticalIntegrityProfile: () => void;
    onNavigateToEuropeanEthicsStructures: () => void;
    onNavigateToAgib: () => void;
    onNavigateToPoliticalProfile: () => void;
    onNavigateToArchetypesExplained: () => void;
    onNavigateToParagonConceptKapsh: () => void;
    onNavigateToParagonConceptBehavioral: () => void;
    onNavigateToParagonConceptCompetency: () => void;
    onNavigateToParagonConceptFeedback: () => void;
    onNavigateToParagonConceptEngine: () => void;
    onNavigateToJurisprudence: () => void;
    onNavigateToJudicialPerformance: () => void;
    onNavigateToJudicialPhilosophy: () => void;
    onNavigateToJudicialEthics: () => void;
    onNavigateToJudicialProfileMethodology: () => void;
    onNavigateToJudicialEcosystemAnalysisMethodology: () => void;
    onNavigateToBibliografiaJurisprudences: () => void;
    onOpenUrlShortener: () => void; // This was missing but passed in App.tsx
    onNavigateToEuropeanCommission: () => void;
    onNavigateToEuCodeOfConduct: () => void;
    onNavigateToEuReferencesArchive: () => void;
    onNavigateToReputationWarRoom: () => void;
    onNavigateToNexusAiGovernance?: () => void;
    onNavigateToNoraAiProfile?: () => void;
    onNavigateToAuthorProfile?: () => void;
    onNavigateToShkoderCulture?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = (props) => {
    // Destructure props that HeaderMenu can't handle (those with arguments, data arrays)
    const { 
        onClose, 
        onNavigateToTvShowPage,
        tvShows,
        onNavigateToNewsCategory,
        // The rest are valid for HeaderMenu and are collected here
        ...headerMenuProps 
    } = props;

    return (
        <div className="md:hidden bg-white dark:bg-slate-800 fixed inset-0 z-[70] overflow-y-auto" id="mobile-menu">
            <div className="flex justify-end p-4 sticky top-0 bg-white dark:bg-slate-800 z-10">
                <button
                    onClick={onClose}
                    className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    aria-label="Mbyll menunë"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                 {/* Spread the collected simple navigation props into HeaderMenu */}
                 <HeaderMenu isMobile={true} onClose={onClose} {...headerMenuProps} />
            </div>
        </div>
    );
};