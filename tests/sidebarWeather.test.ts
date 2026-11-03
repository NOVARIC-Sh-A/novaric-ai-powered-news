import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { JSDOM } from 'jsdom';
import {
  WEATHER_CITIES,
  WEATHER_UNAVAILABLE,
  describeWeatherCode,
  openMeteoForecastUrl,
  parseOpenMeteo,
} from '../utils/openMeteoWeather';

const read = (relative: string) => fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8');

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

const sample = {
  current: { temperature_2m: 16.4, weather_code: 0, is_day: 1 },
  daily: { temperature_2m_max: [18.2], temperature_2m_min: [11.1] },
};

describe('Sidebar weather uses Open-Meteo without a key', () => {
  it('requests Tirana and Shkodër from Open-Meteo and sends no API key', () => {
    for (const city of [WEATHER_CITIES.tirana, WEATHER_CITIES.shkoder]) {
      const url = new URL(openMeteoForecastUrl(city.latitude, city.longitude));
      assert.equal(url.origin, 'https://api.open-meteo.com');
      assert.equal(url.pathname, '/v1/forecast');
      assert.equal(url.searchParams.get('latitude'), String(city.latitude));
      assert.equal(url.searchParams.get('longitude'), String(city.longitude));
      assert.equal(url.searchParams.get('timezone'), 'Europe/Tirane');
      assert.equal(url.searchParams.has('appid'), false);
      assert.equal(url.searchParams.has('apikey'), false);
      assert.equal(url.searchParams.has('api_key'), false);
      assert.doesNotMatch(url.toString(), /openweathermap|OPENWEATHER|appid/i);
    }
    assert.equal(WEATHER_CITIES.tirana.name, 'Tiranë');
    assert.equal(WEATHER_CITIES.shkoder.name, 'Shkodër');
  });

  it('maps measured Open-Meteo values and keeps a real zero', () => {
    assert.deepEqual(parseOpenMeteo(sample), {
      temp: 16,
      temp_min: 11,
      temp_max: 18,
      description: 'Qiell i kthjellët',
      icon: '01d',
    });
    assert.deepEqual(parseOpenMeteo({
      current: { temperature_2m: 0, weather_code: 71, is_day: 0 },
      daily: { temperature_2m_max: [0.4], temperature_2m_min: [0] },
    }), {
      temp: 0,
      temp_min: 0,
      temp_max: 0,
      description: 'Borë',
      icon: '13n',
    });
    assert.equal(describeWeatherCode(61, true)?.icon, '10d');
    assert.equal(describeWeatherCode(95, true)?.description, 'Stuhi');
    assert.equal(describeWeatherCode(45, false)?.icon, '50n');
  });

  it('does not invent a temperature when the payload is incomplete', () => {
    assert.equal(parseOpenMeteo(null), null);
    assert.equal(parseOpenMeteo({}), null);
    assert.equal(parseOpenMeteo({
      current: { temperature_2m: null, weather_code: 0, is_day: 1 },
      daily: { temperature_2m_max: [18], temperature_2m_min: [11] },
    }), null);
    assert.equal(parseOpenMeteo({
      current: { temperature_2m: 16, weather_code: 0, is_day: 1 },
      daily: { temperature_2m_max: [], temperature_2m_min: [11] },
    }), null);
    assert.equal(parseOpenMeteo({
      current: { temperature_2m: '16', weather_code: 0, is_day: 1 },
      daily: { temperature_2m_max: [18], temperature_2m_min: [11] },
    }), null);
  });

  it('drops the OpenWeather key error from the sidebar', () => {
    const widget = [
      read('components/CityWeather.tsx'),
      read('components/ShkoderWeather.tsx'),
      read('components/TiranaWeather.tsx'),
      read('components/RightSidebar.tsx'),
      read('utils/openMeteoWeather.ts'),
    ].join('\n');
    assert.match(widget, /api\.open-meteo\.com/);
    assert.match(widget, /Të dhënat e motit nuk janë të disponueshme/);
    assert.match(read('components/RightSidebar.tsx'), /TiranaWeather/);
    assert.match(read('components/RightSidebar.tsx'), /ShkoderWeather/);
    assert.doesNotMatch(widget, /Çelësi API për shërbimin e motit mungon/);
    assert.doesNotMatch(widget, /openweathermap|REACT_APP_OPENWEATHER|appid/i);
    assert.doesNotMatch(read('.env.example'), /OPENWEATHER/);
    assert.match(read('staticwebapp.config.json'), /api\.open-meteo\.com/);
  });
});

describe('Sidebar weather widget', () => {
  let TiranaWeather: typeof import('../components/TiranaWeather').TiranaWeather;
  let ShkoderWeather: typeof import('../components/ShkoderWeather').ShkoderWeather;
  let createRoot: typeof import('react-dom/client').createRoot;
  let act: typeof import('react').act;

  before(async () => {
    ({ TiranaWeather } = await import('../components/TiranaWeather'));
    ({ ShkoderWeather } = await import('../components/ShkoderWeather'));
    ({ createRoot } = await import('react-dom/client'));
    ({ act } = await import('react'));
  });

  it('shows Tirana and Shkodër from Open-Meteo measurements', async () => {
    g.fetch = async (input: string) => {
      assert.match(String(input), /^https:\/\/api\.open-meteo\.com\/v1\/forecast\?/);
      assert.doesNotMatch(String(input), /appid|apikey|api_key/i);
      return { ok: true, json: async () => sample };
    };
    const root = createRoot(document.getElementById('root')!);
    await act(async () => {
      root.render(React.createElement(React.Fragment, null,
        React.createElement(TiranaWeather),
        React.createElement(ShkoderWeather),
      ));
    });
    const text = document.body.textContent || '';
    assert.match(text, /16°C/);
    assert.match(text, /Tiranë/);
    assert.match(text, /Shkodër/);
    assert.match(text, /H:/);
    assert.match(text, /18°/);
    assert.match(text, /L:/);
    assert.match(text, /11°/);
    assert.equal(document.querySelectorAll('[data-weather-city]').length, 2);
    assert.doesNotMatch(text, /Çelësi API/);
    await act(async () => { root.unmount(); });
  });

  it('shows the neutral unavailable label when Open-Meteo cannot be read', async () => {
    g.fetch = async () => { throw new Error('offline'); };
    const root = createRoot(document.getElementById('root')!);
    await act(async () => {
      root.render(React.createElement(TiranaWeather));
    });
    const text = document.body.textContent || '';
    assert.match(text, new RegExp(WEATHER_UNAVAILABLE));
    assert.equal(document.querySelector('[data-weather-status]')?.textContent, WEATHER_UNAVAILABLE);
    assert.doesNotMatch(text, /Çelësi API|°C/);
    await act(async () => { root.unmount(); });
  });
});
