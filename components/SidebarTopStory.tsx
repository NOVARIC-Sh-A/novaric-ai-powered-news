


import React from 'react';
import { BreakingNewsArticle } from '../types';
import { renderWithSuperscript } from '../utils/textUtils';

interface SidebarTopStoryProps {
  newsItem: BreakingNewsArticle;
  onNavigate: (item: BreakingNewsArticle) => void;
}

export const SidebarTopStory: React.FC<SidebarTopStoryProps> = ({ newsItem, onNavigate }) => {
  const logoFallbackUrl = 'https://novaricstorage.blob.core.windows.net/media/NOVARIC-Logos_Master-W+B-R_12062025_150x150.png';

  return (
    <button
      onClick={() => onNavigate(newsItem)}
      className="block w-full bg-white dark:bg-slate-700/80 rounded-lg shadow-md hover:shadow-lg focus:shadow-lg transition-all duration-200 ease-in-out overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 group"
      aria-label={`Lexo lajmin e ditës: ${newsItem.title}`}
    >
      <div className="relative bg-slate-100 dark:bg-slate-600">
        <img 
          src={newsItem.imageUrl || logoFallbackUrl} 
          alt={newsItem.title} 
          className={`w-full h-24 ${newsItem.imageUrl ? 'object-cover' : 'object-contain p-4'}`}
        />
         <div className="absolute top-1 right-1 bg-primary-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
            Lajmi i Ditës
         </div>
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {newsItem.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{renderWithSuperscript(newsItem.sourceName)}</p>
      </div>
    </button>
  );
};
