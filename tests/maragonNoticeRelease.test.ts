import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  MARAGON_NOTICE_LINK_LABELS,
  MARAGON_NOTICE_META,
  MARAGON_REQUEST_CHANNEL,
  allNoticeSections,
  bandSentence,
  isRequestChannelConfirmed,
} from '../data/maragon/maragonNoticeContent';
import {
  SIGNED_V1_BANDS,
  appBandsMatchSignedV1,
  isMaragonNoticeLive,
  maragonNoticeReleaseBlockers,
} from '../data/maragon/maragonNoticeRelease';
import {
  PRIVACY_ALLOWED_HREFS,
  PRIVACY_REVISION_META,
  PRIVACY_SECTIONS,
  isPrivacyRevisionApproved,
  isPrivacyRevisionLive,
  privacyPreviewFromEnv,
  privacyRevisionOpenItems,
} from '../data/privacy/privacyPolicyRevision';
import { maragonNoticeVisible } from '../utils/maragonNoticeNavigation';
import { MaragonNoticeProfileLink } from '../components/maragon/MaragonContextNotice';
import { Footer } from '../components/Footer';
import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { PrivacyPolicyRevision } from '../components/privacy/PrivacyPolicyRevision';
import { MARAGON_BAND_KEYS, MARAGON_BAND_LABELS } from '../utils/maragonPublication';

const read = (p: string) => fs.readFileSync(p, 'utf8');
const TEST_CHANNEL = {
  href: 'mailto:test-only@example.invalid', label: 'test-only@example.invalid',
  mailboxAccessConfirmed: true, responsiblePersonConfirmed: true, backupConfirmed: true, requestLoggingConfirmed: true,
  confirmedOn: '2099-01-01', reference: 'TEST-ONLY',
};
const APPROVED = { ...MARAGON_NOTICE_META, status: 'approved_for_publication' as const, approval: { approvedBy: 'TEST ONLY', approvedOn: '2099-01-01', reference: 'TEST' }, publishedOn: '2099-01-02' };

describe('B-01 correction channel', () => {
  it('ships unconfirmed and is not described as contact@novaric.al', () => {
    assert.equal(MARAGON_REQUEST_CHANNEL, null);
    assert.equal(isRequestChannelConfirmed(), false);
    const s10 = allNoticeSections().find((s) => s.id === 'korrigjimet')!;
    assert.equal([...s10.body.sq, ...s10.body.en].some((p) => p.includes('contact@novaric.al')), false);
    assert.ok(s10.body.sq.some((p) => p.includes('[[B-01')));
    const s11 = allNoticeSections().find((s) => s.id === 'privatesia')!;
    assert.equal([...s11.body.sq, ...s11.body.en].some((p) => /contact@novaric\.al|na shkruani|write to us/.test(p)), false);
  });

  it('needs every operational confirmation before the channel counts', () => {
    assert.equal(isRequestChannelConfirmed(TEST_CHANNEL), true);
    for (const key of ['mailboxAccessConfirmed', 'responsiblePersonConfirmed', 'backupConfirmed', 'requestLoggingConfirmed'] as const) {
      assert.equal(isRequestChannelConfirmed({ ...TEST_CHANNEL, [key]: false }), false, key);
    }
    assert.equal(isRequestChannelConfirmed({ ...TEST_CHANNEL, reference: ' ' }), false);
    assert.equal(isRequestChannelConfirmed({ ...TEST_CHANNEL, href: 'contact@novaric.al' }), false);
    const s10 = allNoticeSections(MARAGON_NOTICE_META, TEST_CHANNEL).find((s) => s.id === 'korrigjimet')!;
    assert.ok(s10.body.en.some((p) => p.includes('[test-only@example.invalid](mailto:test-only@example.invalid)')));
  });

  it('keeps the notices free of any mailbox', () => {
    assert.equal(/@/.test(read('data/maragon/maragonContextNotices.ts')), false);
  });
});

