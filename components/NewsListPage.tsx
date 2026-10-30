import React from 'react';
import { BreakingNewsArticle } from '../types';
import { NewsFeedPage } from './news/NewsFeedPage';

export interface NewsListPageProps {
  news?: BreakingNewsArticle[];
  onNavigateToNewsArticle: (item: BreakingNewsArticle) => void;
  onBack: () => void;
  categoryFilter: string | null;
  onClearFilter: () => void;
  onNavigateToAnalysisMethodology?: () => void;
  onRefreshNews?: () => Promise<void>;
}

/**
 * NewsListPage handles route `/?page=newsList` and delegates internally
 * to the two-section, operations-friendly NewsFeedPage (LatestNewsSection & ArchiveNewsSection).
 */
export const NewsListPage: React.FC<NewsListPageProps> = ({
  onNavigateToNewsArticle,
  onBack,
  categoryFilter,
  onClearFilter,
  onNavigateToAnalysisMethodology,
  onRefreshNews,
}) => {
  return (
    <NewsFeedPage
      onNavigateToNewsArticle={onNavigateToNewsArticle}
      onBack={onBack}
      categoryFilter={categoryFilter}
      onClearFilter={onClearFilter}
      onNavigateToAnalysisMethodology={onNavigateToAnalysisMethodology}
      onRefreshNews={onRefreshNews}
    />
  );
};
