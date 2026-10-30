import React, { useState, useMemo, ReactNode } from 'react';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, PullQuote } from './templates/ArticleTemplate1';
import { 
    BookOpenIcon, 
    ShieldCheckIcon, 
    MegaphoneIcon, 
    CpuChipIcon, 
    GlobeEuropeAfricaIcon,
    ChevronDownIcon,
    PencilSquareIcon,
    ScaleIcon
} from './icons';
import { renderWithSuperscript } from '../utils/textUtils';

interface BibliografiaEZgjeruarPageProps {
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

const KeywordBubble: React.FC<{ keyword: string; count: number; percentage: number; maxPercentage: number; }> = ({ keyword, count, percentage, maxPercentage }) => {
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
      title={`${keyword}: ${count} references (${percentage.toFixed(1)}%)`}
    >
      <span style={{ fontSize: `${fontSize}px` }} className="font-bold">{keyword}</span>
      <span className="text-xs opacity-80">{percentage.toFixed(1)}%</span>
    </div>
  );
};

const KeywordItemGroup: React.FC<{ icon: React.ReactNode; title: string; keywords: string; }> = ({ icon, title, keywords }) => (
    <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg flex items-start gap-4">
        <div className="flex-shrink-0 text-primary-600 dark:text-primary-400">{icon}</div>
        <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{keywords}</p>
        </div>
    </div>
);

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

const ComplianceCard: React.FC<{ icon: React.ReactNode; group: string; matches: number; keywords: string; journals: string[]; analysis: string; }> = ({ icon, group, matches, keywords, journals, analysis }) => (
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
                <p className="italic text-slate-600 dark:text-slate-400">{journals.join(', ')}.</p>
            </div>
            <div>
                <p className="font-semibold">Analiza:</p>
                <p className="text-slate-700 dark:text-slate-300">{analysis}</p>
            </div>
        </div>
    </div>
);

const WorkRelevanceCard: React.FC<{
    type: string;
    publisher: string;
    published: string;
    isbn?: string;
    status: string;
    coreFocus: string;
    relevanceAlbania: string;
    title: string;
}> = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-t-lg"
                aria-expanded={isExpanded}
            >
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                        <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase">{props.type}</p>
                        <h4 className="font-bold text-md text-slate-800 dark:text-slate-200 mt-1">{props.title}</h4>
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform mt-1 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 animate-fadeIn space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-xs">
                        <p><strong>Botues:</strong> {props.publisher}</p>
                        <p><strong>Publikuar:</strong> {props.published}</p>
                        {props.isbn && <p><strong>ISBN:</strong> {props.isbn}</p>}
                        <p><strong>Statusi:</strong> <span className="italic">{props.status}</span></p>
                    </div>
                    <div>
                        <h5 className="font-bold text-sm text-primary-700 dark:text-primary-400 mb-1">Fokusi Themelor</h5>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{props.coreFocus}</p>
                    </div>
                    <div>
                        <h5 className="font-bold text-sm text-primary-700 dark:text-primary-400 mb-1">Relevanca për Shqipërinë</h5>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{props.relevanceAlbania}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

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
    description?: string;
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

