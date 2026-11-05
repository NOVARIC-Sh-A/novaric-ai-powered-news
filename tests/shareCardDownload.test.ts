import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { JSDOM } from 'jsdom';
import { shareCardDownload } from '../components/figurat-politike/ShareCardDownload';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
});
const g = globalThis as any;
g.window = dom.window;
g.document = dom.window.document;
g.HTMLElement = dom.window.HTMLElement;
g.SVGElement = dom.window.SVGElement;
g.Element = dom.window.Element;
g.Node = dom.window.Node;
g.IS_REACT_ACT_ENVIRONMENT = true;

describe('Share card download for Nard Ndoka', () => {
  it('points at his generated card and saves it under the Novaric filename', () => {
    const card = shareCardDownload('nard-ndoka');
    assert.deepEqual(card, {
      href: '/og/profiles/nard-ndoka.png',
      filename: 'nard-ndoka-novaric-card.png',
    });
    assert.equal(shareCardDownload(''), null);
    assert.equal(shareCardDownload(null), null);
  });

  it('renders an accessible download link and opens a tab when download is unavailable', async () => {
    const { ShareCardDownload } = await import('../components/figurat-politike/ShareCardDownload');
    const { createRoot } = await import('react-dom/client');
    const { act } = await import('react');
    const opened: string[] = [];
    g.window.open = (url: string) => { opened.push(url); return null; };

    const root = createRoot(document.getElementById('root')!);
    await act(async () => {
      root.render(React.createElement(ShareCardDownload, { slug: 'nard-ndoka' }));
    });
    const link = document.querySelector('[data-share-card-download]') as HTMLAnchorElement;
    assert.ok(link);
    assert.equal(link.getAttribute('aria-label'), 'Shkarko kartën');
    assert.equal(link.textContent, 'Shkarko kartën');
    assert.equal(link.getAttribute('href'), '/og/profiles/nard-ndoka.png');
    assert.equal(link.getAttribute('download'), 'nard-ndoka-novaric-card.png');
    assert.ok(link.querySelector('svg'));

    await act(async () => {
      link.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    assert.deepEqual(opened, []);

    const original = g.navigator.userAgent;
    Object.defineProperty(g.navigator, 'userAgent', { value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', configurable: true });
    await act(async () => {
      link.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    assert.deepEqual(opened, ['/og/profiles/nard-ndoka.png']);
    Object.defineProperty(g.navigator, 'userAgent', { value: original, configurable: true });

    await act(async () => {
      root.render(React.createElement(ShareCardDownload, { slug: '' }));
    });
    assert.equal(document.querySelector('[data-share-card-download]'), null);
    await act(async () => { root.unmount(); });
  });

  it('sits in the details section of every profile card', () => {
    const card = fs.readFileSync(path.resolve(process.cwd(), 'components/figurat-politike/PoliticianCard.tsx'), 'utf8');
    const details = card.indexOf('data-profile-details="true"');
    const download = card.indexOf('<ShareCardDownload');
    const logos = card.indexOf('<ProfileSocialLogos');
    const fingerprint = card.indexOf('data-legacy-fingerprint="true"');
    assert.ok(details > 0 && download > details && logos > download && fingerprint > logos);
  });
});
