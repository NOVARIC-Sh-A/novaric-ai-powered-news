// components/figurat-politike/Toolbar.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { albanianAlphabet, getSurname } from '../../utils/paragonProfileUtils';

export type SortMode = 'score' | 'surname' | 'party';

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedParty: string;
  onPartyChange: (party: string) => void;
  availableParties: string[];
  sortMode: SortMode;
  onSortChange: (sort: SortMode) => void;
  selectedLetter: string;
  onLetterChange: (letter: string) => void;
  letterMatchCounts: Record<string, number>;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedParty,
  onPartyChange,
  availableParties,
  sortMode,
  onSortChange,
  selectedLetter,
  onLetterChange,
  letterMatchCounts,
}) => {
  // Client-side debounce (150ms) per spec §3.B
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localSearch);
    }, 150);
    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange]);

  // Canonical ordering for parties: ALL, PS, PD, PL, PSD, IND, then any others
  const orderedParties = useMemo(() => {
    const canonicalOrder = ['PS', 'PD', 'PL', 'PSD', 'IND'];
    const others = availableParties.filter(p => !canonicalOrder.includes(p));
    const presentCanonical = canonicalOrder.filter(p => availableParties.includes(p));
    return ['ALL', ...presentCanonical, ...others];
  }, [availableParties]);

  return (
    <div className="w-full space-y-3" id="figurat-politike-toolbar">
      {/* Top Filter Controls: Search, Party, Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 1114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="politician-search-input"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Kërko me emër ose mbiemër…"
            className="w-full pl-9 pr-8 py-2 rounded-lg border text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-blue-500/20"
            style={{
              backgroundColor: 'var(--nv-card-bg)',
              borderColor: 'var(--nv-card-border)',
              color: 'var(--nv-text-primary)',
            }}
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                onSearchChange('');
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Pastro kërkimin"
            >
              ×
            </button>
          )}
        </div>

        {/* Party Filter Select */}
        <div className="w-full md:w-48 shrink-0">
          <select
            id="politician-party-filter"
            value={selectedParty}
            onChange={(e) => onPartyChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm font-semibold transition-all outline-none cursor-pointer"
            style={{
              backgroundColor: 'var(--nv-card-bg)',
              borderColor: 'var(--nv-card-border)',
              color: 'var(--nv-text-primary)',
            }}
          >
            {orderedParties.map((p) => (
              <option key={p} value={p}>
                {p === 'ALL' ? 'Të gjitha partitë' : p}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="w-full md:w-52 shrink-0">
          <select
            id="politician-sort-filter"
            value={sortMode}
            onChange={(e) => onSortChange(e.target.value as SortMode)}
            className="w-full px-3 py-2 rounded-lg border text-sm font-semibold transition-all outline-none cursor-pointer"
            style={{
              backgroundColor: 'var(--nv-card-bg)',
              borderColor: 'var(--nv-card-border)',
              color: 'var(--nv-text-primary)',
            }}
          >
            <option value="score">Sipas vlerësimit</option>
            <option value="surname">Sipas mbiemrit</option>
            <option value="party">Sipas partisë</option>
          </select>
        </div>
      </div>

      {/* Alphabet Strip */}
      <div
        className="w-full rounded-lg p-1.5 border overflow-x-auto shadow-xs select-none scrollbar-thin"
        style={{
          backgroundColor: 'var(--nv-card-bg)',
          borderColor: 'var(--nv-card-border)',
        }}
      >
        <div className="flex items-center gap-1 min-w-max">
          {/* ALL Button */}
          <button
            type="button"
            id="alphabet-filter-all"
            onClick={() => onLetterChange('ALL')}
            className="px-2.5 py-1 rounded text-xs font-bold transition-all uppercase"
            style={{
              backgroundColor: selectedLetter === 'ALL' ? 'var(--nv-navy)' : 'transparent',
              color: selectedLetter === 'ALL' ? '#ffffff' : 'var(--nv-text-secondary)',
            }}
          >
            TË GJITHA
          </button>

          {/* 36 Albanian letters and digraphs */}
          {albanianAlphabet.map((letter) => {
            const count = letterMatchCounts[letter] || 0;
            const isDisabled = count === 0;
            const isSelected = selectedLetter === letter;

            return (
              <button
                key={letter}
                type="button"
                id={`alphabet-filter-${letter}`}
                disabled={isDisabled}
                onClick={() => onLetterChange(letter)}
                title={`${letter}: ${count} profile`}
                className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  backgroundColor: isSelected
                    ? 'var(--nv-navy)'
                    : isDisabled
                    ? 'transparent'
                    : 'transparent',
                  color: isSelected
                    ? '#ffffff'
                    : isDisabled
                    ? 'var(--nv-text-muted)'
                    : 'var(--nv-text-primary)',
                  opacity: isDisabled ? 0.35 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
