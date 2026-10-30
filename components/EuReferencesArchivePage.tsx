import React from 'react';
import { BookOpenIcon } from './icons';

interface EuReferencesArchivePageProps {
  onBack: () => void;
}

export const EuReferencesArchivePage: React.FC<EuReferencesArchivePageProps> = ({ onBack }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-2xl text-center">
        <BookOpenIcon className="w-16 h-16 mx-auto text-primary-500 mb-4" />
        <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          Arkiva e Referencave të BE-së
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Ky seksion është në ndërtim e sipër. Së shpejti do të gjeni këtu një koleksion të kuruar të dokumenteve, raporteve dhe referencave kyçe nga institucionet e Bashkimit Evropian.
        </p>
        <div className="mt-8">
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