import React from 'react';
import { NexusHumanistAiGovernancePage } from '../components/NexusHumanistAiGovernancePage';
import {
  PrivacyPolicy,
  SocialMediaPolicy,
  CopyrightPolicy,
  JournalisticEthicsManual,
  AboutUs,
  DataSourceCoveragePage,
  BrandGuidelines,
  TrademarkCertificatePage,
  SitemapPage,
  AnalysisMethodologyPage,
  OpenLetterShkreliBeci,
  NewsFeatureShkreliBeci,
  BuletinDhomaTregtise,
  NewsletterSubscriptionPage,
  TvPersonalitiesAnalysisPage,
  HermeneuticFrameworkPage,
  DeconstructNewsPage,
  NovaricCodeOfStandardsPage,
  BuletinCorruptionAnalysisPage,
  BuletinMethodologyPage,
  NoraAiProfilePage,
  ArticleMetricsExplainedPage,
  FactCheckFormPage,
  ParagonMethodologyPage,
  ParagonVisualizationPage,
  ParagonNetworkMapPage,
  NovaricMediaHousePage,
  MaragonFrameworkPage,
  AcppaMethodologyPage,
  PoliticalProfileFrameworkPage,
  PvafInstitutionalPerformancePage,
  BuletinBEEPage,
  ParagonMethodologyUnifiedPage,
  PoliticalEthicsComparisonPage,
  BibliografiaEZgjeruarPage,
  PowerNetworkAnalysisPage,
  PoliticalIntegrityProfilePage,
  EuropeanEthicsStructuresPage,
  AgibPage,
  // Fixed imports: Updated ParagonConcept component names to match their exports in ../components/index.ts
  ParagonConceptKapshPage,
  ParagonConceptBehavioralPage,
  ParagonConceptCompetencyPage,
  ParagonConceptMultiSourceFeedbackPage,
  ParagonConceptAssessmentEnginePage,
  ContentQualityAssurancePage,
  ShkoderCulturePage,
  JurisprudencePage,
  JudicialPerformancePage,
  JudicialPhilosophyPage,
  JudicialEthicsPage,
  JudicialProfileMethodologyPage,
  JudicialEcosystemAnalysisMethodologyPage,
  BibliografiaJurisprudencesPage,
  Parliament2025Page,
  MediaEducationFrameworkPage,
  MediaEducationBibliographyPage,
  NewsletterData,
  NewsletterWelcome,
  ZodiacInfoPage,
  PoliticianProfilePage,
  PoliticiansPage,
  MediaPersonalitiesPage,
  JudiciaryPage,
  BusinessPage,
  NovaricJournalManifestoPage,
  PressConferencesPage,
  PressReleaseNovaricVisaPage,
  EuropeanCommissionPage,
  EuCodeOfConductPage,
  EuReferencesArchivePage,
  EthicalResonancePage,
  ShkoderSocialPage,
  ShkoderEconomyPage,
  ShkoderPoliticsPage,
  ShkoderShockTherapyArticle,
  WhitepaperVisualizationPage,
  CorporatePositionStatement,
  GdprPolicyPage,
  AiReadinessMatrixPage,
  CidaMethodologyPage,
  FakeNewsArchivePage,
  ReputationWarRoom,
  AuthorProfilePage,
} from '../components';
import { VipProfile, Page, ParliamentDistrict } from '../types';
import { runAnalysisForVip } from '../services/paragonEngine';
import { AlbanianMediaBenchmarkPage } from '../NOVARIC-Albanian-Media-Benchmark-Ecosystem/AlbanianMediaBenchmarkPage';
import { NovaricJournalPage } from '../NOVARIC-Journal/NovaricJournalPage';
import { JasminaLumanajProfilePage } from '../NOVARIC-Journal/JasminaLUMANAJ';
import { fakeNewsCaseStudies } from '../data/mockFakeNews';

interface SimplePageProps {
  page: Page;
  onNavigate: (page: Page, data?: any) => void;
  profiles: VipProfile[];
  parliamentData?: ParliamentDistrict[];
  onBack: () => void;
  onNavigateToJasminaLumanajProfile: () => void;
  onNavigateToPressReleaseNovaricVisa: () => void;
}

