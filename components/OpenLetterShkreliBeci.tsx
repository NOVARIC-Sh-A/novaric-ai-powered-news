import React from 'react';
import { ArticleData } from '../types';
import { renderWithSuperscript } from '../utils/textUtils';
import { CalendarDaysIcon, PencilSquareIcon } from './icons';

interface OpenLetterShkreliBeciProps {
  article: ArticleData;
  onBack: () => void;
}

const BulletPoint: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start pl-4 -indent-4">
        <span className="text-xl mr-3 leading-tight text-slate-500 dark:text-slate-400" aria-hidden="true">→</span>
        <span className="flex-1">{children}</span>
    </li>
);

export const OpenLetterShkreliBeci: React.FC<OpenLetterShkreliBeciProps> = ({ article, onBack }) => {
  if (!article) {
    return null;
  }

  const { title, author, publishedDate, content } = article;

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
        <div className="mb-6">
            <button onClick={onBack} className="inline-flex items-center px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition">
                &larr; <span className="ml-2">Kthehu Pas</span>
            </button>
        </div>

        <header className="mb-8 text-center border-b border-slate-200 dark:border-slate-700 pb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">{title}</h1>
            <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1 mt-4">
                <div className="flex items-center justify-center">
                    <PencilSquareIcon className="w-4 h-4 mr-1.5" />
                    <span>Nga: {renderWithSuperscript(author)}</span>
                </div>
                <div className="flex items-center justify-center">
                    <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                    <span>Publikuar më: {publishedDate}</span>
                </div>
            </div>
        </header>

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
          <div className="mb-6 italic space-y-2">
              <p>Të nderuar qytetarë,</p>
              <p>Të nderuar socialistë të Shkodrës,</p>
              <p>Të gjithë ju që ende e konsideroni këtë qytet si një hapësirë qytetarie, respekti dhe kujtese kulturore,</p>
          </div>
          
          {content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('- ')) {
              return null; // Handle list items in the next block
            }
            if (paragraph.includes('Është një simptomë më e thellë:')) {
              return (
                <React.Fragment key={index}>
                    <p>{paragraph.replace(':', '')}:</p>
                    <ul className="list-none my-6 space-y-3 pl-0">
                        {content.split('\n').filter(p => p.startsWith('- ')).map((item, i) => (
                            <BulletPoint key={i}>{item.substring(2)}</BulletPoint>
                        ))}
                    </ul>
                </React.Fragment>
              );
            }
             if (paragraph.toLowerCase().startsWith('sepse shkodra')) {
                return null; // Handle this in the closing section
             }

            return <p key={index} className="mb-4">{paragraph}</p>;
          })}

          <div className="mt-6 font-semibold italic space-y-1">
              <p>Sepse Shkodra nuk është një ndërmarrje.</p>
              <p>Shkodra nuk është një kartelë partie.</p>
              <p>Shkodra është një kujtesë kolektive që nuk fal harresën, arrogancën dhe përbuzjen.</p>
          </div>

          <div className="mt-8 text-right">
            <p className="font-semibold">Me respekt,</p>
            <p className="font-semibold">{renderWithSuperscript(author)}</p>
          </div>
        </div>

      </article>
    </main>
  );
};