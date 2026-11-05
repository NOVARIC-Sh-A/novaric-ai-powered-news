import { CANONICAL_URL } from '../config/constants';
import { resolveDisplayPhotoUrl } from './officialPhoto';
import { politicianProfilePath } from './politicianNavigation';

/** Absolute canonical profile URL used by the card share button. */
export function canonicalProfileShareUrl(id: string | number | null | undefined): string {
  return `${CANONICAL_URL.replace(/\/$/, '')}${politicianProfilePath(id)}`;
}

export function profileOpenGraph(profile: {
  name?: string | null;
  primaryRole?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  officialPhotoPath?: string | null;
} | null | undefined): { title: string; description: string; imageUrl?: string } {
  const title = (profile?.name || '').trim() || 'Profil politik';
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
