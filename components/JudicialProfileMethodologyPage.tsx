import React, { useMemo, ReactNode } from 'react';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { GlossaryComponent } from './Glossary';

interface JudicialProfileMethodologyPageProps {
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

export const JudicialProfileMethodologyPage: React.FC<JudicialProfileMethodologyPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;

    const pageTitle = "Metodologjia e Profilimit Gjyqësor (MVPGJ) | NOVARIC®";
    const pageDescription = "Një shpjegim i thelluar i Modelit të Vlerësimit të Performancës Gjyqësore (MVPGJ), mjeti thelbësor i NOVARIC® për të krijuar profile individuale dhe për të identifikuar modelet sistemike në ekosistemin e drejtësisë.";
    const keywords = ["Metodologji Gjyqësore", "MVPGJ", "Profilizim Gjyqtarësh", "Analizë Empirike", "Benchmark Gjyqësor", "Vlerësim Performance", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "www.tandfonline.com/loi/rlet20", text: "Grzymala-Busse, A. (2007). Rebuilding Leviathan: Party Competition and State Exploitation in Post-Communist Democracies. Cambridge University Press.", credibility_industry_rating_pct: 95 },
        { id: 2, url: "onlinelibrary.wiley.com/journal/17401461", text: "Journal of Empirical Legal Studies. Wiley.", credibility_industry_rating_pct: 91 },
        { id: 3, url: "www.coe.int/en/web/cepej/", text: "European Commission for the Efficiency of Justice (CEPEJ). Council of Europe.", credibility_industry_rating_pct: 95 },
        { id: 4, url: "onlinelibrary.wiley.com/doi/10.1111/j.1468-0386.2007.00369.x", text: "Bovens, M. (2007). Analysing and Assessing Accountability: A Conceptual Framework. European Law Journal, 13(4), 447-468.", credibility_industry_rating_pct: 94 },
    ], []);
    
    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="Hyrje: Nga Vlerësimi Subjektiv te Diagnoza e Strukturuar">
                <p>Analiza e jurisprudencës dhe aktorëve të saj shpesh mbetet në nivelin e përshtypjeve subjektive ose kritikave të përgjithshme. Filozofia jonë kërkon një qasje rrënjësisht të ndryshme: një metodologji rigoroze, transparente dhe të përsëritshme që e transformon vlerësimin në një diagnozë të strukturuar. Kjo është arsyeja pse kemi ndërtuar <KeyConcept term="Modelin e Vlerësimit të Performancës Gjyqësore (MVPGJ)" definition="Një mjet analitik i pronësisë së NOVARIC® që përdor një sistem të ponderuar me katër shtylla për të vlerësuar në mënyrë holistike performancën e një gjyqtari.">Modelin e Vlerësimit të Performancës Gjyqësore (MVPGJ)</KeyConcept> – mjeti ynë thelbësor për të krijuar profile individuale dhe për të identifikuar modelet sistemike në ekosistemin e drejtësisë.</p>
                <p>Ky artikull nuk përshkruan thjesht modelin; ai shpjegon filozofinë që qëndron pas tij, duke treguar se si çdo komponent bazohet në parimet më të mira të analizës juridike dhe institucionale. Ky është zbatimi praktik i gjithë kuadrit tonë teorik.</p>
            </ArticleSection>

            <ArticleSection id="elementi-1" title="Elementi I: Arkitektura e Modelit – Një Qasje Holistike me Katër Shtylla">
                <p>Modeli MVPGJ është ndërtuar mbi katër shtyllat themelore të analizuara në këtë seksion, duke siguruar një vlerësim të plotë (<KeyConcept term="holistik" definition="Qasje që analizon një sistem të tërë dhe ndërveprimin e pjesëve të tij, në vend që të fokusohet vetëm te komponentët individualë.">holistik</KeyConcept>):</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Profesionalizmi & Kompetenca:</strong> Mat aftësinë teknike dhe cilësinë e "zanatit" gjyqësor.</li>
                    <li><strong>Integriteti & Etika:</strong> Vlerëson themelin moral dhe besueshmërinë e gjyqtarit.</li>
                    <li><strong>Filozofia Gjyqësore:</strong> Analizon kuadrin intelektual dhe interpretues.</li>
                    <li><strong>Efikasiteti & Përgjegjshmëria:</strong> Mat performancën menaxheriale dhe administrative.</li>
                </ul>
                <p><KeyConcept term="Ponderimi" definition="Procesi i caktimit të peshave ose rëndësisë relative për komponentë të ndryshëm të një modeli, për të siguruar që rezultati përfundimtar të pasqyrojë prioritetet e analizës.">Ponderimi</KeyConcept> i këtyre shtyllave nuk është i rastësishëm. Duke i dhënë peshën më të madhe Integritetit & Etikës (40%), modeli ynë reflekton prioritetin strategjik të reformës në drejtësi dhe mësimet e nxjerra nga literatura mbi shtetet post-komuniste, ku rindërtimi i besimit është sfida kryesore.<SourceLink s={1}/></p>
            </ArticleSection>

            <ArticleSection id="elementi-2" title="Elementi II: Matja e Bazuar në Prova – Parimi Empirik">
                <p>Për të shmangur subjektivizmin, çdo indikator brenda MVPGJ-së bazohet në të dhëna të verifikueshme. Këtu ne përqafojmë plotësisht parimet e promovuara nga revista si <em>Journal of Empirical Legal Studies</em>, duke kërkuar <KeyConcept term="prova konkrete" definition="Të dhëna të matshme dhe të verifikueshme që mbështesin një pretendim ose vlerësim.">prova konkrete</KeyConcept> për çdo vlerësim:<SourceLink s={2}/></p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Të Dhëna Sasiore (Kuantitative):</strong> Për indikatorë si "shkalla e prishjes së vendimeve" dhe "koha e gjykimit", ne përdorim statistikat zyrtare nga KLGJ dhe gjykatat.</li>
                    <li><strong>Të Dhëna Cilësore të Verifikueshme:</strong> Për indikatorë si "cilësia e arsyetimit", ne nuk bazohemi në përshtypje, por në një analizë sistematike të një kampioni vendimesh, duke kontrolluar për përdorimin e precedentit, thellësinë e analizës dhe qartësinë strukturore.</li>
                    <li><strong>Të Dhëna Institucionale:</strong> Për indikatorë si "integriteti", ne i referohemi burimeve zyrtare si vendimet e vetting-ut (KPK/KPA) dhe të ILD-së.</li>
                </ul>
                <PullQuote>Ky përkushtim ndaj provave e bën analizën tonë të mbrojtshme, transparente dhe të besueshme.</PullQuote>
            </ArticleSection>

            <ArticleSection id="elementi-3" title="Elementi III: Vizualizimi si Mjet Analitik – Diagrami Radar dhe Arketipet">
                <p>Të dhënat komplekse duhet të komunikohen në mënyrë të qartë për të pasur ndikim. Për këtë arsye, mjeti ynë kryesor për paraqitjen e rezultateve është Diagrami Radar (Spider Diagram). Ky nuk është thjesht një ilustrim; është një mjet i fuqishëm diagnostikues që lejon:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Identifikimin e Menjëhershëm të Profilit:</strong> Një shikim i vetëm tregon vizualisht pikat e forta dhe të dobëta të një gjyqtari. Një diagram i gjerë dhe i balancuar tregon ekselencë, ndërsa një diagram me "maja" të theksuara tregon një profil të specializuar, por të çekuilibruar.</li>
                    <li><strong>Krijimin e <KeyConcept term="Arketipeve Analitike" definition="Modele ose kategori të përgjithshme që dalin nga analiza e të dhënave, të cilat ndihmojnë në klasifikimin dhe kuptimin e profileve individuale.">Arketipeve Analitike</KeyConcept>:</strong> Bazuar në formën e diagramit, ne mund të klasifikojmë profilet në arketipe si "Gjyqtari Garant" (rezultate të larta në të gjitha dimensionet, veçanërisht integritet), "Gjyqtari Teknik" (i fortë në kompetencë dhe efikasitet, por më pak në filozofi gjyqësore), apo "Gjyqtari Problematic" (rezultate të ulëta në integritet dhe/ose kompetencë). Këto arketipe na ndihmojnë të kuptojmë dinamikat e personelit brenda sistemit gjyqësor.</li>
                </ul>
            </ArticleSection>
            
            <ArticleSection id="elementi-4" title="Elementi IV: Kontekstualizimi Përmes Krahasimit – Rëndësia e Benchmark-ut">
                <p>Një rezultat individual ka kuptim vetëm kur krahasohet. Metodologjia jonë përdor dy nivele krahasimi (<KeyConcept term="benchmarking" definition="Procesi i krahasimit të performancës së një subjekti me një standard të caktuar ose me performancën mesatare të subjekteve të ngjashme.">benchmarking</KeyConcept>) për të kontekstualizuar performancën:</p>
                 <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Standardi Lokal:</strong> Krahasimi i rezultatit të një gjyqtari me mesataren e kolegëve të tij në të njëjtin nivel. Kjo tregon se kush performon mbi dhe nën pritshmëritë brenda sistemit shqiptar.</li>
                    <li><strong>Benchmark-u Evropian:</strong> Për indikatorë kyç si efikasiteti, ne përdorim të dhënat e CEPEJ<SourceLink s={3}/> për të krahasuar performancën e gjyqësorit shqiptar me atë të vendeve anëtare të BE-së. Ky krahasim është thelbësor për të matur progresin real të Shqipërisë drejt standardeve evropiane dhe për të mbështetur me të dhëna argumentin e literaturës mbi "<KeyConcept term="evropianizimin" definition="Procesi përmes të cilit një vend kandidat adopton normat, rregullat dhe praktikat e Bashkimit Evropian në institucionet dhe legjislacionin e tij.">evropianizimin</KeyConcept>".</li>
                 </ul>
                 <p>Ky proces me dy nivele krahasimi siguron që analiza jonë të jetë e balancuar – duke njohur realitetin dhe sfidat lokale, por pa humbur kurrë nga sytë standardin evropian ku vendi aspiron të arrijë.</p>
            </ArticleSection>

            <ArticleSection id="perfundim" title="Përfundim: Një Metodologji e Gjallë">
                <p>Modeli MVPGJ nuk është një formulë statike. Ai është një mjet dinamik, i ndërtuar mbi parimet e <KeyConcept term="transparencës" definition="Cilësia e të qenit i hapur dhe i qartë në veprime dhe vendimmarrje, duke lejuar kontrollin publik.">transparencës</KeyConcept> (nga literatura e <KeyConcept term="llogaridhënies" definition="Detyrimi i zyrtarëve dhe institucioneve publike për të justifikuar veprimet e tyre dhe për të qenë përgjegjës për rezultatet.">llogaridhënies</KeyConcept> si ajo e Bovens)<SourceLink s={4}/>, matjes objektive (nga <em>Journal of Empirical Legal Studies</em>)<SourceLink s={2}/> dhe vlerësimit të plotë (duke kombinuar të katër shtyllat e analizës sonë). Ashtu si vetë jurisprudenca, kjo metodologji do të përshtatet dhe do të përmirësohet vazhdimisht, duke pasqyruar të dhënat e reja dhe sfidat në evolucion të ekosistemit të drejtësisë në Shqipëri. Ajo është motori që i jep fuqi analitike dhe besueshmëri të gjithë këtij projekti.</p>
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
            { url: window.location.href, published_at: new Date().toISOString(), article_id: 'judicial-profile-methodology-02' },
            sourcesList,
            { researchHours: 90, focusKeyword: "Metodologji Gjyqësore" }
        );
    }, [fullArticleText, sourcesList]);

    const articleIntegrityProfile = useMemo(() => calculateArticleIntegrityProfile(articleMetrics), [articleMetrics]);

    const tocItems = [
        { id: 'hyrje', title: 'Hyrje: Nga Vlerësimi Subjektiv te Diagnoza' },
        { id: 'elementi-1', title: 'Elementi I: Arkitektura e Modelit' },
        { id: 'elementi-2', title: 'Elementi II: Matja e Bazuar në Prova' },
        { id: 'elementi-3', title: 'Elementi III: Vizualizimi si Mjet Analitik' },
        { id: 'elementi-4', title: 'Elementi IV: Kontekstualizimi Përmes Krahasimit' },
        { id: 'perfundim', title: 'Përfundim: Një Metodologji e Gjallë' },
        { id: 'indeksi', title: 'Indeksi i Termave Teknikë' },
        { id: 'bibliografia', title: 'Bibliografia dhe Referencat' },
    ];
    
    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Metodologjia e Profilimit"
            headerSubtitle="Nga Vlerësimi Subjektiv te Diagnoza e Strukturuar"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 28 Korrik, 2025",
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
