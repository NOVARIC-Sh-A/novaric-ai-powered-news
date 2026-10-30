import React from 'react';
import { VipProfile } from '../types';

interface Props {
  profile: VipProfile;
}

export const ProfileImprovementChecklist: React.FC<Props> = ({ profile }) => {
  // 1. Get the list from the Backend (Advisor Module)
  const tasks = profile.improvement_checklist || [];

  // 2. Safety Check: If no tasks are returned (e.g., loading or error), hide the component
  if (tasks.length === 0) return null;

  return (
    <div className="mt-6 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r-lg shadow-sm overflow-hidden">
      
      {/* HEADER */}
      <div className="bg-amber-100/50 dark:bg-amber-900/30 p-4 border-b border-amber-200/50">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-amber-700 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 className="font-bold text-amber-900 dark:text-amber-100 uppercase text-xs tracking-wider">
            Udhëzues i Bazuar në Kërkim Akademik
          </h3>
        </div>
      </div>

      {/* BODY: Dynamic Mapping from Python Data */}
      <div className="p-4 space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className={`group relative pl-2 transition-opacity ${task.is_completed ? 'opacity-50' : 'opacity-100'}`}>
            
            <div className="flex items-start gap-3">
              {/* Checkbox Icon */}
              <div className="pt-1">
                {task.is_completed ? (
                   <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center">
                     <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                   </div>
                ) : (
                   <div className="w-4 h-4 rounded border-2 border-amber-400 bg-white dark:bg-slate-800"></div>
                )}
              </div>

              <div className="flex flex-col">
                {/* The Task Text */}
                <span className={`text-sm font-medium leading-snug ${task.is_completed ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                  {task.task}
                </span>

                {/* The Academic Citation */}
                {!task.is_completed && (
                  <div className="mt-1 flex items-center gap-2 text-[10px]">
                    <span className="text-slate-400 uppercase tracking-tighter font-bold">Burimi:</span>
                    <span className="text-amber-700 dark:text-amber-400 font-serif italic bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                      {task.academic_ref}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="bg-amber-100/30 dark:bg-amber-900/20 p-3 text-center border-t border-amber-200/50">
        <p className="text-[10px] text-amber-800/70 dark:text-amber-400/70 italic">
          Rekomandimet bazohen në standardet e revistave të shkencave politike (Top-Tier Journals).
        </p>
      </div>
    </div>
  );
};