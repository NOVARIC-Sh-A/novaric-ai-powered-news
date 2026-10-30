import React from 'react';
import { PresentationChartLineIcon, PrinterIcon } from './icons';

interface ParagonMethodologyPageProps {
  onBack: () => void;
  onNavigateToVisualization: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <section className="mb-8 print-section">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-slate-300 dark:border-slate-600">{title}</h2>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-justify space-y-3">
            {children}
        </div>
    </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode; id?: string }> = ({ title, id, children }) => (
    <div className="mt-4" id={id}>
        <h3 className="text-xl font-bold text-primary-700 dark:text-primary-500 mb-2">{title}</h3>
        <div className="space-y-3 pl-2">{children}</div>
    </div>
);


export const ParagonMethodologyPage: React.FC<ParagonMethodologyPageProps> = ({ onBack, onNavigateToVisualization }) => {
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl print-container">
                <div className="mb-6 print-hidden">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition"
                    >
                        &larr; <span className="ml-2">Kthehu Pas</span>
                    </button>
                </div>

                <header className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                      Korniza Metodologjike PARAGON<sup>®</sup>
                    </h1>
                    <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">(Motori Analitik)</p>
                     <p className="text-md mt-4 text-slate-500 dark:text-slate-400 italic">
                      PARAGON (Parliamentary Assessment for Readiness, Aptitude, Governance, and Oversight Nurturing)
                    </p>
                </header>

                <div className="text-center mb-8 -mt-4">
                    <div className="flex justify-center items-center mb-4">
                        <div className="relative flex items-center">
                            <img 
                                src="https://novaricstorage.blob.core.windows.net/media/AdobeStock_1030253027.jpeg" 
                                alt="Përfaqësimi i Nora (AI)"
                                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-lg"
                                title="Nora (AI)"
                            />
                            <img 
                                src="https://novaricstorage.blob.core.windows.net/media/Profile-Photos/NOVARIC_Team-Member_A-THIKA_Small.png"
                                alt="Dr Alban Gj. THIKA"
                                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-lg -ml-3"
                                title="Dr Alban Gj. THIKA"
                            />
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Një punë hibride nga <span className="font-bold">Nora (AI)</span> & <span className="font-bold">Dr Alban Gj. THIKA</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Publikuar: 5 Gusht, 2025, ora 10:30 | Shkodër, Shqipëri
                    </p>
                    <div className="mt-4 flex justify-center items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4 max-w-sm mx-auto">
                        <div className="flex items-center" title="Koha e vlerësuar për lexim">
                            <span>5 min lexim</span>
                        </div>
                         <div className="flex items-center" title="Koha e vlerësuar e punës">
                            <span>42 orë pune</span>
                        </div>
                    </div>
                </div>

                <Section title="Etimologjia e Fjalës 'Paragon'">
                    <p>Fjala "paragon" vjen nga italishtja e vjetër <em>paragone</em>, që do të thotë "gur prove" — një gur i zi i fortë që përdorej për të testuar pastërtinë e arit ose argjendit.</p>
                    <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic my-2">
                        "Një model i përsosmërisë ose i një cilësie të veçantë." - Merriam-Webster
                    </blockquote>
                    <p>Korniza jonë analitike e merr këtë emër sepse synon të shërbejë si një "gur prove" për të vlerësuar performancën politike, duke vendosur një standard të lartë dhe duke identifikuar shembuj të ekselencës në shërbimin publik.</p>
                </Section>

                <Section title="Qëllimi">
                    <p>Të vlerësojë dhe të krahasojë në mënyrë holistike një deputet (ose figurë të krahasueshme) mbi aktivitetin politik, sjelljen demokratike dhe ndikimin—në nivel kombëtar dhe lokal—duke përdorur tregues të vlefshëm, metoda transparente dhe mbrojtje etike të përshtatura për kontekstin e anëtarësimit të Shqipërisë në BE. Standardet referojnë praktikat e BE/PE dhe standardet IPU/GRECO.</p>
                </Section>

                <Section title="I) Mbledhja dhe Grumbullimi i të Dhënave (Të Vlefshme, të Auditueshme, të Krahasueshme)">
                    <SubSection title="A. Të dhëna biografike dhe të karrierës (të strukturuara)">
                        <p><strong>Variablat:</strong> mosha, gjinia, arsimi, profesioni; partia, historia zgjedhore, komisionet/udhëheqja, postet ministrore, kohëzgjatja e shërbimit; deklarimet e pasurisë dhe interesave.</p>
                        <p><strong>Standardet dhe konteksti:</strong> Përputhni përkufizimet e variablave me "Treguesit për Parlamentet Demokratike" të IPU-së (efektiviteti, llogaridhënia, transparenca) dhe monitorimin e GRECO-s për rregullat e etikës dhe integritetit të deputetëve.</p>
                    </SubSection>
                    <SubSection title="B. Aktiviteti dhe performanca (të strukturuara + të pastrukturuara)">
                        <p><strong>Sjellja legjislative:</strong> Numri i sponsorizimeve/bashkë-sponsorizimeve, fokusi tematik; shkalla e suksesit; pjesëmarrja dhe ndërhyrjet në komisione; pyetjet parlamentare (vëllimi, ndjekja).</p>
                        <p><strong>Metodat:</strong> Rrjetet e bashkë-sponsorizimit zbulojnë strukturën e koalicionit dhe sipërmarrjen në agjendë; përdorni centralitetet e shkallës/ndërmjetësimit/eigenvectorit (ose fuqisë Bonacich) për të përmbledhur pozicionin dhe ndërmjetësimin.</p>
                        <p><strong>Analiza e votimit:</strong> vlerësimi i pikës ideale (p.sh., variantet NOMINATE/W-NOMINATE) për hartëzimin hapësinor të ideologjisë/kohezionit partiak—me paralajmërime për PE/Evropën se kërkesat për votim me emra janë strategjike dhe mund të anojnë vlerësimet e kohezionit/ideologjisë; preferoni modele të dizajnuara për dinamikat e PE-së dhe kontrollet e ndjeshmërisë.</p>
                        <p><strong>Komunikimi publik:</strong> Korporatat mediatike dhe të fjalimeve: modelimi i temave; analiza e kornizimit dhe sentmentit; indekset e dukshmërisë dhe tonit. Përdorni skemën e kornizimit të Entman për kodimin e kornizave të problemit/shkakut/etikës/zgjidhjes; vërtetoni etiketat e automatizuara me mostra të koduara manualisht.</p>
                        <p><strong>Media sociale:</strong> frekuenca, angazhimi, rritja e audiencës, rëndësia e çështjeve; ndiqni rishikimet e praktikave më të mira duke vënë në dukje kufijtë e parashikimit të sentmentit dhe trianguloni me sondazhe.</p>
                        <p><strong>Shërbimi ndaj zonës zgjedhore:</strong> Regjistrat e orëve të zyrës, sistemet e peticioneve, normat e zgjidhjes së rasteve; pjesëmarrja në nismat lokale.</p>
                        <p><strong>Përputhja me qeverisjen:</strong> hartëzoni me komponentët e WGI (zëri dhe llogaridhënia; sundimi i ligjit) për interpretim kontekstual në nivel vendi.</p>
                    </SubSection>
                    <SubSection title="C. Të dhëna të rrjetit dhe marrëdhënieve">
                        <p>Ndërtoni rrjete të shumëfishta (legjislative, partiake, shoqëri civile, biznes, organe ndërkombëtare). Analizoni pozicionin strukturor duke përdorur indekset e centralitetit/ndërmjetësimit për të nxjerrë përfundime mbi kapacitetin e koalicionit dhe aksesin.</p>
                    </SubSection>
                     <SubSection title="D. Perceptimi dhe reputacioni (të pastrukturuara/cilësore)">
                        <p>Sentimenti dhe rëndësia mediatike; intervista me ekspertë (gazetarë, OSHC, akademikë); sondazhe ku janë të disponueshme; grupe fokusi me kuota përfaqësuese lokale.</p>
                        <p><strong>Kujdes transparencë-llogaridhënie:</strong> Zbulimi i informacionit vetëm shpesh dështon të prodhojë llogaridhënie—dizenjoni tregues që gjurmojnë pasojat (hetime, sanksione, reforma).</p>
                    </SubSection>
                     <SubSection title="E. Të Dhëna të Reja - Profili Psikologjik dhe Filozofik (vullnetar, i mbikëqyrur klinikisht)">
                        <p><strong>Themeli etik:</strong> dilema të strukturuara + qartësim vlerash + hetim narrativ (i koduar për konsistencë mes rasteve).</p>
                        <p><strong>Stili konjitiv dhe rezistenca ndaj paragjykimeve:</strong> detyra të shkurtra arsyetimi; Testi i Reflektimit Konjitiv opsional si një proxy për tejkalimin reflektiv (interpretoni me kujdes).</p>
                        <p><strong>Qëndrueshmëria dhe përballimi:</strong> shkallë të vlefshme (p.sh., CD-RISC; Brief-COPE) të administruara dhe interpretuara nga profesionistë të licencuar.</p>
                        <p><strong>Motivimi dhe orientimi drejt shërbimit publik:</strong> intervista të strukturuara që operacionalizojnë dimensionet e Motivimit për Shërbim Publik (PSM).</p>
                        <p><strong>Empatia dhe orientimi ndaj konfliktit:</strong> lojëra me role të bazuara në skenarë; inpute 360° nga kolegë/staf (me pëlqim).</p>
                        <p><strong>Opsionale:</strong> Module IAT vetëm me mbrojtje rigoroze metodologjike/etike dhe mbikëqyrje ekspertësh.</p>
                        <p><strong>Përshtatja kulturore:</strong> përktheni/përshtatni instrumentet me procedurat e Beaton et al. (përkthim para-prapa, komitet ekspertësh, para-testim) para vendosjes në Shqipëri.</p>
                        <p><strong>Mbrojtja e të dhënave dhe etika:</strong> pëlqim i informuar; kufizim qëllimi; të dhëna minimale; bazë e ligjshme; të drejta për akses/fshirje; mbrojtje për kategori të veçanta sipas GDPR; puna psikologjike sipas kodeve etike profesionale.</p>
                    </SubSection>
                </Section>
                
                 <Section title="II) Korniza Analitike PARAGON® (Dimensionet → Treguesit → Pikët)">
                    <p>Çdo dimension operacionalizohet me tregues të riprodhueshëm dhe breza besimi. Aty ku gabimi i matjes është i njohur (p.sh., përzgjedhja e votimit me emra në PE), ne raportojmë analiza ndjeshmërisë.</p>
                    <p><strong>P – Angazhimi Politik dhe Ekspertiza:</strong> Treguesit: produktiviteti legjislativ (i rregulluar sipas temës), shkalla e suksesit, entropia e specializimit të çështjeve, centraliteti i rrjetit në koalicionet e çështjeve, raportet e komisioneve të ndikuara.</p>
                    <p><strong>A – Llogaridhënia dhe Transparenca:</strong> Treguesit: plotësia dhe afati i deklarimeve të pasurisë/interesave; ngjarje konflikti interesi; përgjigja ndaj auditimeve/kërkesave; ndjekja pas hetimeve.</p>
                    <p><strong>R – Përfaqësimi dhe Përgjegjshmëria:</strong> Treguesit: volumi i punës me rastet e zonës zgjedhore, përfshirja në projekte lokale, divergjenca nga linja e partisë kur interesi i distriktit është në rrezik (me rregullime të përshtatshme për PE).</p>
                    <p><strong>A – Pohimi dhe Ndikimi:</strong> Treguesit: koha e siguruar në foltore; normat e miratimit të amendamenteve; fuqia e rrjetit (eigenvector/Bonacich); ndërmjetësimi i koalicionit (ndërmjetësimi).</p>
                    <p><strong>G – Qeverisja dhe Forca Institucionale:</strong> Treguesit: nisma në përputhje me sundimin e ligjit, vota për integritetin, mbështetje për organet mbikëqyrëse, përputhja me përmirësimet e qeverisjes të tipit WGI.</p>
                    <p><strong>O – Kohezioni Organizativ dhe Parti-k:</strong> Treguesit: poste të brendshme partiake; normat e përputhjes me udhëzimet; lidhjet ndër-fraksionale; nominimet për udhëheqje.</p>
                    <p><strong>N – Narrativa dhe Komunikimi:</strong> Treguesit: disiplina e mesazhit (varianca e temës), konsistenca e kornizimit sipas Entman, trajektorja e sentmentit, afati i përgjigjes ndaj krizave; sinjalet e besimit të audiencës.</p>
                    <p><strong>Integrimi psiko-filozofik (përshkon të gjitha dimensionet):</strong> Hartëzoni PSM, qëndrueshmërinë, reflektimin konjitiv dhe empatinë me shënime shpjeguese mbi sjelljen nën stres, ndjeshmërinë ndaj mendimit të grupit dhe vendimmarrjen etike.</p>
                </Section>

                <Section title="III) Analiza Krahasuese dhe Standardet">
                    <ol className="list-decimal list-inside space-y-2">
                        <li><strong>Krahasim me kolegët (e njëjtës parti, opozitë, komision, brez):</strong> Krahasoni prodhimin/dukshmërinë/pozicionin në rrjet; rregulloni për kohëzgjatjen dhe aksesin në agjendë. Përdorni pikëzime z të standardizuara brenda shtresave.</li>
                        <li><strong>Ndikuesit në nivel makro (kombëtar):</strong> Standardet: Kryeministri/Ministrat, krerët e organeve të pavarura, aktorët kryesorë të OSHC/akademikë/media.</li>
                        <li><strong>Ndikuesit në nivel mikro (zona zgjedhore):</strong> Standardet: kryetari/këshilli bashkiak, OSHC-të lokale/udhëheqësit fetarë/komunitarë, zërat e medias lokale.</li>
                        <li><strong>Standardet normative:</strong> Treguesit e IPU-së (SDG 16.6/16.7), vetëvlerësimi parlamentar, kontrollet e ndjeshmërisë gjinore; rekomandimet e GRECO-s për deputetët.</li>
                    </ol>
                </Section>
                
                <Section title="IV) Mjetet Analitike dhe Produktet">
                     <p>A. Panelet e Kontrollit: Pikët PARAGON®, rrjetet.</p>
                     <p>B. Përmbledhjet Cilësore: Narrative të lidhura me ngjarje që shpjegojnë ndryshimet e pikëzimeve.</p>
                     <p>C. Karta e Profilit (përmbledhje ekzekutive): Një-faqëshe me radar PARAGON®, pikat e forta/rreziqet kryesore.</p>
                     <p>D. Hartëzimi i Ndikuesve: Rrjeti i ndikimit makro-mikro.</p>
                </Section>

                <Section title="V) Motori i Rishikuar me Integrim Psiko-Filozofik">
                     <ol className="list-decimal list-inside space-y-2">
                        <li><strong>Triangulimi i të dhënave:</strong> Kombinoni Metrikat Objektive, Perceptimet, Vlerësimet 360°, Vetë-raportimin dhe Matjet Psikologjike.</li>
                        <li><strong>Kontekstualizimi:</strong> Interpretoni brenda matricës së reformës dhe përafrimit me BE të Shqipërisë.</li>
                        <li><strong>Harta e Profilit të Detajuar: Forcat/Dobësitë:</strong> integroni fuqinë e rrjetit, zotërimin legjislativ, cilësinë e komunikimit, rekordin etik, PSM, qëndrueshmërinë, reflektimin konjitiv. Aftësitë/Kërcënimet: kapaciteti i të mësuarit, ndjeshmëria ndaj paragjykimeve, rreziku i 'burnout', ekspozimi ndaj presionit fraksional.</li>
                        <li><strong>Vlerësimi i Përputhshmërisë së Vlerave:</strong> Vlerësoni përputhshmërinë me normat demokratike, etikën e shërbimit publik dhe pozicionet në përputhje me acquis të BE-së.</li>
                        <li><strong>Indekset e përbërë:</strong> Gatishmëria (përgatitja situative) dhe Aftësia (kapaciteti për të mësuar/rritur).</li>
                        <li><strong>Indeksi i Performancës së Qeverisjes dhe Mbikëqyrjes:</strong> Agregoni veprimet e mbikëqyrjes legjislative, rekordin e votimit për integritetin, efektivitetin e mbikëqyrjes së komisioneve.</li>
                    </ol>
                </Section>

                 <Section title="VI) Produktet për Vendimmarrësit">
                    <p><strong>Produkti 1 – Profili i Përmirësuar i Deputetit:</strong> Harta e Profilit të Detajuar (e lidhur me prova), pikët e Gatishmërisë/Aftësisë me shpjegues, Indeksi i Qeverisjes/Mbikëqyrjes. Të gjitha rezultatet numerike përfshijnë shënime pasigurie dhe cilësie të dhënave (p.sh., "Skenari i anshmërisë së përzgjedhjes së votimit me emra në PE: i ulët/mesatar/i lartë").</p>
                    <p><strong>Produkti 2 – Analiza Kontekstuale e Vlerave:</strong> Përputhshmëria demokratike, etika e shërbimit publik, kontributi në integrimin në BE dhe një krahasim i shkurtër me eurodeputetët duke përdorur vlerësime dinamike të pikës ideale kur është e përshtatshme.</p>
                    <p><strong>Produkti 3 – Rekomandime për Zhvillim:</strong> Trajnime të synuara: hartim legjislativ, arsyetim analitik/ndërgjegjësim për paragjykimet, përdorimi i provave në politikë. Mentorim dhe koalicione: çiftëime që maksimizojnë mbulimin e boshllëqeve strukturore. Fokus strategjik: fusha çështjesh që përputhen me avantazhin krahasues (p.sh., etika/mbikëqyrja nëse integriteti/PSM i lartë). Zhvillim personal: trajnim për qëndrueshmërinë (feedback CD-RISC), optimizim i përballimit (modelet Brief-COPE), ri-kornizim i komunikimit i përshtatur me diskursin demokratik.</p>
                </Section>
                
                 <Section title="VII) Matje dhe Mbrojtje (Kritike për Besueshmërinë)">
                     <p><strong>Analitika e rrjetit:</strong> përdorni centralitete të shumëfishta (shkallë, ndërmjetësim, Bonacich) për të shmangur anshmërinë mono-metrike; interpretoni si strukturë mundësish, jo si ndikim në vetvete.</p>
                     <p><strong>Ideologjia e votimit:</strong> për krahasimet Shqipëri/BE, preferoni modele dinamike të ndërgjegjshme për PE dhe raportoni ndjeshmërinë ndaj modeleve të kërkesave për votim me emra.</p>
                     <p><strong>Media/sentimenti:</strong> kornizimi është më i rëndësishëm se sentmenti i papërpunuar për të nxjerrë përfundime mbi fuqinë e vendosjes së agjendës; vërtetoni NLP me kodim njerëzor.</p>
                     <p><strong>PSM/qëndrueshmëria/CRT/IAT:</strong> punësoni praktikantë të licencuar; siguroni pëlqim të informuar, përshtatje kulturore (Beaton et al.), dhe pajtueshmëri të rreptë me GDPR; mbani rezultatet individuale konfidenciale.</p>
                </Section>

                 <Section title="Referenca Akademike">
                    <div className="text-xs space-y-1">
                        <p><strong>Përgjithshëm:</strong> 't Hart (2011), "Evaluating Public Leadership".</p>
                        <p><strong>Rrjetet legjislative:</strong> Fowler mbi rrjetet e bashkë-sponsorizimit; Freeman & Bonacich mbi centralitetin/fuqinë.</p>
                        <p><strong>Votimi/ideologjia:</strong> Poole & Rosenthal (votimi hapësinor); kujdeset specifike për PE dhe vlerësimet dinamike.</p>
                        <p><strong>Komunikimi:</strong> Entman mbi kornizimin; rishikime metodologjike mbi sentmentin e mediave sociale.</p>
                        <p><strong>Motivimi për shërbim publik:</strong> Perry & Wise; matja nga Perry (1996).</p>
                        <p><strong>Qëndrueshmëria dhe përballimi:</strong> CD-RISC; Brief-COPE.</p>
                        <p><strong>Standardet e qeverisjes:</strong> Metodologjia WGI; treguesit e IPU-së; pajtueshmëria GRECO për Shqipërinë.</p>
                        <p><strong>Etika dhe mbrojtja e të dhënave:</strong> GDPR (Rreg. 2016/679); Kodi i Etikës së APA.</p>
                    </div>
                </Section>

                <div className="text-center my-8 print-hidden">
                    <button
                        onClick={onNavigateToVisualization}
                        className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition-colors"
                    >
                        <PresentationChartLineIcon className="w-5 h-5 mr-2" />
                        Shiko Modelin Analitik
                    </button>
                </div>
                
                 <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700 print-hidden">
                    <h3 className="text-lg font-semibold text-center text-slate-800 dark:text-slate-100 mb-4">Lexo Dokumentin e Plotë (Whitepaper)</h3>
                    <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-4">Për referencë akademike ose offline, ju mund ta printoni këtë metodologji të plotë ose ta ruani si një dokument PDF.</p>
                    <div className="text-center">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center justify-center px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition-colors"
                        >
                            <PrinterIcon className="w-5 h-5 mr-2" />
                            Printo / Ruaj si PDF
                        </button>
                    </div>
                </div>
                 <style>{`
                    @media print {
                      body > *:not(.print-container), .print-hidden {
                        display: none !important;
                      }
                      main {
                        padding: 0 !important;
                      }
                      .print-container {
                        box-shadow: none !important;
                        border: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                      }
                       .print-container * {
                          background-color: transparent !important;
                          color: black !important;
                          text-shadow: none !important;
                      }
                    }
                `}</style>

            </div>
        </main>
    );
};
