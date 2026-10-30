import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { FullProfileAnalysis } from '../types';
import { CheckCircleIcon, XCircleIcon, LightBulbIcon } from './icons';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  data: FullProfileAnalysis['performanceAnalysis'];
}

// Map dataset labels to specific colors for consistency
const datasetColors: { [key: string]: { bg: string; border: string } } = {
  'Profili Individual': { bg: 'rgba(220, 38, 38, 0.4)', border: '#DC2626' }, // Red-600
  'Mes. Spektrit Politik Lokal': { bg: 'rgba(59, 130, 246, 0.2)', border: '#3B82F6' }, // Blue-500
  'Mes. e Përgjithshme Lokale': { bg: 'rgba(168, 85, 247, 0.2)', border: '#A855F7' }, // Purple-500
  'Mes. Spektrit Politik në PE': { bg: 'rgba(234, 179, 8, 0.2)', border: '#EAB308' }, // Yellow-500
  'Mes. e Përgjithshme e PE': { bg: 'rgba(107, 114, 128, 0.2)', border: '#6B7280' }, // Gray-500
};

const chartLabels = [
    'Angazhimi & Ekspertiza', 
    'Llogaridhënia', 
    'Përfaqësimi', 
    'Vendosmëria & Ndikimi', 
    'Qeverisja & F. Institucionale', 
    'Kohezioni & Parti-k', 
    'Narrativa & Komunikimi'
];

export const PerformanceAnalysisSection: React.FC<Props> = ({ data }) => {
  const chartData = {
    labels: chartLabels,
    datasets: data.datasets.map(dataset => ({
      label: dataset.label,
      data: dataset.scores,
      backgroundColor: datasetColors[dataset.label]?.bg || 'rgba(0,0,0,0.1)',
      borderColor: datasetColors[dataset.label]?.border || '#000',
      borderWidth: 2,
      pointBackgroundColor: datasetColors[dataset.label]?.border || '#000',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: datasetColors[dataset.label]?.border || '#000'
    })),
  };

  const chartOptions: any = { // Use 'any' to avoid deep type issues with Chart.js options
    scales: {
      r: {
        angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        pointLabels: { 
            font: { size: 12, weight: '500' },
            color: '#4B5563' // Gray-600
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false },
      },
    },
    plugins: {
      legend: { display: false }, // Use custom legend
    },
    maintainAspectRatio: false,
  };

  return (
    <section className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-200">
        Analiza e Performancës PARAGON®
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Side: Chart (spanning 3 columns) */}
        <div className="lg:col-span-3">
            <div className="h-80 sm:h-96 md:h-[450px] flex items-center justify-center">
                <Radar data={chartData} options={chartOptions} />
            </div>
            {/* Custom Legend */}
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-4 text-xs">
                {Object.entries(datasetColors).map(([label, colors]) => (
                    <div key={label} className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.border }}></span>
                        <span className="text-slate-600 dark:text-slate-400">{label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Side: Summary (spanning 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="font-semibold text-lg flex items-center text-green-600">
              <CheckCircleIcon className="w-5 h-5 mr-2" /> Pikat e Forta
            </h3>
            <div className="mt-2 space-y-2">
              {data.strengths.map(item => (
                <div key={item.label} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-md text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg flex items-center text-red-600">
              <XCircleIcon className="w-5 h-5 mr-2" /> Për Përmirësim
            </h3>
             <div className="mt-2 space-y-2">
              {data.weaknesses.map(item => (
                <div key={item.label} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-md text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg flex items-center text-yellow-600">
              <LightBulbIcon className="w-5 h-5 mr-2" /> Rekomandime
            </h3>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
              {data.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};