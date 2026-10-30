import React from 'react';
// FIX: Corrected import path for types.
import { TvShowData } from '../types';
import GaugeChart from './GaugeChart';
import { MegaphoneIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon, ChartBarIcon } from './icons';
// FIX: Corrected import path for types.
import { VipProfile } from '../types';
import { JsonLd } from './JsonLd';
import { formatVipName } from '../utils/paragonProfileUtils';
import { MaragonSummaryDisplay } from './MaragonSummaryDisplay';

interface TvShowPageProps {
  tvShow: TvShowData;
  profiles: VipProfile[];
  onBack: () => void;
  onNavigateToProfilePage: (profile: VipProfile) => void;
  onNavigateToMaragonReport?: (entityId: string | number, entityType: 'individual' | 'tvShow') => void;
}

export const TvShowPage: React.FC<TvShowPageProps> = ({ tvShow, profiles, onBack, onNavigateToProfilePage, onNavigateToMaragonReport }) => {
  if (!tvShow) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 text-center">
        <p className="text-xl text-slate-700 dark:text-slate-300">Emisioni nuk u gjet.</p>
        <button
          onClick={onBack}
          className="mt-6 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md"
        >
          Kthehu Pas
        </button>
      </main>
    );
  }

  const { name, channel, logoUrl, description, host, commonTopics, statistics, maragonSummary } = tvShow;
  
  const hostProfile = profiles.find(p => p.name.toLowerCase() === host.toLowerCase());

  const tvSeriesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    'name': name,
    'description': description,
    'image': logoUrl,
    'producer': {
        '@type': 'Organization',
        'name': channel
    },
    'actor': {
        '@type': 'Person',
        'name': host
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <JsonLd data={tvSeriesJsonLd} />
      <article className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <header className="mb-8 text-center border-b border-slate-200 dark:border-slate-700 pb-8">
          <img 
            src={logoUrl} 
            alt={`Logo për ${name}`} 
            className="w-48 h-auto mx-auto mb-4 object-contain bg-white p-2 rounded-lg mix-blend-multiply dark:mix-blend-screen"
          />
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-2">{name}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">{channel}</p>
          <p className="text-md text-slate-500 dark:text-slate-400 mt-2">
            Drejtuar nga: {' '}
            {hostProfile ? (
              <button
                onClick={() => onNavigateToProfilePage(hostProfile)}
                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none focus:ring-1 focus:ring-primary-300 rounded"
              >
                {formatVipName(host)}
              </button>
            ) : (
              <span className="font-semibold">{formatVipName(host)}</span>
            )}
          </p>
        </header>

        <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Përshkrimi</h2>
            <p className="text-slate-700 dark:text-slate-300 prose dark:prose-invert max-w-none leading-relaxed">
                {description}
            </p>
        </section>

        <section className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg shadow-inner">
             <h2 className="text-2xl font-semibold text-center text-slate-800 dark:text-slate-200 mb-6">Analiza e Perceptimit Publik</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="flex flex-col items-center text-center">
                    <MegaphoneIcon className="w-8 h-8 mb-2 text-primary-600 dark:text-primary-400" />
                    <GaugeChart value={statistics.audienceImpact} label="Ndikimi në Audiencë" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-2">Mat aftësinë e emisionit për të formësuar opinionin publik dhe për të iniciuar debate shoqërore.</p>
                </div>
                 <div className="flex flex-col items-center text-center">
                    <ShieldCheckIcon className="w-8 h-8 mb-2 text-green-600 dark:text-green-400" />
                    <GaugeChart value={statistics.informationCredibility} label="Besueshmëria e Informacionit" />
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-2">Vlerëson perceptimin e publikut mbi saktësinë, verifikimin dhe paanshmërinë e informacionit të paraqitur.</p>
                </div>
                 <div className="flex flex-col items-center text-center">
                    <ChatBubbleLeftRightIcon className="w-8 h-8 mb-2 text-blue-600 dark:text-blue-400" />
                    <GaugeChart value={statistics.discussionQuality} label="Cilësia e Diskutimit" />
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-2">Analizon nivelin e debatit, moderimin, diversitetin e opinioneve dhe thellësinë e argumenteve.</p>
                </div>
             </div>
        </section>
        
        <section className="mb-8">
             <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Temat Kryesore</h2>
             <div className="flex flex-wrap gap-2">
                {commonTopics.map((topic, index) => (
                    <span key={index} className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-primary-700 dark:text-primary-200">
                        {topic}
                    </span>
                ))}
             </div>
        </section>

        {maragonSummary && onNavigateToMaragonReport && (
          <section className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">Përmbledhje MARAGON®</h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg shadow-inner">
                <MaragonSummaryDisplay scores={maragonSummary} />
            </div>
            <div className="text-center mt-4">
              <button
                onClick={() => onNavigateToMaragonReport(tvShow.id, 'tvShow')}
                className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition"
              >
                <ChartBarIcon className="w-5 h-5 mr-2" />
                Shiko Raportin e Detajuar MARAGON
              </button>
            </div>
          </section>
        )}

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition"
            aria-label="Kthehu Pas"
          >
            &larr; Kthehu Pas
          </button>
        </div>
      </article>
    </main>
  );
};