/**
 * Shared MARAGON® v1.0 scaffolding for media personalities who have not been scored.
 * Official bands, indicative bands and the composite stay null. Status is not_assessed.
 * Documents follow the same template as vip_m1 (methodology notes, photo licence, audit trail).
 * DRAFT — not approved — not for publication. No scoring was requested for these profiles.
 */
import type {
  MaragonMethodologyNotes,
  MaragonPhotoLicenceRecord,
  MaragonPresenterDocuments,
  MaragonPresenterIndicator,
  MaragonPresenterRecord,
  MaragonProvisionalBand,
  MaragonSourceRef,
} from '../../components/maragon/maragonPresenterTypes';

export const METHODOLOGY_ID = 'STD-COM-MARAGON-METHODOLOGY-v1.0-20261121';
export const METHODOLOGY_SIGNED_AT = '21.11.2026, 17:43 (Europe/Tirane)';
export const METHODOLOGY_SIGNED_BY = 'Dr Alban Gj. THIKA';
export const AS_OF = '2026-11-21';

const INDICATOR_DEFS: Array<Pick<MaragonPresenterIndicator, 'id' | 'code' | 'pillar' | 'appliedVariant' | 'title_sq' | 'title_en'>> = [
  { id: 'maragon:R1.1', code: 'R1.1', pillar: 'R', appliedVariant: 'R1.1 (programmes led by the subject; AM-08: AMA has jurisdiction)', title_sq: 'Pajtueshmëria Rregullatore', title_en: 'Regulatory Compliance' },
  { id: 'maragon:R1.2', code: 'R1.2', pillar: 'R', title_sq: 'Pajtueshmëria Etike', title_en: 'Ethical Compliance' },
  { id: 'maragon:A2.1', code: 'A2.1', pillar: 'A', title_sq: 'Saktësia Faktike', title_en: 'Factual Accuracy' },
  { id: 'maragon:A2.2', code: 'ind:A2.2', pillar: 'A', appliedVariant: 'ind:A2.2 (individual)', title_sq: 'Paanshmëria & Anshmëria (Individët)', title_en: 'Impartiality & Bias (Individuals)' },
  { id: 'maragon:A2.3', code: 'ind:A2.3', pillar: 'A', appliedVariant: 'ind:A2.3 (individual)', title_sq: 'Thellësia e Analizës (Individët)', title_en: 'Depth of Analysis (Individuals)' },
  { id: 'maragon:A2.4', code: 'A2.4', pillar: 'A', title_sq: 'Kontekstualizimi', title_en: 'Contextualisation' },
  { id: 'maragon:G3.1', code: 'G3.1-I', pillar: 'G', appliedVariant: 'G3.1-I', title_sq: 'Deklarimi i përkatësive dhe financimit (G3.1-I)', title_en: 'Affiliation and funding disclosure (G3.1-I)' },
  { id: 'maragon:G3.2', code: 'G3.2', pillar: 'G', title_sq: 'Kontrolli Editorial', title_en: 'Editorial Control' },
  { id: 'maragon:O4.1', code: 'ind:O4.1', pillar: 'O', appliedVariant: 'ind:O4.1 (individual)', title_sq: 'Promovimi i të Menduarit Kritik (Individët)', title_en: 'Promoting Critical Thinking (Individuals)' },
  { id: 'maragon:O4.2', code: 'O4.2', pillar: 'O', title_sq: 'Kontributi në Diskursin Demokratik', title_en: 'Contribution to Democratic Discourse' },
];

export const NULL_PROVISIONAL: MaragonProvisionalBand = {
  band: null,
  label: 'PROVIZOR',
  reviewLabel_sq: 'PROVIZOR · në shqyrtim',
  reviewLabel_en: 'PROVISIONAL · under review',
  confidence: 'none',
  evidenceIds: [],
  notOfficialReason_sq: 'Nuk është kërkuar vlerësim për këtë profil; të dhjetë treguesit mbeten pa vlerësim derisa të ketë mostër S1 sipas §6.4 dhe miratim me shkrim.',
  notOfficialReason_en: 'No scoring was requested for this profile; all ten indicators stay not assessed until an S1 sample under §6.4 and written approval exist.',
};

