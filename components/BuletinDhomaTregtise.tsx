

import React from 'react';
import { BriefcaseIcon, ShieldCheckIcon, ScaleIcon, ShareIcon, LightBulbIcon, DocumentTextIcon, CheckCircleIcon } from './icons';
import { renderWithSuperscript } from '../utils/textUtils';

interface BuletinDhomaTregtiseProps {
  onBack: () => void;
  title: string;
  description: string;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-primary-500/30">{renderWithSuperscript(title)}</h2>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-justify">
            {children}
        </div>
    </section>
);

const GuidePoint: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-yellow-50 dark:bg-yellow-900/40 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700">
        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1 flex items-center">
            <LightBulbIcon className="w-5 h-5 mr-2" />
            {title}
        </h4>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">{children}</p>
    </div>
);


export const BuletinDhomaTregtise: React.FC<BuletinDhomaTregtiseProps> = ({ onBack, title, description }) => {

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('Linku i buletinit u kopjua në clipboard!');
        } catch (err) {
            console.error('Could not copy URL: ', err);
            alert('Dështoi kopjimi i linkut.');
        }
    } else {
        alert('Shpërndarja nuk mbështetet. Ju lutem kopjoni linkun manualisht.');
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
        <div className="mb-6">
            <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition"
            >
                &larr; <span className="ml-2">Kthehu Pas</span>
            </button>
        </div>
        
        <header className="text-center mb-10">
            <BriefcaseIcon className="w-16 h-16 mx-auto text-primary-600 dark:text-primary-400 mb-2"/>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                Buletin: Mbrojtja e Integritetit të Sipërmarrjes
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                Një analizë e thirrjes së Dhomës së Tregtisë dhe Industrisë Tiranë dhe konteksti etik i medias.
            </p>
        </header>

        <Section title="Thirrja Zyrtare e Dhomës së Tregtisë dhe Industrisë Tiranë">
            <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-lg shadow-inner border-l-4 border-primary-500">
                <p className="italic">Përshëndetje të nderuar anëtarë dhe sipërmarrës të Dhomës së Tregtisë dhe Industrise Tirane,</p>
                <p className="mt-3">Kohët e fundit janë shtuar shqetësimet e shumë sipërmarrësve drejtuar institucionit tonë, të cilët janë gjendur në situata të pakëndshme të goditjeve mediatike të padrejta nga portale të ndryshme online, duke cenuar kështu figurën e sipërmarrjes dhe integritetin e tyre.</p>
                <p className="mt-3 font-semibold">Ju ftojmë të na nisni informacionin mbi rastet konkrete tuajat dhe portalin i cili ju ka cenuar në veprimtarinë tuaj të përditshme.</p>
                <p className="mt-3">Bazuar në informacionet që do të na dërgoni, Dhoma e Tregtisë dhe Industrisë Tiranë do të ndërmarrë hapa konkrete për të vënë në lëvizje institucionet përgjegjëse dhe për sensibilizimin e opinionit publik.</p>
                <p className="mt-3">Mbetemi në pritje të këtij informacioni deri në datën 30 Gusht.</p>
                <p className="mt-3">Faleminderit për kohën dhe besimin!</p>
            </div>
        </Section>

        <Section title="Analiza Editoriale e NOVARIC®: Pse Kjo Nismë Është Thelbësore">
             <div className="space-y-6">
                <div className="flex items-start">
                    <ShieldCheckIcon className="w-12 h-12 mr-4 text-green-500 flex-shrink-0"/>
                    <div>
                        <h3 className="font-semibold text-lg">Dekonstruksioni i 'Gjobëvënies Mediatike' dhe Pasojat e Saj</h3>
                        <p>Thirrja e DhTIRANE vë gishtin në një nga plagët më të rënda të peizazhit mediatik: përdorimin e portaleve si mjet presioni ndaj biznesit. Ky fenomen jo vetëm që anashkalon çdo parim etik, por ka pasoja të thella ekonomike dhe sociale:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li><strong>Dëmton Konkurrencën e Ndershme:</strong> Krijon një mjedis ku suksesin nuk e përcakton merita, por aftësia për t'iu shmangur sulmeve mediatike.</li>
                                <li><strong>Frenon Investimet:</strong> Një klimë biznesi ku reputacioni mund të shkatërrohet brenda natës pa asnjë bazë faktike është toksike për investitorët vendas dhe të huaj.</li>
                                <li><strong>Gërryen Besimin Publik:</strong> Kur media përdoret si armë, ajo humbet besimin e publikut, duke dëmtuar edhe ato pak media profesionale që përpiqen të bëjnë një punë të ndershme.</li>
                            </ul>
                        </p>
                    </div>
                </div>
                <div className="flex items-start">
                     <ScaleIcon className="w-12 h-12 mr-4 text-blue-500 flex-shrink-0"/>
                    <div>
                        <h3 className="font-semibold text-lg">Konteksti Etik dhe Standardet Evropiane</h3>
                        <p>Në përputhje me standardet e reja të Bashkimit Evropian si Akti i Shërbimeve Dixhitale (DSA), mediat kanë një përgjegjësi të shtuar për transparencë dhe luftimin e dezinformimit. Praktika të tilla si publikimi i artikujve pa verifikim, pa i dhënë palës tjetër të drejtën e përgjigjes dhe pa ndarë qartësisht faktin nga opinioni, janë shkelje flagrante të këtyre parimeve. Nisma e DhTIRANE është një hap i domosdoshëm vetërregullues nga ana e komunitetit të biznesit aty ku mekanizmat ligjorë dhe etikë të medias dështojnë.</p>
                    </div>
                </div>
            </div>
        </Section>

        <Section title="Si të Identifikoni një Sulm Mediatik të Padrejtë?">
            <div className="space-y-4">
                <GuidePoint title="1. Mungesa e të Drejtës së Përgjigjes">
                    Gazetaria profesionale kërkon gjithmonë që pala e akuzuar të ketë mundësinë të japë versionin e saj. Nëse një artikull kritik publikohet pa asnjë përpjekje për t'ju kontaktuar, ky është një flamur i kuq.
                </GuidePoint>
                <GuidePoint title="2. Presioni për Reklamim ose Pagesa">
                    Nëse sulmet mediatike fillojnë ose intensifikohen pasi keni refuzuar një ofertë për reklamim, bashkëpunim apo pagesë tjetër, ka shumë gjasa që artikujt të jenë të motivuar nga interesi financiar dhe jo nga interesi publik.
                </GuidePoint>
                <GuidePoint title="3. Mungesa e Provave dhe Gjuha Sensacionaliste">
                    Artikujt shpifës rrallëherë bazohen në fakte të verifikueshme. Ata përdorin tituj bombastikë, gjuhë denigruese dhe akuza të përgjithshme pa ofruar asnjë dokument, dëshmi apo burim konkret për të mbështetur pretendimet.
                </GuidePoint>
                <GuidePoint title="4. Mungesa e Transparencës së Medias">
                    Kushtojini vëmendje vetë portalit. A ka ai një adresë fizike, një numër kontakti, emra të redaktorëve dhe gazetarëve? Portalet 'fantazmë' që operojnë në anonimitet janë shpesh mjetet e preferuara për këtë lloj aktiviteti.
                </GuidePoint>
            </div>
        </Section>

         <Section title="Kuadri Ligjor dhe Etik në Shqipëri">
             <div className="flex items-start">
                <DocumentTextIcon className="w-10 h-10 mr-4 text-gray-500 flex-shrink-0"/>
                <div>
                    <p>Ndonëse zbatimi i ligjit mbetet sfidë, bizneset nuk janë pa mbrojtje. <strong>Kodi Civil i Republikës së Shqipërisë</strong> parashikon mbrojtjen nga shpifja dhe fyerja, duke i dhënë palës së dëmtuar të drejtën të kërkojë dëmshpërblim. Gjithashtu, <strong>Kodi i Etikës së Medias Shqiptare</strong>, i miratuar nga shumica e organizatave të gazetarëve, përcakton qartë parimet e saktësisë, paanshmërisë dhe të drejtës së përgjigjes, të cilat shkelen sistematikisht në rastet e 'gjobëvënies'.</p>
                </div>
            </div>
        </Section>

        <Section title="Strategjia Proaktive: Përdorni NOVARIC® për të Kundërshtuar Dezinformimin">
            <div className="space-y-6">
                <div className="flex items-start">
                    <ShieldCheckIcon className="w-12 h-12 mr-4 text-green-500 flex-shrink-0"/>
                    <div>
                        <h3 className="font-semibold text-lg">Krijoni një Kundër-Narrativë të Bazuar në Fakte</h3>
                        <p>Përballë një sulmi mediatik të padrejtë, reagimi më i fuqishëm është një kundërpërgjigje e bazuar në fakte dhe objektivitet. {renderWithSuperscript('NOVARIC®')} ju ofron një mjet të fuqishëm për të krijuar një analizë të paanshme nga një palë e tretë, e cila mund të përdoret për të mbrojtur reputacionin tuaj.</p>
                        <p className="mt-4 font-semibold">Udhëzues i shpejtë:</p>
                        <ol className="list-decimal list-inside mt-2 space-y-2">
                            <li><strong>Mblidhni Përmbajtjen:</strong> Kopjoni tekstin e plotë të artikullit shpifës.</li>
                            <li><strong>Analizojeni me {renderWithSuperscript('NOVARIC®')}:</strong> Kthehuni te faqja kryesore dhe ngjisni tekstin në kutinë e verifikimit të fakteve.</li>
                            <li><strong>Gjeneroni Raportin:</strong> Mjeti ynë i AI do të kryejë një analizë të thelluar, duke identifikuar pretendimet, duke vlerësuar tonin dhe duke ofruar një verdikt objektiv.</li>
                            <li><strong>Përdorni Rezultatin:</strong> Raportin e gjeneruar mund ta përdorni si një kundërpërgjigje zyrtare në kanalet tuaja të komunikimit, në media sociale, apo edhe si material mbështetës në hapat ligjorë. Ai tregon se pretendimet kundër jush janë analizuar nga një platformë e pavarur dhe janë gjetur të pabaza.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </Section>

        <section className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-center mb-4">Thirrje për Veprim dhe Udhëzime</h2>
            <div className="bg-primary-50 dark:bg-primary-900/40 p-6 rounded-lg">
                <p className="text-lg mb-4 text-center">{renderWithSuperscript('NOVARIC®')} mbështet plotësisht këtë nismë dhe fton të gjithë sipërmarrësit e prekur të dërgojnë rastet e tyre pranë DhTIRANE. Për ta bërë këtë proces sa më efektiv, sugjerojmë të përfshini:</p>
                <ul className="list-none space-y-2 mb-6 max-w-md mx-auto">
                    <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2 text-green-500"/>Linku i artikullit/portalit.</li>
                    <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2 text-green-500"/>Pamje ekrani (screenshot) të artikullit.</li>
                    <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2 text-green-500"/>Një përshkrim i shkurtër i kontekstit.</li>
                    <li className="flex items-center"><CheckCircleIcon className="w-5 h-5 mr-2 text-green-500"/>Çdo komunikim tjetër relevant.</li>
                </ul>
                <div className="text-center bg-white dark:bg-slate-800 p-4 rounded shadow-sm inline-block mx-auto">
                    <p className="font-bold">Ornela Gaçe</p>
                    <p>Drejtore e Eventeve & B2B.</p>
                    <p className="mt-2"><a href="mailto:ornela_gace@cci.al" className="text-primary-600 dark:text-primary-400 hover:underline">ornela_gace@cci.al</a></p>
                    <p><a href="tel:+355682092858" className="text-primary-600 dark:text-primary-400 hover:underline">+355 682092858</a></p>
                    <p><a href="http://www.cci.al" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">www.cci.al</a></p>
                </div>
                <p className="text-sm mt-4 text-center text-slate-500 dark:text-slate-400">Afati i fundit për dërgimin e informacionit: <strong>30 Gusht</strong></p>
            </div>
        </section>

        <div className="mt-12 text-center space-y-4">
             <button
                onClick={handleShare}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-md transition-colors"
             >
                <ShareIcon className="w-5 h-5 mr-2" />
                Shpërndaje këtë Buletin
             </button>
        </div>

      </div>
    </main>
  );
};