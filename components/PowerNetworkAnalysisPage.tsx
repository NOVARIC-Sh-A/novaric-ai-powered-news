import React, { useMemo, ReactNode } from 'react';
import { ArticleMetrics } from '../types';
import { calculateArticleMetrics } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, KeyConcept } from './templates/ArticleTemplate1';

interface PowerNetworkAnalysisPageProps {
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

export const PowerNetworkAnalysisPage: React.FC<PowerNetworkAnalysisPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;
    
    const pageTitle = "Harta e Rrjetit të Pushtetit | Analiza e Ndikimit Informal - NOVARIC®";
    const pageDescription = "Eksploroni metodologjinë e avancuar të NOVARIC® për hartëzimin e rrjeteve informale të pushtetit në politikën shqiptare. Mësoni si përdorim Analizën e Rrjeteve Sociale (SNA) për të zbuluar ndërmjetësit e pushtetit, dhomat e jehonës dhe lidhjet klienteliste.";
    const keywords = ["Analiza e Rrjeteve Sociale", "SNA", "Harta e Pushtetit", "Rrjete Klienteliste", "Kapitali Social", "Ndërmjetësit e Pushtetit", "Elitat Politike", "Analizë Politike Shqipëri", "Ronald Burt", "Mark Granovetter", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "", text: "Grzymala-Busse, A. (2007). Rebuilding Leviathan: Party Competition and State Exploitation in Post-Communist Democracies. Cambridge University Press.", credibility_industry_rating_pct: 95 },
        { id: 2, url: "", text: "Wasserman, S., & Faust, K. (1994). Social Network Analysis: Methods and Applications. Cambridge University Press.", credibility_industry_rating_pct: 94 },
        { id: 3, url: "", text: "Burt, R. S. (2005). Brokerage and Closure: An Introduction to Social Capital. Oxford University Press.", credibility_industry_rating_pct: 94 },
        { id: 4, url: "", text: "Granovetter, M. S. (1973). The Strength of Weak Ties. American Journal of Sociology, 78(6), 1360-1380.", credibility_industry_rating_pct: 97 },
    ], []);
    
    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="problemi" title="1. Problemi: Anatomia e Fshehur e Pushtetit">
                <p>Në çdo sistem politik, vendimet formale janë vetëm maja e ajsbergut. Nën sipërfaqen e debateve parlamentare dhe vendimeve qeveritare shtrihet një anatomi e fshehur e pushtetit: një rrjet kompleks marrëdhëniesh, besnikërish, borxhesh dhe ndikimesh informale. Në kontekstin shqiptar, i formësuar nga trashëgimia e rrjeteve të patronazhit, këto struktura informale shpesh janë më vendimtare se ato formale (Grzymala-Busse, 2007).</p>
                <p>Problemi për qytetarin dhe analistin është se këto rrjete janë, për nga natyra e tyre, të padukshme. Ato operojnë në prapaskenë, duke e bërë të vështirë për të kuptuar se kush ndikon vërtet te kush, dhe pse merren vendime të caktuara. Pa një mjet për të ndriçuar këtë "kuti të zezë", çdo analizë politike mbetet e paplotë.</p>
            </ArticleSection>

            <ArticleSection id="zgjidhja" title="2. Zgjidhja Metodologjike: Analiza e Rrjeteve Sociale (SNA)">
                <p>Për t'iu përgjigjur kësaj sfide, NOVARIC® ka integruar në zemër të Metodologjisë PARAGON® parimet e Analizës së Rrjeteve Sociale (SNA). SNA është një fushë e fuqishme ndërdisiplinore që studion strukturat shoqërore duke përdorur teorinë e grafeve dhe rrjeteve (Wasserman & Faust, 1994). Ajo na lejon të bëjmë pikërisht atë që është e nevojshme: të bëjmë të dukshme marrëdhëniet e padukshme.</p>
                <p>Ne nuk e përdorim SNA për të analizuar "likes" në Facebook, por për të aplikuar rigorozitetin e saj matematik në hartëzimin e elitave politike dhe ekonomike. Duke përdorur ekskluzivisht të dhëna publike, ne ndërtojmë një "hartë" të marrëdhënieve, ku politikanët, biznesmenët, mediat dhe aktorët e tjerë janë "nyje" dhe lidhjet midis tyre (p.sh., anëtarësim i përbashkët në borde, bashkë-sponsorizim ligjesh, lidhje biznesi) janë "brinjë".</p>
            </ArticleSection>

            <ArticleSection id="konceptet" title="3. Konceptet Kyçe që Zbërthejmë përmes SNA">
                <p>Harta e rrjetit nuk është thjesht një vizualizim i bukur; ajo është një mjet analitik që na lejon të masim dhe të kuptojmë koncepte thelbësore të pushtetit.</p>
                <h3 className="text-xl font-semibold mt-6 mb-2">Centraliteti (Centrality): Kush Janë Aktorët Qendrorë?</h3>
                <p>Ne masim forma të ndryshme të centralitetit për të kuptuar rëndësinë e një aktori. Një politikan me <KeyConcept term="centralitet të lartë shkalle" definition="High degree centrality: Ka shumë lidhje direkte, duke qenë një 'yll' social."/> ka shumë lidhje direkte. Një politikan me <KeyConcept term="centralitet të lartë ndërmjetësie" definition="High betweenness centrality: Vepron si një ndërmjetës (broker), duke lidhur grupe të ndryshme që përndryshe do të ishin të shkëputura."/> vepron si një ndërmjetës, duke lidhur grupe të ndryshme. Këta ndërmjetës shpesh kanë një fuqi të jashtëzakonshme, pasi kontrollojnë rrjedhën e informacionit (Burt, 2005).</p>
                <h3 className="text-xl font-semibold mt-6 mb-2">Kapitali Social dhe Vrimat Strukturore (Structural Holes)</h3>
                <p>Duke u mbështetur në punën e Ronald Burt, ne analizojmë "vrimat strukturore" në rrjet – mungesën e lidhjeve midis grupeve të caktuara. Aktorët që pozicionohen për të kapërcyer këto vrima përfitojnë nga arbitrazhi i informacionit dhe kanë një kapital social të lartë.</p>
                <h3 className="text-xl font-semibold mt-6 mb-2">Forca e Lidhjeve të Dobëta (The Strength of Weak Ties)</h3>
                <p>Sipas teorisë së famshme të Mark Granovetter (1973), lidhjet tona të dobëta (njohjet e largëta) janë shpesh më të vlefshme për të marrë informacion të ri sesa lidhjet tona të forta (miqtë e ngushtë). Ne analizojmë nëse rrjeti i një politikani është i mbyllur dhe incestuoz (rrjet me mbyllje të lartë - high closure), apo i hapur dhe i larmishëm, i pasur me lidhje të dobëta.</p>
                <h3 className="text-xl font-semibold mt-6 mb-2">Dhomat e Jehonës dhe Fragmentimi (Echo Chambers & Fragmentation)</h3>
                <p>Duke analizuar se kush lidhet me kë, ne mund të identifikojmë vizualisht grupime të izoluara (klika politike ose ideologjike) që komunikojnë vetëm me njëri-tjetrin. Kjo na jep një masë sasiore të fragmentimit të elitës politike.</p>
            </ArticleSection>

            <ArticleSection id="zbatimi" title="4. Zbatimi Praktik në Faqen e Profilit Politik NOVARIC®">
                <p>Në çdo profil të një politikani, ne ofrojmë një version të thjeshtuar dhe interaktiv të kësaj analize:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Vizualizimi i Rrjetit Personal:</strong> Një grafik interaktiv që tregon politikanin në qendër dhe 10-15 "nyjet" më të rëndësishme me të cilat ai/ajo është i lidhur.</li>
                    <li><strong>Indeksi i Ndërmjetësimit (Brokerage Score):</strong> Një pikëzim që tregon nëse profili i politikanit tenton të jetë ai i një "ndërmjetësi" (që lidh botë të ndryshme) apo i një "insideri" (i rrënjosur thellë brenda një grupi të vetëm).</li>
                    <li><strong>Indeksi i Hapjes së Rrjetit (Network Openness Score):</strong> Një pikëzim që mat diversitetin e lidhjeve të politikanit.</li>
                </ul>
                <p>Duke e bërë të dukshme këtë anatomi të fshehur të pushtetit, ne nuk bëjmë akuza, por ofrojmë një mjet të fuqishëm analitik. Ne i japim qytetarit një lente të re për të interpretuar veprimet e një politikani, duke e ftuar atë të bëjë pyetjen thelbësore: A po e përdor ky politikan rrjetin e tij për të krijuar vlerë publike, apo për të përforcuar pushtetin privat?</p>
            </ArticleSection>
        </>
    ), []);

    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText,
            { url: window.location.href, published_at: new Date().toISOString(), article_id: 'power-network-analysis-01' },
            sourcesList,
            { researchHours: 300, focusKeyword: "Analiza e Rrjeteve Sociale" }
        );
    }, [fullArticleText, sourcesList]);

    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Harta e Rrjetit të Pushtetit"
            headerSubtitle="Analiza e Ndikimit Informal në Politikën Shqiptare"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaricstorage.blob.core.windows.net/media/AdobeStock_1030253027.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaricstorage.blob.core.windows.net/media/Profile-Photos/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{ publishedDate: "Publikuar: 1 Dhjetor, 2025", location: "Shkodër, Shqipëri" }}
            tableOfContentsItems={[
                { id: "problemi", title: "1. Problemi: Anatomia e Fshehur e Pushtetit" },
                { id: "zgjidhja", title: "2. Zgjidhja Metodologjike: Analiza e Rrjeteve Sociale (SNA)" },
                { id: "konceptet", title: "3. Konceptet Kyçe që Zbërthejmë përmes SNA" },
                { id: "zbatimi", title: "4. Zbatimi Praktik në Faqen e Profilit Politik NOVARIC®" }
            ]}
            articleMetrics={articleMetrics}
            keywords={keywords}
            onBack={onBack}
            onNavigateToVipProfile={onNavigateToVipProfile}
            onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
        >
            {articleContentJsx}
        </ArticleTemplate1>
    );
};