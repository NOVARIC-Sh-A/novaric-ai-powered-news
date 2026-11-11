import React, { useState, useMemo, useEffect } from 'react';
import { VipProfile, ParagonEntry } from '../types';
import { RadarChart } from './RadarChart';
import { ChevronDownIcon } from './icons';
import { PieChart } from './PieChart';
import { formatPersonName } from '../utils/formatPersonName';
import { useLanguage } from '../contexts/LanguageContext';
import {
  isMaragonAssessmentPublished,
  measuredNumber,
  notAssessedLabel,
  publishedSeries,
} from '../utils/maragonPublication';
import { MaragonAnalysisView } from './maragon/MaragonDossierView';
import { isMediaProfile } from '../utils/maragonPublication';

interface PerformanceAnalysisPageProps {
    onBack: () => void;
    profiles: VipProfile[];
    initialProfileId?: string | number;
    onProfileSelect: (page: 'tvPersonalitiesAnalysis', id: string | number) => void;
}

const DimensionDetail: React.FC<{ category: ParagonEntry; unassessedLabel: string }> = ({ category, unassessedLabel }) => {
    const score = measuredNumber(category.score);
    const peer = measuredNumber(category.peerAverage);
    const benchmark = measuredNumber(category.globalBenchmark);
    if (score === null && peer === null && benchmark === null) {
        return (
            <div className="p-4 bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{unassessedLabel}</p>
            </div>
        );
    }
    const slices = [
        score === null ? null : { label: 'Vlerësimi', value: score, color: '#e4191e', text: 'text-primary-600 dark:text-primary-400' },
        peer === null ? null : { label: 'Mes. e Kolegëve', value: peer, color: '#3b82f6', text: 'text-slate-700 dark:text-slate-300' },
        benchmark === null ? null : { label: 'Standardi Global', value: benchmark, color: '#22c55e', text: 'text-green-600 dark:text-green-400' },
    ].filter((slice): slice is { label: string; value: number; color: string; text: string } => slice !== null);

    return (
        <div className="p-4 space-y-3 bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">{category.description || ''}</p>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                <p className="font-medium text-blue-800 dark:text-blue-200">Komenti i Analizës:</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">{category.commentary || unassessedLabel}</p>
            </div>
            <div className="flex flex-wrap justify-around text-center text-sm pt-2 gap-4">
                {slices.map((slice) => (
                    <div key={slice.label} className="flex flex-col items-center">
                        <PieChart data={[{ name: slice.label, value: slice.value, color: slice.color }, { name: 'Gap', value: 100 - slice.value, color: '#f1f5f9' }]} size={80} />
                        <p className={`font-bold text-lg mt-2 ${slice.text}`}>{slice.value}<span className="text-xs">/100</span></p>
                        <p className="font-semibold text-xs">{slice.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const TvPersonalitiesAnalysisPage: React.FC<PerformanceAnalysisPageProps> = ({ onBack, profiles, initialProfileId, onProfileSelect }) => {
    const { language, toggleLanguage } = useLanguage();
    const unassessedLabel = notAssessedLabel(language);
    const profilesWithAnalysis = useMemo(() => 
        profiles.filter(p => {
            const category = (p.category || '').toLowerCase();
            return category.includes('media')
                || /^vip_m/i.test(String(p.id))
                || p.maragonAssessmentStatus != null
                || (p.maragonAnalysis && p.maragonAnalysis.length > 0);
        }).sort((a, b) => a.name.localeCompare(b.name)),
    [profiles]);
    
    const [selectedId, setSelectedId] = useState(() => {
        if (initialProfileId && profilesWithAnalysis.some(p => p.id.toString() === initialProfileId.toString())) {
            return initialProfileId;
        }
        return profilesWithAnalysis[0]?.id || '';
    });

    useEffect(() => {
        if (initialProfileId && profilesWithAnalysis.some(p => p.id.toString() === initialProfileId.toString())) {
            setSelectedId(initialProfileId);
        }
    }, [initialProfileId, profilesWithAnalysis]);


    const [openDimension, setOpenDimension] = useState<string | null>(null);

    const selectedAnalysis = useMemo(() => profilesWithAnalysis.find(p => p.id.toString() === selectedId.toString()), [selectedId, profilesWithAnalysis]);

    const toggleDimension = (dimension: string) => {
        setOpenDimension(openDimension === dimension ? null : dimension);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        setSelectedId(newId);
        if (onProfileSelect) {
            onProfileSelect('tvPersonalitiesAnalysis', newId);
        }
    };

    const assessmentPublished = isMaragonAssessmentPublished(selectedAnalysis);
    const axisLabels = selectedAnalysis?.maragonAnalysis?.map(a => a.dimension) ?? [];
    const subjectSeries = publishedSeries(selectedAnalysis, selectedAnalysis?.maragonAnalysis?.map(a => a.score));
    const peerSeries = publishedSeries(selectedAnalysis, selectedAnalysis?.maragonAnalysis?.map(a => a.peerAverage));
    const benchmarkSeries = publishedSeries(selectedAnalysis, selectedAnalysis?.maragonAnalysis?.map(a => a.globalBenchmark));
    const radarDatasets = [
        subjectSeries ? {
            label: selectedAnalysis?.name || '',
            data: subjectSeries,
            backgroundColor: 'rgba(228, 25, 30, 0.2)',
            borderColor: 'rgba(228, 25, 30, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(228, 25, 30, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(228, 25, 30, 1)',
        } : null,
        peerSeries ? {
            label: 'Mesatarja e Kolegëve',
            data: peerSeries,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        } : null,
        benchmarkSeries ? {
            label: 'Standardi Global',
            data: benchmarkSeries,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
        } : null,
    ].filter((dataset): dataset is NonNullable<typeof dataset> => dataset !== null);

    const radarChartData = axisLabels.length > 0 ? {
        labels: axisLabels,
        datasets: radarDatasets,
    } : null;

    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800/80 p-6 sm:p-8 rounded-lg shadow-2xl">
                <div className="mb-4 flex justify-end">
                  <button type="button" onClick={toggleLanguage} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold dark:border-slate-600">
                    <span className={language === 'sq' ? 'text-primary-600' : 'text-slate-400'}>AL</span>
                    <span className="mx-1 text-slate-300">|</span>
                    <span className={language === 'en' ? 'text-primary-600' : 'text-slate-400'}>EN</span>
                  </button>
                </div>
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-700 dark:text-primary-400 mb-2">
                        Analizë e Performancës së Figurave Mediatike
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Një vlerësim i bazuar në të dhëna sipas Kornizës Analitike <strong>MARAGON<sup>®</sup></strong>.
                    </p>
                </header>
                
                <section className="mb-8">
                     <label htmlFor="personality-select" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Zgjidhni një figurë publike</label>
                     <select
                        id="personality-select"
                        value={selectedId}
                        onChange={handleSelectChange}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-slate-700"
                      >
                        {profilesWithAnalysis.map(p => (
                            <option key={p.id} value={p.id}>
                                {formatPersonName(p.name)} ({p.category})
                            </option>
                        ))}
                      </select>
                </section>

                {selectedAnalysis && isMediaProfile(selectedAnalysis) && (
                  <MaragonAnalysisView profileId={selectedAnalysis.id} name={formatPersonName(selectedAnalysis.name)} />
                )}

                {selectedAnalysis && !isMediaProfile(selectedAnalysis) && radarChartData && (
                     <section className="mb-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl shadow-inner">
                        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-2">
                          {assessmentPublished
                            ? `Krahasimi Vizual i Performancës për ${formatPersonName(selectedAnalysis.name)}`
                            : unassessedLabel}
                        </h2>
                        {!assessmentPublished && (
                          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6">{formatPersonName(selectedAnalysis.name)}</p>
                        )}
                        <div className="max-w-xl mx-auto">
                           <RadarChart data={radarChartData} axesOnly={!assessmentPublished} />
                        </div>
                    </section>
                )}

                {selectedAnalysis && !isMediaProfile(selectedAnalysis) && !assessmentPublished && (
                    <section className="mb-8 text-center">
                        <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{unassessedLabel}</p>
                    </section>
                )}

                {assessmentPublished && selectedAnalysis && !isMediaProfile(selectedAnalysis) && selectedAnalysis.maragonAnalysis && (
                    <section>
                         <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Vlerësim i Detajuar sipas Dimensioneve MARAGON®</h2>
                         <div className="space-y-4">
                            {selectedAnalysis.maragonAnalysis.map(category => (
                                <div key={category.dimension} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleDimension(category.dimension)}
                                        className="w-full flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600/50"
                                        aria-expanded={openDimension === category.dimension}
                                    >
                                        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 text-left">{category.dimension}</h3>
                                        <ChevronDownIcon className={`w-6 h-6 text-slate-500 dark:text-slate-400 transition-transform ${openDimension === category.dimension ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openDimension === category.dimension && (
                                        <DimensionDetail category={category} unassessedLabel={unassessedLabel} />
                                    )}
                                </div>
                            ))}
                         </div>
                    </section>
                )}
                
                {!selectedAnalysis && (
                    <div className="text-center p-8 text-slate-500 dark:text-slate-400">
                        <p>Ju lutemi, zgjidhni një personalitet për të parë analizën.</p>
                    </div>
                )}

                <div className="mt-12 text-center">
                    <button
                        onClick={onBack}
                        className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition"
                        aria-label="Kthehu te faqja kryesore"
                    >
                        &larr; Kthehu Pas
                    </button>
                </div>
            </div>
        </main>
    );
};