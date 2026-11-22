import React from 'react';
import {
  contextNotice,
  displayStateProblems,
  noticesForDisplay,
  type MaragonDisplayState,
} from '../../data/maragon/maragonContextNotices';
import type { NoticeLang } from '../../data/maragon/maragonNoticeContent';
import { maragonNoticeVisible } from '../../utils/maragonNoticeNavigation';
import { Mark, NAVY } from './maragonPresenterUi';

/**
 * Contextual notices for the MARAGON® assessment area. Renders nothing until the notice page is
 * approved (or in the dev-only internal preview). It never changes what is displayed.
 */
export const MaragonContextNotices: React.FC<{
  state: MaragonDisplayState;
  lang: NoticeLang;
  onOpenNotice?: () => void;
  forceVisible?: boolean;
}> = ({ state, lang, onOpenNotice, forceVisible }) => {
  if (!forceVisible && !maragonNoticeVisible()) return null;
  const ids = noticesForDisplay(state);
  const problems = state.mode === 'internal' ? displayStateProblems(state) : [];
  return (
    <aside
      className="flex flex-col gap-2 text-[13px] leading-snug"
      aria-label={lang === 'en' ? 'Notes on this display' : 'Shënime për këtë pamje'}
      data-maragon-notices={ids.join(' ')}
    >
      {problems.length > 0 && (
        <p role="alert" className="rounded border px-3 py-2 font-bold" style={{ borderColor: '#b91c1c', color: '#b91c1c' }}>
          {lang === 'en' ? 'Display problem: ' : 'Problem në shfaqje: '}{problems.join(', ')}
        </p>
      )}
      {ids.map((id) => {
        const notice = contextNotice(id);
        return (
          <p key={id} data-notice={id} className="rounded border-l-4 bg-slate-50 px-3 py-2" style={{ borderLeftColor: NAVY, color: NAVY }}>
            <Mark text={notice.text[lang]} />{' '}
            <a
              href={notice.href}
              onClick={(event) => {
                if (onOpenNotice) {
                  event.preventDefault();
                  onOpenNotice();
                }
              }}
              className="underline font-bold"
              style={{ color: NAVY }}
            >
              {notice.more[lang]}
            </a>
          </p>
        );
      })}
    </aside>
  );
};

export default MaragonContextNotices;
