import React, { useId } from 'react';
import { AwaitingPhoto } from './maragonPresenterUi';

const PORTRAIT_CSS = `
.media-portrait { position: relative; width: 100%; aspect-ratio: 1 / 1.12; margin: 0; }
.media-portrait__disc { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; aspect-ratio: 1 / 1; border-radius: 50%; background: #30384b; }
.media-portrait--fallback { aspect-ratio: 1 / 1; }
.media-portrait--fallback img, .media-portrait--fallback .media-portrait__fallback-slot { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 50%; object-fit: cover; object-position: var(--portrait-position, 50% 18%); display: block; }
.media-portrait--cutout img { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; object-fit: contain; object-position: center bottom; display: block; }
`;

/**
 * Shared portrait for every MARAGON® media card, profile and comparison.
 * portraitCutout false: plain circle crop on the navy disc.
 * portraitCutout true: head overflows the disc; the bottom follows the circle.
 */
export const MediaPortrait: React.FC<{
  src?: string | null;
  srcSet?: string;
  alt: string;
  portraitCutout?: boolean;
  objectPosition?: string;
  pendingLabel?: string;
}> = ({ src, srcSet, alt, portraitCutout = false, objectPosition = '50% 18%', pendingLabel }) => {
  const clipId = useId().replace(/:/g, '');
  const cutout = portraitCutout === true && Boolean(src);
  return (
    <>
      <style>{PORTRAIT_CSS}</style>
    <figure
      className={`media-portrait ${cutout ? 'media-portrait--cutout' : 'media-portrait--fallback'}`}
      data-media-portrait="true"
      data-portrait-cutout={cutout ? 'true' : 'false'}
      style={{ ['--portrait-position' as string]: objectPosition }}
    >
      <div className="media-portrait__disc" aria-hidden="true" />
      {cutout ? (
        <svg width="0" height="0" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              {/* Box is 1 × 1.12. Disc centre sits at y=0.554, radius 0.5 in x and 0.446 in y (a true circle).
                  The path is a shoulder rectangle down to the equator, then the lower semicircle. */}
              <path d="M0.15,0 H0.85 V0.554 H1 A0.5,0.446 0 0 1 0,0.554 H0.15 Z" />
            </clipPath>
          </defs>
        </svg>
      ) : null}
      {src ? (
        <img
          src={src}
          srcSet={srcSet}
          alt={alt}
          referrerPolicy="no-referrer"
          style={cutout ? { clipPath: `url(#${clipId})` } : undefined}
        />
      ) : (
        <div className="media-portrait__fallback-slot">
          <AwaitingPhoto label={pendingLabel} />
        </div>
      )}
    </figure>
    </>
  );
};
