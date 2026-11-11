import React, { useEffect, useState } from 'react';
import { VipProfile } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { AwaitingPhoto } from '../figurat-politike/primitives/awaiting';
import { formatVipName } from '../../utils/paragonProfileUtils';
import { notAssessedLabel } from '../../utils/maragonPublication';
import { CANONICAL_MARAGON_INDICATOR_IDS } from '../../lib/maragon-schemas';
import {
  indicatorChipLabel,
  isMaragonPreviewActive,
  loadMaragonPreview,
  textForLang,
  type MaragonResearchPayload,
} from '../../services/maragonDossier';

const chipClass: Record<string, string> = {
  not_assessed: 'border-slate-500 text-slate-200 bg-slate-900',
  insufficient_evidence: 'border-amber-700/80 text-amber-100 bg-amber-950/40',
  not_applicable: 'border-slate-600 text-slate-400 bg-transparent',
  assessed: 'border-cyan-700 text-cyan-100 bg-cyan-950/40',
  'assessed-qualitative': 'border-cyan-700 text-cyan-100 bg-cyan-950/40',
};

function StatusChip({ status, lang }: { status: string; lang: 'sq' | 'en' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${chipClass[status] || chipClass.not_assessed}`}>
      {indicatorChipLabel(status, lang)}
    </span>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-700/80 bg-slate-900/70 p-4 sm:p-5">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400/90 mb-3">{title}</h2>
      {children}
    </section>
  );
}

export const MaragonDossierView: React.FC<{ profile: VipProfile; onBack: () => void }> = ({ profile, onBack }) => {
  const { language, toggleLanguage } = useLanguage();
  const lang = language === 'en' ? 'en' : 'sq';
  const preview = isMaragonPreviewActive();
  const [dossier, setDossier] = useState<MaragonResearchPayload | null>(null);
  useEffect(() => {
    if (!preview) {
      setDossier(null);
      return;
    }
    let alive = true;
    loadMaragonPreview(profile.id).then((loaded) => {
      if (alive) setDossier(loaded);
    });
    return () => { alive = false; };
  }, [preview, profile.id]);
  const label = notAssessedLabel(lang);
  const name = formatVipName(dossier?.subject.fullName || profile.name);
  const copy = lang === 'en'
    ? {
        back: 'Return',
        kicker: 'MARAGON® dossier',
        identity: 'Identity',
        publication: 'Publication status',
        assessment: 'Assessment',
        biography: 'Biography',
        scoring: 'Scoring',
        authorized: 'Public display',
        notAuthorized: 'Not authorised',
        suspended: 'Suspended',
        indicators: 'Canonical indicators',
        supplementary: 'Supplementary axis',
        evidence: 'Evidence register',
        method: 'Methodology and sample',
        sampleInvalid: 'Sample not validated',
        preview: 'Local preview — not published',
        previewNote: 'Draft biography and research notes are visible only in this dev preview. Production keeps them hidden.',
        noScore: 'No numeric score',
        qualitative: 'Qualitative · no score',
        age: 'Age',
        zodiac: 'Zodiac',
        role: 'Role',
      }
    : {
        back: 'Kthehu',
        kicker: 'Dosja MARAGON®',
        identity: 'Identiteti',
        publication: 'Statusi i publikimit',
        assessment: 'Vlerësimi',
        biography: 'Biografia',
        scoring: 'Pikëzimi',
        authorized: 'Shfaqje publike',
        notAuthorized: 'E paautorizuar',
        suspended: 'I pezulluar',
        indicators: 'Treguesit kanonikë',
        supplementary: 'Bosht plotësues',
        evidence: 'Regjistri i provave',
        method: 'Metodologjia dhe kampioni',
        sampleInvalid: 'Kampioni nuk është i validuar',
        preview: 'Pamje lokale — e papublikuar',
        previewNote: 'Biografia draft dhe shënimet e hulumtimit shihen vetëm në këtë pamje dev. Produksioni i mban të fshehura.',
        noScore: 'Pa pikë numerike',
        qualitative: 'Cilësore · pa pikë',
        age: 'Mosha',
        zodiac: 'Shenja',
        role: 'Roli',
      };

  const canonical = dossier?.indicators.filter((item) => item.id !== 'maragon:C' && !item.supplementary) ?? [];
  const supplementary = dossier?.indicators.find((item) => item.id === 'maragon:C');

  return (
    <main className="min-h-screen bg-[#070b16] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.16),transparent_42%),linear-gradient(to_bottom,#070b16,#0c1224)]" />
      <div className="relative mx-auto max-w-5xl px-4 py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button type="button" onClick={onBack} className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400 hover:text-white">
            ← {copy.back}
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-full border border-slate-600 bg-slate-900 px-3 py-1 text-xs font-bold"
          >
            <span className={lang === 'sq' ? 'text-cyan-300' : 'text-slate-500'}>AL</span>
            <span className="mx-1 text-slate-600">|</span>
            <span className={lang === 'en' ? 'text-cyan-300' : 'text-slate-500'}>EN</span>
          </button>
        </div>

        {preview && (
          <div className="mb-4 rounded-lg border border-amber-700/70 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">
            <p className="font-bold uppercase tracking-wider text-[11px]">{copy.preview}</p>
            <p className="mt-1 text-amber-100/80">{copy.previewNote}</p>
          </div>
        )}

        <header className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/80 shadow-[0_0_0_1px_rgba(8,47,73,0.35)]">
          <div className="grid gap-6 p-5 sm:grid-cols-[148px_1fr] sm:p-7">
            <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border border-slate-600 bg-slate-900 sm:mx-0">
              <AwaitingPhoto iconClassName="w-14 h-14" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-400">{copy.kicker}</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">{name}</h1>
              <p className="mt-2 font-mono text-xs text-slate-400">ID {profile.id} · {profile.category || 'Media'}</p>
              <p className="mt-5 inline-flex rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-bold uppercase tracking-wide text-slate-100">
                {label}
              </p>
            </div>
          </div>
        </header>

        <div className="mt-4 grid gap-4">
          <Panel title={copy.publication}>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-slate-500">{copy.assessment}</dt>
                <dd className="mt-1 font-semibold">{label}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-slate-500">{copy.scoring}</dt>
                <dd className="mt-1 font-semibold">{copy.suspended}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-slate-500">{copy.biography}</dt>
                <dd className="mt-1 font-semibold">{preview ? (dossier?.publication.biographyStatus || 'draft') : label}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-slate-500">{copy.authorized}</dt>
                <dd className="mt-1 font-semibold">{copy.notAuthorized}</dd>
              </div>
            </dl>
            {preview && dossier && (
              <p className="mt-3 font-mono text-[11px] text-slate-500">
                {dossier.meta.documentId} · {dossier.meta.accessDate}
              </p>
            )}
          </Panel>

          {!preview && (
            <Panel title={copy.identity}>
              <p className="text-sm text-slate-300">{label}</p>
              <div className="mt-3 flex gap-2 text-[11px] font-mono text-slate-400">
                <span className="rounded border border-slate-700 px-2 py-1">{copy.age}: N/A</span>
                <span className="rounded border border-slate-700 px-2 py-1">{copy.zodiac}: N/A</span>
              </div>
            </Panel>
          )}

          {preview && dossier && (
            <>
              <Panel title={copy.identity}>
                <p className="text-sm leading-relaxed text-slate-200">
                  {textForLang(lang, dossier.subject.shortBio_sq, dossier.subject.shortBio_en)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {textForLang(lang, dossier.subject.detailedBio_sq, dossier.subject.detailedBio_en)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
                  <span className="rounded border border-slate-700 px-2 py-1">{copy.age}: {dossier.subject.age ?? 'N/A'}</span>
                  <span className="rounded border border-slate-700 px-2 py-1">{copy.zodiac}: N/A</span>
                  {dossier.subject.dateOfBirth && (
                    <span className="rounded border border-slate-700 px-2 py-1">{dossier.subject.dateOfBirth}</span>
                  )}
                </div>
              </Panel>

              <Panel title={copy.indicators}>
                <ol className="space-y-3">
                  {canonical.map((item, index) => (
                    <li key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold">
                          <span className="mr-2 font-mono text-cyan-300">{String(index + 1).padStart(2, '0')}</span>
                          {item.code} · {textForLang(lang, item.title_sq, item.title_en)}
                        </p>
                        <StatusChip status={item.status} lang={lang} />
                      </div>
                      <p className="mt-2 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                        {item.status === 'assessed-qualitative' ? copy.qualitative : copy.noScore}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {textForLang(lang, item.commentary_sq, item.commentary_en)}
                      </p>
                    </li>
                  ))}
                </ol>
              </Panel>

              {supplementary && (
                <Panel title={copy.supplementary}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{textForLang(lang, supplementary.title_sq, supplementary.title_en)}</p>
                    <StatusChip status={supplementary.status} lang={lang} />
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{textForLang(lang, supplementary.commentary_sq, supplementary.commentary_en)}</p>
                </Panel>
              )}

              <Panel title={copy.method}>
                <p className="text-sm text-slate-200">{textForLang(lang, dossier.sampling.method_sq, dossier.sampling.method_en)}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-amber-200/90">{copy.sampleInvalid}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-400">
                  {dossier.sampling.limitations.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </Panel>

              <Panel title={copy.evidence}>
                <ul className="space-y-3">
                  {dossier.evidenceRegister.map((item) => (
                    <li key={item.evidenceId} className="border-b border-slate-800 pb-3 last:border-0">
                      <p className="font-mono text-[11px] text-cyan-400">{item.evidenceId}</p>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.publisher}</p>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-cyan-300 underline break-all">
                          {item.url}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </Panel>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export const MaragonAnalysisView: React.FC<{ profileId: string | number; name: string }> = ({ profileId, name }) => {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'sq';
  const preview = isMaragonPreviewActive();
  const [dossier, setDossier] = useState<MaragonResearchPayload | null>(null);
  useEffect(() => {
    if (!preview) {
      setDossier(null);
      return;
    }
    let alive = true;
    loadMaragonPreview(profileId).then((loaded) => {
      if (alive) setDossier(loaded);
    });
    return () => { alive = false; };
  }, [preview, profileId]);
  const label = notAssessedLabel(lang);
  const canonical = dossier?.indicators.filter((item) => item.id !== 'maragon:C' && !item.supplementary) ?? [];
  const publicCodes = canonical.length
    ? canonical
    : CANONICAL_MARAGON_INDICATOR_IDS.map((id) => ({ id, code: id.replace('maragon:', '') }));

  if (!preview) {
    return (
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{label}</h2>
        <p className="mt-2 text-sm text-slate-500">{name}</p>
        <div className="mx-auto mt-6 grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-5">
          {publicCodes.map((item) => (
            <div key={item.id} className="rounded border border-dashed border-slate-300 px-2 py-3 text-[11px] font-mono text-slate-500 dark:border-slate-600">
              {item.code}
              <div className="mt-1 text-[10px] uppercase">{label}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div className="rounded-lg border border-amber-600/50 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">
        {lang === 'en' ? 'Local preview — not published. No numeric scores.' : 'Pamje lokale — e papublikuar. Pa pikë numerike.'}
      </div>
      <ol className="space-y-3">
        {dossier?.indicators.map((item) => (
          <li key={item.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                {item.code} · {lang === 'en' ? item.title_en : item.title_sq}
                {item.supplementary ? (lang === 'en' ? ' · supplementary' : ' · plotësues') : ''}
              </h3>
              <StatusChip status={item.status} lang={lang} />
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{lang === 'en' ? item.commentary_en : item.commentary_sq}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};
