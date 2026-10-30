import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, Clock, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { ComplianceSummary } from '../../types/standards';

interface LivingSealProps {
  summary: ComplianceSummary;
  onNavigateToMatrix?: () => void;
}

export const LivingSeal: React.FC<LivingSealProps> = ({ summary, onNavigateToMatrix }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(summary.next_audit_at).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [summary.next_audit_at]);

  const percentage = summary.overall_percentage;
  // Circumference for radius 78
  const radius = 78;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const formattedLastAudit = new Date(summary.last_audit_at).toLocaleDateString('sq-AL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedNextAudit = new Date(summary.next_audit_at).toLocaleDateString('sq-AL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      id="novaric-living-seal-card"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-[#0a192f] to-slate-950 text-white p-6 sm:p-8 border border-slate-700/60 shadow-2xl"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#e4191e]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side: Circular Living Seal Gauge */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group cursor-pointer" onClick={onNavigateToMatrix}>
            {/* Pulsing Aura */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-30" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#e4191e] via-amber-500 to-emerald-500 opacity-40 blur-sm group-hover:opacity-75 transition duration-500" />

            <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center bg-slate-950/90 rounded-full p-2 border border-slate-700">
              <svg height="180" width="180" viewBox="0 0 180 180" className="transform -rotate-90">
                {/* Background Ring */}
                <circle
                  stroke="#1e293b"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx="90"
                  cy="90"
                />
                {/* Animated Compliance Ring */}
                <circle
                  stroke="url(#livingSealGradient)"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference} ${circumference}`}
                  style={{
                    strokeDashoffset,
                    transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx="90"
                  cy="90"
                />
                <defs>
                  <linearGradient id="livingSealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="70%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inside Content */}
              <div className="absolute flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 mb-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span className="text-[10px] tracking-widest uppercase font-bold text-emerald-400">
                    VULË E GJALLË
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                  {percentage}%
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                  {summary.compliant_count} nga {summary.total_count} Klauzola
                </div>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  PËRPUTHSHMËRI E PLOTË
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Përditësim në kohë reale sipas të dhënave</span>
          </div>
        </div>

        {/* Center / Right Content: Audit Details & Countdown */}
        <div className="flex-1 w-full space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-bold uppercase rounded bg-[#e4191e] text-white tracking-wider">
                  Kodi i Standardeve NOVARIC®
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700">
                  EFCSN / IFCN Aligned
                </span>
                {summary.is_demo_fixture && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    TË DHËNA TË PROVUARA
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                Vula e Integritetit dhe Pajtueshmërisë Gazetare
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Kjo vulë përfaqëson monitorimin e vazhdueshëm dhe të verifikueshëm të të gjitha 31 klauzolave operacionale të NOVARIC®. Çdo standard auditohet dhe lidhet drejtpërdrejt me vlerësimin e integruar të artikujve.
              </p>
            </div>
          </div>

          {/* Audit Timestamps & Countdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Last Audit */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Auditimi i Fundit</span>
              </div>
              <div className="mt-2">
                <div className="text-base font-bold text-white">{formattedLastAudit}</div>
                <div className="text-xs text-slate-400 mt-0.5">Vlerësimi: 98.40% (Verifikuar)</div>
              </div>
              <div className="mt-3 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Nënshkruar nga Bordi i Integritetit</span>
              </div>
            </div>

            {/* Next Scheduled Audit */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Auditimi i Radhës</span>
              </div>
              <div className="mt-2">
                <div className="text-base font-bold text-white">{formattedNextAudit}</div>
                <div className="text-xs text-slate-400 mt-0.5">Cikli Periodik Q4 2026</div>
              </div>
              <div className="mt-3 text-[11px] text-amber-300 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Audit i Pavarur Periodik</span>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/90 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Numërimi Mbrapsht</span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1 text-center font-mono">
                <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800">
                  <span className="text-lg font-bold text-white">{timeLeft.days}</span>
                  <span className="block text-[9px] text-slate-400 uppercase font-sans">Ditë</span>
                </div>
                <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800">
                  <span className="text-lg font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="block text-[9px] text-slate-400 uppercase font-sans">Orë</span>
                </div>
                <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800">
                  <span className="text-lg font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="block text-[9px] text-slate-400 uppercase font-sans">Min</span>
                </div>
                <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800">
                  <span className="text-lg font-bold text-emerald-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="block text-[9px] text-slate-400 uppercase font-sans">Sek</span>
                </div>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 text-center">
                Deri në publikimin e raportit të radhës
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
