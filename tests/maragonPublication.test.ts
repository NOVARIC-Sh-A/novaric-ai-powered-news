import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { mediaProfilesData } from '../data/mediaProfiles';
import {
  firstPublishedScore,
  isMaragonAssessmentPublished,
  meanMeasured,
  measuredNumber,
  isMaragonBiographyPublic,
  maragonPreviewFromEnv,
  notAssessedLabel,
  publishedMaragonAverage,
  publishedSeries,
  publishedTrajectory,
} from '../utils/maragonPublication';
import { isPoliticianIdentity, politicianPathId, routeFromLocation } from '../utils/politicianNavigation';
import { validatedMaragonResearch } from '../services/maragonResearchLoader';
import { MaragonResearchPayloadSchema } from '../lib/maragon-schemas';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('MARAGON publication stays closed until an assessment is approved', () => {
  const vip = mediaProfilesData.find((profile) => profile.id === 'vip_m1');

  it('keeps the stored vip_m1 numbers and marks the profile not assessed', () => {
    assert.ok(vip);
    assert.equal(vip?.maragonAssessmentStatus, 'research_only');
    assert.equal(vip?.biographyStatus, 'draft');
    assert.equal(vip?.photoPending, true);
    assert.equal(vip?.imageUrl, '');
    assert.equal(vip?.scoringSuspended, true);
    assert.equal(vip?.dynamicScore, 88);
    assert.equal(vip?.maragonAnalysis?.length, 7);
    assert.equal(vip?.maragonAnalysis?.[0].score, 85);
  });

  it('does not publish a score unless the assessment is approved and scoring is open', () => {
    assert.equal(isMaragonAssessmentPublished(undefined), false);
    assert.equal(isMaragonAssessmentPublished({}), false);
    assert.equal(isMaragonAssessmentPublished({ maragonAssessmentStatus: 'not_assessed' }), false);
    assert.equal(isMaragonAssessmentPublished({ maragonAssessmentStatus: 'research_only' }), false);
    assert.equal(isMaragonAssessmentPublished({ maragonAssessmentStatus: 'withheld' }), false);
    assert.equal(isMaragonAssessmentPublished({ maragonAssessmentStatus: 'pending_review' }), false);
    assert.equal(isMaragonAssessmentPublished({ maragonAssessmentStatus: 'withheld' }), false);
    assert.equal(isMaragonAssessmentPublished({ maragonAssessmentStatus: 'suspended' }), false);
    assert.equal(isMaragonAssessmentPublished({ maragonAssessmentStatus: 'approved', scoringSuspended: true }), false);
    assert.equal(isMaragonAssessmentPublished({ maragonAssessmentStatus: 'approved' }), true);
    assert.equal(isMaragonAssessmentPublished({ maragonAssessmentStatus: 'approved', scoringSuspended: false }), true);
  });

  it('keeps a measured zero and does not invent one for a gap', () => {
    assert.equal(measuredNumber(0), 0);
    assert.equal(measuredNumber(undefined), null);
    assert.equal(measuredNumber(null), null);
    assert.equal(measuredNumber(Number.NaN), null);
    assert.equal(meanMeasured([]), null);
    assert.equal(meanMeasured([null, undefined]), null);
    assert.equal(meanMeasured([0, 0]), 0);
    assert.equal(meanMeasured([0, 10]), 5);

    const approved = { maragonAssessmentStatus: 'approved' as const };
    assert.equal(firstPublishedScore(vip, [88, 0]), null);
    assert.equal(firstPublishedScore(approved, [undefined, 0, 12]), 0);
    assert.equal(publishedMaragonAverage(vip), null);
    assert.equal(publishedMaragonAverage({ ...approved, maragonAnalysis: [] }), null);
    assert.equal(publishedMaragonAverage({ ...approved, maragonAnalysis: [{ score: 0 }, { score: 0 }] }), 0);
    assert.deepEqual(publishedSeries(vip, [0, 10]), null);
    assert.deepEqual(publishedSeries(approved, [0, null, 10]), [0, null, 10]);
    assert.equal(publishedTrajectory(vip, 'Compromised'), null);
    assert.equal(publishedTrajectory(approved, 'Compromised'), null);
    assert.equal(publishedTrajectory(approved, 'Ascending'), 'Ascending');
    assert.equal(publishedTrajectory(approved, undefined), null);
    assert.equal(notAssessedLabel('sq'), 'Pa vlerësim');
    assert.equal(notAssessedLabel('en'), 'Not assessed');
  });

  it('does not join a media id to a PARAGON politician', () => {
    assert.equal(isPoliticianIdentity('vip_m1'), false);
    assert.equal(isPoliticianIdentity('vip2'), true);
    assert.equal(politicianPathId('vip_m1'), '');
    assert.equal(routeFromLocation('/', '?page=vipProfilePage&id=vip_m1'), null);
    assert.deepEqual(routeFromLocation('/', '?page=vipProfilePage&id=vip2'), { page: 'vipProfilePage', id: 'vip2' });
    assert.deepEqual(routeFromLocation('/figurat-politike/sali-berisha', ''), { page: 'vipProfilePage', id: 'vip2' });

    const page = read('components/MediaPersonalitiesPage.tsx');
    assert.doesNotMatch(page, /getLatestParagonScores/);
    assert.doesNotMatch(page, /processVipProfile/);
    assert.doesNotMatch(page, /replace\(\\D\/g/);
    const card = read('components/MediaPersonalityCard.tsx');
    assert.doesNotMatch(card, /evolutionaryStatus:\s*"Compromised"/);
    assert.doesNotMatch(card, /Nga Investigues në Opinionist/);
    assert.doesNotMatch(card, /\?\? 0/);
    assert.doesNotMatch(card, /fshf\.org/);
    assert.doesNotMatch(card, /MaleProfile\.jpg/);
  });

  it('keeps biography and the research dossier off the public surface', () => {
    assert.equal(isMaragonBiographyPublic({ biographyStatus: 'draft' }, false), false);
    assert.equal(isMaragonBiographyPublic({ biographyStatus: 'draft' }, true), true);
    assert.equal(isMaragonBiographyPublic({ biographyStatus: 'approved' }, false), true);
    assert.equal(maragonPreviewFromEnv(false, '?maragonPreview=1'), false);
    assert.equal(maragonPreviewFromEnv(true, '?maragonPreview=1'), true);
    assert.equal(maragonPreviewFromEnv(true, ''), false);

    const dossier = validatedMaragonResearch();
    assert.equal(dossier.subject.id, 'vip_m1');
    assert.equal(dossier.publication.assessmentStatus, 'research_only');
    assert.equal(dossier.publication.biographyStatus, 'draft');
    assert.equal(dossier.publication.authorizedForPublicDisplay, false);
    assert.equal(dossier.scoring.scoringSuspended, true);
    assert.equal(dossier.scoring.composite, null);
    assert.equal(dossier.photo.photoPending, true);
    assert.equal(dossier.photo.imageUrl, null);
    assert.equal(dossier.trajectory.status, 'not_assessed');
    assert.equal(dossier.indicators.filter((item) => item.id !== 'maragon:C').length, 10);
    assert.ok(dossier.indicators.every((item) => item.score === null));

    const broken = structuredClone(dossier);
    broken.indicators[0].evidenceIds = ['EV-DOES-NOT-EXIST'];
    assert.equal(MaragonResearchPayloadSchema.safeParse(broken).success, false);

    const scored = structuredClone(dossier);
    scored.indicators[0].score = Number.NaN;
    assert.equal(MaragonResearchPayloadSchema.safeParse(scored).success, false);
    scored.indicators[0].score = 0;
    assert.equal(MaragonResearchPayloadSchema.safeParse(scored).success, true);
  });
});
