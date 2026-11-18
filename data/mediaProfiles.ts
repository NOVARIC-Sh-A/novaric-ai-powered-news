import { VipProfile } from '../types';

export const mediaProfilesData: VipProfile[] = [
  {
    id: 'vip_m1',
    numericId: 1001,
    name: 'Blendi Fevziu',
    imageUrl: '',
    photoPending: true,
    photoStatus: 'candidate_recorded_no_documented_reuse_basis',
    category: 'Media',
    shortBio: 'Gazetar dhe drejtues i emisionit "Opinion".',
    detailedBio: 'Blendi Fevziu është një nga figurat më jetëgjata dhe me ndikim në median shqiptare...',
    /** Research dossier is not an approved biography or scoring run. */
    maragonAssessmentStatus: 'research_only',
    biographyStatus: 'draft',
    scoringSuspended: true,
    dynamicScore: 88,
    maragonAnalysis: [
      { dimension: 'Pajtueshmëria Etike', score: 85, peerAverage: 70, globalBenchmark: 80, description: '', commentary: '' },
      { dimension: 'Profesionalizmi në Kriza', score: 92, peerAverage: 75, globalBenchmark: 85, description: '', commentary: '' },
      { dimension: 'Saktësia Faktike & Verifikimi', score: 80, peerAverage: 65, globalBenchmark: 88, description: '', commentary: '' },
      { dimension: 'Paanshmëria, Balanca & Anshmëria', score: 75, peerAverage: 60, globalBenchmark: 90, description: '', commentary: '' },
      { dimension: 'Thellësia e Analizës/Pyetjeve', score: 95, peerAverage: 70, globalBenchmark: 85, description: '', commentary: '' },
      { dimension: 'Qartësia & Koherenca', score: 98, peerAverage: 75, globalBenchmark: 90, description: '', commentary: '' },
      { dimension: 'Promovimi i të Menduarit Kritik', score: 82, peerAverage: 68, globalBenchmark: 85, description: '', commentary: '' }
    ]
  },
  {
    id: 'vip_m2',
    numericId: 1002,
    slug: 'grida-duma',
    name: 'Grida Duma',
    imageUrl: 'https://kuvendiwebfiles.blob.core.windows.net/webfiles/gridashqina_foto.jpg',
    photo_source_url: 'https://kuvendiwebfiles.blob.core.windows.net/webfiles/gridashqina_foto.jpg',
    photoPending: false,
    photoStatus: 'Burimi i fotografisë: Në verifikim',
    photoLicence: null,
    category: 'Media',
    primaryRole: 'Autore, moderatore dhe drejtuese e emisionit «Top Story» në Top Channel',
    shortBio: 'Autore, moderatore dhe drejtuese e emisionit «Top Story» në Top Channel. Në të shkuarën ka qenë ish-deputete e Partisë Demokratike; Top Channel, më 5 gusht 2026, shkruan se mandatin e dorëzoi rreth katër vjet më parë. Draft kërkimor, jo biografi e miratuar.',
    detailedBio: 'Grida DUMA është autore, moderatore dhe drejtuese e emisionit «Top Story» në Top Channel. Ky është roli i saj aktual, sipas faqeve të Top Channel të tërhequra më 18 nëntor 2026. Karriera politike i përket së shkuarës: e njëjta faqe e 5 gushtit 2026 shkruan se rreth katër vjet më parë ajo dorëzoi mandatin. Regjistri i Kuvendit e ruan me status 2, i ndryshuar së fundi më 13 dhjetor 2022, dhe jo ndër 140 rekordet me status 0.\n\nGrida DUMA is the author, moderator and host of Top Story on Top Channel. That is her current role, according to Top Channel pages retrieved on 18 November 2026. Her political career is in the past: the same 5 August 2026 page says she gave up her mandate about four years earlier. The Assembly register still holds her at status 2, last modified on 13 December 2022, and not among the 140 records with status 0.',
    maragonAssessmentStatus: 'research_only',
    biographyStatus: 'draft',
    scoringSuspended: true,
    composite: null,
    dynamicScore: null,
  },
];
