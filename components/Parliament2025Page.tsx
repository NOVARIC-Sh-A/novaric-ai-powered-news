// components/Parliament2025Page.tsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ParliamentDistrict,
  VipProfile,
} from "../types";
import { ChevronDownIcon, UsersIcon } from "./icons";
import { PoliticianGridCard } from "./figurat-politike/PoliticianGridCard";
import { PoliticianComparisonModal } from "./PoliticianComparisonModal";
import { fetchParliamentRoster, fetchPoliticianCards } from "../services/apiService";
import {
  ShieldAlert,
  Clock,
  Layers,
  MapPin,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Filter,
} from "lucide-react";

/* ----------------------------------------------------------
   CONFIG & CERTIFIED BASELINE
---------------------------------------------------------- */
const MAX_COMPARE_ITEMS = 3;

const CERTIFIED_DISTRICT_MANDATES: Record<string, number> = {
  "Tiranë": 37,
  "Fier": 16,
  "Durrës": 14,
  "Elbasan": 14,
  "Vlorë": 12,
  "Shkodër": 11,
  "Korçë": 10,
  "Berat": 7,
  "Lezhë": 7,
  "Dibër": 5,
  "Gjirokastër": 4,
  "Kukës": 3,
};

export type ViewTab = "qarqet" | "harta" | "roster" | "krahasuesi";

export interface DistrictStatus {
  district: string;
  mandates: number;
  linkedProfiles: number;
  verifiedMandates: number;
  profilesWithPhotos: number;
  paragonAuditComplete: number;
  partyComposition: { party: string; count: number }[];
}

