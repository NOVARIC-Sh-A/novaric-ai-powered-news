import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></html>', {
  url: 'http://localhost/',
});

const g = globalThis as any;

g.window = dom.window;
g.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
});
g.HTMLElement = dom.window.HTMLElement;
g.SVGElement = dom.window.SVGElement;
g.Element = dom.window.Element;
g.Node = dom.window.Node;
g.IS_REACT_ACT_ENVIRONMENT = true;
g.fetch = async () => ({ ok: false, json: async () => null });

describe('Clicking a politician card name opens the profile', () => {
  let PoliticianGridCard: typeof import('../components/figurat-politike/PoliticianGridCard').PoliticianGridCard;
  let createRoot: typeof import('react-dom/client').createRoot;
  let act: typeof import('react').act;

  before(async () => {
    ({ PoliticianGridCard } = await import('../components/figurat-politike/PoliticianGridCard'));
    ({ createRoot } = await import('react-dom/client'));
    ({ act } = await import('react'));
  });

  it('navigates when the click starts on the name element', async () => {
    const opened: Array<string | number> = [];
    const root = createRoot(document.getElementById('root')!);
    const profile = {
      id: 'vip270',
      numericId: 270,
      name: 'Agron Gaxho',
      category: 'Politikë (PS)',
      party: 'PS',
      primaryRole: 'Deputet i Kuvendit të Shqipërisë',
      composite: 86.9,
      paragonDimensions: [100, 98.1, 61.4, 59.1, 100, 99.7, null],
    };

    await act(async () => {
      root.render(
        React.createElement(PoliticianGridCard, {
          politician: profile as never,
          onSelectPolitician: (id: string | number) => opened.push(id),
        })
      );
    });

    const name = document.querySelector('[data-politician-name]');
    assert.ok(name, 'name element missing');
    assert.equal(name.textContent, 'Agron Gaxho');
    assert.match(String(name.className), /pointer-events-none/);
    assert.equal(name.closest('a')?.getAttribute('href'), '/figurat-politike/agron-gaxho');
    assert.equal((name as HTMLElement).onclick, null);

    await act(async () => {
      name.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    assert.deepEqual(opened, ['vip270']);

    await act(async () => {
      name.closest('a')?.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    });
    assert.deepEqual(opened, ['vip270', 'vip270']);

    await act(async () => {
      root.unmount();
    });
  });
});
