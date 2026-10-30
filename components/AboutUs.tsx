import React from 'react';

interface AboutUsProps {
  onBack: () => void;
  onNavigateToAnalysisMethodology: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onBack, onNavigateToAnalysisMethodology }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary-700 dark:text-primary-500">Misioni i NOVARIC<sup>®</sup> AI-Powered News Fact Check</h1>

        <p className="mb-4">Në një realitet ku etika dhe morali janë zbehur, ndërsa korrupsioni, paaftësia dhe manipulimi tolerohen, NOVARIC<sup>®</sup> AI-Powered News Fact Check lind si një nevojë urgjente për ndërgjegjësim qytetar dhe institucional.</p>
        <p className="mb-6">Shumë e njohin të keqen, por ndihen të pafuqishëm për ta përballuar. Kjo ka çuar në normalizimin e sjelljeve të gabuara që dëmtojnë shoqërinë në çdo nivel.</p>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">NOVARIC<sup>®</sup> AI-Powered Fact Check synon të ndërtojë një platformë të besueshme që:</h2>
            <ul className="list-none space-y-3">
                <li className="flex items-start">
                    <span className="text-3xl mr-3 leading-tight" aria-hidden="true">🦉</span>
                    <span className="flex-1">Identifikon shkeljet dhe devijimet përmes fakteve të verifikuara dhe të dhënave konkrete.</span>
                </li>
                <li className="flex items-start">
                    <span className="text-3xl mr-3 leading-tight" aria-hidden="true">⚠️</span>
                    <span className="flex-1">Shërben si pikë referimi për individë e institucione që ndjekin rrugë të gabuara.</span>
                </li>
                <li className="flex items-start">
                    <span className="text-3xl mr-3 leading-tight" aria-hidden="true">🎯</span>
                    <span className="flex-1">Rikthen përgjegjësinë në qendër të komunikimit publik.</span>
                </li>
                <li className="flex items-start">
                    <span className="text-3xl mr-3 leading-tight" aria-hidden="true">🏋️‍♀️</span>
                    <span className="flex-1">Fuqizon qytetarët me informim të saktë dhe të paanshëm.</span>
                </li>
            </ul>
        </section>

        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">Çfarë ofron platforma?</h2>
            <ul className="list-none space-y-3">
                <li className="flex items-start">
                    <span className="text-2xl mr-3 leading-tight" aria-hidden="true">✅</span>
                    <span className="flex-1">Artikuj të verifikuar me etiketime të qarta (e vërtetë, gjysmë e vërtetë, etj.)</span>
                </li>
                <li className="flex items-start">
                    <span className="text-2xl mr-3 leading-tight" aria-hidden="true">✅</span>
                    <span className="flex-1">Analiza të keqinformimit dhe shkeljeve etike</span>
                </li>
                <li className="flex items-start">
                    <span className="text-2xl mr-3 leading-tight" aria-hidden="true">📊</span>
                    <span className="flex-1">Infografikë dhe udhëzues edukues</span>
                </li>
                <li className="flex items-start">
                    <span className="text-2xl mr-3 leading-tight" aria-hidden="true">⚖️</span>
                    <span className="flex-1">Komente të balancuara mbi të dhëna zyrtare</span>
                </li>
            </ul>
        </section>

        <section className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-3 text-center text-slate-800 dark:text-slate-100">Angazhimi ynë ndaj Standardeve Evropiane</h2>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-4">
                Puna jonë udhëhiqet nga parimet e akteve rregullatore të Bashkimit Evropian si Akti i Shërbimeve Dixhitale (DSA) dhe Akti Evropian i Lirisë së Medias (EMFA). E gjithë kjo mbështetet nga angazhimi ynë i palëkundur ndaj parimeve të përcaktuara në "Kodin e Standardeve NOVARIC®". Për të kuptuar më thellë angazhimin tonë, ju ftojmë të lexoni dokumentin tonë të plotë të politikave.
            </p>
            <div className="text-center">
                <button
                    onClick={onNavigateToAnalysisMethodology}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition-colors"
                >
                    Lexo Kornizën e Përgjegjësisë
                </button>
            </div>
        </section>
        
        <p className="text-xl font-semibold text-center mt-10 text-slate-800 dark:text-slate-100">'NOVARIC<sup>®</sup> AI-Powered News Fact Check' ngre standardin – për një Shqipëri më të vetëdijshme, të drejtë dhe të informuar.</p>

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