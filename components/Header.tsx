
import React, { useState, useEffect, useRef } from 'react';
// Added XIcon to the imports from ./icons
import { XMarkIcon, XIcon, FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon, ChainIcon, MenuIcon, Squares2X2Icon } from './icons';
import { HeaderMenu } from './HeaderMenu';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  showSlogan?: boolean;
  isScrolled: boolean;
  onToggleMobileMenu: () => void;
  onNavigateToPoliticians: () => void;
  onNavigateToJudiciary: () => void;
  onNavigateToBusiness: () => void;
  onNavigateToMediaPersonalities: () => void;
  onNavigateToNewsList: () => void;
  onNavigateToArticlesList: () => void;
  onNavigateToAcademicJournalsList: () => void;
  onNavigateToNovaricAcademy: () => void;
  onNavigateToNovaricJournalManifesto: () => void;
  onNavigateToNovaricMediaHouse: () => void;
  onNavigateToTvPersonalitiesAnalysis: () => void;
  onOpenUrlShortener: () => void;
  onNavigateToFactCheckForm: () => void;
  onNavigateToMaragonFramework: () => void;
  onNavigateToPoliticalProfileFramework: () => void;
  onNavigateToPoliticalProfile: () => void;
  onNavigateToJurisprudence: () => void;
  onNavigateToJudicialPerformance: () => void;
  onNavigateToJudicialPhilosophy: () => void;
  onNavigateToJudicialEthics: () => void;
  onNavigateToJudicialProfileMethodology: () => void;
  onNavigateToJudicialEcosystemAnalysisMethodology: () => void;
  onNavigateToBibliografiaJurisprudences: () => void;
  onNavigateToMediaEducationBibliography: () => void;
  onNavigateToMediaEducationFramework?: () => void;
  currentPage?: string;
  onNavigateToEuropeanCommission?: () => void;
  onNavigateToEuCodeOfConduct?: () => void;
  onNavigateToEuReferencesArchive?: () => void;
  onNavigateToCidaMethodology?: () => void;
  onNavigateToNexusAiGovernance?: () => void;
  onNavigateToNoraAiProfile?: () => void;
  onNavigateToAuthorProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  showSlogan, 
  isScrolled,
  onToggleMobileMenu,
  onOpenUrlShortener,
  onNavigateToFactCheckForm,
  ...navProps
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { language, toggleLanguage } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <header className={`relative text-white transition-all duration-300 ${isScrolled ? 'bg-primary-500/85 backdrop-blur-sm' : 'bg-primary-500'}`}>
      {/* Main Header Bar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left side: Logo and Title */}
          <div className="flex items-center">
            <img 
              src="https://novaric.co/wp-content/uploads/2025/07/NOVARIC-Logos_Master-WB-R_12062025_500x500.webp" 
              alt="NOVARIC® Logo" 
              className="h-16 sm:h-20 w-auto mr-2"
            />
            <h1 className="text-sm sm:text-base md:text-lg font-normal tracking-tight text-white">
              NOVARIC<sup>®</sup> <span className="hidden sm:inline">AI-Powered News</span>
            </h1>
          </div>
          
          {/* Center: Slogan (Desktop) */}
          <div className="hidden lg:block text-center">
             <p className="text-lg font-bold text-white">
              Shaping Narrative for a Smarter Society.
            </p>
            <p className="text-xs font-normal text-slate-200">
              AI-Fact Checked Journalism for a Trusted Future.
            </p>
             <p className="text-xs font-light text-slate-300">
              Narrativë mediatike e verifikuar nga inteligjenca artificiale.
            </p>
          </div>

          {/* Right side: Social Media Icons & Menu */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            
            {/* Language Toggle */}
             <button
                onClick={toggleLanguage}
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-xs font-bold transition-all"
                aria-label="Switch Language"
            >
                <span className={language === 'sq' ? 'text-white' : 'text-white/50'}>AL</span>
                <span className="text-white/30">|</span>
                <span className={language === 'en' ? 'text-white' : 'text-white/50'}>EN</span>
            </button>

            <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
              <a href="https://x.com/novaricmedia" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-white/20 transition-colors" aria-label="NOVARIC në X">
                <XIcon className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/novaric.media" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-white/20 transition-colors" aria-label="NOVARIC në Facebook">
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/novaric.media/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-white/20 transition-colors" aria-label="NOVARIC në Instagram">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/company/novaric-sh-a/" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-white/20 transition-colors" aria-label="NOVARIC në LinkedIn">
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a href="https://www.youtube.com/@NOVARIC-Media" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-white/20 transition-colors" aria-label="NOVARIC në YouTube">
                <YouTubeIcon className="w-4 w-4" />
              </a>
            </div>
            <div className="h-5 w-px bg-white/30 hidden md:block"></div>
            
            <div ref={menuRef} className="hidden md:block relative">
              <button onClick={toggleMenu} className="p-1.5 rounded-full hover:bg-white/20 transition-colors" aria-haspopup="true" aria-expanded={isMenuOpen}>
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              {isMenuOpen && (
                <HeaderMenu 
                  onClose={() => setIsMenuOpen(false)} 
                  onOpenUrlShortener={onOpenUrlShortener}
                  onNavigateToFactCheckForm={onNavigateToFactCheckForm}
                  {...navProps}
                />
              )}
            </div>
            
            <div className="md:hidden flex items-center gap-2">
               {/* Mobile Language Toggle */}
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1 px-2 py-1 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-xs font-bold transition-all sm:hidden"
                    aria-label="Switch Language"
                >
                    <span className={language === 'sq' ? 'text-white' : 'text-white/50'}>AL</span>
                    <span className="text-white/30">|</span>
                    <span className={language === 'en' ? 'text-white' : 'text-white/50'}>EN</span>
                </button>
              <button onClick={onToggleMobileMenu} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Hap menunë">
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
