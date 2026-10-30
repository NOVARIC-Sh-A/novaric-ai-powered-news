import React, { useState, useEffect } from 'react';
import { ClockIcon } from './icons';

interface TimeZone {
  city: string;
  timeZone: string;
}

const timeZones: TimeZone[] = [
  { city: 'Los Angeles', timeZone: 'America/Los_Angeles' },
  { city: 'New York', timeZone: 'America/New_York' },
  { city: 'Bogota', timeZone: 'America/Bogota' },
  { city: 'Sao Paulo', timeZone: 'America/Sao_Paulo' },
  { city: 'London', timeZone: 'Europe/London' },
  { city: 'Tirana', timeZone: 'Europe/Tirane' },
  { city: 'Moscow', timeZone: 'Europe/Moscow' },
  { city: 'Dubai', timeZone: 'Asia/Dubai' },
  { city: 'Shanghai', timeZone: 'Asia/Shanghai' },
  { city: 'Tokyo', timeZone: 'Asia/Tokyo' },
  { city: 'Sydney', timeZone: 'Australia/Sydney' },
];

interface DisplayTime extends TimeZone {
    time: string;
    uniqueDisplayId: string;
}

const formatTime = (date: Date, timeZone: string): string => {
  return new Intl.DateTimeFormat('sq-AL', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timeZone,
  }).format(date);
};

export const WorldTimeTicker: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const duplicatedItems: DisplayTime[] = [...timeZones, ...timeZones].map((tz, index) => ({
    ...tz,
    time: formatTime(currentTime, tz.timeZone),
    uniqueDisplayId: `${tz.city}-${index}`
  }));
  
  const estimatedTotalCharsPerRow = timeZones.length * 20; // Avg chars per item
  const charsPerSecond = 20;
  const animationDuration = Math.max(25, Math.ceil(estimatedTotalCharsPerRow / charsPerSecond));

  return (
    <div className="overflow-hidden">
      <div 
        className="relative flex-grow h-8 flex items-center overflow-hidden" 
        aria-label="Ora aktuale në qytete të ndryshme të botës"
        role="list"
      >
        <div
          className="absolute flex items-center animate-worldTicker hover:pause-animation"
          style={{ '--ticker-duration': `${animationDuration}s` } as React.CSSProperties}
        >
          {duplicatedItems.map((item) => (
            <React.Fragment key={item.uniqueDisplayId}>
              <div className="flex items-center text-sm font-semibold text-slate-100 whitespace-nowrap px-4 py-1.5 rounded-full bg-slate-700/40 backdrop-blur-sm">
                <ClockIcon className="w-4 h-4 mr-2" />
                <span>{item.city}:</span>
                <span className="ml-1.5 font-mono tracking-wider">{item.time}</span>
              </div>
              <span className="text-slate-400 dark:text-slate-500 mx-3 select-none" aria-hidden="true">&bull;</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes worldTickerAnimation {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-worldTicker {
          animation: worldTickerAnimation var(--ticker-duration, 40s) linear infinite;
          will-change: transform;
        }
        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};