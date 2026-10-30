import React, { useMemo, ReactNode } from 'react';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { GlossaryComponent } from './Glossary';

interface JudicialEthicsPageProps {
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

export const JudicialEthicsPage: React.FC<JudicialEthicsPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;

    const pageTitle = "Integriteti & Etika Gjyqësore | Analizë Themelore | NOVARIC®";
    const pageDescription = "Një analizë e thelluar e integritetit dhe etikës profesionale të gjyqtarëve, duke u fokusuar në diagnostikimin e korrupsionit, rolin e Vetting-ut, dhe arkitekturën e llogaridhënies.";
    const keywords = ["Integritet Gjyqësor", "Etikë Profesionale", "Korrupsion", "Kapja e Shtetit", "Vetting", "Llogaridhënia", "SPAK", "GJKKO", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "www.cambridge.org/core/books/corruption-and-government/92425556285A74A452148784E1A334B5", text: "Rose-Ackerman, S. (1999). Corruption and Government: Causes, Consequences, and Reform. Cambridge University Press.", credibility_industry_rating_pct: 96 },
        { id: 2, url: "www.cambridge.org/core/books/syndromes-of-corruption/D2E8E62B03A0B345D105D1792A62C6A4", text: "Johnston, M. (2005). Syndromes of Corruption: Wealth, Power, and Democracy. Cambridge University Press.", credibility_industry_rating_pct: 93 },
        { id: 3, url: "www.tandfonline.com/loi/mpin20", text: "Public Integrity. Taylor & Francis.", credibility_industry_rating_pct: 88 },
        { id: 4, url: "www.tandfonline.com/loi/rlet20", text: "Legal Ethics. Taylor & Francis.", credibility_industry_rating_pct: 89 },
        { id: 5, url: "onlinelibrary.wiley.com/doi/10.1111/j.1468-0386.2007.00369.x", text: "Bovens, M. (2007). Analysing and Assessing Accountability: A Conceptual Framework. European Law Journal, 13(4), 447-468.", credibility_industry_rating_pct: 94 },
        { id: 6, url: "journals.sagepub.com/home/euc", text: "European Journal of Criminology. SAGE Publications.", credibility_industry_rating_pct: 91 },
    ], []);
    
    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="Hyrje: Guri i Themelit të Besimit Publik">
                <PullQuote>Nëse shteti i së drejtës është ndërtesa, integriteti është themeli mbi të cilin ajo qëndron.</PullQuote>
                <p>Një gjyqësor mund të ketë ligjet më të përsosura dhe gjyqtarët më të aftë teknikisht, por pa <KeyConcept term="integritet" definition="Cilësia e të qenit i ndershëm dhe i pasur me parime të forta morale; në kontekstin gjyqësor, i referohet paanshmërisë, pavarësisë dhe përkushtimit ndaj shërbimit publik.">integritet</KeyConcept>, vendimet e tij janë thjesht ushtrime pushteti pa legjitimitet. Filozofia jonë analitike e refuzon përkufizimin minimalist të integritetit si thjesht "mungesë e veprave penale të korrupsionit". Përkundrazi, ne e kuptojmë integritetin si një virtyt aktiv dhe një kompetencë institucionale që përfshin paanshmëri, pavarësi, llogaridhënie dhe një përkushtim ndaj shërbimit publik.</p>
                <p>Ky artikull zbërthen katër elementet përmes të cilëve ne analizojmë dhe matim integritetin në ekosistemin e jurisprudencës shqiptare, duke u mbështetur në literaturën më të mirë ndërkombëtare mbi etikën ligjore, llogaridhënien dhe luftën kundër korrupsionit.</p>
            </ArticleSection>

            <ArticleSection id="elementi-1" title="Elementi I: Diagnostikimi i Korrupsionit – Përtej Ryshfetit">
                <p>Korrupsioni në drejtësi rrallë është një transaksion i thjeshtë ryshfeti. Ai shfaqet në forma më të sofistikuara, të cilat literatura moderne i përkufizon si "sindroma". Duke u mbështetur në veprat kanonike të Susan Rose-Ackerman (<em>Corruption and Government</em>)<SourceLink s={1}/> dhe Michael Johnston (<em>Syndromes of Corruption</em>)<SourceLink s={2}/>, analiza jonë do të kërkojë të identifikojë këto sindroma në praktikën gjyqësore:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong><KeyConcept term="Kapja e Shtetit" definition="Një formë e korrupsionit sistemik ku interesat private ndikojnë vendimmarrjen shtetërore për përfitimet e tyre, duke shtrembëruar ligjet dhe politikat.">Kapja e Shtetit</KeyConcept> (State Capture):</strong> A ka modele vendimesh që favorizojnë sistematikisht interesa të fuqishme ekonomike apo politike, duke e kthyer ligjin në një instrument në duart e tyre?</li>
                    <li><strong><KeyConcept term="Klientelizmi dhe Nepotizmi" definition="Favorizimi i miqve, familjarëve ose mbështetësve politikë në emërime, promovime ose vendime të tjera, në vend të meritokracisë.">Klientelizmi dhe Nepotizmi</KeyConcept>:</strong> A reflektojnë proceset e emërimit, ngritjes në detyrë apo edhe shpërndarjes së çështjeve lidhje klienteliste dhe jo meritokraci?</li>
                    <li><strong><KeyConcept term="Korrupsioni Institucional" definition="Situata ku rregullat, procedurat ose normat e një institucioni janë dizajnuar ose funksionojnë në mënyrë të tillë që krijojnë mundësi për përfitime të paligjshme, edhe pa një transaksion direkt ryshfeti.">Korrupsioni Institucional</KeyConcept>:</strong> A ka rregulla ose praktika brenda sistemit (p.sh., zvarritja e paarsyeshme e çështjeve) që krijojnë mundësi për korrupsion, edhe pa një transaksion direkt?</li>
                </ul>
                <p>Revista si <em>Public Integrity</em><SourceLink s={3}/> ofrojnë studime rastesh se si këto forma të korrupsionit minojnë institucionet publike nga brenda.</p>
            </ArticleSection>

            <ArticleSection id="elementi-2" title="Elementi II: Vetting-u si Pikënisje, Jo si Përfundim">
                <p>Procesi i Vetting-ut në Shqipëri ishte një ndërhyrje radikale dhe e nevojshme për të pastruar sistemin. Megjithatë, filozofia jonë analitike e sheh Vetting-un jo si fundin e historisë, por si pikën zero nga e cila fillon ndërtimi i një kulture të re integriteti. Rezultati formal i Vetting-ut është një tregues i rëndësishëm, por jo i mjaftueshëm. Analiza jonë shkon më thellë, duke u fokusuar te sjellja e gjyqtarëve dhe prokurorëve pas konfirmimit në detyrë. Duke marrë si model standartet e diskutuara në revistën <em>Legal Ethics</em><SourceLink s={4}/>, ne do të vlerësojmë:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Menaxhimin e Konfliktit të Interesit:</strong> A tërhiqet gjyqtari në mënyrë proaktive nga çështjet ku ka edhe hijen më të vogël të konfliktit të interesit?</li>
                    <li><strong>Pavarësinë nga Presionet:</strong> Si reagon gjyqtari ndaj presioneve mediatike apo politike në çështje me ndjeshmëri të lartë? A qëndron arsyetimi i tij/saj brenda kufijve të ligjit, apo ndikohet nga "zhurma" e jashtme?</li>
                    <li><strong>Sjelljen Profesionale (Judicial Demeanor):</strong> A tregon gjyqtari respekt për palët, paanshmëri dhe dinjitet në sallën e gjyqit?</li>
                </ul>
            </ArticleSection>

            <ArticleSection id="elementi-3" title="Elementi III: Arkitektura e Llogaridhënies">
                <p>Integriteti nuk mund të mbështetet vetëm te virtyti individual; ai duhet të garantohet nga një "<KeyConcept term="arkitekturë e llogaridhënies" definition="Tërësia e mekanizmave formalë dhe informalë (ligjorë, publikë, profesionalë) që sigurojnë se zyrtarët publikë janë përgjegjës për veprimet e tyre.">arkitekturë e llogaridhënies</KeyConcept>" e fortë dhe funksionale. Duke përdorur kuadrin konceptual të Mark Bovens (<em>Analysing and Assessing Accountability</em>)<SourceLink s={5}/>, ne do të analizojmë funksionimin e mekanizmave të ndryshëm të llogaridhënies në sistemin e ri të drejtësisë:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Llogaridhënia Ligjore/Hierarkike:</strong> Sa efektiv është Inspektori i Lartë i Drejtësisë (ILD) dhe Këshillat (KLGJ/KLP) në hetimin e shkeljeve disiplinore? A janë vendimet e tyre të bazuara në prova dhe të paanshme?</li>
                    <li><strong>Llogaridhënia Publike:</strong> Sa transparente janë institucionet e drejtësisë? A i publikojnë ato vendimet dhe të dhënat e tyre në një mënyrë që lejon monitorimin nga publiku dhe shoqëria civile?</li>
                    <li><strong>Llogaridhënia Profesionale:</strong> A ekziston një kulturë ku gjyqtarët dhe prokurorët e mbajnë njëri-tjetrin përgjegjës për standarde të larta etike, përtej mekanizmave formalë?</li>
                </ul>
            </ArticleSection>

            <ArticleSection id="elementi-4" title="Elementi IV: Testi i Institucioneve të Reja – SPAK & GJKKO si Modele të Integritetit Institucional">
                <p>SPAK dhe GJKKO nuk janë thjesht njësi të reja organizative; ato u krijuan për të qenë mishërimi i kulturës së re të integritetit dhe pavarësisë. Performanca e tyre është testi lakmus për suksesin e reformës në drejtësi. Analiza jonë do t'i vlerësojë këto institucione jo vetëm bazuar në numrin e dënimeve, por në aftësinë e tyre për të ndërtuar një reputacion të padiskutueshëm për integritet. Duke u mbështetur në studimet e rasteve të luftës kundër krimit të organizuar në revista si <em>European Journal of Criminology</em><SourceLink s={6}/>, ne do të pyesim:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>A po ndjekin këto institucione një qasje të paanshme, duke hetuar "pa parë krahun politik"?</li>
                    <li>A po i rezistojnë ato presioneve të forta politike dhe mediatike?</li>
                    <li>A po krijojnë ato një precedent të ri, duke treguar se askush nuk është mbi ligjin dhe duke thyer ciklin e pandëshkueshmërisë?</li>
                </ul>
            </ArticleSection>

            <ArticleSection id="perfundim" title="Përfundim: Integriteti si Performancë">
                <p>Në kuadrin tonë analitik, integriteti nuk është një parakusht pasiv, por një formë e performancës aktive. Ai manifestohet në vendime të përditshme, në menaxhimin e proceseve dhe në mënyrën se si institucionet i përgjigjen kontrollit publik. Duke e analizuar integritetin përmes këtyre katër elementeve – diagnostikimi i korrupsionit sistemik, vlerësimi i sjelljes përtej Vetting-ut, matja e llogaridhënies dhe testimi i institucioneve të reja – ne e zhvendosim debatin nga një diskutim abstrakt moral në një vlerësim konkret dhe të bazuar në prova të themelit mbi të cilin qëndron ose bie i gjithë ekosistemi i jurisprudencës në Shqipëri.</p>
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
            { url: window.location.href, published_at: new Date().toISOString(), article_id: 'judicial-ethics-02' },
            sourcesList,
            { researchHours: 80, focusKeyword: "Integriteti Gjyqësor" }
        );
    }, [fullArticleText, sourcesList]);

    const articleIntegrityProfile = useMemo(() => calculateArticleIntegrityProfile(articleMetrics), [articleMetrics]);

    const tocItems = [
        { id: 'hyrje', title: 'Hyrje: Guri i Themelit të Besimit Publik' },
        { id: 'elementi-1', title: 'Elementi I: Diagnostikimi i Korrupsionit' },
        { id: 'elementi-2', title: 'Elementi II: Vetting-u si Pikënisje' },
        { id: 'elementi-3', title: 'Elementi III: Arkitektura e Llogaridhënies' },
        { id: 'elementi-4', title: 'Elementi IV: Testi i Institucioneve të Reja' },
        { id: 'perfundim', title: 'Përfundim: Integriteti si Performancë' },
        { id: 'indeksi', title: 'Indeksi i Termave Teknikë' },
        { id: 'bibliografia', title: 'Bibliografia dhe Referencat' },
    ];
    
    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Integriteti & Etika"
            headerSubtitle="Guri i Themelit të Besimit Publik"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 22 Korrik, 2025",
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
