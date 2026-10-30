import React, { useState, useMemo, useEffect } from 'react';
import { VipProfile, ParagonEntry } from '../types';
import { RadarChart } from './RadarChart';
import { ChevronDownIcon } from './icons';
import { PieChart } from './PieChart';

interface PerformanceAnalysisPageProps {
    onBack: () => void;
    profiles: VipProfile[];
    initialProfileId?: string | number;
    onProfileSelect: (page: 'tvPersonalitiesAnalysis', id: string | number) => void;
}

const DimensionDetail: React.FC<{ category: ParagonEntry }> = ({ category }) => {
    const scoreData = [{ name: 'Score', value: category.score, color: '#e4191e' }, { name: 'Gap', value: 100 - category.score, color: '#f1f5f9' }];
    const peerData = [{ name: 'Peer', value: category.peerAverage, color: '#3b82f6' }, { name: 'Gap', value: 100 - category.peerAverage, color: '#f1f5f9' }];
    const benchmarkData = [{ name: 'Benchmark', value: category.globalBenchmark, color: '#22c55e' }, { name: 'Gap', value: 100 - category.globalBenchmark, color: '#f1f5f9' }];

    return (
        <div className="p-4 space-y-3 bg-slate-50 dark:bg-slate-800">
            {/* FIX: Added optional chaining to access 'description' which is now an optional property. */}
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">{category.description || ''}</p>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                <p className="font-medium text-blue-800 dark:text-blue-200">Komenti i Analizës:</p>
                {/* FIX: Added optional chaining to access 'commentary' which is now an optional property. */}
                <p className="text-sm text-blue-700 dark:text-blue-300">{category.commentary || ''}</p>
            </div>
            <div className="flex flex-wrap justify-around text-center text-sm pt-2 gap-4">
                <div className="flex flex-col items-center">
                    <PieChart data={scoreData} size={80} />
                    <p className="font-bold text-lg mt-2 text-primary-600 dark:text-primary-400">{category.score}<span className="text-xs">/100</span></p>
                    <p className="font-semibold text-xs">Vlerësimi</p>
                </div>
                <div className="flex flex-col items-center">
                    <PieChart data={peerData} size={80} />
                    <p className="font-bold text-lg mt-2 text-slate-700 dark:text-slate-300">{category.peerAverage}<span className="text-xs">/100</span></p>
                    <p className="font-semibold text-xs">Mes. e Kolegëve</p>
                </div>
                <div className="flex flex-col items-center">
                    <PieChart data={benchmarkData} size={80} />
                    <p className="font-bold text-lg mt-2 text-green-600 dark:text-green-400">{category.globalBenchmark}<span className="text-xs">/100</span></p>
                    <p className="font-semibold text-xs">Standardi Global</p>
                </div>
            </div>
        </div>
    );
};


export const TvPersonalitiesAnalysisPage: React.FC<PerformanceAnalysisPageProps> = ({ onBack, profiles, initialProfileId, onProfileSelect }) => {
    const profilesWithAnalysis = useMemo(() => 
        profiles.filter(p => 
            p.maragonAnalysis && 
            p.maragonAnalysis.length > 0
        ).sort((a, b) => a.name.localeCompare(b.name)),
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

    const radarChartData = selectedAnalysis?.maragonAnalysis ? {
        labels: selectedAnalysis.maragonAnalysis.map(a => a.dimension),
        datasets: [
            {
                label: selectedAnalysis.name,
                data: selectedAnalysis.maragonAnalysis.map(a => a.score),
                backgroundColor: 'rgba(228, 25, 30, 0.2)',
                borderColor: 'rgba(228, 25, 30, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(228, 25, 30, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(228, 25, 30, 1)',
            },
            {
                label: 'Mesatarja e Kolegëve',
                data: selectedAnalysis.maragonAnalysis.map(a => a.peerAverage),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
            },
            {
                label: 'Standardi Global',
                data: selectedAnalysis.maragonAnalysis.map(a => a.globalBenchmark),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
            }
        ]
    } : null;

    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800/80 p-6 sm:p-8 rounded-lg shadow-2xl">
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
                                {p.name} ({p.category})
                            </option>
                        ))}
                      </select>
                </section>

                {selectedAnalysis && radarChartData && (
                     <section className="mb-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl shadow-inner">
                        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Krahasimi Vizual i Performancës për {selectedAnalysis.name}</h2>
                        <div className="max-w-xl mx-auto">
                           <RadarChart data={radarChartData} />
                        </div>
                    </section>
                )}

                {selectedAnalysis && selectedAnalysis.maragonAnalysis && (
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
                                        <DimensionDetail category={category} />
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