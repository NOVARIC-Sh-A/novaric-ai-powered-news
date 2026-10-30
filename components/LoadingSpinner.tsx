
import React from 'react';

interface LoadingSpinnerProps {
  countdown?: number;
  retryMessage?: string | null;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ countdown, retryMessage }) => {
  let message: React.ReactNode = "Duke analizuar pretendimin...";

  if (retryMessage) {
    message = retryMessage;
  } else if (countdown !== undefined && countdown !== null) {
    if (countdown > 0) {
      message = (
        <span>
          Duke analizuar pretendimin... Mbeten{' '}
          <span className="font-bold text-xl text-primary-600 dark:text-primary-400 font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md">
            {countdown}
          </span>
          {' '}sekonda.
        </span>
      );
    } else {
      message = "Analiza po zgjat më shumë se zakonisht... Ju lutemi prisni.";
    }
  }
  
  return (
    <div className="flex justify-center items-center py-10 flex-col gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary-500"></div>
      <p className="text-slate-600 dark:text-slate-300 text-lg text-center">{message}</p>
    </div>
  );
};
