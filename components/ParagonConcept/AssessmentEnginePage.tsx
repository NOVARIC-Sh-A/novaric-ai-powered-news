
import React, { useMemo, ReactNode, useState, useEffect } from 'react';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from '../templates/ArticleTemplate1';
import { ArticleMetrics, FullProfileAnalysis } from '../../types';
import { calculateArticleMetrics } from '../../utils/articleMetricsCalculator';
import { runParagonAnalysis } from '../../services/paragonEngine';
import { thikaProfileData } from '../../data/thikaProfileData';
import { useLanguage } from '../../contexts/LanguageContext';

interface ParagonConceptAssessmentEnginePageProps {
  onBack: () => void;
  onNavigateToResult: (result: FullProfileAnalysis) => void;
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
    pageTitle: "Motori i Vlerësimit PARAGON® | Koncepti | NOVARIC®",
    pageDescription: "Eksploroni motorin analitik që fuqizon Metodologjinë PARAGON®, duke integruar të dhëna nga katër shtylla kryesore për të prodhuar një profil të thelluar të liderëve politikë.",
    headerTitle: "Motori i Vlerësimit PARAGON®",
    headerSubtitle: "Sinteza e të Dhënave në Njohuri të Zbatueshme",
    introText: "Motori i Vlerësimit PARAGON® është zemra llogaritëse e metodologjisë sonë. Ai shërben si një platformë e sofistikuar për sintezën e të dhënave që integron njohuritë nga katër shtyllat tona metodologjike për të prodhuar një profil të thelluar, të bazuar në prova dhe të zbatueshëm të një lideri politik.",
    section1Title: "Arkitektura e Motorit: Një Proces me Katër Faza",
    phase1Title: "Faza 1: Përthithja dhe Përpunimi i të Dhënave",
    phase1Para: "Motori fillon duke përthithur të dhëna të strukturuara dhe të pastrukturuara nga të katër shtyllat. Kjo përfshin çdo gjë, nga të dhënat biografike dhe regjistrat e votimit te transkriptet e intervistave të sjelljes dhe rezultatet e vlerësimit 360-gradë.",
    phase2Title: "Faza 2: Llogaritja e Treguesve",
    phase2Para: "Për çdo dimension PARAGON®, motori llogarit një sërë treguesish specifikë. Për shembull, në dimensionin 'Pohimi & Ndikimi', ai mund të llogarisë centralitetin e rrjetit (nga Analiza e Rrjetit) dhe frekuencën e ndërhyrjeve legjislative të suksesshme (nga të dhënat e sjelljes).",
    phase3Title: "Faza 3: Ponderimi dhe Agregimi i Pikëzimit",
    phase3Para: "Ky është një hap kritik. Çdo tregues ponderohet bazuar në rëndësinë e tij të paracaktuar brenda kontekstit politik shqiptar. Më pas, motori përdor një algoritëm agregimi për të kombinuar pikët e ponderuara, duke prodhuar një pikëzim të përgjithshëm për secilin nga shtatë dimensionet PARAGON®.",
    phase4Title: "Faza 4: Gjenerimi i Diagnozës dhe Rekomandimeve",
    phase4Para: "Duke përdorur pikët e dimensioneve dhe të dhënat nga Korniza KAPSH, motori gjeneron një diagnozë përfundimtare. Ky proces përfshin rregulla të bazuara në logjikë për të identifikuar 'pikat e forta', 'pikat e verbëta' dhe 'zonat e rrezikut'. Për shembull, një kombinim i 'Pajtueshmërisë' së ulët (nga KAPSH) dhe 'Kohezionit Organizativ' të ulët (nga PARAGON®) do të shkaktonte një alarm për rrezikun e izolimit politik.",
    section2Title: "Parimet Themelore të Motorit",
    principle1Title: "Transparenca Algoritmike",
    principle1Para: "Ne i shmangemi qasjeve 'kuti e zezë'. Çdo pikëzim i gjeneruar nga motori është i gjurmueshëm deri te treguesit specifikë dhe të dhënat burimore që e kanë prodhuar atë. Kjo siguron që analizat tona të jenë të verifikueshme dhe të kuptueshme.",
    principle2Title: "Përshtatja Kontekstuale",
    principle2Para: "Peshat e përdorura në motor nuk janë universale. Ato janë kalibruar posaçërisht për të reflektuar realitetet dhe prioritetet e peizazhit politik shqiptar, duke pranuar se kompetencat që çojnë në sukses në një sistem mund të mos jenë të njëjtat në një tjetër.",
    principle3Title: "Përqendrimi te Zhvillimi",
    principle3Para: "Qëllimi përfundimtar i motorit nuk është të etiketojë, por të diagnostikojë. Duke identifikuar me saktësi pikat e forta dhe të dobëta, ai ofron një bazë të dhënash për ndërhyrje zhvillimore të synuara, si trajnimi në komunikim strategjik apo ndërtimi i koalicioneve.",
    conclusionTitle: "Përfundim: Nga të Dhënat te Veprimi",
    conclusionPara: "Motori i Vlerësimit PARAGON® shërben si ura midis mbledhjes së të dhënave dhe analizës së zbatueshme. Duke integruar në mënyrë sistematike njohuri nga fusha të ndryshme, ai e transformon atë që do të ishte një mal informacioni të shkëputur në një profil koherent dhe dinamik, duke fuqizuar si liderët ashtu edhe publikun me një kuptim më të thellë të asaj që e bën lidershipin politik efektiv."
  },
  en: {
    back: "Back",
    pageTitle: "PARAGON® Assessment Engine | Concept | NOVARIC®",
    pageDescription: "Explore the analytical engine powering the PARAGON Methodology, integrating data from four core pillars to produce a profound profile of political leaders.",
    headerTitle: "The PARAGON® Assessment Engine",
    headerSubtitle: "Synthesizing Data into Actionable Insight",
    introText: "The PARAGON® Assessment Engine is the computational heart of our methodology. It serves as a sophisticated data synthesis platform that integrates insights from our four methodological pillars to produce a profound, evidence-based, and actionable profile of a political leader.",
    section1Title: "Engine Architecture: A Four-Phase Process",
    phase1Title: "Phase 1: Data Ingestion and Processing",
    phase1Para: "The engine begins by ingesting structured and unstructured data from all four pillars. This includes everything from biographical data and voting records to transcripts of behavioral interviews and 360-degree feedback results.",
    phase2Title: "Phase 2: Indicator Calculation",
    phase2Para: "For each PARAGON® dimension, the engine calculates a series of specific indicators. For example, in the 'Asertiviteti & Ndikimi' dimension, it might calculate network centrality (from Network Analysis) and the frequency of successful legislative interventions (from behavioral data).",
    phase3Title: "Phase 3: Weighted Scoring and Aggregation",
    phase3Para: "This is a critical step. Each indicator is weighted based on its predetermined importance within the Albanian political context. The engine then uses an aggregation algorithm to combine the weighted scores, producing an overall score for each of the seven PARAGON® dimensions.",
    phase4Title: "Phase 4: Diagnosis and Recommendation Generation",
    phase4Para: "Using the dimension scores and the data from the KAPSH Framework, the engine generates a final diagnosis. This process involves logic-based rules to identify 'strengths,' 'blind spots,' and 'risk areas.' For example, a combination of low 'Agreeableness' (from KAPSH) and low 'Kohësioni Organizativ' (from PARAGON®) would trigger an alert for the risk of political isolation.",
    section2Title: "Core Principles of the Engine",
    principle1Title: "Algorithmic Transparency",
    principle1Para: "We avoid 'black box' approaches. Every score generated by the engine is traceable back to the specific indicators and source data that produced it. This ensures our analyses are verifiable and understandable.",
    principle2Title: "Contextual Adaptation",
    principle2Para: "The weights used in the engine are not universal. They are specifically calibrated to reflect the realities and priorities of the Albanian political landscape, acknowledging that the competencies that lead to success in one system may not be the same in another.",
    principle3Title: "Developmental Focus",
    principle3Para: "The ultimate goal of the engine is not to label, but to diagnose. By accurately identifying strengths and weaknesses, it provides a data-driven basis for targeted developmental interventions, such as strategic communication training or coalition-building.",
    conclusionTitle: "Conclusion: From Data to Action",
    conclusionPara: "The PARAGON® Assessment Engine serves as the bridge between data collection and actionable analysis. By systematically integrating insights from diverse fields, it transforms what would be a mountain of disconnected information into a coherent and dynamic profile, empowering both leaders and the public with a deeper understanding of what makes political leadership effective."
  }
};

