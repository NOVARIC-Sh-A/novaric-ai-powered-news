import React from "react";
import { IntegrityReport, ClaimAnalysis } from "../types";
import { IntegrityScoreMeter } from './IntegrityScoreMeter';
import { ShareIcon, ScaleIcon, PencilSquareIcon, LightBulbIcon } from "./icons";

interface Props {
  report: IntegrityReport;
  onClose: () => void;
}

const getClaimCardClasses = (verdict?: ClaimAnalysis['verdict']): string => {
  const baseClasses = "border p-4 rounded-lg shadow-sm";
  switch (verdict) {
    case "E Vërtetë":
      return `${baseClasses} bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-700`;
    case "E Gabuar":
    case "Mashtruese":
      return `${baseClasses} bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700`;
    case "E Paverifikueshme":
    default:
      return `${baseClasses} bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700`;
  }
};


export const IntegrityReportDisplay: React.FC<Props> = ({ report, onClose }) => {

  const handleShare = async (claim: ClaimAnalysis | null) => {
    if (!claim) return;
    const textToShare = `Pretendimi: "${claim.claim}"\nVerdikti: ${claim.verdict}\n\nArsyetimi: ${claim.reason}\n\nAnalizuar nga NOVARIC® AI-Powered News.`;
    const shareData = {
      title: 'Analizë e Verifikimit të Fakteve',
      text: textToShare,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Gabim gjatë shpërndarjes:', error);
      }
    } else if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(`${shareData.title}\n${textToShare}`);
            alert('Rezultati u kopjua në clipboard!');
        } catch (err) {
            console.error('Nuk mund të kopjohej teksti: ', err);
            alert(`Dështoi kopjimi i rezultatit: ${err}`);
        }
    } else {
        alert('Shpërndarja nuk mbështetet në këtë shfletues.');
    }
  };


  return (
    <div className="relative mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-2xl animate-fadeIn space-y-6">
       <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 z-10"
          aria-label="Mbyll rezultatet"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">Përmbledhja e Vlerësimit të Integritetit</h2>
      
      <IntegrityScoreMeter score={report.integrityScore} verdict={report.verdict} />

      {report.analysisSummary && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/40 rounded-lg shadow-inner border-l-4 border-blue-400">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Përmbledhje e Shpejtë e Analizës</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Anshmëria Kryesore:</strong> {report.analysisSummary.mainBias}</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1"><strong>Narrativa Dominuese:</strong> {report.analysisSummary.dominantNarrative}</p>
        </div>
      )}

      {report.warnings && report.warnings.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/40 border-l-4 border-red-400 text-red-700 dark:text-red-200 p-4 rounded-r-lg">
          <strong className="font-bold">Paralajmërime:</strong>
          <ul className="list-disc list-inside mt-1">
            {report.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="text-xl font-semibold text-center pt-4 border-t border-slate-200 dark:border-slate-700">Analiza e Pretendimeve të Veçuara</h3>
      <ul className="space-y-4">
        {(report.claims || []).map((claim, index) => (
          <li key={`${claim?.claim || 'claim'}-${index}`} className={`${getClaimCardClasses(claim?.verdict)} relative`}>
            <button
              onClick={() => handleShare(claim)}
              className="absolute top-3 right-3 p-1.5 bg-slate-200/80 dark:bg-slate-700/80 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Shpërndaje këtë pretendim"
              title="Shpërndaje këtë pretendim"
            >
                <ShareIcon className="w-5 h-5"/>
            </button>
            <p className="font-medium text-slate-800 dark:text-slate-200 pr-8">"{claim?.claim}"</p>
            <p className="mt-2">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Verdikti:</span>{" "}
              <span className={
                claim?.verdict === "E Vërtetë"
                  ? "text-green-600 font-bold dark:text-green-400"
                  : claim?.verdict === "E Gabuar" || claim?.verdict === "Mashtruese"
                  ? "text-red-600 font-bold dark:text-red-400"
                  : "text-gray-600 dark:text-gray-400 font-bold"
              }>
                {claim?.verdict || 'E Paverifikueshme'}
              </span>
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{claim?.reason}</p>
            
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 space-y-2 text-sm">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Metadatat e Analizës:</h4>
              
              {claim?.detectedBias && (
                <div className="flex items-start">
                  <ScaleIcon className="w-4 h-4 mr-2 mt-0.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                  <div>
                    <strong>Anshmëria e Zbuluar:</strong>
                    <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">{claim.detectedBias}</span>
                  </div>
                </div>
              )}

              {claim?.framingTechniques && claim.framingTechniques.length > 0 && (
                <div className="flex items-start">
                  <PencilSquareIcon className="w-4 h-4 mr-2 mt-0.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                  <div>
                    <strong>Teknikat e Kornizimit:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(claim.framingTechniques || []).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {claim?.disinformationPattern && claim.disinformationPattern !== 'N/A' && (
                 <div className="flex items-start">
                  <LightBulbIcon className="w-4 h-4 mr-2 mt-0.5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                  <div>
                    <strong>Modeli i Dezinformimit:</strong>
                    <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800/50 dark:text-yellow-200">{claim.disinformationPattern}</span>
                  </div>
                </div>
              )}
            </div>

            {claim?.sources && claim.sources.length > 0 && (
              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-600">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Burimet:</p>
                <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                  {(claim.sources || []).map((s, sourceIndex) => (
                    <li key={`${s?.uri || 'source'}-${sourceIndex}`}>
                      <a href={s?.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        {(s?.title || '').length > 100 ? (s?.title || '').slice(0, 100) + "..." : (s?.title || 'Burim pa titull')}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};