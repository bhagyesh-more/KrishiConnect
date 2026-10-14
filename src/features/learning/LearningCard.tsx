"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Clock, Bookmark, BookmarkCheck, ArrowRight, CheckCircle, Sprout } from "lucide-react";
import { LearningResource } from "./types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface LearningCardProps {
  resource: LearningResource;
  onToggleBookmark?: (id: string) => void;
}

export const LearningCard: React.FC<LearningCardProps> = ({ resource, onToggleBookmark }) => {
  const getDifficultyBadge = (diff: LearningResource["difficulty"]) => {
    switch (diff) {
      case "beginner":
        return <Badge variant="success">प्राथमिक (Beginner)</Badge>;
      case "intermediate":
        return <Badge variant="warning">मध्यम (Medium)</Badge>;
      case "advanced":
        return <Badge variant="secondary">प्रगत (Advanced)</Badge>;
      default:
        return null;
    }
  };

  const getContentTypeName = (type: LearningResource["content_type"]) => {
    switch (type) {
      case "tutorial":
        return "कृती मार्गदर्शक (Tutorial)";
      case "guide":
        return "सल्ला मार्गदर्शिका (Guide)";
      case "best_practices":
        return "उत्कृष्ट पद्धती (Best Practices)";
      case "video_summary":
        return "व्हिडिओ सारांश (Video Summary)";
      default:
        return type;
    }
  };

  return (
    <Card className="flex flex-col justify-between border-stone-200/80 hover:shadow-md transition-shadow group">
      <div className="space-y-3.5">
        {/* Top bar: Type, difficulty, bookmark */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {getContentTypeName(resource.content_type)}
            </span>
            {getDifficultyBadge(resource.difficulty)}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleBookmark?.(resource.id);
            }}
            title={resource.is_bookmarked ? "बुकमार्क काढूण टाका" : "बुकमार्क जतन करा"}
            className="p-1 text-stone-400 hover:text-emerald-700 transition-colors"
          >
            {resource.is_bookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-emerald-700 fill-emerald-100" />
            ) : (
              <Bookmark className="w-5 h-5 hover:fill-stone-100" />
            )}
          </button>
        </div>

        {/* Title */}
        <Link
          href={`/learning/${resource.slug || resource.id}`}
          className="block font-bold text-stone-900 group-hover:text-emerald-700 transition-colors text-base leading-snug"
        >
          {resource.title}
        </Link>

        {/* Crop / Topic tag */}
        {resource.crop && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-600">
            <Sprout className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>पीक संदर्भ: <strong className="text-stone-800">{resource.crop}</strong></span>
          </div>
        )}

        {/* Summary */}
        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
          {resource.summary}
        </p>

        {/* Attribution & Read time */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            {resource.estimated_read_minutes} मिनिटे वाचन
          </span>
          {resource.is_verified && (
            <span className="flex items-center gap-0.5 text-emerald-700 font-medium">
              <CheckCircle className="w-3 h-3" />
              सत्यापित स्रोत
            </span>
          )}
        </div>
      </div>

      {/* Card Action Link */}
      <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[11px] text-stone-500 truncate max-w-[180px]">
          {resource.source_attribution?.split("-")[0] || "कृषी ज्ञान केंद्र"}
        </span>
        <Link
          href={`/learning/${resource.slug || resource.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          पूर्ण वाचा
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </Card>
  );
};
