// data/analyticalMappings.ts
// Analytical Spine Lineage Mapping Layer
// Binds Doktrina (Standards) ↔ Metoda (Methodology Steps) ↔ Korniza (MARAGON Indicators) ↔ Vlerësimi Live (Score Metrics)

export interface AnalyticalMetricMapping {
  id: string; // metric:xxx
  key: string;
  name_sq: string;
  category_sq: string;
  description: string;
  audit_note?: string;
  indicator_ids: string[]; // maragon:xxx
  methodology_step_ids: string[]; // meth:xxx
  standard_clause_ids: string[]; // std:xxx
}

export const ANALYTICAL_METRICS_MAP: Record<string, AnalyticalMetricMapping> = {
  'metric:credibility': {
    id: 'metric:credibility',
    key: 'credibility',
    name_sq: 'Besueshmëria (Credibility)',
    category_sq: 'Integriteti Faktik & Burimet',
    description: 'Vlerëson pretendimet e verifikuara, raportin e burimeve parësore dhe triangulimin me arkiva të besueshme.',
    indicator_ids: ['maragon:R1.2', 'maragon:A2.1', 'maragon:A2.3', 'maragon:G3.1'],
    methodology_step_ids: ['meth:step-1', 'meth:step-3'],
    standard_clause_ids: ['std:MET-A', 'std:MET-B', 'std:ETIK-1A', 'std:TRAN-1A'],
  },
  'metric:readability': {
    id: 'metric:readability',
    key: 'readability',
    name_sq: 'Lexueshmëria (Readability)',
    category_sq: 'Qartësia Gjuhësore & Struktura',
    description: 'Vlerëson nivelin sintaksor Flesch-Kincaid, densitetin e fjalive pasive dhe qartësinë gjuhësore për të parandaluar churnalism.',
    indicator_ids: ['maragon:A2.3'],
    methodology_step_ids: ['meth:step-1', 'meth:step-2'],
    standard_clause_ids: ['std:MET-A'],
  },
  'metric:bias_sentiment': {
    id: 'metric:bias_sentiment',
    key: 'bias_sentiment',
    name_sq: 'Anshmëria & Sentimenti (Bias & Sentiment)',
    category_sq: 'Paanshmëria & Kornizimi',
    description: 'Zbulon kornizimin e njëanshëm (framing), polarizimin e gjuhës dhe devijimet e pajustifikuara emocionale.',
    indicator_ids: ['maragon:A2.2', 'maragon:G3.2'],
    methodology_step_ids: ['meth:step-2', 'meth:step-3'],
    standard_clause_ids: ['std:ETIK-1A', 'std:ETIK-1B'],
  },
  'metric:lifecycle_compliance': {
    id: 'metric:lifecycle_compliance',
    key: 'lifecycle_compliance',
    name_sq: 'Cikli i Jetës & Përputhshmëria (Lifecycle Compliance)',
    category_sq: 'Llogaridhënia & Korrigjimet',
    description: 'Garanton protokollin e korrigjimeve, transparencën e përditësimeve editoriale dhe përputhshmërinë rregullatore.',
    audit_note: 'Audituar periodikisht përmes Qendrës së Korrigjimeve dhe Zyrës së Përputhshmërisë.',
    indicator_ids: ['maragon:R1.1', 'maragon:R1.2', 'maragon:G3.1'],
    methodology_step_ids: ['meth:step-3'],
    standard_clause_ids: ['std:ETIK-3A', 'std:KONF-A', 'std:TRAN-1A'],
  },
  'metric:seo_accessibility': {
    id: 'metric:seo_accessibility',
    key: 'seo_accessibility',
    name_sq: 'SEO & Aksesueshmëria',
    category_sq: 'Transparenca Publike & Standardet Dixhitale',
    description: 'Optimizimi semantik për indeksim të hapur, metatëdhëna Schema.org dhe lexueshmëri universale.',
    indicator_ids: ['maragon:O4.1'],
    methodology_step_ids: ['meth:step-1'],
    standard_clause_ids: ['std:KONF-B'],
  },
  'metric:logic_fact': {
    id: 'metric:logic_fact',
    key: 'logic_fact',
    name_sq: 'Logjikë (Fact)',
    category_sq: 'Koherenca Logjike',
    description: 'Raporti i fakteve të vërtetueshme empirikisht kundrejt deduktimeve apo pretendimeve pa mbështetje provash.',
    indicator_ids: ['maragon:A2.1', 'maragon:A2.4'],
    methodology_step_ids: ['meth:step-1', 'meth:step-3'],
    standard_clause_ids: ['std:MET-A', 'std:MET-B'],
  },
  'metric:ethical_resonance': {
    id: 'metric:ethical_resonance',
    key: 'ethical_resonance',
    name_sq: 'Rezonanca Etike (CSR)',
    category_sq: 'Përgjegjësia Qytetare & Interesi Publik',
    description: 'Përputhshmëria me misionin e shërbimit publik, dinjitetin njerëzor, dhe kontributin në debatin demokratik.',
    indicator_ids: ['maragon:A2.2', 'maragon:G3.2', 'maragon:O4.2'],
    methodology_step_ids: ['meth:step-3'],
    standard_clause_ids: ['std:ETIK-1A', 'std:KONF-C'],
  },
  'metric:emotion_affect': {
    id: 'metric:emotion_affect',
    key: 'emotion_affect',
    name_sq: 'Emocion (Affect)',
    category_sq: 'Intensiteti Afektiv',
    description: 'Matja e ngarkesës emocionale dhe dramatizimit për të siguruar raportim të matshëm dhe jo sensacionalist.',
    indicator_ids: ['maragon:A2.2'],
    methodology_step_ids: ['meth:step-2'],
    standard_clause_ids: ['std:ETIK-1A'],
  },

  // =========================================================================
  // PARAGON® Analytical Spine: Registered Typed IDs paragon:d1 .. paragon:d7
  // =========================================================================
  'paragon:d1': {
    id: 'paragon:d1',
    key: 'd1',
    name_sq: 'Angazhimi Politik (D1)',
    category_sq: 'Pjesëmarrja & Nismat Legjislative',
    description:
      'Përllogaritje empirike e angazhimit parlamentar bazuar në pjesëmarrjen në mbledhje (/mbledhjet), nismat ligjore të udhëhequra dhe fjalimet plenare.',
    audit_note:
      'Përllogaritur nga regjistrat zyrtarë të Kuvendit të Shqipërisë me metodën "kuvendi_mbledhjet_attendance_v1". Vlerë reale ose null i pastër në mungesë të dhënash (pa fabrikim). Lidhje linje me familjen O4.2.',
    indicator_ids: ['maragon:O4.2'],
    methodology_step_ids: ['meth:step-1', 'meth:step-3'],
    standard_clause_ids: ['std:MET-A', 'std:MET-J'],
  },
  'paragon:d2': {
    id: 'paragon:d2',
    key: 'd2',
    name_sq: 'Llogaridhënia (D2)',
    category_sq: 'Transparenca e Pasurisë & Integriteti',
    description:
      'Verifikon dorëzimin në afat (31 mars) të deklaratave vjetore të pasurisë në ILDKPKI, pastërtinë e auditimit administrativ dhe pjesëmarrjen në votime.',
    audit_note:
      'Baza ligjore e garantuar: Ligji Nr. 9049 dhe Ligji Nr. 119/2014 (shih docs/ILDKPKI_LEGAL_BASIS.md). Ruhet URL e snapshot-it zyrtar dhe data e marrjes. Lidhje linje me familjen e qeverisjes MARAGON G3.1.',
    indicator_ids: ['maragon:G3.1'],
    methodology_step_ids: ['meth:step-1', 'meth:step-3'],
    standard_clause_ids: ['std:TRAN-2A', 'std:KONF-A'],
  },
  'paragon:d3': {
    id: 'paragon:d3',
    key: 'd3',
    name_sq: 'Përfaqësimi (D3)',
    category_sq: 'Raporti me Zgjedhësit & Zona Elektorale',
    description:
      'Vlerëson nismat në zonën zgjedhore, dëgjesat publike rajonale dhe votat preferenciale.',
    audit_note:
      'Në pritje të auditimit: Stubi i skemës është i paprekur për ciklin vijues (P2). Lidhje linje me familjen O4.1.',
    indicator_ids: ['maragon:O4.1'],
    methodology_step_ids: ['meth:step-1'],
    standard_clause_ids: ['std:MET-D'],
  },
  'paragon:d4': {
    id: 'paragon:d4',
    key: 'd4',
    name_sq: 'Asertiviteti (D4)',
    category_sq: 'Debati Legjislativ & Amendamentet',
    description:
      'Vlerëson udhëheqjen e debateve kyçe ligjore, amendamentet e propozuara dhe fjalimet.',
    audit_note:
      'Në pritje të auditimit tekstiologjik të procesverbaleve të Kuvendit. Lidhje linje me familjen A2.1 (Saktësia Faktike).',
    indicator_ids: ['maragon:A2.1'],
    methodology_step_ids: ['meth:step-1', 'meth:step-3'],
    standard_clause_ids: ['std:MET-F'],
  },
  'paragon:d5': {
    id: 'paragon:d5',
    key: 'd5',
    name_sq: 'Qeverisja (D5)',
    category_sq: 'Integriteti Kushtetues & Reforma',
    description:
      'Përputhshmëria me rendin kushtetues, mbështetja e reformës në drejtësi dhe nismat institucionale.',
    audit_note:
      'Në pritje të auditimit të akteve normative dhe vlerësimeve kushtetuese. Lidhje linje me familjen G3.2.',
    indicator_ids: ['maragon:G3.2'],
    methodology_step_ids: ['meth:step-3'],
    standard_clause_ids: ['std:ETIK-1A', 'std:KONF-A'],
  },
  'paragon:d6': {
    id: 'paragon:d6',
    key: 'd6',
    name_sq: 'Kohësioni (D6)',
    category_sq: 'Disiplina Parlamentare & Grupi',
    description:
      'Përputhshmëria e votës me grupin parlamentar dhe prania në mbledhjet e grupit.',
    audit_note:
      'jashtë kodit aktual — propozohet neni i ri: Disiplina dhe Kohezioni Parlamentar (MET-K si analogia më e afërt metodologjike). Lidhje linje me familjen A2.2.',
    indicator_ids: ['maragon:A2.2'],
    methodology_step_ids: ['meth:step-1'],
    standard_clause_ids: ['std:MET-K'],
  },
  'paragon:d7': {
    id: 'paragon:d7',
    key: 'd7',
    name_sq: 'Narrativa (D7)',
    category_sq: 'Rezonanca Mediatike & Sentimenti',
    description:
      'Monitorimi i pranisë mediatike, balancës së sentimentit dhe indeksit të toksicitetit me dekompozim 180 ditë.',
    audit_note:
      'Në pritje të auditimit të monitorimit automatik të lajmeve dhe transmetimeve live. Lidhje linje me familjen O4.2.',
    indicator_ids: ['maragon:O4.2'],
    methodology_step_ids: ['meth:step-2'],
    standard_clause_ids: ['std:ETIK-1B', 'std:ETIK-1A'],
  },
};

