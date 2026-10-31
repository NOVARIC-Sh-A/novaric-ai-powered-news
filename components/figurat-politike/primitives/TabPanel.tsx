// components/figurat-politike/primitives/TabPanel.tsx
import React, { useState } from 'react';
import { PoliticianDetail, ActivityFeedItem, AssetCategory, MandateItem } from '../../../types/politician';
import { ZodiacChip } from './ZodiacChip';
import { ExternalLink } from 'lucide-react';
import { AWAITING_DATA, NOT_SCORED, hasText, AwaitState } from './awaiting';
import { AssetTimelineItem } from '../../../types/politician';

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
    bio: rawBio,
    recentActivity = [],
    assetDeclaration,
    mandates = []
  } = politician;

  const bio = rawBio || {};
  const partyFromCategory = category?.includes('(') ? category.match(/\((.*?)\)/)?.[1] : null;
  const partyName = hasText(bio.party) ? bio.party : (hasText((politician as any).party) ? (politician as any).party : partyFromCategory);
  const assetTimeline: AssetTimelineItem[] = Array.isArray((politician as any).assetTimeline) ? (politician as any).assetTimeline : [];
  const statusLabel = institutionalStatus((politician as any).parliamentaryStatus, bio.activeStatus);

function institutionalStatus(status?: string | null, activeStatus?: boolean | null): string | null {
  if (status === 'active_mp') return 'Aktiv në Kuvend / Active in Parliament';
  if (status === 'former_mp') return 'Ish-deputet / Former MP';
  if (status === 'mandate_ended') return 'Mandati përfundoi / Mandate ended';
  if (status === 'mandate_suspended') return 'Mandati i pezulluar / Mandate suspended';
  if (status === 'not_an_active_mp') return 'Jo deputet aktiv / Not an active MP';
  if (activeStatus === true) return 'Aktiv në Kuvend / Active in Parliament';
  if (activeStatus === false) return 'Jo deputet aktiv / Not an active MP';
  if (hasText(status)) return status;
  return null;
}

