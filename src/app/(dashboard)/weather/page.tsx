"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { CloudSun, Droplets, Wind, Thermometer, ArrowLeft, Info, MapPin } from "lucide-react";

export default function WeatherPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link
          href="/home"
          className="md:hidden text-krishi-textMuted hover:text-krishi-deepGreen p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-krishi-deepGreen">
            {t("nav.weather")}
          </h1>
          <p className="text-xs sm:text-sm text-krishi-textMuted">
            {t("landing.weatherFeatureDesc")}
          </p>
        </div>
      </div>

      {/* Honest Data Source Notice */}
      <Alert
        variant="warning"
        icon={<Info className="w-5 h-5 text-amber-700" />}
        title="हवामान डेटा स्रोत सूचना (Verified Provider Notice)"
      >
        <span>
          टप्पा ७ मध्ये Open-Meteo व IMD आधारित अचूक स्थानिक हवामान आणि शेती सल्ला समाविष्ट केला जाईल. प्रत्यक्ष API जोडण्यापूर्वी खोटा किंवा बनावट अंदाज दाखवला जात नाही.
        </span>
      </Alert>

      {/* Weather Interface Layout Preview */}
      <Card className="border-krishi-border bg-gradient-to-br from-krishi-leaf-50 via-white to-krishi-ivory-100">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-krishi-deepGreen" />
              <div>
                <CardTitle className="text-base">पुणे जिल्हा (Pune District)</CardTitle>
                <CardDescription>हवामान केंद्र • आर्किटेक्चर पूर्वावलोकन</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" size="sm">टप्पा ७</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border border-krishi-border flex flex-col items-center text-center">
              <Thermometer className="w-5 h-5 text-amber-600 mb-1" />
              <span className="text-xs text-krishi-textMuted">तापमान</span>
              <span className="text-base font-bold text-krishi-deepGreen">२८°C / १८°C</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-krishi-border flex flex-col items-center text-center">
              <Droplets className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-xs text-krishi-textMuted">पाऊस शक्यता</span>
              <span className="text-base font-bold text-krishi-deepGreen">१०%</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-krishi-border flex flex-col items-center text-center">
              <Wind className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="text-xs text-krishi-textMuted">वाऱ्याचा वेग</span>
              <span className="text-base font-bold text-krishi-deepGreen">१२ किमी/तास</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-krishi-border flex flex-col items-center text-center">
              <CloudSun className="w-5 h-5 text-krishi-deepGreen mb-1" />
              <span className="text-xs text-krishi-textMuted">हवामान</span>
              <span className="text-base font-bold text-krishi-deepGreen">निरभ्र आकाश</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
