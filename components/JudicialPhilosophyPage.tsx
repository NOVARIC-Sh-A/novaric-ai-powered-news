import React, { useMemo, ReactNode } from 'react';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { GlossaryComponent } from './Glossary';

interface JudicialPhilosophyPageProps {
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

export const JudicialPhilosophyPage: React.FC<JudicialPhilosophyPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;

    const pageTitle = "Filozofia Gjyqësore dhe Arsyetimi Ligjor | NOVARIC®";
    const pageDescription = "Një analizë e thelluar e filozofisë gjyqësore dhe metodave të interpretimit ligjor, duke eksploruar debatin midis pozitivizmit dhe interpretivizmit, hermeneutikës dhe rolit të gjyqtarit.";
    const keywords = ["Filozofi Gjyqësore", "Arsyetim Ligjor", "Tekstualizëm", "Purpozivizëm", "Aktivizëm Gjyqësor", "Hermeneutikë Gjyqësore", "Hart", "Dworkin", "Gadamer", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "global.oup.com/academic/product/the-concept-of-law-9780199644704", text: "Hart, H. L. A. (1961). The Concept of Law. Oxford University Press.", credibility_industry_rating_pct: 99 },
        { id: 2, url: "www.hup.harvard.edu/catalog.php?isbn=9780674511691", text: "Dworkin, R. (1986). Law's Empire. Harvard University Press.", credibility_industry_rating_pct: 99 },
        { id: 3, url: "www.amazon.com/Truth-Method-Hans-Georg-Gadamer/dp/082647697X", text: "Gadamer, H.-G. (1989). Truth and Method (2nd rev. ed.). Sheed & Ward.", credibility_industry_rating_pct: 98 },
        { id: 4, url: "www.tandfonline.com/journals/rijp20", text: "Jurisprudence: An International Journal of Legal and Political Thought. Taylor & Francis.", credibility_industry_rating_pct: 92 },
        { id: 5, url: "link.springer.com/journal/10978", text: "Law and Philosophy. Springer.", credibility_industry_rating_pct: 93 },
    ], []);
    
    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="Hyrje: Përtej Tekstit të Ligjit – Mendja e Gjyqtarit">
                <p>Nëse vendimi gjyqësor është produkti final, atëherë <KeyConcept term="filozofia gjyqësore" definition="Procesi intelektual dhe moral që i jep formë një vendimi gjyqësor, duke reflektuar botëkuptimin e gjyqtarit mbi ligjin dhe rolin e tij.">filozofia gjyqësore</KeyConcept> është procesi intelektual dhe moral që i jep formë atij produkti. Çdo gjyqtar, kur përballet me një tekst ligjor që nuk është kurrë plotësisht i qartë, bën zgjedhje interpretuese. Këto zgjedhje nuk janë teknike apo neutrale; ato reflektojnë një botëkuptim më të thellë mbi rolin e gjyqtarit, natyrën e ligjit dhe marrëdhëniet midis individit dhe shtetit.</p>
                <PullQuote>Filozofia jonë analitike synon të bëjë të dukshme këtë "hartë mendore" të padukshme të gjyqtarëve. Duke përdorur mjetet e ofruara nga debatet kanonike në revista si <a href="#ref-4" className="font-semibold text-primary-500 hover:underline">Jurisprudence</a><SourceLink s={4}/> dhe <a href="#ref-5" className="font-semibold text-primary-500 hover:underline">Law and Philosophy</a><SourceLink s={5}/>, ne zbërthejmë vendimet gjyqësore për të identifikuar parimet themelore që udhëheqin arsyetimin. Kjo nuk është një gjueti për "gabime", por një përpjekje për të kuptuar se si mendon drejtësia në Shqipëri.</PullQuote>
            </ArticleSection>

            <ArticleSection id="elementi-1" title="Elementi I: Spektri i Interpretimit – Nga Pozitivizmi te Integriteti">
                <p>Çdo analizë e filozofisë gjyqësore fillon me debatin klasik midis H.L.A. Hart dhe Ronald Dworkin, i cili përcakton dy pole të mëdha të mendimit juridik.</p>
                <p><strong>Qasja Pozitiviste (e frymëzuar nga Hart):</strong> E sheh ligjin si një set rregullash të shkruara. Gjyqtari është një zbatues besnik i këtyre rregullave. Kur rregullat janë të paqarta ("open texture"), gjyqtari përdor diskrecionin, por roli i tij parësor është <KeyConcept term="përmbajtja gjyqësore" definition="Një filozofi që inkurajon gjyqtarët të kufizojnë ushtrimin e pushtetit të tyre dhe t'i japin përparësi vendimeve të degëve të tjera të pushtetit.">përmbajtja gjyqësore</KeyConcept>. Gjyqtarët që ndjekin këtë filozofi priren drejt <KeyConcept term="tekstualizmit" definition="Një metodë interpretimi që fokusohet rreptësisht në kuptimin e zakonshëm të tekstit të ligjit.">tekstualizmit</KeyConcept> – interpretimit të fjalëve të ligjit sipas kuptimit të tyre të zakonshëm.<SourceLink s={1}/></p>
                <p><strong>Qasja Interpretiviste (e frymëzuar nga Dworkin):</strong> E sheh ligjin jo vetëm si rregulla, por edhe si parime morale dhe politike që i japin kuptim atij sistemi. Për Dworkin, gjyqtari nuk ka diskrecion të lirë; ai ka detyrën të gjejë "përgjigjen e vetme të drejtë" duke e interpretuar ligjin në dritën më të mirë morale, një proces që ai e quan "<KeyConcept term="ligji si integritet" definition="Teoria e Dworkin-it që argumenton se ligji përbëhet jo vetëm nga rregulla, por edhe nga parime morale, dhe gjyqtarët duhet ta interpretojnë atë në dritën më të mirë morale.">ligji si integritet</KeyConcept>". Gjyqtarët që ndjekin këtë filozofi priren drejt <KeyConcept term="purpozivizmit" definition="Një metodë interpretimi që kërkon të kuptojë dhe zbatojë qëllimin ose synimin që ligjvënësi kishte kur e krijoi ligjin.">purpozivizmit</KeyConcept> – kërkimit të qëllimit dhe parimeve që qëndrojnë pas rregullës.<SourceLink s={2}/></p>
                <p><strong>Pika Analitike për Shqipërinë:</strong> Ky spektër është thelbësor për të analizuar jurisprudencën e Gjykatës Kushtetuese dhe Gjykatës së Lartë. A priren këto gjykata të kenë një qasje formaliste, duke u kapur pas tekstit të ligjit edhe kur ai prodhon rezultate absurde? Apo ato marrin një rol më aktiv, duke interpretuar Kushtetutën dhe ligjet në dritën e parimeve themelore si dinjiteti njerëzor, drejtësia sociale dhe shteti i së drejtës, siç sugjeron Dworkin?</p>
            </ArticleSection>

            <ArticleSection id="elementi-2" title="Elementi II: Hermeneutika e Vendimit – Gjyqtari si Përkthyes">
                <p>Filozofia moderne, veçanërisht vepra e Hans-Georg Gadamer, <em>Truth and Method</em>, na mëson se interpretimi nuk është një akt mekanik, por një "<KeyConcept term="bashkim horizontesh" definition="Koncepti i Gadamer-it ku kuptimi arrihet përmes një dialogu transformues midis perspektivës së interpretuesit (horizontit të tij) dhe asaj të tekstit.">bashkim horizontesh</KeyConcept>" (fusion of horizons).<SourceLink s={3}/> Gjyqtari nuk i afrohet tekstit ligjor si një "<KeyConcept term="tabula rasa" definition="Një shprehje latine që do të thotë 'fletë e bardhë', duke iu referuar idesë se dikush i afrohet diçkaje pa njohuri ose paragjykime të mëparshme.">tabula rasa</KeyConcept>"; ai/ajo vjen me një "<KeyConcept term="para-kuptim" definition="Në hermeneutikë, tërësia e njohurive, paragjykimeve dhe traditave që një interpretues sjell me vete kur i afrohet një teksti, dhe që bën të mundur vetë aktin e të kuptuarit.">para-kuptim</KeyConcept>" të formuar nga përvoja, kultura ligjore dhe konteksti social. Teksti, nga ana tjetër, vjen nga një e kaluar historike. Vendimi gjyqësor është produkt i këtij dialogu <KeyConcept term="hermeneutik" definition="Që lidhet me hermeneutikën, artin dhe teorinë e interpretimit. Një dialog hermeneutik është një proces interpretues i ndërveprimit midis tekstit dhe lexuesit.">hermeneutik</KeyConcept>.</p>
                <p><strong>Pika Analitike për Shqipërinë:</strong> Kjo perspektivë na lejon të analizojmë se si "horizonti" i gjyqtarëve shqiptarë – i formuar nga trashëgimia post-komuniste, procesi i integrimit evropian dhe presioni i reformës – ndikon në mënyrën se si ata "përkthejnë" tekstet ligjore në vendime konkrete. Për shembull, si e interpreton një gjyqtar konceptin e "interesit publik" kur përballen një investitor strategjik me të drejtat e pronës së një qytetari? Përgjigjja varet nga "horizonti" i tij interpretues.</p>
            </ArticleSection>

            <ArticleSection id="elementi-3" title="Elementi III: Aktivizmi vs. Përmbajtja – Dilema e Rolit Gjyqësor">
                <p>Kjo është shprehja praktike e filozofisë gjyqësore. Një gjyqtar mund të zgjedhë:</p>
                <p><strong>Përmbajtjen Gjyqësore (Judicial Restraint):</strong> Një filozofi që thekson se gjykatat duhet të tregohen të përmbajtura dhe t'u lënë hapësirë degëve të tjera të pushtetit, veçanërisht legjislativit të zgjedhur nga populli. Gjyqtarët duhet të rrëzojnë ligjet vetëm kur ato janë haptazi antikushtetuese.</p>
                <p><strong><KeyConcept term="Aktivizmin Gjyqësor" definition="Një filozofi që sugjeron se gjykatat duhet të luajnë një rol më aktiv në mbrojtjen e të drejtave dhe në korrigjimin e padrejtësive, edhe nëse kjo kërkon një interpretim më të gjerë të Kushtetutës.">Aktivizmin Gjyqësor</KeyConcept> (Judicial Activism):</strong> Një filozofi që sugjeron se gjykatat duhet të luajnë një rol më aktiv në mbrojtjen e të drejtave, veçanërisht të minoriteteve, dhe në korrigjimin e padrejtësive, edhe nëse kjo kërkon një interpretim më të gjerë të Kushtetutës.</p>
                <p><strong>Pika Analitike për Shqipërinë:</strong> Ky është një nga tensionet qendrore në sistemin e ri të drejtësisë. A duhet SPAK dhe GJKKO të kenë një qasje të përmbajtur, duke u fokusuar vetëm në provat strikte penale, apo një qasje më aktive në luftën kundër korrupsionit, duke interpretuar gjerësisht dispozitat për pasurinë e pajustifikuar? A duhet Gjykata Kushtetuese të jetë e përmbajtur përballë vullnetit të Parlamentit, apo duhet të jetë një mbrojtëse aktive e shtetit të së drejtës, siç bëri në rastin e Teatrit Kombëtar? Analiza jonë do të identifikojë dhe vlerësojë këto prirje në vendimet konkrete.</p>
            </ArticleSection>
            
            <ArticleSection id="perfundim" title="Përfundim: Rëndësia e të Menduarit mbi të Menduarit">
                <p>Analiza e filozofisë gjyqësore është thelbi i një vlerësimi të pjekur të jurisprudencës. Ajo na detyron të shkojmë përtej pyetjes "A është ky vendim i drejtë?" dhe të pyesim "Sipas cilit kuadër të të menduarit u arrit ky vendim?". Duke e bërë këtë, ne jo vetëm që kuptojmë më mirë vendimet individuale, por gjithashtu ndriçojmë tendencat më të thella që po formësojnë evolucionin e shtetit të së drejtës në Shqipëri. Kjo qasje, e mbështetur në debatet më të rëndësishme të teorisë së ligjit, i jep projektit tonë thellësinë dhe rigorozitetin e nevojshëm analitik.</p>
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
            { url: window.location.href, published_at: new Date().toISOString(), article_id: 'judicial-philosophy-02' },
            sourcesList,
            { researchHours: 55, focusKeyword: "Filozofia Gjyqësore" }
        );
    }, [fullArticleText, sourcesList]);

    const articleIntegrityProfile = useMemo(() => calculateArticleIntegrityProfile(articleMetrics), [articleMetrics]);

    const tocItems = [
        { id: 'hyrje', title: 'Hyrje: Mendja e Gjyqtarit' },
        { id: 'elementi-1', title: 'Elementi I: Spektri i Interpretimit' },
        { id: 'elementi-2', title: 'Elementi II: Hermeneutika e Vendimit' },
        { id: 'elementi-3', title: 'Elementi III: Aktivizmi vs. Përmbajtja' },
        { id: 'perfundim', title: 'Përfundim: Rëndësia e të Menduarit' },
        { id: 'indeksi', title: 'Indeksi i Termave Teknikë' },
        { id: 'bibliografia', title: 'Bibliografia dhe Referencat' },
    ];
    
    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Filozofia Gjyqësore"
            headerSubtitle="Përtej Tekstit të Ligjit – Mendja e Gjyqtarit"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 20 Korrik, 2025",
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
