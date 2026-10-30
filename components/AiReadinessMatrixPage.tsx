
import React, { useRef } from 'react';
import { Shield, Brain, Database, Scale, Download, Zap, RotateCcw, Globe } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { UsersIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface AiReadinessMatrixPageProps {
  onBack: () => void;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tighter">
    <Zap className="text-primary-500 w-6 h-6" />
    {children}
  </h2>
);

const translations = {
  sq: {
    heroTitle: "MATRICA E GATISHMËRISË STRATEGJIKE NDNDAJ IA",
    heroSubtitle: "Inxhinieria e Ndërmarrjes Rezistente. Vlerësoni pjekurinë e organizatës suaj ndaj IA përmes kornizës sonë klinike 4-dimensionale.",
    downloadBtn: "Shkarko Matricën (PDF)",
    returnBtn: "Kthehu në Bazë",
    foundationLabel: "Metodologjia & Teoria",
    foundationTitle: "Themelet Klinike",
    matrixTitle: "Matrica e Gatishmërisë 2026",
    dimensionLabel: "Dimensioni",
    level1Label: "Niveli 1: Reaktiv",
    level2Label: "Niveli 2: Funksional",
    level3Label: "Niveli 3: I Integruar",
    ctaTitle: "Gati për të matur ndikimin tuaj të IA?",
    ctaSub: "Merrni një raport të personalizuar mbi gatishmërinë e organizatës suaj dhe udhërrëfyesin strategjik.",
    ctaBtn: "REGJISTRIMI I NDËRMARRJES",
    dimensions: {
      vision: "Vizioni Strategjik",
      human: "Kapitali Njerëzor",
      data: "Infrastruktura e të Dhënave",
      trust: "Besimi & Etika"
    }
  },
  en: {
    heroTitle: "STRATEGIC AI READINESS MATRIX",
    heroSubtitle: "Engineering the Resilient Enterprise. Evaluate your organization’s AI maturity through our clinical 4-dimensional framework.",
    downloadBtn: "Download Full Matrix PDF",
    returnBtn: "Return to Base",
    foundationLabel: "Methodology & Theory",
    foundationTitle: "The Clinical Foundation",
    matrixTitle: "2026 Readiness Matrix",
    dimensionLabel: "Dimension",
    level1Label: "Level 1: Reactive",
    level2Label: "Level 2: Functional",
    level3Label: "Level 3: Integrated",
    ctaTitle: "Ready to measure your AI impact?",
    ctaSub: "Get a customized report on your organization's readiness and strategic roadmap.",
    ctaBtn: "ENTERPRISE REGISTRATION",
    dimensions: {
      vision: "Strategic Vision",
      human: "Human Capital",
      data: "Data Infrastructure",
      trust: "Trust & Ethics"
    }
  }
};

export const AiReadinessMatrixPage: React.FC<AiReadinessMatrixPageProps> = ({ onBack }) => {
  const formRef = useRef<HTMLDivElement>(null);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  useSeo(
    `NOVARIC® ${t.heroTitle} 2026`,
    t.heroSubtitle,
    undefined,
    window.location.href
  );

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const matrixRows = [
    {
      dimension: t.dimensions.vision,
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      l1: language === 'sq' ? "IA trajtohet si eksperimente ad-hoc pa mbikëqyrje qendrore ose objektiv afatgjatë." : "AI is treated as ad-hoc experiments with no central oversight or long-term objective.",
      l2: language === 'sq' ? "Departamente specifike kanë strategji IA, por sinergjia ndër-funksionale mungon." : "Specific departments have AI strategies, but cross-functional synergy is missing.",
      l3: language === 'sq' ? "Rreshtim i IA në mbarë ndërmarrjen. IA është bërthama e modelit të biznesit." : "Enterprise-wide AI alignment. AI is core to the business model and value proposition."
    },
    {
      dimension: t.dimensions.human,
      icon: <UsersIcon className="w-6 h-6 text-blue-600" />,
      l1: language === 'sq' ? "Mbështetje e madhe te shitësit e jashtëm. Alfabetizimi i brendshëm i IA është zero." : "Heavy reliance on external vendors. In-house AI literacy is non-existent.",
      l2: language === 'sq' ? "Programe të vazhdueshme të rritjes së aftësive. 'Kampionët e IA' të identifikuar." : "Ongoing internal upskilling programs. Core 'AI Champions' identified in key roles.",
      l3: language === 'sq' ? "Rrjedha e punës e rritur nga IA është standardi. Kultura e të mësuarit e vendosur." : "AI-augmented workflow is the standard. Continuous learning culture is fully established."
    },
    {
      dimension: t.dimensions.data,
      icon: <Database className="w-6 h-6 text-blue-600" />,
      l1: language === 'sq' ? "Siloset e të dhënave dominojnë. Cilësia është e paqëndrueshme." : "Data silos dominate. Quality is inconsistent and inaccessible for model training.",
      l2: language === 'sq' ? "Arkitekturë e centralizuar cloud me protokolle bazë të qeverisjes dhe pastrimit." : "Centralized cloud architecture with basic governance and cleaning protocols.",
      l3: language === 'sq' ? "Pipelines parashikuese në kohë reale. Të dhënat përdoren për optimizim autonom." : "Real-time predictive pipelines. High-fidelity data is used for autonomous optimization."
    },
    {
      dimension: t.dimensions.trust,
      icon: <Scale className="w-6 h-6 text-blue-600" />,
      l1: language === 'sq' ? "Asnjë politikë formale e IA. Vendimet merren pa auditim etik." : "No formal AI policy. Decisions are made without ethical auditing.",
      l2: language === 'sq' ? "Kornizat bazë të përputhshmërisë. Përdorimi i IA monitorohet për drejtësi." : "Basic compliance frameworks established. AI usage is monitored for fairness.",
      l3: language === 'sq' ? "Transparenca algoritmike sipas dizajnit. IA etike është pjesë e markës." : "Algorithmic transparency by design. Ethical AI is part of the brand promise."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-cyan-100 selection:text-cyan-900">
      
      {/* 0. NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm transition-all"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            <span className="font-bold text-sm uppercase tracking-wide">{t.returnBtn}</span>
          </button>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-bold text-xs"
          >
            <Globe className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className={language === 'sq' ? 'text-primary-600 dark:text-primary-400' : ''}>AL</span>
            <span className="text-slate-300">|</span>
            <span className={language === 'en' ? 'text-primary-600 dark:text-primary-400' : ''}>EN</span>
          </button>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative bg-white pt-32 pb-32 overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(55,189,238,0.05),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <img 
                src="https://novaric.co/wp-content/uploads/2025/07/NOVARIC-Logos_Master-WB-R_12062025_500x500.webp" 
                alt="NOVARIC® Media House" 
                className="h-24 w-auto drop-shadow-sm"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 uppercase italic">
              NOVARIC<sup className="text-primary-500">®</sup> {language === 'sq' ? 'Matrica e' : 'Strategic'} <span className="text-blue-700">{language === 'sq' ? 'Gatishmërisë ndaj IA' : 'AI Readiness Matrix'}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-light mb-10 leading-relaxed">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={scrollToForm}
                className="px-8 py-4 bg-[#37bdee] hover:bg-[#2eaad6] text-white font-bold rounded-lg shadow-lg shadow-cyan-200/50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
              >
                <Download className="w-5 h-5" /> {t.downloadBtn}
              </button>
              <button 
                onClick={onBack}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-all uppercase tracking-widest text-sm"
              >
                {t.returnBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CLINICAL FOUNDATION */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{t.foundationLabel}</h2>
            <h3 className="text-3xl font-bold text-slate-900 mb-6">{t.foundationTitle}</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-blue-600 w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">AI TRiSM Framework</h4>
              <p className="text-xs text-slate-400 font-mono mb-4">Habbal et al., 2024</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'sq' 
                  ? "TRiSM do të thotë Menaxhimi i Besimit, Rrezikut dhe Sigurisë. Kjo kornizë siguron që modelet e IA të jenë të besueshme, të drejta dhe të sigurta. Ajo shkon përtej efikasitetit për të prioritizuar transparencën."
                  : "TRiSM stands for Trust, Risk, and Security Management. This framework ensures that AI models are reliable, fair, and secure. It moves beyond efficiency to prioritize transparency, allowing enterprises to manage the life cycle of AI deployments with surgical precision."}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Brain className="text-blue-600 w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Human Capital Emergence</h4>
              <p className="text-xs text-slate-400 font-mono mb-4">Ployhart, 2011</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'sq'
                  ? "Kjo teori supozon se suksesi i organizatës nuk është thjesht shuma e aftësive individuale, por se si ato aftësi transformohen përmes ndërveprimit kolektiv. Në një kontekst IA, emërgjenca ndodh kur intuita njerëzore rritet nga logjika e makinës."
                  : "This theory posits that organizational success is not just the sum of individual skills, but how those skills transform through collective interaction. In an AI context, emergence happens when human intuition is augmented by machine logic, creating a new tier of strategic capability."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE MATRIX TABLE */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionTitle>{t.matrixTitle}</SectionTitle>
          
          <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-900 text-white font-mono text-[10px] uppercase tracking-widest">
                  <th className="p-6 border-r border-slate-800">{t.dimensionLabel}</th>
                  <th className="p-6 border-r border-slate-800 bg-red-900/30">{t.level1Label}</th>
                  <th className="p-6 border-r border-slate-800 bg-blue-900/30">{t.level2Label}</th>
                  <th className="p-6 bg-cyan-900/30">{t.level3Label}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {matrixRows.map((row, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-6 border-r border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-white transition-colors">
                          {row.icon}
                        </div>
                        <span className="font-bold text-slate-800 uppercase text-xs tracking-wider">{row.dimension}</span>
                      </div>
                    </td>
                    <td className="p-6 border-r border-slate-100 italic text-sm text-slate-500">{row.l1}</td>
                    <td className="p-6 border-r border-slate-100 text-sm text-slate-700 font-medium">{row.l2}</td>
                    <td className="p-6 text-sm text-slate-900 font-bold bg-cyan-50/30">{row.l3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION / FORM AREA */}
      <section ref={formRef} className="py-24 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-8">{t.ctaTitle}</h2>
              <p className="text-slate-400 mb-12 max-w-2xl mx-auto">{t.ctaSub}</p>
              <a 
                href="https://forms.gle/giUC2o3J9QSppyNz6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-10 py-4 bg-[#37bdee] hover:bg-[#2eaad6] text-white font-bold rounded-full transition-all uppercase tracking-widest text-sm shadow-lg shadow-cyan-500/20"
              >
                  {t.ctaBtn}
              </a>
          </div>
      </section>
    </div>
  );
};
