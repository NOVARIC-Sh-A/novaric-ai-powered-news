import React from 'react';
import { JsonLd } from './JsonLd';
import { useSeo } from '../hooks/useSeo';
import { 
  ShieldCheckIcon, 
  GlobeAltIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ArrowPathIcon
} from './icons';

interface GdprPolicyPageProps {
  onBack: () => void;
}

export const GdprPolicyPage: React.FC<GdprPolicyPageProps> = ({ onBack }) => {
  const pageTitle = "Mbrojtja e të Dhënave Personale (GDPR) | NOVARIC® Group";
  const pageDescription = "Qëndrimi zyrtar i NOVARIC® Group mbi përputhshmërinë me Rregulloren (BE) 2016/679 (GDPR) dhe privatësinë e të dhënave.";
  
  useSeo(pageTitle, pageDescription, undefined, window.location.href);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": window.location.href,
    "publisher": {
      "@type": "Organization",
      "name": "NOVARIC® Group"
    },
    "mainEntity": {
      "@type": "Article",
      "headline": "GDPR Compliance and Data Protection",
      "articleSection": "Privacy Policy"
    }
  };

  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900">
      <JsonLd data={structuredData} />
      
      {/* FORMAL HEADER */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-20 pb-12 px-4 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
        <div className="container mx-auto max-w-3xl">
          <button 
            onClick={onBack}
            className="mb-8 inline-flex items-center text-blue-600 hover:underline font-bold uppercase tracking-widest text-[10px] transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" /> Kthehu te Pozicioni Korporativ
          </button>
          
          <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] block mb-2 font-mono">REGULATORY_COMPLIANCE_DOCUMENT</span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tighter">
            Përputhshmëria me <br/><span className="text-blue-600">GDPR</span>
          </h1>
          <p className="text-lg text-slate-500 mt-2 font-light italic">General Data Protection Regulation</p>
        </div>
      </header>

      {/* POLICY CONTENT */}
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl prose prose-slate dark:prose-invert max-w-none">
          
          <section className="mb-10">
            <p className="text-lg leading-relaxed text-justify">
              <strong>NOVARIC®</strong> është plotësisht e angazhuar për përputhshmërinë me <strong>Rregulloren (BE) 2016/679</strong> të Parlamentit Evropian dhe të Këshillit për mbrojtjen e personave fizikë në lidhje me përpunimin e të dhënave personale dhe për lëvizjen e lirë të këtyre të dhënave.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
               <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
               Qëndrimi ynë kryesor
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-justify leading-relaxed">
              Ne sigurojmë që të gjitha të dhënat personale të përpunuara nga NOVARIC® trajtohen me standardet më të larta të sigurisë, transparencës dhe integritetit. Sistemet tona janë projektuar me privatësi që në fillim (privacy by design), duke respektuar të drejtat dhe liritë themelore të individëve siç janë përcaktuar në Kartën e të Drejtave Themelore të Bashkimit Evropian.
            </p>
          </section>

          {/* LEGAL REFERENCE BOX */}
          <section className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800 my-12">
            <div className="flex gap-4 items-start">
              <InformationCircleIcon className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div className="space-y-4">
                <h4 className="text-blue-900 dark:text-blue-200 font-bold uppercase tracking-wide text-sm">Referenca Ligjore dhe Origjina</h4>
                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed italic">
                  Korniza aktuale GDPR shfuqizon dhe bazohet në themelet e vendosura nga <strong>Direktiva 95/46/EC</strong>. NOVARIC® ruan përputhshmëri të rreptë me këto pika referuese ligjore historike dhe aktuale të Bashkimit Evropian.
                </p>
                <a 
                  href="https://eur-lex.europa.eu/eli/dir/1995/46/oj" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md group no-underline"
                >
                  <GlobeAltIcon className="w-4 h-4" />
                  Official Journal of the EU - Directive 95/46/EC
                  <ArrowPathIcon className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                </a>
              </div>
            </div>
          </section>

          <section className="pt-10 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Për kërkesa të mëtejshme në lidhje me aktivitetet tona të përpunimit të të dhënave, ju lutemi kontaktoni ekipin tonë të pajtueshmërisë në 
              <a href="mailto:contact@novaric.co" className="ml-1 font-bold text-blue-600 hover:underline">contact@novaric.co</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="container mx-auto max-w-3xl px-4 py-20 text-center">
         <button 
            onClick={onBack}
            className="px-12 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-xl transition-all active:scale-95"
         >
            Vërtetuar &bull; Kthehu Pas
         </button>
      </footer>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </article>
  );
};
