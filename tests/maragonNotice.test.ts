import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  MARAGON_NOTICE_ALLOWED_HREFS,
  MARAGON_NOTICE_META,
  MARAGON_NOTICE_PATH,
  MARAGON_NOTICE_PUBLISHER,
  MARAGON_NOTICE_SECTIONS,
  MARAGON_NOTICE_TITLE,
  allNoticeSections,
  isMaragonNoticeApproved,
  parseNoticeInline,
  versionSection,
} from '../data/maragon/maragonNoticeContent';
import {
  MARAGON_CONTEXT_NOTICE_IDS,
  contextNotice,
  displayStateProblems,
  noticesForDisplay,
} from '../data/maragon/maragonContextNotices';
import { maragonNoticeVisible, routeMaragonNoticeFromLocation } from '../utils/maragonNoticeNavigation';
import { routeMediaFromLocation } from '../utils/mediaNavigation';
import { maragonNoticeSeo } from '../utils/routeSeo';
import { seoShellRelativePath } from '../utils/seoShell';
import { applyOgToIndexHtml } from '../utils/ogDocument';
import { MaragonNoticePage } from '../components/maragon/MaragonNoticePage';
import { MaragonContextNotices } from '../components/maragon/MaragonContextNotice';
import { mediaProfilesData } from '../data/mediaProfiles';
import { getPresenterRecord } from '../components/maragon/maragonPresenterUi';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');
const sections = allNoticeSections();
const allText = (lang: 'sq' | 'en') => [MARAGON_NOTICE_TITLE[lang], ...sections.flatMap((s) => [s.heading[lang], ...s.body[lang]])].join('\n');
const digits = (value: string) => (value.match(/\d+(?:[.,]\d+)*/g) || []).join(' ');
const links = (value: string) => parseNoticeInline(value).filter((p) => p.kind === 'link').map((p) => (p as { href: string }).href).join(' ');
const TEST_CHANNEL = {
  href: 'mailto:test-only@example.invalid',
  label: 'test-only@example.invalid',
  mailboxAccessConfirmed: true,
  responsiblePersonConfirmed: true,
  backupConfirmed: true,
  requestLoggingConfirmed: true,
  confirmedOn: '2099-01-01',
  reference: 'TEST-ONLY',
};
const approvedMeta = {
  ...MARAGON_NOTICE_META,
  status: 'approved_for_publication' as const,
  approval: { approvedBy: 'TEST ONLY', approvedOn: '2099-01-01', reference: 'TEST-ONLY-NOT-LIVE' },
  publishedOn: '2099-01-02',
};

