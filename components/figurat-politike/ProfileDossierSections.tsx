import React from 'react';
import { DossierEntry, DossierField, ProfileDossier, UNVERIFIED_LABEL } from '../../utils/profileDossier';

function SourceLink({ href, label = 'Burimi' }: { href?: string; label?: string }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-sky-700 underline dark:text-sky-300">
      {label}
    </a>
  );
}

function formatDay(iso: string | null): string {
  if (!iso) return 'Data: në verifikim';
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return iso;
  return `${match[3]}.${match[2]}.${match[1]}`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900" data-profile-dossier={title}>
      <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">{title}</h2>
      {children}
    </section>
  );
}

function EntryList({ items }: { items: DossierEntry[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item) => {
        const withheld = item.verified === false || item.text === UNVERIFIED_LABEL;
        return (
          <li key={`${item.date}-${item.text}`} className="border-b border-slate-100 pb-3 text-sm text-slate-700 last:border-0 dark:border-slate-800 dark:text-slate-200">
            <div className="font-mono text-[11px] font-bold text-slate-400">{item.date}{item.label ? ` · ${item.label}` : ''}</div>
            <p className="mt-1 leading-relaxed">{withheld ? UNVERIFIED_LABEL : item.text}</p>
            {!withheld && <SourceLink href={item.sourceUrl} label={item.sourceLabel || 'Burimi'} />}
          </li>
        );
      })}
    </ol>
  );
}

function Fact({ field }: { field: DossierField }) {
  return (
    <div className="border-b border-slate-100 py-2 dark:border-slate-800">
      <div className="text-[11px] text-slate-400">{field.label}</div>
      <div className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-100">{field.verified ? field.display : UNVERIFIED_LABEL}</div>
      {field.verified && <SourceLink href={field.sourceUrl} label={field.sourceLabel || 'Burimi'} />}
    </div>
  );
}

/** Sourced biography, career, positions, media and social notes. Renders nothing when the profile has no dossier. */
export const ProfileDossierSections: React.FC<{ dossier: ProfileDossier | null }> = ({ dossier }) => {
  if (!dossier) return null;
  const x = dossier.social.x;
  return (
    <div data-profile-dossier-root="true">
      <Section title="Biografia">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{dossier.bio.sq}</p>
        <h3 className="mb-1 mt-4 text-[11px] font-bold uppercase tracking-wide text-slate-400">English</h3>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{dossier.bio.en}</p>
        <ul className="mt-4 space-y-1">
          {dossier.bio.sources.map((source) => (
            <li key={source.url}>
              <SourceLink href={source.url} label={source.label} />
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Të dhënat">
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
          {dossier.fields.map((field) => (
            <Fact key={field.key} field={field} />
          ))}
        </div>
      </Section>

      <Section title="Karriera">
        <EntryList items={dossier.timeline} />
      </Section>

      <Section title="Pozicionet publike">
        <EntryList items={dossier.positions} />
      </Section>

      <Section title="Mbulimi mediatik">
        <ul className="space-y-3">
          {dossier.media.map((item) => (
            <li key={item.url} className="border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800">
              <div className="text-[11px] font-bold text-slate-400">
                {item.date ? formatDay(item.date) : 'Data: në verifikim'} · {item.outlet}
              </div>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm font-semibold text-sky-800 underline dark:text-sky-300">
                {item.title}
              </a>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.summary}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Rrjetet sociale">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          Në X, më {formatDay(x.asOf)}: {x.followers.toLocaleString('sq-AL')} ndjekës, {x.following.toLocaleString('sq-AL')} ndjekje, {x.posts.toLocaleString('sq-AL')} postime, anëtar që nga {formatDay(x.joined)}.{' '}
          <SourceLink href={x.sourceUrl} label="x.com/NardNdoka" />
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{x.frequency}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{x.themes}</p>
        <ul className="mt-4 space-y-2">
          {x.recentPosts.map((post) => (
            <li key={post.url} className="text-sm text-slate-700 dark:text-slate-200">
              <span className="font-mono text-[11px] font-bold text-slate-400">{formatDay(post.date)} · </span>
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-sky-800 underline dark:text-sky-300">
                {post.text}
              </a>
            </li>
          ))}
        </ul>
        <ul className="mt-4 space-y-1 text-sm">
          {dossier.social.profilesOnly.map((profile) => (
            <li key={profile.url}>
              <SourceLink href={profile.url} label={profile.label} />
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
};
