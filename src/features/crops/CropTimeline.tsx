"use client";

import React, { useState } from "react";
import { calculateCropGrowth, CropGuideItem } from "./agronomy";
import { updateCropStatusAction } from "./actions";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Info,
  Check,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

interface CropTimelineProps {
  cropRecord: any;
  cropGuide?: CropGuideItem | null;
  onStatusUpdated?: () => void;
}

export const CropTimeline: React.FC<CropTimelineProps> = ({
  cropRecord,
  cropGuide,
  onStatusUpdated,
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const growth = calculateCropGrowth(cropRecord.sowing_date, cropGuide);
  const stages = cropGuide?.growth_stages || [];

  const handleStatusChange = async (newStatus: any) => {
    setIsUpdatingStatus(true);
    setStatusMessage(null);
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await updateCropStatusAction(
        cropRecord.id,
        newStatus,
        newStatus === "completed" ? today : undefined
      );
      if (res.success) {
        setStatusMessage("स्थिती यशस्वीरित्या बदलली!");
        if (onStatusUpdated) onStatusUpdated();
      } else {
        setStatusMessage(res.error || "अपडेट अयशस्वी");
      }
    } catch {
      setStatusMessage("नेटवर्क त्रुटी");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "growing":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">वाढ सुरू (Growing)</span>;
      case "harvesting":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">काढणी सुरू (Harvesting)</span>;
      case "completed":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">काढणी पूर्ण (Harvested)</span>;
      case "abandoned":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">रद्द (Abandoned)</span>;
      case "sown":
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">पेरणी झालेली (Sown)</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-krishi-lightGray/60 p-5 shadow-sm space-y-5">
      {/* Top Details & Elapsed Days */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-krishi-lightGray/40 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-krishi-deepGreen">
              जैविक वाढ टप्पा व प्रगती (Growth Stage Timeline)
            </h3>
            {getStatusBadge(cropRecord.status)}
          </div>
          <p className="text-xs text-krishi-gray mt-1 flex items-center space-x-2">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-krishi-leafGreen" />
              पेरणी: {cropRecord.sowing_date}
            </span>
            {cropRecord.expected_harvest_date && (
              <span>• अपेक्षित काढणी: {cropRecord.expected_harvest_date}</span>
            )}
          </p>
        </div>

        {/* Elapsed Days Card */}
        <div className="flex items-center space-x-2 bg-krishi-warmIvory/80 border border-krishi-leafGreen/30 px-3.5 py-2 rounded-xl">
          <Clock className="w-4 h-4 text-krishi-deepGreen shrink-0" />
          <div>
            <div className="text-xs text-krishi-charcoal font-medium">पेरणीनंतरचे दिवस</div>
            <div className="text-sm font-extrabold text-krishi-deepGreen">
              {growth.elapsedDays} दिवस{" "}
              <span className="text-xs font-normal text-krishi-gray">
                / अंदाजे {growth.totalDays} दिवस
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold text-krishi-charcoal mb-1.5">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-krishi-leafGreen" />
            <span>सध्याचा टप्पा: {growth.currentStage.nameMr}</span>
          </span>
          <span className="text-krishi-deepGreen font-bold">{growth.progressPercent}%</span>
        </div>
        <div className="w-full bg-krishi-lightGray/50 h-3 rounded-full overflow-hidden p-0.5 border border-krishi-lightGray/30">
          <div
            className="h-full rounded-full bg-gradient-to-r from-krishi-leafGreen to-krishi-deepGreen transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(5, growth.progressPercent))}%` }}
          />
        </div>
      </div>

      {/* Interactive / Visual Stage List */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 pt-2">
        {stages.map((stg, idx) => {
          const isPassed = growth.elapsedDays > stg.days;
          const isCurrent = growth.currentStage.stage === stg.stage;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                isCurrent
                  ? "border-krishi-deepGreen bg-krishi-leafGreen/15 shadow-sm ring-1 ring-krishi-deepGreen/50"
                  : isPassed
                  ? "border-emerald-200 bg-emerald-50/50 text-emerald-900"
                  : "border-krishi-lightGray/40 bg-gray-50/50 text-krishi-gray"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    टप्पा {idx + 1}
                  </span>
                  {isPassed ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-krishi-deepGreen animate-ping" />
                  ) : null}
                </div>
                <h4
                  className={`text-xs font-bold ${
                    isCurrent
                      ? "text-krishi-deepGreen"
                      : isPassed
                      ? "text-emerald-900"
                      : "text-krishi-charcoal"
                  }`}
                >
                  {stg.nameMr}
                </h4>
                <p className="text-[11px] text-krishi-gray mt-0.5">~{stg.days} दिवस</p>
              </div>

              {/* Tasks bullet list if current */}
              {isCurrent && stg.tasks.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-krishi-leafGreen/30 text-[11px] text-krishi-charcoal space-y-1">
                  <span className="font-semibold text-krishi-deepGreen block">महत्त्वाची कामे:</span>
                  {stg.tasks.map((t, tidx) => (
                    <div key={tidx} className="flex items-start space-x-1">
                      <ChevronRight className="w-3 h-3 text-krishi-deepGreen shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-krishi-lightGray/40">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-krishi-gray font-medium">स्थिती बदला:</span>
          {cropRecord.status !== "growing" && cropRecord.status !== "completed" && (
            <button
              onClick={() => handleStatusChange("growing")}
              disabled={isUpdatingStatus}
              className="text-xs px-2.5 py-1 rounded-lg border border-krishi-leafGreen text-krishi-deepGreen hover:bg-krishi-leafGreen/20 font-medium transition"
            >
              वाढ सुरू
            </button>
          )}
          {cropRecord.status !== "harvesting" && cropRecord.status !== "completed" && (
            <button
              onClick={() => handleStatusChange("harvesting")}
              disabled={isUpdatingStatus}
              className="text-xs px-2.5 py-1 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50 font-medium transition"
            >
              काढणी सुरू
            </button>
          )}
          {cropRecord.status !== "completed" && (
            <button
              onClick={() => handleStatusChange("completed")}
              disabled={isUpdatingStatus}
              className="text-xs px-2.5 py-1 rounded-lg bg-krishi-deepGreen text-white hover:bg-krishi-deepGreen/90 font-medium transition"
            >
              काढणी पूर्ण झाली
            </button>
          )}
        </div>
        {statusMessage && (
          <span className="text-xs text-krishi-deepGreen font-semibold">{statusMessage}</span>
        )}
      </div>

      {/* Explicit Educational Disclaimer */}
      <div className="flex items-start space-x-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-[11px] text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>कृषी सूचना:</strong> {growth.disclaimer} पिकाची प्रत्यक्ष स्थिती, कीड-रोगांचे
          प्रादुर्भाव व पाणी पुरवठा यानुसार स्थानिक कृषी सहाय्यक किंवा तज्ज्ञांचा सल्ला घ्यावा.
        </p>
      </div>
    </div>
  );
};
