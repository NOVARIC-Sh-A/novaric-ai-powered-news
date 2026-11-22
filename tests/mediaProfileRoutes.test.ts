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
import { OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT, resolvePresentableMediaPhoto, type OfficialMediaPhotoSource } from '../utils/officialMediaPhoto';
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

  it('keeps every public indicator unassessed and shows the owner-supplied portraits', () => {
    const grida = mediaProfilesData.find((profile) => profile.id === 'vip_m2');
    assert.equal(grida?.maragonAssessmentStatus, 'research_only');
    assert.equal(grida?.composite ?? null, null);
    assert.equal(grida?.dynamicScore ?? null, null);
    for (const profile of mediaProfilesData) {
      assert.equal(isMaragonAssessmentPublished(profile), false);
      assert.equal(profile.methodologyApproved ?? false, false);
      const slug = profile.slug;
      const expected = `/media-personalities/portraits/${slug}-450x600.jpg`;
      assert.equal(fs.existsSync(path.resolve(process.cwd(), `public${expected}`)), true, slug);
      assert.equal(fs.existsSync(path.resolve(process.cwd(), `public/media-personalities/portraits/${slug}-225x300.jpg`)), true, slug);
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
      assert.equal(photo?.url, expected, record.id);
      assert.equal(photo?.objectPosition, '50% 30%', record.id);
      assert.equal(photo?.credit, OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT, record.id);
      assert.equal(record.photo.photoPending, false, record.id);
      assert.equal(record.photo.awaitingOwnerConfirmation ?? false, false, record.id);
      assert.equal(record.documents.photoLicence.imageUrl, expected, record.id);
      assert.equal(record.documents.photoLicence.credit, OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT, record.id);
      assert.equal(record.documents.photoLicence.linkedByUrl, false, record.id);
      assert.equal(record.documents.auditTrail.some((event) => event.at.startsWith('22.11.2026')), true, record.id);
      assert.doesNotMatch(photo?.url || '', /tvklan\.al|novaricstorage|media\.novaric\.al|novaric\.co/i);
    }
    const gridaPhoto = resolvePresentableMediaPhoto({
      imageUrl: grida?.imageUrl,
      photoPending: grida?.photoPending,
      officialSource: (grida?.officialPhoto ?? null) as Partial<OfficialMediaPhotoSource> | null,
    }, 'vip_m2');
    assert.equal(gridaPhoto?.url, '/media-personalities/portraits/grida-duma-450x600.jpg');
    assert.equal(gridaPhoto?.objectPosition, '50% 30%');
    assert.equal(gridaPhoto?.credit, OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT);
    assert.equal(grida?.photoPending, false);
    const ilva = getPresenterRecord(mediaProfilesData.find((profile) => profile.id === 'vip_m25'));
    assert.ok(ilva);
    const shown = resolvePresentableMediaPhoto(ilva.photo, 'vip_m25');
    assert.equal(shown?.url, '/media-personalities/portraits/ilva-tare-450x600.jpg');
    const tvklan = resolvePresentableMediaPhoto({
      imageUrl: 'https://tvklan.al/wp-content/uploads/2024/02/Group-671.jpg',
      photoPending: false,
      officialSource: {
        sourceUrl: 'https://tvklan.al/wp-content/uploads/2024/02/Group-671.jpg',
        pageUrl: 'https://tvklan.al/programe/opinion',
        publisher: 'TV Klan',
        channelType: 'broadcaster_programme_page',
        credit: 'Foto: TV Klan',
        licence: 'Published by the official channel; no reuse licence stated.',
        retrievedAt: '2026-11-21T20:23:02+01:00',
      },
    }, 'vip_m1');
    assert.equal(tvklan, null);
    const novaricCopy = resolvePresentableMediaPhoto({
      imageUrl: 'https://media.novaric.al/media-personalities/portraits/ilva-tare-450x600.jpg',
      photoPending: false,
      officialSource: {
        sourceUrl: 'https://media.novaric.al/media-personalities/portraits/ilva-tare-450x600.jpg',
        pageUrl: 'https://www.atlanticcouncil.org/example',
        publisher: 'NOVARIC',
        channelType: 'institutional_profile',
        credit: OWNER_SUPPLIED_MEDIA_PORTRAIT_CREDIT,
        licence: 'copy',
        retrievedAt: '2026-11-22T20:02:00+01:00',
      },
    }, 'vip_m25');
    assert.equal(novaricCopy, null);
    const otherRelative = resolvePresentableMediaPhoto({
      imageUrl: '/photos/edi-rama.jpg',
      photoPending: false,
      officialSource: {
        sourceUrl: '/photos/edi-rama.jpg',
        pageUrl: 'https://tvklan.al/programe/opinion',
        publisher: 'TV Klan',
        channelType: 'broadcaster_programme_page',
        credit: 'not allowed',
        licence: '',
        retrievedAt: '2026-11-22',
      },
    }, 'vip_m25');
    assert.equal(otherRelative, null);
    const merged = mergeLocalMediaProfiles([
      { id: 'vip19', name: 'Benet Beci', category: 'Politikë (PS)', imageUrl: '', shortBio: '', detailedBio: '' },
    ]);
    assert.ok(merged.some((profile) => profile.id === 'vip19'));
    assert.equal(read('components/MediaPersonalitiesPage.tsx').includes('processVipProfile'), false);
    assert.equal(read('components/MediaPersonalityCard.tsx').includes('Greta'), false);
    assert.equal(read('components/MediaPersonalityCard.tsx').includes('kuvendiwebfiles'), false);
    assert.equal(read('components/MediaPersonalityCard.tsx').includes("profile.id === 'vip_m2'"), false);
  });
});
