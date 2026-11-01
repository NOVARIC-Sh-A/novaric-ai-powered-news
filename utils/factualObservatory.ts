import rollCalls from '../data/official/kuvendi_rollcall_scores.json';
import plenary from '../data/official/plenary_assertiveness.json';
import committees from '../data/official/committee_governance.json';

export const OBSERVATORY_METHODOLOGY_VERSION = 'methodology_v0.2_2026-11-01';
export const AWAITING_DATA = 'Në pritje të të dhënave / Awaiting data';
export const CALIBRATION_STATUS = 'Në kalibrim';

const ROLL_CATALOGUE = 'https://kuvendiapi.azurewebsites.net/api/dokumentet';
const ACTS_NOTE =
  'Aktet e Kuvendit emërtojnë kodin e propozuesit institucional, jo deputetin. [Acts name an institutional proposer code, not the member.]';

export interface FactualIndicator {
  id:
    | 'voting_participation'
    | 'plenary_presence'
    | 'committee_participation'
    | 'legislative_activity'
    | 'plenary_interventions';
  label: string;
  sourceClass: 'F';
  numerator: number | null;
  denominator: number | null;
  periodStart: string | null;
  periodEnd: string | null;
  sourceUrl: string | null;
  sourceTitle: string | null;
  verifiedAt: string | null;
  methodologyVersion: string;
  note: string | null;
}

export interface CalibrationDimension {
  key: string;
  label: string;
  score: null;
  status: typeof CALIBRATION_STATUS;
}

export interface FactualObservatoryReport {
  profileId: string;
  methodologyVersion: string;
  indicators: FactualIndicator[];
  dimensions: CalibrationDimension[];
}

type CountRecord = {
  rollcalls?: number;
  present?: number;
  participated?: number;
  meetings?: number;
  interventions?: number;
  sourceUrls?: string[];
};

const DIMENSIONS: Array<Omit<CalibrationDimension, 'score' | 'status'>> = [
  { key: 'D1', label: 'Angazhimi politik [Political engagement]' },
  { key: 'D2', label: 'Llogaridhënia [Accountability]' },
  { key: 'D3', label: 'Përfaqësimi [Representation]' },
  { key: 'D4', label: 'Asertiviteti [Constructive initiative]' },
  { key: 'D5', label: 'Qeverisja [Governance]' },
  { key: 'D6', label: 'Kohësioni [Cohesion]' },
  { key: 'D7', label: 'Narrativa [Factual communication]' },
];

function canonicalProfileId(raw: string | number | null | undefined): string {
  const text = String(raw ?? '').trim().toLowerCase();
  const digits = text.replace(/^vip/, '').replace(/^p-0*/, '');
  if (/^\d+$/.test(digits)) return `vip${Number(digits)}`;
  return text;
}

function people(file: { people?: Record<string, CountRecord> }): Record<string, CountRecord> {
  return file.people ?? {};
}

function firstUrl(record: CountRecord | undefined): string | null {
  const url = record?.sourceUrls?.find((item) => typeof item === 'string' && item.startsWith('http'));
  return url ?? null;
}

function measuredRatio(numerator: unknown, denominator: unknown): { numerator: number | null; denominator: number | null } {
  if (typeof numerator !== 'number' || typeof denominator !== 'number' || denominator <= 0) {
    return { numerator: null, denominator: null };
  }
  return { numerator, denominator };
}

function baseIndicator(partial: Omit<FactualIndicator, 'sourceClass' | 'methodologyVersion'>): FactualIndicator {
  return {
    ...partial,
    sourceClass: 'F',
    methodologyVersion: OBSERVATORY_METHODOLOGY_VERSION,
  };
}

