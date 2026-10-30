
import React from 'react';
import { ArticleData } from '../types';
import { CalendarDaysIcon, PencilSquareIcon } from './icons'; 
import { renderWithSuperscript, parseAlbanianDateForISO } from '../utils/textUtils';
import { JsonLd } from './JsonLd';
import { DEFAULT_SEO_IMAGE_URL } from '../config/constants';
import { formatVipName } from '../utils/paragonProfileUtils';

export const ArticlePage: React.FC<{ article: ArticleData, onBack: () => void, onNavigateToAuthorProfile: (authorName: string) => void }> = ({ article, onBack, onNavigateToAuthorProfile }) => {
  if (!article) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 text-center font-sans">
        <p className="text-xl text-slate-700 dark:text-slate-300">Artikulli nuk u gjet.</p>
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

  const { title, author, publishedDate, imageUrl, content } = article;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': title,
    'image': imageUrl || DEFAULT_SEO_IMAGE_URL,
    'datePublished': parseAlbanianDateForISO(publishedDate),
    'author': {
        '@type': 'Person',
        'name': author,
    },
    'publisher': {
        '@type': 'Organization',
        'name': 'NOVARIC® Sh.A.',
        'logo': {
            '@type': 'ImageObject',
            'url': DEFAULT_SEO_IMAGE_URL
        }
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 font-sans">
      <JsonLd data={articleJsonLd} />
      <article className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-xl">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">{title}</h1>
          
          <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1 mb-4">
            <div className="flex items-center">
              <PencilSquareIcon className="w-4 h-4 mr-1.5 text-slate-400 dark:text-slate-500" />
              <span>Nga: </span>
              <button onClick={() => onNavigateToAuthorProfile(author)} className="ml-1 font-bold text-primary-600 dark:text-primary-400 hover:underline focus:outline-none font-sans">
                {renderWithSuperscript(formatVipName(author))}
              </button>
            </div>
            <div className="flex items-center">
              <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-slate-400 dark:text-slate-500" />
              <span>Publikuar më: {publishedDate}</span>
            </div>
          </div>
        </header>

        {imageUrl && (
          <figure className="mb-6">
            <img 
              src={imageUrl} 
              alt={`Imazh për artikullin: ${title}`} 
              className="w-full h-auto max-h-[450px] object-cover rounded-md shadow-md" 
            />
          </figure>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-justify font-sans">
          {content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-800"
            aria-label="Kthehu Pas"
          >
            Kthehu Pas
          </button>
        </div>
      </article>
    </main>
  );
};