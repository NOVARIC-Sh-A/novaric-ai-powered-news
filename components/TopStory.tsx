import React from 'react';
import { BreakingNewsArticle } from '../types';
import { stripHighlights } from '../utils/textUtils';
import { sanitizeImageUrl, handleImageFallback } from '../utils/imageUtils';

interface TopStoryProps {
  newsItem: BreakingNewsArticle;
  onNavigate: (item: BreakingNewsArticle) => void;
}

export const TopStory: React.FC<TopStoryProps> = ({ newsItem, onNavigate }) => {
  if (!newsItem) return null;

  const summaryText = stripHighlights(newsItem.content).substring(0, 200);
  const imageUrl = sanitizeImageUrl(newsItem.imageUrl);

  return (
    <div className="relative rounded-lg overflow-hidden shadow-2xl mb-8 group cursor-pointer" onClick={() => onNavigate(newsItem)}>
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={`Imazh për artikullin: ${newsItem.title}`}
          onError={handleImageFallback}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>
      </div>

      <div className="relative p-6 md:p-8 flex flex-col justify-end h-[400px] text-white">
        <div>
          <span className="bg-primary-600 text-white font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
            Lajmi i Ditës
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3 leading-tight" style={{ textShadow: '2px 2px 5px rgba(0,0,0,0.8)' }}>
          {newsItem.title}
        </h2>
        <p className="text-slate-200 line-clamp-2 mb-6" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
          {summaryText}...
        </p>
        <div className="mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent double navigation from parent div click
              onNavigate(newsItem);
            }}
            className="bg-white/90 text-slate-900 font-bold py-2 px-5 rounded-full hover:bg-white transition-colors shadow-lg"
            aria-label={`Lexo më shumë për: ${newsItem.title}`}
          >
            Lexo më shumë &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
