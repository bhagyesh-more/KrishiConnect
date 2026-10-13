"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { MAHARASHTRA_DISTRICTS } from "@/features/auth/maharashtraDistricts";
import { CommodityCategory } from "./types";

interface MarketplaceFiltersProps {
  selectedCategory: CommodityCategory | "all";
  onSelectCategory: (category: CommodityCategory | "all") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  selectedTaluka: string;
  onSelectTaluka: (taluka: string) => void;
  sortBy: "newest" | "price_asc" | "price_desc";
  onSortChange: (sort: "newest" | "price_asc" | "price_desc") => void;
  activeTab: "browse" | "my_listings" | "my_enquiries";
  onTabChange: (tab: "browse" | "my_listings" | "my_enquiries") => void;
}

export const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedDistrict,
  onSelectDistrict,
  selectedTaluka,
  onSelectTaluka,
  sortBy,
  onSortChange,
  activeTab,
  onTabChange,
}) => {
  const { t, language } = useTranslation();

  const categories: { key: CommodityCategory | "all"; labelKey: string }[] = [
    { key: "all", labelKey: "marketplace.allCategories" },
    { key: "vegetables", labelKey: "marketplace.catVegetables" },
    { key: "fruits", labelKey: "marketplace.catFruits" },
    { key: "grains", labelKey: "marketplace.catGrains" },
    { key: "pulses", labelKey: "marketplace.catPulses" },
    { key: "spices", labelKey: "marketplace.catSpices" },
    { key: "other", labelKey: "marketplace.catOther" },
  ];

  const districtData = selectedDistrict && selectedDistrict !== "all"
    ? MAHARASHTRA_DISTRICTS[selectedDistrict]
    : null;

  return (
    <div className="space-y-4">
      {/* View Mode Tabs: Browse, My Listings, My Enquiries */}
      <div className="flex border-b border-krishi-border bg-white rounded-xl p-1 shadow-sm">
        <button
          onClick={() => onTabChange("browse")}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center ${
            activeTab === "browse"
              ? "bg-krishi-deepGreen text-white shadow-sm"
              : "text-krishi-textMuted hover:text-krishi-deepGreen hover:bg-krishi-primary-50/50"
          }`}
        >
          {t("marketplace.browseMarketplace")}
        </button>
        <button
          onClick={() => onTabChange("my_listings")}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center ${
            activeTab === "my_listings"
              ? "bg-krishi-deepGreen text-white shadow-sm"
              : "text-krishi-textMuted hover:text-krishi-deepGreen hover:bg-krishi-primary-50/50"
          }`}
        >
          {t("marketplace.myListings")}
        </button>
        <button
          onClick={() => onTabChange("my_enquiries")}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center ${
            activeTab === "my_enquiries"
              ? "bg-krishi-deepGreen text-white shadow-sm"
              : "text-krishi-textMuted hover:text-krishi-deepGreen hover:bg-krishi-primary-50/50"
          }`}
        >
          {t("marketplace.myEnquiries")}
        </button>
      </div>

      {activeTab === "browse" && (
        <>
          {/* Search bar & District/Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            {/* Search Input */}
            <div className="relative sm:col-span-6">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-krishi-textMuted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t("marketplace.searchPlaceholder")}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-krishi-border bg-white placeholder:text-krishi-textMuted/70 focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30 focus:border-krishi-deepGreen transition shadow-sm"
              />
            </div>

            {/* District Dropdown */}
            <div className="relative sm:col-span-3">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-krishi-textMuted pointer-events-none" />
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  onSelectDistrict(e.target.value);
                  onSelectTaluka("all");
                }}
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

            {/* Sort Dropdown */}
            <div className="relative sm:col-span-3">
              <SlidersHorizontal className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-krishi-textMuted pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                className="w-full pl-8 pr-7 py-2.5 text-xs sm:text-sm rounded-xl border border-krishi-border bg-white text-krishi-deepGreen focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30 appearance-none shadow-sm cursor-pointer"
              >
                <option value="newest">{t("marketplace.sortNewest")}</option>
                <option value="price_asc">{t("marketplace.sortPriceAsc")}</option>
                <option value="price_desc">{t("marketplace.sortPriceDesc")}</option>
              </select>
            </div>
          </div>

          {/* Taluka row if district is chosen */}
          {districtData && districtData.talukas.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-krishi-textMuted font-medium whitespace-nowrap">तालुका:</span>
              <button
                onClick={() => onSelectTaluka("all")}
                className={`px-2.5 py-1 rounded-lg border transition whitespace-nowrap ${
                  selectedTaluka === "all"
                    ? "bg-krishi-deepGreen text-white border-krishi-deepGreen font-semibold"
                    : "bg-white text-krishi-textMuted border-krishi-border hover:border-krishi-deepGreen"
                }`}
              >
                सर्व तालुके
              </button>
              {districtData.talukas.map((t) => (
                <button
                  key={t.nameEn}
                  onClick={() => onSelectTaluka(t.nameEn)}
                  className={`px-2.5 py-1 rounded-lg border transition whitespace-nowrap ${
                    selectedTaluka === t.nameEn
                      ? "bg-krishi-deepGreen text-white border-krishi-deepGreen font-semibold"
                      : "bg-white text-krishi-textMuted border-krishi-border hover:border-krishi-deepGreen"
                  }`}
                >
                  {language === "mr" ? t.nameMr : t.nameEn}
                </button>
              ))}
            </div>
          )}

          {/* Commodity Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            {categories.map((c) => {
              const active = selectedCategory === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => onSelectCategory(c.key)}
                  className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                    active
                      ? "bg-krishi-deepGreen text-white border-krishi-deepGreen shadow-sm"
                      : "bg-white text-krishi-deepGreen border-krishi-border hover:border-krishi-deepGreen/60 hover:bg-krishi-primary-50/40"
                  }`}
                >
                  {t(c.labelKey)}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
