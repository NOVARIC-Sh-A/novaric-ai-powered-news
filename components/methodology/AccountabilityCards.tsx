// components/methodology/AccountabilityCards.tsx
import React, { useState } from 'react';
import {
  Scale,
  Shield,
  FileCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Landmark,
  Eye,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { FrameworkPrinciple } from '../../types/methodology';

interface AccountabilityCardsProps {
  principles: FrameworkPrinciple[];
  onSelectCitation?: (citationKey: string) => void;
  onNavigateToStandards?: (sub?: string) => void;
}

export const AccountabilityCards: React.FC<AccountabilityCardsProps> = ({
  principles,
  onSelectCitation,
  onNavigateToStandards,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getPrincipleIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Eye className="w-5 h-5 text-blue-500" />;
      case 1:
        return <Landmark className="w-5 h-5 text-emerald-600" />;
      case 2:
        return <Shield className="w-5 h-5 text-purple-500" />;
      case 3:
        return <RefreshCw className="w-5 h-5 text-amber-500" />;
      default:
        return <FileCheck className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
          <Scale className="w-3.5 h-3.5 text-blue-600" />
          Korniza e Përgjegjësisë & Pajtueshmëria Rregullatore
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Përputhshmëria me Aktet Evropiane (DSA & EMFA)
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
          Korniza jonë e llogaridhënies harmonizon praktikat gazetareske të NOVARIC® me kërkesat e Aktit të Shërbimeve Dixhitale (DSA) dhe Aktit Evropian të Lirisë së Medias (EMFA), duke garantuar pavarësi dhe mbrojtje ligjore të paanshme.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {principles.map((p, idx) => {
          const isExpanded = expandedId === p.id;

          return (
            <div
              key={p.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Top: Icon + Anchor Badge + Status */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                      {getPrincipleIcon(idx)}
                    </div>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      {p.legal_anchor_label}
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {p.status_badge}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {p.title}
                </h4>

                {/* Verbatim Body Text */}
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {p.body_text}
                </p>

                {/* Expanded Legal Context Detail */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong className="font-bold text-slate-800 dark:text-slate-100 block mb-1">
                        Baza Rregullatore Evropiane:
                      </strong>
                      {p.legal_anchor_detail}
                    </div>

                    {p.citation_keys.length > 0 && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                        <span>Referencë akademike:</span>
                        {p.citation_keys.map(ck => (
                          <button
                            key={ck}
                            onClick={() => onSelectCitation && onSelectCitation(ck)}
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            {ck === 'livingstone2004' && '(Livingstone, 2004)'}
                            {ck === 'mungiu2013' && '(Mungiu-Pippidi, 2013)'}
                            {ck === 'kovach2014' && '(Kovach & Rosenstiel, 2014)'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

                {/* Footer Bar with Standards Hub Evidence Link */}
                <div className="px-5 py-3 bg-white/70 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/80 rounded-b-xl flex items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => {
                      if (onNavigateToStandards) {
                        const targetSub = p.evidence_url.includes('korrigjime')
                          ? 'korrigjime'
                          : p.evidence_url.includes('transparence')
                          ? 'transparence'
                          : 'perputhshmeri';
                        onNavigateToStandards(targetSub);
                      } else {
                        window.location.href = p.evidence_url;
                      }
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-[#e4191e] hover:underline cursor-pointer"
                  >
                    <span>Lidhja me Kodin: {p.standards_ref}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => toggleExpand(p.id)}
                    className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                  >
                    <span>{isExpanded ? 'Më pak' : 'Detaje'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
