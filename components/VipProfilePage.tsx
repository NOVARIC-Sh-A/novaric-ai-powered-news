import React, { useMemo, useState } from 'react';
import { VipProfile, TvShowData, ZodiacSign, MaragonDimensionScores } from '../types';
import { renderWithSuperscript } from '../utils/textUtils';
import { useSeo } from '../hooks/useSeo';
import { JsonLd } from './JsonLd';
import { PieChart } from './PieChart';
import { LikertScaleVote } from './LikertScaleVote';
import { SimplePoll } from './SimplePoll';
import { AriesIcon, TaurusIcon, GeminiIcon, CancerIcon, LeoIcon, VirgoIcon, LibraIcon, ScorpioIcon, SagittariusIcon, CapricornIcon, AquariusIcon, PiscesIcon, ChartBarIcon, ArrowPathIcon, InformationCircleIcon } from './icons';
import { formatVipName, getProfilePhotoUrl } from '../utils/paragonProfileUtils';
import { MaragonSummaryDisplay } from './MaragonSummaryDisplay';
import { PsycholinguisticSpectrogram } from './PsycholinguisticSpectrogram';
import { LetheVoidMap } from './LetheVoidMap';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { SocialToxicityModal } from './SocialToxicityModal';

// Register ChartJS
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface VipProfilePageProps {
  profile: VipProfile;
  onBack: () => void;
  onNavigateToTvShow: (show: TvShowData) => void;
  tvShows: TvShowData[];
  onNavigateToZodiacInfoPage: () => void;
  onNavigateToMaragonReport: (entityId: string | number, entityType: 'individual' | 'tvShow') => void;
}

const ZodiacDisplay: React.FC<{ sign: ZodiacSign, onNavigate: () => void }> = ({ sign, onNavigate }) => {
    const iconMap: Record<ZodiacSign, React.FC<{ className?: string }>> = {
        'Aries': AriesIcon, 'Taurus': TaurusIcon, 'Gemini': GeminiIcon,
        'Cancer': CancerIcon, 'Leo': LeoIcon, 'Virgo': VirgoIcon,
        'Libra': LibraIcon, 'Scorpio': ScorpioIcon, 'Sagittarius': SagittariusIcon,
        'Capricorn': CapricornIcon, 'Aquarius': AquariusIcon, 'Pisces': PiscesIcon
    };
    const IconComponent = iconMap[sign];
    return (
        <button 
            onClick={onNavigate}
            className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full hover:bg-slate-700 transition-colors group"
            aria-label={`Mëso më shumë rreth shenjës së ${sign}`}
        >
            <IconComponent className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="font-mono text-xs text-slate-400 group-hover:text-white uppercase">{sign}</span>
        </button>
    );
};

