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
    primaryRole: 'Moderatore dhe autore e emisionit Top Story, Top Channel',
    shortBio: 'Moderatore dhe autore e emisionit «Top Story» në Top Channel. Më parë deputete e Partisë Demokratike. Draft kërkimor, jo biografi e miratuar.',
    detailedBio: 'Grida DUMA është moderatore dhe autore e emisionit «Top Story» në Top Channel, sipas faqeve të Top Channel të tërhequra më 18 nëntor 2026. Një shkrim i 5 gushtit 2026 thotë se katër vjet më parë ajo dorëzoi mandatin për të marrë këtë detyrë. Regjistri i Kuvendit e liston me status 2, i ndryshuar së fundi më 13 dhjetor 2022.\n\nGrida DUMA is the moderator and author of Top Story on Top Channel, according to Top Channel pages retrieved on 18 November 2026. A 5 August 2026 article says that four years earlier she gave up her mandate to take that role. The Assembly register lists her with status 2, last modified on 13 December 2022.',
    maragonAssessmentStatus: 'research_only',
    biographyStatus: 'draft',
    scoringSuspended: true,
    composite: null,
    dynamicScore: null,
  },
];
