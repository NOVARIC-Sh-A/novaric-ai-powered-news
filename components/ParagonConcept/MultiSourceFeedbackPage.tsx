
import React, { useMemo, ReactNode, useState, useEffect } from 'react';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from '../templates/ArticleTemplate1';
import { ArticleMetrics } from '../../types';
import { calculateArticleMetrics } from '../../utils/articleMetricsCalculator';
import { useLanguage } from '../../contexts/LanguageContext';

interface ParagonConceptMultiSourceFeedbackPageProps {
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
        pageTitle: "Sistemet e Feedback-ut nga Burime të Shumëfishta | Koncepti PARAGON | NOVARIC®",
        pageDescription: "Mësoni rreth sistemeve të Feedback-ut 360-Gradë si pjesë e Konceptit PARAGON. Kjo faqe eksploron themelin akademik, metodologjinë dhe rëndësinë e feedback-ut nga burime të shumëfishta si në kontekstin e BE-së ashtu edhe në atë shqiptar.",
        headerTitle: "Sistemet e Feedback-ut nga Burime të Shumëfishta",
        headerSubtitle: "A. Feedback 360-Gradë",
        introText: "Si një nga katër shtyllat e Metodologjisë PARAGON®, Sistemet e Feedback-ut na ndihmojnë të kuptojmë se si një lider perceptohet nga ata që e rrethojnë, duke zbuluar 'pikat e verbëra' kritike.",
        introTitle: "Sistemet e Feedback-ut nga Burime të Shumëfishta",
        feedbackTitle: "A. Feedback 360-Gradë",
        feedbackFoundation: "Themeli Akademik: I rrënjosur në teoritë e psikologjisë sociale dhe zhvillimit organizativ që theksojnë vlerën e perspektivave të shumëfishta për vetëdije të saktë dhe zhvillim. Modeli i Dritares Johari, për shembull, përputhet me këtë qëllim duke kërkuar të zbulojë 'pikat e verbëra' përmes perceptimeve të jashtme.",
        feedbackMethodology: "Metodologjia: Një individ merr feedback konfidencial dhe anonim nga njerëzit me të cilët punon, duke përfshirë menaxherin, kolegët, vartësit e drejtpërdrejtë dhe ndonjëherë klientët. Kjo krahasohet me vetëvlerësimin e tyre.",
        feedbackMeasures: "Çfarë Mat: Kryesisht identifikon boshllëqet midis vetë-perceptimit të një individi dhe mënyrës se si ata perceptohen nga të tjerët në një sërë kompetencash. Ky proces zbulon 'pikat e verbëra' (dobësi të panjohura) dhe 'pikat e forta të fshehura' (atribute pozitive të nënvlerësuara).",
        feedbackUsage: "Pse Përdoret Gjerësisht: Është një mjet i fuqishëm për zhvillimin profesional dhe të lidershipit. Rekomandohet për qëllime zhvillimore dhe jo për vlerësim performance për të shmangur politizimin e procesit.",
        contextTitle: "Shënime & Rëndësia Kontekstuale",
        contextEU: "Rëndësia për Politikanët e BE-së: Ndërsa nuk është një procedurë standarde formale për zyrtarët e zgjedhur, parimet e feedback-ut 360-gradë janë shumë relevante në Bashkimin Evropian, ku llogaridhënia dhe perceptimi publik janë kritike. Komisioni Evropian dhe organe të tjera të BE-së përdorin mekanizma të ndryshëm të feedback-ut publik. Brenda institucioneve të BE-së, feedback-u 360-gradë përdoret si një mjet zhvillimi profesional për menaxherët.",
        contextAL: "Rëndësia dhe Shtrirja në Kontekstin Shqiptar: Koncepti po fiton terren në Shqipëri, i nxitur nga reformat e administratës publike të kërkuara për procesin e integrimit në BE. Legjislacioni i ri për shërbimin civil thekson një administratë publike të bazuar në merita dhe të llogaridhënshme. Sfidat mbeten në ndërtimin e kapaciteteve për vlerësim efektiv të performancës. Megjithatë, programet e lidershipit si LEAD Albania po nxisin një brez të ri liderësh që kanë më shumë gjasa të adoptojnë mjete të tilla zhvillimore.",
        sourcesTitle: "Burimet"
    },
    en: {
        back: "Back",
        pageTitle: "Multi-Source Feedback Systems | PARAGON Concept | NOVARIC®",
        pageDescription: "Learn about 360-Degree Feedback systems as part of the PARAGON Concept. This page explores the academic foundation, methodology, and relevance of multi-source feedback in both the E.U. and Albanian contexts.",
        headerTitle: "Multi-Source Feedback Systems",
        headerSubtitle: "A. 360-Degree Feedback",
        introText: "As one of the four pillars of the PARAGON Methodology, Feedback Systems help us understand how a leader is perceived by those around them, uncovering critical 'blind spots'.",
        introTitle: "Multi-Source Feedback Systems",
        feedbackTitle: "A. 360-Degree Feedback",
        feedbackFoundation: "Academic Foundation: Rooted in social psychology and organizational development theories that emphasize the value of multiple perspectives for accurate self-awareness and development. The Johari Window model, for instance, aligns with this goal by seeking to uncover 'blind spots' through external perceptions.",
        feedbackMethodology: "Methodology: An individual receives confidential, anonymous feedback from people who work with them, including their manager, peers, direct reports, and sometimes customers. This is compared against their own self-assessment.",
        feedbackMeasures: "What It Measures: It primarily identifies gaps between an individual's self-perception and how they are perceived by others across a range of competencies. This process reveals 'blind spots' (unrecognized weaknesses) and 'hidden strengths' (undervalued positive attributes).",
        feedbackUsage: "Why It's Widely Used: It is a powerful tool for professional and leadership development. Its use is recommended for developmental purposes rather than performance evaluation to avoid politicizing the process.",
        contextTitle: "Footnotes & Contextual Relevance",
        contextEU: "Relevance to E.U. Politicians: While not a standard formal procedure for elected officials, the principles of 360-degree feedback are highly relevant in the European Union, where public accountability and perception are critical. The European Commission and other E.U. bodies use various public feedback mechanisms. Internally, 360-degree feedback is utilized as a professional development tool for managers within E.U. institutions.",
        contextAL: "Relevance and Scope in the Albanian Context: The concept is gaining traction in Albania, driven by public administration reforms required for the E.U. integration process. The country's new civil service law emphasizes a merit-based, accountable public administration. Challenges remain in building the capacity for effective performance appraisal. However, leadership programs like LEAD Albania are fostering a new generation of leaders who are more likely to adopt such developmental tools.",
        sourcesTitle: "Sources"
    }
};

