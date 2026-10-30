// components/PoliticianComparisonModal.tsx
import React from "react";
import { VipProfile } from "../types";
import { XMarkIcon } from "./icons";
import { CANONICAL_PARAGON_DIMENSIONS } from "../types/politician";
import { formatVipName, getProfilePhotoUrl } from "../utils/paragonProfileUtils";
import { Clock, ShieldAlert } from "lucide-react";

interface PoliticianComparisonModalProps {
  profiles: VipProfile[];
  onClose: () => void;
  onNavigateToProfilePage?: (profile: VipProfile) => void;
}

export const PoliticianComparisonModal: React.FC<PoliticianComparisonModalProps> = ({
  profiles,
  onClose,
  onNavigateToProfilePage,
}) => {
  if (!profiles || profiles.length < 2) return null;

  // Max 3 profiles
  const activeProfiles = profiles.slice(0, 3);
  const colors = ["#e11d48", "#3b82f6", "#10b981"];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
    >
      <div
        className="relative bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <header className="p-4 px-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <div>
            <h2
              id="comparison-title"
              className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
            >
              <span>Krahasimi i Deputetëve</span>
              <span className="text-xs font-normal text-slate-500">
                ({activeProfiles.length}/3 figura politike)
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Krahasim faktik i mandateve, zonës elektorale dhe statusit PARAGON®.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Mbyll dritaren"
            className="p-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </header>

        {/* AUDIT SUSPENSION BANNER */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 px-6 py-2.5 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>PARAGON® në Audit:</strong> Vlerësimet numerike janë përkohësisht të pezulluara. Nuk përcaktohet "fitues" me pikë sintetike.
          </span>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* PROFILE HEADERS GRID */}
          <div
            className="gap-6 text-center pb-6 border-b border-slate-200 dark:border-slate-800"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${activeProfiles.length}, minmax(0, 1fr))`,
            }}
          >
            {activeProfiles.map((p, index) => {
              const safeName = p.name || "—";
              const party = (p as any).party || (p.category ? p.category.match(/\((.*?)\)/)?.[1] : "IND") || "IND";
              const zone = (p as any).electoralZone || "Kuvendi";
              const role = (p as any).primaryRole || "Deputet i Kuvendit të Shqipërisë";

              return (
                <div key={p.id || p.numericId || index} className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={getProfilePhotoUrl(p)}
                      onError={(e) => {
                        e.currentTarget.src = "https://media.novaric.al/politicians/foto-ne-pritje.jpg";
                      }}
                      alt={safeName}
                      className="w-20 h-20 rounded-full object-cover border-3 shadow-md"
                      style={{ borderColor: colors[index] }}
                    />
                    <span
                      className="absolute bottom-0 right-0 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: colors[index] }}
                    >
                      {party}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">
                    {formatVipName(safeName)}
                  </h3>

                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5 line-clamp-1" title={role}>
                    {role}
                  </p>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Qarku {zone}
                  </p>

                  {onNavigateToProfilePage && (
                    <button
                      onClick={() => onNavigateToProfilePage(p)}
                      className="mt-2 text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Hap profilin e plotë &rarr;
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* FACTUAL METRICS COMPARISON */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Të Dhënat e Mandatit dhe Verifikimit
            </h4>

            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              {/* Row 1: Qarku */}
              <div
                className="grid gap-4 py-1 border-b border-slate-200 dark:border-slate-700/50"
                style={{ gridTemplateColumns: `repeat(${activeProfiles.length}, minmax(0, 1fr))` }}
              >
                {activeProfiles.map((p, idx) => (
                  <div key={idx}>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Qarku Zgjedhor</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {(p as any).electoralZone || "I pacaktuar"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Row 2: Subjekti / Grupi */}
              <div
                className="grid gap-4 py-1 border-b border-slate-200 dark:border-slate-700/50"
                style={{ gridTemplateColumns: `repeat(${activeProfiles.length}, minmax(0, 1fr))` }}
              >
                {activeProfiles.map((p, idx) => (
                  <div key={idx}>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Grupi Parlamentar</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {(p as any).party || "I Pavarur"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Row 3: Datëlindja */}
              <div
                className="grid gap-4 py-1"
                style={{ gridTemplateColumns: `repeat(${activeProfiles.length}, minmax(0, 1fr))` }}
              >
                {activeProfiles.map((p, idx) => (
                  <div key={idx}>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Datëlindja</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {p.dateOfBirth || (p as any).date_of_birth || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PARAGON DIMENSIONS STATUS */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Statusi i 7 Dimensioneve PARAGON®</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 normal-case font-medium">
                <Clock className="w-3 h-3" /> Audit në proces
              </span>
            </h4>

            <div className="space-y-2">
              {CANONICAL_PARAGON_DIMENSIONS.map((dim) => (
                <div
                  key={dim.key}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {dim.key} {dim.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Verifikim empirik
                    </span>
                  </div>

                  <div
                    className="grid gap-4"
                    style={{ gridTemplateColumns: `repeat(${activeProfiles.length}, minmax(0, 1fr))` }}
                  >
                    {activeProfiles.map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <span className="font-mono text-slate-400 font-semibold">—</span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          Në audit
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            Mbyll Krahasimin
          </button>
        </footer>
      </div>
    </div>
  );
};
