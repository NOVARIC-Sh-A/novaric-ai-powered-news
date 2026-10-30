import React from 'react';

interface ContentQualityAssurancePageProps {
  onBack: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
}

export const ContentQualityAssurancePage: React.FC<ContentQualityAssurancePageProps> = ({ onBack }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
        <h1 className="text-3xl font-bold mb-4 text-center text-primary-700 dark:text-primary-500">Sigurimi i Cilësisë së Përmbajtjes</h1>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
          Kjo faqe është në ndërtim e sipër. Ajo do të shpjegojë metodologjinë e Sistemit të Sigurimit të Cilësisë së Përmbajtjes (CQA).
        </p>
        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Kthehu Pas"
          >
            Kthehu Pas
          </button>
        </div>
      </div>
    </main>
  );
};
