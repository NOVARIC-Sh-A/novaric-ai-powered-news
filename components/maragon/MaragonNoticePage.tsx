import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  MARAGON_NOTICE_ALLOWED_HREFS,
  MARAGON_REQUEST_CHANNEL,
  isRequestChannelConfirmed,
  MARAGON_NOTICE_DRAFT_BANNER,
  MARAGON_NOTICE_META,
  MARAGON_NOTICE_TITLE,
  MARAGON_NOTICE_UNAVAILABLE,
  allNoticeSections,
  parseNoticeInline,
  type NoticeLang,
} from '../../data/maragon/maragonNoticeContent';
import { maragonNoticeVisible } from '../../utils/maragonNoticeNavigation';
import { isMaragonNoticeLive } from '../../data/maragon/maragonNoticeRelease';
import { LINE, Mark, MUTED, NAVY } from './maragonPresenterUi';

function Inline({ text, onNavigate }: { text: string; onNavigate?: (href: string) => boolean }) {
  return (
    <>
      {parseNoticeInline(text).map((part, index) => {
        if (part.kind === 'text') return <Mark key={index} text={part.text} />;
        if (!(MARAGON_NOTICE_ALLOWED_HREFS as readonly string[]).includes(part.href)
          && !(isRequestChannelConfirmed(MARAGON_REQUEST_CHANNEL) && MARAGON_REQUEST_CHANNEL.href === part.href)) {
          return <Mark key={index} text={part.text} />;
        }
        const external = part.href.startsWith('http');
        return (
          <a
            key={index}
            href={part.href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            onClick={(event) => {
              if (!external && !part.href.startsWith('mailto:') && onNavigate && onNavigate(part.href)) event.preventDefault();
            }}
            className="underline decoration-2 underline-offset-2 font-semibold"
            style={{ color: NAVY }}
          >
            <Mark text={part.text} />
          </a>
        );
      })}
    </>
  );
}

function Paragraphs({ items, onNavigate }: { items: string[]; onNavigate?: (href: string) => boolean }) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (key: string) => {
    if (!list.length) return;
    out.push(
      <ul key={key} className="list-disc pl-6 space-y-1.5">
        {list.map((item, i) => <li key={i}><Inline text={item} onNavigate={onNavigate} /></li>)}
      </ul>,
    );
    list = [];
  };
  items.forEach((item, i) => {
    if (item.startsWith('- ')) {
      list.push(item.slice(2));
      return;
    }
    flush(`ul-${i}`);
    out.push(<p key={`p-${i}`}><Inline text={item} onNavigate={onNavigate} /></p>);
  });
  flush('ul-end');
  return <>{out}</>;
}

export const MaragonNoticePage: React.FC<{
  onBack: () => void;
  onNavigate?: (page: string) => void;
  forceVisible?: boolean;
}> = ({ onBack, onNavigate, forceVisible }) => {
  let ctxLang: NoticeLang = 'sq';
  try { ctxLang = useLanguage().language === 'en' ? 'en' : 'sq'; } catch { ctxLang = 'sq'; }
  const visible = forceVisible || maragonNoticeVisible();
  const approved = isMaragonNoticeLive();
  const handleNavigate = (href: string): boolean => {
    if (!onNavigate) return false;
    if (href === '/?page=privacy') { onNavigate('privacy'); return true; }
    if (href === '/personalitete-mediatike') { onNavigate('mediaPersonalitiesPage'); return true; }
    return false;
  };

  if (!visible) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10" style={{ color: NAVY }}>
        <button type="button" onClick={onBack} className="mb-6 text-[15px] font-bold underline">← {ctxLang === 'en' ? 'Back' : 'Kthehu'}</button>
        <h1 className="text-2xl font-bold">{ctxLang === 'en' ? 'MARAGON® notice' : 'Njoftimi MARAGON®'}</h1>
        <p className="mt-3 text-[16px]">{MARAGON_NOTICE_UNAVAILABLE[ctxLang]}</p>
      </main>
    );
  }

  const sections = allNoticeSections();
  const langs: NoticeLang[] = ctxLang === 'en' ? ['en', 'sq'] : ['sq', 'en'];
  return (
    <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 text-[16px] leading-relaxed" style={{ color: NAVY }}>
      <button type="button" onClick={onBack} className="mb-6 text-[15px] font-bold underline">← {ctxLang === 'en' ? 'Back' : 'Kthehu'}</button>
      {!approved && (
        <p role="status" className="mb-6 rounded border-2 px-4 py-3 font-bold" style={{ borderColor: '#b91c1c', color: '#b91c1c' }} data-notice-draft="true">
          {MARAGON_NOTICE_DRAFT_BANNER.sq} · {MARAGON_NOTICE_DRAFT_BANNER.en}
        </p>
      )}
      {langs.map((lang) => (
        <article key={lang} lang={lang} className="mb-12" aria-labelledby={`maragon-notice-title-${lang}`}>
          <header className="mb-6 border-b-2 pb-4" style={{ borderColor: LINE }}>
            <h1 id={`maragon-notice-title-${lang}`} className="text-[26px] md:text-[30px] font-bold leading-tight">
              <Mark text={MARAGON_NOTICE_TITLE[lang]} />
            </h1>
            <p className="mt-2 text-[14px]" style={{ color: MUTED }}>
              {lang === 'en' ? 'Version' : 'Versioni'} {MARAGON_NOTICE_META.version} · <Mark text="NOVARIC® Sh.A." />
            </p>
          </header>
          <nav aria-label={lang === 'en' ? 'Contents' : 'Përmbajtja'} className="mb-8">
            <ol className="list-decimal pl-6 text-[15px] space-y-0.5">
              {sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}-${lang}`} className="underline"><Mark text={s.heading[lang]} /></a></li>
              ))}
            </ol>
          </nav>
          {sections.map((s) => (
            <section key={s.id} id={`${s.id}-${lang}`} aria-labelledby={`${s.id}-${lang}-h`} className="mb-8 flex flex-col gap-3">
              <h2 id={`${s.id}-${lang}-h`} className="text-[20px] font-bold">{s.number}. <Mark text={s.heading[lang]} /></h2>
              <Paragraphs items={s.body[lang]} onNavigate={handleNavigate} />
            </section>
          ))}
        </article>
      ))}
    </main>
  );
};

export default MaragonNoticePage;
