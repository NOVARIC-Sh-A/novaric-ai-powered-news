import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ParagonHeaderProps {
  onNavigateToNewsList: () => void;
  onNavigateToPoliticians: () => void;
  onNavigateToMediaPersonalities: () => void;
  onNavigateToLeaderboard: () => void;
}

export const ParagonHeader: React.FC<ParagonHeaderProps> = ({
  onNavigateToNewsList,
  onNavigateToPoliticians,
  onNavigateToMediaPersonalities,
  onNavigateToLeaderboard
}) => {
  const { language, t } = useLanguage();

  return (
    <header className="relative flex flex-col font-sans transition-all duration-300">
      
      {/* TOP HALF: PARAGON (Political System) */}
      <div className="w-full bg-blue-950/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-4 py-1.5 flex items-center justify-between">
          
          {/* PARAGON Logo */}
          <div 
            className="text-base sm:text-lg font-normal tracking-wide text-white font-helvetica cursor-pointer drop-shadow-md hover:opacity-80 transition-opacity flex items-center"
            onClick={() => window.location.href = '/'}
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            PARAGON<sup className="novaric-registered text-white" aria-hidden="true">®</sup>
          </div>

          {/* Right: Political Menu */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onNavigateToPoliticians}
              className="text-xs font-medium text-white hover:bg-white/10 px-3 py-1.5 rounded-md transition-all duration-200"
            >
              {t('nav.politicians')}
            </button>
            <button
              onClick={onNavigateToLeaderboard}
              className="text-xs font-medium text-white hover:bg-white/10 px-3 py-1.5 rounded-md transition-all duration-200"
            >
              {t('nav.leaderboard')}
            </button>
          </nav>
        </div>
      </div>

      {/* BOTTOM HALF: MARAGON (Media System) */}
      <div className="w-full bg-blue-950/80 backdrop-blur-md border-b border-blue-800/50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-4 py-1.5 flex items-center justify-between">
           
           {/* MARAGON Logo */}
           <div 
            className="text-base sm:text-lg font-normal tracking-wider text-white font-helvetica cursor-pointer drop-shadow-md hover:opacity-80 transition-opacity flex items-center"
            onClick={onNavigateToMediaPersonalities}
          >
            MARAGON<sup className="novaric-registered text-white" aria-hidden="true">®</sup>
          </div>

          {/* Right: Media Menu */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onNavigateToMediaPersonalities}
              className="text-xs font-medium text-white hover:bg-white/10 px-3 py-1.5 rounded-md transition-all duration-200"
            >
              {t('nav.media')}
            </button>
            <a
               href="/?page=tvPersonalitiesAnalysis"
               className="text-xs font-medium text-white hover:bg-white/10 px-3 py-1.5 rounded-md transition-all duration-200"
            >
               {language === 'sq' ? 'ANALIZA' : 'ANALYSIS'}
            </a>
             
             {/* Divider */}
             <div className="h-3 w-px bg-white/20 mx-1"></div>

             <button
              onClick={onNavigateToNewsList}
              className="text-xs font-medium text-white hover:bg-white/10 px-3 py-1.5 rounded-md transition-all duration-200"
            >
              {t('nav.news')}
            </button>
          </nav>
        </div>
      </div>
      
    </header>
  );
};