import React from 'react';
import { CityWeather } from './CityWeather';
import { WEATHER_CITIES } from '../utils/openMeteoWeather';

export const TiranaWeather: React.FC = () => {
  return <CityWeather city={WEATHER_CITIES.tirana} />;
};
