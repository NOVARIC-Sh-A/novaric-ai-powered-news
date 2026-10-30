
import React, { useMemo, ReactNode, useState } from 'react';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { RadarChart } from './RadarChart';

interface ShkoderShockTherapyArticleProps {
  onBack: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
}
const extractText = (children: ReactNode): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join(' ');
  if (React.isValidElement<{ children?: ReactNode }>(children) && children.props.children) {
    return extractText(children.props.children);
  }
  return '';
};
// --- Translations ---
const contentMap = {
  sq: {
    pageTitle: "Terapia e Shokut në Shkodër | Analizë | NOVARIC®",
    pageDescription: "Një analizë e thelluar e transformimit agresiv të Shkodrës: A mund të ngrihet 'Gjeneva e Ballkanit' mes klasave të zbrazëta dhe hijeve të dosjes 'Metamorfoza'?",
    headerTitle: "Terapia e Shokut në Shkodër",
    headerSubtitle: "A mund të ngrihet 'Gjeneva e Ballkanit' mes klasave të zbrazëta dhe hijeve të 'Metamorfozës'?",
    pubDate: "Publikuar: 12 Dhjetor, 2025 | 00:00",
    location: "Shkodër, Shqipëri",
    toc: {
      intro: "Përmbledhje Ekzekutive",
      cynicism: "1. Kostoja e Cinizmit & Realiteti Ekonomik",
      urban: "2. Planifikimi Urban & Arkitektura",
      health: "3. Shëndeti & Jeta Aktive",
      social: "4. Sociologjia & Trashëgimia",
      economy: "5. Ekonomia & Zhvillimi",
      education: "6. Arsimi & Kapitali Njerëzor",
      security: "7. Siguria & Drejtësia",
      regional: "8. Konteksti Rajonal",
      refs: "Referencat"
    },
    sections: {
      intro: {
        title: "Përmbledhje Ekzekutive: Transformimi Agresiv",
        text1: "Ndjesia mbizotëruese në Shkodër sot është ajo e një \"Transformimi Agresiv\". Pas ndryshimit historik politik në zgjedhjet e vitit 2023 – kalimi nga një bastion 30-vjeçar demokrat te Partia Socialiste nën drejtimin e kryebashkiakut",
        text2: "– qyteti ka hyrë në një fazë të rregullimeve masive infrastrukturore të financuara nga shteti.",
        quote: "Humori i qytetit është një përzierje e shpresës për modernizim dhe rritje të turizmit, e balancuar nga ankthi lidhur me skandalet e dosjes \"Metamorfoza\" dhe zbrazjen e pamëshirshme të rinisë."
      },
      cynicism: {
        title: "1. Kostoja e Cinizmit: Pse 'Krenaria Shkodrane' Nuk Paguan Faturat",
        text1: "Për të mbyllur hendekun midis realitetit aktual të Shkodrës dhe standardit Evropian, auditimi ynë vlerëson një injeksion kapitali të detyrueshëm prej 715 Milionë Eurosh gjatë dekadës së ardhshme. Kjo shifër—veçanërisht 200 Milionë Eurot e nevojshme për rindërtimin e shëndetit publik—ka gjasa të ndeshet me refleksin karakteristik lokal të skepticizmit, mohimit, apo teorive konspirative, që shpesh përmblidhen me frazën \"S’bëhet ky vend\". Kjo kulturë e dyshimit kronik, ndonëse historikisht një mekanizëm mbrojtës ndaj politikës së dështuar, ka mutuar në një arrogancë toksike që refuzon të dhënat.",
        text2: "Argumenti se Shkodra mund të mbështetet te \"epërsia kulturore\" apo \"madhështia historike\" për të kompensuar kalbëzimin infrastrukturor është një iluzion i rrezikshëm. Kultura nuk sterilizon instrumentet kirurgjikale dhe historia nuk trajton ujërat e zeza. \"Arroganca e refuzimit\"—besimi se këto kosto janë të fryra ose të pamundura—bie në kundërshtim me kostot standarde operacionale të çdo qyteti të suksesshëm Evropian që kemi marrë si etalon. Për shembull, Vjena shpenzon rreth 5,000 Euro për frymë në vit për shërbime shëndetësore (Eurostat, 2023), ndërsa investimi efektiv në Shkodër është një fraksion i papërfillshëm i kësaj.",
        quote: "Matematika është binare: ose Shkodra pranon se është një projekt me deficit 700 Milionë Euro dhe lobon agresivisht për këtë 'Plan Marshall', ose mbetet një 'republikë kafeneje' që debaton gjeopolitikën botërore ndërkohë që spitalit të saj i mungojnë pajisjet bazë onkologjike.",
        analysisPoints: [
           { label: "Barriera Psikologjike", text: "Skepticizmi në Shkodër vepron si barrierë investimi. Kur aktorët lokalë besojnë se 'asgjë nuk ndryshon', ata dështojnë të përgatisin projektet teknike të kërkuara për fondet e BE-së (IPA III)." },
           { label: "Realiteti Ekonomik (Shëndetësia)", text: "Një spital rajonal modern me 400 shtretër kushton midis 1,500–2,500 € për metër katror. Për rajonin e Shkodrës (~200k banorë), kjo validon nevojën për 80-120 Milionë € vetëm për ndërtim (CAPEX)." },
           { label: "Krahasimi me Etalonin", text: "Mesatarja e shpenzimeve shëndetësore në BE është 10.9% e PBB-së. Shqipëria shpenzon rreth 2.9% (publike). Ky hendek masiv statistikor provon se 'kultura e dyshimit' është matematikisht e paarsimuar." }
        ]
      },
      urban: {
        title: "2. Planifikimi Urban: Ëndrra e 'Gjenevës' vs. Realiteti i Kantierit",
        newsFeel: "Ndjesia në Lajme:",
        newsFeelVal: "\"Pluhur dhe Devijime.\" Qytetarët shprehin shqetësime për betonizimin e zonave natyrore dhe vështirësitë logjistike nga kantieret e shumta.",
        status: "Statusi Aktual:",
        statusVal: "Një kantier ndërtimi i hapur. Projekti i Parkut të Bunës po rimodelon tërësisht vijën ujore, me synimin për të imituar promenadat evropiane.",
        forecast: "Parashikimi 10-Vjeçar:",
        forecastVal: "Estetika e \"Gjenevës së Ballkanit\". Shkodra do të ketë një vijë ujore luksoze, por ekziston rreziku real që",
        term: "gentrifikimi",
        def: "Procesi i rinovimit dhe përmirësimit të një lagjeje, shpesh duke çuar në rritjen e vlerave të pronave dhe zhvendosjen e banorëve me të ardhura më të ulëta.",
        end: "të largojë banorët vendas dhe tipologjia tradicionale e \"avllisë\" shkodrane të humbasë përballë hoteleve butik."
      },
      health: {
        title: "3. Shëndeti & Jeta Aktive: Paradoksi i Sportit",
        newsFeel: "Ndjesia në Lajme:",
        newsFeelVal: "\"Qyteti i Sportit.\" Ka një rritje të dukshme entuziazmi nga titulli \"Qyteti Evropian i Sportit 2024\".",
        status: "Statusi Aktual:",
        statusVal: "Paradoksal. Ndërsa promovohet sporti, rritja e trafikut e ka bërë kulturën historike të çiklizmit në Shkodër gjithnjë e më të rrezikshme.",
        forecast: "Parashikimi 10-Vjeçar:",
        forecastVal: "Beteja për Biçikletën. Shkodra ose do të zbatojë me rigorozitet",
        term: "SUMP",
        def: "Sustainable Urban Mobility Plan - Plani i Qëndrueshëm i Lëvizshmërisë Urbane, që prioritizon këmbësorët dhe transportin publik.",
        end: ", ose do t'i dorëzohet \"Sindromës së Tiranës\" me trafik të bllokuar përgjithmonë."
      },
      social: {
        title: "4. Sociologjia & Trashëgimia: Rreziku i 'Qytetit Muze'",
        newsFeel: "Ndjesia në Lajme:",
        newsFeelVal: "\"Kryeqytet Kulturor.\" Krenari e ligjshme për Marubin dhe harmoninë fetare.",
        status: "Statusi Aktual:",
        statusVal: "Kohezioni social është i tendosur nga emigrimi masiv; \"brezi i mesëm\" (mosha 25–40 vjeç) po mungon gjithnjë e më shumë në demografinë e qytetit.",
        forecast: "Parashikimi 10-Vjeçar:",
        forecastVal: "Kurthi i \"Qytetit Muze\". Shkodra do të jetë e bukur për t'u vizituar nga turistët, por rrezikon të mbetet pa një popullsi rezidente dinamike që i jep jetë."
      },
      economy: {
        title: "5. Economy: Sezonaliteti Vrasës",
        newsFeel: "Ndjesia në Lajme:",
        newsFeelVal: "\"Shpërthim Turistik.\" Optimizëm i lartë për Thethin, Valbonën dhe sektorin e shërbimeve.",
        status: "Statusi Aktual:",
        statusVal: "Sezonaliteti është vrasës—biznesi lulëzon në gusht dhe vuan rëndë në shkurt.",
        forecast: "Parashikimi 10-Vjeçar:",
        forecastVal: "Ekonomia Butik. Sukses si destinacion kulturor me vlerë të lartë, por me një hendek të thellë pasurie midis atyre që zotërojnë asete turistike dhe pjesës tjetër."
      },
      education: {
        title: "6. Education: The Empty Classroom Alarm",
        newsFeel: "Ndjesia në Lajme:",
        newsFeelVal: "\"Empty Classrooms.\" Critical alarm over low university enrollments.",
        status: "Statusi Aktual:",
        statusVal: "Krizë e",
        term: "Brain Drain",
        def: "Largimi masiv i individëve të arsimuar dhe të kualifikuar nga një vend drejt vendeve të tjera për kushte më të mira.",
        statusEnd: ". Arsimi profesional po përmirësohet pak, por elita intelektuale po tkurret me shpejtësi.",
        forecast: "Parashikimi 10-Vjeçar:",
        forecastVal: "Qendër Arsimore e Specializuar ose Dimër Intelektual. Universiteti duhet të fokusohet urgjentisht në turizëm dhe shërbime digjitale për të mbijetuar."
      },
      security: {
        title: "7. Security & Justice: Shadows of 'Metamorphosis'",
        newsFeel: "Ndjesia në Lajme:",
        newsFeelVal: "\"Metamorphosis & SPAK.\" Deep shock from files revealing close cooperation of high-level police with Bajri/Lici criminal clans.",
        status: "Current Status:",
        statusVal: "Fazë \"Pastrimi\" e drejtuar nga qeveria qendrore, kryesisht për të mbrojtur imazhin turistik dhe investimet.",
        forecast: "Parashikimi 10-Vjeçar:",
        forecastVal: "Stabiliteti i \"Pastruar\". Krimi i organizuar ka të ngjarë të kalojë në biznese të ligjshme (kryesisht ndërtim), duke krijuar rrugë fizikisht më të sigurta, por duke maskuar një korrupsion më të thellë ekonomik."
      },
      regional: {
        title: "8. Regional Context: Cross-Border Metropolis",
        newsFeel: "News Sentiment:",
        newsFeelVal: "\"The Connector.\" Increased focus on the railway with Montenegro.",
        status: "Current Status:",
        statusVal: "Shkodra is reconnecting with its historic Adriatic identity.",
        forecast: "10-Year Forecast:",
        forecastVal: "Cross-Border Metropolis. A functional economic merger with the Lake Skadar region in Montenegro, supported by EU funds."
      },
      refsTitle: "Evidence-Based References"
    },
    sources: [
        { id: 1, url: "https://www.fondishqiptarizhvillimit.gov.al/", text: "ADF (Albanian Development Fund) 2023-2024: Investment Reports.", credibility_industry_rating_pct: 95 },
        { id: 2, url: "https://spak.al/", text: "SPAK File 'Metamorphosis' (2023-2024): SkyECC Transcripts.", credibility_industry_rating_pct: 98 },
        { id: 3, url: "http://www.instat.gov.al/", text: "INSTAT CENSUS 2023: Demographic Data.", credibility_industry_rating_pct: 95 },
        { id: 4, url: "https://unishk.edu.al/", text: "University of Shkodër 'Luigj Gurakuqi': Enrollment Statistics.", credibility_industry_rating_pct: 90 },
        { id: 5, url: "https://aceseurope.eu/", text: "ACES Europe: 'European City of Sport 2024' Documentation.", credibility_industry_rating_pct: 92 },
        { id: 6, url: "https://www.wbif.eu/", text: "WBIF (Western Balkans Investment Framework): Vorë-Hani i Hotit Railway.", credibility_industry_rating_pct: 96 },
        { id: 7, url: "https://ec.europa.eu/eurostat", text: "Eurostat (2023). General Government Expenditure on Health by Member State.", credibility_industry_rating_pct: 98 }
    ]
  },
  en: {
    pageTitle: "Shkodra's Shock Therapy | Analysis | NOVARIC®",
    pageDescription: "A deep dive into Shkodra's aggressive transformation: Can the 'Balkan Geneva' rise amidst empty classrooms and the shadows of the 'Metamorphosis' file?",
    headerTitle: "Shkodra's Shock Therapy",
    headerSubtitle: "Can the 'Balkan Geneva' rise amidst empty classrooms and the shadows of 'Metamorphosis'?",
    pubDate: "Published: December 12, 2025 | 00:00",
    location: "Shkoder, Albania",
    toc: {
      intro: "Executive Summary",
      cynicism: "1. The Cost of Cynicism & Economic Reality",
      urban: "2. Urban Planning & Architecture",
      health: "3. Health & Active Life",
      social: "4. Sociology & Heritage",
      economy: "5. Economy & Development",
      education: "6. Education & Human Capital",
      security: "7. Security & Justice",
      regional: "8. Regional Context",
      refs: "References"
    },
    sections: {
      intro: {
        title: "Executive Summary: Aggressive Transformation",
        text1: "The prevailing feeling in Shkodra today is that of an 'Aggressive Transformation'. Following the historic political shift in the 2023 elections – switching from a 30-year Democratic stronghold to the Socialist Party under Mayor",
        text2: "– the city has entered a phase of massive state-funded infrastructural overhauls.",
        quote: "The city's mood is a mix of hope for modernization and tourism growth, balanced by anxiety regarding the 'Metamorphosis' file scandals and the relentless emptying of youth."
      },
      cynicism: {
        title: "1. The Cost of Cynicism: Why 'Shkodran Pride' Cannot Pay the Bills",
        text1: "To bridge the gap between Shkodra’s current reality and the European benchmark, our audit estimates a mandatory capital injection of €715 Million over the next decade. This figure—specifically the €200 Million required for public health reconstruction—will likely be met with the characteristic local reflex of skepticism, denial, or conspiracy theories often summarized by the phrase \"S’bëhet ky vend\" (This country cannot be made). This culture of chronic doubt, while historically a defense mechanism against failed politics, has mutated into a toxic arrogance that rejects data.",
        text2: "The argument that Shkodra can rely on its \"cultural superiority\" or \"historical grandeur\" to compensate for infrastructural decay is a dangerous delusion. Culture does not sterilize surgical instruments, and history does not treat wastewater. The \"arrogance of rejection\"—the belief that these cost estimates are inflated or impossible—contradicts the standard operational costs of every successful European city this study benchmarked. For instance, Vienna spends approximately €5,000 per capita annually on healthcare services (Eurostat, 2023), whereas the effective investment in Shkodra is a fraction of this.",
        quote: "The math is binary: either Shkodra accepts that it is a €700M deficit project and aggressively lobbies for this 'Marshall Plan,' or it remains a 'coffee-house republic' that debates global politics while its hospital lacks essential oncology equipment.",
        analysisPoints: [
           { label: "The Psychological Barrier", text: "Skepticism in Shkodra acts as a barrier to investment. When local stakeholders believe 'nothing changes,' they fail to prepare the technical projects required to apply for EU grants (IPA III funds)." },
           { label: "The Economic Reality", text: "A modern 400-bed regional hospital costs between €1,500–€2,500 per square meter to build and equip. For Shkodra (~200k people), this validates the €80M–€120M range for construction alone (CAPEX)." },
           { label: "The Benchmark Comparison", text: "EU average health spending is 10.9% of GDP. Albania spends approx 2.9% of GDP (public). This massive statistical gap proves that the 'culture of doubting the numbers' is mathematically illiterate." }
        ]
      },
      urban: {
        title: "2. Urban Planning: The Dream of 'Geneva' vs. Construction Site Reality",
        newsFeel: "News Sentiment:",
        newsFeelVal: "\"Dust and Detours.\" Citizens express concerns about the concreting of natural areas and logistical difficulties from numerous construction sites.",
        status: "Current Status:",
        statusVal: "An open construction site. The Buna Park project is completely reshaping the waterfront, aiming to mimic European promenades.",
        forecast: "10-Year Forecast:",
        forecastVal: "Aesthetics of the \"Balkan Geneva\". Shkodra will have a luxurious waterfront, but there is a real risk that",
        term: "gentrification",
        def: "The process of renovating and improving a district so that it conforms to middle-class taste, often displacing lower-income inhabitants.",
        end: "will drive out local residents and the traditional Shkodra \"courtyard\" typology will be lost to boutique hotels."
      },
      health: {
        title: "3. Health & Active Life: The Sports Paradox",
        newsFeel: "News Sentiment:",
        newsFeelVal: "\"City of Sport.\" There is a noticeable increase in enthusiasm from the title \"European City of Sport 2024\".",
        status: "Current Status:",
        statusVal: "Paradoxical. While sport is promoted, increased traffic has made Shkodra's historic cycling culture increasingly dangerous.",
        forecast: "10-Year Forecast:",
        forecastVal: "Battle for the Bicycle. Shkodra will either rigorously implement",
        term: "SUMP",
        def: "Sustainable Urban Mobility Plan - Prioritizing pedestrians and public transport.",
        end: ", or surrender to the \"Tirana Syndrome\" with permanently gridlocked traffic."
      },
      social: {
        title: "4. Sociology & Heritage: The Risk of the 'Museum City'",
        newsFeel: "News Sentiment:",
        newsFeelVal: "\"Cultural Capital.\" Legitimate pride for Marubi and religious harmony.",
        status: "Current Status:",
        statusVal: "Social cohesion is strained by mass emigration; the \"middle generation\" (ages 25–40) is increasingly missing from the city's demographics.",
        forecast: "10-Year Forecast:",
        forecastVal: "The \"Museum City\" Trap. Shkodra will be beautiful for tourists to visit, but risks being left without a dynamic resident population to give it life."
      },
      economy: {
        title: "5. Economy: Killer Seasonality",
        newsFeel: "News Sentiment:",
        newsFeelVal: "\"Tourism Boom.\" High optimism for Theth, Valbona, and the service sector.",
        status: "Current Status:",
        statusVal: "Seasonality is a killer—business booms in August and suffers severely in February.",
        forecast: "10-Year Forecast:",
        forecastVal: "Boutique Economy. Success as a high-value cultural destination, but with a deep wealth gap between those who own tourism assets and the rest."
      },
      education: {
        title: "6. Education: The Empty Classroom Alarm",
        newsFeel: "News Sentiment:",
        newsFeelVal: "\"Empty Classrooms.\" Critical alarm over low university enrollments.",
        status: "Current Status:",
        statusVal: "Crisis of",
        term: "Brain Drain",
        def: "The emigration of highly trained or intelligent people from a particular country.",
        statusEnd: ". Vocational education is improving slightly, but the intellectual elite is shrinking rapidly.",
        forecast: "10-Year Forecast:",
        forecastVal: "Specialized Education Hub or Intellectual Winter. The university must urgently focus on tourism and digital services to survive."
      },
      security: {
        title: "7. Security & Justice: Shadows of 'Metamorphosis'",
        newsFeel: "News Sentiment:",
        newsFeelVal: "\"Metamorphosis & SPAK.\" Deep shock from files revealing close cooperation of high-level police with Bajri/Lici criminal clans.",
        status: "Current Status:",
        statusVal: "\"Cleaning\" phase driven by central government, mainly to protect tourism image and investments.",
        forecast: "10-Year Forecast:",
        forecastVal: "Sanitized Stability. Organized crime is likely to shift into legitimate businesses (mainly construction), creating physically safer streets but masking deeper economic corruption."
      },
      regional: {
        title: "8. Regional Context: Cross-Border Metropolis",
        newsFeel: "News Sentiment:",
        newsFeelVal: "\"The Connector.\" Increased focus on the railway with Montenegro.",
        status: "Current Status:",
        statusVal: "Shkodra is reconnecting with its historic Adriatic identity.",
        forecast: "10-Year Forecast:",
        forecastVal: "Cross-Border Metropolis. A functional economic merger with the Lake Skadar region in Montenegro, supported by EU funds."
      },
      refsTitle: "Evidence-Based References"
    },
    sources: [
        { id: 1, url: "https://www.fondishqiptarizhvillimit.gov.al/", text: "ADF (Albanian Development Fund) 2023-2024: Investment Reports.", credibility_industry_rating_pct: 95 },
        { id: 2, url: "https://spak.al/", text: "SPAK File 'Metamorphosis' (2023-2024): SkyECC Transcripts.", credibility_industry_rating_pct: 98 },
        { id: 3, url: "http://www.instat.gov.al/", text: "INSTAT CENSUS 2023: Demographic Data.", credibility_industry_rating_pct: 95 },
        { id: 4, url: "https://unishk.edu.al/", text: "University of Shkodër 'Luigj Gurakuqi': Enrollment Statistics.", credibility_industry_rating_pct: 90 },
        { id: 5, url: "https://aceseurope.eu/", text: "ACES Europe: 'European City of Sport 2024' Documentation.", credibility_industry_rating_pct: 92 },
        { id: 6, url: "https://www.wbif.eu/", text: "WBIF (Western Balkans Investment Framework): Vorë-Hani i Hotit Railway.", credibility_industry_rating_pct: 96 },
        { id: 7, url: "https://ec.europa.eu/eurostat", text: "Eurostat (2023). General Government Expenditure on Health by Member State.", credibility_industry_rating_pct: 98 }
    ]
  }
};

