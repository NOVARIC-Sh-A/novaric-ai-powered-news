
import React from 'react';
import { VipProfile, ChartSegment } from '../types';
import { PieChart } from './PieChart';
import { MegaphoneIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon } from './icons';
import { formatVipName, getProfilePhotoUrl } from '../utils/paragonProfileUtils';

interface PresenterAnalysisPageProps {
  presenter: VipProfile;
  onBack: () => void;
}

const POSITIVE_COLOR = '#86efac'; // green-300
const NEGATIVE_COLOR = '#f87171'; // red-400

const createConductChartData = (data: { excellent: number; good: number; average: number; needsImprovement: number } | undefined): ChartSegment[] | undefined => {
    if (!data) return undefined;
    const { excellent, good, needsImprovement } = data;
    const positive = excellent + good;
    const segments: ChartSegment[] = [];
    if (positive > 0) segments.push({ name: 'Pozitiv', value: positive, color: POSITIVE_COLOR });
    if (needsImprovement > 0) segments.push({ name: 'Për Përmirësim', value: needsImprovement, color: NEGATIVE_COLOR });
    return segments.length > 0 ? segments : undefined;
};

const AnalysisCharacteristic: React.FC<{ title: string; chartData?: ChartSegment[]; whatToMonitor: string; whyItMatters: string; benchmark: number; }> = ({ title, chartData, whatToMonitor, whyItMatters, benchmark }) => {
  if (!chartData || chartData.length === 0) return null;

  const positiveValue = chartData.find(s => s.name === 'Pozitiv')?.value || 0;
  const totalValue = chartData.reduce((sum, s) => sum + s.value, 0);
  const score = totalValue > 0 ? Math.round((positiveValue / totalValue) * 100) : 0;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0 pb-4 last:pb-0">
      <div className="md:w-1/3 flex-shrink-0 flex flex-col items-center">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2 text-center">{title}</h4>
        <PieChart data={chartData} size={100} />
        <div className="mt-2 w-full flex flex-col items-center text-center space-y-2">
            <div className="w-full">
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{score}%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Vlerësimi pozitiv</p>
            </div>
            <div className="w-full h-px bg-slate-200 dark:bg-slate-600 my-1"></div>
            <div className="w-full">
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">{benchmark}%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Standardi i Industrisë</p>
            </div>
        </div>
      </div>
      <div className="md:w-2/3">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h5 className="font-semibold text-slate-700 dark:text-slate-300">Çfarë monitorohet:</h5>
          <p>{whatToMonitor}</p>
          <h5 className="font-semibold text-slate-700 dark:text-slate-300 mt-3">Pse ka rëndësi:</h5>
          <p>{whyItMatters}</p>
        </div>
      </div>
    </div>
  );
};

