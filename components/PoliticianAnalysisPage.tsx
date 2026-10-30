import React, { useState, useMemo } from 'react';
// FIX: Consolidated type imports and added ParagonDimension.
import { FullProfileAnalysis, PerformancePortfolioItem, ParagonDimension, PsychometricProfile } from '../types'; 
import { InformationCircleIcon, ChevronDownIcon } from './icons';
import { SpiderChart } from './SpiderChart'; 
import { PARAGON_DIMENSIONS_AL } from '../utils/translations';

interface PoliticianAnalysisPageProps {
  analyses: FullProfileAnalysis[];
  onBack: () => void;
}

// FIX: Define a local interface for dimension details to avoid using the top-level ParagonScore type.
interface LocalDimensionScore {
  dimension: string;
  score: number;
  justification: string;
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
                if (data && typeof data === 'object' && 'rating' in data && 'evidence' in data) {
                  const traitData = data as { rating: string; evidence: string[] };
                  return (
                      <li key={trait}>
                        <span className="font-semibold capitalize">{trait.replace(/([A-Z])/g, ' $1').replace('To Experience', ' ndaj Përvojës').replace('Conscientiousness', 'Ndërgjegjshmëria').replace('Extraversion', 'Ekstraversioni').replace('Agreeableness', 'Pajtueshmëria').replace('Emotional Stability', 'Stabiliteti Emocional')}:</span> {traitData.rating}
                        <p className="pl-6 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium">Evidenca:</span> {Array.isArray(traitData.evidence) ? traitData.evidence.join(', ') : ''}
                        </p>
                      </li>
                  );
                }
                return null;
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

// FIX: Update component to use local detail type.
const DimensionDeepDive: React.FC<{ score: LocalDimensionScore }> = ({ score }) => {
    const [isOpen, setIsOpen] = useState(false);
    const translatedDimension = PARAGON_DIMENSIONS_AL[score.dimension as ParagonDimension] || score.dimension;

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600/50"
                aria-expanded={isOpen}
            >
                <h4 className="font-semibold text-md text-slate-800 dark:text-slate-100 text-left">{translatedDimension}</h4>
                <div className="flex items-center gap-4">
                     <span className="font-bold text-xl text-primary-600 dark:text-primary-400">{score.score * 10}</span>
                     <ChevronDownIcon className={`w-6 h-6 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="p-4 bg-white dark:bg-slate-800 space-y-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Pikët:</strong> {score.score}/10</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Justifikimi:</strong> {score.justification}</p>
                </div>
            )}
        </div>
    );
};

// FIX: Update component to use local detail type.
const ParagonDimensionDetails: React.FC<{ paragonScores?: LocalDimensionScore[] }> = ({ paragonScores }) => (
    <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-4">Vlerësimi i Dimensionit PARAGON®</h3>
        <div className="space-y-2">
            {paragonScores?.map((score) => (
                <DimensionDeepDive key={score.dimension} score={score} />
            ))}
        </div>
    </section>
);


// Component for the Final Diagnosis and Alert
const FinalDiagnosisDisplay: React.FC<{ diagnosis: FullProfileAnalysis['finalDiagnosis'] }> = ({ diagnosis }) => {
    const alertStyles = {
        'I Lartë': 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/40 dark:text-red-200',
        'Mesatar': 'bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
        'I Ulët': 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/40 dark:text-green-200',
    };
    const currentStyle = alertStyles[diagnosis.alertLevel as keyof typeof alertStyles] || 'bg-slate-50 border-slate-500';
    
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

export const PoliticianAnalysisPage: React.FC<PoliticianAnalysisPageProps> = ({ analyses, onBack }) => {
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>(() => {
    return analyses.length > 0 ? analyses[0].profileInput.personal.fullName : '';
  });

  const selectedAnalysis = useMemo(() => {
    if (!selectedAnalysisId) return null;
    return analyses.find(a => a.profileInput.personal.fullName === selectedAnalysisId) || null;
  }, [selectedAnalysisId, analyses]);

  // Data mapping for the PARAGON Spider Chart
  const paragonChartData = useMemo(() => {
    if (!selectedAnalysis?.performanceAnalysis) return { labels: [], datasets: [] };
    const labels = Object.values(PARAGON_DIMENSIONS_AL);
    const data = selectedAnalysis.performanceAnalysis.individualScores;
    return {
      labels,
      datasets: [{
        label: 'Pikët PARAGON®',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // primary-500 with opacity
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      }]
    };
  }, [selectedAnalysis]);

  // FIX: Use local interface to fix type mismatch.
  const derivedParagonScores = useMemo((): LocalDimensionScore[] | undefined => {
    if (!selectedAnalysis?.performanceAnalysis) return undefined;
    
    const oldDimensionKeys = Object.keys(PARAGON_DIMENSIONS_AL) as ParagonDimension[];
    
    return selectedAnalysis.performanceAnalysis.individualScores.map((score, i) => ({
      dimension: oldDimensionKeys[i] || `Dimension ${i+1}`,
      score: score / 10, // Scale down from 0-100 to 0-10 for compatibility with DimensionDeepDive
      justification: 'Justifikimi nuk është i disponueshëm në këtë pamje të dhënash.'
    }));
  }, [selectedAnalysis]);


  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl mb-8">
          <h1 className="text-3xl font-bold mb-4 text-center text-primary-700 dark:text-primary-500">
            Analizë e Thelluar e Profilit Politik
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            Ky mjet ofron një vlerësim të plotë të profileve politike duke përdorur Kornizën Analitike PARAGON®, duke integruar të dhënat biografike, psikometrinë e kontekstualizuar dhe analizën e sjelljes.
          </p>

          {analyses.length > 0 && (
            <div>
              <label htmlFor="politician-select" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Zgjidhni një Profil</label>
              <select
                id="politician-select"
                value={selectedAnalysisId}
                onChange={(e) => setSelectedAnalysisId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-slate-700"
              >
                {analyses.map(analysis => (
                    <option key={analysis.profileInput.personal.fullName} value={analysis.profileInput.personal.fullName}>
                        {analysis.profileInput.personal.fullName}
                    </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {(!analyses || analyses.length === 0) && (
            <p className="text-center text-slate-500 dark:text-slate-400">Nuk ka analiza të disponueshme për momentin.</p>
        )}

        {selectedAnalysis && (
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl space-y-8 animate-fadeIn">
            
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    Analiza e Profilit: <span className="text-primary-600 dark:text-primary-400">{selectedAnalysis.profileInput.personal.fullName}</span>
                </h2>
            </div>
            
            <FinalDiagnosisDisplay diagnosis={selectedAnalysis.finalDiagnosis} />

            <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-2 text-center">Përmbledhje Vizuale PARAGON®</h3>
              <div className="mx-auto" style={{maxWidth: '400px'}}>
                  <SpiderChart data={paragonChartData} />
              </div>
            </section>

            <KapshAnalysisSection kapschAnalysis={selectedAnalysis.kapschAnalysis} />
            
            <ParagonDimensionDetails paragonScores={derivedParagonScores} />
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-500 text-sm text-blue-800 dark:text-blue-200 rounded-r-lg">
                <p><InformationCircleIcon className="w-5 h-5 inline mr-2" />Kjo analizë gjenerohet nga motori ynë analitik bazuar në të dhënat biografike të strukturuara dhe nuk përfshin të dhëna në kohë reale.</p>
            </div>

          </div>
        )}

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
