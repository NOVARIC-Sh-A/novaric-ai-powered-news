// data/maragonIndicators.ts
// Granular indicators of the MARAGON® Framework (Media Assessment for Readiness, Aptitude, Governance, Oversight Nurturing)

export type MaragonDimension = 'R' | 'A' | 'G' | 'O';

export interface MaragonIndicator {
  id: string; // maragon:xxx
  code: string; // e.g. R1.1
  title: string;
  dimension: MaragonDimension;
  dimension_name_sq: string;
  scope: 'outlet' | 'individual';
  body_excerpt: string;
  concept_ids: string[];
  citation_ids: string[];
  related_metric_ids: string[];
  methodology_step_ids: string[];
  standard_clause_ids: string[];
  forward_link?: {
    label: string;
    targetMetricId: string;
  };
}

export const MARAGON_INDICATORS: MaragonIndicator[] = [
  {
    id: 'maragon:R1.1',
    code: 'R1.1',
    title: 'Pajtueshmëria Rregullatore',
    dimension: 'R',
    dimension_name_sq: 'Gatishmëria (Readiness)',
    scope: 'outlet',
    body_excerpt:
      'IA analizon përputhshmërinë me vendimet e AMA-s. Në kontekstin shqiptar, ku media shpesh funksionon brenda modelit "Pluralist të Polarizuar", shkeljet e rregullave zgjedhore nuk janë thjesht administrative, por simptoma të një paralelizmi të lartë politik.',
    concept_ids: ['concept:polarized_pluralism'],
    citation_ids: ['ref:hallin-mancini-2004'],
    related_metric_ids: ['metric:lifecycle_compliance'],
    methodology_step_ids: ['meth:step-1'],
    standard_clause_ids: ['std:KONF-A', 'std:ETIK-3.3A'],
    forward_link: {
      label: 'Shiko këtë tregues live: Cikli i Jetës & Përputhshmëria në Matricën e Integritetit',
      targetMetricId: 'metric:lifecycle_compliance',
    },
  },
  {
    id: 'maragon:R1.2',
    code: 'R1.2',
    title: 'Pajtueshmëria Etike',
    dimension: 'R',
    dimension_name_sq: 'Gatishmëria (Readiness)',
    scope: 'outlet',
    body_excerpt:
      'IA identifikon praninë e korrigjimeve dhe ndarjen e qartë mes opinionit dhe lajmit. Kjo mat përkushtimin ndaj parimit të parë të gazetarisë: "detyrimi i parë i saj është ndaj së vërtetës".',
    concept_ids: [],
    citation_ids: ['ref:kovach-rosenstiel-2014'],
    related_metric_ids: ['metric:credibility', 'metric:lifecycle_compliance'],
    methodology_step_ids: ['meth:step-3'],
    standard_clause_ids: ['std:ETIK-3.1A', 'std:ETIK-3.3A'],
    forward_link: {
      label: 'Shiko këtë tregues live: Besueshmëria & Protokolli i Korrigjimeve',
      targetMetricId: 'metric:credibility',
    },
  },
  {
    id: 'maragon:A2.1',
    code: 'A2.1',
    title: 'Saktësia Faktike',
    dimension: 'A',
    dimension_name_sq: 'Aftësia (Aptitude)',
    scope: 'outlet',
    body_excerpt:
      'IA kryqëzon pretendimet me bazat e të dhënave. Kjo mat "disiplinën e verifikimit".',
    concept_ids: [],
    citation_ids: ['ref:kovach-rosenstiel-2014'],
    related_metric_ids: ['metric:credibility', 'metric:logic_fact'],
    methodology_step_ids: ['meth:step-1', 'meth:step-3'],
    standard_clause_ids: ['std:MET-A', 'std:MET-B'],
    forward_link: {
      label: 'Shiko këtë tregues live: Logjikë (Fact) në Matricën e Integritetit',
      targetMetricId: 'metric:logic_fact',
    },
  },
  {
    id: 'maragon:A2.2',
    code: 'A2.2',
    title: 'Paanshmëria & Anshmëria',
    dimension: 'A',
    dimension_name_sq: 'Aftësia (Aptitude)',
    scope: 'outlet',
    body_excerpt:
      'IA analizon kornizimin (framing). Një lajm mund të jetë 100% i saktë faktikisht, por thellësisht i anshëm për shkak të kornizimit.',
    concept_ids: ['concept:framing'],
    citation_ids: ['ref:entman-1993'],
    related_metric_ids: ['metric:bias_sentiment', 'metric:ethical_resonance', 'metric:emotion_affect'],
    methodology_step_ids: ['meth:step-2', 'meth:step-3'],
    standard_clause_ids: ['std:ETIK-3.1A', 'std:ETIK-3.1B'],
    forward_link: {
      label: 'Shiko këtë tregues live: Anshmëria & Sentiment në Matricën e Integritetit',
      targetMetricId: 'metric:bias_sentiment',
    },
  },
  {
    id: 'maragon:A2.3',
    code: 'A2.3',
    title: 'Origjinaliteti & Thellësia',
    dimension: 'A',
    dimension_name_sq: 'Aftësia (Aptitude)',
    scope: 'outlet',
    body_excerpt:
      'IA zbulon gazetarinë investigative kundrejt praktikës së "churnalism" – ripërpunimi pasiv i njoftimeve për shtyp.',
    concept_ids: ['concept:churnalism'],
    citation_ids: ['ref:davies-2008'],
    related_metric_ids: ['metric:readability', 'metric:credibility'],
    methodology_step_ids: ['meth:step-1', 'meth:step-3'],
    standard_clause_ids: ['std:MET-A'],
    forward_link: {
      label: 'Shiko këtë tregues live: Lexueshmëria & Burimet Parësore',
      targetMetricId: 'metric:readability',
    },
  },
  {
    id: 'maragon:A2.4',
    code: 'A2.4',
    title: 'Kontekstualizimi',
    dimension: 'A',
    dimension_name_sq: 'Aftësia (Aptitude)',
    scope: 'outlet',
    body_excerpt:
      'IA vlerëson raportimin tematik (probleme sistematike) kundrejt atij episodik (ngjarje të izoluara), i cili depolitizon çështjet publike.',
    concept_ids: [],
    citation_ids: ['ref:iyengar-1991'],
    related_metric_ids: ['metric:logic_fact', 'metric:credibility'],
    methodology_step_ids: ['meth:step-2', 'meth:step-3'],
    standard_clause_ids: ['std:MET-B'],
    forward_link: {
      label: 'Shiko këtë tregues live: Raporti Tematik vs Episodik në Vlerësimin Klinik',
      targetMetricId: 'metric:logic_fact',
    },
  },
  {
    id: 'maragon:G3.1',
    code: 'G3.1',
    title: 'Ndikimi i Pronësisë',
    dimension: 'G',
    dimension_name_sq: 'Qeverisja (Governance)',
    scope: 'outlet',
    body_excerpt:
      'IA kërkon shenja të "kapjes së medias", ku media kontrollohet nga elita për të mbrojtur interesat e tyre private.',
    concept_ids: ['concept:media_capture'],
    citation_ids: ['ref:mungiu-pippidi-2013'],
    related_metric_ids: ['metric:credibility', 'metric:lifecycle_compliance'],
    methodology_step_ids: ['meth:step-1'],
    standard_clause_ids: ['std:TRANSP-4.1A', 'std:TRANSP-4.1B'],
    forward_link: {
      label: 'Shiko këtë tregues live: Transparenca e Pronësisë në Zyrën e Standardeve',
      targetMetricId: 'metric:lifecycle_compliance',
    },
  },
  {
    id: 'maragon:G3.2',
    code: 'G3.2',
    title: 'Kontrolli Editorial',
    dimension: 'G',
    dimension_name_sq: 'Qeverisja (Governance)',
    scope: 'outlet',
    body_excerpt:
      'IA analizon autonominë e linjës editoriale. Ky tregues mat atë që Bourdieu e quajti "autonomia e fushës gazetareske".',
    concept_ids: ['concept:field_autonomy'],
    citation_ids: ['ref:bourdieu-1998'],
    related_metric_ids: ['metric:ethical_resonance'],
    methodology_step_ids: ['meth:step-3'],
    standard_clause_ids: ['std:ETIK-3.1A'],
    forward_link: {
      label: 'Shiko këtë tregues live: Rezonanca Etike në Matricën e Integritetit',
      targetMetricId: 'metric:ethical_resonance',
    },
  },
  {
    id: 'maragon:O4.1',
    code: 'O4.1',
    title: 'Promovimi i Edukimit Mediatik',
    dimension: 'O',
    dimension_name_sq: 'Kujdesi Mbikëqyrës (Oversight Nurturing)',
    scope: 'outlet',
    body_excerpt:
      'IA identifikon segmente që demaskojnë dezinformimin. Kjo është thelbësore për të kultivuar edukimin mediatik (media literacy).',
    concept_ids: ['concept:media_literacy'],
    citation_ids: ['ref:livingstone-2004'],
    related_metric_ids: ['metric:credibility', 'metric:seo_accessibility'],
    methodology_step_ids: ['meth:step-3'],
    standard_clause_ids: ['std:MET-J'],
    forward_link: {
      label: 'Shiko këtë tregues live: SEO & Edukimi Publik',
      targetMetricId: 'metric:seo_accessibility',
    },
  },
  {
    id: 'maragon:O4.2',
    code: 'O4.2',
    title: 'Kontributi në Diskursin Demokratik',
    dimension: 'O',
    dimension_name_sq: 'Kujdesi Mbikëqyrës (Oversight Nurturing)',
    scope: 'outlet',
    body_excerpt:
      'IA mat pluralizmin e zërave. Kjo lidhet me idealin e një gazetarie publike, e cila synon të lehtësojë debatin qytetar.',
    concept_ids: ['concept:public_journalism', 'concept:public_sphere'],
    citation_ids: ['ref:rosen-1999', 'ref:habermas-1989'],
    related_metric_ids: ['metric:ethical_resonance'],
    methodology_step_ids: ['meth:step-3'],
    standard_clause_ids: ['std:MET-J', 'std:ETIK-3.1A'],
    forward_link: {
      label: 'Shiko këtë tregues live: Rezonanca Qytetare & Diskursi Demokratik',
      targetMetricId: 'metric:ethical_resonance',
    },
  },

  // Variants for individuals section (Gazetarë, Drejtues Emisionesh)
  {
    id: 'maragon:ind:A2.2',
    code: 'Individët A2.2',
    title: 'Paanshmëria & Anshmëria (Individët)',
    dimension: 'A',
    dimension_name_sq: 'Aftësia (Aptitude)',
    scope: 'individual',
    body_excerpt:
      'Për individët, kjo shkon përtej kornizimit të tekstit dhe përfshin analizën e performancës. A janë pyetjet sfiduese për të gjithë të ftuarit? A ka shenja të anshmërisë së nënkuptuar (implicit bias)?',
    concept_ids: ['concept:framing'],
    citation_ids: ['ref:entman-1993'],
    related_metric_ids: ['metric:bias_sentiment', 'metric:ethical_resonance'],
    methodology_step_ids: ['meth:step-3'],
    standard_clause_ids: ['std:ETIK-3.1A'],
  },
  {
    id: 'maragon:ind:A2.3',
    code: 'Individët A2.3',
    title: 'Thellësia e Analizës (Individët)',
    dimension: 'A',
    dimension_name_sq: 'Aftësia (Aptitude)',
    scope: 'individual',
    body_excerpt:
      'Kjo mat kapitalin kulturor dhe informacional të gazetarit. A demonstron ai/ajo një kuptim të thellë të historisë së një çështjeje?',
    concept_ids: ['concept:hermeneutic_circle'],
    citation_ids: ['ref:gadamer-1989'],
    related_metric_ids: ['metric:credibility', 'metric:logic_fact'],
    methodology_step_ids: ['meth:step-3'],
    standard_clause_ids: ['std:MET-B'],
  },
  {
    id: 'maragon:ind:O4.1',
    code: 'Individët O4.1',
    title: 'Promovimi i të Menduarit Kritik (Individët)',
    dimension: 'O',
    dimension_name_sq: 'Kujdesi Mbikëqyrës (Oversight Nurturing)',
    scope: 'individual',
    body_excerpt:
      'A e modelon gazetari sjelljen e një qytetari të informuar? Kjo është kalimi nga një gazetari që thotë "kjo është e vërteta" në një gazetari që thotë "ja si mund ta zbuloni të vërtetën".',
    concept_ids: ['concept:media_literacy'],
    citation_ids: ['ref:livingstone-2004'],
    related_metric_ids: ['metric:ethical_resonance'],
    methodology_step_ids: ['meth:step-3'],
    standard_clause_ids: ['std:MET-J'],
  },
];

export const getMaragonIndicatorById = (id: string): MaragonIndicator | undefined => {
  const normalizedId = id.startsWith('maragon:') ? id : `maragon:${id}`;
  return MARAGON_INDICATORS.find(i => i.id === normalizedId);
};

export const getMaragonIndicatorsByDimension = (dim: MaragonDimension): MaragonIndicator[] => {
  return MARAGON_INDICATORS.filter(i => i.dimension === dim && i.scope === 'outlet');
};
