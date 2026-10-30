import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Shield,
  Layers,
  BookOpen,
  Calendar,
  UserCheck,
  Sparkles,
  Activity,
  GitCommit,
} from 'lucide-react';
import { StandardClause, ScoreDimensionKey } from '../../types/standards';
import { getBacklinksForClause, normalizeClauseId } from '../../data/analyticalMappings';

interface ClauseExplorerProps {
  clauses: StandardClause[];
  onSelectDimension?: (dim: ScoreDimensionKey) => void;
  selectedClauseId?: string | null;
  onSelectClause?: (clauseId: string) => void;
  onOpenLineage?: (metricId: string) => void;
}

export const ClauseExplorer: React.FC<ClauseExplorerProps> = ({
  clauses,
  onSelectDimension,
  selectedClauseId,
  onSelectClause,
  onOpenLineage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeni, setSelectedNeni] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'compliant' | 'in_progress'>('all');
  const [expandedClauseIds, setExpandedClauseIds] = useState<Set<string>>(new Set(selectedClauseId ? [selectedClauseId] : []));

  const toggleClause = (id: string) => {
    setExpandedClauseIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    if (onSelectClause) {
      onSelectClause(id);
    }
  };

  const expandAll = () => {
    setExpandedClauseIds(new Set(filteredClauses.map(c => c.id)));
  };

  const collapseAll = () => {
    setExpandedClauseIds(new Set());
  };

  const filteredClauses = useMemo(() => {
    return clauses.filter(clause => {
      // Neni filter
      if (selectedNeni !== 'all' && clause.neni !== selectedNeni) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && clause.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = clause.id.toLowerCase().includes(query);
        const matchesTitle = clause.title.toLowerCase().includes(query);
        const matchesText = clause.text.toLowerCase().includes(query);
        const matchesOwner = clause.owner.toLowerCase().includes(query);
        const matchesCommitment = clause.commitment_key.toLowerCase().includes(query);
        const matchesEfcsn = (clause.efcsn_clause_ref || '').toLowerCase().includes(query);
        const matchesIfcn = (clause.ifcn_criterion_ref || '').toLowerCase().includes(query);
        return matchesId || matchesTitle || matchesText || matchesOwner || matchesCommitment || matchesEfcsn || matchesIfcn;
      }
      return true;
    });
  }, [clauses, selectedNeni, statusFilter, searchQuery]);

  const neniLabels: Record<number, { title: string; subtitle: string; description: string }> = {
    1: {
      title: 'Neni 1: Sistemi i Përputhshmërisë',
      subtitle: 'Konformiteti Organizativ & Angazhimi Publik',
      description: 'Përcakton bazën juridike dhe etike të funksionimit të njësisë së verifikimit pranë NOVARIC® Sh.A.',
    },
    2: {
      title: 'Neni 2: Metodologjia',
      subtitle: 'Transparenca Metodologjike & Burimet Parësore',
      description: 'Rregullorja e hulumtimit rigoroz të fakteve: triangulimi i burimeve, testimi i verbër, dhe recensimi editorial.',
    },
    3: {
      title: 'Neni 3: Standardet Etike',
      subtitle: 'Paanshmëria, Privatësia & Politika e Korrigjimeve',
      description: 'Garanton pavarësinë nga partitë politike, mbrojtjen e të miturve dhe mekanizmat e shpejtë të korrigjimit të gabimeve.',
    },
    4: {
      title: 'Neni 4: Transparenca',
      subtitle: 'Pronësia, Financimi & Muri Kinez Editorial',
      description: 'Zbulimi i plotë i strukturës aksionere, burimeve financiare dhe ndalimi i kategorishëm i sponsorizimit të verifikimeve.',
    },
  };

  const dimensionFriendlyNames: Record<ScoreDimensionKey, string> = {
    credibility: 'Besueshmëria',
    readability: 'Lexueshmëria',
    sentiment_analytics: 'Sentimenti & Neutraliteti',
    lifecycle: 'Cikli i Jetës & Përputhshmëria',
    seo_accessibility: 'SEO & Aksesueshmëria',
    logic: 'Integriteti Logjik',
    ethical_resonance: 'Rezonanca Etike',
    emotion: 'Valenca Emocionale',
  };

  return (
    <div id="clause-explorer-section" className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Kërko sipas klauzolës, titullit, tekstit, autoritetit apo referencës EFCSN..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#e4191e]/50 focus:border-[#e4191e]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Pastro
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition"
            >
              Hap të Gjitha
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition"
            >
              Mbyll të Gjitha
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          {/* Neni Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Neni:
            </span>
            <button
              onClick={() => setSelectedNeni('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                selectedNeni === 'all'
                  ? 'bg-[#e4191e] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Të Gjitha ({clauses.length})
            </button>
            {[1, 2, 3, 4].map(num => {
              const count = clauses.filter(c => c.neni === num).length;
              return (
                <button
                  key={num}
                  onClick={() => setSelectedNeni(num)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                    selectedNeni === num
                      ? 'bg-[#e4191e] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Neni {num} ({count})
                </button>
              );
            })}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Statusi:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-md border-0 text-xs font-semibold focus:ring-1 focus:ring-[#e4191e]"
            >
              <option value="all">Të Gjitha Statuset</option>
              <option value="compliant">Përputhshmëri e Plotë</option>
              <option value="in_progress">Në Zbatim të Vazhdueshëm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Po shfaqen <strong className="text-slate-900 dark:text-slate-100">{filteredClauses.length}</strong> nga {clauses.length} klauzola të kodit
        </span>
        <span>Standardi: EFCSN Code of Practice & IFCN Code of Principles</span>
      </div>

      {/* Clauses Grouped or Flat List */}
      {filteredClauses.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Nuk u gjet asnjë klauzolë</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Provo të heqësh filtrat ose të ndryshosh termin e kërkimit për të shfaqur klauzolat e Kodit të Standardeve NOVARIC®.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedNeni('all');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#e4191e] hover:bg-[#c01418] rounded-lg transition"
          >
            Rivendos Filtrat
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClauses.map(clause => {
            const isExpanded = expandedClauseIds.has(clause.id);
            const isSelected = selectedClauseId === clause.id;
            const neniMeta = neniLabels[clause.neni];

            return (
              <div
                key={clause.id}
                id={`clause-${clause.id}`}
                className={`rounded-xl bg-white dark:bg-slate-800 border transition-all duration-200 ${
                  isSelected
                    ? 'border-[#e4191e] ring-2 ring-[#e4191e]/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm'
                }`}
              >
                {/* Header Strip */}
                <div
                  onClick={() => toggleClause(clause.id)}
                  className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-700/30 rounded-t-xl select-none"
                >
                  <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                    {/* Clause Code Pill */}
                    <span className="shrink-0 font-mono text-xs font-extrabold px-2.5 py-1 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border border-slate-700 tracking-wider">
                      {clause.id}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Neni {clause.neni}
                          {clause.sub_neni ? `.${clause.sub_neni.split('.')[1] || ''}` : ''} • Pika {clause.letter}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          {clause.status_label_sq}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                        {clause.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Primary Preview Text (Always visible or readable) */}
                <div className="px-4 sm:px-5 pb-3">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic border-l-2 border-slate-300 dark:border-slate-600 pl-3 my-1">
                    "{clause.text}"
                  </p>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 rounded-b-xl space-y-4">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      {/* Authority / Owner */}
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                          <UserCheck className="w-3.5 h-3.5 text-blue-500" /> Autoriteti Përgjegjës:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {clause.owner}
                        </span>
                      </div>

                      {/* Verification Timestamp */}
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Verifikuar së Fundmi:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {new Date(clause.last_verified_at).toLocaleDateString('sq-AL', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* International Reference */}
                      <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                          <Shield className="w-3.5 h-3.5 text-purple-500" /> Standardi Ndërkombëtar:
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                          {clause.efcsn_clause_ref || 'EFCSN Aligned'} • {clause.ifcn_criterion_ref || 'IFCN Principle'}
                        </span>
                      </div>
                    </div>

                    {/* Audit Note */}
                    {clause.audit_note && (
                      <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Shënimi i Auditimit Periodik: </strong>
                          {clause.audit_note}
                        </div>
                      </div>
                    )}

                    {/* Governing Score Dimensions */}
                    {clause.score_dimensions && clause.score_dimensions.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#e4191e]" /> Dimensionet e Integritetit të Artikullit që Rregullon:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {clause.score_dimensions.map(dim => (
                            <button
                              key={dim}
                              onClick={() => onSelectDimension && onSelectDimension(dim)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-[#e4191e] border border-red-200 dark:border-red-900/50 transition cursor-pointer"
                              title={`Kliko për të parë matricën e plotë për ${dimensionFriendlyNames[dim]}`}
                            >
                              <Sparkles className="w-3 h-3 text-[#e4191e]" />
                              <span>{dimensionFriendlyNames[dim] || dim}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Shtylla Analitike (Analytical Spine Backlinks) */}
                    {(() => {
                      const backlinks = getBacklinksForClause(clause.id);
                      const hasLinks = backlinks.maragon_indicator_ids.length > 0 || backlinks.methodology_step_ids.length > 0 || backlinks.live_metric_ids.length > 0;
                      if (!hasLinks) return null;

                      return (
                        <div className="p-3 rounded-lg bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <GitCommit className="w-3.5 h-3.5 text-[#e4191e]" /> Shtylla Analitike (Gjurmueshmëria e Plotë):
                          </span>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {backlinks.maragon_indicator_ids.map(indId => (
                              <a
                                key={indId}
                                href={`/?page=maragonFramework#${indId}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 font-mono text-[11px] font-semibold transition"
                                title="Kliko për të parë treguesin në Kornizën MARAGON®"
                              >
                                <Shield className="w-3 h-3 text-amber-600" />
                                <span>{indId}</span>
                              </a>
                            ))}

                            {backlinks.methodology_step_ids.map(stepId => (
                              <a
                                key={stepId}
                                href={`/?page=methodology#${stepId}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-800 font-mono text-[11px] font-semibold transition"
                                title="Kliko për të parë hapin në Metodologjinë e Verifikimit"
                              >
                                <Sparkles className="w-3 h-3 text-teal-600" />
                                <span>{stepId}</span>
                              </a>
                            ))}

                            {backlinks.live_metric_ids.map(mId => (
                              <button
                                key={mId}
                                type="button"
                                onClick={() => onOpenLineage && onOpenLineage(mId)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 font-mono text-[11px] font-semibold transition cursor-pointer"
                                title="Kliko për të parë dekompozimin e plotë të kësaj metrike"
                              >
                                <Activity className="w-3 h-3 text-emerald-600" />
                                <span>{mId}</span>
                              </button>
                            ))}

                            {(() => {
                              const normClause = normalizeClauseId(clause.id);
                              let publicGuideSection: { label: string; hash: string } | null = null;
                              if (normClause === 'TRANSP-4.1A' || normClause === 'TRANSP-4.2A' || normClause === 'ETIK-3.1A') {
                                publicGuideSection = { label: 'Udhëzues Publik: Shtylla 1 (Transparenca)', hash: 'shtylla-1-transparenca' };
                              } else if (normClause.startsWith('MET-')) {
                                publicGuideSection = { label: 'Udhëzues Publik: Shtylla 2 (Verifikimi)', hash: 'shtylla-2-verifikimi' };
                              } else if (normClause === 'ETIK-3.3A') {
                                publicGuideSection = { label: 'Udhëzues Publik: Shtylla 3 (Llogaridhënia)', hash: 'shtylla-3-llogaridhënia' };
                              }
                              if (!publicGuideSection) return null;

                              return (
                                <a
                                  href={`/?page=mediaEducationFramework#${publicGuideSection.hash}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 font-mono text-[11px] font-semibold transition"
                                  title="Përkthyer për qytetarët në Shtresën e Intepretimit Publik"
                                >
                                  <BookOpen className="w-3 h-3 text-indigo-600" />
                                  <span>{publicGuideSection.label}</span>
                                </a>
                              );
                            })()}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Evidence Link */}
                    <div className="pt-2 flex items-center justify-between">
                      <a
                        href={clause.evidence_url}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e4191e] hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Dëshmia & Protokolli: {clause.evidence_title}</span>
                      </a>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Key: {clause.commitment_key}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
