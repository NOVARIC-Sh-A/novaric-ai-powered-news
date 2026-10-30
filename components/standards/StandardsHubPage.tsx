import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  BookOpen,
  Scale,
  FileText,
  Building2,
  Cpu,
  ArrowLeft,
  Share2,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Download,
  Printer,
  ChevronRight,
  Info,
  Award,
} from 'lucide-react';
import { LivingSeal } from './LivingSeal';
import { ClauseExplorer } from './ClauseExplorer';
import { TraceabilityMatrix } from './TraceabilityMatrix';
import { ComplianceMatrix } from './ComplianceMatrix';
import { CorrectionsCenter } from './CorrectionsCenter';
import { TransparencyLedger } from './TransparencyLedger';
import { AiTransparencySection } from './AiTransparencySection';
import { AnalyticalSpine } from '../analytics/AnalyticalSpine';
import { ScoreLineagePanel } from '../analytics/ScoreLineagePanel';

import {
  StandardClause,
  ComplianceSummary,
  CorrectionItem,
  AiRegistryEntry,
  TransparencyLedgerItem,
  StandardsSubView,
  ScoreDimensionKey,
} from '../../types/standards';
import { standardsService } from '../../services/standardsService';

interface StandardsHubPageProps {
  onBack?: () => void;
  onNavigateToNoraAiProfile?: () => void;
  onNavigateToVipProfile?: (id: string | number) => void;
  onNavigateToArticleMetricsExplained?: () => void;
  onNavigateToMethodology?: () => void;
}

