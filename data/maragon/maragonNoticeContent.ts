/**
 * MARAGON® — Njoftim mbi vlerësimet, metodologjinë dhe të drejtat
 * MARAGON® — Notice on assessments, methodology and rights
 *
 * Single source for the public page, the contextual notices and the review documents
 * (RPT-COM-MARAGON-NOTICE-PAGE-v0.1-20261122). Albanian is primary; English is a faithful version.
 *
 * STATUS: Draft for legal and editorial review. Not approved. Not published.
 * The page and its links stay hidden from the public until `status` is
 * 'approved_for_publication' AND `approval` records who approved it and when.
 * Only Dr Alban Gj. THIKA may change that. This file does not change any MARAGON® approval flag,
 * score, band or dossier.
 *
 * Governing source: STD-COM-MARAGON-METHODOLOGY-v1.0-20261121 with AM-01 … AM-09.
 * AM-10 v0.1 (benchmarks) is unsigned and is not relied on here.
 *
 * Inline links use [text](href). Allowed hrefs are listed in MARAGON_NOTICE_ALLOWED_HREFS.
 */

export type NoticeLang = 'sq' | 'en';

export type MaragonNoticeStatus = 'draft_for_legal_and_editorial_review' | 'approved_for_publication';

export interface MaragonNoticeApproval {
  approvedBy: string;
  /** Tirana time, ISO date. */
  approvedOn: string;
  /** Written approval reference (chat card id, signed form, minutes). */
  reference: string;
}

export interface MaragonNoticeSection {
  id: string;
  number: number;
  heading: Record<NoticeLang, string>;
  /** Each entry is one paragraph. A leading "- " renders the paragraph as a list item. */
  body: Record<NoticeLang, string[]>;
}

export const MARAGON_NOTICE_PATH = '/njoftim-maragon';
export const MARAGON_NOTICE_QUERY_PAGE = 'maragonNotice';
export const MARAGON_NOTICE_DOCUMENT_ID = 'RPT-COM-MARAGON-NOTICE-PAGE';

export const MARAGON_NOTICE_META = {
  version: '0.1',
  status: 'draft_for_legal_and_editorial_review' as MaragonNoticeStatus,
  draftedOn: '2026-11-22',
  /** Set only by Dr Alban Gj. THIKA after the legal and editorial review is recorded. */
  approval: null as MaragonNoticeApproval | null,
  /** Set only when the page actually goes live. */
  publishedOn: null as string | null,
  methodologyId: 'STD-COM-MARAGON-METHODOLOGY-v1.0-20261121',
  methodologySignedOn: '2026-11-21',
  amendments: 'AM-01 … AM-09',
} as const;

/** Verified organisation details only. Nothing here is a placeholder. */
export const MARAGON_NOTICE_PUBLISHER = {
  legalName: 'NOVARIC® Sh.A.',
  address: 'Rruga Studenti, Shkodër 4001, Shqipëri',
  addressEn: 'Rruga Studenti, Shkodër 4001, Albania',
  email: 'contact@novaric.al',
  website: 'https://www.novaric.al',
  administrator: 'Dr Alban Gj. THIKA',
} as const;

/**
 * Link targets that exist in the inspected repository (ad5b709) or are verified external sources.
 * The MARAGON® white paper and a public MARAGON® v1.0 methodology summary are not published,
 * so they are not linked (publication blockers B-03, B-04).
 */
export const MARAGON_NOTICE_ALLOWED_HREFS = [
  'mailto:contact@novaric.al',
  'https://www.novaric.al',
  'https://idp.al/',
  '/?page=privacy',
  '/personalitete-mediatike',
] as const;

export const MARAGON_NOTICE_TITLE: Record<NoticeLang, string> = {
  sq: 'MARAGON® — Njoftim mbi vlerësimet, metodologjinë dhe të drejtat',
  en: 'MARAGON® — Notice on assessments, methodology and rights',
};

export const MARAGON_NOTICE_DESCRIPTION: Record<NoticeLang, string> = {
  sq: 'Çfarë mat MARAGON®, si arrihet një vlerësim, çfarë nuk përcakton, si kërkohet korrigjim dhe cilat të drejta ruani. NOVARIC® Sh.A.',
  en: 'What MARAGON® measures, how an assessment is reached, what it does not establish, how to ask for a correction and which rights you keep.',
};

