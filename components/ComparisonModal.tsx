
import React from 'react';
import { VipProfile } from '../types';
import { XMarkIcon, BeakerIcon, ScaleIcon, MegaphoneIcon, ShieldCheckIcon } from './icons';
import { formatVipName, getProfilePhotoUrl } from '../utils/paragonProfileUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { isMaragonAssessmentPublished, maragonScoresArePublic, notAssessedLabel, publishableMaragonAnalysis } from '../utils/maragonPublication';
import { publishedBand, publicBandText, type PublicMaragonBand } from '../utils/maragonBandsOnly';
import { MaragonBandChip } from './maragon/MaragonBandChip';

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

/**
 * Bands only (v1.0 §10), side by side. No numbers, no score-proportional widths and no "greater" highlight:
 * v1.0 §1.2 puts ranking of subjects against each other out of scope.
 */
const ComparisonBands: React.FC<{ label: string; band1: PublicMaragonBand | null; band2: PublicMaragonBand | null; lang: 'sq' | 'en' }> = ({ label, band1, band2, lang }) => (
    <div className="w-full">
        <div className="grid grid-cols-2 gap-4">
            <MaragonBandChip label={label} band={band1} lang={lang} />
            <MaragonBandChip label={label} band={band2} lang={lang} />
        </div>
    </div>
);

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ profile1, profile2, onClose }) => {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'sq';
  const unassessed = notAssessedLabel(language === 'en' ? 'en' : 'sq');
  const leftPublished = isMaragonAssessmentPublished(profile1);
  const rightPublished = isMaragonAssessmentPublished(profile2);
  // Bands need the full gate, including a documented methodologyApproved === true.
  const leftBands = maragonScoresArePublic(profile1);
  const rightBands = maragonScoresArePublic(profile2);
  const scoreLabel = (profile: VipProfile, published: boolean) =>
    publicBandText(publishedBand(published && maragonScoresArePublic(profile), profile.averageMaragonScore), lang);
  const comparedDimensions = leftPublished && rightPublished
    ? publishableMaragonAnalysis(profile1).flatMap((dim1, index) => {
        const dim2 = publishableMaragonAnalysis(profile2)[index];
        if (!dim2 || dim1.dimension !== dim2.dimension) return [];
        const band1 = publishedBand(leftBands, dim1.score);
        const band2 = publishedBand(rightBands, dim2.score);
        if (band1 === null && band2 === null) return [];
        return [{ dimension: dim1.dimension, band1, band2 }];
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
            <h2 id="comparison-title" className="text-xl font-bold text-slate-800 dark:text-slate-100">Krahasim sipas brezave MARAGON®</h2>
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
                        <ComparisonBands
                            key={dim.dimension}
                            label={dim.dimension}
                            band1={dim.band1}
                            band2={dim.band2}
                            lang={lang}
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
