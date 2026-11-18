/**
 * NOVARIC® Forecast 2027 — public draft text.
 * English strings are the 18 November 2026 paper. Albanian follows them.
 * No figure in this module is estimated. Missing series stay as data gaps.
 * Internal filesystem paths are not included. Jobs Hub counts are labelled
 * NOVARIC® internal data by the page that renders `internal: true`.
 */
import { forecastIndustrySections } from './forecast2027Industry';

export interface BiText {
  sq: string;
  en: string;
  /** Substrings already present in sq/en; the page renders them in italics. */
  italicSq?: string[];
  italicEn?: string[];
}

export interface ProseBlock {
  kind: 'prose';
  text: BiText;
  /** Jobs Hub operational counts. Render with the NOVARIC® internal-data label. */
  internal?: boolean;
}

export interface CalloutBlock {
  kind: 'callout';
  tone: 'warning' | 'info' | 'success';
  text: BiText;
}

export interface MetricItem {
  value: string;
  label: BiText;
  detail: BiText;
}

export interface MetricsBlock {
  kind: 'metrics';
  items: MetricItem[];
}

export interface TableBlock {
  kind: 'table';
  columns: BiText[];
  rows: BiText[][];
}

export interface StepItem {
  title: BiText;
  detail: BiText;
}

export interface StepsBlock {
  kind: 'steps';
  steps: StepItem[];
}

export interface GapRow {
  gap: BiText;
  why: BiText;
  how: BiText;
}

export interface GapsBlock {
  kind: 'gaps';
  columns: BiText[];
  rows: GapRow[];
}

export interface SourceItem {
  label: BiText;
  href?: string;
  value: BiText;
}

export interface SourcesBlock {
  kind: 'sources';
  items: SourceItem[];
}

export interface DecisionItem {
  lead: string;
  title: BiText;
  detail: BiText;
  status: BiText;
  tone: 'success' | 'warning';
}

export interface DecisionsBlock {
  kind: 'decisions';
  items: DecisionItem[];
}

export type ForecastBlock =
  | ProseBlock
  | CalloutBlock
  | MetricsBlock
  | TableBlock
  | StepsBlock
  | GapsBlock
  | SourcesBlock
  | DecisionsBlock;

export interface ForecastSection {
  id: string;
  heading: BiText;
  caption?: BiText;
  blocks: ForecastBlock[];
}

const t = (
  sq: string,
  en: string,
  italicSq?: string[],
  italicEn?: string[],
): BiText => ({ sq, en, italicSq, italicEn });

export const DATA_PENDING_LABEL = 'Pa të dhëna / Data pending';

export const FORECAST_PATH = '/forecast-2027';
export const FORECAST_PAGE_ID = 'forecast2027' as const;

export const forecastSummary: BiText = t(
  'Drafti i parë për shqyrtimin pilot të brendshëm. I panënshkruar. Një parashikim i shtëpisë për perspektivën e vitit 2027 për industritë e NOVARIC®, dhe çfarë do të thotë ai për veprimtarinë aktuale dhe të ardhshme të NOVARIC® Sh.A. dhe të NOVARIC® DOO. Prerja e të dhënave: 18 nëntor 2026, ora e Tiranës (UTC+1). Ky tekst nuk është këshillë investimi dhe nuk është publikuar, postuar apo dërguar.',
  'First draft for internal pilot review. Unsigned. A house forecast of the 2027 outlook for NOVARIC® industries, and what it means for current and prospective operations of NOVARIC® Sh.A. and NOVARIC® DOO. Data cut-off 18 November 2026, Tirana time (UTC+1). This is not investment advice and has not been published, posted or sent.',
);

