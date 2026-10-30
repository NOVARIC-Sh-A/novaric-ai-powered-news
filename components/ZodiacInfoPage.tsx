import React, { useState, useEffect } from 'react';
import { 
    AriesIcon, TaurusIcon, GeminiIcon, CancerIcon, LeoIcon, VirgoIcon, LibraIcon, 
    ScorpioIcon, SagittariusIcon, CapricornIcon, AquariusIcon, PiscesIcon, ArrowPathIcon 
} from './icons';

interface ZodiacInfoPageProps {
  onBack: () => void;
}

const zodiacData = [
  { id: "dashi", name: "Dashi", dates: "21 Mars - 19 Prill", symbol: <AriesIcon />, description: "Arketipi i Luftëtarit dhe Pionierit. Dashi përfaqëson guximin, iniciativën dhe një dëshirë të pastër për të vepruar. Energjia e tij është impulsive dhe e drejtpërdrejtë, duke e bërë atë një lider të lindur që nuk ka frikë të marrë përsipër sfida të reja. Sfida e Dashit është të kultivojë durimin dhe të kanalizojë energjinë e tij të vrullshme në mënyrë konstruktive, pa u djegur." },
  { id: "demi", name: "Demi", dates: "20 Prill - 20 Maj", symbol: <TaurusIcon />, description: "Arketipi i Ndërtuesit dhe Artistit. Demi është i lidhur me botën materiale, stabilitetin dhe kënaqësitë sensuale. Ai vlerëson sigurinë, bukurinë dhe këmbënguljen. I qetë dhe praktik, Demi ka një aftësi të jashtëzakonshme për të sjellë ide në formë konkrete. Sfida e tij është të përqafojë ndryshimin dhe të shmangë kokëfortësinë që mund ta pengojë rritjen." },
  { id: "binjaket", name: "Binjakët", dates: "21 Maj - 20 Qershor", symbol: <GeminiIcon />, description: "Arketipi i Komunikuesit dhe Mësuesit. Binjakët drejtohen nga kurioziteti dhe dëshira për të lidhur ide dhe njerëz. Ata janë të adaptueshëm, socialë dhe intelektualë, gjithmonë në kërkim të informacionit të ri. Energjia e tyre është e shpejtë dhe e gjithanshme. Sfida për Binjakët është të gjejnë thellësi dhe fokus mes interesave të tyre të shumta." },
  { id: "gaforrja", name: "Gaforrja", dates: "21 Qershor - 22 Korrik", symbol: <CancerIcon />, description: "Arketipi i Kujdestarit dhe Historianit. Gaforrja është thellësisht e lidhur me botën emocionale, familjen dhe të kaluarën. Ajo është mbrojtëse, intuitive dhe empatike, duke krijuar hapësira të sigurta për të tjerët. Energjia e saj ushqen dhe ruan. Sfida e Gaforres është të vendosë kufij të shëndetshëm dhe të mos mbetet peng i nostalgjisë." },
  { id: "luani", name: "Luani", dates: "23 Korrik - 22 Gusht", symbol: <LeoIcon />, description: "Arketipi i Mbretit dhe Artistit. Luani përfaqëson vetë-shprehjen, kreativitetin dhe zemërgjerësinë. I udhëhequr nga zemra, ai kërkon të shkëlqejë dhe të frymëzojë të tjerët me ngrohtësinë dhe karizmën e tij. Energjia e tij është e ndritshme dhe plot vetëbesim. Sfida e Luanit është të balancojë krenarinë me përulësinë dhe të njohë vlerën e të tjerëve." },
  { id: "virgjeresha", name: "Virgjëresha", dates: "23 Gusht - 22 Shtator", symbol: <VirgoIcon />, description: "Arketipi i Shëruesit dhe Artizanit. Virgjëresha është e përkushtuar ndaj përmirësimit, shërbimit dhe kërkimit të përsosmërisë. Ajo është analitike, praktike dhe e vëmendshme ndaj detajeve, me një aftësi të lindur për të rregulluar atë që është e prishur. Sfida e saj është të lirojë nevojën për kontroll dhe të pranojë bukurinë e papërsosmërisë." },
  { id: "peshorja", name: "Peshorja", dates: "23 Shtator - 22 Tetor", symbol: <LibraIcon />, description: "Arketipi i Diplomatit dhe Gjykatësit. Peshorja kërkon harmoni, drejtësi dhe ekuilibër në të gjitha marrëdhëniet. Ajo është sociale, artistike dhe e paanshme, me një aftësi të theksuar për të parë të gjitha anët e një situate. Energjia e saj ndërton ura dhe kërkon partneritet. Sfida e Peshores është të marrë vendime pa hezitim dhe të mos sakrifikojë nevojat e veta për hir të paqes." },
  { id: "akrepi", name: "Akrepi", dates: "23 Tetor - 21 Nëntor", symbol: <ScorpioIcon />, description: "Arketipi i Magjistarit dhe Detektivit. Akrepi është i lidhur me thellësitë, transformimin dhe misteret e jetës. Ai është intensiv, pasionant dhe afronues, me një aftësi për të parë përtej sipërfaqes dhe për të zbuluar të vërtetën e fshehur. Sfida e tij është të menaxhojë intensitetin e tij emocional dhe të mësojë të falë e të lirojë." },
  { id: "shigjetari", name: "Shigjetari", dates: "22 Nëntor - 21 Dhjetor", symbol: <SagittariusIcon />, description: "Arketipi i Eksploruesit dhe Filozofit. Shigjetari drejtohet nga një kërkim i pafund për kuptim, dije dhe aventurë. Ai është optimist, i sinqertë dhe me shpirt të lirë, gjithmonë duke zgjeruar horizontet e tij fizike dhe mendore. Sfida e tij është të përkthejë idealizmin në veprime praktike dhe të mos i shmanget angazhimeve." },
  { id: "bricjapi", name: "Bricjapi", dates: "22 Dhjetor - 19 Janar", symbol: <CapricornIcon />, description: "Arketipi i Arkitektit dhe Mjeshtrit. Bricjapi përfaqëson ambicien, disiplinën dhe ndërtimin e strukturave të qëndrueshme. Ai është i përgjegjshëm, i durueshëm dhe i orientuar drejt qëllimeve afatgjata, duke kuptuar vlerën e punës së palodhur. Sfida e tij është të balancojë ambicien me pushimin dhe të lejojë veten të jetë i cenueshëm." },
  { id: "ujori", name: "Ujori", dates: "20 Janar - 18 Shkurt", symbol: <AquariusIcon />, description: "Arketipi i Revolucionarit dhe Humanistit. Ujori është i orientuar drejt së ardhmes, idealizmit dhe kolektivit. Ai është inovativ, i pavarur dhe mendjehapur, i përkushtuar ndaj progresit shoqëror dhe ideve jokonvencionale. Sfida e tij është të lidhet emocionalisht me individët dhe jo vetëm me idealet, duke balancuar logjikën me ndjenjën." },
  { id: "peshqit", name: "Peshqit", dates: "19 Shkurt - 20 Mars", symbol: <PiscesIcon />, description: "Arketipi i Mistikës dhe Poetit. Peshqit janë të lidhur me botën e padukshme, ëndrrat dhe unitetin universal. Ata janë empatikë, imagjinativë dhe shpirtërorë, me një aftësi të thellë për të ndjerë emocionet e të tjerëve. Energjia e tyre është fluide dhe e mëshirshme. Sfida e Peshqve është të mbeten të ankoruar në realitet pa humbur lidhjen me intuitën e tyre." },
];

