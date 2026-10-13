"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createCropRecordAction } from "./actions";
import { DEFAULT_CROP_GUIDES, CropGuideItem } from "./agronomy";
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
  const [fieldId, setFieldId] = useState(defaultFieldId || (fields[0]?.id || ""));
  const [selectedGuideId, setSelectedGuideId] = useState(DEFAULT_CROP_GUIDES[0].id);
  const [customCropName, setCustomCropName] = useState("");
  const [variety, setVariety] = useState(DEFAULT_CROP_GUIDES[0].variety);
  const [season, setSeason] = useState<"Kharif" | "Rabi" | "Zaid" | "Perennial">(
    DEFAULT_CROP_GUIDES[0].ideal_season
  );
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split("T")[0]);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState("");
  const [status, setStatus] = useState<"planned" | "sown" | "growing">("sown");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGuideSelect = (guideId: string) => {
    setSelectedGuideId(guideId);
    if (guideId === "custom") {
      setVariety("");
      return;
    }
    const guide = DEFAULT_CROP_GUIDES.find((g) => g.id === guideId);
    if (guide) {
      setVariety(guide.variety);
      setSeason(guide.ideal_season);
      if (sowingDate) {
        const d = new Date(sowingDate);
        d.setDate(d.getDate() + guide.growing_duration_days);
        setExpectedHarvestDate(d.toISOString().split("T")[0]);
      }
    }
  };

  const handleSowingDateChange = (dateStr: string) => {
    setSowingDate(dateStr);
    const guide = DEFAULT_CROP_GUIDES.find((g) => g.id === selectedGuideId);
    if (guide && dateStr) {
      const d = new Date(dateStr);
      d.setDate(d.getDate() + guide.growing_duration_days);
      setExpectedHarvestDate(d.toISOString().split("T")[0]);
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
        customCropName: selectedGuideId === "custom" ? customCropName : guide?.crop_name_mr,
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
        setErrorMsg(res.error || "पीक नोंदणी अयशस्वी झाली.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "त्रुटी आली.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-krishi-border shadow-floating overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-krishi-border flex items-center justify-between bg-krishi-ivory-100/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-krishi-primary-50 text-krishi-deepGreen flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-krishi-deepGreen">
                नवीन पीक नोंदवा (Register Crop)
              </h3>
              <p className="text-xs text-krishi-textMuted">
                पिकाची निवड व पेरणी तारखेनुसार मार्गदर्शिका सुरू करा
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-krishi-ivory-200 flex items-center justify-center text-krishi-textMuted transition-colors"
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
              शेत तुकडा निवडा (Select Field)
            </label>
            <select
              value={fieldId}
              onChange={(e) => setFieldId(e.target.value)}
              required
              className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-krishi-deepGreen"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.field_name} ({f.area_acres} एकर • {f.farms?.farm_name || "शेत"})
                </option>
              ))}
            </select>
          </div>

          {/* Select Crop Guide */}
          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-semibold text-krishi-textMain flex items-center justify-between">
              <span>पीक निवडा (Select Crop)</span>
              <span className="text-[11px] font-normal text-krishi-deepGreen flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> ५ प्रमाणित पिके उपलब्ध
              </span>
            </label>
            <select
              value={selectedGuideId}
              onChange={(e) => handleGuideSelect(e.target.value)}
              className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-krishi-deepGreen"
            >
              {DEFAULT_CROP_GUIDES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.crop_name_mr} ({g.crop_name_en} • {g.ideal_season} • {g.growing_duration_days} दिवस)
                </option>
              ))}
              <option value="custom">इतर सानुकूल पीक (Other / Custom Crop)</option>
            </select>
          </div>

          {selectedGuideId === "custom" && (
            <Input
              label="पिकाचे नाव (Custom Crop Name)"
              required
              placeholder="उदा. टोमॅटो / हळद"
              value={customCropName}
              onChange={(e) => setCustomCropName(e.target.value)}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="वाण / जात (Variety)"
              placeholder="उदा. JS 335 / संकरित"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-semibold text-krishi-textMain">
                हंगाम (Season)
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value as any)}
                className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-krishi-deepGreen"
              >
                <option value="Kharif">खरीप (Kharif)</option>
                <option value="Rabi">रब्बी (Rabi)</option>
                <option value="Zaid">उन्हाळी / झैद (Zaid)</option>
                <option value="Perennial">वार्षिक / बारमाही (Perennial)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="पेरणी / लागवड तारीख (Sowing Date)"
              type="date"
              required
              value={sowingDate}
              onChange={(e) => handleSowingDateChange(e.target.value)}
            />

            <Input
              label="अंदाजे काढणी तारीख (Estimated Harvest)"
              type="date"
              value={expectedHarvestDate}
              onChange={(e) => setExpectedHarvestDate(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-semibold text-krishi-textMain">
              स्थिती (Current Status)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "sown" as const, label: "पेरणी झाली (Sown)" },
                { id: "planned" as const, label: "नियोजित (Planned)" },
                { id: "growing" as const, label: "वाढ होत आहे (Growing)" },
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
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              रद्द करा
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
              पीक नोंद जतन करा (Save Crop)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
