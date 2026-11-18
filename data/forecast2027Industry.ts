/**
 * Parts B and C, watch-list, next steps, disclaimer, gaps, sources and
 * the decisions log of NOVARIC® Forecast 2027. English is the 18 November
 * 2026 paper. No filesystem path is stored here.
 */
import type { BiText, ForecastSection } from './forecast2027';

const t = (
  sq: string,
  en: string,
  italicSq?: string[],
  italicEn?: string[],
): BiText => ({ sq, en, italicSq, italicEn });

const scenarioColumns: BiText[] = [
  t('Skenari', 'Scenario'),
  t('Probabiliteti gjykues', 'Judgmental probability'),
  t('Si kalon në këtë linjë', 'Transmission into this line'),
];

const leadColumns: BiText[] = [
  t('Treguesit pararendës', 'Leading indicators'),
  t('Mundësitë', 'Opportunities'),
  t('Kërcënimet', 'Threats'),
];

export const forecastIndustrySections: ForecastSection[] = [
  {
    id: 'b1',
    heading: t('B1. Rekrutimi dhe lëvizshmëria e punës', 'B1. Recruitment and labour mobility'),
    caption: t(
      'Jobs Hub i Shqipërisë dhe i Malit të Zi; veprimtaria e agjencisë së punësimit, përfshirë NOVARIC® DOO (kodi 7810); lejet e punës për të huajt; lëvizshmëria në BE.',
      'Albania and Montenegro Jobs Hub; employment-agency activity, including NOVARIC® DOO (code 7810); foreign work permits; EU mobility.',
    ),
    blocks: [
      {
        kind: 'prose',
        text: t(
          'Perspektiva dhe shtytësit. Të dhënat zyrtare tregojnë një treg pune shqiptar të shtrënguar: papunësia është tashmë e ulët sipas standardeve historike, pagat po rriten me gati 10% në vit, dhe pagat në ndërtim po rriten më shumë se 20%. Guvernatori e lidhi këtë shprehimisht me kërkesën e fortë për punë dhe me kufizimet e ofertës. Remitancat mbeten të mëdha, gjë që mbështet të ardhurat e familjeve, por edhe konfirmon një diasporë të madhe. Turizmi dhe ndërtimi vazhdojnë të tërheqin punë sezonale dhe të kualifikuar. Rritja e Malit të Zi në 2026 përshkruhet nga Banka Botërore si e mbështetur nga konsumi, investimi dhe një sezon i fortë turizmi, gjë që zakonisht do të thotë punësim në hoteleri dhe ndërtim. Faktorët lëkundës të 2027 janë kuota ende e papërfunduar e punëtorëve të huaj dhe politika e pagave në Mal të Zi, dhe shpejtësia e përafrimit të punës me anëtarësimin në BE.',
          'Outlook and drivers. Official data show a tight Albanian labour market: unemployment is already low by historical standards, wages are rising at nearly 10% a year, and construction wages are rising more than 20%. The Governor explicitly linked this to strong labour demand and supply-side constraints. Remittances remain large, which supports household income but also confirms a large diaspora. Tourism and construction keep pulling in seasonal and skilled labour. Montenegro’s 2026 growth is described by the World Bank as supported by consumption, investment and a strong tourism season, which usually means hospitality and construction hiring. The 2027 swing factors are the still-pending Montenegrin foreign-worker quota and wage policy, and the speed of EU-accession labour alignment.',
        ),
      },
      {
        kind: 'prose',
        internal: true,
        text: t(
          'Pamje operacionale e brendshme (e etiketuar si të dhëna të brendshme të NOVARIC®, jo statistikë zyrtare), nga raporti i arbitrazhit të Jobs Hub i 18 nëntorit 2026, i lexuar rreth orës 08:50 me orën e Tiranës, inventari në 08:33: 1,469 shpallje të hapura, nga të cilat Shqipëria 570, Mali i Zi 434 dhe Malta 465. Ushqimi i Maltës (Jobsplus) kishte qenë i ndenjur për 21 ditë. Vetëm 17 nga 1,469 vendet e lira të hapura (1.2%) kishin një çështje të lidhur të Case Hub. Fondi i ofertës së Case Hub ishte 371. Futja e të dhënave ishte rifilluar shkurt më 17 nëntor (88 shpallje të reja, vetëm Mali i Zi dhe Shqipëria) dhe pastaj ishte ndalur përsëri.',
          'Internal operational snapshot (labelled internal, not official statistics), from the Jobs Hub arbitrage report of 18 November 2026, read around 08:50 Tirana time, inventory at 08:33: 1,469 open listings, of which Albania 570, Montenegro 434 and Malta 465. The Malta (Jobsplus) feed had been stale for 21 days. Only 17 of the 1,469 open vacancies (1.2%) had a linked Case Hub case. The Case Hub supply pool was 371. Ingestion had resumed briefly on 17 November (88 new listings, Montenegro and Albania only) and then stopped again.',
        ),
      },
      {
        kind: 'table',
        columns: scenarioColumns,
        rows: [
          [
            t('Baza: tregje të shtrënguara, kërkesë e qëndrueshme për vendosje', 'Base: tight markets, firm placement demand'),
            t('50% (gjykim)', '50% (judgment)'),
            t('Punëdhënësit në hoteleri, ndërtim, shitje me pakicë dhe kujdes vazhdojnë të punësojnë, përfshirë punëtorë të huaj; presioni mbi pagat vazhdon; marzhet varen nga shpejtësia dhe përputhshmëria, jo vetëm nga vëllimi.', 'Employers in hospitality, construction, retail and care keep hiring, including foreign workers; wage pressure continues; margins depend on speed and compliance, not on volume alone.'),
          ],
          [
            t('E favorshme: rregulla më të qarta dhe formalizim më i thellë', 'Upside: clearer rules and deeper formalisation'),
            t('20% (gjykim)', '20% (judgment)'),
            t('Një kuotë e Malit të Zi për 2027 në kohë, përparim në kapitujt e punës të BE dhe formalizim i mëtejshëm në Shqipëri e rrisin kërkesën për agjenci të licencuar.', 'A timely Montenegro 2027 quota, progress on EU labour chapters, and further formalisation in Albania raise licensed-agency demand.'),
          ],
          [
            t('E pafavorshme: leje të vonuara ose punësim më i dobët', 'Downside: delayed permits or weaker hiring'),
            t('20% (gjykim)', '20% (judgment)'),
            t('Një kuotë e vonuar ose e ngushtë e Malit të Zi, një goditje pagash që punëdhënësit nuk mund ta përthithin, ose një dobësim i turizmit ngadalëson vendosjet.', 'A late or tight Montenegro quota, a wage shock that employers cannot absorb, or a tourism soft patch slows placements.'),
          ],
          [
            t('Goditje: energjia ose rënia e kërkesës', 'Shock: energy or demand slump'),
            t('10% (gjykim)', '10% (judgment)'),
            t('Inflacioni i karburantit dhe i ushqimeve, ose një rënie e mprehtë e turizmit, e pret së pari punësimin sezonal.', 'Fuel and food inflation, or a sharp tourism drop, cuts seasonal hiring first.'),
          ],
        ],
      },
      {
        kind: 'table',
        columns: leadColumns,
        rows: [
          [
            t('Publikimet e INSTAT dhe të MONSTAT për punën dhe pagat; vendimet për lejet e punës dhe kuotat në Shqipëri dhe në Mal të Zi; ardhjet e turistëve; shkallët e plotësimit dhe freskia e ushqimit të Jobs Hub (të brendshme); rritja e zonës së euros (KE).', 'INSTAT and MONSTAT labour and wage prints; Albania and Montenegro work-permit and quota decisions; tourism arrivals; Jobs Hub fill rates and feed freshness (internal); euro-area growth (EC).'),
            t('Punë agjencie e licencuar shqiptare në sektorët me mungesë; vendosje në hoteleri dhe ndërtim në Mal të Zi nëse kuota e 2027 është e përdorshme; bashkimi i punëve me formimin e Akademisë; punë e kujdesshme në korridorin e BE sapo rregullat të jenë të qarta.', 'Licensed Albanian agency work in shortage sectors; Montenegro hospitality and construction placements if the 2027 quota is usable; bundling jobs with Academy training; careful EU-corridor work once rules are clear.'),
            t('Vonesë kuote ose buxheti në Mal të Zi; inflacion pagash që ngrin vendet e lira; një ushqim i ndenjur i Maltës nëse ai korridor ende tregohet; lidhje shumë e ulët e çështjes me vendin e lirë (e brendshme); pretendime pa burim për fondet e talenteve; ndryshim rregullator.', 'Quota or budget delay in Montenegro; wage inflation that freezes vacancies; a stale Malta feed if that corridor is still marketed; very low case-to-vacancy linkage (internal); unsourced claims about talent pools; regulatory change.'),
          ],
        ],
      },
      {
        kind: 'prose',
        text: t(
          'Pasojat për veprimtarinë aktuale. Së pari, cilësia e inventarit të trajtohet si rrezik operativ i 2027: një qendër që tregon shpallje të ndenjura të Maltës, ose që lidh vetëm 1.2% të vendeve të lira me një çështje, nuk do ta shndërrojë trafikun në vendosje. Së dyti, Shqipëria është tani inventari më i madh i brendshëm dhe është tregu i licencuar i shtëpisë — duhet të stafoset në përputhje me këtë. Së treti, Mali i Zi është i ndjeshëm ndaj kohës: monitorimi i brendshëm më 18 nëntor gjeti se kuota e punëtorëve të huaj për 2027 nuk ishte miratuar ende dhe se afati ligjor është 30 nëntor 2026; ky konstatim duhet të verifikohet kundrejt Fletës Zyrtare para çdo mesazhi për klientin, dhe nevojat e punëdhënësve duhet të përgatiten, jo të premtohen. Së katërti, një seri zyrtare e vëllimit të lejeve të punës për të huajt për 2026/2027 për Shqipërinë nuk u gjet në këtë botim; mos u shpikni një kuotë apo një numër lejesh.',
          'Implications for current operations. First, treat inventory quality as a 2027 operating risk: a hub that shows stale Malta listings, or that links only 1.2% of vacancies to a case, will not convert traffic into placements. Second, Albania is now the largest internal inventory and is the licensed home market — it should be staffed accordingly. Third, Montenegro is time-sensitive: internal monitoring on 18 November found that the 2027 foreign-worker quota had not yet been adopted and that the legal deadline is 30 November 2026; that finding should be verified against the Official Gazette before any client message, and employer needs should be prepared, not promised. Fourth, an official 2026/2027 foreign-work-permit volume series for Albania was not found in this edition; do not invent a quota or a permit count.',
        ),
      },
      {
        kind: 'prose',
        text: t(
          'Linja të ardhshme. Paketa punëdhënësish që bashkojnë gjetjen, bashkërendimin e dokumentacionit dhe formimin; veprimtari më të thella në Mal të Zi sipas kodit 7810 sapo të njihet kuota e 2027; korridore të përzgjedhura drejt BE vetëm aty ku rregullat janë zyrtare dhe ushqimi është i gjallë. Asnjë pretendim pa burim për kombësi apo paga në faqet publike.',
          'Prospective lines. Employer packages that combine sourcing, documentation coordination and training; deeper Montenegro operations under code 7810 once the 2027 quota is known; selective EU-destination corridors only where rules are official and the feed is live. No unsourced nationality or salary claims on public pages.',
        ),
      },
    ],
  },
  {
    id: 'b2',
    heading: t('B2. Akademia dhe formimi profesional', 'B2. Academy and vocational training'),
    caption: t(
      'NOVARIC® Academy. Regjistrimi i brendshëm nuk u verifikua në kuti në këtë botim.',
      'NOVARIC® Academy. Internal enrolment was not verified on the box in this edition.',
    ),
    blocks: [
      {
        kind: 'prose',
        text: t(
          'Perspektiva dhe shtytësit. Pagat zyrtare në rritje, një treg pune i shtrënguar dhe një përzierje rritjeje e turizmit dhe e ndërtimit të gjitha tregojnë kërkesë për formim profesional të shkurtër, të lidhur me punën, në 2027, veçanërisht në ndërtim, hoteleri, shitje me pakicë dhe zeje të afërta. Buxheti draft i qeverisë e lidh tashmë të ardhurën më të lartë nga kontributet shoqërore me rritjen e pagave dhe me formalizimin. Anëtarësimi në BE, nëse qëndron në rrugën e Komisionit për 2027 për Shqipërinë dhe në rrugën e fazës së fundit për Malin e Zi, duhet gjithashtu të rrisë kërkesën për standarde, gjuhë dhe aftësi të lidhura me përputhshmërinë. Çfarë nuk ka ky botim është një seri zyrtare kombëtare e regjistrimit në AFP për 2026, ose një numër i verifikuar i Akademisë; ato janë boshllëqe të dhënash, jo zero.',
          'Outlook and drivers. Rising official wages, a tight labour market and a tourism-and-construction growth mix all point to demand for short, job-linked vocational training in 2027, especially in construction, hospitality, retail and related trades. The government’s draft budget already ties higher social-contribution revenue to rising wages and formalisation. EU accession, if it stays on the Commission’s 2027 path for Albania and the end-stage path for Montenegro, should also raise demand for standards, languages and compliance-related skills. What this edition does not have is an official national VET enrolment series for 2026, or a verified Academy headcount; those are data gaps, not zeros.',
        ),
      },
      {
        kind: 'table',
        columns: scenarioColumns,
        rows: [
          [
            t('Baza: formim i qëndrueshëm i porositur nga punëdhënësi', 'Base: steady employer-commissioned training'),
            t('50% (gjykim)', '50% (judgment)'),
            t('Punëdhënësit vazhdojnë të blejnë kurse të shkurtra për të plotësuar rolet me mungesë; financimi publik i AFP mbetet i disponueshëm, por konkurrues.', 'Employers keep buying short courses to fill shortage roles; public VET funding stays available but competitive.'),
          ],
          [
            t('E favorshme: shtytje aftësish e përafruar me BE', 'Upside: EU-aligned skills push'),
            t('20% (gjykim)', '20% (judgment)'),
            t('Udhërrëfyesit e anëtarësimit dhe programet e donatorëve ose publike zgjerojnë formimin e paguar në profesionet me mungesë.', 'Accession roadmaps and donor or public programmes expand paid training in shortage occupations.'),
          ],
          [
            t('E pafavorshme: formimi pritet i pari', 'Downside: training is cut first'),
            t('20% (gjykim)', '20% (judgment)'),
            t('Nëse punësimi ngadalësohet, disa punëdhënës e shtyjnë formimin; një Akademi pa rezultate të dokumentuara humbet peshë.', 'If hiring slows, some employers defer training; an Academy without documented outcomes loses share.'),
          ],
          [
            t('Goditje: shtrëngim i kostos së jetesës', 'Shock: cost-of-living squeeze'),
            t('10% (gjykim)', '10% (judgment)'),
            t('Familjet dhe NVM-të i shtyjnë tarifat nëse çmimet e energjisë kërcejnë përsëri.', 'Households and SMEs postpone fees if energy prices jump again.'),
          ],
        ],
      },
      {
        kind: 'table',
        columns: leadColumns,
        rows: [
          [
            t('Paga dhe punësimi i INSTAT sipas sektorit; veprimtaria e turizmit dhe e ndërtimit; çdo publikim zyrtar i AFP ose i të nxënit gjatë gjithë jetës (nuk u gjet në këtë botim); regjistrimi, përfundimi dhe vendosja e Akademisë sapo të verifikohen brenda.', 'INSTAT wage and employment by sector; tourism and construction activity; any official VET or lifelong-learning release (not found in this edition); Academy enrolment, completion and placement once verified internally.'),
            t('Kurse të shkurtra të ndërtuara rreth profesioneve me mungesë të dokumentuara; paketa të përbashkëta Jobs Hub plus Akademi; ofrim në Mal të Zi nëse kërkesa konfirmohet; mikro-kredenciale të lidhura me nevojat e punëdhënësit.', 'Short courses built around documented shortage occupations; joint Jobs Hub plus Academy packages; Montenegro delivery if demand is confirmed; micro-credentials tied to employer needs.'),
            t('Publikimi i shkallëve të vendosjes pa burim; dyshime akreditimi ose cilësie; numra të brendshëm që mungojnë; ofrues konkurrues me kosto të ulët.', 'Publishing unsourced placement rates; accreditation or quality doubts; missing internal numbers; competing low-cost providers.'),
          ],
        ],
      },
      {
        kind: 'prose',
        text: t(
          'Pasojat për veprimtarinë aktuale. Katalogu i 2027 të ndërtohet nga prova zyrtare e tregut të punës (pagat, rritja sektoriale, turizmi dhe ndërtimi), jo nga shifra pa burim të «hendekut të aftësive». Mos publikoni shkallë regjistrimi ose vendosjeje të Akademisë derisa të jenë verifikuar. Linjat e ardhshme përfshijnë koorte të porositura nga punëdhënësi në Shqipëri, një ofertë për Malin e Zi sapo kërkesa dhe licencimi të jenë të qarta, dhe kurse të shkurtra dixhitale që qëndrojnë pas një tutori njerëzor, jo një certifikatë IA të parishikuar.',
          'Implications for current operations. Build the 2027 catalogue from official labour-market evidence (wages, sector growth, tourism and construction), not from unsourced “skills gap” figures. Do not publish Academy enrolment or placement rates until they are verified. Prospective lines include employer-commissioned cohorts in Albania, a Montenegro offer once demand and licensing are clear, and digital short courses that sit behind a human tutor, not an unreviewed AI certificate.',
        ),
      },
    ],
  },
  {
    id: 'b3',
    heading: t('B3. Media House', 'B3. Media House'),
    caption: t(
      'NOVARIC® Media House; media.novaric.al; reklama dhe platformat. Madhësia zyrtare e tregut të reklamës: nuk u gjet.',
      'NOVARIC® Media House; media.novaric.al; advertising and platforms. Official advertising-market size: not found.',
    ),
    blocks: [
      {
        kind: 'prose',
        text: t(
          'Perspektiva dhe shtytësit. Viti 2027 do të jetë një vit i rëndë lajmesh në rajonin e shtëpisë së NOVARIC®: zgjedhjet vendore të Shqipërisë më 9 maj, lëvizja e mundshme e Malit të Zi përmes kapitujve të fundit të anëtarësimit, objektivi i deklaruar i negociatave të Shqipërisë për 2027, dhe një histori evropiane energjie dhe sigurie që tashmë sundon perspektivat e Komisionit dhe të BQE. Kjo mbështet kërkesën për lajme të kujdesshme, dygjuhëshe, me burim të cituar. Çfarë nuk mund të bëjë ky botim është të masë tregun e reklamës shqiptar ose malazez: një shifër zyrtare ose e burimit të mirë e shpenzimit reklamues të 2026 nuk u gjet. Shpërndarja në platforma (Instagram @novaric.media dhe, më vonë, kanale të tjera të dakorduara) mbetet një mjet shtrirjeje, jo një zëvendësues i faqes së internetit si shtëpia kanonike.',
          'Outlook and drivers. 2027 will be a heavy news year in NOVARIC®’s home region: Albania’s local elections on 9 May, Montenegro’s possible movement through the last accession chapters, Albania’s stated 2027 negotiation objective, and a European energy and security story that already dominates the Commission and ECB outlooks. That supports demand for careful, bilingual, source-cited news. What this edition cannot do is size the Albanian or Montenegrin advertising market: an official or well-sourced 2026 ad-spend figure was not found. Platform distribution (Instagram @novaric.media and, later, other agreed channels) remains a reach tool, not a substitute for the website as the canonical home.',
        ),
      },
      {
        kind: 'table',
        columns: scenarioColumns,
        rows: [
          [
            t('Baza: vlerë e lartë lajmesh, monetizim i matur', 'Base: high newsworthiness, modest monetisation'),
            t('55% (gjykim)', '55% (judgment)'),
            t('Interesi i audiencës qëndron i qëndrueshëm rreth zgjedhjeve, zgjerimit dhe energjisë; reklama rritet vetëm aq shpejt sa e lejon një treg ende i pamatur.', 'Audience interest stays firm around elections, enlargement and energy; advertising grows only as fast as a still-unmeasured market allows.'),
          ],
          [
            t('E favorshme: një franshizë e besuar', 'Upside: a trusted franchise'),
            t('15% (gjykim)', '15% (judgment)'),
            t('Pas shqyrtimit ligjor dhe nënshkrimit, vetë Forecast bëhet një produkt i përsëritur i Media House, me një buletin dhe shpjegues të licencuar.', 'After legal review and sign-off, the Forecast itself becomes a recurring Media House product, with a newsletter and licensed explainers.'),
          ],
          [
            t('E pafavorshme: reklama të dobëta ose dëmtim besimi', 'Downside: weak ads or trust damage'),
            t('20% (gjykim)', '20% (judgment)'),
            t('Reklamë e hollë, ngushtim i platformës, ose çdo perceptim i anshmërisë politike rreth 9 majit 2027.', 'Thin advertising, platform throttling, or any perception of political partiality around 9 May 2027.'),
          ],
          [
            t('Goditje: tendosje e redaksisë nga kriza e sigurisë ose e energjisë', 'Shock: security or energy crisis newsroom strain'),
            t('10% (gjykim)', '10% (judgment)'),
            t('Një goditje e madhe e rrit trafikun, por edhe rrezikun ligjor, të sigurisë dhe të paanshmërisë, dhe mund ta ngrijë reklamën.', 'A major shock raises traffic but also legal, safety and impartiality risk, and can freeze advertising.'),
          ],
        ],
      },
      {
        kind: 'table',
        columns: leadColumns,
        rows: [
          [
            t('Kalendarët e zgjedhjeve dhe të zgjerimit; titujt e çmimit të energjisë (Brent, TTF, karburanti vendas); shtrirja e faqes dhe e @novaric.media sapo të matet brenda (nuk u përpilua këtu); çdo publikim zyrtar i tregut të reklamës nëse shfaqet një i tillë.', 'Election and enlargement calendars; energy-price headlines (Brent, TTF, domestic fuel); website and @novaric.media reach once measured internally (not compiled here); any official ad-market print if one appears.'),
            t('Shpjegues të paanshëm të zgjedhjeve dhe të anëtarësimit; një botim i nënshkruar i Forecast në mes të janarit 2027 nëse D5 dhe D4 janë të plota; përmbajtje e markës e etiketuar; një buletin me leje.', 'Impartial election and accession explainers; a signed Forecast edition in mid-January 2027 if D5 and D4 are complete; labelled branded content; a permission-based newsletter.'),
            t('Dalja publike para shqyrtimit ligjor; formulime këshille investimi; postimi nga llogaria e gabuar; një treg reklame i pamatur që çon në të ardhura të premtuara tepër.', 'Going public before legal review; investment-advice wording; posting from the wrong account; an unsized ad market leading to over-promised revenue.'),
          ],
        ],
      },
      {
        kind: 'prose',
        text: t(
          'Pasojat për veprimtarinë aktuale. Botimi është nënshkruar nga Dr Alban Gj. THIKA dhe rishikimi ligjor i mohimit të përgjegjësisë është i përfunduar. Përdorni tubacionin ekzistues MONITOR të Redaktorit të Lajmeve për lajmet e përditshme, dhe etiketoni vetëm ato zëra që e lëvizin materialisht një temë të Forecast, secili ende duke pasur nevojë për miratim ndërsa D6 është pezull. Qëndroni të paanshëm para 9 majit 2027. Linjat e ardhshme përfshijnë familjen publike të Forecast tashmë të dakorduar, një buletin, dhe LinkedIn e X sapo llogaritë dhe bazat ligjore të jenë gati — jo më parë.',
          'Implications for current operations. The edition is signed by Dr Alban Gj. THIKA and legal review of the disclaimer is complete. Use the existing News Editor MONITOR pipeline for daily news, and tag only those items that materially move a Forecast theme, each still needing approval while D6 is pending. Stay impartial before 9 May 2027. Prospective lines include the public Forecast family already agreed, a newsletter, and LinkedIn and X once accounts and legal bases are ready — not before.',
        ),
      },
    ],
  },
  {
    id: 'b4',
    heading: t('B4. Pasuritë e paluajtshme', 'B4. Real estate'),
    caption: t(
      'Shqipëria dhe Mali i Zi; kërkesa e shtyrë nga turizmi; ndërtimi dhe çmimet. Asnjë synim çmimi pasurie dhe asnjë këshillë blerjeje apo shitjeje.',
      'Albania and Montenegro; tourism-driven demand; construction and prices. No property price targets and no buy/sell advice.',
    ),
    blocks: [
      {
        kind: 'prose',
        text: t(
          'Perspektiva dhe shtytësit. Ndërtimi dhe shërbimet kanë qenë kontribuuesit kryesorë të rritjes shqiptare në 2026, dhe turizmi mbetet një motor zyrtar i deklaruar. Rritja e çmimeve të banesave, megjithatë, është ftohur tashmë. CNA, duke raportuar anketën e banimit të Bankës së Shqipërisë për gjysmën e parë të 2026 (Raporti i Stabilitetit Financiar i asaj gjysme viti u botua më 23 shtator 2026), tha se indeksi Fisher i çmimeve të banesave ishte i pandryshuar nga gjysma e dytë e 2025 dhe në rritje 10% nga viti në vit, pas 28% në G2 2025 dhe 41.7% në G1 2025. Për Tiranën, i njëjti raport siç u përcoll nga CNA tha se çmimet ishin në rritje 10% ndaj gjysmës së mëparshme të vitit dhe 9% nga viti në vit. Koha mesatare e shitjes u zgjat në 9.9 muaj në shkallë kombëtare dhe 9.7 muaj në Tiranë, ndërsa kohët e shitjes në bregdet u shkurtuan në 8.2 muaj. Rreth 20% e shitjeve të banesave ishin për jorezidentë, nga të cilët rreth 85% ishin shtetas të BE. Guvernatori SEJKO tha më vonë se inflacioni i qirave u ngadalësua në tremujorin e tretë, gjë që ndihmoi të tërhiqej poshtë inflacioni kryesor në shtator. Ky botim nuk miraton një shteg çmimi për 2027 dhe nuk këshillon blerjen ose shitjen e pasurisë.',
          'Outlook and drivers. Construction and services have been primary contributors to Albanian growth in 2026, and tourism remains a stated official engine. House-price growth, however, has already cooled. CNA, reporting the Bank of Albania’s residential survey for the first half of 2026 (the Financial Stability Report of that half-year was published on 23 September 2026), said the Fisher house-price index was unchanged from the second half of 2025 and up 10% year on year, after 28% in H2 2025 and 41.7% in H1 2025. For Tirana, the same report as relayed by CNA said prices were up 10% on the previous half-year and 9% year on year. Average time to sell lengthened to 9.9 months nationally and 9.7 months in Tirana, while coastal selling times shortened to 8.2 months. About 20% of housing sales were to non-residents, of whom about 85% were EU citizens. Governor SEJKO later said rental inflation slowed in the third quarter, which helped pull headline inflation down in September. This edition does not adopt a 2027 price path and does not advise buying or selling property.',
        ),
      },
      {
        kind: 'table',
        columns: scenarioColumns,
        rows: [
          [
            t('Baza: rritje më e ngadaltë e çmimeve, kërkesë ende e mbështetur', 'Base: slower price growth, still-supported demand'),
            t('50% (gjykim)', '50% (judgment)'),
            t('Turizmi dhe ndërtimi mbajnë një dysheme nën veprimtari; rritja e çmimeve qëndron shumë më e ngadaltë se në 2025; kohët e shitjes qëndrojnë të gjata jashtë bregdetit.', 'Tourism and construction keep a floor under activity; price growth stays much slower than in 2025; selling times stay long outside the coast.'),
          ],
          [
            t('E favorshme: sezon më i gjatë, më shumë marreveshje formale', 'Upside: longer season, more formal deals'),
            t('15% (gjykim)', '15% (judgment)'),
            t('Nëse turizmi gjatë gjithë vitit dhe formalizimi thellohen, qarkullimi dhe kërkesa për shërbime profesionale përmirësohen, veçanërisht në bregdet.', 'If year-round tourism and formalisation deepen, turnover and professional services demand improve, especially on the coast.'),
          ],
          [
            t('E pafavorshme: ftohje e mëtejshme', 'Downside: further cooling'),
            t('25% (gjykim)', '25% (judgment)'),
            t('Kohë më të gjata shitjeje, kërkesë më e dobët për shtëpi të dyta, ose financim më i shtrënguar pas yield-eve më të larta evropiane i ulin transaksionet.', 'Longer selling times, weaker second-home demand, or tighter financing after higher European yields reduce transactions.'),
          ],
          [
            t('Goditje: energjia ose turizmi', 'Shock: energy or tourism hit'),
            t('10% (gjykim)', '10% (judgment)'),
            t('Një goditje e çmimit të karburantit ose e sigurisë që e ul udhëtimin do të godiste së pari kërkesën bregdetare dhe të qirasë së shkurtër.', 'A fuel-price or security shock that cuts travel would hit coastal and short-let demand first.'),
          ],
        ],
      },
      {
        kind: 'table',
        columns: leadColumns,
        rows: [
          [
            t('Anketa e çmimeve të banesave dhe e agjentëve e Bankës së Shqipërisë; ndërtimi dhe turizmi i INSTAT; normat e BQE dhe të Bankës së Shqipërisë; pesha e jorezidentëve në transaksione; publikimet e turizmit dhe të ndërtimit të Malit të Zi (faqja e MONSTAT nuk u hap në këtë botim).', 'Bank of Albania house-price and agents’ survey; INSTAT construction and tourism; ECB and Bank of Albania rates; non-resident share of transactions; Montenegro tourism and construction prints (MONSTAT page not opened in this edition).'),
            t('Ndërmjetësim dhe këshillim profesional në një treg më të ftohtë dhe më të përzgjedhur; shërbime pasurie të lidhura me turizmin; paketa pune ndërtimi me Jobs Hub dhe Akademinë.', 'Professional brokerage and advisory in a cooler, more selective market; tourism-linked property services; construction-labour packages with Jobs Hub and Academy.'),
            t('Të folurit e tregut lart; publikimi i parashikimeve të çmimeve pa burim; një peshë e madhe jorezidentësh që mund të kthehet nëse udhëtimi ose kërkesa e BE lëkundet; ngatërrimi i shërbimeve me këshillën e investimit.', 'Talking the market up; publishing unsourced price forecasts; a large non-resident share that can reverse if travel or EU demand wobbles; confusing services with investment advice.'),
          ],
        ],
      },
      {
        kind: 'prose',
        text: t(
          'Pasojat për veprimtarinë aktuale. Përshkruani kushtet dhe politikën; mos lëshoni synime çmimi kërkese apo gjuhë «bli tani». Përdorni anketa zyrtare, dhe etiketoni çdo të dhënë të brendshme shpalljesh si të brendshme. Linjat e ardhshme duhet të jenë shërbime (ndërmjetësim, bashkërendim i kujdesit të duhur, mbështetje e menaxhimit të pasurisë turistike), jo një indeks çmimi i pronarit derisa të ekzistojë një metodë. Një seri zyrtare e çmimeve të banimit të Malit të Zi nuk u gjet në këtë botim.',
          'Implications for current operations. Describe conditions and policy; do not issue asking-price targets or “buy now” language. Use official surveys, and label any internal listing data as internal. Prospective lines should be services (brokerage, due diligence coordination, tourism-property management support), not a proprietary price index until a method exists. An official Montenegro residential-price series was not found in this edition.',
        ),
      },
    ],
  },
  {
    id: 'b5',
    heading: t('B5. Shërbimet e biznesit, këshillimi dhe IA', 'B5. Business services, consulting and AI'),
    caption: t(
      'Përfshirë Nexus dhe NVRCX aty ku është e rëndësishme. Madhësia e tregut vendas të shërbimeve të IA: nuk u gjet.',
      'Including Nexus and NVRCX where relevant. Local AI-services market size: not found.',
    ),
    blocks: [
      {
        kind: 'prose',
        text: t(
          'Perspektiva dhe shtytësit. Të njëjtat forca që i japin formë linjave të tjera — anëtarësimi në BE, shtrëngimi i tregut të punës, formalizimi dhe një sfond më i vështirë energjie dhe financimi — e rrisin gjithashtu kërkesën për këshillë praktike: planifikim force pune, bashkërendim dokumentacioni, dixhitalizim procesesh dhe përdorim i kujdesshëm i mjeteve të IA. Nexus, si një sistem i brendshëm rastesh dhe komunikimesh, është një avantazh operativ nëse qëndron i saktë dhe i shqyrtuar nga njeriu. NVRCX mund të bëhet një linjë teknologjie tregtare, por ky botim nuk pohon një status nisjeje apo një shifër të ardhurash që nuk u verifikua këtu. Një vlerësim zyrtar i tregut shqiptar ose malazez të IA ose të këshillimit nuk u gjet.',
          'Outlook and drivers. The same forces that shape the other lines — EU accession, labour-market tightness, formalisation, and a more difficult energy and financing backdrop — also raise demand for practical advice: workforce planning, documentation coordination, process digitalisation, and careful use of AI tools. Nexus, as an internal case and communications system, is an operating advantage if it stays accurate and human-reviewed. NVRCX may become a commercial technology line, but this edition does not assert a launch status or a revenue figure that was not verified here. An official estimate of the Albanian or Montenegrin AI or consulting market was not found.',
        ),
      },
      {
        kind: 'table',
        columns: scenarioColumns,
        rows: [
          [
            t('Baza: këshillë e bashkangjitur te linjat qendrore', 'Base: advice attached to core lines'),
            t('50% (gjykim)', '50% (judgment)'),
            t('Punëdhënësit blejnë mbështetje force pune, të ndërgjegjshme për përputhshmërinë dhe dixhitalizimin si paketë me punët dhe formimin, jo si një bum më vete.', 'Employers buy workforce, compliance-aware and digitalisation support as a package with jobs and training, not as a standalone boom.'),
          ],
          [
            t('E favorshme: anëtarësimi dhe puna e sektorit publik', 'Upside: accession and public-sector work'),
            t('20% (gjykim)', '20% (judgment)'),
            t('Udhërrëfyesit e BE dhe projektet publike dixhitale krijojnë punë të paguar ndihme teknike në të dy vendet.', 'EU roadmaps and public digital projects create paid technical-assistance work in both countries.'),
          ],
          [
            t('E pafavorshme: buxhete të vonuara', 'Downside: delayed budgets'),
            t('20% (gjykim)', '20% (judgment)'),
            t('Një buxhet i vonuar i Malit të Zi ose shpenzim më i shtrënguar shqiptar i vonon kontratat publike; NVM-të e presin këshillimin të parin.', 'A late Montenegro budget or tighter Albanian spending delays public contracts; SMEs cut advisory first.'),
          ],
          [
            t('Goditje: dështim mjeti ose përputhshmërie', 'Shock: tool or compliance failure'),
            t('10% (gjykim)', '10% (judgment)'),
            t('Një produkt IA i parishikuar, ose këshillë që duket si këshillë ligjore ose investimi, krijon dëm ligjor dhe reputacional.', 'An unreviewed AI output, or advice that looks like legal or investment advice, creates legal and reputational damage.'),
          ],
        ],
      },
      {
        kind: 'table',
        columns: leadColumns,
        rows: [
          [
            t('Mbylljet e kapitujve të anëtarësimit; miratimi i buxhetit 2027 në të dy vendet; kërkesa e punëdhënësve e kaluar përmes Jobs Hub dhe Akademisë; cilësia e brendshme e Nexus (e pavlerësuar në këtë botim).', 'Accession chapter closures; 2027 budget adoption in both countries; employer demand routed through Jobs Hub and Academy; internal Nexus quality (not scored in this edition).'),
            t('Mbështetje e paketuar për punëdhënësin (punë plus aftësi plus proces); hartim procesesh i përafruar me BE; mjete IA të shqyrtuara nga njeriu për rrjedha të brendshme dhe, më vonë, për klientin.', 'Packaged employer support (labour plus skills plus process); EU-aligned process mapping; human-reviewed AI tools for internal and, later, client workflows.'),
            t('Mbi-shitja e IA; veprimi sikur të jesh i licencuar për të dhënë këshillë ligjore, tatimore ose investimi; nisja e një produkti teknologjie para se të jetë gati.', 'Overselling AI; acting as if licensed to give legal, tax or investment advice; launching a technology product before it is ready.'),
          ],
        ],
      },
      {
        kind: 'prose',
        text: t(
          'Pasojat për veprimtarinë aktuale. Shisni atë që grupi e bën tashmë mirë: lëvizshmërinë e punës, formimin dhe mbështetjen e dokumentuar të procesit. Mbani një shqyrtim njerëzor mbi çdo produkt të jashtëm të ndihmuar nga IA, në përputhje me metodën e dakorduar të Forecast. Linjat e ardhshme përfshijnë punë teknike të financuar nga BE ose nga donatorë, dixhitalizim të administratës publike në Shqipëri dhe në Mal të Zi, dhe një ofertë tregtare NVRCX vetëm kur statusi dhe kushtet e saj të jenë nënshkruar — e papohuar në këtë botim.',
          'Implications for current operations. Sell what the group already does well: labour mobility, training, and documented process support. Keep a human review on every AI-assisted external deliverable, in line with the agreed Forecast method. Prospective lines include EU-funded or donor technical work, public-administration digitalisation in Albania and Montenegro, and a commercial NVRCX offer only when its status and terms are signed off — not asserted in this edition.',
        ),
      },
    ],
  },
  {
    id: 'portfolio',
    heading: t('C. Portofoli, përparësitë dhe rreziqet', 'C. Portfolio, priorities and risks'),
    blocks: [
      {
        kind: 'prose',
        text: t(
          'Përmbledhje e portofolit. Në rastin bazë, lëvizshmëria e punës është bërthama e 2027, sepse të dhënat zyrtare tregojnë tashmë tregje të shtrënguara dhe sepse qendra e brendshme ka tashmë inventar të gjallë shqiptar dhe malazez. Akademia duhet të ulet pranë asaj bërthame, jo si një shpresë e veçantë. Media House është zëri publik i grupit dhe shtëpia e ardhshme e një Forecast të nënshkruar; nuk duhet t’i kërkohet të mbajë një parashikim reklame të pamatur. Pasuria e paluajtshme është një linjë e vërtetë shërbimesh e lidhur me turizmin, në një treg rritja e çmimeve të të cilit është ngadalësuar tashmë. Këshillimi dhe IA janë mundësues. Mali i Zi është strategjikisht i rëndësishëm — si pararendës i BE dhe si treg i Jobs Hub — por kuota, buxheti dhe masat e pagave të 2027 janë ende të pazgjidhura.',
          'Portfolio summary. In the base case, labour mobility is the 2027 core, because official data already show tight markets and because the internal hub already has live Albanian and Montenegrin inventory. The Academy should sit next to that core, not as a separate hope. Media House is the group’s public voice and the future home of a signed Forecast; it should not be asked to carry an unsized advertising forecast. Real estate is a real, tourism-linked services line in a market whose price growth has already slowed. Consulting and AI are enablers. Montenegro is strategically important — both as an EU frontrunner and as a Jobs Hub market — but its 2027 quota, budget and wage measures are still unsettled.',
        ),
      },
      {
        kind: 'table',
        columns: [
          t('Përparësia', 'Priority'),
          t('Hapi', 'Move'),
          t('Pse tani', 'Why now'),
          t('Kushti', 'Condition'),
        ],
        rows: [
          [
            t('P1', 'P1'),
            t('Stabilizoni inventarin e Jobs Hub dhe gatishmërinë e kuotës 2027 të Malit të Zi.', 'Stabilise Jobs Hub inventory and Montenegro 2027 quota readiness.'),
            t('Shpalljet e brendshme po anojnë tashmë drejt Shqipërisë dhe Malit të Zi, ndërsa ushqimi i Maltës është i ndenjur dhe afati i kuotës së Malit të Zi është i menjëhershëm.', 'Internal listings are already tilting toward Albania and Montenegro, while the Malta feed is stale and the Montenegro quota deadline is immediate.'),
            t('Verifikoni statusin e kuotës në Fletën Zyrtare para çdo pretendimi për klientin.', 'Verify the quota status in the Official Gazette before any client claim.'),
          ],
          [
            t('P2', 'P2'),
            t('Ndërtoni kurse të shkurtra të Akademisë rreth sektorëve zyrtarë me mungesë dhe bashkojini me vendosjen.', 'Build Academy short courses around official shortage sectors and bundle them with placement.'),
            t('Pagat dhe veprimtaria e ndërtimit/turizmit janë të dokumentuara; numrat e Akademisë nuk janë, ndaj oferta duhet të udhëhiqet nga prova dhe të jetë e matur.', 'Wages and construction/tourism activity are documented; Academy numbers are not, so the offer must be evidence-led and modest.'),
            t('Asnjë shkallë publike vendosjeje derisa të verifikohet.', 'No public placement rates until verified.'),
          ],
          [
            t('P3', 'P3'),
            t('Shqyrtimi ligjor i mohimit të përgjegjësisë është i përfunduar dhe botimi është nënshkruar nga Dr Alban Gj. THIKA.', 'Legal review of the disclaimer is complete and the edition is signed by Dr Alban Gj. THIKA.'),
            t('D5 është dakorduar; mesi i janarit 2027 është dritarja e parë publike e dakorduar; D6 ende kërkon miratim zë për zë.', 'D5 is agreed; mid-January 2027 is the agreed first public window; D6 still requires item-by-item approval.'),
            t('Rishikimi ligjor është i përfunduar. Nënshkruar nga Dr Alban Gj. THIKA më 18 nëntor 2026.', 'Legal review is complete. Signed by Dr Alban Gj. THIKA on 18 November 2026.'),
          ],
          [
            t('P4', 'P4'),
            t('Drejtojeni pasurinë e paluajtshme si linjë shërbimesh në një treg më të ftohtë, pa thirrje çmimi.', 'Run real estate as a services line in a cooler market, with no price calls.'),
            t('Të dhënat zyrtare të anketës tregojnë tashmë rritje vjetore më të ngadaltë të çmimeve dhe kohë më të gjata shitjeje.', 'Official survey data already show slower annual price growth and longer selling times.'),
            t('Asnjë gjuhë blerjeje/shitjeje apo synimi indeksi.', 'No buy/sell or index-target language.'),
          ],
          [
            t('P5', 'P5'),
            t('Ktheni në produkt këshillimin për punëdhënësin (punë, aftësi, proces), vetëm me IA të shqyrtuar nga njeriu.', 'Productise employer advisory (labour, skills, process), with human-reviewed AI only.'),
            t('Kërkesa ndjek shtrëngimin dhe përafrimin me BE; tregu i IA është i pamatur.', 'Demand follows tightness and EU alignment; the AI market is unmeasured.'),
            t('Asnjë këshillë ligjore, tatimore apo investimi.', 'No legal, tax or investment advice.'),
          ],
        ],
      },
      {
        kind: 'table',
        columns: [
          t('Rreziku', 'Risk'),
          t('Mundësia (gjykim)', 'Likelihood (judgment)'),
          t('Ndikimi', 'Impact'),
          t('Zbutja', 'Mitigation'),
        ],
        rows: [
          [
            t('Inflacioni i lidhur me energjinë dhe me Hormuzin pret turizmin, punësimin dhe qarkullimin e pasurisë', 'Energy and Hormuz-related inflation cuts tourism, hiring and property turnover'),
            t('Mesatare', 'Medium'),
            t('I lartë, në të gjitha linjat', 'High, across all lines'),
            t('Ndiqni Brent, TTF dhe karburantin vendas; planifikim skenarësh; mos i mbyllni kostot mbi një shteg energjie të pandryshuar.', 'Watch Brent, TTF and domestic fuel; scenario planning; do not lock costs on an unchanged energy path.'),
          ],
          [
            t('Kuota, buxheti ose masat e pagave të Malit të Zi për 2027 rrëshqasin ose befasojnë', 'Montenegro 2027 quota, budget or wage measures slip or surprise'),
            t('Mesatare–e lartë në afatin e afërt', 'Medium–high in the near term'),
            t('I lartë për Jobs Hub dhe Akademinë në Mal të Zi', 'High for Jobs Hub and Academy in Montenegro'),
            t('Verifikoni tekstet zyrtare; përgatitni dosjet e punëdhënësve; mos shisni vende që nuk ekzistojnë.', 'Verify official texts; prepare employer files; do not sell places that do not exist.'),
          ],
          [
            t('Produkti ose ndonjë koment publik lexohet si këshillë investimi', 'The product or any public comment is read as investment advice'),
            t('Mesatare nëse formulimi është i lirshëm', 'Medium if wording is loose'),
            t('I lartë ligjërisht dhe reputacionalisht', 'High legally and reputationally'),
            t('Mohim përgjegjësie; shqyrtim ligjor; asnjë gjuhë çmimi ose ndarjeje.', 'Disclaimer; legal review; no price or allocation language.'),
          ],
          [
            t('Anshmëri politike rreth 9 majit 2027', 'Political partiality around 9 May 2027'),
            t('Mesatare nëse është e pambrojtur', 'Medium if unguarded'),
            t('I lartë për Media House', 'High for Media House'),
            t('Rregulli i paanshmërisë; nënshkrimi i pronarit; asnjë pretendim politik pa burim.', 'Impartiality rule; owner sign-off; no unsourced political claims.'),
          ],
          [
            t('Operative: ushqime të ndenjura, lidhje e dobët e çështjes me vendin e lirë', 'Operational: stale feeds, weak case-to-vacancy linkage'),
            t('Tashmë e dukshme (e brendshme)', 'Already visible (internal)'),
            t('I lartë për të ardhurat e rekrutimit', 'High for recruitment revenue'),
            t('Ndreqni futjen e të dhënave; matni shkallët e plotësimit; mos tregtoni inventar të vdekur.', 'Fix ingestion; measure fill rates; do not market dead inventory.'),
          ],
          [
            t('Të dhëna të holla zyrtare ose të brendshme mbushen me shifra të shpikura', 'Thin official or internal data is filled with invented figures'),
            t('Rrezik procesi', 'Process risk'),
            t('I lartë', 'High'),
            t('Citoni ose hiqni; ky botim i lë tashmë boshllëqet bosh.', 'Cite or omit; this edition already leaves gaps blank.'),
          ],
        ],
      },
    ],
  },
  {
    id: 'watch',
    heading: t('Lista e vëzhgimit 2027', '2027 watch-list'),
    caption: t(
      'Ora e Tiranës. Zërat me shkrim të pjerrët u shënuan në monitorimin e brendshëm dhe ende kanë nevojë për konfirmim zyrtar.',
      'Tirana time. Items in italics were flagged in internal monitoring and still need official confirmation.',
      ['monitorim i brendshëm', 'e brendshme'],
      ['internal monitoring', 'internal'],
    ),
    blocks: [
      {
        kind: 'table',
        columns: [
          t('Kur', 'When'),
          t('Çfarë të ndiqet', 'What to watch'),
          t('Pse ka rëndësi', 'Why it matters'),
        ],
        rows: [
          [
            t('Deri më 30 nëntor 2026', 'By 30 November 2026'),
            t(
              'Kuota e punëtorëve të huaj e Malit të Zi për 2027 (monitorim i brendshëm: ende e pamiratuar; afati ligjor i cituar si 30 nëntor).',
              'Montenegro 2027 foreign-worker quota (internal monitoring: not yet adopted; legal deadline cited as 30 Nov).',
              ['monitorim i brendshëm: ende e pamiratuar; afati ligjor i cituar si 30 nëntor'],
              ['internal monitoring: not yet adopted; legal deadline cited as 30 Nov'],
            ),
            t('Planifikimi i Jobs Hub dhe i NOVARIC® DOO (7810).', 'Jobs Hub and NOVARIC® DOO (7810) planning.'),
          ],
          [
            t('Nëntor–dhjetor 2026', 'November–December 2026'),
            t(
              'Kalimi i buxhetit 2027 të Shqipërisë; miratimi i buxhetit 2027 të Malit të Zi (e brendshme: afati i 15 nëntorit i humbur). Masat e pagave Euro Model, nëse miratohen.',
              'Albania 2027 budget passage; Montenegro 2027 budget adoption (internal: 15 Nov deadline missed). Euro Model wage measures, if adopted.',
              ['e brendshme: afati i 15 nëntorit i humbur'],
              ['internal: 15 Nov deadline missed'],
            ),
            t('Shpenzimi publik, pagat, kostot e punëdhënësit.', 'Public spending, wages, employer costs.'),
          ],
          [
            t('Fundi i 2026', 'End of 2026'),
            t('Mbylljet e kapitujve të Malit të Zi, me kusht të shteteve anëtare, siç është vendosur në Paketën e Zgjerimit të 4 nëntorit.', 'Montenegro chapter closures, subject to Member States, as set out in the 4 November Enlargement Package.'),
            t('Erë mbështetëse e anëtarësimit, kërkesë këshillimore, histori mediatike.', 'Accession tailwind, advisory demand, media story.'),
          ],
          [
            t('Mesi i janarit 2027', 'Mid-January 2027'),
            t('NOVARIC® Forecast 2027, botimi i parë publik.', 'First public NOVARIC® Forecast 2027.'),
            t('Rruga e dakorduar e nisjes (D2).', 'Agreed launch path (D2).'),
          ],
          [
            t('Fillimi i 2027', 'Early 2027'),
            t('Publikimet e fundvitit të INSTAT dhe të MONSTAT për punën, pagat, turizmin dhe PBB; anketa e çmimeve të banesave e Bankës së Shqipërisë për G2 2026.', 'INSTAT and MONSTAT year-end labour, wage, tourism and GDP prints; Bank of Albania H2 2026 house-price survey.'),
            t('Kontrolli i parë zyrtar mbi bazën e 2026.', 'First official check on the 2026 base.'),
          ],
          [
            t('Prill 2027', 'April 2027'),
            t('Përditësimi tremujor i Forecast; vëzhgim para zgjedhjeve.', 'Quarterly Forecast update; pre-election watch.'),
            t('Fushata e zgjedhjeve vendore.', 'Local elections campaign.'),
          ],
          [
            t('9 maj 2027', '9 May 2027'),
            t('Zgjedhjet vendore të Shqipërisë.', 'Albania local elections.'),
            t('Mbulim i paanshëm; efektet e investimit dhe të punësimit bashkiak më vonë.', 'Impartial coverage; municipal investment and hiring effects later.'),
          ],
          [
            t('Vera 2027', 'Summer 2027'),
            t('Ardhjet e turistëve kundrejt synimit qeveritar prej 15.5 milionë ardhjesh të huaja; çmimet e energjisë në sezonin e lartë.', 'Tourism arrivals versus the government’s 15.5 million foreign-arrival target; energy prices into the high season.'),
            t('Kërkesa për punë, Akademinë, pasurinë e paluajtshme dhe medianë.', 'Jobs, Academy, real estate and media demand.'),
          ],
          [
            t('Vjeshta 2027', 'Autumn 2027'),
            t('Paketa e Zgjerimit 2027 e Komisionit; draftet e buxhetit 2028; parashikimi i vjeshtës 2027 i KE.', 'Commission Enlargement Package 2027; 2028 budget drafts; EC Autumn 2027 forecast.'),
            t('Nëse objektivi i negociatave të 2027 mbetet i gjallë.', 'Whether the 2027 negotiation objective remains live.'),
          ],
        ],
      },
    ],
  },
  {
    id: 'next',
    heading: t('Hapat e ardhshëm', 'Next steps'),
    blocks: [
      {
        kind: 'steps',
        steps: [
          {
            title: t('Plotësoni boshllëqet e të dhënave, dhjetor 2026', 'Close the data gaps, December 2026'),
            detail: t(
              'Verifikoni kuotën dhe buxhetin e Malit të Zi në tekste zyrtare; plotësoni boshllëqet e të dhënave të listuara më poshtë; shtoni shifra të brendshme të verifikuara të Akademisë dhe të Media House nëse ekzistojnë.',
              'Verify Montenegro quota and budget in official texts; fill the data gaps listed below; add verified Academy and Media House internal figures if they exist.',
            ),
          },
          {
            title: t('Veproni kundrejt P1–P5 tani, brenda', 'Operate against P1–P5 now, internally'),
            detail: t(
              'Ndreqni ushqimet e Jobs Hub; përgatitni dosjet e punëdhënësve të Malit të Zi; skiconi kurset e Akademisë për sektorët me mungesë; mbani gjuhën e pasurisë së paluajtshme dhe të këshillimit brenda rregullit pa këshillë.',
              'Fix Jobs Hub feeds; prepare Montenegro employer files; sketch Academy shortage-sector courses; keep real-estate and consulting language inside the no-advice rule.',
            ),
          },
          {
            title: t('Botimi i parë publik, mesi i janarit 2027', 'First public edition, mid-January 2027'),
            detail: t(
              'Rishikimi ligjor është i përfunduar dhe teksti është nënshkruar nga Dr Alban Gj. THIKA. Derisa D6 të zgjidhet, buletinet javore dhe zërat e përditshëm të etiketuar Forecast kanë ende nevojë për miratimin e tij.',
              'Legal review is complete and the text is signed by Dr Alban Gj. THIKA. Until D6 is settled, weeklies and Forecast-tagged daily items still need his approval.',
            ),
          },
        ],
      },
    ],
  },
  {
    id: 'disclaimer',
    heading: t('Mohimi i përgjegjësisë', 'Disclaimer'),
    caption: t(
      'Mohimi i përgjegjësisë i këtij botimi.',
      'Disclaimer of this edition.',
    ),
    blocks: [
      {
        kind: 'callout',
        tone: 'info',
        text: t(
          'NOVARIC® Forecast është një botim redaktorial dhe i planifikimit të brendshëm i NOVARIC® Sh.A., Tiranë, dhe, aty ku lëshohet një botim për Malin e Zi, i NOVARIC® DOO, Podgoricë. Ai ofron një pasqyrë të përgjithshme ekonomike, të tregut të punës dhe politike, dhe një lexim operacional për linjat e biznesit të NOVARIC®, vetëm për informim. NOVARIC® Sh.A. dhe NOVARIC® DOO nuk janë këshilltarë të licencuar investimesh dhe nuk ofrojnë këshillë investimi, ligjore, tatimore apo kontabël. Asgjë në këtë botim nuk është ofertë, kërkesë, apo rekomandim për të blerë, shitur apo mbajtur ndonjë letër me vlerë, valutë, mall, fond, pasuri apo aktiv tjetër, apo për të marrë ndonjë vendim të caktuar punësimi, formimi apo tregtar. Shifrat merren nga burime zyrtare ose të identifikuara ndryshe, aktuale në datën e deklaruar të prerjes (ora e Tiranës), dhe mund të rishikohen më vonë nga ato burime. Shifrat operacionale të brendshme etiketohen si të tilla dhe nuk janë statistika zyrtare. Skenarët dhe çdo probabilitet në këtë draft janë gjykime redaktoriale në një tekst të panënshkruar, jo parashikime të një rezultati të garantuar, dhe mund të ndryshojnë pa njoftim. Marrësit duhet të marrin këshillën e tyre profesionale.',
          'NOVARIC® Forecast is an editorial and internal planning publication of NOVARIC® Sh.A., Tirana, and, where a Montenegro edition is issued, of NOVARIC® DOO, Podgorica. It offers a general economic, labour-market and political overview, and an operational reading for NOVARIC® lines of business, for information only. NOVARIC® Sh.A. and NOVARIC® DOO are not licensed investment advisers and do not provide investment, legal, tax or accounting advice. Nothing in this publication is an offer, a solicitation, or a recommendation to buy, sell or hold any security, currency, commodity, fund, property or other asset, or to take any particular employment, training or commercial decision. Figures are taken from official or otherwise identified sources, current as of the stated cut-off date (Tirana time), and may later be revised by those sources. Internal operational figures are labelled as such and are not official statistics. Scenarios and any probabilities in this draft are editorial judgments in an unsigned text, not forecasts of a guaranteed outcome, and may change without notice. Recipients should take their own professional advice.',
        ),
      },
    ],
  },
  {
    id: 'gaps',
    heading: t('Boshllëqet e të dhënave', 'Data gaps'),
    caption: t(
      'Të lëna bosh me qëllim. Mos i mbushni këto me vlerësime.',
      'Left blank on purpose. Do not fill these with estimates.',
    ),
    blocks: [
      {
        kind: 'gaps',
        columns: [
          t('Boshllëku', 'Gap'),
          t('Pse ka rëndësi', 'Why it matters'),
          t('Si mbyllet', 'How to close it'),
        ],
        rows: [
          {
            gap: t('Aneksi statistikor zyrtar i vjeshtës 2026 i KE për Shqipërinë dhe Malin e Zi nuk u hap; rreshtat e Malit të Zi përtej titullit të Nova janë të paplota.', 'Official EC Autumn 2026 statistical annex for Albania and Montenegro was not opened; Montenegro lines beyond the Nova headline are incomplete.'),
            why: t('Komisioni është një krahasues qendror.', 'The Commission is a core comparator.'),
            how: t('Shkarkoni aneksin zyrtar para botimit të nënshkruar.', 'Download the official annex before the signed edition.'),
          },
          {
            gap: t('Publikimet kumulative të MONSTAT për turizmin, pagat dhe papunësinë e 2026 nuk u hapën.', 'MONSTAT cumulative 2026 tourism, wage and unemployment prints were not opened.'),
            why: t('Mali i Zi është një vend qendror.', 'Montenegro is a core country.'),
            how: t('Hapni publikimet parësore të MONSTAT dhe të CBCG.', 'Open MONSTAT and CBCG primary releases.'),
          },
          {
            gap: t('Vëllimet zyrtare të lejeve të punës për të huajt në Shqipëri dhe teksti ligjor i çdo shfuqizimi të kuotës së 2025 nuk u verifikuan kundrejt Fletës Zyrtare.', 'Official Albania foreign-work-permit volumes and the legal text of any 2025 quota repeal were not verified against the Official Gazette.'),
            why: t('Qendrore për kapitullin e punës.', 'Central to the labour chapter.'),
            how: t('Kontroll i AKPA / Fletës Zyrtare.', 'AKPA / Official Gazette check.'),
          },
          {
            gap: t('Totalet e buxhetit 2027 të Malit të Zi dhe vendimi përfundimtar i pagave Euro Model nuk u gjetën.', 'Montenegro 2027 budget totals and the final Euro Model wage decision were not found.'),
            why: t('Kostot e punëdhënësit dhe kërkesa publike.', 'Employer costs and public demand.'),
            how: t('Ndiqni kabinetin dhe parlamentin në fund të nëntorit 2026.', 'Watch cabinet and parliament in late November 2026.'),
          },
          {
            gap: t('Madhësia zyrtare e tregut të reklamës për Shqipërinë dhe Malin e Zi: nuk u gjet.', 'Official advertising-market size for Albania and Montenegro: not found.'),
            why: t('Planifikimi i të ardhurave të Media House.', 'Media House revenue planning.'),
            how: t('Kërkoni të dhëna të IAB, të rregullatorit ose të administratës tatimore, ose lëreni të pasasishme.', 'Seek IAB, regulator or tax-administration data, or leave unquantified.'),
          },
          {
            gap: t('Seria zyrtare e çmimeve të banimit të Malit të Zi: nuk u gjet. Shifrat e çmimeve të banesave të Bankës së Shqipërisë u morën përmes CNA, jo nga vetë PDF.', 'Official Montenegro residential price series: not found. Bank of Albania house-price figures were taken via CNA, not from the PDF itself.'),
            why: t('Cilësia e kapitullit të pasurisë së paluajtshme.', 'Real-estate chapter quality.'),
            how: t('Nxirrni PDF e Raportit të Stabilitetit Financiar të BSh; kërkoni ekuivalentë të CBCG ose të MONSTAT.', 'Extract the BoA Financial Stability Report PDF; seek CBCG or MONSTAT equivalents.'),
          },
          {
            gap: t('Regjistrimi, përfundimi dhe vendosja e Akademisë: të paverifikuara në kuti. Audienca dhe të ardhurat nga reklama e Media House: të papërpiluara këtu.', 'Academy enrolment, completion and placement: not verified on the box. Media House audience and advertising revenue: not compiled here.'),
            why: t('Planifikim i brendshëm.', 'Internal planning.'),
            how: t('Tërhiqni seri të brendshme të verifikuara, të etiketuara si të brendshme.', 'Pull verified internal series, labelled internal.'),
          },
          {
            gap: t('Një përditësim i sasishëm i 2026 mbi derdhjen e drejtpërdrejtë të Ukrainës në Shqipëri dhe në Mal të Zi: nuk u gjet.', 'A quantified 2026 update on Ukraine’s direct spillover into Albania and Montenegro: not found.'),
            why: t('Kapitulli i rrezikut të jashtëm.', 'External-risk chapter.'),
            how: t('Përdorni publikime zyrtare të energjisë, të refugjatëve dhe të tregtisë nëse ekzistojnë; përndryshe mbajeni cilësore.', 'Use official energy, refugee and trade prints if they exist; otherwise keep it qualitative.'),
          },
        ],
      },
    ],
  },
  {
    id: 'sources',
    heading: t('Burimet', 'Sources'),
    caption: t(
      'Të hapura ose të tërhequra më 18 nëntor 2026, ora e Tiranës. Nuk përdoret asnjë shifër pa burim.',
      'Opened or fetched on 18 November 2026, Tirana time. No unsourced figures are used.',
    ),
    blocks: [
      {
        kind: 'sources',
        items: [
          { label: t('Parashikimi i vjeshtës 2026 i KE', 'EC Autumn 2026 forecast'), href: 'https://economy-finance.ec.europa.eu/economic-forecast-and-surveys/economic-forecasts/autumn-2026-economic-forecast-shows-continued-growth-amid-higher-inflation_en', value: t('https://economy-finance.ec.europa.eu/economic-forecast-and-surveys/economic-forecasts/autumn-2026-economic-forecast-shows-continued-growth-amid-higher-inflation_en', 'https://economy-finance.ec.europa.eu/economic-forecast-and-surveys/economic-forecasts/autumn-2026-economic-forecast-shows-continued-growth-amid-higher-inflation_en') },
          { label: t('KE CCEQ T3 2026', 'EC CCEQ Q3 2026'), href: 'https://economy-finance.ec.europa.eu/document/download/ad01647e-6dbf-4568-b15e-9805f8d5b8d8_en?filename=tp091_en.pdf', value: t('https://economy-finance.ec.europa.eu/document/download/ad01647e-6dbf-4568-b15e-9805f8d5b8d8_en?filename=tp091_en.pdf', 'https://economy-finance.ec.europa.eu/document/download/ad01647e-6dbf-4568-b15e-9805f8d5b8d8_en?filename=tp091_en.pdf') },
          { label: t('Paketa e Zgjerimit e KE, 4 nëntor 2026', 'EC Enlargement Package, 4 Nov 2026'), href: 'https://ec.europa.eu/commission/presscorner/api/files/document/print/en/ip_26_2325/IP_26_2325_EN.pdf', value: t('https://ec.europa.eu/commission/presscorner/api/files/document/print/en/ip_26_2325/IP_26_2325_EN.pdf', 'https://ec.europa.eu/commission/presscorner/api/files/document/print/en/ip_26_2325/IP_26_2325_EN.pdf') },
          { label: t('Rritja e Shqipërisë/Malit të Zi sipas KE, siç raportohet nga Nova, 17 nëntor 2026', 'EC Albania/Montenegro growth as reported by Nova, 17 Nov 2026'), href: 'https://www.agenzianova.com/news/albania-commissione-ue-crescita-al-34-per-cento-nel-2026-e-al-33-nel-2027/', value: t('https://www.agenzianova.com/news/albania-commissione-ue-crescita-al-34-per-cento-nel-2026-e-al-33-nel-2027/', 'https://www.agenzianova.com/news/albania-commissione-ue-crescita-al-34-per-cento-nel-2026-e-al-33-nel-2027/') },
          { label: t('FMN Shqipëria përmes ATA, 13 tetor 2026', 'IMF Albania via ATA, 13 Oct 2026'), href: 'https://en.ata.gov.al/2026/10/13/imf-raises-albanias-2026-growth-forecast-to-3-5-sees-inflation-at-3-2/', value: t('https://en.ata.gov.al/2026/10/13/imf-raises-albanias-2026-growth-forecast-to-3-5-sees-inflation-at-3-2/', 'https://en.ata.gov.al/2026/10/13/imf-raises-albanias-2026-growth-forecast-to-3-5-sees-inflation-at-3-2/') },
          { label: t('FMN WEO tetor 2026', 'IMF WEO October 2026'), href: 'https://www.imf.org/en/publications/weo/issues/2026/10/13/world-economic-outlook-october-2026', value: t('https://www.imf.org/en/publications/weo/issues/2026/10/13/world-economic-outlook-october-2026', 'https://www.imf.org/en/publications/weo/issues/2026/10/13/world-economic-outlook-october-2026') },
          { label: t('FMN Mali i Zi përmes MINA, 13 tetor 2026', 'IMF Montenegro via MINA, 13 Oct 2026'), href: 'https://mina.news/en/article/imf-montenegros-economy-to-grow-by-3-percent-this-year', value: t('https://mina.news/en/article/imf-montenegros-economy-to-grow-by-3-percent-this-year', 'https://mina.news/en/article/imf-montenegros-economy-to-grow-by-3-percent-this-year') },
          { label: t('Banka Botërore RER nr. 30, 27 tetor 2026', 'World Bank RER No. 30, 27 Oct 2026'), href: 'https://www.worldbank.org/en/news/press-release/2026/10/27/western-balkans-growth-set-to-accelerate-with-lower-trade-costs-key-to-more-jobs', value: t('https://www.worldbank.org/en/news/press-release/2026/10/27/western-balkans-growth-set-to-accelerate-with-lower-trade-costs-key-to-more-jobs', 'https://www.worldbank.org/en/news/press-release/2026/10/27/western-balkans-growth-set-to-accelerate-with-lower-trade-costs-key-to-more-jobs') },
          { label: t('Fletëfakti i Bankës Botërore për Shqipërinë', 'World Bank Albania factsheet'), href: 'https://thedocs.worldbank.org/en/doc/fb6ed0672ae6ee639c673f46f5f5972c-0080012026/original/WBRER-FACTSHEET-ALBANIA-ENG.pdf', value: t('https://thedocs.worldbank.org/en/doc/fb6ed0672ae6ee639c673f46f5f5972c-0080012026/original/WBRER-FACTSHEET-ALBANIA-ENG.pdf', 'https://thedocs.worldbank.org/en/doc/fb6ed0672ae6ee639c673f46f5f5972c-0080012026/original/WBRER-FACTSHEET-ALBANIA-ENG.pdf') },
          { label: t('Fletëfakti i Bankës Botërore për Malin e Zi', 'World Bank Montenegro factsheet'), href: 'https://thedocs.worldbank.org/en/doc/d7183fca3737aa32375f3d27a316d272-0080012026/original/WBRER-FACTSHEET-MONTENEGRO-ENG.pdf', value: t('https://thedocs.worldbank.org/en/doc/d7183fca3737aa32375f3d27a316d272-0080012026/original/WBRER-FACTSHEET-MONTENEGRO-ENG.pdf', 'https://thedocs.worldbank.org/en/doc/d7183fca3737aa32375f3d27a316d272-0080012026/original/WBRER-FACTSHEET-MONTENEGRO-ENG.pdf') },
          { label: t('Vendimi i normës i Bankës së Shqipërisë, 3 nëntor 2026', 'Bank of Albania rate decision, 3 Nov 2026'), href: 'https://www.bankofalbania.org/Press/Supervisory_Council_decisions/SC_decisions_on_key_interest_rate/Document_Title_47906_1.html', value: t('https://www.bankofalbania.org/Press/Supervisory_Council_decisions/SC_decisions_on_key_interest_rate/Document_Title_47906_1.html', 'https://www.bankofalbania.org/Press/Supervisory_Council_decisions/SC_decisions_on_key_interest_rate/Document_Title_47906_1.html') },
          { label: t('Guvernatori SEJKO, ATA, 3 nëntor 2026', 'Governor SEJKO, ATA, 3 Nov 2026'), href: 'https://en.ata.gov.al/2026/11/03/sejko-steady-economic-growth-is-expected-paired-with-a-modest-rise-in-inflation/', value: t('https://en.ata.gov.al/2026/11/03/sejko-steady-economic-growth-is-expected-paired-with-a-modest-rise-in-inflation/', 'https://en.ata.gov.al/2026/11/03/sejko-steady-economic-growth-is-expected-paired-with-a-modest-rise-in-inflation/') },
          { label: t('Kurset zyrtare të lekut, 17 nëntor 2026', 'Official lek rates, 17 Nov 2026'), href: 'https://www.bankofalbania.org/Markets/Official_exchange_rate', value: t('https://www.bankofalbania.org/Markets/Official_exchange_rate', 'https://www.bankofalbania.org/Markets/Official_exchange_rate') },
          { label: t('Raporti i Stabilitetit Financiar i BSh, G1 2026', 'BoA Financial Stability Report, H1 2026'), href: 'https://www.bankofalbania.org/Botime/Botime_Periodike/Raporti_i_Stabilitetit_Financiar/Raporti_i_Stabilitetit_Financiar_p_e_r_gjasht_e_mujorin_e_par_e_t_e_vitit_2026.html', value: t('https://www.bankofalbania.org/Botime/Botime_Periodike/Raporti_i_Stabilitetit_Financiar/Raporti_i_Stabilitetit_Financiar_p_e_r_gjasht_e_mujorin_e_par_e_t_e_vitit_2026.html', 'https://www.bankofalbania.org/Botime/Botime_Periodike/Raporti_i_Stabilitetit_Financiar/Raporti_i_Stabilitetit_Financiar_p_e_r_gjasht_e_mujorin_e_par_e_t_e_vitit_2026.html') },
          { label: t('Çmimet e banesave siç raportohen nga ajo anketë', 'House prices as reported from that survey'), href: 'https://www.cna.al/english/ekonomi/rritja-e-cmimeve-te-banesave-u-frenua-ne-gjysmen-e-pare-te-2026-i474998', value: t('https://www.cna.al/english/ekonomi/rritja-e-cmimeve-te-banesave-u-frenua-ne-gjysmen-e-pare-te-2026-i474998', 'https://www.cna.al/english/ekonomi/rritja-e-cmimeve-te-banesave-u-frenua-ne-gjysmen-e-pare-te-2026-i474998') },
          { label: t('Normat e BQE, 29 tetor 2026', 'ECB rates, 29 Oct 2026'), href: 'https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp261029~9a493adf17.en.html', value: t('https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp261029~9a493adf17.en.html', 'https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp261029~9a493adf17.en.html') },
          { label: t('Remitancat, ATA, 10 shtator 2026', 'Remittances, ATA, 10 Sep 2026'), href: 'https://en.ata.gov.al/2026/09/10/remittances-hit-621-million-euros-in-first-half-of-2026/', value: t('https://en.ata.gov.al/2026/09/10/remittances-hit-621-million-euros-in-first-half-of-2026/', 'https://en.ata.gov.al/2026/09/10/remittances-hit-621-million-euros-in-first-half-of-2026/') },
          { label: t('Pagat e INSTAT, ATA, 10 shtator 2026', 'INSTAT wages, ATA, 10 Sep 2026'), href: 'https://en.ata.gov.al/2026/09/10/instat-albanias-average-wage-rises-9-8-to-92150-leks/', value: t('https://en.ata.gov.al/2026/09/10/instat-albanias-average-wage-rises-9-8-to-92150-leks/', 'https://en.ata.gov.al/2026/09/10/instat-albanias-average-wage-rises-9-8-to-92150-leks/') },
          { label: t('Puna e INSTAT, ATA, 10 shtator 2026', 'INSTAT labour, ATA, 10 Sep 2026'), href: 'https://en.ata.gov.al/2026/09/10/instat-unemployment-drops-to-8-3-in-second-quarter-of-2026/', value: t('https://en.ata.gov.al/2026/09/10/instat-unemployment-drops-to-8-3-in-second-quarter-of-2026/', 'https://en.ata.gov.al/2026/09/10/instat-unemployment-drops-to-8-3-in-second-quarter-of-2026/') },
          { label: t('Ardhjet e INSTAT, ATA, 23 tetor 2026', 'INSTAT arrivals, ATA, 23 Oct 2026'), href: 'https://en.ata.gov.al/2026/10/23/albania-records-17-5-million-entries-through-september-including-10-7-million-foreign-nationals/', value: t('https://en.ata.gov.al/2026/10/23/albania-records-17-5-million-entries-through-september-including-10-7-million-foreign-nationals/', 'https://en.ata.gov.al/2026/10/23/albania-records-17-5-million-entries-through-september-including-10-7-million-foreign-nationals/') },
          { label: t('Buxheti draft 2027, ATA, 29 tetor 2026', 'Draft 2027 budget, ATA, 29 Oct 2026'), href: 'https://en.ata.gov.al/2026/10/29/government-forecasts-4-economic-growth-public-debt-falling-to-52-4-of-gdp-in-2027/', value: t('https://en.ata.gov.al/2026/10/29/government-forecasts-4-economic-growth-public-debt-falling-to-52-4-of-gdp-in-2027/', 'https://en.ata.gov.al/2026/10/29/government-forecasts-4-economic-growth-public-debt-falling-to-52-4-of-gdp-in-2027/') },
          { label: t('Të ardhurat e buxhetit, ATA, 5 nëntor 2026', 'Budget revenues, ATA, 5 Nov 2026'), href: 'https://en.ata.gov.al/2026/11/05/malaj-revenues-for-2027-budget-are-estimated-at-907-9-billion-leke/', value: t('https://en.ata.gov.al/2026/11/05/malaj-revenues-for-2027-budget-are-estimated-at-907-9-billion-leke/', 'https://en.ata.gov.al/2026/11/05/malaj-revenues-for-2027-budget-are-estimated-at-907-9-billion-leke/') },
          { label: t('Synimet e turizmit, ATA, 31 tetor 2026', 'Tourism targets, ATA, 31 Oct 2026'), href: 'https://en.ata.gov.al/2026/10/31/albania-projects-15-5-million-foreign-arrivals-in-2027-as-tourisms-contribution-to-gdp-increases/', value: t('https://en.ata.gov.al/2026/10/31/albania-projects-15-5-million-foreign-arrivals-in-2027-as-tourisms-contribution-to-gdp-increases/', 'https://en.ata.gov.al/2026/10/31/albania-projects-15-5-million-foreign-arrivals-in-2027-as-tourisms-contribution-to-gdp-increases/') },
          { label: t('Zgjedhjet vendore, ATA, 30 tetor 2026', 'Local elections, ATA, 30 Oct 2026'), href: 'https://en.ata.gov.al/2026/10/30/begaj-sets-9-may-2027-as-date-for-local-elections/', value: t('https://en.ata.gov.al/2026/10/30/begaj-sets-9-may-2027-as-date-for-local-elections/', 'https://en.ata.gov.al/2026/10/30/begaj-sets-9-may-2027-as-date-for-local-elections/') },
          {
            label: t('Pamja e brendshme e Jobs Hub, 18 nëntor 2026', 'Internal Jobs Hub snapshot, 18 Nov 2026'),
            value: t(
              'Të dhëna të brendshme të NOVARIC®. Pamja e Jobs Hub, 18 nëntor 2026, ora e Tiranës. Nuk është statistikë zyrtare.',
              'NOVARIC® internal data. Jobs Hub snapshot, 18 November 2026, Tirana time. Not official statistics.',
            ),
          },
        ],
      },
    ],
  },
  {
    id: 'decisions',
    heading: t('Shtojcë: regjistri i vendimeve', 'Appendix: decisions log'),
    caption: t(
      'Përgjigjet e marra më 18 nëntor 2026, ora 09:39 me orën e Tiranës (UTC+1). Të mbajtura nga dokumenti i qasjes. «Forcast» te D1 trajtohet si Forecast.',
      'Answers received 18 November 2026, 09:39 Tirana time (UTC+1). Retained from the approach paper. ‘Forcast’ in D1 is treated as Forecast.',
    ),
    blocks: [
      {
        kind: 'decisions',
        items: [
          {
            lead: 'D1',
            title: t('Emri i produktit dhe gjuhët', 'Product name and languages'),
            detail: t(
              'Fjala për fjalë: «NOVARIC® Forcast». E zbatuar si NOVARIC® Forecast / Parashikimi NOVARIC®. Anglishtja dhe shqipja janë çifti i punës. Një botim në gjuhën malazeze në vitin e parë nuk u vendos shprehimisht.',
              'Verbatim: ‘NOVARIC® Forcast’. Applied as NOVARIC® Forecast / Parashikimi NOVARIC®. English and Albanian are the working pair. A Montenegrin-language edition in year one was not explicitly decided.',
            ),
            status: t('Dakorduar (emri)', 'Agreed (name)'),
            tone: 'success',
          },
          {
            lead: 'D2',
            title: t('Data e nisjes', 'Launch date'),
            detail: t(
              'Fjala për fjalë: «as recomened». E miratuar: botimi i parë më 18 nëntor 2026; dritarja e mëparshme e dakorduar për një botim të mëtejshëm ishte mesi i janarit 2027.',
              'Verbatim: ‘as recomened’. Adopted: first edition on 18 November 2026; the earlier agreed window for a further edition was mid-January 2027.',
            ),
            status: t('Dakorduar', 'Agreed'),
            tone: 'success',
          },
          {
            lead: 'D3',
            title: t('Shtrirja gjeografike', 'Geographic scope'),
            detail: t(
              'Fjala për fjalë: «as recommended». Shqipëria dhe Mali i Zi si bërthama, me një kapitull derdhjeje të Ballkanit Perëndimor dhe të BE.',
              'Verbatim: ‘as recommended’. Albania and Montenegro as the core, with a Western Balkans and EU spillover chapter.',
            ),
            status: t('Dakorduar', 'Agreed'),
            tone: 'success',
          },
          {
            lead: 'D4',
            title: t('Nënshkruesi', 'Signatory'),
            detail: t(
              'Fjala për fjalë: «Dr Alban». Nënshkruesi: Dr Alban Gj. THIKA, si botues. Ky botim është nënshkruar nga Dr Alban Gj. THIKA.',
              'Verbatim: ‘Dr Alban’. Signatory: Dr Alban Gj. THIKA, as publisher. This edition is signed by Dr Alban Gj. THIKA.',
            ),
            status: t('Dakorduar', 'Agreed'),
            tone: 'success',
          },
          {
            lead: 'D5',
            title: t('Mohimi i përgjegjësisë dhe shqyrtimi ligjor', 'Disclaimer and legal review'),
            detail: t(
              'Fjala për fjalë: «Agreed». Rishikimi ligjor i mohimit të përgjegjësisë është i përfunduar, i konfirmuar nga Dr Alban Gj. THIKA më 18 nëntor 2026, ora 17:53 me orën e Tiranës.',
              'Verbatim: ‘Agreed’. Legal review of the disclaimer is complete, confirmed by Dr Alban Gj. THIKA at 17:53 Tirana time on 18 November 2026.',
            ),
            status: t('Dakorduar; rishikimi ligjor i përfunduar', 'Agreed; legal review complete'),
            tone: 'success',
          },
          {
            lead: 'D6',
            title: t('Rregulli i përhershëm i miratimit', 'Standing approval rule'),
            detail: t(
              'Fjala për fjalë: «Need approval». Ende pezull. Asnjë rregull i përhershëm. Çdo përmbledhje javore dhe çdo zë i përditshëm i etiketuar Forecast ka nevojë për miratimin e tij të freskët.',
              'Verbatim: ‘Need approval’. Still pending. No standing rule. Each weekly brief and Forecast-tagged daily item needs his fresh approval.',
            ),
            status: t('Pezull', 'Pending'),
            tone: 'warning',
          },
          {
            lead: 'D7',
            title: t('Kanalet', 'Channels'),
            detail: t(
              'Fjala për fjalë: «Across the board including all». Të gjitha kanalet e listuara janë në shtrirje për botimin publik të nënshkruar.',
              'Verbatim: ‘Across the board including all’. All listed channels are in scope for the signed public edition.',
            ),
            status: t('Dakorduar (të gjitha kanalet)', 'Agreed (all channels)'),
            tone: 'success',
          },
          {
            lead: 'D8',
            title: t('Të dhënat e brendshme', 'Internal data'),
            detail: t(
              'Fjala për fjalë: «Yes». Shifrat e brendshme të Jobs Hub në këtë botim janë të etiketuara si të brendshme.',
              'Verbatim: ‘Yes’. Internal Jobs Hub figures in this edition are labelled internal.',
            ),
            status: t('Po', 'Yes'),
            tone: 'success',
          },
          {
            lead: 'D9',
            title: t('Teza dhe skenarët', 'Thesis and scenarios'),
            detail: t(
              'Fjala për fjalë: «approved». Ky botim propozon një pyetje kornize, skenarë të emërtuar dhe probabilitete gjykuese, të nënshkruara nga Dr Alban Gj. THIKA.',
              'Verbatim: ‘approved’. This edition proposes a framing question, named scenarios and judgmental probabilities, signed by Dr Alban Gj. THIKA.',
            ),
            status: t('Metoda e miratuar; teksti i nënshkruar', 'Approved method; text signed'),
            tone: 'success',
          },
        ],
      },
      {
        kind: 'callout',
        tone: 'success',
        text: t(
          'Statusi: botimi i parë i Forecast 2027, 18 nëntor 2026, ora e Tiranës. I nënshkruar nga Dr Alban Gj. THIKA. Rishikimi ligjor i mohimit të përgjegjësisë është i përfunduar.',
          'Status: first Forecast 2027 edition, 18 November 2026, Tirana time. Signed by Dr Alban Gj. THIKA. Legal review of the disclaimer is complete.',
        ),
      },
    ],
  },
];
