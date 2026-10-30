
import React from 'react';

interface MethodologyProps {
  onBack: () => void;
}

export const Methodology: React.FC<MethodologyProps> = ({ onBack }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary-700 dark:text-primary-500">Metodologjia e Punës</h1>
        <p className="text-center text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
          NOVARIC® angazhohet për transparencë dhe rigorozitet në të gjitha përmbajtjet që ofron. Kjo faqe shpjegon metodat që përdorim për verifikimin e fakteve të lajmeve dhe për analizën e të dhënave të profileve të personaliteteve publike.
        </p>

        {/* Section 1: Fact-Checking */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100">
            Metodologjia e Verifikimit të Fakteve (Fact-Checking)
          </h2>
          <p className="mb-4">
            Procesi ynë i verifikimit të fakteve kombinon fuqinë e inteligjencës artificiale me mbikëqyrjen dhe ekspertizën e domosdoshme njerëzore. Kjo qasje hibride siguron shpejtësi, efikasitet dhe saktësi.
          </p>
          <ol className="list-decimal list-inside space-y-4">
            <li className="pl-2">
              <strong className="font-semibold">Analiza Fillestare nga IA:</strong> Kur një përdorues paraqet një pretendim lajmi, ai dërgohet te modeli ynë i avancuar gjuhësor (Gemini). Modeli, duke përdorur mjetin e kërkimit Google Search, kryen një analizë të gjerë në ueb për të gjetur burime relevante, prova mbështetëse ose kundërshtuese.
            </li>
            <li className="pl-2">
              <strong className="font-semibold">Gjenerimi i Draft-Rezultatit:</strong> Bazuar në analizën e tij, modeli gjeneron një draft fillestar që përfshin:
              <ul className="list-disc list-inside mt-2 pl-6 space-y-1">
                <li>Një <strong>Verdikt</strong> paraprak (p.sh., "Kryesisht e Vërtetë", "Mashtruese").</li>
                <li>Një <strong>Përmbledhje</strong> shpjeguese që argumenton verdiktin.</li>
                <li>Një listë të <strong>Burimeve</strong> kryesore të uebit që ka përdorur për analizën.</li>
              </ul>
            </li>
            <li className="pl-2">
              <strong className="font-semibold">Rishikimi dhe Verifikimi Njerëzor (Hapi Kritik):</strong> Ky është hapi më i rëndësishëm. Drafti i gjeneruar nga IA nuk publikohet kurrë automatikisht. Ai i dërgohet ekipit tonë të gazetarëve dhe redaktorëve me përvojë. Ekipi ynë kryen veprimet e mëposhtme:
               <ul className="list-disc list-inside mt-2 pl-6 space-y-1">
                <li><strong>Verifikojnë Burimet:</strong> Vlerësojnë besueshmërinë dhe reputacionin e çdo burimi të cituar nga IA.</li>
                <li><strong>Kontekstualizojnë Informacionin:</strong> Shtojnë kontekstin e nevojshëm historik, politik ose social që IA mund të mos e ketë kuptuar plotësisht.</li>
                <li><strong>Vlerësojnë Nuancat:</strong> Analizojnë nëse pretendimi përmban nuanca, gjuhë manipulative ose nëse i mungon konteksti, gjëra që një sistem automatik mund t'i anashkalojë.</li>
                <li><strong>Miratimi Final:</strong> Vetëm pasi ekipi njerëzor është plotësisht i bindur për saktësinë dhe paanshmërinë e analizës, rezultati finalizohet dhe publikohet në platformë.</li>
              </ul>
            </li>
          </ol>
           <p className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg text-sm">
            <strong>Mohim Përgjegjësie:</strong> Ndonëse IA është një mjet i fuqishëm, vendimi final editorial dhe përgjegjësia për përmbajtjen e publikuar mbetet gjithmonë te ekipi ynë njerëzor.
          </p>
        </section>

        {/* Section 2: VIP Profiles */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100">
            Metodologjia e Analizës së Profileve VIP
          </h2>
          <p className="mb-4">
            Profilet e personaliteteve publike (VIP) janë hartuar për të ofruar një pasqyrë të përmbledhur dhe të bazuar në të dhëna publike. Të dhënat dhe grafikat synojnë të jenë informative dhe jo përfundimtare.
          </p>
          <ul className="space-y-4">
            <li>
              <strong className="font-semibold block">Burimet e Informacionit:</strong> Biografitë dhe të dhënat fillestare mblidhen nga burime të hapura dhe publike, duke përfshirë (por pa u kufizuar në) uebfaqet zyrtare institucionale, arkivat mediatike, deklaratat publike dhe biografitë e publikuara.
            </li>
            <li>
              <strong className="font-semibold block">Shpjegimi i Grafikëve:</strong>
              <ul className="list-disc list-inside mt-2 pl-6 space-y-2">
                <li><strong>Perceptimi Publik:</strong> Ky grafik paraqet një vlerësim të përgjithshëm të sentmentit publik dhe mediatik ndaj një personaliteti, bazuar në analizën e artikujve të lajmeve, editorialeve dhe diskutimeve publike. Ai mat raportin midis mbulimit pozitiv dhe negativ.</li>
                <li><strong>Performanca Profesionale:</strong> Vlerëson arritjet e matshme në karrierën e tyre profesionale, siç janë ligjet e miratuara, reformat e ndërmarra, sukseset në projektet që kanë menaxhuar, etj.</li>
                <li><strong>Aftësitë Reale (Zhvillimi Profesional):</strong> Ky grafik ilustron një ndarje të perceptuar të aftësive kyçe si lidershipi, komunikimi, ekspertiza në fushën përkatëse dhe etika profesionale, bazuar në veprimtarinë e tyre publike dhe profesionale.</li>
              </ul>
            </li>
             <li className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-800/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
               <strong className="font-semibold block mb-1">Votimet dhe Sondazhet e Përdoruesve:</strong>
               Vlen të theksohet se veçoritë e votimit (si shkalla Likert) dhe sondazhet e shpejta ("Miratoj / Nuk Miratoj") në çdo profil pasqyrojnë <strong>vetëm opinionin e audiencës së platformës sonë</strong> që zgjedh të marrë pjesë. Këto rezultate nuk janë sondazhe shkencore dhe nuk pretendojnë të jenë përfaqësuese të opinionit të të gjithë popullsisë. Ato shërbejnë si një barometër interaktiv i opinionit të përdoruesve tanë.
            </li>
          </ul>
        </section>

        <div className="mt-10 text-center">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-label="Kthehu Pas"
          >
            Kthehu Pas
          </button>
        </div>
      </div>
    </main>
  );
};
