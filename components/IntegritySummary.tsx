import React from 'react';
import { IntegrityAnalysis } from '../types';

const StatCard: React.FC<{ label: string; value: string; subvalue?: string; }> = ({ label, value, subvalue }) => (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-center border border-slate-200 dark:border-slate-600 h-full flex flex-col justify-center">
        <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 leading-tight">{value}</p>
        {subvalue && <p className="text-sm text-slate-600 dark:text-slate-300">{subvalue}</p>}
    </div>
);

interface IntegritySummaryProps {
  integrityAnalysis: IntegrityAnalysis;
}

export const IntegritySummary: React.FC<IntegritySummaryProps> = ({ integrityAnalysis }) => {
  const { agib, cri } = integrityAnalysis;
  
  return (
    <section className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-200">
        Përmbledhja e Profilit të Integritetit
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="ARKETIPI AGIB" value={agib.archetype.split(' ')[0]} subvalue={agib.archetype.split(' ').slice(1).join(' ')} />
        <StatCard label="VULNERABILITETI" value={agib.vulnerability.toUpperCase()} />
        <StatCard label="CENTRALITETI" value={`${agib.centralityScore}/100`} />
        <StatCard label="RREZIKU CRI" value={cri.behavioralRisk.toUpperCase()} subvalue={`(${cri.criScore}/100)`}/>
      </div>
    </section>
  );
};