// components/MediaEducationFrameworkPage.tsx
import React, { useState } from 'react';
import { renderWithSuperscript } from '../utils/textUtils';
import { 
  ShieldCheckIcon, 
  BeakerIcon, 
  ScaleIcon, 
  AcademicCapIcon, 
  DocumentTextIcon 
} from './icons';
import { 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  Activity, 
  Shield, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  Info
} from 'lucide-react';
import { JsonLd } from './JsonLd';
import { AnalyticalSpine, SpineTier } from './analytics/AnalyticalSpine';
import { ConceptTooltip } from './analytics/ConceptTooltip';
import { ScoreLineagePanel } from './analytics/ScoreLineagePanel';

export interface MediaEducationFrameworkPageProps {
  onBack: () => void;
  onNavigateToNovaricCodeOfStandards: () => void;
  onNavigateToNoraAiProfile?: () => void;
  onNavigateToVipProfile?: (id: string | number) => void;
  onNavigateToArticleMetricsExplained?: () => void;
  onNavigateToAnalysisMethodology?: () => void;
  onNavigateToMaragonFramework?: () => void;
  onNavigateToNewsList?: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode; id?: string }> = ({ title, children, id }) => (
  <section id={id} className="mb-10 scroll-mt-20">
    <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-primary-500/30">
      {title}
    </h2>
    <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-justify space-y-4">
      {children}
    </div>
  </section>
);

const SubSection: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  icon?: React.ReactNode;
  id?: string;
  badge?: string;
}> = ({ title, children, icon, id, badge }) => (
  <div id={id} className="mt-6 bg-slate-50 dark:bg-slate-900/50 p-5 sm:p-6 rounded-xl border-l-4 border-primary-500 shadow-sm scroll-mt-24">
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
      <h3 className="text-xl font-bold text-primary-800 dark:text-primary-300 flex items-center">
        {icon && <span className="mr-2 text-primary-600 dark:text-primary-400">{icon}</span>}
        {title}
      </h3>
      {badge && (
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/70 text-primary-800 dark:text-primary-300 border border-primary-300 dark:border-primary-800 font-semibold">
          {badge}
        </span>
      )}
    </div>
    <div className="space-y-3 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
      {children}
    </div>
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  metricId: string;
  label: string;
  value: string;
  description: string;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  metricId, 
  label, 
  value, 
  description, 
  onClick 
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group w-full text-left bg-white dark:bg-slate-900/70 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    title="Kliko për të hapur dekompozimin e plotë të kësaj metrike (ScoreLineagePanel)"
  >
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="p-2.5 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {metricId}
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            TË DHËNA DEMO
          </span>
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {label}
        </h4>
        <span className="font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
          {value}
        </span>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
    <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-primary-600 dark:text-primary-400 group-hover:translate-x-0.5 transition-transform">
      <span className="flex items-center gap-1">
        <Activity className="w-3 h-3" />
        Dekompozimi i Metrikës
      </span>
      <ArrowRight className="w-3.5 h-3.5" />
    </div>
  </button>
);

