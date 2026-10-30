// utils/fuzzyMatching.ts

/**
 * Remove Albanian/European diacritics → basic ASCII.
 */
export function normalizeName(name: string): string {
  return (name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .toLowerCase();
}

/**
 * Compute similarity score using Jaccard similarity for word sets.
 * Returns value 0 → 1.
 */
export function similarity(a: string, b: string): number {
  const A = new Set(normalizeName(a).split(/\s+/));
  const B = new Set(normalizeName(b).split(/\s+/));

  const intersection = new Set([...A].filter((x) => B.has(x)));
  const union = new Set([...A, ...B]);

  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Attempts to find the profile in a fuzzy but safe manner.
 * Matching priority:
 *   1. Exact ID match
 *   2. Exact normalized name match
 *   3. Strong fuzzy name match (≥ 0.75)
 *   4. Last-name-only match
 */
export function fuzzyFindProfile(
  profiles: any[],
  target: { profileId?: string; name: string }
): any | null {
  const { profileId, name } = target;

  const normTarget = normalizeName(name);

  // ------------------------------------------------------------
  // 1. Exact ID match
  // ------------------------------------------------------------
  if (profileId) {
    const matchById = profiles.find((p) => String(p.id) === String(profileId));
    if (matchById) return matchById;
  }

  // ------------------------------------------------------------
  // 2. Exact normalized name match
  // ------------------------------------------------------------
  const matchByExactName = profiles.find(
    (p) => normalizeName(p.name) === normTarget
  );
  if (matchByExactName) return matchByExactName;

  // ------------------------------------------------------------
  // 3. Strong fuzzy name match (threshold = 0.75)
  // ------------------------------------------------------------
  const threshold = 0.75;
  let bestMatch = null;
  let bestScore = 0;

  profiles.forEach((p) => {
    const score = similarity(name, p.name);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = p;
    }
  });

  if (bestScore >= threshold) return bestMatch;

  // ------------------------------------------------------------
  // 4. Fallback: last-name-only match
  // ------------------------------------------------------------
  const lastName = normTarget.split(" ").pop();
  if (lastName) {
    const lastNameMatch = profiles.find((p) =>
      normalizeName(p.name).endsWith(lastName)
    );
    if (lastNameMatch) return lastNameMatch;
  }

  // ------------------------------------------------------------
  // No match found
  // ------------------------------------------------------------
  return null;
}
