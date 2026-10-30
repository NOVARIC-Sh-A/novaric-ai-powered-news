import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  RotateCcw, 
  Zap, 
  Activity, 
  History, 
  ChevronDown,
  ShieldCheck,
  Settings,
  Lock,
  ArrowRight,
  Info,
  Globe
} from 'lucide-react';
import { 
  OFFICIAL_NER_WEIGHTS, 
  INTERPRETATION_MATRIX, 
  GOVERNANCE_CONSTRAINTS,
  DimensionData
} from '../data/whitepaperData';
import { PullQuote } from './templates/ArticleTemplate1';
import { DimensionSlider } from './DimensionSlider';
import { DecayLineGraph } from './DecayLineGraph';
import { CscNetworkGraph } from './CscNetworkGraph';
import { useLanguage } from '../contexts/LanguageContext';
import { NerBreakdown } from '../types';

/* ============================================================
   HELPER COMPONENTS
============================================================ */

// FIX: Explicitly type SectionTitle with React.FC to resolve children property errors.
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tighter">
    <Zap className="text-primary-500 w-6 h-6" />
    {children}
  </h2>
);

const XMarkIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DimensionInfographic: React.FC<{ dimension: DimensionData; active: boolean }> = ({ dimension, active }) => {
    const { language } = useLanguage();
    const dName = dimension.name[language];
    const dDesc = dimension.description[language];
    const dInputs = dimension.inputs[language];

    return (
        <div className="p-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-primary-500/30 shadow-2xl transition-all duration-500 ease-in-out h-full flex flex-col">
            <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-3 flex items-center gap-2">
                <span className="text-2xl">{dimension.icon}</span> {dName}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{dDesc}</p>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6 border border-slate-100 dark:border-slate-700">
            <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                {language === 'sq' ? 'Treguesit Kryesorë:' : 'Key Indicators:'}
            </h4>
            <ul className="grid grid-cols-1 gap-2">
                {dInputs.map((input, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    <div className="w-1 h-1 rounded-full bg-primary-500"></div>
                    {input}
                    </li>
                ))}
            </ul>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                {(dimension.key === 'TRF') && <DecayLineGraph active={active} />}
                {(dimension.key === 'CSC') && <CscNetworkGraph active={active} />}
                {(dimension.key === 'SRS' || dimension.key === 'CIS') && (
                    <div className="w-full space-y-6 pb-4">
                        <div className="text-center">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sapphire mb-6">
                                {language === 'sq' ? 'Integriteti i Vektorit' : 'Vector Integrity'}
                            </h4>
                            <div className="space-y-4">
                                {[85, 92, 70].map((val, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
                                            <span>SIGNAL_{i+1}</span>
                                            <span className="text-sapphire">{active ? val : 0}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-sapphire shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-1000" 
                                                style={{ width: active ? `${val}%` : '0%' }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {(dimension.key === 'ECM') && (
                    <div className="w-full flex flex-col items-center pb-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-caution mb-6">
                            {language === 'sq' ? 'Konteksti i Ekosistemit' : 'Ecosystem Context'}
                        </h4>
                        <div className="grid grid-cols-3 grid-rows-3 gap-2 w-36 h-36">
                            {[...Array(9)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`rounded-lg border transition-all duration-1000 ${
                                        active && i === 4 
                                        ? 'bg-primary-500/40 border-primary-500 shadow-[0_0_15px_rgba(228,25,30,0.5)]' 
                                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                    }`}
                                    style={{ opacity: active ? 1 : 0.3, transitionDelay: `${i * 100}ms` }}
                                ></div>
                            ))}
                        </div>
                        <p className="mt-6 text-[9px] text-center text-slate-400 font-mono uppercase tracking-widest">
                            {language === 'sq' ? 'Kalibrimi Rajonal Aktiv' : 'Regional Calibration Active'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

interface WhitepaperVisualizationPageProps {
  onBack?: () => void;
  initialScore?: number;
  initialBreakdown?: NerBreakdown;
}

export const WhitepaperVisualizationPage: React.FC<WhitepaperVisualizationPageProps> = ({ onBack, initialScore, initialBreakdown }) => {
  const { language, toggleLanguage } = useLanguage();
  
  const translations = {
      sq: {
          formulaTitle: "Interaktiviteti i Formulës NER",
          formulaDesc: "Ndryshoni peshat e pesë dimensioneve të NER për të parë menjëherë se si inteligjenca artificiale e NOVARIC® llogarit rezultatin e integritetit të një lajmi.",
          liveModeling: "Modelimi Live",
          customScore: "Rezultati i Përshtatur",
          resetWeights: "Reset në Peshat Zyrtare",
          dimDefinitions: "Përkufizimet e Dimensioneve",
          dimDefinitionsDesc: "NER dekonstrukton procesin e verifikimit në pesë shtresa paralele. Scrolling poshtë për të parë detajet e çdo shtrese dhe vizualizimin e tyre përkatës në panelidjathtas.",
          layerLabel: "Shtresa",
          syncLabel: "Sinkronizimi i Analizës",
          governanceTitle: "Seksioni 6",
          governanceSub: "Qeverisja & Etika",
          governanceDesc: "Integriteti algoritmik zbatohet përmes kufizimeve teknike të pamanipulueshme. Protokolli MARAGON siguron që çdo vlerësim të gjenerohet pa ndërhyrje njerëzore, duke garantuar paanshmëri totale.",
          openAuditTrail: "Hap Gjurmën e Auditimit",
          closeAuditTrail: "Mbyll Pamjen e Auditimit",
          interpretationTitle: "Simulatori i Interpretimit",
          interpretationDesc: "Përdorni fushën e mëposhtme për të simuluar rezultate të ndryshme NER dhe për të parë klasifikimin klinik të integritetit të lajmi sipas matricës sonë zyrtare.",
          testScoreLabel: "Rezultati i Testit (0-100)",
          classDescLabel: "Përshkrimi i Klasifikimit",
          validScorePlaceholder: "Vendosni një rezultat të vlefshëm.",
          riskBandHeader: "Banda e Rrezikut",
          rangeHeader: "Gama",
          confHeader: "Besueshmëria",
          goBack: "Kthehu Pas",
          auditLogTitle: "Regjistri i Auditimit",
          auditLogDesc: "\"Gjurma e auditimit konfirmon zero ndërhyrje manuale gjatë periudhës aktuale të llogaritjes. Të gjitha peshat janë vërtetuar sipas protokollit zyrtar NOVARIC.\"",
          statusLabel: "STATUSI",
          pullQuoteCsc: "\"E vërteta nuk është një pikë e vetme; ajo është rezonanca e një rrjeti të qëndrueshëm dhe të verifikuar.\"",
          dimDetailPrefix: "Në algoritmin tonë, ${key} llogaritet duke sintetizuar flukse të shumëfishta të dhënash. Ndryshe nga metrikat tradicionale, ai konsideron historikun e sjelljes së aktorëve të përfshirë dhe i referon ata kundrejt regjistrit tonë të decentralizuar të së vërtetës.",
          terminated: "Protokolli i Vizualizimit u Përfundua me Sukses"
      },
      en: {
          formulaTitle: "NER Formula Interaction",
          formulaDesc: "Adjust the weights of the five NER dimensions to see instantly how the NOVARIC® AI calculates the news integrity score.",
          liveModeling: "Live Modeling",
          customScore: "Custom Score",
          resetWeights: "Reset to Official Weights",
          dimDefinitions: "Dimension Definitions",
          dimDefinitionsDesc: "NER deconstructs the verification process into five parallel layers. Scroll down to see the details of each layer and their corresponding visualization in the right panel.",
          layerLabel: "Layer",
          syncLabel: "Analysis Sync",
          governanceTitle: "Section 6",
          governanceSub: "Governance & Ethics",
          governanceDesc: "Algorithmic integrity is enforced through unmanipulatable technical constraints. The MARAGON protocol ensures that every assessment is generated without human intervention, guaranteeing total impartiality.",
          openAuditTrail: "Open Audit Trail",
          closeAuditTrail: "Close Audit Trail",
          interpretationTitle: "Interpretation Simulator",
          interpretationDesc: "Use the field below to simulate different NER results and see the clinical classification of news integrity according to our official matrix.",
          testScoreLabel: "Test Score (0-100)",
          classDescLabel: "Classification Description",
          validScorePlaceholder: "Enter a valid score.",
          riskBandHeader: "Risk Band",
          rangeHeader: "Range",
          confHeader: "Credibility",
          goBack: "Go Back",
          auditLogTitle: "Audit Log",
          auditLogDesc: "\"The audit trail confirms zero manual intervention during the current calculation period. All weights have been validated according to the official NOVARIC protocol.\"",
          statusLabel: "STATUS",
          pullQuoteCsc: "\"Truth is not a single point; it is the resonance of a stable and verified network.\"",
          dimDetailPrefix: "In our algorithm, ${key} is calculated by synthesizing multiple data streams. Unlike traditional metrics, it considers the behavioral history of the involved actors and references them against our decentralized ledger of truth.",
          terminated: "Protocol Visualization Terminated Successfully"
      }
  };

  const t = translations[language];

  const initialWeightsMap = useMemo(() => {
    if (initialBreakdown) {
      return {
        SRS: initialBreakdown.SRS,
        CIS: initialBreakdown.CIS,
        CSC: initialBreakdown.CSC,
        TRF: initialBreakdown.TRF,
        ECM: initialBreakdown.ECM
      };
    }
    return OFFICIAL_NER_WEIGHTS.reduce((acc, dim) => ({ ...acc, [dim.key]: dim.weight }), {} as Record<string, number>);
  }, [initialBreakdown]);

  const [weights, setWeights] = useState<Record<string, number>>(initialWeightsMap);
  const [testScore, setTestScore] = useState<number | string>(initialScore !== undefined ? initialScore : 75);
  const [activeDimKey, setActiveDimKey] = useState<string>("SRS");
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [expandedConstraint, setExpandedConstraint] = useState<number | null>(null);
  
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
      if (initialBreakdown) {
          setWeights(initialWeightsMap);
      }
      if (initialScore !== undefined) {
          setTestScore(initialScore);
      }
  }, [initialBreakdown, initialScore, initialWeightsMap]);

  const customNER = useMemo(() => {
    const srs = 75 * (weights['SRS'] || 0);
    const cis = 75 * (weights['CIS'] || 0);
    const csc = 75 * (weights['CSC'] || 0);
    const trf = 75 * (weights['TRF'] || 0);
    const baseNER = (srs + cis + csc + trf) / 100;
    const ecmWeight = weights['ECM'] ?? 0;
    const m_ecm = 1 + (ecmWeight - 10) / 100;
    return Math.round(baseNER * m_ecm);
  }, [weights]);

  const handleWeightChange = (key: string, newVal: number) => {
    if (key === 'ECM') {
      setWeights(prev => ({ ...prev, ECM: newVal }));
      return;
    }
    const oldVal = weights[key];
    const diff = newVal - oldVal;
    const others = ['SRS', 'CIS', 'CSC', 'TRF'].filter(k => k !== key);
    const sumOthers = others.reduce((acc, k) => acc + (weights[k] || 0), 0);
    const nextWeights = { ...weights, [key]: newVal };
    
    if (sumOthers > 0) {
      others.forEach(k => {
        const share = (weights[k] || 0) / sumOthers;
        nextWeights[k] = Math.max(0, (weights[k] || 0) - diff * share);
      });
    } else {
      nextWeights[others[0]] = 100 - newVal;
    }
    
    const currentSum = nextWeights['SRS'] + nextWeights['CIS'] + nextWeights['CSC'] + nextWeights['TRF'];
    if (currentSum !== 100) nextWeights[others[0]] += (100 - currentSum);
    setWeights(nextWeights);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const key = entry.target.getAttribute('data-dim-key');
          if (key) setActiveDimKey(key);
        }
      });
    }, { threshold: 0.6 });
    (Object.values(scrollRefs.current) as any[]).forEach(el => { if (el) observer.observe(el as Element); });
    return () => observer.disconnect();
  }, []);

  const activeBandIndex = useMemo(() => {
    const scoreNum = typeof testScore === 'string' ? (parseInt(testScore) || 0) : testScore;
    return INTERPRETATION_MATRIX.findIndex(band => scoreNum >= band.range[0] && scoreNum <= band.range[1]);
  }, [testScore]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-void-blue font-sans text-slate-800 dark:text-slate-100 overflow-x-hidden">
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        
        {/* Local Header / Nav Bar */}
        <div className="flex justify-between items-center mb-12">
            {onBack && (
              <button
                  onClick={onBack}
                  className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-all"
              >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  <span className="font-bold text-sm uppercase tracking-wide">{t.goBack}</span>
              </button>
            )}
            <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-bold text-xs ml-auto"
            >
                <Globe className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className={language === 'sq' ? 'text-primary-600 dark:text-primary-400' : ''}>AL</span>
                <span className="text-slate-300">|</span>
                <span className={language === 'en' ? 'text-primary-600 dark:text-primary-400' : ''}>EN</span>
            </button>
        </div>

        {/* --- SECTION 1: FORMULA INTERACTION --- */}
        <section className="bg-white dark:bg-slate-900/50 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 mb-32 relative overflow-hidden shadow-xl">
          <div className="absolute -top-20 -right-20 p-4 opacity-[0.03] dark:opacity-[0.02] pointer-events-none">
            <Settings className="w-80 h-80 rotate-12 text-slate-900 dark:text-white" />
          </div>
          
          <SectionTitle>{t.formulaTitle}</SectionTitle>
          <div className="text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed">
            {t.formulaDesc}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-slate-50 dark:bg-black/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner relative">
                <div className="absolute top-2 right-4 text-[9px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-widest font-bold">{t.liveModeling}</div>
                <code className="text-2xl sm:text-3xl font-mono font-bold text-primary-600 dark:text-primary-500 block mb-4 text-center">
                  NER<sub>Final</sub> = NER × M<sub>ECM</sub>
                </code>
                <div className="h-1 w-20 bg-primary-500 mx-auto rounded-full mb-4"></div>
                <p className="text-[10px] text-center text-slate-500 dark:text-slate-500 font-mono italic leading-relaxed uppercase tracking-tighter">
                  NER = Σ (75 × W<sub>i</sub>) / 100<br/>
                  Weights constrained to 100%
                </p>
              </div>

              <div className="bg-primary-600 rounded-2xl p-8 shadow-2xl text-center transform transition-transform hover:scale-105 border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 mb-1 block">{t.customScore}</span>
                <div className="text-7xl font-black font-mono tracking-tighter text-white drop-shadow-xl">{customNER}</div>
                <div className="mt-3 text-xs font-bold uppercase text-white/80 tracking-widest">Composite Ecosystem Rating</div>
              </div>
              
              <button 
                onClick={() => setWeights(initialWeightsMap)}
                className="w-full py-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white shadow-sm"
              >
                <RotateCcw className="w-4 h-4" /> {t.resetWeights}
              </button>
            </div>

            <div className="lg:col-span-7 space-y-10">
              {OFFICIAL_NER_WEIGHTS.map((dim) => (
                <DimensionSlider 
                    key={dim.key}
                    label={dim.name[language]}
                    description={dim.description[language]}
                    icon={dim.icon}
                    value={weights[dim.key]}
                    onChange={(val) => handleWeightChange(dim.key, val)}
                    isModifier={dim.key === 'ECM'}
                />
              ))}
            </div>
          </div>
        </section>

        {/* --- SECTION 2: DIMENSION DEEP-DIVE SCROLLYTELLING --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-40">
          <div className="lg:col-span-7 space-y-64 pb-64">
            <div className="space-y-6 mb-20">
               <SectionTitle>{t.dimDefinitions}</SectionTitle>
               <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                {t.dimDefinitionsDesc}
               </p>
            </div>

            {OFFICIAL_NER_WEIGHTS.map((dim) => {
              const dName = dim.name[language];
              const dDesc = dim.description[language];
              const dInputs = dim.inputs[language];
              const detailBody = t.dimDetailPrefix.replace('${key}', dim.key);

              return (
              <div 
                key={dim.key} 
                data-dim-key={dim.key}
                ref={el => { scrollRefs.current[dim.key] = el; }}
                className="scroll-mt-40 space-y-6"
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full mb-4">
                  <span className="text-xl">{dim.icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">{t.layerLabel} 4.{OFFICIAL_NER_WEIGHTS.indexOf(dim) + 1}</span>
                </div>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tighter">
                  {dName} <span className="text-slate-300 dark:text-slate-700">({dim.key})</span>
                </h3>
                <div className="prose dark:prose-invert max-w-none text-lg text-slate-600 dark:text-slate-400 leading-relaxed text-justify font-serif">
                  <p>{dDesc}</p>
                  <p>{detailBody}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {dInputs.map((input, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl group hover:border-primary-500/50 dark:hover:border-primary-500 shadow-sm transition-all hover:shadow-md">
                      <div className="w-2 h-2 rounded-full bg-sapphire group-hover:scale-150 group-hover:bg-primary-500 transition-all"></div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">{input}</span>
                    </div>
                  ))}
                </div>
                {dim.key === 'CSC' && (
                  <PullQuote>{t.pullQuoteCsc}</PullQuote>
                )}
              </div>
            )})}
          </div>

          <aside className="lg:col-span-5 relative hidden lg:block">
            <div className="sticky top-40 space-y-6">
              <div className="h-[580px] relative">
                {OFFICIAL_NER_WEIGHTS.map((dim) => (
                    <div 
                        key={dim.key} 
                        className={`absolute inset-0 transition-all duration-700 ${
                            activeDimKey === dim.key 
                            ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
                            : 'opacity-0 translate-y-12 pointer-events-none scale-95'
                        }`}
                    >
                        <DimensionInfographic dimension={dim} active={activeDimKey === dim.key} />
                    </div>
                ))}
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xl">
                 <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.syncLabel}</span>
                 </div>
                 <div className="flex gap-1.5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-1.5 h-4 bg-sapphire rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>
                    ))}
                 </div>
              </div>
            </div>
          </aside>
        </div>

        {/* --- SECTION 3: GOVERNANCE --- */}
        <section className="bg-white dark:bg-void-blue rounded-3xl p-8 sm:p-16 border-2 border-slate-200 dark:border-slate-800 mb-32 shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-tech-grid opacity-[0.03] pointer-events-none"></div>
           <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
              <div className="md:w-1/2">
                 <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-8 leading-none">
                    {t.governanceTitle}<br/><span className="text-primary-500">{t.governanceSub}</span>
                 </h2>
                 <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed text-justify mb-10 font-serif">
                    {t.governanceDesc}
                 </p>
                 <button onClick={() => setIsAuditModalOpen(true)} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-void-blue font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center gap-3 shadow-xl">
                    <ShieldCheck className="w-5 h-5" /> {t.openAuditTrail}
                 </button>
              </div>
              <div className="md:w-1/2 w-full space-y-5">
                 {GOVERNANCE_CONSTRAINTS.map((item, idx) => (
                   <div key={idx} className="group bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all hover:border-primary-500/30 shadow-sm">
                      <button onClick={() => setExpandedConstraint(expandedConstraint === idx ? null : idx)} className="w-full p-6 flex items-center justify-between cursor-pointer focus:outline-none text-left">
                         <div className="flex items-center gap-4">
                            <Lock className={`w-5 h-5 transition-colors ${expandedConstraint === idx ? 'text-primary-500' : 'text-slate-400 dark:text-slate-700'}`} />
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-sm">{item.title[language]}</h4>
                         </div>
                         <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedConstraint === idx ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedConstraint === idx && (
                        <div className="px-6 pb-6 pt-0 space-y-6 animate-fadeIn">
                           <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4 font-serif">{item.detail[language]}</p>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[10px]">
                              <div className="bg-white dark:bg-black/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
                                 <div className="text-slate-400 dark:text-slate-600 uppercase mb-2 font-bold tracking-widest">{item.label[language]}</div>
                                 {idx === 0 && <div className="text-sapphire underline cursor-pointer font-bold">ACCESS_MARAGON_LOGS_#902X</div>}
                                 {idx === 1 && <span className="text-rose-600 dark:text-rose-500 font-black">LOCKED_OFF_SECURE</span>}
                                 {idx === 2 && <span className="text-emerald-600 dark:text-emerald-500 font-black">{new Date().toLocaleString()}</span>}
                              </div>
                              <div className="bg-white dark:bg-black/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner flex flex-col justify-between">
                                 <div className="text-slate-400 dark:text-slate-600 uppercase mb-2 font-bold tracking-widest">{language === 'sq' ? 'Hash i Integritetit' : 'Integrity Hash'}</div>
                                 <span className="text-emerald-600 dark:text-emerald-500 font-black truncate">SHA-256_VERIFIED</span>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* --- SECTION 4: INTERPRETATION SIMULATOR --- */}
        <section className="bg-white dark:bg-white/5 rounded-3xl p-8 sm:p-16 border border-slate-200 dark:border-white/10 mb-20 shadow-2xl">
           <SectionTitle>{t.interpretationTitle}</SectionTitle>
           <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-3xl leading-relaxed">
            {t.interpretationDesc}
           </p>
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-4">
                 <div className="relative group">
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-4">{t.testScoreLabel}</label>
                    <input 
                      type="number" min="0" max="100" value={testScore}
                      onChange={(e) => setTestScore(e.target.value === '' ? '' : Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-transparent rounded-3xl p-8 text-7xl font-black font-mono text-primary-600 dark:text-sapphire focus:ring-4 focus:ring-primary-500/20 dark:focus:ring-sapphire/20 transition-all outline-none shadow-2xl text-center"
                      placeholder="75"
                    />
                    <div className="absolute bottom-6 right-8 text-slate-300 dark:text-slate-700 font-mono text-3xl select-none">%</div>
                 </div>
                 <div className="mt-8 flex flex-col gap-4">
                    <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-inner">
                       <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-3 tracking-widest flex items-center gap-2">
                         <Info className="w-3 h-3" /> {t.classDescLabel}
                       </h5>
                       <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-bold">{INTERPRETATION_MATRIX[activeBandIndex]?.label[language] || t.validScorePlaceholder}</p>
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-8">
                 <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl">
                    <table className="w-full text-left border-collapse bg-white dark:bg-slate-900/30">
                       <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800 font-mono text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                             <th className="p-6">{t.riskBandHeader}</th>
                             <th className="p-6 text-center">{t.rangeHeader}</th>
                             <th className="p-6">{t.confHeader}</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {INTERPRETATION_MATRIX.map((band, i) => (
                             <tr key={i} className={`transition-all duration-500 ${activeBandIndex === i ? 'bg-primary-500/10 dark:bg-sapphire/20 relative z-10 scale-[1.02] shadow-2xl' : 'opacity-30 grayscale'}`}>
                                <td className="p-6">
                                   <div className="flex items-center gap-4">
                                      <div className={`w-4 h-4 rounded-full ${band.color} shadow-sm`}></div>
                                      <span className={`font-bold text-sm ${activeBandIndex === i ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{band.label[language]}</span>
                                   </div>
                                </td>
                                <td className="p-6 text-center font-mono font-black text-xs">{band.range[0]} — {band.range[1]}</td>
                                <td className="p-6"><span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeBandIndex === i ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{band.confidence[language]}</span></td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </section>

        <footer className="text-center py-20 border-t border-slate-200 dark:border-slate-800">
           <div className="flex justify-center items-center gap-6 mb-8">
              <div className="w-16 h-px bg-slate-200 dark:bg-slate-800"></div>
              <Activity className="w-8 h-8 text-slate-300 dark:text-slate-700" />
              <div className="w-16 h-px bg-slate-200 dark:bg-slate-800"></div>
           </div>
           <p className="text-[10px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-[0.6em] font-bold">{t.terminated}</p>
        </footer>
      </div>
      
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" onClick={() => setIsAuditModalOpen(false)}>
           <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl p-10 relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-500"></div>
              <div className="flex justify-between items-center mb-12">
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4 uppercase tracking-tighter">
                   <Activity className="w-8 h-8 text-primary-500" /> 
                   {t.auditLogTitle}
                 </h3>
                 <button onClick={() => setIsAuditModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                   <XMarkIcon className="w-8 h-8" />
                 </button>
              </div>
              <div className="space-y-6 font-mono text-[11px]">
                 <div className="p-6 bg-slate-50 dark:bg-black/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 shadow-inner">
                    <p className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
                      <span className="font-bold">LOG_ID</span> 
                      <span className="text-primary-600 dark:text-sapphire font-black">#AF22-901X-SECURE</span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="font-bold">{t.statusLabel}</span> 
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 font-black border border-emerald-500/20">IMMUTABLE_LOCKED</span>
                    </p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl text-slate-600 dark:text-slate-400 italic font-serif leading-relaxed">
                   {t.auditLogDesc}
                 </div>
              </div>
              <button onClick={() => setIsAuditModalOpen(false)} className="w-full mt-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-void-blue font-black uppercase text-xs rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl tracking-widest">{t.closeAuditTrail}</button>
           </div>
        </div>
      )}
      
      {onBack && (
        <button onClick={onBack} className="fixed bottom-10 right-10 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-xs rounded-full shadow-[0_10px_40px_rgba(228,25,30,0.4)] transition-all flex items-center gap-3 z-50 hover:scale-105 active:scale-95">
            <RotateCcw className="w-5 h-5" /> {t.goBack}
        </button>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .bg-void-blue { background-color: #020617; }
      `}</style>
    </div>
  );
};
