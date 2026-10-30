// FIX: Removed local interface definition and imported from central types file.
import { TvShowData } from '../types';

export const mockTvShows: TvShowData[] = [
  { 
    id: 1, 
    name: "Opinion", 
    channel: "TV Klan",
    logoUrl: 'https://novaric.co/wp-content/uploads/2025/11/Opinion_Albanian_TV_program_logo.jpeg',
    description: "Një nga emisionet politike më jetëgjata dhe me ndikim në Shqipëri, ku trajtohen çështjet më të nxehta të aktualitetit me të ftuar nga politika, gazetaria dhe shoqëria civile.",
    host: "Blendi Fevziu",
    commonTopics: ["Debat Politik", "Analiza Sociale", "Intervista Ekskluzive", "Aktualitet"],
    statistics: {
      audienceImpact: 85,
      informationCredibility: 70,
      discussionQuality: 75,
    },
    maragonSummary: {
        Readiness: 90,
        Aptitude: 85,
        Governance: 80,
        OversightNurturing: 82
    }
  },
  { 
    id: 2, 
    name: "Top Story", 
    channel: "Top Channel", 
    logoUrl: 'https://novaric.co/wp-content/uploads/2025/11/TopStory.jpg',
    description: "Emision investigativ që thellohet në dosje të bujshme, afera korruptive dhe ngjarje të rënda kriminale, duke sjellë fakte dhe dëshmi ekskluzive.",
    host: "Grida Duma",
    commonTopics: ["Gazetari Investigative", "Çështje Korrupsioni", "Krim i Organizuar", "Politikë"],
    statistics: {
      audienceImpact: 80,
      informationCredibility: 85,
      discussionQuality: 70,
    }
  },
  { 
    id: 3, 
    name: "Të Paekspozuarit", 
    channel: "MCN TV",
    logoUrl: 'https://novaric.co/wp-content/uploads/2025/11/TPaEks.jpg',
    description: "Një emision debati me qasje kritike dhe shpeshherë pa kompromis ndaj pushtetit, duke u fokusuar në analiza të thelluara politike dhe sociale.",
    host: "Ylli Rakipi",
    commonTopics: ["Kritikë Politike", "Analiza Ekonomike", "Çështje Sociale", "Qeverisja"],
     statistics: {
      audienceImpact: 70,
      informationCredibility: 75,
      discussionQuality: 80,
    }
  },
  { 
    id: 4, 
    name: "Real Story", 
    channel: "ABC News",
    logoUrl: 'https://novaric.co/wp-content/uploads/2025/11/real-story-abc-2.jpg',
    description: "Emision informativ dhe analitik që i qaset aktualitetit politik dhe social përmes intervistave me protagonistët kryesorë dhe analizave nga ekspertë të fushës.",
    host: "Sokol Balla",
    commonTopics: ["Analizë Politike", "Intervista", "Zhvillime Ekonomike", "Rajoni"],
     statistics: {
      audienceImpact: 72,
      informationCredibility: 68,
      discussionQuality: 78,
    }
  },
  { 
    id: 5, 
    name: "Open", 
    channel: "Top Channel", 
    logoUrl: 'https://novaric.co/wp-content/uploads/2025/11/Open.jpg',
    description: "Një arenë debati ku përplasen ide dhe qëndrime mbi çështjet më të rëndësishme të javës, duke sjellë në studio zëra të ndryshëm të jetës publike.",
    host: "Eni Vasili",
    commonTopics: ["Debat Publik", "Konfrontim Politik", "Çështje Ligjore", "Fenomene Sociale"],
     statistics: {
      audienceImpact: 78,
      informationCredibility: 72,
      discussionQuality: 85,
    }
  },
];