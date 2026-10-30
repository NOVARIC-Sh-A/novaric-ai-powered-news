

import React from 'react';
import { renderWithSuperscript } from '../utils/textUtils';
import { SearchAppearanceCard } from './SearchAppearanceCard';
import { CANONICAL_URL, DEFAULT_SEO_IMAGE_URL } from '../config/constants';


interface BrandGuidelinesProps {
  onBack: () => void;
}

const ColorSwatch: React.FC<{ name: string; hex: string; className: string }> = ({ name, hex, className }) => (
    <div className="flex flex-col items-center text-center">
        <div className={`w-24 h-24 rounded-lg shadow-md border-2 border-slate-300 dark:border-slate-600 ${className}`}></div>
        <p className="mt-2 font-semibold text-slate-800 dark:text-slate-200">
            {renderWithSuperscript(name)}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">{hex}</p>
    </div>
);

export const BrandGuidelines: React.FC<BrandGuidelinesProps> = ({ onBack }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
        <h1 className="text-3xl font-bold mb-4 text-center text-primary-700 dark:text-primary-500">Udhëzimet e Përdorimit të Brandit NOVARIC<sup>®</sup></h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">Përditësuar më: 16 Qershor, 2024</p>
        
        <p className="text-lg text-center mb-10">Këto udhëzime ndihmojnë partnerët tanë dhe median të përdorin asetet e brandit tonë në mënyrë korrekte. Duke përdorur asetet e NOVARIC<sup>®</sup>, ju pranoni të ndiqni këto rregulla dhe bini dakord që përdorimi juaj nuk do të cenojë, dëmtojë ose diskreditojë brandin tonë.</p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-slate-300 dark:border-slate-600">1. Logoja Jonë</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 bg-slate-100 dark:bg-slate-700 p-6 rounded-lg">
                 <img 
                    src="https://novaric.co/wp-content/uploads/2025/07/NOVARIC-Logos_Master-WB-R_12062025_500x500.webp" 
                    alt="NOVARIC® Logo" 
                    className="h-24 w-auto"
                 />
            </div>
            <div>
              <p className="mb-3">Logoja e NOVARIC<sup>®</sup> është aseti më i identifikueshëm i brandit tonë. Ajo duhet të përdoret në mënyrë konsistente dhe të mos ndryshohet.</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Hapësira e Sigurt:</strong> Ruani një hapësirë të pastër rreth logos, të barabartë me gjysmën e lartësisë së saj, për të siguruar vizibilitet.</li>
                <li><strong>Përmasat Minimale:</strong> Për përdorim dixhital, logoja nuk duhet të jetë më e vogël se 40 pikselë në lartësi.</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
             <h3 className="text-xl font-semibold mb-3">Rregullat e Përdorimit të Logos</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-green-50 dark:bg-green-900/40 p-3 rounded-lg border border-green-200 dark:border-green-700">
                    <strong className="text-green-800 dark:text-green-300 block mb-1">Çfarë të bëni:</strong>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Përdorni logon zyrtare nga burimet tona.</li>
                        <li>Siguroni kontrast të mjaftueshëm me sfondin.</li>
                        <li>Mbani raportet origjinale të logos.</li>
                    </ul>
                </div>
                 <div className="bg-red-50 dark:bg-red-900/40 p-3 rounded-lg border border-red-200 dark:border-red-700">
                    <strong className="text-red-800 dark:text-red-300 block mb-1">Çfarë të shmangni:</strong>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Mos e shtrini ose shtypni logon.</li>
                        <li>Mos i ndryshoni ngjyrat e logos.</li>
                        <li>Mos shtoni efekte si hije ose konture.</li>
                        <li>Mos e vendosni logon në sfonde të ngarkuara.</li>
                    </ul>
                </div>
             </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-slate-300 dark:border-slate-600">2. Paleta e Ngjyrave</h2>
          <p className="mb-6">Ngjyrat tona kryesore janë e kuqja NOVARIC<sup>®</sup>, Process Cyan, e zeza dhe e bardha. Ato duhet të dominojnë në çdo material vizual.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 place-items-center">
              <ColorSwatch name="NOVARIC® E Kuqe" hex="#e4191e" className="bg-primary-500" />
              <ColorSwatch name="Process Cyan" hex="#49c0ef" className="bg-process-cyan" />
              <ColorSwatch name="E Zezë" hex="#1a1a1a" className="bg-black" />
              <ColorSwatch name="E Bardhë" hex="#FFFFFF" className="bg-white" />
              <ColorSwatch name="Gri e Lehtë" hex="#f1f5f9" className="bg-slate-100" />
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-slate-300 dark:border-slate-600">3. Tipografia</h2>
          <p className="mb-4">Ne përdorim fonte të pastra, moderne dhe shumë të lexueshme sans-serif për të siguruar që përmbajtja jonë të jetë e aksesueshme dhe e qartë në të gjitha platformat. Përdorimi konsistent i tipografisë është thelbësor për identitetin tonë vizual.</p>
          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
            <p className="text-4xl font-bold">Titujt duhet të jenë të fortë dhe të qartë.</p>
            <p className="mt-2 text-lg">Teksti i trupit duhet të jetë i lexueshëm dhe i ajrosur, duke përdorur madhësi dhe hapësirë të përshtatshme për lexim të lehtë.</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-slate-300 dark:border-slate-600">4. Toni i Zërit</h2>
          <p className="mb-4">Komunikimi ynë duhet të jetë gjithmonë:</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Autoritar dhe i Besueshëm:</strong> Ne flasim me siguri, të mbështetur në fakte dhe analiza rigoroze.</li>
            <li><strong>I Qartë dhe Konciz:</strong> Ne shmangim zhargonin dhe shprehemi thjesht e drejtpërdrejt.</li>
            <li><strong>I Paanshëm dhe Objektiv:</strong> Ne raportojmë faktet pa favorizuar asnjë palë dhe pa shprehur opinion personal.</li>
            <li><strong>Profesional dhe Respektues:</strong> Ne mbajmë një standard të lartë profesionalizmi në të gjitha ndërveprimet tona.</li>
          </ul>
        </section>

        <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-slate-300 dark:border-slate-600">5. Paraqitja në Media Sociale dhe Kërkim</h2>
            <p className="mb-4">Kur ndani linqe nga platforma jonë, është e rëndësishme që paraqitja të jetë konsistente me brandin tonë. Të gjitha faqet e ndara do të shfaqin logon tonë zyrtare si imazh thumbnail për të siguruar njohje të menjëhershme.</p>
            <p className="mb-6">Më poshtë është një shembull se si një link i ndarë nga faqja jonë do të dukej në rezultatet e kërkimit:</p>
            <div className="flex justify-center">
                <SearchAppearanceCard
                    title="NOVARIC® Lajme me IA | Shqipëri"
                    url={CANONICAL_URL}
                    date="10 Prill, 2019"
                    description="Në një realitet ku etika dhe morali janë zbehur, ndërsa korrupsioni, paaftësia dhe manipulimi tolerohen, NOVARIC® AI-Powered News Fact Check lind si një..."
                    logoUrl={DEFAULT_SEO_IMAGE_URL}
                    thumbnailUrl="https://novaricstorage.blob.core.windows.net/media/NOVARIC_Hex_Red.png"
                />
            </div>
        </section>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">6. Kontakt</h2>
          <p>Për pyetje specifike në lidhje me përdorimin e brandit NOVARIC<sup>®</sup>, ose për të kërkuar versione me rezolucion të lartë të logos sonë, ju lutemi kontaktoni ekipin tonë të medias në: <a href="mailto:press@media.novaric.al" className="text-primary-600 dark:text-primary-400 hover:underline">press@media.novaric.al</a></p>
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