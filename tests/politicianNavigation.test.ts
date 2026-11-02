import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { findPolitician, politicianPathId, profileViewState } from '../utils/politicianNavigation';

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
    assert.equal(politicianPathId('vip55'), '55');
    assert.equal(politicianPathId(2), '2');
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
  });
});
