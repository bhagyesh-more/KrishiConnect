"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import {
  MessageSquare,
  Plus,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  ShieldAlert,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

export default function CommunityPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/home"
              className="md:hidden text-krishi-textMuted hover:text-krishi-deepGreen p-1 -ml-1 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-extrabold text-krishi-deepGreen">
              {t("nav.community")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-krishi-textMuted">
            {t("landing.communityFeatureDesc")}
          </p>
        </div>

        <Button variant="primary" size="md" disabled className="opacity-90">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>प्रश्न विचारा (Ask Question)</span>
        </Button>
      </div>

      {/* Foundation Status Alert */}
      <Alert
        variant="info"
        title="टप्पा १: शेतकरी मंच पायाभूत मांडणी (Milestone 1 Preview)"
      >
        <span>
          टप्पा ४ मध्ये शेतकरी फोटो जोडून प्रश्न विचारू शकतील, तज्ज्ञांची उत्तरे मिळवू शकतील, आणि गैरसमज किंवा चुकीच्या सल्ल्याची तक्रार (Report Moderation) करू शकतील.
        </span>
      </Alert>

      {/* Sample Community Thread Card Preview */}
      <Card className="border-krishi-border space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-krishi-deepGreen text-krishi-warmIvory flex items-center justify-center font-bold text-sm">
              रेश
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-krishi-textMain">रमेश पाटील</span>
                <Badge variant="primary" size="sm">शेतकरी (नाशिक)</Badge>
              </div>
              <span className="text-[11px] text-krishi-textMuted">२ तासांपूर्वी • कांदा पीक</span>
            </div>
          </div>
          <Badge variant="neutral" size="sm">कीड व रोग</Badge>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-bold text-base text-krishi-deepGreen">
            कांद्याच्या पातीवर जांभळे डाग दिसत आहेत, उपाय सांगा?
          </h3>
          <p className="text-xs sm:text-sm text-krishi-textMuted leading-relaxed">
            पावसानंतर कांद्यावर करपा रोगाची लक्षणे दिसत आहेत. कोणती फवारणी फायदेशीर ठरेल? कृपया योग्य सल्ला द्या.
          </p>
        </div>

        {/* Verified Expert Answer Snippet */}
        <div className="bg-krishi-primary-50 rounded-xl p-3.5 border border-krishi-primary-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-krishi-deepGreen">डॉ. संजय देशमुख</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                <CheckCircle className="w-3 h-3" /> प्रमाणित कृषी तज्ज्ञ
              </span>
            </div>
            <span className="text-[10px] text-krishi-textMuted">१ तासापूर्वी</span>
          </div>
          <p className="text-xs text-krishi-textMain leading-relaxed">
            हा कांद्यावरील जांभळा करपा (Purple Blotch) असू शकतो. दमट हवामानात त्वरित कॉपर ऑक्झिक्लोराईड किंवा मॅन्कोझेब २.५ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारणी करा.
          </p>
        </div>

        {/* Interaction Metrics Strip */}
        <div className="pt-2 border-t border-krishi-border/60 flex items-center justify-between text-xs text-krishi-textMuted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 hover:text-krishi-deepGreen cursor-pointer">
              <ThumbsUp className="w-4 h-4" /> १२ उपयुक्त
            </span>
            <span className="flex items-center gap-1.5 hover:text-krishi-deepGreen cursor-pointer">
              <MessageCircle className="w-4 h-4" /> ४ उत्तरे
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Bookmark className="w-4 h-4 hover:text-krishi-deepGreen cursor-pointer" />
            <span title="तक्रार करा" className="cursor-pointer">
              <ShieldAlert className="w-4 h-4 hover:text-red-600" />
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
