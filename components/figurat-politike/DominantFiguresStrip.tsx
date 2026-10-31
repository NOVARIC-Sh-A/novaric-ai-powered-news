// components/figurat-politike/DominantFiguresStrip.tsx
import React from 'react';
import { VipProfile } from '../../types';
import { partyColor, normalizePartySlug } from '../../lib/brand-tokens';
import { zodiacSign } from '../../lib/zodiac';
import { AWAITING_DATA } from './primitives/awaiting';

interface DominantFiguresStripProps {
  politicians: VipProfile[];
  onSelectPolitician?: (id: string | number) => void;
}

export const DominantFiguresStrip: React.FC<DominantFiguresStripProps> = ({
  politicians,
  onSelectPolitician,
}) => {
  // Key figures for overview strip
  const topFigures = politicians.slice(0, 4);

  if (topFigures.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full" id="dominant-figures-strip">
      {topFigures.map((item, index) => {
        const partySlug = (item as any).party || normalizePartySlug(item.category);
        const pc = partyColor(partySlug);
        const dob = (item as any).dateOfBirth || item.dateOfBirth;
        const zodiac = zodiacSign(dob);
        const targetId = item.numericId || item.id;
        const linkHref = `/figurat-politike/${targetId}`;

        const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
          if (onSelectPolitician) {
            e.preventDefault();
            // Update browser location cleanly for deep linking
            if (window.history && window.history.pushState) {
              window.history.pushState({}, '', linkHref);
            }
            onSelectPolitician(targetId);
          }
        };

        const primaryRole = (item as any).primaryRole || AWAITING_DATA;

        return (
          <a
            key={item.id}
            id={`dominant-figure-${index + 1}`}
            href={linkHref}
            onClick={handleClick}
            className="group relative rounded-lg p-3 shadow-sm border transition-all duration-200 block text-left hover:-translate-y-0.5 cursor-pointer"
            style={{
              backgroundColor: 'var(--nv-card-bg)',
              borderColor: 'var(--nv-card-border)',
              borderTopWidth: '3px',
              borderTopColor: pc,
            }}
          >
            {/* Party & Role Tag */}
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <span
                className="text-[11px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: 'var(--nv-tint-bg)',
                  color: 'var(--nv-text-muted)',
                }}
              >
                {partySlug}
              </span>

              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                title="Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave."
              >
                Auditimi në proces
              </span>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-10 h-10 rounded-full overflow-hidden shrink-0 border relative"
                style={{ borderColor: pc }}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-full h-full items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-500"
                  style={{ display: item.imageUrl ? 'none' : 'flex' }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                {/* Name line */}
                <div
                  className="font-bold text-[13.5px] truncate group-hover:text-red-600 transition-colors"
                  style={{ color: 'var(--nv-navy)' }}
                >
                  {item.name}
                </div>
                <div className="text-[11px] truncate opacity-75" style={{ color: 'var(--nv-text-secondary)' }}>
                  {primaryRole}
                </div>
              </div>
            </div>

            {/* Status / Zodiac line */}
            <div className="flex items-center text-xs mb-2 font-medium" style={{ color: 'var(--nv-navy-muted)' }}>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mr-1.5">
                PARAGON® i pezulluar
              </span>
              {zodiac ? (
                <>
                  <span className="mx-1 opacity-50">·</span>
                  <span className="text-purple-600 dark:text-purple-400 mr-1">{zodiac.glyph}</span>
                  <span className="truncate">{zodiac.name}</span>
                </>
              ) : null}
            </div>

            {/* Audit indicator bar */}
            <div className="w-full h-[5px] rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--nv-card-border)',
                }}
              />
            </div>
          </a>
        );
      })}
    </div>
  );
};
