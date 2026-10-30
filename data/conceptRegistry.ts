// data/conceptRegistry.ts
// Central concept & epistemological glossary registry for NOVARIC® framework surfaces

export interface ConceptOccurrence {
  page: 'maragonFramework' | 'methodology' | 'standards' | 'articleIntegrity' | 'mediaEducationFramework';
  anchorId: string;
  label: string;
}

export interface ConceptDefinition {
  id: string; // concept:xxx
  term_sq: string;
  term_en: string;
  definition: string;
  theorist: string;
  primary_citation_id?: string;
  occurrences: ConceptOccurrence[];
}

export const CONCEPT_REGISTRY: Record<string, ConceptDefinition> = {
  'concept:framing': {
    id: 'concept:framing',
    term_sq: 'Kornizimi (Framing)',
    term_en: 'Media Framing',
    definition: 'Procesi i përzgjedhjes së disa aspekteve të një realiteti të perceptuar dhe bërja e tyre më të spikatura në një tekst komunikues, në mënyrë që të promovohet një përkufizim i caktuar i problemit, interpretim kauzal, vlerësim moral, dhe/ose rekomandim trajtimi.',
    theorist: 'Robert M. Entman / Shanto Iyengar',
    primary_citation_id: 'ref:entman-1993',
    occurrences: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:A2.2',
        label: 'MARAGON A2.2 Paanshmëria & Anshmëria',
      },
      {
        page: 'maragonFramework',
        anchorId: 'maragon:ind:A2.2',
        label: 'MARAGON Individët: A2.2 Paanshmëria e Drejtuesit',
      },
      {
        page: 'mediaEducationFramework',
        anchorId: 'metrika-objektiviteti-toni',
        label: 'Udhëzuesi Publik: Metrika e Objektivitetit dhe Tonit (Kornizimi)',
      },
    ],
  },
  'concept:public_sphere': {
    id: 'concept:public_sphere',
    term_sq: 'Sfera Publike',
    term_en: 'Public Sphere',
    definition: 'Një hapësirë (metaforike) në jetën shoqërore ku individët mund të mblidhen për të diskutuar lirishëm dhe për të identifikuar problemet shoqërore, dhe përmes këtij diskutimi të ndikojnë në veprimin politik.',
    theorist: 'Jürgen Habermas / Zizi Papacharissi',
    primary_citation_id: 'ref:habermas-1989',
    occurrences: [
      {
        page: 'maragonFramework',
        anchorId: 'vizioni',
        label: 'MARAGON Vizioni: Përtej Metrikave të Thjeshta',
      },
      {
        page: 'maragonFramework',
        anchorId: 'maragon:O4.2',
        label: 'MARAGON O4.2 Kontributi në Diskursin Demokratik',
      },
    ],
  },
  'concept:media_capture': {
    id: 'concept:media_capture',
    term_sq: 'Kapja e Medias',
    term_en: 'Media Capture',
    definition: 'Një situatë ku media nuk është e pavarur dhe nuk i shërben interesit publik, por kontrollohet nga qeveria ose nga interesa të fuqishme private për të mbrojtur interesat e tyre.',
    theorist: 'Alina Mungiu-Pippidi',
    primary_citation_id: 'ref:mungiu-pippidi-2013',
    occurrences: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:G3.1',
        label: 'MARAGON G3.1 Ndikimi i Pronësisë',
      },
      {
        page: 'standards',
        anchorId: 'clause-TRANSP-4.1A',
        label: 'Kodi i Standardeve: Neni 4.1 Transparenca e Pronësisë',
      },
      {
        page: 'mediaEducationFramework',
        anchorId: 'shtylla-1-transparenca',
        label: 'Udhëzuesi Publik: Shtylla 1 (Transparenca dhe Pronësia)',
      },
    ],
  },
  'concept:churnalism': {
    id: 'concept:churnalism',
    term_sq: 'Churnalism',
    term_en: 'Churnalism',
    definition: 'Një formë gazetarie që mbështetet në ripërpunimin pasiv të njoftimeve për shtyp, historive të agjencive të lajmeve dhe materialeve të tjera të marrëdhënieve me publikun, në vend të raportimit origjinal.',
    theorist: 'Nick Davies',
    primary_citation_id: 'ref:davies-2008',
    occurrences: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:A2.3',
        label: 'MARAGON A2.3 Origjinaliteti & Thellësia',
      },
    ],
  },
  'concept:field_autonomy': {
    id: 'concept:field_autonomy',
    term_sq: 'Autonomia e Fushës Gazetareske',
    term_en: 'Journalistic Field Autonomy',
    definition: 'Koncepti i Pierre Bourdieu-së që përshkruan shkallën në të cilën fusha e gazetarisë është e pavarur nga presionet e jashtme (politike, ekonomike) dhe operon sipas logjikës dhe standardeve të veta profesionale.',
    theorist: 'Pierre Bourdieu',
    primary_citation_id: 'ref:bourdieu-1998',
    occurrences: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:G3.2',
        label: 'MARAGON G3.2 Kontrolli Editorial',
      },
      {
        page: 'standards',
        anchorId: 'clause-ETIK-3.1A',
        label: 'Kodi i Standardeve: Neni 3.1 Paanshmëria & Pavarësia',
      },
    ],
  },
  'concept:media_literacy': {
    id: 'concept:media_literacy',
    term_sq: 'Edukim Mediatik',
    term_en: 'Media Literacy',
    definition: 'Aftësia për të aksesuar, analizuar, vlerësuar, krijuar dhe vepruar duke përdorur të gjitha format e komunikimit.',
    theorist: 'Sonia Livingstone',
    primary_citation_id: 'ref:livingstone-2004',
    occurrences: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:O4.1',
        label: 'MARAGON O4.1 Promovimi i Edukimit Mediatik',
      },
      {
        page: 'methodology',
        anchorId: 'citations',
        label: 'Metodologjia: Korpusi Shkencor (Livingstone 2004)',
      },
    ],
  },
  'concept:public_journalism': {
    id: 'concept:public_journalism',
    term_sq: 'Gazetaria Publike',
    term_en: 'Public / Civic Journalism',
    definition: 'Një filozofi dhe praktikë gazetareske që synon të përfshijë qytetarët në debatin publik dhe të ndihmojë komunitetet të zgjidhin problemet e tyre, duke lëvizur përtej rolit tradicional të vëzhguesit pasiv.',
    theorist: 'Jay Rosen',
    primary_citation_id: 'ref:rosen-1999',
    occurrences: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:O4.2',
        label: 'MARAGON O4.2 Kontributi në Diskursin Demokratik',
      },
    ],
  },
  'concept:polarized_pluralism': {
    id: 'concept:polarized_pluralism',
    term_sq: 'Pluralist i Polarizuar',
    term_en: 'Polarized Pluralist Model',
    definition: 'Një model sistemi mediatik (tipik për Evropën Jugore) ku media ka një paralelizëm të lartë politik, një audiencë të kufizuar, dhe instrumentalizohet shpesh nga elitat politike dhe ekonomike.',
    theorist: 'Daniel C. Hallin & Paolo Mancini',
    primary_citation_id: 'ref:hallin-mancini-2004',
    occurrences: [
      {
        page: 'maragonFramework',
        anchorId: 'maragon:R1.1',
        label: 'MARAGON R1.1 Pajtueshmëria Rregullatore',
      },
      {
        page: 'mediaEducationFramework',
        anchorId: 'shtylla-1-transparenca',
        label: 'Udhëzuesi Publik: Shtylla 1 (Pluralizmi dhe Pavarësia)',
      },
    ],
  },
  'concept:hermeneutic_circle': {
    id: 'concept:hermeneutic_circle',
    term_sq: 'Rrethi Hermeneutik (Sinergjia Hermeneutike)',
    term_en: 'Hermeneutic Circle',
    definition: 'Qasje metodologjike sipas Hans-Georg Gadamer-it ku kuptimi i një teksti të tërë arrihet përmes referencës te pjesët përbërëse individuale, dhe kuptimi i çdo pjese kërkon kuptimin e së tërës. Në NOVARIC®, kjo udhëheq sinergjinë hermeneutike ku IA proceson pjesët dhe redaktori njerëzor vlerëson kontekstin e plotë shoqëror.',
    theorist: 'Hans-Georg Gadamer',
    primary_citation_id: 'ref:gadamer-1989',
    occurrences: [
      {
        page: 'methodology',
        anchorId: 'meth:step-3',
        label: 'Metodologjia: Hapi 3 (Mbikëqyrja Hermeneutike Njerëzore)',
      },
      {
        page: 'maragonFramework',
        anchorId: 'vleresimi-individe',
        label: 'MARAGON: Vlerësimi Granular - Individët (Agjenti vs Struktura)',
      },
      {
        page: 'standards',
        anchorId: 'clause-MET-A',
        label: 'Kodi i Standardeve: Neni 2.A Metodologji e Hapur',
      },
    ],
  },
};

export const getConceptById = (id: string): ConceptDefinition | undefined => {
  const normalizedId = id.startsWith('concept:') ? id : `concept:${id}`;
  return CONCEPT_REGISTRY[normalizedId];
};

export const getAllConcepts = (): ConceptDefinition[] => {
  return Object.values(CONCEPT_REGISTRY);
};

export const findConceptByTerm = (term: string): ConceptDefinition | undefined => {
  if (!term) return undefined;
  const lower = term.toLowerCase().trim();
  return Object.values(CONCEPT_REGISTRY).find(
    c => c.term_sq.toLowerCase().includes(lower) || 
         c.term_en.toLowerCase().includes(lower) ||
         lower.includes(c.term_sq.toLowerCase()) ||
         lower.includes(c.term_en.toLowerCase())
  );
};
