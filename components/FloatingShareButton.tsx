import React, { useState } from 'react';
import { ShareIcon, CheckIcon } from './icons';

interface FloatingShareButtonProps {
  title: string;
  text: string;
  isVisible: boolean;
}

export const FloatingShareButton: React.FC<FloatingShareButtonProps> = ({ title, text, isVisible }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: text,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
        // Silently fail is okay for user cancellations.
      }
    } else if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        } catch (err) {
            console.error('Could not copy URL: ', err);
            alert('Dështoi kopjimi i linkut.');
        }
    } else {
        alert('Shpërndarja nuk mbështetet. Ju lutem kopjoni linkun manualisht.');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-8 z-[53] animate-fadeIn">
        {isCopied && (
            <div 
                className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-800 text-white text-sm font-semibold rounded-md shadow-lg whitespace-nowrap animate-fadeIn" 
                role="status"
            >
                <CheckIcon className="w-4 h-4 inline mr-1.5" />
                Linku u kopjua!
            </div>
        )}
        <button
          onClick={handleShare}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800"
          aria-label="Shpërndaje këtë faqe"
          title="Shpërndaje këtë faqe"
        >
          <ShareIcon className="w-6 h-6" />
        </button>
    </div>
  );
};