
import React from 'react';
import { renderWithSuperscript } from '../utils/textUtils';
import { NewspaperIcon } from './icons';

interface PressConferencesPageProps {
  onBack: () => void;
  onNavigateToPressReleaseNovaricVisa: () => void;
}

const PressReleaseCard: React.FC<{ title: string; date: string; summary: string; onClick: () => void }> = ({ title, date, summary, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-white dark:bg-slate-800/80 rounded-lg shadow-md hover:shadow-lg focus:shadow-lg transition-all duration-200 ease-in-out overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 group"
  >
    <div className="p-6">
      <div className="flex items-center gap-4 mb-3">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full">
          <NewspaperIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary-700 dark:text-primary-400">NJOFTIM PËR SHTYP</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{date}</p>
        </div>
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {renderWithSuperscript(title)}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">
        {summary}
      </p>
      <span className="mt-4 inline-block font-semibold text-primary-600 dark:text-primary-400 group-hover:underline">
        Lexo të plotë &rarr;
      </span>
    </div>
  </button>
);

export const PressConferencesPage: React.FC<PressConferencesPageProps> = ({ onBack, onNavigateToPressReleaseNovaricVisa }) => {
  const pressReleases = [
    {
      id: 'novaric-visa-case',
      title: "“NUK KA BAZË LIGJORE”: NOVARIC® Sh.A. DORËZON PROVAT NË POLICI",
      date: "26 Nëntor, 2025",
      summary: "NOVARIC Sh.A. ka dorëzuar prova të pakundërshtueshme që shfuqizojnë akuzat e supozuara për “Mashtrim”, “Fshehje të Ardhurash” dhe “Pastrim Parash”. Aplikimi i vizës u miratua në fazën e parë dhe dështoi vetëm nga vendimi diskrecional i Autoritetit Shtetëror.",
      action: onNavigateToPressReleaseNovaricVisa,
    }
  ];

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4 text-primary-700 dark:text-primary-500">Arkiva e Konferencave për Shtyp</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Komunikime zyrtare dhe njoftime për shtyp nga NOVARIC® dhe aktorë të tjerë lokalë.
          </p>
        </header>

        <div className="space-y-6">
          {pressReleases.map(pr => (
            <PressReleaseCard
              key={pr.id}
              title={pr.title}
              date={pr.date}
              summary={pr.summary}
              onClick={pr.action}
            />
          ))}
          {pressReleases.length === 0 && (
             <p className="text-center text-slate-500 dark:text-slate-400 py-12">Nuk ka njoftime për shtyp për momentin.</p>
          )}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Kthehu Pas"
          >
            &larr; Kthehu Pas
          </button>
        </div>
      </div>
    </main>
  );
};
