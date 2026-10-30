import React, { useMemo, ReactNode } from 'react';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { GlossaryComponent } from './Glossary';

interface JudicialPerformancePageProps {
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

const SourceLink: React.FC<{ s: number }> = ({ s }) => (
    <sup>
        <a href={`#ref-${s}`} className="text-primary-500 mx-0.5 no-underline">[{s}]</a>
    </sup>
);

export const JudicialPerformancePage: React.FC<JudicialPerformancePageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;

    const pageTitle = "Performanca Gjyqësore: Përtej Metrikave Sasiore | NOVARIC®";
    const pageDescription = "Një analizë e thelluar e katër elementeve kyçe për matjen dhe analizimin e performancës gjyqësore në Shqipëri, duke lëvizur përtej numrave për të kuptuar funksionimin real të sistemit.";
    const keywords = ["Performanca Gjyqësore", "Efikasiteti i Drejtësisë", "Arsyetimi Gjyqësor", "Analizë Empirike", "Institucione Gjithëpërfshirëse", "Sistemi Gjyqësor Shqiptar", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "www.cambridge.org/core/books/institutions-institutional-change-and-economic-performance/0521397340", text: "North, D. C. (1990). Institutions, Institutional Change and Economic Performance. Cambridge University Press.", credibility_industry_rating_pct: 97 },
        { id: 2, url: "academic.oup.com/ojls", text: "Oxford Journal of Legal Studies. Oxford University Press.", credibility_industry_rating_pct: 98 },
        { id: 3, url: "onlinelibrary.wiley.com/journal/17401461", text: "Journal of Empirical Legal Studies. Wiley.", credibility_industry_rating_pct: 91 },
        { id: 4, url: "www.amazon.com/Why-Nations-Fail-Origins-Prosperity/dp/0307719227", text: "Acemoglu, D., & Robinson, J. A. (2012). Why Nations Fail: The Origins of Power, Prosperity, and Poverty. Crown Business.", credibility_industry_rating_pct: 96 },
        { id: 5, url: "www.coe.int/en/web/cepej/", text: "European Commission for the Efficiency of Justice (CEPEJ). Council of Europe.", credibility_industry_rating_pct: 95 }
    ], []);
    
    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="Hyrje: Nga Sasia te Cilësia dhe Ndikimi">
                <p>Tradicionalisht, performanca gjyqësore është matur përmes <KeyConcept term="metrikave sasiore" definition="Tregues numerikë që masin volumin ose sasinë, si numri i çështjeve të zgjidhura.">metrikave të thjeshta sasiore</KeyConcept>: sa çështje ka mbyllur një gjykatë apo një gjyqtar. Kjo qasje, ndonëse e nevojshme, është thellësisht e pamjaftueshme. Filozofia jonë analitike e sheh performancën si një koncept me shumë dimensione, ku efikasiteti ndërthuret me cilësinë e arsyetimit, qëndrueshmërinë e vendimeve dhe, më e rëndësishmja, me ndikimin që gjyqësori ka në forcimin e besimit publik dhe zhvillimin ekonomik.</p>
                <p>Ky artikull zbërthen katër elementet kyçe që përbëjnë kuadrin tonë për matjen dhe analizimin e performancës gjyqësore në Shqipëri, duke lëvizur përtej numrave për të kuptuar funksionimin real të sistemit.</p>
            </ArticleSection>

            <ArticleSection id="efikasiteti" title="Elementi I: Efikasiteti i Drejtësisë – Matja e Kohës dhe Stabilitetit">
                <p>Dimensioni i parë dhe më i matshëm i performancës është efikasiteti. Një drejtësi e vonuar është një drejtësi e mohuar. Këtu, analiza jonë adopton standardet e përdorura nga <KeyConcept term="Komisioni Evropian për Efikasitetin e Drejtësisë (CEPEJ)" definition="Një organ i Këshillit të Evropës që synon përmirësimin e efikasitetit dhe funksionimit të drejtësisë në vendet anëtare.">Komisioni Evropian për Efikasitetin e Drejtësisë (CEPEJ)</KeyConcept><SourceLink s={5}/>, duke u fokusuar në dy tregues kryesorë:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Koha e Zgjidhjes së Çështjeve (Length of Proceedings):</strong> Sa kohë duhet mesatarisht për të marrë një vendim?</li>
                    <li><strong>Shkalla e Zgjidhjes (Clearance Rate):</strong> A po zgjidhin gjykatat më shumë çështje sesa marrin brenda një viti?</li>
                </ul>
                <p>Këto metrika nuk janë thjesht administrative. Siç argumenton Douglass North në veprën e tij kanonike <em>Institutions, Institutional Change and Economic Performance</em>, një gjyqësor i ngadaltë rrit "<KeyConcept term="kostot e transaksionit" definition="Kostot e lidhura me pjesëmarrjen në një treg ose kryerjen e një shkëmbimi ekonomik, si kostot e negociimit, zbatimit dhe sigurimit të kontratave.">kostot e transaksionit</KeyConcept>" në shoqëri, duke dekurajuar investimet dhe duke penguar zhvillimin ekonomik.<SourceLink s={1}/> Për më tepër, ne analizojmë shkallën e prishjes së vendimeve nga gjykatat më të larta si një tregues i qëndrueshmërisë dhe parashikueshmërisë së sistemit ligjor.</p>
            </ArticleSection>

            <ArticleSection id="cilesia" title="Elementi II: Zemra e Jurisprudencës – Cilësia e Arsyetimit Gjyqësor">
                <p>Ky është elementi që e ndan një analizë teknike nga një analizë jurisprudenciale. Një vendim mund të jetë i shpejtë, por i arsyetuar dobët, duke krijuar pasiguri dhe duke ftuar apelimin. Analiza jonë vlerëson cilësinë e vendimeve bazuar në:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Qartësinë dhe Strukturën Logjike:</strong> A është vendimi i kuptueshëm dhe arsyetimi i ndjekshëm?</li>
                    <li><strong>Thellësinë e Analizës Ligjore:</strong> A bazohet vendimi në një analizë të thelluar të ligjit, doktrinës dhe precedentit, apo mjaftohet me citime formale?</li>
                    <li><strong>Përdorimin e Jurisprudencës Krahasuese dhe Ndërkombëtare:</strong> A tregon gjyqtari një njohje të standardeve të GJEDNJ dhe praktikave të tjera evropiane?</li>
                </ul>
                <p>Kjo qasje ndaj cilësisë mbështetet në traditën e revistave elitare si <em>Oxford Journal of Legal Studies</em>, ku rigoroziteti analitik është kriteri themelor i vlerës akademike.<SourceLink s={2}/> Një vendim i mirë-arsyetuar kontribuon në "kapitalin juridik" të një vendi.</p>
            </ArticleSection>

            <ArticleSection id="analiza-empirike" title="Elementi III: Drejtësia e Bazuar në të Dhëna – Matja Empirike e Performancës">
                <p>Filozofia jonë kërkon të lëvizë përtej përshtypjeve dhe anektodave. Për këtë, ne mbështetemi në parimet e promovuara nga revista si <em>Journal of Empirical Legal Studies</em>, e cila avokon për përdorimin e metodave rigoroze sasiore dhe cilësore për të studiuar ligjin në praktikë.<SourceLink s={3}/> Kjo do të thotë të pyesim:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>A ka të dhëna që tregojnë se gjyqtarë të caktuar ose gjykata të caktuara kanë shkallë më të lartë prishjeje në fusha specifike të ligjit?</li>
                    <li>A mund të identifikojmë modele (patterns) në zvarritjen e çështjeve?</li>
                    <li>Si ndikon ngarkesa e punës në cilësinë e vendimeve?</li>
                </ul>
                <p>Përdorimi i <KeyConcept term="të dhënave empirike" definition="Informacion i mbledhur përmes vëzhgimit, eksperimentit ose matjeve direkte, në kontrast me të dhënat teorike ose të bazuara në opinion.">të dhënave empirike</KeyConcept> na lejon të kalojmë nga opinioni ("Gjykatat vonojnë") në diagnozën e bazuar në fakte ("Gjykata Administrative e Shkallës së Parë Tiranë ka një kohëzgjatje mesatare 30% më të lartë në çështjet e prokurimeve publike sesa mesatarja kombëtare"). Kjo i jep analizës sonë fuqi shpjeguese dhe e bën atë të dobishme për politikëbërësit.</p>
            </ArticleSection>

            <ArticleSection id="ndikimi" title="Elementi IV: Lidhja Institucionale – Pse Performanca e Gjyqësorit ka Rëndësi">
                <p>Në fund të fundit, performanca gjyqësore nuk është një qëllim në vetvete. Ajo është instrumenti kryesor përmes të cilit gjyqësori përmbush rolin e tij në shoqëri. Këtu, analiza jonë mbështetet fort te teza e Daron Acemoglu dhe James Robinson në <em>Why Nations Fail</em>: kombet e suksesshme ndërtojnë "<KeyConcept term="institucione gjithëpërfshirëse" definition="Institucione politike dhe ekonomike që mbrojnë të drejtat e pronës, sigurojnë zbatimin e paanshëm të ligjit dhe inkurajojnë pjesëmarrjen e gjerë, duke krijuar kështu incentiva për investim dhe inovacion.">institucione gjithëpërfshirëse</KeyConcept>" që garantojnë zbatimin e paanshëm të ligjit dhe mbrojtjen e të drejtave të pronës.<SourceLink s={4}/></p>
                <PullQuote>Një gjyqësor me performancë të lartë – pra, efikas, cilësor dhe i parashikueshëm – është themeli i këtyre institucioneve.</PullQuote>
                <p>Ai ul riskun për investitorët, mbron qytetarët nga abuzimet e shtetit dhe siguron që kontratat të zbatohen. Prandaj, analiza jonë e performancës së një gjyqtari apo një gjykate do të përfundojë gjithmonë me pyetjen thelbësore: Si kontribuon kjo performancë në ndërtimin e institucioneve gjithëpërfshirëse në Shqipëri?</p>
            </ArticleSection>

            <ArticleSection id="perfundim" title="Përfundim: Drejt një Kuadri të Integruar">
                <p>Duke kombinuar këto katër elemente – efikasiteti i matur sipas standardeve evropiane, cilësia e thelluar e arsyetimit, analiza rigoroze empirike dhe ndikimi institucional – ne krijojmë një kuadër të plotë dhe të fuqishëm për të vlerësuar performancën gjyqësore. Kjo qasje e lejon projektin tonë të ofrojë një pasqyrë të qartë, të bazuar në prova dhe strategjikisht relevante të gjendjes së jurisprudencës në ekosistemin shqiptar, duke identifikuar jo vetëm problemet, por edhe rrugët për përmirësim.</p>
            </ArticleSection>

            <ArticleSection id="indeksi" title="Indeksi i Termave Teknikë (Fjalori Analitik)">
                <GlossaryComponent />
            </ArticleSection>

            <ArticleSection id="bibliografia" title="Bibliografia dhe Referencat">
                 <ol className="list-decimal list-inside space-y-2 text-sm">
                    {sourcesList.map(source => (
                        <li key={source.id} id={`ref-${source.id}`}>
                            <a href={`https://${source.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-words">
                                {source.text}
                            </a>
                        </li>
                    ))}
                </ol>
            </ArticleSection>
        </>
    ), [sourcesList]);

    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText,
            { url: window.location.href, published_at: new Date().toISOString(), article_id: 'judicial-performance-02' },
            sourcesList,
            { researchHours: 65, focusKeyword: "Performanca Gjyqësore" }
        );
    }, [fullArticleText, sourcesList]);

    const articleIntegrityProfile = useMemo(() => calculateArticleIntegrityProfile(articleMetrics), [articleMetrics]);

    const tocItems = [
        { id: 'hyrje', title: 'Hyrje: Nga Sasia te Cilësia' },
        { id: 'efikasiteti', title: 'Elementi I: Efikasiteti i Drejtësisë' },
        { id: 'cilesia', title: 'Elementi II: Cilësia e Arsyetimit Gjyqësor' },
        { id: 'analiza-empirike', title: 'Elementi III: Drejtësia e Bazuar në të Dhëna' },
        { id: 'ndikimi', title: 'Elementi IV: Lidhja Institucionale' },
        { id: 'perfundim', title: 'Përfundim: Drejt një Kuadri të Integruar' },
        { id: 'indeksi', title: 'Indeksi i Termave Teknikë' },
        { id: 'bibliografia', title: 'Bibliografia dhe Referencat' },
    ];
    
    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Performanca Gjyqësore"
            headerSubtitle="Nga Sasia te Cilësia dhe Ndikimi"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 18 Korrik, 2025",
                location: "Tiranë, Shqipëri"
            }}
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
