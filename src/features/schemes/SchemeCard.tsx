"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Calendar,
  ArrowRight,
  HelpCircle,
  Building,
} from "lucide-react";
import { GovernmentScheme } from "./types";

interface SchemeCardProps {
  scheme: GovernmentScheme;
  onBookmarkToggle?: (schemeId: string) => void;
  onCheckEligibility?: (scheme: GovernmentScheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  onBookmarkToggle,
  onCheckEligibility,
}) => {
  const { language } = useTranslation();

  const title = language === "en" ? scheme.title_en : language === "hi" ? scheme.title_hi : scheme.title_mr;
  const summary = language === "en" ? scheme.summary_en : language === "hi" ? scheme.summary_hi : scheme.summary_mr;
  const benefits = language === "en" ? scheme.benefits_description_en : language === "hi" ? scheme.benefits_description_hi : scheme.benefits_description_mr;

  const categoryLabels: Record<string, string> = {
    irrigation: "सूक्ष्म सिंचन",
    subsidy: "शासकीय अनुदान",
    insurance: "पीक विमा संरक्षण",
    equipment: "कृषी यांत्रिकीकरण",
    organic: "सेंद्रिय शेती",
    credit: "पतपुरवठा",
    general: "सर्वसाधारण",
  };

  return (
    <Card className="flex flex-col justify-between overflow-hidden border border-krishi-border hover:shadow-md transition-all duration-200 bg-white group p-4 sm:p-5 space-y-4">
      <div className="space-y-3">
        {/* Top Badges & Bookmark Button */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="accent" size="sm">
              {categoryLabels[scheme.category] || scheme.category}
            </Badge>

            <span className="text-[11px] font-semibold text-krishi-earthBrown bg-krishi-primary-50 px-2 py-0.5 rounded-md border border-krishi-primary-100/80">
              {scheme.scheme_code}
            </span>
          </div>

          <button
            onClick={() => onBookmarkToggle && onBookmarkToggle(scheme.id)}
            className="p-1 text-krishi-textMuted hover:text-krishi-deepGreen rounded-lg transition"
            title="योजना जतन करा"
          >
            <Bookmark
              className={`w-4 h-4 ${scheme.is_saved ? "fill-krishi-deepGreen text-krishi-deepGreen" : ""}`}
            />
          </button>
        </div>

        {/* Title & Administering Body */}
        <div>
          <Link
            href={`/schemes/${scheme.id}`}
            className="hover:underline focus:outline-none"
          >
            <h3 className="text-base sm:text-lg font-bold text-krishi-deepGreen group-hover:text-krishi-primary-700 transition line-clamp-2">
              {title}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-krishi-textMuted mt-1">
            <Building className="w-3.5 h-3.5 text-krishi-earthBrown shrink-0" />
            <span className="truncate">{scheme.administering_body}</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-krishi-deepGreen/85 line-clamp-3 leading-relaxed">
          {summary}
        </p>

        {/* Key Benefits Highlight Box */}
        <div className="bg-krishi-primary-50/70 border border-krishi-primary-100 rounded-xl p-3 text-xs space-y-1">
          <span className="font-bold text-krishi-deepGreen block">
            मुख्य लाभ (Key Benefit):
          </span>
          <p className="text-krishi-earthBrown line-clamp-2 leading-relaxed">
            {benefits}
          </p>
        </div>

        {/* Meta verification & deadline */}
        <div className="flex items-center justify-between text-[11px] text-krishi-textMuted pt-1 border-t border-krishi-border/60">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-krishi-accentGreen" />
            <span>पडताळणी: {scheme.last_verified_date}</span>
          </div>

          {scheme.official_portal_url && (
            <a
              href={scheme.official_portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-krishi-deepGreen font-semibold hover:underline flex items-center gap-1"
            >
              <span>अधिकृत पोर्टल</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-krishi-border flex items-center gap-2">
        <Link href={`/schemes/${scheme.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
            <span>सविस्तर माहिती</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>

        {onCheckEligibility && (
          <Button
            variant="accent"
            size="sm"
            onClick={() => onCheckEligibility(scheme)}
            className="text-xs font-semibold px-3"
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1" />
            <span>पात्रता तपासा</span>
          </Button>
        )}
      </div>
    </Card>
  );
};
