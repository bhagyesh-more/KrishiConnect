"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Bookmark, BookmarkCheck, CheckCircle, Sprout, Share2, AlertCircle } from "lucide-react";
import { LearningResource } from "@/features/learning/types";
import {
  getLearningResourceDetailAction,
  toggleLearningBookmarkAction,
} from "@/features/learning/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function LearningDetailPage() {
  const params = useParams();
  const idOrSlug = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [resource, setResource] = useState<LearningResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!idOrSlug) return;
    async function loadResource() {
      setLoading(true);
      const data = await getLearningResourceDetailAction(idOrSlug);
      setResource(data);
      if (data) {
        setIsBookmarked(!!data.is_bookmarked);
      }
      setLoading(false);
    }
    loadResource();
  }, [idOrSlug]);

  const handleBookmarkToggle = async () => {
    if (!resource) return;
    setIsBookmarked(!isBookmarked);
    await toggleLearningBookmarkAction(resource.id);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 space-y-4">
        <div className="h-6 w-32 bg-stone-200 animate-pulse rounded" />
        <div className="h-96 bg-stone-100 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-800">माहिती स्त्रोत आढळला नाही</h2>
        <p className="text-xs text-stone-500">शोधलेला मार्गदर्शक उपलब्ध नाही किंवा हटवला गेला असावा.</p>
        <Link href="/learning" className="inline-block text-xs font-semibold text-emerald-700 underline">
          ← ज्ञान केंद्राकडे परत जा
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/learning"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          सर्व मार्गदर्शकांकडे परत जा
        </Link>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleShare}
            className="text-xs flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? "लिंक कॉपी झाली!" : "शेअर करा"}
          </Button>
          <Button
            size="sm"
            variant={isBookmarked ? "primary" : "outline"}
            onClick={handleBookmarkToggle}
            className="text-xs flex items-center gap-1.5"
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5" />
                जतन केले आहे
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                जतन करा
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Container */}
      <article className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden p-6 sm:p-10 space-y-6">
        {/* Header Tags */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              {resource.category.replace(/_/g, " ").toUpperCase()}
            </span>
            <Badge variant="success" className="capitalize">
              {resource.difficulty} पातळी
            </Badge>
            <span className="flex items-center gap-1 text-stone-500">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {resource.estimated_read_minutes} मिनिटे वाचन
            </span>
            {resource.is_verified && (
              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50/50 px-2 py-0.5 rounded">
                <CheckCircle className="w-3.5 h-3.5" />
                सत्यापित कृषी संदर्भ
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
            {resource.title}
          </h1>

          {/* Quick Context Pill */}
          {resource.crop && (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-3 py-1 rounded-full border border-emerald-200/60">
              <Sprout className="w-4 h-4 text-emerald-600" />
              संबंधित पीक: {resource.crop}
            </div>
          )}
        </div>

        {/* Executive Summary */}
        <div className="p-4 bg-stone-50 rounded-xl border-l-4 border-emerald-600 text-stone-700 text-xs sm:text-sm leading-relaxed italic">
          <strong>सारांश:</strong> {resource.summary}
        </div>

        {/* Main Body formatted */}
        <div className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4 pt-2 border-t border-stone-100">
          {resource.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className="text-lg sm:text-xl font-bold text-emerald-950 mt-6 mb-2 border-b border-stone-100 pb-1">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className="text-base font-bold text-stone-900 mt-4 mb-1">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("> ")) {
              return (
                <div key={index} className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs sm:text-sm text-amber-900 flex items-start gap-2 my-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>{paragraph.replace("> ", "")}</div>
                </div>
              );
            }
            return (
              <p key={index} className="whitespace-pre-line leading-relaxed text-stone-700">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Source Attribution & Tags */}
        <div className="pt-6 mt-8 border-t border-stone-200 space-y-4">
          {resource.source_attribution && (
            <div className="text-xs text-stone-500">
              <strong className="text-stone-700">स्रोत व संदर्भ:</strong> {resource.source_attribution}
            </div>
          )}

          {resource.tags && resource.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-stone-500 font-medium">टॅग्ज:</span>
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-stone-100 text-stone-700 text-xs px-2.5 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
