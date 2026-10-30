import React, { useState, useEffect } from 'react';
import { shortenUrl } from '../services/urlShortenerService';
import { XMarkIcon, ChainIcon, ClipboardDocumentIcon, CheckIcon } from './icons';

interface UrlShortenerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UrlShortenerModal: React.FC<UrlShortenerModalProps> = ({ isOpen, onClose }) => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setLongUrl('');
      setShortUrl(null);
      setIsLoading(false);
      setError(null);
      setIsCopied(false);
    }
  }, [isOpen]);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShortUrl(null);
    setIsCopied(false);
    setIsLoading(true);

    try {
      const result = await shortenUrl(longUrl);
      setShortUrl(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ndodhi një gabim i panjohur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      setError('Dështoi kopjimi i linkut.');
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="url-shortener-title"
    >
      <div
        className="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-xl shadow-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 z-10"
          aria-label="Mbyll"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <h2 id="url-shortener-title" className="text-2xl font-bold text-center text-primary-600 dark:text-primary-400 mb-4">
          Shkurto një Link
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
          Krijoni një link të shkurtër dhe të lehtë për t'u ndarë nga çdo URL e gjatë.
        </p>

        <form onSubmit={handleShorten} className="space-y-4">
          <input
            type="url"
            value={longUrl}
            onChange={e => setLongUrl(e.target.value)}
            placeholder="Ngjisni URL-në tuaj të gjatë këtu (p.sh., https://...)"
            className="w-full p-3 border-2 border-slate-300/50 dark:border-slate-600/50 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white/80 dark:bg-slate-700/80 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !longUrl.trim()}
            className="w-full flex items-center justify-center px-4 py-3 font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Duke shkurtuar...
              </>
            ) : (
              <>
                <ChainIcon className="w-5 h-5 mr-2" />
                Shkurto Linkun
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-100 dark:bg-red-800/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg shadow-md text-sm" role="alert">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 animate-fadeIn">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Linku juaj i shkurtër:</p>
            <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="flex-grow text-cyan-600 dark:text-cyan-400 font-mono break-all hover:underline">
                {shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className={`flex-shrink-0 flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-md shadow-sm transition-colors duration-200 ${
                  isCopied
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'
                }`}
              >
                {isCopied ? (
                  <>
                    <CheckIcon className="w-4 h-4 mr-1.5" />
                    U kopjua!
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="w-4 h-4 mr-1.5" />
                    Kopjo
                  </>
                )}
              </button>
            </div>
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