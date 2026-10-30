import React from 'react';
import {
  AffiliationLink,
  ConsistencyFlag,
  PromiseItem,
  RhetoricProfile,
  RightOfReplyItem,
  ScoreRevision,
  VoteRecordItem,
} from '../../types/politician';
import { AWAITING_DATA, AwaitState, hasText } from './primitives/awaiting';

interface ProfileRecordSectionsProps {
  promises?: PromiseItem[];
  consistencyFlags?: ConsistencyFlag[];
  votingRecord?: VoteRecordItem[];
  rhetoric?: RhetoricProfile | null;
  affiliations?: AffiliationLink[];
  rightOfReply?: RightOfReplyItem[];
  scoreRevisions?: ScoreRevision[];
  onOpenEvidence?: (dimensionKey?: string | null) => void;
  evidenceCount?: number;
}

const Section: React.FC<{ titleSq: string; titleEn: string; children: React.ReactNode }> = ({
  titleSq,
  titleEn,
  children,
}) => (
  <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
    <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">
      {titleSq} <span className="text-slate-400 font-semibold normal-case tracking-normal">/ {titleEn}</span>
    </h3>
    <div className="mt-4">{children}</div>
  </section>
);

function choiceLabel(choice?: string | null): string {
  const value = (choice || '').toLowerCase();
  if (value === 'for' || value === 'yes' || value === 'po') return 'Për / For';
  if (value === 'against' || value === 'no' || value === 'kundër') return 'Kundër / Against';
  if (value === 'abstain') return 'Abstenim / Abstain';
  if (value === 'absent') return 'Mungesë / Absent';
  if (value === 'present') return 'I pranishëm / Present';
  return choice || AWAITING_DATA;
}

