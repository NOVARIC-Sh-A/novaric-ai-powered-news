

import React, { useState, useMemo } from 'react';
import { ArticleData } from '../types';
import { ArticleCard } from './ArticleCard';
import { parseAlbanianDate } from '../utils/textUtils';

interface ArticlesListPageProps {
  articles: ArticleData[];
  onNavigateToArticlePage: (item: ArticleData) => void;
  onBack: () => void;
  onNavigateToAuthorProfile: (authorName: string) => void;
}

export const ArticlesListPage: React.FC<ArticlesListPageProps> = ({ articles, onNavigateToArticlePage, onBack, onNavigateToAuthorProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const sortedAndFilteredArticles = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filtered = articles.filter(item => {
      return item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
             item.author.toLowerCase().includes(lowerCaseSearchTerm);
    });
    
    return filtered.sort((a, b) => {
      const dateA = parseAlbanianDate(a.publishedDate);
      const dateB = parseAlbanianDate(b.publishedDate);
      const timeA = dateA ? dateA.getTime() : 0;
      const timeB = dateB ? dateB.getTime() : 0;
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [articles, searchTerm, sortBy]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 pb-2" style={{ textShadow: '2px 2px #4f46e5, 4px 4px #1a1a1a' }}>Artikujt e Publikuar</h1>
            <p className="text-lg font-semibold text-white mt-2" style={{ textShadow: '1px 1px 2px #4f46e5, 2px 2px #1a1a1a' }}>Eksploroni opinionet, editorialet dhe analizat e thelluara.</p>
        </div>
        
        <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Kërko artikuj sipas titullit ose autorit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:flex-grow px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700"
          />
          <div className="flex items-center gap-2 w-full md:w-auto">
               <label htmlFor="sort-by-article" className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-shrink-0">Rendit:</label>
               <select
                  id="sort-by-article"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-slate-700"
               >
                  <option value="newest">Më të rejat</option>
                  <option value="oldest">Më të vjetrat</option>
               </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAndFilteredArticles.map(item => (
                <ArticleCard key={item.id} item={item} onNavigate={onNavigateToArticlePage} onNavigateToAuthorProfile={onNavigateToAuthorProfile} />
            ))}
        </div>
        
        {sortedAndFilteredArticles.length === 0 && (
             <div className="text-center py-16 bg-white/10 backdrop-blur-sm rounded-lg mt-8">
                 <p className="text-xl text-white font-semibold">Nuk u gjet asnjë artikull që përputhet me filtrat tuaj.</p>
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