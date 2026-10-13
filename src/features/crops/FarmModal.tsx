"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { createFarmAction } from "./actions";
import { MAHARASHTRA_DISTRICTS } from "@/features/auth/maharashtraDistricts";
import { X, Sprout, AlertCircle, CheckCircle2 } from "lucide-react";

interface FarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FarmModal: React.FC<FarmModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [farmName, setFarmName] = useState("");
  const [totalAreaAcres, setTotalAreaAcres] = useState<number>(3);
  const [district, setDistrict] = useState("Pune");
  const [taluka, setTaluka] = useState("Haveli");
  const [soilType, setSoilType] = useState("मध्यम काळी (Medium Black)");
  const [irrigationSources, setIrrigationSources] = useState<string[]>(["drip", "well"]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const talukas = MAHARASHTRA_DISTRICTS[district]?.talukas || [];

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const firstTaluka = MAHARASHTRA_DISTRICTS[newDist]?.talukas[0]?.nameEn || "";
    setTaluka(firstTaluka);
  };

  const toggleIrrigation = (source: string) => {
    if (irrigationSources.includes(source)) {
      setIrrigationSources(irrigationSources.filter((s) => s !== source));
    } else {
      setIrrigationSources([...irrigationSources, source]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await createFarmAction({
        farmName,
        totalAreaAcres: Number(totalAreaAcres),
        irrigationSource: irrigationSources,
        soilType,
        locationDistrict: district,
        locationTaluka: taluka,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res.error || "शेत नोंदणी अयशस्वी झाली.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "काहीतरी चूक झाली.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-krishi-border shadow-floating overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-krishi-border flex items-center justify-between bg-krishi-ivory-100/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-krishi-primary-50 text-krishi-deepGreen flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-krishi-deepGreen">
                नवीन शेत नोंदवा (Add Farm)
              </h3>
              <p className="text-xs text-krishi-textMuted">
                आपल्या शेताचा तपशील व क्षेत्रफळ प्रविष्ट करा
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <Alert variant="error" icon={<AlertCircle className="w-5 h-5 text-red-600" />}>
              <span>{errorMsg}</span>
            </Alert>
          )}

          <Input
            label="शेताचे नाव (Farm Name)"
            required
            placeholder="उदा. श्री गणेश कृषी फार्म"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="एकूण क्षेत्र (Total Area in Acres)"
              type="number"
              step="0.1"
              min="0.1"
              required
              value={totalAreaAcres}
              onChange={(e) => setTotalAreaAcres(parseFloat(e.target.value) || 0)}
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-semibold text-krishi-textMain">
                मातीचा प्रकार (Soil Type)
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-krishi-deepGreen"
              >
                <option value="भारी काळी जमीन (Deep Black Soil)">भारी काळी जमीन (Deep Black Soil)</option>
                <option value="मध्यम काळी (Medium Black)">मध्यम काळी (Medium Black)</option>
                <option value="हलकी/मुरमाड (Light Murum Soil)">हलकी/मुरमाड (Light Murum Soil)</option>
                <option value="लाल तांबडी (Red Sandy Soil)">लाल तांबडी (Red Sandy Soil)</option>
                <option value="गाळाची जमीन (Alluvial Soil)">गाळाची जमीन (Alluvial Soil)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-semibold text-krishi-textMain">
                जिल्हा (District)
              </label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-krishi-deepGreen"
              >
                {Object.entries(MAHARASHTRA_DISTRICTS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.nameMr} ({item.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-semibold text-krishi-textMain">
                तालुका (Taluka)
              </label>
              <select
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-krishi-border bg-white px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-krishi-deepGreen"
              >
                {talukas.map((tItem) => (
                  <option key={tItem.nameEn} value={tItem.nameEn}>
                    {tItem.nameMr} ({tItem.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Irrigation Source Toggles */}
          <div className="space-y-1.5 text-left">
            <label className="block text-sm font-semibold text-krishi-textMain">
              पाणीपुरवठा / सिंचन स्रोत (Irrigation Sources)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "drip", label: "ठिबक सिंचन (Drip)" },
                { id: "sprinkler", label: "तुषार सिंचन (Sprinkler)" },
                { id: "well", label: "विहीर (Open Well)" },
                { id: "borewell", label: "बोअरवेल (Borewell)" },
                { id: "canal", label: "कालवा (Canal)" },
                { id: "rainfed", label: "कोरडवाहू (Rainfed)" },
              ].map((src) => {
                const isSelected = irrigationSources.includes(src.id);
                return (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => toggleIrrigation(src.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-krishi-deepGreen text-white border-krishi-deepGreen shadow-subtle"
                        : "bg-white text-krishi-textMain border-krishi-border hover:bg-krishi-ivory-100"
                    }`}
                  >
                    {src.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-krishi-border">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              रद्द करा (Cancel)
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
              शेत जतन करा (Save Farm)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
