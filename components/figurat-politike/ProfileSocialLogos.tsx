import React from 'react';
import { SocialLinks, SocialPlatform, visibleSocialEntries } from '../../utils/socialLinks';

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  const common = { viewBox: '0 0 24 24', className: 'h-4 w-4', 'aria-hidden': true as const, fill: 'currentColor' };
  switch (platform) {
    case 'facebook':
      return <svg {...common}><path d="M14.5 8H13a1 1 0 0 0-1 1v2h2.6l-.4 2.5H12V20H9.5v-6.5H8V11h1.5V9.2A3.2 3.2 0 0 1 12.8 6H14.5V8z" /></svg>;
    case 'instagram':
      return <svg {...common}><path d="M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zm8 1.8H8A2.2 2.2 0 0 0 5.8 8v8A2.2 2.2 0 0 0 8 18.2h8a2.2 2.2 0 0 0 2.2-2.2V8A2.2 2.2 0 0 0 16 5.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM16.7 6.7a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" /></svg>;
    case 'x':
      return <svg {...common}><path d="M14.7 4h2.2l-4.8 5.5L18 20h-4.4l-3.4-4.5L6.4 20H4.2l5.1-5.9L4 4h4.5l3.1 4.1L14.7 4zm-.8 14.4h1.2L8.1 5.5H6.8l7.1 12.9z" /></svg>;
    case 'tiktok':
      return <svg {...common}><path d="M14 4c.4 2.4 1.8 4 4.2 4.2v2.2c-1.5 0-2.8-.5-4-1.3v6.2a5.3 5.3 0 1 1-5.3-5.3c.3 0 .6 0 .9.1v2.3a3 3 0 1 0 2.1 2.9V4H14z" /></svg>;
    case 'youtube':
      return <svg {...common}><path d="M21 8.2a3 3 0 0 0-2.1-2.1C17.2 5.6 12 5.6 12 5.6s-5.2 0-6.9.5A3 3 0 0 0 3 8.2 31 31 0 0 0 2.6 12 31 31 0 0 0 3 15.8a3 3 0 0 0 2.1 2.1c1.7.5 6.9.5 6.9.5s5.2 0 6.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10.4 15.2V8.8L15.5 12l-5.1 3.2z" /></svg>;
    case 'linkedin':
      return <svg {...common}><path d="M6.5 9H4V20h2.5V9zM5.2 4A1.6 1.6 0 1 0 5.2 7.2 1.6 1.6 0 0 0 5.2 4zM20 20h-2.5v-5.6c0-1.6-.6-2.6-2-2.6a2.2 2.2 0 0 0-2 1.5 2 2 0 0 0-.1.9V20H11V9h2.4v1.5a3.4 3.4 0 0 1 3-1.7c2.2 0 3.6 1.4 3.6 4.5V20z" /></svg>;
    default:
      return <svg {...common}><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm6.7 8.2h-2.4a14 14 0 0 0-1.2-4.4 7.2 7.2 0 0 1 3.6 4.4zM12 4.8a12 12 0 0 1 1.8 6.4h-3.6A12 12 0 0 1 12 4.8zM5.3 11.2a7.2 7.2 0 0 1 3.6-4.4 14 14 0 0 0-1.2 4.4H5.3zm0 1.6h2.4a14 14 0 0 0 1.2 4.4 7.2 7.2 0 0 1-3.6-4.4zm6.7 6.4a12 12 0 0 1-1.8-6.4h3.6a12 12 0 0 1-1.8 6.4zm2.4-1.6a14 14 0 0 0 1.2-4.4h2.4a7.2 7.2 0 0 1-3.6 4.4z" /></svg>;
  }
}

const BRAND: Record<SocialPlatform, string> = {
  facebook: '#1877F2',
  instagram: '#E1306C',
  x: '#111111',
  tiktok: '#111111',
  youtube: '#FF0000',
  linkedin: '#0A66C2',
  website: '#334155',
};

/** Logos for recorded social accounts. Unapproved entries are not links and carry no URL. */
export function ProfileSocialLogos({ links }: { links?: SocialLinks | null }) {
  const entries = visibleSocialEntries(links);
  if (entries.length === 0) return null;
  return (
    <div className="mt-4 flex items-center justify-end gap-2" data-profile-social="true">
      {entries.map((entry) => {
        const icon = (
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: BRAND[entry.platform] }}
          >
            <PlatformIcon platform={entry.platform} />
          </span>
        );
        if (entry.approved && entry.url) {
          return (
            <a
              key={entry.platform}
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={entry.label}
              title={entry.label}
              data-social-platform={entry.platform}
              data-social-approved="true"
            >
              {icon}
            </a>
          );
        }
        return (
          <span
            key={entry.platform}
            role="img"
            aria-label={entry.label}
            title={entry.label}
            data-social-platform={entry.platform}
            data-social-approved="false"
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
}
