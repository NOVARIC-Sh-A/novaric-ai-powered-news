export const WEATHER_UNAVAILABLE = 'Të dhënat e motit nuk janë të disponueshme';

export interface WeatherCity {
  id: 'tirana' | 'shkoder';
  name: string;
  latitude: number;
  longitude: number;
  href: string;
}

export const WEATHER_CITIES: Record<WeatherCity['id'], WeatherCity> = {
  tirana: {
    id: 'tirana',
    name: 'Tiranë',
    latitude: 41.3275,
    longitude: 19.8187,
    href: 'https://www.msn.com/en-gb/weather/forecast/in-Tirana,Albania',
  },
  shkoder: {
    id: 'shkoder',
    name: 'Shkodër',
    latitude: 42.0683,
    longitude: 19.5122,
    href: 'https://www.msn.com/en-gb/weather/forecast/in-Shkoder,Shkod%C3%ABr-County?loc=eyJsIjoiU2hrb2RlciIsInIiOiJTaGtvZMOrciBDb3VudHkiLCJjIjoiQWxiYW5pYSIsImkiOiJBTCIsImciOiJlbi1nYiIsIngiOjE5LjUxMTUxMjc1NjM0NzY1NiwieSI6NDIuMDczMzQxMzY5NjI4OTA2fQ%3D%3D&weadegreetype=C',
  },
};

export interface SidebarWeather {
  temp: number;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
}

/** Open-Meteo forecast URL. No API key is sent. */
export function openMeteoForecastUrl(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,weather_code,is_day',
    daily: 'temperature_2m_max,temperature_2m_min',
    timezone: 'Europe/Tirane',
    forecast_days: '1',
  });
  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

function finite(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function weatherCodeLabel(code: number): { description: string; icon: string } | null {
  const groups: Array<{ codes: number[]; description: string; icon: string }> = [
    { codes: [0], description: 'Qiell i kthjellët', icon: '01' },
    { codes: [1], description: 'Kryesisht i kthjellët', icon: '01' },
    { codes: [2], description: 'Pjesërisht me re', icon: '02' },
    { codes: [3], description: 'I vranët', icon: '04' },
    { codes: [45, 48], description: 'Mjegull', icon: '50' },
    { codes: [51, 53, 55, 56, 57], description: 'Shi i imët', icon: '09' },
    { codes: [61, 63, 65, 66, 67], description: 'Shi', icon: '10' },
    { codes: [71, 73, 75, 77], description: 'Borë', icon: '13' },
    { codes: [80, 81, 82], description: 'Shira', icon: '09' },
    { codes: [85, 86], description: 'Reshje bore', icon: '13' },
    { codes: [95, 96, 99], description: 'Stuhi', icon: '11' },
  ];
  return groups.find((group) => group.codes.includes(code)) ?? null;
}

export function describeWeatherCode(code: number, isDay: boolean): { description: string; icon: string } | null {
  const match = weatherCodeLabel(code);
  if (!match) return null;
  return {
    description: match.description,
    icon: `${match.icon}${isDay ? 'd' : 'n'}`,
  };
}

/**
 * Reads a real Open-Meteo payload. Missing measurements stay missing:
 * null is returned instead of substituting 0 or any other number.
 */
export function parseOpenMeteo(payload: unknown): SidebarWeather | null {
  if (!payload || typeof payload !== 'object') return null;
  const body = payload as {
    current?: { temperature_2m?: unknown; weather_code?: unknown; is_day?: unknown };
    daily?: { temperature_2m_max?: unknown[]; temperature_2m_min?: unknown[] };
  };
  const temp = finite(body.current?.temperature_2m);
  const tempMax = finite(body.daily?.temperature_2m_max?.[0]);
  const tempMin = finite(body.daily?.temperature_2m_min?.[0]);
  if (temp == null || tempMax == null || tempMin == null) return null;

  const code = finite(body.current?.weather_code);
  const isDay = body.current?.is_day !== 0;
  const described = code == null ? null : describeWeatherCode(code, isDay);

  return {
    temp: Math.round(temp),
    temp_min: Math.round(tempMin),
    temp_max: Math.round(tempMax),
    description: described?.description ?? '',
    icon: described?.icon ?? '',
  };
}
