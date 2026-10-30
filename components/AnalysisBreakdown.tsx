import React, { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface AnalysisBreakdownProps {
  truePoints: string[];
  falsePoints: string[];
}

export const AnalysisBreakdown: React.FC<AnalysisBreakdownProps> = ({ truePoints, falsePoints }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const totalPoints = truePoints.length + falsePoints.length;

  useEffect(() => {
    if (chartRef.current && totalPoints > 0) {
      const data = [
        { label: "Fakte të Vërteta", value: truePoints.length },
        { label: "Pika të Gabuara", value: falsePoints.length }
      ].filter(d => d.value > 0);

      if (data.length === 0) {
          chartRef.current.innerHTML = '';
          return;
      }

      const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      const chart = Plot.plot({
        marginLeft: 110,
        height: data.length > 1 ? 120 : 80, // Make it shorter for a single bar
        style: {
          backgroundColor: "transparent",
          color: isDarkMode ? "#cbd5e1" : "#475569", // slate-300 / slate-600
          fontSize: "12px",
        },
        x: {
          grid: true,
          label: "Numri i Pikave →",
          tickFormat: "d" 
        },
        y: {
          domain: data.map(d => d.label).reverse()
        },
        marks: [
          Plot.barX(data, {
            x: "value",
            y: "label",
            fill: d => d.label === "Fakte të Vërteta" ? "#22c55e" : "#ef4444", // green-500 / red-500
            ariaLabel: d => `${d.label}: ${d.value}`
          }),
          Plot.text(data, {
            x: "value",
            y: "label",
            text: "value",
            dx: -15,
            fill: "white",
            fontWeight: "bold"
          })
        ]
      });

      chartRef.current.innerHTML = '';
      chartRef.current.append(chart);

      return () => {
        if (chartRef.current) {
            chartRef.current.innerHTML = '';
        }
      };
    }
  }, [truePoints, falsePoints, totalPoints]);

  if (totalPoints === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">Ndarja e Analizës</h3>
      
      <div ref={chartRef} className="w-full my-2 flex justify-center" />
      
      <div className="space-y-4 mt-6">
        {truePoints.length > 0 && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-700">
            <h4 className="flex items-center font-semibold text-green-800 dark:text-green-300">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Argumente Pro (Fakte të Vërteta)
            </h4>
            <ul className="list-disc list-inside mt-2 pl-4 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {truePoints.map((point, index) => <li key={`true-${index}`}>{point}</li>)}
            </ul>
          </div>
        )}
        {falsePoints.length > 0 && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700">
            <h4 className="flex items-center font-semibold text-red-800 dark:text-red-300">
              <XCircleIcon className="w-5 h-5 mr-2" />
              Argumente Kundër (Pika të Gabuara)
            </h4>
            <ul className="list-disc list-inside mt-2 pl-4 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {falsePoints.map((point, index) => <li key={`false-${index}`}>{point}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};