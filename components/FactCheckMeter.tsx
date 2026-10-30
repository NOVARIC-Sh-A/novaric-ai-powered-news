import React from 'react';
import { VerdictLabel } from '../types';

interface MeterData {
  angle: number;
  color: string;
  description: string;
}

const getMeterData = (verdict: VerdictLabel): MeterData => {
  switch (verdict) {
    case VerdictLabel.FALSE:
      return { angle: -80, color: '#ef4444', description: 'Pretendimi është tërësisht i pabazuar në fakte.' }; // red-500
    case VerdictLabel.MOSTLY_FALSE:
      return { angle: -50, color: '#f97316', description: 'Pretendimi përmban disa elemente të vërteta, por thelbi është i gabuar ose mashtrues.' }; // orange-500
    case VerdictLabel.MISLEADING:
        return { angle: -25, color: '#f59e0b', description: 'Pretendimi mund të jetë teknikisht i vërtetë por paraqitet në një mënyrë që krijon një përshtypje të gabuar.' }; // amber-500
    case VerdictLabel.HALF_TRUE:
      return { angle: 0, color: '#eab308', description: 'Pretendimi përmban një përzierje të konsiderueshme faktesh të sakta dhe të pasakta.' }; // yellow-500
    case VerdictLabel.MOSTLY_TRUE:
      return { angle: 50, color: '#84cc16', description: 'Pretendimi është përgjithësisht i saktë, por me disa pasaktësi të vogla ose mungesë konteksti.' }; // lime-500
    case VerdictLabel.TRUE:
      return { angle: 80, color: '#22c55e', description: 'Pretendimi është plotësisht i saktë dhe i mbështetur nga provat.' }; // green-500
    case VerdictLabel.UNVERIFIABLE:
    case VerdictLabel.CANNOT_DETERMINE:
    case VerdictLabel.UNKNOWN:
    default:
      return { angle: 0, color: '#64748b', description: 'Nuk ka prova të mjaftueshme për të vlerësuar saktësinë e pretendimit.' }; // slate-500
  }
};

export const FactCheckMeter: React.FC<{ verdict: VerdictLabel }> = ({ verdict }) => {
  const { angle, color, description } = getMeterData(verdict);
  
  return (
    <div className="flex flex-col items-center my-8" role="img" aria-label={`Verdikti: ${verdict}`}>
      <div className="relative w-56 h-28">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Meter Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          {/* Needle */}
          <g transform={`rotate(${angle} 100 100)`}>
            <path
              d="M 100 100 L 100 25"
              stroke="#1f2937"
              strokeWidth="3"
              strokeLinecap="round"
              className="dark:stroke-slate-200 transition-transform duration-700 ease-in-out"
            />
            <circle cx="100" cy="100" r="8" fill="#1f2937" className="dark:fill-slate-200" />
          </g>
        </svg>
      </div>
      <div className="text-center -mt-4">
        <p className="text-2xl font-bold" style={{ color }}>{verdict}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mt-1">{description}</p>
      </div>
    </div>
  );
};