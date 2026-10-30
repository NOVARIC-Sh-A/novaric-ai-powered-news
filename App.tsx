import React, { useState, useCallback, useEffect, Suspense, lazy, ComponentType } from 'react';
import {
  Header,
  Footer,
  ResultsDisplay,
  NewsTicker,
  MobileNav,
  LoadingSpinner,
  FloatingShareButton,
  MainInputDock,
} from './components/index';
import { ParagonHeader } from './components/ParagonHeader';
import {
  isFactCheckEngineMisconfigured,
} from './services/factCheckEngine';
import {
  BreakingNewsArticle,
  Page,
  VipProfile,
  ArticleData,
  AcademicJournalData,
  FakeNewsCaseStudy,
  ParliamentDistrict,
  FactCheckResult,
  FullProfileAnalysis,
  TvShowData,
  MaragonFullReport,
} from './types';
import { fetchMaragonReport } from './services/dataService';
import { LiveUpdateToast } from './components/LiveUpdateToast';
import { FloatingHomeButton } from './components/FloatingHomeButton';
import { useSeo } from './hooks/useSeo';
import { stripHighlights } from './utils/textUtils';
import { CANONICAL_URL } from './config/constants';
import { JsonLd } from './components/JsonLd';
import { UrlShortenerModal } from './components/UrlShortenerModal';
import { IntegrityReportDisplay } from './components/IntegrityReportDisplay';

// MOCK DATA
import { mockTvShows } from './data/mockTvShows';
import { mockArticles } from './data/mockArticles';
import { mockAcademicJournals } from './data/mockAcademicJournals';
import { fakeNewsCaseStudies } from './data/mockFakeNews';
import { parliament2025Data } from './data/mockParliamentData';
import {
  mediaProfilesData,
} from './data/mediaProfiles';
import {
  businessProfilesData,
} from './data/businessProfiles';
import { mockJudiciaryProfilesData } from './data/mockJudiciaryProfiles';

import { fetchBreakingNews } from './services/newsService';
import { fetchAllProfiles, fetchPoliticianCards } from './services/apiService';
import { LanguageProvider } from './contexts/LanguageContext';

// LAZY LOADED COMPONENTS - Added explicit casting to resolve IntrinsicAttributes prop errors
const ChatBot = lazy(() => import('./components/ChatBot').then(m => ({ default: m.ChatBot as ComponentType<any> })));
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage as ComponentType<any> })));
const SimplePage = lazy(() => import('./pages/SimplePage') as Promise<{ default: ComponentType<any> }>);
const AnalyticProfilePage = lazy(() => import('./pages/AnalyticProfilePage').then(m => ({ default: m.AnalyticProfilePage as ComponentType<any> })));
const VipProfilePageWrapper = lazy(() => import('./pages/VipProfilePageWrapper').then(m => ({ default: m.VipProfilePageWrapper as ComponentType<any> })));
const ParagonLeaderboardPage = lazy(() => import('./pages/ParagonLeaderboardPage').then(m => ({ default: m.ParagonLeaderboardPage as ComponentType<any> })));
const ParagonDashboard = lazy(() => import('./pages/ParagonDashboard').then(m => ({ default: m.ParagonDashboard as ComponentType<any> })));
const NewsListPage = lazy(() => import('./components/NewsListPage').then(m => ({ default: m.NewsListPage as ComponentType<any> })));
const MaragonReportPage = lazy(() => import('./components/MaragonReportPage').then(m => ({ default: m.MaragonReportPage as ComponentType<any> })));
const WhitepaperVisualizationPage = lazy(() => import('./components/WhitepaperVisualizationPage').then(m => ({ default: m.WhitepaperVisualizationPage as ComponentType<any> })));
const AiReadinessMatrixPage = lazy(() => import('./components/AiReadinessMatrixPage').then(m => ({ default: m.AiReadinessMatrixPage as ComponentType<any> })));
const PoliticiansPage = lazy(() => import('./components/PoliticiansPage').then(m => ({ default: m.PoliticiansPage as ComponentType<any> })));
const AuthorProfilePage = lazy(() => import('./components/DrAlbanProfilePage').then(m => ({ default: m.AuthorProfilePage as ComponentType<any> })));

interface AppData {
  profiles: VipProfile[];
  news: BreakingNewsArticle[];
  tvShows: TvShowData[];
  articles: ArticleData[];
  academicJournals: AcademicJournalData[];
  parliament2025: ParliamentDistrict[];
  fakeNewsCaseStudies: FakeNewsCaseStudy[];
}

