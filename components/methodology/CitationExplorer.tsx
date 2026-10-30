// components/methodology/CitationExplorer.tsx
import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Filter,
  ExternalLink,
  Search,
  Quote,
  Layers,
  Sparkles,
  Calendar,
  Building,
} from 'lucide-react';
import { MethodReference, ReferenceType } from '../../types/methodology';

interface CitationExplorerProps {
  references: MethodReference[];
  selectedCitationKey?: string | null;
  onSelectCitation?: (key: string) => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const CitationExplorer: React.FC<CitationExplorerProps> = ({
  references,
  selectedCitationKey,
  onSelectCitation,
  onScrollToSection,
}) => {
  const [activeType, setActiveType] = useState<ReferenceType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReferences = useMemo(() => {
    return references.filter(ref => {
      if (activeType !== 'all' && ref.type !== activeType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ref.citation.toLowerCase().includes(q) ||
          ref.authors.toLowerCase().includes(q) ||
          ref.title.toLowerCase().includes(q) ||
          ref.short_cite.toLowerCase().includes(q) ||
          ref.publisher_or_journal.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [references, activeType, searchQuery]);

  const typeCounts = useMemo(() => {
    return {
      all: references.length,
      book: references.filter(r => r.type === 'book').length,
      journal: references.filter(r => r.type === 'journal').length,
      report: references.filter(r => r.type === 'report').length,
    };
  }, [references]);

  return (
    <div id="sec-referencat" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60">
          <BookOpen className="w-3.5 h-3.5 text-purple-600" />
          Korpusi Teorik & Shkencor
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Eksploruesi i Citimeve dhe Referencave Akademike
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
          Çdo parim metodologjik dhe rregull editorial i NOVARIC® mbështetet në literaturë të recensuar nga kolegët (peer-reviewed) mbi sistemet hibride mediatike, hermeneutikën filozofike dhe etikën gazetareske.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Type pills */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setActiveType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeType === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Të Gjitha ({typeCounts.all})
          </button>
          <button
            onClick={() => setActiveType('book')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeType === 'book'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Libra Akademikë ({typeCounts.book})
          </button>
          <button
            onClick={() => setActiveType('journal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeType === 'journal'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Artikuj Shkencorë ({typeCounts.journal})
          </button>
          <button
            onClick={() => setActiveType('report')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeType === 'report'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Raporte Ndërkombëtare ({typeCounts.report})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filtro sipas autorit ose titullit..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </div>
      </div>

      {/* Citations Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReferences.map(ref => {
          const isSelected = selectedCitationKey === ref.key;

          return (
            <div
              key={ref.id}
              id={`citation-${ref.key}`}
              onClick={() => onSelectCitation && onSelectCitation(ref.key)}
              className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-purple-50/50 dark:bg-purple-950/30 border-purple-500 ring-2 ring-purple-500/20 shadow-md scale-[1.005]'
                  : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  {/* Badge & Short Cite */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs">
                      {ref.short_cite}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
                      {ref.type_label_sq}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {ref.year}
                    </span>
                  </div>

                  {/* Verbatim Citation */}
                  <p className="text-slate-900 dark:text-slate-100 font-serif text-sm sm:text-base leading-relaxed pl-3 border-l-2 border-slate-300 dark:border-slate-700">
                    {ref.citation}
                  </p>

                  {/* Usage in article */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Përdorimi në tekstin e metodologjisë:
                    </span>
                    {ref.usage_anchors.map((ua, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-[#e4191e] block">
                            § {ua.section_title}
                          </span>
                          <p className="text-slate-600 dark:text-slate-300 italic">
                            "{ua.excerpt}"
                          </p>
                        </div>
                        {onScrollToSection && (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onScrollToSection(ua.section_id);
                            }}
                            className="shrink-0 px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-[11px] font-medium text-slate-700 dark:text-slate-200"
                          >
                            Shko te seksioni
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* External link to book or publication */}
                {ref.external_url && (
                  <a
                    href={ref.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
                  >
                    <span>Katalogu / DOI</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
