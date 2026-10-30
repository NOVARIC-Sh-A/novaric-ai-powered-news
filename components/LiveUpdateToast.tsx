import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useInterval } from '../hooks/useInterval';
import { BreakingNewsItemData } from '../types';
import { fetchAppData } from '../services/dataService';
import { ArrowPathIcon } from './icons';

interface LiveUpdateToastProps {
  currentNews: BreakingNewsItemData[];
  onRefresh: () => void;
}

export const LiveUpdateToast: React.FC<LiveUpdateToastProps> = ({ currentNews, onRefresh }) => {
    const [hasNewer, setHasNewer] = useState(false);
    const POLLING_INTERVAL = 45000; // 45 seconds

    // Get the ID of the latest article currently displayed. Memoize it to prevent re-running on every render.
    const latestId = useMemo(() => {
        if (!currentNews || currentNews.length === 0) return null;
        // Assuming news is sorted by date descending, the first item is the latest.
        return currentNews[0].id;
    }, [currentNews]);

    // useInterval hook to poll for new data
    useInterval(async () => {
        // Don't re-check if the toast is already visible or if there's no baseline ID
        if (hasNewer || latestId === null) return;
        
        try {
            const data = await fetchAppData();
            if (data.news.length > 0) {
                const newLatestId = data.news[0].id;
                // If the new latest ID is different from our current latest ID, show the toast
                if (newLatestId !== latestId) {
                    setHasNewer(true);
                }
            }
        } catch (error) {
            console.error("Error during live update check:", error);
        }
    }, POLLING_INTERVAL);

    const handleRefresh = () => {
        onRefresh();
        setHasNewer(false);
    };

    if (!hasNewer) {
        return null;
    }

    return ReactDOM.createPortal(
        <div 
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-slide-down"
            role="alert"
            aria-live="assertive"
        >
            <div className="bg-primary-600 text-white rounded-full shadow-lg flex items-center p-2">
                <span className="font-semibold text-sm px-3">Ka lajme të reja!</span>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-1 bg-white text-primary-600 font-bold text-sm px-3 py-1 rounded-full hover:bg-slate-200 transition-colors"
                    aria-label="Rifresko lajmet"
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    Rifresko
                </button>
            </div>
             <style>{`
                @keyframes slide-down-fade-in {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                .animate-slide-down {
                    animation: slide-down-fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>,
        document.getElementById('toast-portal') as HTMLElement
    );
};