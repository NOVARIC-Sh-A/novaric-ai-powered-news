
import { ParagonDimension, MaragonDimension } from '../types';

export const PARAGON_DIMENSIONS_AL: Record<string, string> = {
  'D1': 'Angazhimi Politik',
  'D2': 'Llogaridhënia',
  'D3': 'Përfaqësimi',
  'D4': 'Asertiviteti',
  'D5': 'Qeverisja',
  'D6': 'Kohësioni',
  'D7': 'Narrativa',
  'Angazhimi Politik': 'Angazhimi Politik',
  'Llogaridhënia': 'Llogaridhënia',
  'Përfaqësimi': 'Përfaqësimi',
  'Asertiviteti': 'Asertiviteti',
  'Qeverisja': 'Qeverisja',
  'Kohësioni': 'Kohësioni',
  'Narrativa': 'Narrativa',
};

export const MARAGON_DIMENSIONS_AL: { [key in MaragonDimension]: string } = {
  'Pajtueshmëria Etike': 'Pajtueshmëria Etike',
  'Profesionalizmi në Kriza': 'Profesionalizmi në Kriza',
  'Saktësia Faktike & Verifikimi': 'Saktësia Faktike & Verifikimi',
  'Paanshmëria, Balanca & Anshmëria': 'Paanshmëria, Balanca & Anshmëria',
  'Thellësia e Analizës/Pyetjeve': 'Thellësia e Analizës/Pyetjeve',
  'Qartësia & Koherenca': 'Qartësia & Koherenca',
  'Promovimi i të Menduarit Kritik': 'Promovimi i të Menduarit Kritik',
};

export const appTranslations = {
  sq: {
    common: {
      back: "Kthehu Pas",
      readMore: "Lexo më shumë",
      loading: "Duke ngarkuar...",
      error: "Ndodhi një gabim",
      home: "Kryefaqja",
      language: "Gjuha"
    },
    nav: {
      politicians: "Figurat Politike",
      judiciary: "Sistemi Gjyqësor",
      business: "Bota e Biznesit",
      media: "Personalitete Mediatike",
      parliament: "Parlamenti 2025",
      academy: "NOVARIC® Academy",
      journal: "NOVARIC® AI Journal",
      news: "Arkiva e Lajmeve",
      factCheck: "Mjeti i Verifikimit",
      methodology: "Metodologjia",
      leaderboard: "Renditja"
    },
    mediaPage: {
        scannerTitle: 'SKANER',
        systemStatus: 'STATUSI I SISTEMIT: ONLINE',
        tracking: 'SUBJEKTE NË GJURMIM',
        returnRoot: 'KTHEHU NË BAZË',
        sort: 'RENDITJA:',
        class: 'KATEGORIA:',
        noSubjects: 'NUK U GJET ASNJË SUBJEKT',
        adjustFilters: 'Rregulloni parametrat e filtrimit.',
        compare: 'KRAHASO',
        sortOptions: {
            influence: 'Indeksi i Ndikimit',
            maragon: 'Pikët Paragon',
            name: 'Alfabetike'
        },
        classOptions: {
            all: 'Të Gjitha',
            analyst: 'Analisti',
            moderator: 'Moderatori',
            communicator: 'Komunikatori',
            watchdog: 'Roja Publik'
        },
        card: {
            maragonScore: 'PIKËT MARAGON®',
            rating: 'AUDIENCA',
            compare: 'KRAHASO',
            analyze: 'ANALIZO',
            analysis: 'ANALIZA',
            deepScan: 'SKANIM I THELLË',
            ideal: 'Gazetari Ideal',
            actual: 'Pikët Aktuale',
            age: 'MOSHA',
            zodiac: 'SHENJA',
            fallacies: 'SHTREMBËRIMET LOGJIKE',
            socialToxicity: 'TOKSICITETI SOCIAL',
            fullDossier: 'DOSJA E PLOTË',
             archetypes: {
                'Analisti': 'ANALISTI',
                'Moderatori': 'MODERATORI',
                'Komunikatori': 'KOMUNIKATORI',
                'Roja Publik': 'ROJA PUBLIK',
                'I Paidentifikuar': 'PAKLASIFIKUAR'
            }
        }
    }
  },
  en: {
    common: {
      back: "Go Back",
      readMore: "Read More",
      loading: "Loading...",
      error: "An error occurred",
      home: "Home",
      language: "Language"
    },
    nav: {
      politicians: "Political Figures",
      judiciary: "Judiciary System",
      business: "Business World",
      media: "Media Personalities",
      parliament: "Parliament 2025",
      academy: "NOVARIC® Academy",
      journal: "NOVARIC® AI Journal",
      news: "News Archive",
      factCheck: "Fact Check Tool",
      methodology: "Methodology",
      leaderboard: "Leaderboard"
    },
     mediaPage: {
        scannerTitle: 'SCANNER',
        systemStatus: 'SYSTEM STATUS: ONLINE',
        tracking: 'TRACKING',
        returnRoot: 'RETURN TO BASE',
        sort: 'SORT:',
        class: 'CLASS:',
        noSubjects: 'NO SUBJECTS FOUND',
        adjustFilters: 'Adjust filtering parameters.',
        compare: 'COMPARE',
        sortOptions: {
            influence: 'Influence Index',
            maragon: 'Paragon Score',
            name: 'Alpha'
        },
        classOptions: {
            all: 'All',
            analyst: 'Analyst',
            moderator: 'Moderator',
            communicator: 'Communicator',
            watchdog: 'Watchdog'
        },
        card: {
            maragonScore: 'MARAGON® SCORE',
            rating: 'AUDIENCE',
            compare: 'COMPARE',
            analyze: 'ANALYZE',
            analysis: 'ANALYSIS',
            deepScan: 'DEEP SCAN',
            ideal: 'Ideal Journalist',
            actual: 'Actual Score',
            age: 'AGE',
            zodiac: 'ZODIAC',
            fallacies: 'LOGICAL FALLACIES',
            socialToxicity: 'SOCIAL TOXICITY',
            fullDossier: 'FULL DOSSIER',
            archetypes: {
                'Analisti': 'ANALYST',
                'Moderatori': 'MODERATOR',
                'Komunikatori': 'COMMUNICATOR',
                'Roja Publik': 'WATCHDOG',
                'I Paidentifikuar': 'UNKNOWN'
            }
        }
    }
  }
};
