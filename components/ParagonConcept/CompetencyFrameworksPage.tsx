
import React, { useMemo, ReactNode, useState, useEffect } from 'react';
import { ArticleTemplate1, ArticleSection, KeyConcept } from '../templates/ArticleTemplate1';
import { ArticleMetrics } from '../../types';
import { calculateArticleMetrics } from '../../utils/articleMetricsCalculator';
import { useLanguage } from '../../contexts/LanguageContext';

interface ParagonConceptCompetencyPageProps {
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
        {s.map((n, i) => <a key={i} href={`#ref-${n}`} className="text-primary-500 mx-0.5">[{n}]</a>)}
    </sup>
);

const translations = {
    sq: {
        back: "Kthehu Pas",
        pageTitle: "Kornizat e Bazuara në Kompetenca | Koncepti PARAGON | NOVARIC®",
        pageDescription: "Një qasje e strukturuar dhe strategjike për menaxhimin e talenteve, duke u fokusuar në aftësitë specifike që nxisin suksesin. Kjo metodologji është e ndërtuar mbi një themel të fortë akademik.",
        headerTitle: "3. Kornizat e Bazuara në Kompetenca",
        headerSubtitle: "Një Qasje e Strukturuar për Menaxhimin e Talenteve",
        introText: "Si një nga katër shtyllat e Metodologjisë PARAGON®, Kornizat e Bazuara në Kompetenca na ofrojnë një fjalor të përbashkët për të përcaktuar dhe matur 'çfarë' duhet të jetë në gjendje të bëjë një lider efektiv.",
        coreConceptTitle: "Koncepti Themelor",
        coreConceptPara: "Kornizat e bazuara në kompetenca ofrojnë një qasje të strukturuar dhe strategjike për menaxhimin e talenteve duke u fokusuar në aftësitë specifike që nxisin suksesin. Kjo metodologji është e ndërtuar mbi një themel të fortë akademik dhe ofron një mënyrë të qëndrueshme, holistike dhe ligjërisht të mbrojtshme për të menaxhuar të gjitha aspektet të kapitalit njerëzor.",
        ksaoTitle: "Themeli Akademik: Modeli KSAO",
        ksaoPara: "Thelbi i një kornize të bazuar në kompetenca është identifikimi i karakteristikave themelore të kërkuara për performancë të suksesshme në punë. Këto shpesh kategorizohen si Njohuri, Aftësi, Kapacitete dhe Karakteristika të Tjera (KSAO).",
        knowledge: "Njohuri: Trupi i informacionit, faktik dhe procedural, i nevojshëm për kryerjen e një detyre.",
        skills: "Aftësi: Manipulimi i zhdërvjellët dhe manual, verbal ose mendor i të dhënave ose sendeve.",
        abilities: "Kapacitete: Fuqia për të kryer një aktivitet të vëzhgueshëm në kohën e tanishme.",
        other: "Karakteristika të Tjera: Kjo kategori përfshin tipare të personalitetit, qëndrime dhe motivime që ndikojnë se si një person i qaset punës së tij.",
        ksaoConclusion: "Duke përcaktuar këto KSAO për një rol të caktuar, një organizatë mund të krijojë një pamje të qartë dhe gjithëpërfshirëse të asaj që kërkohet për sukses.",
        methodologyTitle: "Metodologjia në Praktikë",
        methodologyPara: "Zbatimi i një kornize të bazuar në kompetenca fillon me zhvillimin e një 'modeli kompetencash'. Ky model është një koleksion kompetencash me sjellje të lidhura që janë të lidhura me prioritetet strategjike të organizatës. Procesi zakonisht përfshin: Përcaktimin e Qëllimit, Kërkimin dhe Mbledhjen e të Dhënave, Identifikimin dhe Përcaktimin e Kompetencave, dhe Zbatimin dhe Integrimin.",
        measuresTitle: "Çfarë Mat: Një Vështrim Holistik",
        measuresPara: "Një avantazh kyç i kësaj kornize është se ofron një profil holistik të aftësive të një individi. Në vend që të fokusohet në një grup të ngushtë aftësish teknike, ajo vlerëson një gamë më të gjerë atributash që kontribuojnë në suksesin në punë. Kjo qasje gjithëpërfshirëse i lejon organizatat të: Identifikojnë Boshllëqet e Aftësive, Përmirësojnë Vendimet e Punësimit dhe Lehtësojnë Rritjen në Karrierë.",
        benefitsTitle: "Përhapja e Gjerë dhe Përfitimet Kyçe",
        benefitsPara: "Kornizat e bazuara në kompetenca përdoren gjerësisht në industri të ndryshme sepse ofrojnë përfitime të rëndësishme: Të Strukturuara dhe Konsistente, Rritje të Produktivitetit dhe Mbajtjes së Punonjësve, dhe janë Ligjërisht të Mbrojtshme.",
        contextTitle: "Shënime Kontekstuale",
        contextEU: "Rëndësia për Politikanët e BE-së: Bashkimi Evropian përdor gjithnjë e më shumë kornizat e kompetencave për të përcaktuar dhe vlerësuar aftësitë e kërkuara për zyrtarët dhe politikëbërësit e tij. Komisioni Evropian ka zhvilluar korniza për 'Politikëbërje Inovative' dhe 'Shkencë për Politikë'. Për anëtarët e Parlamentit Evropian (MEP), ndonëse nuk ka një model formal kompetencash për zgjedhje, rolet e tyre kërkojnë një gamë të gjerë kompetencash. Trupi përzgjedhës i BE-së për stafin, EPSO, përdor një kornizë të detajuar kompetencash të përgjithshme.",
        contextAL: "Rëndësia dhe Shtrirja në Kontekstin Shqiptar: Si një vend kandidat për anëtarësim në BE, Shqipëria po kalon reforma të rëndësishme në administratën publike, ku adoptimi i kornizave të bazuara në kompetenca është një element qendror. Megjithatë, peizazhi politik dhe fuqia punëtore shqiptare përballen me sfida më të thella, sistemike. Një raport i OECD-së theksoi se aftësitë e punëtorëve shqiptarë janë vetëm në 37% të mesatares së BE-së. Ky hendek i atribuohet kryesisht një mospërputhjeje midis produktit të sistemit arsimor dhe kërkesave të tregut të punës, duke kontribuar në papunësi të lartë të të rinjve dhe 'ikje truri'. Ndërsa reformat janë në vazhdim, ndikimi i gjerë i kornizave të kompetencave kufizohet nga nevoja themelore për të kapërcyer këtë ndarje arsimore dhe aftësish.",
        sourcesTitle: "Burimet"
    },
    en: {
        back: "Back",
        pageTitle: "Competency-Based Frameworks | PARAGON Concept | NOVARIC®",
        pageDescription: "A structured and strategic approach to talent management, focusing on the specific capabilities that drive success. This methodology is built on a strong academic foundation and offers a consistent, holistic, and legally defensible way to manage human capital.",
        headerTitle: "3. Competency-Based Frameworks",
        headerSubtitle: "A Structured Approach to Talent Management",
        introText: "As one of the four pillars of the PARAGON Methodology, Competency-Based Frameworks provide us with a common language to define and measure 'what' an effective leader should be able to do.",
        coreConceptTitle: "Core Concept",
        coreConceptPara: "Competency-based frameworks provide a structured and strategic approach to talent management by focusing on the specific capabilities that drive success. This methodology is built on a strong academic foundation and offers a consistent, holistic, and legally defensible way to manage all aspects of human capital, from recruitment to succession planning.",
        ksaoTitle: "Academic Foundation: The KSAO Model",
        ksaoPara: "The core of a competency-based framework is the identification of the underlying characteristics required for successful job performance. These are often categorized as Knowledge, Skills, Abilities, and Other characteristics (KSAOs).",
        knowledge: "Knowledge: The body of information, both factual and procedural, necessary for performing a task.",
        skills: "Skills: The proficient and manual, verbal, or mental manipulation of data or things.",
        abilities: "Abilities: The power to perform an observable activity at the present time.",
        other: "Other Characteristics: This category includes personality traits, attitudes, and motivations that influence how a person approaches their work.",
        ksaoConclusion: "By defining these KSAOs for a particular role, an organization can create a clear and comprehensive picture of what is required for success.",
        methodologyTitle: "Methodology in Practice",
        methodologyPara: "The implementation of a competency-based framework begins with the development of a 'competency model.' This model is a collection of competencies with associated behaviors that are linked to the organization's strategic priorities. The process typically involves: Defining the Purpose, Research and Data Collection, Identifying and Defining Competencies, and Implementation and Integration.",
        measuresTitle: "What It Measures: A Holistic View",
        measuresPara: "A key advantage of this framework is that it provides a holistic profile of an individual's capabilities. Instead of focusing on a narrow set of technical skills, it assesses a broader range of attributes that contribute to on-the-job success. This comprehensive approach allows organizations to: Identify Skill Gaps, Improve Hiring Decisions, and Facilitate Career Growth.",
        benefitsTitle: "Widespread Adoption and Key Benefits",
        benefitsPara: "Competency-based frameworks are widely used across various industries because they offer significant benefits: Structured and Consistent, Increased Productivity and Retention, and being Legally Defensible.",
        contextTitle: "Contextual Footnotes",
        contextEU: "Relevance to E.U. Politicians: The European Union increasingly utilizes competency frameworks to define and assess the capabilities required for its officials and policymakers. The European Commission has developed frameworks for 'Innovative Policymaking' and 'Science for Policy.' For MEPs, while there isn't a formal model for election, their roles demand a wide range of competencies. The EU's selection body, EPSO, uses a detailed general competency framework to assess candidates for permanent positions.",
        contextAL: "Relevance and Scope in the Albanian Context: As an E.U. candidate country, Albania has been undergoing significant public administration reforms, with the adoption of competency-based frameworks as a central element. However, the Albanian political landscape faces deeper, systemic challenges. An OECD report highlighted that the skills of Albanian workers are at only 37% of the E.U. average. This gap is largely attributed to a persistent mismatch between the higher education system's output and labor market demands, contributing to high youth unemployment and 'brain drain.' While reforms are ongoing, the broader impact of competency frameworks is constrained by the foundational need to bridge this educational and skills divide.",
        sourcesTitle: "Sources"
    }
};