export function unassessedIndicators(): MaragonPresenterIndicator[] {
  return INDICATOR_DEFS.map((d) => ({
    ...d,
    status: 'not_assessed',
    officialBand: null,
    indicativeBand: null,
    provisional: { ...NULL_PROVISIONAL },
    confidence: 'none',
    evidenceCount: 0,
    finding_sq: 'Nuk është kërkuar vlerësim. Nuk ka mostër S1 dhe nuk është caktuar brez (zyrtar apo indikativ).',
    finding_en: 'No scoring was requested. There is no S1 sample and no official or indicative band is assigned.',
    pathToOfficial_sq: 'Mostër e rastit S1 sipas §6.4 (≥ 12 emisione javore / ≥ 20 ditore; rregulli i raportuar i 19.11.2026 për 20 emisione pret konfirmim me shkrim), kodim, e drejta e përgjigjes (§12) dhe shqyrtim me shkrim nga Dr Alban Gj. THIKA.',
    pathToOfficial_en: 'A random S1 sample under §6.4 (≥ 12 weekly / ≥ 20 daily episodes; the reported 19.11.2026 20-episode rule awaits written confirmation), coding, the right of reply (§12) and written review by Dr Alban Gj. THIKA.',
    flags: ['not_assessed', 'no_scoring_requested'],
  }));
}

export function methodologyNotes(): MaragonMethodologyNotes {
  return {
    methodologyId: METHODOLOGY_ID,
    signedAt: METHODOLOGY_SIGNED_AT,
    signedBy: METHODOLOGY_SIGNED_BY,
    focus_sq: 'MARAGON® v1.0 vlerëson prezantuesit individualë; programet vlerësohen veçmas.',
    focus_en: 'MARAGON® v1.0 scores individual presenters; programmes are scored separately.',
    sampleRule_sq: 'Për brez në treguesit e mostrës duhet mostra S1 e §6.4: ≥ 12 emisione javore ose ≥ 20 ditore, në ≥ 6 muaj brenda 18 muajve, me seed; për prezantues pa seri S1-I (AM-06). Rregulli i raportuar i 19.11.2026 për 20 emisione pret konfirmim me shkrim. Pa mostër treguesi mbetet Pa vlerësim.',
    sampleRule_en: 'A band on sample-based indicators needs the §6.4 S1 sample: ≥ 12 weekly or ≥ 20 daily episodes over ≥ 6 months within 18 months, with a recorded seed; S1-I for presenters without a series (AM-06). The reported 19.11.2026 20-episode rule awaits written confirmation. Without the sample the indicator stays Not assessed.',
    nullableScoring_sq: 'E panjohura është null dhe shfaqet «Pa vlerësim / Not assessed». Nuk shfaqen numra.',
    nullableScoring_en: 'Unknown is null and displays “Pa vlerësim / Not assessed”. Numbers are not shown.',
    bandsOnly_sq: 'Dalja publike janë brezat, kurrë numrat. Brezat indikativë kërkojnë etiketën «PROVIZOR — në pritje të miratimit» dhe miratim me shkrim të profilit (AM-09).',
    bandsOnly_en: 'Public output is bands, never numbers. Indicative bands need the label “PROVISIONAL — pending sign-off” and written approval of the profile (AM-09).',
    rightOfReply_sq: 'E drejta e përgjigjes kërkohet para botimit: 10 ditë pune, +5 ditë pune me kërkesë të arsyetuar (§12.3). Subjektet nuk kontaktohen pa autorizim.',
    rightOfReply_en: 'A right of reply is required before publishing: 10 working days, +5 working days on a reasoned request (§12.3). Subjects are not contacted without authorisation.',
  };
}

