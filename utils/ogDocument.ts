/** Static Open Graph tags injected into a copy of index.html at build time. */

import { formatPersonName } from './formatPersonName';

export const OG_SITE = 'https://media.novaric.al';
export const LISTING_PATH = '/figurat-politike';
export const LISTING_TITLE = 'Figurat Politike';
export const LISTING_DESCRIPTION = 'Profilet e figurave politike shqiptare · PARAGON®';
export const LISTING_IMAGE = `${OG_SITE}/og/figurat-politike.png`;

export interface OgFields {
  title: string;
  description: string;
  url: string;
  image: string;
  imageAlt: string;
  type?: 'website' | 'article';
  jsonLd?: unknown;
  robots?: string;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function listingOg(): OgFields {
  return {
    title: LISTING_TITLE,
    description: LISTING_DESCRIPTION,
    url: `${OG_SITE}${LISTING_PATH}`,
    image: LISTING_IMAGE,
    imageAlt: LISTING_TITLE,
  };
}

export function profileOg(profile: { name?: string | null; slug?: string | null; primaryRole?: string | null }): OgFields {
  const name = formatPersonName(profile.name) || 'Profil politik';
  const role = (profile.primaryRole || '').trim();
  const description = role
    ? `${name}. ${role}.`
    : `${name}. Profil në Figurat Politike.`;
  const slug = (profile.slug || '').trim();
  return {
    title: name,
    description,
    url: `${OG_SITE}${LISTING_PATH}/${slug}`,
    image: `${OG_SITE}/og/profiles/${slug}.png`,
    imageAlt: name,
  };
}

export function ogMetaBlock(fields: OgFields): string {
  const title = escapeHtml(fields.title);
  const documentTitle = fields.title.includes('NOVARIC® Lajme me IA')
    ? title
    : `${title} | NOVARIC® Lajme me IA`;
  const description = escapeHtml(fields.description);
  const url = escapeHtml(fields.url);
  const image = escapeHtml(fields.image);
  const imageAlt = escapeHtml(fields.imageAlt);
  const type = fields.type || 'website';
  const lines = [
    `<title>${documentTitle}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="sq" href="${url}" />`,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
    `<meta property="og:locale" content="sq_AL" />`,
    `<meta property="og:site_name" content="NOVARIC® Lajme me IA" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@novaricmedia" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${imageAlt}" />`,
  ];
  if (fields.robots) {
    lines.push(`<meta name="robots" content="${escapeHtml(fields.robots)}" />`);
  }
  if (fields.jsonLd) {
    const json = JSON.stringify(fields.jsonLd).replace(/</g, '\\u003c');
    lines.push(`<script type="application/ld+json" data-novaric-seo="1">${json}</script>`);
  }
  return lines.join('\n  ');
}

/** Replace the shell title and canonical link. The SPA scripts stay in place. */
export function applyOgToIndexHtml(html: string, fields: OgFields): string {
  const stripped = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<link rel="canonical"[^>]*>/gi, '')
    .replace(/<link rel="alternate" hreflang="[^"]+"[^>]*>/gi, '')
    .replace(/<meta\s+name="description"[^>]*>/gi, '')
    .replace(/<meta\s+property="og:[^"]+"[^>]*>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]+"[^>]*>/gi, '')
    .replace(/<script type="application\/ld\+json" data-novaric-seo="1">[\s\S]*?<\/script>/gi, '');
  const block = ogMetaBlock(fields);
  if (!stripped.includes('<meta charset="UTF-8">')) {
    throw new Error('index.html is missing the charset marker');
  }
  return stripped.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">\n  ${block}`);
}
