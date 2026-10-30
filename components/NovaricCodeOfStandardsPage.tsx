import React from 'react';
import { StandardsHubPage } from './standards/StandardsHubPage';

interface NovaricCodeOfStandardsPageProps {
  onBack?: () => void;
  onNavigateToNoraAiProfile?: () => void;
  onNavigateToVipProfile?: (id: string | number) => void;
  onNavigateToArticleMetricsExplained?: () => void;
  onNavigateToMethodology?: () => void;
}

export const NovaricCodeOfStandardsPage: React.FC<NovaricCodeOfStandardsPageProps> = (props) => {
  return <StandardsHubPage {...props} />;
};

export default NovaricCodeOfStandardsPage;