export function photoLicence(args: {
  sourcePageUrl: string;
  imageUrl: string;
  credit: string;
  status: MaragonPhotoLicenceRecord['status'];
  status_sq: string;
  status_en: string;
}): MaragonPhotoLicenceRecord {
  return {
    sourcePageUrl: args.sourcePageUrl,
    imageUrl: args.imageUrl,
    credit: args.credit,
    writtenReuseLicence: false,
    linkedByUrl: false,
    precedent_sq: 'Portret i standardizuar i dhënë nga pronari më 22.11.2026 dhe i vendosur si skedar lokal nën /media-personalities/portraits/. Nuk është lidhje e nxehtë dhe nuk vjen nga media.novaric.al. Burimi origjinal mbetet për t\'u regjistruar. Kjo është rregull fotoje, jo ndryshim vlerësimi.',
    precedent_en: 'Owner-supplied standardised portrait of 22 Nov 2026, stored as a local file under /media-personalities/portraits/. It is not a hotlink and it does not come from media.novaric.al. The original source is still to be recorded. This is a photo rule, not an assessment change.',
    status: args.status,
    status_sq: args.status_sq,
    status_en: args.status_en,
  };
}

export function documentsFor(args: {
  photo: MaragonPhotoLicenceRecord;
  id: string;
  nameSurname: string;
}): MaragonPresenterDocuments {
  return {
    methodologyNotes: methodologyNotes(),
    photoLicence: args.photo,
    auditTrail: [
      {
        at: '21.11.2026, 20:43 (Europe/Tirane)',
        act_sq: `U krijua dosja ${args.id} për ${args.nameSurname} nga burime zyrtare/të verifikueshme. Nuk u kërkua vlerësim; të dhjetë treguesit janë «Pa vlerësim», statusi not_assessed. Nuk është botuar dhe nuk është vendosur në prodhim.`,
        act_en: `Record ${args.id} for ${args.nameSurname} was created from official or verifiable sources. No scoring was requested; all ten indicators are “Not assessed”, status not_assessed. Not published and not deployed.`,
      },
      {
        at: '22.11.2026, 20:02 (Europe/Tirane)',
        act_sq: `U vendos portreti i standardizuar i dhënë nga pronari për ${args.id} (${args.nameSurname}), skedar lokal 450×600 nën /media-personalities/portraits/. Burimi origjinal mbetet për t'u regjistruar. Nuk u ndryshua asnjë pikë, brez, kompozitë apo flamur botimi.`,
        act_en: `Owner-supplied standardised portrait applied for ${args.id} (${args.nameSurname}), local 450×600 file under /media-personalities/portraits/. Original source still to be recorded. No score, band, composite or publication flag was changed.`,
      },
    ],
  };
}

