import React from 'react';
import { ArticleIntegrityProfile } from './ArticleIntegrityProfile';
import { LightBulbIcon } from './icons';
import { ArticleIntegrityProfileData, ArticleMetrics } from '../types';

interface Props {
  cqaData: ArticleIntegrityProfileData;
  metrics?: ArticleMetrics; // Added to pass through to AIP
}

const RecommendationBox: React.FC<{ recommendations: ArticleIntegrityProfileData['recommendations'] }> = ({ recommendations }) => {
    if (!recommendations) return null;
    const hasRecommendations = (recommendations.structural?.length || 0) > 0 || (recommendations.coherence?.length || 0) > 0;
    if (!hasRecommendations) return null;

    return (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-500 rounded-r-lg text-sm">
            <h4 className="font-bold text-blue-800 dark:text-blue-200 flex items-center mb-2">
                <LightBulbIcon className="w-5 h-5 mr-2" />
                Rekomandime për Përmirësim
            </h4>
            <div className="space-y-3 text-blue-700 dark:text-blue-300">
                {recommendations.structural && recommendations.structural.length > 0 && (
                    <div>
                        <h5 className="font-semibold">Për Besueshmërinë Strukturore:</h5>
                        <ul className="list-disc list-inside pl-2 space-y-1 mt-1">
                            {recommendations.structural.map((rec, i) => <li key={`s-${i}`}>{rec}</li>)}
                        </ul>
                    </div>
                )}
                {recommendations.coherence && recommendations.coherence.length > 0 && (
                    <div>
                        <h5 className="font-semibold">Për Koherencën Logjike:</h5>
                        <ul className="list-disc list-inside pl-2 space-y-1 mt-1">
                             {recommendations.coherence.map((rec, i) => <li key={`c-${i}`}>{rec}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};


export const ContentQualityAssurance: React.FC<Props> = ({ cqaData, metrics }) => {
  return (
    <div>
        {/* Render the actual AIP component with live data */}
        <ArticleIntegrityProfile aipData={cqaData} metrics={metrics} />
        
        {/* Conditionally render the recommendations box */}
        <RecommendationBox recommendations={cqaData.recommendations} />
    </div>
  );
};