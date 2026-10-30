import React from 'react';
import { JsonLd } from './JsonLd';
import { MethodologyPage } from './methodology/MethodologyPage';

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
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Metodologjia & Korniza e Përgjegjësisë: Sinergjia Hermeneutike mes Njeriut dhe Makinerisë",
    "author": {
      "@type": "Person",
      "name": "Dr Alban Gj. THIKA"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NOVARIC®",
      "logo": {
        "@type": "ImageObject",
        "url": "https://novaricstorage.blob.core.windows.net/media/NOVARIC-Logos_Master-W+B-R_12062025_150x150.png"
      }
    },
    "datePublished": "2025-09-01T22:00:00+02:00",
    "dateModified": "2026-09-12T10:00:00+02:00",
    "description": "Një shpjegim i thelluar i metodologjisë hibride të NOVARIC® për verifikimin e fakteve, e cila integron fuqinë e IA-së me mbikëqyrjen kritike njerëzore, në përputhje me standardet evropiane si DSA dhe EMFA për të luftuar dezinformimin.",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://media.novaric.al/?page=analysisMethodology"
    },
    "keywords": "Metodologji Verifikimi, Akti i Shërbimeve Dixhitale, DSA, EMFA, IA dhe Gazetaria, Analizë Hibride, Përgjegjësi Mediatike, Dezinformim Shqipëri, Mbikëqyrje Njerëzore, Etika Dixhitale"
  };

  return (
    <div className="w-full">
      <JsonLd data={jsonLdData} />
      <MethodologyPage
        onBack={onBack}
        onNavigateToStandards={onNavigateToStandards}
        onNavigateToNoraAiProfile={onNavigateToNoraAiProfile}
        onNavigateToVipProfile={(name) => onNavigateToVipProfile(name)}
      />
    </div>
  );
};
