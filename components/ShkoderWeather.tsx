import React from 'react';
import { CityWeather } from './CityWeather';
import { WEATHER_CITIES } from '../utils/openMeteoWeather';

export const ShkoderWeather: React.FC = () => {
  return <CityWeather city={WEATHER_CITIES.shkoder} />;
};
