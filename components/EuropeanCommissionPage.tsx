
import React from 'react';
import { 
    ZodiacSign,
} from '../types';
import { 
    AriesIcon, TaurusIcon, GeminiIcon, CancerIcon, LeoIcon, VirgoIcon, LibraIcon, 
    ScorpioIcon, SagittariusIcon, CapricornIcon, AquariusIcon, PiscesIcon 
} from './icons';
import { formatVipName } from '../utils/paragonProfileUtils';

interface EuropeanCommissionPageProps {
  onBack: () => void;
}

interface Commissioner {
    name: string;
    title: string;
    imageUrl?: string;
    dob: string; // YYYY-MM-DD
    country: string; // ISO 3166-1 alpha-2 code
    rating: number; // 0-100
}

const commissionersData: {
    president: Commissioner[];
    evpsAndHr: Commissioner[];
    commissioners: Commissioner[];
} = {
  president: [
    { name: 'Ursula von der Leyen', title: '', dob: '1958-10-08', country: 'de', rating: 92 },
  ],
  evpsAndHr: [
    { name: 'Teresa Ribera', title: 'Clean, Just and Competitive Transition', dob: '1969-05-19', country: 'es', rating: 88 },
    { name: 'Henna Virkkunen', title: 'Tech Sovereignty, Security and Democracy', dob: '1972-06-04', country: 'fi', rating: 85 },
    { name: 'Stéphane Séjourné', title: 'Prosperity and Industrial Strategy', dob: '1985-03-26', country: 'fr', rating: 86 },
    { name: 'Kaja Kallas', title: 'High Representative for Foreign Affairs and Security Policy\nVice-President', dob: '1977-06-18', country: 'ee', rating: 90 },
    { name: 'Roxana Mînzatu', title: 'Social Rights and Skills, Quality Jobs and Preparedness\nVice-President', dob: '1980-04-01', country: 'ro', rating: 84 },
    { name: 'Raffaele Fitto', title: 'Cohesion and Reforms\nVice-President', dob: '1969-08-28', country: 'it', rating: 87 },
  ],
  commissioners: [
    { name: 'Maroš Šefčovič', title: 'Trade and Economic Security\nInterinstitutional Relations and Transparency', dob: '1966-07-24', country: 'sk', rating: 89 },
    { name: 'Valdis Dombrovskis', title: 'Economy and Productivity\nImplementation and Simplification', dob: '1971-08-05', country: 'lv', rating: 88 },
    { name: 'Dubravka Šuica', title: 'Mediterranean', dob: '1957-05-20', country: 'hr', rating: 82 },
    { name: 'Olivér Várhelyi', title: 'Health and Animal Welfare', imageUrl: 'https://novaric.co/wp-content/uploads/2025/11/OliverVARHELY.png', dob: '1972-03-22', country: 'hu', rating: 79 },
    { name: 'Wopke Hoekstra', title: 'Climate, Net Zero and Clean Growth', dob: '1975-09-30', country: 'nl', rating: 86 },
    { name: 'Andrius Kubilius', title: 'Defence and Space', dob: '1956-12-08', country: 'lt', rating: 84 },
    { name: 'Marta Kos', title: 'Enlargement', dob: '1965-06-28', country: 'si', rating: 85 },
    { name: 'Jozef Síkela', title: 'International Partnerships', dob: '1967-06-17', country: 'cz', rating: 83 },
    { name: 'Costas Kadis', title: 'Fisheries and Oceans', dob: '1967-08-30', country: 'cy', rating: 81 },
    { name: 'Maria Luís Albuquerque', title: 'Financial Services and the Savings and Investments Union', dob: '1967-09-16', country: 'pt', rating: 87 },
    { name: 'Hadja Lahbib', title: 'Equality\nPreparedness and Crisis Management', dob: '1970-06-21', country: 'be', rating: 84 },
    { name: 'Magnus Brunner', title: 'Internal Affairs and Migration', dob: '1972-05-06', country: 'at', rating: 82 },
    { name: 'Jessika Roswall', title: 'Environment, Water Resilience and a Competitive Circular Economy', dob: '1972-12-18', country: 'se', rating: 86 },
    { name: 'Piotr Serafin', title: 'Budget, Anti-Fraud and Public Administration', dob: '1974-01-12', country: 'pl', rating: 85 },
    { name: 'Dan Jørgensen', title: 'Energy and Housing', imageUrl: 'https://novaric.co/wp-content/uploads/2025/11/DanJORGENSEN.png', dob: '1975-06-12', country: 'dk', rating: 87 },
    { name: 'Ekaterina Zaharieva', title: 'Startups, Research and Innovation', dob: '1975-08-08', country: 'bg', rating: 83 },
    { name: 'Michael McGrath', title: 'Democracy, Justice, the Rule of Law and Consumer Protection', imageUrl: 'https://novaric.co/wp-content/uploads/2025/11/MichaelMcGRATH.png', dob: '1976-06-10', country: 'ie', rating: 88 },
    { name: 'Apostolos Tzitzikostas', title: 'Sustainable Transport and Tourism', dob: '1978-09-02', country: 'gr', rating: 84 },
    { name: 'Christophe Hansen', title: 'Agriculture and Food', dob: '1982-09-21', country: 'lu', rating: 82 },
    { name: 'Glenn Micallef', title: 'Intergenerational Fairness, Youth, Culture and Sport', dob: '1989-07-30', country: 'mt', rating: 81 },
  ],
};

