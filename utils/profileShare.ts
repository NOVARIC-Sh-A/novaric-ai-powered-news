import { CANONICAL_URL } from '../config/constants';
import { resolveDisplayPhotoUrl } from './officialPhoto';
import { politicianProfilePath } from './politicianNavigation';
import { canonicalMediaKey, mediaProfilePath } from './mediaNavigation';
import { isMediaIdentity } from './maragonPublication';
import { formatPersonName } from './formatPersonName';

/** Absolute canonical profile URL used by the card share button. */
export function canonicalProfileShareUrl(id: string | number | null | undefined): string {
  const origin = CANONICAL_URL.replace(/\/$/, '');
  if (isMediaIdentity(id) || canonicalMediaKey(id)) {
    const mediaPath = mediaProfilePath(id);
    if (mediaPath) return `${origin}${mediaPath}`;
  }
  return `${origin}${politicianProfilePath(id)}`;
}

export function profileOpenGraph(profile: {
  name?: string | null;
  primaryRole?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  officialPhotoPath?: string | null;
} | null | undefined): { title: string; description: string; imageUrl?: string } {
  const title = formatPersonName(profile?.name) || 'Profil politik';
  const role = (profile?.primaryRole || '').trim();
  const photo = profile ? resolveDisplayPhotoUrl(profile) : null;
  let imageUrl: string | undefined;
  if (photo) {
    imageUrl = /^https?:\/\//i.test(photo)
      ? photo
      : `${CANONICAL_URL.replace(/\/$/, '')}${photo.startsWith('/') ? photo : `/${photo}`}`;
  }
  return { title, description: role || title, imageUrl };
}
