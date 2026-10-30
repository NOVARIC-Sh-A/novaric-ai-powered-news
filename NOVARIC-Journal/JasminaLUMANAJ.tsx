import React, { useState, useEffect, useRef } from 'react';
import { renderWithSuperscript } from '../utils/textUtils';
import { EnvelopeIcon, StarIcon } from '../components/icons';
import { useLanguage } from '../contexts/LanguageContext';

interface JasminaLumanajProfilePageProps {
  onBack: () => void;
}

const translations = {
    sq: {
        back: "Kthehu Pas",
        title: "Redaktore, NOVARIC® AI Journal",
        biographyTitle: "Biografia",
        biographyBody: [
            "Dr. Jasmina Lumanaj është Redaktore e NOVARIC® AI Journal dhe Drejtore e Përgjithshme e NOVARIC® Sh.A. Me një karrierë dinamike që ndërthur ekspertizën akademike me lidershipin ekzekutiv, Dr. Lumanaj sjell një perspektivë unike në krye të kësaj reviste. Përvoja e saj e gjerë në administrim biznesi, menaxhim financiar dhe lidership arsimor i jep asaj një kuptim të thellë të ndërveprimit midis inovacionit teknologjik dhe zhvillimit socio-ekonomik.",
            "Përpara rolit të saj aktual, ajo ka mbajtur pozicione drejtuese në sektorin e arsimit profesional dhe atë bankar, ku ka udhëhequr ekipe dhe ka menaxhuar operacione komplekse. Në të njëjtën kohë, ajo ka një angazhim të vazhdueshëm në botën akademike si pedagoge (part-time) në Universitetin \"Luigj Gurakuqi\" të Shkodrës, ku ligjëron lëndë si Menaxhim, Mikro/Makro Ekonomi dhe Kontabilitet.",
            "Puna e saj kërkimore, e kurorëzuar me një doktoraturë (PhD) në Administrim Biznesi, fokusohet në marrëdhëniet midis institucioneve, zhvillimit teknologjik dhe praktikave të burimeve njerëzore. Vizioni i saj për NOVARIC® AI Journal është të krijojë një urë lidhëse midis kërkimit shkencor rigoroz dhe aplikimeve praktike që adresojnë sfidat dhe mundësitë reale në Ballkanin Perëndimor."
        ],
        expertiseTitle: "Fushat Kryesore të Ekspertizës",
        expertiseList: [
            "Administrim Biznesi dhe Menaxhim Strategjik",
            "Lidership dhe Menaxhim në Arsim",
            "Strategji Financiare dhe Menaxhim Bankar",
            "Zhvillimi Teknologjik dhe Praktikat e Burimeve Njerëzore",
            "Marketing Dixhital dhe Etikë Biznesi",
            "Zhvillimi Ekonomik dhe Proceset Integruese Rajonale"
        ],
        credentialsTitle: "Kredencialet Akademike",
        credentialsList: [
            { degree: "PhD në Administrim Biznesi", institution: "Universiteti Europian i Tiranës, Shkolla Doktorale" },
            { degree: "Master i Shkencave në Administrim Biznesi / Biznes Marketing", institution: "Universiteti Europian i Tiranës" },
            { degree: "Diplomë në Financë-Kontabilitet", institution: "Universiteti i Shkodrës “Luigj Gurakuqi”" }
        ],
        publicationsTitle: "Publikime dhe Prezantime të Zgjedhura në Konferenca",
        publicationsList: [
            "\"Ballkani Perëndimor dhe Zhvillimi Teknologjik në Vlerësimin e Praktikave të Burimeve Njerëzore - Mbas COVID-19\" - Konferenca e 14-të Shkencore Ndërkombëtare, Ulqin (2022)",
            "\"Customer – Bank Relationship in Commercial Banks Operating in Albania” - ICSS XIII, Sofje (2016)",
            "“First European Conference in Technology and Society” - International University of Sarajevo (2013)",
            "“3rd International Conference on Human and Social Sciences, ICHSS 2013” - University of Rome (2013)",
            "\"Investimet në Funksion të Zhvillimit Ekonomik dhe Proceset Integruese\" - Instituti për Kërkime Shkencore dhe Zhvillim (2013)",
            "“Challenges of Economic European Integration for Western Balkan” - Luigj Gurakuqi University, International Conference (2010)"
        ],
        contactTitle: "Kontakt"
    },
    en: {
        back: "Back",
        title: "Editor, NOVARIC® AI Journal",
        biographyTitle: "Biography",
        biographyBody: [
            "Dr. Jasmina Lumanaj is the Editor of the NOVARIC® AI Journal and the General Director of NOVARIC® Sh.A. With a dynamic career that combines academic expertise with executive leadership, Dr. Lumanaj brings a unique perspective to the helm of this journal. Her extensive experience in business administration, financial management, and educational leadership gives her a deep understanding of the interplay between technological innovation and socio-economic development.",
            "Prior to her current role, she held leadership positions in the vocational education and banking sectors, where she led teams and managed complex operations. Concurrently, she maintains a continuous engagement with the academic world as a part-time lecturer at the \"Luigj Gurakuqi\" University of Shkodra, where she teaches subjects such as Management, Micro/Macro Economics, and Accounting.",
            "Her research work, culminating in a PhD in Business Administration, focuses on the relationships between institutions, technological development, and human resource practices. Her vision for the NOVARIC® AI Journal is to create a bridge between rigorous scientific research and practical applications that address the real challenges and opportunities in the Western Balkans."
        ],
        expertiseTitle: "Key Areas of Expertise",
        expertiseList: [
            "Business Administration and Strategic Management",
            "Leadership and Management in Education",
            "Financial Strategy and Banking Management",
            "Technological Development and Human Resource Practices",
            "Digital Marketing and Business Ethics",
            "Economic Development and Regional Integration Processes"
        ],
        credentialsTitle: "Academic Credentials",
        credentialsList: [
            { degree: "PhD in Business Administration", institution: "European University of Tirana, Doctoral School" },
            { degree: "Master of Science in Business Administration / Business Marketing", institution: "European University of Tirana" },
            { degree: "Degree in Finance-Accounting", institution: "“Luigj Gurakuqi” University of Shkodra" }
        ],
        publicationsTitle: "Selected Publications and Conference Presentations",
        publicationsList: [
            "\"The Western Balkans and Technological Development in the Evaluation of Human Resource Practices - Post COVID-19\" - 14th International Scientific Conference, Ulcinj (2022)",
            "\"Customer – Bank Relationship in Commercial Banks Operating in Albania” - ICSS XIII, Sofia (2016)",
            "“First European Conference in Technology and Society” - International University of Sarajevo (2013)",
            "“3rd International Conference on Human and Social Sciences, ICHSS 2013” - University of Rome (2013)",
            "\"Investments for Economic Development and Integration Processes\" - Institute for Scientific Research and Development (2013)",
            "“Challenges of Economic European Integration for Western Balkan” - Luigj Gurakuqi University, International Conference (2010)"
        ],
        contactTitle: "Contact"
    }
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="text-2xl font-semibold text-primary-400 mb-4 pb-2 border-b border-primary-500/30">{title}</h2>
        <div className="space-y-4 text-slate-300 text-justify">{children}</div>
    </section>
);

