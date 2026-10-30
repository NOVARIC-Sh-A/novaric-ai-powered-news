import React, { useMemo } from 'react';
import { JsonLd } from '../JsonLd';
import { useSeo } from '../../hooks/useSeo';
import { BookOpenIcon, ClockIcon, DocumentTextIcon, AcademicCapIcon, ScaleIcon, CheckCircleIcon, CpuChipIcon, LightBulbIcon } from '../icons';
import { ArticleMetrics, ArticleIntegrityProfileData, ArticleEvaluationData } from '../../types';
import { AdvancedArticleMetrics } from '../AdvancedArticleMetrics';
import { ContentQualityAssurance } from '../ContentQualityAssurance';
import { evaluateArticleMetrics } from '../../utils/articleMetricsCalculator';
import { formatVipName } from '../../utils/paragonProfileUtils';
import { ConceptTooltip } from '../analytics/ConceptTooltip';
import { findConceptByTerm } from '../../data/conceptRegistry';

interface Author {
    name: string;
    profileId?: string | number;
    imageUrl: string;
    isAi?: boolean;
}

interface Editor {
    name: string;
    profileId?: string | number;
}

interface TableOfContentsItem {
    id: string;
    title: string;
}

interface ArticleTemplate1Props {
    pageTitle: string;
    pageDescription: string;
    pageKeywords: string;
    headerTitle: React.ReactNode;
    headerSubtitle?: React.ReactNode;
    authors: Author[];
    editor?: Editor;
    onNavigateToEditor?: () => void;
    publicationInfo: {
        publishedDate: string;
        lastUpdated?: string;
        location?: string;
    };
    tableOfContentsItems?: TableOfContentsItem[];
    articleMetrics: ArticleMetrics;
    articleIntegrityProfile?: ArticleIntegrityProfileData;
    keywords: string[];
    children: React.ReactNode;
    onBack: () => void;
    onNavigateToVipProfile: (id: string | number) => void;
    onNavigateToArticleMetricsExplained: () => void;
}

export const KeyConcept: React.FC<{ term: string; definition?: string; conceptId?: string; children?: React.ReactNode }> = ({ term, definition, conceptId, children }) => {
    const matchedConcept = conceptId ? null : findConceptByTerm(term);
    const effectiveConceptId = conceptId || (matchedConcept ? matchedConcept.id : undefined);

    if (effectiveConceptId) {
        return (
            <ConceptTooltip conceptId={effectiveConceptId}>
                {children || term}
            </ConceptTooltip>
        );
    }

    return (
        <span className="relative group cursor-help inline-block">
          <span className="font-semibold text-primary-600 dark:text-primary-400 border-b-2 border-dotted border-primary-500/50">{children || term}</span>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 w-72 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 pointer-events-none z-10 mb-2">
            {definition || ''}
            <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
          </span>
        </span>
    );
};

export const PullQuote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <blockquote className="my-8 p-4 border-l-4 border-primary-500 bg-slate-50 dark:bg-slate-900/50 italic text-xl text-center text-slate-700 dark:text-slate-300 font-serif">
        "{children}"
    </blockquote>
);

export const ArticleSection: React.FC<{ title: string; children: React.ReactNode; id: string }> = ({ title, id, children }) => (
    <section id={id} className="mb-8 scroll-mt-24">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-primary-500/30">{title}</h2>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-justify space-y-3">
            {children}
        </div>
    </section>
);


