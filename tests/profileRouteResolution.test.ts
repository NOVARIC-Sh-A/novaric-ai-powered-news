import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { PROFILE_REDIRECTS } from '../utils/profileRedirects';
import { findPolitician, routeFromLocation } from '../utils/politicianNavigation';

/**
 * The deployed API accepts a numeric id and rejects the vip-prefixed form with
 * a non-404 status. Static hosting answers other API calls with HTML.
 * The profile page has to resolve both forms from the published export anyway.
 */
function installRouteFetch() {
  const previous = globalThis.fetch;
  globalThis.fetch = (async (url: any) => {
    const id = decodeURIComponent(String(url).split('/').pop() || '');
    if (/vip/i.test(id)) {
      return new Response(JSON.stringify({ error: 'unsupported id' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }
    return new Response('<!doctype html><html></html>', {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  }) as typeof fetch;
  return () => {
    globalThis.fetch = previous;
  };
}

describe('Live profile routes resolve vip and numeric ids', () => {
  let restore: () => void;
  let fetchPoliticianProfile: typeof import('../services/apiService').fetchPoliticianProfile;
  let profiles: Array<Record<string, any>>;

  before(async () => {
    restore = installRouteFetch();
    ({ fetchPoliticianProfile } = await import('../services/apiService'));
    profiles = (await import('../db/paragon_scores_export.json')).default.profiles;
  });

  after(() => restore());

  it('opens Nard Ndoka from /282 and /vip282 when the API rejects the vip form', async () => {
    const numeric = await fetchPoliticianProfile('282');
    const prefixed = await fetchPoliticianProfile('vip282');
    assert.equal(numeric.name, 'Nard Ndoka');
    assert.equal(prefixed.name, 'Nard Ndoka');
    assert.equal(numeric.id, 'vip282');
    assert.equal(prefixed.id, 'vip282');
    assert.deepEqual(routeFromLocation('/figurat-politike/282', ''), { page: 'vipProfilePage', id: 'vip282' });
    assert.deepEqual(routeFromLocation('/figurat-politike/vip282', ''), { page: 'vipProfilePage', id: 'vip282' });
  });

  it('resolves all 234 profiles in both vip and numeric form', async () => {
    assert.equal(profiles.length, 234);
    for (const profile of profiles) {
      const numeric = String(profile.numericId);
      const prefixed = `vip${numeric}`;
      for (const requested of [numeric, prefixed]) {
        const route = routeFromLocation(`/figurat-politike/${requested}`, '');
        assert.equal(route?.page, 'vipProfilePage', requested);
        assert.equal(findPolitician(profiles, requested)?.id, profile.id, requested);
        const loaded = await fetchPoliticianProfile(requested);
        assert.equal(loaded.name, profile.name, requested);
        assert.equal(loaded.id, profile.id, requested);
      }
    }
  });

  it('resolves all 44 merged profiles from both old id forms', async () => {
    const sources = Object.entries(PROFILE_REDIRECTS);
    const targets = new Set(sources.map(([, target]) => target));
    assert.equal(targets.size, 44);
    assert.equal(sources.length, 92);
    for (const [requested, target] of sources) {
      const route = routeFromLocation(`/figurat-politike/${requested}`, '');
      assert.equal(route?.page, 'vipProfilePage', requested);
      assert.equal(route && 'id' in route ? route.id : '', target, requested);
      const loaded = await fetchPoliticianProfile(requested);
      const expected = profiles.find((profile) => profile.id === target);
      assert.ok(expected, target);
      assert.equal(loaded.id, target, requested);
      assert.equal(loaded.name, expected.name, requested);
    }
  });
});
