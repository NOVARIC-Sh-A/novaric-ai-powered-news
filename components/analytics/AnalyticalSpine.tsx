// components/analytics/AnalyticalSpine.tsx
import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Sparkles,
  Activity,
  UserCheck,
  BookOpen,
  ChevronRight,
  Info,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

export type SpineTier = 'doktrina' | 'metoda' | 'korniza' | 'vleresimi' | 'udhezues' | 'entiteti';

interface SpineNode {
  id: SpineTier;
  title: string;
  subtitle: string;
  badge: string;
  route: string;
  hoverExplanation: string;
  colorClass: {
    activeBg: string;
    activeText: string;
    activeBorder: string;
    pillBg: string;
    icon: string;
  };
}

const SPINE_NODES: SpineNode[] = [
  {
    id: 'doktrina',
    title: 'Doktrina',
    subtitle: 'Kodi i Standardeve',
    badge: 'Nenet 1–4',
    route: '/?page=standards',
    hoverExplanation:
      'Doktrina gazetareske & ligjore: standardet e detyrueshme (EFCSN/IFCN), kodi deontologjik dhe angazhimi publik.',
    colorClass: {
      activeBg: 'bg-[#0b1329]',
      activeText: 'text-sky-300',
      activeBorder: 'border-sky-400',
      pillBg: 'bg-sky-950/80 text-sky-300 border-sky-800',
      icon: 'text-sky-400',
    },
  },
  {
    id: 'metoda',
    title: 'Metoda',
    subtitle: 'Sinergjia Hermeneutike',
    badge: 'Hapat 1–3',
    route: '/?page=methodology',
    hoverExplanation:
      'Metodologjia hibride e verifikimit: IA për shkallë e shpejtësi + Mbikëqyrje njerëzore hermeneutike (DSA/EMFA).',
    colorClass: {
      activeBg: 'bg-teal-900',
      activeText: 'text-teal-200',
      activeBorder: 'border-teal-400',
      pillBg: 'bg-teal-950/80 text-teal-300 border-teal-800',
      icon: 'text-teal-400',
    },
  },
  {
    id: 'korniza',
    title: 'Korniza',
    subtitle: 'MARAGON®',
    badge: 'R • A • G • O',
    route: '/?page=maragonFramework',
    hoverExplanation:
      'Korniza analitike 4-dimensionale: Gatishmëria (R), Aftësia (A), Qeverisja (G) dhe Kujdesi Mbikëqyrës (O).',
    colorClass: {
      activeBg: 'bg-rose-950',
      activeText: 'text-rose-200',
      activeBorder: 'border-[#e4191e]',
      pillBg: 'bg-rose-950/80 text-rose-300 border-red-800',
      icon: 'text-[#e4191e]',
    },
  },
  {
    id: 'vleresimi',
    title: 'Vlerësimi Live',
    subtitle: 'Matrica e Integritetit',
    badge: '8 Metrika',
    route: '/?page=articleMetricsExplained',
    hoverExplanation:
      'Pikëzimi empirik në kohë reale: Besueshmëria, Sentimenti, Lexueshmëria, Përputhshmëria dhe CSR.',
    colorClass: {
      activeBg: 'bg-emerald-950',
      activeText: 'text-emerald-200',
      activeBorder: 'border-emerald-400',
      pillBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
      icon: 'text-emerald-400',
    },
  },
  {
    id: 'udhezues',
    title: 'Udhëzues Publik',
    subtitle: 'Edukimi Mediatik',
    badge: '3 Shtyllat',
    route: '/?page=mediaEducationFramework',
    hoverExplanation:
      'Shtresa publike e interpretimit: mjetet praktike të leximit kritik dhe edukimit mediatik të bazuara në doktrinë.',
    colorClass: {
      activeBg: 'bg-amber-950',
      activeText: 'text-amber-200',
      activeBorder: 'border-amber-400',
      pillBg: 'bg-amber-950/80 text-amber-300 border-amber-800',
      icon: 'text-amber-400',
    },
  },
  {
    id: 'entiteti',
    title: 'Entiteti',
    subtitle: 'Objekti i Analizës',
    badge: 'Media / VIP',
    route: '/?page=newsList',
    hoverExplanation:
      'Entiteti konkret gazetaresk: artikull lajmi, emision televiziv, redaksi ose profil politik.',
    colorClass: {
      activeBg: 'bg-purple-950',
      activeText: 'text-purple-200',
      activeBorder: 'border-purple-400',
      pillBg: 'bg-purple-950/80 text-purple-300 border-purple-800',
      icon: 'text-purple-400',
    },
  },
];

