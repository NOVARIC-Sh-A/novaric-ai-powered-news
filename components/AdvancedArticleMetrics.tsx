import React, { useState } from 'react';
import { 
    ShieldCheckIcon, EyeIcon, HeartIcon, CubeTransparentIcon, 
    MagnifyingGlassIcon, ChevronUpIcon, InformationCircleIcon 
} from './icons';
import { ArticleEvaluationData, MetricEvaluationCategory, MetricEvaluation } from '../types';

interface AdvancedArticleMetricsProps {
  evaluation: ArticleEvaluationData;
  onNavigateToExplanation: (sectionId: string) => void;
}

const isDarkMode = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const CircularProgressBar: React.FC<{ percentage: number; text: string; color: string; }> = ({ percentage, text, color }) => {
    const radius = 50;
    const stroke = 10;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <svg height="120" width="120" viewBox="0 0 120 120" className="transform -rotate-90">
            <circle
                stroke={isDarkMode() ? '#334155' : '#e2e8f0'}
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius + stroke / 2}
                cy={radius + stroke / 2}
            />
            <circle
                stroke={color}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.7s ease-out' }}
                r={normalizedRadius}
                cx={radius + stroke / 2}
                cy={radius + stroke / 2}
                strokeLinecap="round"
            />
             <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                className="text-lg font-bold"
                fill={isDarkMode() ? '#f1f5f9' : '#1e293b'}
                transform={`rotate(90 60 60)`}
            >
                {text}
            </text>
        </svg>
    );
};


const MetricRow: React.FC<{ label: string; data: MetricEvaluation }> = ({ label, data }) => {
  const categoryStyles: { [key in MetricEvaluationCategory | 'Mesatare']: string } = {
    'E Lartë': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    'Mesatare': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    'Mesatare e Ulët': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
    'E Ulët': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  };

  const displayValue = typeof data.value === 'boolean' ? (data.value ? 'Po' : 'Jo') : data.value;

  return (
    <div className="flex justify-between items-center text-sm py-3 px-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-md">
      <p className="text-slate-600 dark:text-slate-400">{label}:</p>
      <div className="flex items-center gap-x-3">
        <span className="font-bold text-slate-800 dark:text-slate-200">{String(displayValue)}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryStyles[data.category]}`}>
          {data.category}
        </span>
      </div>
    </div>
  );
};


export const AdvancedArticleMetrics: React.FC<AdvancedArticleMetricsProps> = ({ evaluation, onNavigateToExplanation }) => {
    const [openSection, setOpenSection] = useState<string | null>('credibility');

    if (!evaluation) return null;

    const scorePercentage = (parseFloat(evaluation.overallScore) / 4) * 100;
    const scoreColor = 
      scorePercentage >= 87.5 ? '#22c55e' : // High (score >= 3.5)
      scorePercentage >= 62.5 ? '#3b82f6' : // Medium (score >= 2.5)
      scorePercentage >= 37.5 ? '#f59e0b' : // MediumLow (score >= 1.5)
      '#ef4444'; // Low

    const sections = [
        { key: 'credibility', title: 'Besueshmëria', icon: <ShieldCheckIcon className="w-5 h-5" />, data: evaluation.breakdown.credibility, items: [
            { label: 'Pretendime të Verifikuara', key: 'verifiedClaims' },
            { label: 'Raporti i Bur. Parësore', key: 'primarySourceRatio' },
        ]},
        { key: 'readability', title: 'Lexueshmëria', icon: <EyeIcon className="w-5 h-5" />, data: evaluation.breakdown.readability, items: [
            { label: 'Niveli i Leximit (FK)', key: 'fleschKincaidLevel' },
            { label: 'Përqindja e Zërit Pasiv', key: 'passiveVoicePercentage' },
        ]},
        { key: 'biasAndSentiment', title: 'Anshmëria & Sentimenti', icon: <HeartIcon className="w-5 h-5" />, data: evaluation.breakdown.biasAndSentiment, items: [
            { label: 'Sentimenti i Përgjithshëm', key: 'overallSentiment' },
            { label: 'Përqindja e Subjektivitetit', key: 'subjectivityPercentage' },
        ]},
        { key: 'lifecycleAndCompliance', title: 'Cikli i Jetës & Përputhshmëria', icon: <CubeTransparentIcon className="w-5 h-5" />, data: evaluation.breakdown.lifecycleAndCompliance, items: [
            { label: 'Deklarata të Pranishme', key: 'hasDisclosures' },
        ]},
        { key: 'seoAndAccessibility', title: 'SEO & Aksesueshmëria', icon: <MagnifyingGlassIcon className="w-5 h-5" />, data: evaluation.breakdown.seoAndAccessibility, items: [
            { label: 'Mbulimi me Tekst Alt.', key: 'altTextCoverage' },
        ]},
    ];
    
    const handleToggle = (key: string) => {
        setOpenSection(openSection === key ? null : key);
    };

    return (
        <aside className="my-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg font-sans">
            <div className="p-5 flex flex-col items-center border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Vlerësimi i Integritetit të Artikullit</h2>
                <div style={{ width: 120, height: 120 }}>
                    <CircularProgressBar
                        percentage={scorePercentage}
                        text={evaluation.overallCategory}
                        color={scoreColor}
                    />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                    Rezultati i ponderuar: <strong className="text-slate-700 dark:text-slate-200">{evaluation.overallScore} / 4.00</strong>
                </p>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {sections.map(section => {
                    const sectionData = section.data as { [key: string]: MetricEvaluation };
                    if (!sectionData) return null;

                    return (
                        <div key={section.key}>
                            <button onClick={() => handleToggle(section.key)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/40 focus:outline-none">
                                <div className="flex items-center">
                                    <span className="mr-3 text-blue-600 dark:text-blue-400">{section.icon}</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{section.title}</span>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onNavigateToExplanation(section.key); }}
                                        className="mr-2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500"
                                        aria-label={`Mëso më shumë rreth ${section.title}`}
                                        title={`Mëso më shumë rreth ${section.title}`}
                                    >
                                        <InformationCircleIcon className="w-5 h-5" />
                                    </button>
                                    <ChevronUpIcon className={`w-5 h-5 text-slate-500 transition-transform ${openSection === section.key ? 'rotate-0' : 'rotate-180'}`} />
                                </div>
                            </button>
                            {openSection === section.key && (
                                <div className="px-4 pb-4">
                                    {section.items.map(item => {
                                        const metricData = sectionData[item.key];
                                        return metricData ? <MetricRow key={item.label} label={item.label} data={metricData} /> : null;
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-xl">
                <button onClick={() => onNavigateToExplanation('')} className="w-full flex items-center justify-center text-sm font-semibold text-red-600 dark:text-red-400 hover:underline">
                    <InformationCircleIcon className="w-5 h-5 mr-2" />
                    Çfarë do të thonë këto metrika?
                </button>
            </div>
        </aside>
    );
};