export const PARAGON_DIMENSION_MAPPINGS: Record<string, AnalyticalMetricMapping> = {
  'paragon:d1': ANALYTICAL_METRICS_MAP['paragon:d1'],
  'paragon:d2': ANALYTICAL_METRICS_MAP['paragon:d2'],
  'paragon:d3': ANALYTICAL_METRICS_MAP['paragon:d3'],
  'paragon:d4': ANALYTICAL_METRICS_MAP['paragon:d4'],
  'paragon:d5': ANALYTICAL_METRICS_MAP['paragon:d5'],
  'paragon:d6': ANALYTICAL_METRICS_MAP['paragon:d6'],
  'paragon:d7': ANALYTICAL_METRICS_MAP['paragon:d7'],
};

// Aliases for standard clauses mapping: std:MET-A, std:ET-3.3, std:ETIK-3.3A, etc.
export const normalizeClauseId = (id: string): string => {
  let clean = id.trim();
  if (clean.startsWith('std:')) clean = clean.substring(4);
  if (clean.startsWith('clause-')) clean = clean.substring(7);
  if (clean === 'ET-3.3' || clean === 'ETIK-3.3') return 'ETIK-3.3A';
  if (clean === 'ET-3.1' || clean === 'ETIK-3.1') return 'ETIK-3.1A';
  if (clean === 'TR-4.1' || clean === 'TRANSP-4.1') return 'TRANSP-4.1A';
  if (clean === 'TR-4.2' || clean === 'TRANSP-4.2') return 'TRANSP-4.2A';
  if (clean === 'SYS-1.1' || clean === 'KONF-1.1') return 'KONF-A';
  if (clean === 'SYS-1.2' || clean === 'KONF-1.2') return 'KONF-B';
  return clean;
};

