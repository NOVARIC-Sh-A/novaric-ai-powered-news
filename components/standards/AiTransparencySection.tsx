import React, { useState } from 'react';
import {
  Cpu,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Users,
  Server,
  Lock,
  ExternalLink,
  Sparkles,
  HelpCircle,
  FileCheck,
  Layers,
  Fingerprint,
} from 'lucide-react';
import { AiRegistryEntry } from '../../types/standards';

interface AiTransparencySectionProps {
  models: AiRegistryEntry[];
}

export const AiTransparencySection: React.FC<AiTransparencySectionProps> = ({ models }) => {
  const [showC2paModal, setShowC2paModal] = useState(false);

  return (
    <div id="ai-transparency-module" className="space-y-8">
      {/* Intro Header */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-purple-600 uppercase tracking-wider text-white">
                Transparenca e Inteligjencës Artificiale (IA)
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Human-in-the-Loop Standard
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1 text-white">
              Përdorimi i Përgjegjshëm i Inteligjencës Artificiale në NOVARIC®
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Teknologjia e inteligjencës artificiale përdoret ekskluzivisht si mjet mbështetës llogaritës për kërkimin, sintezën e të dhënave të hapura dhe triangulimin burimor. Asnjë verdikt, artikull apo fakt-kontroll nuk publikohet pa recensim dhe miratim njerëzor (Human-in-the-Loop).
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-right shrink-0">
            <span className="text-xs text-slate-400 block">Niveli i Mbikëqyrjes Njerëzore</span>
            <span className="text-2xl font-mono font-extrabold text-purple-400">100% Manual</span>
            <span className="text-[11px] text-slate-400 block">Zero publikime plotësisht autonome</span>
          </div>
        </div>
      </div>

      {/* Model Registry Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#e4191e]" /> Regjistri Publik i Modeleve të Inteligjencës Artificiale
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            {models.length} Modele të Certifikuara
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map(model => (
            <div
              key={model.id}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      {model.id}
                    </span>
                    <h5 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {model.model_name}
                    </h5>
                  </div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {model.version}
                  </span>
                </div>

                <div className="mt-3 space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Infrastruktura & Siguria:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <Server className="w-3.5 h-3.5 text-blue-500" />
                      {model.provider}
                    </span>
                    <span className="text-[11px] text-slate-500 block pl-5 font-mono mt-0.5">
                      Tier: {model.architecture_tier}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Qëllimi & Fusha e Veprimit:</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">
                      {model.purpose}
                    </p>
                  </div>

                  {/* Human-in-the-Loop Step */}
                  <div className="p-3 rounded-lg bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
                    <span className="text-purple-900 dark:text-purple-200 font-bold flex items-center gap-1.5 mb-1">
                      <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      Hapi i Detyrueshëm i Mbikëqyrjes Njerëzore:
                    </span>
                    <p className="text-purple-950 dark:text-purple-100 leading-relaxed">
                      {model.human_oversight_step}
                    </p>
                  </div>

                  {/* Capabilities Badges */}
                  <div>
                    <span className="text-slate-400 font-medium block mb-1.5">
                      Aftësitë Algoritmike të Lejuara:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {model.capabilities.map((cap, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {model.compliance_status}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Audituar: {new Date(model.last_updated).toLocaleDateString('sq-AL', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-Article AI Badge Demonstration */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e4191e]" /> Etiketimi Publik në Çdo Artikull (Per-Article Provenance)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Çdo material në portal mban etiketën e dukshme që shpjegon shkallën e përfshirjes së IA-së dhe autorin njerëzor përgjegjës.
          </p>
        </div>

        {/* Badge Preview */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  KODI I PROVENANCËS: HIBRID I VERIFIKUAR
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-semibold">
                  data-ai-involvement="hybrid-verified"
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Strukturuar nga Nora AI Core v2.4 • Rishikuar & Konfirmuar nga Redaksia e Pavarur NOVARIC®
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowC2paModal(true)}
            className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition flex items-center gap-1.5 shrink-0"
          >
            <Fingerprint className="w-4 h-4 text-[#e4191e]" />
            <span>Verifiko me C2PA</span>
          </button>
        </div>
      </div>

      {/* C2PA Credentials Modal */}
      {showC2paModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-[#e4191e]" />
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Kredencialet C2PA të Përmbajtjes
                </h4>
              </div>
              <button
                onClick={() => setShowC2paModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="text-slate-400">MANIFEST SIGNER:</div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  NOVARIC Content Authority (Certificate #NOV-C2PA-2026)
                </div>
                <div className="text-slate-400 pt-1">DIGEST SHA-256:</div>
                <div className="text-emerald-600 dark:text-emerald-400 break-all">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
                <div className="text-slate-400 pt-1">TIMESTAMP:</div>
                <div className="text-slate-700 dark:text-slate-300">
                  2026-09-12T12:00:00Z (RFC 3161 Qualified Timestamp)
                </div>
                <div className="text-slate-400 pt-1">ACTIONS LOGGED:</div>
                <div className="text-slate-700 dark:text-slate-300">
                  c2pa.created, c2pa.edited.editorial_review, c2pa.published
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowC2paModal(false)}
                className="px-4 py-2 text-xs font-bold bg-[#e4191e] hover:bg-[#c01418] text-white rounded-lg transition"
              >
                Mbyll Dritaren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
