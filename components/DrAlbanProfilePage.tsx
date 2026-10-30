import React, { useState, useMemo } from 'react';
import { 
  ShieldCheckIcon, 
  ScaleIcon, 
  BookOpenIcon, 
  DocumentTextIcon, 
  CheckIcon, 
  ShareIcon, 
  ChevronLeftIcon,
  GlobeEuropeAfricaIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
  PrinterIcon,
  XMarkIcon
} from './icons';
import { useSeo } from '../hooks/useSeo';
import { JsonLd } from './JsonLd';
import { NovaricBrand } from './NovaricBrand';

export interface AuthorProfilePageProps {
  onBack: () => void;
  onNavigate?: (page: string, data?: any) => void;
}

interface SectionData {
  id: number;
  slug: string;
  titleEn: string;
  titleSq: string;
  badgeEn?: string;
  badgeSq?: string;
  contentEn: string[];
  contentSq: string[];
  keyHighlightEn?: string;
  keyHighlightSq?: string;
  officialDocumentRef?: {
    refNumber: string;
    authority: string;
    date: string;
    effectiveDate: string;
    registeredRole: string;
    address: string;
    descriptionSq: string;
    descriptionEn: string;
  };
}

const SECTIONS: SectionData[] = [
  {
    id: 1,
    slug: 'identiteti-qellimi-fusha',
    titleEn: '1. Identity, Purpose and Scope',
    titleSq: '1. Identiteti, Qëllimi dhe Fusha e Zbatimit',
    badgeEn: 'Scope',
    badgeSq: 'Fusha e Zbatimit',
    contentEn: [
      'This statement sets out the principles governing the personal authorship, independent commentary and public communications of Dr Alban Gj. THIKA.',
      'It applies to material published or shared in his individual capacity through personal social media accounts, author profiles, websites and other communication channels, unless a particular publication expressly identifies a different capacity.',
      'Its purpose is to clarify authorship, institutional independence, editorial standards and the legal responsibilities associated with public expression.'
    ],
    contentSq: [
      'Kjo deklaratë përcakton parimet që udhëheqin autorësinë personale, komentet e pavarura dhe komunikimet publike të Dr Alban Gj. THIKA.',
      'Ajo zbatohet për materialet që autori publikon ose shpërndan në cilësinë e tij individuale përmes llogarive personale në rrjetet sociale, profileve të autorit, faqeve të internetit dhe kanaleve të tjera të komunikimit, përveç rasteve kur një publikim përcakton shprehimisht një cilësi tjetër përfaqësimi.',
      'Qëllimi është sqarimi i autorësisë, pavarësisë institucionale, standardeve editoriale dhe përgjegjësive ligjore që lidhen me shprehjen publike.'
    ],
    keyHighlightEn: 'Defines personal authorship boundaries and clarifies independent commentary status across all platforms.',
    keyHighlightSq: 'Përcakton kufijtë e autorësisë personale dhe statusin e komenteve të pavarura në të gjitha platformat.'
  },
  {
    id: 2,
    slug: 'perfaqesimi-individual',
    titleEn: '2. Individual Representation',
    titleSq: '2. Përfaqësimi Individual',
    badgeEn: 'Capacity',
    badgeSq: 'Cilësia',
    contentEn: [
      'Unless expressly stated otherwise, Dr Alban Gj. THIKA communicates in his personal capacity.',
      'His publications may contain individual opinions, political assessments, observations, commentary, research-based analysis, criticism, satire and contributions to public-interest debate.',
      'The use of professional qualifications, historical positions or organisational affiliations for identification does not, by itself, constitute institutional representation or endorsement.'
    ],
    contentSq: [
      'Përveç rasteve kur deklarohet shprehimisht ndryshe, Dr Alban Gj. THIKA komunikon në cilësinë e tij personale.',
      'Publikimet e tij mund të përmbajnë opinione individuale, vlerësime politike, vëzhgime, komente, analiza të mbështetura në kërkim, kritika, satirë dhe kontribute në debatin për çështje me interes publik.',
      'Përdorimi i titujve profesionalë, funksioneve të mëparshme ose lidhjeve organizative për qëllime identifikimi nuk përbën, në vetvete, përfaqësim apo miratim institucional.'
    ]
  },
  {
    id: 3,
    slug: 'shtetesia-malteze-llogarite',
    titleEn: '3. Maltese Citizenship and Account Administration',
    titleSq: '3. Shtetësia Malteze dhe Administrimi i Llogarive',
    badgeEn: 'Malta Jurisdiction & OPM PRESS 03/2025',
    badgeSq: 'Juridiksioni & OPM PRESS 03/2025',
    contentEn: [
      'Dr Alban Gj. THIKA is a citizen of Malta.',
      'According to the author\'s account-administration information, his personal Facebook account was opened and is managed using a Maltese address.',
      'These facts identify relevant personal and administrative connections with Malta. They do not establish that every publication originates physically from Malta, that the author is habitually resident there, or that Maltese law has exclusive application.'
    ],
    contentSq: [
      'Dr Alban Gj. THIKA është shtetas i Republikës së Maltës.',
      'Sipas informacionit të deklaruar për administrimin e llogarisë, profili i tij personal në Facebook është hapur dhe administrohet duke përdorur një adresë në Maltë.',
      'Këto rrethana tregojnë lidhje personale dhe administrative me Maltën. Ato nuk provojnë se çdo publikim kryhet fizikisht nga Malta, se autori ka domosdoshmërisht vendbanimin e zakonshëm atje, apo se legjislacioni maltez zbatohet në mënyrë ekskluzive.'
    ],
    keyHighlightEn: 'Confirms Maltese citizenship and administrative establishment while delineating geographic and legal scope.',
    keyHighlightSq: 'Konfirmon shtetësinë malteze dhe administrimin e llogarive duke përcaktuar fushëveprimin ligjor e gjeografik.',
    officialDocumentRef: {
      refNumber: 'OPM PRESS 03/2025',
      authority: 'Office of the Press Registrar (Uffiċċju tar-Reġistratur tal-Istampa), Malta',
      date: '15th July 2025',
      effectiveDate: '11th June 2025',
      registeredRole: 'Editor of the online portal MEDIA.NOVARIC.AL',
      address: '6, Hyacinth Crt, Fl 2, Triq Tumas Dingli, Birkirkara BKR 1693, Malta',
      descriptionSq: 'Dokument zyrtar lëshuar nga Uffiċċju tar-Reġistratur tal-Istampa (Department of Information, 3 Castille Place, Valletta) me dërgim zyrtar për njoftim te Prokurori i Përgjithshëm (Attorney General), Avokati i Shtetit (State Advocate) dhe Komisari i Policisë (Commissioner of Police).',
      descriptionEn: 'Official government certificate issued by the Office of the Press Registrar (Department of Information, 3 Castille Place, Valletta) with formal copy sent to the Attorney General, State Advocate, and Commissioner of Police.'
    }
  },
  {
    id: 4,
    slug: 'pavaresia-novaric-institucionet',
    titleEn: '4. Independence from NOVARIC® and Other Institutions',
    titleSq: '4. Pavarësia nga NOVARIC® dhe Institucionet e Tjera',
    badgeEn: 'Institutional Separation',
    badgeSq: 'Pavarësia Institucionale',
    contentEn: [
      'The author\'s personal opinions do not automatically represent the policies, decisions, official statements or institutional positions of NOVARIC® or any other company, organisation or body with which he is affiliated.',
      'An official institutional statement must be expressly identified as such and issued through an authorised channel.',
      'Where the author contributes material to NOVARIC® AI-Powered News, his personal authorship must be distinguished from the platform\'s separate editorial and publishing responsibilities.',
      'Publication of this disclaimer on a NOVARIC® website does not, by itself, constitute corporate endorsement of every personal statement.'
    ],
    contentSq: [
      'Opinionet personale të autorit nuk përfaqësojnë automatikisht politikat, vendimet, deklaratat zyrtare ose qëndrimet institucionale të NOVARIC® apo të çdo subjekti tjetër me të cilin ai ka lidhje profesionale.',
      'Një deklaratë zyrtare institucionale duhet të identifikohet shprehimisht si e tillë dhe të publikohet përmes një kanali të autorizuar.',
      'Kur autori kontribuon në NOVARIC® AI-Powered News, autorësia e tij personale duhet të dallohet nga përgjegjësitë e veçanta editoriale dhe të publikimit të platformës.',
      'Publikimi i kësaj deklarate në një faqe të NOVARIC® nuk nënkupton, në vetvete, miratimin nga shoqëria të çdo qëndrimi personal të autorit.'
    ]
  },
  {
    id: 5,
    slug: 'liria-e-shprehjes-debati-publik',
    titleEn: '5. Freedom of Expression and Public Debate',
    titleSq: '5. Liria e Shprehjes dhe Debati Publik',
    badgeEn: 'ECHR & Malta Const.',
    badgeSq: 'Neni 41 Kushtetuta / Neni 10 KEDNJ',
    contentEn: [
      'The author recognises and exercises freedom of opinion and expression as protected by applicable constitutional, European and international human-rights law, including Article 41 of Malta\'s Constitution and Article 10 of the European Convention on Human Rights.',
      'These protections encompass participation in political debate, criticism of government, scrutiny of public institutions, discussion of matters of public interest and the expression of personal value judgments.',
      'The author also recognises that freedom of expression carries duties and responsibilities and may be subject to lawful, necessary and proportionate restrictions.'
    ],
    contentSq: [
      'Autori njeh dhe ushtron të drejtën e lirisë së mendimit dhe të shprehjes, të mbrojtur nga legjislacioni kushtetues, evropian dhe ndërkombëtar i zbatueshëm, përfshirë nenin 41 të Kushtetutës së Maltës dhe nenin 10 të Konventës Evropiane për të Drejtat e Njeriut.',
      'Kjo mbrojtje përfshin pjesëmarrjen në debatin politik, kritikën ndaj qeverisë, shqyrtimin kritik të institucioneve publike, diskutimin e çështjeve me interes publik dhe shprehjen e gjykimeve personale të vlerës.',
      'Autori pranon gjithashtu se liria e shprehjes shoqërohet me detyra dhe përgjegjësi dhe mund t\'u nënshtrohet kufizimeve të ligjshme, të nevojshme dhe proporcionale.'
    ]
  },
  {
    id: 6,
    slug: 'kritika-politike-satira',
    titleEn: '6. Political Criticism, Satire and Value Judgments',
    titleSq: '6. Kritika Politike, Satira dhe Gjykimet e Vlerës',
    badgeEn: 'Discourse Standards',
    badgeSq: 'Diskurset Publike',
    contentEn: [
      'Political commentary may employ direct language, rhetorical questions, irony, satire, metaphor, exaggeration or strongly expressed criticism.',
      'Such expressions should be understood in their complete context, taking account of their purpose, subject matter and the distinction between opinions and factual assertions.',
      'The description of a statement as opinion or satire does not automatically determine its legal character.',
      'Where a value judgment implies an underlying factual allegation, the author recognises the importance of an appropriate factual foundation.'
    ],
    contentSq: [
      'Komentet politike mund të përmbajnë gjuhë të drejtpërdrejtë, pyetje retorike, ironi, satirë, metafora, ekzagjerime ose kritika të forta.',
      'Këto shprehje duhen vlerësuar në kontekstin e tyre të plotë, duke marrë parasysh qëllimin, tematikën dhe dallimin ndërmjet opinioneve dhe pohimeve faktike.',
      'Emërtimi i një deklarate si opinion ose satirë nuk përcakton automatikisht natyrën e saj juridike.',
      'Kur një gjykim vlere nënkupton një pretendim faktik, autori njeh rëndësinë e ekzistencës së një baze faktike të përshtatshme.'
    ]
  },
  {
    id: 7,
    slug: 'faktet-pretendimet-pafajesia',
    titleEn: '7. Facts, Allegations and Presumption of Innocence',
    titleSq: '7. Faktet, Pretendimet dhe Prezumimi i Pafajësisë',
    badgeEn: 'Rule of Law',
    badgeSq: 'Shteti i së Drejtës',
    contentEn: [
      'The author seeks to distinguish verified facts, attributed allegations, interpretations and personal opinions.',
      'References to investigations, accusations, complaints, media reports or judicial proceedings do not constitute findings of guilt.',
      'Where an individual has not been convicted by a competent court, the applicable presumption of innocence must be respected.',
      'Serious allegations should be supported by identifiable sources, clearly attributed and accurately described according to their procedural status.'
    ],
    contentSq: [
      'Autori synon të dallojë faktet e verifikuara, pretendimet e atribuuara, interpretimet dhe opinionet personale.',
      'Referimet ndaj hetimeve, akuzave, ankesave, raportimeve mediatike ose proceseve gjyqësore nuk përbëjnë konstatim fajësie.',
      'Kur një person nuk është dënuar nga një gjykatë kompetente, duhet të respektohet prezumimi i pafajësisë sipas ligjit të zbatueshëm.',
      'Pretendimet serioze duhet të mbështeten në burime të identifikueshme, të atribuohen qartë dhe të përshkruhen saktësisht sipas statusit të tyre procedural.'
    ]
  },
  {
    id: 8,
    slug: 'saktesia-verifikimi-pergjegjesia',
    titleEn: '8. Accuracy, Verification and Editorial Responsibility',
    titleSq: '8. Saktësia, Verifikimi dhe Përgjegjësia Editoriale',
    badgeEn: 'Verification',
    badgeSq: 'Verifikimi',
    contentEn: [
      'Reasonable efforts will be made to verify material factual claims before publication.',
      'Relevant sources, dates, contextual information and evidentiary limitations should be identified where appropriate.',
      'The author may rely on official records, first-hand observations, judicial documents, reputable reporting or other relevant materials, but the use of a third-party source does not guarantee accuracy or eliminate responsibility for republication.',
      'Material inaccuracies brought to the author\'s attention will be assessed in good faith.'
    ],
    contentSq: [
      'Përpara publikimit do të bëhen përpjekje të arsyeshme për verifikimin e pretendimeve faktike me rëndësi.',
      'Burimet përkatëse, datat, informacioni kontekstual dhe kufizimet e provave duhet të identifikohen kur është e përshtatshme.',
      'Autori mund të mbështetet në dokumente zyrtare, vëzhgime të drejtpërdrejta, akte gjyqësore, raportime të besueshme ose materiale të tjera përkatëse. Megjithatë, përdorimi i burimeve të palëve të treta nuk garanton saktësinë dhe nuk e përjashton përgjegjësinë për ripublikimin.',
      'Pasaktësitë thelbësore që i bëhen të ditura autorit do të shqyrtohen në mirëbesim.'
    ]
  },
  {
    id: 9,
    slug: 'pjesemarrja-paqesore-mosnxitja-dhunes',
    titleEn: '9. Peaceful Civic Participation and Non-Violence',
    titleSq: '9. Pjesëmarrja Qytetare Paqësore dhe Mosnxitja e Dhunës',
    badgeEn: 'Non-Violence',
    badgeSq: 'Jo-Dhuna',
    contentEn: [
      'The author supports peaceful civic participation, democratic accountability, lawful protest and the protection of fundamental rights.',
      'No publication is intended to encourage unlawful violence, credible threats, harassment, intimidation or attacks on individuals or property.',
      'Criticism of public authorities, officials, political organisations or institutional conduct should not be interpreted as an instruction to harm any person.'
    ],
    contentSq: [
      'Autori mbështet pjesëmarrjen qytetare paqësore, përgjegjshmërinë demokratike, protestën e ligjshme dhe mbrojtjen e të drejtave themelore.',
      'Asnjë publikim nuk synon të nxisë dhunë të paligjshme, kërcënime serioze, përndjekje, frikësim ose sulme ndaj personave apo pronës.',
      'Kritika ndaj autoriteteve publike, zyrtarëve, organizatave politike ose veprimtarisë institucionale nuk duhet interpretuar si udhëzim për dëmtimin e ndonjë personi.'
    ]
  },
  {
    id: 10,
    slug: 'privatesia-te-dhenat-dinjiteti',
    titleEn: '10. Privacy, Personal Data and Human Dignity',
    titleSq: '10. Privatësia, Të Dhënat Personale dhe Dinjiteti Njerëzor',
    badgeEn: 'GDPR & Privacy',
    badgeSq: 'GDPR & Privatësia',
    contentEn: [
      'The author recognises the rights of individuals to privacy, personal-data protection, dignity and reputation.',
      'The publication of personal information will be considered in light of applicable law, legitimate public-interest purposes, necessity and proportionality.',
      'Private addresses, confidential information, unnecessary personal identifiers and sensitive information should not be disclosed without an appropriate lawful justification.',
      'Particular care applies to minors, victims, vulnerable persons and individuals involved in ongoing legal proceedings.'
    ],
    contentSq: [
      'Autori njeh të drejtat e individëve për privatësi, mbrojtje të të dhënave personale, dinjitet dhe reputacion.',
      'Publikimi i informacionit personal do të vlerësohet sipas ligjit të zbatueshëm, qëllimit legjitim të interesit publik, domosdoshmërisë dhe proporcionalitetit.',
      'Adresat private, informacionet konfidenciale, të dhënat identifikuese të panevojshme dhe informacionet sensitive nuk duhet të publikohen pa një justifikim të përshtatshëm ligjor.',
      'Kujdes i veçantë duhet treguar ndaj të miturve, viktimave, personave në situata cenueshmërie dhe individëve të përfshirë në procedime gjyqësore.'
    ]
  },
  {
    id: 11,
    slug: 'permbajtja-paleve-treta-pronesia-intelektuale',
    titleEn: '11. Third-Party Content and Intellectual Property',
    titleSq: '11. Përmbajtja e Palëve të Treta dhe Pronësia Intelektuale',
    badgeEn: 'IP & Attribution',
    badgeSq: 'Pronësia Intelektuale',
    contentEn: [
      'Third-party images, videos, extracts, screenshots, quotations and links may be used where permitted by applicable law and relevant rights.',
      'Source attribution will be provided where reasonably practicable and appropriate.',
      'Attribution alone does not establish permission to reproduce protected material.',
      'External links and third-party content do not necessarily reflect the author\'s views, and their inclusion does not amount to an endorsement of their entire content.'
    ],
    contentSq: [
      'Fotografitë, videot, fragmentet, pamjet e ekranit, citimet dhe lidhjet e jashtme mund të përdoren kur lejohet nga ligji i zbatueshëm dhe nga të drejtat përkatëse.',
      'Burimet do të identifikohen kur kjo është e arsyeshme dhe e përshtatshme.',
      'Vetëm përmendja e burimit nuk përbën automatikisht leje për riprodhimin e materialit të mbrojtur.',
      'Lidhjet dhe përmbajtjet e palëve të treta nuk pasqyrojnë domosdoshmërisht qëndrimet e autorit dhe përfshirja e tyre nuk nënkupton miratimin e të gjithë përmbajtjes.'
    ]
  },
  {
    id: 12,
    slug: 'inteligjenca-artificiale-permbajtja-sintetike',
    titleEn: '12. Artificial Intelligence and Synthetic Media',
    titleSq: '12. Inteligjenca Artificiale dhe Përmbajtja Sintetike',
    badgeEn: 'EU AI Act',
    badgeSq: 'Rregullorja e BE për IA',
    contentEn: [
      'Artificial intelligence may assist with research organisation, drafting, translation, editing, visual presentation and other publication processes.',
      'Materially AI-generated or manipulated images, audio, video or text will be identified where required by applicable law or where disclosure is necessary to prevent a misleading impression of authenticity.',
      'Synthetic content must not knowingly be presented as genuine evidence of events, statements or conduct that did not occur.',
      'Human editorial review does not automatically eliminate legal responsibility for published material.'
    ],
    contentSq: [
      'Inteligjenca artificiale mund të përdoret për organizimin e kërkimit, hartimin e teksteve, përkthimin, redaktimin, paraqitjen vizuale dhe procese të tjera të publikimit.',
      'Imazhet, materialet audio, videot ose tekstet e krijuara apo të manipuluara në mënyrë thelbësore me inteligjencë artificiale do të identifikohen kur kërkohet nga ligji i zbatueshëm ose kur kjo është e nevojshme për të shmangur një përshtypje çorientuese për autenticitetin e tyre.',
      'Përmbajtja sintetike nuk duhet të paraqitet me vetëdije si provë autentike e ngjarjeve, deklaratave apo veprimeve që nuk kanë ndodhur.',
      'Shqyrtimi editorial njerëzor nuk e përjashton automatikisht përgjegjësinë ligjore për materialin e publikuar.'
    ],
    keyHighlightEn: 'Strict transparency obligations under the EU AI Act Regulation (EU) 2024/1689 regarding synthetic outputs.',
    keyHighlightSq: 'Detyrime rigoroze transparence sipas Rregullores së BE-së për IA (EU) 2024/1689 mbi materialet sintetike.'
  },
  {
    id: 13,
    slug: 'komentet-e-paleve-treta',
    titleEn: '13. Third-Party Comments and Community Standards',
    titleSq: '13. Komentet e Palëve të Treta dhe Standardet e Komunitetit',
    badgeEn: 'Moderation',
    badgeSq: 'Moderimi',
    contentEn: [
      'The author welcomes substantive discussion, criticism and disagreement.',
      'Comments may be moderated where they contain threats, incitement, harassment, discriminatory abuse, unlawful personal-data disclosures, impersonation, spam or other unlawful material.',
      'Moderation decisions will be made according to applicable legal obligations and reasonable community standards.',
      'The author does not necessarily endorse statements made independently by commenters. This statement does not exclude any legal responsibility that may arise in connection with the management of comments.'
    ],
    contentSq: [
      'Autori mirëpret diskutimin me përmbajtje, kritikën dhe mendimet e kundërta.',
      'Komentet mund të moderohen kur përmbajnë kërcënime, nxitje të dhunës, përndjekje, fyerje diskriminuese, publikim të paligjshëm të të dhënave personale, uzurpim identiteti, mesazhe të padëshiruara ose përmbajtje tjetër të paligjshme.',
      'Vendimet e moderimit do të merren në përputhje me detyrimet ligjore të zbatueshme dhe standardet e arsyeshme të komunitetit.',
      'Autori nuk miraton domosdoshmërisht deklaratat e bëra në mënyrë të pavarur nga komentuesit. Kjo dispozitë nuk përjashton përgjegjësitë ligjore që mund të lindin nga administrimi i komenteve.'
    ]
  },
  {
    id: 14,
    slug: 'publikimi-nderkufitar-ligji',
    titleEn: '14. Cross-Border Publication and Applicable Law',
    titleSq: '14. Publikimi Ndërkufitar dhe Ligji i Zbatueshëm',
    badgeEn: 'Cross-Border',
    badgeSq: 'Ndërkufitar',
    contentEn: [
      'Personal publications may be accessible in Malta, Albania, other European countries and internationally.',
      'The legal consequences of a particular publication may depend on its content, the location and legal circumstances of the persons involved, the place of publication, the alleged harm and the applicable jurisdictional rules.',
      'Maltese citizenship and the use of a Maltese account-administration address do not confer exclusive Maltese jurisdiction or immunity from laws applicable elsewhere.',
      'Nothing in this disclaimer constitutes a submission to any particular court, a contractual choice of law, or a representation that any jurisdiction lacks legal authority.'
    ],
    contentSq: [
      'Publikimet personale mund të jenë të aksesueshme në Maltë, Shqipëri, vende të tjera evropiane dhe ndërkombëtarisht.',
      'Pasojat juridike të një publikimi konkret mund të varen nga përmbajtja, vendndodhja dhe rrethanat juridike të personave të përfshirë, vendi i publikimit, dëmi i pretenduar dhe rregullat e zbatueshme të juridiksionit.',
      'Shtetësia malteze dhe përdorimi i një adrese malteze për administrimin e llogarisë nuk krijojnë juridiksion ekskluziv maltez dhe as imunitet ndaj ligjeve që mund të zbatohen në juridiksione të tjera.',
      'Asgjë në këtë deklaratë nuk përbën pranim të juridiksionit të një gjykate të caktuar, zgjedhje kontraktore të ligjit të zbatueshëm ose pretendim se një juridiksion tjetër nuk ka kompetencë ligjore.'
    ]
  },
  {
    id: 15,
    slug: 'korrigjimet-ankesat-pergjigja',
    titleEn: '15. Corrections, Complaints and Right of Reply',
    titleSq: '15. Korrigjimet, Ankesat dhe E Drejta e Përgjigjes',
    badgeEn: 'Right of Reply',
    badgeSq: 'E Drejta e Përgjigjes',
    contentEn: [
      'Persons who identify a material factual error, misattribution, privacy concern or potential infringement of their rights may submit a reasoned request through the designated contact mechanism on the publishing website.',
      'Requests should identify the relevant publication, explain the concern and provide supporting information where reasonably available.',
      'Depending on the circumstances and applicable law, the author or responsible publisher may issue a clarification, correction, contextual note, reply, restriction or removal.',
      'Lawful disagreement with an opinion does not, by itself, establish an entitlement to its removal.',
      'Nothing in this section limits statutory rights of complaint, correction, reply or legal redress.'
    ],
    contentSq: [
      'Personat që konstatojnë një gabim faktik thelbësor, atribuim të pasaktë, cenim të privatësisë ose shkelje të mundshme të të drejtave të tyre mund të paraqesin një kërkesë të arsyetuar përmes mekanizmit të kontaktit të përcaktuar në faqen e publikimit.',
      'Kërkesa duhet të identifikojë publikimin përkatës, të shpjegojë shqetësimin dhe të shoqërohet me informacion mbështetës, kur ky është i disponueshëm në mënyrë të arsyeshme.',
      'Në varësi të rrethanave dhe ligjit të zbatueshëm, autori ose publikuesi përgjegjës mund të bëjë sqarim, korrigjim, shënim kontekstual, publikim përgjigjeje, kufizim ose heqje të materialit.',
      'Mospajtimi i ligjshëm me një opinion nuk krijon, në vetvete, të drejtën për heqjen e tij.',
      'Kjo dispozitë nuk kufizon të drejtat ligjore për ankesë, korrigjim, përgjigje ose mbrojtje gjyqësore.'
    ]
  },
  {
    id: 16,
    slug: 'mosperberja-keshillimit-profesional',
    titleEn: '16. No Professional Advice',
    titleSq: '16. Mospërbërja e Këshillimit Profesional',
    badgeEn: 'Advisory Disclaimer',
    badgeSq: 'Kufizimi Profesional',
    contentEn: [
      'Unless expressly identified as a professional service or authorised institutional communication, personal publications do not constitute legal, financial, immigration, employment, medical, investment or other regulated professional advice.',
      'Mere publication or reading of content does not create a professional-client relationship or contractual obligation.',
      'Readers should seek qualified independent advice suited to their particular circumstances before taking or refraining from any action.'
    ],
    contentSq: [
      'Përveç rasteve kur identifikohen shprehimisht si shërbim profesional ose komunikim institucional i autorizuar, publikimet personale nuk përbëjnë këshillim juridik, financiar, migracioni, punësimi, investimi ose këshillim tjetër profesional të rregulluar.',
      'Vetëm publikimi ose leximi i tyre nuk krijon marrëdhënie profesionale me klientin apo detyrim kontraktor.',
      'Lexuesit duhet të kërkojnë këshillim të pavarur të kualifikuar të përshtatshëm për rrethanat e tyre specifike përpara se të ndërmarrin veprime.'
    ]
  },
  {
    id: 17,
    slug: 'pergjegjesia-editoriale-korporative',
    titleEn: '17. Editorial and Corporate Responsibility',
    titleSq: '17. Përgjegjësia Editoriale dhe Korporative',
    badgeEn: 'Editorial Capacity (OPM PRESS 03/2025)',
    badgeSq: 'Përgjegjësia Editoriale (OPM PRESS 03/2025)',
    contentEn: [
      'The author may act in various capacities, including as a private individual, independent commentator, organisational representative, or contributor to a media platform.',
      'The applicable capacity must be identified in each publication whenever there is a reasonable possibility of misunderstanding.',
      'The legal and editorial responsibilities of the publisher, website operator, employer, data controller, or other body are determined by applicable law and concrete circumstances, not solely by this declaration.'
    ],
    contentSq: [
      'Autori mund të veprojë në cilësi të ndryshme, përfshirë individ privat, komentues të pavarur, përfaqësues organizativ ose kontribues në një platformë mediatike.',
      'Cilësia përkatëse duhet të identifikohet në çdo publikim kur ekziston mundësi e arsyeshme për keqkuptim.',
      'Përgjegjësitë e publikuesit, operatorit të faqes, punëdhënësit, kontrolluesit të të dhënave ose një organizate tjetër përcaktohen nga ligji i zbatueshëm dhe rrethanat konkrete, jo vetëm nga kjo deklaratë.'
    ],
    officialDocumentRef: {
      refNumber: 'OPM PRESS 03/2025',
      authority: 'Office of the Press Registrar, Malta',
      date: '15th July 2025',
      effectiveDate: '11th June 2025',
      registeredRole: 'Editor of the online portal MEDIA.NOVARIC.AL',
      address: '6, Hyacinth Crt, Fl 2, Triq Tumas Dingli, Birkirkara BKR 1693, Malta',
      descriptionSq: 'Dallimi Ligjor i Përgjegjësive: Alban Thika është regjistruar zyrtarisht si Kryeredaktor (Editor) i portalit online MEDIA.NOVARIC.AL pranë Zyrës së Regjistruesit të Shtypit në Maltë. Ky funksion institucional dallohet qartë nga opinionet personale të shprehura në cilësi të autorit të pavarur.',
      descriptionEn: 'Statutory Distinction: Alban Thika is registered as Editor of the online portal MEDIA.NOVARIC.AL at the Press Registry in Malta. This statutory editorial role is distinguished from personal commentaries issued as an independent author.'
    }
  },
  {
    id: 18,
    slug: 'kufizimet-ligjore',
    titleEn: '18. Legal Limitations',
    titleSq: '18. Kufizimet Ligjore',
    badgeEn: 'Statutory Limits',
    badgeSq: 'Kufizimet Ligjore',
    contentEn: [
      'This statement explains the intended principles of publication and the author\'s individual representation.',
      'It does not create immunity from civil, criminal, administrative or regulatory liability.',
      'It does not exclude liabilities that cannot be lawfully excluded, does not impede legal proceedings, does not override platform rules, and does not limit the statutory rights of other persons.'
    ],
    contentSq: [
      'Kjo deklaratë shpjegon parimet e synuara të publikimit dhe përfaqësimin personal të autorit.',
      'Ajo nuk krijon imunitet nga përgjegjësia civile, penale, administrative ose rregullatore.',
      'Nuk përjashton përgjegjësi që nuk mund të përjashtohen ligjërisht, nuk pengon procedimet ligjore, nuk mbizotëron mbi rregullat e platformave dhe nuk kufizon të drejtat ligjore të personave të tjerë.'
    ]
  },
  {
    id: 19,
    slug: 'ndryshimet-historiku-dokumentit',
    titleEn: '19. Amendments and Document History',
    titleSq: '19. Ndryshimet dhe Historiku i Dokumentit',
    badgeEn: 'Version History',
    badgeSq: 'Historiku i Versionit',
    contentEn: [
      'This statement may be reviewed periodically to reflect legal developments, editorial practices or changes in publishing arrangements.',
      'Substantive amendments must be documented with a version number, publication date, effective date, and a summary of revisions.',
      'Prior publications should be evaluated according to their circumstances and the law applicable at the relevant time.'
    ],
    contentSq: [
      'Deklarata mund të rishikohet për të pasqyruar zhvillimet ligjore, praktikat editoriale ose ndryshimet në mënyrën e publikimit.',
      'Ndryshimet thelbësore duhet të dokumentohen me numër versioni, datë publikimi, datë hyrjeje në fuqi dhe përmbledhje të ndryshimeve.',
      'Publikimet e mëparshme duhet të vlerësohen sipas rrethanave të tyre dhe ligjit të zbatueshëm në kohën përkatëse.'
    ]
  },
  {
    id: 20,
    slug: 'deklarata-e-autorit',
    titleEn: '20. Author Declaration & Formal Sign-Off',
    titleSq: '20. Deklarata e Autorit',
    badgeEn: 'Declaration',
    badgeSq: 'Deklarata Formale',
    contentEn: [
      'Dr Alban Gj. THIKA affirms the fundamental importance of independent thinking, democratic debate, public accountability, freedom of expression, human dignity, and responsible publishing.',
      'The author retains the right to express lawful criticism and personal opinions, including strongly held political views, while respecting the rights of others and the requirements of applicable law.',
      'Dr Alban Gj. THIKA',
      'Maltese Citizen | Independent Author & Commentator',
      'Official publishing platform: https://media.novaric.al/',
      'Section: Author Profile (Profili i Autorit) — Publikime',
      'Status: Approved and Officially Published (Effective Date: 29 October 2026)'
    ],
    contentSq: [
      'Dr Alban Gj. THIKA pohon rëndësinë e mendimit të pavarur, debatit demokratik, përgjegjshmërisë publike, lirisë së shprehjes, dinjitetit njerëzor dhe publikimit të përgjegjshëm.',
      'Autori ruan të drejtën për të shprehur kritika të ligjshme dhe opinione personale, përfshirë qëndrime të forta politike, duke njohur njëkohësisht të drejtat e të tjerëve dhe kërkesat e ligjit të zbatueshëm.',
      'Dr Alban Gj. THIKA',
      'Shtetas Maltez | Autor dhe Komentues i Pavarur',
      'Platforma zyrtare e publikimit: https://media.novaric.al/',
      'Seksioni: Profili i Autorit — Publikime',
      'Statusi: I miratuar dhe i publikuar zyrtarisht (Data e hyrjes në fuqi: 29 tetor 2026)'
    ],
    keyHighlightEn: 'Formal declaration by the author affirming independent authorship, democratic accountability and responsible publishing.',
    keyHighlightSq: 'Deklaratë formale e autorit që pohon autorësinë e pavarur, llogaridhënien demokratike dhe publikimin e përgjegjshëm.'
  }
];

