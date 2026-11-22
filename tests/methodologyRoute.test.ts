import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { routeMethodologyFromLocation, METHODOLOGY_PATH } from '../utils/methodologyNavigation';
import {
  METHODOLOGY_AUTHOR,
  METHODOLOGY_DESCRIPTION,
  METHODOLOGY_DOCUMENT_TITLE,
  methodologySeo,
} from '../utils/routeSeo';
import { applyOgToIndexHtml } from '../utils/ogDocument';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Methodology path /metodologjia', () => {
  it('opens the methodology page from the path and the old query', () => {
    assert.deepEqual(routeMethodologyFromLocation('/metodologjia', ''), { page: 'analysisMethodology' });
    assert.deepEqual(routeMethodologyFromLocation('/metodologjia/', ''), { page: 'analysisMethodology' });
    assert.deepEqual(routeMethodologyFromLocation('/', '?page=analysisMethodology'), { page: 'analysisMethodology' });
    assert.equal(routeMethodologyFromLocation('/personalitete-mediatike', ''), null);
    assert.equal(routeMethodologyFromLocation('/', '?page=newsList'), null);
    assert.equal(METHODOLOGY_PATH, '/metodologjia');
  });

  it('publishes article metadata for the clean URL', () => {
    const seo = methodologySeo();
    assert.equal(METHODOLOGY_DOCUMENT_TITLE, 'Metodologjia NOVARIC®: Balancimi i IA-së me Integritetin Gazetarskor | NOVARIC® Lajme me IA');
    assert.ok(METHODOLOGY_DESCRIPTION.length >= 150 && METHODOLOGY_DESCRIPTION.length <= 160);
    assert.equal(seo.url, 'https://media.novaric.al/metodologjia');
    assert.equal(seo.type, 'article');
    assert.equal(seo.author, METHODOLOGY_AUTHOR);
    assert.equal(seo.author, 'Dr. Alban Gj. THIKA');
    const ld = seo.jsonLd as {
      '@type': string;
      headline: string;
      inLanguage: string;
      url: string;
      author: { '@type': string; name: string };
      publisher: { '@type': string; name: string };
    };
    assert.equal(ld['@type'], 'Article');
    assert.match(ld.headline, /Metodologjia e NOVARIC®/);
    assert.equal(ld.inLanguage, 'sq');
    assert.equal(ld.url, seo.url);
    assert.equal(ld.author['@type'], 'Person');
    assert.equal(ld.author.name, 'Dr. Alban Gj. THIKA');
    assert.equal(ld.publisher['@type'], 'Organization');
    assert.equal(ld.publisher.name, 'NOVARIC®');

    const shell = applyOgToIndexHtml('<html lang="sq"><head><meta charset="UTF-8"></head><body><div id="root"></div></body></html>', seo);
    assert.match(shell, /<html lang="sq">/);
    assert.match(shell, /<title>Metodologjia NOVARIC®: Balancimi i IA-së me Integritetin Gazetarskor \| NOVARIC® Lajme me IA<\/title>/);
    assert.match(shell, /<link rel="canonical" href="https:\/\/media\.novaric\.al\/metodologjia" \/>/);
    assert.match(shell, /<meta property="og:type" content="article" \/>/);
    assert.match(shell, /<meta property="og:locale" content="sq_AL" \/>/);
    assert.match(shell, /<meta property="og:url" content="https:\/\/media\.novaric\.al\/metodologjia" \/>/);
    assert.match(shell, /<meta name="twitter:card" content="summary_large_image" \/>/);
    assert.match(shell, /<meta name="author" content="Dr\. Alban Gj\. THIKA" \/>/);
    assert.match(shell, /"@type":"Article"/);
  });

  it('keeps the old query as a redirect and lists the path', () => {
    const server = read('server.ts');
    assert.match(server, /page === 'analysisMethodology'/);
    assert.match(server, /res\.redirect\(301, '\/metodologjia'\)/);
    const nginx = read('nginx.conf');
    assert.match(nginx, /\$arg_page = analysisMethodology/);
    assert.match(nginx, /return 301 \/metodologjia;/);
    const app = read('App.tsx');
    assert.match(app, /routeMethodologyFromLocation/);
    assert.match(app, /METHODOLOGY_PATH/);
    assert.match(read('sitemap.xml'), /https:\/\/media\.novaric\.al\/metodologjia/);
    assert.match(read('scripts/writeOgShells.ts'), /metodologjia/);
    assert.equal(read('index.html').includes('<html lang="sq">'), true);
    assert.doesNotMatch(read('components/MediaEducationFrameworkPage.tsx'), /page=analysisMethodology/);
  });
});
