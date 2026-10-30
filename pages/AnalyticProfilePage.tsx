import React from 'react';
import { NewsArticlePage, ArticlePage, AcademicJournalPage, TvShowPage, FakeNewsAnalysisPage, ParagonResultPage } from '../components';
import { BreakingNewsArticle, ArticleData, AcademicJournalData, TvShowData, FakeNewsCaseStudy, FullProfileAnalysis, VipProfile } from '../types';

interface AnalyticProfilePageProps {
  item: any;
  pageType: 'newsArticle' | 'article' | 'academicJournal' | 'tvShow' | 'fakeNewsAnalysis' | 'paragonResult';
  onBack: () => void;
  profiles: VipProfile[];
  onNavigate: (page: string, data?: any) => void;
  onNavigateToMaragonReport?: (entityId: string | number, entityType: 'individual' | 'tvShow') => void;
}

export const AnalyticProfilePage: React.FC<AnalyticProfilePageProps> = ({ item, pageType, onBack, profiles, onNavigate, onNavigateToMaragonReport }) => {
  switch (pageType) {
    case 'newsArticle':
      return <NewsArticlePage newsItem={item as BreakingNewsArticle} onBack={onBack} />;
    case 'article':
      return <ArticlePage article={item as ArticleData} onBack={onBack} onNavigateToAuthorProfile={(authorName: string) => {
          const profile = profiles.find(p => p.name === authorName);
          if (profile) onNavigate('vipProfilePage', profile);
      }} />;
    case 'academicJournal':
      return <AcademicJournalPage journal={item as AcademicJournalData} onBack={onBack} />;
    case 'tvShow':
      return <TvShowPage tvShow={item as TvShowData} onBack={onBack} profiles={profiles} onNavigateToProfilePage={(profile) => onNavigate('vipProfilePage', profile)} onNavigateToMaragonReport={onNavigateToMaragonReport} />;
    case 'fakeNewsAnalysis':
      return <FakeNewsAnalysisPage caseStudy={item as FakeNewsCaseStudy} onBack={onBack} />;
    case 'paragonResult':
        return <ParagonResultPage analysis={item as FullProfileAnalysis} onBack={onBack} />;
    default:
      return (
        <div className="container mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p>Unknown page type: {pageType}</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded">
            Go Back
          </button>
        </div>
      );
  }
};