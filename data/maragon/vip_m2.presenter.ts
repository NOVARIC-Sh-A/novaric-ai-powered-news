/* Grida DUMA on the standard MARAGON® v1.0 presenter template.
 * Assessment numbers are not stored here. The spider graph reads the live scoring file.
 * methodologyApproved stays false. The AM-09 record is in data/maragon/approvals.ts.
 */
import type { MaragonPresenterRecord } from '../../components/maragon/maragonPresenterTypes';
import { BROADCASTER_SOCIALS, buildUnassessedPresenter, photoLicence } from './presenterFactory';
import { OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT } from '../../utils/officialMediaPhoto';

const credit = OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT;

export const VIP_M2_PRESENTER: MaragonPresenterRecord = buildUnassessedPresenter({
  id: 'vip_m2',
  legacyId: 'vip2',
  givenName: 'Grida',
  familyName: 'Duma',
  roles: [
    { sq: 'Autore, moderatore dhe drejtuese', en: 'Author, moderator and host' },
  ],
  dateOfBirth: null,
  activityStatus: 'active',
  show: {
    name: 'Top Story',
    channel: 'Top Channel',
    category: 'Talk Show',
    slot_sq: null,
    slot_en: null,
    duration_sq: null,
    duration_en: null,
    onAirSince: null,
    onAirSinceYear: null,
    history_sq: 'Faqet e Top Channel të tërhequra më 18 nëntor 2026 e emërtojnë «Top Story» si emision politik dhe Grida DUMËN si autore, moderatore dhe drejtuese.',
    history_en: 'Top Channel pages retrieved on 18 November 2026 name Top Story as a political programme and Grida DUMA as its author, moderator and host.',
    segments: [],
    tenure: 'current',
  },
  bio: {
    sq: 'Biografia e plotë është në shqyrtim dhe shfaqet pas miratimit.',
    en: 'The full biography is under review and appears once approved.',
    short_sq: 'Autore, moderatore dhe drejtuese e «Top Story» në Top Channel.',
    short_en: 'Author, moderator and host of Top Story on Top Channel.',
    status: 'pending_review',
  },
  officialContact: null,
  broadcasterSocials: BROADCASTER_SOCIALS['Top Channel'],
  personalSocials: [],
  photo: {
    imageUrl: '/media-personalities/portraits/grida-duma-450x600.jpg',
    photoPending: false,
    photoStatus: 'Foto zyrtare / Official photo',
    credit,
    licence: credit,
    objectPosition: '50% 18%',
    officialSource: {
      sourceUrl: '/media-personalities/portraits/grida-duma-450x600.jpg',
      pageUrl: '',
      publisher: 'Owner',
      channelType: 'owner_supplied',
      credit,
      licence: credit,
      retrievedAt: '2026-11-22T20:02:00+01:00',
    },
    awaitingOwnerConfirmation: false,
    statusNote_sq: 'Portret i standardizuar i dhënë nga pronari më 22.11.2026. Burimi origjinal mbetet për t\'u regjistruar. Nuk ka prerje me sfond transparent.',
    statusNote_en: 'Owner-supplied standardised portrait, 22 Nov 2026. Original source still to be recorded. No transparent cut-out.',
    candidates: [],
  },
  documentsPhoto: photoLicence({
    sourcePageUrl: '/media-personalities/portraits/grida-duma-450x600.jpg',
    imageUrl: '/media-personalities/portraits/grida-duma-450x600.jpg',
    credit,
    status: 'recorded_official',
    status_sq: 'Portret i dhënë nga pronari, 22 nëntor 2026. Skedar lokal. Burimi origjinal mbetet për t\'u regjistruar.',
    status_en: 'Owner-supplied portrait, 22 Nov 2026. Local file. Original source still to be recorded.',
  }),
  sources: [],
  openItems_sq: ['Orari, kohëzgjatja dhe kontakti i redaksisë mbeten të paverifikuar.', 'E drejta e përgjigjes nuk është ofruar.'],
  openItems_en: ['Slot, duration and the desk contact remain unverified.', 'The right of reply has not been offered.'],
});

VIP_M2_PRESENTER.maragon.asOf = '2026-11-27';
VIP_M2_PRESENTER.maragon.assessmentStatus = 'not_assessed';
