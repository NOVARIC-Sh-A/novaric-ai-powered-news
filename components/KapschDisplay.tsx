import React from 'react';
import { FullProfileAnalysis, PerformancePortfolioItem } from '../types';

const AnalysisCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-50/70 dark:bg-slate-900/60 p-4 rounded-lg shadow-md border border-white/20 dark:border-slate-700/50 h-full">
        <h3 className="text-lg font-bold text-primary-700 dark:text-primary-500 mb-3 border-b border-primary-500/20 pb-2">{title}</h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {children}
        </div>
    </div>
);

const PerformancePortfolioCard: React.FC<{ item: PerformancePortfolioItem }> = ({ item }) => (
    <div className="bg-slate-100/70 dark:bg-slate-800/70 p-2 rounded-md">
        <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200">{item.event}</h5>
        {item.competencies && <p className="text-xs mt-1"><strong>Aftësitë:</strong> <span className="text-green-600 dark:text-green-400">{item.competencies.join(', ')}</span></p>}
        {item.skillGaps && <p className="text-xs mt-1"><strong>Mungesat:</strong> <span className="text-red-600 dark:text-red-400">{item.skillGaps.join(', ')}</span></p>}
    </div>
);

export const KapschDisplay: React.FC<{ kapschAnalysis: FullProfileAnalysis['kapschAnalysis'] }> = ({ kapschAnalysis }) => {
    const { layer1_psychometricProfile, layer2_matrixProfile, layer3_performancePortfolio } = kapschAnalysis;

    return (
        <section className="bg-white/70 dark:bg-slate-800/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-200">
                Analiza e Thelluar KAPSH
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalysisCard title="Shtresa I: Bërthama Psikometrike">
                    {Object.entries(layer1_psychometricProfile).map(([trait, data]) => (
                        <p key={trait}>
                          {/* FIX: Cast `data` to `any` to resolve properties 'rating' and 'evidence' not existing on type 'unknown'. */}
                          <strong className="capitalize">{trait.replace(/([A-Z])/g, ' $1').replace('To Experience', ' ndaj Përvojës').replace('Conscientiousness', 'Ndërgjegjshmëria').replace('Extraversion', 'Ekstraversioni').replace('Agreeableness', 'Pajtueshmëria').replace('Emotional Stability', 'Stabiliteti Emocional')}:</strong> {(data as any).rating}
                        </p>
                    ))}
                </AnalysisCard>
                <AnalysisCard title="Shtresa II: Matrica e Formësimit">
                    <p><strong>Arketipi:</strong> {layer2_matrixProfile.archetype}</p>
                    <p><strong>Orientimi Formal:</strong> {layer2_matrixProfile.formal_euro_atlantic_score}/10</p>
                    <p><strong>Orientimi Informal:</strong> {layer2_matrixProfile.informal_albanian_score}/10</p>
                </AnalysisCard>
                <AnalysisCard title="Shtresa III: Portofoli i Performancës">
                     <div className="space-y-2">
                        {layer3_performancePortfolio.slice(0, 3).map((item, i) => ( // Show up to 3 for brevity
                           <PerformancePortfolioCard key={i} item={item} />
                       ))}
                   </div>
                </AnalysisCard>
            </div>
        </section>
    );
};
