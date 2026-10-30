import React from 'react';
import { FakeNewsCaseStudy } from '../types';
import { CaseStudyCard } from './CaseStudyCard';

interface FakeNewsArchivePageProps {
  caseStudies: FakeNewsCaseStudy[];
  onNavigateToCaseStudy: (caseStudy: FakeNewsCaseStudy) => void;
  onBack: () => void;
  onNavigateToAnalysisMethodology: () => void;
  onNavigateToMaragonFramework: () => void;
  onNavigateToHermeneuticFramework: () => void;
}

export const FakeNewsArchivePage: React.FC<FakeNewsArchivePageProps> = ({ 
  caseStudies, 
  onNavigateToCaseStudy, 
  onBack, 
  onNavigateToAnalysisMethodology, 
  onNavigateToMaragonFramework, 
  onNavigateToHermeneuticFramework 
}) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 pb-2" style={{ textShadow: '2px 2px #b91c1c, 4px 4px #1a1a1a' }}>
            Arkiva e Studimeve të Rasteve "Fake News"
          </h1>
          <p className="text-lg font-semibold text-white mt-2" style={{ textShadow: '1px 1px 2px #b91c1c, 2px 2px #1a1a1a' }}>
            Eksploroni analizat tona të thelluara mbi artikujt dezinformues dhe shpifës.
          </p>
        </header>
        
        <div className="mb-10 p-4 bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-500 rounded-r-lg shadow-lg">
          <h2 className="font-bold text-blue-800 dark:text-blue-200 uppercase tracking-widest text-xs mb-2">Korniza Jonë e Auditimit Forenzik</h2>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
            Çdo rast i listuar më poshtë i është nënshtruar një auditimi klinik CIDA. Ne dekonstruktojmë jo vetëm faktet, por edhe mjekësinë ligjore të tekstit, duke identifikuar "Malice Markers" dhe "Logic Fractures". Klikoni mbi një rast për të hyrë në <strong>Deep Audit Mode</strong>.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <button onClick={onNavigateToAnalysisMethodology} className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-primary-600 transition-colors">Metodologjia & Etika</button>
            <button onClick={onNavigateToMaragonFramework} className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-primary-600 transition-colors">Korniza MARAGON®</button>
            <button onClick={onNavigateToHermeneuticFramework} className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-primary-600 transition-colors">Korniza Filozofike</button>
          </div>
        </div>

        <div className="space-y-6">
          {caseStudies.map(caseStudy => (
            <CaseStudyCard 
                key={caseStudy.id} 
                caseStudy={caseStudy} 
                onNavigate={(study) => onNavigateToCaseStudy(study)} 
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={onBack}
            className="px-12 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-[10px] rounded-sm shadow-xl transition-all active:scale-95"
            aria-label="Kthehu Pas"
          >
            &larr; Kthehu te Kryefaqja
          </button>
        </div>
      </div>
    </main>
  );
};