// Query Lineage for Metric ID
export const getLineageForMetric = (metricId: string) => {
  if (!metricId) return undefined;
  const clean = metricId.trim().toLowerCase();
  if (clean.startsWith('paragon:')) {
    return ANALYTICAL_METRICS_MAP[clean] || undefined;
  }
  if (['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'].includes(clean)) {
    return ANALYTICAL_METRICS_MAP[`paragon:${clean}`] || undefined;
  }
  const norm = metricId.startsWith('metric:') ? metricId : `metric:${metricId}`;
  return ANALYTICAL_METRICS_MAP[norm] || undefined;
};

// Backlinks query for standard clauses
export interface ClauseBacklinks {
  methodology_step_ids: string[];
  maragon_indicator_ids: string[];
  live_metric_ids: string[];
}

export const getBacklinksForClause = (clauseId: string): ClauseBacklinks => {
  const norm = normalizeClauseId(clauseId);
  const result: ClauseBacklinks = {
    methodology_step_ids: [],
    maragon_indicator_ids: [],
    live_metric_ids: [],
  };

  const stdTag = `std:${norm}`;

  Object.values(ANALYTICAL_METRICS_MAP).forEach(metric => {
    const hasClause = metric.standard_clause_ids.some(c => normalizeClauseId(c) === norm);
    if (hasClause) {
      if (!result.live_metric_ids.includes(metric.id)) {
        result.live_metric_ids.push(metric.id);
      }
      metric.methodology_step_ids.forEach(step => {
        if (!result.methodology_step_ids.includes(step)) {
          result.methodology_step_ids.push(step);
        }
      });
      metric.indicator_ids.forEach(ind => {
        if (!result.maragon_indicator_ids.includes(ind)) {
          result.maragon_indicator_ids.push(ind);
        }
      });
    }
  });

  return result;
};

