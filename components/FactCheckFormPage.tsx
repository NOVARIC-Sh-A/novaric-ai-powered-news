import React, { useState } from 'react';
import { ChevronLeftIcon } from './icons';
import { analyzeArticleIntegrity } from '../services/factCheckEngine';
import { Source } from '../types';

interface FactCheckFormPageProps {
  onBack: () => void;
}

export const FactCheckFormPage: React.FC<FactCheckFormPageProps> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setIsLoading(true);
    setOutput("Duke kontrolluar…");

    try {
      // Use the centralized and robust service for the API call
      const data = await analyzeArticleIntegrity(trimmedText);

      const sourcesText = (data.sources || [])
        .map((s: Source, i: number) => `${i + 1}. ${s.title} (${s.uri})`)
        .join("\n");

      const resultText = `Verdikti: ${data.verdict ? data.verdict.toUpperCase() : 'NUK MUND TË PËRCAKTOTOHET'}

Përmbledhje:
${data.summary || 'Nuk u dha asnjë përmbledhje.'}

Burimet:
${sourcesText || 'Nuk u gjetën burime.'}`;
      
      setOutput(resultText);

    } catch (err) {
      // The service provides a descriptive error message, which is caught here.
      setOutput("Gabim: " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
        <div className="mb-6">
            <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-md shadow-sm transition"
                aria-label="Kthehu Pas"
            >
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                Kthehu Pas
            </button>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-center text-red-600 dark:text-red-500">Minimal Fact-Check Tool</h1>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-6">
          Paste a claim or URL below to get a quick fact-check from our external API.
        </p>

        <form id="fc-form" onSubmit={handleSubmit}>
          <textarea 
            id="fc-text" 
            placeholder="Ngjisni një pretendim ose URL këtu..." 
            required 
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            className="w-full h-32 p-3 text-sm border border-slate-300 dark:border-slate-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-y"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 w-full flex items-center justify-center px-4 py-3 font-bold rounded-lg shadow-md transition-all bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Duke kontrolluar...' : 'Verifiko Faktin'}
          </button>
        </form>

        <pre 
          id="fc-output" 
          className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg whitespace-pre-wrap break-words text-sm text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 min-h-[100px]"
        >
          {output || 'Rezultatet do të shfaqen këtu.'}
        </pre>
      </div>
    </main>
  );
};
