import React from 'react';

interface DataPoint {
  year: number;
  [key: string]: number; // Can be 'population', 'rate', etc.
}

interface LineChartProps {
  data: DataPoint[];
  yAxisLabel: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, yAxisLabel }) => {
  if (!data || data.length < 2) {
    return <div className="text-center text-sm text-slate-500">Nuk ka të dhëna të mjaftueshme për grafik.</div>;
  }

  const width = 300;
  const height = 150;
  const padding = { top: 10, right: 10, bottom: 20, left: 40 };

  const yKey = Object.keys(data[0]).find(k => k !== 'year') || 'value';

  const xMin = data[0].year;
  const xMax = data[data.length - 1].year;
  const yMin = 0; // Assuming y-axis starts at 0 for population/rate
  const yMax = Math.max(...data.map(d => d[yKey])) * 1.1; // Add 10% padding

  const getX = (year: number) => {
    return padding.left + ((year - xMin) / (xMax - xMin)) * (width - padding.left - padding.right);
  };

  const getY = (value: number) => {
    return height - padding.bottom - ((value - yMin) / (yMax - yMin)) * (height - padding.top - padding.bottom);
  };
  
  const linePath = data.map(d => `${getX(d.year)},${getY(d[yKey])}`).join(' L ');
  
  const yAxisTicks = [yMin, yMax / 2, yMax].map(tick => ({
      value: Math.round(tick),
      y: getY(tick)
  }));


  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} role="figure" aria-label={`Grafik me vija që tregon ${yAxisLabel} ndër vite`}>
        {/* Y Axis */}
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#d1d5db" strokeWidth="1" />
        {yAxisTicks.map(tick => (
          <g key={tick.value}>
            <text x={padding.left - 5} y={tick.y} textAnchor="end" alignmentBaseline="middle" fontSize="10" fill="#6b7280" className="dark:fill-slate-400">
              {tick.value.toLocaleString('sq-AL', {notation: 'compact'})}
            </text>
            <line x1={padding.left - 2} y1={tick.y} x2={padding.left} y2={tick.y} stroke="#d1d5db" strokeWidth="1" />
          </g>
        ))}

        {/* X Axis */}
        <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#d1d5db" strokeWidth="1" />
        {data.map(d => (
            <g key={d.year}>
                <text x={getX(d.year)} y={height - padding.bottom + 15} textAnchor="middle" fontSize="10" fill="#6b7280" className="dark:fill-slate-400">{d.year}</text>
            </g>
        ))}

        {/* Line Path */}
        <path d={`M ${linePath}`} stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Data Points */}
        {data.map(d => (
            <circle key={d.year} cx={getX(d.year)} cy={getY(d[yKey])} r="3" fill="#3b82f6" stroke="#fff" strokeWidth="1">
                <title>{`${yAxisLabel} in ${d.year}: ${d[yKey].toLocaleString('sq-AL')}`}</title>
            </circle>
        ))}
      </svg>
    </div>
  );
};