// Backlinks for methodology pipeline steps
export interface MethodStepLineage {
  step_id: string;
  name_sq: string;
  governing_clause_ids: string[];
  feeds_maragon_indicator_ids: string[];
  feeds_metric_ids: string[];
}

export const getLineageForMethodStep = (stepId: string): MethodStepLineage => {
  const norm = stepId.startsWith('meth:') ? stepId : `meth:${stepId}`;

  const clauses: string[] = [];
  const indicators: string[] = [];
  const metrics: string[] = [];

  Object.values(ANALYTICAL_METRICS_MAP).forEach(m => {
    if (m.methodology_step_ids.includes(norm)) {
      if (!metrics.includes(m.id)) metrics.push(m.id);
      m.indicator_ids.forEach(ind => {
        if (!indicators.includes(ind)) indicators.push(ind);
      });
      m.standard_clause_ids.forEach(cl => {
        if (!clauses.includes(cl)) clauses.push(cl);
      });
    }
  });

  const stepNames: Record<string, string> = {
    'meth:step-1': 'Hapi 1: Analiza Fillestare nga IA (Shkalla dhe Shpejtësia)',
    'meth:step-2': 'Hapi 2: Gjenerimi i Draft-Rezultatit (Struktura Fillestare)',
    'meth:step-3': 'Hapi 3: Rishikimi dhe Verifikimi Njerëzor (Mbikëqyrja Hermeneutike)',
  };

  return {
    step_id: norm,
    name_sq: stepNames[norm] || norm,
    governing_clause_ids: clauses,
    feeds_maragon_indicator_ids: indicators,
    feeds_metric_ids: metrics,
  };
};
