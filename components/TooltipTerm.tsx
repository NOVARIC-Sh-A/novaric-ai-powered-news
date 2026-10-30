import React from 'react';

interface TooltipTermProps {
  term: string;
  definition: string;
}

export const TooltipTerm: React.FC<TooltipTermProps> = ({ term, definition }) => {
  return (
    <span className="relative group cursor-help">
      <span className="font-semibold border-b border-dotted border-current">{term}</span>
      <span 
        className="absolute bottom-full left-1/2 -translate-x-1/2 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 mb-2"
        role="tooltip"
      >
        {definition}
        <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
      </span>
    </span>
  );
};