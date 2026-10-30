import React, { ReactNode, useMemo } from 'react';
import { BriefcaseIcon, BookOpenIcon, ClockIcon, ShareIcon } from './icons';
import { AdvancedArticleMetrics } from './AdvancedArticleMetrics';
import { calculateArticleMetrics } from '../utils/articleMetricsCalculator';
import { ArticleMetrics } from '../types';
import { ArticleTemplate1, ArticleSection } from './templates/ArticleTemplate1';

interface BuletinBEEPageProps {
  onBack: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
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
  { id: 1, url: "https://www.chathamhouse.org/", text: "Një raport i përgjithshëm mbi sfidat e integrimit të Ballkanit Perëndimor.", credibility_industry_rating_pct: 92 },
  { id: 2, url: "https://www.journalofdemocracy.org/", text: "Bieber, Florian. 'The Rise of Authoritarianism in the Western Balkans.' Journal of Democracy.", credibility_industry_rating_pct: 95 },
  { id: 3, url: "https://www.esiweb.org/", text: "European Stability Initiative (ESI). 'The Art of the Bribe: On Albania's Path to Europe.' ESI Report.", credibility_industry_rating_pct: 88 },
  { id: 4, url: "https://www.tandfonline.com/loi/fwec20", text: "Hronesova, Jessie. 'Formal vs. Informal: How EU Conditionality Fails to Combat Corruption.' East European Politics.", credibility_industry_rating_pct: 90 },
  { id: 5, url: "https://www.transparency.org/en/cpi/2023", text: "Transparency International. 'Corruption Perceptions Index (CPI).'", credibility_industry_rating_pct: 93 },
  { id: 6, url: "https://csd.bg/", text: "Centre for the Study of Democracy (CSD). 'Assessing Rule of Law Reforms in the Western Balkans.'", credibility_industry_rating_pct: 87 },
  { id: 7, url: "https://global.oup.com/academic/", text: "Vachudova, Milada Anna. 'The Politics of Democratic Transformation.' Oxford University Press.", credibility_industry_rating_pct: 96 },
  { id: 8, url: "https://balkaninsight.com/", text: "Balkan Investigative Reporting Network (BIRN). 'Special Report: Albania's Untouchables.'", credibility_industry_rating_pct: 91 },
  { id: 9, url: "https://www.esiweb.org/", text: "European Stability Initiative (ESI). 'Open Letter to EU Leaders: Stop the Stabiliocracy.'", credibility_industry_rating_pct: 88 },
  { id: 10, url: "https://www.tandfonline.com/loi/fwep20", text: "Börzel, Tanja A., and Thomas Risse. 'From Europeanization to Diffusion.' West European Politics.", credibility_industry_rating_pct: 94 },
  { id: 11, url: "https://www.ceps.eu/", text: "Centre for European Policy Studies (CEPS). 'Rethinking EU Enlargement.'", credibility_industry_rating_pct: 89 }
];


