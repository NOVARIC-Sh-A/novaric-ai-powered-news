
import React from 'react';
// FIX: Corrected import path for types.
import { BreakingNewsArticle } from '../types';

interface SidebarTileProps {
  item: BreakingNewsArticle;
  onNavigate: (item: BreakingNewsArticle) => void;
}

export const SidebarTile: React.FC<SidebarTileProps> = ({ item, onNavigate }) => {
  return (
    <button
      onClick={() => onNavigate(item)}
      className="block w-full bg-white dark:bg-slate-700/80 rounded-lg shadow-md hover:shadow-lg focus:shadow-lg transition-all duration-200 ease-in-out overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
      aria-label={`Lexo lajmin: ${item.title}`}
    >
      {item.imageUrl && (
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-32 object-cover" 
        />
      )}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-3 leading-snug">
          {item.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{item.sourceName}</p>
      </div>
    </button>
  );
};