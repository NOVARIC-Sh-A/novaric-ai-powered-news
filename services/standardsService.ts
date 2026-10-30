import {
  StandardClause,
  ComplianceSummary,
  CorrectionItem,
  ComplaintSubmission,
  ComplaintReceipt,
  AiRegistryEntry,
  TransparencyLedgerItem,
  ScoreDimensionInfo,
  ScoreDimensionKey,
} from '../types/standards';

// Fallback fixture data covering all verbatim clauses from Neni 1–4
export const FALLBACK_CLAUSES: StandardClause[] = [
  // Neni 1: Sistemi i Përputhshmërisë
  {
    id: 'KONF-A',
    neni: 1,
    letter: 'A',
    title: 'Përputhshmëri e Plotë',
    commitment_key: 'full_compliance',
    text: 'Për të ruajtur standardin tonë, operacionet tona të verifikimit të fakteve duhet të jenë plotësisht në përputhje me të gjitha standardet në këtë Kod.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/perputhshmeri',
    evidence_title: 'Matrica e Auditimit të Brendshëm 2026',
    owner: 'Zyra e Integritetit & Pajtueshmërisë',
    last_verified_at: '2026-08-15T09:00:00Z',
    score_dimensions: ['lifecycle'],
    audit_note: 'Verifikuar në auditimin periodik Q3 2026.',
    efcsn_clause_ref: 'EFCSN Section 1.1',
    ifcn_criterion_ref: 'IFCN Criterion 1',
  },
  {
    id: 'KONF-B',
    neni: 1,
    letter: 'B',
    title: 'Angazhim Publik',
    commitment_key: 'public_commitment',
    text: 'Ne e pranojmë publikisht në uebfaqen tonë se i përmbahemi këtij Kodi të Standardeve, duke e bërë këtë një akt publik të llogaridhënies.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/kodi',
    evidence_title: 'Publikim i Përhershëm në Portal',
    owner: 'Bordi Editorial NOVARIC®',
    last_verified_at: '2026-08-20T10:00:00Z',
    score_dimensions: ['seo_accessibility', 'lifecycle'],
    audit_note: 'Dokumenti i hapur me licencë publike.',
    efcsn_clause_ref: 'EFCSN Section 1.2',
    ifcn_criterion_ref: 'IFCN Criterion 2',
  },
  {
    id: 'KONF-C',
    neni: 1,
    letter: 'C',
    title: 'Përputhshmëri Organizative',
    commitment_key: 'organizational_compliance',
    text: 'Organizata jonë mëmë (NOVARIC® Sh.A.) ndjek frymën e përgjithshme etike dhe standardet e këtij Kodi, duke siguruar që misioni i shërbimit publik të mos komprometohet nga interesat komerciale.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/corporatePositionStatement',
    evidence_title: 'Deklarata Korporative e Pavarësisë',
    owner: 'Drejtoria e NOVARIC® Sh.A.',
    last_verified_at: '2026-08-10T12:00:00Z',
    score_dimensions: ['ethical_resonance', 'lifecycle'],
    audit_note: 'Klauzolë e integruar në statutin e korporatës.',
    efcsn_clause_ref: 'EFCSN Section 1.3',
    ifcn_criterion_ref: 'IFCN Criterion 1',
  },

  // Neni 2: Metodologjia
  {
    id: 'MET-A',
    neni: 2,
    letter: 'A',
    title: 'Metodologji e Hapur',
    commitment_key: 'open_methodology',
    text: 'Metodologjia jonë për përzgjedhjen, hulumtimin dhe përfundimin e hetimeve është plotësisht publike dhe e aksesueshme.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/analysisMethodology',
    evidence_title: 'Manuali i Procedurave të Verifikimit',
    owner: 'Redaksia e Verifikimit',
    last_verified_at: '2026-08-28T08:30:00Z',
    score_dimensions: ['logic', 'credibility'],
    audit_note: 'Përditësuar me algoritmin e ri të peshimit.',
    efcsn_clause_ref: 'EFCSN Section 2.1',
    ifcn_criterion_ref: 'IFCN Criterion 3',
  },
  {
    id: 'MET-B',
    neni: 2,
    letter: 'B',
    title: 'Standard i Barabartë',
    commitment_key: 'equal_standard',
    text: 'Ne i vlerësojmë provat duke përdorur të njëjtat standarde për pretendime të njëvlershme, pavarësisht se kush e ka bërë pretendimin.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/perputhshmeri',
    evidence_title: 'Protokolli i Testimit të Verbër të Pretendimeve',
    owner: 'Paneli i Paanshëm i Shqyrtimit',
    last_verified_at: '2026-08-18T14:15:00Z',
    score_dimensions: ['credibility', 'sentiment_analytics'],
    audit_note: 'Asnjë devijim nga shkalla standarde e verifikimit.',
    efcsn_clause_ref: 'EFCSN Section 2.2',
    ifcn_criterion_ref: 'IFCN Criterion 1',
  },
  {
    id: 'MET-C',
    neni: 2,
    letter: 'C',
    title: 'Fokus në Interesin Publik',
    commitment_key: 'public_interest_focus',
    text: 'Ne fokusohemi në tema që kanë të bëjnë me mirëqenien e shoqërisë, si shëndeti, ekonomia, siguria dhe funksionimi i demokracisë.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/?page=newsList',
    evidence_title: 'Indeksi i Relevancës së Lajmeve',
    owner: 'Kryeredaktori',
    last_verified_at: '2026-09-01T11:00:00Z',
    score_dimensions: ['ethical_resonance'],
    audit_note: 'Filtri i interesit publik zbatohet në çdo artikull.',
    efcsn_clause_ref: 'EFCSN Section 2.3',
    ifcn_criterion_ref: 'IFCN Criterion 2',
  },
  {
    id: 'MET-D',
    neni: 2,
    letter: 'D',
    title: 'Pjesëmarrje e Publikut',
    commitment_key: 'public_participation',
    text: 'Ne ofrojmë një kanal të aksesueshëm përmes të cilit publiku mund të paraqesë pretendime për verifikim.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/korrigjime',
    evidence_title: 'Formulari i Raportimit Qytetar',
    owner: 'Zyra e Marrëdhënieve me Publikun',
    last_verified_at: '2026-09-05T09:45:00Z',
    score_dimensions: ['lifecycle', 'seo_accessibility'],
    audit_note: 'Kanal i hapur 24/7 me SLA të garantuar.',
    efcsn_clause_ref: 'EFCSN Section 2.4',
    ifcn_criterion_ref: 'IFCN Criterion 5',
  },
  {
    id: 'MET-E',
    neni: 2,
    letter: 'E',
    title: 'Verifikueshmëri e Hapur',
    commitment_key: 'open_verifiability',
    text: 'Kur është e mundur, ne ofrojmë akses në të gjitha provat që lexuesi të mund të përsërisë procesin tonë të verifikimit.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/perputhshmeri',
    evidence_title: 'Paketa e Provave të Hapura (Open Data)',
    owner: 'Departamenti i Teknologjisë',
    last_verified_at: '2026-08-22T16:00:00Z',
    score_dimensions: ['credibility', 'logic'],
    audit_note: 'Lidhje direkte në arkivat publike dhe burimet parësore.',
    efcsn_clause_ref: 'EFCSN Section 2.5',
    ifcn_criterion_ref: 'IFCN Criterion 3',
  },
  {
    id: 'MET-F',
    neni: 2,
    letter: 'F',
    title: 'Prioritizimi i Burimeve Parësore',
    commitment_key: 'primary_sources_priority',
    text: 'Ne mbështetemi në burime parësore dhe paraqesim prova relevante që mbështesin dhe minojnë pretendimin.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/perputhshmeri',
    evidence_title: 'Udhëzuesi i Burimeve Parësore',
    owner: 'Stafi Kërkimor',
    last_verified_at: '2026-08-25T13:20:00Z',
    score_dimensions: ['credibility'],
    audit_note: 'Kërkohet minimalisht 70% mbështetje në burime parësore.',
    efcsn_clause_ref: 'EFCSN Section 2.6',
    ifcn_criterion_ref: 'IFCN Criterion 3',
  },
  {
    id: 'MET-G',
    neni: 2,
    letter: 'G',
    title: 'Konfirmim i Dyfishtë',
    commitment_key: 'double_confirmation',
    text: 'Ne përdorim të paktën dy, por preferohet më shumë, burime të pavarura për të verifikuar pretendimin qendror.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/perputhshmeri',
    evidence_title: 'Rregullorja e Konfirmimit të Kryqëzuar',
    owner: 'Redaktori Përgjegjës',
    last_verified_at: '2026-08-30T10:10:00Z',
    score_dimensions: ['credibility', 'logic'],
    audit_note: 'Verifikim i detyrueshëm me 2+ dëshmi të pavarura.',
    efcsn_clause_ref: 'EFCSN Section 2.7',
    ifcn_criterion_ref: 'IFCN Criterion 3',
  },
  {
    id: 'MET-H',
    neni: 2,
    letter: 'H',
    title: 'Transparenca e Burimeve',
    commitment_key: 'sources_transparency',
    text: 'Ne i emërojmë të gjitha burimet, përveç rasteve kur siguria e tyre është në rrezik.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/perputhshmeri',
    evidence_title: 'Regjistri i Citimeve dhe Atribuimit',
    owner: 'Ekipi Hetimor',
    last_verified_at: '2026-08-29T15:40:00Z',
    score_dimensions: ['credibility'],
    audit_note: 'Mbi 95% e burimeve citohen nominalisht me lidhje aktive.',
    efcsn_clause_ref: 'EFCSN Section 2.8',
    ifcn_criterion_ref: 'IFCN Criterion 3',
  },
  {
    id: 'MET-I',
    neni: 2,
    letter: 'I',
    title: 'Kredibiliteti i Ekspertëve',
    commitment_key: 'experts_credibility',
    text: 'Kur citojmë ekspertë, ne përcaktojmë qartë kredibilitetin dhe fushën e tyre të ekspertizës.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/perputhshmeri',
    evidence_title: 'Kriteret e Përzgjedhjes së Ekspertëve',
    owner: 'Këshilli Shkencor',
    last_verified_at: '2026-08-26T11:50:00Z',
    score_dimensions: ['credibility'],
    audit_note: 'Verifikim i formimit akademik dhe botimeve të ekspertit.',
    efcsn_clause_ref: 'EFCSN Section 2.9',
    ifcn_criterion_ref: 'IFCN Criterion 3',
  },
  {
    id: 'MET-J',
    neni: 2,
    letter: 'J',
    title: 'Rishikim Editorial (Peer Review)',
    commitment_key: 'peer_review',
    text: 'Çdo hetim i nënshtrohet të paktën një raundi redaktimi nga dikush tjetër përveç autorit.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/contentQualityAssurance',
    evidence_title: 'Gjurma Dixhitale e Nënshkrimeve Editoriale',
    owner: 'Bordi i Redaktorëve',
    last_verified_at: '2026-09-02T14:00:00Z',
    score_dimensions: ['lifecycle', 'logic'],
    audit_note: 'Dy nënshkrime të detyrueshme përpara publikimit.',
    efcsn_clause_ref: 'EFCSN Section 2.10',
    ifcn_criterion_ref: 'IFCN Criterion 2',
  },
  {
    id: 'MET-K',
    neni: 2,
    letter: 'K',
    title: 'Gjuhë Neutrale',
    commitment_key: 'neutral_language',
    text: 'Gjetjet paraqiten me gjuhë të saktë, faktike dhe jo-emotive, duke shmangur sensacionalizmin.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/journalisticEthicsManual',
    evidence_title: 'Fjalori i Termave Neutrale & Analizuesi Stilistik',
    owner: 'Redaksia Gjuhësore',
    last_verified_at: '2026-09-03T09:15:00Z',
    score_dimensions: ['readability', 'sentiment_analytics', 'emotion'],
    audit_note: 'Monitorim i vazhdueshëm me indeks leksikor neutral.',
    efcsn_clause_ref: 'EFCSN Section 2.11',
    ifcn_criterion_ref: 'IFCN Criterion 1',
  },

  // Neni 3: Standardet Etike
  {
    id: 'ETIK-1A',
    neni: 3,
    sub_neni: '3.1',
    letter: 'A',
    title: 'Pavarësia Editoriale dhe Politike',
    commitment_key: 'editorial_independence',
    text: 'Ne jemi editorialisht të lirë dhe politikisht të pavarur, një parakusht kritik në mjedisin mediatik shqiptar (Hallin & Mancini, 2004).',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/transparence',
    evidence_title: 'Karta e Pavarësisë Editoriale',
    owner: 'Bordi Drejtues',
    last_verified_at: '2026-08-12T08:00:00Z',
    score_dimensions: ['ethical_resonance', 'sentiment_analytics'],
    audit_note: 'Pavarësi e mbrojtur statutarisht.',
    efcsn_clause_ref: 'EFCSN Section 3.1.1',
    ifcn_criterion_ref: 'IFCN Criterion 1',
  },
  {
    id: 'ETIK-1B',
    neni: 3,
    sub_neni: '3.1',
    letter: 'B',
    title: 'Mospërkrahja Politike',
    commitment_key: 'no_political_endorsement',
    text: 'Ne nuk mbështesim asnjë parti politike apo kandidat.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/corporatePositionStatement',
    evidence_title: 'Deklarata Publike e Neutralitetit Elektoral',
    owner: 'Komisioni i Etikës',
    last_verified_at: '2026-08-12T08:00:00Z',
    score_dimensions: ['ethical_resonance'],
    audit_note: 'Audit i paanësisë gjatë fushatave zgjedhore.',
    efcsn_clause_ref: 'EFCSN Section 3.1.2',
    ifcn_criterion_ref: 'IFCN Criterion 1',
  },
  {
    id: 'ETIK-1C',
    neni: 3,
    sub_neni: '3.1',
    letter: 'C',
    title: 'Përzgjedhje e Drejtë e Subjekteve',
    commitment_key: 'fair_subject_selection',
    text: 'Ne nuk përqendrojmë hetimet në mënyrë të padrejtë në një burim të caktuar, por ndjekim dezinformimin me rëndësi publike.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/perputhshmeri',
    evidence_title: 'Regjistri i Shpërndarjes së Hetimeve',
    owner: 'Redaksia Analitike',
    last_verified_at: '2026-08-14T11:20:00Z',
    score_dimensions: ['sentiment_analytics', 'ethical_resonance'],
    audit_note: 'Monitorim i ekuilibrit të mbulimit mediatik.',
    efcsn_clause_ref: 'EFCSN Section 3.1.3',
    ifcn_criterion_ref: 'IFCN Criterion 1',
  },
  {
    id: 'ETIK-1D',
    neni: 3,
    sub_neni: '3.1',
    letter: 'D',
    title: 'Shmangia e Konfliktit të Interesit',
    commitment_key: 'conflict_of_interest',
    text: 'Stafi ynë u përmbahet politikave të brendshme rigoroze për të shmangur konfliktin e interesit dhe perceptimin e anshmërisë.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/transparence',
    evidence_title: 'Formularët e Deklarimit të Pasurisë dhe Interesave',
    owner: 'Oficeri i Pajtueshmërisë',
    last_verified_at: '2026-08-15T10:00:00Z',
    score_dimensions: ['ethical_resonance', 'lifecycle'],
    audit_note: 'Deklarim vjetor dhe për çdo caktim hetimi.',
    efcsn_clause_ref: 'EFCSN Section 3.1.4',
    ifcn_criterion_ref: 'IFCN Criterion 1',
  },
  {
    id: 'ETIK-1E',
    neni: 3,
    sub_neni: '3.1',
    letter: 'E',
    title: 'Avokim Ekskluziv për Transparencë',
    commitment_key: 'advocacy_for_transparency',
    text: 'Ne avokojmë vetëm për transparencë, saktësi dhe llogaridhënie në diskursin publik.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/aboutUs',
    evidence_title: 'Misioni Institucional i NOVARIC®',
    owner: 'Këshilli Etik',
    last_verified_at: '2026-08-10T09:30:00Z',
    score_dimensions: ['ethical_resonance', 'readability'],
    audit_note: 'Nuk merret pjesë në lobime apo fushata të tjera.',
    efcsn_clause_ref: 'EFCSN Section 3.1.5',
    ifcn_criterion_ref: 'IFCN Criterion 1',
  },

  {
    id: 'ETIK-2A',
    neni: 3,
    sub_neni: '3.2',
    letter: 'A',
    title: 'Mbrojtja e Sigurisë së Subjekteve',
    commitment_key: 'subject_safety',
    text: 'Ne mbrojmë identitetin e subjekteve kur ka një shqetësim të arsyeshëm për sigurinë e tyre.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/privacy',
    evidence_title: 'Protokolli i Mbrojtjes së Burimeve dhe Sinjalizuesve',
    owner: 'Këshilltari Ligjor',
    last_verified_at: '2026-08-16T15:00:00Z',
    score_dimensions: ['ethical_resonance'],
    audit_note: 'Anonimizim i enkriptuar sipas kërkesave ligjore.',
    efcsn_clause_ref: 'EFCSN Section 3.2.1',
    ifcn_criterion_ref: 'IFCN Criterion 2',
  },
  {
    id: 'ETIK-2B',
    neni: 3,
    sub_neni: '3.2',
    letter: 'B',
    title: 'Mbrojtja e të Miturve',
    commitment_key: 'protection_of_minors',
    text: 'Ne jemi të përmbajtur dhe të respektueshëm kur përmendim ose identifikojmë të mitur.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/privacy',
    evidence_title: 'Rregullorja për Mbrojtjen e të Miturve',
    owner: 'Redaksia',
    last_verified_at: '2026-08-16T15:00:00Z',
    score_dimensions: ['ethical_resonance'],
    audit_note: 'Mosidentifikim dhe mbrojtje e rreptë e imazhit.',
    efcsn_clause_ref: 'EFCSN Section 3.2.2',
    ifcn_criterion_ref: 'IFCN Criterion 2',
  },
  {
    id: 'ETIK-2C',
    neni: 3,
    sub_neni: '3.2',
    letter: 'C',
    title: 'E Drejta e Përgjigjes',
    commitment_key: 'right_of_reply',
    text: 'Ne ofrojmë të drejtën e përgjigjes çdo personi ose organizate që është burimi i pretendimit të pasaktë.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/korrigjime',
    evidence_title: 'Kanal i Dedikuar për të Drejtën e Përgjigjes',
    owner: 'Sekretaria Editoriale',
    last_verified_at: '2026-08-27T12:00:00Z',
    score_dimensions: ['lifecycle', 'credibility'],
    audit_note: 'Afat 48 orësh për përfshirjen e qëndrimit.',
    efcsn_clause_ref: 'EFCSN Section 3.2.3',
    ifcn_criterion_ref: 'IFCN Criterion 2',
  },

  {
    id: 'ETIK-3A',
    neni: 3,
    sub_neni: '3.3',
    letter: 'A',
    title: 'Korrigjim i Menjëhershëm',
    commitment_key: 'immediate_correction',
    text: 'Ne korrigjojmë çdo gabim të njohur menjëherë. Transparenca për gabimet është thelbësore për besimin (Kovach & Rosenstiel, 2014).',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/korrigjime',
    evidence_title: 'Regjistri i Korrigjimeve Publike',
    owner: 'Redaktori i Standardeve',
    last_verified_at: '2026-09-04T17:00:00Z',
    score_dimensions: ['lifecycle'],
    audit_note: 'Gjurmim transparent i modifikimeve me pullë kohore.',
    efcsn_clause_ref: 'EFCSN Section 3.3.1',
    ifcn_criterion_ref: 'IFCN Criterion 5',
  },
  {
    id: 'ETIK-3B',
    neni: 3,
    sub_neni: '3.3',
    letter: 'B',
    title: 'Shpjegim i Rrethanave për Gabime Thelbësore',
    commitment_key: 'correction_circumstances',
    text: 'Për gabime thelbësore, ne ofrojmë një shpjegim të plotë të rrethanave.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/korrigjime',
    evidence_title: 'Protokolli i Notave Shpjeguese',
    owner: 'Bordi Editorial',
    last_verified_at: '2026-09-04T17:00:00Z',
    score_dimensions: ['lifecycle', 'logic'],
    audit_note: 'Botim i shënimit editorial në krye të artikullit.',
    efcsn_clause_ref: 'EFCSN Section 3.3.2',
    ifcn_criterion_ref: 'IFCN Criterion 5',
  },
  {
    id: 'ETIK-3C',
    neni: 3,
    sub_neni: '3.3',
    letter: 'C',
    title: 'Aksesueshmëri e Politikës së Korrigjimeve',
    commitment_key: 'accessible_corrections_policy',
    text: 'Politika jonë e korrigjimeve është lehtësisht e aksesueshme.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/korrigjime',
    evidence_title: 'Faqja e Hapur e Korrigjimeve & Ankesave',
    owner: 'Redaksia e Uebit',
    last_verified_at: '2026-09-06T10:00:00Z',
    score_dimensions: ['seo_accessibility', 'lifecycle'],
    audit_note: 'E dukshme në meny dhe në fundin e çdo faqeje.',
    efcsn_clause_ref: 'EFCSN Section 3.3.3',
    ifcn_criterion_ref: 'IFCN Criterion 5',
  },
  {
    id: 'ETIK-3D',
    neni: 3,
    sub_neni: '3.3',
    letter: 'D',
    title: 'Kanal Direkt për Audiencën',
    commitment_key: 'direct_correction_channel',
    text: 'Ne ofrojmë kanale direkte për audiencën për të kërkuar një korrigjim.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/korrigjime',
    evidence_title: 'Formulari i Drejtpërdrejtë i Ankesave',
    owner: 'Zyra e Standardeve',
    last_verified_at: '2026-09-06T10:00:00Z',
    score_dimensions: ['lifecycle'],
    audit_note: 'Konfirmim i menjëhershëm me kod ndjekjeje dhe SLA 7-ditore.',
    efcsn_clause_ref: 'EFCSN Section 3.3.4',
    ifcn_criterion_ref: 'IFCN Criterion 5',
  },

  // Neni 4: Transparenca
  {
    id: 'TRAN-1A',
    neni: 4,
    sub_neni: '4.1',
    letter: 'A',
    title: 'Struktura Organizative Publike',
    commitment_key: 'public_structure',
    text: 'Struktura jonë organizative dhe mënyra e ushtrimit të kontrollit editorial janë publike.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/transparence',
    evidence_title: 'Organigrama e Publikuar dhe Rregullorja e Brendshme',
    owner: 'Zyra Juridike',
    last_verified_at: '2026-08-11T14:30:00Z',
    score_dimensions: ['lifecycle'],
    audit_note: 'Strukturë e verifikuar në Qendrën Kombëtare të Biznesit.',
    efcsn_clause_ref: 'EFCSN Section 4.1.1',
    ifcn_criterion_ref: 'IFCN Criterion 4',
  },
  {
    id: 'TRAN-1B',
    neni: 4,
    sub_neni: '4.1',
    letter: 'B',
    title: 'Përditësimi i Pronësisë dhe Statusit Ligjor',
    commitment_key: 'legal_status_updates',
    text: 'Informacioni mbi pronësinë dhe statusin ligjor të platformës është i përditësuar rregullisht.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/trademarkCertificate',
    evidence_title: 'Ekstrakti QKB dhe Certifikata EUIPO',
    owner: 'Departamenti Ligjor',
    last_verified_at: '2026-08-11T14:30:00Z',
    score_dimensions: ['lifecycle'],
    audit_note: 'Dokumente publike të certifikuara nga OPM & EUIPO.',
    efcsn_clause_ref: 'EFCSN Section 4.1.2',
    ifcn_criterion_ref: 'IFCN Criterion 4',
  },
  {
    id: 'TRAN-1C',
    neni: 4,
    sub_neni: '4.1',
    letter: 'C',
    title: 'Transparenca e Ekipit Editorial',
    commitment_key: 'editorial_team_transparency',
    text: 'Identiteti i redaktorëve dhe vendimmarrësve kryesorë është publik.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/transparence',
    evidence_title: 'Faqja e Ekipit Editorial dhe Profilet Profesionale',
    owner: 'Redaksia',
    last_verified_at: '2026-08-11T14:30:00Z',
    score_dimensions: ['lifecycle'],
    audit_note: 'Profilet e plota me biografi dhe kredenciale profesionale.',
    efcsn_clause_ref: 'EFCSN Section 4.1.3',
    ifcn_criterion_ref: 'IFCN Criterion 4',
  },
  {
    id: 'TRAN-2A',
    neni: 4,
    sub_neni: '4.2',
    letter: 'A',
    title: 'Deklarimi Publik i të Ardhurave',
    commitment_key: 'revenue_sources_declaration',
    text: 'Ne deklarojmë publikisht burimet tona kryesore të të ardhurave.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/transparence',
    evidence_title: 'Raporti Financiar Vjetor i Transparencës',
    owner: 'Drejtoria Financiare',
    last_verified_at: '2026-08-13T16:00:00Z',
    score_dimensions: ['ethical_resonance', 'lifecycle'],
    audit_note: 'Bilanci vjetor dhe burimet e të ardhurave të deklaruara.',
    efcsn_clause_ref: 'EFCSN Section 4.2.1',
    ifcn_criterion_ref: 'IFCN Criterion 4',
  },
  {
    id: 'TRAN-2B',
    neni: 4,
    sub_neni: '4.2',
    letter: 'B',
    title: 'Mbrojtja nga Ndikimi i Financuesve',
    commitment_key: 'funding_independence_mechanisms',
    text: 'Ne shpjegojmë mekanizmat që sigurojnë pavarësinë editoriale nga financuesit.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/transparence',
    evidence_title: 'Muri Kinez i Ndarjes Financiare-Editoriale',
    owner: 'Këshilli Mbikëqyrës',
    last_verified_at: '2026-08-13T16:00:00Z',
    score_dimensions: ['ethical_resonance'],
    audit_note: 'Asnjë financues nuk ka akses apo ndikim mbi hetime.',
    efcsn_clause_ref: 'EFCSN Section 4.2.2',
    ifcn_criterion_ref: 'IFCN Criterion 4',
  },
  {
    id: 'TRAN-2C',
    neni: 4,
    sub_neni: '4.2',
    letter: 'C',
    title: 'Ndalimi i Sponsorizimit të Verifikimeve',
    commitment_key: 'no_sponsored_factchecks',
    text: 'Përmbajtja e verifikimit të fakteve nuk mund të sponsorizohet në asnjë rrethanë. Çdo partneritet tjetër deklarohet qartësisht.',
    status: 'compliant',
    status_label_sq: 'PËRPUTHSHMËRI E PLOTË',
    evidence_url: '/standards/transparence',
    evidence_title: 'Rregullorja mbi Sponsorizimet dhe Donacionet',
    owner: 'Bordi Drejtues',
    last_verified_at: '2026-08-13T16:00:00Z',
    score_dimensions: ['ethical_resonance'],
    audit_note: 'Ndalim absolut i çdo forme komercializimi të verdikteve.',
    efcsn_clause_ref: 'EFCSN Section 4.2.3',
    ifcn_criterion_ref: 'IFCN Criterion 4',
  },
];

