import React from 'react';
import { JsonLd } from './JsonLd';
import { useSeo } from '../hooks/useSeo';
import { renderWithSuperscript } from '../utils/textUtils';
import { CANONICAL_URL } from '../config/constants';
import {
  DATA_PENDING_LABEL,
  FORECAST_PATH,
  forecastSections,
  forecastSummary,
  type BiText,
  type ForecastBlock,
} from '../data/forecast2027';

interface Forecast2027PageProps {
  onBack: () => void;
}

const PAGE_URL = `${CANONICAL_URL.replace(/\/$/, '')}${FORECAST_PATH}`;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderRich(text: string, italics: string[] = []): React.ReactNode {
  const present = italics.filter((phrase) => phrase.length > 0 && text.includes(phrase));
  if (present.length === 0) return renderWithSuperscript(text);
  const pattern = new RegExp(`(${present.map(escapeRegExp).join('|')})`, 'g');
  return text.split(pattern).map((part, index) => {
    if (present.includes(part)) {
      return <em key={index}>{renderWithSuperscript(part)}</em>;
    }
    return <React.Fragment key={index}>{renderWithSuperscript(part)}</React.Fragment>;
  });
}

const Bi: React.FC<{ text: BiText; sqClassName?: string; enClassName?: string }> = ({
  text,
  sqClassName = 'text-slate-800 dark:text-slate-100 leading-relaxed',
  enClassName = 'mt-1 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400',
}) => (
  <div>
    <div className={sqClassName}>{renderRich(text.sq, text.italicSq)}</div>
    <div className={enClassName}>{renderRich(text.en, text.italicEn)}</div>
  </div>
);

const InternalDataLabel: React.FC = () => (
  <p className="mb-2 inline-flex rounded-md border border-sky-300 bg-sky-50 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-sky-900 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-200">
    {renderWithSuperscript('Të dhëna të brendshme të NOVARIC® / NOVARIC® internal data')}
  </p>
);

const calloutTone: Record<string, string> = {
  warning: 'border-amber-400 bg-amber-50 text-amber-950 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-100',
  info: 'border-sky-300 bg-sky-50 text-slate-800 dark:border-sky-700 dark:bg-sky-950/30 dark:text-slate-100',
  success: 'border-emerald-400 bg-emerald-50 text-emerald-950 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-100',
};

