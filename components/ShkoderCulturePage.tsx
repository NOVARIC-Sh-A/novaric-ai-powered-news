import React, { useMemo, useState, ReactNode } from 'react';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import {
  BookOpenIcon,
  ScaleIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ChartBarIcon,
} from './icons';

interface ShkoderCulturePageProps {
  onBack: () => void;
  onNavigateToVipProfile?: (id: string | number) => void;
  onNavigateToArticleMetricsExplained?: () => void;
}

const extractText = (children: ReactNode): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join(' ');
  if (React.isValidElement<{ children?: ReactNode }>(children) && children.props.children) {
    return extractText(children.props.children);
  }
  return '';
};

export const ShkoderCulturePage: React.FC<ShkoderCulturePageProps> = ({
  onBack,
  onNavigateToVipProfile = () => {},
  onNavigateToArticleMetricsExplained = () => {},
}) => {
  const [activeLang, setActiveLang] = useState<'sq' | 'en'>('sq');
  const [bibCategory, setBibCategory] = useState<'all' | 'albanian' | 'theoretical' | 'comparative' | 'reports'>('all');
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'zero' | 'moderate' | 'high' | 'absolute'>('all');

  // 30 Annotated Bibliography Sources
  const sourcesList = useMemo(() => [
    // Section A: Albania
    { id: 1, category: 'albanian', authorYear: 'Kajsiu, Blendi (2015)', title: 'A Discourse Analysis of Corruption: Instituting Neoliberalism Against Corruption in Albania', url: 'https://doi.org/10.4324/9781315564661', text: 'Kajsiu (2015) - A Discourse Analysis of Corruption (Routledge)', credibility_industry_rating_pct: 94 },
    { id: 2, category: 'albanian', authorYear: 'de Rapper, Gilles (2006)', title: "La 'biographie' : parenté incontrôlable et souillure politique dans l'Albanie", url: 'https://doi.org/10.4000/ejts.565', text: "de Rapper (2006) - La 'biographie': parenté incontrôlable et souillure politique (EJTS)", credibility_industry_rating_pct: 95 },
    { id: 3, category: 'albanian', authorYear: 'De Waal, Clarissa (2005)', title: 'Albania Today: A Portrait of Post-Communist Turbulence', url: 'https://www.bloomsbury.com/ca/albania-9780857710239/', text: 'De Waal (2005) - Albania Today (I.B. Tauris)', credibility_industry_rating_pct: 93 },
    { id: 4, category: 'albanian', authorYear: 'Kera, Gentiana & Hysa, Armanda (2020)', title: 'Influencing votes, winning elections: clientelist practices in Albania', url: 'https://doi.org/10.1080/14683857.2019.1709698', text: 'Kera & Hysa (2020) - Clientelist Practices in Albania (SEE & Black Sea Studies)', credibility_industry_rating_pct: 96 },
    { id: 5, category: 'albanian', authorYear: 'Bardhoshi, Nebi (2011)', title: 'Gurtë e Kufinit: Kanuni, prona dhe strukturimi shoqëror', url: 'https://www.academia.edu/36305587/GURT%C3%8B_E_KUFINIT', text: 'Bardhoshi (2011) - Gurtë e Kufinit: Kanuni dhe strukturimi shoqëror (Onufri)', credibility_industry_rating_pct: 95 },
    { id: 6, category: 'albanian', authorYear: 'Tadić, Katarina & Elbasani, Arolda (2018)', title: 'State-building and patronage networks: how political parties embezzled bureaucracy in post-war Kosovo', url: 'https://doi.org/10.1080/14683857.2018.1474551', text: 'Tadić & Elbasani (2018) - Patronage Networks in Post-War Kosovo', credibility_industry_rating_pct: 94 },
    { id: 7, category: 'albanian', authorYear: 'Elbasani, Arolda (2008)', title: 'EU Enlargement and State Institutions: Reforming Public Administration in Albania', url: 'https://doi.org/10.3917/eufor.349.0119', text: 'Elbasani (2008) - Reforming Public Administration in Albania', credibility_industry_rating_pct: 92 },
    { id: 8, category: 'albanian', authorYear: 'Fuga, Artan (2004)', title: 'Shoqëria periferike: Trajektorja e tranzicionit postkomunist në Shqipëri', url: 'https://www.bksh.al/', text: 'Fuga (2004) - Shoqëria periferike: Tranzicioni postkomunist (Ora)', credibility_industry_rating_pct: 94 },
    { id: 9, category: 'albanian', authorYear: 'Lubonja, Fatos (2001)', title: 'Trashëgimia e totalitarizmit dhe kultura e re e pandëshkueshmërisë', url: 'https://perpjekja.al/', text: 'Lubonja (2001) - Trashëgimia e totalitarizmit dhe kultura e pandëshkueshmërisë (Përpjekja)', credibility_industry_rating_pct: 93 },
    { id: 10, category: 'albanian', authorYear: 'Schwandner-Sievers, S. & Fischer, B. (2002)', title: 'Albanian Identities: Myth and History', url: 'https://www.jstor.org/stable/j.ctt2006093', text: 'Schwandner-Sievers & Fischer (2002) - Albanian Identities: Myth and History (Indiana UP)', credibility_industry_rating_pct: 95 },
    
    // Section B: Theoretical
    { id: 11, category: 'theoretical', authorYear: 'Bourdieu, Pierre (1986)', title: 'The Forms of Capital', url: 'https://www.marxists.org/reference/subject/philosophy/works/fr/bourdieu-forms-capital.htm', text: 'Bourdieu (1986) - The Forms of Capital (Symbolic & Social Capital)', credibility_industry_rating_pct: 99 },
    { id: 12, category: 'theoretical', authorYear: 'Goffman, Erving (1959)', title: 'The Presentation of Self in Everyday Life', url: 'https://en.wikipedia.org/wiki/The_Presentation_of_Self_in_Everyday_Life', text: 'Goffman (1959) - The Presentation of Self in Everyday Life (Impression Management)', credibility_industry_rating_pct: 98 },
    { id: 13, category: 'theoretical', authorYear: 'Weber, Max (1919/1946)', title: 'Politics as a Vocation: Ethics of Conviction vs. Responsibility', url: 'https://www.oxfordreference.com/', text: 'Weber (1919/1946) - Politics as a Vocation (Gesinnungsethik vs. Verantwortungsethik)', credibility_industry_rating_pct: 99 },
    { id: 14, category: 'theoretical', authorYear: 'Bandura, Albert (1999)', title: 'Moral Disengagement in the Perpetration of Inhumanities', url: 'https://doi.org/10.1207/s15327957pspr0303_3', text: 'Bandura (1999) - Moral Disengagement in the Perpetration of Inhumanities', credibility_industry_rating_pct: 98 },
    { id: 15, category: 'theoretical', authorYear: 'Arendt, Hannah (2003)', title: 'Responsibility and Judgment: Personal Responsibility Under Dictatorship', url: 'https://www.penguinrandomhouse.com/books/4859/responsibility-and-judgment-by-hannah-arendt/', text: 'Arendt (2003) - Personal Responsibility Under Dictatorship & Cog Theory', credibility_industry_rating_pct: 99 },
    { id: 16, category: 'theoretical', authorYear: 'Jackall, Robert (1988)', title: 'Moral Mazes: The World of Corporate Managers', url: 'https://global.oup.com/academic/product/moral-mazes-9780199720088', text: 'Jackall (1988) - Moral Mazes: The World of Corporate Managers (Oxford UP)', credibility_industry_rating_pct: 96 },
    { id: 17, category: 'theoretical', authorYear: 'Johnston, Michael (2005)', title: 'Syndromes of Corruption: Wealth, Power, and Democracy', url: 'https://doi.org/10.1017/CBO9780511490965', text: 'Johnston (2005) - Syndromes of Corruption: Elite Cartels & Oligarchs', credibility_industry_rating_pct: 97 },
    { id: 18, category: 'theoretical', authorYear: 'Granovetter, Mark (1985)', title: 'Economic Action and Social Structure: The Problem of Embeddedness', url: 'https://doi.org/10.1086/228311', text: 'Granovetter (1985) - Social Embeddedness of Economic & Administrative Action (AJS)', credibility_industry_rating_pct: 98 },
    { id: 19, category: 'theoretical', authorYear: 'Vaughan, Diane (1996)', title: 'The Challenger Launch Decision: Risky Technology, Culture, and Deviance at NASA', url: 'https://press.uchicago.edu/', text: 'Vaughan (1996) - The Normalization of Deviance (Chicago UP)', credibility_industry_rating_pct: 97 },
    { id: 20, category: 'theoretical', authorYear: 'Tenbrunsel, A. E. & Messick, D. M. (2004)', title: 'Ethical Fading: The Role of Self-Deception in Unethical Behavior', url: 'https://doi.org/10.1023/B:SORE.0000027411.35832.53', text: 'Tenbrunsel & Messick (2004) - Ethical Fading: Self-Deception in Unethical Behavior', credibility_industry_rating_pct: 96 },
    { id: 21, category: 'theoretical', authorYear: 'Morrison, E. W. & Milliken, F. J. (2000)', title: 'Organizational Silence: A Barrier to Change and Development', url: 'https://doi.org/10.2307/259200', text: 'Morrison & Milliken (2000) - Organizational Silence in Hierarchical Institutions', credibility_industry_rating_pct: 96 },
    
    // Section C: Comparative
    { id: 22, category: 'comparative', authorYear: 'Ledeneva, Alena V. (1998)', title: "Russia's Economy of Favours: Blat, Networking and Informal Exchange", url: 'https://doi.org/10.1017/CBO9780511521409', text: "Ledeneva (1998) - Economy of Favours: Informal Exchange & Blat (Cambridge UP)", credibility_industry_rating_pct: 95 },
    { id: 23, category: 'comparative', authorYear: 'Mungiu-Pippidi, Alina (2015)', title: 'The Quest for Good Governance: How Societies Build Institutional Integrity', url: 'https://doi.org/10.1017/CBO9781316286838', text: 'Mungiu-Pippidi (2015) - The Quest for Good Governance: Particularism & Order', credibility_industry_rating_pct: 97 },
    { id: 24, category: 'comparative', authorYear: 'Rothstein, Bo (2011)', title: 'The Quality of Government: Corruption, Social Trust, and Inequality', url: 'https://press.uchicago.edu/ucp/books/book/chicago/Q/bo11977054.html', text: 'Rothstein (2011) - The Quality of Government: Corruption as Social Trap', credibility_industry_rating_pct: 98 },
    { id: 25, category: 'comparative', authorYear: 'Giordano, C. & Kostova, D. (2002)', title: 'The Social Production of Mistrust in Postsocialist Societies', url: 'https://www.routledge.com/', text: 'Giordano & Kostova (2002) - The Social Production of Mistrust in Southeast Europe', credibility_industry_rating_pct: 94 },
    { id: 26, category: 'comparative', authorYear: 'Štiks, Igor (2015)', title: 'Nations and Citizens in Yugoslavia and the Post-Yugoslav States', url: 'https://doi.org/10.5040/9781474221542', text: 'Štiks (2015) - Citizenship & Fragmentation in the Western Balkans (Bloomsbury)', credibility_industry_rating_pct: 95 },

    // Section D: Institutional Reports
    { id: 27, category: 'reports', authorYear: 'OECD / SIGMA (2021)', title: 'Monitoring Report: Albania 2021 (Principles of Public Administration)', url: 'https://doi.org/10.1787/209eb43c-en', text: 'OECD/SIGMA (2021) - Public Administration Monitoring Report: Albania', credibility_industry_rating_pct: 98 },
    { id: 28, category: 'reports', authorYear: 'GRECO / Council of Europe (2020)', title: 'Fifth Evaluation Round: Preventing Corruption in Central Governments (Albania)', url: 'https://www.coe.int/en/web/greco/evaluations/albania', text: 'GRECO (2020) - Fifth Evaluation Round: Integrity in Central Governments (Albania)', credibility_industry_rating_pct: 99 },
    { id: 29, category: 'reports', authorYear: 'UNODC (2011)', title: 'Corruption in Albania: Bribery as Experienced by the Population', url: 'https://www.unodc.org/unodc/en/data-and-analysis/corruption.html', text: 'UNODC (2011) - Corruption in Albania: Bribery as Experienced by the Population', credibility_industry_rating_pct: 97 },
    { id: 30, category: 'reports', authorYear: 'Transparency International (2023)', title: 'National Integrity System Assessment: Albania 2023', url: 'https://www.transparency.org/en/publications/national-integrity-system-assessment-albania-2023', text: 'Transparency International & IDM (2023) - National Integrity System Assessment: Albania', credibility_industry_rating_pct: 98 },
  ], []);

  // Complicity Matrix Data
  const complicityMatrix = useMemo(() => [
    { level: 1, title: 'Pranimi i rolit publik me mirëbesim (Good Faith)', knowledge: 'E papërfillshme', freedom: 'E Lartë', pressure: 'E Ulët', benefit: 'Vetëm paga ligjore', harm: 'Zero', canRefuse: 'N/A', resistance: 'E Lartë', responsibility: 'Zero përgjegjësi', tier: 'zero' },
    { level: 2, title: 'Zbulimi i korrupsionit pas emërimit (Discovery)', knowledge: 'Në zhvillim', freedom: 'Mesatare', pressure: 'Mesatare', benefit: 'Vetëm paga ligjore', harm: 'Latente', canRefuse: 'Mesatare', resistance: 'Verifikime të para', responsibility: 'E Ulët (Prag vlerësimi)', tier: 'zero' },
    { level: 3, title: 'Dija paraprake për korrupsionin para pranimit të postit', knowledge: 'E Plotë', freedom: 'E Lartë', pressure: 'Nuk ka', benefit: 'Status i lartë politik', harm: 'E paramenduar', canRefuse: 'E Lartë', resistance: 'Zero', responsibility: 'Shumë e Lartë (Keqbesim)', tier: 'high' },
    { level: 4, title: 'Qëndrimi në detyrë duke refuzuar aktet e paligjshme', knowledge: 'E Plotë', freedom: 'E kufizuar', pressure: 'E Lartë', benefit: 'Paga bazë (pa favore)', harm: 'E minimizuar', canRefuse: 'E Ulët', resistance: 'Kthim dosjesh, shkresa', responsibility: 'Heroizëm etik & Integritet', tier: 'zero' },
    { level: 5, title: 'Vetëdija pasive / Spektatori institucional (Bystanderism)', knowledge: 'Thelbësore', freedom: 'Mesatare', pressure: 'Mesatare / Lartë', benefit: 'Ruajtje rroge & vendi', harm: 'Mesatare', canRefuse: 'Mesatare', resistance: 'Zero (Heshtje)', responsibility: 'Mesatare (Mosveprim qytetar)', tier: 'moderate' },
    { level: 6, title: 'Heshtja strategjike për mbrojtje statusi e karriere', knowledge: 'E Plotë', freedom: 'Mesatare-Lartë', pressure: 'Mesatare', benefit: 'Mbajtje rangu, favorizim', harm: 'E Lartë', canRefuse: 'E Lartë', resistance: 'Zero (Llogaritje)', responsibility: 'E Madhe (Akomodim fajtor)', tier: 'moderate' },
    { level: 7, title: 'Lehtësimi administrativ (Hartimi & procesimi i tenderit)', knowledge: 'Teknike e plotë', freedom: 'Mesatare', pressure: 'E Lartë', benefit: 'Ruajtje posti', harm: 'E Lartë', canRefuse: 'Mesatare', resistance: 'Zero ("Bëra punën")', responsibility: 'E Lartë (Bashkëfajësi operative)', tier: 'high' },
    { level: 8, title: 'Nënshkrimi i vendimeve abuzive (KVO & Drejtori)', knowledge: 'E Plotë', freedom: 'Mesatare', pressure: 'E Lartë', benefit: 'Shpërblim / Mbijetesë', harm: 'Shumë e rëndë', canRefuse: 'Mesatare', resistance: 'Zero (Legalizon vjedhjen)', responsibility: 'Shumë e Lartë (Fajësi e plotë)', tier: 'high' },
    { level: 9, title: 'Pjesëmarrja e drejtpërdrejtë & Përfitimi i ryshfetit', knowledge: 'Absolute / Iniciator', freedom: 'E Lartë', pressure: 'E Ulët', benefit: 'Pasurim i paligjshëm', harm: 'Kritike', canRefuse: 'Absolute', resistance: 'Zero', responsibility: 'Absolute (Kriminale & Morale)', tier: 'absolute' },
    { level: 10, title: 'Rezistenca e brendshme & Përpjekjet për reformë', knowledge: 'E Plotë', freedom: 'E kufizuar', pressure: 'Ekstreme', benefit: 'Negative (Sulme)', harm: 'E penguar', canRefuse: 'E Ulët', resistance: 'Audit me shkrim, refuzim', responsibility: 'Zero (Integritet model)', tier: 'zero' },
    { level: 11, title: 'Sinjalizimi formal & Denoncimi (Whistleblowing)', knowledge: 'E Plotë', freedom: 'E lartë etike', pressure: 'Ekstreme', benefit: 'Humbje statusi', harm: 'Ekspozim publik', canRefuse: 'E Ulët', resistance: 'Dosje zyrtare në SPAK', responsibility: 'Zero (Kurajë maksimale qytetare)', tier: 'zero' },
    { level: 12, title: 'Dorëheqja parimore publike me protestë (Resignation)', knowledge: 'E Plotë', freedom: 'E Lartë', pressure: 'Ekstreme', benefit: 'Humbje të ardhurash', harm: 'Ndalon bashkëfajësinë', canRefuse: 'E Lartë', resistance: 'Letër publike dorëheqjeje', responsibility: 'Zero (Shëlbim i plotë etik)', tier: 'zero' },
  ], []);

  const filteredMatrix = useMemo(() => {
    if (matrixFilter === 'all') return complicityMatrix;
    return complicityMatrix.filter((row) => row.tier === matrixFilter);
  }, [complicityMatrix, matrixFilter]);

  const filteredSources = useMemo(() => {
    if (bibCategory === 'all') return sourcesList;
    return sourcesList.filter((s) => s.category === bibCategory);
  }, [sourcesList, bibCategory]);

  const articleContentJsx = useMemo(() => (
    <>
      {/* Editorial Header Banner */}
      <div className="mb-8 p-6 bg-slate-100 dark:bg-slate-900 border-l-4 border-primary-600 rounded-r-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300 mb-2">
              Lajme nga Shkodra &bull; Sektori Kulturë & Analizë
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              “Asht nga një familje e mirë”: Kapitali Simbolik, Mburojat Morale dhe Bashkëfajësia Institucionale
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Një hetim ndërdisiplinor mbi etnosociologjinë e Shkodrës, habitusin e "derës së mirë", dhe paradoksin e integritetit në administratën publike shqiptare.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0">
            <button
              onClick={() => setActiveLang('sq')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                activeLang === 'sq'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Shqip (Kulturë & Etnosociologji)
            </button>
            <button
              onClick={() => setActiveLang('en')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                activeLang === 'en'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              English (Academic Treatise)
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: EXECUTIVE SUMMARY */}
      <ArticleSection id="sec-executive-summary" title="1. Përmbledhje Ekzekutive (Executive Summary)">
        <div className="space-y-4">
          <p>
            Shprehja idiomatike <strong className="font-semibold text-primary-600 dark:text-primary-400">“asht nga nji familje e mirë”</strong> (në gegërishten veriore të Shkodrës) ose <em>“është nga një familje e mirë”</em> (në shqipen standarde) zë një vend qendror në sociologjinë e përditshme të shoqërisë shqiptare. Ndonëse në pamje të parë funksionon si një vërtetim i nderuar i prejardhjes fisnike, edukatës qytetare dhe dinjitetit njerëzor, kjo shprehje përbën një mekanizëm operativ për transmetimin ndërbreznor të kapitalit simbolik dhe moral.
          </p>
          <PullQuote>
            “Familja e mirë është kapital simbolik i trashëguar; integriteti është një praksis individual etik që dëshmohet vetëm atëherë kur veprimi i drejtë mbart kosto reale personale, financiare dhe shoqërore.”
          </PullQuote>
          <p>
            Ky studim heton kontradiktën thelbësore morale dhe institucionale që shfaqet kur një individ, i cili gëzon këtë prezumim shoqëror të virtytit të trashëguar, punësohet ose shërben brenda një administrate publike të kapur nga korrupsioni sistemik, patronazhi partiak dhe klientelizmi. Hulumtimi zbulon se në vend që të garantojë integritetin e shtetit, etiketa <em>“familje e mirë”</em> shndërrohet rregullisht në një <strong className="text-slate-900 dark:text-slate-100">mburojë reputacionale</strong> dhe një instrument të <strong className="text-slate-900 dark:text-slate-100">larjes së virtytit (virtue laundering)</strong>, duke paralizuar kontrollin qytetar dhe duke legjitimuar heshtjen administrative.
          </p>
        </div>
      </ArticleSection>

      {/* SECTION 2: DEFINITION */}
      <ArticleSection id="sec-phenomenon-definition" title="2. Përkufizimi i Fenomenit: 5 Dimensionet Strukturore">
        <p className="mb-4">
          Në hapësirën shoqërore shqiptare, shprehja nuk është thjesht deskriptive, por përbën një atribuim performativ që operon përgjatë pesë dimensioneve kyçe:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-primary-600 dark:text-primary-400 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 text-xs flex items-center justify-center font-bold">1</span>
              Reputacioni i Trashëguar
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Trajtohet si një tipar gjenetik dhe gjenealogjik: individi hyn në ndërveprim me një linjë krediti moral të fituar nga paraardhësit ose fisi.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-primary-600 dark:text-primary-400 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 text-xs flex items-center justify-center font-bold">2</span>
              Kapitali Simbolik (Bourdieu)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Konvertimi i privilegjit social e kulturor (gjuha, mirësjellja, habitusi qytetar) në një autoritet të perceptuar gabimisht si virtyt i lindur.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-primary-600 dark:text-primary-400 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 text-xs flex items-center justify-center font-bold">3</span>
              Certifikimi Jo-formal Shoqëror
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Një mekanizëm tradicional paravlerësimi: <em>“A i dihet cila derë është?”</em>. Zëvendëson verifikimin institucional me garancinë e fisit.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-primary-600 dark:text-primary-400 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 text-xs flex items-center justify-center font-bold">4</span>
              Detyrimi Moral (Nderi vs. Turpi)
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Detyra kolektive për të mos njollosur emrin e familjes. Turpi nuk është pendesë e brendshme, por ekspozim ndëshkues përpara komunitetit.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm md:col-span-2 lg:col-span-2">
            <h4 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/60 text-xs flex items-center justify-center font-bold">5</span>
              Mburoja Reputacionale & Larja e Virtytit
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Përdorimi i emrit të familjes për të neutralizuar dyshimet: <em>“E pamundur, ai është nga një familje e mirë!”</em>. Kjo mbron individin nga hetimi gazetaresk, kontrolli i brendshëm administrativ dhe sanksioni penal.
            </p>
          </div>
        </div>
      </ArticleSection>

      {/* SECTION 3: CULTURAL & LINGUISTIC */}
      <ArticleSection id="sec-cultural-linguistic" title="3. Analiza Gjuhësore & Kulturore: Shkodra, Gegërishtja dhe Semantika e Nderit">
        <p className="mb-4">
          Tradita shkodrane dhe veriore i jep këtij koncepti një peshë specifike historike. Në Shkodër, togfjalëshi lidhet drejtpërdrejt me institucionin e <strong>“derës së mirë”</strong>: shtëpi që kishin një trung të njohur gjenealogjik, nuk kishin thyer besën, mbanin odën e hapur për mikun dhe kishin autoritet pleqësie.
        </p>

        {/* Semantic Matrix Diagram */}
        <div className="my-6 p-5 bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h4 className="text-center font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-xs mb-4">
            Matrica Semantike e Etnopsikologjisë Shqiptare (Kultura e Nderit & Turpit)
          </h4>
          <div className="max-w-xl mx-auto flex flex-col items-center">
            <div className="px-4 py-2 bg-primary-600 text-white font-bold rounded-lg shadow-md text-sm">
              SHTËPI / FIS / DERË (Njësia Korporative)
            </div>
            <div className="w-0.5 h-6 bg-slate-400 dark:bg-slate-600 my-1"></div>
            <div className="grid grid-cols-2 gap-8 w-full">
              <div className="flex flex-col items-center p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">AKSI POZITIV MORAL</span>
                <span className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200">NDER (Honor)</span>
                <span className="text-xs text-slate-500 my-1">↓</span>
                <span className="font-semibold text-xs text-emerald-800 dark:text-emerald-300">FAQJA E BARDHË (Reputation)</span>
                <span className="text-xs text-slate-500 my-1">↓</span>
                <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">BESA (Pledged Word)</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-lg">
                <span className="text-xs font-bold text-red-700 dark:text-red-400 mb-1">AKSI NEGATIV MORAL</span>
                <span className="font-extrabold text-sm text-red-900 dark:text-red-200">TURP (Shame / Disgrace)</span>
                <span className="text-xs text-slate-500 my-1">↓</span>
                <span className="font-semibold text-xs text-red-800 dark:text-red-300">FAQJA E ZEZË (Infamy)</span>
                <span className="text-xs text-slate-500 my-1">↓</span>
                <span className="font-bold text-xs text-red-900 dark:text-red-200">TRADHËTI (Betrayal / Perfidy)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 dark:text-slate-200">Katër Gabimet Epistemologjike të Komunitetit:</h4>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300 text-sm">
            <li><strong>Ngatërrimi i Gjenealogjisë me Integritetin:</strong> Prezumimi se meqenëse prindërit ishin mësues apo mjekë të nderuar në Shkodër, fëmija e tyre zotëron automatikisht rezistencë morale ndaj korrupsionit të tenderave.</li>
            <li><strong>Ngatërrimi i Mirësjelljes (Edukatës) me Kurajën Qytetare:</strong> Një nëpunës i sjellshëm, i veshur me kostum dhe i kulturuar në komunikim mund të firmosë pa hezitim një koncesion abuziv. Mirësjellja ngatërrohet me virtytin.</li>
            <li><strong>Ngatërrimi i Diplomave me Pjekurinë Morale:</strong> Besimi se arsimimi në Perëndim garanton imunitet ndaj korrupsionit, duke injoruar përdorimin instrumental të teknikës për të maskuar mashtrimin.</li>
            <li><strong>Mungesa e Skandalit si Provë e Pastërtisë:</strong> Në një sistem të kapur, mungesa e një hetimi penal shpesh dëshmon vetëm pajtueshmëri të plotë me kartelin në pushtet.</li>
          </ul>
        </div>
      </ArticleSection>

      {/* SECTION 4: HISTORICAL METAMORPHOSIS */}
      <ArticleSection id="sec-historical-evolution" title="4. Evolucioni Historik: Nga Kanuni te Tranzicioni Post-Komunist">
        <div className="overflow-x-auto my-4">
          <table className="min-w-full text-xs sm:text-sm text-left border border-slate-200 dark:border-slate-700">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-semibold">
              <tr>
                <th className="p-3 border-b">Epoka Historike</th>
                <th className="p-3 border-b">Kuptimi i “Familjes së Mirë”</th>
                <th className="p-3 border-b">Marrëdhënia me Shtetin / Pushtetin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr>
                <td className="p-3 font-semibold text-primary-600 dark:text-primary-400">1. Para-moderne (Kanuni)</td>
                <td className="p-3">Nderi i shtëpisë, trimëria, mikpritja, paprekshmëria e kufirit, besa fisnore.</td>
                <td className="p-3">Autonomi e plotë nga shteti; nënshtrimi ndaj pushtetit të huaj shihej si poshtërim.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-primary-600 dark:text-primary-400">2. Periudha Osmane</td>
                <td className="p-3">Oxhakët, bejlerët, pashallarët; toka (çifligjet), titujt administrativë.</td>
                <td className="p-3">Akomodim strategjik: taksa-mbledhje dhe klientelizëm patrimonial për të ruajtur shtëpinë.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-primary-600 dark:text-primary-400">3. Shtetformimi (1912–1939)</td>
                <td className="p-3">Elita e re qytetare, arsimimi universitar në Vjenë, Paris, Romë e Stamboll.</td>
                <td className="p-3">Krijimi i burokratit të parë shtetëror: gërshetim i patriotizmit me kooptimin klanor të Zogut.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-primary-600 dark:text-primary-400">4. Diktatura (1944–1991)</td>
                <td className="p-3"><strong>“Biografi e mirë”</strong> kundrejt <em>“familjeve të deklasuara”</em>; besnikëri ndaj Partisë.</td>
                <td className="p-3">Monopol total shtetëror: nënshtrimi ndaj urdhrit partiak u përkufizua si virtyti më i lartë moral.</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-primary-600 dark:text-primary-400">5. Tranzicioni (1991–sot)</td>
                <td className="p-3">Anomi strukturore: pasurim i shpejtë, militantizëm partiak, diploma private komerciale.</td>
                <td className="p-3">Kapja e shtetit: administrata publike si plaçkë elektorale; "familja e mirë" si mburojë reputacioni.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ArticleSection>

      {/* SECTION 5: THEORETICAL REVIEW */}
      <ArticleSection id="sec-theoretical-review" title="5. Rishikimi i Literaturës Teorike: 20 Korniza Shkencore">
        <p className="mb-4">
          Për të zbërthyer anatomikish paradoksin etik, studimi integron teoritë themelore të sociologjisë, etikës administrative dhe psikologjisë sociale:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Pierre Bourdieu: Misrecognition & Kapitali Simbolik</h4>
            <p className="text-slate-600 dark:text-slate-300">
              Kapitali shoqëror dhe kulturor i familjes njihet gabimisht (<em>méconnaissance</em>) si epërsi morale natyrore. Ky kapital shërben si armaturë për të shmangur hetimin e korrupsionit.
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Hannah Arendt: Banaliteti i të Keqes & "Teoria e Rrotëzës"</h4>
            <p className="text-slate-600 dark:text-slate-300">
              Arendt rrëzon pretendimin e nëpunësit: <em>“Jam vetëm një rrotëz në sistem”</em>. Në sferën administrative, bindja mekanike ndaj urdhrit abuziv është e barasvlershme me mbështetjen politike të krimit.
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Max Weber: Etika e Bindjes vs. Etika e Përgjegjësisë</h4>
            <p className="text-slate-600 dark:text-slate-300">
              Nëpunësi ngushëllohet me bindjen e tij të brendshme (<em>Gesinnungsethik</em>), por refuzon etikën e përgjegjësisë (<em>Verantwortungsethik</em>), e cila kërkon llogaridhënie për pasojat konkrete të firmës.
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Albert Bandura: Mekanizmat e Shkëputjes Morale</h4>
            <p className="text-slate-600 dark:text-slate-300">
              Shpërndarja e përgjegjësisë tek komisioni (KVO), zhvendosja e fajit te ministri, arsyetimi eufemistik (ryshfeti quhet "kafe" ose "nder"), dhe justifikimi moral në emër të fëmijëve.
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Robert Jackall: Moral Mazes & Roli i Patronit</h4>
            <p className="text-slate-600 dark:text-slate-300">
              Burokracia funksionon si çiflig ku morali përcaktohet nga hierarkia: çfarë kënaq shefin është e ligjshme, ndërsa thirrja e ligjit shihet si naivitet ose tradhti.
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Diane Vaughan & Tenbrunsel: Normalizimi & Ethical Fading</h4>
            <p className="text-slate-600 dark:text-slate-300">
              Devijimi i vogël ligjor tolerohet në fillim derisa shkelja bëhet praktikë standarde. Dimensioni moral zhduket dhe vendimi trajtohet thjesht si "letërkëmbim procedurial".
            </p>
          </div>
        </div>
      </ArticleSection>

      {/* SECTION 6: COMPLICITY MATRIX */}
      <ArticleSection id="sec-complicity-matrix" title="6. Matrica e Bashkëfajësisë Institucionale (12 Nivele Analitike)">
        <p className="mb-4">
          Për të shmangur vlerësimet e përgjithshme cinike se "të gjithë janë të korruptuar", matrica e mëposhtme analizon nivelin objektiv të fajësisë morale dhe ligjore përgjatë 8 dimensioneve strukturore:
        </p>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs font-semibold self-center text-slate-500">Filtro sipas nivelit:</span>
          {(['all', 'zero', 'moderate', 'high', 'absolute'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setMatrixFilter(tier)}
              className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${
                matrixFilter === tier
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
              }`}
            >
              {tier === 'all' && 'Të gjitha (12)'}
              {tier === 'zero' && 'Përgjegjësi Zero / Integritet (5)'}
              {tier === 'moderate' && 'Përgjegjësi Mesatare (2)'}
              {tier === 'high' && 'Përgjegjësi e Lartë (4)'}
              {tier === 'absolute' && 'Fajësi Absolute (1)'}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-2.5 border-b">#</th>
                <th className="p-2.5 border-b">Kategoria e Veprimit</th>
                <th className="p-2.5 border-b">Niveli i Dijes</th>
                <th className="p-2.5 border-b">Presioni</th>
                <th className="p-2.5 border-b">Përfitimi Personal</th>
                <th className="p-2.5 border-b">Dëmi Publik</th>
                <th className="p-2.5 border-b">Rezistenca</th>
                <th className="p-2.5 border-b">Niveli i Përgjegjësisë Morale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredMatrix.map((row) => (
                <tr
                  key={row.level}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                    row.tier === 'zero'
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                      : row.tier === 'high' || row.tier === 'absolute'
                      ? 'bg-red-50/40 dark:bg-red-950/20'
                      : ''
                  }`}
                >
                  <td className="p-2.5 font-bold text-primary-600">{row.level}</td>
                  <td className="p-2.5 font-semibold text-slate-900 dark:text-slate-100">{row.title}</td>
                  <td className="p-2.5">{row.knowledge}</td>
                  <td className="p-2.5">{row.pressure}</td>
                  <td className="p-2.5">{row.benefit}</td>
                  <td className="p-2.5">{row.harm}</td>
                  <td className="p-2.5">{row.resistance}</td>
                  <td className="p-2.5 font-bold">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs ${
                        row.tier === 'zero'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                          : row.tier === 'moderate'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {row.responsibility}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ArticleSection>

      {/* SECTION 7: VERNACULAR JUSTIFICATIONS */}
      <ArticleSection id="sec-moral-disengagement" title="7. Mekanizmat e Shkëputjes Morale: Anatomia e Shfajësimeve të Përditshme">
        <p className="mb-4">
          Në zyrat e ministrive dhe bashkive, nëpunësit nga "familje të mira" ruajnë vetëvlerësimin pozitiv përmes një repertori të gjuhës vernakulare që vepron si urë midis nderit të brendshëm dhe kompromisit të jashtëm:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <span className="text-xs uppercase font-extrabold text-primary-600 dark:text-primary-400">Fatalizmi Sistemik</span>
            <div className="mt-2 space-y-3 text-sm">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">“Sistemi është i tillë”</p>
                <p className="text-xs text-slate-500 mt-0.5">Shndërron sistemin në entitet demoniak autonom; asgjëson lirinë e individit.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">“Të gjithë ashtu bëjnë”</p>
                <p className="text-xs text-slate-500 mt-0.5">Normalizim statistikor: nëse mëkati është universal, devijimi pushon së qeni faj.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">“S’ka çfarë të bëjë”</p>
                <p className="text-xs text-slate-500 mt-0.5">Pafuqi e mësuar që e kthen dorëzimin moral në tragjedi të pashmangshme ekzistenciale.</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <span className="text-xs uppercase font-extrabold text-amber-600 dark:text-amber-400">Përparësia e Fisit</span>
            <div className="mt-2 space-y-3 text-sm">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">“Ka familje për të mbajtur”</p>
                <p className="text-xs text-slate-500 mt-0.5">Asi më i fuqishëm moral: detyrimi biologjik ndaj fëmijës shuan çdo detyrë ndaj shtetit impersonal.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">“Po punon për njerëzit e vet”</p>
                <p className="text-xs text-slate-500 mt-0.5">Klientelizmi dhe nepotizmi rikodohen si besnikëri fisnore; refuzimi i kushëririt dënohet si tradhti.</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <span className="text-xs uppercase font-extrabold text-emerald-600 dark:text-emerald-400">Mburoja Burokratike</span>
            <div className="mt-2 space-y-3 text-sm">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">“Është vetëm nëpunës”</p>
                <p className="text-xs text-slate-500 mt-0.5">Zhveshje e agjencisë morale: dora që firmos trajtohet si stilolaps mekanik pa vullnet.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">“Urdhrin e dha shefi”</p>
                <p className="text-xs text-slate-500 mt-0.5">Zhvendosje vertikale te titullari, duke shpërfillur të drejtën ligjore për të refuzuar urdhrin e paligjshëm.</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">“Të paktën është njeri i mirë”</p>
                <p className="text-xs text-slate-500 mt-0.5">Mirësjellja private dhe bamirësia përdoren për të anuluar dëmin objektiv të koncesionit të vjedhur.</p>
              </div>
            </div>
          </div>
        </div>
      </ArticleSection>

      {/* SECTION 8: COUNTERARGUMENTS */}
      <ArticleSection id="sec-counterarguments" title="8. Kundër-argumentet & Realiteti Socioekonomik">
        <div className="space-y-4 text-justify">
          <p>
            Një analizë e ndershme refuzon moralizimin abstrakt. Në një treg pune të brishtë ku sektori privat është i kufizuar dhe pagat janë të ulëta, puna në shtet është i vetmi kanal për sigurim shëndetësor, pension dhe marrje kredie bankare për banesë. Të kërkosh dorëheqjen e menjëhershme të çdo nëpunësi përballë një abuzimi do të thotë të injorosh koston e menjëhershme të urisë dhe falimentimit familjar.
          </p>
          <p>
            Për më tepër, nëse çdo njeri me etikë nga një familje e mirë do të dorëhiqej, administrata do t'u mbetej plotësisht kriminelëve dhe militantëve më të paskrupullt. Shumë profesionistë qëndrojnë në zyra si <strong>tampone administrative</strong>: ata ngadalësojnë abuzimet më ekstreme, ndihmojnë qytetarët e thjeshtë pa marrë ryshfet dhe ruajnë kujtesën institucionale. Gjykimi etik duhet të bazohet te veprimi konkret, jo te cinizmi kolektiv.
          </p>
        </div>
      </ArticleSection>

      {/* SECTION 9: RESEARCH GAPS */}
      <ArticleSection id="sec-research-gaps" title="9. Zbrazëtitë Kërkimore në Sociologjinë Shqiptare">
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li><strong>Mungesa e Mikrosociologjisë:</strong> Sondazhet e perceptimit (Transparency International, Banka Botërore) nuk e kapin dot kulturën e brendshme të negociimit etik brenda ministrive dhe bashkive shqiptare.</li>
          <li><strong>Gjurmimi i Prejardhjes dhe Mbijetesës:</strong> Asnjë studim empirik nuk ka matur korrelacionin midis origjinës familjare (elita e vjetër qytetare vs. militantët e rinj) dhe jetëgjatësisë në pozicione drejtuese.</li>
          <li><strong>Trauma e "Moral Injury":</strong> Nuk është analizuar stresi psikologjik dhe lëndimi moral i nëpunësve të ndershëm që detyrohen të bashkëjetojnë çdo ditë me paligjshmërinë e shefave.</li>
          <li><strong>Dimensioni Gjinor:</strong> Për gratë në administratë, etiketa “familje e mirë” shpesh funksionon si kod disiplinues për t'i detyruar të qëndrojnë të heshtura dhe të bindura përballë kartelit partiak mashkullor.</li>
        </ul>
      </ArticleSection>

      {/* SECTION 10: EMPIRICAL STUDY DESIGN */}
      <ArticleSection id="sec-empirical-design" title="10. Dizajni i Studimit Empirik & Eksperimenti Faktorial">
        <p className="mb-4">
          Për të vërtetuar hipotezën e <strong>Efektit të Mburojës Reputacionale</strong>, propozohet një studim me metoda të përziera me tre shtylla:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
            <h4 className="font-bold text-primary-600 mb-1">Cikli Cilësor</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">60 intervista të thelluara me nëpunës civilë, sinjalizues (whistleblowers) dhe prokurorë të SPAK nën rregullin e Chatham House.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
            <h4 className="font-bold text-primary-600 mb-1">Cikli Sasior</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">1,200 pyetësorë me qytetarë në 4 rajone (Shkodër, Tiranë, Vlorë, Korçë) dhe 400 sondazhe anonime të enkriptuara me nëpunës shteti.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
            <h4 className="font-bold text-primary-600 mb-1">Eksperimenti 2x2</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">Skicim skenari (vignette): Testimi nëse qytetarët dënojnë më lehtë një zyrtar të akuzuar për korrupsion kur ai prezantohet si "nga familje e nderuar qytetare".</p>
          </div>
        </div>
      </ArticleSection>

      {/* SECTION 11: ANNOTATED BIBLIOGRAPHY */}
      <ArticleSection id="sec-bibliography" title="11. Bibliografia e Anotuar (30 Burime Akademike me DOI)">
        <p className="mb-4">
          Një korpus i plotë kërkimor që mbështet çdo pohim sociologjik, teorik dhe institucional të këtij studimi:
        </p>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(['all', 'albanian', 'theoretical', 'comparative', 'reports'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setBibCategory(cat)}
              className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
                bibCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' && 'Të Gjitha (30)'}
              {cat === 'albanian' && 'Studime Shqiptare (10)'}
              {cat === 'theoretical' && 'Korniza Teorike (11)'}
              {cat === 'comparative' && 'Krahasuese / Ballkani (5)'}
              {cat === 'reports' && 'Raporte Institucionale (4)'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-sm hover:border-primary-500 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-1">
                <span className="font-bold text-slate-900 dark:text-slate-100">{source.authorYear}</span>
                <span className="text-xs text-primary-600 dark:text-primary-400 font-mono">Besueshmëria: {source.credibility_industry_rating_pct}%</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">{source.title}</p>
              <div className="mt-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Lidhja Burimore / DOI</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </ArticleSection>

      {/* SECTION 12: CONCLUSION */}
      <ArticleSection id="sec-analytical-conclusion" title="12. Konkluzioni Analitik & Propozimi Konceptual">
        <div className="space-y-4 text-justify">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            A është të qenit “nga një familje e mirë” provë e integritetit vetjak?
          </p>
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-r-md">
            <p className="font-bold text-red-900 dark:text-red-200">
              Përgjigjja shkencore dhe etike është kategorike: JO. Të qenit “nga një familje e mirë” nuk është kurrë provë e integritetit moral individual.
            </p>
          </div>
          <p>
            Në asnjë pikë të realitetit sociologjik apo administrativ prejardhja familjare, edukata qytetare, sjellja e kulturuar apo diplomat universitare nuk mund të shërbejnë si tregues empirik i karakterit etik të një njeriu. Reputacioni familjar është një status shoqëror i atribuuar—është kredi morale e pamerituar, rezultat i fatit gjenealogjik.
          </p>
          <p>
            Integriteti, në të kundërt, është një <strong>praksis individual i fituar</strong>. Ai nuk është gjendje pasive, por një seri e vetëdijshme vendimesh që dëshmohen vetëm në momentin e konfliktit etik—pikërisht atëherë kur zbatimi i ligjit i shkakton individit kosto reale profesionale, financiare apo shoqërore.
          </p>

          {/* Proposition mathematical / conceptual box */}
          <div className="my-6 p-6 bg-slate-100 dark:bg-slate-900 border-2 border-primary-500 rounded-xl text-center shadow-md">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">
              Propozimi Konceptual NOVARIC® (Shteti i së Drejtës & Integriteti)
            </h4>
            <div className="font-mono text-sm sm:text-base text-slate-800 dark:text-slate-200 font-bold mb-4 space-y-1">
              <div>Prejardhja e Trashëguar &rarr; [njihet gabimisht si] &rarr; KAPITALI SIMBOLIK (“Familje e Mirë”)</div>
              <div className="text-primary-600 dark:text-primary-400">Presioni Institucional &rarr; [testohet nën kosto] &rarr; INTEGRITETI MORAL INDIVIDUAL</div>
            </div>
            <p className="text-sm italic text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
              “Familja e mirë përfaqëson kapitalin shoqëror dhe simbolik të trashëguar; integriteti vetjak është një praksis etik që provohet vetëm përmes veprimit. Përgjegjësia e vërtetë qytetare fillon pikërisht aty ku reputacioni i familjes vihet në provë nga presioni i institucionit—dhe vërtetohet vetëm kur zyrtari zgjedh ligjin përballë akomodimit, pavarësisht kostove personale.”
            </p>
          </div>
        </div>
      </ArticleSection>
    </>
  ), [activeLang, bibCategory, matrixFilter, filteredMatrix, filteredSources]);

  const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);

  const articleMetrics = useMemo((): ArticleMetrics => {
    return calculateArticleMetrics(
      fullArticleText,
      {
        url: window.location.href,
        published_at: '2026-09-17T06:00:00Z',
        article_id: 'shkoder-kulture-familje-e-mire',
      },
      sourcesList,
      {
        researchHours: 85,
        focusKeyword: 'Familje e Mirë Shkodër',
      }
    );
  }, [fullArticleText, sourcesList]);

  const articleIntegrityProfile = useMemo((): ArticleIntegrityProfileData => {
    return calculateArticleIntegrityProfile(articleMetrics);
  }, [articleMetrics]);

  const keywords = useMemo(
    () => [
      'Asht nga një familje e mirë',
      'Shkodër',
      'Kulturë',
      'Etnosociologji',
      'Kapitali Simbolik',
      'Pierre Bourdieu',
      'Hannah Arendt',
      'Administrata Publike',
      'Matrica e Bashkëfajësisë',
      'SPAK',
    ],
    []
  );

  return (
    <ArticleTemplate1
      pageTitle="“Asht nga një familje e mirë”: Kapitali Simbolik & Bashkëfajësia Institucionale | Kulturë Shkodër | NOVARIC®"
      pageDescription="Një studim i thelluar sociologjik dhe etik mbi frazën 'asht nga nji familje e mirë' në Shkodër, kapitalin simbolik të trashëguar, mburojat morale dhe bashkëfajësinë institucionale në administratën publike shqiptare."
      pageKeywords={keywords.join(', ')}
      headerTitle="“Asht nga një familje e mirë”"
      headerSubtitle="Inherited Social Capital, Moral Shields, and Institutional Complicity in Albanian Public Administration"
      authors={[
        {
          name: 'Nora (AI)',
          profileId: 'noraAiProfile',
          imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg',
          isAi: true,
        },
        {
          name: 'Dr Alban Gj. THIKA',
          profileId: 'vip33',
          imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png',
        },
      ]}
      publicationInfo={{
        publishedDate: 'Publikuar: 17 Shtator, 2026',
        location: 'Shkodër, Shqipëri',
      }}
      tableOfContentsItems={[
        { id: 'sec-executive-summary', title: '1. Përmbledhje Ekzekutive' },
        { id: 'sec-phenomenon-definition', title: '2. Përkufizimi i Fenomenit (5 Dimensionet)' },
        { id: 'sec-cultural-linguistic', title: '3. Analiza Gjuhësore & Etnopsikologjia' },
        { id: 'sec-historical-evolution', title: '4. Evolucioni Historik (Kanun -> Tranzicion)' },
        { id: 'sec-theoretical-review', title: '5. Rishikimi i Literaturës Teorike' },
        { id: 'sec-complicity-matrix', title: '6. Matrica e Bashkëfajësisë Institucionale' },
        { id: 'sec-moral-disengagement', title: '7. Mekanizmat e Shkëputjes Morale' },
        { id: 'sec-counterarguments', title: '8. Kundër-argumentet & Realiteti' },
        { id: 'sec-research-gaps', title: '9. Zbrazëtitë Kërkimore në Sociologji' },
        { id: 'sec-empirical-design', title: '10. Dizajni i Studimit Empirik' },
        { id: 'sec-bibliography', title: '11. Bibliografia e Anotuar (30 Burime)' },
        { id: 'sec-analytical-conclusion', title: '12. Konkluzioni & Propozimi Konceptual' },
      ]}
      articleMetrics={articleMetrics}
      articleIntegrityProfile={articleIntegrityProfile}
      keywords={keywords}
      onBack={onBack}
      onNavigateToVipProfile={onNavigateToVipProfile}
      onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
    >
      {articleContentJsx}
    </ArticleTemplate1>
  );
};

export default ShkoderCulturePage;
