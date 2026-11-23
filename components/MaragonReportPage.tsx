import React from 'react';
import { MaragonFullReport, MaragonDimensionScores } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { maragonScoresArePublic, notAssessedLabel } from '../utils/maragonPublication';
import { SIGNED_BENCHMARK_AMENDMENT_IDS } from '../data/maragon/benchmarks';
import { publishedBand, publishedBandFromKey, publicBandText } from '../utils/maragonBandsOnly';
import { MaragonBandChip } from './maragon/MaragonBandChip';

interface MaragonReportPageProps {
  report: MaragonFullReport;
  onBack: () => void;
}

/**
 * Reference series on this report are shown only under a signed benchmark amendment.
 * AM-10 v0.1 is unsigned (normative floors, not peer averages), and no signed source
 * defines an empirical peer-average method, so `peerAverage` is never shown.
 */
export const maragonReportBenchmarksArePublic = (signedIds: readonly string[] = SIGNED_BENCHMARK_AMENDMENT_IDS): { standard: boolean; peerAverage: boolean } => ({
  standard: signedIds.length > 0,
  peerAverage: false,
});

const DIMENSIONS: Array<{ key: keyof MaragonDimensionScores; label: string }> = [
  { key: 'Readiness', label: 'Readiness (Gatishmëria)' },
  { key: 'Aptitude', label: 'Aptitude (Aftësia)' },
  { key: 'Governance', label: 'Governance (Qeverisja)' },
  { key: 'OversightNurturing', label: 'Oversight Nurturing (Kujdesi Mbikëqyrës)' },
];

/** Bands only (v1.0 §10): no gauge, number, percentage or score-proportional width. */
const DimensionBands: React.FC<{ scores: MaragonDimensionScores; gateOpen: boolean; title: string; lang: 'sq' | 'en' }> = ({ scores, gateOpen, title, lang }) => (
  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
    <h3 className="font-semibold text-center mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {DIMENSIONS.map((axis) => (
        <MaragonBandChip key={axis.key} label={axis.label} band={publishedBand(gateOpen, scores?.[axis.key])} lang={lang} />
      ))}
    </div>
  </div>
);

export const MaragonReportPage: React.FC<MaragonReportPageProps> = ({ report, onBack }) => {
  const { language, toggleLanguage } = useLanguage();
  const lang = language === 'en' ? 'en' : 'sq';
  const unassessed = notAssessedLabel(lang);
  const scoresPublic = maragonScoresArePublic(report);
  const { compositeScore, entityType, entityId, benchmarks, indicatorDetails } = report;
  const compositeBand = publishedBand(scoresPublic, compositeScore);
  const benchmarkGate = maragonReportBenchmarksArePublic();

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

        <section aria-label={lang === 'en' ? 'Overall band' : 'Brezi i përgjithshëm'}>
          <h2 className="text-2xl font-semibold text-center mb-4">{lang === 'en' ? 'Overall band' : 'Brezi i Përgjithshëm'}</h2>
          <div className="flex justify-center">
            <div className="w-48 h-48 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center" data-maragon-band={compositeBand?.band ?? 'not_assessed'}>
              <span className="text-xl px-4 text-center font-bold text-primary-600 dark:text-primary-400">{publicBandText(compositeBand, lang)}</span>
            </div>
          </div>
        </section>

        {scoresPublic ? (
        <>
        <section>
            <h2 className="text-2xl font-semibold text-center mb-4">{lang === 'en' ? 'Bands by dimension' : 'Brezat sipas Dimensioneve'}</h2>
            <DimensionBands scores={report} gateOpen={scoresPublic} title={lang === 'en' ? 'Current bands' : 'Brezat aktuale'} lang={lang} />
        </section>

        {benchmarkGate.standard || benchmarkGate.peerAverage ? (
        <section>
            <h2 className="text-2xl font-semibold text-center mb-4">Krahasimi (Benchmark)</h2>
            <div className="space-y-6">
                {benchmarkGate.peerAverage ? <DimensionBands scores={benchmarks.peerAverage} gateOpen={scoresPublic} title="Mesatarja e Kolegëve" lang={lang} /> : null}
                {benchmarkGate.standard ? <DimensionBands scores={benchmarks.standardAdherence} gateOpen={scoresPublic} title="Përputhshmëria me Standardin" lang={lang} /> : null}
            </div>
        </section>
        ) : null}

        <section>
            <h2 className="text-2xl font-semibold text-center mb-4">{lang === 'en' ? 'Indicators' : 'Detajet e Treguesve'}</h2>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg space-y-2">
                {Object.entries(indicatorDetails || {}).map(([key, value]) => {
                    // Only a stored band key is shown. Numeric `score` values (the legacy mock uses a 0–3
                    // scale that v1.0 does not define) are never read or converted for display.
                    const band = publishedBandFromKey(scoresPublic, (value as { band?: unknown })?.band);
                    return (
                    <div key={key} className="flex justify-between text-sm p-2 rounded bg-white dark:bg-slate-800" data-maragon-band={band?.band ?? 'not_assessed'}>
                        <span className="font-mono font-semibold">{key}</span>
                        <span>{publicBandText(band, lang)}</span>
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
