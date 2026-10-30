import React, { useMemo, ReactNode } from 'react';
import { renderWithSuperscript } from '../utils/textUtils';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection } from './templates/ArticleTemplate1';

interface PvafInstitutionalPerformancePageProps {
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


export const PvafInstitutionalPerformancePage: React.FC<PvafInstitutionalPerformancePageProps> = ({ onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained }) => {
    
    const pageTitle = "Performanca Institucionale (PVAF) | Matja e Veprimit Parlamentar - NOVARIC®";
    const pageDescription = "Eksploroni dimensionin e parë të kornizës PVAF të NOVARIC®: matja sasiore dhe cilësore e performancës institucionale të një deputeti.";
    const keywords = ["Performanca Parlamentare", "Veprimtaria Legjislative", "Mbikëqyrje Parlamentare", "Analiza e Votimit", "Shkenca Politike", "Llogaridhënia e Deputetit", "PVAF", "Punë Parlamentare", "Efektiviteti Legjislativ", "NOVARIC"];
    
    const sourcesList = useMemo(() => [
        { id: 1, url: "https://www.cambridge.org/core/journals/american-political-science-review", text: "American Political Science Review", credibility_industry_rating_pct: 98 },
        { id: 2, url: "https://onlinelibrary.wiley.com/journal/14756765", text: "European Journal of Political Research", credibility_industry_rating_pct: 96 },
    ], []);

    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="filozofia" title="1. Filozofia: Nga Përfaqësimi Pasiv te Veprimi Aktiv">
                <p>Dimensioni i parë i Kornizës së Vlerësimit të Profilit Politik (PVAF) fokusohet te puna thelbësore, shpesh e padukshme, e një deputeti brenda institucionit që ai përfaqëson. Në teorinë e demokracisë përfaqësuese, një deputet nuk është thjesht një simbol i vullnetit të zgjedhsve; ai është një agjent aktiv me tre funksione kryesore: ligjbërja, mbikëqyrja e qeverisë dhe përfaqësimi i zonës zgjedhore. Ky dimension synon të masë në mënyrë sasiore dhe cilësore se sa mirë i përmbush një deputet këto detyra.</p>
                <p>Ne lëvizim përtej metrikës së thjeshtë të "pjesëmarrjes në seancë" për të ndërtuar një pasqyrë të plotë të efektivitetit legjislativ. Metodologjia jonë bazohet në kërkime të gjera nga shkencat politike mbi sjelljen parlamentare, duke adaptuar modele ndërkombëtare në kontekstin specifik të Kuvendit të Shqipërisë (krh. American Political Science Review, European Journal of Political Research).</p>
            </ArticleSection>
            <ArticleSection id="metrikat" title="2. Metrikat e Analizës Sasiore: Matja e Aktivitetit">
                <p>Bërthama e këtij dimensioni është mbledhja dhe analiza e të dhënave të hapura parlamentare. Modeli ynë i IA-së (Nora) është trajnuar për të nxjerrë dhe strukturuar automatikisht të dhënat nga faqja zyrtare e Kuvendit dhe burime të tjera publike.</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">2.1. Metrikat e Ligjbërjes:</h3>
                <ul className="list-disc list-inside pl-4">
                    <li>Nisma Ligjore (Autorësi): Numri i propozimeve për ligje ose amendamente ku deputeti është nismëtar kryesor.</li>
                    <li>Nisma Ligjore (Bashkë-autorësi): Numri i propozimeve ku deputeti është bashkë-nismëtar.</li>
                </ul>
                <h3 className="text-xl font-semibold mt-4 mb-2">2.2. Metrikat e Mbikëqyrjes:</h3>
                 <ul className="list-disc list-inside pl-4">
                    <li>Pyetje Drejtuar Ministrave: Numri i pyetjeve me shkrim ose me gojë drejtuar anëtarëve të kabinetit qeveritar.</li>
                    <li>Interpelanca dhe Mocione: Numri i kërkesave për interpelanca urgjente apo mocione me debat.</li>
                    <li>Fjalime në Seancë Plenare: Numri dhe kohëzgjatja e fjalimeve të mbajtura.</li>
                </ul>
            </ArticleSection>
             <ArticleSection id="analiza-cilësore" title="3. Analiza Cilësore: Vlerësimi i Ndikimit">
                <p>Përtej numrave, ne vlerësojmë cilësinë dhe ndikimin e veprimtarisë së deputetit. IA analizon transkriptet e fjalimeve dhe propozimet ligjore për të matur thellësinë e argumentit, origjinalitetin e propozimeve dhe përputhjen me nevojat e zonës zgjedhore. Ky hap cilësor është thelbësor për të dalluar një deputet aktiv nga një deputet efektiv.</p>
                <p>Për shembull, një deputet mund të ketë shumë fjalime (sasi e lartë), por nëse ato janë përsëritëse dhe pa substancë, pikëzimi cilësor do të jetë i ulët.</p>
            </ArticleSection>
        </>
    ), []);

    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText,
            {
                url: window.location.href,
                published_at: "2025-09-15T10:00:00Z",
                article_id: 'pvaf-performance-01'
            },
            sourcesList,
            {
                researchHours: 250,
                focusKeyword: "Performanca Parlamentare"
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
          headerTitle={renderWithSuperscript("Dimensioni i Parë - Performanca Institucionale")}
          headerSubtitle="Matja e Veprimit Parlamentar"
          authors={[
              { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
              { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
          ]}
          publicationInfo={{
              publishedDate: "Publikuar: 15 Shtator, 2025",
              location: "Shkodër, Shqipëri"
          }}
          tableOfContentsItems={[
              { id: "filozofia", title: "1. Filozofia" },
              { id: "metrikat", title: "2. Metrikat Sasiore" },
              { id: "analiza-cilësore", title: "3. Analiza Cilësore" },
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