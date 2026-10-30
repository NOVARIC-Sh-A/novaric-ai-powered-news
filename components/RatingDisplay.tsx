
import React from 'react';
// FIX: Corrected import path for types.
import { NewsAuthenticityRating, SourceReliabilityRating } from '../types';
import { ShieldCheckIcon, ExclamationTriangleIcon, XCircleIcon, QuestionMarkCircleIcon, CheckCircleIcon } from './icons';

interface RatingDisplayProps {
  label: string;
  rating: NewsAuthenticityRating | SourceReliabilityRating;
  type: 'news' | 'source';
  layout?: 'default' | 'labelTop';
}

interface RatingStyle {
  text: string;
  // FIX: Replaced JSX.Element with React.ReactElement to fix namespace error.
  icon: React.ReactElement;
  textColorClass: string;
  iconColorClass: string; // This class will be applied to the span wrapping icon and text
}

// getRatingStyle remains largely the same, but icon color will be handled by the consuming span
const getRatingStyle = (rating: NewsAuthenticityRating | SourceReliabilityRating, type: 'news' | 'source'): RatingStyle => {
  let text = '';
  // FIX: Replaced JSX.Element with React.ReactElement to fix namespace error.
  let icon: React.ReactElement = <QuestionMarkCircleIcon className="w-5 h-5 mr-1.5" />; // Base icon style
  let textColorClass = 'text-slate-700 dark:text-slate-300';
  let iconColorClass = 'text-slate-500 dark:text-slate-400'; // This will color the icon via currentColor

  if (type === 'news') {
    switch (rating as NewsAuthenticityRating) {
      case 'VERIFIED_ACCURATE':
        text = 'Plotësisht i Vërtetë';
        icon = <ShieldCheckIcon className="w-5 h-5 mr-1.5" />;
        textColorClass = 'text-green-700 dark:text-green-300';
        iconColorClass = 'text-green-600 dark:text-green-400';
        break;
      case 'MOSTLY_ACCURATE':
        text = 'Kryesisht i Vërtetë';
        icon = <CheckCircleIcon className="w-5 h-5 mr-1.5" />;
        textColorClass = 'text-lime-700 dark:text-lime-300';
        iconColorClass = 'text-lime-600 dark:text-lime-400';
        break;
      case 'PARTIALLY_ACCURATE':
        text = 'Pjesërisht i Vërtetë / Kontekst Mungon';
        icon = <ExclamationTriangleIcon className="w-5 h-5 mr-1.5" />;
        textColorClass = 'text-yellow-700 dark:text-yellow-300';
        iconColorClass = 'text-yellow-600 dark:text-yellow-400';
        break;
      case 'ACCURACY_UNCLEAR':
        text = 'Paqartësi / Verifikim Shtesë';
        icon = <QuestionMarkCircleIcon className="w-5 h-5 mr-1.5" />;
        textColorClass = 'text-amber-700 dark:text-amber-300';
        iconColorClass = 'text-amber-600 dark:text-amber-400';
        break;
      case 'POTENTIAL_MISINFORMATION':
        text = 'Dezinformim i Mundshëm / I Gabuar';
        icon = <XCircleIcon className="w-5 h-5 mr-1.5" />;
        textColorClass = 'text-red-700 dark:text-red-300';
        iconColorClass = 'text-red-600 dark:text-red-400';
        break;
    }
  } else if (type === 'source') {
    switch (rating as SourceReliabilityRating) {
      case 'VERY_HIGH_REPUTATION':
        text = 'Reputacion Shumë i Lartë';
        icon = <ShieldCheckIcon className="w-5 h-5 mr-1.5" />;
        textColorClass = 'text-green-700 dark:text-green-300';
        iconColorClass = 'text-green-600 dark:text-green-400';
        break;
      case 'HIGH_REPUTATION':
        text = 'Reputacion i Lartë';
        icon = <CheckCircleIcon className="w-5 h-5 mr-1.5" />;
        textColorClass = 'text-lime-700 dark:text-lime-300';
        iconColorClass = 'text-lime-600 dark:text-lime-400';
        break;
      case 'MEDIUM_REPUTATION':
        text = 'Reputacion i Mesëm';
        icon = <ExclamationTriangleIcon className="w-5 h-5 mr-1.5" />;
        textColorClass = 'text-yellow-700 dark:text-yellow-300';
        iconColorClass = 'text-yellow-600 dark:text-yellow-400';
        break;
      case 'LOW_REPUTATION_MIXED':
        text = 'Reputacion i Ulët / I Përzier';
        icon = <QuestionMarkCircleIcon className="w-5 h-5 mr-1.5" />;
        textColorClass = 'text-amber-700 dark:text-amber-300';
        iconColorClass = 'text-amber-600 dark:text-amber-400';
        break;
      case 'UNRELIABLE_UNKNOWN':
        text = 'Jo i Besueshëm / I Panjohur';
        icon = <XCircleIcon className="w-5 h-5 mr-1.5" />;
        textColorClass = 'text-red-700 dark:text-red-300';
        iconColorClass = 'text-red-600 dark:text-red-400';
        break;
    }
  }

  return { text: text || 'E Panjohur', icon, textColorClass, iconColorClass };
};


export const RatingDisplay: React.FC<RatingDisplayProps> = ({ label, rating, type, layout = 'default' }) => {
  const { text, icon, textColorClass, iconColorClass } = getRatingStyle(rating, type);

  if (layout === 'labelTop') {
    return (
      <div>
        <span className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{label}:</span>
        <span className={`flex items-center ${textColorClass} ${iconColorClass}`}>
          {icon}
          {text}
        </span>
      </div>
    );
  }

  // Default layout
  return (
    <div className="flex items-center text-sm mb-1">
      <span className="font-semibold text-slate-600 dark:text-slate-400 min-w-[170px] sm:min-w-[190px]">{label}:</span>
      <span className={`flex items-center ml-2 ${textColorClass} ${iconColorClass}`}>
        {icon}
        {text}
      </span>
    </div>
  );
};
