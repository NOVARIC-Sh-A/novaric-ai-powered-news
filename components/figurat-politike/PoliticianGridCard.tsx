// components/figurat-politike/PoliticianGridCard.tsx
import React, { useState } from 'react';
import { VipProfile } from '../../types';
import { partyColor, normalizePartySlug, band, bandLabel } from '../../lib/brand-tokens';
import { zodiacSign } from '../../lib/zodiac';
import { CANONICAL_PARAGON_DIMENSIONS } from '../../types/politician';
import { useDotTooltip } from './SharedDotTooltip';

export interface PoliticianGridCardProps {
  politician?: VipProfile;
  profile?: VipProfile;
  index?: number;
  onSelectPolitician?: (id: string | number) => void;
  onClick?: () => void;
  className?: string;
}

export const PoliticianGridCard: React.FC<PoliticianGridCardProps> = ({
  politician,
  profile,
  index = 0,
  onSelectPolitician,
  onClick,
  className = '',
}) => {
  const targetPolitician = politician || profile;
  if (!targetPolitician) return null;

  const { showTooltip, hideTooltip } = useDotTooltip();
  const [imageFailed, setImageFailed] = useState(false);

  const targetId = targetPolitician.numericId || targetPolitician.id;
  const linkHref = `/figurat-politike/${targetId}`;

  const partySlug = (targetPolitician as any).party || normalizePartySlug(targetPolitician.category);
  const pc = partyColor(partySlug);

  const composite = (targetPolitician as any).composite ?? targetPolitician.dynamicScore ?? null;
  const delta = (targetPolitician as any).compositeDelta ?? null;
  const dob = (targetPolitician as any).dateOfBirth || targetPolitician.dateOfBirth || null;
  const zone = (targetPolitician as any).electoralZone || null;
  const zodiac = zodiacSign(dob);

  // Parse 7 dimensions in fixed D1 -> D7 order
  const rawDims = (targetPolitician as any).paragonDimensions;
  let dimensions7: Array<number | null> = [null, null, null, null, null, null, null];

  if (composite != null) {
    if (Array.isArray(rawDims) && rawDims.length >= 7) {
      dimensions7 = rawDims.slice(0, 7).map(d => (typeof d === 'number' ? d : (typeof d?.score === 'number' ? d.score : null)));
    } else if (Array.isArray(targetPolitician.paragonAnalysis) && targetPolitician.paragonAnalysis.length >= 7) {
      dimensions7 = targetPolitician.paragonAnalysis.slice(0, 7).map(d => (typeof d?.score === 'number' ? d.score : null));
    }
  }

  // Format date to DD.MM.YYYY if available
  const formattedDob = React.useMemo(() => {
    if (!dob) return null;
    const match = dob.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
    if (match) {
      return `${match[3].padStart(2, '0')}.${match[2].padStart(2, '0')}.${match[1]}`;
    }
    return dob;
  }, [dob]);

  // Build meta line: "zone · zodiac · DOB", with "—" fallback for each missing segment
  const partZone = zone || '—';
  const partZodiac = zodiac ? `${zodiac.glyph} ${zodiac.name}` : '—';
  const partDob = formattedDob || '—';
  const metaLine = `${partZone} · ${partZodiac} · ${partDob}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
      return;
    }
    if (onSelectPolitician) {
      e.preventDefault();
      if (window.history && window.history.pushState) {
        window.history.pushState({}, '', linkHref);
      }
      onSelectPolitician(targetId);
    }
  };

  // Staggered fade-in (25ms steps) per spec §3.F
  const animationDelay = `${Math.min(index * 25, 400)}ms`;

  return (
    <a
      id={`politician-card-${targetId}`}
      href={linkHref}
      onClick={handleClick}
      className={`group relative rounded-lg border flex flex-col justify-between overflow-hidden transition-all duration-200 cursor-pointer select-none text-left ${className}`}
      style={
        {
          '--pc': pc,
          backgroundColor: 'var(--nv-card-bg)',
          border: '1px solid var(--pc)',
          borderColor: 'var(--pc)',
          animationDelay,
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 6px 16px -2px ${pc}44, 0 2px 6px -1px rgba(0,0,0,0.08)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Photo Area (96px strip) with 2px party-color underline */}
      <div
        className="relative w-full h-24 overflow-hidden bg-slate-100 dark:bg-slate-800"
        style={{
          borderBottom: '2px solid var(--pc)',
        }}
      >
        {targetPolitician.imageUrl && !imageFailed ? (
          <img
            src={targetPolitician.imageUrl}
            alt={targetPolitician.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200 dark:bg-slate-700">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}

        {/* Top-Left: Party Chip (white 9.5px text per E14) */}
        <div className="absolute top-2 left-2">
          <span
            className="px-1.5 py-0.5 rounded font-black text-white tracking-wider uppercase shadow-xs"
            style={{ backgroundColor: 'var(--pc)', fontSize: '9.5px' }}
          >
            {partySlug}
          </span>
        </div>

        {/* Top-Right: Audit / Suspension Badge */}
        <div className="absolute top-2 right-2">
          <div
            className="px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-800 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 shadow-sm"
            title="Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave."
          >
            Audit
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Name: 13px / 600 navy */}
          <div
            className="font-semibold truncate transition-colors group-hover:text-red-600"
            style={{
              fontSize: '13px',
              color: 'var(--nv-navy)',
            }}
          >
            {targetPolitician.name}
          </div>

          {/* Primary Role line */}
          <div
            className="text-[11px] font-medium truncate text-blue-600 dark:text-blue-400 mt-0.5"
            title={(targetPolitician as any).primaryRole || ''}
          >
            {(targetPolitician as any).primaryRole || ((targetPolitician as any).is_active_mp ? 'Deputet i Kuvendit' : 'Figurë Publike')}
          </div>

          {/* Meta line: 10.5px zone · zodiac · DOB */}
          <div
            className="text-[10px] truncate mt-0.5 opacity-80"
            style={{ color: 'var(--nv-text-secondary)' }}
            title={metaLine}
          >
            {metaLine}
          </div>

          {/* Strict Verified DOB Badge: requires status=verified + source_url + verified_at */}
          {(targetPolitician as any).dateOfBirthVerificationStatus === 'verified' &&
            (targetPolitician as any).dateOfBirthSourceUrl &&
            (targetPolitician as any).dateOfBirthVerifiedAt && (
            <div className="mt-1 flex items-center">
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium tracking-tight bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60"
                title={`Datëlindja e verifikuar: ${(targetPolitician as any).dateOfBirthSourceUrl}`}
              >
                <svg className="w-2.5 h-2.5 text-sky-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Datëlindja e verifikuar
              </span>
            </div>
          )}
        </div>

        {/* Fingerprint Dots Row (Fixed D1 -> D7 order) */}
        <div
          className="mt-2.5 pt-2 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--nv-card-border)' }}
        >
          {/* 7 dots */}
          <div className="flex items-center gap-1">
            {CANONICAL_PARAGON_DIMENSIONS.map((dim, idx) => {
              const val = dimensions7[idx];
              const dotColor = band(val);
              const bandTxt = bandLabel(val);
              const labelStr = `D${dim.id} ${dim.name} — ${val != null ? val : '–'}/100 · ${bandTxt}`;

              const handleEnter = (e: React.MouseEvent | React.FocusEvent) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                showTooltip({
                  text: labelStr,
                  dimKey: `D${dim.id}`,
                  dimName: dim.shortName,
                  score: val != null ? val : '–',
                  bandText: bandTxt,
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                });
              };

              return (
                <span
                  key={dim.key}
                  role="img"
                  tabIndex={0}
                  aria-label={labelStr}
                  onMouseEnter={handleEnter}
                  onMouseLeave={hideTooltip}
                  onFocus={handleEnter}
                  onBlur={hideTooltip}
                  className="w-[10px] h-[10px] rounded-full inline-block cursor-pointer transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-[var(--nv-navy-muted)]"
                  style={{ backgroundColor: dotColor }}
                />
              );
            })}
          </div>

          {/* Right-aligned Delta */}
          <div className="text-[10px] font-bold tabular-nums shrink-0 ml-1">
            {delta != null ? (
              delta > 0 ? (
                <span style={{ color: 'var(--b-top)' }}>▲ {delta.toFixed(1)}</span>
              ) : delta < 0 ? (
                <span style={{ color: 'var(--b-low)' }}>▼ {Math.abs(delta).toFixed(1)}</span>
              ) : (
                <span style={{ color: 'var(--nv-text-muted)' }}>– 0.0</span>
              )
            ) : (
              <span style={{ color: 'var(--nv-text-muted)' }}>–</span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export const PoliticianGridCardRedesign = PoliticianGridCard;
