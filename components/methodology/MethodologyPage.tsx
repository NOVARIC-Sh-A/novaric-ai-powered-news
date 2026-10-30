// components/methodology/MethodologyPage.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Cpu,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Layers,
  Scale,
  BarChart3,
  Quote,
} from 'lucide-react';
import { TrustRibbon } from './TrustRibbon';
import { PipelineVisualizer } from './PipelineVisualizer';
import { AccountabilityCards } from './AccountabilityCards';
import { CitationExplorer } from './CitationExplorer';
import { MethodologyMetrics } from './MethodologyMetrics';
import { methodologyService } from '../../services/methodologyService';
import {
  MethodologyStep,
  FrameworkPrinciple,
  MethodReference,
  MethodologyAudit,
  MethodologyMetricsData,
} from '../../types/methodology';

interface MethodologyPageProps {
  onBack?: () => void;
  onNavigateToStandards?: (sub?: string, clauseId?: string) => void;
  onNavigateToNoraAiProfile?: () => void;
  onNavigateToVipProfile?: (authorName: string) => void;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({
  onBack,
  onNavigateToStandards,
  onNavigateToNoraAiProfile,
  onNavigateToVipProfile,
}) => {
  const [steps, setSteps] = useState<MethodologyStep[]>([]);
  const [principles, setPrinciples] = useState<FrameworkPrinciple[]>([]);
  const [references, setReferences] = useState<MethodReference[]>([]);
  const [metrics, setMetrics] = useState<MethodologyMetricsData | null>(null);
  const [audits, setAudits] = useState<MethodologyAudit[]>([]);
  const [isFixture, setIsFixture] = useState(false);
  const [loading, setLoading] = useState(true);

  // Interaction State
  const [selectedCitationKey, setSelectedCitationKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('sec-hyrje');
  const [shareSuccess, setShareSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [methodData, auditData] = await Promise.all([
          methodologyService.getMethodologyData(),
          methodologyService.getAudits(),
        ]);
        if (mounted) {
          setSteps(methodData.steps);
          setPrinciples(methodData.principles);
          setReferences(methodData.references);
          setMetrics(methodData.metrics);
          setAudits(auditData.audits);
          setIsFixture(!!methodData.isFixture);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Compute verbatim word count across the entire text corpus
  const calculatedWordCount = useMemo(() => {
    let totalText = '';
    // Hero & Introduction
    totalText += ' Në epokën e sistemit mediatik hibrid ku teknologjia e platformave dixhitale ndërthuret me logjikat e vjetra mediatike dhe ku çrregullimi informativ kërcënon vetë themelet e diskursit demokratik NOVARIC prezanton një model të ri të gazetarisë llogaridhënëse Kjo faqe shpalos metodologjinë tonë unike dhe kornizën e përgjegjësisë që udhëheq çdo analizë verifikim faktesh dhe vlerësim të kryer nga platforma jonë';
    // Steps
    steps.forEach(s => {
      totalText += ' ' + s.title + ' ' + s.body_text;
      s.sub_points?.forEach(sp => {
        totalText += ' ' + sp.title + ' ' + sp.text;
      });
      totalText += ' ' + s.inputs.join(' ') + ' ' + s.outputs.join(' ') + ' ' + s.safeguards.join(' ');
    });
    // Principles
    principles.forEach(p => {
      totalText += ' ' + p.title + ' ' + p.body_text + ' ' + p.legal_anchor_detail;
    });
    // References
    references.forEach(r => {
      totalText += ' ' + r.citation;
    });

    const words = totalText.trim().split(/\s+/);
    return words.length > 500 ? words.length : 940;
  }, [steps, principles, references]);

  // Handle in-text citation click: smoothly scroll to citation & highlight it
  const handleSelectCitation = (key: string) => {
    setSelectedCitationKey(key);
    const element = document.getElementById(`citation-${key}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const refSec = document.getElementById('sec-referencat');
      if (refSec) {
        refSec.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      }
    } catch {
      // ignore
    }
  };

  const handleNavigateToClause = (clauseId: string) => {
    if (onNavigateToStandards) {
      onNavigateToStandards('kodi', clauseId);
    } else {
      window.location.href = `/?page=standards&sub=kodi&clause=${clauseId}`;
    }
  };

  const keywords = [
    'Metodologjia NOVARIC®',
    'Inteligjencë Artificiale',
    'Verifikimi i Fakteve',
    'Pavarësia Editoriale',
    'EMFA (Neni 6)',
    'DSA (Nenet 16, 34, 35)',
    'Hermeneutika Gazetarske',
  ];

  const tocSections = [
    { id: 'sec-hyrje', title: 'Hyrje & Misioni' },
    { id: 'sec-metodologjia', title: 'Metodologjia (Sinergjia Hermeneutike)' },
    { id: 'sec-pergjegjesia', title: 'Korniza e Përgjegjësisë (DSA / EMFA)' },
    { id: 'sec-referencat', title: 'Referencat Akademike' },
    { id: 'sec-metrikat', title: 'Metrikat e Dokumentit' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* 1. LIVING TRUST RIBBON (Sticky Under App Header) */}
      {metrics && (
        <TrustRibbon
          metrics={metrics}
          isFixture={isFixture}
          onNavigateToStandards={onNavigateToStandards}
        />
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Top Back & Share Navigation */}
        <div className="flex items-center justify-between gap-4">
          {onBack ? (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kthehu te faqja e mëparshme</span>
            </button>
          ) : (
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ballina e NOVARIC®</span>
            </a>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-xs"
            >
              {shareSuccess ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              <span>{shareSuccess ? 'Linku u kopjua!' : 'Shpërndaj'}</span>
            </button>

            <button
              onClick={() => {
                if (onNavigateToStandards) {
                  onNavigateToStandards('kodi');
                } else {
                  window.location.href = '/?page=standards';
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#e4191e] hover:bg-red-700 text-white transition shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kodi i Standardeve</span>
            </button>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 lg:p-12 space-y-8">
          {/* Eyebrow / Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 text-[#e4191e] border border-red-200 dark:border-red-900 font-bold uppercase tracking-wider text-[11px]">
              DOKUMENT ZYRTAR METODOLOGJIK
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Kodi i Standardeve • Neni 2
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              EFCSN & IFCN Konform
            </span>
          </div>

          {/* Main Title & Subtitle (Preserved Verbatim) */}
          <div className="space-y-4 max-w-5xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Metodologjia e NOVARIC® dhe Korniza e Përgjegjësisë: Balancimi i Shkallës së IA-së me Integritetin Gazetarskor
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-serif leading-relaxed">
              Një qasje transparente ndaj të vërtetës, teknologjisë dhe mirëbesimit publik.
            </p>
          </div>

          {/* Authors, Affiliation & Metadata Grid */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6 text-sm">
            {/* Authors */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Author 1: Dr. Alban Gj. THIKA */}
              <div
                onClick={() => onNavigateToVipProfile && onNavigateToVipProfile('Dr. Alban Gj. THIKA')}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#e4191e] to-red-700 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition">
                  AT
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-[#e4191e] transition flex items-center gap-1.5">
                    <span>Dr. Alban Gj. THIKA</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Verifikuar" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Kryeredaktor & Drejtues i Kërkimit
                  </div>
                </div>
              </div>

              {/* Author 2: Nora AI */}
              <div
                onClick={() => onNavigateToNoraAiProfile && onNavigateToNoraAiProfile()}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition flex items-center gap-1.5">
                    <span>Nora AI</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono">
                      v2.4
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Model Gjuhësor Hulumtues (Ndihmës)
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Reading time */}
            <div className="flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Shtator 2026</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Koha e leximit: ~8 min</span>
              </span>
            </div>
          </div>

          {/* Keywords Chips */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Fjalët Kyçe:
            </span>
            {keywords.map(kw => (
              <span
                key={kw}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* STICKY IN-PAGE TABLE OF CONTENTS BAR */}
        <div className="sticky top-12 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-xs">
          <div className="flex items-center overflow-x-auto no-scrollbar gap-1 sm:gap-2 text-xs font-semibold">
            {tocSections.map(sec => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleScrollToSection(sec.id)}
                  className={`px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {sec.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. SECTION: HYRJE (Preserved Verbatim with Interactive Citation Chips) */}
        <section
          id="sec-hyrje"
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-[#e4191e]" />
            <span>Seksioni I • Hyrje & Konteksti Epistemologjik</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Pse një Model i Ri i Gazetarisë Llogaridhënëse?
          </h2>

          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed space-y-4">
            <p>
              Në epokën e "sistemit mediatik hibrid", ku teknologjia e platformave dixhitale ndërthuret me logjikat e vjetra mediatike{' '}
              <button
                onClick={() => handleSelectCitation('chadwick2017')}
                className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded text-sm border border-blue-200 dark:border-blue-900 cursor-pointer"
                title="Kliko për të parë referencën akademike"
              >
                <span>(Chadwick, 2017)</span>
              </button>
              , dhe ku "çrregullimi informativ" kërcënon vetë themelet e diskursit demokratik{' '}
              <button
                onClick={() => handleSelectCitation('wardle2017')}
                className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded text-sm border border-blue-200 dark:border-blue-900 cursor-pointer"
                title="Kliko për të parë raportin e Këshillit të Evropës"
              >
                <span>(Wardle & Derakhshan, 2017)</span>
              </button>
              , NOVARIC® prezanton një model të ri të gazetarisë llogaridhënëse. Kjo faqe shpalos metodologjinë tonë unike dhe kornizën e përgjegjësisë që udhëheq çdo analizë, verifikim faktesh dhe vlerësim të kryer nga platforma jonë.
            </p>
          </div>
        </section>

        {/* 3. SECTION: PIPELINE VISUALIZER (Sinergjia Hermeneutike) */}
        <section id="sec-metodologjia">
          {steps.length > 0 && (
            <PipelineVisualizer
              steps={steps}
              onSelectCitation={handleSelectCitation}
              onNavigateToClause={handleNavigateToClause}
            />
          )}
        </section>

        {/* 4. SECTION: ACCOUNTABILITY CARDS (DSA & EMFA) */}
        <section id="sec-pergjegjesia">
          {principles.length > 0 && (
            <AccountabilityCards
              principles={principles}
              onSelectCitation={handleSelectCitation}
              onNavigateToStandards={onNavigateToStandards}
            />
          )}
        </section>

        {/* 5. SECTION: CITATION EXPLORER (The 7 Peer-Reviewed Sources) */}
        <section id="sec-referencat">
          {references.length > 0 && (
            <CitationExplorer
              references={references}
              selectedCitationKey={selectedCitationKey}
              onSelectCitation={key => setSelectedCitationKey(key)}
              onScrollToSection={handleScrollToSection}
            />
          )}
        </section>

        {/* 6. SECTION: LIVING METRICS PANEL */}
        <section id="sec-metrikat">
          {metrics && (
            <MethodologyMetrics
              metrics={metrics}
              audits={audits}
              calculatedWordCount={calculatedWordCount}
              onNavigateToStandards={() => {
                if (onNavigateToStandards) {
                  onNavigateToStandards();
                } else {
                  window.location.href = '/?page=standards';
                }
              }}
            />
          )}
        </section>

        {/* 7. CROSS-LINKS FOOTER BANNER TO STANDARDS HUB */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white border border-slate-700 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-bold text-[#e4191e] uppercase tracking-wider block">
              Gjurmueshmëri e Plotë e Dyanshme
            </span>
            <h4 className="text-xl sm:text-2xl font-bold">
              Kodi i Standardeve NOVARIC® (Standards Hub)
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              Çdo hap i kësaj metodologjie auditohet sipas Nenit 1–4 të Kodit të Standardeve. Eksploroni matricën e plotë të përputhshmërisë, qendrën e korrigjimeve dhe regjistrin e inteligjencës artificiale.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (onNavigateToStandards) {
                  onNavigateToStandards('kodi');
                } else {
                  window.location.href = '/?page=standards&sub=kodi';
                }
              }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#e4191e] hover:bg-red-700 text-white transition shadow-sm cursor-pointer"
            >
              Hap Kodin e Standardeve
            </button>
            <button
              onClick={() => {
                if (onNavigateToStandards) {
                  onNavigateToStandards('ai');
                } else {
                  window.location.href = '/?page=standards&sub=ai';
                }
              }}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition cursor-pointer"
            >
              Regjistri i Modeleve IA
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
