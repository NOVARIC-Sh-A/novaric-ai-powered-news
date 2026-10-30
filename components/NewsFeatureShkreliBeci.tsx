import React from 'react';
import { ArgumentStrengthMeter } from './ArgumentStrengthMeter';
import { Timeline } from './Timeline';
import { CasePoll } from './CasePoll';
import { ScaleIcon, ShieldCheckIcon, PencilSquareIcon, BookOpenIcon, UsersIcon, ChartBarIcon, ChatBubbleBottomCenterTextIcon, CheckCircleIcon, XCircleIcon } from './icons';
import { renderWithSuperscript } from '../utils/textUtils';

interface NewsFeatureShkreliBeciProps {
  onBack: () => void;
}

const KeyPoint: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-4 mt-1">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{children}</p>
        </div>
    </div>
);

const ProfileCard: React.FC<{
    name: string;
    title: string;
    imageUrl: string;
    pros: string[];
    cons: string[];
}> = ({ name, title, imageUrl, pros, cons }) => (
    <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-lg shadow-md h-full flex flex-col">
        <div className="text-center">
            <img 
                src={imageUrl} 
                alt={`Portreti i ${name}`}
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-600 mb-2 mx-auto"
            />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex-grow">
            <div className="space-y-3">
                <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400 text-sm mb-1">Pikat Pro (Në këtë kontekst)</h4>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {pros.map((pro, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{pro}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-red-600 dark:text-red-400 text-sm mb-1">Pikat Kundër (Në këtë kontekst)</h4>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {cons.map((con, index) => (
                            <li key={index} className="flex items-start">
                                <XCircleIcon className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{con}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);


export const NewsFeatureShkreliBeci: React.FC<NewsFeatureShkreliBeciProps> = ({ onBack }) => {
  const scorecardData = [
    { metric: "Baza Ligjore", beciScore: 90, hkreliScore: 10 },
    { metric: "Prova Publike", beciScore: 10, shkreliScore: 90 },
    { metric: "Paanshmëria Politike", beciScore: 5, shkreliScore: 95 },
    { metric: "Reputacioni", beciScore: 20, shkreliScore: 80 },
    { metric: "Transparenca", beciScore: 15, shkreliScore: 85 },
  ];

  // FIX: Updated data properties to 'year' and 'title' to comply with TimelineEvent interface
  const timelineEvents = [
    { year: '2006', title: 'Simon SHKRELI fillon karrierën e tij si aktor në Teatrin "Migjeni".' },
    { year: '2014', title: 'SHKRELI formalizon marrëdhënien e punës, duke u punësuar me kontratë të rregullt nga Bashkia Shkodër.' },
    { year: '23.07.2025', title: 'Bashkia Shkodër, nëpërmjet Teatrit "Migjeni", lëshon letrën që njofton fillimin e procedurave për ndërprerjen e marrëdhënies së punës.' },
    { year: '28.07.2025', title: 'Data e caktuar për seancën dëgjimore administrative, ku Z. SHKRELI do të paraqesë mbrojtjen e tij.' },
  ];

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-2xl text-slate-700 dark:text-slate-200">
        <div className="mb-6">
            <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-md shadow-sm transition"
            >
                &larr; <span className="ml-2">Kthehu Pas</span>
            </button>
        </div>
        
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-700 dark:text-primary-400 mb-2">
            Rasti SHKRELI vs. BECI: Një Studim i Thelluar
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Kur Përplasen Performanca Administrative dhe Akuzat Politike
          </p>
        </header>

        <section className="mb-12 text-center text-slate-600 dark:text-slate-300 prose dark:prose-invert max-w-none">
            <p>Shkarkimi i aktorit të njohur Simon SHKRELI nga Teatri "Migjeni" prej administratës së Kryebashkiakut Benet BECI ka ndezur një debat të ashpër publik. Ky rast shkon përtej një mosmarrëveshjeje pune, duke prekur tema delikate si politizimi i institucioneve kulturore, transparenca e administratës publike dhe përdorimi i pushtetit në Shqipëri. Më poshtë, {renderWithSuperscript('NOVARIC®')} dekonstrukton argumentet e të dyja palëve dhe ofron një analizë të thelluar.</p>
        </section>

        <section className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-6">Protagonistët: Perceptimi Publik dhe Vlerësimi Profesional</h2>
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
                <ProfileCard 
                    name="Benet BECI"
                    title="Kryetar i Bashkisë Shkodër"
                    imageUrl="https://novaricstorage.blob.core.windows.net/media/Profile-Photos/Benet-BECI"
                    pros={[
                        "Argumenti administrativ, ndonëse i padëshmuar, ofron një mbulesë formale-ligjore.",
                        "Kontrollon narrativën zyrtare dhe ka akses në dokumentacionin e brendshëm.",
                        "Mbështetja politike qendrore i jep fuqi për të përballuar presionin publik."
                    ]}
                    cons={[
                        "Mungesa totale e transparencës për 'performancën e dobët' e bën versionin zyrtar të pabesueshëm.",
                        "Perceptohet si një sulm politik, duke dëmtuar imazhin e tij si administrator teknik e jo-politik.",
                        "Ka bashkuar kundër tij komunitetin artistik dhe një pjesë të madhe të opinionit publik."
                    ]}
                />
                 <ProfileCard 
                    name="Simon SHKRELI"
                    title="Aktor"
                    imageUrl="https://novaricstorage.blob.core.windows.net/media/Profile-Photos/Simon-SHKRELA-Profile.jpg"
                    pros={[
                        "Gëzon një reputacion profesional 20-vjeçar pa asnjë vërejtje të dokumentuar.",
                        "Ka fituar mbështetjen masive të publikut dhe komunitetit artistik.",
                        "Rasti i tij është kthyer në simbol të rezistencës kundër ndërhyrjes politike në art."
                    ]}
                    cons={[
                        "Lidhja familjare me opozitën përdoret nga kundërshtarët për ta etiketuar si rast politik.",
                        "I mungon aksesi në dosjen e brendshme për të kundërshtuar pretendimet administrative.",
                    ]}
                />
            </div>
        </section>

        <section className="mb-12">
             <h2 className="text-2xl font-semibold text-center mb-4">Linja Kohore e Ngjarjeve</h2>
             <Timeline events={timelineEvents} />
        </section>
        
        <section className="mb-12">
             <h2 className="text-2xl font-semibold text-center mb-4">Dokumenti Zyrtar</h2>
             <div className="relative max-w-lg mx-auto">
                <img 
                    src="https://novaricstorage.blob.core.windows.net/media/Simon-SHKRELA_Doc.jpg" 
                    alt="Njoftimi zyrtar për fillimin e procedurave të ndërprerjes së marrëdhënies së punës për Simon SHKRELIN"
                    className="w-full h-auto rounded-lg shadow-lg border border-slate-200 dark:border-slate-600"
                />
                <div className="absolute top-2 right-2 bg-green-100 dark:bg-green-900/80 border border-green-300 dark:border-green-600 text-green-800 dark:text-green-200 text-xs font-bold px-2 py-1 rounded-md flex items-center shadow-md backdrop-blur-sm">
                    <ShieldCheckIcon className="w-4 h-4 mr-1.5"/>
                    <span>Dokument i Verifikuar</span>
                </div>
             </div>
        </section>

        <section className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-6">Analiza e Diskursit Narrativ të Dokumentit Zyrtar</h2>
            <div className="space-y-5">
                <KeyPoint icon={<PencilSquareIcon className="w-5 h-5 text-amber-500"/>} title="Kornizimi Pasiv dhe Paqartësia">
                    Fraza “...për arsye të mungesës së efikasitetit dhe performancës së dobët...” është qëllimisht e paqartë dhe subjektive. Kjo e bën të vështirë për palën e akuzuar ta kundërshtojë me të dhëna objektive, pasi kriteret e "efikasitetit" nuk janë përcaktuar kurrë.
                </KeyPoint>
                <KeyPoint icon={<ChartBarIcon className="w-5 h-5 text-red-500"/>} title="Mungesa e Metrikave të Matshme">
                    Dokumenti nuk i referohet asnjë Treguesi Kyç të Performancës (KPI), asnjë vlerësimi periodik të dokumentuar, apo ndonjë paralajmërimi zyrtar për performancë të dobët. Mungesa e provave të matshme e dobëson thelbësisht pretendimin administrativ.
                </KeyPoint>
                <KeyPoint icon={<ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-blue-500"/>} title="Analiza e Tonit">
                    Toni i dokumentit është formal dhe tregon një distancim të ftohtë administrativ, në vend të një angazhimi për përmirësim. Në komunikimet standarde të Burimeve Njerëzore, një proces i tillë do të paraprihej nga takime, plane përmirësimi dhe feedback konstruktiv, elementë që mungojnë plotësisht këtu.
                </KeyPoint>
                 <KeyPoint icon={<BookOpenIcon className="w-5 h-5 text-indigo-500"/>} title="Retorika e Justifikimit Burokratik">
                    Struktura e letrës është një shembull klasik i justifikimit burokratik. Ajo i referohet neneve ligjore për të krijuar një fasadë legjitimiteti, ndërkohë që arsyeja thelbësore ("performanca e dobët") mbetet tërësisht e paargumentuar. Kjo është një teknikë retorike për të imponuar autoritet pa ofruar transparencë.
                </KeyPoint>
            </div>
        </section>


        <section className="mb-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Scorecard Analitik i Argumenteve</h2>
            <div className="space-y-5 max-w-lg mx-auto">
                {scorecardData.map(item => (
                    <ArgumentStrengthMeter 
                        key={item.metric} 
                        metric={item.metric}
                        labelA="Bashkia"
                        scoreA={item.beciScore}
                        colorA="#ef4444"
                        labelB="SHKRELI"
                        scoreB={item.shkreliScore}
                        colorB="#22c55e"
                    />
                ))}
            </div>
        </section>

        <section className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-6">Angazhimi Publik</h2>
            <CasePoll />
        </section>
        
        <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-300 dark:border-slate-700 pb-2">Analiza Etike dhe Filozofike</h2>
            <div className="space-y-5">
                <KeyPoint icon={<BookOpenIcon className="w-5 h-5 text-indigo-500"/>} title="Përplasja e Botëkuptimeve: Weber vs. Foucault">
                    Rasti ilustron tensionin midis burokracisë "racionale" të Max Weber-it (ku administrata vepron sipas rregullave pa emocione) dhe analizës së pushtetit të Michel Foucault (ku institucionet dhe rregullat përdoren si mjete për të disiplinuar dhe kontrolluar individët që nuk i përshtaten normës). A është ky një akt i pastër administrativ apo një ushtrim i pushtetit disiplinor?
                </KeyPoint>
                <KeyPoint icon={<UsersIcon className="w-5 h-5 text-teal-500"/>} title="Kontrata Sociale dhe Besimi Publik">
                    Në thelb të kontratës sociale qëndron besimi se institucionet publike do të veprojnë në mënyrë të drejtë dhe të paanshme. Kur një vendim administrativ perceptohet gjerësisht si i motivuar politikisht, ai gërryen këtë besim themelor, duke e larguar qytetarin nga shteti dhe duke forcuar idenë se "gjithçka është politike".
                </KeyPoint>
                 <KeyPoint icon={<ScaleIcon className="w-5 h-5 text-red-500"/>} title="Tirania e Subjektivitetit Administrativ">
                    Pa kritere të qarta, të matshme dhe transparente të performancës, vlerësimi i një punonjësi, veçanërisht në fushën e artit, mbetet thellësisht subjektiv. Ky subjektivitet hap derën për arbitraritet dhe abuzim, ku "performanca e dobët" bëhet një justifikim i përshtatshëm për të eliminuar zërat e padëshiruar.
                </KeyPoint>
            </div>
        </section>

        <section>
            <h2 className="text-2xl font-semibold mb-6 border-b border-slate-300 dark:border-slate-700 pb-2">{renderWithSuperscript('NOVARIC® AI-Powered News')}</h2>
            <div className="bg-blue-50 dark:bg-blue-900/40 p-6 rounded-lg shadow-inner">
                <KeyPoint icon={<ShieldCheckIcon className="w-5 h-5 text-blue-500"/>} title="Gjykim i Bazuar në Prova">
                    Bazuar në mungesën totale të provave publike nga ana e Bashkisë për të mbështetur pretendimin e performancës së dobët, karrierën e gjatë dhe të pa cënuar të Z. SHKRELI, dhe kontekstin e fortë politik, <strong>provat anojnë ndjeshëm drejt një shkarkimi të motivuar politikisht, të maskuar nën një mbulesë administrative.</strong> Ky rast ekspozon brishtësinë e institucioneve kulturore dhe profesionale përballë ndikimeve politike.
                </KeyPoint>
            </div>
        </section>

      </div>
    </main>
  );
};