const ZodiacCard: React.FC<typeof zodiacData[0]> = ({ id, name, dates, symbol, description }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      id={id} 
      className="card-container h-full scroll-mt-24" 
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ minHeight: '350px' }}
      role="button"
      tabIndex={0}
      aria-label={`Shiko më shumë për shenjën ${name}`}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && setIsFlipped(!isFlipped)}
    >
      <div className={`card ${isFlipped ? 'is-flipped' : ''}`}>
        {/* Card Front */}
        <div className="card-face card-front bg-white/50 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-lg shadow-lg border border-white/20 dark:border-slate-700/50 flex flex-col items-center justify-center text-center">
          <div className="text-primary-600 dark:text-primary-400 mb-4">{React.cloneElement(symbol, { className: "w-20 h-20" })}</div>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{name}</h3>
          <p className="text-md font-semibold text-slate-500 dark:text-slate-400 mt-1">{dates}</p>
          <div className="absolute bottom-4 text-xs text-slate-400 dark:text-slate-500 flex items-center">
            <ArrowPathIcon className="w-4 h-4 mr-1"/>
            <span>Kliko për përshkrimin</span>
          </div>
        </div>
        {/* Card Back */}
        <div className="card-face card-back bg-white/50 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-lg shadow-lg border border-white/20 dark:border-slate-700/50 flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-3">{name}</h3>
          <div className="flex-grow overflow-y-auto">
             <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                {description}
            </p>
          </div>
           <div className="absolute bottom-4 text-xs text-slate-400 dark:text-slate-500 flex items-center mt-4">
            <ArrowPathIcon className="w-4 h-4 mr-1"/>
            <span>Kliko për t'u kthyer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ZodiacInfoPage: React.FC<ZodiacInfoPageProps> = ({ onBack }) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const fadeEnd = 200; // The scroll position where the fade-out completes
      const newOpacity = Math.max(0, 1 - scrollPosition / fadeEnd);
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 
            className="text-4xl sm:text-5xl font-extrabold text-white mb-4 transition-opacity duration-200" 
            style={{ textShadow: '2px 2px #dc2626, 4px 4px #1a1a1a', opacity: opacity }}
          >
            Një Udhëzues Filozofik për Shenjat e Zodiakut
          </h1>
          <div className="max-w-3xl mx-auto p-6 bg-white/60 dark:bg-slate-800/80 backdrop-blur-2xl rounded-xl shadow-inner border border-white/20">
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-justify">
                Në një botë komplekse dhe shpesh kaotike, njerëzit gjithmonë kanë kërkuar sisteme për të kuptuar veten dhe vendin e tyre në univers. Ndërsa astrologjia nuk është një shkencë ekzakte, shenjat e Zodiakut ofrojnë një gjuhë të pasur simbolike dhe një strukturë arketipash që mund të shërbejnë si një mjet i fuqishëm për vetë-reflektim.
              </p>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed mt-4 text-justify">
                Perspektiva jonë këtu nuk është parashikuese apo fataliste. Përkundrazi, ne i shohim shenjat e Zodiakut si një pasqyrë e energjive themelore dhe modeleve psikologjike që ekzistojnë brenda secilit prej nesh, të frymëzuar nga psikologjia e Karl Jungut. Çdo shenjë përfaqëson një arketip—një model universal i sjelljes dhe personalitetit—që na ndihmon të eksplorojmë pikat tona të forta, sfidat dhe potencialin tonë të fshehur.
              </p>
               <p className="text-slate-800 dark:text-slate-200 leading-relaxed mt-4 text-justify">
                Përdoreni këtë udhëzues jo për të përcaktuar fatin, por për të ndezur kuriozitetin rreth asaj se kush jeni dhe për të ndërtuar një narrativë më të thellë rreth jetës suaj.
              </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {zodiacData.map(sign => (
            <ZodiacCard key={sign.name} {...sign} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition"
            aria-label="Kthehu Pas"
          >
            &larr; Kthehu Pas
          </button>
        </div>
      </div>
    </main>
  );
};