export const VipProfilePage: React.FC<VipProfilePageProps> = ({ profile, onBack, onNavigateToTvShow, tvShows, onNavigateToZodiacInfoPage, onNavigateToMaragonReport }) => {
  const pageTitle = `${profile.name} | Profili | NOVARIC® AI-Powered News`;
  useSeo(pageTitle, profile.shortBio, profile.imageUrl);

  // Determine if this is a Media Profile for special styling
  const isMediaProfile = (profile.category || '').toLowerCase().includes('media');

  const [vote, setVote] = useState<number | null>(() => {
    const saved = localStorage.getItem(`vote_${profile.id}`);
    return saved ? parseInt(saved, 10) : null;
  });

  const [choice, setChoice] = useState<string | null>(() => {
    return localStorage.getItem(`choice_${profile.id}`);
  });
  
  const [isToxicityModalOpen, setIsToxicityModalOpen] = useState(false);

  const handleVote = (rating: number) => {
    setVote(rating);
    localStorage.setItem(`vote_${profile.id}`, rating.toString());
  };

  const handleChoice = (newChoice: string) => {
    setChoice(newChoice);
    localStorage.setItem(`choice_${profile.id}`, newChoice);
  };

  const perceptionData = useMemo(() => {
    if (!profile.publicPerception) return [];
    return [
      { name: 'Pozitiv', value: profile.publicPerception.positive, color: '#22c55e' },
      { name: 'Neutral', value: profile.publicPerception.neutral, color: '#64748b' },
      { name: 'Negativ', value: profile.publicPerception.negative, color: '#ef4444' },
    ];
  }, [profile.publicPerception]);

  const tvShowForProfile = useMemo(() => {
    if (!profile.tvShowLogoUrl && !profile.name) return null;
    return tvShows.find(show => show.host === profile.name || show.logoUrl === profile.tvShowLogoUrl);
  }, [profile, tvShows]);

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': profile.name,
    'description': profile.shortBio,
    'image': profile.imageUrl,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': window.location.href,
    },
  };
  
  // Horizon Rigidity Visualization (Visual Slider)
  const horizonRigidity = profile.horizonRigidity ?? 0; 
  const aletheiaScore = profile.aletheiaScore ?? profile.averageMaragonScore ?? 0;
  const aletheiaColor = aletheiaScore > 80 ? 'text-green-400' : aletheiaScore > 50 ? 'text-yellow-400' : 'text-red-400';

  // --- Radar Chart Setup for Profile Page ---
  const radarLabels = profile.maragonAnalysis?.map(d => d.dimension.split(' ').slice(0,2).join(' ')) || [];
  const radarValues = profile.maragonAnalysis?.map(d => d.score) || [];
  
  const radarData = {
      labels: radarLabels,
      datasets: [
          {
              label: 'Target (Benchmark)',
              data: [90, 90, 90, 90, 90, 90, 90], // Ideal
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
              pointRadius: 0,
              borderDash: [5, 5]
          },
          {
              label: profile.name,
              data: radarValues,
              backgroundColor: 'rgba(14, 165, 233, 0.2)',
              borderColor: '#0ea5e9',
              borderWidth: 2,
              pointBackgroundColor: '#0ea5e9',
              pointBorderColor: '#fff',
          }
      ]
  };

  const radarOptions: any = {
      scales: {
          r: {
              angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
              grid: { color: 'rgba(255, 255, 255, 0.1)', circular: true },
              pointLabels: { color: '#94a3b8', font: { size: 10, family: 'Courier New' } },
              ticks: { display: false, backdropColor: 'transparent' },
              suggestedMin: 0,
              suggestedMax: 100,
          }
      },
      plugins: {
          legend: { display: true, labels: { color: '#cbd5e1', font: { family: 'Courier New', size: 10 } } },
      }
  };

  return (
    <main className={`flex-grow container mx-auto px-4 py-8 ${isMediaProfile ? 'font-sans' : ''}`}>
      <JsonLd data={jsonLdData} />
      
      {/* Dark Mode Analytics Container */}
      <div className="max-w-5xl mx-auto bg-slate-900/95 p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-md text-slate-200 relative overflow-hidden">
        
        {/* Back Button */}
        <div className="mb-6 relative z-20">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-bold">
            &larr; Return to Base
          </button>
        </div>

        {/* --- HERO HEADER (The Horizon) --- */}
        <header className="flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left mb-12 relative z-10 border-b border-slate-800 pb-8">
           
           {/* Archetype Watermark (Behind) */}
           {profile.archetype && (
                <div className="absolute top-0 right-0 w-full h-full flex items-center justify-center lg:justify-end pointer-events-none opacity-[0.03] select-none overflow-hidden">
                    <span className="text-[6rem] lg:text-[10rem] font-black uppercase text-white whitespace-nowrap">
                        {profile.archetype}
                    </span>
                </div>
           )}

           {/* Profile Image */}
           <div className="relative flex-shrink-0">
                <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-cyan-500 to-blue-600">
                    <img
                        src={getProfilePhotoUrl(profile)}
                        onError={(e) => {
                            const gender = profile?.gender?.toLowerCase();
                            e.currentTarget.src =
                                gender === "female" || gender === "f"
                                    ? "https://novaric.co/wp-content/uploads/2025/11/FemaleProfile.jpg"
                                    : "https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg";
                        }}
                        alt={`Portreti i ${profile.name}`}
                        style={{ objectFit: "cover", objectPosition: "center" }}
                        className="w-full h-full rounded-full object-cover border-4 border-slate-900"
                    />
                </div>
                {/* Live Indicator */}
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>

          <div className="flex-grow relative z-10">
            <h2 className="text-sm font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1">Media Subject Analysis</h2>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">{formatVipName(profile.name)}</h1>
            <h3 className="text-lg text-slate-400 font-light">{profile.category}</h3>
            
            <div className="mt-4 flex flex-wrap gap-3 justify-center lg:justify-start">
                 {profile.zodiacSign && <ZodiacDisplay sign={profile.zodiacSign} onNavigate={onNavigateToZodiacInfoPage} />}
                 {profile.tvShowLogoUrl && (
                     <div className="mt-2 px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full flex items-center gap-2">
                         <span className="text-[10px] text-slate-400 uppercase font-bold">Affiliation:</span>
                         <img src={profile.tvShowLogoUrl} alt="Logo" className="h-4 w-auto opacity-80" />
                     </div>
                 )}
            </div>
          </div>

          {/* Truthometer / Aletheia Score */}
          <div className="flex flex-col items-center justify-center z-10 min-w-[150px] p-4 bg-slate-800/50 rounded-xl border border-slate-700">
               <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                            className={`${aletheiaColor} transition-all duration-1000 ease-out`}
                            strokeDasharray="283" 
                            strokeDashoffset={283 - (283 * aletheiaScore) / 100} 
                        />
                    </svg>
                    <span className="absolute text-4xl font-black text-white">{aletheiaScore}</span>
               </div>
               <span className="text-[10px] font-bold uppercase text-slate-400 mt-3 tracking-widest">ALETHEIA SCORE</span>
          </div>
        </header>
        
        {/* Horizon Rigidity Slider (Visual Only) */}
        {isMediaProfile && (
            <div className="mb-12 px-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-2 font-mono tracking-wider">
                    <span>DOGMATIC PARADIGM</span>
                    <span>DIALECTIC OPENNESS</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full relative overflow-hidden border border-slate-700">
                    {/* Gradient Track */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/50 via-slate-800 to-blue-900/50"></div>
                    {/* Ticks */}
                    <div className="absolute inset-0 flex justify-between px-1">
                        {[...Array(20)].map((_, i) => <div key={i} className="w-px h-full bg-slate-900/50"></div>)}
                    </div>
                    {/* Indicator */}
                    <div 
                        className="absolute top-0 h-full w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                        style={{ left: `${horizonRigidity}%` }}
                    >
                        <div className="absolute -top-1 -left-1.5 w-4 h-5 bg-white clip-triangle"></div>
                    </div>
                </div>
                <div className="text-center mt-1 text-[10px] text-cyan-500 font-mono">HORIZON RIGIDITY INDEX: {horizonRigidity}/100</div>
            </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* LEFT COL: Bio & Radar */}
            <div className="space-y-8">
                <section className="bg-slate-800/30 p-6 rounded-lg border border-slate-700/50">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider border-b border-slate-700 pb-2">BIOGRAPHICAL DATA</h3>
                    <div className="prose dark:prose-invert max-w-none text-sm text-slate-300 leading-relaxed">
                        {profile.detailedBio.split('\n').map((p, i) => <p key={i} className="mb-2">{p}</p>)}
                    </div>
                </section>

                {isMediaProfile && (
                    <section className="bg-slate-800/30 p-6 rounded-lg border border-slate-700/50">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider border-b border-slate-700 pb-2">MARAGON-Ω KINETIC RADAR</h3>
                        <div className="h-72 w-full">
                             <Radar data={radarData} options={radarOptions} />
                        </div>
                    </section>
                )}
            </div>

            {/* RIGHT COL: Spectrogram & Void Map */}
            <div className="space-y-8">
                 {profile.psychometrics && (
                    <section>
                        <PsycholinguisticSpectrogram psychometrics={profile.psychometrics} lang="sq" />
                    </section>
                )}

                <LetheVoidMap ignoredTopics={profile.ignoredTopics} lang="sq" />

                {/* Perception Pie */}
                {perceptionData.length > 0 && (
                  <section className="bg-slate-800/30 p-6 rounded-lg border border-slate-700/50">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider border-b border-slate-700 pb-2">PUBLIC SENTIMENT ANALYSIS</h3>
                    <div className="flex justify-center">
                      <PieChart data={perceptionData} size={180} />
                    </div>
                  </section>
                )}
            </div>
        </div>
        
        {/* TERMINOLOGY SECTION (New) */}
        {isMediaProfile && (
            <section className="mt-8 pt-8 border-t border-slate-800 mb-8">
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider">TERMINOLOGJIA E SISTEMIT / SYSTEM TERMINOLOGY</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    
                    {/* 1. TOKSICITETI SOCIAL (Active) */}
                    <button 
                        onClick={() => setIsToxicityModalOpen(true)}
                        className="p-4 bg-slate-800/40 border border-red-900/30 hover:bg-red-900/10 hover:border-red-500/50 rounded-lg text-left transition-all group"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono text-red-400 group-hover:text-red-300">METRIKA ETITKE</span>
                            <InformationCircleIcon className="w-3 h-3 text-red-500 group-hover:text-red-300" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-white">TOKSICITETI SOCIAL</h4>
                        <p className="text-[10px] text-slate-500 mt-1 group-hover:text-slate-400">Ndikimi negativ në sferën publike dhe polarizimi.</p>
                    </button>

                    {/* 2. ALETHEIA SCORE */}
                    <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg text-left">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono text-cyan-500">BESUESHMËRIA</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-300">ALETHEIA SCORE</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Indeksi sintetik i vërtetësisë dhe saktësisë.</p>
                    </div>

                    {/* 3. LETHE VOID */}
                    <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg text-left">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono text-purple-500">PAQARTËSIA</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-300">LETHE VOID</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Harta e temave të injoruara sistematikisht.</p>
                    </div>

                     {/* 4. HORIZON RIGIDITY */}
                     <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg text-left">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono text-yellow-500">MENDËSIA</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-300">HORIZON RIGIDITY</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Matja e fleksibilitetit njohës dhe dogmatizmit.</p>
                    </div>

                </div>
            </section>
        )}

        {/* Footer Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800 pt-8">
             <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
                 <LikertScaleVote vipId={profile.id} currentVote={vote} onVote={handleVote} />
             </div>
             <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
                 <SimplePoll vipId={profile.id} currentChoice={choice} onMakeChoice={handleChoice} />
             </div>
        </div>

        {/* Maragon Summary Link */}
        {profile.maragonSummary && onNavigateToMaragonReport && (
          <div className="mt-8 text-center">
            <button
                onClick={() => onNavigateToMaragonReport(profile.id, isMediaProfile ? 'individual' : 'tvShow')} // Assuming individual for now
                className="inline-flex items-center px-6 py-3 bg-cyan-900/30 hover:bg-cyan-950/50 text-cyan-400 font-bold font-mono text-xs uppercase rounded border border-cyan-800 transition-colors tracking-widest"
            >
                <ChartBarIcon className="w-4 h-4 mr-2" />
                ACCESS FULL MARAGON REPORT
            </button>
          </div>
        )}

      </div>
      
      <SocialToxicityModal isOpen={isToxicityModalOpen} onClose={() => setIsToxicityModalOpen(false)} />
    </main>
  );
};