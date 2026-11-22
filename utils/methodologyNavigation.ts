export const METHODOLOGY_PATH = '/metodologjia';
export const METHODOLOGY_QUERY_PAGE = 'analysisMethodology';

export interface MethodologyRoute {
  page: 'analysisMethodology';
}

/** `/metodologjia` and the old `?page=analysisMethodology` open the same page. */
export function routeMethodologyFromLocation(pathname: string, search = ''): MethodologyRoute | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (path === METHODOLOGY_PATH) return { page: 'analysisMethodology' };
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  if ((path === '/' || path === '') && params.get('page') === METHODOLOGY_QUERY_PAGE) {
    return { page: 'analysisMethodology' };
  }
  return null;
}
