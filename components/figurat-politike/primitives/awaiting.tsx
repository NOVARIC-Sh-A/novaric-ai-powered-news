import React from 'react';

// Shared empty-state copy for politician profile sections.
export const AWAITING_DATA = 'Në pritje të të dhënave / Awaiting data';
export const NOT_SCORED = 'Nuk pikëzohet / Not scored';

export function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export const AwaitState: React.FC<{ className?: string }> = ({ className = '' }) => (
  <p className={`text-xs text-slate-500 dark:text-slate-400 text-center py-6 ${className}`}>
    {AWAITING_DATA}
  </p>
);
