/**
 * Politika e Privatësisë — rishikim (draft) / Privacy Policy — revision (draft)
 *
 * STATUS: Draft for legal and editorial review. Not approved. Not published.
 * The live page keeps showing the previous version (08.06.2025, components/privacy/
 * PrivacyPolicyLegacy20250608.tsx) until BOTH:
 *   1. Dr Alban Gj. THIKA records a written approval in PRIVACY_REVISION_META, and
 *   2. every internal item marked [[P-nn …]] has been replaced with a confirmed fact.
 * Fail-closed: an unresolved [[P-nn]] item keeps this revision off the public site.
 *
 * Law: Ligji nr. 124/2024, datë 19.12.2024, «Për mbrojtjen e të dhënave personale»,
 * Fletorja Zyrtare nr. 9/2025 (17.01.2025). It repealed Ligji nr. 9887/2008 (neni 99).
 * Articles cited below were read in the QBZ text (REG-LEG-MARAGON-LEGAL-SOURCES).
 * Facts about the site come from the repository as inspected (index.html, localStorage use).
 * Nothing here is legal advice and nothing here describes a safeguard that was not verified.
 */

export type PrivacyLang = 'sq' | 'en';
export type PrivacyRevisionStatus = 'draft_for_legal_and_editorial_review' | 'approved_for_publication';

export interface PrivacyRevisionApproval {
  approvedBy: string;
  /** Tirana time, ISO date. */
  approvedOn: string;
  /** Written approval reference. */
  reference: string;
}

export interface PrivacySection {
  id: string;
  number: number;
  heading: Record<PrivacyLang, string>;
  /** One entry per paragraph; a leading "- " renders a list item; [text](href) is a link. */
  body: Record<PrivacyLang, string[]>;
}

export const PRIVACY_REVISION_META = {
  documentId: 'POL-LEG-WEBSITE-PRIVACY',
  version: '0.1',
  status: 'draft_for_legal_and_editorial_review' as PrivacyRevisionStatus,
  draftedOn: '2026-11-23',
  approval: null as PrivacyRevisionApproval | null,
  publishedOn: null as string | null,
  /** The version this revision replaces. It is kept, not deleted. */
  supersedes: { label: '08.06.2025', validFrom: '2025-06-01', updatedOn: '2025-06-08', component: 'components/privacy/PrivacyPolicyLegacy20250608.tsx' },
} as const;

export const PRIVACY_ALLOWED_HREFS = [
  'mailto:contact@novaric.al',
  'https://www.novaric.al',
  'https://idp.al/',
  'https://qbz.gov.al/eli/ligj/2024/12/19/124',
  '/njoftim-maragon',
] as const;

export const PRIVACY_TITLE: Record<PrivacyLang, string> = {
  sq: 'Politika e Privatësisë',
  en: 'Privacy Policy',
};

