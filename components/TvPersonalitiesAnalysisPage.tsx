import React, { useState, useMemo, useEffect } from 'react';
import { VipProfile, ParagonEntry } from '../types';
import { ChevronDownIcon } from './icons';
import { formatPersonName } from '../utils/formatPersonName';
import { useLanguage } from '../contexts/LanguageContext';
import {
  maragonScoresArePublic,
  notAssessedLabel,
  publishableMaragonAnalysis,
} from '../utils/maragonPublication';
import { MaragonAnalysisView } from './maragon/MaragonDossierView';
import { isMediaProfile } from '../utils/maragonPublication';
import { publishedBand } from '../utils/maragonBandsOnly';
import { MaragonBandChip } from './maragon/MaragonBandChip';

interface PerformanceAnalysisPageProps {
    onBack: () => void;
    profiles: VipProfile[];
    initialProfileId?: string | number;
    onProfileSelect: (page: 'tvPersonalitiesAnalysis', id: string | number) => void;
}

/** Bands only (v1.0 §10). Peer-average and "global standard" series are not shown. AM-10 lines belong on the presenter radar. */
const DimensionDetail: React.FC<{ category: ParagonEntry; unassessedLabel: string; gateOpen: boolean }> = ({ category, unassessedLabel, gateOpen }) => {
    const band = publishedBand(gateOpen, category.score);
    return (
        <div className="p-4 space-y-3 bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">{category.description || ''}</p>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                <p className="font-medium text-blue-800 dark:text-blue-200">Komenti i Analizës:</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">{category.commentary || unassessedLabel}</p>
            </div>
            <MaragonBandChip label="Vlerësimi / Assessment" band={band} />
        </div>
    );
};


const UnassessedNotice: React.FC<{ name?: string }> = ({ name }) => (
    <section className="mb-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-600 dark:bg-slate-900/40">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100">Pa vlerësim / Not assessed</h2>
        {name ? <p className="mt-2 text-sm text-slate-500">{name}</p> : null}
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300">
            Vlerësimi publikohet vetëm pas miratimit. Nuk ka numra në këtë pamje.
        </p>
        <p className="mx-auto max-w-xl text-sm text-slate-500">
            Assessment is published only after approval. This view has no numbers.
        </p>
    </section>
);

class AnalysisErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        if (this.state.failed) return <UnassessedNotice />;
        return this.props.children;
    }
}

export const TvPersonalitiesAnalysisPage: React.FC<PerformanceAnalysisPageProps> = (props) => (
    <AnalysisErrorBoundary>
        <TvPersonalitiesAnalysisBody {...props} />
    </AnalysisErrorBoundary>
);