/* ----------------------------------------------------------
   DISTRICT VERIFICATION STRIP (REPLACES SYNTHETIC HEAT BAR)
---------------------------------------------------------- */
const DistrictVerificationStrip: React.FC<{
  district: string;
  mandates: number;
  linkedCount: number;
  parties: { partyName: string; mandatesWon: number }[];
}> = ({ district, mandates, linkedCount, parties }) => {
  const isFullyLinked = linkedCount === mandates;

  return (
    <div className="w-full my-4 p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Verification status chip */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
            Statusi i Verifikimit:
          </span>
          {isFullyLinked ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Mandate të Lidhura: {linkedCount}/{mandates}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Lidhur: {linkedCount}/{mandates}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            PARAGON®: Audit në proces
          </span>
        </div>

        {/* Party composition summary */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-medium">Përbërja:</span>
          {parties.map((p) => (
            <span
              key={p.partyName}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              {p.partyName} <span className="text-blue-600 dark:text-blue-400 font-extrabold">{p.mandatesWon}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------
   INTERACTIVE MAP COMPONENT (12-DISTRICT SCHEMATIC)
---------------------------------------------------------- */
const SchematicDistrictMap: React.FC<{
  districts: ParliamentDistrict[];
  activeDistrict: string | null;
  onSelectDistrict: (name: string) => void;
  statusMap: Record<string, DistrictStatus>;
}> = ({ districts, activeDistrict, onSelectDistrict, statusMap }) => {
  // 12 districts schematic matrix layout (4 rows x 3 columns)
  const cols = 3;
  const cellW = 100;
  const cellH = 75;
  const gap = 12;
  const rows = Math.ceil(districts.length / cols);
  const width = cols * cellW + (cols + 1) * gap;
  const height = rows * cellH + (rows + 1) * gap;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Harta Skematike e 12 Qarqeve</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Zgjidhni një qark për të hapur listën përkatëse dhe verifikimin e mandateve.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span className="inline-block w-3 h-3 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-400" />
          <span>I Zgjedhur</span>
          <span className="inline-block w-3 h-3 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
          <span>Aktiv</span>
        </div>
      </div>

      <div className="w-full flex justify-center py-2 overflow-x-auto">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="region"
          aria-label="Harta skematike e qarqeve parlamentare"
          className="max-w-full h-auto"
        >
          {districts.map((d, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const x = gap + col * (cellW + gap);
            const y = gap + row * (cellH + gap);
            const isActive = d.district === activeDistrict;
            const status = statusMap[d.district];
            const linked = status?.linkedProfiles ?? d.mandates;

            return (
              <g
                key={d.district}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer transition-all duration-150 focus:outline-none"
                onClick={() => onSelectDistrict(d.district)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectDistrict(d.district);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                aria-label={`Qarku ${d.district}, ${d.mandates} mandate`}
              >
                <rect
                  width={cellW}
                  height={cellH}
                  rx={8}
                  ry={8}
                  fill={isActive ? "#eff6ff" : "#f8fafc"}
                  stroke={isActive ? "#2563eb" : "#cbd5e1"}
                  strokeWidth={isActive ? 2.5 : 1}
                  className="dark:fill-slate-800 dark:stroke-slate-700 hover:stroke-blue-400 transition-colors"
                />
                <text
                  x={cellW / 2}
                  y={24}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight={700}
                  className={isActive ? "fill-blue-600 dark:fill-blue-400" : "fill-slate-800 dark:fill-slate-100"}
                >
                  {d.district}
                </text>
                <text
                  x={cellW / 2}
                  y={42}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={600}
                  fill="#64748b"
                >
                  {d.mandates} Mandate
                </text>
                <text
                  x={cellW / 2}
                  y={58}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight={500}
                  fill="#0284c7"
                >
                  {linked}/{d.mandates} Verifikuar
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------
   DISTRICT ANALYTICS SIDEBAR (FACTUAL RECONCILIATION)
---------------------------------------------------------- */
const DistrictAnalyticsSidebar: React.FC<{
  districts: ParliamentDistrict[];
  activeDistrict: string | null;
  onSelectDistrict: (name: string) => void;
  statusMap: Record<string, DistrictStatus>;
  totalExpectedSeats: number;
  totalLinkedSeats: number;
}> = ({
  districts,
  activeDistrict,
  onSelectDistrict,
  statusMap,
  totalExpectedSeats,
  totalLinkedSeats,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
          <span>ANALITIKA E QARQEVE</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
            KQZ 2025
          </span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Përmbledhje institucionale e 12 qarqeve sipas Vendimit Përfundimtar të KQZ-së.
        </p>
      </div>

      {/* Institutional totals card */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Totali Kushtetues:</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            {totalExpectedSeats} Mandate
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Profile të Lidhura:</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
            {totalLinkedSeats}/{totalExpectedSeats}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400">Statusi PARAGON®:</span>
          <span className="text-amber-600 dark:text-amber-400 font-semibold text-[11px] flex items-center gap-1">
            <Clock className="w-3 h-3" /> Audit në proces
          </span>
        </div>
      </div>

      {/* Districts List */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Qarqet ({districts.length})
        </span>
        <ul className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
          {districts.map((d) => {
            const isActive = d.district === activeDistrict;
            const status = statusMap[d.district];
            const linked = status?.linkedProfiles ?? d.mandates;

            return (
              <li key={d.district}>
                <button
                  onClick={() => onSelectDistrict(d.district)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs font-semibold"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70"
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="truncate flex items-center gap-1.5">
                    <span>{d.district}</span>
                  </span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className={isActive ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}>
                      {d.mandates} mand.
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------
   CANONICAL IDENTITY HELPER
---------------------------------------------------------- */
export function indexCardsByPoliticianId(
  cards: (VipProfile | any)[]
): Map<number, VipProfile> {
  const map = new Map<number, VipProfile>();
  for (const card of cards) {
    if (!card) continue;
    const polId = typeof card.politicianId === 'number' 
      ? card.politicianId 
      : (typeof card.numericId === 'number' ? card.numericId : undefined);
    if (typeof polId === 'number' && !isNaN(polId)) {
      map.set(polId, card);
    }
  }
  return map;
}

/* ----------------------------------------------------------
   MAIN COMPONENT: Parliament2025Page
---------------------------------------------------------- */
export const Parliament2025Page: React.FC<{
  data?: ParliamentDistrict[];
  profiles?: VipProfile[];
  onBack?: () => void;
  onNavigateToProfilePage: (profile: VipProfile) => void;
}> = ({ data: initialData, profiles: propProfiles = [], onBack, onNavigateToProfilePage }) => {
  const [districts, setDistricts] = useState<ParliamentDistrict[]>([]);
  const [cards, setCards] = useState<VipProfile[]>([]);
  const [comparisonList, setComparisonList] = useState<(string | number)[]>([]);
  const [openDistrict, setOpenDistrict] = useState<string | null>("Tiranë");
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [viewTab, setViewTab] = useState<ViewTab>("qarqet");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load live parliamentary data & politician cards from API
  const loadParliamentData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both live roster and live politician cards concurrently
      const [rosterRes, cardsRes] = await Promise.all([
        fetchParliamentRoster().catch((e) => {
          console.warn("Roster fetch fallback:", e);
          return null;
        }),
        fetchPoliticianCards().catch((e) => {
          console.warn("Politician cards fetch fallback:", e);
          return [];
        }),
      ]);

      // Resolve districts structure
      let resolvedDistricts: ParliamentDistrict[] = [];
      if (rosterRes && Array.isArray(rosterRes.districts) && rosterRes.districts.length === 12) {
        resolvedDistricts = rosterRes.districts;
      } else if (rosterRes && Array.isArray(rosterRes.data) && rosterRes.data.length === 12) {
        resolvedDistricts = rosterRes.data;
      } else if (initialData && initialData.length > 0) {
        resolvedDistricts = initialData;
      }

      const allProfiles: VipProfile[] = [...cardsRes, ...propProfiles];
      setCards(allProfiles);
      setDistricts(resolvedDistricts);
      if (resolvedDistricts.length > 0 && !openDistrict) {
        setOpenDistrict(resolvedDistricts[0].district);
      }
    } catch (err: any) {
      console.error("Critical error loading parliament data:", err);
      setError("Të dhënat parlamentare nuk mund të ngarkohen.");
    } finally {
      setLoading(false);
    }
  }, [initialData, propProfiles, openDistrict]);

  useEffect(() => {
    loadParliamentData();
  }, [loadParliamentData]);

  // Canonical cards index by politicianId (public.politicians.id)
  const cardsByPoliticianId = useMemo(
    () => indexCardsByPoliticianId(cards),
    [cards]
  );

  // Resolve an MP member strictly by canonical politicianId (No fuzzy/name matching)
  const resolvePoliticianRecord = useCallback(
    (member: any): VipProfile | null => {
      if (!member) return null;
      const polId = typeof member.politicianId === 'number'
        ? member.politicianId
        : (typeof member.numericId === 'number' ? member.numericId : undefined);
      if (typeof polId === 'number') {
        const card = cardsByPoliticianId.get(polId);
        if (card) return card;
      }
      return null;
    },
    [cardsByPoliticianId]
  );

  // Build factual district verification statuses
  const districtStatuses = useMemo(() => {
    const map: Record<string, DistrictStatus> = {};

    districts.forEach((d) => {
      let linked = 0;
      let withPhotos = 0;
      const partyCount: Record<string, number> = {};

      d.parties.forEach((p) => {
        partyCount[p.partyName] = p.mandatesWon;
        p.members.forEach((m) => {
          const profile = resolvePoliticianRecord(m);
          if (profile) {
            linked++;
            if (profile.imageUrl && !profile.imageUrl.includes("placeholder-pending")) {
              withPhotos++;
            }
          }
        });
      });

      map[d.district] = {
        district: d.district,
        mandates: d.mandates,
        linkedProfiles: linked,
        verifiedMandates: linked,
        profilesWithPhotos: withPhotos,
        paragonAuditComplete: 0, // In audit status
        partyComposition: Object.entries(partyCount).map(([party, count]) => ({ party, count })),
      };
    });

    return map;
  }, [districts, resolvePoliticianRecord]);

  // Overall totals
  const totalExpectedSeats = useMemo(() => {
    return districts.reduce((sum, d) => sum + d.mandates, 0) || 140;
  }, [districts]);

  const totalLinkedSeats = useMemo(() => {
    return Object.values(districtStatuses).reduce((sum, s) => sum + s.linkedProfiles, 0);
  }, [districtStatuses]);

  // Toggle comparison
  const handleCompareToggle = (id: string | number) => {
    setComparisonList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length < MAX_COMPARE_ITEMS) {
        return [...prev, id];
      }
      return prev;
    });
  };

  // Compare profiles resolution
  const comparisonProfiles = useMemo(() => {
    return comparisonList
      .map((id) => {
        if (typeof id === 'number') return cardsByPoliticianId.get(id);
        const num = parseInt(String(id).replace(/\D+/g, ''), 10);
        if (!isNaN(num)) return cardsByPoliticianId.get(num);
        return cards.find((c) => c.id === id);
      })
      .filter(Boolean) as VipProfile[];
  }, [comparisonList, cardsByPoliticianId, cards]);

  // Flat list of all MPs for National Roster view
  const allMpsList = useMemo(() => {
    const list: { district: string; party: string; member: any; profile: VipProfile | null }[] = [];
    districts.forEach((d) => {
      d.parties.forEach((p) => {
        p.members.forEach((m) => {
          list.push({
            district: d.district,
            party: p.partyName,
            member: m,
            profile: resolvePoliticianRecord(m),
          });
        });
      });
    });
    return list;
  }, [districts, resolvePoliticianRecord]);

  if (loading && districts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent mb-4" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Duke ngarkuar përbërjen zyrtare të Kuvendit...
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Sinkronizim me Regjistrin Përfundimtar të KQZ-së dhe bazën e të dhënave të mandateve.
        </p>
      </div>
    );
  }

  if (error && districts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-rose-600 mb-3" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          {error}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Ju lutemi kontrolloni lidhjen me serverin e API ose provoni sërish.
        </p>
        <button
          onClick={loadParliamentData}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Provo Përsëri
        </button>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl font-sans">
      {/* ========================================================
          1. HEADER & INSTITUTIONAL TITLE
          ======================================================== */}
      <header className="mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 uppercase tracking-wider transition-colors"
          >
            &larr; Kthehu te Faqja Kryesore
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-widest bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">
                KQZ 2025 · 140 MANDATE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-widest bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 uppercase">
                Legjislatura X
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Përbërja e Parlamentit 2025
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Lista zyrtare e 140 deputetëve të certifikuar në Kuvendin e Shqipërisë, ndarë sipas 12 qarqeve,
              grupeve parlamentare dhe statusit institucional.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Lidhja e Mandateve:
            </span>
            <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
              {totalLinkedSeats}/{totalExpectedSeats}
            </span>
          </div>
        </div>

        {/* ========================================================
            2. INSTITUTIONAL AUDIT SUSPENSION BANNER
            ======================================================== */}
        <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-xs flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
            <div className="font-extrabold text-sm text-amber-800 dark:text-amber-300 uppercase tracking-wide mb-0.5">
              PARAGON® — AUDITIMI I BURIMEVE NË PROCES
            </div>
            <p>
              Vlerësimet PARAGON® janë përkohësisht të pezulluara për verifikimin e burimeve dhe integritetit të të dhënave.
              Të gjithë deputetët paraqiten me mandate kushtetuese të verifikuara pa pikëzim artificial apo mesatare të sajuara.
            </p>
          </div>
        </div>

        {/* ========================================================
            3. FUNCTIONAL VIEW MODES TABS
            ======================================================== */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3" role="tablist">
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              role="tab"
              aria-selected={viewTab === "qarqet"}
              onClick={() => setViewTab("qarqet")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewTab === "qarqet"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Qarqet
            </button>

            <button
              role="tab"
              aria-selected={viewTab === "harta"}
              onClick={() => setViewTab("harta")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewTab === "harta"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Harta Interaktive
            </button>

            <button
              role="tab"
              aria-selected={viewTab === "roster"}
              onClick={() => setViewTab("roster")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewTab === "roster"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Roster Kombëtar ({totalLinkedSeats})
            </button>

            <button
              role="tab"
              aria-selected={viewTab === "krahasuesi"}
              onClick={() => setViewTab("krahasuesi")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewTab === "krahasuesi"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Krahasuesi</span>
              {comparisonList.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-600 text-white font-mono">
                  {comparisonList.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick status pill */}
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>Bazuar në KQZ & Kuvendi i Shqipërisë</span>
          </div>
        </div>
      </header>

      {/* ========================================================
          4. TAB CONTENT
          ======================================================== */}
      {/* TAB A & B: QARQET & HARTA (Shared Accordion + Sidebar) */}
      {(viewTab === "qarqet" || viewTab === "harta") && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* LEFT 3 COLS: Map (if selected) + District Accordions */}
          <div className="lg:col-span-3 space-y-4">
            {viewTab === "harta" && (
              <div className="mb-6">
                <SchematicDistrictMap
                  districts={districts}
                  activeDistrict={openDistrict}
                  onSelectDistrict={(name) => {
                    setOpenDistrict(name);
                    const el = document.getElementById(`district-accordion-${name}`);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  statusMap={districtStatuses}
                />
              </div>
            )}

            {/* Accordion list */}
            {districts.map((d) => {
              const isOpen = openDistrict === d.district;
              const status = districtStatuses[d.district];
              const linkedCount = status?.linkedProfiles ?? d.mandates;

              return (
                <div
                  key={d.district}
                  id={`district-accordion-${d.district}`}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 transition-all shadow-xs"
                >
                  <h2>
                    <button
                      onClick={() => setOpenDistrict(isOpen ? null : d.district)}
                      className={`w-full flex justify-between items-center p-4 px-6 text-left transition-colors ${
                        isOpen
                          ? "bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                      aria-expanded={isOpen}
                      aria-controls={`district-panel-${d.district}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                          {d.district.toUpperCase()}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono">
                          {d.mandates} Mandate
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                          Verifikuar: {linkedCount}/{d.mandates}
                        </span>
                        <ChevronDownIcon
                          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>
                  </h2>

                  {isOpen && (
                    <div id={`district-panel-${d.district}`} className="p-6">
                      {/* District factual status strip (No synthetic avgScore) */}
                      <DistrictVerificationStrip
                        district={d.district}
                        mandates={d.mandates}
                        linkedCount={linkedCount}
                        parties={d.parties}
                      />

                      {/* Party groups in district */}
                      <div className="space-y-6 mt-4">
                        {d.parties.map((party) => (
                          <div key={party.partyName} className="space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                                <span>{party.partyName}</span>
                              </h4>
                              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                                {party.mandatesWon} {party.mandatesWon === 1 ? "Mandat" : "Mandate"}
                              </span>
                            </div>

                            {/* MP Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {party.members.map((member, idx) => {
                                const profile = resolvePoliticianRecord(member);

                                if (!profile) {
                                  return (
                                    <div
                                      key={member.name || idx}
                                      className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 text-xs space-y-1"
                                    >
                                      <div className="font-bold text-slate-800 dark:text-slate-200">
                                        {member.name}
                                      </div>
                                      <div className="text-rose-600 dark:text-rose-400 font-semibold">
                                        GABIM I LIDHJES SË PROFILIT
                                      </div>
                                      <p className="text-[11px] text-slate-500">
                                        Kërkohet sinkronizim i personit në bazën e të dhënave të Kuvendit.
                                      </p>
                                    </div>
                                  );
                                }

                                const targetId = profile.numericId || profile.id;
                                const isSelected = comparisonList.includes(targetId);

                                return (
                                  <div key={targetId} className="relative group">
                                    <PoliticianGridCard
                                      profile={profile}
                                      index={idx}
                                      onClick={() => onNavigateToProfilePage(profile)}
                                    />
                                    {/* Compare toggle button overlay */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCompareToggle(targetId);
                                      }}
                                      className={`absolute top-2 right-12 z-20 px-2 py-0.5 rounded text-[9.5px] font-bold shadow-xs transition-colors ${
                                        isSelected
                                          ? "bg-blue-600 text-white"
                                          : "bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700"
                                      }`}
                                      title={isSelected ? "Hiq nga krahasimi" : "Shto në krahasim"}
                                    >
                                      {isSelected ? "Zgjedhur" : "+ Krahaso"}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT COL: District Analytics Sidebar */}
          <div className="lg:col-span-1 space-y-4 sticky top-6">
            <DistrictAnalyticsSidebar
              districts={districts}
              activeDistrict={openDistrict}
              onSelectDistrict={(name) => {
                setOpenDistrict(name);
                const el = document.getElementById(`district-accordion-${name}`);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              statusMap={districtStatuses}
              totalExpectedSeats={totalExpectedSeats}
              totalLinkedSeats={totalLinkedSeats}
            />
          </div>
        </div>
      )}

      {/* TAB C: NATIONAL ROSTER (Full 140 MPs Searchable Table) */}
      {viewTab === "roster" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Roster Kombëtar i 140 Deputetëve të Certifikuar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Regjistri i plotë alfabetik dhe sipas mandateve për të gjithë anëtarët e Kuvendit 2025.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full">
              {allMpsList.length}/140 Deputetë
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allMpsList.map((item, idx) => {
              const { profile, member } = item;
              if (!profile) return null;
              const targetId = profile.numericId || profile.id;
              const isSelected = comparisonList.includes(targetId);

              return (
                <div key={targetId || idx} className="relative">
                  <PoliticianGridCard
                    profile={profile}
                    index={idx}
                    onClick={() => onNavigateToProfilePage(profile)}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompareToggle(targetId);
                    }}
                    className={`absolute top-2 right-12 z-20 px-2 py-0.5 rounded text-[9.5px] font-bold shadow-xs transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {isSelected ? "Zgjedhur" : "+ Krahaso"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB D: KRAHASUESI (Direct Comparison View) */}
      {viewTab === "krahasuesi" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Paneli i Krahasimit të Deputetëve
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Zgjidhni deri në 3 figura politike nga listat e qarqeve për krahasim të drejtpërdrejtë.
              </p>
            </div>
            {comparisonList.length >= 2 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Hap Dritaren e Krahasimit të Plotë
              </button>
            )}
          </div>

          {comparisonProfiles.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <UsersIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Nuk keni zgjedhur asnjë deputet për krahasim.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Kliko mbi butonin <strong>"+ Krahaso"</strong> në kartat e deputetëve për t'i shtuar këtu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {comparisonProfiles.map((p) => (
                <div key={p.id} className="relative">
                  <PoliticianGridCard profile={p} onClick={() => onNavigateToProfilePage(p)} />
                  <button
                    onClick={() => handleCompareToggle(p.numericId || p.id)}
                    className="mt-2 w-full py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition border border-rose-200 dark:border-rose-900"
                  >
                    Hiq nga krahasimi
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          5. FLOATING COMPARISON ACTION BAR
          ======================================================== */}
      {comparisonList.length >= 2 && (
        <div className="fixed bottom-6 right-6 z-40 animate-fadeIn">
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
            aria-label="Krahaso deputetët e përzgjedhur"
          >
            <UsersIcon className="w-4 h-4" />
            <span>Krahaso ({comparisonList.length}/3)</span>
          </button>
        </div>
      )}

      {/* ========================================================
          6. COMPARISON MODAL
          ======================================================== */}
      {isCompareModalOpen && (
        <PoliticianComparisonModal
          profiles={comparisonProfiles}
          onClose={() => setIsCompareModalOpen(false)}
          onNavigateToProfilePage={(p) => {
            setIsCompareModalOpen(false);
            onNavigateToProfilePage(p);
          }}
        />
      )}
    </main>
  );
};
