// components/figurat-politike/PoliticianCard.tsx
import React, { useState } from 'react';
import { resolveOfficialPhotoUrl } from '../../utils/officialPhoto';
import { VipProfile } from '../../types';
import { PoliticianDetail, ParagonDimensionItem, CANONICAL_PARAGON_DIMENSIONS } from '../../types/politician';
import { ScoreRing } from './primitives/ScoreRing';
import { RadarChart } from './primitives/RadarChart';
import { BulletRow } from './primitives/BulletRow';
import { Sparkline } from './primitives/Sparkline';
import { ZodiacChip } from './primitives/ZodiacChip';
import { TabPanel } from './primitives/TabPanel';
import { AWAITING_DATA, ratingNoteForCoverage, PartialRatingBadge } from './primitives/awaiting';
import { EditorialRemarksCard, LIMITED_EVIDENCE_BADGE } from './EditorialRemarksCard';
import { hasLimitedEvidence, publishedRemarkFor } from '../../utils/editorialRemarks';
import { ScoreLineagePanel } from '../analytics/ScoreLineagePanel';
import { ProfileRecordSections } from './ProfileRecordSections';
import { EvidenceDrawer } from './EvidenceDrawer';
import { AlertTriangle, ShieldCheck, Scale, Info } from 'lucide-react';
import { useParagonRatingsEnabled } from './useParagonRatings';
import { DimensionReading, ScoreEvidenceItem } from '../../types/politician';

export interface PoliticianCardProps {
  politician?: PoliticianDetail;
  profile?: PoliticianDetail | VipProfile;
  onBack?: () => void;
  className?: string;
  onNavigateToMethodology?: () => void;
}

export function formatLastNameCaps(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].toUpperCase();
  const lastName = parts[parts.length - 1].toUpperCase();
  return `${parts.slice(0, parts.length - 1).join(' ')} ${lastName}`;
}

