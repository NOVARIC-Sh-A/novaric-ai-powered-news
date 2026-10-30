import React, { useState } from 'react';
import { InputArea } from './InputArea';
import { XMarkIcon } from './icons';
import { analyzeArticleIntegrity } from '../services/factCheckEngine';
import { FactCheckResult } from '../types';
import { WorldTimeTicker } from './WorldTimeTicker';

interface MainInputDockProps {
  isMisconfigured: boolean;
  isVisible: boolean;
  isScrolled: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  onResult: (result: FactCheckResult | null) => void;
  onSearchAgain: () => void;
  onShare: () => void;
  onNavigateToAnalysisMethodology: () => void;
}

export const MainInputDock: React.FC<MainInputDockProps> = ({
  isMisconfigured,
  isVisible,
  isScrolled,
  error,
  setError,
  onResult,
  onSearchAgain,
  onShare,
  onNavigateToAnalysisMethodology,
}) => {
  const [claim, setClaim] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFactCheck = async (text: string) => {
    if (!text.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeArticleIntegrity(text);
      onResult(result);
      setIsExpanded(false);
      setClaim('');
    } catch (err: any) {
      setError(err.message || "Ndodhi një gabim gjatë verifikimit.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  // Fullscreen state vs Collapsed state
  const containerClasses = isExpanded 
    ? 'fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl p-6 h-screen overflow-y-auto' 
    : 'relative w-full z-[60] bg-transparent pointer-events-auto px-4 pb-0';

  return (
    <div className={`${containerClasses} transition-all duration-500`}>
      <div className="container mx-auto relative flex flex-col items-center">
        {isExpanded && (
          <button 
            onClick={() => setIsExpanded(false)}
            className="absolute top-0 right-0 p-2 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors z-20"
            aria-label="Mbyll panelin"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
        
        <div className={`w-full ${isExpanded ? 'max-w-4xl' : 'lg:grid lg:grid-cols-12 lg:gap-8'}`}>
            <div className={`${isExpanded ? '' : 'col-span-12 lg:col-start-4 lg:col-span-6'}`}>
                <div className="w-full">
                    <InputArea 
                        claim={claim}
                        setClaim={setClaim}
                        onFactCheck={handleFactCheck}
                        isLoading={isLoading}
                        isMisconfigured={isMisconfigured}
                        isMinimized={false}
                        onSearchAgain={onSearchAgain}
                        onShare={onShare}
                        onNavigateToAnalysisMethodology={onNavigateToAnalysisMethodology}
                        isExpanded={isExpanded}
                        onExpand={() => setIsExpanded(true)}
                    />
                </div>

                {!isExpanded && (
                    <div className="w-full mt-1.5 space-y-1.5 animate-fadeIn">
                        <WorldTimeTicker />
                        <p className="text-[10px] sm:text-xs font-bold text-center px-4 leading-tight mb-1">
                          <span className="text-yellow-400">KUJDES:</span> <span className="text-slate-300">Të dhënat e ofruara mund të mos jenë të sakta pasi popullimi i bazës së të dhënave është në proces e sipër. Për përditësime na kontaktoni në </span>
                          <a href="mailto:contact@media.novaric.al" className="text-cyan-400 hover:underline">contact@media.novaric.al</a>
                          <span className="text-slate-300">.</span>
                        </p>
                    </div>
                )}
            </div>
        </div>

        {error && isExpanded && (
          <div className="mt-4 w-full max-w-4xl p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm text-center animate-fadeIn">
            {error}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};