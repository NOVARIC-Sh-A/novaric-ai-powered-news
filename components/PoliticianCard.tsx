// components/PoliticianCard.tsx
import React, { useState, useMemo } from 'react';
import {
  ProcessedVipProfile,
  TranslatedParagonEntry,
  ParagonDimension,
  MaragonDimension
} from './../types';
// Added InformationCircleIcon to the imports to fix the reference error in DimensionIcon.
import {
  ArrowPathIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  UsersIcon,
  MegaphoneIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon,
  LightBulbIcon,
  InformationCircleIcon
} from './icons';
import { MiniRadarChart } from './MiniRadarChart';
import { formatVipName, getProfilePhotoUrl } from '../utils/paragonProfileUtils';

interface PoliticianCardProps {
  profile: ProcessedVipProfile;
  onNavigate: (profile: ProcessedVipProfile) => void;
  onCompareToggle: (id: string | number) => void;
  isSelectedForCompare: boolean;
  isCompareDisabled: boolean;
  paragonScore?: number;
}

const DimensionIcon: React.FC<{ dimension: string; className?: string }> = ({ dimension, className = "w-4 h-4" }) => {
  const iconMap: Record<string, React.FC<{ className?: string }>> = {
    "Angazhimi Politik": BookOpenIcon,
    "Llogaridhënia": ShieldCheckIcon,
    "Përfaqësimi": UsersIcon,
    "Asertiviteti": MegaphoneIcon,
    "Qeverisja": BuildingLibraryIcon,
    "Kohësioni": UserGroupIcon,
    "Narrativa": ChatBubbleBottomCenterTextIcon,
    "D1": BookOpenIcon,
    "D2": ShieldCheckIcon,
    "D3": UsersIcon,
    "D4": MegaphoneIcon,
    "D5": BuildingLibraryIcon,
    "D6": UserGroupIcon,
    "D7": ChatBubbleBottomCenterTextIcon,
  };
  // Use InformationCircleIcon as fallback icon for unknown dimensions.
  const IconComponent = iconMap[dimension] || InformationCircleIcon;
  return <IconComponent className={className} />;
};

