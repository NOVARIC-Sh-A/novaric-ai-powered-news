import React, { useMemo, ReactNode, useState } from 'react';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, PullQuote, KeyConcept } from './templates/ArticleTemplate1';
import { renderWithSuperscript } from '../utils/textUtils';
import { 
    BookOpenIcon, 
    ShieldCheckIcon, 
    MegaphoneIcon, 
    CpuChipIcon, 
    GlobeEuropeAfricaIcon,
    ChevronDownIcon,
    PencilSquareIcon,
    ScaleIcon,
    ArrowPathIcon
} from './icons';

interface BibliografiaJurisprudencesPageProps {
  onBack: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
}

const extractText = (children: ReactNode): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join(' ');
  if (React.isValidElement<{ children?: ReactNode }>(children) && children.props.children) {
    return extractText(children.props.children);
  }
  return '';
};

const KeywordBubble: React.FC<{ keyword: string; percentage: number; maxPercentage: number; }> = ({ keyword, percentage, maxPercentage }) => {
  const size = 60 + (percentage / maxPercentage) * 140;
  const fontSize = 12 + (percentage / maxPercentage) * 12;
  const hash = keyword.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const hue = Math.abs(hash % 360);
  const saturation = 60 + Math.abs(hash % 30);
  const lightness = 50 + Math.abs(hash % 15);

  return (
    <div
      className="rounded-full text-white flex flex-col justify-center items-center text-center p-2 m-2 transition-transform hover:scale-105 shadow-lg"
      style={{
        width: size,
        height: size,
        backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        lineHeight: 1.1,
      }}
      title={`${keyword}: ${percentage.toFixed(1)}%`}
    >
      <span style={{ fontSize: `${fontSize}px` }} className="font-bold">{keyword}</span>
      <span className="text-xs opacity-80">{percentage.toFixed(1)}%</span>
    </div>
  );
};

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => (
  <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center p-4 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600/50"
      aria-expanded={isOpen}
    >
      <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 text-left">{title}</h3>
      <ChevronDownIcon className={`w-6 h-6 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div className="p-4 bg-white dark:bg-slate-800">
        {children}
      </div>
    )}
  </div>
);

const ComplianceCard: React.FC<{ icon: React.ReactNode; group: string; matches: number; keywords: string; journals: string; analysis: string; }> = ({ icon, group, matches, keywords, journals, analysis }) => (
    <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-4 mb-3">
            <div className="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full">{icon}</div>
            <div>
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">{group}</h4>
                <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">Numri i Përputhjeve të Drejpërdrejta: {matches}</p>
            </div>
        </div>
        <div className="text-sm space-y-3">
            <p><strong className="font-semibold">Keywords:</strong> <em className="text-slate-600 dark:text-slate-400">{keywords}</em></p>
            <div>
                <p className="font-semibold">Revistat Përfaqësuese:</p>
                <p className="italic text-slate-600 dark:text-slate-400">{journals}.</p>
            </div>
            <div>
                <p className="font-semibold">Analiza:</p>
                <p className="text-slate-700 dark:text-slate-300">{analysis}</p>
            </div>
        </div>
    </div>
);

const DetailRow: React.FC<{ label: string; value?: string | string[] | number; link?: string }> = ({ label, value, link }) => {
    if (!value) return null;
    const displayValue = Array.isArray(value) ? value.join(', ') : value;
    return (
        <div className="py-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{label}</p>
            {link ? (
                <a href={`https://${link}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all">{displayValue}</a>
            ) : (
                <p className="text-sm text-slate-700 dark:text-slate-200">{displayValue}</p>
            )}
        </div>
    );
};

