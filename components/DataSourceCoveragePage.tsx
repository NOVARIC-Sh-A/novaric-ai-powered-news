

import React from 'react';

interface DataSourceCoveragePageProps {
  onBack: () => void;
}

export const DataSourceCoveragePage: React.FC<DataSourceCoveragePageProps> = ({ onBack }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary-700 dark:text-primary-500">Burimi i të Dhënave dhe Mbulimi i Rrjetit</h1>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
          NOVARIC<sup>®</sup> beson në transparencën e plotë si gur themeli i besueshmërisë. Kjo faqe detajon burimet e të dhënave dhe shtrirjen e rrjetit tonë analitik, të cilat na mundësojnë të arrijmë objektivat tona kërkimore dhe analitike.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100">
            Burimet e të Dhënave
          </h2>
          <p className="mb-4">
            Për të siguruar një analizë gjithëpërfshirëse dhe të shumëanshme, ne mbështetemi në një gamë të gjerë burimesh të verifikuara:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-2xl mr-3 leading-tight" aria-hidden="true">🏛️</span>
              <div>
                <strong className="font-semibold block">Të Dhëna Publike dhe Zyrtare</strong>
                <span>Publikime qeveritare, raporte zyrtare, baza të dhënash ligjore, procesverbale parlamentare dhe të dhëna nga institucione të pavarura.</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3 leading-tight" aria-hidden="true">📰</span>
              <div>
                <strong className="font-semibold block">Arkiva Mediatike</strong>
                <span>Artikuj lajmesh historikë, transmetime dhe arkiva dixhitale nga media të besueshme kombëtare dhe ndërkombëtare.</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3 leading-tight" aria-hidden="true">📡</span>
              <div>
                <strong className="font-semibold block">Monitorim Online në Kohë Reale</strong>
                <span>Monitorim i vazhdueshëm i faqeve të lajmeve, platformave të mediave sociale dhe forumeve publike për të kapur narrativat dhe pretendimet në zhvillim.</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3 leading-tight" aria-hidden="true">🎓</span>
              <div>
                <strong className="font-semibold block">Baza të Dhënash Akademike dhe Kërkimore</strong>
                <span>Akses në revista akademike, punime kërkimore dhe studime nga universitete dhe institute kërkimore (think tanks).</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3 leading-tight" aria-hidden="true">📥</span>
              <div>
                <strong className="font-semibold block">Pretendime të Dorëzuara nga Përdoruesit</strong>
                <span>Pretendime të dërguara drejtpërdrejt nga përdoruesit e aplikacionit tonë për verifikim faktesh.</span>
              </div>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100">
            Mbulimi i Rrjetit Analitik
          </h2>
          <p className="mb-4">
            Analiza jonë shtrihet në tre dimensione kryesore për të ofruar një pasqyrë të plotë:
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2 text-slate-700 dark:text-slate-300">1. Mbulimi Gjeografik</h3>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>Shqipëri:</strong> Mbulim i plotë i të gjitha rajoneve, institucioneve qendrore dhe lokale.</li>
                <li><strong>Ballkani Perëndimor:</strong> Monitorim kyç i vendeve fqinje (Kosovë, Maqedoni e Veriut, Mal i Zi, Serbi).</li>
                <li><strong>Ndërkombëtar:</strong> Burimet kryesore të lajmeve dhe institucionet ndërkombëtare (BE, SHBA, etj.).</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2 text-slate-700 dark:text-slate-300">2. Mbulimi Tematik</h3>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>Politikë:</strong> Veprimet e qeverisë, proceset legjislative, aktivitetet e partive politike, zgjedhjet.</li>
                <li><strong>Ekonomi:</strong> Treguesit makroekonomikë, mjedisi i biznesit, financat publike, investimet madhore.</li>
                <li><strong>Drejtësi:</strong> Sundimi i ligjit, performanca e sistemit gjyqësor, përpjekjet kundër korrupsionit.</li>
                <li><strong>Çështje Sociale:</strong> Shëndetësia, arsimi, mjedisi, të drejtat e njeriut.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2 text-slate-700 dark:text-slate-300">3. Mbulimi Temporal</h3>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>Analizë Historike:</strong> Përdorimi i të dhënave të arkivuara për kontekst dhe analizë të tendencave afatgjata.</li>
                <li><strong>Analizë në Kohë Reale:</strong> Verifikimi i fakteve dhe raportimi për ngjarjet aktuale dhe lajmet e fundit.</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="mt-10 text-center">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Kthehu Pas"
          >
            Kthehu Pas
          </button>
        </div>
      </div>
    </main>
  );
};