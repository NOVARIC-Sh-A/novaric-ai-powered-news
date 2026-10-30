// components/figurat-politike/SectionBar.tsx
import React from 'react';

interface SectionBarProps {
  title: string;
  subtitle?: string;
  rightNote?: string;
  className?: string;
}

export const SectionBar: React.FC<SectionBarProps> = ({
  title,
  subtitle,
  rightNote,
  className = '',
}) => {
  return (
    <div
      className={`w-full flex items-center justify-between overflow-hidden shadow-sm select-none ${className}`}
      style={{
        background: 'linear-gradient(90deg, var(--nv-navy), var(--nv-navy-2))',
        borderRadius: '8px',
        padding: '7px 14px',
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <h2
          className="uppercase font-bold tracking-wider text-white truncate"
          style={{ fontSize: '11.5px', letterSpacing: '0.08em' }}
        >
          {title}
        </h2>
        {subtitle && (
          <span
            className="hidden sm:inline font-normal truncate"
            style={{ fontSize: '11px', color: 'var(--nv-navy-light)' }}
          >
            — {subtitle}
          </span>
        )}
      </div>

      {rightNote && (
        <div
          className="text-right font-medium shrink-0 ml-3 tracking-wide"
          style={{ fontSize: '10.5px', color: 'var(--nv-navy-light)' }}
        >
          {rightNote}
        </div>
      )}
    </div>
  );
};
