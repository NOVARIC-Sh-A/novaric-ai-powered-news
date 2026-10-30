
import React from 'react';
import { XMarkIcon, EyeSlashIcon } from './icons';

interface LetheModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LetheModal: React.FC<LetheModalProps> = ({ isOpen, onClose }) => {
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
                <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
                    <EyeSlashIcon className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-mono uppercase tracking-widest">
                    LETHE <span className="text-slate-500 mx-2">|</span> <span className="text-purple-400">THE INDEX OF OMISSION</span>
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
            <div className="bg-purple-900/10 border-l-4 border-purple-500 p-4 rounded-r-sm shadow-inner backdrop-blur-sm">
                 <p className="text-sm text-purple-100/90 leading-relaxed font-medium italic">
                    "Media bias often manifests not in what is said, but in what is silenced. LETHE is the forensic analysis of these silences."
                 </p>
            </div>

            {/* 1. Definition */}
            <section>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                    <span className="text-purple-500 mr-2 font-mono">A.</span> The Core Definition
                </h3>
                <p className="text-sm leading-relaxed text-slate-300 mb-3">
                    LETHE (The River of Forgetfulness) measures <strong>Intentional Omission</strong>. It identifies the "Black Holes" in a journalist's or outlet's coverage. It detects when specific topics, context, or history are deliberately buried to protect political or financial interests.
                </p>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded text-center">
                    <span className="text-purple-400 font-semibold text-base">"The Measurement of the 'Void'"</span>
                </div>
            </section>

            {/* 2. The Algorithm */}
            <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-purple-500 mr-2 font-mono">B.</span> How the AI Measures It (The Algorithm)
                </h3>
                <p className="text-sm text-slate-400 mb-4">Nora uses Comparative Absence Analysis:</p>
                
                <div className="grid gap-4">
                    {/* The Lateral Scan */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border-l-4 border-purple-500 p-5 rounded shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-purple-400 mb-2 flex items-center uppercase tracking-wide text-sm">
                            1. The Lateral Scan
                        </h4>
                        <p className="text-sm text-slate-300">
                            The AI scans 5 other high-trust or opposing-viewpoint sources on the same topic to establish a baseline of facts.
                        </p>
                    </div>

                    {/* The Delta Check */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border-l-4 border-indigo-500 p-5 rounded shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-indigo-400 mb-2 flex items-center uppercase tracking-wide text-sm">
                            2. The Delta Check
                        </h4>
                        <p className="text-sm text-slate-300">
                             If Source A, B, and C mention "Fact X," but the Target Profile never mentions "Fact X," the Lethe Index rises.
                        </p>
                    </div>

                    {/* Topic Avoidance */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border-l-4 border-fuchsia-500 p-5 rounded shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-fuchsia-400 mb-2 flex items-center uppercase tracking-wide text-sm">
                            3. Topic Avoidance
                        </h4>
                        <p className="text-sm text-slate-300">
                            The AI tracks long-term patterns. Does this journalist never criticize a specific oligarch or political figure?
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Visual Output */}
             <section className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                        <span className="text-purple-500 mr-2 font-mono">C.</span> The Visual Output
                    </h3>
                    <p className="text-sm text-slate-400 mb-3">On the Profile: <strong>The Void Map</strong>.</p>
                    
                    <div className="space-y-3">
                        <p className="text-sm text-slate-300">
                            Visualization: A dark, nebulous cluster or "Black Hole" graphic labeled with the missing topics (e.g., "PPP Contracts," "Opposition Scandals").
                        </p>
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded text-slate-400 text-xs italic">
                            Meaning: "These are the things this person wants you to forget."
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded border border-slate-800 p-4 overflow-hidden relative">
                    {/* Simulated Void Map Visual */}
                    <div className="w-32 h-32 rounded-full bg-black shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center relative z-10">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-900/20 to-black animate-pulse"></div>
                        <span className="text-xs font-mono text-purple-500/50 z-20">VOID</span>
                    </div>
                    <div className="absolute top-1/2 left-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                    <div className="absolute top-1/2 left-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
                    
                    <span className="text-[10px] font-mono text-purple-500 uppercase tracking-widest mt-4 relative z-10">DATA VACUUM DETECTED</span>
                </div>
            </section>

             {/* Footer */}
             <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                    NOVARIC® OMISSION TRACKING PROTOCOL v1.0
                </p>
             </div>
        </div>
      </div>
    </div>
  );
};
