

import React from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, FacebookIcon, InstagramIcon, LinkedInIcon } from './icons';
import { renderWithSuperscript } from '../utils/textUtils';

interface NovaricAcademyPageProps {
  onBack: () => void;
}

export const NovaricAcademyPage: React.FC<NovaricAcademyPageProps> = ({ onBack }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-xl text-slate-700 dark:text-slate-200">
        
        <header className="text-center mb-8">
          <img 
            src="https://novaricstorage.blob.core.windows.net/media/NOVARIC-Academy-Logo_11072024.jpg"
            alt="NOVARIC Academy Logo" 
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-academy-teal dark:text-academy-blue">NOVARIC<sup>®</sup> Academy</h1>
          <p className="text-xl mt-2 text-slate-600 dark:text-slate-400 italic">"Bridging Knowledge to Industry"</p>
        </header>

        <section className="mb-10">
          <img 
            src="https://novaricstorage.blob.core.windows.net/media/NOAVRIC-Academy_Kurse.jpg" 
            alt="Studentë të NOVARIC Academy gjatë një trajnimi praktik në Shkodër" 
            className="w-full h-auto rounded-lg shadow-lg mb-6"
          />
          <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Kursi Profesional: Guidë Turistike</h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            {renderWithSuperscript('Kjo javë i dedikohet ushtrimeve praktike dhe simulimeve reale që përgatisin pjesëmarrësit për sfidat e vërteta të industrisë së turizmit. NOVARIC® Academy beson se suksesi në turizëm vjen nga kombinimi i njohurive teorike me përvojën praktike.')}
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Programi ynë i guidave turistike është dizenjuar për t'i pajisur studentët me aftësitë e nevojshme për të shkëlqyer. Ne i nxjerrim studentët nga klasa dhe i fusim në mjediset reale ku do të punojnë, duke u mësuar atyre jo vetëm historinë dhe kulturën, por edhe artin e komunikimit, menaxhimin e grupeve dhe zgjidhjen e problemeve në kohë reale.
          </p>
        </section>

        <section className="mb-10 grid md:grid-cols-2 gap-8 items-center bg-slate-50 dark:bg-slate-900/40 p-6 rounded-lg">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Çfarë do të mësoni?</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Teknikat e guidimit dhe prezantimit publik.</li>
                    <li>Historia dhe trashëgimia kulturore e Shkodrës dhe Shqipërisë.</li>
                    <li>Menaxhimi i grupeve turistike dhe logjistika.</li>
                    <li>Komunikimi ndërkulturor dhe mikpritja.</li>
                    <li>Etika profesionale dhe standardet e industrisë.</li>
                    <li>Marketingu personal dhe ndërtimi i një karriere në turizëm.</li>
                </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-center mb-4 text-academy-teal">Na Kontaktoni</h3>
                <div className="space-y-3">
                    <p className="flex items-start"><MapPinIcon className="w-5 h-5 mr-3 mt-1 text-academy-teal flex-shrink-0"/><span>NOVARIC Building, Nd 2 H 6, Rruga Studenti, Shkodër 4001</span></p>
                    <p className="flex items-center"><PhoneIcon className="w-5 h-5 mr-3 text-academy-teal"/>+355 (0) 222 55 999</p>
                    <p className="flex items-center"><PhoneIcon className="w-5 h-5 mr-3 text-academy-teal"/>Cel: +355 (0) 6920 51475</p>
                    <p className="flex items-center"><EnvelopeIcon className="w-5 h-5 mr-3 text-academy-teal"/><a href="mailto:contact@novaric.edu.al" className="hover:underline break-all">contact@novaric.edu.al</a></p>
                </div>
                 <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 flex justify-center space-x-4">
                    <a href="https://www.facebook.com/novaricacademy" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors" aria-label="Facebook i NOVARIC Academy"><FacebookIcon className="w-6 h-6" /></a>
                    <a href="https://www.instagram.com/novaric.academy/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors" aria-label="Instagram i NOVARIC Academy"><InstagramIcon className="w-6 h-6" /></a>
                    <a href="https://www.linkedin.com/company/novaric-academy/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors" aria-label="LinkedIn i NOVARIC Academy"><LinkedInIcon className="w-6 h-6" /></a>
                 </div>
            </div>
        </section>
        
        <div className="mt-10 text-center">
          <button onClick={onBack} className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-md shadow-md transition">
            Kthehu Pas
          </button>
        </div>
      </div>
    </main>
  );
};