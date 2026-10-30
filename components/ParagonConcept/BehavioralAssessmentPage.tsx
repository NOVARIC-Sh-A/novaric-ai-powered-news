
import React, { useMemo, ReactNode, useState, useEffect } from 'react';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from '../templates/ArticleTemplate1';
import { ArticleMetrics } from '../../types';
import { calculateArticleMetrics } from '../../utils/articleMetricsCalculator';
import { useLanguage } from '../../contexts/LanguageContext';

interface ParagonConceptBehavioralPageProps {
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

const SourceLink: React.FC<{ s: number[] }> = ({ s }) => (
    <sup>
        {s.map((n, i) => <a key={i} href={`#ref-${n}`} className="text-primary-500 mx-0.5 no-underline">[{n}]</a>)}
    </sup>
);

const translations = {
    sq: {
        back: "Kthehu Pas",
        pageTitle: "Metodat e Vlerësimit të Sjelljes | Koncepti PARAGON | NOVARIC®",
        pageDescription: "Eksploroni metodat shkencore të vlerësimit të sjelljes si Qendrat e Vlerësimit dhe Intervista e Ngjarjeve të Sjelljes (BEI) që formojnë një gur themeli të Konceptit PARAGON.",
        headerTitle: "Metodat e Vlerësimit të Sjelljes",
        headerSubtitle: "Një Gur Themel i Konceptit PARAGON",
        introText: "Si një nga katër shtyllat e Metodologjisë PARAGON®, Metodat e Vlerësimit të Sjelljes na ofrojnë mjetet për të mbledhur prova konkrete se si një lider vepron në praktikë.",
        corePrinciple: "Parimi Themelor",
        corePrincipleText: "Kjo qasje bazohet në premisën themelore se sjellja e kaluar është parashikuesi më i mirë dhe më i besueshëm i sjelljes së ardhshme. Ajo e zhvendos fokusin nga pyetjet hipotetike 'çfarë do të bënit' në skenarë konkretë 'çfarë bëtë'. Duke analizuar sistematikisht veprimet e kaluara, ne mund të fitojmë njohuri objektive mbi kompetencat e një kandidati, aftësitë për zgjidhjen e problemeve dhe potencialin për sukses në një rol të caktuar.",
        assessmentCentersTitle: "A. Qendrat e Vlerësimit",
        ac_foundation: "Themelimi Akademik",
        ac_foundation_text: "Metoda e Qendrës së Vlerësimit e ka origjinën nga teknikat e përdorura për të përzgjedhur oficerët ushtarakë gjatë Luftës së Dytë Botërore, fillimisht nga ushtria gjermane dhe më vonë e adoptuar nga Zyra e Shërbimeve Strategjike të SHBA (OSS) dhe ushtria britanike. Qëllimi i saj ishte krijimi i një procesi objektiv për identifikimin e kandidatëve të përshtatshëm për role kritike. Pas luftës, sektori privat, veçanërisht AT&T, e përshtati metodologjinë për të vlerësuar dhe zhvilluar menaxherët, dhe studimet e tyre afatgjata vërtetuan efektivitetin e lartë të saj në parashikimin e avancimit në karrierë.",
        ac_methodology: "Metodologjia",
        ac_methodology_text: "Një Qendër Vlerësimi është një event intensiv, disa-ditor, ku kandidatët marrin pjesë në një sërë simulimesh të lidhura me punën nën vëzhgimin e vlerësuesve të trajnuar. Ky vlerësim i shumëanshëm u ofron kandidatëve mundësi të shumta për të demonstruar aftësitë e tyre në kontekste realiste. Ushtrimet kryesore përfshijnë: Ushtrimi In-Basket, Diskutimi në Grup, Loja me Role.",
        ac_measures: "Çfarë Mat",
        ac_measures_text: "Qendrat e Vlerësimit janë krijuar për të vlerësuar një gamë të gjerë kompetencash relevante për punën, duke përfshirë por pa u kufizuar në: Lidership dhe Ndikim; Vendimmarrje Strategjike dhe Gjykim; Aftësi Ndërpersonale dhe Komunikimi; Planifikim, Organizim dhe Prioritizim; Zgjidhje Problemash dhe Mendim Analitik.",
        ac_usage: "Pse Përdoret Gjerësisht",
        ac_usage_text: "Konsiderohet 'standardi i artë' për përzgjedhje me rëndësi të lartë (p.sh., lidershipi i lartë) dhe feedback zhvillimor, vlera e saj qëndron në vlefshmërinë e lartë parashikuese. Duke përdorur ushtrime të shumëfishta dhe vlerësues të shumëfishtë të trajnuar, ajo ofron një pamje objektive, të paanshme dhe gjithëpërfshirëse të aftësive të një kandidati, duke siguruar që vendimet e përzgjedhjes të bazohen në meritë të demonstruar dhe jo vetëm në performancën në intervistë.",
        ac_relevance: "Rëndësia dhe Aplikimi Kontekstual",
        ac_relevance_eu: "Zyrtarët e Bashkimit Evropian: Zyra Evropiane e Përzgjedhjes së Personelit (EPSO) ka përdorur historikisht modelin e Qendrës së Vlerësimit si thelbin e procesit të saj të përzgjedhjes për të siguruar një sistem të standardizuar dhe të bazuar në merita për punësimin e zyrtarëve të BE-së. Kandidatët testohen në kompetenca kyçe si analiza, komunikimi dhe qëndrueshmëria përmes ushtrimeve si studimet e rasteve dhe diskutimet në grup. Ndërsa procesi i EPSO-s ka evoluar, parimet e vlerësimit të bazuar në kompetenca mbeten qendrore. Kjo thekson një angazhim për të lëvizur përtej provimeve të bazuara në njohuri drejt një vlerësimi holistik të aftësisë së një kandidati për të performuar në mënyrë efektive, një parim shumë relevant për identifikimin e liderëve efektivë në sektorin politik dhe publik.",
        ac_relevance_al: "Konteksti Shqiptar: Në Shqipëri, aplikimi formal i Qendrave të Vlerësimit në politikë nuk është i përhapur. Megjithatë, parimet po fitojnë terren brenda reformës së administratës publike, kryesisht të nxitur nga procesi i integrimit në BE. Ligji për Shërbimin Civil promovon konkurrencën e bazuar në merita, dhe institucione si Shkolla Shqiptare e Administratës Publike (ASPA) fokusohen në trajnimin profesional. Për më tepër, nisma si Programi LEAD Albania, i cili ofron përvojë qeveritare të nivelit të lartë dhe trajnim lidershipi, sinjalizojnë një lëvizje drejt zhvillimit të liderëve të strukturuar dhe të bazuar në kompetenca. Sfida kryesore mbetet shtrirja e këtyre parimeve meritokratike nga shërbimi civil në procesin e rekrutimit politik, i cili shpesh përballet me traditat e patronazhit dhe besnikërisë partiake.",
        beiTitle: "B. Intervista e Ngjarjeve të Sjelljes (BEI) & Metoda STAR",
        bei_foundation: "Themelimi Akademik",
        bei_foundation_text: "Intervista e Ngjarjeve të Sjelljes (BEI) u zhvillua nga kërkimet e psikologut David McClelland, i cili zbuloi se vlerësimi i kompetencave thelbësore ishte më parashikues për suksesin në punë sesa testet tradicionale të inteligjencës. Metodologjia është një përshtatje e teknikës së 'incidentit kritik' dhe operon në të njëjtin parim thelbësor si të gjitha vlerësimet e sjelljes: sjellja e kaluar parashikon sjelljen e ardhshme.",
        bei_methodology: "Metodologjia",
        bei_methodology_text: "BEI është një teknikë interviste e strukturuar ku kandidatëve u kërkohet të japin shembuj specifikë dhe të detajuar se si i kanë menaxhuar situatat e lidhura me punën në të kaluarën. Për të siguruar një përgjigje gjithëpërfshirëse dhe të strukturuar, intervistuesit përdorin kornizën STAR për të hetuar detajet: S - Situata, T - Detyra (Task), A - Veprimi (Action), R - Rezultati.",
        bei_measures: "Çfarë Mat",
        bei_measures_text: "BEI ofron prova konkrete dhe të verifikueshme të kompetencave dhe aftësive specifike. Duke analizuar shembuj të detajuar nga bota reale, një intervistues mund të identifikojë modele të qëndrueshme të sjelljes që zbulojnë motivimet themelore të një kandidati, aftësitë për zgjidhjen e problemeve dhe kapacitetet. Ajo ofron një dritare se si një individ e kryen realisht punën e tij, jo vetëm se si thotë se do ta bënte.",
        bei_usage: "Pse Përdoret Gjerësisht",
        bei_usage_text: "BEI është një nga teknikat më të zakonshme dhe efektive të intervistave të strukturuara sepse është më objektive dhe e besueshme se intervistat e pastrukturuara. Duke u fokusuar në veprimet e kaluara, ajo minimizon përgjigjet hipotetike ose të përgatitura dhe ofron prova të prekshme të aftësive të një kandidati. Ky fokus në kompetencat e demonstruara është treguar të jetë një parashikues i vlefshëm i suksesit të ardhshëm në punë.",
        bei_relevance: "Rëndësia dhe Aplikimi Kontekstual",
        bei_relevance_eu: "Politikanët & Zyrtarët e BE-së: Intervistat e bazuara në kompetenca duke përdorur parimet e BEI janë një gur themeli i procesit të përzgjedhjes së EPSO. Intervistuesit e përdorin atë për të mbledhur në mënyrë sistematike prova kundrejt një kornize të paracaktuar kompetencash (p.sh., 'Analiza dhe Zgjidhja e Problemeve', 'Dhënia e Cilësisë dhe Rezultateve'). Për një politikan, kjo metodë mund të depërtojë përtej retorikës. Në vend që të pyesë 'Si do të ndërtonit konsensus?', një intervistues do të pyeste, 'Më tregoni për një herë kur keni ndërtuar me sukses konsensus midis palëve të ndryshme të interesit për të miratuar një legjislacion të vështirë.' Përgjigja STAR do të ofronte prova të verifikueshme të aftësive të tyre negociuese dhe udhëheqëse. Kjo përputhet me përdorimin më të gjerë të njohurive të sjelljes nga Komisioni Evropian për të informuar politikëbërjen e bazuar në prova.",
        bei_relevance_al: "Konteksti Shqiptar: Përdorimi i pyetjeve të sjelljes dhe metodës STAR po rritet midis punëdhënësve shqiptarë që kërkojnë të vlerësojnë aftësitë për zgjidhjen e problemeve në një kontekst lokal. Megjithatë, nuancat kulturore, si preferenca për komunikim më pak të drejtpërdrejtë, mund të kërkojnë që intervistuesit të thellohen më shumë. Në sektorin publik, reformat në vazhdim synojnë ta bëjnë rekrutimin më transparent dhe të bazuar në merita, duke u larguar nga një sistem që shpesh perceptohet si i drejtuar nga lidhjet politike. BEI dhe metoda STAR janë mjete të fuqishme që mund ta mbështesin këtë tranzicion duke i bazuar vendimet e punësimit në kompetencë të demonstruar. Zbatimi i tyre në përzgjedhjen e kandidatëve politikë, megjithatë, mbetet i kufizuar. Do të kërkohej një ndryshim i rëndësishëm kulturor për të prioritizuar meritën mbi besnikërinë partiake në arenën politike, por adoptimi i metodave të tilla mund të ishte një hap vendimtar drejt ndërtimit të besimit publik në institucionet politike.",
        sourcesTitle: "Burimet"
    },
    en: {
        back: "Back",
        pageTitle: "Behavioral Assessment Methods | PARAGON Concept | NOVARIC®",
        pageDescription: "Explore the scientific methods of behavioral assessment like Assessment Centers and the Behavioral Event Interview (BEI) that form a cornerstone of the PARAGON Concept.",
        headerTitle: "Behavioral Assessment Methods",
        headerSubtitle: "A Cornerstone of the PARAGON Concept",
        introText: "As one of the four pillars of the PARAGON Methodology, Behavioral Assessment Methods provide us with the tools to gather concrete evidence of how a leader acts in practice.",
        corePrinciple: "Core Principle",
        corePrincipleText: "This approach is based on the fundamental premise that past behavior is the best and most reliable predictor of future behavior. It shifts the focus from hypothetical 'what would you do' questions to concrete 'what did you do' scenarios. By systematically analyzing past actions, we can gain objective insights into a candidate's competencies, problem-solving abilities, and potential for success in a given role.",
        assessmentCentersTitle: "A. Assessment Centers",
        ac_foundation: "Academic Foundation",
        ac_foundation_text: "The Assessment Center method originated from techniques used to select military officers during World War II, first by the German military and later adopted by the U.S. Office of Strategic Services (OSS) and the British military. Its purpose was to create an objective process for identifying suitable candidates for critical roles. After the war, the private sector, most notably AT&T, adapted the methodology to assess and develop managers, and their long-term studies proved its high effectiveness in predicting career progression.",
        ac_methodology: "Methodology",
        ac_methodology_text: "An Assessment Center is an intensive, multi-day event where candidates participate in a series of job-related simulations under the observation of trained assessors. This multi-faceted evaluation provides numerous opportunities for candidates to demonstrate their skills in realistic contexts. Key exercises include: In-Basket Exercise, Group Discussion, Role-Play.",
        ac_measures: "What It Measures",
        ac_measures_text: "Assessment Centers are designed to evaluate a broad range of job-relevant competencies, including but not limited to: Leadership and Influence; Strategic Decision-Making and Judgment; Interpersonal and Communication Skills; Planning, Organizing, and Prioritizing; Problem-Solving and Analytical Thinking.",
        ac_usage: "Why It's Widely Used",
        ac_usage_text: "Considered the 'gold standard' for high-stakes selection (e.g., senior leadership) and developmental feedback, its value lies in its high predictive validity. By using multiple exercises and multiple trained assessors, it provides an objective, unbiased, and comprehensive view of a candidate's abilities, ensuring that selection decisions are based on demonstrated merit rather than interview performance alone.",
        ac_relevance: "Relevance and Contextual Application",
        ac_relevance_eu: "European Union Officials: The European Personnel Selection Office (EPSO) has historically used the Assessment Center model as the core of its selection process to ensure a standardized and merit-based system for hiring EU officials. Candidates are tested on key competencies like analysis, communication, and resilience through exercises such as case studies and group discussions. While EPSO's process has evolved, the principles of competency-based assessment remain central. This highlights a commitment to moving beyond knowledge-based exams to a holistic evaluation of a candidate's ability to perform effectively, a principle highly relevant for identifying effective political and public sector leaders.",
        ac_relevance_al: "Albanian Context: In Albania, the formal application of Assessment Centers in politics is not established. However, the principles are gaining traction within public administration reform, largely driven by the E.U. integration process. The Civil Service Law promotes merit-based competition, and institutions like the Albanian School of Public Administration (ASPA) focus on professional training. Furthermore, initiatives like the LEAD Albania Program, which provides high-level government experience and leadership training, signal a move towards structured, competency-based leader development. The primary challenge is extending these meritocratic principles from the civil service to the political recruitment process, which often contends with traditions of patronage and party loyalty.",
        beiTitle: "B. Behavioral Event Interview (BEI) & The STAR Method",
        bei_foundation: "Academic Foundation",
        bei_foundation_text: "The Behavioral Event Interview (BEI) was developed from the research of psychologist David McClelland, who found that assessing core competencies was more predictive of job success than traditional intelligence tests. The methodology is an adaptation of the 'critical incident' technique and operates on the same core principle as all behavioral assessments: past behavior predicts future performance.",
        bei_methodology: "Methodology",
        bei_methodology_text: "The BEI is a structured interview technique where candidates are asked to provide specific, detailed examples of how they have handled work-related situations in the past. To ensure a comprehensive and structured response, interviewers use the STAR framework to probe for details: S - Situation, T - Task, A - Action, R - Result.",
        bei_measures: "What It Measures",
        bei_measures_text: "The BEI provides concrete, verifiable evidence of specific competencies and skills. By analyzing detailed, real-world examples, an interviewer can identify consistent patterns of behavior that reveal a candidate's underlying motivations, problem-solving skills, and abilities. It offers a window into how an individual actually performs their work, not just how they say they would.",
        bei_usage: "Why It's Widely Used",
        bei_usage_text: "The BEI is one of the most common and effective structured interview techniques because it is more objective and reliable than unstructured interviews. By focusing on past actions, it minimizes hypothetical or prepared answers and provides tangible evidence of a candidate's capabilities. This focus on demonstrated competencies has been shown to be a valid predictor of future job success.",
        bei_relevance: "Relevance and Contextual Application",
        bei_relevance_eu: "E.U. Politicians & Officials: Competency-based interviews using BEI principles are a cornerstone of the EPSO selection process. Interviewers use it to systematically gather evidence against a predefined competency framework (e.g., 'Analysis and Problem Solving,' 'Delivering Quality and Results'). For a politician, this method could cut through rhetoric. Instead of asking 'How would you build consensus?', an interviewer would ask, 'Tell me about a time you successfully built consensus among diverse stakeholders to pass a difficult piece of legislation.' The STAR response would provide verifiable proof of their negotiation and leadership skills. This aligns with the European Commission's broader use of behavioral insights to inform evidence-based policymaking.",
        bei_relevance_al: "Albanian Context: The use of behavioral questions and the STAR method is growing among Albanian employers seeking to assess problem-solving skills in a local context. However, cultural nuances, such as a preference for less direct communication, may require interviewers to probe more deeply. In the public sector, ongoing reforms aim to make recruitment more transparent and merit-based, shifting away from a system often perceived as being driven by political connections. The BEI and STAR method are powerful tools that can support this transition by grounding hiring decisions in demonstrated competence. Their application in selecting political candidates, however, remains limited. A significant cultural shift would be required to prioritize merit over party loyalty in the political arena, but adopting such methods could be a crucial step toward building public trust in political institutions.",
        sourcesTitle: "Sources"
    }
};

export const ParagonConceptBehavioralPage: React.FC<ParagonConceptBehavioralPageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;
    const { language, toggleLanguage } = useLanguage();
    const content = translations[language];

