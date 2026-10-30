import React from 'react';
import {
  LeftSidebar,
  RightSidebar,
} from '../components';
import { TvShowData } from '../types';

interface HomePageProps {
  currentPage?: string;
  tvShows: TvShowData[];
  onNavigateToAnalysisMethodology: () => void;
  onNavigateToTvShow: (show: TvShowData) => void;
  onNavigateToNewsCategory: (category: string) => void;
  onNavigateToMediaEducationFramework: () => void;
  onNavigateToMediaEducationBibliography: () => void;
  onNavigateToOpenLetterShkreliBeci: () => void;
  onNavigateToNewsFeatureShkreliBeci: () => void;
  onNavigateToHermeneuticFramework: () => void;
  onNavigateToNovaricCodeOfStandards: () => void;
  onNavigateToMaragonFramework: () => void;
  onNavigateToAlbanianMediaBenchmark?: () => void;
  onNavigateToPoliticians: () => void;
  onNavigateToMediaPersonalities: () => void;
  onNavigateToJudiciary: () => void;
  onNavigateToBusiness: () => void;
  onNavigateToParliamentMembersPage: () => void;
  onNavigateToNovaricJournalManifesto: () => void;
  onNavigateToBuletinDhomaTregtise: () => void;
  onNavigateToBuletinCorruptionAnalysis: () => void;
  onNavigateToBuletinBeShqiperi: () => void;
  onNavigateToParagonMethodologyPage: () => void;
  onNavigateToParagonVisualizationPage: () => void;
  onNavigateToParagonNetworkMap: () => void;
  onNavigateToFakeNewsArchive: () => void;
  onNavigateToDeconstructNews: () => void;
  onNavigateToAcppaMethodology: () => void;
  onNavigateToPoliticalProfileFramework: () => void;
  onNavigateToPvafInstitutionalPerformance: () => void;
  onNavigateToParagonMethodologyUnified: () => void;
  onNavigateToPoliticalEthicsComparison: () => void;
  onNavigateToBibliografiaEZgjeruar: () => void;
  onNavigateToPowerNetworkAnalysis: () => void;
  onNavigateToPoliticalIntegrityProfile: () => void;
  onNavigateToEuropeanEthicsStructures: () => void;
  onNavigateToPoliticalProfile: () => void;
  onNavigateToArchetypesExplained: () => void;
  onNavigateToAgib: () => void;
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
  onNavigateToZodiacInfoPage: () => void;
  onNavigateToMaragonReport: (entityId: string | number, entityType: 'individual' | 'tvShow') => void;
  onNavigateToPressConferences: () => void;
  onNavigateToPressReleaseNovaricVisa: () => void;
  onNavigateToShkoderCulture?: () => void;
  onNavigateToShkoderShockTherapy?: () => void;
  onNavigateToShkoderPolitics?: () => void;
  onNavigateToShkoderEconomy?: () => void;
  onNavigateToShkoderSocial?: () => void;
  onNavigateToWhitepaperVisualization: () => void;
  onNavigateToAiReadinessMatrix: () => void;
  onNavigateToCorporatePositionStatement: () => void;
  onNavigateToCidaMethodology: () => void;
  onNavigateToReputationWarRoom: () => void;
  onNavigateToNexusAiGovernance?: () => void;
  onNavigateToEuropeanCommission?: () => void;
  onNavigateToEuCodeOfConduct?: () => void;
  onNavigateToEuReferencesArchive?: () => void;
}

export const HomePage: React.FC<HomePageProps> = (props) => {
  const {
    tvShows,
    onNavigateToAnalysisMethodology,
    onNavigateToWhitepaperVisualization,
    onNavigateToAiReadinessMatrix,
    ...navProps
  } = props;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-[130px] sm:top-[160px] h-fit z-[40] white-line-right">
          <div className="relative p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
             <LeftSidebar
                tvShows={tvShows}
                onNavigateToTvShow={navProps.onNavigateToTvShow}
                onNavigateToNewsCategory={navProps.onNavigateToNewsCategory}
                onNavigateToMediaEducationFramework={navProps.onNavigateToMediaEducationFramework}
                onNavigateToOpenLetterShkreliBeci={navProps.onNavigateToOpenLetterShkreliBeci}
                onNavigateToNewsFeatureShkreliBeci={navProps.onNavigateToNewsFeatureShkreliBeci}
                onNavigateToHermeneuticFramework={navProps.onNavigateToHermeneuticFramework}
                onNavigateToNovaricCodeOfStandards={navProps.onNavigateToNovaricCodeOfStandards}
                onNavigateToMaragonFramework={navProps.onNavigateToMaragonFramework}
                onNavigateToAlbanianMediaBenchmark={navProps.onNavigateToAlbanianMediaBenchmark}
                onNavigateToAnalysisMethodology={onNavigateToAnalysisMethodology}
                onNavigateToMediaEducationBibliography={navProps.onNavigateToMediaEducationBibliography}
                onNavigateToMaragonReport={navProps.onNavigateToMaragonReport}
                onNavigateToMediaPersonalities={navProps.onNavigateToMediaPersonalities}
                onNavigateToPressConferences={props.onNavigateToPressConferences}
                onNavigateToPressReleaseNovaricVisa={props.onNavigateToPressReleaseNovaricVisa}
                currentPage={props.currentPage}
                onNavigateToShkoderCulture={props.onNavigateToShkoderCulture}
                onNavigateToShkoderShockTherapy={props.onNavigateToShkoderShockTherapy}
                onNavigateToShkoderPolitics={props.onNavigateToShkoderPolitics}
                onNavigateToShkoderEconomy={props.onNavigateToShkoderEconomy}
                onNavigateToShkoderSocial={props.onNavigateToShkoderSocial}
                onNavigateToWhitepaperVisualization={onNavigateToWhitepaperVisualization}
             />
          </div>
        </aside>

        {/* Center Column */}
        <div className="col-span-12 lg:col-span-6">
          <main className="relative z-10 flex flex-col justify-between min-h-[80vh]">
            {/* Background image is visible through this area */}
          </main>
        </div>

        {/* Right Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-[130px] sm:top-[160px] h-fit z-[40] white-line-left">
           <div className="relative p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <RightSidebar 
                    {...navProps} 
                    onNavigateToWhitepaperVisualization={onNavigateToWhitepaperVisualization} 
                    onNavigateToAiReadinessMatrix={onNavigateToAiReadinessMatrix}
                />
           </div>
        </aside>

      </div>
    </div>
  );
};