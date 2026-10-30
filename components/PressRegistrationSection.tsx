// components/PressRegistrationSection.tsx
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Building2, 
  FileText, 
  Mail, 
  Phone, 
  Globe, 
  Scale, 
  Printer,
  Calendar,
  UserCheck
} from 'lucide-react';

export const MaltaCoatOfArms: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg 
    viewBox="0 0 100 120" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Emblema e Republikës së Maltës"
  >
    {/* Mural Crown at Top */}
    <path 
      d="M30 20 L30 12 L36 12 L36 16 L44 16 L44 12 L50 12 L50 16 L56 16 L56 12 L64 12 L64 16 L70 16 L70 20 Z" 
      fill="#D97706" 
      stroke="#78350F" 
      strokeWidth="1.2"
    />
    <rect x="33" y="19" width="34" height="4" fill="#B45309" stroke="#78350F" strokeWidth="0.8" />
    <circle cx="40" cy="21" r="1" fill="#FEF3C7" />
    <circle cx="50" cy="21" r="1" fill="#FEF3C7" />
    <circle cx="60" cy="21" r="1" fill="#FEF3C7" />

    {/* Shield Base Shape */}
    <path 
      d="M30 23 L70 23 L70 65 Q70 95 50 105 Q30 95 30 65 Z" 
      fill="#FFFFFF" 
      stroke="#1E293B" 
      strokeWidth="2"
    />

    {/* Right Half Red (Gules) */}
    <path 
      d="M50 23 L70 23 L70 65 Q70 95 50 105 Z" 
      fill="#DC2626" 
    />

    {/* George Cross in Canton (Top Left) */}
    <g transform="translate(34, 27) scale(0.6)">
      <rect x="6" y="0" width="8" height="20" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
      <rect x="0" y="6" width="20" height="8" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
      <circle cx="10" cy="10" r="3" fill="#DC2626" />
      <circle cx="10" cy="10" r="1.5" fill="#FFFFFF" />
    </g>

    {/* Olive & Palm Branches wreath */}
    <path 
      d="M26 40 Q18 65 25 90 Q35 105 48 112" 
      stroke="#15803D" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      fill="none"
    />
    <path 
      d="M74 40 Q82 65 75 90 Q65 105 52 112" 
      stroke="#16A34A" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      fill="none"
    />

    {/* Ribbon at base */}
    <path 
      d="M40 110 Q50 106 60 110 Q55 116 50 114 Q45 116 40 110 Z" 
      fill="#F8FAFC" 
      stroke="#475569" 
      strokeWidth="1"
    />
  </svg>
);

