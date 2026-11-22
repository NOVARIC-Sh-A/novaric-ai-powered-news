import React from 'react';

export const ALBAN_THIKA_PHOTO = '/authors/alban-thika.jpg';
export const NORA_AI_PHOTO = '/authors/nora-ai.jpg';

export interface AuthorPortrait {
  src: string;
  alt: string;
  objectPosition: string;
}

/** Owner-supplied portraits. Nora stays labelled as a model wherever the name is shown. */
export function authorPortrait(name: string | null | undefined, imageUrl?: string | null): AuthorPortrait | null {
  const label = `${name || ''} ${imageUrl || ''}`;
  if (/thika/i.test(label)) {
    return { src: ALBAN_THIKA_PHOTO, alt: 'Dr. Alban Gj. THIKA', objectPosition: '50% 30%' };
  }
  if (/nora/i.test(label)) {
    return { src: NORA_AI_PHOTO, alt: 'Nora AI', objectPosition: '50% 35%' };
  }
  return null;
}

export const AuthorAvatar: React.FC<{
  name: string;
  imageUrl?: string | null;
  size?: number;
  fill?: boolean;
  className?: string;
}> = ({ name, imageUrl, size = 44, fill = false, className = '' }) => {
  const portrait = authorPortrait(name, imageUrl);
  const src = portrait?.src || imageUrl || '';
  if (!src) return null;
  const rounded = className.includes('rounded-') ? '' : 'rounded-full';
  return (
    <img
      src={src}
      alt={portrait?.alt || name}
      width={fill ? undefined : size}
      height={fill ? undefined : size}
      className={`object-cover ${rounded} ${className}`.trim()}
      style={{
        width: fill ? '100%' : size,
        height: fill ? '100%' : size,
        objectPosition: portrait?.objectPosition || '50% 30%',
      }}
    />
  );
};

export default AuthorAvatar;
