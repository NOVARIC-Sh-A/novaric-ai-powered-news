import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getProfilePhotoUrl } from '../utils/paragonProfileUtils';

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
      assert.ok(card.imageUrl && card.imageUrl.length > 0, 'imageUrl must not be empty');
      assert.ok(card.photo_source_url, 'photo_source_url must be preserved');
    });
  });

  test('Image Mirroring: 104/104 profiles resolved to media.novaric.al domain', () => {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    const top104 = data.profiles.slice(0, 104);

    let mirroredCount = 0;
    let pendingCount = 0;

    top104.forEach((card: any) => {
      const url = card.imageUrl;
      assert.ok(
        url.startsWith('https://media.novaric.al/politicians/'),
        `Card ${card.id} imageUrl is not mirrored: ${url}`
      );

      if (card.photoPending || url.includes('placeholder-pending.jpg')) {
        pendingCount++;
        assert.equal(card.photoStatus, 'Foto në pritje');
      } else {
        mirroredCount++;
      }
    });

    assert.equal(mirroredCount + pendingCount, 104, 'Total resolved must be 104');
    assert.equal(pendingCount, 2, 'Must have exactly 2 documented pending photos');
    assert.equal(mirroredCount, 102, 'Must have exactly 102 active mirrored photos');
  });

  test('Documented missing photos strictly match vip106 (Zija Ismaili) and vip113 (Redi Muçi)', () => {
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    const top104 = data.profiles.slice(0, 104);
    const pendingCards = top104.filter((c: any) => c.photoPending);

    assert.equal(pendingCards.length, 2);
    const pendingIds = pendingCards.map((c: any) => c.id).sort();
    assert.deepEqual(pendingIds, ['vip106', 'vip113']);

    pendingCards.forEach((c: any) => {
      assert.equal(c.imageUrl, 'https://media.novaric.al/politicians/placeholder-pending.jpg');
      assert.equal(c.photoStatus, 'Foto në pritje');
    });
  });

  test('getProfilePhotoUrl handles mirrored and pending photos gracefully', () => {
    const standardProfile = {
      imageUrl: 'https://media.novaric.al/politicians/vip1.jpg',
      photoPending: false,
    };
    assert.equal(
      getProfilePhotoUrl(standardProfile),
      'https://media.novaric.al/politicians/vip1.jpg'
    );

    const pendingProfile = {
      imageUrl: 'https://media.novaric.al/politicians/placeholder-pending.jpg',
      photoPending: true,
      photoStatus: 'Foto në pritje',
    };
    assert.equal(
      getProfilePhotoUrl(pendingProfile),
      'https://media.novaric.al/politicians/placeholder-pending.jpg'
    );
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