describe('coordinated release gate', () => {
  it('is closed today and lists every reason', () => {
    assert.equal(isMaragonNoticeLive(), false);
    assert.deepEqual(maragonNoticeReleaseBlockers(), ['notice_not_approved', 'request_channel_not_confirmed', 'open_markers_in_page', 'privacy_revision_not_live']);
  });

  it('opens only when approval, channel, privacy revision and signed bands all hold', () => {
    const all = { meta: APPROVED, channel: TEST_CHANNEL, privacyLive: true, bandsSigned: true };
    assert.equal(isMaragonNoticeLive(all), true);
    assert.equal(isMaragonNoticeLive({ ...all, meta: MARAGON_NOTICE_META }), false);
    assert.equal(isMaragonNoticeLive({ ...all, channel: null }), false);
    assert.equal(isMaragonNoticeLive({ ...all, privacyLive: false }), false);
    assert.deepEqual(maragonNoticeReleaseBlockers({ ...all, bandsSigned: false }), ['band_table_not_signed_v1']);
  });

  it('uses the same gate for page, footer, profile link, notices, robots and sitemap', () => {
    assert.equal(maragonNoticeVisible('', false), false);
    assert.equal(maragonNoticeVisible('', true), true);
    assert.match(read('utils/maragonNoticeNavigation.ts'), /live: boolean = isMaragonNoticeLive\(\)/);
    assert.match(read('scripts/writeOgShells.ts'), /isMaragonNoticeLive\(\) \?/);
    assert.match(read('utils/routeSeo.ts'), /isMaragonNoticeLive\(\{ \.\.\.release, meta \}\)/);
    assert.match(read('components/maragon/MaragonContextNotice.tsx'), /!forceVisible && !maragonNoticeVisible\(\)/);
  });
});

describe('footer and profile links (owner labels, t330u)', () => {
  it('uses the approved labels', () => {
    assert.equal(MARAGON_NOTICE_LINK_LABELS.footer, 'Njoftim MARAGON®');
    assert.equal(MARAGON_NOTICE_LINK_LABELS.profile.sq, 'Mbi vlerësimin dhe të drejtat tuaja');
  });

  it('profile link: hidden before go-live, present after', () => {
    assert.equal(renderToStaticMarkup(React.createElement(MaragonNoticeProfileLink, { lang: 'sq', visible: false })), '');
    const on = renderToStaticMarkup(React.createElement(MaragonNoticeProfileLink, { lang: 'sq', visible: true }));
    assert.match(on, /href="\/njoftim-maragon"/);
    assert.match(on, />Mbi vlerësimin dhe të drejtat tuaja</);
    assert.match(renderToStaticMarkup(React.createElement(MaragonNoticeProfileLink, { lang: 'en', visible: true })), />About the assessment and your rights</);
  });

  it('footer link: hidden before go-live, present after', () => {
    const props = { onNavigateToMaragonNotice: undefined } as unknown as React.ComponentProps<typeof Footer>;
    const off = renderToStaticMarkup(React.createElement(Footer, props));
    assert.equal(off.includes('data-footer-link="maragon-notice"'), false);
    const on = renderToStaticMarkup(React.createElement(Footer, { ...props, onNavigateToMaragonNotice: () => undefined }));
    assert.match(on, /data-footer-link="maragon-notice"[^>]*>Njoftim MARAGON<sup aria-hidden="true" class="registered-mark">®<\/sup><\/a>/);
  });
});

describe('band names and boundaries (signed v1.0 §10)', () => {
  it('app table equals the signed table', () => {
    assert.equal(appBandsMatchSignedV1(), true);
    assert.equal(MARAGON_BAND_KEYS.length, 5);
    assert.deepEqual(MARAGON_BAND_KEYS.map((k) => [MARAGON_BAND_LABELS[k].sq, MARAGON_BAND_LABELS[k].min, MARAGON_BAND_LABELS[k].max]), SIGNED_V1_BANDS.map((b) => [b.sq, b.min, b.max]));
  });

  it('signed methodology text states the same five bands', () => {
    const p = '/workspace/brands/novaric-media/maragon/STD-COM-MARAGON-METHODOLOGY-v1.0-20261121.md';
    if (!fs.existsSync(p)) return; // methodology file is outside the repo; checked when available
    assert.ok(read(p).includes('0–20 **Shumë e dobët / Very weak** · 21–40 **E dobët / Weak** · 41–60 **Mesatare / Moderate** · 61–80 **E fortë / Strong** · 81–100 **Shumë e fortë / Very strong**'));
  });

  it('page sentence is generated from the app table', () => {
    assert.equal(bandSentence('sq'), 'Pesë brezat janë: Shumë e dobët (0–20), E dobët (21–40), Mesatare (41–60), E fortë (61–80) dhe Shumë e fortë (81–100).');
    assert.equal(bandSentence('en'), 'The five bands are: Very weak (0–20), Weak (21–40), Moderate (41–60), Strong (61–80) and Very strong (81–100).');
    const s5 = allNoticeSections().find((s) => s.id === 'brezat')!;
    assert.ok(s5.body.sq[0].includes(bandSentence('sq')) && s5.body.en[0].includes(bandSentence('en')));
  });
});

