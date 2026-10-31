// components/figurat-politike/StatsStrip.tsx
import React from 'react';

interface StatsStripProps {
  totalProfiles?: number | null;
  activeMps?: number | null;
  paragonActive?: number | null;
  loading?: boolean;
}

export const StatsStrip: React.FC<StatsStripProps> = ({
  totalProfiles,
  activeMps,
  paragonActive,
  loading = false,
}) => {
  const stats = [
    {
      id: 'stat-total',
      value: totalProfiles != null ? totalProfiles.toString() : null,
      label: 'Profile të monitoruara',
      sublabel: 'Baza kombëtare',
      isRed: false,
    },
    {
      id: 'stat-mps',
      value: activeMps != null ? activeMps.toString() : null,
      label: 'Deputetë aktivë',
      sublabel: 'Kuvendi',
      isRed: false,
    },
    {
      id: 'stat-paragon',
      value: paragonActive != null && paragonActive > 0 ? String(paragonActive) : 'Pezulluar',
      label: paragonActive != null && paragonActive > 0 ? 'Indeks i pjesshëm' : 'Auditimi PARAGON®',
      sublabel: paragonActive != null && paragonActive > 0 ? 'Me mbulim të mjaftueshëm' : 'Integriteti i burimeve',
      isRed: !(paragonActive != null && paragonActive > 0),
    },
    {
      id: 'stat-monitoring',
      value: '24/7',
      label: 'Monitorim mediash',
      sublabel: 'Indeksi automatik',
      isRed: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full" id="figurat-politike-stats">
      {stats.map((stat) => (
        <div
          key={stat.id}
          id={stat.id}
          className="relative rounded-lg p-3.5 shadow-sm border transition-all duration-200"
          style={{
            backgroundColor: 'var(--nv-card-bg)',
            borderColor: 'var(--nv-card-border)',
            borderTopWidth: '3px',
            borderTopColor: stat.isRed ? 'var(--nv-red)' : 'var(--nv-navy)',
          }}
        >
          {loading || stat.value === null ? (
            <div className="space-y-2 py-1">
              <div className="h-7 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          ) : (
            <div>
              <div className="flex items-baseline justify-between">
                <span
                  className="text-2xl font-black tracking-tight tabular-nums"
                  style={{ color: stat.isRed ? 'var(--nv-red)' : 'var(--nv-navy)' }}
                >
                  {stat.value}
                </span>
                {stat.isRed && (
                  <span
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: 'var(--nv-red)' }}
                    title="Live dynamic index"
                  />
                )}
              </div>
              <div
                className="mt-0.5 text-xs font-semibold truncate"
                style={{ color: 'var(--nv-text-primary)' }}
              >
                {stat.label}
              </div>
              <div
                className="text-[11px] truncate opacity-75"
                style={{ color: 'var(--nv-text-secondary)' }}
              >
                {stat.sublabel}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
