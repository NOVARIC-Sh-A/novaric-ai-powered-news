import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { 
  VipProfile, 
  TranslatedParagonEntry, 
  MaragonDimension, 
  ParagonDimension as ParagonDimensionType 
} from '../types';
// Ensure these icons are exported from your icons file, or import from heroicons/lucide
import { 
  ArrowPathIcon, 
  PresentationChartLineIcon, 
  ArrowRightLeftIcon, 
  EyeSlashIcon, 
  ChartBarIcon 
} from './icons'; 
import { MARAGON_DIMENSIONS_AL } from '../utils/translations';
import { Radar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { SocialToxicityModal } from './SocialToxicityModal';
import { formatVipName, getProfilePhotoUrl } from '../utils/paragonProfileUtils';

// Register ChartJS components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// --- EXTENDED INTERFACE ---
// Includes the new Genome / Evolution data structures
interface ExtendedProfile extends VipProfile {
  genome?: {
    evolutionaryStatus: "Ascending" | "Stagnant" | "Regressing" | "Compromised";
    careerStartStats: number[]; // [Readiness, Aptitude, Governance, Oversight, CSR]
    currentStats: number[];     // Same order
    topRhetoricShift: string;   // e.g., "From Investigative to Populist"
    letheEvent: string;         // e.g., "Silent on PPP since 2022"
    dominanceMetric: number;    // 0-100 (Airtime Control)
  };
}

interface MediaPersonalityCardProps {
  profile: ExtendedProfile;
  onNavigate: (profile: VipProfile) => void;
  onCompareToggle: (id: string | number) => void;
  onNavigateToAnalysis?: (id: string | number) => void;
  isSelectedForCompare: boolean;
  isCompareDisabled: boolean;
  lang?: 'sq' | 'en';
}

const translations = {
    sq: {
        compare: 'KRAHASO',
        analysis: 'ANALIZA',
        deepScan: 'SKANIM I THELLË',
        ideal: 'Gazetari Ideal',
        actual: 'Pikët Aktuale',
        age: 'MOSHA',
        zodiac: 'SHENJA',
        socialToxicity: 'TOKSICITETI SOCIAL',
        fullDossier: 'DOSJA E PLOTË',
        structuralEvolution: 'EVOLUCIONI STRUKTUROR',
        dominance: 'DOMINANCA NË ETER',
        rhetoricShift: 'NDRYSHIMI RETORIK',
        letheEvent: 'HAPËSIRA LETHE',
    },
    en: {
        compare: 'COMPARE',
        analysis: 'ANALYSIS',
        deepScan: 'DEEP SCAN',
        ideal: 'Ideal Journalist',
        actual: 'Actual Score',
        age: 'AGE',
        zodiac: 'ZODIAC',
        socialToxicity: 'SOCIAL TOXICITY',
        fullDossier: 'FULL DOSSIER',
        structuralEvolution: 'STRUCTURAL EVOLUTION',
        dominance: 'AIRTIME DOMINANCE',
        rhetoricShift: 'RHETORIC SHIFT',
        letheEvent: 'LETHE EVENT',
    }
};

const calculateAge = (dobString?: string, age?: number): string => {
    if (age) return age.toString();
    if (!dobString) return "N/A";
    try {
        const dob = new Date(dobString);
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms);
        return Math.abs(age_dt.getUTCFullYear() - 1970).toString();
    } catch {
        return "N/A";
    }
};