interface AnalyticalSpineProps {
  currentTier: SpineTier;
  activeEntityLabel?: string;
  onNavigateTier?: (tier: SpineTier) => void;
  className?: string;
}

export const AnalyticalSpine: React.FC<AnalyticalSpineProps> = ({
  currentTier,
  activeEntityLabel,
  onNavigateTier,
  className = '',
}) => {
  const [hoveredTier, setHoveredTier] = useState<SpineTier | null>(null);

  const handleNodeClick = (node: SpineNode) => {
    if (onNavigateTier) {
      onNavigateTier(node.id);
    } else {
      window.location.href = node.route;
    }
  };

  const activeNode = SPINE_NODES.find(n => n.id === currentTier) || SPINE_NODES[0];
  const hoveredNode = hoveredTier ? SPINE_NODES.find(n => n.id === hoveredTier) : null;

  return (
    <div
      className={`w-full bg-[#070d1e] text-slate-200 border-b border-slate-800/90 shadow-sm select-none ${className}`}
      aria-label="Shtylla Analitike NOVARIC"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
          {/* Left Title / Branding Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-[#e4191e] animate-pulse" />
              Shtylla Analitike
            </span>
            <span className="text-[11px] text-slate-400 hidden xl:inline">
              Prejardhja Konceptuale:
            </span>
          </div>

          {/* Stepper Nodes */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
            {SPINE_NODES.map((node, index) => {
              const isCurrent = node.id === currentTier;
              const isLast = index === SPINE_NODES.length - 1;

              return (
                <React.Fragment key={node.id}>
                  <button
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => setHoveredTier(node.id)}
                    onMouseLeave={() => setHoveredTier(null)}
                    className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap border ${
                      isCurrent
                        ? `${node.colorClass.activeBg} ${node.colorClass.activeText} ${node.colorClass.activeBorder} shadow-sm ring-1 ring-white/10`
                        : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-800'
                    }`}
                    title={node.hoverExplanation}
                  >
                    {node.id === 'doktrina' && <Shield className={`w-3.5 h-3.5 ${isCurrent ? node.colorClass.icon : 'text-slate-500'}`} />}
                    {node.id === 'metoda' && <Sparkles className={`w-3.5 h-3.5 ${isCurrent ? node.colorClass.icon : 'text-slate-500'}`} />}
                    {node.id === 'korniza' && <Layers className={`w-3.5 h-3.5 ${isCurrent ? node.colorClass.icon : 'text-slate-500'}`} />}
                    {node.id === 'vleresimi' && <Activity className={`w-3.5 h-3.5 ${isCurrent ? node.colorClass.icon : 'text-slate-500'}`} />}
                    {node.id === 'udhezues' && <BookOpen className={`w-3.5 h-3.5 ${isCurrent ? node.colorClass.icon : 'text-slate-500'}`} />}
                    {node.id === 'entiteti' && <UserCheck className={`w-3.5 h-3.5 ${isCurrent ? node.colorClass.icon : 'text-slate-500'}`} />}

                    <span>{node.title}</span>

                    <span
                      className={`hidden sm:inline text-[9px] font-mono px-1 py-0.2 rounded border ${
                        isCurrent
                          ? node.colorClass.pillBg
                          : 'bg-slate-800/60 text-slate-500 border-slate-700'
                      }`}
                    >
                      {node.badge}
                    </span>

                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    )}
                  </button>

                  {!isLast && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mx-0.5" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Active Context / Hovered Explainer */}
          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate max-w-xs xl:max-w-md">
              {hoveredNode ? (
                <strong className="text-white font-medium">
                  {hoveredNode.title}: {hoveredNode.hoverExplanation}
                </strong>
              ) : (
                <>
                  <span className="text-slate-500">Pozicioni aktual:</span>{' '}
                  <strong className="text-slate-200">
                    {activeNode.title} ({activeNode.subtitle})
                  </strong>
                  {activeEntityLabel && (
                    <span className="ml-1 text-slate-400">• {activeEntityLabel}</span>
                  )}
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
