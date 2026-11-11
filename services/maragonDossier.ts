import { maragonPreviewFromEnv, notAssessedLabel, type MaragonLanguage } from '../utils/maragonPublication';
import type { MaragonResearchPayload } from '../lib/maragon-schemas';

export type { MaragonResearchPayload };

/**
 * Loads the research dossier only for a dev preview.
 * The dynamic import sits in a DEV branch so the production bundle does not include the draft.
 */
export async function loadMaragonPreview(id: string | number | null | undefined): Promise<MaragonResearchPayload | null> {
  if (!import.meta.env.DEV) return null;
  if (id == null) return null;
  const mod = await import('./maragonResearchLoader');
  return mod.getMaragonResearch(id);
}

/** True only in a Vite dev build when the page asks for the local dossier preview. */
export function isMaragonPreviewActive(search?: string): boolean {
  const dev = import.meta.env.DEV;
  const query = search ?? (typeof window !== 'undefined' ? window.location.search : '');
  return maragonPreviewFromEnv(dev, query);
}

export function indicatorChipLabel(status: string, lang: MaragonLanguage): string {
  if (status === 'assessed' || status === 'assessed-qualitative') {
    return lang === 'en' ? 'Assessed' : 'Vlerësuar';
  }
  if (status === 'insufficient_evidence') {
    return lang === 'en' ? 'Insufficient evidence' : 'Provë e pamjaftueshme';
  }
  if (status === 'not_applicable') {
    return lang === 'en' ? 'Not applicable' : 'Nuk zbatohet';
  }
  return notAssessedLabel(lang);
}

export function textForLang(lang: MaragonLanguage, sq: string, en: string): string {
  return lang === 'en' ? en : sq;
}
