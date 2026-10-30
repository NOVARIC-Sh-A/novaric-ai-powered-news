
import React from 'react';
import { ArticleData } from '../types';
import { CalendarDaysIcon, PencilSquareIcon } from './icons';
import { renderWithSuperscript } from '../utils/textUtils';
import { formatVipName } from '../utils/paragonProfileUtils';

interface ArticleCardProps {
  item: ArticleData;
  onNavigate: (item: ArticleData) => void;
  onNavigateToAuthorProfile: (authorName: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ item, onNavigate, onNavigateToAuthorProfile }) => {
  const { title, author, publishedDate, imageUrl } = item;

  return (
    <article
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden flex flex-col h-full group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 font-sans"
    >
      <div className="w-full text-left focus:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 focus-within:ring-primary-500 rounded-lg flex flex-col h-full">
        <button 
          onClick={() => onNavigate(item)}
          aria-label={`Lexo artikullin: ${title}`}
          className="focus:outline-none"
        >
          <div className="overflow-hidden">
            <img
              src={imageUrl || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1170&q=80'}
              alt={`Imazh për artikullin: ${title}`}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </button>
        
        <div className="p-4 flex flex-col flex-grow">
          <button 
            onClick={() => onNavigate(item)}
            aria-label={`Lexo artikullin: ${title}`}
            className="focus:outline-none text-left"
          >
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-3">{renderWithSuperscript(title)}</h3>
          </button>
          
          <div className="flex-grow" />
          
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={() => onNavigateToAuthorProfile(author)}
              className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none font-sans font-semibold"
              aria-label={`Shiko profilin e autorit: ${author}`}
            >
                <PencilSquareIcon className="w-4 h-4 mr-1.5" />
                <span>{renderWithSuperscript(formatVipName(author))}</span>
            </button>
             <div className="flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                <span>{publishedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};