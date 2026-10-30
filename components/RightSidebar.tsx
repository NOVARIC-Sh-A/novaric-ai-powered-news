import React, { useState } from 'react';
/* Corrected typo: ChevronDownIconIcon -> ChevronDownIcon */
import { BookOpenIcon, BriefcaseIcon, ChartBarIcon, LightBulbIcon, CpuChipIcon, BeakerIcon, ChevronDownIcon, UserGroupIcon, ScaleIcon, ShieldCheckIcon, GlobeEuropeAfricaIcon, DocumentTextIcon } from './icons';
import { ShkoderWeather } from './ShkoderWeather';
import { NovaricBrand } from './NovaricBrand';

interface RightSidebarProps {
  onNavigateToPoliticians?: () => void; 
  onNavigateToJudiciary?: () => void;
  onNavigateToBusiness?: () => void;
  onNavigateToParliamentMembersPage?: () => void;
  onNavigateToNovaricJournalManifesto?: () => void;
  onNavigateToBuletinDhomaTregtise?: () => void;
  onNavigateToBuletinCorruptionAnalysis?: () => void;
  onNavigateToBuletinBeShqiperi?: () => void;
  onNavigateToParagonMethodologyPage?: () => void;
  onNavigateToParagonVisualizationPage?: () => void;
  onNavigateToParagonNetworkMap?: () => void;
  onNavigateToFakeNewsArchive?: () => void;
  onNavigateToDeconstructNews?: () => void;
  onNavigateToAcppaMethodology?: () => void;
  onNavigateToPoliticalProfileFramework?: () => void;
  onNavigateToPoliticalEthicsComparison?: () => void;
  onNavigateToPvafInstitutionalPerformance?: () => void;
  onNavigateToParagonMethodologyUnified?: () => void;
  onNavigateToBibliografiaEZgjeruar?: () => void;
  onNavigateToPowerNetworkAnalysis?: () => void;
  onNavigateToPoliticalIntegrityProfile?: () => void;
  onNavigateToEuropeanEthicsStructures?: () => void;
  onNavigateToPoliticalProfile?: () => void;
  onNavigateToArchetypesExplained?: () => void;
  onNavigateToAgib?: () => void;
  onNavigateToParagonConceptKapsh?: () => void;
  onNavigateToParagonConceptBehavioral?: () => void;
  onNavigateToParagonConceptCompetency?: () => void;
  onNavigateToParagonConceptFeedback?: () => void;
  onNavigateToParagonConceptEngine?: () => void;
  onNavigateToJurisprudence?: () => void;
  onNavigateToJudicialPerformance?: () => void;
  onNavigateToJudicialPhilosophy?: () => void;
  onNavigateToJudicialEthics?: () => void;
  onNavigateToJudicialProfileMethodology?: () => void;
  onNavigateToJudicialEcosystemAnalysisMethodology?: () => void;
  onNavigateToBibliografiaJurisprudences?: () => void;
  onNavigateToZodiacInfoPage?: () => void;
  onNavigateToEuropeanCommission?: () => void;
  onNavigateToEuCodeOfConduct?: () => void;
  onNavigateToEuReferencesArchive?: () => void;
  onNavigateToWhitepaperVisualization?: () => void;
  onNavigateToAiReadinessMatrix?: () => void;
  onNavigateToCorporatePositionStatement?: () => void;
  onNavigateToCidaMethodology?: () => void;
  onNavigateToReputationWarRoom?: () => void;
  onNavigateToNexusAiGovernance?: () => void;
  onNavigateToNoraAiProfile?: () => void;
  onNavigateToAuthorProfile?: () => void;
}

