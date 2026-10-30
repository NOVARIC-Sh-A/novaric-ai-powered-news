
import React from 'react';

interface NewsletterWelcomeProps {
  onBack: () => void;
}

export const NewsletterWelcome: React.FC<NewsletterWelcomeProps> = ({ onBack }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-primary-700 dark:text-primary-500">Mirë se vini në Buletinin Informativ!</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
          Faleminderit që u abanuat. Çdo javë, do të merrni në email-in tuaj një përmbledhje të kuruar me kujdes të lajmeve më të rëndësishme dhe analizave më të thelluara në Shqipëri.
        </p>
        <div className="space-y-3 text-left mb-8 text-slate-700 dark:text-slate-200">
          <p className="flex items-start"><span className="text-green-500 mr-2 mt-1">✔</span><span>Përmbledhje të verifikimeve të fakteve më me ndikim.</span></p>
          <p className="flex items-start"><span className="text-green-500 mr-2 mt-1">✔</span><span>Analiza të thelluara mbi zhvillimet politike dhe sociale.</span></p>
          <p className="flex items-start"><span className="text-green-500 mr-2 mt-1">✔</span><span>Përditësime mbi profilet e personaliteteve publike.</span></p>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Ne jemi të përkushtuar t'ju mbajmë të informuar me përmbajtje cilësore dhe të besueshme.
        </p>
        <button
          onClick={onBack}
          className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out"
          aria-label="Kthehu Pas"
        >
          Kthehu Pas
        </button>
      </div>
    </main>
  );
};
