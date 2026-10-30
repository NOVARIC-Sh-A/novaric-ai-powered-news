import React, { useMemo, ReactNode, useState, useEffect } from 'react';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { renderWithSuperscript } from '../utils/textUtils';
import { 
    BookOpenIcon, 
    ShieldCheckIcon, 
    MegaphoneIcon, 
    CpuChipIcon, 
    GlobeEuropeAfricaIcon,
    ChevronDownIcon,
    PencilSquareIcon,
    ScaleIcon,
    ChartBarIcon
} from './icons';

interface MediaEducationBibliographyPageProps {
  onBack: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
}

const extractText = (children: ReactNode): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join(' ');
  if (React.isValidElement<{ children?: ReactNode }>(children) && children.props.children) {
    return extractText(children.props.children);
  }
  return '';
};

const KeywordBubble: React.FC<{ keyword: string; percentage: number; maxPercentage: number; }> = ({ keyword, percentage, maxPercentage }) => {
  const size = 60 + (percentage / maxPercentage) * 140;
  const fontSize = 12 + (percentage / maxPercentage) * 12;
  const hash = keyword.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const hue = Math.abs(hash % 360);
  const saturation = 60 + Math.abs(hash % 30);
  const lightness = 50 + Math.abs(hash % 15);

  return (
    <div
      className="rounded-full text-white flex flex-col justify-center items-center text-center p-2 m-2 transition-transform hover:scale-105 shadow-lg"
      style={{
        width: size,
        height: size,
        backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        lineHeight: 1.1,
      }}
      title={`${keyword}: ${percentage.toFixed(1)}%`}
    >
      <span style={{ fontSize: `${fontSize}px` }} className="font-bold">{keyword}</span>
      <span className="text-xs opacity-80">{percentage.toFixed(1)}%</span>
    </div>
  );
};

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => (
  <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600/50"
      aria-expanded={isOpen}
    >
      <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 text-left">{title}</h3>
      <ChevronDownIcon className={`w-6 h-6 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div className="p-4 bg-white dark:bg-slate-800">
        {children}
      </div>
    )}
  </div>
);

const DetailRow: React.FC<{ label: string; value?: string | string[] | number; link?: string }> = ({ label, value, link }) => {
    if (!value) return null;
    const displayValue = Array.isArray(value) ? value.join(', ') : value;
    return (
        <div className="py-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{label}</p>
            {link ? (
                <a href={`https://${link}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all">{displayValue}</a>
            ) : (
                <p className="text-sm text-slate-700 dark:text-slate-200">{displayValue}</p>
            )}
        </div>
    );
};

