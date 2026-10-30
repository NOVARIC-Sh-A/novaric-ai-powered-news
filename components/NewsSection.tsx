import React from 'react';
import { BreakingNewsArticle } from '../types';
import { NewsCard } from './NewsCard';

interface NewsSectionProps {
  news: BreakingNewsArticle[];
  onNavigateToNewsArticle: (item: BreakingNewsArticle) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news, onNavigateToNewsArticle }) => {
  if (!news || news.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b-2 border-primary-500/30 pb-2">
        Lajme të Tjera
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {news.map(item => (
          <NewsCard 
            key={item.id} 
            item={item} 
            onNavigate={onNavigateToNewsArticle} 
          />
        ))}
      </div>
    </section>
  );
};
