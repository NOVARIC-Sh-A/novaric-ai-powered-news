import React, { useMemo, ReactNode } from 'react';
import { renderWithSuperscript } from '../utils/textUtils';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { ArticleTemplate1, ArticleSection } from './templates/ArticleTemplate1';

interface ParagonMethodologyUnifiedPageProps {
  onBack: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
  onNavigateToParagonConceptKapsh?: () => void;
  onNavigateToParagonConceptBehavioral?: () => void;
  onNavigateToParagonConceptCompetency?: () => void;
  onNavigateToParagonConceptFeedback?: () => void;
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

export const ParagonMethodologyUnifiedPage: React.FC<ParagonMethodologyUnifiedPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained, onNavigateToParagonConceptKapsh, onNavigateToParagonConceptBehavioral, onNavigateToParagonConceptCompetency, onNavigateToParagonConceptFeedback } = props;
    
    const pageTitle = "Metodologjia e Unifikuar PARAGON® | Analiza e Thelluar e Profileve Politike Shqiptare";
    const pageDescription = "Eksploroni Metodologjinë PARAGON®, motorin analitik të NOVARIC® për vlerësimin e thelluar të politikanëve shqiptarë.";
    const keywords = ["Metodologji PARAGON", "Analizë Politike", "KAPSH", "Vlerësim Sjelljeje", "Kompetenca", "Feedback 360", "NOVARIC"];

    const sourcesList = useMemo(() => [], []);

    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="Përmbledhje Ekzekutive: Një Kornizë e Sintetizuar">
                <p>Metodologjia PARAGON® përfaqëson një qasje të unifikuar dhe ndërdisiplinore për vlerësimin e aktorëve politikë. Ajo është projektuar për të tejkaluar analizat sipërfaqësore, duke ofruar një diagnozë të thellë që bazohet në parimin "Provat Së Pari, Gjykimi në Fund". Kjo metodologji nuk është një shpikje e izoluar, por një sintezë e katër fushave të njohura globalisht të analizës së lidershipit dhe performancës, të përshtatura për kontekstin unik shqiptar.</p>
                <p>Qëllimi është të ofrojë një pasqyrë transparente dhe të bazuar në teori, duke i dhënë publikut dhe palëve të interesuara mjetet për një llogaridhënie të informuar.</p>
            </ArticleSection>

            <ArticleSection id="shtyllat" title="Katër Shtyllat Themelore të PARAGON®">
                <p>Korniza PARAGON® ndërtohet mbi katër shtylla themelore, secila prej të cilave përfaqëson një fushë të konsoliduar të studimit. Këto shtylla së bashku ofrojnë një vlerësim 360-gradë të një profili politik.</p>
                <div className="space-y-6 text-slate-700 dark:text-slate-200">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">1. Analiza Kontekstuale dhe Psiko-Sociale</h2>
                      <p>
                        Për të kuptuar "pse"-në pas sjelljes së një politikani, ne përdorim{' '}
                        <button onClick={onNavigateToParagonConceptKapsh} className="font-bold text-red-600 dark:text-red-400 hover:underline">
                          Kornizën Arkitekturore Psikologjike Shqiptare (KAPSH)
                        </button>
                        . Kjo na lejon të analizojmë se si tiparet e personalitetit dhe konteksti socio-historik shqiptar ndërveprojnë për të formësuar stilin e një lideri.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-2">2. Vlerësimi i Bazuar në Sjellje</h2>
                      <p>
                        Duke ndjekur parimin se "e kaluara parashikon të ardhmen", ne zbatojmë{' '}
                        <button onClick={onNavigateToParagonConceptBehavioral} className="font-bold text-red-600 dark:text-red-400 hover:underline">
                          Metodat e Vlerësimit të Sjelljes
                        </button>
                        , si Intervista e Ngjarjeve të Sjelljes (BEI), për të mbledhur prova konkrete të mënyrës se si një politikan ka vepruar në situata reale.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-2">3. Analiza e Aftësive Thelbësore</h2>
                      <p>
                        Për të kuptuar "çfarë" mund të bëjë një politikan, ne përdorim{' '}
                        <button onClick={onNavigateToParagonConceptCompetency} className="font-bold text-red-600 dark:text-red-400 hover:underline">
                          Kornizat e Bazuara në Kompetenca
                        </button>
                        . Kjo na lejon të matim aftësi specifike si mendimi strategjik, komunikimi dhe integriteti, të cilat janë thelbësore për suksesin në një rol publik.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-2">4. Matja e Perceptimit dhe Ndikimit</h2>
                      <p>
                        Për të kuptuar se si një politikan perceptohet nga ata me të cilët punon, ne integrojmë parimet e{' '}
                        <button onClick={onNavigateToParagonConceptFeedback} className="font-bold text-red-600 dark:text-red-400 hover:underline">
                          Sistemeve të Feedback-ut nga Burime të Shumëfishta
                        </button>
                        . Kjo na ndihmon të identifikojmë "pikat e verbëra" dhe të kuptojmë ndikimin real të një lideri në ekipin dhe organizatën e tij.
                      </p>
                    </div>
                  </div>
            </ArticleSection>

             <ArticleSection id="zbatimi" title="Zbatimi Praktik">
                <p>Këto katër shtylla teorike marrin jetë përmes motorit tonë analitik, i cili përpunon të dhënat dhe prodhon profilet e detajuara dhe vizualizimet që gjeni në platformë. Duke i bërë këto themele metodologjike transparente, ne ftojmë një shqyrtim kritik dhe një angazhim të thelluar me gjetjet tona.</p>
            </ArticleSection>
        </>
    ), [onNavigateToParagonConceptKapsh, onNavigateToParagonConceptBehavioral, onNavigateToParagonConceptCompetency, onNavigateToParagonConceptFeedback]);

    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText, 
            {
                url: window.location.href,
                published_at: "2025-11-01T10:00:00Z",
                article_id: 'unified-political-framework-01'
            }, 
            sourcesList,
            {
                researchHours: 50,
                focusKeyword: "Metodologjia e Unifikuar PARAGON"
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
            headerTitle={renderWithSuperscript("Metodologjia e Unifikuar PARAGON®")}
            headerSubtitle="Sinteza e Katër Shtyllave të Analizës së Lidershipit"
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 1 Nëntor, 2025",
                location: "Shkodër, Shqipëri"
            }}
            tableOfContentsItems={[
                { id: "hyrje", title: "Përmbledhje Ekzekutive: Një Kornizë e Sintetizuar" },
                { id: "shtyllat", title: "Katër Shtyllat Themelore të PARAGON®" },
                { id: "zbatimi", title: "Zbatimi Praktik" }
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