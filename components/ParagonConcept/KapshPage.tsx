
import React, { useMemo, ReactNode, useState, useEffect } from 'react';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from '../templates/ArticleTemplate1';
import { ArticleMetrics } from '../../types';
import { calculateArticleMetrics } from '../../utils/articleMetricsCalculator';
import { useLanguage } from '../../contexts/LanguageContext';

interface ParagonConceptKapshPageProps {
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

const translations = {
    sq: {
        back: "Kthehu Pas",
        pageTitle: "Korniza Arkitekturore Psikologjike Shqiptare (KAPSH) | NOVARIC®",
        pageDescription: "Eksploroni shtyllën themelore të vlerësimit të profilit politik në NOVARIC®, një model me tre shtresa për të kuptuar liderët shqiptarë.",
        headerTitle: "Korniza Arkitekturore Psikologjike Shqiptare (KAPSH)",
        headerSubtitle: "Shtylla Themelore e Vlerësimit të Profilit Politik",
        introText: "Si një nga katër shtyllat e Metodologjisë PARAGON®, Korniza Arkitekturore Psikologjike Shqiptare (KAPSH) ofron lente psikologjike dhe sociologjike për të kuptuar 'pse'-në pas sjelljes së një lideri.",
        section1Title: "Shtresa I: Bërthama Psikometrike e Përshtatur",
        section1Para1: "Manifestimi i tipareve të personalitetit nuk është universal, por ngjyroset nga vlerat kulturore dominuese. Ne e kontekstualizojmë Modelin e Pesë Faktorëve (Big Five) për realitetin shqiptar.",
        agreeablenessTerm: "Pajtueshmëria (Agreeableness)",
        agreeablenessDef: "Një nga pesë tiparet kryesore të personalitetit, që përshkruan tendencën e një individi për të qenë i dhembshur dhe bashkëpunues në vend se i dyshimtë dhe antagonist.",
        section1Para2: "Në kulturat kolektiviste si ajo shqiptare, shpesh nuk është një zgjedhje, por një strategji mbijetese për të ruajtur harmoninë brenda grupit (familjes, klanit). Ne dallojmë \"pajtueshmërinë e brendshme\" nga \"pajtueshmëria relacionale\" (Triandis, 1995).",
        section2Title: "Shtresa II: Matrica e Formësimit Social-Historik",
        section2Para1: "Kjo shtresë analizon se si bërthama psikometrike e individit është formësuar nga dy forcat më të fuqishme të 30 viteve të fundit në Shqipëri: trashëgimia e rrjeteve informale dhe presioni i standardeve formale.",
        pullQuote: "Suksesi në Shqipëri shpesh varet nga aftësia për të lundruar midis botës formale të rregullave dhe botës informale të besnikërisë dhe favoreve.",
        section2Para2: "Ne ndërtojmë një matricë 2x2 që klasifikon profilin e individit bazuar në orientimin e tij ndaj këtyre dy forcave, duke prodhuar katër Arketipe Formësimi:",
        archetype1: `"Patroni Tradicional": E sheh pushtetin si personal dhe relacional, jo institucional. Rregullat formale janë pengesa.`,
        archetype2: `"Teknokrati i Përputhshëm": Fuqia buron nga ekspertiza teknike dhe besimi te rregullat. E sheh botën informale si korruptive.`,
        archetype3: `"Ndërmjetësi Hibrid": Profili më kompleks dhe i fuqishëm. Zotëron gjuhën teknike të teknokratit, por kupton dhe manipulon botën e patronit. Ka potencialin më të madh për sukses dhe rrezikun më të lartë për korrupsion të sofistikuar.`,
        archetype4: `"Aktori i Izoluar": I paaftë për të operuar me sukses në asnjërin sistem.`,
        clientelisticGovTerm: "qeverisjes klienteliste",
        clientelisticGovDef: "Një sistem social ku aksesi te burimet publike shpërndahet në mënyrë diskrecionale nga patronët te klientët në këmbim të mbështetjes.",
        section2Para3_part1: "Kjo matricë na ndihmon të diagnostikojmë se ku pozicionohet një individ në spektrumin midis ",
        section2Para3_part2: " dhe \"qeverisjes etike impersonale\" (Mungiu-Pippidi, 2015).",
        section3Title: "Shtresa III: Portofoli i Performancës së Vëzhguar",
        section3Para1: "Ky hap final përshtat mjetet e analizës bihejviorale për të zbuluar se si arketipi i një individi manifestohet në sjellje konkrete, duke marrë parasysh kontekstin kulturor.",
        section3Para2: "Duke u bazuar në studime si projekti GLOBE (Javidan & House, 2001), ne formulojmë pyetje që janë relevante për një kulturë me distancë të lartë pushteti dhe kolektivizëm të fortë. Ne analizojmë \"reputacionin e dyfishtë\" të një individi: si e perceptojnë atë vartësit formalë dhe si e perceptojnë anëtarët e rrjetit informal (Kets de Vries, 2006).",
        conclusionTitle: "Përfundim",
        conclusionPara: "Duke integruar këto shtresa dhe referenca, Korniza e Arkitekturës Psikologjike Shqiptare (KAPSH) bëhet një instrument diagnostik me një fuqi shpjeguese dhe parashikuese të pakrahasueshme për kontekstin unik të Shqipërisë, duke e transformuar aplikacionin tonë në një mjet analitik të thelluar.",
        referencesTitle: "Referencat Kryesore"
    },
    en: {
        back: "Back",
        pageTitle: "Albanian Psychological Architectural Framework (KAPSH) | NOVARIC®",
        pageDescription: "Explore the foundational pillar of political profile assessment at NOVARIC®, a three-layer model for understanding Albanian leaders.",
        headerTitle: "Albanian Psychological Architectural Framework (KAPSH)",
        headerSubtitle: "The Foundational Pillar of Political Profile Assessment",
        introText: "As one of the four pillars of the PARAGON Methodology, the Albanian Psychological Architectural Framework (KAPSH) provides the psychological and sociological lens to understand the 'why' behind a leader's behavior.",
        section1Title: "Layer I: The Adapted Psychometric Core",
        section1Para1: "The manifestation of personality traits is not universal but is colored by dominant cultural values. We contextualize the Big Five model for the Albanian reality.",
        agreeablenessTerm: "Agreeableness",
        agreeablenessDef: "One of the five main personality traits, describing an individual's tendency to be compassionate and cooperative rather than suspicious and antagonistic.",
        section1Para2: "In collectivist cultures like Albania's, it is often not a choice but a survival strategy to maintain harmony within the group (family, clan). We distinguish between 'internal agreeableness' and 'relational agreeableness' (Triandis, 1995).",
        section2Title: "Layer II: The Socio-Historical Shaping Matrix",
        section2Para1: "This layer analyzes how an individual's psychometric core has been shaped by the two most powerful forces of the last 30 years in Albania: the legacy of informal networks and the pressure of formal standards.",
        pullQuote: "Success in Albania often depends on the ability to navigate between the formal world of rules and the informal world of loyalty and favors.",
        section2Para2: "We construct a 2x2 matrix that classifies an individual's profile based on their orientation towards these two forces, producing four Shaping Archetypes:",
        archetype1: `"The Traditional Patron": Sees power as personal and relational, not institutional. Formal rules are obstacles.`,
        archetype2: `"The Compliant Technocrat": Power stems from technical expertise and belief in rules. Sees the informal world as corrupt.`,
        archetype3: `"The Hybrid Broker": The most complex and powerful profile. Masters the technocrat's technical language but understands and manipulates the traditional patron's world. Has the greatest potential for success and the highest risk for sophisticated corruption.`,
        archetype4: `"The Isolated Actor": Unable to operate successfully in either system.`,
        clientelisticGovTerm: "clientelistic governance",
        clientelisticGovDef: "A social system where access to public resources is discretionarily distributed by patrons to clients in exchange for support.",
        section2Para3_part1: "This matrix helps us diagnose where an individual is positioned on the spectrum between ",
        section2Para3_part2: " and 'impersonal ethical governance' (Mungiu-Pippidi, 2015).",
        section3Title: "Layer III: The Observed Performance Portfolio",
        section3Para1: "This final step adapts behavioral analysis tools to reveal how an individual's archetype manifests in concrete behavior, considering the cultural context.",
        section3Para2: "Based on studies like the GLOBE project (Javidan & House, 2001), we formulate questions relevant to a high power-distance and strong in-group collectivism culture. We analyze an individual's 'dual reputation': how they are perceived by formal subordinates and how they are perceived by members of the informal network (Kets de Vries, 2006).",
        conclusionTitle: "Conclusion",
        conclusionPara: "By integrating these layers and references, the Albanian Psychological Architectural Framework (KAPSH) becomes a diagnostic instrument with unparalleled explanatory and predictive power for Albania's unique context, transforming our application into a profound analytical tool.",
        referencesTitle: "Key References"
    }
};


export const ParagonConceptKapshPage: React.FC<ParagonConceptKapshPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;
    const { language, toggleLanguage } = useLanguage();
    const content = translations[language];

