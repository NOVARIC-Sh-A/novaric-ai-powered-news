import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  LISTING_DESCRIPTION,
  LISTING_IMAGE,
  LISTING_TITLE,
  applyOgToIndexHtml,
  listingOg,
  profileOg,
} from '../utils/ogDocument';

const indexHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');

describe('Open Graph shells for Figurat Politike', () => {
  it('describes the listing without scores and points at the shared card', () => {
    const fields = listingOg();
    assert.equal(fields.title, LISTING_TITLE);
    assert.equal(fields.title, 'Figurat Politike');
    assert.equal(fields.description, LISTING_DESCRIPTION);
    assert.equal(fields.url, 'https://media.novaric.al/figurat-politike');
    assert.equal(fields.image, LISTING_IMAGE);
    assert.equal(fields.image, 'https://media.novaric.al/og/figurat-politike.png');
    assert.doesNotMatch(fields.description, /pikë|score|rendit/i);
  });

  it('injects crawler tags into a copy of index.html and keeps the SPA root', () => {
    const html = applyOgToIndexHtml(indexHtml, listingOg());
    assert.equal(html.match(/<title>/g)?.length, 1);
    assert.match(html, /<title>Figurat Politike \| NOVARIC® Lajme me IA<\/title>/);
    assert.match(html, /<meta name="description" content="Profilet e figurave politike shqiptare · PARAGON®" \/>/);
    assert.match(html, /<meta property="og:title" content="Figurat Politike" \/>/);
    assert.match(html, /<meta property="og:image" content="https:\/\/media\.novaric\.al\/og\/figurat-politike\.png" \/>/);
    assert.match(html, /<meta property="og:image:width" content="1200" \/>/);
    assert.match(html, /<meta property="og:image:height" content="630" \/>/);
    assert.match(html, /<meta property="og:url" content="https:\/\/media\.novaric\.al\/figurat-politike" \/>/);
    assert.match(html, /<meta property="og:type" content="website" \/>/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/);
    assert.match(html, /<meta name="twitter:image" content="https:\/\/media\.novaric\.al\/og\/figurat-politike\.png" \/>/);
    assert.match(html, /<link rel="canonical" href="https:\/\/media\.novaric\.al\/figurat-politike" \/>/);
    assert.match(html, /<div id="root">/);
    assert.doesNotMatch(html, /<title>NOVARIC® AI-Powered News<\/title>/);
  });

  it('uses the name, role, and per-profile card, and escapes the name', () => {
    const fields = profileOg({
      name: 'Nard Ndoka',
      slug: 'nard-ndoka',
      primaryRole: 'Kryetar i Partisë Demokristiane të Shqipërisë',
    });
    assert.equal(fields.title, 'Nard Ndoka');
    assert.match(fields.description, /Demokristiane/);
    assert.doesNotMatch(fields.description, /pikë|score|rendit/i);
    assert.equal(fields.url, 'https://media.novaric.al/figurat-politike/nard-ndoka');
    assert.equal(fields.image, 'https://media.novaric.al/og/profiles/nard-ndoka.png');
    const html = applyOgToIndexHtml('<meta charset="UTF-8"><title>old</title>', profileOg({
      name: 'A & B <test>',
      slug: 'a-b',
      primaryRole: 'Rol "zyrtar"',
    }));
    assert.match(html, /og:title" content="A &amp; B &lt;test&gt;"/);
    assert.match(html, /Rol &quot;zyrtar&quot;/);
    assert.match(html, /<div id="root">|charset/);
  });

  it('keeps the listing card at the published size', () => {
    const file = path.resolve(process.cwd(), 'public/og/figurat-politike.png');
    const bytes = fs.statSync(file).size;
    assert.ok(bytes < 300_000, `card is ${bytes} bytes`);
    assert.ok(bytes > 20_000);
  });
});
