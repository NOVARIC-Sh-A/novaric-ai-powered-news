
export const timeDecay = (ageInDays: number, lambdaPerYear = 0.35) =>
  Math.exp(-lambdaPerYear * (ageInDays / 365));

export const minmax = (x: number, min: number, max: number) =>
  max === min ? 50 : Math.max(0, Math.min(100, ((x - min) / (max - min)) * 100));

export function thresholdScore(x: number, bands: Array<{ lte: number; score: number }>) {
  for (const b of bands) if (x <= b.lte) return b.score;
  return bands[bands.length - 1]?.score ?? 0;
}

export function reliabilityWeightedMean(xs: number[], ws: number[]) {
  const wsum = ws.reduce((a,b) => a+b, 0) || 1;
  const val  = xs.reduce((a,x,i)=> a + x*(ws[i]??0), 0) / wsum;
  return { value: val, quality: wsum/ xs.length >= 0.8 ? "high" : wsum/ xs.length >= 0.5 ? "medium" : "low" as const };
}
