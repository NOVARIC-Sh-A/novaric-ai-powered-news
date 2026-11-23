import { isMaragonNoticeLive, type MaragonReleaseInput } from '../data/maragon/maragonNoticeRelease';
import { OG_SITE, OgFields } from './ogDocument';
import { publicationTimeMs } from './newsListOrder';
import {
  MARAGON_NOTICE_DESCRIPTION,
  MARAGON_NOTICE_META,
  MARAGON_NOTICE_PATH,
  MARAGON_NOTICE_TITLE,
} from '../data/maragon/maragonNoticeContent';

export const HOME_TITLE = 'NOVARIC® Lajme me IA | Shqipëri';
export const HOME_DESCRIPTION = 'Lajme me inteligjencë artificiale për Shqipërinë. Verifikim faktesh, analizë dhe publikime nga NOVARIC®.';
export const NEWS_LIST_TITLE = 'Arkiva e Lajmeve';
export const NEWS_LIST_DESCRIPTION = 'Lajmet e fundit dhe lajmet e shënuara si të ndërprera, të renditura sipas kohës së publikimit. NOVARIC® Lajme me IA.';
export const FORECAST_TITLE = 'NOVARIC® Forecast 2027';
export const FORECAST_DESCRIPTION = 'Botimi i parë i NOVARIC® Forecast 2027, 18 nëntor 2026, i nënshkruar nga Dr Alban Gj. THIKA. Nuk është këshillë investimi.';
export const MARAGON_AM10_PATH = '/maragon-am10';
export const MARAGON_AM10_PAGE = 'maragonAm10';
export const MARAGON_AM10_TITLE = 'MARAGON® AM-10 — brezat referues / reference bands';
export const MARAGON_AM10_DESCRIPTION = 'Ky është teksti publik i amendamentit AM-10 të metodologjisë MARAGON® v1.0. Tregon vetëm emrat e brezave.';
export const DEFAULT_OG_IMAGE = 'https://novaric.co/wp-content/uploads/2025/07/NOVARIC-Logos_Master-WB-R_12062025_500x500.webp';

export const METHODOLOGY_PATH = '/metodologjia';
export const METHODOLOGY_TITLE = 'Metodologjia NOVARIC®: Balancimi i IA-së me Integritetin Gazetarskor';
export const METHODOLOGY_DOCUMENT_TITLE = `${METHODOLOGY_TITLE} | NOVARIC® Lajme me IA`;
/** Page subtitle, extended only with the article's own subject so the description is useful in search. */
export const METHODOLOGY_DESCRIPTION = 'Një qasje transparente ndaj të vërtetës, teknologjisë dhe mirëbesimit publik. Metodologjia e NOVARIC® balancon shkallën e IA-së me integritetin gazetarskor.';
export const METHODOLOGY_HEADLINE = 'Metodologjia e NOVARIC® dhe Korniza e Përgjegjësisë: Balancimi i Shkallës së IA-së me Integritetin Gazetarskor';
export const METHODOLOGY_AUTHOR = 'Dr. Alban Gj. THIKA';

export function newsMediaOrganization() {
  return {
    '@type': 'NewsMediaOrganization',
    '@id': `${OG_SITE}/#organization`,
    name: 'NOVARIC®',
    legalName: 'NOVARIC® Sh.A.',
    url: `${OG_SITE}/`,
    logo: {
      '@type': 'ImageObject',
      url: DEFAULT_OG_IMAGE,
    },
    publishingPrinciples: `${OG_SITE}/?page=novaricCodeOfStandards`,
  };
}

function graph(nodes: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [newsMediaOrganization(), ...nodes],
  };
}

export function homeSeo(): OgFields {
  return {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: `${OG_SITE}/`,
    image: DEFAULT_OG_IMAGE,
    imageAlt: HOME_TITLE,
    type: 'website',
    jsonLd: graph([{
      '@type': 'WebSite',
      '@id': `${OG_SITE}/#website`,
      url: `${OG_SITE}/`,
      name: HOME_TITLE,
      inLanguage: 'sq',
      publisher: { '@id': `${OG_SITE}/#organization` },
    }]),
  };
}

export function newsListSeo(): OgFields {
  const url = `${OG_SITE}/?page=newsList`;
  return {
    title: NEWS_LIST_TITLE,
    description: NEWS_LIST_DESCRIPTION,
    url,
    image: DEFAULT_OG_IMAGE,
    imageAlt: NEWS_LIST_TITLE,
    type: 'website',
    jsonLd: graph([{
      '@type': 'CollectionPage',
      '@id': `${url}#webpage`,
      url,
      name: NEWS_LIST_TITLE,
      description: NEWS_LIST_DESCRIPTION,
      inLanguage: 'sq',
      isPartOf: { '@id': `${OG_SITE}/#website` },
      publisher: { '@id': `${OG_SITE}/#organization` },
    }]),
  };
}

export function maragonMockupSeo(): OgFields {
  const url = `${OG_SITE}/?page=maragonCardMockup`;
  return {
    title: 'Karta MARAGON® (shembull)',
    description: 'Specifikim shembull i kartës MARAGON®. Nuk është një vlerësim i publikuar.',
    url,
    image: DEFAULT_OG_IMAGE,
    imageAlt: 'Karta MARAGON® (shembull)',
    type: 'website',
    robots: 'noindex, nofollow',
    jsonLd: graph([{
      '@type': 'WebPage',
      url,
      name: 'Karta MARAGON® (shembull)',
      description: 'Specifikim shembull. Nuk është një vlerësim i publikuar.',
      inLanguage: 'sq',
      isAccessibleForFree: true,
    }]),
  };
}

