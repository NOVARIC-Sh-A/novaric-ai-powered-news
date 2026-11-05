import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  PHOTO_CREDIT_UNVERIFIED,
  FALLBACK_OBJECT_POSITION,
  buildPortraitAttribution,
  creditForSource,
  derivedSources,
  objectPositionFor,
} from '../utils/portraitStandard';

describe('Portrait attribution uses only stored provenance', () => {
  it('credits Kuvendi when the stored licence names the Parliament', () => {
    const attribution = buildPortraitAttribution({
      id: 'vip4',
      imageUrl: 'https://kuvendiwebfiles.blob.core.windows.net/webfiles/lulzim.jpg',
      photoLicence: 'No reuse licence published by the Parliament of Albania. Referenced by URL; file not copied.',
      photo_source_url: 'https://kuvendiwebfiles.blob.core.windows.net/webfiles/lulzim.jpg',
      fieldSources: { photo: { sourceUrl: 'https://kuvendiwebfiles.blob.core.windows.net/webfiles/lulzim.jpg', licence: 'No reuse licence published by the Parliament of Albania. Referenced by URL; file not copied.', retrievedAt: '2026-10-31' } },
    });
    assert.equal(attribution.attributionStatus, 'verified');
    assert.equal(attribution.credit, 'Foto: Kuvendi i Shqipërisë');
    assert.equal(attribution.photographer, null);
    assert.equal(attribution.licensingIssue, true);
    assert.equal(creditForSource('Kuvendi i Shqipërisë'), 'Foto: Kuvendi i Shqipërisë');
  });

  it('uses the publisher already written in the photo notes', () => {
    const attribution = buildPortraitAttribution({
      id: 'vip1',
      imageUrl: '/politicians/official/vip1.jpg',
      photo_source_url: 'https://ps.al/kryesia/',
      fieldSources: {
        photo: {
          sourceUrl: 'https://ps.al/kryesia/',
          licence: 'Published by the institution; local copy for display.',
          notes: 'Publisher: Partia Socialiste e Shqipërisë.',
          retrievedAt: '2026-10-31',
        },
      },
    });
    assert.equal(attribution.sourceName, 'Partia Socialiste e Shqipërisë');
    assert.equal(attribution.credit, 'Foto: Partia Socialiste e Shqipërisë');
    assert.equal(attribution.licensingIssue, false);
  });

  it('does not invent a credit for a photo with no publisher', () => {
    const attribution = buildPortraitAttribution({
      id: 'vip9',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a.jpg',
      fieldSources: { photo: { sourceUrl: 'https://upload.wikimedia.org/wikipedia/commons/a.jpg' } },
    });
    assert.equal(attribution.attributionStatus, 'pending');
    assert.equal(attribution.credit, PHOTO_CREDIT_UNVERIFIED);
    assert.equal(attribution.photographer, null);
  });

  it('uses the neutral line and no licence issue when the photo is missing', () => {
    const attribution = buildPortraitAttribution({ id: 'vip282', name: 'Nard Ndoka', imageUrl: null, photoPending: true });
    assert.equal(attribution.attributionStatus, 'unknown');
    assert.equal(attribution.originalImageUrl, null);
    assert.equal(attribution.credit, PHOTO_CREDIT_UNVERIFIED);
    assert.equal(attribution.licensingIssue, false);
    assert.equal(objectPositionFor('vip-not-in-file', false), FALLBACK_OBJECT_POSITION);
  });

  it('keeps a derived crop only when a face was detected and the crop is not flagged', () => {
    const frames = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'data/official/portrait_frames.json'), 'utf8'));
    const review = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'data/official/portrait_editorial_review.json'), 'utf8'));
    const profiles = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'db/paragon_scores_export.json'), 'utf8')).profiles;
    assert.equal(frames.recognition, false);
    assert.match(fs.readFileSync(path.resolve(process.cwd(), 'index.tsx'), 'utf8'), /politician-portrait\.css/);
    assert.match(frames.note, /not manually verified/);
    assert.equal(review.reviewer, null);
    assert.equal(Object.keys(frames.frames).length, profiles.length);
    for (const profile of profiles) {
      const frame = frames.frames[profile.id];
      const record = review.records[profile.id];
      assert.ok(frame, profile.id);
      assert.equal(record.usageRightsReviewed, false);
      assert.equal(record.reviewer, null);
      assert.equal(frame.editorialOverride, false);
      if (frame.uncertain || !frame.faceDetected) {
        assert.equal(derivedSources(profile.id), null);
        assert.equal(objectPositionFor(profile.id, false), FALLBACK_OBJECT_POSITION);
      } else {
        const derived = derivedSources(profile.id);
        assert.ok(derived);
        assert.equal(derived.src, frame.derived600);
        assert.ok(fs.existsSync(path.resolve(process.cwd(), 'public', frame.derived600.replace(/^\//, ''))));
        assert.ok(fs.existsSync(path.resolve(process.cwd(), 'public', frame.derived300.replace(/^\//, ''))));
      }
      const attribution = buildPortraitAttribution(profile);
      assert.equal(attribution.photographer, null);
      assert.equal(attribution.copyrightHolder, null);
      if (!attribution.originalImageUrl) {
        assert.equal(attribution.credit, PHOTO_CREDIT_UNVERIFIED);
      }
    }
  });
});
