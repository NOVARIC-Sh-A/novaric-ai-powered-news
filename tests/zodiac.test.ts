// tests/zodiac.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { zodiacSign, ZODIAC_BOUNDARIES } from '../lib/zodiac';

describe('NOVARIC® Zodiac Utility Tests (lib/zodiac.ts)', () => {
  it('15.10.1944 -> Peshorja (♎)', () => {
    const res = zodiacSign('15.10.1944');
    assert.ok(res);
    assert.equal(res.name, 'Peshorja');
    assert.equal(res.glyph, '♎');
  });

  it('04.07.1964 -> Gaforrja (♋)', () => {
    const res = zodiacSign('04.07.1964');
    assert.ok(res);
    assert.equal(res.name, 'Gaforrja');
    assert.equal(res.glyph, '♋');
  });

  it('24.03.1969 -> Dashi (♈)', () => {
    const res = zodiacSign('24.03.1969');
    assert.ok(res);
    assert.equal(res.name, 'Dashi');
    assert.equal(res.glyph, '♈');
  });

  it('12.06.1974 -> Binjakët (♊)', () => {
    const res = zodiacSign('12.06.1974');
    assert.ok(res);
    assert.equal(res.name, 'Binjakët');
    assert.equal(res.glyph, '♊');
  });

  it('ISO format support: 1944-10-15 -> Peshorja', () => {
    const res = zodiacSign('1944-10-15');
    assert.ok(res);
    assert.equal(res.name, 'Peshorja');
    assert.equal(res.glyph, '♎');
  });

  it('null / empty input returns null', () => {
    assert.equal(zodiacSign(null), null);
    assert.equal(zodiacSign(undefined), null);
    assert.equal(zodiacSign(''), null);
    assert.equal(zodiacSign('not-a-date'), null);
  });

  it('every boundary day behaves predictably', () => {
    // Check boundary dates array: [19, 20, 21, 22, 23, 23, 23, 22, 22, 22, 19, 20]
    // Jan boundary: 19 (Jan 19 is Bricjapi, Jan 20 is Ujori)
    assert.equal(zodiacSign('19.01.2000')?.name, 'Bricjapi');
    assert.equal(zodiacSign('20.01.2000')?.name, 'Ujori');

    // Feb boundary: 20
    assert.equal(zodiacSign('20.02.2000')?.name, 'Ujori');
    assert.equal(zodiacSign('21.02.2000')?.name, 'Peshqit');

    // Mar boundary: 21
    assert.equal(zodiacSign('21.03.2000')?.name, 'Peshqit');
    assert.equal(zodiacSign('22.03.2000')?.name, 'Dashi');

    // Apr boundary: 22
    assert.equal(zodiacSign('22.04.2000')?.name, 'Dashi');
    assert.equal(zodiacSign('23.04.2000')?.name, 'Demi');

    // May boundary: 23
    assert.equal(zodiacSign('23.05.2000')?.name, 'Demi');
    assert.equal(zodiacSign('24.05.2000')?.name, 'Binjakët');

    // Jun boundary: 23
    assert.equal(zodiacSign('23.06.2000')?.name, 'Binjakët');
    assert.equal(zodiacSign('24.06.2000')?.name, 'Gaforrja');

    // Jul boundary: 23
    assert.equal(zodiacSign('23.07.2000')?.name, 'Gaforrja');
    assert.equal(zodiacSign('24.07.2000')?.name, 'Luani');

    // Aug boundary: 22
    assert.equal(zodiacSign('22.08.2000')?.name, 'Luani');
    assert.equal(zodiacSign('23.08.2000')?.name, 'Virgjëresha');

    // Sep boundary: 22
    assert.equal(zodiacSign('22.09.2000')?.name, 'Virgjëresha');
    assert.equal(zodiacSign('23.09.2000')?.name, 'Peshorja');

    // Oct boundary: 22
    assert.equal(zodiacSign('22.10.2000')?.name, 'Peshorja');
    assert.equal(zodiacSign('23.10.2000')?.name, 'Akrepi');

    // Nov boundary: 19
    assert.equal(zodiacSign('19.11.2000')?.name, 'Akrepi');
    assert.equal(zodiacSign('20.11.2000')?.name, 'Shigjetari');

    // Dec boundary: 20
    assert.equal(zodiacSign('20.12.2000')?.name, 'Shigjetari');
    assert.equal(zodiacSign('21.12.2000')?.name, 'Bricjapi');
  });
});
