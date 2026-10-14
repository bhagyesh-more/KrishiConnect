"use client";

import React from "react";
import { Search, Bookmark, Filter, BookOpen } from "lucide-react";
import { LearningCategory, LearningContentType } from "./types";

interface LearningFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedCategory: LearningCategory | "all";
  onCategoryChange: (cat: LearningCategory | "all") => void;
  selectedContentType: LearningContentType | "all";
  onContentTypeChange: (type: LearningContentType | "all") => void;
  bookmarkedOnly: boolean;
  onToggleBookmarks: () => void;
  bookmarkedCount?: number;
}

const CATEGORIES: { label: string; value: LearningCategory | "all" }[] = [
  { label: "सर्व विषय", value: "all" },
  { label: "सिंचन तंत्रज्ञान (Irrigation)", value: "irrigation" },
  { label: "पीक संगोपन (Crop Care)", value: "crop_care" },
  { label: "सेंद्रिय शेती (Organic)", value: "organic" },
  { label: "कीड व रोग नियंत्रण (Pest & Disease)", value: "pest_disease" },
  { label: "माती आरोग्य (Soil Health)", value: "soil_health" },
  { label: "काढणीपश्चात तंत्रज्ञान (Post Harvest)", value: "post_harvest" },
];

export const LearningFilters: React.FC<LearningFiltersProps> = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedContentType,
  onContentTypeChange,
  bookmarkedOnly,
  onToggleBookmarks,
  bookmarkedCount = 0,
}) => {
  return (
    <div className="space-y-4">
      {/* Search and Bookmarks Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="मार्गदर्शक, पीक किंवा कीड शोधा (उदा. ठिबक, कांदा, जीवामृत, कापूस...)"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Content Type Selector */}
          <select
            value={selectedContentType}
            onChange={(e) => onContentTypeChange(e.target.value as LearningContentType | "all")}
            className="px-3 py-2 text-xs border border-stone-200 rounded-xl bg-white shadow-sm font-medium text-stone-700 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">सर्व प्रकार (All Types)</option>
            <option value="tutorial">कृती मार्गदर्शक (Tutorial)</option>
            <option value="guide">सल्ला मार्गदर्शिका (Guide)</option>
            <option value="best_practices">उत्कृष्ट पद्धती (Best Practices)</option>
            <option value="video_summary">व्हिडिओ सारांश (Video Summary)</option>
          </select>

          {/* Bookmarks Filter */}
          <button
            type="button"
            onClick={onToggleBookmarks}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap shadow-sm ${
              bookmarkedOnly
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarkedOnly ? "fill-white" : ""}`} />
            <span>जतन केलेले</span>
            {bookmarkedCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                  bookmarkedOnly ? "bg-emerald-800 text-white" : "bg-stone-100 text-stone-700"
                }`}
              >
                {bookmarkedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories horizontal pill list */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onCategoryChange(cat.value)}
            className={`px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat.value
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};
