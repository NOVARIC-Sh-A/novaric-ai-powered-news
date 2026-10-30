
import React, { useState, useEffect } from 'react';
import {
  SunIcon,
  CloudIcon,
  CloudRainIcon,
  CloudBoltIcon,
  SnowIcon,
  Bars3BottomLeftIcon,
  ExclamationTriangleIcon
} from './icons';

interface WeatherData {
  temp: number;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
}

const API_KEY = (typeof process !== 'undefined' && process.env?.REACT_APP_OPENWEATHER_API_KEY) || '';
const SHKODER_LAT = 42.0683;
const SHKODER_LON = 19.5122;

// FIX: Replaced JSX.Element with React.ReactElement to fix namespace error.
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

export const ShkoderWeather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!API_KEY) {
      setError("Çelësi API për shërbimin e motit mungon.");
      setIsLoading(false);
      return;
    }

    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${SHKODER_LAT}&lon=${SHKODER_LON}&appid=${API_KEY}&units=metric&lang=al`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Dështoi marrja e të dhënave të motit: ${response.statusText}`);
        }
        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp),
          temp_min: Math.round(data.main.temp_min),
          temp_max: Math.round(data.main.temp_max),
          description: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
          icon: data.weather[0].icon,
        });
        setError(null);
      } catch (err: any) {
        console.error("Weather fetch error:", err);
        setError("Gabim në marrjen e të dhënave të motit.");
        setWeather(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center text-xs text-slate-500 dark:text-slate-400">Duke ngarkuar motin...</div>;
    }
  
    if (error) {
      return (
        <div className="text-center text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span>{error}</span>
        </div>
      );
    }

    if (!weather) {
        return null;
    }
    
    return (
      <a
        href="https://www.msn.com/en-gb/weather/forecast/in-Shkoder,Shkod%C3%ABr-County?loc=eyJsIjoiU2hrb2RlciIsInIiOiJTaGtvZMOrciBDb3VudHkiLCJjIjoiQWxiYW5pYSIsImkiOiJBTCIsImciOiJlbi1nYiIsIngiOjE5LjUxMTUxMjc1NjM0NzY1NiwieSI6NDIuMDczMzQxMzY5NjI4OTA2fQ%3D%3D&weadegreetype=C"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 w-full group [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)] dark:[text-shadow:1px_1px_4px_rgba(0,0,0,0.7)]"
        aria-label={`Parashikimi i motit për Shkodrën. Aktualisht: ${weather.temp}°. Më e larta: ${weather.temp_max}°, Më e ulëta: ${weather.temp_min}°`}
      >
        <div className="flex-shrink-0">
          {weatherIconMap[weather.icon] || <CloudIcon className="w-7 h-7 text-slate-400"/>}
        </div>
        <div className="text-left">
          <span className="font-bold text-lg text-slate-800 dark:text-slate-100">{weather.temp}°C</span>
          <span className="block text-xs font-medium text-slate-600 dark:text-slate-300 -mt-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Shkodër</span>
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
