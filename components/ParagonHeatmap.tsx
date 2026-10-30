
import React from 'react';

interface ParagonHeatmapProps {
  data: {
    mp: string;
    scores: number[];
  }[];
  dimensions: string[];
}

const getHeatmapStyle = (score: number, minScore: number = 50, maxScore: number = 90): React.CSSProperties => {
  const normalizedScore = Math.max(minScore, Math.min(maxScore, score));
  const ratio = (normalizedScore - minScore) / (maxScore - minScore);
  
  // Interpolate hue from red (0) to yellow (60) to green (120)
  const hue = ratio * 120;
  
  // Interpolate lightness. Make it lighter in the middle (yellow)
  let lightness;
  if (ratio <= 0.5) { // From score 50 to 70
    lightness = 70 + ratio * 2 * 10; // 70% -> 80%
  } else { // From score 70 to 90
    lightness = 80 - (ratio - 0.5) * 2 * 45; // 80% -> 35%
  }
  
  const textColor = lightness > 65 ? '#1f2937' : '#ffffff';

  return {
    backgroundColor: `hsl(${hue}, 80%, ${lightness}%)`,
    color: textColor,
    textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
  };
};

export const ParagonHeatmap: React.FC<ParagonHeatmapProps> = ({ data, dimensions }) => {
    const minScore = 50;
    const maxScore = 90;

    const legendStops = Array.from({ length: 9 }, (_, i) => minScore + i * 5); // 50, 55, ..., 90

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full overflow-x-auto">
                <table className="min-w-full border-collapse border border-slate-400 dark:border-slate-600">
                    <thead>
                        <tr>
                            <th className="p-2 border-b-2 border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 w-24"></th>
                            {dimensions.map(dim => (
                                <th key={dim} className="p-2 border-b-2 border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 h-40 align-bottom">
                                   <div className="transform -rotate-45 origin-bottom-left whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-300 w-[150px] -translate-x-4">
                                       {dim}
                                   </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(({ mp, scores }) => (
                            <tr key={mp}>
                                <td className="p-2 border border-slate-300 dark:border-slate-600 font-semibold text-slate-700 dark:text-slate-300 text-right">{mp}</td>
                                {scores.map((score, index) => (
                                    <td key={index} className="p-2 border border-slate-300 dark:border-slate-600 text-center font-bold text-base" style={getHeatmapStyle(score, minScore, maxScore)}>
                                        {score}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex items-center justify-center space-x-1 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-inner">
                <span className="text-sm mr-2 font-medium">50</span>
                <div className="flex h-5 rounded overflow-hidden border border-slate-300 dark:border-slate-600">
                {legendStops.map(stop => (
                    <div key={stop} style={{ backgroundColor: getHeatmapStyle(stop, minScore, maxScore).backgroundColor, width: '1.75rem' }} title={`${stop}`}></div>
                ))}
                </div>
                 <span className="text-sm ml-2 font-medium">90</span>
            </div>
        </div>
    );
};