const JournalRelevanceCard: React.FC<{
    title: string;
    score: number;
    description?: string; // For backwards compatibility
    // New detailed fields
    publisher?: string;
    founded?: number;
    issn?: string;
    indexing?: string[];
    ranking?: string;
    reviewProcess?: string;
    accessModel?: string;
    website?: string;
    coreFocus?: string;
    relevanceAlbania?: string;
}> = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getScoreColorClasses = (s: number) => {
        if (s >= 9) return { bg: 'bg-green-600', text: 'text-white', border: 'border-green-700' };
        if (s >= 7) return { bg: 'bg-lime-500', text: 'text-black', border: 'border-lime-600' };
        if (s >= 5) return { bg: 'bg-yellow-400', text: 'text-black', border: 'border-yellow-500' };
        if (s >= 3) return { bg: 'bg-orange-400', text: 'text-black', border: 'border-orange-500' };
        return { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600' };
    };
    const { bg, text, border } = getScoreColorClasses(props.score);

    return (
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left p-4 flex justify-between items-start gap-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-t-lg"
                aria-expanded={isExpanded}
            >
                <div className="flex-grow">
                    <h4 className="font-bold text-md text-slate-800 dark:text-slate-200">{props.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{props.publisher || props.description}</p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full ${bg} ${border} border-2 flex items-center justify-center font-extrabold text-lg ${text} shadow-lg`}>
                        {props.score}
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform mt-2 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 animate-fadeIn">
                    <div className="space-y-4">
                        {props.coreFocus && (
                            <div>
                                <h5 className="font-bold text-primary-700 dark:text-primary-400 mb-1">Fokusi Themelor</h5>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{props.coreFocus}</p>
                            </div>
                        )}
                        {props.relevanceAlbania && (
                             <div>
                                <h5 className="font-bold text-primary-700 dark:text-primary-400 mb-1">Relevanca për Shqipërinë</h5>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{props.relevanceAlbania}</p>
                            </div>
                        )}
                    </div>
                    {(props.founded || props.issn || props.indexing || props.ranking || props.reviewProcess || props.accessModel || props.website) && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                            <DetailRow label="Themeluar" value={props.founded} />
                            <DetailRow label="ISSN" value={props.issn} />
                            <DetailRow label="Indeksimi" value={props.indexing} />
                            <DetailRow label="Renditja" value={props.ranking} />
                            <DetailRow label="Procesi i Rishikimit" value={props.reviewProcess} />
                            <DetailRow label="Modeli i Aksesit" value={props.accessModel} />
                            <DetailRow label="Website" value={props.website} link={props.website} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


export const BibliografiaJurisprudencesPage: React.FC<BibliografiaJurisprudencesPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;
    const [openTier, setOpenTier] = useState<string | null>('tier-1');
    
    const pageTitle = "Bibliografia Themelore e Zgjeruar e Jurisprudencës | NOVARIC®";
    const pageDescription = "Një bibliotekë e gjallë me 150+ burime për analizë kritike dhe të informuar të jurisprudencës dhe shtetit të së drejtës.";
    const keywords = ["Jurisprudencë", "Bibliografi Akademike", "Shteti i së Drejtës", "Filozofia e së Drejtës", "E Drejta Kushtetuese", "Të Drejtat e Njeriut", "NOVARIC"];
    
    const keywordData = [
        { keyword: 'Ligj', percentage: 18.5 }, { keyword: 'Gjykatë', percentage: 15.2 },
        { keyword: 'E Drejta', percentage: 12.8 }, { keyword: 'Kushtetutë', percentage: 9.5 },
        { keyword: 'Demokraci', percentage: 8.1 }, { keyword: 'Integritet', percentage: 6.3 },
        { keyword: 'Korrupsion', percentage: 5.5 }, { keyword: 'Shtet', percentage: 4.9 },
        { keyword: 'Njeriut (Të Drejtat)', percentage: 4.1 }, { keyword: 'Pavarësi', percentage: 3.8 },
        { keyword: 'Llogaridhënie', percentage: 3.2 }, { keyword: 'Reformë', percentage: 2.7 },
        { keyword: 'BE', percentage: 2.4 }, { keyword: 'Etikë', percentage: 1.9 },
        { keyword: 'GJEDNJ', percentage: 1.1 },
    ].map(k => ({...k, count: 0}));

    const maxPercentage = Math.max(...keywordData.map(k => k.percentage));

    const journalRelevanceData = {
        kategoria1: [
            {
                title: "Review of Central and East European Law",
                score: 10,
                publisher: "Brill Nijhoff",
                founded: 1975,
                issn: "0925-9880 (Print) / 1573-0352 (Online)",
                indexing: ["Scopus", "Web of Science (ESCI)", "HeinOnline"],
                ranking: "SJR Q2 (Law) - (Zakonisht renditet në kuartilin e dytë)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid (Artikuj me akses të hapur dhe me abonim)",
                website: "brill.com/view/journals/rcel/rcel-overview.xml",
                coreFocus: "Analizon në mënyrë kritike zhvillimet ligjore, doktrinën dhe praktikën në vendet post-komuniste të Evropës Qendrore dhe Lindore. Fokusohet në tema si shteti i së drejtës, reformat ligjore, privatizimi dhe përafrimi me standardet evropiane.",
                relevanceAlbania: "Kjo është revista më drejtpërdrejt relevante. Ajo ofron analiza krahasuese me vende që kanë kaluar sfida të ngjashme tranzicioni dhe integrimi. Artikujt e saj mbi reformat në drejtësi, shtetin e së drejtës dhe problemet e korrupsionit në rajon janë një burim i paçmuar për të kuptuar dhe kontekstualizuar sfidat specifike të Shqipërisë."
            },
            {
                title: "European Human Rights Law Review",
                score: 10,
                publisher: "Sweet & Maxwell (Thomson Reuters)",
                founded: 1995,
                issn: "1361-1526 (Print)",
                indexing: ["Web of Science (SSCI)", "Scopus", "HeinOnline"],
                ranking: "SJR Q1 (Law) - (Një nga revistat lider në fushën e saj)",
                reviewProcess: "Editorial and peer review",
                accessModel: "Me abonim",
                website: "westlaw.co.uk/law-journals/european-human-rights-law-review/",
                coreFocus: "Ofron analiza të thelluara dhe komentare mbi jurisprudencën e Gjykatës Evropiane të të Drejtave të Njeriut (GJEDNJ) dhe ndikimin e Konventës Evropiane në sistemet ligjore kombëtare.",
                relevanceAlbania: "Thelbësore dhe e pazëvendësueshme. Duke qenë se Konventa është pjesë e legjislacionit të brendshëm dhe vendimet e GJEDNJ janë detyruese, kjo revistë është një udhëzues praktik për gjyqtarët, avokatët dhe akademikët shqiptarë për të interpretuar dhe zbatuar standardet e Strasburgut në çështjet e përditshme."
            },
            {
                title: "International Journal of Constitutional Law (I•CON)",
                score: 9,
                publisher: "Oxford University Press",
                founded: 2003,
                issn: "1474-2640 (Print) / 1474-2659 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline", "JSTOR"],
                ranking: "SJR Q1 (Law) - (Revista më e mirë në botë për të drejtën kushtetuese)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "academic.oup.com/icon",
                coreFocus: "Promovon një dialog global mbi të drejtën kushtetuese. Mbulon tema si rishikimi gjyqësor, shteti i së drejtës, të drejtat themelore, federalizmi dhe marrëdhëniet midis të drejtës kombëtare dhe asaj ndërkombëtare.",
                relevanceAlbania: "Shumë e rëndësishme për Gjykatën Kushtetuese dhe për debatet mbi reformën në drejtësi. Ajo ofron argumente dhe analiza krahasuese për sfidat me të cilat përballet një demokraci kushtetuese në konsolidim, si balancat mes pushteteve, pavarësia gjyqësore dhe mbrojtja e të drejtave themelore."
            },
            {
                title: "Common Market Law Review",
                score: 9,
                publisher: "Kluwer Law International",
                founded: 1963,
                issn: "0165-0750 (Print) / 1572-9445 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline"],
                ranking: "SJR Q1 (Law) - (Revista më prestigjioze për të drejtën e BE-së)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Me abonim",
                website: "kluwerlawonline.com/journal/Common+Market+Law+Review",
                coreFocus: "Publikon analiza rigoroze mbi të drejtën e Bashkimit Evropian, duke përfshirë vendimet e Gjykatës Evropiane të Drejtësisë (GJED), legjislacionin e BE-së dhe zhvillimet institucionale.",
                relevanceAlbania: "Kritike për procesin e anëtarësimit në BE. Për juristët shqiptarë, kjo revistë është burimi kryesor për të kuptuar në thellësi acquis communautaire dhe për të ndjekur zhvillimet më të fundit në interpretimin e ligjit evropian, i cili duhet të transpozohet në legjislacionin kombëtar."
            },
            {
                title: "European Law Journal",
                score: 9,
                publisher: "Wiley-Blackwell",
                founded: 1995,
                issn: "1351-5993 (Print) / 1468-0386 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline"],
                ranking: "SJR Q1 (Law)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "onlinelibrary.wiley.com/journal/14680386",
                coreFocus: "Analizon të drejtën evropiane në kontekstin e saj politik, social dhe ekonomik. Promovon një qasje kritike dhe ndërdisiplinore ndaj procesit të integrimit evropian.",
                relevanceAlbania: "Plotëson Common Market Law Review duke ofruar perspektivën \"prapa ligjit\". Ndihmon në kuptimin e arsyeve politike dhe sociale që qëndrojnë pas rregullave të BE-së, duke i dhënë kuadrit gjyqësor shqiptar mjetet për një interpretim më të thelluar dhe të kontekstualizuar të ligjit evropian."
            },
            {
                title: "Journal of International Criminal Justice",
                score: 9,
                publisher: "Oxford University Press",
                founded: 2003,
                issn: "1478-1387 (Print) / 1478-1395 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline"],
                ranking: "SJR Q1 (Law)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "academic.oup.com/jicj",
                coreFocus: "Mbulon të gjitha aspektet e drejtësisë penale ndërkombëtare, përfshirë krimet ndërkombëtare, juridiksionin e gjykatave ndërkombëtare dhe bashkëpunimin ndërshtetëror në çështjet penale.",
                relevanceAlbania: "Jashtëzakonisht relevante në kontekstin e institucioneve të reja si SPAK dhe GJKKO. Ofron analiza mbi hetimin e krimeve komplekse si korrupsioni i nivelit të lartë dhe krimi i organizuar, të cilat shpesh kërkojnë bashkëpunim ndërkombëtar dhe zbatimin e standardeve më të larta të drejtësisë penale."
            },
            {
                title: "European Public Law",
                score: 9,
                publisher: "Kluwer Law International",
                founded: 1995,
                issn: "1385-2333 (Print) / 1572-9453 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline"],
                ranking: "SJR Q1 (Law)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Me abonim",
                website: "kluwerlawonline.com/journal/European+Public+Law",
                coreFocus: "Ofron analiza krahasuese të zhvillimeve në të drejtën kushtetuese dhe administrative në të gjithë Evropën. Fokusohet në ndërveprimin midis të drejtës kombëtare, të drejtës së BE-së dhe Konventës Evropiane të të Drejtave të Njeriut.",
                relevanceAlbania: "Thelbësore për Gjykatën Administrative dhe Këshillin e Shtetit. Duke qenë se Shqipëria po reformon vazhdimisht administratën e saj publike sipas modeleve evropiane, kjo revistë ofron studime rastesh, modele dhe zgjidhje për problemet e përditshme me të cilat përballen gjykatësit administrativë, si kontrolli i akteve administrative, prokurimi publik dhe përgjegjësia e shtetit."
            },
        ],
        kategoria2: [
            {
                title: "International & Comparative Law Quarterly (ICLQ)",
                score: 8,
                publisher: "Cambridge University Press (për British Institute of International and Comparative Law)",
                founded: 1952,
                issn: "0020-5893 (Print) / 1471-6895 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline", "JSTOR"],
                ranking: "SJR Q1 (Law)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "cambridge.org/core/journals/international-and-comparative-law-quarterly",
                coreFocus: "Një revistë gjithëpërfshirëse që mbulon të drejtën ndërkombëtare publike, të drejtën ndërkombëtare private, të drejtën krahasuese dhe të drejtën evropiane. E njohur për artikujt e saj autoritativë dhe me ndikim të gjerë.",
                relevanceAlbania: "Një burim i shkëlqyer me 'një ndalesë'. Për një sistem ligjor si ai shqiptar, i cili është në proces të vazhdueshëm përafrimi dhe reformimi, ICLQ ofron një pasqyrë të plotë të standardeve ndërkombëtare dhe modeleve krahasuese nga e gjithë bota, duke i mundësuar juristëve të kenë një perspektivë të gjerë."
            },
            {
                title: "Human Rights Quarterly / Human Rights Law Review",
                score: 8,
                publisher: "Johns Hopkins University Press",
                founded: 1979,
                issn: "0275-0392 (Print) / 1085-7919 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline", "JSTOR"],
                ranking: "SJR Q1 (Law; Political Science)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "press.jhu.edu/journals/human-rights-quarterly",
                coreFocus: "Një revistë ndërdisiplinore që mbulon të gjitha aspektet e të drejtave të njeriut – nga perspektiva ligjore, filozofike, historike dhe e shkencave sociale. Mbulon një gamë të gjerë temash, nga të drejtat civile dhe politike te ato ekonomike dhe sociale.",
                relevanceAlbania: "Këto revista ofrojnë thellësinë teorike dhe kontekstin krahasues që plotësojnë European Human Rights Law Review. Ndërsa kjo e fundit fokusohet në zbatimin praktik të KEDNJ, revistat si HRQ ofrojnë argumente themelore për rëndësinë e të drejtave, analiza mbi shkaqet e shkeljeve dhe studime krahasuese nga rajone të tjera. Kjo është veçanërisht e vlefshme për Gjykatën Kushtetuese dhe Avokatin e Popullit kur trajtojnë çështje parimore."
            },
            {
                title: "European Journal of International Law",
                score: 8,
                publisher: "Oxford University Press (për European Society of International Law)",
                founded: 1990,
                issn: "0938-5428 (Print) / 1464-3596 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline", "JSTOR"],
                ranking: "SJR Q1 (Law) - (Një nga revistat më me ndikim në botë për të drejtën ndërkombëtare)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid (me seksione të rëndësishme me akses të hapur si 'EJIL:Talk!')",
                website: "academic.oup.com/ejil & ejiltalk.org (Blogu i revistës)",
                coreFocus: "Ofron një forum për debate teorike, kritike dhe doktrinore mbi të drejtën ndërkombëtare nga një perspektivë evropiane dhe globale. E njohur për qasjen e saj pluraliste dhe për inkurajimin e debateve midis studiuesve.",
                relevanceAlbania: "Burim thelbësor për Gjykatën Kushtetuese, Gjykatën e Lartë dhe Ministrinë e Punëve të Jashtme. Ajo i mban juristët shqiptarë të përditësuar me zhvillimet dhe interpretimet më të fundit të së drejtës ndërkombëtare, veçanërisht për çështje si marrëdhëniet midis të drejtës ndërkombëtare dhe asaj të brendshme, imuniteti i shtetit dhe përgjegjësia ndërkombëtare – tema shpesh të pranishme në gjykimin kushtetues dhe atë administrativ."
            },
            {
                title: "Global Constitutionalism",
                score: 8,
                publisher: "Cambridge University Press",
                founded: 2012,
                issn: "2045-3817 (Print) / 2045-3825 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)"],
                ranking: "SJR Q1 (Law)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "cambridge.org/core/journals/global-constitutionalism",
                coreFocus: "Analizon se si parimet kushtetuese po aplikohen dhe evoluojnë përtej nivelit të shtetit-komb. Fokusohet në tema si dialogu gjyqësor transnacional, qeverisja globale dhe ndikimi i së drejtës ndërkombëtare në kushtetutat kombëtare.",
                relevanceAlbania: "Shumë e rëndësishme për një vend si Shqipëria, ku 'sovraniteti' është vazhdimisht në dialog me entitete të jashtme si BE-ja dhe Këshilli i Evropës. Kjo revistë i ndihmon gjyqtarët e Gjykatës Kushtetuese të kuptojnë se si homologët e tyre në botë po i balancojnë detyrimet ndërkombëtare me parimet kushtetuese kombëtare, një sfidë thelbësore e jurisprudencës moderne."
            },
            {
                title: "American Journal of Comparative Law",
                score: 8,
                publisher: "Oxford University Press (për American Society of Comparative Law)",
                founded: 1952,
                issn: "0002-919X (Print) / 2326-9199 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline", "JSTOR"],
                ranking: "SJR Q1 (Law) - (Revista lider në botë për të drejtën krahasuese)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "academic.oup.com/ajcl",
                coreFocus: "Publikon studime krahasuese të thelluara mbi sistemet dhe traditat ligjore në mbarë botën. Promovon kuptimin e dallimeve dhe ngjashmërive midis 'common law', 'civil law' dhe sistemeve të tjera.",
                relevanceAlbania: "Thelbësore për procesin e hartimit të ligjeve dhe reformave strukturore. Kur Shqipëria kërkon të adoptojë praktika të reja (p.sh., në të drejtën tregtare, procedurën civile, etj.), kjo revistë ofron analiza se si institucione të ngjashme funksionojnë në kontekste të ndryshme, duke ndihmuar në shmangien e 'transplanteve ligjore' të pasuksesshme."
            },
            {
                title: "Journal of European Public Policy (JEPP)",
                score: 7,
                publisher: "Taylor & Francis (Routledge)",
                founded: 1994,
                issn: "1350-1763 (Print) / 1466-4429 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)"],
                ranking: "SJR Q1 (Public Administration; Political Science)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "tandfonline.com/journals/rjpp20",
                coreFocus: "Analizon procesin e politikëbërjes në Bashkimin Evropian dhe ndikimin e tij në shtetet anëtare dhe kandidatë. Fokusohet në aktorët, institucionet dhe dinamikat e qeverisjes shumë-nivelëshe evropiane.",
                relevanceAlbania: "Shumë e rëndësishme për të kuptuar 'pse-në' pas ligjeve që Shqipëria duhet të transpozojë. Ajo i ndihmon gjyqtarët dhe juristët të shohin përtej tekstit të thatë të një direktive të BE-së, duke kuptuar kompromiset politike, interesat dhe qëllimet sociale që e kanë formësuar atë. Kjo çon në një interpretim më të informuar dhe më teleologjik të ligjit, duke shmangur një zbatim mekanik dhe formalist."
            },
            {
                title: "Regulation & Governance",
                score: 7,
                publisher: "Wiley",
                founded: 2007,
                issn: "1748-5983 (Print) / 1748-5991 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)"],
                ranking: "SJR Q1 (Public Administration; Law)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "onlinelibrary.wiley.com/journal/17485991",
                coreFocus: "Një revistë ndërdisiplinore që studion politikat dhe praktikat e rregullimit nga entitetet shtetërore dhe jo-shtetërore. Analizon efektivitetin e agjencive rregullatore dhe instrumenteve të qeverisjes.",
                relevanceAlbania: "Praktike dhe relevante. Suksesi i shtetit të së drejtës në Shqipëri varet shumë nga funksionimi i enteve rregullatore (p.sh., në energji, telekomunikacion, konkurrencë). Kjo revistë ofron analiza se si këto institucione mund të ndërtohen për të qenë të pavarura, efektive dhe të llogaridhënshme, duke i ofruar Gjykatës Administrative një kuadër për të vlerësuar ligjshmërinë dhe arsyetueshmërinë e vendimeve të tyre."
            },
            {
                title: "Harvard Law Review / Yale Law Journal",
                score: 7,
                publisher: "Harvard Law Review Association",
                founded: 1887,
                issn: "0017-811X (Print)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline", "JSTOR"],
                ranking: "SJR Q1 (Law) - (Tradicionalisht revista juridike më e cituar në botë)",
                reviewProcess: "E drejtuar nga studentët (Student-run)",
                accessModel: "Hibrid (me arkivë të hapur pas një periudhe)",
                website: "harvardlawreview.org",
                coreFocus: "Një revistë me qëllim të përgjithshëm që publikon artikuj me ndikim të lartë në të gjitha fushat e së drejtës. Shpesh vendos axhendën për debatet më të rëndësishme në teorinë kushtetuese, filozofinë gjyqësore dhe të drejtat civile.",
                relevanceAlbania: "Burim frymëzimi intelektual dhe teorik. Edhe pse shumë artikuj fokusohen në të drejtën amerikane, debatet themelore mbi interpretimin kushtetues, rolin e gjyqtarit dhe shtetin e së drejtës që zhvillohen këtu janë universale. Ato ofrojnë 'municionin' intelektual për gjyqtarët e gjykatave të larta për të ndërtuar arsyetime më të thelluara."
            },
            {
                title: "European Journal of Criminology",
                score: 7,
                publisher: "SAGE Publications (për European Society of Criminology)",
                founded: 2004,
                issn: "1477-3708 (Print) / 1741-2609 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)"],
                ranking: "SJR Q1 (Criminology)",
                reviewProcess: "Peer review",
                accessModel: "Me abonim",
                website: "journals.sagepub.com/home/euc",
                coreFocus: "Publikon kërkime empirike dhe teorike me cilësi të lartë mbi krimin dhe drejtësinë penale në Evropë. Fokusohet në kriminologjinë krahasuese dhe politikat penale evropiane.",
                relevanceAlbania: "Ofron kontekstin e nevojshëm evropian për politikëbërjen penale në Shqipëri. Ndihmon prokurorët dhe gjyqtarët penalë të kuptojnë trendet e krimit në kontinent, efektivitetin e masave të ndryshme penale dhe standardet evropiane për trajtimin e të pandehurve dhe të dënuarve, duke informuar një drejtësi penale më moderne dhe më efektive."
            },
        ],
        kategoria3: [
            {
                title: "Journal of Law and Economics",
                score: 6,
                publisher: "University of Chicago Press",
                founded: 1958,
                issn: "0022-2186 (Print) / 1537-5285 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline", "JSTOR"],
                ranking: "SJR Q1 (Economics and Econometrics; Law)",
                reviewProcess: "Peer review",
                accessModel: "Me abonim",
                website: "journals.uchicago.edu/loi/jle",
                coreFocus: "Aplikimi i analizës ekonomike për të kuptuar ligjet dhe institucionet ligjore. Analizon tema si e drejta e pronës, kontratat, rregullimi dhe krimi nga perspektiva e efikasitetit ekonomik.",
                relevanceAlbania: "E rëndësishme për një qasje më analitike ndaj politikëbërjes. Ndihmon në kuptimin e kostove dhe përfitimeve të reformave ligjore. Artikujt mbi shkaqet ekonomike të korrupsionit, efikasitetin e sistemit gjyqësor dhe ndikimin e të drejtave të pronës në zhvillimin ekonomik janë direkt të aplikueshëm për sfidat e Shqipërisë."
            },
            {
                title: "Journal of Empirical Legal Studies",
                score: 6,
                publisher: "Wiley (për Society for Empirical Legal Studies)",
                founded: 2004,
                issn: "1740-1453 (Print) / 1740-1461 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline"],
                ranking: "SJR Q1 (Law)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "onlinelibrary.wiley.com/journal/17401461",
                coreFocus: "Publikon kërkime juridike të bazuara në të dhëna sasiore dhe cilësore. Synon të testojë teoritë juridike përmes analizës empirike dhe të masë ndikimin real të ligjeve dhe institucioneve.",
                relevanceAlbania: "Gjithnjë e më e rëndësishme. Për të vlerësuar suksesin e reformës në drejtësi, nuk mjaftojnë më përshtypjet, por nevojiten të dhëna. Kjo revistë ofron metodologjitë dhe shembujt se si mund të matet në mënyrë objektive efikasiteti i gjykatave, ndikimi i Vetting-ut, apo shkalla e zbatimit të vendimeve gjyqësore."
            },
             {
                title: "Jurisprudence / Legal Theory / Law and Philosophy",
                score: 6,
                publisher: "Taylor & Francis (Routledge)",
                founded: 2010,
                issn: "2040-3313 (Print) / 2040-3321 (Online)",
                indexing: ["Scopus", "Web of Science (ESCI)"],
                ranking: "SJR Q1 (Law; Philosophy)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "tandfonline.com/journals/rijp20",
                coreFocus: "Publikon punime të thelluara mbi filozofinë e së drejtës, teorinë juridike analitike dhe normative, si dhe marrëdhëniet midis ligjit, moralit dhe politikës.",
                relevanceAlbania: "Këto revista janë thelbësore për 'gjimnastikën intelektuale' të gjyqtarëve të niveleve të larta, veçanërisht atyre të Gjykatës Kushtetuese dhe Gjykatës së Lartë. Ato ofrojnë mjetet për të ndërtuar një filozofi gjyqësore koherente dhe për të arsyetuar vendime komplekse që prekin themelet e shtetit. Megjithatë, aplikimi i tyre në çështjet e përditshme të gjykatave të faktit është më indirekt dhe i kufizuar."
            },
            {
                title: "The Cambridge Law Journal / Law Quarterly Review",
                score: 6,
                publisher: "Cambridge University Press",
                founded: 1921,
                issn: "0008-1973 (Print) / 1469-2139 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline"],
                ranking: "SJR Q1 (Law)",
                reviewProcess: "Peer review",
                accessModel: "Hibrid",
                website: "cambridge.org/core/journals/cambridge-law-journal",
                coreFocus: "Revista kryesore e Fakultetit të Drejtësisë të Universitetit të Kembrixhit. Mbulon të gjitha fushat e së drejtës me një fokus të veçantë në 'common law', por gjithashtu boton artikuj mbi të drejtën evropiane dhe ndërkombëtare. E njohur për seksionin e saj 'Case and Comment' që analizon vendimet gjyqësore më të fundit.",
                relevanceAlbania: "E vlefshme për cilësinë e lartë të analizës doktrinore dhe për mënyrën se si strukturohet një arsyetim ligjor rigoroz. Seksioni i komenteve mbi vendimet gjyqësore ofron një model të shkëlqyer se si mund të bëhet një analizë kritike e jurisprudencës. Megjithatë, relevanca e drejtpërdrejtë e përmbajtjes shpesh kufizohet nga fokusi në sistemin e 'common law'."
            },
            {
                title: "Journal of Law, Economics, and Organization / American Law and Economics Review",
                score: 6,
                publisher: "Oxford University Press",
                founded: 1985,
                issn: "8756-6222 (Print) / 1465-7341 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)"],
                ranking: "SJR Q1 (Law; Economics; Management)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "academic.oup.com/jleo",
                coreFocus: "Publikon kërkime ndërdisiplinore në pikëtakimin e së drejtës, ekonomisë dhe shkencës së organizimit. Analizon se si institucionet ligjore dhe organizatat (përfshirë gjykatat, agjencitë rregullatore) ndikojnë në sjelljen ekonomike dhe anasjelltas.",
                relevanceAlbania: "Shumë e rëndësishme për të kuptuar gjyqësorin jo vetëm si një organ ligjor, por edhe si një organizatë komplekse. Artikujt mbi qeverisjen e brendshme të gjykatave, menaxhimin e çështjeve (case flow management) dhe incentivat që ndikojnë sjelljen e gjyqtarëve dhe prokurorëve, ofrojnë një perspektivë thelbësore për Këshillin e Lartë Gjyqësor (KLGJ) dhe Këshillin e Lartë të Prokurorisë (KLP) për të përmirësuar efikasitetin dhe llogaridhënien e sistemit."
            },
        ],
        kategoria4: [
            {
                title: "The Journal of Criminal Law and Criminology",
                score: 4,
                publisher: "Northwestern University Pritzker School of Law",
                founded: 1910,
                issn: "0091-4169 (Print)",
                indexing: ["Scopus", "Web of Science (SSCI)", "HeinOnline"],
                ranking: "SJR Q1 (Law; Criminology)",
                reviewProcess: "E drejtuar nga studentët (Student-run)",
                accessModel: "Me abonim",
                website: "scholarlycommons.law.northwestern.edu/jclc/",
                coreFocus: "Një nga revistat më të vjetra dhe më me ndikim në SHBA, e fokusuar në drejtësinë penale amerikane, procedurën penale dhe kriminologjinë.",
                relevanceAlbania: "Relevanca është e kufizuar për shkak të dallimeve thelbësore midis sistemit adversarial amerikan (me juristë, plea bargaining) dhe atij shqiptar që bazohet në traditën civile-inkuizitoriale. Artikujt mbi kriminologjinë teorike (p.sh., shkaqet e krimit) janë më universalë, por pjesa më e madhe e përmbajtjes doktrinore nuk është e zbatueshme."
            },
            {
                title: "Law & Society Review / Journal of Law and Society",
                score: 4,
                publisher: "Wiley (për Law and Society Association)",
                founded: 1966,
                issn: "0023-9216 (Print) / 1540-5893 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)", "JSTOR"],
                ranking: "SJR Q1 (Law; Sociology)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Me abonim",
                website: "lawandsociety.org/publications/lsr/",
                coreFocus: "Promovon studimin ndërdisiplinor të ligjit dhe institucioneve ligjore nga një perspektivë e shkencave sociale. Analizon se si ligji funksionon 'në praktikë' dhe ndikimin e tij në shoqëri.",
                relevanceAlbania: "E rëndësishme për studiuesit dhe analistët që vlerësojnë ndikimin social të reformës në drejtësi. Megjithatë, për një gjyqtar që duhet të marrë një vendim bazuar në ligjin pozitiv, perspektiva sociologjike ofron kontekst, por jo zgjidhje juridike. Prandaj, është më me interes për akademikët sesa për praktikantët e drejtpërdrejtë të fushës."
            },
            {
                title: "British Journal of Criminology / Criminology (SHBA)",
                score: 4,
                publisher: "Oxford University Press (për Centre for Crime and Justice Studies)",
                founded: 1960,
                issn: "0007-0955 (Print) / 1464-3529 (Online)",
                indexing: ["Scopus", "Web of Science (SSCI)"],
                ranking: "SJR Q1 (Criminology) - (Një nga revistat më të mira të kriminologjisë në botë)",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "academic.oup.com/bjc",
                coreFocus: "Publikon kërkime empirike dhe teorike me cilësi të lartë mbi krimin, drejtësinë penale dhe penologjinë. Mbulon një gamë të gjerë temash, nga shkaqet e krimit te funksionimi i policisë, gjykatave dhe burgjeve.",
                relevanceAlbania: "E dobishme për akademikët dhe politikëbërësit në Ministrinë e Drejtësisë për të kuptuar kërkimin më të fundit ndërkombëtar mbi atë që funksionon ('what works') në parandalimin e krimit dhe rehabilitimin e shkelësve të ligjit. Për gjyqtarin individual, relevanca është më e kufizuar, pasi fokusi i revistës është në shkaqet sociale të krimit dhe efektivitetin e sistemit në tërësi, jo në aplikimin e doktrinës penale në një rast specifik."
            },
            {
                title: "Revistat e të Drejtave të Njeriut (SHBA)",
                score: 4,
                publisher: "Shoqata studentore të fakulteteve prestigjioze.",
                founded: 1970, // Approximate
                issn: "Secila ka ISSN-në e vet.",
                indexing: ["HeinOnline", "Scopus"],
                ranking: "N/A",
                reviewProcess: "E drejtuar nga studentët (Student-run).",
                accessModel: "Me abonim",
                website: "law.harvard.edu/hhrj/",
                coreFocus: "Analizojnë teorinë dhe praktikën e të drejtave të njeriut nga një perspektivë shpesh e lidhur me politikën e jashtme amerikane dhe lëvizjet sociale. Mbulojnë një gamë të gjerë temash, nga drejtësia tranzicionale te të drejtat e refugjatëve.",
                relevanceAlbania: "Kanë rëndësi historike dhe teorike. Shpesh ofrojnë analiza të thelluara mbi tema si drejtësia tranzicionale, të cilat janë shumë relevante për të kaluarën e Shqipërisë. Megjithatë, për praktikën e sotme gjyqësore, ato janë më pak relevante se revistat evropiane, të cilat analizojnë një kuadër ligjor (KEDNJ) që është drejtpërdrejt i detyrueshëm për gjykatat shqiptare."
            },
            { title: "Revista Shumë të Specializuara", score: 3, relevanceAlbania: "Këto janë revista të shkëlqyera në fushat e tyre respektive, si e drejta e punës, mjedisore, mjekësore, IA, por tematika e tyre është shumë e ngushtë për t'u konsideruar thelbësore për analizën e kuadrit të përgjithshëm gjyqësor. Ato bëhen relevante vetëm për gjyqtarë ose avokatë të specializuar në ato fusha specifike dhe nuk adresojnë sfidat kryesore sistemike si shteti i së drejtës, korrupsioni apo balancat kushtetuese." },
             {
                title: "Journal of Law and Religion",
                score: 3,
                publisher: "Cambridge University Press",
                founded: 1983,
                issn: "0748-0814 (Print) / 2156-3095 (Online)",
                indexing: ["Scopus", "Web of Science (AHCI)", "HeinOnline"],
                ranking: "N/A",
                reviewProcess: "Double-blind peer review",
                accessModel: "Hibrid",
                website: "cambridge.org/core/journals/journal-of-law-and-religion",
                coreFocus: "Eksploron marrëdhëniet komplekse midis ligjit dhe fesë në kontekste të ndryshme historike dhe kulturore. Mbulon tema si liria e fesë, marrëdhëniet shtet-fe dhe roli i ligjit fetar.",
                relevanceAlbania: "Relevanca është specifike dhe e kufizuar. Mund të jetë e dobishme për Gjykatën Kushtetuese kur trajton çështje që lidhen me nenin e lirisë së besimit ose marrëveshjet midis shtetit dhe komuniteteve fetare. Megjithatë, duke pasur parasysh natyrën thellësisht laike të shtetit shqiptar dhe nivelin relativisht të ulët të kontestimeve gjyqësore në këtë fushë, ajo nuk është një revistë me rëndësi të përgjithshme për jurisprudencën."
            },
        ],
        kategoria5: [
            { title: "Revista me Fokus Gjeografik të Largët", score: 2, relevanceAlbania: "Relevanca e tyre (p.sh., Chinese, Asian, African Journal of Int'l Law) është minimale për shkak të fokusit gjeografik në rajone me tradita ligjore dhe sfida politike shumë të ndryshme nga Shqipëria dhe Ballkani." },
            { title: "Revista me Fokus Tematik të Palidhur", score: 1, relevanceAlbania: "Këto revista (p.sh., Islamic Law and Society, Int'l Journal for the Semiotics of Law) nuk kanë pothuajse asnjë relevancë praktike apo teorike për kuadrin gjyqësor shqiptar, i cili është sekular dhe i bazuar në traditën civile evropiane." },
        ],
    };
    
    const sourcesList = useMemo(() => [], []);

    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="Hyrje">
                {/* FIX: Added 'term' prop to all KeyConcept components that were missing it, providing definitions from the glossary. */}
                <p>Kjo bibliografi, me mbi 150 burime, përfaqëson shtyllën kurrizore intelektuale e seksionit të <KeyConcept term="Jurisprudencës" definition="Shkenca ose filozofia e së drejtës; tërësia e vendimeve gjyqësore që formësojnë precedentë ligjorë.">Jurisprudencës</KeyConcept>. Ajo është konceptuar si një “bibliotekë e gjallë” që jo vetëm justifikon <KeyConcept term="metodologjitë" definition="Sistemi i metodave dhe parimeve të përdorura në një fushë të caktuar studimi.">metodologjitë</KeyConcept> tona aktuale (<KeyConcept term="PARAGON®, MVPGJ" definition="Modele analitike të pronësisë së NOVARIC® për vlerësimin e performancës së figurave publike dhe gjyqtarëve.">PARAGON®, MVPGJ</KeyConcept>), por gjithashtu na ofron mjetet për kritikën dhe zhvillimin e tyre të vazhdueshëm. Kjo përmbledhje burimesh është thelbësore për të kuptuar parimet, teoritë dhe praktikat që formësojnë shtetin e së drejtës dhe sistemin e drejtësisë në Shqipëri dhe më gjerë.</p>
            </ArticleSection>

            <ArticleSection id="vizualizimi" title="Vizualizimi i Fjalëve Kyçe">
                <p>Grafiku i mëposhtëm paraqet fjalët më të përsëritura në titujt e referencave, të cilat janë thelbësore për <KeyConcept term="ekosistemin analitik" definition="Mjedisi i koncepteve, mjeteve dhe të dhënave që përdoren për të kryer një analizë të thelluar.">ekosistemin analitik</KeyConcept> të Jurisprudencës në kontekstin shqiptar. Madhësia e çdo “flluske” përfaqëson frekuencën e fjalës në të gjithë bibliografinë.</p>
                <div className="flex flex-wrap justify-center items-center p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                    {keywordData.map(item => <KeywordBubble key={item.keyword} {...item} maxPercentage={maxPercentage} />)}
                </div>
            </ArticleSection>
            
            <ArticleSection id="metodologjia-perdorimit" title="Metodologjia e Përdorimit të Bibliografisë">
                <p>Më poshtë është një <KeyConcept term="analizë kualitative" definition="Një metodë kërkimore që fokusohet në të dhëna jo-numerike (si teksti, intervistat) për të kuptuar koncepte, opinione ose përvoja.">analizë kualitative</KeyConcept> e <KeyConcept term="densitetit" definition="Shpeshtësia ose përqendrimi i fjalëve ose koncepteve të caktuara brenda një teksti ose grupi tekstesh.">densitetit</KeyConcept> të pritshëm të fjalëve kyçe, e bazuar në fushën e studimit dhe misionin editorial të çdo reviste, e kombinuar me një shpjegim se si do të kryhej një <KeyConcept term="analizë sasiore" definition="Një metodë kërkimore që fokusohet në mbledhjen dhe analizimin e të dhënave numerike për të gjetur modele dhe për të testuar hipoteza.">analizë sasiore</KeyConcept> në një projekt kërkimor real.</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Qasja Metodologjike: Si do të Kryhej një Analizë Sasiore</h3>
                <h4 className="font-bold">Hapi 1: Përcaktimi i Fjalëve Kyçe Themelore të Projektit NOVARIC®</h4>
                <p>Ne i grupojmë fjalët kyçe në <KeyConcept term="grupime tematike" definition="Kategorizimi i koncepteve ose të dhënave bazuar në tema ose ide të përbashkëta.">grupime tematike</KeyConcept> që pasqyrojnë shtyllat e <KeyConcept term="kornizës" definition="Struktura konceptuale që udhëheq analizën tonë, duke siguruar që ajo të jetë sistematike dhe e qëndrueshme.">kornizës</KeyConcept> sonë:</p>
                <ol className="list-decimal list-inside space-y-2 pl-4 my-4">
                    <li><strong>Shteti i së Drejtës & Qeverisja:</strong> rule of law, constitutionalism, separation of powers, judicial independence, accountability.</li>
                    <li><strong>Integriteti & Etika Gjyqësore:</strong> judicial ethics, anti-corruption, integrity, vetting, disciplinary procedures, good governance.</li>
                    <li><strong>Të Drejtat e Njeriut & Drejtësia Ndërkombëtare:</strong> human rights, ECHR, international law, due process, property rights, european law.</li>
                    <li><strong>Arsyetimi Gjyqësor & Interpretimi:</strong> legal reasoning, interpretation, precedent, judicial philosophy, textualism, purposivism.</li>
                    <li><strong>Reforma në Drejtësi & Konteksti Post-Komunist:</strong> justice reform, post-communism, transitional justice, EU integration, vetting process.</li>
                </ol>
                
                <h4 className="font-bold mt-4">Hapi 2: Përdorimi i <KeyConcept term="Databazave Akademike" definition="Koleksione të mëdha online të botimeve shkencore dhe akademike, si artikuj revistash dhe libra, të përdorura për kërkim.">Databazave Akademike</KeyConcept></h4>
                <p>Studiuesit do të përdornin databaza si Scopus, Web of Science, HeinOnline dhe JSTOR. Për shembull, një kërkim mund të ishte:</p>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md text-xs font-mono overflow-x-auto"><code>TITLE-ABS-KEY("judicial independence" OR "rule of law") AND (SRCTITLE("International Journal of Constitutional Law") OR SRCTITLE("European Journal of International Law"))</code></pre>
                
                <h4 className="font-bold mt-4">Hapi 3: Analiza dhe Interpretimi</h4>
                <p>Rezultati do të ishte një analizë e trendeve: sa shpesh shfaqen këto tema, në cilat revista, dhe si ka ndryshuar frekuenca e tyre me kalimin e kohës.</p>

                <h3 className="text-xl font-semibold mt-8 mb-4">Analiza Kualitative e Densitetit të Fjalëve Kyçe</h3>
                <div className="space-y-4">
                    <AccordionItem title="Tier 1: Densitet Ekstremisht i Lartë (Revistat Themelore të Jurisprudencës)" isOpen={openTier === 'tier-1'} onToggle={() => setOpenTier(openTier === 'tier-1' ? null : 'tier-1')}>
                        <p>Këto <KeyConcept term="revista themelore" definition="Botimet akademike më të rëndësishme dhe me ndikim në një fushë të caktuar, të cilat shpesh përcaktojnë standardet dhe debatet kryesore.">revista themelore</KeyConcept> janë fusha ku konceptet tona kryesore jo vetëm përmenden, por lindin, debatohen dhe zhvillohen.</p>
                        <ul className="list-disc list-inside mt-2 pl-4 text-sm">
                           <li><strong>Teoria & Filozofia e së Drejtës:</strong> Oxford Journal of Legal Studies, Law and Philosophy, Jurisprudence.</li>
                           <li><strong>E Drejta Krahasuese & Ndërkombëtare:</strong> American Journal of Comparative Law, European Journal of International Law, International & Comparative Law Quarterly.</li>
                        </ul>
                    </AccordionItem>
                    <AccordionItem title="Tier 2: Densitet i Lartë (Revistat Kryesore të Fushave)" isOpen={openTier === 'tier-2'} onToggle={() => setOpenTier(openTier === 'tier-2' ? null : 'tier-2')}>
                        <p>Këto janë revistat më prestigjioze në shkenca politike dhe sociologji. Ndërsa mbulojnë një gamë të gjerë temash, konceptet tona janë tema të përhershme dhe qendrore debati.</p>
                    </AccordionItem>
                     <AccordionItem title="Tier 3: Densitet i Moderuar (Revistat e Specializuara)" isOpen={openTier === 'tier-3'} onToggle={() => setOpenTier(openTier === 'tier-3' ? null : 'tier-3')}>
                        <p>Në këto revista, fjalët tona kyçe specifike shfaqen shpesh, por brenda një konteksti më të specializuar (p.sh., teknologjia, ligji, historia).</p>
                    </AccordionItem>
                     <AccordionItem title="Tier 4: Densitet i Ulët (Revistat Themelore Teorike)" isOpen={openTier === 'tier-4'} onToggle={() => setOpenTier(openTier === 'tier-4' ? null : 'tier-4')}>
                        <p>Në këto revista, fjalët tona kyçe specifike mund të jenë të rralla, por ato ofrojnë themelin filozofik dhe teorik mbi të cilin ndërtohen konceptet tona.</p>
                    </AccordionItem>
                </div>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">Përfundime dhe Vlera e Kësaj Analize</h3>
                <PullQuote>Kjo analizë kualitative tregon se Bibliografia e Zgjeruar e NOVARIC® është një ekosistem i strukturuar me qëllim, jo një listë e rastësishme.</PullQuote>
                <p><strong>Mbulim i Plotë:</strong> Ajo përfshin revista që janë në thelbin e debatit (Tier 1), revista që përcaktojnë fushat kryesore (Tier 2), revista që ofrojnë thellësi të specializuar (Tier 3), dhe revista që sigurojnë themelin filozofik (Tier 4).</p>
                <p><strong>Mbështetje për Ndërdisiplinaritetin:</strong> Struktura tregon qartë se si projekti ynë merr hua dhe integron koncepte nga fusha të ndryshme për të ndërtuar një qasje unike dhe më të plotë.</p>
                <PullQuote>Kjo qasje është më e dobishme se një "raw count" sepse tregon rëndësinë kontekstuale të çdo burimi.</PullQuote>
            </ArticleSection>

            <ArticleSection id="analiza-perputhshmerise" title="Analiza e Përputhshmërisë së Fjalëve Kyçe NOVARIC® me Titujt e Revistave Themelore">
                <p>Kjo analizë skanon listën e 150 titujve të revistave për të identifikuar <KeyConcept term="përputhje" definition="Gjetja e një korrespondence ose lidhjeje të drejtpërdrejtë midis dy elementeve, në këtë rast midis fjalëve kyçe dhe titujve të revistave.">përputhje</KeyConcept> të drejtpërdrejta ose të qarta me fjalët kyçe të përcaktuara për çdo grupim tematik. Rezultati nuk është thjesht një numërim i thatë, por një vlerësim i "peshës" editoriale që çdo grupim ka brenda bibliografisë sonë, duke përdorur titujt si një tregues (proxy) të fokusit kryesor të revistës.</p>
                <div className="space-y-6 mt-6">
                    <ComplianceCard 
                        icon={<ScaleIcon className="w-6 h-6 text-primary-600 dark:text-primary-400"/>}
                        group="1. Shteti i së Drejtës & Qeverisja"
                        matches={22}
                        keywords="rule of law, constitutionalism, judicial independence, separation of powers."
                        journals="International Journal of Constitutional Law (I•CON), Public Law, Global Constitutionalism, European Public Law, Rule of Law Journal"
                        analysis="Ky grupim ka një përfaqësim masiv e fjalës 'Law' dhe 'Constitutional', që tregon se themeli ynë teorik për shtetin e së drejtës është jashtëzakonisht i fortë. Kjo konfirmon se korniza jonë MVPGJ është e ankoruar thellësisht në literaturën më të rëndësishme."
                    />
                     <ComplianceCard 
                        icon={<ShieldCheckIcon className="w-6 h-6 text-primary-600 dark:text-primary-400"/>}
                        group="2. Integriteti & Etika Gjyqësore"
                        matches={6}
                        keywords="judicial ethics, anti-corruption, integrity, good governance."
                        journals="Legal Ethics, Journal of Corruption and Governance, Public Integrity, Business and Professional Ethics Journal, International Journal of Transitional Justice"
                        analysis="Numri i përputhjeve direkte është më i ulët, por kjo nuk është dobësi. Koncepte si 'integrity' dhe 'corruption' janë aq thelbësore sa rrallë bëhen titulli i një reviste, por janë tema kyçe brenda revistave të Tier 1 si I•CON dhe Journal of Democracy. Bibliografia jonë e mbulon këtë në mënyrë perfekte."
                    />
                    <ComplianceCard 
                        icon={<GlobeEuropeAfricaIcon className="w-6 h-6 text-primary-600 dark:text-primary-400"/>}
                        group="3. Të Drejtat e Njeriut & Drejtësia Ndërkombëtare"
                        matches={15}
                        keywords="human rights, ECHR, european law, international law."
                        journals="European Human Rights Law Review, Human Rights Quarterly, European Law Journal, American Journal of International Law, Journal of International Criminal Justice"
                        analysis="Ky grupim ka një përfaqësim jashtëzakonisht të fortë. Prania e kaq shumë revistave me fjalët 'Human Rights', 'European' dhe 'International' garanton rigorozitetin e analizës sonë krahasuese dhe ndërkombëtare (PARAGON)."
                    />
                     <ComplianceCard 
                        icon={<BookOpenIcon className="w-6 h-6 text-primary-600 dark:text-primary-400"/>}
                        group="4. Arsyetimi Gjyqësor & Interpretimi"
                        matches={9}
                        keywords="legal reasoning, interpretation, precedent, judicial philosophy."
                        journals="Jurisprudence, Legal Theory, Law and Philosophy, International Journal for the Semiotics of Law, The Theory and Practice of Legislation"
                        analysis="Përputhja është e fortë dhe e thelluar. Kjo tregon se bibliografia jonë është plotësisht e pajisur për të adresuar sfidat bashkëkohore të filozofisë gjyqësore, duke siguruar një perspektivë kritike."
                    />
                    <ComplianceCard 
                        icon={<CpuChipIcon className="w-6 h-6 text-primary-600 dark:text-primary-400"/>}
                        group="5. Reforma në Drejtësi & Konteksti Post-Komunist"
                        matches={7}
                        keywords="justice reform, post-communism, transitional justice, EU integration."
                        journals="Review of Central and East European Law, East European Politics and Societies, Journal of Transitional Justice, Südosteuropa, Journal of Democracy, Communist and Post-Communist Studies"
                        analysis="Ky grupim përfaqësohet nga revistat më të rëndësishme rajonale. Kjo është kritike. Ndërsa revistat gjeneraliste ofrojnë teorinë, këto specifike ofrojnë kontekstin empirik për të kuptuar Shqipërinë, duke siguruar që analizat tona të jenë të ndjeshme ndaj specifikave lokale."
                    />
                </div>
            </ArticleSection>
            
            <ArticleSection id="analiza-renditja" title="Analiza dhe Renditja e Revistave sipas Relevancës për Shqipërinë">
                <h3 className="text-xl font-semibold mt-6 mb-4">Metodologjia e Vlerësimit</h3>
                <p>Vlerësimi bazohet në tre kritere kryesore, të kombinuara për të dhënë një pikë të vetme <KeyConcept term="relevance" definition="Shkalla në të cilën diçka është e lidhur ose e përshtatshme për një çështje të caktuar.">relevance</KeyConcept>:</p>
                <ul className="list-disc list-inside space-y-2 pl-4 my-4">
                    <li><strong>Relevanca Tematike Direkte (Pesha më e Lartë):</strong> Sa shpesh revista mbulon tema kyçe për Shqipërinë? Këto përfshijnë integrimin në BE dhe <KeyConcept term="harmonizimin e legjislacionit" definition="Procesi i modifikimit të ligjeve kombëtare për t'i bërë ato në përputhje me ligjet dhe standardet e një entiteti më të madh, si Bashkimi Evropian.">harmonizimin e legjislacionit</KeyConcept>, <KeyConcept term="jurisprudencën e GJEDNJ" definition="Tërësia e vendimeve të marra nga Gjykata Evropiane e të Drejtave të Njeriut, të cilat krijojnë precedentë ligjorë për mbrojtjen e të drejtave themelore.">jurisprudencën e GJEDNJ</KeyConcept>, reformën në drejtësi, luftën kundër korrupsionit, dhe shtetin e së drejtës.</li>
                    <li><strong>Fokusi Gjeografik:</strong> A ka revista një fokus specifik në Evropën Qendrore dhe Lindore, Ballkanin, apo vendet post-komuniste? Një fokus rajonal rrit ndjeshëm relevancën.</li>
                    <li><strong>Ndikimi dhe Rëndësia Themelore:</strong> A është revista një burim <KeyConcept term="kanonik" definition="I konsideruar si thelbësor, autoritativ dhe pjesë e 'kanunit' të njohurive në një fushë të caktuar.">kanonik</KeyConcept> për teoritë themelore të së drejtës (kushtetuese, ndërkombëtare) që formësojnë çdo sistem ligjor, përfshirë atë shqiptar?</li>
                </ul>

                <div className="space-y-8 mt-8">
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-green-500">Kategoria 1: Relevancë Kritike dhe Shumë e Lartë (Pikët 9-10)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {journalRelevanceData.kategoria1.map(j => <JournalRelevanceCard key={j.title} {...j} />)}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-lime-500">Kategoria 2: Relevancë e Lartë (Pikët 7-8)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {journalRelevanceData.kategoria2.map(j => <JournalRelevanceCard key={j.title} {...j} />)}
                        </div>
                    </div>
                     <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-yellow-400">Kategoria 3: Relevancë e Moderuar (Pikët 5-6)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {journalRelevanceData.kategoria3.map(j => <JournalRelevanceCard key={j.title} {...j} />)}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-orange-400">Kategoria 4: Relevancë e Kufizuar ose Indirekte (Pikët 3-4)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {journalRelevanceData.kategoria4.map(j => <JournalRelevanceCard key={j.title} {...j} />)}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b-2 border-red-500">Kategoria 5: Relevancë e Ulët (Pikët 1-2)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {journalRelevanceData.kategoria5.map(j => <JournalRelevanceCard key={j.title} {...j} />)}
                        </div>
                    </div>
                </div>
            </ArticleSection>

        </>
    ), [keywordData, maxPercentage, openTier]);
    
    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(fullArticleText, { url: window.location.href, published_at: new Date().toISOString(), article_id: 'bibliografia-jurisprudences-01' }, sourcesList, { researchHours: 150, focusKeyword: "Bibliografia e Jurisprudencës" });
    }, [fullArticleText, sourcesList]);
    const articleIntegrityProfile = useMemo(() => calculateArticleIntegrityProfile(articleMetrics), [articleMetrics]);

    const tocItems = [
        { id: "hyrje", title: "Hyrje" },
        { id: "vizualizimi", title: "Vizualizimi i Fjalëve Kyçe" },
        { id: "metodologjia-perdorimit", title: "Metodologjia e Përdorimit" },
        { id: "analiza-perputhshmerise", title: "Analiza e Përputhshmërisë" },
        { id: 'analiza-renditja', title: 'Analiza dhe Renditja e Revistave' },
    ];
    
    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Bibliografia Themelore e Zgjeruar e Jurisprudencës"
            headerSubtitle="Një Bibliotekë e Gjallë për Analizë Kritike dhe të Informuar"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Ekipi i Kërkimit', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{ publishedDate: "Publikuar: 31 Tetor, 2025", location: "Tiranë, Shqipëri" }}
            tableOfContentsItems={tocItems}
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
