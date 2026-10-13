"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createFieldAction } from "./actions";
import { X, Layers, AlertCircle } from "lucide-react";

interface FieldModalProps {
  isOpen: boolean;
  farms: any[];
  defaultFarmId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const FieldModal: React.FC<FieldModalProps> = ({
  isOpen,
  farms,
  defaultFarmId,
  onClose,
  onSuccess,
}) => {
  const [farmId, setFarmId] = useState(defaultFarmId || (farms[0]?.id || ""));
  const [fieldName, setFieldName] = useState("");
  const [areaAcres, setAreaAcres] = useState<number>(1.5);
  const [soilType, setSoilType] = useState("मध्यम काळी");
  const [irrigationType, setIrrigationType] = useState("ठिबक सिंचन");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await createFieldAction({
        farmId,
        fieldName,
        areaAcres: Number(areaAcres),
        soilType,
        irrigationType,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.error || "तुकडा जोडणे अयशस्वी झाले.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "त्रुटी आली.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl border border-krishi-border shadow-floating overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-krishi-border flex items-center justify-between bg-krishi-ivory-100/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-krishi-primary-50 text-krishi-deepGreen flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-krishi-deepGreen">
                शेताचा तुकडा जोडा (Add Field)
              </h3>
              <p className="text-xs text-krishi-textMuted">
                विशिष्ट पिकाच्या नियोजनासाठी क्षेत्र विभागणी
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {errorMsg && (
            <Alert variant="error" icon={<AlertCircle className="w-5 h-5 text-red-600" />}>
              <span>{errorMsg}</span>
            </Alert>
          )}

          {/* Farm Selector */}
          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-semibold text-krishi-textMain">
              मुख्य शेत निवडा (Select Farm)
            </label>
            <select
              value={farmId}
              onChange={(e) => setFarmId(e.target.value)}
              required
              className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-krishi-deepGreen"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farm_name} ({f.total_area_acres} एकर • {f.location_district})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="तुकड्याचे नाव (Field Name / Identifier)"
            required
            placeholder="उदा. गट नं. ४५ / उत्तरेकडील शेत"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />

          <Input
            label="क्षेत्रफळ एकरमध्ये (Area in Acres)"
            type="number"
            step="0.1"
            min="0.1"
            required
            value={areaAcres}
            onChange={(e) => setAreaAcres(parseFloat(e.target.value) || 0)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-semibold text-krishi-textMain">
                माती
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-2 py-2 text-xs font-medium focus:ring-2 focus:ring-krishi-deepGreen"
              >
                <option value="काळी जमीन">काळी जमीन</option>
                <option value="मध्यम काळी">मध्यम काळी</option>
                <option value="हलकी मुरमाड">हलकी मुरमाड</option>
                <option value="लाल तांबडी">लाल तांबडी</option>
              </select>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-semibold text-krishi-textMain">
                सिंचन
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-2 py-2 text-xs font-medium focus:ring-2 focus:ring-krishi-deepGreen"
              >
                <option value="ठिबक सिंचन">ठिबक सिंचन</option>
                <option value="तुषार सिंचन">तुषार सिंचन</option>
                <option value="पाटपाणी">पाटपाणी</option>
                <option value="कोरडवाहू">कोरडवाहू</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-krishi-border">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              रद्द करा
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
              तुकडा जोडा (Save Field)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
