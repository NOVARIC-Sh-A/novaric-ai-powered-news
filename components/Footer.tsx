import React, { useState, useEffect } from 'react';
import { EyeIcon, ChevronUpIcon, ChevronDownIcon } from './icons';
import { getApiEndpoint } from '../services/apiConfig';
import { NovaricBrand } from './NovaricBrand';

interface FooterProps {
  onNavigateToPrivacy: () => void;
  onNavigateToSocialMediaPolicy: () => void;
  onNavigateToCopyrightPolicy: () => void;
  onNavigateToJournalisticEthicsManual: () => void;
  onNavigateToAboutUs: () => void;
  onNavigateToDataSourceCoverage: () => void;
  onNavigateToBrandGuidelines: () => void;
  onNavigateToNewsletterWelcome: () => void;
  onNavigateToNewsletter: () => void;
  onNavigateToNewsletterSubscription: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToTrademark: () => void;
  onNavigateToSitemap: () => void;
  onOpenUrlShortener: () => void;
  onNavigateToNovaricCodeOfStandards: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToNovaricMediaHouse: () => void;
  onNavigateToMaragonFramework: () => void;
  onNavigateToNovaricJournalManifesto: () => void;
  onNavigateToAuthorProfile?: () => void;
}

export const Footer: React.FC<FooterProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  // ------------------------------------------------------------------
  // Fetch visitor count from backend
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        // Use getApiEndpoint to ensure we hit the correct backend URL (Cloud Run)
        // instead of a relative path that might 404 on the frontend host.
        const res = await fetch(getApiEndpoint("/visit"));
        
        if (!res.ok) {
            // If endpoint doesn't exist or errors, stop here to avoid JSON parse errors
            return;
        }

        const data = await res.json();
        if (data && typeof data.count === "number") {
          setVisitorCount(data.count);
        }
      } catch (error) {
        // Silently fail if the visitor counter service is unavailable
        // console.error("Visitor counter unavailable");
      }
    };

    fetchVisitorCount();
  }, []);

  const handleToggle = () => setIsExpanded(prev => !prev);

  // ------------------------------------------------------------------
  // FULL EXPANDED FOOTER CONTENT
  // ------------------------------------------------------------------
  const FullFooterContent: React.FC = () => (
    <>
      {/* Visitor Counter */}
      {typeof visitorCount === "number" && (
        <div
          className="flex items-center justify-center text-xs text-slate-200"
          aria-label={`Numri i vizitorëve: ${visitorCount.toLocaleString()}`}
        >
          <EyeIcon className="w-4 h-4 mr-1.5" />
          <span>Ju jeni vizitori: {visitorCount.toLocaleString()}</span>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-y-2 gap-x-4">
        <button onClick={props.onNavigateToAboutUs} className="text-xs text-white hover:underline">Misioni Ynë</button>
        <button onClick={props.onNavigateToNoraAiProfile} className="text-xs text-white hover:underline">Profili i Norës (AI)</button>
        <button onClick={props.onNavigateToNovaricMediaHouse} className="text-xs text-white hover:underline"><NovaricBrand suffix=" Media House" /></button>
        <button onClick={props.onNavigateToNovaricJournalManifesto} className="text-xs text-white hover:underline"><NovaricBrand suffix=" AI Journal" /></button>
        <button onClick={props.onNavigateToNovaricCodeOfStandards} className="text-xs text-white hover:underline">Kodi i Standardeve</button>
        <button onClick={props.onNavigateToJournalisticEthicsManual} className="text-xs text-white hover:underline">Manuali i Etikës</button>
        <button onClick={props.onNavigateToDataSourceCoverage} className="text-xs text-white hover:underline">Burimi i të Dhënave</button>
        <button onClick={props.onNavigateToPrivacy} className="text-xs text-white hover:underline">Politika e Privatësisë</button>
        <button onClick={props.onNavigateToSocialMediaPolicy} className="text-xs text-white hover:underline">Politika e Mediave Sociale</button>
        <button onClick={props.onNavigateToCopyrightPolicy} className="text-xs text-white hover:underline">Të Drejtat e Autorit</button>
        <button onClick={props.onNavigateToBrandGuidelines} className="text-xs text-white hover:underline">Udhëzime Brandi</button>

        <button onClick={props.onNavigateToNewsletter} className="text-xs text-yellow-300 hover:text-yellow-200 hover:underline font-bold">
          Buletini Javor
        </button>

        <button onClick={props.onNavigateToNewsletterSubscription} className="text-xs text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1.5 rounded-full font-bold transition-colors">
          Abonohu
        </button>

        <button 
          onClick={props.onNavigateToAuthorProfile || (() => props.onNavigateToVipProfile('vip33'))} 
          className="text-xs text-white hover:underline"
        >
          Profili i Autorit (Dr Alban Gj. THIKA)
        </button>

        <button onClick={props.onNavigateToTrademark} className="text-xs text-white hover:underline">
          Certifikata e Markës Tregtare
        </button>

        <button onClick={props.onOpenUrlShortener} className="text-xs text-white hover:underline">
          Shkurto Linkun
        </button>

        <button onClick={props.onNavigateToSitemap} className="text-xs text-white hover:underline">
          Harta e Faqes
        </button>
      </div>

      {/* Legal & Note */}
      <div className="space-y-0.5 mt-2">
        <p className="text-xs">
          &copy; {new Date().getFullYear()} <NovaricBrand />. Të gjitha të drejtat të rezervuara.
        </p>
        <p className="text-xs">Edukimi Mediatik.</p>
      </div>

      <p className="text-[10px] text-slate-300 max-w-xl leading-tight pt-2 border-t border-primary-500/50">
        Mohim përgjegjësie: Verifikimet e fakteve të gjeneruara nga IA mund të mos jenë gjithmonë të sakta. Verifikoni informacionin nga burime të shumta me reputacion.
      </p>
    </>
  );

  // ------------------------------------------------------------------
  // FOOTER WRAPPER
  // ------------------------------------------------------------------
  return (
    <footer className={`text-white text-center px-4 shadow-inner transition-colors duration-300 ${isExpanded ? 'bg-primary-500/85 backdrop-blur-sm' : 'bg-primary-500'}`}>
      <div className="container mx-auto flex flex-col items-center py-2">

        {/* Expandable Section */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden w-full ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-2 pb-3 flex flex-col items-center space-y-3">
            <FullFooterContent />
          </div>
        </div>

        {/* Footer Bar */}
        <div className="w-full flex justify-between items-center">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} <NovaricBrand />. Të gjitha të drejtat të rezervuara.
          </p>

          <button onClick={handleToggle} className="flex items-center text-xs font-semibold p-1" aria-expanded={isExpanded}>
            {isExpanded ? 'Mbyll' : 'Më shumë'}
            {isExpanded ? <ChevronDownIcon className="w-4 h-4 ml-1" /> : <ChevronUpIcon className="w-4 h-4 ml-1" />}
          </button>
        </div>

      </div>
    </footer>
  );
};