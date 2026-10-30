import { FakeNewsCaseStudy } from '../types';

export const fakeNewsCaseStudies: FakeNewsCaseStudy[] = [
  {
    id: 'case-pamfleti-1',
    source: 'Pamfleti.net',
    headline_sq: "Ministri Igli Hasani merr në delegacion Alban Thikën, trafikant i afrikanëve drejt BE, i lidhur me rusët dhe i shpallur ‘non grata’ në SHBA-BE",
    headline_en: "Minister Igli Hasani includes Alban Thika in delegation: Trafficker of Africans to EU, linked to Russians and declared 'persona non grata' in US-EU",
    articleUrl: 'https://pamfleti.net/anti-mafia/ministri-igli-hasani-merr-ne-delegacion-alban-thiken-trafikant-i-afri-i215140',
    verdictSummary_sq: "Shpifje e Verifikuar (Auditimi CIDA)",
    verdictSummary_en: "Verified Defamation (CIDA Audit)",
    integrityScore: 12,
    keyTactics_sq: ["Gjuhë e Ngarkuar", "Mungesë Burimesh", "Kornizim Kriminal"],
    keyTactics_en: ["Loaded Language", "Lack of Sources", "Criminal Framing"],
    forensicTranscript: [
      "Sipas një raportimi të fundit nga burime të paidentifikuara, ",
      {
        id: "m1",
        text_sq: "trafikanti i afrikanëve",
        text_en: "trafficker of Africans",
        type: 'malice',
        category_sq: "Etiketim i Ngarkuar",
        category_en: "Loaded Labeling",
        alert_sq: "GJUHË MALINJE",
        alert_en: "MALICE MARKER",
        description_sq: "Përdorim i termave penalë pa vendim gjyqësor për të krijuar paragjykim.",
        description_en: "Use of criminal terms without judicial conviction to create prejudice."
      },
      " Alban Thika, i cili dyshohet se është ",
      {
        id: "v1",
        text_sq: "i lidhur me rusët",
        text_en: "linked to the Russians",
        type: 'void',
        category_sq: "Zbrazëti e të Dhënave",
        category_en: "Data Void",
        alert_sq: "MUNGESË PROVE",
        alert_en: "EVIDENCE GAP",
        description_sq: "Pohim i rëndë gjeopolitik pa asnjë referencë dokumentare apo inteligjence.",
        description_en: "Serious geopolitical claim without any documentary or intelligence reference."
      },
      " dhe është parë në shoqërinë e ministrit Hasani. Ky fakt vërteton se ai po përdor diplomacinë si ",
      {
        id: "l1",
        text_sq: "mbulesë për krimin",
        text_en: "cover for crime",
        type: 'logic',
        category_sq: "Thyerje Logjike",
        category_en: "Logic Fracture",
        alert_sq: "NON-SEQUITUR",
        alert_en: "NON-SEQUITUR",
        description_sq: "Prania në një delegacion nuk dëshmon logjikisht përdorim për qëllime kriminale.",
        description_en: "Presence in a delegation does not logically prove usage for criminal purposes."
      },
      ", ndërkohë që ai është i shpallur ",
      {
        id: "m2",
        text_sq: "‘non grata’ në SHBA-BE",
        text_en: "‘persona non grata’ in US-EU",
        type: 'malice',
        category_sq: "Fabrikim Eksplicit",
        category_en: "Explicit Fabrication",
        alert_sq: "DEZINFORMIM",
        alert_en: "DISINFORMATION",
        description_sq: "Statusi është i verifikueshëm si i rremë përmes regjistrave të hapur të DASH dhe BE.",
        description_en: "Status is verifiable as false through public US State Dept and EU registries."
      },
      "."
    ],
    narrativeAngle_sq: "Asgjësim Karakteri / Anti-Mafia",
    narrativeAngle_en: "Character Assassination / Anti-Mafia",
    defamatoryAnalysis_sq: "Artikulli përdor teknikën e 'fajit sipas asociimit' duke lidhur subjektin me ministra dhe rrjete ndërkombëtare pa ofruar asnjë dokument zyrtar.",
    defamatoryAnalysis_en: "The article uses the 'guilt by association' technique by linking the subject to ministers and international networks without providing official documents.",
    maliceMarkers_sq: ["Epiteti 'trafikant'", "Insinuata për 'rusët'", "Fabrikimi i statusit 'non grata'"],
    maliceMarkers_en: ["The 'trafficker' epithet", "The 'Russian' insinuation", "Fabrication of 'non grata' status"],
    logicFractures_sq: ["Konkluzioni se diplomacia shërben si mbulesë", "Supozimi i fajësisë pa proces ligjor"],
    logicFractures_en: ["Conclusion that diplomacy serves as cover", "Assumption of guilt without due process"],
    claimLedger: [
      { claim_sq: "Është trafikant i afrikanëve.", claim_en: "Is a trafficker of Africans.", type: 'Criminal Allegation', hasAttribution: false, hasEvidence: false, risk: 'high' },
      { claim_sq: "I shpallur non-grata.", claim_en: "Declared non-grata.", type: 'Criminal Allegation', hasAttribution: false, hasEvidence: false, risk: 'high' }
    ],
    evidenceRatioExplanation_sq: "Raporti provë/akuzë është 0:10. Nuk citohet asnjë numër dosjeje.",
    evidenceRatioExplanation_en: "Evidence-to-accusation ratio is 0:10. No case numbers cited.",
    neutralRewrite_sq: "Ministri Hasani shoqërohej në delegacion nga disa persona, përfshirë Alban Thikën.",
    neutralRewrite_en: "Minister Hasani was accompanied in the delegation by several individuals, including Alban Thika.",
    chartData: [
      { name: 'Opinione Malinje', value: 92, color: '#e11d48' },
      { name: 'Fakte', value: 8, color: '#10b981' },
    ],
    publicPerception: { isFake: 98, isReal: 2 }
  },
  {
    id: 'case-pamfleti-2',
    source: 'Pamfleti.net',
    headline_sq: "Trafikanti i afrikaneve Alban Thika qe hodhi ne gjyq “Pamfleti”-n, shpallet ne kerkim per mashtrim e pastrim parash",
    headline_en: "Trafficker of Africans Alban Thika who sued 'Pamfleti', declared wanted for fraud and money laundering",
    articleUrl: 'https://pamfleti.net/anti-mafia/trafikanti-i-afrikaneve-alban-thika-qe-hodhi-ne-gjyq-pamfleti-n-shpal-i180997',
    verdictSummary_sq: "Dezinformim Hakmarrës",
    verdictSummary_en: "Retaliatory Disinformation",
    integrityScore: 10,
    keyTactics_sq: ["Hakmarrje Mediatike", "Shpikje Faktesh", "Etiketim Kriminal"],
    keyTactics_en: ["Media Retaliation", "Factual Invention", "Criminal Labeling"],
    forensicTranscript: [
      "Pasi guxoi të ngrinte padi, ",
      {
        id: "m3",
        text_sq: "trafikanti Alban Thika",
        text_en: "trafficker Alban Thika",
        type: 'malice',
        category_sq: "Etiketim i Përsëritur",
        category_en: "Repetitive Labeling",
        alert_sq: "MARKER MALINJITETI",
        alert_en: "MALICE MARKER",
        description_sq: "Përdorim i qëllimshëm i epitetit kriminal për të rrënuar prezumimin e pafajësisë.",
        description_en: "Intentional use of criminal epithet to destroy the presumption of innocence."
      },
      " tanimë është ",
      {
        id: "m4",
        text_sq: "shpallur në kërkim",
        text_en: "declared wanted",
        type: 'malice',
        category_sq: "Fabrikim i Gjendjes Juridike",
        category_en: "Fabrication of Legal Status",
        alert_sq: "RREZIK KRITIK",
        alert_en: "CRITICAL RISK",
        description_sq: "Sistemi TIMS dhe Policia nuk konfirmojnë asnjë urdhër-arresti për subjektin.",
        description_en: "TIMS system and Police do not confirm any arrest warrant for the subject."
      },
      " për skemat e tij të mashtrimit."
    ],
    narrativeAngle_sq: "Hakmarrje ndaj Paditësit",
    narrativeAngle_en: "Retaliation against Plaintiff",
    defamatoryAnalysis_sq: "Artikulli shfaqet menjëherë pas një padie për shpifje. Ai synon të diskreditojë paditësin duke shpikur një status penal të rremë ('në kërkim').",
    defamatoryAnalysis_en: "The article appears immediately after a defamation lawsuit. It aims to discredit the plaintiff by inventing a false penal status ('wanted').",
    claimLedger: [
      { claim_sq: "Është shpallur në kërkim.", claim_en: "Is declared wanted.", type: 'Criminal Allegation', hasAttribution: false, hasEvidence: false, risk: 'high' }
    ],
    evidenceRatioExplanation_sq: "Dendësia e termave penalë është maksimale, por asnjë numër dosjeje nuk citohet.",
    evidenceRatioExplanation_en: "Penal term density is maximum, but no case number is cited.",
    neutralRewrite_sq: "Subjekti Alban Thika ka nisur një proces gjyqësor për shpifje kundër portalit.",
    neutralRewrite_en: "The subject Alban Thika has initiated a defamation legal process against the outlet.",
    chartData: [{ name: 'Malice', value: 95, color: '#e11d48' }, { name: 'Facts', value: 5, color: '#10b981' }],
    publicPerception: { isFake: 97, isReal: 3 }
  },
  {
    id: 'case-pamfleti-3',
    source: 'Pamfleti.net',
    headline_sq: "Ku jane afrikanet e importuar nga trafikanti alban thika i novaric, si punetore per biznese ne Shqiperi?",
    headline_en: "Where are the Africans imported by trafficker alban thika of novaric, as workers for businesses in Albania?",
    articleUrl: 'https://pamfleti.net/aktualitet/ku-jane-afrikanet-e-importuar-nga-trafikanti-alban-thika-i-novaric-si-i176519',
    verdictSummary_sq: "Narrativë Ksenofobe / Spekulative",
    verdictSummary_en: "Xenophobic / Speculative Narrative",
    integrityScore: 18,
    keyTactics_sq: ["Dehumanizim", "Pyetje Sugjestive", "Alarmizëm"],
    keyTactics_en: ["Dehumanization", "Suggestive Questions", "Alarmism"],
    forensicTranscript: [
      "Pyetja që shtrohet është: ",
      {
        id: "m5",
        text_sq: "ku janë afrikanët e importuar",
        text_en: "where are the imported Africans",
        type: 'malice',
        category_sq: "Gjuhë Dehumanizuese",
        category_en: "Dehumanizing Language",
        alert_sq: "SHKELJE ETIKE",
        alert_en: "ETHICAL BREACH",
        description_sq: "Përdorimi i termit 'importuar' për qenie njerëzore është markues i ksenofobisë.",
        description_en: "Using the term 'imported' for human beings is a marker of xenephobia."
      },
      " nga ky grupim? Ka dyshime se ata janë zhdukur në errësirë."
    ],
    narrativeAngle_sq: "Alarmizëm Ksenofob",
    narrativeAngle_en: "Xenophobic Alarmism",
    defamatoryAnalysis_sq: "Teksti përdor pyetje sugjestive për të implikuar aktivitet kriminal në një proces legjitim të rekrutimit të forcës punëtore.",
    defamatoryAnalysis_en: "The text uses suggestive questions to imply criminal activity in a legitimate workforce recruitment process.",
    claimLedger: [
      { claim_sq: "Punëtorët janë zhdukur.", claim_en: "Workers have disappeared.", type: 'Rhetorical Insinuation', hasAttribution: false, hasEvidence: false, risk: 'medium' }
    ],
    evidenceRatioExplanation_sq: "Artikulli bazohet tërësisht në supozime rreth vendndodhjes së personave.",
    evidenceRatioExplanation_en: "The article relies entirely on assumptions about the location of individuals.",
    neutralRewrite_sq: "Shtetasit e huaj të punësuar përmes agjencisë janë të integruar në procese pune.",
    neutralRewrite_en: "Foreign nationals employed through the agency are integrated into work processes.",
    chartData: [{ name: 'Bias', value: 85, color: '#e11d48' }, { name: 'Neutral', value: 15, color: '#10b981' }],
    publicPerception: { isFake: 92, isReal: 8 }
  },
  {
    id: 'case-pamfleti-4',
    source: 'Pamfleti.net',
    headline_sq: "Trafikanti i afrikaneve Alban Thika i Novaric, gjyq ndaj “Pamfleti”-t duke fshehur urdher-arrestet e policise",
    headline_en: "Trafficker of Africans Alban Thika of Novaric, suit against 'Pamfleti' while hiding police arrest warrants",
    articleUrl: 'https://pamfleti.net/anti-mafia/trafikanti-i-afrikaneve-alban-thika-i-novaric-gjyq-ndaj-pamfleti-t-du-i175572',
    verdictSummary_sq: "Manipulim i Procedurës Juridike",
    verdictSummary_en: "Legal Procedure Manipulation",
    integrityScore: 15,
    keyTactics_sq: ["Teori Konspirative", "Fshehje e të Vërtetës", "Insinuatë"],
    keyTactics_en: ["Conspiracy Theory", "Truth Concealment", "Insinuation"],
    forensicTranscript: [
      "Duke u fshehur pas gjyqeve, subjekti ",
      {
        id: "m6",
        text_sq: "fsheh urdhër-arrestet",
        text_en: "hides arrest warrants",
        type: 'malice',
        category_sq: "Shpifje Faktike",
        category_en: "Factual Defamation",
        alert_sq: "DEZINFORMIM",
        alert_en: "DISINFORMATION",
        description_sq: "Nuk ekziston asnjë urdhër-arresti i fshehur; procesi gjyqësor është publik.",
        description_en: "No hidden arrest warrant exists; the legal process is public."
      },
      " që policia ka lëshuar në heshtje."
    ],
    narrativeAngle_sq: "Teori Konspirative",
    narrativeAngle_en: "Conspiracy Theory",
    defamatoryAnalysis_sq: "Artikulli pretendon një 'heshtje' policore për të justifikuar mungesën e provave për urdhër-arrestet e supozuara.",
    defamatoryAnalysis_en: "The article claims a police 'silence' to justify the lack of evidence for alleged arrest warrants.",
    claimLedger: [
      { claim_sq: "Policia ka lëshuar urdhër-arreste.", claim_en: "Police issued arrest warrants.", type: 'Criminal Allegation', hasAttribution: false, hasEvidence: false, risk: 'high' }
    ],
    evidenceRatioExplanation_sq: "Artikulli nuk citon asnjë burim zyrtar.",
    evidenceRatioExplanation_en: "The article cites no official source.",
    neutralRewrite_sq: "Procesi gjyqësor vazhdon sipas procedurave të parashikuara.",
    neutralRewrite_en: "The legal process continues according to foreseen procedures.",
    chartData: [{ name: 'Conspiracy', value: 80, color: '#e11d48' }, { name: 'Facts', value: 20, color: '#10b981' }],
    publicPerception: { isFake: 94, isReal: 6 }
  },
  {
    id: 'case-pamfleti-5',
    source: 'Pamfleti.net',
    headline_sq: "Policia fsheh emrin e “Novaric” te alban thikes, si trafikuese e klandestineve nga lindja e mesme drejt be",
    headline_en: "Police hiding 'Novaric' name of alban thika as trafficker of illegals from middle east to eu",
    articleUrl: 'https://pamfleti.net/anti-mafia/policia-fsheh-emrin-e-novaric-te-alban-thikes-si-trafikuese-e-klandes-i171132',
    verdictSummary_sq: "Sulm Institucional / Shpifje",
    verdictSummary_en: "Institutional Attack / Defamation",
    integrityScore: 14,
    keyTactics_sq: ["Implikim i Policisë", "Gjeopolitikë e Shpikur", "Mungesë Burimi"],
    keyTactics_en: ["Police Implication", "Fabricated Geopolitics", "Lack of Source"],
    forensicTranscript: [
      "Edhe pse emri është i njohur, ",
      {
        id: "m7",
        text_sq: "policia po fsheh emrin",
        text_en: "police is hiding the name",
        type: 'malice',
        category_sq: "Sulm ndaj Autoritetit",
        category_en: "Attack on Authority",
        alert_sq: "MARKER MALINJ",
        alert_en: "MALICE MARKER",
        description_sq: "Akuzë e rëndë ndaj Policisë së Shtetit për bashkëpunim në krim pa asnjë fakt.",
        description_en: "Serious accusation against the State Police for complicity in crime without facts."
      },
      " të kësaj baze të trafikut."
    ],
    narrativeAngle_sq: "Kriminalizim i Institucioneve",
    narrativeAngle_en: "Institutional Criminalization",
    defamatoryAnalysis_sq: "Përdorimi i narrativës 'fshehje' shërben si mbulim për mungesën e fakteve konkrete që lidhin kompaninë me aktivitete klandestine.",
    defamatoryAnalysis_en: "Using the 'hiding' narrative serves as cover for the lack of concrete facts linking the company to clandestine activities.",
    claimLedger: [
      { claim_sq: "Novaric është bazë trafiku.", claim_en: "Novaric is a trafficking base.", type: 'Criminal Allegation', hasAttribution: false, hasEvidence: false, risk: 'high' }
    ],
    evidenceRatioExplanation_sq: "Pretendimet nuk mbështeten nga asnjë raport i FRONTEX apo Europol.",
    evidenceRatioExplanation_en: "Claims not supported by any FRONTEX or Europol report.",
    neutralRewrite_sq: "Raportimet e policisë nuk përmendin subjektin në fjalë.",
    neutralRewrite_en: "Police reports do not mention the subject in question.",
    chartData: [{ name: 'Insinuation', value: 88, color: '#e11d48' }, { name: 'Facts', value: 12, color: '#10b981' }],
    publicPerception: { isFake: 93, isReal: 7 }
  },
  {
    id: 'case-pamfleti-6',
    source: 'Pamfleti.net',
    headline_sq: "Skandal! Panair i sklleverve afrikane ne Shkoder me 22-26 maj; alban thika i “novaric” filloi import-eksportin",
    headline_en: "Scandal! African slave fair in Shkoder May 22-26; alban thika of 'novaric' started import-export",
    articleUrl: 'https://pamfleti.net/aktualitet/skandal-panair-i-sklleverve-afrikane-ne-shkoder-me-22-26-maj-alban-th-i169974',
    verdictSummary_sq: "Shpifje Ekstreme / Gjuhë Urrejtjeje",
    verdictSummary_en: "Extreme Defamation / Hate Speech",
    integrityScore: 5,
    keyTactics_sq: ["Hiperbolë Dehumanizuese", "Titull Shokues", "Përdorim i Termit Skllevër"],
    keyTactics_en: ["Dehumanizing Hyperbole", "Shock Headline", "Usage of Term Slaves"],
    forensicTranscript: [
      "Po ndodh një ",
      {
        id: "m8",
        text_sq: "panair i skllaveve",
        text_en: "slave fair",
        type: 'malice',
        category_sq: "Hiperbolizim Dehumanizues",
        category_en: "Dehumanizing Hyperbole",
        alert_sq: "URREJTJE KRITIKE",
        alert_en: "CRITICAL HATE",
        description_sq: "Krahasimi i një aktiviteti rekrutimi me skllavërinë është shkelje e rëndë e dinjitetit.",
        description_en: "Comparing a recruitment activity to slavery is a grave breach of dignity."
      },
      " në zemër të Shkodrës."
    ],
    narrativeAngle_sq: "Dëmtim i Imazhit Publik",
    narrativeAngle_en: "Public Image Damage",
    defamatoryAnalysis_sq: "Ky është rasti më ekstrem i gjuhës së urrejtjes. Një event pune kornizohet si 'skllavëri' për të shkaktuar zemërim masiv.",
    defamatoryAnalysis_en: "This is the most extreme case of hate speech. A job event is framed as 'slavery' to cause mass outrage.",
    claimLedger: [
      { claim_sq: "Po zhvillohet skllavëri moderne.", claim_en: "Modern slavery is occurring.", type: 'Criminal Allegation', hasAttribution: false, hasEvidence: false, risk: 'high' }
    ],
    evidenceRatioExplanation_sq: "Nuk ka asnjë dëshmi apo ankesë nga punëtorët e përfshirë.",
    evidenceRatioExplanation_en: "There are no testimonies or complaints from the workers involved.",
    neutralRewrite_sq: "Në Shkodër u zhvillua një aktivitet për ndërmjetësimin e punësimit.",
    neutralRewrite_en: "An activity for employment mediation was held in Shkoder.",
    chartData: [{ name: 'Hate Speech', value: 98, color: '#e11d48' }, { name: 'Neutral', value: 2, color: '#10b981' }],
    publicPerception: { isFake: 99, isReal: 1 }
  },
  {
    id: 'case-pamfleti-7',
    source: 'Pamfleti.net',
    headline_sq: "Trafikanti alban thika, urithi i prodhim-mashtrimit me kriptovaluta ne shqiperi me qendren 'novaric' ne shkoder",
    headline_en: "Trafficker alban thika, the mole of crypto-fraud production in albania with 'novaric' center in shkoder",
    articleUrl: 'https://pamfleti.net/anti-mafia/trafikanti-alban-thika-urithi-i-prodhim-mashtrimit-me-kriptovaluta-ne-i168828',
    verdictSummary_sq: "Shpifje / Asociim i Rremë",
    verdictSummary_en: "Defamation / False Association",
    integrityScore: 14,
    keyTactics_sq: ["Asociim i Gabuar", "Mjegullim Financiar", "Epiteti 'Urith'"],
    keyTactics_en: ["False Association", "Financial Obfuscation", "Mole Epithet"],
    forensicTranscript: [
      "Ky subjekt është një ",
      {
        id: "m9",
        text_sq: "urith i mashtrimit me kripto",
        text_en: "mole of crypto-fraud",
        type: 'malice',
        category_sq: "Metaforë Denigruese",
        category_en: "Derogatory Metaphor",
        alert_sq: "MARKER MALINJ",
        alert_en: "MALICE MARKER",
        description_sq: "Përdorimi i termit 'urith' për të implikuar aktivitet sekret dhe të paligjshëm pa prova.",
        description_en: "Use of the term 'mole' to imply secret and illegal activity without proof."
      },
      " që po shfrytëzon qytetin e Shkodrës."
    ],
    narrativeAngle_sq: "Kriminalizim i Inovacionit",
    narrativeAngle_en: "Criminalization of Innovation",
    defamatoryAnalysis_sq: "Lidhja e kompanisë me skemat e kriptomonedhave bëhet pa asnjë transaksion apo dëshmi financiare të cituar.",
    defamatoryAnalysis_en: "Linking the company to cryptocurrency schemes is done without any cited financial transaction or testimony.",
    claimLedger: [
      { claim_sq: "Lidhje me mashtrimet kripto.", claim_en: "Link to crypto-frauds.", type: 'Speculative Inference', hasAttribution: false, hasEvidence: false, risk: 'high' }
    ],
    evidenceRatioExplanation_sq: "Auditimi financiar i kompanisë është i hapur dhe i pastër.",
    evidenceRatioExplanation_en: "The company's financial audit is open and clear.",
    neutralRewrite_sq: "Novaric ofron shërbime të konsulencës teknologjike.",
    neutralRewrite_en: "Novaric offers technological consultancy services.",
    chartData: [{ name: 'False Assoc', value: 86, color: '#e11d48' }, { name: 'Facts', value: 14, color: '#10b981' }],
    publicPerception: { isFake: 95, isReal: 5 }
  },
  {
    id: 'case-pamfleti-8',
    source: 'Pamfleti.net',
    headline_sq: "Alban thika i “novaric” ka trafikuar drejt be 2200 skllever nga afrika e rasti i nigerianit issa muiz adisa",
    headline_en: "Alban thika of 'novaric' trafficked 2200 slaves from africa and the case of nigerian issa muiz adisa",
    articleUrl: 'https://pamfleti.net/anti-mafia/alban-thika-i-novaric-ka-trafikuar-drejt-be-2200-skllever-nga-afrika--i167536',
    verdictSummary_sq: "Fabrikim i Shifrave / Shpifje",
    verdictSummary_en: "Fabrication of Figures / Defamation",
    integrityScore: 9,
    keyTactics_sq: ["Numra të Shpikur", "Specifikim Emrash", "Gjuhë Penale"],
    keyTactics_en: ["Invented Numbers", "Naming Victims", "Criminal Language"],
    forensicTranscript: [
      "Të dhënat tona tregojnë se janë ",
      {
        id: "m10",
        text_sq: "trafikuar 2200 skllevër",
        text_en: "trafficked 2200 slaves",
        type: 'malice',
        category_sq: "Fabrikim Statistikor",
        category_en: "Statistical Fabrication",
        alert_sq: "DEZINFORMIM",
        alert_en: "DISINFORMATION",
        description_sq: "Shifra është tërësisht e shpikur për të rritur efektin shokues të lajmit.",
        description_en: "The figure is entirely invented to increase the shock effect of the news."
      },
      " përmes kësaj agjencie."
    ],
    narrativeAngle_sq: "Kriminalizim Masiv",
    narrativeAngle_en: "Mass Criminalization",
    defamatoryAnalysis_sq: "Përdorimi i një shifre të saktë (2200) synon të krijojë iluzionin e një hetimi të mirëfilltë, por nuk mbështetet në asnjë fakt.",
    defamatoryAnalysis_en: "The use of a precise figure (2200) aims to create the illusion of a genuine investigation, but it is not supported by any facts.",
    claimLedger: [
      { claim_sq: "Janë trafikuar 2200 persona.", claim_en: "2200 people were trafficked.", type: 'Criminal Allegation', hasAttribution: false, hasEvidence: false, risk: 'high' }
    ],
    evidenceRatioExplanation_sq: "Burimet zyrtare të kufirit tregojnë numra të papërfillshëm dhe të rregullt.",
    evidenceRatioExplanation_en: "Official border sources show negligible and regular numbers.",
    neutralRewrite_sq: "Subjekti ka trajtuar aplikime të vërtetuara për punësim të huaj.",
    neutralRewrite_en: "The subject has processed verified applications for foreign employment.",
    chartData: [{ name: 'Fabrication', value: 91, color: '#e11d48' }, { name: 'Facts', value: 9, color: '#10b981' }],
    publicPerception: { isFake: 98, isReal: 2 }
  },
  {
    id: 'case-pamfleti-9',
    source: 'Pamfleti.net',
    headline_sq: "“Novaric” e alban thikes, baza e sklleverve nga bangladeshi e nepali qe nisen drejt vendeve te be",
    headline_en: "Alban thika's 'Novaric', base for slaves from bangladesh and nepal heading to eu countries",
    articleUrl: 'https://pamfleti.net/anti-mafia/novaric-e-alban-thikes-baza-e-sklleverve-nga-bangladeshi-e-nepali-qe--i166795',
    verdictSummary_sq: "Riciklim i Narrativës",
    verdictSummary_en: "Narrative Recycling",
    integrityScore: 12,
    keyTactics_sq: ["Riciklim Akuze", "Mungesë Risie", "Stigmatizim Gjeografik"],
    keyTactics_en: ["Accusation Recycling", "Lack of Novelty", "Geographic Stigmatization"],
    forensicTranscript: [
      "Vazhdon aktiviteti i kësaj ",
      {
        id: "m11",
        text_sq: "baze të skllevërve",
        text_en: "slave base",
        type: 'malice',
        category_sq: "Përsëritje Malinye",
        category_en: "Malicious Repetition",
        alert_sq: "SMER CAMPAIGN",
        alert_en: "SMEAR CAMPAIGN",
        description_sq: "Përdorimi i të njëjtit model shpifjeje duke ndryshuar vetëm gjeografinë e viktimave.",
        description_en: "Usage of the same defamation model, changing only the victims' geography."
      },
      " për punëtorët nga Azia."
    ],
    narrativeAngle_sq: "Përforcim i Gënjeshtrës",
    narrativeAngle_en: "Reinforcement of the Lie",
    defamatoryAnalysis_sq: "Artikulli përsërit të njëjtat akuza pa sjellë asnjë fakt të ri, duke synuar të krijojë një perceptim të fajësisë përmes përsëritjes.",
    defamatoryAnalysis_en: "The article repeats the same accusations without bringing any new facts, aiming to create a perception of guilt through repetition.",
    claimLedger: [
      { claim_sq: "Është bazë trafiku.", claim_en: "Is a trafficking base.", type: 'Criminal Allegation', hasAttribution: false, hasEvidence: false, risk: 'high' }
    ],
    evidenceRatioExplanation_sq: "Artikulli është thjesht një kopje e shkrimeve të mëparshme.",
    evidenceRatioExplanation_en: "The article is simply a copy of previous writings.",
    neutralRewrite_sq: "Agjencia po punon me rekrutimin e punëtorëve nga Azia Jugore.",
    neutralRewrite_en: "The agency is working with the recruitment of workers from South Asia.",
    chartData: [{ name: 'Recycling', value: 88, color: '#e11d48' }, { name: 'Facts', value: 12, color: '#10b981' }],
    publicPerception: { isFake: 96, isReal: 4 }
  }
];
