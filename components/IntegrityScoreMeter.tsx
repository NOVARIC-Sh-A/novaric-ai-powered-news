import React from 'react';
import { IntegrityReport } from "../types";

interface MeterData {
  angle: number;
  color: string;
  description: string;
}

const getMeterDataForIntegrity = (verdict: IntegrityReport['verdict'], score: number): MeterData => {
  const angle = (score / 100) * 160 - 80; // Map 0-100 score to -80 to 80 degrees

  switch (verdict) {
    case "Integritet i Ulët":
      return { angle, color: '#ef4444', description: 'Artikulli përmban pasaktësi të konsiderueshme ose burime jo të besueshme.' };
    case "Integritet i Moderuar":
      return { angle, color: '#f59e0b', description: 'Artikulli ka disa pasaktësi ose mbështetet në burime të përziera.' };
    case "Integritet i Lartë":
    default:
      return { angle, color: '#22c55e', description: 'Artikulli është përgjithësisht i saktë dhe i mbështetur në burime të besueshme.' };
  }
};

interface IntegrityScoreMeterProps {
    score: number;
    verdict: IntegrityReport['verdict'];
}

export const IntegrityScoreMeter: React.FC<IntegrityScoreMeterProps> = ({ score, verdict }) => {
  const { angle, color, description } = getMeterDataForIntegrity(verdict, score);
  
  return (
    <div className="flex flex-col items-center my-6" role="img" aria-label={`Vlerësimi i Integritetit: ${score}% - ${verdict}`}>
      <div className="relative w-56 h-28">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <defs>
            <linearGradient id="integrityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#integrityGradient)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <g transform={`rotate(${angle} 100 100)`} style={{ transition: 'transform 0.7s ease-in-out' }}>
            <path
              d="M 100 100 L 100 25"
              stroke="#1f2937"
              strokeWidth="3"
              strokeLinecap="round"
              className="dark:stroke-slate-200"
            />
            <circle cx="100" cy="100" r="8" fill="#1f2937" className="dark:fill-slate-200" />
          </g>
        </svg>
      </div>
      <div className="text-center -mt-4">
        <p className="text-2xl font-bold" style={{ color }}>{verdict}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{score}%</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mt-1">{description}</p>
      </div>
    </div>
  );
};