
import React from 'react';

interface LetheVoidMapProps {
    ignoredTopics?: string[];
    lang?: 'sq' | 'en';
}

export const LetheVoidMap: React.FC<LetheVoidMapProps> = ({ ignoredTopics, lang = 'sq' }) => {
    if (!ignoredTopics || ignoredTopics.length === 0) return null;

    const t = lang === 'sq' 
        ? { title: 'HARTA E ZBRAZËTISË "LETHE"', subtitle: 'TEMAT E INJORUARA SISTEMATIKISHT' }
        : { title: '"LETHE" VOID MAP', subtitle: 'SYSTEMATICALLY IGNORED TOPICS' };

    return (
        <section className="mb-8 mt-8 pt-6 border-t border-slate-700/50 relative">
             <div className="flex justify-between items-baseline mb-6">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] glow-text">
                    {t.title}
                </h3>
                <span className="text-[10px] font-mono text-red-500 animate-pulse">● LIVE DATA GAP</span>
             </div>
            
            <div className="relative w-full h-72 rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center shadow-2xl">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20" 
                    style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* Event Horizon (The Black Hole) */}
                <div className="absolute w-32 h-32 rounded-full bg-black z-10 shadow-[0_0_60px_20px_rgba(0,0,0,1)] ring-1 ring-white/5"></div>
                
                {/* Accretion Disk (The Glow) */}
                <div className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-40 animate-spin-slow z-0"></div>
                <div className="absolute w-36 h-36 rounded-full border border-white/10 z-5 animate-spin-reverse-slow"></div>
                
                {/* Floating Topics (Matter falling in) */}
                {ignoredTopics.map((topic, i) => {
                     // Spiral positioning
                     const angle = (i / ignoredTopics.length) * 2 * Math.PI + (Math.random() * 0.5);
                     const radius = 90 + Math.random() * 60; // Distance from center
                     const x = Math.cos(angle) * radius;
                     const y = Math.sin(angle) * radius;
                     const size = 0.7 + Math.random() * 0.4; // Random font size scale
                     const duration = 10 + Math.random() * 10; // Random float duration

                     return (
                         <span 
                            key={i}
                            className="absolute text-xs font-mono text-slate-400 opacity-60 hover:opacity-100 hover:text-white hover:scale-110 transition-all duration-300 cursor-help select-none"
                            style={{ 
                                transform: `translate(${x}px, ${y}px) scale(${size})`,
                                textShadow: '0 0 5px rgba(0,0,0,0.8)',
                                animation: `float ${duration}s ease-in-out infinite`
                            }}
                            title="This topic is rarely discussed."
                         >
                             {topic}
                         </span>
                     );
                })}

                {/* Overlay Vignette */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,black_100%)]"></div>
                
                <div className="absolute bottom-3 right-3 text-[9px] text-slate-600 font-mono tracking-widest">
                    {t.subtitle}
                </div>
            </div>
            <style>{`
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes spin-reverse-slow { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
                @keyframes float { 0% { transform: translate(var(--tx), var(--ty)) scale(var(--s)); } 50% { transform: translate(var(--tx), calc(var(--ty) - 5px)) scale(var(--s)); } 100% { transform: translate(var(--tx), var(--ty)) scale(var(--s)); } }
                .animate-spin-slow { animation: spin-slow 20s linear infinite; }
                .animate-spin-reverse-slow { animation: spin-reverse-slow 25s linear infinite; }
            `}</style>
        </section>
    );
};
