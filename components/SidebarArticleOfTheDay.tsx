
import React from 'react';
import { ArticleData } from '../types';
import { renderWithSuperscript } from '../utils/textUtils';
import { formatVipName } from '../utils/paragonProfileUtils';

interface SidebarArticleOfTheDayProps {
  article: ArticleData;
  onNavigate: (item: ArticleData) => void;
  onNavigateToAuthorProfile: (authorName: string) => void;
}

export const SidebarArticleOfTheDay: React.FC<SidebarArticleOfTheDayProps> = ({ article, onNavigate, onNavigateToAuthorProfile }) => {
  const logoFallbackUrl = 'https://novaricstorage.blob.core.windows.net/media/NOVARIC-Logos_Master-W+B-R_12062025_150x150.png';

  return (
    <div
      className="block w-full bg-white dark:bg-slate-700/80 rounded-lg shadow-md hover:shadow-lg focus:shadow-lg transition-all duration-200 ease-in-out overflow-hidden text-left focus:outline-none focus-within:ring-2 focus-within:ring-primary-500 dark:focus-within:ring-primary-400 group font-sans"
    >
      <button
        onClick={() => onNavigate(article)}
        className="w-full"
        aria-label={`Lexo artikullin e ditës: ${article.title}`}
      >
        <div className="relative bg-slate-100 dark:bg-slate-600">
          <img 
            src={article.imageUrl || logoFallbackUrl} 
            alt={article.title} 
            className={`w-full h-24 ${article.imageUrl ? 'object-cover' : 'object-contain p-4'}`}
          />
           <div className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">
              Artikulli i Ditës
           </div>
        </div>
        <div className="p-3">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {article.title}
          </h4>
        </div>
      </button>
      <div className="px-3 pb-2">
         <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigateToAuthorProfile(article.author);
            }}
            className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate hover:underline focus:outline-none font-sans font-bold"
            aria-label={`Shiko profilin e autorit ${article.author}`}
          >
            nga {renderWithSuperscript(formatVipName(article.author))}
         </button>
      </div>
    </div>
  );
};