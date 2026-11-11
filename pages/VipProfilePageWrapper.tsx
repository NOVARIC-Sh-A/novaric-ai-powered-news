// pages/VipProfilePageWrapper.tsx
import React, { useEffect, useMemo, useState } from "react";
import { VipProfilePage, PresenterAnalysisPage, PoliticianProfilePage } from "../components";
import { VipProfile, FullProfileAnalysis, TvShowData } from "../types";
import { runAnalysisForVip } from "../services/paragonEngine";
import { fetchPoliticianProfile } from "../services/apiService";
import { canonicalPoliticianKey, profileViewState } from "../utils/politicianNavigation";
import { isMediaIdentity, isMediaProfile } from "../utils/maragonPublication";
import { mediaProfilesData } from "../data/mediaProfiles";

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

  // A numeric id from the list (`2`) and a profile id (`vip2`) are the same person.
  const activeId = useMemo(() => {
    if (profile && typeof profile === 'object') {
      if ("id" in (profile as object) && (profile as VipProfile).id) {
        return canonicalPoliticianKey((profile as VipProfile).id) || (profile as VipProfile).id;
      }
      if ("profileInput" in (profile as object)) return (profile as FullProfileAnalysis).profileInput.personal.fullName;
    }
    if (typeof profile === 'string' && profile) return canonicalPoliticianKey(profile) || profile;
    if (propId != null && String(propId) !== '') return canonicalPoliticianKey(propId) || propId;
    return null;
  }, [propId, profile]);

  useEffect(() => {
    if (!activeId) {
        setLoading(false);
        return;
    }

    let alive = true;
    setLoading(true);
    setDetail(null);

    const passedProfile = isProfileObject && "id" in (profile as object) ? (profile as VipProfile) : null;
    if (isMediaIdentity(activeId) || isMediaProfile(passedProfile)) {
      const local = mediaProfilesData.find((entry) =>
        String(entry.id) === String(activeId) || (passedProfile && String(entry.id) === String(passedProfile.id))
      );
      const merged = local && passedProfile
        ? {
            ...local,
            ...passedProfile,
            maragonAssessmentStatus: passedProfile.maragonAssessmentStatus ?? local.maragonAssessmentStatus,
            scoringSuspended: passedProfile.scoringSuspended ?? local.scoringSuspended,
          }
        : (passedProfile || local || null);
      if (alive) {
        setDetail(merged);
        setLoading(false);
      }
      return () => { alive = false; };
    }

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

  const namedProfile = detail
    || (isProfileObject && (profile as VipProfile).name ? (profile as VipProfile) : null);
  const view = profileViewState({ loading, profile: namedProfile });

  if (view === 'loading') {
    return (
      <div className="container mx-auto p-20 text-center" data-profile-status="loading">
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
        onBack={isMediaProfile(vipProfile) ? () => onNavigate('mediaPersonalitiesPage') : onBack}
        onNavigateToTvShow={(tvShow) => onNavigate("tvShowPage", tvShow)}
        tvShows={tvShows}
        onNavigateToZodiacInfoPage={onNavigateToZodiacInfoPage}
        onNavigateToMaragonReport={onNavigateToMaragonReport}
      />
    );
  }

  return (
    <div className="container mx-auto p-8 text-center" data-profile-status="missing">
      <h2 className="text-2xl font-bold text-rose-600">Gabim</h2>
      <p className="text-slate-600 dark:text-slate-300">Të dhënat e profilit nuk u gjetën.</p>
      <button
        type="button"
        onClick={() => onNavigate('politiciansPage')}
        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded shadow hover:bg-primary-700 transition-colors"
      >
        Kthehu Pas
      </button>
    </div>
  );
};
