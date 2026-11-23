import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MaragonAm10PublicPage } from '../components/MaragonAm10PublicPage';
import { MARAGON_AM10_MARKDOWN } from '../components/maragonAm10PublicText';
import { MARAGON_AM10_DESCRIPTION, MARAGON_AM10_PATH, MARAGON_AM10_TITLE, maragonAm10Seo } from '../utils/routeSeo';
import { seoShellRelativePath } from '../utils/seoShell';

const RANGE = /\d+(?:[.,]\d+)?\s*[–—-]\s*\d+(?:[.,]\d+)?/g;

function read(relativePath: string): string {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');
}

/** Visible words of the signed markdown, with markup removed and nothing added. */
function markdownPlain(markdown: string): string {
  const chunks: string[] = [];
  for (const raw of markdown.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line)) continue;
    let text = line;
    if (/^#{1,6}\s+/.test(text)) text = text.replace(/^#{1,6}\s+/, '');
    else if (/^>\s?/.test(text)) text = text.replace(/^>\s?/, '');
    else if (/^\d+\.\s+/.test(text)) text = text.replace(/^\d+\.\s+/, '');
    else if (/^-\s+/.test(text)) text = text.replace(/^-\s+/, '');
    if (text.startsWith('|')) {
      text = text.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim()).filter(Boolean).join(' ');
    }
    text = text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');
    if (text.trim()) chunks.push(text.trim());
  }
  return chunks.join(' ').replace(/\s+/g, ' ').trim();
}

function htmlPlain(html: string): string {
  const text = html
    .replace(/<sup[^>]*>/g, '')
    .replace(/<\/sup>/g, '')
    .replace(/<span[^>]*>/g, '')
    .replace(/<\/span>/g, '')
    .replace(/<strong>/g, '')
    .replace(/<\/strong>/g, '')
    .replace(/<em>/g, '')
    .replace(/<\/em>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
  return text.replace(/\s+/g, ' ').trim();
}

describe('MARAGON® AM-10 public page', () => {
  const html = renderToStaticMarkup(React.createElement(MaragonAm10PublicPage, { onBack: () => undefined }));
  const article = html.match(/<article id="maragon-am10-public"[^>]*>([\s\S]*)<\/article>/)?.[1] ?? '';
  const rendered = htmlPlain(article);
  const source = markdownPlain(MARAGON_AM10_MARKDOWN);

  it('renders the signed text verbatim', () => {
    assert.ok(article.length > 0);
    assert.equal(rendered, source);
    assert.match(rendered, /I NËNSHKRUAR SIÇ ËSHTË \/ SIGNED AS WRITTEN/);
    assert.match(rendered, /Shumë e dobët \/ Very weak/);
    assert.match(rendered, /Dr Alban Gj\. THIKA/);
    assert.match(html, /class="novaric-brand"/);
    assert.match(html, /class="registered-mark"/);
    assert.match(html, />MARAGON</);
    assert.match(html, />NOVARIC</);
  });

  it('adds no 0–100 style ranges and contains no DRAFT', () => {
    assert.equal(html.includes('DRAFT'), false);
    assert.equal(rendered.includes('DRAFT'), false);
    assert.equal(MARAGON_AM10_MARKDOWN.includes('DRAFT'), false);
    assert.deepEqual(rendered.match(RANGE), source.match(RANGE));
    const ranges = rendered.match(RANGE) ?? [];
    assert.deepEqual(ranges.filter((token) => token === '0–100'), ['0–100', '0–100', '0–100', '0–100']);
    assert.equal(ranges.some((token) => /^\d+\s*-\s*\d+$/.test(token) && token !== '2026-11'), false);
  });

  it('publishes the clean path and the Publikime label without benchmark data', () => {
    assert.equal(MARAGON_AM10_PATH, '/maragon-am10');
    assert.equal(MARAGON_AM10_TITLE, 'MARAGON® AM-10 — brezat referues / reference bands');
    assert.match(MARAGON_AM10_DESCRIPTION, /^Ky është teksti publik/);
    assert.equal(maragonAm10Seo().url, 'https://media.novaric.al/maragon-am10');
    assert.equal(seoShellRelativePath('/maragon-am10', ''), 'maragon-am10/index.html');
    assert.equal(seoShellRelativePath('/maragon-am10/', ''), 'maragon-am10/index.html');
    assert.equal(seoShellRelativePath('/', '?page=maragonAm10'), 'maragon-am10/index.html');
    const sidebar = read('components/RightSidebar.tsx');
    const menu = read('components/HeaderMenu.tsx');
    const sitemap = read('components/SitemapPage.tsx');
    for (const file of [sidebar, menu, sitemap]) {
      assert.match(file, /MARAGON® AM-10 — Brezat referues/);
      assert.match(file, /onNavigateToMaragonAm10/);
    }
    assert.match(sidebar, /Publikime <NovaricBrand \/>/);
    const page = read('components/MaragonAm10PublicPage.tsx');
    assert.doesNotMatch(page, /data\/maragon|benchmarks|methodologyApproved/);
    assert.doesNotMatch(read('components/maragonAm10PublicText.ts'), /DRAFT/);
  });
});
