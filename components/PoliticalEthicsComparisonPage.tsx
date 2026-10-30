import React, { useMemo } from 'react';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, KeyConcept, PullQuote, ArticleSection } from './templates/ArticleTemplate1';

interface PoliticalEthicsComparisonPageProps {
  onBack: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
}

const Table: React.FC<{ headers: string[]; data: (string | React.ReactElement)[][]; }> = ({ headers, data }) => (
    <div className="overflow-x-auto my-4 shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-100 dark:bg-slate-700">
                <tr>
                    {headers.map(header => (
                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className={`px-6 py-4 whitespace-normal text-sm ${cellIndex > 0 ? 'border-l border-slate-200 dark:border-slate-700' : ''}`}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


export const PoliticalEthicsComparisonPage: React.FC<PoliticalEthicsComparisonPageProps> = ({ onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained }) => {
    
    const pageTitle = 'Etika Politike: Një Analizë Krahasuese Shqipëri vs. Eurozonë | NOVARIC®';
    const pageDescription = 'Një analizë e thelluar e dallimeve në etikën politike midis Shqipërisë dhe vendeve të Eurozonës. Eksplorojmë ndikimin e institucioneve, klientelizmit dhe llogaridhënies, duke u mbështetur në kërkime nga shkenca politike dhe sociologjia.';
    const keywords = ["Etika Politike", "Llogaridhënia", "Korrupsioni", "Klientelizmi", "Kapja e Shtetit", "Eurozona", "Politika Shqiptare", "Demokracia", "Institucione të Dobëta", "Shteti i së Drejtës", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "", text: "O'Donnell, G. (1998). Horizontal Accountability in New Democracies. Journal of Democracy, 9(3), 112-126.", credibility_industry_rating_pct: 95 },
        { id: 2, url: "", text: "Rothstein, B., & Teorell, J. (2008). What Is Quality of Government? A Theory of Impartial Government Institutions. Governance, 21(2), 165-190.", credibility_industry_rating_pct: 94 },
        { id: 3, url: "", text: "Schedler, A. (1999). Conceptualizing Accountability. In The Self-Restraining State: Power and Accountability in New Democracies. Lynne Rienner Publishers.", credibility_industry_rating_pct: 92 },
        { id: 4, url: "", text: "Habermas, J. (1989). The structural transformation of the public sphere. MIT Press.", credibility_industry_rating_pct: 98 },
        { id: 5, url: "", text: "Grzymala-Busse, A. (2007). Rebuilding Leviathan: Party Competition and State Exploitation in Post-Communist Democracies. Cambridge University Press.", credibility_industry_rating_pct: 95 },
        { id: 6, url: "", text: "Mungiu-Pippidi, A. (2015). The Quest for Good Governance: How Societies Develop Control of Corruption. Cambridge University Press.", credibility_industry_rating_pct: 93 },
        { id: 7, url: "", text: "Kitschelt, H. (2000). Linkages Between Citizens and Politicians in Democratic Polities. Comparative Political Studies, 33(6-7), 845-879.", credibility_industry_rating_pct: 96 },
        { id: 8, url: "", text: "Hellman, J. S. (1998). Winners Take All: The Politics of Partial Reform in Postcommunist Transitions. World Politics, 50(2), 203-234.", credibility_industry_rating_pct: 94 },
        { id: 9, url: "", text: "Thompson, D. F. (1995). Ethics in Congress: From Individual to Institutional Corruption. Brookings Institution Press.", credibility_industry_rating_pct: 92 },
        { id: 10, url: "", text: "Warren, M. E. (2004). What Does Corruption Mean in a Democracy?. American Journal of Political Science, 48(2), 328-343.", credibility_industry_rating_pct: 95 },
        { id: 11, url: "", text: "Johnston, M. (2005). Syndromes of Corruption: Wealth, Power, and Democracy. Cambridge University Press.", credibility_industry_rating_pct: 93 },
        { id: 12, url: "", text: "North, D. C. (1990). Institutions, Institutional Change and Economic Performance. Cambridge University Press.", credibility_industry_rating_pct: 97 },
    ], []);

    const articleMetrics = useMemo((): ArticleMetrics => {
        const articleText = "Debati mbi etikën politike shpesh degradohet në një diskutim mbi karakterin moral të individëve...";
        
        return calculateArticleMetrics(
            articleText, 
            {
                url: window.location.href,
                published_at: "2025-09-01T22:00:00Z",
                article_id: 'political-ethics-comparison-01'
            }, 
            sourcesList,
            {
                researchHours: 300,
                focusKeyword: "Etika Politike"
            }
        );
    }, [sourcesList]);

    const articleIntegrityProfile = useMemo((): ArticleIntegrityProfileData => {
        return calculateArticleIntegrityProfile(articleMetrics);
    }, [articleMetrics]);

    const comparisonTableData = [
        ['Konflikti i Interesit', 'I kodifikuar qartë; kërkon tërheqje nga vendimmarrja...', 'Shpesh i paqartë; kufijtë midis interesit publik dhe atij privat janë të lëvizshëm...'],
        ['Financimi i Partive', 'I rregulluar rreptësisht, me kufij donacionesh...', 'Shpesh opak, me lidhje të forta me interesa biznesi...'],
        ['Llogaridhënia Primare', 'Ndaj Kushtetutës, ligjit dhe elektoratit...', 'Ndaj liderit të partisë, rrjetit të patronazhit...'],
        ['Përgjigja ndaj Skandalit', 'Zakonisht çon në dorëheqje për shkak të presionit...', 'Shpesh mohohet, politizohet ("sulm politik")...'],
        ['Roli i Medias', '"Watchdog" që ekspozon shkeljet...', '"Attack dog" (sulmon kundërshtarët) ose "Lapdog" (mbron aleatët)...'],
    ];

    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Etika Politike: Një Analizë Krahasuese"
            headerSubtitle="Strukturat e Llogaridhënies në Shqipëri përballë Idealit të Eurozonës"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaricstorage.blob.core.windows.net/media/AdobeStock_1030253027.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaricstorage.blob.core.windows.net/media/Profile-Photos/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 1 Shtator, 2025",
                lastUpdated: "20 Tetor, 2025",
                location: "Shkodër, Shqipëri"
            }}
            tableOfContentsItems={[
                { id: "hyrje", title: "Hyrje: Përtej Moralit Individual" },
                { id: "modeli-eurozones", title: "Modeli i Eurozonës: Etika e Kodifikuar" },
                { id: "konteksti-shqiptar", title: "Konteksti Shqiptar: Etika e Negociuar" },
                { id: "tabela-krahasuese", title: "Tabela Krahasuese" },
                { id: "perfundime", title: "Përfundime: Roli i NOVARIC®" },
                { id: "referencat", title: "Referencat Themelore" }
            ]}
            articleMetrics={articleMetrics}
            articleIntegrityProfile={articleIntegrityProfile}
            keywords={keywords}
            onBack={onBack}
            onNavigateToVipProfile={onNavigateToVipProfile}
            onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
        >
            <ArticleSection id="hyrje" title="Hyrje: Përtej Moralit Individual, Drejt Analizës Institucionale">
                <p>Debati mbi etikën politike shpesh degradohet në një diskutim mbi karakterin moral të individëve. Megjithatë, një analizë serioze, e bazuar në shkencat politike dhe sociologjike, tregon se sjellja etike e politikanëve formësohet më pak nga virtytet e tyre personale dhe më shumë nga strukturat institucionale dhe normat shoqërore brenda të cilave ata veprojnë. Kjo analizë krahason dy modele të ndryshme: "tipin ideal" të etikës politike në demokracitë e konsoliduara të Eurozonës dhe realitetin kompleks të një demokracie post-komuniste si Shqipëria.</p>
                <PullQuote>Dallimi themelor ... nuk qëndron në një mungesë të natyrshme etike, por në mbizotërimin e sistemeve të ndryshme të llogaridhënies.</PullQuote>
                <p>Në Eurozonë mbizotëron një sistem i bazuar te llogaridhënia formale, horizontale, ndërsa në Shqipëri, ky sistem shpesh anashkalohet nga një sistem më i fuqishëm i llogaridhënies informale, vertikale ndaj rrjeteve klienteliste.</p>
            </ArticleSection>
            
            <ArticleSection id="modeli-eurozones" title="Modeli i Eurozonës: Etika e Kodifikuar dhe Llogaridhënia Horizontale">
                <p>Në demokracitë e pjekura të Eurozonës, etika politike është e ankoruar në një ekosistem të fuqishëm institucionesh autonome. Ky model bazohet në disa shtylla:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Sundimi i Ligjit dhe Institucionet e Forta:</strong> Baza e etikës është ligji, jo morali personal... Kjo është thelbi i asaj që Guillermo O'Donnell (1998) e quan <KeyConcept term="llogaridhënie horizontale" definition="Aftësia e institucioneve shtetërore (p.sh., gjykata, agjenci anti-korrupsion) për të kontrolluar dhe balancuar pushtetin e degëve të tjera të qeverisjes."/>—aftësia e institucioneve shtetërore për të kontrolluar dhe balancuar njëra-tjetrën.</li>
                    <li><strong>Etosi i Shërbimit Publik:</strong> Ekziston një pritshmëri e rrënjosur kulturalisht që posti publik është një shërbim ndaj shtetit dhe qytetarëve, jo një mjet për pasurim personal apo për të favorizuar grupin e interesit.</li>
                    <li><strong>Sfera Publike Vigjilente:</strong> Një sferë publike e shëndetshme, e përbërë nga media të lira (që luajnë rolin e "watchdog"), një shoqëri civile aktive dhe një akademi kritike, shërben si një mekanizëm i jashtëm kontrolli (Habermas, 1989).</li>
                    <li><strong>Transparenca si Normë:</strong> Pritet që financimi i partive, lobimi dhe vendimmarrja të jenë procese transparente dhe të aksesueshme për publikun.</li>
                </ul>
            </ArticleSection>
            
            <ArticleSection id="konteksti-shqiptar" title="Konteksti Shqiptar: Etika e Negociuar dhe Llogaridhënia Informale">
                    <p>Në Shqipëri, fasada e institucioneve demokratike shpesh fsheh një realitet ku rregullat informale dominojnë. Kjo është një trashëgimi direkte e tranzicionit post-komunist, ku shtetet e dobëta u bënë pre e <KeyConcept term="kapjes së shtetit" definition="Një formë e korrupsionit sistemik ku interesat private (biznese, klane) ndikojnë në mënyrë të paligjshme në vendimmarrjen shtetërore për përfitimet e tyre."/> nga partitë politike dhe interesat private (Grzymala-Busse, 2007).</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Mbizotërimi i Rrjeteve Klienteliste:</strong> Etika shpesh nuk është një çështje e respektimit të ligjit, por e besnikërisë ndaj rrjetit të patronazhit. Në një <KeyConcept term="sistem klientelist" definition="Një marrëdhënie shoqërore dhe politike ku një 'patron' (lider) shpërndan favore (p.sh., vende pune) te 'klientët' (mbështetësit) në këmbim të besnikërisë dhe votave."/>, detyrimi primar i një politikani nuk është ndaj shtetit apo publikut të gjerë, por ndaj "patronit" (Kitschelt, 2000).</li>
                    <li><strong>Dobësia e Llogaridhënies Horizontale:</strong> Pavarësisht reformave, institucionet e kontrollit shpesh mbeten të politizuara. Kur institucionet që duhet të kontrollojnë njëra-tjetrën janë pjesë e të njëjtave rrjete informale, llogaridhënia horizontale dështon (O'Donnell, 1998).</li>
                    <li><strong>"Kapja e Medias" dhe Sfera Publike e Fragmentuar:</strong> Në vend të një media "watchdog", Shqipëria shpesh përballet me "kapjen e medias", ku pronarët e mediave i përdorin ato për të mbrojtur interesat e tyre ekonomike dhe politike (Mungiu-Pippidi, 2015).</li>
                    <li><strong>Normalizimi i Shkeljeve:</strong> Në një kontekst të "korrupsionit sistemik", ku shkeljet janë të shpeshta, normat etike erodohen.</li>
                </ul>
            </ArticleSection>

            <ArticleSection id="tabela-krahasuese" title="Tabela Krahasuese: Pikat Kryesore të Divergjencës">
                <Table headers={['Çështja Etike', 'Modeli i Eurozonës (Ideal Tipi)', 'Realiteti Shqiptar (Modeli Dominues)']} data={comparisonTableData.map(row => row.map((cell, index) => <span key={index}>{cell}</span>))} />
            </ArticleSection>
            
            <ArticleSection id="perfundime" title="Përfundime: Roli i NOVARIC® në Ndërtimin e Llogaridhënies">
                <p>Në thelb, NOVARIC® synon të jetë një mekanizëm i ri në ekosistemin shqiptar – një formë e llogaridhënies së bazuar te të dhënat që forcon zërin e qytetarit dhe rrit presionin për sjellje etike brenda sistemit politik.</p>
            </ArticleSection>

            <ArticleSection id="referencat" title="Referencat Themelore për Analizën e Etikës Politike">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    {sourcesList.map(source => (
                        <li key={source.id}>
                            {source.text}
                        </li>
                    ))}
                </ol>
            </ArticleSection>
        </ArticleTemplate1>
    );
};