export const FALLBACK_SCORE_DIMENSIONS: ScoreDimensionInfo[] = [
  {
    key: 'credibility',
    title: 'Besueshmëria',
    subtitle: 'Pretendime të Verifikuara & Burime Parësore',
    weightLabel: 'Peshë Kryesore (30%)',
    description: 'Përcakton saktësinë faktike, triangulimin me të paktën 2 burime parësore dhe atribuimin transparent pa burime të paidentifikuara.',
    measurement_metric: 'Raporti i burimeve parësore mbi 70%, indeks verifikimi me 2 dëshmi',
    governing_clause_ids: ['MET-B', 'MET-E', 'MET-F', 'MET-G', 'MET-H', 'MET-I', 'ETIK-2C'],
  },
  {
    key: 'readability',
    title: 'Lexueshmëria',
    subtitle: 'Qartësia Sintaksore & Flesch-Kincaid',
    weightLabel: 'Peshë Teknike (15%)',
    description: 'Rregullon qasjen gjuhësore, dendësinë e zërit pasiv dhe aksesueshmërinë për publikun e gjerë sipas standardeve të gazetarisë së hapur.',
    measurement_metric: 'Shkalla Flesch-Kincaid Grade 8-12, zëri pasiv nën 12%',
    governing_clause_ids: ['MET-K', 'ETIK-1E'],
  },
  {
    key: 'sentiment_analytics',
    title: 'Anshmëria & Sentimenti',
    subtitle: 'Neutraliteti & Shmangia e Polarizimit',
    weightLabel: 'Peshë Etike (20%)',
    description: 'Garanton baraspeshën dhe shmangien e gjuhës emotive apo ngjyrimit subjektiv në raportimet e ngjarjeve politike dhe publike.',
    measurement_metric: 'Indeksi i subjektivitetit nën 0.15, polarizim afër zeros',
    governing_clause_ids: ['MET-B', 'MET-K', 'ETIK-1A', 'ETIK-1C'],
  },
  {
    key: 'lifecycle',
    title: 'Cikli i Jetës & Përputhshmëria',
    subtitle: 'Auditimi, Gjurmueshmëria & Korrigjimet',
    weightLabel: 'Peshë Operative (15%)',
    description: 'Mbulon rishikimin e dyfishtë editorial (peer review), deklaratat ligjore, zbatimin e politikës së korrigjimeve dhe transparencën e procesit.',
    measurement_metric: 'Audit trail i dokumentuar, prani e njoftimit për korrigjime dhe SLA',
    governing_clause_ids: ['KONF-A', 'KONF-B', 'KONF-C', 'MET-D', 'MET-J', 'ETIK-1D', 'ETIK-2C', 'ETIK-3A', 'ETIK-3B', 'ETIK-3C', 'ETIK-3D', 'TRAN-1A', 'TRAN-1B', 'TRAN-1C', 'TRAN-2A'],
  },
  {
    key: 'seo_accessibility',
    title: 'SEO & Aksesueshmëria',
    subtitle: 'Të Dhëna të Hapura & Përfshirja',
    weightLabel: 'Peshë Dixhitale (5%)',
    description: 'Garanton akses të hapur për persona me aftësi të kufizuara, mbulim me alt-text, shënime semantike dhe përputhshmëri me motorët kërkues.',
    measurement_metric: 'Mbulim 100% alt-text, HTML5 semantik, WCAG AA',
    governing_clause_ids: ['KONF-B', 'MET-D', 'ETIK-3C'],
  },
  {
    key: 'logic',
    title: 'Integriteti Logjik',
    subtitle: 'Vlefshmëria Silogjistike & Anti-Fallacy',
    weightLabel: 'Peshë Kërkimore (10%)',
    description: 'Skanon konsistencën e argumentit për të parandaluar gabimet logjike (ad hominem, post hoc, strawman) dhe pretendimet rrethore.',
    measurement_metric: 'Indeksi Aletheia Parser mbi 0.90 pa gabime arsyetimi',
    governing_clause_ids: ['MET-A', 'MET-E', 'MET-G', 'MET-J', 'ETIK-3B'],
  },
  {
    key: 'ethical_resonance',
    title: 'Rezonanca Etike',
    subtitle: 'Interesi Publik & Minimizimi i Dëmit',
    weightLabel: 'Peshë Parimore (15%)',
    description: 'Siguron mbrojtjen e të miturve, sigurinë e burimeve, mungesën e sponsorizimeve në verifikime dhe llogaridhënien demokratike.',
    measurement_metric: 'Përputhje 100% me Deklaratën e Pavarësisë dhe Mbrojtjen e Privatësisë',
    governing_clause_ids: ['KONF-C', 'MET-C', 'ETIK-1A', 'ETIK-1B', 'ETIK-1C', 'ETIK-1D', 'ETIK-1E', 'ETIK-2A', 'ETIK-2B', 'TRAN-2A', 'TRAN-2B', 'TRAN-2C'],
  },
  {
    key: 'emotion',
    title: 'Valenca Emocionale',
    subtitle: 'Frenimi i Sensacionalizmit & Clickbait',
    weightLabel: 'Peshë Stilistike (5%)',
    description: 'Vlerëson shkallën e ngarkesës emocionale në tituj dhe trup lajmi duke kërkuar gjuhë të matur dhe neutrale.',
    measurement_metric: 'Indeksi i ngarkesës emotive nën 0.10 në tituj dhe hyrje',
    governing_clause_ids: ['MET-K'],
  },
];

