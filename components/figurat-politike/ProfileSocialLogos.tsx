import React from 'react';
import { ProfileLogoPlatform, SocialLinks, profileSocialLogos } from '../../utils/socialLinks';

function PlatformIcon({ platform }: { platform: ProfileLogoPlatform }) {
  const common = { viewBox: '0 0 24 24', className: 'h-4 w-4', 'aria-hidden': true as const, fill: 'currentColor' };
  switch (platform) {
    case 'facebook':
      return <svg {...common}><path d="M14.5 8H13a1 1 0 0 0-1 1v2h2.6l-.4 2.5H12V20H9.5v-6.5H8V11h1.5V9.2A3.2 3.2 0 0 1 12.8 6H14.5V8z" /></svg>;
    case 'x':
      return <svg {...common}><path d="M14.7 4h2.2l-4.8 5.5L18 20h-4.4l-3.4-4.5L6.4 20H4.2l5.1-5.9L4 4h4.5l3.1 4.1L14.7 4zm-.8 14.4h1.2L8.1 5.5H6.8l7.1 12.9z" /></svg>;
    case 'whatsapp':
      return <svg {...common}><path d="M12 4.2A7.3 7.3 0 0 0 6 15.6L5 19.2l3.7-1a7.3 7.3 0 1 0 3.3-14zM12 17.6a5.6 5.6 0 0 1-2.9-.8l-.2-.1-2.2.6.6-2.1-.1-.2a5.6 5.6 0 1 1 4.8 2.6zm3.1-4.2c-.2-.1-1-.5-1.2-.5s-.3 0-.4.2-.5.5-.6.7-.2.1-.4 0a4.6 4.6 0 0 1-1.4-.8 5 5 0 0 1-.9-1.2c-.1-.2 0-.3.1-.4l.3-.3.1-.2c0-.1 0-.2 0-.3s-.4-1.1-.6-1.5-.3-.3-.4-.3h-.4c-.1 0-.3.1-.5.3a1.6 1.6 0 0 0-.5 1.2 2.8 2.8 0 0 0 .6 1.5 6.4 6.4 0 0 0 2.5 2.2c.3.1.6.2.8.2a1.4 1.4 0 0 0 1-.4 1.2 1.2 0 0 0 .2-.8c0-.1-.1-.2-.3-.2z" /></svg>;
    case 'linkedin':
      return <svg {...common}><path d="M6.5 9H4V20h2.5V9zM5.2 4A1.6 1.6 0 1 0 5.2 7.2 1.6 1.6 0 0 0 5.2 4zM20 20h-2.5v-5.6c0-1.6-.6-2.6-2-2.6a2.2 2.2 0 0 0-2 1.5 2 2 0 0 0-.1.9V20H11V9h2.4v1.5a3.4 3.4 0 0 1 3-1.7c2.2 0 3.6 1.4 3.6 4.5V20z" /></svg>;
    default:
      return <svg {...common}><path d="M20.5 5.2 3.8 11.1c-.9.3-.9 1.6.1 1.9l4.2 1.3 1.6 4.9c.3.9 1.5 1.1 2.1.3l2.3-2.9 4.3 3.2c.7.5 1.7.1 1.9-.8l2.6-12.2c.2-.9-.7-1.7-1.4-1.6zM9.2 13.6l8.4-5.3-6.6 6.5-.2 2.4-1.6-3.6z" /></svg>;
  }
}

const BRAND: Record<ProfileLogoPlatform, string> = {
  facebook: '#1877F2',
  x: '#111111',
  whatsapp: '#25D366',
  linkedin: '#0A66C2',
  telegram: '#26A5E4',
};

/** Five platform logos. Confirmed accounts are full colour; the rest are muted links to the platform homepage. */
export function ProfileSocialLogos({ name, links }: { name: string; links?: SocialLinks | null }) {
  const entries = profileSocialLogos(name, links);
  return (
    <div className="flex items-center justify-end gap-2" data-profile-social="true">
      {entries.map((entry) => (
        <a
          key={entry.platform}
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={entry.label}
          title={entry.label}
          data-social-platform={entry.platform}
          data-social-confirmed={entry.confirmed ? 'true' : 'false'}
          className={entry.confirmed ? '' : 'opacity-45 grayscale'}
        >
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: entry.confirmed ? BRAND[entry.platform] : '#64748b' }}
          >
            <PlatformIcon platform={entry.platform} />
          </span>
        </a>
      ))}
    </div>
  );
}