export const PoliticianCard: React.FC<PoliticianCardProps> = ({
  politician,
  profile,
  onBack,
  className = '',
  onNavigateToMethodology,
}) => {
  const [selectedLineageId, setSelectedLineageId] = useState<string | null>(null);
  const [evidenceKey, setEvidenceKey] = useState<string | null | undefined>(undefined);
  const target: any = politician || profile || {};
  const {
    name = '',
    imageUrl = '',
    category = 'Politikë',
    dateOfBirth,
    placeOfBirth,
    electoralZone,
    commentary,
  } = target;

  const partyMatch = (category || '').match(/\((.*?)\)/);
  const partyName = partyMatch ? partyMatch[1] : (category || 'POLITIKË').replace(/^POLITIKË\s*/i, '') || 'KUVENDI';
  const displayName = formatLastNameCaps(name);

  // Commentary is displayed only if returned by the backend with verified evidence lineage
  const effectiveCommentary = commentary || null;

  // Canonical Dimension Mapping (deterministic D1..D7 ordering)
  const rawDims: any[] =
    Array.isArray(target.paragonDimensions) && target.paragonDimensions.length > 0
      ? target.paragonDimensions
      : Array.isArray(target.paragonAnalysis) && target.paragonAnalysis.length > 0
      ? target.paragonAnalysis
      : Array.isArray(target.dimensions) && target.dimensions.length > 0
      ? target.dimensions
      : [];

  const readings: Record<string, DimensionReading> = target.dimensionReadings || {};
  const evidence: ScoreEvidenceItem[] = Array.isArray(target.evidence) ? target.evidence : [];

  const optionalNumber = (value: unknown): number | null =>
    typeof value === 'number' && !isNaN(value) ? value : null;

  const paragonDimensions: ParagonDimensionItem[] = CANONICAL_PARAGON_DIMENSIONS.map((canonical, idx) => {
    const match = rawDims.find((d: any, dIdx: number) => {
      if (!d) return false;
      const dKey = String(d.key || d.id || '').toUpperCase();
      if (dKey === canonical.key.toUpperCase() || dKey === String(canonical.id)) return true;
      const dLabel = String(d.label || d.name || d.dimension || '').trim().toLowerCase();
      if (dLabel === canonical.name.toLowerCase() || dLabel === canonical.shortName.toLowerCase()) return true;
      if (dIdx === idx && !dKey && !d.dimension) return true;
      return false;
    }) || (rawDims.length === 7 ? rawDims[idx] : undefined);

    const score = typeof match === 'number' && !isNaN(match)
      ? match
      : match && typeof match.score === 'number' && !isNaN(match.score)
      ? match.score
      : null;

    const peerAverage = match && typeof match.peerAverage === 'number' && !isNaN(match.peerAverage)
      ? match.peerAverage
      : null;

    const benchmark = match && typeof match.benchmark === 'number' && !isNaN(match.benchmark)
      ? match.benchmark
      : (match && typeof match.globalBenchmark === 'number' && !isNaN(match.globalBenchmark)
      ? match.globalBenchmark
      : null);

    const reading = readings[canonical.key] || {};

    return {
      id: canonical.id,
      key: canonical.key,
      name: canonical.name,
      shortName: canonical.shortName,
      label: `${canonical.key} ${canonical.name}`,
      score: score ?? optionalNumber(reading.score),
      peerAverage: peerAverage ?? optionalNumber(reading.peerAverage),
      benchmark: benchmark ?? optionalNumber(reading.benchmark),
      confidenceLow: optionalNumber(match?.confidenceLow) ?? optionalNumber(reading.confidenceLow),
      confidenceHigh: optionalNumber(match?.confidenceHigh) ?? optionalNumber(reading.confidenceHigh),
      completeness: optionalNumber(match?.completeness) ?? optionalNumber(reading.completeness),
      metricInputs: match?.metricInputs || match?.metrics || {},
      coverage: match?.coverage,
      proxy: match?.proxy === true || reading.proxy === true,
      methodNote: (typeof match?.methodNote === 'string' && match.methodNote) || (typeof reading.methodNote === 'string' ? reading.methodNote : null),
    };
  });

  const scoredCount = paragonDimensions.filter((d) => d.score !== null).length;
  const coverageStr = `${scoredCount}/7`;
  const limitedEvidence = hasLimitedEvidence(paragonDimensions);
  const editorialRemark = publishedRemarkFor(target.id || target.numericId);
  const paragonComposite = typeof target.composite === 'number' && !Number.isNaN(target.composite)
    ? target.composite
    : null;

  // History series: only display verified history from backend; do NOT generate Math.sin() synthetic series
  const compositeHistory = React.useMemo(() => {
    if (Array.isArray(target.compositeHistory) && target.compositeHistory.length > 0) {
      return target.compositeHistory;
    }
    return [];
  }, [target.compositeHistory]);

  const peerAverage = typeof target.peerAverage === 'number' && !isNaN(target.peerAverage) ? target.peerAverage : null;

  // DOB formatting
  const dobFormatted = dateOfBirth
    ? (() => {
        const m = String(dateOfBirth).match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
        if (m) return `${m[3].padStart(2, '0')}.${m[2].padStart(2, '0')}.${m[1]}`;
        return dateOfBirth;
      })()
    : AWAITING_DATA;
  const pobFormatted = placeOfBirth || AWAITING_DATA;
  const zoneFormatted = electoralZone ? `Qarku ${String(electoralZone).replace(/^Qarku\s+/i, '')}` : AWAITING_DATA;

  // Strict DOB verification check
  const isDobVerified = Boolean(
    target.dateOfBirthVerificationStatus === 'verified' &&
    target.dateOfBirthSourceUrl &&
    target.dateOfBirthVerifiedAt
  );

  // Data-driven primary role & secondary roles
  const primaryRoleDisplay = target.primaryRole || AWAITING_DATA;
  const ratingsSwitch = useParagonRatingsEnabled();
  const ratingsOff = !ratingsSwitch || target.ratingsEnabled === false;
  const scoringSuspended = ratingsOff || target.scoringSuspended === true;
  const displayedDimensions = scoringSuspended
    ? paragonDimensions.map((dimension) => ({ ...dimension, score: null, peerAverage: null, benchmark: null }))
    : paragonDimensions;
  const coverageLabel = target.coverage || coverageStr;
  const secondaryRoles: string[] = Array.isArray(target.secondaryRoles)
    ? target.secondaryRoles
    : (typeof target.secondaryRoles === 'string'
      ? (() => { try { return JSON.parse(target.secondaryRoles); } catch { return []; } })()
      : []);

  return (
    <div className={`w-full max-w-5xl mx-auto bg-slate-50/50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 rounded-3xl ${className}`}>
      {/* Optional Back Navigation */}
      {onBack && (
        <div className="mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-wider transition-colors"
          >
            &larr; Kthehu te lista e politikanëve
          </button>
        </div>
      )}

      {scoringSuspended ? (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-xs flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
            <div className="font-bold text-sm text-amber-800 dark:text-amber-300 mb-0.5">
              PARAGON® — Audit në proces
            </div>
            <p>
              Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-2xl bg-sky-50/90 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 shadow-xs flex items-start gap-3.5">
          <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed text-sky-950 dark:text-sky-100">
            <div className="font-bold text-sm text-sky-800 dark:text-sky-300 mb-0.5">
              <PartialRatingBadge coverage={coverageLabel} />
            </div>
            <p>
              {ratingNoteForCoverage(coverageLabel)}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          (a) HERO HEADER
          ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Photo wrapped in SVG Score Ring (Score presentation suspended) */}
          <div className="flex flex-col items-center gap-2 shrink-0 max-w-[16rem]">
            <ScoreRing
              score={scoringSuspended ? null : (typeof target.composite === 'number' ? target.composite : (target.dynamicScore ?? null))}
              coverage={coverageLabel}
              imageUrl={resolveOfficialPhotoUrl(target) || undefined}
              name={name}
              size={132}
              strokeWidth={5.5}
              suspended={scoringSuspended}
            />
            {!scoringSuspended && typeof target.composite === 'number' && (
              <PartialRatingBadge
                coverage={coverageLabel}
                className="text-[11px] leading-snug font-semibold text-sky-900 dark:text-sky-100 text-center"
              />
            )}
          </div>

          {/* Details & Chips */}
          <div className="flex-grow text-center md:text-left">
            {/* Chips row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              {/* Category chip */}
              <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                {category || `POLITIKË (${partyName})`}
              </span>

              {/* Zodiac Chip (only if DOB available) */}
              <ZodiacChip dateOfBirth={dateOfBirth} withStatus />

              {limitedEvidence && (
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700"
                  title="Two or more scored dimensions use a documented proxy method."
                  data-limited-evidence="true"
                >
                  {LIMITED_EVIDENCE_BADGE}
                </span>
              )}

              {/* Verified DOB Badge — Strictly requires verified status + source URL + verified_at */}
              {isDobVerified && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60 shadow-xs"
                  title={`Datëlindja e verifikuar zyrtarisht: ${target.dateOfBirthSourceUrl}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  Datëlindja e verifikuar
                </span>
              )}

              {/* Verified Status Tag */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {scoringSuspended ? 'Auditimi i Burimeve në Proces' : `Mbulim ${coverageLabel} dimensions`}
              </span>
            </div>

            {/* Name (LASTNAME in caps) */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {displayName}
            </h1>

            {/* Data-Driven Role Line: Verified primary role */}
            <div className="mt-1">
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {primaryRoleDisplay}
              </p>
              {secondaryRoles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5 justify-center md:justify-start">
                  {secondaryRoles.map((role, idx) => (
                    <span key={idx} className="text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      {role}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Meta line */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span>{dobFormatted}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span>{pobFormatted}</span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span>{zoneFormatted}</span>
            </p>

            {/* Legally Neutral Statement for Legal Proceedings (Erion Veliaj, etc.) */}
            {target.legalStatusSummary && (
              <div className="mt-3.5 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-sans text-left">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 mb-1">
                  <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Korniza Ligjore & Prezumimi i Pafajësisë</span>
                </div>
                <p>{target.legalStatusSummary}</p>
              </div>
            )}

            {/* Factual Albanian Commentary (Only if returned from verified backend lineage) */}
            {effectiveCommentary && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans text-left">
                {effectiveCommentary}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          (b) PARAGON FINGERPRINT (Radar + Bullets + Sparkline)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Radar Column */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between">
          <div className="w-full text-left mb-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              PARAGON® Fingerprint (7 Dimensione)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Profili shumëdimensional i bazuar në burime të verifikuara
            </p>
          </div>

          <div className="my-auto py-2">
            <RadarChart
              dimensions={displayedDimensions}
              size={280}
              editorialScore={editorialRemark?.editorialScore ?? null}
            />
          </div>

          {/* Sparkline at bottom of radar column */}
          <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800">
            <Sparkline history={compositeHistory} peerAverage={peerAverage} />
          </div>
        </div>

        {/* Bullets List Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Treguesit e Performancës & Auditimi
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Vlerësimi (Blu) / Mes. e kolegëve (E zezë) / Benchmark (Gri)
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                {scoringSuspended ? 'Auditimi në Proces' : `Mbulim ${coverageLabel} dimensions`}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedDimensions.map((dim) => (
                <BulletRow
                  key={dim.key}
                  dimension={dim}
                  onOpenLineage={(id) => setSelectedLineageId(id)}
                  onNavigateToMethodology={onNavigateToMethodology}
                  onOpenEvidence={(key) => setEvidenceKey(key)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Dekompozim me gjysmë-jetë 180 ditë</span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">Kuvendi + ILDKPKI + KQZ</span>
          </div>
        </div>
      </div>

      <EditorialRemarksCard remark={editorialRemark} paragonComposite={scoringSuspended ? null : paragonComposite} />

      {/* ========================================================
          (c) DOSSIER TABS (Biografia, Aktiviteti, Pasuria, Mandatet)
          ======================================================== */}
      <TabPanel politician={target} />

      <ProfileRecordSections
        promises={target.promises}
        consistencyFlags={target.consistencyFlags}
        votingRecord={target.votingRecord}
        rhetoric={target.rhetoric}
        affiliations={target.affiliations}
        rightOfReply={target.rightOfReply}
        scoreRevisions={target.scoreRevisions}
        evidenceCount={evidence.length}
        onOpenEvidence={(key) => setEvidenceKey(key ?? null)}
      />

      <EvidenceDrawer
        open={evidenceKey !== undefined}
        dimensionKey={evidenceKey}
        evidence={evidence}
        onClose={() => setEvidenceKey(undefined)}
      />

      {/* Analytical Spine Lineage Panel Modal for PARAGON Dimensions */}
      {selectedLineageId && (
        <ScoreLineagePanel
          metricId={selectedLineageId}
          isOpen={!!selectedLineageId}
          isModal={true}
          onClose={() => setSelectedLineageId(null)}
          onNavigateToStep={() => {
            setSelectedLineageId(null);
            if (onNavigateToMethodology) {
              onNavigateToMethodology();
            } else {
              window.location.href = '/?page=methodology#paragon-audit';
            }
          }}
        />
      )}
    </div>
  );
};
