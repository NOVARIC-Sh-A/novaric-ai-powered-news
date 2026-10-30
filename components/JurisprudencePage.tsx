import React, { useMemo, ReactNode } from 'react';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { GlossaryComponent } from './Glossary';

// FIX: Added missing props to match usage in SimplePage.tsx
interface JurisprudencePageProps {
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

const SourceLink: React.FC<{ s: number[] }> = ({ s }) => (
    <sup>
        {s.map((n, i) => <a key={i} href={`#ref-${n}`} className="text-primary-500 mx-0.5 no-underline">[{n}]</a>)}
    </sup>
);

export const JurisprudencePage: React.FC<JurisprudencePageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;

    const pageTitle = "Përforcimi i Shtetit të Së Drejtës në Shqipëri | NOVARIC®";
    const pageDescription = "Një analizë e thelluar e katër elementeve thelbësore që përbëjnë filozofinë tonë analitike për të vlerësuar shëndetin e shtetit të së drejtës në Shqipëri.";
    const keywords = ["Shteti i së Drejtës", "Jurisprudenca Shqiptare", "Kontrolli Gjyqësor", "Integrimi Evropian", "GJEDNJ", "Tranzicioni Post-Komunist", "Kapja e Shtetit", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "academic.oup.com/icon", text: "International Journal of Constitutional Law (I•CON)", credibility_industry_rating_pct: 98 },
        { id: 2, url: "kluwerlawonline.com/journal/European+Public+Law", text: "European Public Law", credibility_industry_rating_pct: 94 },
        { id: 3, url: "kluwerlawonline.com/journal/Common+Market+Law+Review", text: "Common Market Law Review", credibility_industry_rating_pct: 95 },
        { id: 4, url: "onlinelibrary.wiley.com/journal/14680386", text: "European Law Journal", credibility_industry_rating_pct: 94 },
        { id: 5, url: "westlaw.co.uk/law-journals/european-human-rights-law-review/", text: "European Human Rights Law Review", credibility_industry_rating_pct: 96 },
        { id: 6, url: "brill.com/view/journals/rcel/rcel-overview.xml", text: "Review of Central and East European Law", credibility_industry_rating_pct: 92 },
        { id: 7, url: "onlinelibrary.wiley.com/journal/17485991", text: "Regulation & Governance", credibility_industry_rating_pct: 91 },
    ], []);
    
    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="Hyrje: Përtej Përkufizimit Formal">
                <p>
                    <KeyConcept term="Shteti i së Drejtës" definition="Parimi që të gjithë anëtarët e një shoqërie—përfshirë ata në qeveri—konsiderohen të barabartë para ligjeve dhe proceseve ligjore të shpallura publikisht.">Shteti i së Drejtës</KeyConcept> nuk është një destinacion i arritur, por një proces dinamik dhe i kontestuar vazhdimisht. Përtej përkufizimit klasik të Dicey-t – mungesa e pushtetit arbitrar, barazia para ligjit dhe mbrojtja e lirive – në kontekstin e një demokracie të re si Shqipëria, ai përfaqëson betejën e përditshme për të ndërtuar institucione të pavarura, të llogaridhënshme dhe të afta për të kufizuar pushtetin. Ky artikull përcakton katër elementet thelbësore që përbëjnë filozofinë tonë analitike për të vlerësuar shëndetin e shtetit të së drejtës në Shqipëri, duke u mbështetur në një kuadër të pasur teorik dhe krahasues.
                </p>
                <PullQuote>
                    Kjo analizë nuk synon thjesht të përshkruajë vendimet gjyqësore, por të zbërthejë se si këto vendime kontribuojnë – ose dështojnë të kontribuojnë – në ndërtimin e një sistemi ku rregullat e lojës janë të drejta dhe të zbatueshme për të gjithë.
                </PullQuote>
            </ArticleSection>

            <ArticleSection id="elementi-1" title="Elementi I: Thelbi Kushtetues – Ndarja e Pushteteve dhe Kontrolli Gjyqësor">
                <p>
                    Themeli i çdo shteti të së drejtës është aftësia e gjyqësorit për të vepruar si një kontroll efektiv ndaj pushtetit legjislativ dhe ekzekutiv. Kjo nuk është një çështje teknike, por thelbi i "<KeyConcept term="kushtetutshmërisë globale" definition="Një fushë studimi që analizon parimet dhe praktikat kushtetuese përtej shtetit-komb, duke u fokusuar në dialogun midis gjykatave dhe normave ndërkombëtare.">kushtetutshmërisë globale</KeyConcept>" (global constitutionalism), një dialog i vazhdueshëm mbi kufijtë e pushtetit. Ky dialog global, i cili gjen forumin e tij kryesor në revista si <a href="#ref-1" className="font-semibold text-primary-500 hover:underline">International Journal of Constitutional Law (I•CON)</a><SourceLink s={[1]}/> dhe <a href="#ref-2" className="font-semibold text-primary-500 hover:underline">European Public Law</a><SourceLink s={[2]}/>, ofron standardet për të vlerësuar rolin e Gjykatës Kushtetuese dhe gjykatave administrative.
                </p>
                <p><strong>Pika Analitike për Shqipërinë:</strong> Analiza jonë do të fokusohet në vendimet kyçe ku gjykatat janë përballur me akte të qeverisë që sfidojnë parimet kushtetuese. Vendimi për Teatrin Kombëtar, për shembull, nuk ishte thjesht një çështje pronësie, por një test për aftësinë e gjyqësorit për të mbrojtur pasurinë publike dhe procedurat e rregullta ligjore kundër një ligji special të ekzekutivit. Këto raste tregojnë nëse gjyqësori është një "dekor" formal apo një "gardian" real i Kushtetutës.</p>
            </ArticleSection>

            <ArticleSection id="elementi-2" title="Elementi II: Spiranca Mbi-kombëtare – Evropianizimi dhe Standardet e GJEDNJ">
                <p>
                    Për Shqipërinë, shteti i së drejtës është i lidhur pazgjidhshmërisht me procesin e integrimit evropian. Kjo "spirancë" e jashtme vepron përmes dy kanaleve kryesore: detyrimi për të zbatuar jurisprudencën e Gjykatës Evropiane të të Drejtave të Njeriut (GJEDNJ) dhe procesi i përafrimit të legjislacionit me acquis të BE-së. Ky proces, i njohur në literaturë si "evropianizim", analizohet në thellësi nga revista si <a href="#ref-3" className="font-semibold text-primary-500 hover:underline">Common Market Law Review</a><SourceLink s={[3]}/> dhe <a href="#ref-4" className="font-semibold text-primary-500 hover:underline">European Law Journal</a><SourceLink s={[4]}/>, ndërsa standardet e të drejtave të njeriut janë fokusi i <a href="#ref-5" className="font-semibold text-primary-500 hover:underline">European Human Rights Law Review</a><SourceLink s={[5]}/>.
                </p>
                <p><strong>Pika Analitike për Shqipërinë:</strong> Filozofia jonë analitike mat aftësinë e gjykatave shqiptare për të kaluar nga një referim formal i KEDNJ në një internalizim të vërtetë të standardeve të saj. A përdoren vendimet e Strasburgut në mënyrë proaktive për të mbrojtur të drejtat e qytetarëve, veçanërisht në çështjet e pronësisë dhe procesit të rregullt ligjor? Apo ato përmenden vetëm kur nuk ka zgjidhje tjetër? Shkalla e këtij internalizimi është një tregues i fuqishëm i pjekurisë së sistemit gjyqësor.</p>
            </ArticleSection>

            <ArticleSection id="elementi-3" title="Elementi III: Konteksti Rajonal – Mësimet e Tranzicionit Post-Komunist">
                <p>
                    Sfidat e Shqipërisë nuk janë unike; ato janë pjesë e një modeli më të gjerë të tranzicionit post-komunist. Literatura e pasur e botuar në revista si <a href="#ref-6" className="font-semibold text-primary-500 hover:underline">Review of Central and East European Law</a><SourceLink s={[6]}/> tregon se shtetet e rajonit janë përballur me sfida të ngjashme: institucione të dobëta, korrupsion endemik, dhe një betejë për të shkëputur ligjin nga instrumentalizimi politik. Koncepti i "<KeyConcept term="shtetit të dobët" definition="Një shtet që nuk ka kapacitetin për të zbatuar ligjet e tij në mënyrë uniforme në të gjithë territorin, për të ofruar shërbime bazë, dhe për të ruajtur monopolin e përdorimit legjitim të forcës.">shtetit të dobët</KeyConcept>" (weak state) dhe "<KeyConcept term="kapjes së shtetit" definition="Një formë e korrupsionit sistemik ku interesat private ndikojnë vendimmarrjen shtetërore për përfitimet e tyre, duke shtrembëruar ligjet dhe politikat.">kapjes së shtetit</KeyConcept>" (state capture) janë thelbësore për të kuptuar pengesat reale.
                </p>
                <p><strong>Pika Analitike për Shqipërinë:</strong> Analiza jonë do ta vendosë gjithmonë jurisprudencën shqiptare në kontekstin krahasues rajonal. Reforma në drejtësi dhe procesi i Vetting-ut nuk mund të kuptohen pa njohur trashëgiminë e një sistemi ku besimi te drejtësia ishte i ulët dhe pavarësia gjyqësore ishte fiktive. A po krijojnë vendimet e institucioneve të reja një "<KeyConcept term="epistemologji" definition="Në këtë kontekst, i referohet metodës dhe bazës së njohurive mbi të cilat ndërtohet arsyetimi ligjor. Një epistemologji e re do të thotë një mënyrë e re e të menduarit dhe arsyetuarit ligjor.">epistemologji</KeyConcept>" të re ligjore, të bazuar te prova dhe arsyetimi, duke thyer kështu me kulturën e vjetër të pandëshkueshmërisë?</p>
            </ArticleSection>

            <ArticleSection id="elementi-4" title="Elementi IV: Themeli i Integritetit – Llogaridhënia dhe Lufta Kundër Kapjes së Shtetit">
                <p>
                    Një kuadër ligjor formalisht perfekt është i pavlerë nëse aktorët që e zbatojnë atë janë të korruptuar. Prandaj, elementi final dhe më thelbësor i analizës sonë është integriteti dhe llogaridhënia. Revista si <a href="#ref-7" className="font-semibold text-primary-500 hover:underline">Regulation & Governance</a><SourceLink s={[7]}/> ofrojnë kuadrin për të kuptuar se si institucionet e pavarura duhet të funksionojnë për t'i shpëtuar kapjes.
                </p>
                <p><strong>Pika Analitike për Shqipërinë:</strong> Rasti i ish-Ministrit të Brendshëm dhe hetimet e tjera të SPAK janë studime rastesh perfekte për këtë element. Këto nuk janë thjesht çështje penale; ato janë teste për aftësinë e sistemit të ri për të zbatuar parimin e barazisë para ligjit dhe për të goditur pandëshkueshmërinë. Analiza jonë do të vlerësojë nëse këto procese po ndërtojnë një precedent të qëndrueshëm që forcon besimin e publikut apo nëse ato mbeten raste sporadike të ndikuara nga ekosistemi politik.</p>
            </ArticleSection>

            <ArticleSection id="perfundim" title="Përfundim: Drejt një Filozofie Analitike të Ekosistemit">
                <p>
                    Këto katër elemente – thelbi kushtetues, spiranca evropiane, konteksti rajonal dhe themeli i integritetit – së bashku formësojnë filozofinë tonë për analizën e shtetit të së drejtës. Projekti ynë nuk do të mjaftohet me analizën e tekstit të vendimeve gjyqësore. Përkundrazi, ai do të vlerësojë çdo vendim dhe zhvillim jurisprudencial përmes këtij kuadri me katër shtresa, duke pyetur vazhdimisht: Si e forcon ose dobëson ky vendim secilin prej këtyre elementeve? Vetëm përmes kësaj qasjeje të integruar mund të kuptojmë vërtet dinamikat komplekse të ekosistemit të jurisprudencës në Shqipëri dhe të vlerësojmë progresin real drejt një shteti funksional të së drejtës.
                </p>
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
            {
                url: window.location.href,
                published_at: new Date().toISOString(),
                article_id: 'jurisprudence-overview-01'
            },
            sourcesList,
            {
                researchHours: 70,
                focusKeyword: "Shteti i së Drejtës"
            }
        );
    }, [fullArticleText, sourcesList]);

    const articleIntegrityProfile = useMemo(() => calculateArticleIntegrityProfile(articleMetrics), [articleMetrics]);

    const tocItems = [
        { id: 'hyrje', title: 'Hyrje: Përtej Përkufizimit Formal' },
        { id: 'elementi-1', title: 'Elementi I: Thelbi Kushtetues' },
        { id: 'elementi-2', title: 'Elementi II: Spiranca Mbi-kombëtare' },
        { id: 'elementi-3', title: 'Elementi III: Konteksti Rajonal' },
        { id: 'elementi-4', title: 'Elementi IV: Themeli i Integritetit' },
        { id: 'perfundim', title: 'Përfundim: Drejt një Filozofie Analitike' },
        { id: 'indeksi', title: 'Indeksi i Termave Teknikë' },
        { id: 'bibliografia', title: 'Bibliografia dhe Referencat' },
    ];
    
    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Përforcimi i Shtetit të Së Drejtës në Shqipëri: Katër Shtylla Analitike"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 15 Korrik, 2025",
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