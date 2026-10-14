"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createCropRecordAction } from "./actions";
import { DEFAULT_CROP_GUIDES } from "./agronomy";
import { X, Sprout, AlertCircle, Sparkles } from "lucide-react";

interface CropModalProps {
  isOpen: boolean;
  fields: any[];
  defaultFieldId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CropModal: React.FC<CropModalProps> = ({
  isOpen,
  fields,
  defaultFieldId,
  onClose,
  onSuccess,
}) => {
  const { t, language } = useTranslation();
  const [fieldId, setFieldId] = useState(defaultFieldId || (fields[0]?.id || ""));
  const [selectedGuideId, setSelectedGuideId] = useState<string>(DEFAULT_CROP_GUIDES[0].id);
  const [customCropName, setCustomCropName] = useState("");
  const [variety, setVariety] = useState(DEFAULT_CROP_GUIDES[0].variety || "");
  const [season, setSeason] = useState<"Kharif" | "Rabi" | "Zaid" | "Perennial">(
    DEFAULT_CROP_GUIDES[0].ideal_season
  );
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split("T")[0]);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState("");
  const [status, setStatus] = useState<"planned" | "sown" | "growing" | "harvesting" | "completed" | "abandoned">("sown");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGuideSelect = (guideId: string) => {
    setSelectedGuideId(guideId);
    if (guideId === "custom") {
      setVariety("");
    } else {
      const guide = DEFAULT_CROP_GUIDES.find((g) => g.id === guideId);
      if (guide) {
        setVariety(guide.variety || "");
        setSeason(guide.ideal_season);
        calculateHarvest(sowingDate, guide.growing_duration_days);
      }
    }
  };

  const calculateHarvest = (sowDate: string, days: number) => {
    try {
      const d = new Date(sowDate);
      d.setDate(d.getDate() + days);
      setExpectedHarvestDate(d.toISOString().split("T")[0]);
    } catch {
      // Ignore
    }
  };

  const handleSowingDateChange = (newDate: string) => {
    setSowingDate(newDate);
    const guide = DEFAULT_CROP_GUIDES.find((g) => g.id === selectedGuideId);
    if (guide) {
      calculateHarvest(newDate, guide.growing_duration_days);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const guide = DEFAULT_CROP_GUIDES.find((g) => g.id === selectedGuideId);
      const res = await createCropRecordAction({
        fieldId,
        guideId: selectedGuideId === "custom" ? undefined : selectedGuideId,
        customCropName: selectedGuideId === "custom" ? customCropName : (language === "en" ? guide?.crop_name_en : (language === "hi" ? guide?.crop_name_hi : guide?.crop_name_mr)),
        variety,
        season,
        sowingDate,
        expectedHarvestDate: expectedHarvestDate || undefined,
        status,
        notes,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.error || t("common.error"));
      }
    } catch (err: any) {
      setErrorMsg(err.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl border border-krishi-border shadow-floating overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-krishi-border flex items-center justify-between bg-krishi-ivory-100/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-krishi-primary-50 text-krishi-deepGreen flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 id="crop-modal-title" className="text-base sm:text-lg font-bold text-krishi-deepGreen">
                {t("farming.addCrop")}
              </h3>
              <p className="text-xs text-krishi-textMuted">
                {t("farming.crops")} & {t("farming.growthStage")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t("common.close")}
            className="w-9 h-9 rounded-xl hover:bg-krishi-ivory-200 flex items-center justify-center text-krishi-textMuted transition-colors min-h-[44px] min-w-[44px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <Alert variant="error" icon={<AlertCircle className="w-5 h-5 text-red-600" />}>
              <span>{errorMsg}</span>
            </Alert>
          )}

          {/* Select Field */}
          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-semibold text-krishi-textMain">
              {t("farming.fields")}
            </label>
            <select
              value={fieldId}
              onChange={(e) => setFieldId(e.target.value)}
              required
              className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-krishi-deepGreen"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.field_name} ({f.area_acres} {t("farming.acresUnit")} • {f.farmName || "Farm"})
                </option>
              ))}
            </select>
          </div>

          {/* Select Crop Guide */}
          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-semibold text-krishi-textMain flex items-center justify-between">
              <span>{t("farming.cropGuides")}</span>
              <span className="text-[11px] font-normal text-krishi-deepGreen flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 5 {t("farming.cropGuides")}
              </span>
            </label>
            <select
              value={selectedGuideId}
              onChange={(e) => handleGuideSelect(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-krishi-deepGreen"
            >
              {DEFAULT_CROP_GUIDES.map((g) => (
                <option key={g.id} value={g.id}>
                  {language === "en" ? g.crop_name_en : (language === "hi" ? g.crop_name_hi : g.crop_name_mr)} ({g.ideal_season} • {g.growing_duration_days} {t("dashboard.daysUnit")})
                </option>
              ))}
              <option value="custom">Other / Custom Crop</option>
            </select>
          </div>

          {selectedGuideId === "custom" && (
            <Input
              label={t("farming.crops")}
              required
              placeholder="e.g. Tomato / Turmeric"
              value={customCropName}
              onChange={(e) => setCustomCropName(e.target.value)}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Variety"
              placeholder="e.g. JS 335 / Hybrid"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-semibold text-krishi-textMain">
                Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as any)}
                className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-krishi-deepGreen"
              >
                <option value="Kharif">Kharif (खरीप)</option>
                <option value="Rabi">Rabi (रब्बी)</option>
                <option value="Zaid">Zaid (उन्हाळी / झैद)</option>
                <option value="Perennial">Perennial (बारमाही)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={t("farming.sowingDate")}
              type="date"
              required
              value={sowingDate}
              onChange={(e) => handleSowingDateChange(e.target.value)}
            />

            <Input
              label={t("farming.estimatedHarvest")}
              type="date"
              value={expectedHarvestDate}
              onChange={(e) => setExpectedHarvestDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-semibold text-krishi-textMain">
              {t("common.status")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "sown" as const, label: "Sown (पेरणी)" },
                { id: "planned" as const, label: "Planned (नियोजित)" },
                { id: "growing" as const, label: "Growing (वाढ)" },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatus(st.id)}
                  className={`min-h-[44px] px-2 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    status === st.id
                      ? "bg-krishi-deepGreen text-white border-krishi-deepGreen shadow-subtle"
                      : "bg-white text-krishi-textMain border-krishi-border hover:bg-krishi-ivory-100"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-krishi-border">
            <Button type="button" variant="ghost" size="md" onClick={onClose} className="min-h-[44px]">
              {t("common.cancel")}
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="min-h-[44px]">
              {t("common.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
