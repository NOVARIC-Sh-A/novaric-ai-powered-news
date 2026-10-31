// components/figurat-politike/PoliticiansDatabase.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { VipProfile } from '../../types';
import { fetchPoliticianCards } from '../../services/apiService';
import { StatsStrip } from './StatsStrip';
import { SectionBar } from './SectionBar';
import { DominantFiguresStrip } from './DominantFiguresStrip';
import { Toolbar, SortMode } from './Toolbar';
import { FingerprintLegend } from './FingerprintLegend';
import { PoliticianGridCard } from './PoliticianGridCard';
import { SharedDotTooltipProvider } from './SharedDotTooltip';
import { getSurname, albanianAlphabet } from '../../utils/paragonProfileUtils';
import { normalizePartySlug } from '../../lib/brand-tokens';
import { AlertTriangle } from 'lucide-react';
import paragonScoresExport from '../../db/paragon_scores_export.json';
import { useParagonRatingsEnabled } from './useParagonRatings';

interface PoliticiansDatabaseProps {
  onSelectPolitician?: (id: string | number) => void;
  initialData?: VipProfile[];
}

const defaultSeedProfiles: VipProfile[] = (paragonScoresExport?.profiles as any[]) || [];

const DIGRAPHS = ['DH', 'GJ', 'LL', 'NJ', 'RR', 'SH', 'TH', 'XH', 'ZH'];

function matchAlbanianLetter(name: string, letter: string): boolean {
  if (letter === 'ALL') return true;
  const surname = getSurname(name).toUpperCase();
  if (!surname) return false;

  if (DIGRAPHS.includes(letter)) {
    return surname.startsWith(letter);
  }
  // Single letter exclusions for digraph starts
  if (letter === 'D' && surname.startsWith('DH')) return false;
  if (letter === 'G' && surname.startsWith('GJ')) return false;
  if (letter === 'L' && surname.startsWith('LL')) return false;
  if (letter === 'N' && surname.startsWith('NJ')) return false;
  if (letter === 'R' && surname.startsWith('RR')) return false;
  if (letter === 'S' && surname.startsWith('SH')) return false;
  if (letter === 'T' && surname.startsWith('TH')) return false;
  if (letter === 'X' && surname.startsWith('XH')) return false;
  if (letter === 'Z' && surname.startsWith('ZH')) return false;

  return surname.startsWith(letter);
}