    const keywords = ["KAPSH", "Psikologjia Politike", "Modeli i Pesë Faktorëve", "Kultura Kolektiviste", "Lidershipi Shqiptar", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "", text: "Triandis, H. C. (1995). Individualism & Collectivism. Westview Press.", credibility_industry_rating_pct: 92 },
        { id: 2, url: "", text: "Schmitt, D. P., et al. (2007). The geographic distribution of Big Five personality traits. Journal of Cross-Cultural Psychology, 38(2), 173–212.", credibility_industry_rating_pct: 94 },
        { id: 3, url: "", text: "Fiske, A. P. (1992). The four elementary forms of sociality. Psychological Review, 99(4), 689–723.", credibility_industry_rating_pct: 93 },
        { id: 4, url: "", text: "Mungiu-Pippidi, A. (2015). The Quest for Good Governance. Cambridge University Press.", credibility_industry_rating_pct: 93 },
        { id: 5, url: "", text: "Krastev, I., & Holmes, S. (2019). The Light that Failed: A Reckoning. Penguin Books.", credibility_industry_rating_pct: 96 },
        { id: 6, url: "", text: "Javidan, M., & House, R. J. (2001). Cultural acumen for the global manager: Lessons from project GLOBE. Organizational Dynamics, 29(4), 289–305.", credibility_industry_rating_pct: 91 },
        { id: 7, url: "", text: "Staroňová, K., et al. (2018). Individual Performance Appraisal of Employees in Central Public Administration in Western Balkans. ReSPA Publications.", credibility_industry_rating_pct: 85 },
        { id: 8, url: "", text: "Kets de Vries, M. F. R. (2006). The Leader on the Couch. John Wiley & Sons.", credibility_industry_rating_pct: 89 },
        { id: 9, url: "", text: "Grzymala-Busse, A. (2007). Rebuilding Leviathan. Cambridge University Press.", credibility_industry_rating_pct: 95 },
        { id: 10, url: "", text: "Ledeneva, A. V. (1998). Russia's Economy of Favours. Cambridge University Press.", credibility_industry_rating_pct: 92 },
    ], []);

    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="">
                <p className="italic text-lg">{content.introText}</p>
            </ArticleSection>

            <ArticleSection id="shtresa1" title={content.section1Title}>
                <p>{content.section1Para1}</p>
                <p>
                    <KeyConcept term={content.agreeablenessTerm} definition={content.agreeablenessDef}/>
                    {content.section1Para2}
                </p>
            </ArticleSection>

            <ArticleSection id="shtresa2" title={content.section2Title}>
                <p>{content.section2Para1}</p>
                <PullQuote>{content.pullQuote}</PullQuote>
                <p>{content.section2Para2}</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>{content.archetype1}</strong></li>
                    <li><strong>{content.archetype2}</strong></li>
                    <li><strong>{content.archetype3}</strong></li>
                    <li><strong>{content.archetype4}</strong></li>
                </ul>
                <p>{content.section2Para3_part1}<KeyConcept term={content.clientelisticGovTerm} definition={content.clientelisticGovDef}/>{content.section2Para3_part2}</p>
            </ArticleSection>

            <ArticleSection id="shtresa3" title={content.section3Title}>
                <p>{content.section3Para1}</p>
                <p>{content.section3Para2}</p>
            </ArticleSection>

            <ArticleSection id="perfundim" title={content.conclusionTitle}>
                <p>{content.conclusionPara}</p>
            </ArticleSection>

            <ArticleSection id="referencat" title={content.referencesTitle}>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    {sourcesList.map(source => <li key={source.id}>{source.text}</li>)}
                </ol>
            </ArticleSection>
        </>
    ), [content, sourcesList]);
    
    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText, 
            {
                url: window.location.href,
                published_at: "2025-11-20T10:00:00Z",
                article_id: 'paragon-concept-kapsh-01'
            }, 
            sourcesList,
            {
                researchHours: 150,
                focusKeyword: "Korniza KAPSH"
            }
        );
    }, [fullArticleText, sourcesList]);

    return (
      <>
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={onBack}
                    className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition"
                >
                    &larr; <span className="ml-2">{content.back}</span>
                </button>
                 <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-full p-1">
                    <button 
                        onClick={() => language !== 'en' && toggleLanguage()} 
                        className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'en' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        EN
                    </button>
                     <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                     <button 
                        onClick={() => language !== 'sq' && toggleLanguage()} 
                        className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'sq' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        AL
                    </button>
                </div>
            </div>
        </div>
        <ArticleTemplate1
            pageTitle={content.pageTitle}
            pageDescription={content.pageDescription}
            pageKeywords={keywords.join(', ')}
            headerTitle={content.headerTitle}
            headerSubtitle={content.headerSubtitle}
            authors={[
                { name: 'Nora (AI)', profileId: 'noraAiProfile', imageUrl: 'https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg', isAi: true },
                { name: 'Dr Alban Gj. THIKA', profileId: 'vip33', imageUrl: 'https://novaric.co/wp-content/uploads/2025/10/NOVARIC_Team-Member_A-THIKA_Small.png' }
            ]}
            publicationInfo={{
                publishedDate: "Publikuar: 20 Nëntor, 2025",
                location: "Shkodër, Shqipëri"
            }}
            tableOfContentsItems={[
                { id: "shtresa1", title: content.section1Title },
                { id: "shtresa2", title: content.section2Title },
                { id: "shtresa3", title: content.section3Title },
                { id: "perfundim", title: content.conclusionTitle },
                { id: "referencat", title: content.referencesTitle }
            ]}
            articleMetrics={articleMetrics}
            keywords={keywords}
            onBack={onBack}
            onNavigateToVipProfile={onNavigateToVipProfile}
            onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
        >
            {articleContentJsx}
        </ArticleTemplate1>
      </>
    );
};