export const MediaPersonalityCard: React.FC<MediaPersonalityCardProps> = ({ 
  profile, 
  onNavigate, 
  onCompareToggle, 
  onNavigateToAnalysis, 
  isSelectedForCompare, 
  isCompareDisabled, 
  lang = 'sq' 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isToxicityModalOpen, setIsToxicityModalOpen] = useState(false);
  const t = translations[lang];

  // --- MOCK DATA FALLBACK (If API hasn't populated genome yet) ---
  const genome = profile.genome || {
      evolutionaryStatus: "Compromised",
      careerStartStats: [90, 85, 95, 80, 85], // Strong start
      currentStats: [80, 70, 40, 50, 45],     // Degraded over time
      topRhetoricShift: "Nga Investigues në Opinionist",
      letheEvent: "Heshtje mbi Inceneratorët (2022)",
      dominanceMetric: 88
  };

  // Evolution Badge Styling
  const evolutionColor = 
      genome.evolutionaryStatus === "Ascending" ? "text-green-400 bg-green-950/50 border-green-800" :
      genome.evolutionaryStatus === "Compromised" ? "text-red-400 bg-red-950/50 border-red-800" :
      "text-yellow-400 bg-yellow-950/50 border-yellow-800";

  // Data Processing
  const translatedAnalysis: TranslatedParagonEntry[] = useMemo(() => {
    if (!profile.maragonAnalysis) return [];
    return profile.maragonAnalysis.map(dim => ({
        ...dim,
        dimension: MARAGON_DIMENSIONS_AL[dim.dimension as MaragonDimension] || dim.dimension,
        originalDimension: dim.dimension as unknown as ParagonDimensionType,
    }));
  }, [profile.maragonAnalysis]);
  
  const handleNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate(profile);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      onCompareToggle(profile.id);
  }

  // Scoring Visuals
  const aletheiaScore = Math.round(profile.latestScore ?? profile.aletheiaScore ?? profile.averageMaragonScore ?? 0); 
  const pulseColorClass = aletheiaScore >= 80 ? 'shadow-[0_0_30px_5px_rgba(34,197,94,0.6)] border-green-500' : aletheiaScore >= 50 ? 'shadow-[0_0_30px_5px_rgba(250,204,21,0.6)] border-yellow-500' : 'shadow-[0_0_30px_5px_rgba(239,68,68,0.6)] border-red-500';
  const scoreTextColor = aletheiaScore >= 80 ? 'text-green-400' : aletheiaScore >= 50 ? 'text-yellow-400' : 'text-red-400';
  
  const displayName = formatVipName(profile.name);
  const ageDisplay = calculateAge(profile.dateOfBirth, profile.age);
  const zodiacDisplay = profile.zodiacSign || "N/A";

  // Toxicity Visuals
  let riskLevel = profile.csrRiskLevel || 'Moderate';
  if (!profile.csrRiskLevel) {
      const ethicsScore = translatedAnalysis.find(d => d.originalDimension.includes('Etik'))?.score ?? 0;
      if (ethicsScore < 50) riskLevel = 'Critical';
      else if (ethicsScore > 80) riskLevel = 'Low';
  }
  const csrRiskPercentage = riskLevel === 'Critical' ? 90 : riskLevel === 'Moderate' ? 50 : 15;
  const riskColor = riskLevel === 'Critical' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : riskLevel === 'Moderate' ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-green-500 shadow-[0_0_10px_#22c55e]';

  // --- CHART CONFIG: GHOST RADAR (History vs Current) ---
  const ghostRadarData = {
      labels: ["R", "A", "G", "O", "C"], // Shortened labels for compact view
      datasets: [
          {
              label: "History", // Ghost Trace
              data: genome.careerStartStats,
              backgroundColor: 'transparent',
              borderColor: '#475569', // Slate-600
              borderWidth: 1,
              borderDash: [4, 4], // Dashed line
              pointRadius: 0,
          },
          {
              label: "Current", // Live Trace
              data: genome.currentStats,
              backgroundColor: 'rgba(6, 182, 212, 0.2)', // Cyan fill
              borderColor: '#22d3ee', // Cyan border
              borderWidth: 2,
              pointRadius: 2,
              pointBackgroundColor: '#22d3ee',
          }
      ]
  };

  const ghostRadarOptions: any = {
      scales: {
          r: {
              angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              pointLabels: { color: '#64748b', font: { size: 8, family: 'Courier New' } },
              ticks: { display: false, backdropColor: 'transparent' }, // Fixed transparent backdrop
              suggestedMin: 0,
              suggestedMax: 100,
          }
      },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      maintainAspectRatio: false,
  };

  return (
    <>
    <div className={`card-container h-[550px] group perspective-1000 relative ${isFlipped ? 'z-50' : 'z-auto'}`} onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`card relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'is-flipped' : ''}`}>
        
        {/* ================= FRONT FACE ================= */}
        <div className="card-face card-front absolute inset-0 bg-slate-950 border border-slate-700 rounded-xl overflow-hidden shadow-2xl backface-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 animate-fog opacity-60 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>
            
            <div className="relative h-full w-full z-10">
                <div className="absolute bottom-[140px] right-4 z-10">
                     <div className={`relative w-48 h-48 rounded-full p-1 ${pulseColorClass} border-2 transition-all duration-500`}>
                         <img 
                            src={getProfilePhotoUrl(profile)}
                            onError={(e) => {
                                const gender = profile?.gender?.toLowerCase();
                                e.currentTarget.src =
                                    gender === "female" || gender === "f"
                                        ? "https://novaric.co/wp-content/uploads/2025/11/FemaleProfile.jpg"
                                        : "https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg";
                            }}
                            alt={profile.name}
                            style={{ objectFit: "cover", objectPosition: "center" }}
                            className="w-full h-full rounded-full object-cover"
                        />
                        <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-600 flex flex-col items-center justify-center z-30 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                             <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">SCORE</span>
                             <span className={`font-mono font-black text-2xl ${scoreTextColor}`}>{aletheiaScore}</span>
                        </div>
                    </div>
                </div>

                {profile.tvShowLogoUrl && (
                    <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md p-1.5 rounded border border-white/10 shadow-lg">
                        <img src={profile.tvShowLogoUrl} alt="TV Logo" className="h-8 w-auto object-contain opacity-90 filter brightness-110"/>
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 w-full h-[140px] bg-slate-900/95 border-t border-slate-700 backdrop-blur-xl z-10 flex flex-col justify-between p-4">
                <div className="pr-2">
                    <h3 className="text-2xl font-black text-white font-sans tracking-tight mb-1 truncate drop-shadow-md">
                        {displayName}
                    </h3>
                    <div className="flex gap-3 text-[10px] font-mono text-slate-400 mb-2">
                         <span className="bg-slate-800/80 px-2 py-1 rounded border border-slate-600/50">
                             {t.age}: <span className="text-white">{ageDisplay}</span>
                         </span>
                         <span className="bg-slate-800/80 px-2 py-1 rounded border border-slate-600/50">
                             {t.zodiac}: <span className="text-white uppercase">{zodiacDisplay}</span>
                         </span>
                    </div>
                    <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1">
                         // {profile.category?.toUpperCase() || "MEDIA"}_OPERATIVE
                    </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                     <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <input 
                            type="checkbox" 
                            id={`compare-media-${profile.id}`} 
                            checked={isSelectedForCompare} 
                            onChange={handleCheckboxChange} 
                            disabled={isCompareDisabled} 
                            className="appearance-none w-3 h-3 border border-slate-500 rounded-sm bg-transparent checked:bg-cyan-500 checked:border-cyan-500 focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor={`compare-media-${profile.id}`} className="text-[9px] font-bold text-slate-500 uppercase cursor-pointer hover:text-cyan-400 transition-colors tracking-wide">
                            {t.compare}
                        </label>
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            if(onNavigateToAnalysis) onNavigateToAnalysis(profile.id);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-cyan-950/50 hover:bg-cyan-500 hover:text-black border border-cyan-500/30 rounded-sm text-[10px] font-bold text-cyan-400 uppercase tracking-widest transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                    >
                         <PresentationChartLineIcon className="w-3 h-3" />
                         <span>{t.analysis}</span>
                    </button>
                </div>
            </div>
        </div>

        {/* ================= BACK FACE (The Neuro-Linguistic Genome) ================= */}
        <div className="card-face card-back absolute inset-0 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-4 flex flex-col overflow-hidden transform rotate-y-180 backface-hidden">
            
            {/* Blueprint Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.1] z-0"></div>

            {/* 1. Header (ID & Status) */}
            <div className="flex justify-between items-center z-10 border-b border-slate-800 pb-2 mb-1 flex-shrink-0">
                <span className="text-[9px] font-mono text-slate-500">ID: {profile.id.toString().substring(0,6)}</span>
                <span className={`px-2 py-0.5 rounded border text-[9px] font-mono uppercase tracking-widest ${evolutionColor}`}>
                    {genome.evolutionaryStatus}
                </span>
            </div>

            <div className="flex-1 flex flex-col min-h-0 relative z-10">
                {/* 2. Ghost Radar Chart (Center Visual) */}
                <div className="flex-grow relative w-full flex flex-col items-center justify-center">
                    <div className="w-full h-32 md:h-40 relative">
                        <Radar data={ghostRadarData} options={ghostRadarOptions} />
                    </div>
                    <div className="text-[8px] text-slate-500 font-mono tracking-widest uppercase mt-1">
                        {t.structuralEvolution}
                    </div>
                </div>

                {/* 3. The Genome Strip (Right Edge Decoration) */}
                <div className="absolute right-0 top-8 bottom-8 w-1 bg-gradient-to-b from-slate-900 via-cyan-900 to-cyan-500 opacity-80 rounded-l-full"></div>

                {/* 4. Clinical Notes (Mid-Section) */}
                <div className="mt-2 space-y-2">
                    {/* Shift */}
                    <div className="bg-slate-900/50 p-2 rounded border border-slate-800/50">
                        <div className="flex items-center gap-2 mb-1">
                            <ArrowRightLeftIcon className="w-3 h-3 text-slate-500" />
                            <span className="text-[8px] font-bold text-slate-500 uppercase">{t.rhetoricShift}</span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-mono leading-tight truncate">
                            {genome.topRhetoricShift}
                        </p>
                    </div>

                    {/* Lethe Event */}
                    <div className="bg-slate-900/50 p-2 rounded border border-slate-800/50">
                        <div className="flex items-center gap-2 mb-1">
                            <EyeSlashIcon className="w-3 h-3 text-orange-500" />
                            <span className="text-[8px] font-bold text-orange-500/80 uppercase">{t.letheEvent}</span>
                        </div>
                        <p className="text-[10px] text-orange-400 font-bold font-mono leading-tight truncate">
                            {genome.letheEvent}
                        </p>
                    </div>
                </div>
            </div>

            {/* 5. Footer (Dominance & Action) */}
            <div className="mt-2 pt-2 border-t border-slate-800 z-10 flex flex-col gap-2 flex-shrink-0">
                {/* Dominance Gauge */}
                <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded border border-slate-800">
                    <div className="flex items-center gap-1">
                        <ChartBarIcon className="w-3 h-3 text-cyan-500" />
                        <span className="text-[9px] text-slate-400 font-mono uppercase">{t.dominance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-cyan-500 transition-all duration-1000" 
                                style={{ width: `${genome.dominanceMetric}%` }}
                            ></div>
                        </div>
                        <span className="text-[9px] text-cyan-400 font-bold font-mono">{genome.dominanceMetric}%</span>
                    </div>
                </div>

                {/* Full Dossier Action */}
                <button 
                    onClick={handleNavigation} 
                    className="w-full py-2 bg-slate-900 border border-cyan-900/50 text-cyan-400 font-mono font-bold text-[10px] uppercase hover:bg-cyan-950/50 hover:text-cyan-300 transition-all duration-200 tracking-[0.15em] flex items-center justify-center gap-2"
                >
                    <ArrowPathIcon className="w-3 h-3" />
                    {t.fullDossier}
                </button>
            </div>
        </div>

      </div>
    </div>
    
    {isToxicityModalOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <SocialToxicityModal isOpen={isToxicityModalOpen} onClose={() => setIsToxicityModalOpen(false)} />,
        document.body
    )}
    </>
  );
};