import React, { useMemo, ReactNode } from 'react';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';

interface JournalisticEthicsManualProps {
  onBack: () => void;
  onNavigateToMediaEducationFramework: () => void;
  onNavigateToNovaricCodeOfStandards: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
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

export const JournalisticEthicsManual: React.FC<JournalisticEthicsManualProps> = (props) => {
    const { 
        onBack, 
        onNavigateToMediaEducationFramework, 
        onNavigateToNovaricCodeOfStandards,
        onNavigateToNoraAiProfile,
        onNavigateToVipProfile,
        onNavigateToArticleMetricsExplained
    } = props;
    
    const pageTitle = "Manuali i Etikës Gazetareske | NOVARIC®";
    const pageDescription = "Mësoni për parimet themelore të përgjegjësisë, saktësisë, pavarësisë dhe integritetit që udhëheqin punën tonë gazetareske në NOVARIC®.";
    const keywords = ["Etika Gazetareske", "Standarde Mediatike", "Përgjegjësia e Medias", "Verifikim Faktesh", "Paanshmëri", "Transparencë", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "https://www.amazon.com/Elements-Journalism-What-Newspeople-Should/dp/0804136787", text: "Kovach, B., & Rosenstiel, T. (2014). The elements of journalism. Three Rivers Press.", credibility_industry_rating_pct: 98 },
        { id: 2, url: "https://www.spj.org/ethicscode.asp", text: "Society of Professional Journalists (SPJ). Code of Ethics.", credibility_industry_rating_pct: 95 },
        { id: 3, url: "https://accountablejournalism.org/", text: "Ethical Journalism Network. The 5 Principles of Ethical Journalism.", credibility_industry_rating_pct: 92 },
        { id: 4, url: "https://europeanjournalists.org/wp-content/uploads/2019/11/IFJ_Global_Charter_of_Ethics_for_Journalists.pdf", text: "International Federation of Journalists (IFJ). Global Charter of Ethics for Journalists.", credibility_industry_rating_pct: 94 },
    ], []);

    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="Hyrje: Përgjegjësia Jonë Themelore">
                <p>Në një epokë të mbushur me informacion dhe dezinformim, roli i gazetarisë së përgjegjshme është më kritik se kurrë. Ky manual shërben si busulla etike për të gjithë anëtarët e redaksisë së NOVARIC®, duke siguruar që puna jonë të jetë gjithmonë në shërbim të së vërtetës dhe interesit publik.</p>
                <PullQuote>Mënyra se si e mbledhim lajmin është po aq e rëndësishme sa lajmi vetë.</PullQuote>
            </ArticleSection>

            <ArticleSection id="parimi1" title="Parimi I: Përgjegjësia dhe Saktësia">
                <p>Misioni ynë parësor është të raportojmë lajmin me saktësi, pa frikë dhe pa favorizime. Ne jemi përgjegjës ndaj publikut për saktësinë e informacionit që ofrojmë.</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong>Verifikimi i Fakteve:</strong> Të gjitha faktet duhet të verifikohen nga burime të besueshme para publikimit. Përdorimi i IA-së është një mjet ndihmës, por vendimi final dhe verifikimi i thelluar bëhet nga redaktorët njerëzorë.</li>
                    <li><strong>Konteksti është Kyç:</strong> Faktet duhet të paraqiten në kontekstin e duhur për të shmangur keqinterpretimet.</li>
                    <li><strong>Saktësia në Citime:</strong> Citatet duhet të jenë besnike ndaj fjalëve dhe kontekstit të folësit.</li>
                </ul>
            </ArticleSection>
            
            <ArticleSection id="parimi2" title="Parimi II: Pavarësia dhe Paanshmëria">
                <p>Për të ruajtur besimin e publikut, ne duhet të jemi të pavarur nga interesat që kërkojmë të mbulojmë. Gazetarët e NOVARIC® duhet të shmangin çdo <KeyConcept term="konflikt interesi" definition="Një situatë në të cilën interesat personale, financiare ose të tjera të një gazetari mund të kompromentojnë gjykimin e tij profesional dhe paanshmërinë."/>, real apo të perceptuar.</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong>Paanshmëria në Raportim:</strong> Raportimi duhet të jetë i balancuar dhe i paanshëm. Ne paraqesim të gjitha anët relevante të një historie.</li>
                    <li><strong>Pavarësia Editoriale:</strong> Vendimet tona editoriale janë të lira nga çdo ndikim politik.</li>
                </ul>
            </ArticleSection>

            <ArticleSection id="parimi3" title="Parimi III: Drejtësia, Ndershmëria dhe Privatësia">
                <p>Ne i trajtojmë burimet, subjektet dhe kolegët tanë me respekt dhe ndershmëri.</p>
                 <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong><KeyConcept term="E Drejta për t'u Përgjigjur" definition="Parimi etik që kërkon që individët ose grupet që janë subjekt i akuzave serioze t'u jepet një mundësi e arsyeshme për t'u përgjigjur para publikimit."/>:</strong> Personat ose institucionet që janë subjekt i akuzave apo kritikave serioze duhet të kenë gjithmonë mundësinë për t'u përgjigjur.</li>
                    <li><strong>Respekti për Privatësinë:</strong> Ne respektojmë privatësinë e individëve dhe jemi veçanërisht të kujdesshëm me të miturit dhe viktimat e traumave.</li>
                </ul>
            </ArticleSection>
            
            <ArticleSection id="parimi4" title="Parimi IV: Integriteti dhe Transparenca">
                 <p>Besueshmëria jonë varet nga integriteti i punës sonë dhe transparenca e proceseve tona.</p>
                 <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong>Mbrojtja e Burimeve:</strong> Ne i mbrojmë <KeyConcept term="burimet tona konfidenciale" definition="Burime informacioni që ofrojnë të dhëna me kushtin që identiteti i tyre të mos bëhet publik, duke u përdorur vetëm kur informacioni është jetik dhe nuk mund të merret ndryshe." />. Premtimi i anonimitetit është një angazhim serioz.</li>
                    <li><strong>Atribuimi i Burimeve:</strong> Ne i atribuojmë qartë informacionet burimeve të tyre. <KeyConcept term="Plagjiatura" definition="Paraqitja e punës ose ideve të dikujt tjetër si të tuajat, pa i dhënë kreditin e duhur. Konsiderohet një nga shkeljet më të rënda të etikës akademike dhe gazetareske." /> është një shkelje e papranueshme.</li>
                    <li><strong>Ndarja e Qartë e Lajmit nga Opinioni:</strong> Lajmet, analizat dhe opinionet duhet të jenë qartësisht të dallueshme për audiencën.</li>
                </ul>
            </ArticleSection>

            <ArticleSection id="parimi5" title="Parimi V: Llogaridhënia dhe Korrigjimi i Gabimeve">
                <p>Ne jemi të llogaridhënshëm ndaj audiencës sonë. Kur bëjmë gabime, i pranojmë dhe i korrigjojmë me shpejtësi dhe në mënyrë të dukshme.</p>
            </ArticleSection>

            <ArticleSection id="parimi6" title="Parimi VI: Praktika Vetë-Rregulluese dhe Përputhshmëria">
                 <p>Në përputhje me praktikat më të mira dhe Aktin Evropian për Lirinë e Medias (EMFA), NOVARIC® ka krijuar një kornizë të brendshme për të siguruar llogaridhënie dhe për të trajtuar ankesat e publikut përmes një Bordi Editorial dhe një procedure të qartë ankesash publike.</p>
            </ArticleSection>

            <ArticleSection id="parimi7" title="Parimi VII: Përputhshmëria me Standardet Ndërkombëtare">
                 <p>NOVARIC® njeh dhe respekton standardet e vendosura nga organizatat kryesore ndërkombëtare si Kodi i Parimeve i Rrjetit Ndërkombëtar të Verifikimit të Fakteve (IFCN) dhe Kodi i Standardeve të Rrjetit Evropian të Standardeve të Verifikimit të Fakteve (EFCSN).</p>
                 <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-blue-800 dark:text-blue-300">
                        Për të parë në detaje se si i kemi adoptuar këto standarde, ju lutemi konsultoni: <button onClick={onNavigateToNovaricCodeOfStandards} className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">Kodi i Standardeve NOVARIC®</button>.
                        Për më shumë detaje mbi kornizën tonë specifike të vlerësimit të medias, lexoni: <button onClick={onNavigateToMediaEducationFramework} className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">Korniza e Vlerësimit Mediatik</button>.
                    </p>
                </div>
            </ArticleSection>
        </>
    ), [onNavigateToMediaEducationFramework, onNavigateToNovaricCodeOfStandards]);

    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText, 
            {
                url: window.location.href,
                published_at: "2025-06-01T08:00:00Z",
                article_id: 'manuali-etikes-01'
            }, 
            sourcesList,
            {
                researchHours: 80,
                focusKeyword: "Etika Gazetareske"
            }
        );
    }, [fullArticleText, sourcesList]);

    const articleIntegrityProfile = useMemo((): ArticleIntegrityProfileData => {
        return calculateArticleIntegrityProfile(articleMetrics);
    }, [articleMetrics]);

    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Manuali i Etikës Gazetareske"
            headerSubtitle="Parimet themelore të përgjegjësisë, saktësisë, pavarësisë dhe integritetit që udhëheqin punën tonë."
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 1 Qershor, 2025",
                lastUpdated: "8 Qershor, 2025",
                location: "Shkodër, Shqipëri"
            }}
            tableOfContentsItems={[
                { id: "hyrje", title: "Hyrje: Përgjegjësia Jonë Themelore" },
                { id: "parimi1", title: "Parimi I: Përgjegjësia dhe Saktësia" },
                { id: "parimi2", title: "Parimi II: Pavarësia dhe Paanshmëria" },
                { id: "parimi3", title: "Parimi III: Drejtësia, Ndershmëria dhe Privatësia" },
                { id: "parimi4", title: "Parimi IV: Integriteti dhe Transparenca" },
                { id: "parimi5", title: "Parimi V: Llogaridhënia dhe Korrigjimi" },
                { id: "parimi6", title: "Parimi VI: Praktika Vetë-Rregulluese" },
                { id: "parimi7", title: "Parimi VII: Përputhshmëria Ndërkombëtare" }
            ]}
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