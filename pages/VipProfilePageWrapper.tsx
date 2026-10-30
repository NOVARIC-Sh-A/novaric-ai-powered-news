// pages/VipProfilePageWrapper.tsx
import React, { useEffect, useMemo, useState } from "react";
import { VipProfilePage, PresenterAnalysisPage, PoliticianProfilePage } from "../components";
import { VipProfile, FullProfileAnalysis, TvShowData } from "../types";
import { runAnalysisForVip } from "../services/paragonEngine";
import { fetchPoliticianProfile } from "../services/apiService";

interface VipProfilePageWrapperProps {
  profile: VipProfile | FullProfileAnalysis | string;
  id?: string | number;
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
  tvShows: TvShowData[];
  onNavigateToZodiacInfoPage: () => void;
  onNavigateToMaragonReport?: (
    entityId: string | number,
    entityType: "individual" | "tvShow"
  ) => void;
}

export const VipProfilePageWrapper: React.FC<VipProfilePageWrapperProps> = (props) => {
  const {
    profile,
    id: propId,
    onBack,
    onNavigate,
    tvShows,
    onNavigateToZodiacInfoPage,
    onNavigateToMaragonReport,
  } = props;

  const [detail, setDetail] = useState<VipProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Determine the primary ID to fetch from. 
  // Priority: Passed Object ID > Passed String ID > propId (from URL)
  const activeId = useMemo(() => {
    if (profile && typeof profile === 'object') {
      if ("id" in (profile as object)) return (profile as any).id;
      if ("profileInput" in (profile as object)) return (profile as FullProfileAnalysis).profileInput.personal.fullName;
    }
    if (typeof profile === 'string' && profile) return profile;
    if (propId) return propId;
    return null;
  }, [propId, profile]);

  useEffect(() => {
    if (!activeId) {
        setLoading(false);
        return;
    }

    let alive = true;
    setLoading(true);

    fetchPoliticianProfile(activeId)
      .then((data) => {
        if (alive) setDetail(data);
      })
      .catch((e) => {
        console.warn("Aggregation fetch failed, using fallback/prop data.", e);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => { alive = false; };
  }, [activeId]);

  // Safe object detection for 'in' operator
  const isProfileObject = profile && typeof profile === 'object';
  const vipProfile = detail || (isProfileObject && "id" in (profile as object) ? (profile as VipProfile) : null);

  // Logic to determine if this is a politician
  const isPolitician = useMemo(() => {
    if (isProfileObject && "profileInput" in (profile as object)) {
        return true;
    }
    if (!vipProfile) {
        return false;
    }
    const c = (vipProfile.category ?? "").toLowerCase();
    const isParty = ["ps", "pd", "pl", "psd"].some(p => c.includes(p));
    return c.includes("polit") || isParty;
  }, [vipProfile, profile, isProfileObject]);

  if (loading && !detail && typeof profile === 'string') {
    return (
      <div className="container mx-auto p-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">Duke sinkronizuar të dhënat e profilit...</p>
      </div>
    );
  }

  // Strictly route all politicians to PoliticianProfilePage (Authoritative Layout)
  if (isPolitician) {
    const analysis = isProfileObject && "profileInput" in (profile as object)
        ? (profile as FullProfileAnalysis) 
        : (vipProfile ? runAnalysisForVip(vipProfile) : undefined);

    return (
      <PoliticianProfilePage
        id={activeId?.toString()}
        profile={vipProfile || undefined}
        analysis={analysis}
        onBack={onBack}
      />
    );
  }

  // Presenters: specialized page
  if (vipProfile && (vipProfile as any).journalisticConduct) {
    return <PresenterAnalysisPage presenter={vipProfile} onBack={onBack} />;
  }

  // Default VIP page
  if (vipProfile) {
    return (
      <VipProfilePage
        profile={vipProfile}
        onBack={onBack}
        onNavigateToTvShow={(tvShow) => onNavigate("tvShowPage", tvShow)}
        tvShows={tvShows}
        onNavigateToZodiacInfoPage={onNavigateToZodiacInfoPage}
        onNavigateToMaragonReport={onNavigateToMaragonReport}
      />
    );
  }

  return (
    <div className="container mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold text-rose-600">Gabim</h2>
      <p className="text-slate-600 dark:text-slate-300">Të dhënat e profilit nuk u gjetën.</p>
      <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded shadow hover:bg-primary-700 transition-colors">Kthehu Pas</button>
    </div>
  );
};
