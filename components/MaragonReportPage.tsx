import React from 'react';
import { MaragonFullReport, MaragonDimensionScores, MaragonIndicatorScore } from '../types';
import GaugeChart from './GaugeChart';

interface MaragonReportPageProps {
  report: MaragonFullReport;
  onBack: () => void;
}

const DimensionScores: React.FC<{ scores: MaragonDimensionScores; title: string }> = ({ scores, title }) => (
    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
        <h3 className="font-semibold text-center mb-4">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center"><GaugeChart value={scores.Readiness} label="Readiness" /></div>
            <div className="flex flex-col items-center"><GaugeChart value={scores.Aptitude} label="Aptitude" /></div>
            <div className="flex flex-col items-center"><GaugeChart value={scores.Governance} label="Governance" /></div>
            <div className="flex flex-col items-center"><GaugeChart value={scores.OversightNurturing} label="Oversight" /></div>
        </div>
    </div>
);


export const MaragonReportPage: React.FC<MaragonReportPageProps> = ({ report, onBack }) => {
  const { compositeScore, entityType, entityId, benchmarks, indicatorDetails } = report;

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl space-y-8">
        <div>
            <button onClick={onBack} className="text-primary-600 dark:text-primary-400 hover:underline">&larr; Kthehu Pas</button>
        </div>
        <header className="text-center">
          <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-500">MARAGON® Report</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Analizë e Detajuar për {entityType === 'individual' ? 'Individ' : 'Emision'}: {entityId}</p>
        </header>

        <section>
          <h2 className="text-2xl font-semibold text-center mb-4">Pikët e Përgjithshme</h2>
          <div className="flex justify-center">
            <div className="relative">
                <div className="w-48 h-48 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <span className="text-7xl font-bold text-primary-600 dark:text-primary-400">{compositeScore}</span>
                </div>
            </div>
          </div>
        </section>

        <section>
            <h2 className="text-2xl font-semibold text-center mb-4">Ndarja e Pikëve Sipas Dimensioneve</h2>
            <DimensionScores scores={report} title="Pikët Aktuale" />
        </section>

        <section>
            <h2 className="text-2xl font-semibold text-center mb-4">Krahasimi (Benchmark)</h2>
            <div className="space-y-6">
                <DimensionScores scores={benchmarks.peerAverage} title="Mesatarja e Kolegëve" />
                <DimensionScores scores={benchmarks.standardAdherence} title="Përputhshmëria me Standardin" />
            </div>
        </section>

        <section>
            <h2 className="text-2xl font-semibold text-center mb-4">Detajet e Treguesve</h2>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-2">
                {Object.entries(indicatorDetails).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm p-2 rounded bg-white dark:bg-slate-800">
                        <span className="font-mono font-semibold">{key}</span>
                        {/* FIX: Cast the 'value' to its correct type 'MaragonIndicatorScore' before accessing the 'score' property. This resolves the error where 'value' was being inferred as 'unknown'. */}
                        <span>Pikët: {(value as MaragonIndicatorScore).score}</span>
                    </div>
                ))}
            </div>
        </section>

      </div>
    </main>
  );
};