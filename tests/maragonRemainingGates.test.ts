import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { mediaProfilesData } from '../data/mediaProfiles';
import { mockTvShows } from '../data/mockTvShows';
import { fetchMaragonReport } from '../services/dataService';
import {
  maragonScoresArePublic,
  maragonShowScoresArePublic,
  rankableMaragonScore,
} from '../utils/maragonPublication';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('MARAGON scores stay gated on the remaining surfaces', () => {
  const vip = mediaProfilesData.find((profile) => profile.id === 'vip_m1');
  const opinion = mockTvShows.find((show) => show.name === 'Opinion');

  it('hides Opinion gauges while the show and its host are unassessed', () => {
    assert.ok(opinion);
    assert.equal(opinion?.statistics.audienceImpact, 85);
    assert.equal(opinion?.maragonSummary?.Readiness, 90);
    assert.equal(maragonShowScoresArePublic(opinion, null), false);
    assert.equal(maragonShowScoresArePublic(opinion, vip), false);
    assert.equal(maragonShowScoresArePublic({
      maragonAssessmentStatus: 'approved',
      methodologyApproved: true,
    }, vip), false);
    assert.equal(maragonShowScoresArePublic({
      maragonAssessmentStatus: 'approved',
      methodologyApproved: true,
    }, null), true);
  });

  it('keeps the mock report numbers stored and unpublished', async () => {
    const report = await fetchMaragonReport('vip_m1', 'individual');
    assert.equal(report.compositeScore, 82);
    assert.equal(report.Readiness, 88);
    assert.equal(maragonScoresArePublic(report), false);
    assert.equal(maragonScoresArePublic({
      assessmentStatus: 'approved',
      methodologyApproved: false,
    }), false);
    assert.equal(maragonScoresArePublic({
      assessmentStatus: 'approved',
      scoringSuspended: true,
      methodologyApproved: true,
    }), false);
    assert.equal(maragonScoresArePublic({
      maragonAssessmentStatus: 'approved',
      methodologyApproved: true,
    }), true);
  });

  it('does not rank an unknown or unapproved score as zero', () => {
    assert.equal(rankableMaragonScore(vip), null);
    assert.equal(rankableMaragonScore({
      maragonAssessmentStatus: 'not_assessed',
      processedAnalysis: { overallScore: 0 },
    }), null);
    assert.equal(rankableMaragonScore({
      maragonAssessmentStatus: 'approved',
      maragonAnalysis: [],
      processedAnalysis: { overallScore: 0 },
    }), 0);
    assert.equal(rankableMaragonScore({
      maragonAssessmentStatus: 'approved',
      averageMaragonScore: 0,
    }), 0);
    assert.equal(rankableMaragonScore({
      maragonAssessmentStatus: 'approved',
      processedAnalysis: { overallScore: undefined },
    }), null);
  });

  it('wires the gate into the show, report, comparison, and ranking views', () => {
    const show = read('components/TvShowPage.tsx');
    const report = read('components/MaragonReportPage.tsx');
    const comparison = read('components/ComparisonModal.tsx');
    const ranking = read('components/Top10MediaInfluencers.tsx');
    const presenter = read('components/PresenterAnalysisPage.tsx');
    assert.match(show, /maragonShowScoresArePublic/);
    assert.match(show, /notAssessedLabel/);
    assert.match(report, /maragonScoresArePublic/);
    assert.match(report, /notAssessedLabel/);
    assert.match(comparison, /isMaragonAssessmentPublished/);
    assert.doesNotMatch(comparison, /\?\? 0/);
    assert.doesNotMatch(comparison, /averageMaragonScore \/ 10/);
    assert.match(ranking, /rankableMaragonScore/);
    assert.doesNotMatch(ranking, /\?\? 0/);
    assert.match(presenter, /isMaragonAssessmentPublished/);
  });
});
