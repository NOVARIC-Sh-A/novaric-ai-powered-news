
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { VipProfile, ParagonEntry, Archetype } from '../types';
import { PoliticianComparisonModal } from './PoliticianComparisonModal';
import { MediaPersonalityCard } from './MediaPersonalityCard';
import { renderWithSuperscript } from '../utils/textUtils';
import { CpuChipIcon, HeartIcon, ArrowPathIcon } from './icons';
import { SocialToxicityModal } from './SocialToxicityModal';
import { AletheiaModal } from './AletheiaModal';
import { LetheModal } from './LetheModal';
import { HorizonModal } from './HorizonModal';
import { useLanguage } from '../contexts/LanguageContext';
import { isMaragonAssessmentPublished, publishedMaragonAverage } from '../utils/maragonPublication';

/* --------------------------------------------------------
   TYPES
-------------------------------------------------------- */

type RankedMediaProfile = VipProfile & {
  averageMaragonScore: number | null;
  influenceScore: number | null;
  archetype: Archetype;
};

/* --------------------------------------------------------
   HELPERS: SCORING / NORMALIZATION
-------------------------------------------------------- */

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, value));

/**
 * Archetype calculation based on MARAGON dimensions.
 */
const getArchetype = (analysis: ParagonEntry[] | undefined): Archetype => {
  if (!analysis || analysis.length === 0) return 'I Paidentifikuar';

  const scores: { [key: string]: number | null } = {};
  analysis.forEach((dim) => {
    scores[dim.dimension] = typeof dim.score === 'number' && Number.isFinite(dim.score) ? dim.score : null;
  });

  const highThreshold = 85;

  const atLeast = (key: string, threshold: number) => {
    const value = scores[key];
    return value !== null && value !== undefined && value >= threshold;
  };

  if (
    atLeast('Thellësia e Analizës/Pyetjeve', highThreshold) &&
    atLeast('Saktësia Faktike & Verifikimi', highThreshold)
  ) {
    return 'Analisti';
  }
  if (
    atLeast('Paanshmëria, Balanca & Anshmëria', highThreshold) &&
    atLeast('Profesionalizmi në Kriza', highThreshold)
  ) {
    return 'Moderatori';
  }
  if (atLeast('Qartësia & Koherenca', 90)) {
    return 'Komunikatori';
  }
  if (
    atLeast('Pajtueshmëria Etike', highThreshold) &&
    atLeast('Promovimi i të Menduarit Kritik', 80)
  ) {
    return 'Roja Publik';
  }

  const sorted = Object.entries(scores)
    .filter((entry): entry is [string, number] => typeof entry[1] === 'number')
    .sort(([, a], [, b]) => b - a);
  switch (sorted[0]?.[0]) {
    case 'Thellësia e Analizës/Pyetjeve':
      return 'Analisti';
    case 'Paanshmëria, Balanca & Anshmëria':
      return 'Moderatori';
    case 'Qartësia & Koherenca':
      return 'Komunikatori';
    case 'Pajtueshmëria Etike':
      return 'Roja Publik';
    default:
      return 'I Paidentifikuar';
  }
};

const normalizeReach = (rawReach?: number): number => {
  if (!rawReach || rawReach <= 0) return 0;
  const capped = Math.min(rawReach, 1_000_000); // cap at 1M
  return clamp((capped / 1_000_000) * 100);
};

const normalizeEngagement = (rawEngagement?: number): number => {
  if (rawEngagement == null) return 0;
  if (rawEngagement <= 1) {
    return clamp(rawEngagement * 100);
  }
  return clamp(rawEngagement);
};

const normalizeSentiment = (rawSentiment?: number): number => {
  if (rawSentiment == null) return 50; // neutral fallback
  if (rawSentiment >= -1 && rawSentiment <= 1) {
    return clamp(((rawSentiment + 1) / 2) * 100);
  }
  return clamp(rawSentiment);
};

