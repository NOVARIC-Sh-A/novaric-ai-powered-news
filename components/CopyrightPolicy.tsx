
import React from 'react';

interface CopyrightPolicyProps {
  onBack: () => void;
}

export const CopyrightPolicy: React.FC<CopyrightPolicyProps> = ({ onBack }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary-700 dark:text-primary-500">Njoftim për Cenimin e të Drejtave të Autorit</h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-1">E vlefshme nga: 01/06/2025</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">Përditësuar më: 08/06/2025</p>

        <section className="mb-6">
          <p>Në përputhje me Direktivën për të Drejtën e Autorit në Tregun e Vetëm Dixhital (BE), NOVARIC<sup>®</sup> ka caktuar një Anëtar të Ekipit të Mediave Sociale për të marrë njoftime për cenime të pretenduara të të drejtave të autorit që ndodhin në domain-in novaric.co. Nëse besoni se puna juaj e mbrojtur nga e drejta e autorit po cenohet, njoftoni Anëtarin tonë të caktuar të SMT (Admin) të specifikuar më poshtë.</p>
          <p className="mt-2">Ju lutemi vini re, ky administrator është për raportimin e cenimit të të drejtave të autorit dhe nuk është personi i duhur për t'iu përgjigjur kërkesave për leje të së drejtës së autorit.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">Personi i Caktuar për Kontakt</h2>
          <p className="font-medium">Znj. Iris DULI</p>
          <p>NOVARIC<sup>®</sup> Sh.A. Ligjore, Politika, Rreziku dhe Pajtueshmëria.</p>
          <p>Adresa e regjistruar:</p>
          <address className="not-italic mt-1 border-l-4 border-primary-500 pl-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-md">
            NOVARIC Building,<br />
            Nd. 2, H.6,<br />
            Rruga Studenti,<br />
            Shkodër 4001,<br />
            Shqipëri.
          </address>
          <p className="mt-3"><strong>Email:</strong> social.media@novaric.co</p>
          <p><strong>Tel:</strong> +355 222 55 999</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-100">Kërkesat për Njoftimin e Cenimit</h2>
          <p>Direktiva për të Drejtën e Autorit në Tregun e Vetëm Dixhital (BE) kërkon që të gjitha pretendimet për cenim duhet të jenë me shkrim dhe duhet të përfshijnë informacionin e mëposhtëm:</p>
          <ul className="list-disc list-inside space-y-2 pl-4 mt-3">
            <li>Një nënshkrim fizik ose elektronik i pronarit të së drejtës së autorit ose personit të autorizuar të veprojë në emër të tij;</li>
            <li>Një përshkrim i punës së mbrojtur nga e drejta e autorit që pretendohet se është cenuar;</li>
            <li>Një përshkrim i materialit cenues dhe informacion i mjaftueshëm në mënyrë të arsyeshme për të lejuar NOVARIC<sup>®</sup> të lokalizojë materialin;</li>
            <li>Informacioni juaj i kontaktit, duke përfshirë adresën tuaj, numrin e telefonit dhe email-in;</li>
            <li>Një deklaratë nga ana juaj se keni një besim të mirë se përdorimi i materialit në mënyrën e ankuar nuk është i autorizuar nga pronari i së drejtës së autorit, agjenti i tij ose ligji; dhe</li>
            <li>Një deklaratë se informacioni në njoftim është i saktë, dhe, nën dënimet dhe ndëshkimet e dëshmisë së rreme, se jeni i autorizuar të veproni në emër të pronarit të së drejtës së autorit.</li>
          </ul>
        </section>
        
        <div className="mt-8 text-center">
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
