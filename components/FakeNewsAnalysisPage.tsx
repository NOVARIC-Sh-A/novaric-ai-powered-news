import React, { useState, useMemo } from 'react';
import { FakeNewsCaseStudy } from '../types';
import { 
  CpuChipIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ScaleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  SearchIcon,
  XMarkIcon,
  InformationCircleIcon,
  Activity
} from './icons';

interface FakeNewsAnalysisPageProps {
  caseStudy: FakeNewsCaseStudy;
  onBack: () => void;
}

interface EvidencePoint {
  id: string;
  text: string;
  type: 'malice' | 'logic' | 'void';
  alert: string;
  category: string;
  description: string;
}

export const FakeNewsAnalysisPage: React.FC<FakeNewsAnalysisPageProps> = ({ caseStudy, onBack }) => {
  const [activeEvidence, setActiveEvidence] = useState<EvidencePoint | null>(null);

  // Forensic markers for the "autopsy"
  const forensicSegments: (string | EvidencePoint)[] = useMemo(() => [
    "Sipas një raportimi të fundit nga burime të paidentifikuara, ",
    {
      id: "ev1",
      text: "trafikanti i afrikanëve",
      type: 'malice',
      category: "Loaded Labeling",
      alert: "MARAGON® ALERT: Violation of Neutrality",
      description: "Categorized as 'Loaded Labeling' without judicial reference. Use of criminal descriptors before any legal conviction identifies a primary character assassination intent."
    },
    " Alban Thika, i cili dyshohet se është ",
    {
      id: "ev2",
      text: "i lidhur me rusët",
      type: 'void',
      category: "Data Void",
      alert: "DATA INTEGRITY FAILURE",
      description: "Claim presented as fact without a single hyperlinked source, document ID, or photographic evidence. Statistical probability of fabrication: 98%."
    },
    " dhe është parë në shoqërinë e ministrit Hasani. Ky fakt vërteton se ai po përdor diplomacinë si ",
    {
      id: "ev3",
      text: "mbulesë për krimin",
      type: 'logic',
      category: "Non-Sequitur",
      alert: "LOGIC FRACTURE DETECTED",
      description: "Any statement where the conclusion does not follow the premise. Presence in a state delegation does not logistically or legally imply criminal activity."
    },
    ", ndërkohë që ai është i shpallur ",
    {
      id: "ev4",
      text: "‘non grata’ në SHBA-BE",
      type: 'malice',
      category: "Explicit Fabrication",
      alert: "MALICE MARKER: Reputational Sabotage",
      description: "False claim regarding international status. Verified against US Treasury OFAC & EU Sanctions List. Subject is NOT listed. Intentional spread of misinformation for digital blackmail."
    },
    "."
  ], []);

  const fallacies = [
    { name: "Ad Hominem", desc: "Sulmi ndaj personit (Alban Thika) në vend të shqyrtimit të veprimtarisë së tij profesionale." },
    { name: "Guilt by Association", desc: "Supozimi i fajësisë për shkak të pranisë në një delegacion shtetëror." },
    { name: "Poisoning the Well", desc: "Përdorimi i epiteteve 'trafikant' që në fillim për të paracaktuar opinionin e lexuesit." }
  ];

  const ifjEthics = [
    { label: "Verification of Sources", status: "FAILED" },
    { label: "Objectivity of Tone", status: "FAILED" },
    { label: "Right of Reply Granted", status: "FAILED" },
    { label: "Distinction: Fact vs Opinion", status: "FAILED" }
  ];

  const rebuttalLedger = [
    { 
      claim: "Alban Thika is 'non-grata' in USA-EU.", 
      reality: "SCAN RESULT: Verified against US Treasury OFAC & EU Sanctions List [Timestamp: Current]. Status: CLEAR. Maltese Passport #1398461 is fully active and valid for travel within the Schengen area." 
    },
    { 
      claim: "Trafikant i afrikanëve.", 
      reality: "DATA AUDIT: Zero records of criminal proceedings or investigations for trafficking. Subject owns a licensed recruitment agency certified by the Ministry of Economy." 
    }
  ];

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-rose-500/30">
      
      {/* TACTICAL HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 py-4">
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
              <ArrowPathIcon className="w-6 h-6 rotate-180" />
            </button>
            <div className="h-8 w-px bg-slate-700"></div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter text-white">Forensic Audit: <span className="text-rose-600">Deep Scan</span></h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">System ID: {caseStudy.id} // SECURE_NODE_9021</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest">
               <Activity className="w-3 h-3 animate-pulse" /> Live Analysis
             </div>
             <span className="text-[10px] font-mono text-slate-500">CIDA v2.4</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-12">
        
        {/* ZONE A: FORENSIC TRANSCRIPT */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <DocumentTextIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Zone A: The Redline Forensic Transcript</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Text */}
            <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 p-8 rounded-2xl shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-800"></div>
              <div className="text-xl leading-relaxed text-slate-400 font-serif italic text-justify">
                {forensicSegments.map((segment, idx) => {
                  if (typeof segment === 'string') return <span key={idx}>{segment}</span>;
                  
                  const isHovered = activeEvidence?.id === segment.id;
                  const colorClass = 
                    segment.type === 'malice' ? 'border-rose-600 text-rose-500 bg-rose-500/5' : 
                    segment.type === 'logic' ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 
                    'border-slate-300 text-slate-100 bg-white/5';

                  return (
                    <span
                      key={segment.id}
                      onMouseEnter={() => setActiveEvidence(segment)}
                      onMouseLeave={() => setActiveEvidence(null)}
                      className={`cursor-help border-b-2 transition-all duration-300 ${colorClass} ${isHovered ? 'brightness-125 px-1' : ''}`}
                    >
                      {segment.text}
                    </span>
                  );
                })}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-800 flex gap-4 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-600"></div> Malice Marker</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Logic Fracture</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white"></div> Data Void</span>
              </div>
            </div>

            {/* Right: Evidence Callout */}
            <div className="lg:col-span-5 sticky top-28">
              <div className={`min-h-[300px] rounded-3xl border-2 p-8 transition-all duration-500 flex flex-col justify-center ${
                activeEvidence 
                ? (activeEvidence.type === 'malice' ? 'border-rose-600/50 bg-rose-950/20 shadow-[0_0_50px_rgba(225,29,72,0.2)]' : 
                   activeEvidence.type === 'logic' ? 'border-amber-500/50 bg-amber-950/20 shadow-[0_0_50px_rgba(234,179,8,0.2)]' : 
                   'border-slate-700 bg-slate-800 shadow-xl')
                : 'border-slate-800 bg-slate-900/50 opacity-40 grayscale'
              }`}>
                {activeEvidence ? (
                  <div className="animate-fadeIn">
                    <div className={`inline-block px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-4 ${
                        activeEvidence.type === 'malice' ? 'bg-rose-600 text-white' : 
                        activeEvidence.type === 'logic' ? 'bg-amber-600 text-black' : 'bg-white text-black'
                    }`}>
                      {activeEvidence.alert}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{activeEvidence.category}</h3>
                    <p className="text-lg leading-relaxed text-slate-300 font-serif italic">
                      "{activeEvidence.description}"
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <SearchIcon className="w-16 h-16 mx-auto text-slate-700" />
                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-slate-600">Hover over highlighted text to reveal forensic evidence</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ZONE B: LOGIC & ETHICS SCORECARD */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <ScaleIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Zone B: The Logic & Ethics Scorecard</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fallacies */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" /> Fallacy Detection
              </h3>
              <div className="space-y-4">
                {fallacies.map((f, i) => (
                  <div key={i} className="p-5 bg-black/40 rounded-xl border border-slate-800 group hover:border-rose-500/30 transition-colors">
                    <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-2">{f.name}</h4>
                    <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* IFJ Standards */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-primary-500" /> IFJ Ethics Charter
              </h3>
              <div className="space-y-4">
                {ifjEthics.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-rose-950/10 border border-rose-900/30 rounded-xl">
                    <span className="text-sm font-bold text-slate-300">{item.label}</span>
                    <div className="flex items-center gap-2 text-rose-600">
                      <XMarkIcon className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ZONE C: CLINICAL REBUTTAL LEDGER */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <GlobeAltIcon className="w-5 h-5 text-primary-500" />
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Zone C: The Clinical Rebuttal Ledger</h2>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
             <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-6 w-1/3">Fabricated_Claim</th>
                    <th className="p-6">Clinical_Reality_Scan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {rebuttalLedger.map((row, i) => (
                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                      <td className="p-6 align-top">
                        <div className="flex gap-3">
                          <XCircleIcon className="w-5 h-5 text-rose-600 flex-shrink-0" />
                          <span className="text-sm font-bold text-slate-200">"{row.claim}"</span>
                        </div>
                      </td>
                      <td className="p-6 align-top">
                        <div className="flex gap-3">
                          <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-slate-400 leading-relaxed font-mono group-hover:text-slate-200 transition-colors">{row.reality}</p>
                            <div className="mt-3 inline-flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded">
                               Verified_Ground_Truth
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </section>

        {/* FINAL FORENSIC VERDICT */}
        <footer className="bg-rose-600 rounded-3xl p-10 sm:p-20 text-center shadow-[0_20px_60px_rgba(225,29,72,0.3)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <CpuChipIcon className="w-24 h-24 mx-auto text-white mb-8 animate-pulse" />
            <h3 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-none">Final Forensic Verdict</h3>
            <p className="text-xl sm:text-3xl text-white/90 font-serif italic max-w-4xl mx-auto leading-relaxed mb-12">
              "Based on the CIDA (Content Integrity & Defamation Audit), this content is classified as <span className="underline decoration-white/40">High-Risk Disinformation</span>. It exhibits 0% adherence to standard journalistic writing. The linguistic pattern matches known 'Black PR' templates used for digital extortion. Recommendation: Immediate legal delisting and professional disregard."
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={onBack} className="px-10 py-5 bg-white text-rose-600 font-black uppercase tracking-widest text-xs rounded-sm shadow-xl hover:bg-slate-100 transition-all active:scale-95">
                EXIT_AUDIT_ENVIRONMENT
              </button>
              <button className="px-10 py-5 bg-black/40 border border-white/30 text-white font-black uppercase tracking-widest text-xs rounded-sm shadow-xl hover:bg-black/60 transition-all flex items-center justify-center gap-3">
                <DownloadIcon className="w-5 h-5" /> DOWNLOAD_FULL_CIDA_REPORT.PDF
              </button>
            </div>
          </div>
        </footer>

        <div className="py-20 text-center opacity-30">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.6em] font-black">NOVARIC® FORENSIC UNIT // COMPLIANCE_SECURE_NODE_9021</p>
        </div>

      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .bg-tech-grid {
            background-size: 30px 30px;
            background-image:
                linear-gradient(to right, rgba(225, 29, 72, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(225, 29, 72, 0.05) 1px, transparent 1px);
        }
        @keyframes float { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-10px); } 
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

const DownloadIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);