export const MARAGON_NOTICE_DRAFT_BANNER: Record<NoticeLang, string> = {
  sq: 'Draft për shqyrtim ligjor dhe editorial. Nuk është miratuar dhe nuk është publikuar.',
  en: 'Draft for legal and editorial review. Not approved and not published.',
};

export const MARAGON_NOTICE_UNAVAILABLE: Record<NoticeLang, string> = {
  sq: 'Ky njoftim është në shqyrtim dhe nuk është publikuar ende.',
  en: 'This notice is under review and has not been published yet.',
};

export const MARAGON_NOTICE_SECTIONS: MaragonNoticeSection[] = [
  {
    id: 'botuesi',
    number: 1,
    heading: { sq: 'Botuesi dhe qëllimi', en: 'Publisher and purpose' },
    body: {
      sq: [
        'Ky njoftim botohet nga NOVARIC® Sh.A., botuesi i media.novaric.al. Adresa: Rruga Studenti, Shkodër 4001, Shqipëri. Email: [contact@novaric.al](mailto:contact@novaric.al). Faqja: [www.novaric.al](https://www.novaric.al). Administrator: Dr Alban Gj. THIKA.',
        'Qëllimi i njoftimit është të shpjegojë saktë çfarë mat MARAGON®, si arrihet një vlerësim, çfarë nuk përcakton ai dhe si mund të kërkoni korrigjim ose shqyrtim.',
        'Njoftimi nuk e kufizon përgjegjësinë e NOVARIC® Sh.A. për saktësinë e asaj që publikon dhe nuk kufizon asnjë të drejtë tuajën.',
      ],
      en: [
        'This notice is published by NOVARIC® Sh.A., the publisher of media.novaric.al. Address: Rruga Studenti, Shkodër 4001, Albania. Email: [contact@novaric.al](mailto:contact@novaric.al). Website: [www.novaric.al](https://www.novaric.al). Administrator: Dr Alban Gj. THIKA.',
        'Its purpose is to explain accurately what MARAGON® measures, how an assessment is reached, what it does not establish, and how you can ask for a correction or a review.',
        'The notice does not limit the responsibility of NOVARIC® Sh.A. for the accuracy of what it publishes, and it does not limit any of your rights.',
      ],
    },
  },
  {
    id: 'cfare-vlereson',
    number: 2,
    heading: { sq: 'Çfarë vlerëson MARAGON® dhe çfarë nuk përcakton', en: 'What MARAGON® assesses and what it does not establish' },
    body: {
      sq: [
        'MARAGON® është korniza e NOVARIC® për vlerësimin sistematik të sjelljes profesionale publike të prezantuesve mediatikë individualë, në bazë provash dhe kriteresh të shkruara. «Sistematik» do të thotë që çdo hap ndjek të njëjtat rregulla të shkruara. Nuk nënkupton diagnozë.',
        'Korniza ka dhjetë tregues në katër dimensione:',
        '- R — Gatishmëria: R1.1 Pajtueshmëria rregullatore; R1.2 Pajtueshmëria etike.',
        '- A — Aftësia: A2.1 Saktësia faktike; A2.2 Paanshmëria dhe anshmëria; A2.3 Origjinaliteti dhe thellësia; A2.4 Kontekstualizimi.',
        '- G — Qeverisja: G3.1 Ndikimi i pronësisë (për individët: deklarimi i lidhjeve dhe i financimit); G3.2 Kontrolli editorial.',
        '- O — Kujdesi mbikëqyrës: O4.1 Promovimi i edukimit mediatik; O4.2 Kontributi në diskursin demokratik.',
        'Për prezantuesit individualë, disa tregues përdorin variante të përshtatura, p.sh. thellësia e analizës te A2.3 ose promovimi i të menduarit kritik te O4.1. Variantet përcaktohen në metodologji.',
        'Boshti plotësues C nuk vlerësohet. MARAGON® është e ndarë nga PARAGON®: të dyja nuk ndajnë pikë, breza, prova apo formula.',
        'Një vlerësim MARAGON® është gjykim analitik editorial për sjelljen e vëzhguar në një periudhë dhe në një kampion të caktuar. Ai nuk është vendim gjyqësor, administrativ ose rregullator. Nuk vërteton fajësi penale, shkelje ligjore ose përgjegjësi civile. Nuk është diagnozë psikologjike dhe nuk vlerëson personalitetin. Nuk parashikon sjelljen e ardhshme.',
      ],
      en: [
        'MARAGON® is the NOVARIC® framework for the systematic assessment of the public professional conduct of individual media presenters, based on evidence and written criteria. "Systematic" means that every step follows the same written rules. It does not imply a diagnosis.',
        'The framework has ten indicators in four dimensions:',
        '- R — Readiness: R1.1 Regulatory compliance; R1.2 Ethical compliance.',
        '- A — Aptitude: A2.1 Factual accuracy; A2.2 Impartiality and bias; A2.3 Originality and depth; A2.4 Contextualisation.',
        '- G — Governance: G3.1 Ownership influence (for individuals: disclosure of affiliations and funding); G3.2 Editorial control.',
        '- O — Oversight nurturing: O4.1 Promoting media literacy; O4.2 Contribution to democratic discourse.',
        'For individual presenters some indicators use adapted variants, for example depth of analysis for A2.3 or promoting critical thinking for O4.1. The variants are defined in the methodology.',
        'The supplementary axis C is not scored. MARAGON® is separate from PARAGON®: the two share no scores, bands, evidence or formulas.',
        'A MARAGON® assessment is an editorial analytical judgment about conduct observed in a defined period and sample. It is not a judicial, administrative or regulatory decision. It does not establish criminal guilt, a breach of law or civil liability. It is not a psychological diagnosis and does not assess personality. It does not predict future conduct.',
      ],
    },
  },
  {
    id: 'faktet-dhe-gjykimet',
    number: 3,
    heading: { sq: 'Faktet, pretendimet, gjykimet analitike dhe të panjohurat', en: 'Facts, allegations, analytical judgments and unknowns' },
    body: {
      sq: [
        'Në çdo profil mbajmë të ndara katër lloje pohimesh:',
        '- Fakte të verifikueshme, p.sh. që një emision u transmetua në një datë, që AMA mori një vendim, ose çfarë u tha në transmetim. Çdo fakt lidhet me burimin e vet dhe mund të kontrollohet.',
        '- Pretendime: pohime të të tjerëve, p.sh. një ankesë ose një raport mediatik, që nuk janë gjetur ende në burimin parësor. Shënohen si të raportuara dhe nuk paraqiten si fakte.',
        '- Gjykime analitike: vlerësimi ynë se sa i plotësojnë provat kriteret e një treguesi. Janë gjykime vlerësuese, jo fakte, por secili duhet të ketë bazë faktike të mjaftueshme, të listuar në profil.',
        '- Të panjohura: ajo që nuk dimë ose nuk e kemi vlerësuar. Shfaqet «Pa vlerësim» dhe nuk trajtohet si zero, as si gjetje negative, as si gjetje pozitive.',
      ],
      en: [
        'In every profile we keep four kinds of statement apart:',
        '- Verifiable facts, for example that a programme was broadcast on a date, that AMA took a decision, or what was said on air. Each fact is linked to its source and can be checked.',
        '- Allegations: statements by others, for example a complaint or a media report, that have not yet been found in the primary source. They are marked as reported and are not presented as facts.',
        '- Analytical judgments: our assessment of how far the evidence meets an indicator\'s criteria. They are evaluative judgments, not facts, but each must have a sufficient factual basis, listed in the profile.',
        '- Unknowns: what we do not know or have not assessed. They show "Pa vlerësim / Not assessed" and are treated neither as zero, nor as a negative finding, nor as a positive one.',
      ],
    },
  },
  {
    id: 'periudha-dhe-kampioni',
    number: 4,
    heading: { sq: 'Periudha, kampioni, provat dhe kufizimet', en: 'Assessment period, sample, evidence and limitations' },
    body: {
      sq: [
        'Çdo vlerësim tregon periudhën që mbulon, kampionin dhe listën e provave. Sipas metodologjisë v1.0:',
        '- regjistrat zyrtarë, p.sh. vendimet e AMA-s, kontrollohen për 36 muajt e fundit dhe çdo kërkim regjistrohet;',
        '- treguesit e përmbajtjes kërkojnë një kampion të koduar me një numër minimal emisionesh ose daljesh publike, të zgjedhura rastësisht me farë të regjistruar, që mbulon të paktën 6 muaj; brezat ekstremë kërkojnë kampion më të madh që mbulon të paktën 12 muaj;',
        '- provat ndahen sipas nivelit: burime zyrtare ose parësore; burime dytësore të pavarura; deklarata të vetë subjektit, që provojnë vetëm se një politikë ekziston; dhe burime të paverifikuara, që nuk pranohen si prova.',
        'Kufizimet e njohura:',
        '- vendimin përfundimtar e merr një recensues i vetëm, Dr Alban Gj. THIKA; kjo nuk është besueshmëri ndërmjet vlerësuesve të pavarur;',
        '- pragjet numerike nuk janë kalibruar ende;',
        '- regjistrat e AMA-s varen nga ankesat, prandaj mungesa e vendimeve nuk provon pajtueshmëri;',
        '- kampioni mbulon vetëm paraqitjet e përzgjedhura, jo gjithë veprimtarinë e personit.',
        'Në datën e këtij versioni nuk ka ende kampion të koduar. Për këtë arsye asnjë tregues përmbajtjeje nuk ka brez zyrtar.',
      ],
      en: [
        'Every assessment states the period it covers, the sample and the evidence list. Under methodology v1.0:',
        '- official registers, for example AMA decisions, are checked for the last 36 months and every search is logged;',
        '- content indicators need a coded sample with a minimum number of programmes or public appearances, drawn at random with a recorded seed and covering at least 6 months; the extreme bands need a larger sample covering at least 12 months;',
        '- evidence is graded by tier: official or primary sources; independent secondary sources; the subject\'s own statements, which prove only that a policy exists; and unverified sources, which are not accepted as evidence.',
        'Known limitations:',
        '- the final decision is taken by a single reviewer, Dr Alban Gj. THIKA; this is not reliability between independent raters;',
        '- the numeric cut-offs have not yet been calibrated;',
        '- AMA records depend on complaints, so the absence of decisions does not prove compliance;',
        '- the sample covers only the selected appearances, not all of the person\'s work.',
        'At the date of this version no coded sample exists yet. For that reason no content indicator has an official band.',
      ],
    },
  },
  {
    id: 'brezat',
    number: 5,
    heading: { sq: 'Pikët, brezat, besueshmëria dhe «Pa vlerësim»', en: 'Scores, bands, confidence and "Pa vlerësim / Not assessed"' },
    body: {
      sq: [
        'Publiku sheh breza dhe nivelin e besueshmërisë, jo numra. Pesë brezat janë: Shumë e dobët (0–20), E dobët (21–40), Mesatare (41–60), E fortë (61–80) dhe Shumë e fortë (81–100). Intervalet tregojnë kufijtë e brezit në shkallën e brendshme 0–100. Pika e saktë mbahet në dosje dhe nuk publikohet.',
        'Besueshmëria, e lartë ose mesatare, tregon sa e fortë dhe e qëndrueshme është baza e provave. Dy brezat ekstremë kërkojnë besueshmëri të lartë. Kur besueshmëria është e ulët ose provat nuk mjaftojnë, nuk publikohet brez dhe shfaqet «Pa vlerësim».',
        '«Pa vlerësim» do të thotë që nuk ka vlerë të miratuar dhe të publikuar. Nuk do të thotë zero, as dështim, as sukses. Një tregues që nuk zbatohet për një person, p.sh. kur ai nuk ka drejtuar asnjë program të rregulluar, nuk llogaritet.',
        'Vlerësimi i përgjithshëm shfaqet vetëm kur të katër dimensionet kanë vlerësime zyrtare me prova të mjaftueshme. Përndryshe shfaqet «Pa vlerësim».',
      ],
      en: [
        'The public sees bands and the confidence level, not numbers. The five bands are: Very weak (0–20), Weak (21–40), Moderate (41–60), Strong (61–80) and Very strong (81–100). The ranges show the band limits on the internal 0–100 scale. The exact point is kept in the file and is not published.',
        'Confidence, high or medium, shows how strong and consistent the evidence base is. The two extreme bands require high confidence. When confidence is low or the evidence is insufficient, no band is published and "Pa vlerësim / Not assessed" is shown.',
        '"Pa vlerësim / Not assessed" means that there is no approved and published value. It does not mean zero, failure or success. An indicator that does not apply to a person, for example when they have led no regulated programme, is not counted.',
        'The overall assessment is shown only when all four dimensions have official assessments with sufficient evidence. Otherwise "Pa vlerësim / Not assessed" is shown.',
      ],
    },
  },
  {
    id: 'atribuimi',
    number: 6,
    heading: { sq: 'Përgjegjësia individuale dhe ajo institucionale', en: 'Individual and institutional attribution' },
    body: {
      sq: [
        'MARAGON® vlerëson prezantuesin si individ. Prezantuesi, programi, transmetuesi dhe pronari janë subjekte të ndryshme, me përgjegjësi të ndryshme.',
        'Një gjetje për një transmetues ose program, p.sh. një sanksion i AMA-s ndaj stacionit, nuk bëhet automatikisht gjetje për prezantuesin. Ajo i atribuohet prezantuesit vetëm kur provat tregojnë sjelljen ose përgjegjësinë e tij ose të saj në rastin konkret, p.sh. fjalët e veta në transmetim, ose një vendim për programin që drejton, kur akti i takon rolit të vet. Arsyetimi për individin shkruhet veçmas nga ai për institucionin.',
        'Një brez për sjelljen profesionale nuk është konstatim i fajësisë penale dhe nuk përcakton përgjegjësinë ligjore të transmetuesit ose të pronarit.',
      ],
      en: [
        'MARAGON® assesses the presenter as an individual. The presenter, the programme, the broadcaster and the owner are different subjects with different responsibilities.',
        'A finding about a broadcaster or a programme, for example an AMA sanction against the station, does not automatically become a finding about the presenter. It is attributed to the presenter only when the evidence shows his or her own conduct or responsibility in the specific case, for example their own words on air, or a decision about the programme they lead where the act falls within their own role. The reasoning for the individual is written separately from the reasoning for the institution.',
        'A band for professional conduct is not a finding of criminal guilt and does not determine the legal liability of the broadcaster or the owner.',
      ],
    },
  },
  {
    id: 'ia',
    number: 7,
    heading: { sq: 'Ndihma e inteligjencës artificiale dhe përgjegjësia editoriale', en: 'AI assistance and editorial responsibility' },
    body: {
      sq: [
        'Përdorim mjete të inteligjencës artificiale për të mbledhur prova, për kodimin e parë dhe për të hartuar arsyetimin. Këto mjete nuk vendosin asnjë brez. Çdo brez dhe çdo status pranohet, ndryshohet ose refuzohet nga Dr Alban Gj. THIKA, dhe çdo kriter i plotësuar duhet të lidhet me një provë të regjistruar.',
        'Transkriptimi, përkthimi dhe identifikimi i folësit mund të përmbajnë gabime. Lista e provave të çdo profili tregon burimin e secilës provë. Nëse vini re një gabim të tillë, na e tregoni sipas seksionit 10.',
        'Përdorimi i këtyre mjeteve nuk e zvogëlon përgjegjësinë editoriale të NOVARIC® Sh.A. për atë që publikohet. Etiketa si «kërkimor», «eksperimental» ose «me ndihmën e IA-së» nuk e justifikojnë një pohim të pambështetur.',
      ],
      en: [
        'We use artificial-intelligence tools to gather evidence, for first-pass coding and to draft the reasoning. These tools decide no band. Every band and every status is accepted, edited or rejected by Dr Alban Gj. THIKA, and every criterion met must be linked to a recorded piece of evidence.',
        'Transcription, translation and speaker identification can contain errors. The evidence list of each profile shows the source of every item. If you notice such an error, please tell us as described in section 10.',
        'The use of these tools does not reduce the editorial responsibility of NOVARIC® Sh.A. for what is published. Labels such as "research", "experimental" or "AI-assisted" do not justify an unsupported statement.',
      ],
    },
  },
  {
    id: 'standardet',
    number: 8,
    heading: { sq: 'Standardet krahasuese dhe mesataret e kolegëve', en: 'Benchmarks and observed peer averages' },
    body: {
      sq: [
        'MARAGON® mat sa i plotësojnë provat kriteret e shkruara. Nuk i rendit prezantuesit ndaj njëri-tjetrit. Mbajmë të ndara dy gjëra që në një grafik mund të duken të ngjashme:',
        '- standard normativ: niveli që pret një kod ose standard profesional, pra çfarë duhet të jetë;',
        '- mesatare empirike e kolegëve: mesatarja e vëzhguar e një grupi prezantuesish në një kampion, pra çfarë është.',
        'Në datën e këtij versioni nuk ka vlera standardesh të miratuara. Për këtë arsye grafikët nuk vizatojnë asnjë vijë krahasuese, dhe metodologjia v1.0 nuk publikon mesatare kolegësh. Çdo vijë krahasuese në të ardhmen duhet të emërtohet qartë si standard normativ ose si mesatare e vëzhguar, me burimin e saj.',
      ],
      en: [
        'MARAGON® measures how far the evidence meets written criteria. It does not rank presenters against one another. We keep apart two things that can look alike in a chart:',
        '- a normative benchmark: the level a code or professional standard expects, that is, what ought to be;',
        '- an empirical peer average: the observed average of a group of presenters in a sample, that is, what is.',
        'At the date of this version no benchmark values have been approved. For that reason the charts draw no comparison line, and methodology v1.0 publishes no peer averages. Any future comparison line must be labelled clearly as a normative benchmark or as an observed average, with its source.',
      ],
    },
  },
  {
    id: 'statusi',
    number: 9,
    heading: { sq: 'Statusi i vlerësimit, rishikimet dhe versionet e metodologjisë', en: 'Assessment status, revisions and methodology versions' },
    body: {
      sq: [
        'Një profil mund të jetë në njërën nga këto gjendje publike:',
        '- «Pa vlerësim»: nuk publikohet asnjë vlerë e miratuar.',
        '- «PROVIZOR — në pritje të miratimit»: brez indikativ, pa numra, me nivelin e besueshmërisë, i shfaqur vetëm pasi pronari e ka miratuar me shkrim atë profil të veçantë. Nuk është vlerësim zyrtar. Një vlerësim i përgjithshëm provizor nuk shfaqet kurrë.',
        '- Brez zyrtar: shfaqet vetëm pasi dosja është miratuar, metodologjia është miratuar për atë version, subjektit i është ofruar e drejta e përgjigjes dhe afati ka kaluar, dhe shfaqja publike është autorizuar.',
        'Çdo vlerësim tregon datën dhe versionin e metodologjisë. Sipas rregullave tona, vlerësimet skadojnë pas 12 muajsh dhe rishqyrtohen. Një ngjarje materiale, p.sh. një vendim i ri i AMA-s, ndryshim programi ose një vendim gjykate, sjell rishqyrtim, dhe deri atëherë profili shënohet «në rishqyrtim». Ndryshimet nuk e fshijnë historikun: çdo korrigjim shënohet si hyrje e re me datë.',
        'Rregullat e plota janë në metodologjinë MARAGON® v1.0 (STD-COM-MARAGON-METHODOLOGY-v1.0-20261121), nënshkruar nga Dr Alban Gj. THIKA më 21.11.2026, me amendamentet AM-01 deri AM-09. Çdo ndryshim i mëvonshëm i metodologjisë merr numër të ri versioni.',
      ],
      en: [
        'A profile can be in one of these public states:',
        '- "Pa vlerësim / Not assessed": no approved value is published.',
        '- "PROVIZOR — në pritje të miratimit / PROVISIONAL — pending sign-off": an indicative band, without numbers, with its confidence level, shown only after the owner has approved that specific profile in writing. It is not an official assessment. A provisional overall assessment is never shown.',
        '- Official band: shown only after the file has been approved, the methodology has been approved for that version, the subject has been offered the right of reply and the deadline has passed, and public display has been authorised.',
        'Every assessment shows its date and the methodology version. Under our rules, assessments expire after 12 months and are reviewed again. A material event, for example a new AMA decision, a programme change or a court ruling, triggers a review, and until then the profile is marked "under review". Changes do not delete the history: every correction is recorded as a new, dated entry.',
        'The full rules are in the MARAGON® v1.0 methodology (STD-COM-MARAGON-METHODOLOGY-v1.0-20261121), signed by Dr Alban Gj. THIKA on 21.11.2026, with amendments AM-01 to AM-09. Any later change to the methodology receives a new version number.',
      ],
    },
  },
  {
    id: 'korrigjimet',
    number: 10,
    heading: { sq: 'Korrigjimet, përgjigjet dhe kërkesat për shqyrtim', en: 'Corrections, responses and requests for review' },
    body: {
      sq: [
        'Para publikimit. Para se të publikohet një brez për një person të identifikueshëm, NOVARIC® Sh.A. i dërgon atij ose asaj, nëpërmjet një kanali zyrtar, një njoftim në shqip dhe në anglisht me gjetjet, brezat e propozuar, besueshmërinë, listën e provave dhe mënyrën e përgjigjes. Afati për përgjigje është 10 ditë pune, pa llogaritur festat zyrtare në Shqipëri, dhe zgjatet me 5 ditë pune me kërkesë të arsyetuar.',
        'Ky afat është rregull i brendshëm i NOVARIC® Sh.A., jo afat i caktuar me ligj, dhe nuk zëvendëson asnjë afat ose procedurë që parashikon ligji.',
        'Korrigjimet faktike të dokumentuara e kthejnë dosjen në shqyrtim. Mosmarrëveshjet për interpretimin regjistrohen, dhe një përmbledhje e përgjigjes, në shqip dhe në anglisht, publikohet bashkë me profilin. Kur nuk vjen përgjigje brenda afatit, kjo regjistrohet dhe nuk e ndryshon vlerësimin.',
        'Pas publikimit. Çdokush mund të kërkojë korrigjim ose shqyrtim. Shkruani te [contact@novaric.al](mailto:contact@novaric.al) ose me postë në adresën e NOVARIC® Sh.A. më sipër. Na ndihmon nëse përfshini:',
        '- adresën (URL) e profilit;',
        '- pohimin, brezin ose provën që kundërshtoni;',
        '- shpjegimin tuaj;',
        '- çdo material mbështetës.',
        'Nuk kërkojmë dokumente identiteti ose të dhëna personale përtej atyre që nevojiten për t\'ju përgjigjur. Dr Alban Gj. THIKA vendos nëse profili korrigjohet, pezullohet ose tërhiqet, dhe çdo ndryshim shënohet me datë.',
        'Ky kanal nuk përjashton asnjë mënyrë tjetër të ligjshme për të na njoftuar ose për të ushtruar të drejtat tuaja.',
      ],
      en: [
        'Before publication. Before a band about an identifiable person is published, NOVARIC® Sh.A. sends that person, through an official channel, a notice in Albanian and English with the findings, the proposed bands, the confidence, the evidence list and how to reply. The reply deadline is 10 working days, not counting Albanian public holidays, and is extended by 5 working days on a reasoned request.',
        'This deadline is an internal rule of NOVARIC® Sh.A., not a deadline set by law, and it does not replace any deadline or procedure provided by law.',
        'Documented factual corrections return the file to review. Disagreements about interpretation are recorded, and a summary of the reply, in Albanian and English, is published with the profile. When no reply arrives within the deadline, this is recorded and does not change the assessment.',
        'After publication. Anyone may ask for a correction or a review. Write to [contact@novaric.al](mailto:contact@novaric.al) or by post to the NOVARIC® Sh.A. address above. It helps if you include:',
        '- the address (URL) of the profile;',
        '- the statement, band or evidence you dispute;',
        '- your explanation;',
        '- any supporting material.',
        'We do not ask for identity documents or for more personal data than we need to reply to you. Dr Alban Gj. THIKA decides whether the profile is corrected, suspended or withdrawn, and every change is recorded with its date.',
        'This channel does not exclude any other lawful way of notifying us or of exercising your rights.',
      ],
    },
  },
  {
    id: 'privatesia',
    number: 11,
    heading: { sq: 'Privatësia, fotografitë dhe burimet', en: 'Privacy, images and source attribution' },
    body: {
      sq: [
        'Të dhënat personale në profilet MARAGON® përpunohen në lidhje me rolin publik të personit dhe me debatin publik për median, në përputhje me Ligjin nr. 124/2024 «Për mbrojtjen e të dhënave personale». Ju ruani të drejtat që ju jep ky ligj, përfshirë të drejtën për informim, akses, korrigjim dhe kundërshtim, brenda kufijve që parashikon vetë ligji, si dhe të drejtën t\'i drejtoheni [Komisionerit për të Drejtën e Informimit dhe Mbrojtjen e të Dhënave Personale](https://idp.al/).',
        'Më shumë informacion gjeni te [Politika e Privatësisë](/?page=privacy).',
        'Burimet e fakteve listohen në çdo profil. Nëse jeni subjekti ose mbajtësi i të drejtave të një fotografie dhe kundërshtoni përdorimin ose atribuimin e saj, na shkruani; kërkesa juaj shqyrtohet.',
      ],
      en: [
        'Personal data in MARAGON® profiles is processed in connection with the person\'s public role and the public debate about the media, in accordance with Law No. 124/2024 "On personal data protection". You keep the rights this law gives you, including the rights to information, access, rectification and objection, within the limits the law itself sets, as well as the right to apply to the [Commissioner for the Right to Information and Personal Data Protection](https://idp.al/).',
        'More information is in the [Privacy Policy](/?page=privacy).',
        'The sources of facts are listed in every profile. If you are the subject or the rights holder of a photograph and object to its use or attribution, write to us; your request will be considered.',
      ],
    },
  },
  {
    id: 'te-drejtat',
    number: 12,
    heading: { sq: 'Të drejtat tuaja ruhen', en: 'Your legal rights are preserved' },
    body: {
      sq: [
        'Asgjë në këtë njoftim, në vlerësimet MARAGON® ose në përdorimin e kësaj faqeje nuk heq, nuk kufizon dhe nuk kushtëzon të drejtat që ju jep ligji, përfshirë të drejtën për t\'iu drejtuar gjykatës, Komisionerit ose një autoriteti tjetër kompetent. Përdorimi i kanalit tonë të kërkesave nuk është kusht për to.',
        'Çdokush, përfshirë personat e vlerësuar, mund ta citojë, ta komentojë ose ta kundërshtojë publikisht një vlerësim MARAGON®.',
        'Ky njoftim nuk është marrëveshje dhe nuk përjashton përgjegjësinë e NOVARIC® Sh.A.',
      ],
      en: [
        'Nothing in this notice, in MARAGON® assessments or in the use of this site removes, limits or makes conditional the rights the law gives you, including the right to apply to a court, to the Commissioner or to another competent authority. Using our request channel is not a precondition for them.',
        'Anyone, including the people assessed, may quote, comment on or publicly dispute a MARAGON® assessment.',
        'This notice is not an agreement and does not exclude the responsibility of NOVARIC® Sh.A.',
      ],
    },
  },
];

