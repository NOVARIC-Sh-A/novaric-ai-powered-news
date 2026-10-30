import React from 'react';

interface ObjectiveAnalysisFrameworkPageProps {
  onBack: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-10">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b border-primary-500/30">{title}</h2>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            {children}
        </div>
    </section>
);

const Table: React.FC<{ headers: string[]; data: (string | React.ReactElement)[][]; }> = ({ headers, data }) => (
    <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                    {headers.map(header => (
                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4 whitespace-normal text-sm">{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const ObjectiveAnalysisFrameworkPage: React.FC<ObjectiveAnalysisFrameworkPageProps> = ({ onBack }) => {
    
    const scorecardData = [
        ['Transparenca', 'Disponueshmëria e vlerësimeve të brendshme', '❌ Asnjë dosje performance nuk u publikua'],
        ['Procesi i Rregullt Ligjor', 'Përputhshmëria ligjore me procedurat e seancës dëgjimore', '✅ Letra ndjek procesin e rregullt por i mungon substanca'],
        ['Proporcionaliteti', 'Ashpërsia e veprimit vs. provat e paraqitura', '❌ Përfundimi i marrëdhënies së punës duket disproporcional me justifikimin'],
        ['Mos-diskriminimi', 'Paanshmëria pavarësisht lidhjeve politike', '❌ Bashkëshortja është në opozitë; konflikti i interesit i mundshëm'],
        ['Kujdestaria Kulturore', 'Mbështetje për profesionistët e kulturës', '❌ Aktor kyç shkarkohet pa kontributin e komunitetit artistik'],
    ];

    const integrityAssessmentData = [
        ['Autonomia artistike e respektuar', '❌ Asnjë konsultim me Teatrin "Migjeni"'],
        ['Historiku në çështjet kulturore', '⚠️ Mungon një politikë e publikuar për mbrojtjen e kulturës'],
        ['Roli i shoqërisë civile', '❌ Asnjë deklaratë nga sindikatat apo organet artistike'],
        ['Mbrojtja nga politizimi', '❌ Mungojnë ose janë joaktive'],
    ];

    const deficiencyProfileData = [
        ['Legaliteti Procedural', <span key="1">⚠️ I Pjesshëm</span>, 'Procesi u ndoq, por i mungon baza provuese'],
        ['Transparenca e Provave', <span key="2">❌ Mungon</span>, 'Asnjë vlerësim publik i performancës apo paralajmërime të mëparshme'],
        ['Konflikti i Interesit', <span key="3">❌ I Pranishëm</span>, 'Roli opozitar i bashkëshortes mund të ketë ndikuar në vendimmarrje'],
        ['Mbikëqyrja Institucionale', <span key="4">❌ E Dobët</span>, 'Asnjë ndërhyrje nga sindikatat kulturore apo avokati i popullit'],
        // FIX: Corrected typo "zyrtale" to "zyrtare"
        ['Etika e Komunikimit', <span key="5">⚠️ E Dobët</span>, 'Letra zyrtare përdor gjuhë të paqartë dhe subjektive'],
        ['Legjitimiteti Publik', <span key="6">❌ I Dëmtuar</span>, 'Mbështetja masive për Shkrelin minon besimin tek autoriteti'],
    ];

    return (
        <main className="flex-grow container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
                <div className="mb-6">
                    <button onClick={onBack} className="inline-flex items-center px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition">
                        &larr; <span className="ml-2">Kthehu Pas</span>
                    </button>
                </div>
                
                <header className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-500">Kornizë Inovative për Analizë Objektive</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">Një Metodologji e Aplikuar në Rastin SHKRELI vs. BECI</p>
                </header>

                <Section title="1. Tabela e Llogaridhënies së Qeverisjes">
                    <p>Vlerësoni administratën e Benet Becit kundrejt parimeve të qeverisjes:</p>
                    <Table headers={['Parimi', 'Treguesi', 'Vëzhgim']} data={scorecardData.map(row => row.map((cell, index) => <span key={index}>{cell}</span>))} />
                </Section>

                <Section title="2. Hartëzimi i Pushtetit dhe Ndikimit">
                    <p>Ndërtoni një hartë të pushtetit social që tregon:</p>
                    <ul>
                        <li><strong>Hierarkia formale:</strong> Kryetar Bashkie → Drejtor Departamenti → Trupa Artistike</li>
                        <li><strong>Ndikimi informal:</strong> Lidhjet partiake, mbështetja publike, profili politik i bashkëshortes</li>
                        <li><strong>Sentimenti publik:</strong> Grafik ose hartë nxehtësie e reagimeve në mediat sociale</li>
                    </ul>
                    <p>Kjo i lejon përdoruesit të vizualizojnë se si vendimmarrja ndikohet nga rrjetet përtej roleve formale.</p>
                </Section>

                <Section title="3. Vlerësimi i Integritetit të Institucionit Kulturor">
                    <p>Në vend që ta trajtoni këtë si një mosmarrëveshje të burimeve njerëzore, ri-kornizojeni si një test të autonomisë së institucionit:</p>
                    <Table headers={['Metrika', 'Vëzhgimi']} data={integrityAssessmentData.map(row => row.map((cell, index) => <span key={index}>{cell}</span>))} />
                    <p>Përdoreni këtë për të vënë në dyshim dobësinë strukturore të institucioneve kulturore nën kontrollin politik.</p>
                </Section>

                <Section title="4. Analiza e Diskursit Narrativ">
                    <p>Aplikoni analizë gjuhësore dhe të kornizimit në letrën zyrtare:</p>
                    <ul>
                        <li><strong>Kornizimi pasiv:</strong> "...për arsye të mungesës së efikasitetit..." (shumë e paqartë).</li>
                        <li><strong>Mungesa e metrikave:</strong> Asnjë KPI, asnjë standard i dokumentuar apo transparencë procesi.</li>
                        <li><strong>Analiza e tonit:</strong> Formulimi tregon më shumë një distancim administrativ sesa një angazhim për drejtësi apo përmirësim.</li>
                    </ul>
                </Section>

                <Section title="5. Skenarët Kundërfaktualë">
                    <p>Shtroni pyetjen: "Po sikur ky të mos ishte Simon Shkrela, por një punonjës tjetër kulturor pa lidhje politike?"</p>
                    <p>Përdorni këtë modelim kundërfaktual për të vlerësuar:</p>
                    <ul>
                        <li>A do të ndodhte ende largimi nga puna?</li>
                        <li>A do të kishte vëmendje mediatike?</li>
                        <li>A do të mungonin ende dosjet e performancës?</li>
                    </ul>
                    <p>Kjo teston konsistencën e sjelljes së qeverisjes, duke ekspozuar nëse faktorët politikë apo personalë po ndikojnë në rezultate.</p>
                </Section>

                <Section title="🧩 Sinteza: Ndërtimi i Profilit të Mangësive të Autoritetit">
                    <Table headers={['Tipi i Mangësisë', 'Vërejtur në Rast?', 'Manifestimi']} data={deficiencyProfileData} />
                </Section>

                <Section title="🧠 Konkluzion: Nga Legalizmi te Legjitimiteti">
                    <p>Ky model shkon përtej dualitetit e drejtë apo e gabuar dhe ofron një diagnozë në nivel sistemi. Ai e lejon publikun të shohë se ku është thyerja — jo vetëm ligjërisht, por edhe etikish, kulturalisht dhe institucionalisht.</p>
                </Section>
            </div>
        </main>
    );
};