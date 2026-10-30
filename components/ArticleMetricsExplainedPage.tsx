import React, { useState } from 'react';
import { 
    BookOpenIcon, 
    ClockIcon, 
    LightBulbIcon, 
    DocumentTextIcon, 
    AcademicCapIcon, 
    ScaleIcon, 
    CheckCircleIcon, 
    CpuChipIcon, 
    ArrowPathIcon,
    ShieldCheckIcon,
    EyeIcon,
    HeartIcon,
    CubeTransparentIcon,
    MagnifyingGlassIcon
} from './icons';
import { JsonLd } from './JsonLd';

interface ArticleMetricsExplainedPageProps {
  onBack: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToHermeneuticFramework: () => void;
}

const Section: React.FC<{ id: string; title: string; children: React.ReactNode, icon: React.ReactNode }> = ({ id, title, children, icon }) => (
    <section id={id} className="mb-12 scroll-mt-20">
        <div className="flex items-center mb-6">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full mr-4">
                {icon}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
        </div>
    </section>
);

interface MetricCardProps {
    term: string;
    definition: string;
    importance: string | React.ReactElement;
}

const MetricCard: React.FC<MetricCardProps> = ({ term, definition, importance }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="card-container h-full" onClick={() => setIsFlipped(!isFlipped)} style={{ minHeight: '220px' }}>
            <div className={`card ${isFlipped ? 'is-flipped' : ''}`}>
                {/* Card Front */}
                <div className="card-face card-front bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-5 shadow-lg rounded-xl flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{term}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2"><strong>Çfarë është?</strong><br/>{definition}</p>
                    </div>
                    <div className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center">
                        <ArrowPathIcon className="w-4 h-4 mr-1"/>
                        <span>Kliko për Rëndësinë</span>
                    </div>
                </div>
                {/* Card Back */}
                <div className="card-face card-back bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 p-5 shadow-xl rounded-xl flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold text-lg text-primary-800 dark:text-primary-200">Pse ka Rëndësi?</h4>
                        <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">{importance}</div>
                    </div>
                     <div className="text-center text-xs text-primary-400 mt-4 flex items-center justify-center">
                        <ArrowPathIcon className="w-4 h-4 mr-1"/>
                        <span>Kliko për t'u kthyer</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const ArticleMetricsExplainedPage: React.FC<ArticleMetricsExplainedPageProps> = ({ onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToHermeneuticFramework }) => {
    
    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Udhëzues i Metrikave të Artikullit | NOVARIC®",
      "author": { "@type": "Person", "name": "Dr Alban Gj. THIKA" },
      "publisher": { "@type": "Organization", "name": "NOVARIC®" },
      "description": "Një shpjegim i thelluar se si NOVARIC® mat besueshmërinë, lexueshmërinë, objektivitetin dhe transparencën e përmbajtjes përmes një kuadri metrik të strukturuar.",
      "keywords": "Besueshmëria, Lexueshmëria, Anshmëria, Sentimenti, Transparenca, Metrika Mediatike, Analizë Përmbajtjeje"
    };
    
    const iconClass = "w-8 h-8 text-primary-600 dark:text-primary-400";

  return (
    <main className="flex-grow bg-slate-100 dark:bg-slate-900 py-10">
      <JsonLd data={jsonLdData} />
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
            <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition-colors"
            >
                &larr; <span className="ml-2">Kthehu Pas</span>
            </button>
        </div>
        
        <header className="text-center mb-16">
          <BookOpenIcon className="w-16 h-16 mx-auto text-primary-600 dark:text-primary-400 mb-3"/>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Anatomia e një Artikulli
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-4 max-w-3xl mx-auto">
            Një shpjegim i thelluar se si ne matim cilësinë, thellësinë dhe transparencën e përmbajtjes sonë përmes metrikave të strukturuara.
          </p>
           <div className="mt-8">
                <div className="flex justify-center items-center mb-2">
                    <div className="relative flex items-center">
                        <button onClick={onNavigateToNoraAiProfile} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full transition-transform hover:scale-105 z-10">
                            <img src="https://novaric.co/wp-content/uploads/2025/10/Nora-AI.jpeg" alt="Përfaqësimi i Nora (AI)" className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg" title="Nora (AI)" />
                        </button>
                        <button onClick={() => onNavigateToVipProfile('vip33')} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full -ml-5 relative transition-transform hover:scale-105">
                            <img src="https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png" alt="Dr Alban Gj. THIKA" className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg" title="Dr Alban Gj. THIKA" />
                        </button>
                    </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Një punë hibride nga <button onClick={onNavigateToNoraAiProfile} className="font-bold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none">Nora (AI)</button> & <button onClick={() => onNavigateToVipProfile('vip33')} className="font-bold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none">Dr Alban Gj. THIKA</button>
                </p>
            </div>
        </header>


        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
            {/* Section: Besueshmëria */}
            <Section id="credibility" title="Besueshmëria" icon={<ShieldCheckIcon className={iconClass} />}>
                <MetricCard
                    term="Pretendime të Verifikuara"
                    definition="Numri i pretendimeve faktike në artikull që janë mbështetur me burime të cituara dhe të verifikueshme."
                    importance="Ky është themeli i gazetarisë së përgjegjshme. Ai tregon përkushtimin për të dalluar faktin nga opinioni dhe i jep lexuesit mundësinë të kontrollojë vetë vërtetësinë e informacionit."
                />
                <MetricCard
                    term="Burime Gjithsej"
                    definition="Numri total i burimeve të jashtme të referuara, duke përfshirë ato akademike, zyrtare dhe mediatike."
                    importance="Një numër i lartë burimesh sinjalizon një hulumtim të gjerë dhe një përpjekje për të paraqitur një pamje të plotë dhe të shumëanshme të temës, duke shmangur mbështetjen në një burim të vetëm."
                />
                <MetricCard
                    term="Raporti i Burimeve Parësore"
                    definition="Përqindja e burimeve që janë parësore (p.sh., dokumente origjinale, intervista, raporte kërkimore) kundrejt atyre dytësore."
                    importance="Burimet parësore janë më afër së vërtetës së një ngjarjeje. Një raport i lartë tregon se autori ka bërë punën e vështirë të hulumtimit origjinal, në vend që thjesht të përsërisë raportimet e të tjerëve."
                />
            </Section>

            {/* Section: Lexueshmëria */}
            <Section id="readability" title="Lexueshmëria" icon={<EyeIcon className={iconClass} />}>
                <MetricCard
                    term="Gjatësia Mesatare e Fjalisë"
                    definition="Numri mesatar i fjalëve për fjali në të gjithë artikullin."
                    importance="Fjalitë më të shkurtra janë përgjithësisht më të lehta për t'u kuptuar. Kjo metrikë na ndihmon të sigurohemi që stili ynë i shkrimit është i qartë, konciz dhe i aksesueshëm për një audiencë të gjerë."
                />
                <MetricCard
                    term="Niveli i Leximit (Flesch-Kincaid)"
                    definition="Një vlerësim i vështirësisë së leximit bazuar në gjatësinë e fjalëve dhe fjalive. Rezultati korrespondon me nivelin e arsimit të nevojshëm për të kuptuar tekstin."
                    importance="Kjo na lejon të përshtasim kompleksitetin e gjuhës me audiencën e synuar. Synimi ynë është të trajtojmë tema komplekse në një mënyrë që është rigoroze, por jo e errët apo akademikisht e paarritshme."
                />
                <MetricCard
                    term="Përqindja e Zërit Pasiv"
                    definition="Përqindja e fjalive që përdorin konstruksione të zërit pasiv."
                    importance="Zëri aktiv (p.sh., 'Qeveria miratoi ligjin') është më i drejtpërdrejtë dhe më i qartë se zëri pasiv ('Ligji u miratua nga qeveria'). Një përqindje e ulët e zërit pasiv tregon një shkrim më të fortë dhe më bindës."
                />
            </Section>

            {/* Section: Anshmëria & Sentimenti */}
            <Section id="biasAndSentiment" title="Anshmëria & Sentimenti" icon={<HeartIcon className={iconClass} />}>
                <MetricCard
                    term="Sentimenti i Përgjithshëm"
                    definition="Një matje sasiore e tonit emocional të artikullit, që varion nga negativ (-1) në pozitiv (+1), me 0 që përfaqëson neutralitet."
                    importance="Kjo metrikë na ndihmon të vlerësojmë objektivitetin e tonit. Për lajmet analitike, një rezultat afër neutrales është ideal, ndërsa për opinionet, kjo metrikë tregon qartë këndvështrimin emocional të autorit."
                />
                <MetricCard
                    term="Përqindja e Subjektivitetit"
                    definition="Përqindja e tekstit që përmban gjuhë opinative ose interpretuese në krahasim me gjuhën faktike."
                    importance="Transparenca kërkon që të jemi të qartë kur raportojmë fakte dhe kur shprehim opinione. Kjo metrikë na ndihmon të mbajmë një ekuilibër të shëndetshëm dhe të shmangim paraqitjen e opinioneve si fakte."
                />
                 <MetricCard
                    term="Korniza Hermeneutike"
                    definition="Lenteja teorike ose filozofike e përdorur për të interpretuar të dhënat dhe ngjarjet."
                    importance={<>Kjo është një formë e avancuar e transparencës. Duke deklaruar qartë këndvështrimin tonë analitik, ne i japim lexuesit mundësinë të kuptojë 'pse'-në pas analizës sonë dhe të vlerësojë argumentet tona në kontekstin e duhur. Vizitoni <button onClick={onNavigateToHermeneuticFramework} className="font-bold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none">Kornizën tonë Hermeneutike</button>.</>}
                />
            </Section>

            {/* Section: Cikli i Jetës & Përputhshmëria */}
            <Section id="lifecycleAndCompliance" title="Cikli i Jetës & Përputhshmëria" icon={<CubeTransparentIcon className={iconClass} />}>
                <MetricCard
                    term="Përditësuar së Fundmi"
                    definition="Data kur artikulli është rishikuar ose përditësuar për herë të fundit për të siguruar saktësinë dhe relevancën."
                    importance="Informacioni ndryshon me kalimin e kohës. Kjo datë tregon përkushtimin tonë për të mbajtur përmbajtjen të freskët dhe të besueshme, duke reflektuar zhvillimet më të fundit."
                />
                <MetricCard
                    term="I Sponsorizuar"
                    definition="Një tregues i qartë nëse artikulli është përmbajtje e sponsorizuar apo editoriale e pavarur."
                    importance="Kjo është një kërkesë themelore etike dhe ligjore. Dallimi i qartë midis përmbajtjes editoriale dhe asaj të paguar është thelbësor për të ruajtur besimin e lexuesit."
                />
                <MetricCard
                    term="Pajtimi GDPR"
                    definition="Konfirmimi që çdo mbledhje ose përpunim i të dhënave të lidhura me artikullin është në përputhje me Rregulloren e Përgjithshme për Mbrojtjen e të Dhënave (GDPR)."
                    importance="Respektimi i privatësisë së përdoruesve tanë është parësor. Kjo metrikë siguron që praktikat tona të të dhënave janë etike, transparente dhe në përputhje me standardet më të larta ligjore."
                />
            </Section>

            {/* Section: SEO & Aksesueshmëria */}
            <Section id="seoAndAccessibility" title="SEO & Aksesueshmëria" icon={<MagnifyingGlassIcon className={iconClass} />}>
                <MetricCard
                    term="Fjala Kyçe në Fokus"
                    definition="Termi ose fraza kryesore për të cilën artikulli është optimizuar për t'u gjetur në motorët e kërkimit."
                    importance="Kjo tregon temën qendrore të artikullit dhe na ndihmon të sigurohemi që përmbajtja jonë të arrijë te audienca që e kërkon atë. Është një urë lidhëse midis qëllimit tonë editorial dhe nevojave të lexuesit."
                />
                <MetricCard
                    term="Lidhje të Brendshme"
                    definition="Numri i lidhjeve që drejtojnë lexuesin drejt artikujve të tjerë relevantë brenda faqes sonë."
                    importance="Lidhjet e brendshme ofrojnë kontekst shtesë, inkurajojnë eksplorimin më të thellë të temave dhe ndihmojnë në ndërtimin e një rrjeti të pasur njohurish për lexuesit tanë."
                />
                <MetricCard
                    term="Mbulimi me Tekst Alt."
                    definition="Përqindja e imazheve në artikull që kanë një përshkrim tekstual alternativ (alt text)."
                    importance="Teksti alternativ është thelbësor për aksesueshmërinë. Ai u lejon përdoruesve me dëmtime pamore, që përdorin lexues ekrani, të kuptojnë përmbajtjen vizuale, duke siguruar që informacioni ynë të jetë i hapur për të gjithë."
                />
            </Section>
        </div>
      </div>
    </main>
  );
};
