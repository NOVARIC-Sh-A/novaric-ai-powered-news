import React from 'react';
import { VipProfile } from '../types';
import { LikertScaleVote } from './LikertScaleVote';
import { SimplePoll } from './SimplePoll';
import { renderWithSuperscript } from '../utils/textUtils';
import { formatVipName, getProfilePhotoUrl } from '../utils/paragonProfileUtils';

interface VipProfileTileProps {
  profile: VipProfile;
  onNavigate: (profile: VipProfile) => void;
}

export const VipProfileTile: React.FC<VipProfileTileProps> = ({ profile, onNavigate }) => {
  const displayName = formatVipName(profile.name);
  
  // State for votes is now managed inside Likert/SimplePoll components
  const [currentLikertVote, setCurrentLikertVote] = React.useState<number | null>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(`vote_vip_${profile.id}`) : null;
    return saved ? parseInt(saved, 10) : null;
  });
  const [userPollChoice, setUserPollChoice] = React.useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem(`poll_choice_vip_${profile.id}`) : null;
  });

  const handleLikertVote = (rating: number) => {
    setCurrentLikertVote(rating);
    localStorage.setItem(`vote_vip_${profile.id}`, rating.toString());
  };

  const handlePollChoice = (choice: string) => {
    setUserPollChoice(choice);
    localStorage.setItem(`poll_choice_vip_${profile.id}`, choice);
  };


  const handleNavigation = () => {
    onNavigate(profile);
  };

  return (
    <div 
        className="relative bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 h-full group"
    >
      <div onClick={handleNavigation} className="p-4 flex flex-col items-center text-center flex-grow cursor-pointer">
        <div className="relative w-24 h-24 mb-3">
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
            className="w-24 h-24 rounded-full object-cover object-center border-2 border-primary-500/50 shadow-md transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 transition-colors duration-200 group-hover:text-primary-600 dark:group-hover:text-primary-400" title={profile.name}>
          {displayName}
        </h3>
        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">
          {profile.category}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2 h-10" title={profile.shortBio}>
          {renderWithSuperscript(profile.shortBio)}
        </p>
        <span
          className="text-xs text-primary-500 group-hover:text-primary-700 dark:text-primary-400 dark:group-hover:text-primary-200 font-semibold transition-colors duration-150"
          aria-label={`Lexo më shumë për ${profile.name}`}
        >
          Lexo më shumë...
        </span>
      </div>
      
      <div className="px-3 pb-3 space-y-3 mt-2 border-t border-slate-200 dark:border-slate-700 pt-3" onClick={(e) => e.stopPropagation()}>
        <LikertScaleVote
          vipId={profile.id}
          currentVote={currentLikertVote}
          onVote={handleLikertVote}
        />
        <SimplePoll
          vipId={profile.id}
          currentChoice={userPollChoice}
          onMakeChoice={handlePollChoice}
        />
      </div>
    </div>
  );
};