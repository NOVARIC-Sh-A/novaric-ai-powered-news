import React from 'react';

interface LikertScaleVoteProps {
  vipId: string | number;
  currentVote: number | null;
  onVote: (rating: number) => void;
}

const likertLabels: { [key: number]: string } = {
  1: "Shumë Negativ",
  2: "Negativ",
  3: "Neutral",
  4: "Pozitiv",
  5: "Shumë Pozitiv",
};

export const LikertScaleVote: React.FC<LikertScaleVoteProps> = ({ vipId, currentVote, onVote }) => {
  const isVotingDisabled = currentVote !== null;

  // Helper function defined inside component scope for safety and consistency.
  const getButtonLabel = (value: number): string => {
    return likertLabels[value] || '';
  };

  return (
    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 text-center sm:text-left">
        Vlerësimi Juaj:
      </p>
      <div className="flex flex-wrap justify-center sm:justify-around items-center gap-x-1 sm:gap-x-0.5">
        {[1, 2, 3, 4, 5].map((rating) => (
          <div key={rating} className="flex flex-col items-center py-1 flex-shrink-0">
            <input
              type="radio"
              id={`vote-${vipId}-${rating}`}
              name={`vote-${vipId}`}
              value={rating}
              checked={currentVote === rating}
              onChange={() => !isVotingDisabled && onVote(rating)}
              disabled={isVotingDisabled}
              className="sr-only peer"
            />
            <label
              htmlFor={`vote-${vipId}-${rating}`}
              className={`
                w-9 h-9 rounded-full border-2 flex items-center justify-center 
                text-sm font-semibold transition-all duration-150
                ${isVotingDisabled 
                  ? (currentVote === rating ? 'bg-primary-500 border-primary-600 text-white scale-110 shadow-lg' : 'bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500 text-slate-400 dark:text-slate-500 cursor-not-allowed')
                  : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-700 hover:border-primary-400 peer-checked:bg-primary-500 peer-checked:border-primary-600 peer-checked:text-white peer-checked:scale-110 peer-checked:shadow-lg'
                }
              `}
              title={likertLabels[rating]}
              aria-label={`Vlerëso me ${rating} - ${likertLabels[rating]}`}
            >
              {rating}
            </label>
            <span className={`mt-1 text-xs text-center w-14 leading-tight ${
              currentVote === rating ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
            }`}>
              {likertLabels[rating]}
            </span>
          </div>
        ))}
      </div>
      {isVotingDisabled && currentVote !== null && (
        <p className="text-xs text-center mt-2 text-slate-600 dark:text-slate-300">
          Vlerësimi juaj: <span className="font-semibold text-primary-600 dark:text-primary-400">{getButtonLabel(currentVote)}</span>
        </p>
      )}
    </div>
  );
};
