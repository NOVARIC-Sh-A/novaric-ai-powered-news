
import React from 'react';
import { XMarkIcon, ShieldCheckIcon } from './icons';

interface AletheiaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AletheiaModal: React.FC<AletheiaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-slate-950 border border-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-blue-950/90 backdrop-blur-md border-b border-blue-800/50 p-5 flex justify-between items-center z-10 shadow-lg">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                    <ShieldCheckIcon className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-mono uppercase tracking-widest">
                    ALETHEIA <span className="text-slate-500 mx-2">|</span> <span className="text-cyan-400">THE INDEX OF UN-CONCEALMENT</span>
                </h2>
            </div>
            <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
            >
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 text-slate-300 font-sans bg-slate-950">
            
            {/* Context Box */}
            <div className="bg-blue-900/10 border-l-4 border-cyan-500 p-4 rounded-r-sm shadow-inner backdrop-blur-sm">
                 <p className="text-sm text-cyan-100/90 leading-relaxed font-medium italic">
                    "In standard fact-checking, a statement is rated 'True' or 'False.' In the NOVARIC® system, this is insufficient. A statement can be factually 'True' but deceptively used. ALETHEIA measures the integrity of the narrative."
                 </p>
            </div>

            {/* 1. Definition */}
            <section>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                    <span className="text-cyan-500 mr-2 font-mono">A.</span> The Core Definition
                </h3>
                <p className="text-sm leading-relaxed text-slate-300 mb-3">
                    ALETHEIA (from Greek <em>a-letheia</em>, literally "un-forgetting") is the score of <strong>Clinical Clarity</strong>. It measures how much the media content reveals the full reality of a situation, including its history, context, and opposing evidence.
                </p>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded text-center">
                    <span className="text-cyan-400 font-semibold text-base">"Is this article trying to inform me, or manipulate me with selective facts?"</span>
                </div>
            </section>

            {/* 2. The Algorithm */}
            <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-cyan-500 mr-2 font-mono">B.</span> How the AI Measures It (The Algorithm)
                </h3>
                <p className="text-sm text-slate-400 mb-4">Nora calculates the Aletheia Score (0-100) by synthesizing three distinct vectors:</p>
                
                <div className="grid gap-4">
                    {/* Genealogical Integrity */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border-l-4 border-cyan-500 p-5 rounded shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-cyan-400 mb-2 flex items-center uppercase tracking-wide text-sm">
                            1. Genealogical Integrity
                        </h4>
                        <p className="text-sm text-slate-300">
                            Does the article cite primary sources (documents, raw data) or secondary spin (opinion, other media)? We trace the information back to its origin.
                        </p>
                    </div>

                    {/* Contextual Density */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border-l-4 border-blue-500 p-5 rounded shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-blue-400 mb-2 flex items-center uppercase tracking-wide text-sm">
                            2. Contextual Density
                        </h4>
                        <p className="text-sm text-slate-300">
                             If the article mentions a statistic (e.g., "Crime is up"), does it provide the historical trend (e.g., "But lower than 2010")? High density prevents manipulation by omission.
                        </p>
                    </div>

                    {/* Visual Logic */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border-l-4 border-indigo-500 p-5 rounded shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-indigo-400 mb-2 flex items-center uppercase tracking-wide text-sm">
                            3. Visual Logic
                        </h4>
                        <p className="text-sm text-slate-300">
                            Does the headline match the content, or is it "Clickbait"? We analyze the semantic distance between the title's promise and the article's delivery.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Visual Output */}
             <section className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                        <span className="text-cyan-500 mr-2 font-mono">C.</span> The Visual Output
                    </h3>
                    <p className="text-sm text-slate-400 mb-3">Represented on the Card as a glowing ring (The Truthometer).</p>
                    
                    <div className="space-y-3">
                         <div className="p-3 bg-emerald-900/10 border border-emerald-800/50 rounded text-emerald-400 text-xs">
                            <strong className="block mb-1 uppercase text-emerald-300">High Score (80-100)</strong>
                            The content brings the truth "into the clearing" (Heidegger). It is safe to trust.
                        </div>
                        <div className="p-3 bg-rose-900/10 border border-rose-800/50 rounded text-rose-400 text-xs">
                            <strong className="block mb-1 uppercase text-rose-300">Low Score (&lt;50)</strong>
                            The content obscures reality. It may contain facts, but they are arranged deceptively.
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded border border-slate-800 p-4">
                     <div className="relative w-32 h-32 flex items-center justify-center mb-2">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#22d3ee" strokeWidth="8" 
                                strokeDasharray="283" 
                                strokeDashoffset="40" 
                                className="drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                            />
                        </svg>
                        <span className="absolute text-3xl font-black text-white font-mono">86</span>
                   </div>
                   <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">CLINICAL CLARITY</span>
                </div>
            </section>

             {/* Footer */}
             <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                    NOVARIC® INTEGRITY PROTOCOL v2.4
                </p>
             </div>
        </div>
      </div>
    </div>
  );
};
