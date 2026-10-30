
import React from 'react';
import { AcademicJournalData } from '../types';
import { CalendarDaysIcon, PencilSquareIcon, GlobeAltIcon } from './icons'; 
import { renderWithSuperscript, parseAlbanianMonthYearForISO } from '../utils/textUtils';
import { JsonLd } from './JsonLd';
import { DEFAULT_SEO_IMAGE_URL } from '../config/constants';
import { formatVipName } from '../utils/paragonProfileUtils';

export const AcademicJournalPage: React.FC<{ journal: AcademicJournalData, onBack: () => void }> = ({ journal, onBack }) => {
  if (!journal) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 text-center font-sans">
        <p className="text-xl text-slate-700 dark:text-slate-300">Botimi nuk u gjet.</p>
        <button
          onClick={onBack}
          className="mt-6 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md"
          aria-label="Kthehu Pas"
        >
          Kthehu Pas
        </button>
      </main>
    );
  }

  const { title, authors, publicationDate, summary, journalName, url, imageUrl } = journal;

  const scholarlyArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    'headline': title,
    'author': authors.map(name => ({ '@type': 'Person', 'name': name })),
    'datePublished': parseAlbanianMonthYearForISO(publicationDate),
    'abstract': summary,
    'image': imageUrl || DEFAULT_SEO_IMAGE_URL,
    'isPartOf': {
        '@type': 'PublicationIssue',
        'name': journalName
    },
    'publisher': {
        '@type': 'Organization',
        'name': 'NOVARIC® Sh.A.'
    },
    'url': url
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 font-sans">
      <JsonLd data={scholarlyArticleJsonLd} />
      <article className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl">
        <header className="mb-6">
          <p className="text-sm font-semibold text-academy-teal dark:text-academy-blue uppercase tracking-wide mb-2">
            {renderWithSuperscript(journalName)}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">{title}</h1>
          
          <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1 mb-4">
            <div className="flex items-center">
              <PencilSquareIcon className="w-4 h-4 mr-1.5 text-slate-400 dark:text-slate-500" />
              <span className="font-sans font-medium">Autor(ë): {authors.map(name => formatVipName(name)).join(', ')}</span>
            </div>
            <div className="flex items-center">
              <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-slate-400 dark:text-slate-500" />
              <span>Publikuar: {publicationDate}</span>
            </div>
          </div>
        </header>

        <figure className="mb-6 rounded-lg shadow-lg overflow-hidden bg-black">
          <video
            key={journal.id}
            className="w-full h-auto max-h-[400px] object-cover"
            src="https://novaricstorage.blob.core.windows.net/media/AdobeStock_175181997.mov"
            autoPlay
            loop
            muted
            playsInline
            aria-label={`Video dekorative për revistën akademike`}
          >
            Shfletuesi juaj nuk e mbështet etiketën e videos.
          </video>
        </figure>

        <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Përmbledhje (Abstrakt)</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-justify font-sans">
            {summary.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
            ))}
            </div>
        </div>

        <div className="mt-8">
            <a 
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-academy-teal hover:bg-academy-teal-dark text-white font-semibold rounded-md shadow-md transition-colors"
            >
                <GlobeAltIcon className="w-5 h-5 mr-2" />
                Shiko Publikimin e Plotë
            </a>
        </div>


        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out"
            aria-label="Kthehu Pas"
          >
            Kthehu Pas
          </button>
        </div>
      </article>
    </main>
  );
};