export const PoliticianCard = React.memo<PoliticianCardProps>(
  ({
    profile,
    onNavigate,
    onCompareToggle,
    isSelectedForCompare,
    isCompareDisabled,
    paragonScore
  }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const partyLabel = useMemo(() => {
      const match = (profile.category || "").match(/\((.*?)\)/);
      return match ? match[1] : "IND";
    }, [profile.category]);

    const partyColor = partyLabel === 'PS' ? "bg-red-600" : partyLabel === 'PD' ? "bg-blue-600" : "bg-slate-600";

    const {
      overallScore,
      translatedAnalysis = [],
      topDimensions = [],
      bottomDimensions = [],
    } = profile.processedAnalysis || {};

    const effectiveScore = paragonScore ?? overallScore ?? profile.dynamicScore ?? 0;

    return (
      <div className={`card-container h-full relative ${isFlipped ? 'z-50' : 'z-auto'}`}>
        <div className="card-flipper-button w-full h-full text-left" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={`card ${isFlipped ? "is-flipped" : ""}`}>
            {/* ------------ FRONT ------------ */}
            <div className="card-face card-front absolute inset-0 bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 p-4 flex flex-col overflow-hidden backface-hidden">
              <div className="absolute left-2 top-4 bottom-12 flex flex-row items-end gap-1 z-20 pointer-events-none">
                  <div className="relative w-1.5 h-full bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-300 dark:border-slate-600 overflow-hidden shadow-inner">
                       <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-orange-400 to-green-500 opacity-80"></div>
                       <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_2px,#000_1px)] bg-[length:100%_4px] opacity-20"></div>
                       <div className="absolute w-full h-0.5 bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.9)] left-0 transition-all duration-1000 ease-out z-10" style={{ bottom: `${effectiveScore}%` }}></div>
                  </div>
                  <div className="h-full flex flex-col justify-center pl-1">
                       <span className="-rotate-90 whitespace-nowrap text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-90 origin-center">PARAGON</span>
                  </div>
              </div>

              <div className="flex-grow flex flex-col items-center text-center pl-8">
                <div className="relative mb-3">
                  <img src={getProfilePhotoUrl(profile)} alt={profile.name} className="w-28 h-28 rounded-full object-cover border-4 border-slate-200 dark:border-slate-600 shadow-md" />
                  <div className={`absolute -bottom-1 right-0 text-white rounded-full h-10 w-10 flex items-center justify-center ${partyColor} text-[10px] font-black shadow-lg border-2 border-white dark:border-slate-800`}>{partyLabel}</div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{formatVipName(profile.name)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 h-10 line-clamp-2 leading-tight mt-1 px-4">{profile.shortBio}</p>

                {/* Metadata Badges */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1">
                  {(profile as any).dateOfBirth && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60"
                      title="Datëlindja e verifikuar nga regjistrat zyrtarë të Kuvendit"
                    >
                      <svg className="w-2.5 h-2.5 text-sky-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Datëlindja e verifikuar
                    </span>
                  )}

                  {((profile as any).photoPending || (profile as any).photoStatus === 'Foto në pritje' || (profile.imageUrl && profile.imageUrl.includes('placeholder-pending'))) && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60"
                      title="Fotografia zyrtare në pritje nga Kuvendi i Shqipërisë"
                    >
                      <svg className="w-2.5 h-2.5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Foto në pritje
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 w-full flex-grow flex flex-col justify-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">SCORE INDEX</span>
                  <div className="text-6xl font-black text-primary-600 dark:text-primary-500 tracking-tighter drop-shadow-sm">{effectiveScore}</div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-2 pl-8 border-t border-slate-50 dark:border-slate-700 pt-3">
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" id={`cmp-${profile.id}`} checked={isSelectedForCompare} onChange={() => onCompareToggle(profile.id)} disabled={isCompareDisabled && !isSelectedForCompare} className="w-4 h-4 rounded text-primary-600 cursor-pointer" />
                  <label htmlFor={`cmp-${profile.id}`} className="text-[10px] font-black uppercase text-slate-500 cursor-pointer tracking-wider">KRAHASO</label>
                </div>
                <div className="text-[9px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-1.5"><ArrowPathIcon className="w-3 h-3" /> ANALIZA</div>
              </div>
            </div>

            {/* ------------ BACK ------------ */}
            <div className="card-face card-back absolute inset-0 bg-slate-900 shadow-lg border border-slate-700 p-4 flex flex-col backface-hidden">
               <div className="flex-grow flex flex-col">
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] text-center mb-4 border-b border-slate-800 pb-2">KLINIKA ANALITIKE</h4>
                  <div className="flex-grow flex items-center justify-center -my-6">
                    <MiniRadarChart analysisData={translatedAnalysis} size={220} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                     <div className="space-y-1">
                        <span className="text-[9px] font-bold text-emerald-500 uppercase">STRATEGIC_PROS</span>
                        <div className="h-0.5 bg-emerald-500/20 w-full rounded-full"></div>
                        <ul className="text-[9px] text-slate-400 space-y-1 mt-2">
                           {topDimensions.slice(0, 2).map(d => <li key={d.dimension} className="truncate">• {d.dimension}</li>)}
                        </ul>
                     </div>
                     <div className="space-y-1 text-right">
                        <span className="text-[9px] font-bold text-rose-500 uppercase">RISK_AREAS</span>
                        <div className="h-0.5 bg-rose-500/20 w-full rounded-full"></div>
                        <ul className="text-[9px] text-slate-400 space-y-1 mt-2">
                           {bottomDimensions.slice(0, 2).map(d => <li key={d.dimension} className="truncate">{d.dimension} •</li>)}
                        </ul>
                     </div>
                  </div>
               </div>
               <button onClick={(e) => { e.stopPropagation(); onNavigate(profile); }} className="w-full mt-4 py-2.5 bg-primary-600 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-primary-700 transition-all">DOSJA E PLOTË &rarr;</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
