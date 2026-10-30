import React, { useMemo, ReactNode } from 'react';
import { renderWithSuperscript } from '../utils/textUtils';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, KeyConcept } from './templates/ArticleTemplate1';
import { JsonLd } from './JsonLd';

interface PoliticalProfileFrameworkPageProps {
  onBack: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
}

const extractText = (children: ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(extractText).join(' ');
  }
  if (React.isValidElement<{ children?: ReactNode }>(children) && children.props.children) {
    return extractText(children.props.children);
  }
  return '';
};

export const PoliticalProfileFrameworkPage: React.FC<PoliticalProfileFrameworkPageProps> = ({ onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained }) => {
    
    const pageTitle = "Korniza e Vlerësimit të Profilit Politik (PVAF) | Metodologji 360° - NOVARIC®";
    const pageDescription = "Një metodologji analitike 360° për të vlerësuar deputetët dhe zyrtarët shqiptarë, bazuar në të dhëna për performancën institucionale, diskursin publik dhe integritetin.";
    const keywords = ["Vlerësim Politik", "Profili i Deputetit", "Analizë Politike Shqipëri", "Performanca Parlamentare", "Llogaridhënia Politike", "Etika Politike", "Diskursi Publik", "Shkenca Politike", "PVAF", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "https://www.cambridge.org/core/journals/comparative-political-studies", text: "Comparative Political Studies", credibility_industry_rating_pct: 94 },
        { id: 2, url: "https://www.journalofdemocracy.org/", text: "Journal of Democracy", credibility_industry_rating_pct: 95 },
        { id: 3, url: "https://onlinelibrary.wiley.com/journal/14685973", text: "Governance", credibility_industry_rating_pct: 93 },
        { id: 4, url: "https://mitpress.mit.edu/9780262581081/the-structural-transformation-of-the-public-sphere/", text: "Habermas, J. (1989). The structural transformation of the public sphere. MIT Press.", credibility_industry_rating_pct: 98 },
    ], []);

    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="problemi" title="1. Problemi: Vlerësimi Sipërfaqësor i Përfaqësuesve Politikë">
                <p>Në diskursin publik shqiptar, vlerësimi i një politikani, si për shembull një deputeti, shpesh reduktohet në një karikaturë të thjeshtuar. Ai ose ajo gjykohet bazuar në deklarata të shkëputura, shfaqje televizive, përkatësi partiake, ose akuza të paverifikuara. Mungon një kuadër sistematik, i bazuar në të dhëna, që t'i ofrojë qytetarit një pasqyrë të plotë dhe të nuancuar të performancës së përfaqësuesit të tij.</p>
                <p>Ky boshllëk analitik e lë qytetarin të paaftë për të ushtruar llogaridhënie efektive. Pa metrika të qarta, vota bazohet më shumë në besnikëri dhe emocion sesa në gjykim të informuar, duke dobësuar hallkën thelbësore të demokracisë përfaqësuese.</p>
            </ArticleSection>

            <ArticleSection id="zgjidhja" title="2. Zgjidhja: Korniza PVAF - Një Qasje 360°">
                <p>Për t'iu përgjigjur kësaj sfide, NOVARIC® ka zhvilluar Kornizën e Vlerësimit të Profilit Politik (PVAF - Political Profile Assessment Framework). Kjo është një metodologji e pronësisë që integron njohuri nga shkenca politike, studimet e komunikimit dhe etika publike për të ofruar një vlerësim holistik, 360 gradë, të një aktori politik.</p>
                <p>Filozofia e PVAF është se një politikan duhet të vlerësohet jo vetëm për atë që thotë, por për atë që bën dhe për cilësinë e mënyrës se si i bën të dyja. Korniza jonë e dekonstrukton profilin e një politikani në tre dimensione thelbësore dhe të matshme.</p>
            </ArticleSection>
            
            <ArticleSection id="dimensionet" title="3. Dimensionet e Vlerësimit PVAF">
                <div className="space-y-4">
                    <p><strong>Dimensioni I: Performanca Institucionale ("Çfarë Bën?"):</strong> Ky dimension fokusohet në veprimtarinë e politikanit brenda rolit të tij zyrtar. Për një deputet, kjo përfshin një analizë sasiore dhe cilësore të: Aktivitetit Legjislativ, Mbikëqyrjes Parlamentare, Pjesëmarrjes dhe Votimit. Kjo analizë bazohet në metodologji të përdorura gjerësisht në studimet parlamentare për të matur efektivitetin legjislativ (krh. <em className="font-semibold">Comparative Political Studies</em>).</p>
                    <p><strong>Dimensioni II: Cilësia e Diskursit Publik ("Si Flet?"):</strong> Ky dimension vlerëson komunikimin e politikanit me publikun. Duke përdorur mjetet e zhvilluara te PARAGON, ne lëvizim përtej analizës së thjeshtë të sentimetit dhe masim: Kompleksiteti Argumentues, Kornizimi (Framing) i Çështjeve, Cilësia Deliberative. Kjo mat kontributin e tij/saj në shëndetin e <KeyConcept term="sferës publike" definition="Një hapësirë (metaforike) në jetën shoqërore ku individët mund të mblidhen për të diskutuar lirishëm dhe për të identifikuar problemet shoqërore, dhe përmes këtij diskutimi të ndikojnë në veprimin politik."/> (Habermas, 1989).</p>
                    <p><strong>Dimensioni III: Integriteti dhe Llogaridhënia ("Kush Është?"):</strong> Ky dimension adreson karakterin etik dhe përkushtimin ndaj transparencës. Ai përfshin: Transparencën Financiare, Përputhshmërinë Etike, Reagueshmërinë ndaj Publikut. Kjo është një masë thelbësore e kulturës demokratike (krh. <em className="font-semibold">Journal of Democracy, Governance</em>).</p>
                </div>
            </ArticleSection>

            <ArticleSection id="integrimi" title="4. Integrimi në Ekosistemin NOVARIC®">
                <p>PVAF nuk vepron në izolim. Të dhënat e tij ushqejnë dhe ushqehen nga kornizat e tjera. Për shembull: Analiza e mediave nga MARAGON na tregon se cilat media i japin një platformë jokritike një politikani. Pikëzimi i një politikani te PVAF ndihmon në interpretimin e mbulimit mediatik.</p>
                <p>Duke i ofruar publikut këtë kornizë analitike të plotë, NOVARIC® synon të transformojë marrëdhënien midis përfaqësuesve dhe të përfaqësueve, duke e bazuar atë më pak te besimi i verbër dhe më shumë te vlerësimi i vazhdueshëm dhe i informuar.</p>
            </ArticleSection>
        </>
    ), []);

    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText, 
            {
                url: window.location.href,
                published_at: "2025-09-01T22:00:00Z",
                article_id: 'political-profile-framework-01'
            }, 
            sourcesList,
            {
                researchHours: 220,
                focusKeyword: "Korniza e Vlerësimit Politik"
            }
        );
    }, [fullArticleText, sourcesList]);

    const articleIntegrityProfile = useMemo((): ArticleIntegrityProfileData => {
        return calculateArticleIntegrityProfile(articleMetrics);
    }, [articleMetrics]);

    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle={renderWithSuperscript("Korniza e Vlerësimit të Profilit Politik (PVAF)")}
            headerSubtitle="Një Metodologji Analitike 360° për Aktorët Politikë Shqiptarë"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 1 Shtator, 2025",
                lastUpdated: "20 Tetor, 2025",
                location: "Shkodër, Shqipëri"
            }}
            tableOfContentsItems={[
                { id: "problemi", title: "1. Problemi: Vlerësimi Sipërfaqësor" },
                { id: "zgjidhja", title: "2. Zgjidhja: Korniza PVAF - Qasja 360°" },
                { id: "dimensionet", title: "3. Dimensionet e Vlerësimit" },
                { id: "integrimi", title: "4. Integrimi në Ekosistemin NOVARIC®" }
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