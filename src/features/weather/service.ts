import {
  WeatherDataResponse,
  WeatherLocation,
  DailyForecast,
  AgriculturalWeatherAdvisory,
} from "./types";
import { MAHARASHTRA_WEATHER_LOCATIONS, interpretWmoCode } from "./locations";

export async function fetchWeatherForLocation(
  districtKey: string = "Pune"
): Promise<WeatherDataResponse> {
  const location: WeatherLocation =
    MAHARASHTRA_WEATHER_LOCATIONS[districtKey] || MAHARASHTRA_WEATHER_LOCATIONS["Pune"];

  const baseUrl = process.env.OPEN_METEO_BASE_URL || "https://api.open-meteo.com/v1";
  const url = `${baseUrl}/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FKolkata&forecast_days=5`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 1800 }, // Cache 30 mins
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP error: ${res.status}`);
    }

    const data = await res.json();
    if (!data.current || !data.daily) {
      throw new Error("Invalid structure from Open-Meteo response");
    }

    const currentWmo = interpretWmoCode(data.current.weather_code);

    const forecast: DailyForecast[] = (data.daily.time as string[]).map((dateStr, idx) => {
      const wmo = interpretWmoCode(data.daily.weather_code[idx]);
      const dateObj = new Date(dateStr);
      const dayNamesMr = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
      const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      return {
        date: dateStr,
        dayNameMr: dayNamesMr[dateObj.getDay()],
        dayNameEn: dayNamesEn[dateObj.getDay()],
        maxTempC: Math.round(data.daily.temperature_2m_max[idx]),
        minTempC: Math.round(data.daily.temperature_2m_min[idx]),
        precipitationProbability: data.daily.precipitation_probability_max[idx] ?? 0,
        precipitationMm: data.daily.precipitation_sum[idx] ?? 0,
        weatherCode: data.daily.weather_code[idx],
        conditionLabelMr: wmo.labelMr,
        conditionLabelEn: wmo.labelEn,
        conditionIcon: wmo.icon,
      };
    });

    const advisories = generateAgroAdvisories(
      data.current.temperature_2m,
      data.current.relative_humidity_2m,
      data.current.wind_speed_10m,
      data.daily.precipitation_sum[0] || 0,
      location.nameMr
    );

    return {
      location,
      current: {
        temperatureC: Math.round(data.current.temperature_2m * 10) / 10,
        apparentTemperatureC: Math.round(data.current.apparent_temperature * 10) / 10,
        relativeHumidity: Math.round(data.current.relative_humidity_2m),
        precipitationMm: data.current.precipitation,
        weatherCode: data.current.weather_code,
        windSpeedKmh: Math.round(data.current.wind_speed_10m),
        windDirectionDegrees: data.current.wind_direction_10m,
        conditionLabelMr: currentWmo.labelMr,
        conditionLabelHi: currentWmo.labelHi,
        conditionLabelEn: currentWmo.labelEn,
        conditionIcon: currentWmo.icon,
        observedAt: data.current.time,
        isMockData: false,
      },
      forecast,
      advisories,
      dataSource: "open_meteo_live",
      fetchedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    // Graceful offline / failure fallback with deterministic Maharashtra climate model
    return getFallbackWeather(location, err.message);
  }
}

function generateAgroAdvisories(
  temp: number,
  humidity: number,
  windSpeed: number,
  rainSum: number,
  districtMr: string
): AgriculturalWeatherAdvisory[] {
  const advisories: AgriculturalWeatherAdvisory[] = [];

  // Spraying advisory based on wind speed and rain
  if (windSpeed > 15 || rainSum > 2) {
    advisories.push({
      id: "adv-spray-warning",
      severity: "warning",
      titleMr: "कीटकनाशक फवारणी पुढे ढकला",
      titleHi: "कीटनाशक छिड़काव स्थगित करें",
      titleEn: "Postpone Chemical Spraying",
      advisoryTextMr: `${districtMr} भागात वाऱ्याचा वेग ${Math.round(windSpeed)} किमी/तास आणि पावसाची शक्यता असल्यामुळे औषध वाहून जाणे किंवा धुक्यासारखे उडण्याचा (drift) धोका आहे.`,
      advisoryTextHi: `हवा की गति अधिक होने के कारण कीटनाशक का असर कम होगा और बहाव का खतरा है।`,
      advisoryTextEn: `High wind speed (>15 km/h) or expected precipitation reduces spray efficacy and increases chemical drift risks.`,
      relevantCrops: ["सोयाबीन", "कापूस", "कांदा", "द्राक्ष"],
      recommendedActionMr: "फवारणी सकाळी वारे शांत असताना करा किंवा पाऊस ओसरल्यानंतर करा.",
      recommendedActionEn: "Schedule spraying during early morning hours when winds are calm and foliage is dry.",
      cautionFlag: true,
    });
  } else {
    advisories.push({
      id: "adv-spray-safe",
      severity: "info",
      titleMr: "फवारणीसाठी अनुकूल हवामान",
      titleHi: "छिड़काव के लिए अनुकूल मौसम",
      titleEn: "Favorable Weather for Spraying",
      advisoryTextMr: `${districtMr} भागात वारा शांत असून पाने कोरडी राहिल्यास सकाळी ९ ते ११ या वेळेत आवश्यक सूक्ष्म अन्नद्रव्ये किंवा सेंद्रिय फवारणी करता येईल.`,
      advisoryTextHi: `हवा सामान्य है, सुबह के समय आवश्यकतानुसार छिड़काव किया जा सकता है।`,
      advisoryTextEn: `Calm wind conditions allow safe application of required micronutrients or foliar sprays.`,
      relevantCrops: ["सर्व पिके"],
      recommendedActionMr: "जमिनीत ओलावा तपासूनच विद्राव्य खतांची फवारणी करावी.",
      recommendedActionEn: "Ensure adequate root zone moisture before foliar fertilizer application.",
      cautionFlag: false,
    });
  }

  // Fungal disease warning based on humidity
  if (humidity > 75) {
    advisories.push({
      id: "adv-fungal-warning",
      severity: "alert",
      titleMr: "बुरशीजन्य रोगांचा प्रादुर्भाव सतर्कता",
      titleHi: "फफूंद रोग प्रकोप चेतावनी",
      titleEn: "High Humidity & Fungal Risk Alert",
      advisoryTextMr: `हवेतील आर्द्रता ${humidity}% असल्याने कांद्यावरील करपा (Purple Blotch), सोयाबीनवरील तांबेरा किंवा टोमॅटोवरील भुरी रोगाचा प्रसार वेगाने होऊ शकतो.`,
      advisoryTextHi: `हवा में 75% से अधिक नमी होने पर फफूंद जनित रोगों का खतरा बढ़ जाता है।`,
      advisoryTextEn: `Relative humidity exceeds 75%, creating microclimates conducive to fungal spores and leaf blights.`,
      relevantCrops: ["कांदा", "सोयाबीन", "टोमॅटो", "द्राक्ष"],
      recommendedActionMr: "पिकांची नियमित पाहणी करा व लक्षणे दिसताच जैविक बुरशीनाशक (ट्रायकोडर्मा) वापरा.",
      recommendedActionEn: "Scout crop canopies closely and apply prophylactic bio-fungicide (Trichoderma) if warranted.",
      cautionFlag: true,
    });
  }

  // Irrigation planning based on temperature
  if (temp > 34) {
    advisories.push({
      id: "adv-irrigation-heat",
      severity: "info",
      titleMr: "उन्हाचा तडाखा: हलके सिंचन नियोजन",
      titleHi: "तेज धूप: हल्का सिंचाई प्रबंधन",
      titleEn: "Heat Management: Light Frequent Irrigation",
      advisoryTextMr: `दिवसाचे तापमान ${Math.round(temp)}°C पर्यंत जात असल्याने पिकांना पाण्याचा ताण पडू नये म्हणून संध्याकाळी किंवा ठिबकद्वारे हलके पाणी द्यावे.`,
      advisoryTextHi: `फसलों को पानी का तनाव न हो, शाम के समय ड्रिप से हल्का पानी दें।`,
      advisoryTextEn: `High daytime temperatures accelerate evapotranspiration; apply light irrigations during evening hours.`,
      relevantCrops: ["भाजीपाला", "फळबागा", "ऊस"],
      recommendedActionMr: "जमिनीवर आच्छादन (mulching) केल्यास बाष्पीभवन ३०% कमी होते.",
      recommendedActionEn: "Use crop residue mulching to reduce surface moisture evaporation.",
      cautionFlag: false,
    });
  }

  return advisories;
}

function getFallbackWeather(
  location: WeatherLocation,
  errorReason?: string
): WeatherDataResponse {
  const currentWmo = interpretWmoCode(1); // Partly cloudy fallback

  return {
    location,
    current: {
      temperatureC: 28.5,
      apparentTemperatureC: 29.0,
      relativeHumidity: 62,
      precipitationMm: 0,
      weatherCode: 1,
      windSpeedKmh: 11,
      windDirectionDegrees: 240,
      conditionLabelMr: currentWmo.labelMr,
      conditionLabelHi: currentWmo.labelHi,
      conditionLabelEn: currentWmo.labelEn,
      conditionIcon: currentWmo.icon,
      observedAt: new Date().toISOString(),
      isMockData: true,
    },
    forecast: [
      {
        date: "आज (Today)",
        dayNameMr: "आज",
        dayNameEn: "Today",
        maxTempC: 31,
        minTempC: 19,
        precipitationProbability: 10,
        precipitationMm: 0,
        weatherCode: 1,
        conditionLabelMr: "अंशतः ढगाळ",
        conditionLabelEn: "Partly Cloudy",
        conditionIcon: "partly_cloudy",
      },
      {
        date: "उद्या (Tomorrow)",
        dayNameMr: "उद्या",
        dayNameEn: "Tomorrow",
        maxTempC: 32,
        minTempC: 20,
        precipitationProbability: 15,
        precipitationMm: 0,
        weatherCode: 2,
        conditionLabelMr: "अंशतः ढगाळ",
        conditionLabelEn: "Partly Cloudy",
        conditionIcon: "partly_cloudy",
      },
      {
        date: "दिवस ३",
        dayNameMr: "परवा",
        dayNameEn: "Day 3",
        maxTempC: 30,
        minTempC: 19,
        precipitationProbability: 25,
        precipitationMm: 0.5,
        weatherCode: 3,
        conditionLabelMr: "ढगाळ",
        conditionLabelEn: "Overcast",
        conditionIcon: "cloudy",
      },
    ],
    advisories: [
      {
        id: "fallback-adv-1",
        severity: "info",
        titleMr: "हवामान आधारित पीक नियोजन",
        titleHi: "मौसम आधारित फसल प्रबंधन",
        titleEn: "Weather-based Farm Operations",
        advisoryTextMr: `${location.nameMr} जिल्ह्यात चालू हंगामासाठी सरासरी हवामान अनुकूल असून शेतीकामांचे नियमित वेळापत्रक सुरू ठेवावे. (टीप: थेट Open-Meteo नेटवर्क उपलब्ध नसल्याने ऑफलाइन प्रात्यक्षिक सल्ला दाखवत आहे: ${errorReason || "Offline mode"}).`,
        advisoryTextHi: `ऑफलाइन मोड में औसत कृषि मौसम सलाह।`,
        advisoryTextEn: `Operating on cached climatic baseline for ${location.nameEn}. Scheduled farming operations can proceed normally.`,
        relevantCrops: ["सर्व पिके"],
        recommendedActionMr: "जमिनीतील ओलावा तपासून सिंचन व खत व्यवस्थापन करा.",
        recommendedActionEn: "Monitor topsoil moisture before scheduled fertilizer application.",
        cautionFlag: false,
      },
    ],
    dataSource: "offline_deterministic_fallback",
    fetchedAt: new Date().toISOString(),
  };
}
