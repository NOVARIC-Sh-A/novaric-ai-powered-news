import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { JSDOM } from 'jsdom';
import { canonicalProfileShareUrl, profileOpenGraph } from '../utils/profileShare';
import { profileSocialLogos, sanitizeSocialLinks } from '../utils/socialLinks';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
});
const g = globalThis as any;
g.window = dom.window;
g.document = dom.window.document;
g.HTMLElement = dom.window.HTMLElement;
g.SVGElement = dom.window.SVGElement;
g.Element = dom.window.Element;
g.Node = dom.window.Node;
g.IS_REACT_ACT_ENVIRONMENT = true;
g.fetch = async () => ({ ok: false, json: async () => null });
if (!g.navigator) {
  Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
}
g.navigator.clipboard = { writeText: async () => undefined };

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

describe('Profile share button and social logos', () => {
  let PoliticianGridCard: typeof import('../components/figurat-politike/PoliticianGridCard').PoliticianGridCard;
  let DominantFiguresStrip: typeof import('../components/figurat-politike/DominantFiguresStrip').DominantFiguresStrip;
  let ProfileSocialLogos: typeof import('../components/figurat-politike/ProfileSocialLogos').ProfileSocialLogos;
  let createRoot: typeof import('react-dom/client').createRoot;
  let act: typeof import('react').act;

  before(async () => {
    ({ PoliticianGridCard } = await import('../components/figurat-politike/PoliticianGridCard'));
    ({ DominantFiguresStrip } = await import('../components/figurat-politike/DominantFiguresStrip'));
    ({ ProfileSocialLogos } = await import('../components/figurat-politike/ProfileSocialLogos'));
    ({ createRoot } = await import('react-dom/client'));
    ({ act } = await import('react'));
  });

  const profile = {
    id: 'vip270',
    numericId: 270,
    name: 'Agron Gaxho',
    category: 'Politikë (PS)',
    party: 'PS',
    primaryRole: 'Deputet i Kuvendit të Shqipërisë',
  };

  it('does not open the profile when the share button is clicked, and the name still does', async () => {
    const opened: Array<string | number> = [];
    const root = createRoot(document.getElementById('root')!);
    await act(async () => {
      root.render(React.createElement(PoliticianGridCard, {
        politician: profile as never,
        onSelectPolitician: (id: string | number) => opened.push(id),
      }));
    });

    const share = document.querySelector('[data-profile-share]') as HTMLButtonElement;
    assert.ok(share);
    assert.equal(share.getAttribute('aria-label'), 'Shpërndaj profilin');
    assert.equal(share.closest('a')?.getAttribute('href'), '/figurat-politike/agron-gaxho');

    await act(async () => {
      share.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    assert.deepEqual(opened, []);
    const menu = document.querySelector('[data-share-menu]');
    assert.ok(menu);
    assert.equal(menu?.querySelector('[data-share-target="copy"]')?.textContent, 'Kopjo lidhjen');
    assert.match(menu?.querySelector('[data-share-target="facebook"]')?.getAttribute('href') || '', /facebook\.com\/sharer/);
    assert.doesNotMatch(document.body.innerHTML, /agron-gaxho\.7/);

    await act(async () => {
      menu?.querySelector('[data-share-target="copy"]')?.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    assert.equal(document.querySelector('[data-share-toast]')?.textContent, 'Linku u kopjua');
    assert.deepEqual(opened, []);

    const name = document.querySelector('[data-politician-name]') as HTMLElement;
    await act(async () => {
      name.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    assert.deepEqual(opened, ['vip270']);
    await act(async () => { root.unmount(); });
  });

  it('puts the same share control on the featured strip', async () => {
    const opened: Array<string | number> = [];
    const root = createRoot(document.getElementById('root')!);
    await act(async () => {
      root.render(React.createElement(DominantFiguresStrip, {
        politicians: [profile as never],
        onSelectPolitician: (id: string | number) => opened.push(id),
      }));
    });
    const share = document.querySelector('#dominant-figures-strip [data-profile-share]') as HTMLButtonElement;
    assert.ok(share);
    assert.equal(share.getAttribute('aria-label'), 'Shpërndaj profilin');
    await act(async () => {
      share.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    assert.deepEqual(opened, []);
    await act(async () => { root.unmount(); });
  });

  it('uses the Web Share API with the canonical slug URL and does not navigate', async () => {
    const shared: Array<ShareData> = [];
    g.navigator.share = async (data: ShareData) => { shared.push(data); };
    const opened: Array<string | number> = [];
    const root = createRoot(document.getElementById('root')!);
    await act(async () => {
      root.render(React.createElement(PoliticianGridCard, {
        politician: { ...profile, id: 'vip282', numericId: 282, name: 'Nard Ndoka' } as never,
        onSelectPolitician: (id: string | number) => opened.push(id),
      }));
    });
    const share = document.querySelector('[data-profile-share]') as HTMLButtonElement;
    await act(async () => {
      share.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    assert.deepEqual(opened, []);
    assert.equal(document.querySelector('[data-share-menu]'), null);
    assert.equal(shared[0]?.url, 'https://media.novaric.al/figurat-politike/nard-ndoka');
    assert.equal(shared[0]?.title, 'Nard NDOKA');
    assert.equal(shared[0]?.text, 'Nard NDOKA');
    delete g.navigator.share;
    await act(async () => { root.unmount(); });
  });

  it('links confirmed accounts and sends every other logo to the platform homepage', async () => {
    const root = createRoot(document.getElementById('root')!);
    const leaked = {
      facebook: {
        approved: false,
        approvedBy: null,
        approvedAt: null,
        url: 'https://www.facebook.com/secret.person',
      },
    };
    await act(async () => {
      root.render(React.createElement(ProfileSocialLogos, { name: 'Filan Fisteku', links: leaked }));
    });
    const logos = [...document.querySelectorAll('[data-social-platform]')];
    assert.deepEqual(logos.map((node) => node.getAttribute('data-social-platform')), ['facebook', 'x', 'whatsapp', 'linkedin', 'telegram']);
    for (const node of logos) {
      assert.equal(node.tagName, 'A');
      assert.equal(node.getAttribute('target'), '_blank');
      assert.equal(node.getAttribute('rel'), 'noopener noreferrer');
      assert.equal(node.getAttribute('data-social-confirmed'), 'false');
    }
    const facebook = document.querySelector('[data-social-platform="facebook"]') as HTMLAnchorElement;
    assert.equal(facebook.getAttribute('href'), 'https://www.facebook.com/');
    assert.equal(facebook.getAttribute('aria-label'), 'Facebook (faqja kryesore e platformës)');
    assert.doesNotMatch(document.body.innerHTML, /secret\.person/);
    assert.equal(document.querySelector('[data-social-platform="whatsapp"]')?.getAttribute('href'), 'https://www.whatsapp.com/');
    assert.equal(document.querySelector('[data-social-platform="telegram"]')?.getAttribute('href'), 'https://telegram.org/');

    await act(async () => {
      root.render(React.createElement(ProfileSocialLogos, {
        name: 'Nard Ndoka',
        links: {
          facebook: {
            approved: true,
            approvedBy: 'Dr Alban Gj. THIKA',
            approvedAt: '2026-11-05',
            url: 'https://www.facebook.com/nard.ndoka.7',
          },
        },
      }));
    });
    const confirmed = document.querySelector('[data-social-platform="facebook"]') as HTMLAnchorElement;
    assert.equal(confirmed.getAttribute('href'), 'https://www.facebook.com/nard.ndoka.7');
    assert.equal(confirmed.getAttribute('data-social-confirmed'), 'true');
    assert.equal(confirmed.getAttribute('aria-label'), 'Nard NDOKA në Facebook');
    assert.equal(confirmed.getAttribute('target'), '_blank');
    assert.equal(confirmed.getAttribute('rel'), 'noopener noreferrer');
    assert.equal(document.querySelector('[data-social-platform="x"]')?.getAttribute('data-social-confirmed'), 'false');
    await act(async () => { root.unmount(); });
  });

  it('publishes only Ndoka’s approved accounts and keeps unapproved URLs out of the page', () => {
    const editorial = JSON.parse(read('data/official/politician_social_links.json'));
    const exportJson = read('db/paragon_scores_export.json');
    const profiles = JSON.parse(exportJson).profiles as Array<Record<string, any>>;
    const ndoka = profiles.find((item) => item.id === 'vip282');
    assert.equal(editorial.profiles.vip282.facebook.approved, true);
    assert.equal(editorial.profiles.vip282.facebook.approvedBy, 'Dr Alban Gj. THIKA');
    assert.equal(editorial.profiles.vip282.facebook.approvedAt, '2026-11-05');
    assert.equal(editorial.profiles.vip282.facebook.url, 'https://www.facebook.com/nard.ndoka.7');
    assert.equal(editorial.profiles.vip282.x.url, 'https://x.com/NardNdoka');
    assert.equal(editorial.profiles.vip282.linkedin.url, 'https://www.linkedin.com/in/nard-ndoka-63678819/');
    assert.equal(ndoka.socialLinks.facebook.url, editorial.profiles.vip282.facebook.url);
    assert.equal(ndoka.socialLinks.x.url, editorial.profiles.vip282.x.url);
    assert.equal(ndoka.socialLinks.linkedin.url, editorial.profiles.vip282.linkedin.url);
    assert.equal(ndoka.socialLinks.whatsapp, undefined);
    assert.equal(ndoka.socialLinks.telegram, undefined);
    const rendered = profileSocialLogos('Nard Ndoka', ndoka.socialLinks);
    assert.equal(rendered.find((item) => item.platform === 'facebook')?.href, 'https://www.facebook.com/nard.ndoka.7');
    assert.equal(rendered.find((item) => item.platform === 'x')?.href, 'https://x.com/NardNdoka');
    assert.equal(rendered.find((item) => item.platform === 'linkedin')?.href, 'https://www.linkedin.com/in/nard-ndoka-63678819/');
    assert.equal(rendered.find((item) => item.platform === 'whatsapp')?.href, 'https://www.whatsapp.com/');
    assert.equal(rendered.find((item) => item.platform === 'telegram')?.href, 'https://telegram.org/');
    assert.equal(sanitizeSocialLinks({ facebook: { approved: false, url: 'https://www.facebook.com/secret.person', approvedBy: null, approvedAt: null } })?.facebook?.url, undefined);
    const others = profiles.filter((item) => item.id !== 'vip282' && item.socialLinks);
    assert.equal(others.length, 0);
    const card = read('components/figurat-politike/PoliticianCard.tsx');
    const details = card.indexOf('data-profile-details="true"');
    const logos = card.indexOf('<ProfileSocialLogos');
    const detailsEnd = card.indexOf('data-legacy-fingerprint');
    assert.ok(details > 0 && logos > details && logos < detailsEnd);
    assert.equal(canonicalProfileShareUrl('vip2'), 'https://media.novaric.al/figurat-politike/sali-berisha');
    const graph = profileOpenGraph(ndoka);
    assert.equal(graph.title, 'Nard NDOKA');
    assert.match(graph.description, /Demokristiane/);
    assert.equal(graph.imageUrl, 'https://media.novaric.al/photos/originals/nard_ndoka.png');
  });
});
