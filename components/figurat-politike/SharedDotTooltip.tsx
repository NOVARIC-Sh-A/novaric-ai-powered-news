// components/figurat-politike/SharedDotTooltip.tsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export interface TooltipData {
  text: string;
  dimKey: string;
  dimName: string;
  score: number | string;
  bandText: string;
  x: number;
  y: number;
  visible: boolean;
}

interface TooltipContextType {
  showTooltip: (data: Omit<TooltipData, 'visible'>) => void;
  hideTooltip: () => void;
}

const TooltipContext = createContext<TooltipContextType>({
  showTooltip: () => {},
  hideTooltip: () => {},
});

export const useDotTooltip = () => useContext(TooltipContext);

export const SharedDotTooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tooltip, setTooltip] = useState<TooltipData>({
    text: '',
    dimKey: '',
    dimName: '',
    score: '',
    bandText: '',
    x: 0,
    y: 0,
    visible: false,
  });

  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = useCallback((data: Omit<TooltipData, 'visible'>) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setTooltip({ ...data, visible: true });
  }, []);

  const hideTooltip = useCallback(() => {
    hideTimerRef.current = setTimeout(() => {
      setTooltip(prev => ({ ...prev, visible: false }));
    }, 80);
  }, []);

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      {children}
      {tooltip.visible && (
        <div
          role="tooltip"
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded text-xs shadow-lg transition-opacity duration-150"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 8}px`,
            backgroundColor: 'var(--nv-navy)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="flex items-center gap-1.5 font-medium tracking-tight">
            <span>
              <strong className="text-white font-semibold">{tooltip.dimKey} {tooltip.dimName}</strong>
              <span className="mx-1 text-slate-300">—</span>
              <span className="tabular-nums font-semibold text-white">{tooltip.score}/100</span>
              <span className="mx-1 text-slate-300">·</span>
              <span style={{ color: 'var(--nv-navy-light)' }}>{tooltip.bandText}</span>
            </span>
          </div>
          {/* Subtle triangle indicator */}
          <div
            className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45"
            style={{ backgroundColor: 'var(--nv-navy)' }}
          />
        </div>
      )}
    </TooltipContext.Provider>
  );
};
