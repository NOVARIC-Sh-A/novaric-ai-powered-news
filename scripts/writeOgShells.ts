/**
 * After vite build, write static HTML shells so crawlers see Open Graph tags.
 * dist/figurat-politike/index.html serves /figurat-politike and /figurat-politike/.
 * dist/figurat-politike/<slug>/index.html serves each profile when nginx indexes the directory.
 * Numeric and vip URLs are not given a shell, so they still fall through to the SPA.
 */
import fs from 'node:fs';
import path from 'node:path';
import { applyOgToIndexHtml, listingOg, profileOg } from '../utils/ogDocument';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');
const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const exportPath = path.join(root, 'db', 'paragon_scores_export.json');
const profiles = JSON.parse(fs.readFileSync(exportPath, 'utf8')).profiles as Array<{
  name?: string;
  slug?: string;
  primaryRole?: string | null;
}>;

const listingDir = path.join(dist, 'figurat-politike');
fs.mkdirSync(listingDir, { recursive: true });
fs.writeFileSync(path.join(listingDir, 'index.html'), applyOgToIndexHtml(shell, listingOg()));

let written = 0;
for (const profile of profiles) {
  const slug = (profile.slug || '').trim();
  if (!slug || slug.includes('/') || slug.includes('..')) continue;
  const dir = path.join(listingDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), applyOgToIndexHtml(shell, profileOg(profile)));
  written += 1;
}

if (!shell.includes('<div id="root">')) {
  throw new Error('SPA root missing from the shell');
}
console.log(`og shells listing=1 profiles=${written}`);
