"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Sprout, Plus, Calendar, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

export default function CropsPage() {
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
              {t("nav.crops")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-krishi-textMuted">
            {t("landing.cropsFeatureDesc")}
          </p>
        </div>

        <Button variant="primary" size="md" disabled className="opacity-90">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>नवीन पीक जोडा (Add Crop)</span>
        </Button>
      </div>

      {/* Foundation Status Alert */}
      <Alert
        variant="info"
        title="टप्पा १: पीक व्यवस्थापन पायाभूत मांडणी (Milestone 1 Preview)"
      >
        <span>
          टप्पा ३ मध्ये शेतकरी थेट शेत नोंदणी, पीक पेरणी तारीख, वाढीचे टप्पे (Vegetative, Flowering, Maturity) व पाणी-खतांच्या स्वयंचलित आठवणी जोडू शकतील.
        </span>
      </Alert>

      {/* Illustrated Crop Management Blueprint Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Sample Crop Timeline Preview */}
        <Card className="border-krishi-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-krishi-primary-50 flex items-center justify-center text-krishi-deepGreen">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">सोयाबीन (JS 335)</CardTitle>
                <CardDescription>शेत १ • ५ एकर • ठिबक सिंचन</CardDescription>
              </div>
            </div>
            <Badge variant="primary" size="sm">वाढीचा टप्पा</Badge>
          </CardHeader>

          <CardContent className="space-y-3 pt-2">
            <div className="bg-krishi-ivory-100 rounded-xl p-3 border border-krishi-border space-y-2">
              <div className="flex justify-between text-xs font-semibold text-krishi-textMain">
                <span>वाढीची प्रगती (Growth Stage)</span>
                <span className="text-krishi-deepGreen">४५ दिवस (फुलोरा)</span>
              </div>
              <div className="w-full bg-krishi-ivory-200 h-2 rounded-full overflow-hidden">
                <div className="bg-krishi-deepGreen h-full rounded-full w-[45%]" />
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-krishi-textMuted">
              <div className="flex items-center gap-2 text-krishi-textMain font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>पेरणी व तणनियंत्रण पूर्ण</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>पुढील कार्य: सूक्ष्म अन्नद्रव्य फवारणी (२ दिवसांत)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Crop Care Guidance Overview */}
        <Card className="border-krishi-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">हंगामी पीक मार्गदर्शिका</CardTitle>
                <CardDescription>महाराष्ट्र कृषी विद्यापीठ प्रमाणित</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" size="sm">खरीप हंगाम</Badge>
          </CardHeader>

          <CardContent className="space-y-3 pt-2">
            <p className="text-xs text-krishi-textMuted leading-relaxed">
              सोयाबीन, कापूस, ऊस, कांदा व डाळिंब या प्रमुख पिकांचे हवामानानुसार शास्त्रीय मार्गदर्शन टप्पा ३ मध्ये उपलब्ध होईल.
            </p>
            <div className="p-3 bg-krishi-leaf-50 rounded-xl border border-krishi-leaf-200 text-xs text-krishi-primary-800">
              💡 <strong>टीप:</strong> डेटाबेस प्रमाणीकरण (Supabase Auth & RLS) पूर्ण झाल्यावर शेतकरी स्वतःच्या नोंदी जतन करू शकतील.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
