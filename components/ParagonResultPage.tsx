import React, { useState, useMemo } from 'react';
import { FullProfileAnalysis, ParagonScore, PerformancePortfolioItem, ParagonDimension, PsychometricTrait } from '../types';
import { ChevronDownIcon, InformationCircleIcon } from './icons';
import { PARAGON_DIMENSIONS_AL } from '../utils/translations';
import { PerformanceAnalysisSection } from './PerformanceAnalysisSection';

interface ParagonResultPageProps {
  analysis: FullProfileAnalysis;
  onBack: () => void;
}

// --- Reusable Sub-Components for the New Framework ---

// Component for the KAPSH Analytical Journey
const KapshAnalysisSection: React.FC<{ kapschAnalysis: FullProfileAnalysis['kapschAnalysis'] }> = ({ kapschAnalysis }) => {
  const [activeTab, setActiveTab] = useState('layer1');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'layer1':
        return (
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Analiza e Tipareve të Inferuara</h4>
            <ul className="list-disc list-inside space-y-2">
              {Object.entries(kapschAnalysis.layer1_psychometricProfile).map(([trait, data]) => {
                // FIX: Cast data to PsychometricTrait to safely access properties.
                const traitData = data as PsychometricTrait;
                return (
                  <li key={trait}>
                    <span className="font-semibold capitalize">{trait.replace(/([A-Z])/g, ' $1').replace('To Experience', ' ndaj Përvojës').replace('Conscientiousness', 'Ndërgjegjshmëria').replace('Extraversion', 'Ekstraversioni').replace('Agreeableness', 'Pajtueshmëria').replace('Emotional Stability', 'Stabiliteti Emocional')}:</span> {traitData.rating}
                    <p className="pl-6 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium">Evidenca:</span> {traitData.evidence.join(', ')}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      case 'layer2':
        return (
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Pozicionimi Socio-Historik</h4>
            <p><span className="font-semibold">Arketipi Dominues:</span> {kapschAnalysis.layer2_matrixProfile.archetype}</p>
             <div className="p-2 bg-amber-50 dark:bg-amber-900/40 border-l-4 border-amber-500 rounded-r-md">
                <p className="font-semibold text-amber-800 dark:text-amber-200">Ngjarjet e Përplasjes Kontekstuale:</p>
                <ul className="list-disc list-inside text-xs text-amber-700 dark:text-amber-300">
                    {kapschAnalysis.layer2_matrixProfile.contextClashEvents.map((event, i) => <li key={i}>{event}</li>)}
                </ul>
             </div>
          </div>
        );
       case 'layer3':
        const PerformancePortfolioCard: React.FC<{ item: PerformancePortfolioItem }> = ({ item }) => (
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">{item.event}</h5>
                {item.competencies && <p className="text-xs mt-1"><strong>Aftësitë:</strong> <span className="text-green-600 dark:text-green-400">{item.competencies.join(', ')}</span></p>}
                {item.skillGaps && <p className="text-xs mt-1"><strong>Mungesat:</strong> <span className="text-red-600 dark:text-red-400">{item.skillGaps.join(', ')}</span></p>}
            </div>
        );
        return (
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Portofoli i Performancës së Vëzhguar</h4>
             <div className="space-y-4">
               {kapschAnalysis.layer3_performancePortfolio.map((item, i) => (
                   <PerformancePortfolioCard key={i} item={item} />
               ))}
           </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-3">
            Korniza Analitike (KAPSH): Udhëtimi Analitik
        </h3>
        <div className="border-b border-slate-300 dark:border-slate-600 mb-3">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                <button onClick={() => setActiveTab('layer1')} className={`${activeTab === 'layer1' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
                    Shtresa I: Psikometria
                </button>
                <button onClick={() => setActiveTab('layer2')} className={`${activeTab === 'layer2' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
                    Shtresa II: Matrica
                </button>
                 <button onClick={() => setActiveTab('layer3')} className={`${activeTab === 'layer3' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
                    Shtresa III: Performanca
                </button>
            </nav>
        </div>
        <div className="animate-fadeIn">
            {renderTabContent()}
        </div>
    </section>
  );
};

// Component for the Final Diagnosis and Alert
const FinalDiagnosisDisplay: React.FC<{ diagnosis: FullProfileAnalysis['finalDiagnosis'] }> = ({ diagnosis }) => {
    const alertStyles: {[key: string]: string} = {
        'I Lartë': 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/40 dark:text-red-200',
        'Mesatar': 'bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
        'I Ulët': 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/40 dark:text-green-200',
    };
    const currentStyle = alertStyles[diagnosis.alertLevel] || 'bg-slate-50 border-slate-500';
    
    return (
        <section className={`p-4 border-l-4 rounded-r-lg ${currentStyle}`}>
            <h3 className="font-bold text-lg mb-2">Diagnoza Përfundimtare</h3>
            <p className="font-semibold mb-2">
                <span className="font-bold">Niveli i Alertit: {diagnosis.alertLevel}</span> - {diagnosis.alertType}
            </p>
            <p className="text-sm">{diagnosis.executiveSummary}</p>
        </section>
    );
};


// --- Main Page Component (Refactored) ---

export const ParagonResultPage: React.FC<ParagonResultPageProps> = ({ analysis, onBack }) => {
  if (!analysis) {
    return (
      <div className="container mx-auto p-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">Processing Analysis Engines...</p>
      </div>
    );
  }

  const { profileInput, kapschAnalysis, performanceAnalysis, finalDiagnosis } = analysis;

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
            <button onClick={onBack} className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition">
                &larr; <span className="ml-2">Kthehu Pas</span>
            </button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl space-y-8 animate-fadeIn">
            
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    Analiza e Profilit: <span className="text-primary-600 dark:text-primary-400">{profileInput.personal.fullName}</span>
                </h2>
            </div>
            
            <FinalDiagnosisDisplay diagnosis={finalDiagnosis} />
            
            <PerformanceAnalysisSection data={performanceAnalysis} />
            
            <KapshAnalysisSection kapschAnalysis={kapschAnalysis} />
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-500 text-sm text-blue-800 dark:text-blue-200 rounded-r-lg">
                <p><InformationCircleIcon className="w-5 h-5 inline mr-2" />Kjo analizë gjenerohet nga motori ynë analitik bazuar në të dhënat biografike të strukturuara dhe nuk përfshin të dhëna në kohë reale.</p>
            </div>

          </div>

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md"
            aria-label="Kthehu Pas"
          >
            Kthehu Pas
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
};