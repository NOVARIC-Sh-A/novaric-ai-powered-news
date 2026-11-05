import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { findPolitician, politicianPathId, profileViewState, routeFromLocation, selectMainProfiles } from '../utils/politicianNavigation';
import { canonicalProfileId } from '../utils/profileRedirects';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('List to profile navigation', () => {
  const list = [
    { id: 'vip2', numericId: 2, name: 'Sali Berisha', category: 'Politikë (PD-AMSH)' },
    { id: 'vip55', numericId: 55, name: 'Zegjine Çaushi', category: 'Politikë (PS)' },
  ];

  it('resolves the card id 2 and 55 to the same person as vip2 and vip55', () => {
    assert.equal(findPolitician(list, 2)?.name, 'Sali Berisha');
    assert.equal(findPolitician(list, '2')?.id, 'vip2');
    assert.equal(findPolitician(list, 'vip2')?.numericId, 2);
    assert.equal(findPolitician(list, 55)?.name, 'Zegjine Çaushi');
    assert.equal(politicianPathId('vip55'), 'zegjine-caushi');
    assert.equal(politicianPathId(2), 'sali-berisha');
    assert.equal(politicianPathId('sali-berisha'), 'sali-berisha');
    assert.equal(findPolitician([], 2), undefined);
    assert.equal(findPolitician([{ id: 'vip106', numericId: 106, name: 'Zija Ismaili' }], 'vip129')?.id, 'vip106');
    assert.equal(findPolitician([{ id: 'vip103', numericId: 103, name: 'Ramadan Likaj' }], 'vip190')?.id, 'vip103');
  });

  it('does not call the profile missing before the lookup has finished', () => {
    assert.equal(profileViewState({ loading: true, profile: null }), 'loading');
    assert.equal(profileViewState({ loading: true, profile: list[0] }), 'ready');
    assert.equal(profileViewState({ loading: false, profile: null }), 'missing');
    assert.equal(profileViewState({ loading: false, profile: list[1] }), 'ready');
  });

  it('keeps the first click on a loading screen and sends Kthehu Pas to the list', () => {
    const wrapper = read('pages/VipProfilePageWrapper.tsx');
    const card = read('components/figurat-politike/PoliticianGridCard.tsx');
    const app = read('App.tsx');
    const missing = wrapper.indexOf('data-profile-status="missing"');
    const loading = wrapper.indexOf('data-profile-status="loading"');
    assert.ok(loading > 0 && missing > loading);
    assert.match(wrapper, /profileViewState/);
    assert.match(wrapper, /onNavigate\('politiciansPage'\)/);
    assert.doesNotMatch(card, /pushState\(\{\}, '', linkHref\)/);
    assert.match(app, /if \(currentPage === 'vipProfilePage'\)/);
    assert.match(app, /navigateTo\('politiciansPage'\)/);
    assert.match(app, /pushState\(\{ page: 'politiciansPage' \}, '', POLITICIANS_LIST_PATH\)/);
    const pop = app.indexOf('const handlePopState');
    const profileFirst = app.indexOf("located?.page === 'vipProfilePage'", pop);
    const queryList = app.indexOf("page === 'politiciansPage'", pop);
    assert.ok(profileFirst > pop && profileFirst < queryList);
  });

  it('opens /figurat-politike/270 even when the list query is still on the URL', () => {
    const route = routeFromLocation('/figurat-politike/270', '?page=politiciansPage');
    assert.deepEqual(route, { page: 'vipProfilePage', id: 'vip270' });
    assert.equal(canonicalProfileId('270'), '270');
    assert.equal(canonicalProfileId('vip270'), 'vip270');
    assert.deepEqual(routeFromLocation('/figurat-politike', ''), { page: 'politiciansPage' });
    assert.deepEqual(routeFromLocation('/figurat-politike/', ''), { page: 'politiciansPage' });
    assert.deepEqual(routeFromLocation('/', '?page=politiciansPage'), { page: 'politiciansPage' });
    assert.deepEqual(routeFromLocation('/figurat-politike/54', '?page=politiciansPage'), { page: 'vipProfilePage', id: 'vip6' });
    assert.deepEqual(routeFromLocation('/figurat-politike/vip129', ''), { page: 'vipProfilePage', id: 'vip106' });
    assert.deepEqual(routeFromLocation('/figurat-politike/agron-gaxho', '?page=politiciansPage'), { page: 'vipProfilePage', id: 'vip270' });
    assert.deepEqual(routeFromLocation('/figurat-politike/Sali-Berisha', ''), { page: 'vipProfilePage', id: 'vip2' });
  });

  it('resolves every list card and every removed duplicate', () => {
    const data = JSON.parse(read('db/paragon_scores_export.json'));
    const profiles = data.profiles as Array<{ id: string; numericId: number; name: string }>;
    assert.equal(profiles.length, 234);
    for (const profile of profiles) {
      for (const id of [profile.id, profile.numericId, String(profile.numericId)]) {
        const found = findPolitician(profiles, id);
        assert.equal(found?.id, profile.id, `list card ${id} did not open ${profile.name}`);
        assert.equal(found?.name, profile.name);
      }
    }
    const gaxho = findPolitician(profiles, 270);
    assert.equal(gaxho?.id, 'vip270');
    assert.equal(gaxho?.name, 'Agron Gaxho');
    assert.equal(profiles.some((profile) => profile.id === 'vip270'), true);

    const snap = JSON.parse(read('data/paragon/duplicate_snapshots_2026-11-02.json')) as {
      profiles: Array<{ id: string; numericId: number }>;
      groups: Array<{ canonical: string; duplicates: string[] }>;
    };
    assert.equal(snap.profiles.length, 44);
    for (const removed of snap.profiles) {
      assert.equal(profiles.some((profile) => profile.id === removed.id), false, removed.id);
      for (const id of [removed.id, String(removed.numericId)]) {
        const canonical = canonicalProfileId(id);
        assert.notEqual(canonical, id, `${id} is still a public card`);
        const found = findPolitician(profiles, canonical);
        assert.ok(found?.name, `${id} does not redirect to a profile`);
        assert.equal(found?.id, canonical);
      }
    }
    for (const group of snap.groups) {
      for (const duplicate of group.duplicates) {
        const numeric = duplicate.replace(/^vip/i, '');
        assert.equal(canonicalProfileId(duplicate), group.canonical);
        assert.equal(canonicalProfileId(numeric), group.canonical);
        assert.equal(findPolitician(profiles, duplicate)?.id, group.canonical);
        assert.equal(findPolitician(profiles, numeric)?.id, group.canonical);
      }
    }
  });
});
