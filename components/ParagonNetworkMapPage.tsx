import React from 'react';
import { graphData } from '../data/mockNetworkGraphData';
import { renderWithSuperscript } from '../utils/textUtils';
import { NetworkGraph } from './NetworkGraph';

interface ParagonNetworkMapPageProps {
  onBack: () => void;
}

const Legend: React.FC = () => {
    const legendItems = [
        { color: '#0891b2', label: 'Analist Qendror' },
        { color: '#ef4444', label: 'Figurat Politike (PS)' },
        { color: '#3b82f6', label: 'Figurat Politike (PD)' },
        { color: '#8b5cf6', label: 'Sistemi Gjyqësor' },
        { color: '#22c55e', label: 'Personalitete Mediatike' },
        { color: '#f97316', label: 'Bota e Biznesit' },
    ];

    return (
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <h4 className="font-bold text-center mb-3 text-slate-700 dark:text-slate-200">Legjenda e Rrjetit</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                {legendItems.map(item => (
                    <div key={item.label} className="flex items-center">
                        <span className="w-4 h-4 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="text-xs text-slate-600 dark:text-slate-300">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const ParagonNetworkMapPage: React.FC<ParagonNetworkMapPageProps> = ({ onBack }) => {
  const { nodes, edges } = graphData;

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900/80 p-6 sm:p-8 rounded-lg shadow-2xl">
        <div className="mb-6">
            <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition"
            >
                &larr; <span className="ml-2">Kthehu Pas</span>
            </button>
        </div>
        
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
            {renderWithSuperscript('PARAGON ASSESSMENT: Influencer Network Map')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
            Mapping Structural Position & Coalition Capacity - Dr. Alban Gj. THIKA
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 w-full bg-slate-50 dark:bg-slate-800 rounded-lg shadow-inner border border-slate-200 dark:border-slate-700 overflow-hidden">
                <NetworkGraph nodes={nodes} edges={edges} />
            </div>
            <aside className="lg:col-span-1 p-6 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 border-b-2 border-primary-500 pb-2">
                    Key Insights
                </h3>
                <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-start">
                        <span className="text-primary-500 mr-2 mt-1">&#10148;</span>
                        <span><strong>Pozicionim Analitik Qendror:</strong> Harta e pozicionon Dr. Thikën si një nyje analitike qendrore, i cili vëzhgon dhe ndërlidh sferat kryesore të pushtetit në Shqipëri: Politikën, Median, Sistemin Gjyqësor dhe Biznesin.</span>
                    </li>
                     <li className="flex items-start">
                        <span className="text-primary-500 mr-2 mt-1">&#10148;</span>
                        <span><strong>Ndërveprimet Media-Politikë:</strong> Lidhjet direkte midis gazetarëve kryesorë (Fevziu, Vasili, Balla, Rakipi) dhe liderëve politikë (Rama, Berisha) ilustrojnë fluksin e informacionit dhe arenën e debatit publik.</span>
                    </li>
                     <li className="flex items-start">
                        <span className="text-primary-500 mr-2 mt-1">&#10148;</span>
                        <span><strong>Roli i Sistemit të Drejtësisë:</strong> Lidhja midis SPAK (përfaqësuar nga Altin Dumani) dhe figurave politike si Sali Berisha tregon rolin aktiv të sistemit të drejtësisë në llogaridhënien politike.</span>
                    </li>
                     <li className="flex items-start">
                        <span className="text-primary-500 mr-2 mt-1">&#10148;</span>
                        <span><strong>Urat e Komunikimit:</strong> Përmes punës së tij analitike (p.sh., analiza e korrupsionit, letra e hapur për rastin Beci), Dr. Thika krijon ura tematike që lidhin veprimet e një sfere me pasojat në një tjetër, duke i ofruar publikut një pamje më të plotë.</span>
                    </li>
                </ul>
                <Legend />
            </aside>
        </div>
      </div>
    </main>
  );
};