export const StandardsHubPage: React.FC<StandardsHubPageProps> = ({
  onBack,
  onNavigateToNoraAiProfile,
  onNavigateToArticleMetricsExplained,
  onNavigateToMethodology,
}) => {
  // Data State
  const [summary, setSummary] = useState<ComplianceSummary | null>(null);
  const [clauses, setClauses] = useState<StandardClause[]>([]);
  const [corrections, setCorrections] = useState<CorrectionItem[]>([]);
  const [models, setModels] = useState<AiRegistryEntry[]>([]);
  const [ledgerItems, setLedgerItems] = useState<TransparencyLedgerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View State
  const [activeSubView, setActiveSubView] = useState<StandardsSubView>('hub');
  const [selectedDimension, setSelectedDimension] = useState<ScoreDimensionKey>('credibility');
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeLineageMetric, setActiveLineageMetric] = useState<string | null>(null);

  // Initialize from URL params if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sub = params.get('sub') as StandardsSubView;
    const clauseId = params.get('clause');
    const dim = params.get('dim') as ScoreDimensionKey;

    if (sub && ['hub', 'kodi', 'perputhshmeri', 'korrigjime', 'transparence', 'ai'].includes(sub)) {
      setActiveSubView(sub);
    }
    if (clauseId) {
      setSelectedClauseId(clauseId);
    }
    if (dim) {
      setSelectedDimension(dim);
    }
  }, []);

  // Update URL on subview changes without reloading
  const switchSubView = useCallback((sub: StandardsSubView, extra?: { clauseId?: string; dim?: ScoreDimensionKey }) => {
    setActiveSubView(sub);
    const params = new URLSearchParams(window.location.search);
    params.set('page', 'standards');
    params.set('sub', sub);

    if (extra?.clauseId) {
      params.set('clause', extra.clauseId);
      setSelectedClauseId(extra.clauseId);
    } else {
      params.delete('clause');
    }

    if (extra?.dim) {
      params.set('dim', extra.dim);
      setSelectedDimension(extra.dim);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ sub, ...extra }, '', newUrl);
  }, []);

  // Load live data from standardsService
  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [summaryRes, clausesRes, correctionsRes, aiRes, ledgerRes] = await Promise.all([
      standardsService.getComplianceSummary(),
      standardsService.getClauses(),
      standardsService.getCorrections(),
      standardsService.getAiRegistry(),
      standardsService.getTransparencyLedger(),
    ]);

    if (summaryRes) setSummary(summaryRes);
    if (clausesRes && Array.isArray(clausesRes.clauses)) setClauses(clausesRes.clauses);
    if (correctionsRes && Array.isArray(correctionsRes.corrections)) setCorrections(correctionsRes.corrections);
    if (aiRes && Array.isArray(aiRes.registry)) setModels(aiRes.registry);
    if (ledgerRes && Array.isArray(ledgerRes)) setLedgerItems(ledgerRes);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleDimensionSelect = (dim: ScoreDimensionKey) => {
    switchSubView('perputhshmeri', { dim });
  };

  const handleClauseSelect = (clauseId: string) => {
    switchSubView('kodi', { clauseId });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-[#e4191e] selection:text-white pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-[#0b1329] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Kthehu</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <span className="text-slate-400">Kryefaqja</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Standardet Gazetare</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-white uppercase tracking-wider">
                Kodi i Standardeve NOVARIC®
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyShareLink}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedUrl ? 'U Kopjua Linku!' : 'Ndaj Hub-in'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hidden sm:flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Printo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shtylla Analitike (Analytical Spine Ribbon) */}
      <AnalyticalSpine
        currentTier="doktrina"
        activeEntityLabel="Kodi i Standardeve NOVARIC®"
        onNavigateTier={(tier) => {
          if (tier === 'doktrina') switchSubView('kodi');
          else if (tier === 'metoda') {
            if (onNavigateToMethodology) onNavigateToMethodology();
            else window.location.href = '/?page=methodology';
          } else if (tier === 'korniza') {
            window.location.href = '/?page=maragonFramework';
          } else if (tier === 'vleresimi') {
            if (onNavigateToArticleMetricsExplained) onNavigateToArticleMetricsExplained();
            else window.location.href = '/?page=articleMetricsExplained';
          } else if (tier === 'entiteti') {
            window.location.href = '/?page=newsList';
          }
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Hero Section: Living Seal & Integrity Badge */}
        {summary && (
          <LivingSeal
            summary={summary}
            onNavigateToMatrix={() => switchSubView('perputhshmeri')}
          />
        )}

        {/* Tab Navigation Menu */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => switchSubView('hub')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeSubView === 'hub'
                  ? 'bg-[#e4191e] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Përmbledhja Ekzekutive</span>
            </button>

            <button
              onClick={() => switchSubView('kodi')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeSubView === 'kodi'
                  ? 'bg-[#e4191e] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kodi i Standardeve ({clauses.length})</span>
            </button>

            <button
              onClick={() => switchSubView('perputhshmeri')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeSubView === 'perputhshmeri'
                  ? 'bg-[#e4191e] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Përputhshmëria & Gjurmueshmëria</span>
            </button>

            <button
              onClick={() => switchSubView('korrigjime')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeSubView === 'korrigjime'
                  ? 'bg-[#e4191e] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Korrigjimet & Ankesat ({corrections.length})</span>
            </button>

            <button
              onClick={() => switchSubView('transparence')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeSubView === 'transparence'
                  ? 'bg-[#e4191e] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Pronësia & Financimi</span>
            </button>

            <button
              onClick={() => switchSubView('ai')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeSubView === 'ai'
                  ? 'bg-[#e4191e] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Transparenca e IA</span>
            </button>

            <button
              onClick={() => {
                if (onNavigateToMethodology) {
                  onNavigateToMethodology();
                } else {
                  window.location.href = '/?page=methodology';
                }
              }}
              className="px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 ml-auto cursor-pointer"
              title="Shiko Metodologjinë e Sinergjisë Hermeneutike dhe Kornizën e Përgjegjësisë"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="hidden sm:inline">Metodologjia Hermeneutike</span>
              <span className="sm:hidden">Metodologjia</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Dynamic Sub-View Content */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-[#e4191e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold">Po ngarkohen të dhënat e Zyrës së Standardeve...</p>
          </div>
        ) : (
          <div>
            {/* SUB-VIEW: HUB LANDING / OVERVIEW */}
            {activeSubView === 'hub' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* 4 Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div
                    onClick={() => switchSubView('kodi')}
                    className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-[#e4191e] cursor-pointer transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/50 text-[#e4191e] flex items-center justify-center mb-3">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Neni 1 – Neni 4
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#e4191e] transition mt-1">
                        Kodi i Standardeve
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        31 klauzola operacionale të detyrueshme për çdo hetim, fakt-kontroll dhe raportim.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs font-bold text-[#e4191e] flex items-center justify-between">
                      <span>Eksploro Klauzolat</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => switchSubView('perputhshmeri')}
                    className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-[#e4191e] cursor-pointer transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                        <Scale className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Përputhshmëria: 98.40%
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#e4191e] transition mt-1">
                        Matrica & Gjurmueshmëria
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Lidhja e drejtpërdrejtë midis 8 dimensioneve të integritetit të artikullit dhe klauzolave.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs font-bold text-[#e4191e] flex items-center justify-between">
                      <span>Shiko Matricën</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => switchSubView('korrigjime')}
                    className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-[#e4191e] cursor-pointer transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        SLA: 7 Ditë Pune
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#e4191e] transition mt-1">
                        Korrigjimet & Ankesat
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Formulari qytetar i ankesave me dëftesë dixhitale dhe regjistri publik i korrigjimeve.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs font-bold text-[#e4191e] flex items-center justify-between">
                      <span>Paraqit Kërkesë</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div
                    onClick={() => switchSubView('transparence')}
                    className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-[#e4191e] cursor-pointer transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Zero Ndikim Politik
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#e4191e] transition mt-1">
                        Pronësia & Financimi
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Muri kinez editorial, ekstrakti zyrtar QKB dhe certifikata ndërkombëtare EUIPO.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs font-bold text-[#e4191e] flex items-center justify-between">
                      <span>Verifiko Provat</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Highlights: Traceability Feature Spotlight */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#e4191e]">
                        Gjurmueshmëria e Drejtpërdrejtë
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                        Si Lidhën Standardet me Vlerësimin e Integritetit të Artikullit
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                        Në NOVARIC®, rezultati <strong>3.57/4.00</strong> nuk është një numër arbitrar. Çdo tregues matet me një formulë të hapur që rrjedh nga klauzola specifike të Nenit 1, 2, 3 dhe 4.
                      </p>
                    </div>

                    <button
                      onClick={() => switchSubView('perputhshmeri')}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#e4191e] hover:bg-[#c01418] rounded-lg transition shrink-0 flex items-center gap-1.5"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Hap Matricën e Plotë</span>
                    </button>
                  </div>

                  {summary && (
                    <ComplianceMatrix
                      summary={summary}
                      clauses={clauses}
                      onSelectNeni={(neni) => switchSubView('kodi')}
                    />
                  )}
                </div>
              </div>
            )}

            {/* SUB-VIEW: KODI I STANDARDEVE (CLAUSE EXPLORER) */}
            {activeSubView === 'kodi' && (
              <div className="animate-in fade-in duration-300">
                <ClauseExplorer
                  clauses={clauses}
                  selectedClauseId={selectedClauseId}
                  onSelectDimension={handleDimensionSelect}
                  onSelectClause={(id) => setSelectedClauseId(id)}
                  onOpenLineage={(mId) => setActiveLineageMetric(mId)}
                />
              </div>
            )}

            {/* SUB-VIEW: PËRPUTHSHMËRIA & GJURMUESHMËRIA */}
            {activeSubView === 'perputhshmeri' && summary && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <TraceabilityMatrix
                  clauses={clauses}
                  initialDimension={selectedDimension}
                  onNavigateToClause={handleClauseSelect}
                />
                <ComplianceMatrix
                  summary={summary}
                  clauses={clauses}
                  onSelectNeni={() => switchSubView('kodi')}
                />
              </div>
            )}

            {/* SUB-VIEW: KORRIGJIMET & ANKESAT */}
            {activeSubView === 'korrigjime' && (
              <div className="animate-in fade-in duration-300">
                <CorrectionsCenter
                  corrections={corrections}
                  clauses={clauses}
                  onRefreshCorrections={loadData}
                />
              </div>
            )}

            {/* SUB-VIEW: TRANSPARENCA & PRONËSIA */}
            {activeSubView === 'transparence' && (
              <div className="animate-in fade-in duration-300">
                <TransparencyLedger items={ledgerItems} />
              </div>
            )}

            {/* SUB-VIEW: TRANSPARENCA E IA */}
            {activeSubView === 'ai' && (
              <div className="animate-in fade-in duration-300">
                <AiTransparencySection models={models} />
              </div>
            )}
          </div>
        )}

        {/* Academic Bibliography & Grounding (Preserved verbatim) */}
        <div
          id="academic-grounding-section"
          className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
        >
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                Baza Shkencore & Bibliografia
              </span>
              <span className="text-xs text-slate-400">
                Korniza Epistemologjike e Integritetit Mediatik
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
              Referencat Akademike dhe Standardet Ndërkombëtare
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-3xl">
              Kodi i Standardeve NOVARIC® bazohet në teoritë kryesore të sferës publike, etikës normative të gazetarisë dhe kornizave evropiane të llogaridhënies:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
                <strong className="text-slate-900 dark:text-slate-100 block">Habermas, J. (1989)</strong>
                <span>The Structural Transformation of the Public Sphere: An Inquiry into a Category of Bourgeois Society. MIT Press.</span>
                <span className="block text-[11px] text-slate-400 mt-1">Themeli i llogaridhënies dhe diskursit pa pengesa.</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
                <strong className="text-slate-900 dark:text-slate-100 block">Kovach, B., & Rosenstiel, T. (2014)</strong>
                <span>The Elements of Journalism: What Newspeople Should Know and the Public Should Expect (3rd ed.). Three Rivers Press.</span>
                <span className="block text-[11px] text-slate-400 mt-1">Disiplina e verifikimit dhe transparenca e metodës.</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
                <strong className="text-slate-900 dark:text-slate-100 block">Hallin, D. C., & Mancini, P. (2004)</strong>
                <span>Comparing Media Systems: Three Models of Media and Politics. Cambridge University Press.</span>
                <span className="block text-[11px] text-slate-400 mt-1">Analiza e klientelizmit mediatik dhe modelit pluralist të polarizuar.</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
                <strong className="text-slate-900 dark:text-slate-100 block">European Fact-Checking Standards Network (EFCSN)</strong>
                <span>The European Code of Standards for Independent Fact-Checking Organisations (2022).</span>
                <span className="block text-[11px] text-slate-400 mt-1">Pajtueshmëri e plotë me të 44 kriteret operacionale.</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
                <strong className="text-slate-900 dark:text-slate-100 block">Schudson, M. (2001)</strong>
                <span>The objectivity norm in American journalism. Journalism, 2(2), 149-170.</span>
                <span className="block text-[11px] text-slate-400 mt-1">Evolucioni i normës së objektivitetit dhe neutralitetit faktik.</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
                <strong className="text-slate-900 dark:text-slate-100 block">Patterson, P., & Wilkins, L. (2014)</strong>
                <span>Media Ethics: Issues and Cases (8th ed.). McGraw-Hill.</span>
                <span className="block text-[11px] text-slate-400 mt-1">Dilemat e konfliktit të interesit dhe pavarësisë editoriale.</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
                <strong className="text-slate-900 dark:text-slate-100 block">Mungiu-Pippidi, A. (2013)</strong>
                <span>Controlling Corruption through Collective Action. Journal of Democracy, 24(1), 101-115.</span>
                <span className="block text-[11px] text-slate-400 mt-1">Integriteti i qeverisjes dhe monitorimi i elitave politike.</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
                <strong className="text-slate-900 dark:text-slate-100 block">International Fact-Checking Network (IFCN)</strong>
                <span>IFCN Code of Principles (2016) at The Poynter Institute.</span>
                <span className="block text-[11px] text-slate-400 mt-1">Angazhimi për transparencë financiare dhe politikë të qartë korrigjimesh.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Spine Metric Lineage Modal */}
      {activeLineageMetric && (
        <ScoreLineagePanel
          isModal
          metricId={activeLineageMetric}
          isOpen={!!activeLineageMetric}
          onClose={() => setActiveLineageMetric(null)}
          onNavigateToClause={(clauseId) => {
            setSelectedClauseId(clauseId);
            switchSubView('kodi');
          }}
          onNavigateToIndicator={(indId) => {
            window.location.href = `/?page=maragonFramework#${indId}`;
          }}
          onNavigateToStep={(stepId) => {
            if (onNavigateToMethodology) onNavigateToMethodology();
            else window.location.href = `/?page=methodology#${stepId}`;
          }}
        />
      )}
    </div>
  );
};
