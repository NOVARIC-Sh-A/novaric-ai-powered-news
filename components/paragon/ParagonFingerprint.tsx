// components/paragon/ParagonFingerprint.tsx
import React from 'react';
import {
  ParagonDimensionItem,
  ParagonScoringStatus,
  CANONICAL_PARAGON_DIMENSIONS,
} from '../../types/politician';
import { Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export interface ParagonFingerprintProps {
  politicianId?: number | string;
  dimensions?: ParagonDimensionItem[] | null;
  composite?: number | null;
  scoringStatus?: ParagonScoringStatus | string;
  scoringSuspended?: boolean;
  publicScoreVisible?: boolean;
  compact?: boolean;
  className?: string;
}

export const ParagonFingerprint: React.FC<ParagonFingerprintProps> = ({
  politicianId,
  dimensions = [],
  composite = null,
  scoringStatus = 'audit_pending',
  scoringSuspended = true,
  publicScoreVisible = false,
  compact = false,
  className = '',
}) => {
  // Publication gate: scores are visible ONLY if not suspended, published status, and public visibility allowed
  const isScoreAuthorized =
    !scoringSuspended && scoringStatus === 'published' && publicScoreVisible;

  // Map 7 canonical dimensions
  const canonicalDims = CANONICAL_PARAGON_DIMENSIONS.map((canonical) => {
    const match = (dimensions || []).find((d) => {
      if (!d) return false;
      const k = String(d.key || '').toUpperCase();
      if (k === canonical.key) return true;
      if (d.name && d.name.toLowerCase() === canonical.name.toLowerCase()) return true;
      return false;
    });

    const rawScore = match && typeof match.score === 'number' && !isNaN(match.score) ? match.score : null;
    const authorizedScore = isScoreAuthorized ? rawScore : null;

    return {
      key: canonical.key,
      name: canonical.name,
      shortName: canonical.shortName,
      score: authorizedScore,
      peerAverage: isScoreAuthorized && match?.peerAverage != null ? match.peerAverage : null,
      verificationStatus: match?.verificationStatus || 'under_review',
    };
  });

  if (compact) {
    return (
      <div
        className={`inline-flex flex-col gap-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${className}`}
        aria-label="PARAGON® Fingerprint"
      >
        <div className="flex items-center justify-between gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
          <span className="font-bold tracking-wider text-slate-700 dark:text-slate-300">PARAGON®</span>
          <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
            <Clock className="w-2.5 h-2.5" />
            Audit në proces
          </span>
        </div>

        {/* 7 dimension dots */}
        <div className="flex items-center gap-1">
          {canonicalDims.map((dim) => {
            const hasScore = dim.score != null;
            return (
              <span
                key={dim.key}
                title={`${dim.key} ${dim.name}: ${hasScore ? `${dim.score}%` : 'Audit në proces'}`}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  hasScore
                    ? 'bg-blue-600 dark:bg-blue-400'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            );
          })}
          <span className="ml-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
            {isScoreAuthorized && composite != null ? `${composite}%` : '–'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs ${className}`}
      aria-label="PARAGON® Governance Fingerprint"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
            PARAGON® GOVERNANCE FINGERPRINT
          </span>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Profili i Integritetit Institucional
          </h4>
        </div>

        {scoringSuspended ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            Audit në proces
          </span>
        ) : isScoreAuthorized && composite != null ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {composite.toFixed(1)}%
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Të dhëna të pamjaftueshme
          </span>
        )}
      </div>

      {/* Audit notice banner during suspension */}
      {scoringSuspended && (
        <div className="mt-3 p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-200 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p>
            Vlerësimet numerike PARAGON® janë në auditim. Të gjitha dimensionet paraqiten si
            verifikim i hapur burimesh pa pikëzim artificial.
          </p>
        </div>
      )}

      {/* 7 Dimensions list */}
      <div className="mt-3 space-y-2">
        {canonicalDims.map((dim) => {
          const hasScore = dim.score != null;
          return (
            <div
              key={dim.key}
              className="flex items-center justify-between text-xs py-1 border-b border-slate-50 dark:border-slate-800/50 last:border-none"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-500 dark:text-slate-400 w-6">
                  {dim.key}
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {dim.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasScore ? (
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {dim.score}%
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-mono">
                    —
                  </span>
                )}
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {hasScore ? `(Mes. ${dim.peerAverage ?? '—'}%)` : 'Audit në proces'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
