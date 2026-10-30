// components/analytics/ConceptTooltip.tsx
import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { getConceptById, ConceptDefinition } from '../../data/conceptRegistry';

interface ConceptTooltipProps {
  conceptId?: string;
  term?: string;
  definition?: string;
  children?: React.ReactNode;
  onNavigateToOccurrence?: (page: string, anchorId: string) => void;
}

export const ConceptTooltip: React.FC<ConceptTooltipProps> = ({
  conceptId,
  term,
  definition,
  children,
  onNavigateToOccurrence,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const concept: ConceptDefinition | undefined = conceptId ? getConceptById(conceptId) : undefined;
  const displayTerm = term || concept?.term_sq || 'Koncept';
  const displayDefinition = definition || concept?.definition || '';

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLinkClick = (page: string, anchorId: string) => {
    if (onNavigateToOccurrence) {
      onNavigateToOccurrence(page, anchorId);
    } else {
      window.location.href = `/?page=${page}#${anchorId}`;
    }
    setIsOpen(false);
  };

  return (
    <span className="relative inline-block" ref={triggerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        className="font-semibold text-primary-600 dark:text-primary-400 border-b-2 border-dotted border-primary-500/60 hover:text-[#e4191e] dark:hover:text-[#e4191e] transition-colors cursor-help inline text-left bg-transparent p-0"
        aria-expanded={isOpen}
      >
        {children || displayTerm}
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute bottom-full left-1/2 -translate-x-1/2 w-80 sm:w-96 p-4 bg-[#0b1329] text-white text-xs rounded-xl shadow-2xl z-50 mb-2 border border-slate-700 animate-in fade-in zoom-in-95 duration-150"
          role="tooltip"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-red-400" />
              <span className="font-bold text-slate-100 uppercase tracking-wider text-[10px]">
                {concept?.term_en || displayTerm}
              </span>
            </div>
            {concept?.theorist && (
              <span className="text-[10px] text-slate-400 font-mono">
                {concept.theorist}
              </span>
            )}
          </div>

          {/* Definition */}
          <p className="text-slate-200 leading-relaxed font-normal mb-3">
            {displayDefinition}
          </p>

          {/* Backlinks "Përdoret në:" */}
          {concept && concept.occurrences && concept.occurrences.length > 0 && (
            <div className="border-t border-slate-800 pt-2 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-red-400" /> Përdoret në kornizë:
              </span>
              <div className="flex flex-col gap-1">
                {concept.occurrences.map((occ, i) => (
                  <button
                    key={i}
                    onClick={() => handleLinkClick(occ.page, occ.anchorId)}
                    className="flex items-center justify-between gap-2 text-[11px] text-sky-400 hover:text-sky-300 transition py-0.5 text-left group cursor-pointer"
                  >
                    <span className="truncate">{occ.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[#0b1329]" />
        </div>
      )}
    </span>
  );
};
