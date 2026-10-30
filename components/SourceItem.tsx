
import React from 'react';
// FIX: Corrected import path for types.
import { Source } from '../types';

interface SourceItemProps {
  source: Source;
}

const LinkIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
);


export const SourceItem: React.FC<SourceItemProps> = ({ source }) => {
  return (
    <li className="p-3 bg-slate-50 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-150">
      <a
        href={source.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline"
      >
        <LinkIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <span className="break-all">{source.title || source.uri}</span>
      </a>
    </li>
  );
};