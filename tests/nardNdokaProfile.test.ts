import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { findPolitician, routeFromLocation, selectMainProfiles } from '../utils/politicianNavigation';
import { mergePoliticianCards } from '../services/politicianAdapter';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Nard Ndoka profile', () => {
  const data = JSON.parse(read('db/paragon_scores_export.json'));
  const profiles = data.profiles as Array<Record<string, any>>;
  const ndoka = profiles.find((profile) => profile.name === 'Nard Ndoka');

  it('is one new canonical card and does not replace Belinda Balluku on vip10', () => {
    assert.ok(ndoka);
    assert.equal(profiles.filter((profile) => profile.name === 'Nard Ndoka').length, 1);
    assert.equal(ndoka?.id, 'vip282');
    assert.equal(ndoka?.numericId, 282);
    assert.equal(profiles.find((profile) => profile.id === 'vip10')?.name, 'Belinda Balluku');
    assert.equal(data.scored_count, 141);
    assert.equal(data.total_profiles, 234);
    const dupes = JSON.parse(read('data/paragon/duplicate_snapshots_2026-11-02.json'));
    assert.equal(dupes.profiles.some((profile: { name?: string }) => profile.name === 'Nard Ndoka'), false);
  });

  it('keeps every PARAGON dimension empty and does not invent a score', () => {
    assert.equal(ndoka?.composite, null);
    assert.equal(ndoka?.dynamicScore, null);
    assert.deepEqual(ndoka?.paragonDimensions, [null, null, null, null, null, null, null]);
    for (const key of ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7']) {
      assert.equal(ndoka?.dimensionReadings[key].score, null);
    }
    assert.equal(ndoka?.evidence.length, 0);
    assert.equal(ndoka?.paragonSources, null);
    assert.equal(ndoka?.integrityHash, undefined);
    assert.equal(ndoka?.paragonHash, undefined);
    assert.equal(ndoka?.photoPending, false);
    assert.equal(ndoka?.imageUrl, '/photos/originals/nard_ndoka.png');
    assert.equal(ndoka?.photoStatus, 'Burimi i fotografisë: Në verifikim');
    assert.equal(ndoka?.photoLicence, null);
    assert.equal(ndoka?.socialLinks.facebook.approved, true);
    assert.equal(ndoka?.socialLinks.facebook.approvedBy, 'Dr Alban Gj. THIKA');
    assert.equal(ndoka?.socialLinks.facebook.approvedAt, '2026-11-05');
    assert.equal(ndoka?.socialLinks.facebook.url, 'https://www.facebook.com/nard.ndoka.7');
    assert.equal(ndoka?.socialLinks.x.url, 'https://x.com/NardNdoka');
    assert.equal(ndoka?.socialLinks.linkedin.url, 'https://www.linkedin.com/in/nard-ndoka-63678819/');
    assert.equal(ndoka?.socialLinks.whatsapp, undefined);
    assert.equal(ndoka?.socialLinks.telegram, undefined);
  });

  it('records sourced offices and leaves unverified birth data awaiting', () => {
    const book = 'https://kuvendiwebfiles.blob.core.windows.net/webfiles/LigjvenesitNeVite.pdf';
    assert.equal(ndoka?.party, 'PDK');
    assert.match(ndoka?.primaryRole, /Demokristiane/);
    assert.equal(ndoka?.fieldSources.party.sourceUrl, 'https://kqz.gov.al/lista-e-partive-politike');
    assert.equal(ndoka?.fieldSources.ministerialPost.sourceUrl, 'https://shendetesia.gov.al/historiku/');
    assert.equal(ndoka?.fieldSources.parliamentaryTerm.sourceUrl, book);
    assert.match(ndoka?.fieldSources.parliamentaryTerm.value, /IX \(09\.09\.2017–21\.02\.2019/);
    assert.match(ndoka?.fieldSources.parliamentaryTerm.value, /21\.02\.2019/);
    assert.equal(ndoka?.fieldSources.constituency.value, 'Qarku i Shkodrës (Legjislatura IX)');
    const periods = ndoka?.mandates.map((item: { period: string }) => item.period);
    assert.ok(periods.includes('2 shtator 2005–7 shtator 2009'));
    assert.ok(periods.includes('9 shtator 2017–21 shkurt 2019'));
    assert.ok(periods.includes('2007–2008'));
    assert.equal(ndoka?.dateOfBirth, null);
    assert.equal(ndoka?.placeOfBirth, null);
    assert.equal(ndoka?.dateOfBirthVerificationStatus, null);
    assert.equal(ndoka?.education, null);
    assert.equal(ndoka?.fieldSources.committee.value, null);
    assert.match(ndoka?.shortBio, /^Nard Lazër NDOKA është kryetar/);
    assert.match(ndoka?.detailedBio, /^Nard Lazër NDOKA është kryetar/);
    assert.match(ndoka?.detailedBio, /Minister of Health in Sali BERISHA's government in 2007–2008/);
    assert.equal(ndoka?.electoralZone, 'Qarku i Shkodrës (legjislatura IX)');
    assert.doesNotMatch(ndoka?.shortBio, /1963|Laç|korrik 2008/);
    assert.match(ndoka?.fieldSources.photo.notes, /supplied by NOVARIC® editor \(Dr Thika\), 5 Nov 2026, source pending verification/);
    assert.equal(ndoka?.parliamentaryStatus, 'not_an_active_mp');
    assert.equal(ndoka?.photoStatus, 'Burimi i fotografisë: Në verifikim');
    const bytes = fs.readFileSync(path.resolve(process.cwd(), 'public/photos/originals/nard_ndoka.png'));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), '4927105b4b196c01de3d292d5ae9587c7e259efc309f5f067655a41feba49ee1');
  });

  it('appears in the full list and in the featured strip without dropping the first four', () => {
    assert.equal(findPolitician(profiles, 282)?.id, 'vip282');
    assert.equal(findPolitician(profiles, 'vip282')?.name, 'Nard Ndoka');
    assert.deepEqual(routeFromLocation('/figurat-politike/282', ''), { page: 'vipProfilePage', id: 'vip282' });
    assert.deepEqual(routeFromLocation('/figurat-politike/nard-ndoka', ''), { page: 'vipProfilePage', id: 'vip282' });
    const featured = selectMainProfiles(profiles);
    assert.deepEqual(featured.slice(0, 4).map((profile) => profile.id), ['vip1', 'vip2', 'vip3', 'vip4']);
    assert.equal(featured.some((profile) => profile.id === 'vip282'), true);
    assert.equal(featured.length, 5);
    const cards = mergePoliticianCards(profiles);
    const featuredCards = selectMainProfiles(cards);
    assert.equal(featuredCards.find((profile) => profile.id === 'vip282')?.party, 'PDK');
    assert.equal(featuredCards.find((profile) => profile.id === 'vip282')?.mainProfile, true);
    assert.deepEqual(featuredCards.map((profile) => profile.id), ['vip1', 'vip2', 'vip3', 'vip4', 'vip282']);
    assert.match(read('components/figurat-politike/DominantFiguresStrip.tsx'), /selectMainProfiles/);
    assert.match(read('components/figurat-politike/DominantFiguresStrip.tsx'), /lg:grid-cols-5/);
  });
});