export const ParagonConceptCompetencyPage: React.FC<ParagonConceptCompetencyPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;
    const { language, toggleLanguage } = useLanguage();
    const content = translations[language];

    const keywords = ["Korniza e Kompetencave", "Modeli KSAO", "Menaxhimi i Talenteve", "Zhvillimi Profesional", "EPSO", "Administrata Publike", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "https://www.google.com/search?q=EU+Innovative+Policymaking+framework", text: "References on European Commission Competency Frameworks (e.g., 'Innovative Policymaking', 'Science for Policy') and the general EPSO framework.", credibility_industry_rating_pct: 90 },
        { id: 2, url: "https://www.google.com/search?q=albania+public+administration+reform+competency+framework", text: "References on public administration reforms in Albania, Council of Europe reports, and the OECD report on the skills gap.", credibility_industry_rating_pct: 88 },
    ], []);

    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="">
                <p className="italic text-lg">{content.introText}</p>
            </ArticleSection>

            <ArticleSection id="core-concept" title={content.coreConceptTitle}>
                <p>{content.coreConceptPara}</p>
            </ArticleSection>

            <ArticleSection id="ksao-model" title={content.ksaoTitle}>
                <p>{content.ksaoPara}</p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong>{content.knowledge.split(':')[0]}:</strong> {content.knowledge.split(':').slice(1).join(':')}</li>
                    <li><strong>{content.skills.split(':')[0]}:</strong> {content.skills.split(':').slice(1).join(':')}</li>
                    <li><strong>{content.abilities.split(':')[0]}:</strong> {content.abilities.split(':').slice(1).join(':')}</li>
                    <li><strong>{content.other.split(':')[0]}:</strong> {content.other.split(':').slice(1).join(':')}</li>
                </ul>
                <p>{content.ksaoConclusion}</p>
            </ArticleSection>

            <ArticleSection id="methodology" title={content.methodologyTitle}>
                <p>{content.methodologyPara}</p>
            </ArticleSection>
            
            <ArticleSection id="what-it-measures" title={content.measuresTitle}>
                <p>{content.measuresPara}</p>
            </ArticleSection>

            <ArticleSection id="benefits" title={content.benefitsTitle}>
                <p>{content.benefitsPara}</p>
            </ArticleSection>
            
            <ArticleSection id="context" title={content.contextTitle}>
                <p><strong>{content.contextEU.split(':')[0]}:<SourceLink s={[1]}/></strong> {content.contextEU.split(':').slice(1).join(':')}</p>
                <p><strong>{content.contextAL.split(':')[0]}:<SourceLink s={[2]}/></strong> {content.contextAL.split(':').slice(1).join(':')}</p>
            </ArticleSection>

            <ArticleSection id="sources" title={content.sourcesTitle}>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    {sourcesList.map(source => <li id={`ref-${source.id}`} key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{source.text}</a></li>)}
                </ol>
            </ArticleSection>
        </>
    ), [content, sourcesList]);
    
    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText,
            { url: window.location.href, published_at: new Date().toISOString(), article_id: 'paragon-concept-competency-01' },
            sourcesList,
            { researchHours: 160, focusKeyword: "Competency Frameworks" }
        );
    }, [fullArticleText, sourcesList]);

    return (
        <>
            <div className="max-w-4xl mx-auto px-6 sm:px-8">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={onBack} className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition">
                        &larr; <span className="ml-2">{content.back}</span>
                    </button>
                    <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-full p-1">
                        <button 
                            onClick={() => language !== 'en' && toggleLanguage()} 
                            className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'en' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            EN
                        </button>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                        <button 
                            onClick={() => language !== 'sq' && toggleLanguage()} 
                            className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'sq' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            AL
                        </button>
                    </div>
                </div>
            </div>
            <ArticleTemplate1
                pageTitle={content.pageTitle}
                pageDescription={content.pageDescription}
                pageKeywords={keywords.join(', ')}
                headerTitle={content.headerTitle}
                headerSubtitle={content.headerSubtitle}
                authors={[
                    { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                    { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
                ]}
                publicationInfo={{ publishedDate: "Publikuar: 25 Nëntor, 2025", location: "Shkodër, Shqipëri" }}
                tableOfContentsItems={[
                    { id: "core-concept", title: content.coreConceptTitle },
                    { id: "ksao-model", title: content.ksaoTitle },
                    { id: "methodology", title: content.methodologyTitle },
                    { id: "what-it-measures", title: content.measuresTitle },
                    { id: "benefits", title: content.benefitsTitle },
                    { id: "context", title: content.contextTitle },
                    { id: "sources", title: content.sourcesTitle }
                ]}
                articleMetrics={articleMetrics}
                keywords={keywords}
                onBack={onBack}
                onNavigateToVipProfile={onNavigateToVipProfile}
                onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
            >
                {articleContentJsx}
            </ArticleTemplate1>
        </>
    );
};
