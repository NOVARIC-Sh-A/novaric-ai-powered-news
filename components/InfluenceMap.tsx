import React from 'react';
import { NetworkGraph } from './NetworkGraph';
import { FullProfileAnalysis } from '../types';

interface InfluenceMapProps {
  networkMapData?: FullProfileAnalysis['networkMapData'];
}

const Legend: React.FC = () => {
    const legendItems = [
        { color: '#dc2626', label: 'Analist Qendror' },
        { color: '#3b82f6', label: 'Figurat Politike (PS)' },
        { color: '#22c55e', label: 'Figurat Politike (PD)' },
        { color: '#f97316', label: 'Sistemi Gjyqësor' },
        { color: '#ec4899', label: 'Personalitete Mediatike' },
        { color: '#06b6d4', label: 'Bota e Biznesit' },
    ];

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Legjenda</h3>
            <div className="space-y-2">
                {legendItems.map(item => (
                    <div key={item.label} className="flex items-center">
                        <span className="w-3.5 h-3.5 rounded-full mr-2.5 flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="text-sm text-slate-600 dark:text-slate-300">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const InfluenceMap: React.FC<InfluenceMapProps> = ({ networkMapData }) => {
    if (!networkMapData || !networkMapData.nodes || networkMapData.nodes.length === 0) {
        return null;
    }

  return (
    <section className="bg-white/70 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl mt-8 border border-white/20 dark:border-slate-700/50 p-6">
      <h2 className="text-2xl font-semibold text-center mb-6 text-slate-800 dark:text-slate-100">
        Harta e Rrjetit të Ndikimit
      </h2>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow min-h-[300px] bg-slate-50/70 dark:bg-slate-900/60 rounded-lg border border-dashed border-slate-300/50 dark:border-slate-600/50 flex items-center justify-center">
           <NetworkGraph nodes={networkMapData.nodes} edges={networkMapData.edges} />
        </div>
        <aside className="lg:w-72 flex-shrink-0 p-6 bg-slate-100/70 dark:bg-slate-800/70 rounded-lg shadow-lg">
            <div className="clinical-summary">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Përmbledhja Klinike</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Harta tregon pozicionimin qendror të profilit, duke ilustruar ndërveprimet e tij direkte me median, biznesin dhe opozitën.
                </p>
            </div>
            <Legend />
        </aside>
      </div>
    </section>
  );
};
