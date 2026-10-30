// -------------------------------
//  NOVARIC® AI-Powered News
//  dataService.ts — synchronized with Cloud Run backend
// -------------------------------

import { getApiEndpoint } from './apiConfig';

// LOCAL MOCK DATA IMPORTS
import { mediaProfilesData } from '../data/mediaProfiles';
import { businessProfilesData } from '../data/businessProfiles';
import { mockTvShows } from '../data/mockTvShows';
import { mockArticles } from '../data/mockArticles';
import { mockAcademicJournals } from '../data/mockAcademicJournals';
import { fakeNewsCaseStudies } from '../data/mockFakeNews';
import { mockJudiciaryProfilesData } from '../data/mockJudiciaryProfiles';
import { parliament2025Data } from '../data/mockParliamentData';

// TYPES
import {
  MaragonFullReport,
  VipProfile,
  BreakingNewsArticle,
  TvShowData,
  ArticleData,
  AcademicJournalData,
  ParliamentDistrict,
  FakeNewsCaseStudy,
} from '../types';

import { fetchBreakingNews } from './newsService';

// ---------------------------------------
// APP DATA INTERFACE
// ---------------------------------------
interface AppData {
  profiles: VipProfile[];
  news: BreakingNewsArticle[];
  tvShows: TvShowData[];
  articles: ArticleData[];
  academicJournals: AcademicJournalData[];
  parliament2025: ParliamentDistrict[];
  fakeNewsCaseStudies: FakeNewsCaseStudy[];
}

// ---------------------------------------
// MARAGON REPORT (MOCK IMPLEMENTATION)
// ---------------------------------------
export const fetchMaragonReport = async (
  entityId: string | number,
  entityType: 'individual' | 'tvShow'
): Promise<MaragonFullReport> => {
  console.log(`[MOCK] Fetching MARAGON report for ${entityType} ${entityId}`);

  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockReport: MaragonFullReport = {
    entityId: String(entityId),
    entityType: entityType,
    compositeScore: 82,
    Readiness: 88,
    Aptitude: 92,
    Governance: 78,
    OversightNurturing: 80,
    benchmarks: {
      peerAverage: {
        Readiness: 75,
        Aptitude: 80,
        Governance: 72,
        OversightNurturing: 77,
      },
      standardAdherence: {
        Readiness: 90,
        Aptitude: 90,
        Governance: 85,
        OversightNurturing: 88,
      },
    },
    indicatorDetails: {
      'R1.1': { score: 3, evidenceId: 'ev1' },
      'R1.2': { score: 2, evidenceId: 'ev2' },
      'A2.1': { score: 3, evidenceId: 'ev3' },
      'A2.2': { score: 2, evidenceId: 'ev4' },
      'G3.1': { score: 2, evidenceId: 'ev5' },
      'O4.1': { score: 3, evidenceId: 'ev6' },
    },
    explainabilityData: {},
  };

  return Promise.resolve(mockReport);
};

// ---------------------------------------
// MAIN APP DATA FETCHER
// ---------------------------------------
const getBackendProfilesUrl = () => getApiEndpoint('/profiles');

export const fetchAppData = async (): Promise<AppData> => {
  let liveProfiles: VipProfile[] = [];
  let newsFromBackend: BreakingNewsArticle[] = [];

  try {
    // Profiles from backend
    const response = await fetch(getBackendProfilesUrl());
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    liveProfiles = (await response.json()) as VipProfile[];
  } catch (error) {
    console.warn(
      'Backend unavailable for profiles in dataService — using local mock profiles.',
      error
    );
    liveProfiles = [
      ...mediaProfilesData,
      ...businessProfilesData,
      ...mockJudiciaryProfilesData,
    ];
  }

  try {
    newsFromBackend = await fetchBreakingNews();
    if (!newsFromBackend) {
      newsFromBackend = [];
    }
  } catch (e) {
    console.warn('Backend news fetch failed in dataService.', e);
    newsFromBackend = [];
  }

  return {
    news: newsFromBackend,
    profiles: liveProfiles,
    tvShows: mockTvShows,
    articles: mockArticles,
    academicJournals: mockAcademicJournals,
    parliament2025: parliament2025Data,
    fakeNewsCaseStudies: fakeNewsCaseStudies,
  };
};