    const keywords = ["Vlerësimi i Sjelljes", "Qendra e Vlerësimit", "Intervista e Ngjarjeve të Sjelljes", "Metoda STAR", "EPSO", "Rekrutimi Politik", "Kompetencat", "NOVARIC"];

    const sourcesList = useMemo(() => [
        { id: 1, url: "https://eutraining.eu/epso-case-study-ultimate-guide", text: "eutraining.eu - EPSO Case Study Guide", credibility_industry_rating_pct: 85 },
        { id: 2, url: "https://euphorum.org/2010/05/epso-tests-what-the-assessment-centre-is-all-about/", text: "euphorum.org - EPSO Assessment Centre", credibility_industry_rating_pct: 80 },
        { id: 3, url: "https://www.eurobrussels.com/epso_test_training", text: "eurobrussels.com - EPSO Tests", credibility_industry_rating_pct: 82 },
        { id: 4, url: "https://eutraining.eu/epso-competencies", text: "eutraining.eu - EPSO Competencies", credibility_industry_rating_pct: 85 },
        { id: 5, url: "https://eilab.eu/epso-s-competency-based-assessment-model-a-critical-review-with-policy-recommendations/", text: "eilab.eu - EPSO Competency Model Review", credibility_industry_rating_pct: 88 },
        { id: 6, url: "https://eutraining.eu/how-epso-selects-eu-officials", text: "eutraining.eu - How EPSO Selects Officials", credibility_industry_rating_pct: 85 },
        { id: 7, url: "https://www.researchgate.net/publication/228224536_Political_parties_and_politicized_recruitment_in_the_Albanian_civil_service", text: "ResearchGate - Politicized Recruitment in Albanian Civil Service", credibility_industry_rating_pct: 90 },
        { id: 8, url: "https://www.atlanticcouncil.org/blogs/new-atlanticist/the-never-ending-reform-of-public-administration-in-albania/", text: "Atlantic Council - Public Administration Reform in Albania", credibility_industry_rating_pct: 87 },
        { id: 9, url: "https://revueeuropeenne-du-droitsocial.ro/wp-content/uploads/2021/04/REDS-1-2021_art.13.pdf", text: "Revue Europeenne du Droit Social - Public Administration Reform", credibility_industry_rating_pct: 80 },
        { id: 10, url: "http://www.dap.gov.al/reforma-ne-administraten-publike/sfidat-e-reformes-2015-2020/", text: "dap.gov.al - Public Administration Reform Challenges", credibility_industry_rating_pct: 95 },
        { id: 11, url: "https://www.unodc.org/res/corruption-albania/shqiperia_nen-nenshkrimi-i-marreveshjes-se-bashkepunimit.html", text: "unodc.org - Civil Service Law", credibility_industry_rating_pct: 92 },
        { id: 12, url: "https://westeastinstitute.com/wp-content/uploads/2021/02/Era-Gjoci.pdf", text: "westeastinstitute.com - Albanian School of Public Administration (ASPA)", credibility_industry_rating_pct: 80 },
        { id: 13, url: "https://leadalbania.org/about-us/", text: "leadalbania.org - About LEAD Albania", credibility_industry_rating_pct: 88 },
        { id: 14, url: "https://aadf.org/project/lead-albania/", text: "aadf.org - LEAD Albania Project", credibility_industry_rating_pct: 89 },
        { id: 15, url: "https://leadalbania.org/leadership-academy/", text: "leadalbania.org - Leadership Academy", credibility_industry_rating_pct: 88 },
        { id: 16, url: "https://www.wfd.org/our-work/where-we-work/europe-central-asia/albania/", text: "wfd.org - Work in Albania", credibility_industry_rating_pct: 86 },
        { id: 17, url: "https://globalsurveyofpublicservants.org/albania", text: "globalsurveyofpublicservants.org - Albania Survey", credibility_industry_rating_pct: 87 },
        { id: 18, url: "https://graduatesfirst.com/epso/competency-based-interview/", text: "graduatesfirst.com - EPSO Competency-Based Interview", credibility_industry_rating_pct: 83 },
        { id: 19, url: "https://www.intereconomics.eu/contents/year/2022/number/3/article/behavioural-insights-for-evidence-based-policymaking-in-the-eu.html", text: "intereconomics.eu - Behavioural Insights in EU", credibility_industry_rating_pct: 89 },
        { id: 20, url: "https://europa.eu/newsroom/events/behavioural-insights-and-organisations-workshop_en", text: "europa.eu - Behavioural Insights Workshop", credibility_industry_rating_pct: 95 },
        { id: 21, url: "https://resumeflex.com/al/intervista/pyetje-interviste-te-bazuara-ne-sjellje/", text: "resumeflex.com - Behavior-based interview questions", credibility_industry_rating_pct: 75 },
        { id: 22, url: "https://www.ndi.org/our-stories/strengthening-political-parties-albania", text: "ndi.org - Strengthening Political Parties in Albania", credibility_industry_rating_pct: 88 },
        { id: 23, url: "https://www.respaweb.eu/download/doc/ReSPA-Comparative-Study-on-Merit-based-Recruitment-and-Selection-1.pdf/f49b14030647c07b4661842fd7b15d2a.pdf", text: "respaweb.eu - Merit-based Recruitment Study", credibility_industry_rating_pct: 87 },
    ], []);

