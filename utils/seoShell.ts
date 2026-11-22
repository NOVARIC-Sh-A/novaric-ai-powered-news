import { newsArticleShellName } from './routeSeo';

/** Dist-relative HTML shell for a request, when one was written at build time. */
export function seoShellRelativePath(pathname: string, search = ''): string | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/forecast-2027') return 'forecast-2027/index.html';
  if (path === '/metodologjia') return 'metodologjia/index.html';
  if (path === '/personalitete-mediatike') return 'personalitete-mediatike/index.html';
  const mediaProfile = path.match(/^\/personalitete-mediatike\/([a-z0-9-]+)$/);
  if (mediaProfile) return `personalitete-mediatike/${mediaProfile[1]}/index.html`;
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const page = params.get('page');
  if (page === 'forecast2027') return 'forecast-2027/index.html';
  if (page === 'newsList') return 'seo/news-list.html';
  if (page === 'maragonCardMockup') return 'seo/maragon-card-mockup.html';
  if (page === 'tvPersonalitiesAnalysis') return 'seo/maragon-analysis.html';
  if (page === 'newsArticle') {
    const id = params.get('id') || '';
    if (!id || id.includes('/') || id.includes('..')) return null;
    return `seo/news/${newsArticleShellName(id)}.html`;
  }
  return null;
}
