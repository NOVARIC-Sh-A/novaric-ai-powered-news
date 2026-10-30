import React, { useState } from 'react';
import { subscribeToNewsletter } from '../services/newsletterService';
import { EnvelopeIcon, InlineSpinnerIcon, CheckCircleIcon, ExclamationTriangleIcon } from './icons';

interface NewsletterSubscriptionPageProps {
  onBack: () => void;
  onSubscriptionSuccess: () => void;
}

export const NewsletterSubscriptionPage: React.FC<NewsletterSubscriptionPageProps> = ({ onBack, onSubscriptionSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Ju lutemi, shkruani një adresë emaili.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await subscribeToNewsletter(email);
      setSuccess("Abonimi u krye me sukses! Faleminderit.");
      setEmail('');
      // You can uncomment the line below if you want to automatically redirect the user
      // setTimeout(onSubscriptionSuccess, 2000); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ndodhi një gabim i panjohur.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl text-center">
        <EnvelopeIcon className="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400 mb-4" />
        <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-slate-100">Abonohu te Buletini Javor</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Merrni çdo javë përmbledhjen e kuruar të lajmeve dhe analizave më të rëndësishme direkt në email-in tuaj.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 text-base border-2 border-slate-300/50 dark:border-slate-600/50 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 dark:bg-slate-700/80 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            placeholder="Adresa juaj e email-it"
            required
            disabled={isLoading}
            aria-label="Adresa e email-it për abonim"
          />
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full flex items-center justify-center px-6 py-3 font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <InlineSpinnerIcon className="w-5 h-5 mr-2" />
                Duke u abonuar...
              </>
            ) : (
              'Abonohu Tani'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-sm" role="alert">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded-md text-sm" role="alert">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        <div className="mt-8">
            <button
                onClick={onBack}
                className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
            >
                Kthehu Pas
            </button>
        </div>
      </div>
    </main>
  );
};
