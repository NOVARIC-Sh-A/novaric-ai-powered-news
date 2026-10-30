
import React, { useState } from 'react';
import { PencilSquareIcon, ShieldCheckIcon, SearchIcon, GlobeEuropeAfricaIcon, ExclamationTriangleIcon } from './icons';
import { renderWithSuperscript } from '../utils/textUtils';
import { DesignSearchResult, DesignSearchResultItem } from '../types';
import { getApiEndpoint } from '../services/apiConfig';
import { PressRegistrationSection } from './PressRegistrationSection';
import { ShieldCheck, Award, FileText } from 'lucide-react';

interface TrademarkCertificatePageProps {
  onBack: () => void;
}

const InfoRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
    <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100 sm:mt-0 sm:col-span-2">{children}</dd>
  </div>
);

const SearchResultCard: React.FC<{ item: DesignSearchResultItem }> = ({ item }) => {
    const euipoLink = `https://euipo.europa.eu/eSearch/#details/designs/${item.designNumber}`;
    const applicantName = item.applicants && item.applicants.length > 0 ? item.applicants[0].name : 'N/A';
    return (
        <a 
            href={euipoLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg shadow-md hover:bg-slate-100 dark:hover:bg-slate-600/50 hover:shadow-lg transition-all"
        >
            <h4 className="font-semibold text-primary-600 dark:text-primary-400">{item.verbalElement || item.designNumber}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Aplikanti:</strong> {applicantName}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Statusi:</strong> {item.status}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1"><strong>Data e Aplikimit:</strong> {item.applicationDate}</p>
        </a>
    );
};

export const TrademarkCertificatePage: React.FC<TrademarkCertificatePageProps> = ({ onBack }) => {
  const certificateUrl = "https://novaric.co/wp-content/uploads/2025/11/NOVARICCertificate.jpg";
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DesignSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) {
          setSearchError("Ju lutemi shkruani një term kërkimi.");
          return;
      }
      setIsSearching(true);
      setSearchError(null);
      setSearchResults(null);

      try {
          const endpoint = getApiEndpoint(`/design-search?query=${encodeURIComponent(searchQuery)}`);
          const response = await fetch(endpoint);
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || `Kërkimi dështoi me statusin ${response.status}`);
          }
          const data: DesignSearchResult = await response.json();
          setSearchResults(data);
      } catch (error) {
          console.error("Search error:", error);
          setSearchError(error instanceof Error ? error.message : "Ndodhi një gabim i panjohur.");
      } finally {
          setIsSearching(false);
      }
  };


  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-2xl shadow-xl text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700/60">
        
        {/* PAGE TOP HEADER */}
        <header className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dokumentacion Ligjor & Institucional</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Bashkimi Evropian</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Regjistrimet Ligjore & Certifikatat Zyrtare
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Regjistrimi zyrtar i medias në Bashkimin Evropian (Office of the Press Registrar, Malta) dhe e drejta e mbrojtur e markës tregtare {renderWithSuperscript('NOVARIC®')} pranë Zyrës së Pronësisë Intelektuale të Bashkimit Evropian (EUIPO).
          </p>

          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs font-mono">
            <a 
              href="#media-registration" 
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md font-semibold transition"
            >
              &darr; Regjistrimi i Medias (OPM PRESS 03/2025)
            </a>
            <a 
              href="#trademark-info" 
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md font-semibold transition"
            >
              &darr; Marka Tregtare (EUIPO 018313401)
            </a>
            <a 
              href="#euipo-search" 
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-md font-semibold transition"
            >
              &darr; Kërko në EUIPO
            </a>
          </div>
        </header>

        {/* SECTION 1: PRESS REGISTRATION (MALTA OPM) */}
        <div id="media-registration">
          <PressRegistrationSection />
        </div>
        
        {/* SECTION 2: TRADEMARK INFORMATION (EUIPO) */}
        <div id="trademark-info" className="mt-14 pt-8 border-t-2 border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
              EUIPO // EUTM
            </span>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Informacion mbi Markën Tregtare {renderWithSuperscript('NOVARIC®')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12 bg-slate-50/50 dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <div>
                <dl className="divide-y divide-slate-200 dark:divide-slate-700">
                  <InfoRow label="Emri">{renderWithSuperscript('NOVARIC®')}</InfoRow>
                  <InfoRow label="Numri i Aplikimit">018313401</InfoRow>
                  <InfoRow label="Baza">EUTM</InfoRow>
                  <InfoRow label="Data e Marrjes">25/09/2020</InfoRow>
                  <InfoRow label="Lloji">Figurative</InfoRow>
                  <InfoRow label="Natyra">Individuale</InfoRow>
                  <InfoRow label="Klasat Nice">
                    <a href="https://euipo.europa.eu/ec2/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">35 (Klasifikimi Nice)</a>
                  </InfoRow>
                  <InfoRow label="Klasifikimi i Vjenës">
                     <a href="https://www.wipo.int/classifications/vienna/en/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-words">26.05.01, 26.05.22, 29.01.04</a>
                  </InfoRow>
                </dl>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4 md:border-none md:mt-0 md:pt-0">
                <dl className="divide-y divide-slate-200 dark:divide-slate-700">
                  <InfoRow label="Data e Aplikimit">25/09/2020</InfoRow>
                  <InfoRow label="Data e Regjistrimit">13/01/2021</InfoRow>
                  <InfoRow label="Data e Skadimit">25/09/2030</InfoRow>
                  <InfoRow label="Data e Përcaktimit">—</InfoRow>
                  <InfoRow label="Gjuha e Aplikimit">Anglisht</InfoRow>
                  <InfoRow label="Gjuha e Dytë">Frëngjisht</InfoRow>
                  <InfoRow label="Referenca e Aplikimit">
                    <PencilSquareIcon className="w-5 h-5 text-blue-500" />
                  </InfoRow>
                  <InfoRow label="Statusi i Markës">
                    <div className="flex items-center font-bold text-green-600 dark:text-green-400">
                      <ShieldCheckIcon className="w-5 h-5 mr-1.5" />
                      <span>E Regjistruar</span>
                    </div>
                  </InfoRow>
                </dl>
              </div>
          </div>
        </div>

        {/* SECTION 3: SEARCH EUIPO DATABASE */}
        <section id="euipo-search" className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4 flex items-center justify-center">
                <GlobeEuropeAfricaIcon className="w-7 h-7 mr-3 text-primary-500" />
                Kërko në Databazën e Dizajneve të EUIPO
            </h2>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Kërko sipas emrit, numrit të aplikimit..."
                    className="flex-grow px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700"
                />
                <button
                    type="submit"
                    disabled={isSearching}
                    className="flex items-center justify-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-sm transition disabled:bg-slate-400"
                >
                    <SearchIcon className="w-5 h-5 mr-2" />
                    {isSearching ? 'Duke kërkuar...' : 'Kërko'}
                </button>
            </form>

            <div className="mt-6">
                {isSearching && <p className="text-center">Duke ngarkuar rezultatet...</p>}
                {searchError && (
                    <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-md flex items-center">
                        <ExclamationTriangleIcon className="w-5 h-5 mr-3"/>
                        <p>{searchError}</p>
                    </div>
                )}
                {searchResults && (
                    <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            U gjetën <strong>{searchResults.totalElements}</strong> rezultate. Po shfaqen deri në 10 të parat.
                        </p>
                        {searchResults.designs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {searchResults.designs.map(item => <SearchResultCard key={item.designNumber} item={item} />)}
                            </div>
                        ) : (
                            <p className="text-center text-slate-500">Nuk u gjet asnjë rezultat për kërkimin tuaj.</p>
                        )}
                    </div>
                )}
            </div>
        </section>

        {/* SECTION 4: OFFICIAL TRADEMARK CERTIFICATE IMAGE */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-4">
            Certifikata Zyrtare e Regjistrimit EUIPO
          </h2>
          <img 
            src={certificateUrl} 
            alt="Certifikata e Regjistrimit të Markës Tregtare NOVARIC®"
            className="w-full h-auto rounded-lg shadow-xl border border-slate-200 dark:border-slate-700"
          />
        </div>

        <div className="mt-12 text-center">
            <button
                onClick={onBack}
                className="inline-flex items-center px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition"
                aria-label="Kthehu Pas"
            >
                &larr; Kthehu Pas
            </button>
        </div>
      </div>
    </main>
  );
};
