import React from 'react';
import { UsersIcon } from './icons';

interface CategoryNavigationProps {
  onBack: () => void;
  onNavigateToParliamentMembersPage: () => void;
  onNavigateToJudiciary: () => void;
  onNavigateToBusiness: () => void;
  onNavigateToOtherVips: () => void;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  onBack,
  onNavigateToParliamentMembersPage,
  onNavigateToJudiciary,
  onNavigateToBusiness,
  onNavigateToOtherVips,
}) => {
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-4">
      <button
        onClick={onBack}
        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition"
      >
        &larr; Kthehu Pas
      </button>
      <button
        onClick={onNavigateToParliamentMembersPage}
        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition flex items-center gap-2"
      >
        <UsersIcon className="w-5 h-5" /> Anëtarët e Parlamentit 2025
      </button>
      <button
        onClick={onNavigateToJudiciary}
        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition"
      >
        Sistemi Gjyqësor ⚖️
      </button>
      <button
        onClick={onNavigateToBusiness}
        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-md transition"
      >
        Bota e Biznesit 💼
      </button>
      <button
        onClick={onNavigateToOtherVips}
        className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-md transition"
      >
        Personalitete të Tjera &rarr;
      </button>
    </div>
  );
};
