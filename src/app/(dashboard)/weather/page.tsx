"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  ArrowLeft,
  Info,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { MAHARASHTRA_WEATHER_LOCATIONS } from "@/features/weather/locations";
import { WeatherDataResponse } from "@/features/weather/types";
import { getWeatherAction } from "@/features/weather/actions";

export default function WeatherPage() {
  const { t, language } = useTranslation();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Pune");
  const [weatherData, setWeatherData] = useState<WeatherDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (district: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherAction(district);
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || "हवामान डेटा लोड करण्यात अडचण आली");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(selectedDistrict);
  }, [selectedDistrict, loadWeather]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedDistrict(val);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/home"
            className="md:hidden text-krishi-textMuted hover:text-krishi-deepGreen p-2 min-w-[44px] min-h-[44px] flex items-center justify-center -ml-1 rounded-xl active:bg-krishi-primary-50"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-krishi-deepGreen">
              {t("nav.weather")} व कृषी हवामान सल्ला
            </h1>
            <p className="text-xs sm:text-sm text-krishi-textMuted">
              स्थानिक हवामान अंदाज, पावसाची शक्यता आणि शेतीकामांचे वेळेवर नियोजन
            </p>
          </div>
        </div>

        {/* Location Selector & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <MapPin className="w-4 h-4 text-emerald-700 absolute left-3 top-3.5" />
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={loading}
              className="pl-9 pr-8 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold border border-stone-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {Object.entries(MAHARASHTRA_WEATHER_LOCATIONS).map(([key, loc]) => (
                <option key={key} value={key}>
                  {loc.nameMr} ({loc.nameEn})
                </option>
              ))}
            </select>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => loadWeather(selectedDistrict)}
            disabled={loading}
            title="रिफ्रेश करा"
            className="min-h-[44px] min-w-[44px] px-3 flex items-center justify-center rounded-xl"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Data Source Transparency Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>
            <strong>डेटा स्रोत:</strong>{" "}
            {weatherData?.dataSource === "open_meteo_live" ? (
              <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                थेट Open-Meteo API (Live Weather Data)
              </span>
            ) : (
              <span className="text-amber-700 font-medium">
                ऑफलाइन प्रात्यक्षिक हवामान मॉडेल (Deterministic Fallback)
              </span>
            )}
          </span>
        </div>
        <span className="text-[11px] text-stone-400">
          अद्ययावत वेळ: {weatherData?.fetchedAt ? new Date(weatherData.fetchedAt).toLocaleTimeString("mr-IN") : "लोड होत आहे..."}
        </span>
      </div>

      {/* Error state with retry */}
      {error && (
        <Alert variant="warning" title="हवामान सेवा सूचना">
          <div className="space-y-2">
            <p>{error}</p>
            <Button size="sm" variant="outline" onClick={() => loadWeather(selectedDistrict)}>
              पुन्हा प्रयत्न करा (Retry)
            </Button>
          </div>
        </Alert>
      )}

      {/* Current Conditions Card */}
      {loading && !weatherData ? (
        <div className="h-48 bg-stone-100 rounded-2xl animate-pulse" />
      ) : weatherData ? (
        <Card className="border-emerald-200/80 bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 text-white shadow-lg overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between w-full flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-300" />
                <div>
                  <CardTitle className="text-lg sm:text-xl text-white">
                    {weatherData.location.nameMr} ({weatherData.location.nameEn})
                  </CardTitle>
                  <CardDescription className="text-emerald-200/80 text-xs">
                    अक्षांश: {weatherData.location.latitude.toFixed(2)}°, रेखांश: {weatherData.location.longitude.toFixed(2)}°
                  </CardDescription>
                </div>
              </div>
              <Badge variant="accent" size="sm" className="bg-emerald-500/20 text-emerald-200 border-emerald-400/40">
                {weatherData.current.conditionLabelMr}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                    {weatherData.current.temperatureC}°C
                  </span>
                  <span className="text-xs sm:text-sm text-emerald-200">
                    जाणवणारे तापमान: {weatherData.current.apparentTemperatureC}°C
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 mt-1">
                  हवामान स्थिती: <strong>{weatherData.current.conditionLabelMr}</strong>
                </p>
              </div>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 flex-1">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 flex flex-col items-center text-center">
                  <Droplets className="w-5 h-5 text-blue-300 mb-1" />
                  <span className="text-[11px] text-emerald-100">हवेतील आर्द्रता</span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {weatherData.current.relativeHumidity}%
                  </span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 flex flex-col items-center text-center">
                  <Wind className="w-5 h-5 text-emerald-300 mb-1" />
                  <span className="text-[11px] text-emerald-100">वाऱ्याचा वेग</span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {weatherData.current.windSpeedKmh} किमी/तास
                  </span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 flex flex-col items-center text-center">
                  <Droplets className="w-5 h-5 text-cyan-300 mb-1" />
                  <span className="text-[11px] text-emerald-100">पावसाचे प्रमाण</span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {weatherData.current.precipitationMm} मिमी
                  </span>
                </div>

                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 flex flex-col items-center text-center">
                  <CloudSun className="w-5 h-5 text-amber-300 mb-1" />
                  <span className="text-[11px] text-emerald-100">हवामान स्थिती</span>
                  <span className="text-sm font-bold text-white truncate max-w-[80px]">
                    {weatherData.current.conditionIcon === "sunny"
                      ? "सूर्यप्रकाश"
                      : weatherData.current.conditionIcon === "rainy"
                      ? "पाऊस"
                      : "ढगाळ"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* 5-Day Forecast */}
      {weatherData && weatherData.forecast.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            पुढील ५ दिवसांचा हवामान अंदाज (5-Day Agro Forecast)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {weatherData.forecast.map((day, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white rounded-xl border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-2 hover:border-emerald-500 transition-colors"
              >
                <div>
                  <span className="block text-xs font-bold text-stone-800">{day.dayNameMr}</span>
                  <span className="text-[10px] text-stone-500">{day.date}</span>
                </div>

                <div className="py-1">
                  <div className="text-lg font-extrabold text-stone-900">
                    {day.maxTempC}° <span className="text-xs font-normal text-stone-500">/ {day.minTempC}°</span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-800 block line-clamp-1">
                    {day.conditionLabelMr}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-blue-700 font-medium">
                  <span className="flex items-center gap-0.5">
                    <Droplets className="w-3 h-3" />
                    {day.precipitationProbability}%
                  </span>
                  {day.precipitationMm > 0 && (
                    <span className="text-stone-500 text-[10px]">{day.precipitationMm}mm</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agricultural Advisories Based on Weather */}
      {weatherData && weatherData.advisories.length > 0 && (
        <div className="space-y-3 pt-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            हवामान-आधारित शेती सल्ला व खबरदारी (Weather-dependent Advisories)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weatherData.advisories.map((adv) => (
              <Card
                key={adv.id}
                className={`border ${
                  adv.severity === "alert"
                    ? "border-red-300 bg-red-50/40"
                    : adv.severity === "warning"
                    ? "border-amber-300 bg-amber-50/40"
                    : "border-emerald-200 bg-emerald-50/30"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle
                      className={`text-sm sm:text-base font-bold flex items-center gap-1.5 ${
                        adv.severity === "alert"
                          ? "text-red-900"
                          : adv.severity === "warning"
                          ? "text-amber-900"
                          : "text-emerald-950"
                      }`}
                    >
                      {adv.cautionFlag && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                      {adv.titleMr}
                    </CardTitle>
                    <Badge
                      variant={
                        adv.severity === "alert" ? "warning" : adv.severity === "warning" ? "secondary" : "success"
                      }
                      size="sm"
                    >
                      {adv.severity === "alert" ? "सतर्कता" : adv.severity === "warning" ? "खबरदारी" : "मार्गदर्शन"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-xs leading-relaxed">
                  <p className="text-stone-700">{adv.advisoryTextMr}</p>

                  <div className="p-2.5 bg-white/80 rounded-lg border border-stone-200/60 space-y-1">
                    <span className="font-semibold text-stone-900 block">शिफारस केलेली कृती:</span>
                    <span className="text-emerald-900 font-medium">{adv.recommendedActionMr}</span>
                  </div>

                  {adv.relevantCrops.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1 text-[11px] text-stone-500">
                      <span>संबंधित पिके:</span>
                      {adv.relevantCrops.map((c) => (
                        <span key={c} className="bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
