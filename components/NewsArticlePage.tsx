import React, { useMemo } from 'react';
import { BreakingNewsArticle, NewsAuthenticityRating, SourceReliabilityRating } from '../types';
import {
  CalendarDaysIcon, GlobeAltIcon, ExclamationTriangleIcon,
  XCircleIcon, InformationCircleIcon, ShareIcon, Activity, CpuChipIcon
} from './icons';
import { ExternalLink } from 'lucide-react';
import { CredibilitySignal } from './CredibilitySignal';
import { NerBreakdownPanel } from './NerBreakdownPanel';
import { renderWithSuperscript, parseAlbanianDateForISO } from '../utils/textUtils';
import { getArticleSourceUrl } from '../utils/newsSourceUtils';
import { DEFAULT_SEO_IMAGE_URL } from '../config/constants';

interface NewsArticlePageProps {
  newsItem: BreakingNewsArticle;
  onBack: () => void;
}

type AlertType = 'error' | 'warning' | 'info';

interface ParsedSegment {
  text: string;
  isHighlight: boolean;
  alertMessage?: string;
  alertType?: AlertType;
}

const HIGHLIGHT_RE = /\[\[([\s\S]*?)\|([\s\S]*?)\|(error|warning|info)\]\]/g;

function parseContentWithHighlights(content: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  if (!content) return segments;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = HIGHLIGHT_RE.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: content.slice(lastIndex, match.index), isHighlight: false });
    }
    segments.push({
      text: match[1],
      isHighlight: true,
      alertMessage: match[2],
      alertType: match[3] as AlertType,
    });
    lastIndex = HIGHLIGHT_RE.lastIndex;
  }
  if (lastIndex < content.length) {
    segments.push({ text: content.slice(lastIndex), isHighlight: false });
  }
  if (segments.length === 0 && content.length > 0) {
    segments.push({ text: content, isHighlight: false });
  }
  return segments;
}

const getHighlightStylesAndIcon = (type?: AlertType): { className: string; icon: React.ReactNode } => {
  const iconClass = "w-4 h-4 inline-block mr-1 flex-shrink-0";
  switch (type) {
    case 'error':
      return {
        className: 'bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-300 px-1 py-0.5 rounded-sm border-b-2 border-red-400 dark:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/60',
        icon: <XCircleIcon className={`${iconClass} text-red-500 dark:text-red-400`} />
      };
    case 'warning':
      return {
        className: 'bg-yellow-100 dark:bg-yellow-700/50 text-yellow-800 dark:text-yellow-300 px-1 py-0.5 rounded-sm border-b-2 border-yellow-400 dark:border-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/60',
        icon: <ExclamationTriangleIcon className={`${iconClass} text-yellow-600 dark:text-yellow-400`} />
      };
    case 'info':
      return {
        className: 'bg-blue-100 dark:bg-blue-700/50 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded-sm border-b-2 border-blue-400 dark:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400/60',
        icon: <InformationCircleIcon className={`${iconClass} text-blue-500 dark:text-blue-400`} />
      };
    default:
      return { className: '', icon: null };
  }
};

