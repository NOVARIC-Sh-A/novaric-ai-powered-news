import React from 'react';
import { DocumentTextIcon, EyeIcon, DownloadIcon } from './icons';

interface EuCodeOfConductPageProps {
  onBack: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-normal text-white mb-4 pb-2 border-b-2" style={{ borderColor: 'var(--eu-primary)' }}>
      {title}
    </h2>
    <div className="space-y-4 text-slate-300 leading-relaxed text-justify">
      {children}
    </div>
  </section>
);

const DocumentRow: React.FC<{ date: string; title: string; lang: string; size: string; url: string; }> = ({ date, title, lang, size, url }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-800/60 rounded-lg border border-slate-700 hover:bg-slate-700/60 transition-colors">
        <p className="text-xs font-semibold text-slate-400">{date}</p>
        <h3 className="font-semibold text-base text-white mt-1">{title}</h3>
        <div className="flex flex-wrap items-center justify-between mt-3 text-sm">
            <div className="flex items-center text-slate-300">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                <span>{lang} ({size})</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="flex items-center text-blue-400 hover:underline"><EyeIcon className="w-4 h-4 mr-1"/> Preview</span>
                <span className="flex items-center text-blue-400 hover:underline"><DownloadIcon className="w-4 h-4 mr-1"/> Download</span>
            </div>
        </div>
    </a>
);

const RelatedLink: React.FC<{ text: string; url: string; }> = ({ text, url }) => (
    <li>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">
            {text}
        </a>
    </li>
);

export const EuCodeOfConductPage: React.FC<EuCodeOfConductPageProps> = ({ onBack }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8" style={{ fontFamily: 'Arial, sans-serif' }}>
      <style>{`:root { --eu-primary: #0E47CB; --eu-secondary: #FBC02D; }`}</style>
      <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-2xl border border-slate-700">
        <div className="mb-8">
          <button onClick={onBack} className="inline-flex items-center px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 font-semibold rounded-md shadow-sm transition text-white">
            &larr; <span className="ml-2">Kthehu Pas</span>
          </button>
        </div>

        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-normal text-white mb-4">
            Code of Conduct for the Members of the European Commission
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            Members of the Commission are required to follow rules regarding ethics and integrity.
          </p>
        </header>
        
        <Section title="Ethics and integrity for Commissioners">
            <p>The European Union Treaties provide that the independence of Members of the European Commission must be beyond doubt, and that Commissioners must behave with integrity and discretion throughout and after the end of their term of office.</p>
            <p>The Treaty on the Functioning of the European Union develops these principles further.</p>
        </Section>

        <Section title="Code of Conduct for the Members of the European Commission">
            <p>The Code of Conduct sets out how European Commissioners need to apply their obligations of independence and integrity in practice.</p>
            <p>The Commission put the first such code in place in 1999. The latest and most comprehensive version came into force on 1 February 2018.</p>
        </Section>
        
        <Section title="Declarations of interests">
            <p>A main feature is the publication of declarations of interests. In these declarations, individual Commission Members are obliged to declare any positions held in the last ten years, their financial interests which could give rise to a conflict of interest and their membership of bodies intended to influence the exercise of public functions.</p>
        </Section>
        
        <Section title="Transparency">
            <p>Those declarations are only one aspect of the Commission's drive for greater transparency. The Commission also leads by example by publishing information on the meetings held between Commissioners and interest representatives as well as the costs of Commissioners' individual business travel.</p>
        </Section>
        
        <Section title="Annual reports">
            <div className="space-y-4">
                <DocumentRow date="11 MARCH 2025" title="Annual Report on the Application of the Code of Conduct in 2024" lang="English" size="269.04 KB - PDF" url="#" />
                <DocumentRow date="17 APRIL 2024" title="Annual Report on the Application of the Code of Conduct in 2023" lang="English" size="269.37 KB - PDF" url="#" />
                <DocumentRow date="18 APRIL 2023" title="Annual Report on the Application of the Code of Conduct in 2022" lang="English" size="250.51 KB - PDF" url="#" />
                <DocumentRow date="31 MAY 2022" title="Annual Report on the Application of the Code of Conduct in 2021" lang="English" size="395.82 KB - PDF" url="#" />
            </div>
        </Section>

        <Section title="Documents">
             <div className="space-y-4">
                <DocumentRow date="15 MAY 2024" title="Agreement establishing an interinstitutional body for ethical standards for members of institutions and advisory bodies" lang="English" size="219.92 KB - PDF" url="#" />
                <DocumentRow date="24 JANUARY 2024" title="Guidelines on ethical standards for the participation of the Members of the European Commission in the election campaign to the European Parliament" lang="English" size="204.45 KB - PDF" url="#" />
            </div>
        </Section>

        <Section title="Related links">
            <ul className="space-y-2 list-disc list-inside">
                <RelatedLink text="Article 17 of the Treaty on European Union" url="#" />
                <RelatedLink text="Article 245 of the Treaty on the Functioning of the European Union" url="#" />
                <RelatedLink text="Transparency Register" url="#" />
            </ul>
        </Section>
      </div>
    </main>
  );
};