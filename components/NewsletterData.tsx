import React, { useEffect, useState } from 'react';
import { NEWSLETTER_JSON_URL } from "../config/constants";


interface NewsletterHighlight {
  id: string;
  claim: string;
  verdict: string;
  source: string;
  factCheckedBy: string;
}

interface Newsletter {
  title: string;
  description: string;
  highlights: NewsletterHighlight[];
}

interface NewsletterApiResponse {
  newsletter: Newsletter;
}

// FIX: Changed to a named export for consistency.
export const NewsletterData: React.FC = () => {
  const [data, setData] = useState<Newsletter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fullUrl = NEWSLETTER_JSON_URL;

    if (!fullUrl) {
      setError("Konfigurimi i URL-së së buletinit mungon. Ju lutemi, kontaktoni administratorin.");
      setIsLoading(false);
      return;
    }

    fetch(fullUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((json: NewsletterApiResponse) => {
        setData(json.newsletter);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching or parsing data.json from Azure:", err);
        setError(err.message || "Gabim gjatë ngarkimit të të dhënave.");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-slate-100">Duke ngarkuar buletinin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 text-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
        <h2 className="font-bold">Gabim gjatë ngarkimit të të dhënave:</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!data || !data.highlights) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 text-center bg-yellow-100 dark:bg-yellow-800/60 text-yellow-800 dark:text-yellow-200 rounded-lg">
         <h2 className="font-bold">Njoftim</h2>
        <p>Nuk u gjetën të dhëna për buletinin ose të dhënat janë të paplota.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-xl text-slate-800 dark:text-slate-200">
      <header className="text-center border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">{data.title}</h2>
        <p className="mt-2 text-md text-slate-600 dark:text-slate-300">{data.description}</p>
      </header>
      <ul className="space-y-6">
        {data.highlights.map((item) => (
          <li key={item.id} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg shadow-md border-l-4 border-primary-500">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Pretendimi:</p>
            <blockquote className="text-lg font-semibold mb-3 italic">"{item.claim}"</blockquote>
            <div className="space-y-1 text-sm border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
              <p><strong>Verdikti:</strong> {item.verdict}</p>
              <p><strong>Burimi:</strong> {item.source}</p>
              <p><strong>Verifikuar nga:</strong> {item.factCheckedBy}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
