
import React, { useMemo } from 'react';
import { ArticleTemplate1, ArticleSection, KeyConcept, PullQuote } from './templates/ArticleTemplate1';
import { ArticleMetrics, ArticleIntegrityProfileData } from '../types';
import { calculateArticleMetrics, calculateArticleIntegrityProfile } from '../utils/articleMetricsCalculator';
import { useLanguage } from '../contexts/LanguageContext';
import { HeartIcon, UsersIcon, ScaleIcon, ExclamationTriangleIcon, BookOpenIcon } from './icons';
import { renderWithSuperscript } from '../utils/textUtils';

interface EthicalResonancePageProps {
  onBack: () => void;
  onNavigateToNoraAiProfile: () => void;
  onNavigateToVipProfile: (id: string | number) => void;
  onNavigateToArticleMetricsExplained: () => void;
}

const translations = {
    sq: {
        back: "Kthehu Pas",
        pageTitle: "Dimensioni i Rezonancës Etike (CSR) | NOVARIC®",
        pageDescription: "Një analizë e thelluar e dimensionit të pestë dhe më inovativ të sistemit MARAGON-Ω, duke matur 'ndërgjegjen sociale' të profilit mediatik.",
        headerTitle: "Rezonanca Etike (CSR)",
        headerSubtitle: "Communication Social Responsibility",
        introText: "Në arkitekturën e NOVARIC® dhe sistemin MARAGON-Ω, Rezonanca Etike (CSR) është dimensioni i pestë dhe më inovativ. Ai përfaqëson \"Ndërgjegjen Sociale\" të profilit mediatik.",
        introText2: "Ndërsa dimensionet e tjera masin nëse gazetari është i saktë (Aptitude) apo i pavarur (Governance), Rezonanca Etike mat nëse gazetari është i dëmshëm apo i dobishëm për shëndetin e shoqërisë.",
        redefinitionTitle: "Riperkufizimi: Nga Korporata te Komunikimi",
        redefinitionText: "Tradicionalisht, CSR do të thotë Corporate Social Responsibility (Përgjegjësia Sociale e Korporatës). Në NOVARIC®, ne e kemi ri-koduar këtë akronim në: Communication Social Responsibility (Përgjegjësia Sociale e Komunikimit).",
        coreQuestion: "Pyetja Qendrore:",
        coreQuestionText: "A e përdor ky person mikrofonin për të shëruar ndarjet shoqërore, apo për t'i thelluar ato për përfitime personale?",
        philosophy: "Filozofia:",
        philosophyText: "E drejta për të folur në një platformë publike mbart me vete detyrimin për të mos e helmuar sferën publike. Një gazetar që injekton urrejtje, panik apo cinizëm po kryen një akt të 'Vandalizmit Social', edhe nëse faktet e tij janë teknikisht të sakta.",
        pillar1Title: "A. Kohezioni Social (Metrika 'Anti-Polarizim')",
        pillar1Desc: "Çfarë mat: A krijon gazetari \"fise\" luftuese apo qytetarë që dialogojnë?",
        pillar1Toxic: "Simptoma Toksike: Përdorimi i gjuhës dehumanizuese (p.sh., etiketimi i kundërshtarëve si \"kriminelë\", \"tradhëtarë\", \"kafshë\", \"llum\").",
        pillar1Why: "Pse është problem etik: Kur dehumanizon kundërshtarin, ti legjitimon dhunën verbale (dhe fizike) ndaj tij, duke shkatërruar \"Kontratën Sociale\".",
        pillar2Title: "B. Higjiena Qytetare (Metrika 'Cinizmi')",
        pillar2Desc: "Çfarë mat: A e fuqizon gazetari publikun për të vepruar, apo e shtyn drejt dëshpërimit (Lethe)?",
        pillar2Toxic: "Simptoma Toksike: Narrativa katastrofike (Catastrophizing). \"Gjithçka ka marrë fund\", \"Të gjithë vjedhin\", \"Nuk ka shpresë këtu\".",
        pillar2Why: "Pse është problem etik: Cinizmi është mjeti më i mirë i korrupsionit. Nëse publiku bindet se \"të gjithë janë njëlloj\", ata ndalojnë së kërkuari llogari.",
        pillar3Title: "C. Mbrojtja e Dinjitetit (Metrika 'Minimizimi i Dëmit')",
        pillar3Desc: "Çfarë mat: Si i trajton gazetari viktimat ose grupet e pambrojtura?",
        pillar3Toxic: "Simptoma Toksike: Sensacionalizimi i dhimbjes, publikimi i detajeve intime pa interes publik, ose sulmi ndaj individëve pa pushtet (\"Punching down\").",
        visualizationTitle: "Vizualizimi: Shkalla e Rrezikut Biologjik",
        visGreenTitle: "I Gjelbër (80-100): Gardiani Civil",
        visGreenDesc: "Gazetari vepron si \"Ndërtues Ura\". Ai mund të jetë kritik i ashpër, por kritikon veprimet, jo personat. Ai ofron kontekst dhe zgjidhje.",
        visYellowTitle: "I Verdhë (50-79): Sensacionalist",
        visYellowDesc: "Prioritizon dramën mbi shëndetin social, por brenda kufijve të pranueshëm.",
        visRedTitle: "I Kuq (<50): Rrezik Social",
        visRedDesc: "Gazetari vepron si \"Agjitator\". Ai fiton nga zemërimi dhe frika e publikut (Clickbait emocional). Kjo përmbajtje është klinikisht toksike.",
        contextTitle: "Pse ka rëndësi në Shqipëri",
        contextText: "Në modelin \"Pluralist të Polarizuar\" të medias shqiptare, Rezonanca Etike është shpesh gjëja e parë që sakrifikohet për audiencë. Shumë \"Opinionistë\" ndërtojnë karrierë mbi CSR të ulët—ata janë të famshëm sepse janë toksikë. Sistemi NOVARIC® e përmbys këtë logjikë: Ai e penalizon këtë sjellje. Ai i thotë publikut: \"Ky person është i famshëm, por po ndot mendjen tuaj dhe vendin tuaj.\"",
        conclusion: "Rezonanca Etike nuk ka të bëjë me \"mirësjelljen\". Ajo është një Matje Klinike e Toksicitetit."
    },
    en: {
        back: "Back",
        pageTitle: "The Dimension of Ethical Resonance (CSR) | NOVARIC®",
        pageDescription: "A deep dive into the fifth and most innovative dimension of the MARAGON-Ω system, measuring the 'social conscience' of the media profile.",
        headerTitle: "Ethical Resonance (CSR)",
        headerSubtitle: "Communication Social Responsibility",
        introText: "In the architecture of NOVARIC® and the MARAGON-Ω framework, the Dimension of Ethical Resonance (CSR) is arguably the most forward-thinking and critical metric. It represents the 'Social Conscience' of the media profile.",
        introText2: "While the other dimensions measure competence (Aptitude) or independence (Governance), CSR measures Impact: Is this journalist harmful or helpful to the health of society?",
        redefinitionTitle: "Redefining CSR: From Corporate to Communication",
        redefinitionText: "Traditionally, CSR stands for Corporate Social Responsibility. In the NOVARIC® framework, we redefine it as: Communication Social Responsibility.",
        coreQuestion: "The Core Question:",
        coreQuestionText: "Does this media personality’s speech strengthen the social fabric, or does it tear it apart?",
        philosophy: "The Philosophy:",
        philosophyText: "Freedom of speech is a right, but the integrity of the Public Sphere is a shared asset. A journalist who poisons the public sphere with hate, panic, or cynicism is committing an act of 'Social Vandalism,' even if their facts are technically correct.",
        pillar1Title: "A. Social Cohesion (The 'Anti-Polarization' Metric)",
        pillar1Desc: "What it measures: Does the journalist create warring 'tribes' or citizens capable of dialogue?",
        pillar1Toxic: "Toxic Symptom: Use of dehumanizing language (e.g., labeling opponents as 'criminals', 'traitors', 'animals', 'scum').",
        pillar1Why: "Why it's an ethical problem: When you dehumanize the opponent, you legitimize verbal (and physical) violence against them, destroying the 'Social Contract'.",
        pillar2Title: "B. Civic Hygiene (The 'Cynicism' Metric)",
        pillar2Desc: "What it measures: Does the journalist empower the public to act, or push them towards despair (Lethe)?",
        pillar2Toxic: "Toxic Symptom: Catastrophizing narrative. 'Everything is over', 'Everyone steals', 'There is no hope here'.",
        pillar2Why: "Why it's an ethical problem: Cynicism is corruption's best tool. If the public is convinced that 'everyone is the same', they stop demanding accountability.",
        pillar3Title: "C. Protection of Dignity (The 'Harm Minimization' Metric)",
        pillar3Desc: "What it measures: How does the journalist treat victims or vulnerable groups?",
        pillar3Toxic: "Toxic Symptom: Sensationalizing pain, publishing intimate details without public interest, or attacking powerless individuals ('Punching down').",
        visualizationTitle: "Visualization: The Biohazard Scale",
        visGreenTitle: "Green (80-100): Civic Guardian",
        visGreenDesc: "The journalist acts as a 'Bridge Builder'. They may be a harsh critic, but they criticize actions, not persons. They offer context and solutions.",
        visYellowTitle: "Yellow (50-79): Sensationalist",
        visYellowDesc: "Prioritizes drama over social health, but within acceptable limits.",
        visRedTitle: "Red (<50): Social Hazard",
        visRedDesc: "The journalist acts as an 'Agitator'. They profit from public anger and fear (Emotional Clickbait). This content is clinically toxic.",
        contextTitle: "Why this matters in Albania",
        contextText: "In the 'Polarized Pluralist' model of Albanian media, Ethical Resonance is often the first thing sacrificed for ratings. Many 'Opinion Makers' build careers on Low CSR—they are famous because they are toxic. The NOVARIC® system flips the script: It penalizes this behavior. It tells the public: 'This person is famous, but they are polluting your mind and your country.'",
        conclusion: "Ethical Resonance is not about 'politeness'. It is a Clinical Measurement of Toxicity."
    }
};

