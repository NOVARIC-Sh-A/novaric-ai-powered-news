import React from 'react';
import { ProfileInput } from '../types';

interface AcademicBackgroundProps {
  educationHistory: ProfileInput['educationHistory'];
}

export const AcademicBackground: React.FC<AcademicBackgroundProps> = ({ educationHistory }) => {
  return (
    <section className="bg-white/70 dark:bg-slate-800/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-slate-200">
        Themelimi Akademik
      </h2>
      <ul className="list-disc list-inside space-y-2 max-w-2xl mx-auto text-slate-700 dark:text-slate-300">
        {educationHistory.map((edu, index) => (
          <li key={index}>
            <strong>{edu.degree}</strong>, {edu.institution}, {edu.location}
          </li>
        ))}
      </ul>
    </section>
  );
};
