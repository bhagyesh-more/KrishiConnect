export interface WeatherLocation {
  districtKey: string;
  nameMr: string;
  nameHi: string;
  nameEn: string;
  latitude: number;
  longitude: number;
  region: "western_maharashtra" | "marathwada" | "vidarbha" | "north_maharashtra" | "konkan";
}

export interface CurrentWeather {
  temperatureC: number;
  apparentTemperatureC: number;
  relativeHumidity: number;
  precipitationMm: number;
  weatherCode: number;
  windSpeedKmh: number;
  windDirectionDegrees: number;
  conditionLabelMr: string;
  conditionLabelHi: string;
  conditionLabelEn: string;
  conditionIcon: "sunny" | "partly_cloudy" | "cloudy" | "rainy" | "stormy";
  observedAt: string;
  isMockData: boolean;
}

export interface DailyForecast {
  date: string;
  dayNameMr: string;
  dayNameEn: string;
  maxTempC: number;
  minTempC: number;
  precipitationProbability: number;
  precipitationMm: number;
  weatherCode: number;
  conditionLabelMr: string;
  conditionLabelEn: string;
  conditionIcon: "sunny" | "partly_cloudy" | "cloudy" | "rainy" | "stormy";
}

export interface AgriculturalWeatherAdvisory {
  id: string;
  severity: "info" | "warning" | "alert";
  titleMr: string;
  titleHi: string;
  titleEn: string;
  advisoryTextMr: string;
  advisoryTextHi: string;
  advisoryTextEn: string;
  relevantCrops: string[];
  recommendedActionMr: string;
  recommendedActionEn: string;
  cautionFlag: boolean;
}

export interface WeatherDataResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  forecast: DailyForecast[];
  advisories: AgriculturalWeatherAdvisory[];
  dataSource: "open_meteo_live" | "offline_deterministic_fallback";
  fetchedAt: string;
}
