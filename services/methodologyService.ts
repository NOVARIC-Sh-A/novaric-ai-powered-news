// services/methodologyService.ts
import {
  MethodologyStep,
  FrameworkPrinciple,
  MethodReference,
  MethodologyAudit,
  MethodologyMetricsData,
  MethodologyResponse,
} from '../types/methodology';

export const FALLBACK_STEPS: MethodologyStep[] = [
  {
    id: 'step-1',
    order: 1,
    title: 'Hapi 1: Analiza Fillestare nga IA (Shkalla dhe Shpejtësia)',
    short_title: 'Analiza Fillestare nga IA',
    actor: 'ai',
    actor_label_sq: 'Modeli i Avancuar Gjuhësor (LLM / Nora AI)',
    body_text:
      'Një model i avancuar gjuhësor (LLM) kryen një analizë të gjerë në ueb për të gjetur burime relevante. Kjo fazë shfrytëzon aftësinë e IA-së për të identifikuar modele dhe për të mbledhur të dhëna në një shkallë të paarritshme për analistët njerëzorë, duke qenë të vetëdijshëm për rreziqet e "paragjykimit algoritmik" (Diakopoulos, 2019) dhe duke e përdorur atë si një mjet ndihmës, jo si një arbitër të së vërtetës.',
    inputs: [
      'Pretendimi publik i pretenduar apo lajmi në qarkullim',
      'Korpus burimesh të hapura (Open Web, arkiva zyrtare, regjistri i mediave)',
      'Katalogu i burimeve primare të indeksuara nga NOVARIC®',
    ],
    outputs: [
      'Indeksi i dëshmive të mbledhura dhe ekstrakti i entiteteve (NER)',
      'Matrica e relevancës me burime pro dhe kundër pretendimit',
      'Shenjimi i anomalive semantike dhe rreziqeve të mundshme manipuluese',
    ],
    safeguards: [
      'Modeli trajtohet rreptësisht si mjet ndihmës hulumtues, kurrë si arbitër i së vërtetës',
      'Parandalimi i halucinacioneve përmes kërkimit të detyrueshëm me tokën (grounding)',
      'Ndërgjegjësimi i koduar për paragjykimet algoritmike (Diakopoulos, 2019)',
      'Izolimi i plotë pa asnjë leje publikimi të drejtpërdrejtë në server',
    ],
    failure_modes: [
      'Paragjykimi algoritmik i ponderimit të burimeve (Algorithmic Bias)',
      'Optimizimi i verbër i shpejtësisë në kurriz të thellësisë kontekstuale',
    ],
    standards_clause_ids: ['MET-A', 'MET-B', 'MET-F', 'MET-G'],
    citation_keys: ['diakopoulos2019'],
  },
  {
    id: 'step-2',
    order: 2,
    title: 'Hapi 2: Gjenerimi i Draft-Rezultatit (Struktura Fillestare)',
    short_title: 'Gjenerimi i Draft-Rezultatit',
    actor: 'draft',
    actor_label_sq: 'Sistemi i Gjenerimit të Strukturuar (Draft Pipeline)',
    body_text:
      'Modeli gjeneron një verdikt paraprak, një përmbledhje dhe një listë burimesh, duke përfshirë prova pro dhe kundër pretendimit. Ky draft shërben si një pikënisje e strukturuar për ekipin redaksional.',
    inputs: [
      'Të dhënat e strukturuara dhe lidhjet e burimeve nga Hapi 1',
      'Shablloni formal i verifikimit sipas standardeve të EFCSN/IFCN',
      'Kriteret e taksonomisë faktike (E Saktë, E Pasaktë, Gjysmë e Vërtetë, Jashtë Kontekstit)',
    ],
    outputs: [
      'Verdikti paraprak hipotetik (i paverifikuar)',
      'Përmbledhja ekzekutive e provave të gjetura',
      'Inventari me dy kolona: Prova PRO vs. Prova KUNDËR pretendimit',
      'Dosja e papërpunuar për shqyrtim njerëzor (Review Ticket)',
    ],
    safeguards: [
      'Drafti etiketohet qartësisht me flamur "DRAFT I PAPUBLIKUESHËM"',
      'Asnjë rrugëdalje e automatizuar drejt rrjeteve sociale apo faqes kryesore',
      'Transparencë e plotë mbi prompt-et dhe parametrat e përdorur në gjenerim',
    ],
    failure_modes: [
      'Verdikt i nxituar bazuar në sasi provash dhe jo në cilësi provash',
      'Mungesë e konsideratës për nuancat ligjore dhe kushtetuese vendore',
    ],
    standards_clause_ids: ['MET-E', 'MET-H', 'MET-I'],
    citation_keys: [],
  },
  {
    id: 'step-3',
    order: 3,
    title: 'Hapi 3: Rishikimi dhe Verifikimi Njerëzor (Mbikëqyrja Hermeneutike)',
    short_title: 'Rishikimi dhe Verifikimi Njerëzor (Hapi Kritik)',
    actor: 'human_team',
    actor_label_sq: 'Ekipi Redaksional Njerëzor (Redaktorët & Paneli Shkencor)',
    body_text:
      'Drafti i IA-së nuk publikohet kurrë automatikisht. Këtu fillon procesi thelbësor i interpretimit njerëzor. Ekipi ynë i redaktorëve me përvojë ndjek katër shtylla themelore hermeneutike përpara se të marrë vendimin përfundimtar.',
    sub_points: [
      {
        id: 'sp-1',
        title: 'Verifikon Burimet',
        text: 'Vlerëson besueshmërinë, reputacionin dhe pozicionalitetin e çdo burimi të përdorur në hulumtim.',
      },
      {
        id: 'sp-2',
        title: 'Shton Kontekstin (Parimi Hermeneutik)',
        text: 'Plotëson analizën me kontekstin e nevojshëm historik, politik ose social, duke ndjekur "rrethin hermeneutik" për të ndërtuar një kuptim të plotë (Gadamer, 1989).',
      },
      {
        id: 'sp-3',
        title: 'Vlerëson Nuancat',
        text: 'Analizon gjuhën manipulative, ironinë, mungesën e theksuar të informacionit dhe taktikat e tjera retorike që makinat nuk mund t\'i zbërthejnë.',
      },
      {
        id: 'sp-4',
        title: 'Jep Miratimin Final',
        text: 'Vetëm pasi ekipi njerëzor është plotësisht i bindur për saktësinë dhe paanshmërinë, rezultati finalizohet. Përgjegjësia editoriale mbetet tërësisht njerëzore.',
      },
    ],
    inputs: [
      'Draft-paketa nga Hapi 2',
      'Kontaktimi i drejtpërdrejtë me palët e përmendura (E drejta e përgjigjes)',
      'Ekspertiza profesionale e redaktorëve dhe bibliografia e akredituar',
    ],
    outputs: [
      'Artikulli i plotë i miratuar i verifikimit të fakteve',
      'Nënshkrimi dixhital i redaktorit përgjegjës (Editorial Sign-off)',
      'Auditimi i integritetit me 15 metrika dhe lidhja me standardet',
    ],
    safeguards: [
      'Rregulli i detyrueshëm me katër sy (Peer Review nga të paktën dy persona)',
      'Gjurmueshmëria e plotë e çdo ndërhyrjeje në tekstin e draftit',
      'Përgjegjësi ligjore dhe etike personale e deklaruar publikisht',
    ],
    failure_modes: [
      'Ndërhyrje subjektive e paargumentuar (e zbutur nga protokolli me katër sy)',
    ],
    standards_clause_ids: ['MET-J', 'MET-K', 'ETIK-1A', 'ETIK-1D', 'ETIK-2C'],
    citation_keys: ['gadamer1989'],
  },
];

