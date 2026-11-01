/**
 * QUARANTINE. Do not import this module from a page, card, or API response.
 * Name-hash integrity, behaviour, vulnerability and psychological labels were
 * removed from public output. The function remains here so the audit can see
 * the rule that used to run. It is not a measurement.
 */

export function quarantinedNameHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
