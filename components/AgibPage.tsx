import React, { useMemo, ReactNode } from 'react';
import { ArticleMetrics } from '../types';
import { calculateArticleMetrics } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection, KeyConcept } from './templates/ArticleTemplate1';

interface AgibPageProps {
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

export const AgibPage: React.FC<AgibPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;

    const pageTitle = "Barometri Shqiptar i Qeverisjes dhe Integritetit (AGIB) | NOVARIC®";
    const pageDescription = "Një kuadër i gjeneratës së dytë për të diagnostikuar korrupsionin, kapjen e shtetit dhe për të matur progresin e Shqipërisë kundrejt normave të BE-së.";
    const keywords = ["AGIB", "Qeverisje", "Integritet", "Korrupsion", "Kapja e Shtetit", "Sundimi i Ligjit", "Shqipëri", "BE", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "https://www.u4.no/", text: "U4 Anti-Corruption Resource Centre", credibility_industry_rating_pct: 90 },
        { id: 2, url: "https://www.oecd.org/gov/anti-corruption/", text: "OECD - Anti-Corruption & Integrity", credibility_industry_rating_pct: 95 },
    ], []);

    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="Hyrje: Përtej Perceptimit, Drejt Diagnozës">
                <p className="italic text-lg">
                    Brenda Motorit të Vlerësimit PARAGON®, moduli i Barometrit Shqiptar të Qeverisjes dhe Integritetit (AGIB) fokusohet specifikisht në matjen e shëndetit institucional të vendit.
                </p>
                <p>
                    Indekset tradicionale të korrupsionit, si Indeksi i Perceptimit të Korrupsionit (CPI), ofrojnë një pasqyrë të vlefshme, por të kufizuar. Ato masin perceptimin, jo mekanizmat. AGIB, është një kuadër analitik i gjeneratës së dytë që lëviz përtej perceptimit për të ofruar një diagnozë të thelluar të shëndetit institucional të Shqipërisë.
                </p>
                <p>
                    AGIB kombinon të dhëna sasiore me analiza cilësore për të matur jo vetëm nivelin e korrupsionit, por edhe format specifike që ai merr, duke përfshirë kapjen e shtetit, klientelizmin dhe korrupsionin administrativ. Ai shërben si një mjet monitorimi për të vlerësuar progresin (ose regresin) e Shqipërisë në rrugën e saj drejt standardeve të Bashkimit Evropian.
                </p>
            </ArticleSection>

            <ArticleSection id="dimensionet" title="Dimensionet e Vlerësimit të AGIB">
                <p>AGIB e dekonstrukton konceptin e "qeverisjes së mirë" në disa dimensione të matshme:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Integriteti Institucional:</strong> Mat pavarësinë dhe efektivitetin e institucioneve kyçe si gjyqësori, prokuroria dhe agjencitë anti-korrupsion.</li>
                    <li><strong>Transparenca dhe Llogaridhënia:</strong> Vlerëson aksesin në informacionin publik, transparencën e prokurimeve dhe financimit të partive, si dhe efektivitetin e mekanizmave të llogaridhënies.</li>
                    <li><strong>Rreziku i Kapjes së Shtetit:</strong> Analizon ndikimin e interesave private mbi procesin legjislativ dhe rregullator, duke identifikuar sektorët më të rrezikuar.</li>
                    <li><strong>Kultura e Shërbimit Publik:</strong> Mat nivelin e politizimit të administratës publike dhe mbizotërimin e meritokracisë kundrejt klientelizmit.</li>
                    <li><strong>Angazhimi Qytetar dhe Media e Lirë:</strong> Vlerëson rolin e shoqërisë civile dhe medias si aktorë mbikëqyrës në sistemin e llogaridhënies.</li>
                </ul>
            </ArticleSection>

             <ArticleSection id="perfundime" title="Përfundime dhe Hapat e Ardhshëm">
                <p>AGIB ofron një pasqyrë të detajuar dhe të bazuar në prova të sfidave të qeverisjes në Shqipëri. Rezultatet e tij nuk janë një dënim, por një ftesë për veprim. Duke identifikuar me saktësi pikat e dobëta të sistemit, AGIB u ofron politikëbërësve, shoqërisë civile dhe partnerëve ndërkombëtarë një udhërrëfyes për reformat e ardhshme. NOVARIC® do të publikojë rezultatet e plota të AGIB në mënyrë periodike, duke kontribuar në një debat publik të informuar dhe duke rritur presionin për llogaridhënie.</p>
            </ArticleSection>
        </>
    ), []);

    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText,
            { url: window.location.href, published_at: new Date().toISOString(), article_id: 'agib-methodology-01' },
            sourcesList,
            { researchHours: 120, focusKeyword: "AGIB" }
        );
    }, [fullArticleText, sourcesList]);

    return (
        <ArticleTemplate1
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle="Barometri Shqiptar i Qeverisjes dhe Integritetit (AGIB)"
            headerSubtitle="Një Kuadër i Gjeneratës së Dytë për Diagnozën e Korrupsionit dhe Kapjes së Shtetit"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{ publishedDate: "Publikuar: 1 Shkurt, 2026", location: "Shkodër, Shqipëri" }}
            tableOfContentsItems={[
                { id: "hyrje", title: "Hyrje: Përtej Perceptimit" },
                { id: "dimensionet", title: "Dimensionet e Vlerësimit" },
                { id: "perfundime", title: "Përfundime dhe Hapat e Ardhshëm" }
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