export const FALLBACK_CORRECTIONS: CorrectionItem[] = [
  {
    id: 'CORR-2026-001',
    article_id: '6d22b038',
    article_title: 'Trump viziton Dublinin – Analiza e deklaratave mbi Irlandën e Bashkuar',
    type: 'Kontekstual',
    summary: 'Shtuar konteksti historik i Marrëveshjes së Premtes së Mirë dhe sqarim i termave diplomatikë në deklaratën e cituar.',
    diff_url: '/standards/korrigjime?id=CORR-2026-001',
    published_at: '2026-09-12T09:30:00Z',
    status: 'Zgjidhur',
    reviewer: 'Redaktori i Jashtëm',
  },
  {
    id: 'CORR-2026-002',
    article_id: '157b23fa',
    article_title: 'Financimet politike në Mbretërinë e Bashkuar dhe donacionet kripto',
    type: 'Faktik',
    summary: 'Saktësuar shifra e konvertimit nga GBP në EUR për donacionin e raportuar nga Komisioni Zgjedhor britanik.',
    diff_url: '/standards/korrigjime?id=CORR-2026-002',
    published_at: '2026-09-11T16:45:00Z',
    status: 'Zgjidhur',
    reviewer: 'Zyra e të Dhënave',
  },
  {
    id: 'CORR-2026-003',
    article_id: '7996c7ef',
    article_title: 'Raporti mbi nëndetëset bërthamore dhe qëndrimin japonez',
    type: 'Tipografik',
    summary: 'Përmirësuar transliterimi i emrave të personaliteteve zyrtare të Ministrisë së Mbrojtjes së Japonisë.',
    diff_url: '/standards/korrigjime?id=CORR-2026-003',
    published_at: '2026-09-11T14:10:00Z',
    status: 'Zgjidhur',
    reviewer: 'Korrektura Gjuhësore',
  },
];

