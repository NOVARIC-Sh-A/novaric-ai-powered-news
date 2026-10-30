export function nerColor(score?: number): string {
  if (score === undefined) return 'text-slate-400';
  if (score >= 85) return 'text-emerald-500';
  if (score >= 70) return 'text-sky-500';
  if (score >= 55) return 'text-amber-500';
  return 'text-rose-500';
}
