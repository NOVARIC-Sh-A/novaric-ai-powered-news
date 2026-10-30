import React, { useState, useMemo } from 'react';
import { BreakingNewsArticle } from '../types';
import { parseAlbanianDate } from '../utils/textUtils';
import "../styles/NewsPage.css";

interface NewsPageProps {
  news: BreakingNewsArticle[];
  onNavigate: (article: BreakingNewsArticle) => void;
  onBack: () => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({ news, onNavigate, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'relevance'>('newest');

  const filtered = useMemo(() => {
    let result = news.filter(n => 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.sourceName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'newest') {
      result.sort((a, b) => {
        const dateA = parseAlbanianDate(a.publishedDate)?.getTime() || 0;
        const dateB = parseAlbanianDate(b.publishedDate)?.getTime() || 0;
        return dateB - dateA;
      });
    } else if (sortBy === 'relevance') {
      // Assuming higher is better for relevance/severity
      result.sort((a, b) => {
          const scoreA = (a as any).aiRelevanceScore || (a.severity === 'high' ? 100 : 0);
          const scoreB = (b as any).aiRelevanceScore || (b.severity === 'high' ? 100 : 0);
          return scoreB - scoreA;
      });
    }

    return result;
  }, [news, searchTerm, sortBy]);

  return (
    <div className="novaric-news-page min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
           <button 
             onClick={onBack}
             className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-full text-sm font-semibold hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm text-slate-700 dark:text-slate-200"
           >
             ← Kthehu Pas
           </button>
           <h1 className="text-slate-800 dark:text-slate-100 font-bold m-0 text-xl md:text-2xl">Arkiva e Lajmeve</h1>
        </div>

        <div className="novaric-news-filters flex flex-wrap items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Kërko lajme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow min-w-[200px] text-slate-700"
          />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'relevance')}
            className="min-w-[150px] text-slate-700 cursor-pointer"
          >
            <option value="newest">Më të rejat</option>
            <option value="relevance">Sipas Rëndësisë</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((n) => (
            <div
              key={n.id}
              className="novaric-news-card bg-white dark:bg-slate-800 shadow rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col h-full cursor-pointer"
              onClick={() => onNavigate(n)}
            >
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={n.imageUrl || 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg'} 
                  alt={n.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                     {n.sourceName}
                   </span>
                   {n.isHighlyRelevantCurrentDevelopment && (
                    <div className="high-importance-pill">
                        Urgent
                    </div>
                    )}
                </div>

                <h2 className="text-slate-900 dark:text-slate-100 font-bold mb-2 line-clamp-3">
                  {n.title}
                </h2>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
                   {n.content}
                </p>

                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 meta-row">
                  <span>{parseAlbanianDate(n.publishedDate)?.toLocaleDateString('sq-AL') || n.publishedDate}</span>
                </div>
                
                {(n as any).aiRelevanceScore !== undefined && (
                  <div className="ai-relevance mt-1">
                    Relevanca (AI): {Math.round((n as any).aiRelevanceScore)} / 100
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            Nuk u gjetën lajme që përputhen me kërkimin tuaj.
          </div>
        )}
      </div>
    </div>
  );
};
