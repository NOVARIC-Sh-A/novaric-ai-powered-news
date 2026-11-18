import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { forecastSections, DATA_PENDING_LABEL, FORECAST_PATH } from '../data/forecast2027';

const text = JSON.stringify(forecastSections);
const page = readFileSync(new URL('../components/Forecast2027Page.tsx', import.meta.url), 'utf8');
const sidebar = readFileSync(new URL('../components/RightSidebar.tsx', import.meta.url), 'utf8');
const headerMenu = readFileSync(new URL('../components/HeaderMenu.tsx', import.meta.url), 'utf8');

describe('NOVARIC® Forecast 2027', () => {
  it('keeps the paper sections and does not invent a missing figure', () => {
    const ids = forecastSections.map((section) => section.id);
    assert.deepEqual(ids, [
      'status',
      'house-view',
      'macro',
      'b1',
      'b2',
      'b3',
      'b4',
      'b5',
      'portfolio',
      'watch',
      'next',
      'disclaimer',
      'gaps',
      'sources',
      'decisions',
    ]);
    for (const figure of [
      '3.2–3.6%',
      '2.8–3.0%',
      '8.3%',
      '1,469',
      '570',
      '434',
      '465',
      '1.2%',
      '371',
      '88',
      '907.9',
      '15.5 million',
      '10,730,391',
      '17,476,873',
      '90.48',
      '82.37',
      '41.7%',
      '9.9 months',
      '50% (judgment)',
      '55% (judgment)',
      '25% (judgment)',
      'as recomened',
      'NOVARIC® Forcast',
      '7810',
    ]) {
      assert.ok(text.includes(figure), `missing figure: ${figure}`);
    }
    assert.equal(DATA_PENDING_LABEL, 'Pa të dhëna / Data pending');
    assert.equal(FORECAST_PATH, '/forecast-2027');
  });

  it('drops internal paths and keeps the public draft boundary', () => {
    const bundle = `${text}\n${page}\n${sidebar}\n${headerMenu}`;
    assert.equal(bundle.includes('/workspace/'), false);
    assert.equal(bundle.includes('arbitrage-20261118'), false);
    assert.equal(bundle.includes('#1B2A3B'), false);
    assert.equal(bundle.includes('grok/canvas'), false);
    assert.equal(text.includes('PARAGON'), false);
    assert.equal(text.includes('MARAGON'), false);
    assert.ok(page.includes('Botim paraprak / Draft edition — në pritje të nënshkrimit nga Dr Alban Gj. THIKA dhe rishikimit ligjor të mohimit të përgjegjësisë'));
    assert.ok(page.includes('This is not investment advice.'));
    assert.ok(page.includes('Ky dokument nuk është këshillë investimi.'));
    assert.ok(page.includes('DATA_PENDING_LABEL'));
    assert.ok(page.includes('NOVARIC® internal data'));
    assert.ok(sidebar.includes('Forecast 2027'));
    assert.ok(sidebar.includes('Parashikimi 2027'));
    assert.ok(headerMenu.includes('Forecast 2027'));
  });
});