export function buildFactualObservatory(profileId: string | number | null | undefined): FactualObservatoryReport {
  const id = canonicalProfileId(profileId);
  const roll = people(rollCalls as { people?: Record<string, CountRecord> })[id];
  const speech = people(plenary as { people?: Record<string, CountRecord> })[id];
  const committee = people(committees as { people?: Record<string, CountRecord> })[id];
  const rollPeriod = {
    start: (rollCalls as { since?: string }).since ?? null,
    end: (rollCalls as { retrievedAt?: string }).retrievedAt ?? null,
  };
  const speechPeriod = {
    start: (plenary as { since?: string }).since ?? null,
    end: (plenary as { retrievedAt?: string }).retrievedAt ?? null,
  };
  const committeePeriod = {
    start: (committees as { since?: string }).since ?? null,
    end: (committees as { retrievedAt?: string }).retrievedAt ?? null,
  };
  const voting = measuredRatio(roll?.participated, roll?.rollcalls);
  const presence = measuredRatio(roll?.present, roll?.rollcalls);
  const committeeRatio = measuredRatio(committee?.present, committee?.meetings);
  const rollUrl = firstUrl(roll);
  const speechUrl = firstUrl(speech);
  const committeeUrl = firstUrl(committee);
  const interventions = typeof speech?.interventions === 'number' ? speech.interventions : null;

  return {
    profileId: id,
    methodologyVersion: OBSERVATORY_METHODOLOGY_VERSION,
    indicators: [
      baseIndicator({
        id: 'voting_participation',
        label: 'Pjesëmarrja në votim [Voting participation]',
        numerator: voting.numerator,
        denominator: voting.denominator,
        periodStart: voting.denominator === null ? null : rollPeriod.start,
        periodEnd: voting.denominator === null ? null : rollPeriod.end,
        sourceUrl: voting.denominator === null ? null : rollUrl,
        sourceTitle: voting.denominator === null ? null : 'Fletë votimi, Kuvendi i Shqipërisë',
        verifiedAt: voting.denominator === null ? null : rollPeriod.end,
        note: null,
      }),
      baseIndicator({
        id: 'plenary_presence',
        label: 'Prezenca plenare [Plenary presence]',
        numerator: presence.numerator,
        denominator: presence.denominator,
        periodStart: presence.denominator === null ? null : rollPeriod.start,
        periodEnd: presence.denominator === null ? null : rollPeriod.end,
        sourceUrl: presence.denominator === null ? null : rollUrl,
        sourceTitle: presence.denominator === null ? null : 'Fletë votimi, Kuvendi i Shqipërisë',
        verifiedAt: presence.denominator === null ? null : rollPeriod.end,
        note: null,
      }),
      baseIndicator({
        id: 'committee_participation',
        label: 'Pjesëmarrja në komision [Committee participation]',
        numerator: committeeRatio.numerator,
        denominator: committeeRatio.denominator,
        periodStart: committeeRatio.denominator === null ? null : committeePeriod.start,
        periodEnd: committeeRatio.denominator === null ? null : committeePeriod.end,
        sourceUrl: committeeRatio.denominator === null ? null : committeeUrl,
        sourceTitle: committeeRatio.denominator === null ? null : 'Procesverbal komisioni, lista Marrin pjesë / Mungojnë',
        verifiedAt: committeeRatio.denominator === null ? null : committeePeriod.end,
        note: null,
      }),
      baseIndicator({
        id: 'legislative_activity',
        label: 'Aktiviteti legjislativ [Legislative activity]',
        numerator: null,
        denominator: null,
        periodStart: null,
        periodEnd: null,
        sourceUrl: null,
        sourceTitle: null,
        verifiedAt: null,
        note: `${ACTS_NOTE} ${ROLL_CATALOGUE.replace('/dokumentet', '/aktet')}`,
      }),
      baseIndicator({
        id: 'plenary_interventions',
        label: 'Ndërhyrje plenare [Plenary interventions]',
        numerator: interventions,
        denominator: null,
        periodStart: interventions === null ? null : speechPeriod.start,
        periodEnd: interventions === null ? null : speechPeriod.end,
        sourceUrl: interventions === null ? null : speechUrl,
        sourceTitle: interventions === null ? null : 'Procesverbal plenar, Kuvendi i Shqipërisë',
        verifiedAt: interventions === null ? null : speechPeriod.end,
        note: interventions === null ? null : 'Numër ndërhyrjesh të atribuara. Emëruesi i seancave të pranueshme nuk është matur. [Attributed turn count. The eligible-sitting denominator was not measured.]',
      }),
    ],
    dimensions: DIMENSIONS.map((dimension) => ({
      ...dimension,
      score: null,
      status: CALIBRATION_STATUS,
    })),
  };
}

export function formatFactualCount(indicator: FactualIndicator): string {
  if (typeof indicator.numerator !== 'number') return AWAITING_DATA;
  if (typeof indicator.denominator !== 'number') return String(indicator.numerator);
  return `${indicator.numerator}/${indicator.denominator}`;
}