export const SimplePage: React.FC<SimplePageProps> = ({ page, onNavigate, profiles, parliamentData, onBack, onNavigateToJasminaLumanajProfile, onNavigateToPressReleaseNovaricVisa }) => {
  const handleNavigateToVipProfile = (id: string | number) => {
    if (id === 'vip33') {
      onNavigate('authorProfile');
      return;
    }
    const profile = profiles.find(p => p.id === id);
    if (profile) onNavigate('vipProfilePage', profile);
  };

  switch (page) {
    case 'authorProfile':
    case 'profiliIAutorit':
      return <AuthorProfilePage onBack={onBack} onNavigate={onNavigate} />;
    case 'reputationWarRoom':
      return <ReputationWarRoom onBack={onBack} />;
    case 'privacy':
      return <PrivacyPolicy onBack={onBack} />;
    case 'socialMediaPolicy':
      return <SocialMediaPolicy onBack={onBack} />;
    case 'copyrightPolicy':
      return <CopyrightPolicy onBack={onBack} />;
    case 'journalisticEthicsManual':
      return <JournalisticEthicsManual 
        onBack={onBack}
        onNavigateToMediaEducationFramework={() => onNavigate('mediaEducationFramework')}
        onNavigateToNovaricCodeOfStandards={() => onNavigate('novaricCodeOfStandards')}
        onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
        onNavigateToVipProfile={handleNavigateToVipProfile}
        onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
      />;
    case 'aboutUs':
      return <AboutUs onBack={onBack} onNavigateToAnalysisMethodology={() => onNavigate('analysisMethodology')} />;
    case 'dataSourceCoverage':
        return <DataSourceCoveragePage onBack={onBack} />;
    case 'brandGuidelines':
        return <BrandGuidelines onBack={onBack} />;
    case 'trademarkCertificate':
        return <TrademarkCertificatePage onBack={onBack} />;
    case 'sitemap':
        const nav = (p: Page) => onNavigate(p);
        return <SitemapPage 
            onBack={onBack}
            onNavigateToMain={() => nav('main')}
            onNavigateToPoliticians={() => nav('politiciansPage')}
            onNavigateToJudiciary={() => nav('judiciaryPage')}
            onNavigateToBusiness={() => nav('businessPage')}
            onNavigateToMediaPersonalities={() => nav('mediaPersonalitiesPage')}
            onNavigateToParliamentMembersPage={() => nav('parliamentMembersPage')}
            onNavigateToNewsList={() => nav('newsList')}
            onNavigateToArticlesList={() => nav('articlesList')}
            onNavigateToAcademicJournalsList={() => nav('academicJournalsList')}
            onNavigateToNovaricAcademy={() => nav('novaricAcademy')}
            onNavigateToNovaricMediaHouse={() => nav('novaricMediaHouse')}
            onNavigateToShkoderPolitics={() => nav('shkoderPoliticsPage')}
            onNavigateToShkoderEconomy={() => nav('shkoderEconomyPage')}
            onNavigateToShkoderSocial={() => nav('shkoderSocialPage')}
            onNavigateToShkoderCulture={() => nav('shkoderCulturePage')}
            onNavigateToFakeNewsArchive={() => nav('fakeNewsArchive')}
            onNavigateToMediaEducationFramework={() => nav('mediaEducationFramework')}
            onNavigateToMediaEducationBibliography={() => nav('mediaEducationBibliography')}
            onNavigateToNewsletter={() => nav('newsletterSubscription')}
            onNavigateToPrivacy={() => nav('privacy')}
            onNavigateToSocialMediaPolicy={() => nav('socialMediaPolicy')}
            onNavigateToCopyrightPolicy={() => nav('copyrightPolicy')}
            onNavigateToJournalisticEthicsManual={() => nav('journalisticEthicsManual')}
            onNavigateToAboutUs={() => nav('aboutUs')}
            onNavigateToAnalysisMethodology={() => nav('analysisMethodology')}
            onNavigateToDataSourceCoverage={() => nav('dataSourceCoverage')}
            onNavigateToBrandGuidelines={() => nav('brandGuidelines')}
            onNavigateToTrademark={() => nav('trademarkCertificate')}
            onNavigateToTvPersonalitiesAnalysis={() => nav('tvPersonalitiesAnalysis')}
            onNavigateToHermeneuticFramework={() => nav('hermeneuticFramework')}
            onNavigateToDeconstructNews={() => nav('deconstructNews')}
            onNavigateToNovaricCodeOfStandards={() => nav('novaricCodeOfStandards')}
            onNavigateToBuletinCorruptionAnalysis={() => nav('buletinCorruptionAnalysis')}
            onNavigateToBuletinMethodology={() => nav('buletinMethodology')}
            onNavigateToBuletinBeShqiperi={() => nav('buletinBeShqiperi')}
            onNavigateToNoraAiProfile={() => nav('noraAiProfile')}
            onNavigateToArticleMetricsExplained={() => nav('articleMetricsExplained')}
            onNavigateToFactCheckForm={() => nav('factCheckForm')}
            onNavigateToParagonMethodologyPage={() => nav('paragonMethodologyPage')}
            onNavigateToParagonVisualizationPage={() => nav('paragonVisualizationPage')}
            onNavigateToParagonNetworkMap={() => nav('paragonNetworkMap')}
            onNavigateToMaragonFramework={() => nav('maragonFramework')}
            onNavigateToAlbanianMediaBenchmark={() => nav('albanianMediaBenchmark')}
            onNavigateToAcppaMethodology={() => nav('acppaMethodology')}
            onNavigateToPoliticalProfileFramework={() => nav('politicalProfileFramework')}
            onNavigateToPoliticalEthicsComparison={() => nav('politicalEthicsComparison')}
            onNavigateToPvafInstitutionalPerformance={() => nav('pvafInstitutionalPerformance')}
            onNavigateToParagonMethodologyUnified={() => nav('paragonMethodologyUnified')}
            onNavigateToBibliografiaEZgjeruar={() => nav('bibliografiaEZgjeruar')}
            onNavigateToPowerNetworkAnalysis={() => nav('powerNetworkAnalysis')}
            onNavigateToPoliticalIntegrityProfile={() => nav('politicalIntegrityProfile')}
            onNavigateToEuropeanEthicsStructures={() => nav('europeanEthicsStructures')}
            onNavigateToPoliticalProfile={() => nav('politicalProfile')}
            onNavigateToArchetypesExplained={() => nav('archetypesExplained')}
            onNavigateToAgib={() => nav('agib')}
            onNavigateToParagonConceptKapsh={() => nav('paragonConceptKapsh')}
            onNavigateToParagonConceptBehavioral={() => nav('paragonConceptBehavioral')}
            onNavigateToParagonConceptCompetency={() => nav('paragonConceptCompetency')}
            onNavigateToParagonConceptFeedback={() => nav('paragonConceptFeedback')}
            onNavigateToParagonConceptEngine={() => nav('paragonConceptEngine')}
            onNavigateToJurisprudence={() => nav('jurisprudencePage')}
            onNavigateToJudicialPerformance={() => nav('judicialPerformancePage')}
            onNavigateToJudicialPhilosophy={() => nav('judicialPhilosophyPage')}
            onNavigateToJudicialEthics={() => nav('judicialEthicsPage')}
            onNavigateToJudicialProfileMethodology={() => nav('judicialProfileMethodologyPage')}
            onNavigateToJudicialEcosystemAnalysisMethodology={() => nav('judicialEcosystemAnalysisMethodologyPage')}
            onNavigateToBibliografiaJurisprudences={() => nav('bibliografiaJurisprudences')}
            onNavigateToNovaricJournalManifesto={() => nav('novaricJournalManifesto')}
            onNavigateToZodiacInfoPage={() => nav('zodiacInfoPage')}
            onNavigateToAiReadinessMatrix={() => nav('aiReadinessMatrix')}
            onNavigateToCorporatePositionStatement={() => nav('corporatePositionStatement')}
        />;
    case 'parliamentMembersPage':
        return <Parliament2025Page data={parliamentData || []} profiles={profiles} onBack={onBack} onNavigateToProfilePage={(profile) => onNavigate('vipProfilePage', profile)} />;
    case 'shkoderCulturePage':
        return <ShkoderCulturePage 
            onBack={onBack} 
            onNavigateToVipProfile={(id) => {
                if (id === 'noraAiProfile') {
                    onNavigate('noraAiProfile');
                    return;
                }
                const profile = profiles?.find(p => p.id === id);
                if (profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'analysisMethodology':
    case 'methodology':
        return <AnalysisMethodologyPage 
                    onBack={onBack} 
                    onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
                    onNavigateToVipProfile={(id) => {
                        const profile = profiles.find(p => p.id === id || p.name === id);
                        if(profile) onNavigate('vipProfilePage', profile);
                    }}
                    onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
                    onNavigateToStandards={(sub, clauseId) => {
                        onNavigate('standards', { sub, clauseId });
                    }}
                />;
    case 'corporatePositionStatement':
        return <CorporatePositionStatement onBack={onBack} onNavigateToGdpr={() => onNavigate('gdprPolicy')} />;
    case 'nexusHumanistAiGovernance':
        return <NexusHumanistAiGovernancePage 
            onBack={onBack} 
            onNavigateToGdpr={() => onNavigate('gdprPolicy')}
            onNavigateToCorporatePositionStatement={() => onNavigate('corporatePositionStatement')}
            onNavigateToAiReadinessMatrix={() => onNavigate('aiReadinessMatrix')}
        />;
    case 'gdprPolicy':
        return <GdprPolicyPage onBack={onBack} />;
    case 'cidaMethodology':
        return <CidaMethodologyPage onBack={onBack} />;
    case 'fakeNewsArchive':
        return <FakeNewsArchivePage 
            caseStudies={fakeNewsCaseStudies} 
            onNavigateToCaseStudy={(cs) => onNavigate('fakeNewsAnalysis', cs)} 
            onBack={onBack}
            onNavigateToAnalysisMethodology={() => onNavigate('analysisMethodology')}
            onNavigateToMaragonFramework={() => onNavigate('maragonFramework')}
            onNavigateToHermeneuticFramework={() => onNavigate('hermeneuticFramework')}
        />;
    case 'openLetterShkreliBeci':
        // Find article data to pass
        return <OpenLetterShkreliBeci onBack={onBack} article={{id: 0, title: 'Letër e hapur...', author: 'Dr Alban Gj. THIKA', publishedDate: '', imageUrl: '', content: ''}} />;
    case 'newsFeatureShkreliBeci':
        return <NewsFeatureShkreliBeci onBack={onBack} />;
     case 'buletinDhomaTregtise':
        return <BuletinDhomaTregtise onBack={onBack} title="Buletin" description="Analizë e thirrjes së Dhomës së Tregtisë" />;
    case 'newsletterSubscription':
        return <NewsletterSubscriptionPage onBack={onBack} onSubscriptionSuccess={() => onNavigate('newsletterWelcome')} />;
    case 'newsletterWelcome':
        return <NewsletterWelcome onBack={onBack} />;
    case 'newsletter':
        return <NewsletterData />;
    case 'tvPersonalitiesAnalysis':
        return <TvPersonalitiesAnalysisPage profiles={profiles} onBack={onBack} onProfileSelect={(page, id) => onNavigate(page, id)} />;
     case 'hermeneuticFramework':
        return <HermeneuticFrameworkPage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'deconstructNews':
        return <DeconstructNewsPage onBack={onBack} />;
    case 'novaricCodeOfStandards':
    case 'standards':
        return <NovaricCodeOfStandardsPage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
            onNavigateToMethodology={() => onNavigate('analysisMethodology')}
        />;
     case 'buletinCorruptionAnalysis':
        return <BuletinCorruptionAnalysisPage
            onBack={onBack}
            onNavigateToMethodology={() => onNavigate('buletinMethodology')}
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToJudiciary={() => onNavigate('judiciaryPage')}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
            title="Buletin: Analiza e Korrupsionit"
            description="Një analizë e thelluar mbi korrupsionin dhe shantazhin në mjedisin e biznesit në Shqipëri."
        />;
    case 'buletinMethodology':
        return <BuletinMethodologyPage onBack={onBack} />;
    case 'noraAiProfile':
        return <NoraAiProfilePage onBack={onBack} />;
     case 'articleMetricsExplained':
        return <ArticleMetricsExplainedPage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToHermeneuticFramework={() => onNavigate('hermeneuticFramework')}
        />;
    case 'factCheckForm':
        return <FactCheckFormPage onBack={onBack} />;
    case 'paragonMethodologyPage':
        return <ParagonMethodologyPage onBack={onBack} onNavigateToVisualization={() => onNavigate('paragonVisualizationPage')} />;
    case 'paragonVisualizationPage':
        return <ParagonVisualizationPage onBack={onBack} onNavigateToParagonNetworkMap={() => onNavigate('paragonNetworkMap')} />;
    case 'paragonNetworkMap':
        return <ParagonNetworkMapPage onBack={onBack} />;
    case 'novaricMediaHouse':
        return <NovaricMediaHousePage onBack={onBack} />;
    case 'maragonFramework':
        return <MaragonFrameworkPage
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'acppaMethodology':
        return <AcppaMethodologyPage
            onBack={onBack}
            onNavigateToVisualization={() => onNavigate('paragonVisualizationPage')}
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'politicalProfileFramework':
        return <PoliticalProfileFrameworkPage
            onBack={onBack}
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'pvafInstitutionalPerformance':
        return <PvafInstitutionalPerformancePage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'buletinBeShqiperi':
        return <BuletinBEEPage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
            title="Buletin: BE-Shqipëri"
            description="Një analizë e thelluar e marrëdhënieve BE-Shqipëri."
        />;
    case 'paragonMethodologyUnified':
        return <ParagonMethodologyUnifiedPage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
            onNavigateToParagonConceptKapsh={() => onNavigate('paragonConceptKapsh')}
            onNavigateToParagonConceptBehavioral={() => onNavigate('paragonConceptBehavioral')}
            onNavigateToParagonConceptCompetency={() => onNavigate('paragonConceptCompetency')}
            onNavigateToParagonConceptFeedback={() => onNavigate('paragonConceptFeedback')}
        />;
    case 'politicalEthicsComparison':
        return <PoliticalEthicsComparisonPage
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
     case 'bibliografiaEZgjeruar':
        return <BibliografiaEZgjeruarPage
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'powerNetworkAnalysis':
         return <PowerNetworkAnalysisPage
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'politicalIntegrityProfile':
        return <PoliticalIntegrityProfilePage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
     case 'europeanEthicsStructures':
        return <EuropeanEthicsStructuresPage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'agib':
        return <AgibPage
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'paragonConceptKapsh':
        return <ParagonConceptKapshPage
             onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'paragonConceptBehavioral':
        return <ParagonConceptBehavioralPage
             onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'paragonConceptCompetency':
        return <ParagonConceptCompetencyPage
             onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'paragonConceptFeedback':
        return <ParagonConceptMultiSourceFeedbackPage
             onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'paragonConceptEngine':
        return <ParagonConceptAssessmentEnginePage onBack={onBack} onNavigateToResult={(result) => onNavigate('paragonResultPage', result)} />;
    case 'politicalProfile':
        const thikaProfile = profiles.find(p => p.id === 'vip33');
        if (!thikaProfile) return <div>Missing profile data for Dr. Thika.</div>;
        const analysis = runAnalysisForVip(thikaProfile);
        return <PoliticianProfilePage profile={thikaProfile} analysis={analysis} onBack={onBack} />;
    case 'contentQualityAssurance':
        return <ContentQualityAssurancePage 
            onBack={onBack}
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'jurisprudencePage':
        return <JurisprudencePage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'judicialPerformancePage':
        return <JudicialPerformancePage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'judicialPhilosophyPage':
        return <JudicialPhilosophyPage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'judicialEthicsPage':
        return <JudicialEthicsPage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'judicialProfileMethodologyPage':
        return <JudicialProfileMethodologyPage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'judicialEcosystemAnalysisMethodologyPage':
        return <JudicialEcosystemAnalysisMethodologyPage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'bibliografiaJurisprudences':
        return <BibliografiaJurisprudencesPage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'mediaEducationFramework':
        return <MediaEducationFrameworkPage 
            onBack={onBack} 
            onNavigateToNovaricCodeOfStandards={() => onNavigate('novaricCodeOfStandards')}
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
            onNavigateToAnalysisMethodology={() => onNavigate('analysisMethodology')}
            onNavigateToMaragonFramework={() => onNavigate('maragonFramework')}
            onNavigateToNewsList={() => onNavigate('newsList')}
        />;
    case 'mediaEducationBibliography':
        return <MediaEducationBibliographyPage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'zodiacInfoPage':
        return <ZodiacInfoPage onBack={onBack} />;
    case 'politiciansPage':
        return <PoliticiansPage
            profiles={profiles}
            onBack={onBack}
            onNavigate={onNavigate}
        />;
    case 'mediaPersonalitiesPage':
        return <MediaPersonalitiesPage
            profiles={profiles}
            onBack={onBack}
            onNavigateToProfilePage={(profile) => onNavigate('vipProfilePage', profile)}
            onNavigateToPoliticians={() => onNavigate('politiciansPage')}
            onNavigateToJudiciary={() => onNavigate('judiciaryPage')}
            onNavigateToBusiness={() => onNavigate('businessPage')}
            onNavigateToMaragonFramework={() => onNavigate('maragonFramework')}
            onNavigateToAnalysis={(id) => onNavigate('tvPersonalitiesAnalysis', id)}
        />;
    case 'judiciaryPage':
        return <JudiciaryPage
            profiles={profiles}
            onBack={onBack}
            onNavigateToPoliticians={() => onNavigate('politiciansPage')}
            onNavigateToBusiness={() => onNavigate('businessPage')}
            onNavigateToProfilePage={(profile) => onNavigate('vipProfilePage', profile)}
        />;
    case 'businessPage':
        return <BusinessPage
            profiles={profiles}
            onBack={onBack}
            onNavigateToPoliticians={() => onNavigate('politiciansPage')}
            onNavigateToJudiciary={() => onNavigate('judiciaryPage')}
            onNavigateToProfilePage={(profile) => onNavigate('vipProfilePage', profile)}
        />;
    case 'albanianMediaBenchmark':
        return <AlbanianMediaBenchmarkPage
            onBack={onBack}
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'novaricJournalManifesto':
        return <NovaricJournalManifestoPage onBack={onBack} onNavigateToJasminaLumanajProfile={onNavigateToJasminaLumanajProfile} />;
    case 'jasminaLumanajProfile':
        return <JasminaLumanajProfilePage onBack={onBack} />;
    case 'pressConferences':
        return <PressConferencesPage onBack={onBack} onNavigateToPressReleaseNovaricVisa={onNavigateToPressReleaseNovaricVisa} />;
    case 'pressReleaseNovaricVisa':
        return <PressReleaseNovaricVisaPage onBack={onBack} />;
    case 'europeanCommission':
        return <EuropeanCommissionPage onBack={onBack} />;
    case 'euCodeOfConduct':
        return <EuCodeOfConductPage onBack={onBack} />;
    case 'euReferencesArchive':
        return <EuReferencesArchivePage onBack={onBack} />;
    case 'ethicalResonance':
        return <EthicalResonancePage 
            onBack={onBack} 
            onNavigateToNoraAiProfile={() => onNavigate('noraAiProfile')}
            onNavigateToVipProfile={(id) => {
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'shkoderSocialPage':
        return <ShkoderSocialPage onBack={onBack} />;
    case 'shkoderEconomyPage':
        return <ShkoderEconomyPage onBack={onBack} />;
    case 'shkoderPoliticsPage':
        return <ShkoderPoliticsPage profiles={profiles} onBack={onBack} onNavigateToProfilePage={(p) => onNavigate('vipProfilePage', p)} />;
    case 'shkoderShockTherapy':
        return <ShkoderShockTherapyArticle 
            onBack={onBack}
            onNavigateToVipProfile={(id) => {
                if (id === 'noraAiProfile') {
                    onNavigate('noraAiProfile');
                    return;
                }
                const profile = profiles.find(p => p.id === id);
                if(profile) onNavigate('vipProfilePage', profile);
            }}
            onNavigateToArticleMetricsExplained={() => onNavigate('articleMetricsExplained')}
        />;
    case 'whitepaperVisualizationPage':
        return <WhitepaperVisualizationPage onBack={onBack} />;
    case 'aiReadinessMatrix':
        return <AiReadinessMatrixPage onBack={onBack} />;
    default:
      return (
        <div className="container mx-auto p-8">
          <h2 className="text-2xl font-bold">Page Not Found</h2>
          <p>The page "{page}" does not exist.</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded">
            Go Back Home
          </button>
        </div>
      );
  }
};

export default SimplePage;