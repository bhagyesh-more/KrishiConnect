import { WeatherLocation } from "./types";

export const MAHARASHTRA_WEATHER_LOCATIONS: Record<string, WeatherLocation> = {
  Pune: {
    districtKey: "Pune",
    nameMr: "पुणे",
    nameHi: "पुणे",
    nameEn: "Pune",
    latitude: 18.5204,
    longitude: 73.8567,
    region: "western_maharashtra",
  },
  Nashik: {
    districtKey: "Nashik",
    nameMr: "नाशिक",
    nameHi: "नासिक",
    nameEn: "Nashik",
    latitude: 19.9975,
    longitude: 73.7898,
    region: "north_maharashtra",
  },
  Ahmednagar: {
    districtKey: "Ahmednagar",
    nameMr: "अहिल्यानगर (अहमदनगर)",
    nameHi: "अहमदनगर",
    nameEn: "Ahmednagar",
    latitude: 19.0952,
    longitude: 74.7496,
    region: "western_maharashtra",
  },
  Solapur: {
    districtKey: "Solapur",
    nameMr: "सोलापूर",
    nameHi: "सोलापुर",
    nameEn: "Solapur",
    latitude: 17.6599,
    longitude: 75.9064,
    region: "western_maharashtra",
  },
  Kolhapur: {
    districtKey: "Kolhapur",
    nameMr: "कोल्हापूर",
    nameHi: "कोल्हापुर",
    nameEn: "Kolhapur",
    latitude: 16.705,
    longitude: 74.2433,
    region: "western_maharashtra",
  },
  Satara: {
    districtKey: "Satara",
    nameMr: "सातारा",
    nameHi: "सातारा",
    nameEn: "Satara",
    latitude: 17.6805,
    longitude: 73.993,
    region: "western_maharashtra",
  },
  Sangli: {
    districtKey: "Sangli",
    nameMr: "सांगली",
    nameHi: "सांगली",
    nameEn: "Sangli",
    latitude: 16.8524,
    longitude: 74.5815,
    region: "western_maharashtra",
  },
  ChhatrapatiSambhajinagar: {
    districtKey: "ChhatrapatiSambhajinagar",
    nameMr: "छत्रपती संभाजीनगर",
    nameHi: "छत्रपति संभाजीनगर",
    nameEn: "Chhatrapati Sambhajinagar",
    latitude: 19.8762,
    longitude: 75.3433,
    region: "marathwada",
  },
  Latur: {
    districtKey: "Latur",
    nameMr: "लातूर",
    nameHi: "लातूर",
    nameEn: "Latur",
    latitude: 18.4088,
    longitude: 76.5604,
    region: "marathwada",
  },
  Nagpur: {
    districtKey: "Nagpur",
    nameMr: "नागपूर",
    nameHi: "नागपुर",
    nameEn: "Nagpur",
    latitude: 21.1458,
    longitude: 79.0882,
    region: "vidarbha",
  },
  Amravati: {
    districtKey: "Amravati",
    nameMr: "अमरावती",
    nameHi: "अमरावती",
    nameEn: "Amravati",
    latitude: 20.9374,
    longitude: 77.7796,
    region: "vidarbha",
  },
  Jalgaon: {
    districtKey: "Jalgaon",
    nameMr: "जळगाव",
    nameHi: "जलगांव",
    nameEn: "Jalgaon",
    latitude: 21.0077,
    longitude: 75.5626,
    region: "north_maharashtra",
  },
};

export function interpretWmoCode(code: number): {
  labelMr: string;
  labelHi: string;
  labelEn: string;
  icon: "sunny" | "partly_cloudy" | "cloudy" | "rainy" | "stormy";
} {
  switch (code) {
    case 0:
      return { labelMr: "निरभ्र आकाश (स्वच्छ ऊन)", labelHi: "साफ आसमान (धूप)", labelEn: "Clear Sky", icon: "sunny" };
    case 1:
    case 2:
      return { labelMr: "अंशतः ढगाळ", labelHi: "आंशिक रूप से बादल", labelEn: "Partly Cloudy", icon: "partly_cloudy" };
    case 3:
      return { labelMr: "पूर्ण ढगाळ वातावरण", labelHi: "घने बादल", labelEn: "Overcast", icon: "cloudy" };
    case 45:
    case 48:
      return { labelMr: "धुक्याची चादर", labelHi: "कोहरा", labelEn: "Fog", icon: "cloudy" };
    case 51:
    case 53:
    case 55:
      return { labelMr: "हलकी रिमझिम", labelHi: "हल्की बूंदाबांदी", labelEn: "Light Drizzle", icon: "rainy" };
    case 61:
    case 63:
      return { labelMr: "मध्यम पाऊस", labelHi: "मध्यम बारिश", labelEn: "Moderate Rain", icon: "rainy" };
    case 65:
      return { labelMr: "मुसळधार पाऊस", labelHi: "भारी बारिश", labelEn: "Heavy Rain", icon: "rainy" };
    case 80:
    case 81:
    case 82:
      return { labelMr: "पावसाची जोरदार सर", labelHi: "तेज बारिश की बौछार", labelEn: "Rain Showers", icon: "rainy" };
    case 95:
    case 96:
    case 99:
      return { labelMr: "विजांच्या कडकडाटासह वादळी पाऊस", labelHi: "बिजली कड़कने के साथ आंधी", labelEn: "Thunderstorm", icon: "stormy" };
    default:
      return { labelMr: "सामान्य हवामान", labelHi: "सामान्य मौसम", labelEn: "Normal Weather", icon: "partly_cloudy" };
  }
}
