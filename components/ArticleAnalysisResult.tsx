
import React from 'react';
import { ArticleAnalysis, VerdictLabel } from '../types';
import { AuthenticityBar } from './AuthenticityBar';
import { SourceItem } from './SourceItem';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, QuestionMarkCircleIcon } from './icons';

interface ArticleAnalysisResultProps {
  result: ArticleAnalysis;
  onReset: () => void;
}

const getVerdictStyles = (verdict: VerdictLabel): { icon: React.ReactNode; bgColor: string; textColor: string; borderColor: string } => {
  switch (verdict) {
    case VerdictLabel.TRUE:
    case VerdictLabel.MOSTLY_TRUE:
      return { icon: <CheckCircleIcon className="w-6 h-6 mr-2" />, bgColor: 'bg-green-100 dark:bg-green-900', textColor: 'text-green-700 dark:text-green-200', borderColor: 'border-green-400' };
    case VerdictLabel.FALSE:
    case VerdictLabel.MOSTLY_FALSE:
      return { icon: <XCircleIcon className="w-6 h-6 mr-2" />, bgColor: 'bg-red-100 dark:bg-red-900', textColor: 'text-red-700 dark:text-red-200', borderColor: 'border-red-400' };
    case VerdictLabel.HALF_TRUE:
    case VerdictLabel.MISLEADING:
      return { icon: <ExclamationTriangleIcon className="w-6 h-6 mr-2" />, bgColor: 'bg-yellow-100 dark:bg-yellow-800', textColor: 'text-yellow-700 dark:text-yellow-200', borderColor: 'border-yellow-400' };
    default:
      return { icon: <QuestionMarkCircleIcon className="w-6 h-6 mr-2" />, bgColor: 'bg-slate-100 dark:bg-slate-700', textColor: 'text-slate-700 dark:text-slate-200', borderColor: 'border-slate-400' };
  }
};

export const ArticleAnalysisResult: React.FC<ArticleAnalysisResultProps> = ({ result, onReset }) => {
  const { title, summary, verdict, authenticityRating, sources } = result;
  const { icon, bgColor, textColor, borderColor } = getVerdictStyles(verdict);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100">Rezultati i Analizës</h2>
      
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Titulli i Artikullit:</h3>
        <p className="italic text-lg text-slate-700 dark:text-slate-300">"{title}"</p>
      </div>

      <div className={`p-4 rounded-md border ${borderColor} ${bgColor} ${textColor}`}>
        <div className="flex items-center">
          {icon}
          <h3 className="text-lg font-semibold">Verdikti: {verdict}</h3>
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-1">Vlerësimi i Autenticitetit:</h3>
        <AuthenticityBar rating={authenticityRating} />
      </div>

      <div>
        <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-2">Përmbledhja e Analizës:</h3>
        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{summary}</p>
      </div>

      {sources && sources.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-2">Burimet e Konsideruara:</h3>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <SourceItem key={index} source={source} />
            ))}
          </ul>
        </div>
      )}

      <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md"
        >
          Analizo një Artikull Tjetër
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
      `}</style>
    </div>
  );
};
