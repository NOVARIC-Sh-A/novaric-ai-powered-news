import React, { useEffect, useState } from 'react';
import { fetchAllProfiles } from '../services/apiService';
import { VipProfile } from '../types';
import { PoliticianGridCard } from '../components/figurat-politike/PoliticianGridCard';

interface PoliticiansListPageProps {
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}

export const PoliticiansListPage: React.FC<PoliticiansListPageProps> = ({ onBack, onNavigate }) => {
  const [profiles, setProfiles] = useState<VipProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const liveProfiles = await fetchAllProfiles();

        if (!mounted) return;

        setProfiles(liveProfiles);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profiles:", err);

        if (!mounted) return;

        setError("Nuk mund të ngarkojmë profilët. Ju lutem provoni përsëri.");
        setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const handleNavigate = (profile: VipProfile) => {
    onNavigate('vipProfilePage', profile);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">{error}</h2>
        <div className="flex gap-4">
             <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors"
            >
              Provo përsëri
            </button>
            <button
                onClick={onBack}
                className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
            >
                Kthehu
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-slate-900 min-h-screen container mx-auto">
       <div className="mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md text-slate-800 dark:text-slate-200 transition-colors"
          >
            ← Kthehu Pas
          </button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100 text-center">
        Politikanët & Analiza PARAGON®
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {profiles.map(profile => (
          <PoliticianGridCard
            key={profile.id}
            profile={profile}
            onClick={() => handleNavigate(profile)}
          />
        ))}
      </div>

      {profiles.length === 0 && (
        <p className="text-center text-slate-500 dark:text-slate-400 mt-10">
          Nuk u gjet asnjë profil.
        </p>
      )}
    </div>
  );
};