"use client";

import React from "react";
import { TopicCategory } from "./types";
import {
  Search,
  X,
  Sparkles,
  Bug,
  TrendingUp,
  Wrench,
  Leaf,
  MessageSquare,
  Bookmark,
} from "lucide-react";

interface TopicFilterProps {
  selectedTopic: TopicCategory;
  onSelectTopic: (topic: TopicCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onlyBookmarked: boolean;
  onToggleBookmarked: () => void;
  postCount?: number;
}

export const TOPIC_CONFIG: Record<
  Exclude<TopicCategory, "all">,
  { labelMr: string; labelEn: string; icon: any; color: string }
> = {
  crop_care: {
    labelMr: "पीक सल्ला",
    labelEn: "Crop Care",
    icon: Sparkles,
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  pest_disease: {
    labelMr: "कीड व रोग",
    labelEn: "Pest & Disease",
    icon: Bug,
    color: "text-red-700 bg-red-50 border-red-200",
  },
  market_price: {
    labelMr: "बाजारभाव",
    labelEn: "Market Trends",
    icon: TrendingUp,
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  equipment: {
    labelMr: "यंत्रसामग्री",
    labelEn: "Equipment",
    icon: Wrench,
    color: "text-blue-700 bg-blue-50 border-blue-200",
  },
  organic: {
    labelMr: "सेंद्रिय शेती",
    labelEn: "Organic",
    icon: Leaf,
    color: "text-green-800 bg-green-50 border-green-200",
  },
  general: {
    labelMr: "सर्वसाधारण",
    labelEn: "General",
    icon: MessageSquare,
    color: "text-purple-700 bg-purple-50 border-purple-200",
  },
};

export const TopicFilter: React.FC<TopicFilterProps> = ({
  selectedTopic,
  onSelectTopic,
  searchQuery,
  onSearchChange,
  onlyBookmarked,
  onToggleBookmarked,
  postCount,
}) => {
  const topics: { id: TopicCategory; label: string }[] = [
    { id: "all", label: "सर्व चर्चा (All)" },
    { id: "pest_disease", label: "कीड व रोग (Pests)" },
    { id: "crop_care", label: "पीक सल्ला (Care)" },
    { id: "market_price", label: "बाजारभाव (Rates)" },
    { id: "organic", label: "सेंद्रिय शेती (Organic)" },
    { id: "equipment", label: "यंत्रसामग्री (Machinery)" },
    { id: "general", label: "सर्वसाधारण (General)" },
  ];

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-krishi-lightGray/60 shadow-sm">
      {/* Search Bar + Bookmarked Toggle */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-krishi-gray absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="चर्चा, पीक किंवा प्रश्न शोधा... (Search discussions, crops, pests)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 bg-krishi-warmIvory/50 border border-krishi-lightGray/60 rounded-xl text-xs sm:text-sm text-krishi-charcoal focus:outline-none focus:ring-2 focus:ring-krishi-deepGreen focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-krishi-gray hover:text-krishi-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={onToggleBookmarked}
          className={`flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition shrink-0 ${
            onlyBookmarked
              ? "bg-krishi-deepGreen text-white border-krishi-deepGreen shadow-sm"
              : "bg-krishi-warmIvory/60 text-krishi-charcoal border-krishi-lightGray/70 hover:bg-white"
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? "fill-white" : ""}`} />
          <span>जतन केलेले (Bookmarks)</span>
        </button>
      </div>

      {/* Topics Scrollable Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1">
        {topics.map((t) => {
          const isSelected = selectedTopic === t.id && !onlyBookmarked;
          return (
            <button
              key={t.id}
              onClick={() => {
                if (onlyBookmarked) onToggleBookmarked();
                onSelectTopic(t.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-krishi-deepGreen text-white border-krishi-deepGreen shadow-sm"
                  : "bg-white text-krishi-charcoal border-krishi-lightGray/60 hover:bg-krishi-warmIvory/60"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Status snippet */}
      {postCount !== undefined && (
        <div className="text-[11px] text-krishi-gray flex items-center justify-between px-1">
          <span>
            {searchQuery
              ? `"${searchQuery}" साठी शोध परिणाम`
              : onlyBookmarked
              ? "तुमचे जतन केलेले लेख"
              : "सक्रिय चर्चा"}
          </span>
          <span className="font-semibold text-krishi-deepGreen">{postCount} चर्चा उपलब्ध</span>
        </div>
      )}
    </div>
  );
};
