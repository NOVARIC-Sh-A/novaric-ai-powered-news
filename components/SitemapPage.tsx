import React from 'react';
import { 
    HomeIcon, 
    ShieldCheckIcon, 
    ScaleIcon, 
    BriefcaseIcon, 
    UsersIcon, 
    AcademicCapIcon, 
    NewspaperIcon,
    BookOpenIcon,
    ChartBarIcon,
    BuildingLibraryIcon,
    LightBulbIcon,
    BeakerIcon,
    EnvelopeIcon,
    InformationCircleIcon,
    LockClosedIcon,
    DocumentTextIcon,
    PaintBrushIcon,
    MapIcon,
    PresentationChartLineIcon,
    CpuChipIcon
} from './icons';
import { renderWithSuperscript } from '../utils/textUtils';

interface SitemapPageProps {
  onBack: () => void;
  onNavigateToMain: () => void;
  onNavigateToPoliticians: () => void;
  onNavigateToJudiciary: () => void;
  onNavigateToBusiness: () => void;
  onNavigateToMediaPersonalities: () => void;
  onNavigateToParliamentMembersPage: () => void;
  onNavigateToNewsList: () => void;
  onNavigateToArticlesList: () => void;
  onNavigateToAcademicJournalsList: () => void;
  onNavigateToNovaricAcademy: () => void;
  onNavigateToNovaricMediaHouse: () => void;
  onNavigateToShkoderPolitics: () => void;
  onNavigateToShkoderEconomy: () => void;
  onNavigateToShkoderSocial: () => void;
  onNavigateToShkoderCulture?: () => void;
  onNavigateToFakeNewsArchive: () => void;
  onNavigateToMediaEducationFramework: () => void;
  onNavigateToMediaEducationBibliography: () => void;
  onNavigateToNewsletter: () => void;
  onNavigateToPrivacy: () => void;
  onNavigateToSocialMediaPolicy: () => void;
  onNavigateToCopyrightPolicy: () => void;
  onNavigateToJournalisticEthicsManual: () => void;
  onNavigateToAboutUs: () => void;
  onNavigateToAnalysisMethodology: () => void;
  onNavigateToDataSourceCoverage: () => void;
  onNavigateToBrandGuidelines: () => void;
  onNavigateToTrademark: () => void;
  onNavigateToTvPersonalitiesAnalysis: () => void;
  onNavigateToHermeneuticFramework: () => void;
  onNavigateToDeconstructNews: () => void;
  onNavigateToNovaricCodeOfStandards: () => void;
  onNavigateToBuletinCorruptionAnalysis: () => void;
  onNavigateToBuletinMethodology: () => void;
  onNavigateToBuletinBeShqiperi: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToArticleMetricsExplained: () => void;
  onNavigateToFactCheckForm: () => void;
  onNavigateToParagonMethodologyPage: () => void;
  onNavigateToParagonVisualizationPage: () => void;
  onNavigateToParagonNetworkMap: () => void;
  onNavigateToMaragonFramework: () => void;
  onNavigateToAlbanianMediaBenchmark: () => void;
  onNavigateToAcppaMethodology: () => void;
  onNavigateToPoliticalProfileFramework: () => void;
  onNavigateToPoliticalEthicsComparison: () => void;
  onNavigateToPvafInstitutionalPerformance: () => void;
  onNavigateToParagonMethodologyUnified: () => void;
  onNavigateToBibliografiaEZgjeruar: () => void;
  onNavigateToPowerNetworkAnalysis: () => void;
  onNavigateToPoliticalIntegrityProfile: () => void;
  onNavigateToEuropeanEthicsStructures?: () => void;
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
  onNavigateToNovaricJournalManifesto: () => void;
  onNavigateToZodiacInfoPage: () => void;
  onNavigateToAiReadinessMatrix: () => void;
  onNavigateToCorporatePositionStatement: () => void;
  onNavigateToNexusAiGovernance?: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 pb-2 border-b-2 border-primary-500/30">{title}</h2>
    <ul className="space-y-3 list-none pl-0">
      {children}
    </ul>
  </div>
);