const calculateAge = (dobString: string): number => {
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const getZodiac = (dobString: string): { sign: ZodiacSign, icon: React.FC<{ className?: string }> } => {
    const date = new Date(dobString);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: 'Aries', icon: AriesIcon };
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: 'Taurus', icon: TaurusIcon };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: 'Gemini', icon: GeminiIcon };
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: 'Cancer', icon: CancerIcon };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: 'Leo', icon: LeoIcon };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: 'Virgo', icon: VirgoIcon };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: 'Libra', icon: LibraIcon };
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: 'Scorpio', icon: ScorpioIcon };
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: 'Sagittarius', icon: SagittariusIcon };
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: 'Capricorn', icon: CapricornIcon };
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: 'Aquarius', icon: AquariusIcon };
    // Pisces
    return { sign: 'Pisces', icon: PiscesIcon };
};

const generateImageUrl = (name: string): string => {
    const placeholderUrl = 'https://novaric.co/wp-content/uploads/2025/11/Placeholder.jpg';
    if (!name) return placeholderUrl;
    const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const parts = normalizedName.split(' ');
    if (parts.length === 0) return placeholderUrl;
    const lastName = parts.pop()?.toUpperCase() || '';
    const firstParts = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    const fileName = `${firstParts}${lastName}.png`;
    return `https://novaric.co/wp-content/uploads/2025/11/${fileName}`;
};


const Section: React.FC<{ title: string; children: React.ReactNode; fullWidth?: boolean }> = ({ title, children, fullWidth = false }) => (
  <section className="mb-10">
    <h2
      className="text-2xl font-normal text-white mb-6 pb-2 border-b-2 font-sans"
      style={{ borderColor: 'var(--eu-primary)' }}
    >
      {title}
    </h2>
    <div className={`grid grid-cols-1 ${fullWidth ? '' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
      {children}
    </div>
  </section>
);

const CommissionerCard: React.FC<{ commissioner: Commissioner }> = ({ commissioner }) => {
    const { name, title, imageUrl, dob, country, rating } = commissioner;
    const age = calculateAge(dob);
    const { sign, icon: ZodiacIcon } = getZodiac(dob);
    const flagUrl = `https://flagcdn.com/w40/${country}.png`;
    const formattedName = formatVipName(name);
    const isPresident = name === 'Ursula von der Leyen';

    return (
        <div className="relative flex items-center gap-4 bg-blue-900/60 p-4 rounded-lg border font-sans" style={{ borderColor: 'var(--eu-secondary)' }}>
            <img 
                src={flagUrl} 
                alt={`${country} flag`} 
                className="absolute top-2 left-2 w-6 rounded-sm shadow-md"
                title={country.toUpperCase()}
            />
            {!isPresident && (
                <span className="absolute top-2 right-2 font-bold text-2xl" style={{color: 'var(--eu-secondary)'}}>{rating}</span>
            )}
            <img 
                src={imageUrl || generateImageUrl(name)}
                alt={`Portrait of ${name}`}
                className="w-24 h-24 rounded-full object-cover bg-slate-700 flex-shrink-0"
                onError={(e) => { e.currentTarget.src = 'https://novaric.co/wp-content/uploads/2025/11/Placeholder.jpg'; }}
            />
            <div className="flex-grow">
                <div className="flex items-baseline gap-3">
                    <h3 className={`font-normal text-xl text-white font-sans ${!isPresident ? 'pr-10' : ''}`}>{formattedName}</h3>
                    {isPresident && (
                        <span className="font-bold text-2xl" style={{color: 'var(--eu-secondary)'}}>{rating}</span>
                    )}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                    <span>{age} vjeç</span>
                    <span className="flex items-center gap-1">
                        <ZodiacIcon className="w-4 h-4"/>
                        {sign}
                    </span>
                </div>
                {title && <p className="text-sm text-slate-300 leading-snug whitespace-pre-line mt-2">{title}</p>}
            </div>
        </div>
    );
};

export const EuropeanCommissionPage: React.FC<EuropeanCommissionPageProps> = ({ onBack }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 font-sans">
        <style>{`
            :root {
                --eu-primary: #0E47CB;
                --eu-secondary: #FBC02D;
            }
        `}</style>
      <div
        className="max-w-6xl mx-auto bg-blue-950/90 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-2xl border border-blue-800/50"
      >
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 font-semibold rounded-md shadow-sm transition text-white"
          >
            &larr; <span className="ml-2">Kthehu Pas</span>
          </button>
        </div>

        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-normal text-white mb-4 font-sans">
            College of Commissioners
          </h1>
          <p className="text-base text-slate-200 max-w-4xl leading-relaxed font-sans">
            The College is composed of Commissioners from 27 EU countries. Together, the 27 members of the College are the Commission's political leadership. They are led by the President of the Commission, who assigns portfolios to each Commissioner.
          </p>
        </header>
        
        <Section title="The President" fullWidth={true}>
          {commissionersData.president.map(c => <CommissionerCard key={c.name} commissioner={c} />)}
        </Section>
        
        <Section title="Executive Vice-Presidents and High Representative">
          {commissionersData.evpsAndHr.map(c => <CommissionerCard key={c.name} commissioner={c} />)}
        </Section>
        
        <Section title="Commissioners">
          {commissionersData.commissioners.map(c => <CommissionerCard key={c.name} commissioner={c} />)}
        </Section>
      </div>
    </main>
  );
};