/** Section 13 is generated from MARAGON_NOTICE_META so the dates are never typed by hand. */
export function versionSection(meta: typeof MARAGON_NOTICE_META = MARAGON_NOTICE_META): MaragonNoticeSection {
  const approved = meta.approval;
  const sq: string[] = [
    `Versioni ${meta.version}. Hartuar më ${formatDate(meta.draftedOn)}.`,
    approved
      ? `Miratuar nga ${approved.approvedBy} më ${formatDate(approved.approvedOn)}.`
      : 'Draft për shqyrtim ligjor dhe editorial. Nuk është miratuar ende.',
    meta.publishedOn ? `Publikuar më ${formatDate(meta.publishedOn)}.` : 'Nuk është publikuar ende.',
    `Metodologjia në fuqi: ${meta.methodologyId}, nënshkruar më ${formatDate(meta.methodologySignedOn)}, me amendamentet AM-01 deri AM-09.`,
  ];
  const en: string[] = [
    `Version ${meta.version}. Drafted on ${formatDate(meta.draftedOn)}.`,
    approved
      ? `Approved by ${approved.approvedBy} on ${formatDate(approved.approvedOn)}.`
      : 'Draft for legal and editorial review. Not yet approved.',
    meta.publishedOn ? `Published on ${formatDate(meta.publishedOn)}.` : 'Not yet published.',
    `Methodology in force: ${meta.methodologyId}, signed on ${formatDate(meta.methodologySignedOn)}, with amendments AM-01 to AM-09.`,
  ];
  return {
    id: 'versioni',
    number: 13,
    heading: { sq: 'Versioni i dokumentit', en: 'Document version' },
    body: { sq, en },
  };
}