const PageLink: React.FC<{ onClick?: () => void; children: React.ReactNode; icon?: React.ReactNode }> = ({ onClick, children, icon }) => (
  <li>
    <button onClick={onClick} disabled={!onClick} className="flex items-center text-left text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed">
      {icon && <div className="w-6 mr-3 text-primary-500 flex-shrink-0 flex justify-center">{icon}</div>}
      <span className="hover:underline">{children}</span>
    </button>
  </li>
);

export const SitemapPage: React.FC<SitemapPageProps> = (props) => {
  const iconClass = "w-5 h-5";

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <div className="mb-8">
            <button
                onClick={props.onBack}
                className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-primary-500"
                aria-label="Kthehu Pas"
            >
                &larr; <span className="ml-2">Kthehu Pas</span>
            </button>
        </div>

        <header className="text-center mb-10">
          <MapIcon className="w-16 h-16 mx-auto text-primary-600 dark:text-primary-400 mb-2" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-slate-100">Harta e Faqes</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">{renderWithSuperscript('Një pasqyrë e plotë e të gjitha faqeve në platformën NOVARIC®.')}</p>
        </header>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
          <div>
            <Section title="Faqja Kryesore & Mjetet">
                <PageLink onClick={props.onNavigateToMain} icon={<HomeIcon className={iconClass}/>}>Faqja Kryesore & Verifikuesi i Fakteve</PageLink>
                <PageLink onClick={props.onNavigateToFactCheckForm} icon={<ShieldCheckIcon className={iconClass}/>}>Mjeti i Verifikimit (API Eksternal)</PageLink>
            </Section>

            <Section title="Profilet Publike">
                <PageLink onClick={props.onNavigateToPoliticians} icon={<ShieldCheckIcon className={iconClass}/>}>Figurat Politike</PageLink>
                <PageLink onClick={props.onNavigateToParliamentMembersPage} icon={<UsersIcon className={iconClass}/>}>Anëtarët e Parlamentit 2025</PageLink>
                <PageLink onClick={props.onNavigateToJudiciary} icon={<ScaleIcon className={iconClass}/>}>Sistemi Gjyqësor</PageLink>
                <PageLink onClick={props.onNavigateToBusiness} icon={<BriefcaseIcon className={iconClass}/>}>Bota e Biznesit</PageLink>
                <PageLink onClick={props.onNavigateToMediaPersonalities} icon={<UsersIcon className={iconClass}/>}>Personalitete Mediatike</PageLink>
                <PageLink onClick={props.onNavigateToTvPersonalitiesAnalysis} icon={<PresentationChartLineIcon className={iconClass}/>}>Analizë e Figurave Publike</PageLink>
                <PageLink onClick={props.onNavigateToNoraAiProfile} icon={<CpuChipIcon className={iconClass}/>}>Profili i Norës (AI)</PageLink>
            </Section>

            <Section title="Arkiva & Përmbajtja">
                <PageLink onClick={props.onNavigateToNewsList} icon={<NewspaperIcon className={iconClass}/>}>Arkiva e Lajmeve</PageLink>
                <PageLink onClick={props.onNavigateToArticlesList} icon={<BookOpenIcon className={iconClass}/>}>Artikujt e Publikuar</PageLink>
                <PageLink onClick={props.onNavigateToAcademicJournalsList} icon={<AcademicCapIcon className={iconClass}/>}>Revistat Akademike</PageLink>
                <PageLink onClick={props.onNavigateToFakeNewsArchive} icon={<LightBulbIcon className={iconClass}/>}>Arkiva 'Fake News'</PageLink>
            </Section>

            <Section title="Qyteti i Shkodrës">
                <PageLink onClick={props.onNavigateToShkoderPolitics} icon={<BuildingLibraryIcon className={iconClass}/>}>Politika në Shkodër</PageLink>
                <PageLink onClick={props.onNavigateToShkoderEconomy} icon={<ChartBarIcon className={iconClass}/>}>Ekonomia e Shkodrës</PageLink>
                <PageLink onClick={props.onNavigateToShkoderSocial} icon={<UsersIcon className={iconClass}/>}>Demografia & Statistikat Sociale</PageLink>
                {props.onNavigateToShkoderCulture && (
                  <PageLink onClick={props.onNavigateToShkoderCulture} icon={<BookOpenIcon className={iconClass}/>}>Kulturë: “Asht nga një familje e mirë” (Analizë)</PageLink>
                )}
            </Section>
            
            <Section title="Buletini Investigativ">
                <PageLink onClick={props.onNavigateToNewsletter} icon={<EnvelopeIcon className={iconClass}/>}>Buletini Javor</PageLink>
                <PageLink onClick={props.onNavigateToBuletinCorruptionAnalysis} icon={<BriefcaseIcon className={iconClass}/>}>Mjedisi i Biznesit</PageLink>
                <PageLink onClick={props.onNavigateToBuletinBeShqiperi} icon={<BriefcaseIcon className={iconClass}/>}>Marrëdhënia BE-Shqipëri</PageLink>
                <PageLink onClick={props.onNavigateToBuletinMethodology} icon={<BeakerIcon className={iconClass}/>}>Metodologjia e Buletinit</PageLink>
                <PageLink onClick={props.onNavigateToZodiacInfoPage} icon={<LightBulbIcon className={iconClass}/>}>Shenjat e Zodiakut</PageLink>
            </Section>
          </div>

          <div>
             <Section title="Analiza & Metodologjia">
                <PageLink onClick={props.onNavigateToParagonConceptKapsh} icon={<BeakerIcon className={iconClass}/>}>Korniza KAPSH (Shtresa 1)</PageLink>
                <PageLink onClick={props.onNavigateToParagonConceptBehavioral} icon={<BeakerIcon className={iconClass}/>}>Metodat e Vlerësimit të Sjelljes</PageLink>
                <PageLink onClick={props.onNavigateToParagonConceptCompetency} icon={<BeakerIcon className={iconClass}/>}>Kornizat e Bazuara në Kompetenca</PageLink>
                <PageLink onClick={props.onNavigateToParagonConceptFeedback} icon={<BeakerIcon className={iconClass}/>}>Sistemet e Feedback-ut</PageLink>
                <PageLink onClick={props.onNavigateToParagonConceptEngine} icon={<CpuChipIcon className={iconClass}/>}>Motori i Vlerësimit PARAGON</PageLink>
                <PageLink onClick={props.onNavigateToAgib} icon={<ChartBarIcon className={iconClass}/>}>Barometri AGIB</PageLink>
                <PageLink onClick={props.onNavigateToPoliticalProfile} icon={<DocumentTextIcon className={iconClass}/>}>Profili Politik (Shembull)</PageLink>
                <PageLink onClick={props.onNavigateToAnalysisMethodology} icon={<BeakerIcon className={iconClass}/>}>Metodologjia & Përgjegjësia</PageLink>
                <PageLink onClick={props.onNavigateToArticleMetricsExplained} icon={<ChartBarIcon className={iconClass}/>}>Shpjegimi i Metrikave të Artikullit</PageLink>
                <PageLink onClick={props.onNavigateToMaragonFramework} icon={<ChartBarIcon className={iconClass}/>}>Korniza MARAGON®</PageLink>
                <PageLink onClick={props.onNavigateToAlbanianMediaBenchmark} icon={<ChartBarIcon className={iconClass}/>}>Ekosistemi i Vlerësimit të Medias</PageLink>
                <PageLink onClick={props.onNavigateToAcppaMethodology} icon={<BookOpenIcon className={iconClass}/>}>Metodologjia ACPPA (PARAGON®)</PageLink>
                <PageLink onClick={props.onNavigateToParagonMethodologyPage} icon={<BookOpenIcon className={iconClass}/>}>Korniza Metodologjike PARAGON®</PageLink>
                <PageLink onClick={props.onNavigateToParagonMethodologyUnified} icon={<BookOpenIcon className={iconClass}/>}>Metodologjia e Unifikuar PARAGON®</PageLink>
                 <PageLink onClick={props.onNavigateToPoliticalProfileFramework} icon={<DocumentTextIcon className={iconClass}/>}>Korniza e Vlerësimit të Profilit Politik (PVAF)</PageLink>
                <PageLink onClick={props.onNavigateToPoliticalIntegrityProfile} icon={<BeakerIcon className={iconClass}/>}>Profili i Integritetit Politik (PIP)</PageLink>
                <PageLink onClick={props.onNavigateToArchetypesExplained} icon={<BeakerIcon className={iconClass}/>}>Shpjegimi i Arketipeve & Metodologjisë PIP</PageLink>
                <PageLink onClick={props.onNavigateToPvafInstitutionalPerformance} icon={<DocumentTextIcon className={iconClass}/>}>Performanca Institucionale (PVAF)</PageLink>
                <PageLink onClick={props.onNavigateToPoliticalEthicsComparison} icon={<DocumentTextIcon className={iconClass}/>}>Etika Politike: Krahasim</PageLink>
                {props.onNavigateToEuropeanEthicsStructures && <PageLink onClick={props.onNavigateToEuropeanEthicsStructures} icon={<DocumentTextIcon className={iconClass}/>}>Strukturat Etike Evropiane</PageLink>}
                <PageLink onClick={props.onNavigateToParagonVisualizationPage} icon={<PresentationChartLineIcon className={iconClass}/>}>Modeli Analitik PARAGON®</PageLink>
                <PageLink onClick={props.onNavigateToParagonNetworkMap} icon={<MapIcon className={iconClass}/>}>Harta e Rrjetit PARAGON®</PageLink>
                <PageLink onClick={props.onNavigateToPowerNetworkAnalysis} icon={<MapIcon className={iconClass}/>}>Harta e Rrjetit të Pushtetit</PageLink>
                <PageLink onClick={props.onNavigateToBibliografiaEZgjeruar} icon={<BookOpenIcon className={iconClass}/>}>Bibliografia e Zgjeruar</PageLink>
                <PageLink onClick={props.onNavigateToJurisprudence} icon={<ScaleIcon className={iconClass}/>}>Përforcimi i Shtetit të Së Drejtës</PageLink>
                <PageLink onClick={props.onNavigateToJudicialPerformance} icon={<ChartBarIcon className={iconClass}/>}>Performanca Gjyqësore</PageLink>
                <PageLink onClick={props.onNavigateToJudicialPhilosophy} icon={<BeakerIcon className={iconClass}/>}>Filozofia Gjyqësore</PageLink>
                <PageLink onClick={props.onNavigateToJudicialEthics} icon={<ShieldCheckIcon className={iconClass}/>}>Integriteti & Etika</PageLink>
                <PageLink onClick={props.onNavigateToJudicialProfileMethodology} icon={<BeakerIcon className={iconClass}/>}>Metodologjia e Profilimit Gjyqësor</PageLink>
                <PageLink onClick={props.onNavigateToJudicialEcosystemAnalysisMethodology} icon={<BeakerIcon className={iconClass}/>}>Analiza e Ekosistemit Gjyqësor</PageLink>
                <PageLink onClick={props.onNavigateToBibliografiaJurisprudences} icon={<BookOpenIcon className={iconClass}/>}>Bibliografia e Zgjeruar (Jurisprudencë)</PageLink>
            </Section>

            <Section title="Edukimi Mediatik">
                <PageLink onClick={props.onNavigateToMediaEducationFramework} icon={<BeakerIcon className={iconClass}/>}>Korniza e Vlerësimit Mediatik</PageLink>
                <PageLink onClick={props.onNavigateToHermeneuticFramework} icon={<BookOpenIcon className={iconClass}/>}>Çfarë është Hermeneutika?</PageLink>
                <PageLink onClick={props.onNavigateToDeconstructNews} icon={<CpuChipIcon className={iconClass}/>}>Dekonstrukto Lajmin</PageLink>
                <PageLink onClick={props.onNavigateToMediaEducationBibliography} icon={<BookOpenIcon className={iconClass}/>}>Bibliografia</PageLink>
            </Section>

            <Section title="Publikime NOVARIC®">
                <PageLink onClick={props.onNavigateToNexusAiGovernance} icon={<ScaleIcon className={`${iconClass} text-[#009AE4]`}/>}>Kodi & Qeverisja AI (Nexus Humanist AI)</PageLink>
                <PageLink onClick={props.onNavigateToNoraAiProfile} icon={<CpuChipIcon className={`${iconClass} text-cyan-500`}/>}>Nora (AI) — Analiste & Publikime</PageLink>
                <PageLink onClick={props.onNavigateToNovaricJournalManifesto} icon={<BookOpenIcon className={iconClass}/>}>NOVARIC<sup>®</sup> AI Journal</PageLink>
                <PageLink onClick={props.onNavigateToFakeNewsArchive} icon={<LightBulbIcon className={iconClass}/>}>Arkiva 'Fake News'</PageLink>
                <PageLink onClick={props.onNavigateToDeconstructNews} icon={<CpuChipIcon className={iconClass}/>}>Dekonstrukto Lajmin</PageLink>
                <PageLink onClick={props.onNavigateToAiReadinessMatrix} icon={<CpuChipIcon className={iconClass}/>}>AI Readiness Matrix</PageLink>
                <PageLink onClick={props.onNavigateToCorporatePositionStatement} icon={<DocumentTextIcon className={iconClass}/>}>Pozicioni Zyrtar Korporativ</PageLink>
            </Section>

            <Section title="Iniciativat NOVARIC®">
                <PageLink onClick={props.onNavigateToNovaricAcademy} icon={<AcademicCapIcon className={iconClass}/>}>NOVARIC<sup>®</sup> Academy</PageLink>
                <PageLink onClick={props.onNavigateToNovaricMediaHouse} icon={<BriefcaseIcon className={iconClass}/>}>NOVARIC<sup>®</sup> Media House</PageLink>
                <PageLink onClick={props.onNavigateToNovaricJournalManifesto} icon={<BookOpenIcon className={iconClass}/>}>NOVARIC<sup>®</sup> AI Journal</PageLink>
            </Section>

            <Section title="Informacion & Politika">
                <PageLink onClick={props.onNavigateToAboutUs} icon={<InformationCircleIcon className={iconClass}/>}>Misioni Ynë (Rreth Nesh)</PageLink>
                <PageLink onClick={props.onNavigateToJournalisticEthicsManual} icon={<BookOpenIcon className={iconClass}/>}>Manuali i Etikës Gazetareske</PageLink>
                <PageLink onClick={props.onNavigateToNovaricCodeOfStandards} icon={<BookOpenIcon className={iconClass}/>}>Kodi i Standardeve</PageLink>
                <PageLink onClick={props.onNavigateToDataSourceCoverage} icon={<DocumentTextIcon className={iconClass}/>}>Burimi i të Dhënave</PageLink>
                <PageLink onClick={props.onNavigateToBrandGuidelines} icon={<PaintBrushIcon className={iconClass}/>}>Udhëzimet e Brandit</PageLink>
                <PageLink onClick={props.onNavigateToPrivacy} icon={<LockClosedIcon className={iconClass}/>}>Politika e Privatësisë</PageLink>
                <PageLink onClick={props.onNavigateToSocialMediaPolicy} icon={<LockClosedIcon className={iconClass}/>}>Politika e Mediave Sociale</PageLink>
                <PageLink onClick={props.onNavigateToCopyrightPolicy} icon={<LockClosedIcon className={iconClass}/>}>Të Drejtat e Autorit</PageLink>
                <PageLink onClick={props.onNavigateToTrademark} icon={<DocumentTextIcon className={iconClass}/>}>Certifikata e Markës Tregtare</PageLink>
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
};
