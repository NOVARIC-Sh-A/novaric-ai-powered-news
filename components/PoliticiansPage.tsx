// components/PoliticiansPage.tsx
import React from 'react';
import { VipProfile, Page } from '../types';
import { PoliticiansDatabase } from './figurat-politike/PoliticiansDatabase';

interface PoliticiansPageProps {
  profiles: VipProfile[];
  politicianCards?: VipProfile[];
  onBack: () => void;
  onNavigate: (page: Page, data?: any) => void;
}

export const PoliticiansPage: React.FC<PoliticiansPageProps> = ({
  profiles,
  politicianCards,
  onBack,
  onNavigate,
}) => {
  const initialList = (politicianCards && politicianCards.length > 0)
    ? politicianCards
    : profiles.filter(p => (p.category || '').toLowerCase().includes('politik'));

  const handleSelectPolitician = (id: string | number) => {
    // Find matching profile if present
    const profile = initialList.find(p => p.id === id || p.numericId === id || p.id === `vip${id}`);
    onNavigate('vipProfilePage', profile || id);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16">
      {/* Top Breadcrumb Bar */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Kthehu prapa"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kthehu</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              NOVARIC® / Figurat Politike
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            PARAGON® Dynamic Index
          </div>
        </div>
      </header>

      {/* Main Database Content */}
      <main className="pt-2">
        <PoliticiansDatabase
          initialData={initialList.length > 0 ? initialList : undefined}
          onSelectPolitician={handleSelectPolitician}
        />
      </main>
    </div>
  );
};
