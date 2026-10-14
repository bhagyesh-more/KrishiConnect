"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n";
import { Search, Bookmark } from "lucide-react";
import { SchemeCategory } from "./types";

interface SchemeFiltersProps {
  selectedCategory: SchemeCategory | "all";
  onSelectCategory: (category: SchemeCategory | "all") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onlySaved: boolean;
  onToggleSaved: (saved: boolean) => void;
}

export const SchemeFilters: React.FC<SchemeFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onlySaved,
  onToggleSaved,
}) => {
  const { t } = useTranslation();

  const categories: { key: SchemeCategory | "all"; labelMr: string; labelEn: string }[] = [
    { key: "all", labelMr: "सर्व योजना", labelEn: "All Schemes" },
    { key: "irrigation", labelMr: "सिंचन अनुदान", labelEn: "Irrigation" },
    { key: "subsidy", labelMr: "थेट अर्थसहाय्य", labelEn: "Subsidies" },
    { key: "insurance", labelMr: "पीक विमा", labelEn: "Crop Insurance" },
    { key: "equipment", labelMr: "कृषी यांत्रिकीकरण", labelEn: "Equipment" },
    { key: "organic", labelMr: "सेंद्रिय शेती", labelEn: "Organic" },
  ];

  return (
    <div className="space-y-3">
      {/* Search Bar & Bookmarks Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-krishi-textMuted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="शासकीय योजना, विभाग किंवा अनुदानाचा प्रकार शोधा..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-krishi-border bg-white placeholder:text-krishi-textMuted/70 focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen/30 focus:border-krishi-deepGreen transition shadow-sm"
          />
        </div>

        <button
          onClick={() => onToggleSaved(!onlySaved)}
          className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition whitespace-nowrap shadow-sm ${
            onlySaved
              ? "bg-krishi-deepGreen text-white border-krishi-deepGreen"
              : "bg-white text-krishi-deepGreen border-krishi-border hover:bg-krishi-primary-50/50"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${onlySaved ? "fill-current" : ""}`} />
          <span className="hidden sm:inline">जतन केलेल्या</span>
        </button>
      </div>

      {/* Category Pills */}
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
              {c.labelMr}
            </button>
          );
        })}
      </div>
    </div>
  );
};
