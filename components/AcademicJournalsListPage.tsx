
import React, { useState, useMemo } from 'react';
import { AcademicJournalData } from '../types';
import { JournalCard } from './JournalCard';

interface AcademicJournalsListPageProps {
  journals: AcademicJournalData[];
  onNavigateToJournalPage: (item: AcademicJournalData) => void;
  onBack: () => void;
}

export const AcademicJournalsListPage: React.FC<AcademicJournalsListPageProps> = ({ journals, onNavigateToJournalPage, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'title'>('newest');

  const sortedAndFilteredJournals = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filtered = journals.filter(item => {
      return item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
             item.authors.some(a => a.toLowerCase().includes(lowerCaseSearchTerm)) ||
             item.journalName.toLowerCase().includes(lowerCaseSearchTerm);
    });
    
    return filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'sq');
      }
      // Default to newest
      // Assuming publicationDate can be parsed or compared directly if formatted correctly
      return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
    });
  }, [journals, searchTerm, sortBy]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 pb-2" style={{ textShadow: '2px 2px #006A6A, 4px 4px #1a1a1a' }}>NOVARIC<sup>®</sup> AI Academic Journal</h1>
            <p className="text-lg font-semibold text-white mt-2" style={{ textShadow: '1px 1px 2px #006A6A, 2px 2px #1a1a1a' }}>Eksploroni artikuj të dedikuar mbi Inteligjencën Artificiale dhe integrimin e saj në jetët tona.</p>
        </div>
        
        <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Kërko sipas titullit, autorit, ose revistës..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:flex-grow px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700"
          />
          <div className="flex items-center gap-2 w-full md:w-auto">
               <label htmlFor="sort-by-journal" className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-shrink-0">Rendit:</label>
               <select
                  id="sort-by-journal"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'title')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-slate-700"
               >
                  <option value="newest">Më të rejat</option>
                  <option value="title">Sipas Titullit (A-Z)</option>
               </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAndFilteredJournals.map(item => (
                <JournalCard key={item.id} item={item} onNavigate={onNavigateToJournalPage} />
            ))}
        </div>
        
        {sortedAndFilteredJournals.length === 0 && (
             <div className="text-center py-16 bg-white/10 backdrop-blur-sm rounded-lg mt-8">
                 <p className="text-xl text-white font-semibold">Nuk u gjet asnjë botim që përputhet me filtrat tuaj.</p>
             </div>
        )}
        
        <div className="mt-12 text-center">
            <button
                onClick={onBack}
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition"
                aria-label="Kthehu Pas"
            >
                &larr; Kthehu Pas
            </button>
        </div>
      </div>
    </main>
  );
};
