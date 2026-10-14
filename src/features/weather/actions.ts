"use server";

import { fetchWeatherForLocation } from "./service";
import { WeatherDataResponse } from "./types";

export async function getWeatherAction(
  districtKey: string = "Pune"
): Promise<WeatherDataResponse> {
  return fetchWeatherForLocation(districtKey);
}
