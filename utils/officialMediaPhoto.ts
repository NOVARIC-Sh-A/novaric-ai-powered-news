// utils/officialMediaPhoto.ts
// MARAGON® media-personality photos follow the same rule as PARAGON® politician photos
// (utils/officialPhoto.ts in the repo, photo audit 31.10.2026): a photo is shown only when it comes
// from an OFFICIAL channel of the person — the broadcaster's programme page or press article, an
// employer / institution / agency profile, or the person's own company site — and the source is
// recorded (pageUrl, publisher, credit, retrievedAt). NOVARIC® copies (novaricstorage, media.novaric.al,
// novaric.co), third-party news sites, stock and AI images are never shown: the UI shows the
// "Foto në pritje" silhouette instead. Fails closed: any doubt means no photo.
//
// Exception, owner approval 22 Nov 2026: the 24 standardised portraits copied into
// /media-personalities/portraits/<slug>-450x600.jpg. Only those relative same-origin paths are
// allowed. media.novaric.al stays forbidden. The exception does not extend to any other host,
// directory, or filename. Withheld ids and tvklan.al are bypassed only for these local files.

/** Official sites (broadcasters, institutions) whose own uploads may be hot-linked. */
export const OFFICIAL_MEDIA_PHOTO_HOSTS = [
  'tvklan.al',
  'top-channel.tv',
  'vizionplus.tv',
  'abcnews.al',
  'rtsh.al',
  'fshf.org',
  'atlanticcouncil.org',
  'adagio-artists.com',
  'anabel.io',
  'upload.wikimedia.org',
];

/** Generic CDNs: allowed only when the recorded page is on an official host above. */
export const OFFICIAL_MEDIA_CDN_HOSTS = ['static.wixstatic.com', 'img.youtube.com', 'i.ytimg.com'];

/** Never shown (same list as FORBIDDEN_PHOTO_HOSTS in the repo's ingestion/image_mirror.py). */
export const FORBIDDEN_MEDIA_PHOTO_HOSTS = ['media.novaric.al', 'novaric.co', 'novaricstorage.blob.core.windows.net'];

export const OFFICIAL_MEDIA_PHOTO_STATUS = 'Foto zyrtare / Official photo';
export const AWAITING_MEDIA_PHOTO_STATUS = 'Foto në pritje / Photo pending';

/** Credit recorded on the 24 owner-supplied portraits. The original source is still to be recorded. */
export const OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT = 'Owner-supplied, 22 Nov 2026 (source to be recorded)';
export const OWNER_SUPPLIED_MEDIA_PORTRAIT_POSITION = '50% 30%';

/** Slugs approved with the 22 Nov 2026 portrait set. Anything else under the directory stays hidden. */
export const OWNER_SUPPLIED_MEDIA_PORTRAIT_SLUGS = new Set([
  'blendi-fevziu',
  'grida-duma',
  'ardit-gjebrea',
  'sokol-balla',
  'eni-vasili',
  'inva-mula',
  'ermal-mamaqi',
  'alketa-vejsiu',
  'arian-cani',
  'arbana-osmani',
  'adi-krasta',
  'sonila-meco',
  'marin-mema',
  'blendi-salaj',
  'enkel-demi',
  'armina-mevlani',
  'bledi-mane',
  'mustafa-nano',
  'ermal-peci',
  'ilva-tare',
  'dalina-buzi',
  'ledion-lico',
  'dritan-shakohoxha',
  'ylli-rakipi',
]);

const OWNER_PORTRAIT_PATH = /^\/media-personalities\/portraits\/([a-z0-9]+(?:-[a-z0-9]+)*)-450x600\.jpg$/;

export interface OfficialMediaPhotoSource {
  sourceUrl: string;
  pageUrl: string;
  publisher: string;
  channelType: 'broadcaster_programme_page' | 'broadcaster_press_article' | 'institutional_profile' | 'own_company_site' | 'verified_social' | 'owner_supplied';
  credit: string;
  licence: string;
  retrievedAt: string;
}

function hostOf(url: unknown): string | null {
  if (typeof url !== 'string' || url.trim() === '') return null;
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return null;
    return u.hostname.toLowerCase();
  } catch {
    return null;
  }
}

const matches = (host: string, list: string[]) => list.some((h) => host === h || host.endsWith(`.${h}`));

