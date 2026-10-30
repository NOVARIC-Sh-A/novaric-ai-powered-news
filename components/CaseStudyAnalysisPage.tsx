import React, { useEffect, useState, useMemo } from 'react';
import { FakeNewsCaseStudy, ForensicMarker, ClaimLedgerEntry } from '../types';
import { 
  ArrowPathIcon, 
  GlobeAltIcon, 
  ExclamationTriangleIcon, 
  ShieldCheckIcon,
  CpuChipIcon,
  ScaleIcon,
  InformationCircleIcon,
  XMarkIcon,
  Activity,
  CheckCircleIcon,
  LockClosedIcon,
  SearchIcon,
  DocumentTextIcon,
  XCircleIcon
} from './icons';
import { PieChart } from './PieChart';
import { JsonLd } from './JsonLd';
import { CANONICAL_URL, DEFAULT_SEO_IMAGE_URL } from '../config/constants';

interface CaseStudyAnalysisPageProps {
  caseStudy: FakeNewsCaseStudy;
  onBack: () => void;
}

/**
 * ADVANCED SEO & AI AGENT METADATA INJECTOR
 */
const AdvancedForensicSeo: React.FC<{ caseStudy: FakeNewsCaseStudy }> = ({ caseStudy }) => {
    const pageUrl = `${CANONICAL_URL}?page=fakeNewsAnalysis&id=${caseStudy.id}`;
    
    useEffect(() => {
        document.title = `Forensic Audit: ${caseStudy.headline_en} | NOVARIC®`;
        const updateMeta = (name: string, content: string, property: boolean = false) => {
            let el = document.querySelector(property ? `meta[property='${name}']` : `meta[name='${name}']`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(property ? 'property' : 'name', name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        updateMeta('description', `Bilingual Forensic Audit. Case ID: ${caseStudy.id}. Integrity Score: ${caseStudy.integrityScore}%.`);
        updateMeta('og:title', `Forensic Audit: ${caseStudy.headline_en}`, true);
        updateMeta('og:description', caseStudy.defamatoryAnalysis_en || '', true);
        updateMeta('ai-integrity-hash', 'verified_cida_protocol_v2.4');
    }, [caseStudy, pageUrl]);

    return (
        <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "ClaimReview",
            "url": pageUrl,
            "claimReviewed": caseStudy.headline_en,
            "reviewRating": { 
                "@type": "Rating", 
                "ratingValue": caseStudy.integrityScore / 20,
                "bestRating": "5",
                "worstRating": "1"
            },
            "author": { "@type": "Organization", "name": "NOVARIC® Forensic Unit" },
            "itemReviewed": {
                "@type": "CreativeWork",
                "author": { "@type": "Organization", "name": caseStudy.source },
                "url": caseStudy.articleUrl
            }
        }} />
    );
};

const SectionHeader: React.FC<{ code: string; title_sq: string; title_en: string; icon: React.ReactNode }> = ({ code, title_sq, title_en, icon }) => (
    <div className="mb-8 flex items-start gap-4">
        <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-400">
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-[0.2em]">{code}</span>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{title_sq}</h2>
                <span className="text-slate-500 font-bold text-sm sm:border-l sm:border-slate-300 sm:pl-2">{title_en}</span>
            </div>
        </div>
    </div>
);

const RiskBadge: React.FC<{ risk: ClaimLedgerEntry['risk'] }> = ({ risk }) => {
  const styles = {
    high: 'bg-rose-50 text-rose-700 border-rose-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${styles[risk]}`}>
      {risk}
    </span>
  );
};

export const CaseStudyAnalysisPage: React.FC<CaseStudyAnalysisPageProps> = ({ caseStudy, onBack }) => {
  const [activeMarker, setActiveMarker] = useState<ForensicMarker | null>(null);

  if (!caseStudy) return null;

  const failAudit = caseStudy.integrityScore < 50;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      <AdvancedForensicSeo caseStudy={caseStudy} />
      
      {/* 0. CLINICAL HEADER */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-[60] px-4 py-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
              <ArrowPathIcon className="w-6 h-6 rotate-180" />
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900">Forensic Audit: <span className="text-primary-600">Clinical Protocol</span></h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">Audit ID: {caseStudy.id} // CIDA_PROTOCOL_v2.4</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-slate-50 border border-slate-200">
                <Activity className={`w-3 h-3 ${failAudit ? 'text-rose-500' : 'text-emerald-500'} animate-pulse`} />
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Deep_Scan_Active</span>
             </div>
             <div className="flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-mono font-black text-emerald-700 uppercase">Verified_Audit</span>
             </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-12">
        
        {/* 1. TARGET SNAPSHOT & INTEGRITY SIDEBAR */}
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-8 sm:p-12 rounded-[2rem] shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-50"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 block font-mono italic">Phase_01 // Target Identification</span>
                <div className="space-y-6 mb-10">
                    <h2 className="text-4xl font-black text-slate-900 leading-tight italic tracking-tighter">"{caseStudy.headline_sq}"</h2>
                    <h3 className="text-2xl font-bold text-slate-400 leading-tight border-l-4 border-slate-100 pl-6">{caseStudy.headline_en}</h3>
                </div>
                <div className="flex flex-wrap gap-10 items-center text-sm border-t border-slate-100 pt-8">
                    <div className="flex items-center gap-3">
                        <GlobeAltIcon className="w-5 h-5 text-primary-500" />
                        <div className="flex flex-col">
                            <span className="font-black text-slate-400 uppercase text-[9px] tracking-widest">Source Entity</span>
                            <span className="text-slate-900 font-bold">{caseStudy.source}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <InformationCircleIcon className="w-5 h-5 text-primary-500" />
                        <div className="flex flex-col">
                            <span className="font-black text-slate-400 uppercase text-[9px] tracking-widest">Narrative Framework</span>
                            <span className="text-rose-600 uppercase font-black text-xs px-2 py-0.5 bg-rose-50 rounded border border-rose-100">{caseStudy.narrativeAngle_sq}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <a href={caseStudy.articleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] text-blue-600 hover:text-blue-800 font-mono font-bold uppercase tracking-widest transition-all">
                        <SearchIcon className="w-4 h-4" /> SCAN_SOURCE_URL
                    </a>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="p-10 bg-white rounded-[2rem] border border-slate-200 shadow-sm text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block font-mono">Integrity Score</span>
                    <div className={`text-9xl font-black font-mono tracking-tighter leading-none ${failAudit ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {caseStudy.integrityScore}
                    </div>
                    <div className={`mt-8 px-6 py-2 text-white font-black text-[10px] rounded-full uppercase tracking-[0.2em] inline-block shadow-lg ${failAudit ? 'bg-rose-600 shadow-rose-200' : 'bg-emerald-600 shadow-emerald-200'}`}>
                        {failAudit ? 'FAIL_AUDIT' : 'PASS_AUDIT'}
                    </div>
                </div>
                <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block font-mono">Spectrum Balance</span>
                    <PieChart data={caseStudy.chartData} size={160} />
                </div>
            </div>
        </section>

        {/* 2. ZONE A: REDLINE FORENSIC TRANSCRIPT (Interactive) */}
        <section className="mb-20">
          <SectionHeader code="ZONE_A" title_sq="Transkripti Forenzik i Redaktuar" title_en="The Redline Forensic Transcript" icon={<DocumentTextIcon className="w-6 h-6"/>} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm relative overflow-hidden min-h-[500px]">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-50"></div>
              <div className="text-2xl leading-[1.6] text-slate-500 font-serif italic text-justify">
                {caseStudy.forensicTranscript?.map((segment, idx) => {
                  if (typeof segment === 'string') return <span key={idx}>{segment}</span>;
                  const isHovered = activeMarker?.id === segment.id;
                  const colorClass = 
                    segment.type === 'malice' ? 'border-rose-400 text-rose-600 bg-rose-50/50' : 
                    segment.type === 'logic' ? 'border-amber-400 text-amber-600 bg-amber-50/50' : 
                    'border-slate-300 text-slate-900 bg-slate-50/50';

                  return (
                    <span
                      key={segment.id}
                      onMouseEnter={() => setActiveMarker(segment)}
                      onMouseLeave={() => setActiveMarker(null)}
                      className={`cursor-help border-b-2 transition-all duration-300 px-1 rounded-sm not-italic font-bold ${colorClass} ${isHovered ? 'brightness-110 scale-105 shadow-sm border-b-4' : ''}`}
                    >
                      {segment.text_sq}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 sticky top-28">
              <div className={`min-h-[400px] rounded-[2rem] border-2 p-10 transition-all duration-500 flex flex-col justify-center ${
                activeMarker 
                ? 'border-primary-500/30 bg-slate-50 shadow-xl scale-100'
                : 'border-slate-200 bg-white opacity-40 scale-95'
              }`}>
                {activeMarker ? (
                  <div className="animate-fadeIn">
                    <div className="bg-rose-600 text-white inline-block px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                      {activeMarker.alert_sq || "VIOLATION DETECTED"}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">{activeMarker.category_sq}</h3>
                    <p className="text-[11px] text-slate-500 font-bold mb-8 uppercase tracking-widest border-b border-slate-200 pb-2">{activeMarker.category_en}</p>
                    
                    <div className="space-y-6">
                        <div>
                             <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest mb-1 block">Audit Analysis (SQ)</span>
                             <p className="text-lg leading-relaxed text-slate-700 font-serif italic">"{activeMarker.description_sq}"</p>
                        </div>
                        <div className="pt-6 border-t border-slate-200">
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Forensic Context (EN)</span>
                             <p className="text-sm leading-relaxed text-slate-500 font-serif italic">"{activeMarker.description_en}"</p>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="p-6 bg-slate-100 rounded-full w-fit mx-auto">
                        <SearchIcon className="w-12 h-12 text-slate-300" />
                    </div>
                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500 leading-relaxed">
                        Audit pending.<br/>Hover over highlighted segments to reveal evidence callouts.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. ZONE B: LOGIC & ETHICS SCORECARD */}
        <section className="mb-20">
          <SectionHeader code="ZONE_B" title_sq="Vlerësimi i Logjikës dhe Etikës" title_en="Logic & Ethics Scorecard" icon={<ScaleIcon className="w-6 h-6"/>} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm flex flex-col">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" /> Fallacy Detection
              </h3>
              <div className="space-y-4 flex-grow">
                {(caseStudy.fallacies || []).map((f, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-rose-300 transition-all duration-300">
                    <h4 className="text-[10px] font-black text-rose-600 uppercase mb-2 tracking-widest">{f.name}</h4>
                    <p className="text-sm text-slate-600 italic font-medium leading-relaxed">"{f.desc}"</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm flex flex-col">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-500" /> IFJ Ethics Charter
              </h3>
              <div className="space-y-4 flex-grow">
                {(caseStudy.ethicsCompliance || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                    <div className={`flex items-center gap-2 ${item.status === 'FAILED' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {item.status === 'FAILED' ? <XMarkIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. ZONE C: CLINICAL REBUTTAL LEDGER (Bilingual Table) */}
        <section className="mb-20 bg-white p-10 sm:p-16 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>
            <header className="mb-12 text-center">
                <span className="text-[10px] font-mono font-black text-primary-500 uppercase tracking-[0.4em] block mb-4">ZONE_C // CLINICAL_REBUTTAL_LEDGER</span>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Regjistri i Verifikimit të Pretendimeve</h2>
            </header>
            <div className="overflow-hidden border border-slate-200 rounded-3xl shadow-inner">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200">
                        <tr>
                            <th className="p-8">Fabricated Claim / Pretendimi</th>
                            <th className="p-8 border-l border-slate-200">Clinical Reality / Realiteti i Verifikuar</th>
                            <th className="p-8 text-center border-l border-slate-200">Risk</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {caseStudy.claimLedger?.map((entry, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors duration-200">
                                <td className="p-8 w-1/3 align-top">
                                    <div className="flex gap-4">
                                        <XCircleIcon className="w-6 h-6 text-rose-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-base font-bold text-slate-900 leading-tight">"{entry.claim_sq}"</p>
                                            <p className="text-[10px] text-slate-500 mt-3 uppercase font-mono italic tracking-tighter">{entry.claim_en}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8 border-l border-slate-100 align-top">
                                    <div className="flex gap-4">
                                        <CheckCircleIcon className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                        <div className="space-y-3">
                                            <p className="text-sm text-slate-700 leading-relaxed font-mono font-medium">{entry.reality_sq || "Verifikimi në proces..."}</p>
                                            {entry.reality_en && <p className="text-[10px] text-slate-500 font-mono italic">{entry.reality_en}</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8 text-center border-l border-slate-100 align-top">
                                    <RiskBadge risk={entry.risk} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        {/* 5. DIAGNOSTIC NEUTRALITY REWRITE */}
        <section className="mb-20">
            <SectionHeader code="PHASE_09" title_sq="Rishkrimi i Neutralizuar" title_en="Diagnostic Neutrality Rewrite" icon={<ArrowPathIcon className="w-6 h-6"/>} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-emerald-50/50 border-2 border-emerald-500/10 p-10 rounded-[2rem] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20"></div>
                    <p className="text-[10px] font-mono font-black text-emerald-600 uppercase mb-6 tracking-widest flex items-center gap-2">
                        <CheckCircleIcon className="w-3 h-3"/> ALBANIAN_STANDARD_DRAFT
                    </p>
                    <p className="text-2xl text-emerald-950 font-serif italic leading-relaxed">"{caseStudy.neutralRewrite_sq}"</p>
                </div>
                <div className="bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-100"></div>
                    <p className="text-[10px] font-mono font-black text-slate-500 uppercase mb-6 tracking-widest">ENGLISH_STANDARD_DRAFT</p>
                    <p className="text-2xl text-slate-500 font-serif italic leading-relaxed">"{caseStudy.neutralRewrite_en}"</p>
                </div>
            </div>
        </section>

        {/* 6. MACHINE NOTICE & VERDICT */}
        <section className="mb-20">
            <div className={`p-12 sm:p-20 rounded-[3rem] border-2 text-center relative overflow-hidden group transition-all duration-700 ${
                failAudit ? 'bg-rose-600 border-rose-500 shadow-2xl shadow-rose-200' : 'bg-emerald-600 border-emerald-500 shadow-2xl shadow-emerald-200'
            }`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                <div className="relative z-10">
                    <CpuChipIcon className="w-20 h-20 mx-auto text-white mb-8 animate-pulse" />
                    <h3 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-none">Final Forensic Verdict</h3>
                    <p className="text-xl sm:text-2xl text-white/90 font-serif italic max-w-4xl mx-auto mb-12 leading-relaxed">
                        "{caseStudy.verdictSummary_en || "Verification conclusive: Content classified as high-risk malicious disinformation."}"
                    </p>
                    <div className="flex justify-center gap-6 flex-col sm:flex-row">
                        <button onClick={onBack} className="px-12 py-5 bg-white text-slate-900 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-100 transition-all shadow-xl active:scale-95">
                            EXIT_AUDIT_LEDGER
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-10 text-center opacity-40">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.5em] font-black">NOVARIC® FORENSIC UNIT // CLINICAL_AUDIT_NODE // {new Date().getFullYear()}</p>
            </div>
        </section>

      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};
