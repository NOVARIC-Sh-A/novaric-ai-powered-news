import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { projectLiveScoring, publicPayloadHasScoreNumber, publicPayloadLeaksPeerAverage, stripDraftNumbers } from '../utils/maragonLiveScoring';
import { MARAGON_LIVE_SCORING_FILE } from '../data/maragon/scoring/activeSource';
import { AM09_COHORT_20, AM09_DRAFT_APPROVALS } from '../data/maragon/approvals';
import { accountIsRenderable, confirmedSocialUrls, heldBrandAccounts } from '../utils/maragonSocialAccounts';
import { mediaProfilesData } from '../data/mediaProfiles';
import { MediaPortrait } from '../components/maragon/MediaPortrait';
import { LiveIndicatorList } from '../components/maragon/MaragonLiveScore';

const root = path.resolve(process.cwd());
const raw = JSON.parse(fs.readFileSync(path.join(root, 'data/maragon/scoring', MARAGON_LIVE_SCORING_FILE), 'utf8'));

describe('MARAGON live scoring v0.2', () => {
  const draft = projectLiveScoring(raw, 'draft-values');
  const bands = projectLiveScoring(raw, 'bands-only');
  const byId = (payload: typeof draft, id: string) => payload.profiles.find((profile) => profile.id === id)!;

  it('reads v0.2 and keeps peer averages out of the public payload', () => {
    assert.equal(raw.meta.documentId, 'REG-COM-MARAGON-LIVE-SCORING-v0.2-20261127');
    assert.equal(raw.meta.peerAverages.indicators[0].mean, 42.2);
    assert.equal(publicPayloadLeaksPeerAverage(draft), false);
    assert.equal(publicPayloadLeaksPeerAverage(bands), false);
    assert.equal(JSON.stringify(draft).includes('42.2'), false);
    assert.equal(JSON.stringify(bands).includes('42.2'), false);
    assert.equal(publicPayloadHasScoreNumber(bands), false);
  });

  it('shows the eight draft cells and leaves every other indicator unassessed', () => {
    const expectValue = (id: string, code: string, value: number) => {
      const cell = byId(draft, id).indicators.find((item) => item.code === code);
      assert.equal(cell?.draftValue, value);
      assert.ok(cell?.band);
    };
    expectValue('vip_m9', 'R1.1', 50);
    expectValue('vip_m1', 'R1.1', 23);
    expectValue('vip_m1', 'G3.1-I', 50);
    expectValue('vip_m10', 'G3.1-I', 50);
    expectValue('vip_m2', 'R1.2', 30);
    expectValue('vip_m14', 'R1.1', 50);
    expectValue('vip_m27', 'R1.1', 30);
    expectValue('vip_m15', 'R1.1', 50);
    expectValue('vip_m13', 'R1.1', 50);
    for (const profile of draft.profiles) {
      assert.equal(profile.composite, null);
      assert.equal(profile.indicators.some((item) => item.id === 'maragon:C'), false);
      for (const item of profile.indicators) {
        if (item.draftValue == null) assert.equal(item.band, null);
        assert.notEqual(item.draftValue, 0);
      }
    }
    const hidden = byId(bands, 'vip_m14').indicators.find((item) => item.code === 'R1.1');
    assert.equal(hidden?.draftValue, undefined);
    assert.equal(hidden?.band, 'mesatare');
    assert.equal(stripDraftNumbers(draft).profiles.every((profile) => profile.indicators.every((item) => item.draftValue === undefined)), true);
  });

  it('covers all 24 profiles in the AM-09 records and keeps the cohort note', () => {
    const ids = new Set(AM09_DRAFT_APPROVALS.flatMap((record) => record.profileIds));
    assert.equal(ids.size, 24);
    assert.equal(AM09_COHORT_20.profileIds.length, 20);
    assert.equal(AM09_COHORT_20.note, 'values reviewed by owner in this PR before merge');
  });

  it('colours only verified personal accounts and holds brand channels', () => {
    assert.equal(confirmedSocialUrls('vip_m1').instagram, 'https://www.instagram.com/blendifevziu/');
    assert.equal(confirmedSocialUrls('vip_m25').x, 'https://x.com/IlvaTare');
    assert.equal(confirmedSocialUrls('vip_m14').tiktok, 'https://www.tiktok.com/@ariancanitiktok');
    assert.equal(confirmedSocialUrls('vip_m12').instagram, 'https://www.instagram.com/ermalmamaqiofficial/');
    assert.equal(confirmedSocialUrls('vip_m12').youtube, undefined);
    assert.equal(confirmedSocialUrls('vip_m13').facebook, 'https://www.facebook.com/alketavejsiuofficial');
    assert.equal(confirmedSocialUrls('vip_m13').youtube, undefined);
    assert.deepEqual(confirmedSocialUrls('vip_m24'), {});
    assert.deepEqual(confirmedSocialUrls('vip_m23'), {});
    assert.deepEqual(confirmedSocialUrls('vip_m32'), {});
    assert.deepEqual(confirmedSocialUrls('vip_m2'), {});
    assert.equal(accountIsRenderable({ status: 'UNCERTAIN', account_type: 'personal', url: 'https://x.com/x' }), false);
    assert.equal(heldBrandAccounts().length, 5);
  });

  it('uses the circle fallback on every card until a cut-out exists', () => {
    assert.equal(mediaProfilesData.length, 24);
    assert.ok(mediaProfilesData.every((profile) => profile.portraitCutout !== true));
    const html = renderToStaticMarkup(React.createElement(MediaPortrait, { src: '/portrait.jpg', alt: 'Grida DUMA', portraitCutout: false }));
    assert.match(html, /data-portrait-cutout="false"/);
    assert.match(html, /media-portrait--fallback/);
    const cutout = renderToStaticMarkup(React.createElement(MediaPortrait, { src: '/cut.png', alt: 'Grida DUMA', portraitCutout: true }));
    assert.match(cutout, /data-portrait-cutout="true"/);
    assert.match(cutout, /clip-path/);
  });

  it('labels a draft value and says Pa vlerësim for a null cell', () => {
    const html = renderToStaticMarkup(React.createElement(LiveIndicatorList, { profileId: 'vip_m14', lang: 'sq' }));
    assert.match(html, /DRAFT · me ndihmë IA · pa miratim/);
    assert.match(html, /50 · Mesatare/);
    assert.match(html, /Pa vlerësim \/ Not assessed/);
    const card = fs.readFileSync(path.join(root, 'components/MediaPersonalityCard.tsx'), 'utf8');
    assert.doesNotMatch(card, /disabled=\{!published/);
  });
});
