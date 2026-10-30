import React, { useMemo, ReactNode } from 'react';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { renderWithSuperscript } from '../utils/textUtils';
import { GlossaryComponent } from './Glossary';

interface JudicialEcosystemAnalysisMethodologyPageProps {
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

// Corrected prop name in destructuring from onNavigateToNoraAiProfileSplitter to onNavigateToNoraAiProfile
export const JudicialEcosystemAnalysisMethodologyPage: React.FC<JudicialEcosystemAnalysisMethodologyPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;

    const pageTitle = "Analiza e Ekosistemit Gjyqësor | Forcat që Formësojnë Drejtësinë | NOVARIC®";
    const pageDescription = "Një analizë e thelluar e ekosistemit politik, mediatik, profesional dhe social që ndikon në performancën, filozofinë dhe integritetin e gjyqësorit në Shqipëri.";
    const keywords = ["Ekosistemi Gjyqësor", "Kapja e Shtetit", "Sfera Publike", "Kapitali Social", "Sistemi Gjyqësor Shqiptar", "Analizë Institucionale", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "www.amazon.com/Power-Elite-C-Wright-Mills/dp/0195133544", text: "Mills, C. W. (1956). The Power Elite. Oxford University Press.", credibility_industry_rating_pct: 97 },
        { id: 2, url: "www.cambridge.org/core/books/comparing-media-systems/9780521543088", text: "Hallin, D. C., & Mancini, P. (2004). Comparing Media Systems: Three Models of Media and Politics. Cambridge University Press.", credibility_industry_rating_pct: 98 },
        { id: 3, url: "mitpress.mit.edu/9780262581081/the-structural-transformation-of-the-public-sphere/", text: "Habermas, J. (1989). The Structural Transformation of the Public Sphere. MIT Press.", credibility_industry_rating_pct: 98 },
        { id: 4, url: "www.amazon.com/Why-Nations-Fail-Origins-Prosperity/dp/0307719227", text: "Acemoglu, D., & Robinson, J. A. (2012). Why Nations Fail: The Origins of Power, Prosperity, and Poverty. Crown Business.", credibility_industry_rating_pct: 96 },
        { id: 5, url: "www.cambridge.org/core/books/institutions-institutional-change-and-economic-performance/0521397340", text: "North, D. C. (1990). Institutions, Institutional Change and Economic Performance. Cambridge University Press.", credibility_industry_rating_pct: 97 },
        { id: 6, url: "press.princeton.edu/books/paperback/9780691028378/making-democracy-work", text: "Putnam, R. D. (1993). Making Democracy Work: Civic Traditions in Modern Italy. Princeton University Press.", credibility_industry_rating_pct: 97 },
    ], []);
    
    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="Hyrje: Përtej Gjyqtarit – Forcat që Formësojnë Drejtësinë">
                <p>Një analizë e jurisprudencës që fokusohet vetëm te gjyqtari individual është si të studiosh një pemë pa marrë parasysh pyllin, tokën dhe klimën ku ajo rritet. Performanca, filozofia dhe madje edhe integriteti i një gjyqtari nuk ekzistojnë në vakum. Ato janë produkt i një ndërveprimi kompleks dhe të vazhdueshëm me <KeyConcept term="ekosistemin" definition="Në këtë kontekst, i referohet tërësisë së institucioneve, aktorëve, normave dhe presioneve (politike, mediatike, sociale) që ndërveprojnë dhe formësojnë funksionimin e sistemit të drejtësisë.">ekosistemin</KeyConcept> brenda të cilit operon sistemi i drejtësisë.</p>
                <PullQuote>Filozofia jonë analitike këmbëngul që çdo profil individual i gjeneruar nga Modeli MVPGJ must be lexuar dhe interpretuar në dritën e këtij ekosistemi. Ky artikull përcakton katër forcat kryesore që ne do të analizojmë për të kuptuar kontekstin, presionet dhe mundësitë që formësojnë jurisprudencën në Shqipëri. Kjo është lëvizja finale nga analiza mikro te diagnoza makro.</PullQuote>
            </ArticleSection>

            <ArticleSection id="elementi-1" title="Elementi I: Ekosistemi Politik – Presioni i Elitave dhe Dinamikat e Pushtetit">
                <p>Gjyqësori është një degë e pushtetit dhe, si i tillë, është vazhdimisht nën presionin e degëve të tjera. Duke u mbështetur në kuadrin kritik të ofruar nga C. Wright Mills (<em>The Power Elite</em>)<SourceLink s={1}/>, analiza jonë do të identifikojë dhe vlerësojë presionet që vijnë nga elitat politike dhe ekonomike.</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Presioni Politik Direkt:</strong> A ka sulme publike, fushata denigruese apo kërcënime për shkurtime buxhetore ndaj gjykatave ose gjyqtarëve specifikë kur ata marrin vendime "të papëlqyeshme"?</li>
                    <li><strong><KeyConcept term="Kapja Strukturore" definition="Përtej presioneve direkte, i referohet mekanizmave institucionalë (p.sh., proceset e emërimit) që krijojnë një mjedis favorizues për kapjen e shtetit nga interesa të fuqishme.">Kapja Strukturore</KeyConcept>:</strong> Përtej presioneve direkte, a ka mekanizma strukturorë (p.sh., në proceset e emërimit, në alokimin e burimeve) që krijojnë një mjedis favorizues për "kapjen e shtetit", siç përshkruhet në literaturën e tranzicionit?</li>
                </ul>
                <p>Kjo analizë na lejon të bëjmë një dallim thelbësor: A është një performancë e dobët rezultat i paaftësisë së një gjyqtari, apo rezultat i një presioni të jashtëzakonshëm që e bën pothuajse të pamundur ruajtjen e pavarësisë?</p>
            </ArticleSection>

            <ArticleSection id="elementi-2" title="Elementi II: Ekosistemi Mediatik – Sfera Publike dhe Polarizimi">
                <p>Media nuk është një vëzhgues neutral i drejtësisë; ajo është një aktor i fuqishëm që formëson perceptimin publik dhe ushtron presion mbi gjyqtarët. Duke përdorur modelin e Hallin & Mancini (<em>Comparing Media Systems</em>)<SourceLink s={2}/>, ne e klasifikojmë ekosistemin mediatik shqiptar si "<KeyConcept term="Pluralist të Polarizuar" definition="Një model sistemi mediatik (tipik për Evropën Jugore) ku media ka një paralelizëm të lartë politik, një audiencë të kufizuar, dhe instrumentalizohet shpesh nga elitat politike dhe ekonomike.">Pluralist të Polarizuar</KeyConcept>", ku media është shpesh e lidhur ngushtë me interesat politike. Kjo ka pasoja direkte:</p>
                 <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Gjykimet Mediatike:</strong> Si ndikojnë gjykimet paralele në media në aftësinë e gjyqtarëve për të marrë një vendim të paanshëm, të bazuar vetëm në prova?</li>
                    <li><strong>Degradimi i Sferës Publike:</strong> A shërben media si një "<KeyConcept term="sferë publike" definition="Koncept i Habermas-it që përshkruan një hapësirë (metaforike) ku qytetarët mblidhen për të debatuar në mënyrë racionale mbi çështjet me interes të përbashkët, duke formuar kështu opinionin publik.">sferë publike</KeyConcept>" racionale, siç e përshkruan Jürgen Habermas<SourceLink s={3}/>, ku vendimet gjyqësore analizohen në mënyrë kritike, apo si një arenë për dezinformim dhe sulme personale që minojnë besimin te gjyqësori në tërësi?</li>
                </ul>
                <p>Analiza jonë do të vlerësojë se si ky ekosistem mediatik specifik ndikon në sjelljen e gjyqtarëve, duke i bërë disa më të trembur dhe konformistë, dhe të tjerë ndoshta më reaktivë dhe të prirur ndaj vëmendjes publike.</p>
            </ArticleSection>

            <ArticleSection id="elementi-3" title="Elementi III: Ekosistemi Profesional – Cilësia e Aktorëve të Tjerë">
                <p>Një gjyqtar nuk punon i vetëm. Cilësia e vendimit të tij/saj varet në mënyrë thelbësore nga cilësia e "lëndës së parë" që i ofrohet nga aktorët e tjerë profesionalë në sallën e gjyqit.</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Cilësia e Prokurorisë:</strong> A janë aktakuzat të mbështetura mirë në prova dhe të argumentuara qartë, apo janë të dobëta dhe e detyrojnë gjyqtarin të bëjë punën e hetimit?</li>
                    <li><strong>Cilësia e Avokatisë:</strong> A ofrojnë avokatët mbrojtje profesionale dhe të bazuar në ligj, apo përdorin taktika zvarritëse dhe argumente të pabazuara?</li>
                    <li><strong>Ngarkesa me Çështje dhe Burimet:</strong> A ka gjyqtari kohën dhe mbështetjen e nevojshme administrative (këshilltarë ligjorë, teknologji) për të studiuar thellësisht një çështje? Siç argumentojnë Acemoglu & Robinson<SourceLink s={4}/>, institucionet e pafinancuara dhe të mbingarkuara janë një recetë për dështim.</li>
                </ul>
                <p>Ky element na lejon të shmangim fajësimin e gjyqtarit individual për probleme që janë sistemike dhe që lidhen me kapacitetet e të gjithë zinxhirit të drejtësisë.</p>
            </ArticleSection>

            <ArticleSection id="elementi-4" title="Elementi IV: Ekosistemi Social – Roli i Kapitalit Social dhe Shoqërisë Civile">
                <p>Në fund të fundit, institucionet e drejtësisë janë "<KeyConcept term="të ngulitura" definition="Një koncept sociologjik (embeddedness) që thekson se veprimtaria ekonomike dhe institucionale nuk ndodh në vakum, por është e formësuar thellësisht nga marrëdhëniet shoqërore, normat dhe kultura.">të ngulitura</KeyConcept>" (embedded) në shoqërinë ku shërbejnë, një parim i theksuar nga Douglass North.<SourceLink s={5}/> Një gjyqësor nuk mund të jetë i suksesshëm në një shoqëri apatike apo cinike. Duke u mbështetur te puna e Robert Putnam (<em>Making Democracy Work</em>)<SourceLink s={6}/>, analiza jonë do të vlerësojë rolin e "<KeyConcept term="kapitalit social" definition="Tërësia e rrjeteve të bashkëpunimit, normave të reciprocitetit dhe besimit shoqëror që lehtësojnë veprimin kolektiv dhe përmirësojnë efikasitetit e shoqërisë.">kapitalit social</KeyConcept>":</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Angazhimi i Shoqërisë Civile:</strong> A ka organizata të shoqërisë civile që monitorojnë në mënyrë profesionale dhe të vazhdueshme sistemin e drejtësisë, duke kërkuar llogari dhe transparencë?</li>
                    <li><strong>Kultura e Ligjshmërisë:</strong> A ekziston në publik një kërkesë e gjerë për një drejtësi të paanshme, apo mbizotëron cinizmi dhe pritshmëria që lidhjet informale janë më të rëndësishme se ligji?</li>
                </ul>
                <p>Ky element përfundimtar na kujton se përforcimi i shtetit të së drejtës nuk është vetëm detyrë e gjyqtarëve dhe prokurorëve, por një projekt kolektiv. Një ekosistem social i shëndetshëm dhe vigjilent është garancia më e mirë afatgjatë për një gjyqësor të pavarur dhe të përgjegjshëm.</p>
            </ArticleSection>

            <ArticleSection id="perfundim" title="Përfundim: Një Pamje e Plotë">
                <p>Duke integruar analizën e ekosistemit si hapin final të metodologjisë sonë, ne sigurojmë një pamje të plotë dhe të nuancuar. Ajo na lejon të kuptojmë pse gjyqtarë me potencial mund të dështojnë në një mjedis toksik, dhe si gjyqtarë të mirë mund të lulëzojnë kur ekosistemi i mbështet. Kjo qasje e lëviz projektin tonë nga një ushtrim i thjeshtë vlerësimi në një diagnozë të thellë të shëndetit të demokracisë dhe shtetit të së drejtës në Shqipëri, duke ofruar jo vetëm kritika, por edhe një kuptim më të thellë të rrugëve komplekse drejt përmirësimit.</p>
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
            { url: window.location.href, published_at: new Date().toISOString(), article_id: 'judicial-ecosystem-analysis-02' },
            sourcesList,
            { researchHours: 85, focusKeyword: "Ekosistemi Gjyqësor" }
        );
    }, [fullArticleText, sourcesList]);

    const articleIntegrityProfile = useMemo(() => calculateArticleIntegrityProfile(articleMetrics), [articleMetrics]);

    const tocItems = [
        { id: 'hyrje', title: 'Hyrje: Përtej Gjyqtarit' },
        { id: 'elementi-1', title: 'Elementi I: Ekosistemi Politik' },
        { id: 'elementi-2', title: 'Elementi II: Ekosistemi Mediatik' },
        { id: 'elementi-3', title: 'Elementi III: Ekosistemi Profesional' },
        { id: 'elementi-4', title: 'Elementi IV: Ekosistemi Social' },
        { id: 'perfundim', title: 'Përfundim: Një Pamje e Plotë' },
        { id: 'indeksi', title: 'Indeksi i Termave Teknikë' },
        { id: 'bibliografia', title: 'Bibliografia dhe Referencat' },
    ];
    
    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Analiza e Ekosistemit Gjyqësor"
            headerSubtitle="Përtej Gjyqtarit – Forcat që Formësojnë Drejtësinë"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 30 Korrik, 2025",
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
            <header className="text-center mb-10">
                <div className="mt-8">
                    <div className="flex justify-center items-center mb-2">
                        <div className="relative flex items-center">
                            {/* Corrected prop name in onClick to onNavigateToNoraAiProfile */}
                            <button onClick={onNavigateToNoraAiProfile} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full transition-transform hover:scale-105 z-10">
                                <img 
                                    src="https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg" 
                                    alt="Përfaqësimi i Nora (AI)"
                                    className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
                                    title="Nora (AI)"
                                />
                            </button>
                            <button onClick={() => onNavigateToVipProfile('vip33')} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full -ml-5 relative transition-transform hover:scale-105">
                                <img 
                                    src="https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png" 
                                    alt="Dr Alban Gj. THIKA"
                                    className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
                                    title="Dr Alban Gj. THIKA"
                                />
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        {/* Corrected prop name in onClick to onNavigateToNoraAiProfile */}
                        Një punë hibride nga <button onClick={onNavigateToNoraAiProfile} className="font-bold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none">Nora (AI)</button> & <button onClick={() => onNavigateToVipProfile('vip33')} className="font-bold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none">Dr Alban Gj. THIKA</button>
                    </p>
                </div>
            </header>
            {articleContentJsx}
        </ArticleTemplate1>
    );
};