export const BROADCASTER_SOCIALS: Record<string, MaragonPresenterRecord['broadcasterSocials']> = {
  'TV Klan': [
    { platform: 'facebook', url: 'https://www.facebook.com/tvklan/', label: 'TV Klan · Facebook', sourceId: 'EV-SOC' },
    { platform: 'instagram', url: 'https://www.instagram.com/rtvklan/', label: 'TV Klan · Instagram', sourceId: 'EV-SOC' },
    { platform: 'x', url: 'https://twitter.com/rtvklan', label: 'TV Klan · X', sourceId: 'EV-SOC' },
    { platform: 'youtube', url: 'https://www.youtube.com/user/televizioniKLAN', label: 'TV Klan · YouTube', sourceId: 'EV-SOC' },
  ],
  'Top Channel': [
    { platform: 'facebook', url: 'https://www.facebook.com/topchannel', label: 'Top Channel · Facebook', sourceId: 'EV-SOC' },
    { platform: 'instagram', url: 'https://www.instagram.com/topchannelalbania/', label: 'Top Channel · Instagram', sourceId: 'EV-SOC' },
    { platform: 'x', url: 'https://twitter.com/topchanneltv', label: 'Top Channel · X', sourceId: 'EV-SOC' },
    { platform: 'youtube', url: 'https://www.youtube.com/user/TopChannelAlbania', label: 'Top Channel · YouTube', sourceId: 'EV-SOC' },
  ],
  'Vizion Plus': [
    { platform: 'facebook', url: 'https://www.facebook.com/vizionplustv/', label: 'Vizion Plus · Facebook', sourceId: 'EV-SOC' },
    { platform: 'instagram', url: 'https://www.instagram.com/vizionplustv/', label: 'Vizion Plus · Instagram', sourceId: 'EV-SOC' },
    { platform: 'youtube', url: 'https://www.youtube.com/@VizionPlusAlbania', label: 'Vizion Plus · YouTube', sourceId: 'EV-SOC' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/company/vizion-plus/', label: 'Vizion Plus · LinkedIn', sourceId: 'EV-SOC' },
  ],
};

export function baseMaragon(id: string, open_sq: string[], open_en: string[]): MaragonPresenterRecord['maragon'] {
  return {
    methodology: METHODOLOGY_ID,
    methodologyVersion: 'v1.0',
    methodologyApproved: false,
    assessmentStatus: 'not_assessed',
    authorizedForPublicDisplay: false,
    am09ProvisionalApprovedInWriting: false,
    scoringSuspended: true,
    rightOfReply: 'not_offered',
    composite: null,
    dimensions: { R: null, A: null, G: null, O: null },
    asOf: AS_OF,
    dossierId: `DOS-COM-MARAGON-${id}-v0.1-20261121`,
    statusNote_sq: 'Nuk është kërkuar vlerësim. Të dhjetë treguesit: Pa vlerësim. Nuk ka brez zyrtar, as indikativ, as vlerësim të përgjithshëm. Draft për shqyrtim, jo për botim.',
    statusNote_en: 'No scoring was requested. All ten indicators: Not assessed. No official band, no indicative band, no composite. Draft for review, not for publication.',
    approvalAct_sq: 'Miratimi me shkrim i Dr Alban Gj. THIKA kërkohet para çdo shfaqjeje publike të vlerësimit ose të brezave PROVIZOR.',
    approvalAct_en: 'Written approval by Dr Alban Gj. THIKA is required before any public display of an assessment or of PROVISIONAL bands.',
    indicators: unassessedIndicators(),
    openItems_sq: open_sq,
    openItems_en: open_en,
  };
}

export function evSoc(channel: string): MaragonSourceRef {
  const pages: Record<string, string> = {
    'TV Klan': 'https://tvklan.al/',
    'Top Channel': 'https://top-channel.tv/',
    'Vizion Plus': 'https://www.vizionplus.tv/',
  };
  return {
    id: 'EV-SOC',
    label: `Llogaritë zyrtare të transmetuesit — ${channel}`,
    publisher: channel,
    url: pages[channel] || '',
    accessed: AS_OF,
    usedFor: 'Broadcaster official social accounts (site footer / official pages)',
  };
}

export interface UnassessedPresenterInput {
  id: string;
  legacyId: string;
  givenName: string;
  familyName: string;
  roles: { sq: string; en: string }[];
  dateOfBirth: string | null;
  activityStatus: 'active' | 'inactive' | 'unknown';
  activityNote_sq?: string;
  activityNote_en?: string;
  show: MaragonPresenterRecord['show'];
  bio: MaragonPresenterRecord['bio'];
  officialContact: MaragonPresenterRecord['officialContact'];
  broadcasterSocials: MaragonPresenterRecord['broadcasterSocials'];
  personalSocials: MaragonPresenterRecord['personalSocials'];
  photo: MaragonPresenterRecord['photo'];
  documentsPhoto: MaragonPhotoLicenceRecord;
  sources: MaragonSourceRef[];
  openItems_sq: string[];
  openItems_en: string[];
}

export function buildUnassessedPresenter(input: UnassessedPresenterInput): MaragonPresenterRecord {
  const nameSurname = `${input.givenName} ${input.familyName.toLocaleUpperCase('sq')}`;
  return {
    id: input.id,
    givenName: input.givenName,
    familyName: input.familyName,
    roles: input.roles,
    dateOfBirth: input.dateOfBirth,
    legacyId: input.legacyId,
    activityStatus: input.activityStatus,
    activityNote_sq: input.activityNote_sq,
    activityNote_en: input.activityNote_en,
    show: input.show,
    bio: input.bio,
    officialContact: input.officialContact,
    broadcasterSocials: input.broadcasterSocials,
    personalSocials: input.personalSocials,
    photo: input.photo,
    maragon: baseMaragon(input.id, input.openItems_sq, input.openItems_en),
    documents: documentsFor({ photo: input.documentsPhoto, id: input.id, nameSurname }),
    sources: input.sources,
  };
}