export const ParagonConceptAssessmentEnginePage: React.FC<ParagonConceptAssessmentEnginePageProps> = (props) => {
    const { onBack, onNavigateToResult } = props;
    const { language, toggleLanguage } = useLanguage();
    const content = translations[language];

    const keywords = ["Motori PARAGON", "Analiza e të Dhënave", "Sinteza e të Dhënave", "Transparenca Algoritmike", "Vlerësimi Politik", "NOVARIC"];

    const sourcesList = useMemo(() => [], []);
    
    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="">
                <p className="italic text-lg">{content.introText}</p>
            </ArticleSection>

            <ArticleSection id="architecture" title={content.section1Title}>
                <p><strong>{content.phase1Title}:</strong> {content.phase1Para}</p>
                <p><strong>{content.phase2Title}:</strong> {content.phase2Para}</p>
                <p><strong>{content.phase3Title}:</strong> {content.phase3Para}</p>
                <p><strong>{content.phase4Title}:</strong> {content.phase4Para}</p>
            </ArticleSection>

            <ArticleSection id="principles" title={content.section2Title}>
                <p><strong>{content.principle1Title}:</strong> {content.principle1Para}</p>
                <p><strong>{content.principle2Title}:</strong> {content.principle2Para}</p>
                <p><strong>{content.principle3Title}:</strong> {content.principle3Para}</p>
            </ArticleSection>
            
            <ArticleSection id="conclusion" title={content.conclusionTitle}>
                <p>{content.conclusionPara}</p>
            </ArticleSection>
        </>
    ), [content]);

    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText,
            { url: window.location.href, published_at: new Date().toISOString(), article_id: 'paragon-concept-engine-01' },
            sourcesList,
            { researchHours: 100, focusKeyword: "Assessment Engine" }
        );
    }, [fullArticleText, sourcesList]);

    const handleGenerateMockAnalysis = () => {
        const mockResult = runParagonAnalysis(thikaProfileData);
        onNavigateToResult(mockResult);
    };

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
                        <div className="w-px h-4 bg-slate-200 dark:border-slate-700"></div>
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
                publicationInfo={{ publishedDate: "Publikuar: 30 Nëntor, 2025", location: "Shkodër, Shqipëri" }}
                tableOfContentsItems={[
                    { id: "architecture", title: content.section1Title },
                    { id: "principles", title: content.section2Title },
                    { id: "conclusion", title: content.conclusionTitle }
                ]}
                articleMetrics={articleMetrics}
                keywords={keywords}
                onBack={onBack}
                onNavigateToVipProfile={() => {}}
                onNavigateToArticleMetricsExplained={() => {}}
            >
                {articleContentJsx}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleGenerateMockAnalysis}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-lg transition-transform hover:scale-105"
                    >
                        Gjenero Analizën (Shembull) &rarr;
                    </button>
                </div>
            </ArticleTemplate1>
        </>
    );
};