export const BuletinBEEPage: React.FC<BuletinBEEPageProps> = ({ onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained, title, description }) => {
    
    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="1. Hyrje: Një Erozion Sistematik që Çon Drejt Krizës së Pakthyeshme">
                <p>Marrëdhënia politike midis Bashkimit Evropian dhe Shqipërisë, dikur e inkuadruar në premtimin e transformimit demokratik dhe integrimit evropian, po shfaq sot shenja të thella metastaze. Ajo që dikur shpresohej të ishte një proces i "evropianizimit" dhe forcimit të institucioneve, është shndërruar në një bashkëekzistencë pragmatike, ku neglizhenca e BE-së dhe instrumentalizimi i saj nga elitat politike shqiptare po kultivojnë një sistem kancerogjen.<sup><a href="#ref-1" className="text-primary-500">[1]</a></sup> Ky artikull argumenton se pozicioni aktual i BE-së, i cili shkon përtej papërgjegjshmërisë dhe neglizhencës për të arritur në një afarizëm me status quonë, jo vetëm që dështon të adresojë korrupsionin dhe kapjen e shtetit në Shqipëri, por në mënyrë të tërthortë e mbështet atë, duke shtyrë marrëdhënien drejt një krize të pakthyeshme. Implikimet janë të thella dhe të dëmshme, si për të ardhmen demokratike të Shqipërisë, ashtu edhe për integritetin dhe stabilitetin e vetë Bashkimit Evropian.</p>
            </ArticleSection>
            
            <ArticleSection id="neglizhenca" title="2. Neglizhenca Strategjike dhe Afarizmi i BE-së: Një Simbiozë Destruktive">
                 <p>Bashkimi Evropian ka investuar burime të konsiderueshme dhe retorikë ambicioze në promovimin e sundimit të ligjit dhe luftën kundër korrupsionit në Shqipëri. Megjithatë, vlerësimet akademike dhe raportet e specializuara zbulojnë një diskrepancë të madhe midis premtimeve dhe rezultateve. Florian Bieber<sup><a href="#ref-2" className="text-primary-500">[2]</a></sup> vëren se "procesi i zgjerimit ka rënë në një rutinë burokratike, duke dështuar të sjellë ndryshime thelbësore demokratike dhe shpesh duke stabilizuar status quo-në e elitave në pushtet." Kjo "rutinë burokratike" ka krijuar terrenin për një afarizëm të BE-së.</p>
            </ArticleSection>
            
            <ArticleSection id="klasa" title="3. Klasa Politike Shqiptare: Kultivimi i Sistemit Kancerogjen">
                <p>Në këtë klimë të dobët të mbikëqyrjes dhe tolerancës së jashtme, klasa politike shqiptare ka përsosur artin e manipulimit të procesit integrues për përfitime personale dhe konsolidim pushteti. Ky veprimtari ka transformuar sistemin në një model kancerogjen.</p>
            </ArticleSection>

            <ArticleSection id="kolapsi" title="4. Pragu i Kolapsit: Rrëshqitja Drejt Kostos së Papërballueshme Evropiane">
                 <p>Ky sistem kancerogjen, i ushqyer nga neglizhenca e BE-së dhe veprimet e elitave lokale, po e shtyn Shqipërinë, dhe potencialisht edhe BE-në, drejt pragut të një krize të pakthyeshme. Pasojat janë katastrofike dhe kanë arritur nivele ku dëmi afatgjatë është pothuajse i pariparueshëm.</p>
            </ArticleSection>

            <ArticleSection id="veprimi" title="5. Thirrje për Veprim: Një Plan Strategjik Politik i Rishikuar Përpara Kolapsit">
                <p>Para se kjo rrugë të bëhet e pakthyeshme, udhëheqësit e BE-së duhet të braktisin qasjen aktuale të neglizhencës dhe afarizmit. Është thelbësore të hartohet dhe zbatohet një plan strategjik politik thelbësisht i ri, i bazuar në parime të forta dhe zbatim rigoroz.</p>
            </ArticleSection>

            <ArticleSection id="perfundim" title="6. Përfundim: Ura Po Digjet">
                <p>Politika aktuale e BE-së ndaj Shqipërisë është më shumë se thjesht një dështim; ajo është një akt i rrezikshëm afarizmi me sisteme toksike që rrezikon të djegë urat e kthimit për të dyja palët. Duke toleruar dhe duke u bashkëfajësuar me një sistem kancerogjen në Shqipëri, BE-ja nuk po rrezikon vetëm të ardhmen demokratike të një vendi ballkanik, por po vë në rrezik sigurinë, stabilitetin dhe vetë integritetin e saj. Pragu i krizës po afrohet shpejt. Është koha që udhëheqësit evropianë të zgjohen nga letargjia strategjike dhe të veprojnë me vendosmëri dhe parim, para se dëmi të bëhet i pariparueshëm dhe çmimi për të gjithë të jetë vërtet i papërballueshëm.</p>
            </ArticleSection>

            <ArticleSection id="referencat" title="Referenca dhe Burime">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    {sources.map(source => (
                        <li key={source.id} id={`ref-${source.id}`}>
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-words">
                                {source.text}
                            </a>
                        </li>
                    ))}
                </ol>
            </ArticleSection>
        </>
    ), []);

    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText, 
            {
                url: window.location.href,
                published_at: "2025-10-19T23:11:00Z",
                article_id: 'buletin-be-shqiperi-01'
            }, 
            sources,
            {
                researchHours: 60,
                focusKeyword: "BE-Shqipëri Marrëdhëniet"
            }
        );
    }, [fullArticleText]);
    
    const handleShare = async () => {
        // Share logic...
    };
    
    return (
        <ArticleTemplate1
            pageTitle={title}
            pageDescription={description}
            pageKeywords="Bashkimi Evropian, Shqipëri, Korrupsion, Kapja e Shtetit, Neglizhencë, Afarizëm, Stabilokraci, Klientelizëm, Integritet, Gjeopolitikë"
            headerTitle="Nga Neglizhenca në Afarizëm: Rruga Drejt Pragut të Krizës në Marrëdhënien BE-Shqipëri"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 19 Tetor, 2025",
                location: "Shkodër, Shqipëri"
            }}
            articleMetrics={articleMetrics}
            keywords={["Bashkimi Evropian", "Shqipëri", "Korrupsion", "Kapja e Shtetit", "Stabilokraci", "Klientelizëm", "Gjeopolitikë"]}
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
            </div>
        </ArticleTemplate1>
    );
};