export const FALLBACK_PRINCIPLES: FrameworkPrinciple[] = [
  {
    id: 'principle-1',
    title: 'Lufta Kundër Dezinformimit',
    body_text:
      'Përtej etiketimit të informacionit si "i rremë", ne synojmë të shpjegojmë pse ai është i gabuar. Kjo kontribuon drejtpërdrejt në edukimin mediatik të publikut (Livingstone, 2004).',
    legal_anchor: 'dsa',
    legal_anchor_label: 'DSA Nenet 34 & 35',
    legal_anchor_detail:
      'Akti i Shërbimeve Dixhitale i BE-së: Detyrimi për vlerësimin dhe zbutjen e rreziqeve sistemike në hapësirën publike dixhitale dhe edukimi mediatik i qytetarëve.',
    standards_ref: 'Neni 2 (MET-C, MET-D)',
    evidence_url: '/standards/perputhshmeri',
    status_badge: 'E ZBATUAR',
    citation_keys: ['livingstone2004'],
  },
  {
    id: 'principle-2',
    title: 'Pavarësia Editoriale',
    body_text:
      'NOVARIC® operon me pavarësi të plotë editoriale, një garanci thelbësore kundër rrezikut të "kapjes së medias" (Mungiu-Pippidi, 2013).',
    legal_anchor: 'emfa',
    legal_anchor_label: 'EMFA Neni 6',
    legal_anchor_detail:
      'Akti Evropian i Lirisë së Medias (European Media Freedom Act): Mbrojtja e patundshme e linjës editoriale nga ndërhyrjet politike, shtetërore apo oligarkike.',
    standards_ref: 'Neni 3.1 (ETIK-1A, ETIK-1B)',
    evidence_url: '/standards/transparence',
    status_badge: 'GARANTUAR',
    citation_keys: ['mungiu2013'],
  },
  {
    id: 'principle-3',
    title: 'Transparenca e Pronësisë',
    body_text:
      'Ne jemi transparentë për strukturën dhe financimin tonë, duke i dhënë mundësi audiencës të vlerësojë vetë pavarësinë tonë.',
    legal_anchor: 'emfa',
    legal_anchor_label: 'EMFA Neni 6.1',
    legal_anchor_detail:
      'Detyrimi ligjor i ofruesve të shërbimeve mediatike për të bërë publike pronësinë e drejtpërdrejtë dhe të tërthortë, burimet financiare dhe deklaratat vjetore.',
    standards_ref: 'Neni 4.1 & 4.2 (TRAN-1A, TRAN-2A)',
    evidence_url: '/standards/transparence',
    status_badge: 'PUBLIKE',
    citation_keys: [],
  },
  {
    id: 'principle-4',
    title: 'Mekanizmat e Raportimit dhe Korrigjimit',
    body_text:
      'Ne ofrojmë mekanizma të qartë për përdoruesit për të raportuar pasaktësi. Transparenca për gabimet është një shenjë force dhe besueshmërie, jo dobësie (Kovach & Rosenstiel, 2014).',
    legal_anchor: 'dsa',
    legal_anchor_label: 'DSA Neni 16 & EFCSN 3.3',
    legal_anchor_detail:
      'Mekanizmat e Njoftimit dhe Veprimit (Notice-and-Action): E drejta e përdoruesit për të ankimuar përmbajtjen me një SLA të garantuar shqyrtimi brenda 7 ditëve.',
    standards_ref: 'Neni 3.3 (ETIK-3A, ETIK-3D)',
    evidence_url: '/standards/korrigjime',
    status_badge: 'LIVE 24/7',
    citation_keys: ['kovach2014'],
  },
];

