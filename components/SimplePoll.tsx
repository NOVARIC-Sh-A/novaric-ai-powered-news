
import React from 'react';

interface SimplePollProps {
  vipId: string | number;
  currentChoice: string | null; // 'approve', 'neutral', 'disapprove'
  onMakeChoice: (choice: string) => void;
}

const pollOptions: { value: string; label: string; colorClass: string, hoverColorClass: string, selectedColorClass: string, selectedBorderClass: string, selectedTextColorClass: string }[] = [
  { value: 'approve', label: 'Miratoj', colorClass: 'bg-green-500', hoverColorClass: 'hover:bg-green-600', selectedColorClass: 'bg-green-600', selectedBorderClass: 'border-green-700', selectedTextColorClass: 'text-white' },
  { value: 'neutral', label: 'Neutral', colorClass: 'bg-slate-500', hoverColorClass: 'hover:bg-slate-600', selectedColorClass: 'bg-slate-600', selectedBorderClass: 'border-slate-700', selectedTextColorClass: 'text-white' },
  { value: 'disapprove', label: 'Nuk Miratoj', colorClass: 'bg-red-500', hoverColorClass: 'hover:bg-red-600', selectedColorClass: 'bg-red-600', selectedBorderClass: 'border-red-700', selectedTextColorClass: 'text-white' },
];

export const SimplePoll: React.FC<SimplePollProps> = ({ vipId, currentChoice, onMakeChoice }) => {
  const isChoiceDisabled = currentChoice !== null;

  const getButtonLabel = (value: string): string => {
    const option = pollOptions.find(opt => opt.value === value);
    return option ? option.label : '';
  };

  return (
    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-center sm:text-left">
        Sondazh i Shpejtë:
      </p>
      <div className="flex flex-col sm:flex-row justify-center sm:justify-around items-center space-y-2 sm:space-y-0 sm:space-x-2">
        {pollOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => !isChoiceDisabled && onMakeChoice(option.value)}
            disabled={isChoiceDisabled}
            className={`
              w-full sm:w-auto flex-grow px-3 py-1.5 rounded-md text-xs font-semibold border-2
              transition-all duration-150 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-800
              ${isChoiceDisabled
                ? (currentChoice === option.value
                  ? `${option.selectedColorClass} ${option.selectedBorderClass} ${option.selectedTextColorClass} ring-2 ring-offset-2 ${option.selectedBorderClass} shadow-md`
                  : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500 cursor-not-allowed')
                : `${option.colorClass} text-white border-transparent ${option.hoverColorClass} hover:shadow-md focus:ring-primary-400`
              }
            `}
            aria-pressed={currentChoice === option.value}
            aria-label={`Zgjidh ${option.label}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {isChoiceDisabled && currentChoice && (
        <p className="text-xs text-center mt-2 text-slate-600 dark:text-slate-300">
          Zgjedhja juaj: <span className="font-semibold text-primary-600 dark:text-primary-400">{getButtonLabel(currentChoice)}</span>
        </p>
      )}
    </div>
  );
};
