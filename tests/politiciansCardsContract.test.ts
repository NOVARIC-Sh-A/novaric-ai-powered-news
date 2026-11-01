import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getProfilePhotoUrl } from '../utils/paragonProfileUtils';
import { isOfficialPhotoUrl, resolveOfficialPhotoUrl } from '../utils/officialPhoto';

const AWAITING_DATA = 'Në pritje të të dhënave / Awaiting data';

describe('NOVARIC® PARAGON Politicians Cards & Pipeline Contract (P1)', () => {
  const exportPath = path.resolve(process.cwd(), 'db/paragon_scores_export.json');
  const schedulerJsonPath = path.resolve(process.cwd(), 'config/cloud_scheduler_politicians.json');
  const alertsJsonPath = path.resolve(process.cwd(), 'config/alert_policies_politicians.json');

  test('paragon_scores_export.json exists and contains authoritative profiles', () => {
    assert.ok(fs.existsSync(exportPath), 'db/paragon_scores_export.json must exist');
    const raw = fs.readFileSync(exportPath, 'utf-8');
    const data = JSON.parse(raw);
    assert.ok(Array.isArray(data.profiles), 'profiles must be an array');
    assert.ok(data.profiles.length >= 104, 'Must have at least 104 profiles');
  });

  test('Top 104 cards satisfy all 10 mandatory contract schema fields', () => {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    const top104 = data.profiles.slice(0, 104);
    assert.equal(top104.length, 104, 'Top set must contain exactly 104 cards');

    const requiredFields = [
      'id',
      'numericId',
      'name',
      'category',
      'imageUrl',
      'shortBio',
      'detailedBio',
      'dynamicScore',
      'last_updated',
      'paragonDimensions',
    ];

    top104.forEach((card: any, idx: number) => {
      requiredFields.forEach((field) => {
        assert.ok(
          card[field] !== undefined,
          `Card ${idx} (${card.id}) missing contract field: ${field}`
        );
      });
      assert.ok(typeof card.numericId === 'number', 'numericId must be number');
      assert.ok(card.id.startsWith('vip'), 'id must start with vip');
      assert.ok(card.photoPending ? card.imageUrl === null : card.imageUrl.length > 0, 'imageUrl official or null');
    });
  });

  test('Official photos only: every card loads from the official source or awaits data', () => {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    let official = 0;
    let awaiting = 0;
    data.profiles.forEach((card: any) => {
      const url = card.imageUrl;
      if (card.photoPending) {
        awaiting++;
        assert.equal(url, null, `${card.id} awaiting card must not carry a photo`);
        assert.equal(card.photoStatus, AWAITING_DATA);
      } else {
        official++;
        assert.ok(isOfficialPhotoUrl(url), `${card.id} imageUrl is not official: ${url}`);
      }
      const raw = JSON.stringify(card);
      assert.ok(!raw.includes('media.novaric.al/politicians'), `${card.id} references a NOVARIC copy`);
      assert.ok(!raw.includes('MaleProfile') && !raw.includes('FemaleProfile'), `${card.id} uses mock photo`);
    });
    assert.equal(official + awaiting, 277);
    assert.equal(awaiting, 25, 'profiles with no formal party, government, or parliament portrait');
  });

  test('Approved replacements point at the official Parliament / Commons sources', () => {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    const byId = new Map(data.profiles.map((c: any) => [c.id, c]));
    ['vip24', 'vip72', 'vip77', 'vip78', 'vip80', 'vip248', 'vip267', 'vip281', 'vip112'].forEach((id) => {
      const c: any = byId.get(id);
      assert.ok(c.imageUrl.startsWith('https://kuvendiwebfiles.blob.core.windows.net/'), `${id}: ${c.imageUrl}`);
    });
    ['vip2', 'vip7', 'vip233'].forEach((id) => {
      const c: any = byId.get(id);
      assert.equal(c.imageUrl, `/politicians/official/${id}.jpg`);
      assert.ok(String(c.photo_source_url).includes('pd.al'), `${id} should cite pd.al`);
    });
    ['vip6', 'vip54', 'vip19', 'vip232'].forEach((id) => {
      const c: any = byId.get(id);
      assert.equal(c.imageUrl, `/politicians/official/${id}.jpg`);
      assert.ok(fs.existsSync(path.resolve(process.cwd(), `public/politicians/official/${id}.jpg`)));
    });
    assert.ok(String((byId.get('vip6') as any).photo_source_url).includes('ps.al'));
    assert.ok(String((byId.get('vip19') as any).photo_source_url).includes('psd.al'));
    assert.ok(String((byId.get('vip232') as any).photo_source_url).includes('pd.al'));
    const zija: any = byId.get('vip106');
    assert.equal(zija.photoPending, true);
    assert.equal(zija.imageUrl, null);
  });

  test('getProfilePhotoUrl never returns NOVARIC copies or placeholders', () => {
    const official = 'https://kuvendiwebfiles.blob.core.windows.net/webfiles/x.jpg';
    assert.equal(getProfilePhotoUrl({ imageUrl: official, photoPending: false }), official);
    assert.equal(
      getProfilePhotoUrl({ imageUrl: 'https://media.novaric.al/politicians/vip1.jpg' }),
      undefined
    );
    assert.equal(getProfilePhotoUrl({ imageUrl: null, photoPending: true }), undefined);
  });

  test('resolveOfficialPhotoUrl prefers official paths and rejects non-official hosts', () => {
    assert.equal(resolveOfficialPhotoUrl({ officialPhotoPath: '/politicians/official/vip19.jpg' }), '/politicians/official/vip19.jpg');
    assert.equal(resolveOfficialPhotoUrl({ imageUrl: 'https://upload.wikimedia.org/a.jpg' }), 'https://upload.wikimedia.org/a.jpg');
    assert.equal(resolveOfficialPhotoUrl({ imageUrl: 'https://media.novaric.al/politicians/vip1.jpg' }), null);
    assert.equal(resolveOfficialPhotoUrl({ imageUrl: 'https://novaric.co/wp-content/uploads/2025/11/MaleProfile.jpg' }), null);
    assert.equal(resolveOfficialPhotoUrl({ imageUrl: 'https://example.com/a.jpg' }), null);
    assert.equal(resolveOfficialPhotoUrl({}), null);
  });

  test('Awaiting-data label and untouched zodiac label', () => {
    const src = fs.readFileSync(path.resolve(process.cwd(), 'components/figurat-politike/primitives/awaiting.tsx'), 'utf-8');
    assert.ok(src.includes('Në pritje të të dhënave / Awaiting data'));
    assert.ok(src.includes('Nuk pikëzohet / Not scored'));
    assert.ok(src.includes('export function AwaitingPhoto') || src.includes('export const AwaitingPhoto'));
    const grid = fs.readFileSync(path.resolve(process.cwd(), 'components/figurat-politike/PoliticianGridCard.tsx'), 'utf-8');
    assert.ok(grid.includes('onError'));
    assert.ok(grid.includes('AwaitingPhoto'));
    const ring = fs.readFileSync(path.resolve(process.cwd(), 'components/figurat-politike/primitives/ScoreRing.tsx'), 'utf-8');
    assert.ok(ring.includes('onError') && ring.includes('AwaitingPhoto'));
    const strip = fs.readFileSync(path.resolve(process.cwd(), 'components/figurat-politike/DominantFiguresStrip.tsx'), 'utf-8');
    for (const source of [grid, ring, strip]) {
      assert.ok(source.includes('object-cover'));
      assert.ok(source.includes("objectPosition: 'center 20%'"));
    }
    assert.ok(grid.includes('aspect-[3/4]'));
  });

  test('Cloud Scheduler JSON spec is valid and enforces retry/backoff policy', () => {
    assert.ok(fs.existsSync(schedulerJsonPath), 'cloud_scheduler_politicians.json must exist');
    const spec = JSON.parse(fs.readFileSync(schedulerJsonPath, 'utf-8'));

    assert.equal(spec.schedule, '0 4 * * 1', 'Weekly Monday 04:00 UTC schedule');
    assert.equal(spec.timeZone, 'Etc/UTC');
    assert.equal(spec.httpTarget.httpMethod, 'POST');
    assert.ok(spec.httpTarget.uri.includes('/api/v1/politicians/ingest'));

    const retry = spec.retryConfig;
    assert.equal(retry.retryCount, 5, 'Must have 5 retry attempts');
    assert.equal(retry.minBackoffDuration, '10s');
    assert.equal(retry.maxBackoffDuration, '300s');
    assert.equal(retry.maxDoublings, 5);
  });

  test('Alert policies define Final Failure, Membership Change Delta, and Photo Defect', () => {
    assert.ok(fs.existsSync(alertsJsonPath), 'alert_policies_politicians.json must exist');
    const alerts = JSON.parse(fs.readFileSync(alertsJsonPath, 'utf-8'));
    assert.ok(Array.isArray(alerts.alertPolicies));

    const policyNames = alerts.alertPolicies.map((p: any) => p.name);
    assert.ok(policyNames.some((n: string) => n.includes('politicians-ingest-final-failure')));
    assert.ok(policyNames.some((n: string) => n.includes('politicians-membership-change-delta')));
    assert.ok(policyNames.some((n: string) => n.includes('politicians-image-mirror-defect')));
  });
});