const SectionHeading: React.FC<{ 
    title: React.ReactNode; 
    isOpen: boolean; 
    onToggle: () => void; 
}> = ({ title, isOpen, onToggle }) => (
    <button
        onClick={onToggle}
        className="w-full text-left text-md font-bold text-slate-800 dark:text-white mb-2 px-3 sticky top-[130px] sm:top-[160px] bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm py-2 z-10 border-b-2 border-primary-500 shadow-sm flex justify-between items-center group transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
    >
        <span>{title}</span>
        <ChevronDownIcon className={`w-4 h-4 text-primary-500 transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`} />
    </button>
);

const NavButton: React.FC<{ onClick?: () => void; children: React.ReactNode; icon?: React.ReactNode; indent?: boolean; className?: string; }> = ({ onClick, children, icon, indent, className = '' }) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className={`text-sm font-medium text-slate-800 dark:text-slate-200 mb-1 py-1.5 w-full text-left bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md transition-all duration-200 disabled:cursor-default disabled:hover:bg-transparent dark:disabled:hover:bg-transparent flex items-center ${indent ? 'px-2 pl-6' : 'px-2'} ${className}`}
  >
    {icon && <span className="mr-2 text-primary-600 dark:text-primary-400">{icon}</span>}
    <span>{children}</span>
  </button>
);

const AccordionSection: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => (
    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg overflow-hidden mb-2">
        <button
            onClick={onToggle}
            className="w-full text-left text-sm font-bold text-slate-800 dark:text-white px-3 py-1.5 bg-slate-200/80 dark:bg-slate-700/80 backdrop-blur-sm flex justify-between items-center"
        >
            <span>{title}</span>
            <ChevronDownIcon className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && <div className="p-1 space-y-0.5">{children}</div>}
    </div>
);