describe('MARAGON® notice route /njoftim-maragon', () => {
  it('opens from the path and the query, and nothing else', () => {
    assert.equal(MARAGON_NOTICE_PATH, '/njoftim-maragon');
    assert.deepEqual(routeMaragonNoticeFromLocation('/njoftim-maragon'), { page: 'maragonNotice' });
    assert.deepEqual(routeMaragonNoticeFromLocation('/njoftim-maragon/'), { page: 'maragonNotice' });
    assert.deepEqual(routeMaragonNoticeFromLocation('/', '?page=maragonNotice'), { page: 'maragonNotice' });
    assert.equal(routeMaragonNoticeFromLocation('/metodologjia'), null);
    assert.equal(routeMaragonNoticeFromLocation('/personalitete-mediatike/njoftim-maragon'), null);
    assert.equal(seoShellRelativePath('/njoftim-maragon'), 'njoftim-maragon/index.html');
  });

  it('follows the /metodologjia wiring in server, nginx, App and the shell writer', () => {
    assert.match(read('server.ts'), /page === 'maragonNotice'[\s\S]{0,80}res\.redirect\(301, '\/njoftim-maragon'\)/);
    const nginx = read('nginx.conf');
    assert.match(nginx, /\$arg_page = maragonNotice\) \{\s*return 301 \/njoftim-maragon;/);
    assert.match(nginx, /location = \/njoftim-maragon \{\s*try_files \/njoftim-maragon\/index\.html \/index\.html;/);
    const app = read('App.tsx');
    assert.match(app, /routeMaragonNoticeFromLocation\(pathname/);
    assert.match(app, /routeMaragonNoticeFromLocation\(path/);
    assert.match(app, /pushState\(\{ page: 'maragonNotice' \}, '', MARAGON_NOTICE_PATH\)/);
    assert.match(read('pages/SimplePage.tsx'), /case 'maragonNotice':/);
    assert.match(read('types.ts'), /\| 'maragonNotice'/);
    const shells = read('scripts/writeOgShells.ts');
    assert.match(shells, /njoftim-maragon/);
    assert.match(shells, /isMaragonNoticeLive\(\) \? \['https:\/\/media\.novaric\.al\/njoftim-maragon'\] : \[\]/);
  });

  it('keeps the draft out of the static sitemap and out of search', () => {
    assert.equal(read('sitemap.xml').includes('njoftim-maragon'), false);
    const seo = maragonNoticeSeo();
    assert.equal(seo.url, 'https://media.novaric.al/njoftim-maragon');
    assert.equal(seo.robots, 'noindex, nofollow');
    const ld = JSON.stringify(seo.jsonLd);
    assert.match(ld, /"@type":"WebPage"/);
    assert.match(ld, /"version":"0\.2"/);
    assert.doesNotMatch(ld, /datePublished|dateModified/);
    const shell = applyOgToIndexHtml('<html lang="sq"><head><meta charset="UTF-8"></head><body><div id="root"></div></body></html>', seo);
    assert.match(shell, /<link rel="canonical" href="https:\/\/media\.novaric\.al\/njoftim-maragon" \/>/);
    assert.match(shell, /<meta name="robots" content="noindex, nofollow" \/>/);
  });

  it('becomes indexable only with a recorded approval, with real dates only', () => {
    const seo = maragonNoticeSeo(approvedMeta, { channel: TEST_CHANNEL, privacyLive: true });
    assert.equal(seo.robots, undefined);
    const ld = JSON.stringify(seo.jsonLd);
    assert.match(ld, /"datePublished":"2099-01-02"/);
    assert.match(ld, /"dateModified":"2099-01-01"/);
  });
});

describe('MARAGON® notice approval gate', () => {
  it('ships as a draft with no approval, no publication date and no visibility', () => {
    assert.equal(MARAGON_NOTICE_META.status, 'draft_for_legal_and_editorial_review');
    assert.equal(MARAGON_NOTICE_META.approval, null);
    assert.equal(MARAGON_NOTICE_META.publishedOn, null);
    assert.equal(isMaragonNoticeApproved(), false);
    assert.equal(maragonNoticeVisible(''), false);
    assert.equal(maragonNoticeVisible('?maragonPreview=1'), false, 'preview needs a dev server');
  });

  it('needs status, approver, ISO date and a written reference together', () => {
    assert.equal(isMaragonNoticeApproved(approvedMeta), true);
    assert.equal(isMaragonNoticeApproved({ ...approvedMeta, approval: null }), false);
    assert.equal(isMaragonNoticeApproved({ ...approvedMeta, approval: { ...approvedMeta.approval, reference: ' ' } }), false);
    assert.equal(isMaragonNoticeApproved({ ...approvedMeta, approval: { ...approvedMeta.approval, approvedOn: '22.11.2026' } }), false);
    assert.equal(isMaragonNoticeApproved({ ...approvedMeta, status: 'draft_for_legal_and_editorial_review' }), false);
  });

  it('renders only an "under review" stub in production, and the full page in preview', () => {
    const stub = renderToStaticMarkup(React.createElement(MaragonNoticePage, { onBack: () => undefined }));
    assert.match(stub, /Ky njoftim është në shqyrtim dhe nuk është publikuar ende\./);
    assert.doesNotMatch(stub, /<h2/);
    const full = renderToStaticMarkup(React.createElement(MaragonNoticePage, { onBack: () => undefined, forceVisible: true }));
    assert.match(full, /data-notice-draft="true"/);
    assert.match(full, /Draft për shqyrtim ligjor dhe editorial/);
    assert.match(full, /Draft for legal and editorial review/);
    assert.equal((full.match(/<h1 /g) || []).length, 2, 'one h1 per language');
    assert.equal((full.match(/<h2 /g) || []).length, 26, '13 sections x 2 languages');
    assert.match(full, /<article lang="sq"/);
    assert.match(full, /<article lang="en"/);
    const withoutSup = full.replace(/<sup aria-hidden="true" class="registered-mark">®<\/sup>/g, '');
    assert.equal(withoutSup.includes('®'), false, 'every ® is the shared superscript');
    assert.match(full, /MARAGON<sup aria-hidden="true" class="registered-mark">®<\/sup> — Njoftim/);
  });

  it('adds footer and profile links only behind the same gate', () => {
    const footer = read('components/Footer.tsx');
    assert.match(footer, /\{props\.onNavigateToMaragonNotice && \(/);
    assert.match(footer, /Njoftim MARAGON<sup aria-hidden="true" className="registered-mark">®<\/sup>/);
    assert.match(read('App.tsx'), /onNavigateToMaragonNotice=\{maragonNoticeVisible\(\) \? \(\) => navigateTo\('maragonNotice'\) : undefined\}/);
    const profile = read('components/maragon/MaragonPresenterProfilePage.tsx');
    assert.match(profile, /<MaragonNoticeProfileLink lang=\{lang\} visible=\{noticeLinkVisible\} \/>/);
    assert.match(profile, /<MaragonContextNotices state=\{displayState\} lang=\{lang\} \/>/);
  });
});

describe('MARAGON® notice copy', () => {
  it('covers the thirteen mandated sections in Albanian and English', () => {
    assert.equal(sections.length, 13);
    assert.deepEqual(sections.map((s) => s.number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    assert.equal(new Set(sections.map((s) => s.id)).size, 13);
  });

  it('keeps Albanian and English paragraph for paragraph: same count, lists, numbers and links', () => {
    for (const s of sections) {
      assert.equal(s.body.sq.length, s.body.en.length, s.id);
      s.body.sq.forEach((sq, i) => {
        const en = s.body.en[i];
        assert.equal(sq.startsWith('- '), en.startsWith('- '), `${s.id}[${i}] list`);
        assert.equal(digits(sq), digits(en), `${s.id}[${i}] numbers`);
        assert.equal(links(sq), links(en), `${s.id}[${i}] links`);
      });
    }
  });

  it('uses only allowed, existing link targets', () => {
    const hrefs = new Set(sections.flatMap((s) => [...s.body.sq, ...s.body.en]).flatMap((p) => parseNoticeInline(p)).filter((p) => p.kind === 'link').map((p) => (p as { href: string }).href));
    for (const href of hrefs) assert.ok((MARAGON_NOTICE_ALLOWED_HREFS as readonly string[]).includes(href), href);
    assert.match(read('pages/SimplePage.tsx'), /case 'privacy':/);
    assert.deepEqual(routeMediaFromLocation('/personalitete-mediatike', ''), { page: 'mediaPersonalitiesPage' });
  });

  it('uses only the verified publisher details', () => {
    assert.equal(MARAGON_NOTICE_PUBLISHER.legalName, 'NOVARIC® Sh.A.');
    assert.equal(MARAGON_NOTICE_PUBLISHER.email, 'contact@novaric.al');
    const text = allText('sq') + allText('en');
    const emails = new Set(text.match(/[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]+/gi) || []);
    assert.deepEqual([...emails], ['contact@novaric.al']);
    assert.doesNotMatch(text, /\+355|\bDOO\b|privacy@|dpo@|PIB|NUIS/);
  });

  it('keeps exactly one internal marker (B-01) until the channel is confirmed', () => {
    const draft = allText('sq') + allText('en');
    assert.deepEqual([...new Set(draft.match(/\[\[[^\]]*\]\]/g))], ['[[B-01 KANALI I KËRKESAVE NË PRITJE TË KONFIRMIMIT]]', '[[B-01 REQUEST CHANNEL PENDING CONFIRMATION]]']);
    assert.equal(draft.includes('{{'), false);
  });

  it('shows no placeholders, invented mechanisms or immunity language once the channel is confirmed', () => {
    const confirmed = allNoticeSections(MARAGON_NOTICE_META, TEST_CHANNEL);
    const text = [MARAGON_NOTICE_TITLE.sq, MARAGON_NOTICE_TITLE.en, ...confirmed.flatMap((s) => [s.heading.sq, s.heading.en, ...s.body.sq, ...s.body.en])].join('\n');
    const banned = [
      /\bTBD\b|\bTODO\b|\bXXX\b|\[\[|\{\{|PLACEHOLDER|\blorem\b/i,
      /\bFINAL\b|\bAPPROVED\b/,
      /PUBLISHED_APPROVED/,
      /48[ -]?(orë|hour)/i,
      /24 (muaj|months)/i,
      /(pesë|five) (episode|episodes)/i,
      /\b30\b/,
      /Editorial Board|Bordi Editorial|Këshilli Editorial/i,
      /\bDPO\b|data protection officer|zyrtar(i)? (për|i) mbrojtje/i,
      /immunit|imunitet/i,
      /waive|heq(in)? dorë/i,
      /9887/,
      /AUD-MET|EFCSN|IFCN/,
      /Greta/i,
      /constitutes defamation|përbën shpifje/i,
      /all findings are opinion|të gjitha gjetjet janë opinion/i,
      /AM-10/,
    ];
    for (const re of banned) assert.doesNotMatch(text, re, String(re));
  });

  it('states the verified rules exactly', () => {
    const sq = allText('sq');
    const en = allText('en');
    for (const code of ['R1.1', 'R1.2', 'A2.1', 'A2.2', 'A2.3', 'A2.4', 'G3.1', 'G3.2', 'O4.1', 'O4.2']) {
      assert.ok(sq.includes(code) && en.includes(code), code);
    }
    assert.match(sq, /Boshti plotësues C nuk vlerësohet/);
    assert.match(en, /supplementary axis C is not scored/);
    assert.match(sq, /10 ditë pune, pa llogaritur festat zyrtare në Shqipëri, dhe zgjatet me 5 ditë pune me kërkesë të arsyetuar/);
    assert.match(en, /10 working days, not counting Albanian public holidays, and is extended by 5 working days on a reasoned request/);
    assert.match(sq, /rregull i brendshëm i NOVARIC® Sh\.A\., jo afat i caktuar me ligj/);
    assert.match(sq, /PROVIZOR — në pritje të miratimit/);
    assert.match(en, /PROVISIONAL — pending sign-off/);
    assert.match(sq, /Ligjin nr\. 124\/2024/);
    assert.match(sq, /nuk është vendim gjyqësor, administrativ ose rregullator/);
    assert.match(sq, /Nuk është diagnozë psikologjike/);
    assert.match(sq, /nuk bëhet automatikisht gjetje për prezantuesin/);
    assert.match(sq, /recensues i vetëm/);
    assert.match(sq, /MARAGON® është e ndarë nga PARAGON®/);
    assert.match(sq, /Shumë e dobët \(0–20\), E dobët \(21–40\), Mesatare \(41–60\), E fortë \(61–80\) dhe Shumë e fortë \(81–100\)/);
  });

  it('builds section 13 from recorded metadata, never typed dates', () => {
    const draft = versionSection();
    assert.match(draft.body.sq.join(' '), /Nuk është miratuar ende/);
    assert.match(draft.body.en.join(' '), /Not yet published/);
    const live = versionSection(approvedMeta);
    assert.match(live.body.sq.join(' '), /Miratuar nga TEST ONLY më 01\.01\.2099/);
    assert.match(live.body.en.join(' '), /Published on 02\.01\.2099/);
    assert.equal(MARAGON_NOTICE_SECTIONS.some((s) => s.id === 'versioni'), false);
  });
});

describe('MARAGON® contextual notices', () => {
  it('has both languages and the same numbers for every notice', () => {
    for (const id of MARAGON_CONTEXT_NOTICE_IDS) {
      const n = contextNotice(id);
      assert.ok(n.text.sq.trim() && n.text.en.trim(), id);
      assert.equal(digits(n.text.sq), digits(n.text.en), id);
      assert.equal(n.href, '/njoftim-maragon');
    }
  });

  it('matches the live display state: nothing assessed, no benchmark line', () => {
    assert.deepEqual(
      noticesForDisplay({ mode: 'public', officialBands: 0, provisionalBands: 0, benchmarkVerticesDrawn: 0 }),
      ['not_assessed', 'benchmarks_absent'],
    );
  });

  it('labels provisional and official bands separately and never upgrades one to the other', () => {
    const provisional = noticesForDisplay({ mode: 'public', officialBands: 0, provisionalBands: 3, benchmarkVerticesDrawn: 0 });
    assert.ok(provisional.includes('provisional_band'));
    assert.equal(provisional.includes('official_band'), false);
    assert.equal(provisional.includes('not_assessed'), false);
    const official = noticesForDisplay({ mode: 'public', officialBands: 2, provisionalBands: 0, benchmarkVerticesDrawn: 0 });
    assert.ok(official.includes('official_band'));
    assert.equal(official.includes('provisional_band'), false);
    assert.match(contextNotice('provisional_band').text.sq, /Nuk është vlerësim zyrtar\./);
    assert.match(contextNotice('provisional_band').text.en, /No provisional overall assessment is shown/);
  });

  it('shows the internal-numbers notice only in the internal view and flags numbers in public', () => {
    assert.ok(noticesForDisplay({ mode: 'internal', officialBands: 0, provisionalBands: 0, benchmarkVerticesDrawn: 0, numbersVisible: true }).includes('internal_numbers'));
    assert.equal(noticesForDisplay({ mode: 'public', officialBands: 0, provisionalBands: 0, benchmarkVerticesDrawn: 0, numbersVisible: true }).includes('internal_numbers'), false);
    assert.deepEqual(displayStateProblems({ mode: 'public', officialBands: 0, provisionalBands: 0, benchmarkVerticesDrawn: 0, numbersVisible: true }), ['numbers_in_public_view']);
  });

  it('treats any drawn benchmark line without a signed normative source as a display problem', () => {
    assert.deepEqual(displayStateProblems({ mode: 'internal', officialBands: 0, provisionalBands: 0, benchmarkVerticesDrawn: 4, benchmarkIsNormative: false }), ['benchmark_without_signed_normative_source']);
    assert.ok(noticesForDisplay({ mode: 'public', officialBands: 0, provisionalBands: 0, benchmarkVerticesDrawn: 4, benchmarkIsNormative: true }).includes('benchmark_normative'));
    assert.match(contextNotice('benchmark_normative').text.en, /It is not the average of observed presenters/);
  });

  it('renders nothing in production and the right notices in preview, with superscript marks', () => {
    const state = { mode: 'public' as const, officialBands: 0, provisionalBands: 0, benchmarkVerticesDrawn: 0 };
    assert.equal(renderToStaticMarkup(React.createElement(MaragonContextNotices, { state, lang: 'sq' })), '');
    const html = renderToStaticMarkup(React.createElement(MaragonContextNotices, { state, lang: 'en', forceVisible: true }));
    assert.match(html, /data-maragon-notices="not_assessed benchmarks_absent"/);
    assert.match(html, /Not assessed: there is no approved, published value/);
    assert.match(html, /href="\/njoftim-maragon"/);
  });

  it('changes no live presenter flag, band or score', () => {
    for (const profile of mediaProfilesData) {
      const record = getPresenterRecord(profile);
      if (!record) continue;
      assert.equal(record.maragon.composite, null);
      assert.notEqual(record.maragon.assessmentStatus, 'approved');
      assert.equal(record.maragon.methodologyApproved, false);
      assert.equal(record.maragon.authorizedForPublicDisplay, false);
    }
  });
});
