import React from 'react';

interface TimelineEvent {
  year: string;
  title: string;
  description?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="w-full relative pl-8 border-l-2 border-slate-200 dark:border-slate-700 space-y-10">
      {events.map((event, index) => (
        <div key={index} className="relative">
          {/* Node */}
          <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 shadow-sm z-10"></div>
          
          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
            {event.year}
          </span>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-md uppercase leading-tight">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 mt-1">
              {event.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
