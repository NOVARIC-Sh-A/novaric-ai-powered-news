// components/figurat-politike/FingerprintLegend.tsx
import React, { useState } from 'react';
import { CANONICAL_PARAGON_DIMENSIONS } from '../../types/politician';

interface FingerprintLegendProps {
  className?: string;
}

export const FingerprintLegend: React.FC<FingerprintLegendProps> = ({ className = '' }) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div
      id="fingerprint-legend"
      className={`w-full rounded-lg shadow-sm border transition-all text-left ${className}`}
      style={{
        backgroundColor: 'var(--nv-tint-bg)',
        borderColor: 'var(--nv-tint-border)',
        borderLeftWidth: '3px',
        borderLeftColor: 'var(--nv-navy)',
      }}
    >
      {/* Mobile Header with Toggle Button */}
      <div className="flex items-center justify-between p-2.5 sm:hidden">
        <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--nv-navy)' }}>
          <span>Udhëzuesi i Fingerprint-it PARAGON®</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border"
          style={{
            borderColor: 'var(--nv-tint-border)',
            color: 'var(--nv-navy)',
            backgroundColor: 'var(--nv-card-bg)',
          }}
          aria-label="Toggle Legend"
        >
          {isOpenMobile ? '×' : '?'}
        </button>
      </div>

      {/* Content Area - always visible on sm+, toggled on mobile */}
      <div className={`p-3 sm:p-3.5 space-y-2.5 ${isOpenMobile ? 'block' : 'hidden sm:block'}`}>
        {/* Row 1: Dimension Key (Fixed 1->7 order) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] leading-relaxed">
          {CANONICAL_PARAGON_DIMENSIONS.map((dim) => (
            <div key={dim.key} className="flex items-center gap-1">
              <span
                className="font-black px-1 py-0.5 rounded text-[10.5px] tabular-nums"
                style={{
                  backgroundColor: 'rgba(35, 43, 86, 0.1)',
                  color: 'var(--nv-navy)',
                }}
              >
                {dim.id}
              </span>
              <span className="font-medium" style={{ color: 'var(--nv-text-secondary)' }}>
                {dim.name}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2: Score Bands Key (Dashed border top) */}
        <div
          className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]"
          style={{
            borderTop: '1px dashed var(--nv-tint-border)',
          }}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shadow-xs"
                style={{ backgroundColor: 'var(--b-low)' }}
              />
              <span className="font-semibold" style={{ color: 'var(--b-low)' }}>
                &lt;40
              </span>
              <span style={{ color: 'var(--nv-text-secondary)' }}>Kritike</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shadow-xs"
                style={{ backgroundColor: 'var(--b-mid)' }}
              />
              <span className="font-semibold" style={{ color: 'var(--b-mid)' }}>
                40–60
              </span>
              <span style={{ color: 'var(--nv-text-secondary)' }}>Në zhvillim</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shadow-xs"
                style={{ backgroundColor: 'var(--b-high)' }}
              />
              <span className="font-semibold" style={{ color: 'var(--b-high)' }}>
                60–75
              </span>
              <span style={{ color: 'var(--nv-text-secondary)' }}>E fortë</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shadow-xs"
                style={{ backgroundColor: 'var(--b-top)' }}
              />
              <span className="font-semibold" style={{ color: 'var(--b-top)' }}>
                &gt;75
              </span>
              <span style={{ color: 'var(--nv-text-secondary)' }}>E shkëlqyer</span>
            </div>
          </div>

          <div
            className="text-[10.5px] italic hidden md:inline font-medium"
            style={{ color: 'var(--nv-navy-muted)' }}
          >
            kaloni kursorin mbi një pikë për detaje
          </div>
        </div>
      </div>
    </div>
  );
};
