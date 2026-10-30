
import React, { useState, useEffect } from 'react';
import { renderWithSuperscript } from '../utils/textUtils';
import { BookOpenIcon, CpuChipIcon, GlobeAltIcon, PencilSquareIcon, ShareIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons';
import { useLanguage } from '../contexts/LanguageContext';

interface NovaricJournalPageProps {
  onBack: () => void;
  onNavigateToJasminaLumanajProfile: () => void;
}

const translations = {
    sq: {
        pageTitle: "NOVARIC® AI Journal | Ekosistemi i Verifikimit të Fakteve",
        pageDescription: "Një bazë njohurish dinamike që eksploron psikologjinë e dezinformimit dhe rolin e IA-së në moderimin e anshmërisë.",
        back: "Kthehu Pas",
        heroTitle1: "Arkitektojmë Narrativën Për",
        heroTitle2: "Një Shoqëri më të Mençur™",
        manifestoTitle: "Manifesti Ynë: Përtej Inteligjencës Artificiale, Drejt Intelektit Hibrid",
        manifestoBody: "Ne po jetojmë në një pikë kthese historike. Inteligjenca Artificiale nuk është më thjesht një mjet; ajo po bëhet një partnere aktive në procesin e zbulimit, krijimit dhe inovacionit. Kjo epokë e re sfidon vetë themelet e asaj që ne e konsiderojmë njohuri, autorësi dhe pronësi intelektuale. Pyetjet nuk janë më thjesht teknike, por thellësisht filozofike: Ku përfundon kontributi njerëzor dhe ku fillon ai i makinerisë? Si e mbrojmë dhe stimulojmë kreativitetin njerëzor ndërsa përqafojmë potencialin e pamasë të IA-së?\nNOVARIC® AI Journal lindi nga nevoja urgjente për të adresuar këto pyetje. Ne nuk jemi thjesht një revistë tjetër për IA. Ne jemi ekosistemi akademik ku studiuesit, juristët, artistët, shkencëtarët dhe humanistët mblidhen për të eksploruar, debatuar dhe formësuar të ardhmen e pronësisë intelektuale në epokën e intelektit hibrid.",
        missionTitle: "Misioni Ynë Themelor",
        mission1Title: "Të Eksplorojmë Kryqëzimin",
        mission1Body: "Të ofrojmë një forum rigoroz për kërkime që hetojnë marrëdhënien simbiotike dhe ndonjëherë konfliktuale midis intelektit njerëzor dhe inteligjencës artificiale, duke analizuar se si IA po përshpejton dhe sfidon evolucionin e pronësisë intelektuale në çdo fushë.",
        mission2Title: "Të Krijojmë Ekosistemin e Duhur",
        mission2Body: "Të kultivojmë një komunitet ndërdisiplinor ku autorët jo vetëm publikojnë gjetjet e tyre, por gjejnë gjithashtu mjetet dhe dialogun e nevojshëm për të lundruar në peizazhin e ri të autorësisë dhe inovacionit të asistuar nga IA.",
        mission3Title: "Të Dokumentojmë Evolucionin",
        mission3Body: "Të shërbejmë si arkivi parësor që dokumenton këtë transformim historik, duke gjurmuar ndryshimet në praktikat kërkimore, normat ligjore dhe standardet etike.",
        endgameTitle: "Loja Përfundimtare: Baza e të Dhënave të Njohurive Hibride",
        endgameBody: "Qëllimi ynë përfundimtar tejkalon një koleksion tradicional artikujsh. Ne synojmë të ndërtojmë Bazën e të Dhënave të Njohurive Hibride—një depo digjitale e strukturuar që balancon në mënyrë aktive punën kërkimore dhe zhvillimin e njohurive midis intelektit të kontribuar nga njeriu dhe atij të gjeneruar ose asistuar nga IA. Kjo bazë të dhënash jo vetëm që do të ruajë kërkime rreth këtij fenomeni, por do të bëhet vetë një shembull i kësaj paradigme të re, duke ofruar modele të reja atribuimi, vlefshmërie dhe bashkë-krijimi.",
        callToActionTitle: "Thirrje për Pionierët",
        callToActionBody: "Nëse jeni një studiues që eksploron kufijtë e dijes në fushën tuaj dhe përballeni me pyetje rreth rolit të IA-së në punën tuaj—pavarësisht nëse jeni një jurist që përcakton autorësinë e IA-së, një artist që bashkë-krijon me modele gjeneruese, apo një shkencëtar që përdor IA për të formuluar hipoteza të reja—atëherë NOVARIC AI Journal është platforma juaj.",
        submitButton: "Bashkohuni në Dialog: Dorëzoni Punimin Tuaj",
        exploreButton: "Eksploroni Paradigmat e Reja",
        editorSectionTitle: "Nga Redaksia",
        viewFullProfile: "Shiko Profilin e Plotë",
        giantsTitle: "E Ndërtuar mbi Shpatullat e Gjigantëve",
        giantsBody: "Themeli ynë akademik bazohet në kërkimet dhe standardet e vendosura nga revistat më me ndikim në botë në fushën e Inteligjencës Artificiale dhe Mësimit Makinerik.",
    },
    en: {
        pageTitle: "NOVARIC® AI Journal | The Fact-Checking Ecosystem",
        pageDescription: "A dynamic knowledge base exploring the psychology of misinformation and the role of AI in moderating bias.",
        back: "Back",
        heroTitle1: "Shaping the Narrative For",
        heroTitle2: "A Smarter Society™",
        manifestoTitle: "Our Manifesto: Beyond Artificial Intelligence, Towards Hybrid Intellect",
        manifestoBody: "We are living at a historical turning point. Artificial Intelligence is no longer just a tool; it is becoming an active partner in the process of discovery, creation, and innovation. This new era challenges the very foundations of what we consider knowledge, authorship, and intellectual property. The questions are no longer merely technical, but profoundly philosophical: Where does human contribution end and machine contribution begin? How do we protect and stimulate human creativity while embracing the immense potential of AI?\nThe NOVARIC® AI Journal is born from the urgent need to address these questions. We are not just another journal about AI. We are the academic ecosystem where researchers, jurists, artists, scientists, and humanists convene to explore, debate, and shape the future of intellectual property in the age of hybrid intellect.",
        missionTitle: "Our Core Mission",
        mission1Title: "To Explore the Intersection",
        mission1Body: "To provide a rigorous forum for research that investigates the symbiotic and sometimes conflicting relationship between human intellect and artificial intelligence, analyzing how AI is both accelerating and challenging the evolution of intellectual property in every field.",
        mission2Title: "To Create the Right Ecosystem",
        mission2Body: "To cultivate a cross-disciplinary community where authors not only publish their findings but also find the tools and dialogue necessary to navigate the new landscape of AI-assisted authorship and innovation.",
        mission3Title: "To Document the Evolution",
        mission3Body: "To serve as the primary archive documenting this historic transformation, tracking the shifts in research practices, legal norms, and ethical standards.",
        endgameTitle: "The Endgame: The Hybrid Knowledge Database",
        endgameBody: "Our ultimate goal transcends a traditional collection of articles. We aim to build The Hybrid Knowledge Database—a structured digital repository that actively balances research work and knowledge development between human-contributed and AI-generated or AI-assisted intellect. This database will not only store research about this phenomenon but will itself become an example of this new paradigm, offering new models of attribution, validation, and co-creation.",
        callToActionTitle: "A Call for Pioneers",
        callToActionBody: "If you are a researcher exploring the frontiers of knowledge in your field and facing questions about AI's role in your work—whether you are a jurist defining AI authorship, an artist co-creating with generative models, or a scientist using AI to formulate new hypotheses—then the NOVARIC AI Journal is your platform.",
        submitButton: "Join the Dialogue: Submit Your Paper",
        exploreButton: "Explore the New Paradigms",
        editorSectionTitle: "From the Editor",
        viewFullProfile: "View Full Profile",
        giantsTitle: "Built on the Shoulders of Giants",
        giantsBody: "Our academic foundation is based on the research and standards set by the world's most influential journals in the field of Artificial Intelligence and Machine Learning.",
    }
};

const journals = [
    { title: "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)", description: "Considered the top journal in computer vision and machine learning." },
    { title: "Journal of Machine Learning Research (JMLR)", description: "A high-impact, open-access journal for all areas of machine learning." },
    { title: "Artificial Intelligence Journal (AIJ)", description: "One of the oldest and most respected journals covering all fields of AI." },
    { title: "Nature Machine Intelligence", description: "A prestigious journal from Springer Nature on machine learning, AI, and robotics." },
    { title: "International Journal of Computer Vision (IJCV)", description: "A leading journal in the field of computer vision." },
    { title: "Science Robotics", description: "A high-impact journal from AAAS publishing cutting-edge robotics research." },
    { title: "The International Journal of Robotics Research (IJRR)", description: "A pioneering journal in robotics, covering both theoretical and practical research." },
    { title: "Expert Systems with Applications", description: "An international journal reporting on applications of expert and intelligent systems." }
];

export const NovaricJournalPage: React.FC<NovaricJournalPageProps> = ({ onBack, onNavigateToJasminaLumanajProfile }) => {
    const { language, toggleLanguage } = useLanguage();
    const content = translations[language];

    return (
    <main className="flex-grow bg-slate-900 text-white">
        {/* Navigation Bar */}
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
             <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 font-semibold rounded-md shadow-sm transition"
            >
                &larr; <span className="ml-2">{content.back}</span>
            </button>
             <div className="flex items-center gap-2 border border-slate-700 rounded-full p-1">
                <button 
                    onClick={() => language !== 'en' && toggleLanguage()} 
                    className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'en' ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                >
                    EN
                </button>
                <div className="w-px h-4 bg-slate-700"></div>
                <button 
                    onClick={() => language !== 'sq' && toggleLanguage()} 
                    className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'sq' ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                >
                    AL
                </button>
            </div>
        </div>

        {/* Hero Section */}
        <header className="relative text-center py-20 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-red-900/40 opacity-80"></div>
            <div className="relative z-10 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-extrabold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)'}}>
                    {renderWithSuperscript(content.heroTitle1)}<br/>
                    <span className="text-primary-400">{renderWithSuperscript(content.heroTitle2)}</span>
                </h1>
                <h2 className="text-2xl font-bold mt-8 text-slate-200">{content.manifestoTitle}</h2>
                <p className="mt-4 text-slate-300 leading-relaxed text-justify">{content.manifestoBody}</p>
            </div>
        </header>

        <div className="container mx-auto px-4 py-16">
            <section className="max-w-4xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-center mb-8 text-primary-400">{content.missionTitle}</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                        <GlobeAltIcon className="w-12 h-12 mx-auto text-primary-500 mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">{content.mission1Title}</h3>
                        <p className="text-sm text-slate-400">{content.mission1Body}</p>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                        <CpuChipIcon className="w-12 h-12 mx-auto text-primary-500 mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">{content.mission2Title}</h3>
                        <p className="text-sm text-slate-400">{content.mission2Body}</p>
                    </div>
                     <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                        <BookOpenIcon className="w-12 h-12 mx-auto text-primary-500 mb-4"/>
                        <h3 className="text-xl font-semibold mb-2">{content.mission3Title}</h3>
                        <p className="text-sm text-slate-400">{content.mission3Body}</p>
                    </div>
                </div>
            </section>
            
            <section className="mb-16 text-center bg-primary-900/20 p-8 rounded-xl border border-primary-500/30">
                 <h2 className="text-3xl font-bold text-center mb-4 text-primary-400">{content.endgameTitle}</h2>
                 <p className="text-slate-300 max-w-3xl mx-auto">{content.endgameBody}</p>
            </section>

             <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-2 text-primary-400">{content.giantsTitle}</h2>
                <p className="text-center text-slate-400 max-w-3xl mx-auto mb-8">{content.giantsBody}</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {journals.map(journal => (
                        <div key={journal.title} className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full">
                            <h4 className="font-semibold text-slate-100">{journal.title}</h4>
                            <p className="text-xs text-slate-400 mt-2">{journal.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-16">
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <div className="flex-shrink-0">
                        <img
                            src="https://novaric.co/wp-content/uploads/2025/11/JasminaLUMANAJ.jpg"
                            alt="Portreti i Dr. Jasmina Lumanaj"
                            className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-slate-700"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-100">Dr. Jasmina Lumanaj</h3>
                        <p className="text-md text-slate-300">{content.editorSectionTitle}, NOVARIC® AI Journal</p>
                        <button
                            onClick={onNavigateToJasminaLumanajProfile}
                            className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition-opacity"
                        >
                            {content.viewFullProfile}
                        </button>
                    </div>
                </div>
            </section>
            
            <section className="text-center">
                 <h2 className="text-3xl font-bold text-center mb-4 text-primary-400">{content.callToActionTitle}</h2>
                 <p className="text-slate-300 max-w-3xl mx-auto mb-8">{content.callToActionBody}</p>
                 <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2">
                        <PencilSquareIcon className="w-5 h-5"/>
                        {content.submitButton}
                    </button>
                     <button className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg shadow-lg">
                        {content.exploreButton}
                    </button>
                 </div>
            </section>
        </div>
    </main>
    );
};
