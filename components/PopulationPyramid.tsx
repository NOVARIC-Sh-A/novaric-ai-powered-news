import React from 'react';

interface PopulationPyramidProps {
  data: {
    ageGroup: string;
    male: number;
    female: number;
  }[];
}

export const PopulationPyramid: React.FC<PopulationPyramidProps> = ({ data }) => {
  const maxPopulation = Math.max(...data.flatMap(d => [d.male, d.female]));

  return (
    <div className="w-full space-y-1">
      {data.map((group, index) => (
        <div key={index} className="flex items-center text-xs">
          {/* Male Bar */}
          <div className="w-1/2 flex items-center justify-end pr-2">
            <span className="mr-2 text-slate-600 dark:text-slate-400">{group.male.toLocaleString('sq-AL')}</span>
            <div
              className="h-5 bg-blue-500 rounded-l-sm transition-all duration-300"
              style={{ width: `${(group.male / maxPopulation) * 100}%` }}
              title={`Meshkuj, Mosha ${group.ageGroup}: ${group.male.toLocaleString('sq-AL')}`}
            ></div>
          </div>
          
          {/* Age Group Label */}
          <div className="w-12 text-center font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
            {group.ageGroup}
          </div>

          {/* Female Bar */}
          <div className="w-1/2 flex items-center pl-2">
            <div
              className="h-5 bg-pink-500 rounded-r-sm transition-all duration-300"
              style={{ width: `${(group.female / maxPopulation) * 100}%` }}
               title={`Femra, Mosha ${group.ageGroup}: ${group.female.toLocaleString('sq-AL')}`}
            ></div>
            <span className="ml-2 text-slate-600 dark:text-slate-400">{group.female.toLocaleString('sq-AL')}</span>
          </div>
        </div>
      ))}
      <div className="flex items-center text-xs mt-2">
          <div className="w-1/2 text-right pr-2 flex justify-end items-center"><span className="w-2 h-2 bg-blue-500 rounded-sm mr-1.5"></span>Meshkuj</div>
          <div className="w-12"></div>
          <div className="w-1/2 text-left pl-2 flex items-center"><span className="w-2 h-2 bg-pink-500 rounded-sm mr-1.5"></span>Femra</div>
      </div>
    </div>
  );
};