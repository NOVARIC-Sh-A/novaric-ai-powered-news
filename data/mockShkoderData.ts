import { MunicipalityPerformance, ShkoderSocioEconomicData, ShkoderPoliticalData } from '../types';

export const municipalityPerformanceData: MunicipalityPerformance[] = [
  {
    kpi: 'Ekzekutimi i Buxhetit',
    value: 78,
    description: 'Përqindja e buxhetit të planifikuar që është shpenzuar efektivisht për projekte dhe shërbime.',
  },
  {
    kpi: 'Transparenca dhe Llogaridhënia',
    value: 65,
    description: 'Vlerësimi i publikimit të vendimeve, prokurimeve publike dhe aksesit të qytetarëve në informacion.',
  },
  {
    kpi: 'Menaxhimi i Mbetjeve Urbane',
    value: 55,
    description: 'Efikasiteti i grumbullimit dhe përpunimit të mbetjeve në territorin e bashkisë.',
  },
  {
    kpi: 'Mirëmbajtja e Infrastrukturës Rrugore',
    value: 72,
    description: 'Cilësia dhe mbulimi i mirëmbajtjes së rrugëve urbane dhe rurale.',
  },
  {
    kpi: 'Shërbimet Online për Qytetarët',
    value: 85,
    description: 'Përqindja e shërbimeve administrative që ofrohen online për të lehtësuar qytetarët.',
  },
];

export const shkoderPoliticalData: ShkoderPoliticalData = {
  councilComposition: [
    { party: 'Partia Socialiste (PS)', seats: 22, color: '#ed1c24' },
    { party: 'Partia Demokratike (PD)', seats: 15, color: '#0053a1' },
    { party: 'Partia e Lirisë (PL)', seats: 5, color: '#ffcd00' },
    { party: 'Të tjerë / Pavarur', seats: 9, color: '#6b7280' },
  ],
  keyIssues: [
    { issue: 'Menaxhimi i Mbetjeve', summary: 'Sfidë e vazhdueshme, veçanërisht gjatë sezonit turistik. Kërkohen investime në impiantin e përpunimit dhe ndërgjegjësim qytetar.' },
    { issue: 'Plani Urbanistik', summary: 'Debate mbi lejet e ndërtimit, ruajtjen e trashëgimisë kulturore dhe zhvillimin e zonave të reja urbane.' },
    { issue: 'Punësimi i të Rinjve', summary: 'Përpjekje për të krijuar mundësi punësimi dhe për të frenuar emigracionin e të rinjve përmes trajnimeve dhe mbështetjes së start-up-eve.' },
    { issue: 'Infrastruktura Rurale', summary: 'Nevoja për përmirësimin e rrugëve, ujësjellësit dhe kanalizimeve në njësitë administrative rurale për të mbështetur bujqësinë dhe turizmin.' },
  ],
};

export const shkoderSocioEconomicData: ShkoderSocioEconomicData = {
  totalPopulation: 135612,
  households: 38234,
  unemploymentRate: 11.4,
  povertyRate: 18.2,
  populationPyramid: [
    { ageGroup: '0-4', male: 4500, female: 4200 },
    { ageGroup: '5-9', male: 4800, female: 4600 },
    { ageGroup: '10-14', male: 5200, female: 5000 },
    { ageGroup: '15-19', male: 5800, female: 5500 },
    { ageGroup: '20-24', male: 6100, female: 5800 },
    { ageGroup: '25-29', male: 6300, female: 6100 },
    { ageGroup: '30-34', male: 5900, female: 5700 },
    { ageGroup: '35-39', male: 5500, female: 5400 },
    { ageGroup: '40-44', male: 5100, female: 5000 },
    { ageGroup: '45-49', male: 4800, female: 4700 },
    { ageGroup: '50-54', male: 4500, female: 4400 },
    { ageGroup: '55-59', male: 4100, female: 4000 },
    { ageGroup: '60-64', male: 3600, female: 3500 },
    { ageGroup: '65-69', male: 3000, female: 3200 },
    { ageGroup: '70-74', male: 2400, female: 2600 },
    { ageGroup: '75+', male: 3500, female: 4200 },
  ],
  populationGrowth: [
    { year: 2011, population: 135612 },
    { year: 2015, population: 136200 },
    { year: 2020, population: 135800 },
    { year: 2023, population: 135100 },
  ],
  genderRatio: {
    male: 49.5,
    female: 50.5,
  },
  educationAttainment: [
    { level: 'Pa Arsim', percentage: 5 },
    { level: 'Fillor', percentage: 20 },
    { level: '9-vjeçar', percentage: 25 },
    { level: 'I Mesëm', percentage: 35 },
    { level: 'I Lartë', percentage: 15 },
  ],
  employmentBySector: [
    { sector: 'Shërbime & Turizëm', percentage: 45 },
    { sector: 'Industri', percentage: 20 },
    { sector: 'Bujqësi', percentage: 18 },
    { sector: 'Ndërtim', percentage: 10 },
    { sector: 'Tjetër', percentage: 7 },
  ],
  householdIncomeDistribution: [
      { bracket: '< 30,000 LEK', percentage: 25 },
      { bracket: '30-50k LEK', percentage: 35 },
      { bracket: '50-80k LEK', percentage: 25 },
      { bracket: '80-120k LEK', percentage: 10 },
      { bracket: '> 120,000 LEK', percentage: 5 },
  ],
  businessSizeDistribution: [
      { size: 'Mikro (1-4 punonjës)', percentage: 88 },
      { size: 'Të Vogla (5-19)', percentage: 9 },
      { size: 'Të Mesme (20-99)', percentage: 2 },
      { size: 'Të Mëdha (100+)', percentage: 1 },
  ],
  housingType: [
      { type: 'Në pronësi', percentage: 75 },
      { type: 'Me qira', percentage: 20 },
      { type: 'Tjetër', percentage: 5 },
  ],
  healthIndicators: [
      { indicator: 'Jetëgjatësia (Meshkuj)', value: '76.8 vite' },
      { indicator: 'Jetëgjatësia (Femra)', value: '80.5 vite' },
      { indicator: 'Lindshmëria (për 1000)', value: '10.2' },
      { indicator: 'Vdekshmëria (për 1000)', value: '7.5' },
  ],
};