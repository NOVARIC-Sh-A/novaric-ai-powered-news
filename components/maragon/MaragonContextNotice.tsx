import React from 'react';
import {
  contextNotice,
  displayStateProblems,
  noticesForDisplay,
  type MaragonDisplayState,
} from '../../data/maragon/maragonContextNotices';
import { MARAGON_NOTICE_LINK_LABELS, MARAGON_NOTICE_PATH, type NoticeLang } from '../../data/maragon/maragonNoticeContent';
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

/**
 * "Mbi vlerësimin dhe të drejtat tuaja" on each profile (owner decision t330u).
 * Renders only when `visible` is true, i.e. the coordinated release gate is open (or dev preview).
 */
export const MaragonNoticeProfileLink: React.FC<{ lang: NoticeLang; visible: boolean }> = ({ lang, visible }) => {
  if (!visible) return null;
  return (
    <a href={MARAGON_NOTICE_PATH} className="font-bold underline decoration-2 underline-offset-2" style={{ color: NAVY }} data-profile-link="maragon-notice" lang={lang}>
      {MARAGON_NOTICE_LINK_LABELS.profile[lang]}
    </a>
  );
};
