import React, { useState } from 'react';
import { IntegrityAnalysis } from '../types';
import { TooltipTerm } from './TooltipTerm';
import { renderWithSuperscript } from '../utils/textUtils';

interface IntegrityDetailsProps {
  integrityAnalysis: IntegrityAnalysis;
}

const DetailRow: React.FC<{ label: React.ReactNode; children: React.ReactNode }> = ({ label, children }) => (
    <div className="py-3">
        <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="mt-1 text-sm text-slate-900 dark:text-slate-200">{children}</dd>
    </div>
);

const AgibTab: React.FC<{ agib: IntegrityAnalysis['agib'] }> = ({ agib }) => (
    <div className="p-6">
        <dl className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            <DetailRow label="Arketipi">{agib.archetype}</DetailRow>
            <DetailRow label="Centraliteti në Rrjet">{agib.centralityScore}/100</DetailRow>
            <DetailRow label="Indeksi SCRI">{agib.scriIndex}/100</DetailRow>
        </dl>
    </div>
);

const CriTab: React.FC<{ cri: IntegrityAnalysis['cri'] }> = ({ cri }) => (
     <div className="p-6 text-sm leading-relaxed">
        <p className="mb-3"><strong>Indeksi i Shkëputjes Morale: {cri.moralDetachmentIndex}/100</strong></p>
        <ul className="list-disc list-inside space-y-2 pl-2 mb-3">
            <li><strong>Gjuha eufemistike:</strong> <span className="italic">"{cri.euphemisticLanguage}"</span></li>
            <li><strong>Zhvendosja e përgjegjësisë:</strong> <span className="italic">"{cri.displacementOfResponsibility}"</span></li>
        </ul>
        <p className="mb-3"><strong>Indeksi i Mbylljes Elitare: {cri.eliteClosureIndex}/100</strong></p>
        <p className="mb-3">{renderWithSuperscript('Rrjeti i tij është tejet homogjen, duke krijuar një \'dhomë jehone\' që përforcon vendimet pa kritika të jashtme.')}</p>
        <p className="mb-3"><strong>Konteksti i Pandëshkueshmërisë</strong></p>
        <p>{renderWithSuperscript('Historia e hetimeve të mbyllura ose të zvarritura për afera të ndryshme.')}</p>
    </div>
);

export const IntegrityDetails: React.FC<IntegrityDetailsProps> = ({ integrityAnalysis }) => {
    const [activeTab, setActiveTab] = useState<'agib' | 'cri'>('agib');

  return (
    <section className="bg-white/70 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden mt-8 border border-white/20 dark:border-slate-700/50">
      <h2 className="text-center text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-6 mb-4">
        Detajet e Analizës së Integritetit (4h)
      </h2>
      <div className="border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex">
            <button 
                onClick={() => setActiveTab('agib')}
                className={`flex-1 py-3.5 px-5 text-base font-semibold text-center border-b-3 transition-colors duration-200 focus:outline-none ${activeTab === 'agib' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
                Skenari Strukturor (AGIB)
            </button>
            <button 
                onClick={() => setActiveTab('cri')}
                 className={`flex-1 py-3.5 px-5 text-base font-semibold text-center border-b-3 transition-colors duration-200 focus:outline-none ${activeTab === 'cri' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
                Diagnoza Bihejviorale (CRI)
            </button>
        </div>
      </div>
      <div>
            {activeTab === 'agib' ? <AgibTab agib={integrityAnalysis.agib} /> : <CriTab cri={integrityAnalysis.cri} />}
      </div>
    </section>
  );
};
