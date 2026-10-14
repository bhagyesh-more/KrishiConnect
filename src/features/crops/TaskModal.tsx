"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createCropTaskAction } from "./actions";
import { X, CheckSquare, Droplets, FlaskConical, Bug, Scissors, Sparkles, Eye, AlertCircle } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  cropRecords: any[];
  defaultCropRecordId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  cropRecords,
  defaultCropRecordId,
  onClose,
  onSuccess,
}) => {
  const { t, language } = useTranslation();
  const [cropRecordId, setCropRecordId] = useState(
    defaultCropRecordId || (cropRecords[0]?.id || "")
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "irrigation" | "fertilizer" | "pesticide" | "weeding" | "harvest" | "scouting"
  >("irrigation");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: "irrigation", label: "Irrigation (सिंचन)", icon: Droplets, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { id: "fertilizer", label: "Fertilizer (खत)", icon: FlaskConical, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { id: "pesticide", label: "Pesticide (कीटकनाशक)", icon: Bug, color: "text-red-600 bg-red-50 border-red-200" },
    { id: "weeding", label: "Weeding (खुरपणी)", icon: Scissors, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { id: "scouting", label: "Scouting (पाहणी)", icon: Eye, color: "text-purple-600 bg-purple-50 border-purple-200" },
    { id: "harvest", label: "Harvest (काढणी)", icon: Sparkles, color: "text-orange-600 bg-orange-50 border-orange-200" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!cropRecordId) {
      setErrorMsg("Please select a crop record.");
      return;
    }

    if (!title.trim()) {
      setErrorMsg("Please enter a task title.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await createCropTaskAction({
        cropRecordId,
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        dueDate,
        priority,
      });

      if (!res.success) {
        setErrorMsg(res.error || t("common.error"));
        setIsLoading(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-krishi-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-krishi-border bg-krishi-ivory-100/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-krishi-deepGreen text-white flex items-center justify-center shadow-sm">
              <CheckSquare className="w-5 h-5 text-krishi-leafGreen" />
            </div>
            <div>
              <h2 id="task-modal-title" className="text-lg font-bold text-krishi-deepGreen">
                {t("farming.addTask")}
              </h2>
              <p className="text-xs text-krishi-textMuted">
                {t("farming.tasks")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t("common.close")}
            className="p-2 text-krishi-textMuted hover:text-krishi-deepGreen hover:bg-white rounded-full transition-colors min-h-[44px] min-w-[44px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">
          {errorMsg && (
            <Alert variant="error" className="py-2.5">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            </Alert>
          )}

          {/* Select Crop */}
          <div>
            <label className="block font-semibold text-krishi-textMain mb-1.5">
              {t("farming.crops")} <span className="text-red-500">*</span>
            </label>
            <select
              value={cropRecordId}
              onChange={(e) => setCropRecordId(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 border border-krishi-border rounded-xl bg-white text-krishi-textMain focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen transition"
              required
            >
              {cropRecords.length === 0 ? (
                <option value="">{t("farming.noCrops")}</option>
              ) : (
                cropRecords.map((crop) => {
                  const cropName =
                    (language === "en" ? crop.crop_guides?.crop_name_en : (language === "hi" ? crop.crop_guides?.crop_name_hi : crop.crop_guides?.crop_name_mr)) ||
                    crop.custom_crop_name ||
                    t("farming.crops");
                  const fieldName = crop.farm_fields?.field_name || t("farming.fields");
                  return (
                    <option key={crop.id} value={crop.id}>
                      {cropName} ({crop.variety || "General"}) — {fieldName}
                    </option>
                  );
                })
              )}
            </select>
          </div>

          {/* Category selection */}
          <div>
            <label className="block font-semibold text-krishi-textMain mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id as any)}
                    className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-left text-xs font-medium transition-all min-h-[44px] ${
                      isSelected
                        ? "border-krishi-deepGreen bg-krishi-primary-50 text-krishi-deepGreen font-semibold ring-1 ring-krishi-deepGreen"
                        : "border-krishi-border hover:bg-krishi-ivory-100 text-krishi-textMain"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-krishi-textMain mb-1.5">
              Task Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Turn on drip irrigation, apply urea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Due Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-krishi-textMain mb-1.5">
                Due Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-krishi-textMain mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full min-h-[48px] px-3.5 py-2.5 border border-krishi-border rounded-xl bg-white text-krishi-textMain focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen transition"
              >
                <option value="low">Low (कमी)</option>
                <option value="medium">Medium (मध्यम)</option>
                <option value="high">High (उच्च)</option>
                <option value="urgent">Urgent (तातडीचे)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-krishi-textMain mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Check water flow rate, calibrate fertilizer dosage"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-krishi-border rounded-xl bg-white text-krishi-textMain focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen transition"
            />
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-krishi-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="min-h-[44px]"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="min-w-[120px] min-h-[44px]"
            >
              {isLoading ? t("common.loading") : t("common.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
