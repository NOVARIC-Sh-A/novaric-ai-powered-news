import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { mediaProfilesData } from '../data/mediaProfiles';
import { canonicalMediaKey, mediaProfilePath, routeMediaFromLocation } from '../utils/mediaNavigation';
import { politicianPathId, routeFromLocation } from '../utils/politicianNavigation';
import { canonicalProfileShareUrl } from '../utils/profileShare';
import { mergeLocalMediaProfiles } from '../utils/mergeLocalMediaProfiles';
import { isMaragonAssessmentPublished, maragonProvisionalBandsArePublic } from '../utils/maragonPublication';
import { resolvePresentableMediaPhoto } from '../utils/officialMediaPhoto';
import { getPresenterRecord } from '../components/maragon/maragonPresenterUi';
import { visibleIndicatorBand } from '../components/maragon/maragonPresenterUi';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Media personality slug routes', () => {
  it('publishes 24 name slugs and leaves the political roster alone', () => {
    assert.equal(mediaProfilesData.length, 24);
    const slugs = mediaProfilesData.map((profile) => profile.slug);
    assert.equal(new Set(slugs).size, 24);
    assert.equal(mediaProfilesData.find((profile) => profile.id === 'vip_m1')?.slug, 'blendi-fevziu');
    assert.equal(mediaProfilesData.find((profile) => profile.id === 'vip_m2')?.slug, 'grida-duma');
    assert.equal(mediaProfilesData.find((profile) => profile.id === 'vip_m14')?.slug, 'arian-cani');
    assert.equal(mediaProfilesData.find((profile) => profile.id === 'vip_m27')?.slug, 'ledion-lico');
    assert.equal(mediaProfilesData.find((profile) => profile.id === 'vip_m25')?.slug, 'ilva-tare');
    assert.equal(mediaProfilesData.find((profile) => profile.id === 'vip_m10')?.slug, 'eni-vasili');
    assert.equal(politicianPathId('vip1'), 'edi-rama');
    assert.deepEqual(routeFromLocation('/figurat-politike/edi-rama', ''), { page: 'vipProfilePage', id: 'vip1' });
    assert.equal(routeFromLocation('/', '?page=vipProfilePage&id=vip_m1'), null);
    const exportData = JSON.parse(read('db/paragon_scores_export.json'));
    assert.equal(exportData.total_profiles, 234);
  });

  it('redirects old media query links onto the slug and keeps the index', () => {
    assert.deepEqual(routeMediaFromLocation('/personalitete-mediatike', ''), { page: 'mediaPersonalitiesPage' });
    assert.deepEqual(routeMediaFromLocation('/', '?page=mediaPersonalitiesPage'), { page: 'mediaPersonalitiesPage' });
    assert.deepEqual(routeMediaFromLocation('/', '?page=maragonProfile'), { page: 'vipProfilePage', id: 'vip_m2' });
    for (const profile of mediaProfilesData) {
      const id = String(profile.id);
      assert.equal(canonicalMediaKey(profile.slug), id);
      assert.equal(mediaProfilePath(id), `/personalitete-mediatike/${profile.slug}`);
      assert.deepEqual(routeMediaFromLocation(`/personalitete-mediatike/${profile.slug}`, ''), { page: 'vipProfilePage', id });
      assert.deepEqual(routeMediaFromLocation('/', `?page=vipProfilePage&id=${id}`), { page: 'vipProfilePage', id });
      assert.deepEqual(routeMediaFromLocation('/', `?page=maragonProfile&id=${id}`), { page: 'vipProfilePage', id });
      assert.equal(canonicalProfileShareUrl(id), `https://media.novaric.al/personalitete-mediatike/${profile.slug}`);
    }
    assert.equal(routeMediaFromLocation('/', '?page=vipProfilePage&id=vip2'), null);
    assert.equal(canonicalProfileShareUrl('vip2'), 'https://media.novaric.al/figurat-politike/sali-berisha');
    const nginx = read('nginx.conf');
    assert.match(nginx, /location \/personalitete-mediatike\/ \{[^}]*try_files \$uri \$uri\/ \/index\.html;/s);
    const app = read('App.tsx');
    assert.match(app, /routeMediaFromLocation/);
  });

  it('keeps every public indicator unassessed and hides withheld photos', () => {
    const grida = mediaProfilesData.find((profile) => profile.id === 'vip_m2');
    assert.equal(grida?.maragonAssessmentStatus, 'research_only');
    assert.equal(grida?.composite ?? null, null);
    assert.equal(grida?.dynamicScore ?? null, null);
    for (const profile of mediaProfilesData) {
      assert.equal(isMaragonAssessmentPublished(profile), false);
      assert.equal(profile.methodologyApproved ?? false, false);
      const record = getPresenterRecord(profile);
      if (!record) continue;
      assert.equal(record.maragon.methodologyApproved, false);
      assert.equal(record.maragon.composite, null);
      assert.equal(maragonProvisionalBandsArePublic({
        maragonAssessmentStatus: record.maragon.assessmentStatus,
        methodologyApproved: record.maragon.methodologyApproved,
        scoringSuspended: record.maragon.scoringSuspended,
        authorizedForPublicDisplay: record.maragon.authorizedForPublicDisplay,
        am09ProvisionalApprovedInWriting: record.maragon.am09ProvisionalApprovedInWriting,
      }), false);
      for (const indicator of record.maragon.indicators) {
        const visible = visibleIndicatorBand(record, indicator, 'public');
        assert.equal(visible.band, null, `${profile.id} ${indicator.code}`);
        assert.equal(visible.indicative, false);
      }
      const photo = resolvePresentableMediaPhoto(record.photo, record.id);
      const withheld = new Set(['vip_m1', 'vip_m5', 'vip_m12', 'vip_m13', 'vip_m14', 'vip_m9', 'vip_m19', 'vip_m26', 'vip_m32']);
      if (withheld.has(record.id) || record.photo.photoPending || record.photo.awaitingOwnerConfirmation) {
        assert.equal(photo, null, record.id);
      } else if (photo) {
        assert.doesNotMatch(photo.url, /tvklan\.al|novaricstorage|media\.novaric\.al|novaric\.co/i);
      }
    }
    const ilva = getPresenterRecord(mediaProfilesData.find((profile) => profile.id === 'vip_m25'));
    assert.ok(ilva);
    const shown = resolvePresentableMediaPhoto({ ...ilva.photo, awaitingOwnerConfirmation: false }, 'vip_m25');
    assert.equal(shown?.url, 'https://www.atlanticcouncil.org/wp-content/uploads/2022/04/ilva4x3-scaled.jpg');
    const merged = mergeLocalMediaProfiles([
      { id: 'vip19', name: 'Benet Beci', category: 'Politikë (PS)', imageUrl: '', shortBio: '', detailedBio: '' },
    ]);
    assert.ok(merged.some((profile) => profile.id === 'vip19'));
    assert.equal(read('components/MediaPersonalitiesPage.tsx').includes('processVipProfile'), false);
    assert.equal(read('components/MediaPersonalityCard.tsx').includes('Greta'), false);
  });
});
