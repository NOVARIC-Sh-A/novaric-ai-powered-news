
import React from 'react';
// FIX: Corrected import path for types.
import { NewsAuthenticityRating } from '../types';

interface AuthenticityBarProps {
  rating: NewsAuthenticityRating;
}

const getMarkerPositionPercentage = (rating: NewsAuthenticityRating): number => {
  switch (rating) {
    case 'POTENTIAL_MISINFORMATION':
      return 5; // Far Left - Deep Red
    case 'ACCURACY_UNCLEAR':
      return 27.5; // Orange / Red-Yellow transition
    case 'PARTIALLY_ACCURATE':
      return 50; // Middle - Yellow
    case 'MOSTLY_ACCURATE':
      return 72.5; // Lime / Yellow-Green transition
    case 'VERIFIED_ACCURATE':
      return 95; // Far Right - Deep Green
    default:
      return 50; // Default to center for unknown/fallback cases
  }
};

export const AuthenticityBar: React.FC<AuthenticityBarProps> = ({ rating }) => {
  const markerPosition = getMarkerPositionPercentage(rating);

  return (
    <div className="w-full mt-1.5 mb-2" aria-label={`Vlerësimi i autenticitetit: ${rating}, shënuar në ${markerPosition}% të shiritit vizual`}>
      <div 
        className="relative h-2.5 flex rounded-full overflow-hidden"
        style={{ background: 'linear-gradient(to right, #ef4444, #facc15, #22c55e)' }} // red-500, yellow-400, green-500
      >
        {/* The gradient is now applied to the parent div. No need for separate red/green divs. */}
        
        {/* Marker */}
        <div
          className="absolute top-1/2 w-3.5 h-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-700 dark:border-slate-200 rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg"
          style={{ left: `${markerPosition}%` }}
          role="img"
          aria-label={`Shenjuesi i pozicionit të autenticitetit në ${markerPosition}%`}
        ></div>
      </div>
    </div>
  );
};