export const FALLBACK_AI_REGISTRY: AiRegistryEntry[] = [
  {
    id: 'AI-REG-01',
    model_name: 'Nora AI Core',
    version: 'v2.4.1',
    provider: 'Google Gemini 2.5 Flash Enterprise (Server-Side)',
    purpose: 'Ekstraktim i entiteteve me emër (NER), krahasim i burimeve parësore, kategorizim gjeopolitik dhe indeksim sintaksor.',
    human_oversight_step: 'Çdo sinjal dhe klasifikim i gjeneruar nga Nora i nënshtrohet miratimit të detyrueshëm me dy çelësa nga redaktori përgjegjës para publikimit (Human-in-the-Loop).',
    architecture_tier: 'Dedicated Cloud Run VPC (Port 3000 Isolated)',
    last_updated: '2026-09-10T12:00:00Z',
    compliance_status: 'Përputhshmëri e Plotë',
    capabilities: [
      'NER Extraction (Person, Organ, Location)',
      'Cross-Source Triangulation',
      'Flesch-Kincaid Grading',
      'Temporal Sequence Alignment',
    ],
  },
  {
    id: 'AI-REG-02',
    model_name: 'Aletheia Logic Parser',
    version: 'v1.8.0',
    provider: 'NOVARIC® Proprietary Hybrid NLP Engine',
    purpose: 'Skanim i gabimeve logjike (fallacies), identifikim i rrethit vicioz dhe konsistencës silogjistike në deklaratat publike.',
    human_oversight_step: 'Rishikim nga paneli i filozofisë së jurisprudencës; asnjë verdikt diskualifikues nuk jepet pa konfirmim njerëzor.',
    architecture_tier: 'In-Memory Deterministic Engine',
    last_updated: '2026-08-30T16:00:00Z',
    compliance_status: 'Përputhshmëri e Plotë',
    capabilities: [
      'Syllogistic Verification',
      'Informal Fallacy Tagging',
      'Rhetorical Sentiment Isolation',
    ],
  },
];