const formatDateSq = (isoOrText?: string) => {
  if (!isoOrText) return '';
  const d = new Date(isoOrText);
  if (isNaN(d.getTime())) return isoOrText;
  return d.toLocaleDateString('sq-AL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const mapAuthenticityToScore = (rating: NewsAuthenticityRating): number | undefined => {
    switch(rating) {
        case 'VERIFIED_ACCURATE': return 98;
        case 'MOSTLY_ACCURATE': return 82;
        case 'PARTIALLY_ACCURATE': return 62;
        case 'ACCURACY_UNCLEAR': return 48;
        case 'POTENTIAL_MISINFORMATION': return 24;
        default: return undefined;
    }
};

const mapReliabilityToScore = (rating: SourceReliabilityRating): number | undefined => {
    switch(rating) {
        case 'VERY_HIGH_REPUTATION': return 95;
        case 'HIGH_REPUTATION': return 80;
        case 'MEDIUM_REPUTATION': return 65;
        case 'LOW_REPUTATION_MIXED': return 40;
        case 'UNRELIABLE_UNKNOWN': return 20;
        default: return undefined;
    }
};

export const NewsArticlePage: React.FC<NewsArticlePageProps> = ({ newsItem, onBack }) => {
  if (!newsItem) return null;

  const {
    title, sourceName, publishedDate, imageUrl, content,
    sourceType, newsAuthenticity, sourceReliability, originalArticleUrl,
    ecosystemRating, nerBreakdown, nerVersion
  } = newsItem;

  const parsedContent = useMemo(() => parseContentWithHighlights(content), [content]);

  const effectiveScore = useMemo(() => {
      if (ecosystemRating !== undefined && ecosystemRating !== null) return ecosystemRating;
      return mapAuthenticityToScore(newsAuthenticity);
  }, [ecosystemRating, newsAuthenticity]);

  const sourceScore = useMemo(() => {
      if (nerBreakdown?.SRS !== undefined) return nerBreakdown.SRS;
      return mapReliabilityToScore(sourceReliability);
  }, [nerBreakdown, sourceReliability]);

  const effectiveBreakdown = useMemo(() => {
      if (nerBreakdown) return nerBreakdown;
      return {
          SRS: sourceScore ?? 0,
          CIS: effectiveScore ?? 0,
          CSC: 70,
          TRF: 85,
          ECM: 60
      };
  }, [nerBreakdown, sourceScore, effectiveScore]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': title,
    'datePublished': parseAlbanianDateForISO(publishedDate),
    'image': imageUrl ? [imageUrl] : [DEFAULT_SEO_IMAGE_URL],
    'publisher': {
      '@type': 'Organization',
      'name': sourceName,
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN */}
        <article className="lg:col-span-8 bg-white dark:bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl">
          <header className="mb-6">
            <div className="flex items-center gap-2 mb-4 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-primary-500/20 w-fit">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Audit Ledger Active</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
              {renderWithSuperscript(title)}
            </h1>

            <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1 mb-6">
              <div className="flex items-center">
                <GlobeAltIcon className="w-4 h-4 mr-1.5 text-slate-400 dark:text-slate-500" />
                {getArticleSourceUrl(newsItem) ? (
                  <a
                    href={getArticleSourceUrl(newsItem)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-primary-600 dark:text-primary-400 font-medium inline-flex items-center gap-1"
                    title={`Hap faqen e burimit: ${sourceName}`}
                  >
                    <span>{renderWithSuperscript(sourceName)}</span>
                    <ExternalLink className="w-3 h-3" />
                    <span className="text-slate-400 font-normal">({sourceType === 'albanian' ? 'Lajm vendor' : 'Lajm ndërkombëtar'})</span>
                  </a>
                ) : (
                  <span>{renderWithSuperscript(sourceName)} ({sourceType === 'albanian' ? 'Lajm vendor' : 'Lajm ndërkombëtar'})</span>
                )}
              </div>
              <div className="flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-slate-400 dark:text-slate-500" />
                <time dateTime={jsonLd.datePublished}>Publikuar: {formatDateSq(publishedDate)}</time>
              </div>
              {getArticleSourceUrl(newsItem) && (
                <div className="flex items-center">
                  <ShareIcon className="w-4 h-4 mr-1.5 text-slate-400 dark:text-slate-500" />
                  <a
                    href={getArticleSourceUrl(newsItem)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-primary-600 dark:text-primary-400 inline-flex items-center gap-1 font-bold"
                  >
                    <span>Lexo artikullin origjinal tek {sourceName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* REFACTORED CREDIBILITY DASHBOARD */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner space-y-6">
                <CredibilitySignal 
                    label="Autenticiteti i Lajmit" 
                    subLabel="News Authenticity Signal (NER)"
                    score={effectiveScore}
                    status={effectiveScore === undefined ? 'unknown' : (effectiveScore >= 75 ? 'verified' : 'partial')}
                />
                <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                <CredibilitySignal 
                    label="Besueshmëria e Burimit" 
                    subLabel="Source Reliability Signal (NER)"
                    score={sourceScore}
                    status={sourceScore === undefined ? 'unknown' : (sourceScore >= 75 ? 'verified' : 'partial')}
                />
            </div>
          </header>

          {imageUrl && (
            <figure className="my-8">
              <img src={imageUrl} alt={title} className="w-full h-auto max-h-[400px] object-cover rounded-xl shadow-md" />
            </figure>
          )}

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 break-words leading-relaxed text-lg font-serif">
            {parsedContent.map((segment, index) => {
              const lines = segment.text.split('\n');
              if (segment.isHighlight && segment.alertMessage && segment.alertType) {
                const { className, icon } = getHighlightStylesAndIcon(segment.alertType);
                return (
                  <span key={index} className={`${className} cursor-help group relative`} title={segment.alertMessage}>
                    {icon}
                    {lines.map((line, li) => (<React.Fragment key={li}>{line}{li < lines.length - 1 && <br />}</React.Fragment>))}
                  </span>
                );
              }
              return lines.map((line, li) => (<React.Fragment key={`${index}-${li}`}>{line}{li < lines.length - 1 && <br />}</React.Fragment>));
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            <button onClick={onBack} className="px-8 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-black uppercase tracking-widest text-[10px] rounded-md shadow-sm transition-all">&larr; Kthehu Pas</button>
          </div>
        </article>

        {/* RIGHT COLUMN */}
        <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24">
                <div className="bg-primary-600 rounded-2xl p-6 text-white text-center shadow-xl mb-6 border-2 border-white/20">
                   <div className="flex items-center justify-center gap-2 mb-2">
                      <CpuChipIcon className="w-5 h-5 opacity-80" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Composite Trust Rating</span>
                   </div>
                   <div className="text-6xl font-black font-mono tracking-tighter drop-shadow-lg">
                      {effectiveScore ?? 0}%
                   </div>
                   <p className="text-xs mt-3 font-bold uppercase tracking-widest text-white/80">Audit Trail Immutable</p>
                </div>

                <NerBreakdownPanel 
                    ecosystemRating={effectiveScore ?? 0} 
                    nerVersion={nerVersion || 'NER_CORE_V1.2'} 
                    breakdown={effectiveBreakdown} 
                />

                <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                   <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2 uppercase text-xs tracking-widest flex items-center gap-2">
                     <InformationCircleIcon className="w-4 h-4 text-primary-500" /> Audit Trail Status
                   </h4>
                   <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> SECURE_DATA_FEED_ACTIVE
                   </div>
                   <p className="text-[10px] text-slate-400 mt-2 italic leading-relaxed">
                      Ky artikull i është nënshtruar auditimit automatik nga motori NER. Peshat e vlerësimit janë të fiksuara sipas protokollit NOVARIC®.
                   </p>
                </div>
            </div>
        </aside>
      </div>
    </main>
  );
};
