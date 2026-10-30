import React, { useMemo, useState } from 'react';
import { CpuChipIcon, ShieldCheckIcon, BeakerIcon, ExclamationTriangleIcon, ChartBarIcon, ShareIcon, CheckIcon, InstagramIcon } from './icons';
import { renderWithSuperscript } from '../utils/textUtils';
import GaugeChart from './GaugeChart';
import { PieChart } from './PieChart';
import { RadarChart } from './RadarChart';
import { useSeo } from '../hooks/useSeo';
import { JsonLd } from './JsonLd';

interface NoraAiProfilePageProps {
  onBack: () => void;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-primary-500/30 flex items-center">
            {icon}
            <span className="ml-3">{title}</span>
        </h2>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-justify space-y-3">
            {children}
        </div>
    </section>
);

const StatCard: React.FC<{ value: string; label: string; }> = ({ value, label }) => (
    <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg text-center shadow">
        <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{value}</p>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">{label}</p>
    </div>
);


export const NoraAiProfilePage: React.FC<NoraAiProfilePageProps> = ({ onBack }) => {
  const pageTitle = `Profili i Analistes së IA: Nora | NOVARIC®`;
  const pageDescription = "Zbuloni rolin, metodologjinë dhe filozofinë e Norës, analistes së inteligjencës artificiale që fuqizon platformën NOVARIC®.";
  const pageImageUrl = "https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg";
    
  useSeo(pageTitle, pageDescription, pageImageUrl, window.location.href);

  const iconClass = "w-7 h-7 text-primary-600 dark:text-primary-400";

  const taskBreakdownData = useMemo(() => [
    { name: 'Verifikim & Analizë Integriteti', value: 30, description: 'Verifikimi i pretendimeve specifike dhe vlerësimi i integritetit të përgjithshëm të përmbajtjes.' },
    { name: 'Analizë PARAGON® e Performancës', value: 28, description: 'Mbledhja dhe analiza e të dhënave për vlerësimin e performancës së figurave politike.' },
    { name: 'Analizë Hermeneutike e Tekstit', value: 22, description: 'Dekonstruksioni i teksteve për të zbuluar kornizime kulturore dhe narrative të fshehura.' },
    { name: 'Llogaritja e Metrikave të Avancuara', value: 12, description: 'Llogaritja sasiore e besueshmërisë, lexueshmërisë, anshmërisë dhe metrikave të tjera.' },
    { name: 'Zbulimi i Anshmërisë & Konteksti', value: 8, description: 'Identifikimi i anshmërive, gjuhës manipulative dhe ofrimi i kontekstit relevant.' },
  ], []);
  
  const pieChartColors = useMemo(() => taskBreakdownData.map(d => {
    const hash = d.name.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
  }), [taskBreakdownData]);

  const pieChartData = useMemo(() => taskBreakdownData.map((item, index) => ({
      ...item,
      color: pieChartColors[index]
  })), [taskBreakdownData, pieChartColors]);


  const biasDetectionData = useMemo(() => ({
    labels: ["Anshmëri Politike", "Sensacionalizëm", "Gjuhë Emocionale", "Paragjykim Konfirmimi", "Kornizim Selektiv"],
    datasets: [
        {
            label: "Aftësia e Norës (%)",
            data: [93, 89, 96, 86, 91],
            backgroundColor: 'rgba(228, 25, 30, 0.2)',
            borderColor: 'rgba(228, 25, 30, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(228, 25, 30, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(228, 25, 30, 1)',
        },
        {
            label: 'Mesatarja e Sistemeve të Ngjashme',
            data: [86, 83, 89, 81, 85],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        },
        {
            label: 'Standardi i Industrisë (Benchmark)',
            data: [95, 90, 92, 88, 93],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
        }
    ]
  }), []);

  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: pageTitle,
      text: pageDescription,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Could not copy URL: ', err);
        }
    } else {
        alert('Shpërndarja nuk mbështetet. Ju lutem kopjoni linkun manualisht.');
    }
  };

  const noraProfileJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nora (AI)",
    "jobTitle": "Analiste e Inteligjencës Artificiale",
    "worksFor": {
      "@type": "Organization",
      "name": "NOVARIC®"
    },
    "description": "Nora është një sistem i avancuar i Inteligjencës Artificiale (IA) i projektuar nga NOVARIC®. E bazuar në modelet më të fundit gjuhësorë të Google, Nora është specializuar për të analizuar, verifikuar dhe dekonstruktuar përmbajtjen mediatike në kontekstin unik shqiptar.",
    "image": pageImageUrl,
    "url": window.location.href,
    "sameAs": "https://aistudio.instagram.com/ai/835800359406469/"
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <JsonLd data={noraProfileJsonLd} />
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <div className="mb-6">
            <button onClick={onBack} className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition">
                &larr; <span className="ml-2">Kthehu Pas</span>
            </button>
        </div>
        
        <header className="text-center mb-10">
          <img 
            src={pageImageUrl}
            alt="Përfaqësimi artistik i Norës, analistes së inteligjencës artificiale"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary-500/50 shadow-lg mb-4 mx-auto"
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
            Nora (AI)
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
            Analistja e Inteligjencës Artificiale e NOVARIC®
          </p>
        </header>

        <Section title="Kush është Nora?" icon={<CpuChipIcon className={iconClass} />}>
            <p>Nora nuk është një person, por një sistem i avancuar i Inteligjencës Artificiale (IA) i projektuar nga {renderWithSuperscript('NOVARIC®')}. E bazuar në modelet më të fundit gjuhësorë të Google, Nora është specializuar për të analizuar, verifikuar dhe dekonstruktuar përmbajtjen mediatike në kontekstin unik shqiptar, duke aplikuar korniza të avancuara si PARAGON® për vlerësimin e performancës dhe kuadrin hermeneutik për analizë të thelluar kulturore.</p>
            <p>Ajo shërben si një mjet i fuqishëm për ekipin tonë të gazetarëve, duke përshpejtuar kërkimin dhe duke identifikuar modele që mund të jenë të vështira për t'u dalluar nga syri i njeriut. Ajo është e aftë të përpunojë vëllime masive të dhënash në kohë rekord, një detyrë që do të ishte e pamundur për një ekip njerëzor.</p>
        </Section>
        
        <Section title="Bisedoni Drejtpërdrejt me Norën" icon={<InstagramIcon className={iconClass} />}>
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-lg">
                <div className="flex-shrink-0">
                    <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://aistudio.instagram.com/ai/835800359406469/?utm_source=mshare"
                        alt="Kodi QR për profilin e Norës në Instagram"
                        className="w-36 h-36 rounded-lg shadow-md border-4 border-white dark:border-slate-700"
                    />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Angazhohuni në Biseda</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                        Bëni pyetje dhe merrni përgjigje të menjëhershme direkt nga Nora në profilin e saj të dedikuar AI në Instagram. Skanoni kodin QR ose klikoni butonin për të filluar.
                    </p>
                    <a
                        href="https://aistudio.instagram.com/ai/835800359406469/?utm_source=mshare"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity"
                    >
                        <InstagramIcon className="w-5 h-5 mr-2"/>
                        Hap Profilin në Instagram
                    </a>
                </div>
            </div>
        </Section>
        
        <Section title="Metrikat e Performancës" icon={<ChartBarIcon className={iconClass} />}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard value="25,000+" label="Analiza të Kryera" />
                <StatCard value="~38s" label="Koha Mesatare / Analizë" />
                <StatCard value="98.2%" label="Saktësia Fillestare" />
                <StatCard value="24/7" label="Disponueshmëria" />
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col items-center">
                    <h4 className="font-semibold text-center mb-2">Saktësia e Analizës Fillestare</h4>
                    <GaugeChart value={98.2} label="Përqindja e Saktësisë" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">Mat saktësinë e vlerësimit të parë të Norës përpara rishikimit njerëzor.</p>
                </div>
                <div className="flex flex-col items-center">
                    <h4 className="font-semibold text-center mb-2">Ndarja e Detyrave Analitike</h4>
                    <PieChart data={pieChartData} size={150} />
                     <div className="mt-4 w-full space-y-2">
                        {pieChartData.map(item => (
                            <div key={item.name} className="flex items-start text-xs">
                                <span className="w-3 h-3 rounded-full mr-2 mt-0.5 flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                                <div>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{item.name} ({item.value}%):</span>
                                    <span className="ml-1 text-slate-600 dark:text-slate-400">{item.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <div className="mt-8">
                <h4 className="font-semibold text-center mb-2">Aftësitë e Zbulimit të Anshmërisë</h4>
                <RadarChart data={biasDetectionData} />
            </div>
        </Section>
        
        <Section title="Metodologjia e Punës" icon={<BeakerIcon className={iconClass} />}>
            <p>Kur Nora kryen një detyrë analitike, ajo ndjek një proces të specializuar të përcaktuar në "udhëzimet e sistemit" (system prompt) të saj, bazuar në detyrën specifike:</p>
            <ol className="list-decimal list-inside space-y-3">
                <li><strong>Analiza e Integritetit të Përmbajtjes:</strong> Kjo është detyra themelore. Nora dekonstrukton një tekst në pretendimet e tij kryesore faktike, i verifikon ato duke përdorur kërkim të kryqëzuar në ueb, dhe prodhon një raport të detajuar që përfshin një verdikt, përmbledhje, dhe pikat pro e kundër.</li>
                <li><strong>Vlerësimi i Performancës Politike (PARAGON®):</strong> Duke aplikuar kornizën PARAGON®, Nora mbledh dhe analizon të dhëna publike për të vlerësuar performancën e figurave politike përgjatë shtatë dimensioneve kyçe, si Angazhimi Politik, Llogaridhënia, Përfaqësimi, dhe Komunikimi.</li>
                <li><strong>Analiza Hermeneutike e Tekstit:</strong> Përtej fakteve sipërfaqësore, Nora përdor një qasje hermeneutike për të dekonstruktuar tekstin, duke identifikuar kornizime kulturore, gjuhë emocionale dhe arketipe narrative që formësojnë kuptimin e fshehur të një artikulli.</li>
                <li><strong>Llogaritja e Metrikave të Avancuara:</strong> Për artikujt investigativë, Nora llogarit një set të gjerë metrikash sasiore, duke përfshirë besueshmërinë e burimeve, lexueshmërinë, subjektivitetin dhe përputhshmërinë me standardet, duke ofruar një pasqyrë transparente të cilësisë së përmbajtjes.</li>
            </ol>
        </Section>
        
        <Section title="Kufizimet dhe Etika" icon={<ExclamationTriangleIcon className={iconClass} />}>
            <p>Në {renderWithSuperscript('NOVARIC®')}, ne besojmë në një model bashkëpunimi hibrid njeri-IA. Nora nuk është një zëvendësim për gazetarinë njerëzore, por një partnere në procesin editorial. Ne jemi plotësisht transparentë për kufizimet e Norës. Si çdo sistem IA, ajo:</p>
            <ul className="list-disc list-inside">
                <li><strong>Nuk është e pagabueshme:</strong> Mund të keqinterpretojë nuancat ose të bëjë gabime. Prandaj, mbikëqyrja njerëzore është thelbësore.</li>
                <li><strong>Mund të ketë paragjykime:</strong> IA mund të reflektojë paragjykimet e pranishme në të dhënat masive me të cilat është trajnuar. Ekipi ynë punon vazhdimisht për të identifikuar dhe zbutur këto paragjykime.</li>
                <li><strong>Nuk kupton si një njeri:</strong> Ajo nuk ka përvoja jetësore, ndjenja apo ndërgjegje. Analiza e saj është statistikore dhe algoritmike.</li>
            </ul>
            <p>Angazhimi ynë është të përdorim Norën në mënyrë etike, si një mjet për të fuqizuar gazetarinë cilësore dhe për të promovuar një diskurs publik më të informuar, duke ruajtur gjithmonë standardet më të larta të përgjegjësisë njerëzore.</p>
        </Section>
        
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 text-center relative">
             <button
                onClick={handleShare}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-md transition-colors"
             >
                <ShareIcon className="w-5 h-5 mr-2" />
                Shpërndaje Profilin
             </button>
             {isCopied && (
                <div 
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-sm font-semibold rounded-md shadow-lg whitespace-nowrap animate-fadeIn" 
                    role="status"
                >
                    <CheckIcon className="w-4 h-4 inline mr-1.5" />
                    Linku u kopjua!
                </div>
            )}
        </div>
      </div>
    </main>
  );
};