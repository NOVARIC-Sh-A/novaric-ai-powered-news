import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Send,
  Clock,
  ShieldAlert,
  Copy,
  Printer,
  Search,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { CorrectionItem, ComplaintSubmission, ComplaintReceipt, StandardClause } from '../../types/standards';
import { standardsService } from '../../services/standardsService';

interface CorrectionsCenterProps {
  corrections: CorrectionItem[];
  clauses: StandardClause[];
  onRefreshCorrections?: () => void;
}

export const CorrectionsCenter: React.FC<CorrectionsCenterProps> = ({
  corrections,
  clauses,
  onRefreshCorrections,
}) => {
  // Form State
  const [claimUrl, setClaimUrl] = useState('');
  const [description, setDescription] = useState('');
  const [clauseRef, setClauseRef] = useState('MET-B');
  const [complainantEmail, setComplainantEmail] = useState('');
  const [complainantName, setComplainantName] = useState('');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ComplaintReceipt | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Search in corrections table
  const [correctionSearch, setCorrectionSearch] = useState('');

  const filteredCorrections = corrections.filter(c => {
    if (!correctionSearch.trim()) return true;
    const query = correctionSearch.toLowerCase();
    return (
      c.id.toLowerCase().includes(query) ||
      c.article_title.toLowerCase().includes(query) ||
      c.type.toLowerCase().includes(query) ||
      c.summary.toLowerCase().includes(query)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimUrl.trim()) {
      setErrorMessage('Ju lutem jepni linkun e artikullit për të cilin po ankoheni.');
      return;
    }
    if (!description.trim() || description.trim().length < 15) {
      setErrorMessage('Ju lutem shpjegoni qartë pasaktësinë (të paktën 15 karaktere).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const submission: ComplaintSubmission = {
      claim_url: claimUrl.trim(),
      description: description.trim(),
      clause_ref: clauseRef,
      complainant_email: complainantEmail.trim() || undefined,
      complainant_name: complainantName.trim() || undefined,
    };

    try {
      const res = await standardsService.submitComplaint(submission);
      setIsSubmitting(false);

      if (res && res.receipt_id) {
        setReceipt(res);
        // Reset form fields
        setClaimUrl('');
        setDescription('');
        setComplainantEmail('');
        setComplainantName('');
      } else {
        setErrorMessage('Dështoi regjistrimi i ankesës. Ju lutem provoni përsëri.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Dështoi regjistrimi i ankesës. Ju lutem provoni përsëri.');
    }
  };

  const copyTrackingCode = () => {
    if (receipt) {
      navigator.clipboard.writeText(receipt.tracking_code);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2500);
    }
  };

  return (
    <div id="corrections-center-module" className="space-y-10">
      {/* Policy Commitment Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-[#e4191e] uppercase tracking-wider text-white">
                Neni 3.3 • Politika e Korrigjimeve
              </span>
              <span className="text-xs text-slate-300 font-mono">
                SLA: 7 Ditë Pune
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1 text-white">
              Transparenca e Gabimeve & Kanali Publik i Ankesave
            </h3>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              "Transparenca për gabimet është thelbësore për besueshmërinë" (Kovach & Rosenstiel, 2014). NOVARIC® zotohet të korrigjojë çdo gabim faktik menjëherë dhe hapur, duke ruajtur historikun publik të pandryshueshëm të çdo ndërhyrjeje.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-right shrink-0">
            <span className="text-xs text-slate-400 block">Koha Mesatare e Trajtimit</span>
            <span className="text-2xl font-mono font-extrabold text-emerald-400">18.4 Orë</span>
            <span className="text-[11px] text-slate-400 block">Brenda kufirit prej 7 ditësh</span>
          </div>
        </div>
      </div>

      {/* Section 1: Public Corrections Ledger */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#e4191e]" /> Regjistri Publik i Korrigjimeve të Kryera
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Historiku kronologjik i të gjitha saktësimeve, sqarimeve kontekstuale dhe përmirësimeve faktike.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={correctionSearch}
              onChange={e => setCorrectionSearch(e.target.value)}
              placeholder="Filtro regjistrin..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#e4191e]"
            />
          </div>
        </div>

        {filteredCorrections.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Nuk u gjet asnjë korrigjim me këto kritere kërkimi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Numri ID</th>
                  <th className="py-3 px-3">Artikulli i Ndikuar</th>
                  <th className="py-3 px-3">Tipi i Korrigjimit</th>
                  <th className="py-3 px-3">Përmbledhja & Veprimi Redaksional</th>
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3">Verifikuesi</th>
                  <th className="py-3 px-3 text-right">Statusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredCorrections.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-3 max-w-xs font-medium text-slate-800 dark:text-slate-200">
                      <span className="line-clamp-2" title={item.article_title}>
                        {item.article_title}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.type === 'Faktik'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : item.type === 'Kontekstual'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
                      {item.summary}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(item.published_at).toLocaleDateString('sq-AL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {item.reviewer}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Direct Citizen Complaint / Correction Request Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#e4191e]" /> Formulari Zyrtar i Kërkesës për Korrigjim
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Sipas Nenit 3.3.D, çdo lexues mund të paraqesë prova për korrigjimin e një fakti të pasaktë ose mangësie kontekstuale.
            </p>
          </div>

          {receipt ? (
            /* Success Receipt Card */
            <div className="p-5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    Kërkesa Juaj u Regjistrua me Sukses!
                  </h5>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
                    {receipt.message}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900 font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kodi i Dëftesës (Receipt ID):</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{receipt.receipt_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kodi i Ndjekjes:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{receipt.tracking_code}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Afati Maksimal i Përgjigjes (SLA):</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {new Date(receipt.sla_due_at).toLocaleDateString('sq-AL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={copyTrackingCode}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedTracking ? 'U Kopjua!' : 'Kopjo Kodin e Ndjekjes'}
                </button>
                <button
                  type="button"
                  onClick={() => setReceipt(null)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Dërgo një Kërkesë Tjetër
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#e4191e] shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Claim URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Linku / URL e Artikullit të NOVARIC® <span className="text-[#e4191e]">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={claimUrl}
                  onChange={e => setClaimUrl(e.target.value)}
                  placeholder="https://media.novaric.al/?page=newsDetail&id=..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#e4191e]"
                />
              </div>

              {/* Clause Reference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Klauzola e Kodit e Prekur (Opsionale)
                </label>
                <select
                  value={clauseRef}
                  onChange={e => setClauseRef(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#e4191e]"
                >
                  {clauses.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.id}] Neni {c.neni}.{c.letter} — {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Përshkrimi i Pasaktësisë & Provat që Zotëroni <span className="text-[#e4191e]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Shpjegoni me hollësi çfarë është e pasaktë, cito burimet parësore zyrtare dhe bashkëngjitni lidhjet me provat verifikuese..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#e4191e]"
                />
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Email Kontakti (për njoftime mbi statusin)
                  </label>
                  <input
                    type="email"
                    value={complainantEmail}
                    onChange={e => setComplainantEmail(e.target.value)}
                    placeholder="shembull@email.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#e4191e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Emri Juaj / Organizata (opsionale)
                  </label>
                  <input
                    type="text"
                    value={complainantName}
                    onChange={e => setComplainantName(e.target.value)}
                    placeholder="Emri ose Anonim"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#e4191e]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#e4191e] hover:bg-[#c01418] text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Po regjistrohet...' : 'Dërgo Kërkesën për Korrigjim'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Info: Protocol and IFCN Escalation Note */}
        <div className="lg:col-span-5 space-y-4">
          {/* SLA Timeline Protocol */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-3">
            <h5 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#e4191e]" /> Protokolli i Trajtimit
            </h5>
            <ol className="space-y-2.5 text-slate-600 dark:text-slate-300 pl-4 list-decimal">
              <li>
                <strong>Regjistrimi i Menjëhershëm:</strong> Gjenerohet dëftesa dixhitale me kod unik ndjekjeje.
              </li>
              <li>
                <strong>Shqyrtimi Fillestar (24-48 orë):</strong> Redaktori përgjegjës krahason provat e paraqitura me materialin parësor të botuar.
              </li>
              <li>
                <strong>Verifikimi me Autorin & Peer Review (Ditët 3-5):</strong> Nëse konstatohet gabim, përgatitet shënimi i korrigjimit sipas Nenit 3.3.B.
              </li>
              <li>
                <strong>Publikimi & Përditësimi i Regjistrit (Maksimumi 7 ditë):</strong> Publikohet saktësimi në krye të artikullit dhe në këtë regjistër.
              </li>
            </ol>
          </div>

          {/* IFCN Escalation Note */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 p-5 rounded-xl border border-amber-300 dark:border-amber-800 text-xs space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>E Drejta e Përshkallëzimit pranë IFCN</span>
            </div>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
              Nëse besoni se NOVARIC® ka shkelur Kodin e Parimeve të IFCN dhe ankesa juaj nuk është trajtuar me paanshmëri ose brenda afatit ligjor, ju keni të drejtën të paraqisni ankesë të drejtpërdrejtë tek rrjeti ndërkombëtar:
            </p>
            <a
              href="https://ifcncodeofprinciples.poynter.org/complaints-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-100 hover:underline pt-1"
            >
              <span>Politika Zyrtare e Ankesave të IFCN</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
