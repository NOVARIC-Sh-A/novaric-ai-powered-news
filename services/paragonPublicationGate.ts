import gateFile from '../data/paragon/publication_gate.json';

export const PARAGON_SUSPENSION_NOTICE =
  'Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave.';
export const PARAGON_AUDIT_BANNER = 'PARAGON® — Audit në proces';

export type ParagonAuditState =
  | 'under_review'
  | 'insufficient_coverage'
  | 'verified'
  | 'published';

export interface PublicationGate {
  version?: string;
  authorized?: boolean;
  auditState?: string;
  enabled?: boolean;
  notice?: string;
  banner?: string;
}

const AUDIT_STATES: readonly ParagonAuditState[] = [
  'under_review',
  'insufficient_coverage',
  'verified',
  'published',
];

export function isAuditState(value: unknown): value is ParagonAuditState {
  return typeof value === 'string' && (AUDIT_STATES as readonly string[]).includes(value);
}

/** A number is public only when this gate is explicitly authorized and the audit state is published. */
export function scoresArePublic(gate: PublicationGate | null | undefined, provenancePresent: boolean): boolean {
  if (!gate || gate.authorized !== true) return false;
  if (gate.auditState !== 'published') return false;
  if (gate.enabled === false) return false;
  return provenancePresent === true;
}

export function readBundledGate(): PublicationGate {
  return gateFile as PublicationGate;
}

export function bundledScoresArePublic(provenancePresent: boolean): boolean {
  try {
    return scoresArePublic(readBundledGate(), provenancePresent);
  } catch {
    return false;
  }
}
