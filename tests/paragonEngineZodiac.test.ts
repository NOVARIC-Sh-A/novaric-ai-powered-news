import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runAnalysisForVip, runParagonAnalysis } from '../services/paragonEngine';

describe('PARAGON engine rejects zodiac as a scoring input', () => {
  const enginePath = path.resolve(process.cwd(), 'services/paragonEngine.ts');
  const pythonPath = path.resolve(process.cwd(), 'services/paragon_scoring_engine.py');

  it('paragonEngine.ts does not read a zodiac or star-sign input', () => {
    const source = fs.readFileSync(enginePath, 'utf8');
    assert.doesNotMatch(source, /zodiac|starSign|star_sign|astrology|shenj[ae]/i);
  });

  it('the Python scoring engine does not read a zodiac input', () => {
    const source = fs.readFileSync(pythonPath, 'utf8');
    assert.doesNotMatch(source, /zodiac|star_sign|starSign|astrology/i);
  });

  it('changing zodiacSign on a profile does not change PARAGON scores', () => {
    const base = {
      id: 'vip2',
      name: 'Sali Berisha',
      imageUrl: '',
      category: 'Politikë (PD-AMSH)',
      shortBio: '',
      detailedBio: '',
      dateOfBirth: '1944-10-15',
      paragonAnalysis: [
        { dimension: 'D1', score: 41 },
        { dimension: 'D2', score: 55 },
        { dimension: 'D3', score: 33 },
        { dimension: 'D4', score: 70 },
        { dimension: 'D5', score: 62 },
        { dimension: 'D6', score: 48 },
        { dimension: 'D7', score: 51 },
      ],
    };
    const libra = runAnalysisForVip({ ...base, zodiacSign: 'Peshorja' } as any);
    const aries = runAnalysisForVip({ ...base, zodiacSign: 'Dashi' } as any);
    const none = runAnalysisForVip(base as any);
    assert.deepEqual(libra.performanceAnalysis.individualScores, aries.performanceAnalysis.individualScores);
    assert.deepEqual(libra.performanceAnalysis.individualScores, none.performanceAnalysis.individualScores);
    assert.equal((libra.profileInput.personal as any).zodiacSign, undefined);
    assert.equal((aries.profileInput.personal as any).zodiacSign, undefined);
  });

  it('runParagonAnalysis ignores a zodiac field if a caller still attaches one', () => {
    const scores = [10, 20, 30, 40, 50, 60, 70];
    const withSign = runParagonAnalysis({
      personal: {
        fullName: 'Test',
        dob: '1944-10-15',
        zodiacSign: 'Peshorja',
      } as any,
      educationHistory: [],
      workHistory: [],
      politicalHistory: [],
      keyLifeEvents: [],
    }, scores);
    const withoutSign = runParagonAnalysis({
      personal: { fullName: 'Test', dob: '1944-10-15' },
      educationHistory: [],
      workHistory: [],
      politicalHistory: [],
      keyLifeEvents: [],
    }, scores);
    assert.deepEqual(withSign.performanceAnalysis.individualScores, withoutSign.performanceAnalysis.individualScores);
    assert.deepEqual(withSign.performanceAnalysis.individualScores, scores);
  });
});
