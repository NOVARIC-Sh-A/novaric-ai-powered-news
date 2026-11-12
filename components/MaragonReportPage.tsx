import React from 'react';
import { MaragonFullReport, MaragonDimensionScores, MaragonIndicatorScore } from '../types';
import GaugeChart from './GaugeChart';
import { useLanguage } from '../contexts/LanguageContext';
import { maragonScoresArePublic, measuredNumber, notAssessedLabel } from '../utils/maragonPublication';

interface MaragonReportPageProps {
  report: MaragonFullReport;
  onBack: () => void;
}

const DimensionScores: React.FC<{ scores: MaragonDimensionScores; title: string }> = ({ scores, title }) => {
    const axes = [
        { key: 'Readiness' as const, label: 'Readiness' },
        { key: 'Aptitude' as const, label: 'Aptitude' },
        { key: 'Governance' as const, label: 'Governance' },
        { key: 'OversightNurturing' as const, label: 'Oversight' },
    ];
    return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
        <h3 className="font-semibold text-center mb-4">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {axes.map((axis) => {
                const value = measuredNumber(scores[axis.key]);
                return value === null ? null : (
                    <div key={axis.key} className="flex flex-col items-center"><GaugeChart value={value} label={axis.label} /></div>
                );
            })}
        </div>
    </div>
    );
};


export const MaragonReportPage: React.FC<MaragonReportPageProps> = ({ report, onBack }) => {
  const { language, toggleLanguage } = useLanguage();
  const lang = language === 'en' ? 'en' : 'sq';
  const unassessed = notAssessedLabel(lang);
  const scoresPublic = maragonScoresArePublic(report);
  const { compositeScore, entityType, entityId, benchmarks, indicatorDetails } = report;
  const composite = scoresPublic ? measuredNumber(compositeScore) : null;

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl space-y-8">
        <div className="flex items-center justify-between">
            <button onClick={onBack} className="text-primary-600 dark:text-primary-400 hover:underline">&larr; Kthehu Pas</button>
            <button type="button" onClick={toggleLanguage} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold dark:border-slate-600">
                <span className={lang === 'sq' ? 'text-primary-600' : 'text-slate-400'}>AL</span>
                <span className="mx-1 text-slate-300">|</span>
                <span className={lang === 'en' ? 'text-primary-600' : 'text-slate-400'}>EN</span>
            </button>
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
                    <span className={`${composite === null ? 'text-xl px-4 text-center' : 'text-7xl'} font-bold text-primary-600 dark:text-primary-400`}>{composite === null ? unassessed : composite}</span>
                </div>
            </div>
          </div>
        </section>

        {scoresPublic ? (
        <>
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
                {Object.entries(indicatorDetails).map(([key, value]) => {
                    const score = measuredNumber((value as MaragonIndicatorScore).score);
                    return (
                    <div key={key} className="flex justify-between text-sm p-2 rounded bg-white dark:bg-slate-800">
                        <span className="font-mono font-semibold">{key}</span>
                        <span>{score === null ? unassessed : `Pikët: ${score}`}</span>
                    </div>
                    );
                })}
            </div>
        </section>
        </>
        ) : (
          <p className="text-center text-lg font-semibold text-slate-700 dark:text-slate-200">{unassessed}</p>
        )}

      </div>
    </main>
  );
};