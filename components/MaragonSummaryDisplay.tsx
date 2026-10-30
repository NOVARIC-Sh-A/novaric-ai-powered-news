import React from 'react';
import { MaragonDimensionScores } from '../types';

const Bar: React.FC<{ label: string, score: number, color: string }> = ({ label, score, color }) => (
    <div className="w-full">
        <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{label}</span>
            <span className="font-bold" style={{ color }}>{score}</span>
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-600 rounded-full">
            <div className="h-2 rounded-full" style={{ width: `${score}%`, backgroundColor: color, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
    </div>
);

export const MaragonSummaryDisplay: React.FC<{ scores: MaragonDimensionScores }> = ({ scores }) => {
    return (
        <div className="space-y-3">
            <Bar label="Readiness (Gatishmëria)" score={scores.Readiness} color="#ef4444" />
            <Bar label="Aptitude (Aftësia)" score={scores.Aptitude} color="#3b82f6" />
            <Bar label="Governance (Qeverisja)" score={scores.Governance} color="#22c55e" />
            <Bar label="Oversight (Mbikëqyrja)" score={scores.OversightNurturing} color="#f97316" />
        </div>
    );
};