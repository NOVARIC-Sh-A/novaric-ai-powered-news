import React, { useState } from 'react';
import { ArrowPathIcon } from './icons';

interface GlossaryCardProps {
  term: string;
  definition: string;
}

const GlossaryCard: React.FC<GlossaryCardProps> = ({ term, definition }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="card-container h-full" onClick={() => setIsFlipped(!isFlipped)} style={{ minHeight: '150px' }}>
            <div className={`card ${isFlipped ? 'is-flipped' : ''}`}>
                {/* Card Front */}
                <div className="card-face card-front bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-5 shadow-lg rounded-xl flex flex-col justify-center items-center text-center">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{term}</h3>
                    <div className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center">
                        <ArrowPathIcon className="w-4 h-4 mr-1"/>
                        <span>Kliko për Përkufizimin</span>
                    </div>
                </div>
                {/* Card Back */}
                <div className="card-face card-back bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 p-5 shadow-xl rounded-xl flex flex-col justify-center overflow-y-auto">
                    <div>
                        <h4 className="font-bold text-lg text-primary-800 dark:text-primary-200">{term}</h4>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{definition}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const glossaryData = [
  { term: 'Acquis Communautaire (Acquis i BE-së)', definition: 'Tërësia e legjislacionit, jurisprudencës dhe parimeve të përbashkëta të Bashkimit Evropian, të cilat një vend kandidat si Shqipëria duhet t\'i adoptojë dhe zbatojë plotësisht përpara anëtarësimit.' },
  { term: 'Aktivizëm Gjyqësor (Judicial Activism)', definition: 'Një filozofi ose praktikë gjyqësore ku gjyqtarët marrin një rol aktiv në promovimin e vlerave të caktuara sociale ose politike, duke interpretuar Kushtetutën dhe ligjet në mënyrë të gjerë për të mbrojtur të drejtat ose për të korrigjuar dështimet e degëve të tjera të pushtetit. Shpesh përdoret me konotacion negativ nga kritikët.' },
  { term: 'Arketip Gjyqësor', definition: 'Një profil i stilizuar që krijohet nga Modeli MVPGJ për të klasifikuar gjyqtarët bazuar në pikat e tyre të forta dhe të dobëta (p.sh., "Gjyqtari Garant", "Gjyqtari Teknik"). Shërben si një mjet analitik për të kuptuar dinamikat e personelit në sistem.' },
  { term: 'Benchmark (Standard Krahasues)', definition: 'Një pikë reference standarde kundrejt së cilës matet performanca. Në kuadrin tonë, përdorim dy lloje: Standardi Lokal (mesatarja brenda sistemit shqiptar) dhe Benchmark-u Evropian (mesatarja e vendeve të BE-së, bazuar në të dhënat e CEPEJ).' },
  { term: 'Ekosistem i Jurisprudencës', definition: 'Rrjeti kompleks i aktorëve (gjyqtarë, prokurorë, avokatë), institucioneve (gjykata, këshilla, media) dhe forcave (politike, sociale, ekonomike) që ndërveprojnë për të formësuar mënyrën se si ligji interpretohet dhe zbatohet në praktikë.' },
  { term: 'Evropianizim (Europeanization)', definition: 'Procesi përmes të cilit normat, politikat dhe praktikat e Bashkimit Evropian adoptohen dhe internalizohen në sistemin ligjor dhe politik të një vendi kandidat. Kjo është forca kryesore e jashtme që drejton reformat në Shqipëri.' },
  { term: 'Filozofi Gjyqësore', definition: 'Tërësia e parimeve, besimeve dhe metodave interpretuese (shpesh të pashprehura) që udhëheqin një gjyqtar në marrjen e vendimeve. Përcakton qasjen e tij/saj ndaj tekstit ligjor dhe rolin e tij/saj në sistemin e ndarjes së pushteteve.' },
  { term: 'GJEDNJ (Gjykata Evropiane e të Drejtave të Njeriut)', definition: 'Gjykata ndërkombëtare me seli në Strasburg që interpreton Konventën Evropiane për të Drejtat e Njeriut. Vendimet e saj janë ligjërisht të detyrueshme për Shqipërinë.' },
  { term: 'Hermeneutikë Ligjore', definition: 'Studimi i teorisë dhe praktikës së interpretimit të teksteve ligjore. Thekson se interpretimi nuk është një proces mekanik, por një dialog midis tekstit, kontekstit historik dhe "para-kuptimit" të interpretuesit (gjyqtarit).' },
  { term: 'Integritet (si Koncept Analitik)', definition: 'Përtej kuptimit moral, në këtë projekt integriteti është një performancë aktive dhe e matshme që përfshin paanshmëri të demonstrueshme, menaxhim rigoroz të konfliktit të interesit, rezistencë ndaj presioneve dhe llogaridhënie transparente.' },
  { term: 'Institucione Gjithëpërfshirëse (Inclusive Institutions)', definition: 'Koncept nga Acemoglu & Robinson. Institucione politike dhe ekonomike që mbrojnë të drejtat e pronës, zbatojnë kontratat në mënyrë të paanshme dhe lejojnë pjesëmarrje të gjerë. Janë themeli i prosperitetit afatgjatë.' },
  { term: 'Institucione Shfrytëzuese (Extractive Institutions)', definition: 'Koncept nga Acemoglu & Robinson. Institucione të dizajnuara për të përqendruar pushtetin dhe pasurinë te një elitë e vogël, duke minuar shtetin e së drejtës dhe zhvillimin e gjerë ekonomik.' },
  { term: 'Kapje e Shtetit (State Capture)', definition: 'Një formë sistemike korrupsioni ku interesat private (biznese, klane) ndikojnë në mënyrë të paligjshme dhe jo-transparente në vendimmarrjen e shtetit (përfshirë vendimet gjyqësore) për të siguruar përfitime për veten e tyre, në dëm të interesit publik.' },
  { term: 'Kapital Social', definition: 'Koncept nga Robert Putnam. Rrjetet e bashkëpunimit, normat e reciprocitetit dhe besimi social që ekzistojnë në një shoqëri. Një nivel i lartë i kapitalit social konsiderohet thelbësor për funksionimin e institucioneve demokratike.' },
  { term: 'Levë (Leverage)', definition: 'Në kontekstin e integrimit evropian (sipas Vachudova-s), fuqia që BE-ja ushtron mbi një vend kandidat përmes kushtëzimit (p.sh., "plotësoni këtë reformë për të hapur negociatat"). Kjo levë është motori kryesor i reformës në drejtësi në Shqipëri.' },
  { term: 'Llogaridhënie (Accountability)', definition: 'Detyrimi i një aktori ose institucioni për të shpjeguar dhe justifikuar veprimet e tij/saj dhe për të pranuar pasojat në rast dështimi. Sipas Bovens, ajo mund të jetë ligjore, politike, sociale, etj.' },
  { term: 'MVPGJ (Modeli i Vlerësimit të Performancës Gjyqësore)', definition: 'Mjeti metodologjik i krijuar për këtë projekt. Përdor një sistem të ponderuar me katër shtylla (kompetenca, integriteti, filozofia, efikasiteti) për të krijuar një profil të strukturuar të performancës së një gjyqtari.' },
  { term: 'Përmbajtje Gjyqësore (Judicial Restraint)', definition: 'E kundërta e aktivizmit gjyqësor. Një filozofi që thekson se gjykatat duhet të tregohen të matura, të respektojnë prezumimin e kushtetutshmërisë së ligjeve dhe t\'ia lënë politikëbërjen degëve të zgjedhura të pushtetit, përveçse në rastet e shkeljeve të qarta.' },
  { term: 'Purpozivizëm (Purposivism)', definition: 'Një metodë e interpretimit ligjor që fokusohet në zbulimin e qëllimit ose objektivit social që ligjvënësi ka synuar të arrijë me një ligj. Gjyqtari shkon përtej fjalëve të tekstit për të kuptuar arsyen e normës.' },
  { term: 'Sferë Publike (Public Sphere)', definition: 'Koncept nga Jürgen Habermas. Një hapësirë (metaforike) në shoqëri ku qytetarët mblidhen si individë privatë për të debatuar në mënyrë racionale mbi çështjet me interes publik. Media ideale duhet të ishte shtylla e kësaj sfere.' },
  { term: 'Shtet i së Drejtës (Rule of Law)', definition: 'Përtej përkufizimit formal, në këtë projekt ai kuptohet si një sistem funksional ku pushteti i qeverisë është i kufizuar nga ligji, ku qytetarët janë të barabartë para ligjit dhe ku një gjyqësor i pavarur mbron të drejtat themelore.' },
  { term: 'Tekstualizëm (Textualism)', definition: 'Një metodë e interpretimit ligjor që fokusohet pothuajse ekskluzivisht te kuptimi i zakonshëm i fjalëve në tekstin e ligjit, pa i dhënë rëndësi qëllimit të ligjvënësit apo pasojave të interpretimit.' },
  { term: 'Vetting (Procesi i Vetingut)', definition: 'Procesi i rivlerësimit kalimtar i të gjithë gjyqtarëve dhe prokurorëve në Shqipëri, i bazuar në tre kritere: kontrolli i pasurisë, kontrolli i figurës (lidhjet me krimin) dhe vlerësimi i aftësive profesionale. Në kuadrin tonë, është pika zero për ndërtimin e integritetit të ri.' },
];

export const GlossaryComponent: React.FC = () => (
    <>
        <p>Ky indeks përcakton kuptimin e termave kyçe të përdorur në analizën e ekosistemit të jurisprudencës në Shqipëri. Qëllimi është të ofrohet një përkufizim i saktë dhe i kontekstualizuar që reflekton kuadrin teorik të këtij projekti.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {glossaryData.map(item => <GlossaryCard key={item.term} term={item.term} definition={item.definition} />)}
        </div>
    </>
);
