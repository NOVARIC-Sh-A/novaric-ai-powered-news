// components/methodology/PipelineVisualizer.tsx
import React, { useState } from 'react';
import {
  Cpu,
  FileText,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
  Layers,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Info,
} from 'lucide-react';
import { MethodologyStep, MethodologyActorType } from '../../types/methodology';

interface PipelineVisualizerProps {
  steps: MethodologyStep[];
  onSelectCitation?: (citationKey: string) => void;
  onNavigateToClause?: (clauseId: string) => void;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  steps,
  onSelectCitation,
  onNavigateToClause,
}) => {
  const [activeStepId, setActiveStepId] = useState<string>('step-3'); // default to critical human step

  const activeStep = steps.find(s => s.id === activeStepId) || steps[0];

  const getActorIcon = (actor: MethodologyActorType) => {
    switch (actor) {
      case 'ai':
        return <Cpu className="w-5 h-5 text-blue-500" />;
      case 'draft':
        return <FileText className="w-5 h-5 text-amber-500" />;
      case 'human_team':
        return <UserCheck className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getActorBadgeColor = (actor: MethodologyActorType) => {
    switch (actor) {
      case 'ai':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'draft':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'human_team':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Header section */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-red-50 dark:bg-red-950/60 text-[#e4191e] border border-red-200 dark:border-red-900/60">
          <Sparkles className="w-3.5 h-3.5 text-[#e4191e]" />
          Procesi i Verifikimit • Sinergjia Hermeneutike
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Sinergjia Hermeneutike mes Inteligjencës Artificiale dhe Mbikëqyrjes Njerëzore
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
          Në qendër të metodologjisë së NOVARIC® qëndron një proces me tre hapa që bashkon shkallën e llogaritjes algoritmike me thellësinë kritike të mendimit editorial njerëzor.
        </p>
      </div>

      {/* Interactive Stepper Navigation (3 Horizontal/Vertical Cards) */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {steps.map((step, index) => {
            const isSelected = step.id === activeStepId;
            const isStep3 = step.order === 3;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                className={`relative text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 border-[#e4191e] ring-2 ring-red-500/20 shadow-md scale-[1.01]'
                    : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {/* Step number badge & icon */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        isSelected
                          ? 'bg-[#e4191e] text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {step.order}
                    </span>
                    <span className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Hapi {step.order}
                    </span>
                  </div>
                  {getActorIcon(step.actor)}
                </div>

                {/* Title */}
                <div className="space-y-1 my-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                    {step.short_title}
                  </h4>
                  {isStep3 && (
                    <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      ★ Hapi Kritik Hermeneutik
                    </span>
                  )}
                </div>

                {/* Actor Badge */}
                <div className="pt-3 mt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${getActorBadgeColor(
                      step.actor
                    )}`}
                  >
                    {step.actor_label_sq}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* PROMINENT HUMAN-IN-THE-LOOP (HITL) CHECKPOINT MARKER */}
        <div className="rounded-xl border border-amber-300 dark:border-amber-700/80 bg-gradient-to-r from-amber-50 via-red-50/40 to-amber-50 dark:from-amber-950/40 dark:via-red-950/30 dark:to-amber-950/40 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  Pika e Kontrollit Njerëzor (Human-in-the-Loop Checkpoint)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-600 text-white tracking-wider">
                  BLLOKIM I DETYRUESHËM
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                Asnjë artikull, verdikt apo përmbledhje nuk mund të kalojë në publikim të drejtpërdrejtë pa kaluar nëpër këtë pikë kontrolli. Publikimi autonom nga IA është i pamundur në nivel arkitekturor.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 100% Miratim Para Publikimit
            </span>
          </div>
        </div>
      </div>

      {/* Selected Step Expanded Detail Pane */}
      <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Hapi {activeStep.order} nga 3</span>
              <span>•</span>
              <span className="text-[#e4191e]">{activeStep.short_title}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {activeStep.title}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${getActorBadgeColor(
                activeStep.actor
              )}`}
            >
              {getActorIcon(activeStep.actor)}
              <span>Autoriteti: {activeStep.actor_label_sq}</span>
            </span>
          </div>
        </div>

        {/* Verbatim Body Text */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Përshkrimi Metodologjik
          </h5>
          <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
            {activeStep.body_text}
          </p>
        </div>

        {/* Sub-points for Step 3 (The Hermeneutic Core) */}
        {activeStep.sub_points && activeStep.sub_points.length > 0 && (
          <div className="space-y-3 pt-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Katër Shtyllat e Rishikimit Editorial (Verbatim)
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activeStep.sub_points.map((sp, idx) => (
                <div
                  key={sp.id}
                  className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span>{sp.title}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {sp.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two-Column Deep-Dive: Inputs vs Outputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Inputs */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-blue-500" /> Të Dhënat Hyrëse (Inputs):
            </span>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {activeStep.inputs.map((inp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold leading-none mt-1">•</span>
                  <span>{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Outputs */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-500" /> Rezultatet Dalëse (Outputs):
            </span>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {activeStep.outputs.map((out, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold leading-none mt-1">•</span>
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Safeguards & Failure Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Safeguards */}
          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Masat Mbrojtëse & Siguria:
            </span>
            <ul className="space-y-1 text-xs text-emerald-950 dark:text-emerald-200">
              {activeStep.safeguards.map((sg, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{sg}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Failure Modes mitigated */}
          <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Rreziqet e Zbutura & Dështimet e Parandaluara:
            </span>
            <ul className="space-y-1 text-xs text-amber-950 dark:text-amber-200">
              {activeStep.failure_modes.map((fm, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">!</span>
                  <span>{fm}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Governing Standards Controls from Kodin e Standardeve */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e4191e]" /> Nenet Rregulluese në Kodin e Standardeve:
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Ky hap auditohet drejtpërdrejt sipas klauzolave të verifikueshme:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeStep.standards_clause_ids.map(clauseId => (
              <button
                key={clauseId}
                onClick={() => {
                  if (onNavigateToClause) {
                    onNavigateToClause(clauseId);
                  } else {
                    window.location.href = `/?page=standards&sub=kodi&clause=${clauseId}`;
                  }
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-red-100 hover:bg-red-200 dark:bg-red-950/80 dark:hover:bg-red-900 text-[#e4191e] border border-red-300 dark:border-red-800 transition cursor-pointer"
                title={`Kliko për të parë klauzolën ${clauseId} në Kodin e Standardeve`}
              >
                <span>{clauseId}</span>
                <ExternalLink className="w-3 h-3 text-[#e4191e]" />
              </button>
            ))}
          </div>
        </div>

        {/* Citations referenced in step */}
        {activeStep.citation_keys.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>Referenca akademike e lidhur:</span>
            {activeStep.citation_keys.map(key => (
              <button
                key={key}
                onClick={() => onSelectCitation && onSelectCitation(key)}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {key === 'diakopoulos2019' && '(Diakopoulos, 2019)'}
                {key === 'gadamer1989' && '(Gadamer, 1989)'}
              </button>
            ))}
          </div>
        )}

        {/* Public Interpretation Layer Backlink */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Shtresa e Interpretimit Publik:
          </span>
          <a
            href="/?page=mediaEducationFramework#shtylla-2-verifikimi"
            className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            title="Përkthyer në mjetet qytetare në Udhëzuesin Publik"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Shiko si zbatohet ky hap në Udhëzuesin Publik (Shtylla 2: Verifikimi) →</span>
          </a>
        </div>
      </div>
    </div>
  );
};
