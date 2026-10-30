
import React, { useState, useCallback } from 'react';
import { ArticleAnalysis } from '../types';
import { analyzeArticle, isAnalysisServiceMisconfigured } from '../services/articleAnalysisService';
import { ArticleAnalysisResult } from './ArticleAnalysisResult';
import { ExclamationTriangleIcon, InlineSpinnerIcon } from './icons';

interface ContributeArticlePageProps {
  onBack: () => void;
}

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L22.75 5.25l-.813 2.846a4.5 4.5 0 0 0-3.09 3.09L16.25 12l2.846.813a4.5 4.5 0 0 0 3.09 3.09L22.75 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L18.25 12Z" />
    </svg>
);

export const ContributeArticlePage: React.FC<ContributeArticlePageProps> = ({ onBack }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ArticleAnalysis | null>(null);

  const isMisconfigured = isAnalysisServiceMisconfigured();

  const handleAnalysis = useCallback(async () => {
    if (isMisconfigured) {
        setError("Shërbimi i analizës së artikujve nuk është konfiguruar siç duhet.");
        return;
    }
    if (!title.trim() || !content.trim()) {
      setError("Ju lutemi plotësoni titullin dhe përmbajtjen e artikullit.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResult = await analyzeArticle(title, content);
      setResult(apiResult);
    } catch (err) {
      console.error("Gabim gjatë analizës së artikullit:", err);
      setError(err instanceof Error ? err.message : "Ndodhi një gabim i panjohur.");
    } finally {
      setIsLoading(false);
    }
  }, [title, content, isMisconfigured]);

  const handleReset = () => {
      setTitle('');
      setContent('');
      setResult(null);
      setError(null);
      setIsLoading(false);
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 text-primary-700 dark:text-primary-500">Kontribuoni një Artikull për Analizë</h1>
          <p className="text-slate-600 dark:text-slate-300">Keni një artikull ose një lajm që dëshironi ta verifikoni? Ngjisni përmbajtjen më poshtë dhe shërbimi ynë i AI do ta analizojë për saktësi dhe besueshmëri.</p>
        </div>

        {isMisconfigured ? (
           <div className="bg-yellow-100 dark:bg-yellow-800/30 p-4 rounded-lg shadow-md border border-yellow-400 dark:border-yellow-600">
             <div className="flex">
               <div className="flex-shrink-0"><ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" /></div>
               <div className="ml-3">
                 <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Gabim Konfigurimi</h3>
                 <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">Shërbimi i analizës nuk është i disponueshëm. Kontaktoni administratorin e platformës.</p>
               </div>
             </div>
           </div>
        ) : !result && !isLoading ? (
          <form onSubmit={(e) => { e.preventDefault(); handleAnalysis(); }} className="space-y-6">
            <div>
              <label htmlFor="article-title" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Titulli i Artikullit</label>
              <input
                type="text"
                id="article-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-primary-500 bg-slate-50 dark:bg-slate-700"
                placeholder="Shkruani titullin këtu..."
                required
              />
            </div>
            <div>
              <label htmlFor="article-content" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Përmbajtja e Artikullit</label>
              <textarea
                id="article-content"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-primary-500 bg-slate-50 dark:bg-slate-700"
                placeholder="Ngjisni ose shkruani përmbajtjen e plotë të artikullit këtu..."
                required
              />
            </div>
             {error && (
              <div className="bg-red-100 dark:bg-red-800/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-md" role="alert">
                <p>{error}</p>
              </div>
            )}
            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading || !title.trim() || !content.trim()}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border-2 border-action-border font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Analizo Artikullin me AI
              </button>
            </div>
          </form>
        ) : null}

        {isLoading && (
            <div className="flex justify-center items-center py-10 flex-col">
              <InlineSpinnerIcon className="w-12 h-12 text-primary-500" />
              <p className="ml-4 text-slate-600 dark:text-slate-300 text-lg mt-4">Duke analizuar artikullin, ju lutemi prisni...</p>
            </div>
        )}

        {result && (
            <ArticleAnalysisResult result={result} onReset={handleReset} />
        )}
        
        <div className="mt-10 text-center">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-md shadow-md transition"
          >
            Kthehu Pas
          </button>
        </div>
      </div>
    </main>
  );
};
