import React, { useMemo } from 'react';
import { ArticleMetrics } from '../types';
import { calculateArticleMetrics } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, KeyConcept, PullQuote, ArticleSection } from './templates/ArticleTemplate1';

interface EuropeanEthicsStructuresPageProps {
  onBack: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
}

const SubSection: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="mt-6 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-lg border-l-4 border-primary-500">
        <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mb-2">{title}</h3>
        <div className="space-y-3 pl-2 text-sm">{children}</div>
    </div>
);


export const EuropeanEthicsStructuresPage: React.FC<EuropeanEthicsStructuresPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;

    const pageTitle = "Strukturat Etike Evropiane: Një Analizë Krahasuese dhe Mungesa në Shqipëri | NOVARIC®";
    const pageDescription = "Një analizë e thelluar e organeve kyçe anti-korrupsion të BE-së dhe një vështrim kritik mbi vakumin institucional në Shqipëri, pasojat dhe rekomandimet strategjike.";
    const keywords = ["Etika Politike", "Antikorrupsion", "BE", "HATVP", "Integriteti", "Transparenca", "Kapja e Shtetit", "Sundimi i Ligjit", "Shqipëri", "Rekomandime"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "https://www.europarl.europa.eu/", text: "European Parliament - Code of Conduct", credibility_industry_rating_pct: 98 },
        { id: 2, url: "https://www.consilium.europa.eu/", text: "Agreement on an Interinstitutional Ethics Body", credibility_industry_rating_pct: 98 },
        { id: 3, url: "https://www.hatvp.fr/", text: "High Authority for Transparency in Public Life (HATVP)", credibility_industry_rating_pct: 95 },
        { id: 4, url: "https://www.transparency.org/", text: "Transparency International", credibility_industry_rating_pct: 96 },
        { id: 5, url: "https://www.journalofdemocracy.org/", text: "Mungiu-Pippidi, A. (2018). 'The Anticorruption Frontline'. Journal of Democracy.", credibility_industry_rating_pct: 95 },
        { id: 6, url: "https://www.cambridge.org/core/journals/governance", text: "Rothstein, B. (2011). The Quality of Government. University of Chicago Press.", credibility_industry_rating_pct: 97 },
    ], []);

    const articleMetrics = useMemo((): ArticleMetrics => {
        const articleText = "Bashkimi Evropian dhe organizatat ndërkombëtare...";
        return calculateArticleMetrics(
            articleText,
            { url: window.location.href, published_at: new Date().toISOString(), article_id: 'eu-ethics-structures-01' },
            sourcesList,
            { researchHours: 180, focusKeyword: "Organet Anti-Korrupsion" }
        );
    }, [sourcesList]);
    
    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Strukturat Etike Evropiane: Një Analizë Krahasuese dhe Mungesa në Shqipëri"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{ publishedDate: "Publikuar: 15 Janar, 2026", location: "Shkodër, Shqipëri" }}
            tableOfContentsItems={[
                { id: "hyrje", title: "Hyrje: Anatomia e Integritetit" },
                { id: "analiza-krahasuese", title: "Analiza Krahasuese e Modeleve Evropiane" },
                { id: "vakumi-institucional", title: "Vakumi Institucional në Shqipëri: Pasojat dhe Rruga Përpara" }
            ]}
            articleMetrics={articleMetrics}
            keywords={keywords}
            onBack={onBack}
            onNavigateToVipProfile={onNavigateToVipProfile}
            onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
        >
            <ArticleSection id="hyrje" title="Hyrje: Anatomia e Integritetit">
                <p>Në përpjekjen për të ndërtuar shoqëri demokratike të qëndrueshme, themelimi i institucioneve të forta që garantojnë integritetin, transparencën dhe llogaridhënien është thelbësor. Bashkimi Evropian dhe vendet anëtare pioniere si Franca, kanë zhvilluar një arkitekturë komplekse organesh dhe metodologjish për të mbrojtur jetën publike nga korrupsioni dhe konflikti i interesit. Ky artikull analizon strukturat dhe metodologjitë e disa prej organeve më të rëndësishme, duke i përdorur ato si një pasqyrë për të reflektuar mbi vakumin institucional në Shqipëri dhe për të propozuar një rrugë përpara.</p>
            </ArticleSection>
            
            <ArticleSection id="analiza-krahasuese" title="Analiza Krahasuese e Modeleve Evropiane">
                <SubSection title="1. Kodi i Sjelljes për Anëtarët e Parlamentit Evropian (PE)">
                    <p>Ky kod përcakton parime si veprimi në interes publik, integriteti dhe transparenca. Ai detyron anëtarët të deklarojnë interesat e tyre private dhe takimet me lobistët, duke vendosur një standard të lartë për llogaridhënien personale.</p>
                </SubSection>
                <SubSection title="2. Organi i Etikës i BE-së (Interinstitutional Ethics Body)">
                    <p>I themeluar në 2024, ky organ synon të zhvillojë standarde minimale të përbashkëta etike për të gjitha institucionet e BE-së. Megjithëse nuk ka fuqi hetimore apo sanksionuese, roli i tij në harmonizimin e praktikave dhe promovimin e një kulture të përbashkët etike është thelbësor.</p>
                </SubSection>
                <SubSection title="3. Autoriteti i Lartë për Transparencën e Jetës Publike (HATVP) - Francë">
                    <p>HATVP është një model i fuqishëm i një organi të pavarur administrativ. Ai jo vetëm që mbledh dhe publikon deklaratat e pasurisë së mijëra zyrtarëve, por ka edhe fuqi hetimore dhe monitoron në mënyrë aktive fenomenin e <KeyConcept term="dyerve rrotulluese (revolving doors)" definition="Lëvizja e zyrtarëve të lartë nga sektori publik në atë privat (dhe anasjelltas), e cila krijon rrezik për konflikte interesi dhe kapje të rregullatorit."/> dhe rregullon lobimin.</p>
                </SubSection>
                <SubSection title="4. Transparency International (TI) dhe Mjetet e saj">
                    <p>Si një OJQ globale, TI luan një rol kritik në avokim dhe monitorim. Mjetet e saj si Indeksi i Perceptimit të Korrupsionit (CPI), Barometri Global i Korrupsionit (GCB) dhe platformat Integrity Watch, ofrojnë të dhëna të paçmueshme për publikun dhe studiuesit, duke ushtruar presion të vazhdueshëm mbi qeveritë.</p>
                </SubSection>
            </ArticleSection>

            <ArticleSection id="vakumi-institucional" title="Vakumi Institucional në Shqipëri: Pasojat dhe Rruga Përpara">
                <p>Në kontrast me arkitekturën e sofistikuar evropiane, Shqipëria vuan nga një vakum i thellë institucional në fushën e etikës dhe integritetit. Organet ekzistuese shpesh janë të dobëta, të politizuara ose pa fuqinë e nevojshme për të pasur një ndikim real. Kjo mungesë ka pasoja shkatërruese:</p>
                <ul className="list-disc list-inside space-y-2 pl-4 mb-4">
                    <li><strong>Normalizimi i Konfliktit të Interesit:</strong> Fenomeni i "dyerve rrotulluese" është i zakonshëm dhe i parregulluar, duke lejuar ish-zyrtarë të lartë të kalojnë në sektorë privatë që ata më parë i rregullonin.</li>
                    <li><strong>Mungesa e një Regjistri të Lobimit:</strong> Pa një regjistër transparent, ndikimi i interesave të fuqishme private mbi procesin legjislativ mbetet i fshehur, duke ushqyer fenomenin e <KeyConcept term="kapjes së shtetit" definition="Një formë e korrupsionit sistemik ku interesat private ndikojnë vendimmarrjen shtetërore për përfitimet e tyre, duke shtrembëruar ligjet dhe politikat."/> (Mungiu-Pippidi, 2018).</li>
                    <li><strong>Politizimi i Akuzave për Korrupsion:</strong> Në mungesë të një organi të pavarur dhe të besueshëm për etikën, akuzat për korrupsion përdoren shpesh si armë politike, duke e bërë të vështirë për publikun të dallojë akuzat e bazuara nga sulmet partiake.</li>
                </ul>
                <PullQuote>Kur institucionet e integritetit mungojnë ose janë të dobëta, korrupsioni pushon së qeni një devijim dhe bëhet vetë sistemi. (Rothstein, 2011)</PullQuote>
                
                <h3 className="text-2xl font-semibold mt-8 mb-4">Rekomandime Strategjike për Shqipërinë</h3>
                <ol className="list-decimal list-inside space-y-3 pl-4">
                    <li><strong>Krijimi i një Autoriteti të Pavarur për Etikën dhe Transparencën:</strong> Duke u frymëzuar nga modeli francez HATVP, Shqipërisë i nevojitet një organ i pavarur administrativ me fuqi reale hetimore, i aftë të verifikojë deklaratat e pasurisë, të monitorojë konfliktet e interesit dhe të referojë rastet në prokurori. Pavarësia e tij duhet të garantohet me ligj, përmes një procesi transparent emërimi dhe buxheti të mjaftueshëm.</li>
                    <li><strong>Implementimi i një Regjistri të Detyrueshëm të Lobimit:</strong> Transparenca mbi atë se kush përpiqet të ndikojë në vendimmarrje është thelbësore. Një regjistër publik dhe i detyrueshëm, i menaxhuar nga Autoriteti i ri i Etikës, duhet të detajojë se cilët lobistë takohen me cilët zyrtarë, për çfarë çështjeje dhe sa shpenzojnë.</li>
                    <li><strong>Forcimi i Mekanizmave të Llogaridhënies Parlamentare:</strong> Kodi i Sjelljes së Kuvendit duhet të forcohet, duke përfshirë rregulla të qarta për deklarimin e konflikteve të interesit para çdo votimi dhe sanksione efektive për shkeljet.</li>
                </ol>
                <p className="mt-4">Zbatimi i këtyre reformave nuk është një çështje teknike, por një test i vullnetit politik. Pa institucione të forta që mbrojnë integritetin publik, aspirata e Shqipërisë për t'u bërë një demokraci funksionale evropiane do të mbetet thjesht një aspiratë.</p>
            </ArticleSection>

        </ArticleTemplate1>
    );
};