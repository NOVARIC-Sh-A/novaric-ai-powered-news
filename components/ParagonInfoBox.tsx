import React from 'react';

interface ParagonInfoBoxProps {
  onNavigateToParagonMethodologyPage: () => void;
}

export const ParagonInfoBox: React.FC<ParagonInfoBoxProps> = ({ onNavigateToParagonMethodologyPage }) => {
  return (
    <div className="max-w-3xl mx-auto p-4 bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-500 rounded-r-lg text-left mb-10">
      <h2 className="font-semibold text-blue-800 dark:text-blue-200">Bazuar në Kornizën Analitike PARAGON®</h2>
      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
        Kjo faqe përdor kornizën PARAGON® për të vlerësuar në mënyrë objektive performancën e figurave politike. Ajo mat efektivitetin legjislativ, llogaridhënien, komunikimin dhe dimensione të tjera kyçe.
        <button onClick={onNavigateToParagonMethodologyPage} className="ml-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold">
          Mëso më shumë...
        </button>
      </p>
    </div>
  );
};