const TvPersonalitiesAnalysisBody: React.FC<PerformanceAnalysisPageProps> = ({ onBack, profiles, initialProfileId, onProfileSelect }) => {
    const { language, toggleLanguage } = useLanguage();
    const unassessedLabel = notAssessedLabel(language);
    const safeProfiles = useMemo(
        () => (Array.isArray(profiles) ? profiles.filter((profile) => Boolean(profile && profile.id != null)) : []),
        [profiles],
    );
    const profilesWithAnalysis = useMemo(() => 
        safeProfiles.filter(p => {
            const category = (p.category || '').toLowerCase();
            return category.includes('media')
                || /^vip_m/i.test(String(p.id))
                || p.maragonAssessmentStatus != null
                || (p.maragonAnalysis && p.maragonAnalysis.length > 0);
        }).sort((a, b) => (a.name || '').localeCompare(b.name || '', 'sq')),
    [safeProfiles]);
    
    const [selectedId, setSelectedId] = useState(() => {
        if (initialProfileId && profilesWithAnalysis.some(p => p.id.toString() === initialProfileId.toString())) {
            return initialProfileId;
        }
        return profilesWithAnalysis[0]?.id || '';
    });

    useEffect(() => {
        if (initialProfileId && profilesWithAnalysis.some(p => p.id.toString() === initialProfileId.toString())) {
            setSelectedId(initialProfileId);
            return;
        }
        if (!selectedId && profilesWithAnalysis[0]) {
            setSelectedId(profilesWithAnalysis[0].id);
        }
    }, [initialProfileId, profilesWithAnalysis, selectedId]);


    const [openDimension, setOpenDimension] = useState<string | null>(null);

    const selectedAnalysis = useMemo(() => profilesWithAnalysis.find(p => p.id.toString() === selectedId.toString()), [selectedId, profilesWithAnalysis]);

    const toggleDimension = (dimension: string) => {
        setOpenDimension(openDimension === dimension ? null : dimension);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        setSelectedId(newId);
        if (onProfileSelect) {
            onProfileSelect('tvPersonalitiesAnalysis', newId);
        }
    };

    const assessmentPublished = maragonScoresArePublic(selectedAnalysis);
    // Retired seven-label mock rows (v1.0 §1.3, §3.6) are never read for display.
    const legacyRows = publishableMaragonAnalysis(selectedAnalysis);

    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800/80 p-6 sm:p-8 rounded-lg shadow-2xl">
                <div className="mb-4 flex justify-end">
                  <button type="button" onClick={toggleLanguage} className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold dark:border-slate-600">
                    <span className={language === 'sq' ? 'text-primary-600' : 'text-slate-400'}>AL</span>
                    <span className="mx-1 text-slate-300">|</span>
                    <span className={language === 'en' ? 'text-primary-600' : 'text-slate-400'}>EN</span>
                  </button>
                </div>
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-700 dark:text-primary-400 mb-2">
                        Analizë e Performancës së Figurave Mediatike
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Një vlerësim i bazuar në të dhëna sipas Kornizës Analitike <strong>MARAGON<sup>®</sup></strong>.
                    </p>
                </header>
                
                <section className="mb-8">
                     <label htmlFor="personality-select" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Zgjidhni një figurë publike</label>
                     <select
                        id="personality-select"
                        value={selectedId}
                        onChange={handleSelectChange}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-slate-700"
                      >
                        {profilesWithAnalysis.map(p => (
                            <option key={p.id} value={p.id}>
                                {formatPersonName(p.name)} ({p.category})
                            </option>
                        ))}
                      </select>
                </section>

                {selectedAnalysis && isMediaProfile(selectedAnalysis) && (
                  <MaragonAnalysisView profileId={selectedAnalysis.id} name={formatPersonName(selectedAnalysis.name)} />
                )}

                {assessmentPublished && selectedAnalysis && !isMediaProfile(selectedAnalysis) && legacyRows.length > 0 && (
                     <section className="mb-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl shadow-inner">
                        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-4">
                          {`Brezat MARAGON® për ${formatPersonName(selectedAnalysis.name)}`}
                        </h2>
                        <div className="max-w-xl mx-auto space-y-3">
                          {legacyRows.map(row => (
                            <MaragonBandChip key={row.dimension} label={row.dimension} band={publishedBand(assessmentPublished, row.score)} />
                          ))}
                        </div>
                    </section>
                )}

                {assessmentPublished && selectedAnalysis && !isMediaProfile(selectedAnalysis) && legacyRows.length > 0 && (
                    <section>
                         <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Vlerësim i Detajuar sipas Dimensioneve MARAGON®</h2>
                         <div className="space-y-4">
                            {legacyRows.map(category => (
                                <div key={category.dimension} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleDimension(category.dimension)}
                                        className="w-full flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600/50"
                                        aria-expanded={openDimension === category.dimension}
                                    >
                                        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 text-left">{category.dimension}</h3>
                                        <ChevronDownIcon className={`w-6 h-6 text-slate-500 dark:text-slate-400 transition-transform ${openDimension === category.dimension ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openDimension === category.dimension && (
                                        <DimensionDetail category={category} unassessedLabel={unassessedLabel} gateOpen={assessmentPublished} />
                                    )}
                                </div>
                            ))}
                         </div>
                    </section>
                )}
                
                {!selectedAnalysis && <UnassessedNotice />}
                {selectedAnalysis && !assessmentPublished && !isMediaProfile(selectedAnalysis) && (
                    <UnassessedNotice name={formatPersonName(selectedAnalysis.name)} />
                )}

                <div className="mt-12 text-center">
                    <button
                        onClick={onBack}
                        className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition"
                        aria-label="Kthehu te faqja kryesore"
                    >
                        &larr; Kthehu Pas
                    </button>
                </div>
            </div>
        </main>
    );
};