export const ArticleTemplate1: React.FC<ArticleTemplate1Props> = ({
    pageTitle,
    pageDescription,
    pageKeywords,
    headerTitle,
    headerSubtitle,
    authors,
    editor,
    onNavigateToEditor,
    publicationInfo,
    tableOfContentsItems,
    articleMetrics,
    articleIntegrityProfile,
    keywords,
    children,
    onBack,
    onNavigateToVipProfile,
    onNavigateToArticleMetricsExplained,
}) => {
    
    useSeo(pageTitle, pageDescription, undefined, window.location.href);

    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": pageTitle,
      "author": authors.map(author => ({ "@type": "Person", "name": author.name })),
      "publisher": { "@type": "Organization", "name": "NOVARIC®" },
      "description": pageDescription,
      "mainEntityOfPage": { "@type": "WebPage", "@id": window.location.href },
      "keywords": pageKeywords,
      "datePublished": "2025-01-01T00:00:00Z", 
      ...(articleMetrics?.lifecycleAndCompliance?.lastUpdated && { "dateModified": articleMetrics.lifecycleAndCompliance.lastUpdated }),
    };

    const articleEvaluation = useMemo((): ArticleEvaluationData | null => {
        if (!articleMetrics) return null;
        return evaluateArticleMetrics(articleMetrics);
    }, [articleMetrics]);

    const handleNavigateToExplanationWithSection = (sectionId: string) => {
        onNavigateToArticleMetricsExplained();
        if (sectionId) {
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        }
    };

    return (
        <main className="flex-grow container mx-auto px-4 py-8 font-sans">
            <JsonLd data={jsonLdData} />
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl">
                <div className="mb-6">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition"
                    >
                        &larr; <span className="ml-2">Kthehu Pas</span>
                    </button>
                </div>
                
                <header className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                       {headerTitle}
                    </h1>
                    {headerSubtitle && (
                        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                            {headerSubtitle}
                        </p>
                    )}
                    <div className="mt-8">
                        <div className="flex justify-center items-center mb-2">
                            <div className="relative flex items-center">
                                {authors.map((author, index) => (
                                    <button 
                                        key={author.name}
                                        onClick={() => author.profileId && onNavigateToVipProfile(author.profileId)} 
                                        className={`focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full transition-transform hover:scale-105 ${index > 0 ? '-ml-5' : ''} ${author.isAi ? '' : 'z-10'}`}
                                        title={author.name}
                                    >
                                        <img 
                                            src={author.imageUrl} 
                                            alt={`Portreti i ${author.name}`}
                                            className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                         <p className="text-sm text-slate-600 dark:text-slate-300 font-sans">
                            Një punë hibride nga {authors.map((author, index) => (
                                <React.Fragment key={author.name}>
                                    <button 
                                        onClick={() => author.profileId && onNavigateToVipProfile(author.profileId)} 
                                        className="font-bold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none"
                                    >
                                        {formatVipName(author.name)}
                                    </button>
                                    {index < authors.length - 1 && ' & '}
                                </React.Fragment>
                            ))}
                        </p>
                        {editor && onNavigateToEditor && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-sans">
                                Redaktuar nga: {' '}
                                <button
                                    onClick={onNavigateToEditor}
                                    className="font-bold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none"
                                >
                                    {formatVipName(editor.name)}
                                </button>
                            </p>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {publicationInfo.publishedDate}
                            {publicationInfo.lastUpdated && ` | Përditësuar: ${publicationInfo.lastUpdated}`}
                            {publicationInfo.location && ` | ${publicationInfo.location}`}
                        </p>
                    </div>
                </header>

                {tableOfContentsItems && tableOfContentsItems.length > 0 && (
                    <nav className="mb-12 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-3 text-center">Përmbajtja</h3>
                        <ul className="space-y-2 text-center text-primary-600 dark:text-primary-400">
                            {tableOfContentsItems.map(item => (
                                <li key={item.id}><a href={`#${item.id}`} className="hover:underline font-medium">{item.title}</a></li>
                            ))}
                        </ul>
                    </nav>
                )}

                {children}
                
                <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100 flex items-center">
                            <LightBulbIcon className="w-5 h-5 mr-2 text-primary-500" /> Fjalët Kyçe
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {keywords.map(keyword => (
                                <span key={keyword} className="bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300">{keyword}</span>
                            ))}
                        </div>
                    </div>
                    {articleIntegrityProfile && (
                        <ContentQualityAssurance cqaData={articleIntegrityProfile} metrics={articleMetrics} />
                    )}
                    {articleEvaluation && (
                        <AdvancedArticleMetrics 
                            evaluation={articleEvaluation} 
                            onNavigateToExplanation={handleNavigateToExplanationWithSection} 
                        />
                    )}
                </footer>
            </div>
        </main>
    );
};