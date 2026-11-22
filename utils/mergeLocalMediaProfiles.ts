import type { VipProfile } from '../types';
import { mediaProfilesData } from '../data/mediaProfiles';
import { getPresenterRecord, nameSurnameFromFull } from '../components/maragon/maragonPresenterUi';

function normName(name: string): string {
  return nameSurnameFromFull(name || '').trim().toLocaleLowerCase('sq').replace(/\s+/g, ' ');
}

/**
 * Ensure MARAGON® local media records (vip_m*) are on the profile list, even when
 * the backend returns live profiles. Legacy media ids (vip5, vip9, …) and same-name
 * non-political live rows are dropped so the grid is not duplicated.
 * Politician profiles are never dropped (vip19 Benet Beci is not Blendi SALAJ / vip_m19).
 */
export function mergeLocalMediaProfiles(profiles: VipProfile[] | null | undefined): VipProfile[] {
  const local = mediaProfilesData;
  const superseded = new Set<string>();
  const localNames = new Set<string>();
  for (const p of local) {
    superseded.add(String(p.id));
    const rec = getPresenterRecord(p);
    if (rec?.legacyId) superseded.add(String(rec.legacyId));
    const extra = (p as unknown as { legacyIds?: Array<string | number> }).legacyIds || [];
    for (const x of extra) superseded.add(String(x));
    localNames.add(normName(p.name));
    if (rec) localNames.add(normName(`${rec.givenName} ${rec.familyName}`));
  }
  const kept = (profiles || []).filter((p) => {
    const cat = (p.category || '').toLowerCase();
    // Politician rows are never dropped, even when a media legacyId reuses the same
    // raw id (vip19 Benet Beci is not Blendi SALAJ / vip_m19).
    if (cat.includes('politik')) return true;
    if (superseded.has(String(p.id))) return false;
    return !localNames.has(normName(p.name));
  });
  return [...local, ...kept];
}
