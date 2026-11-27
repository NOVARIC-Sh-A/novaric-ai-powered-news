/**
 * Projects the live MARAGON® scoring file into the public payload.
 * Axis C is dropped. A null draft is "Pa vlerësim", never zero.
 * Numbers are included only when the display mode is 'draft-values'.
 */
import { CANONICAL_MARAGON_INDICATOR_IDS } from '../lib/maragon-schemas';
import { isDraftDisplayApproved } from '../data/maragon/approvals';
import { MARAGON_BAND_LABELS, type MaragonBandKey } from './maragonPublication';
import type { MaragonPublicDisplay } from '../data/maragon/maragonPublicDisplay';

export const DRAFT_VALUE_LABEL = {
  sq: 'DRAFT · me ndihmë IA · pa miratim',
  en: 'DRAFT · AI-assisted · not owner-approved',
} as const;

export const NOT_ASSESSED_BILINGUAL = 'Pa vlerësim / Not assessed';

export interface PublicLiveIndicator {
  id: string;
  code: string;
  band: MaragonBandKey | null;
  labelSq: string;
  labelEn: string;
  /** Omitted when the cell is null, the profile is outside AM-09, or the mode is bands-only. */
  draftValue?: number;
}

export interface PublicLiveProfile {
  id: string;
  name: string;
  composite: null;
  indicators: PublicLiveIndicator[];
}

export interface PublicLiveScoring {
  display: MaragonPublicDisplay;
  profiles: PublicLiveProfile[];
}

const BAND_MATCH: Array<[RegExp, MaragonBandKey]> = [
  [/shumë e dobët|very weak/i, 'shume_e_dobet'],
  [/shumë e fortë|very strong/i, 'shume_e_forte'],
  [/e dobët|\bweak\b/i, 'e_dobet'],
  [/mesatare|moderate/i, 'mesatare'],
  [/e fortë|\bstrong\b/i, 'e_forte'],
];

export function bandKeyFromLabel(label: unknown): MaragonBandKey | null {
  if (typeof label !== 'string' || /pa vlerësim|not assessed/i.test(label)) return null;
  for (const [pattern, key] of BAND_MATCH) {
    if (pattern.test(label)) return key;
  }
  return null;
}

function draftNumber(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return value;
}

interface RawIndicator {
  indicatorId?: string;
  code?: string;
  dimension?: string;
  internalDraftValue?: unknown;
  band?: unknown;
}

interface RawProfile {
  id?: string;
  name?: string;
  indicators?: RawIndicator[];
}

function notAssessed(id: string, code: string): PublicLiveIndicator {
  return { id, code, band: null, labelSq: 'Pa vlerësim', labelEn: 'Not assessed' };
}

function codeFor(id: string, raw?: RawIndicator): string {
  if (raw?.code && raw.code !== 'C') return raw.code;
  return id.replace(/^maragon:/, '');
}

export function projectLiveScoring(raw: unknown, mode: MaragonPublicDisplay): PublicLiveScoring {
  const profiles = Array.isArray((raw as { profiles?: unknown })?.profiles)
    ? ((raw as { profiles: RawProfile[] }).profiles)
    : [];
  const byId = new Map(profiles.filter((profile) => profile?.id).map((profile) => [String(profile.id), profile]));
  const ordered = [...byId.values()].sort((a, b) => String(a.name ?? '').localeCompare(String(b.name ?? ''), 'sq'));
  return {
    display: mode,
    profiles: ordered.map((profile) => {
      const id = String(profile.id);
      const approved = isDraftDisplayApproved(id);
      const source = new Map((profile.indicators ?? [])
        .filter((item) => item && item.dimension !== 'C' && item.indicatorId !== 'maragon:C' && item.code !== 'C')
        .map((item) => [String(item.indicatorId), item]));
      const indicators = CANONICAL_MARAGON_INDICATOR_IDS.map((indicatorId) => {
        const cell = source.get(indicatorId);
        const code = codeFor(indicatorId, cell);
        if (!approved) return notAssessed(indicatorId, code);
        const band = bandKeyFromLabel(cell?.band);
        const value = draftNumber(cell?.internalDraftValue);
        if (!band || value === null) return notAssessed(indicatorId, code);
        const labels = MARAGON_BAND_LABELS[band];
        const row: PublicLiveIndicator = {
          id: indicatorId,
          code,
          band,
          labelSq: labels.sq,
          labelEn: labels.en,
        };
        if (mode === 'draft-values') row.draftValue = value;
        return row;
      });
      return { id, name: String(profile.name ?? id), composite: null, indicators };
    }),
  };
}

const INTERNAL_ONLY = /peerAverage|peerAverages|globalBenchmark|"mean"|meanOfValues|meanOfProfileAxisMeans/;

/** True when a public payload still carries an internal peer average or a non-code digit in bands-only mode. */
export function publicPayloadLeaksPeerAverage(payload: unknown): boolean {
  return INTERNAL_ONLY.test(JSON.stringify(payload));
}

/** Drops every draft number. Used when the public mode is bands-only. */
export function stripDraftNumbers(payload: PublicLiveScoring): PublicLiveScoring {
  return {
    display: 'bands-only',
    profiles: payload.profiles.map((profile) => ({
      ...profile,
      composite: null,
      indicators: profile.indicators.map(({ draftValue: _dropped, ...indicator }) => indicator),
    })),
  };
}

export function publicPayloadHasScoreNumber(payload: unknown): boolean {
  const text = JSON.stringify(payload);
  const withoutCodes = text
    .replace(/"id"\s*:\s*"vip_m\d+"/g, '')
    .replace(/"(?:id|code)"\s*:\s*"(?:maragon:|ind:)?[A-Z]\d(?:\.\d+)?(?:-[A-Z]+)?"/g, '');
  return /\d/.test(withoutCodes);
}