export const FALLBACK_REFERENCES: MethodReference[] = [
  {
    id: 'ref-1',
    key: 'chadwick2017',
    citation:
      'Chadwick, A. (2017). The hybrid media system: Politics and power (2nd ed.). Oxford University Press.',
    short_cite: 'Chadwick, 2017',
    authors: 'Chadwick, Andrew',
    year: 2017,
    title: 'The hybrid media system: Politics and power',
    publisher_or_journal: 'Oxford University Press (2nd ed.)',
    type: 'book',
    type_label_sq: 'Libër Akademik',
    usage_anchors: [
      {
        section_id: 'sec-hyrje',
        section_title: 'Hyrje',
        excerpt:
          'Në epokën e "sistemit mediatik hibrid", ku teknologjia e platformave dixhitale ndërthuret me logjikat e vjetra mediatike (Chadwick, 2017)...',
      },
    ],
    external_url: 'https://global.oup.com/academic/product/the-hybrid-media-system-9780190696726',
  },
  {
    id: 'ref-2',
    key: 'diakopoulos2019',
    citation:
      'Diakopoulos, N. (2019). Automating the news: How algorithms are rewriting the media. Harvard University Press.',
    short_cite: 'Diakopoulos, 2019',
    authors: 'Diakopoulos, Nicholas',
    year: 2019,
    title: 'Automating the news: How algorithms are rewriting the media',
    publisher_or_journal: 'Harvard University Press',
    type: 'book',
    type_label_sq: 'Libër Akademik',
    usage_anchors: [
      {
        section_id: 'sec-metodologjia',
        section_title: 'Hapi 1: Analiza Fillestare nga IA',
        excerpt:
          '...duke qenë të vetëdijshëm për rreziqet e "paragjykimit algoritmik" (Diakopoulos, 2019) dhe duke e përdorur atë si një mjet ndihmës, jo si një arbitër të së vërtetës.',
      },
    ],
    external_url: 'https://www.hup.harvard.edu/books/9780674976986',
  },
  {
    id: 'ref-3',
    key: 'gadamer1989',
    citation:
      'Gadamer, H.-G. (1989). Truth and method (2nd rev. ed., J. Weinsheimer & D. G. Marshall, Trans.). Sheed & Ward.',
    short_cite: 'Gadamer, 1989',
    authors: 'Gadamer, Hans-Georg',
    year: 1989,
    title: 'Truth and method',
    publisher_or_journal: 'Sheed & Ward (Përkth. J. Weinsheimer & D. G. Marshall)',
    type: 'book',
    type_label_sq: 'Libër Akademik',
    usage_anchors: [
      {
        section_id: 'sec-metodologjia',
        section_title: 'Hapi 3: Rishikimi dhe Verifikimi Njerëzor',
        excerpt:
          'Plotëson analizën me kontekstin e nevojshëm historik, politik ose social, duke ndjekur "rrethin hermeneutik" për të ndërtuar një kuptim të plotë (Gadamer, 1989).',
      },
    ],
    external_url: 'https://www.bloomsbury.com/uk/truth-and-method-9781780936284/',
  },
  {
    id: 'ref-4',
    key: 'kovach2014',
    citation:
      'Kovach, B., & Rosenstiel, T. (2014). The elements of journalism: What newspeople should know and the public should expect (3rd ed.). Three Rivers Press.',
    short_cite: 'Kovach & Rosenstiel, 2014',
    authors: 'Kovach, Bill & Rosenstiel, Tom',
    year: 2014,
    title: 'The elements of journalism: What newspeople should know and the public should expect',
    publisher_or_journal: 'Three Rivers Press (3rd ed.)',
    type: 'book',
    type_label_sq: 'Libër Akademik',
    usage_anchors: [
      {
        section_id: 'sec-pergjegjesia',
        section_title: 'Mekanizmat e Raportimit dhe Korrigjimit',
        excerpt:
          'Transparenca për gabimet është një shenjë force dhe besueshmërie, jo dobësie (Kovach & Rosenstiel, 2014).',
      },
    ],
    external_url: 'https://www.penguinrandomhouse.com/books/227568/the-elements-of-journalism-revised-and-updated-4th-edition-by-bill-kovach-and-tom-rosenstiel/',
  },
  {
    id: 'ref-5',
    key: 'livingstone2004',
    citation:
      'Livingstone, S. (2004). Media literacy and the challenge of new information and communication technologies. The Communication Review, 7(1), 3–14.',
    short_cite: 'Livingstone, 2004',
    authors: 'Livingstone, Sonia',
    year: 2004,
    title: 'Media literacy and the challenge of new information and communication technologies',
    publisher_or_journal: 'The Communication Review, 7(1), 3–14',
    type: 'journal',
    type_label_sq: 'Artikull Shkencor',
    usage_anchors: [
      {
        section_id: 'sec-pergjegjesia',
        section_title: 'Lufta Kundër Dezinformimit',
        excerpt:
          'Përtej etiketimit të informacionit si "i rremë", ne synojmë të shpjegojmë pse ai është i gabuar. Kjo kontribuon drejtpërdrejt në edukimin mediatik të publikut (Livingstone, 2004).',
      },
    ],
    external_url: 'https://doi.org/10.1080/10714420490280152',
  },
  {
    id: 'ref-6',
    key: 'mungiu2013',
    citation:
      'Mungiu-Pippidi, A. (2013). Freedom without impartiality: The Vicious Circle of media capture. In P. N. Howard & M. M. Hussain (Eds.), Democracy\'s fourth wave? Digital media and the Arab Spring (pp. 45-66). Oxford University Press.',
    short_cite: 'Mungiu-Pippidi, 2013',
    authors: 'Mungiu-Pippidi, Alina',
    year: 2013,
    title: 'Freedom without impartiality: The Vicious Circle of media capture',
    publisher_or_journal: 'Democracy\'s fourth wave? Digital media and the Arab Spring (pp. 45-66). Oxford University Press',
    type: 'book',
    type_label_sq: 'Libër Akademik',
    usage_anchors: [
      {
        section_id: 'sec-pergjegjesia',
        section_title: 'Pavarësia Editoriale',
        excerpt:
          'NOVARIC® operon me pavarësi të plotë editoriale, një garanci thelbësore kundër rrezikut të "kapjes së medias" (Mungiu-Pippidi, 2013).',
      },
    ],
    external_url: 'https://global.oup.com/academic/product/democracys-fourth-wave-9780199936953',
  },
  {
    id: 'ref-7',
    key: 'wardle2017',
    citation:
      'Wardle, C., & Derakhshan, H. (2017). Information disorder: Toward an interdisciplinary framework for research and policymaking. Council of Europe.',
    short_cite: 'Wardle & Derakhshan, 2017',
    authors: 'Wardle, Claire & Derakhshan, Hossein',
    year: 2017,
    title: 'Information disorder: Toward an interdisciplinary framework for research and policymaking',
    publisher_or_journal: 'Council of Europe Report DGI(2017)09',
    type: 'report',
    type_label_sq: 'Raport Ndërkombëtar',
    usage_anchors: [
      {
        section_id: 'sec-hyrje',
        section_title: 'Hyrje',
        excerpt:
          'Kjo kornizë nuk është thjesht një listë rregullash, por një përgjigje strategjike ndaj sfidave të "çrregullimit informativ" (Wardle & Derakhshan, 2017)...',
      },
    ],
    external_url: 'https://rm.coe.int/information-disorder-toward-an-interdisciplinary-framework-for-researc/168076277c',
  },
];

