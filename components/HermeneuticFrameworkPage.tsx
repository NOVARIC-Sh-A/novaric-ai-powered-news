import React, { useMemo, ReactNode } from 'react';
import { renderWithSuperscript } from '../utils/textUtils';
import { BookOpenIcon, ClockIcon, LightBulbIcon, DocumentTextIcon, AcademicCapIcon, ScaleIcon, CheckCircleIcon, CpuChipIcon } from './icons';
import { JsonLd } from './JsonLd';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';

interface HermeneuticFrameworkPageProps {
  onBack: () => void;
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

const SourceLink: React.FC<{ s: number }> = ({ s }) => (
    <sup>
        <a href={`#ref-${s}`} className="text-primary-500 mx-0.5 no-underline">[{s}]</a>
    </sup>
);

export const HermeneuticFrameworkPage: React.FC<HermeneuticFrameworkPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;
    
    const pageTitle = "Korniza Hermeneutike | Filozofia e NOVARIC®";
    const pageDescription = "Një eksplorim i thelluar i themelit filozofik të NOVARIC®, duke aplikuar parimet e hermeneutikës së Gadamer-it për të analizuar gazetarinë shqiptare si një akt kulturor interpretues.";
    const keywords = ["Hermeneutika", "Hans-Georg Gadamer", "Martin Heidegger", "Paul Ricoeur", "Analizë Kulturore", "Kornizim Mediatik", "Sfera Publike", "Filozofia e Komunikimit", "Rrethi Hermeneutik", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "www.amazon.com/Truth-Method-Hans-Georg-Gadamer/dp/082647697X", text: "Gadamer, H.-G. (1989). Truth and Method (2nd rev. ed.). Sheed & Ward.", credibility_industry_rating_pct: 98 },
        { id: 2, url: "www.amazon.com/Being-Time-Martin-Heidegger/dp/0061575593", text: "Heidegger, M. (1962). Being and Time (J. Macquarrie & E. Robinson, Trans.). Harper & Row.", credibility_industry_rating_pct: 99 },
        { id: 3, url: "www.amazon.com/Hermeneutics-Human-Sciences-Paul-Ricoeur/dp/0521280028", text: "Ricoeur, P. (1981). Hermeneutics and the Human Sciences. Cambridge University Press.", credibility_industry_rating_pct: 97 },
        { id: 4, url: "www.journalofcommunication.com/", text: "Entman, R. M. (1993). Framing: Toward clarification of a fractured paradigm. Journal of Communication, 43(4), 51–58.", credibility_industry_rating_pct: 97 },
        { id: 5, url: "mitpress.mit.edu/9780262581081/the-structural-transformation-of-the-public-sphere/", text: "Habermas, J. (1989). The structural transformation of the public sphere. MIT Press.", credibility_industry_rating_pct: 98 },
        { id: 6, url: "www.cambridge.org/core/books/comparing-media-systems/9780521543088", text: "Hallin, D. C., & Mancini, P. (2004). Comparing media systems. Cambridge University Press.", credibility_industry_rating_pct: 98 },
    ], []);

    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="Hyrje: Përtej Verifikimit të Fakteve">
                <p>Në një epokë të mbingarkuar me informacion, verifikimi i fakteve është një mjet i domosdoshëm, por i pamjaftueshëm. Ai i përgjigjet pyetjes "A është kjo e vërtetë?", por rrallëherë i përgjigjet pyetjes më të thellë: "Çfarë kuptimi ka kjo?". Për të adresuar këtë dimension të dytë, NOVARIC® e bazon filozofinë e saj analitike në <KeyConcept term="hermeneutikë" definition="Fillimisht arti i interpretimit të teksteve (veçanërisht atyre biblike), hermeneutika moderne është studimi filozofik i të kuptuarit dhe interpretimit në të gjitha format e tij.">hermeneutikë</KeyConcept> – artin dhe teorinë e interpretimit.</p>
                <p>Kjo kornizë na lejon të lëvizim përtej një vlerësimi binar (e vërtetë/e gabuar) dhe ta trajtojmë çdo artikull lajmi jo thjesht si një përmbledhje faktesh, por si një <KeyConcept term="artefakt kulturor" definition="Një objekt ose tekst i krijuar nga njerëzit që mbart kuptim kulturor dhe pasqyron vlerat, besimet dhe praktikat e një shoqërie në një kohë të caktuar.">artefakt kulturor</KeyConcept>—një produkt i formësuar nga paragjykimet, traditat dhe gjuha e autorit dhe e shoqërisë së tij. Duke u mbështetur kryesisht te mendimi i Hans-Georg Gadamer, ne synojmë të dekonstruktojmë jo vetëm atë që thuhet, por edhe mënyrën se si thuhet.</p>
            </ArticleSection>
            
            <ArticleSection id="shtylla" title="Shtyllat e Hermeneutikës së Gadamer-it">
                <p>Filozofia e Gadamer-it, e shprehur në veprën e tij monumentale <em>Truth and Method</em> (1989), ofron tre koncepte thelbësore që udhëheqin analizën tonë.<SourceLink s={1}/></p>
                <h3 className="text-xl font-semibold mt-4 mb-2">1. Paragjykimi (Vorurteil) si Kusht i Domosdoshëm për Kuptimin</h3>
                <p>Në gjuhën e përditshme, "paragjykimi" ka një konotacion negativ. Për Gadamer-in, megjithatë, <KeyConcept term="Vorurteil" definition="Një term gjerman që do të thotë 'para-gjykim'. Në filozofinë e Gadamer-it, ky nuk është një paragjykim negativ, por tërësia e supozimeve, pritshmërive dhe traditave kulturore që ne sjellim me vete dhe që bëjnë të mundur aktin e të kuptuarit.">Vorurteil</KeyConcept> (para-gjykim) është kushti i domosdoshëm për çdo akt të kuptuari. Ne nuk i afrohemi kurrë një teksti si një "fletë e bardhë". Ne vijmë me një sërë pritshmërish të formuara nga kultura, gjuha dhe përvoja jonë. Këto nuk janë pengesa për t'u eleminuar, por pika fillestare e dialogut me tekstin.</p>
                <p><strong>Zbatimi në NOVARIC®:</strong> Kur analizojmë një artikull, ne nuk pyesim "A është ky gazetar objektiv?", por "Cilat janë paragjykimet (horizonti kulturor) që e formësojnë këtë tekst?". Kjo është veçanërisht e rëndësishme në kontekstin shqiptar, ku media shpesh operon brenda modelit "Pluralist të Polarizuar", i karakterizuar nga një paralelizëm i lartë politik (Hallin & Mancini, 2004).<SourceLink s={6}/></p>
                
                <h3 className="text-xl font-semibold mt-4 mb-2">2. Rrethi Hermeneutik: Dialogu midis Pjesës dhe të Tërës</h3>
                <p><KeyConcept term="Rrethi hermeneutik" definition="Principi themelor i interpretimit që thotë se ne e kuptojmë një të tërë (p.sh., një artikull) përmes pjesëve të saj (fjalive), dhe e kuptojmë secilën pjesë vetëm në dritën e së tërës. Ky nuk është një rreth vicioz, por një proces dinamik i thellimit të vazhdueshëm të kuptimit.">Rrethi hermeneutik</KeyConcept> përshkruan procesin dinamik të interpretimit: ne e kuptojmë të tërën (p.sh., një artikull) përmes pjesëve të saj (fjalive), dhe kuptojmë secilën pjesë vetëm në dritën e së tërës. Çdo lexim i ri i një fjalie ndryshon kuptimin tonë për të gjithë artikullin, dhe ky kuptim i ri ndryshon më pas interpretimin tonë të çdo fjalie. Ky nuk është një rreth vicioz, por një spirale e thellimit të vazhdueshëm të kuptimit.</p>
                <p><strong>Zbatimi në NOVARIC®:</strong> Analiza jonë nuk ndalet te verifikimi i një pretendimi të izoluar. Ne e vendosim çdo pretendim (pjesën) brenda kontekstit të gjerë të artikullit, narrativës së medias që e boton dhe debatit publik më të gjerë (e tëra).</p>
                
                <h3 className="text-xl font-semibold mt-4 mb-2">3. Bashkimi i Horizonteve (Horizontverschmelzung): Akti i të Kuptuarit</h3>
                <p>Për Gadamer-in, kuptimi nuk është riprodhimi i qëllimit origjinal të autorit. Përkundrazi, ai është një ngjarje: <KeyConcept term="bashkimi i horizonteve" definition="Koncepti qendror i Gadamer-it. Kuptimi ndodh kur 'horizonti' i lexuesit (bota e tij e paragjykimeve dhe pritshmërive) ndërvepron dhe 'bashkohet' me 'horizontin' e tekstit (kontekstin e tij historik dhe kulturor). Ky nuk është një proces objektiv, por një dialog produktiv.">bashkimi i horizonteve</KeyConcept>. Horizonti ynë (bota jonë e kuptimit) takohet me horizontin e tekstit (kontekstin e tij historik dhe kulturor). Në këtë takim, të dy horizontet zgjerohen dhe transformohen. Ne nuk e kuptojmë një tekst duke harruar veten, por duke e vënë në lojë botëkuptimin tonë.</p>
                <PullQuote>Të kuptosh një tekst do të thotë ta kuptosh atë ndryshe nga autori.<SourceLink s={1}/></PullQuote>
            </ArticleSection>

            <ArticleSection id="operacionalizimi" title="Operacionalizimi i Hermeneutikës në NOVARIC®">
                <p>Por si përkthehet kjo filozofi e lartë në një mjet analitik praktik?</p>
                <ul className="list-disc list-inside space-y-3 pl-4">
                    <li><strong>IA si Mjet Hermeneutik:</strong> Ne e përdorim Inteligjencën Artificiale jo si një "arbitër të së vërtetës", por si një mjet të fuqishëm për të përshpejtuar rrethin hermeneutik. IA mund të skanojë mijëra dokumente për të ndërtuar shpejt "horizontin" e një teksti—duke identifikuar burimet e tij, modelet gjuhësore dhe lidhjet intertekstuale. Ajo i ofron analistit njerëzor një pamje më të pasur të "së tërës", duke e lejuar atë të bëjë një interpretim më të thelluar të "pjesëve".</li>
                    <li><strong>Analiza e Kornizimit (Framing):</strong> Puna e Robert Entman (1993) mbi kornizimin është një zbatim praktik i hermeneutikës.<SourceLink s={4}/> Kur ne analizojmë se si një artikull "kornizon" një çështje—duke zgjedhur çfarë të theksojë, çfarë të injorojë dhe si ta përkufizojë problemin—ne në thelb po bëjmë të dukshme "paragjykimet" (Vorurteil) që formësojnë atë tekst.</li>
                    <li><strong>Fokus te Gjuha:</strong> Duke u mbështetur te mendimi i Heidegger-it se "gjuha është shtëpia e qenies"<SourceLink s={2}/> dhe te puna e Paul Ricoeur mbi metaforën dhe narrativën<SourceLink s={3}/>, analiza jonë i kushton vëmendje të veçantë zgjedhjeve gjuhësore. A përdor artikulli metafora lufte? A ndërton një narrativë "ne kundër atyre"? Këto nuk janë thjesht zgjedhje stilistike; ato janë dritare drejt botëkuptimit që e ka prodhuar atë tekst.</li>
                </ul>
            </ArticleSection>

            <ArticleSection id="perfundim" title="Përfundim: Drejt një Lexuesi Kritik">
                <p>Duke adoptuar një kornizë hermeneutike, NOVARIC® synon të arrijë diçka më ambicioze se thjesht verifikimi i fakteve. Qëllimi ynë është të kultivojmë një lexues më kritik dhe më të vetëdijshëm—një lexues që e kupton se leximi i lajmeve nuk është një akt pasiv i konsumimit të fakteve, por një akt aktiv interpretimi. Në një demokraci funksionale, aftësia për të marrë pjesë në këtë dialog interpretues është thelbësore për shëndetin e <KeyConcept term="sferës publike" definition="Një hapësirë (metaforike) në jetën shoqërore ku individët mund të mblidhen për të diskutuar lirishëm dhe për të identifikuar problemet shoqërore, dhe përmes këtij diskutimi të ndikojnë në veprimin politik.">sferës publike</KeyConcept> (Habermas, 1989).<SourceLink s={5}/></p>
            </ArticleSection>

            <ArticleSection id="referencat" title="Referencat">
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
                published_at: "2025-09-01T22:00:00Z",
                article_id: 'hermeneutic-framework-01'
            }, 
            sourcesList,
            {
                researchHours: 155, // Updated
                focusKeyword: "Korniza Hermeneutike"
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
            headerTitle="Çfarë është Hermeneutika?"
            headerSubtitle="Përtej Verifikimit të Fakteve: Drejt një Kuptimi të Thelluar të Medias si Artefakt Kulturor"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 1 Shtator, 2025",
                lastUpdated: "20 Tetor, 2025",
                location: "Shkodër, Shqipëri"
            }}
            tableOfContentsItems={[
                { id: "hyrje", title: "Hyrje: Përtej Verifikimit të Fakteve" },
                { id: "shtylla", title: "Shtyllat e Hermeneutikës së Gadamer-it" },
                { id: "operacionalizimi", title: "Operacionalizimi i Hermeneutikës në NOVARIC®" },
                { id: "perfundim", title: "Përfundim: Drejt një Lexuesi Kritik" },
                { id: "referencat", title: "Referencat" }
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