describe('+5 working days in reply texts (§12.3)', () => {
  it('every right-of-reply text that states 10 working days also states +5', () => {
    for (const f of ['data/maragon/vip_m1.presenter.ts', 'data/maragon/presenterFactory.ts', 'components/MaragonCardMockupPage.tsx']) {
      const lines = read(f).split('\n').filter((l) => /10 (ditë pune|working days)/.test(l));
      assert.ok(lines.length > 0, f);
      for (const l of lines) assert.match(l, /\+5/, `${f}: ${l.trim().slice(0, 80)}`);
    }
  });
});

describe('Privacy Policy revision (draft)', () => {
  it('is a draft, not approved, not live; open items block it', () => {
    assert.equal(PRIVACY_REVISION_META.status, 'draft_for_legal_and_editorial_review');
    assert.equal(PRIVACY_REVISION_META.approval, null);
    assert.equal(isPrivacyRevisionLive(), false);
    assert.deepEqual(privacyRevisionOpenItems(), ['P-01', 'P-02', 'P-03', 'P-04', 'P-05', 'P-06', 'P-07', 'P-08', 'P-09', 'P-10']);
    const approved = { ...PRIVACY_REVISION_META, status: 'approved_for_publication' as const, approval: { approvedBy: 'TEST', approvedOn: '2099-01-01', reference: 'T' } };
    assert.equal(isPrivacyRevisionApproved(approved), true);
    assert.equal(isPrivacyRevisionLive(approved), false, 'approval alone is not enough while items are open');
    assert.equal(isPrivacyRevisionLive(approved, [PRIVACY_SECTIONS[1]]), true);
  });

  it('cites Law 124/2024, never the repealed law as current, and no unverified mailbox or phone', () => {
    const text = PRIVACY_SECTIONS.flatMap((s) => [...s.body.sq, ...s.body.en]).join('\n');
    assert.match(text, /124\/2024/);
    for (const m of text.matchAll(/9887\/2008/g)) assert.match(text.slice(m.index! - 40, m.index! + 40), /shfuqizoi|repealed/);
    assert.deepEqual([...new Set(text.match(/[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]+/gi))], ['contact@novaric.al']);
    assert.doesNotMatch(text, /media\.novaric\.al@|privacy@|editor@|news-room@|press@|\+355|NIPT|GDPR|SCC|DPA/);
    assert.doesNotMatch(text, /12 muaj për|10 vite për/);
  });

  it('has matching Albanian and English paragraphs and allowed links only', () => {
    for (const s of PRIVACY_SECTIONS) {
      assert.equal(s.body.sq.length, s.body.en.length, s.id);
      s.body.sq.forEach((p, i) => assert.equal((p.match(/\d+/g) || []).join(' '), (s.body.en[i].match(/\d+/g) || []).join(' '), `${s.id}[${i}]`));
    }
    const hrefs = PRIVACY_SECTIONS.flatMap((s) => [...s.body.sq, ...s.body.en]).flatMap((p) => [...p.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]));
    for (const h of hrefs) assert.ok((PRIVACY_ALLOWED_HREFS as readonly string[]).includes(h), h);
  });

  it('keeps the 08.06.2025 version on the live route until release', () => {
    const live = renderToStaticMarkup(React.createElement(PrivacyPolicy, { onBack: () => undefined }));
    assert.match(live, /POLITIKA E PRIVATËSISË/);
    assert.match(live, /Përditësuar më: 08\/06\/2025/);
    assert.equal(privacyPreviewFromEnv(false, '?privacyPreview=1'), false);
    assert.equal(privacyPreviewFromEnv(true, '?privacyPreview=1'), true);
    assert.ok(fs.existsSync('components/privacy/PrivacyPolicyLegacy20250608.tsx'));
    assert.ok(fs.existsSync('components/privacy/GdprPolicyLegacy.tsx'));
  });

  it('draft renders with a visible draft banner and the open items', () => {
    const html = renderToStaticMarkup(React.createElement(PrivacyPolicyRevision, { onBack: () => undefined }));
    assert.match(html, /data-privacy-draft="true"/);
    assert.match(html, /P-01, P-02/);
    assert.equal((html.match(/<h1 /g) || []).length, 2);
  });
});

describe('.gitignore', () => {
  it('has no conflict markers and ignores the dependency folder', () => {
    const g = read('.gitignore');
    assert.doesNotMatch(g, /^(<<<<<<<|=======|>>>>>>>)/m);
    const out = execFileSync('git', ['check-ignore', '-v', '--no-index', 'node_modules', 'packages/node_modules/x/index.js'], { encoding: 'utf8' });
    assert.match(out, /node_modules\tnode_modules\n/);
    assert.match(out, /packages\/node_modules\/x\/index\.js/);
  });
});