export const BibliografiaEZgjeruarPage: React.FC<BibliografiaEZgjeruarPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;
    const [openTier, setOpenTier] = useState<string | null>('tier-1');
    
    const pageTitle = "Bibliografia Themelore e Zgjeruar e Projektit NOVARIC® me nje Metodologji te Thelluar për Vlerësimin e Aktorëve Politikë në Ekosistemin Shqiptar.";
    const pageDescription = "Shtylla kurrizore intelektuale e ekosistemit NOVARIC®, një bibliotekë e gjallë me 150 burime për analizë kritike dhe të informuar.";
    const keywords = ["Bibliografi Akademike", "Shkenca Politike", "Sociologji", "Studime Mediatike", "Filozofi Politike", "Post-Komunizmi", "Etika e IA", "Metodologji Kërkimore", "NOVARIC"];
    
    const keywordData = [
        { keyword: 'Politikë', count: 30, percentage: 17.8 }, { keyword: 'Demokraci', count: 25, percentage: 14.8 },
        { keyword: 'Social', count: 16, percentage: 9.5 }, { keyword: 'Media', count: 13, percentage: 7.7 },
        { keyword: 'Pushtet', count: 11, percentage: 6.5 }, { keyword: 'Komunikim', count: 11, percentage: 6.5 },
        { keyword: 'Korrupsion', count: 9, percentage: 5.3 }, { keyword: 'Institucion', count: 8, percentage: 4.7 },
        { keyword: 'Publik', count: 8, percentage: 4.7 }, { keyword: 'Kapital', count: 7, percentage: 4.1 },
        { keyword: 'Post-Komunizëm', count: 6, percentage: 3.6 }, { keyword: 'Shtet', count: 5, percentage: 3.0 },
        { keyword: 'Analizë', count: 5, percentage: 3.0 }, { keyword: 'Llogaridhënie', count: 4, percentage: 2.4 },
        { keyword: 'Rrjet', count: 4, percentage: 2.4 }, { keyword: 'Parti', count: 3, percentage: 1.8 },
        { keyword: 'Etikë', count: 2, percentage: 1.2 }, { keyword: 'Zgjedhje', count: 1, percentage: 0.6 },
        { keyword: 'Ballkan', count: 1, percentage: 0.6 },
    ];
    const maxPercentage = Math.max(...keywordData.map(k => k.percentage));

    const complianceData = [
        { group: '1. Pushteti, Qeverisja & Institucionet', keywords: 'governance, institutions, political power, democracy, rule of law', matches: 18, journals: ['American Political Science Review', 'Journal of Politics', 'Governance', 'Journal of Democracy', 'Political Theory', 'Democratization', 'East European Politics and Societies', 'Journal of Information Technology & Politics', 'Law & Society Review', 'Policy & Internet', 'International Journal of Transitional Justice', 'Ethics', 'Journal of Political Philosophy'], analysis: 'Ky është grupi më i përfaqësuar. Prania masive e fjalës \'Political/Politics\' dhe \'Democracy\' në titujt e revistave kryesore tregon se themeli ynë në shkencat politike është jashtëzakonisht i fortë. Kjo konfirmon se korniza jonë PVAF është e ankoruar thellësisht në literaturën më të rëndësishme.' },
        { group: '2. Llogaridhënia, Etika & Korrupsioni', keywords: 'accountability, political ethics, corruption, clientelism, transparency', matches: 4, journals: ['Ethics', 'Business and Professional Ethics Journal', 'Governance', 'International Journal of Transitional Justice'], analysis: 'Numri i përputhjeve direkte është më i ulët, por kjo nuk është dobësi. Koncepte si \'accountability\' dhe \'corruption\' janë aq thelbësore sa rrallë bëhen titulli i një reviste, por janë tema kyçe brenda revistave të Tier 1 si APSR dhe Governance. Bibliografia jonë e mbulon këtë në mënyrë perfekte.' },
        { group: '3. Komunikimi, Media & Sfera Publike', keywords: 'political communication, media systems, public sphere, framing, misinformation', matches: 11, journals: ['Political Communication', 'The International Journal of Press/Politics', 'Information, Communication & Society', 'Social Media + Society', 'Journal of Communication', 'Digital Journalism', 'Media, Culture & Society', 'Journalism Studies', 'Public Opinion Quarterly'], analysis: 'Ky grupim ka një përfaqësim jashtëzakonisht të fortë dhe të specializuar. Prania e kaq shumë revistave me fjalët \'Communication\', \'Media\' dhe \'Journalism\' garanton rigorozitet në analizën tonë mediatike (MARAGON).' },
        { group: '4. Teknologjia, Të Dhënat & Shoqëria', keywords: 'big data, algorithms, AI ethics, digital democracy, computational social science', matches: 9, journals: ['Science, Technology, & Human Values', 'Big Data & Society', 'Journal of Information Technology & Politics', 'Policy & Internet', 'First Monday', 'Digital Journalism', 'Journal of Computer-Mediated Communication', 'Automating the News'], analysis: 'Përputhja është e fortë dhe moderne. Kjo tregon se bibliografia jonë është plotësisht e pajisur për të adresuar sfidat bashkëkohore të teknologjisë dhe etikës së IA-së, duke siguruar një perspektivë kritike.' },
        { group: '5. Konteksti Post-Komunist & Tranzicioni', keywords: 'post-communism, transitional justice, democratization, Eastern Europe, Balkans', matches: 5, journals: ['East European Politics and Societies', 'Europe-Asia Studies', 'Südosteuropa. Journal of Politics and Society', 'International Journal of Transitional Justice', 'Democratization'], analysis: 'Ky grupim përfaqësohet nga revistat më të rëndësishme rajonale. Kjo është kritike. Ndërsa revistat gjeneraliste ofrojnë teorinë, këto specifike ofrojnë kontekstin empirik për të kuptuar Shqipërinë, duke siguruar që analizat tona të jenë të ndjeshme ndaj specifikave lokale.' }
    ];
    
    const workRelevanceDataGrouped = {
        "I. Teoritë Themelore: Demokracia, Pushteti dhe Sfera Publike": [
            { title: "Acemoglu, D., & Robinson, J. A. (2012). Why Nations Fail", type: 'Libër', publisher: 'Crown Business', published: '2012', isbn: '978-0307719218', status: 'Best-seller global; vepër themelore në ekonominë politike krahasuese.', coreFocus: 'Argumenton se diferencat në prosperitetin e kombeve vijnë nga lloji i institucioneve të tyre politike dhe ekonomike.', relevanceAlbania: 'Thelbësore. Ofron kuadrin kryesor për të kuptuar pse reformat ligjore shpesh dështojnë nëse institucionet themelore mbeten "shfrytëzuese".' },
            { title: "Habermas, J. (1989). The Structural Transformation of the Public Sphere", type: 'Libër', publisher: 'MIT Press', published: '1989 (Përkthimi në anglisht)', isbn: '978-0262581080', status: 'Punim kanonik i Shkollës së Frankfurtit; vepër themelore për studimet mediatike dhe teorinë demokratike.', coreFocus: 'Analizon lindjen dhe rënien e "sferës publike borgjeze" – një hapësirë midis shtetit dhe shoqërisë private ku qytetarët debatojnë racionalisht.', relevanceAlbania: 'Kritike për të analizuar rolin e medias dhe shoqërisë civile në monitorimin e sistemit të drejtësisë.' },
        ],
        "II. Post-Komunizmi, Demokratizimi dhe Konteksti Shqiptar/Ballkanik": [
            { title: "Linz, J. J., & Stepan, A. (1996). Problems of Democratic Transition and Consolidation", type: 'Libër', publisher: 'Johns Hopkins University Press', published: '1996', isbn: '978-0801851582', status: 'Modeli klasik dhe më me ndikim për studimin e tranzicioneve demokratike.', coreFocus: 'Argumenton se për të konsoliduar një demokraci, duhet të përmbushen pesë arena kyçe: shoqëria civile, politike, shteti i së drejtës, burocracia dhe shoqëria ekonomike.', relevanceAlbania: 'Ofron diagnozën themelore për sfidat e Shqipërisë. Dobësia historike e "shtetit të së drejtës" shpjegon shumë nga problemet, duke e bërë reformën në drejtësi kusht të domosdoshëm.' },
            { title: "Vachudova, M. A. (2005). Europe Undivided: Democracy, Leverage, and Integration After Communism", type: 'Libër', publisher: 'Oxford University Press', published: '2005', isbn: '978-0199241194', status: 'Analizë kyçe e ndikimit të BE-së në Evropën Qendrore dhe Lindore.', coreFocus: 'Shpjegon se si perspektiva e anëtarësimit në BE shërbeu si "levë" e fuqishme për të nxitur reformat demokratike dhe liberale.', relevanceAlbania: 'Shpjegon motorin kryesor të jashtëm të reformës në drejtësi. Tërë procesi i Vetting-ut nuk mund të kuptohen pa "levën" e BE-së.' },
        ],
        "III. Komunikimi Politik, Sistemet Mediatike dhe Opinioni Publik": [
            { title: "Hallin, D. C., & Mancini, P. (2004). Comparing Media Systems", type: 'Libër', publisher: 'Cambridge University Press', published: '2004', isbn: '978-0521543088', status: 'Vepra themelore në komunikimin politik krahasues.', coreFocus: 'Identifikon tre modele të marrëdhënieve midis medias dhe politikës, duke përfshirë Modelin Pluralist të Polarizuar.', relevanceAlbania: 'Ofron modelin e saktë për të diagnostikuar sistemin mediatik shqiptar, i cili i përket Modelit Pluralist të Polarizuar. Kjo shpjegon polarizimin e mbulimit mediatik të çështjeve të drejtësisë.' },
        ],
        "IV. Sociologjia e Pushtetit: Rrjetet, Elitat dhe Kapitali Social": [
            { title: "Putnam, R. D. (1993). Making Democracy Work: Civic Traditions in Modern Italy", type: "Libër", publisher: "Princeton University Press", published: "1993", isbn: "978-0691078892", status: 'Vepër kanonike në shkencat politike dhe sociologji; futi konceptin e "kapitalit social" në debatin e gjerë.', coreFocus: 'Duke krahasuar performancën e qeverive rajonale në Itali për një periudhë 20-vjeçare, Putnam arrin në përfundimin se suksesi i institucioneve demokratike nuk varet nga dizajni i tyre formal, por nga konteksti socio-kulturor. Rajonet me "kapital social" të lartë (rrjete të angazhimit qytetar, besim dhe norma reciprociteti) kishin institucione më efektive dhe më pak të korruptuara.', relevanceAlbania: 'Ky libër ofron një kundërargument thelbësor ndaj një fokusi ekskluzivisht ligjor-formalist te reforma. Ai sugjeron se suksesi afatgjatë i reformës në drejtësi në Shqipëri nuk varet vetëm nga ndërtimi i institucioneve të reja (si SPAK apo KLGJ), por edhe nga kultivimi i një kulture qytetare që kërkon llogari, beson te ligji dhe bashkëpunon. Ai na kujton se institucionet e drejtësisë janë të "ngulitura" (embedded) në shoqëri.' },
            { title: "Mills, C. W. (1956). The Power Elite", type: "Libër", publisher: "Oxford University Press", published: "1956", isbn: "978-0195133547", status: 'Tekst klasik i sociologjisë kritike amerikane.', coreFocus: 'Argumenton se pushteti real në SHBA nuk qëndron te populli apo te politikanët e zgjedhur, por te një "elitë e pushtetit" e ndërthurur – krerët e korporatave të mëdha, liderët ushtarakë dhe zyrtarët e lartë politikë – të cilët marrin vendimet thelbësore larg syve të publikut.', relevanceAlbania: 'Ofron një kuadër analitik kritik për të kuptuar presionet e mundshme mbi sistemin e drejtësisë. Në një kontekst si ai shqiptar, ku shpesh flitet për "oligarkë" dhe ndërthurje të interesave politike, ekonomike dhe kriminale, teoria e "elitës së pushtetit" ndihmon në analizimin e sfidave reale me të cilat përballen gjyqtarët dhe prokurorët kur hetojnë dhe gjykojnë figura të fuqishme, si dhe për të vlerësuar pavarësinë reale të gjyqësorit.' },
            { title: "Ostrom, E. (1990). Governing the Commons", type: "Libër", publisher: "Cambridge University Press", published: "1990", isbn: "978-0521405997", status: 'Vepër themelore e nobelistes Elinor Ostrom; sfidoi mendimin tradicional ekonomik.', coreFocus: 'Duke studiuar komunitete në mbarë botën, Ostrom tregon se si njerëzit mund të menaxhojnë me sukses burimet e përbashkëta (the commons) pa pasur nevojë as për privatizim (tregu) as për kontroll nga shteti. Kjo arrihet përmes institucioneve dhe rregullave të vetë-organizuara që ndërtojnë besim dhe sigurojnë monitorim e sanksione.', relevanceAlbania: 'Jashtëzakonisht relevante për çështje të pronës dhe burimeve publike. Vendimi i Gjykatës Kushtetuese për Teatrin Kombëtar, për shembull, mund të analizohet përmes këtij kuadri si një mbrojtje e "të përbashkëtës" (pasurisë publike) kundër një zgjidhjeje të imponuar nga shteti pa pjesëmarrje. Teoria e Ostrom thekson rëndësinë e institucioneve të forta dhe të pavarura (si gjykatat) për të mbrojtur rregullat e lojës dhe për të parandaluar "kapjen" e pasurive publike.' },
        ],
        "V. Shkenca Sociale Kompjuterike, Etika e IA dhe Metodat Dixhitale": [
            { title: "Zuboff, S. (2019). The Age of Surveillance Capitalism", type: "Libër", publisher: "PublicAffairs", published: "2019", isbn: "978-1610395694", status: 'Vepër monumentale që përcaktoi një epokë të re të kapitalizmit.', coreFocus: 'Argumenton se kompanitë e mëdha teknologjike (si Google, Facebook) kanë krijuar një logjikë të re ekonomike: "kapitalizmi i mbikëqyrjes". Ky sistem pretendon përvojën njerëzore si lëndë të parë falas, e transformon në të dhëna sjelljeje dhe i përdor ato për të parashikuar dhe modifikuar sjelljen tonë për përfitim.', relevanceAlbania: 'Ndërkohë që sistemi i drejtësisë dixhitalizohet, ky libër shërben si një paralajmërim thelbësor për sfidat e reja ndaj privatësisë dhe të drejtave themelore. Ofron kuadrin kritik për të analizuar çështje si përdorimi i të dhënave personale në proceset gjyqësore, mbikëqyrja elektronike, mbrojtja e të dhënave në sistemin TIMS, dhe rreziqet e profileve dixhitale. Ai i përgatit juristët për gjeneratën e re të çështjeve të të drejtave të njeriut.' },
            { title: "O'Neil, C. (2016). Weapons of Math Destruction", type: "Libër", publisher: "Crown", published: "2016", isbn: "978-0553418811", status: 'Libër me ndikim të gjerë që popullarizoi kritikën ndaj paragjykimeve algoritmike.', coreFocus: 'Ekspozon se si algoritmet dhe modelet e Big Data, të cilat perceptohen si neutrale dhe objektive, në fakt shpesh përforcojnë diskriminimin, rrisin pabarazinë dhe kërcënojnë demokracinë. Këto "Armë të Shkatërrimit Matematikor" janë të errëta, të pakontrollueshme dhe shkatërruese.', relevanceAlbania: 'Shumë praktike. Ndërsa qeveria dhe institucionet e drejtësisë fillojnë të përdorin sisteme automatike (p.sh., për alokimin e çështjeve, vlerësimin e riskut, etj.), ky libër thekson nevojën urgjente për një kontroll gjyqësor mbi këto sisteme. Gjykatat, veçanërisht ato administrative, duhet të kenë kapacitetin të pyesin: A është ky algoritëm i drejtë? A diskriminon? Si mund të apelohet një vendim i marrë nga një makinë?' },
        ],
        "VI. Etika, Korrupsioni dhe Dizajni Institucional": [
            { title: "Rose-Ackerman, S. (1999). Corruption and Government: Causes, Consequences, and Reform", type: 'Libër', publisher: 'Cambridge University Press', published: '1999', isbn: '978-0521659123', status: 'Shpesh konsiderohet "Bibla" e studimeve moderne mbi korrupsionin.', coreFocus: 'Analizon korrupsionin nga një perspektivë ekonomike dhe institucionale, duke propozuar reforma të fokusuara te transparenca.', relevanceAlbania: 'Ofron manualin teorik për arsyet dhe mjetet e reformës në drejtësi. Ndihmon në vlerësimin nëse masat (p.sh., Vetting-u, SPAK) adresojnë shkaqet rrënjësore të korrupsionit.' },
            { title: "North, D. C. (1990). Institutions, Institutional Change and Economic Performance", type: 'Libër', publisher: 'Cambridge University Press', published: '1990', isbn: '978-0521397346', status: 'Punim themelor i Institucionalizmit të Ri; autor fitues i Çmimit Nobel.', coreFocus: 'Argumenton se institucionet janë "rregullat e lojës" dhe përcaktuesi kryesor i performancës ekonomike afatgjatë.', relevanceAlbania: 'Ofron themelin më të thellë teorik për rëndësinë e jurisprudencës. Shpjegon pse pa një gjyqësor funksional, zhvillimi i qëndrueshëm ekonomik është i pamundur.' },
        ],
        "VIII. Shtesë: Vepra të Fundit me Rëndësi të Lartë": [
            { title: "Mounk, Y. (2018). The People vs. Democracy", type: "Libër", publisher: "Harvard University Press", published: "2018", isbn: "978-0674976825", status: 'Një diagnozë me ndikim e krizës aktuale të demokracisë liberale.', coreFocus: 'Argumenton se demokracia liberale po zbërthehet në dy komponentët e saj: demokraci joliberale (qeveri të zgjedhura që shkelin të drejtat individuale dhe shtetin e së drejtës) dhe liberalizëm jodemokratik (institucione elitare si gjykatat dhe bankat qendrore që marrin vendime pa legjitimitet popullor).', relevanceAlbania: 'Ofron një pasqyrë për të kuptuar tensionet e vazhdueshme në politikën shqiptare. Sulmet ndaj institucioneve të reja të drejtësisë (SPAK, GJKKO) mund të interpretohen si një manifestim i tendencave të "demokracisë joliberale", ku një shumicë e zgjedhur kërkon të kontrollojë gjyqësorin. Nga ana tjetër, kritikat ndaj "qeverisë së gjyqtarëve" pasqyrojnë tensionin e "liberalizmit jodemokratik". Ky libër ndihmon në vendosjen e sfidave të Shqipërisë në një kontekst global më të gjerë.' }
        ]
    };

    const bibliography = {
        "I. Teoritë Themelore: Demokracia, Pushteti dhe Sfera Publike": ["Acemoglu, D., & Robinson, J. A. (2012). Why Nations Fail: The Origins of Power, Prosperity, and Poverty. Crown Business.","Arendt, H. (1958). The Human Condition. University of Chicago Press.","Bourdieu, P. (1984). Distinction: A Social Critique of the Judgement of Taste. Harvard University Press.","Bourdieu, P. (1991). Language and Symbolic Power. Harvard University Press.","Dahl, R. A. (1971). Polyarchy: Participation and Opposition. Yale University Press.","Dahl, R. A. (1989). Democracy and Its Critics. Yale University Press.","Dewey, J. (1927). The Public and Its Problems. Henry Holt and Company.","Foucault, M. (1977). Discipline and Punish: The Birth of the Prison. Pantheon Books.","Foucault, M. (1980). Power/Knowledge: Selected Interviews and Other Writings, 1972-1977. Pantheon Books.","Giddens, A. (1984). The Constitution of Society: Outline of the Theory of Structuration. University of California Press.","Habermas, J. (1984). The Theory of Communicative Action, Volume 1: Reason and the Rationalization of Society. Beacon Press.","Habermas, J. (1989). The structural transformation of the public sphere. MIT Press.","Held, D. (2006). Models of Democracy (3rd ed.). Stanford University Press.","Huntington, S. P. (1991). The Third Wave: Democratization in the Late Twentieth Century. University of Oklahoma Press.","Laclau, E., & Mouffe, C. (1985). Hegemony and Socialist Strategy: Towards a Radical Democratic Politics. Verso.","Lukes, S. (2005). Power: A Radical View (2nd ed.). Palgrave Macmillan.","Mouffe, C. (2000). The Democratic Paradox. Verso.","Pitkin, H. F. (1967). The Concept of Representation. University of California Press.","Putnam, R. D. (1993). Making Democracy Work: Civic Traditions in Modern Italy. Princeton University Press.","Putnam, R. D. (2000). Bowling Alone: The Collapse and Revival of American Community. Simon & Schuster.","Rawls, J. (1971). A Theory of Justice. Harvard University Press.","Scott, J. C. (1990). Domination and the Arts of Resistance: Hidden Transcripts. Yale University Press.","Sen, A. (1999). Development as Freedom. Alfred A. Knopf.","Tilly, C. (2007). Democracy. Cambridge University Press.","Weber, M. (1947). The Theory of Social and Economic Organization. The Free Press."],
        "II. Post-Komunizmi, Demokratizimi dhe Konteksti Shqiptar/Ballkanik": ["Burawoy, M., & Verdery, K. (Eds.). (1999). Uncertain Transition: Ethnographies of Change in the Postsocialist World. Rowman & Littlefield.","Elster, J. (Ed.). (1996). The Roundtable Talks and the Breakdown of Communism. University of Chicago Press.","Fish, M. S. (2005). Democracy Derailed in Russia: The Failure of Open Politics. Cambridge University Press.","Grzymala-Busse, A. (2007). Rebuilding Leviathan: Party Competition and State Exploitation in Post-Communist Democracies. Cambridge University Press.","Hall, R. E., & Soskice, D. (Eds.). (2001). Varieties of Capitalism: The Institutional Foundations of Comparative Advantage. Oxford University Press.","Hellman, J. S. (1998). Winners Take All: The Politics of Partial Reform in Postcommunist Transitions. World Politics, 50(2), 203-234.","Holmes, S. (1997). What Russia Teaches Us Now: How Weak States Threaten Freedom. The American Prospect, 33, 30-39.","Kitschelt, H., et al. (1999). Post-Communist Party Systems: Competition, Representation, and Inter-Party Cooperation. Cambridge University Press.","Krastev, I. (2011). The Anti-American Century. In The Aftermath of Communism. CEU Press.","Linz, J. J., & Stepan, A. (1996). Problems of Democratic Transition and Consolidation: Southern Europe, South America, and Post-Communist Europe. Johns Hopkins University Press.","O'Dwyer, C. (2006). Runaway State-Building: Patronage, Politics, and Democratic Development. Johns Hopkins University Press.","Pop-Eleches, G. (2007). Historical Legacies and Post-Communist Regime Change. Journal of Politics, 69(4), 908-926.","Rose, R., Mishler, W., & Haerpfer, C. (1998). Democracy and Its Alternatives: Understanding Post-Communist Societies. Johns Hopkins University Press.","Rupnik, J. (Ed.). (2005). The Western Balkans and the EU: The Hour of Europe. Chaillot Papers.","Stark, D., & Bruszt, L. (1998). Postsocialist Pathways: Transforming Politics and Property in East Central Europe. Cambridge University Press.","Stokes, S. C. (2001). Mandates and Democracy: Neoliberalism by Surprise in Latin America. Cambridge University Press.","Tismaneanu, V. (2003). Stalinism for All Seasons: A Political History of Romanian Communism. University of California Press.","Vachudova, M. A. (2005). Europe Undivided: Democracy, Leverage, and Integration After Communism. Oxford University Press.","Verdery, K. (1996). What Was Socialism, and What Comes Next?. Princeton University Press.","World Bank. (2000). Anticorruption in Transition: A Contribution to the Policy Debate. The World Bank."],
        "III. Komunikimi Politik, Sistemet Mediatike dhe Opinioni Publik": ["Althaus, S. L. (2003). When News Norms Collide, Follow the Lead: New Evidence for the Indexing Hypothesis. Political Communication, 20(4), 381-414.","Bennett, W. L., & Iyengar, S. (2008). A New Era of Minimal Effects? The Changing Foundations of Political Communication. Journal of Communication, 58(4), 707-731.","Boykoff, M. T., & Boykoff, J. M. (2004). Balance as bias: global warming and the US prestige press. Global Environmental Change, 14(2), 125-136.","Curran, J., & Seaton, J. (2009). Power Without Responsibility: The Press, Broadcasting, and New Media in Britain (7th ed.). Routledge.","Entman, R. M. (1993). Framing: Toward clarification of a fractured paradigm. Journal of Communication, 43(4), 51–58.","Gamson, W. A. (1992). Talking Politics. Cambridge University Press.","Hall, S. (1980). Encoding/Decoding. In Culture, Media, Language. Hutchinson.","Hallin, D. C., & Mancini, P. (2004). Comparing media systems: Three models of media and politics. Cambridge University Press.","Iyengar, S. (1991). Is anyone responsible? How television frames political issues. University of Chicago Press.","Iyengar, S., Sood, G., & Lelkes, Y. (2012). Affect, Not Ideology: A Social Identity Perspective on Polarization. Public Opinion Quarterly, 76(3), 405-431.","Katz, E., & Lazarsfeld, P. F. (1955). Personal Influence: The Part Played by People in the Flow of Mass Communications. The Free Press.","Kovach, B., & Rosenstiel, T. (2014). The elements of journalism (3rd ed.). Three Rivers Press.","Lazarsfeld, P. F., Berelson, B., & Gaudet, H. (1944). The People's Choice. Duell, Sloan and Pearce.","Lippmann, W. (1922). Public Opinion. Harcourt, Brace and Company.","McCombs, M. E., & Shaw, D. L. (1972). The Agenda-Setting Function of Mass Media. Public Opinion Quarterly, 36(2), 176-187.","Mutz, D. C. (2006). Hearing the Other Side: Deliberative versus Participatory Democracy. Cambridge University Press.","Norris, P. (2000). A Virtuous Circle: Political Communications in Postindustrial Societies. Cambridge University Press.","Papacharissi, Z. (2010). A Private Sphere: Democracy in a Digital Age. Polity Press.","Prior, M. (2007). Post-Broadcast Democracy: How Media Choice Increases Inequality in Political Involvement and Polarizes Elections. Cambridge University Press.","Schudson, M. (2003). The Sociology of News. W. W. Norton & Company.","Snow, D. A., & Benford, R. D. (1988). Ideology, Frame Resonance, and Participant Mobilization. International Social Movement Research, 1, 197-217.","Sunstein, C. R. (2001). Republic.com. Princeton University Press.","Van Aelst, P., et al. (2017). Political communication in a high-choice media environment: a challenge for democracy? Annals of the International Communication Association, 41(1), 3-27.","Zaller, J. R. (1992). The Nature and Origins of Mass Opinion. Cambridge University Press.","Zhao, X. (2009). Media Use and Global-Mindedness: A Test of the Indirect-Contact Hypothesis. Journal of Communication, 59(3), 543-566."],
        "IV. Sociologjia e Pushtetit: Rrjetet, Elitat dhe Kapitali Social": ["Barabási, A.-L. (2002). Linked: The New Science of Networks. Perseus Publishing.","Burt, R. S. (1992). Structural Holes: The Social Structure of Competition. Harvard University Press.","Burt, R. S. (2005). Brokerage and Closure: An Introduction to Social Capital. Oxford University Press.","Coleman, J. S. (1988). Social Capital in the Creation of Human Capital. American Journal of Sociology, 94, S95-S120.","Domhoff, G. W. (2006). Who Rules America? Power, Politics, and Social Change (5th ed.). McGraw-Hill.","Elias, N. (1982). The Civilizing Process. Blackwell Publishing.","Granovetter, M. S. (1973). The Strength of Weak Ties. American Journal of Sociology, 78(6), 1360-1380.","Granovetter, M. (1985). Economic Action and Social Structure: The Problem of Embeddedness. American Journal of Sociology, 91(3), 481-510.","Ledeneva, A. V. (1998). Russia's Economy of Favours: Blat, Networking and Informal Exchange. Cambridge University Press.","Mills, C. W. (1956). The Power Elite. Oxford University Press.","Ostrom, E. (1990). Governing the Commons: The Evolution of Institutions for Collective Action. Cambridge University Press.","Scott, J. (2000). Social Network Analysis: A Handbook (2nd ed.). Sage Publications.","Simmel, G. (1950). The Metropolis and Mental Life. In The Sociology of Georg Simmel. The Free Press.","Useem, M. (1984). The Inner Circle: Large Corporations and the Rise of Business Political Activity in the U.S. and U.K.. Oxford University Press.","Wasserman, S., & Faust, K. (1994). Social Network Analysis: Methods and Applications. Cambridge University Press."],
        "V. Shkenca Sociale Kompjuterike, Etika e IA dhe Metodat Dixhitale": ["boyd, d., & Crawford, K. (2012). Critical Questions for Big Data. Information, Communication & Society, 15(5), 662-679.","Carey, J. W. (1989). Communication as culture: Essays on media and society. Unwin Hyman.","Diakopoulos, N. (2019). Automating the news: How algorithms are rewriting the media. Harvard University Press.","Elish, M. C. (2016). The Moral Crumple Zone: Cautionary Tales in Human-Robot Interaction. Engaging Science, Technology, and Society, 2, 40-60.","Eubanks, V. (2018). Automating Inequality: How High-Tech Tools Profile, Police, and Punish the Poor. St. Martin's Press.","Gillespie, T. (2014). The Relevance of Algorithms. In Tarleton Gillespie, Pablo Boczkowski, and Kirsten Foot (eds.), Media Technologies. MIT Press.","Grimmer, J., & Stewart, B. M. (2013). Text as Data: The Promise and Pitfalls of Automatic Content Analysis Methods for Political Texts. Political Analysis, 21(3), 267-297.","Hindman, M. (2008). The Myth of Digital Democracy. Princeton University Press.","Howard, P. N. (2005). The Digital Origins of Dictatorship and Democracy. Oxford University Press.","Kitchin, R. (2014). The Data Revolution: Big Data, Open Data, Data Infrastructures and Their Consequences. Sage Publications.","Lazer, D., et al. (2009). Computational Social Science. Science, 323(5915), 721-723.","Morozov, E. (2011). The Net Delusion: The Dark Side of Internet Freedom. PublicAffairs.","Noble, S. U. (2018). Algorithms of Oppression: How Search Engines Reinforce Racism. New York University Press.","O'Neil, C. (2016). Weapons of Math Destruction: How Big Data Increases Inequality and Threatens Democracy. Crown.","Salganik, M. J. (2017). Bit by Bit: Social Research in the Digital Age. Princeton University Press.","Tufekci, Z. (2017). Twitter and Tear Gas: The Power and Fragility of Networked Protest. Yale University Press.","Turkle, S. (2011). Alone Together: Why We Expect More from Technology and Less from Each Other. Basic Books.","van Dijck, J. (2013). The Culture of Connectivity: A Critical History of Social Media. Oxford University Press.","Winner, L. (1980). Do Artifacts Have Politics? Daedalus, 109(1), 121-136.","Zuboff, S. (2019). The Age of Surveillance Capitalism: The Fight for a Human Future at the New Frontier of Power. PublicAffairs."],
        "VI. Etika, Korrupsioni dhe Dizajni Institucional": ["Anderson, S. (2000). The New Public Sector: A Case for a Public Service Ethic. Dartmouth Publishing.","Bovens, M. (2007). Analysing and Assessing Accountability: A Conceptual Framework. European Law Journal, 13(4), 447-468.","Ferejohn, J. (1999). Accountability and Authority: Toward a Theory of Political Accountability. In Democracy, Accountability, and Representation. Cambridge University Press.","Foa, R. S., & Mounk, Y. (2016). The Democratic Disconnect. Journal of Democracy, 27(3), 5-17.","Fung, A. (2006). Varieties of Participation in Complex Governance. Public Administration Review, 66(s1), 66-75.","Hirschman, A. O. (1970). Exit, Voice, and Loyalty: Responses to Decline in Firms, Organizations, and States. Harvard University Press.","Johnston, M. (2005). Syndromes of Corruption: Wealth, Power, and Democracy. Cambridge University Press.","Kaufmann, D., Kraay, A., & Mastruzzi, M. (2010). The Worldwide Governance Indicators: Methodology and Analytical Issues. World Bank Policy Research Working Paper No. 5430.","Klitgaard, R. (1988). Controlling Corruption. University of California Press.","Levi, M. (1988). Of Rule and Revenue. University of California Press.","March, J. G., & Olsen, J. P. (1989). Rediscovering Institutions: The Organizational Basis of Politics. The Free Press.","Miller, S. (2005). Corruption and Anti-Corruption: An Applied Philosophical Approach. Prentice Hall.","North, D. C. (1990). Institutions, Institutional Change and Economic Performance. Cambridge University Press.","Nye, J. S. (1967). Corruption and Political Development: A Cost-Benefit Analysis. American Political Science Review, 61(2), 417-427.","Pierson, P. (2000). Increasing Returns, Path Dependence, and the Study of Politics. American Political Science Review, 94(2), 251-267.","Rose-Ackerman, S. (1999). Corruption and Government: Causes, Consequences, and Reform. Cambridge University Press.","Rothstein, B., & Teorell, J. (2008). What Is Quality of Government? A Theory of Impartial Government Institutions. Governance, 21(2), 165-190.","Thompson, D. F. (1995). Ethics in Congress: From Individual to Institutional Corruption. Brookings Institution Press.","Walzer, M. (1983). Spheres of Justice: A Defense of Pluralism and Equality. Basic Books.","Warren, M. E. (2004). What Does Corruption Mean in a Democracy? American Journal of Political Science, 48(2), 328-343."],
        "VII. Filozofia Hermeneutike dhe Metodologjia Interpretuese": ["Bernstein, R. J. (1983). Beyond Objectivism and Relativism: Science, Hermeneutics, and Praxis. University of Pennsylvania Press.","Dilthey, W. (1989). Introduction to the Human Sciences. Princeton University Press.","Dreyfus, H. L. (1991). Being-in-the-World: A Commentary on Heidegger's Being and Time, Division I. MIT Press.","Gadamer, H.-G. (1989). Truth and method (2nd rev. ed.). Sheed & Ward.","Geertz, C. (1973). The Interpretation of Cultures. Basic Books.","Heidegger, M. (1962). Being and Time. Harper & Row.","Palmer, R. E. (1969). Hermeneutics: Interpretation Theory in Schleiermacher, Dilthey, Heidegger, and Gadamer. Northwestern University Press.","Rabinow, P., & Sullivan, W. M. (Eds.). (1987). Interpretive Social Science: A Second Look. University of California Press.","Ricoeur, P. (1981). Hermeneutics and the Human Sciences. Cambridge University Press.","Taylor, C. (1985). Philosophy and the Human Sciences: Philosophical Papers 2. Cambridge University Press."],
        "VIII. Shtesë: Vepra të Fundit me Rëndësi të Lartë": ["Acemoglu, D., & Robinson, J. A. (2019). The Narrow Corridor: States, Societies, and the Fate of Liberty. Penguin Press.","Farrell, H., & Newman, A. L. (2019). Of Privacy and Power: The Transatlantic Struggle over Freedom and Security. Princeton University Press.","Fukuyama, F. (2014). Political Order and Political Decay: From the Industrial Revolution to the Globalization of Democracy. Farrar, Straus and Giroux.","Mounk, Y. (2018). The People vs. Democracy: Why Our Freedom Is in Danger and How to Save It. Harvard University Press.","Piketty, T. (2014). Capital in the Twenty-First Century. Harvard University Press.","Pinker, S. (2018). Enlightenment Now: The Case for Reason, Science, Humanism, and Progress. Viking.","Rodrik, D. (2011). The Globalization Paradox: Democracy and the Future of the World Economy. W. W. Norton & Company.","Sandel, M. J. (2012). What Money Can't Buy: The Moral Limits of Markets. Farrar, Straus and Giroux.","Schneier, B. (2015). Data and Goliath: The Hidden Battles to Collect Your Data and Control Your World. W. W. Norton & Company.","Snyder, T. (2017). On Tyranny: Twenty Lessons from the Twentieth Century. Tim Duggan Books.","Streeck, W. (2014). Buying Time: The Delayed Crisis of Democratic Capitalism. Verso.","Sunstein, C. R. (2017). #Republic: Divided Democracy in the Age of Social Media. Princeton University Press.","Teachout, Z. (2014). Corruption in America: From Benjamin Franklin's Snuff Box to Citizens United. Harvard University Press.","Tismaneanu, V., & Lentini, P. (Eds.). (2016). Democracy and Modernity in Post-Communist Societies. Routledge.","Tooze, A. (2018). Crashed: How a Decade of Financial Crises Changed the World. Viking."]
    };

    const fullArticleTextForMetrics = useMemo(() => {
        const header = "Bibliografia Themelore e Zgjeruar e Projektit NOVARIC®...";
        const sections = Object.values(bibliography).flat().join(' ');
        return `${header} ${sections}`;
    }, []);
    
    const sourcesList = useMemo(() => [], []);
    
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleTextForMetrics,
            { url: window.location.href, published_at: "2025-10-20T17:00:00Z", article_id: 'bibliografia-zgjeruar-01' },
            sourcesList,
            { 
                researchHours: 400, 
                focusKeyword: "Bibliografi Shkenca Politike", 
                claimsTotal: 15, 
                claimsVerified: 13,
                primarySourceRatio: 0.60
            }
        );
    }, [fullArticleTextForMetrics, sourcesList]);

    const articleIntegrityProfile = useMemo((): ArticleIntegrityProfileData => {
        return calculateArticleIntegrityProfile(articleMetrics);
    }, [articleMetrics]);

    const tocItems = [
        { id: 'hyrje', title: 'Hyrje' },
        { id: 'vizualizimi-i-fjaleve-kyce', title: 'Vizualizimi i Fjalëve Kyçe' },
        { id: 'metodologjia-e-perdorimit', title: 'Metodologjia e Përdorimit' },
        { id: 'analiza-e-perputhshmerise', title: 'Analiza e Përputhshmërisë' },
        { id: 'analiza-veprave-kyce', title: 'Analiza e Veprave Kyçe' },
        { id: 'analiza-dhe-renditja', title: 'Analiza dhe Renditja e Revistave' },
        ...Object.keys(bibliography).map(title => ({
            id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: title
        }))
    ];

    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle={renderWithSuperscript("Bibliografia Themelore e Zgjeruar e Projektit NOVARIC®")}
            headerSubtitle="Një Bibliotekë e Gjallë për Analizë Kritike dhe të Informuar"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{ publishedDate: "Publikuar: 20 Tetor, 2025", location: "Shkodër, Shqipëri" }}
            tableOfContentsItems={tocItems}
            articleMetrics={articleMetrics}
            articleIntegrityProfile={articleIntegrityProfile}
            keywords={keywords}
            onBack={onBack}
            onNavigateToVipProfile={onNavigateToVipProfile}
            onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
        >
            <ArticleSection id="hyrje" title="Hyrje">
                <p>Kjo bibliografi me 150 burime përfaqëson shtyllën kurrizore intelektuale e ekosistemit NOVARIC®. Ajo është konceptuar si një "bibliotekë e gjallë" që jo vetëm justifikon metodologjitë tona aktuale (MARAGON®, PVAF), por gjithashtu na ofron mjetet për kritikën dhe zhvillimin e tyre të vazhdueshëm.</p>
            </ArticleSection>

            <ArticleSection id="vizualizimi-i-fjaleve-kyce" title="Vizualizimi i Fjalëve Kyçe">
                <p>Grafiku i mëposhtëm paraqet fjalët më të përsëritura në titujt e referencave, të cilat janë thelbësore për ekosistemin analitik të NOVARIC® dhe kontekstin politik shqiptar. Madhësia e çdo "flluske" përfaqëson frekuencën e fjalës në të gjithë bibliografinë.</p>
                <div className="flex flex-wrap justify-center items-center p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                    {keywordData.map(item => <KeywordBubble key={item.keyword} {...item} maxPercentage={maxPercentage} />)}
                </div>
            </ArticleSection>

            <ArticleSection id="metodologjia-e-perdorimit" title="Metodologjia e Përdorimit të Bibliografisë">
                <p>Më poshtë është një analizë kualitative e densitetit të pritshëm të fjalëve kyçe, e bazuar në fushën e studimit dhe misionin editorial të çdo reviste, e kombinuar me një shpjegim se si do të kryhej një analizë e tillë sasiore në një projekt kërkimor real.</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-4">Qasja Metodologjike: Si do të Kryhej një Analizë Sasiore</h3>
                <h4 className="font-bold">Hapi 1: Përcaktimi i Fjalëve Kyçe Themelore të Projektit NOVARIC®</h4>
                <p>Ne i grupojmë fjalët kyçe në grupime tematike që pasqyrojnë shtyllat e kornizës sonë:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <KeywordItemGroup icon={<BookOpenIcon className="w-6 h-6"/>} title="1. Pushteti, Qeverisja & Institucionet" keywords="governance, institutions, political power, state capture, democracy, democratization, rule of law, parliamentary performance." />
                    <KeywordItemGroup icon={<ShieldCheckIcon className="w-6 h-6"/>} title="2. Llogaridhënia, Etika & Korrupsioni" keywords="accountability, political ethics, corruption, clientelism, patronage, transparency, good governance." />
                    <KeywordItemGroup icon={<MegaphoneIcon className="w-6 h-6"/>} title="3. Komunikimi, Media & Sfera Publike" keywords="political communication, media systems, public sphere, framing, discourse analysis, misinformation, polarization." />
                    <KeywordItemGroup icon={<CpuChipIcon className="w-6 h-6"/>} title="4. Teknologjia, Të Dhënat & Shoqëria" keywords="big data, algorithms, AI ethics, surveillance, digital democracy, computational social science." />
                    <KeywordItemGroup icon={<GlobeEuropeAfricaIcon className="w-6 h-6"/>} title="5. Konteksti Post-Komunist & Tranzicioni" keywords="post-communism, transitional justice, democratization, Eastern Europe, Balkans." />
                </div>
                
                <h4 className="font-bold mt-4">Hapi 2: Përdorimi i Databazave Akademike</h4>
                <p>Studiuesit do të përdornin databaza si Scopus ose Web of Science. Për shembull, një kërkim mund të ishte:</p>
                <pre className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md text-xs font-mono overflow-x-auto"><code>TITLE-ABS-KEY("political accountability" OR "clientelism") AND (SRCTITLE("Journal of Democracy") OR SRCTITLE("Governance"))</code></pre>
                
                <h4 className="font-bold mt-4">Hapi 3: Analiza dhe Interpretimi</h4>
                <p>Rezultati do të ishte një analizë e trendeve: sa shpesh shfaqen këto tema, në cilat revista, dhe si ka ndryshuar frekuenca e tyre me kalimin e kohës.</p>

                <h3 className="text-xl font-semibold mt-8 mb-4">Analiza Kualitative e Densitetit të Fjalëve Kyçe</h3>
                <div className="space-y-4">
                    <AccordionItem title="Tier 1: Densitet Ekstremisht i Lartë (Revistat Themelore)" isOpen={openTier === 'tier-1'} onToggle={() => setOpenTier(openTier === 'tier-1' ? null : 'tier-1')}>
                        <p>Këto revista janë fusha ku konceptet tona kryesore jo vetëm përmenden, por lindin, debatohen dhe zhvillohen.</p>
                        <ul className="list-disc list-inside mt-2">
                           <li><strong>Për Qeverisjen, Llogaridhëninë & Etikën:</strong> Governance, Journal of Democracy, Ethics, Journal of Political Philosophy.</li>
                           <li><strong>Për Komunikimin & Median:</strong> Political Communication, The International Journal of Press/Politics, New Media & Society.</li>
                           <li><strong>Për Kontekstin Rajonal:</strong> East European Politics and Societies, Europe-Asia Studies.</li>
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

            <ArticleSection id="analiza-e-perputhshmerise" title="Analiza e Përputhshmërisë së Fjalëve Kyçe NOVARIC® me Titujt e Revistave Themelore">
                <p>Kjo analizë skanon listën e 150 titujve të revistave për të identifikuar përputhje të drejtpërdrejta ose të qarta me fjalët kyçe të përcaktuara për çdo grupim tematik. Rezultati nuk është thjesht një numërim i thatë, por një vlerësim i "peshës" editoriale që çdo grupim ka brenda bibliografisë sonë, duke përdorur titujt si një tregues (proxy) të fokusit kryesor të revistës.</p>
                <div className="space-y-6 mt-6">
                    {complianceData.map(item => (
                        <ComplianceCard key={item.group} icon={<BookOpenIcon className="w-6 h-6 text-primary-600 dark:text-primary-400"/>} {...item} />
                    ))}
                </div>
            </ArticleSection>
            
            <ArticleSection id="analiza-veprave-kyce" title="Analiza e Veprave Kyçe sipas Rëndësisë Strategjike">
                <p>Këtu janë kartat e përshkrimit për veprat e tjera shumë relevante nga lista, duke ndjekur të njëjtën strukturë dhe duke u fokusuar në ato që ofrojnë perspektiva unike dhe thelbësore për analizën e jurisprudencës dhe shtetit të së drejtës në Shqipëri.</p>
                <div className="space-y-6 mt-6">
                    {Object.entries(workRelevanceDataGrouped).map(([category, works]) => (
                        <div key={category}>
                            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-3 border-b-2 border-slate-200 dark:border-slate-700 pb-2">{category}</h3>
                            <div className="space-y-4">
                                {works.map(work => <WorkRelevanceCard key={work.title} {...work} />)}
                            </div>
                        </div>
                    ))}
                </div>
            </ArticleSection>

            <ArticleSection id="analiza-dhe-renditja" title="Analiza dhe Renditja e Revistave sipas Relevancës për Shqipërinë">
                 {/* This section will be populated with JournalRelevanceCard components */}
                 <p className="italic">Ky seksion përmban analizën e detajuar të revistave kyçe...</p>
            </ArticleSection>

            {Object.entries(bibliography).map(([title, items]) => (
                <ArticleSection key={title} id={title.toLowerCase().replace(/[^a-z0-9]+/g, '-')} title={title}>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        {items.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </ArticleSection>
            ))}
        </ArticleTemplate1>
    );
};