export const PRIVACY_DRAFT_BANNER: Record<PrivacyLang, string> = {
  sq: 'Draft për shqyrtim ligjor dhe editorial. Nuk është miratuar dhe nuk është publikuar. Versioni në fuqi mbetet ai i datës 08.06.2025.',
  en: 'Draft for legal and editorial review. Not approved and not published. The version in force remains the one dated 08.06.2025.',
};

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: 'kontrolluesi',
    number: 1,
    heading: { sq: 'Kush jemi', en: 'Who we are' },
    body: {
      sq: [
        'Kontrolluesi i të dhënave për media.novaric.al është NOVARIC® Sh.A., Rruga Studenti, Shkodër 4001, Shqipëri. Administrator: Dr Alban Gj. THIKA. Email i përgjithshëm i shoqërisë: [contact@novaric.al](mailto:contact@novaric.al). Faqja: [www.novaric.al](https://www.novaric.al).',
        'NOVARIC® DOO (Podgoricë) është shoqëri e veçantë dhe nuk është kontrollues i kësaj faqeje.',
        '[[P-01 Nëpunësi i mbrojtjes së të dhënave: konfirmoni nëse NOVARIC® Sh.A. duhet të caktojë ose ka caktuar një nëpunës sipas nenit 33; nëse po, emri i rolit dhe kontakti i verifikuar. Mos shkruani asnjë kontakt pa konfirmim.]]',
      ],
      en: [
        'The data controller for media.novaric.al is NOVARIC® Sh.A., Rruga Studenti, Shkodër 4001, Albania. Administrator: Dr Alban Gj. THIKA. General company email: [contact@novaric.al](mailto:contact@novaric.al). Website: [www.novaric.al](https://www.novaric.al).',
        'NOVARIC® DOO (Podgorica) is a separate company and is not a controller of this site.',
        '[[P-01 Data protection officer: confirm whether NOVARIC® Sh.A. must designate or has designated an officer under Article 33; if so, the role name and a verified contact. Do not write any contact without confirmation.]]',
      ],
    },
  },
  {
    id: 'ligji',
    number: 2,
    heading: { sq: 'Ligji që zbatohet', en: 'Applicable law' },
    body: {
      sq: [
        'Ne i përpunojmë të dhënat personale sipas [Ligjit nr. 124/2024 «Për mbrojtjen e të dhënave personale»](https://qbz.gov.al/eli/ligj/2024/12/19/124), botuar në Fletoren Zyrtare nr. 9, datë 17.01.2025. Ky ligj shfuqizoi Ligjin nr. 9887/2008 (neni 99).',
        'Autoriteti mbikëqyrës është [Komisioneri për të Drejtën e Informimit dhe Mbrojtjen e të Dhënave Personale](https://idp.al/).',
      ],
      en: [
        'We process personal data under [Law No. 124/2024 "On personal data protection"](https://qbz.gov.al/eli/ligj/2024/12/19/124), published in the Official Journal No. 9 of 17.01.2025. This law repealed Law No. 9887/2008 (Article 99).',
        'The supervisory authority is the [Commissioner for the Right to Information and Personal Data Protection](https://idp.al/).',
      ],
    },
  },
  {
    id: 'vizitoret',
    number: 3,
    heading: { sq: 'Të dhënat e vizitorëve të faqes', en: 'Data about visitors to the site' },
    body: {
      sq: [
        'Faqja ngarkon Google Analytics dhe Google Tag Manager për të matur përdorimin e saj. Këto shërbime marrin të dhëna teknike nga shfletuesi juaj, si adresa IP, lloji i pajisjes dhe faqet e vizituara, dhe mund të vendosin cookies.',
        '[[P-02 Baza ligjore dhe pëlqimi për analitikën dhe cookies (neni 7; ligji për komunikimet elektronike sipas rastit): vendim nga këshilltari ligjor. Konfirmoni edhe nëse ka banner pëlqimi; aktualisht nuk u gjet në kod.]]',
        'Faqja ruan në shfletuesin tuaj (localStorage) gjuhën që zgjidhni dhe, kur votoni në sondazhe ose profile, zgjedhjen tuaj. Këto të dhëna mbeten në pajisjen tuaj dhe mund t\'i fshini nga cilësimet e shfletuesit.',
        '[[P-03 Ofruesi i hostimit dhe regjistrat e serverit (server logs): cilat të dhëna ruhen, ku dhe për sa kohë.]]',
      ],
      en: [
        'The site loads Google Analytics and Google Tag Manager to measure how it is used. These services receive technical data from your browser, such as your IP address, device type and the pages visited, and may set cookies.',
        '[[P-02 Legal basis and consent for analytics and cookies (Article 7; electronic communications law where relevant): decision by legal counsel. Also confirm whether a consent banner exists; none was found in the code.]]',
        'The site stores in your browser (localStorage) the language you choose and, when you vote in polls or on profiles, your choice. This data stays on your device and you can delete it in your browser settings.',
        '[[P-03 Hosting provider and server logs: which data is kept, where and for how long.]]',
      ],
    },
  },
  {
    id: 'personat-publike',
    number: 4,
    heading: { sq: 'Të dhënat e personave në përmbajtjen tonë', en: 'Data about people in our content' },
    body: {
      sq: [
        'Lajmet, analizat dhe profilet tona, përfshirë profilet MARAGON®, përmbajnë të dhëna për persona me rol publik, të marra nga burime publike ose zyrtare. Qëllimi është informimi dhe debati me interes publik. Burimet listohen në përmbajtje.',
        '[[P-04 Baza ligjore për këtë përpunim: neni 43 (liria e shprehjes dhe gazetaria, me kushtet e pikës 1) ose neni 7, pika 1, shkronja «dh» (interes i ligjshëm), me vlerësim të dokumentuar. Vendim nga këshilltari ligjor.]]',
        'Kur botojmë material gazetarie, zbatojmë kufizimet e nenit 43, pika 3, për identifikimin e të miturve dhe të viktimave.',
        'Si vlerësohen personat në MARAGON® dhe si kërkohet korrigjim shpjegohet te [Njoftimi MARAGON®](/njoftim-maragon).',
      ],
      en: [
        'Our news, analyses and profiles, including MARAGON® profiles, contain data about people with a public role, taken from public or official sources. The purpose is information and debate in the public interest. Sources are listed in the content.',
        '[[P-04 Legal basis for this processing: Article 43 (freedom of expression and journalism, subject to the conditions in paragraph 1) or Article 7(1)(dh) (legitimate interest), with a documented assessment. Decision by legal counsel.]]',
        'When we publish journalistic material, we apply the limits in Article 43(3) on identifying minors and victims.',
        'How people are assessed in MARAGON® and how to ask for a correction is explained in the [MARAGON® Notice](/njoftim-maragon).',
      ],
    },
  },
  {
    id: 'korrespondenca',
    number: 5,
    heading: { sq: 'Kur na shkruani', en: 'When you write to us' },
    body: {
      sq: [
        'Kur na shkruani, përpunojmë të dhënat që na dërgoni, si emrin, adresën e emailit dhe përmbajtjen e mesazhit, për t\'ju përgjigjur dhe për të mbajtur shënim të kërkesës.',
        '[[P-05 Baza ligjore (neni 7) dhe kush ka akses te kutia postare: konfirmim nga pronari.]]',
      ],
      en: [
        'When you write to us, we process the data you send, such as your name, email address and the content of your message, to reply to you and to keep a record of the request.',
        '[[P-05 Legal basis (Article 7) and who has access to the mailbox: confirmation by the owner.]]',
      ],
    },
  },
  {
    id: 'marresit',
    number: 6,
    heading: { sq: 'Marrësit dhe transferimet jashtë Shqipërisë', en: 'Recipients and transfers outside Albania' },
    body: {
      sq: [
        'Google, si ofrues i shërbimeve të analitikës, merr të dhënat teknike të përshkruara në seksionin 3. Këto të dhëna mund të përpunohen jashtë Shqipërisë.',
        '[[P-06 Lista e plotë e përpunuesve (hostimi, emaili, shërbimet e IA-së) dhe garancitë për transferimet ndërkombëtare sipas neneve 39–41. Mos përmendni marrëveshje ose klauzola që nuk janë verifikuar.]]',
      ],
      en: [
        'Google, as the provider of the analytics services, receives the technical data described in section 3. This data may be processed outside Albania.',
        '[[P-06 Full list of processors (hosting, email, AI services) and the safeguards for international transfers under Articles 39–41. Do not mention agreements or clauses that have not been verified.]]',
      ],
    },
  },
  {
    id: 'ruajtja',
    number: 7,
    heading: { sq: 'Sa kohë i ruajmë të dhënat', en: 'How long we keep data' },
    body: {
      sq: [
        '[[P-07 Afatet e ruajtjes ose kriteret për t\'i përcaktuar, sipas nenit 13, pika 1, shkronja «ç». Afatet e versionit të vjetër (12 muaj, 10 vjet) nuk janë verifikuar dhe nuk përdoren.]]',
      ],
      en: [
        '[[P-07 Retention periods, or the criteria used to set them, under Article 13(1)(ç). The periods in the old version (12 months, 10 years) were not verified and are not used.]]',
      ],
    },
  },
  {
    id: 'vendimet-automatike',
    number: 8,
    heading: { sq: 'Vendimet automatike', en: 'Automated decisions' },
    body: {
      sq: [
        'Brezat MARAGON® nuk vendosen nga një sistem automatik. Mjetet e IA-së ndihmojnë në mbledhjen e provave dhe në hartim, ndërsa vendimin e merr Dr Alban Gj. THIKA.',
        '[[P-08 Konfirmoni nëse ndonjë funksion tjetër i faqes, p.sh. lajmet e gjeneruara me IA, përfshin vendime automatike ose profilizim sipas nenit 20 dhe nenit 13, pika 1, shkronja «c».]]',
      ],
      en: [
        'MARAGON® bands are not decided by an automated system. AI tools help gather evidence and draft, while the decision is taken by Dr Alban Gj. THIKA.',
        '[[P-08 Confirm whether any other feature of the site, for example AI-generated news, involves automated decisions or profiling under Article 20 and Article 13(1)(c).]]',
      ],
    },
  },
  {
    id: 'te-drejtat',
    number: 9,
    heading: { sq: 'Të drejtat tuaja', en: 'Your rights' },
    body: {
      sq: [
        'Sipas neneve 13–20 të Ligjit nr. 124/2024 ju keni të drejtë:',
        '- të informoheni për përpunimin (neni 13);',
        '- të keni akses në të dhënat tuaja (neni 14);',
        '- të kërkoni korrigjimin ose fshirjen e tyre (nenet 15 dhe 16);',
        '- të kërkoni kufizimin e përpunimit (neni 17);',
        '- të kërkoni transferueshmërinë e të dhënave (neni 18);',
        '- të kundërshtoni përpunimin (neni 19);',
        '- të mos i nënshtroheni një vendimi të bazuar vetëm në përpunim automatik (neni 20).',
        'Këto të drejta mund të kufizohen vetëm në rastet që parashikon ligji, p.sh. nenet 21 dhe 43.',
        'Ne përgjigjemi pa pagesë, sa më shpejt të jetë e mundur dhe jo më vonë se 30 ditë nga marrja e kërkesës. Ky afat mund të zgjatet deri në 60 ditë kur është e nevojshme, dhe ju njoftojmë me arsye brenda 30 ditëve të para (neni 12, pikat 4 dhe 5).',
        'Kërkesat për të dhënat personale dërgohen te: [[P-09 Kanali për kërkesat e subjekteve të të dhënave: kërkon konfirmim të aksesit në kutinë postare, të përgjegjësit, të zëvendësit dhe të regjistrimit të kërkesave (si B-01 te Njoftimi MARAGON). Mos përdorni asnjë adresë pa këtë konfirmim.]]',
        'Ju mund të paraqisni ankesë te [Komisioneri](https://idp.al/) (neni 86) dhe t\'i drejtoheni gjykatës, përfshirë për dëmshpërblim (neni 88).',
      ],
      en: [
        'Under Articles 13–20 of Law No. 124/2024 you have the right:',
        '- to be informed about the processing (Article 13);',
        '- to access your data (Article 14);',
        '- to ask for its rectification or erasure (Articles 15 and 16);',
        '- to ask for restriction of processing (Article 17);',
        '- to ask for data portability (Article 18);',
        '- to object to processing (Article 19);',
        '- not to be subject to a decision based solely on automated processing (Article 20).',
        'These rights may be restricted only in the cases the law provides, for example Articles 21 and 43.',
        'We reply free of charge, as soon as possible and no later than 30 days after receiving the request. This period may be extended up to 60 days where necessary, and we tell you the reasons within the first 30 days (Article 12(4) and (5)).',
        'Requests about personal data are sent to: [[P-09 Channel for data-subject requests: needs confirmed mailbox access, a responsible person, a backup and request logging (as B-01). Do not use any address without that confirmation.]]',
        'You may lodge a complaint with the [Commissioner](https://idp.al/) (Article 86) and apply to a court, including for compensation (Article 88).',
      ],
    },
  },
  {
    id: 'siguria',
    number: 10,
    heading: { sq: 'Siguria', en: 'Security' },
    body: {
      sq: [
        '[[P-10 Masat e sigurisë që janë vërtet në fuqi (neni 28). Pretendimet e versionit të vjetër, si auditimet e rregullta, trajnimet dhe marrëveshjet me të gjitha palët e treta, nuk janë verifikuar dhe nuk përdoren.]]',
      ],
      en: [
        '[[P-10 Security measures actually in place (Article 28). Claims in the old version, such as regular audits, training and agreements with all third parties, were not verified and are not used.]]',
      ],
    },
  },
  {
    id: 'ndryshimet',
    number: 11,
    heading: { sq: 'Ndryshimet dhe versionet', en: 'Changes and versions' },
    body: {
      sq: [
        'Ky version zëvendëson versionin e datës 08.06.2025, i cili ruhet. Çdo ndryshim i mëvonshëm merr numër versioni dhe datë.',
      ],
      en: [
        'This version replaces the version dated 08.06.2025, which is kept. Every later change receives a version number and a date.',
      ],
    },
  },
];

