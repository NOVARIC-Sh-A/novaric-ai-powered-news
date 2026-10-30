import React from 'react';
import { RadarChart } from './RadarChart';
import { ParagonHeatmap } from './ParagonHeatmap';
import { PresentationChartLineIcon, UsersIcon, ShareIcon } from './icons';

interface ParagonVisualizationPageProps {
  onBack: () => void;
  onNavigateToParagonNetworkMap: () => void;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-3">
            {icon}
            <span>{title}</span>
        </h2>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-justify space-y-3">
            {children}
        </div>
    </section>
);

export const ParagonVisualizationPage: React.FC<ParagonVisualizationPageProps> = ({ onBack, onNavigateToParagonNetworkMap }) => {
    
  return (
    <>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl">
          <div className="mb-6">
              <button
                  onClick={onBack}
                  className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition"
              >
                  &larr; <span className="ml-2">Kthehu Pas</span>
              </button>
          </div>
          
          <header className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              Modeli Analitik PARAGON<sup>®</sup>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
              Një shpjegim i thelluar i algoritmeve dhe sistemeve të ponderimit që fuqizojnë motorin tonë analitik.
            </p>
          </header>

          <Section title="Algoritmet dhe Ponderimi" icon={<PresentationChartLineIcon className="w-6 h-6 text-primary-500" />}>
              <p>Modeli analitik PARAGON® nuk është thjesht një grumbullim i të dhënave, por një sistem i sofistikuar që përdor algoritme dhe pesha të kalibruara për të prodhuar një vlerësim të nuancuar. Çdo dimension vlerësohet bazuar në një sërë treguesish specifikë, dhe secilit tregues i caktohet një peshë që reflekton rëndësinë e tij relative brenda kontekstit politik shqiptar.</p>
              <p>Për shembull, në dimensionin "Narrativa & Komunikimi", aftësia për të artikuluar një mesazh koherent mund të peshojë më shumë se thjesht frekuenca e daljeve publike. Po kështu, te "Llogaridhënia & Transparenca", një histori e konflikteve të interesit peshon më rëndë se vonesat e vogla në deklarimin e pasurisë. Kjo qasje e ponderuar siguron që pikëzimi final të pasqyrojë një vlerësim thelbësor të performancës, jo thjesht një mesatare mekanike.</p>
          </Section>
          
          <Section title="Vlera e Normalizimit dhe Krahasimit" icon={<UsersIcon className="w-6 h-6 text-primary-500" />}>
              <p>Për të bërë të mundur krahasimin e drejtë midis politikanëve me role dhe përvoja të ndryshme, të gjitha të dhënat e papërpunuara normalizohen në një shkallë standarde nga 0 në 100. Kjo do të thotë që pikëzimi i një politikani nuk është absolut, por relativ me performancën e kolegëve të tij dhe me standardet e paracaktuara. Ky proces normalizimi na lejon të përgjigjemi pyetjeve si: "Sa efektiv është ky deputet në krahasim me mesataren e grupit të tij parlamentar?" ose "Si renditet performanca e tij kundrejt një standardi ideal të përcaktuar nga praktikat më të mira ndërkombëtare?". Kjo qasje krahasuese është thelbësore për të ofruar një vlerësim të drejtë dhe të kontekstualizuar.</p>
          </Section>
        </div>
      </main>
    </>
  );
};