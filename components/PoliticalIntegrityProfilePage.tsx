import React, { useMemo, ReactNode } from 'react';
import { ArticleMetrics } from '../types';
import { calculateArticleMetrics } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, KeyConcept } from './templates/ArticleTemplate1';
import { ServerStackIcon, CpuChipIcon, BeakerIcon, ShieldCheckIcon } from './icons';

interface PoliticalIntegrityProfilePageProps {
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

const MatrixQuadrant: React.FC<{ title: string; status: string; color: string; children: React.ReactNode }> = ({ title, status, color, children }) => (
    <div className={`p-4 rounded-lg border-2`} style={{ borderColor: color, backgroundColor: `${color}1A`}}>
        <h4 className="font-bold text-lg" style={{ color }}>{title}</h4>
        <p className="font-semibold text-sm mb-2" style={{ color }}>Statusi: {status}</p>
        <p className="text-sm text-slate-700 dark:text-slate-300">{children}</p>
    </div>
);

const UiMockup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mt-4">
        <h4 className="font-semibold text-center text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">{title}</h4>
        {children}
    </div>
);


export const PoliticalIntegrityProfilePage: React.FC<PoliticalIntegrityProfilePageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;

    const pageTitle = "Udhëzues për Aplikacionin: Profili i Integritetit Politik (PIP) | NOVARIC®";
    const pageDescription = "Një mjet diagnostikues i avancuar që ofron një vlerësim analitik të rrezikut të integritetit të një aktori politik, duke kombinuar analizën strukturore me atë bihejviorale.";
    const keywords = ["Profili i Integritetit Politik", "PIP", "Analizë Rreziku", "Integritet Politik", "Llogaridhënie", "Antikorrupsion", "Vlerësim Politik", "NOVARIC"];
    
    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="qellimi" title="Qëllimi i Modulit">
                 <p className="italic text-lg">
                    Brenda Motorit të Vlerësimit PARAGON®, moduli i Profilit të Integritetit Politik (PIP) fokusohet specifikisht në diagnozën e rrezikut të korrupsionit dhe sjelljes joetike.
                </p>
                <p>PIP-i nuk jep verdikte ligjore, por ofron një vlerësim analitik të rrezikut të integritetit të një aktori politik. Filozofia e tij është: <KeyConcept term="Konteksti" definition="Mjedisi politik, rregullator dhe social në të cilin vepron një aktor."/> përcakton mundësinë; <KeyConcept term="individi" definition="Karakteristikat personale, historia dhe rrjeti i marrëdhënieve të aktorit."/> e shfrytëzon atë. PIP-i kombinon analizën strukturore me atë bihejviorale për të ofruar një pamje të plotë dhe të kuptueshme.</p>
            </ArticleSection>

            <ArticleSection id="motori-te-dhenave" title="Seksioni 1: Motori i të Dhënave – Dy Komponentët Themelorë">
                <p>Aplikacioni duhet të përpunojë të dhëna nga dy motorë analitikë të pavarur.</p>
                <div className="space-y-6 mt-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                        <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200 mb-2 flex items-center"><ServerStackIcon className="w-6 h-6 mr-2 text-blue-500"/>Komponenti A: Skaneri Strukturor & i Performancës (AGIB)</h3>
                        <p>Ky komponent mat objektivisht mjedisin dhe rolin e politikanit brenda sistemit.</p>
                        <p><strong>Dalja Kryesore:</strong> Arketipi Dominues dhe Vlerësimi i Vulnerabilitetit Strukturor (I Ulët, Mesatar, I Lartë).</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                        <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200 mb-2 flex items-center"><CpuChipIcon className="w-6 h-6 mr-2 text-green-500"/>Komponenti B: Diagnoza Psiko-Bihejviorale (CRI)</h3>
                        <p>Ky komponent analizon individin – gjuhën, historinë dhe marrëdhëniet e tij.</p>
                        <p><strong>Dalja Kryesore:</strong> Pikëzimi Final CRI (0-100) dhe Vlerësimi i Rrezikut Bihejvioral (I Ulët, Mesatar, I Lartë).</p>
                    </div>
                </div>
            </ArticleSection>

            <ArticleSection id="motori-sintezes" title="Seksioni 2: Motori i Sintezës – Matrica e Rrezikut të Integritetit">
                <p>Këtu aplikacioni kombinon daljet e dy komponentëve për të krijuar një diagnozë të plotë duke i vendosur në një matricë 2x2. Në aksin horizontal (X) vendoset Vulnerabiliteti Strukturor (nga Komponenti A), ndërsa në aksin vertikal (Y) vendoset Rreziku Bihejvioral (nga Komponenti B).</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <MatrixQuadrant title="Kuadranti 3: Prirje Shqetësuese" status="Rrezik i Moderuar" color="#f97316">
                        "Megjithëse roli aktual i këtij profili mund të mos jetë në qendër të pushtetit, analiza e diskursit dhe historikut të tij tregon një prirje shqetësuese për të anashkaluar rregullat dhe për të justifikuar sjelljen joetike."
                    </MatrixQuadrant>
                    <MatrixQuadrant title="Kuadranti 4: ALERT I LARTË INTEGRITETI" status="Rrezik i Lartë" color="#ef4444">
                        "Ky profil paraqet rrezikun më të lartë. Ai kombinon një pozicion me mundësi të mëdha abuzimi me një prirje të provuar bihejviorale për të shkelur normat etike. Rrezikshmëri maksimale për kapjen e shtetit."
                    </MatrixQuadrant>
                    <MatrixQuadrant title="Kuadranti 1: Integritet i Qëndrueshëm" status="Rrezik i Ulët" color="#22c55e">
                        "Ky profil tregon një rrezik të ulët për integritetin publik. Roli politik i individit ofron pak mundësi për abuzim strukturor dhe analiza e sjelljes së tij tregon respekt për normat etike."
                    </MatrixQuadrant>
                     <MatrixQuadrant title="Kuadranti 2: Rrezik i Fjetur" status="Kërkon Monitorim" color="#eab308">
                        "Ky profil ndodhet në një pozicion me fuqi dhe mundësi të konsiderueshme për abuzim. Megjithatë, sjellja e tij individuale deri më tani nuk ka shfaqur prirje sistematike joetike."
                    </MatrixQuadrant>
                </div>
            </ArticleSection>

            <ArticleSection id="paraqitja-vizuale" title="Seksioni 3: Paraqitja Vizuale në Aplikacion (User Interface)">
                <p>Ky është modeli se si informacioni duhet t'i shfaqet përdoruesit në mënyrë të qartë dhe intuitive.</p>
                <UiMockup title="Elementi 1: Përmbledhja Kryesore">
                    <div className="flex items-center gap-4">
                        <img src="https://via.placeholder.com/80" alt="placeholder" className="w-20 h-20 rounded-full object-cover" />
                        <div className="flex-grow">
                            <h5 className="font-bold text-xl">Emri i Politikanit</h5>
                            <div className="mt-2 px-4 py-2 bg-red-500 text-white font-bold text-center rounded-md">ALERT I LARTË INTEGRITETI</div>
                        </div>
                    </div>
                </UiMockup>
                <UiMockup title="Elementi 2 & 3: Matrica Vizuale & Përmbledhja Klinike">
                     <div className="grid grid-cols-2 gap-2 text-xs text-center border border-slate-300 dark:border-slate-600">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/50">Prirje Shqetësuese</div>
                        <div className="p-2 bg-red-100 dark:bg-red-900/50 relative">ALERT I LARTË <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-red-500">●</span></div>
                        <div className="p-2 bg-green-100 dark:bg-green-900/50">Integritet i Qëndrueshëm</div>
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50">Rrezik i Fjetur</div>
                    </div>
                    <p className="text-xs italic mt-2">"Pozicioni i Politikanit Y vjen nga kombinimi i <strong>Vulnerabilitetit të Lartë Strukturor</strong> (si 'Ndërmjetës') me një <strong>Rrezik të Lartë Bihejvioral</strong> (CRI: 85). Kjo tregon se profili ka mundësi dhe prirje për abuzim."</p>
                </UiMockup>
                 <UiMockup title="Elementi 4: Detajet e Analizës (Tabs)">
                    <div className="flex border-b border-slate-300 dark:border-slate-600">
                        <button className="px-4 py-2 text-sm font-semibold border-b-2 border-primary-500 text-primary-600 dark:text-primary-400">Skaneri Strukturor</button>
                        <button className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">Diagnoza Bihejviorale</button>
                    </div>
                    <div className="p-2 text-sm space-y-1">
                        <p><strong>Arketipi:</strong> Ndërmjetësi i Prapaskenës (85%)</p>
                        <p><strong>Centraliteti në Rrjet:</strong> 92/100</p>
                        <p><strong>Indeksi SCRI:</strong> 78/100</p>
                    </div>
                </UiMockup>
            </ArticleSection>
        </>
    ), []);

    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(fullArticleText, {
            url: window.location.href,
            published_at: new Date().toISOString(),
            article_id: 'pip-guide-01'
        }, [], { researchHours: 80, focusKeyword: "Profili i Integritetit Politik" });
    }, [fullArticleText]);

    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Udhëzues për Aplikacionin: Profili i Integritetit Politik (PIP)"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaricstorage.blob.core.windows.net/media/AdobeStock_1030253027.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaricstorage.blob.core.windows.net/media/Profile-Photos/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{ publishedDate: "Publikuar: 15 Dhjetor, 2025", location: "Shkodër, Shqipëri" }}
            tableOfContentsItems={[
                { id: "qellimi", title: "Qëllimi i Modulit" },
                { id: "motori-te-dhenave", title: "Seksioni 1: Motori i të Dhënave" },
                { id: "motori-sintezes", title: "Seksioni 2: Motori i Sintezës" },
                { id: "paraqitja-vizuale", title: "Seksioni 3: Paraqitja Vizuale në Aplikacion" }
            ]}
            articleMetrics={articleMetrics}
            keywords={keywords}
            onBack={onBack}
            onNavigateToVipProfile={onNavigateToVipProfile}
            onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
        >
            {articleContentJsx}
        </ArticleTemplate1>
    );
};