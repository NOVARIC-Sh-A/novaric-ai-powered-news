// components/analytics/CitationCard.tsx
import React from 'react';
import { BookOpen, ExternalLink, Award, Sparkles } from 'lucide-react';
import { getCitationById, CitationEntry } from '../../data/citationRegistry';

interface CitationCardProps {
  citationId?: string;
  citation?: CitationEntry;
  onNavigateToPage?: (page: string, anchorId: string) => void;
  className?: string;
}

export const CitationCard: React.FC<CitationCardProps> = ({
  citationId,
  citation: passedCitation,
  onNavigateToPage,
  className = '',
}) => {
  const citation = passedCitation || (citationId ? getCitationById(citationId) : undefined);

  if (!citation) {
    return null;
  }

  const handleCitingPageClick = (page: string, anchorId: string) => {
    if (onNavigateToPage) {
      onNavigateToPage(page, anchorId);
    } else {
      window.location.href = `/?page=${page}#${anchorId}`;
    }
  };

  return (
    <div
      id={citation.id.replace('ref:', 'ref-')}
      className={`p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition space-y-3 ${className}`}
    >
      {/* Header with Title & Credibility Rating */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
              {citation.authors} ({citation.year})
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
            {citation.title}
          </h4>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Award className="w-3.5 h-3.5 text-emerald-500" />
            <span>{citation.credibility_industry_rating_pct}%</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            Besueshmëria e Burimit
          </span>
        </div>
      </div>

      {/* Verbatim text */}
      <p className="text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-slate-300 dark:border-slate-700 pl-3">
        {citation.citation_text}
      </p>

      {/* Footer: Publisher Link + Citing Pages */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-750 flex flex-wrap items-center justify-between gap-3 text-xs">
        <a
          href={citation.url.startsWith('http') ? citation.url : `https://${citation.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>{citation.publisher}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {citation.citing_pages && citation.citing_pages.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-slate-400">Cituar në:</span>
            {citation.citing_pages.map((cp, idx) => (
              <button
                key={idx}
                onClick={() => handleCitingPageClick(cp.page, cp.anchorId)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                <Sparkles className="w-2.5 h-2.5 text-[#e4191e]" />
                <span>{cp.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
