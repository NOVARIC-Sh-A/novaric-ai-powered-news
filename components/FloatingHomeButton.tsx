import React from 'react';
import { HomeIcon } from './icons';

interface FloatingHomeButtonProps {
  onNavigateHome: () => void;
}

export const FloatingHomeButton: React.FC<FloatingHomeButtonProps> = ({ onNavigateHome }) => {
  return (
    <button
      onClick={onNavigateHome}
      className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white font-bold p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out z-[53] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800 animate-fadeIn"
      aria-label="Kthehu te faqja kryesore"
      title="Kthehu te faqja kryesore"
    >
      <HomeIcon className="w-6 h-6" />
    </button>
  );
};