export const App: React.FC = () => {
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [factCheckResult, setFactCheckResult] = useState<FactCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('main');
  const [selectedNewsItem, setSelectedNewsItem] = useState<BreakingNewsArticle | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [selectedJournal, setSelectedJournal] = useState<AcademicJournalData | null>(null);
  const [selectedTvShow, setSelectedTvShow] = useState<TvShowData | null>(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<FakeNewsCaseStudy | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedVipProfileForPage, setSelectedVipProfileForPage] =
    useState<VipProfile | null>(null);
  const [paragonAnalysisResult, setParagonAnalysisResult] =
    useState<FullProfileAnalysis | null>(null);

  // MARAGON State
  const [maragonAnalysisResult, setMaragonAnalysisResult] =
    useState<MaragonFullReport | null>(null);
  const [maragonReportEntity, setMaragonReportEntity] =
    useState<{ id: string | number; type: 'individual' | 'tvShow' } | null>(null);
  const [isMaragonReportLoading, setIsMaragonReportLoading] = useState<boolean>(false);

  const [appData, setAppData] = useState<AppData | null>(null);
  const [politicianCards, setPoliticianCards] = useState<VipProfile[]>([]);
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState(CANONICAL_URL);
  const [isUrlShortenerOpen, setIsUrlShortenerOpen] = useState(false);
  const isMisconfigured = isFactCheckEngineMisconfigured();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentPage === 'mediaPersonalitiesPage' || currentPage === 'politiciansPage') {
      document.body.classList.add('media-personalities-bg');
    } else {
      document.body.classList.remove('media-personalities-bg');
    }
    return () => {
      document.body.classList.remove('media-personalities-bg');
    };
  }, [currentPage]);

  const [seoTitle, setSeoTitle] = useState('NOVARIC® Lajme me IA | Shqipëri');
  const [seoDescription, setSeoDescription] = useState(
    'Në një realitet ku etika dhe morali janë zbehur, ndërsa korrupsioni, paaftësia dhe manipulimi tolerohen, NOVARIC® AI-Powered News Fact Check lind si një nevojë urgjente për ndërgjegjësim qytetar dhe institucional.'
  );
  const [seoImageUrl, setSeoImageUrl] = useState<string | undefined>(undefined);

  useSeo(seoTitle, seoDescription, seoImageUrl, currentUrl);

  const updateUrl = (page: Page, id?: string | number | object, replace = false) => {
    if (window.location.protocol === 'blob:') {
      console.warn(
        'Running in a sandboxed environment. URL history manipulation is disabled.'
      );
      setCurrentUrl(CANONICAL_URL);
      return;
    }

    const params = new URLSearchParams();
    let newPath = '/';

    if (page !== 'main' || id) {
      params.set('page', page);
      if (id && (typeof id === 'string' || typeof id === 'number')) {
        params.set('id', id.toString());
      }
      newPath = `?${params.toString()}`;
    }

    const state = {
      page,
      id: typeof id === 'string' || typeof id === 'number' ? id : undefined,
    };

    if (replace) {
      window.history.replaceState(state, '', newPath);
    } else {
      window.history.pushState(state, '', newPath);
    }
    setCurrentUrl(`${CANONICAL_URL}${newPath === '/' ? '' : newPath}`);
  };

  useEffect(() => {
    let pageTitle = 'NOVARIC® Lajme me IA | Shqipëri';
    let pageDescription =
      'Në një realitet ku etika dhe morali janë zbehur, ndërsa korrupsioni, paaftësia dhe manipulimi tolerohen, NOVARIC® AI-Powered News Fact Check lind si një nevojë urgjente për ndërgjegjësim qytetar dhe institucional.';
    let pageImageUrl: string | undefined = undefined;

    switch (currentPage) {
      case 'newsArticle':
        if (selectedNewsItem) {
          pageTitle = `${selectedNewsItem.title} | NOVARIC®`;
          pageDescription =
            stripHighlights(selectedNewsItem.content).substring(0, 155) + '...';
          pageImageUrl = selectedNewsItem.imageUrl;
        }
        break;
      case 'articlePage':
      case 'openLetterShkreliBeci':
      case 'newsFeatureShkreliBeci':
        if (selectedArticle) {
          pageTitle = `${selectedArticle.title} | NOVARIC®`;
          pageDescription = selectedArticle.content.substring(0, 155) + '...';
          pageImageUrl = selectedArticle.imageUrl;
        }
        break;
      case 'corporatePositionStatement':
        pageTitle = 'Official Corporate Position Statement | NOVARIC® Group';
        pageDescription = 'Official corporate statement of NOVARIC® Group regarding operational timeline, compliance, and governance.';
        break;
      case 'nexusHumanistAiGovernance':
        pageTitle = 'NOVARIC® Nexus Humanist AI Code of Conduct & Operations Governance | N-DOC-10010-092026';
        pageDescription = 'Authoritative operational governance standard for artificial intelligence systems, LLMs, and autonomous agents (OpenClaw) under EU AI Act Regulation (EU) 2024/1689 and GDPR.';
        break;
      case 'trademarkCertificate':
        pageTitle = 'Regjistrimet Ligjore & Certifikata Zyrtare | NOVARIC®';
        pageDescription = 'Dokumentacioni zyrtar i regjistrimit të medias në Bashkimin Evropian (Office of the Press Registrar, OPM PRESS 03/2025) dhe certifikata e markës tregtare EUIPO.';
        break;
      case 'standards':
      case 'novaricCodeOfStandards':
        pageTitle = 'Kodi i Standardeve NOVARIC® | Qendra e Transparencës & Integritetit';
        pageDescription = 'Qendra e Transparencës dhe Integritetit: 31 klauzola operacionale, vula e gjallë e përputhshmërisë 98.40%, gjurmueshmëria e integritetit dhe regjistri i korrigjimeve.';
        break;
      case 'authorProfile':
      case 'profiliIAutorit':
        pageTitle = 'Profili i Autorit | Dr Alban Gj. THIKA — Individual Representation & Social Media Disclaimer';
        pageDescription = 'INDIVIDUAL AUTHOR REPRESENTATION, FREEDOM OF EXPRESSION & SOCIAL MEDIA DISCLAIMER. Document ID: NVR-MEDIA-LEG-001. Author: Dr Alban Gj. THIKA (Maltese Citizen).';
        pageImageUrl = 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png';
        break;
      default:
        break;
    }
    setSeoTitle(pageTitle);
    setSeoDescription(pageDescription);
    setSeoImageUrl(pageImageUrl);
  }, [
    currentPage,
    selectedNewsItem,
    selectedArticle,
    selectedTvShow,
    factCheckResult,
    selectedJournal,
    selectedVipProfileForPage,
    newsCategoryFilter,
    selectedCaseStudy,
  ]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigateToMaragonReport = useCallback(
    async (entityId: string | number, entityType: 'individual' | 'tvShow', replace = false) => {
      setIsMaragonReportLoading(true);
      setMaragonAnalysisResult(null);
      setError(null);

      try {
        const report = await fetchMaragonReport(entityId, entityType);
        setMaragonAnalysisResult(report);
        setMaragonReportEntity({ id: entityId, type: entityType });
        setCurrentPage('maragonReportPage');
        updateUrl('maragonReportPage', `${entityType}:${entityId}`, replace);
      } catch (err) {
        console.error('Failed to load MARAGON Report:', err);
        setError('Nuk u mundësua ngarkimi i raportit të detajuar MARAGON.');
      } finally {
        setIsMaragonReportLoading(false);
        window.scrollTo(0, 0);
        closeMobileMenu();
      }
    },
    []
  );

  const loadInitialPageFromUrl = useCallback(
    (data: AppData) => {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      const params = new URLSearchParams(window.location.search);
      let page = params.get('page') as Page;
      const id = params.get('id');

      if (!page) {
        if (pathname.startsWith('/figurat-politike/')) {
          const polId = pathname.replace('/figurat-politike/', '').split('/')[0];
          if (polId) {
            const matched = data.profiles.find((p) => p.id.toString() === polId || p.numericId?.toString() === polId);
            if (matched) {
              setSelectedVipProfileForPage(matched);
            } else {
              setSelectedVipProfileForPage({
                id: polId,
                numericId: parseInt(polId, 10) || undefined,
                name: '',
                imageUrl: '',
                category: 'Politikë',
                shortBio: '',
                detailedBio: '',
              });
            }
            setCurrentPage('vipProfilePage');
            return;
          }
        } else if (pathname === '/figurat-politike' || pathname === '/figurat-politike/') {
          setCurrentPage('politiciansPage');
          return;
        } else if (pathname === '/profili-i-autorit' || pathname === '/profili-i-autorit/' || pathname === '/author-profile' || pathname === '/author-profile/') {
          setCurrentPage('authorProfile');
          return;
        }
      }

      if (page) {
        let found = false;
        switch (page) {
          case 'newsArticle': {
            const newsItem = data.news.find((n) => n.id.toString() === id);
            if (newsItem) {
                setSelectedNewsItem(newsItem);
                found = true;
            }
            break;
          }
          case 'articlePage':
          case 'openLetterShkreliBeci':
          case 'newsFeatureShkreliBeci': {
            const article = data.articles.find((a) => a.id.toString() === id);
            if (article) {
                if (article.featurePageId) {
                    page = article.featurePageId as Page;
                    found = true;
                    break;
                }
                setSelectedArticle(article);
                found = true;
            }
            break;
          }
          case 'academicJournalPage': {
            const journal = data.academicJournals.find((j) => j.id.toString() === id);
            if (journal) {
                setSelectedJournal(journal);
                found = true;
            }
            break;
          }
          case 'vipProfilePage': {
            // Profiles are lazy loaded, so we might not have them yet.
            // But we can check if it's a known static one first or just assume it will load.
            const vip = data.profiles.find((p) => p.id.toString() === id);
            if (vip) {
                setSelectedVipProfileForPage(vip);
                found = true;
            } else {
                // If not in AppData yet (lazy), we still transition and the detail page will fetch.
                found = true; 
            }
            break;
          }
          case 'tvShowPage': {
            const show = data.tvShows.find((s) => s.id.toString() === id);
            if (show) {
                setSelectedTvShow(show);
                found = true;
            }
            break;
          }
          case 'fakeNewsAnalysis': {
            const caseStudy = data.fakeNewsCaseStudies.find((c) => c.id === id);
            if (caseStudy) {
                setSelectedCaseStudy(caseStudy);
                found = true;
            }
            break;
          }
          case 'maragonReportPage': {
            if (id) {
              const [entityType, entityId] = id.split(':');
              if (
                (entityType === 'tvShow' || entityType === 'individual') &&
                entityId
              ) {
                navigateToMaragonReport(
                  entityId,
                  entityType as 'individual' | 'tvShow',
                  true
                );
                found = true;
              }
            }
            break;
          }
          default:
            found = true; // Non-detail pages are always "found"
            break;
        }

        if (found) {
            setCurrentPage(page);
            setCurrentUrl(`${CANONICAL_URL}${window.location.search}`);
        } else {
            // Fallback if data requested in URL isn't available
            console.warn(`Requested page ${page} with id ${id} not found in database. Reverting to home.`);
            setCurrentPage('main');
            updateUrl('main', undefined, true);
        }
      }
    },
    [navigateToMaragonReport]
  );

  const loadAppData = useCallback(async () => {
    setIsDataLoading(true);
    setError(null);

    let fetchedNews: BreakingNewsArticle[] = [];

    try {
      fetchedNews = await fetchBreakingNews();
    } catch (newsError) {
      console.warn('Failed to load news from backend.', newsError);
      fetchedNews = [];
    }

    if (!fetchedNews) {
      fetchedNews = [];
    }

    const data: AppData = {
      news: fetchedNews,
      profiles: [], 
      tvShows: mockTvShows,
      articles: mockArticles,
      academicJournals: mockAcademicJournals,
      parliament2025: parliament2025Data,
      fakeNewsCaseStudies: fakeNewsCaseStudies,
    };

    setAppData(data);
    setPoliticianCards([]);
    loadInitialPageFromUrl(data);
    setIsDataLoading(false);
  }, [loadInitialPageFromUrl]);

  useEffect(() => {
    loadAppData();
  }, [loadAppData]);

  const handleRefreshNews = useCallback(async () => {
    try {
      const refreshed = await fetchBreakingNews('all', true);
      if (refreshed && refreshed.length > 0) {
        setAppData(prev => prev ? { ...prev, news: refreshed } : prev);
      }
    } catch (err) {
      console.error('Failed to refresh news in App:', err);
    }
  }, []);

  const ensureProfilesLoaded = useCallback(async () => {
    if (!appData) return null;
    if (appData.profiles.length > 0) return appData.profiles;

    try {
      const liveProfiles = await fetchAllProfiles();
      const updatedProfiles = liveProfiles.length > 0 ? liveProfiles : [
        ...mediaProfilesData,
        ...businessProfilesData,
        ...mockJudiciaryProfilesData,
      ];
      
      setAppData(prev => prev ? { ...prev, profiles: updatedProfiles } : null);
      
      return updatedProfiles;
    } catch (e) {
      console.warn("Lazy load of profiles failed, using fallback.", e);
      const fallback = [
        ...mediaProfilesData,
        ...businessProfilesData,
        ...mockJudiciaryProfilesData,
      ];
      setAppData(prev => prev ? { ...prev, profiles: fallback } : null);
      return fallback;
    }
  }, [appData]);

  const ensurePoliticianCardsLoaded = useCallback(async () => {
    if (politicianCards.length > 0) return;

    try {
      const cards = await fetchPoliticianCards();
      if (cards && cards.length > 0) {
        setPoliticianCards(cards);
        return;
      }
    } catch (e) {
      console.warn("Dedicated politician cards fetch failed.", e);
    }

    if (appData && appData.profiles && appData.profiles.length > 0) {
      const fallback = appData.profiles.filter(p => 
        (p.category || "").toLowerCase().includes("politik")
      );
      setPoliticianCards(fallback);
    }
  }, [politicianCards, appData]);

  const handleCloseResults = () => {
    setFactCheckResult(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const navigateToMain = (replace = false) => {
    setCurrentPage('main');
    setSelectedNewsItem(null);
    setSelectedTvShow(null);
    setSelectedArticle(null);
    setSelectedJournal(null);
    setSelectedVipProfileForPage(null);
    setSelectedCaseStudy(null);
    setNewsCategoryFilter(null);
    setParagonAnalysisResult(null);
    setMaragonAnalysisResult(null);
    setMaragonReportEntity(null);
    updateUrl('main', undefined, replace);
    closeMobileMenu();
  };

  const navigateTo = async (page: Page, data?: string | number | object) => {
    const profilePages: Page[] = [
      'politiciansPage',
      'mediaPersonalitiesPage',
      'judiciaryPage',
      'businessPage',
      'vipProfilePage'
    ];

    let currentProfiles = appData?.profiles || [];
    if (profilePages.includes(page)) {
      const loaded = await ensureProfilesLoaded();
      if (loaded) currentProfiles = loaded;
    }

    if (page === 'politiciansPage') {
      await ensurePoliticianCardsLoaded();
    }

    if (page === 'vipProfilePage') {
      let profile: VipProfile | null = null;
      let profileId: string | number | undefined;

      if (typeof data === 'object' && data !== null && 'id' in data) {
        profile = data as VipProfile;
        profileId = profile.id as string | number;
      } else if (typeof data === 'string' || typeof data === 'number') {
        profileId = data;
        profile =
          currentProfiles.find((p) => p.id.toString() === data.toString()) ||
          null;
      }

      setSelectedVipProfileForPage(profile);
      setCurrentPage(page);
      updateUrl(page, profileId);
      window.scrollTo(0, 0);
      closeMobileMenu();
      return;
    }

    if (page === 'maragonReportPage' && typeof data === 'string') {
      const [entityType, entityId] = data.split(':');
      if (
        (entityType === 'tvShow' || entityType === 'individual') &&
        entityId
      ) {
        navigateToMaragonReport(
          entityId,
          entityType as 'individual' | 'tvShow'
        );
        return;
      }
    }

    setNewsCategoryFilter(null);
    
    const isSpecialPass = ['fakeNewsAnalysis', 'newsArticle', 'articlePage', 'academicJournalPage'].includes(page);
    if (!isSpecialPass) {
        setSelectedCaseStudy(null);
        setSelectedNewsItem(null);
        setSelectedTvShow(null);
        setSelectedArticle(null);
        setSelectedJournal(null);
        setParagonAnalysisResult(null);
    }

    if (page === 'fakeNewsAnalysis' && typeof data === 'object') {
        setSelectedCaseStudy(data as FakeNewsCaseStudy);
    } else if (page === 'newsArticle' && typeof data === 'object') {
        setSelectedNewsItem(data as BreakingNewsArticle);
    } else if (page === 'articlePage' && typeof data === 'object') {
        const art = data as ArticleData;
        if (art && art.featurePageId) {
            navigateTo(art.featurePageId as Page);
            return;
        }
        setSelectedArticle(art);
    } else if (page === 'academicJournalPage' && typeof data === 'object') {
        setSelectedJournal(data as AcademicJournalData);
    }

    setMaragonAnalysisResult(null);
    setMaragonReportEntity(null);
    setCurrentPage(page);
    updateUrl(page, (typeof data === 'string' || typeof data === 'number') ? data : undefined);
    window.scrollTo(0, 0);
    closeMobileMenu();
  };

  useEffect(() => {
    const handleCustomNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<Page | { page: Page; data?: any }>;
      if (customEvent.detail) {
        if (typeof customEvent.detail === 'string') {
          navigateTo(customEvent.detail as Page);
        } else if (typeof customEvent.detail === 'object' && customEvent.detail.page) {
          navigateTo(customEvent.detail.page, customEvent.detail.data);
        }
      }
    };
    window.addEventListener('app:navigate', handleCustomNavigate);
    return () => window.removeEventListener('app:navigate', handleCustomNavigate);
  }, []);

  const handleNavigateBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateToMain(true);
    }
  };

  const handleSearchAgain = () => {
    setFactCheckResult(null);
    setError(null);
  };

  const handleShare = () => {
    const shareData = {
      title: 'NOVARIC® Lajme me IA',
      text: 'Verifiko faktet dhe analizo lajmet me fuqinë e Inteligjencës Artificiale.',
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard
        .writeText(shareData.url)
        .then(() => {
          alert('Linku u kopjua në clipboard!');
        })
        .catch(console.error);
    }
  };

  const renderPageContent = () => {
    if (isDataLoading) return null;
    if (!appData) return <div className="text-center p-20 text-red-500">Dështoi ngarkimi i të dhënave.</div>;

    const simplePageNavigations = {
      onNavigate: navigateTo,
      profiles: appData.profiles,
      onNavigateToJasminaLumanajProfile: () => navigateTo('jasminaLumanajProfile'),
      onNavigateToPressReleaseNovaricVisa: () => navigateTo('pressReleaseNovaricVisa'),
      onNavigateToShkoderCulture: () => navigateTo('shkoderCulturePage'),
      onNavigateToShkoderShockTherapy: () => navigateTo('shkoderShockTherapy'),
      onNavigateToShkoderPolitics: () => navigateTo('shkoderPoliticsPage'),
      onNavigateToShkoderEconomy: () => navigateTo('shkoderEconomyPage'),
      onNavigateToShkoderSocial: () => navigateTo('shkoderSocialPage'),
    };

    switch (currentPage) {
      case 'main':
        return <HomePage 
            currentPage={currentPage}
            tvShows={appData.tvShows} 
            onNavigateToAnalysisMethodology={() => navigateTo('analysisMethodology')}
            onNavigateToTvShow={(show: any) => { setSelectedTvShow(show); navigateTo('tvShowPage', show.id); }}
            onNavigateToNewsCategory={(cat: any) => { setNewsCategoryFilter(cat); navigateTo('newsList'); }}
            onNavigateToMediaEducationFramework={() => navigateTo('mediaEducationFramework')}
            onNavigateToMediaEducationBibliography={() => navigateTo('mediaEducationBibliography')}
            onNavigateToOpenLetterShkreliBeci={() => navigateTo('openLetterShkreliBeci')}
            onNavigateToNewsFeatureShkreliBeci={() => navigateTo('newsFeatureShkreliBeci')}
            onNavigateToHermeneuticFramework={() => navigateTo('hermeneuticFramework')}
            onNavigateToNovaricCodeOfStandards={() => navigateTo('novaricCodeOfStandards')}
            onNavigateToMaragonFramework={() => navigateTo('maragonFramework')}
            onNavigateToPoliticians={() => navigateTo('politiciansPage')}
            onNavigateToMediaPersonalities={() => navigateTo('mediaPersonalitiesPage')}
            onNavigateToJudiciary={() => navigateTo('judiciaryPage')}
            onNavigateToBusiness={() => navigateTo('businessPage')}
            onNavigateToParliamentMembersPage={() => navigateTo('parliamentMembersPage')}
            onNavigateToNovaricJournalManifesto={() => navigateTo('novaricJournalManifesto')}
            onNavigateToBuletinDhomaTregtise={() => navigateTo('buletinDhomaTregtise')}
            onNavigateToBuletinCorruptionAnalysis={() => navigateTo('buletinCorruptionAnalysis')}
            onNavigateToBuletinBeShqiperi={() => navigateTo('buletinBeShqiperi')}
            onNavigateToParagonMethodologyPage={() => navigateTo('paragonMethodologyPage')}
            onNavigateToParagonVisualizationPage={() => navigateTo('paragonVisualizationPage')}
            onNavigateToParagonNetworkMap={() => navigateTo('paragonNetworkMap')}
            onNavigateToFakeNewsArchive={() => navigateTo('fakeNewsArchive')}
            onNavigateToDeconstructNews={() => navigateTo('deconstructNews')}
            onNavigateToAcppaMethodology={() => navigateTo('acppaMethodology')}
            onNavigateToPoliticalProfileFramework={() => navigateTo('politicalProfileFramework')}
            onNavigateToPvafInstitutionalPerformance={() => navigateTo('pvafInstitutionalPerformance')}
            onNavigateToParagonMethodologyUnified={() => navigateTo('paragonMethodologyUnified')}
            onNavigateToPoliticalEthicsComparison={() => navigateTo('politicalEthicsComparison')}
            onNavigateToBibliografiaEZgjeruar={() => navigateTo('bibliografiaEZgjeruar')}
            onNavigateToPowerNetworkAnalysis={() => navigateTo('powerNetworkAnalysis')}
            onNavigateToPoliticalIntegrityProfile={() => navigateTo('politicalIntegrityProfile')}
            onNavigateToEuropeanEthicsStructures={() => navigateTo('europeanEthicsStructures')}
            onNavigateToPoliticalProfile={() => navigateTo('politicalProfile')}
            onNavigateToArchetypesExplained={() => navigateTo('archetypesExplained')}
            onNavigateToAgib={() => navigateTo('agib')}
            onNavigateToParagonConceptKapsh={() => navigateTo('paragonConceptKapsh')}
            onNavigateToParagonConceptBehavioral={() => navigateTo('paragonConceptBehavioral')}
            onNavigateToParagonConceptCompetency={() => navigateTo('paragonConceptCompetency')}
            onNavigateToParagonConceptFeedback={() => navigateTo('paragonConceptFeedback')}
            onNavigateToParagonConceptEngine={() => navigateTo('paragonConceptEngine')}
            onNavigateToJurisprudence={() => navigateTo('jurisprudencePage')}
            onNavigateToJudicialPerformance={() => navigateTo('judicialPerformancePage')}
            onNavigateToJudicialPhilosophy={() => navigateTo('judicialPhilosophyPage')}
            onNavigateToJudicialEthics={() => navigateTo('judicialEthicsPage')}
            onNavigateToJudicialProfileMethodology={() => navigateTo('judicialProfileMethodologyPage')}
            onNavigateToJudicialEcosystemAnalysisMethodology={() => navigateTo('judicialEcosystemAnalysisMethodologyPage')}
            onNavigateToBibliografiaJurisprudences={() => navigateTo('bibliografiaJurisprudences')}
            onNavigateToZodiacInfoPage={() => navigateTo('zodiacInfoPage')}
            onNavigateToMaragonReport={navigateToMaragonReport}
            onNavigateToPressConferences={() => navigateTo('pressConferences')}
            onNavigateToPressReleaseNovaricVisa={() => navigateTo('pressReleaseNovaricVisa')}
            onNavigateToWhitepaperVisualization={() => navigateTo('whitepaperVisualizationPage')}
            onNavigateToAiReadinessMatrix={() => navigateTo('aiReadinessMatrix')}
            onNavigateToCorporatePositionStatement={() => navigateTo('corporatePositionStatement')}
            onNavigateToCidaMethodology={() => navigateTo('cidaMethodology')}
            onNavigateToReputationWarRoom={() => navigateTo('reputationWarRoom')}
            onNavigateToNexusAiGovernance={() => navigateTo('nexusHumanistAiGovernance')}
            onNavigateToNoraAiProfile={() => navigateTo('noraAiProfile')}
            onNavigateToAuthorProfile={() => navigateTo('authorProfile')}
            onNavigateToEuropeanCommission={() => navigateTo('europeanCommission')}
            onNavigateToEuCodeOfConduct={() => navigateTo('euCodeOfConduct')}
            onNavigateToEuReferencesArchive={() => navigateTo('euReferencesArchive')}
            onNavigateToShkoderCulture={() => navigateTo('shkoderCulturePage')}
            onNavigateToShkoderShockTherapy={() => navigateTo('shkoderShockTherapy')}
            onNavigateToShkoderPolitics={() => navigateTo('shkoderPoliticsPage')}
            onNavigateToShkoderEconomy={() => navigateTo('shkoderEconomyPage')}
            onNavigateToShkoderSocial={() => navigateTo('shkoderSocialPage')}
        />;

      case 'newsList':
        return <NewsListPage 
            news={appData?.news || []} 
            onNavigateToNewsArticle={(item: any) => { setSelectedNewsItem(item); navigateTo('newsArticle', item?.id); }}
            onBack={handleNavigateBack}
            categoryFilter={newsCategoryFilter || ''}
            onClearFilter={() => setNewsCategoryFilter(null)}
            onRefreshNews={handleRefreshNews}
            onNavigateToAnalysisMethodology={() => navigateTo('analysisMethodology')}
        />;

      case 'newsArticle':
      case 'articlePage':
      case 'academicJournalPage':
      case 'tvShowPage':
      case 'fakeNewsAnalysis':
      case 'paragonResultPage': {
        const itemMap = {
          newsArticle: selectedNewsItem,
          articlePage: selectedArticle,
          academicJournalPage: selectedJournal,
          tvShowPage: selectedTvShow,
          fakeNewsAnalysis: selectedCaseStudy,
          paragonResultPage: paragonAnalysisResult,
        };
        const analyticPageTypeMap = {
          newsArticle: 'newsArticle',
          articlePage: 'article',
          academicJournalPage: 'academicJournal',
          tvShowPage: 'tvShow',
          fakeNewsAnalysis: 'fakeNewsAnalysis',
          paragonResultPage: 'paragonResult',
        } as const;

        return <AnalyticProfilePage
            item={itemMap[currentPage as keyof typeof itemMap]}
            pageType={analyticPageTypeMap[currentPage as keyof typeof analyticPageTypeMap] as any}
            onBack={handleNavigateBack}
            profiles={appData.profiles}
            onNavigate={navigateTo as any}
            onNavigateToMaragonReport={navigateToMaragonReport}
        />;
      }

      case 'vipProfilePage':
        return <VipProfilePageWrapper
            profile={selectedVipProfileForPage || ''}
            onBack={handleNavigateBack}
            onNavigate={navigateTo as any}
            tvShows={appData.tvShows}
            onNavigateToZodiacInfoPage={() => navigateTo('zodiacInfoPage') as any}
            onNavigateToMaragonReport={navigateToMaragonReport as any}
        />;

      case 'politiciansPage':
          return <PoliticiansPage
              profiles={appData.profiles}
              politicianCards={politicianCards}
              onBack={handleNavigateBack}
              onNavigate={navigateTo as any}
          />;

      case 'whitepaperVisualizationPage':
        return <WhitepaperVisualizationPage onBack={handleNavigateBack} />;

      case 'aiReadinessMatrix':
        return <AiReadinessMatrixPage onBack={handleNavigateBack} />;

      case 'authorProfile':
      case 'profiliIAutorit':
        return <Suspense fallback={<LoadingSpinner />}><AuthorProfilePage onBack={handleNavigateBack} onNavigate={navigateTo} /></Suspense>;

      default:
        return <SimplePage
            page={currentPage}
            onBack={handleNavigateBack}
            {...simplePageNavigations}
            parliamentData={appData.parliament2025}
            profiles={appData.profiles}
        />;
    }
  };

  const allNavProps = {
    onNavigateToPoliticians: () => navigateTo('politiciansPage'),
    onNavigateToMediaPersonalities: () => navigateTo('mediaPersonalitiesPage'),
    onNavigateToJudiciary: () => navigateTo('judiciaryPage'),
    onNavigateToBusiness: () => navigateTo('businessPage'),
    onNavigateToNewsList: () => navigateTo('newsList'),
    onNavigateToArticlesList: () => navigateTo('articlesList'),
    onNavigateToAcademicJournalsList: () => navigateTo('academicJournalsList'),
    onNavigateToNovaricAcademy: () => navigateTo('novaricAcademy'),
    onNavigateToNovaricJournalManifesto: () => navigateTo('novaricJournalManifesto'),
    onNavigateToNovaricMediaHouse: () => navigateTo('novaricMediaHouse'),
    onNavigateToTvPersonalitiesAnalysis: () => navigateTo('tvPersonalitiesAnalysis'),
    onOpenUrlShortener: () => setIsUrlShortenerOpen(true),
    onNavigateToFactCheckForm: () => navigateTo('factCheckForm'),
    onNavigateToMaragonFramework: () => navigateTo('maragonFramework'),
    onNavigateToPoliticalProfileFramework: () => navigateTo('politicalProfileFramework'),
    onNavigateToPoliticalProfile: () => navigateTo('politicalProfile'),
    onNavigateToJurisprudence: () => navigateTo('jurisprudencePage'),
    onNavigateToJudicialPerformance: () => navigateTo('judicialPerformancePage'),
    onNavigateToJudicialPhilosophy: () => navigateTo('judicialPhilosophyPage'),
    onNavigateToJudicialEthics: () => navigateTo('judicialEthicsPage'),
    onNavigateToJudicialProfileMethodology: () => navigateTo('judicialProfileMethodologyPage'),
    onNavigateToJudicialEcosystemAnalysisMethodology: () => navigateTo('judicialEcosystemAnalysisMethodologyPage'),
    onNavigateToBibliografiaJurisprudences: () => navigateTo('bibliografiaJurisprudences'),
    onNavigateToMediaEducationBibliography: () => navigateTo('mediaEducationBibliography'),
    onNavigateToLeaderboard: () => navigateTo('paragonLeaderboard'),
    onNavigateToWhitepaperVisualization: () => navigateTo('whitepaperVisualizationPage'),
    onNavigateToAiReadinessMatrix: () => navigateTo('aiReadinessMatrix'),
    onNavigateToCorporatePositionStatement: () => navigateTo('corporatePositionStatement'),
    onNavigateToAcppaMethodology: () => navigateTo('acppaMethodology'),
    onNavigateToAnalysisMethodology: () => navigateTo('analysisMethodology'),
    onNavigateToMaragonReport: navigateToMaragonReport,
    onNavigateToZodiacInfoPage: () => navigateTo('zodiacInfoPage'),
    onNavigateToFakeNewsArchive: () => navigateTo('fakeNewsArchive'),
    onNavigateToMediaEducationFramework: () => navigateTo('mediaEducationFramework'),
    onNavigateToNewsFeatureShkreliBeci: () => navigateTo('newsFeatureShkreliBeci'),
    onNavigateToOpenLetterShkreliBeci: () => navigateTo('openLetterShkreliBeci'),
    onNavigateToHermeneuticFramework: () => navigateTo('hermeneuticFramework'),
    onNavigateToDeconstructNews: () => navigateTo('deconstructNews'),
    onNavigateToNovaricCodeOfStandards: () => navigateTo('novaricCodeOfStandards'),
    onNavigateToParliamentMembersPage: () => navigateTo('parliamentMembersPage'),
    onNavigateToBuletinDhomaTregtise: () => navigateTo('buletinDhomaTregtise'),
    onNavigateToBuletinCorruptionAnalysis: () => navigateTo('buletinCorruptionAnalysis'),
    onNavigateToBuletinBeShqiperi: () => navigateTo('buletinBeShqiperi'),
    onNavigateToAlbanianMediaBenchmark: () => navigateTo('albanianMediaBenchmark'),
    onNavigateToParagonMethodologyPage: () => navigateTo('paragonMethodologyPage'),
    onNavigateToParagonVisualizationPage: () => navigateTo('paragonVisualizationPage'),
    onNavigateToParagonNetworkMap: () => navigateTo('paragonNetworkMap'),
    onNavigateToPvafInstitutionalPerformance: () => navigateTo('pvafInstitutionalPerformance'),
    onNavigateToParagonMethodologyUnified: () => navigateTo('paragonMethodologyUnified'),
    onNavigateToPoliticalEthicsComparison: () => navigateTo('politicalEthicsComparison'),
    onNavigateToBibliografiaEZgjeruar: () => navigateTo('bibliografiaEZgjeruar'),
    onNavigateToPowerNetworkAnalysis: () => navigateTo('powerNetworkAnalysis'),
    onNavigateToPoliticalIntegrityProfile: () => navigateTo('politicalIntegrityProfile'),
    onNavigateToEuropeanEthicsStructures: () => navigateTo('europeanEthicsStructures'),
    onNavigateToAgib: () => navigateTo('agib'),
    onNavigateToArchetypesExplained: () => navigateTo('archetypesExplained'),
    onNavigateToParagonConceptKapsh: () => navigateTo('paragonConceptKapsh'),
    onNavigateToParagonConceptBehavioral: () => navigateTo('paragonConceptBehavioral'),
    onNavigateToParagonConceptCompetency: () => navigateTo('paragonConceptCompetency'),
    onNavigateToParagonConceptFeedback: () => navigateTo('paragonConceptFeedback'),
    onNavigateToParagonConceptEngine: () => navigateTo('paragonConceptEngine'),
    onNavigateToEuropeanCommission: () => navigateTo('europeanCommission'),
    onNavigateToEuCodeOfConduct: () => navigateTo('euCodeOfConduct'),
    onNavigateToEuReferencesArchive: () => navigateTo('euReferencesArchive'),
    onNavigateToCidaMethodology: () => navigateTo('cidaMethodology'),
    onNavigateToReputationWarRoom: () => navigateTo('reputationWarRoom'),
    onNavigateToNexusAiGovernance: () => navigateTo('nexusHumanistAiGovernance'),
    onNavigateToNoraAiProfile: () => navigateTo('noraAiProfile'),
    onNavigateToAuthorProfile: () => navigateTo('authorProfile'),
    onNavigateToShkoderCulture: () => navigateTo('shkoderCulturePage'),
    onNavigateToShkoderPolitics: () => navigateTo('shkoderPoliticsPage'),
    onNavigateToShkoderEconomy: () => navigateTo('shkoderEconomyPage'),
    onNavigateToShkoderSocial: () => navigateTo('shkoderSocialPage'),
    onNavigateToShkoderShockTherapy: () => navigateTo('shkoderShockTherapy'),
  };

  return (
    <LanguageProvider>
      <div id="app-wrapper" className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-[100] shadow-lg">
          <Header
            currentPage={currentPage}
            showSlogan={currentPage === 'main'}
            onToggleMobileMenu={toggleMobileMenu}
            isScrolled={isScrolled}
            {...allNavProps}
          />
          <ParagonHeader 
            onNavigateToNewsList={allNavProps.onNavigateToNewsList}
            onNavigateToPoliticians={allNavProps.onNavigateToPoliticians}
            onNavigateToMediaPersonalities={allNavProps.onNavigateToMediaPersonalities}
            onNavigateToLeaderboard={allNavProps.onNavigateToLeaderboard}
          />
        </div>
        <UrlShortenerModal isOpen={isUrlShortenerOpen} onClose={() => setIsUrlShortenerOpen(false)} />
        {appData && <LiveUpdateToast currentNews={appData.news} onRefresh={loadAppData} />}

        {isMobileMenuOpen && appData && (
          <MobileNav
            currentPage={currentPage}
            onClose={closeMobileMenu}
            onNavigateToTvShowPage={(show) => { setSelectedTvShow(show); navigateTo('tvShowPage', show.id); }}
            onNavigateToNewsCategory={(cat) => { setNewsCategoryFilter(cat); navigateTo('newsList'); }}
            tvShows={appData.tvShows}
            {...allNavProps}
          />
        )}

        {/* Replaced undefined showAuxiliaryWidgets with explicit state check. */}
        {currentPage === 'main' && appData && (
          <NewsTicker
            initialNews={appData.news}
            onNavigateToNewsArticle={(item) => { setSelectedNewsItem(item); navigateTo('newsArticle', item.id); }}
            onNavigateToNewsList={() => navigateTo('newsList')}
          />
        )}

        <div className="flex-grow main-content-area">
          <Suspense fallback={<div className="p-20"><LoadingSpinner /></div>}>
            {renderPageContent()}
          </Suspense>
        </div>

        {factCheckResult && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[70] flex items-center justify-center p-4 overflow-y-auto" onClick={handleCloseResults}>
            <div className="w-full max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
              <ResultsDisplay result={factCheckResult} onClose={handleCloseResults} />
            </div>
          </div>
        )}

        <div className="sticky bottom-0 z-[52]">
          <MainInputDock
            isMisconfigured={isMisconfigured}
            isVisible={currentPage === 'main' && !factCheckResult}
            isScrolled={isScrolled}
            error={error}
            setError={setError}
            onResult={setFactCheckResult}
            onSearchAgain={handleSearchAgain}
            onShare={handleShare}
            onNavigateToAnalysisMethodology={allNavProps.onNavigateToAnalysisMethodology}
          />
          <Footer
            onNavigateToPrivacy={() => navigateTo('privacy')}
            onNavigateToSocialMediaPolicy={() => navigateTo('socialMediaPolicy')}
            onNavigateToCopyrightPolicy={() => navigateTo('copyrightPolicy')}
            onNavigateToJournalisticEthicsManual={() => navigateTo('journalisticEthicsManual')}
            onNavigateToAboutUs={() => navigateTo('aboutUs')}
            onNavigateToDataSourceCoverage={() => navigateTo('dataSourceCoverage')}
            onNavigateToBrandGuidelines={() => navigateTo('brandGuidelines')}
            onNavigateToNewsletterWelcome={() => navigateTo('newsletterWelcome')}
            onNavigateToNewsletter={() => navigateTo('newsletter')}
            onNavigateToNewsletterSubscription={() => navigateTo('newsletterSubscription')}
            onNavigateToVipProfile={(id) => id === 'vip33' ? navigateTo('authorProfile') : navigateTo('vipProfilePage', id)}
            onNavigateToTrademark={() => navigateTo('trademarkCertificate')}
            onNavigateToSitemap={() => navigateTo('sitemap')}
            onOpenUrlShortener={() => setIsUrlShortenerOpen(true)}
            onNavigateToNovaricCodeOfStandards={() => navigateTo('novaricCodeOfStandards')}
            onNavigateToNoraAiProfile={() => navigateTo('noraAiProfile')}
            onNavigateToNovaricMediaHouse={() => navigateTo('novaricMediaHouse')}
            onNavigateToMaragonFramework={() => navigateTo('maragonFramework')}
            onNavigateToNovaricJournalManifesto={() => navigateTo('novaricJournalManifesto')}
            onNavigateToAuthorProfile={() => navigateTo('authorProfile')}
          />
        </div>

        <FloatingShareButton isVisible={currentPage !== 'main'} title={seoTitle} text={seoDescription} />
        {currentPage !== 'main' && <FloatingHomeButton onNavigateHome={navigateToMain} />}
        <Suspense fallback={null}><ChatBot /></Suspense>
      </div>
    </LanguageProvider>
  );
};