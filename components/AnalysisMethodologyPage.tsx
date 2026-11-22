import React from 'react';
import { JsonLd } from './JsonLd';
import { MethodologyPage } from './methodology/MethodologyPage';
import { useSeo } from '../hooks/useSeo';
import { DEFAULT_OG_IMAGE, METHODOLOGY_AUTHOR, METHODOLOGY_DESCRIPTION, METHODOLOGY_DOCUMENT_TITLE, methodologySeo } from '../utils/routeSeo';

interface AnalysisMethodologyPageProps {
  onBack: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
  onNavigateToStandards?: (sub?: string, clauseId?: string) => void;
}

export const AnalysisMethodologyPage: React.FC<AnalysisMethodologyPageProps> = ({
  onBack,
  onNavigateToNoraAiProfile,
  onNavigateToVipProfile,
  onNavigateToArticleMetricsExplained,
  onNavigateToStandards,
}) => {
  const seo = methodologySeo();
  useSeo(
    METHODOLOGY_DOCUMENT_TITLE,
    METHODOLOGY_DESCRIPTION,
    DEFAULT_OG_IMAGE,
    seo.url,
    'sq_AL',
    seo.imageAlt,
    'article',
    METHODOLOGY_AUTHOR,
  );
  const jsonLdData = seo.jsonLd;

  return (
    <div className="w-full">
      <JsonLd data={jsonLdData as object} />
      <MethodologyPage
        onBack={onBack}
        onNavigateToStandards={onNavigateToStandards}
        onNavigateToNoraAiProfile={onNavigateToNoraAiProfile}
        onNavigateToVipProfile={(name) => onNavigateToVipProfile(name)}
      />
    </div>
  );
};