const JournalRelevanceCard: React.FC<{
    title: string;
    score: number;
    publisher?: string;
    coreFocus?: string;
    relevanceAlbania?: string;
}> = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const getScoreColorClasses = (s: number) => {
        if (s >= 9) return { bg: 'bg-green-600', text: 'text-white', border: 'border-green-700' };
        if (s >= 7) return { bg: 'bg-lime-500', text: 'text-black', border: 'border-lime-600' };
        if (s >= 5) return { bg: 'bg-yellow-400', text: 'text-black', border: 'border-yellow-500' };
        return { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600' };
    };
    const { bg, text, border } = getScoreColorClasses(props.score);

    return (
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left p-4 flex justify-between items-start gap-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-t-lg"
                aria-expanded={isExpanded}
            >
                <div className="flex-grow">
                    <h4 className="font-bold text-md text-slate-800 dark:text-slate-200">{props.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{props.publisher}</p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full ${bg} ${border} border-2 flex items-center justify-center font-extrabold text-lg ${text} shadow-lg`}>
                        {props.score}
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform mt-2 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 animate-fadeIn">
                    <div className="space-y-4">
                        {props.coreFocus && (
                            <div>
                                <h5 className="font-bold text-primary-700 dark:text-primary-400 mb-1">Fokusi Themelor</h5>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{props.coreFocus}</p>
                            </div>
                        )}
                        {props.relevanceAlbania && (
                             <div>
                                <h5 className="font-bold text-primary-700 dark:text-primary-400 mb-1">Relevanca për Shqipërinë</h5>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{props.relevanceAlbania}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


export const MediaEducationBibliographyPage: React.FC<MediaEducationBibliographyPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;
    
    const pageTitle = "Bibliografia Themelore e Edukimit Mediatik | NOVARIC®";
    const pageDescription = "Një bibliotekë e kuruar me burime akademike kyçe për të kuptuar dhe vlerësuar mediat, themeli i Kornizës MARAGON®.";
    const keywords = ["Edukimi Mediatik", "Studime Gazetarizmi", "Komunikimi Politik", "Etika e Medias", "MARAGON", "Analizë Përmbajtjeje", "Anshmëri Mediatike", "NOVARIC"];
    
    const sourcesList = useMemo(() => [
        { id: 1, url: "www.cambridge.org/core/books/comparing-media-systems/9780521543088", text: "Hallin, D. C., & Mancini, P. (2004). Comparing media systems. Cambridge University Press.", credibility_industry_rating_pct: 98 },
        { id: 2, url: "www.amazon.com/Elements-Journalism-What-Newspeople-Should/dp/0804136787", text: "Kovach, B., & Rosenstiel, T. (2014). The elements of journalism (3rd ed.). Three Rivers Press.", credibility_industry_rating_pct: 98 },
        { id: 3, url: "www.journalofcommunication.org/", text: "Entman, R. M. (1993). Framing: Toward clarification of a fractured paradigm. Journal of Communication, 43(4), 51–58.", credibility_industry_rating_pct: 97 },
    ], []);

    const keywordData = [
        { keyword: 'Media', percentage: 20.0 }, { keyword: 'Communication', percentage: 18.2 },
        { keyword: 'Journalism', percentage: 15.1 }, { keyword: 'Political', percentage: 10.5 },
        { keyword: 'Public', percentage: 8.7 }, { keyword: 'Digital', percentage: 7.9 },
        { keyword: 'Social', percentage: 6.3 }, { keyword: 'Culture', percentage: 4.8 },
        { keyword: 'Policy', percentage: 3.5 }, { keyword: 'Ethics', percentage: 3.1 },
        { keyword: 'Theory', percentage: 2.0 },
    ].map(k => ({...k, count: 0}));
    const maxPercentage = Math.max(...keywordData.map(k => k.percentage));
    
    const journalRelevanceData = {
        tier1: [
            { title: "Political Communication", score: 10, publisher: "Taylor & Francis", coreFocus: "Analiza e marrëdhënieve midis medias, qytetarëve dhe institucioneve politike.", relevanceAlbania: "Thelbësore. Ofron kuadrin teorik dhe empirik për të analizuar diskursin politik, efektet e fushatave dhe rolin e medias në zgjedhje, tema qendrore për MARAGON®." },
            { title: "International Journal of Press/Politics", score: 10, publisher: "SAGE", coreFocus: "Studimi krahasues i marrëdhënieve midis lajmeve, politikës dhe opinionit publik.", relevanceAlbania: "Kritike. Ndihmon në vendosjen e sistemit mediatik shqiptar në një kontekst global, duke krahasuar praktikat lokale me standardet ndërkombëtare." },
            { title: "Journalism Studies", score: 9, publisher: "Taylor & Francis", coreFocus: "Hulumtim i thelluar mbi praktikën, teorinë dhe historinë e gazetarisë.", relevanceAlbania: "Shumë e rëndësishme për të kuptuar sfidat profesionale të gazetarëve, etikën dhe evolucionin e profesionit në epokën dixhitale." },
            { title: "Digital Journalism", score: 9, publisher: "Taylor & Francis", coreFocus: "Fokusohet specifikisht në ndikimin e teknologjisë dixhitale në gazetari.", relevanceAlbania: "Jashtëzakonisht relevante duke pasur parasysh dominancën e portaleve online në Shqipëri. Ndihmon në analizimin e modeleve të reja të biznesit dhe dezinformimit." },
        ],
        tier2: [
            { title: "Journal of Communication", score: 8, publisher: "Wiley (for ICA)", coreFocus: "Revista flamur e fushës së komunikimit, me një gamë të gjerë temash.", relevanceAlbania: "Ofron themelin teorik për shumë nga konceptet që përdorim, nga efektet e medias te komunikimi ndërpersonal." },
            { title: "Public Opinion Quarterly", score: 8, publisher: "Oxford University Press (for AAPOR)", coreFocus: "Fokusohet në teorinë dhe metodologjinë e sondazheve dhe opinionit publik.", relevanceAlbania: "E rëndësishme për të kuptuar dhe kritikuar metodologjinë e sondazheve politike të përhapura në Shqipëri." },
            { title: "European Journal of Communication", score: 7, publisher: "SAGE", coreFocus: "Analizon sistemet mediatike, politikat dhe kulturën nga një perspektivë evropiane.", relevanceAlbania: "Ofron kontekstin evropian dhe krahasues, i cili është thelbësor për të vlerësuar Shqipërinë në rrugën e saj drejt BE-së." },
        ],
        tier3: [
            { title: "New Media & Society", score: 7, publisher: "SAGE", coreFocus: "Analizon ndikimin shoqëror, politik dhe kulturor të mediave të reja.", relevanceAlbania: "E dobishme për të kuptuar dinamikat e mediave sociale dhe ndikimin e tyre në sferën publike shqiptare." },
            { title: "Media, Culture & Society", score: 6, publisher: "SAGE", coreFocus: "Një qasje kritike ndaj medias, duke e parë atë si një institucion kulturor dhe ekonomik.", relevanceAlbania: "Ofron mjetet për një analizë më të thellë të pronësisë së medias dhe ndikimit të interesave ekonomike, një çështje kyçe në Shqipëri." },
            { title: "Journalism Practice", score: 6, publisher: "Taylor & Francis", coreFocus: "Fokusohet në aspektet praktike të punës gazetareske.", relevanceAlbania: "Ndihmon në kuptimin e sfidave të përditshme me të cilat përballen gazetarët në terren." },
        ],
        tier4: [
            { title: "Communication Law and Policy", score: 5, publisher: "Taylor & Francis", coreFocus: "Analiza e ligjeve dhe rregulloreve që qeverisin mediat.", relevanceAlbania: "Relevante për të analizuar kuadrin ligjor shqiptar (p.sh. ligjet e AMA-s) dhe përputhshmërinë e tij me standardet evropiane." },
            { title: "Feminist Media Studies", score: 5, publisher: "Taylor & Francis", coreFocus: "Analizon mediat nga një perspektivë gjinore.", relevanceAlbania: "Ofron një lente kritike për të vlerësuar përfaqësimin e grave në media dhe politikë, një dimension i rëndësishëm social." },
            { title: "Journal of Media Economics", score: 4, publisher: "Taylor & Francis", coreFocus: "Fokusohet në modelet e biznesit dhe strukturat ekonomike të industrisë së medias.", relevanceAlbania: "Ndihmon në kuptimin e qëndrueshmërisë ekonomike të mediave shqiptare, një faktor kyç që ndikon në pavarësinë e tyre." },
        ]
    };
    
    const bibliography = {
        "General & Interdisciplinary Communication Studies": ["Journal of Communication (ICA Flagship)", "Communication Research", "Human Communication Research", "Journal of Broadcasting & Electronic Media", "International Journal of Communication", "Communication Theory", "Media, Culture & Society", "New Media & Society", "Journalism & Mass Communication Quarterly (AEJMC Flagship)", "Critical Studies in Media Communication", "Communication and the Public", "Communication, Culture & Critique", "Annals of the International Communication Association (ICA)", "Information, Communication & Society", "The Communication Review"],
        "Journalism Studies": ["Journalism Studies", "Journalism Practice", "Digital Journalism", "Journalism: Theory, Practice & Criticism", "Canadian Journal of Communication"],
        "Political Communication & Public Opinion": ["Political Communication", "International Journal of Press/Politics", "Public Opinion Quarterly", "The International Journal of Public Opinion Research", "Mass Communication and Society", "Communication Research Reports", "Government Information Quarterly"],
        "Digital Media, Technology & Society": ["Technological Forecasting and Social Change", "First Monday", "Mobile Media & Communication", "Social Media + Society", "Big Data & Society"],
        "Media Policy, Economics & Law": ["Telecommunications Policy", "Journal of Media Economics", "Communication Law and Policy", "Media and Communication"],
        "Cultural & Global Communication Studies": ["International Communication Gazette", "Global Media and Communication", "European Journal of Communication", "Westminster Papers in Communication and Culture", "Journal of Intercultural Communication Research"],
        "Specialized/Interdisciplinary Perspectives": ["Science Communication", "Health Communication", "Journal of Applied Communication Research", "Feminist Media Studies", "Discourse & Society", "Media History", "Television & New Media", "Visual Communication", "Convergence: The International Journal of Research into New Media Technologies"]
    };

    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="Hyrje: Shtylla Intelektuale e Kornizës MARAGON®">
                <p>Kjo bibliografi përfaqëson themelin akademik mbi të cilin është ndërtuar Korniza Analitike MARAGON®. Ajo nuk është një listë e rastësishme, por një koleksion i kuruar i revistave shkencore më me ndikim në fushën e studimeve të komunikimit, gazetarisë dhe medias. Qëllimi është të sigurojmë që vlerësimet tona të jenë të rrënjosura në dekada kërkimesh rigoroze dhe të pasqyrojnë standardet më të larta të analizës ndërkombëtare.</p>
                <PullQuote>Çdo dimension i MARAGON®-it, nga matja e anshmërisë deri te vlerësimi i etikës, gjen bazën e tij teorike dhe metodologjike në punimet e publikuara në këto revista.</PullQuote>
            </ArticleSection>

            <ArticleSection id="vizualizimi" title="Vizualizimi i Fjalëve Kyçe">
                <p>Grafiku i mëposhtëm paraqet fjalët më të përsëritura në titujt e referencave, të cilat janë thelbësore për ekosistemin analitik të MARAGON® dhe kontekstin mediatik shqiptar.</p>
                <div className="flex flex-wrap justify-center items-center p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                    {keywordData.map(item => <KeywordBubble key={item.keyword} {...item} maxPercentage={maxPercentage} />)}
                </div>
            </ArticleSection>
            
            <ArticleSection id="analiza-renditja" title="Analiza dhe Renditja e Revistave sipas Relevancës për MARAGON®">
                <h3 className="text-xl font-semibold mt-6 mb-4">Metodologjia e Vlerësimit</h3>
                <p>Vlerësimi bazohet në tre kritere kryesore:</p>
                <ul className="list-disc list-inside space-y-2 pl-4 my-4">
                    <li><strong>Relevanca Tematike Direkte:</strong> Sa shpesh revista mbulon tema si etika gazetareske, anshmëria mediatike, verifikimi i fakteve dhe analiza e përmbajtjes?</li>
                    <li><strong>Fokusi Gjeografik/Krahasues:</strong> A ka revista një fokus në sistemet mediatike evropiane ose krahasuese, gjë që e bën më të lehtë aplikimin e gjetjeve në kontekstin shqiptar?</li>
                    <li><strong>Ndikimi dhe Rëndësia Themelore:</strong> A është revista një burim kanonik për teoritë themelore të komunikimit (p.sh., agenda-setting, framing) që formojnë bazën e analizës sonë?</li>
                </ul>

                <div className="space-y-8 mt-8">
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-green-500">Kategoria 1: Relevancë Kritike dhe Shumë e Lartë (Pikët 9-10)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {journalRelevanceData.tier1.map(j => <JournalRelevanceCard key={j.title} {...j} />)}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-lime-500">Kategoria 2: Relevancë e Lartë (Pikët 7-8)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {journalRelevanceData.tier2.map(j => <JournalRelevanceCard key={j.title} {...j} />)}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-yellow-400">Kategoria 3: Relevancë e Moderuar (Pikët 6-7)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {journalRelevanceData.tier3.map(j => <JournalRelevanceCard key={j.title} {...j} />)}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-red-500">Kategoria 4: Relevancë e Kufizuar ose Indirekte (Pikët 4-5)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {journalRelevanceData.tier4.map(j => <JournalRelevanceCard key={j.title} {...j} />)}
                        </div>
                    </div>
                </div>
            </ArticleSection>

            {Object.entries(bibliography).map(([title, items]) => (
                <ArticleSection key={title} id={title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} title={title}>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        {items.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </ArticleSection>
            ))}
        </>
    ), [keywordData, maxPercentage, journalRelevanceData, bibliography]);
    
    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(fullArticleText, { url: window.location.href, published_at: new Date().toISOString(), article_id: 'media-education-bibliography-01' }, sourcesList, { researchHours: 200, focusKeyword: "Bibliografia e Medias" });
    }, [fullArticleText, sourcesList]);
    const articleIntegrityProfile = useMemo(() => calculateArticleIntegrityProfile(articleMetrics), [articleMetrics]);

    const tocItems = [
        { id: 'hyrje', title: 'Hyrje: Shtylla Intelektuale e MARAGON®' },
        { id: 'vizualizimi', title: 'Vizualizimi i Fjalëve Kyçe' },
        { id: 'analiza-renditja', title: 'Analiza dhe Renditja e Revistave' },
        ...Object.keys(bibliography).map(title => ({
            id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: title
        }))
    ];
    
    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Bibliografia Themelore e Edukimit Mediatik"
            headerSubtitle="Shtylla Intelektuale e Kornizës Analitike MARAGON®"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{ publishedDate: "Publikuar: 1 Nëntor, 2025", location: "Shkodër, Shqipëri" }}
            tableOfContentsItems={tocItems}
            articleMetrics={articleMetrics}
            articleIntegrityProfile={articleIntegrityProfile}
            keywords={keywords}
            onBack={onBack}
            onNavigateToVipProfile={onNavigateToVipProfile}
            onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
        >
            {articleContentJsx}
        </ArticleTemplate1>
    );
};
