import {
  MARAGON_NOTICE_PATH,
  MARAGON_NOTICE_QUERY_PAGE,
} from '../data/maragon/maragonNoticeContent';
import { isMaragonNoticeLive } from '../data/maragon/maragonNoticeRelease';
import { maragonInternalPreview } from './maragonPublication';

export { MARAGON_NOTICE_PATH, MARAGON_NOTICE_QUERY_PAGE };

export interface MaragonNoticeRoute {
  page: 'maragonNotice';
}

/** `/njoftim-maragon` and `?page=maragonNotice` open the same page (same pattern as /metodologjia). */
export function routeMaragonNoticeFromLocation(pathname: string, search = ''): MaragonNoticeRoute | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (path === MARAGON_NOTICE_PATH) return { page: 'maragonNotice' };
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  if ((path === '/' || path === '') && params.get('page') === MARAGON_NOTICE_QUERY_PAGE) {
    return { page: 'maragonNotice' };
  }
  return null;
}

/**
 * Links to the notice and the contextual notices appear only when the coordinated release gate
 * (maragonNoticeRelease.ts) is open, or in the dev-only internal preview (?maragonPreview=1 on a dev server).
 * Fail-closed: production shows nothing new until the approval is recorded.
 */
export function maragonNoticeVisible(search?: string, live: boolean = isMaragonNoticeLive()): boolean {
  return live || maragonInternalPreview(search);
}
