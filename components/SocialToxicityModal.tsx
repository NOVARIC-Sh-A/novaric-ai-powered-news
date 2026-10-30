
import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from './icons';

interface SocialToxicityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialToxicityModal: React.FC<SocialToxicityModalProps> = ({ isOpen, onClose }) => {
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
                <div className="w-8 h-8 rounded bg-rose-500/20 flex items-center justify-center border border-rose-500/50">
                    <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-mono uppercase tracking-widest">
                    TOKSICITETI SOCIAL <span className="text-slate-500 mx-2">|</span> <span className="text-rose-400">SOCIAL TOXICITY</span>
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
                    Në kontekstin e platformës NOVARIC® dhe kornizës MARAGON-Ω, TOKSICITETI SOCIAL është një metrikë klinike specifike brenda dimensionit të Rezonancës Etike (CSR).
                 </p>
            </div>

            {/* 1. Definition */}
            <section>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                    <span className="text-cyan-500 mr-2 font-mono">01.</span> Përkufizimi Themelor
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                    Nuk do të thotë thjesht "vrazhdësi" apo "gjuhë e keqe." Është një matje sociologjike e dëmit që një personalitet mediatik i shkakton shëndetit të Sferës Publike. Ai i përgjigjet pyetjes:
                </p>
                <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded text-center">
                    <span className="text-cyan-400 font-semibold text-base">"A e bën retorika e këtij personi shoqërinë të aftë për dialog, apo e fragmenton atë në fise ndërluftuese?"</span>
                </div>
            </section>

            {/* 2. Three Components */}
            <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-cyan-500 mr-2 font-mono">02.</span> Tre Komponentët e Toksicitetit
                </h3>
                
                <div className="grid gap-4">
                    {/* A. Polarization */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border-l-4 border-rose-500 p-5 rounded shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-rose-400 mb-2 flex items-center uppercase tracking-wide text-sm">
                            A. Polarizimi (Indeksi "Ne vs. Ata")
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li><strong className="text-white">Çfarë është:</strong> Krijimi i ndarjeve artificiale ku kundërshtarët trajtohen si armiq ekzistencialë.</li>
                            <li><strong className="text-white">Indikatori:</strong> Përdorimi i lartë i etiketave dehumanizuese (p.sh., "tradhtarë", "kriminelë", "kafshë", "llum").</li>
                            <li><strong className="text-white">Pse është Toksik:</strong> Shkatërron mundësinë e kompromisit, thelbësor për demokracinë.</li>
                        </ul>
                    </div>

                    {/* B. Cynicism */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border-l-4 border-amber-500 p-5 rounded shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-amber-400 mb-2 flex items-center uppercase tracking-wide text-sm">
                            B. Induksioni i Cinizmit (Hopelessness Index)
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li><strong className="text-white">Çfarë është:</strong> Një stil narrativ që bind audiencën se të gjitha institucionet janë të korruptuara dhe të kota.</li>
                            <li><strong className="text-white">Indikatori:</strong> Retorika që sulmon sistemin pa ofruar zgjidhje. Krijon apati.</li>
                            <li><strong className="text-white">Pse është Toksik:</strong> Një publik cinik tërhiqet nga jeta qytetare, duke lejuar lulëzimin e korrupsionit (efekti "Lethe").</li>
                        </ul>
                    </div>

                    {/* C. Aggression */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border-l-4 border-orange-500 p-5 rounded shadow-md hover:shadow-lg transition-shadow">
                        <h4 className="font-bold text-orange-400 mb-2 flex items-center uppercase tracking-wide text-sm">
                            C. Agresioni mbi Logjikën (Pathos Index)
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li><strong className="text-white">Çfarë është:</strong> Përdorimi i volumit, ndërprerjes dhe ngacmuesve emocionalë për të shtypur debatin logjik.</li>
                            <li><strong className="text-white">Indikatori:</strong> Një "Raport Agresion-ndaj-Qartësisë" i lartë. Ndërprerje të shpeshta, tallje, fallaci "Strawman".</li>
                            <li><strong className="text-white">Pse është Toksik:</strong> Zëvendëson kërkimin për të Vërtetën (Aletheia) me kërkimin për Spektakël.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 3. Measurement & Context */}
             <section className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                        <span className="text-cyan-500 mr-2 font-mono">03.</span> Algoritmi
                    </h3>
                    <div className="space-y-3">
                         <div className="p-3 bg-emerald-900/10 border border-emerald-800/50 rounded text-emerald-400 text-xs">
                            <strong className="block mb-1 uppercase">Rezultat i Gjelbër (Toksicitet i Ulët)</strong>
                            Gazetari lehtëson debatin, lejon kundërshtarët të flasin, kritikon veprimet dhe jo njerëzit.
                        </div>
                        <div className="p-3 bg-rose-900/10 border border-rose-800/50 rounded text-rose-400 text-xs">
                            <strong className="block mb-1 uppercase">Rezultat i Kuq (Toksicitet i Lartë)</strong>
                            Gazetari krijon një "Mjedis Informativ Armiqësor", duke kontribuar në ankthin dhe zemërimin publik.
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                        <span className="text-cyan-500 mr-2 font-mono">04.</span> Konteksti
                    </h3>
                    <div className="p-4 bg-slate-800/30 rounded border border-slate-700 text-sm text-slate-400 italic">
                        "Në peizazhin mediatik shqiptar ('Pluralist i Polarizuar'), Toksiciteti Social përdoret shpesh si mjet politik. Një profil me Toksicitet të Lartë tregon një 'Mercenar Mediatik' — efektiv në shkatërrimin e kundërshtarëve, por i dëmshëm për interesin publik."
                    </div>
                </div>
            </section>

             {/* Footer Alert */}
             <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="border border-rose-900/50 bg-rose-950/10 p-4 rounded text-center">
                    <p className="text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
                        SYSTEM ALERT // BIOHAZARD WARNING
                    </p>
                    <p className="text-sm text-slate-300 font-semibold">
                        "Konsumimi i kësaj përmbajtjeje mund të rrisë artificialisht zemërimin dhe të ulë besimin shoqëror."
                    </p>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};
