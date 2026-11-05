import framesFile from '../data/official/portrait_frames.json';
import overridesFile from '../data/official/portrait_focal_overrides.json';
import { resolveDisplayPhotoUrl } from './officialPhoto';

export const PHOTO_CREDIT_UNVERIFIED = 'Burimi i fotografisë: Në verifikim';
export const FALLBACK_OBJECT_POSITION = '50% 30%';

export type AttributionStatus = 'verified' | 'pending' | 'unknown';

export interface PortraitFocalPoint {
  x: number;
  y: number;
}

export interface PortraitInset {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PortraitFrame {
  focalPoint: PortraitFocalPoint;
  uncertain: boolean;
  faceDetected: boolean;
  padded?: boolean;
  inset?: PortraitInset | null;
  crop: { x: number; y: number; width: number; height: number } | null;
  derived300: string | null;
  derived600: string | null;
  editorialOverride: boolean;
  reference?: boolean;
}

export interface PortraitAttribution {
  politicianId: string;
  originalImageUrl: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  photographer: string | null;
  license: string | null;
  copyrightHolder: string | null;
  verifiedAt: string | null;
  attributionStatus: AttributionStatus;
  credit: string;
  licensingIssue: boolean;
}

interface FrameFile {
  frames: Record<string, PortraitFrame>;
}

interface OverrideFile {
  overrides: Record<string, PortraitFocalPoint>;
}

const frames = (framesFile as FrameFile).frames || {};
const overrides = (overridesFile as OverrideFile).overrides || {};

export function publisherFromNotes(notes: string | null | undefined): string | null {
  if (!notes) return null;
  const match = notes.match(/Publisher:\s*([^.\n]+)/);
  return match ? match[1].trim() : null;
}

function parliamentNamedInLicence(licence: string | null | undefined, imageUrl: string | null): string | null {
  if (!licence || !imageUrl) return null;
  if (!/kuvendiwebfiles\.blob\.core\.windows\.net/i.test(imageUrl)) return null;
  if (/Parliament of Albania/i.test(licence)) return 'Kuvendi i Shqipërisë';
  return null;
}

export function creditForSource(sourceName: string): string {
  if (sourceName === 'Kuvendi i Shqipërisë') return 'Foto: Kuvendi i Shqipërisë';
  if (/Komisioni Qendror i Zgjedhjeve|^KQZ$/i.test(sourceName)) {
    return 'Foto: KQZ — Komisioni Qendror i Zgjedhjeve';
  }
  return `Foto: ${sourceName}`;
}

export function licensingIssueFor(licence: string | null | undefined): boolean {
  if (!licence) return true;
  return /no reuse licence|all rights reserved/i.test(licence);
}

/** Reads only fields already stored on the profile. Does not invent a photographer or a licence. */
export function buildPortraitAttribution(profile: any): PortraitAttribution {
  const photo = profile?.fieldSources?.photo || {};
  const imageUrl = resolveDisplayPhotoUrl(profile);
  const sourceUrl = (typeof photo.sourceUrl === 'string' && photo.sourceUrl) || profile?.photo_source_url || null;
  const license = (typeof photo.licence === 'string' && photo.licence) || profile?.photoLicence || null;
  const notes = typeof photo.notes === 'string' ? photo.notes : '';
  const sourceName = publisherFromNotes(notes) || parliamentNamedInLicence(license, imageUrl);
  const base = {
    politicianId: String(profile?.id ?? ''),
    originalImageUrl: imageUrl,
    sourceName,
    sourceUrl: typeof sourceUrl === 'string' ? sourceUrl : null,
    photographer: null,
    license: typeof license === 'string' ? license : null,
    copyrightHolder: null,
    verifiedAt: typeof photo.retrievedAt === 'string' ? photo.retrievedAt : null,
  };

  if (!imageUrl) {
    return {
      ...base,
      attributionStatus: 'unknown',
      credit: PHOTO_CREDIT_UNVERIFIED,
      licensingIssue: false,
    };
  }

  if (!sourceName || !base.sourceUrl) {
    return {
      ...base,
      attributionStatus: 'pending',
      credit: PHOTO_CREDIT_UNVERIFIED,
      licensingIssue: true,
    };
  }

  return {
    ...base,
    attributionStatus: 'verified',
    credit: creditForSource(sourceName),
    licensingIssue: licensingIssueFor(base.license),
  };
}

export function frameFor(politicianId: string | number | null | undefined): PortraitFrame | null {
  if (politicianId == null) return null;
  return frames[String(politicianId)] || null;
}

export function focalOverride(politicianId: string | number | null | undefined): PortraitFocalPoint | null {
  if (politicianId == null) return null;
  return overrides[String(politicianId)] || null;
}

/** CSS object-position. A derived 3:4 file already contains the crop, so it is not shifted again. */
export function objectPositionFor(politicianId: string | number | null | undefined, usingDerivedCrop: boolean): string {
  const override = focalOverride(politicianId);
  if (override && !usingDerivedCrop) {
    return `${override.x * 100}% ${override.y * 100}%`;
  }
  if (usingDerivedCrop) return '50% 50%';
  return FALLBACK_OBJECT_POSITION;
}

export function portraitPropsFromProfile(
  profile: any,
  options: { size?: 'small' | 'medium' | 'large'; showCredit?: boolean; eager?: boolean; partyLabel?: string | null } = {},
) {
  const attribution = buildPortraitAttribution(profile);
  return {
    politicianId: attribution.politicianId || profile?.numericId,
    name: profile?.name || '',
    imageUrl: attribution.originalImageUrl,
    imageCredit: attribution.credit,
    imageSourceUrl: attribution.sourceUrl,
    imageLicense: attribution.license,
    imageVerifiedAt: attribution.attributionStatus === 'verified' ? attribution.verifiedAt : null,
    focalPoint: focalOverride(attribution.politicianId),
    partyLabel: options.partyLabel ?? null,
    size: options.size ?? 'medium',
    showCredit: options.showCredit ?? false,
    eager: options.eager ?? false,
  };
}

export function derivedSources(politicianId: string | number | null | undefined): { src: string; srcSet: string; inset: PortraitInset | null } | null {
  if (focalOverride(politicianId)) return null;
  const frame = frameFor(politicianId);
  if (!frame || frame.reference || frame.uncertain || !frame.faceDetected || !frame.derived300 || !frame.derived600) return null;
  return {
    src: frame.derived600,
    srcSet: `${frame.derived300} 300w, ${frame.derived600} 600w`,
    inset: frame.padded && frame.inset ? frame.inset : null,
  };
}