export const PoliticiansDatabase: React.FC<PoliticiansDatabaseProps> = ({
  onSelectPolitician,
  initialData,
}) => {
  const ratingsOn = useParagonRatingsEnabled();
  const seedList = (initialData && initialData.length > 0) ? initialData : defaultSeedProfiles;
  const [politicians, setPoliticians] = useState<VipProfile[]>(seedList);
  const [loading, setLoading] = useState(seedList.length === 0);
  const [pageMeta, setPageMeta] = useState<{
    totalProfiles: number | null;
    activeMps: number | null;
    paragonActive: number | null;
  }>({
    totalProfiles: seedList.length || null,
    activeMps: seedList.length || null,
    paragonActive: seedList.filter(p => (p as any).composite != null).length || null,
  });

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParty, setSelectedParty] = useState('ALL');
  const [sortMode, setSortMode] = useState<SortMode>('score');
  const [selectedLetter, setSelectedLetter] = useState('ALL');

  useEffect(() => {
    let mounted = true;

    // If initialData was provided by parent, respect it
    if (initialData && initialData.length > 0) {
      setPoliticians(initialData);
      setLoading(false);
      const meta = (initialData as any).meta;
      setPageMeta({
        totalProfiles: meta?.totalProfiles ?? initialData.length,
        activeMps: meta?.activeMps ?? initialData.length,
        paragonActive: meta?.paragonActive ?? initialData.filter(p => (p as any).composite != null).length,
      });
    }

    // Always run fetchPoliticianCards in the background to ensure fresh live data
    fetchPoliticianCards()
      .then((data) => {
        if (mounted && data && data.length > 0) {
          setPoliticians(data);
          const meta = (data as any).meta;
          setPageMeta({
            totalProfiles: meta?.totalProfiles ?? data.length,
            activeMps: meta?.activeMps ?? data.length,
            paragonActive: meta?.paragonActive ?? data.filter(p => (p as any).composite != null).length,
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load politician cards:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [initialData]);

  // Extract distinct parties available in payload
  const availableParties = useMemo(() => {
    const parties = new Set<string>();
    politicians.forEach((p) => {
      const slug = (p as any).party || normalizePartySlug(p.category);
      if (slug) parties.add(slug);
    });
    return Array.from(parties);
  }, [politicians]);

  // Pre-calculate letter match counts for alphabet buttons
  const letterMatchCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    albanianAlphabet.forEach((letter) => {
      counts[letter] = 0;
    });

    politicians.forEach((p) => {
      // Check party filter if active
      if (selectedParty !== 'ALL') {
        const partySlug = (p as any).party || normalizePartySlug(p.category);
        if (partySlug !== selectedParty) return;
      }
      albanianAlphabet.forEach((letter) => {
        if (matchAlbanianLetter(p.name, letter)) {
          counts[letter] = (counts[letter] || 0) + 1;
        }
      });
    });

    return counts;
  }, [politicians, selectedParty]);

  // Filter politicians client-side
  const filtered = useMemo(() => {
    return politicians.filter((p) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBio = (p.shortBio || '').toLowerCase().includes(q);
        const matchesZone = ((p as any).electoralZone || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBio && !matchesZone) return false;
      }

      // 2. Party filter
      if (selectedParty !== 'ALL') {
        const partySlug = (p as any).party || normalizePartySlug(p.category);
        if (partySlug !== selectedParty) return false;
      }

      // 3. Alphabet filter
      if (selectedLetter !== 'ALL') {
        if (!matchAlbanianLetter(p.name, selectedLetter)) return false;
      }

      return true;
    });
  }, [politicians, searchQuery, selectedParty, selectedLetter]);

  // Sort politicians
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const scoreA = (a as any).composite ?? a.dynamicScore ?? 0;
      const scoreB = (b as any).composite ?? b.dynamicScore ?? 0;

      if (sortMode === 'score') {
        return scoreB - scoreA;
      }
      if (sortMode === 'surname') {
        const surnameA = getSurname(a.name);
        const surnameB = getSurname(b.name);
        return surnameA.localeCompare(surnameB, 'sq');
      }
      if (sortMode === 'party') {
        const partyA = (a as any).party || normalizePartySlug(a.category);
        const partyB = (b as any).party || normalizePartySlug(b.category);
        const partyCompare = partyA.localeCompare(partyB, 'sq');
        if (partyCompare !== 0) return partyCompare;
        return scoreB - scoreA;
      }
      return 0;
    });
  }, [filtered, sortMode]);

  // Stats from page meta
  const totalProfilesCount = pageMeta.totalProfiles ?? (politicians.length > 0 ? politicians.length : null);
  const activeMpsCount = pageMeta.activeMps ?? (politicians.length > 0 ? politicians.length : null);
  const paragonActiveCount = pageMeta.paragonActive ?? (politicians.length > 0 ? politicians.filter(p => (p as any).composite != null).length : null);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedParty('ALL');
    setSelectedLetter('ALL');
  };

  return (
    <SharedDotTooltipProvider>
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-5" id="figurat-politike-database">
        {/* MANDATORY CONTAINMENT & SUSPENSION BANNER (Remediation Mandate §2 & §8) */}
        <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-xs flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
            <div className="font-bold text-sm text-amber-800 dark:text-amber-300 mb-0.5">
              Njoftim Zyrtar mbi Integritetin e të Dhënave
            </div>
            <p>
              Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave.
            </p>
          </div>
        </div>

        {/* SECTION A: Stats Strip */}
        <StatsStrip
          totalProfiles={loading ? null : totalProfilesCount}
          activeMps={loading ? null : activeMpsCount}
          paragonActive={loading ? null : (ratingsOn ? paragonActiveCount : 0)}
          loading={loading}
        />

        {/* SECTION D: Figura Dominante Strip with Section Bar 1 */}
        {!loading && politicians.length > 0 && (
          <div className="space-y-2.5">
            <SectionBar
              title="FIGURA KRYESORE POLITIKE"
              subtitle="Renditja PARAGON® për periudhën 2026 është e pezulluar për verifikim"
              rightNote="Burime zyrtare"
            />
            <DominantFiguresStrip
              politicians={politicians}
              onSelectPolitician={onSelectPolitician}
            />
          </div>
        )}

        {/* SECTION B: Toolbar */}
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedParty={selectedParty}
          onPartyChange={setSelectedParty}
          availableParties={availableParties}
          sortMode={sortMode}
          onSortChange={setSortMode}
          selectedLetter={selectedLetter}
          onLetterChange={setSelectedLetter}
          letterMatchCounts={letterMatchCounts}
        />

        {/* SECTION E: Fingerprint Legend with Section Bar 2 */}
        <div className="space-y-2.5">
          <SectionBar
            title="SI TË LEXONI FINGERPRINT-IN"
            subtitle="çdo kartë përmban 7 pika, një për dimension"
            rightNote="D1 → D7"
          />
          <FingerprintLegend />
        </div>

        {/* SECTION F: Grid with Section Bar 3 */}
        <div className="space-y-3">
          <SectionBar
            title="TË GJITHA PROFILET"
            subtitle="kuadri i ngjyrës = partia politike"
            rightNote={`${sorted.length} ${sorted.length === 1 ? 'profil' : 'profile'} (të gjitha në një faqe)`}
          />

          {loading ? (
            /* Loading Skeletons */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border p-2 h-44 bg-slate-100 dark:bg-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            /* SECTION G: Empty state (E23) */
            <div
              id="politicians-empty-state"
              className="w-full rounded-xl border-2 border-dashed py-12 px-4 text-center my-4"
              style={{
                borderColor: 'var(--nv-tint-border)',
                backgroundColor: 'var(--nv-tint-bg)',
              }}
            >
              <div className="max-w-md mx-auto space-y-3">
                <svg
                  className="w-12 h-12 mx-auto text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div className="font-semibold text-base" style={{ color: 'var(--nv-navy)' }}>
                  Asnjë profil nuk përputhet me filtrat.
                </div>
                <p className="text-xs text-slate-500">
                  Provoni të modifikoni termat e kërkimit ose pastroni filtrat e aplikuar.
                </p>
                <button
                  type="button"
                  id="btn-reset-filters"
                  onClick={resetFilters}
                  className="underline text-xs font-bold transition-all cursor-pointer hover:opacity-80"
                  style={{ color: 'var(--nv-navy)' }}
                >
                  Pastro filtrat
                </button>
              </div>
            </div>
          ) : (
            /* Card Grid - All profiles on one page */
            <div
              id="politicians-card-grid"
              className="grid gap-2.5"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(176px, 1fr))',
              }}
            >
              {sorted.map((politician, index) => (
                <PoliticianGridCard
                  key={politician.id}
                  politician={politician}
                  index={index}
                  onSelectPolitician={onSelectPolitician}
                />
              ))}
            </div>
          )}

          {/* SECTION G: Footer Live Count */}
          {!loading && sorted.length > 0 && (
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              {/* SECTION G: E22 Count Line */}
              <div id="politicians-count-line" className="text-slate-500 font-medium">
                <span className="tabular-nums font-bold text-slate-800 dark:text-slate-200">
                  {sorted.length}
                </span>{' '}
                nga{' '}
                <span className="tabular-nums font-bold text-slate-800 dark:text-slate-200">
                  {totalProfilesCount}
                </span>{' '}
                profile (të gjitha të shfaqura në faqe)
                {searchQuery && (
                  <span className="ml-1 text-slate-400">
                    · kërkim: “<strong className="text-slate-600 dark:text-slate-300">{searchQuery}</strong>”
                  </span>
                )}
                {selectedParty !== 'ALL' && (
                  <span className="ml-1 text-slate-400">
                    · partia: <strong className="text-slate-600 dark:text-slate-300">{selectedParty}</strong>
                  </span>
                )}
                {selectedLetter !== 'ALL' && (
                  <span className="ml-1 text-slate-400">
                    · shkronja: <strong className="text-slate-600 dark:text-slate-300">{selectedLetter}</strong>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </SharedDotTooltipProvider>
  );
};
