import React, { useState, useEffect } from 'react';
import { renderWithSuperscript } from '../utils/textUtils';
import { NewspaperIcon, DocumentMagnifyingGlassIcon, XMarkIcon } from './icons';

interface PressReleaseNovaricVisaPageProps {
  onBack: () => void;
}

export const PressReleaseNovaricVisaPage: React.FC<PressReleaseNovaricVisaPageProps> = ({ onBack }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string } | null>(null);

  const documents = [
    {
      src: "https://novaric.co/wp-content/uploads/2025/11/Robo-puna.png",
      caption: "Miratimi i Lejes së Punës (Email) - 29 Prill 2024",
    },
    {
      src: "https://novaric.co/wp-content/uploads/2025/11/Vissa-Refusal.png",
      caption: "Njoftimi Zyrtar i Refuzimit të Vizës (Email) - 7 Maj 2024",
    },
    {
      src: "https://novaric.co/wp-content/uploads/2025/11/Visa-Payment.png",
      caption: "Fatura e Pagesës e Vizës - 03 Maj 2024",
    },
    {
      src: "https://novaric.co/wp-content/uploads/2025/11/Aplikimi.png",
      caption: "Formulari i Aplikimit për Leje Qëndrimi Unike - 20 Prill 2024",
    },
    {
      src: "https://novaric.co/wp-content/uploads/2025/11/e-visa.png",
      caption: "Statusi i Aplikimit pas Refuzimit",
    },
  ];

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <section className={`mb-8 ${className}`}>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 pb-2 border-b-2 border-primary-500/30">{title}</h2>
      <div className="space-y-4 text-slate-700 dark:text-slate-300 text-justify">
        {children}
      </div>
    </section>
  );

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="mb-6">
          <button onClick={onBack} className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition text-slate-800 dark:text-slate-200">
            &larr; <span className="ml-2">Kthehu Pas</span>
          </button>
        </div>

        <article>
          <header className="text-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
            <NewspaperIcon className="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400 mb-3" />
            <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-400">
              {renderWithSuperscript("NJOFTIM ZYRTAR PËR SHTYP I NOVARIC® Sh.A.")}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Shkodër, 26 Nëntor 2025 – ORA {currentTime}
            </p>
          </header>

          <div className="prose max-w-none dark:prose-invert">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-800 dark:text-slate-100 !mb-8">
                {renderWithSuperscript("“NUK KA BAZË LIGJORE”: NOVARIC® Sh.A. DORËZON PROVAT NË POLICI – APLIKIMI I VIZËS U MIRATUA NË FAZËN E PARË, DËSHTOI VETËM NGA VENDIMI I AUTORITETIT SHTETËROR")}
            </h2>
             <div className="space-y-6 text-slate-700 dark:text-slate-300 text-justify">
                <p>
                    Më datë 24 Nëntor 2025, administratori i {renderWithSuperscript("NOVARIC® Sh.A.")}, Dr. Alban Gj. THIKA, paraqiti pranë Njësisë së Krimeve Ekonomike të Policisë të gjitha provat zyrtare që dëshmojnë në mënyrë të plotë se kompania nuk ka kryer asnjë aktivitet të paligjshëm dhe se shërbimi i ofruar është realizuar plotësisht sipas ligjit.
                </p>
                <p>
                    {renderWithSuperscript("NOVARIC® Sh.A.")} vëren se trajtimi i kësaj çështjeje nga Njësia e Krimeve Ekonomike ka qenë disproporcional, pasi procedimi nuk lidhet me ndonjë akuzë ndaj kompanisë, por me veprimet e një shtetasi të një vendi të tretë, i cili nuk është punonjës i {renderWithSuperscript("NOVARIC® Sh.A.")} dhe nuk ka marrëdhënie pune me shoqërinë.
                </p>
                <p>
                    Në përgjigje të referimit të materialeve nga Specialistët e Hetimit të Krimeve Ekonomiko-Financiare në Drejtorinë e Policisë së Shkodrës, {renderWithSuperscript("NOVARIC® Sh.A.")} ka dorëzuar dokumentacion të pakundërshtueshëm që hedh poshtë, një e nga një, pretendimet për “Mashtrim”, “Fshehje të Ardhurash” dhe “Pastrim Parash”.
                </p>
            </div>
          </div>
          
          <Section title="Procesi i Aplikimit: Veprim i Ligjshëm, i Plotë dhe Transparencë e Plotë" className="mt-12">
              <p>I gjithë procesi administrativ për aplikimin e shtetasit nigerian Issa Muiz Adisa është kryer me korrektësi dhe përputhje të plotë me legjislacionin shqiptar. Vendimi final për mosdhënien e vizës ka ardhur nga diskrecioni sovran i Autoritetit Shtetëror—një kompetencë e pavarur, mbi të cilën kompania nuk ka asnjë ndikim dhe nuk mund të mbajë përgjegjësi ligjore.</p>
          </Section>

          <Section title="Rrëfimi Kronologjik – Faktet Që Rrëzojnë Pretendimet">
            <ol className="list-decimal list-inside space-y-4">
                <li>
                    <strong>Miratimi i Plotë i Lejes së Punës (AKPA/Puna.gov.al):</strong> Aplikimi për leje pune u miratua me sukses më 29 Prill 2024, në bazë të Nënit 74/7 të Ligjit 79/2021 “Për të Huajt”. Ky akt administrativ provon se {renderWithSuperscript("NOVARIC®")} ka kryer me sukses detyrimin për të cilin ka qenë kontraktuar. Kjo provë rrëzon çdo pretendim se shërbimi nuk është kryer.
                </li>
                <li>
                    <strong>Refuzimi i Vizës (MFA/e-Visa):</strong> Refuzimi i vizës daton 7 Maj 2024, vendim ekskluziv i Ministrisë për Evropën dhe Punët e Jashtme, në bazë të Nenit 28 të ligjit përkatës. Ky vendim është jashtë çdo kontrolli të kompanisë dhe nuk mund t’i atribuohet në asnjë mënyrë veprimeve të {renderWithSuperscript("NOVARIC® Sh.A.")}
                </li>
                <li>
                    <strong>Veprimi i Vazhdueshëm: Apelimi:</strong> {renderWithSuperscript("NOVARIC® Sh.A.")}, në përmbushje të plotë të detyrimeve ligjore dhe etike, ka kryer menjëherë apelimin e refuzimit – i provuar përmes dokumenteve bankare dhe komunikimeve zyrtare.
                </li>
            </ol>
          </Section>

          <Section title="Analiza Ligjore: Pse Akuzat Nuk Mund të Qëndrojnë">
            <ol className="list-decimal list-inside space-y-4">
                <li>
                    <strong>Mungesa e Elementit të Dashjes (Neni 143, Kodi Penal):</strong> Aplikimi i miratuar, ndjekja e procedurës dhe apelimi janë veprime që dëshmojnë zell, transparencë dhe mungesë absolute të qëllimit mashtrues. Pa dashje (intent), vepra penale e mashtrimit nuk ekziston.
                </li>
                <li>
                    <strong>Detyrimi i Mjetit, jo i Rezultatit (Kodi Civil):</strong> {renderWithSuperscript("NOVARIC® Sh.A.")} garanton shërbimet administrative (“detyrim mjeti”), jo rezultatin final të vizës (“detyrim rezultati”), i cili është prerogativë ekskluzive e autoritetit shtetëror.
                </li>
                <li>
                    <strong>Transparencë e Plotë dhe Komunikim i Vazhdueshëm:</strong> Të gjitha palët janë informuar me email në çdo hap të procesit. Kjo faktikisht përjashton elementin e “fshehjes së të ardhurave” apo “pastrimit të parave”.
                </li>
            </ol>
          </Section>

          <Section title="Parimi i Prezumimit të Pafajësisë">
            <p>Është thelbësore të theksohet se ky hap procedural është krejtësisht paraprak dhe nuk përbën, në asnjë formë, konstatim apo sugjerim të fajësisë.</p>
            <p>Sipas Kushtetutës së Republikës së Shqipërisë dhe nenit 6 të Konventës Evropiane për të Drejtat e Njeriut, çdo individ dhe subjekt juridik gëzon prezumimin e pafajësisë derisa një vendim gjyqësor i formës së prerë të thotë të kundërtën.</p>
            <p>{renderWithSuperscript("NOVARIC® Sh.A.")} mbetet besimplotë se një hetim i paanshëm dhe i plotë do të vërtetojë mungesën totale të bazës ligjore për akuzat e supozuara.</p>
          </Section>

          <Section title="Ankesë Zyrtare ndaj Policisë së Shtetit">
            <p>Për shkak të mënyrës disproporcionale dhe të pasaktë të trajtimit dhe përcjelljes së kësaj çështjeje në media, {renderWithSuperscript("NOVARIC® Sh.A.")} njofton se ka depozituar një ankesë zyrtare pranë Policisë së Shtetit dhe autoriteteve përkatëse mbikëqyrëse. Kompania kërkon sqarimin e plotë të mënyrës së komunikimit publik, respektimin e prezumimit të pafajësisë dhe evitimin e çdo forme publikimi që cenon reputacionin e një subjekti pa vendim gjyqësor.</p>
          </Section>
          
          <Section title="Dokumentet Mbështetëse">
              <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-4">
                <DocumentMagnifyingGlassIcon className="w-5 h-5 mr-2" />
                <span>Kliko mbi një imazh për ta zmadhuar.</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                  <button key={index} onClick={() => setSelectedImage(doc)} className="block relative group overflow-hidden rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-primary-500">
                    <img src={doc.src} alt={doc.caption} className="w-full h-24 object-cover object-top transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors"></div>
                    <div className="absolute inset-0 flex items-end p-2">
                      <p className="text-white text-xs font-semibold line-clamp-2" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                        {doc.caption}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
          </Section>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="font-semibold text-slate-800 dark:text-slate-100">Përfaqësuesi Ligjor,</p>
            <p className="text-slate-600 dark:text-slate-300">Dr Alban Gj. THIKA</p>
          </div>

        </article>

        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-caption"
          >
            <div className="relative max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
              <img src={selectedImage.src} alt={selectedImage.caption} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
              <p id="image-caption" className="text-center text-white mt-2 text-sm">{selectedImage.caption}</p>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-white"
                aria-label="Mbyll imazhin"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};