
import React from 'react';
import { XMarkIcon, ScaleIcon } from './icons';

interface HorizonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HorizonModal: React.FC<HorizonModalProps> = ({ isOpen, onClose }) => {
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
                <div className="w-8 h-8 rounded bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50">
                    <ScaleIcon className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-mono uppercase tracking-widest">
                    HORIZON <span className="text-slate-500 mx-2">|</span> <span className="text-yellow-400">THE INDEX OF COGNITIVE RIGIDITY</span>
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
            <div className="bg-yellow-900/10 border-l-4 border-yellow-500 p-4 rounded-r-sm shadow-inner backdrop-blur-sm">
                 <p className="text-sm text-yellow-100/90 leading-relaxed font-medium italic">
                    "Every journalist has a perspective (a 'Horizon'). That is natural. The problem arises when that Horizon is Rigid (refusing to see other views) rather than Fused (engaging with other views)."
                 </p>
            </div>

            {/* 1. Definition */}
            <section>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                    <span className="text-yellow-500 mr-2 font-mono">A.</span> The Core Definition
                </h3>
                <p className="text-sm leading-relaxed text-slate-300 mb-3">
                    HORIZON measures the <strong>Cognitive Flexibility</strong> of the media personality. It determines if the journalist is operating as an explorer of truth (expanding their horizon) or a guardian of a dogma (defending a fixed horizon). It is the metric of Intellectual Honesty.
                </p>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded text-center">
                    <span className="text-yellow-400 font-semibold text-base">"The Measurement of Bias & Mindset"</span>
                </div>
            </section>

            {/* 2. The Algorithm */}
            <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-yellow-500 mr-2 font-mono">B.</span> How the AI Measures It (The Algorithm)
                </h3>
                <p className="text-sm text-slate-400 mb-4">Nora analyzes the Psycholinguistic Structure of the speech:</p>
                
                <div className="grid gap-4">
                    {/* Rigidity Indicators */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border-l-4 border-yellow-600 p-5 rounded shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-yellow-500 mb-2 flex items-center uppercase tracking-wide text-sm">
                            1. Rigidity Indicators
                        </h4>
                        <p className="text-sm text-slate-300">
                            Usage of absolutist words (e.g., "Always," "Never," "Indisputable," "Traitors"). High frequency indicates a closed mind.
                        </p>
                    </div>

                    {/* Dialectic Indicators */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border-l-4 border-amber-500 p-5 rounded shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-amber-400 mb-2 flex items-center uppercase tracking-wide text-sm">
                            2. Dialectic Indicators
                        </h4>
                        <p className="text-sm text-slate-300">
                             Usage of synthesis words (e.g., "However," "On the other hand," "Despite this," "Valid point"). Indicates processing of nuance.
                        </p>
                    </div>

                    {/* The Fusion Test */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border-l-4 border-orange-500 p-5 rounded shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-orange-400 mb-2 flex items-center uppercase tracking-wide text-sm">
                            3. The "Fusion" Test
                        </h4>
                        <p className="text-sm text-slate-300">
                            Does the journalist ever concede a point to a guest with an opposing view? (Gadamer's "Fusion of Horizons").
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Visual Output */}
             <section className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                        <span className="text-yellow-500 mr-2 font-mono">C.</span> The Visual Output
                    </h3>
                    <p className="text-sm text-slate-400 mb-3">On the Profile: <strong>The Rigidity Slider</strong> (Bi-polar scale).</p>
                    
                    <div className="space-y-3">
                         <div className="p-3 bg-rose-900/10 border border-rose-800/50 rounded text-rose-400 text-xs">
                            <strong className="block mb-1 uppercase text-rose-300">Left Side (Rigid/Dogmatic)</strong>
                            The journalist creates an Echo Chamber. They only reinforce what their audience already believes.
                        </div>
                        <div className="p-3 bg-emerald-900/10 border border-emerald-800/50 rounded text-emerald-400 text-xs">
                            <strong className="block mb-1 uppercase text-emerald-300">Right Side (Flexible/Dialectic)</strong>
                            The journalist challenges their audience and themselves.
                        </div>
                        <div className="p-3 bg-slate-800 border border-slate-700 rounded text-slate-400 text-xs italic mt-2">
                            Meaning: "Is this person a soldier for a cause, or a journalist seeking answers?"
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded border border-slate-800 p-6">
                    {/* Simulated Slider Visual */}
                     <div className="w-full mb-2 flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                        <span>Dogmatic</span>
                        <span>Dialectic</span>
                    </div>
                    <div className="w-full h-4 bg-slate-800 rounded-full relative overflow-hidden border border-slate-700 shadow-inner">
                         <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-slate-800 to-blue-900 opacity-60"></div>
                         {/* The Indicator */}
                         <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,1)] left-[20%]"></div>
                    </div>
                    <div className="mt-4 text-center">
                         <span className="text-3xl font-black text-white font-mono">20<span className="text-sm text-slate-500">/100</span></span>
                         <p className="text-[10px] font-mono text-red-500 uppercase tracking-widest mt-1">HIGH RIGIDITY DETECTED</p>
                    </div>
                </div>
            </section>

             {/* Footer */}
             <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                    NOVARIC® MINDSET SCANNER v1.0
                </p>
             </div>
        </div>
      </div>
    </div>
  );
};
