import React from 'react';
import {
  Building2,
  FileCheck2,
  PieChart,
  Users2,
  ShieldCheck,
  ExternalLink,
  Award,
  Download,
  Landmark,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { TransparencyLedgerItem } from '../../types/standards';

interface TransparencyLedgerProps {
  items: TransparencyLedgerItem[];
}

export const TransparencyLedger: React.FC<TransparencyLedgerProps> = ({ items }) => {
  const leadershipProfiles = [
    {
      name: 'Dr. Alban Gj. THIKA',
      role: 'Kryetar i Bordit & Drejtues i Kërkimit Metodologjik',
      bio: 'Doktor i Shkencave, arkitekt i sistemit Paragon dhe udhëheqës i kornizës së integritetit të të dhënave gazetareske në Shqipëri.',
      affiliation: 'NOVARIC® Sh.A. & Departamenti i Shkencave Politike',
    },
    {
      name: 'Paneli i Pavarur Editorial',
      role: 'Mbikëqyrja e Paanshmërisë & Fact-Checking',
      bio: 'Grup i pavarur gazetarësh investigativë dhe studiuesish të medias që zbatojnë protokollin e verifikimit me dy çelësa.',
      affiliation: 'Redaksia e Pavarur NOVARIC® Media',
    },
    {
      name: 'Njësia e Etikës Nora AI',
      role: 'Auditimi i Inteligjencës Artificiale & Modeleve Gjuhësore',
      bio: 'Ekspertë të etikës llogaritëse dhe inxhinierë të sistemeve që mbikëqyrin modelet Gemini 2.5 dhe Aletheia Logic Parser.',
      affiliation: 'Laboratori i Inteligjencës Artificiale NOVARIC®',
    },
  ];

  const revenueBreakdown = [
    {
      source: 'Shërbime Teknologjike B2B & Licenca Software',
      percentage: 72,
      description: 'Zgjidhje softuerike për analizë të dhënash, monitorim mediatik për sektorin privat dhe analiza semantike.',
    },
    {
      source: 'Grante Kërkimore për Të Dhëna të Hapura (Open Data)',
      percentage: 28,
      description: 'Mbështetje institucionale nga organizata jofitimprurëse ndërkombëtare për transparencën e diskursit publik.',
    },
    {
      source: 'Financim Shtetëror ose Parti Politike',
      percentage: 0,
      description: 'Ndaluar rreptësisht sipas Nenit 4.2.C të këtij Kodi. ZERO financim nga aktorë politikë apo qeveritarë.',
    },
  ];

  return (
    <div id="transparency-ledger-module" className="space-y-8">
      {/* Intro Box */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-[#e4191e] uppercase tracking-wider text-white">
                Neni 4 • Transparenca & Pronësia
              </span>
              <span className="text-xs text-slate-300 font-mono">
                EUIPO Reg. 018892110
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1 text-white">
              Regjistri i Hapur i Pronësisë dhe Burimeve të Financimit
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Përputhshmëria e plotë me Nenin 4 të Kodit garanton se çdo qytetar e di ekzaktësisht kush e zotëron NOVARIC®, si financohet platforma, dhe si mbrohet pavarësia e gazetarëve nga çdo presion i jashtëm.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-right shrink-0">
            <span className="text-xs text-slate-400 block">Sponsorizime të Verifikimeve</span>
            <span className="text-2xl font-mono font-extrabold text-emerald-400">0.00 LEK</span>
            <span className="text-[11px] text-emerald-400 block">Neni 4.2.C Zbatuar 100%</span>
          </div>
        </div>
      </div>

      {/* Grid: Legal Identity & Funding */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Legal Identity Card */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Building2 className="w-5 h-5 text-[#e4191e]" />
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Statusi Ligjor dhe Pronësia Korporative
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-500">Emri i Regjistruar:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">NOVARIC® Sh.A.</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-500">Jurisdiksioni:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">Republika e Shqipërisë (Shkodër / Tiranë)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-500">QKB (Regjistri Tregtar):</span>
              <a
                href="/trademarkCertificate"
                className="font-bold text-[#e4191e] hover:underline flex items-center gap-1"
              >
                Ekstrakti Historik QKB <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-500">Marka Tregtare Ndërkombëtare:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">EUIPO No. 018892110</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Misioni Ligjor:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300 text-right max-w-xs">
                Inovacion teknologjik, inteligjencë mediatike dhe verifikim i fakteve me shërbim publik.
              </span>
            </div>
          </div>
        </div>

        {/* Funding Independence Card */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <PieChart className="w-5 h-5 text-[#e4191e]" />
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Burimet e të Ardhurave & Muri Kinez (Neni 4.2)
            </h4>
          </div>

          <div className="space-y-4">
            {revenueBreakdown.map((rev, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200">
                  <span>{rev.source}</span>
                  <span className="font-mono font-bold">{rev.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      rev.percentage === 0
                        ? 'bg-slate-300'
                        : rev.percentage > 50
                        ? 'bg-[#e4191e]'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${rev.percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">{rev.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership & Editorial Board */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users2 className="w-5 h-5 text-[#e4191e]" /> Ekipi Drejtues dhe Bordi i Pavarur Editorial (Neni 4.1.C)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Identiteti dhe përgjegjësitë e vendimmarrësve kryesorë të gazetarisë dhe integritetit në NOVARIC®.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leadershipProfiles.map((lead, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col justify-between text-xs space-y-3"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#e4191e]">
                  {lead.affiliation}
                </span>
                <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {lead.name}
                </h5>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                  {lead.role}
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {lead.bio}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Deklaratë Interesash e Verifikuar</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Verifiable Documents Archive */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600" /> Dokumentacioni i Hapur i Provave (Open Evidence Archive)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumente formale, certifikata dhe raporte të auditimit të qasshme lirisht për çdo lexues.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map(item => (
            <a
              key={item.id}
              href={item.document_url || item.evidence_url}
              className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#e4191e] bg-slate-50/70 dark:bg-slate-900/50 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">{item.id}</span>
                <h6 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#e4191e] transition mt-1">
                  {item.title}
                </h6>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400">
                <span>{item.file_format || 'PDF Zyrtar'}</span>
                <span className="text-[#e4191e] font-bold flex items-center gap-1">
                  Shiko <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
