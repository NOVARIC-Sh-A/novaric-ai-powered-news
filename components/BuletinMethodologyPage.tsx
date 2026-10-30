import React from 'react';

interface BuletinMethodologyPageProps {
  onBack: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-primary-500/30">{title}</h2>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-justify space-y-3">
            {children}
        </div>
    </section>
);

export const BuletinMethodologyPage: React.FC<BuletinMethodologyPageProps> = ({ onBack }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl">
        <div className="mb-6">
            <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition"
            >
                &larr; <span className="ml-2">Kthehu Pas</span>
            </button>
        </div>
        
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
            Metodologjia e Buletinit Investigativ
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
            Një Vështrim i Thelluar në Procesin Analitik të NOVARIC<sup>®</sup>
          </p>
        </header>

        <Section title="Hapi 1: Kërkimi i Përgjithshëm dhe Përsosja e Fokusit">
            <p>Procesi filloi me një kërkim të gjerë të literaturës akademike mbi sociologjinë dhe logjikën e korrupsionit. Më pas, fokusi u ngushtua për të gjetur burime që trajtojnë drejtpërdrejt korrupsionin brenda ekonomive post-komuniste dhe në tranzicion. Kjo na lejoi të përqendrohemi në kontekstin specifik relevant për analizën tonë.</p>
        </Section>

        <Section title="Hapi 2: Përcaktimi i Koncepteve Kyçe">
            <p>Fokusi u zhvendos te konceptet themelore. U dha përparësi analizave sociologjike si <strong>anomia</strong> dhe marrëdhëniet <strong>patron-klient</strong>, si dhe analizave logjike, veçanërisht analiza kosto-përfitim që individët përdorin kur mendojnë për korrupsionin. Qëllimi ishte ndërtimi i një themeli të fortë teorik për analizën e ardhshme.</p>
        </Section>
        
        <Section title="Hapi 3: Zgjerimi i Fushës dhe Kontekstualizimi për Shqipërinë">
            <p>Kërkimi u zgjerua për të përfshirë analiza specifike akademike të korrupsionit brenda Shqipërisë. Këto burime lokale u integruan me kornizat më të gjera teorike të anomisë, klientelizmit dhe teorisë së zgjedhjes racionale. Qëllimi ishte zhvillimi i një themeli të fortë analitik për artikullin e buletinit.</p>
        </Section>

        <Section title="Hapi 4: Eksplorimi i Disfunksioneve Sistemike">
            <p>Hulumtimi u thellua në literaturën akademike mbi anominë, klientelizmin dhe teorinë e zgjedhjes racionale brenda ekonomive post-komuniste. U fokusua në mënyrën se si këto koncepte shpjegojnë natyrën e rrënjosur thellë të korrupsionit në Shqipëri. U zbulua se ndërveprimi i këtyre faktorëve krijon një cikël vetë-përjetësues.</p>
        </Section>
        
        <Section title="Hapi 5: Analiza e Dinamikave të Korrupsionit">
            <p>Hapi tjetër ishte sintezimi i kërkimit. U zbulua se anomia dhe klientelizmi janë faktorë kyç. Korrupsioni lulëzon në Shqipërinë post-komuniste për shkak të këtyre faktorëve sociologjikë, duke u bërë një cikël vetë-përjetësues. Hapat e mëtejshëm ishin të detajonin se si kjo zbatohet në kontekstin shqiptar.</p>
        </Section>

        <Section title="Hapi 6: Hartëzimi i Kontekstit Shqiptar">
            <p>Njohuritë akademike u integruan me shembuj specifikë relevantë për Shqipërinë. Analiza lëvizi përtej kornizave teorike për të analizuar se si anomia, klientelizmi dhe zgjedhja racionale shfaqen brenda institucioneve dhe shoqërisë shqiptare. Kjo siguroi një analizë më të detajuar dhe të kontekstualizuar.</p>
        </Section>

        <Section title="Hapi 7: Zgjerimi i Kornizës Analitike">
            <p>Pas hyrjeve teorike, u eksploruan mekanizmat specifikë përmes të cilëve anomia dhe klientelizmi manifestohen në institucionet shqiptare, duke u bazuar në analiza të prokurimeve publike dhe proceseve gjyqësore. U fokusua në mënyrën se si këto faktorë kontribuojnë në llogaritjen e rrezikut të ulët/shpërblimit të lartë të korrupsionit.</p>
        </Section>

        <Section title="Hapi 8: Dekonstruktimi i Anomisë Post-Komuniste">
            <p>Fokusi u vendos në mënyrën se si anomia, si një kornizë sociologjike, lidhet drejtpërdrejt me rritjen e korrupsionit në Shqipëri. U eksploruan shembuj specifikë që tregojnë prishjen e normave post-komuniste. Qëllimi ishte të lidhej teoria e gjerë me realitetin konkret në terren, duke krijuar një themel të fortë analitik.</p>
        </Section>

        <Section title="Hapi 9: Sinteza Finale - Hartëzimi i Ekosistemit të Korrupsionit">
            <p>Në hapin final, njohuritë akademike u integruan plotësisht me shembuj specifikë. U fokusua në mekanizmat sociologjikë të anomisë, klientelizmit dhe zgjedhjes racionale, si dhe efektet e tyre në prokurimet publike dhe proceset gjyqësore të vendit. Kjo siguroi një analizë të detajuar të mënyrës se si operon korrupsioni brenda shoqërisë shqiptare, e cila më pas u paraqit në formën e buletinit.</p>
        </Section>

        <div className="mt-12 text-center">
            <button
                onClick={onBack}
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition"
                aria-label="Kthehu Pas"
            >
                &larr; Kthehu Pas
            </button>
        </div>
      </div>
    </main>
  );
};