/** Internal items still open. Any item keeps the revision off the public site. */
export function privacyRevisionOpenItems(sections: PrivacySection[] = PRIVACY_SECTIONS): string[] {
  const ids = new Set<string>();
  for (const s of sections) {
    for (const p of [...s.body.sq, ...s.body.en]) {
      for (const m of p.matchAll(/\[\[(P-\d+)/g)) ids.add(m[1]);
    }
  }
  return [...ids].sort();
}

export function isPrivacyRevisionApproved(meta: { status: PrivacyRevisionStatus; approval: PrivacyRevisionApproval | null } = PRIVACY_REVISION_META): boolean {
  return meta.status === 'approved_for_publication'
    && !!meta.approval
    && !!meta.approval.approvedBy.trim()
    && /^\d{4}-\d{2}-\d{2}$/.test(meta.approval.approvedOn)
    && !!meta.approval.reference.trim();
}

/** Live only with a recorded approval AND no open [[P-nn]] item. Fail-closed. */
export function isPrivacyRevisionLive(
  meta: { status: PrivacyRevisionStatus; approval: PrivacyRevisionApproval | null } = PRIVACY_REVISION_META,
  sections: PrivacySection[] = PRIVACY_SECTIONS,
): boolean {
  return isPrivacyRevisionApproved(meta) && privacyRevisionOpenItems(sections).length === 0;
}

/** Dev-server preview only (?privacyPreview=1). Production builds return false. */
export function privacyPreviewFromEnv(dev: boolean, search: string | null | undefined): boolean {
  if (!dev) return false;
  const params = new URLSearchParams(search?.startsWith('?') ? search.slice(1) : (search || ''));
  return params.get('privacyPreview') === '1';
}

export function privacyInternalPreview(search?: string): boolean {
  const dev = Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV);
  const query = search ?? (typeof window !== 'undefined' ? window.location.search : '');
  return privacyPreviewFromEnv(dev, query);
}