export const MediaEducationFrameworkPage: React.FC<MediaEducationFrameworkPageProps> = ({ 
  onBack, 
  onNavigateToNovaricCodeOfStandards, 
  onNavigateToNoraAiProfile, 
  onNavigateToVipProfile, 
  onNavigateToArticleMetricsExplained,
  onNavigateToAnalysisMethodology,
  onNavigateToMaragonFramework,
  onNavigateToNewsList,
}) => {
  const [selectedMetricForLineage, setSelectedMetricForLineage] = useState<string | null>(null);

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Korniza e Vlerësimit Mediatik & Metodologjia: Mjete për të Vlerësuar Besueshmërinë dhe Profesionalizmin e Medias",
    "author": { "@type": "Person", "name": "Dr Alban Gj. THIKA" },
    "publisher": { "@type": "Organization", "name": "NOVARIC®" },
    "datePublished": "2025-09-01T22:00:00+02:00",
    "dateModified": "2025-10-20T17:00:00+02:00",
    "description": "Një kornizë logjike dhe një listë kontrolli mendore e bazuar në standarde ndërkombëtare, e dizajnuar nga NOVARIC® për të fuqizuar qytetarët shqiptarë me mjetet e duhura për të lundruar në një mjedis mediatik kompleks.",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "https://novaric.al/page/mediaEducationFramework" },
    "keywords": "Vlerësim Mediatik, Edukim Mediatik, Mendim Kritik, Besueshmëria e Medias, Verifikim Faktesh Shqipëri, Anshmëri Mediatike, Transparencë Mediatike, EFCSN, IFCN, The Trust Project, NOVARIC"
  };

  const handleSpineNavigate = (tier: SpineTier) => {
    switch (tier) {
      case 'doktrina':
        onNavigateToNovaricCodeOfStandards();
        break;
      case 'metoda':
        if (onNavigateToAnalysisMethodology) onNavigateToAnalysisMethodology();
        else window.location.href = '/?page=analysisMethodology';
        break;
      case 'korniza':
        if (onNavigateToMaragonFramework) onNavigateToMaragonFramework();
        else window.location.href = '/?page=maragonFramework';
        break;
      case 'vleresimi':
        if (onNavigateToArticleMetricsExplained) onNavigateToArticleMetricsExplained();
        else window.location.href = '/?page=articleMetricsExplained';
        break;
      case 'udhezues':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'entiteti':
        if (onNavigateToNewsList) onNavigateToNewsList();
        else window.location.href = '/?page=newsList';
        break;
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <JsonLd data={jsonLdData} />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800/95 p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700/80">
        
        {/* Top Back & Header Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-lg shadow-sm transition text-slate-800 dark:text-slate-100 text-sm"
          >
            &larr; <span className="ml-2">Kthehu Pas</span>
          </button>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
            Shtresa Publike • Edukimi Mediatik
          </span>
        </div>

        {/* Page Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Korniza e Vlerësimit Mediatik & Metodologjia
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
            Mjete për të Vlerësuar Besueshmërinë dhe Profesionalizmin e Medias
          </p>

          <div className="mt-6">
            <div className="flex justify-center items-center mb-2">
              <div className="relative flex items-center">
                <button 
                  onClick={onNavigateToNoraAiProfile} 
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full transition-transform hover:scale-105 z-10"
                  aria-label="Profili i Nora (AI)"
                >
                  <img 
                    src="https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg" 
                    alt="Përfaqësimi i Nora (AI)"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
                    title="Nora (AI)"
                  />
                </button>
                <button 
                  onClick={() => onNavigateToVipProfile && onNavigateToVipProfile('vip33')} 
                  className="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full -ml-5 relative transition-transform hover:scale-105"
                  aria-label="Profili i Dr Alban Gj. THIKA"
                >
                  <img 
                    src="https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png" 
                    alt="Dr Alban Gj. THIKA"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
                    title="Dr Alban Gj. THIKA"
                  />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Një punë hibride nga{' '}
              <button 
                onClick={onNavigateToNoraAiProfile} 
                className="font-bold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none"
              >
                Nora (AI)
              </button>{' '}
              &{' '}
              <button 
                onClick={() => onNavigateToVipProfile && onNavigateToVipProfile('vip33')} 
                className="font-bold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none"
              >
                Dr Alban Gj. THIKA
              </button>
            </p>
          </div>
        </header>

        {/* Analytical Spine Ribbon: Highlighted at 'udhezues' */}
        <div className="mb-10 -mx-6 sm:-mx-10">
          <AnalyticalSpine 
            currentTier="udhezues" 
            onNavigateTier={handleSpineNavigate}
          />
        </div>

        {/* Section: Hyrje */}
        <Section title="Hyrje" id="hyrje">
          <p>
            Në një mjedis informacioni të mbingarkuar, qytetarët kanë nevojë për mjete konkrete për të dalluar gazetarinë profesionale nga dezinformimi dhe propaganda. Korniza e Vlerësimit Mediatik e {renderWithSuperscript('NOVARIC®')} është një udhëzues metodologjik që bazohet në standardet më të mira ndërkombëtare për të ndihmuar publikun të vlerësojë besueshmërinë e burimeve dhe të dhënat e paraqitura.
          </p>

          {/* Task 2: Visible CTA Card to Standards Hub */}
          <div className="mt-5 p-5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-slate-700 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
                <Shield className="w-4 h-4" />
                <span>Doktrina Baze</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Kodi i Standardeve të {renderWithSuperscript('NOVARIC®')} — kuadri që ky udhëzues e zbason
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Eksploroni 31 klauzolat e Kodit Deontologjik të përafruara me EFCSN, IFCN dhe Rregulloren Evropiane të Shërbimeve Dixhitale (DSA/EMFA).
              </p>
            </div>
            <button
              onClick={onNavigateToNovaricCodeOfStandards}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#e4191e] hover:bg-[#c01418] text-white font-bold text-xs sm:text-sm tracking-wide transition shadow cursor-pointer shrink-0"
            >
              <span>Shko te Kodi i Standardeve</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Section>

        {/* Section: Shtyllat e Vlerësimit */}
        <Section title="Shtyllat e Vlerësimit" id="shtyllat">
          <div className="grid grid-cols-1 gap-6">

            {/* Shtylla 1 */}
            <SubSection 
              title="1. Transparenca dhe Pronësia" 
              icon={<ShieldCheckIcon className="w-6 h-6"/>}
              id="shtylla-1-transparenca"
              badge="Shtylla 1"
            >
              <p>
                Kush e kontrollon median? Një media e besueshme duhet të jetë transparente rreth pronësisë së saj, burimeve të financimit dhe interesave të tjera të mundshme. Në kuadrin e {renderWithSuperscript('NOVARIC®')}, ne i kushtojmë vëmendje të veçantë{' '}
                <ConceptTooltip conceptId="concept:field_autonomy">
                  pavarësisë editoriale
                </ConceptTooltip>{' '}
                nga financuesit.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                Qytetarët udhëzohen të kërkojnë të dhëna për{' '}
                <ConceptTooltip conceptId="concept:media_capture">
                  transparencën e pronësisë
                </ConceptTooltip>{' '}
                dhe të kuptojnë nëse një platformë i nënshtrohet modelit të{' '}
                <ConceptTooltip conceptId="concept:polarized_pluralism">
                  pluralizmit të polarizuar
                </ConceptTooltip>.
              </p>

              {/* Bazohet në strip for Shtylla 1 */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-primary-600" /> Bazohet në:
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Standards */}
                  <a
                    href="/?page=standards&sub=kodi&clause=TRANSP-4.1A#clause-TRANSP-4.1A"
                    onClick={(e) => { e.preventDefault(); onNavigateToNovaricCodeOfStandards(); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-mono text-[11px] font-semibold transition"
                    title="Neni 4.1: Transparenca e Pronësisë dhe Përfituesve Fundorë"
                  >
                    <Shield className="w-3 h-3 text-sky-600" />
                    <span>std:TR-4.1</span>
                  </a>
                  <a
                    href="/?page=standards&sub=kodi&clause=TRANSP-4.2A#clause-TRANSP-4.2A"
                    onClick={(e) => { e.preventDefault(); onNavigateToNovaricCodeOfStandards(); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-mono text-[11px] font-semibold transition"
                    title="Neni 4.2: Transparenca e Financimit dhe Reklamave"
                  >
                    <Shield className="w-3 h-3 text-sky-600" />
                    <span>std:TR-4.2</span>
                  </a>
                  <a
                    href="/?page=standards&sub=kodi&clause=ETIK-3.1A#clause-ETIK-3.1A"
                    onClick={(e) => { e.preventDefault(); onNavigateToNovaricCodeOfStandards(); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-mono text-[11px] font-semibold transition"
                    title="Neni 3.1: Pavarësia Editoriale dhe Konflikti i Interesit"
                  >
                    <Shield className="w-3 h-3 text-sky-600" />
                    <span>std:ET-3.1</span>
                  </a>

                  {/* MARAGON */}
                  <a
                    href="/?page=maragonFramework#maragon:G3.1"
                    onClick={(e) => { if (onNavigateToMaragonFramework) { e.preventDefault(); onNavigateToMaragonFramework(); } }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-mono text-[11px] font-semibold transition"
                    title="MARAGON G3.1: Qeverisja, Pronësia dhe Struktura e Korporatës"
                  >
                    <Layers className="w-3 h-3 text-rose-600" />
                    <span>maragon:G3.1</span>
                  </a>

                  {/* Concepts */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px]">
                    <ConceptTooltip conceptId="concept:media_capture">concept:media_capture</ConceptTooltip>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px]">
                    <ConceptTooltip conceptId="concept:polarized_pluralism">concept:polarized_pluralism</ConceptTooltip>
                  </span>
                </div>
              </div>
            </SubSection>

            {/* Shtylla 2 */}
            <SubSection 
              title="2. Metodologjia e Verifikimit" 
              icon={<BeakerIcon className="w-6 h-6"/>}
              id="shtylla-2-verifikimi"
              badge="Shtylla 2"
            >
              <p>
                Si arrihet te faktet?{' '}
                <ConceptTooltip conceptId="concept:hermeneutic_circle">
                  Verifikimi
                </ConceptTooltip>{' '}
                i fakteve nuk është thjesht një proces teknik, por një angazhim etik. Ne përdorim sinergjinë midis inteligjencës artificiale dhe mbikëqyrjes njerëzore për të siguruar saktësinë maksimale.
              </p>

              {/* Bazohet në strip for Shtylla 2 */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-600" /> Bazohet në:
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Methodology Pipeline Steps */}
                  <a
                    href="/?page=analysisMethodology#meth:step-1"
                    onClick={(e) => { if (onNavigateToAnalysisMethodology) { e.preventDefault(); onNavigateToAnalysisMethodology(); } }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-mono text-[11px] font-semibold transition"
                    title="Hapi 1 i Metodologjisë: Analiza Fillestare IA"
                  >
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>meth:step-1</span>
                  </a>
                  <a
                    href="/?page=analysisMethodology#meth:step-2"
                    onClick={(e) => { if (onNavigateToAnalysisMethodology) { e.preventDefault(); onNavigateToAnalysisMethodology(); } }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-mono text-[11px] font-semibold transition"
                    title="Hapi 2 i Metodologjisë: Gjenerimi i Draftit"
                  >
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>meth:step-2</span>
                  </a>
                  <a
                    href="/?page=analysisMethodology#meth:step-3"
                    onClick={(e) => { if (onNavigateToAnalysisMethodology) { e.preventDefault(); onNavigateToAnalysisMethodology(); } }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-mono text-[11px] font-semibold transition"
                    title="Hapi 3 i Metodologjisë: Mbikëqyrja Hermeneutike (HITL)"
                  >
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>meth:step-3</span>
                  </a>

                  {/* Standards MET-B..MET-J */}
                  <a
                    href="/?page=standards&sub=kodi&clause=MET-B#clause-MET-B"
                    onClick={(e) => { e.preventDefault(); onNavigateToNovaricCodeOfStandards(); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-mono text-[11px] font-semibold transition"
                    title="Klauzolat e Metodologjisë së Hapur të Verifikimit (MET-B deri MET-J)"
                  >
                    <Shield className="w-3 h-3 text-sky-600" />
                    <span>std:MET-B..MET-J</span>
                  </a>
                </div>
              </div>
            </SubSection>

            {/* Shtylla 3 */}
            <SubSection 
              title="3. Llogaridhënia dhe Etika" 
              icon={<ScaleIcon className="w-6 h-6"/>}
              id="shtylla-3-llogaridhënia"
              badge="Shtylla 3"
            >
              <p>
                A i pranon media gabimet e saj? Një komponent kyç i profesionalizmit është gatishmëria për të korrigjuar informacionin e pasaktë në mënyrë transparente dhe të shpejtë. Parimi i{' '}
                <ConceptTooltip conceptId="concept:public_journalism">
                  llogaridhënies
                </ConceptTooltip>{' '}
                qëndron në thelb të besueshmërisë demokratike.
              </p>

              {/* Bazohet në strip for Shtylla 3 */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-600" /> Bazohet në:
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <a
                    href="/?page=standards&sub=kodi&clause=ETIK-3.3A#clause-ETIK-3.3A"
                    onClick={(e) => { e.preventDefault(); onNavigateToNovaricCodeOfStandards(); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-mono text-[11px] font-semibold transition"
                    title="Neni 3.3: Politika e Korrigjimeve dhe E Drejta e Përgjigjes"
                  >
                    <Shield className="w-3 h-3 text-sky-600" />
                    <span>std:ET-3.3 (korrigjimet)</span>
                  </a>
                  <a
                    href="/?page=standards&sub=korrigjime"
                    onClick={(e) => { e.preventDefault(); onNavigateToNovaricCodeOfStandards(); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono text-[11px] font-semibold transition"
                    title="Qendra e Korrigjimeve NOVARIC®"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>/standards/korrigjime</span>
                  </a>
                </div>
              </div>
            </SubSection>

          </div>
        </Section>

        {/* Section: Metrikat e Avancuara të Artikullit */}
        <Section title="Metrikat e Avancuara të Artikullit" id="metrikat">
          <p>
            Për çdo artikull të analizuar, ne llogarisim një set metrikash që ofrojnë një pasqyrë sasiore të cilësisë:
          </p>

          {/* 4 StatCard-based interactive tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {/* Metric 1 */}
            <StatCard
              icon={<ShieldCheckIcon className="w-5 h-5" />}
              metricId="metric:credibility"
              label="Besueshmëria e Burimeve"
              value="87.4%"
              description="Vlerësimi i reputacionit të burimeve të cituara, verifikimi i pretendimeve dhe triangulimi me arkiva zyrtare."
              onClick={() => setSelectedMetricForLineage('metric:credibility')}
            />

            {/* Metric 2 */}
            <StatCard
              icon={<DocumentTextIcon className="w-5 h-5" />}
              metricId="metric:readability"
              label="Lexueshmëria (Flesch-Kincaid)"
              value="68.2"
              description="Kompleksiteti gjuhësor dhe aksesueshmëria e tekstit; parandalon zhargonin e tepruar dhe praktikat e pasivizuara."
              onClick={() => setSelectedMetricForLineage('metric:readability')}
            />

            {/* Metric 3 */}
            <div id="metrika-objektiviteti-toni" className="scroll-mt-24">
              <StatCard
                icon={<ScaleIcon className="w-5 h-5" />}
                metricId="metric:bias_sentiment"
                label="Objektiviteti dhe Toni"
                value="91.0%"
                description="Matja e sentimentit dhe gjuhës emocionale; evidenton kornizimin e njëanshëm (Framing) dhe animet emotive."
                onClick={() => setSelectedMetricForLineage('metric:bias_sentiment')}
              />
            </div>

            {/* Metric 4 */}
            <StatCard
              icon={<BeakerIcon className="w-5 h-5" />}
              metricId="metric:lifecycle_compliance"
              label="Pajtimi me Standardet"
              value="94.5%"
              description="Vlerësimi i përputhshmërisë me Kodin e Etikës, transparencën editoriale dhe protokollin e korrigjimeve."
              onClick={() => setSelectedMetricForLineage('metric:lifecycle_compliance')}
            />
          </div>

          {/* Action Buttons: Learn more & Forward link */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button 
              onClick={onNavigateToArticleMetricsExplained}
              className="text-primary-600 dark:text-primary-400 font-bold hover:underline inline-flex items-center gap-1.5 cursor-pointer text-sm"
            >
              <span>Mësoni më shumë rreth Metrikave</span>
              <span>&rarr;</span>
            </button>

            <button
              onClick={() => {
                if (onNavigateToNewsList) onNavigateToNewsList();
                else window.location.href = '/?page=newsList';
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm tracking-wide transition shadow cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Shiko këto metrika live në Matricën e Integritetit &rarr;</span>
            </button>
          </div>
        </Section>

        {/* Section: Standardet e Referencës (Outbound Strip) */}
        <Section title="Standardet e Referencës" id="standardet-references">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Kjo kornizë publike ankorohet drejtpërdrejt në normat dhe kodet ndërkombëtare të verifikimit të fakteve dhe integritetit mediatik:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* IFCN Card */}
            <a
              href="https://ifcncodeofprinciples.poynter.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                    IFCN
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  IFCN Code of Principles
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Përkushtim ndaj paanshmërisë, transparencës së burimeve, transparencës së financimit dhe politikës së hapur të korrigjimeve.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Ankoron: Shtylla 2 & 3 (std:MET-B..MET-J, std:ET-3.3)
              </div>
            </a>

            {/* EFCSN Card */}
            <a
              href="https://efcsn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                    EFCSN
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  EFCSN Code of Practice
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Kodi Evropian i Integritetit Profesional për organizatat e verifikimit të fakteve (pajtueshmëri me rregulloren DSA/EMFA të BE-së).
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Ankoron: Shtylla 1 & 2 (std:TR-4.1, std:MET-A..MET-J)
              </div>
            </a>

            {/* The Trust Project Card */}
            <a
              href="https://thetrustproject.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-rose-500 transition shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                    TRUST PROJECT
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  The Trust Project
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Korniza globale e 8 Treguesve të Besueshmërisë për gazetarinë e përgjegjshme dhe identifikimin e burimeve të verifikuara.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Ankoron: Shtylla 1 & Metrika e Besueshmërisë (std:TR-4.1, metric:credibility)
              </div>
            </a>
          </div>
        </Section>

        {/* Bottom Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition cursor-pointer"
          >
            Kthehu Pas
          </button>
        </div>

      </div>

      {/* Lineage Modal Panel */}
      {selectedMetricForLineage && (
        <ScoreLineagePanel
          metricId={selectedMetricForLineage}
          isOpen={!!selectedMetricForLineage}
          isModal={true}
          onClose={() => setSelectedMetricForLineage(null)}
          onNavigateToClause={(clauseId) => {
            setSelectedMetricForLineage(null);
            onNavigateToNovaricCodeOfStandards();
          }}
          onNavigateToIndicator={(indId) => {
            setSelectedMetricForLineage(null);
            if (onNavigateToMaragonFramework) onNavigateToMaragonFramework();
          }}
          onNavigateToStep={(stepId) => {
            setSelectedMetricForLineage(null);
            if (onNavigateToAnalysisMethodology) onNavigateToAnalysisMethodology();
          }}
        />
      )}
    </main>
  );
};