export function allNoticeSections(meta: typeof MARAGON_NOTICE_META = MARAGON_NOTICE_META): MaragonNoticeSection[] {
  return [...MARAGON_NOTICE_SECTIONS, versionSection(meta)];
}

/** dd.mm.yyyy, the date style used across the NOVARIC® site. */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[3]}.${m[2]}.${m[1]}`;
}

/** The page is public only when the owner's approval is recorded. Fail-closed. */
export function isMaragonNoticeApproved(meta: { status: MaragonNoticeStatus; approval: MaragonNoticeApproval | null } = MARAGON_NOTICE_META): boolean {
  return meta.status === 'approved_for_publication'
    && !!meta.approval
    && !!meta.approval.approvedBy.trim()
    && /^\d{4}-\d{2}-\d{2}$/.test(meta.approval.approvedOn)
    && !!meta.approval.reference.trim();
}

/** Splits "[text](href)" markup into text and link parts. */
export type NoticeInline = { kind: 'text'; text: string } | { kind: 'link'; text: string; href: string };

export function parseNoticeInline(paragraph: string): NoticeInline[] {
  const parts: NoticeInline[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(paragraph)) !== null) {
    if (m.index > last) parts.push({ kind: 'text', text: paragraph.slice(last, m.index) });
    parts.push({ kind: 'link', text: m[1], href: m[2] });
    last = m.index + m[0].length;
  }
  if (last < paragraph.length) parts.push({ kind: 'text', text: paragraph.slice(last) });
  return parts;
}
