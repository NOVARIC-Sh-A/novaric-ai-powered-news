
import React from 'react';
import { AcademicJournalData } from '../types';
import { CalendarDaysIcon, AcademicCapIcon, GlobeAltIcon } from './icons';
import { renderWithSuperscript } from '../utils/textUtils';
import { formatVipName } from '../utils/paragonProfileUtils';

interface JournalCardProps {
  item: AcademicJournalData;
  onNavigate: (item: AcademicJournalData) => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({ item, onNavigate }) => {
  const { title, authors, publicationDate, imageUrl, journalName } = item;

  return (
    <article
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 font-sans"
    >
      <button 
        onClick={() => onNavigate(item)} 
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-primary-500 rounded-lg flex flex-col h-full"
        aria-label={`Lexo më shumë për: ${title}`}
      >
        <div className="overflow-hidden relative h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          {imageUrl ? (
             <img
                src={imageUrl}
                alt={`Imazh për: ${title}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
          ) : (
            <AcademicCapIcon className="w-16 h-16 text-slate-400 dark:text-slate-500" />
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-xs font-semibold text-academy-teal dark:text-academy-blue uppercase mb-1">
            {renderWithSuperscript(journalName)}
          </p>
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight group-hover:text-academy-teal dark:group-hover:text-academy-blue transition-colors line-clamp-3">{title}</h3>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-sans font-medium">
            Nga: {authors.map(name => formatVipName(name)).join(', ')}
          </p>

          <div className="flex-grow" />
          
          <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
            <a href={item.url} target="_blank" rel="noopener noreferrer" 
               onClick={(e) => e.stopPropagation()}
               className="flex items-center hover:text-academy-blue dark:hover:text-academy-blue hover:underline">
                <GlobeAltIcon className="w-4 h-4 mr-1.5" />
                <span>Lexo Publikimin</span>
            </a>
             <div className="flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                <span>{publicationDate}</span>
            </div>
          </div>
        </div>
      </button>
    </article>
  );
};