export const ShkoderShockTherapyArticle: React.FC<ShkoderShockTherapyArticleProps> = (props) => {
    const { onBack, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;
    const [lang, setLang] = useState<'sq' | 'en'>('sq');
    const t = contentMap[lang];
    const keywords = ["Shkodër", "Benet Beci", "Metamorfoza", "SPAK", "Investime", "Turizëm", "Brain Drain", "Infrastrukturë", "NOVARIC"];
    const sourcesList = useMemo(() => t.sources, [t]);
    
    // Updated radarData with specific values from the image
    const radarData = useMemo(() => ({
        labels: [
            'Planifikimi Urban',
            'Shëndeti Publik',
            'Sociologjia & Harmonia',
            'Ekonomia & Zhvillimi',
            'Arsimi & Kapitali Njerëzor',
            'Siguria & Drejtësia',
            'Konteksti Rajonal'
        ],
        datasets: [
            {
                label: 'Standardi Evropian (Vjenë, Kopenhagë, Zyrih)',
                data: [100, 100, 100, 100, 100, 100, 100], // Represented as outer boundary/benchmark
                backgroundColor: 'rgba(0, 51, 153, 0.05)',
                borderColor: '#003399',
                borderWidth: 2,
                pointBackgroundColor: '#003399',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#003399'
            },
            {
                label: 'Vlerësimi i Nora (AI)',
                data: [45, 55, 85, 35, 40, 50, 60], // Values extracted from image
                backgroundColor: 'rgba(211, 47, 47, 0.2)',
                borderColor: 'rgba(211, 47, 47, 1)',
                borderWidth: 3,
                pointBackgroundColor: '#D32F2F',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#D32F2F'
            },
            {
                label: 'Vlerësimi i Dr. Alban',
                data: [25, 35, 40, 15, 10, 0, 30], // Values extracted from image
                backgroundColor: 'rgba(255, 235, 59, 0.2)',
                borderColor: '#FFEB3B',
                borderWidth: 3,
                pointBackgroundColor: '#FFEB3B',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#FFEB3B'
            }
        ]
    }), []);

    const articleContentJsx = useMemo(() => (
        <>
            <div className="flex justify-end mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button 
                        onClick={() => setLang('sq')}
                        className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${lang === 'sq' ? 'bg-white dark:bg-slate-600 text-primary-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                        SHQIP
                    </button>
                    <button 
                        onClick={() => setLang('en')}
                        className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-600 text-primary-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                        ENGLISH
                    </button>
                </div>
            </div>
            <div className="mb-12 p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h3 className="text-lg font-bold text-center text-slate-800 dark:text-slate-100 mb-6">
                    Auditimi i Ekosistemit: Shkodër vs. Evropa (Analiza e Hendekut 2025)
                </h3>
                <div className="w-full max-w-4xl mx-auto">
                     <RadarChart data={radarData} />
                </div>
                <p className="text-center text-xs text-slate-500 mt-4 italic">
                    Grafiku krahason performancën aktuale të Shkodrës (Vlerësimi i AI dhe i Ekspertit) me standardet e Bashkimit Evropian në 7 dimensione kyçe. Qytetet referente evropiane përfshijnë Vjenën (Planifikimi), Kopenhagën (Jeta Aktive), Zyrihun (Ekonomia) dhe Helsinkin (Arsimi & Besimi).
                </p>
            </div>
            <ArticleSection id="intro" title={t.sections.intro.title}>
                <p>{t.sections.intro.text1} <button onClick={() => onNavigateToVipProfile('mp19')} className="text-primary-600 hover:underline font-semibold">Benet Beci</button> {t.sections.intro.text2}</p>
                <PullQuote>{t.sections.intro.quote}</PullQuote>
            </ArticleSection>
            {/* NEW SECTION: COST OF CYNICISM */}
            <ArticleSection id="cynicism" title={t.sections.cynicism.title}>
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4 rounded-r-md">
                     <p className="font-bold text-red-800 dark:text-red-300">
                        Auditimi ynë vlerëson një injeksion kapitali të detyrueshëm prej 715 Milionë Eurosh gjatë dekadës së ardhshme.
                     </p>
                </div>
                <p className="mb-4">{t.sections.cynicism.text1}</p>
                <p className="mb-4">{t.sections.cynicism.text2}</p>
                
                {/* Specific Analysis Points */}
                <ul className="space-y-2 mb-6 ml-4 list-disc marker:text-primary-500">
                    {t.sections.cynicism.analysisPoints.map((point, i) => (
                        <li key={i}>
                            <strong>{point.label}:</strong> {point.text}
                        </li>
                    ))}
                </ul>
                <PullQuote>{t.sections.cynicism.quote}</PullQuote>
            </ArticleSection>
            <ArticleSection id="urban" title={t.sections.urban.title}>
                <p><strong>{t.sections.urban.newsFeel}</strong> {t.sections.urban.newsFeelVal}</p>
                <p><strong>{t.sections.urban.status}</strong> {t.sections.urban.statusVal}</p>
                <p><strong>{t.sections.urban.forecast}</strong> {t.sections.urban.forecastVal} <KeyConcept term={t.sections.urban.term} definition={t.sections.urban.def}/> {t.sections.urban.end}</p>
            </ArticleSection>
            <ArticleSection id="health" title={t.sections.health.title}>
                <p><strong>{t.sections.health.newsFeel}</strong> {t.sections.health.newsFeelVal}</p>
                <p><strong>{t.sections.health.status}</strong> {t.sections.health.statusVal}</p>
                <p><strong>{t.sections.health.forecast}</strong> {t.sections.health.forecastVal} <KeyConcept term={t.sections.health.term} definition={t.sections.health.def}/>{t.sections.health.end}</p>
            </ArticleSection>
            <ArticleSection id="social" title={t.sections.social.title}>
                <p><strong>{t.sections.social.newsFeel}</strong> {t.sections.social.newsFeelVal}</p>
                <p><strong>{t.sections.social.status}</strong> {t.sections.social.statusVal}</p>
                <p><strong>{t.sections.social.forecast}</strong> {t.sections.social.forecastVal}</p>
            </ArticleSection>
            <ArticleSection id="economy" title={t.sections.economy.title}>
                <p><strong>{t.sections.economy.newsFeel}</strong> {t.sections.economy.newsFeelVal}</p>
                <p><strong>{t.sections.economy.status}</strong> {t.sections.economy.statusVal}</p>
                <p><strong>{t.sections.economy.forecast}</strong> {t.sections.economy.forecastVal}</p>
            </ArticleSection>
            <ArticleSection id="education" title={t.sections.education.title}>
                <p><strong>{t.sections.education.newsFeel}</strong> {t.sections.education.newsFeelVal}</p>
                <p><strong>{t.sections.education.status}</strong> {t.sections.education.statusVal} <KeyConcept term={t.sections.education.term} definition={t.sections.education.def}/>{t.sections.education.statusEnd}</p>
                <p><strong>{t.sections.education.forecast}</strong> {t.sections.education.forecastVal}</p>
            </ArticleSection>
            <ArticleSection id="security" title={t.sections.security.title}>
                <p><strong>{t.sections.security.newsFeel}</strong> {t.sections.security.newsFeelVal}</p>
                <p><strong>{t.sections.security.status}</strong> {t.sections.security.statusVal}</p>
                <p><strong>{t.sections.security.forecast}</strong> {t.sections.security.forecastVal}</p>
            </ArticleSection>
             <ArticleSection id="regional" title={t.sections.regional.title}>
                <p><strong>{t.sections.regional.newsFeel}</strong> {t.sections.regional.newsFeelVal}</p>
                <p><strong>{t.sections.regional.status}</strong> {t.sections.regional.statusVal}</p>
                <p><strong>{t.sections.regional.forecast}</strong> {t.sections.regional.forecastVal}</p>
            </ArticleSection>
            <ArticleSection id="referencat" title={t.sections.refsTitle}>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {sourcesList.map((source) => (
                        <li key={source.id}>
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary-600 dark:text-primary-400">
                                {source.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </ArticleSection>
        </>
    ), [onNavigateToVipProfile, sourcesList, lang, t, radarData]);
    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText, 
            {
                url: window.location.href,
                published_at: "2025-12-12T00:00:00Z",
                article_id: 'shkoder-shock-therapy-01'
            }, 
            sourcesList,
            {
                researchHours: 65,
                focusKeyword: "Shkodër Transformimi"
            }
        );
    }, [fullArticleText, sourcesList]);
    const articleIntegrityProfile = useMemo((): ArticleIntegrityProfileData => {
        return calculateArticleIntegrityProfile(articleMetrics);
    }, [articleMetrics]);
    return (
        <ArticleTemplate1
            pageTitle={t.pageTitle}
            pageDescription={t.pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle={t.headerTitle}
            headerSubtitle={t.headerSubtitle}
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: t.pubDate,
                location: t.location
            }}
            tableOfContentsItems={[
                { id: "intro", title: t.toc.intro },
                { id: "cynicism", title: t.toc.cynicism },
                { id: "urban", title: t.toc.urban },
                { id: "health", title: t.toc.health },
                { id: "social", title: t.toc.social },
                { id: "economy", title: t.toc.economy },
                { id: "education", title: t.toc.education },
                { id: "security", title: t.toc.security },
                { id: "regional", title: t.toc.regional },
                { id: "referencat", title: t.toc.refs }
            ]}
            articleMetrics={articleMetrics}
            articleIntegrityProfile={articleIntegrityProfile}
            keywords={keywords}
            onBack={onBack}
            onNavigateToVipProfile={onNavigateToVipProfile}
            onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
        >
            {articleContentJsx}
        </ArticleTemplate1>
    );
};
