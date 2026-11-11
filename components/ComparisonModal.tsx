
import React from 'react';
import { VipProfile } from '../types';
import { XMarkIcon, BeakerIcon, ScaleIcon, MegaphoneIcon, ShieldCheckIcon } from './icons';
import { formatVipName, getProfilePhotoUrl } from '../utils/paragonProfileUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { isMaragonAssessmentPublished, measuredNumber, notAssessedLabel } from '../utils/maragonPublication';

interface ComparisonModalProps {
  profile1: VipProfile;
  profile2: VipProfile;
  onClose: () => void;
}

const ArchetypeBadge: React.FC<{ archetype: VipProfile['archetype'] }> = ({ archetype }) => {
    if (!archetype) return null;
    const styles: { [key in NonNullable<VipProfile['archetype']>]: { icon: React.ReactNode; bgColor: string; textColor: string; } } = {
        'Analisti': { icon: <BeakerIcon className="w-4 h-4"/>, bgColor: 'bg-indigo-100 dark:bg-indigo-900/50', textColor: 'text-indigo-800 dark:text-indigo-300' },
        'Moderatori': { icon: <ScaleIcon className="w-4 h-4"/>, bgColor: 'bg-green-100 dark:bg-green-900/50', textColor: 'text-green-800 dark:text-green-300' },
        'Komunikatori': { icon: <MegaphoneIcon className="w-4 h-4"/>, bgColor: 'bg-sky-100 dark:bg-sky-900/50', textColor: 'text-sky-800 dark:text-sky-300' },
        'Roja Publik': { icon: <ShieldCheckIcon className="w-4 h-4"/>, bgColor: 'bg-amber-100 dark:bg-amber-900/50', textColor: 'text-amber-800 dark:text-amber-300' },
        'I Paidentifikuar': { icon: <></>, bgColor: 'bg-slate-200 dark:bg-slate-700', textColor: 'text-slate-600 dark:text-slate-300' }
    };
    const style = styles[archetype] || styles['I Paidentifikuar'];
    return (
        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bgColor} ${style.textColor}`}>
            {style.icon}
            {archetype}
        </div>
    );
};

const ComparisonBar: React.FC<{ label: string; value1: number | null; value2: number | null }> = ({ label, value1, value2 }) => {
    if (value1 === null || value2 === null) return null;
    const isValue1Greater = value1 > value2;
    const isValue2Greater = value2 > value1;
    return (
        <div className="w-full">
            <p className="text-center text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</p>
            <div className="flex items-center gap-2">
                <span className={`w-10 text-right font-bold ${isValue1Greater ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'}`}>{value1}</span>
                <div className="flex-grow h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex">
                    <div className="bg-primary-500 rounded-l-full h-full" style={{ width: `${value1}%` }}></div>
                    <div className="bg-sky-500 rounded-r-full h-full" style={{ width: `${value2}%`, marginLeft: 'auto' }}></div>
                </div>
                 <span className={`w-10 text-left font-bold ${isValue2Greater ? 'text-sky-500' : 'text-slate-600 dark:text-slate-300'}`}>{value2}</span>
            </div>
        </div>
    );
};

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ profile1, profile2, onClose }) => {
  const { language } = useLanguage();
  const unassessed = notAssessedLabel(language === 'en' ? 'en' : 'sq');
  const leftPublished = isMaragonAssessmentPublished(profile1);
  const rightPublished = isMaragonAssessmentPublished(profile2);
  const scoreLabel = (profile: VipProfile, published: boolean) => {
    if (!published) return unassessed;
    const score = measuredNumber(profile.averageMaragonScore);
    return score === null ? unassessed : String(score);
  };
  const comparedDimensions = leftPublished && rightPublished
    ? (profile1.maragonAnalysis ?? []).flatMap((dim1, index) => {
        const dim2 = profile2.maragonAnalysis?.[index];
        if (!dim2 || dim1.dimension !== dim2.dimension) return [];
        const value1 = measuredNumber(dim1.score);
        const value2 = measuredNumber(dim2.score);
        if (value1 === null || value2 === null) return [];
        return [{ dimension: dim1.dimension, value1, value2 }];
      })
    : [];
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
    >
      <div
        className="relative bg-white dark:bg-slate-800 w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
            <h2 id="comparison-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">Krahasim Kokë më Kokë</h2>
            <button
                onClick={onClose}
                className="p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full text-slate-600 dark:text-slate-300"
                aria-label="Mbyll"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>
        </header>

        <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-6 text-center border-b border-slate-200 dark:border-slate-700 pb-6">
                {/* Profile 1 */}
                <div>
                    <img
                        src={getProfilePhotoUrl(profile1)}
                        onError={(e) => {
                            const gender = profile1?.gender?.toLowerCase();
                            e.currentTarget.src =
                                gender === "female" || gender === "f"
                                    ? "https://novaric.co/wp-content/uploads/2025/11/FemaleProfile.jpg"
                                    : "https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg";
                        }}
                        alt={formatVipName(profile1.name)}
                        style={{ objectFit: "cover" }}
                        className="w-24 h-24 rounded-full mx-auto border-4 border-primary-500 shadow-lg"
                    />
                    <h3 className="mt-3 text-lg font-bold text-primary-600 dark:text-primary-400">{formatVipName(profile1.name)}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{scoreLabel(profile1, leftPublished)}</p>
                    <div className="mt-2">{leftPublished && profile1.archetype && <ArchetypeBadge archetype={profile1.archetype} />}</div>
                </div>
                {/* Profile 2 */}
                <div>
                    <img
                        src={getProfilePhotoUrl(profile2)}
                        onError={(e) => {
                            const gender = profile2?.gender?.toLowerCase();
                            e.currentTarget.src =
                                gender === "female" || gender === "f"
                                    ? "https://novaric.co/wp-content/uploads/2025/11/FemaleProfile.jpg"
                                    : "https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg";
                        }}
                        alt={formatVipName(profile2.name)}
                        style={{ objectFit: "cover" }}
                        className="w-24 h-24 rounded-full mx-auto border-4 border-sky-500 shadow-lg"
                    />
                    <h3 className="mt-3 text-lg font-bold text-sky-600 dark:text-sky-400">{formatVipName(profile2.name)}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{scoreLabel(profile2, rightPublished)}</p>
                     <div className="mt-2">{rightPublished && profile2.archetype && <ArchetypeBadge archetype={profile2.archetype} />}</div>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                {comparedDimensions.length > 0 ? comparedDimensions.map((dim) => (
                        <ComparisonBar
                            key={dim.dimension}
                            label={dim.dimension}
                            value1={dim.value1}
                            value2={dim.value2}
                        />
                )) : (
                    <p className="text-center font-semibold text-slate-600 dark:text-slate-300">{unassessed}</p>
                )}
            </div>
        </div>

         <footer className="p-4 border-t border-slate-200 dark:border-slate-700 text-center flex-shrink-0">
             <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-md shadow-md"
            >
                Mbyll
            </button>
        </footer>
      </div>
    </div>
  );
};
