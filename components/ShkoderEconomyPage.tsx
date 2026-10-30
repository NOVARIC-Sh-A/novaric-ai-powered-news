
import React from 'react';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { shkoderSocioEconomicData as data } from '../data/mockShkoderData';
import { BriefcaseIcon, UserGroupIcon, BuildingOffice2Icon, BanknotesIcon, GlobeEuropeAfricaIcon } from './icons';

interface ShkoderEconomyPageProps {
  onBack: () => void;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <section className="bg-slate-50 dark:bg-slate-900/40 p-4 sm:p-6 rounded-lg shadow-inner mb-8">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        {children}
    </section>
);


export const ShkoderEconomyPage: React.FC<ShkoderEconomyPageProps> = ({ onBack }) => {
    
    const iconClass = "w-5 h-5 text-primary-600 dark:text-primary-400";
    
    const employmentData = data.employmentBySector.map(item => ({
        name: item.sector,
        value: item.percentage,
        color: {
            'Shërbime & Turizëm': '#3b82f6',
            'Industri': '#8b5cf6',
            'Bujqësi': '#16a34a',
            'Ndërtim': '#f97316',
            'Tjetër': '#64748b'
        }[item.sector] || '#6b7280'
    }));

    const businessSizeData = data.businessSizeDistribution.map(item => ({
        name: item.size,
        value: item.percentage,
         color: {
            'Mikro (1-4 punonjës)': '#3b82f6',
            'Të Vogla (5-19)': '#16a34a',
            'Të Mesme (20-99)': '#f97316',
            'Të Mëdha (100+)': '#ef4444'
        }[item.size] || '#6b7280'
    }));


  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800/80 p-6 sm:p-8 rounded-lg shadow-2xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-700 dark:text-primary-400 mb-2">
            Paneli Ekonomik: Bashkia Shkodër
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Një pasqyrë e detajuar e tregut të punës, të ardhurave dhe aktivitetit të biznesit.
          </p>
        </header>

        <Section title="Tregu i Punës" icon={<UserGroupIcon className={iconClass} />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                    <h4 className="font-semibold text-center mb-3">Punësimi sipas Sektorit</h4>
                    <PieChart data={employmentData} size={180} />
                </div>
                <div>
                     <h4 className="font-semibold text-center mb-3">Shkalla e Papunësisë (%)</h4>
                     <p className="text-xs text-center text-slate-500 mb-2">Supozim trendi, të dhëna ilustruese</p>
                    <LineChart data={[{year: 2020, rate: 12.5}, {year: 2021, rate: 12.1}, {year: 2022, rate: 11.8}, {year: 2023, rate: 11.4}]} yAxisLabel="Papunësia" />
                </div>
            </div>
        </Section>
        
        <Section title="Të Ardhurat & Pagat" icon={<BanknotesIcon className={iconClass} />}>
            <h4 className="font-semibold text-center mb-4">Shpërndarja e të Ardhurave Mujore Familjare</h4>
            <div className="space-y-4">
                {data.householdIncomeDistribution.map(item => (
                    <BarChart key={item.bracket} label={item.bracket} value={item.percentage} color="#16a34a" />
                ))}
            </div>
        </Section>

        <Section title="Aktiviteti i Biznesit" icon={<BriefcaseIcon className={iconClass} />}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                    <h4 className="font-semibold text-center mb-3">Shpërndarja e Bizneseve sipas Madhësisë</h4>
                    <PieChart data={businessSizeData} size={180} />
                </div>
                <div>
                     <h4 className="font-semibold text-center mb-3">Trendi i Regjistrimit të Bizneseve të Reja</h4>
                     <p className="text-xs text-center text-slate-500 mb-2">Të dhëna ilustruese</p>
                    <LineChart data={[{year: 2020, count: 450}, {year: 2021, count: 480}, {year: 2022, count: 510}, {year: 2023, count: 530}]} yAxisLabel="Biznese të reja" />
                </div>
            </div>
        </Section>

        <Section title="Infrastruktura & Zhvillimi" icon={<BuildingOffice2Icon className={iconClass} />}>
             <div className="space-y-4">
                <BarChart label="Aksesi në Shërbime Financiare (Bankë)" value={75} color="#8b5cf6" />
                <BarChart label="Aksesi në Internet (Familje)" value={88} color="#0ea5e9" />
             </div>
        </Section>
        
        <Section title="Tregtia & Turizmi" icon={<GlobeEuropeAfricaIcon className={iconClass} />}>
             <h4 className="font-semibold text-center mb-3">Trendi i të Ardhurave nga Turizmi (Indeks)</h4>
             <p className="text-xs text-center text-slate-500 mb-2">Të dhëna ilustruese (Indeksi 2019=100)</p>
            <LineChart data={[{year: 2019, index: 100}, {year: 2020, index: 30}, {year: 2021, index: 75}, {year: 2022, index: 110}, {year: 2023, index: 135}]} yAxisLabel="Indeksi" />
        </Section>


        <div className="mt-12 text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition"
            aria-label="Kthehu Pas"
          >
            &larr; Kthehu Pas
          </button>
        </div>
      </div>
    </main>
  );
};
