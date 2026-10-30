// components/figurat-politike/primitives/TabPanel.tsx
import React, { useState } from 'react';
import { PoliticianDetail, ActivityFeedItem, AssetCategory, MandateItem } from '../../../types/politician';
import { ZodiacChip } from './ZodiacChip';
import { ExternalLink } from 'lucide-react';

interface TabPanelProps {
  politician: PoliticianDetail;
  className?: string;
}

type TabType = 'bio' | 'activity' | 'assets' | 'mandates';

const getInstitutionalSourceUrl = (source: string): string => {
  const s = (source || '').toLowerCase();
  if (s.includes('kuvend') || s.includes('parlament')) return 'https://parlament.al';
  if (s.includes('ildkpki')) return 'https://www.ildkpki.al';
  if (s.includes('fletorja zyrtare') || s.includes('qbz')) return 'https://qbz.gov.al';
  if (s.includes('kqz')) return 'https://kqz.gov.al';
  if (s.includes('spak')) return 'https://spak.al';
  if (s.includes('gjykata')) return 'http://www.gjk.gov.al';
  return 'https://parlament.al';
};

export const TabPanel: React.FC<TabPanelProps> = ({ politician, className = '' }) => {
  const [activeTab, setActiveTab] = useState<TabType>('bio');

  if (!politician) {
    return null;
  }

  const {
    name = '',
    category = '',
    dateOfBirth,
    placeOfBirth,
    electoralZone,
    bio = {},
    recentActivity = [],
    assetDeclaration,
    mandates = []
  } = politician;

  const partyName = category?.includes('(') ? category.match(/\((.*?)\)/)?.[1] || category : category || 'I pavarur';

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm ${className}`}>
      {/* Tab Navigation Header */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-1.5 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bio')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
            activeTab === 'bio'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Biografia
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
            activeTab === 'activity'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Aktiviteti i fundit
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
            activeTab === 'assets'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Pasuria (ILDKPKI)
        </button>
        <button
          onClick={() => setActiveTab('mandates')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
            activeTab === 'mandates'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Mandatet & Zgjedhjet
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5 flex-grow">
        {/* TAB 1: BIOGRAFIA */}
        {activeTab === 'bio' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Emri i plotë</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{bio.fullName || name}</span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Datëlindja & Vendlindja</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {dateOfBirth ? dateOfBirth : 'Nuk disponohet'} {placeOfBirth ? `· ${placeOfBirth}` : ''}
                </span>
              </div>

              {dateOfBirth && (
                <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Shenja astrologjike</span>
                  <div className="mt-1">
                    <ZodiacChip dateOfBirth={dateOfBirth} />
                  </div>
                </div>
              )}

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Zona Zgjedhore</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {electoralZone || 'Qarku Tiranë'}
                </span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Arsimi (KQZ CV)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {bio.education || 'Arsim i Lartë Universitar'}
                </span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Profesioni</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {bio.profession || 'Jurist / Politikan'}
                </span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Partia & Përkatësia</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {partyName}
                </span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Email Zyrtar</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                  {bio.email || `${name.toLowerCase().replace(/\s+/g, '.')}@parlament.al`}
                </span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Statusi Institucional</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Aktiv në Kuvend
                </span>
              </div>
            </div>

            {politician.detailedBio && (
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {politician.detailedBio}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AKTIVITETI I FUNDIT */}
        {activeTab === 'activity' && (
          <div className="space-y-3 animate-fadeIn">
            {recentActivity.length > 0 ? (
              recentActivity.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-400 dark:text-slate-500">{act.date}</span>
                    <a
                      href={getInstitutionalSourceUrl(act.source)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-[10px] border border-blue-200 dark:border-blue-900 inline-flex items-center gap-1 transition-colors"
                      title={`Verifiko burimin: ${act.source}`}
                    >
                      <span>{act.source}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </a>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {act.title}
                  </div>
                  {act.detail && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      {act.detail}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                Nuk ka aktivitete të regjistruara së fundmi në regjistrat e Kuvendit.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PASURIA (ILDKPKI) */}
        {activeTab === 'assets' && (
          <div className="space-y-4 animate-fadeIn">
            {assetDeclaration ? (
              <>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
                  <div>
                    <span className="text-xs text-slate-400">Viti i Deklarimit</span>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{assetDeclaration.year}</div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      assetDeclaration.onTime
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                    }`}
                  >
                    {assetDeclaration.onTime ? '✓ Brenda Afatit Ligjor (31 Mars)' : 'Me Vonesë'}
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Kategoria e Pasurisë</th>
                        <th className="py-2.5 px-3">Përshkrimi / Detaje</th>
                        <th className="py-2.5 px-3 text-right">Vlera</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {assetDeclaration.categories.map((cat, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-2 px-3 font-semibold">{cat.category}</td>
                          <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{cat.detail || '—'}</td>
                          <td className="py-2 px-3 text-right font-mono">
                            {cat.value !== null && cat.value !== undefined ? (
                              typeof cat.value === 'number' ? `${cat.value.toLocaleString()} lekë` : cat.value
                            ) : (
                              /* Never assert 0 when withheld */
                              <span className="italic text-slate-400 text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                nën deklarim
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-[10px] text-slate-400 dark:text-slate-500 italic flex items-center justify-between">
                  <span>Burimi: Inspektorati i Lartë i Deklarimit dhe Kontrollit të Pasurive (ILDKPKI)</span>
                  {assetDeclaration.sourceUrl && (
                    <a
                      href={assetDeclaration.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                    >
                      Verifiko dokumentin &rarr;
                    </a>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                <p>Deklarimi i vitit 2025 nuk është publikuar ende në regjistrin e ILDKPKI.</p>
                <a
                  href="https://www.ildkpki.al"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-blue-600 dark:text-blue-400 text-xs underline"
                >
                  Regjistri zyrtar ILDKPKI &rarr;
                </a>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MANDATET & ZGJEDHJET */}
        {activeTab === 'mandates' && (
          <div className="space-y-3 animate-fadeIn">
            {mandates.length > 0 ? (
              <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 pl-4 space-y-4">
                {mandates.map((m, idx) => (
                  <div key={idx} className="relative">
                    {/* Timeline node */}
                    <div
                      className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                        m.current
                          ? 'bg-blue-600 dark:bg-blue-400 ring-2 ring-blue-200 dark:ring-blue-900'
                          : 'bg-slate-400 dark:bg-slate-600'
                      }`}
                    />
                    <div className="text-xs">
                      <span className={`font-mono text-[11px] font-bold ${m.current ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                        {m.period} {m.current ? '(Mandati Aktual)' : ''}
                      </span>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {m.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                Mandati aktual në legjislaturën e X-të të Kuvendit të Shqipërisë (2021 — 2025).
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