export const ParagonConceptMultiSourceFeedbackPage: React.FC<ParagonConceptMultiSourceFeedbackPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;
    const { language, toggleLanguage } = useLanguage();
    const content = translations[language];

    const keywords = ["Feedback 360-Gradë", "Vlerësimi i Performancës", "Zhvillimi i Lidershipit", "Dritarja Johari", "Vetëdija Profesionale", "EPSO", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "https://ec.europa.eu/info/law/better-regulation/have-your-say_en", text: "EU 'Have your say' portal", credibility_industry_rating_pct: 95 },
        { id: 2, url: "https://www.edps.europa.eu/data-protection/our-work/publications/guidelines/performance-appraisal_en", text: "European Data Protection Supervisor (EDPS) - Guidelines on Performance Appraisal", credibility_industry_rating_pct: 92 },
        { id: 3, url: "http://www.dap.gov.al/legjislacioni/25-ligje/16-ligji-nr-152-2013-per-nepunesin-civil", text: "Department of Public Administration (Albania) - Civil Service Law", credibility_industry_rating_pct: 90 },
        { id: 4, url: "https://leadalbania.org/", text: "LEAD Albania Program Official Website", credibility_industry_rating_pct: 88 },
        { id: 5, url: "https://www.selfawareness.org.uk/news/the-johari-window-model", text: "Luft, J., & Ingham, H. (1955). The Johari window, a graphic model of interpersonal awareness.", credibility_industry_rating_pct: 90 },
    ], []);

    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="">
                <p className="italic text-lg">{content.introText}</p>
            </ArticleSection>
            <ArticleSection id="360-feedback" title={content.feedbackTitle}>
                <p><strong>{content.feedbackFoundation.split(':')[0]}:</strong> {content.feedbackFoundation.split(':').slice(1).join(':')}<SourceLink s={[5]}/></p>
                <p><strong>{content.feedbackMethodology.split(':')[0]}:</strong> {content.feedbackMethodology.split(':').slice(1).join(':')}</p>
                <p><strong>{content.feedbackMeasures.split(':')[0]}:</strong> {content.feedbackMeasures.split(':').slice(1).join(':')}</p>
                <p><strong>{content.feedbackUsage.split(':')[0]}:</strong> {content.feedbackUsage.split(':').slice(1).join(':')}</p>
            </ArticleSection>

            <ArticleSection id="context" title={content.contextTitle}>
                <p><strong><a id="ref-1"></a>{content.contextEU.split(':')[0]}:<SourceLink s={[1, 2]}/></strong> {content.contextEU.split(':').slice(1).join(':')}</p>
                <p><strong><a id="ref-2"></a>{content.contextAL.split(':')[0]}:<SourceLink s={[3, 4]}/></strong> {content.contextAL.split(':').slice(1).join(':')}</p>
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
            { url: window.location.href, published_at: new Date().toISOString(), article_id: 'paragon-concept-feedback-01' },
            sourcesList,
            { researchHours: 140, focusKeyword: "360-Degree Feedback" }
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
                publicationInfo={{ publishedDate: "Publikuar: 28 Nëntor, 2025", location: "Shkodër, Shqipëri" }}
                tableOfContentsItems={[
                    { id: "hyrje", title: language === 'sq' ? 'Hyrje' : 'Introduction' },
                    { id: "360-feedback", title: content.feedbackTitle },
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