export function methodologySeo(): OgFields {
  const url = `${OG_SITE}${METHODOLOGY_PATH}`;
  return {
    title: METHODOLOGY_TITLE,
    description: METHODOLOGY_DESCRIPTION,
    url,
    image: DEFAULT_OG_IMAGE,
    imageAlt: 'NOVARIC® Lajme me IA',
    type: 'article',
    author: METHODOLOGY_AUTHOR,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: METHODOLOGY_HEADLINE,
      description: METHODOLOGY_DESCRIPTION,
      inLanguage: 'sq',
      url,
      author: { '@type': 'Person', name: METHODOLOGY_AUTHOR },
      publisher: { '@type': 'Organization', name: 'NOVARIC®' },
    },
  };
}

/**
 * /njoftim-maragon. While the notice is a draft for legal and editorial review it is
 * noindex/nofollow and stays out of the sitemap. Dates come only from recorded approval.
 */
export function maragonNoticeSeo(
  meta: typeof MARAGON_NOTICE_META = MARAGON_NOTICE_META,
  release: Omit<MaragonReleaseInput, 'meta'> = {},
): OgFields {
  const url = `${OG_SITE}${MARAGON_NOTICE_PATH}`;
  const approved = isMaragonNoticeLive({ ...release, meta });
  const page: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: MARAGON_NOTICE_TITLE.sq,
    description: MARAGON_NOTICE_DESCRIPTION.sq,
    inLanguage: ['sq', 'en'],
    version: meta.version,
    isPartOf: { '@id': `${OG_SITE}/#website` },
    publisher: { '@id': `${OG_SITE}/#organization` },
  };
  if (approved && meta.publishedOn) page.datePublished = meta.publishedOn;
  if (approved && meta.approval) page.dateModified = meta.approval.approvedOn;
  return {
    title: MARAGON_NOTICE_TITLE.sq,
    description: MARAGON_NOTICE_DESCRIPTION.sq,
    url,
    image: DEFAULT_OG_IMAGE,
    imageAlt: MARAGON_NOTICE_TITLE.sq,
    type: 'website',
    ...(approved ? {} : { robots: 'noindex, nofollow' }),
    jsonLd: graph([page]),
  };
}

export function maragonAm10Seo(): OgFields {
  const url = `${OG_SITE}${MARAGON_AM10_PATH}`;
  return {
    title: MARAGON_AM10_TITLE,
    description: MARAGON_AM10_DESCRIPTION,
    url,
    image: DEFAULT_OG_IMAGE,
    imageAlt: MARAGON_AM10_TITLE,
    type: 'article',
    author: 'Dr Alban Gj. THIKA',
    jsonLd: graph([{
      '@type': 'Article',
      '@id': `${url}#article`,
      url,
      headline: MARAGON_AM10_TITLE,
      description: MARAGON_AM10_DESCRIPTION,
      inLanguage: ['sq', 'en'],
      datePublished: '2026-11-23',
      author: { '@type': 'Person', name: 'Dr Alban Gj. THIKA' },
      publisher: { '@id': `${OG_SITE}/#organization` },
    }]),
  };
}

export function forecastSeo(): OgFields {
  const url = `${OG_SITE}/forecast-2027`;
  return {
    title: FORECAST_TITLE,
    description: FORECAST_DESCRIPTION,
    url,
    image: DEFAULT_OG_IMAGE,
    imageAlt: FORECAST_TITLE,
    type: 'article',
    jsonLd: graph([{
      '@type': 'Report',
      '@id': `${url}#report`,
      url,
      headline: FORECAST_TITLE,
      description: FORECAST_DESCRIPTION,
      inLanguage: ['sq', 'en'],
      datePublished: '2026-11-18',
      dateModified: '2026-11-18',
      author: { '@type': 'Person', name: 'Dr Alban Gj. THIKA' },
      publisher: { '@id': `${OG_SITE}/#organization` },
    }]),
  };
}

export interface NewsSeoInput {
  id: string;
  title?: string;
  title_sq?: string;
  content?: string;
  content_sq?: string;
  publishedAt?: string;
  imageUrl?: string;
  image?: string | null;
  sourceName?: string;
}

function plain(value: string | undefined, max: number): string {
  const text = (value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

export function newsArticleSeo(item: NewsSeoInput): OgFields | null {
  const id = (item.id || '').trim();
  if (!id || id.includes('/') || id.includes('..')) return null;
  const title = plain(item.title_sq || item.title, 110) || 'Lajm';
  const description = plain(item.content_sq || item.content, 160) || NEWS_LIST_DESCRIPTION;
  const url = `${OG_SITE}/?page=newsArticle&id=${encodeURIComponent(id)}`;
  const image = (item.imageUrl || item.image || DEFAULT_OG_IMAGE).trim() || DEFAULT_OG_IMAGE;
  const publishedMs = publicationTimeMs(item.publishedAt);
  const article: Record<string, unknown> = {
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    url,
    headline: title,
    description,
    inLanguage: 'sq',
    image,
    publisher: { '@id': `${OG_SITE}/#organization` },
    mainEntityOfPage: url,
  };
  if (publishedMs != null) {
    article.datePublished = new Date(publishedMs).toISOString();
  }
  if (item.sourceName) {
    article.author = { '@type': 'Organization', name: item.sourceName };
  }
  return {
    title,
    description,
    url,
    image,
    imageAlt: title,
    type: 'article',
    jsonLd: graph([article]),
  };
}

export function newsArticleShellName(id: string): string {
  return id.replace(/[^a-zA-Z0-9._-]/g, '_');
}
