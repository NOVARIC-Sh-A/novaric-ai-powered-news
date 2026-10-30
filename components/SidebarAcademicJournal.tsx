import React from 'react';
import { AcademicJournalData } from '../types';
import { renderWithSuperscript } from '../utils/textUtils';

interface SidebarAcademicJournalProps {
  journal: AcademicJournalData;
  onNavigate: (item: AcademicJournalData) => void;
}

export const SidebarAcademicJournal: React.FC<SidebarAcademicJournalProps> = ({ journal, onNavigate }) => {
  return (
    <button
      onClick={() => onNavigate(journal)}
      className="block w-full bg-white dark:bg-slate-700/80 rounded-lg shadow-md hover:shadow-lg focus:shadow-lg transition-all duration-200 ease-in-out overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 group"
      aria-label={`Lexo revistën akademike: ${journal.title}`}
    >
      <div className="relative">
        <div className="w-full h-24 bg-black overflow-hidden">
             <video
                src="https://novaricstorage.blob.core.windows.net/media/AdobeStock_175181997.mov"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
            >
                Shfletuesi juaj nuk e mbështet etiketën e videos.
            </video>
        </div>
         <div className="absolute top-1 right-1 bg-academy-teal/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
            Revistë Akademike
         </div>
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-academy-teal dark:group-hover:text-academy-blue transition-colors">
          {journal.title}
        </h4>
        <p className="text-xs text-academy-teal dark:text-academy-blue mt-1 truncate">
            {renderWithSuperscript(journal.journalName)}
        </p>
      </div>
    </button>
  );
};
