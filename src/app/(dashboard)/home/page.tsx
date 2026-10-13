"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import {
  getFarmerDashboardSummaryAction,
  getFarmsAction,
  getCropRecordsAction,
  toggleCropTaskAction,
} from "@/features/crops/actions";
import { getCurrentUserProfile } from "@/features/auth/actions";
import { FarmModal } from "@/features/crops/FarmModal";
import { FieldModal } from "@/features/crops/FieldModal";
import { CropModal } from "@/features/crops/CropModal";
import { TaskModal } from "@/features/crops/TaskModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sprout,
  Plus,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Layers,
  CheckSquare,
  Sparkles,
  MapPin,
  FolderPlus,
  CloudSun,
  Users,
  Store,
  FileText,
  GraduationCap,
} from "lucide-react";

export default function HomePage() {
  const { t } = useTranslation();

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
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const allFields = farms.flatMap((f) =>
    (f.farm_fields || []).map((field: any) => ({
      ...field,
      farmName: f.farm_name,
    }))
  );

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [userRes, summaryRes, farmsRes, cropsRes] = await Promise.all([
        getCurrentUserProfile(),
        getFarmerDashboardSummaryAction(),
        getFarmsAction(),
        getCropRecordsAction(),
      ]);

      if (userRes?.profile) {
        setProfile(userRes.profile);
      }
      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
      }
      if (farmsRes.success && farmsRes.data) {
        setFarms(farmsRes.data);
      }
      if (cropsRes.success && cropsRes.data) {
        setCropRecords(cropsRes.data);
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

  const quickNavItems = [
    {
      title: t("nav.crops"),
      desc: t("landing.cropsFeatureDesc"),
      href: "/crops",
      icon: Sprout,
      color: "text-krishi-deepGreen bg-emerald-50",
    },
    {
      title: t("nav.weather"),
      desc: t("landing.weatherFeatureDesc"),
      href: "/weather",
      icon: CloudSun,
      color: "text-amber-700 bg-amber-50",
    },
    {
      title: t("nav.community"),
      desc: t("landing.communityFeatureDesc"),
      href: "/community",
      icon: Users,
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      title: t("nav.marketplace"),
      desc: t("landing.marketFeatureDesc"),
      href: "/marketplace",
      icon: Store,
      color: "text-orange-700 bg-orange-50",
    },
    {
      title: t("nav.schemes"),
      desc: t("landing.schemesFeatureDesc"),
      href: "/schemes",
      icon: FileText,
      color: "text-blue-700 bg-blue-50",
    },
    {
      title: t("nav.experts"),
      desc: t("landing.expertsFeatureDesc"),
      href: "/experts",
      icon: GraduationCap,
      color: "text-purple-700 bg-purple-50",
    },
  ];

  const farmerName = profile?.full_name || "शेतकरी बांधव";
  const userDistrict = profile?.district || "महाराष्ट्र";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-krishi-deepGreen via-[#13492c] to-krishi-leafGreen/90 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white">
                🌱 {farmerName}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-krishi-leafGreen text-krishi-deepGreen">
                {userDistrict}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              नमस्कार, {farmerName}!
            </h1>
            <p className="text-xs sm:text-sm text-krishi-warmIvory/90 max-w-xl leading-relaxed">
              आपल्या शेतातील पिकांची सद्यस्थिती, जैविक वाढीचे टप्पे आणि आगामी शेती कामे एका दृष्टिक्षेपात पहा.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCropModalOpen(true)}
              className="bg-white text-krishi-deepGreen hover:bg-krishi-warmIvory font-bold shadow"
            >
              <Plus className="w-4 h-4 mr-1.5 text-krishi-deepGreen" />
              <span>{t("farming.addCrop")}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFarmModalOpen(true)}
              className="bg-white/10 text-white border-white/40 hover:bg-white/20"
            >
              <FolderPlus className="w-4 h-4 mr-1.5" />
              <span>{t("farming.addFarm")}</span>
            </Button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Farms */}
        <div className="bg-white rounded-2xl p-4 border border-krishi-lightGray/70 shadow-sm flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-krishi-warmIvory text-krishi-deepGreen flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-krishi-leafGreen" />
          </div>
          <div>
            <div className="text-xs text-krishi-gray font-medium">नोंदवलेली शेते</div>
            <div className="text-xl font-black text-krishi-deepGreen">{summary.farmsCount}</div>
          </div>
        </div>

        {/* Active Crops */}
        <div className="bg-white rounded-2xl p-4 border border-krishi-lightGray/70 shadow-sm flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-krishi-gray font-medium">सक्रिय पिके</div>
            <div className="text-xl font-black text-emerald-800">{summary.activeCropsCount}</div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl p-4 border border-krishi-lightGray/70 shadow-sm flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-krishi-gray font-medium">प्रलंबित कामे</div>
            <div className="text-xl font-black text-blue-900">{summary.pendingTasksCount}</div>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className={`bg-white rounded-2xl p-4 border shadow-sm flex items-center space-x-3.5 ${
          summary.overdueTasksCount > 0 ? "border-red-300 bg-red-50/20" : "border-krishi-lightGray/70"
        }`}>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            summary.overdueTasksCount > 0 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-krishi-gray font-medium">थकलेली कामे</div>
            <div className={`text-xl font-black ${
              summary.overdueTasksCount > 0 ? "text-red-600" : "text-krishi-charcoal"
            }`}>
              {summary.overdueTasksCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Crops & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent/Active Crops (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sprout className="w-5 h-5 text-krishi-leafGreen" />
              <h2 className="text-lg font-bold text-krishi-deepGreen">
                माझी पिके (Crop Records)
              </h2>
            </div>
            <Link
              href="/crops"
              className="text-xs font-bold text-krishi-deepGreen hover:underline flex items-center space-x-1"
            >
              <span>सर्व पिके पहा</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {summary.recentCrops.length === 0 ? (
            <div className="bg-white rounded-2xl border border-krishi-lightGray/60 p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-krishi-warmIvory flex items-center justify-center mx-auto text-krishi-deepGreen">
                <Sprout className="w-6 h-6 text-krishi-leafGreen" />
              </div>
              <h3 className="text-sm font-bold text-krishi-deepGreen">
                कोणतेही पीक नोंदवलेले नाही
              </h3>
              <p className="text-xs text-krishi-gray max-w-sm mx-auto">
                पिकांची वाढ आणि वेळेवर पाणी-खतांच्या सूचना मिळवण्यासाठी प्रथम पीक नोंदवा.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (allFields.length === 0) {
                    setIsFarmModalOpen(true);
                  } else {
                    setIsCropModalOpen(true);
                  }
                }}
              >
                {allFields.length === 0 ? "प्रथम शेत जोडा" : "पीक नोंदणी करा"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {summary.recentCrops.map((crop) => {
                const cropName =
                  crop.crop_guides?.crop_name_mr ||
                  crop.custom_crop_name ||
                  "पीक";
                const sowing = new Date(crop.sowing_date);
                const elapsedDays = Math.max(
                  0,
                  Math.floor((Date.now() - sowing.getTime()) / (1000 * 60 * 60 * 24))
                );

                return (
                  <div
                    key={crop.id}
                    className="p-4 rounded-2xl border border-krishi-lightGray/60 bg-white hover:border-krishi-leafGreen transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-krishi-leafGreen/20 text-krishi-deepGreen">
                          {crop.season}
                        </span>
                        <h4 className="font-bold text-sm text-krishi-deepGreen">
                          {cropName}
                        </h4>
                        <span className="text-xs text-krishi-gray">
                          ({crop.variety || "सामान्य वाण"})
                        </span>
                      </div>
                      <p className="text-xs text-krishi-gray mt-1 flex items-center space-x-2">
                        <span>{crop.farm_fields?.field_name || "शेत तुकडा"}</span>
                        <span>• पेरणी: {crop.sowing_date}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-xs font-bold text-krishi-deepGreen">
                          {elapsedDays} दिवस
                        </div>
                        <div className="text-[10px] text-krishi-gray">वाढ सुरू</div>
                      </div>
                      <Link
                        href="/crops"
                        className="px-3 py-1.5 rounded-xl bg-krishi-warmIvory text-krishi-deepGreen border border-krishi-leafGreen/30 text-xs font-semibold hover:bg-krishi-leafGreen/20 transition"
                      >
                        तपशील
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Care Tasks Checklist (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-krishi-leafGreen" />
              <h2 className="text-lg font-bold text-krishi-deepGreen">
                आगामी कामे (Care Tasks)
              </h2>
            </div>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              disabled={cropRecords.length === 0}
              className="text-xs font-bold text-krishi-deepGreen hover:underline disabled:opacity-50"
            >
              + काम जोडा
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-krishi-lightGray/60 p-4 shadow-sm space-y-3">
            {summary.upcomingTasks.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs text-krishi-charcoal font-semibold">
                  कोणतीही प्रलंबित कामे नाहीत!
                </p>
                <p className="text-[11px] text-krishi-gray">
                  सर्व शेती कामे वेळेवर पूर्ण झालेली आहेत.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {summary.upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl border border-krishi-lightGray/50 bg-krishi-warmIvory/30 flex items-start space-x-3 text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => handleToggleTask(task.id, task.is_completed)}
                      className="mt-0.5 w-4 h-4 rounded text-krishi-deepGreen focus:ring-krishi-deepGreen cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-krishi-charcoal truncate">
                        {task.title}
                      </div>
                      <div className="text-[11px] text-krishi-gray flex items-center justify-between mt-0.5">
                        <span className="truncate">
                          {task.crop_records?.crop_guides?.crop_name_mr || "पीक"}
                        </span>
                        <span className="font-medium text-krishi-deepGreen">
                          {task.due_date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <Link
                  href="/crops"
                  className="block text-center text-xs font-bold text-krishi-deepGreen pt-2 border-t border-krishi-lightGray/40 hover:underline"
                >
                  सर्व कामे पहा →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Quick Modules Shortcuts (Preserving Phase 1 & 2 integration) */}
      <div className="pt-2">
        <h2 className="text-base font-bold text-krishi-deepGreen mb-3">
          इतर सेवा व सुविधा (KrishiConnect Services)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-2xl p-3.5 border border-krishi-lightGray/60 hover:border-krishi-leafGreen hover:shadow-sm transition-all text-center flex flex-col items-center justify-center space-y-2 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-krishi-charcoal group-hover:text-krishi-deepGreen transition-colors">
                  {item.title}
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
    </div>
  );
}
