import React, { useEffect, useState } from 'react';
import {
  SunIcon,
  CloudIcon,
  CloudRainIcon,
  CloudBoltIcon,
  SnowIcon,
  Bars3BottomLeftIcon,
} from './icons';
import {
  SidebarWeather,
  WEATHER_UNAVAILABLE,
  WeatherCity,
  openMeteoForecastUrl,
  parseOpenMeteo,
} from '../utils/openMeteoWeather';

const weatherIconMap: { [key: string]: React.ReactElement } = {
  '01d': <SunIcon className="w-7 h-7 text-yellow-500" />,
  '01n': <SunIcon className="w-7 h-7 text-yellow-300" />,
  '02d': <CloudIcon className="w-7 h-7 text-slate-400" />,
  '02n': <CloudIcon className="w-7 h-7 text-slate-500" />,
  '03d': <CloudIcon className="w-7 h-7 text-slate-400" />,
  '03n': <CloudIcon className="w-7 h-7 text-slate-500" />,
  '04d': <CloudIcon className="w-7 h-7 text-slate-500" />,
  '04n': <CloudIcon className="w-7 h-7 text-slate-600" />,
  '09d': <CloudRainIcon className="w-7 h-7 text-blue-500" />,
  '09n': <CloudRainIcon className="w-7 h-7 text-blue-400" />,
  '10d': <CloudRainIcon className="w-7 h-7 text-blue-500" />,
  '10n': <CloudRainIcon className="w-7 h-7 text-blue-400" />,
  '11d': <CloudBoltIcon className="w-7 h-7 text-yellow-500" />,
  '11n': <CloudBoltIcon className="w-7 h-7 text-yellow-400" />,
  '13d': <SnowIcon className="w-7 h-7 text-white" />,
  '13n': <SnowIcon className="w-7 h-7 text-slate-200" />,
  '50d': <Bars3BottomLeftIcon className="w-7 h-7 text-slate-400" />,
  '50n': <Bars3BottomLeftIcon className="w-7 h-7 text-slate-500" />,
};

export const CityWeather: React.FC<{ city: WeatherCity }> = ({ city }) => {
  const [weather, setWeather] = useState<SidebarWeather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(openMeteoForecastUrl(city.latitude, city.longitude), {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`weather ${response.status}`);
        }
        const parsed = parseOpenMeteo(await response.json());
        if (!alive) return;
        if (!parsed) {
          setWeather(null);
          setError(WEATHER_UNAVAILABLE);
          return;
        }
        setWeather(parsed);
        setError(null);
      } catch (err) {
        if (!alive || controller.signal.aborted) return;
        console.error('Weather fetch error:', err);
        setWeather(null);
        setError(WEATHER_UNAVAILABLE);
      } finally {
        if (alive) setIsLoading(false);
      }
    };

    fetchWeather();
    return () => {
      alive = false;
      controller.abort();
    };
  }, [city.latitude, city.longitude]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center text-xs text-slate-500 dark:text-slate-400">Duke ngarkuar motin...</div>;
    }

    if (error || !weather) {
      return (
        <p className="text-center text-xs text-slate-500 dark:text-slate-400" data-weather-status="unavailable">
          {WEATHER_UNAVAILABLE}
        </p>
      );
    }

    return (
      <a
        href={city.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 w-full group [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:[text-shadow:1px_1px_4px_rgba(0,0,0,0.7)]"
        aria-label={`Parashikimi i motit për ${city.name}. Aktualisht: ${weather.temp}°. Më e larta: ${weather.temp_max}°, Më e ulëta: ${weather.temp_min}°`}
        data-weather-city={city.id}
      >
        <div className="flex-shrink-0">
          {weatherIconMap[weather.icon] || <CloudIcon className="w-7 h-7 text-slate-400"/>}
        </div>
        <div className="text-left">
          <span className="font-bold text-lg text-slate-800 dark:text-slate-100">{weather.temp}°C</span>
          <span className="block text-xs font-medium text-slate-600 dark:text-slate-300 -mt-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{city.name}</span>
        </div>
        <div className="h-8 w-px bg-slate-300 dark:bg-slate-600"></div>
        <div className="text-xs font-medium text-slate-700 dark:text-slate-200 text-left">
          <div>
            <span className="font-semibold text-red-500">H:</span> {weather.temp_max}°
          </div>
          <div>
            <span className="font-semibold text-blue-500">L:</span> {weather.temp_min}°
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm p-2 rounded-lg shadow-sm w-full">
      {renderContent()}
    </div>
  );
};