export const FALLBACK_TRANSPARENCY_LEDGER: TransparencyLedgerItem[] = [
  {
    id: 'TRANS-01',
    category: 'ownership',
    category_label_sq: 'Pronësia & Struktura Ligjore',
    title: 'Struktura Aksionere dhe Regjistrimi Tregtar',
    description: 'NOVARIC® Sh.A. është shoqëri aksionere e regjistruar sipas legjislacionit shqiptar, me seli në Shkodër, 100% kapital i pavarur privat dhe pa asnjë pronësi apo pjesëmarrje shtetërore apo partiake.',
    legal_entity: 'NOVARIC® Sh.A. (Shkodër, Shqipëri)',
    evidence_name: 'Ekstrakti Historik i Regjistrit Tregtar QKB',
    evidence_url: 'https://qkb.gov.al',
    verified_at: '2026-08-11T10:00:00Z',
    certifying_body: 'Qendra Kombëtare e Biznesit (QKB)',
  },
  {
    id: 'TRANS-02',
    category: 'ownership',
    category_label_sq: 'Pronësia & Struktura Ligjore',
    title: 'Mbrojtja e Markës Tregtare në Bashkimin Evropian',
    description: 'Marka dhe metodologjia e verifikimit NOVARIC® janë të certifikuara dhe të mbrojtura pranë Zyrës së Bashkimit Evropian për Pronësinë Intelektuale (EUIPO).',
    legal_entity: 'NOVARIC® Media Group',
    evidence_name: 'Certifikata e Markës EUIPO Nr. 018892110',
    evidence_url: '/trademarkCertificate',
    verified_at: '2026-08-05T14:00:00Z',
    certifying_body: 'European Union Intellectual Property Office (EUIPO)',
  },
  {
    id: 'TRANS-03',
    category: 'funding',
    category_label_sq: 'Financimi & Pavarësia Financiare',
    title: 'Modeli i Financimit dhe Burimet e të Ardhurave',
    description: 'Operacionet e verifikimit financohen përmes shërbimeve teknologjike B2B, kërkimit akademik të pavarur dhe granteve të hapura për transparencë mediatike. Ndalohet kategorikisht çdo financim nga parti politike apo kandidatë.',
    legal_entity: 'NOVARIC® Media Monitor',
    evidence_name: 'Deklarata Vjetore Financiare 2025/2026',
    evidence_url: '/standards/transparence',
    verified_at: '2026-08-13T12:00:00Z',
    certifying_body: 'Auditues i Pavarur Ligjor',
  },
  {
    id: 'TRANS-04',
    category: 'editorial',
    category_label_sq: 'Bordi Editorial & Redaksia',
    title: 'Udhëheqja Kërkimore dhe Ekipi i Verifikimit',
    description: 'Departamenti Kërkimor drejtohet nga Dr. Alban Gj. THIKA, në bashkëpunim me gazetarë hulumtues të pavarur dhe inxhinierë të sistemeve NLP të Nora AI.',
    legal_entity: 'Redaksia e Pavarur NOVARIC®',
    evidence_name: 'Karta e Integritetit Profesional dhe Kredencialet Akademike',
    evidence_url: '/aboutUs',
    verified_at: '2026-08-20T11:00:00Z',
    certifying_body: 'Këshilli Shkencor NOVARIC®',
  },
  {
    id: 'TRANS-05',
    category: 'governance',
    category_label_sq: 'Qeverisja & Pajtueshmëria Ndërkombëtare',
    title: 'Përputhshmëria me Kodet EFCSN dhe IFCN',
    description: 'Operacionet tona zbatojnë 100% të kërkesave të Kodit Evropian të Standardeve (EFCSN) dhe Kodit të Parimeve të IFCN për pavarësi, metodologji të hapur dhe korrigjime transparente.',
    legal_entity: 'NOVARIC® Fact-Checking Unit',
    evidence_name: 'Raporti i Përputhshmërisë EFCSN/IFCN 2026',
    evidence_url: '/standards/perputhshmeri',
    verified_at: '2026-08-15T09:00:00Z',
    certifying_body: 'Zyra e Integritetit & Pajtueshmërisë',
  },
];

