/**
 * After vite build, write static HTML shells so crawlers see Open Graph tags.
 * dist/figurat-politike/index.html serves /figurat-politike and /figurat-politike/.
 * dist/figurat-politike/<slug>/index.html serves each profile when nginx indexes the directory.
 * Numeric and vip URLs are not given a shell, so they still fall through to the SPA.
 */
import fs from 'node:fs';
import path from 'node:path';
import { applyOgToIndexHtml, listingOg, mediaListingOg, mediaProfileOg, profileOg } from '../utils/ogDocument';
import { mediaProfilesData } from '../data/mediaProfiles';
import { forecastSeo, homeSeo, maragonAm10Seo, maragonMockupSeo, methodologySeo, newsArticleSeo, newsArticleShellName, newsListSeo, NewsSeoInput } from '../utils/routeSeo';
import { publicationTimeMs } from '../utils/newsListOrder';

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

const mediaDir = path.join(dist, 'personalitete-mediatike');
fs.mkdirSync(mediaDir, { recursive: true });
fs.writeFileSync(path.join(mediaDir, 'index.html'), applyOgToIndexHtml(shell, mediaListingOg()));
let mediaWritten = 0;
for (const profile of mediaProfilesData) {
  const slug = (profile.slug || '').trim();
  if (!slug || slug.includes('/') || slug.includes('..')) continue;
  const dir = path.join(mediaDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), applyOgToIndexHtml(shell, mediaProfileOg(profile)));
  mediaWritten += 1;
}

const methodologyDir = path.join(dist, 'metodologjia');
fs.mkdirSync(methodologyDir, { recursive: true });
fs.writeFileSync(path.join(methodologyDir, 'index.html'), applyOgToIndexHtml(shell, methodologySeo()));

const forecastDir = path.join(dist, 'forecast-2027');
fs.mkdirSync(forecastDir, { recursive: true });
fs.writeFileSync(path.join(forecastDir, 'index.html'), applyOgToIndexHtml(shell, forecastSeo()));

const maragonAm10Dir = path.join(dist, 'maragon-am10');
fs.mkdirSync(maragonAm10Dir, { recursive: true });
fs.writeFileSync(path.join(maragonAm10Dir, 'index.html'), applyOgToIndexHtml(shell, maragonAm10Seo()));

const seoDir = path.join(dist, 'seo');
fs.mkdirSync(seoDir, { recursive: true });
fs.writeFileSync(path.join(seoDir, 'news-list.html'), applyOgToIndexHtml(shell, newsListSeo()));
fs.writeFileSync(path.join(seoDir, 'maragon-card-mockup.html'), applyOgToIndexHtml(shell, maragonMockupSeo()));
fs.writeFileSync(path.join(seoDir, 'maragon-analysis.html'), applyOgToIndexHtml(shell, {
  title: 'Analiza MARAGON®',
  description: 'Analiza e figurave mediatike. Vlerësimi publikohet vetëm pas miratimit. Pa vlerësim derisa të miratohet.',
  url: 'https://media.novaric.al/?page=tvPersonalitiesAnalysis',
  image: 'https://novaric.co/wp-content/uploads/2025/07/NOVARIC-Logos_Master-WB-R_12062025_500x500.webp',
  imageAlt: 'Analiza MARAGON®',
  type: 'website',
}));

const newsPath = path.join(root, 'data', 'latestNews.json');
const newsItems = fs.existsSync(newsPath)
  ? JSON.parse(fs.readFileSync(newsPath, 'utf8')) as NewsSeoInput[]
  : [];
const newsDir = path.join(seoDir, 'news');
fs.mkdirSync(newsDir, { recursive: true });
let newsShells = 0;
const sitemapNews: string[] = [];
const sitemapPages: string[] = [
  'https://media.novaric.al/',
  'https://media.novaric.al/?page=newsList',
  'https://media.novaric.al/forecast-2027',
  'https://media.novaric.al/maragon-am10',
  'https://media.novaric.al/figurat-politike',
  'https://media.novaric.al/personalitete-mediatike',
  'https://media.novaric.al/metodologjia',
  ...mediaProfilesData
    .map((profile) => (profile.slug || '').trim())
    .filter((slug) => slug && !slug.includes('/') && !slug.includes('..'))
    .map((slug) => `https://media.novaric.al/personalitete-mediatike/${slug}`),
];
const newestFirst = [...newsItems].sort((a, b) => {
  const ta = publicationTimeMs(a.publishedAt);
  const tb = publicationTimeMs(b.publishedAt);
  if (ta == null && tb == null) return 0;
  if (ta == null) return 1;
  if (tb == null) return -1;
  return tb - ta;
});
const newsCutoff = Date.now() - 48 * 60 * 60 * 1000;
for (const item of newestFirst) {
  const fields = newsArticleSeo(item);
  if (!fields) continue;
  fs.writeFileSync(path.join(newsDir, `${newsArticleShellName(item.id)}.html`), applyOgToIndexHtml(shell, fields));
  newsShells += 1;
  if (sitemapPages.length < 500) sitemapPages.push(fields.url);
  const published = publicationTimeMs(item.publishedAt);
  if (published != null && published >= newsCutoff) {
    sitemapNews.push(
      `  <url><loc>${escapeXml(fields.url)}</loc><news:news><news:publication><news:name>NOVARIC®</news:name><news:language>sq</news:language></news:publication><news:publication_date>${new Date(published).toISOString()}</news:publication_date><news:title>${escapeXml(item.title_sq || item.title || 'Lajm')}</news:title></news:news></url>`,
    );
  }
}

fs.writeFileSync(path.join(dist, 'index.html'), applyOgToIndexHtml(shell, homeSeo()));
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemapXml(sitemapPages));
fs.writeFileSync(path.join(dist, 'sitemap-news.xml'), newsSitemapXml(sitemapNews));

if (!shell.includes('<div id="root">')) {
  throw new Error('SPA root missing from the shell');
}
console.log(`og shells listing=1 profiles=${written} mediaListing=1 mediaProfiles=${mediaWritten} forecast=1 maragonAm10=1 newsList=1 news=${newsShells}`);

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sitemapXml(urls: string[]): string {
  const body = urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function newsSitemapXml(entries: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}
