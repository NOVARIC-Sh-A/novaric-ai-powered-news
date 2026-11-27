import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { mediaProfilesData } from '../data/mediaProfiles';
import { getMaragonResearch } from '../services/maragonResearchLoader';
import draftCoding from '../data/maragon/show_top_story.draft-coding.json';
import { formatPersonName } from '../utils/formatPersonName';
import { isMaragonAssessmentPublished } from '../utils/maragonPublication';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Grida Duma is a MARAGON media profile', () => {
  const exportData = JSON.parse(read('db/paragon_scores_export.json'));
  const person = getMaragonResearch('vip_m2');
  const show = getMaragonResearch('show_top_story');
  const card = mediaProfilesData.find((profile) => profile.id === 'vip_m2');

  it('does not add her to the PARAGON roster', () => {
    assert.equal(exportData.profiles.some((profile: { name?: string }) => /duma/i.test(profile.name || '')), false);
    assert.equal(exportData.total_profiles, 234);
  });

  it('keeps the practitioner draft unpublished and unscored', () => {
    assert.ok(card);
    assert.equal(card?.category, 'Media');
    assert.equal(formatPersonName(card?.name), 'Grida DUMA');
    assert.equal(card?.maragonAssessmentStatus, 'not_assessed');
    assert.equal(card?.biographyStatus, 'draft');
    assert.equal(card?.scoringSuspended, true);
    assert.equal(card?.composite ?? null, null);
    assert.equal(card?.dynamicScore ?? null, null);
    assert.equal(card?.maragonAnalysis, undefined);
    assert.equal(isMaragonAssessmentPublished(card), false);
    assert.equal(person?.meta.methodologyApproved, false);
    assert.equal(person?.publication.assessmentStatus, 'research_only');
    assert.equal(person?.publication.biographyStatus, 'draft');
    assert.equal(person?.scoring.composite, null);
    assert.equal(person?.subject.fullName, 'Grida DUMA');
    assert.ok(person?.indicators.filter((item) => item.id !== 'maragon:C').every((item) => item.score === null && item.status === 'not_assessed'));
    assert.match(person?.subject.detailedBio_sq || '', /^Grida DUMA është autore, moderatore dhe drejtuese/);
    assert.match(person?.subject.detailedBio_en || '', /^Grida DUMA is the author, moderator and host/);
    assert.doesNotMatch(card?.primaryRole || '', /Deputet|deputete|\bMP\b/i);
    assert.match(card?.shortBio || '', /Në të shkuarën/);
  });

  it('records Top Story as linked to Grida DUMA and with no score', () => {
    assert.equal(show?.subject.fullName, 'Top Story');
    assert.equal(show?.meta.methodologyApproved, false);
    assert.equal(show?.publication.assessmentStatus, 'research_only');
    assert.equal(show?.scoring.composite, null);
    assert.equal((show?.scoring as { linkedHostId?: string | null }).linkedHostId, 'vip_m2');
    assert.ok(show?.indicators.every((item) => item.score === null));
    assert.ok(show?.evidenceRegister.some((item) => item.url?.includes('top-channel.tv')));
    assert.equal(draftCoding.label, 'DRAFT – research_only – not for publication');
    assert.equal(draftCoding.methodologyApproved, false);
    assert.equal(draftCoding.composite, null);
    assert.equal(draftCoding.indicators.find((item) => item.id === 'maragon:R1.1')?.band, null);
    assert.equal(draftCoding.indicators.find((item) => item.id === 'maragon:O4.2')?.band, 'strong');
    assert.equal(draftCoding.episodes.length, 8);
  });

  it('shows the owner-supplied portrait and leaves the research dossier photo unchanged', () => {
    assert.equal(card?.imageUrl, '/media-personalities/portraits/grida-duma-450x600.jpg');
    assert.equal(card?.photoPending, false);
    assert.equal(card?.photoCredit, 'Owner-supplied, 22 Nov 2026 (source to be recorded)');
    assert.equal(person?.photo.imageUrl, 'https://kuvendiwebfiles.blob.core.windows.net/webfiles/gridashqina_foto.jpg');
  });
});