const BiohazardScale: React.FC<{ title: string, desc: string, color: string, icon: React.ReactNode }> = ({ title, desc, color, icon }) => (
    <div className={`p-4 rounded-lg border-l-4 ${color} bg-white dark:bg-slate-900/50 shadow-sm mb-4`}>
        <div className="flex items-center gap-3 mb-2">
            {icon}
            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{title}</h4>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
    </div>
);

export const EthicalResonancePage: React.FC<EthicalResonancePageProps> = (props) => {
    const { onBack, onNavigateToNoraAiProfile, onNavigateToVipProfile, onNavigateToArticleMetricsExplained } = props;
    const { language, toggleLanguage } = useLanguage();
    const content = translations[language];

    const keywords = ["CSR", "Ethical Resonance", "Social Toxicity", "Polarization", "Cynicism", "Public Sphere", "Media Ethics", "NOVARIC"];

    const articleMetrics = useMemo((): ArticleMetrics => {
        return calculateArticleMetrics(
            "Ethical Resonance Content...", 
            {
                url: window.location.href,
                published_at: new Date().toISOString(),
                article_id: 'ethical-resonance-01'
            }, 
            [],
            { researchHours: 120, focusKeyword: "Ethical Resonance" }
        );
    }, []);

    const articleIntegrityProfile = useMemo(() => calculateArticleIntegrityProfile(articleMetrics), [articleMetrics]);

    return (
        <>
             <div className="max-w-4xl mx-auto px-6 sm:px-8 mt-4">
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
                        <div className="w-px h-4 bg-slate-200 dark:border-slate-700"></div>
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
                publicationInfo={{ publishedDate: "Publikuar: 12 Janar, 2026", location: "Shkodër, Shqipëri" }}
                tableOfContentsItems={[
                    { id: "intro", title: "Definicioni" },
                    { id: "redefinition", title: "Riperkufizimi i CSR" },
                    { id: "pillars", title: "Tri Shtyllat e Rezonancës" },
                    { id: "visualization", title: "Vizualizimi: Shkalla e Rrezikut" },
                    { id: "context", title: "Konteksti Shqiptar" }
                ]}
                articleMetrics={articleMetrics}
                articleIntegrityProfile={articleIntegrityProfile}
                keywords={keywords}
                onBack={onBack}
                onNavigateToVipProfile={onNavigateToVipProfile}
                onNavigateToArticleMetricsExplained={onNavigateToArticleMetricsExplained}
            >
                <ArticleSection id="intro" title="">
                    <p className="font-medium text-lg text-slate-800 dark:text-slate-200">{content.introText}</p>
                    <p>{content.introText2}</p>
                </ArticleSection>

                <ArticleSection id="redefinition" title={content.redefinitionTitle}>
                     <p>{content.redefinitionText}</p>
                     <div className="my-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                        <p className="font-bold text-primary-700 dark:text-primary-400 mb-2 uppercase tracking-wide">{content.coreQuestion}</p>
                        <p className="text-xl italic font-serif text-slate-800 dark:text-slate-100">"{content.coreQuestionText}"</p>
                    </div>
                    <PullQuote>{content.philosophyText}</PullQuote>
                </ArticleSection>

                <ArticleSection id="pillars" title="Tri Shtyllat e Rezonancës Etike">
                    
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center mb-2">
                                <UsersIcon className="w-6 h-6 mr-2" /> {content.pillar1Title}
                            </h3>
                            <p className="mb-2"><strong>{content.pillar1Desc}</strong></p>
                            <div className="pl-4 border-l-2 border-red-400 mb-2">
                                <p className="text-red-700 dark:text-red-300 text-sm"><strong>{content.pillar1Toxic}</strong></p>
                            </div>
                            <p className="text-sm italic">{content.pillar1Why}</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-amber-600 dark:text-amber-400 flex items-center mb-2">
                                <ScaleIcon className="w-6 h-6 mr-2" /> {content.pillar2Title}
                            </h3>
                            <p className="mb-2"><strong>{content.pillar2Desc}</strong></p>
                            <div className="pl-4 border-l-2 border-red-400 mb-2">
                                <p className="text-red-700 dark:text-red-300 text-sm"><strong>{content.pillar2Toxic}</strong></p>
                            </div>
                            <p className="text-sm italic">{content.pillar2Why}</p>
                        </div>

                         <div>
                            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center mb-2">
                                <HeartIcon className="w-6 h-6 mr-2" /> {content.pillar3Title}
                            </h3>
                            <p className="mb-2"><strong>{content.pillar3Desc}</strong></p>
                            <div className="pl-4 border-l-2 border-red-400 mb-2">
                                <p className="text-red-700 dark:text-red-300 text-sm"><strong>{content.pillar3Toxic}</strong></p>
                            </div>
                        </div>
                    </div>
                </ArticleSection>

                <ArticleSection id="visualization" title={content.visualizationTitle}>
                    <BiohazardScale 
                        title={content.visGreenTitle} 
                        desc={content.visGreenDesc} 
                        color="border-green-500"
                        icon={<HeartIcon className="w-6 h-6 text-green-500" />} 
                    />
                    <BiohazardScale 
                        title={content.visYellowTitle} 
                        desc={content.visYellowDesc} 
                        color="border-yellow-500" 
                        icon={<ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />}
                    />
                    <BiohazardScale 
                        title={content.visRedTitle} 
                        desc={content.visRedDesc} 
                        color="border-red-600" 
                        icon={<ExclamationTriangleIcon className="w-6 h-6 text-red-600" />}
                    />
                </ArticleSection>

                <ArticleSection id="context" title={content.contextTitle}>
                    <p>{content.contextText}</p>
                    <div className="mt-6 p-4 bg-slate-800 text-white rounded text-center font-bold font-mono">
                        {content.conclusion}
                    </div>
                </ArticleSection>

            </ArticleTemplate1>
        </>
    );
};
