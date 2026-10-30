
import React from 'react';
// FIX: Corrected import path for types.
import { ChartSegment } from '../types';

interface PieChartProps {
  data: ChartSegment[];
  size: number; // Diameter of the chart
  title?: string; // Optional accessibility title for the chart figure
}

export const PieChart: React.FC<PieChartProps> = ({ data, size, title }) => {
  if (!data || data.length === 0) {
    return <div style={{ width: size, height: size }} className="flex items-center justify-center text-xs text-slate-400">S'ka të dhëna</div>;
  }

  const radius = size / 2;
  let startAngleRad = -Math.PI / 2; // Start at 12 o'clock (top of the circle)

  const totalValue = data.reduce((sum, segment) => sum + segment.value, 0);

  if (totalValue === 0) {
     return <div style={{ width: size, height: size }} className="flex items-center justify-center text-xs text-slate-400">S'ka vlera</div>;
  }

  return (
    <div className="flex flex-col items-center" role="figure" aria-label={title || 'Pie chart'}>
      <svg width={size} height={size} viewBox={`-${radius} -${radius} ${size} ${size}`} aria-hidden="true">
        {data.length === 1 && data[0].value === totalValue ? (
          // Special case: Single segment, full circle
          <g>
            <circle
              cx="0"
              cy="0"
              r={radius}
              fill={data[0].color}
            >
              <title>{`${data[0].name}: ${Math.round(data[0].value)}%`}</title>
            </circle>
            {/* Percentage text rendering logic is removed */}
          </g>
        ) : (
          data.map((segment, index) => {
            if (segment.value <= 0) return null;

            const percent = segment.value / totalValue;
            const arcAngleRad = percent * 2 * Math.PI;
            const endAngleRad = startAngleRad + arcAngleRad;

            // Coordinates for the arc path
            const startX = radius * Math.cos(startAngleRad);
            const startY = radius * Math.sin(startAngleRad);
            const endX = radius * Math.cos(endAngleRad);
            const endY = radius * Math.sin(endAngleRad);

            const largeArcFlag = arcAngleRad > Math.PI ? 1 : 0;

            const pathData = [
              `M 0 0`, // Move to center (for pie slice shape)
              `L ${startX} ${startY}`, // Line to start of arc
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
              `Z` // Close path (back to center)
            ].join(' ');
            
            const currentSegmentRender = (
              <g key={index}> {/* Key on the group element */}
                <path
                  d={pathData}
                  fill={segment.color}
                >
                  <title>{`${segment.name}: ${Math.round(segment.value)}%`}</title>
                </path>
                {/* Percentage text rendering logic is removed */}
              </g>
            );
            startAngleRad = endAngleRad; // Update startAngle for the next segment
            return currentSegmentRender;
          })
        )}
      </svg>
    </div>
  );
};