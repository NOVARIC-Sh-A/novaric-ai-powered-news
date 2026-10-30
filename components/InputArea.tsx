import React from 'react';
import { ExclamationTriangleIcon, ShareIcon, ArrowPathIcon } from './icons';

interface InputAreaProps {
  claim: string;
  setClaim: (claim: string) => void;
  onFactCheck: (claim: string) => void;
  isLoading: boolean;
  isMisconfigured: boolean;
  isMinimized: boolean;
  onSearchAgain: () => void;
  onShare: () => void;
  onNavigateToAnalysisMethodology: () => void;
  isExpanded: boolean;
  onExpand: () => void;
}

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 21.75a.75.75 0 0 1-.75-.75v-2.25a.75.75 0 0 1 1.5 0V21a.75.75 0 0 1-.75.75ZM5.106 17.834a.75.75 0 0 0 1.06 1.06l1.591-1.59a.75.75 0 0 0-1.06-1.061l-1.591 1.59ZM3 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12ZM6.166 5.106a.75.75 0 0 0-1.06 1.06l1.59 1.591a.75.75 0 1 0 1.061-1.06l-1.59-1.591Z" />
    </svg>
);


export const InputArea: React.FC<InputAreaProps> = ({
  claim,
  setClaim,
  onFactCheck,
  isLoading,
  isMisconfigured,
  isMinimized,
  onSearchAgain,
  onShare,
  onNavigateToAnalysisMethodology,
  isExpanded,
  onExpand,
}) => {

  const canSubmit = !isLoading && claim.trim().length > 0;

  if (isMinimized) {
    return (
      <div className="flex justify-center">
        <button
          onClick={onSearchAgain}
          className="flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900"
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Bëj një Verifikim të Ri
        </button>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-md rounded-xl p-2 sm:p-3 shadow-2xl border border-white/10 text-center animate-fadeIn">
        <button
          onClick={onExpand}
          className="w-full flex items-center justify-center px-4 py-3 font-bold rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 bg-slate-800/80 hover:bg-slate-700 text-white focus:ring-slate-400 border border-white/5"
          aria-label="Kliko për të verifikuar faktet me AI"
        >
          <SparklesIcon className="w-5 h-5 mr-2 text-cyan-400" />
          Verifiko Faktet me AI
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 animate-fadeIn">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-6">
        Shkruani Pretendimin e Lajmit ose Përmbledhjen e Artikullit
      </h2>
      <textarea
        value={claim}
        onChange={(e) => setClaim(e.target.value)}
        className="w-full p-4 text-base border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-black/50 text-white placeholder:text-slate-500 resize-none shadow-inner min-h-[150px]"
        rows={6}
        placeholder="p.sh., 'Një studim tregon se çokollata kuron të gjitha sëmundjet.' ose ngjisni një përmbledhje të shkurtër artikulli këtu..."
        disabled={isLoading || isMisconfigured}
        aria-label="Fusha për të shkruar pretendimin e lajmit"
      />
      
      {isMisconfigured && (
        <div className="flex items-center text-sm text-yellow-400 mt-3">
          <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
          Shërbimi i verifikimit nuk është konfiguruar.
        </div>
      )}

      <div className="mt-6 flex flex-col items-center space-y-4">
        <button
          onClick={() => onFactCheck(claim)}
          disabled={!canSubmit || isMisconfigured}
          className={`w-full max-w-md flex items-center justify-center px-6 py-4 font-bold rounded-xl shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 
            ${!canSubmit || isMisconfigured 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
              : 'bg-primary-600 hover:bg-primary-500 text-white focus:ring-primary-400 border border-white/10'
            }`}
          aria-label="Verifiko faktet me AI"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Duke Procesuar...
            </span>
          ) : (
            <>
              <SparklesIcon className="w-6 h-6 mr-2 text-cyan-400" />
              ANALIZO FAKTET
            </>
          )}
        </button>
        
        <button 
            onClick={() => onExpand()} 
            className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
        >
            Anulo
        </button>
      </div>
    </div>
  );
};