export const PresenterAnalysisPage: React.FC<PresenterAnalysisPageProps> = ({ presenter, onBack }) => {
  const { name, category, imageUrl, detailedBio, journalisticConduct } = presenter;

  if (!journalisticConduct) {
    return (
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
            <p className="text-xl text-slate-700 dark:text-slate-300">Nuk ka analizë të detajuar për këtë prezantues.</p>
            <button
            onClick={onBack}
            className="mt-6 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md"
            >
            Kthehu Pas
            </button>
      </main>
    );
  }

  const analysisData = [
    {
      title: "Aftësitë e Komunikimit",
      chartData: createConductChartData(journalisticConduct.communicationSkills),
      whatToMonitor: "Qartësia e të folurit, modulimi i tonit, artikulimi, gjuha e trupit, kontakti me sy, qëndrimi.",
      whyItMatters: "Një prezantues profesionist komunikon qartë, e mban audiencën të angazhuar dhe përputh gjuhën e trupit me përmbajtjen e folur për të ruajtur besueshmërinë dhe autoritetin.",
      benchmark: 80,
    },
    {
      title: "Saktësia dhe Paanshmëria",
      chartData: createConductChartData(journalisticConduct.accuracyAndImpartiality),
      whatToMonitor: "Verifikimi i fakteve, atribuimi i burimeve, shmangia e opinioneve personale ose anshmërisë.",
      whyItMatters: "Sipas kodit të etikës së NOVARIC®, gazetarët profesionistë duhet të shmangin pasaktësitë, anshmërinë dhe shtrembërimin e fakteve. Një prezantues nuk duhet të përhapë dezinformata ose paragjykime personale nën petkun e lajmeve.",
      benchmark: 85,
    },
    {
      title: "Standardet Etike",
      chartData: createConductChartData(journalisticConduct.ethicalStandards),
      whatToMonitor: "Integriteti, transparenca, respekti për privatësinë, shmangia e konflikteve të interesit.",
      whyItMatters: "Sjellja etike është thelbësore për besueshmërinë. Për shembull, prezantuesit nuk duhet të pranojnë dhurata, të keqparaqesin veten, ose të tregojnë favorizim ndaj entiteteve politike ose tregtare.",
      benchmark: 90,
    },
    {
      title: "Reagimi ndaj Gabimeve",
      chartData: createConductChartData(journalisticConduct.errorResponsiveness),
      whatToMonitor: "Gatishmëria dhe shpejtësia për të pranuar dhe korrigjuar gabimet, si në transmetim ashtu edhe në mediat sociale.",
      whyItMatters: "Një parim thelbësor i profesionalizmit gazetaresk është korrigjimi i gabimeve në mënyrë transparente dhe pa hezitim. Shmangia e kësaj përgjegjësie reflekton negativisht mbi besueshmërinë.",
      benchmark: 75,
    },
    {
      title: "Sjellja në Mediat Sociale",
      chartData: createConductChartData(journalisticConduct.socialMediaConduct),
      whatToMonitor: "Postimet publike, pëlqimet, shpërndarjet dhe ndërveprimet online.",
      whyItMatters: "Politika e mediave sociale të NOVARIC® i mban gazetarët në të njëjtat standarde online siç mbahen në transmetim. Opinionet personale, përmbajtja nxitëse ose ndërveprimet e anshme mund të komprometojnë paanshmërinë dhe integritetin profesional.",
      benchmark: 70,
    }
  ];

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
         <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-8">Analizë e Thelluar e Prezantuesit</h1>

            <section className="mb-8 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-lg shadow-inner">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <img 
                        src={getProfilePhotoUrl(presenter)}
                        onError={(e) => {
                            const gender = presenter?.gender?.toLowerCase();
                            e.currentTarget.src =
                                gender === "female" || gender === "f"
                                    ? "https://novaric.co/wp-content/uploads/2025/11/FemaleProfile.jpg"
                                    : "https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg";
                        }}
                        alt={`Profile of ${name}`}
                        style={{ objectFit: "cover" }}
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 dark:border-primary-700 shadow-lg flex-shrink-0"
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-primary-700 dark:text-primary-400">{formatVipName(name)}</h2>
                        <h3 className="text-lg text-slate-600 dark:text-slate-400 mt-1">Biografia</h3>
                    </div>
                </div>
                 <div className="mt-4 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
                    {detailedBio ? (
                        detailedBio.split(/\n\s*\n/).map((paragraph, index) => (
                            <p key={index} className="mb-4 text-justify last:mb-0">
                                {paragraph}
                            </p>
                        ))
                    ) : (
                        <p>Nuk ka biografi të detajuar për këtë personalitet.</p>
                    )}
                 </div>
            </section>

            <section>
                 <h3 className="text-2xl font-semibold text-center text-primary-700 dark:text-primary-400 mb-4">Analizë e Profesionalizmit Gazetaresk</h3>
                 <div className="bg-slate-50 dark:bg-slate-900/40 rounded-lg shadow-inner overflow-hidden">
                    {analysisData.map(item => <AnalysisCharacteristic key={item.title} {...item} />)}
                 </div>
            </section>

             <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition"
                    aria-label="Kthehu pas"
                >
                    Kthehu Pas
                </button>
            </div>
         </div>
    </main>
  );
};
