import React from 'react';
import { BreakingNewsArticle } from '../types';
import { CalendarDaysIcon, ShieldCheckIcon, ExclamationTriangleIcon, XCircleIcon, CpuChipIcon, Activity } from './icons';
import { ExternalLink } from 'lucide-react';
import { AuthenticityBar } from './AuthenticityBar';
import { renderWithSuperscript } from '../utils/textUtils';
import { getArticleSourceUrl, getSourceLogo } from '../utils/newsSourceUtils';
import { sanitizeImageUrl } from '../utils/imageUtils';

interface NewsCardProps {
  item: BreakingNewsArticle;
  onNavigate: (item: BreakingNewsArticle) => void;
}

const getAuthenticityMetadata = (rating: string, score: number) => {
  if (score >= 85) return { label: 'VERIFIKUAR', color: 'bg-emerald-600', icon: <ShieldCheckIcon className="w-3 h-3" />, border: 'border-emerald-500/50', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' };
  if (score >= 70) return { label: 'I BESUESHËM', color: 'bg-sky-600', icon: <ShieldCheckIcon className="w-3 h-3" />, border: 'border-sky-500/50', glow: '' };
  if (score >= 50) return { label: 'KUJDES', color: 'bg-amber-500', icon: <ExclamationTriangleIcon className="w-3 h-3" />, border: 'border-amber-500/50', glow: '' };
  return { label: 'I PABAZUAR', color: 'bg-rose-600', icon: <XCircleIcon className="w-3 h-3" />, border: 'border-rose-500/50', glow: 'shadow-[0_0_15px_rgba(225,29,72,0.2)]' };
};

const getFallbackScore = (rating: string): number => {
  switch (rating) {
    case 'VERIFIED_ACCURATE': return 98;
    case 'MOSTLY_ACCURATE': return 82;
    case 'PARTIALLY_ACCURATE': return 62;
    case 'ACCURACY_UNCLEAR': return 48;
    case 'POTENTIAL_MISINFORMATION': return 24;
    default: return 50;
  }
};

export const NewsCard: React.FC<NewsCardProps> = ({ item, onNavigate }) => {
  if (!item) return null;
  const { title = '', sourceName = 'Burim i panjohur', publishedDate, imageUrl, newsAuthenticity = 'ACCURACY_UNCLEAR', ecosystemRating } = item;
  
  const rawImage = item.imageThumb ?? item.image ?? imageUrl;
  const articleImage = rawImage ? sanitizeImageUrl(rawImage) : null;
  const provenance = item.imageProvenance;

  const isLive = ecosystemRating !== undefined && ecosystemRating !== null;
  const score = isLive ? ecosystemRating! : getFallbackScore(newsAuthenticity);
  const meta = getAuthenticityMetadata(newsAuthenticity, score);
  const sourceUrl = getArticleSourceUrl(item);

  return (
    <article
      onClick={() => onNavigate(item)}
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-full group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 ${meta.border} ${meta.glow} cursor-pointer relative`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigate(item);
        }
      }}
      aria-label={`Lexo lajmin: ${title}. Vlerësimi i integritetit: ${score} përqind.`}
    >
      <div className="w-full text-left flex flex-col h-full relative">
        {/* --- AUDIT STAMP --- */}
        <div className="absolute top-3 right-3 z-30 flex flex-col items-end gap-1 pointer-events-none">
            <div className={`${meta.color} text-white flex items-center gap-1.5 px-2.5 py-1 rounded-md shadow-lg border border-white/20 backdrop-blur-sm transition-transform group-hover:scale-105`}>
                {meta.icon}
                <span className="font-black text-[10px] tracking-widest uppercase">{meta.label}</span>
            </div>
            <div className="bg-slate-900/90 text-white px-2 py-0.5 rounded border border-white/10 flex items-center gap-1.5">
                {isLive && <Activity className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />}
                <span className="text-[11px] font-mono font-bold">{score}%</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">NER</span>
            </div>
        </div>

        {/* --- TOP LEFT METHODOLOGY BADGE --- */}
        <div className="absolute top-3 left-3 z-30 pointer-events-none">
            <div className="bg-slate-900/40 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-md">
                <CpuChipIcon className="w-4 h-4 text-white/80" />
            </div>
        </div>

        {/* --- PROVENANCE BADGE (rssFeed vs articleOpenGraph) --- */}
        {provenance && provenance !== 'none' && (
          <div className="absolute top-3 left-12 z-30 pointer-events-none">
            <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md shadow-sm flex items-center gap-1.5 ${
              provenance === 'rssFeed'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${provenance === 'rssFeed' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {provenance === 'rssFeed' ? 'RSS Media' : 'Article OG'}
            </span>
          </div>
        )}

        <div className="overflow-hidden relative h-48 bg-slate-900/60">
          {articleImage ? (
            <img
              src={articleImage}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Hide broken or blocked image hotlinks cleanly
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900/80 text-slate-500 text-xs font-mono">
              <span>NOVARIC® Feed</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          {/* SOURCE LOGO OVERLAY - CLICKABLE LINK TO SOURCE */}
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-3 z-20 bg-white/95 dark:bg-slate-900/95 hover:bg-white dark:hover:bg-slate-800 px-2 py-1 rounded shadow-md border border-white/20 flex items-center gap-2 group/src transition-all hover:scale-105"
              title={`Hap burimin origjinal: ${sourceName}`}
            >
              <img 
                src={getSourceLogo(sourceName)} 
                alt={sourceName} 
                className="h-3.5 w-auto object-contain filter grayscale group-hover/src:grayscale-0 transition-all"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="text-[9px] font-black text-slate-600 dark:text-slate-300 group-hover/src:text-primary-600 dark:group-hover/src:text-primary-400 uppercase tracking-tighter border-l border-slate-200 dark:border-slate-700 pl-2 flex items-center gap-1">
                  {sourceName}
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400 group-hover/src:text-primary-500" />
              </span>
            </a>
          ) : (
            <div className="absolute bottom-3 left-3 z-10 bg-white/95 dark:bg-slate-900/95 px-2 py-1 rounded shadow-md border border-white/20 flex items-center gap-2">
              <img 
                src={getSourceLogo(sourceName)} 
                alt={sourceName} 
                className="h-3.5 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter border-l border-slate-200 dark:border-slate-700 pl-2">
                  {sourceName}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-3">
            {renderWithSuperscript(title)}
          </h3>
          
          <div className="flex-grow" />
          
          <div className="space-y-3 mb-4 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                <span>Integriteti i Lajmit</span>
                <span className={score >= 70 ? 'text-emerald-500' : 'text-rose-500'}>Metoda NER_V1.2</span>
             </div>
             <AuthenticityBar rating={newsAuthenticity} />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
                <CalendarDaysIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{publishedDate}</span>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
                {sourceUrl && (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                    title={`Hap artikullin tek ${sourceName}`}
                  >
                    <span>Burimi</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                    <span>{isLive ? 'LIVE RATING' : 'Audit Trail'}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};