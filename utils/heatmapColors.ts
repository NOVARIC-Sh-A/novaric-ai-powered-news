
export function getHeatColor(score: number): string {
  if (score >= 85) return "bg-green-600 text-white";
  if (score >= 70) return "bg-green-400 text-black";
  if (score >= 55) return "bg-yellow-300 text-black";
  if (score >= 40) return "bg-orange-400 text-white";
  return "bg-red-600 text-white";
}

export function getHeatBorder(score: number): string {
  if (score >= 85) return "border-green-700";
  if (score >= 70) return "border-green-500";
  if (score >= 55) return "border-yellow-500";
  if (score >= 40) return "border-orange-600";
  return "border-red-700";
}
