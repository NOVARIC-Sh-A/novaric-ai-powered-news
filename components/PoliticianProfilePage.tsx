// components/PoliticianProfilePage.tsx
import React, { useEffect, useState } from "react";
import { fetchProfileById } from "../services/apiService";
import { VipProfile, RelatedLink } from "../types";
import { LoadingSpinner } from "./LoadingSpinner";
import { 
  DocumentTextIcon, 
  DownloadIcon, 
  GlobeAltIcon, 
  ArrowPathIcon 
} from './icons';
import { PoliticianCard } from './figurat-politike/PoliticianCard';

interface Props {
  id?: string;
  profile?: VipProfile;
  analysis?: any;
  onBack?: () => void;
}

const MediaReferenceCard: React.FC<{ link: RelatedLink }> = ({ link }) => (
  <a 
    href={link.url} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors group"
  >
    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
      <GlobeAltIcon className="w-5 h-5" />
    </div>
    <div className="flex-grow min-w-0">
      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-primary-600 transition-colors truncate">{link.title}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{link.source}</p>
    </div>
    <ArrowPathIcon className="w-4 h-4 text-slate-300 group-hover:text-primary-500 flex-shrink-0" />
  </a>
);

export const PoliticianProfilePage: React.FC<Props> = (props) => {
  const { id, onBack } = props;
  const [profile, setProfile] = useState<VipProfile | null>(props.profile || null);
  const [loading, setLoading] = useState<boolean>(!props.profile);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (props.profile) {
      setProfile(props.profile);
      setLoading(false);
      setError(null);
      return;
    }
    if (!id) return;

    let alive = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const profileData = await fetchProfileById(id);
        if (alive) setProfile(profileData);
      } catch (err: any) {
        console.error("Error loading profile:", err);
        if (alive) setError(err instanceof Error ? err.message : "Nuk u mundësua ngarkimi i profilit.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [id, props.profile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner retryMessage="Duke sinkronizuar të dhënat e politikanit..." />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-4">
        <h2 className="text-2xl font-semibold text-rose-600 mb-3 uppercase tracking-tighter">Sinkronizimi dështoi</h2>
        <p className="text-slate-500 mb-4">{error || "Nuk u gjetën të dhënat e profilit."}</p>
        <button onClick={onBack} className="px-6 py-2 bg-primary-600 text-white rounded-lg font-bold uppercase tracking-widest text-xs">Kthehu Pas</button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen font-sans pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        {/* Authoritative Politician Card */}
        <PoliticianCard profile={profile} onBack={onBack} />

        {/* Supplementary Documents & Media References */}
        {((profile.documents && profile.documents.length > 0) || (profile.relatedLinks && profile.relatedLinks.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {profile.documents && profile.documents.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Dokumente Zyrtare</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Audit</span>
                </div>
                <div className="space-y-3">
                  {profile.documents.map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                        <DocumentTextIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">{doc.title}</h4>
                        <div className="flex gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>{doc.date}</span>
                          <span>·</span>
                          <span>{doc.type}</span>
                        </div>
                      </div>
                      <button onClick={() => window.open(doc.url)} className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-primary-600 hover:scale-105 transition-transform" title="Shkarko">
                        <DownloadIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {profile.relatedLinks && profile.relatedLinks.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Referenca Mediatike</h3>
                <div className="space-y-3">
                  {profile.relatedLinks.map((link, i) => (
                    <MediaReferenceCard key={i} link={link} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliticianProfilePage;