    const articleContentJsx = useMemo(() => (
        <>
            <ArticleSection id="hyrje" title="">
                <p className="italic text-lg">{content.introText}</p>
            </ArticleSection>
            <ArticleSection id="core-principle" title={content.corePrinciple}>
                <p>{content.corePrincipleText}</p>
            </ArticleSection>
            <ArticleSection id="assessment-centers" title={content.assessmentCentersTitle}>
                <h3 className="text-xl font-semibold mt-4 mb-2">{content.ac_foundation}</h3>
                <p>{content.ac_foundation_text}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{content.ac_methodology}</h3>
                <p>{content.ac_methodology_text}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{content.ac_measures}</h3>
                <p>{content.ac_measures_text}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{content.ac_usage}</h3>
                <p>{content.ac_usage_text}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{content.ac_relevance}</h3>
                <p>{content.ac_relevance_eu}<SourceLink s={[1,2,3,4,5,6]}/></p>
                <p>{content.ac_relevance_al}<SourceLink s={[7,8,9,10,11,12,13,14,15,16,17]}/></p>
            </ArticleSection>

            <ArticleSection id="bei" title={content.beiTitle}>
                <h3 className="text-xl font-semibold mt-4 mb-2">{content.bei_foundation}</h3>
                <p>{content.bei_foundation_text}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{content.bei_methodology}</h3>
                <p>{content.bei_methodology_text}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{content.bei_measures}</h3>
                <p>{content.bei_measures_text}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{content.bei_usage}</h3>
                <p>{content.bei_usage_text}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">{content.bei_relevance}</h3>
                <p>{content.bei_relevance_eu}<SourceLink s={[18,3,4,19,20]}/></p>
                <p>{content.bei_relevance_al}<SourceLink s={[21,9,10,17,16,22,23]}/></p>
            </ArticleSection>

            <ArticleSection id="sources" title={content.sourcesTitle}>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    {sourcesList.map(source => <li id={`ref-${source.id}`} key={source.id}><a href={`https://${source.text.split(' ')[0]}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{source.text}</a></li>)}
                </ol>
            </ArticleSection>
        </>
    ), [content, sourcesList]);
    
    const fullArticleText = useMemo(() => extractText(articleContentJsx), [articleContentJsx]);
    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            fullArticleText,
            { url: window.location.href, published_at: new Date().toISOString(), article_id: 'paragon-concept-behavioral-01' },
            sourcesList,
            { researchHours: 180, focusKeyword: "Behavioral Assessment" }
        );
    }, [fullArticleText, sourcesList]);

    return (
        <>
            <div className="max-w-4xl mx-auto px-6 sm:px-8">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={onBack} className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition">
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
                publicationInfo={{ publishedDate: "Publikuar: 22 Nëntor, 2025", location: "Shkodër, Shqipëri" }}
                tableOfContentsItems={[
                    { id: "core-principle", title: content.corePrinciple },
                    { id: "assessment-centers", title: content.assessmentCentersTitle },
                    { id: "bei", title: content.beiTitle },
                    { id: "sources", title: content.sourcesTitle }
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
