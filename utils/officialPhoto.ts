// utils/officialPhoto.ts
// Politician photos may only be loaded from an official source (photo audit 2026-10-31):
//   - local copies of Wikimedia Commons files under /politicians/official/
//   - Wikimedia (upload.wikimedia.org)
//   - the Parliament of Albania file store and official Albanian sites (.gov.al etc.)
// NOVARIC copies (media.novaric.al/politicians/*, novaric.co uploads) and generic
// placeholders are never shown; the UI shows the "Awaiting data" silhouette instead.

export const LOCAL_OFFICIAL_PREFIX = '/politicians/official/';

export const OFFICIAL_PHOTO_HOSTS = [
  'kuvendiwebfiles.blob.core.windows.net',
  'parlament.al',
  'kryeministria.al',
  'president.al',
  'upload.wikimedia.org',
];

export function isOfficialPhotoUrl(url: unknown): url is string {
  if (typeof url !== 'string' || url.trim() === '') return false;
  if (url.startsWith(LOCAL_OFFICIAL_PREFIX)) return true;
  let host: string;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    host = parsed.hostname.toLowerCase();
  } catch {
    return false;
  }
  if (host.endsWith('.gov.al')) return true;
  return OFFICIAL_PHOTO_HOSTS.some(h => host === h || host.endsWith(`.${h}`));
}

/** URL to load for a politician photo, or null when there is no official photo. */
export function resolveOfficialPhotoUrl(profile: any): string | null {
  if (!profile) return null;
  const candidates = [
    profile.officialPhotoPath,
    profile.imageUrl,
    profile.image_url,
    profile.photo_url,
  ];
  for (const c of candidates) {
    if (isOfficialPhotoUrl(c)) return c;
  }
  return null;
}
