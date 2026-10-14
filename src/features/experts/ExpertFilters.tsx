"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n";
import { Search, MapPin, SlidersHorizontal, MessageSquareCode } from "lucide-react";
import { MAHARASHTRA_DISTRICTS } from "@/features/auth/maharashtraDistricts";
import { ExpertSpecialization } from "./types";

interface ExpertFiltersProps {
  selectedSpecialization: ExpertSpecialization | "all";
  onSelectSpecialization: (spec: ExpertSpecialization | "all") => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: "browse" | "my_requests";
  onTabChange: (tab: "browse" | "my_requests") => void;
}

export const ExpertFilters: React.FC<ExpertFiltersProps> = ({
  selectedSpecialization,
  onSelectSpecialization,
  selectedDistrict,
  onSelectDistrict,
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
}) => {
  const { language } = useTranslation();

  const specializations: { key: ExpertSpecialization | "all"; labelMr: string }[] = [
    { key: "all", labelMr: "सर्व शाखा" },
    { key: "agronomy_pest", labelMr: "कीटकशास्त्र व पीक संरक्षण" },
    { key: "soil_fertilizer", labelMr: "मृद व खत व्यवस्थापन" },
    { key: "horticulture_fruits", labelMr: "फळबाग व उद्यानविद्या" },
    { key: "irrigation_engineering", labelMr: "सिंचन व कृषी अभियांत्रिकी" },
    { key: "organic_farming", labelMr: "सेंद्रिय व नैसर्गिक शेती" },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-krishi-border bg-white rounded-xl p-1 shadow-sm">
        <button
          onClick={() => onTabChange("browse")}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center ${
            activeTab === "browse"
              ? "bg-krishi-deepGreen text-white shadow-sm"
              : "text-krishi-textMuted hover:text-krishi-deepGreen hover:bg-krishi-primary-50/50"
          }`}
        >
          मान्यताप्राप्त तज्ज्ञ निर्देशिका (Directory)
        </button>
        <button
          onClick={() => onTabChange("my_requests")}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
            activeTab === "my_requests"
              ? "bg-krishi-deepGreen text-white shadow-sm"
              : "text-krishi-textMuted hover:text-krishi-deepGreen hover:bg-krishi-primary-50/50"
          }`}
        >
          <MessageSquareCode className="w-4 h-4" />
          <span>माझ्या सल्ला विनंत्या (My Requests)</span>
        </button>
      </div>

      {activeTab === "browse" && (
        <>
          {/* Search Bar & District Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="relative sm:col-span-8">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-krishi-textMuted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="तज्ज्ञांचे नाव, पीक (उदा. सोयाबीन, कापूस) किंवा विद्यापीठ शोधा..."
                className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-krishi-border bg-white placeholder:text-krishi-textMuted/70 focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30 focus:border-krishi-deepGreen transition shadow-sm"
              />
            </div>

            <div className="relative sm:col-span-4">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-krishi-textMuted pointer-events-none" />
              <select
                value={selectedDistrict}
                onChange={(e) => onSelectDistrict(e.target.value)}
                className="w-full pl-8 pr-7 py-2.5 text-xs sm:text-sm rounded-xl border border-krishi-border bg-white text-krishi-deepGreen focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30 appearance-none shadow-sm cursor-pointer"
              >
                <option value="all">सर्व जिल्हे (All Districts)</option>
                {Object.entries(MAHARASHTRA_DISTRICTS).map(([key, d]) => (
                  <option key={key} value={key}>
                    {language === "mr" ? d.nameMr : d.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specialization Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            {specializations.map((s) => {
              const active = selectedSpecialization === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => onSelectSpecialization(s.key)}
                  className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                    active
                      ? "bg-krishi-deepGreen text-white border-krishi-deepGreen shadow-sm"
                      : "bg-white text-krishi-deepGreen border-krishi-border hover:border-krishi-deepGreen/60 hover:bg-krishi-primary-50/40"
                  }`}
                >
                  {s.labelMr}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