export const JasminaLumanajProfilePage: React.FC<JasminaLumanajProfilePageProps> = ({ onBack }) => {
    const { language, toggleLanguage } = useLanguage();
    const content = translations[language];
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const particles: { x: number, y: number, size: number, speedX: number, speedY: number }[] = [];
        const particleCount = 50;

        const resizeCanvas = () => {
            if (!canvas.parentElement) return;
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
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
            if (!ctx || !canvas) return;
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
        const resizeObserver = new ResizeObserver(resizeCanvas);
        if (canvas.parentElement) {
            resizeObserver.observe(canvas.parentElement);
        }

        return () => {
            if (canvas.parentElement) {
                resizeObserver.unobserve(canvas.parentElement);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <main className="relative min-h-screen text-white overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-50"></canvas>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 opacity-90"></div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={onBack} className="px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-md hover:bg-slate-700/50 transition-colors">{content.back}</button>
                    <div className="flex items-center gap-1 border border-slate-700 bg-slate-800/50 backdrop-blur-sm rounded-full p-1">
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
                </div>

                <div className="max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 sm:p-10 shadow-2xl">
                    <header className="text-center mb-10">
                        <img 
                            src="https://novaric.co/wp-content/uploads/2025/11/JasminaLUMANAJ.jpg"
                            alt="Portreti i Dr. Jasmina Lumanaj"
                            style={{ objectPosition: "center" }}
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary-500/50 shadow-lg mb-4 mx-auto"
                        />
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">Dr. Jasmina Lumanaj</h1>
                        <p className="text-lg text-primary-400 mt-2">{renderWithSuperscript(content.title)}</p>
                    </header>

                    <Section title={content.biographyTitle}>
                        {content.biographyBody.map((p, i) => <p key={i}>{p}</p>)}
                    </Section>
                    
                    <Section title={content.expertiseTitle}>
                        <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                            {content.expertiseList.map((item, i) => (
                                <li key={i} className="flex items-start"><StarIcon className="w-5 h-5 text-primary-400 mr-3 mt-1 flex-shrink-0" /><span>{item}</span></li>
                            ))}
                        </ul>
                    </Section>

                    <Section title={content.credentialsTitle}>
                        <ul className="space-y-4">
                            {content.credentialsList.map((item, i) => (
                                <li key={i}>
                                    <strong className="block text-slate-100">{item.degree}</strong>
                                    <span className="text-slate-400">{item.institution}</span>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title={content.publicationsTitle}>
                        <ul className="list-disc list-inside space-y-3 pl-2">
                            {content.publicationsList.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </Section>
                    
                    <Section title={content.contactTitle}>
                        <div className="flex items-center gap-4">
                            <EnvelopeIcon className="w-6 h-6 text-primary-400 flex-shrink-0" />
                            <a href="mailto:editor@media.novaric.al" className="text-slate-300 hover:text-primary-400 hover:underline break-all">
                                editor@media.novaric.al
                            </a>
                        </div>
                    </Section>

                </div>
            </div>
        </main>
    );
};