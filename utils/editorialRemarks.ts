import remarksFile from '../data/editorial/remarks.json';

export interface EditorialEditor {
  name: string;
  title: string;
}

export interface EditorialCriterion {
  name: string;
  score: number | null;
  note?: string | null;
  /** Required before this criterion is shown. Entry-level sources do not replace it. */
  sourceUrl?: string | null;
}

export interface EditorialSource {
  label: string;
  url: string;
}

export interface EditorialRemark {
  profileId: string;
  editor: EditorialEditor;
  date: string;
  remarksSq?: string | null;
  remarksEn?: string | null;
  editorialScore?: number | null;
  criteria?: EditorialCriterion[];
  sources?: EditorialSource[];
  status: 'draft' | 'published';
}

export interface VisibleCriterion {
  name: string;
  score: number | null;
  note: string;
  sourceUrl: string;
}

export interface VisibleRemark {
  profileId: string;
  editor: EditorialEditor;
  date: string;
  remarksSq: string;
  remarksEn: string;
  editorialScore: number | null;
  criteria: VisibleCriterion[];
  sources: EditorialSource[];
}

const CITED_URL = /^https?:\/\/\S+$/i;

export function isCitedUrl(value: unknown): value is string {
  return typeof value === 'string' && CITED_URL.test(value.trim());
}

function boundedScore(value: unknown): number | null {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0 || value > 100) return null;
  return value;
}

/** Published text and scores that lack a cited URL are dropped. */
export function visibleRemark(raw: EditorialRemark | null | undefined): VisibleRemark | null {
  if (!raw || raw.status !== 'published') return null;
  if (!raw.editor || typeof raw.editor.name !== 'string' || !raw.editor.name.trim()) return null;
  if (typeof raw.profileId !== 'string' || !raw.profileId.trim()) return null;

  const sources = (Array.isArray(raw.sources) ? raw.sources : []).flatMap((source) => {
    if (!source || typeof source.label !== 'string' || !source.label.trim() || !isCitedUrl(source.url)) return [];
    return [{ label: source.label.trim(), url: source.url.trim() }];
  });

  const criteria = (Array.isArray(raw.criteria) ? raw.criteria : []).flatMap((criterion) => {
    if (!criterion || typeof criterion.name !== 'string' || !criterion.name.trim()) return [];
    if (!isCitedUrl(criterion.sourceUrl)) return [];
    return [{
      name: criterion.name.trim(),
      score: boundedScore(criterion.score),
      note: typeof criterion.note === 'string' ? criterion.note.trim() : '',
      sourceUrl: criterion.sourceUrl.trim(),
    }];
  });

  if (sources.length === 0 && criteria.length === 0) return null;

  return {
    profileId: raw.profileId.trim(),
    editor: {
      name: raw.editor.name.trim(),
      title: typeof raw.editor.title === 'string' ? raw.editor.title.trim() : '',
    },
    date: typeof raw.date === 'string' ? raw.date.trim() : '',
    remarksSq: typeof raw.remarksSq === 'string' ? raw.remarksSq.trim() : '',
    remarksEn: typeof raw.remarksEn === 'string' ? raw.remarksEn.trim() : '',
    editorialScore: boundedScore(raw.editorialScore),
    criteria,
    sources,
  };
}

export function profileIdKeys(id: unknown): string[] {
  const raw = String(id ?? '').trim();
  if (!raw) return [];
  const bare = raw.toLowerCase().replace(/^vip/, '');
  return Array.from(new Set([raw, raw.toLowerCase(), bare, `vip${bare}`]));
}

export function publishedRemarkFor(
  profileId: unknown,
  remarks: readonly EditorialRemark[] = remarksFile as EditorialRemark[],
): VisibleRemark | null {
  const keys = new Set(profileIdKeys(profileId));
  if (keys.size === 0) return null;
  const matches = remarks
    .filter((remark) => keys.has(String(remark.profileId || '').trim()) || keys.has(String(remark.profileId || '').trim().toLowerCase()))
    .map(visibleRemark)
    .filter((remark): remark is VisibleRemark => remark !== null);
  if (matches.length === 0) return null;
  return matches.sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function countProxyDimensions(dimensions: ReadonlyArray<{ proxy?: boolean; score?: number | null }>): number {
  return dimensions.filter((dimension) => dimension.proxy === true && typeof dimension.score === 'number' && !Number.isNaN(dimension.score)).length;
}

export function hasLimitedEvidence(dimensions: ReadonlyArray<{ proxy?: boolean; score?: number | null }>): boolean {
  return countProxyDimensions(dimensions) >= 2;
}

/** Editorial opinion is never written onto the PARAGON composite. */
export function paragonCompositeUnchanged(composite: number | null, _editorialScore: number | null): number | null {
  return composite;
}
