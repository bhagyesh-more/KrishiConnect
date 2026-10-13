"use client";

import React, { useState } from "react";
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
    { id: "irrigation", label: "पाणी देणे (Irrigation)", icon: Droplets, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { id: "fertilizer", label: "खत व्यवस्थापन (Fertilizer)", icon: FlaskConical, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { id: "pesticide", label: "कीड/रोग नियंत्रण (Pesticide)", icon: Bug, color: "text-red-600 bg-red-50 border-red-200" },
    { id: "weeding", label: "खुरपणी / तण (Weeding)", icon: Scissors, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { id: "scouting", label: "पाहणी (Crop Scouting)", icon: Eye, color: "text-purple-600 bg-purple-50 border-purple-200" },
    { id: "harvest", label: "काढणी (Harvesting)", icon: Sparkles, color: "text-orange-600 bg-orange-50 border-orange-200" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!cropRecordId) {
      setErrorMsg("कृपया ज्या पिकासाठी काम आहे ते पीक निवडा");
      return;
    }

    if (!title.trim()) {
      setErrorMsg("कृपया कामाचे नाव टाका");
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
        setErrorMsg(res.error || "काम जोडण्यात त्रुटी आली");
        setIsLoading(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "नेटवर्क किंवा सर्व्हर त्रुटी");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-krishi-leafGreen/30">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-krishi-lightGray/40 bg-krishi-warmIvory/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-krishi-deepGreen text-white flex items-center justify-center shadow-sm">
              <CheckSquare className="w-5 h-5 text-krishi-leafGreen" />
            </div>
            <div>
              <h2 id="task-modal-title" className="text-lg font-bold text-krishi-deepGreen">
                नवीन पीक कार्य नोंदवा (Add Care Task)
              </h2>
              <p className="text-xs text-krishi-gray">
                वेळेवर कामे पूर्ण करून पीक निरोगी ठेवा
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-krishi-gray hover:text-krishi-charcoal hover:bg-white rounded-full transition-colors"
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
            <label className="block font-semibold text-krishi-charcoal mb-1.5">
              संबंधित पीक निवडा (Select Crop) <span className="text-red-500">*</span>
            </label>
            <select
              value={cropRecordId}
              onChange={(e) => setCropRecordId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-krishi-lightGray rounded-xl bg-white text-krishi-charcoal focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen transition"
              required
            >
              {cropRecords.length === 0 ? (
                <option value="">कोणतेही सक्रिय पीक उपलब्ध नाही</option>
              ) : (
                cropRecords.map((crop) => {
                  const cropName =
                    crop.crop_guides?.crop_name_mr ||
                    crop.custom_crop_name ||
                    crop.crop_name ||
                    "पीक";
                  const fieldName = crop.farm_fields?.field_name || "शेतात";
                  return (
                    <option key={crop.id} value={crop.id}>
                      {cropName} ({crop.variety || "सामान्य"}) — {fieldName}
                    </option>
                  );
                })
              )}
            </select>
          </div>

          {/* Category selection */}
          <div>
            <label className="block font-semibold text-krishi-charcoal mb-2">
              कार्याचा प्रकार (Task Category) <span className="text-red-500">*</span>
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
                    className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? "border-krishi-deepGreen bg-krishi-leafGreen/15 text-krishi-deepGreen font-semibold ring-1 ring-krishi-deepGreen"
                        : "border-krishi-lightGray/70 hover:bg-krishi-warmIvory/60 text-krishi-charcoal"
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
            <label className="block font-semibold text-krishi-charcoal mb-1.5">
              कामाचे शीर्षक (Task Title) <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="उदा. ठिबक सिंचन सुरू करणे, युरिया खत देणे"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Due Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-krishi-charcoal mb-1.5">
                नियोजित तारीख (Due Date) <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-krishi-charcoal mb-1.5">
                प्राधान्य (Priority)
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 border border-krishi-lightGray rounded-xl bg-white text-krishi-charcoal focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen transition"
              >
                <option value="low">कमी (Low)</option>
                <option value="medium">मध्यम (Medium)</option>
                <option value="high">उच्च (High)</option>
                <option value="urgent">तातडीचे (Urgent)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-krishi-charcoal mb-1.5">
              तपशील / सूचना (Notes / Description)
            </label>
            <textarea
              rows={2}
              placeholder="उदा. पाण्याचा प्रवाह तपासा, खताचे प्रमाण व्यवस्थित ठेवा"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-krishi-lightGray rounded-xl bg-white text-krishi-charcoal focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen transition"
            />
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-krishi-lightGray/40">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              रद्द करा
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "जतन होत आहे..." : "काम जोडा"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
