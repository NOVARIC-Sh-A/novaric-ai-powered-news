import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { profileDossier, UNVERIFIED_LABEL } from '../utils/profileDossier';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Nard Ndoka sourced dossier', () => {
  const file = JSON.parse(read('data/profiles/vip282.json'));
  const dossier = profileDossier('vip282');
  const page = read('components/figurat-politike/PoliticianCard.tsx');

  it('keeps conflict notes in the file and off the public view', () => {
    assert.ok(file.conflicts.length >= 4);
    assert.equal('conflicts' in (dossier as object), false);
    assert.equal(JSON.stringify(dossier).includes('lathe-worker'), false);
  });

  it('shows Në verifikim for unverified fields and never their values', () => {
    const unverified = (dossier?.fields || []).filter((field) => !field.verified);
    assert.deepEqual(unverified.map((field) => field.key), ['committees', 'languages', 'candidacy2025']);
    for (const field of unverified) {
      assert.equal(field.display, UNVERIFIED_LABEL);
      assert.equal(field.sourceUrl, undefined);
    }
    const minister = dossier?.fields.find((field) => field.key === 'minister');
    assert.match(minister?.display || '', /2007–2008/);
    assert.match(minister?.display || '', /korrik 2008/);
    assert.equal(dossier?.fields.find((field) => field.key === 'dateOfBirth')?.display, '18.05.1963');
    assert.equal(dossier?.fields.find((field) => field.key === 'placeOfBirth')?.display, 'Laç');
    assert.match(dossier?.fields.find((field) => field.key === 'dateOfBirth')?.sourceLabel || '', /Konfirmuar nga redaksia/);
    assert.match(dossier?.bio.sq || '', /2007–2008/);
    assert.match(dossier?.bio.sq || '', /30 korrik 2008/);
    assert.match(dossier?.bio.sq || '', /legjislaturën VII/);
    assert.equal(dossier?.social.profilesOnly.length, 2);
    assert.equal(JSON.stringify(dossier?.social.profilesOnly).includes('ndjek'), false);
  });

  it('places the new sections after the fingerprint and leaves the social logos on the details card', () => {
    const details = page.indexOf('data-profile-details="true"');
    const fingerprint = page.indexOf('data-legacy-fingerprint="true"');
    const sections = page.indexOf('<ProfileDossierSections');
    const observatory = page.indexOf('<FactualObservatory');
    assert.ok(details > 0 && fingerprint > details && observatory > fingerprint && sections > observatory);
    assert.match(page, /<ProfileSocialLogos/);
    const logos = page.indexOf('<ProfileSocialLogos');
    assert.ok(logos > details && logos < fingerprint);
  });
});