/** The slug when `url` is one of the 24 local portraits, otherwise null. */
export function ownerSuppliedMediaPortraitSlug(url: unknown): string | null {
  if (typeof url !== 'string' || url !== url.trim()) return null;
  if (!url.startsWith('/') || url.startsWith('//')) return null;
  if (url.includes('\\') || url.includes('..') || url.includes('%') || url.includes('?') || url.includes('#')) return null;
  const match = OWNER_PORTRAIT_PATH.exec(url);
  if (!match || !OWNER_SUPPLIED_MEDIA_PORTRAIT_SLUGS.has(match[1])) return null;
  return match[1];
}

export function isOwnerSuppliedMediaPortrait(url: unknown): boolean {
  return ownerSuppliedMediaPortraitSlug(url) !== null;
}

/** 225×300 alongside 450×600. Undefined unless `url` is an allowlisted portrait. */
export function ownerSuppliedMediaPortraitSrcSet(url: unknown): string | undefined {
  const slug = ownerSuppliedMediaPortraitSlug(url);
  if (!slug) return undefined;
  const large = `/media-personalities/portraits/${slug}-450x600.jpg`;
  const small = `/media-personalities/portraits/${slug}-225x300.jpg`;
  return `${small} 225w, ${large} 450w`;
}

export function isOfficialMediaHost(url: unknown): boolean {
  const h = hostOf(url);
  return !!h && !matches(h, FORBIDDEN_MEDIA_PHOTO_HOSTS) && matches(h, OFFICIAL_MEDIA_PHOTO_HOSTS);
}

/** True when `imageUrl` may be displayed for this recorded official source. */
export function isOfficialMediaPhoto(imageUrl: unknown, source: Partial<OfficialMediaPhotoSource> | null | undefined): boolean {
  if (isOwnerSuppliedMediaPortrait(imageUrl)) {
    return !!source && !!source.credit && source.credit.trim() !== '' && source.sourceUrl === imageUrl;
  }
  const h = hostOf(imageUrl);
  if (!h || matches(h, FORBIDDEN_MEDIA_PHOTO_HOSTS)) return false;
  if (!source || !source.pageUrl || !source.credit || source.sourceUrl !== imageUrl) return false;
  if (!isOfficialMediaHost(source.pageUrl)) return false;
  if (matches(h, OFFICIAL_MEDIA_PHOTO_HOSTS)) return true;
  return matches(h, OFFICIAL_MEDIA_CDN_HOSTS);
}

/** The photo to show, or null (silhouette). */
export function resolveOfficialMediaPhoto(photo: {
  imageUrl?: string | null;
  photoPending?: boolean;
  officialSource?: Partial<OfficialMediaPhotoSource> | null;
  objectPosition?: string | null;
} | null | undefined): { url: string; credit: string; objectPosition: string } | null {
  if (!photo || photo.photoPending || !photo.imageUrl) return null;
  if (!isOfficialMediaPhoto(photo.imageUrl, photo.officialSource)) return null;
  return {
    url: photo.imageUrl,
    credit: String(photo.officialSource?.credit || ''),
    objectPosition: isOwnerSuppliedMediaPortrait(photo.imageUrl)
      ? OWNER_SUPPLIED_MEDIA_PORTRAIT_POSITION
      : (photo.objectPosition || '50% 25%'),
  };
}

/**
 * TV Klan files have no documented reuse basis yet.
 * The four flagged frames stay hidden until the owner confirms them.
 * Owner-supplied local portraits are the only bypass.
 */
export const WITHHELD_MEDIA_PHOTO_IDS = new Set([
  'vip_m1',
  'vip_m5',
  'vip_m12',
  'vip_m13',
  'vip_m14',
  'vip_m9',
  'vip_m19',
  'vip_m26',
  'vip_m32',
]);

export function mediaPhotoHostIsWithheld(url: unknown): boolean {
  const host = hostOf(url);
  return !!host && (host === 'tvklan.al' || host.endsWith('.tvklan.al'));
}

/** Public portrait, or null when the file must stay a silhouette. */
export function resolvePresentableMediaPhoto(photo: {
  imageUrl?: string | null;
  photoPending?: boolean;
  officialSource?: Partial<OfficialMediaPhotoSource> | null;
  objectPosition?: string | null;
  awaitingOwnerConfirmation?: boolean | null;
} | null | undefined, profileId?: string | null): { url: string; credit: string; objectPosition: string } | null {
  if (!photo || photo.awaitingOwnerConfirmation) return null;
  const ownerSupplied = isOwnerSuppliedMediaPortrait(photo.imageUrl);
  if (!ownerSupplied && profileId && WITHHELD_MEDIA_PHOTO_IDS.has(profileId)) return null;
  if (!ownerSupplied && mediaPhotoHostIsWithheld(photo.imageUrl)) return null;
  return resolveOfficialMediaPhoto(photo);
}
