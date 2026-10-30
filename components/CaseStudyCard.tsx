import React from 'react';
import { FakeNewsCaseStudy } from '../types';
import { 
    PencilSquareIcon,
    DocumentTextIcon, 
    SearchIcon,
    ChatBubbleBottomCenterTextIcon,
    ExclamationTriangleIcon, 
    XCircleIcon, 
    QuestionMarkCircleIcon, 
    ChartBarIcon,
    LightBulbIcon,
    MegaphoneIcon,
} from './icons';

const tacticIcons: { [key: string]: React.ReactNode } = {
  "Titull Sensacionalist": <PencilSquareIcon className="w-4 h-4" />,
  "Mungesë Burimesh": <DocumentTextIcon className="w-4 h-4" />,
  "Asociim i Gabuar": <SearchIcon className="w-4 h-4" />,
  "Gjuhë Spekulative": <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />,
  "Akuzë Ekstreme": <ExclamationTriangleIcon className="w-4 h-4" />,
  "Zero Prova": <XCircleIcon className="w-4 h-4" />,
  "Gjuhë Emocionale": <MegaphoneIcon className="w-4 h-4" />,
  "Mungesë Logjike": <QuestionMarkCircleIcon className="w-4 h-4" />,
};

export const CaseStudyCard: React.FC<{ 
  caseStudy: FakeNewsCaseStudy, 
  onNavigate: (caseStudy: FakeNewsCaseStudy) => void 
}> = ({ caseStudy, onNavigate }) => {
    const scoreColor = caseStudy.integrityScore < 20 ? 'bg-red-500' : caseStudy.integrityScore < 40 ? 'bg-orange-500' : 'bg-yellow-500';
    
    return (
        <article className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-slate-200 dark:border-slate-700">
            <button
                onClick={() => onNavigate(caseStudy)}
                className="w-full text-left p-6 group focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl"
            >
                <header className="mb-4">
                    <p className="px-3 py-1 text-sm font-bold text-white bg-red-600 rounded-lg inline-block shadow-md">
                        {caseStudy.verdictSummary_sq}
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mt-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight">
                        {caseStudy.headline_sq}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Burimi: {caseStudy.source}
                    </p>
                </header>

                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Taktikat Manipulative:</h4>
                    <div className="flex flex-wrap gap-2">
                        {caseStudy.keyTactics_sq?.map(tactic => (
                            <div key={tactic} className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg text-xs text-slate-600 dark:text-slate-300" title={tactic}>
                                {tacticIcons[tactic] || <LightBulbIcon className="w-4 h-4" />}
                                <span>{tactic}</span>
                            </div>
                        )) || <span className="text-xs text-slate-400 italic">Nuk janë identifikuar taktika specifike.</span>}
                    </div>
                </div>

                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Pikët e Integritetit NER (Audit):</h4>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-4 relative overflow-hidden">
                        <div className={`${scoreColor} h-4 rounded-full transition-all duration-500`} style={{ width: `${caseStudy.integrityScore}%` }}></div>
                        <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-bold text-slate-700 dark:text-slate-200" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.4)'}}>{caseStudy.integrityScore}/100</span>
                    </div>
                </div>

                <div className="mt-5 text-red-600 dark:text-red-400 font-semibold flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  <span className="group-hover:underline underline-offset-4 decoration-red-600/30">Hyr në Deep Audit Mode</span>
                </div>
            </button>
        </article>
    );
};
