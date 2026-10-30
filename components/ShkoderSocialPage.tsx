
import React from 'react';
import { shkoderSocioEconomicData } from '../data/mockShkoderData';
import { ShkoderSocioEconomicData } from '../types';
import { PopulationPyramid } from './PopulationPyramid';
import { PieChart } from './PieChart';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { UsersIcon, HomeModernIcon, HeartIcon, AcademicCapIcon, BriefcaseIcon, BanknotesIcon, ChartTrendingUpIcon, WifiIcon } from './icons';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg shadow-md flex items-center">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{value}</p>
        </div>
    </div>
);

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <section className="bg-slate-50 dark:bg-slate-900/40 p-4 sm:p-6 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        {children}
    </section>
);

export const ShkoderSocialPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const data: ShkoderSocioEconomicData = shkoderSocioEconomicData;
    const iconClass = "w-5 h-5 text-primary-600 dark:text-primary-400";

    const genderRatioData = [
        { name: 'Meshkuj', value: data.genderRatio.male, color: '#3b82f6' },
        { name: 'Femra', value: data.genderRatio.female, color: '#ec4899' }
    ];

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
    
    const housingData = data.housingType.map(item => ({
        name: item.type,
        value: item.percentage,
        color: {
            'Në pronësi': '#22c55e',
            'Me qira': '#f59e0b',
            'Tjetër': '#64748b'
        }[item.type] || '#6b7280'
    }));

    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800/80 p-6 sm:p-8 rounded-lg shadow-2xl">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-primary-700 dark:text-primary-400 mb-2">
                        Paneli Socio-Ekonomik: Shkodër
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Një pasqyrë e të dhënave demografike, sociale dhe ekonomike për bashkinë.
                    </p>
                </header>
                
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                     <StatCard icon={<UsersIcon className={iconClass} />} label="Popullsia" value={data.totalPopulation.toLocaleString('sq-AL')} />
                     <StatCard icon={<HomeModernIcon className={iconClass} />} label="Familje" value={data.households.toLocaleString('sq-AL')} />
                     <StatCard icon={<BriefcaseIcon className={iconClass} />} label="Papunësia" value={`${data.unemploymentRate}%`} />
                     <StatCard icon={<BanknotesIcon className={iconClass} />} label="Varfëria" value={`${data.povertyRate}%`} />
                </section>
                
                <div className="space-y-8">
                    <Section title="Përbërja e Popullsisë" icon={<UsersIcon className={iconClass} />}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h4 className="font-semibold text-center mb-2">Piramida e Popullsisë</h4>
                                <PopulationPyramid data={data.populationPyramid} />
                            </div>
                            <div className="flex flex-col gap-8">
                                <div className="text-center">
                                    <h4 className="font-semibold mb-2">Raporti Gjinor</h4>
                                    <PieChart data={genderRatioData} size={120} />
                                </div>
                                <div className="text-center">
                                    <h4 className="font-semibold mb-2">Rritja e Popullsisë</h4>
                                    <LineChart data={data.populationGrowth} yAxisLabel="Popullsia" />
                                </div>
                            </div>
                        </div>
                    </Section>
                    
                    <Section title="Arsimi dhe Tregu i Punës" icon={<AcademicCapIcon className={iconClass} />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div>
                                <h4 className="font-semibold mb-3 text-center">Arsimimi</h4>
                                <div className="space-y-4">
                                {data.educationAttainment.map(item => (
                                    <BarChart key={item.level} label={item.level} value={item.percentage} color="#8b5cf6" />
                                ))}
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-3 text-center">Punësimi sipas Sektorit</h4>
                                <PieChart data={employmentData} size={180} />
                            </div>
                        </div>
                    </Section>

                    <Section title="Treguesit Ekonomikë" icon={<ChartTrendingUpIcon className={iconClass} />}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div>
                                <h4 className="font-semibold mb-3 text-center">Shpërndarja e të Ardhurave</h4>
                                <div className="space-y-4">
                                {data.householdIncomeDistribution.map(item => (
                                    <BarChart key={item.bracket} label={item.bracket} value={item.percentage} color="#16a34a" />
                                ))}
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-3 text-center">Madhësia e Bizneseve</h4>
                               <PieChart data={businessSizeData} size={180} />
                            </div>
                        </div>
                    </Section>
                    
                    <Section title="Strehimi dhe Shëndetësia" icon={<HeartIcon className={iconClass} />}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h4 className="font-semibold mb-3 text-center">Lloji i Strehimit</h4>
                                <PieChart data={housingData} size={150} />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3 text-center">Treguesit Kryesorë të Shëndetit</h4>
                                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                    {data.healthIndicators.map(item => (
                                        <div key={item.indicator} className="flex justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                                            <span>{item.indicator}:</span>
                                            <span className="font-bold">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Section>
                </div>

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
