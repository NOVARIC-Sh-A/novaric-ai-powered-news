
import React, { useState, useEffect, useRef } from 'react';
import { renderWithSuperscript } from '../utils/textUtils';
import { BookOpenIcon, CpuChipIcon, GlobeAltIcon, PencilSquareIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons';
import { useLanguage } from '../contexts/LanguageContext';

interface NovaricJournalManifestoPageProps {
  onBack: () => void;
  onNavigateToJasminaLumanajProfile: () => void;
}

const translations = {
    sq: {
        pageTitle: "Manifesti i NOVARIC® AI Journal",
        back: "Kthehu Pas",
        heroTitle1: "Arkitektojmë Narrativën Për",
        heroTitle2: "Një Shoqëri më të Mençur™",
        manifestoTitle: "Manifesti Ynë: Përtej Inteligjencës Artificiale, Drejt Intelektit Hibrid",
        manifestoBody: [
            "Ne po jetojmë në një pikë kthese historike. Inteligjenca Artificiale nuk është më thjesht një mjet; ajo po bëhet një partnere aktive në procesin e zbulimit, krijimit dhe inovacionit. Kjo epokë e re sfidon vetë themelet e asaj që ne e konsiderojmë njohuri, autorësi dhe pronësi intelektuale.",
            "Pyetjet nuk janë më thjesht teknike, por thellësisht filozofike: Ku përfundon kontributi njerëzor dhe ku fillon ai i makinerisë? Si e mbrojmë dhe stimulojmë kreativitetin njerëzor ndërsa përqafojmë potencialin e pamasë të IA-së?",
            "NOVARIC® AI Journal lindi nga nevoja urgjente për të adresuar këto pyetje. Ne nuk jemi thjesht një revistë tjetër për IA. Ne jemi ekosistemi akademik ku studiuesit, juristët, artistët, shkencëtarët dhe humanistët mblidhen për të eksploruar, debatuar dhe formësuar të ardhmen e pronësisë intelektuale në epokën e intelektit hibrid."
        ],
        missionTitle: "Misioni Ynë Themelor",
        mission1Title: "Eksplorimi i Kryqëzimit",
        mission1Body: "Të ofrojmë një forum rigoroz për kërkime që hetojnë marrëdhënien simbiotike dhe ndonjëherë konfliktuale midis intelektit njerëzor dhe inteligjencës artificiale.",
        mission2Title: "Krijimi i Ekosistemit",
        mission2Body: "Të kultivojmë një komunitet ndërdisiplinor ku autorët jo vetëm publikojnë gjetjet e tyre, por gjejnë gjithashtu mjetet dhe dialogun e nevojshëm për të lundruar në peizazhin e ri.",
        mission3Title: "Dokumentimi i Evolucionit",
        mission3Body: "Të shërbejmë si arkivi parësor që dokumenton këtë transformim historik, duke gjurmuar ndryshimet në praktikat kërkimore, normat ligjore dhe standardet etike.",
        endgameTitle: "Endgame: Baza e të Dhënave të Njohurive Hibride",
        endgameBody: "Qëllimi ynë përfundimtar tejkalon një koleksion tradicional artikujsh. Ne synojmë të ndërtojmë Bazën e të Dhënave të Njohurive Hibride—një depo digjitale e strukturuar që balancon në mënyrë aktive punën kërkimore midis intelektit të kontribuar nga njeriu dhe atij të gjeneruar ose asistuar nga IA.",
        callToActionTitle: "Thirrje për Pionierët",
        callToActionBody: "Nëse jeni një studiues që eksploron kufijtë e dijes dhe përballeni me pyetje rreth rolit të IA-së në punën tuaj—pavarësisht nëse jeni jurist, artist apo shkencëtar—atëherë NOVARIC AI Journal është platforma juaj.",
        submitButton: "Dorëzoni Punimin Tuaj",
        exploreButton: "Eksploroni Paradigmat e Reja",
        inspirationTitle: "Burimet e Frymëzimit",
        inspirationBody: "Themeli ynë akademik bazohet në kërkimet dhe standardet e vendosura nga revistat më me ndikim në botë në fushën e Inteligjencës Artificiale dhe Mësimit Makinerik.",
        editorSectionTitle: "Fjala e Kryeredaktores",
        editorWord: "Ne qëndrojmë në pragun e një epoke të re, ku kufijtë midis intelektit njerëzor dhe inteligjencës artificiale po bëhen gjithnjë e më të paqartë. Ky moment transformues paraqet si një sfidë të thellë ashtu edhe një mundësi të paprecedentë: të ripërcaktojmë vetë themelet e autorësisë, inovacionit dhe pronësisë intelektuale. Në rolin tim si Kryeredaktore e NOVARIC® AI Journal, angazhimi im është të kultivoj një hapësirë për dialog rigoroz, ndërdisiplinor dhe vizionar. Misioni ynë nuk është thjesht të publikojmë kërkime rreth IA, por të shërbejmë si kujdestarë të bisedës globale se si ky partneritet i ri midis njeriut dhe makinës do të formësojë të ardhmen e dijes. Ju ftoj të gjithëve ju—studiues, inovatorë dhe mendimtarë pionierë—të bëheni pjesë e këtij misioni thelbësor. Le ta ndërtojmë së bashku të ardhmen e dijes.",
        viewFullProfile: "Shiko Profilin e Plotë",
    },
    en: {
        pageTitle: "NOVARIC® AI Journal Manifesto",
        back: "Back",
        heroTitle1: "Shaping the Narrative For",
        heroTitle2: "A Smarter Society™",
        manifestoTitle: "Our Manifesto: Beyond Artificial Intelligence, Towards Hybrid Intellect",
        manifestoBody: [
            "We are living at a historical turning point. Artificial Intelligence is no longer just a tool; it is becoming an active partner in the process of discovery, creation, and innovation. This new era challenges the very foundations of what we consider knowledge, authorship, and intellectual property.",
            "The questions are no longer merely technical, but profoundly philosophical: Where does human contribution end and machine contribution begin? How do we protect and stimulate human creativity while embracing the immense potential of AI?",
            "The NOVARIC® AI Journal is born from the urgent need to address these questions. We are not just another journal about AI. We are the academic ecosystem where researchers, jurists, artists, scientists, and humanists convene to explore, debate, and shape the future of intellectual property in the age of hybrid intellect."
        ],
        missionTitle: "Our Core Mission",
        mission1Title: "Explore the Intersection",
        mission1Body: "To provide a rigorous forum for research that investigates the symbiotic and sometimes conflicting relationship between human intellect and artificial intelligence.",
        mission2Title: "Create the Right Ecosystem",
        mission2Body: "To cultivate a cross-disciplinary community where authors not only publish their findings but also find the tools and dialogue necessary to navigate the new landscape.",
        mission3Title: "Document the Evolution",
        mission3Body: "To serve as the primary archive documenting this historic transformation, tracking the shifts in research practices, legal norms, and ethical standards.",
        endgameTitle: "The Endgame: The Hybrid Knowledge Database",
        endgameBody: "Our ultimate goal transcends a traditional collection of articles. We aim to build The Hybrid Knowledge Database—a structured digital repository that actively balances research between human-contributed and AI-generated or assisted intellect.",
        callToActionTitle: "A Call for Pioneers",
        callToActionBody: "If you are a researcher exploring the frontiers of knowledge and facing questions about AI's role in your work—whether you are a jurist, an artist, or a scientist—then the NOVARIC AI Journal is your platform.",
        submitButton: "Submit Your Paper",
        exploreButton: "Explore the New Paradigms",
        inspirationTitle: "Sources of Inspiration",
        inspirationBody: "Our academic foundation is based on the research and standards set by the world's most influential journals in the field of Artificial Intelligence and Machine Learning.",
        editorSectionTitle: "A Word from the Editor in Chief",
        editorWord: "We stand at the threshold of a new era, where the boundaries between human intellect and artificial intelligence are becoming increasingly blurred. This transformative moment presents both a profound challenge and an unprecedented opportunity: to redefine the very foundations of authorship, innovation, and intellectual property. In my role as Chief Editor of the NOVARIC® AI Journal, my commitment is to cultivate a space for rigorous, cross-disciplinary, and visionary dialogue. Our mission is not merely to publish research about AI, but to serve as the steward of the global conversation on how this new partnership between human and machine will shape the future of knowledge. I invite all of you—researchers, innovators, and pioneering thinkers—to become part of this essential mission. Let us build the future of knowledge together.",
        viewFullProfile: "View Full Profile",
    }
};

const journals = [
    { title: "IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)", description_al: "Konsiderohet gjerësisht si revista kryesore në fushën e vizionit kompjuterik dhe mësimit makinerik.", description_en: "Widely considered the top journal in computer vision and machine learning." },
    { title: "Journal of Machine Learning Research (JMLR)", description_al: "Një revistë me akses të hapur dhe me reputacion të lartë, që mbulon të gjitha fushat e mësimit makinerik.", description_en: "A high-impact, open-access journal covering all areas of machine learning." },
    { title: "Artificial Intelligence Journal (AIJ)", description_al: "Një nga revistat më të vjetra dhe më të respektuara, që mbulon të gjitha fushat e AI.", description_en: "One of the oldest and most respected journals covering all fields of AI." },
    { title: "Nature Machine Intelligence", description_al: "Një revistë prestigjioze që publikon kërkime të jashtëzakonshme në kryqëzimin e AI dhe robotikës.", description_en: "A prestigious journal publishing exceptional research at the intersection of AI and robotics." },
    { title: "IEEE Transactions on Neural Networks and Learning Systems", description_al: "Fokusohet në teorinë, dizajnin dhe aplikimet e rrjeteve nervore artificiale.", description_en: "Focuses on the theory, design, and applications of artificial neural networks." },
    { title: "International Journal of Computer Vision (IJCV)", description_al: "Një revistë lider në fushën e vizionit kompjuterik.", description_en: "A leading journal in the field of computer vision." },
    { title: "Pattern Recognition", description_al: "Mbulon kërkimet në njohjen e modeleve dhe përpunimin e të dhënave.", description_en: "Covers research in pattern recognition and data processing." },
    { title: "Information Fusion", description_al: "Fokusohet në teorinë dhe aplikimet e shkrirjes së informacionit dhe të dhënave.", description_en: "Focuses on the theory and applications of information and data fusion." },
    { title: "IEEE Transactions on Fuzzy Systems", description_al: "Revista kryesore për kërkime në logjikën 'fuzzy' dhe aplikimet e saj.", description_en: "The leading journal for research in fuzzy logic and its applications." },
    { title: "Journal of Artificial Intelligence Research (JAIR)", description_al: "Një revistë me akses të hapur e dedikuar për shpërndarjen e shpejtë të rezultateve kërkimore në AI.", description_en: "An open-access journal dedicated to the rapid dissemination of AI research results." },
    { title: "Science Robotics", description_al: "Një revistë me faktor të lartë ndikimi nga AAAS që publikon kërkime avangardë në robotikë.", description_en: "A high-impact journal from AAAS publishing cutting-edge robotics research." },
    { title: "The International Journal of Robotics Research (IJRR)", description_al: "Një nga revistat pioniere në fushën e robotikës.", description_en: "One of the pioneering journals in the field of robotics." },
    { title: "IEEE Transactions on Robotics", description_al: "Publikon artikuj me cilësi të lartë mbi teorinë dhe praktikën e robotikës.", description_en: "Publishes high-quality articles on the theory and practice of robotics." },
    { title: "Robotics and Autonomous Systems", description_al: "Fokusohet në zhvillimet themelore në fushën e robotikës autonome.", description_en: "Focuses on fundamental developments in the field of autonomous robotics." },
    { title: "Expert Systems with Applications", description_al: "Raporton mbi aplikimet e sistemeve eksperte dhe inteligjente.", description_en: "Reports on the applications of expert and intelligent systems." },
    { title: "Knowledge-Based Systems", description_al: "Publikon kërkime mbi sistemet që përdorin njohuri për të kryer detyra komplekse.", description_en: "Publishes research on systems that use knowledge to perform complex tasks." },
];

export const NovaricJournalManifestoPage: React.FC<NovaricJournalManifestoPageProps> = ({ onBack, onNavigateToJasminaLumanajProfile }) => {
    const { language, toggleLanguage } = useLanguage();
    const content = translations[language];
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [carouselIndex, setCarouselIndex] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const particles: { x: number, y: number, size: number, speedX: number, speedY: number }[] = [];
        const particleCount = 50;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.strokeStyle = 'rgba(228, 25, 30, 0.3)';

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
                if (p.y > canvas.height || p.y < 0) p.speedY *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const nextSlide = () => setCarouselIndex(prev => (prev + 1) % journals.length);
    const prevSlide = () => setCarouselIndex(prev => (prev - 1 + journals.length) % journals.length);

    return (
        <div className="text-white min-h-screen">
            <header className="relative text-center pt-24 pb-16 px-4 overflow-hidden min-h-[60vh] flex flex-col justify-end">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-50"></canvas>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-transparent to-slate-900"></div>
                
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
                        {renderWithSuperscript(content.heroTitle1)}<br/>
                        <span className="text-primary-400">{renderWithSuperscript(content.heroTitle2)}</span>
                    </h1>
                </div>

                <div className="absolute top-4 left-4 z-20">
                    <button onClick={onBack} className="px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-md hover:bg-slate-700/50 transition-colors">{content.back}</button>
                </div>
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1 border border-slate-700 bg-slate-800/50 backdrop-blur-sm rounded-full p-1">
                    <button 
                        onClick={() => language !== 'en' && toggleLanguage()} 
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${language === 'en' ? 'bg-primary-600' : 'hover:bg-slate-700'}`}
                    >
                        EN
                    </button>
                    <button 
                        onClick={() => language !== 'sq' && toggleLanguage()} 
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${language === 'sq' ? 'bg-primary-600' : 'hover:bg-slate-700'}`}
                    >
                        AL
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-10">

                <section className="max-w-4xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold text-center mb-6 text-primary-400">{content.manifestoTitle}</h2>
                    <div className="space-y-4 text-slate-300 text-justify">
                        {content.manifestoBody.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                </section>
                
                <section className="max-w-5xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold text-center mb-10 text-primary-400">{content.missionTitle}</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
                            <GlobeAltIcon className="w-12 h-12 mx-auto text-primary-500 mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">{content.mission1Title}</h3>
                            <p className="text-sm text-slate-400">{content.mission1Body}</p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
                            <CpuChipIcon className="w-12 h-12 mx-auto text-primary-500 mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">{content.mission2Title}</h3>
                            <p className="text-sm text-slate-400">{content.mission2Body}</p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
                            <BookOpenIcon className="w-12 h-12 mx-auto text-primary-500 mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">{content.mission3Title}</h3>
                            <p className="text-sm text-slate-400">{content.mission3Body}</p>
                        </div>
                    </div>
                </section>

                <section className="mb-20 text-center bg-primary-900/20 p-10 rounded-xl border border-primary-500/30">
                    <h2 className="text-3xl font-bold mb-4 text-primary-400">{content.endgameTitle}</h2>
                    <p className="text-slate-300 max-w-3xl mx-auto">{content.endgameBody}</p>
                </section>
                
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-10 text-primary-400">{content.editorSectionTitle}</h2>
                    <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-800/50 p-8 rounded-lg border border-slate-700/50 max-w-4xl mx-auto">
                        <div className="flex-shrink-0 text-center">
                            <img
                                src="https://novaric.co/wp-content/uploads/2025/11/JasminaLUMANAJ.jpg"
                                alt="Portreti i Dr. Jasmina Lumanaj"
                                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-slate-700 mx-auto"
                            />
                            <h3 className="text-xl font-bold text-slate-100 mt-4">Dr. Jasmina Lumanaj</h3>
                            <p className="text-md text-primary-400">Editor in Chief, NOVARIC® AI Journal</p>
                        </div>
                        <div className="flex-grow">
                            <blockquote className="border-l-4 border-primary-500 pl-4 italic text-slate-300">
                                <p>{content.editorWord}</p>
                            </blockquote>
                            <button
                                onClick={onNavigateToJasminaLumanajProfile}
                                className="mt-6 inline-flex items-center justify-center px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg shadow-md transition-colors"
                            >
                                {content.viewFullProfile} &rarr;
                            </button>
                        </div>
                    </div>
                </section>
                
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-4 text-primary-400">{content.inspirationTitle}</h2>
                    <p className="text-center text-slate-400 max-w-3xl mx-auto mb-10">{content.inspirationBody}</p>
                    <div className="relative max-w-4xl mx-auto">
                        <div className="overflow-hidden relative h-48">
                            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${carouselIndex * (100 / 3)}%)` }}>
                                {[...journals, ...journals, ...journals].map((journal, i) => (
                                    <div key={i} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 px-3">
                                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full flex flex-col justify-center">
                                            <h4 className="font-semibold text-slate-100 text-sm">{journal.title}</h4>
                                            <p className="text-xs text-slate-400 mt-2">{language === 'sq' ? journal.description_al : journal.description_en}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-6 bg-slate-700 p-2 rounded-full hover:bg-slate-600 transition-colors z-10" aria-label="Previous Journal"><ChevronLeftIcon className="w-6 h-6"/></button>
                        <button onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-6 bg-slate-700 p-2 rounded-full hover:bg-slate-600 transition-colors z-10" aria-label="Next Journal"><ChevronRightIcon className="w-6 h-6"/></button>
                    </div>
                </section>

                <section className="text-center">
                    <h2 className="text-3xl font-bold mb-4 text-primary-400">{content.callToActionTitle}</h2>
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
        </div>
    );
};
