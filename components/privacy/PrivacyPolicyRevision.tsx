/** Draft for legal and editorial review. Only the wrapper decides whether this revision is live. */
import React from 'react';
import { PRIVACY_ALLOWED_HREFS, PRIVACY_DRAFT_BANNER, PRIVACY_REVISION_META, PRIVACY_SECTIONS, PRIVACY_TITLE, isPrivacyRevisionLive, privacyRevisionOpenItems } from '../../data/privacy/privacyPolicyRevision';
import { parseNoticeInline } from '../../data/maragon/maragonNoticeContent';
import { Mark, NAVY } from '../maragon/maragonPresenterUi';

/** Legal and organisational links only. [[P-nn]] internal items are not links. */
const Text: React.FC<{ text: string }> = ({ text }) => (
  <>{parseNoticeInline(text).map((p, i) => p.kind === 'link' && (PRIVACY_ALLOWED_HREFS as readonly string[]).includes(p.href)
    ? <a key={i} href={p.href} className="underline" {...(p.href.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><Mark text={p.text} /></a>
    : <React.Fragment key={i}><Mark text={p.text} /></React.Fragment>)}</>
);

export const PrivacyPolicyRevision: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const live = isPrivacyRevisionLive();
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8" style={{ color: NAVY }}>
      <button type="button" onClick={onBack} className="mb-6 underline">Kthehu pas / Back</button>
      {!live && <aside role="status" data-privacy-draft="true" className="mb-6 border-2 p-4" style={{ borderColor: '#b91c1c' }}>
        <p lang="sq">{PRIVACY_DRAFT_BANNER.sq}</p><p lang="en">{PRIVACY_DRAFT_BANNER.en}</p>
        <p lang="en">Internal open items: {privacyRevisionOpenItems().join(', ')}. Any open item blocks publication.</p>
      </aside>}
      {(['sq', 'en'] as const).map((lang) => <article key={lang} lang={lang} className="mb-12">
        <h1 className="mb-3 text-3xl font-bold">{PRIVACY_TITLE[lang]}</h1>
        <p className="mb-6">{lang === 'sq' ? 'Versioni' : 'Version'} {PRIVACY_REVISION_META.version} · 23.11.2026 · {live ? PRIVACY_REVISION_META.publishedOn : (lang === 'sq' ? 'Nuk është publikuar' : 'Not published')}</p>
        <nav aria-label={lang === 'sq' ? 'Përmbajtja' : 'Contents'} className="mb-6"><ol className="list-decimal pl-6">{PRIVACY_SECTIONS.map((s) => <li key={s.id}><a className="underline" href={`#privacy-${lang}-${s.id}`}>{s.heading[lang]}</a></li>)}</ol></nav>
        {PRIVACY_SECTIONS.map((s) => <section id={`privacy-${lang}-${s.id}`} key={s.id} className="mb-6">
          <h2 className="mb-2 text-xl font-bold">{s.number}. {s.heading[lang]}</h2>
          {s.body[lang].map((p, i) => p.startsWith('- ')
            ? <ul key={i} className="list-disc pl-6"><li><Text text={p.slice(2)} /></li></ul>
            : <p key={i} className="mb-3"><Text text={p} /></p>)}
        </section>)}
      </article>)}
    </main>
  );
};