export const FALLBACK_AUDITS: MethodologyAudit[] = [
  {
    id: 'AUD-MET-2026-01',
    audited_at: '2026-08-12T10:00:00Z',
    auditor: 'Këshilli Mbikëqyrës i Pavarur & Zyra e Standardeve NOVARIC®',
    result: 'passed',
    result_label_sq: 'Miratuar pa Vërejtje Thelbësore',
    compliance_score: 98.4,
    notes:
      'Auditim i plotë i zbatimit të sinergjisë hermeneutike mes LLM dhe ekipit njerëzor. Nuk u identifikua asnjë publikim autonom pa miratim editorial me dy nënshkrime.',
    next_audit_at: '2026-11-15T09:00:00Z',
  },
];

export const FALLBACK_METRICS: MethodologyMetricsData = {
  word_count_hint: 940,
  methodology_version: 'v2.4.1 (Miratuar)',
  last_audit_at: '2026-08-12T10:00:00Z',
  next_audit_at: '2026-11-15T09:00:00Z',
  human_review_status: '100% Mbikëqyrje Njerëzore (Human-in-the-Loop)',
  ai_involvement_indicator: 'Ndihmës Hulumtues (Pa Publikim Autonom)',
  section_count: 5,
  reference_count: 7,
  methodological_steps_count: 3,
  principles_count: 4,
};

class MethodologyService {
  async getMethodologyData(): Promise<MethodologyResponse> {
    try {
      const res = await fetch('/api/v1/methodology', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.steps && json.principles && json.references) {
          return {
            steps: json.steps,
            principles: json.principles,
            references: json.references,
            metrics: json.metrics || FALLBACK_METRICS,
            isFixture: false,
          };
        }
      }
    } catch {
      // Fallback
    }
    return {
      steps: FALLBACK_STEPS,
      principles: FALLBACK_PRINCIPLES,
      references: FALLBACK_REFERENCES,
      metrics: FALLBACK_METRICS,
      isFixture: true,
    };
  }

  async getAudits(): Promise<{ audits: MethodologyAudit[]; isFixture: boolean }> {
    try {
      const res = await fetch('/api/v1/methodology/audits', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.audits)) {
          return { audits: json.audits, isFixture: false };
        }
      }
    } catch {
      // Fallback
    }
    return { audits: FALLBACK_AUDITS, isFixture: true };
  }
}

export const methodologyService = new MethodologyService();