export const PressRegistrationSection: React.FC = () => {
  const [copiedRef, setCopiedRef] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText('OPM PRESS 03/2025');
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="mt-12 pt-8 border-t-2 border-slate-200 dark:border-slate-700">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Bashkimi Evropian // Shteti i Maltës</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Regjistrimi Ligjor i Medias & Portalit Online
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Akt zyrtar i lëshuar nga <strong>Office of the Press Registrar</strong> (Zyra e Kryeministrit, Malta) për certifikimin e kryeredaktorit dhe regjistrimin zyrtar të portalit online <strong>MEDIA.NOVARIC.AL</strong> në përputhje me legjislacionin evropian mbi median.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyRef}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg border border-slate-300 dark:border-slate-600 transition"
            title="Kopjo numrin e referencës"
          >
            {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedRef ? 'U kopjua!' : 'OPM PRESS 03/2025'}</span>
          </button>

          <a
            href="https://media.novaric.al/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>media.novaric.al</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition"
            title="Printo ose ruaj në PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Printo / Ruaj</span>
          </button>
        </div>
      </div>

      {/* QUICK HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/70">
          <div className="text-[11px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Autoriteti Rregullator</span>
          </div>
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Office of the Press Registrar
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Office of the Prime Minister, Malta
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/70">
          <div className="text-[11px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-500" />
            <span>Referenca Zyrtare</span>
          </div>
          <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
            OPM PRESS 03/2025
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Regjistrim Aktiv në BE</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/70">
          <div className="text-[11px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold mb-1 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-violet-500" />
            <span>Kryeredaktori i Regjistruar</span>
          </div>
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Alban Thika
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Editor, MEDIA.NOVARIC.AL
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/70">
          <div className="text-[11px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Data Efektive</span>
          </div>
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            11 Qershor 2025
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Lëshuar më: 15 Korrik 2025
          </div>
        </div>
      </div>

      {/* TWO COLUMNS: DETAILS TABLE & FACSIMILE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INSTITUTIONAL DETAILS TABLE (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary-500" />
              <span>Specifikimet Ligjore të Regjistrimit</span>
            </h3>

            <dl className="space-y-3.5 text-xs">
              <div>
                <dt className="text-slate-400 dark:text-slate-500 font-mono uppercase text-[10px]">Autoriteti Publik</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  Office of the Press Registrar / Uffiċċju tar-Reġistratur tal-Istampa
                </dd>
                <dd className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Department of Information, Office of the Prime Minister (OPM), Malta
                </dd>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <dt className="text-slate-400 dark:text-slate-500 font-mono uppercase text-[10px]">Numri i Referencës</dt>
                <dd className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5 text-sm">
                  OPM PRESS 03/2025
                </dd>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <dt className="text-slate-400 dark:text-slate-500 font-mono uppercase text-[10px]">Portali Online i Regjistruar</dt>
                <dd className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1.5">
                  <span>MEDIA.NOVARIC.AL</span>
                  <a 
                    href="https://media.novaric.al/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    title="Hap faqen zyrtare"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </dd>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <dt className="text-slate-400 dark:text-slate-500 font-mono uppercase text-[10px]">Roli Ligjor / Kryeredaktor</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  Alban Thika (Editor of the online portal)
                </dd>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <dt className="text-slate-400 dark:text-slate-500 font-mono uppercase text-[10px]">Adresa e Regjistruar</dt>
                <dd className="text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed font-sans">
                  6 Hyacinth Crt, Fl 2, Triq Tumas Dingli, Birkirkara, BKR 1693, Malta
                </dd>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <dt className="text-slate-400 dark:text-slate-500 font-mono uppercase text-[10px]">Nënshkruar Nga</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  Roderick Caruana
                </dd>
                <dd className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Director of Information, Department of Information, Malta
                </dd>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <dt className="text-slate-400 dark:text-slate-500 font-mono uppercase text-[10px]">Autoritetet Ligjore të Notifikuara (cc)</dt>
                <dd className="mt-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Attorney General (Prokurori i Përgjithshëm)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>State Advocate (Avokati i Shtetit)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Commissioner of Police (Komisari i Policisë)</span>
                  </div>
                </dd>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <dt className="text-slate-400 dark:text-slate-500 font-mono uppercase text-[10px]">Verifikimi Institucional & Kontaktet</dt>
                <dd className="mt-1 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>3, Castille Place, Valletta VLT 1062, Malta</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>+(356) 2200 1700</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <a href="mailto:pressregistry.doi@gov.mt" className="text-blue-600 dark:text-blue-400 hover:underline">
                      pressregistry.doi@gov.mt
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <a 
                      href="https://www.doi.gov.mt" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>www.doi.gov.mt</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </dd>
              </div>
            </dl>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900 dark:text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Transparenca dhe Integriteti Gazetarsk</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Ky regjistrim zyrtar garanton përgjegjësinë ligjore dhe editoriale të NOVARIC® Media House në hapësirën evropiane, duke mbështetur pavarësinë gazetareske, mbrojtjen e burimeve dhe standardet më të larta të verifikimit të fakteve përmes Inteligjencës Artificiale.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: DIGITAL OFFICIAL FACSIMILE (7 COLS) */}
        <div className="lg:col-span-7">
          <div className="relative bg-gradient-to-b from-amber-50/20 via-white to-slate-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 sm:p-10 rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-700 font-serif text-slate-800 dark:text-slate-200">
            
            {/* Watermark effect */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10 pointer-events-none">
              <MaltaCoatOfArms className="w-72 h-72" />
            </div>

            {/* LETTERHEAD HEADER */}
            <div className="relative z-10 text-center pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-center mb-2">
                <MaltaCoatOfArms className="w-16 h-16 sm:w-20 sm:h-20" />
              </div>
              <div className="text-xs sm:text-sm font-bold tracking-wider text-slate-900 dark:text-slate-100">
                MALTA
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3 text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-sans uppercase font-bold tracking-tight">
                <div className="text-left border-r border-slate-200 dark:border-slate-700 pr-2">
                  <div>UFFIĊĊJU TAR-</div>
                  <div>REĠISTRATUR TAL-ISTAMPA</div>
                  <div className="mt-2 text-[9px] text-slate-400 dark:text-slate-500 font-mono">IR-REĠISTRATUR</div>
                </div>
                <div className="text-right pl-2">
                  <div>OFFICE OF THE</div>
                  <div>PRESS REGISTRAR</div>
                  <div className="mt-2 text-[9px] text-slate-400 dark:text-slate-500 font-mono">THE REGISTRAR</div>
                </div>
              </div>
            </div>

            {/* LETTER REFERENCE & DATE */}
            <div className="relative z-10 pt-6 flex justify-between items-start text-xs sm:text-sm font-sans">
              <div>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Our Reference: </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">OPM PRESS 03/2025</span>
              </div>
              <div className="text-right font-medium text-slate-700 dark:text-slate-300">
                15<sup>th</sup> July 2025
              </div>
            </div>

            {/* RECIPIENT BLOCK */}
            <div className="relative z-10 mt-6 text-xs sm:text-sm font-sans space-y-0.5 leading-relaxed text-slate-800 dark:text-slate-200">
              <div className="font-bold">Alban Thika</div>
              <div>6</div>
              <div>Hyacinth Crt</div>
              <div>Fl 2</div>
              <div>Triq Tumas Dingli</div>
              <div>Birkirkara</div>
              <div className="font-mono font-semibold">BKR 1693</div>
            </div>

            {/* OFFICIAL LETTER BODY */}
            <div className="relative z-10 mt-8 text-xs sm:text-sm leading-relaxed text-slate-900 dark:text-slate-100 font-serif text-justify">
              <p>
                Reference your notification received at this Registry, I am to inform you that you have been registered as Editor of the online portal <strong className="font-sans font-black tracking-wide text-primary-600 dark:text-primary-400">MEDIA.NOVARIC.AL</strong> as from 11<sup>th</sup> June 2025.
              </p>
            </div>

            {/* SIGNATURE SECTION */}
            <div className="relative z-10 mt-8 font-sans text-xs sm:text-sm">
              <div className="italic font-serif">Yours faithfully,</div>
              
              {/* Stylized vector signature */}
              <div className="my-2 py-1">
                <svg viewBox="0 0 200 60" className="w-44 h-12 text-blue-900 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 35 C 30 10, 45 45, 60 20 C 75 10, 85 40, 110 30 C 130 25, 140 38, 175 42" strokeLinecap="round" />
                  <path d="M25 40 C 40 42, 70 38, 90 40 C 110 42, 130 38, 150 40" strokeLinecap="round" />
                </svg>
              </div>

              <div className="font-bold text-slate-900 dark:text-slate-100">Roderick Caruana</div>
              <div className="text-slate-600 dark:text-slate-400 text-xs">Director of Information</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                Department of Information
              </div>
            </div>

            {/* CC BLOCK & ANNOTATION */}
            <div className="relative z-10 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 text-[11px] font-sans">
              <div className="text-slate-600 dark:text-slate-400 space-y-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-300">cc:</span> Attorney General<br />
                <span className="pl-5">State Advocate</span><br />
                <span className="pl-5">Commissioner of Police</span>
              </div>

              <div className="text-right sm:max-w-xs text-[10px] text-slate-500 dark:text-slate-400 italic">
                Mr Alban Thika is the newly registered Editor of the online platform{' '}
                <a 
                  href="https://media.novaric.al/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary-600 dark:text-primary-400 underline font-sans font-semibold not-italic"
                >
                  https://media.novaric.al/
                </a>
              </div>
            </div>

            {/* OFFICIAL FOOTER ADDRESS */}
            <div className="relative z-10 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 text-center text-[10px] text-slate-500 dark:text-slate-400 font-sans space-y-0.5">
              <div className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                3, CASTILLE PLACE, VALLETTA VLT 1062
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-0.5">
                <span>Tel: +(356) 2200 1700</span>
                <span>E-mail: pressregistry.doi@gov.mt</span>
                <span>Website: www.doi.gov.mt</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