const computeInfluenceScore = (params: {
  maragonAvg: number | null;
  reachScore: number;
  engagementScore: number;
  sentimentScore: number;
}): number | null => {
  const { maragonAvg, reachScore, engagementScore, sentimentScore } = params;
  if (maragonAvg === null) return null;
  const maragonWeight = 0.6;
  const reachWeight = 0.25;
  const engagementSentimentWeight = 0.15;
  const engagementSentCompound = (engagementScore + sentimentScore) / 2;
  const score =
    maragonAvg * maragonWeight +
    reachScore * reachWeight +
    engagementSentCompound * engagementSentimentWeight;
  return Math.round(clamp(score));
};

/* --------------------------------------------------------
   PROPS
-------------------------------------------------------- */

interface MediaPersonalitiesPageProps {
  profiles: VipProfile[];
  onBack: () => void;
  onNavigateToProfilePage: (profile: VipProfile) => void;
  onNavigateToPoliticians: () => void;
  onNavigateToJudiciary: () => void;
  onNavigateToBusiness: () => void;
  onNavigateToMaragonFramework: () => void;
  onNavigateToAnalysis?: (id: string | number) => void;
}

/* --------------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------------- */

export const MediaPersonalitiesPage: React.FC<MediaPersonalitiesPageProps> = ({
  profiles: initialProfiles,
  onBack,
  onNavigateToProfilePage,
  onNavigateToPoliticians,
  onNavigateToJudiciary,
  onNavigateToBusiness,
  onNavigateToMaragonFramework,
  onNavigateToAnalysis
}) => {
  const [comparisonList, setComparisonList] = useState<(string | number)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToxicityModalOpen, setIsToxicityModalOpen] = useState(false);
  const [isAletheiaModalOpen, setIsAletheiaModalOpen] = useState(false);
  const [isLetheModalOpen, setIsLetheModalOpen] = useState(false);
  const [isHorizonModalOpen, setIsHorizonModalOpen] = useState(false);
  // Use global language context
  const { language: lang, toggleLanguage } = useLanguage();

  const translations = {
      sq: {
          scannerTitle: 'SKANER',
          systemStatus: 'STATUSI I SISTEMIT: ONLINE',
          tracking: 'SUBJEKTE NË GJURMIM',
          returnRoot: 'KTHEHU NË BAZË',
          sort: 'RENDITJA:',
          class: 'KATEGORIA:',
          noSubjects: 'NUK U GJET ASNJË SUBJEKT',
          adjustFilters: 'Rregulloni parametrat e filtrimit.',
          compare: 'KRAHASO',
          systemKeysLabel: 'ÇELËSAT E SISTEMIT:',
          systemKeys: {
              toxicity: 'TOKSICITETI SOCIAL',
              toxicityDesc: 'Indeksi i Dëmit Social',
              aletheia: 'ALETHEIA',
              aletheiaDesc: 'Indeksi i Vërtetësisë',
              lethe: 'LETHE',
              letheDesc: 'Indeksi i Harresës',
              horizon: 'HORIZON',
              horizonDesc: 'Indeksi i Mendësisë',
              csr: 'CSR',
              csrDesc: 'Dimensioni i Rezonancës Etike'
          },
          sortOptions: {
              influence: 'Indeksi i Ndikimit',
              maragon: 'Pikët Paragon',
              name: 'Alfabetike'
          },
          classOptions: {
              all: 'Të Gjithë',
              analyst: 'Analisti',
              moderator: 'Moderatori',
              communicator: 'Komunikatori',
              watchdog: 'Roja Publik'
          },
          card: {
              socialToxicity: 'TOKSICITETI SOCIAL',
          }
      },
      en: {
          scannerTitle: 'SCANNER',
          systemStatus: 'SYSTEM STATUS: ONLINE',
          tracking: 'TRACKING',
          returnRoot: 'RETURN TO BASE',
          sort: 'SORT:',
          class: 'CLASS:',
          noSubjects: 'NO SUBJECTS FOUND',
          adjustFilters: 'Adjust filtering parameters.',
          compare: 'COMPARE',
          systemKeysLabel: 'SYSTEM KEYS:',
          systemKeys: {
              toxicity: 'SOCIAL TOXICITY',
              toxicityDesc: 'The Social Harm Index',
              aletheia: 'ALETHEIA',
              aletheiaDesc: 'The Truth Index',
              lethe: 'LETHE',
              letheDesc: 'The Omission Index',
              horizon: 'HORIZON',
              horizonDesc: 'The Mindset Index',
              csr: 'CSR',
              csrDesc: 'The Ethical Resonance Dimension'
          },
          sortOptions: {
              influence: 'Influence Index',
              maragon: 'Paragon Score',
              name: 'Alpha'
          },
          classOptions: {
              all: 'All',
              analyst: 'Analyst',
              moderator: 'Moderator',
              communicator: 'Communicator',
              watchdog: 'Watchdog'
          },
          card: {
              socialToxicity: 'SOCIAL TOXICITY',
          }
      }
  };

  const t = translations[lang];

  const [sortMode, setSortMode] = useState<'influence' | 'maragon' | 'name'>(
    'name'
  );
  const [archetypeFilter, setArchetypeFilter] = useState<
    Archetype | 'Të Gjithë'
  >('Të Gjithë');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);

  const MAX_COMPARE_ITEMS = 3;

  const handleCompareToggle = (id: string | number) => {
    setComparisonList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length < MAX_COMPARE_ITEMS) {
        return [...prev, id];
      }
      return prev;
    });
  };
  
  const normalizedProfiles = useMemo(
    () =>
      initialProfiles.map((p) => ({
        ...p,
        category: p.category || "Media",
      })),
    [initialProfiles]
  );

  const rankedMedia = useMemo(() => {
    const mediaPersonalities = normalizedProfiles.filter(profile => {
        const cat = (profile.category || 'Media').toLowerCase();
        if (cat.startsWith('politikë') || cat.startsWith('politike')) return false;
        if (cat.startsWith('gjykata') || cat.includes('gjudiciar')) return false;
        if (cat === 'biznes' || cat.startsWith('business')) return false;
        return true;
    });

    const enriched: RankedMediaProfile[] = mediaPersonalities.map(p => {
        const published = isMaragonAssessmentPublished(p);
        const averageMaragonScore = publishedMaragonAverage(p);
        const archetype = published ? getArchetype(p.maragonAnalysis) : 'I Paidentifikuar';

        const audienceReach: number | undefined = (p as any).audienceReach;
        const engagementRate: number | undefined = (p as any).engagementRate;
        const sentimentScoreRaw: number | undefined = (p as any).sentimentScore;

        const reachScore = normalizeReach(audienceReach);
        const engagementScore = normalizeEngagement(engagementRate);
        const sentimentScore = normalizeSentiment(sentimentScoreRaw);

        const influenceScore = published ? computeInfluenceScore({
            maragonAvg: averageMaragonScore,
            reachScore,
            engagementScore,
            sentimentScore
        }) : null;

        return {
            ...p,
            averageMaragonScore,
            latestScore: published ? p.latestScore : undefined,
            aletheiaScore: published ? p.aletheiaScore : undefined,
            influenceScore,
            archetype,
            paragon: undefined,
        };
    });

    const scoreRankingAvailable = enriched.some(
      (profile) => profile.averageMaragonScore !== null || profile.influenceScore !== null
    );
    const effectiveSort = scoreRankingAvailable ? sortMode : 'name';

    const byMeasuredDesc = (left: number | null, right: number | null) => {
      if (left === null && right === null) return 0;
      if (left === null) return 1;
      if (right === null) return -1;
      return right - left;
    };

    const sorted = [...enriched].sort((a, b) => {
      switch (effectiveSort) {
        case 'maragon': return byMeasuredDesc(a.averageMaragonScore, b.averageMaragonScore) || String(a.name).localeCompare(String(b.name));
        case 'name': return String(a.name).localeCompare(String(b.name));
        case 'influence':
        default: return byMeasuredDesc(a.influenceScore, b.influenceScore) || String(a.name).localeCompare(String(b.name));
      }
    });

    const visible = sorted.filter((p) => {
      if (effectiveSort !== 'name') {
        const scoreToCheck = effectiveSort === 'maragon' ? p.averageMaragonScore : p.influenceScore;
        if (scoreToCheck === null || scoreToCheck < minScoreFilter) return false;
      }
      if (archetypeFilter !== 'Të Gjithë' && p.archetype !== archetypeFilter) return false;
      return true;
    });

    return { profiles: visible, scoreRankingAvailable, effectiveSort };
  }, [normalizedProfiles, sortMode, archetypeFilter, minScoreFilter]);

  const processedAndRankedMedia = rankedMedia.profiles;
  const scoreRankingAvailable = rankedMedia.scoreRankingAvailable;
  const effectiveSort = rankedMedia.effectiveSort;


  const comparisonProfiles = useMemo(() => {
    return processedAndRankedMedia.filter((p) => comparisonList.includes(p.id));
  }, [comparisonList, processedAndRankedMedia]);

  return (
    <>
      <main className="flex-grow min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans relative overflow-hidden">
        
        <div className="container mx-auto px-4 py-8 relative z-10">
            
            {/* --- HEADER: The System Monitor Look --- */}
            <div className="border-b border-slate-300 dark:border-slate-700 pb-6 mb-8">
                <div className="flex justify-between items-end mb-4">
                     <div>
                         <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase mb-1">
                             <button 
                                onClick={onNavigateToMaragonFramework}
                                className="text-primary-600 dark:text-primary-500 hover:underline focus:outline-none"
                                title="Mëso më shumë rreth Kornizës MARAGON®"
                             >
                                MARAGON<sup className="text-[0.4em] ml-0.2 top-[-1em]">®</sup>
                             </button> 
                             <span className="text-slate-400 dark:text-slate-600"> //</span> {t.scannerTitle}
                         </h1>
                         <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">
                             {t.systemStatus}
                         </p>
                         <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                             {t.tracking}: {processedAndRankedMedia.length}
                         </p>
                     </div>
                     
                     {/* Language Switcher */}
                     <div className="mb-1">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                        >
                            <span className={lang === 'sq' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}>AL</span>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <span className={lang === 'en' ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}>EN</span>
                        </button>
                     </div>
                </div>
                
                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    {/* Navigation */}
                     <button
                        onClick={onBack}
                        className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 uppercase tracking-wide flex items-center gap-2 transition-colors"
                      >
                        &larr; {t.returnRoot}
                      </button>

                    {/* Filters (Technical Look) */}
                    <div className="flex flex-wrap gap-4 items-center justify-center">
                        <div className="flex items-center gap-2">
                            <label className="text-[10px] uppercase text-slate-500 font-bold">{t.sort}</label>
                            <select 
                                value={effectiveSort}
                                onChange={(e) => setSortMode(e.target.value as 'influence' | 'maragon' | 'name')}
                                className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold px-2 py-1 rounded focus:ring-1 focus:ring-primary-500 outline-none uppercase"
                            >
                                {scoreRankingAvailable && <option value="influence">{t.sortOptions.influence}</option>}
                                {scoreRankingAvailable && <option value="maragon">{t.sortOptions.maragon}</option>}
                                <option value="name">{t.sortOptions.name}</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                             <label className="text-[10px] uppercase text-slate-500 font-bold">{t.class}</label>
                             <select 
                                value={archetypeFilter}
                                onChange={(e) => setArchetypeFilter(e.target.value as any)}
                                className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold px-2 py-1 rounded focus:ring-1 focus:ring-primary-500 outline-none uppercase"
                            >
                                <option value="Të Gjithë">{t.classOptions.all}</option>
                                <option value="Analisti">{t.classOptions.analyst}</option>
                                <option value="Moderatori">{t.classOptions.moderator}</option>
                                <option value="Komunikatori">{t.classOptions.communicator}</option>
                                <option value="Roja Publik">{t.classOptions.watchdog}</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Secondary Nav */}
                    <div className="flex gap-4 text-xs font-bold text-slate-500">
                         <button onClick={onNavigateToPoliticians} className="hover:text-primary-600 transition-colors">POLITIKA DB</button>
                         <span className="text-slate-300">|</span>
                         <button onClick={onNavigateToJudiciary} className="hover:text-primary-600 transition-colors">GJYKATA DB</button>
                    </div>
                </div>

                {/* System Terminology Menu */}
                <div className="mt-4 flex flex-wrap gap-2 justify-start items-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase mr-2">{t.systemKeysLabel}</span>
                    
                    <button 
                        onClick={() => setIsToxicityModalOpen(true)}
                        className="px-3 py-1.5 rounded-sm border border-red-500/30 bg-red-500/10 text-[10px] font-mono font-bold text-red-500 hover:bg-red-500/20 transition-colors uppercase tracking-wider flex items-center gap-1"
                        title={t.systemKeys.toxicityDesc}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        {t.systemKeys.toxicity}
                    </button>

                    <button 
                        onClick={() => setIsAletheiaModalOpen(true)}
                        className="px-3 py-1.5 rounded-sm border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-mono font-bold text-cyan-500 uppercase tracking-wider cursor-help hover:bg-cyan-500/20 transition-colors" 
                        title={t.systemKeys.aletheiaDesc}
                    >
                        {t.systemKeys.aletheia}
                    </button>

                    <button 
                         onClick={() => setIsLetheModalOpen(true)}
                        className="px-3 py-1.5 rounded-sm border border-purple-500/30 bg-purple-500/10 text-[10px] font-mono font-bold text-purple-500 uppercase tracking-wider cursor-help hover:bg-purple-500/20 transition-colors" title={t.systemKeys.letheDesc}
                    >
                        {t.systemKeys.lethe}
                    </button>

                     <button 
                         onClick={() => setIsHorizonModalOpen(true)}
                        className="px-3 py-1.5 rounded-sm border border-yellow-500/30 bg-yellow-500/10 text-[10px] font-mono font-bold text-yellow-500 uppercase tracking-wider cursor-help hover:bg-yellow-500/20 transition-colors" title={t.systemKeys.horizonDesc}
                    >
                        {t.systemKeys.horizon}
                    </button>

                     <a 
                         href="/?page=ethicalResonance"
                        className="px-3 py-1.5 rounded-sm border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-wider cursor-help hover:bg-emerald-500/20 transition-colors flex items-center gap-1" 
                        title={t.systemKeys.csrDesc}
                    >
                        <HeartIcon className="w-3 h-3" />
                        {t.systemKeys.csr}
                    </a>
                </div>
            </div>

          {/* --- GRID: The Panopticon Cells --- */}
          <section>
            {processedAndRankedMedia.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedAndRankedMedia.map((profile) => (
                  <MediaPersonalityCard
                    key={profile.id}
                    profile={profile}
                    onNavigate={onNavigateToProfilePage}
                    onCompareToggle={handleCompareToggle}
                    isSelectedForCompare={comparisonList.includes(profile.id)}
                    isCompareDisabled={
                      comparisonList.length >= MAX_COMPARE_ITEMS &&
                      !comparisonList.includes(profile.id)
                    }
                    lang={lang}
                    onNavigateToAnalysis={onNavigateToAnalysis}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                <CpuChipIcon className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-bold text-sm">{t.noSubjects}</p>
                <p className="text-xs mt-2">{t.adjustFilters}</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {isModalOpen && comparisonProfiles.length >= 2 && (
        <PoliticianComparisonModal
          profiles={comparisonProfiles}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      
      {comparisonList.length >= 2 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
           <button
             onClick={() => setIsModalOpen(true)}
             className="bg-primary-600 text-white border-2 border-white dark:border-slate-800 px-8 py-3 rounded-full shadow-xl font-bold text-sm uppercase tracking-wider hover:bg-primary-700 transition-all transform hover:scale-105 flex items-center gap-2"
           >
             <ArrowPathIcon className="w-4 h-4" />
             <span>{t.compare} ({comparisonList.length})</span>
           </button>
        </div>
      )}

      {/* Modals for System Keys */}
      {isToxicityModalOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <SocialToxicityModal isOpen={isToxicityModalOpen} onClose={() => setIsToxicityModalOpen(false)} />,
        document.body
      )}

      {isAletheiaModalOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <AletheiaModal isOpen={isAletheiaModalOpen} onClose={() => setIsAletheiaModalOpen(false)} />,
        document.body
      )}

      {isLetheModalOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <LetheModal isOpen={isLetheModalOpen} onClose={() => setIsLetheModalOpen(false)} />,
        document.body
      )}

      {isHorizonModalOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <HorizonModal isOpen={isHorizonModalOpen} onClose={() => setIsHorizonModalOpen(false)} />,
        document.body
      )}
    </>
  );
};