export const RightSidebar: React.FC<RightSidebarProps> = (props) => {
    // Tracking main top-level sections. Default all closed as requested.
    const [openMainSections, setOpenMainSections] = useState<Record<string, boolean>>({
        profiles: false,
        eu: false,
        politics: false,
        jurisprudence: false,
        bulletin: false,
        publications: false
    });

    // Sub-accordions for Political Analysis. Default all closed.
    const [openSubSections, setOpenSubSections] = useState<string | null>(null);

    const toggleMainSection = (key: string) => {
        setOpenMainSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleSubSection = (section: string) => {
        setOpenSubSections(openSubSections === section ? null : section);
    };

    const handleNavigate = (handler?: () => void, targetPage?: string) => {
        if (handler) {
            handler();
        } else if (targetPage) {
            window.dispatchEvent(new CustomEvent('app:navigate', { detail: targetPage }));
        }
    };

  return (
    <div className="h-full flex flex-col space-y-4">
      <ShkoderWeather />

      {/* 1. Public Profiles */}
      <div>
        <SectionHeading 
            title="Profilet Publike" 
            isOpen={openMainSections.profiles} 
            onToggle={() => toggleMainSection('profiles')} 
        />
        {openMainSections.profiles && (
            <div className="animate-fadeIn">
                <NavButton onClick={props.onNavigateToPoliticians}>Figurat Politike</NavButton>
                <NavButton onClick={props.onNavigateToParliamentMembersPage}>Anëtarët e Parlamentit 2025</NavButton>
                <NavButton onClick={props.onNavigateToJudiciary}>Sistemi Gjyqësor</NavButton>
                <NavButton onClick={props.onNavigateToBusiness}>Bota e Biznesit</NavButton>
                <NavButton onClick={props.onNavigateToPoliticalProfile} icon={<UserGroupIcon className="w-4 h-4" />}>Profili Politik (Shembull)</NavButton>
                <NavButton onClick={props.onNavigateToPoliticalProfileFramework} icon={<BeakerIcon className="w-4 h-4" />}>Metodologjia e Profilimit</NavButton>
            </div>
        )}
      </div>

      {/* 2. E.U. Watch */}
      <div>
        <SectionHeading 
            title="E.U. Watch" 
            isOpen={openMainSections.eu} 
            onToggle={() => toggleMainSection('eu')} 
        />
        {openMainSections.eu && (
            <div className="animate-fadeIn">
                <NavButton 
                    onClick={props.onNavigateToEuropeanCommission ? props.onNavigateToEuropeanCommission : () => handleNavigate(undefined, 'europeanCommission')} 
                    icon={<GlobeEuropeAfricaIcon className="w-4 h-4" />}
                >
                    Kolegji i Komisionerëve
                </NavButton>
                <NavButton 
                    onClick={props.onNavigateToEuCodeOfConduct ? props.onNavigateToEuCodeOfConduct : () => handleNavigate(undefined, 'euCodeOfConduct')} 
                    icon={<ShieldCheckIcon className="w-4 h-4" />}
                >
                    Kodi i Sjelljes
                </NavButton>
                <NavButton 
                    onClick={props.onNavigateToEuReferencesArchive ? props.onNavigateToEuReferencesArchive : () => handleNavigate(undefined, 'euReferencesArchive')} 
                    icon={<BookOpenIcon className="w-4 h-4" />}
                >
                    Arkiva e Referencave
                </NavButton>
            </div>
        )}
      </div>

      {/* 3. Political Analysis (with nested sub-sections) */}
      <div>
        <SectionHeading 
            title="Analiza Politike" 
            isOpen={openMainSections.politics} 
            onToggle={() => toggleMainSection('politics')} 
        />
        {openMainSections.politics && (
            <div className="animate-fadeIn">
                <AccordionSection title="Themelet Metodologjike" isOpen={openSubSections === 'themelet'} onToggle={() => toggleSubSection('themelet')}>
                    <NavButton onClick={props.onNavigateToParagonMethodologyUnified}>Metodologjia e Unifikuar PARAGON®</NavButton>
                    <NavButton onClick={props.onNavigateToParagonConceptKapsh}>Korniza KAPSH</NavButton>
                    <NavButton onClick={props.onNavigateToParagonConceptBehavioral}>Metodat e Vlerësimit të Sjelljes</NavButton>
                    <NavButton onClick={props.onNavigateToParagonConceptCompetency}>Kornizat e Bazuara në Kompetenca</NavButton>
                    <NavButton onClick={props.onNavigateToParagonConceptFeedback}>Sistemet e Feedback-ut</NavButton>
                </AccordionSection>

                <AccordionSection title="Zbatimi & Veglat Analitike" isOpen={openSubSections === 'zbatimi'} onToggle={() => toggleSubSection('zbatimi')}>
                    <NavButton onClick={props.onNavigateToParagonConceptEngine}>Motori i Vlerësimit PARAGON</NavButton>
                    <NavButton onClick={props.onNavigateToParagonVisualizationPage}>Modeli Analitik PARAGON®</NavButton>
                    <NavButton onClick={props.onNavigateToAcppaMethodology}>Metodologjia ACPPA (PARAGON®)</NavButton>
                    <NavButton onClick={props.onNavigateToAgib}>Barometri AGIB</NavButton>
                    <NavButton onClick={props.onNavigateToPoliticalIntegrityProfile}>Profili i Integritetit Politik (PIP)</NavButton>
                    <div className="mt-2">
                        <AccordionSection title="Vlerësimi i Performancës (PVAF)" isOpen={openSubSections === 'pvaf'} onToggle={() => toggleSubSection('pvaf')}>
                            <NavButton onClick={props.onNavigateToPoliticalProfileFramework} indent>Korniza e Vlerësimit (PVAF)</NavButton>
                            <NavButton onClick={props.onNavigateToPvafInstitutionalPerformance} indent>Performanca Institucionale</NavButton>
                        </AccordionSection>
                    </div>
                </AccordionSection>

                <AccordionSection title="Rezultatet & Vizualizimet" isOpen={openSubSections === 'rezultatet'} onToggle={() => toggleSubSection('rezultatet')}>
                    <NavButton onClick={props.onNavigateToPoliticalProfile}>Profili Politik (Shembull)</NavButton>
                    <NavButton onClick={props.onNavigateToArchetypesExplained}>Shpjegimi i Arketipeve</NavButton>
                    <NavButton onClick={props.onNavigateToParagonNetworkMap}>Harta e Rrjetit PARAGON®</NavButton>
                    <NavButton onClick={props.onNavigateToPowerNetworkAnalysis}>Harta e Rrjetit të Pushtetit</NavButton>
                </AccordionSection>
                
                <AccordionSection title="Konteksti & Krahasimi" isOpen={openSubSections === 'konteksti'} onToggle={() => toggleSubSection('konteksti')}>
                    <NavButton onClick={props.onNavigateToPoliticalEthicsComparison}>Etika Politike: Shqipëri vs. Eurozonë</NavButton>
                    <NavButton onClick={props.onNavigateToEuropeanEthicsStructures}>Strukturat Etike Evropiane</NavButton>
                </AccordionSection>
                
                <div className="mt-2">
                    <NavButton onClick={props.onNavigateToBibliografiaEZgjeruar} icon={<BookOpenIcon className="w-4 h-4" />}>Bibliografia e Zgjeruar</NavButton>
                </div>
            </div>
        )}
      </div>
      
      {/* 4. Jurisprudence */}
      <div>
        <SectionHeading 
            title="Jurisprudenca" 
            isOpen={openMainSections.jurisprudence} 
            onToggle={() => toggleMainSection('jurisprudence')} 
        />
        {openMainSections.jurisprudence && (
            <div className="animate-fadeIn">
                <NavButton onClick={props.onNavigateToJurisprudence} icon={<ScaleIcon className="w-4 h-4" />}>
                Përforcimi i Shtetit të Së Drejtës
                </NavButton>
                <NavButton onClick={props.onNavigateToJudicialPerformance} icon={<ChartBarIcon className="w-4 h-4" />}>
                Performanca Gjyqësore
                </NavButton>
                <NavButton onClick={props.onNavigateToJudicialPhilosophy} icon={<BeakerIcon className="w-4 h-4" />}>
                Filozofia Gjyqësore
                </NavButton>
                <NavButton onClick={props.onNavigateToJudicialEthics} icon={<ShieldCheckIcon className="w-4 h-4" />}>
                Integriteti & Etika
                </NavButton>
                <NavButton onClick={props.onNavigateToJudicialProfileMethodology} icon={<BeakerIcon className="w-4 h-4" />}>
                Metodologjia e Profilimit
                </NavButton>
                <NavButton onClick={props.onNavigateToJudicialEcosystemAnalysisMethodology} icon={<BeakerIcon className="w-4 h-4" />}>
                Analiza e Ekosistemit
                </NavButton>
                <NavButton onClick={props.onNavigateToBibliografiaJurisprudences} icon={<BookOpenIcon className="w-4 h-4" />}>
                    Bibliografia
                </NavButton>
            </div>
        )}
      </div>

      {/* 5. Weekly Bulletin */}
      <div>
        <SectionHeading 
            title="Buletin Javor" 
            isOpen={openMainSections.bulletin} 
            onToggle={() => toggleMainSection('bulletin')} 
        />
        {openMainSections.bulletin && (
            <div className="animate-fadeIn">
                <NavButton onClick={props.onNavigateToBuletinDhomaTregtise} icon={<BriefcaseIcon className="w-4 h-4" />}>Mbrojtja e Biznesit</NavButton>
                <NavButton onClick={props.onNavigateToBuletinCorruptionAnalysis} icon={<BriefcaseIcon className="w-4 h-4 text-red-600 dark:text-red-400" />}>Mjedisi i Biznesit</NavButton>
                {props.onNavigateToBuletinBeShqiperi && <NavButton onClick={props.onNavigateToBuletinBeShqiperi} icon={<BriefcaseIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />}>Marrëdhënia BE-Shqipëri</NavButton>}
                <NavButton onClick={props.onNavigateToZodiacInfoPage} icon={<LightBulbIcon className="w-4 h-4" />}>Shenjat e Zodiakut</NavButton>
            </div>
        )}
      </div>

      {/* 6. NOVARIC Publications */}
      <div>
        <SectionHeading 
            title={<>Publikime <NovaricBrand /></>} 
            isOpen={openMainSections.publications} 
            onToggle={() => toggleMainSection('publications')} 
        />
        {openMainSections.publications && (
            <div className="animate-fadeIn">
                <NavButton 
                    onClick={props.onNavigateToNexusAiGovernance} 
                    icon={<ScaleIcon className="w-4 h-4 text-[#009AE4]" />}
                    className="bg-cyan-50/70 dark:bg-cyan-950/30 border-l-4 border-l-[#009AE4] shadow-sm !font-bold text-[#30384B] dark:text-cyan-300"
                >
                    Kodi & Qeverisja AI (Nexus)
                </NavButton>
                <NavButton onClick={props.onNavigateToNovaricJournalManifesto} icon={<BookOpenIcon className="w-4 h-4" />}>
                  <NovaricBrand suffix=" AI Journal" />
                </NavButton>
                <NavButton onClick={props.onNavigateToReputationWarRoom} icon={<ShieldCheckIcon className="w-4 h-4 text-rose-500" />}>War Room (Defense SOC)</NavButton>
                <NavButton 
                    onClick={props.onNavigateToFakeNewsArchive} 
                    icon={<LightBulbIcon className="w-4 h-4 text-amber-500" />}
                    className="bg-primary-50 dark:bg-primary-900/30 border-l-4 border-l-primary-500 shadow-[0_0_10px_rgba(228,25,30,0.1)] !font-bold"
                >
                    Arkiva 'Fake News'
                </NavButton>
                <NavButton onClick={props.onNavigateToCidaMethodology} icon={<ShieldCheckIcon className="w-4 h-4 text-red-600" />}>Metodologjia CIDA (Audit)</NavButton>
                <NavButton onClick={props.onNavigateToDeconstructNews} icon={<CpuChipIcon className="w-4 h-4" />}>Dekonstrukto Lajmin</NavButton>
                <NavButton onClick={props.onNavigateToAiReadinessMatrix} icon={<CpuChipIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}>AI Readiness Matrix</NavButton>
                <NavButton onClick={props.onNavigateToCorporatePositionStatement} icon={<DocumentTextIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />}>Pozicioni Zyrtar Korporativ</NavButton>
                {props.onNavigateToNoraAiProfile && (
                  <NavButton 
                    onClick={props.onNavigateToNoraAiProfile} 
                    icon={
                      <img 
                        src="https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg" 
                        alt="Nora AI" 
                        className="w-4 h-4 rounded-full object-cover border border-cyan-400 shadow-xs" 
                      />
                    }
                    className="bg-gradient-to-r from-cyan-900/20 to-primary-900/10 dark:from-cyan-950/40 dark:to-primary-950/20 border-l-4 border-l-cyan-500 font-semibold text-slate-800 dark:text-cyan-200"
                  >
                    Nora (AI) — Analiste & Publikime
                  </NavButton>
                )}
                {props.onNavigateToAuthorProfile && (
                  <NavButton 
                    onClick={props.onNavigateToAuthorProfile} 
                    icon={
                      <img 
                        src="https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png" 
                        alt="Dr Alban Gj. THIKA" 
                        className="w-4 h-4 rounded-full object-cover border border-primary-500 shadow-xs" 
                      />
                    }
                    className="bg-gradient-to-r from-primary-900/20 to-slate-900/10 dark:from-primary-950/40 dark:to-slate-950/20 border-l-4 border-l-primary-500 font-semibold text-slate-800 dark:text-primary-200"
                  >
                    Profili i Autorit — Dr Alban Gj. THIKA
                  </NavButton>
                )}
            </div>
        )}
      </div>
    </div>
  );
};