
import React from 'react';
// FIX: Corrected import path for types.
import { FactCheckResult, IntegrityReport } from '../types';
import { SourceItem } from './SourceItem';
import { XMarkIcon, ExclamationTriangleIcon, PrinterIcon, LightBulbIcon, BeakerIcon, CpuChipIcon, ShareIcon } from './icons';
import { IntegrityScoreMeter } from './IntegrityScoreMeter';
import { AnalysisBreakdown } from './AnalysisBreakdown';

interface ResultsDisplayProps {
  result: FactCheckResult;
  onClose?: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onClose }) => {
  const { originalClaim, summary, sources, truePoints = [], falsePoints = [], qualityAnalysis, finalIntegrityScore } = result;
  const hasDetailedPoints = (truePoints && truePoints.length > 0) || (falsePoints && falsePoints.length > 0);

  const handleReportIssue = () => {
    const subject = `Problem me Analizën: "${originalClaim.substring(0, 50)}..."`;
    const body = `Përshëndetje ekipi i NOVARIC®,

Po raportoj një problem me analizën për pretendimin e mëposhtëm:
Pretendimi: "${originalClaim}"
Verdikti i dhënë: ${result.verdict}

Ju lutem, shpjegoni problemin që keni hasur këtu:
[SHKRUAJ DETAJET KËTU]

Faleminderit!
`;
    window.location.href = `mailto:ethics@media.novaric.al?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handlePrint = () => {
    window.print();
  };
  
  const handleShare = async () => {
    const textToShare = `Pretendimi: "${result.originalClaim}"\nVerdikti: ${result.verdict}\n\nPërmbledhje: ${result.summary}\n\nAnalizuar nga NOVARIC® AI-Powered News.`;
    const shareData = {
      title: `Rezultati i Verifikimit: ${result.originalClaim.substring(0, 50)}...`,
      text: textToShare,
      url: window.location.href, // Share the main page URL as context
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Gabim gjatë shpërndjes:', error);
      }
    } else if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(textToShare);
            alert('Rezultati i analizës u kopjua në clipboard!'); // Simple alert is fine inside a modal
        } catch (err) {
            console.error('Nuk mund të kopjohej teksti: ', err);
        }
    } else {
        alert('Shpërndarja nuk mbështetet në këtë shfletues.');
    }
  };


  const scoreToVerdict = (score: number): IntegrityReport['verdict'] => {
    if (score >= 75) return "Integritet i Lartë";
    if (score >= 40) return "Integritet i Moderuar";
    return "Integritet i Ulët";
  };

  return (
    <div className="relative mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-2xl animate-fadeIn">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 z-10 print-hidden"
          aria-label="Mbyll rezultatet"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">Rezultatet e Verifikimit të Fakteve</h2>
      
      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Pretendimi Origjinal:</h3>
        <p className="italic text-slate-700 dark:text-slate-300 mt-1">"{originalClaim}"</p>
      </div>

      {finalIntegrityScore !== undefined && finalIntegrityScore !== null ? (
        <IntegrityScoreMeter score={finalIntegrityScore} verdict={scoreToVerdict(finalIntegrityScore)} />
      ) : null}

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 text-center">Përmbledhja e Analizës</h3>
        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">{summary || "Asnjë përmbledhje e dhënë nga IA."}</p>
      </div>
      
      {qualityAnalysis && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">Analiza e Cilësisë së Shkrimit</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                    <BeakerIcon className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sentimenti</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{qualityAnalysis.sentiment}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                    <LightBulbIcon className="w-8 h-8 mx-auto mb-2 text-sky-500" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Stili i Shkrimit</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{qualityAnalysis.writingStyle}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
                    <CpuChipIcon className="w-8 h-8 mx-auto mb-2 text-violet-500" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Integriteti Logjik</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{qualityAnalysis.logicalIntegrity}</p>
                </div>
            </div>
        </div>
      )}

      {hasDetailedPoints && (
        <AnalysisBreakdown truePoints={truePoints || []} falsePoints={falsePoints || []} />
      )}

      {sources && sources.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 text-center">Burimet Kryesore të Verifikuara</h3>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <SourceItem key={index} source={source} />
            ))}
          </ul>
        </div>
      )}
      {sources && sources.length === 0 && (
         <p className="text-sm text-slate-500 dark:text-slate-400 mt-8 pt-6 border-t border-slate-200 dark:border-slate-600 text-center">Asnjë burim specifik uebor nuk u citua nga IA për këtë pretendim.</p>
      )}

      <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-600 text-center flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 print-hidden">
        <button
          onClick={handleShare}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-blue-800 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800/50 dark:text-blue-200 dark:hover:bg-blue-700/50 rounded-md transition-colors"
        >
          <ShareIcon className="w-4 h-4 mr-2" />
          Shpërndaje Analizën
        </button>
        <button 
          onClick={handleReportIssue}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-yellow-800 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800/50 dark:text-yellow-200 dark:hover:bg-yellow-700/50 rounded-md transition-colors"
        >
          <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
          Raporto një Problem
        </button>
        <button
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors"
        >
          <PrinterIcon className="w-4 h-4 mr-2" />
          Printo / Ruaj si PDF
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @media print {
          body > *:not(#results-modal-overlay) {
            display: none;
          }
          #root, #toast-portal {
            display: none;
          }
          #results-modal-overlay {
            position: static;
            background: none;
            backdrop-filter: none;
            padding: 0;
            overflow: visible;
            display: block !important;
          }
          #results-modal-overlay > div {
            box-shadow: none !important;
            border: none !important;
            width: 100%;
            max-width: 100%;
            height: auto;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #results-modal-overlay > div > div {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          #results-modal-overlay * {
            color: black !important;
            background-color: transparent !important;
          }
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};