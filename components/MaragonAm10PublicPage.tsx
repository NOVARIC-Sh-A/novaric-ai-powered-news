import React from 'react';
import { JsonLd } from './JsonLd';
import { useSeo } from '../hooks/useSeo';
import { renderWithSuperscript } from '../utils/textUtils';
import { maragonAm10Seo } from '../utils/routeSeo';
import { MARAGON_AM10_MARKDOWN } from './maragonAm10PublicText';

interface MaragonAm10PublicPageProps {
  onBack: () => void;
}

type Block =
  | { kind: 'h'; level: 1 | 2 | 3; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'quote'; paragraphs: string[] }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  | { kind: 'table'; headers: string[]; rows: string[][] };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') {
      i += 1;
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = Math.min(heading[1].length, 3) as 1 | 2 | 3;
      blocks.push({ kind: 'h', level, text: heading[2] });
      i += 1;
      continue;
    }

    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      const paragraphs: string[] = [];
      let buffer: string[] = [];
      const flush = () => {
        const text = buffer.join(' ').trim();
        if (text) paragraphs.push(text);
        buffer = [];
      };
      for (const quoteLine of quoteLines) {
        if (quoteLine.trim() === '') flush();
        else buffer.push(quoteLine.trim());
      }
      flush();
      blocks.push({ kind: 'quote', paragraphs });
      continue;
    }

    if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        const cells = lines[i].replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
        const separator = cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
        if (!separator) rows.push(cells);
        i += 1;
      }
      blocks.push({ kind: 'table', headers: rows[0] ?? [], rows: rows.slice(1) });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      blocks.push({ kind: 'ol', items });
      continue;
    }

    if (/^-\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s/.test(lines[i])) {
        items.push(lines[i].replace(/^-\s+/, ''));
        i += 1;
      }
      blocks.push({ kind: 'ul', items });
      continue;
    }

    blocks.push({ kind: 'p', text: line.trim() });
    i += 1;
  }

  return blocks;
}

const Rich: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter((part) => part !== '');
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return <strong key={index}>{renderWithSuperscript(part.slice(2, -2))}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
          return <em key={index}>{renderWithSuperscript(part.slice(1, -1))}</em>;
        }
        return <React.Fragment key={index}>{renderWithSuperscript(part)}</React.Fragment>;
      })}
    </>
  );
};

const headingClass: Record<1 | 2 | 3, string> = {
  1: 'text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 leading-tight',
  2: 'mt-10 text-2xl font-bold text-slate-900 dark:text-slate-50',
  3: 'mt-8 text-xl font-semibold text-slate-900 dark:text-slate-50',
};

function renderBlock(block: Block, index: number): React.ReactNode {
  if (block.kind === 'h') {
    const Tag = (`h${block.level}` as 'h1' | 'h2' | 'h3');
    return (
      <Tag key={index} className={headingClass[block.level]}>
        <Rich text={block.text} />
      </Tag>
    );
  }

  if (block.kind === 'p') {
    return (
      <p key={index} className="mt-4 text-base leading-relaxed text-slate-800 dark:text-slate-100">
        <Rich text={block.text} />
      </p>
    );
  }

  if (block.kind === 'quote') {
    return (
      <blockquote key={index} className="my-6 border-l-4 border-primary-500 bg-slate-50 px-4 py-3 dark:bg-slate-900/60">
        {block.paragraphs.map((paragraph, paragraphIndex) => (
          <p key={paragraphIndex} className="mt-3 text-base leading-relaxed text-slate-800 first:mt-0 dark:text-slate-100">
            <Rich text={paragraph} />
          </p>
        ))}
      </blockquote>
    );
  }

  if (block.kind === 'ul' || block.kind === 'ol') {
    const List = block.kind === 'ul' ? 'ul' : 'ol';
    const listClass = block.kind === 'ul'
      ? 'my-4 list-disc space-y-2 pl-6 text-slate-800 dark:text-slate-100'
      : 'my-4 list-decimal space-y-2 pl-6 text-slate-800 dark:text-slate-100';
    return (
      <List key={index} className={listClass}>
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex} className="leading-relaxed">
            <Rich text={item} />
          </li>
        ))}
      </List>
    );
  }

  const showHeader = block.headers.some((cell) => cell.length > 0);
  return (
    <div key={index} className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {showHeader && (
          <thead className="bg-slate-100 dark:bg-slate-900">
            <tr>
              {block.headers.map((cell, cellIndex) => (
                <th key={cellIndex} className="border border-slate-300 px-3 py-2 text-left align-top font-semibold text-slate-900 dark:border-slate-600 dark:text-slate-50">
                  <Rich text={cell} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-800 dark:even:bg-slate-900/40">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-slate-300 px-3 py-2 align-top text-slate-800 dark:border-slate-600 dark:text-slate-100">
                  <Rich text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const MaragonAm10PublicPage: React.FC<MaragonAm10PublicPageProps> = ({ onBack }) => {
  const seo = maragonAm10Seo();
  useSeo(seo.title, seo.description, seo.image, seo.url, 'sq_AL', seo.imageAlt, seo.type === 'article' ? 'article' : 'website', seo.author);
  const blocks = parseBlocks(MARAGON_AM10_MARKDOWN);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      {seo.jsonLd ? <JsonLd data={seo.jsonLd as object} /> : null}
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center rounded-md bg-slate-100 px-4 py-2 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          aria-label="Kthehu Pas"
        >
          &larr; <span className="ml-2">Kthehu Pas</span>
        </button>
        <article id="maragon-am10-public" className="rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800 sm:p-8">
          {blocks.map(renderBlock)}
        </article>
      </div>
    </main>
  );
};

export default MaragonAm10PublicPage;
