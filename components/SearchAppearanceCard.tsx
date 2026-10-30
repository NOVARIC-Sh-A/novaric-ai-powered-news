import React from 'react';
import { renderWithSuperscript } from '../utils/textUtils';

interface SearchAppearanceCardProps {
  title: string;
  url: string;
  description: string;
  date: string;
  logoUrl: string;
  thumbnailUrl: string;
  siteName?: string;
}

const MoreVertIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24" className={className}>
        <path d="M480 896q-33 0-56.5-23.5T400 816q0-33 23.5-56.5T480 736q33 0 56.5 23.5T560 816q0 33-23.5 56.5T480 896Zm0-272q-33 0-56.5-23.5T400 544q0-33 23.5-56.5T480 464q33 0 56.5 23.5T560 544q0 33-23.5 56.5T480 624Zm0-272q-33 0-56.5-23.5T400 272q0-33 23.5-56.5T480 192q33 0 56.5 23.5T560 272q0 33-23.5 56.5T480 352Z"/>
    </svg>
);

export const SearchAppearanceCard: React.FC<SearchAppearanceCardProps> = ({ title, url, description, date, logoUrl, thumbnailUrl, siteName = 'NOVARIC®' }) => {
  let displayUrl = 'novaric.co';
  try {
      displayUrl = new URL(url).hostname.replace('www.', '');
  } catch(e) { /* fallback to default */ }
  
  return (
    <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 font-sans text-left my-4 border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className="w-8 h-8 flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center p-1 mr-3">
             <img src={logoUrl} alt={`${siteName} logo`} className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{renderWithSuperscript(siteName)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{displayUrl}</p>
          </div>
        </div>
        <button aria-label="More options">
            <MoreVertIcon className="fill-slate-500 dark:fill-slate-400" />
        </button>
      </div>
      
      <h3 className="text-xl text-blue-600 dark:text-blue-400 font-medium mb-2">{renderWithSuperscript(title)}</h3>
      
      <div className="flex items-start gap-4">
        <p className="flex-grow text-sm text-slate-600 dark:text-slate-300">
          <span className="text-slate-500 dark:text-slate-400">{date} - </span>
          {description}
        </p>
        <img 
            src={thumbnailUrl} 
            alt="NOVARIC thumbnail" 
            className="w-20 h-20 object-contain flex-shrink-0 rounded-lg"
        />
      </div>
    </div>
  );
};