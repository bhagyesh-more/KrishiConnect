"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { getCurrentUserProfile } from "@/features/auth/actions";
import {
  getFarmerDashboardSummaryAction,
  getFarmsAction,
  getCropRecordsAction,
  toggleCropTaskAction,
} from "@/features/crops/actions";
import { getWeatherAction, WeatherDataResponse } from "@/features/weather/actions";
import { FarmModal } from "@/features/crops/FarmModal";
import { FieldModal } from "@/features/crops/FieldModal";
import { CropModal } from "@/features/crops/CropModal";
import { TaskModal } from "@/features/crops/TaskModal";
import { AiConsultationModal } from "@/features/ai/AiConsultationModal";
import { Button } from "@/components/ui/Button";
import {
  Sprout,
  Plus,
  CheckSquare,
  Sparkles,
  CloudSun,
  Layers,
  Clock,
  AlertTriangle,
  FolderPlus,
  ArrowRight,
  Store,
  Users,
  FileText,
  GraduationCap,
  BookOpen,
  MapPin,
  Wind,
  Droplets,
  ChevronRight,
  Bot,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useTranslation();

  const [profile, setProfile] = useState<any | null>(null);
  const [summary, setSummary] = useState({
    farmsCount: 0,
    activeCropsCount: 0,
    pendingTasksCount: 0,
    overdueTasksCount: 0,
    recentCrops: [] as any[],
    upcomingTasks: [] as any[],
  });
  const [farms, setFarms] = useState<any[]>([]);
  const [cropRecords, setCropRecords] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const allFields = farms.flatMap((f) =>
    (f.farm_fields || []).map((field: any) => ({
      ...field,
      farmName: f.farm_name,
    }))
  );

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [userRes, summaryRes, farmsRes, cropsRes, weatherRes] = await Promise.allSettled([
        getCurrentUserProfile(),
        getFarmerDashboardSummaryAction(),
        getFarmsAction(),
        getCropRecordsAction(),
        getWeatherAction("Pune"),
      ]);

      if (userRes.status === "fulfilled" && userRes.value?.profile) {
        setProfile(userRes.value.profile);
      }
      if (summaryRes.status === "fulfilled" && summaryRes.value?.success && summaryRes.value?.data) {
        setSummary(summaryRes.value.data);
      }
      if (farmsRes.status === "fulfilled" && farmsRes.value?.success && farmsRes.value?.data) {
        setFarms(farmsRes.value.data);
      }
      if (cropsRes.status === "fulfilled" && cropsRes.value?.success && cropsRes.value?.data) {
        setCropRecords(cropsRes.value.data);
      }
      if (weatherRes.status === "fulfilled" && weatherRes.value) {
        setWeatherData(weatherRes.value);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    try {
      setSummary((prev) => ({
        ...prev,
        upcomingTasks: prev.upcomingTasks.filter((t) => t.id !== taskId),
        pendingTasksCount: Math.max(0, prev.pendingTasksCount - 1),
      }));
      await toggleCropTaskAction(taskId, !currentCompleted);
    } catch {
      loadDashboardData();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.greetingMorning");
    if (hour < 17) return t("dashboard.greetingAfternoon");
    if (hour < 21) return t("dashboard.greetingEvening");
    return t("dashboard.greetingNight");
  };

  const quickNavItems = [
    {
      title: t("nav.marketplace"),
      desc: t("marketplace.allCategories"),
      href: "/marketplace",
      icon: Store,
      color: "text-orange-700 bg-orange-50",
    },
    {
      title: t("nav.community"),
      desc: t("community.title"),
      href: "/community",
      icon: Users,
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      title: t("nav.schemes"),
      desc: t("schemes.title"),
      href: "/schemes",
      icon: FileText,
      color: "text-blue-700 bg-blue-50",
    },
    {
      title: t("nav.experts"),
      desc: t("experts.title"),
      href: "/experts",
      icon: GraduationCap,
      color: "text-purple-700 bg-purple-50",
    },
    {
      title: t("nav.learning"),
      desc: t("learning.title"),
      href: "/learning",
      icon: BookOpen,
      color: "text-amber-800 bg-amber-50",
    },
  ];

  const farmerName = profile?.full_name || t("dashboard.farmerGreeting");
  const userDistrict = profile?.district || (weatherData ? (language === "en" ? weatherData.location.nameEn : weatherData.location.nameMr) : "Maharashtra");

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      {/* 1. Header & Greeting Card */}
      <div className="bg-gradient-to-br from-krishi-deepGreen via-[#144d2e] to-[#0e3b22] rounded-3xl p-4 sm:p-7 text-white shadow-card relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-white border border-white/20">
                <span className="w-2 h-2 rounded-full bg-krishi-leafGreen animate-ping" />
                🌱 {farmerName}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-krishi-leafGreen text-krishi-deepGreen">
                <MapPin className="w-3 h-3" />
                {userDistrict}
              </span>
            </div>

            <Link
              href="/profile"
              className="text-xs font-semibold text-krishi-warmIvory/90 hover:text-white underline-offset-2 hover:underline flex items-center gap-1"
            >
              <span>{t("nav.profile")}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-snug">
              {getGreeting()}, {farmerName}!
            </h1>
            <p className="text-xs sm:text-sm text-krishi-warmIvory/85 mt-1 max-w-xl leading-relaxed">
              {t("app.subTagline")}
            </p>
          </div>

          {/* Quick Action Touch Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 pt-1">
            <button
              onClick={() => {
                if (allFields.length === 0) {
                  setIsFarmModalOpen(true);
                } else {
                  setIsCropModalOpen(true);
                }
              }}
              className="min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-white text-krishi-deepGreen font-extrabold text-xs sm:text-sm shadow-subtle hover:bg-krishi-warmIvory transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-krishi-deepGreen shrink-0" />
              <span>{t("farming.addCrop")}</span>
            </button>

            <button
              onClick={() => setIsTaskModalOpen(true)}
              disabled={cropRecords.length === 0}
              className="min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-white/15 text-white font-extrabold text-xs sm:text-sm border border-white/30 hover:bg-white/25 transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CheckSquare className="w-4 h-4 shrink-0" />
              <span>{t("dashboard.addTaskAction")}</span>
            </button>

            <button
              onClick={() => setIsFarmModalOpen(true)}
              className="min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/25 hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <FolderPlus className="w-4 h-4 shrink-0" />
              <span>{t("dashboard.addFarmAction")}</span>
            </button>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="min-h-[44px] px-3.5 py-2.5 rounded-2xl bg-krishi-leafGreen text-krishi-deepGreen font-black text-xs sm:text-sm shadow-subtle hover:bg-[#99bd78] transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{t("dashboard.aiConsultAction")}</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* 2. Prominent AI Agronomist Entry Point Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-krishi-primary-50 to-krishi-ivory-100 rounded-3xl p-4 sm:p-5 border border-krishi-primary-200/80 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-krishi-deepGreen text-krishi-warmIvory flex items-center justify-center shrink-0 shadow-subtle">
            <Bot className="w-6 h-6 text-krishi-leafGreen" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-extrabold text-krishi-deepGreen truncate">
                {t("ai.title")}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-krishi-deepGreen text-white">
                {t("ai.verifiedBadge")}
              </span>
            </div>
            <p className="text-xs text-krishi-textMuted mt-0.5 leading-relaxed">
              {t("ai.subtitle")}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 bg-krishi-deepGreen hover:bg-krishi-primary-600 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-subtle flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-krishi-leafGreen" />
          <span>{t("ai.askButton")}</span>
        </button>
      </div>

      {/* 3. Weather & Agro-Meteorological Advisory Widget */}
      {weatherData && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-krishi-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <CloudSun className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-krishi-deepGreen">
                  {t("weather.title")} • {language === "en" ? weatherData.location.nameEn : weatherData.location.nameMr}
                </h3>
                <p className="text-[10px] text-krishi-textMuted">
                  {language === "en" ? weatherData.current.conditionLabelEn : (language === "hi" ? weatherData.current.conditionLabelHi : weatherData.current.conditionLabelMr)}
                </p>
              </div>
            </div>

            <Link
              href="/weather"
              className="text-xs font-bold text-krishi-deepGreen hover:underline flex items-center gap-1 min-h-[44px]"
            >
              <span>{t("dashboard.viewFullForecast")}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-krishi-ivory-50/80 rounded-2xl p-3 border border-krishi-border/60 text-center">
            <div className="flex flex-col items-center justify-center">
              <span className="text-[11px] text-krishi-textMuted font-medium">{t("weather.currentConditions")}</span>
              <span className="text-base sm:text-xl font-black text-krishi-deepGreen mt-0.5">
                {Math.round(weatherData.current.temperatureC)}°C
              </span>
            </div>

            <div className="flex flex-col items-center justify-center border-x border-krishi-border/80">
              <span className="text-[11px] text-krishi-textMuted font-medium flex items-center gap-0.5">
                <Droplets className="w-3 h-3 text-blue-600" /> %
              </span>
              <span className="text-base sm:text-xl font-black text-blue-900 mt-0.5">
                {weatherData.current.relativeHumidity}%
              </span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <span className="text-[11px] text-krishi-textMuted font-medium flex items-center gap-0.5">
                <Wind className="w-3 h-3 text-emerald-600" /> km/h
              </span>
              <span className="text-base sm:text-xl font-black text-emerald-900 mt-0.5">
                {Math.round(weatherData.current.windSpeedKmh)}
              </span>
            </div>
          </div>

          {/* Top Agro Advisory Banner if present */}
          {weatherData.advisories && weatherData.advisories.length > 0 && (
            <div className="p-2.5 bg-krishi-primary-50 border border-krishi-primary-200/80 rounded-xl text-xs flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-krishi-deepGreen text-white shrink-0">
                {t("ai.verifiedBadge")}
              </span>
              <p className="text-krishi-textMain truncate font-medium">
                {language === "en" ? weatherData.advisories[0].advisoryTextEn : (language === "hi" ? weatherData.advisories[0].advisoryTextHi : weatherData.advisories[0].advisoryTextMr)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Farms */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-krishi-border shadow-subtle flex items-center space-x-3 min-h-[64px]">
          <div className="w-10 h-10 rounded-xl bg-krishi-warmIvory text-krishi-deepGreen flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-krishi-leafGreen" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-krishi-textMuted font-semibold truncate">{t("dashboard.farmsMetric")}</div>
            <div className="text-lg sm:text-xl font-black text-krishi-deepGreen">{summary.farmsCount}</div>
          </div>
        </div>

        {/* Active Crops */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-krishi-border shadow-subtle flex items-center space-x-3 min-h-[64px]">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-krishi-textMuted font-semibold truncate">{t("dashboard.activeCropsMetric")}</div>
            <div className="text-lg sm:text-xl font-black text-emerald-800">{summary.activeCropsCount}</div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-krishi-border shadow-subtle flex items-center space-x-3 min-h-[64px]">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-krishi-textMuted font-semibold truncate">{t("dashboard.pendingTasksMetric")}</div>
            <div className="text-lg sm:text-xl font-black text-blue-900">{summary.pendingTasksCount}</div>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className={`bg-white rounded-2xl p-3 sm:p-4 border shadow-subtle flex items-center space-x-3 min-h-[64px] ${
          summary.overdueTasksCount > 0 ? "border-red-300 bg-red-50/30" : "border-krishi-border"
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            summary.overdueTasksCount > 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-krishi-textMuted font-semibold truncate">{t("dashboard.overdueTasksMetric")}</div>
            <div className={`text-lg sm:text-xl font-black ${
              summary.overdueTasksCount > 0 ? "text-red-600" : "text-krishi-textMain"
            }`}>
              {summary.overdueTasksCount}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Main Content: Active Crops & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column: Recent/Active Crops (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sprout className="w-5 h-5 text-krishi-deepGreen" />
              <h2 className="text-base sm:text-lg font-bold text-krishi-deepGreen">
                {t("dashboard.recentCropsTitle")}
              </h2>
            </div>
            <Link
              href="/crops"
              className="text-xs font-bold text-krishi-deepGreen hover:underline flex items-center space-x-1 min-h-[44px]"
            >
              <span>{t("dashboard.viewAllCrops")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {summary.recentCrops.length === 0 ? (
            <div className="bg-white rounded-3xl border border-krishi-border p-6 text-center space-y-3 shadow-subtle">
              <div className="w-12 h-12 rounded-2xl bg-krishi-warmIvory flex items-center justify-center mx-auto text-krishi-deepGreen">
                <Sprout className="w-6 h-6 text-krishi-leafGreen" />
              </div>
              <h3 className="text-sm font-bold text-krishi-deepGreen">
                {t("farming.noCrops")}
              </h3>
              <p className="text-xs text-krishi-textMuted max-w-sm mx-auto leading-relaxed">
                {t("landing.cropsFeatureDesc")}
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (allFields.length === 0) {
                    setIsFarmModalOpen(true);
                  } else {
                    setIsCropModalOpen(true);
                  }
                }}
                className="min-h-[44px] rounded-xl font-bold"
              >
                {allFields.length === 0 ? t("farming.firstFarmAction") : t("farming.firstCropAction")}
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {summary.recentCrops.map((crop) => {
                const cropName =
                  (language === "en" ? crop.crop_guides?.crop_name_en : (language === "hi" ? crop.crop_guides?.crop_name_hi : crop.crop_guides?.crop_name_mr)) ||
                  crop.custom_crop_name ||
                  t("farming.crops");
                const sowing = new Date(crop.sowing_date);
                const elapsedDays = Math.max(
                  0,
                  Math.floor((Date.now() - sowing.getTime()) / (1000 * 60 * 60 * 24))
                );

                return (
                  <div
                    key={crop.id}
                    className="p-3.5 sm:p-4 rounded-2xl border border-krishi-border bg-white hover:border-krishi-leafGreen transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-krishi-leafGreen/20 text-krishi-deepGreen">
                          {crop.season}
                        </span>
                        <h4 className="font-bold text-sm text-krishi-deepGreen">
                          {cropName}
                        </h4>
                        <span className="text-xs text-krishi-textMuted">
                          ({crop.variety || "सामान्य वाण"})
                        </span>
                      </div>
                      <p className="text-xs text-krishi-textMuted mt-1 flex items-center space-x-2">
                        <span>{crop.farm_fields?.field_name || t("farming.fields")}</span>
                        <span>• {t("farming.sownOn")}: {crop.sowing_date}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-krishi-border/60">
                      <div className="text-left sm:text-right">
                        <div className="text-xs font-bold text-krishi-deepGreen">
                          {elapsedDays} {t("dashboard.daysUnit")}
                        </div>
                        <div className="text-[10px] text-krishi-textMuted">{t("farming.growthStage")}</div>
                      </div>
                      <Link
                        href="/crops"
                        className="min-h-[44px] px-3.5 py-2 rounded-xl bg-krishi-ivory-100 text-krishi-deepGreen border border-krishi-border text-xs font-bold hover:bg-krishi-primary-50 transition flex items-center justify-center"
                      >
                        {t("common.viewDetails")}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Care Tasks Checklist (1 col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-krishi-deepGreen" />
              <h2 className="text-base sm:text-lg font-bold text-krishi-deepGreen">
                {t("dashboard.upcomingTasksTitle")}
              </h2>
            </div>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              disabled={cropRecords.length === 0}
              className="text-xs font-bold text-krishi-deepGreen hover:underline disabled:opacity-50 min-h-[44px] flex items-center"
            >
              {t("dashboard.addTaskAction")}
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-krishi-border p-3.5 sm:p-4 shadow-subtle space-y-3">
            {summary.upcomingTasks.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs text-krishi-textMain font-bold">
                  {t("farming.noTasks")}
                </p>
                <p className="text-[11px] text-krishi-textMuted">
                  {t("landing.cropsFeatureDesc")}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {summary.upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-2xl border border-krishi-border/80 bg-krishi-ivory-50/50 flex items-start space-x-3 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => handleToggleTask(task.id, task.is_completed)}
                      className="mt-0.5 w-5 h-5 rounded-lg text-krishi-deepGreen focus:ring-krishi-deepGreen cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-krishi-textMain truncate">
                        {task.title}
                      </div>
                      <div className="text-[11px] text-krishi-textMuted flex items-center justify-between mt-1">
                        <span className="truncate">
                          {(language === "en" ? task.crop_records?.crop_guides?.crop_name_en : (language === "hi" ? task.crop_records?.crop_guides?.crop_name_hi : task.crop_records?.crop_guides?.crop_name_mr)) || task.crop_records?.custom_crop_name || t("farming.crops")}
                        </span>
                        <span className="font-semibold text-krishi-deepGreen shrink-0 pl-1">
                          {task.due_date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <Link
                  href="/crops"
                  className="block text-center text-xs font-bold text-krishi-deepGreen pt-2 border-t border-krishi-border/80 hover:underline min-h-[44px] flex items-center justify-center"
                >
                  {t("dashboard.viewAllTasks")} →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Farmer Services Grid (Marketplace, Community, Schemes, Experts, Learning) */}
      <div className="pt-2">
        <h2 className="text-sm sm:text-base font-extrabold text-krishi-deepGreen mb-3">
          {t("dashboard.essentialServicesTitle")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {quickNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-2xl p-3.5 border border-krishi-border shadow-subtle hover:border-krishi-deepGreen hover:shadow-card transition-all flex flex-col items-center justify-center space-y-1.5 text-center group active:scale-95 min-h-[90px]"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-xs text-krishi-textMain group-hover:text-krishi-deepGreen transition-colors truncate max-w-full">
                  {item.title}
                </div>
                <div className="text-[10px] text-krishi-textMuted leading-none truncate max-w-full">
                  {item.desc}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <FarmModal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
        onSuccess={loadDashboardData}
      />

      <FieldModal
        isOpen={isFieldModalOpen}
        farms={farms}
        onClose={() => setIsFieldModalOpen(false)}
        onSuccess={loadDashboardData}
      />

      <CropModal
        isOpen={isCropModalOpen}
        fields={allFields}
        onClose={() => setIsCropModalOpen(false)}
        onSuccess={loadDashboardData}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        cropRecords={cropRecords}
        onClose={() => setIsTaskModalOpen(false)}
        onSuccess={loadDashboardData}
      />

      <AiConsultationModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        defaultDistrict={userDistrict}
      />
    </div>
  );
}
