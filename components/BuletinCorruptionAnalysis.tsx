import React, { ReactNode, useMemo } from 'react';
import { BriefcaseIcon, BookOpenIcon, ClockIcon, ShareIcon } from './icons';
import { AdvancedArticleMetrics } from './AdvancedArticleMetrics';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { ArticleTemplate1, ArticleSection } from './templates/ArticleTemplate1';

interface BuletinCorruptionAnalysisPageProps {
  onBack: () => void;
  onNavigateToMethodology: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToJudiciary: () => void;
  onNavigateToArticleMetricsExplained: () => void;
  title: string;
  description: string;
}

const extractText = (children: ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join(' ');
  }
  if (React.isValidElement<{ children?: ReactNode }>(children) && children.props.children) {
    return extractText(children.props.children);
  }
  return '';
};


const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-500 mb-2">{title}</h3>
        {children}
    </div>
);

const sources = [
  { id: 1, url: "https://help.unodc.org/portal/en/index.html", text: "UNODC - SHERLOC", credibility_industry_rating_pct: 95 },
  { id: 2, url: "https://www.state.gov/reports/2023-investment-climate-statements/albania/", text: "U.S. Department of State - Investment Climate Statements", credibility_industry_rating_pct: 98 },
  { id: 3, url: "https://www.u4.no/publications/albania-overview-of-corruption-and-anti-corruption", text: "U4 Anti-Corruption Resource Centre - Albania Overview", credibility_industry_rating_pct: 88 },
  { id: 4, url: "https://www.ganintegrity.com/portal/country-profiles/albania", text: "GAN Integrity - Albania Corruption Report", credibility_industry_rating_pct: 85 },
  { id: 5, url: "https://top-channel.tv/2023/03/08/inspektoret-tatimore-i-vune-gjobe-biznesit-dhe-i-kerkuan-10-per-ta-fshire-arrestohen-dy-zyrtaret/", text: "Top Channel - Arrestohen dy zyrtarët", credibility_industry_rating_pct: 80 },
  { id: 6, url: "https://www.researchgate.net/publication/334255153_Linkages_between_Corruption_and_Informality_Evidence_from_Albanian_Enterprises", text: "ResearchGate - Linkages between Corruption and Informality", credibility_industry_rating_pct: 92 },
  { id: 7, url: "https://www.zeriamerikes.com/a/korrupsioni-ne-prokurime/6534966.html", text: "Zëri i Amerikës - Korrupsioni në prokurime...", credibility_industry_rating_pct: 90 },
  { id: 8, url: "https://bti-project.org/en/reports/2022/country-report/ALB", text: "BTI Transformation Index - Albania Report", credibility_industry_rating_pct: 90 },
  { id: 9, url: "https://www.iri.org/resources/public-opinion-poll-albania-november-2-12-2022/", text: "IRI - Public Opinion Poll Albania", credibility_industry_rating_pct: 89 },
  { id: 10, url: "https://seldi.net/publications/corruption-monitoring-system-brief-9/", text: "SELDI - Corruption Monitoring System", credibility_industry_rating_pct: 86 },
  { id: 11, url: "https://neighbourhood-enlargement.ec.europa.eu/albania-report-2023_en", text: "European Commission - Albania Report 2023", credibility_industry_rating_pct: 98 },
  { id: 12, url: "https://e-albania.al/document/ListServices", text: "e-Albania - Portali i Shërbimeve Publike", credibility_industry_rating_pct: 95 },
  { id: 13, url: "https://see-whistleblowing.org/albania-whistleblower-protection-laws-and-institutions/", text: "Southeast Europe Coalition on Whistleblower Protection", credibility_industry_rating_pct: 82 }
];


