"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import {
  getFarmsAction,
  getCropRecordsAction,
  getCropTasksAction,
  getCropGuidesAction,
  toggleCropTaskAction,
} from "@/features/crops/actions";
import { DEFAULT_CROP_GUIDES, CropGuideItem } from "@/features/crops/agronomy";
import { FarmModal } from "@/features/crops/FarmModal";
import { FieldModal } from "@/features/crops/FieldModal";
import { CropModal } from "@/features/crops/CropModal";
import { TaskModal } from "@/features/crops/TaskModal";
import { CropTimeline } from "@/features/crops/CropTimeline";
import { CropGuideDrawer } from "@/features/crops/CropGuideDrawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import {
  Sprout,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  BookOpen,
  CheckSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FolderPlus,
  ArrowRight,
  Droplets,
  Bug,
  FlaskConical,
  Scissors,
  Eye,
  Sparkles,
} from "lucide-react";

export default function CropsPage() {
  const { t } = useTranslation();

  // Active Tab: "crops" | "farms" | "tasks" | "guides"
  const [activeTab, setActiveTab] = useState<"crops" | "farms" | "tasks" | "guides">("crops");

  // Data states
  const [farms, setFarms] = useState<any[]>([]);
  const [cropRecords, setCropRecords] = useState<any[]>([]);
  const [cropTasks, setCropTasks] = useState<any[]>([]);
  const [cropGuides, setCropGuides] = useState<CropGuideItem[]>(DEFAULT_CROP_GUIDES);
  const [isLoading, setIsLoading] = useState(true);

  // Selected crop record for detailed timeline
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);

  // Modals
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [selectedFarmForField, setSelectedFarmForField] = useState<any | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalCropId, setTaskModalCropId] = useState<string | undefined>(undefined);
  const [selectedGuideForDrawer, setSelectedGuideForDrawer] = useState<CropGuideItem | null>(null);

  // Flattened fields for dropdowns
  const allFields = farms.flatMap((f) =>
    (f.farm_fields || []).map((field: any) => ({
      ...field,
      farmName: f.farm_name,
    }))
  );

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [farmsRes, cropsRes, tasksRes, guidesRes] = await Promise.all([
        getFarmsAction(),
        getCropRecordsAction(),
        getCropTasksAction(),
        getCropGuidesAction(),
      ]);

      if (farmsRes.success && farmsRes.data) {
        setFarms(farmsRes.data);
      }
      if (cropsRes.success && cropsRes.data) {
        setCropRecords(cropsRes.data);
        if (cropsRes.data.length > 0 && !selectedCropId) {
          setSelectedCropId(cropsRes.data[0].id);
        }
      }
      if (tasksRes.success && tasksRes.data) {
        setCropTasks(tasksRes.data);
      }
      if (guidesRes.success && guidesRes.data) {
        setCropGuides(guidesRes.data);
      }
    } catch (err) {
      console.error("Failed to load crops data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCropId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    try {
      // Optimistic update
      setCropTasks((prev) =>
        prev.map((tk) => (tk.id === taskId ? { ...tk, is_completed: !currentCompleted } : tk))
      );
      await toggleCropTaskAction(taskId, !currentCompleted);
    } catch {
      loadData();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "irrigation":
        return <Droplets className="w-4 h-4 text-blue-600" />;
      case "fertilizer":
        return <FlaskConical className="w-4 h-4 text-amber-600" />;
      case "pesticide":
        return <Bug className="w-4 h-4 text-red-600" />;
      case "weeding":
        return <Scissors className="w-4 h-4 text-emerald-600" />;
      case "harvest":
        return <Sparkles className="w-4 h-4 text-orange-600" />;
      case "scouting":
      default:
        return <Eye className="w-4 h-4 text-purple-600" />;
    }
  };

  const activeCrops = cropRecords.filter((c) => c.status !== "completed" && c.status !== "abandoned");
  const overdueTasks = cropTasks.filter(
    (t) => !t.is_completed && new Date(t.due_date) < new Date(new Date().setHours(0, 0, 0, 0))
  );
  const pendingTasks = cropTasks.filter(
    (t) => !t.is_completed && new Date(t.due_date) >= new Date(new Date().setHours(0, 0, 0, 0))
  );
  const completedTasks = cropTasks.filter((t) => t.is_completed);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-krishi-deepGreen flex items-center gap-2">
            <Sprout className="w-7 h-7 text-krishi-leafGreen" />
            <span>पीक व्यवस्थापन व मार्गदर्शिका (Crop Hub)</span>
          </h1>
          <p className="text-xs sm:text-sm text-krishi-textMuted mt-1">
            शेते, पिके, जैविक वाढीचे टप्पे आणि शेती कामांचे एकात्मिक व्यवस्थापन
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFarmModalOpen(true)}
            className="border-krishi-deepGreen text-krishi-deepGreen"
          >
            <FolderPlus className="w-4 h-4 mr-1 text-krishi-leafGreen" />
            <span>शेत जोडा</span>
          </Button>

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
            <Plus className="w-4 h-4 mr-1" />
            <span>नवीन पीक जोडा</span>
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-krishi-lightGray/60 space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("crops")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "crops"
              ? "border-krishi-deepGreen text-krishi-deepGreen bg-krishi-warmIvory/60"
              : "border-transparent text-krishi-gray hover:text-krishi-charcoal"
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>माझी पिके ({cropRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("farms")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "farms"
              ? "border-krishi-deepGreen text-krishi-deepGreen bg-krishi-warmIvory/60"
              : "border-transparent text-krishi-gray hover:text-krishi-charcoal"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>शेते व तुकडे ({farms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("tasks")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "tasks"
              ? "border-krishi-deepGreen text-krishi-deepGreen bg-krishi-warmIvory/60"
              : "border-transparent text-krishi-gray hover:text-krishi-charcoal"
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>पीक कामे ({overdueTasks.length + pendingTasks.length})</span>
          {overdueTasks.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("guides")}
          className={`py-3 px-4 font-bold text-xs sm:text-sm flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "guides"
              ? "border-krishi-deepGreen text-krishi-deepGreen bg-krishi-warmIvory/60"
              : "border-transparent text-krishi-gray hover:text-krishi-charcoal"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>पीक मार्गदर्शिका (Guides)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CROPS LIST & TIMELINE */}
      {/* ========================================================================= */}
      {activeTab === "crops" && (
        <div className="space-y-6">
          {cropRecords.length === 0 ? (
            <div className="bg-white rounded-2xl border border-krishi-lightGray/60 p-8 text-center space-y-4 max-w-lg mx-auto my-6 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-krishi-warmIvory flex items-center justify-center mx-auto text-krishi-deepGreen">
                <Sprout className="w-8 h-8 text-krishi-leafGreen" />
              </div>
              <div>
                <h3 className="text-base font-bold text-krishi-deepGreen">
                  अद्याप कोणतेही पीक नोंदवलेले नाही
                </h3>
                <p className="text-xs text-krishi-gray mt-1">
                  शेताचा तुकडा निवडून सोयाबीन, कापूस, कांदा किंवा ऊस पिकाची नोंदणी करा आणि
                  जैविक वाढ टप्प्यांचा लाभ घ्या.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  if (allFields.length === 0) {
                    setIsFarmModalOpen(true);
                  } else {
                    setIsCropModalOpen(true);
                  }
                }}
              >
                {allFields.length === 0 ? "प्रथम शेत नोंदवा" : "पीक नोंदणी करा"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Crop Cards Carousel / Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cropRecords.map((crop) => {
                  const isSelected = selectedCropId === crop.id;
                  const cropName =
                    crop.crop_guides?.crop_name_mr ||
                    crop.custom_crop_name ||
                    "पीक";
                  const guide =
                    cropGuides.find((g) => g.id === crop.guide_id) ||
                    DEFAULT_CROP_GUIDES.find((g) => g.crop_name_mr === cropName);

                  return (
                    <div
                      key={crop.id}
                      onClick={() => setSelectedCropId(crop.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-krishi-deepGreen bg-krishi-warmIvory/60 shadow-md ring-2 ring-krishi-deepGreen/30"
                          : "border-krishi-lightGray/70 bg-white hover:border-krishi-leafGreen"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-krishi-leafGreen/20 text-krishi-deepGreen">
                            {crop.season}
                          </span>
                          <h3 className="text-base font-bold text-krishi-deepGreen mt-1">
                            {cropName}
                          </h3>
                          <p className="text-xs text-krishi-gray">
                            {crop.variety ? `वाण: ${crop.variety}` : "स्थानिक वाण"}
                          </p>
                        </div>
                        <Badge
                          variant={crop.status === "completed" ? "neutral" : "primary"}
                          size="sm"
                        >
                          {crop.status}
                        </Badge>
                      </div>

                      <div className="mt-3 pt-3 border-t border-krishi-lightGray/40 text-xs text-krishi-charcoal space-y-1">
                        <div className="flex items-center text-krishi-gray">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-krishi-leafGreen shrink-0" />
                          <span className="truncate">
                            {crop.farm_fields?.field_name || "शेत तुकडा"} (
                            {crop.farm_fields?.area_acres || 0} एकर)
                          </span>
                        </div>
                        <div className="flex items-center text-krishi-gray">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-krishi-leafGreen shrink-0" />
                          <span>पेरणी: {crop.sowing_date}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs pt-2">
                        <span className="text-[11px] font-semibold text-krishi-deepGreen">
                          {isSelected ? "निवडलेले पीक ✓" : "तपशील पाहण्यासाठी क्लिक करा"}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTaskModalCropId(crop.id);
                            setIsTaskModalOpen(true);
                          }}
                          className="px-2 py-1 rounded-lg bg-krishi-deepGreen text-white text-[11px] hover:bg-krishi-deepGreen/90"
                        >
                          + काम जोडा
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Crop Biological Growth Timeline */}
              {selectedCropId && (
                <div>
                  {(() => {
                    const selectedRecord = cropRecords.find((c) => c.id === selectedCropId);
                    if (!selectedRecord) return null;
                    const cropName =
                      selectedRecord.crop_guides?.crop_name_mr ||
                      selectedRecord.custom_crop_name ||
                      "पीक";
                    const guide =
                      cropGuides.find((g) => g.id === selectedRecord.guide_id) ||
                      DEFAULT_CROP_GUIDES.find((g) => g.crop_name_mr === cropName) ||
                      DEFAULT_CROP_GUIDES[0];

                    return (
                      <CropTimeline
                        cropRecord={selectedRecord}
                        cropGuide={guide}
                        onStatusUpdated={loadData}
                      />
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FARMS & FIELDS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === "farms" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-krishi-deepGreen">
              नोंदवलेली शेते व तुकडे (Farms & Fields)
            </h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsFarmModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>नवीन शेत जोडा</span>
            </Button>
          </div>

          {farms.length === 0 ? (
            <div className="bg-white rounded-2xl border border-krishi-lightGray/60 p-8 text-center space-y-4 max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-krishi-warmIvory flex items-center justify-center mx-auto text-krishi-deepGreen">
                <Layers className="w-8 h-8 text-krishi-leafGreen" />
              </div>
              <h3 className="text-base font-bold text-krishi-deepGreen">
                कोणतेही शेत नोंदवलेले नाही
              </h3>
              <p className="text-xs text-krishi-gray">
                तुमच्या शेताचे नाव, जिल्हा, एकूण क्षेत्रफळ आणि जलस्त्रोत नोंदवून सुरुवात करा.
              </p>
              <Button variant="primary" onClick={() => setIsFarmModalOpen(true)}>
                पहिले शेत जोडा
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {farms.map((farm) => {
                const fields = farm.farm_fields || [];
                return (
                  <div
                    key={farm.id}
                    className="bg-white rounded-2xl border border-krishi-lightGray/70 p-5 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-krishi-deepGreen">
                            {farm.farm_name}
                          </h3>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-krishi-leafGreen/20 text-krishi-deepGreen">
                            {farm.total_area_acres} एकर
                          </span>
                        </div>
                        <p className="text-xs text-krishi-gray flex items-center mt-1">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-krishi-leafGreen" />
                          {farm.location_taluka ? `${farm.location_taluka}, ` : ""}
                          {farm.location_district}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFarmForField(farm);
                          setIsFieldModalOpen(true);
                        }}
                        className="text-xs py-1 h-auto"
                      >
                        + तुकडा जोडा
                      </Button>
                    </div>

                    {/* Farm Attributes */}
                    <div className="flex flex-wrap gap-2 text-xs text-krishi-charcoal">
                      {farm.soil_type && (
                        <span className="bg-krishi-warmIvory px-2.5 py-1 rounded-lg border border-krishi-lightGray/50">
                          माती: {farm.soil_type}
                        </span>
                      )}
                      {farm.irrigation_source && farm.irrigation_source.length > 0 && (
                        <span className="bg-krishi-warmIvory px-2.5 py-1 rounded-lg border border-krishi-lightGray/50">
                          पाणी: {farm.irrigation_source.join(", ")}
                        </span>
                      )}
                    </div>

                    {/* Fields List inside Farm */}
                    <div className="pt-2 border-t border-krishi-lightGray/40">
                      <h4 className="text-xs font-bold text-krishi-deepGreen mb-2">
                        शेताचे तुकडे ({fields.length}):
                      </h4>
                      {fields.length === 0 ? (
                        <p className="text-xs text-krishi-gray italic">
                          अद्याप तुकडा जोडलेला नाही. पिके लावण्यासाठी तुकडा जोडा.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {fields.map((f: any) => (
                            <div
                              key={f.id}
                              className="p-2.5 rounded-xl bg-krishi-warmIvory/40 border border-krishi-lightGray/40 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-semibold text-krishi-charcoal">
                                  {f.field_name}
                                </span>
                                <span className="text-krishi-gray ml-2">
                                  ({f.area_acres} एकर)
                                </span>
                              </div>
                              <div className="text-[11px] text-krishi-gray">
                                {f.soil_type || "मध्यम जमीन"} • {f.irrigation_type || "ठिबक"}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CROP TASKS */}
      {/* ========================================================================= */}
      {activeTab === "tasks" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-krishi-deepGreen">
                शेती कामे आणि आठवणी (Care Tasks)
              </h2>
              <p className="text-xs text-krishi-gray">
                वेळेवर खते, पाणी, व फवारणी व्यवस्थापनासाठी कामे नोंदवा
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              disabled={cropRecords.length === 0}
              onClick={() => {
                setTaskModalCropId(cropRecords[0]?.id);
                setIsTaskModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>नवीन काम जोडा</span>
            </Button>
          </div>

          {cropTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-krishi-lightGray/60 p-8 text-center space-y-4 max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-krishi-warmIvory flex items-center justify-center mx-auto text-krishi-deepGreen">
                <CheckSquare className="w-8 h-8 text-krishi-leafGreen" />
              </div>
              <h3 className="text-base font-bold text-krishi-deepGreen">
                कोणतेही प्रलंबित काम नाही
              </h3>
              <p className="text-xs text-krishi-gray">
                पिकांची निगा राखण्यासाठी खत, फवारणी किंवा सिंचनाचे कार्य नोंदवा.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Overdue Tasks */}
              {overdueTasks.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>मुदत उलटून गेलेली कामे ({overdueTasks.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {overdueTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-xl border border-red-200 bg-red-50/50 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={t.is_completed}
                            onChange={() => handleToggleTask(t.id, t.is_completed)}
                            className="mt-1 w-4 h-4 rounded text-krishi-deepGreen focus:ring-krishi-deepGreen cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(t.category)}
                              <span className="font-bold text-xs text-red-950">{t.title}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-200 text-red-800 font-semibold uppercase">
                                {t.priority}
                              </span>
                            </div>
                            <p className="text-[11px] text-red-800/80 mt-0.5">
                              {t.crop_records?.crop_guides?.crop_name_mr || "पीक"} • मुदत: {t.due_date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Tasks */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-krishi-deepGreen uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-krishi-leafGreen" />
                  <span>आगामी नियोजित कामे ({pendingTasks.length})</span>
                </h3>
                {pendingTasks.length === 0 ? (
                  <p className="text-xs text-krishi-gray italic p-3 bg-white rounded-xl border border-krishi-lightGray/40">
                    कोणतेही प्रलंबित काम नाही. सर्व कामे वेळेवर पूर्ण आहेत!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pendingTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-xl border border-krishi-lightGray/60 bg-white flex items-center justify-between gap-3"
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={t.is_completed}
                            onChange={() => handleToggleTask(t.id, t.is_completed)}
                            className="mt-1 w-4 h-4 rounded text-krishi-deepGreen focus:ring-krishi-deepGreen cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(t.category)}
                              <span className="font-bold text-xs text-krishi-charcoal">{t.title}</span>
                              {t.priority === "urgent" && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                                  तातडीचे
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-krishi-gray mt-0.5">
                              {t.crop_records?.crop_guides?.crop_name_mr || "पीक"} • दिनांक: {t.due_date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-krishi-gray uppercase tracking-wider flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>पूर्ण झालेली कामे ({completedTasks.length})</span>
                  </h3>
                  <div className="space-y-2 opacity-70">
                    {completedTasks.slice(0, 5).map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl border border-krishi-lightGray/40 bg-gray-50 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-start space-x-3 line-through text-krishi-gray">
                          <input
                            type="checkbox"
                            checked={t.is_completed}
                            onChange={() => handleToggleTask(t.id, t.is_completed)}
                            className="mt-1 w-4 h-4 rounded text-krishi-deepGreen"
                          />
                          <span className="text-xs">{t.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CROP GUIDES */}
      {/* ========================================================================= */}
      {activeTab === "guides" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-krishi-deepGreen">
                महाराष्ट्र प्रमाणित पीक मार्गदर्शिका (Crop Guides)
              </h2>
              <p className="text-xs text-krishi-gray">
                ICAR व कृषी विद्यापीठ शिफारशींवर आधारित जमिनीची निवड, खते व पाणी व्यवस्थापन
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cropGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-2xl border border-krishi-lightGray/70 p-5 shadow-sm space-y-4 hover:border-krishi-leafGreen transition cursor-pointer flex flex-col justify-between"
                onClick={() => setSelectedGuideForDrawer(guide)}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-krishi-leafGreen/20 text-krishi-deepGreen">
                        {guide.ideal_season}
                      </span>
                      <h3 className="text-base font-bold text-krishi-deepGreen mt-1">
                        {guide.crop_name_mr} ({guide.crop_name_en})
                      </h3>
                      <p className="text-xs text-krishi-gray font-medium">{guide.variety}</p>
                    </div>
                    <BookOpen className="w-5 h-5 text-krishi-deepGreen/70" />
                  </div>

                  <p className="text-xs text-krishi-charcoal mt-3 line-clamp-2 leading-relaxed">
                    {guide.soil_requirements}
                  </p>
                </div>

                <div className="pt-3 border-t border-krishi-lightGray/40 flex items-center justify-between text-xs">
                  <span className="text-krishi-deepGreen font-semibold">
                    ~{guide.growing_duration_days} दिवस
                  </span>
                  <span className="text-krishi-deepGreen font-bold flex items-center space-x-1 hover:underline">
                    <span>मार्गदर्शन पहा</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <FarmModal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
        onSuccess={loadData}
      />

      <FieldModal
        isOpen={isFieldModalOpen}
        farms={farms}
        defaultFarmId={selectedFarmForField?.id}
        onClose={() => {
          setIsFieldModalOpen(false);
          setSelectedFarmForField(null);
        }}
        onSuccess={loadData}
      />

      <CropModal
        isOpen={isCropModalOpen}
        fields={allFields}
        onClose={() => setIsCropModalOpen(false)}
        onSuccess={loadData}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        cropRecords={cropRecords}
        defaultCropRecordId={taskModalCropId}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskModalCropId(undefined);
        }}
        onSuccess={loadData}
      />

      <CropGuideDrawer
        guide={selectedGuideForDrawer}
        isOpen={!!selectedGuideForDrawer}
        onClose={() => setSelectedGuideForDrawer(null)}
      />
    </div>
  );
}