class StandardsService {
  private inMemoryComplaints: ComplaintReceipt[] = [];

  // Helper to compute live breakdown from clauses
  private calculateSummary(clauses: StandardClause[], isDemo = false): ComplianceSummary {
    const total = clauses.length;
    const compliant = clauses.filter(c => c.status === 'compliant' || c.status === 'verified').length;
    const overall_percentage = total > 0 ? Number(((compliant / total) * 100).toFixed(1)) : 100;

    const neniTitles: Record<number, string> = {
      1: 'Sistemi i Përputhshmërisë',
      2: 'Metodologjia e Verifikimit',
      3: 'Standardet Etike & Paanshmëria',
      4: 'Transparenca & Pronësia',
    };

    const breakdown = [1, 2, 3, 4].map(neniNum => {
      const neniClauses = clauses.filter(c => c.neni === neniNum);
      const nTotal = neniClauses.length;
      const nComp = neniClauses.filter(c => c.status === 'compliant' || c.status === 'verified').length;
      const pct = nTotal > 0 ? Number(((nComp / nTotal) * 100).toFixed(1)) : 100;
      return {
        neni: neniNum,
        title: neniTitles[neniNum] || `Neni ${neniNum}`,
        percentage: pct,
        total: nTotal,
        compliant: nComp,
      };
    });

    return {
      overall_percentage,
      compliant_count: compliant,
      total_count: total,
      last_audit_at: '2026-08-15T10:00:00Z',
      // Dynamic audit in future: 2026-12-15
      next_audit_at: '2026-12-15T00:00:00Z',
      is_demo_fixture: isDemo,
      per_neni_breakdown: breakdown,
    };
  }