export const BuletinCorruptionAnalysisPage: React.FC<BuletinCorruptionAnalysisPageProps> = ({ onBack, onNavigateToMethodology, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToJudiciary, onNavigateToArticleMetricsExplained, title, description }) => {
    
    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="kuader" title="Një Kuadër i Korrupsionit të Përhapur">
                <p>Një analizë e thelluar e situatës, bazuar në fakte të mbledhura nga burime të respektuara ndërkombëtare dhe vendase, zbulon një sistem thellësisht të rrënjosur korrupsioni që përshkon nivele të ndryshme të qeverisjes. Ky mjedis nxit një klimë frike dhe pasigurie për drejtuesit e bizneseve, të cilët shpesh përballen me zgjedhjen e pagimit të ryshfeteve ose përballjes me pengesa burokratike dhe veprime ndëshkuese.</p>
                <p>Departamenti i Shtetit i SHBA-së, në deklaratat e tij për klimën e investimeve, ka theksuar vazhdimisht korrupsionin endemik si një sfidë të madhe për bizneset në Shqipëri.<sup>[1][2]</sup> Investitorët e huaj dhe vendas njësoj citojnë korrupsionin, duke përfshirë në gjyqësor, prokurimet publike dhe administratën tatimore, si një pengesë të rëndësishme për të bërë biznes.<sup>[1][2]</sup> Një raport i Bankës Botërore i vitit 2019 zbuloi se mbi 36% e bizneseve në vend ishin pyetur për ryshfete nga zyrtarë të administratës, një shifër ndjeshëm më e lartë se mesatarja rajonale. Kjo tregon një problem të përhapur dhe sistemik që shkon përtej incidenteve të izoluara.</p>
            </ArticleSection>
            
            <ArticleSection id="mekanizmat" title="Mekanizmat e Shantazhit: Një Qasje Shumë-dimensionale">
                <p>Metodat e përdorura nga zyrtarët e korruptuar janë të ndryshme dhe krijojnë një rrjet shtrëngimi që është i vështirë për t'u naviguar nga bizneset. Raportet nga burime të ndryshme, duke përfshirë Zyrën e Kombeve të Bashkuara për Drogën dhe Krimin (UNODC), detajojnë se si zyrtarët publikë kërkojnë ryshfete për të përshpejtuar procedurat, për të dhënë licenca, ose për të anashkaluar shkelje të pretenduara rregullatore.<sup>[1]</sup></p>
                 <SubSection title="Administrata Tatimore">
                    <p>Administrata tatimore citohet shpesh si një zonë me rrezik të lartë për korrupsion.<sup>[3]</sup> Bizneset raportojnë se inspektorët tatimorë shpesh kërkojnë pagesa të parregullta dhe ryshfete, veçanërisht gjatë inspektimeve.<sup>[4]</sup> Një rast i dokumentuar përfshinte një kasap i cili u kërcënua me gjoba të larta nga inspektorët tatimorë të cilët më pas dyshohet se kërkuan 10% të gjobës si ryshfet për ta zhdukur problemin.<sup>[5]</sup> Hulumtimi mbi ndërmarrjet shqiptare ka treguar se firmat që operojnë në një mjedis ku evazioni fiskal është i përhapur kanë më shumë gjasa të përballen me kërkesa për ryshfete nga zyrtarë të korruptuar, duke sugjeruar një cikël vicioz korrupsioni dhe praktikash informale të biznesit.<sup>[6]</sup></p>
                 </SubSection>
                  <SubSection title="Prokurimet Publike">
                    <p>Sektori i prokurimeve publike është një tjetër vatër për korrupsion, i karakterizuar nga rrjete patronazhi dhe mungesë transparence.<sup>[4]</sup> Zëri i Amerikës ka raportuar se korrupsioni në prokurimet publike ka rezultuar në mbi 120 milionë dollarë dëm financiar në buxhetin e shtetit gjatë një dekade.<sup>[7]</sup> Raste të profilit të lartë, si "Afera e Inceneratorëve", kanë implikuar një ish-zëvendëskryeministër dhe zyrtarë të tjerë të lartë në skema që përfshijnë tendera të manipuluar dhe ryshfet, duke demonstruar shkallën e korrupsionit në nivelet më të larta të qeverisë.<sup>[1]</sup></p>
                 </SubSection>
                 <SubSection title="Licencimi dhe Lejet">
                    <p>Marrja e licencave dhe lejeve të nevojshme është një tjetër fushë ku bizneset janë të cenueshme ndaj shantazhit. Procesi shpesh është i mbushur me korrupsion, me më shumë se një të tretën e bizneseve që raportojnë se presin të japin "dhurata" për të marrë leje.<sup>[4]</sup> Kjo krijon një mjedis ku lidhjet personale dhe gatishmëria për të paguar ryshfete bëhen më të rëndësishme se merita e një propozimi biznesi.</p>
                 </SubSection>
            </ArticleSection>

             <ArticleSection id="ndikimi" title="Ndikimi Gërryes në Zhvillimin e Shqipërisë">
                <p>Ky mjedis toksik biznesi ka pasoja të gjera për progresin ekonomik dhe social të Shqipërisë. Kërcënimi i vazhdueshëm i shantazhit dhe paparashikueshmëria e marrëdhënieve me agjencitë qeveritare dekurajojnë investimet vendase dhe të huaja.<sup>[7]</sup> Një anketë e UNODC zbuloi se një përqindje e konsiderueshme e bizneseve paguajnë ryshfete zyrtarëve publikë disa herë në vit, duke shtuar një kosto të konsiderueshme dhe të paligjshme për të bërë biznes.<sup>[1]</sup></p>
                <p>Kjo klimë korrupsioni shtrembëron konkurrencën në treg, duke favorizuar kompanitë e lidhura politikisht dhe ato që janë të gatshme të angazhohen në praktika të paligjshme.<sup>[8]</sup> Rezultati është një fushë loje që është larg të qenit e barabartë, duke mbytur inovacionin dhe produktivitetin. Ndikimi ekonomik është i rëndësishëm, me studime që tregojnë se korrupsioni ndikon negativisht në rritjen ekonomike duke dekurajuar investimet private dhe duke keq-alokuar burimet publike.<sup>[3][9]</sup> Në fund të fundit, kjo pengon krijimin e vendeve të punës dhe mundësive për popullin shqiptar.<sup>[10]</sup></p>
            </ArticleSection>

             <ArticleSection id="rruga" title="Rruga Përpara: Një Thirrje për Reformë Sistemike dhe Zbatim të Palëkundur">
                <p>Adresimi i kësaj çështjeje të rrënjosur thellë kërkon një përpjekje gjithëpërfshirëse dhe të qëndrueshme. Ndërsa Shqipëria ka ndërmarrë disa hapa në drejtimin e duhur, si themelimi i Strukturës së Posaçme Kundër Korrupsionit (<button onClick={onNavigateToJudiciary} className="text-primary-600 dark:text-primary-400 hover:underline inline font-semibold">SPAK</button>) dhe reformat e vazhdueshme gjyqësore, duhet bërë shumë më tepër.<sup>[2][11]</sup></p>
                <p>Një hap vendimtar është të sigurohet pavarësia e vërtetë dhe burimet e duhura për organet anti-korrupsion. Grupi i Shteteve kundër Korrupsionit (GRECO) ka bërë thirrje që Inspektorati i Lartë i Deklarimit dhe Verifikimit të Pasurive dhe Konfliktit të Interesave (ILDKPKI) të pajiset siç duhet për të kryer misionin e tij.<sup>[10]</sup></p>
                <p>Për më tepër, ekziston një nevojë urgjente për të thjeshtuar procedurat burokratike dhe për të rritur transparencën në të gjitha ndërveprimet qeveri-biznes. Zbatimi i shërbimeve të e-qeverisjes ka treguar premtime në reduktimin e mundësive për korrupsion të vogël.<sup>[12]</sup></p>
                <p>Së fundi, është i nevojshëm një ndryshim kulturor, një ndryshim që largohet nga pranimi i ryshfetit si një praktikë e zakonshme. Kjo kërkon vullnet të fortë politik, zbatim të qëndrueshëm dhe të paanshëm të ligjeve anti-korrupsion, dhe mbrojtjen e sinjalizuesve që ekspozojnë keqbërjet.<sup>[13]</sup> Prosperiteti i ardhshëm i Shqipërisë varet nga aftësia e saj për të krijuar një mjedis biznesi të drejtë dhe transparent ku sipërmarrësit mund të lulëzojnë bazuar në meritë, jo në gatishmërinë e tyre për të paguar kërkesa të paligjshme.</p>
            </ArticleSection>
            <ArticleSection id="burimet" title="Burimet">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    {sources.map(source => (
                        <li key={source.id}>
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-words">
                                {source.text}
                            </a>
                        </li>
                    ))}
                </ol>
            </ArticleSection>
        </>
    ), [onNavigateToJudiciary]);

    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText, 
            {
                url: window.location.href,
                published_at: "2025-08-05T10:30:00Z",
                article_id: 'buletin-corruption-01'
            }, 
            sources,
            {
                researchHours: 42,
                focusKeyword: "Korrupsioni në biznes"
            }
        );
    }, [fullArticleText]);

    const articleIntegrityProfile = useMemo((): ArticleIntegrityProfileData => {
        return calculateArticleIntegrityProfile(articleMetrics);
    }, [articleMetrics]);
    
    const handleShare = async () => {
        // Share logic...
    };
    
    return (
        <ArticleTemplate1
            pageTitle={title}
            pageDescription={description}
            pageKeywords="Korrupsioni në Biznes, Shantazh Mediatik, Klimë Investimesh, Prokurime Publike, Sundimi i Ligjit, Shqipëri"
            headerTitle="Mjedisi Toksik i Shantazhit dhe Korrupsionit Mbyt Progresin Ekonomik të Shqipërisë"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 5 Gusht, 2025",
                location: "Shkodër, Shqipëri"
            }}
            articleMetrics={articleMetrics}
            articleIntegrityProfile={articleIntegrityProfile}
            keywords={["Korrupsion", "Shantazh", "Biznes", "Ekonomi Shqiptare", "SPAK", "Investime"]}
            onBack={onBack}
            onNavigateToVipProfile={onNavigateToVipProfile}
            onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3">
                    {articleContentJsx}
                </div>
            </div>
            <div className="mt-12 text-center space-y-4">
                 <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-md transition-colors"
                 >
                    <ShareIcon className="w-5 h-5 mr-2" />
                    Shpërndaje këtë Buletin
                 </button>
                 <button
                    onClick={onNavigateToMethodology}
                    className="block w-full text-center text-sm text-slate-600 dark:text-slate-400 hover:underline"
                 >
                    Lexo Metodologjinë e Buletinit
                </button>
            </div>
        </ArticleTemplate1>
    );
};