/** Public social-link shape. An unapproved entry must not carry a personal URL. */

export const SOCIAL_PLATFORMS = ['facebook', 'instagram', 'x', 'tiktok', 'youtube', 'linkedin', 'website', 'whatsapp', 'telegram'] as const;

/** Logos drawn on every profile details card, in this order. */
export const PROFILE_LOGO_PLATFORMS = ['facebook', 'x', 'whatsapp', 'linkedin', 'telegram'] as const;

export type ProfileLogoPlatform = (typeof PROFILE_LOGO_PLATFORMS)[number];

export const PLATFORM_HOME: Record<ProfileLogoPlatform, string> = {
  facebook: 'https://www.facebook.com/',
  x: 'https://x.com/',
  whatsapp: 'https://www.whatsapp.com/',
  linkedin: 'https://www.linkedin.com/',
  telegram: 'https://telegram.org/',
};

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
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
};

export function platformHomeLabel(platform: ProfileLogoPlatform): string {
  return `${SOCIAL_PLATFORM_LABEL[platform]} (faqja kryesore e platformës)`;
}

export function confirmedSocialLabel(name: string, platform: ProfileLogoPlatform): string {
  return `${name} në ${SOCIAL_PLATFORM_LABEL[platform]}`;
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

/**
 * Five logos for every profile. A confirmed account uses its approved URL.
 * Anything else links to the platform homepage. An unapproved personal URL is never returned.
 */
export function profileSocialLogos(name: string, links: SocialLinks | null | undefined): Array<{
  platform: ProfileLogoPlatform;
  label: string;
  confirmed: boolean;
  href: string;
}> {
  const clean = sanitizeSocialLinks(links);
  const person = name.trim() || 'Profili';
  return PROFILE_LOGO_PLATFORMS.map((platform) => {
    const entry = clean?.[platform];
    const personal = entry?.approved === true && typeof entry.url === 'string' ? entry.url : null;
    return {
      platform,
      confirmed: Boolean(personal),
      href: personal || PLATFORM_HOME[platform],
      label: personal ? confirmedSocialLabel(person, platform) : platformHomeLabel(platform),
    };
  });
}
