import vip282 from '../data/profiles/vip282.json';

export const UNVERIFIED_LABEL = 'Në verifikim';

export interface DossierField {
  key: string;
  label: string;
  display: string;
  verified: boolean;
  editorConfirmed?: boolean;
  sourceUrl?: string;
  sourceLabel?: string;
}

export interface DossierEntry {
  date: string;
  text: string;
  sourceUrl?: string;
  sourceLabel?: string;
  verified?: boolean;
  editorConfirmed?: boolean;
  label?: string;
}

export interface DossierMediaItem {
  date: string | null;
  outlet: string;
  title: string;
  url: string;
  summary: string;
}

export interface ProfileDossier {
  id: string;
  slug: string;
  accessed: string;
  fields: DossierField[];
  bio: {
    sq: string;
    en: string;
    sources: Array<{ label: string; url: string }>;
  };
  timeline: DossierEntry[];
  positions: DossierEntry[];
  media: DossierMediaItem[];
  social: {
    x: {
      url: string;
      asOf: string;
      followers: number;
      following: number;
      posts: number;
      joined: string;
      frequency: string;
      themes: string;
      sourceUrl: string;
      recentPosts: Array<{ date: string; text: string; url: string }>;
    };
    profilesOnly: Array<{ label: string; url: string }>;
  };
}

function published(file: typeof vip282): ProfileDossier {
  const { conflicts: _conflicts, ...rest } = file;
  return rest as ProfileDossier;
}

const BY_ID: Record<string, ProfileDossier> = {
  vip282: published(vip282),
};

/** Public view of a profile dossier. Conflict notes stay in the file and are not returned. */
export function profileDossier(id: string | number | null | undefined): ProfileDossier | null {
  if (id == null) return null;
  const key = String(id);
  return BY_ID[key] || BY_ID[`vip${key}`] || null;
}

export function dossierField(dossier: ProfileDossier | null, key: string): DossierField | null {
  return dossier?.fields.find((field) => field.key === key) || null;
}