function renderBlock(block: ForecastBlock, index: number): React.ReactNode {
  if (block.kind === 'prose') {
    return (
      <div key={index}>
        {block.internal ? <InternalDataLabel /> : null}
        <Bi text={block.text} />
      </div>
    );
  }

  if (block.kind === 'callout') {
    return (
      <div key={index} className={`rounded-lg border px-4 py-3 ${calloutTone[block.tone]}`}>
        <Bi
          text={block.text}
          sqClassName="leading-relaxed"
          enClassName="mt-2 text-[13px] leading-relaxed opacity-80"
        />
      </div>
    );
  }

  if (block.kind === 'metrics') {
    return (
      <div key={index} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {block.items.map((item) => (
          <div key={item.value + item.label.en} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="text-2xl font-black tracking-tight text-[#30384B] dark:text-white">{item.value}</div>
            <Bi text={item.label} sqClassName="mt-1 font-semibold text-slate-800 dark:text-slate-100" enClassName="text-xs text-slate-500 dark:text-slate-400" />
            <Bi text={item.detail} sqClassName="mt-2 text-sm text-slate-700 dark:text-slate-200" enClassName="mt-1 text-xs text-slate-500 dark:text-slate-400" />
          </div>
        ))}
      </div>
    );
  }

  if (block.kind === 'table') {
    return (
      <div key={index} className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="bg-[#30384B] text-white">
            <tr>
              {block.columns.map((column) => (
                <th key={column.en} className="px-3 py-2 align-top font-semibold">
                  <span className="block">{renderWithSuperscript(column.sq)}</span>
                  <span className="mt-0.5 block text-[11px] font-normal text-slate-300">{renderWithSuperscript(column.en)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 ? 'bg-slate-50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-950'}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-t border-slate-200 px-3 py-3 align-top dark:border-slate-800">
                    <Bi text={cell} sqClassName="text-slate-800 dark:text-slate-100 leading-relaxed" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.kind === 'steps') {
    return (
      <ol key={index} className="space-y-4">
        {block.steps.map((step, stepIndex) => (
          <li key={step.title.en} className="flex gap-3">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#30384B] text-sm font-bold text-white">{stepIndex + 1}</span>
            <div>
              <Bi text={step.title} sqClassName="font-semibold text-slate-900 dark:text-white" enClassName="text-xs text-slate-500 dark:text-slate-400" />
              <div className="mt-1">
                <Bi text={step.detail} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  if (block.kind === 'gaps') {
    return (
      <div key={index} className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="bg-[#30384B] text-white">
            <tr>
              {block.columns.map((column) => (
                <th key={column.en} className="px-3 py-2 align-top font-semibold">
                  <span className="block">{column.sq}</span>
                  <span className="mt-0.5 block text-[11px] font-normal text-slate-300">{column.en}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.gap.en} className="bg-white dark:bg-slate-950">
                {([row.gap, row.why, row.how] as BiText[]).map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-t border-slate-200 px-3 py-3 align-top dark:border-slate-800">
                    {cellIndex === 0 ? (
                      <p className="mb-2 inline-flex rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
                        {DATA_PENDING_LABEL}
                      </p>
                    ) : null}
                    <Bi text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.kind === 'sources') {
    return (
      <dl key={index} className="space-y-3">
        {block.items.map((item) => (
          <div key={item.label.en} className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
            <dt>
              <Bi text={item.label} sqClassName="font-semibold text-slate-900 dark:text-white" enClassName="text-xs text-slate-500 dark:text-slate-400" />
            </dt>
            <dd className="mt-1 break-all text-sm">
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-primary-700 underline dark:text-primary-300">
                  {item.href}
                </a>
              ) : (
                <Bi text={item.value} />
              )}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <div key={index} className="space-y-3">
      {block.items.map((item) => (
        <article key={item.lead} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-mono text-xs font-bold text-primary-600 dark:text-primary-400">{item.lead}</p>
              <Bi text={item.title} sqClassName="font-semibold text-slate-900 dark:text-white" enClassName="text-xs text-slate-500 dark:text-slate-400" />
            </div>
            <span className={`rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${item.tone === 'warning' ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100' : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100'}`}>
              <span className="block">{item.status.sq}</span>
              <span className="block font-medium normal-case tracking-normal opacity-80">{item.status.en}</span>
            </span>
          </div>
          <div className="mt-2">
            <Bi text={item.detail} />
          </div>
        </article>
      ))}
    </div>
  );
}

export const Forecast2027Page: React.FC<Forecast2027PageProps> = ({ onBack }) => {
  const pageTitle = 'NOVARIC® Forecast 2027 | Parashikimi 2027 | Botim paraprak';
  const pageDescription = 'Botim paraprak i NOVARIC® Forecast 2027. Draft i panënshkruar, në pritje të nënshkrimit nga Dr Alban Gj. THIKA dhe të rishikimit ligjor. Nuk është këshillë investimi.';

  useSeo(pageTitle, pageDescription, undefined, PAGE_URL, 'sq_AL');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'NOVARIC® Forecast 2027',
    alternativeHeadline: 'Parashikimi NOVARIC® 2027',
    description: pageDescription,
    inLanguage: ['sq-AL', 'en'],
    datePublished: '2026-11-18',
    dateModified: '2026-11-18',
    creativeWorkStatus: 'Draft',
    url: PAGE_URL,
    author: {
      '@type': 'Person',
      name: 'Dr Alban Gj. THIKA',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NOVARIC® Sh.A.',
      url: 'https://novaric.al',
    },
    isAccessibleForFree: true,
  };

  return (
    <article className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <JsonLd data={structuredData} />

      <div role="status" className="border-b border-amber-400 bg-amber-100 px-4 py-4 text-amber-950 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-50">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em]">Statusi / Status</p>
          <p className="mt-1 text-base font-semibold leading-snug sm:text-lg">
            Botim paraprak / Draft edition — në pritje të nënshkrimit nga Dr Alban Gj. THIKA dhe rishikimit ligjor të mohimit të përgjegjësisë
          </p>
          <p className="mt-1 text-sm leading-snug text-amber-900/80 dark:text-amber-100/80">
            Draft edition — awaiting the signature of Dr Alban Gj. THIKA and legal review of the disclaimer.
          </p>
        </div>
      </div>

      <div className="border-b border-primary-200 bg-primary-50 px-4 py-3 dark:border-primary-900 dark:bg-primary-950/40">
        <div className="mx-auto max-w-6xl">
          <p className="font-semibold text-primary-800 dark:text-primary-200">Ky dokument nuk është këshillë investimi.</p>
          <p className="text-sm text-primary-700/80 dark:text-primary-300/80">This is not investment advice.</p>
        </div>
      </div>

      <header className="bg-[#30384B] px-4 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white"
          >
            ← Kthehu / Back
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">Publikime NOVARIC®</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            <span className="novaric-brand">NOVARIC<sup aria-hidden="true" className="registered-mark">®</sup></span>
            {' '}Forecast 2027
          </h1>
          <p className="mt-1 text-lg text-slate-200">Parashikimi 2027</p>
          <div className="mt-4 max-w-4xl">
            <Bi
              text={forecastSummary}
              sqClassName="text-slate-100 leading-relaxed"
              enClassName="mt-2 text-sm leading-relaxed text-slate-300"
            />
          </div>
          <dl className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-400">Prerja / Cut-off</dt>
              <dd>18 nëntor 2026, ora e Tiranës (UTC+1)</dd>
              <dd className="text-xs text-slate-300">18 November 2026, Tirana time (UTC+1)</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-400">Nënshkruesi / Signatory</dt>
              <dd>Dr Alban Gj. THIKA</dd>
              <dd className="text-xs text-slate-300">I panënshkruar / Unsigned</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-400">Botuesit / Publishers</dt>
              <dd>{renderWithSuperscript('NOVARIC® Sh.A., Tiranë')}</dd>
              <dd className="text-xs text-slate-300">{renderWithSuperscript('NOVARIC® DOO, Podgoricë, ku zbatohet')}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav aria-label="Përmbajtja / Contents" className="mb-10 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#30384B] dark:text-white">Përmbajtja</h2>
          <p className="text-xs text-slate-500">Contents</p>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {forecastSections.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-sm text-primary-700 hover:underline dark:text-primary-300">
                  <span className="mr-2 font-mono text-xs text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                  {renderWithSuperscript(section.heading.sq)}
                  <span className="block pl-7 text-xs text-slate-500">{renderWithSuperscript(section.heading.en)}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12">
          {forecastSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-36">
              <h2 className="border-l-4 border-primary-500 pl-3 text-2xl font-bold text-[#30384B] dark:text-white">
                {renderRich(section.heading.sq, section.heading.italicSq)}
              </h2>
              <p className="mt-1 pl-4 text-sm text-slate-500 dark:text-slate-400">
                {renderRich(section.heading.en, section.heading.italicEn)}
              </p>
              {section.caption ? (
                <div className="mt-2 pl-4">
                  <Bi text={section.caption} sqClassName="text-sm italic text-slate-600 dark:text-slate-300" enClassName="text-xs italic text-slate-500 dark:text-slate-400" />
                </div>
              ) : null}
              <div className="mt-4 space-y-4">
                {section.blocks.map((block, index) => renderBlock(block, index))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
};

export default Forecast2027Page;