export const forecastSections: ForecastSection[] = [
  {
    id: 'status',
    heading: t('Statusi dhe kufiri', 'Status and boundary'),
    caption: t(
      'Draft i përgatitur më 18 nëntor 2026, ora e Tiranës (UTC+1). Nënshkruesi: Dr Alban Gj. THIKA. Statusi: i panënshkruar.',
      'Draft prepared 18 November 2026, Tirana time (UTC+1). Signatory: Dr Alban Gj. THIKA. Status: unsigned.',
    ),
    blocks: [
      {
        kind: 'callout',
        tone: 'warning',
        text: t(
          'DRAFT vetëm për shqyrtimin pilot të brendshëm. Ky dokument është i panënshkruar. Nuk është botim publik, nuk është kërkim investimi dhe nuk është miratim për të dalë live. Asgjë nuk duhet të publikohet, të postohet apo të dërgohet derisa një këshilltar ligjor të ketë shqyrtuar mohimin e përgjegjësisë (D5) dhe Dr Alban Gj. THIKA të ketë nënshkruar një botim të caktuar.',
          'DRAFT for internal pilot review only. This paper is unsigned. It is not a public edition, not investment research, and not approval to go live. Nothing should be published, posted or sent until counsel has reviewed the disclaimer (D5) and Dr Alban Gj. THIKA has signed a specific edition.',
        ),
      },
      {
        kind: 'prose',
        text: t(
          'Më 18 nëntor 2026, në orën 09:53 me orën e Tiranës, Dr Alban Gj. THIKA kërkoi që dokumenti i dakorduar i qasjes të shndërrohet në parashikimin e vet të NOVARIC®, të lidhur me industritë e saj dhe me veprimtarinë aktuale dhe të ardhshme. Ky draft e bën këtë. Ai mbulon rekrutimin dhe lëvizshmërinë e punës (Jobs Hub i Shqipërisë dhe i Malit të Zi; NOVARIC® DOO, kodi i aktivitetit 7810), Akademinë, Media House, pasuritë e paluajtshme dhe këshillimin e biznesit, përfshirë shërbimet e inteligjencës artificiale dhe të teknologjisë (Nexus, NVRCX) aty ku është e rëndësishme.',
          'At 09:53 Tirana time on 18 November 2026, Dr Alban Gj. THIKA asked that the agreed approach paper be converted into NOVARIC®’s own forecast, relevant to its industries and to current and prospective business operations. This draft does that. It covers recruitment and labour mobility (Albania and Montenegro Jobs Hub; NOVARIC® DOO, activity code 7810), the Academy, Media House, real estate, and business consulting including AI and technology services (Nexus, NVRCX) where relevant.',
        ),
      },
      {
        kind: 'prose',
        text: t(
          'NOVARIC® Sh.A. dhe NOVARIC® DOO nuk janë këshilltarë të licencuar investimesh. Ky dokument nuk jep këshillë investimi, udhëzim për ndarjen e aktiveve, apo thirrje për blerje ose shitje të letrave me vlerë, valutave, mallrave, fondeve apo pasurisë. Parashikimet e palëve të treta (FMN, Banka Botërore, Komisioni Evropian, qeveria shqiptare) jepen si të tyret. Probabilitetet e skenarëve në këtë draft janë gjykime redaktoriale, jo një model statistikor, dhe mbeten të panënshkruara sipas D9 derisa Dr THIKA të nënshkruajë botimin. Çdo shifër më poshtë ka një burim. Aty ku një shifër nuk u gjet, kjo thuhet hapur.',
          'NOVARIC® Sh.A. and NOVARIC® DOO are not licensed investment advisers. This paper does not give investment advice, asset-allocation guidance, or buy/sell calls on securities, currencies, commodities, funds or property. Third-party forecasts (IMF, World Bank, European Commission, the Albanian government) are reported as theirs. Scenario probabilities in this draft are editorial judgments, not a statistical model, and remain unsigned under D9 until Dr THIKA signs the edition. Every figure below has a source. Where a figure was not found, that is stated.',
        ),
      },
    ],
  },
  {
    id: 'house-view',
    heading: t('Qëndrimi i shtëpisë', 'House view'),
    caption: t(
      'Gjykimi i draftit, i panënshkruar. Prerja e të dhënave: 18 nëntor 2026, ora e Tiranës.',
      'Draft judgment, unsigned. Data cut-off 18 November 2026, Tirana time.',
    ),
    blocks: [
      {
        kind: 'prose',
        text: t(
          'Pyetja e kornizës për vitin 2027: a mundet NOVARIC® të shndërrojë një treg pune rajonal të shtrënguar, një ekonomi turizmi që ende rritet dhe një rrugë të gjallë të anëtarësimit në BE në veprimtari më të thella te punësimi, aftësitë, media, shërbimet e pasurisë dhe puna këshillimore — pa u shtrirë tepër në këshillë të palicencuar apo në pretendime pa burim?',
          'Framing question for 2027: can NOVARIC® convert a tight regional labour market, a still-growing tourism economy and a live EU-accession path into deeper operations in jobs, skills, media, property services and advisory work — without over-extending into unlicensed advice or unsourced claims?',
        ),
      },
      {
        kind: 'prose',
        text: t(
          'Rasti bazë i draftit është që Shqipëria dhe Mali i Zi vazhdojnë të rriten më shpejt se zona e euros, që mungesat e punës dhe presioni mbi pagat vazhdojnë, dhe që turizmi mbetet një motor kryesor edhe pse rritja e hyrjeve të të huajve në Shqipëri është ngadalësuar në një ritëm më të matur. Rruga e Bashkimit Evropian është një erë mbështetëse strukturore, veçanërisht për Malin e Zi, të cilin Komisioni tani e vendos afër fazës së fundit të anëtarësimit. Rreziku kryesor i jashtëm është goditja energjetike dhe e sigurisë rreth Ngushticës së Hormuzit dhe konflikti më i gjerë në Lindjen e Mesme, të cilin parashikimi i vjeshtës 2026 i Komisionit e trajton tashmë si një fakt të perspektivës evropiane, jo si një ngjarje të skajshme. Zgjedhjet vendore të Shqipërisë më 9 maj 2027 do të rrisin zhurmën politike; ato nuk janë zgjedhje të përgjithshme parlamentare.',
          'The draft base case is that Albania and Montenegro keep growing faster than the euro area, that labour shortages and wage pressure persist, and that tourism remains a main engine even as the rise in Albanian foreign arrivals has slowed to a more moderate pace. The European Union path is a structural tailwind, especially for Montenegro, which the Commission now places close to the final stage of accession. The principal external risk is the energy and security shock around the Strait of Hormuz and the wider Middle East conflict, which the Commission’s Autumn 2026 forecast already treats as a fact of the European outlook, not a tail event. Albania’s local elections on 9 May 2027 will raise political noise; they are not a parliamentary general election.',
        ),
      },
      {
        kind: 'table',
        columns: [
          t('Skenari', 'Scenario'),
          t('Probabiliteti gjykues', 'Judgmental probability'),
          t('Çfarë do të thotë', 'What it would mean'),
        ],
        rows: [
          [
            t('Baza: konvergjencë e pabarabartë', 'Base: uneven convergence'),
            t('50% (gjykim)', '50% (judgment)'),
            t('Rritja qëndron në intervalin zyrtar rreth 3%; puna mbetet e shtrënguar; turizmi mbahet; bisedimet me BE-në ecin në mënyrë të pabarabartë; kërkesa për punësim, formim dhe pasuri mbetet ndërtuese, por jo e tepruar.', 'Growth stays in the official 3% range; labour stays tight; tourism holds up; EU talks advance unevenly; hiring, training and property demand remain constructive but not exuberant.'),
          ],
          [
            t('E favorshme: zbatim më i shpejtë', 'Upside: faster delivery'),
            t('20% (gjykim)', '20% (judgment)'),
            t('Mali i Zi mbyll kapitujt e mbetur dhe Shqipëria ruan vrullin e negociatave të vitit 2027; formalizimi dhe kërkesa për aftësi përshpejtohen; puna me punëdhënësit dhe me sektorin publik thellohet.', 'Montenegro closes remaining chapters and Albania keeps 2027 negotiation momentum; formalisation and skills demand accelerate; employer and public-sector work deepens.'),
          ],
          [
            t('E pafavorshme: rrëshqitje', 'Downside: slippage'),
            t('15% (gjykim)', '15% (judgment)'),
            t('Rrëshqitja e reformës ose e fiskut, një partner më i dobët i zonës së euros, ose vendime të vonuara të Malit të Zi për buxhetin, pagat dhe kuotën e punëtorëve të huaj të vitit 2027 ftohin punësimin dhe kontratat publike.', 'Reform or fiscal slippage, a weaker euro-area partner, or delayed Montenegro decisions on the 2027 budget, wages and foreign-worker quota cool hiring and public contracts.'),
          ],
          [
            t('Goditje e jashtme: energjia dhe siguria', 'External shock: energy and security'),
            t('15% (gjykim)', '15% (judgment)'),
            t('Një kërcim i ri i çmimeve të naftës, të karburantit ose të gazit, ose një goditje më e gjerë sigurie, ngre inflacionin, shtrëngon familjet dhe turizmin, dhe ul punësimin diskrecionar dhe qarkullimin e pasurisë.', 'A renewed jump in oil, fuel or gas prices, or a broader security shock, lifts inflation, squeezes households and tourism, and cuts discretionary hiring and property turnover.'),
          ],
        ],
      },
      {
        kind: 'prose',
        text: t(
          'Për grupin, pasoja operacionale e rastit bazë është që lëvizshmëria e punës dhe formimi profesional të trajtohen si franshiza qendrore e vitit 2027, Media House si zëri publik dhe si një kanal i ardhshëm i Forecast, pasuria e paluajtshme si një linjë shërbimesh e lidhur me turizmin dhe ndërtimin (jo një biznes thirrjesh çmimi), dhe këshillimi e mjetet e IA si mundësues të atyre linjave.',
          'For the group, the operational implication of the base case is to treat labour mobility and vocational training as the core 2027 franchise, Media House as the public voice and a future Forecast channel, real estate as a tourism- and construction-linked services line (not a price-call business), and consulting and AI tools as enablers of those lines.',
        ),
      },
    ],
  },
  {
    id: 'macro',
    heading: t('A. Sfondi makro', 'A. Macro backdrop'),
    caption: t(
      'Shqipëria, Mali i Zi dhe Ballkani Perëndimor. Të gjitha shifrat e rritjes dhe të inflacionit janë të institucionit të emërtuar, jo një parashikim i NOVARIC®.',
      'Albania, Montenegro and the Western Balkans. All growth and inflation figures are the named institution’s, not a NOVARIC® forecast.',
    ),
    blocks: [
      {
        kind: 'metrics',
        items: [
          {
            value: '3.2–3.6%',
            label: t('PBB e Shqipërisë, 2027', 'Albania GDP, 2027'),
            detail: t('FMN 3.2%; KE (përmes Nova) 3.3%; Banka Botërore 3.6%; qeveria 4.0%', 'IMF 3.2%; EC (via Nova) 3.3%; World Bank 3.6%; government 4.0%'),
          },
          {
            value: '2.8–3.0%',
            label: t('PBB e Malit të Zi, 2027', 'Montenegro GDP, 2027'),
            detail: t('FMN 2.8%; titulli i KE 3.0%; Banka Botërore 3.0%', 'IMF 2.8%; EC headline 3.0%; World Bank 3.0%'),
          },
          {
            value: '2.5%',
            label: t('Normat e politikës, ende të mbajtura', 'Policy rates, still held'),
            detail: t('Banka e Shqipërisë 2.5%; lehtësia e depozitave e BQE 2.50%', 'Bank of Albania 2.5%; ECB deposit facility 2.50%'),
          },
          {
            value: '8.3%',
            label: t('Papunësia në Shqipëri, T2 2026', 'Albania unemployment, Q2 2026'),
            detail: t('INSTAT, popullsia 15 vjeç e lart', 'INSTAT, population aged 15+'),
          },
        ],
      },
      {
        kind: 'table',
        columns: [
          t('Ekonomia', 'Economy'),
          t('Rritja 2026', '2026 growth'),
          t('Rritja 2027', '2027 growth'),
          t('Burimi', 'Source'),
        ],
        rows: [
          [
            t('Shqipëria', 'Albania'),
            t('FMN 3.5%; Banka Botërore 3.4%; KE (përmes Nova) 3.4%; buxheti draft i qeverisë 4.0%. INSTAT, i raportuar nga Banka e Shqipërisë dhe Ministri i Financave: 3.6% në gjysmën e parë të 2026.', 'IMF 3.5%; World Bank 3.4%; EC (via Nova) 3.4%; government draft budget 4.0%. INSTAT, reported by the Bank of Albania and the Finance Minister: 3.6% in the first half of 2026.'),
            t('FMN 3.2%; KE (përmes Nova) 3.3% (dhe 3.3% në 2028); Banka Botërore 3.6% (3.7% në 2028); qeveria 4.0%.', 'IMF 3.2%; EC (via Nova) 3.3% (and 3.3% in 2028); World Bank 3.6% (3.7% in 2028); government 4.0%.'),
            t('FMN WEO, 13 tetor 2026 (ATA); Banka Botërore RER nr. 30, 27 tetor 2026; Agenzia Nova, 17 nëntor 2026, duke raportuar parashikimin e vjeshtës 2026 të KE; ATA, 29 tetor 2026; Guvernatori Gent SEJKO, 3 nëntor 2026.', 'IMF WEO, 13 Oct 2026 (ATA); World Bank RER No. 30, 27 Oct 2026; Agenzia Nova, 17 Nov 2026, reporting the EC Autumn 2026 forecast; ATA, 29 Oct 2026; Governor Gent SEJKO, 3 Nov 2026.'),
          ],
          [
            t('Mali i Zi', 'Montenegro'),
            t('FMN 3.0%; Banka Botërore 3.3%; titulli i KE (Nova) 3.1%. KE CCEQ: prodhimi u rrit 3.8% nga viti në vit në T2 2026, nga 2.5% në T1.', 'IMF 3.0%; World Bank 3.3%; EC headline (Nova) 3.1%. EC CCEQ: output grew 3.8% year on year in Q2 2026, up from 2.5% in Q1.'),
            t('FMN 2.8%; Banka Botërore 3.0% (3.1% në 2028); titulli i KE (Nova) 3.0%. Rreshtat e tjerë të KE për Malin e Zi nuk u hapën (artikulli i Nova ishte me pagesë pas titullit).', 'IMF 2.8%; World Bank 3.0% (3.1% in 2028); EC headline (Nova) 3.0%. Other EC Montenegro lines were not opened (the Nova article was paywalled after the headline).'),
            t('FMN WEO përmes MINA, 13 tetor 2026; Banka Botërore RER nr. 30 dhe fletëfakti i Malit të Zi, 27 tetor 2026; Agenzia Nova, 17 nëntor 2026; KE CCEQ T3 2026.', 'IMF WEO via MINA, 13 Oct 2026; World Bank RER No. 30 and Montenegro factsheet, 27 Oct 2026; Agenzia Nova, 17 Nov 2026; EC CCEQ Q3 2026.'),
          ],
          [
            t('Ballkani Perëndimor (BP6)', 'Western Balkans (WB6)'),
            t('Mesatarja e Bankës Botërore 3.1% (nga 2.6% në 2025). KE CCEQ: rritja e ponderuar e rajonit 3.6% nga viti në vit në T2 2026, më e forta që nga T2 2024.', 'World Bank average 3.1% (from 2.6% in 2025). EC CCEQ: region-weighted growth 3.6% year on year in Q2 2026, the strongest since Q2 2024.'),
            t('Mesatarja e Bankës Botërore 3.4%, duke qëndruar në 3.4% në 2028.', 'World Bank average 3.4%, holding at 3.4% in 2028.'),
            t('Banka Botërore, 27 tetor 2026; KE CCEQ T3 2026.', 'World Bank, 27 Oct 2026; EC CCEQ Q3 2026.'),
          ],
          [
            t('Zona e euros / BE', 'Euro area / EU'),
            t('Zona e euros 1.2%; BE 1.4%.', 'Euro area 1.2%; EU 1.4%.'),
            t('Zona e euros 1.2% (1.3% në 2028); BE 1.4% (1.5% në 2028).', 'Euro area 1.2% (1.3% in 2028); EU 1.4% (1.5% in 2028).'),
            t('Parashikimi i vjeshtës 2026 i Komisionit Evropian, 17 nëntor 2026.', 'European Commission Autumn 2026 forecast, 17 Nov 2026.'),
          ],
        ],
      },
      {
        kind: 'prose',
        text: t(
          'Intervali zyrtar i rritjes për vitin 2027 është pra mesi i 3% për Shqipërinë nëse ndiqen FMN, Komisioni dhe Banka Botërore, dhe rreth 3% për Malin e Zi. Buxheti draft 2027 i qeverisë shqiptare, i paraqitur nga Ministri i Financave Petrit MALAJ më 29 tetor 2026, është më optimist, në 4.0% si për 2026 ashtu edhe për 2027. Ky draft i përdor agjencitë ndërkombëtare si interval referencë dhe e trajton shifrën 4.0% si supozimin e vet të planifikimit të qeverisë, jo si parashikim të shtëpisë.',
          'The official growth range for 2027 is therefore mid-3% for Albania if one follows the IMF, the Commission and the World Bank, and about 3% for Montenegro. The Albanian government’s draft 2027 budget, presented by Finance Minister Petrit MALAJ on 29 October 2026, is more optimistic, at 4.0% for both 2026 and 2027. This draft uses the international agencies as the reference range and treats the 4.0% figure as the government’s own planning assumption, not as a house forecast.',
        ),
      },
      {
        kind: 'table',
        columns: [
          t('Treguesi', 'Indicator'),
          t('E fundit e gjetur', 'Latest found'),
          t('Burimi', 'Source'),
        ],
        rows: [
          [
            t('Inflacioni, Shqipëria', 'Inflation, Albania'),
            t('Çmimet e konsumit 3.2% në T3 2026, nga 3.0% në T2, pastaj 2.9% në shtator, pas 3.4% në korrik. Karburanti dhe disa ushqime të papërpunuara i ngritën çmimet; inflacioni më i ngadaltë i qirave i tërhoqi poshtë. FMN WEO: inflacioni mesatar 3.2% si në 2026 ashtu edhe në 2027. KE (përmes Nova): 3.1% në 2026, 3.4% në 2027, 3.0% në 2028.', 'Consumer prices 3.2% in Q3 2026, up from 3.0% in Q2, then 2.9% in September, after 3.4% in July. Fuel and some unprocessed foods pushed prices up; slower rental inflation pulled them down. IMF WEO: average inflation 3.2% in both 2026 and 2027. EC (via Nova): 3.1% in 2026, 3.4% in 2027, 3.0% in 2028.'),
            t('Guvernatori Gent SEJKO, 3 nëntor 2026; FMN përmes ATA, 13 tetor 2026; Agenzia Nova, 17 nëntor 2026.', 'Governor Gent SEJKO, 3 Nov 2026; IMF via ATA, 13 Oct 2026; Agenzia Nova, 17 Nov 2026.'),
          ],
          [
            t('Inflacioni, Mali i Zi', 'Inflation, Montenegro'),
            t('FMN WEO: 3.5% në 2026, duke zbritur në 3.3% në 2027. Banka Botërore: 3.9% në 2026, duke zbritur në 2.5% deri në 2028. Një publikim zyrtar i MONSTAT për tetorin 2026 nuk u hap në këtë draft.', 'IMF WEO: 3.5% in 2026, easing to 3.3% in 2027. World Bank: 3.9% in 2026, easing to 2.5% by 2028. An official October 2026 MONSTAT print was not opened in this draft.'),
            t('MINA duke cituar FMN WEO, 13 tetor 2026; fletëfakti i Bankës Botërore për Malin e Zi, vjeshta 2026.', 'MINA citing IMF WEO, 13 Oct 2026; World Bank Montenegro factsheet, Fall 2026.'),
          ],
          [
            t('Inflacioni, zona e euros / BE', 'Inflation, euro area / EU'),
            t('Zona e euros 3.2% në 2026, 3.1% në 2027, 2.1% në 2028. BE 3.3%, 3.2% dhe 2.3%.', 'Euro area 3.2% in 2026, 3.1% in 2027, 2.1% in 2028. EU 3.3%, 3.2% and 2.3%.'),
            t('Parashikimi i vjeshtës 2026 i KE, 17 nëntor 2026.', 'EC Autumn 2026 forecast, 17 Nov 2026.'),
          ],
          [
            t('Norma e politikës së Bankës së Shqipërisë', 'Bank of Albania policy rate'),
            t('E mbajtur në 2.5% më 3 nëntor 2026. Depozita njëditore 1.5%; huadhënia njëditore 3.5%.', 'Held at 2.5% on 3 November 2026. Overnight deposit 1.5%; overnight lending 3.5%.'),
            t('Këshilli Mbikëqyrës i Bankës së Shqipërisë, 3 nëntor 2026.', 'Bank of Albania Supervisory Council, 3 Nov 2026.'),
          ],
          [
            t('Normat e BQE', 'ECB rates'),
            t('Të mbajtura më 29 tetor 2026: lehtësia e depozitave 2.50%, operacionet kryesore të rifinancimit 2.65%, lehtësia marxhinale e huadhënies 2.90%. Norma e depozitave ishte ngritur me 25 pikë bazë me efekt nga 16 shtator 2026. Mali i Zi përdor euron, ndaj normat e BQE janë normat përkatëse të politikës atje.', 'Held on 29 October 2026: deposit facility 2.50%, main refinancing operations 2.65%, marginal lending facility 2.90%. The deposit rate had been raised by 25 basis points with effect from 16 September 2026. Montenegro uses the euro, so ECB rates are the relevant policy rates there.'),
            t('Vendimi i politikës monetare i BQE, 29 tetor 2026; tabela zyrtare e normave të interesit e BQE.', 'ECB monetary policy decision, 29 Oct 2026; ECB official interest-rate table.'),
          ],
          [
            t('Leku dhe euro', 'Lek and euro'),
            t('Kursi zyrtar i referencës i Bankës së Shqipërisë më 17 nëntor 2026 në orën 12:14: EUR 90.48 lekë; USD 82.37 lekë. Guvernatori tha se vlerësimi i lekut e ka zbutur pjesërisht inflacionin e importuar. Një seri afatgjatë vlerësimi nuk u përpilua në këtë draft.', 'Official Bank of Albania reference rate on 17 November 2026 at 12:14: EUR 90.48 lek; USD 82.37 lek. The Governor said lek appreciation has partly cushioned imported inflation. A long-run appreciation series was not compiled in this draft.'),
            t('Faqja zyrtare e kursit të këmbimit e Bankës së Shqipërisë; Guvernatori SEJKO, 3 nëntor 2026.', 'Bank of Albania official exchange-rate page; Governor SEJKO, 3 Nov 2026.'),
          ],
          [
            t('Remitancat, Shqipëria', 'Remittances, Albania'),
            t('621 milionë euro në gjysmën e parë të 2026, një rekord, në rritje 16.7% nga viti në vit. Hyrjet e tremujorit të dytë 347 milionë euro, në rritje 24%.', '€621 million in the first half of 2026, a record, up 16.7% year on year. Second-quarter inflows €347 million, up 24%.'),
            t('Bilanci i pagesave i Bankës së Shqipërisë, i raportuar nga ATA, 10 shtator 2026.', 'Bank of Albania balance of payments, reported by ATA, 10 Sep 2026.'),
          ],
          [
            t('Turizmi, Shqipëria', 'Tourism, Albania'),
            t('INSTAT: 10,730,391 hyrje të shtetasve të huaj në janar–shtator 2026, nga 17,476,873 hyrje gjithsej. Këto janë kalime kufiri, jo turistë unikë. Buxheti draft 2027 synon 15.5 milionë ardhje të huaja në 2027 dhe një peshë 33% të turizmit në PBB në 2027–2029, krahasuar me 26.4% në 2025. Ato shifra të 2027 janë synime qeveritare, jo rezultate të dala.', 'INSTAT: 10,730,391 entries by foreign nationals in January–September 2026, out of 17,476,873 total entries. These are border crossings, not unique tourists. The draft 2027 budget targets 15.5 million foreign arrivals in 2027 and a 33% tourism share of GDP in 2027–2029, compared with 26.4% in 2025. Those 2027 figures are government targets, not outturns.'),
            t('ATA duke cituar INSTAT, 23 tetor 2026; ATA mbi raportin shpjegues të buxhetit, 31 tetor 2026.', 'ATA citing INSTAT, 23 Oct 2026; ATA on the budget explanatory report, 31 Oct 2026.'),
          ],
          [
            t('Turizmi, Mali i Zi', 'Tourism, Montenegro'),
            t('Banka Botërore thotë se perspektiva e 2026 mbështetet nga një sezon i fortë turizmi. Një publikim kumultativ i MONSTAT për ardhjet e 2026 nuk u hap në këtë draft (nuk u gjet këtu).', 'The World Bank says the 2026 outlook is supported by a strong tourism season. A MONSTAT cumulative 2026 arrivals print was not opened in this draft (not found here).'),
            t('Fletëfakti i Bankës Botërore për Malin e Zi, vjeshta 2026.', 'World Bank Montenegro factsheet, Fall 2026.'),
          ],
          [
            t('Tregu i punës, Shqipëria', 'Labour market, Albania'),
            t('Papunësia, mosha 15+: 8.3% në T2 2026, në rënie 0.2 pikë nga viti në vit. Shkalla e punësimit 58.3%. Pjesëmarrja në forcën e punës, mosha 15–64: 76.3%. Rreth 1.16 milionë të punësuar dhe 104,600 të papunë. Paga mesatare bruto mujore 92,150 lekë në T2, në rritje 9.8% nga viti në vit; pagat në ndërtim në rritje 22.1%. Guvernatori vuri në dukje rritjen e punësimit dhe të pagave përballë sfidave të ofertës së punës. Parashikimi i FMN për papunësinë: 8.7% në 2026 dhe 2027 (një parashikim, jo rezultati i T2).', 'Unemployment, age 15+: 8.3% in Q2 2026, down 0.2 points year on year. Employment rate 58.3%. Labour-force participation, age 15–64: 76.3%. About 1.16 million employed and 104,600 unemployed. Average gross monthly wage 92,150 lek in Q2, up 9.8% year on year; construction wages up 22.1%. The Governor pointed to rising employment and wages against supply-side labour challenges. IMF unemployment forecast: 8.7% in 2026 and 2027 (a forecast, not the Q2 outturn).'),
            t('INSTAT përmes ATA, 10 shtator 2026; Guvernatori SEJKO, 3 nëntor 2026; FMN përmes ATA, 13 tetor 2026.', 'INSTAT via ATA, 10 Sep 2026; Governor SEJKO, 3 Nov 2026; IMF via ATA, 13 Oct 2026.'),
          ],
          [
            t('Financat publike, buxheti 2027 i Shqipërisë (draft)', 'Public finances, Albania 2027 budget (draft)'),
            t('Ministri Petrit MALAJ: të ardhurat e 2027 janë 907.9 miliardë lekë, 30.9% e PBB; tatimet dhe doganat 583.5 miliardë lekë; kontributet shoqërore dhe shëndetësore 210.3 miliardë lekë (në rritje 4.5%). Deficiti i synuar 2.3% e PBB, një balancë primare neutrale, dhe borxhi publik 52.4% e PBB (nga 52.9% në 2025, i përshkruar si më i ulëti që nga 2008). IHD në G1 2026: 1.1 miliardë euro, në rritje 50.8%. Një suficit primar prej 0.3% e PBB u raportua për 2025. KE (përmes Nova) sheh një deficit 2.0% në 2026 dhe 2027.', 'Minister Petrit MALAJ: 2027 revenues 907.9 billion lek, 30.9% of GDP; tax and customs 583.5 billion lek; social and health contributions 210.3 billion lek (up 4.5%). Target deficit 2.3% of GDP, a neutral primary balance, and public debt 52.4% of GDP (from 52.9% in 2025, described as the lowest since 2008). H1 2026 FDI €1.1 billion, up 50.8%. A primary surplus of 0.3% of GDP was reported for 2025. EC (via Nova) sees a 2.0% deficit in 2026 and 2027.'),
            t('ATA, 29 tetor dhe 5 nëntor 2026; Agenzia Nova, 17 nëntor 2026.', 'ATA, 29 Oct and 5 Nov 2026; Agenzia Nova, 17 Nov 2026.'),
          ],
          [
            t('Financat publike, Mali i Zi', 'Public finances, Montenegro'),
            t('Banka Botërore: deficiti i llogarisë korrente 20.1% e PBB në 2026; borxhi publik dhe i garantuar publikisht i parashikuar në 68.6% e PBB në 2026. FMN: deficiti i llogarisë korrente 19.7% e PBB në 2026 dhe 19% në 2027. Fletëfakti i Bankës Botërore u mbyll para masave të pagave «Euro Model» të qeverisë dhe nuk i vlerëson ato. Një total i plotë i buxhetit 2027 nuk u gjet në këtë draft; monitorimi i brendshëm më 18 nëntor vuri në dukje se buxheti e kishte humbur afatin e 15 nëntorit.', 'World Bank: current-account deficit 20.1% of GDP in 2026; public and publicly guaranteed debt projected at 68.6% of GDP in 2026. IMF: current-account deficit 19.7% of GDP in 2026 and 19% in 2027. The World Bank factsheet was finalised before the government’s ‘Euro Model’ wage measures and does not assess them. A full 2027 budget total was not found in this draft; internal monitoring on 18 November noted that the budget had missed a 15 November deadline.'),
            t('Fletëfakti i Bankës Botërore për Malin e Zi; MINA duke cituar FMN WEO; shënim i brendshëm i arbitrazhit të Jobs Hub, 18 nëntor 2026, ora 08:50 me orën e Tiranës, i etiketuar si të dhëna të brendshme të NOVARIC®.', 'World Bank Montenegro factsheet; MINA citing IMF WEO; internal Jobs Hub arbitrage note, 18 Nov 2026, 08:50 Tirana time, labelled internal.'),
          ],
          [
            t('Anëtarësimi në BE', 'EU accession'),
            t('Paketa e Zgjerimit e Komisionit, 4 nëntor 2026: Mali i Zi ka mbyllur përkohësisht 21 kapituj dhe, me kusht që të bien dakord shtetet anëtare, mund t’i mbyllë përkohësisht kapitujt e mbetur deri në fund të 2026. Puna për traktatin e anëtarësimit dhe për një paketë financiare është në vijim; Komisioni thotë se Mali i Zi është afër fazës së fundit. Shqipëria hapi grupimin e saj të fundit të mbetur, plotësoi standardet e përkohshme të shtetit të së drejtës dhe hapi rrugën për mbylljen e përkohshme të katër kapitujve. Komisioni tha se arritja e «objektivit ambicioz por të arritshëm të Shqipërisë për të përfunduar negociatat e anëtarësimit deri në 2027» kërkon vazhdim të vrullit të reformës dhe dialog politik gjithëpërfshirës. Udhërrëfyes tregues u paraqitën për Malin e Zi, Shqipërinë, Ukrainën dhe Moldavinë.', 'Commission Enlargement Package, 4 November 2026: Montenegro has provisionally closed 21 chapters and, subject to Member States’ agreement, could provisionally close the remaining chapters by the end of 2026. Work on the accession treaty and a financial package is under way; the Commission says Montenegro is close to the final stage. Albania opened its last remaining cluster, met interim rule-of-law benchmarks, and paved the way for the provisional closure of four chapters. The Commission said reaching Albania’s ‘ambitious but achievable objective of concluding accession negotiations by 2027’ requires continued reform momentum and inclusive political dialogue. Indicative roadmaps were presented for Montenegro, Albania, Ukraine and Moldova.'),
            t('Njoftimi për shtyp i Komisionit Evropian IP/26/2325, 4 nëntor 2026.', 'European Commission press release IP/26/2325, 4 Nov 2026.'),
          ],
          [
            t('Zgjedhjet', 'Elections'),
            t('Më 30 tetor 2026, Presidenti Bajram BEGAJ caktoi 9 maj 2027 si datën e zgjedhjeve vendore të Shqipërisë. Këto janë zgjedhje vendore, jo zgjedhje të përgjithshme parlamentare. Forecast duhet të mbetet i paanshëm.', 'On 30 October 2026, President Bajram BEGAJ set 9 May 2027 as the date for Albania’s local elections. These are local elections, not a parliamentary general election. The Forecast must stay impartial.'),
            t('ATA, 30 tetor 2026.', 'ATA, 30 Oct 2026.'),
          ],
          [
            t('Rreziku gjeopolitik dhe energjetik', 'Geopolitical and energy risk'),
            t('Parashikimi i vjeshtës 2026 i Komisionit (17 nëntor) thotë se, gati tetë muaj pas fillimit të konfliktit në Lindjen e Mesme, flukset e energjisë përmes Ngushticës së Hormuzit mbeten rëndë të ndërprera. Brent e kaloi 100 dollarë në tetor; çmimet e naftës diesel u dyfishuan nga viti në vit; gazi TTF u tregtua mbi 95 euro/MWh në fund të tetorit, më shumë se trefishi i nivelit të fundit të shkurtit. BQE, më 29 tetor, i mbajti normat por tha se çmimet e energjisë kanë vazhduar të rriten, duke paraqitur rreziqe në rritje për inflacionin dhe rreziqe në rënie për rritjen. Një përditësim i veçantë i sasishëm i 2026 mbi luftën në Ukrainë nuk u përpilua në këtë draft; ajo mbetet një sfond strukturor evropian i sigurisë, i energjisë dhe i punës.', 'The Commission’s Autumn 2026 forecast (17 November) states that, almost eight months after the start of the conflict in the Middle East, energy flows through the Strait of Hormuz remain severely disrupted. Brent exceeded 100 dollars in October; diesel prices doubled year on year; TTF gas traded above €95/MWh in late October, more than three times the late-February level. The ECB, on 29 October, kept rates on hold but said energy prices have continued to rise, posing upside risks to inflation and downside risks to growth. A separate quantified 2026 update on the war in Ukraine was not compiled in this draft; it remains a structural European security, energy and labour backdrop.'),
            t('Parashikimi i vjeshtës 2026 i KE, 17 nëntor 2026; BQE, 29 tetor 2026.', 'EC Autumn 2026 forecast, 17 Nov 2026; ECB, 29 Oct 2026.'),
          ],
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        text: t(
          'Guvernatori SEJKO tha më 3 nëntor 2026 se parashikimet e vetë Bankës së Shqipërisë mbeten pozitive, por se pasiguria është rritur, mjedisi i jashtëm është i pafavorshëm dhe tensionet shoqërore mund të ulin konsumin dhe investimin. Ajo kujdesje është ndërtuar në skenarët e pafavorshëm dhe të goditjes së jashtme më lart.',
          'Governor SEJKO said on 3 November 2026 that the Bank of Albania’s own projections remain positive, but that uncertainty has increased, the external environment is unfavourable, and social tensions could reduce consumption and investment. That caution is built into the downside and external-shock scenarios above.',
        ),
      },
    ],
  },
  ...forecastIndustrySections,
];
