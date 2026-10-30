import React from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
        <div className="mb-6">
            <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-primary-500"
                aria-label="Kthehu Pas"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5 7.5 12l7.5-7.5" />
                </svg>
                Kthehu Pas
            </button>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-center text-primary-700 dark:text-primary-500">POLITIKA E PRIVATËSISË</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-1">E vlefshme nga: 01/06/2025</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">Përditësuar më: 08/06/2025</p>

        <p className="mb-4">Kjo Politikë e Privatësisë përcakton mënyrën se si NOVARIC<sup>®</sup> Media House (“ne”, “kompania”, “NOVARIC”) mbledh, përdor, përpunon dhe mbron të dhënat personale të individëve që ndërveprojnë me platformat tona, përfshirë portalet e lajmeve, faqet zyrtare, rrjetet sociale, aplikacionet mobile, eventet publike, intervistat, fushatat mediatike dhe marrëdhëniet me publikun.</p>
        <p className="mb-6">Ne i përmbahemi rreptësisht ligjit shqiptar Nr. 9887, datë 10.3.2008 “Për mbrojtjen e të dhënave personale” dhe Rregullores së BE-së (GDPR) Nr. 2016/679 për mbrojtjen e privatësisë dhe lirisë së individëve në lidhje me përpunimin e të dhënave personale.</p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">1. KUSH JEMI NE</h2>
          <p className="mb-2">NOVARIC<sup>®</sup> Media House është një njësi strategjike brenda NOVARIC<sup>®</sup> Sh.A., e dedikuar për zhvillimin dhe shpërndarjen e përmbajtjes mediatike, multimediale dhe komunikimit të integruar për qëllime edukative, gazetareske, promovuese dhe strategjike në Shqipëri dhe rajonin e Ballkanit Perëndimor.</p>
          <p className="mb-1"><strong>Adresa:</strong> Nd. 2, H. 6, Rruga Studenti, Shkodër 4001, Shqipëri</p>
          <p className="mb-1"><strong>NIPT:</strong> M0211133E</p>
          <p className="mb-1"><strong>Email-e zyrtare:</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-4 mb-2">
            <li><a href="mailto:contact@media.novaric.al" className="text-primary-600 dark:text-primary-400 hover:underline">contact@media.novaric.al</a></li>
            <li><a href="mailto:editor@media.novaric.al" className="text-primary-600 dark:text-primary-400 hover:underline">editor@media.novaric.al</a></li>
            <li><a href="mailto:news-room@media.novaric.al" className="text-primary-600 dark:text-primary-400 hover:underline">news-room@media.novaric.al</a></li>
            <li><a href="mailto:press@media.novaric.al" className="text-primary-600 dark:text-primary-400 hover:underline">press@media.novaric.al</a></li>
            <li><a href="mailto:privacy@media.novaric.al" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@media.novaric.al</a></li>
          </ul>
          <p className="mb-1"><strong>Tel.:</strong> <a href="tel:+35522255999" className="text-primary-600 dark:text-primary-400 hover:underline">+355 (0) 222 55 999</a></p>
          <p className="mb-1"><strong>Cel.:</strong> <a href="tel:+355692051474" className="text-primary-600 dark:text-primary-400 hover:underline">+355 (0) 6920 51474</a></p>
          <p><strong>Website:</strong> <a href="https://novaric.al" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">https://novaric.al</a></p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">2. CILAT TË DHËNA MBLEDHIM</h2>
          <p className="mb-2">Ne mbledhim të dhëna të ndryshme personale, në varësi të mënyrës se si ndërveproni me ne:</p>
          <h3 className="text-xl font-medium mb-2 text-slate-700 dark:text-slate-300">2.1. Të dhëna që jepni drejtpërdrejt:</h3>
          <ul className="list-disc list-inside space-y-1 pl-4 mb-3">
            <li>Emër, mbiemër, gjini, datëlindje</li>
            <li>Email, numër telefoni, adresë fizike</li>
            <li>CV, përvojë profesionale, certifikata</li>
            <li>Preferenca gjuhësore, interesat mediatike</li>
            <li>Informacion për pjesëmarrje në evente ose intervista</li>
          </ul>
          <h3 className="text-xl font-medium mb-2 text-slate-700 dark:text-slate-300">2.2. Të dhëna që mbledhim automatikisht:</h3>
          <ul className="list-disc list-inside space-y-1 pl-4 mb-3">
            <li>IP address, ID e pajisjes, sistemi operativ</li>
            <li>Të dhëna shfletimi, kohëzgjatje vizite, klikime</li>
            <li>Analiza mbi ndërveprimin në rrjete sociale</li>
            <li>Vendndodhje gjeografike (kur lejohet)</li>
          </ul>
          <h3 className="text-xl font-medium mb-2 text-slate-700 dark:text-slate-300">2.3. Të dhëna nga burime të treta:</h3>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Rrjete sociale kur ndërveproni me ne (p.sh. Meta, LinkedIn, Instagram, TikTok)</li>
            <li>Partnerë mediatikë ose agjenci kërkimore</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">3. QËLLIMET E PËRDORIMIT TË TË DHËNAVE</h2>
          <p className="mb-2">Të dhënat përpunohen për qëllime të ligjshme si më poshtë:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Publikim lajmesh dhe intervistash (me pëlqimin tuaj)</li>
            <li>Menaxhimi i kontakteve me median dhe personalitete publike</li>
            <li>Promovimi i turizmit dhe kulturës përmes fushatave multimediale</li>
            <li>Dërgimi i buletineve, njoftimeve për shtyp dhe eventeve</li>
            <li>Analiza të trafikut për përmirësim përmbajtjeje</li>
            <li>Trajtimi i ankesave, kërkesave për informacion ose korrigjime</li>
            <li>Për qëllime edukative, kërkimore ose arkivore (me justifikim publik)</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">4. BAZAT LIGJORE TË PËRPUNIMIT</h2>
          <p className="mb-2">Ne përpunojmë të dhënat bazuar në një ose më shumë nga bazat e mëposhtme:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Pëlqimi i shprehur nga ju</li>
            <li>Marrëveshje kontraktuale ose bashkëpunimi</li>
            <li>Interes legjitim për publikim, transparencë dhe raportim</li>
            <li>Detyrime ligjore në fushën e medias dhe transparencës publike</li>
            <li>Mbrojtja e interesave thelbësore (p.sh. siguria publike, ndihma në raste emergjente)</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">5. PUBLIKIMI I TË DHËNAVE NË MEDIA</h2>
          <p className="mb-2">Në përmbushje të funksionit tonë si institucion mediatik dhe edukues:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Të dhënat që bëhen publike nga subjektet e interesit publik mund të përpunohen, verifikohen dhe botohen sipas Kodit të Etikës së Gazetarisë dhe standardeve të NOVARIC<sup>®</sup>.</li>
            <li>Publikimet bëhen gjithmonë në përputhje me të drejtën për informim, interesin publik, balancimin e privatësisë dhe transparencës.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">6. ME KË NDAJMË TË DHËNAT</h2>
          <p className="mb-2">Ne mund të ndajmë të dhëna me:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Redaktorët tanë të brendshëm dhe bashkëpunëtorët freelance</li>
            <li>Partnerë për promovim kulturor, turistik dhe institucional</li>
            <li>Ofrues shërbimesh të analizës së të dhënave, marketingut ose IT-së</li>
            <li>Autoritete publike ose gjyqësore, kur kjo kërkohet me ligj</li>
          </ul>
          <p className="mt-2">Të gjitha palët e treta lidhen me marrëveshje konfidencialiteti dhe përpunimi të të dhënave (DPA).</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">7. TRANSFERIME NDËRKOMBËTARE</h2>
          <p className="mb-2">Nëse të dhënat tuaja përpunohen jashtë Shqipërisë ose BE-së (p.sh. për ruajtje cloud ose fushata globale), ne:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Sigurojmë që vendet e pranimit të kenë standarde të larta mbrojtjeje</li>
            <li>Zbatojmë klauzola kontraktuale standarde (SCCs) të miratuara nga BE</li>
            <li>Kërkojmë pëlqim të qartë kur kërkohet nga ligji</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">8. SA KOHË I RUAJMË TË DHËNAT</h2>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Deri në 12 muaj për të dhëna kontakti dhe analitike</li>
            <li>Deri në 10 vite për përmbajtje të arkivuar dhe dokumentacion ligjor</li>
            <li>Deri në tërheqjen e pëlqimit për fushata marketingu</li>
            <li>Përdoruesit e platformave digjitale mund të kërkojnë fshirjen në çdo kohë</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">9. TË DREJTAT TUAJA</h2>
          <p className="mb-2">Ju keni të drejtë të:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Merrni kopje të të dhënave tuaja (e drejta për qasje)</li>
            <li>Kërkoni korrigjimin ose fshirjen (e drejta për të harruar)</li>
            <li>Kufizoni përpunimin ose kundërshtoni përdorimin për marketing</li>
            <li>Tërhiqni pëlqimin në çdo moment</li>
            <li>Kërkoni transparencë për ndarjen e të dhënave me palët e treta</li>
            <li>Ankoheni pranë Komisionerit për Mbrojtjen e të Dhënave Personale në Shqipëri</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">10. SIGURIA E TË DHËNAVE</h2>
          <p className="mb-2">Ne zbatojmë masa teknike dhe organizative si:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Serverë të mbrojtur dhe kriptim HTTPS</li>
            <li>Politika strikte aksesimi për personelin</li>
            <li>Auditime të rregullta për sistemet IT dhe cloud</li>
            <li>Ndërgjegjësim dhe trajnime për stafin mbi privatësinë</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">11. COOKIES DHE MJETE GJURMIMI</h2>
          <p className="mb-2">NOVARIC përdor cookies për:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Personalizim përmbajtjeje</li>
            <li>Matje të angazhimit dhe statistikave të lexuesve</li>
            <li>Përmirësim të përvojës së përdoruesit</li>
            <li>Shënjestrim të fushatave reklamuese</li>
          </ul>
          <p className="mt-2">Ju mund të menaxhoni preferencat tuaja përmes njoftimit të cookies në faqen tonë.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">12. TË MITURIT</h2>
          <p>Nuk mbledhim me vetëdije të dhëna nga individë nën moshën 16 vjeç pa pëlqimin e verifikuar të prindërve. Nëse vërejmë raste të tilla, do të ndërmarrim fshirjen e menjëhershme të informacionit.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">13. PËRDITËSIMI I KËSAJ POLITIKE</h2>
          <p>Kjo politikë përditësohet periodikisht për të reflektuar ndryshime në legjislacion, teknologji ose praktikat tona. Versionet e mëparshme ruhen për transparencë.</p>
          <p className="mt-2">Data e fundit e përditësimit: 08/06/2025</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">KONTAKT</h2>
          <p className="mb-2">Për pyetje, komente, kërkesa ose ankesa në lidhje me këtë Politikë të Privatësisë, lutemi na kontaktoni:</p>
          <p className="font-medium">Zyrtari për Mbrojtjen e të Dhënave në NOVARIC<sup>®</sup> Media House</p>
          <p><strong>Email:</strong> <a href="mailto:privacy@media.novaric.al" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@media.novaric.al</a></p>
          <p><strong>Cel.:</strong> <a href="tel:+355692051474" className="text-primary-600 dark:text-primary-400 hover:underline">+355 6920 51474</a></p>
        </section>

      </div>
    </main>
  );
};
