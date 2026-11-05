/** Public social-link shape. Unapproved entries must not carry a URL. */

export const SOCIAL_PLATFORMS = ['facebook', 'instagram', 'x', 'tiktok', 'youtube', 'linkedin', 'website'] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export interface SocialLinkPublic {
  approved: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
  /** Included only when approved is true. */
  url?: string;
}

export type SocialLinks = Partial<Record<SocialPlatform, SocialLinkPublic>>;

export interface SocialLinkEditorial extends SocialLinkPublic {
  url: string;
  source: string;
  verifiedAt: string;
}

export const SOCIAL_PLATFORM_LABEL: Record<SocialPlatform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  x: 'X',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  website: 'Website',
};

const PENDING_LABEL = 'Në pritje të miratimit zyrtar';

export function socialPendingLabel(platform: SocialPlatform): string {
  return `${SOCIAL_PLATFORM_LABEL[platform]} – ${PENDING_LABEL}`;
}

/** Drop any URL that has not been approved, so it cannot be rendered or shipped on the profile object. */
export function sanitizeSocialLinks(value: unknown): SocialLinks | null {
  if (!value || typeof value !== 'object') return null;
  const source = value as Record<string, unknown>;
  const out: SocialLinks = {};
  let count = 0;
  for (const platform of SOCIAL_PLATFORMS) {
    const raw = source[platform];
    if (!raw || typeof raw !== 'object') continue;
    const entry = raw as Record<string, unknown>;
    const approved = entry.approved === true;
    const url = typeof entry.url === 'string' ? entry.url.trim() : '';
    const record: SocialLinkPublic = {
      approved,
      approvedBy: typeof entry.approvedBy === 'string' && entry.approvedBy ? entry.approvedBy : null,
      approvedAt: typeof entry.approvedAt === 'string' && entry.approvedAt ? entry.approvedAt : null,
    };
    if (approved && /^https:\/\//i.test(url)) record.url = url;
    out[platform] = record;
    count += 1;
  }
  return count > 0 ? out : null;
}

/** What the details card is allowed to draw. Unapproved entries have no URL. */
export function visibleSocialEntries(links: SocialLinks | null | undefined): Array<{
  platform: SocialPlatform;
  label: string;
  approved: boolean;
  url: string | null;
}> {
  const clean = sanitizeSocialLinks(links);
  if (!clean) return [];
  return SOCIAL_PLATFORMS.flatMap((platform) => {
    const entry = clean[platform];
    if (!entry) return [];
    const approved = entry.approved === true && typeof entry.url === 'string';
    return [{
      platform,
      label: approved ? SOCIAL_PLATFORM_LABEL[platform] : socialPendingLabel(platform),
      approved,
      url: approved ? entry.url ?? null : null,
    }];
  });
}
