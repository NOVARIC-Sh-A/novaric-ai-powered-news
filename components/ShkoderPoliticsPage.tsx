
import React from 'react';
import { VipProfile } from '../types';
import { municipalityPerformanceData, shkoderPoliticalData } from '../data/mockShkoderData';
import { PieChart } from './PieChart';
import { BarChart } from './BarChart';
import { getProfilePhotoUrl } from '../utils/paragonProfileUtils';

interface ShkoderPoliticsPageProps {
  profiles: VipProfile[];
  onBack: () => void;
  onNavigateToProfilePage: (profile: VipProfile) => void;
}

const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // green-500
    if (score >= 60) return '#84cc16'; // lime-500
    if (score >= 40) return '#facc15'; // yellow-400
    return '#ef4444'; // red-500
};

export const ShkoderPoliticsPage: React.FC<ShkoderPoliticsPageProps> = ({ profiles, onBack, onNavigateToProfilePage }) => {
  const mayor = profiles.find(p => p.id === 'mp19'); // Benet Beci's ID
  const councilChartData = shkoderPoliticalData.councilComposition.map(p => ({ name: p.party, value: p.seats, color: p.color }));

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800/80 p-6 sm:p-8 rounded-lg shadow-2xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-700 dark:text-primary-400 mb-2">
            Paneli Politik: Bashkia Shkodër
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Një vështrim i thelluar mbi përbërjen politike, performancën dhe sfidat kryesore.
          </p>
        </header>

        {/* Council Composition */}
        <section className="mb-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl shadow-inner">
           <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Përbërja e Këshillit Bashkiak</h2>
           <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <PieChart data={councilChartData} size={200} title="Përbërja e Këshillit Bashkiak" />
                <div className="space-y-2">
                    {shkoderPoliticalData.councilComposition.map(p => (
                        <div key={p.party} className="flex items-center">
                            <span className="w-4 h-4 rounded mr-3 flex-shrink-0" style={{ backgroundColor: p.color }}></span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{p.party} ({p.seats} vende)</span>
                        </div>
                    ))}
                </div>
           </div>
        </section>

        {/* Mayor Profile Section */}
        {mayor?.performanceAnalysis && (
        <section className="mb-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Analiza e Kryetarit të Bashkisë: Benet Beci</h2>
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                 <img
                    src={getProfilePhotoUrl(mayor)}
                    onError={(e) => {
                        const gender = mayor?.gender?.toLowerCase();
                        e.currentTarget.src =
                            gender === "female" || gender === "f"
                                ? "https://novaric.co/wp-content/uploads/2025/11/FemaleProfile.jpg"
                                : "https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg";
                    }}
                    alt={mayor.name}
                    style={{ objectFit: "cover" }}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-500/50 shadow-lg"
                />
                <div>
                    <p className="text-lg text-slate-700 dark:text-slate-300">Vlerësim i detajuar i karakteristikave kyçe të lidershipit bazuar në performancën publike.</p>
                     <div className="flex flex-wrap gap-4 mt-2">
                         <button 
                            onClick={() => onNavigateToProfilePage(mayor)}
                            className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                          >
                            Shiko Profilin e Plotë &rarr;
                          </button>
                     </div>
                </div>
            </div>
            <div className="space-y-5">
              {mayor.performanceAnalysis.slice(0, 5).map((char, index) => ( // Show first 5 for brevity
                  <BarChart key={index} label={char.dimension} value={char.score} color={getScoreColor(char.score)} />
              ))}
            </div>
        </section>
        )}

        {/* Key Political Issues */}
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Çështjet Kyçe Politike dhe Administrative</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {shkoderPoliticalData.keyIssues.map(issue => (
                    <div key={issue.issue} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg shadow-md">
                        <h4 className="font-semibold text-md text-primary-700 dark:text-primary-400 mb-1">{issue.issue}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{issue.summary}</p>
                    </div>
                ))}
            </div>
        </section>


        {/* Municipality Performance Section */}
        <section>
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Performanca e Bashkisë: Treguesit Kryesorë</h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            {municipalityPerformanceData.map((kpi, index) => (
              <div key={index} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <BarChart label={kpi.kpi} value={kpi.value} />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 pl-1">{kpi.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition"
            aria-label="Kthehu Pas"
          >
            &larr; Kthehu Pas
          </button>
        </div>
      </div>
    </main>
  );
};