export const AuthorProfilePage: React.FC<AuthorProfilePageProps> = ({ onBack, onNavigate }) => {
  const [activeLang, setActiveLang] = useState<'sq' | 'en' | 'dual'>('dual');
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const isSq = activeLang === 'sq';
  const isEn = activeLang === 'en';

  const certImagePath = "/assets/aistudio/image_c76af1fd.png";

  const pageTitle = isSq
    ? "DEKLARATË PËR PËRFAQËSIMIN INDIVIDUAL TË AUTORIT, LIRINË E SHPREHJES DHE RRJETET SOCIALE | Dr Alban Gj. THIKA"
    : "Profili i Autorit | Dr Alban Gj. THIKA — Freedom of Expression & Social Media Disclaimer";

  const pageDescription = isSq
    ? "DEKLARATË PËR PËRFAQËSIMIN INDIVIDUAL TË AUTORIT, LIRINË E SHPREHJES DHE RRJETET SOCIALE. ID e dokumentit: NVR-MEDIA-LEG-001. Dr Alban Gj. THIKA (Shtetas Maltez | Autor dhe Komentues i Pavarur). Referencë zyrtare e regjistrimit të shtypit në Maltë: OPM PRESS 03/2025."
    : "INDIVIDUAL AUTHOR REPRESENTATION, FREEDOM OF EXPRESSION & SOCIAL MEDIA DISCLAIMER. Document ID: NVR-MEDIA-LEG-001. Author: Dr Alban Gj. THIKA (Maltese Citizen). Official Malta Press Registration: OPM PRESS 03/2025.";

  const pageImageUrl = "https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png";
  const canonicalUrl = "https://media.novaric.al/?page=authorProfile";

  useSeo(pageTitle, pageDescription, pageImageUrl, canonicalUrl);

  const filteredSections = useMemo(() => {
    if (!searchFilter.trim()) return SECTIONS;
    const q = searchFilter.toLowerCase();
    return SECTIONS.filter(s => 
      s.titleEn.toLowerCase().includes(q) ||
      s.titleSq.toLowerCase().includes(q) ||
      s.contentEn.some(p => p.toLowerCase().includes(q)) ||
      s.contentSq.some(p => p.toLowerCase().includes(q)) ||
      (s.badgeEn && s.badgeEn.toLowerCase().includes(q)) ||
      (s.badgeSq && s.badgeSq.toLowerCase().includes(q))
    );
  }, [searchFilter]);

  const handleCopyDocument = () => {
    let textToCopy = '';

    if (activeLang === 'sq') {
      const headerSq = `# DEKLARATË PËR PËRFAQËSIMIN INDIVIDUAL TË AUTORIT, LIRINË E SHPREHJES DHE RRJETET SOCIALE\n\n**Dr Alban Gj. THIKA**\n\n**ID e dokumentit:** NVR-MEDIA-LEG-001\n**Versioni:** 1.0 — Zyrtar dhe i Publikuar\n**Data e hartimit:** 29 tetor 2026\n**Klasifikimi:** Deklaratë personale e autorit\n**Vendi i publikimit:** NOVARIC® AI-Powered News — Profili i Autorit (Publikime)\n**Statusi:** I miratuar dhe i publikuar zyrtarisht\n**Data e hyrjes në fuqi:** 29 tetor 2026\n**Referencë Zyrtare e Regjistrimit të Shtypit:** OPM PRESS 03/2025 (Uffiċċju tar-Reġistratur tal-Istampa, Maltë — Editor: MEDIA.NOVARIC.AL)\n\n`;
      const bodySq = SECTIONS.map(s => `### ${s.titleSq}\n\n${s.contentSq.join('\n\n')}`).join('\n\n');
      const footerSq = `\n\n---\n\n**Regjistri i Kontrollit të Dokumentit**\n\nID: NVR-MEDIA-LEG-001\nVersioni: 1.0 Zyrtar\nHartuar: 29 tetor 2026\nShqyrtimi ligjor: I Përfunduar / I Konfirmuar\nMiratimi editorial: I Miratuar për Publikim\nRegjistrimi i Shtypit (Malta): OPM PRESS 03/2025\nData e hyrjes në fuqi: 29 tetor 2026\nHistoriku: Versioni 1.0 Zyrtar — Konfirmuar dhe Publikuar\n`;
      textToCopy = headerSq + bodySq + footerSq;
    } else if (activeLang === 'en') {
      const headerEn = `# INDIVIDUAL AUTHOR REPRESENTATION, FREEDOM OF EXPRESSION & SOCIAL MEDIA DISCLAIMER\n\n**Dr Alban Gj. THIKA**\n\n**Document ID:** NVR-MEDIA-LEG-001\n**Version:** 1.0 — Official & Published\n**Draft date:** 29 October 2026\n**Classification:** Personal Author Statement\n**Publication location:** NOVARIC® AI-Powered News — Author Profile (Publications)\n**Status:** Approved and Officially Published\n**Effective date:** 29 October 2026\n**Official Press Registration Reference:** OPM PRESS 03/2025 (Office of the Press Registrar, Malta — Editor: MEDIA.NOVARIC.AL)\n\n`;
      const bodyEn = SECTIONS.map(s => `### ${s.titleEn}\n\n${s.contentEn.join('\n\n')}`).join('\n\n');
      const footerEn = `\n\n---\n\n**Document Control Record**\n\nID: NVR-MEDIA-LEG-001\nVersion: 1.0 Official\nDraft Date: 29 October 2026\nLegal Review: Completed / Confirmed\nEditorial Approval: Approved for Publication\nPress Registration (Malta): OPM PRESS 03/2025\nEffective Date: 29 October 2026\nHistory: Version 1.0 Official — Confirmed & Published\n`;
      textToCopy = headerEn + bodyEn + footerEn;
    } else {
      const headerDual = `# DEKLARATË PËR PËRFAQËSIMIN INDIVIDUAL TË AUTORIT, LIRINË E SHPREHJES DHE RRJETET SOCIALE\n# INDIVIDUAL AUTHOR REPRESENTATION, FREEDOM OF EXPRESSION & SOCIAL MEDIA DISCLAIMER\n\nDr Alban Gj. THIKA\nID: NVR-MEDIA-LEG-001 | Version: 1.0 Zyrtar / Official (29 Tetor / October 2026)\nStatus: Approved & Published / I Miratuar dhe Publikuar\nOfficial Press Registration: OPM PRESS 03/2025 (Office of the Press Registrar, Malta)\n\n`;
      const bodyDual = SECTIONS.map(s => `### ${s.titleSq}\n(${s.titleEn})\n\n[AL]:\n${s.contentSq.join('\n\n')}\n\n[EN]:\n${s.contentEn.join('\n\n')}`).join('\n\n---\n\n');
      const footerDual = `\n\n---\n\nRegjistri i Kontrollit të Dokumentit / Document Control Record (NVR-MEDIA-LEG-001)\nStatus: Confirmed & Published / I Miratuar & Publikuar Zyrtarisht (29/10/2026)\nPress Registration Ref: OPM PRESS 03/2025\n`;
      textToCopy = headerDual + bodyDual + footerDual;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    }).catch(err => {
      console.error('Copy failed:', err);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (slug: string, id: number) => {
    setActiveSectionId(id);
    const element = document.getElementById(`section-${slug}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900/90 text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "name": "Profili i Autorit: Dr Alban Gj. THIKA",
          "description": pageDescription,
          "url": canonicalUrl,
          "image": pageImageUrl,
          "mainEntity": {
            "@type": "Person",
            "name": "Dr Alban Gj. THIKA",
            "nationality": "Maltese",
            "jobTitle": "Independent Author & Commentator, Registered Editor of MEDIA.NOVARIC.AL"
          }
        }}
      />

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Breadcrumb & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/60 shadow-lg">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-700/70 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors"
              aria-label="Kthehu prapa"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1.5" />
              <span>Kthehu</span>
            </button>
            <div className="h-4 w-px bg-slate-700" />
            <span className="text-xs sm:text-sm text-slate-400">
              Publikime / <span className="text-primary-400 font-semibold">Profili i Autorit</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language switch */}
            <div className="inline-flex rounded-lg bg-slate-900/80 p-0.5 border border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setActiveLang('dual')}
                className={`px-2.5 py-1 rounded-md transition-all ${activeLang === 'dual' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Shiko versionin e dyfishtë AL + EN"
              >
                Dual (AL + EN)
              </button>
              <button
                onClick={() => setActiveLang('sq')}
                className={`px-2.5 py-1 rounded-md transition-all ${activeLang === 'sq' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Versioni Shqip (Zyrtar)"
              >
                Shqip
              </button>
              <button
                onClick={() => setActiveLang('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${activeLang === 'en' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                title="Official English Legal Text"
              >
                English
              </button>
            </div>

            <button
              onClick={handleCopyDocument}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700/70 hover:bg-slate-600 text-slate-200 transition-colors"
              title="Kopjo gjithë dokumentin ligjor në clipboard"
            >
              {copiedSuccess ? (
                <>
                  <CheckIcon className="w-4 h-4 mr-1 text-emerald-400" />
                  <span className="text-emerald-400">U Kopjua!</span>
                </>
              ) : (
                <>
                  <ShareIcon className="w-4 h-4 mr-1" />
                  <span>Kopjo Tekstin</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700/70 hover:bg-slate-600 text-slate-200 transition-colors"
              title="Printo ose Ruaj si PDF"
            >
              <PrinterIcon className="w-4 h-4 mr-1" />
              <span>Printo</span>
            </button>
          </div>
        </div>

        {/* Hero Card: Dr Alban Gj. THIKA */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8">
            {/* Author Portrait */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-primary-500/50 shadow-xl bg-slate-800 ring-4 ring-primary-500/10">
                <img
                  src="https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png"
                  alt="Dr Alban Gj. THIKA"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== 'https://novaricstorage.blob.core.windows.net/media/Profile-Photos/NOVARIC_Team-Member_A-THIKA_Small.png') {
                      target.src = 'https://novaricstorage.blob.core.windows.net/media/Profile-Photos/NOVARIC_Team-Member_A-THIKA_Small.png';
                    }
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-slate-900">
                AUTOR
              </div>
            </div>

            {/* Author Details & Legal Identification */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <GlobeEuropeAfricaIcon className="w-3.5 h-3.5" />
                  Shtetas Maltez (EU Citizen)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  OPM PRESS 03/2025 (Malta)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                  <DocumentTextIcon className="w-3.5 h-3.5" />
                  NVR-MEDIA-LEG-001
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckIcon className="w-3.5 h-3.5" />
                  Versioni 1.0 — Zyrtar & I Publikuar
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Dr Alban Gj. THIKA
                </h1>
                <p className="text-sm sm:text-base font-medium text-slate-300 mt-1">
                  Shtetas Maltez | Autor dhe Komentues i Pavarur • Kryeredaktor i Regjistruar i MEDIA.NOVARIC.AL • Themelues i <NovaricBrand />
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
                Autor i pavarur dhe komentator i çështjeve publike, kushtetuese dhe ekonomike. Ky profil dhe dokumenti shoqërues përcaktojnë kornizën formale të përfaqësimit individual, lirisë së shprehjes (Neni 41 i Kushtetutës së Maltës dhe Neni 10 i KEDNJ), standardeve editoriale dhe statusit zyrtar të regjistruar në Republikën e Maltës (OPM PRESS 03/2025).
              </p>

              {/* Quick Author Publication Badges */}
              {onNavigate && (
                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <span className="text-slate-400 self-center mr-1">Publikime të autorit në platformë:</span>
                  <button
                    onClick={() => onNavigate('openLetterShkreliBeci')}
                    className="px-2.5 py-1 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    Letër e Hapur (Rasti Shkreli-Beci)
                  </button>
                  <button
                    onClick={() => onNavigate('shkoderCulturePage')}
                    className="px-2.5 py-1 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    Shkodër: Analizë Kulturore
                  </button>
                  <button
                    onClick={() => onNavigate('novaricCodeOfStandards')}
                    className="px-2.5 py-1 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    Kodi i Standardeve
                  </button>
                  <button
                    onClick={() => onNavigate('novaricJournalManifesto')}
                    className="px-2.5 py-1 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    AI Journal Manifesto
                  </button>
                  <button
                    onClick={() => onNavigate('trademarkCertificate')}
                    className="px-2.5 py-1 rounded bg-cyan-900/50 hover:bg-cyan-800/60 text-cyan-200 border border-cyan-500/30 transition-colors"
                  >
                    Certifikata EU & OPM PRESS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dedicated Official Press Registration Showcase Card (OPM PRESS 03/2025) */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-2 border-cyan-500/40 p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            {/* Left Info Column */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Dokument Zyrtar Shtetëror (Republika e Maltës)
                </span>
                <span className="text-xs font-mono text-slate-400">Ref: OPM PRESS 03/2025</span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-cyan-400" />
                  <span>Uffiċċju tar-Reġistratur tal-Istampa / Office of the Press Registrar</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Konfirmim zyrtar i regjistrimit të <strong>Alban Thika</strong> si <strong>Editor i portalit online MEDIA.NOVARIC.AL</strong>, datë 15 Korrik 2025 (efektiv nga 11 Qershor 2025).
                </p>
              </div>

              {/* Key Verification Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Adresa Zyrtare e Administrimit në Maltë:</span>
                  <span className="font-medium text-slate-200">6, Hyacinth Crt, Fl 2, Triq Tumas Dingli, Birkirkara BKR 1693</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Nënshkruar nga / Autoriteti:</span>
                  <span className="font-medium text-slate-200">Roderick Caruana, Director of Information (Castille Place, Valletta)</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Njoftim Zyrtar Institucional (cc):</span>
                  <span className="text-slate-300">Attorney General, State Advocate, Commissioner of Police</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
                  <span className="text-slate-400 block text-[11px]">Platforma Zyrtare e Regjistruar:</span>
                  <span className="text-cyan-300 font-mono">https://media.novaric.al/</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-md"
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>Hap Dokumentin e Plotë Zyrtar</span>
                </button>

                {onNavigate && (
                  <button
                    onClick={() => onNavigate('trademarkCertificate')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                  >
                    <span>Shiko Regjistrimet Ligjore & Certifikatat</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Thumbnail Column */}
            <div className="relative group cursor-pointer flex-shrink-0" onClick={() => setIsCertModalOpen(true)}>
              <div className="w-36 sm:w-44 h-48 sm:h-56 rounded-xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl bg-white p-1 transition-transform group-hover:scale-105">
                <img
                  src={certImagePath}
                  alt="OPM PRESS 03/2025 — Office of the Press Registrar Malta"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('public/')) {
                      target.src = '/public/assets/aistudio/image_c76af1fd.png';
                    }
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-slate-900/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="px-2.5 py-1 rounded bg-slate-900/90 text-cyan-300 text-xs font-bold shadow">
                  Kliko për Zmadhim
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal for viewing the official press document */}
        {isCertModalOpen && (
          <div 
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setIsCertModalOpen(false)}
          >
            <div 
              className="relative max-w-3xl w-full bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      Office of the Press Registrar, Malta — OPM PRESS 03/2025
                    </h4>
                    <p className="text-xs text-slate-400">
                      Editor of the online portal MEDIA.NOVARIC.AL (15th July 2025)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCertModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  aria-label="Mbyll modalin"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: High-Res Image View */}
              <div className="p-4 overflow-y-auto flex items-center justify-center bg-slate-950 flex-1">
                <img
                  src={certImagePath}
                  alt="OPM PRESS 03/2025 — Office of the Press Registrar Malta Certificate"
                  className="max-h-[75vh] w-auto object-contain rounded-lg shadow-lg border border-slate-800"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-slate-700 bg-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <span>Adresa: 6, Hyacinth Crt, Fl 2, Triq Tumas Dingli, Birkirkara BKR 1693</span>
                <div className="flex gap-2">
                  <a
                    href={certImagePath}
                    download="OPM_PRESS_03_2025_Malta.png"
                    className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
                  >
                    Shkarko Dokumentin
                  </a>
                  <button
                    onClick={() => setIsCertModalOpen(false)}
                    className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                  >
                    Mbyll
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legal Status Notice Box — Confirmed & Officially Published */}
        <div className="rounded-xl bg-emerald-500/10 border-l-4 border-emerald-500 p-4 sm:p-5 text-emerald-200">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex flex-wrap items-center gap-2">
                <span>Statusi: I Miratuar dhe Publikuar Zyrtarisht (Dokumenti NVR-MEDIA-LEG-001)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-semibold">
                  Publikuar: 29 Tetor 2026
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                Ky dokument përfaqëson deklaratën zyrtare të autorit <strong>Dr Alban Gj. THIKA</strong> (Versioni 1.0 Zyrtar, 29 tetor 2026), i konfirmuar dhe i publikuar në seksionin <strong>Publikime</strong> në platformën NOVARIC® Media. Ai përcakton kornizën formale të autorësisë personale, ushtrimit të lirisë së shprehjes (Neni 41 i Kushtetutës së Maltës dhe Neni 10 i KEDNJ), pavarësisë institucionale dhe statusit të regjistruar të shtypit në Republikën e Maltës (OPM PRESS 03/2025 në <span className="font-mono text-xs">https://media.novaric.al/</span>).
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area: Table of Contents & Clauses */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Table of Contents */}
          <div className="lg:col-span-4 space-y-4">
            <div className="sticky top-24 rounded-xl bg-slate-800/80 border border-slate-700/70 p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpenIcon className="w-4 h-4 text-primary-400" />
                  <span>{isEn ? 'Section Index (1–20)' : 'Indeksi i Seksioneve (1–20)'}</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">20 Seksione</span>
              </div>

              {/* Search within clauses */}
              <div className="relative mb-3">
                <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isEn ? "Search clauses..." : "Kërko në klauzola..."}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
                {searchFilter && (
                  <button
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Quick Jump List */}
              <div className="max-h-[60vh] overflow-y-auto space-y-1 pr-1 custom-scrollbar text-xs">
                {filteredSections.map((section) => {
                  const isActive = activeSectionId === section.id;
                  const displayTitle = isEn 
                    ? section.titleEn 
                    : section.titleSq;
                  const displayBadge = isEn ? section.badgeEn : section.badgeSq;

                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.slug, section.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between group ${
                        isActive
                          ? 'bg-primary-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-2">
                        {displayTitle}
                      </span>
                      {displayBadge && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          isActive ? 'bg-primary-700 text-white' : 'bg-slate-700 text-slate-400 group-hover:text-slate-200'
                        }`}>
                          {displayBadge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Document Jump to Audit Record */}
              <div className="pt-3 mt-3 border-t border-slate-700 space-y-2">
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 hover:bg-cyan-950/40 border border-cyan-500/30 transition-colors flex items-center justify-between"
                >
                  <span>OPM PRESS 03/2025 Certificate</span>
                  <span className="font-mono text-[10px]">Malta</span>
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('regjistri-kontrollit-dokumentit');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-primary-400 hover:bg-primary-950/40 border border-primary-500/30 transition-colors flex items-center justify-between"
                >
                  <span>{isEn ? 'Document Control Record' : 'Regjistri i Kontrollit të Dokumentit'}</span>
                  <span className="font-mono text-[10px]">NVR-LEG</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Main Document Clauses (1–20) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Document Header Title Card */}
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-6 shadow-xl">
              <div className="border-b border-slate-700 pb-4 mb-4">
                <span className="text-xs font-mono text-primary-400 tracking-wider uppercase">
                  {isEn ? 'Official Author Statement' : 'Deklaratë Personale e Autorit'}
                </span>
                
                {/* Titles */}
                {activeLang !== 'en' && (
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-snug">
                    DEKLARATË PËR PËRFAQËSIMIN INDIVIDUAL TË AUTORIT, LIRINË E SHPREHJES DHE RRJETET SOCIALE
                  </h2>
                )}
                {activeLang === 'dual' && (
                  <h3 className="text-base sm:text-lg font-bold text-slate-300 mt-2 leading-snug">
                    INDIVIDUAL AUTHOR REPRESENTATION, FREEDOM OF EXPRESSION & SOCIAL MEDIA DISCLAIMER
                  </h3>
                )}
                {activeLang === 'en' && (
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-snug">
                    INDIVIDUAL AUTHOR REPRESENTATION, FREEDOM OF EXPRESSION & SOCIAL MEDIA DISCLAIMER
                  </h2>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                  <span>Autori: <strong>Dr Alban Gj. THIKA</strong></span>
                  <span>•</span>
                  <span>ID: <strong>NVR-MEDIA-LEG-001</strong></span>
                  <span>•</span>
                  <span>Versioni: <strong>1.0</strong></span>
                  <span>•</span>
                  <span>Data: <strong>29 tetor 2026</strong></span>
                  <span>•</span>
                  <span>Press Ref: <strong>OPM PRESS 03/2025</strong></span>
                </div>
              </div>

              {/* Document Overview Metadata Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/60 p-4 rounded-lg border border-slate-700/50">
                <div>
                  <span className="text-slate-400 block">{isEn ? 'Document ID:' : 'ID e dokumentit:'}</span>
                  <span className="font-mono font-bold text-slate-200">NVR-MEDIA-LEG-001</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isEn ? 'Version & Status:' : 'Versioni:'}</span>
                  <span className="font-medium text-amber-300">{isEn ? '1.0 — Draft for legal review' : '1.0 — Projekt për shqyrtim ligjor'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isEn ? 'Draft Date:' : 'Data e hartimit:'}</span>
                  <span className="text-slate-200">{isEn ? '29 October 2026' : '29 tetor 2026'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isEn ? 'Classification:' : 'Klasifikimi:'}</span>
                  <span className="text-slate-200">{isEn ? 'Personal Author Statement' : 'Deklaratë personale e autorit'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isEn ? 'Official Press Registry:' : 'Regjistrimi Zyrtar i Shtypit (Malta):'}</span>
                  <span className="text-cyan-300 font-semibold">OPM PRESS 03/2025 (15th July 2025)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isEn ? 'Status:' : 'Statusi:'}</span>
                  <span className="text-amber-300 font-medium">{isEn ? 'Not legally approved for publication' : 'I pamiratuar për publikim nga pikëpamja ligjore'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isEn ? 'Publication Location:' : 'Vendi i publikimit:'}</span>
                  <span className="text-cyan-400 font-mono">NOVARIC® AI-Powered News — Profili i Autorit</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{isEn ? 'Registered Address:' : 'Adresa e Regjistruar në Maltë:'}</span>
                  <span className="text-slate-200">6, Hyacinth Crt, Fl 2, Triq Tumas Dingli, Birkirkara BKR 1693</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block">{isEn ? 'Official URL:' : 'Platforma zyrtare e publikimit:'}</span>
                  <span className="text-cyan-300 font-mono">https://media.novaric.al/</span>
                </div>
              </div>
            </div>

            {/* Render Each Clause */}
            <div className="space-y-6">
              {filteredSections.map((section) => (
                <div
                  key={section.id}
                  id={`section-${section.slug}`}
                  className="rounded-xl bg-slate-800/70 border border-slate-700/70 p-5 sm:p-6 shadow-md transition-all hover:border-slate-600 focus-within:border-primary-500"
                >
                  <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-700/60">
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span className="text-primary-400 font-mono">{section.id}.</span>
                      <span>
                        {isEn ? section.titleEn.replace(/^\d+\.\s*/, '') : section.titleSq.replace(/^\d+\.\s*/, '')}
                      </span>
                    </h3>
                    {(section.badgeSq || section.badgeEn) && (
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300 border border-slate-600">
                        {isEn ? section.badgeEn : (section.badgeSq || section.badgeEn)}
                      </span>
                    )}
                  </div>

                  {/* Highlights if any */}
                  {((isEn && section.keyHighlightEn) || (!isEn && section.keyHighlightSq)) && (
                    <div className="mb-3 p-2.5 rounded-md bg-slate-900/60 border-l-2 border-primary-500 text-xs text-slate-300 italic">
                      <strong className="text-primary-400 not-italic">{isEn ? 'Key Principle:' : 'Parim Kryesor:'}</strong>{' '}
                      {isEn ? section.keyHighlightEn : section.keyHighlightSq}
                    </div>
                  )}

                  {/* Special Official Certificate Reference Box (e.g. for Section 3 or Section 17) */}
                  {section.officialDocumentRef && (
                    <div className="mb-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                          <ShieldCheckIcon className="w-4 h-4 text-cyan-400" />
                          Dokument Zyrtar Referues: {section.officialDocumentRef.refNumber}
                        </span>
                        <button
                          onClick={() => setIsCertModalOpen(true)}
                          className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-200 underline"
                        >
                          Shiko Dokumentin (Certifikatën)
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {isEn ? section.officialDocumentRef.descriptionEn : section.officialDocumentRef.descriptionSq}
                      </p>
                      <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-cyan-200/80">
                        <span>Lëshuar: {section.officialDocumentRef.date}</span>
                        <span>•</span>
                        <span>Efektive nga: {section.officialDocumentRef.effectiveDate}</span>
                        <span>•</span>
                        <span>Adresa: {section.officialDocumentRef.address}</span>
                      </div>
                    </div>
                  )}

                  {/* Albanian Content */}
                  {(activeLang === 'sq' || activeLang === 'dual') && (
                    <div className="space-y-2.5 text-sm leading-relaxed text-slate-200 text-justify">
                      {activeLang === 'dual' && (
                        <div className="text-[11px] uppercase tracking-wider font-semibold text-primary-400 flex items-center gap-1.5 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          Teksti Zyrtar në Shqip
                        </div>
                      )}
                      {section.contentSq.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>
                  )}

                  {/* English Content */}
                  {(activeLang === 'en' || activeLang === 'dual') && (
                    <div className={`${activeLang === 'dual' ? 'mt-4 pt-4 border-t border-slate-700/50' : ''} space-y-2.5 text-sm leading-relaxed text-slate-300 text-justify`}>
                      {activeLang === 'dual' && (
                        <div className="text-[11px] uppercase tracking-wider font-semibold text-cyan-400 flex items-center gap-1.5 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          Official English Reference Text
                        </div>
                      )}
                      {section.contentEn.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Author Formal Sign-Off Box */}
            <div className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-850 border border-slate-700 p-6 shadow-xl space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                <span>Nënshkrimi dhe Miratimi i Autorit</span>
              </h3>
              <div className="space-y-1 text-sm text-slate-300">
                <p className="font-bold text-white text-base">Dr Alban Gj. THIKA</p>
                <p className="text-emerald-300 text-xs font-semibold">Shtetas Maltez | Autor dhe Komentues i Pavarur</p>
                <p className="text-xs text-cyan-300">Kryeredaktor i regjistruar: MEDIA.NOVARIC.AL (Office of the Press Registrar, Malta — OPM PRESS 03/2025)</p>
                <p className="text-xs text-slate-400">Platforma zyrtare e publikimit: <a href="https://media.novaric.al/" className="text-cyan-400 hover:underline">https://media.novaric.al/</a></p>
                <p className="text-xs text-slate-400">Seksioni: <span className="text-slate-200">Profili i Autorit</span></p>
                <p className="text-xs text-amber-300">Statusi: Projekt — në pritje të shqyrtimit ligjor dhe editorial</p>
              </div>
            </div>

            {/* Document Control Record Table (Regjistri i Kontrollit të Dokumentit) */}
            <div
              id="regjistri-kontrollit-dokumentit"
              className="rounded-xl bg-slate-800/90 border border-slate-700 p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">
                    {isEn ? 'Document Control Record' : 'Regjistri i Kontrollit të Dokumentit'}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">NVR-MEDIA-LEG-001</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400 w-1/3">ID e Dokumentit</td>
                      <td className="py-2.5 font-mono font-bold text-slate-200">NVR-MEDIA-LEG-001</td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Titulli / Title</td>
                      <td className="py-2.5 text-slate-200 font-medium">
                        Deklaratë për Përfaqësimin Individual të Autorit, Lirinë e Shprehjes dhe Rrjetet Sociale / Individual Author Representation, Freedom of Expression & Social Media Disclaimer
                      </td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Autori / Subjekti</td>
                      <td className="py-2.5 text-slate-200 font-bold">Dr Alban Gj. THIKA</td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Statusi Ligjor i Autorit</td>
                      <td className="py-2.5 text-emerald-300">Shtetas Maltez | Autor dhe Komentues i Pavarur</td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Regjistrimi Zyrtar i Shtypit në BE/Maltë</td>
                      <td className="py-2.5 text-cyan-300 font-medium">
                        Office of the Press Registrar, Malta — Ref: OPM PRESS 03/2025 (Editor: MEDIA.NOVARIC.AL, nga 11/06/2025)
                      </td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Adresa e Regjistruar në Maltë</td>
                      <td className="py-2.5 text-slate-200">6, Hyacinth Crt, Fl 2, Triq Tumas Dingli, Birkirkara BKR 1693</td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Versioni</td>
                      <td className="py-2.5 font-mono text-emerald-300 font-bold">1.0 — Zyrtar dhe i Publikuar</td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Data e Hartimit</td>
                      <td className="py-2.5 text-slate-200">29 tetor 2026</td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Klasifikimi</td>
                      <td className="py-2.5 text-slate-200">Deklaratë personale e autorit</td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Shqyrtimi Ligjor</td>
                      <td className="py-2.5 text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckIcon className="w-3.5 h-3.5" />
                        <span>I Përfunduar / I Konfirmuar</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Miratimi Editorial</td>
                      <td className="py-2.5 text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckIcon className="w-3.5 h-3.5" />
                        <span>I Miratuar për Publikim</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Data e Hyrjes në Fuqi</td>
                      <td className="py-2.5 text-emerald-300 font-semibold">29 tetor 2026 (Menjëherë)</td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Historiku</td>
                      <td className="py-2.5 text-slate-200">Versioni 1.0 Zyrtar — Konfirmuar dhe Publikuar</td>
                    </tr>
                    <tr className="border-b border-slate-700/60">
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Vendi i Publikimit</td>
                      <td className="py-2.5 font-mono text-cyan-300">NOVARIC® AI-Powered News — Profili i Autorit (https://media.novaric.al/)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-semibold text-slate-400">Gjuhët</td>
                      <td className="py-2.5 text-slate-200">Shqip (Versioni Zyrtar) & English (Official Reference Text)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Attestation Box */}
              <div className="pt-4 border-t border-slate-700 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p>© 2026 Dr Alban Gj. THIKA. Të gjitha të drejtat të rezervuara.</p>
                  <p className="text-[11px] text-slate-500">Publikuar në seksionin 'Publikime' në platformën NOVARIC® Media.</p>
                </div>
                <button
                  onClick={onBack}
                  className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs transition-colors self-stretch sm:self-auto text-center"
                >
                  Kthehu te Faqja Kryesore
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

// Aliases for seamless imports across the app
export const DrAlbanProfilePage = AuthorProfilePage;
export default AuthorProfilePage;
