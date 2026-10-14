"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GraduationCap, BookOpen, AlertCircle } from "lucide-react";
import { LearningResource, LearningCategory, LearningContentType } from "@/features/learning/types";
import {
  getLearningResourcesAction,
  toggleLearningBookmarkAction,
} from "@/features/learning/actions";
import { LearningFilters } from "@/features/learning/LearningFilters";
import { LearningCard } from "@/features/learning/LearningCard";

export default function LearningPage() {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<LearningCategory | "all">("all");
  const [selectedContentType, setSelectedContentType] = useState<LearningContentType | "all">("all");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    const data = await getLearningResourcesAction({
      search: search || undefined,
      category: selectedCategory === "all" ? undefined : selectedCategory,
      content_type: selectedContentType === "all" ? undefined : selectedContentType,
      bookmarkedOnly: bookmarkedOnly,
    });
    setResources(data);
    setLoading(false);
  }, [search, selectedCategory, selectedContentType, bookmarkedOnly]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleToggleBookmark = async (id: string) => {
    // Optimistic update
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_bookmarked: !r.is_bookmarked } : r))
    );
    await toggleLearningBookmarkAction(id);
  };

  const bookmarkedCount = resources.filter((r) => r.is_bookmarked).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-400/30">
            <GraduationCap className="w-3.5 h-3.5" />
            कृषी ज्ञान आणि शिक्षण केंद्र (Learning Centre)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            आधुनिक शेतीचे व्यावहारिक मार्गदर्शक
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            ठिबक सिंचन देखभाल, सेंद्रिय खते, कीड-रोग व्यवस्थापन आणि काढणीपश्चात तंत्रज्ञानावरील कृषी विद्यापीठांचे प्रमाणित लेख व कृती मार्गदर्शक.
          </p>
        </div>
      </div>

      {/* Verified sources disclaimer */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-emerald-700 flex-shrink-0" />
        <span>
          <strong>प्रमाणित माहिती:</strong> सर्व मार्गदर्शक कृषी विद्यापीठांच्या शिफारसींवर आधारित आहेत. हे मार्गदर्शक मोफत व सहज वाचता येतील अशा सुलभ मराठी भाषेत उपलब्ध आहेत.
        </span>
      </div>

      {/* Filters */}
      <LearningFilters
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedContentType={selectedContentType}
        onContentTypeChange={setSelectedContentType}
        bookmarkedOnly={bookmarkedOnly}
        onToggleBookmarks={() => setBookmarkedOnly(!bookmarkedOnly)}
        bookmarkedCount={bookmarkedCount}
      />

      {/* Content list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-xl h-64 border border-stone-200 animate-pulse p-5 space-y-3">
              <div className="h-4 bg-stone-200 rounded w-1/3" />
              <div className="h-5 bg-stone-200 rounded w-3/4" />
              <div className="h-16 bg-stone-100 rounded" />
              <div className="h-4 bg-stone-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200/80 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-semibold text-stone-700">कोणतेही मार्गदर्शक सापडले नाहीत</h3>
          <p className="text-xs text-stone-500">
            {bookmarkedOnly
              ? "आपण अजून कोणताही मार्गदर्शक बुकमार्क केलेला नाही."
              : "कृपया वेगळे शोध शब्द किंवा विषय फिल्टर निवडून पहा."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((item) => (
            <LearningCard
              key={item.id}
              resource={item}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}