export const ProfileRecordSections: React.FC<ProfileRecordSectionsProps> = ({
  promises = [],
  consistencyFlags = [],
  votingRecord = [],
  rhetoric = null,
  affiliations = [],
  rightOfReply = [],
  scoreRevisions = [],
  onOpenEvidence,
  evidenceCount = 0,
}) => {
  const rhetoricHasContent = Boolean(
    rhetoric && (
      (rhetoric.excerpts && rhetoric.excerpts.length > 0) ||
      rhetoric.speechCount ||
      rhetoric.mentionCount ||
      rhetoric.averageSentiment != null
    )
  );

  return (
    <div className="space-y-6">
      <Section titleSq="Gjurmuesi i premtimeve" titleEn="Promise tracker">
        {promises.length === 0 ? <AwaitState /> : (
          <ul className="space-y-2">
            {promises.map((item, index) => (
              <li key={item.id || index} className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 text-xs">
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                  <span>{item.date || AWAITING_DATA}</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">{item.status || AWAITING_DATA}</span>
                </div>
                <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">{item.text}</p>
                {item.sourceUrl && (
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline mt-1 inline-block">
                    {item.sourceUrl}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section titleSq="Flamujt e qëndrueshmërisë" titleEn="Consistency flags (statements vs votes)">
        {consistencyFlags.length === 0 ? <AwaitState /> : (
          <ul className="space-y-2">
            {consistencyFlags.map((item, index) => (
              <li key={item.id || index} className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 text-xs">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{item.statement || AWAITING_DATA}</p>
                <p className="mt-1 text-slate-500">Vota / Vote: {item.vote || AWAITING_DATA}</p>
                <p className="mt-1 text-amber-700 dark:text-amber-300">{item.flag || AWAITING_DATA}</p>
                {item.sourceUrl && (
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline mt-1 inline-block">
                    {item.sourceUrl}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section titleSq="Procesverbali i votimit" titleEn="Voting record (Kuvendi)">
        {votingRecord.length === 0 ? <AwaitState /> : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-2 px-3">Data / Date</th>
                  <th className="py-2 px-3">Çështja / Subject</th>
                  <th className="py-2 px-3">Zgjedhja / Choice</th>
                  <th className="py-2 px-3">Burimi / Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {votingRecord.map((vote, index) => (
                  <tr key={vote.id || index}>
                    <td className="py-2 px-3 font-mono text-slate-500">{vote.votedAt || AWAITING_DATA}</td>
                    <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-100">{vote.subject || AWAITING_DATA}</td>
                    <td className="py-2 px-3">{choiceLabel(vote.choice)}</td>
                    <td className="py-2 px-3">
                      {vote.sourceUrl ? (
                        <a href={vote.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">
                          Kuvendi
                        </a>
                      ) : AWAITING_DATA}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section titleSq="Profili retorik" titleEn="Rhetoric profile">
        {!rhetoricHasContent ? <AwaitState /> : (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Stat label="Fjalime / Speeches" value={rhetoric?.speechCount != null ? String(rhetoric.speechCount) : AWAITING_DATA} />
              <Stat label="Përmendje / Mentions" value={rhetoric?.mentionCount != null ? String(rhetoric.mentionCount) : AWAITING_DATA} />
              <Stat label="Sentimenti mesatar / Avg. sentiment" value={rhetoric?.averageSentiment != null ? String(rhetoric.averageSentiment) : AWAITING_DATA} />
              <Stat label="Fjalë mesatare / Avg. words" value={rhetoric?.averageWordCount != null ? String(rhetoric.averageWordCount) : AWAITING_DATA} />
            </div>
            {rhetoric?.excerpts && rhetoric.excerpts.length > 0 ? (
              <ul className="space-y-2">
                {rhetoric.excerpts.map((excerpt, index) => (
                  <li key={index} className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-3">
                    <div className="text-[11px] text-slate-400 flex justify-between gap-2">
                      <span>{excerpt.date || AWAITING_DATA}</span>
                      <span>{excerpt.topic || ''}</span>
                    </div>
                    <p className="mt-1 text-slate-700 dark:text-slate-200 leading-relaxed">{excerpt.excerpt}</p>
                    {excerpt.sourceUrl && (
                      <a href={excerpt.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline mt-1 inline-block">
                        {excerpt.sourceUrl}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : <AwaitState />}
          </div>
        )}
      </Section>

      <Section titleSq="Rrjeti dhe përkatësitë" titleEn="Network & affiliations">
        {affiliations.length === 0 ? <AwaitState /> : (
          <ul className="flex flex-wrap gap-2">
            {affiliations.map((link, index) => {
              const body = (
                <span className="inline-flex flex-col px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">{link.kind}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{link.label}</span>
                  {hasText(link.detail) && <span className="text-slate-500">{link.detail}</span>}
                </span>
              );
              return link.url ? (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">{body}</a>
              ) : (
                <span key={index}>{body}</span>
              );
            })}
          </ul>
        )}
      </Section>

      <Section titleSq="Burimet e pikëzimit" titleEn="Evidence">
        {evidenceCount === 0 ? <AwaitState /> : (
          <button
            type="button"
            onClick={() => onOpenEvidence?.(null)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 underline"
          >
            Hap burimet / Open sources ({evidenceCount})
          </button>
        )}
      </Section>

      <Section titleSq="E drejta e përgjigjes" titleEn="Right of reply">
        {rightOfReply.length === 0 ? <AwaitState /> : (
          <ul className="space-y-2">
            {rightOfReply.map((item, index) => (
              <li key={item.id || index} className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 text-xs">
                <div className="text-[11px] text-slate-400 flex justify-between gap-2">
                  <span>{item.submittedAt || AWAITING_DATA}</span>
                  <span>{item.status || AWAITING_DATA}</span>
                </div>
                <p className="mt-1 text-slate-800 dark:text-slate-100 leading-relaxed">{item.statement}</p>
                {item.sourceUrl && (
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline mt-1 inline-block">
                    {item.sourceUrl}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section titleSq="Regjistri i rishikimeve" titleEn="Score revision log">
        {scoreRevisions.length === 0 ? <AwaitState /> : (
          <ul className="space-y-2">
            {scoreRevisions.map((revision, index) => (
              <li key={`${revision.computedAt}-${index}`} className="rounded-xl border border-slate-100 dark:border-slate-800 p-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-slate-500">{revision.computedAt || AWAITING_DATA}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {revision.composite != null ? `${revision.composite}` : AWAITING_DATA}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {revision.modelVersion || AWAITING_DATA}
                  {revision.periodEnd ? ` · ${revision.periodEnd}` : ''}
                </p>
                {revision.dimensions && (
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                    {Object.entries(revision.dimensions).map(([key, value]) => `${key}:${value ?? '–'}`).join('  ')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-2">
    <div className="text-[10px] text-slate-400">{label}</div>
    <div className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{value}</div>
  </div>
);
