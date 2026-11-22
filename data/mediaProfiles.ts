import { VipProfile } from '../types';
import { VIP_M1_PRESENTER } from './maragon/vip_m1.presenter';
import { OTHER_PRESENTERS } from './maragon/mediaPresenters';
import type { MaragonPresenterRecord } from '../components/maragon/maragonPresenterTypes';
import { assignProfileSlugs } from '../utils/politicianSlug';
import { OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT, type OfficialMediaPhotoSource } from '../utils/officialMediaPhoto';

function ownerSuppliedPhoto(slug: string): OfficialMediaPhotoSource {
  const imageUrl = `/media-personalities/portraits/${slug}-450x600.jpg`;
  return {
    sourceUrl: imageUrl,
    pageUrl: '',
    publisher: 'Owner',
    channelType: 'owner_supplied',
    credit: OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT,
    licence: 'Owner-supplied local file. Original source to be recorded.',
    retrievedAt: '2026-11-22T20:02:00+01:00',
  };
}

/**
 * Media personalities (MARAGON®). Kept separate from PARAGON®.
 * vip_m1 keeps the stored research scores; the publication gate hides them.
 * vip_m2 is the live Grida DUMA record and is not rewritten here.
 * The other 22 presenters have no numeric score.
 */

const vipM1: VipProfile = {
  id: 'vip_m1',
  numericId: 1001,
  name: 'Blendi Fevziu',
  imageUrl: '/media-personalities/portraits/blendi-fevziu-450x600.jpg',
  photoPending: false,
  photoStatus: 'Foto zyrtare / Official photo',
  photoCredit: OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT,
  photoLicence: OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT,
  officialPhoto: ownerSuppliedPhoto('blendi-fevziu'),
  category: 'Media',
  primaryRole: 'Gazetar, shkrimtar dhe drejtues i emisionit «Opinion» në TV Klan',
  shortBio: 'Gazetar dhe drejtues i emisionit "Opinion".',
  detailedBio: 'Blendi Fevziu është një nga figurat më jetëgjata dhe me ndikim në median shqiptare...',
  /** Research dossier is not an approved biography or scoring run. */
  maragonAssessmentStatus: 'research_only',
  biographyStatus: 'draft',
  scoringSuspended: true,
  methodologyApproved: false,
  dynamicScore: 88,
  maragonAnalysis: [
    { dimension: 'Pajtueshmëria Etike', score: 85, peerAverage: 70, globalBenchmark: 80, description: '', commentary: '' },
    { dimension: 'Profesionalizmi në Kriza', score: 92, peerAverage: 75, globalBenchmark: 85, description: '', commentary: '' },
    { dimension: 'Saktësia Faktike & Verifikimi', score: 80, peerAverage: 65, globalBenchmark: 88, description: '', commentary: '' },
    { dimension: 'Paanshmëria, Balanca & Anshmëria', score: 75, peerAverage: 60, globalBenchmark: 90, description: '', commentary: '' },
    { dimension: 'Thellësia e Analizës/Pyetjeve', score: 95, peerAverage: 70, globalBenchmark: 85, description: '', commentary: '' },
    { dimension: 'Qartësia & Koherenca', score: 98, peerAverage: 75, globalBenchmark: 90, description: '', commentary: '' },
    { dimension: 'Promovimi i të Menduarit Kritik', score: 82, peerAverage: 68, globalBenchmark: 85, description: '', commentary: '' },
  ],
  maragonPresenter: VIP_M1_PRESENTER,
};

const vipM2: VipProfile = {
  id: 'vip_m2',
  numericId: 1002,
  slug: 'grida-duma',
  name: 'Grida Duma',
  imageUrl: '/media-personalities/portraits/grida-duma-450x600.jpg',
  photo_source_url: null,
  photoPending: false,
  photoStatus: 'Foto zyrtare / Official photo',
  photoCredit: OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT,
  photoLicence: OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT,
  officialPhoto: ownerSuppliedPhoto('grida-duma'),
  category: 'Media',
  primaryRole: 'Autore, moderatore dhe drejtuese e emisionit «Top Story» në Top Channel',
  shortBio: 'Autore, moderatore dhe drejtuese e emisionit «Top Story» në Top Channel. Në të shkuarën ka qenë ish-deputete e Partisë Demokratike; Top Channel, më 5 gusht 2026, shkruan se mandatin e dorëzoi rreth katër vjet më parë. Draft kërkimor, jo biografi e miratuar.',
  detailedBio: 'Grida DUMA është autore, moderatore dhe drejtuese e emisionit «Top Story» në Top Channel. Ky është roli i saj aktual, sipas faqeve të Top Channel të tërhequra më 18 nëntor 2026. Karriera politike i përket së shkuarës: e njëjta faqe e 5 gushtit 2026 shkruan se rreth katër vjet më parë ajo dorëzoi mandatin. Regjistri i Kuvendit e ruan me status 2, i ndryshuar së fundi më 13 dhjetor 2022, dhe jo ndër 140 rekordet me status 0.\n\nGrida DUMA is the author, moderator and host of Top Story on Top Channel. That is her current role, according to Top Channel pages retrieved on 18 November 2026. Her political career is in the past: the same 5 August 2026 page says she gave up her mandate about four years earlier. The Assembly register still holds her at status 2, last modified on 13 December 2022, and not among the 140 records with status 0.',
  maragonAssessmentStatus: 'research_only',
  biographyStatus: 'draft',
  scoringSuspended: true,
  composite: null,
  dynamicScore: null,
};

function formatNameSurname(given: string, family: string): string {
  return `${(given || '').trim()} ${(family || '').trim().toLocaleUpperCase('sq')}`.trim();
}

function toMediaVip(rec: MaragonPresenterRecord): VipProfile {
  const legacyNum = rec.legacyId ? parseInt(String(rec.legacyId).replace(/\D/g, ''), 10) : 0;
  return {
    id: rec.id,
    numericId: 1000 + (Number.isFinite(legacyNum) ? legacyNum : 0),
    name: formatNameSurname(rec.givenName, rec.familyName),
    imageUrl: rec.photo.imageUrl || '',
    photoPending: rec.photo.photoPending,
    photoStatus: rec.photo.photoStatus,
    photo_source_url: rec.photo.officialSource?.pageUrl ?? null,
    photoLicence: rec.photo.licence,
    photoCredit: rec.photo.credit,
    officialPhoto: rec.photo.officialSource ?? null,
    category: 'Media',
    primaryRole: rec.roles[0]?.sq || '',
    shortBio: rec.bio.short_sq,
    shortBio_en: rec.bio.short_en,
    detailedBio: rec.bio.sq,
    detailedBio_en: rec.bio.en,
    maragonAssessmentStatus: rec.maragon.assessmentStatus,
    biographyStatus: rec.bio.status,
    scoringSuspended: true,
    methodologyApproved: false,
    composite: null,
    legacyIds: rec.legacyId ? [rec.legacyId] : [],
    maragonPresenter: rec,
  } as VipProfile;
}

export const mediaProfilesData: VipProfile[] = [
  vipM1,
  vipM2,
  ...OTHER_PRESENTERS.map(toMediaVip),
];

const slugs = assignProfileSlugs(mediaProfilesData.map((profile) => ({
  id: String(profile.id),
  numericId: profile.numericId,
  name: profile.name,
})));

for (const profile of mediaProfilesData) {
  const slug = slugs.get(String(profile.id));
  if (slug) profile.slug = slug;
}
