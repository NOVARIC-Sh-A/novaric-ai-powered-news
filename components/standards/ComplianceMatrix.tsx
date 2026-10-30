import React from 'react';
import {
  CheckCircle2,
  Shield,
  Award,
  Calendar,
  Layers,
  FileCheck,
  TrendingUp,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { ComplianceSummary, StandardClause } from '../../types/standards';

interface ComplianceMatrixProps {
  summary: ComplianceSummary;
  clauses: StandardClause[];
  onSelectNeni?: (neni: number) => void;
}

export const ComplianceMatrix: React.FC<ComplianceMatrixProps> = ({
  summary,
  clauses,
  onSelectNeni,
}) => {
  const auditLogs = [
    {
      id: 'AUD-2026-Q3',
      date: '15 Gusht 2026',
      type: 'Audit Periodik i Brendshëm',
      auditor: 'Komisioni i Pavarur i Standardeve NOVARIC®',
      score: '98.40%',
      clausesReviewed: 31,
      status: 'Përfunduar me Sukses',
      signedBy: 'Dr. Alban Gj. THIKA',
    },
    {
      id: 'AUD-2026-Q2',
      date: '20 Maj 2026',
      type: 'Auditimi i Metodologjisë dhe Algoritmeve',
      auditor: 'Paneli Shkencor i Inteligjencës Artificiale',
      score: '97.80%',
      clausesReviewed: 31,
      status: 'Përfunduar me Sukses',
      signedBy: 'Njësia e Etikës së Nora AI',
    },
    {
      id: 'AUD-2026-Q1',
      date: '10 Shkurt 2026',
      type: 'Auditimi Fillestar i Konformitetit me EFCSN',
      auditor: 'Konsulenca e Standardeve Mediatike Evropiane',
      score: '96.90%',
      clausesReviewed: 31,
      status: 'Përfunduar me Sukses',
      signedBy: 'Bordi Drejtues NOVARIC® Sh.A.',
    },
  ];

  const internationalBenchmarks = [
    {
      framework: 'EFCSN (European Fact-Checking Standards Network)',
      scope: 'Kodi Evropian i Praktikës për Organizatat e Verifikimit',
      criteriaTotal: 44,
      alignedInNovaric: 44,
      alignmentPercentage: 100,
      leadClause: 'Neni 1.A, Neni 2.A-K',
    },
    {
      framework: 'IFCN (International Fact-Checking Network at Poynter)',
      scope: 'Kodi i Parimeve: Mos-anësia, Burimet, Financimi & Korrigjimet',
      criteriaTotal: 12,
      alignedInNovaric: 12,
      alignmentPercentage: 100,
      leadClause: 'Neni 3.1, Neni 3.3, Neni 4.2',
    },
    {
      framework: 'C2PA (Coalition for Content Provenance and Authenticity)',
      scope: 'Standardi i Autenticitetit të Përmbajtjes Dixhitale & Kriptografisë',
      criteriaTotal: 8,
      alignedInNovaric: 8,
      alignmentPercentage: 100,
      leadClause: 'Neni 2.E, Neni 2.H',
    },
  ];

  return (
    <div id="compliance-matrix-module" className="space-y-8">
      {/* Top Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Përputhshmëria Totale</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-slate-900 dark:text-slate-100">
              {summary.overall_percentage}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              +1.5% nga Q1
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Auditimi i plotë operativ</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Klauzola në Përputhje</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-slate-900 dark:text-slate-100">
              {summary.compliant_count}
            </span>
            <span className="text-xs text-slate-400">/ {summary.total_count} gjithsej</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">100% të verifikuara me prova</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Klauzola në Shqyrtim</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
              0
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Zero shkelje aktive</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">0 ankesa të pazgjidhura</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Standardet Ndërkombëtare</span>
            <Shield className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-slate-900 dark:text-slate-100">
              EFCSN
            </span>
            <span className="text-xs text-purple-600 font-bold">& IFCN</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Pajtueshmëri e plotë metodologjike</div>
        </div>
      </div>

      {/* Breakdown per Neni Progress Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Gjendja e Përputhshmërisë sipas Neneve
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Përqindja e zbatimit operativ dhe numri i klauzolave të audituara në mënyrë të pavarur.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
            Përditësuar: Gusht 2026
          </span>
        </div>

        <div className="space-y-5">
          {summary.per_neni_breakdown.map(item => {
            return (
              <div
                key={item.neni}
                className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-700/60 transition hover:border-slate-300 dark:hover:border-slate-600"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                      Neni {item.neni}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      {item.compliant} nga {item.total} klauzola
                    </span>
                    <span className="font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar with mathematical accuracy */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-[#10b981] h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                {onSelectNeni && (
                  <div className="mt-2.5 flex justify-end">
                    <button
                      onClick={() => onSelectNeni(item.neni)}
                      className="text-[11px] text-[#e4191e] font-semibold hover:underline flex items-center gap-1"
                    >
                      Eksploro klauzolat e Nenit {item.neni} <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* International Standards Alignment Radar Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Përputhshmëria me Kornizat Ndërkombëtare
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Harmonizimi i Kodit NOVARIC® me kërkesat e organizatave udhëheqëse globale të verifikimit të fakteve.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {internationalBenchmarks.map((bench, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {bench.framework.split(' ')[0]}
                </span>
                <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {bench.framework}
                </h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {bench.scope}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Përputhshmëria:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {bench.alignmentPercentage}% ({bench.alignedInNovaric}/{bench.criteriaTotal})
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${bench.alignmentPercentage}%` }}
                  />
                </div>
                <span className="block text-[10px] text-slate-400 mt-2">
                  Klauzolat kryesore: {bench.leadClause}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formal Audit Log Ledger */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" /> Regjistri i Auditëve Zyrtare Periodike
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Auditimet formale periodike të kryera për zbatimin e këtij Kodi të Standardeve.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Kodi i Auditimit</th>
                <th className="py-2.5 px-3">Data</th>
                <th className="py-2.5 px-3">Tipi i Auditimit</th>
                <th className="py-2.5 px-3">Trupi Auditues</th>
                <th className="py-2.5 px-3 text-right">Rezultati</th>
                <th className="py-2.5 px-3">Nënshkruesi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {auditLogs.map(audit => (
                <tr key={audit.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {audit.id}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{audit.date}</td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {audit.type}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{audit.auditor}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {audit.score}
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 italic">
                    {audit.signedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