function FieldValue({ value }: { value?: string | null }) {
  if (!hasText(value)) {
    return <span className="font-medium text-slate-400 dark:text-slate-500">{AWAITING_DATA}</span>;
  }
  return <span className="font-semibold text-slate-900 dark:text-slate-100">{value}</span>;
}

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
          Biografia / Biography
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
            activeTab === 'activity'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Aktiviteti i fundit / Recent activity
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
            activeTab === 'assets'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Pasuria (ILDKPKI) / Assets
        </button>
        <button
          onClick={() => setActiveTab('mandates')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
            activeTab === 'mandates'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Mandatet & Zgjedhjet / Mandates
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5 flex-grow">
        {/* TAB 1: BIOGRAFIA */}
        {activeTab === 'bio' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Emri i plotë / Full name</span>
                <span className="mt-0.5"><FieldValue value={bio.fullName || name} /></span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Datëlindja & vendlindja / Birth</span>
                <span className="mt-0.5">
                  <FieldValue value={[dateOfBirth, placeOfBirth].filter(hasText).join(' · ') || null} />
                </span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{NOT_SCORED}</span>
                <div className="mt-1">
                  {dateOfBirth ? <ZodiacChip dateOfBirth={dateOfBirth} withStatus /> : <FieldValue value={null} />}
                </div>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Zona zgjedhore / Electoral zone</span>
                <span className="mt-0.5"><FieldValue value={electoralZone} /></span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Arsimi (KQZ CV) / Education</span>
                <span className="mt-0.5"><FieldValue value={bio.education} /></span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Profesioni / Profession</span>
                <span className="mt-0.5"><FieldValue value={bio.profession} /></span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Partia & përkatësia / Party</span>
                <span className="mt-0.5"><FieldValue value={partyName} /></span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Grupi parlamentar / Parliamentary group</span>
                <span className="mt-0.5"><FieldValue value={(politician as any).parliamentaryGroup} /></span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Email zyrtar / Official email</span>
                <span className="mt-0.5 font-mono"><FieldValue value={bio.email} /></span>
              </div>

              <div className="flex flex-col py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Statusi institucional / Status</span>
                {statusLabel ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${statusLabel.startsWith('Aktiv') ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {statusLabel}
                  </span>
                ) : (
                  <span className="mt-0.5"><FieldValue value={null} /></span>
                )}
              </div>
            </div>

            <OfficialLinks links={(politician as any).officialLinks} />
            <FieldSourceList sources={(politician as any).fieldSources} photoLicence={(politician as any).photoLicence} />

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
              <AwaitState />
            )}
          </div>
        )}

        {/* TAB 3: PASURIA (ILDKPKI) */}
        {activeTab === 'assets' && (
          <div className="space-y-4 animate-fadeIn">
            <AssetTimeline
              items={assetTimeline.length > 0 ? assetTimeline : (assetDeclaration?.year ? [{
                year: assetDeclaration.year,
                filedAt: assetDeclaration.declaredDate,
                onTime: assetDeclaration.onTime,
                sourceUrl: assetDeclaration.sourceUrl,
                categories: assetDeclaration.categories || [],
              }] : [])}
            />
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
                        {m.period || AWAITING_DATA} {m.current ? '(Mandati aktual / Current)' : ''}
                      </span>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {m.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <AwaitState />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const OfficialLinks: React.FC<{ links?: { label?: string; url?: string }[] }> = ({ links }) => {
  const items = (links || []).filter((link) => hasText(link.url));
  return (
    <div className="mt-3">
      <div className="text-[11px] text-slate-400 font-medium mb-1">Lidhje zyrtare / Official links</div>
      {items.length === 0 ? <p className="text-xs text-slate-400">{AWAITING_DATA}</p> : (
        <ul className="space-y-1">
          {items.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline break-all">
                {link.label || link.url}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FieldSourceList: React.FC<{ sources?: Record<string, any>; photoLicence?: string | null }> = ({ sources, photoLicence }) => {
  const rows = Object.entries(sources || {}).filter(([, source]) => source && (source.sourceUrl || source.value));
  return (
    <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-2">Burimet / Sources</div>
      {photoLicence && <p className="text-[11px] text-slate-500 mb-2">Foto / Photo: {photoLicence}</p>}
      {rows.length === 0 ? <p className="text-xs text-slate-400">{AWAITING_DATA}</p> : (
        <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
          {rows.map(([field, source]) => (
            <li key={field}>
              <span className="font-semibold">{field}</span>
              {source.retrievedAt ? ` · ${source.retrievedAt}` : ''}
              {source.sourceUrl ? (
                <>
                  {' · '}
                  <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline break-all">{source.sourceUrl}</a>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function onTimeLabel(onTime?: boolean | null): string {
  if (onTime === true) return 'Brenda afatit / On time';
  if (onTime === false) return 'Me vonesë / Late';
  return AWAITING_DATA;
}

const AssetTimeline: React.FC<{ items: AssetTimelineItem[] }> = ({ items }) => {
  if (!items.length) return <AwaitState />;
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <article key={`${item.year}-${index}`} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-800/60">
            <div>
              <div className="text-[11px] text-slate-400">Viti / Year</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.year}</div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {onTimeLabel(item.onTime)}
            </span>
          </div>
          {item.categories && item.categories.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-2 px-3">Kategoria / Category</th>
                  <th className="py-2 px-3">Përshkrimi / Detail</th>
                  <th className="py-2 px-3 text-right">Vlera / Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {item.categories.map((cat, catIndex) => (
                  <tr key={catIndex}>
                    <td className="py-2 px-3 font-semibold">{cat.category}</td>
                    <td className="py-2 px-3 text-slate-500">{cat.detail || AWAITING_DATA}</td>
                    <td className="py-2 px-3 text-right font-mono">
                      {cat.value !== null && cat.value !== undefined
                        ? (typeof cat.value === 'number' ? `${cat.value.toLocaleString()} lekë` : cat.value)
                        : AWAITING_DATA}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-3 py-3 text-xs text-slate-500">{AWAITING_DATA}</p>
          )}
          <div className="px-3 py-2 text-[10px] text-slate-400 flex justify-between gap-2">
            <span>{item.filedAt || 'ILDKPKI'}</span>
            {item.sourceUrl && (
              <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline">
                {item.sourceUrl}
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};
