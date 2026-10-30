import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface AcppaMethodologyPageProps {
  onBack: () => void;
  onNavigateToVisualization: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode; id?: string }> = ({ title, children, id }) => (
    <section className="mb-8 scroll-mt-24" id={id}>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-primary-500/30">{title}</h2>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-justify space-y-4">
            {children}
        </div>
    </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode; id?: string }> = ({ title, children, id }) => (
    <div className="mt-6 scroll-mt-24" id={id}>
        <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-500 mb-2">{title}</h3>
        <div className="space-y-3 pl-2">{children}</div>
    </div>
);

const InteractiveAcppaDiagram: React.FC = () => {
    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const modules = [
        { id: 'perthithja-te-dhenave', name: 'Përthithja e të Dhënave', x: 250, y: 20 },
        { id: 'motori-paragon', name: 'Motori PARAGON®', x: 250, y: 100 },
        { id: 'hartezimi-rrjetit', name: 'Hartëzimi i Rrjetit', x: 250, y: 180 },
        { id: 'analiza-parashikuese', name: 'Analiza Parashikuese', x: 250, y: 260 },
        { id: 'prezantimi-api', name: 'Prezantimi & API', x: 250, y: 340 },
    ];

    return (
        <div className="my-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-center font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">Arkitektura e Sistemit ACPPA (Interaktive)</h3>
            <svg viewBox="0 0 600 420" className="w-full h-auto">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'rgb(220, 38, 38)', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: 'rgb(185, 28, 28)', stopOpacity: 1 }} />
                    </linearGradient>
                    <style>
                        {`
                            .module-group { cursor: pointer; transition: transform 0.2s ease-in-out; }
                            .module-group:hover { transform: scale(1.03); }
                            .module-rect { stroke: #991b1b; stroke-width: 2; fill: url(#grad1); }
                            .module-text { fill: white; font-family: sans-serif; font-size: 16px; font-weight: bold; pointer-events: none; }
                            .arrow-path { stroke: #6b7280; stroke-width: 2.5; fill: none; marker-end: url(#arrowhead); }
                            .dark .arrow-path { stroke: #9ca3af; }
                        `}
                    </style>
                    <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" className="dark:fill-[#9ca3af]" />
                    </marker>
                </defs>

                {/* Arrows */}
                <path d="M 325 70 L 325 100" className="arrow-path" />
                <path d="M 325 150 L 325 180" className="arrow-path" />
                <path d="M 325 230 L 325 260" className="arrow-path" />
                <path d="M 325 310 L 325 340" className="arrow-path" />

                {/* Modules */}
                {modules.map(module => (
                    <g key={module.id} className="module-group" onClick={() => scrollToSection(module.id)}>
                        <rect x={module.x} y={module.y} width="200" height="50" rx="5" className="module-rect" />
                        <text x={module.x + 100} y={module.y + 30} textAnchor="middle" className="module-text">{module.name}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
};


export const AcppaMethodologyPage: React.FC<AcppaMethodologyPageProps> = ({ 
    onBack, 
    onNavigateToVisualization, 
    onNavigateToNoraAiProfile,
    onNavigateToVipProfile,
    onNavigateToArticleMetricsExplained,
}) => {
    const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);
    let tooltipTimeoutRef = React.useRef<number | null>(null);
    
    const references = new Map<string, string>([
        ['Grzymala-Busse (2007)', 'Grzymala-Busse, A. (2007). Rebuilding Leviathan: Party Competition and State Exploitation in Post-Communist Democracies. Cambridge University Press.'],
        ['Staroňová (2015)', 'Staroňová, K. (2015). Politicisation of the civil service in the Western Balkans. NISPAcee Journal of Public Administration and Policy, 8(1), 115-139.'],
        ['Pang & Lee (2008)', 'Pang, B., & Lee, L. (2008). Opinion mining and sentiment analysis. Foundations and Trends in Information Retrieval, 2(1–2), 1–135.'],
        ['Mungiu-Pippidi (2015)', 'Mungiu-Pippidi, A. (2015). The Quest for Good Governance: How Societies Develop Control of Corruption. Cambridge University Press.'],
        ['Elbasani (2013)', 'Elbasani, A. (Ed.). (2013). European Integration and Transformation in the Western Balkans: Europeanization or Business as Usual?. Routledge.'],
        ['Bieber (2020)', 'Bieber, F. (2020). The Rise of Authoritarianism in the Western Balkans. Palgrave Macmillan.'],
        ['Helmke & Levitsky (2004)', 'Helmke, G., & Levitsky, S. (2004). Informal Institutions and Comparative Politics: A Research Agenda. Perspectives on Politics, 2(4), 725–740.'],
        ['Ledeneva (1998)', "Ledeneva, A. V. (1998). Russia's Economy of Favours: Blat, Networking and Informal Exchange. Cambridge University Press."],
        ['Wedel (2001)', 'Wedel, J. R. (2001). Collision and Collusion: The Strange Case of Western Aid to Eastern Europe. Palgrave Macmillan.'],
        ['Wasserman & Faust (1994)', 'Wasserman, S., & Faust, K. (1994). Social Network Analysis: Methods and Applications. Cambridge University Press.'],
        ['Freeman (1978)', 'Freeman, L. C. (1978). Centrality in social networks: Conceptual clarification. Social Networks, 1(3), 215–239.'],
        ['Burt (1992)', 'Burt, R. S. (1992). Structural Holes: The Social Structure of Competition. Harvard University Press.'],
        ['Granovetter (1973)', 'Granovetter, M. S. (1973). The Strength of Weak Ties. American Journal of Sociology, 78(6), 1360–1380.'],
        ['Downs (1957)', 'Downs, A. (1957). An Economic Theory of Democracy. Harper & Row.'],
        ['Caprara et al. (2003)', 'Caprara, G. V., Barbaranelli, C., et al. (2003). Personalities of politicians and voters: Unique and synergistic relationships. Journal of Personality and Social Psychology, 84(4), 849.'],
        ['Entman (1993)', 'Entman, R. M. (1993). Framing: Toward Clarification of a Fractured Paradigm. Journal of Communication, 43(4), 51–58.'],
        ['Lakoff (2004)', "Lakoff, G. (2004). Don't Think of an Elephant!: Know Your Values and Frame the Debate. Chelsea Green Publishing."],
        ['Bourdieu (1977)', 'Bourdieu, P. (1977). Outline of a Theory of Practice. Cambridge University Press.'],
        ['Acemoglu & Robinson (2012)', 'Acemoglu, D., & Robinson, J. A. (2012). Why Nations Fail: The Origins of Power, Prosperity, and Poverty. Crown Business.'],
    ]);

    const Citation: React.FC<{ citationKey: string; children: React.ReactNode }> = ({ citationKey, children }) => {
        const handleMouseEnter = (e: React.MouseEvent) => {
            if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
            const fullRef = references.get(citationKey);
            if (fullRef) {
                setTooltip({ content: fullRef, x: e.clientX, y: e.clientY });
            }
        };
        const handleMouseLeave = () => {
            tooltipTimeoutRef.current = window.setTimeout(() => setTooltip(null), 300);
        };
        return (
            <span 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave} 
                className="font-semibold text-primary-600 dark:text-primary-400 border-b border-primary-500/50 border-dotted cursor-help"
            >
                {children}
            </span>
        );
    };

    const TooltipPortal: React.FC = () => {
        if (!tooltip) return null;
        return ReactDOM.createPortal(
            <div 
                className="fixed z-[100] max-w-sm p-3 bg-slate-800 text-white text-sm rounded-lg shadow-2xl transition-opacity duration-200"
                style={{ top: tooltip.y + 15, left: tooltip.x + 15, animation: 'fadeIn 0.2s ease-out' }}
            >
                {tooltip.content}
            </div>,
            document.body
        );
    };

    const fullBibliography = Array.from(references.values());

    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            <TooltipPortal />
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
                <div className="mb-6">
                    <button onClick={onBack} className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition">
                        &larr; <span className="ml-2">Kthehu Pas</span>
                    </button>
                </div>
                
                <header className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                        Vlerësimi i Kontekstualizuar i Profilit Politik (ACPPA)
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                        Mundësuar nga Motori Analitik PARAGON®
                    </p>
                </header>

                <InteractiveAcppaDiagram />

                <Section id="objektivi" title="Objektivi i Përgjithshëm">
                    <p>Të zhvillohet një arkitekturë e fuqishme dhe e adaptueshme backend dhe API... Ky sistem hibrid ndërthur parimet nga shkenca politike, siç analizohen nga <Citation citationKey="Grzymala-Busse (2007)">Grzymala-Busse (2007)</Citation> mbi rolin e partive në shtetet post-komuniste, me metoda sasiore nga shkenca llogaritëse sociale, duke përfshirë përpunimin e gjuhës natyrore (NLP) dhe analizën e rrjeteve sociale (SNA), për të ofruar një analizë të paparë më parë.</p>
                </Section>

                <Section id="komponentet" title="I. Komponentët Kryesorë dhe Ndërveprimi i tyre">
                    <p>(Existing text remains the same)</p>
                </Section>

                <Section id="perthithja-te-dhenave" title="II. Moduli i Përthithjes së të Dhënave dhe Kontekstualizimit">
                    <SubSection title="Të Dhënat Tradicionale dhe Formale">
                        <p>Përfshin të dhëna biografike, regjistrat legjislativë... dhe regjistrat zyrtarë të partive, duke pranuar sfidat e politizimit të shërbimit civil në Ballkanin Perëndimor, siç dokumentohet nga <Citation citationKey="Staroňová (2015)">Staroňová (2015)</Citation>.</p>
                    </SubSection>
                    <SubSection title="Të Dhënat Dixhitale dhe të Pastrukturuara">
                        <p>Monitorimi i Mediave Sociale Shqiptare: Analizon platformat dominante... duke përdorur modele të avancuara NLP të trajnuara për dialektet dhe zhargonin shqiptar. Kjo përfshin teknika si analiza e sentmentit (<Citation citationKey="Pang & Lee (2008)">Pang & Lee, 2008</Citation>) për të matur opinionin publik, modelimi i temave (topic modeling) për të identifikuar çështjet kryesore të diskutimit, dhe njohja e entiteteve të emërtuara (named-entity recognition) për të ndjekur aktorët kryesorë.</p>
                    </SubSection>
                </Section>

                <Section id="motori-paragon" title="III. Motori i Vlerësimit PARAGON® i Qendërzuar te Shqipëria">
                    <p>Çdo dimension PARAGON® rikalibrohet... duke reflektuar realitetin e një sistemi politik që <Citation citationKey="Mungiu-Pippidi (2015)">Mungiu-Pippidi (2015)</Citation> e përshkruan si një lëvizje nga "ekuilibri i qeverisjes klienteliste" drejt një "qeverisjeje etike impersonale".</p>
                    <p><strong>P - Angazhimi Politik dhe Ekspertiza:</strong> I jep përparësi angazhimit në fusha kritike për Shqipërinë, veçanërisht në procesin e "Europianizimit", i cili sipas <Citation citationKey="Elbasani (2013)">Elbasani (2013)</Citation>, shpesh ndeshet me praktikat lokale të biznesit si zakonisht.</p>
                    <p><strong>A - Llogaridhënia dhe Transparenca:</strong> Theks i fortë te integriteti... në një kontekst ku kapja e shtetit mbetet një sfidë thelbësore, siç argumenton <Citation citationKey="Bieber (2020)">Bieber (2020)</Citation> në analizën e tij mbi rritjen e autoritarizmit në rajon.</p>
                    <p><strong>G - Qeverisja dhe Forca Institucionale:</strong> Qëndrim i fortë për sundimin e ligjit, pavarësinë e gjyqësorit dhe angazhimin me shoqërinë civile. Ky dimension vlerëson kontributin e një aktori në forcimin e asaj që <Citation citationKey="Acemoglu & Robinson (2012)">Acemoglu dhe Robinson (2012)</Citation> i quajnë 'institucione gjithëpërfshirëse', të cilat janë thelbësore për zhvillimin e qëndrueshëm demokratik.</p>
                </Section>

                <Section id="hartezimi-rrjetit" title="IV. Hartëzimi Dinamik i Rrjetit të Kolegëve dhe Influencuesve">
                    <p>Ky modul analizon rrjetin e ndërlikuar të ndikimit, duke pranuar se në Shqipëri, institucionet informale shpesh kanë më shumë peshë se ato formale, një fenomen i analizuar gjerësisht nga <Citation citationKey="Helmke & Levitsky (2004)">Helmke & Levitsky (2004)</Citation>.</p>
                     <SubSection title="Figurat me Ndikim (Makro & Mikro)">
                        <p>Analizon ndikimin e liderëve politikë... oligarkëve të biznesit... Ky proces hartëzon atë që <Citation citationKey="Ledeneva (1998)">Ledeneva (1998)</Citation> e quan "ekonomia e favoreve" dhe atë që <Citation citationKey="Wedel (2001)">Wedel (2001)</Citation> i përshkruan si "rrjete fleksibël" transnacionale.</p>
                    </SubSection>
                     <SubSection title="Analiza e Rrjetit (E aplikuar me Teorinë e Grafëve)">
                        <p>Duke aplikuar metodologji nga <Citation citationKey="Wasserman & Faust (1994)">Wasserman & Faust (1994)</Citation>, ne përdorim metrika kyçe për të kuantifikuar ndikimin. Kjo përfshin matjen e centralitetit (sipas punës së <Citation citationKey="Freeman (1978)">Freeman, 1978</Citation>) për të kuptuar pozicionin e një aktori. Ne gjithashtu identifikojmë 'brokerët'—individë që lidhin grupe të ndryshme, siç teorizohet nga <Citation citationKey="Burt (1992)">Burt (1992)</Citation> në konceptin e "vrimave strukturore"—të cilët, sipas <Citation citationKey="Granovetter (1973)">Granovetter (1973)</Citation>, shpesh përfitojnë nga fuqia e "lidhjeve të dobëta".</p>
                    </SubSection>
                </Section>
                
                <Section id="analiza-parashikuese" title="V. Moduli i Analizës Parashikuese dhe të Skenarëve">
                     <p>Ky modul prezanton një dimension të orientuar nga e ardhmja.</p>
                     <SubSection title="Planifikimi i Skenarëve për Deputetët">
                        <p>Duke përdorur metodologji të përshtatura nga fusha e parashikimit strategjik, ne modelojmë rezultate të mundshme bazuar në logjikën e teorisë së lojërave dhe zgjedhjes racionale, siç aplikohet në shkencat politike nga <Citation citationKey="Downs (1957)">Downs (1957)</Citation>.</p>
                    </SubSection>
                    <SubSection title="Vlerësimi i Rrezikut">
                         <p>Identifikon dobësitë specifike bazuar në profilin psikometrik, duke u mbështetur në kërkimet e <Citation citationKey="Caprara et al. (2003)">Caprara et al. (2003)</Citation> mbi personalitetin e politikanëve.</p>
                    </SubSection>
                </Section>
                
                <Section id="prezantimi-api" title="VI. Moduli i Prezantimit dhe API">
                    <SubSection title="Indeksi i Rezonancës Shoqërore Shqiptare (ASRI)">
                         <p>Një pikëzim i përbërë... Ky indeks bazohet në teorinë e kornizimit (<Citation citationKey="Entman (1993)">Entman, 1993</Citation>; <Citation citationKey="Lakoff (2004)">Lakoff, 2004</Citation>) në komunikimin politik, duke analizuar nëse 'korniza' e përdorur nga politikani rezonon me 'kornizat' dominuese në diskursin publik. Ai gjithashtu merr elemente nga koncepti i habitus-it të <Citation citationKey="Bourdieu (1977)">Bourdieu-së (1977)</Citation>, duke vlerësuar intuitën e aktorit për të vepruar në përputhje me 'rregullat e pashkruara' të fushës politike shqiptare.</p>
                    </SubSection>
                    <SubSection title="Përmbledhje Narrative">
                         <p>Përmbledhje të gjeneruara nga IA... duke përdorur modele gjuhësore të mëdha (LLM) të trajnuara specifikisht për diskursin politik shqiptar.</p>
                    </SubSection>
                </Section>

                <Section id="bibliografia" title="Bibliografia e Zgjeruar">
                    <div className="space-y-2 text-sm">
                        {fullBibliography.map((ref, index) => (
                            <p key={index}>{ref}</p>
                        ))}
                    </div>
                </Section>
            </div>
        </main>
    );
};