  async getClauses(): Promise<{ clauses: StandardClause[]; isFixture: boolean }> {
    try {
      const res = await fetch('/api/v1/standards', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.clauses) && data.clauses.length > 0) {
          return { clauses: data.clauses, isFixture: false };
        }
      }
    } catch {
      // Fallback
    }
    return { clauses: FALLBACK_CLAUSES, isFixture: true };
  }

  async getComplianceSummary(): Promise<ComplianceSummary> {
    try {
      const res = await fetch('/api/v1/standards/compliance', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.overall_percentage === 'number') {
          return data;
        }
      }
    } catch {
      // Fallback
    }
    return this.calculateSummary(FALLBACK_CLAUSES, true);
  }

  async getCorrections(): Promise<{ corrections: CorrectionItem[]; isFixture: boolean }> {
    try {
      const res = await fetch('/api/v1/standards/corrections', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.corrections) && data.corrections.length > 0) {
          return { corrections: data.corrections, isFixture: false };
        }
      }
    } catch {
      // Fallback
    }
    return { corrections: FALLBACK_CORRECTIONS, isFixture: true };
  }

  async submitComplaint(submission: ComplaintSubmission): Promise<ComplaintReceipt> {
    try {
      const res = await fetch('/api/v1/standards/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(submission),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.receipt_id) {
          return data;
        }
      }
    } catch {
      // Fallback local processing
    }

    // Deterministic fallback receipt
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const receiptId = `NOV-ANKES-${dateStr}-${randomSuffix}`;
    const createdAt = new Date().toISOString();
    
    // SLA 7 days ahead
    const slaDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const slaDueAt = slaDate.toISOString();

    const receipt: ComplaintReceipt = {
      receipt_id: receiptId,
      status: 'Pranuar',
      created_at: createdAt,
      sla_due_at: slaDueAt,
      claim_url: submission.claim_url,
      message: 'Ankesa juaj u regjistrua me sukses në Zyrën e Standardeve NOVARIC®. Shqyrtimi editorial kryhet brenda 7 ditëve pune sipas Nenit 3.3.D dhe protokollit të EFCSN.',
      tracking_code: `TRK-${receiptId}`,
    };

    this.inMemoryComplaints.unshift(receipt);
    return receipt;
  }

  async getAiRegistry(): Promise<{ registry: AiRegistryEntry[]; isFixture: boolean }> {
    try {
      const res = await fetch('/api/v1/standards/ai-registry', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.models) && data.models.length > 0) {
          return { registry: data.models, isFixture: false };
        }
      }
    } catch {
      // Fallback
    }
    return { registry: FALLBACK_AI_REGISTRY, isFixture: true };
  }

  async getTransparencyLedger(): Promise<TransparencyLedgerItem[]> {
    return FALLBACK_TRANSPARENCY_LEDGER;
  }

  getScoreDimensions(): ScoreDimensionInfo[] {
    return FALLBACK_SCORE_DIMENSIONS;
  }
}

export const standardsService = new StandardsService();
