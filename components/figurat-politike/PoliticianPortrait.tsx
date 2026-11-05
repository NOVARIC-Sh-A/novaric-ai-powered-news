import React, { useState } from 'react';
import { AwaitingPhoto } from './primitives/awaiting';
import {
  PHOTO_CREDIT_UNVERIFIED,
  PortraitFocalPoint,
  derivedSources,
  objectPositionFor,
} from '../../utils/portraitStandard';
import { formatPersonName } from '../../utils/formatPersonName';

export interface PoliticianPortraitProps {
  politicianId: string | number;
  name: string;
  imageUrl: string | null;
  imageCredit?: string | null;
  imageSourceUrl?: string | null;
  imageLicense?: string | null;
  imageVerifiedAt?: string | null;
  focalPoint?: PortraitFocalPoint | null;
  partyLabel?: string | null;
  size?: 'small' | 'medium' | 'large';
  showCredit?: boolean;
  eager?: boolean;
}

export const PoliticianPortrait: React.FC<PoliticianPortraitProps> = ({
  politicianId,
  name,
  imageUrl,
  imageCredit,
  imageSourceUrl,
  imageLicense,
  imageVerifiedAt,
  focalPoint,
  partyLabel,
  size = 'medium',
  showCredit = false,
  eager = false,
}) => {
  const [useOriginal, setUseOriginal] = useState(false);
  const [failed, setFailed] = useState(false);
  React.useEffect(() => {
    setUseOriginal(false);
    setFailed(false);
  }, [imageUrl, politicianId]);

  const manualFocal = Boolean(focalPoint);
  const derived = imageUrl && !manualFocal && !useOriginal ? derivedSources(politicianId) : null;
  const position = focalPoint
    ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%`
    : objectPositionFor(politicianId, Boolean(derived));
  const credit = imageCredit || PHOTO_CREDIT_UNVERIFIED;
  const src = derived?.src || imageUrl;
  const inset = derived?.inset || null;
  const showImage = Boolean(src) && !failed;

  return (
    <figure className="m-0 w-full" data-politician-portrait={String(politicianId)}>
      <div
        className={`politician-portrait politician-portrait--${size}`}
        style={{ ['--portrait-position' as string]: position }}
      >
        {showImage ? (
          <img
            src={src || undefined}
            srcSet={derived?.srcSet}
            sizes={size === 'small' ? '96px' : size === 'large' ? '280px' : '(max-width: 640px) 45vw, 180px'}
            alt={`Portreti i ${formatPersonName(name) || name}`}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            referrerPolicy="no-referrer"
            style={inset ? {
              position: 'absolute',
              left: `${inset.x * 100}%`,
              top: `${inset.y * 100}%`,
              width: `${inset.width * 100}%`,
              height: `${inset.height * 100}%`,
              objectFit: 'cover',
            } : undefined}
            onError={() => {
              if (derived && imageUrl && imageUrl !== derived.src) {
                setUseOriginal(true);
                return;
              }
              setFailed(true);
            }}
          />
        ) : (
          <AwaitingPhoto />
        )}
      </div>
      {partyLabel ? (
        <div className="mt-1 flex justify-start">
          <span className="px-1.5 py-0.5 rounded font-black text-white tracking-wider uppercase shadow-xs bg-slate-700" style={{ fontSize: '9.5px' }}>
            {partyLabel}
          </span>
        </div>
      ) : null}
      {showCredit ? (
        <figcaption className="mt-1 text-[10px] leading-snug text-slate-500 dark:text-slate-400">
          {imageSourceUrl && imageCredit && imageCredit !== PHOTO_CREDIT_UNVERIFIED ? (
            <a href={imageSourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {credit}
            </a>
          ) : (
            <span>{credit}</span>
          )}
          {imageLicense ? <span className="block">{imageLicense}</span> : null}
          {imageVerifiedAt ? <span className="block">Marrë më {imageVerifiedAt}</span> : null}
        </figcaption>
      ) : (
        <span className="sr-only">{credit}</span>
      )}
    </figure>
  );
};

